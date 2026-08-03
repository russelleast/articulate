# Episode 0003 production

Episode 3 asks why intelligence has begun to deserve architectural significance in Articulate. The refreshed production uses the new continuous presenter recording as its media and timing authority and treats AI-native architecture as a hypothesis to test.

## Authoritative inputs

- `narrative.md` — narrative intent and terminology.
- `ep3-narrator.mov` — delivered narration, presenter picture and timeline authority.

## Production model

- Articulate visual grammar v2, following refreshed Episodes 0000–0002.
- One continuous presenter source; embedded audio never restarts at scene boundaries.
- Seventeen narration-derived scenes alternating Narrator, Repository, Diagram, Focus Canvas and Reflection archetypes.
- Four reusable D2 diagrams under `production/diagrams/sources/episodes/0003/`.
- Speech-derived captions corrected for Articulate, AI-native, LLM and architectural terminology.

## Commands

```sh
make episode-0003-presenter-prepare
make episode-0003-presenter-validate
make episode-0003-presenter-render
make episode-0003-presenter-review
make episode-0003-thumbnail
```

The final video and subtitle file are written to `production/episodes/0003/output/episode-0003-final.mp4` and `production/episodes/0003/output/episode-0003-final.srt`.
