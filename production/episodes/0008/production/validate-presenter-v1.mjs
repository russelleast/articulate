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
const subtitlePath = resolve("production/episodes/0008/output/episode-0008-final.srt");
const thumbnailPath = resolve("production/episodes/0008/publication/thumbnail/episode-0008-thumbnail.png");
const errors = [];
const frameRate = config.output.frameRate;
const durationTarget = config.presenter.expectedDurationSeconds;
const tolerance = 1 / frameRate + 0.01;
const diagramAssets = [
  ["graphrag-traversal", "production/diagrams/sources/reasoning/graphrag-traversal.d2"],
  ["knowledge-reasoning-flow", "production/diagrams/sources/reasoning/knowledge-reasoning-flow.d2"],
  ["knowledge-reasoning-layer", "production/diagrams/sources/reasoning/knowledge-reasoning-layer.d2"],
  ["reasoning-before-agents", "production/diagrams/sources/reasoning/reasoning-before-agents.d2"],
  ["knowledge-graph-example", "production/diagrams/sources/knowledge/knowledge-graph-example.d2"],
  ["reasoning-map-example", "production/diagrams/sources/reasoning/reasoning-map-example.d2"]
];

for (const required of [
  videoPath,
  subtitlePath,
  thumbnailPath,
  resolve(config.output.generatedDirectory, "render-manifest.json"),
  resolve(config.output.reviewDirectory, "contact-sheet.png"),
  resolve(config.output.reviewDirectory, "temporal-contact-sheet.png"),
  ...diagramAssets.flatMap(([id, source]) => [resolve(source), resolve(`site/public/diagrams/${id}.svg`)])
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

const boundaries = markers.scenes.map((scene) => ({
  id: scene.id,
  startFrame: Math.round(scene.startSeconds * frameRate),
  endFrame: Math.round(scene.endSeconds * frameRate)
}));
for (const [index, scene] of boundaries.entries()) {
  if (index && boundaries[index - 1].endFrame !== scene.startFrame) errors.push(`${boundaries[index - 1].id}/${scene.id} do not share an integer-frame boundary`);
}
if (boundaries[0]?.startFrame !== 0) errors.push("First scene does not start at frame zero");
if (boundaries.at(-1)?.endFrame !== Math.round(durationTarget * frameRate)) errors.push("Final scene does not end on the publication frame");

if (config.scenes.some((scene) => scene.kind === "focus-canvas" || scene.compositionMode?.includes("focus"))) errors.push("Legacy Focus Canvas treatment is present");
for (const expected of ["graphrag-traversal", "knowledge-reasoning-flow", "knowledge-reasoning-layer", "reasoning-before-agents", "knowledge-graph-example", "reasoning-map-example"]) {
  if (!config.scenes.some((scene) => scene.diagramAssetId === expected)) errors.push(`Required visual sequence is missing: ${expected}`);
}
if (!config.scenes.some((scene) => scene.headline === "Capabilities—not necessarily agents")) errors.push("Reasoning-capability distinction is missing");
if (!config.scenes.some((scene) => scene.headline === "Retrieval isn't reasoning")) errors.push("Central retrieval/reasoning distinction is missing");

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
  for (const term of ["Articulate", "Architectural Intelligence", "Knowledge Model", "Knowledge Reasoning Layer", "Agentic RAG", "GraphRAG", "DCL"]) {
    if (!contents.includes(term)) errors.push(`Subtitles are missing corrected term: ${term}`);
  }
  for (const rejected of ["a genetic RAG", "termagentic", "reasoning graph", "center of the architecture", "artifact of reasoning"]) {
    if (contents.toLowerCase().includes(rejected.toLowerCase())) errors.push(`Subtitles contain uncorrected wording: ${rejected}`);
  }
}

const report = {
  version: 1,
  status: errors.length ? "failed" : "passed",
  source: "production/episodes/0008/ep8-editted.mp4",
  output: config.output.video,
  subtitle: "production/episodes/0008/output/episode-0008-final.srt",
  thumbnail: "production/episodes/0008/publication/thumbnail/episode-0008-thumbnail.png",
  selectedDurationSeconds: durationTarget,
  frameRate,
  sceneCount: config.scenes.length,
  continuousPresenter: true,
  diagramAssets: config.scenes.filter((scene) => scene.diagramAssetId).map((scene) => scene.diagramAssetId),
  checks: [
    "continuous presenter source and embedded audio",
    "integer-frame scene boundaries and 1080p output",
    "EBU R128 programme loudness",
    "current visual grammar with no Focus Canvas",
    "reasoning, retrieval, Knowledge Model and explanation visuals",
    "subtitle range, overlap, line length and architectural terminology",
    "presenter-based thumbnail and reusable diagram sources"
  ],
  manualReview: [
    "Complete temporal and scene contact sheets inspected at final resolution.",
    "Presenter edges, diagram labels, title clearance and thumbnail mobile previews inspected.",
    "Final edited audio used as the subtitle timing authority."
  ],
  errors
};
const reportPath = resolve(config.output.generatedDirectory, "presenter-v1-validation-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Episode 0008 validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Episode 0008 validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) { return path.resolve(repoRoot, ...parts); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function probeMedia(filePath) { const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=index,codec_type,width,height,r_frame_rate,sample_rate,duration", "-of", "json", filePath], { encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return JSON.parse(result.stdout); }
function measureLoudness(filePath) { const result = spawnSync("ffmpeg", ["-hide_banner", "-i", filePath, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8", maxBuffer: 20 * 1024 * 1024 }); const integrated = [...result.stderr.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].at(-1); const peak = [...result.stderr.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)].at(-1); if (!integrated || !peak) throw new Error("Unable to measure output loudness"); return { integratedLoudness: Number(integrated[1]), truePeak: Number(peak[1]) }; }
function parseSrt(contents) { return contents.trim().split(/\n\s*\n/).map((block) => { const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/); if (!match) return null; const seconds = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000; return { start: seconds(1), end: seconds(5), lines: lines.slice(2) }; }).filter(Boolean); }
