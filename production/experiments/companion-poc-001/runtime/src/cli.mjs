#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSceneConfig, orderedScenes, resolveRepoPath } from "./config.mjs";
import { fileRecord } from "./checksum.mjs";
import { assertWritableDirectory, findExecutable, probeDurationSeconds, probeMedia, runCommand } from "./media-tools.mjs";
import { formatSrtTime, writeSrt } from "./subtitles.mjs";
import { writeArchitectureVisual, writeContactSheet, writeTitleCard } from "./visuals.mjs";
import { StaticCompanionRenderer } from "./renderers.mjs";
import { buildManifest, writeManifest } from "./manifest.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const runtimeRoot = path.resolve(__dirname, "..");
const experimentRoot = path.resolve(runtimeRoot, "..");
const repoRoot = path.resolve(experimentRoot, "../../..");
const defaultConfigPath = path.join(runtimeRoot, "config", "poc-scenes.yaml");

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const placeholderAudio = args.includes("--placeholder-audio");
  const allowDurationMismatch = args.includes("--allow-duration-mismatch");
  const configPath = valueAfter(args, "--config") ?? defaultConfigPath;

  if (!["validate", "render", "render-real", "render-reference-fallback", "render-layout-debug"].includes(command)) {
    printUsage();
    process.exitCode = 2;
    return;
  }

  const config = readSceneConfig(configPath);
  const context = createContext(config, configPath, {
    placeholderAudio,
    allowDurationMismatch,
    allowReferenceFallback: command === "render-reference-fallback" || command === "render-layout-debug",
    layoutDebug: command === "render-layout-debug",
    outputKind: command === "render-reference-fallback" ? "layoutCorrected" : command === "render-layout-debug" ? "layoutDebug" : "default"
  });
  if ((command === "render" && !placeholderAudio) || ["render-real", "render-reference-fallback", "render-layout-debug"].includes(command)) {
    const validation = validateInputs(context, { requireRenderTools: true, realAudio: true });
    const outputVideo = renderRealAnimatic(context, validation);
    console.log(`Rendered real-audio animatic: ${outputVideo}`);
    return;
  }

  const validation = validateInputs(context, { requireRenderTools: false, realAudio: !placeholderAudio });

  if (command === "validate") {
    if (validation.warnings.length > 0) {
      console.warn(`Warnings:\n- ${validation.warnings.join("\n- ")}`);
    }
    console.log(`Companion PoC validation passed for ${orderedScenes(config).length} scenes.`);
    console.log(`Placeholder audio: ${placeholderAudio ? "yes" : "no"}`);
    return;
  }

  const outputVideo = renderAnimatic(context, validation);
  console.log(`Rendered animatic: ${outputVideo}`);
}

function printUsage() {
  console.error(`Usage:
  node runtime/src/cli.mjs validate [--placeholder-audio]
  node runtime/src/cli.mjs render [--placeholder-audio] [--allow-duration-mismatch]
  node runtime/src/cli.mjs render-real
  node runtime/src/cli.mjs render-reference-fallback
  node runtime/src/cli.mjs render-layout-debug`);
}

function valueAfter(args, flag) {
  const index = args.indexOf(flag);
  if (index === -1) return null;
  return args[index + 1] ?? null;
}

function createContext(config, configPath, options) {
  const generatedScenesDir = path.join(experimentRoot, "generated", "scenes");
  const generatedSubtitlesDir = path.join(experimentRoot, "generated", "subtitles");
  const generatedManifestsDir = path.join(experimentRoot, "generated", "manifests");
  const outputDir = path.join(runtimeRoot, "output");
  return {
    repoRoot,
    runtimeRoot,
    experimentRoot,
    config,
    configPath,
    scenes: orderedScenes(config),
    generatedScenesDir,
    generatedSubtitlesDir,
    generatedManifestsDir,
    outputDir,
    placeholderAudio: options.placeholderAudio,
    allowDurationMismatch: options.allowDurationMismatch,
    allowReferenceFallback: options.allowReferenceFallback ?? false,
    layoutDebug: options.layoutDebug ?? false,
    outputKind: options.outputKind ?? "default"
  };
}

