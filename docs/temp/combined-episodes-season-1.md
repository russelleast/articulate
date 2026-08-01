---
id: episode-0001
title: Why Articulate Exists
summary: >
  Why architectural knowledge becomes fragmented, why that matters, and why
  Articulate exists to explore a different AI-native approach.
published: 2026-07-12
updated: 2026-07-12
status: current
sequence: 1
season: foundations
topics:
  - architectural-knowledge
  - ai-native-architecture
  - architectural-intelligence
questions:
  - Can architecture become a continuously evolving body of knowledge instead of a collection of disconnected documents?
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0001-why-articulate-exists.md
featured: false
thumbnail: /media/episodes/0001/episode-0001-thumbnail-a-fragmented-architecture.png
youtube_url: https://youtu.be/NISywkx-xW0
---

# Episode 0001 – Why Articulate Exists

> *"Architecture is not difficult because systems are complex. It is difficult because knowledge is fragmented, constantly changing and never complete."*

## Introduction

After three decades building software and more than a decade working as an architect, I've come to appreciate that architecture is rarely constrained by technology alone.

Most modern technology is remarkably capable.

Cloud platforms can scale globally. Frameworks are mature. Infrastructure can be provisioned in minutes. AI can generate code, explain documentation and automate many development tasks.

Yet despite all of these advances, one problem remains remarkably consistent.

Understanding the architecture itself.

Not the diagrams.

Not the documentation.

The architecture.

Regardless of the organisation, industry or technology stack, architects spend a significant proportion of their time trying to answer surprisingly simple questions.

* What does the current architecture actually look like?
* Why was it designed this way?
* What changed?
* Which decisions are still valid?
* What will happen if we change this component?
* Can we trust the documentation?
* Who knows the answer?

These questions rarely have straightforward answers.

This episode explores why I believe that problem exists, why existing tools only solve part of it, and why I think recent advances in AI make it worth exploring a different approach.

---

## Architecture Is About Change

One of the simplest definitions of architecture is that it exists to enable change.

Architects aren't employed to draw diagrams.

They're employed to help organisations make good decisions about change.

Introducing new capabilities.

Reducing risk.

Balancing trade-offs.

Managing technical debt.

Improving resilience.

Supporting business strategy.

Everything ultimately comes back to understanding how today's architecture can safely evolve into tomorrow's.

To do that well requires understanding the current state.

Unfortunately, that is often the hardest part.

---

## The Reality of Modern Architecture

Architecture knowledge is rarely found in one place.

Instead, it is scattered across an organisation.

Some information lives in source code.

Some in Infrastructure as Code.

Some in ADRs.

Some in Confluence.

Some in diagrams.

Some in slide decks.

Some in monitoring platforms.

Some exists only in the memories of people who may have moved on years ago.

Each source contains part of the truth.

None contains the whole picture.

Even worse, those sources are continuously changing.

Documentation slowly becomes outdated.

Diagrams become disconnected from reality.

Projects introduce new technologies.

Teams change.

Businesses evolve.

The architecture moves forward while our understanding of it slowly falls behind.

This isn't the fault of architects.

It's simply the consequence of architecture being a living system rather than a static asset.

---

## The Limits of Today's Tools

The industry already has excellent tools.

Confluence is good at documentation.

Git is excellent at versioning files.

Terraform manages infrastructure.

Draw.io, Mermaid, PlantUML and C4 produce excellent diagrams.

Enterprise Architecture Management platforms help organisations catalogue systems and relationships.

The problem is not that these tools are poor.

The problem is that none of them truly understand the architecture.

Each tool represents one projection of reality.

A diagram is a view.

An ADR records a decision.

Source code records implementation.

Infrastructure describes deployment.

Documentation explains concepts.

The architect is left connecting those pieces together.

In other words, the architecture exists largely in people's heads.

---

## The Cost of Fragmented Knowledge

When architectural knowledge becomes fragmented, every architectural activity becomes more difficult.

Understanding the current state takes longer.

Designs duplicate existing capabilities because nobody knows they already exist.

Architectural decisions are forgotten and later repeated.

Impact analysis becomes manual investigation.

Documentation slowly loses relevance.

Architects spend more time searching for information than reasoning about solutions.

None of these problems are individually catastrophic.

Collectively, they consume an enormous amount of time and increase uncertainty across every project.

---

## Why Now?

Many of these observations are not new.

I have been thinking about them for years.

The difference is that I now believe we finally have technology capable of helping.

Large language models are not interesting because they can generate code.

They are interesting because they can reason across large collections of unstructured information.

They can identify patterns.

Summarise documents.

Highlight contradictions.

Ask follow-up questions.

Extract structure.

Work with incomplete evidence.

None of these capabilities replace architectural thinking.

Instead, they augment it.

That changes the kinds of tools we can realistically build.

For the first time, it feels practical to imagine software that helps architects understand architecture rather than simply document it.

---

## The Vision

Articulate began as a side project to scratch my own itch.

Like many personal projects, it started small.

An idea here.

A prototype there.

Several false starts.

More discarded ideas than successful ones.

Over time those ideas converged into a much broader question.

**Can architecture become a continuously evolving body of knowledge instead of a collection of disconnected documents?**

That single question sits at the heart of Articulate.

It is not intended to replace architects.

Nor is it intended to generate documentation automatically.

Instead, it explores whether AI can become a genuine architectural collaborator.

Helping architects:

* discover knowledge,
* challenge assumptions,
* understand trade-offs,
* maintain architectural context,
* reason about change,
* preserve decisions,
* and continuously improve their understanding of complex systems.

Whether that proves achievable remains to be seen.

That uncertainty is precisely why this project exists.

---

## Principles Before Features

One of the goals of this journal is to avoid beginning with technology.

Before discussing services, databases, frameworks or AI models, I want to understand the architectural principles that should shape the system.

Questions such as:

* What does it mean to version architecture?
* Can confidence be modelled?
* Should evidence become part of the architectural model?
* Can conversation become the primary interface?
* How should architectural knowledge evolve over time?
* What role should AI play in decision making?
* Where should humans remain firmly in control?

Answering those questions is more important than selecting any particular technology stack.

Technology will change.

The principles should endure.

---

## Success

If Articulate succeeds, I don't believe it will be because it produces better diagrams or more documentation.

It will succeed if it helps architects spend less time searching for information and more time solving meaningful problems.

If it helps preserve architectural knowledge.

If it reduces uncertainty.

If it encourages better architectural conversations.

If it helps explain the consequences of change before those changes are implemented.

Most importantly, if it demonstrates that AI can become a thoughtful architectural collaborator rather than simply another code generation tool.

---

## Looking Ahead

This episode has intentionally avoided discussing implementation.

The purpose was to establish the motivation behind the project.

Future episodes will explore the architectural principles, requirements, constraints and experiments that shape Articulate as it evolves.

Some ideas will succeed.

Some will fail.

Many will change along the way.

That is exactly what this journal intends to document.

Because ultimately, Articulate is not just about building software.

It is an exploration into how we might build better architecture.

---
id: episode-0002
title: What is Articulate?
summary: >
  A clearer definition of Articulate as an exploration into architectural
  intelligence and an AI-native platform for reasoning about software systems.
published: 2026-07-12
updated: 2026-07-12
status: current
sequence: 2
season: foundations
topics:
  - architectural-intelligence
  - architectural-knowledge
  - conversation
