from dataclasses import dataclass, field
from datetime import UTC, datetime
from uuid import UUID, uuid4

import grpc
import pytest
from knowledge.v1 import knowledge_pb2
from knowledge_api.domain import ProposedKnowledge
from knowledge_api.grpc_service import KnowledgeApiServicer


@dataclass
class RecordingRepository:
    captured: list[ProposedKnowledge] = field(default_factory=list)

    def add(self, proposed_knowledge: ProposedKnowledge) -> None:
        self.captured.append(proposed_knowledge)


class AbortingContext:
    def abort(self, code: grpc.StatusCode, details: str) -> None:
        raise RpcAborted(code, details)


class RpcAborted(Exception):
    def __init__(self, code: grpc.StatusCode, details: str) -> None:
        self.code = code
        self.details = details


def valid_claim() -> knowledge_pb2.Claim:
    return knowledge_pb2.Claim(
        claim_id=str(uuid4()),
        statement="Services own their operational data.",
        evidence=knowledge_pb2.Evidence(value="ADR-0001"),
        provenance=knowledge_pb2.Provenance(
            source="architecture repository",
            activity=knowledge_pb2.Activity(
                id=str(uuid4()),
                name="Decision",
                when=datetime.now(UTC).isoformat(),
                who="Architecture Team",
            ),
        ),
        temporal_status=knowledge_pb2.TEMPORAL_STATUS_CURRENT,
        polarity=knowledge_pb2.POLARITY_POSITIVE,
        confidence=0.9,
    )


def test_grpc_request_captures_proposed_knowledge_through_repository() -> None:
    repository = RecordingRepository()
    service = KnowledgeApiServicer(repository)

    response = service.SubmitArchitecturalClaims(
        knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=[valid_claim(), valid_claim()]),
        AbortingContext(),  # type: ignore[arg-type]
    )

    assert response.success is True
    assert response.captured_count == 2
    assert len(repository.captured) == 2
    assert repository.captured[0].claim.statement == "Services own their operational data."
    assert repository.captured[0].claim.evidence == "ADR-0001"
    assert isinstance(repository.captured[0].claim.claim_id, UUID)
    assert repository.captured[0].id == repository.captured[0].claim.claim_id
    assert repository.captured[0].claim.activity.name == "Decision"
    assert isinstance(repository.captured[0].captured_at, datetime)


@pytest.mark.parametrize(
    "change",
    [
        {"statement": ""},
        {"confidence": 1.1},
        {"polarity": knowledge_pb2.POLARITY_UNSPECIFIED},
        {"temporal_status": knowledge_pb2.TEMPORAL_STATUS_UNSPECIFIED},
    ],
)
def test_invalid_contract_is_rejected_before_persistence(change: dict[str, object]) -> None:
    repository = RecordingRepository()
    claim = valid_claim()
    for name, value in change.items():
        setattr(claim, name, value)

    with pytest.raises(RpcAborted) as error:
        KnowledgeApiServicer(repository).SubmitArchitecturalClaims(
            knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=[claim]),
            AbortingContext(),  # type: ignore[arg-type]
        )

    assert error.value.code is grpc.StatusCode.INVALID_ARGUMENT
    assert repository.captured == []
