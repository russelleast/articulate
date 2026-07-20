#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const config = read("rough-cut-04-config.json");
const markers = read("rough-cut-04-markers.json");
const markerById = new Map(markers.scenes.map((scene) => [scene.id, scene]));
const sceneById = new Map(config.scenes.map((scene) => [scene.id, scene]));

const expectedBeats = new Map([
  ["S003/not-diagrams", 38], ["S003/not-documentation", 39], ["S003/the-architecture", 41],
  ["S004/questions-title", 50],
  ["S005/new-capabilities", 105], ["S005/trade-offs-node", 107], ["S005/tech-debt-node", 109],
  ["S005/strategy-node", 113], ["S005/future-state", 121],
  ["S006/monitoring", 148],
  ["S008/git", 199], ["S008/terraform", 202], ["S008/mermaid", 205], ["S008/eam", 209],
  ["S011/why-now-title", 291], ["S011/why-now-support", 312],
  ["S013/false-starts-node", 360],
  ["S015/principles-title", 434], ["S015/versioning-node", 441], ["S015/confidence-node", 443],
  ["S015/evidence-node", 446], ["S015/human-control", 459]
]);

for (const [reference, expected] of expectedBeats) {
  const [sceneId, eventId] = reference.split("/");
  const scene = sceneById.get(sceneId);
  const marker = markerById.get(sceneId);
  const located = (scene.shots ?? []).flatMap((shot) => (shot.events ?? []).map((event) => ({ shot, event })))
    .find(({ event }) => event.id === eventId);
  if (!located) throw new Error(`Missing reviewed beat ${reference}`);
  const actual = marker.startSeconds + located.shot.at + (located.event.at ?? 0);
  if (Math.abs(actual - expected) > 0.000001) throw new Error(`${reference} resolves to ${actual.toFixed(3)}; expected ${expected.toFixed(3)}`);
}

if (sceneById.get("S001").items.length !== 0) throw new Error("S001 must not reintroduce unsupported opening options");
if (!sceneById.get("S002").items.includes("Cloud platforms") || !sceneById.get("S002").items.includes("AI systems")) throw new Error("S002 must cover cloud platforms and AI");
if (sceneById.get("S015").items.includes("Runtime")) throw new Error("S015 must not include the removed Runtime option");

for (const sceneId of ["S001", "S004", "S008", "S012", "S013", "S017", "S019"]) {
  const performance = read(path.relative(scriptDir, path.resolve(scriptDir, "../../../..", sceneById.get(sceneId).companionPerformance.timeline)));
  if (!performance.layers.includes("lip-sync") || !performance.events.some((event) => event.type === "mouth")) {
    throw new Error(`${sceneId} must contain deterministic simplified-viseme lip-sync events`);
  }
}

console.log(`Episode 0001 Rough Cut 04 editorial timing passed: ${expectedBeats.size} reviewed beats and seven lip-sync scenes.`);

function read(file) { return JSON.parse(fs.readFileSync(path.resolve(scriptDir, file), "utf8")); }
