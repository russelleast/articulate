import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { AssetRegistry } from "../assets/asset-registry.mjs";

export const D2_RENDER_ARGUMENTS = Object.freeze(["--layout", "elk", "--theme", "0", "--pad", "64"]);
export const PLANTUML_RENDER_ARGUMENTS = Object.freeze(["-tsvg", "-pipe", "-charset", "UTF-8"]);
const SOURCE_FORMATS = Object.freeze({ ".d2": "d2", ".puml": "plantuml" });

export function discoverDiagramSources(sourceRoot) {
  if (!fs.existsSync(sourceRoot)) return [];
  const discovered = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(candidate);
      else if (entry.isFile() && SOURCE_FORMATS[path.extname(entry.name)]) discovered.push(candidate);
    }
  };
  visit(sourceRoot);
  return discovered;
}

export function loadDiagrams({ repoRoot, registryPath = path.join(repoRoot, "production/assets/registry.yaml") }) {
  const registry = new AssetRegistry({ registryPath });
  return registry.list().filter((asset) => asset.type === "diagram").map((asset) => ({
    ...asset,
    sourcePath: resolveInside(repoRoot, asset.source, `${asset.id} source`),
    outputPath: resolveInside(repoRoot, asset.location, `${asset.id} output`)
  }));
}

export function validateDiagramConfiguration({ repoRoot, diagrams, sourceRoot = path.join(repoRoot, "production/diagrams/sources") }) {
  const errors = [];
  const configuredSources = new Set();
  for (const diagram of diagrams) {
    if (!fs.existsSync(diagram.sourcePath)) errors.push(`${diagram.id} source does not exist: ${path.relative(repoRoot, diagram.sourcePath)}`);
    const canonical = path.resolve(diagram.sourcePath);
    if (configuredSources.has(canonical)) errors.push(`diagram source is configured more than once: ${path.relative(repoRoot, canonical)}`);
    configuredSources.add(canonical);
  }
  for (const source of discoverDiagramSources(sourceRoot)) {
    if (!configuredSources.has(path.resolve(source))) errors.push(`unregistered diagram source: ${path.relative(repoRoot, source)}`);
  }
  if (errors.length) throw new Error(`Diagram validation failed:\n- ${errors.join("\n- ")}`);
  return diagrams;
}