export function validateInputs(context, { requireRenderTools = false, realAudio = false } = {}) {
  const { repoRoot, config, scenes, placeholderAudio, allowDurationMismatch } = context;
  const errors = [];
  const warnings = [];

  const companionAsset = resolveRepoPath(repoRoot, config.assets.companionDesignSystem.path);
  if (!fs.existsSync(companionAsset)) {
    errors.push(`Missing companion design-system image: ${config.assets.companionDesignSystem.path}`);
  } else {
    const crop = config.assets.companionDesignSystem.crop;
    if (crop && (crop.x < 0 || crop.y < 0 || crop.x + crop.width > 1536 || crop.y + crop.height > 1024)) {
      errors.push(`Companion crop is outside the configured 1536x1024 reference-sheet bounds: ${JSON.stringify(crop)}`);
    }
  }
  const standaloneCompanion = resolveRepoPath(repoRoot, config.assets.companionNeutral.path);
  if (!fs.existsSync(standaloneCompanion)) {
    warnings.push(`Standalone companion asset is missing: ${config.assets.companionNeutral.path}. Normal render commands will fail until it exists; use the explicit reference fallback only for PoC 002 layout validation.`);
  }

  const canonicalSource = resolveRepoPath(repoRoot, config.experiment.canonicalSource);
  if (!fs.existsSync(canonicalSource)) {
    errors.push(`Missing canonical source episode: ${config.experiment.canonicalSource}`);
  }

  for (const dirPath of [context.generatedScenesDir, context.generatedSubtitlesDir, context.generatedManifestsDir, context.outputDir]) {
    try {
      assertWritableDirectory(dirPath);
    } catch (error) {
      errors.push(`Output directory is not writable: ${dirPath} (${error.message})`);
    }
  }

  const ffmpeg = findExecutable("ffmpeg");
  const ffprobe = findExecutable("ffprobe");
  const qlmanage = findExecutable("qlmanage");
  if (requireRenderTools) {
    if (!ffmpeg) errors.push("Required executable 'ffmpeg' was not found. Install FFmpeg to export MP4 video.");
    if (!ffprobe) errors.push("Required executable 'ffprobe' was not found. Install FFmpeg to inspect audio/video durations.");
    if (!qlmanage) errors.push("Required executable 'qlmanage' was not found. It is used to rasterize SVG frames for this FFmpeg build.");
  } else if (!ffmpeg || !ffprobe) {
    warnings.push("FFmpeg/ffprobe not found; validation can pass, but rendering will fail until FFmpeg is installed.");
  }

  if (realAudio) {
    const masterPath = resolveRepoPath(repoRoot, config.audio.realNarration.canonicalMaster);
    if (!fs.existsSync(masterPath)) {
      errors.push(`Missing canonical voice profile: ${config.audio.realNarration.canonicalMaster}`);
    } else if (ffprobe) {
      const duration = probeDurationSeconds(ffprobe, masterPath);
      if (!Number.isFinite(duration) || duration <= 0) {
        errors.push(`Canonical voice profile has no measurable duration: ${config.audio.realNarration.canonicalMaster}`);
      }
      if (duration > config.audio.realNarration.maxNarrationSeconds) {
        errors.push(`Canonical voice profile is ${duration.toFixed(2)}s, above the configured ${config.audio.realNarration.maxNarrationSeconds}s maximum. Configure an explicit excerpt before rendering.`);
      }
    }
  } else if (!placeholderAudio) {
    for (const scene of scenes) {
      const audioPath = resolveRepoPath(repoRoot, scene.audio);
      if (!fs.existsSync(audioPath)) {
        errors.push(`Missing narration file for ${scene.id}: ${scene.audio}. Use --placeholder-audio only for timing validation.`);
        continue;
      }
      if (ffprobe) {
        const actualDuration = probeDurationSeconds(ffprobe, audioPath);
        const delta = Math.abs(actualDuration - scene.durationSeconds);
        if (delta > config.audio.durationToleranceSeconds && !allowDurationMismatch) {
          errors.push(`Audio duration mismatch for ${scene.id}: configured ${scene.durationSeconds}s, actual ${actualDuration.toFixed(2)}s. Use --allow-duration-mismatch only after review.`);
        }
      }
    }
  }

  const sortedOrders = scenes.map((scene) => scene.order);
  for (let i = 1; i < sortedOrders.length; i += 1) {
    if (sortedOrders[i] <= sortedOrders[i - 1]) {
      errors.push("Scene ordering must be strictly increasing after sorting.");
    }
  }

  if (errors.length > 0) {
    throw new Error(`Companion PoC validation failed:\n- ${errors.join("\n- ")}`);
  }

  return { warnings, ffmpeg, ffprobe, qlmanage };
}

