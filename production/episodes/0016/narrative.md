# Episode 16 – Building the First Architectural Slice

> **Question:** *Does this architecture actually work when we build it?*

## Opening

That's the question for this episode.

Hello, I'm Russell, and welcome to Episode 16 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

In the previous episode, I explored Architectural Assurance and how Articulate could continuously evaluate architectural knowledge rather than simply store it.

But for the first fifteen episodes, most of Articulate has existed as architecture.

We've explored the Knowledge Model, knowledge reasoning, DCL, agent runtimes, durable execution, knowledge evolution and architectural assurance.

We've made architectural decisions.

We've drawn diagrams.

We've defined capabilities.

Now it's time to find out whether any of it actually works when we build it.

In this episode, Articulate is finally going to become running software.

I'm going to walk through the first architectural slice, built around two capabilities:

- Capture Proposed Knowledge
- Review Proposed Claim

And rather than just talking about the implementation, I'm going to show it running.

---

## [vscode]

### Capture Proposed Knowledge

I'm going to start with the Capture Proposed Knowledge capability.

which is described using DCL, the Declarative Capability Language that I introduced earlier in the journal.

I have the DCL VS Code extension installed, which gives me syntax highlighting, compiler diagnostics and language-server support for navigating the DCL model.

It also has a graph workspace containing different visuals.

There isn't much to see in those graphs yet, but as more capabilities are added to Articulate, they're going to become increasingly useful.

I'm not going to go through every part of DCL, but there are a few things worth looking at in this capability.

At the top we have the `context`.

A context maps to a bounded context in Domain-Driven Design. It groups related capabilities and the other elements they depend upon.

We also have actors.

Actors can currently be humans, systems or agents, and here they represent the different actors that can supply a proposed claim.

The data itself is defined separately in another DCL file containing the shapes.

A shape is a data type. It can be something simple like an enum or a record-like structure containing fields made up of built-in types or other shapes.

Here we have the Claim shape that describes the information crossing this capability boundary.

Shapes give DCL a level of domain modelling, but that's deliberately not its primary responsibility.

DCL is about behavioural intent.

Looking at the capability itself, we can see the intents describing who can provide a claim.

Every capability has outcomes, and here we have two: Captured and Rejected.

The effects describe the external effects the capability is allowed to produce.

In this case, the claim is persisted and then a notification is sent.

The observe block describes what is important to observe about the capability when it executes.

And the `when` block connects the results of rules, policies and effects to the outcomes of the capability.

The behaviour here is deliberately simple.

A claim arrives.

It's persisted as proposed knowledge.

A notification is produced.

If that succeeds, the outcome is Captured.

Otherwise, it's Rejected.

That's really all I need DCL to say.

DCL describes the behavioural intent without describing the technology used to implement it.

Because DCL is also a compiled language, the compiler can verify that the elements referenced by the capability exist and that its behavioural definition is structurally valid.

The next step is turning that intent into software.

### AI-assisted development

I'm using Codex as my coding agent.

At the root of the repository I have an `AGENTS.md` containing architectural guidance.

There is another `AGENTS.md` within the source code containing engineering guidance and constraints for the implementation.

I've also created skills that establish a Plan, Implement and Verify development process.

And importantly, I've connected the DCL MCP server.

That means Codex doesn't have to treat this capability as another piece of text I've placed into its context.

It can interrogate the compiled DCL model and understand the semantic intent behind the capability.

That's one of the ideas behind DCL.

Whether giving an AI coding agent explicit architectural and behavioural intent creates a better relationship between architecture and implementation.

But DCL only describes one part of the architecture.

**DCL describes the behaviour. C4 describes the structure.**

---

## [browser]

I use C4 as part of my design process, and at this point the structure is deliberately very simple.

We have the Claim Simulator, the Knowledge API and persistence for proposed knowledge.

The Claim Simulator isn't really part of the Articulate product.

It's a development tool.

As Articulate evolves, I'll be able to create named scenarios containing collections of claims and throw those scenarios at the Knowledge API.

That should become important both for testing Articulate and for demonstrating its behaviour as the architecture becomes more sophisticated.

The Knowledge API provides the boundary through which those claims enter the system.

And initially, those claims simply need somewhere durable to be staged.

So this is enough to implement Capture Proposed Knowledge.

But it doesn't really prove much about an AI-native architecture.

At this point, I've essentially built an API that can persist documents.

I wanted the first architectural slice to contain at least one agent actually acting upon the knowledge entering the system.

And that introduces the second capability.

---

## Review Proposed Claim

The first agent implements the Review Proposed Claim capability.

Its responsibility is deliberately modest.

It receives a proposed claim and assesses whether the statement represents an architectural assertion.

It then records that assessment against the proposed claim.

This isn't deciding whether the claim is architectural truth.

It's the first filter in a much larger knowledge-evolution process.

---

## [vscode]

Looking at the Review Proposed Claim DCL, it's part of the same Knowledge context.

Most of this should now look familiar, so there are only a few additional things I want to point out.

The actor here is a system representing the messaging subscriber.

The capability is triggered when proposed knowledge becomes available for review.

We have some additional shapes describing the review result.

There is also an effect that uses a tool.

That's an important boundary.

The agent can reason about a claim, but it doesn't get unrestricted access to the underlying persistence.

The tool gives the capability a controlled way of recording the review result.

We also have policies.

A policy can contain one or more families of architectural characteristics such as reliability, performance, security, observability or confidence.

Within the capability, the policies block associates those policies with particular parts of the behaviour.

And in the `when` block, we can see that a policy contributes to determining the outcome.

Finally, there is a lifecycle.

DCL isn't intended to be a full workflow language.

But it can describe enough of a capability's lifecycle to express its states, transitions and the events that cause those transitions.

