---
name: plan
description: Produce a concise, read-only implementation plan for an Articulate repository change. Use before changing source code or contracts, especially when a request affects capabilities, architecture, DCL, APIs, protobuf, tests, or engineering documentation.
---

# Plan

Produce an implementation plan before changing source code.

## Workflow

1. Read the root `AGENTS.md` and every applicable nested `AGENTS.md`.
2. State the problem and identify the capability being introduced or changed.
3. Inspect relevant DCL, ADRs, architecture documentation, and implementation.
4. Inspect affected API and protobuf contracts, including generated artefacts.
5. Identify architectural boundaries, dependencies, compatibility constraints, and affected components.
6. Identify the automated tests and deterministic repository verification commands required.
7. Identify documentation that may need to change and consider whether the decision warrants a new ADR or Episode update.
8. Record assumptions, risks, open questions, and evidence that could invalidate the requested direction.
9. Produce a concise, ordered implementation plan with explicit scope and verification.

Planning is read-only. **Do not modify implementation files while planning.**

If implementation evidence contradicts the requested architecture or capability intent, report the conflict. Do not silently design around it.

The output of this skill is the implementation plan only.

After producing the plan, STOP.

Do not begin implementation.

Wait for explicit user approval before entering the Implement phase.
