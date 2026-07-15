# Companion PoC 001 Runtime

This runtime assembles the smallest executable animatic for Companion PoC 001. It keeps Episode 0001 as the canonical source, treats recorded narration as the publishable audio path, and uses a replaceable companion-renderer adapter.

The scene config is `config/poc-scenes.yaml`. It is currently JSON-compatible YAML so the prototype can run without adding a parser dependency.

## Commands

From the repository root:

```sh
make companion-poc-validate
make companion-poc-validate-placeholder
make companion-poc-render
make companion-poc-render-real
make companion-poc-render-reference-fallback
make companion-poc-render-layout-debug
make companion-poc-render-placeholder
make companion-poc-test
```

`companion-poc-render` and `companion-poc-render-real` request `episode-0001-narration-v1` through the media asset manager, prepare an experiment-local WAV, and render the real-audio animatic.

Normal real-audio renders require `companion-v1-neutral`. The reference-sheet asset is only available through `companion-poc-render-reference-fallback` for temporary layout validation. Physical locations are defined by `production/assets/registry.yaml`, not by this renderer. `companion-poc-render-layout-debug` draws safe areas and layout regions.

`companion-poc-render-placeholder` uses labelled silent placeholder audio. It is only for validating timing and assembly; it is not publishable narration.

## Required Local Tools

- Node.js;
- FFmpeg and ffprobe for MP4 export and media duration checks.
- macOS `qlmanage` for rasterizing deterministic SVG frames when FFmpeg cannot decode SVG directly.

## PoC 002 Layout Findings

- The previous MP4 was media-valid but visually invalid because SVG scene composition used ad hoc coordinates rather than a shared 1920 x 1080 composition contract.
- Text was emitted as single SVG `<text>` nodes without wrapping, height checks or overflow failure.
- The companion renderer referenced the full character sheet from inside the composed SVG, so the crop was implicit and dependent on the rasterizer's external-image behaviour.
- Quick Look rasterized SVGs as square thumbnails; FFmpeg then forced them into 16:9, distorting the internal scene layout.
- PoC 002 centralises safe areas, text layout, image containment and companion asset preparation before scene composition.

If FFmpeg is missing, validation can still check source/configuration structure, but rendering will fail with an actionable error.

## Generated Artefacts

- `generated/scenes/` contains deterministic SVG scene frames and transient segment files;
- `generated/subtitles/` contains the generated SRT subtitles;
- `generated/manifests/` contains provenance manifests;
- `runtime/output/` contains rendered MP4 files when FFmpeg is available.

## Companion Renderer

The current renderer is `StaticCompanionRenderer`. It resolves the configured logical companion ID through `AssetManager`, uses the configured crop from the design-system board when explicitly requested, and records a warning in the manifest. It does not produce lip-sync or mouth animation.

A future renderer can replace it by returning the same adapter result shape described in `adapters/companion-renderer-contract.md`.
