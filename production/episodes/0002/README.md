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
