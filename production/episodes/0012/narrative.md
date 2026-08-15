# Episode 12 – Durable Execution and Long-Running Reasoning

> **Question:** *What happens to an AI agent when the process executing it disappears?*

## Opening

Hello, I'm Russell, and welcome to Episode 12 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

In the previous episode, I explored what AI systems mean when they talk about memory.

And what initially looked like one architectural concept turned out to be several different responsibilities.

Knowledge belongs to the Knowledge Model.

Conversation has its own state.

Embeddings and indexes support retrieval and can usually be rebuilt.

Even much of the temporary context used while an agent is reasoning can potentially be reconstructed.

But one form of state was different.

Execution.

If an agent is halfway through some work and the process disappears, how does the system know where it got to?

## Work Should Survive the Process

At first, the requirement sounds fairly simple.

If an agent is interrupted, I want it to continue.

Maybe it's analysing the impact of an architectural change.

Maybe it needs clarification from me.

Maybe another agent needs to contribute.

Or perhaps it's waiting for an approval.

Whatever the reason, I don't want the lifetime of that work tied to the lifetime of a thread, a container, or a particular agent instance.

If that process disappears, the work shouldn't disappear with it.

But that raises another question.

Do I actually need to preserve execution?

Couldn't I just run the agent again?

## Can't the Agent Just Start Again?

Imagine an agent analysing the impact of a proposed architectural change.

It retrieves the relevant architectural knowledge.

It identifies the affected capabilities.

It looks at the decisions and principles that might be relevant.

Then it asks me a question before continuing.

If the process disappears at that point, perhaps nothing particularly important has been lost.

The Knowledge Model still exists.

The conversation still exists.

The context can be reconstructed.

The agent can retrieve the information again and continue reasoning.

It might perform some work twice, but perhaps that's acceptable.

So maybe execution state isn't particularly special after all.

The problem appears when the agent starts doing things.

## When Work Has Already Happened

Let's change the scenario slightly.

Before asking me for approval, the agent records a proposed architectural decision.

It invokes another capability.

It sends a notification asking me to review something.

And then it waits.

Now imagine the process disappears.

When it starts again, we have a different problem.

Was the proposed decision already recorded?

Did the other capability complete?

Was the notification already sent?

If I simply restart the reasoning process, should those actions happen again?

Suddenly, the problem isn't remembering what the agent knew.

The problem is knowing what the system has already done.

And that distinction matters.

## Execution Is Progress

This is where execution begins to look different from the other forms of state I explored in the previous episode.

Knowledge can be retrieved.

Conversation can be replayed.

Context can be reconstructed.

Reasoning can often be performed again.

But once work has caused an effect outside the reasoning process, we need to know whether that effect has already happened.

The runtime needs to know what completed.

What failed.

Which tools have already executed.

Which external effects have occurred.

What we're waiting for.

And what can safely happen next.

Execution state isn't simply another form of memory.

It's a record of progress.

## Crossing System Boundaries

This becomes particularly important because agents don't operate in isolation.

They call tools.

They invoke other capabilities.

They update systems.

They request approvals.

They communicate with external services.

Every time execution crosses one of those boundaries, something may happen that can't simply be forgotten and performed again without consequence.

Sending the same notification twice might only be annoying.

Creating the same record twice could be more serious.

Invoking another capability twice could cause an entirely different chain of work to happen again.

So recovering an agent isn't simply about reconstructing its prompt and asking the model to continue.

The system needs to understand what has already happened before it can safely decide what should happen next.

## Humans Make Time Part of the Architecture

And then we introduce us, human beings.

Suppose an agent reaches a point where it needs an architect to approve something.

The response might arrive five minutes later.

It might arrive tomorrow.

It might arrive next week.

Or it might never arrive.

Keeping a process alive while it waits isn't really the answer.

The execution needs to survive independently of the process currently performing the work.

But there's another complication.

The world may have changed while the agent was waiting.

New architectural knowledge may have been accepted.

Another decision may have been made.

The proposal itself may have been superseded.

The state the agent originally reasoned over may no longer represent the current architecture.

So resuming execution isn't necessarily the same as waking up a suspended process.

We're re-entering a system that may have changed while we were away.

Time has become part of the architecture.

## Durable Execution

And this is where the understanding of the problem changed.

Durable execution isn't really about keeping an agent alive.

It's about preserving the continuity of work.

We don't necessarily need to preserve every temporary thought or every piece of reasoning context.

Much of that can be reconstructed.

What we need to preserve is enough of the execution to understand:

What work has completed.

What work remains.

What effects have already occurred.

What we're waiting for.

And what can safely happen next.

The process performing the work may disappear.

The execution should not.

The process is temporary.

The execution is durable.

## What Does the Runtime Actually Own?

This also gives me a much clearer boundary around the runtime itself.

In the previous episode, I discovered that the runtime owns far less memory than I initially expected.

It doesn't own architectural knowledge.

That's the responsibility of the Knowledge Model.

It doesn't need to own every conversation.

It doesn't need to treat embeddings, indexes and caches as permanent memory.

Much of the context required by an agent can be reconstructed from the wider platform.

But execution is different.

The runtime coordinates work.

And if that work can span processes, failures, agents, external systems, humans and potentially days of elapsed time, then preserving the continuity of that execution becomes one of its most important responsibilities.

## Returning to ADR 0001

That gives me another important requirement for ADR 0001.

The runtime Articulate eventually uses needs to support work that survives interruption.

It needs pause and resume semantics.

It needs to recover from failure, support long-running execution and support humans becoming part of that execution.

It needs enough execution history to understand what has already happened.

And it needs to coordinate work that may be distributed across different processes and different points in time.

These aren't simply useful runtime features anymore.

They've become architectural requirements.

## Closing

Over the last three episodes, the question has gradually changed.

I started by asking which agent runtime Articulate should use.

Then I had to understand what state that runtime actually owns.

And now I've discovered that one of its most important responsibilities isn't really memory at all.

It's preserving work across failure and across time.

Once tools have executed, once other capabilities become involved, once humans enter the process, and once execution can last longer than the process performing it, simply starting again isn't enough.

We need continuity.

We need to know what happened.

And we need to know what can safely happen next.

That gives me the final architectural requirement I needed for ADR 0001.

I can now go back to the candidate runtimes and evaluate them against the architecture Articulate actually needs.

And that's what I'll do in the next episode. see you on on the next one
