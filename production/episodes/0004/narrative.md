# Episode 4 – System Characteristics

Hello, and welcome back to the Articulate Journal.

In the last episode, I explained why Articulate is being designed as an AI-native system and what I mean by AI-native architecture.

In this episode, I want to step back for a moment and look at something more fundamental.

**AI-native systems are still systems.**

Every production system is ultimately judged by the same question.

Can people trust it?

That's where system characteristics become important.

There's a huge amount of excitement around AI at the moment. Every week there's a new model, a new framework or another agent platform promising to change the way we build software.

Those advances are genuinely exciting.

But we must not forget the fundamentals of software engineering.

Because once a system is in production, nobody really cares how clever it is if they can't rely on it.

They care whether it's available.

Whether it's secure.

Whether it performs well.

Whether they can trust the answers it produces.

Whether somebody can understand what happened when something goes wrong.

In other words, they care about the characteristics of the system.

Features make a system useful.

Characteristics make it trustworthy.

Before we start exploring runtimes, workflows and multi-agent systems, I think it's worth taking a step back and asking a much simpler question.

**What qualities does every production system need to possess?**

As architects we tend to think about software in two dimensions.

The first is functionality.

What does the system do?

The second is characteristics.

How well does it do it?

One thing that's always fascinated me about architecture is that we rarely choose patterns for their own sake.

We don't choose CQRS because it's fashionable.

We don't choose Event Sourcing because it's interesting.

We don't introduce durable workflows simply because the technology exists.

We choose architectural approaches because they improve characteristics that matter for the problem we're trying to solve.

Every architectural decision is really a trade-off.

Improve one characteristic and another may become more difficult.

Caching improves performance but introduces consistency challenges.

Distributing a system improves scalability while making observability and reliability harder.

Adding autonomous agents may increase flexibility but reduce predictability.

Architecture has never been about finding a perfect design.

It's about deciding which trade-offs are appropriate.

So let's look at some of the characteristics that matter.

The first is trust.

Trust has always been fundamental to software.

Users expect systems to protect their information, respect permissions, record important actions and behave safely.

AI-native systems introduce new questions.

Which models are allowed to access this information?

Which tools can an agent invoke?

Can retrieved information cross security boundaries?

Can we explain why a particular answer was produced?

Can an agent perform an action without human approval?

Security is no longer only about protecting APIs and databases.

It's also about protecting the intelligence operating inside the system.

Being capable of doing something is not the same as being authorised to do it.

Next comes reliability.

Eventually, every production system experiences failure.

A model provider becomes unavailable.

A retrieval service times out.

A tool fails.

A workflow is interrupted.

Reliability isn't about pretending those failures won't happen.

It's about deciding what the system should do when they inevitably do.

Can it retry?

Can it continue using another model?

Can it pause safely and resume later?

Can it ask a human for help?

Or Can it preserve enough state to continue without starting again?

That's what users experience as reliability.

Performance is another characteristic that's becoming increasingly interesting in AI-native systems.

Traditionally we measured things like latency and throughput.

Those still matter.

But AI systems also introduce perceived performance.

Streaming a response often feels much faster than waiting several seconds before anything appears.

At the same time, reasoning itself has become part of the execution path.

Retrieval, calling tools, validation and model inference all contribute to the overall experience.

Optimising one stage doesn't necessarily make the system feel faster.

And performance always needs to be considered alongside cost.

Sometimes a larger model is worth using.

Sometimes a smaller model is more than good enough.

Scalability has also changed.

Cloud-native systems taught us how to scale infrastructure.

AI-native systems introduce another question.

**How do we scale intelligence?**

One option is to build a single increasingly capable agent.

Give it more tools.

More memory.

A larger context.

A more capable model.

At first this seems attractive because everything happens in one place.

But eventually the context grows, the prompt becomes more complicated, tool selection becomes harder and the agent spends more effort managing its own knowledge than solving the problem.

The alternative is to scale out.

Instead of one large agent, we create several specialised ones.

Each has a focused responsibility, a smaller context and a clearer purpose.

That often improves clarity and isolation.

But it introduces another kind of complexity.

Now the architecture has to decide which agent should receive the request.

How context is transferred.

How work is coordinated.

How failures are recovered.

How reasoning is observed across multiple agents.

In other words, scaling out moves complexity from inside the agent into the architecture itself.

Neither approach is automatically right.

Just as with microservices, the goal isn't to create the biggest component or the greatest number of components.

The goal is to place complexity where it can be understood and managed.

That leads to a principle I've started using throughout Articulate.

**Coherence before size.**

An agent should remain coherent.

Its responsibilities, tools and context should naturally belong together.

Splitting an agent simply because smaller agents appear more sophisticated usually creates more problems than it solves.

Observability becomes even more important once intelligence becomes part of the runtime.

Traditional systems give us logs, metrics and traces.

AI-native systems also need us to understand prompts, retrieved knowledge, routing decisions, tools that have been called, reasoning paths, confidence and evaluation results.

When an answer is wrong, knowing that one service called another isn't enough.

We also need to understand why that decision was made.

Another characteristic that becomes increasingly important is evolvability.

Models will change.

Prompt strategies will change.

Frameworks will change.

The architecture shouldn't depend on today's implementation choices.

Responsibilities should remain understandable even if tomorrow's runtime looks completely different.

Operability matters for the same reason.

Somebody has to support these systems.

Operators may need to disable a model, change routing policies, inspect a reasoning path or replay a failed execution.

An elegant architecture that can't be operated effectively rarely succeeds.

Finally, there's one characteristic that I think AI-native systems have brought much more clearly into focus.

Evaluation.

Traditional software engineering gives us testing.

Unit tests.

Integration tests.

Performance tests etc

Those remain essential.

But AI systems introduce probabilistic behaviour.

A workflow can complete successfully and still produce a poor answer.

The software worked.

The behaviour didn't.

Testing tells us whether the implementation functions correctly.

Evaluation tells us whether the system actually achieved its intended outcome.

I think evaluation will become one of the defining characteristics of AI-native systems.

Not because testing becomes less important.

But because trustworthy behaviour becomes just as important as correct execution.

Ultimately, that's what this episode is really about.

AI-native systems introduce new technologies.

New runtimes.

New patterns.

But they don't replace the foundations of software architecture.

They build upon them.

**AI-native systems are still systems.**

They're still judged by their reliability, their security, their scalability, their observability and, above all, whether people can trust them.

Those characteristics don't become less important because intelligence has entered the architecture.

They become even more important.

In the next episode, we'll build on these ideas by looking at the architectural principles that are beginning to shape Articulate, and why thinking in terms of capabilities rather than components provides a stronger foundation for building AI-native systems.