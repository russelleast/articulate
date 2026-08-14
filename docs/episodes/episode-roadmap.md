# Season 2 – Building the Knowledge Model

**Theme:** Building the conceptual architecture for Articulate before writing any implementation code.

This season explores the ideas behind **Architectural Intelligence**. Rather than starting with frameworks and code, it establishes the knowledge model, reasoning patterns and architectural decisions that will ultimately shape the implementation.

---

## Episode 16 – Building the Knowledge Service

**Question:** *How do we turn the conceptual architecture into software?*

After fifteen episodes establishing the conceptual architecture, implementation finally begins.

This episode creates the Knowledge Service, the central service responsible for knowledge evolution and knowledge reasoning.

The implementation establishes the project structure, service boundaries, APIs and foundational abstractions that future episodes will build upon.

It marks the transition from architectural thinking to executable software.

Need to introduce 1 agent that acts on a proposed claim

---

## Episode 17 - Observing agents

Although observbility solutions existing for cloud native systems, this explores the requirements and approach to observing agents.

Look at changing Zipkin to azire phoenix

---

# Season 3 – Implementing Architectural Intelligence

## Episode 19 – Impact Analysis as Knowledge Reasoning

**Question:** *Can AI understand the consequences of architectural change?*

Impact analysis becomes the first practical demonstration of Architectural Intelligence.

Rather than simply traversing relationships, reasoning agents interpret capabilities, decisions, claims and evidence to explain why change matters.

The episode demonstrates how multiple retrieval strategies combine to answer complex architectural questions.


---

## Future episodes

Episodes in no set order

- Learn from Reasoning: After observabilty, evaluation. Look at reasoning maps with evaluation to see how agents can learn from data
- Hardware analysis: Using Ollama Gemma3 on mac mini, profile the hardware to see how it performs and how it can be improved

- Conversation (season): 
  - Conversational ui and backend service, using sse and llm.
  - RAG: include companion documentation to aid the users looking how to use articulate.
  - Speech service: SST & TTS
  - The conversation spine - the intent router

- Discovery (season):
  - Question service: question sets and hidden checklist pattern
  - Signal extraction: NLP and LLM
  - Landscape discovery lens: Quantitive Claims
  - System lens - Ontology
  - Domaim lens - DDD & DCL 

### Research

#### Reasoning Intelligence & Learning from Experience

Context

A future season of the Articulate journal should explore how the system can learn from the history and evaluation of its own reasoning.

This idea builds directly on the Reasoning Maps introduced around Episode 8, Agentic RAG and Knowledge Reasoning.

The immediate roadmap should not attempt to build a self-improving reasoning system. The near-term work is to establish the knowledge model, agentic RAG, reasoning maps, and evaluation infrastructure that will eventually make this research possible.

Core Research Question

Can an AI-native system improve its architectural reasoning by learning from the evaluated history of its own reasoning processes?

This is more interesting than simply asking how to make an agent better.

The goal is to investigate whether reasoning itself can become accumulated architectural experience.

Evolution of the Idea

The conceptual progression is:

Knowledge Model
    ↓
"What do we know?"

Reasoning Map
    ↓
"How did we reason?"

Evaluation
    ↓
"How well did we reason?"

Reasoning Experience
    ↓
"What can we learn from previous reasoning?"

Adaptive Reasoning
    ↓
"How can previous experience improve future reasoning?"
Phase 1 — Observe

Use the Reasoning Map as an observable representation of the agent's reasoning process.

Phase 2 — Measure

Evaluate both the result and the reasoning process.

Phase 3 — Learn Patterns

Accumulate many evaluated reasoning traces and identify which reasoning strategies produce better outcomes.

Phase 4 — Guide Future Reasoning

Use those observed patterns to influence future agent strategy selection.

The first three phases provide the evidence required before attempting the fourth.

Evaluation Beyond the Answer

Evaluation should eventually assess more than whether the final answer is correct.

Potential dimensions include:

Knowledge retrieval quality

Reasoning quality

Answer correctness

Completeness

Evidence quality

Grounding

Reasoning-path effectiveness

Tool/capability selection

Unnecessary reasoning steps

