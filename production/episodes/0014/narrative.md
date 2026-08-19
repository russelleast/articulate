# Episode 14 – Knowledge Evolution

> **Question:** *How does architectural knowledge safely change over time?*

Hello, I'm Russell, and welcome to Episode 14 of the Articulate Journal, where I'm exploring what it takes to build an AI-native architecture from first principles.

Earlier in the journal, I introduced the Knowledge Model and the idea of representing architectural knowledge as claims.

A claim is an assertion about an architecture.

The Order Service uses PostgreSQL.

The Customer API runs in AWS.

The CRM platform is owned by the Customer Experience team.

But these aren't necessarily absolute truths.

They are things Articulate currently has some reason to believe.

And that creates the question for this episode.

**What happens when new information arrives?**

---

## A Living Knowledge Model

One of the goals for Articulate is to create a living architectural model.

Architectural information might come from a discovery conversation.

An Architecture Decision Record.

A solution design.

Source code or infrastructure.

An architect.

Or eventually, from agents reasoning over information Articulate already knows.

If the Knowledge Model represents Articulate's understanding of an architecture, that understanding has to evolve as new information appears.

But there's a tension here.

If the Knowledge Model cannot change, it becomes stale.

But if anything can change it freely, it stops being trustworthy.

So the problem isn't really:

**How do we update architectural knowledge?**

It's:

**How do we safely evolve what Articulate understands about an architecture?**

---

## Knowledge Has to Evolve

Imagine Articulate currently believes:

> **Order Service uses PostgreSQL.**

There is evidence supporting that claim, and we have reasonably high confidence in it.

Then some new information arrives:

> **Order Service uses MongoDB.**

What should Articulate do?

It can't simply replace PostgreSQL with MongoDB.

Perhaps MongoDB describes a future migration.

Perhaps the service currently uses both.

Perhaps the new information is wrong.

Or perhaps PostgreSQL was correct six months ago and MongoDB is correct today.

That's the important distinction.

**New information isn't automatically new truth.**

It has to be understood in the context of what Articulate already knows.

And that led me to the idea of **proposed knowledge**.

New information doesn't directly modify the authoritative Knowledge Model.

Instead, it enters a process something like this:

Incoming Information

    ↓

Proposed Knowledge

    ↓

Interpretation

    ↓

Reconciliation

    ↓

Accepted Knowledge

The exact implementation isn't important yet.

What matters are the responsibilities.

Articulate first needs to understand what the new information is actually saying.

Then it needs to reconcile that information with what it already knows.

Does it support something we already believe?

Does it contradict it?

Does it supersede something that was previously true?

Does it describe a future state?

Or do we simply not have enough evidence to know yet?

Sometimes the correct answer will be:

**We don't know.**

That might require more evidence.

It might trigger further discovery.

It might require an architect to make a judgement.

I don't want an agent manufacturing architectural certainty simply because the underlying data model expects one answer.

Uncertainty is part of architectural knowledge.

---

## Time Matters

Time becomes particularly important during reconciliation.

We might eventually understand that:

> Order Service used PostgreSQL.

> Order Service currently uses MongoDB.

> Order Service will move to DynamoDB.

Those aren't contradictory claims.

Together, they describe the evolution of the architecture.

of what **once was**, what is **as-is** and what is **to-be**.

And importantly, accepting MongoDB doesn't mean deleting PostgreSQL.

If PostgreSQL genuinely represented the architecture previously, it remains part of the architectural history.

This matters because architectural decisions have context.

A decision made two years ago should be understood against the architecture that existed two years ago.

Something that looks like a poor decision today may have been completely reasonable given the constraints, knowledge and architecture that existed at the time.

So the knowledge hasn't simply been corrected.

**Our understanding has evolved.**

---

## Understanding the Baseline Architecture

This is where architectural baselines become important.

"Understanding the baseline architecture" is something architects say alot.

Within Articulate, I think a baseline gives that phrase a specific meaning.

A baseline represents an accepted architectural viewpoint at a particular point in the architecture's evolution.

It doesn't need to duplicate the entire Knowledge Model.

