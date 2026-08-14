from dataclasses import dataclass

from claim_simulator.api import create_app
from claim_simulator.runner import ExecutionSummary, ScenarioExecutionError
from claim_simulator.scenarios import Scenario
from fastapi.testclient import TestClient

MANUAL_CLAIM = {
    "claim_id": "4e690bf2-95e5-43f8-8c64-a945741d6a56",
    "statement": "The SQL servers are clustered.",
    "evidence": {"value": "Confirmed by the infrastructure team."},
    "provenance": {
        "source": "ClaimSimulator:manual",
        "activity": {
            "id": "98397d4f-5d36-4b70-9d91-bbe5f16a308d",
            "name": "Discovery",
            "when": "2026-08-13T10:00:00Z",
            "who": "Russell",
        },
    },
    "temporal_status": "current",
    "polarity": "positive",
    "confidence": 0.9,
}


@dataclass
class RecordingRunner:
    scenario: Scenario | None = None

    def run(self, scenario: Scenario) -> ExecutionSummary:
        self.scenario = scenario
        claim_count = len(scenario.claims)
        return ExecutionSummary(
            scenario_name=scenario.name,
            total_claims=claim_count,
            successfully_submitted_claims=claim_count,
            failed_claims=0,
        )


class FailingRunner:
    def run(self, scenario: Scenario) -> ExecutionSummary:
        raise ScenarioExecutionError(
            f"KnowledgeApi submission failed for scenario '{scenario.name}'"
        )


def test_scenarios_lists_the_existing_scenario() -> None:
    response = TestClient(create_app(RecordingRunner())).get("/scenarios")

    assert response.status_code == 200
    scenarios = response.json()
    assert [scenario["name"] for scenario in scenarios] == [
        "first-vertical-slice",
        "review-examples",
    ]
    assert scenarios[0]["description"].startswith("Fifty inspectable claims")


def test_run_submits_the_existing_fifty_claim_scenario() -> None:
    runner = RecordingRunner()

    response = TestClient(create_app(runner)).post("/scenarios/first-vertical-slice/run")

    assert response.status_code == 200
    assert response.json() == {
        "scenario_name": "first-vertical-slice",
        "total_claims": 50,
        "successfully_submitted_claims": 50,
        "failed_claims": 0,
    }
    assert runner.scenario is not None
    assert len(runner.scenario.claims) == 50


def test_unknown_scenario_returns_not_found() -> None:
    response = TestClient(create_app(RecordingRunner())).post("/scenarios/unknown/run")

    assert response.status_code == 404
    assert response.json() == {"detail": "Scenario 'unknown' does not exist"}


def test_manual_claim_submits_one_complete_claim() -> None:
    runner = RecordingRunner()

    response = TestClient(create_app(runner)).post("/claims", json=MANUAL_CLAIM)

    assert response.status_code == 200
    assert response.json() == {
        "scenario_name": "manual-claim",
        "total_claims": 1,
        "successfully_submitted_claims": 1,
        "failed_claims": 0,
    }
    assert runner.scenario is not None
    claim = runner.scenario.claims[0]
    assert claim.claim_id == MANUAL_CLAIM["claim_id"]
    assert claim.statement == "The SQL servers are clustered."
    assert claim.evidence.value == "Confirmed by the infrastructure team."
    assert claim.provenance.source == "ClaimSimulator:manual"
    assert claim.provenance.activity.name == "Discovery"
    assert claim.temporal_status == 2
    assert claim.polarity == 1
    assert claim.confidence == 0.9


def test_manual_claim_requires_the_complete_payload() -> None:
    response = TestClient(create_app(RecordingRunner())).post(
        "/claims", json={"statement": "The SQL servers are clustered."}
    )

    assert response.status_code == 422


def test_manual_claim_submission_failure_is_exposed_as_bad_gateway() -> None:
    response = TestClient(create_app(FailingRunner())).post("/claims", json=MANUAL_CLAIM)

    assert response.status_code == 502
    assert response.json() == {
        "detail": "KnowledgeApi submission failed for scenario 'manual-claim'"
    }


def test_submission_failure_is_exposed_as_bad_gateway() -> None:
    response = TestClient(create_app(FailingRunner())).post("/scenarios/first-vertical-slice/run")

    assert response.status_code == 502
    assert response.json() == {
        "detail": "KnowledgeApi submission failed for scenario 'first-vertical-slice'"
    }


def test_openapi_describes_the_scenario_control_surface() -> None:
    response = TestClient(create_app(RecordingRunner())).get("/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert "get" in paths["/scenarios"]
    assert "post" in paths["/scenarios/{scenario_name}/run"]
    assert "post" in paths["/claims"]
    examples = paths["/claims"]["post"]["requestBody"]["content"]["application/json"]["examples"]
    assert examples["architectural"]["value"]["statement"] == "The SQL servers are clustered."
    assert examples["non-architectural"]["value"]["statement"] == (
        "I wear thick jumpers when it is cold."
    )
