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
