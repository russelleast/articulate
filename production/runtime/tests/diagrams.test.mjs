import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  D2_RENDER_ARGUMENTS,
  d2Command,
  discoverDiagramSources,
  renderDiagram,
  requireD2,
  validateDiagramConfiguration
} from "../diagrams/diagram-runtime.mjs";
import {
  assertNormalisedDiagramSvg,
  diagramVideoDataUri,
  diagramViewport,
  normaliseDiagramSvg,
  VIDEO_DARK_DIAGRAM_PROFILE
} from "../diagrams/video-diagram-profile.mjs";
import { validateRegistryDocument } from "../assets/asset-registry.mjs";

function temporaryRepository(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "articulate-diagrams-test-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test("D2 sources are discovered recursively in stable order", (t) => {
  const root = temporaryRepository(t);
  fs.mkdirSync(path.join(root, "sources", "reasoning"), { recursive: true });
  fs.mkdirSync(path.join(root, "sources", "knowledge"), { recursive: true });
  fs.writeFileSync(path.join(root, "sources", "reasoning", "z.d2"), "z");
  fs.writeFileSync(path.join(root, "sources", "knowledge", "a.d2"), "a");
  fs.writeFileSync(path.join(root, "sources", "ignored.txt"), "ignored");

  assert.deepEqual(discoverDiagramSources(path.join(root, "sources")).map((file) => path.relative(root, file)), [
    "sources/knowledge/a.d2", "sources/reasoning/z.d2"
  ]);
});

test("configuration validation rejects missing and unregistered sources", (t) => {
  const root = temporaryRepository(t);
  const sourceRoot = path.join(root, "production/diagrams/sources");
  fs.mkdirSync(sourceRoot, { recursive: true });
  fs.writeFileSync(path.join(sourceRoot, "unregistered.d2"), "x");
  const missing = path.join(sourceRoot, "missing.d2");

  assert.throws(
    () => validateDiagramConfiguration({ repoRoot: root, sourceRoot, diagrams: [{ id: "missing", sourcePath: missing }] }),
    /source does not exist:[\s\S]*unregistered D2 source/
  );
});

test("configuration validation rejects two IDs pointing at one source", (t) => {
  const root = temporaryRepository(t);
  const sourceRoot = path.join(root, "sources");
  fs.mkdirSync(sourceRoot);
  const sourcePath = path.join(sourceRoot, "shared.d2");
  fs.writeFileSync(sourcePath, "x");
  assert.throws(() => validateDiagramConfiguration({
    repoRoot: root,
    sourceRoot,
    diagrams: [{ id: "one", sourcePath }, { id: "two", sourcePath }]
  }), /configured more than once/);
});

test("the shared asset registry rejects duplicate diagram IDs", () => {
  const diagram = {
    id: "shared-diagram", type: "diagram", format: "d2", episode: null,
    status: "generated", checksum: null, source: "production/diagrams/sources/shared.d2",
    location: "site/public/diagrams/shared.svg", provider: "local"
  };
  assert.throws(() => validateRegistryDocument({ version: 1, assets: [diagram, { ...diagram }] }), /duplicate asset ID: shared-diagram/);
});

test("D2 command construction fixes layout, theme and padding", () => {
  const diagram = { sourcePath: "/repo/source.d2", outputPath: "/repo/source.svg" };
  assert.deepEqual(d2Command(diagram), {
    command: "d2",
    args: [...D2_RENDER_ARGUMENTS, "/repo/source.d2", "/repo/source.svg"]
  });
});

test("render creates output directories and requires the expected SVG", (t) => {
  const root = temporaryRepository(t);
  const outputPath = path.join(root, "nested", "diagram.svg");
  const diagram = { id: "diagram", sourcePath: path.join(root, "diagram.d2"), outputPath };
  fs.writeFileSync(diagram.sourcePath, "x");
  const calls = [];
  const run = (command, args) => {
    calls.push({ command, args });
    fs.writeFileSync(args.at(-1), "<svg/>");
    return { status: 0, stdout: "", stderr: "" };
  };

  assert.equal(renderDiagram(diagram, { run }), outputPath);
  assert.equal(fs.readFileSync(outputPath, "utf8"), "<svg/>");
  assert.deepEqual(calls[0], { command: "d2", args: [...D2_RENDER_ARGUMENTS, diagram.sourcePath, outputPath] });
});

