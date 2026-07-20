import assert from "node:assert/strict";
import test from "node:test";
import { resolveSceneShots } from "../renderer/scene-shots.mjs";

const scene = {
  id: "S005",
  durationSeconds: 20,
  timeline: { connectorTiming: "with-destination", events: [] },
  shots: [
    { id: "orient", label: "Orient", at: 0, events: [{ id: "question", at: 1, action: "reveal", target: "headline" }] },
    { id: "construct", label: "Construct", at: 8, events: [{ id: "answer", at: 2, action: "reveal", target: "item-1" }] }
  ]
};

test("shot-relative events flatten to scene-relative deterministic timing", () => {
  const resolved = resolveSceneShots(scene, 25);
  assert.equal(resolved.shots.length, 2);
  assert.equal(resolved.shots[1].startFrame, 200);
  assert.equal(resolved.scene.timeline.connectorTiming, "with-destination");
  assert.deepEqual(resolved.scene.timeline.events.map((event) => [event.id, event.at, event.shotId]), [
    ["question", 1, "orient"],
    ["answer", 10, "construct"]
  ]);
});

test("shot events cannot extend into the next shot", () => {
  assert.throws(
    () => resolveSceneShots({ ...scene, shots: [
      { id: "one", at: 0, events: [{ id: "too-long", at: 2, duration: 7, action: "emphasize", target: "headline" }] },
      { id: "two", at: 8, events: [] }
    ] }, 25),
    /extends beyond the shot/
  );
});
