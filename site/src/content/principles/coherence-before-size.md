---
id: principle-coherence-before-size
title: Coherence Before Size
summary: Prefer coherent architectural boundaries over arbitrary limits on component or agent size.
status: current
published: 2026-07-24
updated: 2026-07-24
principle: >-
  Keep responsibilities coherent. Split agents, capabilities, services or workflows when additional
  responsibility makes them harder to understand, secure, evaluate, operate or evolve—not simply
  because smaller components appear more architecturally sophisticated.
rationale: >-
  Scaling up and scaling out move complexity to different places. A larger agent or component
  concentrates complexity internally through broader responsibilities, larger contexts and greater
  coupling. Splitting work across many smaller agents or components distributes complexity into
  routing, coordination, state management, context transfer, observability and failure handling.
  Decomposition does not automatically remove complexity. It often relocates it. The purpose of a
  boundary is therefore not to make something small. It is to preserve coherence.
consequences:
  - Some agents or components may remain relatively large when their responsibilities are cohesive.
  - Decomposition should be driven by clarity, security, evaluation, operability and evolvability.
  - Premature decomposition can create unnecessary routing and orchestration complexity.
  - Fewer, coherent components may initially be easier to understand and operate.
  - Larger coherent components may eventually need to be split as responsibilities diverge.
  - Every new boundary may introduce communication, context, trust, failure and evaluation concerns.
  - The principle does not argue for monoliths or large agents by default.
  - The principle requires deliberate decomposition rather than decomposition for its own sake.
applies_to:
  - Agents
  - Capabilities
  - Services
  - Workflows
  - Knowledge-model boundaries
  - Runtime components
related_episodes:
  - 0004-system-characteristics-the-properties-every-system-needs
related_decisions: []
related_patterns: []
related_architecture: []
featured: true
---
