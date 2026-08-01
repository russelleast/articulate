---
episode: 7
title: "The Knowledge Model: What Is Architectural Knowledge?"
description: "Exploring the difference between architectural information and architectural knowledge, and defining the connected Knowledge Model at the heart of Articulate."
season: 2
status: current
published: 2026-07-22
date: 2026-07-22
topics:
- Architectural knowledge
- Knowledge Model
- Claims and evidence
- Architectural structure
- Architecture characteristics
- Architecture principles
- Architecture decisions
- Knowledge relationships
repository_paths:
- docs/episodes/0007-the-knowledge-model.md
- production/diagrams/sources/episodes/0007/architectural-domains.d2
- production/diagrams/sources/knowledge/knowledge-graph-example.d2
---

# Episode 7 – The Knowledge Model: What Is Architectural Knowledge?

One of the most important questions I need to answer before building Articulate is also one of the most fundamental:

**What is architectural knowledge?**

This matters because the Knowledge Model sits at the heart of Articulate.

If I cannot clearly define what architectural knowledge is, then I cannot design a model to represent it.

And if the model is wrong, everything built on top of it will inherit those assumptions.

The agents.

The reasoning.

The retrieval mechanisms.

The impact analysis.

The conversations.

The architecture decisions.

Before thinking about databases, graphs, vectors or AI frameworks, I need to understand the thing I am actually trying to model.

My current answer is deceptively simple:

> Knowledge is information combined with thinking.

For Articulate, that means architectural knowledge is not simply a collection of facts about systems.

It is information about an architecture, connected together and given meaning through reasoning, evaluation and context.

That distinction has become fundamental to how I now think about the Knowledge Model.

## What is architecture?

To model architectural knowledge, I first need a working definition of architecture itself.

Architecture is four connected concerns:

1. Structure
1. Characteristics
1. Principles
1. Decisions

Structure describes what makes up the architecture and how those parts relate.

Characteristics describe the qualities the architecture needs to exhibit: availability, scalability, security, maintainability, performance and the other system qualities that shape architectural choices.

Principles establish enduring guidance and constraints for how the architecture should evolve.

Decisions capture the significant choices made within that architecture and, importantly, why those choices were made.

These concerns do not exist independently.

A decision may improve one architectural characteristic while compromising another.

A principle may exist because previous systems repeatedly experienced the same operational problem.

A solution design may implement an earlier architecture decision.

A structural change may invalidate assumptions behind an existing decision.

The architecture therefore cannot be understood simply by cataloguing its parts.

It exists in the relationships between those parts.

## The information within an architecture

The structural information itself spans multiple architectural domains.

At a high level, these include:

![The business, application, data and infrastructure architectural domains](/diagrams/episode-0007-architectural-domains.svg)

Each domain contains different kinds of information.

The business domain might describe capabilities, processes and organisational responsibilities.

The application domain might describe systems, services, components and interfaces.

The data domain might describe databases, data products, schemas and ownership.

The infrastructure domain might describe cloud services, compute environments, networks and deployment platforms.

But these domains are not separate inventories.

They are connected.

A business capability may be realised by several application components.

Those components may depend on databases.

Those databases and components are hosted on infrastructure.

A decision may explain why a particular technology was selected.

A principle may constrain which technologies are acceptable.

An architectural characteristic may explain why a particular infrastructure topology exists.

This means the value of the information is not only in knowing that individual things exist.

The value is also in understanding how they relate.

Consider questions such as:

> Which infrastructure ultimately supports this business capability?

> Which solution designs were influenced by this architecture decision?

> Which architecture principle emerged from previous operational pain?

> Which databases use MongoDB as their database engine?

> Which AWS Lambda functions are running Python 3.12?

These questions cross different architectural domains and different types of architectural information.

Answering them requires more than a list of systems.

It requires a connected representation of the architecture.

![A messaging platform used by an application component that supports a business capability](/diagrams/knowledge-graph-example.svg)

## Information is not yet knowledge

This leads to an important distinction.

A connected graph of systems, databases, technologies, capabilities and infrastructure would be extremely useful.

But I am not convinced that it is automatically knowledge.

It may simply be well-structured information.

Suppose Articulate knows that:

> Order Service uses MongoDB.

That is useful information.

But architectural knowledge requires more context.

Where did that information come from?

What evidence supports it?

How confident are we that it is correct?

Was it true six months ago, or is it true now?

Does another source contradict it?

Was MongoDB deliberately selected through an architecture decision, or did it emerge organically?

Does its use align with existing architecture principles?

Does it positively or negatively affect the characteristics we care about?

The statement itself is information.

Understanding what that information means within the wider architecture requires thinking.

This is where claims become important.

## Claims as architectural units

Claims first emerged during earlier Articulate discovery experiments.

During discovery, information from different sources had to be synthesised into statements about the architecture.

Those statements could not simply be treated as unquestionable facts.

They were assertions based on the information available at the time.

This led to the idea of a claim as an architectural unit.

A claim is a statement about the architecture that we currently have some reason to believe.

For example:

> Order Service uses MongoDB.

> Customer authentication is performed using JWT tokens.

> The payments platform requires high availability.

> Service ownership is unclear.

> The current deployment process creates operational risk.

These are all statements about the architecture, but they are not necessarily equally reliable.

A claim therefore needs more than a sentence.

It needs context.

A claim can carry:

* **Provenance** — where the claim came from.
* **Evidence** — what supports the claim.
* **Polarity** — whether information supports or opposes the assertion.
* **Temporal status** — when the claim was, or is believed to be, true.
* **Confidence** — how strongly the available information supports it.
* **Domain** — which area of the architecture the claim relates to.

This makes claims fundamentally different from facts stored in a traditional data model.

They acknowledge that architectural understanding is often incomplete.

Different people may describe the same system differently.

Documentation may be outdated.

The implementation may contradict the intended architecture.

A decision may have been made but never implemented.

Something that was true last year may no longer be true today.

Rather than hiding that uncertainty, the Knowledge Model needs to represent it.

A claim is therefore not a weakness in the model.

It is an acknowledgement of how architectural knowledge actually exists.

## From information to knowledge

This brings me back to the distinction at the beginning of this episode.

> Knowledge is information combined with thinking.

Articulate can receive information from many places.

It may emerge through conversation.

It may come from an architecture decision.

It may be observed from source code or infrastructure.

It may be provided by an architect.

It may be discovered in existing documentation.

The source is important, but the source does not define the Knowledge Model.

The Knowledge Model exists to represent what Articulate understands about the architecture.

That understanding includes the information itself, the relationships between information, the claims made about it and the context required to evaluate those claims.

But there is another part.

Thinking.

Imagine that Articulate encounters operational problems across several systems.

Each problem is information.

Individually, they may appear unrelated.

But when that information is evaluated against existing architectural knowledge, a recurring pattern might emerge.

Perhaps multiple incidents share the same architectural cause.

Perhaps an existing architecture principle is repeatedly being violated.

Perhaps the evidence suggests that a new principle should be considered.

Perhaps the pattern indicates that an important architectural characteristic is degrading.

Perhaps the architecture is becoming less resilient even though every individual system appears healthy in isolation.

The information has not simply been stored.

It has been evaluated in the context of what is already known.

Something new has been learned.

That is the difference I am trying to capture.

Information changes as the world changes.

Knowledge evolves when new information is combined with existing understanding and evaluated through reasoning.

