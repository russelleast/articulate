# Knowledge API vertical slice

The Episode 16 Knowledge API slice proves capture followed by the narrow `ReviewProposedClaim`
reasoning capability. It intentionally does not implement reconciliation, assessment or merge.

## Generate contracts

Generated Python protobuf modules are checked in and verified for freshness:

```sh
UV_PROJECT_ENVIRONMENT=src/KnowledgeApi/.venv uv sync --frozen --inexact
uv pip install \
  --python src/KnowledgeApi/.venv/bin/python \
  --requirement src/KnowledgeApi/requirements.txt
src/KnowledgeApi/.venv/bin/python -m grpc_tools.protoc \
  --proto_path=proto \
  --python_out=src/shared \
  --pyi_out=src/shared \
  --grpc_python_out=src/shared \
  proto/knowledge/v1/knowledge.proto
```

## Run locally

Ollama and Gemma 3 run outside Compose. On the machine hosting Ollama, make it listen on an address
reachable from Docker (for example `OLLAMA_HOST=0.0.0.0:11434`) and pull the configured model. The
Docker Desktop default uses `host.docker.internal`; override either value without changing code:

```sh
export OLLAMA_ENDPOINT=http://host.docker.internal:11434/v1
export GEMMA_MODEL=gemma3:4b
```

Start MongoDB, RabbitMQ, Redis execution state, Zipkin, the OpenTelemetry Collector, KnowledgeApi
with its internal review agent, the KnowledgeApi Dapr sidecar, and ClaimSimulator:

```sh
docker compose up --build
```

ClaimSimulator's Swagger interface is available at <http://localhost:8000/docs>. Use it to list the
available scenarios with `GET /scenarios`, then run the existing 50-claim scenario with
`POST /scenarios/first-vertical-slice/run`. Run the visible Ready/NotReady pair with
`POST /scenarios/review-examples/run`.

The execution response reports the total, successfully submitted, and failed claim counts. Inspect
persisted proposed knowledge with:

```sh
docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("proposed-knowledge").countDocuments({})'

docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("claim-review-results").find({}, {claimId:1,status:1,confidence:1}).toArray()'
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
are environmental. Dapr Pub/Sub is at-least-once: execution markers and review-result upserts make
duplicate completion safe. This slice does not implement an outbox, so a process failure between
MongoDB persistence and publication remains a documented reliability gap.

Stop and remove the local containers and volume with `docker compose down --volumes`.
