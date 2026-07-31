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

test("soft luminance compositing derives and feathers a stable alpha mask", () => {
  const blendedPresenter = {
    ...presenter,
    compositing: {
      mode: "soft-luma-key",
      applyTo: ["presenter-focus"],
      darkThreshold: 0.04,
      softThresholdRange: 0.2,
      maskFeatherRadius: 3,
      minimumRetainedOpacity: 0.03,
      maskContrast: 1.08,
      edgeVignetteRadius: 40,
      darkHaloSuppression: 0.1,
      temporalSmoothing: 2
    },
    framing: {
      "presenter-focus": { x: -20, y: 641, width: 780, height: 439 }
    }
  };
  const scenes = [
    scene("S001", "presenter-focus", 0, 5),
    scene("S002", "presenter-full", 5, 10)
  ];
  const graph = presenterFilterGraph({ presenter: blendedPresenter, scenes, output, durationSeconds: 10 });

  assert.match(graph, /format=gray/);
  assert.match(graph, /scale=in_range=tv:out_range=full/);
  assert.match(graph, /hqdn3d=/);
  assert.match(graph, /lut=y=/);
  assert.match(graph, /gblur=sigma=3\.0000,format=gray,geq=lum=/);
  assert.match(graph, /alphamerge\[presenter-0\]/);
  assert.match(graph, /\[presenter-source-1\]trim=start=5\.000000:end=10\.000000,setpts=PTS-STARTPTS\+5\.000000\/TB,scale=1920:1080:flags=lanczos\[presenter-1\]/);
  assert.doesNotMatch(graph, /alphamerge\[presenter-1\]/);
  assert.match(graph, /overlay=x=-20:y=641/);
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

test("presenter validation rejects invalid compositing controls", () => {
  const errors = validatePresenterMedia({
    config: {
      presenter: {
        ...presenter,
        compositing: {
          mode: "hard-key",
          minimumRetainedOpacity: 2,
          applyTo: ["canvas-full"]
        }
      }
    },
    asset: { id: "episode-presenter", type: "presenter-video" },
    probe: {
      format: { duration: 20 },
      streams: [{ codec_type: "video" }, { codec_type: "audio" }]
    },
    scenes: [scene("S001", "presenter-full", 0, 10)]
  });
  assert.match(errors.join("\n"), /Unsupported presenter compositing mode/);
  assert.match(errors.join("\n"), /minimumRetainedOpacity/);
  assert.match(errors.join("\n"), /applyTo/);
});

function scene(id, composition, startSeconds, endSeconds) {
  return { id, startSeconds, endSeconds, presentation: { composition } };
}
