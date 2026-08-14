import os
import threading
import time
from concurrent import futures
from pathlib import Path

import grpc
import uvicorn
from dapr.clients import DaprClient
from knowledge.v1 import knowledge_pb2_grpc
from opentelemetry import trace
from pymongo import AsyncMongoClient, MongoClient
from pymongo.asynchronous.database import AsyncDatabase
from pymongo.database import Database
from review_agent.adapters import DaprReadyClaimPublisher
from review_agent.capability import ReviewProposedClaim
from review_agent.domain import ReviewResult as AgentReviewResult
from review_agent.domain import ReviewStatus as AgentReviewStatus
from review_agent.model import DaprPromptyClaimReviewer
from review_agent.runtime import create_app

from knowledge_api.domain import ReviewProposedClaimResult, ReviewStatus
from knowledge_api.grpc_service import KnowledgeApiServicer
from knowledge_api.messaging import DaprProposedClaimPublisher
from knowledge_api.observability import configure_observability
from knowledge_api.repository import (
    MongoProposedKnowledgeRepository,
    MongoProposedKnowledgeReviewRepository,
    ReviewResultRepository,
)


class InternalReviewResultRecorder:
    """Record the internal agent effect through KnowledgeApi-owned persistence."""

    def __init__(self, repository: ReviewResultRepository) -> None:
        self._repository = repository

    async def record(self, result: AgentReviewResult) -> None:
        status = (
            ReviewStatus.READY
            if result.status is AgentReviewStatus.READY
            else ReviewStatus.NOT_READY
        )
        with trace.get_tracer("articulate.review_proposed_claim").start_as_current_span(
            "Record Review Result",
            attributes={
                "effect.name": "RecordReviewResult",
                "claim.id": str(result.claim_id),
            },
        ) as span:
            span.set_attribute("effect.requested", True)
            try:
                await self._repository.record(
                    ReviewProposedClaimResult.create(result.claim_id, status, result.confidence)
                )
            except Exception:
                span.set_attribute("effect.outcome", "Failed")
                span.set_attribute("audit.evidence", "review-result-persistence-failed")
                raise
            else:
                span.set_attribute("effect.outcome", "Recorded")
                span.set_attribute("audit.evidence", "review-result-persisted")


def get_mongodb_connection_string(attempts: int = 30) -> str:

    for attempt in range(attempts):
        try:
            with DaprClient() as client:
                secret = client.get_secret(
                    store_name=os.getenv("DAPR_SECRET_STORE", "local-secret-store"),
                    key="mongodb-connection-string",
                )

                return secret.secret["mongodb-connection-string"]
        except Exception:
            if attempt == attempts - 1:
                raise

            time.sleep(1)

    raise RuntimeError("MongoDB connection secret was unavailable")


def serve() -> None:
    observability = configure_observability()
    mongodb_connection_string = get_mongodb_connection_string()
    mongo_client: MongoClient[dict[str, object]] = MongoClient(mongodb_connection_string)
    async_mongo_client: AsyncMongoClient[dict[str, object]] = AsyncMongoClient(
        mongodb_connection_string
    )
    database: Database[dict[str, object]] = mongo_client["articulate"]
    async_database: AsyncDatabase[dict[str, object]] = async_mongo_client["articulate"]
    repository = MongoProposedKnowledgeRepository(database["proposed-knowledge"])
    review_result_repository = MongoProposedKnowledgeReviewRepository(
        async_database["proposed-knowledge"]
    )
    publisher = DaprProposedClaimPublisher(
        os.getenv("PROPOSED_CLAIMS_PUBSUB", "knowledge-events"),
        os.getenv("PROPOSED_CLAIMS_TOPIC", "proposed-claims-captured"),
    )

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    knowledge_pb2_grpc.add_KnowledgeApiServicer_to_server(
        KnowledgeApiServicer(repository, publisher), server
    )
    port = os.getenv("KNOWLEDGE_API_PORT", "50051")
    server.add_insecure_port(f"[::]:{port}")

    prompty_path = (
        Path(__file__).parents[2]
        / "ReviewProposedClaimAgent"
        / "review_agent"
        / "review_proposed_claim.prompty"
    )
    review_capability = ReviewProposedClaim(
        reviewer=DaprPromptyClaimReviewer(
            prompty_path,
            os.getenv("DAPR_CONVERSATION_COMPONENT", "architectural-reasoning"),
            maximum_concurrency=int(os.getenv("MODEL_MAXIMUM_CONCURRENCY", "4")),
        ),
        recorder=InternalReviewResultRecorder(review_result_repository),
        ready_publisher=DaprReadyClaimPublisher(
            os.getenv("KNOWLEDGE_EVENTS_PUBSUB", "knowledge-events"),
            os.getenv("READY_CLAIMS_TOPIC", "claims-ready-for-reconciliation"),
        ),
        minimum_confidence=float(os.getenv("MINIMUM_ANSWER_CONFIDENCE", "0.6")),
    )
    review_app = create_app(review_capability)
    review_server = uvicorn.Server(
        uvicorn.Config(
            review_app,
            host="0.0.0.0",
            port=int(os.getenv("KNOWLEDGE_API_CALLBACK_PORT", "8001")),
            log_level="info",
        )
    )

    server.start()
    callback_thread = threading.Thread(target=review_server.run, daemon=True)
    callback_thread.start()
    try:
        server.wait_for_termination()
    finally:
        review_server.should_exit = True
        callback_thread.join(timeout=5)
        observability.shutdown()


if __name__ == "__main__":
    serve()
