export const CANVAS = Object.freeze({
  width: 1920,
  height: 1080,
  aspectRatio: "16:9",
  outerMargin: 96
});

export const REGIONS = Object.freeze({
  safe: { x: 96, y: 96, width: 1728, height: 888 },
  title: { x: 140, y: 150, width: 1280, height: 500 },
  titleFooter: { x: 140, y: 880, width: 1440, height: 80 },
  splitText: { x: 140, y: 170, width: 780, height: 650 },
  companion: { x: 1080, y: 130, width: 650, height: 850 },
  diagram: { x: 360, y: 230, width: 1200, height: 680 },
  closingText: { x: 800, y: 260, width: 820, height: 420 }
});

export function svgCanvas(inner, { background = "#f7f4ee", debug = false, assetName = null } = {}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS.width}" height="${CANVAS.height}" viewBox="0 0 ${CANVAS.width} ${CANVAS.height}" preserveAspectRatio="xMidYMid meet">
  <rect width="${CANVAS.width}" height="${CANVAS.height}" fill="${background}"/>
  ${inner}
  ${debug ? debugGuides(assetName) : ""}
</svg>`;
}

export function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function assertInsideCanvas(bounds, label) {
  if (bounds.x < 0 || bounds.y < 0 || bounds.width <= 0 || bounds.height <= 0) {
    throw new Error(`${label} has invalid bounds: ${JSON.stringify(bounds)}`);
  }
  if (bounds.x + bounds.width > CANVAS.width || bounds.y + bounds.height > CANVAS.height) {
    throw new Error(`${label} exceeds ${CANVAS.width}x${CANVAS.height} canvas: ${JSON.stringify(bounds)}`);
  }
}

export function layoutText({
  text,
  box,
  fontSize,
  minFontSize = fontSize,
  lineHeight = 1.2,
  maxLines = 3,
  align = "left",
  overflow = "fail",
  weight = "400",
  fill = "#222222"
}) {
  assertInsideCanvas(box, "text box");
  for (let size = fontSize; size >= minFontSize; size -= 1) {
    const lines = wrapLines(text, box.width, size, maxLines);
    const lineHeightPx = Math.round(size * lineHeight);
    const totalHeight = lines.length * lineHeightPx;
    if (lines.overflow || totalHeight > box.height) continue;
    const anchor = align === "center" ? "middle" : align === "right" ? "end" : "start";
    const x = align === "center" ? box.x + box.width / 2 : align === "right" ? box.x + box.width : box.x;
    const tspans = lines.values.map((line, index) => {
      const y = box.y + size + index * lineHeightPx;
      return `<tspan x="${x}" y="${y}">${escapeXml(line)}</tspan>`;
    }).join("");
    return `<text font-family="Helvetica, Arial, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${tspans}</text>`;
  }
  if (overflow === "ellipsis") {
    return layoutText({ text: ellipsise(text), box, fontSize: minFontSize, minFontSize, lineHeight, maxLines, align, overflow: "fail", weight, fill });
  }
  throw new Error(`Text does not fit safely in ${JSON.stringify(box)}: ${text}`);
}

export function wrapLines(text, maxWidth, fontSize, maxLines) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    if (measureText(word, fontSize) > maxWidth) {
      return { values: lines, overflow: true };
    }
    const next = current ? `${current} ${word}` : word;
    if (measureText(next, fontSize) <= maxWidth) {
      current = next;
    } else {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) return { values: lines, overflow: true };
    }
  }
  if (current) lines.push(current);
  return { values: lines, overflow: lines.length > maxLines };
}

export function imageContain({ imageHref, sourceWidth, sourceHeight, box, anchor = "center-bottom" }) {
  assertInsideCanvas(box, "image box");
  const scale = Math.min(box.width / sourceWidth, box.height / sourceHeight);
  const width = sourceWidth * scale;
  const height = sourceHeight * scale;
  const x = box.x + (box.width - width) / 2;
  const y = anchor.endsWith("bottom") ? box.y + box.height - height : box.y + (box.height - height) / 2;
  return {
    x,
    y,
    width,
    height,
    svg: `<image href="${escapeXml(imageHref)}" x="${round(x)}" y="${round(y)}" width="${round(width)}" height="${round(height)}" preserveAspectRatio="xMidYMid meet"/>`
  };
}

export function regionRect(region, { fill = "none", stroke = "#222222", strokeWidth = 2, rx = 0, opacity = 1 } = {}) {
  assertInsideCanvas(region, "region");
  return `<rect x="${region.x}" y="${region.y}" width="${region.width}" height="${region.height}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
}

function measureText(text, fontSize) {
  let units = 0;
  for (const char of text) {
    if (char === " ") units += 0.32;
    else if ("il.,'|".includes(char)) units += 0.28;
    else if ("mwMW@".includes(char)) units += 0.9;
    else if (/[A-Z0-9]/.test(char)) units += 0.68;
    else units += 0.56;
  }
  return units * fontSize;
}

function ellipsise(text) {
  return `${String(text).trim().replace(/\s+\S+$/, "")}...`;
}

function debugGuides(assetName) {
  const boxes = Object.entries(REGIONS).map(([name, region]) =>
    `${regionRect(region, { stroke: name === "safe" ? "#d9480f" : "#1c7ed6", strokeWidth: name === "safe" ? 3 : 2, opacity: 0.55 })}
    <text x="${region.x + 8}" y="${region.y + 24}" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#1c7ed6">${escapeXml(name)}</text>`
  ).join("\n");
  const label = assetName ? `<text x="96" y="1030" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#5b5b5b">Asset: ${escapeXml(assetName)}</text>` : "";
  return `<g pointer-events="none">${boxes}${label}</g>`;
}

function round(value) {
  return Number(value.toFixed(2));
}
