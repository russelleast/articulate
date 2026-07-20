#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const markers = readJson(path.join(scriptDir, "rough-cut-04-markers.json"));
const masterAudio = path.join(repoRoot, "production/narrator/Articulate-Ep1.wav");
const cacheDir = path.join(repoRoot, "production/cache/episode-0001/rough-cut-04-companion");
const timelineDir = path.join(scriptDir, "rough-cut-04-companion");
const companionSceneIds = new Set(["S001", "S004", "S008", "S012", "S013", "S017", "S019"]);

if (!fs.existsSync(masterAudio)) throw new Error(`Missing approved narration: ${masterAudio}`);
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(timelineDir, { recursive: true });

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
    "--seed", String(2000 + Number(marker.id.slice(1)))
  ]);
}

console.log(`Episode 0001 Rough Cut 04 Companion timelines: ${relative(timelineDir)}`);

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}`);
}
