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