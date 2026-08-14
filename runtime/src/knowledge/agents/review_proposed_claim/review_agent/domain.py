from datetime import datetime
from enum import StrEnum
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ReviewStatus(StrEnum):
    READY = "Ready"
    NOT_READY = "NotReady"


class ActivityInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    id: UUID
    name: str = Field(min_length=1)
    when: datetime
    who: str = Field(min_length=1)


class ProvenanceInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    source: str = Field(min_length=1)
    activity: ActivityInput


class ClaimInput(BaseModel):
    model_config = ConfigDict(extra="forbid")
    claim_id: UUID = Field(alias="claimId")
    statement: str = Field(min_length=1)
    evidence: str | None = None
    provenance: ProvenanceInput
    temporal_status: str = Field(alias="temporalStatus", min_length=1)
    polarity: str = Field(min_length=1)
    confidence: float = Field(ge=0, le=1)


class ModelReview(BaseModel):
    model_config = ConfigDict(extra="forbid")
    status: ReviewStatus
    confidence: float = Field(ge=0, le=1)


class ReviewResult(BaseModel):
    claim_id: UUID
    status: ReviewStatus
    confidence: float = Field(ge=0, le=1)
