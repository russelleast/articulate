from typing import Protocol

from pymongo.collection import Collection

from knowledge_api.domain import ProposedKnowledge, ReviewProposedClaimResult


class ProposedKnowledgeRepository(Protocol):
    def add(self, proposed_knowledge: ProposedKnowledge) -> None: ...


class ReviewResultRepository(Protocol):
    def record(self, result: ReviewProposedClaimResult) -> None: ...


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


class MongoReviewResultRepository:
    def __init__(self, collection: Collection[dict[str, object]]) -> None:
        self._collection = collection

    def record(self, result: ReviewProposedClaimResult) -> None:
        self._collection.update_one(
            {"_id": str(result.claim_id)},
            {
                "$set": {
                    "claimId": str(result.claim_id),
                    "status": result.status.value,
                    "confidence": result.confidence,
                    "recordedAt": result.recorded_at,
                }
            },
            upsert=True,
        )