## The Knowledge Model

The Knowledge Model is therefore not simply a repository of architectural facts.

It is the connected representation of what Articulate currently understands about an architecture.

At its core are architectural concepts such as:

- Structures
- Capabilities
- Components
- Data
- Infrastructure
- Characteristics
- Principles
- Decisions
- Claims
- Evidence

And, critically:

**the relationships between them.**

A business capability should not exist as an isolated node.

It should be possible to understand which application components realise it.

Those components should connect to the data they use.

They should connect to the infrastructure on which they execute.

The decisions that shaped them should be traceable.

The principles that constrained those decisions should be visible.

The characteristics affected by those choices should be understood.

Claims should explain what Articulate currently believes about all of these things and why.

The result begins to resemble a graph because architecture itself is highly connected.

But the graph is not the point.

The relationships are.

The graph is simply one way of representing them.

This distinction is important because I do not want the technology used to store the model to define the conceptual architecture.

The Knowledge Model should describe architectural knowledge independently of whether its implementation eventually uses a graph database, a relational database, event streams or some combination of technologies.

Architecture first.

Technology later.

## The Knowledge Model as the system of record

Within Articulate, the Knowledge Model becomes the authoritative representation of architectural knowledge.

That does not mean every piece of information within it is unquestionably true.

In fact, the claim model explicitly acknowledges the opposite.

The system of record is authoritative because it represents the current state of Articulate's understanding.

That understanding may include uncertainty.

It may include competing claims.

It may include incomplete evidence.

It may change over time.

The important point is that architectural understanding has a coherent home.

Other representations may eventually be created to support different capabilities.

Some may optimise semantic retrieval.

Others may optimise relationship traversal.

Others may support historical analysis.

But those are implementation and retrieval concerns.

They are not the definition of the knowledge itself.

That distinction will become important as the architecture evolves.

## Information enters through many paths

Another important consequence of this model is that the Knowledge Model cannot be designed around documents.

Documents are one possible source of information.

They are not the architecture.

And they are not the Knowledge Model.

Architectural information may arrive through a conversation with an architect.

It may come from a repository.

It may be observed from running infrastructure.

It may come from an Architecture Decision Record.

It may be produced by another Articulate capability.

It may be inferred through reasoning over information already present.

This means the boundary around the Knowledge Model needs to deal in architectural concepts rather than files.

A consumer should not need to understand how architectural knowledge is physically stored.

Nor should every consumer be allowed to manipulate that knowledge directly.

This leads to another important part of the architecture.

## The Knowledge API

The Knowledge Model will sit behind a Knowledge API.

The purpose of this boundary is not simply to hide a database.

It protects the integrity of architectural knowledge.

Consumers interact with architectural concepts and capabilities rather than storage structures.

They might need to:

contribute new architectural information
retrieve connected architectural knowledge
inspect the evidence behind a claim
understand the relationship between a decision and a design
explore the architecture supporting a business capability

Exactly how those operations should work is something I still need to design.

In particular, adding new information to the Knowledge Model cannot always be treated as a simple CRUD operation.

New information may need to be interpreted and evaluated against what is already known.

But that is a larger problem.

It deserves its own exploration later in this journal when I look specifically at how architectural knowledge evolves.

For now, the important decision is the boundary itself:

> Architectural knowledge should be accessed and changed through capabilities that understand its meaning, not through direct manipulation of its storage.

## A foundation for Architectural Intelligence

The Knowledge Model is the heart of Articulate because almost every future capability depends on it.

Discovery needs somewhere to contribute what it learns.

Decision support needs access to previous decisions, principles and evidence.

Impact analysis needs to understand relationships across architectural domains.

Architecture reviews need to evaluate characteristics and principles.

Conversations need context about the architecture being discussed.

Agents need more than disconnected text fragments if they are expected to reason about architectural consequences.

The Knowledge Model provides that foundation.

But the model alone is not Architectural Intelligence.

A graph is not intelligence.

Structured information is not intelligence.

Retrieval is not intelligence.

The intelligence begins to emerge when information can be interpreted in context, evaluated against existing knowledge, connected across architectural domains and used to produce new architectural understanding.

That is the direction I want Articulate to explore.

Not simply:

**How can AI search our architecture documentation?**

But:

**How can AI build, maintain and reason over an evolving understanding of an architecture?**

That is a much harder problem.

It is also a much more interesting one.

## Looking ahead

This episode establishes the conceptual foundation of the Knowledge Model.

Architecture is represented through its structure, characteristics, principles and decisions.

The information describing that architecture spans multiple domains and is connected through relationships.

Claims allow Articulate to represent architectural assertions together with their provenance, evidence, polarity, temporal status, confidence and domain.

And knowledge emerges when information is combined with thinking.

But having a connected Knowledge Model introduces another question.

When an agent needs to answer an architectural question, how should it find the knowledge it needs?

Sometimes the answer may require semantic similarity.

Sometimes it may require following relationships.

Sometimes it may require a precise structured query.

And sometimes the system may not know which approach is appropriate until it begins reasoning about the question.

That is where the next part of the architecture begins.

In the next episode, I will explore **Agentic RAG and Knowledge Reasoning.**

---
episode: 8
title: "Knowledge Reasoning: Beyond RAG"
description: "An exploration of how AI can reason over architectural knowledge by combining semantic search, graph traversal, structured queries and explicit reasoning strategies."
season: 2
status: current
published: 2026-07-22
date: 2026-07-22
topics:
- Knowledge reasoning
- Agentic RAG
- GraphRAG
- Semantic search
- Graph traversal
- Structured queries
- Reasoning agents
- Reasoning maps
repository_paths:
- docs/episodes/0008-agentic-rag-and-knowledge-reasoning.md
- production/diagrams/sources/reasoning/knowledge-reasoning-flow.d2
- production/diagrams/sources/reasoning/knowledge-reasoning-layer.d2
- production/diagrams/sources/reasoning/reasoning-before-agents.d2
- production/diagrams/sources/reasoning/reasoning-map-example.d2
- production/diagrams/sources/knowledge/knowledge-graph-example.d2
---

# Episode 8 – Knowledge Reasoning: Beyond RAG

In the previous episode, I explored the idea of treating architecture as knowledge.

Architecture is not simply a collection of documents. It is a connected body of information about the structure of a system, its characteristics, the principles that guide it and the decisions that have shaped it.

That information exists across different architectural domains.

A business capability may be supported by application components. Those components may depend on data, integrations and infrastructure. Decisions explain why parts of the architecture exist in their current form. Principles influence those decisions. System characteristics provide constraints that shape the resulting design.

The Knowledge Model gives Articulate a way to represent this information and, importantly, the relationships between it.

But representing knowledge creates another question.

**How should AI reason with that knowledge?**

This is where the problem becomes more interesting than simply retrieving information.

## Retrieval Is Not Reasoning

Imagine asking Articulate a question:

> What would be affected if we replaced our current messaging platform?

Finding information about the messaging platform is only the beginning.

To provide a useful architectural answer, the system may need to identify which application components depend upon it.

It may then need to understand which business capabilities those components support.

There may be architectural decisions that explain why the messaging platform was originally selected. Those decisions may have been influenced by particular system characteristics or architectural principles.

A proposed replacement may satisfy some of those constraints while conflicting with others.

The answer therefore does not exist as a single piece of information waiting to be retrieved.

It has to be constructed from the knowledge available.

