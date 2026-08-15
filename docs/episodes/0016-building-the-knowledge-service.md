---
episode: 16
title: "Building the Knowledge Service"
description: "The transition from conceptual architecture to software through the Knowledge Service, its boundaries, APIs, project structure and foundational abstractions."
season: 3
status: planned
published: false
date: null
topics:
  - Knowledge Service
  - Service boundaries
  - Knowledge APIs
  - Project structure
  - Foundational abstractions
  - Architectural implementation
---

# Episode 16 – Building the Knowledge Service

**Question:** *How do we turn the conceptual architecture into software?*

After 15 episodes, finally got to create some code by creating the beginnings of the Knowledge Model.

Claims represent architectural assertions.

Knowledge evolves through governed proposals rather than uncontrolled updates.

DCL describes capability intent.

Agents reason about architectural knowledge.

Dapr provides the runtime.

OpenTelemetry provides the observability boundary.

All of those ideas make sense on paper.

Implementation has an inconvenient habit of exposing assumptions that diagrams don't.

So for this episode, I wanted to stop designing and build the smallest executable slice of Articulate that could test whether some of these architectural decisions actually work together.

Not the whole Knowledge Service or the whole Knowledge Model.

Just enough to take one proposed architectural claim, persist it, allow an agent to reason about it, and record the result.

This is the first time the conceptual architecture has to survive contact with code.

## Start With the Capability

I didn't want the implementation to begin with an API endpoint or a database schema.

The starting point was the capability.

The first capability is deliberately small:

**Capture Proposed Knowledge.**

Its responsibility is to accept a proposed architectural claim and ensure that proposal enters the knowledge-evolution process.

That distinction matters.

The capability does not accept architectural truth.

It accepts a proposal.

That follows directly from the knowledge-evolution model explored earlier in the journal.

Authoritative architectural knowledge should not be changed simply because some new information arrives.

Information may come from a person, a document, source code, another service or eventually another agent.

Whatever the source, it begins as something Articulate has been told.

Something that still needs to be considered.

So the first executable boundary looks something like this:

Architectural Claim
        │
        ▼
Capture Proposed Knowledge
        │
        ▼
Proposed Claim
        │
        ▼
Knowledge Evolution

[Screenshot: CaptureProposedKnowledge DCL capability]

This is also the first practical test of DCL inside Articulate.

The DCL isn't generated from the implementation.

It exists before it.

It gives the implementation context about what the capability means, its inputs, its outcomes, its effects and the policies that govern it.

The interesting question isn't whether AI can generate code from DCL.

It can.

The more useful question is whether describing capability intent separately from implementation helps keep the implementation aligned with the architecture.

That is something I can now start testing rather than theorising about.

The Smallest Useful Vertical Slice

Once the capability existed, I deliberately kept the implementation narrow.

The slice needs only enough infrastructure to prove the architectural path:

Claim Simulator
      │
      ▼
Knowledge API
      │
      ▼
Capture Proposed Knowledge
      │
      ▼
MongoDB
      │
      ▼
Proposed Claim Event
      │
      ▼
Review Proposed Claim Agent
      │
      ▼
Reviewed Proposed Claim

[Diagram: executable claim slice]

MongoDB is not a declaration that the Articulate Knowledge Model is a document database.
I've tried to avoid just selecting a technology during this journal for not reason, but Mongo is great database and also really good for starting something without worrying about migrations etc.

At this point, I need durable storage for proposed claims.

MongoDB gives me that without forcing the physical storage model to define the conceptual Knowledge Model.

The same applies to the API.

The Knowledge API is not intended to become a CRUD façade over MongoDB.

Its purpose is to protect the boundary around architectural knowledge.

That principle was established when the Knowledge Model was originally designed: consumers should interact with architectural capabilities rather than manipulate the underlying storage directly.

Even in this very small implementation, I want to preserve that distinction.

Dapr Becomes Real

Dapr was selected earlier because Articulate needed more than an agent library.

It needed a runtime foundation for distributed execution, messaging, workflows, state and observability.

Until now, that has mostly been an architectural decision.

This implementation finally gives that decision something to do.

The Knowledge API runs with a Dapr sidecar.

The agent runs with a Dapr sidecar.

Communication between parts of the slice uses Dapr building blocks rather than coupling the implementation directly to infrastructure.

[Screenshot: Docker Compose / running containers]

That gives me an important architectural property very early.

The application code deals with capabilities such as messaging and invocation.

The runtime deals with how those capabilities are connected to infrastructure.

That doesn't make the infrastructure disappear.

It creates a boundary around it.

And because this is still a local reference implementation, the whole slice can run using Docker Compose rather than requiring a production hosting decision.

That is exactly the flexibility I wanted when selecting the runtime.

The First Agent

Persisting claims proves very little about an AI-native architecture.

I wanted this slice to contain at least one agent that actually acts upon the knowledge entering the system.

So when a proposed claim is captured, an event allows another capability to respond.

The first agent is deliberately modest:

Review Proposed Claim.

[Screenshot: ReviewProposedClaimAgent code/DCL]

Its job is not to decide architectural truth.

It performs an initial review of the proposed claim.

That boundary is important.

An LLM should not receive a statement, decide that it sounds plausible and silently promote it into authoritative architectural knowledge.

The agent contributes reasoning to the knowledge-evolution process.

It does not own that process.

That preserves one of the most important boundaries established in the previous episodes:

Reasoning can produce insight. It does not silently redefine architectural truth.

