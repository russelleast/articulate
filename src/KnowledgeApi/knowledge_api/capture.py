from collections.abc import Iterable

from knowledge_api.domain import Claim, ProposedKnowledge
from knowledge_api.repository import ProposedKnowledgeRepository


def capture_proposed_knowledge(
    claims: Iterable[Claim], repository: ProposedKnowledgeRepository
) -> int:
    captured_count = 0

    for claim in claims:
        repository.add(ProposedKnowledge.from_claim(claim))
        captured_count += 1

    return captured_count
