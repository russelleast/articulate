# Episode 3 – Why AI-Native Systems?

Before I go any further with Articulate, I think it's important to explain what I mean when I describe it as an AI-native system.

Because AI-native is one of those terms that is being used more and more, but it doesn't necessarily mean the same thing to everyone.

Terms like AI-native, agentic systems, AI agents, and even reasoning models are still evolving. Different organisations, vendors and researchers use them in slightly different ways, and I fully expect the language to continue changing as the technology matures.

So what I'm describing here isn't intended to be the definitive definition of AI-native architecture.

It's my current understanding with the research I've been doing, and what I'm learning through building Articulate.

And that distinction is important for this journal.

Part of the purpose of Articulate is to document how my thinking evolves.

Some of the ideas I describe today will almost certainly be refined later. Some might be challenged. Some may eventually be replaced completely.

I don't see that as a problem.

I see it as part of the process of learning how to architect systems around a technology that is itself still evolving.

So, with that context, what do I actually mean by an AI-native system?

Over the last few years, almost every software product seems to have become AI-powered.

And in many cases, what that really means is that an existing application has had an LLM added to it.

Perhaps there's now a chatbot.

Perhaps a feature generates some text.

Or perhaps the application sends a prompt to a model, receives a response, and displays the result.

There's nothing inherently wrong with that.

But architecturally, the application is still fundamentally the same system.

If you removed the AI capability, most of the architecture would remain intact.

That isn't the approach I'm taking with Articulate.

Articulate is being designed as an AI-native system.

For me, the distinction is relatively simple.

An AI-powered system uses AI.

An AI-native system is built around it.

In an AI-native system, intelligence participates in the runtime itself.

It isn't simply waiting for somebody to send it a prompt.

It might be helping to understand intent.

Building and maintaining context.

Retrieving relevant knowledge.

Reasoning about a problem.

Deciding what should happen next.

Invoking tools.

Coordinating work.

Evaluating the confidence it has in a result.

And, importantly, knowing when a human needs to be involved.

That changes the architecture of the system.

Traditional applications are often designed around things like CRUD operations, APIs, transactions and deterministic workflows.

We know the inputs.

We define the process.

And, generally, we expect a predictable output.

AI-native systems introduce a different set of architectural concerns.

Now we have to think about context.

Memory.

Knowledge.

Reasoning.

Orchestration.

Conversation.

And uncertainty.

That doesn't mean the traditional concerns disappear.

We still need APIs.

We still need databases.

We still need transactions, messaging, security, observability and all of the other things that make production systems work.

But intelligence becomes another fundamental part of the runtime.

And I think that's one of the most important architectural shifts taking place.

For decades, we've treated databases as infrastructure.

As systems became distributed, we added messaging, networking and distributed coordination.

Cloud computing introduced another generation of runtime capabilities.

AI-native systems introduce something else.

Intelligence itself starts to become infrastructure.

Instead of every part of the application making isolated calls to an LLM, the system begins to need shared capabilities for reasoning, memory, semantic retrieval, tool invocation, evaluation and orchestration.

And once those capabilities become part of the runtime, we have to architect them deliberately.

We have to think about how they're governed.

How they're observed.

How they fail.

How state is maintained.

How decisions are explained.

And how humans remain involved when the system cannot, or should not, act independently.

This is also where agentic systems enter the conversation.

The terms AI-native and agentic are sometimes used almost interchangeably, but I don't think they're the same thing.

I see AI-native as an architectural philosophy.

Agentic systems are one possible pattern for organising intelligence within that architecture.

An agent might have a goal.

It might plan how to achieve that goal.

It might retrieve information, use tools, delegate work, collaborate with other agents, reflect on its own results, and maintain some form of memory.

Those are useful capabilities.

But adding an agent to an existing application doesn't automatically make that application AI-native.

And an AI-native system doesn't necessarily need to consist of dozens of autonomous agents talking to each other.

That's something I want to be careful about as Articulate evolves.

The goal isn't to add agents everywhere simply because agents are interesting.

The architecture should use agentic behaviour where that behaviour genuinely helps solve the problem.

Agents are one architectural pattern available to an AI-native system.

They aren't the definition of one.

So why does Articulate need to be AI-native?

Because the problem I'm trying to explore isn't simply how to generate architecture documents using an LLM.

AI needs to participate throughout the architectural process.

Articulate needs to understand architectural intent.

It needs to conduct guided discovery.

It needs to ask useful questions and identify where important information is missing.

It needs to build contextual understanding over time.

It needs to retrieve and reason over architectural knowledge.

It needs to help produce capability models and other architectural artefacts.

It needs to evaluate confidence and uncertainty.

And ultimately, it needs to collaborate with a human architect throughout the process of understanding and designing systems.

If I removed AI from Articulate, I wouldn't simply lose a feature.

I would have to fundamentally redesign the system.

And for me, that's probably the clearest test of whether something is genuinely AI-native.

Another important consequence of this is the role of conversation.

One of the ideas I'm exploring throughout Articulate is that AI-native systems can become conversation-driven systems.

And I don't mean simply putting a chat window on top of an application.

Conversation can become part of the runtime itself.

It's how a human expresses intent.

It's how the system asks for missing information.

It's how context develops over time.

It's how knowledge is discovered.

It's how decisions can be explored.

And it's how workflows can be initiated, paused, redirected and continued.

In Articulate, architectural artefacts should emerge from that collaboration.

The conversation isn't separate from the work.

The conversation is part of how the work happens.

That leads to a set of principles that I expect to return to throughout this journal.

Intelligence should be treated as a runtime capability.

Conversation should be treated as a primary interface.

Context becomes a form of state.

Memory needs to extend beyond a single request.

Knowledge should be retrieved and evolved rather than simply embedded into prompts.

Humans remain an essential part of the system.

Uncertainty has to be represented rather than hidden.

And evaluation is just as important as execution.

These aren't implementation decisions yet.

They're architectural principles.

And that distinction matters.

I haven't decided that Articulate needs a particular agent framework, workflow engine, vector database or model provider.

Those decisions should come later.

First, I want to understand the problem.

Then establish the principles.

Then identify the capabilities the system actually needs.

And only then start making decisions about architecture, runtime and technology.

That is really what this episode establishes.

If intelligence becomes a first-class part of a system, then we need to think differently about the runtime that supports it.

What does context actually mean?

What forms of memory does an AI-native system need?

How should architectural knowledge be represented?

How should AI retrieve and reason over that knowledge?

Where should we use agents?

How do we coordinate long-running work?

How do humans participate in the runtime?

How do we observe decisions that may be probabilistic rather than deterministic?

And how do we build systems that can evolve as both our understanding and the underlying technology change?

Those are the questions that the rest of this journal will explore.

So this episode isn't intended to provide a final definition of AI-native architecture.

It's a starting point.

A statement of the architectural mindset behind Articulate.

And, like the system itself, I expect that mindset to evolve as I continue to learn.
