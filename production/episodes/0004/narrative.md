# Episode 4 – The Properties Every System Needs

## Opening

In the previous episode, we explored what makes AI-native systems different.

We looked at agents, reasoning, conversations and workflows, and began to see how intelligence is becoming another architectural building block.

But before we continue that journey, I want to pause for a moment.

Because AI-native systems are still systems.

It's easy to become fascinated by language models, prompts and agents, but none of those replace the fundamentals of software engineering.

Whether you're building a banking platform, an e-commerce application or an AI assistant, every production system is ultimately judged by the same question.

Can people trust it?

That's what this episode is about.

The characteristics that make systems successful.

Many of these qualities have always been part of good architecture.

AI doesn't replace them.

It amplifies them.

---

## Functionality Versus Characteristics

When architects think about software, we tend to think in two dimensions.

The first is functionality.

What does the system actually do?

The second is characteristics.

How well does it do it?

Imagine asking an AI assistant to design a solution architecture.

Producing that architecture is functionality.

Whether the response is secure, reliable, observable, performant and trustworthy describes the characteristics of the system delivering it.

These qualities determine whether a system succeeds in production far more than its features.

Features attract users. Characteristics keep them.

---

## Why Architects Care

Throughout my career, one lesson has remained remarkably consistent.

Architectural patterns don't exist for their own sake.

We don't choose CQRS because it's fashionable.

We don't adopt Event Sourcing because it's interesting.

We choose these patterns because they improve one or more qualities of the system we're building.

Caching improves performance.

Workflow engines improve reliability.

Actor models improve scalability and resilience.

Observability platforms improve operability.

Every architectural decision is really a trade-off.

Improving one characteristic often makes another more difficult.

Architecture is the art of deciding which qualities matter most for the problem you're trying to solve.

That hasn't changed because AI arrived.

If anything, it has become even more important.

---

## Trust

Trust is the foundation of every production system.

Traditionally, that means authentication, authorisation, security, privacy, auditability and compliance.

AI-native systems introduce another layer of questions.

Which models should this user be allowed to access?

What information is safe to include in prompts?

Can sensitive information leak into a model?

Should an agent be allowed to call this tool?

Can every decision be audited?

Security is no longer just about protecting APIs.

It's also about protecting intelligence.

An agent might be technically capable of performing an action.

That doesn't mean it's authorised to perform it.

The architecture must make that distinction.

Trust has to exist across the entire journey, from user intent through reasoning and tool execution to the final result.

---

## Reliability

Reliability answers a simple question.

Can users depend on the system?

Traditionally that means availability, resilience, fault tolerance and recovery.

AI-native systems introduce new failure modes.

Models may become unavailable.

Providers may rate limit requests.

Retrieval services may fail.

External tools may stop responding.

Sometimes every technical component succeeds, yet the answer itself is still poor.

A reliable AI-native system should continue operating even when parts of its intelligence become unavailable.

That may mean selecting another model.

Retrying an operation.

Pausing a workflow.

Requesting human intervention.

Or continuing with deterministic functionality instead.

Reliability isn't about preventing failure.

It's about deciding what should happen when failure inevitably occurs.

---

## Performance

Performance is about much more than response time.

It's about latency, throughput, resource utilisation and cost.

One interesting characteristic of AI-native systems is that they often optimise perceived performance rather than absolute performance.

A streamed response that starts immediately usually feels much faster than waiting several seconds for a complete answer.

But streaming doesn't remove latency.

It simply changes how users experience it.

Performance also has to consider the entire reasoning pipeline.

Building context.

Retrieving knowledge.

Selecting tools.

Calling those tools.

Coordinating agents.

Running evaluations.

Every stage contributes to the overall experience.

And every stage has a cost.

Architecture determines where expensive reasoning is worthwhile and where deterministic software can do the job more efficiently.

---

## Scalability

When architects hear the word scalability, we usually think about infrastructure.

Horizontal scaling.

Queues.

Distributed processing.

Background workers.

Partitioning.

Those ideas remain just as important in AI-native systems.

Inference is expensive.

Retrieval consumes resources.

Long-running workflows occupy capacity.

Designing systems that scale economically is now just as important as designing systems that scale technically.

But AI introduces another dimension.

We're no longer just scaling infrastructure.

We're scaling intelligence itself.

---

## Scaling the Agent

One approach is to make an individual agent more capable.

Give it more tools.

More memory.

More knowledge.

More instructions.

A larger context window.

Initially this feels attractive.

The architecture appears simple.

One agent understands the request.

One agent makes the decisions.

One agent completes the work.

But eventually that simplicity starts working against us.

The context becomes enormous.

The prompt grows.

The tool catalogue expands.

The model has to work harder simply to understand everything we've given it.

Latency increases.

Costs increase.

Reasoning becomes less focused.

Important information becomes diluted amongst everything else.

A larger context window doesn't automatically produce better reasoning.

An agent can become more capable while becoming harder to understand, harder to evaluate and harder to operate.

---

## Scaling the Agent System

The alternative is to scale out.

Instead of creating one increasingly capable agent, we create several specialised agents.

One retrieves knowledge.

Another evaluates evidence.

Another checks architectural principles.

Another explores trade-offs.

Each agent has a narrower responsibility.

A smaller context.

A more focused purpose.

This often improves clarity, isolation and evaluation.

But scaling out isn't free.

The complexity doesn't disappear.

It simply moves somewhere else.

Now the architecture has to decide which agent should receive the request.

Whether several agents are needed.

How context should be transferred.

How results should be combined.

Where workflow state should live.

How failures should be recovered.

How the entire reasoning process should be observed.

This should sound familiar.