This creates an important distinction.

**Retrieval gathers relevant knowledge.**

**Reasoning determines what that knowledge means in the context of the question.**

This distinction is important when thinking about how AI systems interact with architectural knowledge.

## The Problem Is Bigger Than RAG

Retrieval-Augmented Generation, or RAG, has become a common architectural pattern for giving language models access to information beyond their training data.

A typical implementation takes documents, divides them into chunks, creates vector embeddings and retrieves chunks that are semantically similar to a user's question.

This is useful.

Articulate may use semantic search for exactly this reason.

But architectural knowledge is not simply a collection of text fragments.

Consider a question such as:

> Which business capabilities would be affected if this infrastructure component failed?

The answer is not necessarily contained within a semantically similar paragraph.

The system may need to follow relationships.

An infrastructure component hosts an application component.

That application component supports a business capability.

The relationship between those concepts is itself part of the knowledge.

Semantic similarity can help us find relevant information, but it cannot be the only way we navigate architectural knowledge.

## GraphRAG and Connected Knowledge

This is one reason approaches such as GraphRAG are interesting.

Rather than treating information only as isolated chunks of text, a graph allows relationships between information to become part of the retrieval process.

This aligns naturally with the Knowledge Model introduced in the previous episode.

If Articulate knows that:

* a business capability is supported by an application component;
* the application component depends on an integration;
* the integration uses a messaging platform;
* the messaging platform is hosted on particular infrastructure;

then a question about that infrastructure can be explored through those relationships.

The important shift is that retrieval is no longer only about finding information that looks similar to the question.

It can also be about navigating the structure of what is known.

However, graph traversal is not the answer to every question either.

Some questions are semantic.

> What information do we have related to resilience?

Some questions are relational.

> Which capabilities depend on this component?

Some questions are structured.

> Which accepted architecture decisions affect this domain?

Others may require several of these approaches together.

> Find the decisions related to event-driven integration and identify which application components and business capabilities they affect.

The important architectural principle is therefore not that Articulate should use vector search, a knowledge graph or structured queries.

It is that **different questions require different ways of retrieving knowledge**.

## From Retrieval Strategy to Reasoning Strategy

This leads to a broader question.

Before Articulate can decide how to retrieve information, it needs to understand what kind of question it is trying to answer.

Consider these questions:

> What depends on this component?

> Why did we choose this technology?

> Does this proposal conflict with an architectural principle?

> What changed between these two architectural states?

> What evidence supports this claim?

Each question requires something different from the system.

The first requires understanding relationships and dependencies.

The second requires reconstructing the context around a decision.

The third requires evaluating a proposal against existing constraints.

The fourth requires reasoning across time.

The fifth requires tracing knowledge back to supporting evidence.

Calling all of this simply "agent reasoning" hides an important part of the architecture.

The system needs different **reasoning capabilities**.

For Articulate, some of these may include:

### Relational Reasoning

Relational reasoning explores how architectural concepts are connected.

It allows questions such as:

> What depends on this?

> What does this support?

> Which parts of the architecture are connected to this decision?

This form of reasoning naturally relies heavily on the relationships captured within the Knowledge Model.

### Constraint Reasoning

Architecture contains constraints.

Principles, system characteristics, policies and previous decisions all influence what constitutes an appropriate design.

Constraint reasoning asks questions such as:

> Does this proposal violate an existing architectural principle?

> Does this design satisfy the required availability characteristic?

The system is not simply looking for relevant information. It is evaluating one piece of knowledge in the context of another.

### Comparative Reasoning

Architectural decisions frequently involve alternatives.

Comparative reasoning examines options in the context of the problem being solved.

The important comparison is rarely a generic list of advantages and disadvantages.

An option may be appropriate in one architectural context and unsuitable in another.

The reasoning therefore needs to consider the requirements, characteristics, principles and existing architecture surrounding the decision.

### Temporal Reasoning

Architecture evolves.

A decision that is correct today may replace an earlier decision that was equally correct when it was made.

Temporal reasoning allows Articulate to understand that architectural knowledge exists within time.

It can help answer questions such as:

> What did this decision replace?

> Why did the architecture change?

> Which assumptions were true when this decision was made?

This becomes increasingly important as the Knowledge Model evolves.

### Evidential Reasoning

Architectural knowledge should not exist without context.

Claims may be supported by conversations, documents, observations or other evidence.

Evidential reasoning allows the system to ask:

> What supports this conclusion?

> Where did this information come from?

> How confident should we be in it?

This is particularly important for an AI-native architecture system because not everything discovered or inferred by AI should automatically become accepted architectural truth.

These are not necessarily five agents.

That distinction matters.

They are **reasoning capabilities**.

How those capabilities are eventually implemented is a separate architectural decision.

## Agentic RAG

This is where the idea of Agentic RAG becomes useful.

Instead of following a fixed retrieval pipeline, an agent can decide how knowledge should be gathered based on the question it is trying to answer.

A reasoning process might begin with semantic search to identify relevant concepts.

It might then traverse relationships within the Knowledge Model.

It could use structured queries to retrieve specific architectural information.

The results may reveal that additional knowledge is required, causing the reasoning process to perform further retrieval.

The process becomes iterative.

A simplified view might look like this:

![Knowledge reasoning flow selecting semantic search, graph traversal or a structured query before reasoning, validation and explanation](/diagrams/knowledge-reasoning-flow.svg)

The important difference is that retrieval is no longer a single step before generation.

Retrieval becomes part of the reasoning process.

The system can decide what information it needs, retrieve it, examine what it has discovered and determine whether further knowledge is required.

But I think even the term Agentic RAG risks making retrieval the centre of the architecture.

For Articulate, the more useful concept is a **Knowledge Reasoning Layer**.

## The Knowledge Reasoning Layer

The Knowledge Model is responsible for representing what Articulate knows about an architecture.

The Knowledge Reasoning Layer is responsible for helping Articulate reason with that knowledge.

Conceptually, it sits between reasoning capabilities and the underlying ways in which knowledge can be accessed.

![Knowledge Reasoning Layer connecting reasoning capabilities to semantic search, graph traversal and structured queries over the Knowledge Model](/diagrams/knowledge-reasoning-layer.svg)

This is a conceptual boundary rather than an implementation design.

The purpose is to separate two concerns.

The Knowledge Model represents architectural knowledge.

The reasoning layer determines how that knowledge should be explored and interpreted for a particular problem.

This means an agent should not necessarily need to understand how every piece of knowledge is stored.

Instead, it needs capabilities that allow it to ask meaningful questions of the Knowledge Model.

The details of whether those questions require semantic retrieval, graph traversal, structured queries or a combination of approaches belong within the knowledge reasoning architecture.

## Reasoning Before Agents

One of the lessons I am beginning to take from designing Articulate is that starting with agents may be the wrong level of abstraction.

It is easy to identify a problem and immediately create an agent for it.

A research agent.

A decision agent.

An impact analysis agent.

A principle agent.

But the existence of an agent tells us very little about the reasoning it actually needs to perform.

Before designing an agent, I think the more useful questions are:

What problem is it trying to solve?

What kind of reasoning does that problem require?

What knowledge does that reasoning depend upon?

How should that knowledge be retrieved?

What evidence should support the result?

Only then does it make sense to ask how the capability should be implemented and whether an agent is the appropriate runtime abstraction.

For Articulate, this suggests a progression:

![Reasoning-first progression from the problem through capability, required knowledge and retrieval strategy to agent behaviour](/diagrams/reasoning-before-agents.svg)

This follows the wider architectural approach I am trying to take throughout this project.

The architecture should emerge from the problem and the capabilities required to solve it.

The agents come later.

## Knowledge Graphs and Reasoning Maps

There is another idea that becomes possible once knowledge and reasoning are treated separately.

The Knowledge Model can tell Articulate what it knows.

But it does not necessarily explain how a particular conclusion was reached.

Consider an impact analysis.

The Knowledge Model may contain:

![Knowledge graph linking a messaging platform to an application component and the business capability it supports](/diagrams/knowledge-graph-example.svg)

A reasoning process may traverse these relationships and conclude that changing the messaging platform could affect the business capability.

The relationships exist in the Knowledge Model.

But the path taken through those relationships is part of the reasoning process.

This suggests a distinction between a **knowledge graph** and a **reasoning map**.

The knowledge graph represents the connected architectural knowledge available to the system.

A reasoning map represents the path taken through that knowledge while answering a particular question.

For example:

![Reasoning map tracing a question through platform dependencies, capabilities, decisions and principles to a conclusion](/diagrams/reasoning-map-example.svg)

The reasoning map is not necessarily part of the permanent architectural knowledge.

It is an artefact of reasoning.

But it may be valuable.

It provides a way to inspect how a conclusion was reached.

It can show which knowledge was used.

It can expose assumptions.

It may allow an architect to challenge a reasoning path rather than simply accepting or rejecting the final answer.

This becomes particularly important when AI is participating in architectural decisions.

A useful answer is important.

Understanding how the system reached that answer may be just as important.

## Towards Architectural Intelligence

The Knowledge Model established the foundation for representing architecture as connected knowledge.

Knowledge reasoning adds the next layer.

Articulate needs to do more than retrieve information that appears relevant to a question.

It needs to understand relationships.

It needs to evaluate constraints.

It needs to compare alternatives within architectural context.

It needs to reason across time.

It needs to understand the evidence behind what it knows.

And it needs to explain how it reached its conclusions.

Semantic search remains useful.

Graph traversal remains useful.

Structured queries remain useful.

Agentic RAG provides a useful model for allowing agents to choose between those retrieval strategies dynamically.

But none of them, individually, are Architectural Intelligence.

Architectural Intelligence emerges from combining structured knowledge with explicit reasoning capabilities.

That leads to the next question.

If Articulate is going to contain agents that perform these reasoning capabilities, how should their intended behaviour be described?

That is where DCL enters the architecture.

---
episode: 9
title: "Defining Architectural Behaviour with DCL"
description: "An exploration of how DCL preserves architectural intent by describing capabilities, behaviour, outcomes, rules and policies independently of their implementation."
season: 2
status: current
published: 2026-07-24
date: 2026-07-24
topics:
  - DCL
  - Declarative behaviour
  - Capabilities
  - Architectural intent
  - Policies and constraints
  - Domain discovery
repository_paths:
  - docs/episodes/0009-defining-architectural-behaviour-with-dcl.md
  - production/diagrams/sources/episodes/0009/conversation-to-dcl.d2
  - production/diagrams/sources/episodes/0009/formalised-intent.d2
  - production/diagrams/sources/episodes/0009/architecture-sequence.d2
  - production/diagrams/sources/episodes/0009/discovery-to-dcl.d2
---

# Episode 9 – Defining Architectural Behaviour with DCL

> **Question:** Can architectural behaviour be described declaratively?

In Episode 6, when I explored AI-assisted development, I briefly introduced DCL — the Declarative Capability Language.

At the time, the important idea was that if AI is going to help us build software, it needs better information about what that software is actually supposed to do.

Source code can tell us what a system does today.

Documentation can tell us what someone intended it to do.

Requirements can tell us what someone once asked for.

But none of these necessarily preserve the original architectural intent of a capability as it moves from an idea into an implemented system.

This is the problem that DCL is intended to explore.

DCL describes capabilities declaratively.

It does not begin with classes, services, agents, workflows or APIs. It begins with the capability itself: the outcome it exists to produce, the behaviour expected of it, the rules it must respect and the policies under which it operates.

For Articulate, this provides something important.

The Knowledge Model gives Articulate a way to represent what we know about an architecture.

DCL gives us a way to express what capabilities within that architecture are intended to do.

Those are different concerns, but they are deeply connected.

---

## The Translation Problem

Architecture rarely becomes software directly.

An architectural idea moves through many different representations before it reaches a running system.

A business need might become a capability.

That capability might become part of a solution design.

The design might become requirements or backlog items.

Those requirements might become implementation tasks.

The tasks eventually become source code, configuration, infrastructure, workflows and operational processes.

At every transition, information can be lost.

The original intent behind a capability becomes distributed across the implementation.

Its behaviour might exist in source code.

Its constraints might exist in validation logic.

Its policies might exist in configuration.

Its lifecycle might be spread across several services.

Its operational expectations might exist in deployment configuration.

Its reasoning might exist in an AI prompt.

Its original purpose might exist only in an old document.

The implementation may work perfectly while the architectural intent that produced it becomes increasingly difficult to recover.

This is not simply a documentation problem.

It is a representation problem.

We have many ways to describe how software is implemented, but fewer ways to precisely describe the intended behaviour of a capability independently of that implementation.

DCL is an attempt to provide that representation.

---

## Capabilities Before Implementations

A capability describes something a system is able to do.

That sounds simple, but it creates an important architectural boundary.

A capability is not a service.

It is not an API.

It is not an agent.

It is not a workflow.

These are implementation mechanisms.

The capability should remain meaningful even if those mechanisms change.

Consider an architectural capability that evaluates whether a proposed decision conflicts with existing architecture principles.

That capability might initially be implemented by deterministic software.

Later, part of the evaluation might be performed by an AI agent.

The process might eventually become a durable workflow involving several reasoning agents and human approval.

The implementation has changed considerably.

The capability has not.

Its purpose still exists.

Its expected outcomes still exist.

Its governing rules still exist.

Its constraints still exist.

This is why I see capabilities as a more durable architectural building block than the technologies used to implement them.

DCL provides a way to describe that intent without requiring the implementation to already exist.

---

## Describing Behaviour Without Describing Implementation

When I talk about describing a capability, I mean more than giving it a name and a description.

A useful capability has behavioural intent.

It exists to produce an outcome.

Something can initiate or participate in that behaviour.

Events may cause behaviour to occur.

Rules may determine what is permitted.

Invariants may describe conditions that must remain true.

Policies may govern qualities such as reliability, security, observability or confidence.

A capability may have a lifecycle.

It may produce effects elsewhere in the system.

Together, these concepts describe something much richer than a traditional box on an architecture diagram.

They describe how the capability is expected to behave.

DCL provides a structured language for expressing that intent.

The purpose is not simply to generate another form of documentation.

The purpose is to create a representation precise enough to be understood consistently by people, tooling and AI.

Prose is valuable because it allows us to explain ideas.

But prose also contains ambiguity.

Different readers can interpret the same sentence differently. Important details can remain implicit. Relationships between concepts may be understood by the author without ever being stated.

That ambiguity becomes particularly significant when an LLM is expected to reason about the architecture.

Giving an LLM more documentation does not necessarily give it better architectural understanding.

Sometimes it simply gives it more text to interpret.

