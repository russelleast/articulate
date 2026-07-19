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

test("studio composition integrates the working surface and deterministic Companion idle motion", () => {
  const scene = {
    id: "S001", kind: "studio", transition: "cut", companion: true,
    headline: "The Companion", support: "A different relationship",
    items: ["Prompt", "Answer", "Persistent collaborator", "Discover", "Challenge", "Reason", "Preserve", "Understand"],
    narrationReference: "The Companion", startSeconds: 0, endSeconds: 10,
    motion: { companionIdle: true }
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const svg0 = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "companion.png", grammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 });
  const svg25 = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "companion.png", grammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 25 });
  assert.match(svg0, /ARCHITECTURAL STUDIO/);
  assert.match(svg0, /AI-created visual Companion/);
  assert.notEqual(svg0, svg25);
});

test("studio connectors use distinct source ports and tangent-aligned arrowheads", () => {
  const scene = {
    id: "S001", kind: "studio", transition: "cut", companion: true,
    headline: "The Companion", support: "A different relationship",
    items: ["Prompt", "Answer", "Persistent collaborator", "Discover", "Challenge", "Reason", "Preserve", "Understand"],
    narrationReference: "The Companion", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const connections = new Map([
    ["one", { from: "item-3", to: "item-4", directional: true }],
    ["two", { from: "item-3", to: "item-6", directional: true }]
  ]);
  const svg = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "companion.png", grammar, { hidden: new Set(), emphasized: new Set(), connections, text: new Map(), frame: 0 });
  const starts = [...svg.matchAll(/data-connection="item-3-item-[46]" d="M ([0-9.]+) ([0-9.]+)/g)].map((match) => match[1]);
  assert.equal(new Set(starts).size, 2);
  assert.match(svg, /markerUnits="userSpaceOnUse" orient="auto"/);
  assert.match(svg, /stroke-linejoin="round" marker-end="url\(#studio-arrow\)"/);
});

test("environment compositions retain shared Articulate world chrome", () => {
  for (const [kind, expected] of [["whiteboard", "ARCHITECTURAL WHITEBOARD"], ["workspace", "DIGITAL WORKSPACE"], ["focus", "FOCUS CANVAS"]]) {
    const scene = {
      id: `S-${kind}`, kind, transition: "cut", companion: false,
      headline: "A working idea", support: "Evidence develops with narration.", items: ["First", "Second"],
      evidence: { excerpt: ["Canonical evidence"] }, narrationReference: "Test", startSeconds: 0, endSeconds: 10
    };
    scene.presentation = resolveScenePresentation(scene, grammar);
    const svg = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "", grammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 });
    assert.match(svg, new RegExp(expected));
    assert.match(svg, /ARTICULATE/);
  }
});

test("radial evidence retains directional relationships when no connection timeline is authored", () => {
  const scene = {
    id: "S011", kind: "evidence", transition: "cut", companion: false,
    headline: "Reason across evidence", support: "Relationships must remain visible.",
    items: ["Documents", "Code", "Decisions", "Signals"],
    narrationReference: "Why now", startSeconds: 0, endSeconds: 10,
    durationSeconds: 10, timeline: { events: [] }
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const state = { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 };
  const svg = renderSceneSvg(scene, { id: "episode-0001", title: "Why Articulate Exists" }, { width: 1920, height: 1080 }, "", grammar, state);
  assert.equal([...svg.matchAll(/data-connection=/g)].length, 4);
  assert.equal([...svg.matchAll(/marker-end="url\(#direction-arrow\)"/g)].length, 4);
});

test("production treatment can suppress scene identifiers, timings and diagnostic narration labels", () => {
  const scene = {
    id: "S004", kind: "whiteboard", transition: "cut", companion: false,
    headline: "A question", support: "Follow the narration.", items: ["Why?"],
    narrationReference: "Diagnostic narration reference", startSeconds: 61.104, endSeconds: 88.719,
    productionMetadata: false
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const svg = renderSceneSvg(scene, { id: "episode-0001", title: "Why Articulate Exists" }, { width: 1920, height: 1080 }, "", grammar);
  assert.doesNotMatch(svg, /S004|61\.104|88\.719|Diagnostic narration reference/);
  assert.match(svg, /ARTICULATE JOURNAL/);
});