Agent failures and recovery

Latency

Cost

Human assessment of usefulness

This creates the possibility of evaluating a Reasoning Map as an architectural artefact.

For example:

Question
   ↓
Question Classification
   ↓
Retrieval Strategy
   ↓
Knowledge Discovered
   ↓
Reasoning Steps
   ↓
Evidence
   ↓
Conclusion
   ↓
Evaluation
The evaluation data can then be associated with the reasoning path that produced the result.

Future Reasoning Experience Store

Over time, evaluated reasoning traces could form a new category of knowledge:

Historical Reasoning
        ↓
     Evaluation
        ↓
Reasoning Patterns
        ↓
Strategy Selection
        ↓
Future Reasoning
This does not necessarily require retraining an LLM.

The initial interpretation of "learning" should be architectural:

The system learns from experience by using evaluated historical reasoning traces to influence future reasoning strategy.

This could eventually become a Reasoning Experience Store containing examples of successful and unsuccessful reasoning strategies.

Potential Future Season

Season: Reasoning Intelligence

Possible episodes:

The Reasoning Map
Making AI reasoning observable.

Evaluating Reasoning
Evaluating the reasoning process rather than only the final answer.

Reasoning as Data
Treating historical reasoning traces as structured data.

Reasoning Strategies
Identifying which strategies work for different classes of architectural problems.

Learning from Experience
Using historical evaluation to influence future reasoning.

Reasoning Policies
Turning observed experience into explicit guidance for agents.

Adaptive Agents
Agents selecting reasoning strategies based on accumulated experience.

Architectural Intelligence
Exploring what it means for a system to become better at architectural reasoning.

These are candidate topics rather than a fixed episode plan.

Relationship to the Current Roadmap

This is a future season.

The current priority is still to complete the knowledge and agent implementation work around the current episodes, including:

DCL
 ↓
Knowledge Model
 ↓
Knowledge Storage
 ↓
Knowledge Ingestion
 ↓
Retrieval
 ↓
Agentic RAG
 ↓
Agents
 ↓
Reasoning
 ↓
Reasoning Maps
 ↓
Evaluation
Evaluation should be introduced during this current implementation phase because it needs to exist before enough reasoning history can be accumulated.

The future season then builds upon that foundation:

Knowledge
    ↓
Reasoning
    ↓
Evaluation
    ↓
Experience
    ↓
Adaptive Reasoning
Architectural Significance

This could eventually extend Articulate's knowledge architecture beyond a single knowledge model.

Potentially:

┌─────────────────────────┐
│ Knowledge Model         │
│ "What we know"          │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Reasoning Model         │
│ "How we reason"         │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Evaluation Model        │
│ "How well we did"       │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Experience Model        │
│ "What we learned"       │
└─────────────────────────┘
This connects strongly with the broader Articulate idea of architectural intelligence becoming executable and eventually evolving toward engineering intelligence.

The important research progression is therefore:

Architecture knowledge becomes executable reasoning, reasoning becomes observable, observable reasoning becomes evaluable, and evaluated experience may eventually improve future reasoning.

The objective is not to assume that this works, but to build Articulate so that the evidence can eventually be collected to investigate whether it does.

---

#### Architectural Fitness, Governance & Engineering Feedback Loop

Context

A significant new direction emerged from thinking about the problem of architecture knowledge becoming stale.

A knowledge graph can become outdated if developers are expected to manually maintain it. Articulate should instead explore a continuous architectural feedback loop where engineering changes are evaluated against architectural intent and accepted changes feed new knowledge back into the model.

The core idea is:

Articulate makes architectural intent executable.

Architecture should not merely be documented. It should become context for engineering, something that can be evaluated against changes, and something that evolves from evidence.

1. PRs as an Architectural Governance Boundary

A PR should serve two distinct purposes.

Pre-approval: Architectural Fitness

Before a PR is approved/merged, Articulate analyses the proposed change against the existing architecture knowledge model.

Inputs can include:

Code changes

Infrastructure changes

Configuration

Tests

PR description

Agent-generated implementation plan

ADRs

Architecture documents

Architecture diagrams

DCL

Other engineering artefacts

