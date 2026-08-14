import os
from time import perf_counter
from types import TracebackType
from typing import Self

from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.grpc import GrpcInstrumentorServer
from opentelemetry.metrics import Counter, Histogram, Meter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.trace import Span, Tracer

from knowledge_api.domain import ProposedKnowledge
from knowledge_api.repository import ProposedKnowledgeRepository

INSTRUMENTATION_SCOPE = "articulate.knowledge_api"
CAPABILITY_NAME = "Capture Proposed Knowledge"
PERSIST_EFFECT_NAME = "PersistClaim"


class KnowledgeApiInstrumentation:
    def __init__(self, tracer: Tracer | None = None, meter: Meter | None = None) -> None:
        self.tracer = tracer or trace.get_tracer(INSTRUMENTATION_SCOPE)
        meter = meter or metrics.get_meter(INSTRUMENTATION_SCOPE)
        self.capture_duration: Histogram = meter.create_histogram(
            "capture_proposed_knowledge_duration",
            unit="s",
            description="Duration of Capture Proposed Knowledge capability execution",
        )
        self.persist_count: Counter = meter.create_counter(
            "persist_claim_count",
            description="Number of successfully completed PersistClaim effects",
        )
        self.rejected_count: Counter = meter.create_counter(
            "rejected_count",
            description="Number of Capture Proposed Knowledge rejected outcomes",
        )

    def capture_timer(self) -> "CapabilityTimer":
        return CapabilityTimer(self)


class CapabilityTimer:
    def __init__(self, instrumentation: KnowledgeApiInstrumentation) -> None:
        self._instrumentation = instrumentation
        self._started_at = 0.0
        self._span_context = None
        self.span: Span | None = None
        self.outcome = "Rejected"

    def __enter__(self) -> Self:
        self._started_at = perf_counter()
        self._span_context = self._instrumentation.tracer.start_as_current_span(CAPABILITY_NAME)
        self.span = self._span_context.__enter__()
        self.span.set_attribute("capability.name", CAPABILITY_NAME)
        return self

    def captured(self, captured_count: int) -> None:
        self.outcome = "Captured"
        if self.span is not None:
            self.span.set_attribute("capability.outcome", self.outcome)
            self.span.set_attribute("claims.captured_count", captured_count)

    def __exit__(
        self,
        exception_type: type[BaseException] | None,
        exception: BaseException | None,
        traceback: TracebackType | None,
    ) -> bool | None:
        if self.span is not None and self.outcome == "Rejected":
            self.span.set_attribute("capability.outcome", self.outcome)
        attributes = {"capability.name": CAPABILITY_NAME, "outcome": self.outcome}
        self._instrumentation.capture_duration.record(perf_counter() - self._started_at, attributes)
        if self.outcome == "Rejected":
            self._instrumentation.rejected_count.add(1, attributes)
        if self._span_context is None:
            return None
        return self._span_context.__exit__(exception_type, exception, traceback)


class InstrumentedProposedKnowledgeRepository:
    def __init__(
        self,
        repository: ProposedKnowledgeRepository,
        instrumentation: KnowledgeApiInstrumentation,
    ) -> None:
        self._repository = repository
        self._instrumentation = instrumentation

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        attributes = {
            "capability.name": CAPABILITY_NAME,
            "effect.name": PERSIST_EFFECT_NAME,
            "proposal.id": str(proposed_knowledge.id),
        }
        with self._instrumentation.tracer.start_as_current_span(
            "Persist Proposed Knowledge", attributes=attributes
        ) as span:
            self._repository.add(proposed_knowledge)
            span.set_attribute("effect.outcome", "Persisted")
            self._instrumentation.persist_count.add(
                1,
                {"capability.name": CAPABILITY_NAME, "effect.name": PERSIST_EFFECT_NAME},
            )


class ObservabilityRuntime:
    def __init__(self, tracer_provider: TracerProvider, meter_provider: MeterProvider) -> None:
        self._tracer_provider = tracer_provider
        self._meter_provider = meter_provider

    def shutdown(self) -> None:
        self._meter_provider.shutdown()
        self._tracer_provider.shutdown()


def configure_observability() -> ObservabilityRuntime:
    resource = Resource.create({SERVICE_NAME: os.getenv("OTEL_SERVICE_NAME", "KnowledgeApi")})

    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    trace.set_tracer_provider(tracer_provider)

    metric_reader = PeriodicExportingMetricReader(OTLPMetricExporter())
    meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
    metrics.set_meter_provider(meter_provider)

    GrpcInstrumentorServer().instrument()
    return ObservabilityRuntime(tracer_provider, meter_provider)
