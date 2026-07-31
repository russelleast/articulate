---
episode: 13
title: "Selecting the Agent Runtime"
description: "ADR 0001 concludes by evaluating candidate runtimes against the architectural responsibilities established during the previous investigation, resulting in the selection of Articulate's execution runtime."
season: 2
status: planned
published: false
date: null
topics:
  - Architecture Decisions
  - Agent Runtimes
  - Durable Execution
  - Temporal
  - DAPR
  - LangChain
  - Agent Frameworks
  - Workflow Orchestration
---

# Episode 13 — Selecting the Agent Runtime

In the previous three episodes we've been investigating one of the biggest architectural decisions facing Articulate.

Not which programming language to use.

Not which AI model to choose.

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

## Architecture Before Technology

One of the recurring themes throughout this journal has been that architecture should define the criteria before comparing solutions.

If we begin by asking:

> *Which runtime has the most features?*

we've already started in the wrong place.

Instead we ask:

> *Which runtime best satisfies the responsibilities identified by the architecture?*

Those responsibilities became our evaluation criteria.

| Architectural Responsibility | Importance |
|------------------------------|------------|
| Durable execution | Must have |
| Long-running workflows | Must have |
| Pause and resume | Must have |
| Human-in-the-loop | Must have |
| Failure recovery | Must have |
| Distributed execution | Should have |
| Tool orchestration | Should have |
| Observability | Should have |
| AI-native programming model | Could have |
| Runtime maturity | Could have |

This matrix is the outcome of the previous three episodes.

Only now does it make sense to compare technologies.

---

## Shortlisting the Candidates

There are many agent frameworks and orchestration platforms available today.

Rather than attempting to review every product on the market, I shortlisted the technologies that appeared capable of satisfying the architectural requirements established by ADR 0001.

For Articulate, those candidates were:

- Microsoft Agent Framework with Durable Tasks
- LangChain / LangGraph
- Dapr Agents
- Temporal

It is important to recognise that these technologies are not solving exactly the same problem.

Some primarily focus on building intelligent agents.

Others focus on orchestrating durable execution.

That distinction becomes important during the evaluation.

---

## Microsoft Agent Framework + Durable Tasks

Microsoft Agent Framework provides an excellent programming model for building AI agents.

The addition of Durable Tasks introduces persistent execution, checkpointing, pause and resume semantics and support for human interaction.

For organisations already invested in the Microsoft ecosystem it offers an attractive, integrated developer experience. Built from Symantec Kernal and AutoGen. For my personally with my c# background, this appeals to me. 

### Strengths

- Excellent AI-native programming model.
- Strong integration with Microsoft's AI ecosystem.
- Good support for multi-agent development.
- Durable execution now available through Durable Tasks.
- Familiar tooling for .NET developers.

### Trade-offs

- Durable execution is a relatively new capability.
- Smaller community than more established workflow platforms.
- More tightly coupled to the Microsoft ecosystem.
- Workflow orchestration is only one aspect of a broader agent framework.

---

## LangChain / LangGraph

LangGraph approaches the problem from the perspective of AI reasoning.

Its graph-based execution model naturally represents iterative reasoning, planning and conversational workflows.

Persistence and resumability are available, making it suitable for many AI applications.

### Strengths

- Excellent support for AI reasoning workflows.
- Flexible graph-based execution model.
- Rich ecosystem of LLM integrations.
- Strong focus on agent orchestration.

### Trade-offs

- Primarily designed around reasoning rather than durable operational workflows.
- Long-running execution is not its primary architectural concern.
- Enterprise operational capabilities continue to evolve.
- Better suited to intelligent reasoning than workflow orchestration.

---

## Dapr Agents

Dapr Agents builds upon the broader Dapr platform, combining agent abstractions with cloud-native infrastructure.

For teams already using Dapr this provides natural integration with service invocation, state management, messaging and observability.

Its architecture aligns well with distributed systems.

### Strengths