Articulate evaluates the proposed change against:

Architectural principles

Capabilities

Characteristics / quality attributes

Architectural decisions

Constraints

Policies

Existing claims

DCL

Existing architectural relationships

The result is an architectural fitness assessment.

Example:

Architectural Fitness

Status: PASS WITH WARNINGS

Architecture maturity: 87 → 87

Capabilities affected:
- Order Processing
- Notification

Characteristics:
- Reliability: unchanged
- Maintainability: unchanged

Principles:
- 4 evaluated
- 4 satisfied

Potential architectural change:
- New asynchronous integration

Recommendation:
- Architectural review required
Fitness should not necessarily be binary.

Potential policy levels:

Informational

Warning

Significant

Blocking

A change could be technically valid but still decrease architectural maturity or violate an architectural principle.

2. Post-approval: Architectural Reconciliation

Once the PR is approved and merged, Articulate analyses the accepted change and generates new or changed architectural claims.

The important distinction is:

Before merge: "This change appears to introduce X."

After merge: "The implementation changed X."

After knowledge acceptance: "X is now accepted architectural knowledge."

The knowledge model should therefore not be blindly updated from every PR.

Instead, generate evidence-backed claim proposals.

Example:

Claim:
Settlement capability uses asynchronous messaging.

Evidence:
PR #1842
commit abc123
architectural analysis

Status:
Accepted

Accepted by:
Architectural approval

Effective:
2026-08-13
This preserves provenance and allows Articulate to answer not just what is believed, but why it is believed.

3. A PR Does Not Have to Be a Code Change

A major extension of the idea is that architectural change can originate from any engineering artefact.

A PR could change:

PR
├── code
├── tests
├── configuration
├── ADRs
├── architecture documents
├── architecture diagrams
├── DCL
└── other evidence
Existing Articulate discovery mechanisms should be reusable for these artefacts.

For example, if an architecture diagram changes from:

Order → Notification
to:

Order → Message Broker → Notification
Articulate could ingest the changed diagram, discover the architectural relationship, compare it with the knowledge model, and identify a proposed architectural change.

This means discovery is not only an initial architecture-discovery mechanism.

It becomes a reusable architectural evidence ingestion capability.

4. Three Types of Architectural Evidence

The knowledge model should potentially distinguish between:

Declared architecture

What architects say the architecture should be.

Examples:

DCL

Architecture diagrams

ADRs

Architecture documents

Principles

Characteristics

Constraints

Observed architecture

What the system actually appears to do.

Examples:

Code

Infrastructure

Configuration

Runtime evidence

Dependencies

Deployment topology

Engineering intent

What someone proposes to change.

Examples:

PR description

Issue

Coding-agent plan

Design proposal

Articulate can reason across all three.

             ENGINEERING INTENT
                    │
                    ▼
              Proposed State
                    │
                    ▼
             Fitness Evaluation
                    │
                    ▼
              IMPLEMENTATION
                    │
                    ▼
               Observed State
                    │
                    ▼
          ┌────────────────────┐
          │ Knowledge Model    │
          └────────────────────┘
                    ▲
                    │
              Declared State
                    │
          DCL / diagrams / ADRs
This suggests a broader concept of an architectural digital thread.

5. Architecture as Context for Developers and Coding Agents

The feedback loop also works in the opposite direction.

The Articulate knowledge model should potentially become part of the context available to developers and coding agents.

A coding agent should not only ask:

"How do I implement this?"

It should be able to ask:

"Does my proposed implementation align with the architecture?"

The agent could submit its plan to Articulate before implementation.

Context supplied by Articulate could include:

Relevant capabilities

Architectural principles

Characteristics

Constraints

Decisions

DCL

Existing relationships

Relevant claims

Architectural rationale

Example:

Coding Agent

Proposed:
Add asynchronous processing for OrderCreated.

Articulate:

✓ Aligns with Order Processing capability
✓ Aligns with asynchronous integration principle
✓ Consistent with reliability requirements
✓ Consistent with ADR-014

⚠ Concern:
The proposed worker introduces a new persistence
boundary not represented in the architecture.