export function requireD2({ command = "d2", run = spawnSync } = {}) {
  const result = run(command, ["--version"], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") {
    throw new Error("D2 CLI is required but was not found. Install D2 from https://d2lang.com/tour/install, then ensure 'd2' is on PATH.");
  }
  if (result.error) throw new Error(`Unable to execute D2 CLI: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`D2 CLI availability check failed: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  return (result.stdout || result.stderr).trim();
}

export function requirePlantUML({ command = "plantuml", run = spawnSync } = {}) {
  const result = run(command, ["-version"], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") {
    throw new Error("PlantUML CLI is required but was not found. Install PlantUML from https://plantuml.com/starting, then ensure 'plantuml' is on PATH.");
  }
  if (result.error) throw new Error(`Unable to execute PlantUML CLI: ${result.error.message}`);
  const output = (result.stdout || result.stderr || "").trim();
  if (result.status !== 0 && !output.includes("PlantUML version")) {
    throw new Error(`PlantUML CLI availability check failed: ${output || "unknown error"}`);
  }
  return output;
}

export function requireDiagramRenderers(diagrams, options = {}) {
  const formats = new Set(diagrams.map((diagram) => diagram.format));
  if (formats.has("d2")) requireD2(options.d2);
  if (formats.has("plantuml")) requirePlantUML(options.plantuml);
  if (formats.has("structurizr")) {
    requireStructurizr(options.structurizr);
    requireGraphviz(options.graphviz);
  }
}

export function requireStructurizr({ command = process.env.STRUCTURIZR_CLI || "structurizr", run = spawnSync } = {}) {
  const result = run(command, ["export"], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") throw new Error("Structurizr CLI is required but was not found. Set STRUCTURIZR_CLI to the structurizr executable.");
  return command;
}

export function requireGraphviz({ command = "dot", run = spawnSync } = {}) {
  const result = run(command, ["-V"], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") throw new Error("Graphviz 'dot' is required to render Structurizr exports.");
  if (result.status !== 0) throw new Error(`Graphviz availability check failed: ${(result.stderr || result.stdout || "unknown error").trim()}`);
  return (result.stderr || result.stdout).trim();
}

export function d2Command(diagram, { command = "d2" } = {}) {
  return { command, args: [...D2_RENDER_ARGUMENTS, diagram.sourcePath, diagram.outputPath] };
}

export function plantUmlCommand({ command = "plantuml" } = {}) {
  return { command, args: [...PLANTUML_RENDER_ARGUMENTS] };
}

export function renderDiagram(diagram, { command, run = spawnSync, outputPath = diagram.outputPath } = {}) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  if (diagram.format === "plantuml") return renderPlantUml(diagram, { command, run, outputPath });
  if (diagram.format === "structurizr") return renderStructurizr(diagram, { command, run, outputPath });
  return renderD2(diagram, { command, run, outputPath });
}

function renderStructurizr(diagram, { command = process.env.STRUCTURIZR_CLI || "structurizr", run, outputPath }) {
  const outputDirectory = fs.mkdtempSync(path.join(process.env.TMPDIR || "/tmp", "articulate-structurizr-"));
  try {
    const exported = run(command, ["export", "-workspace", diagram.sourcePath, "-format", "dot", "-output", outputDirectory], { encoding: "utf8" });
    if (exported.error?.code === "ENOENT") throw new Error("Structurizr CLI is required but was not found. Set STRUCTURIZR_CLI to the structurizr executable.");
    if (exported.error) throw new Error(`Unable to render diagram '${diagram.id}': ${exported.error.message}`);
    if (exported.status !== 0) throw new Error(`Structurizr failed to export '${diagram.id}': ${(exported.stderr || exported.stdout || "unknown error").trim()}`);
    const dotSource = path.join(outputDirectory, `structurizr-${diagram.viewKey}.dot`);
    if (!fs.existsSync(dotSource)) throw new Error(`Structurizr did not export view '${diagram.viewKey}' for '${diagram.id}'`);
    const rendered = run("dot", ["-Tsvg", dotSource, "-o", outputPath], { encoding: "utf8" });
    if (rendered.error) throw new Error(`Unable to render Structurizr view '${diagram.id}' with Graphviz: ${rendered.error.message}`);
    if (rendered.status !== 0) throw new Error(`Graphviz failed to render '${diagram.id}': ${(rendered.stderr || rendered.stdout || "unknown error").trim()}`);
    if (!fs.existsSync(outputPath)) throw new Error(`Graphviz reported success for '${diagram.id}' but did not create ${outputPath}`);
    return outputPath;
  } finally {
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}

function renderD2(diagram, { command = "d2", run, outputPath }) {
  const result = run(command, [...D2_RENDER_ARGUMENTS, diagram.sourcePath, outputPath], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") throw new Error("D2 CLI is required but was not found. Install D2 from https://d2lang.com/tour/install, then ensure 'd2' is on PATH.");
  if (result.error) throw new Error(`Unable to render diagram '${diagram.id}': ${result.error.message}`);
  if (result.status !== 0) throw new Error(`D2 failed to render '${diagram.id}': ${(result.stderr || result.stdout || "unknown error").trim()}`);
  if (!fs.existsSync(outputPath)) throw new Error(`D2 reported success for '${diagram.id}' but did not create ${outputPath}`);
  return outputPath;
}

function renderPlantUml(diagram, { command = "plantuml", run, outputPath }) {
  const source = fs.readFileSync(diagram.sourcePath, "utf8");
  const result = run(command, [...PLANTUML_RENDER_ARGUMENTS], { encoding: "utf8", input: source, maxBuffer: 10 * 1024 * 1024 });
  if (result.error?.code === "ENOENT") throw new Error("PlantUML CLI is required but was not found. Install PlantUML from https://plantuml.com/starting, then ensure 'plantuml' is on PATH.");
  if (result.error) throw new Error(`Unable to render diagram '${diagram.id}': ${result.error.message}`);
  if (result.status !== 0) throw new Error(`PlantUML failed to render '${diagram.id}': ${(result.stderr || result.stdout || "unknown error").trim()}`);
  if (!result.stdout?.includes("<svg")) throw new Error(`PlantUML reported success for '${diagram.id}' but did not produce SVG output`);
  fs.writeFileSync(outputPath, result.stdout);
  return outputPath;
}

function resolveInside(repoRoot, relativePath, label) {
  const root = path.resolve(repoRoot);
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} escapes the repository root`);
  return resolved;
}
