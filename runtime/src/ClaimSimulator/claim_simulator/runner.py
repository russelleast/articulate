from dataclasses import dataclass

import grpc
from knowledge.v1 import knowledge_pb2, knowledge_pb2_grpc

from claim_simulator.scenarios import Scenario


class ScenarioExecutionError(Exception):
    """Raised when a scenario cannot be submitted to the KnowledgeApi."""


@dataclass(frozen=True)
class ExecutionSummary:
    scenario_name: str
    total_claims: int
    successfully_submitted_claims: int
    failed_claims: int


class GrpcScenarioRunner:
    def __init__(
        self,
        address: str,
        connection_timeout: float = 30,
        submission_timeout: float = 30,
    ) -> None:
        self._address = address
        self._connection_timeout = connection_timeout
        self._submission_timeout = submission_timeout

    def run(self, scenario: Scenario) -> ExecutionSummary:
        try:
            with grpc.insecure_channel(self._address) as channel:
                grpc.channel_ready_future(channel).result(timeout=self._connection_timeout)
                response = knowledge_pb2_grpc.KnowledgeApiStub(channel).SubmitArchitecturalClaims(
                    knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=scenario.claims),
                    timeout=self._submission_timeout,
                )
        except (grpc.RpcError, grpc.FutureTimeoutError) as error:
            raise ScenarioExecutionError(
                f"KnowledgeApi submission failed for scenario '{scenario.name}'"
            ) from error

        total_claims = len(scenario.claims)
        successfully_submitted_claims = min(response.captured_count, total_claims)
        if not response.success:
            raise ScenarioExecutionError(f"KnowledgeApi rejected scenario '{scenario.name}'")

        return ExecutionSummary(
            scenario_name=scenario.name,
            total_claims=total_claims,
            successfully_submitted_claims=successfully_submitted_claims,
            failed_claims=total_claims - successfully_submitted_claims,
        )
