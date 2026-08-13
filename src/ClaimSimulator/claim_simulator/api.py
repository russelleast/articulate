import os
from typing import Protocol

from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

from claim_simulator.runner import ExecutionSummary, GrpcScenarioRunner, ScenarioExecutionError
from claim_simulator.scenarios import Scenario, available_scenarios, scenario_named


class ScenarioRunner(Protocol):
    def run(self, scenario: Scenario) -> ExecutionSummary: ...


class ScenarioDetails(BaseModel):
    name: str
    description: str


class ScenarioExecutionSummary(BaseModel):
    scenario_name: str
    total_claims: int
    successfully_submitted_claims: int
    failed_claims: int


def create_app(runner: ScenarioRunner | None = None) -> FastAPI:
    scenario_runner = runner or GrpcScenarioRunner(
        os.getenv("KNOWLEDGE_API_ADDRESS", "knowledge-api:50051")
    )

    app = FastAPI(
        title="ClaimSimulator",
        description="Developer control surface for invoking ClaimSimulator scenarios.",
    )

    @app.get("/scenarios", response_model=list[ScenarioDetails])
    def list_scenarios() -> list[ScenarioDetails]:
        return [
            ScenarioDetails(name=scenario.name, description=scenario.description)
            for scenario in available_scenarios()
        ]

    @app.post(
        "/scenarios/{scenario_name}/run",
        response_model=ScenarioExecutionSummary,
    )
    def run_scenario(scenario_name: str) -> ScenarioExecutionSummary:
        scenario = scenario_named(scenario_name)
        if scenario is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Scenario '{scenario_name}' does not exist",
            )

        try:
            summary = scenario_runner.run(scenario)
        except ScenarioExecutionError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(error),
            ) from error

        return ScenarioExecutionSummary.model_validate(summary, from_attributes=True)

    return app


app = create_app()
