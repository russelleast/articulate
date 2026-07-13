# Lip-Sync Next Step

This note records what is still required to produce the first genuinely lip-synced companion scene. It compares implementation categories only where they can fit the companion renderer adapter contract.

## Hosted Avatar Renderer

- Integration: adapter uploads the approved companion asset or vendor-specific avatar reference, recorded WAV narration and scene metadata, then returns rendered video and provenance.
- Input assets: clean companion portrait or avatar definition, Russell's recorded audio, framing instructions.
- Recorded audio: should be a hard requirement; any service that requires synthetic voice does not fit this PoC.
- Operational burden: low local compute, higher vendor workflow and review burden.
- Privacy: Russell's voice and production assets leave the local environment.
- Repeatability: depends on service versioning and export controls.
- Scene-level regeneration: likely good if the service supports per-scene renders.
- Automation potential: good behind an adapter once review gates are defined.
- Primary architectural risk: vendor lock-in and unclear provenance unless requests, versions and outputs are recorded.

## Hosted Image-to-Video or Character Animation Service

- Integration: adapter submits the companion reference image, narration audio if supported, motion prompt and output requirements.
- Input assets: clean reference image, prompt, recorded audio if the service supports audio-driven motion.
- Recorded audio: unresolved; current service capabilities require current research.
- Operational burden: moderate because prompt tuning and visual review may dominate.
- Privacy: reference assets and possibly audio leave the local environment.
- Repeatability: weaker where outputs are prompt-driven or model versions change.
- Scene-level regeneration: possible, but visual continuity risk is high.
- Automation potential: limited until continuity and review failure modes are understood.
- Primary architectural risk: visually plausible but editorially unstable outputs.

## Local Open-Source Lip-Sync Model

- Integration: adapter runs the model against a clean companion portrait or generated video base plus Russell's WAV, then returns a rendered scene.
- Input assets: animation-ready portrait or base footage, recorded audio, local model weights, hardware-capable runtime.
- Recorded audio: yes, if the model accepts WAV input.
- Operational burden: high due to model setup, GPU/runtime constraints and artefact quality checks.
- Privacy: strongest option if all processing remains local.
- Repeatability: potentially good if model weights, runtime versions and seeds are pinned.
- Scene-level regeneration: good once the pipeline is stable.
- Automation potential: good, but only after operational constraints are exposed.
- Primary architectural risk: the production pipeline becomes dependent on fragile local ML runtime assumptions.

## 2D Rigged Character Pipeline

- Integration: adapter maps narration timing and optional phoneme data onto a rigged companion, then exports the scene video.
- Input assets: approved 2D character rig, mouth shapes, expression states, recorded audio, timing data.
- Recorded audio: yes; audio can drive phoneme extraction or manual timing.
- Operational burden: high upfront asset and rig creation, lower repeated render burden afterwards.
- Privacy: can remain local depending on tooling.
- Repeatability: strong if rig files and render settings are versioned.
- Scene-level regeneration: strong.
- Automation potential: strong for controlled presenter moments.
- Primary architectural risk: asset production effort may exceed the value of early experiments.

## Hybrid Motion-Graphics Approach

- Integration: adapter produces presenter-like motion from still companion art without claiming real lip-sync.
- Input assets: approved companion portrait or layered illustration, recorded audio for timing, motion presets.
- Recorded audio: yes for timing and pacing, not necessarily mouth movement.
- Operational burden: moderate and controllable.
- Privacy: can remain local.
- Repeatability: strong if implemented deterministically.
- Scene-level regeneration: strong.
- Automation potential: strong for animatics and restrained presenter transitions.
- Primary architectural risk: may satisfy continuity but not the "genuinely lip-synced" requirement.

## Recommendation

The next experiment should use one short recorded narration segment and a clean companion portrait, then compare one local deterministic hybrid render against one true lip-sync adapter. Current vendor-specific claims remain unresolved until researched against the adapter contract and privacy requirements.
