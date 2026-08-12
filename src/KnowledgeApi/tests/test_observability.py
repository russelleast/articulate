from collections.abc import Iterator
from dataclasses import dataclass, field

import grpc
import pytest
from knowledge.v1 import knowledge_pb2
from knowledge_api.domain import ProposedKnowledge
from knowledge_api.grpc_service import KnowledgeApiServicer
from knowledge_api.observability import KnowledgeApiInstrumentation
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import InMemoryMetricReader
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import SimpleSpanProcessor
from opentelemetry.sdk.trace.export.in_memory_span_exporter import InMemorySpanExporter


@dataclass
class RecordingRepository:
    captured: list[ProposedKnowledge] = field(default_factory=list)

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        self.captured.append(proposed_knowledge)


class FailingRepository:
    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        raise RuntimeError("persistence unavailable")


class AbortingContext:
    def abort(self, code: grpc.StatusCode, details: str) -> None:
        raise RpcAborted(code, details)


class RpcAborted(Exception):
    def __init__(self, code: grpc.StatusCode, details: str) -> None:
        self.code = code
        self.details = details


@dataclass
class TelemetryHarness:
    instrumentation: KnowledgeApiInstrumentation
    tracer_provider: TracerProvider
    span_exporter: InMemorySpanExporter
    meter_provider: MeterProvider
    metric_reader: InMemoryMetricReader


@pytest.fixture
def telemetry() -> Iterator[TelemetryHarness]:
    span_exporter = InMemorySpanExporter()
    tracer_provider = TracerProvider()
    tracer_provider.add_span_processor(SimpleSpanProcessor(span_exporter))
    metric_reader = InMemoryMetricReader()
    meter_provider = MeterProvider(metric_readers=[metric_reader])
    instrumentation = KnowledgeApiInstrumentation(
        tracer_provider.get_tracer("test.knowledge_api"),
        meter_provider.get_meter("test.knowledge_api"),
    )
    yield TelemetryHarness(
        instrumentation,
        tracer_provider,
        span_exporter,
        meter_provider,
        metric_reader,
    )
    meter_provider.shutdown()
    tracer_provider.shutdown()


def valid_claim() -> knowledge_pb2.Claim:
    return knowledge_pb2.Claim(
        statement="Services own their operational data.",
        evidence=knowledge_pb2.Evidence(value="ADR-0001"),
        provenance=knowledge_pb2.Provenance(source="architecture repository"),
        temporal_status=knowledge_pb2.TEMPORAL_STATUS_CURRENT,
        polarity=knowledge_pb2.POLARITY_POSITIVE,
        confidence=0.9,
    )


def metric_points(telemetry: TelemetryHarness) -> dict[str, list[object]]:
    metrics_data = telemetry.metric_reader.get_metrics_data()
    if metrics_data is None:
        return {}
    return {
        metric.name: list(metric.data.data_points)
        for resource_metrics in metrics_data.resource_metrics
        for scope_metrics in resource_metrics.scope_metrics
        for metric in scope_metrics.metrics
    }


def test_capability_spans_join_parent_trace_and_metrics_capture_dcl_observations(
    telemetry: TelemetryHarness,
) -> None:
    repository = RecordingRepository()
    service = KnowledgeApiServicer(repository, telemetry.instrumentation)
    tracer = telemetry.tracer_provider.get_tracer("test.request")

    with tracer.start_as_current_span("SubmitArchitecturalClaims"):
        response = service.SubmitArchitecturalClaims(
            knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=[valid_claim(), valid_claim()]),
            AbortingContext(),  # type: ignore[arg-type]
        )

    assert response.captured_count == 2
    spans = {span.name: span for span in telemetry.span_exporter.get_finished_spans()}
    request_span = spans["SubmitArchitecturalClaims"]
    validation_span = spans["Validate Contract"]
    capability_span = spans["Capture Proposed Knowledge"]
    persistence_spans = [
        span
        for span in telemetry.span_exporter.get_finished_spans()
        if span.name == "Persist Proposed Knowledge"
    ]

    assert validation_span.parent is not None
    assert request_span.context is not None
    assert validation_span.parent.span_id == request_span.context.span_id
    assert capability_span.parent is not None
    assert capability_span.parent.span_id == request_span.context.span_id
    assert capability_span.context is not None
    assert all(
        span.parent is not None and span.parent.span_id == capability_span.context.span_id
        for span in persistence_spans
    )
    trace_ids = set()
    for span in spans.values():
        assert span.context is not None
        trace_ids.add(span.context.trace_id)
    assert len(trace_ids) == 1
    assert capability_span.attributes is not None
    assert capability_span.attributes["capability.outcome"] == "Captured"
    assert all(
        "Services own their operational data." not in str(span.attributes)
        for span in spans.values()
    )

    points = metric_points(telemetry)
    assert set(points) == {
        "capture_proposed_knowledge_duration",
        "persist_claim_count",
    }
    assert points["capture_proposed_knowledge_duration"][0].count == 1  # type: ignore[attr-defined]
    assert points["persist_claim_count"][0].value == 2  # type: ignore[attr-defined]


def test_validation_failure_is_traced_before_capability_execution(
    telemetry: TelemetryHarness,
) -> None:
    service = KnowledgeApiServicer(RecordingRepository(), telemetry.instrumentation)

    with pytest.raises(RpcAborted):
        service.SubmitArchitecturalClaims(
            knowledge_pb2.SubmitArchitecturalClaimsRequest(),
            AbortingContext(),  # type: ignore[arg-type]
        )

    spans = telemetry.span_exporter.get_finished_spans()
    assert [span.name for span in spans] == ["Validate Contract"]
    assert spans[0].status.is_ok is False
    assert metric_points(telemetry) == {}


def test_persistence_failure_records_rejected_outcome_and_preserves_error(
    telemetry: TelemetryHarness,
) -> None:
    service = KnowledgeApiServicer(FailingRepository(), telemetry.instrumentation)

    with pytest.raises(RuntimeError, match="persistence unavailable"):
        service.SubmitArchitecturalClaims(
            knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=[valid_claim()]),
            AbortingContext(),  # type: ignore[arg-type]
        )

    spans = {span.name: span for span in telemetry.span_exporter.get_finished_spans()}
    assert spans["Persist Proposed Knowledge"].status.is_ok is False
    assert spans["Capture Proposed Knowledge"].status.is_ok is False
    capability_attributes = spans["Capture Proposed Knowledge"].attributes
    assert capability_attributes is not None
    assert capability_attributes["capability.outcome"] == "Rejected"

    points = metric_points(telemetry)
    assert points["capture_proposed_knowledge_duration"][0].count == 1  # type: ignore[attr-defined]
    assert points["rejected_count"][0].value == 1  # type: ignore[attr-defined]
    assert "persist_claim_count" not in points
