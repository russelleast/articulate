## Introduction

Hello, and welcome back to the Articulate Journal.

Articulate is a public engineering journal documenting the design and implementation of an AI-native architecture platform. Every episode explores another architectural question, and together they explain how the system evolves.

In the previous video episode, I talked about the characteristics that every production system needs, whether it's AI-native or not.

Qualities like reliability, scalability, security and observability don't disappear just because we introduce AI. They become even more important.

In this episode, I'd like to turn our attention to conceptual data model that will hold architectural knowledge .

Before I can build AI that helps architects understand architecture, I first need to answer a this question.


**What is architectural knowledge?**

At first, I thought the answer would be obvious.

Architecture is made up of diagrams, documents, Architecture Decision Records, source code, infrastructure definitions... all the things we create throughout the lifetime of a system.

But the more I thought about it, the more I realised those things aren't actually the knowledge.

That is just information.

Useful, certainly, but information nonetheless.

Imagine joining a new organisation as an architect.

On your first day you're given access to the architecture repository.

There are dozens of diagrams.

Hundreds of pages of documentation.

A collection of ADRs.

Wikis.

Slide decks.

Maybe even recordings from previous design reviews.

You now have a huge amount of information.

But do you understand the architecture?

Probably not.

Understanding doesn't come from reading one document.

It comes from gradually connecting all of those pieces together.

You begin to see how the systems relate to one another.

Why particular decisions were made.

Which principles shaped the architecture.

Where the risks are.

Which assumptions are still valid.

And which parts of the architecture have evolved over time.

That's when information starts to become knowledge.

That distinction became one of the most important ideas in the design of Articulate.

Because if I simply build a platform that stores documents, then I've really just created another document repository.

What I want to model is the understanding that emerges from those documents.

Not just what the architecture says.

But what the architecture means.

That became the foundation for everything that follows in this episode.

## Information Within an Architecture

Once I'd started thinking about architectural knowledge, another question naturally followed.

**What information actually exists within an architecture?**

At first glance, it seems obvious.

We have systems.

Applications.

Services.

Databases.

APIs.

Infrastructure.

Those are certainly part of the architecture.

But they're only part of the picture.

Architecture also includes the principles that guide decisions.

The characteristics the system needs to exhibit.

The decisions that have been made over time.

The relationships between different parts of the estate.

The assumptions people are working with.

The constraints they have to operate within.

And the evidence that supports those decisions.

Taken together, that's a huge amount of information.

Some of it is highly structured.

Some of it is buried inside documents.

Some of it only exists because somebody remembers why a decision was made three years ago.

The challenge isn't finding places to store that information.

The challenge is bringing it together in a way that allows us to reason about it.

That brought me to another important distinction.

The difference between information and knowledge.

---

## Information Versus Knowledge

Suppose Articulate knows that a payment service uses PostgreSQL.

On its own, that's simply a piece of information.

Now suppose it also knows that the service processes financial transactions.

That high availability is a characteristic.

That an Architecture Decision Record explains why PostgreSQL was selected.

That another proposal to move to a different database was rejected.

And that recent operational issues suggest the original assumptions may no longer hold.

Individually, each of those is just another piece of information.

But once they're connected together, something interesting happens.

The platform doesn't just know isolated facts.

It begins to understand the context surrounding them.

That's much closer to what I think of as knowledge.

After thinking about this for quite a while, I eventually arrived at a very simple definition.

**Knowledge is information combined with thinking.**

It sounds almost too simple.

But that single idea changed how I thought about the entire platform.

The goal isn't to collect as much information as possible.

The goal is to build a model that captures understanding.

Because that's what architects actually work with every day.

## Claims

Once I'd reached the conclusion that knowledge is information combined with thinking, another question emerged.

**How should that knowledge actually be represented?**

The more I explored the problem, the more I realised that almost everything we know about an architecture can be expressed as a claim.

