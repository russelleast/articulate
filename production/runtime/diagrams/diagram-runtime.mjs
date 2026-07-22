import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { AssetRegistry } from "../assets/asset-registry.mjs";

export const D2_RENDER_ARGUMENTS = Object.freeze(["--layout", "elk", "--theme", "0", "--pad", "64"]);

export function discoverDiagramSources(sourceRoot) {
  if (!fs.existsSync(sourceRoot)) return [];
  const discovered = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const candidate = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(candidate);
      else if (entry.isFile() && entry.name.endsWith(".d2")) discovered.push(candidate);
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
    if (!configuredSources.has(path.resolve(source))) errors.push(`unregistered D2 source: ${path.relative(repoRoot, source)}`);
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

export function d2Command(diagram, { command = "d2" } = {}) {
  return { command, args: [...D2_RENDER_ARGUMENTS, diagram.sourcePath, diagram.outputPath] };
}

export function renderDiagram(diagram, { command = "d2", run = spawnSync, outputPath = diagram.outputPath } = {}) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  const result = run(command, [...D2_RENDER_ARGUMENTS, diagram.sourcePath, outputPath], { encoding: "utf8" });
  if (result.error?.code === "ENOENT") throw new Error("D2 CLI is required but was not found. Install D2 from https://d2lang.com/tour/install, then ensure 'd2' is on PATH.");
  if (result.error) throw new Error(`Unable to render diagram '${diagram.id}': ${result.error.message}`);
  if (result.status !== 0) throw new Error(`D2 failed to render '${diagram.id}': ${(result.stderr || result.stdout || "unknown error").trim()}`);
  if (!fs.existsSync(outputPath)) throw new Error(`D2 reported success for '${diagram.id}' but did not create ${outputPath}`);
  return outputPath;
}

function resolveInside(repoRoot, relativePath, label) {
  const root = path.resolve(repoRoot);
  const resolved = path.resolve(root, relativePath);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} escapes the repository root`);
  return resolved;
}
