---
episode: 13
title: "Selecting the Agent Runtime"
description: "ADR 0001 concludes by evaluating candidate runtimes against the architectural responsibilities established during the investigation, resulting in the selection of Articulate's execution runtime."
season: 2
status: current
published: 2026-07-31
date: 2026-07-31
topics:
  - Architecture Decisions
  - Agent Runtimes
  - Durable Execution
  - Workflow Orchestration
  - Dapr
  - Temporal
thumbnail: /media/episodes/0013/episode-0013-thumbnail.png
thumbnail_alt: "Presenter beside the title Selecting the Agent Runtime and a note that several credible runtime architectures were evaluated."
youtube_url: https://youtu.be/FdGwipmJQNo
---

# Episode 13 — Selecting the Agent Runtime

Over the previous three episodes we've been investigating one of the biggest architectural decisions facing Articulate.

Not which programming language to use.

Not which AI model to use.

But what runtime should actually execute our agents.

Rather than comparing technologies first, we started by understanding the architectural problem.

We discovered that what AI often calls *memory* is actually a collection of different architectural responsibilities.

The Knowledge Model owns architectural knowledge.

Conversation history belongs to the conversation service.

Embeddings and vector indexes belong to the retrieval infrastructure.

Persistent data belongs to the platform.

That left one remaining responsibility.

**Execution.**

How do we reliably manage work that may take minutes, hours or even days to complete?

That question gave us the architectural criteria we needed.

Now we can finally evaluate the available technologies.

---

# Architecture Before Technology

One of the recurring themes throughout this journal has been that architecture should define the criteria before comparing solutions.

If we begin by asking:

> *Which runtime has the most features?*

we've already started in the wrong place.

Instead we ask:

> *Which runtime best satisfies the responsibilities identified by the architecture?*

The previous investigation produced the following architectural drivers.

| Architectural Responsibility | Importance |
|-----------------------------|------------|
| Durable execution | Essential |
| Long-running workflows | Essential |
| Pause and resume | Essential |
| Human-in-the-loop | Essential |
| Failure recovery | Essential |
| Distributed execution | Important |
| Tool orchestration | Important |
| Observability | Important |
| Hosting and cloud neutrality | Important |
| AI-native programming model | Desirable |
| Runtime maturity | Desirable |

Notice what isn't listed.

Programming language.

Popularity.

GitHub stars.

Vendor.

Those may influence a decision, but they should never define it.

Only now does it make sense to compare technologies.

---

# Shortlisting the Candidates

There are dozens of AI frameworks available today.

Rather than attempting to review every product on the market, I shortlisted the technologies that appeared capable of satisfying the architectural responsibilities identified by ADR 0001.

For Articulate, those candidates were:

- Microsoft Agent Framework with Durable Tasks
- LangChain / LangGraph
- Dapr Agents
- Temporal

These technologies are frequently discussed together, but they are not solving exactly the same problem.

Some primarily focus on building intelligent agents.

Others focus on durable execution.

Some attempt to combine both.

Understanding that distinction is already an important architectural insight.

---

# Microsoft Agent Framework + Durable Tasks

Microsoft Agent Framework provides an excellent programming model for building AI agents.

The addition of Durable Tasks introduces persistent execution, checkpointing, pause and resume semantics and support for human interaction.

For organisations already invested in the Microsoft ecosystem it presents a compelling integrated platform.

## Strengths

- Excellent AI-native programming model.
- Strong multi-agent abstractions.
- Durable execution integrated into the framework.
- Familiar tooling for .NET developers.
- Tight integration with Microsoft's AI ecosystem.

## Trade-offs

- Durable execution is a relatively recent addition.
- More closely aligned with the Microsoft ecosystem.
- The wider ecosystem is still evolving.
- Strong focus on agent development rather than general workflow orchestration.

---

# LangChain / LangGraph

LangGraph approaches the problem from the perspective of AI reasoning.

Its graph-based execution model naturally represents planning, reasoning and conversational workflows.

Persistence and resumability are available, making it well suited to many AI-native applications.

## Strengths

- Excellent reasoning model.
- Flexible graph-based execution.
- Rich ecosystem of LLM integrations.
- Strong support for agent orchestration.

## Trade-offs

- Primarily optimised for reasoning workflows.
- Long-running operational workflows are not its primary architectural concern.
- Enterprise operational capabilities continue to mature.
- Better suited to orchestrating intelligence than orchestrating business processes.

---

# Dapr Agents

Dapr Agents takes a different approach.

Rather than focusing solely on agents, it builds upon the wider Dapr runtime, combining agent abstractions with durable workflows, actors and distributed application building blocks.

This creates a broader application platform rather than simply another AI framework.

## Strengths

