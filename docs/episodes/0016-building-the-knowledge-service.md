---
episode: 16
title: "Building the Knowledge Service"
description: "The transition from conceptual architecture to software through the Knowledge Service, its boundaries, APIs, project structure and foundational abstractions."
season: 3
status: planned
published: false
date: null
topics:
  - Knowledge Service
  - Service boundaries
  - Knowledge APIs
  - Project structure
  - Foundational abstractions
  - Architectural implementation
---

# Episode 16 – Building the Knowledge Service

**Question:** *How do we turn the conceptual architecture into software?*

After fifteen episodes establishing the conceptual architecture, implementation finally begins.

This episode creates the Knowledge Service, the central service responsible for knowledge evolution and knowledge reasoning.

The implementation establishes the project structure, service boundaries, APIs and foundational abstractions that future episodes will build upon.

It marks the transition from architectural thinking to executable software.

## Notes

Actions performed:

### Phase 1

- Created for the first capability: CaptureProposedKnowledge
- Setup up my harness.
  - Codex as the coding agent
  - Skills for Plan, Implement, Verify
  - Hook, for verify
  - Agents.md hierachry
  - DCL MCP server
- Created the Knowledge API service (Python)
  - Uses Dapr
    - Secrets building block for retrieving the Mongo connection string
    - Zipkin for open telemetry
- Created the Claims Simulator (Python) 
  - FastAPI to fetch scenerios and to invoke a scenario which posts claims to the Knowledge API over gRPC
- Docker compose to host the services, dapr sidebar, zipkin and Mongo db
