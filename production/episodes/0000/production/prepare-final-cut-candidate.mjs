#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const basePrepare = path.join(scriptDir, "prepare-companion-performance.mjs");
const baseConfigPath = path.join(scriptDir, "companion-performance-v1-config.json");
const baseMarkersPath = path.join(scriptDir, "narration-markers.json");
const markersPath = path.join(scriptDir, "final-cut-candidate-v2-markers.json");
const configPath = path.join(scriptDir, "final-cut-candidate-v2-config.json");

run("node", [basePrepare]);

const markers = readJson(baseMarkersPath);
const preserve = markers.scenes.find((scene) => scene.id === "S006");
const build = markers.scenes.find((scene) => scene.id === "S007");
preserve.endSeconds = 138.000000;
build.startSeconds = 138.000000;
markers.timingRevision = "final-cut-candidate-v2";
markers.reviewNote = "S006/S007 boundary moved to 02:18.000 following full-episode human review.";
writeJson(markersPath, markers);

const config = readJson(baseConfigPath);
config.episode.timingMarkers = relative(markersPath);
config.review = { includeTimelineStates: true, temporalSampleSeconds: 5 };
config.output.video = "production/episodes/0000/output/episode-0000-final-cut-candidate-v2.mp4";
config.output.generatedDirectory = "production/episodes/0000/generated/final-cut-candidate-v2";
config.output.reviewDirectory = "production/episodes/0000/output/review/final-cut-candidate-v2";

for (const scene of config.scenes) {
  if (scene.timeline?.events?.some((event) => event.action === "connect")) {
    scene.timeline.connectorTiming = "with-destination";
  }
  if (scene.id === "S001") {
    scene.items = ["Experienced systems perspective"];
    scene.timeline.events = scene.timeline.events.filter((event) => event.target !== "item-2");
  }
  if (scene.id === "S002") {
    scene.items = ["Knowledge becomes fragmented", "Documentation falls behind", "Decisions lose context"];
    scene.timeline.events = scene.timeline.events.filter((event) => ["changed", "remain", "knowledge", "documentation", "decisions"].includes(event.id));
    setEvent(scene, "knowledge", 30.000000 - 14.588027);
    setEvent(scene, "documentation", 31.000000 - 14.588027);
    setEvent(scene, "decisions", 33.000000 - 14.588027);
  }
  if (scene.id === "S005") {
    scene.timeline.events = scene.timeline.events.filter((event) => event.id !== "hold-revision");
  }
  if (scene.id === "S008") {
    scene.studioLayout = "companion-model-v2";
  }
  if (scene.id === "S009") {
    for (const id of ["ai-native", "agentic", "durable", "memory"]) {
      const event = scene.timeline.events.find((candidate) => candidate.id === id);
      event.at = Number((event.at - 1).toFixed(3));
    }
  }
}

writeJson(configPath, config);
console.log(`Episode 0000 final-cut candidate: ${relative(configPath)}`);

function setEvent(scene, id, at) {
  const event = scene.timeline.events.find((candidate) => candidate.id === id);
  if (!event) throw new Error(`${scene.id} is missing timeline event ${id}`);
  event.at = Number(at.toFixed(6));
}
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function relative(filePath) { return path.relative(repoRoot, filePath); }
function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}`);
}
