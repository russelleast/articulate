# Companion Renderer Adapter Contract

The animatic uses a replaceable companion-renderer boundary. The assembly pipeline consumes renderer results through this contract; it does not know whether a scene came from a static local fallback, a hosted avatar service, a local lip-sync model or a future 2D rig.

## Input

- companion visual asset path;
- narration audio path;
- scene metadata, including scene id, title, duration and source references;
- framing instructions, such as left or right presenter placement;
- output requirements, including resolution, frame rate and target duration.

## Output

- rendered companion video path, when available;
- duration in seconds;
- resolution;
- audio status;
- lip-sync status: `real`, `mocked` or `absent`;
- renderer metadata;
- provenance, including input asset and crop region where used;
- warnings.

## Current Adapter

`StaticCompanionRenderer` generates a deterministic SVG frame from the configured design-system reference-board crop. It intentionally reports `lipSync: absent` and is suitable only for animatic assembly.

Future adapters should implement the same result shape and should keep vendor-specific request and response formats outside the assembly pipeline.
