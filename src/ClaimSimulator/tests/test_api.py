from dataclasses import dataclass

from claim_simulator.api import create_app
from claim_simulator.runner import ExecutionSummary, ScenarioExecutionError
from claim_simulator.scenarios import Scenario
from fastapi.testclient import TestClient


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
