#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readSceneConfig, orderedScenes, resolveRepoPath } from "./config.mjs";
import { assertWritableDirectory, findExecutable, probeDurationSeconds, requireExecutable, runCommand } from "./media-tools.mjs";
import { writeSrt } from "./subtitles.mjs";
import { writeArchitectureVisual, writeTitleCard } from "./visuals.mjs";
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

  if (!["validate", "render"].includes(command)) {
    printUsage();
    process.exitCode = 2;
    return;
  }

  const config = readSceneConfig(configPath);
  const context = createContext(config, configPath, { placeholderAudio, allowDurationMismatch });
  const validation = validateInputs(context, { requireRenderTools: false });

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
  node runtime/src/cli.mjs render [--placeholder-audio] [--allow-duration-mismatch]`);
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
    allowDurationMismatch: options.allowDurationMismatch
  };
}

export function validateInputs(context, { requireRenderTools = false } = {}) {
  const { repoRoot, config, scenes, placeholderAudio, allowDurationMismatch } = context;
  const errors = [];
  const warnings = [];

  const companionAsset = resolveRepoPath(repoRoot, config.assets.companionDesignSystem.path);
  if (!fs.existsSync(companionAsset)) {
    errors.push(`Missing companion design-system image: ${config.assets.companionDesignSystem.path}`);
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
  if (requireRenderTools) {
    if (!ffmpeg) errors.push("Required executable 'ffmpeg' was not found. Install FFmpeg to export MP4 video.");
    if (!ffprobe) errors.push("Required executable 'ffprobe' was not found. Install FFmpeg to inspect audio/video durations.");
  } else if (!ffmpeg || !ffprobe) {
    warnings.push("FFmpeg/ffprobe not found; validation can pass, but rendering will fail until FFmpeg is installed.");
  }

  if (!placeholderAudio) {
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

  return { warnings, ffmpeg, ffprobe };
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
    generatedScenesDir
  });

  for (const scene of scenes) {
    if (scene.kind === "title-card") {
      generatedFiles.push(writeTitleCard(path.join(generatedScenesDir, `${scene.id}.svg`), config));
    } else if (scene.kind === "architecture-visual") {
      generatedFiles.push(writeArchitectureVisual(path.join(generatedScenesDir, `${scene.id}.svg`), config));
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

  const subtitleFilterPath = generated.subtitlePath.replaceAll("\\", "\\\\").replaceAll(":", "\\:");
  runCommand(ffmpeg, [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatList,
    "-vf", `subtitles='${subtitleFilterPath}'`,
    "-c:v", "libx264",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-movflags", "+faststart",
    outputVideo
  ]);

  writeRunManifest({ context, generated, validation, outputVideo });
  return outputVideo;
}

function writeRunManifest({ context, generated, validation, outputVideo }) {
  const manifestPath = path.join(context.generatedManifestsDir, "companion-poc-001-latest-manifest.json");
  const inputFiles = [
    resolveRepoPath(context.repoRoot, context.config.assets.companionDesignSystem.path),
    context.configPath,
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
    outputVideo
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
