from typing import Protocol
from uuid import UUID

from review_agent.domain import ClaimInput, ModelReview, ReviewResult, ReviewStatus


class ClaimReviewer(Protocol):
    async def review(self, claim: ClaimInput) -> ModelReview: ...


class ReviewResultRecorder(Protocol):
    async def record(self, result: ReviewResult) -> None: ...


class ReadyClaimPublisher(Protocol):
    async def publish(self, claim: ClaimInput, result: ReviewResult) -> None: ...


def build_review_result(
    claim_id: UUID, model_review: ModelReview, minimum_confidence: float
) -> ReviewResult:
    status = model_review.status
    if model_review.confidence < minimum_confidence:
        status = ReviewStatus.NOT_READY

    return ReviewResult(
        claim_id=claim_id,
        status=status,
        confidence=model_review.confidence,
    )


class ReviewProposedClaim:
    def __init__(
        self,
        reviewer: ClaimReviewer,
        recorder: ReviewResultRecorder,
        ready_publisher: ReadyClaimPublisher,
        minimum_confidence: float,
    ) -> None:
        self._reviewer = reviewer
        self._recorder = recorder
        self._ready_publisher = ready_publisher
        self._minimum_confidence = minimum_confidence

    async def execute(self, claim: ClaimInput) -> ReviewResult:
        model_review = await self._reviewer.review(claim)
        result = build_review_result(claim.claim_id, model_review, self._minimum_confidence)

        await self._recorder.record(result)

        if result.status is ReviewStatus.READY:
            await self._ready_publisher.publish(claim, result)

        return result

    @property
    def minimum_confidence(self) -> float:
        return self._minimum_confidence
