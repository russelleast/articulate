---
id: adr-0001
title: AI Runtime
summary: Articulate needs a runtime that can coordinate long-running, recoverable agent work without taking ownership of authoritative knowledge or application state.
status: accepted
related_episodes:
  - 0010-selecting-an-agent-runtime
  - 0011-agent-memory
  - 0012-durable-execution
repository_paths:
  - docs/adrs/0001-ai-runtime.md
---

# ADR-0001 — AI Runtime

## Status

Accepted

## Context

Selecting an execution runtime for Articulate's AI-native platform, where specialised agents coordinate architectural reasoning, interact with external tools and evolve the Knowledge Model.

The runtime is responsible for coordinating long-running work, agent collaboration, human interaction and reliable execution across distributed services.

Episodes 10–13 investigated this decision as an architectural process rather than a technology comparison.

Rather than beginning with products, the investigation established the responsibilities the runtime must fulfil within the wider platform architecture before evaluating candidate technologies.

The investigation concluded that the runtime is **not** the owner of application state.

Authoritative knowledge belongs to the Knowledge Model.

Conversation history belongs to the conversation capability.

Retrieval infrastructure, embeddings and vector indexes belong to the retrieval layer.

Persistent application data belongs to the wider platform.

The runtime's primary architectural responsibility is the durable coordination of work.

---

## Decision

Articulate will adopt **Dapr Agents** as its AI runtime, using **Dapr Workflows** for durable execution.

The decision is based on architectural fit rather than language preference, ecosystem popularity or vendor alignment.

The runtime satisfies the architectural responsibilities established during the investigation, including:

- Durable execution across process and infrastructure failures.
- Pause and resume semantics for long-running work.
- Human-in-the-loop execution.
- Safe retry and recovery.
- Execution history and progress tracking.
- Coordination of distributed execution.
- Integration with external tools and platform capabilities.

Beyond durable execution, Dapr provides a consistent distributed application runtime through its building blocks for service invocation, state management, pub/sub messaging, secrets and observability.

This broader platform aligns with Articulate's architectural direction while avoiding an early commitment to a particular cloud provider or hosting model.

Cloud provider selection and deployment architecture remain separate architectural decisions.

---



## Consequences

The runtime architecture for Articulate is now established.

Durable execution becomes a first-class architectural capability rather than an implementation concern.

Execution state remains the responsibility of the runtime.

Authoritative knowledge, conversation history, retrieval infrastructure and persistent application data remain separate platform capabilities.

This separation allows reasoning agents to coordinate work without becoming responsible for application state.

The architecture also preserves flexibility for future infrastructure decisions.

The runtime does not require an early commitment to Kubernetes, a specific cloud provider or a particular hosting platform.

These decisions will be evaluated independently as the implementation evolves.

Future episodes can now begin implementing the runtime architecture with a stable architectural foundation.

---

## Additional Information

### Rationale

The investigation deliberately separated architectural responsibilities before comparing technologies.

Several strong candidates were evaluated, including:

- Microsoft Agent Framework with Durable Tasks
- LangChain / LangGraph
- Dapr Agents with Dapr Workflows
- Temporal

The evaluation demonstrated that these technologies are not direct competitors.

Some primarily focus on agent programming.

Others specialise in durable workflow orchestration.

Dapr combines durable execution with a broader distributed application runtime.

Although Temporal remains an excellent workflow platform, Articulate requires more than workflow orchestration.

The architecture benefits from a runtime that provides durable execution while also supporting distributed communication, infrastructure abstraction and future architectural evolution through a consistent programming model.

For these reasons Dapr provided the strongest overall architectural alignment.

---

### Architectural Drivers

The selected runtime must:

- Support durable execution.
- Coordinate long-running workflows.
- Support human participation and approval.
- Provide observable and recoverable execution.
- Integrate cleanly with external tools.
- Support distributed execution.
- Avoid unnecessary coupling to AI model vendors.
- Preserve architectural knowledge outside the runtime.
- Remain flexible with respect to future hosting and cloud decisions.

---

## Alternatives Considered

### Microsoft Agent Framework + Durable Tasks

Provides an excellent AI-native programming model with integrated durable execution.

Strong candidate for Microsoft-centric environments but places greater emphasis on agent programming than broader platform capabilities.

### LangChain / LangGraph

Excellent framework for AI reasoning and orchestration.

Better suited to reasoning workflows than acting as the foundation of a distributed application platform.

### Temporal

Outstanding durable workflow platform with exceptional operational maturity.

Provides best-in-class workflow orchestration but intentionally focuses on execution rather than broader distributed application capabilities.

### Dapr Agents + Dapr Workflows (Selected)

Combines durable execution with a broader distributed application runtime.

Provides the best overall architectural fit for Articulate by integrating workflow orchestration, infrastructure abstraction and distributed application building blocks while preserving flexibility for future hosting decisions.

---

## Related Episodes

- Episode 10 – Defining the Runtime Requirements
- Episode 11 – Memory in AI-Native Systems
- Episode 12 – Durable Execution and Long-Running Reasoning
- Episode 13 – Selecting the Agent Runtime
