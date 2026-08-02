---
episode: 15
title: "Architectural Assurance"
description: "An exploration of how Articulate can continuously evaluate architectural knowledge, capability intent and proposed change against principles, characteristics, maturity, target-state decisions and external obligations."
season: 2
status: draft
topics:
  - Architectural assurance
  - Capability assurance
  - DCL
  - Architecture principles
  - Architecture characteristics
  - Architectural maturity
  - Structural integrity
  - Compliance
  - Derived findings
  - Continuous architecture
repository_paths:
  - docs/episodes/0015-architectural-assurance.md
---

# Episode 15 – Architectural Assurance

**Question:** *How can Articulate continuously evaluate an architecture rather than simply store it?*

Throughout this journal, I have spent a great deal of time exploring the Knowledge Model.

We have considered what architectural knowledge is, how it can be represented as claims, how it evolves through governed proposals and how reasoning capabilities can retrieve and interpret what is known.

At this point, it would be easy to think that the conceptual architecture is complete.

But I believe something important is still missing.

Knowing something about an architecture is not the same as knowing whether that architecture is coherent, appropriate or moving in the intended direction.

Architects rarely spend their time simply reading architectural information.

They evaluate it.

They ask questions.

They challenge assumptions.

They look for inconsistencies.

They identify risks.

They compare proposed changes against principles and previous decisions.

They consider whether a design improves or degrades important system characteristics.

They notice when today's proposal conflicts with tomorrow's architecture.

That activity is not documentation.

It is not retrieval.

It is architectural assessment.

This is where I believe Architectural Intelligence begins to move beyond knowledge management.

---

## More Than Storing Knowledge

The Knowledge Model represents what Articulate currently understands about an architecture.

It contains claims, evidence, relationships, decisions, principles, capabilities, characteristics, baselines and intended future states.

But simply storing these things does not make the system intelligent.

Intelligence begins when the system can evaluate what that knowledge implies.

Consider a simple proposal:

> Introduce a new Loyalty Service.

On its own, there is nothing particularly concerning about that statement.

Now suppose the proposed service depends upon an existing CRM platform.

Several months earlier, an accepted Architecture Decision Record established that the CRM platform would be retired.

Nothing explicitly states:

> This proposal introduces an architectural risk.

The proposal may even be valid against the architecture as it exists today.

The problem only becomes visible when the proposal is evaluated against the intended future architecture.

The finding does not exist as a stored fact.

It is derived by reasoning across different parts of the Knowledge Model.

That distinction is fundamental.

> The Knowledge Model stores what Articulate understands.

> Architectural Assurance evaluates what that understanding implies.

---

## Continuous Architectural Assessment

Articulate should not wait until someone explicitly asks a question before evaluating the architecture.

Every proposed solution design, architectural decision or significant knowledge change should be assessed before it becomes part of the authoritative model.

The purpose is not to replace architecture review or automatically reject designs.

The purpose is to surface concerns, trade-offs, gaps and consequences while there is still time to act upon them.

Conceptually, this extends the knowledge-evolution process introduced in the previous episode.

```text
Proposed Knowledge
        │
        ▼
Interpretation
        │
        ▼
Reconciliation
        │
        ▼
Validation
        │
        ▼
Architectural Assurance
        │
        ▼
Findings and Calls to Action
        │
        ▼
Human Judgement
        │
        ▼
Merge, Revise, Reject or Defer
```

The proposal itself remains proposed architectural knowledge.

The findings are the result of evaluating that proposal against the wider architectural context.

Those findings may include:

* conflicts
* risks
* regressions
* improvements
* missing evidence
* knowledge gaps
* principle concerns
* compliance implications
* calls to action

They are contextual and provisional.

They do not automatically become authoritative knowledge.

---

## Structural Integrity

The first responsibility of Architectural Assurance is ensuring that the architecture remains structurally coherent.

