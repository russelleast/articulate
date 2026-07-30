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
