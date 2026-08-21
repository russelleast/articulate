---
episode: 16
title: "Building the First Architectural Slice"
description: "The first executable slice of Articulate, using DCL, C4, Dapr and the first reasoning agent to test whether the conceptual architecture survives implementation."
season: 2
status: current
published: true
date: 2026-08-21
topics:
- Architectural implementation
- DCL
- C4
- Dapr
- Dapr Agents
- Knowledge Model
- AI-assisted development
- Agent architecture
- OpenTelemetry
- Observability
thumbnail: /media/episodes/0016/episode-0016-thumbnail.png
youtube_url: https://youtu.be/5EwFlwy2oVU
---

# Episode 16 – Building the First Architectural Slice

**Question:** *Does this architecture actually work when we build it?*

After fifteen episodes, I finally get to create some code.

So far, Articulate has mostly existed as architecture.

Claims represent architectural assertions.

Knowledge evolves through governed proposals rather than uncontrolled updates.

DCL describes capability intent.

Agents reason about architectural knowledge.

Dapr provides the runtime.

OpenTelemetry provides the observability boundary.

All of those ideas make sense on paper.

But implementation has an inconvenient habit of exposing assumptions that diagrams don't.

So for this episode, I wanted to stop designing and build the smallest executable slice of Articulate that could test whether some of these architectural decisions actually work together.

Not the whole Knowledge Service.

Not the whole Knowledge Model.

Just enough software to take a proposed architectural claim, persist it, allow an agent to reason about it and record the result.

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

Information may come from a person, a document, source code, another system or eventually another agent.

Whatever the source, it begins as something Articulate has been told.

Something that still needs to be considered.

The first executable boundary is therefore deliberately simple:

```text
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
```

[Screenshot: CaptureProposedKnowledge DCL capability]

This is also the first practical test of DCL inside Articulate.

The DCL isn't generated from the implementation.

It exists before it.

It describes what the capability means, its inputs, its outcomes, its effects, its policies and what needs to be observed.

Importantly, it does not describe how those things should be implemented.

There is nothing in the capability about Python, MongoDB, RabbitMQ or Dapr.

The interesting question isn't whether AI can generate code from DCL.

It can.

The more useful question is whether describing capability intent separately from implementation helps keep the implementation aligned with the architecture.

That is something I can now start testing rather than theorising about.

## Behaviour and Structure

DCL only describes one part of the architecture.

It describes the behavioural intent of a capability, but deliberately says very little about the structure required to implement it.

For that, I use C4.

**DCL describes the behaviour. C4 describes the structure.**

Together they provide two different views of the same architectural intent.

The initial structure for Capture Proposed Knowledge is deliberately uninteresting:

```text
Claim Simulator
      │
      ▼
Knowledge API
      │
      ▼
Proposed Knowledge
```

[Diagram: initial C4 container view]

The Claim Simulator isn't really part of the Articulate product.

It exists as a development tool.

As Articulate evolves, I can create named scenarios containing collections of claims and repeatedly submit those scenarios to the Knowledge API.

That should become increasingly useful for testing, evaluating and demonstrating Articulate as its reasoning capabilities evolve.

The Knowledge API provides the boundary through which those claims enter the system.

And initially, those claims simply need somewhere durable to be staged.

This is enough to implement Capture Proposed Knowledge.

But it doesn't prove much about an AI-native architecture.

At this point, I've essentially built an API that persists documents.

I wanted this first architectural slice to contain at least one agent actually acting upon the knowledge entering the system.

That introduces the second capability.

## The First Agent

When a proposed claim is captured, an event allows another capability to respond.

The first agent is deliberately modest:

**Review Proposed Claim.**

[Screenshot: ReviewProposedClaim DCL capability]

Its responsibility is to assess whether the statement contained within the proposed claim represents an architectural assertion.

It then records that assessment against the claim.

This isn't deciding whether the claim is architectural truth.

It is the first filter in a much larger knowledge-evolution process.

That boundary is important.

An LLM should not receive a statement, decide that it sounds plausible and silently promote it into authoritative architectural knowledge.

The agent contributes reasoning to the knowledge-evolution process.

It does not own that process.

That preserves one of the most important boundaries established in the previous episodes:

> Reasoning can produce insight. It does not silently redefine architectural truth.

The agent reasons.

The Knowledge boundary controls the effect.

## The Architecture Evolves

Introducing the first agent changes the structural architecture considerably.

[Diagram: evolved C4 container view]

The Claim Simulator still submits claims through the Knowledge API.

The Knowledge API persists those proposed claims.

But once a claim has been captured, an event is published.

RabbitMQ provides the underlying messaging infrastructure, accessed through Dapr Pub/Sub.

The Review Proposed Claim Agent consumes the event and performs the initial assessment.

The agent also needs execution state, which is stored in Redis through Dapr's state building block.

And it needs access to a language model through Dapr Conversation.

