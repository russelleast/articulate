import json
from typing import Protocol

from dapr.clients import DaprClient
from opentelemetry import trace

from knowledge_api.domain import Claim


class ProposedClaimPublisher(Protocol):
    def publish(self, claim: Claim) -> None: ...


class NullProposedClaimPublisher:
    def publish(self, claim: Claim) -> None:
        del claim


def claim_payload(claim: Claim) -> dict[str, object]:
    return {
        "claimId": str(claim.claim_id),
        "statement": claim.statement,
        "evidence": claim.evidence,
        "provenance": {
            "source": claim.provenance_source,
            "activity": {
                "id": str(claim.activity.id),
                "name": claim.activity.name,
                "when": claim.activity.when.isoformat(),
                "who": claim.activity.who,
            },
        },
        "temporalStatus": claim.temporal_status.value,
        "polarity": claim.polarity.value,
        "confidence": claim.confidence,
    }


class DaprProposedClaimPublisher:
    def __init__(self, pubsub_name: str, topic_name: str) -> None:
        self._pubsub_name = pubsub_name
        self._topic_name = topic_name

    def publish(self, claim: Claim) -> None:
        with trace.get_tracer("articulate.knowledge_api").start_as_current_span(
            "Publish Proposed Claim",
            attributes={
                "effect.name": "ProposedClaimNofication",
                "claim.id": str(claim.claim_id),
                "messaging.destination.name": self._topic_name,
            },
        ) as span:
            with DaprClient() as client:
                client.publish_event(
                    pubsub_name=self._pubsub_name,
                    topic_name=self._topic_name,
                    data=json.dumps(claim_payload(claim)),
                    data_content_type="application/json",
                    metadata=(("cloudevent.subject", str(claim.claim_id)),),
                )
            span.set_attribute("effect.outcome", "Published")
