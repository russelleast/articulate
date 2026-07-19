# Episode 0000 Thumbnail

Production thumbnail candidates for Episode 0000, "Welcome to the Articulate Journal".

The three compositions reuse the approved Companion v1 asset and the canonical Articulate visual grammar. They are promotional compositions rather than exported episode frames.

## Variants

- A: Companion-led, the primary candidate.
- B: Architecture-led, with the working surface as the main contextual anchor.
- C: Balanced, closest to the Episode 0000 studio language.

All variants use the full headline: `BUILDING AI-NATIVE ARCHITECTURE`.

## Render

```sh
node production/episodes/0000/publication/thumbnail/render-thumbnails.mjs
```

The deterministic source emits:

- three 1280 × 720 PNGs;
- 320 × 180 and 160 × 90 previews;
- editable SVG representations;
- a multi-size comparison contact sheet.

The reusable system is intentionally small: canonical palette, restrained series marker, episode number, Companion asset placement, headline hierarchy and a simplified architectural relationship motif. Future episodes may vary the composition and primary visual story.

## Size review

| Variant | 320 px | 160 px | Finding |
| --- | --- | --- | --- |
| A — Companion-led | Headline and face read immediately | Full phrase remains identifiable; secondary motif recedes appropriately | Strongest primary candidate |
| B — Architecture-led | Working surface and headline remain distinct | Headline survives; Companion becomes a secondary cue | Useful architecture-forward comparison |
| C — Balanced | Strongest connection to the Episode 0000 studio compositions | Headline and face remain recognisable; diagram becomes family texture | Strong alternative with the closest episode continuity |

The full `BUILDING AI-NATIVE ARCHITECTURE` phrase remains strong enough across all three reductions. A shortened `BUILDING AI-NATIVE` comparison was therefore not produced.

The SVGs preserve an editable composition and reference the canonical Companion asset rather than duplicating or regenerating it. Use the render command above for deterministic raster output and review artifacts.
