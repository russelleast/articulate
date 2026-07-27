# Articulate Media Platform Operations Guide

This document describes the operational workflow for producing media for the Articulate Journal.

Unlike the architectural documentation, this guide focuses on the day-to-day process of creating, reviewing, rendering and publishing episodes.

The written journal is canonical for reading. Its manually adapted `narrative.md` is canonical for spoken production. Video remains a derived representation of the episode.

---

# Guiding Principles

* The journal episode is the source of truth for written content.
* `production/episodes/<episode>/narrative.md` is the source of truth for narration, storyboards, subtitles and video.
* All generated media should remain traceable to the source episode.
* Human review is mandatory before publication.
* Generated assets should be reproducible wherever practical.
* Improvements should be made to the platform, not worked around manually.

---

# Production Workflow

Every episode follows the same lifecycle.

```text
Episode

↓

Production Planning

↓

Asset Generation

↓

Narration

↓

Rendering

↓

Review

↓

Publishing

↓

Retrospective
```

---

# Stage 1 – Complete the Journal Episode

Before any media work begins:

* Episode content is complete.
* Architectural review is complete.
* Grammar and spelling have been checked.
* Internal links are valid.
* Diagrams are complete.
* Code examples compile where applicable.
* Episode metadata is complete.

Deliverable:

* Published Markdown episode (canonical written source).
* Approved `narrative.md` (canonical spoken source).

The normal episode working area is:

```text
production/episodes/<episode>/
|-- narrative.md
|-- storyboard.yaml
|-- scenes/
|-- audio/
`-- output/
```

---

# Stage 2 – Production Planning

Adapt and approve `production/episodes/<episode>/narrative.md`, then generate:

* Production plan
* Narrative-aligned `storyboard.yaml`
* Scene graph
* Narration segmentation and delivery notes
* Asset register

Review:

* Scene flow
* Visual variety
* Companion usage
* Estimated duration
* Technical demonstrations
* Required diagrams

Deliverable:

* Approved production plan.
* Approved spoken narrative.
* Storyboard in which every scene maps to one or more narrative segment ids.

---

# Stage 3 – Asset Preparation

Production assets are requested by logical ID. Before rendering, inspect and validate the shared registry:

```bash
make assets-list
make assets-validate
```

The registry at `production/assets/registry.yaml` identifies the approved asset and its provider. Do not put storage paths in scene or renderer configuration. The current `local` provider resolves files already present in the workspace; `production/cache/` is disposable, ignored local storage for provider-managed copies. It is not a canonical asset store.

Large recordings and renders should remain outside canonical Git content. Record their logical identity, status, checksum and provider location in the registry. Cloud providers and synchronisation are future capabilities and are not part of the current operating procedure.

Required assets may include:

## Companion

* Neutral
* Explaining
* Thinking
* Listening
* Pointing
* Conclusion

## Visuals

* Diagrams
* Architecture sketches
* Whiteboards
* Repository captures
* Website captures
* Code screenshots
* Terminal recordings

## Branding

* Intro
* Outro
* Lower thirds
* Titles
* Episode cards

Validate:

* Correct version
* Correct aspect ratio
* Transparent backgrounds where required
* Consistent visual style

---

# Stage 4 – Narration

Record narration separately from video.

Master recordings should remain unchanged.

Recommended workflow:

1. Record
2. Trim silence
3. Normalise
4. Review
5. Copy into experiment workspace

Never overwrite the master recording.

Episode recording location:

```text
production/episodes/<episode>/audio/
```

Shared narrator references and voice profiles may remain under `production/narrator/`. Recordings used by an episode belong in its production working area or in the logical asset provider recorded by its asset register.

After recording, measure the approved audio, set the storyboard timing authority to `recorded-audio`, and align all scenes to a complete timeline ending at that duration. The recording—not the pre-recording storyboard estimate—owns final timing.

---

# Stage 5 – Rendering

Run:

```bash
make episode-production-validate \
  EPISODE=<episode> \
  JOURNAL=docs/episodes/<written-episode>.md
