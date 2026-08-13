from dataclasses import dataclass
from datetime import UTC, datetime
from uuid import uuid4

from knowledge.v1 import knowledge_pb2


@dataclass(frozen=True)
class Scenario:
    name: str
    description: str
    claims: tuple[knowledge_pb2.Claim, ...]


def first_vertical_slice() -> Scenario:
    subjects = ("KnowledgeApi", "ClaimSimulator", "MongoDB", "Dapr", "Zipkin")
    practices = (
        "has an explicit architectural boundary",
        "is observable in the local runtime",
        "is independently replaceable",
        "uses a shared contract",
        "keeps infrastructure outside domain behaviour",
        "is verified by the engineering harness",
        "has a single responsibility in this slice",
        "supports incremental architectural evolution",
        "exposes understandable runtime behaviour",
        "avoids speculative abstractions",
    )
    claims = tuple(
        knowledge_pb2.Claim(
            claim_id=str(uuid4()),
            statement=f"{subject} {practice}.",
            evidence=knowledge_pb2.Evidence(value="Knowledge API first vertical slice"),
            provenance=knowledge_pb2.Provenance(
                source="ClaimSimulator:first-vertical-slice",
                activity=knowledge_pb2.Activity(
                    id=str(uuid4()),
                    name=("Discovery" if subject in {"MongoDB", "Zipkin"} else "SolutionDesign"),
                    when=datetime.now(UTC).isoformat(),
                    who="ClaimSimulator",
                ),
            ),
            temporal_status=knowledge_pb2.TEMPORAL_STATUS_CURRENT,
            polarity=knowledge_pb2.POLARITY_POSITIVE,
            confidence=0.8,
        )
        for subject in subjects
        for practice in practices
    )
    return Scenario(
        name="first-vertical-slice",
        description="Fifty inspectable claims exercising the proposed-knowledge capture path.",
        claims=claims,
    )


def review_examples() -> Scenario:
    statements = (
        ("The SQL servers are clustered.", "Discovery"),
        ("I wear thick jumpers when it is cold.", "Discovery"),
    )
    claims = tuple(
        knowledge_pb2.Claim(
            claim_id=str(uuid4()),
            statement=statement,
            evidence=knowledge_pb2.Evidence(value="Episode 16 review example"),
            provenance=knowledge_pb2.Provenance(
                source="ClaimSimulator:review-examples",
                activity=knowledge_pb2.Activity(
                    id=str(uuid4()),
                    name=activity_name,
                    when=datetime.now(UTC).isoformat(),
                    who="ClaimSimulator",
                ),
            ),
            temporal_status=knowledge_pb2.TEMPORAL_STATUS_CURRENT,
            polarity=knowledge_pb2.POLARITY_POSITIVE,
            confidence=0.9,
        )
        for statement, activity_name in statements
    )
    return Scenario(
        name="review-examples",
        description="Known Ready and NotReady claims exercising ReviewProposedClaim.",
        claims=claims,
    )


def available_scenarios() -> tuple[Scenario, ...]:
    return (first_vertical_slice(), review_examples())


def scenario_named(name: str) -> Scenario | None:
    return next((scenario for scenario in available_scenarios() if scenario.name == name), None)