The architecture now looks more like this:

```text
                         ┌───────────────┐
                         │ Claim         │
                         │ Simulator     │
                         └───────┬───────┘
                                 │
                                 ▼
                         ┌───────────────┐
                         │ Knowledge API │
                         └───────┬───────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼                           ▼
          Proposed Knowledge               RabbitMQ
                                               │
                                               ▼
                                    Review Proposed Claim
                                            Agent
                                         ┌─────┴─────┐
                                         │           │
                                         ▼           ▼
                                       Redis        LLM
```

What I find interesting is how quickly the architecture changes once reasoning is introduced.

Capturing proposed knowledge required little more than an API and durable persistence.

Adding one reasoning agent introduces asynchronous messaging, execution state, model interaction and another independently executing capability.

This is where the earlier runtime decisions start becoming tangible.

## Dapr Becomes Real

Dapr was selected earlier because Articulate needed more than an agent library.

It needed a runtime foundation for distributed execution, messaging, workflows, state and observability.

Until now, that has mostly been an architectural decision.

This implementation finally gives that decision something to do.

The Knowledge API runs with a Dapr sidecar.

The agent runs with a Dapr sidecar.

Dapr Pub/Sub provides the messaging abstraction over RabbitMQ.

Dapr State provides the abstraction over Redis.

Dapr Conversation provides the boundary between the agent and the language model.

Secrets are also managed through a Dapr building block.

[Screenshot: Docker Compose / running containers]

The important part isn't that the infrastructure disappears.

It doesn't.

RabbitMQ is still RabbitMQ.

Redis is still Redis.

The language model still exists somewhere.

Instead, Dapr creates a runtime boundary between application capabilities and the infrastructure used to support them.

Because this is still a local reference implementation, the entire slice can run using Docker Compose rather than requiring a production hosting decision.

That is exactly the flexibility I wanted when selecting the runtime.

## AI-Assisted Development

This implementation is also an opportunity to test another part of the Articulate approach.

I'm using Codex as my coding agent.

The repository contains an `AGENTS.md` at the root that provides architectural guidance, with another inside the source tree containing engineering guidance and language-level constraints.

I've also created skills that establish a Plan, Implement and Verify development process.

Most importantly, Codex has access to the DCL MCP server.

That means the coding agent doesn't need to treat the DCL capability as another block of text in its context window.

It can interrogate the compiled DCL model and work with the semantic intent of the capability.

This creates an interesting experiment.

Can explicit behavioural intent provide better context for AI-assisted implementation?

DCL describes what the capability means.

C4 describes where it belongs structurally.

The repository provides the engineering constraints.

The coding agent then has to turn those constraints into working software.

The software becomes evidence of whether those different architectural descriptions actually align.

## Prompts as Source Artefacts

The agent also introduces another type of implementation artefact: the prompt.

For this implementation, I'm using Prompty.

[Screenshot: Review Proposed Claim Prompty file]

I like the simplicity of the approach.

There is a small amount of front matter describing the prompt configuration, followed by the prompt itself.

More importantly, the prompt exists as an explicit source-controlled artefact rather than being buried as a string somewhere inside the implementation.

For an AI-native system, prompts contribute directly to runtime behaviour.

Treating them as first-class artefacts makes that behaviour easier to inspect, review and eventually evaluate.

## Running the Model Outside the Platform

The language model introduces another useful boundary.

For this implementation, I'm running Gemma 3 through Ollama on a separate Mac mini rather than putting the model inside the Docker environment.

This isn't an architectural commitment to Gemma, Ollama or local inference.

Quite the opposite.

The model is deliberately outside the architectural core.

Articulate needs a conversation capability through which an agent can interact with a model.

Which model happens to satisfy that capability today should be replaceable.

Dapr Conversation provides that runtime abstraction between the agent and the underlying model provider.

Today that provider happens to be Ollama running Gemma 3.

Tomorrow it could be something else.

The experiment therefore isn't really testing Gemma.

It is testing whether model selection can remain an operational concern without leaking unnecessarily into the capability.

## Starting With MongoDB

I've talked a lot throughout this journal about the Knowledge Model, but I haven't yet made a decision about its eventual physical storage architecture.

And I don't need to make that decision yet.

For this first slice, I simply need durable storage for proposed claims and their review information.

I'm using MongoDB.

MongoDB is not a declaration that the Articulate Knowledge Model is a document database.

Throughout this journal I've deliberately avoided selecting technologies before understanding the architectural problem. That principle still applies here.

At this point, MongoDB is flexible, requires very little ceremony and allows the implementation to evolve without introducing unnecessary migration concerns this early in the architecture.

More importantly, using MongoDB here does not require the physical storage model to define the conceptual Knowledge Model.

The same principle applies to the Knowledge API.

The Knowledge API is not intended to become a CRUD façade over MongoDB.

Its purpose is to protect the boundary around architectural knowledge.

