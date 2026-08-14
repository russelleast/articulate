# Episode 11 – Memory in AI-Native Systems

> **Question:** *What does AI memory actually mean?*

## Opening

That's the question for this episode.

Hello, I'm Russell, and welcome to Episode 11 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles. The previous episode the question was about AI runtimes and what do need to understand in order to choose one. which led to the question for this episode.

Every AI framework seems to talk about memory.

- Working memory.
- Conversation memory.
- Long-term memory.
- Execution memory.
- Knowledge memory.

At first glance, it sounds as though memory has become one of the most important concepts in AI-native systems.

But you start researching, you instinctively pause and ask myself: 

> **"Hold on… isn't this just… you got it, something we already know by another name?"**

That is not be being cynical.

That's industry we are in.

We naturally try to decompose ideas until they understand the responsibilities underneath them.

So that's exactly what I want to do in this episode.

Because I think the word *memory* is hiding something much more interesting.

---

# We Want To Understand Memory

If you're building an AI-native platform, understanding memory matters.

Questions immediately start appearing.

Where should conversations be stored?

In my case for articulate, Where does architectural knowledge live?

Should embeddings be persisted?

What happens if the runtime crashes?

Can execution continue tomorrow?

These aren't academic questions.

They shape the architecture.

So let's ask a different question.

Instead of asking:

> **"What memory does an AI system need?"**

Let's ask:

> **"What state does an AI-native platform actually need?"**

---

# Everything Seems To Be Memory

This is where things become confusing.

Different frameworks use the word *memory* to describe completely different things.

Sometimes memory means:

- conversation history
- vector databases
- retrieved documents
- execution checkpoints
- prompts
- context
- knowledge graphs
- caches

They're all classed as memory.

But are they actually the same thing?

I don't think they are.

And that's where the architecture starts to become clearer.

---

# Breaking Memory Apart

Let's separate these responsibilities.

Conversation history remembers what we've talked about.

Architectural knowledge represents what the system knows.

Embeddings and vector indexes exist to retrieve information efficiently.

Caches improve performance.

Execution state remembers work already performed.

Configuration describes how the system behaves.

They're all storing information.

But they have completely different purposes.

Different owners.

Different lifetimes.

Different rules.

Calling all of them "memory" hides those differences.

---
# What About Context?

There is one other thing that is frequently described as memory.

Context.

And I think this one is slightly different.

When an agent is reasoning, it needs a working set of information.

That might include parts of the conversation.

Knowledge retrieved from the Knowledge Model.

Results from previous tool calls.

Instructions.

The current task.

Maybe even information produced by another agent.

Together, these things form the context available to the model at that moment.

But I don't think context is another source of truth.

It's assembled.

It's a temporary view of the information needed for a particular piece of reasoning.

And importantly, much of it can be reconstructed.

If I lose the context, I can retrieve the knowledge again.

I can reload the conversation.

I can rebuild the instructions.

I can call a tool again where that's safe.

So context matters enormously to the quality of reasoning.

But architecturally, I don't think we need another database called "memory" just to own it.

What we need is a way of engineering the right context from the state that already has an appropriate home.

That gives me another useful distinction.

Knowledge is what the platform knows.

Conversation is what we've discussed.

Context is what the model needs right now.

---

# Ownership Changes Everything

Once I stopped thinking about memory as one thing, another pattern appeared.

Every piece of state naturally belongs somewhere.

The Knowledge Model owns architectural knowledge.

A conversation service owns conversations.

The retrieval layer owns embeddings, vector indexes and graph projections.

Caches belong wherever performance needs improving.

Capability definitions and prompts belong with configuration.

And the runtime...

Owns surprisingly little.

Instead, it coordinates all of these platform capabilities.

That completely changed how I started thinking about the runtime architecture.

---

# Retrieval Is Not Knowledge

One distinction became especially important.

Modern AI systems often contain:

- vector stores
- embeddings
- search indexes
- graph projections

These are incredibly useful.

But architecturally...

they're not knowledge.

They're derived structures.

If an embedding disappears...

you regenerate it.

If a search index becomes corrupted...

you rebuild it.

They're much closer to database indexes or materialised views than they are to the authoritative understanding of the architecture.

That distinction matters.

Because if we confuse retrieval with knowledge, we risk optimising the wrong thing.

---

# What About Caches?

Caching introduces another useful lesson.

Caches are often described as another form of memory.

Technically that's true.

Architecturally it's misleading.

A cache exists because we're willing to lose it.

If Redis disappears, we don't panic.

We rebuild the cache.

The same is true for many AI-native optimisations.

Prompt caches.

Embedding caches.

Retrieved context caches.

They're valuable because they improve performance.

They're not valuable because they contain the truth.

And if stale caches aren't managed carefully, they can become dangerous.

An AI system may confidently reason over outdated information simply because the cache hasn't been refreshed.

So caching remains just what it's always been.

A performance optimisation.

Not a source of truth.

---

# Different State, Different Storage

Something else became obvious during this investigation.

We've understood this principle for decades.

We don't store every kind of data in one database.

We choose storage based on the responsibility of the data.

Knowledge may suit one model.
Conversation has an another.
Vectors, Execution, Caches have different responsibilities

AI-native systems aren't using multiple storage technologies because AI is special.

They're doing it because different kinds of state have fundamentally different responsibilities.

Architecture hasn't changed.

The kinds of state have.

---

# The Runtime Owns Very Little

By this point I realised something I wasn't expecting.

The runtime isn't the brain of the platform.

It's the coordinator.

It doesn't own the architecture.

It doesn't own conversations.

It doesn't own retrieval.

And it doesn't need to permanently own the context either.

Context can be assembled from the platform when reasoning needs to happen.

The runtime coordinates all of these capabilities.

But that leaves one kind of state that is different.

Execution.

Because there is a difference between reconstructing what an agent needs to know...

and reconstructing what has already happened.

If an agent retrieves some knowledge twice, that's probably fine.

If it sends the same notification twice...

updates the same external system twice...

or performs the same action twice...

that's a very different problem.

And that is where memory stops being the interesting question.

The interesting question becomes:

> **How do we preserve the progress of work?**

---

# Looking Ahead

We started this episode asking:

> **What does AI memory actually mean?**

And I think the answer is...

it depends what you're remembering.

Knowledge has its own responsibility.

Conversation has its own responsibility.

Retrieval structures and caches can be rebuilt.

Context is assembled for the reasoning taking place right now.

Once those responsibilities are separated, the runtime actually owns surprisingly little.

But there is one thing it cannot simply reconstruct.

The progress of work.

Imagine an agent has already called a tool.

Updated some state.

Asked a human for approval.

And then stopped.

When it starts again tomorrow, knowing the conversation isn't enough.

Knowing the architecture isn't enough.

Even rebuilding exactly the same context isn't enough.

It needs to know what has already happened...

and what should happen next.

That's a different problem.

It's not really about memory anymore.

It's about preserving execution across time.

And that's the question for the next episode:

> **How does an AI-native runtime preserve execution across time?**

That's where we get into durable execution which is the topic for episode 12.

