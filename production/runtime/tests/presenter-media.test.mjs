import assert from "node:assert/strict";
import test from "node:test";
import {
  presenterDurationSeconds,
  presenterFilterGraph,
  validatePresenterMedia
} from "../renderer/presenter-media.mjs";

const output = { width: 1920, height: 1080, frameRate: 30 };
const presenter = {
  implementation: "continuous-video",
  assetId: "episode-presenter",
  audio: "embedded",
  startOffsetSeconds: 2,
  endOffsetSeconds: 12
};

test("presenter duration derives from one continuous source window", () => {
  assert.equal(presenterDurationSeconds(presenter, 20), 10);
});

test("presenter composition keeps one continuous audio and video source", () => {
  const scenes = [
    scene("S001", "presenter-full", 0, 4),
    scene("S002", "canvas-full", 4, 7),
    scene("S003", "canvas-left-presenter-right", 7, 10)
  ];
  const graph = presenterFilterGraph({ presenter, scenes, output, durationSeconds: 10 });
  assert.match(graph, /\[1:v\]trim=start=2\.000000:end=12\.000000/);
  assert.match(graph, /\[1:a\]atrim=start=2\.000000:end=12\.000000/);
  assert.match(graph, /enable='gte\(t,0\.000000\)\*lt\(t,4\.000000\)'/);
  assert.match(graph, /enable='gte\(t,7\.000000\)\*lt\(t,10\.000000\)'/);
  assert.doesNotMatch(graph, /gte\(t,4\.000000\).*lt\(t,7\.000000\)/);
});

test("presenter validation rejects Companion behaviour and missing embedded audio", () => {
  const errors = validatePresenterMedia({
    config: { presenter },
    asset: { id: "episode-presenter", type: "presenter-video" },
    probe: {
      format: { duration: 20 },
      streams: [{ codec_type: "video" }]
    },
    scenes: [{ ...scene("S001", "presenter-full", 0, 10), companion: true }]
  });
  assert.match(errors.join("\n"), /embedded audio/);
  assert.match(errors.join("\n"), /Companion behaviour/);
});

function scene(id, composition, startSeconds, endSeconds) {
  return { id, startSeconds, endSeconds, presentation: { composition } };
}
