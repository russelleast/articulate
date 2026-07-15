# Articulate Media Platform Roadmap

## Vision

Build an AI-assisted publishing platform capable of transforming a
canonical Articulate Journal episode into multiple high-quality media
formats while maintaining traceability back to the original source.

The written journal remains the canonical source.

The platform is an enabling capability, not the product. Platform
evolution should be driven by genuine production needs discovered while
creating episodes.

The long-term goal is not simply automation. It is to establish a
recognisable production language that allows architectural ideas to
unfold clearly over time.

------------------------------------------------------------------------

# Phase 1 --- Production Pipeline Proof

**Status: Complete**

## Objective

Prove that a canonical journal episode can be transformed into a
deterministic, narrated video through a reproducible production
pipeline.

## Completed

### Production Architecture

-   Production architecture
-   Companion Design System
-   Character Reference Sheet
-   Companion runtime
-   Deterministic scene renderer
-   FFmpeg integration
-   Real narration support
-   Scene graph
-   Asset manifests
-   Review frames
-   Contact sheets
-   Provenance
-   MP4 generation

### Editorial Runtime

-   Narration-derived scene timing
-   Synchronised storyboards
-   Visual Grammar
-   Scene archetypes
-   Reusable layout primitives
-   Declarative scene timeline
-   Progressive visual reveals
-   Directional diagram connectors
-   Deterministic timeline-to-frame resolution
-   Render manifests
-   Timeline observability
-   Reproducible rendering

## Outcome

Episode 0001 Rough Cuts 01 and 02 proved that the complete production
pipeline works.

The platform can reliably transform:

``` text
Canonical Journal
        ↓
Narration
        ↓
Storyboard
        ↓
Declarative Scene Timeline
        ↓
Visual Grammar
        ↓
Deterministic Renderer
        ↓
Review Artefacts
        ↓
Video
```

The remaining challenge is no longer proving that an episode can be
rendered.

The challenge is establishing what a production-quality Articulate
episode should look and feel like.

------------------------------------------------------------------------

# Phase 1.5 --- Visual Production Baseline

**Status: Current**

## Objective

Define and prove the production-quality visual language of the
Articulate Journal before attempting to polish an entire episode.

The milestone is not another complete rough cut.

The milestone is a short sequence that demonstrates **what good looks
like**.

## Production Quality Prototype

Produce a polished 30--60 second reference sequence containing:

-   the Companion;
-   a recognisable Articulate environment;
-   natural Companion motion;
-   progressive visual construction;
-   an active whiteboard or architectural workspace;
-   directional architecture diagrams;
-   purposeful transitions;
-   production-quality typography;
-   final-style composition;
-   narration-synchronised visual events.

The sequence should be good enough to act as the visual benchmark for
all subsequent production.

## Environment System

Create a small, reusable visual world rather than designing unrelated
backgrounds for individual scenes.

### Architectural Studio

The primary home of the Companion.

Used for:

-   introductions;
-   conclusions;
-   reflection;
-   major narrative transitions;
-   direct audience engagement.

The environment should establish a recognisable Articulate identity
without competing with the content.

### Architectural Whiteboard

The primary explanation environment.

Used for:

-   progressively constructing ideas;
-   drawing relationships;
-   architecture diagrams;
-   capability models;
-   causal explanations;
-   comparing alternatives.

The Companion should be able to occupy the environment while the working
surface develops alongside the narration.

### Digital Workspace

The evidence and implementation environment.

Used for:

-   repository captures;
-   journal content;
-   DCL;
-   source code;
-   ADRs;
-   terminal sessions;
-   website demonstrations;
-   architectural artefacts.

Computer-style typing and document construction may be used here where
appropriate.

### Focus Canvas

Used when a diagram or visual needs the viewer's full attention.

The environment should recede naturally rather than cutting to a
visually unrelated presentation slide.

## Companion Motion v1

The Companion should move from being a static production asset to having
a restrained sense of presence.

Implement progressively:

``` text
Idle motion
    ↓
Natural blinking
    ↓
Subtle breathing
    ↓
Small head movement
    ↓
Directional gaze
    ↓
Posture changes
    ↓
Simple contextual gestures
```

Motion should remain calm and purposeful.

The objective is not to create a highly animated character.

The objective is to prevent the Companion from feeling like a static
image placed on top of a presentation.

## Companion Production Asset Pack v1

Create reusable production assets for:

-   Neutral
-   Explaining
-   Thinking
-   Listening
-   Point Left
-   Point Right
-   Conclusion

Assets should support different framing and screen direction where
useful.

The Companion should increasingly behave as the guide through the visual
environment rather than simply appearing between diagrams.

## Visual Language Refinement

Complete the first production-quality implementation of:

