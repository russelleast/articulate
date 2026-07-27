---
id: episode-0004
title: "System Characteristics: The Properties Every System Needs"
summary: >
  The qualities that make production systems trustworthy, and the additional
  demands AI-native systems place on reliability, scalability, evaluation,
  and operations.
published: 2026-07-15
updated: 2026-07-24
status: current
sequence: 4
season: foundations
topics:
  - system-characteristics
  - trust
  - scalability
  - ai-evaluation
questions:
  - Which characteristics make an AI-native system trustworthy in production?
related_principles:
  - coherence-before-size
related_patterns: []
related_decisions: []
related_experiments: []
repository_paths:
  - docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md
featured: false
---

# Episode 4 — System Characteristics: The Properties Every System Needs

*AI-native systems still need to be systems.*

One of the risks when discussing AI-native architecture is becoming so focused on models, prompts and agents that we forget the fundamentals of software engineering.

Whether we are building a banking platform, an e-commerce application or an AI assistant, every production system is ultimately judged by the same question:

**Can people trust it?**

Before exploring runtime architectures, workflows and multi-agent systems, it is worth stepping back and considering the characteristics that make any system successful.

These characteristics are not unique to AI.

They have always been part of good architecture.

However, AI-native systems place new demands on many of them.

---

## Functionality Versus Characteristics

As architects, we think about software in two dimensions.

The first is **functional behaviour**.

What does the system do?

The second is **system characteristics**.

How well does the system do it?

A user might ask an AI assistant to design a solution architecture.

That is functionality.

Whether the response is secure, reliable, observable, performant and trustworthy describes the characteristics of the system delivering it.

These qualities often determine whether a system succeeds in production, regardless of how impressive its features appear to be.

---

## Why Architects Care

One of the most important lessons I have learned throughout my career is that architectural patterns rarely exist for their own sake.

We do not choose CQRS because it is fashionable.

We do not adopt event sourcing because it is interesting.

We choose architectural patterns because they improve one or more system characteristics that matter to the problem we are solving.

| Pattern                 | Primarily Improves          |
| ----------------------- | --------------------------- |
| CQRS                    | Scalability, performance    |
| Event Sourcing          | Auditability, reliability   |
| Workflow Engines        | Reliability, recoverability |
| Actor Models            | Scalability, resilience     |
| Caching                 | Performance                 |
| Circuit Breakers        | Reliability                 |
| RAG                     | Accuracy, groundedness      |
| Observability Platforms | Operability                 |

Architecture is fundamentally about making trade-offs to achieve the qualities that matter most.

A pattern that improves one characteristic may weaken another.

Caching may improve performance while making consistency harder.

Distribution may improve scalability while making reliability and observability more difficult.

Greater autonomy may improve adaptability while reducing predictability.

There is rarely a perfect architecture.

There is only an architecture whose trade-offs are appropriate for its context.

---

## Trust

Trust is the foundation of every production system.

For traditional applications, this includes concerns such as:

* authentication
* authorisation
* auditability
* privacy
* compliance
* security

AI-native systems introduce additional questions.

* Which models can this user access?
* What information can be included in a prompt?
* Can prompts expose sensitive data?
* Can retrieved information cross security boundaries?
* Are tools being called with the correct permissions?
* Can generated responses be explained and audited?
* Can an agent take an action without human approval?

Security is no longer only about protecting APIs and infrastructure.

It is also about protecting the intelligence operating within the system.

An agent may be technically capable of calling a tool, but capability does not imply authority.

The architecture must distinguish between what an agent **can** do and what it is **permitted** to do.

Trust must therefore be designed into the entire path from user intent to model reasoning, tool execution and final outcome.

---

## Reliability

Reliability answers a simple question:

**Can users depend on the system?**

This includes:

* availability
* fault tolerance
* resilience
* disaster recovery
* graceful degradation
* recoverability

Reliability becomes especially important in AI-native systems because parts of the intelligence may depend on external services.

A model provider may time out.

An API may apply a rate limit.

A retrieval service may become unavailable.

A tool may fail after an agent has already completed several earlier steps.

A generated response may be incomplete or unusable even when every technical component executed successfully.

Good AI-native systems should continue operating when parts of their intelligence are unavailable.

That might mean:

* selecting an alternative model
* retrying an operation
* returning a reduced result
* pausing a workflow
* requesting human intervention
* continuing with deterministic functionality
* preserving state so work can resume later

Reliability is not only about preventing failure.

It is also about controlling what happens when failure inevitably occurs.

---

## Performance

Performance is about more than response time.

It includes:

* latency
* throughput
* resource utilisation
* cost efficiency
* streaming responses
* parallel execution

AI-native systems often optimise **perceived performance** as well as absolute performance.

