# Episode 0007 — The Knowledge Model

This working area contains the presenter-led production of Episode 0007.

The approved spoken source is `narrative.md`; `ep07-narrator.mov` is the timing authority. Episode-specific diagram sources and their generated SVG assets live under `production/diagrams/sources/episodes/0007/`.

Prepare, validate and render:

```sh
node production/episodes/0007/production/prepare-presenter-v1.mjs
node production/runtime/episode-cli.mjs validate --config production/episodes/0007/episode.json
node production/runtime/episode-cli.mjs render --config production/episodes/0007/episode.json
node production/episodes/0007/production/validate-presenter-v1.mjs
```
