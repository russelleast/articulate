---
episode: 12
title: "Durable Execution and Long-Running Reasoning"
description: "An architectural exploration of how AI-native systems preserve work across interruption, failure and time."
season: 2
status: draft
published: false
date: null
topics:
  - Durable execution
  - Runtime architecture
  - Long-running workflows
  - Human-in-the-loop
  - ADR
---

# Episode 12 – Durable Execution and Long-Running Reasoning

**Question:** *How does an AI-native runtime preserve execution across time?*

---

## Picking up where we left off

At the end of the previous episode, we had largely untangled the idea of memory.

What initially appeared to be a single concept turned out to be several different architectural responsibilities.

Knowledge belonged to the Knowledge Model.

Conversation belonged to the conversation service.

Embeddings, indexes and caches existed to improve retrieval, not to become permanent stores of knowledge.

One by one, each form of state found an appropriate home elsewhere in the platform.

Only one remained.

Execution state.

At first glance, it was tempting to think this was simply another kind of memory. If an agent stopped unexpectedly, couldn't it just rebuild its context and continue?

That seemed like a reasonable assumption.

But the more I thought about it, the less convinced I became.

---

## Can an agent simply start again?

Imagine an architectural agent analysing the impact of a proposed change.

It retrieves the current Knowledge Model.

It reasons about affected capabilities.

It identifies several architectural risks.

It asks me for clarification before continuing.

At that point, the runtime stops.

Nothing has really been lost.

The conversation can be recovered.

The Knowledge Model is still available.

The agent can retrieve the same information and continue the analysis.

So perhaps execution state isn't particularly special after all.

But now let's change the scenario slightly.

---

## When work has already happened

Instead of waiting immediately, imagine the agent first:

- records a proposed architectural decision,
- invokes another capability,
- sends a notification requesting approval,
- then pauses while waiting for a response.

Now the runtime fails.

When execution resumes, an awkward question appears.

**What has already happened?**

Was the notification sent?

Was the proposal recorded?

Did the second capability already complete?

Should the runtime perform those actions again?

Suddenly the problem isn't remembering information.

The problem is remembering **progress**.

---

## Work in progress

This is where execution differs from every other form of runtime state we have explored.

Knowledge can be retrieved.

Conversation can be replayed.

Context can usually be reconstructed.

Reasoning can often be performed again.

But work already performed cannot simply be assumed.

If execution is lost, the runtime may no longer know:

- which tools have already executed,
- which external actions have already occurred,
- which approvals are still outstanding,
- where work should resume,
- whether retrying an action is actually safe.

Execution isn't simply another category of memory.

It is the record of work in progress.

---

## Crossing the boundary

The distinction becomes clearer when we think about what happens outside the runtime.

An agent rarely exists in isolation.

It calls tools.

It updates knowledge.

It requests approval.

It collaborates with other capabilities.

It communicates with external systems.

Every time execution crosses one of these boundaries, the runtime must know whether that interaction completed successfully before deciding what to do next.

If it simply starts again without knowing what has already happened, it risks repeating work that should never be repeated.

The architecture therefore has a new responsibility.

Not preserving every thought the agent ever had.

Preserving enough of the execution to know what has happened, and what should happen next.

---

## Time becomes part of the architecture

Traditional request-response applications usually complete their work within seconds.

Architectural reasoning often doesn't.

An impact assessment may require clarification.

A proposal may wait for approval.

Research may take hours.

A conversation may continue several days later.

The runtime cannot remain as a continuously running process for all of that time.

Instead, execution itself must survive independently of the process currently performing the work.

This changes how we think about runtime architecture.

Execution is no longer something that exists only while a process is running.

Execution becomes something that exists across time.

---

## Humans change the problem

Human participation makes this even more obvious.

Suppose the runtime asks an architect to approve a proposed change.

The response might arrive five minutes later.

It might arrive next week.

Or it might never arrive at all.

The runtime needs to remember:

- what question was asked,
- who was expected to answer,
- what work led to the request,
- where execution should continue afterwards.

More importantly, the world may have changed while it was waiting.

The architecture may have evolved.

New evidence may have appeared.

Another decision may already have superseded the proposal.

Resuming execution is therefore more than simply waking a suspended process.

It is re-entering a system that may no longer be exactly as it was before.

---

## Durable execution

This investigation gradually led me to a different way of thinking about execution.

Durable execution is not about keeping an agent alive.

It is about preserving the continuity of work.

The runtime should not attempt to preserve every temporary piece of reasoning.

Much of that can be reconstructed.

Instead, it needs to preserve the progress of the execution itself.

It needs to know:

- what work has completed,
- what work remains,
- what effects have already occurred,
- what is still waiting,
- what can safely happen next.

The process performing that work may disappear.

The execution should not.

---

## What belongs to the runtime?

By this point, another architectural boundary had become clearer.

The runtime is not responsible for owning every form of state within the platform.

Knowledge remains the responsibility of the Knowledge Model.

Conversation remains the responsibility of the conversation service.

Retrieval remains the responsibility of the surrounding platform.

The runtime has a much narrower responsibility.

It coordinates work.

It preserves execution.

It allows work to pause, recover and continue reliably even when the underlying processes do not.

That distinction feels surprisingly important.

Episode 11 taught me that the runtime owns far less memory than I first imagined.

Episode 12 suggests it owns something much more valuable.

The continuity of execution itself.

---

## Returning to ADR 0001

This investigation still hasn't selected an agent runtime.

Instead, it has given ADR 0001 another set of architectural drivers.

The runtime must be able to support:

- execution that survives interruption,
- pause and resume semantics,
- long-running reasoning,
- human-in-the-loop execution,
- retries and recovery,
- execution history,
- distributed execution across time.

These are no longer implementation details.

They have become architectural requirements.

---

## Closing thoughts

When I began this investigation, I thought memory might be the defining responsibility of an AI runtime.

Instead, memory led somewhere unexpected.

Most runtime state belongs elsewhere or can be reconstructed.

Execution cannot.

Once work has begun, once tools have executed, once people become involved, and once time itself becomes part of the process, preserving execution becomes an architectural concern rather than simply a runtime feature.

The question is no longer:

*"How does the runtime remember?"*

It becomes:

*"How does the platform ensure work can continue safely after everything else has changed?"*

That question completes the investigation started in ADR 0001.

The architectural requirements are now becoming clear.

The remaining task is to evaluate candidate runtimes against those requirements before making a decision.