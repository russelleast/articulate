from typing import Protocol

from review_agent.domain import ClaimInput, ModelReview, ReviewResult, ReviewStatus


class ClaimReviewer(Protocol):
    def review(self, claim: ClaimInput) -> ModelReview: ...


class ReviewResultRecorder(Protocol):
    def record(self, result: ReviewResult) -> None: ...


class ReadyClaimPublisher(Protocol):
    def publish(self, claim: ClaimInput, result: ReviewResult) -> None: ...


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

    def execute(self, claim: ClaimInput) -> ReviewResult:
        model_review = self._reviewer.review(claim)
        status = model_review.status

        if model_review.confidence < self._minimum_confidence:
            status = ReviewStatus.NOT_READY

        result = ReviewResult(
            claim_id=claim.claim_id,
            status=status,
            confidence=model_review.confidence,
        )

        self._recorder.record(result)

        if result.status is ReviewStatus.READY:
            self._ready_publisher.publish(claim, result)

        return result

    @property
    def minimum_confidence(self) -> float:
        return self._minimum_confidence
