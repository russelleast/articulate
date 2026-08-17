# Episode 13 – Selecting the Agent Runtime

> **Question:** *Which AI runtime actually fits Articulate?*

## Opening

Which runtime should execute Articulate's agents?

That's the question I've been trying to answer for the last few episodes.

Hello, I'm Russell, and welcome to Episode 13 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

Back in Episode 10, I opened ADR 0001 to select an agent runtime.

At that point, I already had a shortlist.

Dapr Agents.

Temporal.

LangGraph.

Microsoft Agent Framework.

It would have been very easy to put those into a comparison table, count the features, pick a winner and move on.

But I didn't actually understand the problem well enough to make that decision.

So instead, I left the ADR open.

The last two episodes have been about figuring out what the runtime actually needs to do.

Now I think I have enough information to make the decision.

---

## The Question Has Changed

The interesting thing is that I'm no longer answering quite the same question I started with.

Initially, I was asking:

**Which agent runtime should Articulate use?**

But exploring memory changed that.

Most of what gets described as agent memory doesn't actually belong to the runtime.

Architectural knowledge belongs to the Knowledge Model.

Conversation history belongs to the conversation capability.

Embeddings, indexes and caches support retrieval.

External systems remain responsible for their own data.

The runtime doesn't need to own all of that.

Then durable execution changed the question again.

Because there is one thing the runtime really does need to own.

**The continuity of execution.**

If work has already happened, if a tool has already executed, if an agent is waiting for approval, or if a process disappears halfway through some long-running reasoning, the platform needs to know where that work reached.

So the question became much narrower.

But at the same time, much clearer.

I'm not looking for somewhere to store agent memory.

I'm looking for a runtime that can reliably coordinate AI-native work across time.

---

## What Am I Actually Selecting?

That gives me a much better set of criteria.

Articulate needs durable execution.

Long-running workflows.

Pause and resume.

Human interaction.

Failure recovery.

Distributed execution.

Tool orchestration.

Observability.

And importantly, I don't want this decision to force decisions that I haven't made yet.

I haven't selected a cloud provider.

I haven't selected the eventual production hosting model.

I don't even know whether the architecture I have today will still be the architecture I need several seasons from now.

So I want a runtime that gives Articulate useful capabilities now without unnecessarily constraining where the platform can evolve.

And with those criteria established, I can finally look at the candidates.

---

## There Isn't an Obvious Winner

This is where I expected the decision to become easier.

It didn't.

Because once I started evaluating the candidates against the requirements from the previous episodes, several of them could satisfy what Articulate needs.

And some of the strongest options aren't actually single technologies.

For example, Microsoft Agent Framework combined with Temporal is extremely compelling.

Microsoft Agent Framework gives me the agent programming model.

Temporal gives me mature durable execution.

Together, they tick practically every box I've identified.

And personally, there's another attraction.

Microsoft Agent Framework supports C#.

I've spent a large part of my career working with C# and .NET, so this would put Articulate in a technology ecosystem I know extremely well.

That's not something I should pretend doesn't influence the decision.

Familiarity has value.

It reduces implementation risk.

It makes it easier for me to understand what's happening beneath the abstractions.

And it would allow me to concentrate more of my effort on the architectural experiments rather than learning another language ecosystem at the same time.

So Microsoft Agent Framework and Temporal is a very credible option.

---

## Microsoft Agent Framework and Durable Task

There's also another Microsoft-oriented option.

Microsoft Agent Framework can use Durable Task for durable execution.

That potentially gives me a more integrated stack.

An agent programming model.

Durable execution.

C#.

A familiar development environment.

And fewer independent runtime technologies to assemble.

That's attractive.

But it also raises an architectural question.

How much of the architecture do I want the agent framework itself to own?

The investigation into memory and durable execution has pushed me towards separating responsibilities.

Agents perform reasoning.

Durable execution preserves the continuity of work.

The surrounding platform owns knowledge, messaging, state and infrastructure concerns.

I don't necessarily want all of those things collapsing into a single AI framework simply because it's convenient.

Integration has value.

But separation of responsibility has value too.

And that's a trade-off rather than an obvious answer.

---

## LangGraph and Temporal

LangGraph creates another interesting combination.

I like its model for representing reasoning.

And if I combine LangGraph with Temporal, I can separate reasoning orchestration from durable execution.

LangGraph can concentrate on how an intelligent process reasons.

Temporal can concentrate on making sure that process survives failure and time.

That's architecturally quite clean.

In some ways, it's one of the strongest combinations in the shortlist.

But now Articulate has two significant runtime abstractions.

I need to understand where LangGraph ends and Temporal begins.

Which system owns orchestration?

Which one owns retries?

Which one owns execution state?

Which one determines the lifecycle of an agent?

There are good answers to those questions.

But every answer introduces another architectural boundary that I have to own.

And that leads to another consideration.

---

## Composition Has a Cost

At this point, the comparison isn't really:

Dapr versus Temporal versus LangGraph versus Microsoft Agent Framework.

It's closer to:

**Microsoft Agent Framework plus Durable Task.**

**Microsoft Agent Framework plus Temporal.**

**LangGraph plus Temporal.**

**Dapr Agents**

And potentially other combinations.

All of them can be made to work.

That's important.

I'm not choosing Dapr because the alternatives fail the requirements.

I'm choosing between several architectures that satisfy them.

So the question becomes one of architectural composition.

