import pytest
from claim_simulator.runner import GrpcScenarioRunner, ScenarioExecutionError
from claim_simulator.scenarios import first_vertical_slice


def test_unreachable_knowledge_api_is_reported_as_execution_failure() -> None:
    runner = GrpcScenarioRunner(
        "127.0.0.1:1",
        connection_timeout=0.01,
        submission_timeout=0.01,
    )

    with pytest.raises(ScenarioExecutionError, match="KnowledgeApi submission failed"):
        runner.run(first_vertical_slice())
