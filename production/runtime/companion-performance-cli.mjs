#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

const args = process.argv.slice(2);
if (args[0] !== "analyse") {
  console.error("Usage: node production/runtime/companion-performance-cli.mjs analyse --audio PATH --output PATH --source-start SECONDS [--motion-profile experiment|longform] [--seed INTEGER] [--motion-only]");
  process.exit(2);
}
const audio = value("--audio");
const output = value("--output");
const sourceStart = Number(value("--source-start") ?? 0);
const motionProfile = value("--motion-profile") ?? "experiment";
const seed = Number(value("--seed") ?? 1701);
const motionOnly = args.includes("--motion-only");
if (!audio || !output || !Number.isFinite(sourceStart)) throw new Error("audio, output and numeric source-start are required");
if (!new Set(["experiment", "longform"]).has(motionProfile)) throw new Error(`Unsupported motion profile '${motionProfile}'`);
if (!Number.isInteger(seed)) throw new Error("seed must be an integer");

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
const durationSeconds = states.length / frameRate;
const events = motionProfile === "longform"
  ? longformMotionEvents(durationSeconds, seed)
  : [
      { id: "blink-01", type: "blink", at: 3.12, duration: 0.20 },
      { id: "head-settle-01", type: "head", at: 5.80, duration: 2.80, value: { x: 6.0, y: 1.8, rotation: 1.0 } },
      { id: "blink-02", type: "blink", at: 10.84, duration: 0.24 },
      { id: "posture-01", type: "head", at: 12.80, duration: 2.70, value: { x: -5.0, y: 2.6, rotation: -0.75 } }
    ];
if (!motionOnly) {
  let start = 0;
  for (let frame = 1; frame <= states.length; frame++) {
    if (frame < states.length && states[frame] === states[start]) continue;
    const viseme = states[start];
    if (viseme !== "rest") events.push({ id: `mouth-${String(start).padStart(4, "0")}`, type: "mouth", at: start / frameRate, duration: (frame - start) / frameRate, value: viseme });
    start = frame;
  }
}
events.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
const document = {
  version: 1,
  seed,
  source: { audio, sha256: crypto.createHash("sha256").update(fs.readFileSync(audio)).digest("hex"), sourceStartSeconds: sourceStart, durationSeconds, frameRate, sampleRateHz: sampleRate },
  analysis: { method: "offline-rms-zero-crossing-v1", motionProfile, speechFloor, noiseFloor, visemeModel: motionOnly ? [] : ["rest", "open", "wide", "rounded", "teeth"], smoothing: "three-frame weighted energy and zero-crossing window; isolated non-rest frame suppression", motionOnly },
  layers: motionOnly ? ["idle", "facial"] : ["idle", "facial", "lip-sync"],
  events
};
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(document, null, 2)}\n`);
console.log(`Companion performance: ${output} (${events.length} events)`);

function value(flag) { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; }

function longformMotionEvents(duration, randomSeed) {
  const random = mulberry32(randomSeed >>> 0);
  const result = [];
  let blinkAt = 2.8 + random() * 1.5;
  let blinkIndex = 1;
  while (blinkAt + 0.25 < duration) {
    const blinkDuration = round(0.18 + random() * 0.06);
    result.push({ id: `blink-${String(blinkIndex).padStart(2, "0")}`, type: "blink", at: round(blinkAt), duration: blinkDuration });
    blinkAt += 5.6 + random() * 2.6;
    blinkIndex++;
  }
  const poses = [
    { fraction: 0.32, duration: 2.8, value: { x: 5.0, y: 1.8, rotation: 0.8 } },
    { fraction: 0.72, duration: 2.7, value: { x: -4.0, y: 2.2, rotation: -0.65 } }
  ];
  for (const [index, pose] of poses.entries()) {
    const at = round(duration * pose.fraction);
    if (at + pose.duration <= duration) result.push({ id: `head-${String(index + 1).padStart(2, "0")}`, type: "head", at, duration: pose.duration, value: pose.value });
  }
  return result;
}

function mulberry32(seedValue) {
  return () => {
    let value = seedValue += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function round(number) { return Number(number.toFixed(3)); }