- Excellent cloud-native architecture.
- Durable execution built on Dapr Workflows.
- Workflow engine backed by Dapr Actors for persistence and recovery.
- Strong integration with pub/sub, state stores, bindings and service invocation.
- Good observability through the Dapr ecosystem.
- Vendor-neutral and Kubernetes-native.

### Trade-offs

- AI framework and workflow runtime are evolving together, so the ecosystem is younger than more established workflow platforms.
- Workflow capabilities are tightly integrated into the Dapr programming model, which may be less attractive if you don't already see value in the wider Dapr platform.
- Smaller community and fewer production references than Temporal for general-purpose workflow orchestration.
- Long-term direction of the Agents framework is still evolving as the project matures.

---

## Temporal

Temporal approaches the problem from a different direction.

It is not primarily an agent framework.

It is a durable execution platform.

Everything in its architecture revolves around preserving execution state, recovering from failures, coordinating long-running workflows and safely managing external side effects.

Those responsibilities align remarkably closely with the architectural responsibilities identified during our investigation.

### Strengths

- Purpose-built for durable execution.
- Excellent support for long-running workflows.
- First-class pause and resume semantics.
- Robust failure recovery.
- Comprehensive execution history.
- Mature operational platform.
- Technology-agnostic programming model.

### Trade-offs

- Not an agent framework.
- Requires an additional framework if richer agent abstractions are required.
- Learning curve around workflow-first thinking.
- Additional operational infrastructure compared to lightweight agent libraries.

---

## Comparing the Candidates

Looking at the evaluation as a whole, an interesting pattern begins to emerge.

| Capability | MAF + Durable Tasks | LangGraph | Dapr Agents | Temporal |
|------------|---------------------|------------|--------------|-----------|
| AI-native programming model | Excellent | Excellent | Good | Limited |
| Durable execution | Good | Good | Good | Excellent |
| Long-running workflows | Good | Moderate | Good | Excellent |
| Human-in-the-loop | Good | Moderate | Good | Excellent |
| Failure recovery | Good | Moderate | Good | Excellent |
| Distributed execution | Good | Moderate | Excellent | Excellent |
| Operational maturity | Good | Good | Good | Excellent |

One conclusion became increasingly clear during this evaluation.

The technologies are not direct competitors.

Microsoft Agent Framework, LangGraph and Dapr Agents all begin with the problem of building intelligent agents.

Temporal begins with the problem of reliably executing long-running work.

That difference mirrors the architectural investigation from the previous episodes.

The runtime's primary responsibility is not reasoning.

It is execution.

---

## The Decision

One of the most interesting outcomes of this investigation is that the architectural process changed the question.

We began by asking:

> **Which agent runtime should we choose?**

We finished by asking:

> **Which technology is best suited to managing durable execution?**

Once we asked the right question, the decision became much clearer.

Temporal most closely aligns with the architectural drivers established throughout Episodes 10, 11 and 12.

Its strengths directly address the responsibilities identified by the architecture rather than treating them as secondary capabilities.

That does not make the other technologies inferior.

Each is solving a different problem.

Agent frameworks remain valuable for implementing intelligent behaviour.

Temporal provides the durable execution layer responsible for reliably coordinating that behaviour over time.

Rather than competing with one another, they have the potential to complement one another.

---

## ADR 0001

With the investigation complete, ADR 0001 can now move from **Proposed** to **Accepted**.

### Decision

Articulate will adopt **Temporal** as its durable execution runtime.

### Rationale

The decision is based on architectural alignment rather than product popularity or ecosystem preference.

The investigation concluded that the runtime's primary responsibility is durable execution, and Temporal is purpose-built for exactly that responsibility.

Agent frameworks remain an implementation choice that can evolve independently as the AI ecosystem matures.

---

## Closing

This marks the completion of the first major architectural investigation in the Articulate Journal.

We began by asking a technology question.

We ended by answering an architectural one.

The runtime is not responsible for knowledge.

It is not responsible for memory.

Its primary responsibility is durable execution.

Once that became clear, the technology decision became almost inevitable.

The conceptual architecture is now complete.

From the next episode onwards, we can finally begin turning that architecture into software.