Consumers interact with architectural capabilities rather than manipulating the underlying storage directly.

Even in this very small implementation, I want to preserve that distinction.

## Tools Protect the Knowledge Boundary

One detail became more important during implementation than it appeared on the original diagrams.

When the review agent finishes reasoning, it needs to record the result.

It would be very easy to give the agent unrestricted access to MongoDB.

That would also undermine the architecture almost immediately.

The agent does not own the Knowledge Model or the persistence mechanism.

Instead, the capability exposes a controlled tool for recording the review result.

[Screenshot: agent tool definition / claim update]

Architecturally, the relationship is:

```text
Agent
  │
  │ reasoning
  ▼
Tool
  │
  │ controlled effect
  ▼
Knowledge Boundary
  │
  ▼
Proposed Knowledge
```

The language model can reason.

The agent can decide to invoke an available tool.

But the tool defines what effect the agent is actually permitted to have on architectural knowledge.

That distinction will become increasingly important as Articulate gains more capable agents.

## Running the First Slice

With those pieces in place, the first architectural slice can finally execute.

The Claim Simulator contains named scenarios representing collections of architectural claims.

A scenario is submitted through the Knowledge API.

Capture Proposed Knowledge persists each claim and publishes a notification.

The notification flows through Dapr Pub/Sub and RabbitMQ.

The Review Proposed Claim Agent receives the proposed claim.

The agent interacts with the language model through Dapr Conversation.

It assesses whether the statement represents an architectural assertion.

And the result is recorded against the proposed claim through the controlled tool.

The flow now looks something like this:

```text
Scenario
   │
   ▼
Claim Simulator
   │
   ▼
Knowledge API
   │
   ▼
Capture Proposed Knowledge
   │
   ├──────────► Proposed Knowledge
   │
   ▼
Proposed Claim Event
   │
   ▼
RabbitMQ / Dapr Pub/Sub
   │
   ▼
Review Proposed Claim Agent
   │
   ├──────────► Language Model
   │
   ▼
Controlled Tool
   │
   ▼
Reviewed Proposed Claim
```

[Screenshot: MongoDB proposed claims and review result]

This is obviously still a tiny part of the eventual knowledge-evolution process.

There is no sophisticated reconciliation.

There is no multi-stage assurance.

There is no human approval.

There is no merge into an authoritative architectural baseline.

There shouldn't be.

Adding all of those things now would prove very little other than my ability to build a lot of software.

The purpose of this slice is architectural validation.

Can a capability defined independently of its implementation become executable?

Can proposed knowledge cross the Knowledge API boundary?

Can it remain durable?

Can an agent react to it without owning the knowledge?

Can the model remain replaceable?

Can an agent affect knowledge only through controlled tools?

Can the whole execution be observed?

At this point, the answer to those questions is beginning to be yes.

## Observability From the Beginning

Observability was something I deliberately didn't want to postpone.

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

What matters at this stage is that I can follow execution through the system.

I can see the API receive a request.

I can see the capability execute.

I can see the event.

I can see the agent respond.

I can see the model interaction.

I can see the tool call.

For the first time, Architectural Intelligence isn't just something represented on a diagram.

I can watch it execute.

## The Architecture Has Already Changed

Implementation has exposed details that the conceptual architecture did not fully answer.

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

Architecture is not supposed to predict every implementation detail.

It should provide enough intent that implementation can challenge, validate and improve it.

## From Architecture to Evidence

This episode marks an important change for Articulate.

For fifteen episodes, the architecture has mostly been expressed through ideas, diagrams, DCL and architectural decisions.

Now there is another source of information.

The running system.

We can inspect the code.

We can run tests.

We can inspect persisted claims.

We can observe distributed traces.

We can watch an agent reason and invoke tools.

**The implementation becomes evidence.**

And that creates a new problem.

Seeing that an agent executed successfully tells me almost nothing about whether it executed well.

A distributed trace can tell me which services executed.

It can tell me how long operations took.

It can show me calls crossing the system.

For a normal distributed application, that's incredibly useful.

But this isn't only a distributed application.

An agent made a judgement.

I need to understand the model interaction.

What context did it receive?

What response did the model produce?

Why did the agent reach the conclusion it did?

Was the response grounded?

Is the agent behaving consistently?

And eventually, is the implementation actually producing the outcome that DCL says the capability should produce?

Distributed tracing can tell me how the software executed.

**It doesn't yet tell me whether the intelligence was any good.**

So, does this architecture actually work when we build it?

At this scale, yes.

Claims can enter through the Knowledge API.

They're staged rather than becoming architectural truth.

Capture Proposed Knowledge produces an event.

An independent agent responds to that event, reasons about the claim and records its assessment through a controlled capability.

And I can observe that execution across the system.

It's a small start.

But Articulate is now running software.

That leads to the next question:

**How do we observe and evaluate an agent, rather than simply the services it runs inside?**
