import json

from dapr.clients import DaprClient
from opentelemetry import trace

from review_agent.domain import ClaimInput, ReviewResult


class DaprReadyClaimPublisher:
    def __init__(self, pubsub_name: str, topic_name: str) -> None:
        self._pubsub_name = pubsub_name
        self._topic_name = topic_name

    def publish(self, claim: ClaimInput, result: ReviewResult) -> None:
        data = claim.model_dump(mode="json", by_alias=True)
        data["review"] = result.model_dump(mode="json")
        
        with (
            trace.get_tracer("articulate.review_proposed_claim").start_as_current_span(
                "Publish Ready Claim",
                attributes={
                    "claim.id": str(claim.claim_id),
                    "messaging.destination.name": self._topic_name,
                },
            ),
            DaprClient() as client,
        ):
            client.publish_event(
                pubsub_name=self._pubsub_name,
                topic_name=self._topic_name,
                data=json.dumps(data),
                data_content_type="application/json",
                metadata=(("cloudevent.subject", str(claim.claim_id)),),
            )


class AgentExecutionState:
    def __init__(self, store_name: str) -> None:
        self._store_name = store_name

    def completed(self, claim_id: str) -> bool:
        with DaprClient() as client:
            state = client.get_state(self._store_name, claim_id)
            return bool(state.data)

    def mark_completed(self, result: ReviewResult) -> None:
        with DaprClient() as client:
            client.save_state(
                self._store_name,
                str(result.claim_id),
                json.dumps(result.model_dump(mode="json")),
            )
