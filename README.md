# Articulate

> A production-oriented reference architecture exploring AI-native systems.

Articulate is an open-source reference implementation and architectural journal exploring how AI-native systems are designed, implemented, operated, and evolved.

The project combines three things:

- a production-oriented software system;
- a public reference architecture;
- a living narrative of the decisions, experiments, trade-offs, failures, and lessons that shape it.

The software is not the sole outcome. It is evidence of the architectural thinking.

## Why Articulate exists

Most technical material presents either a finished architecture or an isolated tutorial. It rarely shows how an architecture emerges: what problem existed, which assumptions were made, what alternatives were considered, what failed, and why the system changed.

Articulate is intended to make that reasoning visible.

The project explores questions such as:

- How should conversation act as a primary interface to an AI-native system?
- What belongs in conversational state, workflow state, project memory, and long-lived knowledge?
- When should an agent become a durable runtime participant?
- How should retrieval, memory, orchestration, streaming, and human approval work together?
- How can capability declarations influence implementation, governance, and runtime behaviour?
- What does production-grade observability mean for systems that include probabilistic reasoning?

## Architectural approach

Articulate reasons from:

```text
Problem
   ↓
Principles
   ↓
Capabilities
   ↓
Architecture
   ↓
Runtime
   ↓
Technology
```

Technology choices are important, but they follow architectural intent rather than define it.

## A reference architecture with narrative

Articulate is documented through **Episodes**. Each Episode investigates one architectural question and connects the reasoning to working software.

An Episode may include:

- the problem and context;
- assumptions and constraints;
- alternatives and trade-offs;
- the decision;
- an ADR;
- diagrams and models;
- source code and tests;
- runtime evidence;
- lessons learned;
- what changed afterwards.

The repository provides the evidence. The journal explains its significance.

## Experimental media production

Articulate also includes an experimental AI-assisted publishing workflow under [`production/`](production/). It supports turning canonical written Episodes into derived media such as narration, video, slides and diagrams while preserving traceability to the source journal.

## Repository structure

```text
.
├── docs/
│   ├── architecture/   # Current architecture, system views, runtime models
│   ├── adr/            # Architectural Decision Records
│   ├── episodes/       # Narrative investigations into architectural questions
│   ├── patterns/       # Reusable AI-native and distributed-system patterns
│   └── reference/      # Stable reference material, glossaries, and specifications
├── examples/           # Focused examples derived from the reference implementation
├── production/         # AI-assisted publishing workflow for derived media
├── src/                # Production implementation
├── tests/              # Automated tests and architectural fitness functions
└── .github/            # Repository automation, templates, and governance
```

The structure will evolve with the architecture. Empty folders represent intended concerns, not fixed module or deployment boundaries.

## Project status

Articulate is at the beginning of a new architectural journey. The initial work will establish the vision, principles, system context, and first architectural Episodes before committing to detailed runtime or technology choices.

Early decisions should be treated as hypotheses to test, not permanent truths.

## Guiding principles

- **Architecture before technology** — begin with the problem and required capabilities.
- **Production intent** — implemented capabilities should account for security, reliability, operability, and evolution.
- **Evidence over assertion** — use working software, tests, diagrams, and runtime observations to support decisions.
- **Narrative over snapshots** — document why the system changed, not only its current state.
- **Honest experimentation** — record failed approaches and revised assumptions.
- **Human accountability** — keep consequential decisions understandable, governable, and reviewable.
- **Durable learning** — favour principles that outlive individual frameworks and vendors.

## Initial areas of exploration

The first phase is expected to investigate:

- conversation as the primary interface;
- the conversational spine;
- streaming interaction;
- context engineering;
- retrieval-augmented generation;
- architectural and conversational memory;
- hidden checklists and structured reasoning support;
- agent and workflow boundaries;
- durable execution;
- human-in-the-loop control;
- AI observability and governance;
- capability-driven architecture using DCL.

These are research themes, not a promised implementation sequence.

## Contributing

Articulate is currently being established as a coherent reference implementation and body of architectural work. Contribution guidance will evolve as the first architectural baseline is defined.

For now, discussion should focus on assumptions, trade-offs, alternative models, failure modes, and evidence rather than framework preference alone.

## Licence

Articulate is licensed under the Apache License 2.0.

See the [LICENSE](LICENSE) file for details.
