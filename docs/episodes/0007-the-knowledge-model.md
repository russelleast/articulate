# Episode 7 – The Knowledge Model: From Documents to Knowledge

*"Traditional software architecture produces documents. Architectural Intelligence requires knowledge."*

One of the biggest questions I've had to answer while building Articulate is deceptively simple:

**What exactly is architecture?**

For years we've documented architectures using diagrams, documents, ADRs, specifications and wikis. These artefacts are incredibly valuable to humans because they communicate intent, explain decisions and capture knowledge over time.

The problem is that computers don't understand architecture.

They understand documents.

Even modern AI systems typically treat architecture as collections of text. Documents are broken into chunks, embedded into vectors and retrieved when someone asks a question.

This works remarkably well for answering questions about documentation.

It doesn't mean the system understands the architecture itself.

That distinction is fundamental to the rest of this series.

---

# Documents are not knowledge

Imagine asking:

*"What authentication mechanism does this system use?"*

A traditional RAG system searches documentation, retrieves relevant paragraphs and allows the language model to generate an answer.

Now consider a different question.

*"If we replace JWT authentication with OAuth, what architectural decisions, capabilities and quality attributes are affected?"*

This question is very different.

The answer isn't contained within a single document.

The AI needs to understand:

- which capability provides authentication
- which services participate
- which architectural decisions introduced the current design
- what claims those decisions support
- what quality attributes are affected
- what evidence exists
- how confident we are in that evidence

This is no longer document retrieval.

It is architectural reasoning.

---

# From documents to knowledge

This observation led me to rethink the role of documentation.

Instead of becoming the architecture, documents become **sources of architectural knowledge**.

Documentation, discovery conversations, architecture decisions and future integrations all contribute information into a common model.

The model itself becomes the authoritative representation of the architecture.

Rather than storing documents, it stores knowledge.

---

# Knowledge as first-class concepts

The Knowledge Model is composed of architectural concepts rather than files.

Some examples include:

- Capabilities
- Components
- Architecture Decisions
- Claims
- Evidence
- Characteristics
- Constraints
- Relationships
- Principles
- Baselines
- Architectural State

These are the language of architecture.

They are the concepts architects naturally think in.

Rather than asking the AI to interpret paragraphs of documentation every time, we build a representation that already understands these concepts.

---

# Claims

One concept deserves particular attention.

A **claim** is a statement believed to be true about the architecture.

For example:

- The system is event driven.
- Authentication uses JWT.
- Customer data is encrypted at rest.
- Services communicate asynchronously.

Claims become building blocks that can later be supported by evidence, challenged by new information or invalidated by architectural change.

This allows the Knowledge Model to reason about architecture rather than simply describe it.

Future episodes will explore claims in much more detail.

---

# The Knowledge Model is the system of record

Although the Knowledge Model contains vectors and graph relationships, neither of these become the source of truth.

The authoritative representation is the knowledge itself.

Vectors provide semantic retrieval.

Graphs provide relationship traversal.

Structured storage provides persistence.

Together they form different representations of the same knowledge rather than separate systems.

This distinction becomes important later when discussing Agentic RAG.

---

# Knowledge evolves

One idea that has changed significantly during this project is how information enters the model.

Originally I thought about "ingesting" documents.

I no longer think that's the right description.

Architecture doesn't simply absorb information.

It evaluates it.

Every new piece of information becomes a proposed knowledge change.

Whether it originates from a discovery session, an Architecture Decision Record, imported documentation or a manual update, the system first needs to understand what that information means.

Questions naturally arise:

- Does it introduce a new claim?
- Does it contradict an existing claim?
- Does it invalidate an architectural decision?
- Does it affect a principle?
- Does it change architectural maturity?
- Does it create a new baseline?
- How confident are we?

Only after this reasoning does the Knowledge Model evolve.

This process is much closer to maintaining architectural integrity than importing data.

---

# Derived knowledge

Interestingly, not everything exists as stored knowledge.

Some concepts are discovered through reasoning.

For example:

- Contradictions
- Knowledge gaps
- Unsupported claims
- Principle violations
- Architectural drift

These are not entities stored within the model.

They are observations produced by analysing the current state of architectural knowledge.

A contradiction only exists because two or more claims cannot both be true within a particular context.

If those claims change, the contradiction disappears.

This is one of the first examples of Architectural Intelligence emerging from the model itself.

---

# The Knowledge API

The Knowledge Model isn't accessed directly.

Everything passes through the Knowledge API.

This isn't a traditional CRUD API exposing tables or collections.

Instead, it becomes the gateway to architectural knowledge.

Consumers ask architectural questions rather than execute database operations.

Internally, the API will use reasoning agents to determine:

- what knowledge is required
- which retrieval strategy is appropriate
- how evidence should be gathered
- how results should be synthesised

This reasoning layer will become the focus of the next episode.

---

# Architectural Intelligence

As the project has evolved, I've realised Articulate isn't simply becoming another AI application.

It is becoming an exploration into **Architectural Intelligence**.

Rather than treating architecture as documents to search, the goal is to build a living representation of architectural knowledge that can evolve, reason and collaborate with architects.

The Knowledge Model sits at the centre of that vision.

Everything else—including discovery, impact analysis, documentation, architecture reviews and future AI capabilities—builds upon this single foundation.

---

# Looking ahead

This episode introduced the Knowledge Model and explained why documents alone are insufficient for Architectural Intelligence.

The obvious next question is:

*If the Knowledge Model is the source of truth, how should AI retrieve and reason over that knowledge?*

In the next episode we'll explore the evolution from traditional Retrieval-Augmented Generation (RAG) to Agentic RAG, and why retrieval is only one small part of a much larger reasoning architecture.