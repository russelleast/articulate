# Episode 9 – Defining Architectural Behaviour with DCL

> **Question:** *How do we stop architectural intent being lost as software is built?*

---

# Introduction

Hello, I'm Russell, and welcome to the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles through the design and implementation of a reference architecture for Architectural Intelligence. This isn't a tutorial series or a product demo. It's a public engineering journal documenting the architectural decisions, experiments and lessons learned as the architecture evolves.

In the last two episodes, we've built the conceptual foundation of Articulate.

We introduced the Knowledge Model as the place where architectural understanding lives.

Then we explored how AI can retrieve and reason over that knowledge.

At this point, it feels like we have an understanding of this part of the architecture.

But there's something important missing.

Understanding an architecture isn't the same as understanding how it is intended to behave.

That raises another question.

**How do we preserve architectural intent as an idea becomes running software?**

---

# The Situation

Let's imagine we've just finished designing a new capability.

We've had conversations with domain experts.

We've captured claims in the Knowledge Model.

We've reasoned about constraints.

We've agreed on the behaviour.

Everything feels clear.

At this moment, the architecture exists almost perfectly.

But only in our current understanding.

Now we have to build it.

---

# The Desire

What we really want is surprisingly simple.

We want the capability to keep its meaning as it moves through implementation.

We don't want to lose:

- why it exists
- what outcome it should produce
- the rules it must obey
- the policies it operates under
- the behaviours we expect

Ideally, those things should remain true regardless of how we eventually implement the system.

That sounds obvious.

But it rarely happens.

---

# The Conflict

This is where architecture begins to leak.

The capability starts life as an architectural idea.

Then it becomes requirements.

Requirements become backlog items.

Backlog items become source code.

Source code becomes deployments.

In an AI-native system, behaviour may disappear even further.

Some intent ends up inside prompts.

Some becomes workflow definitions.

Some is hidden in validation logic.

Some is scattered across configuration.

Some survives only in old documents.

By the time the software reaches production, the original architectural intent has become fragmented.

The software may work perfectly.

But recovering *why* it behaves the way it does becomes increasingly difficult.

This isn't simply a documentation problem.

It's a representation problem.

---

# The Change

While exploring AI-native architecture, I kept running into this problem.

The Knowledge Model was excellent for representing what we understood about the architecture.

But it wasn't the right place to describe how a capability should behave.

That led me to a different question.

**What if capability behaviour became a first-class architectural concept?**

Not services.

Not APIs.

Not agents.

Not workflows.

Capabilities.

Capabilities that describe:

- outcomes
- behaviour
- rules
- policies
- invariants
- effects
- lifecycle

without saying anything about implementation.

That idea became the foundation of DCL.

The **Declarative Capability Language**.

DCL isn't intended to replace source code.

It doesn't replace documentation.

It doesn't replace prompts.

Instead, it provides a durable description of architectural intent.

One that both humans and AI can understand consistently.

---

# Knowledge and Behaviour

This also clarified something else.

The Knowledge Model and DCL have different responsibilities.

The Knowledge Model represents what Articulate currently understands about an architecture.

It can contain uncertainty.

Conflicting claims.

Incomplete evidence.

Knowledge evolves.

DCL is different.

DCL represents behaviour once that understanding has become sufficiently clear.

The progression isn't:

```
Conversation
      │
      ▼
     DCL
```

Instead it becomes:

```
Conversation
      │
      ▼
Knowledge
      │
      ▼
Understanding
      │
      ▼
     DCL
```

The language isn't the starting point.

It's the result of architectural understanding.

---

# Capabilities Before Technology

This changes how I think about architecture.

A capability is not:

- an API
- a service
- an agent
- a workflow

Those are implementation choices.

The capability should survive even if every one of those technologies changes.

Today a capability might be implemented by deterministic software.

Tomorrow it might use an AI agent.

Next year it may become a distributed workflow.

The implementation evolves.

The capability remains.

That's why capabilities feel like a much more durable architectural building block.

---

# Agents Are Not the Architecture

This also changed how I think about AI-native systems.

It's easy to describe an architecture using agents.

A Research Agent.

A Planning Agent.

A Decision Agent.

A Knowledge Agent.

But agents are actors.

They perform work.

They aren't the architectural responsibility itself.

The capability is.

Once I realised that, the architecture became much clearer.

The runtime exists to execute capabilities.

Not the other way around.

---

# The Result

At this point Articulate has three complementary architectural assets.

**Conversation** discovers knowledge.

**The Knowledge Model** captures architectural understanding.

**DCL** formalises capability behaviour.

Each solves a different problem.

Together they preserve architectural intent from discovery through to implementation.

And that's exactly what we'll need as we move into implementation.

Because now that we know:

- what we understand
- how we reason
- and how capabilities should behave

we can finally ask a different question.

**What kind of runtime do those capabilities actually need?**

That becomes the first major architectural decision of the implementation journey. That is the topic for the next episode. selecting an agent runtime