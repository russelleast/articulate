import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export function diagnostic(severity, file, rule, message, details = {}) {
  return { severity, file, rule, message, ...details };
}

export function summarize(diagnostics) {
  return {
    errors: diagnostics.filter(({ severity }) => severity === "error").length,
    warnings: diagnostics.filter(({ severity }) => severity === "warning").length
  };
}

export function printDiagnostics(diagnostics) {
  for (const item of diagnostics) {
    const method = item.severity === "error" ? "error" : "warn";
    console[method](`${item.severity.toUpperCase()} ${item.file} [${item.rule}] ${item.message}`);
  }
  const totals = summarize(diagnostics);
  console.log(`SEO validation: ${totals.errors} error(s), ${totals.warnings} warning(s)`);
}

export async function writeJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
}

function section(title, diagnostics, empty) {
  const lines = [`## ${title}`, ""];
  if (!diagnostics.length) return [...lines, empty, ""];
  return [
    ...lines,
    ...diagnostics.map((item) =>
      `- **${item.file}** — \`${item.rule}\`: ${item.message}`
    ),
    ""
  ];
}

export function renderMarkdown(report) {
  const errors = report.diagnostics.filter(({ severity }) => severity === "error");
  const warnings = report.diagnostics.filter(({ severity }) => severity === "warning");
  const byRule = (prefix) => report.diagnostics.filter(({ rule }) => rule.startsWith(prefix));
  const status = (key) => report.statuses[key] ?? "Not inspected";

  return [
    "# Articulate SEO validation report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    `- Pages inspected: ${report.pagesInspected}`,
    `- Source files inspected: ${report.sourceFilesInspected}`,
    `- Errors: ${errors.length}`,
    `- Warnings: ${warnings.length}`,
    `- Sitemap: ${status("sitemap")}`,
    `- Robots: ${status("robots")}`,
    `- Structured data: ${status("structuredData")}`,
    `- Canonical URLs: ${status("canonical")}`,
    `- Analytics duplication: ${status("analytics")}`,
    "",
    ...section("Errors", errors, "No deterministic SEO errors were found."),
    ...section("Warnings and editorial guidance", warnings, "No SEO warnings were found."),
    ...section("Duplicate metadata", byRule("duplicate-"), "No duplicate titles or descriptions were found."),
    ...section("Missing metadata", report.diagnostics.filter(({ rule }) => rule.startsWith("required-") || rule.startsWith("missing-")), "No required metadata is missing."),
    ...section("Broken internal links", byRule("internal-link"), "No broken internal links were found."),
    ...section("Missing assets", report.diagnostics.filter(({ rule }) => rule.includes("asset")), "No referenced local assets are missing."),
    "## Check status",
    "",
    ...Object.entries(report.statuses).map(([key, value]) => `- **${key}**: ${value}`),
    ""
  ].join("\n");
}

export async function writeReport(report, jsonFile, markdownFile) {
  await writeJson(jsonFile, report);
  await mkdir(path.dirname(markdownFile), { recursive: true });
  await writeFile(markdownFile, renderMarkdown(report));
}