export function generateDeterministicAssets(context) {
  const { config, scenes, generatedScenesDir, generatedSubtitlesDir, placeholderAudio } = context;
  fs.mkdirSync(generatedScenesDir, { recursive: true });
  fs.mkdirSync(generatedSubtitlesDir, { recursive: true });

  const generatedFiles = [];
  const rendererResults = [];
  const renderer = new StaticCompanionRenderer({
    config,
    repoRoot: context.repoRoot,
    generatedScenesDir,
    companionAsset: context.companionAsset,
    layoutDebug: context.layoutDebug
  });

  for (const scene of scenes) {
    if (scene.kind === "title-card") {
      generatedFiles.push(writeTitleCard(path.join(generatedScenesDir, `${scene.id}.svg`), config, { debug: context.layoutDebug }));
    } else if (scene.kind === "architecture-visual") {
      generatedFiles.push(writeArchitectureVisual(path.join(generatedScenesDir, `${scene.id}.svg`), config, { debug: context.layoutDebug }));
    } else if (scene.kind === "companion") {
      const result = renderer.render(scene);
      rendererResults.push(result);
      generatedFiles.push(result.frame);
    } else {
      throw new Error(`Unsupported scene kind: ${scene.kind}`);
    }
  }

  const subtitlePath = path.join(generatedSubtitlesDir, "companion-poc-001-animatic.srt");
  generatedFiles.push(writeSrt(subtitlePath, scenes, { placeholderAudio }));
  return { generatedFiles, rendererResults, subtitlePath };
}

export function renderAnimatic(context, validation) {
  const generated = generateDeterministicAssets(context);
  const outputVideo = context.placeholderAudio
    ? resolveRepoPath(context.repoRoot, context.config.output.placeholderFile)
    : resolveRepoPath(context.repoRoot, context.config.output.file);
  fs.mkdirSync(path.dirname(outputVideo), { recursive: true });
  const renderWarnings = [...validation.warnings];

  if (!validation.ffmpeg || !validation.ffprobe) {
    if (!validation.ffmpeg) renderWarnings.push("MP4 export skipped because ffmpeg is not installed.");
    if (!validation.ffprobe) renderWarnings.push("Media probing skipped because ffprobe is not installed.");
    const manifestPath = writeRunManifest({
      context,
      generated,
      validation: { ...validation, warnings: renderWarnings },
      outputVideo: null
    });
    throw new Error(`Cannot export MP4 because FFmpeg/ffprobe are unavailable. Deterministic assets and manifest were still generated.\nManifest: ${manifestPath}\nInstall FFmpeg, then rerun: make companion-poc-render-placeholder`);
  }

  const ffmpeg = validation.ffmpeg;

  const segmentList = [];
  for (const scene of context.scenes) {
    const framePath = path.join(context.generatedScenesDir, `${scene.id}.svg`);
    const segmentPath = path.join(context.generatedScenesDir, `${scene.id}.mp4`);
    renderSceneSegment({ ffmpeg, context, scene, framePath, segmentPath });
    segmentList.push(segmentPath);
  }

  const concatList = path.join(context.generatedScenesDir, "segments.txt");
  fs.writeFileSync(concatList, segmentList.map((segment) => `file '${segment.replaceAll("'", "'\\''")}'`).join("\n"), "utf8");
  generated.generatedFiles.push(concatList, ...segmentList);

  runCommand(ffmpeg, [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-movflags", "+faststart",
    outputVideo
  ]);

  writeRunManifest({ context, generated, validation, outputVideo });
  return outputVideo;
}