A structured representation reduces the amount of interpretation required.

DCL does not remove the need for explanation.

It gives the explanation something more precise to refer to.

---

## The Knowledge Model and DCL

The previous episodes introduced the Knowledge Model as the heart of Articulate.

It represents architectural knowledge and the relationships between that knowledge.

A business capability might relate to application components.

Those components might depend on data stores.

Those data stores might be hosted on particular infrastructure.

Decisions might affect those components.

Principles might constrain future decisions.

Evidence might support claims about the architecture.

DCL has a different responsibility.

The Knowledge Model represents what Articulate knows about the architecture.

DCL provides a formalised expression of capability intent where that intent is sufficiently understood.

This distinction becomes particularly important because architectural knowledge is rarely complete.

The Knowledge Model needs to tolerate uncertainty.

It may contain incomplete information.

It may contain competing claims.

It may know that something is believed to be true without yet having enough evidence to establish it confidently.

DCL should not be forced to represent every uncertain fragment of knowledge.

Instead, it provides a way of expressing capability behaviour as that understanding becomes sufficiently clear.

The relationship is therefore not:

![A direct transition from conversation to DCL is insufficient](/diagrams/episode-0009-conversation-to-dcl.svg)

It is closer to:

![Conversation progresses through knowledge and understanding before intent is formalised](/diagrams/episode-0009-formalised-intent.svg)

DCL occupies that final stage.

It represents the point where we know enough about a capability to begin stating its behavioural intent explicitly.

---

## Describing Articulate with DCL

The first use of DCL within Articulate is straightforward.

Articulate itself is made up of capabilities.

The Knowledge Model introduced in Episode 7 will require capabilities for managing and evolving architectural knowledge.

The reasoning approaches explored in Episode 8 require capabilities for retrieving and reasoning over that knowledge.

Future parts of Articulate will introduce capabilities for capturing decisions, evaluating trade-offs, assessing principles, discovering domains and analysing architectural change.

Some of these capabilities will eventually be implemented using agents.

Some may use deterministic software.

Some may require workflows.

Some may involve human decisions.

Many will probably combine several of these approaches.

DCL allows those capabilities to be described before those implementation decisions are made.

This matters because the architecture should tell us what the runtime needs to support.

The runtime should not tell us what architecture we are allowed to have.

By describing Articulate's capabilities first, I can evaluate future implementation technologies against the behaviour the system actually requires.

That is the architectural sequence I want this journal to follow:

![Architectural sequence from problem and principles through capabilities and architecture to runtime and technology](/diagrams/episode-0009-architecture-sequence.svg)

DCL helps make the capability layer explicit.

---

## Agents Are Not the Architecture

This becomes particularly important in an AI-native system.

It is tempting to describe the architecture of an agentic system in terms of agents.

A research agent.

A reasoning agent.

A planning agent.

A decision agent.

A knowledge agent.

But I am increasingly unconvinced that the agent itself is the right architectural abstraction.

An agent is an actor.

It is one possible mechanism through which a capability can be fulfilled.

The architectural building block should remain the capability.

This distinction matters because agents are implementation choices.

A capability that researches potential technologies might be implemented by a single agent today.

Tomorrow it might require several specialised agents.

Later, part of the process might become deterministic because a reliable data source becomes available.

The capability remains.

The actors fulfilling it evolve.

This gives us a useful separation.

DCL can describe what the capability is intended to achieve and the conditions under which it operates.

The runtime can decide how that capability is fulfilled.

The implementation can then evolve without requiring us to redefine the architectural intent every time the technology changes.

For a project intended to explore AI-native architecture over time, that separation is important.

The technologies will change.

The architectural intent should be more durable.

---

## Behaviour Should Not Disappear Into Prompts

AI makes the translation problem even more visible.

In traditional software, behaviour eventually becomes source code.

That source code may be difficult to understand, but it can at least be inspected.

In an AI-native system, significant behavioural intent can disappear into prompts.

An agent might be told how to behave through a system prompt.

Its available actions might be defined through tools.

Its boundaries might be enforced through runtime configuration.

Its quality expectations might exist in evaluation suites.

Its operational behaviour might be controlled by an orchestration framework.

Once again, the intent becomes distributed.

The prompt becomes part instruction, part implementation and part architectural description.

This creates a fragile relationship between architecture and runtime behaviour.

DCL offers another possibility.

Instead of treating the prompt as the primary definition of an agent's responsibility, we can describe the capability independently.

The agent then becomes an implementation of that capability.

This does not mean DCL replaces prompts.

It does not mean a declarative description can completely determine the behaviour of a probabilistic model.

It means the intended behaviour exists somewhere outside the prompt.

Somewhere explicit.

Somewhere inspectable.

Somewhere that can be reasoned about.

And increasingly, somewhere that can be validated.

---

## From Conversation to Capability

There is another role for DCL within the longer-term vision for Articulate.

Articulate is not only intended to understand its own architecture.

In the future, it should help architects and domain experts discover and understand other systems and business domains.

That discovery will often happen through conversation.

But conversations rarely produce complete architectural models.

A domain expert might explain that when a customer moves home, their account needs to move with them and they must not be billed twice.

That single statement already contains useful architectural knowledge.

There is probably a capability concerned with moving an account.

There is an expected outcome.

There is a business rule or invariant around duplicate billing.

But much remains unknown.

Who initiates the process?

What lifecycle does it follow?

Which systems participate?

What happens if part of the transfer fails?

What policies govern the process?

What events are produced?

A conversation should not be forced immediately into a complete formal definition.

Articulate first needs to capture what has actually been learned.

That information belongs in the Knowledge Model, along with its relationships, evidence and uncertainty.

As discovery continues, the understanding of the capability becomes richer.

Eventually, enough may be known to express its behavioural intent more formally using DCL.

This creates a progression from conversation to increasingly explicit architectural knowledge:

![Conversation progresses through discovery, knowledge and capability understanding before DCL](/diagrams/episode-0009-discovery-to-dcl.svg)

The important point is that DCL is not simply an input into Articulate.

It can also become an output of architectural discovery.

---

## Formalisation as Part of Discovery

This relationship between discovery and DCL creates another interesting possibility.

A partially understood capability tells us something about what we do not yet know.

We may understand its outcome but not its rules.

We may understand its lifecycle but not all the actors involved.

We may know that it produces an event without knowing what depends upon that event.

We may know the required behaviour without understanding the policies that should govern it.

These gaps can guide future discovery.

The structure of the capability becomes a way of asking better questions.

This does not mean every business capability needs to be exhaustively specified.

That would simply replace one form of documentation bureaucracy with another.

The level of formalisation should be driven by architectural value.

But where behaviour matters, where rules matter, where consequences matter, or where AI is expected to reason about the capability, making that intent explicit becomes increasingly valuable.

DCL therefore has the potential to sit between informal architectural understanding and implementation.

Not as a mandatory specification for everything.

But as a way of formalising the parts of the system where explicit behavioural intent matters.

---

## A Shared Language for Humans and AI

One of the recurring themes in Articulate is that AI-native systems need better representations of architecture.

Documents remain important.

Diagrams remain important.

Source code remains important.

Conversation remains important.

But each representation serves a different purpose.

DCL adds another representation.

It provides a structured description of capability behaviour.

For a human architect, that creates an explicit statement of intent.

For tooling, it creates something that can be parsed and validated.

For an LLM, it provides structured context with less ambiguity than prose alone.