This resembles referential integrity within a database, but applied to architectural meaning rather than rows and foreign keys.

Examples might include:

* services that have become disconnected
* business capabilities with no supporting application
* components with no owning team
* integrations whose producer or consumer no longer exists
* dependencies on retired or superseded systems
* invalid or unresolved relationships
* application components that support no known capability
* systems that remain in the portfolio despite having no active dependants or purpose

Many of these findings can be identified deterministically.

If a proposal removes a service but leaves several other components depending upon it, Articulate can identify those relationships.

If a proposed solution depends upon a system marked for decommissioning, Articulate can raise that conflict.

If a capability exists without any implementation or ownership, the Knowledge Model can expose the gap.

For example:

```text
Loyalty Service
    │
    └── depends upon ──► Legacy CRM

Legacy CRM
    │
    └── lifecycle ──► Planned for Decommission

Derived Finding:
The proposed Loyalty Service introduces a new dependency on a system
that is scheduled for retirement.
```

This is more than dependency discovery.

It is the interpretation of a dependency within its architectural and temporal context.

---

## Reasoning Across Architectural Time

Architecture does not exist only in its current state.

The Knowledge Model must represent:

* what once existed
* what exists now
* what is intended to exist in the future

A proposal may therefore align perfectly with the current architecture while conflicting with the target architecture.

This is a different class of architectural issue.

Suppose an application is currently categorised using a portfolio-management model such as TIME:

* Tolerate
* Invest
* Migrate
* Eliminate

A system classified as **Eliminate** may still have many active dependencies.

That classification expresses architectural intent, but the dependency graph reveals the practical difficulty of achieving it.

Articulate could derive findings such as:

> The system is marked for elimination but still supports six business capabilities and has fourteen active inbound dependencies.

That finding becomes useful for planning.

It shows that the decision to retire the system is not yet matched by the surrounding architecture.

The same reasoning should apply when evaluating new proposals.

If a new solution design introduces an additional dependency upon that system, Articulate can flag it immediately:

> This proposal increases dependency on an application currently classified for elimination.

> Consider using the planned replacement capability or recording an explicit transitional exception.

This is not simply a conflict with stored data.

It is a conflict with architectural direction.

Architecture Decision Records therefore represent more than historical knowledge.

They also express intent.

Architectural Assurance should evaluate proposals not only against the architecture as it exists, but against the architecture we are deliberately trying to create.

---

## Principles Become Active

Architecture principles are frequently recorded as documents and then consulted inconsistently.

I think they should become far more active within Articulate.

A principle should provide an evaluative lens through which designs and decisions can be assessed.

Suppose an architecture principle states:

> A microservice has exclusive access to its database.

The Knowledge Model may contain:

```text
Order Service
    │
    └── owns ──► Order Database

Reporting Service
    │
    └── reads from ──► Order Database
```

The relationship is structurally valid.

Both services exist.

The database exists.

The connection may even work perfectly.

But the wider architectural meaning is problematic.

Articulate could derive a finding such as:

> Reporting Service directly accesses a database owned by Order Service.

> This appears to conflict with the principle that services retain exclusive ownership of their persistence.

> The design may introduce coupling to the owning service's internal data model and bypass its behavioural and consistency boundaries.

The system should not automatically reject the proposal.

Principles are rarely universal laws.

There may be a legitimate exception.

There may be a transitional architecture.

The relationship may have been classified incorrectly.

Instead, Articulate should explain:

* which principle appears relevant
* which knowledge triggered the concern
* why the relationship may represent a violation
* what risks may result
* whether an exception already exists
* what requires human judgement

The principle becomes an active architectural constraint rather than passive documentation.

---

## Characteristics Are About Direction

Architecture characteristics introduce a different form of evaluation.

A solution does not simply possess characteristics.

It changes them.

A proposal may improve availability while reducing maintainability.

It may improve resilience while increasing latency.

It may simplify development while increasing operational complexity.

