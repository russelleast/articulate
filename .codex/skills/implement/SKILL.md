---
name: implement
description: Implement an approved or clearly stated Articulate change plan. Use when changing source code, tests, API or protobuf contracts, generated artefacts, or related engineering documentation after scope and verification expectations are understood.
---

# Implement

Implement the approved or clearly stated plan and leave the repository ready for verification.

## Workflow

1. Read the root `AGENTS.md` and every applicable nested `AGENTS.md`.
2. Treat the plan as the scope boundary. Confirm its intended capability, architectural boundaries, contracts, and verification expectations.
3. Implement the smallest coherent change that satisfies the plan.
4. Preserve capability and architectural boundaries, clear naming, and backwards compatibility unless the plan explicitly changes a contract.
5. Add or update automated tests with the implementation so they demonstrate the intended behaviour.
6. Update protobuf or API contracts only when the planned capability requires it.
7. Regenerate derived artefacts with repository tooling. Never edit generated files manually.
8. Update in-scope engineering documentation when the change requires it.
9. Avoid unrelated refactoring and speculative abstractions.

Do not weaken tests merely to make them pass. Do not suppress static-analysis failures without a documented justification. Do not change architecture because implementation is inconvenient.

Stop and report the evidence if implementation materially invalidates the plan. Do not expand or reinterpret the plan silently.
