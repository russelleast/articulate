from dataclasses import dataclass, field

from fastapi.testclient import TestClient
from review_agent.domain import ReviewResult
from review_agent.runtime import create_app
from test_capability import capability, claim


@dataclass
class State:
    already_completed: bool = False
    marked: list[ReviewResult] = field(default_factory=list)
    events: list[str] | None = None

    async def completed(self, claim_id: str) -> bool:
        del claim_id
        return self.already_completed

    async def mark_completed(self, result: ReviewResult) -> None:
        self.marked.append(result)
        if self.events is not None:
            self.events.append("completed")


class Instrumentation:
    class Context:
        def __enter__(self) -> dict[str, object]:
            return {}

        def __exit__(self, *args: object) -> None:
            del args

    def review(self, claim_id: str, threshold: float) -> "Instrumentation.Context":
        del claim_id, threshold
        return self.Context()

    @staticmethod
    def complete(outcome: dict[str, object], result: ReviewResult) -> None:
        outcome["name"] = result.status.value


def event_payload() -> dict[str, object]:
    return {"specversion": "1.0", "data": claim().model_dump(mode="json", by_alias=True)}


def test_subscription_invokes_capability_and_marks_execution_complete() -> None:
    from test_capability import Recorder

    events: list[str] = []
    review, recorder, _ = capability_response(Recorder(events=events))
    state = State(events=events)
    client = TestClient(create_app(review, state, Instrumentation()))  # type: ignore[arg-type]

    response = client.post("/review-proposed-claim", json=event_payload())

    assert response.status_code == 204
    assert len(recorder.results) == len(state.marked) == 1
    assert events == ["recorded", "completed"]


def test_recording_failure_does_not_mark_execution_complete() -> None:
    from review_agent.domain import ModelReview, ReviewStatus
    from test_capability import Recorder

    review, _, _ = capability(
        ModelReview(status=ReviewStatus.READY, confidence=0.9), Recorder(fail=True)
    )
    state = State()
    client = TestClient(create_app(review, state, Instrumentation()))  # type: ignore[arg-type]

    response = client.post("/review-proposed-claim", json=event_payload())

    assert response.status_code == 500
    assert state.marked == []


def test_duplicate_delivery_does_not_repeat_review() -> None:
    review, recorder, _ = capability_response()
    client = TestClient(
        create_app(review, State(already_completed=True), Instrumentation())  # type: ignore[arg-type]
    )

    assert client.post("/review-proposed-claim", json=event_payload()).status_code == 204
    assert recorder.results == []


def capability_response(recorder=None):  # type: ignore[no-untyped-def]
    from review_agent.domain import ModelReview, ReviewStatus

    return capability(ModelReview(status=ReviewStatus.READY, confidence=0.9), recorder)
