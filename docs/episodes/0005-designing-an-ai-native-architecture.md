Episode 5 – Designing an AI-Native Architecture

In the previous episode, I explored the qualities that define an AI-native system. Those qualities describe what the system needs to achieve, but they don't tell us what the architecture should look like. This episode bridges that gap.

This isn't an episode about drawing diagrams or choosing technology. It's about the process of turning requirements into an architecture.

Over the years I've developed an approach that is influenced by frameworks such as the Zachman Framework and TOGAF ADM, but adapted through practical experience delivering enterprise systems. Every architect develops their own way of working, and this is the approach I use today.

It is important to understand that this is an iterative process. On a real project, solution design may take days or weeks. Requirements evolve, assumptions are challenged, trade-offs emerge, and new information changes earlier decisions. For the purpose of this series, I'm compressing that process into a single episode and focusing on the reasoning behind the major architectural decisions rather than every iteration that would occur in a real engagement.

Architecture is More Than Diagrams

One of the biggest misconceptions about architecture is that it begins with a component diagram.

Diagrams are valuable. They communicate ideas, facilitate workshops, and provide a shared understanding across teams. I use them extensively, particularly when collaborating with others.

However, diagrams are not the architecture.

The architecture is the collection of decisions, constraints, assumptions and trade-offs that shape the system. The diagrams simply communicate those decisions.

If someone asks why a particular technology was selected, why services were separated in a certain way, or why one pattern was chosen over another, the answer will never be found in a diagram. It is found in the reasoning that led to those decisions.

That reasoning is where I always begin.

Requirements Drive Everything

Requirements are the foundation of every architectural decision.

Throughout the design process I continually return to the requirements to ensure the architecture remains aligned with the original objectives. This applies equally to functional requirements, quality attributes, business constraints and technical constraints.

As new ideas emerge, I ask a simple question:

Does this help satisfy the requirements?

If the answer is no, then the decision probably doesn't belong in the architecture.

This continuous validation helps avoid technology-led design where frameworks and platforms are selected because they are interesting rather than because they solve a genuine problem.

Starting With Questions

Rather than immediately selecting technologies or producing diagrams, I begin by asking a series of fundamental questions.

Why

The most important question.

Why does the system exist?

What business problem are we solving?

What value are we trying to create?

What constraints are driving the solution?

Understanding the justification behind the system influences every decision that follows.

What

What capabilities does the system need?

What information does it manage?

What knowledge must it capture?

What are the boundaries of the problem domain?

How

How will capabilities be realised?

How will users interact with the system?

How will AI participate in the workflow?

How will information flow through the system?

Where

Where are the architectural boundaries?

Where is information stored?

Where do services execute?

Where should intelligence reside?

When

When do events occur?

When does information change?

When should workflows persist?

When does human intervention become necessary?

Who

Who interacts with the system?

Who owns decisions?

Who are the consumers?

Who are the external systems?

Who are the AI agents participating in the solution?

These questions are not answered once.

They are revisited repeatedly as understanding grows.

Looking Through Different Perspectives

Once I have an initial understanding of the problem, I begin viewing the architecture through different perspectives.

Each perspective asks another set of questions and frequently uncovers additional requirements or design decisions.

Examples include:

Security

Performance

Scalability

Reliability

Resilience

Availability

Observability

AI evaluation

Usability

Operations

Deployment

Data management

Governance

Each perspective may reveal assumptions that were previously hidden.

For example, considering observability may introduce new telemetry requirements.

A resilience review may require workflow checkpointing.

An evaluation perspective may introduce an entirely new evaluation service for measuring AI quality.

Each review refines the architecture.

Decisions and Trade-offs

Architecture is ultimately about making decisions.

Every significant decision introduces trade-offs.

No architecture is perfect.

Every choice optimises for something while accepting compromises elsewhere.

Whenever I encounter an important decision, I begin documenting an Architectural Decision Record (ADR).

Rather than treating ADRs as documentation produced after the architecture is complete, I treat them as part of the design process itself.

Each ADR typically captures:

The context

The problem

Available options

Trade-offs

The decision

The justification

The consequences

Recording the reasoning is often more valuable than recording the final decision.

Months later, when someone asks why a technology was selected or why a particular pattern was adopted, the answer already exists.

Patterns Follow Requirements

One mistake I frequently see is starting with patterns.

Should we use CQRS?

Should we use Event Sourcing?

Should we use Actors?

Should we use Durable Workflows?

These are the wrong questions.

Instead I ask:

What quality attribute am I trying to satisfy?

If long-running conversations require durable execution, then I investigate patterns that solve durable execution.

If resilience is important, I explore resilience tactics.

If scalability becomes a requirement, I investigate architectural patterns that support scalability.

Patterns are solutions to problems.

They are never the starting point.

Architecture Evolves

By this stage, the architecture begins to emerge naturally.

Services become clearer.

Boundaries become clearer.

Responsibilities become clearer.

Technology choices become easier because they are responding to requirements rather than driving them.

This is often the point where diagrams become useful.

Context diagrams.

Container diagrams.

Deployment views.

Interaction diagrams.

Capability maps.

These artefacts communicate the architecture that has already been reasoned about.

Collaboration Improves Architecture

Although I spend significant time developing an initial solution design, I don't consider architecture to be a solitary activity.

Once I have a draft architecture, I actively involve the people who will ultimately build and operate the system.

This typically includes lead engineers, senior developers and platform or DevOps engineers.

Each brings a different perspective.

Implementation experience often highlights opportunities for simplification.

Platform engineers frequently identify operational concerns that are difficult to see during early design.

Developers challenge assumptions and expose edge cases that deserve further consideration.

These discussions improve the architecture.

Just as importantly, they create shared ownership.

The people responsible for building and maintaining the system understand not only what decisions were made, but why they were made.

Architecture succeeds through collaboration, not through documentation alone.

Applying This Process to Articulate

Everything described so far forms the basis of how I intend to build the Solution Design capability within Articulate.

Articulate isn't intended to generate architectures by pressing a button.

Instead, it will support the same reasoning process that I follow today.

It will help discover requirements.

Ask structured questions.

Capture knowledge.

Identify assumptions.

Highlight trade-offs.

Suggest architectural patterns.

Generate candidate ADRs.

Apply different architectural perspectives.

Maintain traceability back to requirements.

Produce architecture views and supporting documentation.

The architect remains responsible for making the decisions.

The AI helps reduce uncertainty, organise knowledge and accelerate the design process.

Looking Ahead

By the end of this process we have something far more valuable than a collection of diagrams.

We have a reasoned architecture.

Every significant decision can be explained.

Every technology selection has a justification.

Every pattern exists to satisfy a requirement.

Every view represents an architecture that has been deliberately designed rather than accidentally assembled.

This architecture is not final.

It will evolve as implementation begins, assumptions are tested and new information emerges.

That is the nature of architecture.

In the next episode we'll begin turning this architecture into a working system, implementing the first pieces of Articulate while continually validating the assumptions and decisions we've made during solution design.