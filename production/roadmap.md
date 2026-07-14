# Articulate Media Platform Roadmap (v0.1)

## Vision

Build an AI-assisted publishing platform capable of transforming a canonical journal episode into multiple high-quality media formats while maintaining traceability back to the original source.

The written journal remains the canonical source.

---

# Phase 1 — Proof of Concept (Current)

**Objective**

Prove the end-to-end publishing pipeline.

## Completed

* Production architecture
* Companion Design System
* Character Reference Sheet
* Companion runtime
* Deterministic scene renderer
* FFmpeg integration
* Real narration support
* Scene graph
* Asset manifests
* Review frames
* Provenance
* MP4 generation

## Remaining

* Final layout polish
* Companion motion
* Companion Production Asset Pack v1
* First lip-sync experiment

**Milestone**

Companion PoC 003

---

# Phase 2 — Episode 1 Production

**Objective**

Produce the first publishable episode.

## Deliverables

* Final narration
* Episode storyboard
* Visual assets
* Diagrams
* Whiteboard animations
* Repository footage
* Website footage
* Companion scenes
* Intro animation
* Outro animation
* End screen
* Published YouTube video

**Output**

Episode 0001 Published

---

# Phase 3 — Production Platform

## Production Asset Management

* Versioned companion assets
* Pose library
* Expression library
* Background library
* Motion presets
* Title templates
* Lower thirds
* Disclosure components
* Transition library
* Music library

---

## Rendering Runtime

* Scene renderer
* Motion engine
* Subtitle engine
* Audio processing
* Thumbnail generation
* Multi-resolution export
* Asset validation
* Build manifests
* Incremental rendering

---

## AI Pipeline

Codex

↓

Production plan

↓

Storyboard

↓

Scene graph

↓

Assets

↓

Render

↓

Review

↓

Publish

---

# Phase 4 — Automation

One command should eventually produce every derived artefact.

```text
Episode.md

↓

Media Compiler

↓

YouTube

Podcast

Slides

Website

Social media

GitHub release
```

Human approval remains mandatory before publication.

---

# Production Backlog

## High Priority

### Runtime

* Closing-scene layout
* Companion motion
* Scene transitions
* Improved title sequence
* Intro sting
* Outro sting
* Camera easing
* Subtitle burn-in
* Lip-sync adapter

### Companion

* Neutral
* Explaining
* Thinking
* Listening
* Point Left
* Point Right
* Conclusion

### Visual Language

* Diagram animations
* Background library
* Motion language
* Typography refinement
* Colour consistency
* Safe-area validation

---

## Medium Priority

### Asset Pipeline

* Asset validation
* Automatic PNG optimisation
* Asset metadata
* Version management
* Asset caching

### Rendering

* Incremental scene rendering
* Scene-level rebuilds
* Parallel rendering
* Performance improvements

---

## Low Priority

* Music
* Ambient sound
* Sound effects
* Chapter markers
* Multi-language subtitles

---

# YouTube Strategy

Each episode should have:

* Thumbnail
* Description
* Chapters
* Tags
* Transcript
* Companion links
* GitHub links
* References

---

## Thumbnail Design System

Create a reusable thumbnail style.

Characteristics

* Dark architectural background
* Large episode title
* Strong visual hierarchy
* Companion appears on approximately one-third of the thumbnail
* One architectural visual motif
* Consistent typography
* Episode number
* Articulate branding

Avoid

* Clickbait
* Shock expressions
* Arrows
* Bright coloured borders
* Misleading text

The thumbnail should immediately communicate "AI-native systems architecture".

---

# Production Runbook

Every episode should follow the same workflow.

## 1. Complete Journal Episode

↓

Architectural review

↓

Approval

## 2. Generate Production Plan

↓

Storyboard

↓

Scene graph

↓

Asset register

## 3. Generate Assets

* Diagrams
* Slides
* Companion assets
* Whiteboard visuals
* Repository captures
* Website captures

## 4. Record Narration

* Record
* Trim
* Normalise
* Approve

## 5. Build

* Validate
* Render scenes
* Assemble
* Produce review artefacts

## 6. Review

* Technical review
* Editorial review
* Accessibility review
* Visual review

## 7. Publish

* Website
* GitHub
* YouTube
* Podcast
* LinkedIn

---

# Technical Debt

After Episode 1 is published, schedule a dedicated cleanup sprint.

Objectives

* Refactor runtime
* Remove prototype code
* Remove experimental branches
* Simplify scene generation
* Improve configuration
* Improve test coverage
* Improve documentation
* Improve naming
* Improve developer experience

Avoid adding new features during this sprint.

---

# Success Criteria

The platform is considered successful when producing Episode 10 requires no fundamentally different process than producing Episode 2.

The system should evolve through incremental improvements rather than repeated redesigns.
