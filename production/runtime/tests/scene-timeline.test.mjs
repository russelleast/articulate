import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { renderSceneSvg } from "../renderer/scene-renderer.mjs";
import { resolveSceneTimeline, timelineManifestEntry, timelineStateAtFrame } from "../renderer/scene-timeline.mjs";
import { getVisualGrammarProfile, resolveScenePresentation } from "../renderer/visual-grammar.mjs";

const grammar = getVisualGrammarProfile();

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
