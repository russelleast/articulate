import asyncio
from dataclasses import dataclass
from uuid import uuid4

import pytest
from knowledge_api.domain import ReviewProposedClaimResult, ReviewStatus
from knowledge_api.repository import (
    MongoProposedKnowledgeReviewRepository,
    ProposedClaimNotFoundError,
)


@dataclass
class UpdateResult:
    matched_count: int


class Collection:
    def __init__(self, matched_count: int = 1, error: Exception | None = None) -> None:
        self.matched_count = matched_count
        self.error = error
        self.calls: list[tuple[dict[str, object], dict[str, object]]] = []

    async def update_one(
        self, filter: dict[str, object], update: dict[str, object]
    ) -> UpdateResult:
        if self.error is not None:
            raise self.error
        self.calls.append((filter, update))
        return UpdateResult(self.matched_count)


def result(status: ReviewStatus = ReviewStatus.READY) -> ReviewProposedClaimResult:
    return ReviewProposedClaimResult.create(uuid4(), status, 0.91)


@pytest.mark.parametrize("status", [ReviewStatus.READY, ReviewStatus.NOT_READY])
def test_review_updates_only_review_fields(status: ReviewStatus) -> None:
    collection = Collection()
    review = result(status)

    asyncio.run(MongoProposedKnowledgeReviewRepository(collection).record(review))

    assert collection.calls == [
        (
            {"_id": str(review.claim_id)},
            {
                "$set": {
                    "claim.reviewStatus": status.value,
                    "claim.reviewConfidence": 0.91,
                }
            },
        )
    ]


def test_duplicate_identical_review_is_idempotent() -> None:
    collection = Collection()
    review = result()
    repository = MongoProposedKnowledgeReviewRepository(collection)

    asyncio.run(repository.record(review))
    asyncio.run(repository.record(review))

    assert collection.calls[0] == collection.calls[1]


def test_unknown_claim_is_an_explicit_failure() -> None:
    repository = MongoProposedKnowledgeReviewRepository(Collection(matched_count=0))

    with pytest.raises(ProposedClaimNotFoundError, match="was not found"):
        asyncio.run(repository.record(result()))


def test_database_error_is_surfaced() -> None:
    repository = MongoProposedKnowledgeReviewRepository(
        Collection(error=RuntimeError("database unavailable"))
    )

    with pytest.raises(RuntimeError, match="database unavailable"):
        asyncio.run(repository.record(result()))