questions:
  - What exactly is Articulate?
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0002-what-is-articulate.md
featured: false
thumbnail: /media/episodes/0002/episode-0002-thumbnail.png
youtube_url: https://youtu.be/sZ4VwMCKIlA
---

# Episode 0002 – What is Articulate?

> *"Articulate is an exploration into architectural intelligence—an AI-native platform designed to help architects understand, evolve and reason about complex software systems."*

## Introduction

In the previous episode, I explored why Articulate exists.

This episode answers a different question.

**What exactly is Articulate?**

The answer has changed many times throughout the life of this project.

It has been a documentation tool.

A knowledge graph.

A conversational assistant.

A discovery platform.

An architecture modelling tool.

Each of those ideas solved part of the problem, but none of them captured the bigger picture.

Today, I see Articulate as something much broader.

It is an exploration into what software architecture could become in the age of AI.

---

# What Articulate Isn't

Before explaining what Articulate is, it helps to explain what it is not.

Articulate is **not** another wiki.

It is **not** another Enterprise Architecture Management (EAM) platform.

It is **not** another modelling tool.

It is **not** another diagramming application.

It is **not** another AI chatbot wrapped around documentation.

All of those tools have value.

Most of them solve their own problems extremely well.

Articulate isn't attempting to replace them.

Instead, it aims to complement them by focusing on something that very few tools attempt to model directly:

**Architectural knowledge.**

---

# Architecture Is More Than Documentation

Most architecture tools store artefacts.

Documents.

Diagrams.

Decision records.

Source code.

Infrastructure definitions.

Each represents part of the architecture.

None represents the architecture itself.

Architecture is better thought of as a continuously evolving body of knowledge.

It contains facts.

Assumptions.

Evidence.

Decisions.

Trade-offs.

Relationships.

Capabilities.

Constraints.

Business context.

Technical implementation.

Most importantly, it evolves continuously.

Capturing and maintaining that knowledge is one of the hardest parts of software architecture.

Articulate exists to explore whether that knowledge can itself become the primary asset.

---

# An AI-Native Architecture Platform

Articulate is designed from the outset as an AI-native system.

That does **not** mean AI has replaced architects.

Quite the opposite.

The architect remains responsible for decisions, judgement and accountability.

AI becomes a collaborator.

Helping discover information.

Highlight inconsistencies.

Challenge assumptions.

Explain relationships.

Suggest alternative approaches.

Capture architectural context.

Reason about change.

The objective is not automation.

The objective is augmentation.

---

# Conversation as the Primary Interface

One of the central ideas behind Articulate is that conversation becomes the primary way architects interact with architectural knowledge.

Rather than searching through multiple repositories and documentation systems, architects should be able to ask questions naturally.

Examples might include:

> Explain the payment platform.

> Which systems depend upon this service?

> Why was this technology selected?

> Which architectural decisions relate to authentication?

> What changed between these two architecture baselines?

> Which capabilities would be affected if this service was retired?

Conversation becomes another way of exploring architecture.

Not because conversation is fashionable, but because asking questions is already how architects work.

---

# Architecture as a Living Model

At the heart of Articulate is a continuously evolving architectural model.

Everything contributes to that model.

Discovery.

Documentation.

Architecture Decision Records.

Solution designs.

Source code.

Infrastructure.

Operational data.

Conversations.

Each adds evidence that helps improve understanding of the architecture.

The model is never considered complete.

Instead, it continually evolves as confidence increases and new information becomes available.

The architecture becomes something that is continuously learned rather than periodically documented.

---

# Core Capabilities

Articulate is organised around a collection of architectural capabilities.

These capabilities will evolve throughout this journal, but together they represent the long-term vision of the platform.

### Discovery

Helping architects understand organisations, systems and domains by capturing knowledge from multiple sources.

Rather than assuming perfect information, discovery works with claims, evidence and confidence to gradually improve the architectural model.

---

### Architectural Baselines

Treating architecture as something that evolves over time.

Every solution design, decision and document belongs to an architectural baseline, making it possible to understand not only the current architecture but how it has changed throughout its history.

---

### Architectural Knowledge

Maintaining a continuously evolving representation of the architecture itself.

Rather than treating documents as the primary artefact, Articulate treats architectural knowledge as the central asset from which documents, diagrams and analysis can be derived.

---

### Explore

Allowing architects to navigate architectural knowledge through conversation, visualisations and generated views.

The goal is to make architectural information easier to discover rather than easier to store.

---

### Impact Analysis

Helping architects understand the potential consequences of change before implementation begins.

Relationships between capabilities, systems, technologies and decisions become easier to explore, reducing uncertainty and supporting better decision-making.

---

### Solution Design

Supporting architects throughout the design process.

Helping identify assumptions.

Highlighting constraints.

Recording trade-offs.

Capturing architectural reasoning.

The objective is to support architectural thinking rather than replace it.

---

### Gap Analysis

Helping organisations understand what already exists before building something new.

Encouraging capability reuse.

Reducing duplication.

Making existing architectural knowledge easier to apply.

---

# Architectural Intelligence

The phrase I increasingly use to describe Articulate is **architectural intelligence**.

Not artificial intelligence.

Architectural intelligence.

The ability to understand architecture.

Reason about architecture.

Preserve architectural knowledge.

Explain architectural decisions.

Explore the consequences of change.

Continuously improve understanding as new evidence becomes available.

Whether this can truly be achieved remains an open research question.

Articulate exists to explore that possibility.

---

# Beyond Documentation

One of the ambitions of Articulate is to move architecture away from static documentation and towards continuously evolving knowledge.

Documentation will always remain important.

Diagrams will continue to be valuable.

Decision records will still exist.

The difference is that they become outputs generated from an architectural understanding rather than the primary source of that understanding.

The architecture becomes the source of truth.

Everything else becomes a view.

---

# Looking Ahead

Articulate is intentionally ambitious.

Some ideas described here will evolve.

Others may prove impractical.

Some may be abandoned entirely.

That uncertainty is expected.

This journal exists to document that journey openly.

Future episodes will begin exploring the principles, requirements, constraints and architectural decisions needed to determine whether this vision can become reality.

Ultimately, Articulate is not an attempt to build another architecture tool.

It is an attempt to explore whether AI can help us become better architects.

---
id: episode-0003
title: Why AI-Native Systems?
summary: >
  Why Articulate is being built as an AI-native system, and how intelligence
  becomes a first-class part of the runtime rather than an isolated feature.
published: 2026-07-15
updated: 2026-07-15
status: current
sequence: 3
season: foundations
topics:
  - ai-native-architecture
  - agentic-systems
  - intelligent-runtime
questions:
  - What makes a system AI-native rather than merely AI-powered?
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0003-why-ai-native-systems.md
featured: false
thumbnail: /media/episodes/0003/episode-0003-thumbnail.png
youtube_url: https://youtu.be/_ewKC3dZNbY
---

# Episode 3 – Why AI-Native Systems?

*This episode explains why Articulate is being built as an AI-native system and explores what that term means in the context of systems architecture.*

---

## A Note on Terminology

Before going further, it's worth acknowledging that terms such as **AI-native**, **agentic systems**, **AI agents**, and even **reasoning models** are still evolving. Different organisations, vendors, researchers, and practitioners use them in different ways, and the vocabulary continues to mature.

