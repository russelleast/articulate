# Episode 4 — System Characteristics: The Properties Every System Needs

*AI-native systems still need to be systems.*

One of the risks when discussing AI-native architecture is becoming so focused on models, prompts and agents that we forget the fundamentals of software engineering.

Whether you're building a banking platform, an e-commerce application or an AI assistant, every production system is ultimately judged by the same question:

**Can people trust it?**

Before we explore runtime architectures, workflows and multi-agent systems, it's worth taking a step back to look at the characteristics that make any system successful. These characteristics aren't unique to AI—they've always been part of good architecture—but AI-native systems place new demands on many of them.

---

## Functionality versus Characteristics

As architects, we think about software in two dimensions.

The first is **functional behaviour**.

What does the system do?

The second is **system characteristics**.

How well does the system do it?

A user might ask an AI assistant to design a solution architecture. That is functionality.

Whether the response is secure, reliable, observable, performant and trustworthy are system characteristics.

These qualities often determine whether a system succeeds in production, regardless of how impressive its features are.

---

## Why Architects Care

One of the biggest lessons I've learned throughout my career is that architectural patterns rarely exist for their own sake.

We don't choose CQRS because it's fashionable.

We don't adopt event sourcing because it's interesting.

We choose architectural patterns because they improve one or more system characteristics.

| Pattern | Primarily Improves |
|----------|--------------------|
| CQRS | Scalability, performance |
| Event Sourcing | Auditability, reliability |
| Workflow Engines | Reliability, recoverability |
| Actor Models | Scalability, resilience |
| Caching | Performance |
| Circuit Breakers | Reliability |
| RAG | Accuracy and groundedness |
| Observability Platforms | Operability |

Architecture is fundamentally about making trade-offs to achieve the qualities that matter most.

---

# Trust

Trust is the foundation of every production system.

For traditional applications this includes:

- Authentication
- Authorisation
- Auditability
- Privacy
- Compliance
- Security

AI-native systems introduce additional concerns.

Questions become:

- Which models can this user access?
- What data can be included in prompts?
- Can prompts leak sensitive information?
- Are tools being called with appropriate permissions?
- Can generated responses be audited?

Security is no longer just about protecting APIs.

It's also about protecting intelligence.

---

# Reliability

Reliability answers a simple question:

Can users depend on the system?

This includes:

- Availability
- Fault tolerance
- Resilience
- Disaster recovery
- Graceful degradation
- Recoverability

This becomes especially important in AI-native systems where external models may timeout, rate limit requests or become temporarily unavailable.

Good AI-native systems should continue operating even when parts of their intelligence are unavailable.

---

# Performance

Performance is about far more than response times.

It includes:

- Latency
- Throughput
- Resource utilisation
- Cost efficiency
- Streaming responses
- Parallel execution

Interestingly, AI-native systems often optimise **perceived performance** rather than absolute performance.

A streamed response that begins immediately often provides a better user experience than waiting several seconds for a complete answer.

---

# Scalability

Scalability is the ability to continue operating effectively as demand increases.

This includes:

- Horizontal scaling
- Queue-based workloads
- Distributed workflows
- Multi-tenancy
- Vector search
- Model serving
- Background processing

AI workloads are computationally expensive.

Designing systems that scale economically is often just as important as designing systems that scale technically.

---

# Observability

Modern distributed systems require observability.

Traditionally this means collecting:

- Logs
- Metrics
- Traces

AI-native systems require a richer understanding.

We also need visibility into:

- Prompt versions
- Model selection
- Token usage
- Tool calls
- Retrieval quality
- Agent decisions
- Workflow execution
- Confidence scores
- User feedback
- Evaluation results

Observability is no longer just about understanding software.

It's about understanding intelligent behaviour.

---

# Evolvability

Technology changes.

AI changes even faster.

A well-designed architecture should make change easier rather than harder.

Characteristics include:

- Maintainability
- Modularity
- Extensibility
- Deployability
- Versioning
- Replaceability

Good architecture accepts that today's implementation decisions will almost certainly change.

---

# Operability

Building software is only part of the challenge.

Someone also has to operate it.

Operational characteristics include:

- Configuration
- Monitoring
- Diagnostics
- Feature flags
- Rollback
- Deployment
- Runbooks

An elegant architecture that cannot be operated effectively is rarely successful.

---

# Quality Assurance: Testing and Evaluation

This is where AI-native systems begin to diverge from traditional software engineering.

Software engineers are familiar with testing.

We build confidence using:

- Unit tests
- Integration tests
- Contract tests
- End-to-end tests
- Performance tests

These answer questions like:

- Does it work?
- Does it still work?
- Did we break anything?

Traditional software is largely deterministic.

The same input should produce the same output.

Large language models are different.

They are probabilistic.

Two identical prompts may produce different—but equally valid—responses.

Testing alone is no longer sufficient.

---

## Evaluation

Evaluation is not a new concept.

Machine Learning engineers have relied on evaluation for decades.

A machine learning model may execute perfectly while still producing poor predictions.

Rather than asking whether the software works, they ask how well the model performs.

Common evaluation measures include:

- Accuracy
- Precision
- Recall
- F1 Score
- ROC-AUC
- Confusion Matrices

These aren't tests.

They are measurements of behaviour.

AI-native systems inherit this mindset.

Instead of only asking whether the workflow completed successfully, we also ask questions such as:

- Was the answer correct?
- Was it grounded in trusted information?
- Was the response complete?
- Did the agent choose the correct tools?
- Did it satisfy the user's intent?
- How confident are we in the outcome?
- Was the behaviour safe?

Testing verifies implementation.

Evaluation measures intelligence.

Both are essential.

---

# Capabilities and Evaluation

One question sits underneath every evaluation framework:

**What does success actually look like?**

Traditional software answers this with assertions.

Machine learning uses labelled datasets and metrics.

For AI-native systems, I believe capabilities provide another important layer.

A capability defines:

- The intent
- The expected outcomes
- The policies
- The constraints
- The measures of success

Rather than evaluating whether an agent generated a specific sentence, we evaluate whether it successfully achieved the capability it was attempting to deliver.

This is one of the motivations behind the Declarative Capability Language (DCL).

By explicitly describing what success means, evaluation can move beyond implementation details and focus on business outcomes.

Capabilities provide the semantic foundation upon which meaningful evaluation can be built.

---

# Architecture Is About Qualities

One observation has become increasingly clear as software evolves.

As systems become more intelligent, our definition of quality expands.

We no longer measure only correctness.

We also measure behaviour.

Architecture has always been about balancing competing qualities.

AI-native systems don't replace these concerns.

They amplify them.

Security becomes more complex.

Observability becomes richer.

Reliability becomes more challenging.

Testing becomes evaluation as well.

The fundamentals of architecture remain the same.

Only the systems have changed.

---

## Closing Thoughts

Before designing any architecture, it's worth asking two simple questions.

**What must the system do?**

**What properties must the system possess?**

The first defines its functionality.

The second defines its architecture.

Everything else is an implementation detail.

---

### Looking Ahead

In the next episode, we'll begin exploring the architectural principles that guide Articulate and why thinking in terms of capabilities—rather than components—provides a stronger foundation for building AI-native systems.