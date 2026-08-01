---
id: adr-0001
title: AI Runtime
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

---
id: adr-0002
title: accepted architectural history is immutable
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0002-accepted-architectural-history-is-immutable.md
---

# ADR-0002 — Accepted architectural history is immutable

## Status

Accepted

## Context

Accepted architectural knowledge must never be overwritten or deleted. New knowledge supersedes previous knowledge, allowing the system to reconstruct historical architectural viewpoints.


## Decision

The Knowledge Model shall preserve accepted architectural history.

Once knowledge has been accepted into the authoritative Knowledge Model, it shall never be modified or deleted in a way that rewrites previously accepted architectural understanding.

Architectural evolution shall occur through the introduction of new knowledge that supersedes or extends existing knowledge rather than replacing it.

Accepted knowledge shall retain sufficient temporal, provenance and baseline information to reconstruct architectural viewpoints at different points in time.

Historical architectural states, current architectural understanding and intended future architecture shall therefore coexist within the Knowledge Model, allowing the system to answer questions about how the architecture has evolved over time without losing previously accepted knowledge.


## Consequences

The Knowledge Model becomes an append-oriented repository of architectural knowledge rather than a mutable store of current state.

New architectural understanding is represented by additional knowledge that supersedes earlier assertions rather than modifying historical records.

Historical architectural viewpoints can be reconstructed using baselines and temporal applicability, enabling comparison between previous, current and future architectures.

Knowledge evolution becomes fully traceable, allowing reasoning agents and users to understand not only the current architecture but also how and why it changed.

Storage requirements will increase over time because accepted knowledge is retained rather than deleted, but this provides complete architectural provenance and supports explainability, auditability and historical reasoning.

---
id: adr-0003
title: claims are the fundamental unit of architectural knowledge
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0003-claims-are-the-fundamental-unit-of-architectural-knowledge.md
---

# ADR-0003 — Claims are the fundamental unit of architectural knowledge

## Status

Accepted

## Context

All architectural knowledge is represented as claims containing provenance, confidence, temporal applicability and supporting evidence. Architectural concepts such as decisions, discoveries and solution designs become aggregates of related claims.


## Decision

The canonical representation of architectural knowledge within the Knowledge Model shall be the claim.

A claim represents a single architectural assertion together with the metadata required to understand and reason about that assertion. Every accepted claim shall retain provenance, confidence, temporal applicability and any supporting evidence necessary to explain why the claim exists.

Architectural concepts such as discoveries, Architecture Decision Records, solution designs and reviews shall be represented as aggregates of related claims rather than as independent knowledge representations.

Specialised architectural views, including structural graphs, technology inventories, governance views and other derived representations, shall be constructed from claims rather than becoming independent sources of truth.

The claim therefore becomes the fundamental unit through which architectural knowledge is captured, evolved and reasoned about.

## Consequences

The Knowledge Model has a single canonical representation for architectural knowledge, simplifying reasoning and knowledge evolution.

Knowledge originating from different sources, including discovery, solution design and architectural decisions, can be represented consistently while retaining source-specific metadata through provenance.

Architectural projections such as graphs, inventories and reports become derived representations rather than authoritative stores, ensuring that all architectural views remain consistent with the underlying knowledge.

Reasoning agents can operate against a common knowledge representation, allowing confidence, evidence, temporal applicability and provenance to be considered consistently regardless of where the knowledge originated.

The Knowledge Service becomes responsible for interpreting, validating and projecting claims into specialised architectural views while preserving claims as the authoritative source of architectural knowledge.

---
id: adr-0004
title: knowledge evolution through staged proposals
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0004-knowledge-evolution-through-staged-proposals.md
---

# ADR-0004 — Knowledge evolution through staged proposals

## Status

Accepted

## Context

Changes do not enter the Knowledge Model directly. All incoming information is staged as proposed knowledge, reconciled, validated and assessed before being merged into the authoritative model.

## Decision

All information entering the Knowledge Model shall first be represented as proposed knowledge within a staging area.

Proposed knowledge shall undergo interpretation, reconciliation, validation and assessment before it can become part of the authoritative Knowledge Model.

Where proposals require human review or additional reasoning, they shall remain durably persisted within the staging area until the proposal reaches a final outcome.

Before merging, proposals shall be revalidated against the current architectural baseline to ensure that changes remain valid if the authoritative Knowledge Model has evolved since the proposal was originally assessed.

Only successfully reconciled and validated proposals may be merged into the Knowledge Model. Direct modification of authoritative knowledge is prohibited.

## Consequences

Knowledge evolution becomes a governed process rather than a direct persistence operation.

All proposed changes follow a consistent lifecycle regardless of whether they originate from discovery, solution design, architectural decisions, reasoning agents or human input.

Long-running reviews and human approval workflows become first-class architectural capabilities, allowing proposals to remain pending without risking loss of context or partial updates.

Revalidation before merge prevents proposals from being accepted against an outdated understanding of the architecture, reducing the risk of introducing inconsistent or conflicting knowledge.

The Knowledge Service becomes responsible for orchestrating the knowledge evolution process, ensuring that the authoritative Knowledge Model can only evolve through controlled, validated and auditable operations.