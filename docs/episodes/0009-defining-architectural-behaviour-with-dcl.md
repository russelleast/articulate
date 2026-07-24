---

episode: 9
title: "Defining Architectural Behaviour with DCL"
description: "An exploration of how DCL preserves architectural intent by describing capabilities, behaviour, outcomes, rules and policies independently of their implementation."
season: 2
status: draft
published: false
date: null
topics:

* DCL
* Declarative behaviour
* Capabilities
* Architectural intent
* Policies and constraints
* Domain discovery

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

**Conversation → DCL**

It is closer to:

**Conversation → Knowledge → Understanding → Formalised Intent**

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

**Problem → Principles → Capabilities → Architecture → Runtime → Technology**

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

**Conversation → Discovery → Knowledge → Capability Understanding → DCL**

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
