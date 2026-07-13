import fs from "node:fs";

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function writeTitleCard(filePath, config) {
  const { width, height } = config.output;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f7f4ee"/>
  <rect x="96" y="96" width="${width - 192}" height="${height - 192}" fill="none" stroke="#222222" stroke-width="2"/>
  <text x="140" y="220" font-family="Helvetica, Arial, sans-serif" font-size="52" fill="#222222">Articulate</text>
  <text x="140" y="330" font-family="Helvetica, Arial, sans-serif" font-size="94" font-weight="700" fill="#222222">Episode 0001</text>
  <text x="140" y="440" font-family="Helvetica, Arial, sans-serif" font-size="74" fill="#364f6b">Why Articulate Exists</text>
  <text x="140" y="560" font-family="Helvetica, Arial, sans-serif" font-size="40" fill="#5b5b5b">Companion PoC 001 animatic</text>
  <text x="140" y="850" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#5b5b5b">Canonical source: docs/episodes/0001-why-articulate-exists.md</text>
</svg>`;
  fs.writeFileSync(filePath, svg, "utf8");
  return filePath;
}

export function writeArchitectureVisual(filePath, config) {
  const { width, height } = config.output;
  const labels = [
    "Software product",
    "Architectural laboratory",
    "Public engineering journal",
    "Reference implementation"
  ];
  const blocks = labels.map((label, index) => {
    const y = 210 + index * 170;
    const opacity = 0.25 + index * 0.2;
    const arrow = index < labels.length - 1
      ? `<text x="${width / 2}" y="${y + 132}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="46" fill="#5b5b5b">↓</text>`
      : "";
    return `<g opacity="${opacity.toFixed(2)}">
      <rect x="510" y="${y}" width="900" height="96" rx="8" fill="#ffffff" stroke="#222222" stroke-width="2"/>
      <text x="${width / 2}" y="${y + 62}" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="38" fill="#222222">${escapeXml(label)}</text>
    </g>${arrow}`;
  }).join("\n");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#eef3f2"/>
  <text x="120" y="120" font-family="Helvetica, Arial, sans-serif" font-size="42" fill="#222222">A grounded transformation</text>
  <text x="120" y="172" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#5b5b5b">From the Episode 0001 vision: evolving knowledge, not disconnected documents.</text>
  ${blocks}
</svg>`;
  fs.writeFileSync(filePath, svg, "utf8");
  return filePath;
}

export function writeCompanionFrame(filePath, config, scene, companionImagePath) {
  const { width, height } = config.output;
  const crop = config.assets.companionDesignSystem.crop;
  const imageHref = escapeXml(companionImagePath);
  const imageX = scene.companion?.framing === "left-presenter" ? 90 : 1080;
  const textX = scene.companion?.framing === "left-presenter" ? 780 : 120;
  const warning = "Reference-board crop: not selected production companion design";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="100%" height="100%" fill="#f7f4ee"/>
  <rect x="${imageX}" y="120" width="650" height="820" rx="8" fill="#ffffff" stroke="#222222" stroke-width="2"/>
  <svg x="${imageX + 40}" y="155" width="570" height="760" viewBox="${crop.x} ${crop.y} ${crop.width} ${crop.height}" preserveAspectRatio="xMidYMid slice">
    <image href="${imageHref}" x="0" y="0" width="1536" height="1024"/>
  </svg>
  <text x="${textX}" y="245" font-family="Helvetica, Arial, sans-serif" font-size="52" fill="#222222">${escapeXml(scene.title)}</text>
  <text x="${textX}" y="320" font-family="Helvetica, Arial, sans-serif" font-size="34" fill="#364f6b">StaticCompanionRenderer</text>
  <text x="${textX}" y="386" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#5b5b5b">Lip-sync: absent in this animatic</text>
  <text x="${textX}" y="760" font-family="Helvetica, Arial, sans-serif" font-size="26" fill="#8a4b36">${escapeXml(warning)}</text>
  <text x="${textX}" y="814" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#5b5b5b">Motion intent: ${escapeXml(scene.companion?.motion ?? "static")}</text>
</svg>`;
  fs.writeFileSync(filePath, svg, "utf8");
  return filePath;
}
