---
id: adr-0003
title: claims are the fundamental unit of architectural knowledge
summary: Architectural knowledge is represented as claims with provenance, confidence, temporal applicability, and evidence so different architectural views share one source of truth.
status: accepted
related_episodes:
  - 0014-knowledge-evolution
repository_paths:
  - docs/adrs/0003-claims-are-the-fundamental-unit-of-architectural-knowledge.md
---

# ADR-0003 — Claims are the fundamental unit of architectural knowledge

## Status

Accepted

## Context

All architectural knowledge is represented as claims containing provenance, confidence, temporal applicability and supporting evidence. Architectural concepts such as decisions, discoveries and solution designs become aggregates of related claims.


## Decision

The canonical representation of architectural knowledge within the Knowledge Model shall be the claim.

A claim represents a single architectural assertion together with the metadata required to understand and reason about that assertion. Every accepted claim shall retain provenance, confidence, temporal applicability and any supporting evidence necessary to explain why the claim exists.

Architectural concepts such as discoveries, Architecture Decision Records, solution designs and reviews shall be represented as aggregates of related claims rather than as independent knowledge representations.

Specialised architectural views, including structural graphs, technology inventories, governance views and other derived representations, shall be constructed from claims rather than becoming independent sources of truth.

The claim therefore becomes the fundamental unit through which architectural knowledge is captured, evolved and reasoned about.

## Consequences

The Knowledge Model has a single canonical representation for architectural knowledge, simplifying reasoning and knowledge evolution.

Knowledge originating from different sources, including discovery, solution design and architectural decisions, can be represented consistently while retaining source-specific metadata through provenance.

Architectural projections such as graphs, inventories and reports become derived representations rather than authoritative stores, ensuring that all architectural views remain consistent with the underlying knowledge.

Reasoning agents can operate against a common knowledge representation, allowing confidence, evidence, temporal applicability and provenance to be considered consistently regardless of where the knowledge originated.

The Knowledge Service becomes responsible for interpreting, validating and projecting claims into specialised architectural views while preserving claims as the authoritative source of architectural knowledge.

## Rationale

A common unit allows provenance, evidence, confidence and temporal meaning to travel with every
architectural assertion. Reasoning can then compare knowledge from different sources without first
reconciling several incompatible representations of truth.

## Alternatives Considered

### Treat documents as the fundamental unit

Documents preserve useful narrative context, but their assertions are too coarse-grained for
consistent relationship, confidence, temporal and provenance reasoning.

### Give each architectural concept an independent canonical model

Separate canonical models for decisions, discoveries and designs would preserve familiar document
boundaries, but would duplicate reasoning rules and make cross-model consistency harder to maintain.

### Make projections authoritative

Graphs, inventories and reports are valuable views, but treating them as additional sources of
truth would allow derived representations to diverge from the knowledge that produced them.
