---
id: adr-0004
title: knowledge evolution through staged proposals
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0004-knowledge-evolution-through-staged-proposals.md
---

# ADR-0004 — Knowledge evolution through staged proposals

## Status

Accepted

## Context

Changes do not enter the Knowledge Model directly. All incoming information is staged as proposed knowledge, reconciled, validated and assessed before being merged into the authoritative model.

## Decision

All information entering the Knowledge Model shall first be represented as proposed knowledge within a staging area.

Proposed knowledge shall undergo interpretation, reconciliation, validation and assessment before it can become part of the authoritative Knowledge Model.

Where proposals require human review or additional reasoning, they shall remain durably persisted within the staging area until the proposal reaches a final outcome.

Before merging, proposals shall be revalidated against the current architectural baseline to ensure that changes remain valid if the authoritative Knowledge Model has evolved since the proposal was originally assessed.

Only successfully reconciled and validated proposals may be merged into the Knowledge Model. Direct modification of authoritative knowledge is prohibited.

## Consequences

Knowledge evolution becomes a governed process rather than a direct persistence operation.

All proposed changes follow a consistent lifecycle regardless of whether they originate from discovery, solution design, architectural decisions, reasoning agents or human input.

Long-running reviews and human approval workflows become first-class architectural capabilities, allowing proposals to remain pending without risking loss of context or partial updates.

Revalidation before merge prevents proposals from being accepted against an outdated understanding of the architecture, reducing the risk of introducing inconsistent or conflicting knowledge.

The Knowledge Service becomes responsible for orchestrating the knowledge evolution process, ensuring that the authoritative Knowledge Model can only evolve through controlled, validated and auditable operations.