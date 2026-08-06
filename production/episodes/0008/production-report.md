# Episode 0008 Production Report

## Outputs

- `output/episode-0008-final.mp4` — 1920×1080, 30 fps, H.264/AAC, 15:21.97
- `output/episode-0008-final.srt` — 241 British English cues, maximum two lines and 42 characters per line
- `publication/thumbnail/episode-0008-thumbnail.png` — 1280×720 presenter-based YouTube thumbnail

## Visual sequence

The teaching edit moves away from generic evidence lists and uses a different architectural composition for each idea. The opening introduces the connected domains beside the presenter; the messaging-platform answer is constructed as a progressive reasoning path; retrieval and reasoning receive distinct responsibilities; and semantic, graph and structured retrieval are presented as selectors for different question types.

GraphRAG animates a relationship traversal. Each reasoning capability is introduced as its own lens with an example question. Agentic RAG is a feedback loop, the Knowledge Reasoning Layer is built as an architectural boundary, and the reasoning-before-agents path reveals agent behaviour last. The knowledge graph remains a broad network of what is known, while the reasoning map is rendered as the narrower path used to answer one question.

## Reusable assets

The production remains grounded in the registered shared sources under `production/diagrams/sources/reasoning/` and `production/diagrams/sources/knowledge/`. Completed architectural states use the canonical D2 diagrams, including a dedicated GraphRAG traversal; native teaching compositions provide the progressive stages that lead into them. Connectors are geometry-aware: they render only between visible nodes, terminate at node borders and use directional arrowheads. Episode 8 also includes a reproducible presenter preparation/validation pipeline and thumbnail source.

## Validation

- Episode render contract: passed, 14 scenes, 921.954375 seconds, no gaps or overlaps
- Final output: 1920×1080 at 30 fps with 48 kHz stereo audio
- Loudness: −15.8 LUFS integrated, −1.4 dBFS true peak
- Subtitle terminology, range, overlap, cue duration and line limits: passed
- Diagram validation: 47 registered sources passed
- Production runtime tests: 80 passed
- Episode production contract: 193 narrative segments across 14 scenes passed
- Approved narration and conventional narrative copy have identical SHA-256 hashes
- Scene and temporal contact sheets inspected at final resolution
- Thumbnail inspected at 1280×720, 320×180 and 160×90

The global asset-registry validation remains blocked by the pre-existing missing `production/episodes/0001/ep01-narrator.mov`; Episode 8's registered presenter and resolved assets pass episode validation.
