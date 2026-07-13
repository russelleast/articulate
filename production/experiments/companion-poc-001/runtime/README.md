# Companion PoC 001 Runtime

This runtime assembles the smallest executable animatic for Companion PoC 001. It keeps Episode 0001 as the canonical source, treats recorded narration as the publishable audio path, and uses a replaceable companion-renderer adapter.

The scene config is `config/poc-scenes.yaml`. It is currently JSON-compatible YAML so the prototype can run without adding a parser dependency.

## Commands

From the repository root:

```sh
make companion-poc-validate
make companion-poc-validate-placeholder
make companion-poc-render
make companion-poc-render-placeholder
make companion-poc-test
```

`companion-poc-render` requires the expected WAV files under `production/experiments/companion-poc-001/inputs/audio/`.

`companion-poc-render-placeholder` uses labelled silent placeholder audio. It is only for validating timing and assembly; it is not publishable narration.

## Required Local Tools

- Node.js;
- FFmpeg and ffprobe for MP4 export and media duration checks.

If FFmpeg is missing, validation can still check source/configuration structure, but rendering will fail with an actionable error.

## Generated Artefacts

- `generated/scenes/` contains deterministic SVG scene frames and transient segment files;
- `generated/subtitles/` contains the generated SRT subtitles;
- `generated/manifests/` contains provenance manifests;
- `runtime/output/` contains rendered MP4 files when FFmpeg is available.

## Companion Renderer

The current renderer is `StaticCompanionRenderer`. It uses the configured crop from the design-system board and records a warning in the manifest. It does not produce lip-sync or mouth animation.

A future renderer can replace it by returning the same adapter result shape described in `adapters/companion-renderer-contract.md`.
