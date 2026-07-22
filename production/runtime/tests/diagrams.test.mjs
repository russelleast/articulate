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
