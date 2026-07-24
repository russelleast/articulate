# Episode 0003 Production

Written journal: [`docs/episodes/0003-why-ai-native-systems.md`](../../../docs/episodes/0003-why-ai-native-systems.md)

Spoken production source: [`narrative.md`](narrative.md)

The existing narrative has been retained unchanged. `storyboard.yaml` is an intentionally incomplete production scaffold: it must be authored from the narrative segment view before full production validation can pass. No recording, timing or renderer configuration exists yet.

Inspect the segments and validate the production contract from the repository root:

```sh
make episode-production-segments \
  EPISODE=0003 \
  JOURNAL=docs/episodes/0003-why-ai-native-systems.md

make episode-production-validate \
  EPISODE=0003 \
  JOURNAL=docs/episodes/0003-why-ai-native-systems.md
```

The second command is expected to report that the storyboard needs at least one narrative-aligned scene until editorial storyboarding is complete. Recorded audio will establish final scene timing later.
