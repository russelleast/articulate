from google.protobuf.internal import containers as _containers
from google.protobuf.internal import enum_type_wrapper as _enum_type_wrapper
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from collections.abc import Iterable as _Iterable, Mapping as _Mapping
from typing import ClassVar as _ClassVar, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class TemporalStatus(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    TEMPORAL_STATUS_UNSPECIFIED: _ClassVar[TemporalStatus]
    TEMPORAL_STATUS_HISTORICAL: _ClassVar[TemporalStatus]
    TEMPORAL_STATUS_CURRENT: _ClassVar[TemporalStatus]
    TEMPORAL_STATUS_EMERGING: _ClassVar[TemporalStatus]
    TEMPORAL_STATUS_FUTURE_INTENT: _ClassVar[TemporalStatus]
    TEMPORAL_STATUS_UNKNOWN: _ClassVar[TemporalStatus]

class Polarity(int, metaclass=_enum_type_wrapper.EnumTypeWrapper):
    __slots__ = ()
    POLARITY_UNSPECIFIED: _ClassVar[Polarity]
    POLARITY_POSITIVE: _ClassVar[Polarity]
    POLARITY_NEGATIVE: _ClassVar[Polarity]
TEMPORAL_STATUS_UNSPECIFIED: TemporalStatus
TEMPORAL_STATUS_HISTORICAL: TemporalStatus
TEMPORAL_STATUS_CURRENT: TemporalStatus
TEMPORAL_STATUS_EMERGING: TemporalStatus
TEMPORAL_STATUS_FUTURE_INTENT: TemporalStatus
TEMPORAL_STATUS_UNKNOWN: TemporalStatus
POLARITY_UNSPECIFIED: Polarity
POLARITY_POSITIVE: Polarity
POLARITY_NEGATIVE: Polarity

class SubmitArchitecturalClaimsRequest(_message.Message):
    __slots__ = ("claims",)
    CLAIMS_FIELD_NUMBER: _ClassVar[int]
    claims: _containers.RepeatedCompositeFieldContainer[Claim]
    def __init__(self, claims: _Optional[_Iterable[_Union[Claim, _Mapping]]] = ...) -> None: ...

class SubmitArchitecturalClaimsResponse(_message.Message):
    __slots__ = ("success", "captured_count")
    SUCCESS_FIELD_NUMBER: _ClassVar[int]
    CAPTURED_COUNT_FIELD_NUMBER: _ClassVar[int]
    success: bool
    captured_count: int
    def __init__(self, success: _Optional[bool] = ..., captured_count: _Optional[int] = ...) -> None: ...

class Claim(_message.Message):
    __slots__ = ("statement", "evidence", "provenance", "temporal_status", "polarity", "confidence", "claim_id")
    STATEMENT_FIELD_NUMBER: _ClassVar[int]
    EVIDENCE_FIELD_NUMBER: _ClassVar[int]
    PROVENANCE_FIELD_NUMBER: _ClassVar[int]
    TEMPORAL_STATUS_FIELD_NUMBER: _ClassVar[int]
    POLARITY_FIELD_NUMBER: _ClassVar[int]
    CONFIDENCE_FIELD_NUMBER: _ClassVar[int]
    CLAIM_ID_FIELD_NUMBER: _ClassVar[int]
    statement: str
    evidence: Evidence
    provenance: Provenance
    temporal_status: TemporalStatus
    polarity: Polarity
    confidence: float
    claim_id: str
    def __init__(self, statement: _Optional[str] = ..., evidence: _Optional[_Union[Evidence, _Mapping]] = ..., provenance: _Optional[_Union[Provenance, _Mapping]] = ..., temporal_status: _Optional[_Union[TemporalStatus, str]] = ..., polarity: _Optional[_Union[Polarity, str]] = ..., confidence: _Optional[float] = ..., claim_id: _Optional[str] = ...) -> None: ...

class Evidence(_message.Message):
    __slots__ = ("value",)
    VALUE_FIELD_NUMBER: _ClassVar[int]
    value: str
    def __init__(self, value: _Optional[str] = ...) -> None: ...

class Provenance(_message.Message):
    __slots__ = ("source", "activity")
    SOURCE_FIELD_NUMBER: _ClassVar[int]
    ACTIVITY_FIELD_NUMBER: _ClassVar[int]
    source: str
    activity: Activity
    def __init__(self, source: _Optional[str] = ..., activity: _Optional[_Union[Activity, _Mapping]] = ...) -> None: ...

class Activity(_message.Message):
    __slots__ = ("id", "name", "when", "who")
    ID_FIELD_NUMBER: _ClassVar[int]
    NAME_FIELD_NUMBER: _ClassVar[int]
    WHEN_FIELD_NUMBER: _ClassVar[int]
    WHO_FIELD_NUMBER: _ClassVar[int]
    id: str
    name: str
    when: str
    who: str
    def __init__(self, id: _Optional[str] = ..., name: _Optional[str] = ..., when: _Optional[str] = ..., who: _Optional[str] = ...) -> None: ...
