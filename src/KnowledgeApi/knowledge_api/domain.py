from dataclasses import dataclass
from datetime import UTC, datetime
from enum import StrEnum
from uuid import UUID, uuid4


class TemporalStatus(StrEnum):
    HISTORICAL = "Historical"
    CURRENT = "Current"
    EMERGING = "Emerging"
    FUTURE_INTENT = "FutureIntent"
    UNKNOWN = "Unknown"


class Polarity(StrEnum):
    POSITIVE = "Positive"
    NEGATIVE = "Negative"


@dataclass(frozen=True)
class Claim:
    statement: str
    provenance_source: str
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
        return cls(id=uuid4(), claim=claim, captured_at=datetime.now(UTC))