Recommendation:
Reuse the existing store or propose an architectural change.
This creates an architecture-aware coding agent.

The agent still implements the change; Articulate provides architectural context and evaluation.

6. DCL's Role

DCL becomes particularly important in this model.

DCL should not only describe capabilities for architects.

It can become part of the machine-readable architectural context consumed by engineering agents and fitness evaluation.

For example:

Capability: Notification

Intent:
  NotifyCustomer

Outcomes:
  CustomerNotified
  NotificationFailed

Policies:
  delivery must be reliable
  customer preferences must be respected

Characteristics:
  Reliability: high
  Auditability: required
This gives the coding agent architectural intent before it starts changing implementation.

Potential flow:

Requirement
    ↓
Capability
    ↓
Architectural constraints
    ↓
Existing implementation
    ↓
Proposed change
    ↓
Tests
This supports the broader Articulate principle:

Architecture becomes executable context.

7. PR Approval vs Articulate Approval

There may be two different authorities:

PR approval
=
"Should we make this change?"

Articulate approval
=
"Should this become accepted architectural knowledge?"
They are related but not necessarily identical.

This should probably be controlled by a governance setting.

Potential modes:

Mode	PR approval	Articulate approval
Passive	Required	None
Advisory	Required	Suggested
Governed	Required	Required for significant changes
Strict	Required	Required for all architectural claims
The UX should avoid creating unnecessary approval bureaucracy.

The PR should remain the primary engineering workflow surface.

For significant changes, GitHub could show:

Architecture approval
─────────────────────
⚠ Required

Reason:
This change alters the declared reliability
characteristic of the Settlement capability.

[Review in Articulate]
For ordinary changes:

✓ Architectural fitness passed
✓ No architectural approval required
Articulate should integrate into the existing PR experience rather than forcing developers to move between systems unnecessarily.

8. Architecture Governance

This naturally evolves into a broader Architecture Governance capability.

Governance should not mean a central architecture committee or manual approval bureaucracy.

Instead:

Governance becomes continuous, evidence-based architectural control.

Governance policy itself should potentially become part of the knowledge model.

It could define:

What must be evaluated

What constitutes a violation

Which violations are blocking

Which changes require human approval

Who can approve exceptions

What becomes architectural knowledge

How architectural maturity is calculated

How exceptions expire

Articulate evaluates architecture according to the organisation's declared governance model rather than imposing its own definition of "good architecture."

9. Architectural Exceptions

Exceptions should be first-class knowledge.

If a team deliberately violates a principle, Articulate should not simply report:

FAILED
Instead:

Principle violation
        ↓
Exception requested
        ├── rationale
        ├── scope
        ├── owner
        ├── expiry
        └── compensating controls
        ↓
Approved exception
Subsequent PRs can then understand:

"This technically violates principle P-17, but approved exception EX-042 applies to this capability until December."

This allows the knowledge model to represent not just architecture, but architectural governance and rationale.

10. Architectural Maturity / Fitness

Fitness should potentially measure more than compliance.

Possible dimensions:

Principle compliance

Architectural characteristics

Capability integrity

Decision compliance

Complexity

Observability

Security

Dependency structure

Architectural consistency

A change could report:

Architecture Fitness

Before: 82
Proposed: 79

↓ Maintainability
↓ Reliability

Reason:
New synchronous dependency creates coupling
between two previously independent capabilities.

Recommendation:
Use asynchronous integration.
This connects architectural governance with the broader idea of continuous architectural health.

11. The End-to-End Demonstration

A very strong Articulate journal demonstration would use a separate example Git repository representing a small system.

The demo could show:

Stage 1 — Coding agent

The coding agent receives a requirement and creates an implementation plan.

It calls Articulate to ask:

"Does this plan align with the architecture?"

Articulate identifies alignment, concerns, and potential violations.

Stage 2 — Implementation

The coding agent implements the change.

Stage 3 — PR

The agent raises a PR.

Articulate runs as a PR check and analyses:

Actual code changes

Documents

Diagrams

DCL

PR description

Other changed artefacts

It returns an architectural fitness result.

Stage 4 — Approval

The PR is approved.

Depending on governance configuration, Articulate may require separate architectural approval.

