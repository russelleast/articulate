import assert from "node:assert/strict";
import test from "node:test";
import { companionPerformanceStateAtFrame, resolveCompanionPerformance } from "../renderer/companion-performance.mjs";

test("Companion performance resolves declarative events to deterministic frames", () => {
  const timeline = resolveCompanionPerformance({ id: "S001", durationSeconds: 5 }, {
    version: 1, seed: 17, layers: ["facial", "lip-sync"], events: [
      { id: "blink-1", type: "blink", at: 1, duration: 0.2 },
      { id: "mouth-1", type: "mouth", at: 2, duration: 0.4, value: "rounded" }
    ]
  }, 25);
  assert.equal(timeline.events[0].startFrame, 25);
  assert.ok(companionPerformanceStateAtFrame(timeline, 27).blink > 0);
  assert.equal(companionPerformanceStateAtFrame(timeline, 52).mouth, "rounded");
  assert.equal(companionPerformanceStateAtFrame(timeline, 80).mouth, "rest");
});

test("Companion performance rejects unsupported visemes", () => {
  assert.throws(() => resolveCompanionPerformance({ id: "S001", durationSeconds: 5 }, {
    version: 1, events: [{ type: "mouth", at: 0, duration: 1, value: "phoneme-perfect" }]
  }, 25), /unsupported viseme/);
});
