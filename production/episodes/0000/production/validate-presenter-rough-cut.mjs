#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../../../..");
const config = readJson(path.join(scriptDirectory, "episode-config.json"));
const markers = readJson(path.join(scriptDirectory, "presenter-v2-markers.json"));
const manifestPath = resolve(config.output.generatedDirectory, "render-manifest.json");
const videoPath = resolve(config.output.video);
const sourcePath = resolve("production/episodes/0000/media/Ep0-pov1.mov");
const manifest = readJson(manifestPath);
const probe = probeMedia(videoPath);
const errors = [];
const frameRate = config.output.frameRate;
const tolerance = 1 / frameRate + 0.001;
const video = probe.streams.find((stream) => stream.codec_type === "video");
const audio = probe.streams.find((stream) => stream.codec_type === "audio");
const outputDuration = Number(probe.format.duration);
const selectedDuration = config.presenter.endOffsetSeconds - config.presenter.startOffsetSeconds;

if (!fs.existsSync(sourcePath)) errors.push("Presenter source does not resolve in the Episode 0000 media directory");
if (video?.width !== 1920 || video?.height !== 1080) errors.push("Output is not 1920x1080");
if (video?.r_frame_rate !== `${frameRate}/1`) errors.push(`Output frame rate is ${video?.r_frame_rate}, expected ${frameRate}/1`);
if (!audio) errors.push("Output has no audio stream");
if (Math.abs(outputDuration - selectedDuration) > tolerance) errors.push("Output duration differs from the selected presenter source window");
if (audio && Math.abs(Number(audio.duration) - outputDuration) > tolerance) errors.push("Output audio and video durations differ by more than one frame");

const sourceFrames = markers.scenes.map((scene) => ({
  id: scene.id,
  startFrame: Math.round(scene.startSeconds * frameRate),
  endFrame: Math.round(scene.endSeconds * frameRate)
}));
for (const [index, scene] of sourceFrames.entries()) {
  if (index > 0 && sourceFrames[index - 1].endFrame !== scene.startFrame) {
    errors.push(`${sourceFrames[index - 1].id}/${scene.id} do not share one integer-frame boundary`);
  }
}
if (sourceFrames[0]?.startFrame !== 0) errors.push("First scene does not begin at source frame zero");
if (sourceFrames.at(-1)?.endFrame !== Math.round(selectedDuration * frameRate)) {
  errors.push("Final scene does not cover the selected presenter source window");
}

for (const scene of config.scenes) {
  if (scene.kind.includes("whiteboard") || scene.compositionMode?.includes("whiteboard")) {
    errors.push(`${scene.id} retains whiteboard vocabulary`);
  }
  if (scene.companion || scene.companionPerformance || scene.motion?.companionIdle) {
    errors.push(`${scene.id} retains Companion behaviour`);
  }
}
if (manifest.presenter?.implementation !== "continuous-video") {
  errors.push("Render manifest does not record continuous presenter media");
}
if (manifest.presentationPlan.some((scene) => scene.companionPerformance !== null)) {
  errors.push("Render manifest contains Companion performance");
}

const report = {
  version: 2,
  status: errors.length ? "failed" : "passed",
  source: path.relative(repoRoot, sourcePath),
  output: path.relative(repoRoot, videoPath),
  selectedDurationSeconds: selectedDuration,
  renderedDurationSeconds: outputDuration,
  audioDurationSeconds: Number(audio?.duration),
  frameRate,
  resolution: `${video?.width}x${video?.height}`,
  sceneCount: markers.scenes.length,
  sharedIntegerFrameBoundaries: errors.every((error) => !error.includes("integer-frame boundary")),
  continuousPresenterManifest: manifest.presenter?.implementation === "continuous-video",
  companionPresent: false,
  whiteboardPresent: false,
  manualReview: [
    "Confirm natural lip synchronisation by watching the opening, each presenter return and the closing.",
    "Confirm the black source background blends with the surrounding composition on the delivery display.",
    "Confirm Focus Canvas labels remain readable at the intended playback size.",
    "Confirm the presenter remains within the lower-left reserved region and does not overlap active canvas content."
  ],
  errors
};
const reportPath = resolve(config.output.generatedDirectory, "presenter-validation-report.json");
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Presenter rough-cut validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Presenter rough-cut validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) {
  return path.resolve(repoRoot, ...parts);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function probeMedia(filePath) {
  const result = spawnSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration,size:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,duration",
    "-of", "json", filePath
  ], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || "ffprobe failed");
  return JSON.parse(result.stdout);
}
