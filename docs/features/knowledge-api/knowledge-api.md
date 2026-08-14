# Knowledge API vertical slice

The Episode 16 Knowledge API slice proves capture followed by the narrow `ReviewProposedClaim`
reasoning capability. It intentionally does not implement reconciliation, assessment or merge.

## Generate contracts

Generated Python protobuf modules are checked in and verified for freshness:

```sh
cd runtime
UV_PROJECT_ENVIRONMENT=src/knowledge/api/.venv uv sync --frozen --inexact
uv pip install \
  --python src/knowledge/api/.venv/bin/python \
  --requirement src/knowledge/api/requirements.txt
src/knowledge/api/.venv/bin/python -m grpc_tools.protoc \
  --proto_path=proto \
  --python_out=src/knowledge/shared \
  --pyi_out=src/knowledge/shared \
  --grpc_python_out=src/knowledge/shared \
  proto/knowledge/v1/knowledge.proto
```

## Run locally

Ollama and its configured model run outside Compose. On the machine hosting Ollama, make it listen
on an address reachable from Docker (for example `OLLAMA_HOST=0.0.0.0:11434`) and pull the model.
From the runtime project root, copy `.env.example` to the ignored `.env` file, then set `OLLAMA_HOST` to the network-resolvable
hostname or IP of the Mac mini. For the machine named **Russell's Mac mini**, run
`scutil --get LocalHostName` on that Mac to discover its Bonjour hostname and append `.local`, or
use its stable LAN IP. The machine-specific address is deliberately not committed:

```sh
cd runtime
cp .env.example .env
# Edit .env:
OLLAMA_HOST=your-resolvable-mac-mini-hostname.local
OLLAMA_PORT=11434
OLLAMA_MODEL=gemma3:4b
```

Compose constructs the OpenAI-compatible endpoint supplied to the Dapr Conversation component from
these values. Before the Dapr sidecar starts, `ollama-connectivity` calls Ollama's model endpoint.
Startup stops with its URL and model in the diagnostic if the Mac mini is unreachable or the model
is unavailable. Inspect it directly with `docker compose logs ollama-connectivity`.

Start MongoDB, RabbitMQ, Redis execution state, Zipkin, the OpenTelemetry Collector, KnowledgeApi
with its internal review agent, the KnowledgeApi Dapr sidecar, and ClaimSimulator:

```sh
docker compose up --build
```

ClaimSimulator's Swagger interface is available at <http://localhost:8000/docs>. Use it to list the
available scenarios with `GET /scenarios`, then run the existing 50-claim scenario with
`POST /scenarios/first-vertical-slice/run`. Run the visible Ready/NotReady pair with
`POST /scenarios/review-examples/run`.

Submit one complete claim manually with `POST /claims`. Swagger provides ready-to-edit examples for
both "The SQL servers are clustered." and "I wear thick jumpers when it is cold.":

```sh
curl --fail --header 'Content-Type: application/json' \
  --data '{
    "claim_id": "4e690bf2-95e5-43f8-8c64-a945741d6a56",
    "statement": "The SQL servers are clustered.",
    "evidence": {"value": "Confirmed by the infrastructure team."},
    "provenance": {
      "source": "ClaimSimulator:manual",
      "activity": {
        "id": "98397d4f-5d36-4b70-9d91-bbe5f16a308d",
        "name": "Discovery",
        "when": "2026-08-13T10:00:00Z",
        "who": "Russell"
      }
    },
    "temporal_status": "current",
    "polarity": "positive",
    "confidence": 0.9
  }' \
  http://localhost:8000/claims
```

The execution response reports the total, successfully submitted, and failed claim counts. Inspect
persisted proposed knowledge with:

```sh
docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("proposed-knowledge").countDocuments({})'

docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("proposed-knowledge").find({"claim.reviewStatus":{$exists:true}}, {"claim.claimId":1,"claim.reviewStatus":1,"claim.reviewConfidence":1}).toArray()'
```

Zipkin is available at <http://localhost:9411>. Select the `KnowledgeApi` service and run a query to
locate `SubmitArchitecturalClaims`. The path includes validation, capture, persistence, publication,
receipt, review, Dapr Conversation, policy evaluation, and the internal `RecordReviewResult` effect.

The application exports traces and metrics to the OpenTelemetry Collector over OTLP. Inspect the DCL
observations exposed by the Collector at <http://localhost:9464/metrics>:

```sh
curl --silent http://localhost:9464/metrics \
  | grep -E 'capture_proposed_knowledge_duration|persist_claim_count|rejected_count|review_proposed_claim_duration|ready_count|not_ready_count|failed_count'
```

Successful scenarios emit capability duration and persistence count. The rejection counter appears
after a capability reaches the `Rejected` outcome; invalid transport contracts are rejected before
capability execution and are not included in that counter.

RabbitMQ management is available at <http://localhost:15672> using its local-development guest
credentials. `knowledge-events` and its topic names are application configuration; application code
does not use the RabbitMQ SDK. Redis is the `review-agent-execution-state` Dapr state store only and
is not authoritative architectural knowledge. The review capability runs inside KnowledgeApi and
records through its repository directly; it is not exposed as a public RPC.

Deterministic repository verification uses controlled Conversation responses and does not require
Ollama. The live Compose scenario is intentionally separate because model availability and output
are environmental. The I/O-heavy callback path is async; Dapr Agents 1.0.5 model generation remains
blocking and is isolated behind a bounded worker thread. Dapr Pub/Sub is at-least-once: execution
markers and idempotent targeted updates to the staged claim make duplicate completion safe. An
unknown `ClaimId` fails rather than creating a document. This slice does not implement an outbox, so a process failure between
MongoDB persistence and publication remains a documented reliability gap.

Stop and remove the local containers and volume with `docker compose down --volumes`.
