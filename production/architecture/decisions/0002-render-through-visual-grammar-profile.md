# 0002: Render Through a Visual Grammar Profile

Status: accepted

## Context

The Episode 0001 rough-cut renderer combined media assembly with palette, typography, spacing, composition selection, transition handling and scene layout. Some Episode 0001 content was also embedded directly in renderer functions. A future episode would therefore have needed either to inherit Episode 0001's incidental choices or add more conditional rendering logic.

The canonical Visual Grammar defines editorial intent and explicitly avoids becoming a renderer specification. The runtime needs to consume that intent without turning the grammar document into an implementation schema or prematurely migrating the storyboard format.

## Decision

The renderer resolves each existing scene into a presentation plan through a named Visual Grammar runtime profile. The plan identifies the scene archetype, reusable composition strategy and transition semantics. Shared layout primitives interpret the profile's safe area, composition grids, typography, spacing and palette.

The existing `kind`, `transition` and `companion` fields remain a compatibility vocabulary for Episode 0001. They are mapped at the renderer boundary rather than treated as the long-term editorial schema. Unknown kinds and transitions fail validation.

Text layout is a platform capability. Fixed-height boxes vertically centre the complete multiline block, and overflow fails validation rather than clipping or shrinking text. Episode-authored evidence remains in episode configuration.

## Consequences

- Episode presentation content is separated from reusable renderer policy.
- Episode 0001 retains its scene order, timing, editorial structure and Companion placement.
- Grammar policies and composition strategies can evolve without editing media assembly or episode-specific branches.
- Runtime manifests identify the Visual Grammar profile used for a render.
- The renderer still produces static frames and cuts; richer shot progression and motion remain explicit future capabilities.
- A storyboard schema migration is not implied by this decision.
