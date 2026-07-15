# Articulate AI Collaboration Guide

## Purpose

Articulate is an open-source, production-oriented reference architecture exploring AI-native systems.

The objective is not simply to implement features.

Every change should strengthen the architectural narrative and help demonstrate how AI-native systems can be designed, implemented, evolved and operated.

## Principles

Always reason in this order:

Problem

↓

Principles

↓

Capabilities

↓

Architecture

↓

Runtime

↓

## Technology

Do not begin with frameworks or libraries.

## Architectural goals

Prefer solutions that are:

- understandable
- composable
- observable
- evolvable
- production-oriented
- explainable

Avoid unnecessary cleverness.

## Repository philosophy

The repository is both:

- working software
- architectural journal

Documentation is considered a first-class artefact.

Before implementing

Always ask:

- What architectural problem is being solved?
- Is this introducing a new capability?
- Does this belong in an existing runtime component?
- Should this decision be documented as an ADR?
- Will this become an Episode?
- Implementation philosophy

Prefer:

- simple implementations
- explicit boundaries
- clear naming
- incremental evolution

Avoid speculative abstractions.

## Documentation

When introducing significant behaviour consider updating:

- Episode
- ADR
- Architecture diagrams
- README
- Reference documentation