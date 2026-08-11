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

test("reviewed Companion model layouts route cleanly between separated nodes", () => {
  const scene = {
    id: "S012", kind: "studio", studioLayout: "companion-model", studioModelLayout: "converge", transactionLabel: false,
    transition: "cut", companion: true, headline: "Augment architectural thinking",
    support: "Humans retain judgement.", items: ["Human context", "AI-assisted synthesis", "Architectural judgement"],
    narrationReference: "Why now", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const connections = new Map([
    ["human", { from: "item-1", to: "item-3", directional: true }],
    ["ai", { from: "item-2", to: "item-3", directional: true }]
  ]);
  const svg = renderSceneSvg(scene, { id: "episode-0001", title: "Why Articulate Exists" }, { width: 1920, height: 1080 }, "companion.png", grammar, { hidden: new Set(), emphasized: new Set(), connections, text: new Map(), frame: 0 });
  assert.equal([...svg.matchAll(/data-connection=/g)].length, 2);
  assert.equal([...svg.matchAll(/marker-end="url\(#studio-arrow\)"/g)].length, 2);
  assert.match(svg, /x="970" y="665" width="500" height="116"/);
});

test("attention shift treatment replaces the ambiguous balance-scale metaphor", () => {
  const scene = {
    id: "S016", kind: "focus", focusLayout: "shift", transition: "cut", companion: false,
    headline: "Less searching. More meaningful change.", support: "Shift attention.",
    items: ["Searching", "Information retrieval", "Reasoning", "Meaningful change"],
    narrationReference: "Success", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const svg = renderSceneSvg(scene, { id: "episode-0001", title: "Why Articulate Exists" }, { width: 1920, height: 1080 }, "", grammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 });
  assert.match(svg, /TIME SPENT FINDING/);
  assert.match(svg, /TIME ENABLED FOR CHANGE/);
  assert.match(svg, /SHIFT ATTENTION/);
  assert.doesNotMatch(svg, /L 1000 760 L 840 760 Z/);
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

test("presenter Evidence can render alternatives without implying a selection", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-EVIDENCE", kind: "presenter-evidence", transition: "cut", companion: false,
    headline: "Several plausible alternatives", support: "Not yet a comparison.",
    items: ["One", "Two", "Three", "Four"], evidence: { emphasisIndex: -1 },
    narrationReference: "Alternatives", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0010", title: "Runtime" }, { width: 1920, height: 1080 }, "", presenterGrammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 });
  assert.equal([...svg.matchAll(/fill="#1d313a"/g)].length, 4);
  assert.doesNotMatch(svg, /fill="#38261f"/);
});

test("diagram scenes embed a resolved reusable SVG asset", () => {
  const scene = {
    id: "S-D2", kind: "diagram", transition: "cut", companion: false,
    headline: "Reason over context", support: "The D2 source remains canonical.",
    diagramAssetId: "knowledge-reasoning-flow", items: [],
    narrationReference: "Knowledge reasoning", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const data = "data:image/svg+xml;base64,PHN2Zy8+";
  const svg = renderSceneSvg(scene, { id: "episode-0008", title: "Knowledge Reasoning" }, { width: 1920, height: 1080 }, "", grammar, null, data);
  assert.match(svg, /data-diagram-asset="knowledge-reasoning-flow"/);
  assert.match(svg, /data-diagram-profile="video-dark"/);
  assert.match(svg, /href="data:image\/svg\+xml;base64,PHN2Zy8\+"/);
});

test("whiteboard capability maps place a child capability beneath its parent", () => {
  const scene = {
    id: "S011", kind: "whiteboard", diagramLayout: "capability-map", transition: "cut", companion: false,
    headline: "Capabilities", support: "A capability shape.",
    items: ["Discover", "Preserve", "Understand change", "Explore", "Visualise"],
    narrationReference: "Capabilities", startSeconds: 0, endSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  const svg = renderSceneSvg(scene, { id: "episode-0002", title: "What Is Articulate?" }, { width: 1920, height: 1080 }, "", grammar, { hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0 });
  assert.match(svg, /x="1380" y="500" width="320" height="112"/);
  assert.match(svg, /x="1380" y="720" width="320" height="112"/);
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

test("Focus Canvas v2 supports side-by-side presenter composition without whiteboard styling", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-PRESENTER-CANVAS",
    kind: "focus-canvas",
    compositionMode: "presenter-left-canvas-right",
    transition: "cut",
    headline: "Decisions have consequences",
    support: "Architecture unfolds over time.",
    items: ["Decision", "Consequence"],
    canvasLayout: "flow",
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "", presenterGrammar, {
    hidden: new Set(),
    emphasized: new Set(),
    connections: new Map(),
    text: new Map(),
    frame: 0
  });
  assert.match(svg, /FOCUS CANVAS/);
  assert.match(svg, /x="1010" y="132" width="838" height="838"/);
  assert.doesNotMatch(svg, /WHITEBOARD|f6f2e9/);
});

test("presenter teaching compositions progressively reveal addressable architectural concepts", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-TEACHING",
    kind: "presenter-diagram",
    transition: "cut",
    teachingLayout: "horizontal-progression",
    headline: "Reasoning before agents",
    support: "Agent behaviour appears last.",
    items: ["Problem", "Reasoning capability", "Required knowledge", "Agent behaviour"],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const state = {
    hidden: new Set(["item-3", "item-4"]),
    emphasized: new Set(["item-2"]),
    connections: new Map(),
    text: new Map(),
    frame: 0
  };
  const svg = renderSceneSvg(scene, { id: "episode-0008", title: "Knowledge Reasoning" }, { width: 1920, height: 1080 }, "", presenterGrammar, state);
  assert.match(svg, /data-element="item-1"/);
  assert.match(svg, /data-element="item-2" class="emphasized"/);
  assert.doesNotMatch(svg, /Required knowledge|data-element="item-4"/);
  assert.match(svg, /marker-end="url\(#presenter-arrow\)"/);
});

test("concept decomposition keeps one focus and at most three peer concepts comfortably framed", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-CONCEPT-STATES",
    kind: "presenter-diagram",
    transition: "cut",
    teachingLayout: "concept-decomposition",
    headline: "Describe the capability",
    support: "Each frame is one complete conceptual state.",
    items: ["Capability", "Intent", "Governance", "Integrity & lifecycle"],
    details: ["implementation-independent", "outcomes · behaviour", "rules · policies", "invariants · effects · lifecycle"],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0009", title: "Defining Architectural Behaviour with DCL" }, { width: 1920, height: 1080 }, "", presenterGrammar, {
    hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0
  });
  assert.match(svg, /data-element="item-1"/);
  assert.match(svg, /Integrity &amp; lifecycle/);
  assert.equal([...svg.matchAll(/marker-end="url\(#presenter-arrow\)"/g)].length, 3);
  assert.equal([...svg.matchAll(/data-element="item-/g)].length, 4);
});

test("teaching connectors require visible endpoints and completed states use canonical diagrams", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-GRAPH",
    kind: "presenter-diagram",
    transition: "cut",
    teachingLayout: "graph-traversal",
    diagramAssetId: "graphrag-traversal",
    headline: "Traverse connected knowledge",
    support: "Relationships carry meaning.",
    items: ["Capability", "Application", "Integration"],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const progressive = renderSceneSvg(scene, { id: "episode-0008", title: "Knowledge Reasoning" }, { width: 1920, height: 1080 }, "", presenterGrammar, {
    hidden: new Set(["item-3"]), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0
  }, "data:image/svg+xml;base64,PHN2Zy8+");
  assert.equal([...progressive.matchAll(/marker-end="url\(#presenter-arrow\)"/g)].length, 1);
  assert.doesNotMatch(progressive, /data-element="item-3"/);

  const complete = renderSceneSvg(scene, { id: "episode-0008", title: "Knowledge Reasoning" }, { width: 1920, height: 1080 }, "", presenterGrammar, {
    hidden: new Set(), emphasized: new Set(), connections: new Map(), text: new Map(), frame: 0
  }, "data:image/svg+xml;base64,PHN2Zy8+");
  assert.match(complete, /data-diagram-asset="graphrag-traversal"/);
  assert.doesNotMatch(complete, /data-element="item-1"/);
});

test("presenter full v2 emits a black plate for continuous source video", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-PRESENTER",
    kind: "presenter",
    transition: "cut",
    headline: "",
    support: "",
    items: [],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "", presenterGrammar);
  assert.match(svg, /fill="#000"/);
  assert.doesNotMatch(svg, /Companion|WHITEBOARD/);
});

