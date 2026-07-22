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
