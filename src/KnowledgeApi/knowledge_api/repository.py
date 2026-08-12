from typing import Protocol

from pymongo.collection import Collection

from knowledge_api.domain import ProposedKnowledge


class ProposedKnowledgeRepository(Protocol):
    def add(self, proposed_knowledge: ProposedKnowledge) -> None: ...


class MongoProposedKnowledgeRepository:
    def __init__(self, collection: Collection[dict[str, object]]) -> None:
        self._collection = collection

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        claim = proposed_knowledge.claim

        document: dict[str, object] = {
            "_id": str(proposed_knowledge.id),
            "capturedAt": proposed_knowledge.captured_at,
            "claim": {
                "statement": claim.statement,
                "evidence": claim.evidence,
                "provenance": {"source": claim.provenance_source},
                "temporalStatus": claim.temporal_status.value,
                "polarity": claim.polarity.value,
                "confidence": claim.confidence,
            },
        }

        self._collection.insert_one(document)