test("presenter-focus retains the full-frame dark Focus Canvas without a light card", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-PRESENTER-FOCUS",
    kind: "presenter-focus",
    transition: "cut",
    headline: "Architecture is continuous learning",
    support: "Question · Evaluate · Refine · Build",
    items: ["Principles", "Patterns", "Technology"],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0000", title: "Welcome" }, { width: 1920, height: 1080 }, "", presenterGrammar);
  assert.match(svg, /NARRATOR/);
  assert.match(svg, /Architecture is continuous/);
  assert.match(svg, />learning</);
  assert.doesNotMatch(svg, /WHITEBOARD|ARCHITECTURAL STUDIO|f6f2e9|Companion/);
});

test("presenter Evidence options adapt to the available canvas height", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-PRESENTER-EVIDENCE",
    kind: "presenter-evidence",
    transition: "cut",
    headline: "Production changes the question",
    support: "Features make a system useful. Characteristics make it trustworthy.",
    items: ["Available", "Secure", "Performant", "Explainable", "Trustworthy"],
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0004", title: "AI-Native Systems Are Still Systems" }, { width: 1920, height: 1080 }, "", presenterGrammar);
  const options = [...svg.matchAll(/data-evidence-option="\d+" x="[^"]+" y="([^"]+)" width="[^"]+" height="([^"]+)"/g)];
  assert.equal(options.length, 5);
  const lastBottom = Number(options.at(-1)[1]) + Number(options.at(-1)[2]);
  assert.ok(lastBottom <= 934, `last Evidence option ends at ${lastBottom}`);
});

test("presenter Repository gives long source paths enough horizontal space", () => {
  const presenterGrammar = getVisualGrammarProfile("articulate-visual-grammar-v2");
  const scene = {
    id: "S-PRESENTER-REPOSITORY",
    kind: "presenter-repository",
    transition: "cut",
    headline: "Coherence Before Size",
    support: "Split only when responsibilities stop belonging together.",
    items: ["site/src/content/principles/coherence-before-size.md", "Architectural principle"],
    evidence: { excerpt: ["Responsibilities · tools · context", "Boundaries introduce routing · trust · failure"] },
    startSeconds: 0,
    endSeconds: 10,
    durationSeconds: 10
  };
  scene.presentation = resolveScenePresentation(scene, presenterGrammar);
  const svg = renderSceneSvg(scene, { id: "episode-0004", title: "AI-Native Systems Are Still Systems" }, { width: 1920, height: 1080 }, "", presenterGrammar);
  assert.match(svg, /data-repository-path="1" x="202" y="512" width="650"/);
  assert.match(svg, /site\/src\/content\/principles\/coherence-before-size\.md/);
});