The agent reviews the proposal and records its assessment against the claim.

The Knowledge Service remains responsible for the knowledge.

The agent remains responsible for reasoning.

Running the Model Outside the Platform

The language model introduces another useful boundary.

For this implementation I'm running Gemma 3 through Ollama on a Mac mini rather than putting the model inside the Docker environment.

[Screenshot: Ollama/Gemma configuration or runtime]

This isn't an architectural commitment to Gemma, Ollama or local inference.

Quite the opposite.

The model is deliberately outside the architectural core.

Articulate needs a conversation capability through which an agent can interact with a model.

Which model happens to satisfy that capability today should be replaceable.

Dapr's Conversation building block is useful here because it creates a runtime abstraction between the agent and the underlying model provider.

Today that provider happens to be Ollama.

Tomorrow it could be something else.

The experiment therefore isn't really testing Gemma.

It is testing whether model selection can remain an operational concern without leaking unnecessarily into the capability.

Tools Protect the Knowledge Boundary

One detail became more important during implementation than it appeared on the original diagrams.

When the review agent finishes reasoning, it needs to record the result.

It would be very easy to give the agent direct access to MongoDB.

That would also undermine the architecture almost immediately.

The agent does not own the Knowledge Model.

So it uses a tool.

The tool updates the proposed claim through the Knowledge Service boundary using the claim identifier and adds the review information.

[Screenshot: agent tool definition / claim update]

This looks like a small implementation detail.

Architecturally, it is doing something much more important.

It preserves authority.

Agent
  │
  │ reasoning
  ▼
Tool
  │
  │ controlled capability
  ▼
Knowledge Service
  │
  ▼
Knowledge Model

The LLM can reason.

The agent can decide to invoke an available tool.

But the tool defines what effect it is actually permitted to have on architectural knowledge.

This distinction will become increasingly important as Articulate gains more capable agents.

Observability From the Beginning

Another thing I did not want to postpone was observability.

AI systems can become opaque extremely quickly.

A request enters.

Several services execute.

An agent invokes a model.

Tools are called.

State changes.

Eventually something comes out of the other end.

Without distributed tracing, understanding that execution becomes guesswork.

So OpenTelemetry is part of this first slice rather than something to add once the system becomes complicated.

[Screenshot: Zipkin distributed trace]

For now, I'm using Zipkin to inspect those traces.

Zipkin itself isn't the architectural decision.

OpenTelemetry is.

That distinction is intentional.

The telemetry standard should survive even if the tool I use to inspect that telemetry changes later.

And I already expect it to change as the requirements for observing agents become clearer.

What matters here is that I can follow a proposed claim through the system.

I can see the API receive it.

I can see the capability execute.

I can see the event.

I can see the agent respond.

I can see the model interaction.

I can see the tool call.

For the first time, Architectural Intelligence isn't just something represented on a diagram.

I can watch it execute.

Seeing the Claim Change

The simplest evidence that the slice works is in MongoDB.

A claim begins as proposed knowledge.

[Screenshot: MongoDB proposed claim before review]

The review agent receives the proposal and reasons about it.

The tool then records the review.

[Screenshot: MongoDB claim after review]

This is obviously still a tiny part of the eventual knowledge-evolution process.

There is no sophisticated reconciliation.

There is no multi-stage assurance.

There is no human approval.

There is no merge into an authoritative architectural baseline.

There shouldn't be.

Adding all of those things now would prove very little other than my ability to build a lot of software.

The purpose of this slice is architectural validation.

Can a capability defined independently of its implementation become executable?

Can proposed knowledge cross the Knowledge Service boundary?

Can it remain durable?

Can an agent react to it without owning it?

Can the model remain replaceable?

Can an agent change knowledge only through controlled tools?

Can the whole execution be observed?

At this point, the answer to those questions is beginning to be yes.

The Architecture Has Already Changed

Implementation has also exposed details that the conceptual architecture did not fully answer.

That is exactly what I wanted.

Some boundaries became clearer only once code existed.

The relationship between an agent and the Knowledge API became more concrete.

The distinction between reasoning and persistence became harder to ignore.

Idempotency started to matter because events and distributed execution introduce retries.

Async behaviour matters because agents spend much of their time waiting on models, tools and external services rather than performing CPU-bound work.

Repository structure started to reflect capability ownership rather than simply technical components.

None of these invalidate the conceptual architecture.

They refine it.

And that is an important part of this journal.

The architecture is not supposed to predict every implementation detail.

It should provide enough intent that implementation can challenge, validate and improve it.

From Architecture to Evidence

This episode marks an important change for Articulate.

For fifteen episodes, the architecture has mostly been expressed through ideas, diagrams, DCL and architectural decisions.

Now there is another source of information.

The running system.

We can inspect the code.

We can run tests.

We can inspect persisted claims.

We can observe distributed traces.

We can watch an agent reason and invoke tools.

The implementation becomes evidence.

And that creates a new problem.

Seeing that an agent executed successfully tells me almost nothing about whether it executed well.

A trace can tell me which model was called.

It can tell me how long the call took.

It can show me which tools were invoked.

But an AI-native system needs another kind of observability.

I need to understand what the agent actually did.

Why did it make that decision?

Was the context sufficient?

Did it choose the correct tool?

Was its conclusion grounded in the available knowledge?

Could I understand why one execution succeeded and another failed?

Traditional distributed tracing gives me part of the picture.

Agents introduce another.

That is the question I want to explore next:

How do we observe an agent, rather than simply the services it runs inside?