Let's compile the DCL and have a look at the graph workspace.

The architecture overview now shows both capabilities inside the Knowledge context.

It's still not particularly exciting.

But if I switch to the capability graph, we can see the individual parts of the capability and the relationships between them.

Changing the layout makes it easier to see the inputs, outcomes, effects and policies.

There are several other views available, but I'll come back to those in future episodes as the capability model becomes more interesting.

We now have two behaviours:

Capture Proposed Knowledge.

And Review Proposed Claim.

The structure required to execute them is rather more interesting.

---

## [browser]

This is the C4 model now.

The Claim Simulator still submits claims through the Knowledge API.

The Knowledge API persists those proposed claims.

But after a claim has been captured, an event is published.

That event is delivered through RabbitMQ using Dapr Pub/Sub building block.

The Review Proposed Claim Agent consumes that event and performs the initial assessment.

The agent also needs state, which is stored using Redis through Dapr's state building block.

And it needs access to a language model.

I'm using the Dapr Conversation building block for that boundary.

So the architecture has already changed considerably from the first diagram.

And that's useful.

The first capability required little more than an API and persistence.

Introducing reasoning immediately introduces messaging, agent execution, state and model interaction.

---

## [vscode]

The code for these services has now been created.

Dapr Agents is configured and Docker Compose is in place to run the whole development environment, which we'll see shortly.

One thing I particularly like is Prompty.

The prompt is a source-controlled artefact rather than a string buried somewhere inside the Python code.

There's some front matter describing its configuration, followed by the actual prompt used by the agent.

Again, this keeps an important part of the agent's behaviour visible and inspectable.

Alongside Dapr Agents, I'm now using several of the Dapr building blocks.

Pub/Sub handles the proposed-knowledge events.

State provides the agent with persistent execution state.

Conversation provides the model boundary.

Secrets handles configuration that shouldn't be embedded in the application.

And the Dapr runtime integrates with the observability infrastructure.

The language model itself isn't running inside this environment.

I have Ollama running on a separate M4 Mac mini using Gemma 3 12B.

That's useful for this experiment because the model remains outside Articulate itself.

The agent depends upon a conversation capability.

Which model happens to sit behind that capability is a separate concern.

### Persistence

I've talked a lot throughout this journal about the Knowledge Model, but I haven't yet made a decision about its eventual database engine.

And I don't need to make that decision yet.

For this first slice, I need somewhere durable to stage proposed claims and their review information.

I'm using MongoDB.

It's flexible, requires very little ceremony and lets me concentrate on testing the architectural flow rather than prematurely designing the final persistence architecture.

---

## [browser]

So this is where the architecture currently stands.

It's still small.

But this feels like enough for the first meaningful architectural slice.

We have capability intent described using DCL.

Structure described using C4.

A Knowledge API protecting the knowledge boundary.

Messaging between capabilities.

Our first reasoning agent.

Persistent state.

A language model.

And observability.

Now let's actually run it.

---

## [mongo]

I'm starting in MongoDB Compass.

At the moment, there are no proposed claims.

So we have a clean starting point.

---

## [vscode]

I'll start the environment using Docker Compose.

Here we can see the services starting along with the Dapr sidecars and the supporting infrastructure.

Once everything is healthy, we can put some claims through the system.

---

## [browser]

This is the OpenAPI documentation for the Claim Simulator.

I'm going to call this GET endpoint first.

That gives me the named scenarios currently available to the simulator.

Each scenario represents a known collection of claims that I can repeatedly send through Articulate.

I'm going to take this scenario and pass its name into the POST endpoint.

And execute it.

That has now submitted a collection of claims to the Knowledge API.

Capture Proposed Knowledge will process each claim and persist it.

Notifications will be published through Dapr Pub/Sub and RabbitMQ.

The Review Proposed Claim Agent will receive those messages and use the language model to assess whether each statement represents an architectural assertion.

Let's see what actually happened.

---

## [mongo]

If I refresh MongoDB, we now have proposed claims.

Opening one of those claims, we can see the original architectural assertion and its associated information.

And importantly, we can also see the result produced by the Review Proposed Claim capability.

So we've gone from an empty database, through the Knowledge API, through messaging, into an agent, through a language model and back to a recorded review result.

The two capabilities we started with in DCL are now executing.

---

## [browser]

Dapr also gives us distributed tracing through OpenTelemetry.

For this development environment I'm currently using Zipkin to inspect those traces.

Here we can see the execution crossing the different parts of the system.

We can inspect the spans, timings and calls and start to understand what happened during the execution of the scenario.

For a normal distributed application, this is incredibly useful.

And it gives me evidence that the architectural slice we've just looked at is actually executing across the boundaries I designed.

But there's a problem.

---

## [Narrator]

Zipkin can tell me that the agent executed.

I can see the services involved, the spans, the timing and the calls crossing the system.

For a normal distributed application, that's good observability.

But this isn't only a distributed application.

An agent made a judgement.

I want to understand the model interaction.

What context did it receive?

What response did the model produce?

Why did the agent reach the conclusion it did?

Is the response grounded?

Is the agent behaving consistently?

And eventually, is the implementation actually producing the outcome that DCL says the capability should produce?

Distributed tracing can tell me how the software executed.

It doesn't yet tell me whether the intelligence was any good.

So, does this architecture actually work when we build it?

At this scale, yes.

Claims can enter through the Knowledge API.

They're staged rather than becoming architectural truth.

Capture Proposed Knowledge produces an event.

An independent agent responds to that event, reasons about the claim and records its assessment through a controlled capability.

And I can observe that execution across the system.

It's a small start.

But Articulate is now running software.

The next question is whether I can understand and evaluate the behaviour of the intelligence running inside it.

That's the topic for the next episode.

Thanks for watching, and I'll see you in the next one.