A streamed response that begins immediately can provide a better experience than waiting several seconds for a complete answer.

However, streaming does not remove latency.

It changes how the user experiences it.

Agentic systems may also contain multiple sources of delay:

* model inference
* context construction
* retrieval
* tool selection
* tool execution
* agent coordination
* validation
* human approval

Improving one stage does not necessarily improve the end-to-end experience.

Performance must be understood across the complete reasoning and execution path.

It must also be considered alongside cost.

A faster or more capable model may produce better results, but it may not be economically appropriate for every task.

Architecture must determine where expensive reasoning is justified and where a smaller model, deterministic component or cached result is sufficient.

---

## Scalability

Scalability is the ability of a system to continue operating effectively as demand increases.

In traditional cloud-native systems, this commonly includes:

* horizontal scaling
* queue-based workloads
* distributed workflows
* multi-tenancy
* background processing
* partitioning
* caching
* model serving

These concerns remain important in AI-native systems.

Models are computationally expensive.

Retrieval workloads may be intensive.

Long-running agent workflows may consume resources for extended periods.

Many users may compete for limited model capacity.

Designing systems that scale economically is therefore often just as important as designing systems that scale technically.

However, AI-native systems introduce another dimension.

It is not only the infrastructure that must scale.

**The intelligence itself must scale.**

---

## Scaling the Agent

One way to increase the capability of a system is to make an individual agent more capable.

The agent may be given:

* broader instructions
* more responsibilities
* more tools
* more memory
* more retrieved information
* a larger context
* access to a more capable model

This is a form of **scaling up**.

Scaling up can initially make the architecture appear simpler.

One agent can interpret the request, choose its tools, maintain the context and complete the task without delegating work elsewhere.

There are fewer routing decisions.

There are fewer hand-offs.

There are fewer distributed interactions to coordinate.

For bounded and coherent tasks, this may be entirely appropriate.

But as the agent becomes more capable, it also becomes more complex.

Its prompt grows.

Its context expands.

Its tool catalogue becomes larger.

Its memory requirements increase.

More instructions compete for attention.

The model must distinguish relevant information from everything else it has been given.

This can increase:

* token consumption
* latency
* computational cost
* reasoning ambiguity
* tool-selection errors
* the risk of important information being diluted
* the impact of a single failure

The agent may eventually spend more effort navigating its own context than solving the user's problem.

Scaling up therefore has limits.

A larger context window does not automatically produce better reasoning.

More tools do not automatically produce more useful behaviour.

More memory does not automatically produce greater understanding.

An agent can become more capable while simultaneously becoming less focused, less predictable and harder to evaluate.

---

## Scaling the Agent System

The alternative is to **scale out**.

Instead of creating one increasingly complex agent, the system distributes responsibilities across multiple specialised agents.

Each agent may have:

* a clear goal
* a narrower responsibility
* a smaller context
* access to a limited set of tools
* a more focused behavioural contract

One agent may retrieve knowledge.

Another may evaluate evidence.

Another may identify architectural trade-offs.

Another may check whether a proposed decision conflicts with an existing principle.

This can provide several benefits:

* reduced context size
* clearer responsibilities
* better isolation
* more focused evaluation
* greater opportunities for parallel execution
* smaller failure boundaries
* independent evolution of specialised behaviours

But scaling out is not free.

The complexity does not disappear.

It moves into the architecture surrounding the agents.

The system must now determine:

* which agent should receive a request
* how intent should be classified
* whether one agent or several agents are required
* what context each agent needs
* how context should be transferred
* whether agents should execute sequentially or in parallel
* how conflicting results should be reconciled
* where workflow state should be maintained
* how failure should be recovered
* how the complete reasoning path should be observed

More agents create more routing decisions.

More routing decisions create more opportunities for misclassification.

A request sent to the wrong agent may still produce a convincing response.

That makes routing failures especially difficult to detect.

A multi-agent system also introduces distributed-systems concerns:

* partial failure
* messaging
* coordination
* consistency
* retries
* idempotency
* timeouts
* state management
* observability

This is similar to the trade-off between a larger application and a distributed architecture.

A distributed system can improve scalability and separation of responsibility, but it also introduces operational and coordination overhead.

The same is true of multi-agent systems.

---

## Scaling Up and Scaling Out

The architectural decision is therefore not simply whether agents should be large or small.

Both approaches concentrate complexity in different places.

