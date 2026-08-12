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

Start MongoDB, Zipkin, KnowledgeApi with its Dapr sidecar, and the one-shot ClaimSimulator:

```sh
docker compose up --build
```

The simulator reports that 50 claims were captured. Inspect persisted proposed knowledge with:

```sh
docker compose exec mongodb mongosh articulate --quiet \
  --eval 'db.getCollection("proposed-knowledge").countDocuments({})'
```

Zipkin is available at <http://localhost:9411>. Stop and remove the local containers and volume with
`docker compose down --volumes`.