Stage 5 — Knowledge evolution

After merge:

PR
 ↓
Discovery
 ↓
Architectural claims
 ↓
Evidence/provenance
 ↓
Knowledge Model
The new knowledge becomes available to future developers and coding agents.

The complete loop becomes:

Architecture
      ↓
Knowledge
      ↓
Agent Context
      ↓
Agent Plan
      ↓
Code / Documents / Diagrams
      ↓
PR
      ↓
Architectural Fitness
      ↓
Approval
      ↓
Claim Generation
      ↓
Knowledge Model
      ↓
Evolved Architecture
      ↓
Next Change
This is potentially one of the strongest demonstrations of Articulate because it shows both directions of architectural intelligence.

12. Architectural Thesis

The emerging thesis worth preserving for the roadmap is:

Architecture is not kept in sync by synchronising documentation with code. It is kept in sync by continuously comparing declared architectural intent with observed system change.

And the broader Articulate proposition is:

Articulate makes architectural intent executable.

The architecture becomes:

Context for developers

Context for coding agents

Input to architectural evaluation

A source of governance policy

A source of fitness functions

A repository of evidence-backed claims

A feedback mechanism for architectural evolution

Potential Roadmap Theme

Architectural Fitness & Governance

Explore how Articulate can become an active participant in the engineering lifecycle.

Key experiments:

 Expose architectural context to coding agents

 Allow agents to submit implementation plans for architectural assessment

 Analyse PRs for architectural significance

 Implement architectural fitness evaluation

 Detect principle and characteristic violations

 Support configurable governance/approval policies

 Ingest changed architecture documents

 Ingest changed architecture diagrams

 Reuse discovery mechanisms for PR artefacts

 Generate evidence-backed claims from approved changes

 Support post-merge knowledge reconciliation

 Model architectural exceptions

 Explore architectural maturity scoring

 Build a separate example repository for the end-to-end demonstration

 Demonstrate coding-agent → Articulate → PR → fitness → approval → knowledge loop

Longer-term research direction

Explore whether Articulate can become a form of continuous architectural governance:

Declared Architecture
        ↕
Knowledge Model
        ↕
Engineering Context
        ↕
Engineering Changes
        ↕
Architectural Fitness
        ↕
Governance
        ↕
Evidence
        ↕
Evolving Architecture
This potentially brings together several existing Articulate themes — DCL, claims, discovery, knowledge modelling, agents, evaluation, architecture characteristics, governance and runtime evidence — into a single coherent architectural feedback loop.

----

#### System Discovery, Articulate Studio & Coding Agent Integration

Context

Articulate has three discovery lenses:

Enterprise — understanding organisational context.

Landscape — understanding systems and their relationships across the organisation.

System — understanding the internal architecture of a particular system.

The earlier proof-of-concepts for landscape discovery used a conversational UI, with anchor questions followed by targeted questions when confidence was low. This led to the idea of claims as the atomic unit of architectural knowledge.

A key realisation was that a landscape should not simply be represented as a graph. A graph can represent relationships between things in the landscape, but the landscape itself is a richer architectural model/catalogue.

System discovery presents a different problem because there is much more machine-observable evidence.

System discovery is hybrid

System discovery should not be purely conversational or purely code-scanning.

A system may be:

A monolith.

A set of independently deployable services.

A group of services that are collectively known by a system name.

A collection of services, jobs, databases and infrastructure.

Several independently architected applications that collectively form one conceptual system.

A "system" that exists primarily as an organisational/architectural concept rather than having a clear technical boundary.

Therefore, system is a semantic architectural boundary, not necessarily a technical building-block type.

The scanner should not attempt to determine "the system" directly.

Instead:

The scanner discovers architectural observations; conversation establishes architectural meaning and boundaries.

Conceptually:

Code / IaC / Configuration / Docs
                |
             Scanner
                |
                v
     Architectural observations
                |
                v
       Candidate structure
                |
         Conversation
                |
                v
          System model
Conversation is therefore particularly valuable for resolving ambiguity and establishing relationships that cannot reliably be inferred from code.

Articulate Studio

