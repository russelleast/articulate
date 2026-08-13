from pathlib import Path

from dapr_agents.llm.dapr import DaprChatClient
from opentelemetry import trace

from review_agent.domain import ClaimInput, ModelReview


class DaprPromptyClaimReviewer:
    def __init__(self, prompty_path: Path, component_name: str) -> None:
        self._client = DaprChatClient.from_prompty(prompty_path)
        # Dapr Agents 1.0.5 includes response_format=None in Prompty parameter dumps,
        # which collides with the explicit structured schema. The rendered Prompty
        # template remains attached; only its duplicate request defaults are removed.
        self._client.prompty = None
        self._component_name = component_name

    def review(self, claim: ClaimInput) -> ModelReview:
        with trace.get_tracer("articulate.review_proposed_claim").start_as_current_span(
            "Dapr Conversation",
            attributes={
                "capability.name": "ReviewProposedClaim",
                "claim.id": str(claim.claim_id),
                "conversation.component": self._component_name,
            },
        ):
            response = self._client.generate(
                input_data={"statement": claim.statement},
                llm_component=self._component_name,
                response_format=ModelReview,
                structured_mode="json",
                temperature=0.1,
            )
        if not isinstance(response, ModelReview):
            raise ValueError("Conversation returned an invalid structured review")
        return response