A claim is simply an assertion about the architecture.

For example...

Order service uses PostgreSQL.

Checkout capability requires high availability.

Product API is consumed by three downstream systems.

architectural decision 16 was made to improve resilience.

Each of those statements tells us something about the architecture.

But on their own, they're just isolated assertions.

What makes them useful is the context that surrounds them.

Where did this claim come from?

Was it discovered from source code?

Taken from an Architecture Decision Record?

Suggested during a conversation with an architect?

Or generated by an AI during discovery?

How confident are we that it's correct?

What evidence supports it?

Has it always been true, or has the architecture evolved over time?

Those questions become just as important as the claim itself.

Rather than storing disconnected facts, the Knowledge Model stores claims together with the information needed to understand and evaluate them.

That allows the model to grow over time.

New evidence can strengthen an existing claim.

Conflicting evidence can challenge it.

And as the architecture evolves, the understanding can evolve with it.

I think that's a much better reflection of how architects work in the real world.

We rarely have perfect knowledge.

Instead, we gradually build confidence as more information becomes available.

The Knowledge Model isn't trying to eliminate uncertainty.

It's trying to make uncertainty explicit.

And I think that's a much more honest representation of architecture.

## From Information to Knowledge

By this point, I had the beginnings of a model.

I had architectural information.

I had relationships between that information.

And I had claims that represented what the system currently understood about the architecture.

But something still didn't feel quite right.

A collection of connected claims is certainly more useful than a collection of disconnected documents.

But it still isn't knowledge.

Knowledge comes from interpreting those claims.

It comes from understanding how they relate to one another.

How they support or contradict each other.

How confident we are in them.

And what they actually mean in the context of the wider architecture.

For example, imagine Articulate discovers that a service has suffered several operational incidents.

On its own, that's just another claim.

But if it also understands that the service supports a business-critical capability...

That reliability is one of the architectural principles...

That an earlier ADR accepted a trade-off in favour of performance...

And that the current maturity of that area is relatively low...

Then the platform can begin to reason about the significance of those observations.

It isn't simply retrieving information.

It's building understanding.

That, to me, is the difference between an information model and a knowledge model.

The purpose of the Knowledge Model isn't to replace architectural judgement.

It's to provide enough connected understanding that both humans and AI can reason about the architecture more effectively.

That's the point where architecture starts to become more than a collection of documents.

It becomes a body of knowledge that can grow, evolve and support better architectural decisions over time.

## The Knowledge Model

By this point, I felt I had enough understanding to describe what the Knowledge Model actually is.

It's important to remember that I'm still not thinking about databases or implementation.

There's one piece of terminology I'd like to explain.

Throughout this episode I've deliberately referred to it as a Knowledge Model, not a Knowledge Graph.

That choice is intentional.

It may well turn out that a graph is the best way to implement it.

But at this stage, I don't want to introduce implementation bias into the architectural thinking.

Right now, I'm trying to understand the concepts that need to be represented.

The structure of the knowledge.

The relationships.

The behaviour.

Only once I understand the conceptual model do I want to start asking how it should be implemented.

That implementation might involve a graph database.

It might involve several different technologies working together.

I simply don't know yet.

And that's perfectly fine.

I'm thinking about the conceptual model.

The Knowledge Model is the way Articulate represents architectural understanding.

It brings together the architectural concepts we've explored throughout this episode.

Structure.

Characteristics.

Principles.

Decisions.

And the claims that connect them.

Each claim captures something the platform currently understands about the architecture.

Together, those claims form a connected body of knowledge rather than a collection of disconnected facts.

What I particularly like about this approach is that the model can evolve.

As new information is discovered...

As decisions are made...

As systems change...

And as more evidence becomes available...

The model evolves alongside the architecture itself.

Nothing needs to be treated as permanently fixed.

The understanding simply becomes richer over time.

That also means the Knowledge Model becomes much more than somewhere to store architectural information.

