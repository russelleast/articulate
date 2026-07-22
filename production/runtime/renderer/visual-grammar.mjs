const DEFAULT_PROFILE_ID = "articulate-visual-grammar-v1";

const profile = Object.freeze({
  id: DEFAULT_PROFILE_ID,
  source: "docs/media/visual-grammar.md",
  frame: Object.freeze({
    safeArea: Object.freeze({ x: 112, y: 135, width: 1696, height: 800 }),
    header: Object.freeze({ y: 90 }),
    footer: Object.freeze({ lineY: 996, textY: 1035 })
  }),
  spacing: Object.freeze({
    boxInline: 28,
    boxBlock: 24,
    compositionGap: 26,
    flowGap: 54
  }),
  compositionGrids: Object.freeze({
    standard: Object.freeze({
      headline: Object.freeze({ x: 112, y: 170, width: 1696 }),
      support: Object.freeze({ x: 112, y: 330, width: 1550 }),
      graphicY: 500
    }),
    reflection: Object.freeze({
      headline: Object.freeze({ x: 112, y: 170, width: 1696 }),
      support: Object.freeze({ x: 112, y: 515, width: 1550 }),
      graphicY: 720
    }),
    companion: Object.freeze({
      headline: Object.freeze({ x: 112, y: 215, width: 900 }),
      support: Object.freeze({ x: 112, y: 510, width: 760 }),
      pillOrigin: Object.freeze({ x: 112, y: 760 }),
      pillColumnStep: 390,
      pillRowStep: 72,
      pillWidth: 360,
      visualPanel: Object.freeze({ x: 1050, y: 135, width: 650, height: 800 })
    })
  }),
  typography: Object.freeze({
    fontFamily: "-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif",
    lineHeight: 1.18,
    roles: Object.freeze({
      provenance: Object.freeze({ fontSize: 22, weight: 400 }),
      sceneHeading: Object.freeze({ fontSize: 58, weight: 700, maxLines: 2 }),
      focalQuestion: Object.freeze({ fontSize: 64, weight: 700, maxLines: 4 }),
      support: Object.freeze({ fontSize: 32, weight: 400, maxLines: 3 }),
      diagramLabel: Object.freeze({ fontSize: 28, weight: 500, maxLines: 2 }),
      flowLabel: Object.freeze({ fontSize: 27, weight: 600, maxLines: 2 }),
      evidenceText: Object.freeze({ fontSize: 24, weight: 400, maxLines: 1 }),
      annotation: Object.freeze({ fontSize: 22, weight: 400, maxLines: 1 })
    })
  }),
  palette: Object.freeze({
    paper: "#f4f0e8", ink: "#172028", muted: "#59656d", blue: "#3d6075",
    paleBlue: "#dce7eb", rust: "#a65d3f", paleRust: "#ead8cd", green: "#547064",
    white: "#fffdfa", line: "#aeb8bc", dark: "#111920"
  }),
  sceneKinds: Object.freeze({
    studio: Object.freeze({ archetype: "Narrator", composition: "studio" }),
    whiteboard: Object.freeze({ archetype: "Whiteboard", composition: "whiteboard" }),
    workspace: Object.freeze({ archetype: "Repository", composition: "workspace" }),
    focus: Object.freeze({ archetype: "Diagram", composition: "focus" }),
    diagram: Object.freeze({ archetype: "Diagram", composition: "diagram" }),
    title: Object.freeze({ archetype: "Narrator", composition: "companion" }),
    companion: Object.freeze({ archetype: "Narrator", composition: "companion" }),
    closing: Object.freeze({ archetype: "Narrator", composition: "companion" }),
    journal: Object.freeze({ archetype: "Repository", composition: "repository" }),
    evidence: Object.freeze({ archetype: "Evidence", composition: "radial-evidence" }),
    question: Object.freeze({ archetype: "Reflection", composition: "reflection" }),
    change: Object.freeze({ archetype: "Diagram", composition: "flow" }),
    principles: Object.freeze({ archetype: "Diagram", composition: "flow" }),
    augment: Object.freeze({ archetype: "Diagram", composition: "flow" }),
    roadmap: Object.freeze({ archetype: "Diagram", composition: "flow" }),
    contrast: Object.freeze({ archetype: "Diagram", composition: "flow" }),
    fragments: Object.freeze({ archetype: "Diagram", composition: "grid" }),
    tools: Object.freeze({ archetype: "Diagram", composition: "grid" }),
    questions: Object.freeze({ archetype: "Diagram", composition: "grid" }),
    costs: Object.freeze({ archetype: "Diagram", composition: "grid-risk" }),
    success: Object.freeze({ archetype: "Diagram", composition: "grid" }),
    capabilities: Object.freeze({ archetype: "Diagram", composition: "grid" }),
    timeline: Object.freeze({ archetype: "Diagram", composition: "timeline" }),
    projections: Object.freeze({ archetype: "Diagram", composition: "radial-projection" })
  }),
  transitions: Object.freeze({
    cut: Object.freeze({ semantic: "cut", renderMode: "cut" }),
    fade: Object.freeze({ semantic: "dissolve", renderMode: "cut", compatibility: true }),
    section: Object.freeze({ semantic: "cut", renderMode: "cut", compatibility: true })
  }),
  motion: Object.freeze({
    companionIdle: Object.freeze({
      id: "grammar-companion-idle-v1",
      periodFrames: 110,
      translateYPixels: 2.2,
      scaleAmplitude: 0.0025,
      renderMode: "frame-indexed"
    }),
    actions: Object.freeze({
      reveal: Object.freeze({ id: "grammar-reveal-v1", renderMode: "cut-at-frame" }),
      hide: Object.freeze({ id: "grammar-hide-v1", renderMode: "cut-at-frame" }),
      emphasize: Object.freeze({ id: "grammar-emphasis-v1", strokeWidth: 4, renderMode: "persistent-state" }),
      deemphasize: Object.freeze({ id: "grammar-deemphasis-v1", renderMode: "persistent-state" }),
      replace: Object.freeze({ id: "grammar-replace-v1", renderMode: "cut-at-frame" }),
      transition: Object.freeze({ id: "grammar-transition-v1", renderMode: "cut" }),
      type: Object.freeze({ id: "grammar-repository-type-v1", renderMode: "frame-indexed-text" })
    }),
    directionalConnector: Object.freeze({
      id: "grammar-directional-connector-v1",
      arrowhead: true,
      strokeWidth: 3,
      colourRole: "blue"
    })
  })
});

export function getVisualGrammarProfile(profileId = DEFAULT_PROFILE_ID) {
  if (profileId !== DEFAULT_PROFILE_ID) {
    throw new Error(`Unknown visual grammar profile: ${profileId}`);
  }
  return profile;
}

export function resolveScenePresentation(scene, grammar = profile) {
  const kind = grammar.sceneKinds[scene.kind];
  if (!kind) throw new Error(`${scene.id} uses unsupported visual kind: ${scene.kind}`);
  if (scene.companion && !["companion", "studio"].includes(kind.composition)) {
    throw new Error(`${scene.id} requests Companion placement outside a Companion composition`);
  }
  const transition = grammar.transitions[scene.transition];
  if (!transition) throw new Error(`${scene.id} uses unsupported transition: ${scene.transition}`);
  return Object.freeze({ ...kind, transition });
}

export { DEFAULT_PROFILE_ID };
