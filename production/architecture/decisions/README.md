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
