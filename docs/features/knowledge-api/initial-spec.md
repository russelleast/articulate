# Knowledge API — First Vertical Slice Specification

## Purpose

Implement the first thin vertical slice of the Articulate Knowledge API.

The objective is **not** to implement the complete Knowledge Model or Knowledge Evolution architecture.

The objective is to prove that the existing engineering harness, DCL-driven development approach, service boundary, persistence boundary and local runtime architecture work together as a coherent development model.

This implementation must use the repository's established:

> **Plan → Implement → Verify**

workflow.

The engineering harness is considered part of the architecture and must be followed rather than bypassed.

---

# Architectural Objective

The slice should prove the following execution path:

```text
ClaimSimulator
      │
      │ gRPC
      ▼
KnowledgeApi
      │
      ▼
Capture Proposed Knowledge
      │
      ▼
Domain
      │
      ▼
Repository
      │
      ▼
MongoDB
```

The implementation must remain intentionally small.

Do not introduce functionality required by later Knowledge Model capabilities.

---

# Capability

The domain capability being implemented is:

```text
Capture Proposed Knowledge
```

The DCL definition is the architectural source of intent for this capability.

Codex must use the configured **DCL MCP server** to inspect and understand the capability rather than relying on duplicated Markdown representations of the DCL.

The implementation should conform to the intent expressed by the DCL without attempting to expand DCL to describe implementation concerns.

---

# DCL Boundary

The following interpretation of DCL should be applied.

## Shape validation

DCL shapes define the valid input contract for a capability.

Invalid input must therefore fail contract validation before capability behaviour executes.

```text
Incoming Input
      │
      ▼
Contract Validation
      │
      ├── Invalid → Reject
      │
      ▼
Valid Input
      │
      ▼
Capability Behaviour
```

Capability rules must not duplicate validation already expressed by shapes.

## Capability behaviour

Capability rules operate only on valid inputs.

Do not add implementation workarounds to DCL to support behaviour that belongs in application or domain code.

Potential future DCL requirements such as:

* semantic/domain constraints
* richer rule predicates
* capability composition
* additional assurance constructs

are explicitly outside this implementation.

If implementation exposes such requirements, record them as observations rather than expanding the language as part of this work.

---

# Repository Structure

The repository already contains a `src` directory.

Do not introduce another repository-level source folder.

Create the two services beneath the existing `src` directory:

```text
src/
├── KnowledgeApi/
└── ClaimSimulator/
```

The exact internal package structure should be determined during the **Plan** phase and should favour the smallest structure that preserves clear architectural boundaries.

Avoid unnecessary layers, abstractions or directories.

---

# Shared Protobuf Contract

The Knowledge API is exposed through **gRPC**.

Protocol Buffer definitions must exist in a shared repository location rather than being owned by either Python service.

Both:

* `KnowledgeApi`
* `ClaimSimulator`

must consume the same protobuf contract.

The protobuf contract must define the external operation used by the simulator to submit claims.

The external API operation is conceptually:

```text
SubmitArchitecturalClaims
```

This is a transport/API operation.

It must not be treated as the domain capability.

The API operation invokes:

```text
Capture Proposed Knowledge
```

within the Knowledge API.

---

# Naming Convention

Do **not** use `DTO` as a suffix for types, classes, structures or variables.

For example, avoid names such as:

```text
ClaimDto
ProposedKnowledgeDto
SubmitClaimDto
```

Prefer names that describe the actual role of the object, such as:

```text
Claim
ClaimRequest
ProposedKnowledge
SubmitClaimsRequest
```

This convention should also be added to the appropriate repository `AGENTS.md` guidance under `src`.

---

# KnowledgeApi

Create a Python service named exactly:

```text
KnowledgeApi
```

Do not rename it to Knowledge Service or any other variation.

The service must expose its API using gRPC.

---

# KnowledgeApi Responsibilities

The service is responsible only for the following thin slice:

```text
Receive gRPC request
      │
      ▼
Validate contract
      │
      ▼
Invoke Capture Proposed Knowledge
      │
      ▼
Create proposed knowledge
      │
      ▼
Persist proposed knowledge
      │
      ▼
Return success
```

The Knowledge API must not perform architectural reasoning or Knowledge Evolution.

---

# Proposed Knowledge

Incoming claims should be captured as **proposed knowledge**.

The MongoDB collection must be named:

```text
proposed-knowledge
```

The first implementation only needs enough persisted information to demonstrate that a submitted claim has been captured successfully.

Do not attempt to design the complete future Knowledge Model.

Do not create projections or derived representations.

Do not merge proposed knowledge into an authoritative model.

---

# Persistence Boundary

Persistence must be accessed through a clear repository abstraction.

The domain/application behaviour should not directly depend on MongoDB.

The first repository implementation will use MongoDB.

Keep the abstraction minimal.