The perspective presented in this episode reflects my understanding in 2026, informed by my experience as a systems architect and the research I've undertaken while building Articulate. I don't present it as the definitive definition, nor do I expect these ideas to remain unchanged. One of the goals of this journal is to document how my own thinking evolves alongside the technology.

As the field matures, I fully expect some of the terminology, patterns, and architectural principles discussed here to be refined, challenged, or even replaced. Rather than viewing that as a weakness, I see it as an essential part of architectural learning.

---

## More Than AI-Powered

Over the past few years almost every software product has claimed to be *AI-powered*. In many cases this simply means a traditional application with an LLM integrated as another service.

That isn't the architectural approach behind Articulate.

Articulate is being designed as an **AI-native system**, where intelligence is a first-class architectural concern rather than an optional feature or isolated capability.

The distinction is subtle but important.

An AI-powered application uses AI.

An AI-native application is built around AI.

---

## What Is an AI-Native System?

An AI-native system is one in which intelligence participates in the runtime itself.

Rather than simply answering prompts, AI helps to:

- Understand intent
- Build and maintain context
- Retrieve knowledge
- Reason about problems
- Orchestrate workflows
- Evaluate confidence
- Collaborate with humans
- Produce meaningful outcomes

Traditional systems are typically optimised around:

- CRUD operations
- APIs
- Transactions
- Deterministic workflows

AI-native systems are optimised around:

- Context
- Memory
- Knowledge
- Reasoning
- Orchestration
- Conversations
- Managing uncertainty

The architecture changes because intelligence becomes part of how the system operates rather than another external dependency.

---

## Intelligence Becomes Infrastructure

For decades software applications embedded databases as infrastructure.

Cloud computing added networking, messaging, storage and distributed services as fundamental runtime capabilities.

AI-native systems introduce another layer.

Intelligence itself becomes infrastructure.

Rather than making isolated calls to an LLM, the runtime provides capabilities such as:

- Reasoning
- Planning
- Memory
- Semantic retrieval
- Tool invocation
- Reflection
- Evaluation

These capabilities become part of the runtime in much the same way that persistence, networking and security became essential infrastructure in previous generations of software.

---

## Where Do Agentic Systems Fit?

Agentic systems are closely related to AI-native systems, but they are not the same thing.

AI-native describes an architectural philosophy.

Agentic systems describe one architectural pattern for organising intelligence.

Agents introduce concepts such as:

- Goals
- Planning
- Delegation
- Tool use
- Reflection
- Memory
- Collaboration

An AI-native system may contain one agent, many specialised agents, or even no explicit agents at all.

Likewise, simply adding an agent to an application does not automatically make it AI-native.

Agents are one way of implementing AI-native architecture—not the definition of it.

---

## Why Articulate Is AI-Native

Articulate is not simply generating documents with AI.

AI participates throughout the runtime by:

- Understanding architectural intent
- Conducting guided discovery
- Asking better questions
- Identifying missing information
- Building contextual understanding
- Generating DCL models
- Retrieving architectural knowledge
- Evaluating confidence
- Producing architectural artefacts
- Assisting with solution design

If AI were removed from Articulate, the architecture would fundamentally change.

That is the defining characteristic of an AI-native system.

---

## Conversation as the Primary Interface

One of the central ideas explored throughout this journal is that AI-native systems become **conversation-driven systems**.

Conversation is no longer simply a user interface.

It becomes the mechanism through which:

- Humans collaborate with AI
- Knowledge is discovered
- Context is built
- Workflows are orchestrated
- Decisions are made
- Architectural artefacts emerge

This principle underpins every architectural decision within Articulate.

---

## Architectural Principles

The architectural principles guiding Articulate are:

- Intelligence is a runtime capability.
- Conversations are the primary interface.
- Context becomes the new state.
- Memory extends beyond a single request.
- Knowledge is continuously retrieved rather than statically embedded.
- Humans remain an essential part of the system.
- Systems must embrace uncertainty.
- Evaluation is as important as execution.

These principles will appear repeatedly throughout future episodes.

---

## Looking Ahead

If AI-native systems require new runtime capabilities, what should those runtimes look like?

That question drives the remainder of this journal.

Future episodes will explore topics including:

- Context engineering
- Memory models
- Knowledge architecture
- Retrieval-Augmented Generation (RAG)
- Agentic systems
- Workflow orchestration
- Durable execution
- Capability-driven architecture
- Human-in-the-loop systems
- AI observability
- Runtime architecture

This episode is not intended to provide a final definition of AI-native architecture.

Instead, it establishes the architectural mindset that underpins Articulate and begins a conversation that will continue to evolve alongside both the software and the rapidly changing AI landscape.

---
id: episode-0004
title: "System Characteristics: The Properties Every System Needs"
summary: >
  The qualities that make production systems trustworthy, and the additional
  demands AI-native systems place on reliability, scalability, evaluation,
  and operations.
published: 2026-07-15
updated: 2026-07-24
status: current
sequence: 4
season: foundations
topics:
  - system-characteristics
  - trust
  - scalability
  - ai-evaluation
questions:
  - Which characteristics make an AI-native system trustworthy in production?
related_principles:
  - coherence-before-size
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md
featured: true
thumbnail: /media/episodes/0004/episode-0004-thumbnail.png
thumbnail_alt: "Articulate Journal Episode 4: Features Aren't Enough"
youtube_url: https://youtu.be/OsLzgCnVEJk
---

# Episode 4 — System Characteristics: The Properties Every System Needs

*AI-native systems still need to be systems.*

One of the risks when discussing AI-native architecture is becoming so focused on models, prompts and agents that we forget the fundamentals of software engineering.

Whether we are building a banking platform, an e-commerce application or an AI assistant, every production system is ultimately judged by the same question:

**Can people trust it?**

Before exploring runtime architectures, workflows and multi-agent systems, it is worth stepping back and considering the characteristics that make any system successful.

These characteristics are not unique to AI.

They have always been part of good architecture.

However, AI-native systems place new demands on many of them.

---

## Functionality Versus Characteristics

As architects, we think about software in two dimensions.

The first is **functional behaviour**.

What does the system do?

The second is **system characteristics**.

How well does the system do it?

A user might ask an AI assistant to design a solution architecture.

That is functionality.

Whether the response is secure, reliable, observable, performant and trustworthy describes the characteristics of the system delivering it.

These qualities often determine whether a system succeeds in production, regardless of how impressive its features appear to be.

---

## Why Architects Care

One of the most important lessons I have learned throughout my career is that architectural patterns rarely exist for their own sake.

We do not choose CQRS because it is fashionable.

We do not adopt event sourcing because it is interesting.

We choose architectural patterns because they improve one or more system characteristics that matter to the problem we are solving.

| Pattern                 | Primarily Improves          |
| ----------------------- | --------------------------- |
| CQRS                    | Scalability, performance    |
| Event Sourcing          | Auditability, reliability   |
| Workflow Engines        | Reliability, recoverability |
| Actor Models            | Scalability, resilience     |
| Caching                 | Performance                 |
| Circuit Breakers        | Reliability                 |
| RAG                     | Accuracy, groundedness      |
| Observability Platforms | Operability                 |

