# Season 2 – Building the Knowledge Model

**Theme:** Building the conceptual architecture for Articulate before writing any implementation code.

This season explores the ideas behind **Architectural Intelligence**. Rather than starting with frameworks and code, it establishes the knowledge model, reasoning patterns and architectural decisions that will ultimately shape the implementation.

---

## Episode 7 – The Knowledge Model: From Documents to Knowledge

**Question:** *What is architectural knowledge?*

Traditional architecture is document-centric. AI systems often inherit this limitation by treating documentation as chunks of text.

This episode introduces the Knowledge Model as the heart of Articulate, explaining how architecture can instead be represented as structured knowledge composed of claims, decisions, capabilities, components, characteristics, evidence and relationships.

The episode introduces the conceptual data model, the responsibilities of the Knowledge API, and explains why it becomes the system of record for the entire platform.

---

## Episode 8 – Agentic RAG and Knowledge Reasoning

**Question:** *How should AI retrieve and reason about architectural knowledge?*

This episode explores the evolution from traditional RAG to Agentic RAG.

Rather than presenting vectors as the centre of the architecture, it explains how semantic search, graph traversal and structured queries become retrieval strategies available to reasoning agents.

The Knowledge Model remains the source of truth while agents determine how knowledge should be gathered, interpreted and presented.

The episode introduces the concept of the Knowledge Reasoning Layer.

---

## Episode 9 – Defining Architectural Behaviour with DCL

**Question:** *Can we describe AI behaviour declaratively?*

This episode introduces DCL within the context of Articulate.

Rather than viewing DCL as a capability modelling language alone, it explores how agents, capabilities, policies and constraints can be expressed declaratively.

It introduces the idea that agents become architectural building blocks with explicit contracts rather than prompt implementations.

---

## Episode 10 – ADR: Selecting an Agent Runtime

**Question:** *What runtime best supports Architectural Intelligence?*

The first Architecture Decision Record of the implementation journey.

This episode establishes the architectural drivers before evaluating candidate technologies such as Microsoft Agent Framework, LangGraph, Dapr Workflows and Temporal.

Rather than selecting a technology because it is popular, the decision is driven by the conceptual architecture developed in previous episodes.

---

## Episode 11 – Memory in AI-Native Systems

**Question:** *What does memory actually mean?*

Conversation history is only one form of memory.

This episode explores the different forms of memory required by Architectural Intelligence, including working memory, episodic memory, knowledge memory, execution state and conversational context.

It explains how memory differs from the Knowledge Model and why both are required.

---

## Episode 12 – Durable Execution and Long-Running Reasoning

**Question:** *How do agents perform work that cannot complete immediately?*

Many architectural tasks require long-running reasoning, collaboration and human approval.

This episode explores durable execution, workflow orchestration, pause and resume semantics, retries and human-in-the-loop interactions.

It establishes the conceptual runtime requirements before selecting implementation technologies.

---

## Episode 13 – Knowledge Evolution

**Question:** *How does architectural knowledge safely change over time?*

Rather than discussing data ingestion, this episode introduces Knowledge Evolution.

Every change entering the system becomes a proposed knowledge change that must be interpreted, reconciled, validated and assessed before the Knowledge Model evolves.

The episode introduces architectural state, baselines, principles, maturity and confidence as part of the evolution process.

---

## Episode 14 – Derived Knowledge and Architectural Integrity

**Question:** *What knowledge is discovered rather than stored?*

Some architectural concepts are not persisted directly.

Contradictions, unsupported claims, principle violations, ambiguity, architectural drift and knowledge gaps are all derived through reasoning.

This episode introduces these concepts as first-class outcomes of Architectural Intelligence rather than entities within the model.

---

## Episode 15 – Impact Analysis as Knowledge Reasoning

**Question:** *Can AI understand the consequences of architectural change?*

Impact analysis becomes the first practical demonstration of Architectural Intelligence.

Rather than simply traversing relationships, reasoning agents interpret capabilities, decisions, claims and evidence to explain why change matters.

The episode demonstrates how multiple retrieval strategies combine to answer complex architectural questions.

---

# Season 3 – Implementing Architectural Intelligence

---

## Episode 16 – Building the Knowledge Service

**Question:** *How do we turn the conceptual architecture into software?*

After fifteen episodes establishing the conceptual architecture, implementation finally begins.

This episode creates the Knowledge Service, the central service responsible for knowledge evolution and knowledge reasoning.

The implementation establishes the project structure, service boundaries, APIs and foundational abstractions that future episodes will build upon.

It marks the transition from architectural thinking to executable software.