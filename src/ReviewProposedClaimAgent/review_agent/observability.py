import os
from collections.abc import Iterator
from contextlib import contextmanager
from time import perf_counter

from opentelemetry import metrics, trace
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.metrics import Counter, Histogram
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor

from review_agent.domain import ReviewResult


class ReviewInstrumentation:
    def __init__(self) -> None:
        meter = metrics.get_meter("articulate.review_proposed_claim")
        self.tracer = trace.get_tracer("articulate.review_proposed_claim")
        self.duration: Histogram = meter.create_histogram(
            "review_proposed_claim_duration", unit="s"
        )
        self.ready: Counter = meter.create_counter("ready_count")
        self.not_ready: Counter = meter.create_counter("not_ready_count")
        self.failed: Counter = meter.create_counter("failed_count")

    @contextmanager
    def review(self, claim_id: str, threshold: float) -> Iterator[dict[str, object]]:
        started = perf_counter()
        outcome: dict[str, object] = {"name": "Failed"}
        attributes = {"capability.name": "ReviewProposedClaim", "claim.id": claim_id}
        with self.tracer.start_as_current_span(
            "Review Proposed Claim", attributes=attributes
        ) as span:
            try:
                yield outcome
            except Exception:
                self.failed.add(1, attributes)
                raise
            finally:
                name = str(outcome["name"])
                span.set_attribute("capability.outcome", name)
                span.set_attribute("policy.name", "MinimumAnswerConfidence")
                span.set_attribute("policy.threshold", threshold)
                if "confidence" in outcome:
                    raw_confidence = outcome["confidence"]
                    if not isinstance(raw_confidence, int | float):
                        raise TypeError("policy confidence must be numeric")
                    confidence = float(raw_confidence)
                    span.set_attribute("policy.confidence", confidence)
                    span.set_attribute("policy.passed", confidence >= threshold)
                self.duration.record(perf_counter() - started, {**attributes, "outcome": name})
                if name == "Ready":
                    self.ready.add(1, attributes)
                elif name == "NotReady":
                    self.not_ready.add(1, attributes)

    @staticmethod
    def complete(outcome: dict[str, object], result: ReviewResult) -> None:
        outcome["name"] = result.status.value
        outcome["confidence"] = result.confidence


def configure_observability() -> tuple[TracerProvider, MeterProvider]:
    resource = Resource.create(
        {SERVICE_NAME: os.getenv("OTEL_SERVICE_NAME", "ReviewProposedClaimAgent")}
    )
    tracer_provider = TracerProvider(resource=resource)
    tracer_provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter()))
    trace.set_tracer_provider(tracer_provider)
    meter_provider = MeterProvider(
        resource=resource,
        metric_readers=[PeriodicExportingMetricReader(OTLPMetricExporter())],
    )
    metrics.set_meter_provider(meter_provider)
    return tracer_provider, meter_provider
