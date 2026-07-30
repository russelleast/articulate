# ADR-0001 AI Runtime

## Status: Draft

## Context

Selecting an execution runtime for Articulate's knowledge service, where specialised agents manage the flow of information into and out of the Knowledge Model.

The runtime will coordinate agent behaviour, tool invocation, human interaction and long-running architectural reasoning. Candidate approaches include agent frameworks, workflow engines and durable execution platforms.

Episodes 10–12 investigated the architectural responsibilities of an AI-native runtime before comparing implementation technologies. Rather than beginning with products, the investigation established the capabilities the runtime must provide within the wider platform architecture.

## Decision

The runtime selection remains **proposed** pending evaluation of candidate technologies.

The architectural investigation has established that an AI-native runtime is responsible for coordinating durable execution rather than becoming the owner of all application state.

Investigation of memory showed that authoritative knowledge, conversation history and retrieval infrastructure belong to other platform capabilities and should not be treated as responsibilities of the runtime itself.

Investigation of durable execution identified execution state as the principal responsibility of the runtime. Unlike knowledge or conversational context, execution represents work in progress and cannot always be reconstructed safely after interruption.

Candidate runtimes will therefore be evaluated against their ability to support:

- Durable execution across process and infrastructure failures.
- Pause and resume semantics for long-running work.
- Human-in-the-loop execution.
- Safe retry and recovery.
- Execution history and progress tracking.
- Coordination of distributed execution.
- Integration with external tools and authoritative platform services.

The runtime will be selected according to its architectural fit within the overall AI-native platform rather than language preference, ecosystem popularity or familiarity.

## Consequences

The architectural investigation is complete and the evaluation of candidate runtimes can now begin.

The investigation established several architectural boundaries.

The runtime is responsible for preserving the continuity of execution.

The wider platform remains responsible for authoritative knowledge, persistent conversation state, retrieval infrastructure, identity, storage and tool implementations.

These responsibilities are intentionally separated so that reasoning agents remain focused on coordinating work rather than owning application state.

The next stage of ADR 0001 is to evaluate candidate runtime technologies against the architectural drivers established during Episodes 10–12 before selecting the implementation that best satisfies those requirements.

## Additional information

### Initial architectural drivers

- Support agent orchestration.
- Support tool invocation.
- Support human participation and approval.
- Support observable and recoverable execution.
- Avoid unnecessary coupling to a model vendor.
- Support the implementation languages appropriate to each capability.
- Preserve architectural knowledge outside the execution runtime.

### Candidate approaches

- Microsoft Agent Framework
- LangGraph
- Dapr Agents and Dapr Workflows
- Temporal
- Actor-based runtimes

No candidate has yet been selected.