Architecture is fundamentally about making trade-offs to achieve the qualities that matter most.

A pattern that improves one characteristic may weaken another.

Caching may improve performance while making consistency harder.

Distribution may improve scalability while making reliability and observability more difficult.

Greater autonomy may improve adaptability while reducing predictability.

There is rarely a perfect architecture.

There is only an architecture whose trade-offs are appropriate for its context.

---

## Trust

Trust is the foundation of every production system.

For traditional applications, this includes concerns such as:

* authentication
* authorisation
* auditability
* privacy
* compliance
* security

AI-native systems introduce additional questions.

* Which models can this user access?
* What information can be included in a prompt?
* Can prompts expose sensitive data?
* Can retrieved information cross security boundaries?
* Are tools being called with the correct permissions?
* Can generated responses be explained and audited?
* Can an agent take an action without human approval?

Security is no longer only about protecting APIs and infrastructure.

It is also about protecting the intelligence operating within the system.

An agent may be technically capable of calling a tool, but capability does not imply authority.

The architecture must distinguish between what an agent **can** do and what it is **permitted** to do.

Trust must therefore be designed into the entire path from user intent to model reasoning, tool execution and final outcome.

---

## Reliability

Reliability answers a simple question:

**Can users depend on the system?**

This includes:

* availability
* fault tolerance
* resilience
* disaster recovery
* graceful degradation
* recoverability

Reliability becomes especially important in AI-native systems because parts of the intelligence may depend on external services.

A model provider may time out.

An API may apply a rate limit.

A retrieval service may become unavailable.

A tool may fail after an agent has already completed several earlier steps.

A generated response may be incomplete or unusable even when every technical component executed successfully.

Good AI-native systems should continue operating when parts of their intelligence are unavailable.

That might mean:

* selecting an alternative model
* retrying an operation
* returning a reduced result
* pausing a workflow
* requesting human intervention
* continuing with deterministic functionality
* preserving state so work can resume later

Reliability is not only about preventing failure.

It is also about controlling what happens when failure inevitably occurs.

---

## Performance

Performance is about more than response time.

It includes:

* latency
* throughput
* resource utilisation
* cost efficiency
* streaming responses
* parallel execution

AI-native systems often optimise **perceived performance** as well as absolute performance.

A streamed response that begins immediately can provide a better experience than waiting several seconds for a complete answer.

However, streaming does not remove latency.

It changes how the user experiences it.

Agentic systems may also contain multiple sources of delay:

* model inference
* context construction
* retrieval
* tool selection
* tool execution
* agent coordination
* validation
* human approval

Improving one stage does not necessarily improve the end-to-end experience.

Performance must be understood across the complete reasoning and execution path.

It must also be considered alongside cost.

A faster or more capable model may produce better results, but it may not be economically appropriate for every task.

Architecture must determine where expensive reasoning is justified and where a smaller model, deterministic component or cached result is sufficient.

---

## Scalability

Scalability is the ability of a system to continue operating effectively as demand increases.

In traditional cloud-native systems, this commonly includes:

* horizontal scaling
* queue-based workloads
* distributed workflows
* multi-tenancy
* background processing
* partitioning
* caching
* model serving

These concerns remain important in AI-native systems.

Models are computationally expensive.

Retrieval workloads may be intensive.

Long-running agent workflows may consume resources for extended periods.

Many users may compete for limited model capacity.

Designing systems that scale economically is therefore often just as important as designing systems that scale technically.

However, AI-native systems introduce another dimension.

It is not only the infrastructure that must scale.

**The intelligence itself must scale.**

---

## Scaling the Agent

One way to increase the capability of a system is to make an individual agent more capable.

The agent may be given:

* broader instructions
* more responsibilities
* more tools
* more memory
* more retrieved information
* a larger context
* access to a more capable model

This is a form of **scaling up**.

Scaling up can initially make the architecture appear simpler.

One agent can interpret the request, choose its tools, maintain the context and complete the task without delegating work elsewhere.

There are fewer routing decisions.

There are fewer hand-offs.

There are fewer distributed interactions to coordinate.

For bounded and coherent tasks, this may be entirely appropriate.

But as the agent becomes more capable, it also becomes more complex.

Its prompt grows.

Its context expands.

Its tool catalogue becomes larger.

Its memory requirements increase.

More instructions compete for attention.

The model must distinguish relevant information from everything else it has been given.

This can increase:

* token consumption
* latency
* computational cost
* reasoning ambiguity
* tool-selection errors
* the risk of important information being diluted
* the impact of a single failure

The agent may eventually spend more effort navigating its own context than solving the user's problem.

Scaling up therefore has limits.

A larger context window does not automatically produce better reasoning.

More tools do not automatically produce more useful behaviour.

More memory does not automatically produce greater understanding.

An agent can become more capable while simultaneously becoming less focused, less predictable and harder to evaluate.

---

## Scaling the Agent System

The alternative is to **scale out**.

Instead of creating one increasingly complex agent, the system distributes responsibilities across multiple specialised agents.

Each agent may have:

* a clear goal
* a narrower responsibility
* a smaller context
* access to a limited set of tools
* a more focused behavioural contract

One agent may retrieve knowledge.

Another may evaluate evidence.

Another may identify architectural trade-offs.

Another may check whether a proposed decision conflicts with an existing principle.

This can provide several benefits:

* reduced context size
* clearer responsibilities
* better isolation
* more focused evaluation
* greater opportunities for parallel execution
* smaller failure boundaries
* independent evolution of specialised behaviours

But scaling out is not free.

The complexity does not disappear.

It moves into the architecture surrounding the agents.

The system must now determine:

* which agent should receive a request
* how intent should be classified
* whether one agent or several agents are required
* what context each agent needs
* how context should be transferred
* whether agents should execute sequentially or in parallel
* how conflicting results should be reconciled
* where workflow state should be maintained
* how failure should be recovered
* how the complete reasoning path should be observed

More agents create more routing decisions.

More routing decisions create more opportunities for misclassification.

A request sent to the wrong agent may still produce a convincing response.

That makes routing failures especially difficult to detect.

A multi-agent system also introduces distributed-systems concerns:

* partial failure
* messaging
* coordination
* consistency
* retries
* idempotency
* timeouts
* state management
* observability

This is similar to the trade-off between a larger application and a distributed architecture.

A distributed system can improve scalability and separation of responsibility, but it also introduces operational and coordination overhead.

The same is true of multi-agent systems.

---

## Scaling Up and Scaling Out

The architectural decision is therefore not simply whether agents should be large or small.

Both approaches concentrate complexity in different places.

| Dimension      | Scale Up                          | Scale Out                                |
| -------------- | --------------------------------- | ---------------------------------------- |
| Responsibility | Broader agent responsibility      | Narrower specialised responsibility      |
| Context        | Larger consolidated context       | Smaller distributed contexts             |
| Routing        | Simpler                           | More complex                             |
| Coordination   | Primarily internal                | Explicit orchestration required          |
| Latency        | Fewer hand-offs, larger inference | More hand-offs, potential parallelism    |
| Failure scope  | Larger                            | More isolated                            |
| Observability  | One reasoning path                | Distributed reasoning trace              |
| Cost           | Larger prompts and model calls    | More calls and orchestration overhead    |
| Evolvability   | Responsibilities become coupled   | Agents can evolve independently          |
| Consistency    | Shared context is easier          | Context must be transferred or retrieved |