Avoid speculative repository methods.

The thin slice currently needs only the persistence behaviour required to capture proposed knowledge.

---

# MongoDB

MongoDB must run as part of the local Docker Compose environment.

Use a collection named:

```text
proposed-knowledge
```

Do not introduce:

* graph databases
* vector databases
* search indexes
* event sourcing
* CQRS projections
* additional persistence technologies

as part of this slice.

---

# Dapr

The Knowledge API must run with a Dapr sidecar.

The ClaimSimulator must **not** use Dapr.

Dapr is being introduced here to prove the distributed application runtime architecture without allowing it to become part of the domain model.

---

# Dapr Secrets

The MongoDB connection string must be obtained through the **Dapr Secrets building block**.

The Knowledge API should not contain the MongoDB connection string in application source code.

The Docker Compose environment should provide the local secret-store configuration required for development.

The implementation should preserve the architectural principle that infrastructure configuration is accessed through runtime capabilities rather than embedded within application behaviour.

---

# Observability

Dapr should be configured to use **Zipkin** for initial distributed tracing and observability.

Zipkin must run in the local Docker Compose environment.

The objective is to prove that the local environment provides observable execution.

Do not build a custom observability framework.

Prefer standard Dapr and application instrumentation where appropriate.

---

# KnowledgeApi Python Requirements

The service must use normal Python engineering practices.

Prefer:

* small functions
* clear names
* explicit responsibilities
* straightforward control flow
* minimal dependencies
* dependency inversion at architectural boundaries
* type hints where useful
* simple testable components

Avoid:

* unnecessary frameworks
* premature abstraction
* large service classes
* generic utility modules
* speculative extensibility
* `DTO` naming
* architecture created solely to demonstrate patterns

The implementation should remain easy to understand from reading the source.

---

# KnowledgeApi Environment

The Knowledge API requires:

* `Dockerfile`
* `requirements.txt`
* Python virtual environment support
* gRPC dependencies
* MongoDB client dependencies
* Dapr integration dependencies
* test dependencies

Do not commit the virtual environment itself.

Appropriate virtual-environment directories must be ignored by source control.

---

# KnowledgeApi Tests

Automated tests are required.

The tests should prove the complete Knowledge API application path from the API boundary through persistence.

At minimum, provide coverage proving:

```text
gRPC request
      │
      ▼
contract accepted
      │
      ▼
Capture Proposed Knowledge executed
      │
      ▼
proposed knowledge created
      │
      ▼
repository invoked
      │
      ▼
knowledge persisted
```

Use unit/integration boundaries that make this behaviour clear without over-mocking the system.

The verification harness must be able to execute the tests automatically.

The implementation is not complete unless these tests pass.

---

# ClaimSimulator

Create a second Python service named exactly:

```text
ClaimSimulator
```

Its purpose is to act as an external consumer of the Knowledge API.

It is test-oriented infrastructure rather than a production Articulate service.

---

# ClaimSimulator Responsibilities

The simulator must:

1. Load a scenario.
2. Obtain the claims belonging to that scenario.
3. Connect to the Knowledge API using gRPC.
4. Submit those claims using the shared protobuf contract.
5. Report whether submission succeeded or failed.

It must not access MongoDB directly.

It must not bypass the Knowledge API.

It must not depend on Knowledge API implementation packages.

The shared protobuf contract is the integration boundary.

---

# Claim Scenarios

The simulator should contain a small scenario abstraction.

Conceptually:

```text
Scenario
├── name
├── description
└── claims
```

For the first implementation, provide a scenario containing approximately:

```text
50 generated claims
```

These claims exist to exercise the vertical slice.

They do not need to represent the complete future claim model.

Prefer data that is realistic enough to inspect while remaining simple to generate and understand.

The scenario structure should allow additional future scenarios to be added without redesigning the simulator.

Do not build a scenario framework beyond what is required for this.

---

# ClaimSimulator Tests

No automated unit tests are required for the ClaimSimulator in this slice.

The simulator itself acts as part of the development and verification harness.

---

# ClaimSimulator Environment

The ClaimSimulator requires:

* `Dockerfile`
* `requirements.txt`
* Python virtual environment support
* gRPC dependencies
* generated/shared protobuf support

Do not add Dapr dependencies.

Do not commit the virtual environment.

---

# Docker Compose

Provide or extend the repository Docker Compose environment to run the complete slice locally.

It must contain the required runtime components for:

```text
KnowledgeApi
KnowledgeApi Dapr sidecar
ClaimSimulator
MongoDB
Zipkin
```

Include any Dapr infrastructure components genuinely required by the selected Dapr configuration.

Do not add unrelated platform infrastructure merely because it may be required by later episodes.

---

# Startup Behaviour

A developer should be able to start the environment using the repository's documented development commands.

After startup:

1. MongoDB is available.
2. Zipkin is available.
3. KnowledgeApi is running.
4. The KnowledgeApi Dapr sidecar is running.
5. ClaimSimulator can connect to KnowledgeApi using gRPC.
6. Claims can be submitted.
7. Submitted knowledge appears in the `proposed-knowledge` MongoDB collection.

---

# Explicitly Out of Scope

Do not implement any of the following:

* Knowledge reasoning
* Knowledge Evolution
* Proposal reconciliation
* Proposal assessment
* Proposal merge
* Authoritative Knowledge Model
* AI or LLM integration
* agents
* Dapr Agents
* Dapr Workflows
* durable execution
* human-in-the-loop workflows
* semantic search
* embeddings
* vector databases
* graph databases
* knowledge projections
* event sourcing
* CQRS
* architectural impact analysis
* architectural assurance

These belong to future slices.

---

# Engineering Harness

The existing repository engineering harness must be treated as part of the architecture.

Before implementation Codex must inspect and follow:

* root `AGENTS.md`
* `src/AGENTS.md`
* relevant `.codex` skills
* repository verification scripts
* DCL through the configured DCL MCP server

Do not duplicate architectural context into implementation documentation when an authoritative mechanism already exists.

---

# PIV Workflow

## Plan

Before changing source code:

1. Inspect repository instructions.
2. Inspect the existing `src` structure.
3. Query the DCL capability using the DCL MCP server.
4. Identify the existing verification mechanisms.
5. Determine the minimum set of files and dependencies required.
6. Identify assumptions or architectural decisions introduced by the implementation.
7. Produce an implementation plan.

The plan should explicitly identify:

* API contract
* capability boundary
* domain representation
* repository boundary
* Mongo persistence
* Dapr secret integration
* Zipkin integration
* ClaimSimulator interaction
* test strategy
* Docker Compose changes
* verification steps

Do not begin by generating a large framework or directory hierarchy.

---

## Implement

Implement the approved plan using the smallest architecture that satisfies the specification.

During implementation:

* preserve the DCL capability boundary
* keep gRPC concerns outside the domain behaviour
* keep Mongo concerns behind the persistence boundary
* keep Dapr concerns as infrastructure concerns
* keep ClaimSimulator independent of KnowledgeApi internals
* prefer small and clearly named Python functions
* avoid `DTO` suffixes
* avoid speculative architecture
* do not expand DCL to solve implementation problems

If implementation reveals a possible DCL language enhancement, record it as an observation rather than changing the DCL language as part of this slice.

---

## Verify

Verification must demonstrate the vertical slice rather than only running isolated unit tests.

At minimum:

1. Run repository verification scripts.
2. Run KnowledgeApi automated tests.
3. Build both Docker images.
4. Start the Docker Compose environment.
5. Confirm KnowledgeApi starts successfully.
6. Confirm the Dapr sidecar starts successfully.
7. Confirm Zipkin starts successfully.
8. Confirm MongoDB starts successfully.
9. Run ClaimSimulator.
10. Submit the scenario claims through gRPC.
11. Confirm submissions return success.
12. Confirm the claims were persisted in MongoDB under:

```text
proposed-knowledge
```

13. Confirm no service bypasses the intended architectural boundaries.

Report any failures rather than silently working around them.

---

# Success Criteria

The slice is complete when the repository can demonstrate:

```text
Docker Compose starts
      │
      ▼
ClaimSimulator starts
      │
      ▼
50 claims generated
      │
      ▼
gRPC SubmitArchitecturalClaims
      │
      ▼
KnowledgeApi
      │
      ▼
contract validation
      │
      ▼
Capture Proposed Knowledge
      │
      ▼
repository
      │
      ▼
MongoDB proposed-knowledge
      │
      ▼
success
```

And:

* DCL has driven the capability implementation.
* The DCL MCP server was used as the capability context.
* The shared protobuf contract is used by both services.
* KnowledgeApi runs with a Dapr sidecar.
* MongoDB configuration is obtained through Dapr Secrets.
* Zipkin provides initial observability.
* KnowledgeApi automated tests pass.
* Repository verification passes.
* The implementation follows existing `AGENTS.md` guidance.
* `src/AGENTS.md` records the convention that `DTO` suffixes are not used.
* No unnecessary future Knowledge Model functionality has been introduced.

---

# Architectural Principle for This Slice

The success of this implementation is not measured by how much functionality is produced.

It is measured by whether the smallest useful implementation proves the architectural development model:

```text
Architectural Intent
        │
        ▼
DCL
        │
        ▼
Codex Context
        │
        ▼
Plan
        │
        ▼
Implementation
        │
        ▼
Verification
        │
        ▼
Running Evidence
```

Implementation is evidence.

If that evidence challenges an architectural assumption, capture the learning and evolve the architecture rather than forcing the implementation to conform to an incorrect assumption.
