import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { renderSceneSvg } from "../renderer/scene-renderer.mjs";
import { resolveSceneTimeline, sceneFrameWindow, timelineManifestEntry, timelineStateAtFrame } from "../renderer/scene-timeline.mjs";
import { getVisualGrammarProfile, resolveScenePresentation } from "../renderer/visual-grammar.mjs";

const grammar = getVisualGrammarProfile();

test("adjacent scenes allocate against global frame boundaries without cumulative drift", () => {
  const first = sceneFrameWindow({ startSeconds: 12.872, endSeconds: 30.031 }, 25);
  const second = sceneFrameWindow({ startSeconds: 30.031, endSeconds: 61.104 }, 25);
  assert.equal(first.endFrame, second.startFrame);
  assert.equal(first.frameCount + second.frameCount, second.endFrame - first.startFrame);
});

function scene(overrides = {}) {
  const value = {
    episodeId: "episode-test",
    id: "S100",
    kind: "questions",
    transition: "cut",
    companion: false,
    headline: "A question",
    support: "Follow the argument.",
    items: ["First", "Second"],
    narrationReference: "Test",
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10,
    ...overrides
  };
  return { ...value, presentation: resolveScenePresentation(value, grammar) };
}

test("event offsets resolve to stable integer frames and manifest data", () => {
  const value = scene({ timeline: { events: [{ id: "show", at: 4.25, duration: 0.4, action: "reveal", target: "item-1" }] } });
  const timeline = resolveSceneTimeline(value, 25, grammar);
  assert.equal(timeline.events[0].startFrame, 106);
  assert.equal(timeline.events[0].endFrame, 116);
  assert.equal(timelineManifestEntry(timeline).resolvedEvents[0].treatment, "grammar-reveal-v1");
});

test("reveal state hides a target until its resolved frame", () => {
  const value = scene({ timeline: { events: [{ at: 2, action: "reveal", target: "item-1" }] } });
  const timeline = resolveSceneTimeline(value, 25, grammar);
  assert.equal(timelineStateAtFrame(value, timeline, 49).hidden.has("item-1"), true);
  assert.equal(timelineStateAtFrame(value, timeline, 50).hidden.has("item-1"), false);
});

test("directional connections render with grammar-approved arrowheads", () => {
  const value = scene({
    kind: "projections",
    items: ["View"],
    timeline: { events: [{ at: 0, action: "connect", from: "centre", to: "item-1" }] }
  });
  value.presentation = resolveScenePresentation(value, grammar);
  const timeline = resolveSceneTimeline(value, 25, grammar);
  const svg = renderSceneSvg(value, { id: "episode-test", title: "Test" }, { width: 1920, height: 1080 }, "", grammar, timelineStateAtFrame(value, timeline, 0));
  assert.match(svg, /marker-end="url\(#direction-arrow\)"/);
  assert.match(svg, /data-connection="centre-item-1"/);
});

test("diagram connectors can synchronize with the destination box reveal", () => {
  const value = scene({ timeline: { connectorTiming: "with-destination", events: [
    { id: "first", at: 1, action: "reveal", target: "item-1" },
    { id: "second", at: 3, action: "reveal", target: "item-2" },
    { id: "first-second", at: 4, action: "connect", from: "item-1", to: "item-2" }
  ] } });
  const timeline = resolveSceneTimeline(value, 25, grammar);
  const connector = timeline.events.find((event) => event.action === "connect");
  assert.equal(connector.startFrame, 75);
  assert.equal(timelineStateAtFrame(value, timeline, 74).connections.size, 0);
  assert.equal(timelineStateAtFrame(value, timeline, 75).connections.size, 1);
  assert.match(timeline.warnings[0], /synchronized/);
});

test("Repository typing is progressive and deterministic", () => {
  const value = scene({
    kind: "journal",
    items: ["source.md", "Canonical"],
    evidence: { excerpt: ["Architecture is evidence."] },
    timeline: { events: [{ at: 1, duration: 2, action: "type", target: "evidence-1" }] }
  });
  value.presentation = resolveScenePresentation(value, grammar);
  const timeline = resolveSceneTimeline(value, 25, grammar);
  const state = timelineStateAtFrame(value, timeline, 49);
  assert.ok(state.text.get("evidence-1").length > 0);
  assert.ok(state.text.get("evidence-1").length < value.evidence.excerpt[0].length);
  const render = () => renderSceneSvg(value, { id: "episode-test", title: "Test" }, { width: 1920, height: 1080 }, "", grammar, state);
  assert.equal(crypto.createHash("sha256").update(render()).digest("hex"), crypto.createHash("sha256").update(render()).digest("hex"));
});

test("unknown targets and events beyond the scene fail with editorial context", () => {
  assert.throws(
    () => resolveSceneTimeline(scene({ timeline: { events: [{ id: "bad-target", at: 1, action: "reveal", target: "missing" }] } }), 25, grammar),
    /episode=episode-test scene=S100 event=bad-target at=1s target=missing: unknown target/
  );
  assert.throws(
    () => resolveSceneTimeline(scene({ timeline: { events: [{ id: "late", at: 9, duration: 2, action: "emphasize", target: "headline" }] } }), 25, grammar),
    /event ends outside scene duration/
  );
});

test("overlapping incompatible target actions fail validation", () => {
  assert.throws(
    () => resolveSceneTimeline(scene({ timeline: { events: [
      { id: "strong", at: 2, duration: 3, action: "emphasize", target: "headline" },
      { id: "hide", at: 3, duration: 1, action: "hide", target: "headline" }
    ] } }), 25, grammar),
    /overlapping incompatible actions/
  );
});

test("scenes without a timeline retain their complete static state", () => {
  const value = scene();
  const timeline = resolveSceneTimeline(value, 25, grammar);
  assert.deepEqual(timeline.events, []);
  assert.deepEqual([...timelineStateAtFrame(value, timeline, 0).hidden], []);
});
