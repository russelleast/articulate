import assert from "node:assert/strict";
import test from "node:test";
import { getVisualGrammarProfile, resolveScenePresentation } from "../renderer/visual-grammar.mjs";

const grammar = getVisualGrammarProfile();

test("legacy scene kinds resolve to grammar archetypes and compositions", () => {
  const presentation = resolveScenePresentation({ id: "S100", kind: "journal", companion: false, transition: "cut" }, grammar);
  assert.equal(presentation.archetype, "Repository");
  assert.equal(presentation.composition, "repository");
  assert.equal(presentation.transition.semantic, "cut");
});

test("legacy section boundaries preserve cut rendering while exposing transition semantics", () => {
  const presentation = resolveScenePresentation({ id: "S100", kind: "change", companion: false, transition: "section" }, grammar);
  assert.equal(presentation.transition.renderMode, "cut");
  assert.equal(presentation.transition.compatibility, true);
});

test("unknown presentation vocabulary fails validation", () => {
  assert.throws(
    () => resolveScenePresentation({ id: "S100", kind: "special-episode-layout", transition: "cut" }, grammar),
    /unsupported visual kind/
  );
});

test("Architectural Studio resolves as a reusable Narrator composition", () => {
  const presentation = resolveScenePresentation({ id: "S100", kind: "studio", companion: true, transition: "cut" }, grammar);
  assert.equal(presentation.archetype, "Narrator");
  assert.equal(presentation.composition, "studio");
  assert.equal(grammar.motion.companionIdle.renderMode, "frame-indexed");
});
