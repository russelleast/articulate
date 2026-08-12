from dataclasses import dataclass

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
            statement=f"{subject} {practice}.",
            evidence=knowledge_pb2.Evidence(value="Knowledge API first vertical slice"),
            provenance=knowledge_pb2.Provenance(source="ClaimSimulator:first-vertical-slice"),
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
