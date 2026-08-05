#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const config = readJson(path.join(here, "presenter-v1-config.json"));
const markers = readJson(path.join(here, "presenter-v1-markers.json"));
const videoPath = resolve(config.output.video);
const subtitlePath = resolve("production/episodes/0007/output/episode-0007-final.srt");
const thumbnailPath = resolve("production/episodes/0007/publication/thumbnail/episode-0007-thumbnail.png");
const diagramDirectory = resolve("production/diagrams/sources/episodes/0007");
const errors = [];
const frameRate = config.output.frameRate;
const durationTarget = config.presenter.expectedDurationSeconds;
const tolerance = 1 / frameRate + 0.01;
const requiredConcepts = [
  "architectural-knowledge-journey",
  "architectural-information",
  "information-vs-knowledge",
  "claim-anatomy",
  "claim-evolution",
  "information-to-knowledge",
  "reasoning-context",
  "model-vs-graph",
  "knowledge-model",
  "knowledge-model-evolution",
  "shared-knowledge-model",
  "knowledge-api",
  "architectural-intelligence"
];

for (const required of [
  videoPath,
  subtitlePath,
  thumbnailPath,
  resolve(config.output.generatedDirectory, "render-manifest.json"),
  ...requiredConcepts.flatMap((name) => [path.join(diagramDirectory, `${name}.svg`), fs.existsSync(path.join(diagramDirectory, `${name}.d2`)) ? path.join(diagramDirectory, `${name}.d2`) : path.join(diagramDirectory, `${name}.puml`)])
]) if (!fs.existsSync(required)) errors.push(`Missing required output: ${path.relative(repoRoot, required)}`);

if (fs.existsSync(videoPath)) {
  const probe = probeMedia(videoPath);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const audio = probe.streams.find((stream) => stream.codec_type === "audio");
  const duration = Number(probe.format.duration);
  if (video?.width !== 1920 || video?.height !== 1080) errors.push("Output is not 1920x1080");
  if (video?.r_frame_rate !== "30/1") errors.push(`Output frame rate is ${video?.r_frame_rate}, expected 30/1`);
  if (!audio) errors.push("Output has no audio stream");
  if (Number(audio?.sample_rate) !== 48000) errors.push(`Audio sample rate is ${audio?.sample_rate}, expected 48000 Hz`);
  if (Math.abs(duration - durationTarget) > tolerance) errors.push(`Output duration ${duration} differs from ${durationTarget}`);
  const loudness = measureLoudness(videoPath);
  if (Math.abs(loudness.integratedLoudness - (-16)) > 1) errors.push(`Integrated loudness ${loudness.integratedLoudness} LUFS is outside -16 ±1 LU`);
  if (loudness.truePeak > -1) errors.push(`True peak ${loudness.truePeak} dBFS exceeds -1 dBFS`);
}

const boundaries = markers.scenes.map((scene) => ({ id: scene.id, startFrame: Math.round(scene.startSeconds * frameRate), endFrame: Math.round(scene.endSeconds * frameRate) }));
for (const [index, scene] of boundaries.entries()) {
  if (index && boundaries[index - 1].endFrame !== scene.startFrame) errors.push(`${boundaries[index - 1].id}/${scene.id} do not share an integer-frame boundary`);
}
if (boundaries[0]?.startFrame !== 0) errors.push("First scene does not start at frame zero");
if (boundaries.at(-1)?.endFrame !== Math.round(durationTarget * frameRate)) errors.push("Final scene does not end on the declared publication frame");