There is already a prototype called Articulate Studio implemented as a VS Code extension.

Current implementation:

VS Code extension.

Scanner currently understands:

Dockerfiles.

Docker Compose YAML files.

Produces useful architectural information from those artefacts.

Builds a graph representation using Cytoscape.

The graph provides an immediate visual representation of discovered system structure.

The scanner does not need to become highly intelligent initially.

It can deterministically extract observations such as:

Containers/services.

Images.

Ports.

Networks.

Volumes.

Environment variables.

Dependencies.

Container relationships.

Example:

docker-compose.yml

    orders-api
        |
        +---- postgres
        |
        +---- rabbitmq

    orders-worker
        |
        +---- postgres
        |
        +---- rabbitmq
This is valuable even before any sophisticated semantic interpretation is applied.

Next Studio feature

The obvious next feature is:

Upload the discovered architectural data to Articulate.

This allows the local scanner to become an evidence source for the Articulate knowledge model.

The important distinction is:

Scanner
  -> observes architecture

Articulate
  -> stores and reasons about architectural knowledge
The scanner should not necessarily decide what the architecture means.

New idea: make system discovery consumable by coding agents

A further idea emerged:

Instead of exposing Articulate Studio only through a conventional MCP server, could Codex, Claude Code or another coding agent use the discovery capability as an agent skill?

This is potentially more interesting than simply creating an MCP server.

The distinction:

MCP exposes capabilities to an agent. A skill teaches an agent how and when to use those capabilities as part of a reasoning workflow.

The scanner already provides a capability:

Inspect a repository and construct an architectural model from available evidence.

A coding agent could invoke that capability as part of its normal workflow.

Example

Developer asks a coding agent:

"Add Redis caching to the Orders service."

Before modifying the code, an Articulate architecture skill could instruct the agent to:

Inspect the repository.

Run/discover using Articulate Studio's scanner.

Construct a system-level architectural view.

Identify components and dependencies.

Identify architectural unknowns.

Use existing Articulate knowledge if available.

Reason about the proposed change in the context of the discovered architecture.

The agent might discover:

Orders API
    |
    +---- PostgreSQL
    |
    +---- RabbitMQ

Orders Worker
    |
    +---- PostgreSQL
    |
    +---- RabbitMQ
The agent now has architectural context before creating its implementation plan.

The scanner should remain relatively deterministic

A useful separation of concerns is:

Articulate Studio
        |
        | deterministic discovery
        v
Architectural observations
        |
        | interpreted by
        v
Coding agent / Articulate skill
        |
        v
Architectural reasoning
The scanner does not need to understand everything.

It should expose reliable evidence.

The agent can interpret that evidence and combine it with:

Conversation.

Existing Articulate knowledge.

Documentation.

Architecture constraints.

DCL/capability information.

Proposed implementation changes.

Three potential consumers of the same discovery model

The same canonical discovery representation could have three consumers:

1. Articulate Studio

Immediate local feedback:

"Here is what I can discover about your repository."

2. Articulate

Persistent architectural knowledge:

"These are architectural observations/evidence about the Orders system."

3. Coding agents

Ephemeral working context:

"Here is what you need to understand before changing this repository."

This avoids creating three separate architecture models.

Potential evolution of the agent skill

Skill v1 — System discovery

articulate-system-discovery

1. Inspect repository.
2. Run Articulate discovery.
3. Analyse discovered architecture.
4. Summarise system structure.
5. Identify unknowns.
Skill v2 — Knowledge-aware discovery

articulate-system-discovery

1. Scan repository.
2. Build architectural model.
3. Retrieve relevant Articulate knowledge.
4. Compare discovered evidence with existing knowledge.
5. Identify discrepancies.
6. Ask targeted questions where necessary.
7. Produce enriched system model.
Skill v3 — Architecture reasoning

articulate-architecture

1. Understand the system.
2. Retrieve architectural constraints.
3. Understand the proposed change.
4. Analyse architectural impact.
5. Identify potential violations.
6. Explain architectural concerns.
7. Produce an architecture fitness assessment.
Connection to architecture governance

This creates a natural path toward the previously discussed architecture governance concept.

A coding agent could propose:

