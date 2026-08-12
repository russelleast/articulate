import os
import sys

import grpc
from knowledge.v1 import knowledge_pb2, knowledge_pb2_grpc

from claim_simulator.scenarios import first_vertical_slice


def run() -> int:
    scenario = first_vertical_slice()
    address = os.getenv("KNOWLEDGE_API_ADDRESS", "knowledge-api:50051")
    try:
        with grpc.insecure_channel(address) as channel:
            grpc.channel_ready_future(channel).result(timeout=30)

            response = knowledge_pb2_grpc.KnowledgeApiStub(channel).SubmitArchitecturalClaims(
                knowledge_pb2.SubmitArchitecturalClaimsRequest(claims=scenario.claims), timeout=30
            )
    except (grpc.RpcError, grpc.FutureTimeoutError) as error:
        print(f"Scenario {scenario.name} failed: {error}", file=sys.stderr)

        return 1

    print(f"Scenario {scenario.name} captured {response.captured_count} claims.")

    return 0 if response.success and response.captured_count == len(scenario.claims) else 1


if __name__ == "__main__":
    raise SystemExit(run())
