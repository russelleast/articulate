---
id: episode-0005
title: How I Approach Solution Design and Evolving Architecture
summary: >
  The approach I use to move from questions and requirements to
  architectural decisions, while continuously testing assumptions and
  evolving the architecture as new evidence emerges.
title: How I Approach Solution Design and Evolving Architecture
published: 2026-07-15
updated: 2026-07-15
status: current
sequence: 5
season: foundations
topics:
  - solution-design
  - architectural-decisions
  - requirements
  - architecture-evolution
questions:
  - How do I approach solution design and allow architecture to evolve as
  understanding improves?
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0005-designing-an-ai-native-architecture.md
featured: false
---

# Episode 5 – How I Approach Solution Design and Evolving Architecture

Architecture is often presented retrospectively.

We see the finished diagrams, the selected technologies and the
decisions that survived. What we rarely see is the process that produced
them: the questions that were asked, the assumptions that proved wrong,
the alternatives that were rejected and the architecture that changed as
understanding improved.

Articulate is intended to be different.

This journal is not documenting a system whose architecture has already
been designed. The architecture will emerge throughout the project as I
investigate problems, test ideas, make decisions and learn from
implementation.

Before going further, I therefore want to explain the approach I use
when designing systems.

This is not intended to be a universal architecture methodology. Over
the years, I have developed an approach influenced by frameworks such as
the Zachman Framework and TOGAF ADM, but adapted through practical
experience designing and delivering systems.

More importantly, this is not a process that will be completed in this
episode.

It is the approach I intend to follow throughout the rest of this
journal.

## Architecture Is More Than Diagrams

One of the biggest misconceptions about architecture is that it begins
with a component diagram.

Diagrams are valuable.

They communicate ideas, facilitate conversations and help people develop
a shared understanding of a system. I use them extensively throughout
the architecture process.

However, diagrams are not the architecture.

The architecture is the collection of significant decisions,
constraints, assumptions and trade-offs that shape a system.

A diagram might show that two components communicate through a message
broker. It cannot necessarily explain why asynchronous communication was
required, what alternatives were considered or what consequences were
accepted by making that decision.

That reasoning matters.

If someone asks why a particular technology was selected, why a system
boundary exists or why one pattern was chosen over another, I want to be
able to trace that decision back to the problem it was intended to
solve.

That is where I begin.

## Requirements and Architectural Drivers

Requirements provide the context for architectural decisions, but not
every requirement has the same architectural significance.

As an architect, I am particularly interested in identifying
**Architecturally Significant Requirements**, often shortened to
**ASRs**.

A normal requirement describes something the system needs to do or a
constraint within which it must operate.

An ASR is a requirement that has a meaningful influence on the shape of
the architecture.

The difference is not always obvious from how a requirement is written.

Consider a requirement such as:

> A user can submit a request for analysis.

On its own, that tells us relatively little about the architecture.

Now imagine that the analysis may take several hours, must survive
service restarts, may require human approval before continuing and must
maintain a complete audit trail of how its conclusions were reached.

The requirement has become architecturally significant.

It introduces concerns around durable execution, state management,
human-in-the-loop workflows, observability and traceability.

These become architectural drivers.

ASRs frequently emerge from quality attributes such as scalability,
availability, security, performance and reliability, but they can also
originate from functional requirements, business constraints, regulatory
obligations and technical constraints.

The important question is therefore not simply:

> What are the requirements?

It is:

> Which requirements will materially influence the architecture?

I look particularly for requirements that force difficult decisions,
constrain multiple parts of the system, introduce significant risk or
make one architectural approach more appropriate than another.

Sometimes these requirements are explicit.

More often, they have to be discovered.

## Starting With Questions

I tend to begin architecture work with questions rather than solutions.

At the highest level, those questions are deliberately simple:

-   What?
-   How?
-   Where?
-   Who?
-   When?
-   Why?

This approach is influenced by the Zachman Framework, although I do not
use Zachman as a rigid documentation framework.

The idea I find valuable is that the same fundamental questions can be
explored from different perspectives.

The questions remain broadly the same.

What changes is **who I am asking them for and what I am trying to
understand**.

From a product perspective, **What?** may identify business entities and
features. **How?** may describe workflows. **When?** may expose roadmap
dependencies. **Why?** may reveal business value and rationale.

From an architectural perspective, those same questions lead somewhere
different.

**What?** may identify major building blocks and scope.

**How?** may explore interactions, patterns and architectural
approaches.

**Where?** may reveal boundaries, distribution and deployment concerns.

**Who?** may identify actors, stakeholders and responsibilities.

**When?** may expose system events and temporal dependencies.

**Why?** may uncover architectural characteristics, significant
decisions and their justification.

For developers, the questions become more concrete again, covering
applications, components, data models, integrations, deployment
approaches and ownership.

For operations, they may expose infrastructure, networks, provisioning,
capacity, security policies, availability, recovery and monitoring.

