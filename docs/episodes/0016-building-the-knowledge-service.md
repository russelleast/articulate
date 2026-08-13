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

### Phase 1 - basic application skeleton

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

### Phase 2 - what is the first agent and why

Some of the episodes already provide context to the behaviour that we need to ingest claims and how we form knowledge. 

This phase looks at the next step from persisting a proposed claim. 

Agent is ReviewProposedClaim with DCL 

| Question                | Claim Review                                                           |
| ----------------------- | ---------------------------------------------------------------------- |
| Problem                 | Proposed claims may be valid data but unclear architectural assertions |
| Capability              | Review Proposed Claim                                                  |
| Input                   | Valid proposed claim                                                   |
| Outcomes                | Ready / Ambiguous / Insufficient                                       |
| Reasoning required?     | Yes                                                                    |
| Agent justified?        | Likely yes                                                             |
| Knowledge required?     | Initially little or none                                               |
| Side effects            | Record review result                                                   |
| Authoritative mutation? | No                                                                     |
| Failure consequence     | Claim remains safely staged                                            |
| Next capability         | Interpretation, Remediation                                                        |

This sets a template for defining the capbility and understand how it fits in the overall picture and every agent-capability pairing.

### Phase 3 - asynchronous claim review

The first reasoning slice preserves the capability boundaries established by DCL:

```text
ClaimSimulator -> KnowledgeApi -> MongoDB -> Dapr Pub/Sub -> RabbitMQ
    -> KnowledgeApi internal ReviewProposedClaim Agent
    -> Dapr Conversation -> Ollama/Gemma 3 -> RecordReviewResult -> MongoDB
```

Claims now carry a stable `ClaimId` and structured provenance `Activity`. KnowledgeApi publishes the
complete claim only after persistence succeeds. The review agent performs one narrow relevance
judgement using a Prompty instruction and a structured `Ready` or `NotReady` response. It neither
assesses truth nor reads or mutates authoritative architectural knowledge.

Review results are recorded idempotently by `ClaimId` through KnowledgeApi's internal repository
boundary; no review-result RPC is exposed. Only a
recorded `Ready` result is published to the future reconciliation topic. `NotReady` remediation and
the persist/publish outbox gap remain later Knowledge Evolution concerns.

RabbitMQ is replaceable behind Dapr Pub/Sub, Ollama is replaceable behind Dapr Conversation, Redis
contains only agent execution markers, and MongoDB continues to own proposed knowledge and review
evidence. OpenTelemetry spans and DCL-named metrics describe capability, effect, policy, and outcome
behaviour without recording claims or prompts.
