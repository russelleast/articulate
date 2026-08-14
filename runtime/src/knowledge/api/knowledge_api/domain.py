from dataclasses import dataclass
from datetime import UTC, datetime
from enum import StrEnum
from uuid import UUID


class TemporalStatus(StrEnum):
    HISTORICAL = "Historical"
    CURRENT = "Current"
    EMERGING = "Emerging"
    FUTURE_INTENT = "FutureIntent"
    UNKNOWN = "Unknown"


class Polarity(StrEnum):
    POSITIVE = "Positive"
    NEGATIVE = "Negative"


class ReviewStatus(StrEnum):
    READY = "Ready"
    NOT_READY = "NotReady"


@dataclass(frozen=True)
class Activity:
    id: UUID
    name: str
    when: datetime
    who: str


@dataclass(frozen=True)
class Claim:
    claim_id: UUID
    statement: str
    provenance_source: str
    activity: Activity
    temporal_status: TemporalStatus
    polarity: Polarity
    confidence: float
    evidence: str | None = None


@dataclass(frozen=True)
class ProposedKnowledge:
    id: UUID
    claim: Claim
    captured_at: datetime

    @classmethod
    def from_claim(cls, claim: Claim) -> "ProposedKnowledge":
        return cls(id=claim.claim_id, claim=claim, captured_at=datetime.now(UTC))


@dataclass(frozen=True)
class ReviewProposedClaimResult:
    claim_id: UUID
    status: ReviewStatus
    confidence: float

    @classmethod
    def create(
        cls, claim_id: UUID, status: ReviewStatus, confidence: float
    ) -> "ReviewProposedClaimResult":
        return cls(claim_id=claim_id, status=status, confidence=confidence)
