from typing import Any, Protocol

from opentelemetry import trace
from pymongo.collection import Collection

from knowledge_api.domain import ProposedKnowledge, ReviewProposedClaimResult


class ProposedKnowledgeRepository(Protocol):
    def add(self, proposed_knowledge: ProposedKnowledge) -> None: ...


class ReviewResultRepository(Protocol):
    async def record(self, result: ReviewProposedClaimResult) -> None: ...


class ProposedClaimNotFoundError(LookupError):
    pass


class AsyncReviewCollection(Protocol):
    def update_one(self, filter: dict[str, object], update: dict[str, object]) -> Any: ...


class MongoProposedKnowledgeRepository:
    def __init__(self, collection: Collection[dict[str, object]]) -> None:
        self._collection = collection

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        claim = proposed_knowledge.claim

        document: dict[str, object] = {
            "_id": str(proposed_knowledge.id),
            "capturedAt": proposed_knowledge.captured_at,
            "claim": {
                "claimId": str(claim.claim_id),
                "statement": claim.statement,
                "evidence": claim.evidence,
                "provenance": {
                    "source": claim.provenance_source,
                    "activity": {
                        "id": str(claim.activity.id),
                        "name": claim.activity.name,
                        "when": claim.activity.when,
                        "who": claim.activity.who,
                    },
                },
                "temporalStatus": claim.temporal_status.value,
                "polarity": claim.polarity.value,
                "confidence": claim.confidence,
            },
        }

        self._collection.insert_one(document)


class MongoProposedKnowledgeReviewRepository:
    def __init__(self, collection: AsyncReviewCollection) -> None:
        self._collection = collection

    async def record(self, result: ReviewProposedClaimResult) -> None:
        with trace.get_tracer("articulate.knowledge_api").start_as_current_span(
            "Update Proposed Claim Review",
            attributes={"claim.id": str(result.claim_id)},
        ) as span:
            update = await self._collection.update_one(
                {"_id": str(result.claim_id)},
                {
                    "$set": {
                        "claim.reviewStatus": result.status.value,
                        "claim.reviewConfidence": result.confidence,
                    }
                },
            )
            span.set_attribute("db.operation.name", "update")
            span.set_attribute("db.collection.name", "proposed-knowledge")
        if update.matched_count == 0:
            raise ProposedClaimNotFoundError(f"proposed claim {result.claim_id} was not found")