Scaling up concentrates complexity inside the agent.

Scaling out distributes complexity across the system.

Neither approach is automatically correct.

The appropriate design depends on:

* the coherence of the responsibility
* the amount of context required
* the variability of the task
* the cost of model execution
* the need for isolation
* the need for parallelism
* the acceptable operational complexity
* the consequences of failure

Many systems will use both approaches.

A specialised agent may still need a more capable model or a larger context for a demanding task.

A broader conversational agent may delegate only those activities that require specialist knowledge or independent evaluation.

The goal is not to create the largest possible agent.

It is also not to create the greatest possible number of agents.

The goal is to place complexity where it can be understood, controlled and operated.

---

## Coherence Before Size

A useful principle is that an agent should remain **coherent**.

Its goal, responsibilities, context and tools should naturally belong together.

An agent should not be split merely because smaller agents appear more architecturally sophisticated.

Splitting a coherent responsibility across many agents can create more complexity than it removes.

This is similar to prematurely decomposing a system into microservices.

The services may be individually small, but the overall system becomes dominated by communication, coordination and operational overhead.

The same risk exists with agents.

Every agent boundary may also become:

* a routing boundary
* a context boundary
* a trust boundary
* a failure boundary
* an evaluation boundary
* a probabilistic reasoning boundary

An agent should be split when additional responsibility makes its behaviour harder to:

* understand
* secure
* evaluate
* observe
* operate
* evolve

The important characteristic is not smallness.

It is clarity.

Scalable AI-native architecture is not achieved by building one enormous agent.

Nor is it achieved by creating a swarm of tiny agents.

It is achieved by designing coherent agents within a system capable of coordinating them responsibly.

---

## Observability

Modern distributed systems require observability.

Traditionally, this means collecting:

* logs
* metrics
* traces

AI-native systems require a richer understanding.

We also need visibility into:

* prompt versions
* model selection
* token usage
* context construction
* retrieval quality
* tool calls
* routing decisions
* agent decisions
* workflow execution
* confidence scores
* user feedback
* evaluation results

This becomes particularly important when work is distributed across multiple agents.

A conventional distributed trace may show that Agent A called Agent B.

That is useful, but it is not enough.

We may also need to understand:

* why Agent B was selected
* which intent was identified
* what context was provided
* which information was omitted
* how Agent B reached its conclusion
* whether another agent disagreed
* how the final result was selected

Observability is no longer only about understanding software execution.

It is about understanding intelligent behaviour.

Without that visibility, failures may appear as plausible but incorrect outcomes rather than obvious technical errors.

---

## Evolvability

Technology changes.

AI changes even faster.

A well-designed architecture should make change easier rather than harder.

Relevant characteristics include:

* maintainability
* modularity
* extensibility
* deployability
* versioning
* replaceability

Models will change.

Prompt strategies will change.

Agent frameworks will change.

Retrieval approaches will change.

The boundaries of the system should prevent these implementation choices from becoming inseparable from its architectural intent.

For example, an agent's responsibility should not exist only as an undocumented prompt.

Its purpose, inputs, constraints and expected outcomes should be understandable independently of the model currently implementing it.

Good architecture accepts that today's implementation decisions will almost certainly change.

The important question is whether the system can evolve without losing its intent, integrity or accumulated knowledge.

---

## Operability

Building software is only part of the challenge.

Someone also has to operate it.

Operational characteristics include:

* configuration
* monitoring
* diagnostics
* feature flags
* rollback
* deployment
* runbooks
* capacity management
* incident response

AI-native systems introduce additional operational concerns.

Operators may need to:

* disable a model
* change routing policies
* reduce model usage
* restrict a tool
* pause an agent workflow
* inspect a failed reasoning path
* replay an execution
* replace a prompt version
* compare evaluation results
* intervene in a long-running process

An elegant architecture that cannot be operated effectively is rarely successful.

This becomes even more important as agent systems scale out.

Each additional agent, routing rule and workflow introduces another operational surface.

The architecture must therefore balance logical separation with the practical ability to understand and manage the system as a whole.

---

## Quality Assurance: Testing and Evaluation

This is where AI-native systems begin to diverge from traditional software engineering.

Software engineers are familiar with testing.

We build confidence using:

* unit tests
* integration tests
* contract tests
* end-to-end tests
* performance tests

These answer questions such as:

* Does it work?
* Does it still work?
* Did we break anything?
* Do the components integrate correctly?
* Does the system remain within its performance limits?

Traditional software is largely deterministic.

The same input should produce the same output.

Large language models are different.

They are probabilistic.

Two identical prompts may produce different but equally valid responses.

A workflow may complete successfully while producing a poor answer.

A tool may be called correctly but for the wrong reason.

An agent may choose a plausible path that does not satisfy the user's intent.

Testing alone is therefore no longer sufficient.

---

## Evaluation

Evaluation is not a new concept.

Machine-learning engineers have relied on evaluation for decades.

A machine-learning model may execute perfectly while still producing poor predictions.

Rather than asking only whether the software works, they ask how well the model performs.

Common evaluation measures include:

* accuracy
* precision
* recall
* F1 score
* ROC-AUC
* confusion matrices

These are not implementation tests.

They are measurements of behaviour.

AI-native systems inherit this mindset.

Instead of asking only whether a workflow completed successfully, we must also ask:

* Was the answer correct?
* Was it grounded in trusted information?
* Was the response complete?
* Did the agent understand the user's intent?
* Did it choose the correct tools?
* Was the correct agent selected?
* Did the agents collaborate effectively?
* How confident are we in the outcome?
* Was the behaviour safe?
* Was the cost proportionate to the value produced?

Testing verifies implementation.

Evaluation measures behaviour.

Both are essential.

---

## Evaluating Agent Architectures

Evaluation becomes more complex when responsibility is distributed across multiple agents.

We may need to evaluate not only the final answer, but the architecture that produced it.

For example:

* Did the router identify the correct intent?
* Was the task delegated to the right agent?
* Did each agent receive the context it required?
* Was unnecessary context excluded?
* Did the agents duplicate work?
* Did one agent introduce incorrect information?
* Were conflicting results resolved appropriately?
* Was the overall workflow more effective than using one agent?

A multi-agent system should not be considered successful merely because it contains several specialised agents.

Its additional complexity must produce measurable value.

That value might include:

* better-quality outcomes
* reduced context consumption
* improved isolation
* greater parallelism
* clearer evaluation
* stronger security boundaries
* lower cost
* easier evolution

If scaling out creates more routing errors, latency and operational overhead without improving outcomes, the architecture has become more complicated rather than more capable.

The number of agents is not a measure of architectural maturity.

The effectiveness of their collaboration is.

---

## Capabilities and Evaluation

One question sits underneath every evaluation framework:

**What does success actually look like?**

Traditional software answers this with assertions.

Machine learning uses labelled datasets and metrics.

For AI-native systems, I believe capabilities provide another important layer.

A capability defines:

* the intent
* the expected outcomes
* the policies
* the constraints
* the measures of success

Rather than evaluating whether an agent generated a particular sentence, we evaluate whether it successfully delivered the capability it was attempting to provide.

This becomes especially valuable in a multi-agent architecture.

Several agents may collaborate to deliver one capability.