| Dimension      | Scale Up                          | Scale Out                                |
| -------------- | --------------------------------- | ---------------------------------------- |
| Responsibility | Broader agent responsibility      | Narrower specialised responsibility      |
| Context        | Larger consolidated context       | Smaller distributed contexts             |
| Routing        | Simpler                           | More complex                             |
| Coordination   | Primarily internal                | Explicit orchestration required          |
| Latency        | Fewer hand-offs, larger inference | More hand-offs, potential parallelism    |
| Failure scope  | Larger                            | More isolated                            |
| Observability  | One reasoning path                | Distributed reasoning trace              |
| Cost           | Larger prompts and model calls    | More calls and orchestration overhead    |
| Evolvability   | Responsibilities become coupled   | Agents can evolve independently          |
| Consistency    | Shared context is easier          | Context must be transferred or retrieved |

Scaling up concentrates complexity inside the agent.

Scaling out distributes complexity across the system.

Neither approach is automatically correct.

The appropriate design depends on:

* the coherence of the responsibility
* the amount of context required
* the variability of the task
* the cost of model execution
* the need for isolation
* the need for parallelism
* the acceptable operational complexity
* the consequences of failure

Many systems will use both approaches.

A specialised agent may still need a more capable model or a larger context for a demanding task.

A broader conversational agent may delegate only those activities that require specialist knowledge or independent evaluation.

The goal is not to create the largest possible agent.

It is also not to create the greatest possible number of agents.

The goal is to place complexity where it can be understood, controlled and operated.

---

## Coherence Before Size

A useful principle is that an agent should remain **coherent**.

Its goal, responsibilities, context and tools should naturally belong together.

An agent should not be split merely because smaller agents appear more architecturally sophisticated.

Splitting a coherent responsibility across many agents can create more complexity than it removes.

This is similar to prematurely decomposing a system into microservices.

The services may be individually small, but the overall system becomes dominated by communication, coordination and operational overhead.

The same risk exists with agents.

Every agent boundary may also become:

* a routing boundary
* a context boundary
* a trust boundary
* a failure boundary
* an evaluation boundary
* a probabilistic reasoning boundary

An agent should be split when additional responsibility makes its behaviour harder to:

* understand
* secure
* evaluate
* observe
* operate
* evolve

The important characteristic is not smallness.

It is clarity.

Scalable AI-native architecture is not achieved by building one enormous agent.

Nor is it achieved by creating a swarm of tiny agents.

It is achieved by designing coherent agents within a system capable of coordinating them responsibly.

---

## Observability

Modern distributed systems require observability.

Traditionally, this means collecting:

* logs
* metrics
* traces

AI-native systems require a richer understanding.

We also need visibility into:

* prompt versions
* model selection
* token usage
* context construction
* retrieval quality
* tool calls
* routing decisions
* agent decisions
* workflow execution
* confidence scores
* user feedback
* evaluation results

This becomes particularly important when work is distributed across multiple agents.

A conventional distributed trace may show that Agent A called Agent B.

That is useful, but it is not enough.

We may also need to understand:

* why Agent B was selected
* which intent was identified
* what context was provided
* which information was omitted
* how Agent B reached its conclusion
* whether another agent disagreed
* how the final result was selected

Observability is no longer only about understanding software execution.

It is about understanding intelligent behaviour.

Without that visibility, failures may appear as plausible but incorrect outcomes rather than obvious technical errors.

---

## Evolvability

Technology changes.

AI changes even faster.

A well-designed architecture should make change easier rather than harder.

Relevant characteristics include:

* maintainability
* modularity
* extensibility
* deployability
* versioning
* replaceability

Models will change.

Prompt strategies will change.

Agent frameworks will change.

Retrieval approaches will change.

The boundaries of the system should prevent these implementation choices from becoming inseparable from its architectural intent.

For example, an agent's responsibility should not exist only as an undocumented prompt.

Its purpose, inputs, constraints and expected outcomes should be understandable independently of the model currently implementing it.

Good architecture accepts that today's implementation decisions will almost certainly change.

The important question is whether the system can evolve without losing its intent, integrity or accumulated knowledge.

---

## Operability

Building software is only part of the challenge.

Someone also has to operate it.

Operational characteristics include:

* configuration
* monitoring
* diagnostics
* feature flags
* rollback
* deployment
* runbooks
* capacity management
* incident response

AI-native systems introduce additional operational concerns.

Operators may need to:

* disable a model
* change routing policies
* reduce model usage
* restrict a tool
* pause an agent workflow
* inspect a failed reasoning path
* replay an execution
* replace a prompt version
* compare evaluation results
* intervene in a long-running process

An elegant architecture that cannot be operated effectively is rarely successful.

This becomes even more important as agent systems scale out.

Each additional agent, routing rule and workflow introduces another operational surface.

The architecture must therefore balance logical separation with the practical ability to understand and manage the system as a whole.

---

## Quality Assurance: Testing and Evaluation

This is where AI-native systems begin to diverge from traditional software engineering.

Software engineers are familiar with testing.

We build confidence using:

* unit tests
* integration tests
* contract tests
* end-to-end tests
* performance tests

