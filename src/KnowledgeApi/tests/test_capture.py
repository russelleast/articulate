from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from knowledge_api.capture import capture_proposed_knowledge
from knowledge_api.domain import Activity, Claim, Polarity, ProposedKnowledge, TemporalStatus


@dataclass
class Repository:
    captured: list[ProposedKnowledge] = field(default_factory=list)
    fail: bool = False

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        if self.fail:
            raise RuntimeError("persistence unavailable")
        self.captured.append(proposed_knowledge)


@dataclass
class Publisher:
    published: list[Claim] = field(default_factory=list)

    def publish(self, claim: Claim) -> None:
        self.published.append(claim)


def claim() -> Claim:
    return Claim(
        claim_id=uuid4(),
        statement="The Orders API publishes OrderCreated events.",
        evidence="event contract",
        provenance_source="test",
        activity=Activity(uuid4(), "SolutionDesign", datetime.now(UTC), "architect"),
        temporal_status=TemporalStatus.CURRENT,
        polarity=Polarity.POSITIVE,
        confidence=0.9,
    )


def test_successful_capture_publishes_complete_claim_after_persistence() -> None:
    repository = Repository()
    publisher = Publisher()
    submitted = claim()

    assert capture_proposed_knowledge([submitted], repository, publisher) == 1
    assert repository.captured[0].claim == submitted
    assert publisher.published == [submitted]


def test_failed_persistence_does_not_publish() -> None:
    publisher = Publisher()
    with pytest.raises(RuntimeError, match="persistence unavailable"):
        capture_proposed_knowledge([claim()], Repository(fail=True), publisher)
    assert publisher.published == []
