# Knowledge API vertical slice

The first Knowledge API slice proves the path from an external gRPC consumer through the
`CaptureProposedKnowledge` capability to MongoDB. It intentionally does not implement knowledge
reasoning, reconciliation, assessment or merge.

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

Start MongoDB, Zipkin, the OpenTelemetry Collector, KnowledgeApi with its Dapr sidecar, and
ClaimSimulator:

```sh
docker compose up --build
```

ClaimSimulator's Swagger interface is available at <http://localhost:8000/docs>. Use it to list the
available scenarios with `GET /scenarios`, then run the existing 50-claim scenario with
`POST /scenarios/first-vertical-slice/run`.

The execution response reports the total, successfully submitted, and failed claim counts. Inspect
persisted proposed knowledge with:

```sh
docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("proposed-knowledge").countDocuments({})'
```

Zipkin is available at <http://localhost:9411>. Select the `KnowledgeApi` service and run a query to
locate `SubmitArchitecturalClaims`. Open the trace to inspect the `Validate Contract`,
`Capture Proposed Knowledge`, and `Persist Proposed Knowledge` spans in one execution hierarchy.

The application exports traces and metrics to the OpenTelemetry Collector over OTLP. Inspect the DCL
observations exposed by the Collector at <http://localhost:9464/metrics>:

```sh
curl --silent http://localhost:9464/metrics \
  | grep -E 'capture_proposed_knowledge_duration|persist_claim_count|rejected_count'
```

Successful scenarios emit capability duration and persistence count. The rejection counter appears
after a capability reaches the `Rejected` outcome; invalid transport contracts are rejected before
capability execution and are not included in that counter.

Stop and remove the local containers and volume with `docker compose down --volumes`.