-   diagram animations;
-   progressive diagram construction;
-   directional connectors with arrowheads;
-   background environments;
-   motion language;
-   typography refinement;
-   colour consistency;
-   safe-area validation;
-   scene transitions;
-   camera easing;
-   composition rules.

Visuals should develop alongside the narration rather than presenting
completed information at the beginning of a scene.

The governing principle is:

> Motion communicates understanding.

## Lip-Sync Experiment

Lip-sync remains an experiment rather than a prerequisite for Companion
motion.

Only after natural Companion motion exists:

1.  Select one representative Companion scene.
2.  Preserve narration, timing, environment and composition.
3.  Produce two versions:

``` text
Animated Companion without lip-sync

vs.

Animated Companion with lip-sync
```

4.  Compare both versions.

Adopt lip-sync only if it materially improves the viewing experience.

## Phase 1.5 Milestone

**Articulate Production Quality Baseline v1**

The milestone is complete when a short sequence demonstrates a visual
standard that can confidently be applied to future episodes.

------------------------------------------------------------------------

# Phase 2 --- Initial Episode Production

## Objective

Apply the established production language to the first published
Articulate Journal videos.

## Episode 0000 --- Welcome to the Articulate Journal

Episode 0000 acts as the video equivalent of the written journal
preface.

It introduces:

-   the Articulate Journal;
-   the purpose of the journey;
-   the nature of the architectural exploration;
-   building and learning in public;
-   the Companion;
-   what viewers should expect from future episodes.

Episode 0000 should be primarily Companion-led and becomes the first
substantial application of the production-quality presenter and
environment model.

### Deliverables

-   canonical Episode 0000 script;
-   final narration;
-   storyboard;
-   Companion scenes;
-   Architectural Studio scenes;
-   Whiteboard scenes where appropriate;
-   intro;
-   outro;
-   end screen;
-   captions;
-   YouTube publication assets.

### Output

**Episode 0000 Published**

## Episode 0001 --- Why Does Articulate Exist?

Return to Episode 0001 after the visual production baseline and Episode
0000 have established the production language.

The existing narration, storyboard, rough cuts and editorial review
provide the starting point.

### Production Work

-   detailed scene-by-scene editorial revision;
-   increased Companion usage where it strengthens continuity;
-   progressive narration-synchronised visuals;
-   architectural environments;
-   whiteboard sequences;
-   improved diagrams;
-   repository footage;
-   website footage;
-   knowledge-model visuals;
-   visual evidence;
-   final transitions;
-   final narration mastering;
-   intro and outro;
-   end screen.

Internal journal sections should generally remain production metadata
rather than appearing as explicit section cards.

### Output

**Episode 0001 Published**

------------------------------------------------------------------------

# Phase 3 --- Production Platform

## Objective

Turn the capabilities proven through Episodes 0000 and 0001 into a
reusable production platform.

Do not build these capabilities speculatively.

Promote repeated production solutions into platform capabilities only
after their value has been demonstrated.

## Production Asset Management

-   Versioned Companion assets
-   Pose library
-   Expression library
-   Background library
-   Motion presets
-   Title templates
-   Lower thirds
-   Disclosure components
-   Transition library
-   Music library

## Rendering Runtime

-   Scene renderer
-   Declarative scene timeline
-   Visual Grammar runtime
-   Motion engine
-   Subtitle engine
-   Audio processing
-   Thumbnail generation
-   Multi-resolution export
-   Asset validation
-   Build manifests
-   Incremental rendering
-   Scene-level rebuilds
-   Parallel rendering

## Production Pipeline

``` text
Canonical Journal
        ↓
Production Plan
        ↓
Storyboard
        ↓
Narration Timing
        ↓
Scene Graph
        ↓
Declarative Scene Timelines
        ↓
Asset Resolution
        ↓
Visual Grammar
        ↓
Render
        ↓
Review
        ↓
Human Approval
        ↓
Publish
```

AI can assist at every stage.

Human editorial approval remains mandatory.

------------------------------------------------------------------------

# Phase 4 --- Multi-Format Automation

## Objective

Allow the canonical journal to drive multiple derived media formats
without making the derived formats canonical themselves.

Eventually:

``` text
Episode.md
        ↓
Media Compiler
        ↓
        ├── Video
        │   ├── YouTube
        │   ├── Social clips
        │   └── Promotional assets
        ├── Podcast
        ├── Slides
        └── Website
```

One production command should eventually be capable of generating every
derived artefact required for review.

Publication remains a separate, human-approved action.

------------------------------------------------------------------------

# Production Backlog

## High Priority --- Current

### Visual Production Baseline

