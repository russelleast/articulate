#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const sourceConfigPath = path.join(scriptDir, "episode-config.json");
const outputConfigPath = path.join(scriptDir, "companion-performance-v1-config.json");
const markersPath = path.join(scriptDir, "narration-markers.json");
const masterAudio = path.join(repoRoot, "production/cache/episode-0000/Ep0-welcome-to-the-articulate-journal.wav");
const cacheDir = path.join(repoRoot, "production/cache/episode-0000/companion-performance-v1");
const timelineDir = path.join(scriptDir, "companion-performance-v1");
const companionSceneIds = new Set(["S001", "S008", "S012"]);

if (!fs.existsSync(masterAudio)) throw new Error(`Missing canonical narration: ${masterAudio}`);
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(timelineDir, { recursive: true });
run("node", [path.join(repoRoot, "production/runtime/generate-companion-facial-assets.mjs")]);

const markers = readJson(markersPath);
for (const marker of markers.scenes.filter((scene) => companionSceneIds.has(scene.id))) {
  const duration = marker.endSeconds - marker.startSeconds;
  const extract = path.join(cacheDir, `${marker.id}.wav`);
  const timeline = path.join(timelineDir, `${marker.id}.json`);
  run("ffmpeg", [
    "-y", "-v", "error", "-i", masterAudio, "-ss", marker.startSeconds.toFixed(6),
    "-t", duration.toFixed(6), "-ac", "1", "-c:a", "pcm_s16le", extract
  ]);
  run("node", [
    path.join(repoRoot, "production/runtime/companion-performance-cli.mjs"), "analyse",
    "--audio", relative(extract), "--output", timeline,
    "--source-start", marker.startSeconds.toFixed(6), "--motion-profile", "longform",
    "--seed", String(1000 + Number(marker.id.slice(1)))
  ]);
}

const config = readJson(sourceConfigPath);
config.companion.performanceAssets = {
  open: "companion-v1-mouth-open",
  wide: "companion-v1-mouth-wide",
  rounded: "companion-v1-mouth-rounded",
  teeth: "companion-v1-mouth-teeth"
};
config.review = { includeTimelineStates: false, temporalSampleSeconds: 10 };
config.output.video = "production/episodes/0000/output/episode-0000-companion-performance-v1.mp4";
config.output.generatedDirectory = "production/episodes/0000/generated/companion-performance-v1";
config.output.reviewDirectory = "production/episodes/0000/output/review/companion-performance-v1";
config.scenes = config.scenes.map((scene) => companionSceneIds.has(scene.id) ? {
  ...scene,
  motion: { ...scene.motion, companionIdle: { periodFrames: 160, translateYPixels: 3.5, scaleAmplitude: 0.008 } },
  companionPerformance: { timeline: `production/episodes/0000/production/companion-performance-v1/${scene.id}.json` }
} : scene);
fs.writeFileSync(outputConfigPath, `${JSON.stringify(config, null, 2)}\n`);
console.log(`Full-episode Companion performance config: ${relative(outputConfigPath)}`);

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function relative(filePath) { return path.relative(repoRoot, filePath); }
function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}`);
}
