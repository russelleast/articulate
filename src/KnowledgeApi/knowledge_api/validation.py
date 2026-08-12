from pydantic import BaseModel, ConfigDict, Field

from knowledge_api.domain import Claim, Polarity, TemporalStatus


class EvidenceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    value: str = Field(min_length=1)


class ProvenanceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    source: str = Field(min_length=1)


class ClaimInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    statement: str = Field(min_length=1)
    evidence: EvidenceInput | None = None
    provenance: ProvenanceInput
    temporal_status: TemporalStatus
    polarity: Polarity
    confidence: float = Field(ge=0, le=1)

    def to_domain(self) -> Claim:
        return Claim(
            statement=self.statement,
            evidence=self.evidence.value if self.evidence else None,
            provenance_source=self.provenance.source,
            temporal_status=self.temporal_status,
            polarity=self.polarity,
            confidence=self.confidence,
        )