-   Architectural Studio environment
-   Architectural Whiteboard environment
-   Digital Workspace environment
-   Focus Canvas
-   Production-quality reference sequence

### Companion

-   Companion motion v1
-   Natural idle movement
-   Blinking
-   Head movement
-   Directional gaze
-   Contextual gestures
-   Companion Production Asset Pack v1
-   First controlled lip-sync experiment

### Visual Language

-   Diagram animations
-   Progressive visual construction
-   Directional connectors
-   Background library
-   Motion language
-   Typography refinement
-   Colour consistency
-   Safe-area validation

### Runtime

-   Scene transitions
-   Camera easing
-   Improved title sequence
-   Closing-scene layout
-   Intro sting
-   Outro sting
-   Subtitle burn-in
-   Audio mastering pipeline

## Medium Priority

### Asset Pipeline

-   Asset validation improvements
-   Automatic PNG optimisation
-   Asset metadata
-   Version management
-   Asset caching

### Rendering

-   Incremental scene rendering
-   Scene-level rebuilds
-   Parallel rendering
-   Performance improvements

## Experimental

-   Lip-sync adapter
-   Advanced gestures
-   More sophisticated character animation
-   Dynamic camera choreography
-   Advanced diagram animation

Experimental capabilities should be adopted only when they materially
improve architectural communication.

## Low Priority

-   Music
-   Ambient sound
-   Sound effects
-   Chapter markers
-   Multi-language subtitles

------------------------------------------------------------------------

# YouTube Strategy

Each published episode should have:

-   thumbnail;
-   description;
-   chapters;
-   tags;
-   transcript;
-   Companion links;
-   GitHub links;
-   references.

------------------------------------------------------------------------

# Thumbnail Design System

Create a reusable thumbnail style.

## Characteristics

-   dark architectural background;
-   large episode title;
-   strong visual hierarchy;
-   Companion occupying approximately one-third of the thumbnail;
-   one architectural visual motif;
-   consistent typography;
-   episode number;
-   Articulate branding.

Avoid:

-   clickbait;
-   shock expressions;
-   arrows;
-   bright coloured borders;
-   misleading text.

The thumbnail should immediately communicate:

> AI-native systems architecture.

------------------------------------------------------------------------

# Production Runbook

Every episode should follow the same fundamental workflow.

## 1. Complete Canonical Journal Episode

``` text
Journal
    ↓
Architectural Review
    ↓
Editorial Approval
```

## 2. Create Production Plan

``` text
Storyboard
    ↓
Narration Plan
    ↓
Scene Graph
    ↓
Asset Register
```

## 3. Produce Narration

``` text
Record
    ↓
Review
    ↓
Trim
    ↓
Master
    ↓
Approve
```

The approved narration becomes the timing authority.

## 4. Build Visual Story

``` text
Narration Timing
    ↓
Scene Boundaries
    ↓
Editorial Intent
    ↓
Scene Timelines
    ↓
Visual Assets
```

## 5. Generate and Capture Assets

-   diagrams;
-   whiteboard visuals;
-   Companion assets;
-   repository captures;
-   website captures;
-   architectural environments;
-   evidence.

## 6. Build

-   validate;
-   resolve assets;
-   resolve timelines;
-   render scenes;
-   assemble;
-   generate provenance;
-   produce review artefacts.

## 7. Review

-   technical review;
-   editorial review;
-   accessibility review;
-   visual review;
-   full continuous playback review.

Editorial findings should change the storyboard and production plan
before they change the platform.

## 8. Publish

-   website;
-   GitHub;
-   YouTube;
-   podcast;
-   LinkedIn.

------------------------------------------------------------------------

# Technical Debt

After Episode 0001 is published, schedule a dedicated cleanup sprint.

## Objectives

-   refactor runtime;
-   remove prototype code;
-   remove experimental branches;
-   simplify scene generation;
-   consolidate capabilities proven during production;
-   improve configuration;
-   improve test coverage;
-   improve documentation;
-   improve naming;
-   improve developer experience.

Avoid adding new production features during this sprint.

------------------------------------------------------------------------

# Success Criteria

## Platform Success

The platform is successful when producing Episode 0010 requires no
fundamentally different process from producing Episode 0002.

The system should evolve through incremental improvements rather than
repeated redesigns.

## Production Language Success

The visual language is successful when a frame from Episode 0010 is
immediately recognisable as belonging to the Articulate Journal without
needing to see the logo.

## Editorial Success

The viewer should feel that architectural ideas are being developed and
explored with them, rather than being presented as a sequence of
completed slides.

## Architectural Principle

The media platform is not the product.

The platform enables the product.

Episode production drives platform evolution, and every new platform
capability should ultimately make architectural ideas clearer, more
engaging, or easier to produce consistently.
