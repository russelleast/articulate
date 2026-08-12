# Source Engineering Guidance

These instructions apply to source code beneath `src/`.

## General

- Prefer explicit, understandable implementations.
- Preserve capability and domain boundaries.
- Keep transport, persistence and runtime concerns outside domain logic.
- Generated code must not become the domain model.
- All changes require appropriate automated verification.
- Do not weaken tests or validation to make a change pass.
- Avoid unrelated refactoring.
- Do not use `DTO` as a suffix for types, classes, structures or variables. Name values for their actual role, such as `Claim`, `ClaimRequest` or `ProposedKnowledge`.

## Python

- Use Python 3.x version defined by the repository.
- Use `uv` for dependency and environment management.
- Use `pyproject.toml` as the canonical project configuration.
- Commit `uv.lock`.
- Use explicit type annotations.
- Use Pydantic at external validation and configuration boundaries.
- Do not use Pydantic models as domain entities by default.
- Use pytest for tests.
- Use Ruff for formatting and linting.
- Use Pyright for static type checking.

## C#

- Follow repository .NET SDK version.
- Nullable reference types must remain enabled.
- Prefer immutable domain/value types where appropriate.