I have previously represented this approach as a grid, with perspectives
forming one dimension and these fundamental questions forming the other.
The intersections provide prompts for deeper investigation.

The purpose is not to complete every cell.

Doing that would simply replace one heavyweight documentation template
with another.

Instead, I use the grid as a **question-generation mechanism**.

Depending on the problem, its scope and the people involved, I explore
the perspectives that matter.

For example, asking:

> Where does this system run?

may produce a simple infrastructure answer.

But exploring **Where?** from several perspectives might reveal very
different questions:

-   Where are the users?
-   Where are the teams responsible for the system?
-   Where is data created?
-   Where is it stored?
-   Where do components execute?
-   Where are the trust boundaries?
-   Where can failures occur?

Likewise, **Who?** can expand into users, actors, stakeholders,
ownership, responsibilities and security boundaries.

**When?** can expose business events, system events, sequencing,
temporal dependencies and lifecycle concerns.

The questions are simple.

The investigation they create is not.

## Looking Through Different Perspectives

The perspective-based questions help me understand the problem, but I
also examine the emerging design through architectural perspectives.

These might include:

-   Security
-   Performance
-   Scalability
-   Reliability
-   Resilience
-   Availability
-   Observability
-   Usability
-   Operations
-   Deployment
-   Data management
-   Governance

For an AI-native system, that list may need to expand further.

I may need to consider AI evaluation, explainability, model behaviour,
confidence, provenance, human oversight and the operational consequences
of non-deterministic behaviour.

Each perspective can reveal requirements or assumptions that were
previously hidden.

An observability review may introduce additional telemetry requirements.

A resilience review may reveal that a long-running process needs
checkpointing.

A security review may expose trust boundaries that were not previously
visible.

An AI evaluation perspective may reveal that the system needs to capture
information that would not normally be retained by traditional
application telemetry.

This is one reason I do not consider architecture to be a linear
process.

Looking at the architecture differently often changes my understanding
of the original problem.

## From Requirements to Options

Once I understand enough about the problem and its architectural
drivers, I can begin exploring possible solutions.

This is where I deliberately try to avoid jumping immediately to
technology.

If a requirement tells me that work may continue for several days and
must survive process failure, the architectural problem is **durable
execution**.

That does not immediately mean Temporal.

If a system needs to understand highly connected knowledge, the
architectural problem may involve representing and traversing
relationships.

That does not immediately mean a graph database.

If several specialised reasoning behaviours need to collaborate, that
may indicate some form of agentic architecture.

That does not automatically mean I need an agent framework.

The distinction matters because technologies change much faster than
architectural problems.

I therefore try to move through the reasoning in this direction:

**Problem → Principles → Capabilities → Architecture → Runtime →
Technology**

Requirements and architectural drivers inform every stage of that
progression.

Technology is important.

It is simply not where I want the reasoning to begin.

## Patterns Follow Problems

The same principle applies to architectural patterns.

Questions such as these often appear early in architecture discussions:

> Should we use CQRS?

> Should we use Event Sourcing?

> Should we use actors?

> Should we use durable workflows?

These questions begin with solutions.

Instead, I want to understand the problem first.

If different parts of a system need independently optimised read and
write models, CQRS may become worth considering.

If historical state and the sequence of changes are fundamental to the
domain, Event Sourcing may become relevant.

If the system contains large numbers of independently stateful entities
requiring concurrency and isolation, an actor model may be appropriate.

If work must survive failures, pause for external input and continue
over long periods, durable workflows may become a candidate solution.

Patterns are useful because they capture accumulated architectural
experience.

But they are responses to particular forces and problems.

They should not be the starting point.

## Decisions and Trade-offs

Eventually, architecture requires decisions.

Every significant decision introduces trade-offs.

There is rarely a universally correct architecture.

A decision may improve scalability while increasing operational
complexity.

A stronger consistency model may simplify one part of the system while
reducing availability elsewhere.

Introducing a workflow engine may provide durable execution while adding
another significant runtime dependency.

Using specialised data stores may better match individual workloads
while increasing the operational cost of the platform.

Architecture is about understanding and deliberately accepting those
trade-offs.

When I encounter a significant decision, I use an Architectural Decision
Record, or ADR, to capture the reasoning.

An ADR will typically describe:

-   The context
-   The problem
-   The architectural drivers
-   The available options
-   The trade-offs
-   The decision
-   The justification
-   The consequences

I do not see ADRs as documentation written after the architecture has
been designed.

The act of writing the ADR is part of the design process.

If I cannot clearly explain the problem, the alternatives and why one
option is preferable, I may not yet understand the decision well enough
to make it.

## Architecture Emerges

As these decisions accumulate, the architecture begins to emerge.

Boundaries become clearer.

Responsibilities become clearer.

Relationships become clearer.

Runtime requirements become clearer.

