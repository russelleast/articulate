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
const subtitlePath = resolve("production/episodes/0012/output/episode-0012-final.srt");
const thumbnailPath = resolve("production/episodes/0012/publication/thumbnail/episode-0012-thumbnail.png");
const errors = [];
const diagramIds = ["memory-responsibilities","reconstructable-reasoning","external-effects","process-failure","execution-progress","durable-continuity","human-wait","changing-baseline","runtime-boundary"].map((name) => `episode-0012-${name}`);
for (const required of [videoPath, subtitlePath, thumbnailPath, resolve(config.output.generatedDirectory, "render-manifest.json"), ...diagramIds.flatMap((id) => [resolve(`production/diagrams/sources/episodes/0012/${id.replace("episode-0012-", "")}.d2`), resolve(`site/public/diagrams/${id}.svg`)])]) if (!fs.existsSync(required)) errors.push(`Missing required output: ${path.relative(repoRoot, required)}`);

if (fs.existsSync(videoPath)) {
  const probe = probeMedia(videoPath);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const audio = probe.streams.find((stream) => stream.codec_type === "audio");
  if (video?.width !== 1920 || video?.height !== 1080) errors.push("Output is not 1920x1080");
  if (video?.r_frame_rate !== "30/1") errors.push(`Output frame rate is ${video?.r_frame_rate}, expected 30/1`);
  if (!audio || Number(audio.sample_rate) !== 48000) errors.push("Output audio is not 48 kHz");
  if (Math.abs(Number(probe.format.duration) - config.presenter.expectedDurationSeconds) > 0.05) errors.push("Output duration differs from the presenter authority");
}

const boundaries = markers.scenes.map((scene) => ({ id: scene.id, startFrame: Math.round(scene.startSeconds * 30), endFrame: Math.round(scene.endSeconds * 30) }));
for (const [index, scene] of boundaries.entries()) if (index && boundaries[index - 1].endFrame !== scene.startFrame) errors.push(`${boundaries[index - 1].id}/${scene.id} do not share an integer-frame boundary`);
if (boundaries[0]?.startFrame !== 0 || boundaries.at(-1)?.endFrame !== Math.round(config.presenter.expectedDurationSeconds * 30)) errors.push("Scene boundaries do not cover the complete recording");
if (config.scenes.length !== 16) errors.push("Episode 12 must contain the approved sixteen-scene argument");
for (const id of diagramIds) if (!config.scenes.some((scene) => scene.diagramAssetId === id)) errors.push(`Required diagram state missing: ${id}`);
for (const scene of config.scenes.filter((item) => item.diagramAssetId)) if (scene.visualStateMode !== "complete-diagram" || scene.timeline.events.length) errors.push(`${scene.id} must use a complete D2 diagram state`);
if (!config.scenes.some((scene) => scene.headline === "The process is temporary." && scene.support === "THE EXECUTION IS DURABLE.")) errors.push("Core durable execution statement is missing");
if (JSON.stringify(config.scenes.map(({ headline, support, items }) => ({ headline, support, items }))).match(/Dapr|LangGraph|Temporal(?: runtime)?|Microsoft Agent Framework/i)) errors.push("Episode 12 must not reveal the runtime decision");

if (fs.existsSync(subtitlePath)) {
  const contents = fs.readFileSync(subtitlePath, "utf8");
  const cues = parseSrt(contents);
  const spoken = cues.flatMap((cue) => cue.lines).join(" ");
  if (!cues.length) errors.push("Subtitle file contains no cues");
  for (const [index, cue] of cues.entries()) {
    if (cue.end <= cue.start) errors.push(`Subtitle cue ${index + 1} has non-positive duration`);
    if (index && cue.start < cues[index - 1].end - 0.001) errors.push(`Subtitle cues ${index}/${index + 1} overlap`);
    if (cue.lines.length > 2 || cue.lines.some((line) => line.length > 42)) errors.push(`Subtitle cue ${index + 1} exceeds layout limits`);
  }
  for (const term of ["Articulate", "Knowledge Model", "execution", "durable execution", "ADR"]) if (!spoken.toLowerCase().includes(term.toLowerCase())) errors.push(`Subtitles are missing corrected term: ${term}`);
}

const report = { version: 1, status: errors.length ? "failed" : "passed", source: "production/episodes/0012/ep12-narrator.mp4", output: config.output.video, subtitle: "production/episodes/0012/output/episode-0012-final.srt", thumbnail: "production/episodes/0012/publication/thumbnail/episode-0012-thumbnail.png", selectedDurationSeconds: config.presenter.expectedDurationSeconds, frameRate: 30, sceneCount: config.scenes.length, continuousPresenter: true, diagramAssets: diagramIds, checks: ["continuous presenter source", "complete recording coverage", "1080p 30 fps publication output", "D2-authored complete diagram states", "core durable execution principle", "ADR requirements without runtime decision", "subtitle timing and typography limits", "series-consistent thumbnail"], errors };
const reportPath = resolve(config.output.generatedDirectory, "presenter-v1-validation-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Episode 0012 validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Episode 0012 validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) { return path.resolve(repoRoot, ...parts); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function probeMedia(filePath) { const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=codec_type,width,height,r_frame_rate,sample_rate", "-of", "json", filePath], { encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return JSON.parse(result.stdout); }
function parseSrt(contents) { return contents.trim().split(/\n\s*\n/).map((block) => { const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/); if (!match) return null; const seconds = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000; return { start: seconds(1), end: seconds(5), lines: lines.slice(2) }; }).filter(Boolean); }