For the architecture, it creates a boundary between what the system is intended to do and how that intent is currently implemented.

That boundary may become increasingly important as AI systems become more dynamic.

If agents can change, models can be replaced, prompts can evolve and orchestration strategies can be redesigned, we need something more stable against which those implementations can be understood.

The capability provides that stability.

DCL provides a language for describing it.

---

## From Capability to Runtime

This episode deliberately avoids discussing how these capabilities will be implemented.

That is the point.

Before choosing an agent framework, workflow engine or runtime architecture, I want to understand the behaviour the system actually requires.

Articulate needs to reason over architectural knowledge.

It needs to evolve that knowledge safely.

It needs to coordinate deterministic software, agents and humans.

It needs to operate within explicit policies and constraints.

It needs to support capabilities whose implementation may change as the system evolves.

DCL gives me a way to describe those capabilities without prematurely choosing the technologies that will implement them.

That now leads to the next architectural question.

If the capabilities are becoming clearer, what kind of runtime is needed to execute them?

The next episode begins the first major technology decision of the implementation journey:

**What runtime best supports Architectural Intelligence?**

But the technology will not be the starting point.

The capabilities will.

---
episode: 10
title: "ADR 0001 – Defining the Runtime Requirements"
description: "Architectural Intelligence requires an execution runtime, but selecting a technology begins with understanding the problem rather than comparing products. This episode opens ADR 0001 by defining the architectural drivers that will guide the decision."
season: 2
status: current
published: 2026-07-30
date: 2026-07-30
topics:
  - Architecture Decision Records
  - Agent runtimes
  - Architectural drivers
  - Architectural Intelligence
  - Technology evaluation
related_decisions:
  - 0001-ai-runtime
repository_paths:
  - docs/episodes/0010-selecting-an-agent-runtime.md
  - docs/adrs/0001-ai-runtime.md
---

# Episode 10 – ADR 0001: Defining the Runtime Requirements

**Question:** *What does an AI-native runtime need to provide?*

The previous episodes established the conceptual architecture for Articulate.

We explored how architectural knowledge can be represented, how AI can reason over that knowledge, and how behaviour can be described declaratively through DCL.

The next step is implementation.

Not implementation of features, but implementation of Architectural Intelligence itself.

The obvious question becomes:

**Where should that intelligence execute?**

At first glance, this appears to be a technology choice.

Should Articulate use Dapr?

Temporal?

LangGraph?

Microsoft Agent Framework?

However, asking those questions first would violate one of the architectural principles that has guided this journal from the beginning.

Architecture begins with problems.

Technology comes afterwards.

---

## The Runtime Is Part of the Architecture

An execution runtime is not simply somewhere to send prompts.

It becomes responsible for coordinating reasoning, invoking tools, managing collaboration between specialised capabilities and interacting with users.

Unlike traditional request-response systems, Architectural Intelligence performs work that may span multiple stages and involve both humans and AI.

The runtime therefore becomes an architectural component in its own right rather than an implementation detail.

Selecting that component deserves the same level of architectural discipline as any other significant decision.

---

## Architectural Drivers

Before evaluating any technology, we first need to understand what the architecture requires.

Several requirements have already emerged naturally from previous episodes.

The runtime should support long-running reasoning rather than assuming every interaction completes within a single request.

It should coordinate specialised capabilities rather than encouraging one increasingly complex agent.

It should integrate external tools and services consistently.

It should provide resilience, observability and recoverability without every capability having to implement these concerns independently.

Finally, it should remain flexible enough to evolve alongside an AI ecosystem that continues to change rapidly.

These requirements form the architectural drivers for the decision.

They do not yet identify a particular technology.

---

## Technology Can Wait

There are already several credible approaches for implementing AI-native systems.

Some focus primarily on workflow orchestration.

Some emphasise autonomous agents.

Others build upon actor models or durable execution.

Each reflects different architectural trade-offs.

At this stage, comparing products would be premature.

The architecture has not yet defined enough of the problem to evaluate them fairly.

---

## An Unanswered Question

One requirement continues to appear regardless of which technology is considered.

Memory.

Every runtime makes assumptions about state.

Some assume stateless execution.

Some persist workflow state.

Some include conversational memory.

Others expect memory to be managed elsewhere.

Without first understanding what memory means within Articulate, it is impossible to determine which responsibilities belong inside the runtime and which belong elsewhere.

Until that question is answered, the runtime decision remains incomplete.

---

## Looking Ahead

This episode opens the investigation recorded in **ADR 0001 – Selecting an Agent Runtime**.

The ADR captures the architectural drivers and candidate approaches identified so far.

However, no technology has yet been selected.

Before the decision can be made, we first need to understand one of the most misunderstood concepts in AI-native systems.

Memory.

That investigation continues in the next episode.

---
episode: 11
title: "Memory in AI-Native Systems"
description: "An architectural exploration of what AI systems call memory, revealing the different state management responsibilities required to support an AI-native runtime."
season: 2
status: current
published: 2026-07-30
date: 2026-07-30
topics:
  - AI Runtime
  - Memory
  - State Management
  - Platform Architecture
  - Agent Runtime
  - Knowledge Model
  - Retrieval
related_decisions:
  - 0001-ai-runtime
repository_paths:
  - docs/episodes/0011-agent-memory.md
  - docs/adrs/0001-ai-runtime.md
---

# Episode 11 – Memory in AI-Native Systems

**Question:** *What does "memory" actually mean?*

Artificial intelligence discussions frequently describe systems in terms of memory.

Working memory.

Conversation memory.

Long-term memory.

Execution memory.

Knowledge memory.

At first glance, it sounds as though AI has introduced an entirely new architectural concept.

However, we sometimes hear new terminology and instinctively pause, and you say to yourself, **"Hold on... isn't this just...?"**

That question isn't dismissive.

It's how architecture evolves.

Before accepting new terminology, we first try to understand the responsibility it represents.

That's exactly what we'll do in this episode.

---

## Memory Through the Eyes of an Agent

If we look purely from the perspective of an AI agent, the terminology makes perfect sense.

An agent needs to remember:

- what it is currently reasoning about
- what has already been said
- previous conversations
- knowledge it can retrieve
- where it has reached during execution

Collectively these are often described as *memory*.

From the perspective of someone designing prompts or agent behaviours, this is a useful abstraction.

But architecture rarely stops at abstractions.

---

## Looking Behind the Word

As architects, our questions are usually different.

When someone says *memory*, we immediately start asking questions such as:

- Where is that information stored?
- Who owns it?
- Who is allowed to change it?
- Is it authoritative?
- Can it be reconstructed?
- How long should it exist?
- What happens if the process crashes?

These questions quickly reveal something interesting.

The different forms of "memory" don't all behave in the same way.

In fact, many of them aren't really the same kind of thing at all.

---

## Different Responsibilities Hidden Behind One Word

The more we decompose the problem, the more *memory* begins to separate into several architectural responsibilities.

Some information only exists while an agent is actively reasoning.

Some information represents an ongoing conversation.

Some information tracks the progress of a long-running task.

Some information belongs to the Knowledge Model introduced earlier in this series.

Some exists purely to make retrieval more efficient.

These have completely different ownership, lifetimes and operational requirements.

Treating them all simply as *memory* starts to hide important architectural distinctions.

---

## The Runtime Doesn't Own Everything

One of the most useful discoveries is that the runtime itself owns surprisingly little information.