At this point, diagrams become increasingly useful.

I might create context diagrams, capability maps, interaction diagrams,
deployment views or other architectural representations.

But those diagrams are now communicating reasoning that has already
taken place.

They are also snapshots.

The diagram I draw today represents my current understanding of the
system.

It is not a promise that the architecture will remain that way.

This is particularly important for Articulate.

I already have ideas about how the system might work.

Some of those ideas come from previous versions of Articulate. Others
come from technologies and architectural patterns I have worked with
before.

Those ideas are useful hypotheses.

They are not automatically architectural decisions.

The purpose of this journal is partly to test them.

## Architecture Evolves Through Evidence

Architecture does not stop when implementation begins.

Implementation creates new evidence.

An assumption about performance may prove incorrect.

A service boundary may create unnecessary complexity.

A technology selected for one reason may introduce consequences that
were not understood during design.

An experiment may show that an architectural concept does not work as
expected.

The problem itself may become better understood.

When that happens, the architecture should be capable of changing.

This does not mean constantly redesigning the system.

It means treating architectural decisions as decisions made with the
best available information at a particular point in time.

As the available information changes, significant decisions may need to
be revisited.

For Articulate, I want that evolution to be visible.

If an architectural hypothesis proves wrong, I want to document why.

If an ADR is superseded, I want the original reasoning to remain
available.

If an experiment changes the architecture, I want the evidence that
caused that change to be clear.

The evolution of the architecture is part of the architecture.

## Collaboration Improves Architecture

Although I may develop an initial solution design, I do not consider
architecture to be a solitary activity.

Different people see different parts of the problem.

Product specialists understand business outcomes and constraints.

Developers expose implementation realities and edge cases.

Platform and operations engineers identify runtime concerns that may not
be obvious during conceptual design.

Security specialists expose threats and trust boundaries.

The people responsible for operating a system often ask very different
questions from the people building it.

These perspectives challenge assumptions.

They also create shared ownership.

A good architectural decision should not depend on everyone agreeing
with the architect.

It should be possible for people to understand the reasoning, challenge
the assumptions and contribute new evidence.

AI introduces another interesting participant into this process.

Throughout Articulate, I will be using AI as a collaborator in
architectural thinking and development.

That does not mean delegating architectural responsibility to an AI.

It means using AI to explore alternatives, challenge assumptions,
identify gaps and help maintain the body of knowledge surrounding the
architecture.

That relationship itself will be one of the things this journal
explores.

## The Architecture Loop

Although I have described these ideas in sections, I do not see solution
design as a sequence of phases.

It is closer to a continuous loop:

> **Questions → Requirements → ASRs → Architectural Drivers → Options →
> Trade-offs → Decisions → Architecture → Evidence → Learning →
> Re-evaluation**

New questions can appear at any point.

A decision may expose a requirement that was previously hidden.

Implementation may invalidate an assumption.

An experiment may introduce a completely new option.

A change in the problem may cause an old architectural decision to
become inappropriate.

The loop continues for as long as the system continues to evolve.

The important thing is maintaining the reasoning that connects each
step.

## Applying This Approach to Articulate

This episode does not produce the architecture for Articulate.

That is deliberate.

The architecture will emerge throughout the journal.

The next stage of the project will begin investigating one of the most
important questions for the system:

> What does architectural knowledge actually look like?

That investigation will lead into the Knowledge Model.

From there I will explore how AI retrieves and reasons over
architectural knowledge, how agent behaviour should be represented, what
runtime characteristics the system requires, how memory should work, how
long-running reasoning can execute durably and how architectural
knowledge should evolve.

Each investigation will produce new requirements.

Some will reveal ASRs.

Some will result in experiments.

Some will lead to ADRs.

Some may challenge decisions I have already made.

By the time implementation begins, I expect to understand considerably
more about the architecture than I do today.

But implementation will not mark the end of architectural design.

It will simply provide a new source of evidence.

## An Evolving Architecture

The goal of this process is not to produce an architecture that is
finished.

It is to create an architecture that can be explained.

I should be able to trace significant decisions back to architectural
drivers.

I should be able to explain the alternatives considered.

I should understand the trade-offs that were accepted.

And when the architecture changes, I should be able to explain why.

As Articulate evolves, new information will challenge existing
assumptions.

Research will introduce new possibilities.

Experiments will invalidate ideas.

Implementation will expose constraints that were not visible during
design.

Some decisions will survive.

Others will change.

That is not a failure of the architecture process.

It is part of it.

The approach described in this episode is therefore not something I will
complete before moving on to the next stage of Articulate.

It is the process I intend to follow throughout this journal:

**Ask questions.**

**Discover the architectural drivers.**

**Explore the options.**

**Make the trade-offs explicit.**

**Record significant decisions.**

**Test assumptions against evidence.**

**Learn.**

**Evolve the architecture.**

The episodes that follow will put that process into practice.