export function renderRealAnimatic(context, validation) {
  const prepared = prepareRealNarration(context, validation);
  const companionAsset = prepareCompanionAsset(context, validation);
  const realContext = withRealAudioTiming(context, prepared.durationSeconds);
  realContext.companionAsset = companionAsset;
  const generated = generateDeterministicAssets(realContext);
  if (companionAsset.source === "reference-sheet-fallback") {
    generated.generatedFiles.push(companionAsset.path);
  }
  const outputVideo = resolveRepoPath(realContext.repoRoot, outputPathFor(realContext));
  fs.mkdirSync(path.dirname(outputVideo), { recursive: true });

  const segmentList = [];
  for (const scene of realContext.scenes) {
    const framePath = rasterizeSvgFrame({
      qlmanage: validation.qlmanage,
      svgPath: path.join(realContext.generatedScenesDir, `${scene.id}.svg`),
      outputPath: path.join(realContext.generatedScenesDir, `${scene.id}.png`),
      generatedScenesDir: realContext.generatedScenesDir
    });
    const segmentPath = path.join(realContext.generatedScenesDir, `${scene.id}.mp4`);
    renderSilentSceneSegment({ ffmpeg: validation.ffmpeg, context: realContext, scene, framePath, segmentPath });
    segmentList.push(segmentPath);
    generated.generatedFiles.push(framePath);
  }

  const concatList = path.join(realContext.generatedScenesDir, "segments-real.txt");
  fs.writeFileSync(concatList, segmentList.map((segment) => `file '${segment.replaceAll("'", "'\\''")}'`).join("\n"), "utf8");
  generated.generatedFiles.push(concatList, ...segmentList, prepared.path);

  runCommand(validation.ffmpeg, [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-itsoffset", String(realContext.config.audio.realNarration.startOffsetSeconds),
    "-i", prepared.path,
    "-map", "0:v:0",
    "-map", "1:a:0",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-movflags", "+faststart",
    outputVideo
  ]);

  const review = writeReviewArtifacts({ context: realContext, validation, outputVideo, prepared, generated });
  alignContextDurationToMedia(realContext, review.report.duration);
  generated.generatedFiles.push(...review.files);
  writeRunManifest({
    context: realContext,
    generated,
    validation: {
      ...validation,
      warnings: [
        ...validation.warnings,
        ...prepared.warnings,
        ...companionAsset.warnings,
        ...review.report.warnings
      ]
    },
    outputVideo,
    realNarration: prepared,
    reviewReport: review.reportPath
  });
  return outputVideo;
}

function alignContextDurationToMedia(context, durationSeconds) {
  const currentDuration = context.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  const delta = currentDuration - durationSeconds;
  if (Math.abs(delta) < 0.001) return;
  const lastScene = context.scenes.at(-1);
  lastScene.durationSeconds = Math.max(0.5, lastScene.durationSeconds - delta);
  const configLastScene = context.config.scenes.find((scene) => scene.id === lastScene.id);
  if (configLastScene) configLastScene.durationSeconds = lastScene.durationSeconds;
}

function outputPathFor(context) {
  if (context.outputKind === "layoutCorrected") return context.config.output.layoutCorrectedFile;
  if (context.outputKind === "layoutDebug") return context.config.output.layoutDebugFile;
  return context.config.output.file;
}

