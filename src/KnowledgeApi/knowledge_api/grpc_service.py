import grpc
from knowledge.v1 import knowledge_pb2, knowledge_pb2_grpc
from pydantic import ValidationError

from knowledge_api.capture import capture_proposed_knowledge
from knowledge_api.domain import Polarity, TemporalStatus
from knowledge_api.repository import ProposedKnowledgeRepository
from knowledge_api.validation import ClaimInput

TEMPORAL_STATUSES = {
    knowledge_pb2.TEMPORAL_STATUS_HISTORICAL: TemporalStatus.HISTORICAL,
    knowledge_pb2.TEMPORAL_STATUS_CURRENT: TemporalStatus.CURRENT,
    knowledge_pb2.TEMPORAL_STATUS_EMERGING: TemporalStatus.EMERGING,
    knowledge_pb2.TEMPORAL_STATUS_FUTURE_INTENT: TemporalStatus.FUTURE_INTENT,
    knowledge_pb2.TEMPORAL_STATUS_UNKNOWN: TemporalStatus.UNKNOWN,
}
POLARITIES = {
    knowledge_pb2.POLARITY_POSITIVE: Polarity.POSITIVE,
    knowledge_pb2.POLARITY_NEGATIVE: Polarity.NEGATIVE,
}


class KnowledgeApiServicer(knowledge_pb2_grpc.KnowledgeApiServicer):
    def __init__(self, repository: ProposedKnowledgeRepository) -> None:
        self._repository = repository

    def SubmitArchitecturalClaims(
        self,
        request: knowledge_pb2.SubmitArchitecturalClaimsRequest,
        context: grpc.ServicerContext,
    ) -> knowledge_pb2.SubmitArchitecturalClaimsResponse:
        try:
            if not request.claims:
                raise ValueError("at least one claim is required")
            claims = [self._validate_claim(claim).to_domain() for claim in request.claims]
        except (ValidationError, ValueError, KeyError) as error:
            context.abort(grpc.StatusCode.INVALID_ARGUMENT, str(error))
            raise AssertionError("context.abort must terminate the call") from error

        captured_count = capture_proposed_knowledge(claims, self._repository)
        return knowledge_pb2.SubmitArchitecturalClaimsResponse(
            success=True, captured_count=captured_count
        )

    @staticmethod
    def _validate_claim(claim: knowledge_pb2.Claim) -> ClaimInput:
        if not claim.HasField("confidence"):
            raise ValueError("confidence is required")
        evidence = {"value": claim.evidence.value} if claim.HasField("evidence") else None
        return ClaimInput.model_validate(
            {
                "statement": claim.statement,
                "evidence": evidence,
                "provenance": {"source": claim.provenance.source},
                "temporal_status": TEMPORAL_STATUSES[claim.temporal_status],
                "polarity": POLARITIES[claim.polarity],
                "confidence": claim.confidence,
            }
        )
