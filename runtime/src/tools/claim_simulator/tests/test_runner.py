from uuid import UUID

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


def test_batch_claims_have_independent_stable_identifiers_and_activity() -> None:
    claims = first_vertical_slice().claims
    claim_ids = {claim.claim_id for claim in claims}

    assert len(claim_ids) == len(claims) == 50
    assert all(UUID(claim_id) for claim_id in claim_ids)
    assert all(
        claim.provenance.activity.name in {"Discovery", "SolutionDesign"} for claim in claims
    )
