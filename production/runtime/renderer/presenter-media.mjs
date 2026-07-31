export const PRESENTER_COMPOSITION_MODES = Object.freeze([
  "presenter-full",
  "presenter-focus",
  "presenter-left-canvas-right",
  "canvas-left-presenter-right",
  "canvas-full",
  "evidence-full",
  "repository-full",
  "presenter-overlay"
]);

const VISIBLE_MODES = new Set([
  "presenter-full",
  "presenter-focus",
  "presenter-left-canvas-right",
  "canvas-left-presenter-right",
  "presenter-overlay"
]);

const PRESENTER_COMPOSITING_MODES = new Set(["overlay", "soft-luma-key"]);

export const DEFAULT_PRESENTER_COMPOSITING = Object.freeze({
  mode: "overlay",
  darkThreshold: 0.12,
  softThresholdRange: 0.14,
  maskFeatherRadius: 3,
  minimumRetainedOpacity: 0,
  maskContrast: 1,
  edgeVignetteRadius: 72,
  darkHaloSuppression: 0.08,
  temporalSmoothing: 2
});

export function usesPresenterVideo(config) {
  return config.presenter?.implementation === "continuous-video";
}

export function validatePresenterMedia({ config, asset, probe, scenes }) {
  const errors = [];
  const presenter = config.presenter;
  if (!presenter) return errors;
  if (presenter.implementation !== "continuous-video") {
    errors.push(`Unsupported presenter implementation '${presenter.implementation}'`);
  }
  if (asset.type !== "presenter-video") {
    errors.push(`Presenter asset '${asset.id}' must have type presenter-video`);
  }
  const video = probe.streams?.find((stream) => stream.codec_type === "video");
  const audio = probe.streams?.find((stream) => stream.codec_type === "audio");
  if (!video) errors.push("Presenter media must contain a video stream");
  if (presenter.audio === "embedded" && !audio) {
    errors.push("Presenter media configured for embedded audio has no audio stream");
  }
  if (presenter.audio !== "embedded") {
    errors.push("The continuous presenter pipeline currently requires embedded audio");
  }
  errors.push(...validatePresenterCompositing(presenter.compositing));
  const sourceDuration = Number(probe.format?.duration);
  const start = presenter.startOffsetSeconds ?? 0;
  const end = presenter.endOffsetSeconds ?? sourceDuration;
  if (!Number.isFinite(start) || start < 0) errors.push("Presenter startOffsetSeconds must be non-negative");
  if (!Number.isFinite(end) || end <= start) errors.push("Presenter endOffsetSeconds must be after startOffsetSeconds");
  if (Number.isFinite(sourceDuration) && end > sourceDuration + 0.001) {
    errors.push(`Presenter end offset ${end} exceeds source duration ${sourceDuration}`);
  }
  for (const scene of scenes) {
    if (["whiteboard", "companion", "studio"].includes(scene.presentation.composition)) {
      errors.push(`${scene.id} resolves to deprecated presenter-episode composition '${scene.presentation.composition}'`);
    }
    if (scene.companion || scene.companionPerformance || scene.motion?.companionIdle) {
      errors.push(`${scene.id} applies Companion behaviour in a presenter-video episode`);
    }
  }
  return errors;
}

export function presenterDurationSeconds(presenter, sourceDurationSeconds) {
  const start = presenter.startOffsetSeconds ?? 0;
  const end = presenter.endOffsetSeconds ?? sourceDurationSeconds;
  return end - start;
}

export function presenterFilterGraph({ presenter, scenes, output, durationSeconds }) {
  const visibleScenes = scenes.filter((scene) => VISIBLE_MODES.has(scene.presentation.composition));
  const start = presenter.startOffsetSeconds ?? 0;
  const end = start + durationSeconds;
  const filters = [
    `[1:v]trim=start=${decimal(start)}:end=${decimal(end)},setpts=PTS-STARTPTS,fps=${output.frameRate},split=${Math.max(1, visibleScenes.length)}${visibleScenes.length ? visibleScenes.map((_, index) => `[presenter-source-${index}]`).join("") : "[presenter-unused]"}`
  ];

  let current = "0:v";
  for (const [index, scene] of visibleScenes.entries()) {
    const mode = scene.presentation.composition;
    const frame = presenter.framing?.[mode] ?? defaultFrame(mode, output);
    const compositing = resolvePresenterCompositing(presenter.compositing, mode);
    const sceneWindow = `trim=start=${decimal(scene.startSeconds)}:end=${decimal(scene.endSeconds)},setpts=PTS-STARTPTS+${decimal(scene.startSeconds)}/TB`;
    if (compositing.mode === "soft-luma-key") {
      filters.push(...softLumaKeyFilters({
        input: `presenter-source-${index}`,
        output: `presenter-${index}`,
        frame,
        compositing,
        sceneWindow
      }));
    } else {
      filters.push(
        `[presenter-source-${index}]${sceneWindow},scale=${frame.width}:${frame.height}:flags=lanczos[presenter-${index}]`
      );
    }
    const outputLabel = `composite-${index}`;
    filters.push(
      `[${current}][presenter-${index}]overlay=x=${frame.x}:y=${frame.y}:eof_action=pass:shortest=0:enable='gte(t,${decimal(scene.startSeconds)})*lt(t,${decimal(scene.endSeconds)})'[${outputLabel}]`
    );
    current = outputLabel;
  }
  if (visibleScenes.length === 0) filters.push("[0:v]null[visual]");
  else filters.push(`[${current}]null[visual]`);
  filters.push(
    `[1:a]atrim=start=${decimal(start)}:end=${decimal(end)},asetpts=PTS-STARTPTS,apad=pad_dur=${decimal(durationSeconds)}[audio]`
  );
  return `${filters.join(";")}`;
}