It's exactly the trade-off we encountered when software evolved from monoliths to distributed systems.

We've exchanged complexity inside one component for complexity across many components.

The same thing happens with agents.

---

## Scaling Up and Scaling Out

So the architectural question isn't whether agents should be large or small.

It's where we want complexity to live.

Scaling up concentrates complexity inside the reasoning of one agent.

Scaling out distributes complexity across the architecture.

Neither approach is universally correct.

Some problems benefit from richer reasoning inside a single coherent agent.

Others benefit from collaboration between several specialised agents.

Many systems will combine both.

The goal isn't to build the largest possible agent.

Nor is it to build the greatest number of agents.

The goal is to place complexity where it can be understood, controlled and operated.

---

## Coherence Before Size

That leads to an important architectural principle.

An agent shouldn't be small for the sake of being small.

It should be coherent.

Its responsibilities, context and tools should naturally belong together.

Splitting a coherent responsibility across many tiny agents can create more complexity than it removes.

It's very similar to prematurely decomposing a system into microservices.

Each service becomes smaller.

But the overall system becomes harder to understand because communication and coordination dominate the design.

Every agent boundary also becomes a routing boundary.

A context boundary.

A trust boundary.

An evaluation boundary.

And a failure boundary.

Agents should be split when additional responsibility makes them harder to understand, secure, evaluate, observe or evolve.

The important characteristic isn't size.

It's clarity.

---

## Observability

Observability has become one of the defining characteristics of modern software.

Traditionally we think about logs, metrics and traces.

AI-native systems require much richer visibility.

We need to understand prompt versions.

Model selection.

Token usage.

Retrieval quality.

Tool calls.

Workflow execution.

Confidence scores.

Evaluation results.

User feedback.

In a multi-agent system we also need to understand why a particular agent was selected.

What context it received.

What information it ignored.

How it reached its conclusion.

Observability is no longer just about understanding software execution.

It's about understanding intelligent behaviour.

---

## Evolvability

Technology changes.

AI changes even faster.

Good architecture should make change easier rather than harder.

Models will evolve.

Prompting techniques will evolve.

Agent frameworks will evolve.

Retrieval techniques will evolve.

Architectural intent should survive all of those implementation changes.

Responsibilities shouldn't exist only inside prompts.

They should exist independently of the models that implement them.

Architecture should make replacement possible rather than expensive.

---

## Operability

Building software is only part of the challenge.

Someone still has to operate it.

Configuration.

Monitoring.

Diagnostics.

Deployments.

Rollback.

Incident response.

These all remain essential.

AI-native systems introduce new operational concerns.

Changing routing policies.

Disabling models.

Inspecting reasoning paths.

Replaying workflows.

Replacing prompts.

Comparing evaluation results.

As systems scale out, operational complexity increases.

Architecture has to balance logical separation with practical operability.

---

## Quality Assurance

Traditional software engineering gives us testing.

Unit tests.

Integration tests.

Contract tests.

Performance tests.

These tell us whether the software behaves correctly.

Large language models introduce something different.

They are probabilistic.

The same prompt may produce different but equally valid answers.

A workflow may execute perfectly while producing a poor response.

Testing is still essential.

But it is no longer sufficient.

---

## Evaluation

Machine learning has always relied on evaluation.

Rather than asking whether software works, it asks how well the model performs.

AI-native systems inherit that mindset.

We need to ask questions like:

Was the answer correct?

Was it grounded in trusted information?

Did the agent choose the right tools?

Did it satisfy the user's intent?

Was the behaviour safe?

Was the outcome worth the cost?

Testing verifies implementation.

Evaluation measures behaviour.

Both are equally important.

---

## Evaluating Agent Architectures

Multi-agent systems introduce another level of evaluation.

We're no longer evaluating just the final answer.

We're evaluating the architecture that produced it.

Did the router select the correct agent?

Did each agent receive the right context?

Did agents duplicate work?

Did one introduce incorrect information?

Was collaboration actually beneficial?

More agents don't automatically produce a better system.

The additional complexity has to justify itself.

The quality of collaboration matters far more than the number of agents involved.

---

## Capabilities and Evaluation

One question sits underneath every evaluation framework.

What does success actually look like?

Traditional software answers that with assertions.

Machine learning uses metrics.

I believe AI-native systems need another layer.

Capabilities.

A capability describes intent.

Expected outcomes.

Policies.

Constraints.

Measures of success.

Instead of evaluating whether an agent produced a particular sentence, we evaluate whether the capability was successfully delivered.

This is one of the motivations behind the Declarative Capability Language, or DCL.

By explicitly describing success, we can evaluate outcomes rather than implementation details.

---

## Architecture Is About Qualities

One thing has become increasingly clear to me while researching AI-native systems.

The fundamentals haven't changed.

Architecture is still about balancing competing qualities.

Security becomes more complex.

Observability becomes richer.

Reliability becomes more challenging.

Scalability extends beyond infrastructure into the architecture of intelligence itself.

Testing is complemented by evaluation.

We're still solving the same architectural problems.

We're simply solving them in systems that can now reason, collaborate and make decisions.

---

## Closing Thoughts

Before designing any architecture, it's worth asking two simple questions.

What must the system do?

And what properties must the system possess?

The first defines functionality.

The second shapes the architecture.

AI-native systems introduce remarkable new capabilities.

But they don't remove the need for careful architectural thinking.

If anything, they make it even more important.

---

## Looking Ahead

In the next episode, I'll step away from discussing system characteristics and explain how I personally approach solution design and how I evolve an architecture over time.

Rather than presenting a fixed methodology, I'll share the process I follow to move from understanding a problem, through architectural thinking, to an evolving solution that can adapt as our understanding grows.