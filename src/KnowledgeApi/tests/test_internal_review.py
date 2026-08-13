from dataclasses import dataclass, field
from uuid import uuid4

from knowledge_api.domain import ReviewProposedClaimResult, ReviewStatus
from knowledge_api.runtime import InternalReviewResultRecorder
from review_agent.domain import ReviewResult
from review_agent.domain import ReviewStatus as AgentReviewStatus


@dataclass
class RecordingReviewRepository:
    results: list[ReviewProposedClaimResult] = field(default_factory=list)

    def record(self, result: ReviewProposedClaimResult) -> None:
        self.results.append(result)


def test_internal_agent_records_without_a_transport_endpoint() -> None:
    repository = RecordingReviewRepository()
    recorder = InternalReviewResultRecorder(repository)
    claim_id = uuid4()

    recorder.record(
        ReviewResult(
            claim_id=claim_id,
            status=AgentReviewStatus.READY,
            confidence=0.91,
        )
    )

    assert len(repository.results) == 1
    assert repository.results[0].claim_id == claim_id
    assert repository.results[0].status is ReviewStatus.READY
    assert repository.results[0].confidence == 0.91