function prepareCompanionAsset(context, validation) {
  const standalonePath = resolveRepoPath(context.repoRoot, context.config.assets.companionNeutral.path);
  if (fs.existsSync(standalonePath)) {
    return {
      path: standalonePath,
      repoPath: context.config.assets.companionNeutral.path,
      source: "standalone",
      dimensions: readPngDimensions(standalonePath),
      warnings: []
    };
  }

  if (!context.allowReferenceFallback) {
    throw new Error(`Missing standalone companion asset: ${context.config.assets.companionNeutral.path}\nCreate production/assets/companion/v1/companion-neutral.png, or run make companion-poc-render-reference-fallback for the explicit temporary crop fallback.`);
  }

  const sourcePath = resolveRepoPath(context.repoRoot, context.config.assets.companionDesignSystem.path);
  const sourceDimensions = readPngDimensions(sourcePath);
  const crop = context.config.assets.companionDesignSystem.crop;
  if (crop.x < 0 || crop.y < 0 || crop.x + crop.width > sourceDimensions.width || crop.y + crop.height > sourceDimensions.height) {
    throw new Error(`Reference fallback crop is outside ${sourceDimensions.width}x${sourceDimensions.height}: ${JSON.stringify(crop)}`);
  }
  const assetDir = path.join(context.generatedScenesDir, "assets");
  fs.mkdirSync(assetDir, { recursive: true });
  const outputPath = path.join(assetDir, "companion-reference-fallback-crop.png");
  runCommand(validation.ffmpeg, [
    "-y",
    "-i", sourcePath,
    "-vf", `crop=${crop.width}:${crop.height}:${crop.x}:${crop.y}`,
    outputPath
  ]);
  return {
    path: outputPath,
    repoPath: path.relative(context.repoRoot, outputPath).replaceAll(path.sep, "/"),
    source: "reference-sheet-fallback",
    sourcePath: context.config.assets.companionDesignSystem.path,
    crop,
    dimensions: readPngDimensions(outputPath),
    sourceDimensions,
    warnings: [
      "Explicit reference-sheet fallback used because the standalone companion-neutral.png asset is absent.",
      "Fallback crop is a temporary layout-validation asset, not the production companion."
    ]
  };
}

function readPngDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 1, 4) !== "PNG") {
    throw new Error(`Expected PNG image: ${filePath}`);
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20)
  };
}

function prepareRealNarration(context, validation) {
  const settings = context.config.audio.realNarration;
  const masterPath = resolveRepoPath(context.repoRoot, settings.canonicalMaster);
  const preparedPath = resolveRepoPath(context.repoRoot, settings.prepared);
  const before = fileRecord(masterPath, settings.canonicalMaster);
  const sourceDuration = probeDurationSeconds(validation.ffprobe, masterPath);
  const trim = detectEdgeSilence({ ffmpeg: validation.ffmpeg, inputPath: masterPath, durationSeconds: sourceDuration, settings: settings.trimSilence });
  fs.mkdirSync(path.dirname(preparedPath), { recursive: true });
  runCommand(validation.ffmpeg, [
    "-y",
    "-ss", trim.startSeconds.toFixed(3),
    "-to", trim.endSeconds.toFixed(3),
    "-i", masterPath,
    "-ar", "48000",
    "-ac", "2",
    "-c:a", "pcm_s16le",
    preparedPath
  ]);
  const after = fileRecord(masterPath, settings.canonicalMaster);
  if (before.sha256 !== after.sha256) {
    throw new Error("Canonical voice profile changed during preparation; aborting render.");
  }
  const preparedDuration = probeDurationSeconds(validation.ffprobe, preparedPath);
  if (!Number.isFinite(preparedDuration) || preparedDuration <= 0) {
    throw new Error(`Prepared narration has no measurable duration: ${settings.prepared}`);
  }
  return {
    path: preparedPath,
    repoPath: settings.prepared,
    sourcePath: masterPath,
    sourceRepoPath: settings.canonicalMaster,
    sourceChecksum: before.sha256,
    preparedChecksum: fileRecord(preparedPath, settings.prepared).sha256,
    sourceDurationSeconds: sourceDuration,
    durationSeconds: preparedDuration,
    trim,
    transformations: settings.transformations,
    narrationType: "real human narration",
    warnings: []
  };
}

