#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../../../..");
const config = readJson(path.join(scriptDirectory, "presenter-refresh-config.json"));
const markers = readJson(path.join(scriptDirectory, "presenter-refresh-markers.json"));
const videoPath = resolve(config.output.video);
const manifestPath = resolve(config.output.generatedDirectory, "render-manifest.json");
const subtitlePath = resolve("production/output/episode-0001.srt");
const errors = [];
const frameRate = config.output.frameRate;
const tolerance = 1 / frameRate + 0.001;

if (!fs.existsSync(videoPath)) errors.push("Final Episode 0001 video is missing");
if (!fs.existsSync(manifestPath)) errors.push("Render manifest is missing");
if (!fs.existsSync(subtitlePath)) errors.push("Required production/output/episode-0001.srt is missing");

if (!errors.length) {
  const probe = probeMedia(videoPath);
  const video = probe.streams.find((stream) => stream.codec_type === "video");
  const audio = probe.streams.find((stream) => stream.codec_type === "audio");
  const duration = Number(probe.format.duration);
  if (video?.width !== 1920 || video?.height !== 1080) errors.push("Output is not 1920x1080");
  if (video?.r_frame_rate !== "30/1") errors.push(`Output frame rate is ${video?.r_frame_rate}, expected 30/1`);
  if (!audio) errors.push("Output has no audio stream");
  if (Number(audio?.sample_rate) !== 48000) errors.push(`Output audio sample rate is ${audio?.sample_rate}, expected 48000 Hz`);
  if (Math.abs(duration - 306) > tolerance) errors.push(`Output duration ${duration} differs from 306.000 seconds`);
  if (audio && Math.abs(Number(audio.duration) - duration) > tolerance) errors.push("Audio and video durations differ by more than one frame");
  const loudness = measureLoudness(videoPath);
  if (Math.abs(loudness.integratedLoudness - (-16)) > 1) errors.push(`Integrated loudness ${loudness.integratedLoudness} LUFS is outside the -16 ±1 LU target`);
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
if (boundaries.at(-1)?.endFrame !== 9180) errors.push("Final scene does not end at frame 9180");

for (const scene of config.scenes) {
  if (scene.kind.includes("whiteboard") || scene.compositionMode?.includes("whiteboard")) errors.push(`${scene.id} retains whiteboard vocabulary`);
  if (scene.diagramAssetId) errors.push(`${scene.id} uses an external SVG instead of the integrated dark canvas treatment`);
  if (scene.companion || scene.companionPerformance || scene.motion?.companionIdle) errors.push(`${scene.id} retains Companion behaviour`);
  const duration = markers.scenes.find((marker) => marker.id === scene.id).endSeconds - markers.scenes.find((marker) => marker.id === scene.id).startSeconds;
  const eventTimes = [0, ...(scene.timeline?.events ?? []).map((event) => event.at).sort((a, b) => a - b), duration];
  for (let index = 1; index < eventTimes.length; index += 1) {
    if (eventTimes[index] - eventTimes[index - 1] > 18 && scene.kind !== "presenter-focus") {
      errors.push(`${scene.id} has a static visual hold longer than 18 seconds`);
    }
  }
}

if (fs.existsSync(subtitlePath)) {
  const cues = parseSrt(fs.readFileSync(subtitlePath, "utf8"));
  if (!cues.length) errors.push("Subtitle file contains no cues");
  if (cues[0]?.start < 0 || cues.at(-1)?.end > 306.001) errors.push("Subtitle cues fall outside the selected presenter window");
  for (const [index, cue] of cues.entries()) {
    if (cue.end <= cue.start) errors.push(`Subtitle cue ${index + 1} has a non-positive duration`);
    if (index && cue.start < cues[index - 1].end - 0.001) errors.push(`Subtitle cues ${index}/${index + 1} overlap`);
    if (cue.lines.some((line) => line.length > 42)) errors.push(`Subtitle cue ${index + 1} exceeds 42 characters on one line`);
    if (cue.lines.length > 2) errors.push(`Subtitle cue ${index + 1} exceeds two lines`);
  }
}

const report = {
  version: 1,
  status: errors.length ? "failed" : "passed",
  source: "production/episodes/0001/ep01-narrator.mov",
  output: config.output.video,
  subtitle: "production/output/episode-0001.srt",
  selectedDurationSeconds: 306,
  frameRate: 30,
  sceneCount: config.scenes.length,
  continuousPresenter: true,
  companionPresent: false,
  externalSvgPresent: false,
  whiteboardPresent: false,
  brandingReference: "episode-0000 presenter visual grammar v2",
  checks: [
    "continuous embedded audio and presenter picture",
    "integer-frame scene boundaries",
    "EBU R128 programme loudness",
    "no Companion or whiteboard compositions",
    "no external SVG white surfaces",
    "progressive disclosure hold duration",
    "subtitle range, overlap and line length"
  ],
  manualReview: [
    "Watch opening, every presenter return and closing for natural lip synchronisation.",
    "Confirm the lower-left presenter edge blends into the black/dark scene background.",
    "Confirm topic changes feel paced to narration and no transition feels clipped.",
    "Confirm thumbnail presenter expression and headline remain clear at mobile size."
  ],
  errors
};
const reportPath = resolve(config.output.generatedDirectory, "presenter-refresh-validation-report.json");
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) throw new Error(`Episode 0001 presenter refresh validation failed:\n- ${errors.join("\n- ")}`);
console.log(`Episode 0001 presenter refresh validation passed: ${path.relative(repoRoot, reportPath)}`);

function resolve(...parts) { return path.resolve(repoRoot, ...parts); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function probeMedia(filePath) { const result = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=index,codec_type,width,height,r_frame_rate,sample_rate,duration", "-of", "json", filePath], { encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return JSON.parse(result.stdout); }
function measureLoudness(filePath) { const result = spawnSync("ffmpeg", ["-hide_banner", "-i", filePath, "-map", "0:a:0", "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" }); const text = result.stderr; const integrated = [...text.matchAll(/I:\s+(-?[0-9.]+) LUFS/g)].at(-1); const peak = [...text.matchAll(/Peak:\s+(-?[0-9.]+) dBFS/g)].at(-1); if (!integrated || !peak) throw new Error("Unable to measure output loudness"); return { integratedLoudness: Number(integrated[1]), truePeak: Number(peak[1]) }; }
function parseSrt(contents) { return contents.trim().split(/\n\s*\n/).map((block) => { const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/); if (!match) return null; const seconds = (offset) => Number(match[offset]) * 3600 + Number(match[offset + 1]) * 60 + Number(match[offset + 2]) + Number(match[offset + 3]) / 1000; return { start: seconds(1), end: seconds(5), lines: lines.slice(2) }; }).filter(Boolean); }
