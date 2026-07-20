# Episode 0001 Thumbnail

Production thumbnail candidates for Episode 0001, “Why Does Articulate Exist?”.

The compositions reuse the published Episode 0000 thumbnail system: the canonical Companion v1 asset, dark Architectural Studio field, paper working surface, restrained rust and blue palette, Articulate brand marker, episode pill and large typographic hierarchy. The dominant motif changes to express Episode 0001's editorial problem: architectural information exists, but architectural understanding remains fragmented.

## Variants

- **A — Fragmented Architecture:** disconnected code, decisions, systems, people and evidence surround the central claim `ARCHITECTURE IS FRAGMENTED` while the Companion anchors the series identity.
- **B — The Missing Architecture:** artefacts connect toward an explicitly incomplete architectural model beneath the question `WHERE DOES ARCHITECTURE LIVE?`.
- **C — Fragmentation to Intelligence:** scattered signals and a coherent knowledge model sit on opposite sides of the Companion beneath the short question `WHY ARTICULATE?`.

## Render

```sh
node production/episodes/0001/publication/thumbnail/render-thumbnails.mjs
```

The deterministic source emits:

- three 1280 × 720 PNGs;
- 320 × 180 and 160 × 90 previews;
- editable SVG representations that reference the canonical Companion asset;
- a multi-size comparison contact sheet including the published Episode 0000 balanced thumbnail.

## Multi-size evaluation

| Variant | 320 px | 160 px | Finding |
| --- | --- | --- | --- |
| A — Fragmented Architecture | Two-line claim, Companion and separated artefacts remain immediate | Claim and Companion remain identifiable; fragments resolve as deliberately disconnected structure | Strongest expression of the episode's central tension |
| B — The Missing Architecture | Question and incomplete central model remain distinct | Question survives; small artefact labels recede while the missing-model silhouette remains | Strong conceptual alternative, but the supporting motif carries more detail |
| C — Fragmentation to Intelligence | Short question and state contrast read clearly | `WHY ARTICULATE?`, Companion and left/right contrast survive | Best title complement, though the editorial problem is less explicit than A |

## Recommendation

Use **Variant A — Fragmented Architecture** as the production thumbnail.

It represents the motivating problem directly rather than summarising the whole episode. Its two-line claim and separated shapes remain recognisable at 160 × 90, while the unchanged Companion, studio field, typography, brand marker and episode pill make it an unmistakable successor to Episode 0000. The thumbnail text adds a concise tension statement, allowing the eventual YouTube title `Why Does Articulate Exist?` to supply the question without duplicating it.

Variant A should be promoted only after the normal publication review gate. The other candidates remain useful editorial comparisons rather than discarded experiments.
