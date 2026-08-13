from collections.abc import Iterable

from knowledge_api.domain import Claim, ProposedKnowledge
from knowledge_api.messaging import ProposedClaimPublisher
from knowledge_api.repository import ProposedKnowledgeRepository


def capture_proposed_knowledge(
    claims: Iterable[Claim],
    repository: ProposedKnowledgeRepository,
    publisher: ProposedClaimPublisher,
) -> int:
    captured_count = 0

    for claim in claims:
        repository.add(ProposedKnowledge.from_claim(claim))
        publisher.publish(claim)
        captured_count += 1

    return captured_count