export function presenterManifest(presenter, scenes) {
  return {
    implementation: presenter.implementation,
    assetId: presenter.assetId,
    audio: presenter.audio,
    compositing: presenter.compositing ?? { mode: "overlay" },
    startOffsetSeconds: presenter.startOffsetSeconds ?? 0,
    endOffsetSeconds: presenter.endOffsetSeconds,
    visibleScenes: scenes
      .filter((scene) => VISIBLE_MODES.has(scene.presentation.composition))
      .map((scene) => ({ sceneId: scene.id, composition: scene.presentation.composition }))
  };
}

function validatePresenterCompositing(config) {
  if (!config) return [];
  const errors = [];
  const mode = config.mode ?? "overlay";
  if (!PRESENTER_COMPOSITING_MODES.has(mode)) {
    errors.push(`Unsupported presenter compositing mode '${mode}'`);
  }
  const unitValues = ["darkThreshold", "softThresholdRange", "minimumRetainedOpacity", "darkHaloSuppression"];
  for (const name of unitValues) {
    if (config[name] !== undefined && (!Number.isFinite(config[name]) || config[name] < 0 || config[name] > 1)) {
      errors.push(`presenter.compositing.${name} must be between 0 and 1`);
    }
  }
  const positiveValues = ["maskFeatherRadius", "maskContrast", "edgeVignetteRadius", "temporalSmoothing"];
  for (const name of positiveValues) {
    if (config[name] !== undefined && (!Number.isFinite(config[name]) || config[name] < 0)) {
      errors.push(`presenter.compositing.${name} must be non-negative`);
    }
  }
  if (config.applyTo !== undefined) {
    if (!Array.isArray(config.applyTo) || config.applyTo.some((item) => !VISIBLE_MODES.has(item))) {
      errors.push("presenter.compositing.applyTo must contain only visible presenter composition modes");
    }
  }
  return errors;
}

function resolvePresenterCompositing(config, sceneMode) {
  const resolved = { ...DEFAULT_PRESENTER_COMPOSITING, ...config };
  if (config?.applyTo && !config.applyTo.includes(sceneMode)) return { ...resolved, mode: "overlay" };
  return resolved;
}

function softLumaKeyFilters({ input, output, frame, compositing, sceneWindow }) {
  const threshold = 255 * (
    compositing.darkThreshold
    + compositing.softThresholdRange * compositing.darkHaloSuppression
  );
  const range = Math.max(1, 255 * compositing.softThresholdRange);
  const floor = 255 * compositing.minimumRetainedOpacity;
  const transition = `clip((val-${number(threshold)})/${number(range)}\\,0\\,1)`;
  const alphaExpression = `${number(floor)}+(255-${number(floor)})*${transition}*${transition}*(3-2*${transition})`;
  const maskFilters = [
    "scale=in_range=tv:out_range=full",
    "format=gray",
    `eq=contrast=${number(compositing.maskContrast)}`,
    compositing.temporalSmoothing > 0
      ? `hqdn3d=luma_spatial=${number(compositing.temporalSmoothing * 0.75)}:chroma_spatial=0:luma_tmp=${number(compositing.temporalSmoothing)}:chroma_tmp=0`
      : null,
    `lut=y='${alphaExpression}'`,
    compositing.maskFeatherRadius > 0
      ? `gblur=sigma=${number(compositing.maskFeatherRadius)}`
      : null,
    compositing.edgeVignetteRadius > 0
      ? `format=gray,geq=lum='lum(X\\,Y)*min(1\\,min(X/${number(compositing.edgeVignetteRadius)}\\,min((W-1-X)/${number(compositing.edgeVignetteRadius)}\\,min(Y/${number(compositing.edgeVignetteRadius)}\\,(H-1-Y)/${number(compositing.edgeVignetteRadius)}))))'`
      : null
  ].filter(Boolean);

  return [
    `[${input}]${sceneWindow},scale=${frame.width}:${frame.height}:flags=lanczos,split=2[presenter-colour-${output}][presenter-mask-${output}]`,
    `[presenter-colour-${output}]format=rgba[presenter-rgba-${output}]`,
    `[presenter-mask-${output}]${maskFilters.join(",")}[presenter-alpha-${output}]`,
    `[presenter-rgba-${output}][presenter-alpha-${output}]alphamerge[${output}]`
  ];
}

function defaultFrame(mode, output) {
  if (mode === "presenter-full") {
    return { x: 0, y: 0, width: output.width, height: output.height };
  }
  if (mode === "presenter-focus") {
    return { x: -20, y: 641, width: 780, height: 439 };
  }
  if (mode === "presenter-left-canvas-right") {
    return { x: -100, y: 432, width: 1152, height: 648 };
  }
  if (mode === "canvas-left-presenter-right") {
    return { x: 868, y: 432, width: 1152, height: 648 };
  }
  return { x: 1210, y: 680, width: 640, height: 360 };
}

function decimal(value) {
  return Number(value).toFixed(6);
}

function number(value) {
  return Number(value).toFixed(4);
}
