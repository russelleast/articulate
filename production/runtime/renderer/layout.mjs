export function textBlock(text, box, style, context = "text") {
  const layout = layoutText(text, box.width, style, context);
  const anchor = style.align === "middle" ? "middle" : "start";
  const x = anchor === "middle" ? box.x + box.width / 2 : box.x;
  const tspans = layout.lines.map((line, index) =>
    `<tspan x="${x}" dy="${index === 0 ? 0 : layout.lineHeight}">${xml(line)}</tspan>`
  ).join("");
  return `<text x="${x}" y="${box.y}" text-anchor="${anchor}" font-size="${style.fontSize}" font-weight="${style.weight ?? 400}" fill="${style.fill}">${tspans}</text>`;
}

export function centredTextBlock(text, box, style, context = "boxed text") {
  const layout = layoutText(text, box.width, style, context);
  const anchor = style.align === "middle" ? "middle" : "start";
  const x = anchor === "middle" ? box.x + box.width / 2 : box.x;
  const firstLineCentre = box.y + box.height / 2 - ((layout.lines.length - 1) * layout.lineHeight) / 2;
  const tspans = layout.lines.map((line, index) =>
    `<tspan x="${x}" dy="${index === 0 ? 0 : layout.lineHeight}">${xml(line)}</tspan>`
  ).join("");
  return `<text x="${x}" y="${firstLineCentre}" dominant-baseline="middle" text-anchor="${anchor}" font-size="${style.fontSize}" font-weight="${style.weight ?? 400}" fill="${style.fill}">${tspans}</text>`;
}

export function insetBox(box, inlinePadding, blockPadding) {
  return {
    x: box.x + inlinePadding,
    y: box.y + blockPadding,
    width: box.width - inlinePadding * 2,
    height: box.height - blockPadding * 2
  };
}

export function layoutText(text, width, style, context = "text") {
  if (width <= 0) throw new Error(`${context} has no horizontal space`);
  const maxChars = Math.max(8, Math.floor(width / (style.fontSize * 0.55)));
  const lines = wrapText(text, maxChars);
  if (lines.length > style.maxLines) {
    throw new Error(`${context} overflows: ${lines.length} lines required, ${style.maxLines} allowed`);
  }
  return { lines, lineHeight: style.fontSize * (style.lineHeight ?? 1.18) };
}

export function wrapText(text, maxChars) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export function xml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}