function detectEdgeSilence({ ffmpeg, inputPath, durationSeconds, settings }) {
  const result = runCommand(ffmpeg, [
    "-hide_banner",
    "-i", inputPath,
    "-af", `silencedetect=noise=${settings.noiseThreshold}:d=${settings.minimumSilenceSeconds}`,
    "-f", "null",
    "-"
  ]);
  const text = `${result.stdout}\n${result.stderr}`;
  const starts = [...text.matchAll(/silence_start: ([0-9.]+)/g)].map((match) => Number.parseFloat(match[1]));
  const ends = [...text.matchAll(/silence_end: ([0-9.]+)/g)].map((match) => Number.parseFloat(match[1]));
  let startSeconds = 0;
  let endSeconds = durationSeconds;
  if (starts[0] <= 0.05 && Number.isFinite(ends[0])) {
    startSeconds = Math.max(0, ends[0] - settings.keepLeadingSilenceSeconds);
  }
  const lastStart = starts.at(-1);
  const lastEnd = ends.at(-1);
  if (Number.isFinite(lastStart) && Number.isFinite(lastEnd) && Math.abs(lastEnd - durationSeconds) <= 0.1) {
    endSeconds = Math.min(durationSeconds, lastStart + settings.keepTrailingSilenceSeconds);
  }
  if (endSeconds <= startSeconds) {
    throw new Error("Silence trimming would remove the whole narration; check the voice profile.");
  }
  return {
    startSeconds,
    endSeconds,
    leadingTrimSeconds: startSeconds,
    trailingTrimSeconds: Math.max(0, durationSeconds - endSeconds)
  };
}

function withRealAudioTiming(context, narrationDurationSeconds) {
  const leadIn = context.config.audio.realNarration.startOffsetSeconds;
  const closingHold = 2;
  const frameDuration = 1 / context.config.output.frameRate;
  const totalDuration = Math.max(
    leadIn + narrationDurationSeconds,
    Math.floor((leadIn + narrationDurationSeconds + closingHold) / frameDuration) * frameDuration - frameDuration
  );
  const scenes = context.scenes.map((scene) => ({ ...scene }));
  scenes[0].durationSeconds = leadIn;
  scenes[1].durationSeconds = Math.min(7, Math.max(5, narrationDurationSeconds * 0.34));
  scenes[2].durationSeconds = Math.min(10, Math.max(7, narrationDurationSeconds * 0.44));
  scenes[3].durationSeconds = Math.max(3, totalDuration - scenes[0].durationSeconds - scenes[1].durationSeconds - scenes[2].durationSeconds);
  const config = {
    ...context.config,
    scenes: context.config.scenes.map((scene) => {
      const timed = scenes.find((candidate) => candidate.id === scene.id);
      return timed ? { ...scene, durationSeconds: timed.durationSeconds } : scene;
    })
  };
  return { ...context, config, scenes };
}

function renderSilentSceneSegment({ ffmpeg, context, scene, framePath, segmentPath }) {
  const transitionDuration = Math.min(scene.transition?.durationSeconds ?? 0.5, scene.durationSeconds / 3);
  const fadeOutStart = Math.max(0, scene.durationSeconds - transitionDuration);
  const videoFilter = [
    `scale=${context.config.output.width}:${context.config.output.height}:force_original_aspect_ratio=decrease`,
    `pad=${context.config.output.width}:${context.config.output.height}:(ow-iw)/2:(oh-ih)/2`,
    "setsar=1",
    `fps=${context.config.output.frameRate}`,
    `fade=t=in:st=0:d=${transitionDuration}`,
    `fade=t=out:st=${fadeOutStart}:d=${transitionDuration}`
  ].join(",");

  runCommand(ffmpeg, [
    "-y",
    "-loop", "1",
    "-t", String(scene.durationSeconds),
    "-i", framePath,
    "-vf", videoFilter,
    "-an",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    segmentPath
  ]);
}