It may improve consistency while creating a critical dependency.

Architectural Assurance should therefore compare the proposed architecture with an architectural baseline.

Rather than asking:

> Is this design scalable?

Articulate should ask:

> How does this design change scalability relative to the current architecture?

A finding might look like this:

| Characteristic  | Direction | Confidence | Reasoning                                    |
| --------------- | --------- | ---------- | -------------------------------------------- |
| Availability    | Improves  | High       | Removes a single-instance dependency         |
| Resilience      | Improves  | Medium     | Introduces asynchronous recovery             |
| Operability     | Degrades  | High       | Adds another distributed runtime             |
| Maintainability | Unclear   | Low        | Service boundaries remain unresolved         |
| Cost efficiency | Degrades  | Medium     | Requires parallel platforms during migration |

The purpose is not to produce a single architectural score.

Architecture is a collection of trade-offs.

A design may improve one characteristic precisely because it degrades another.

The value lies in making those consequences explicit before the decision is accepted.

---

## Maturity Is Not Automatically Progress

Architectural maturity can also be evaluated as part of proposed change.

A proposal may:

* improve observability maturity
* reduce integration standardisation
* increase deployment automation
* introduce an operational capability the organisation cannot yet support
* move a capability towards a target maturity level
* exceed the maturity actually required for the problem

Higher maturity is not automatically better.

A highly sophisticated architecture can be entirely inappropriate for an organisation that lacks the operational capabilities required to support it.

Articulate might therefore identify a finding such as:

> The proposed durable workflow platform improves recoverability maturity from level one to level three.

> The current operational model does not yet provide the monitoring, support ownership or incident response capabilities required at that level.

The proposal may still be appropriate.

But the maturity improvement introduces an organisational capability gap that should be understood before adoption.

Architectural maturity is therefore not simply a score.

It is another viewpoint through which change can be evaluated.

---

## Capabilities Can Be Defined in DCL

Architectural Assurance should not begin only after a solution design or ADR has been created.

Articulate is being designed around capabilities.

Where the intent of a capability is sufficiently understood, that intent can be expressed using DCL.

A DCL definition may describe:

* the capability's intended outcome
* its actors
* its rules
* its invariants
* its events
* its lifecycle
* its effects
* its governing policies
* its relationships with other capabilities

This creates another important assurance opportunity.

If DCL provides a structured representation of capability intent, the capability definition itself can be evaluated.

This is different from evaluating a proposed technical design.

Capability Assurance asks whether the intended behaviour is sufficiently complete, coherent and governable before implementation decisions are made.

```text
Capability Intent
        │
        ▼
DCL Definition
        │
        ▼
Capability Assurance
        │
        ▼
Findings and Discovery Questions
        │
        ▼
Refined Capability Intent
```

DCL therefore becomes more than machine-readable documentation.

It becomes an assurable representation of architectural intent.

---

## Capability Completeness

A capability can be syntactically valid while remaining conceptually incomplete.

For example:

> Assess an architectural proposal.

That may be a useful capability statement, but many questions remain.

* What constitutes a successful assessment?
* Which knowledge is required?
* Which principles and policies apply?
* What happens when evidence is insufficient?
* Can the capability reject a proposal?
* Does rejection require human approval?
* What happens if assessment fails partway through?
* Which effects must be recorded?
* How is the result observed or evaluated?

Capability Assurance can identify what is missing.

For example:

```text
Capability:
  Assess Proposed Architecture

Finding:
  The capability defines a successful assessment outcome but does not
  describe behaviour when supporting evidence is insufficient.

Call to Action:
  Define whether the proposal should be deferred, rejected, escalated
  or returned for further discovery.
```

This is not simply checking whether every possible DCL field has been completed.

It is asking whether the capability is sufficiently understood for its intended use.

That distinction matters.

A conceptual capability may need only a purpose, outcome and principal actors.