The user should not need to care which agent performed each step.

The architecture can evaluate individual agent behaviour, routing decisions and workflow execution while still measuring success against the outcome the system exists to deliver.

This is one of the motivations behind the Declarative Capability Language, or DCL.

By explicitly describing what success means, evaluation can move beyond implementation details and focus on business outcomes.

Capabilities provide the semantic foundation upon which meaningful evaluation can be built.

---

## Architecture Is About Qualities

One observation has become increasingly clear as software evolves.

As systems become more intelligent, our definition of quality expands.

We no longer measure only correctness.

We also measure behaviour.

Architecture has always been about balancing competing qualities.

AI-native systems do not replace these concerns.

They amplify them.

Security becomes more complex.

Observability becomes richer.

Reliability becomes more challenging.

Scalability extends from infrastructure into the architecture of intelligence itself.

Testing must be complemented by evaluation.

The fundamentals of architecture remain the same.

Only the systems have changed.

---

## Closing Thoughts

Before designing any architecture, it is worth asking two simple questions.

**What must the system do?**

**What properties must the system possess?**

The first defines its functionality.

The second shapes its architecture.

AI-native systems introduce new implementation techniques, but they do not remove the need for deliberate architectural trade-offs.

A single complex agent may simplify coordination while increasing context, cost and cognitive load.

A collection of specialised agents may improve focus and isolation while introducing routing, orchestration and operational complexity.

Scaling up concentrates complexity inside an agent.

Scaling out distributes complexity across the system.

Architecture determines which form of complexity is easier to control.

Everything else is an implementation decision.

---

### Looking Ahead

In the next episode, we will explore the architectural principles that guide Articulate and why thinking in terms of capabilities, rather than components, provides a stronger foundation for building AI-native systems.

---
id: episode-0005
title: How I Approach Solution Design and Evolving Architecture
summary: >
  The approach I use to move from questions and requirements to
  architectural decisions, while continuously testing assumptions and
  evolving the architecture as new evidence emerges.
published: 2026-07-15
updated: 2026-07-15
status: current
sequence: 5
season: foundations
topics:
  - solution-design
  - architectural-decisions
  - requirements
  - architecture-evolution
questions:
  - How do I approach solution design and allow architecture to evolve as
    understanding improves?
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0005-designing-an-ai-native-architecture.md
featured: false
---

# Episode 5 – How I Approach Solution Design and Evolving Architecture

Architecture is often presented retrospectively.

We see the finished diagrams, the selected technologies and the
decisions that survived. What we rarely see is the process that produced
them: the questions that were asked, the assumptions that proved wrong,
the alternatives that were rejected and the architecture that changed as
understanding improved.

Articulate is intended to be different.

This journal is not documenting a system whose architecture has already
been designed. The architecture will emerge throughout the project as I
investigate problems, test ideas, make decisions and learn from
implementation.

Before going further, I therefore want to explain the approach I use
when designing systems.

This is not intended to be a universal architecture methodology. Over
the years, I have developed an approach influenced by frameworks such as
the Zachman Framework and TOGAF ADM, but adapted through practical
experience designing and delivering systems.

More importantly, this is not a process that will be completed in this
episode.

It is the approach I intend to follow throughout the rest of this
journal.

## Architecture Is More Than Diagrams

One of the biggest misconceptions about architecture is that it begins
with a component diagram.

Diagrams are valuable.

They communicate ideas, facilitate conversations and help people develop
a shared understanding of a system. I use them extensively throughout
the architecture process.

However, diagrams are not the architecture.

The architecture is the collection of significant decisions,
constraints, assumptions and trade-offs that shape a system.

A diagram might show that two components communicate through a message
broker. It cannot necessarily explain why asynchronous communication was
required, what alternatives were considered or what consequences were
accepted by making that decision.

That reasoning matters.

If someone asks why a particular technology was selected, why a system
boundary exists or why one pattern was chosen over another, I want to be
able to trace that decision back to the problem it was intended to
solve.

That is where I begin.

## Requirements and Architectural Drivers

Requirements provide the context for architectural decisions, but not
every requirement has the same architectural significance.

As an architect, I am particularly interested in identifying
**Architecturally Significant Requirements**, often shortened to
**ASRs**.

A normal requirement describes something the system needs to do or a
constraint within which it must operate.

An ASR is a requirement that has a meaningful influence on the shape of
the architecture.

The difference is not always obvious from how a requirement is written.

Consider a requirement such as:

> A user can submit a request for analysis.

On its own, that tells us relatively little about the architecture.

Now imagine that the analysis may take several hours, must survive
service restarts, may require human approval before continuing and must
maintain a complete audit trail of how its conclusions were reached.

The requirement has become architecturally significant.

It introduces concerns around durable execution, state management,
human-in-the-loop workflows, observability and traceability.

These become architectural drivers.

ASRs frequently emerge from quality attributes such as scalability,
availability, security, performance and reliability, but they can also
originate from functional requirements, business constraints, regulatory
obligations and technical constraints.

The important question is therefore not simply:

> What are the requirements?

It is:

> Which requirements will materially influence the architecture?

I look particularly for requirements that force difficult decisions,
constrain multiple parts of the system, introduce significant risk or
make one architectural approach more appropriate than another.

Sometimes these requirements are explicit.

More often, they have to be discovered.

## Starting With Questions

I tend to begin architecture work with questions rather than solutions.

At the highest level, those questions are deliberately simple:

-   What?
-   How?
-   Where?
-   Who?
-   When?
-   Why?

This approach is influenced by the Zachman Framework, although I do not
use Zachman as a rigid documentation framework.

The idea I find valuable is that the same fundamental questions can be
explored from different perspectives.

The questions remain broadly the same.

What changes is **who I am asking them for and what I am trying to
understand**.

From a product perspective, **What?** may identify business entities and
features. **How?** may describe workflows. **When?** may expose roadmap
dependencies. **Why?** may reveal business value and rationale.

From an architectural perspective, those same questions lead somewhere
different.

**What?** may identify major building blocks and scope.

**How?** may explore interactions, patterns and architectural
approaches.

**Where?** may reveal boundaries, distribution and deployment concerns.

**Who?** may identify actors, stakeholders and responsibilities.

**When?** may expose system events and temporal dependencies.

**Why?** may uncover architectural characteristics, significant
decisions and their justification.

For developers, the questions become more concrete again, covering
applications, components, data models, integrations, deployment
approaches and ownership.

For operations, they may expose infrastructure, networks, provisioning,
capacity, security policies, availability, recovery and monitoring.

I have previously represented this approach as a grid, with perspectives
forming one dimension and these fundamental questions forming the other.
The intersections provide prompts for deeper investigation.

The purpose is not to complete every cell.

Doing that would simply replace one heavyweight documentation template
with another.

Instead, I use the grid as a **question-generation mechanism**.

Depending on the problem, its scope and the people involved, I explore
the perspectives that matter.

For example, asking:

> Where does this system run?

may produce a simple infrastructure answer.

But exploring **Where?** from several perspectives might reveal very
different questions:

-   Where are the users?
-   Where are the teams responsible for the system?
-   Where is data created?
-   Where is it stored?
-   Where do components execute?
-   Where are the trust boundaries?
-   Where can failures occur?

