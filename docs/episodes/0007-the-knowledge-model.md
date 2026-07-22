---
episode: 7
title: "The Knowledge Model: What Is Architectural Knowledge?"
description: "Exploring the difference between architectural information and architectural knowledge, and defining the connected Knowledge Model at the heart of Articulate."
season: 2
status: draft
published: false
date: null
topics:
- Architectural knowledge
- Knowledge Model
- Claims and evidence
- Architectural structure
- Architecture characteristics
- Architecture principles
- Architecture decisions
- Knowledge relationships
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

For Articulate, I think about architecture as four connected concerns:

Structure

Characteristics

Principles

Decisions

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

Business
Application
Data
Infrastructure

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
