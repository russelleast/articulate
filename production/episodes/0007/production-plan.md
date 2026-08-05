# Episode 0007 Production Plan

## Problem

Episode 0007 must explain how architectural information becomes connected, reasoned-over knowledge without introducing storage or graph implementation bias.

## Principles

- The recorded narrator is the timing authority and remains the primary visual focus.
- Existing Articulate archetypes and motion verbs are the complete visual vocabulary.
- Diagrams teach relationships; text supports them.
- Conceptual architecture is kept separate from implementation options.
- Claims expose uncertainty through provenance, confidence, evidence and temporal status.

## Capabilities

- Continuous presenter-led narration
- Narrative-to-recording alignment and publication subtitles
- Progressive evidence and Focus Canvas reveals
- Reusable D2 and PlantUML conceptual diagrams
- Deterministic rendering, review frames and validation
- YouTube thumbnail generation in the established presenter-left style

## Architecture

The episode uses 22 scenes across Narrator, Diagram, Focus Canvas, Repository, Evidence and Reflection archetypes. Thirteen episode-owned diagrams build the conceptual journey from information to Architectural Intelligence. The Knowledge API is shown as the only capability boundary to the Knowledge Model; no database is depicted.

## Runtime

`production/episodes/0007/production/prepare-presenter-v1.mjs` normalises the local Whisper transcript, aligns every scene to the recording, generates subtitles and compiles the renderer contract. The shared diagram and episode runtimes then render deterministic SVG plates, composite the continuous presenter source and generate review artefacts.

## Review gates

- Narration coverage and timing are complete and gap-free.
- Diagram labels remain legible at 1080p.
- The presenter window matches Episodes 0001–0004.
- “Knowledge Model ≠ Knowledge Graph” and the Knowledge API boundary are visually explicit.
- Subtitle range, overlap and line length validation passes.
- Thumbnail remains legible at 320×180 and 160×90.