How many runtime concepts do I want Articulate to depend upon?

Where do I want the boundaries between agents, workflows and distributed application infrastructure?

And which combination gives me enough capability without assembling more platform than I currently need?

---

## Python Is a Separate Decision

There's also a technology decision sitting underneath this that I need to make explicit.

Dapr Agents is currently Python-based.

Coming from a C# background, that initially makes Microsoft Agent Framework particularly attractive.

But I don't think choosing Python for the AI and reasoning parts of Articulate is actually a compromise.

Python has become the dominant language across machine learning and much of the wider AI ecosystem.

Models, evaluation libraries, data science tooling, agent frameworks and research implementations frequently appear in Python first.

And Articulate is deliberately an AI-native architecture experiment.

There's value in working closer to that ecosystem rather than insulating myself from it simply because C# is more familiar.

That doesn't mean Articulate suddenly becomes a Python platform.

The architecture shouldn't require every capability to be written in the same language.

If another capability is better implemented using C#, Go, or something else in the future, the architecture should allow that.

But for the parts of Articulate closest to AI, machine learning and reasoning, I think Python is the stronger strategic fit.

So Dapr Agents being Python-only isn't the reason for choosing Python.

The two decisions simply reinforce each other.

---

## Why Dapr Still Wins

And after all of that, I still come back to Dapr.

Not because Dapr Agents is obviously better than Microsoft Agent Framework.

Not because Dapr Workflows is more capable than Temporal.

And not because Dapr has the strongest reasoning abstraction.

I don't think I could defend any of those claims.

What attracts me to Dapr is the shape of the platform around the agents.

Articulate needs agents and durable workflows.

But it's also going to need messaging.

State.

Service invocation.

Secrets.

Observability.

Ordinary application services.

And integration between all of those things.

Those aren't hypothetical requirements anymore.

They're already appearing in the architecture.

Dapr gives me a common distributed application runtime across those concerns.

And its sidecar model gives the application a degree of independence from the infrastructure providing them.

That's particularly valuable because I'm deliberately not deciding yet whether Articulate ultimately runs on Kubernetes, ECS, Azure, AWS, or somewhere else.

I'm choosing an execution architecture without unnecessarily choosing the eventual infrastructure architecture at the same time.

And that gives me something I value quite highly at this stage of Articulate.

**Optionality.**

---

## The Trade-off

But that flexibility isn't free.

Choosing Dapr means accepting a broader runtime.

There's another process running alongside the application.

There are additional operational concepts.

I need to understand Dapr itself rather than only understanding an agent framework.

And Dapr Agents is still relatively young.

That's a genuine risk.

There's also a danger in adopting a platform because it provides lots of capabilities that I *might* need.

That's exactly the kind of reasoning I've tried to avoid throughout this journal.

So the decision can't be:

**Dapr has more building blocks, therefore Dapr wins.**

The question has to remain:

**Do those building blocks correspond to responsibilities already emerging in the architecture?**

For Articulate, I think they do.

Pub/sub.

State.

Service invocation.

Observability.

Durable workflows.

Distributed execution.

These aren't speculative requirements anymore.

They're already appearing in the architecture.

---

## Result — ADR 0001

So I'm accepting ADR 0001.

Articulate will use **Dapr Agents** as its initial agent runtime, with **Dapr Workflows** providing durable execution and orchestration.

And I think the word *initial* matters.

I'm not saying:

**Dapr is the best agent runtime.**

I don't think I've demonstrated that.

What I'm saying is:

**Dapr is currently the best architectural fit for Articulate.**

That's a much narrower claim.

Microsoft Agent Framework with Temporal remains compelling.

Microsoft Agent Framework with Durable Task deserves further experimentation.

LangGraph with Temporal is particularly interesting if reasoning orchestration becomes significantly more sophisticated.

And Temporal remains the benchmark I would come back to if durable execution becomes a more demanding concern than Dapr Workflows can comfortably support.

ADR 0001 isn't declaring those alternatives wrong.

It's recording why I'm not choosing them **now**.

And that's what I think an ADR should do.

---

## Closing

The most useful part of this investigation wasn't actually selecting Dapr.

It was discovering what I was selecting it **for**.

I started ADR 0001 looking for an agent runtime.

Memory forced me to separate the responsibilities around that runtime.

Durable execution showed me which state really mattered to it.

And comparing the candidates showed me that an agent runtime can't be evaluated in isolation from the platform around it.

There's another lesson here as well.

Meeting the requirements doesn't necessarily determine the architecture.

Several of these approaches meet the requirements.

The architectural decision emerges from the trade-offs between them.

Their boundaries.

Their responsibilities.

Their complexity.

And the options they preserve for the future.

So ADR 0001 is now accepted.

Articulate has a runtime in which Architectural Intelligence can eventually execute.

But that creates another problem.

Those agents are going to reason about architectural knowledge.

They're going to discover new information.

They're going to identify contradictions.

They're going to make new claims about the architecture.

And some of those claims may eventually need to change what Articulate understands to be true.

But an agent shouldn't simply be able to rewrite the Knowledge Model because it has reached a new conclusion.

Architectural knowledge needs to evolve without losing where it came from, what it replaced, or why we came to believe it.

So before I start implementing agents, there's one more part of the conceptual architecture I need to understand.

**How does architectural knowledge safely change over time?**

That's the question I'll explore in the next episode: **Knowledge Evolution**.