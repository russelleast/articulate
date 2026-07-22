#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadDiagrams, renderDiagram, requireD2, validateDiagramConfiguration } from "./diagrams/diagram-runtime.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [command, diagramId] = process.argv.slice(2);
const diagrams = validateDiagramConfiguration({ repoRoot, diagrams: loadDiagrams({ repoRoot }) });

if (command === "render") {
  requireD2();
  for (const diagram of select(diagrams, diagramId)) {
    renderDiagram(diagram);
    console.log(`Rendered ${diagram.id} -> ${path.relative(repoRoot, diagram.outputPath)}`);
  }
} else if (command === "validate") {
  requireD2();
  const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "articulate-d2-"));
  try {
    for (const diagram of diagrams) renderDiagram(diagram, { outputPath: path.join(temporaryDirectory, `${diagram.id}.svg`) });
  } finally {
    fs.rmSync(temporaryDirectory, { recursive: true, force: true });
  }
  console.log(`Diagram validation passed for ${diagrams.length} D2 sources.`);
} else {
  console.error("Usage: node production/runtime/diagrams-cli.mjs <validate|render> [diagram-id]");
  process.exitCode = 2;
}

function select(all, id) {
  if (!id) return all;
  const diagram = all.find((candidate) => candidate.id === id);
  if (!diagram) throw new Error(`Unknown diagram ID: ${id}`);
  return [diagram];
}