Add a new Notifications service and have Orders API call it directly.

Articulate could know that the existing architecture uses asynchronous communication through RabbitMQ.

The architecture skill could therefore identify:

The proposed direct HTTP dependency introduces a synchronous dependency that is not present in the current architectural model.

This turns Articulate from a documentation/knowledge system into something that can participate in engineering decisions and governance.

Potential future flow:

Developer
    |
    v
Coding Agent
    |
    | understand system
    v
Articulate discovery
    |
    +---- local repository evidence
    |
    +---- Articulate knowledge
    |
    +---- architectural constraints
    |
    v
Architecture reasoning
    |
    v
Implementation plan
    |
    v
Code / PR
    |
    v
Architecture governance
Important conceptual model

The emerging model is:

Code / Infrastructure
        |
        v
Observations
        |
        v
Claims
        |
        v
Architectural entities
        |
        v
Relationships
        |
        v
System model
        |
        v
Capabilities / architecture characteristics
        |
        v
Architectural knowledge
Claims remain important because scanner output is evidence, not necessarily truth.

For example:

Observation:
Orders.Api depends on PostgreSQL.

Evidence:
docker-compose.yml
configuration
source code
This can contribute to a claim:

Orders.Api
    depends_on
PostgreSQL
But higher-level claims may require human confirmation:

Orders.Api
    belongs_to
Orders System
The latter may not be reliably inferable from the codebase alone.

Ontology direction

Avoid making the ontology assume that every system has a particular technical architecture.

Instead, distinguish between:

Architectural entities

Examples:

Application

Service

Component

Module

Database

Datastore

API

Interface

Queue

Event

Message

Worker

Job

Container

Architectural relationships/groupings

Examples:

depends_on

calls

publishes

subscribes

reads

writes

implements

deployed_as

belongs_to_system

part_of_domain

owned_by_team

This allows a system to contain heterogeneous entities with their own independent internal architectures.

For example:

Orders System
    |
    +-- Orders API
    |       |
    |       +-- Domain
    |       +-- Application
    |       +-- Infrastructure
    |
    +-- Orders Worker
    |       |
    |       +-- Worker architecture
    |
    +-- PostgreSQL
    |
    +-- RabbitMQ
The system is the architectural context, not necessarily the technical structure.

Key roadmap implications

Articulate Studio

Continue developing the VS Code extension.

Keep scanner deterministic and evidence-oriented.

Expand beyond Docker/Docker Compose incrementally.

Maintain a canonical architectural discovery representation.

Add upload/synchronisation with Articulate.

Treat Cytoscape visualisation as a useful local view, not the system model itself.

Articulate knowledge model

Store discovered observations/evidence.

Represent claims separately from raw observations where appropriate.

Track evidence and confidence.

Allow human/conversational confirmation of ambiguous architectural relationships.

Support system boundaries as semantic/grouping constructs rather than assuming they are directly discoverable from code.

Coding agent integration

Explore an Articulate system-discovery / architecture skill for coding agents such as Codex and Claude Code.

Initial objective:

Give coding agents a reliable architectural understanding of a repository before they plan or implement changes.

Do not initially optimise for a sophisticated autonomous architecture agent.

Start with:

Discover
  -> Explain
  -> Identify unknowns
  -> Reason
Then evolve toward:

Discover
  -> Compare with architectural knowledge
  -> Evaluate proposed change
  -> Identify architectural impact
  -> Govern
Core insight

The strongest emerging idea is not:

"Articulate Studio is a tool that generates architecture diagrams."

It is:

Articulate Studio is an architectural observation instrument.

And the broader Articulate architecture becomes:

Studio observes the system. Articulate remembers and reasons about architecture. Conversation resolves ambiguity. Coding agents consume that intelligence when engineering the system.

This gives the system-discovery lens a very different character from landscape discovery:

Landscape discovery: primarily ask humans and build knowledge from claims.

System discovery: observe artefacts, then use conversation to establish architectural meaning.

Architecture intelligence: reason over both observed implementation and stated architectural intent.

This also provides a strong future bridge between Articulate, DCL, AI-assisted development and architecture governance.

---

