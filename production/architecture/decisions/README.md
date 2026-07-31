# Production Decisions

This directory will hold production-specific architectural decisions when the media system starts making choices that should be preserved.

Examples include:

- selecting an asset storage strategy;
- deciding how generated media is versioned;
- defining the minimum traceability standard;
- choosing whether subtitles are generated, authored or assembled;
- selecting a companion rendering approach;
- introducing executable production automation.

Do not add a decision merely because a template exists. Add one when a choice constrains future production work and would be difficult to infer later.

## Decisions

- [0001: Resolve media through logical asset IDs](0001-logical-media-assets.md)
- [0002: Render through a Visual Grammar profile](0002-render-through-visual-grammar-profile.md)
- [0003: Declarative Scene Timeline](0003-declarative-scene-timeline.md)
- [0004: Separate Companion performance from scene rendering](0004-separate-companion-performance-timeline.md)
- [0005: Declarative Shot Hierarchy](0005-declarative-shot-hierarchy.md)
- [0006: Use D2 sources for reusable architectural diagrams](0006-d2-diagrams-as-reusable-assets.md)
- [0007: Derive draft production timing from recorded audio](0007-recorded-audio-derived-timing.md)
- [0008: Review semantic and visual intent before timeline generation](0008-reviewable-pre-render-production-model.md)
- [0009: Compose episodes from continuous presenter media](0009-continuous-presenter-media.md)
- [0010: Normalise video diagrams through a publication profile](0010-normalise-video-diagrams-through-a-publication-profile.md)
