import fs from "node:fs";
import { CANVAS, REGIONS, escapeXml, imageContain, layoutText, regionRect, svgCanvas } from "./layout.mjs";

function readImageDataUri(imagePath) {
  const data = fs.readFileSync(imagePath);
  return `data:image/png;base64,${data.toString("base64")}`;
}

export function writeTitleCard(filePath, config, { debug = false } = {}) {
  const inner = `
  ${regionRect(REGIONS.safe, { stroke: "#222222", strokeWidth: 2, opacity: 0.8 })}
  ${layoutText({ text: "Articulate", box: { x: 140, y: 190, width: 600, height: 70 }, fontSize: 52, minFontSize: 44, maxLines: 1, fill: "#222222" })}
  ${layoutText({ text: "Episode 0001", box: { x: 140, y: 310, width: 1150, height: 140 }, fontSize: 96, minFontSize: 78, maxLines: 1, weight: "700", fill: "#222222" })}
  ${layoutText({ text: "Why Articulate Exists", box: { x: 140, y: 500, width: 1320, height: 110 }, fontSize: 70, minFontSize: 56, maxLines: 1, fill: "#364f6b" })}
  ${layoutText({ text: "Companion PoC 002", box: { x: 140, y: 680, width: 680, height: 70 }, fontSize: 36, minFontSize: 30, maxLines: 1, fill: "#5b5b5b" })}
  ${layoutText({ text: "Canonical source: docs/episodes/0001-why-articulate-exists.md", box: REGIONS.titleFooter, fontSize: 28, minFontSize: 24, maxLines: 1, overflow: "ellipsis", fill: "#5b5b5b" })}`;
  fs.writeFileSync(filePath, svgCanvas(inner, { background: "#f7f4ee", debug }), "utf8");
  return filePath;
}

export function writeArchitectureVisual(filePath, config, { debug = false } = {}) {
  const labels = [
    "Software product",
    "Architectural laboratory",
    "Public engineering journal",
    "Reference implementation"
  ];
  const x = REGIONS.diagram.x + 150;
  const nodeWidth = REGIONS.diagram.width - 300;
  const nodeHeight = 86;
  const top = REGIONS.diagram.y + 54;
  const gap = 66;
  const blocks = labels.map((label, index) => {
    const y = top + index * (nodeHeight + gap);
    const opacity = 0.38 + index * 0.18;
    const arrow = index < labels.length - 1
      ? `<text x="${CANVAS.width / 2}" y="${y + nodeHeight + 48}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="42" fill="#5b5b5b">↓</text>`
      : "";
    return `<g opacity="${opacity.toFixed(2)}">
      <rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="8" fill="#ffffff" stroke="#222222" stroke-width="2"/>
      ${layoutText({ text: label, box: { x, y: y + 15, width: nodeWidth, height: 54 }, fontSize: 34, minFontSize: 30, maxLines: 1, align: "center", fill: "#222222" })}
    </g>${arrow}`;
  }).join("\n");
  const inner = `
  ${layoutText({ text: "A grounded transformation", box: { x: 140, y: 115, width: 880, height: 64 }, fontSize: 42, minFontSize: 36, maxLines: 1, fill: "#222222" })}
  ${layoutText({ text: "Evolving knowledge, not disconnected documents.", box: { x: 140, y: 176, width: 980, height: 48 }, fontSize: 28, minFontSize: 24, maxLines: 1, fill: "#5b5b5b" })}
  ${blocks}`;
  fs.writeFileSync(filePath, svgCanvas(inner, { background: "#eef3f2", debug }), "utf8");
  return filePath;
}

export function writeCompanionFrame(filePath, config, scene, companionImagePath, { debug = false, companionAsset = null } = {}) {
  const left = scene.companion?.framing === "left-presenter";
  const title = left ? "Human review stays explicit" : "Russell remains the narrator";
  const support = left
    ? "This animatic keeps the source, voice and review trail visible."
    : "The companion is a restrained visual presenter. No lip-sync is claimed.";
  const inner = left ? `
  ${layoutText({ text: scene.title, box: { x: REGIONS.closingTitle.x, y: REGIONS.closingTitle.y, width: REGIONS.closingTitle.width, height: 45 }, fontSize: 28, minFontSize: 24, maxLines: 1, fill: "#5b5b5b" })}
  ${layoutText({ text: title, box: { x: REGIONS.closingTitle.x, y: REGIONS.closingTitle.y + 76, width: REGIONS.closingTitle.width, height: 150 }, fontSize: 58, minFontSize: 44, lineHeight: 1.12, maxLines: 2, weight: "700", fill: "#222222" })}
  ${layoutText({ text: support, box: REGIONS.closingSupport, fontSize: 34, minFontSize: 28, lineHeight: 1.28, maxLines: 3, fill: "#364f6b" })}
  ${layoutText({ text: "AI-generated visual presenter. Lip-sync absent.", box: REGIONS.disclosureFooter, fontSize: 24, minFontSize: 22, maxLines: 1, fill: "#5b5b5b" })}` : `
  ${layoutText({ text: scene.title, box: { x: REGIONS.splitText.x, y: REGIONS.splitText.y, width: REGIONS.splitText.width, height: 55 }, fontSize: 28, minFontSize: 24, maxLines: 1, fill: "#5b5b5b" })}
  ${layoutText({ text: title, box: { x: REGIONS.splitText.x, y: REGIONS.splitText.y + 90, width: REGIONS.splitText.width, height: 160 }, fontSize: 58, minFontSize: 44, lineHeight: 1.12, maxLines: 2, weight: "700", fill: "#222222" })}
  ${layoutText({ text: support, box: { x: REGIONS.splitText.x, y: REGIONS.splitText.y + 290, width: REGIONS.splitText.width, height: 150 }, fontSize: 34, minFontSize: 28, lineHeight: 1.28, maxLines: 3, fill: "#364f6b" })}
  ${layoutText({ text: "AI-generated visual presenter. Lip-sync absent.", box: REGIONS.disclosureFooter, fontSize: 24, minFontSize: 22, maxLines: 1, fill: "#5b5b5b" })}`;
  fs.writeFileSync(filePath, svgCanvas(inner, { background: "#f7f4ee", debug, assetName: companionAsset?.repoPath ?? companionImagePath }), "utf8");
  return filePath;
}

export function companionPlacementForScene(scene, imageInfo) {
  const box = scene.companion?.framing === "left-presenter" ? REGIONS.closingCompanion : REGIONS.companion;
  return imageContain({
    imageHref: "companion.png",
    sourceWidth: imageInfo.width,
    sourceHeight: imageInfo.height,
    box,
    anchor: "center-bottom"
  });
}

export function writeContactSheet(filePath, frames) {
  const cells = frames.map((frame, index) => {
    const x = index % 2 === 0 ? 0 : 960;
    const y = index < 2 ? 0 : 540;
    const label = escapeXml(frame.label);
    return `<g>
      <image href="${readImageDataUri(frame.path)}" x="${x}" y="${y}" width="960" height="540" preserveAspectRatio="xMidYMid meet"/>
      <rect x="${x}" y="${y}" width="960" height="42" fill="#000000" opacity="0.55"/>
      <text x="${x + 24}" y="${y + 28}" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#ffffff">${label}</text>
    </g>`;
  }).join("\n");
  fs.writeFileSync(filePath, svgCanvas(cells, { background: "#111111" }), "utf8");
  return filePath;
}
