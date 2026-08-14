import logging
import os

from fastapi import FastAPI, HTTPException, Response, status
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from pydantic import BaseModel, ConfigDict

from review_agent.adapters import (
    AgentExecutionState,
)
from review_agent.capability import ReviewProposedClaim
from review_agent.domain import ClaimInput
from review_agent.observability import ReviewInstrumentation

logger = logging.getLogger(__name__)


class CloudEvent(BaseModel):
    model_config = ConfigDict(extra="allow")
    data: ClaimInput


def create_app(
    capability: ReviewProposedClaim | None = None,
    execution_state: AgentExecutionState | None = None,
    instrumentation: ReviewInstrumentation | None = None,
) -> FastAPI:
    if capability is None:
        raise ValueError("the internal KnowledgeApi review capability is required")

    execution_state = execution_state or AgentExecutionState(
        os.getenv("AGENT_STATE_STORE", "review-agent-execution-state")
    )

    instrumentation = instrumentation or ReviewInstrumentation()
    app = FastAPI(title="ReviewProposedClaim Agent")
    FastAPIInstrumentor.instrument_app(app)

    @app.get("/healthz")
    def health() -> dict[str, str]:
        return {"status": "ready"}

    @app.post("/review-proposed-claim")
    async def review_claim(event: CloudEvent) -> Response:
        claim = event.data
        try:
            if await execution_state.completed(str(claim.claim_id)):
                return Response(status_code=status.HTTP_204_NO_CONTENT)
            with instrumentation.review(
                str(claim.claim_id), capability.minimum_confidence
            ) as outcome:
                result = await capability.execute(claim)
                await execution_state.mark_completed(result)
                instrumentation.complete(outcome, result)
        except Exception as error:
            logger.exception("ReviewProposedClaim failed for claim %s", claim.claim_id)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="ReviewProposedClaim execution failed",
            ) from error
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    return app
