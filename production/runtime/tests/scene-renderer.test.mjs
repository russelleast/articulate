import assert from "node:assert/strict";
import test from "node:test";
import { renderSceneSvg } from "../renderer/scene-renderer.mjs";
import { getVisualGrammarProfile, resolveScenePresentation } from "../renderer/visual-grammar.mjs";

const grammar = getVisualGrammarProfile();

test("repository composition renders episode-authored evidence without Episode 0001 assumptions", () => {
  const scene = {
    id: "S001",
    kind: "journal",
    transition: "cut",
    companion: false,
    headline: "Inspect the source",
    support: "Evidence remains authoritative.",
    items: ["docs/episodes/0002.md", "Canonical journal source"],
    evidence: { excerpt: ["A future episode supplies its own evidence."] },
    narrationReference: "Introduction",
    startSeconds: 0,
    endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);

  const svg = renderSceneSvg(scene, { id: "episode-0002", title: "A Future Episode" }, { width: 1920, height: 1080 }, "", grammar);

  assert.match(svg, /ARTICULATE JOURNAL · EPISODE 0002 · S001/);
  assert.match(svg, /# Episode 0002 – A Future Episode/);
  assert.match(svg, /A future episode supplies its own evidence\./);
  assert.doesNotMatch(svg, /Why Articulate Exists/);
});
