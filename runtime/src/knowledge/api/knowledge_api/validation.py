from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

from knowledge_api.domain import Activity, Claim, Polarity, TemporalStatus


class EvidenceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    value: str = Field(min_length=1)


class ProvenanceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    source: str = Field(min_length=1)
    activity: "ActivityInput"


class ActivityInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: UUID
    name: str = Field(min_length=1)
    when: datetime
    who: str = Field(min_length=1)


class ClaimInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    claim_id: UUID
    statement: str = Field(min_length=1)
    evidence: EvidenceInput | None = None
    provenance: ProvenanceInput
    temporal_status: TemporalStatus
    polarity: Polarity
    confidence: float = Field(ge=0, le=1)

    def to_domain(self) -> Claim:
        return Claim(
            claim_id=self.claim_id,
            statement=self.statement,
            evidence=self.evidence.value if self.evidence else None,
            provenance_source=self.provenance.source,
            activity=Activity(
                id=self.provenance.activity.id,
                name=self.provenance.activity.name,
                when=self.provenance.activity.when,
                who=self.provenance.activity.who,
            ),
            temporal_status=self.temporal_status,
            polarity=self.polarity,
            confidence=self.confidence,
        )