A capability that can modify authoritative architectural knowledge may require much greater precision around approval, confidence, auditability, failure behaviour and lifecycle.

Completeness must therefore be contextual.

---

## Capability Coherence

Capability Assurance can also evaluate whether the behaviour described within a capability is internally coherent.

Examples might include:

* an event is consumed but has no known producer
* an effect has no target
* a lifecycle state cannot be reached
* a rule references an undefined concept
* two invariants contradict one another
* a success outcome cannot be observed
* a capability invokes another capability without providing its required context
* a capability produces an event that no other capability handles

For example:

```text
Rule:
  All accepted knowledge changes require human approval.

Rule:
  High-confidence knowledge changes may merge automatically.
```

Both rules may appear reasonable independently.

Together, they require clarification.

Does one override the other?

Does automatic merge apply only to a specific class of knowledge?

Is human approval still required above a certain risk level?

Without that clarity, ambiguity will eventually reappear in prompts, workflows or source code.

Capability Assurance can identify the inconsistency before implementation begins.

---

## Outcomes Must Be Observable

DCL describes capabilities in terms of outcomes.

That makes it possible to assess whether success is meaningful and observable.

Consider an outcome such as:

> Improve architectural quality.

The intention is positive, but it is difficult to evaluate.

What changed?

How would we know the capability succeeded?

A more useful outcome might involve:

* identified principle conflicts
* recorded characteristic impacts
* traceable supporting evidence
* explicit human disposition
* no uncontrolled modification of authoritative knowledge

Capability Assurance could identify vague outcomes:

> The stated outcome cannot currently be evaluated because no observable success criteria have been defined.

This becomes especially important later when Articulate begins evaluating agent behaviour.

If the capability does not clearly describe what success means, the implementation cannot be meaningfully assessed either.

---

## Policy Coverage

The behaviour and effects of a capability may imply that particular policies are required.

A capability that modifies authoritative knowledge may need policies for:

* human approval
* confidence
* auditability
* security
* reliability
* data protection
* observability

A capability performing long-running work may require:

* durable execution
* recovery behaviour
* timeout handling
* escalation
* progress visibility

Capability Assurance can evaluate whether the defined policies are appropriate to the risk and responsibility of the capability.

For example:

```text
Capability:
  Merge Proposed Knowledge

Effect:
  Adds accepted claims to the authoritative Knowledge Model.

Finding:
  The capability does not define an approval or confidence policy.

Risk:
  Unreviewed or weakly supported knowledge may enter the authoritative model.
```

Not every capability needs every policy.

The required policy coverage should emerge from the capability's actors, effects, data and consequences.

---

## Relationships Between Capabilities

Capability Assurance should also operate across capability boundaries.

A capability rarely exists in complete isolation.

One capability may produce an event consumed by another.

One may depend upon the outcome of another.

Several capabilities may collaborate to deliver a larger architectural outcome.

The Knowledge Model can therefore evaluate questions such as:

* Are produced and consumed events compatible?
* Does every required outcome have a provider?
* Are there cyclic dependencies?
* Is a capability disconnected from the wider model?
* Are several capabilities claiming ownership of the same responsibility?
* Does one capability invoke another without the required context?
* Is an effect produced with no capability responsible for handling it?
* Does a capability violate the behavioural boundary of another?

This becomes the behavioural equivalent of structural integrity checking.

Instead of only checking whether application components are connected, Articulate can check whether architectural intent forms a coherent capability model.

---

## Principles Apply Before Solution Design

Architecture principles can also be evaluated directly against capability intent.

Suppose Articulate has established principles such as:

* authoritative knowledge evolves only through staged proposals
* agents interact with the Knowledge Model through tools
* humans approve significant knowledge changes
* long-running work uses durable execution
* capability intent remains independent of implementation technology

A DCL capability could conflict with one of those principles before any technical architecture exists.

For example:

```text
Capability:
  Update Knowledge Model

Actor:
  Reasoning Agent

Effect:
  Directly persists an accepted claim.
```

Capability Assurance could report:

> The capability appears to conflict with the principle that authoritative knowledge evolves only through staged proposals.

This is powerful because the inconsistency is found at the intent level.

The design can be corrected before it becomes a service, workflow, prompt or implementation.

---

## Compliance and External Obligations

The same assurance model can extend beyond internal architectural principles.

Many systems operate under external obligations such as:

* PCI DSS
* SOC 2
* ISO 27001
* data-protection regulation
* organisational security standards
* engineering policies
* industry-specific controls

The architecture may know that:

* a capability processes cardholder data
* a service logs request payloads
* those logs are retained in a shared platform
* a broad operational role can access that platform

No single claim necessarily represents a compliance problem.

The concern emerges when the information is considered together.

Articulate can identify:

* potentially applicable controls
* missing evidence
* architectural relationships requiring review
* absent policy coverage
* control gaps
* increased compliance scope
* proposed behaviour that may violate an obligation

However, an important boundary remains.

Articulate should not claim that an architecture is compliant simply because it has not detected a violation.

Compliance includes architecture, implementation, operational procedures, organisational controls, evidence and audit interpretation.

The system can support compliance assessment.

It cannot replace accountable compliance judgement.

Its findings should therefore use language such as:

* potential control concern
* missing evidence
* review required
* possible scope increase
* control applicability uncertain

Not:

* compliant
* certified
* guaranteed

---

## Deterministic Checks and Contextual Reasoning

Not every assurance finding requires an LLM.

Some checks should be deterministic.

Examples include:

* a service accesses a database owned by another service
* a component has no owner
* a dependency targets a system marked for retirement
* a required relationship is missing
* a capability consumes an event with no producer
* a lifecycle contains an unreachable state
* a proposal references an unknown architectural concept

These findings can often be identified through structured queries, graph traversal, DCL validation or policy rules.

Other assessments require contextual reasoning.

Examples include:

* whether a principle conflict is justified
* whether a characteristic has materially degraded
* whether an exception is appropriate
* whether evidence is sufficient
* whether a maturity increase creates disproportionate complexity
* whether a control applies to the proposed capability
* which risks should be prioritised

A robust assurance architecture should combine both approaches.

```text
Knowledge Model and DCL
          │
          ├── Deterministic Evaluation
          │       ├── structural checks
          │       ├── rule validation
          │       ├── lifecycle validation
          │       └── relationship analysis
          │
          └── Contextual Reasoning
                  ├── interpretation
                  ├── trade-off analysis
                  ├── risk explanation
                  ├── evidence assessment
                  └── calls to action
```

The LLM should not be asked to rediscover relationships that the Knowledge Model can establish reliably.

Its value lies in interpreting those relationships, explaining their significance, recognising ambiguity and helping the architect decide what to investigate next.

---

## Architectural Assurance as a Capability

By this point, I no longer think of these findings simply as derived knowledge.

They form a broader architectural capability.

Architectural Assurance continuously evaluates whether architectural knowledge and intent remain:

* coherent
* sufficiently complete
* aligned with principles
* appropriate to required characteristics
* compatible with accepted decisions
* consistent with target-state direction
* proportionate to organisational maturity
* aware of external obligations
* supported by adequate evidence

Conceptually, Architectural Assurance contains several related concerns:

```text
Architectural Assurance
│
├── Model Integrity
│   ├── disconnected structures
│   ├── invalid relationships
│   ├── missing ownership
│   └── unresolved references
│
├── Capability Assurance
│   ├── completeness
│   ├── behavioural coherence
│   ├── outcome observability
│   ├── policy coverage
│   └── capability relationships
│
├── Intent Conformance
│   ├── architecture principles
│   ├── accepted decisions
│   ├── target architecture
│   ├── application lifecycle
│   └── technology strategy
│
├── Quality Assessment
│   ├── characteristics
│   ├── maturity
│   ├── trade-offs
│   └── architectural risks
│
└── External Assurance
    ├── organisational policies
    ├── regulatory obligations
    ├── industry standards
    └── evidence requirements
```