These answer questions such as:

* Does it work?
* Does it still work?
* Did we break anything?
* Do the components integrate correctly?
* Does the system remain within its performance limits?

Traditional software is largely deterministic.

The same input should produce the same output.

Large language models are different.

They are probabilistic.

Two identical prompts may produce different but equally valid responses.

A workflow may complete successfully while producing a poor answer.

A tool may be called correctly but for the wrong reason.

An agent may choose a plausible path that does not satisfy the user's intent.

Testing alone is therefore no longer sufficient.

---

## Evaluation

Evaluation is not a new concept.

Machine-learning engineers have relied on evaluation for decades.

A machine-learning model may execute perfectly while still producing poor predictions.

Rather than asking only whether the software works, they ask how well the model performs.

Common evaluation measures include:

* accuracy
* precision
* recall
* F1 score
* ROC-AUC
* confusion matrices

These are not implementation tests.

They are measurements of behaviour.

AI-native systems inherit this mindset.

Instead of asking only whether a workflow completed successfully, we must also ask:

* Was the answer correct?
* Was it grounded in trusted information?
* Was the response complete?
* Did the agent understand the user's intent?
* Did it choose the correct tools?
* Was the correct agent selected?
* Did the agents collaborate effectively?
* How confident are we in the outcome?
* Was the behaviour safe?
* Was the cost proportionate to the value produced?

Testing verifies implementation.

Evaluation measures behaviour.

Both are essential.

---

## Evaluating Agent Architectures

Evaluation becomes more complex when responsibility is distributed across multiple agents.

We may need to evaluate not only the final answer, but the architecture that produced it.

For example:

* Did the router identify the correct intent?
* Was the task delegated to the right agent?
* Did each agent receive the context it required?
* Was unnecessary context excluded?
* Did the agents duplicate work?
* Did one agent introduce incorrect information?
* Were conflicting results resolved appropriately?
* Was the overall workflow more effective than using one agent?

A multi-agent system should not be considered successful merely because it contains several specialised agents.

Its additional complexity must produce measurable value.

That value might include:

* better-quality outcomes
* reduced context consumption
* improved isolation
* greater parallelism
* clearer evaluation
* stronger security boundaries
* lower cost
* easier evolution

If scaling out creates more routing errors, latency and operational overhead without improving outcomes, the architecture has become more complicated rather than more capable.

The number of agents is not a measure of architectural maturity.

The effectiveness of their collaboration is.

---

## Capabilities and Evaluation

One question sits underneath every evaluation framework:

**What does success actually look like?**

Traditional software answers this with assertions.

Machine learning uses labelled datasets and metrics.

For AI-native systems, I believe capabilities provide another important layer.

A capability defines:

* the intent
* the expected outcomes
* the policies
* the constraints
* the measures of success

Rather than evaluating whether an agent generated a particular sentence, we evaluate whether it successfully delivered the capability it was attempting to provide.

This becomes especially valuable in a multi-agent architecture.

Several agents may collaborate to deliver one capability.

The user should not need to care which agent performed each step.

The architecture can evaluate individual agent behaviour, routing decisions and workflow execution while still measuring success against the outcome the system exists to deliver.

This is one of the motivations behind the Declarative Capability Language, or DCL.

By explicitly describing what success means, evaluation can move beyond implementation details and focus on business outcomes.

Capabilities provide the semantic foundation upon which meaningful evaluation can be built.

---

## Architecture Is About Qualities

One observation has become increasingly clear as software evolves.

As systems become more intelligent, our definition of quality expands.

We no longer measure only correctness.

We also measure behaviour.

Architecture has always been about balancing competing qualities.

AI-native systems do not replace these concerns.

They amplify them.

Security becomes more complex.

Observability becomes richer.

Reliability becomes more challenging.

Scalability extends from infrastructure into the architecture of intelligence itself.

Testing must be complemented by evaluation.

The fundamentals of architecture remain the same.

Only the systems have changed.

---

## Closing Thoughts

Before designing any architecture, it is worth asking two simple questions.

**What must the system do?**

**What properties must the system possess?**

The first defines its functionality.

The second shapes its architecture.

AI-native systems introduce new implementation techniques, but they do not remove the need for deliberate architectural trade-offs.

A single complex agent may simplify coordination while increasing context, cost and cognitive load.

A collection of specialised agents may improve focus and isolation while introducing routing, orchestration and operational complexity.

Scaling up concentrates complexity inside an agent.

Scaling out distributes complexity across the system.

Architecture determines which form of complexity is easier to control.

Everything else is an implementation decision.

---

### Looking Ahead

In the next episode, we will explore the architectural principles that guide Articulate and why thinking in terms of capabilities, rather than components, provides a stronger foundation for building AI-native systems.
