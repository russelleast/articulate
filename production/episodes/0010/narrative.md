# Episode 10 — ADR 0001: Defining the Runtime Requirements

## Opening

**Where should Architectural Intelligence actually execute?**

That's the question I've reached while building the conceptual architecture for the Knowledge API.

Hello, I'm Russell, and welcome to Episode 10 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

Over the last few episodes we've explored the Knowledge Model, looked at how AI can reason over architectural knowledge, and how we place to describe capability behaviour using DCL.

---

## The First Major Architectural Decision

Every architecture eventually reaches a point where ideas have to become software.

For Articulate, that point has now arrived.

Architectural Intelligence won't simply answer prompts.

It will retrieve knowledge.

Reason over architectural problems.

Invoke tools.

Collaborate with people.

Evolve the Knowledge Model.

Coordinate long-running work.

Something has to orchestrate all of that.

In other words, Articulate needs a runtime.

At first glance, this sounds like a straightforward technology decision.

Should I choose Dapr?

Temporal?

LangGraph?

Microsoft Agent Framework?

There are already several excellent technologies available.

So perhaps the obvious next step is simply to compare them.

---

## A Different Question

The more I thought about it, the more I realised I wasn't actually ready to compare any of them.

Because I still hadn't answered a much simpler question.

**What is the runtime actually responsible for?**

That question completely changed how I approached this decision.

Instead of looking at products, I started looking back at the architecture we'd already defined.

And something interesting happened.

The architecture had already begun answering the question.

---

## The Responsibilities Begin to Appear

Articulate isn't a traditional request-response application.

Architectural reasoning may take minutes.

Sometimes hours.

Sometimes even days.

A capability may need to retrieve knowledge from several sources before it can reach a conclusion.

It may invoke external tools.

It may collaborate with other specialised capabilities.

It may need clarification from a human architect before it can continue.

And when something goes wrong, it shouldn't simply lose everything and start again.

Without deliberately planning it, the previous episodes had already revealed a set of responsibilities that any runtime would need to support.

It should coordinate long-running work.

It should orchestrate specialised capabilities.

It should integrate external tools.

It should recover safely from failure.

It should provide visibility into what it's doing.

And it should remain flexible enough to evolve alongside an AI ecosystem that's changing almost monthly.

None of those describe a particular technology.

They describe the job the runtime needs to perform.

---

## An Unexpected Discovery

At this point I expected the decision to become clearer.

Instead, another question kept getting in the way.

Almost every AI framework talks about memory.

Conversation memory.

Working memory.

Long-term memory.

Execution memory.

Some treat memory as something the runtime owns.

Others expect it to live elsewhere.

The more I read, the more I realised everyone seemed to be using the same word to describe several completely different responsibilities.

And if I couldn't explain what memory meant within Articulate...

...then I couldn't possibly decide which runtime was the better fit.

Because I still didn't know which responsibilities belonged inside the runtime, and which belonged elsewhere in the architecture.

---

## Closing

So this episode doesn't end with a technology decision.

Instead, it marks the beginning of the investigation captured in ADR 0001.

We've identified the responsibilities that the runtime will eventually need to fulfil.

We've established that the runtime is a significant architectural component, not simply somewhere to execute prompts.

And we've uncovered the next question that needs answering before any technology can be selected.

**What does memory actually mean in an AI-native system?**

Because once we understand that...

...we'll be much closer to understanding what the runtime should own.

And only then will we be ready to evaluate the technologies themselves.

That's what we'll explore in the next episode.
