#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const config = readJson(path.join(here, "presenter-v2-config.json"));
const markers = readJson(path.join(here, "presenter-v2-markers.json"));
const videoPath = resolve(config.output.video);
const subtitlePath = resolve("production/episodes/0003/output/episode-0003-final.srt");
const errors = [];
const frameRate = config.output.frameRate;
const durationTarget = config.presenter.expectedDurationSeconds;
const tolerance = 1 / frameRate + 0.002;
const requiredDiagrams = [
  "episode-0003-problem-to-technology.svg",
  "episode-0003-deterministic-or-intelligent.svg",
  "episode-0003-intelligent-responsibilities.svg",
  "episode-0003-intelligence-runtime-capability.svg"
].map((name) => resolve("site/public/diagrams", name));

for (const required of [
  videoPath,
  subtitlePath,
  resolve(config.output.generatedDirectory, "render-manifest.json"),
  ...requiredDiagrams
]) if (!fs.existsSync(required)) errors.push(`Missing required output: ${path.relative(repoRoot, required)}`);

if (config.presenter.assetId !== "episode-0003-presenter-v2") errors.push("Final config does not use the new Episode 3 presenter asset");
if (config.presenter.expectedSha256 !== "e7219c6cbee8f94e9d682288c2ca4b15c129f36a05ca63e2b304c11d72112136") errors.push("Presenter checksum does not identify ep3-narrator.mov");

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
  if (audio && Math.abs(Number(audio.duration) - duration) > tolerance) errors.push("Audio and video durations differ by more than one frame");
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
  if (["whiteboard", "studio"].includes(scene.kind)) errors.push(`${scene.id} retains deprecated visual vocabulary`);
  if (scene.diagramAssetId && scene.kind !== "presenter-diagram") errors.push(`${scene.id} does not place its diagram in the presenter-era canvas`);
}
if (!config.scenes.at(-1)?.headline.toLowerCase().includes("hypothesis")) errors.push("Ending does not frame AI-native architecture as a hypothesis");
if (!config.scenes.some((scene) => scene.support?.includes("deterministic solutions remain the right choice"))) errors.push("The deterministic approach is not explicitly preserved as an appropriate choice");

if (fs.existsSync(subtitlePath)) {
  const contents = fs.readFileSync(subtitlePath, "utf8");
  const cues = parseSrt(contents);
  if (!cues.length) errors.push("Subtitle file contains no cues");
  if (cues.at(-1)?.end > durationTarget + 0.001) errors.push("Subtitle cues fall outside the selected presenter window");
  if (!contents.includes("Articulate") || !contents.includes("AI-native") || !contents.includes("LLM")) errors.push("Corrected architectural terminology is missing from subtitles");
  if (contents.includes("Intelligence becomes infrastructure") || contents.includes("Agent capability path")) errors.push("Subtitles retain stale Episode 3 material");
  for (const [index, cue] of cues.entries()) {
    if (cue.end <= cue.start) errors.push(`Subtitle cue ${index + 1} has non-positive duration`);
    if (index && cue.start < cues[index - 1].end - 0.001) errors.push(`Subtitle cues ${index}/${index + 1} overlap`);
    if (cue.lines.some((line) => line.length > 42)) errors.push(`Subtitle cue ${index + 1} exceeds 42 characters on one line`);
    if (cue.lines.length > 2) errors.push(`Subtitle cue ${index + 1} exceeds two lines`);
  }
}

const report = {
  version: 1,
  status: errors.length ? "failed" : "passed",
  source: "production/episodes/0003/ep3-narrator.mov",
  output: config.output.video,
  subtitle: "production/episodes/0003/output/episode-0003-final.srt",
  selectedDurationSeconds: durationTarget,
  frameRate,
  sceneCount: config.scenes.length,
  continuousPresenter: true,
  diagramAssets: config.scenes.filter((scene) => scene.diagramAssetId).map((scene) => scene.diagramAssetId),
  brandingReference: "Refreshed Episodes 0000–0002 · Articulate visual grammar v2",
  checks: [
    "new presenter source checksum and continuous embedded audio",
    "integer-frame scene boundaries and 1080p output",
    "EBU R128 programme loudness",
    "presenter-era diagram composition and terminology",
    "subtitle range, overlap, line length and stale-copy detection",
    "deterministic approaches retained and AI-native ending framed as hypothesis"
  ],
  manualReview: [
    "Watch the complete video for presenter/audio synchronisation and natural pacing.",
    "Confirm presenter edges blend softly into the dark canvas at every return.",
    "Confirm all diagram and Focus Canvas labels remain readable at 1080p.",
    "Confirm transitions never obscure presenter gestures, captions or key labels.",
    "Confirm the cumulative movement feels gradual rather than a sudden AI-native reveal."
  ],
  errors
};
const reportPath = resolve(config.output.generatedDirectory, "presenter-v2-validation-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Episode 0003 validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Episode 0003 validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) { return path.resolve(repoRoot, ...parts); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function probeMedia(filePath) { const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=index,codec_type,width,height,r_frame_rate,sample_rate,duration", "-of", "json", filePath], { encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return JSON.parse(result.stdout); }
function measureLoudness(filePath) { const result = spawnSync("ffmpeg", ["-hide_banner", "-i", filePath, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }); const text = result.stderr; const integrated = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].at(-1); const peak = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)].at(-1); if (!integrated || !peak) throw new Error("Unable to measure output loudness"); return { integratedLoudness: Number(integrated[1]), truePeak: Number(peak[1]) }; }
function parseSrt(contents) { return contents.trim().split(/\n\s*\n/).map((block) => { const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/); if (!match) return null; const seconds = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000; return { start: seconds(1), end: seconds(5), lines: lines.slice(2) }; }).filter(Boolean); }