Instead, it coordinates work across a wider platform.

When an agent needs architectural knowledge, it doesn't contain that knowledge internally.

It calls tools.

Those tools could be with services or APIs and these code components access the databases.

The Knowledge Model remains the authoritative source of architectural information.

Likewise, conversations may be stored in dedicated persistence.

Workflow state may be stored separately.

External systems remain responsible for their own data.

Rather than owning everything itself, the runtime depends upon the surrounding platform.

---

## Retrieval Is Not Knowledge

Another distinction becomes apparent.

Modern AI systems frequently rely upon:

- vector indexes
- embeddings
- graph projections
- search indexes
- caches

These are often discussed alongside memory.

Architecturally, however, they are something different.

They are not authoritative knowledge.

They are derived structures created to improve retrieval performance.

If an embedding disappears, it can usually be regenerated.

If a search index is lost, it can be rebuilt.

This makes them much closer to database indexes or materialised views than permanent knowledge.

Understanding this distinction becomes increasingly important as AI systems grow.

---

## A Platform Supporting Intelligence

By this point, something interesting has happened.

We started by exploring memory.

Instead, we've uncovered the wider platform required to support an AI-native runtime.

That platform provides:

- persistent conversation state
- execution state
- knowledge services
- retrieval infrastructure
- tool execution
- databases
- caches
- indexes

The runtime orchestrates reasoning.

The platform provides the capabilities that make reasoning practical, resilient and scalable.

---

## Evidence for ADR 0001

This investigation doesn't answer the question of which runtime should be selected.

Instead, it provides new evidence.

The runtime we eventually choose will not operate in isolation.

It must integrate with a broader platform capable of managing different forms of state, interacting with authoritative knowledge, supporting retrieval infrastructure and coordinating external services.

The decision is no longer simply about which runtime has the richest feature set.

It is about which runtime best fits the responsibilities of the platform surrounding it.

---

## Looking Ahead

One responsibility, however, stands apart from the others.

If an agent is interrupted while reasoning, pauses awaiting human approval, or resumes work hours later, the runtime must know exactly where execution reached.

Unlike search indexes or cached retrieval structures, this state cannot simply be regenerated.

Understanding how systems preserve, recover and resume long-running work leads directly to the next stage of ADR 0001.

In the next episode, we'll explore **Durable Execution**—the architectural mechanisms that allow AI-native systems to survive failures, pauses and long-running reasoning without losing their place.

---
episode: 12
title: "Durable Execution and Long-Running Reasoning"
description: "An architectural exploration of how AI-native systems preserve work across interruption, failure and time."
season: 2
status: current
published: 2026-07-30
date: 2026-07-30
topics:
  - Durable execution
  - Runtime architecture
  - Long-running workflows
  - Human-in-the-loop
  - ADR
related_decisions:
  - 0001-ai-runtime
repository_paths:
  - docs/episodes/0012-durable-execution.md
  - docs/adrs/0001-ai-runtime.md
---

# Episode 12 – Durable Execution and Long-Running Reasoning

**Question:** *How does an AI-native runtime preserve execution across time?*

---

## Picking up where we left off

At the end of the previous episode, we had largely untangled the idea of memory.

What initially appeared to be a single concept turned out to be several different architectural responsibilities.

Knowledge belonged to the Knowledge Model.

Conversation belonged to the conversation service.

Embeddings, indexes and caches existed to improve retrieval, not to become permanent stores of knowledge.

One by one, each form of state found an appropriate home elsewhere in the platform.

Only one remained.

Execution state.

At first glance, it was tempting to think this was simply another kind of memory. If an agent stopped unexpectedly, couldn't it just rebuild its context and continue?

That seemed like a reasonable assumption.

But the more I thought about it, the less convinced I became.

---

## Can an agent simply start again?

Imagine an architectural agent analysing the impact of a proposed change.

It retrieves the current Knowledge Model.

It reasons about affected capabilities.

It identifies several architectural risks.

It asks me for clarification before continuing.

At that point, the runtime stops.

Nothing has really been lost.

The conversation can be recovered.

The Knowledge Model is still available.

The agent can retrieve the same information and continue the analysis.

So perhaps execution state isn't particularly special after all.

But now let's change the scenario slightly.

---

## When work has already happened

Instead of waiting immediately, imagine the agent first:

- records a proposed architectural decision,
- invokes another capability,
- sends a notification requesting approval,
- then pauses while waiting for a response.

Now the runtime fails.

When execution resumes, an awkward question appears.

**What has already happened?**

Was the notification sent?

Was the proposal recorded?

Did the second capability already complete?

Should the runtime perform those actions again?

Suddenly the problem isn't remembering information.

The problem is remembering **progress**.

---

## Work in progress

This is where execution differs from every other form of runtime state we have explored.

Knowledge can be retrieved.

Conversation can be replayed.

Context can usually be reconstructed.

Reasoning can often be performed again.

But work already performed cannot simply be assumed.

If execution is lost, the runtime may no longer know:

- which tools have already executed,
- which external actions have already occurred,
- which approvals are still outstanding,
- where work should resume,
- whether retrying an action is actually safe.

Execution isn't simply another category of memory.

It is the record of work in progress.

---

## Crossing the boundary

The distinction becomes clearer when we think about what happens outside the runtime.

An agent rarely exists in isolation.

It calls tools.

It updates knowledge.

It requests approval.

It collaborates with other capabilities.

It communicates with external systems.

Every time execution crosses one of these boundaries, the runtime must know whether that interaction completed successfully before deciding what to do next.

If it simply starts again without knowing what has already happened, it risks repeating work that should never be repeated.

The architecture therefore has a new responsibility.

Not preserving every thought the agent ever had.

Preserving enough of the execution to know what has happened, and what should happen next.

---

## Time becomes part of the architecture

Traditional request-response applications usually complete their work within seconds.

Architectural reasoning often doesn't.

An impact assessment may require clarification.

A proposal may wait for approval.

Research may take hours.

A conversation may continue several days later.

The runtime cannot remain as a continuously running process for all of that time.

Instead, execution itself must survive independently of the process currently performing the work.

This changes how we think about runtime architecture.

Execution is no longer something that exists only while a process is running.

Execution becomes something that exists across time.

---

## Humans change the problem

Human participation makes this even more obvious.

Suppose the runtime asks an architect to approve a proposed change.

The response might arrive five minutes later.

It might arrive next week.

Or it might never arrive at all.

The runtime needs to remember:

- what question was asked,
- who was expected to answer,
- what work led to the request,
- where execution should continue afterwards.

More importantly, the world may have changed while it was waiting.

The architecture may have evolved.

New evidence may have appeared.

Another decision may already have superseded the proposal.

Resuming execution is therefore more than simply waking a suspended process.

It is re-entering a system that may no longer be exactly as it was before.

---

## Durable execution

This investigation gradually led me to a different way of thinking about execution.

Durable execution is not about keeping an agent alive.

It is about preserving the continuity of work.

The runtime should not attempt to preserve every temporary piece of reasoning.

Much of that can be reconstructed.

Instead, it needs to preserve the progress of the execution itself.

It needs to know:

- what work has completed,
- what work remains,
- what effects have already occurred,
- what is still waiting,
- what can safely happen next.

The process performing that work may disappear.

The execution should not.

---

## What belongs to the runtime?

By this point, another architectural boundary had become clearer.