function rasterizeSvgFrame({ qlmanage, svgPath, outputPath, generatedScenesDir }) {
  const thumbnailDir = path.join(generatedScenesDir, "quicklook");
  fs.mkdirSync(thumbnailDir, { recursive: true });
  const wrapperPath = path.join(thumbnailDir, `${path.basename(svgPath)}.wrapper.svg`);
  fs.writeFileSync(wrapperPath, `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1920" viewBox="0 0 1920 1920">
  <rect width="1920" height="1920" fill="#ffffff"/>
  <image href="${svgPath}" x="0" y="0" width="1920" height="1080" preserveAspectRatio="none"/>
</svg>`, "utf8");
  runCommand(qlmanage, ["-t", "-s", "1920", "-o", thumbnailDir, wrapperPath]);
  const quicklookOutput = path.join(thumbnailDir, `${path.basename(wrapperPath)}.png`);
  if (!fs.existsSync(quicklookOutput)) {
    throw new Error(`Quick Look did not create expected thumbnail: ${quicklookOutput}`);
  }
  runCommand(findExecutable("ffmpeg"), [
    "-y",
    "-i", quicklookOutput,
    "-vf", "crop=1920:1080:0:0,setsar=1",
    outputPath
  ]);
  return outputPath;
}

function writeReviewArtifacts({ context, validation, outputVideo, prepared }) {
  const reviewDir = path.join(context.outputDir, "review");
  fs.mkdirSync(reviewDir, { recursive: true });
  const total = context.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0);
  const timestamps = {
    "scene-001-title.png": 1,
    "scene-002-companion-opening.png": context.scenes[0].durationSeconds + 1,
    "scene-003-architecture.png": context.scenes[0].durationSeconds + context.scenes[1].durationSeconds + 1,
    "scene-004-closing.png": Math.max(0, total - 1)
  };
  const files = [];
  const reviewFrames = [];
  for (const [name, seconds] of Object.entries(timestamps)) {
    const filePath = path.join(reviewDir, name);
    runCommand(validation.ffmpeg, [
      "-y",
      "-ss", seconds.toFixed(3),
      "-i", outputVideo,
      "-frames:v", "1",
      filePath
    ]);
    files.push(filePath);
    reviewFrames.push({ label: name.replace(".png", ""), path: filePath });
  }
  const contactSvg = writeContactSheet(path.join(reviewDir, "contact-sheet.svg"), reviewFrames);
  const contactPng = rasterizeSvgFrame({
    qlmanage: validation.qlmanage,
    svgPath: contactSvg,
    outputPath: path.join(reviewDir, "contact-sheet.png"),
    generatedScenesDir: reviewDir
  });
  files.push(contactSvg, contactPng);
  const subtitlePath = path.join(context.generatedSubtitlesDir, "companion-poc-001-animatic.srt");
  const media = probeMedia(validation.ffprobe, outputVideo);
  const probedDuration = Number.parseFloat(media.format.duration);
  clampSubtitleEndTime(subtitlePath, probedDuration);
  const video = media.streams.find((stream) => stream.codec_type === "video");
  const audio = media.streams.find((stream) => stream.codec_type === "audio");
  const warnings = [];
  warnings.push("Burnt-in captions were skipped because this FFmpeg build does not provide the subtitles filter; separate SRT output was generated.");
  if (!audio) warnings.push("No audio stream found in rendered MP4.");
  if (video?.width !== context.config.output.width || video?.height !== context.config.output.height) {
    warnings.push(`Rendered resolution ${video?.width}x${video?.height} does not match configured ${context.config.output.width}x${context.config.output.height}.`);
  }
  const report = {
    duration: probedDuration,
    resolution: { width: video?.width ?? null, height: video?.height ?? null },
    frameRate: video?.r_frame_rate ?? null,
    videoCodec: video?.codec_name ?? null,
    audioCodec: audio?.codec_name ?? null,
    audioSampleRate: audio?.sample_rate ? Number.parseInt(audio.sample_rate, 10) : null,
    audioChannelCount: audio?.channels ?? null,
    subtitleOutput: path.relative(context.repoRoot, subtitlePath).replaceAll(path.sep, "/"),
    inputNarrationPath: prepared.repoPath,
    inputNarrationChecksum: prepared.preparedChecksum,
    sourceNarrationPath: prepared.sourceRepoPath,
    sourceNarrationChecksum: prepared.sourceChecksum,
    companionSource: context.companionAsset?.repoPath ?? context.config.assets.companionNeutral.path,
    companionSourceMode: context.companionAsset?.source ?? "standalone",
    companionCrop: context.companionAsset?.crop ?? null,
    companionDimensions: context.companionAsset?.dimensions ?? null,
    layoutValidation: {
      canvas: { width: context.config.output.width, height: context.config.output.height },
      safeArea: { x: 96, y: 96, width: 1728, height: 888 },
      automatedBoundsChecks: "Scene generators throw on declared bounds overflow; this does not guarantee visual quality."
    },
    warnings
  };
  const reportPath = path.join(reviewDir, "media-report.json");
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  files.push(reportPath);
  return { files, report, reportPath };
}