```

Then run the episode's config-driven renderer validation and render commands. For example:

```bash
node production/runtime/episode-cli.mjs validate --config <episode-render-config.json>
node production/runtime/episode-cli.mjs render --config <episode-render-config.json>
```

Shared asset and renderer checks remain available:

```bash
make assets-validate
```

```bash
make companion-poc-test
```

```bash
make companion-poc-validate
```

```bash
make companion-poc-render-real
```

Outputs should include:

* MP4
* Review frames
* Contact sheet
* Manifest
* Media report
* Subtitles

Generate subtitles and transcripts from the recorded delivery, using `narrative.md` as the intended-text reference. Never copy them from the written journal episode.

---

# Stage 6 – Review

Review every render.

Checklist:

## Visual

* Layout correct
* Companion correctly positioned
* Typography readable
* No clipping
* Safe areas respected
* Transitions smooth
* Branding consistent

## Audio

* Levels correct
* No clipping
* Natural pacing
* Pronunciation correct
* Pauses feel natural

## Technical

* Correct resolution
* Frame rate
* Manifest generated
* Review artefacts generated
* Provenance maintained

---

# Stage 7 – Publication

Prepare:

* Website
* GitHub
* YouTube
* Podcast
* LinkedIn

Generate:

* Thumbnail
* Description
* Chapters
* Transcript
* References
* Tags

Verify all links before publication.

---

# Thumbnail Workflow

Each episode requires one primary thumbnail.

Checklist:

* Companion visible
* Strong episode title
* Dark architectural background
* Consistent typography
* Episode number
* Articulate branding
* One architectural visual element

Avoid:

* Clickbait
* Excessive text
* Bright coloured borders
* Shock expressions
* Misleading imagery

---

# Episode Retrospective

After publication, record:

## What worked

## What didn't

## Production issues

## Runtime issues

## Companion observations

## Viewer feedback

## Improvements for the platform

Retrospectives should improve the production platform, not just the episode.

---

# Runtime Maintenance

Periodically:

* Review technical debt
* Remove obsolete experiments
* Refactor rendering code
* Improve tests
* Improve documentation
* Improve configuration
* Update dependencies

Avoid large refactors during episode production.

---

# Companion Design System

The Companion Design System is versioned independently from episodes.

Changes to:

* appearance
* wardrobe
* lighting
* poses
* motion
* branding

should be reviewed before adoption.

Episodes should not silently mix companion versions.

---

# Versioning

Maintain independent version numbers for:

* Media Platform
* Companion Design System
* Runtime
* Episode

Example:

```text
Media Platform 0.3

Companion Design System 1.1

Episode 0003

Runtime 0.5
```

---

# Troubleshooting

## Render fails

* Run validation.
* Check required assets.
* Check narration.
* Review FFmpeg output.
* Inspect generated SVGs.

## Layout issues

* Inspect review frames.
* Enable layout debug mode.
* Verify safe areas.
* Check companion region.
* Check text wrapping.

## Companion issues

* Confirm correct asset version.
* Confirm transparent PNG.
* Verify aspect ratio.
* Confirm runtime is not using fallback assets.

## Audio issues

* Verify WAV format.
* Check sample rate.
* Review narration timing.
* Re-run validation.

---

# Operational Rules

Always:

* Keep the written journal canonical.
* Preserve traceability.
* Review generated output.
* Commit working states frequently.
* Keep prototype code isolated.
* Improve the platform through iteration.

Never:

* Edit generated output manually when the runtime should be fixed.
* Replace the master narration.
* Publish without review.
* Introduce one-off hacks that bypass the production pipeline.

---

# Future Evolution

The long-term goal is a one-command media compiler capable of producing:

* Journal website
* YouTube video
* Podcast
* Slides
* Social media assets
* Publication metadata

from a single canonical episode while preserving human editorial control.
