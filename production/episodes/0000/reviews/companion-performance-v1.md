# Episode 0000 Companion Performance v1

## Outcome

The focused Companion Motion + Lip-Sync PoC Revision 004 has been extended into a complete Episode 0000 production candidate without replacing the approved `final-v1` render.

Performance is intentionally limited to the three existing Companion scenes:

- `S001` — welcome;
- `S008` — the Companion model;
- `S012` — closing invitation.

The remaining ten scenes retain the approved visual treatment unchanged.

## Evidence

- Canonical narration duration: `261.848141` seconds.
- Rendered container duration: `261.880000` seconds at 25 fps (frame-grid rounding).
- Output: 1920×1080 H.264 video, 25 fps; mono AAC audio at 44.1 kHz.
- Decoded candidate audio MD5 matches `episode-0000-final-v1.mp4`: `573c2e9aa69c975ceb2d2214822c378c`.
- Sampled non-Companion frames at 20, 45, 120, 205 and 258 seconds are pixel-identical to `final-v1`.
- Runtime test suite: 20 passing.
- Asset registry: 10 assets valid.

## Reproduction

```sh
make episode-0000-companion-performance-render
```

Preparation losslessly extracts the narration for `S001`, `S008` and `S012`, applies deterministic offline signal analysis, and generates scene-relative performance timelines with fixed seeds. The render manifest and provenance record the timelines and facial assets used.

## Review status

Automated and representative-frame QA passed. Full-video human review remains the promotion gate before this candidate can replace `final-v1`.
