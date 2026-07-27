# Episode 3 – Why AI-Native Systems?

## Introduction

Welcome back to the Articulate Journal.

In the previous episode, I introduced Articulate: a product intended to help architects discover, understand, design and evolve complex systems through collaboration with AI.

I also introduced the journal surrounding it.

The journal makes the architectural thinking visible: the problems being explored, the principles guiding the design, the decisions being made, and the implementation that emerges from them.

But Articulate itself is not intended to be a temporary proof of concept.

The aim is to build a real product.

The architecture will evolve, and some decisions will change, but the software is being built with long-term use, maintainability and evolution in mind.

That creates an important question.

Why should a product like Articulate be designed as an AI-native system rather than as a conventional application with AI features added to it?

Before exploring the architecture in more detail, I want to explain what I currently mean by AI-native, how it differs from AI-powered, and why that distinction shapes the system I am building.

Because AI-native is one of those terms that is being used more and more, but it doesn't necessarily mean the same thing to everyone.

Terms like AI-native, agentic systems, AI agents, multi-agent system, and even reasoning models are still evolving. Different organisations, vendors and researchers use them in slightly different ways, and I fully expect the language to continue changing as the technology matures.

So what I'm describing here isn't intended to be the definitive definition of AI-native architecture.

It's my current understanding with the research I've been doing.

And that distinction is important for this journal.

Some of the ideas I describe today will almost certainly be refined later. Some might be challenged. Some may eventually be replaced completely.

I don't see that as a problem.

I see it as part of the process of learning how to architect systems around a technology that is itself still evolving.

So, with that context, what do I actually mean by an AI-native system?

Over the last few years, lots of software products seems to have become AI-powered.

And in many cases, what that really means is that an existing application has had an LLM added to it.

Perhaps there's now a chatbot.

Perhaps a feature generates some text.

Or perhaps the application sends a prompt to a model, receives a response, and displays the result.

There's nothing inherently wrong with that.

But architecturally, the application is still fundamentally the same system.

If you removed the AI capability, most of the architecture would remain intact.

That isn't the approach I'm taking with Articulate.

Articulate is being designed as an AI-native system (AI first).

The distinction is relatively simple.

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

We still need APIs and databases.

We still need transactions, messaging, security, observability and all of the other things that make production systems work.

But intelligence becomes another fundamental part of the runtime.

And I think that's one of the most important architectural shifts taking place.

As systems became distributed, we added messaging, networking and distributed coordination.

Cloud computing introduced another generation of runtime capabilities.

AI-native systems introduce something else.

Intelligence itself starts to become infrastructure.

Instead of every part of the application making isolated calls to an LLM, the system begins to need shared capabilities for reasoning, memory, semantic retrieval, tool invocation, evaluation and orchestration.

And once those capabilities become part of the runtime, we have to architect them deliberately.

We have to think about how they're governed.

How they're observed, how they fail.

How state is maintained and how decisions are explained.

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

One of the ideas throughout Articulate is that AI-native systems can become conversation-driven systems.

And I don't mean simply putting a chat window on top of an application.

Conversation can become part of the runtime itself.

It's how a human expresses intent, how thesystem asks for missing information.

It's how context develops over time and how knowledge is discovered.

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

How do we observe decisions that may and may not be deterministic?

And how do we build systems that can evolve as both our understanding and the underlying technology change?

Those are the questions that the rest of this journal will explore.


## Looking Ahead

So in this episode, I've established what I currently mean when I describe Articulate as an AI-native system.

It isn't simply an existing application with an LLM attached to it.

Intelligence participates in the runtime itself.

It helps the system understand intent, build context, retrieve knowledge, reason about problems, coordinate work and collaborate with humans.

I've also distinguished AI-native architecture from agentic architecture.

Agents may become important building blocks within Articulate, but adding agents is not the objective. They are one possible way of organising intelligent behaviour where the problem genuinely requires it.

And perhaps the clearest test is this:

If AI were removed from Articulate, the system would not merely lose a feature. Its architecture would have to change fundamentally.

But recognising that Articulate is AI-native doesn't tell me how to design it.

It introduces a much larger architectural question.

How should I approach the design of a system where intelligence, conversation, context, knowledge and uncertainty are all part of the runtime?

That is the question I will begin exploring in the next episode.