It becomes the foundation that every other capability in Articulate builds upon.

Discovery adds to it.

Conversations retrieve knowledge from it.

Impact analysis reasons over it.

Architecture decisions become part of it.

Future AI agents use it as context for their own reasoning.

Instead of every capability maintaining its own understanding of the architecture, they all work from the same shared model.

For me, that's one of the most important architectural ideas in Articulate.

The Knowledge Model becomes the system's shared understanding of the architecture.

Everything else is simply another way of contributing to that understanding, reasoning over it, or presenting it to the user.

## The Knowledge API

Once I had the Knowledge Model, another question naturally followed.

**How does the rest of the platform interact with it?**

My answer was to introduce a Knowledge API.

The purpose of the API isn't simply to read and write data.

Its purpose is to provide a consistent way for every part of the platform to work with architectural knowledge.

Discovery can add new claims.

Conversations can retrieve architectural context.

Reasoning services can explore relationships.

Impact analysis can understand dependencies.

Future agents can query the model without needing to know how it's stored internally.

That separation is important.

The rest of the platform shouldn't care whether the Knowledge Model is backed by a graph database, a document database, a relational database, or something else entirely.

Those are implementation details.

The capabilities of the platform interact with the Knowledge API.

The Knowledge API interacts with the Knowledge Model.

That gives me the freedom to evolve the implementation without changing the architecture built on top of it.

More importantly, it establishes the Knowledge Model as a first-class architectural capability.

It isn't just another database hidden behind a service.

It's the shared understanding of the architecture, exposed through a well-defined interface that every other capability can build upon.

As the platform evolves, I expect the API to evolve as well.

New ways of querying knowledge will emerge.

New reasoning capabilities will be introduced.

The model itself will become richer.

But the architectural idea remains the same.

There is one Knowledge Model.

And there is one consistent way for the rest of the platform to understand and contribute to it.

## Architectural Intelligence

Stepping back from the details of the Knowledge Model, I realised something interesting.

What I'm really trying to build isn't another architecture repository.

It isn't another modelling tool.

And it certainly isn't another AI chatbot that happens to know something about software architecture.

What I'm exploring is something I think of as **Architectural Intelligence**.

The ability for a system to understand architecture in much the same way an architect gradually builds understanding over time.

Not by memorising documents.

Not by indexing diagrams.

But by connecting information, evaluating evidence, understanding relationships and reasoning about change.

That's why the Knowledge Model is so important.

Without it, AI is simply generating responses from whatever information happens to be available.

With it, the platform has a shared understanding that it can reason over.

That doesn't mean the AI replaces the architect.

Far from it.

The architect still makes the decisions.

The architect still applies judgement.

The architect is still accountable for the outcome.

The role of the AI is to help build understanding.

To connect ideas that might otherwise remain disconnected.

To surface relationships.

To identify contradictions.

To explain the consequences of change.

And to help architects navigate increasingly complex systems.

Whether that vision is achievable is something this journal will continue to explore.

But I do believe it starts with the Knowledge Model.

Because before an AI can help us reason about architecture, it first needs a meaningful representation of what architecture actually is.

## Closing Thoughts

This episode has been less about technology and more about understanding the problem I'm trying to solve.

Before I can build an AI-native architecture platform, I first need a way of representing architectural knowledge.

That journey led from architectural information...

To connected claims...

To a Knowledge Model...

And ultimately to the idea of Architectural Intelligence.

Now that I have a conceptual model for architectural knowledge, another question naturally follows.

**How does AI actually reason over it?**

Some questions might be answered through semantic search.

Others might require traversing relationships.

Some might need structured queries.

And some may require several different approaches working together.

In the next episode, we'll begin exploring how AI retrieves, reasons over and makes use of the Knowledge Model.

Because building the model is only half of the challenge.

The real value comes from helping both humans and AI use that knowledge to make better architectural decisions.

I'll see you in the next episode.