Likewise, **Who?** can expand into users, actors, stakeholders,
ownership, responsibilities and security boundaries.

**When?** can expose business events, system events, sequencing,
temporal dependencies and lifecycle concerns.

The questions are simple.

The investigation they create is not.

## Looking Through Different Perspectives

The perspective-based questions help me understand the problem, but I
also examine the emerging design through architectural perspectives.

These might include:

-   Security
-   Performance
-   Scalability
-   Reliability
-   Resilience
-   Availability
-   Observability
-   Usability
-   Operations
-   Deployment
-   Data management
-   Governance

For an AI-native system, that list may need to expand further.

I may need to consider AI evaluation, explainability, model behaviour,
confidence, provenance, human oversight and the operational consequences
of non-deterministic behaviour.

Each perspective can reveal requirements or assumptions that were
previously hidden.

An observability review may introduce additional telemetry requirements.

A resilience review may reveal that a long-running process needs
checkpointing.

A security review may expose trust boundaries that were not previously
visible.

An AI evaluation perspective may reveal that the system needs to capture
information that would not normally be retained by traditional
application telemetry.

This is one reason I do not consider architecture to be a linear
process.

Looking at the architecture differently often changes my understanding
of the original problem.

## From Requirements to Options

Once I understand enough about the problem and its architectural
drivers, I can begin exploring possible solutions.

This is where I deliberately try to avoid jumping immediately to
technology.

If a requirement tells me that work may continue for several days and
must survive process failure, the architectural problem is **durable
execution**.

That does not immediately mean Temporal.

If a system needs to understand highly connected knowledge, the
architectural problem may involve representing and traversing
relationships.

That does not immediately mean a graph database.

If several specialised reasoning behaviours need to collaborate, that
may indicate some form of agentic architecture.

That does not automatically mean I need an agent framework.

The distinction matters because technologies change much faster than
architectural problems.

I therefore try to move through the reasoning in this direction:

**Problem → Principles → Capabilities → Architecture → Runtime →
Technology**

Requirements and architectural drivers inform every stage of that
progression.

Technology is important.

It is simply not where I want the reasoning to begin.

## Patterns Follow Problems

The same principle applies to architectural patterns.

Questions such as these often appear early in architecture discussions:

> Should we use CQRS?

> Should we use Event Sourcing?

> Should we use actors?

> Should we use durable workflows?

These questions begin with solutions.

Instead, I want to understand the problem first.

If different parts of a system need independently optimised read and
write models, CQRS may become worth considering.

If historical state and the sequence of changes are fundamental to the
domain, Event Sourcing may become relevant.

If the system contains large numbers of independently stateful entities
requiring concurrency and isolation, an actor model may be appropriate.

If work must survive failures, pause for external input and continue
over long periods, durable workflows may become a candidate solution.

Patterns are useful because they capture accumulated architectural
experience.

But they are responses to particular forces and problems.

They should not be the starting point.

## Decisions and Trade-offs

Eventually, architecture requires decisions.

Every significant decision introduces trade-offs.

There is rarely a universally correct architecture.

A decision may improve scalability while increasing operational
complexity.

A stronger consistency model may simplify one part of the system while
reducing availability elsewhere.

Introducing a workflow engine may provide durable execution while adding
another significant runtime dependency.

Using specialised data stores may better match individual workloads
while increasing the operational cost of the platform.

Architecture is about understanding and deliberately accepting those
trade-offs.

When I encounter a significant decision, I use an Architectural Decision
Record, or ADR, to capture the reasoning.

An ADR will typically describe:

-   The context
-   The problem
-   The architectural drivers
-   The available options
-   The trade-offs
-   The decision
-   The justification
-   The consequences

I do not see ADRs as documentation written after the architecture has
been designed.

The act of writing the ADR is part of the design process.

If I cannot clearly explain the problem, the alternatives and why one
option is preferable, I may not yet understand the decision well enough
to make it.

## Architecture Emerges

As these decisions accumulate, the architecture begins to emerge.

Boundaries become clearer.

Responsibilities become clearer.

Relationships become clearer.

Runtime requirements become clearer.

At this point, diagrams become increasingly useful.

I might create context diagrams, capability maps, interaction diagrams,
deployment views or other architectural representations.

But those diagrams are now communicating reasoning that has already
taken place.

They are also snapshots.

The diagram I draw today represents my current understanding of the
system.

It is not a promise that the architecture will remain that way.

This is particularly important for Articulate.

I already have ideas about how the system might work.

Some of those ideas come from previous versions of Articulate. Others
come from technologies and architectural patterns I have worked with
before.

Those ideas are useful hypotheses.

They are not automatically architectural decisions.

The purpose of this journal is partly to test them.

## Architecture Evolves Through Evidence

Architecture does not stop when implementation begins.

Implementation creates new evidence.

An assumption about performance may prove incorrect.

A service boundary may create unnecessary complexity.

A technology selected for one reason may introduce consequences that
were not understood during design.

An experiment may show that an architectural concept does not work as
expected.

The problem itself may become better understood.

When that happens, the architecture should be capable of changing.

This does not mean constantly redesigning the system.

It means treating architectural decisions as decisions made with the
best available information at a particular point in time.

As the available information changes, significant decisions may need to
be revisited.

For Articulate, I want that evolution to be visible.

If an architectural hypothesis proves wrong, I want to document why.

If an ADR is superseded, I want the original reasoning to remain
available.

If an experiment changes the architecture, I want the evidence that
caused that change to be clear.

The evolution of the architecture is part of the architecture.

## Collaboration Improves Architecture

Although I may develop an initial solution design, I do not consider
architecture to be a solitary activity.

Different people see different parts of the problem.

Product specialists understand business outcomes and constraints.

Developers expose implementation realities and edge cases.

Platform and operations engineers identify runtime concerns that may not
be obvious during conceptual design.

Security specialists expose threats and trust boundaries.

The people responsible for operating a system often ask very different
questions from the people building it.

These perspectives challenge assumptions.

They also create shared ownership.

A good architectural decision should not depend on everyone agreeing
with the architect.

It should be possible for people to understand the reasoning, challenge
the assumptions and contribute new evidence.

AI introduces another interesting participant into this process.

Throughout Articulate, I will be using AI as a collaborator in
architectural thinking and development.

That does not mean delegating architectural responsibility to an AI.

It means using AI to explore alternatives, challenge assumptions,
identify gaps and help maintain the body of knowledge surrounding the
architecture.

That relationship itself will be one of the things this journal
explores.

## The Architecture Loop

Although I have described these ideas in sections, I do not see solution
design as a sequence of phases.

It is closer to a continuous loop:

> **Questions → Requirements → ASRs → Architectural Drivers → Options →
> Trade-offs → Decisions → Architecture → Evidence → Learning →
> Re-evaluation**

New questions can appear at any point.

A decision may expose a requirement that was previously hidden.

Implementation may invalidate an assumption.

An experiment may introduce a completely new option.

A change in the problem may cause an old architectural decision to
become inappropriate.

The loop continues for as long as the system continues to evolve.

The important thing is maintaining the reasoning that connects each
step.

## Applying This Approach to Articulate

This episode does not produce the architecture for Articulate.

That is deliberate.

The architecture will emerge throughout the journal.

The next stage of the project will begin investigating one of the most
important questions for the system:

> What does architectural knowledge actually look like?

