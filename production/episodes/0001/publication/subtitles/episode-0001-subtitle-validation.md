# Episode 0001 Subtitle Validation

## Timing authority

- Release-candidate video: `production/episodes/0001/output/episode-0001-rough-cut-04.mp4`
- Video SHA-256: `994b53c0c76b7d8aac30122e82c3782635287e950a413285cb68c921f99d1662`
- Encoded duration: `00:09:10,365`
- Subtitle timing was derived from the audio decoded from the release-candidate video.
- The approved narration and canonical journal were used to review wording, spelling and specialist terminology. Recording-specific wording was retained where it differs from the journal.

## Transcription and review

- A task-local `whisper.cpp` English model produced the initial transcript and word timings; no transcription runtime or model was added to the repository.
- The transcript was reviewed against the canonical journal for terminology including Articulate, Infrastructure as Code, ADRs, Confluence, Git, Terraform, Mermaid, PlantUML and C4.
- Obvious recognition errors were corrected while spoken contractions and the recording-only closing passage were preserved.
- The SRT text matches the reviewed transcript word for word.

## Structural validation

| Check | Result |
| --- | --- |
| UTF-8 encoding | Pass |
| Sequential numbering | Pass — 142 cues |
| SRT timestamp syntax | Pass |
| Chronological ordering | Pass |
| Negative timestamps | None |
| End before start | None |
| Overlaps | None |
| More than two lines | None |
| Maximum line length | 42 characters |
| Cue duration range | 1.630–6.990 seconds |
| First cue | `00:00:00,000` |
| Final cue | `00:09:06,535` |
| Beyond video duration | None — 3.830 seconds of closing hold remain |

FFmpeg successfully parsed the SRT and muxed all cues into a temporary copy of the release-candidate video. The resulting subtitle stream ended at `00:09:06,535`, while the copied video and audio ended at `00:09:10,365`. The installed FFmpeg build does not include the `subtitles`/libass filter, so a burned-in overlay was not produced.

## Output checksums

- `episode-0001-en.srt`: `31424f6f3af2a40f817fe4e48e727b192f1f8772ee2755b81a5acd495bc1e6f1`
- `episode-0001-transcript.txt`: `62ed23d5e983f8b5648ee91f7a24d773b6edd5a16f6295a4b7f2c5ca0e146711`
