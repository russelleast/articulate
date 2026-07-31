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

test("episode environments resolve without introducing scene-specific kinds", () => {
  assert.equal(resolveScenePresentation({ id: "S101", kind: "whiteboard", companion: false, transition: "cut" }, grammar).composition, "whiteboard");
  assert.equal(resolveScenePresentation({ id: "S102", kind: "workspace", companion: false, transition: "cut" }, grammar).composition, "workspace");
  assert.equal(resolveScenePresentation({ id: "S103", kind: "focus", companion: false, transition: "cut" }, grammar).composition, "focus");
});

test("presenter grammar resolves reusable human narrator and Focus Canvas modes", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const presenter = resolveScenePresentation({ id: "S200", kind: "presenter", transition: "cut" }, presenterGrammar);
  const canvas = resolveScenePresentation({
    id: "S201",
    kind: "focus-canvas",
    compositionMode: "presenter-left-canvas-right",
    transition: "cut"
  }, presenterGrammar);
  assert.equal(presenter.archetype, "Presenter");
  assert.equal(presenter.composition, "presenter-full");
  assert.equal(canvas.archetype, "Focus Canvas");
  assert.equal(canvas.composition, "presenter-left-canvas-right");
});

test("presenter grammar rejects legacy and incompatible composition modes", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  assert.throws(
    () => resolveScenePresentation({ id: "S202", kind: "focus-canvas", compositionMode: "evidence-full", transition: "cut" }, presenterGrammar),
    /unsupported composition mode/
  );
});