The Knowledge Model remains one connected body of architectural knowledge.

The baseline determines the viewpoint through which that knowledge is understood.

A current baseline represents the architecture we understand to exist today.

A previous baseline allows us to understand the architecture as it was.

And a target baseline can represent the architecture we're intending to create.

This gives us:

**Once Was** 

**As Is**

**To Be**

without maintaining three disconnected architecture models.

And because the underlying claims, evidence and decisions remain connected, we can ask more than:

> What did the architecture look like?

We can also ask:

> Why did it look like that?

Or:

> What changed between these baselines?

That's much closer to how I want Articulate to understand architectural change.

---

## Approval Isn't Acceptance

There's another consequence of this model.

Proposed knowledge might remain proposed for quite a long time.

Imagine a significant architectural proposal that requires human approval.

The proposal is created and reconciled against the current baseline.

It looks reasonable.

But the architect doesn't approve it until two weeks later.

During those two weeks, the architecture may have changed.

Another decision may have been accepted.

A dependency may have changed.

A system may now be scheduled for retirement.

New evidence may have appeared.

The proposal was valid against the baseline from two weeks ago.

That doesn't necessarily mean it's valid against the current baseline.

So approval alone isn't necessarily enough to make something accepted architectural knowledge.

Before the proposal is merged, it may need to be reconciled again against the latest baseline.

I think this is particularly interesting after the previous episodes on durable execution.

The execution can pause.

A human can take days to respond.

But the architecture doesn't pause while we're waiting.

When execution resumes, the world may have changed.

---

## Claims Become Architecture

There is one other important distinction.

Articulate isn't ultimately going to present architects with thousands of disconnected claims.

Claims are the assertions underneath its architectural understanding.

Imagine Articulate has accepted these claims:

> Order Service runs in AWS ECS.

> Order Service reads and writes to Order Database.

> Order Database is PostgreSQL.

> Order Database runs in AWS RDS.

Individually, these are architectural assertions.

Together, they begin to describe a system.

They identify architectural entities.

They establish relationships.

They create a connected architectural model.

Other claims might describe ownership.

Business capabilities.

Characteristics.

Principles.

Decisions.

The architecture emerges from the relationships between what Articulate has learned.

But the underlying claims remain important because they explain why Articulate believes those relationships exist.

What evidence supports them.

Where they came from.

How confident we are.

And when they were believed to be true.

The architectural model gives us understanding.

The claims give that understanding context.

---

## Knowledge Evolution Is a Capability

This has changed how I think about the Knowledge Model.

Originally, the problem sounded like data modelling.

How should Articulate store architectural information?

But storage isn't really the interesting problem.

The interesting problem is maintaining an evolving understanding of architecture.

New information has to be interpreted.

It has to be reconciled with existing understanding.

Time has to be considered.

Evidence and confidence have to matter.

And sometimes uncertainty has to remain unresolved.

This also clarifies an important architectural boundary.

Agents shouldn't simply modify the Knowledge Model.

They can contribute information.

They can interpret it.

They can reconcile claims.

They can gather evidence.

They can reason about what has changed.

But changing authoritative architectural knowledge is a governed behaviour.

It's not simply a database update.

**Knowledge evolution is itself an architectural capability.**

---

## Looking Ahead

So we now have a model where Articulate can continually receive new architectural information without automatically treating that information as truth.

New information becomes proposed knowledge.

It is interpreted and reconciled against existing understanding.

Accepted knowledge can then evolve our understanding of the architecture without rewriting what came before.

And baselines allow us to understand that architecture from different points in its evolution.

But there's another problem.

A proposed change can be perfectly consistent with what Articulate already knows and still be a bad architectural change.

It might violate an architecture principle.

It might introduce a dependency on a system we're trying to retire.

It might improve availability while significantly increasing operational complexity.

Knowing what the architecture **is** isn't enough.

We also need to evaluate what that knowledge **means**.

And that's the question for the next episode:

**How can Articulate continuously evaluate an architecture rather than simply store it?**

That's where Architectural Assurance begins.