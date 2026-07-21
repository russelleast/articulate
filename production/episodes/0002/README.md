# Episode 0002 Production

Written journal: [`docs/episodes/0002-what-is-articulate.md`](../../../docs/episodes/0002-what-is-articulate.md)

Canonical spoken narrative: [`narrative.md`](narrative.md)

Storyboard, narration segmentation, recording, subtitle preparation and video production must use `narrative.md`. The journal article remains the canonical written representation and is not a narration fallback.

Validate source resolution from the repository root:

```sh
node production/runtime/narrative-source-cli.mjs \
  --episode 0002 \
  --journal docs/episodes/0002-what-is-articulate.md
```

## Rough Cut 01

The first narration-synchronised rough cut reuses the shared Episode renderer, Articulate visual grammar and Companion performance pipeline.

```sh
make episode-0002-rough-cut-01-analyse
make episode-0002-rough-cut-01-validate
make episode-0002-rough-cut-01-render
make episode-0002-rough-cut-01-review
```

The authoritative recording remains unchanged at `ep2-what-is-articulate.wav`. Generated media, manifests and review artefacts are written under `generated/rough-cut-01/` and `output/` using the same conventions as Episodes 0000 and 0001.
