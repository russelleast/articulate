# ADR 0010: Normalise video diagrams through a publication profile

## Status

Accepted

## Context

D2 is the canonical notation for current architectural diagrams and its SVG output is shared with the journal website. The generated document SVGs contain an opaque page, light node colours and renderer-specific support elements. Embedding that output unchanged in the dark Focus Canvas makes the diagram look like a document pasted over the scene.

Changing the D2 source to encode video styling would mix diagram meaning with one publication treatment. Changing the shared website SVG would make the video publication decide the journal presentation. Teaching Focus Canvas composition about D2 colour names would couple the scene renderer to a source notation and obstruct a later PlantUML renderer.

## Decision

Introduce a renderer-neutral `video-dark` diagram publication profile between SVG rendering and Focus Canvas composition:

```text
diagram source
  -> notation renderer
  -> standalone SVG
  -> video-dark publication profile
  -> normalised SVG
  -> Focus Canvas viewport
```

The input contract is a standalone SVG with a positive root `viewBox`. The normalised output:

- declares the profile ID and version on the root SVG;
- has a transparent outer background;
- preserves renderer support semantics such as SVG masks;
- maps presentation colours to named Articulate dark-video roles;
- uses deterministic `xMidYMid meet` composition;
- targets a minimum rendered text size of 18 pixels at 1080p;
- is generated in memory when a registered diagram enters the video runtime.

The profile owns palette, output and padding policy. SVG normalisation owns structural transformation. Focus Canvas composition owns the final viewport. D2 continues to own diagram semantics and initial layout. The committed website SVG remains unchanged.

D2 page removal is the first renderer adapter. A future PlantUML adapter may remove its renderer canvas before using the same profile contract; PlantUML is not introduced by this decision.

## Consequences

- Existing D2 diagrams visually integrate with the Focus Canvas without changing their canonical source or website presentation.
- Video frames no longer inherit an opaque D2 page rectangle.
- Mask whites and other structural SVG colours remain intact while visible diagram colours are normalised.
- Normalisation is deterministic and idempotent, so validation and rendering consume identical diagram data.
- Very dense diagrams may still require semantic simplification or a different D2 layout to meet the 18-pixel readability target; the profile does not make an overfull diagram legible by scaling labels independently of their nodes.
- Adding another notation requires a renderer and, if necessary, a small canvas-removal adapter, not changes to Focus Canvas composition.
