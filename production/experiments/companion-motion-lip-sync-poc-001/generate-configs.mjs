import fs from "node:fs";
import path from "node:path";
const root = path.dirname(new URL(import.meta.url).pathname);
const baseline = JSON.parse(fs.readFileSync(path.join(root, "config/baseline.json"), "utf8"));
for (const variant of [
  { file: "motion-only.resolved.json", label: "B-motion-only", timeline: "production/experiments/companion-motion-lip-sync-poc-001/performance/motion-only.json", lip: false },
  { file: "motion-lip-sync.resolved.json", label: "C-motion-lip-sync", timeline: "production/experiments/companion-motion-lip-sync-poc-001/performance/lip-sync.json", lip: true }
]) {
  const config = structuredClone(baseline);
  config.scenes[0].productionLabel = `Companion Performance PoC 001 · ${variant.label[0]}`;
  config.scenes[0].motion = { companionIdle: { periodFrames: 160, translateYPixels: 3.5, scaleAmplitude: 0.008 } };
  config.scenes[0].companionPerformance = { timeline: variant.timeline };
  if (variant.lip) config.companion.performanceAssets = {
    open: "companion-v1-mouth-open",
    wide: "companion-v1-mouth-wide",
    rounded: "companion-v1-mouth-rounded",
    teeth: "companion-v1-mouth-teeth"
  };
  config.output.video = `production/experiments/companion-motion-lip-sync-poc-001/output/${variant.label}.mp4`;
  config.output.generatedDirectory = `production/experiments/companion-motion-lip-sync-poc-001/generated/${variant.label}`;
  config.output.reviewDirectory = `production/experiments/companion-motion-lip-sync-poc-001/output/review/${variant.label}`;
  fs.writeFileSync(path.join(root, "config", variant.file), `${JSON.stringify(config, null, 2)}\n`);
}
