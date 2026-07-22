---
episode: 6
title: "AI-Assisted Development: Building Articulate with an AI Coding Agent"
description: "An exploration of the deliberately simple AI-assisted development environment used to build Articulate, and why structured architectural context matters more than increasingly complex prompts."
season: 1
status: current
published: 2026-07-22
date: 2026-07-22
topics:
  - AI-assisted development
  - Context engineering
  - AI coding agents
  - DCL
  - Architecture documentation
  - Human-AI collaboration
repository_paths:
  - docs/episodes/0006-ai-assisted-development.md
  - production/diagrams/sources/episodes/0006/layered-context-model.d2
  - production/diagrams/sources/episodes/0006/architect-review-workflow.d2
---

# Episode 6 – AI-Assisted Development: Building Articulate with an AI Coding Agent

## Introduction


There are countless videos and articles showcasing AI coding workflows, autonomous agents and highly customised development environments. Those approaches are interesting, but they are not the focus of this project.

Articulate is primarily an architectural project. My goal is not to build software as quickly as possible. My goal is to explore what AI-native architecture looks like and to understand how AI can become a collaborative engineering partner.

As a result, I reset my development environment to be intentionally simple.

This episode describes the environment I use today and, more importantly, the architectural thinking behind it.

## The Development Environment

At the time of writing, my primary development environment consists of:

- Visual Studio Code
- Git
- ChatGPT Codex (5.6)
- An AGENTS.md file
- Architecture documentation
- DCL capability models
- The DCL MCP Server

There is nothing particularly revolutionary about this setup. The interesting part is not the tools themselves. The interesting part is the context available to the coding agent.

## Context Is More Important Than Prompts

There is a great deal of discussion around prompt engineering.

While prompts certainly matter, I believe the more important concept is context engineering.

An experienced software engineer makes decisions based on much more than the current source file.

They consider:

- architectural principles
- previous design decisions
- business capabilities
- coding standards
- system boundaries
- quality attributes
- existing implementations

An AI coding agent should be no different. Rather than relying on increasingly complex prompts, I want to provide the agent with structured architectural context. The better the context, the better the decisions.

## A Layered Context Model

As the project evolves, the coding agent receives context from several different layers.

![Layered context model progressing from general coding knowledge through repository and architectural context to repeatable Codex Skills](/diagrams/episode-0006-layered-context-model.svg)

Each layer serves a different purpose.

Together they provide significantly richer context than a prompt alone.

## AGENTS.md

Every repository should explain how work should be performed. For Articulate, AGENTS.md contains information such as:

- coding conventions
- project structure
- architectural guidelines
- development expectations
- repository-specific instructions

This file represents knowledge about how this repository works. It is intentionally practical rather than architectural.

## Architecture Documentation

Architecture documentation provides context that cannot be inferred from the source code.

This includes:

- architectural principles
- quality attributes
- architectural decisions
- system boundaries
- design rationale

Good architecture documentation explains why the system has been designed in a particular way. That context is just as valuable to an AI coding agent as it is to another developer joining the project.

## DCL as Architectural Context

One of the goals of Articulate is to explore capability-driven architecture. Business capabilities are first-class architectural concepts. Rather than describing capabilities purely in natural language, I use DCL (Declarative Capability Language) to model them in a structured form.

DCL is not intended to replace architecture documentation. Instead, it complements it by providing an unambiguous, machine-readable description of architectural intent. As the project evolves, these capability models become another source of context for both humans and AI. Future episodes will explore DCL in much greater depth.

## The DCL MCP Server

Codex is configured to use the DCL MCP Server.

Rather than searching through markdown documentation to understand capabilities, the coding agent can query the capability model directly.

This provides structured information about:

- capabilities
- relationships
- constraints
- architectural intent

The MCP server does not replace documentation. Instead, it provides direct access to architectural knowledge in a form that both humans and AI agents can understand consistently.

## Codex Skills

One feature I have deliberately kept lightweight is the use of Codex Skills. Rather than encoding repository-specific knowledge into Skills, I prefer to reserve them for repeatable engineering behaviours.

For example, one simple Skill reminds the coding agent to consider whether an Architectural Decision Record (ADR) should be created whenever a significant architectural change is made. The Skill does not make architectural decisions.

It simply encourages good engineering discipline by asking questions such as:

- Has the architecture changed?
- Have new architectural boundaries been introduced?
- Has a significant design decision been made?
- Should an ADR be created or updated?

This mirrors the behaviour of an experienced engineer reviewing a pull request rather than an autonomous system attempting to manage the architecture.

## AI as an Engineering Partner

Throughout this series you will notice a consistent pattern. The architect remains responsible for the architecture. The AI assists with implementation.

The workflow is intentionally simple:

![AI-assisted development workflow from architect and capability through DCL and an AI coding agent to implementation and architect review](/diagrams/episode-0006-architect-review-workflow.svg)

AI accelerates implementation. It does not replace architectural judgement. 

## This Environment Will Evolve

The AI tooling landscape changes at an extraordinary pace. By the time you read this, my development environment may already have changed. That is entirely expected. Rather than continually updating this episode, I will introduce new techniques and tooling throughout the series as they become relevant.

If a future episode introduces evaluation harnesses, workflow orchestration, additional Skills or new forms of architectural context, it will be because they solve a real problem encountered while building Articulate.

This project is intended to be an honest engineering journal rather than a static reference architecture.

The architecture will evolve.

The tooling will evolve.

Hopefully, so will my understanding.

## Looking Ahead

With the development environment established, the next episodes can begin exploring the architecture of Articulate itself.

We'll start with the heart of the system: the knowledge model.

Understanding how architectural knowledge is represented, governed and queried is fundamental to understanding how AI-native systems differ from traditional software systems.

Everything that follows builds upon that foundation.
