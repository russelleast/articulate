import fs from "node:fs";
import path from "node:path";
import { fileRecord } from "./checksum.mjs";

function repoRelative(repoRoot, filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

export function buildManifest({
  repoRoot,
  configPath,
  config,
  command,
  placeholderAudio,
  inputFiles,
  generatedFiles,
  rendererResults,
  warnings,
  outputVideo,
  realNarration = null,
  reviewReport = null
}) {
  const existingInputs = inputFiles.filter((filePath) => fs.existsSync(filePath));
  const existingGenerated = generatedFiles.filter((filePath) => fs.existsSync(filePath));
  return {
    experiment: config.experiment.id,
    sourceEpisode: config.experiment.canonicalSource,
    sourceRevision: getGitRevision(repoRoot),
    sceneConfiguration: repoRelative(repoRoot, configPath),
    runtimeVersion: config.runtimeVersion,
    renderingMode: placeholderAudio ? "placeholder-audio" : "recorded-audio",
    outputIdentity: "Companion PoC 001 animatic",
    narrationProvenance: realNarration ? "real human narration" : (placeholderAudio ? "placeholder silence" : "recorded narration files"),
    companionImagery: "deterministically animated companion imagery",
    genuineLipSync: false,
    placeholderAudioUsed: placeholderAudio,
    companionLipSync: "absent",
    resolution: {
      width: config.output.width,
      height: config.output.height
    },
    frameRate: config.output.frameRate,
    durationSeconds: config.scenes.reduce((sum, scene) => sum + scene.durationSeconds, 0),
    command,
    inputFiles: existingInputs.map((filePath) => fileRecord(filePath, repoRelative(repoRoot, filePath))),
    generatedFiles: existingGenerated.map((filePath) => fileRecord(filePath, repoRelative(repoRoot, filePath))),
    outputVideo: outputVideo && fs.existsSync(outputVideo) ? fileRecord(outputVideo, repoRelative(repoRoot, outputVideo)) : null,
    realNarration: realNarration ? {
      source: repoRelative(repoRoot, realNarration.sourcePath),
      prepared: repoRelative(repoRoot, realNarration.path),
      sourceSha256: realNarration.sourceChecksum,
      preparedSha256: realNarration.preparedChecksum,
      sourceDurationSeconds: realNarration.sourceDurationSeconds,
      preparedDurationSeconds: realNarration.durationSeconds,
      trim: realNarration.trim,
      transformations: realNarration.transformations
    } : null,
    reviewReport: reviewReport ? repoRelative(repoRoot, reviewReport) : null,
    rendererResults: rendererResults.map((result) => ({
      ...result,
      frame: result.frame ? repoRelative(repoRoot, result.frame) : result.frame,
      renderedVideo: result.renderedVideo ? repoRelative(repoRoot, result.renderedVideo) : result.renderedVideo
    })),
    warnings,
    timestamp: new Date().toISOString()
  };
}

export function writeManifest(filePath, manifest) {
  fs.writeFileSync(filePath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  return filePath;
}

function getGitRevision(repoRoot) {
  try {
    const gitHead = fs.readFileSync(path.join(repoRoot, ".git", "HEAD"), "utf8").trim();
    if (gitHead.startsWith("ref: ")) {
      const refPath = gitHead.slice(5);
      return fs.readFileSync(path.join(repoRoot, ".git", refPath), "utf8").trim();
    }
    return gitHead;
  } catch {
    return "unavailable";
  }
}
