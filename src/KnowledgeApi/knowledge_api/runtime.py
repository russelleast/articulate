import os
import time
from concurrent import futures

import grpc
from dapr.clients import DaprClient
from knowledge.v1 import knowledge_pb2_grpc
from pymongo import MongoClient
from pymongo.database import Database

from knowledge_api.grpc_service import KnowledgeApiServicer
from knowledge_api.repository import MongoProposedKnowledgeRepository


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
    mongo_client: MongoClient[dict[str, object]] = MongoClient(get_mongodb_connection_string())
    database: Database[dict[str, object]] = mongo_client["articulate"]
    repository = MongoProposedKnowledgeRepository(database["proposed-knowledge"])

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=4))
    knowledge_pb2_grpc.add_KnowledgeApiServicer_to_server(KnowledgeApiServicer(repository), server)
    port = os.getenv("KNOWLEDGE_API_PORT", "50051")
    server.add_insecure_port(f"[::]:{port}")

    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