function clampSubtitleEndTime(subtitlePath, durationSeconds) {
  const srt = fs.readFileSync(subtitlePath, "utf8");
  const matches = [...srt.matchAll(/--> ([0-9:,]+)/g)];
  const last = matches.at(-1);
  if (!last) return;
  const clamped = srt.slice(0, last.index) + `--> ${formatSrtTime(durationSeconds)}` + srt.slice(last.index + last[0].length);
  fs.writeFileSync(subtitlePath, clamped, "utf8");
}

function writeRunManifest({ context, generated, validation, outputVideo, realNarration = null, reviewReport = null }) {
  const manifestPath = path.join(context.generatedManifestsDir, "companion-poc-001-latest-manifest.json");
  const inputFiles = [
    resolveRepoPath(context.repoRoot, context.config.assets.companionDesignSystem.path),
    context.configPath,
    ...(realNarration ? [realNarration.sourcePath, realNarration.path] : []),
    ...(!context.placeholderAudio ? context.scenes.map((scene) => resolveRepoPath(context.repoRoot, scene.audio)) : [])
  ];
  const manifest = buildManifest({
    repoRoot: context.repoRoot,
    configPath: context.configPath,
    config: context.config,
    command: process.argv.join(" "),
    placeholderAudio: context.placeholderAudio,
    inputFiles,
    generatedFiles: generated.generatedFiles,
    rendererResults: generated.rendererResults,
    warnings: validation.warnings,
    outputVideo,
    realNarration,
    reviewReport
  });
  writeManifest(manifestPath, manifest);
  return manifestPath;
}

function renderSceneSegment({ ffmpeg, context, scene, framePath, segmentPath }) {
  const audioArgs = context.placeholderAudio
    ? ["-f", "lavfi", "-t", String(scene.durationSeconds), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000"]
    : ["-i", resolveRepoPath(context.repoRoot, scene.audio)];
  const transitionDuration = Math.min(scene.transition?.durationSeconds ?? 0.5, scene.durationSeconds / 3);
  const fadeOutStart = Math.max(0, scene.durationSeconds - transitionDuration);
  const videoFilter = [
    `scale=${context.config.output.width}:${context.config.output.height}`,
    `fade=t=in:st=0:d=${transitionDuration}`,
    `fade=t=out:st=${fadeOutStart}:d=${transitionDuration}`
  ].join(",");

  runCommand(ffmpeg, [
    "-y",
    "-loop", "1",
    "-t", String(scene.durationSeconds),
    "-i", framePath,
    ...audioArgs,
    "-r", String(context.config.output.frameRate),
    "-s", `${context.config.output.width}x${context.config.output.height}`,
    "-vf", videoFilter,
    "-shortest",
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    segmentPath
  ]);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
