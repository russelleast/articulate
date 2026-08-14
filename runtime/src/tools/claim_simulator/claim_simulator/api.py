import os
from enum import StrEnum
from typing import Annotated, Protocol

from fastapi import Body, FastAPI, HTTPException, status
from knowledge.v1 import knowledge_pb2
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


class TemporalStatus(StrEnum):
    historical = "historical"
    current = "current"
    emerging = "emerging"
    future_intent = "future_intent"
    unknown = "unknown"


class Polarity(StrEnum):
    positive = "positive"
    negative = "negative"


class Evidence(BaseModel):
    value: str


class Activity(BaseModel):
    id: str
    name: str
    when: str
    who: str


class Provenance(BaseModel):
    source: str
    activity: Activity


class Claim(BaseModel):
    claim_id: str
    statement: str
    evidence: Evidence
    provenance: Provenance
    temporal_status: TemporalStatus
    polarity: Polarity
    confidence: float


TEMPORAL_STATUSES = {
    TemporalStatus.historical: knowledge_pb2.TEMPORAL_STATUS_HISTORICAL,
    TemporalStatus.current: knowledge_pb2.TEMPORAL_STATUS_CURRENT,
    TemporalStatus.emerging: knowledge_pb2.TEMPORAL_STATUS_EMERGING,
    TemporalStatus.future_intent: knowledge_pb2.TEMPORAL_STATUS_FUTURE_INTENT,
    TemporalStatus.unknown: knowledge_pb2.TEMPORAL_STATUS_UNKNOWN,
}

POLARITIES = {
    Polarity.positive: knowledge_pb2.POLARITY_POSITIVE,
    Polarity.negative: knowledge_pb2.POLARITY_NEGATIVE,
}


def _manual_scenario(claim: Claim) -> Scenario:
    return Scenario(
        name="manual-claim",
        description="One manually supplied claim.",
        claims=(
            knowledge_pb2.Claim(
                claim_id=claim.claim_id,
                statement=claim.statement,
                evidence=knowledge_pb2.Evidence(value=claim.evidence.value),
                provenance=knowledge_pb2.Provenance(
                    source=claim.provenance.source,
                    activity=knowledge_pb2.Activity(
                        id=claim.provenance.activity.id,
                        name=claim.provenance.activity.name,
                        when=claim.provenance.activity.when,
                        who=claim.provenance.activity.who,
                    ),
                ),
                temporal_status=TEMPORAL_STATUSES[claim.temporal_status],
                polarity=POLARITIES[claim.polarity],
                confidence=claim.confidence,
            ),
        ),
    )


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

    @app.post("/claims", response_model=ScenarioExecutionSummary)
    def submit_claim(
        claim: Annotated[
            Claim,
            Body(
                openapi_examples={
                    "architectural": {
                        "summary": "Architectural claim",
                        "value": {
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
                        },
                    },
                    "non-architectural": {
                        "summary": "Non-architectural claim",
                        "value": {
                            "claim_id": "73a02cc4-3e24-476c-8037-f2ecfa580671",
                            "statement": "I wear thick jumpers when it is cold.",
                            "evidence": {"value": "Personal observation."},
                            "provenance": {
                                "source": "ClaimSimulator:manual",
                                "activity": {
                                    "id": "b9177d63-905d-441e-8035-aa7e785c345c",
                                    "name": "Discovery",
                                    "when": "2026-08-13T10:00:00Z",
                                    "who": "Russell",
                                },
                            },
                            "temporal_status": "current",
                            "polarity": "positive",
                            "confidence": 0.9,
                        },
                    },
                }
            ),
        ],
    ) -> ScenarioExecutionSummary:
        try:
            summary = scenario_runner.run(_manual_scenario(claim))
        except ScenarioExecutionError as error:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=str(error),
            ) from error

        return ScenarioExecutionSummary.model_validate(summary, from_attributes=True)

    return app


app = create_app()
