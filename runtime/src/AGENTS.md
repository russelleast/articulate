# Source Engineering Guidance

These instructions apply to source code beneath `runtime/src/`.

## General

- Prefer explicit, understandable implementations.
- Preserve capability and domain boundaries.
- Keep transport, persistence and runtime concerns outside domain logic.
- Generated code must not become the domain model.
- All changes require appropriate automated verification.
- Do not weaken tests or validation to make a change pass.
- Avoid unrelated refactoring.
- Do not use `DTO` as a suffix for types, classes, structures or variables. Name values for their actual role, such as `Claim`, `ClaimRequest` or `ProposedKnowledge`.
- Observability is a first-class architectural concern. New externally accessible capabilities should be instrumented with OpenTelemetry spans that reflect the architectural workflow rather than low-level implementation details.
- OpenTelemetry is the observability standard. Observability backends are replaceable infrastructure and must not leak into application or capability design.

## Python

- Use Python 3.x version defined by the repository.
- Use `uv` for dependency and environment management.
- Python virtual environments are service-local. Each independently deployable Python service owns its own `.venv` and dependency definition. Do not create or use a repository-root Python virtual environment.
- Use `runtime/pyproject.toml` only for genuinely shared runtime Python tooling configuration.
- Commit `uv.lock`.
- Use explicit type annotations.
- Prefer async APIs for network, database, Dapr, model and other I/O-bound paths when the dependency stack supports them. Do not perform blocking I/O in an async event loop; isolate unavoidable blocking SDK calls explicitly and keep async behaviour consistent through the call chain.
- Use bounded concurrency and explicit back-pressure when external resources such as models have limited capacity; avoid uncontrolled fan-out.
- Prefer small functions, explicit data, pure transformations, immutable-style data flow where practical and dependency injection through function parameters over large service classes, deep inheritance or classes used only as namespaces.
- Introduce classes when state, identity, lifecycle or framework integration makes them useful; do not mechanically replace reasonable framework and SDK abstractions.
- Use Pydantic at external validation and configuration boundaries.
- Do not use Pydantic models as domain entities by default.
- Use pytest for tests.
- Use Ruff for formatting and linting.
- Use Pyright for static type checking.

## C#

- Follow repository .NET SDK version.
- Nullable reference types must remain enabled.
- Prefer immutable domain/value types where appropriate.