The runtime is not responsible for owning every form of state within the platform.

Knowledge remains the responsibility of the Knowledge Model.

Conversation remains the responsibility of the conversation service.

Retrieval remains the responsibility of the surrounding platform.

The runtime has a much narrower responsibility.

It coordinates work.

It preserves execution.

It allows work to pause, recover and continue reliably even when the underlying processes do not.

That distinction feels surprisingly important.

Episode 11 taught me that the runtime owns far less memory than I first imagined.

Episode 12 suggests it owns something much more valuable.

The continuity of execution itself.

---

## Returning to ADR 0001

This investigation still hasn't selected an agent runtime.

Instead, it has given ADR 0001 another set of architectural drivers.

The runtime must be able to support:

- execution that survives interruption,
- pause and resume semantics,
- long-running reasoning,
- human-in-the-loop execution,
- retries and recovery,
- execution history,
- distributed execution across time.

These are no longer implementation details.

They have become architectural requirements.

---

## Closing thoughts

When I began this investigation, I thought memory might be the defining responsibility of an AI runtime.

Instead, memory led somewhere unexpected.

Most runtime state belongs elsewhere or can be reconstructed.

Execution cannot.

Once work has begun, once tools have executed, once people become involved, and once time itself becomes part of the process, preserving execution becomes an architectural concern rather than simply a runtime feature.

The question is no longer:

*"How does the runtime remember?"*

It becomes:

*"How does the platform ensure work can continue safely after everything else has changed?"*

That question completes the investigation started in ADR 0001.

The architectural requirements are now becoming clear.

The remaining task is to evaluate candidate runtimes against those requirements before making a decision.

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

---
episode: 14
title: "Knowledge Evolution"
description: "An introduction to safely evolving architectural knowledge through proposed changes, reconciliation, validation, baselines, principles, maturity and confidence."
season: 2
status: current
published: 2026-07-31
date: 2026-07-31
topics:
  - Knowledge evolution
  - Claims
  - Architectural truth
  - Proposed changes
  - Baselines
  - Knowledge governance
---

# Episode 14 – Knowledge Evolution

**Question:** *How does architectural knowledge safely change over time?*

In previous episodes, we built the Knowledge Model, explored how agents retrieve and reason over architectural knowledge, and established how long-running reasoning can safely execute.

But one important question remains.

**How does architectural knowledge safely evolve?**

Traditional architecture often treats documents as editable artefacts. Diagrams are updated. Documents are rewritten. Previous versions disappear into source control.

But architectural knowledge should not evolve that way.

The Knowledge Model represents the authoritative understanding of an architecture. If every new observation could overwrite existing knowledge, the system would quickly lose trust.

Instead, architectural knowledge must evolve through a governed process.

---

## Knowledge does not change directly

One of the fundamental principles of Articulate is that **authoritative knowledge is never updated directly.**

Every change entering the system is first treated as a **proposed knowledge change**.

Those changes may originate from many different sources:

- discovery conversations
- source code analysis
- documentation
- Architecture Decision Records
- solution designs
- human edits
- reasoning agents

Although these sources are very different, they all follow the same evolution process.

```text
Incoming Information
        │
        ▼
Proposed Knowledge
        │
        ▼
Interpretation
        │
        ▼
Reconciliation
        │
        ▼
Validation
        │
        ▼
Assessment
        │
        ▼
Merge
        │
        ▼
Knowledge Model
```

The Knowledge Model itself never receives uncontrolled updates.

Instead, every proposed change is staged, interpreted and validated before becoming part of the authoritative model.

This staging area is durable. Proposals may remain under review for hours, days or even weeks while additional evidence is gathered, agents perform further reasoning, or human approval is required.

---

## Everything becomes claims

One of the biggest discoveries while designing the Knowledge Model was realising that architecture is not fundamentally represented as systems, databases or diagrams.

It is represented as **claims**.

A claim is a single architectural assertion.

For example:

- The Payment Service uses PostgreSQL.
- Customer Management is owned by Team Alpha.
- All externally exposed services must support graceful degradation.
- The architecture will adopt Temporal.
- This decision introduces additional operational complexity.

Each claim carries rich metadata describing the knowledge itself rather than simply the statement.

Examples include:

- provenance
- confidence
- polarity
- temporal applicability
- supporting evidence
- maturity

Discovery produces claims with varying confidence based on available evidence.

Solution designs produce claims describing the intended future architecture.

Architecture Decision Records become collections of related claims that collectively describe an architectural decision.

Rather than storing architecture as documents, Articulate stores architectural assertions.

---

## Claims become architecture

The Knowledge Model does not simply persist individual claims.

As claims are accepted they become part of the authoritative body of architectural knowledge.

Specialised logic within the Knowledge Service can then interpret those claims to construct higher-level architectural representations.

For example, claims describing systems, components and relationships naturally form an architectural graph.

Claims describing ownership become organisational views.

Claims describing technologies become technology inventories.

Claims describing principles and decisions become governance views.

In many ways this resembles an ELT process.

Raw architectural assertions are preserved, while specialised projections derive different representations from the same underlying knowledge.

The claim remains the authoritative source.

The projections are simply different ways of viewing it.

---

## Architectural history cannot be rewritten

Another important principle emerged during the design.

**Accepted architectural history cannot be rewritten.**

When new knowledge is accepted, previous knowledge is not deleted or overwritten.

Instead, new knowledge supersedes earlier knowledge.

This allows the system to answer questions such as:

- What did the architecture look like six months ago?
- What do we currently believe?
- What architecture are we intending to build?

The Knowledge Model therefore preserves both architectural evolution and the reasoning behind that evolution.

---

## Baselines represent architectural viewpoints

Baselines do not duplicate the entire Knowledge Model.

Instead, they represent accepted architectural viewpoints.

Knowledge can therefore be viewed relative to a chosen baseline.

From one baseline, a claim may describe the current architecture.

From a later baseline, that same claim becomes historical.

Likewise, a solution design may describe a future architecture without changing the current architectural baseline until the proposal has been accepted.

This naturally allows the Knowledge Model to represent:

- **Once Was**
- **As Is**
- **To Be**

without losing any historical knowledge.

---

## Approval is not the same as merge

Knowledge proposals may remain under review for an extended period.

During that time the architecture itself may continue to evolve.

A proposal originally validated against one baseline may no longer be valid when approval is finally granted.

Before merging, the proposal must therefore be reconciled and validated against the current architectural baseline.

Approval alone is not sufficient.

The proposal must still fit the latest understanding of the architecture.

---

## The role of the Knowledge Service

The Knowledge Model is protected.

Agents never modify it directly.

Instead they invoke tools exposed by the Knowledge Service.

Those tools perform interpretation, reconciliation, validation, assessment and merging.

Retrieval is similarly much more than executing a database query.

Reasoning agents combine structured queries, graph traversal, semantic retrieval and architectural reasoning to answer architectural questions.

The Knowledge Service therefore becomes the governance boundary protecting architectural truth.

---

## Looking ahead

The Knowledge Model now contains authoritative architectural knowledge represented as claims.

But not every architectural insight is explicitly stored.

Contradictions.

Architectural drift.

Knowledge gaps.

Principle violations.

Unsupported assumptions.

These are not persisted facts.

They are derived through reasoning.

In the next episode, we'll explore how Architectural Intelligence derives new architectural knowledge from what it already knows, and why those derived insights become just as valuable as the knowledge stored within the model.