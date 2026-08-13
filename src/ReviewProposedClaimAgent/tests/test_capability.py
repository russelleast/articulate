from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from review_agent.capability import ReviewProposedClaim
from review_agent.domain import ClaimInput, ModelReview, ReviewResult, ReviewStatus


@dataclass
class Reviewer:
    response: ModelReview | None = None
    error: Exception | None = None

    def review(self, claim: ClaimInput) -> ModelReview:
        del claim
        if self.error is not None:
            raise self.error
        assert self.response is not None
        return self.response


@dataclass
class Recorder:
    results: list[ReviewResult] = field(default_factory=list)
    fail: bool = False

    def record(self, result: ReviewResult) -> None:
        if self.fail:
            raise RuntimeError("recording unavailable")
        self.results.append(result)


@dataclass
class Publisher:
    results: list[ReviewResult] = field(default_factory=list)

    def publish(self, claim: ClaimInput, result: ReviewResult) -> None:
        del claim
        self.results.append(result)


def claim(statement: str = "The SQL servers are clustered.") -> ClaimInput:
    return ClaimInput.model_validate(
        {
            "claimId": str(uuid4()),
            "statement": statement,
            "evidence": "discovery",
            "provenance": {
                "source": "test",
                "activity": {
                    "id": str(uuid4()),
                    "name": "Discovery",
                    "when": datetime.now(UTC).isoformat(),
                    "who": "architect",
                },
            },
            "temporalStatus": "Current",
            "polarity": "Positive",
            "confidence": 0.9,
        }
    )


def capability(
    response: ModelReview, recorder: Recorder | None = None, publisher: Publisher | None = None
) -> tuple[ReviewProposedClaim, Recorder, Publisher]:
    recorder = recorder or Recorder()
    publisher = publisher or Publisher()
    return ReviewProposedClaim(Reviewer(response), recorder, publisher, 0.6), recorder, publisher


def test_architectural_assertion_is_ready_recorded_and_progressed() -> None:
    review, recorder, publisher = capability(
        ModelReview(status=ReviewStatus.READY, confidence=0.92)
    )

    result = review.execute(claim())

    assert result.status is ReviewStatus.READY
    assert recorder.results == [result]
    assert publisher.results == [result]


def test_irrelevant_assertion_is_not_ready_and_not_progressed() -> None:
    review, recorder, publisher = capability(
        ModelReview(status=ReviewStatus.NOT_READY, confidence=0.95)
    )

    result = review.execute(claim("I wear thick jumpers when it is cold."))

    assert result.status is ReviewStatus.NOT_READY
    assert recorder.results == [result]
    assert publisher.results == []


def test_low_confidence_ready_response_is_governed_to_not_ready() -> None:
    review, _, publisher = capability(ModelReview(status=ReviewStatus.READY, confidence=0.59))

    result = review.execute(claim())

    assert result.status is ReviewStatus.NOT_READY
    assert publisher.results == []


def test_recording_failure_is_an_execution_failure_and_does_not_progress() -> None:
    review, _, publisher = capability(
        ModelReview(status=ReviewStatus.READY, confidence=0.9), Recorder(fail=True)
    )

    with pytest.raises(RuntimeError, match="recording unavailable"):
        review.execute(claim())
    assert publisher.results == []


def test_invalid_model_result_is_rejected_as_execution_failure() -> None:
    with pytest.raises(ValueError):
        ModelReview.model_validate({"status": "Ready", "confidence": 1.2})