These concerns may eventually be implemented using different mechanisms.

Some may use deterministic rules.

Some may use graph traversal.

Some may use specialised reasoning capabilities.

Some may require human review.

The conceptual boundary is more important than the implementation choice.

---

## Findings Are Not Automatically Knowledge

Architectural Assurance produces findings.

Those findings may be extremely valuable, but they should not automatically become authoritative architectural knowledge.

A finding may be:

* based on incomplete information
* dependent upon a particular baseline
* superseded by a later proposal
* resolved through an accepted exception
* incorrect because a relationship was misclassified
* useful only within the context of a particular review

A finding may therefore lead to:

* a question
* a call to action
* a risk
* a proposal revision
* a recorded exception
* additional discovery
* a new architectural claim
* a new decision

Only after the appropriate review should any resulting knowledge enter the Knowledge Model through the governed evolution process.

```text
Architectural Knowledge
        │
        ▼
Assurance Reasoning
        │
        ▼
Derived Finding
        │
        ▼
Human Review
        │
        ▼
Proposed Knowledge
        │
        ▼
Knowledge Evolution
        │
        ▼
Authoritative Knowledge
```

This preserves an important boundary.

Reasoning can produce insight.

It does not silently redefine architectural truth.

---

## Continuous Architecture Without Continuous Interference

Architectural Assurance creates the possibility of continuous architectural review.

Every significant proposal can be assessed as it enters the system.

Every new relationship can be evaluated.

Every accepted decision can influence later designs.

Every capability definition can expose missing intent.

Every change can be compared with principles, characteristics and target-state direction.

But continuous assurance must not become continuous obstruction.

If every minor change generates dozens of warnings, architects and engineers will ignore the system.

Findings therefore need:

* severity
* confidence
* evidence
* scope
* architectural relevance
* suppression or exception handling
* prioritisation
* clear ownership
* an actionable next step

The purpose is not to maximise the number of detected concerns.

The purpose is to help people focus on the concerns that materially affect architectural outcomes.

Architectural Assurance should support judgement, not overwhelm it.

---

## Intelligence Before Implementation

This episode continues the architectural approach followed throughout Articulate.

I am not yet deciding whether assurance will be implemented using a graph database, policy engine, DCL compiler, workflow, rules framework or collection of specialised agents.

Those are implementation decisions.

The important architectural discoveries are:

* architectural knowledge should be evaluated, not merely stored
* proposed change should be assessed before becoming authoritative
* principles should act as active evaluative constraints
* characteristics and maturity should be assessed directionally
* target-state intent should influence current decisions
* capability definitions expressed in DCL can themselves be assured
* deterministic checks and contextual reasoning should complement one another
* findings remain provisional until governed review turns them into accepted knowledge
* human architects retain judgement and accountability

These responsibilities now provide another set of capabilities that the implementation must eventually support.

---

## Looking Ahead

Architectural Assurance establishes a broad reasoning capability.

It can identify structural concerns, incomplete capability intent, principle conflicts, characteristic changes, maturity gaps, target-state misalignment and potential compliance implications.

The next question is how one of these reasoning capabilities works in practice.

One of the most valuable activities performed by an architect is understanding the consequences of change.

If a service changes:

* which systems depend upon it?
* which capabilities are affected?
* which decisions become relevant?
* which principles apply?
* which characteristics may change?
* which transition plans are disrupted?
* which risks emerge?
* what evidence supports the conclusion?

Answering those questions requires more than following relationships.

It requires interpreting what those relationships mean within the architectural context.

In the next episode, I will explore **Impact Analysis** as the first practical demonstration of Architectural Intelligence in action.

