#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
if (args[0] !== "analyse") {
  console.error("Usage: node production/runtime/companion-performance-cli.mjs analyse --audio PATH --output PATH --source-start SECONDS");
  process.exit(2);
}
const audio = value("--audio");
const output = value("--output");
const sourceStart = Number(value("--source-start") ?? 0);
if (!audio || !output || !Number.isFinite(sourceStart)) throw new Error("audio, output and numeric source-start are required");

const sampleRate = 16000;
const frameRate = 25;
const decoded = spawnSync("ffmpeg", ["-v", "error", "-i", audio, "-ac", "1", "-ar", String(sampleRate), "-f", "s16le", "-"], { encoding: null, maxBuffer: 32 * 1024 * 1024 });
if (decoded.status !== 0) throw new Error(decoded.stderr.toString());
const samples = new Int16Array(decoded.stdout.buffer, decoded.stdout.byteOffset, Math.floor(decoded.stdout.byteLength / 2));
const samplesPerFrame = sampleRate / frameRate;
const features = [];
for (let offset = 0; offset + samplesPerFrame <= samples.length; offset += samplesPerFrame) {
  let energy = 0;
  let crossings = 0;
  let previous = samples[offset];
  for (let index = offset; index < offset + samplesPerFrame; index++) {
    const current = samples[index];
    energy += current * current;
    if ((current >= 0) !== (previous >= 0)) crossings++;
    previous = current;
  }
  features.push({ rms: Math.sqrt(energy / samplesPerFrame) / 32768, zcr: crossings / samplesPerFrame });
}
const sortedEnergy = features.map((feature) => feature.rms).sort((a, b) => a - b);
const noiseFloor = sortedEnergy[Math.floor(sortedEnergy.length * 0.18)] ?? 0;
const speechFloor = Math.max(0.012, noiseFloor * 2.35);
const states = features.map((feature, index) => {
  const previous = features[Math.max(0, index - 1)];
  const next = features[Math.min(features.length - 1, index + 1)];
  const rms = (previous.rms + feature.rms * 2 + next.rms) / 4;
  const zcr = (previous.zcr + feature.zcr * 2 + next.zcr) / 4;
  if (rms < speechFloor) return "rest";
  if (zcr > 0.19) return "teeth";
  if (zcr > 0.115) return "wide";
  if (rms > 0.105) return "open";
  if (zcr < 0.055) return "rounded";
  return "open";
});

// Remove one-frame chatter while preserving closures that make rhythm legible.
for (let index = 1; index < states.length - 1; index++) {
  if (states[index - 1] === states[index + 1] && states[index] !== "rest") states[index] = states[index - 1];
}
const events = [
  { id: "blink-01", type: "blink", at: 3.12, duration: 0.20 },
  { id: "head-settle-01", type: "head", at: 5.80, duration: 2.80, value: { x: 6.0, y: 1.8, rotation: 1.0 } },
  { id: "blink-02", type: "blink", at: 10.84, duration: 0.24 },
  { id: "posture-01", type: "head", at: 12.80, duration: 2.70, value: { x: -5.0, y: 2.6, rotation: -0.75 } }
];
let start = 0;
for (let frame = 1; frame <= states.length; frame++) {
  if (frame < states.length && states[frame] === states[start]) continue;
  const viseme = states[start];
  if (viseme !== "rest") events.push({ id: `mouth-${String(start).padStart(4, "0")}`, type: "mouth", at: start / frameRate, duration: (frame - start) / frameRate, value: viseme });
  start = frame;
}
events.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
const document = {
  version: 1,
  seed: 1701,
  source: { audio, sourceStartSeconds: sourceStart, durationSeconds: states.length / frameRate, frameRate, sampleRateHz: sampleRate },
  analysis: { method: "offline-rms-zero-crossing-v1", speechFloor, noiseFloor, visemeModel: ["rest", "open", "wide", "rounded", "teeth"], smoothing: "three-frame weighted energy and zero-crossing window; isolated non-rest frame suppression" },
  layers: ["idle", "facial", "lip-sync"],
  events
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Companion performance: ${output} (${events.length} events)`);

function value(flag) { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; }