test("rendering failures and false success are surfaced", (t) => {
  const root = temporaryRepository(t);
  const diagram = { id: "broken", sourcePath: path.join(root, "broken.d2"), outputPath: path.join(root, "broken.svg") };
  assert.throws(() => renderDiagram(diagram, { run: () => ({ status: 1, stderr: "invalid syntax" }) }), /invalid syntax/);
  assert.throws(() => renderDiagram(diagram, { run: () => ({ status: 0, stderr: "" }) }), /did not create/);
});

test("missing D2 dependency produces installation guidance", () => {
  const missing = Object.assign(new Error("spawn d2 ENOENT"), { code: "ENOENT" });
  assert.throws(() => requireD2({ run: () => ({ error: missing }) }), /D2 CLI is required[\s\S]*d2lang\.com/);
});

test("video-dark normalisation removes only the D2 page and maps presentation colours", () => {
  const source = [
    '<?xml version="1.0"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240" preserveAspectRatio="xMinYMin meet">',
    '<svg class="d2-123 d2-svg" width="400" height="240" viewBox="-20 -20 400 240">',
    '<rect x="-20" y="-20" width="400" height="240" fill="#FFFFFF" class="fill-N7"/>',
    '<style>.d2-123 .fill-B4{fill:#E3E9FD}.d2-123 .stroke-B1{stroke:#0D32B2}</style>',
    '<g><rect x="0" y="0" width="120" height="60" class="fill-B4 stroke-B1" fill="#F7F4ED" stroke="#263746"/>',
    '<text fill="#17232D">Architecture</text>',
    '<path fill="none" stroke="#0D32B2"/></g>',
    '<mask id="edge-mask"><rect width="400" height="240" fill="white"/><rect fill="black"/></mask>',
    '</svg></svg>'
  ].join("");

  const output = normaliseDiagramSvg(source);

  assert.match(output, /data-articulate-diagram-profile="video-dark"/);
  assert.match(output, /data-articulate-diagram-profile-version="1"/);
  assert.match(output, /preserveAspectRatio="xMidYMid meet"/);
  assert.doesNotMatch(output, /class="fill-N7"/);
  assert.match(output, /\.fill-B4\{fill:#243B47\}/);
  assert.match(output, /\.stroke-B1\{stroke:#6F93A4\}/);
  assert.match(output, /fill="#1D313A" stroke="#6F8E9D"/);
  assert.match(output, /fill="#E8EEEF">Architecture/);
  assert.match(output, /stroke="#6F93A4"/);
  assert.match(output, /<mask[^>]*><rect[^>]*fill="white"\/><rect fill="black"\/><\/mask>/);
  assert.equal(normaliseDiagramSvg(output), output);
  assert.equal(assertNormalisedDiagramSvg(output), true);
});

test("video diagram profile defines a renderer-neutral 1080p output contract", () => {
  assert.equal(VIDEO_DARK_DIAGRAM_PROFILE.input.rendererNeutral, true);
  assert.equal(VIDEO_DARK_DIAGRAM_PROFILE.output.outerBackground, "transparent");
  assert.equal(VIDEO_DARK_DIAGRAM_PROFILE.output.deterministic, true);
  assert.equal(VIDEO_DARK_DIAGRAM_PROFILE.composition.minimumRenderedTextPixelsAt1080p, 18);
  assert.deepEqual(diagramViewport({ x: 112, y: 132, width: 1696, height: 838 }), {
    x: 168, y: 292, width: 1584, height: 626
  });
});

test("video diagram data URI contains the normalised SVG rather than the published document SVG", (t) => {
  const root = temporaryRepository(t);
  const svgPath = path.join(root, "diagram.svg");
  fs.writeFileSync(svgPath, '<svg viewBox="0 0 100 100"><svg class="d2-svg"><rect fill="white"/><text fill="#17232D">Node</text></svg></svg>');

  const uri = diagramVideoDataUri(svgPath);
  const decoded = Buffer.from(uri.split(",")[1], "base64").toString("utf8");

  assert.match(decoded, /data-articulate-diagram-profile="video-dark"/);
  assert.doesNotMatch(decoded, /<rect fill="white"\/>/);
  assert.match(decoded, /fill="#E8EEEF"/);
});

test("video diagram normalisation rejects output without a composable viewBox", () => {
  assert.throws(() => normaliseDiagramSvg("<svg width=\"100\" height=\"100\"/>"), /positive root viewBox/);
  assert.throws(() => normaliseDiagramSvg("not SVG"), /requires an SVG document/);
});