- Excellent cloud-native architecture.
- Durable execution through Dapr Workflows.
- Strong distributed systems model.
- Infrastructure abstraction through Dapr building blocks.
- Excellent integration with state, pub/sub, service invocation and observability.
- Hosting model remains flexible without requiring an early commitment to Kubernetes or a specific cloud provider.

## Trade-offs

- The Agents framework is still relatively young.
- The platform introduces a broader runtime than dedicated workflow engines.
- Teams must understand the wider Dapr programming model to gain the full benefit.
- The long-term evolution of the Agents framework is still emerging.

---

# Temporal

Temporal approaches the problem from the opposite direction.

It is not primarily an agent framework.

It is a durable execution platform.

Everything in its architecture revolves around preserving execution state, recovering from failures, coordinating long-running workflows and safely managing external side effects.

## Strengths

- Purpose-built durable execution.
- Excellent support for long-running workflows.
- Outstanding reliability and failure recovery.
- Comprehensive execution history.
- Technology-agnostic programming model.
- Highly mature workflow platform.

## Trade-offs

- Not an agent framework.
- Requires a separate framework for richer AI abstractions.
- Introduces another platform into the overall architecture.
- Solves execution extremely well, but little beyond that.

---

# Comparing the Candidates

Looking at the evaluation as a whole, an interesting pattern begins to emerge.

| Capability | MAF + Durable Tasks | LangGraph | Dapr Agents | Temporal |
|------------|---------------------|-----------|-------------|-----------|
| AI programming model | ✓✓✓ | ✓✓✓ | ✓✓ | ✓ |
| Durable execution | ✓✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Long-running workflows | ✓✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Human-in-the-loop | ✓✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Failure recovery | ✓✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Distributed execution | ✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Infrastructure capabilities | ✓ | ✓ | ✓✓✓ | ✓ |
| Hosting flexibility | ✓✓ | ✓✓ | ✓✓✓ | ✓✓✓ |
| Operational maturity | ✓✓ | ✓✓ | ✓✓ | ✓✓✓ |

The comparison also reveals something unexpected.

These technologies are not direct competitors.

Microsoft Agent Framework begins with agents.

LangGraph begins with reasoning.

Temporal begins with durable execution.

Dapr attempts to bring these responsibilities together as part of a broader distributed application platform.

The question therefore becomes less about which technology has the most features...

...and more about which architectural philosophy best aligns with Articulate.

---

# The Decision

When this investigation began, I expected the outcome to be a straightforward comparison between agent runtimes.

Instead, the investigation fundamentally changed the question.

We began by asking:

> **Which agent runtime should we choose?**

We finished by asking:

> **What responsibilities should the runtime own?**

That distinction matters.

The runtime is not responsible for architectural knowledge.

It is not responsible for conversational memory.

It is not responsible for retrieval.

Its primary responsibility is durable execution.

However, Articulate is more than a workflow engine.

It is a distributed AI-native platform.

As the architecture has evolved, another requirement has become increasingly important.

The runtime should not force an early decision about cloud provider, hosting platform or deployment model.

Those are architectural decisions that belong later in the journey.

Dapr's sidecar architecture provides a consistent runtime API regardless of the eventual hosting platform, while also supplying durable workflows, distributed execution and infrastructure abstractions through a single programming model.

Rather than introducing separate technologies for workflow orchestration, service invocation, state management and messaging, Dapr provides a coherent foundation that aligns naturally with the architecture Articulate is evolving towards.

Temporal remains an outstanding durable workflow platform and would have been an excellent choice if durable execution were the only responsibility under consideration.

For Articulate, however, the broader platform capabilities offered by Dapr provide a better overall architectural fit.

---

# ADR 0001 

> this is not the real ADR, just here for brevity

With the investigation complete, ADR 0001 can now move from **Proposed** to **Accepted**.

## Decision

Articulate will adopt **Dapr Agents** as its agent runtime, with **Dapr Workflows** providing durable execution and orchestration.

## Rationale

The decision is based on architectural alignment rather than popularity or ecosystem preference.

Dapr satisfies the durable execution responsibilities established during the investigation while also providing a consistent distributed application runtime that preserves future flexibility around hosting and cloud deployment.

Cloud provider selection, production hosting and deployment architecture remain separate architectural decisions and will be evaluated in future episodes.

---

# Closing

This marks the completion of the first major architectural investigation in the Articulate Journal.

We began by asking a technology question.

We ended by answering an architectural one.

Good architecture is rarely about choosing the most impressive technology.

It is about understanding the problem well enough that the technology decision becomes obvious.

With ADR 0001 now accepted, the conceptual architecture is complete.

From the next episode onwards, we can finally begin turning that architecture into software.
