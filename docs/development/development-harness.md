# Development harness

Articulate uses a small, deterministic engineering loop so that implementation begins with an explicit scope and ends with evidence:

```text
Plan
  ↓
Implement
  ↓
Verify
  ↓
Human review
```

The separation is deliberate:

- **Skills** describe reasoning and repeatable engineering workflows.
- **Scripts** perform deterministic verification and automation.
- **Hooks** enforce deterministic behaviour at useful lifecycle boundaries.

Architectural judgement remains with planning and review. Hooks do not decide whether an ADR is required, whether a service boundary is correct, or whether DCL should change.

## Plan, implement, verify

The `plan` Skill establishes the problem, capability, boundaries, contracts, risks, tests, and documentation impact before source changes. Planning is read-only.

The `implement` Skill uses that plan as its scope boundary, makes the smallest coherent change, and includes tests and required contract or documentation updates.

The `verify` Skill sceptically compares the resulting change with the plan, invokes deterministic checks, inspects test evidence and boundaries, and reports what could not be verified.

## Run verification

From the repository root, run:

```sh
./scripts/verify
```

This is the shared verification entry point for developers, Codex, future CI, and other automation. It invokes applicable repository verifiers for the existing Node site and for future Python, .NET, and protobuf projects.

Language or contract adapters report that they are not configured while their project type is absent. If a relevant project or contract appears without a configured suite, the adapter fails explicitly so the new capability cannot silently escape verification.

The repository Stop hook invokes the same entry point once work reaches completion. It does not run expensive checks after every edit.

## Evolution

CI can call `./scripts/verify` directly when repository-wide implementation CI is introduced. Language-specific adapters should grow by calling repository-configured tools: Python verification is expected to use `uv` and cover formatting, linting, static typing, and pytest; .NET verification should cover restore, build, tests, and configured formatting or analysis; protobuf verification should cover schema validity, generated-code freshness, and compatibility once the repository selects tooling.

Do not add a parallel Codex-only verification path or adopt a task runner merely to wrap these scripts.

> The harness should evolve primarily by adding verification capabilities rather than changing its fundamental development loop.

> Codex consumes the engineering harness; Codex is not the engineering harness.
