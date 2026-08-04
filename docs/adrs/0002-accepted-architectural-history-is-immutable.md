---
id: adr-0002
title: accepted architectural history is immutable
summary: Accepted architectural knowledge is preserved so that later understanding can supersede it without erasing the history needed for explanation and audit.
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0002-accepted-architectural-history-is-immutable.md
---

# ADR-0002 — Accepted architectural history is immutable

## Status

Accepted

## Context

Accepted architectural knowledge must never be overwritten or deleted. New knowledge supersedes previous knowledge, allowing the system to reconstruct historical architectural viewpoints.


## Decision

The Knowledge Model shall preserve accepted architectural history.

Once knowledge has been accepted into the authoritative Knowledge Model, it shall never be modified or deleted in a way that rewrites previously accepted architectural understanding.

Architectural evolution shall occur through the introduction of new knowledge that supersedes or extends existing knowledge rather than replacing it.

Accepted knowledge shall retain sufficient temporal, provenance and baseline information to reconstruct architectural viewpoints at different points in time.

Historical architectural states, current architectural understanding and intended future architecture shall therefore coexist within the Knowledge Model, allowing the system to answer questions about how the architecture has evolved over time without losing previously accepted knowledge.


## Consequences

The Knowledge Model becomes an append-oriented repository of architectural knowledge rather than a mutable store of current state.

New architectural understanding is represented by additional knowledge that supersedes earlier assertions rather than modifying historical records.

Historical architectural viewpoints can be reconstructed using baselines and temporal applicability, enabling comparison between previous, current and future architectures.

Knowledge evolution becomes fully traceable, allowing reasoning agents and users to understand not only the current architecture but also how and why it changed.

Storage requirements will increase over time because accepted knowledge is retained rather than deleted, but this provides complete architectural provenance and supports explainability, auditability and historical reasoning.

## Rationale

Architectural intelligence must be able to explain what was understood at a particular point in
time and why that understanding changed. Preserving accepted history makes that reconstruction
possible and prevents a later interpretation from silently rewriting the evidence used by an
earlier decision.

## Alternatives Considered

### Keep only the current architectural state

Replacing previous knowledge with the latest state would simplify storage, but would remove the
provenance needed for historical reasoning, audit, and explanation.

### Maintain separate manual snapshots

Periodic snapshots could preserve selected states, but they would make history dependent on a
separate process and could not explain every accepted change between snapshots.