That investigation will lead into the Knowledge Model.

From there I will explore how AI retrieves and reasons over
architectural knowledge, how agent behaviour should be represented, what
runtime characteristics the system requires, how memory should work, how
long-running reasoning can execute durably and how architectural
knowledge should evolve.

Each investigation will produce new requirements.

Some will reveal ASRs.

Some will result in experiments.

Some will lead to ADRs.

Some may challenge decisions I have already made.

By the time implementation begins, I expect to understand considerably
more about the architecture than I do today.

But implementation will not mark the end of architectural design.

It will simply provide a new source of evidence.

## An Evolving Architecture

The goal of this process is not to produce an architecture that is
finished.

It is to create an architecture that can be explained.

I should be able to trace significant decisions back to architectural
drivers.

I should be able to explain the alternatives considered.

I should understand the trade-offs that were accepted.

And when the architecture changes, I should be able to explain why.

As Articulate evolves, new information will challenge existing
assumptions.

Research will introduce new possibilities.

Experiments will invalidate ideas.

Implementation will expose constraints that were not visible during
design.

Some decisions will survive.

Others will change.

That is not a failure of the architecture process.

It is part of it.

The approach described in this episode is therefore not something I will
complete before moving on to the next stage of Articulate.

It is the process I intend to follow throughout this journal:

**Ask questions.**

**Discover the architectural drivers.**

**Explore the options.**

**Make the trade-offs explicit.**

**Record significant decisions.**

**Test assumptions against evidence.**

**Learn.**

**Evolve the architecture.**

The episodes that follow will put that process into practice.

---
episode: 6
title: "AI-Assisted Development: Building Articulate with an AI Coding Agent"
description: "An exploration of the deliberately simple AI-assisted development environment used to build Articulate, and why structured architectural context matters more than increasingly complex prompts."
season: 1
status: current
published: 2026-07-22
date: 2026-07-22
topics:
  - AI-assisted development
  - Context engineering
  - AI coding agents
  - DCL
  - Architecture documentation
  - Human-AI collaboration
repository_paths:
  - docs/episodes/0006-ai-assisted-development.md
  - production/diagrams/sources/episodes/0006/layered-context-model.d2
  - production/diagrams/sources/episodes/0006/architect-review-workflow.d2
---

# Episode 6 – AI-Assisted Development: Building Articulate with an AI Coding Agent

## Introduction


There are countless videos and articles showcasing AI coding workflows, autonomous agents and highly customised development environments. Those approaches are interesting, but they are not the focus of this project.

Articulate is primarily an architectural project. My goal is not to build software as quickly as possible. My goal is to explore what AI-native architecture looks like and to understand how AI can become a collaborative engineering partner.

As a result, I reset my development environment to be intentionally simple.

This episode describes the environment I use today and, more importantly, the architectural thinking behind it.

## The Development Environment

At the time of writing, my primary development environment consists of:

- Visual Studio Code
- Git
- ChatGPT Codex (5.6)
- An AGENTS.md file
- Architecture documentation
- DCL capability models
- The DCL MCP Server

There is nothing particularly revolutionary about this setup. The interesting part is not the tools themselves. The interesting part is the context available to the coding agent.

## Context Is More Important Than Prompts

There is a great deal of discussion around prompt engineering.

While prompts certainly matter, I believe the more important concept is context engineering.

An experienced software engineer makes decisions based on much more than the current source file.

They consider:

- architectural principles
- previous design decisions
- business capabilities
- coding standards
- system boundaries
- quality attributes
- existing implementations

An AI coding agent should be no different. Rather than relying on increasingly complex prompts, I want to provide the agent with structured architectural context. The better the context, the better the decisions.

## A Layered Context Model

As the project evolves, the coding agent receives context from several different layers.

![Layered context model progressing from general coding knowledge through repository and architectural context to repeatable Codex Skills](/diagrams/episode-0006-layered-context-model.svg)

Each layer serves a different purpose.

Together they provide significantly richer context than a prompt alone.

## AGENTS.md

Every repository should explain how work should be performed. For Articulate, AGENTS.md contains information such as:

- coding conventions
- project structure
- architectural guidelines
- development expectations
- repository-specific instructions

This file represents knowledge about how this repository works. It is intentionally practical rather than architectural.

## Architecture Documentation

Architecture documentation provides context that cannot be inferred from the source code.

This includes:

- architectural principles
- quality attributes
- architectural decisions
- system boundaries
- design rationale

Good architecture documentation explains why the system has been designed in a particular way. That context is just as valuable to an AI coding agent as it is to another developer joining the project.

## DCL as Architectural Context

One of the goals of Articulate is to explore capability-driven architecture. Business capabilities are first-class architectural concepts. Rather than describing capabilities purely in natural language, I use DCL (Declarative Capability Language) to model them in a structured form.

DCL is not intended to replace architecture documentation. Instead, it complements it by providing an unambiguous, machine-readable description of architectural intent. As the project evolves, these capability models become another source of context for both humans and AI. Future episodes will explore DCL in much greater depth.

## The DCL MCP Server

Codex is configured to use the DCL MCP Server.

Rather than searching through markdown documentation to understand capabilities, the coding agent can query the capability model directly.

This provides structured information about:

- capabilities
- relationships
- constraints
- architectural intent

The MCP server does not replace documentation. Instead, it provides direct access to architectural knowledge in a form that both humans and AI agents can understand consistently.

## Codex Skills

One feature I have deliberately kept lightweight is the use of Codex Skills. Rather than encoding repository-specific knowledge into Skills, I prefer to reserve them for repeatable engineering behaviours.

For example, one simple Skill reminds the coding agent to consider whether an Architectural Decision Record (ADR) should be created whenever a significant architectural change is made. The Skill does not make architectural decisions.

It simply encourages good engineering discipline by asking questions such as:

- Has the architecture changed?
- Have new architectural boundaries been introduced?
- Has a significant design decision been made?
- Should an ADR be created or updated?

This mirrors the behaviour of an experienced engineer reviewing a pull request rather than an autonomous system attempting to manage the architecture.

## AI as an Engineering Partner

Throughout this series you will notice a consistent pattern. The architect remains responsible for the architecture. The AI assists with implementation.

The workflow is intentionally simple:

![AI-assisted development workflow from architect and capability through DCL and an AI coding agent to implementation and architect review](/diagrams/episode-0006-architect-review-workflow.svg)

AI accelerates implementation. It does not replace architectural judgement. 

## This Environment Will Evolve

The AI tooling landscape changes at an extraordinary pace. By the time you read this, my development environment may already have changed. That is entirely expected. Rather than continually updating this episode, I will introduce new techniques and tooling throughout the series as they become relevant.

If a future episode introduces evaluation harnesses, workflow orchestration, additional Skills or new forms of architectural context, it will be because they solve a real problem encountered while building Articulate.

This project is intended to be an honest engineering journal rather than a static reference architecture.

The architecture will evolve.

The tooling will evolve.

Hopefully, so will my understanding.

## Looking Ahead

With the development environment established, the next episodes can begin exploring the architecture of Articulate itself.

We'll start with the heart of the system: the knowledge model.

Understanding how architectural knowledge is represented, governed and queried is fundamental to understanding how AI-native systems differ from traditional software systems.

Everything that follows builds upon that foundation.