for (const scene of config.scenes) {
  if (scene.companion || scene.companionPerformance) errors.push(`${scene.id} retains stale Companion behaviour`);
  if (scene.diagramAssetId && scene.kind !== "presenter-diagram") errors.push(`${scene.id} does not use the presenter-era diagram canvas`);
}
if (!config.scenes.some((scene) => scene.headline === "Knowledge Model ≠ Knowledge Graph")) errors.push("Implementation-bias distinction is missing");
if (!config.scenes.some((scene) => scene.diagramAssetId === "episode-0007-knowledge-api")) errors.push("Knowledge API gateway visual is missing");
if (!config.scenes.some((scene) => scene.diagramAssetId === "episode-0007-architectural-intelligence")) errors.push("Architectural Intelligence conclusion is missing");

if (fs.existsSync(subtitlePath)) {
  const contents = fs.readFileSync(subtitlePath, "utf8");
  const cues = parseSrt(contents);
  if (!cues.length) errors.push("Subtitle file contains no cues");
  if (cues.at(-1)?.end > durationTarget + 0.001) errors.push("Subtitle cues fall outside the presenter window");
  for (const [index, cue] of cues.entries()) {
    if (cue.end <= cue.start) errors.push(`Subtitle cue ${index + 1} has non-positive duration`);
    if (index && cue.start < cues[index - 1].end - 0.001) errors.push(`Subtitle cues ${index}/${index + 1} overlap`);
    if (cue.lines.some((line) => line.length > 42)) errors.push(`Subtitle cue ${index + 1} exceeds 42 characters on one line`);
    if (cue.lines.length > 2) errors.push(`Subtitle cue ${index + 1} exceeds two lines`);
  }
  for (const term of ["Articulate", "Knowledge Model", "Knowledge API", "Architectural Intelligence", "PostgreSQL"]) {
    if (!contents.includes(term)) errors.push(`Subtitles are missing corrected term: ${term}`);
  }
}

const report = {
  version: 1,
  status: errors.length ? "failed" : "passed",
  source: "production/episodes/0007/ep07-narrator.mov",
  output: config.output.video,
  subtitle: "production/episodes/0007/output/episode-0007-final.srt",
  thumbnail: "production/episodes/0007/publication/thumbnail/episode-0007-thumbnail.png",
  selectedDurationSeconds: durationTarget,
  frameRate,
  sceneCount: config.scenes.length,
  continuousPresenter: true,
  diagramAssets: config.scenes.filter((scene) => scene.diagramAssetId).map((scene) => scene.diagramAssetId),
  checks: [
    "continuous presenter source and embedded audio",
    "integer-frame scene boundaries and 1080p output",
    "EBU R128 programme loudness",
    "Knowledge Model, implementation-bias and Knowledge API visuals",
    "subtitle range, overlap, line length and architectural terminology",
    "thumbnail and reusable diagram sources plus SVG outputs"
  ],
  manualReview: [
    "Watch the complete video for presenter/audio synchronisation and natural pacing.",
    "Confirm presenter edges blend softly into the dark canvas at every return.",
    "Confirm all diagram labels remain readable at 1080p.",
    "Confirm progressive reveals leave enough reading time.",
    "Confirm the thumbnail remains clear at mobile size."
  ],
  errors
};
const reportPath = resolve(config.output.generatedDirectory, "presenter-v1-validation-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Episode 0007 validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Episode 0007 validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) { return path.resolve(repoRoot, ...parts); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function probeMedia(filePath) { const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=index,codec_type,width,height,r_frame_rate,sample_rate,duration", "-of", "json", filePath], { encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return JSON.parse(result.stdout); }
function measureLoudness(filePath) { const result = spawnSync("ffmpeg", ["-hide_banner", "-i", filePath, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }); const integrated = [...result.stderr.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].at(-1); const peak = [...result.stderr.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)].at(-1); if (!integrated || !peak) throw new Error("Unable to measure output loudness"); return { integratedLoudness: Number(integrated[1]), truePeak: Number(peak[1]) }; }
function parseSrt(contents) { return contents.trim().split(/\n\s*\n/).map((block) => { const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/); if (!match) return null; const seconds = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000; return { start: seconds(1), end: seconds(5), lines: lines.slice(2) }; }).filter(Boolean); }
