# Episode 0003 Production

Written journal: [`docs/episodes/0003-why-ai-native-systems.md`](../../../docs/episodes/0003-why-ai-native-systems.md)

Spoken production source: [`narrative.md`](narrative.md)

The existing narrative has been retained unchanged. Rough Cut 01 uses the approved recording as its timing authority and a narrative-aligned 19-scene storyboard. The episode-owned agent capability diagram remains authored in D2 and is rendered to shared SVG through the production diagram pipeline.

Inspect the segments and validate the production contract from the repository root:

```sh
make episode-production-segments \
  EPISODE=0003 \
  JOURNAL=docs/episodes/0003-why-ai-native-systems.md

make episode-production-validate \
  EPISODE=0003 \
  JOURNAL=docs/episodes/0003-why-ai-native-systems.md
```

Prepare, validate, render and review Rough Cut 01:

```sh
make episode-0003-rough-cut-01-analyse
make episode-0003-rough-cut-01-render
make episode-0003-rough-cut-01-review
```
