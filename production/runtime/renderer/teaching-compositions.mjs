import { textBlock, xml } from "./layout.mjs";

export function renderTeachingComposition(scene, bounds, state, visualAssetData = "") {
  const shell = `<rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" rx="34" fill="url(#presenter-canvas)" stroke="#314650" stroke-width="2" filter="url(#canvas-shadow)"/>`;
  const headline = element("headline", textBlock(text(scene, "headline", state), { x: bounds.x + 58, y: bounds.y + 70, width: bounds.width - 116 }, { fontSize: bounds.width < 1000 ? 40 : 54, weight: 720, maxLines: 2, lineHeight: 1.05, fill: "#eef2f1" }, `${scene.id} teaching headline`), state);
  const support = element("support", textBlock(text(scene, "support", state), { x: bounds.x + 60, y: bounds.y + 172, width: bounds.width - 120 }, { fontSize: bounds.width < 1000 ? 21 : 26, weight: 430, maxLines: 2, lineHeight: 1.12, fill: "#92b2c0" }, `${scene.id} teaching support`), state);
  const area = { x: bounds.x + 58, y: bounds.y + 270, width: bounds.width - 116, height: bounds.height - 320 };
  const useCanonicalDiagram = visualAssetData && scene.diagramAssetId && allItemsVisible(scene, state);
  const content = useCanonicalDiagram
    ? `<image data-diagram-asset="${xml(scene.diagramAssetId)}" data-diagram-profile="video-dark" href="${visualAssetData}" x="${area.x}" y="${area.y - 18}" width="${area.width}" height="${area.height + 36}" preserveAspectRatio="xMidYMid meet"/>`
    : graphic(scene, area, state);
  return `${shell}${headline}${support}${content}`;
}

function graphic(scene, area, state) {
  const labels = scene.items ?? [], details = scene.details ?? [];
  switch (scene.teachingLayout) {
    case "vertical-path": return verticalPath(scene, area, state, labels, details);
    case "retrieval-reasoning": return retrievalReasoning(scene, area, state, labels);
    case "rag-gap": return ragGap(scene, area, state, labels, details);
    case "graph-traversal": return graph(scene, area, state, labels, false);
    case "retrieval-selector": return selector(scene, area, state, labels, details);
    case "reasoning-router": return router(scene, area, state, labels, details);
    case "capability-lenses": return capabilities(scene, area, state, labels, details);
    case "reasoning-loop": return loop(scene, area, state, labels);
    case "layer-stack": return layers(scene, area, state, labels, details);
    case "horizontal-progression": return progression(scene, area, state, labels);
    case "knowledge-graph": return graph(scene, area, state, labels, true);
    case "reasoning-map": return reasoningMap(scene, area, state, labels);
    case "intent-fragmentation": return intentFragmentation(scene, area, state, labels, details);
    case "stable-capability": return stableCapability(scene, area, state, labels, details);
    case "capability-orbit": return capabilityOrbit(scene, area, state, labels, details);
    default: throw new Error(`${scene.id} uses unknown teaching layout '${scene.teachingLayout}'`);
  }
}

function intentFragmentation(scene, area, state, labels, details) {
  const capability = { x: area.x + 18, y: area.y + area.height / 2 - 70, width: 330, height: 140 };
  const fragments = labels.slice(1).map((_, index) => ({
    x: area.x + 500 + index % 3 * 275,
    y: area.y + 20 + Math.floor(index / 3) * 150,
    width: 235,
    height: 108
  }));
  const paths = fragments.map((box, index) => {
    if (!visible("item-1", state) || !visible(`item-${index + 2}`, state)) return "";
    return curvedArrow(capability, box, index > 3 ? "#c77a58" : "#6f93a4");
  }).join("");
  const source = element("item-1", node(scene, "item-1", labels[0], details[0], capability, state, "evidence"), state);
  const nodes = fragments.map((box, index) => {
    const id = `item-${index + 2}`;
    return element(id, node(scene, id, labels[index + 1], details[index + 1], box, state, index > 3 ? "rust" : "default"), state);
  }).join("");
  return `${paths}${source}${nodes}`;
}

function stableCapability(scene, area, state, labels, details) {
  const capability = { x: area.x + 70, y: area.y + area.height / 2 - 95, width: 430, height: 190 };
  const implementation = { x: area.x + area.width - 500, y: area.y + area.height / 2 - 95, width: 430, height: 190 };
  const connector = visible("item-1", state) && labels.slice(1).some((_, index) => visible(`item-${index + 2}`, state))
    ? boxArrow(capability, implementation, "#c77a58") : "";
  const source = element("item-1", node(scene, "item-1", labels[0], details[0], capability, state, "evidence"), state);
  const choices = labels.slice(1).map((label, index) => {
    const id = `item-${index + 2}`;
    return element(id, node(scene, id, label, details[index + 1], implementation, state, "rust"), state);
  }).join("");
  return `${connector}${source}${choices}<text x="${area.x + area.width / 2}" y="${area.y + area.height - 26}" text-anchor="middle" font-size="24" fill="#9bb7c4">Implementation evolves · capability intent remains</text>`;
}

function capabilityOrbit(scene, area, state, labels, details) {
  const centre = { x: area.x + area.width / 2 - 230, y: area.y + area.height / 2 - 88, width: 460, height: 176 };
  const points = [[.08,.12],[.68,.08],[.08,.7],[.68,.72]];
  const actors = labels.slice(1).map((_, index) => ({
    x: area.x + points[index][0] * area.width,
    y: area.y + points[index][1] * area.height,
    width: 265,
    height: 92
  }));
  const paths = actors.map((box, index) => !visible(`item-${index + 2}`, state) || !visible("item-1", state) ? "" : boxArrow(box, centre)).join("");
  const source = element("item-1", node(scene, "item-1", labels[0], details[0], centre, state, "evidence"), state);
  const nodes = actors.map((box, index) => {
    const id = `item-${index + 2}`;
    return element(id, node(scene, id, labels[index + 1], details[index + 1], box, state), state);
  }).join("");
  return `${paths}${nodes}${source}`;
}

function verticalPath(scene, area, state, labels, details) {
  const gap = 26, height = Math.min(72, (area.height - gap * (labels.length - 1)) / labels.length), width = Math.min(940, area.width * .76), x = area.x + (area.width - width) / 2;
  return labels.map((label, index) => {
    const id = `item-${index + 1}`, y = area.y + index * (height + gap);
    const previousVisible = index === 0 || visible(`item-${index}`, state);
    const arrow = index && previousVisible ? arrowPath(x + width / 2, y - gap, x + width / 2, y - 7) : "";
    return element(id, `${arrow}${node(scene, id, label, details[index], { x, y, width, height }, state, index === labels.length - 1 ? "rust" : index === 0 ? "evidence" : "default")}`, state);
  }).join("");
}

function retrievalReasoning(scene, area, state, labels) {
  const width = (area.width - 180) / 2, y = area.y + 80;
  const left = { x: area.x, y, width, height: 230 }, right = { x: area.x + width + 180, y, width, height: 230 };
  return element("item-1", node(scene, "item-1", labels[0], "finds relevant knowledge", left, state, "evidence"), state)
    + element("item-2", `${visible("item-1", state) ? arrowPath(left.x + left.width, y + 115, right.x - 10, y + 115, "#c77a58", 4) : ""}${node(scene, "item-2", labels[1], "constructs meaning for this question", right, state, "rust")}`, state)
    + element("item-3", `<text x="${area.x + area.width / 2}" y="${y + 350}" text-anchor="middle" font-size="24" fill="#9bb7c4">${xml(labels[2] ?? "Knowledge is gathered; understanding is constructed")}</text>`, state);
}

function ragGap(scene, area, state, labels, details) {
  const boxes = [{ x: area.x, y: area.y + 65, width: 390, height: 130 }, ...[0, 1, 2].map((_, index) => ({ x: area.x + area.width - 390, y: area.y + index * 155, width: 390, height: 110 }))];
  return labels.map((label, index) => {
    const id = `item-${index + 1}`, box = boxes[index];
    const connector = index && visible("item-1", state) ? curvedArrow(boxes[0], box, index === 1 ? "#6f93a4" : "#c77a58") : "";
    return element(id, `${connector}${node(scene, id, label, details[index], box, state, index ? "rust" : "evidence")}`, state);
  }).join("");
}

function graph(scene, area, state, labels, context) {
  const points = context ? [[.08,.48],[.33,.18],[.35,.74],[.62,.32],[.64,.78],[.9,.5]] : [[.08,.55],[.3,.2],[.34,.78],[.58,.48],[.82,.2],[.9,.72]];
  const links = context ? [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,4]] : [[0,1],[1,3],[2,3],[3,4],[4,5]];
  const boxes = points.slice(0, labels.length).map(([px, py]) => ({ x: area.x + px * area.width - 115, y: area.y + py * area.height - 42, width: 230, height: 84 }));
  const paths = links.map(([from, to]) => !boxes[from] || !boxes[to] || !visible(`item-${from + 1}`, state) || !visible(`item-${to + 1}`, state) ? "" : boxArrow(boxes[from], boxes[to], state?.emphasized?.has(`item-${to + 1}`) ? "#c77a58" : "#6f93a4")).join("");
  return paths + labels.map((label, index) => element(`item-${index + 1}`, node(scene, `item-${index + 1}`, label, "", boxes[index], state, index === 0 ? "evidence" : index === labels.length - 1 ? "rust" : "default"), state)).join("");
}

function selector(scene, area, state, labels, details) {
  const width = (area.width - 48) / 3;
  return labels.slice(0, 3).map((label, index) => {
    const id = `item-${index + 1}`, box = { x: area.x + index * (width + 24), y: area.y + 35, width, height: 330 };
    return element(id, node(scene, id, label, details[index], box, state, index === 0 ? "evidence" : index === 1 ? "rust" : "default"), state);
  }).join("") + element("item-4", `<path d="M ${area.x + 120} ${area.y + 410}H${area.x + area.width - 120}" stroke="#6f93a4" stroke-width="3"/><text x="${area.x + area.width / 2}" y="${area.y + 455}" text-anchor="middle" font-size="25" font-weight="650" fill="#e2a083">${xml(labels[3] ?? "Combine strategies when the question demands it")}</text>`, state);
}

function router(scene, area, state, labels, details) {
  const centre = { x: area.x + area.width / 2, y: area.y + area.height / 2 }, centreRadius = 112, radiusX = area.width * .4, radiusY = area.height * .36;
  const satellites = labels.map((label, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / labels.length), box = { x: centre.x + Math.cos(angle) * radiusX - 145, y: centre.y + Math.sin(angle) * radiusY - 47, width: 290, height: 94 }, id = `item-${index + 1}`;
    const target = boxBoundaryPoint(box, centre.x, centre.y);
    const dx = target.x - centre.x, dy = target.y - centre.y, length = Math.hypot(dx, dy) || 1;
    const start = { x: centre.x + dx / length * centreRadius, y: centre.y + dy / length * centreRadius };
    return element(id, `${arrowPath(start.x, start.y, target.x - dx / length * 9, target.y - dy / length * 9)}${node(scene, id, label, details[index], box, state, index === 2 ? "rust" : "default")}`, state);
  }).join("");
  return `${satellites}<circle cx="${centre.x}" cy="${centre.y}" r="${centreRadius}" fill="#142a34" stroke="#c77a58" stroke-width="3"/><text x="${centre.x}" y="${centre.y - 10}" text-anchor="middle" font-size="23" font-weight="700" fill="#f4f0e8">UNDERSTAND</text><text x="${centre.x}" y="${centre.y + 24}" text-anchor="middle" font-size="23" font-weight="700" fill="#f4f0e8">THE QUESTION</text>`;
}

function capabilities(scene, area, state, labels, details) {
  const width = (area.width - 36) / 2, height = (area.height - 24) / 3;
  return labels.map((label, index) => {
    const id = `item-${index + 1}`, box = { x: area.x + (index % 2) * (width + 36), y: area.y + Math.floor(index / 2) * (height + 12), width, height: height - 4 };
    return element(id, node(scene, id, label, details[index], box, state, index === 4 ? "evidence" : "default"), state);
  }).join("");
}

function loop(scene, area, state, labels) {
  const centre = { x: area.x + area.width / 2, y: area.y + area.height / 2 + 8 }, radiusX = area.width * .39, radiusY = area.height * .34;
  const boxes = labels.map((_, index) => {
    const angle = -Math.PI / 2 + index * (Math.PI * 2 / labels.length);
    return { x: centre.x + Math.cos(angle) * radiusX - 112, y: centre.y + Math.sin(angle) * radiusY - 38, width: 224, height: 76 };
  });
  const connectors = boxes.map((box, index) => {
    const next = (index + 1) % boxes.length;
    if (!visible(`item-${index + 1}`, state) || !visible(`item-${next + 1}`, state)) return "";
    return curvedArrow(box, boxes[next], "#6f93a4", centre);
  }).join("");
  const nodes = labels.map((label, index) => element(`item-${index + 1}`, node(scene, `item-${index + 1}`, label, "", boxes[index], state, index === labels.length - 1 ? "rust" : "default"), state)).join("");
  return `${connectors}${nodes}<text x="${centre.x}" y="${centre.y + 8}" text-anchor="middle" font-size="25" font-weight="700" fill="#e2a083">REASON · INSPECT · RETRIEVE AGAIN</text>`;
}

function layers(scene, area, state, labels, details) {
  const height = 86, gap = 18;
  return labels.map((label, index) => {
    const id = `item-${index + 1}`, inset = index === 1 ? 55 : index === 2 ? 105 : 0, box = { x: area.x + inset, y: area.y + index * (height + gap), width: area.width - inset * 2, height };
    const arrow = index && visible(`item-${index}`, state) ? arrowPath(area.x + area.width / 2, box.y - gap, area.x + area.width / 2, box.y - 7) : "";
    return element(id, `${arrow}${node(scene, id, label, details[index], box, state, index === 1 ? "rust" : index === 3 ? "evidence" : "default")}`, state);
  }).join("");
}

function progression(scene, area, state, labels) {
  const gap = 28, width = (area.width - gap * (labels.length - 1)) / labels.length;
  return labels.map((label, index) => {
    const id = `item-${index + 1}`, box = { x: area.x + index * (width + gap), y: area.y + area.height / 2 - 68 + (index % 2 ? 24 : -24), width, height: 136 };
    const previous = index ? { x: area.x + (index - 1) * (width + gap), y: area.y + area.height / 2 - 68 + ((index - 1) % 2 ? 24 : -24), width, height: 136 } : null;
    const arrow = index && visible(`item-${index}`, state) ? boxArrow(previous, box) : "";
    return element(id, `${arrow}${node(scene, id, label, "", box, state, index === 0 ? "evidence" : index === labels.length - 1 ? "rust" : "default")}`, state);
  }).join("");
}

function reasoningMap(scene, area, state, labels) {
  const gap = 22, width = (area.width - gap * (labels.length - 1)) / labels.length;
  const boxes = labels.map((_, index) => ({ x: area.x + index * (width + gap), y: area.y + 40 + (index % 2) * 170, width, height: 105 }));
  const connectors = boxes.slice(1).map((box, index) => visible(`item-${index + 1}`, state) && visible(`item-${index + 2}`, state) ? curvedArrow(boxes[index], box, "#6f93a4") : "").join("");
  const nodes = labels.map((label, index) => element(`item-${index + 1}`, node(scene, `item-${index + 1}`, label, "", boxes[index], state, index === 0 ? "evidence" : index === labels.length - 1 ? "rust" : "default"), state)).join("");
  return `${connectors}${nodes}<text x="${area.x + area.width / 2}" y="${area.y + area.height - 20}" text-anchor="middle" font-size="23" fill="#9bb7c4">One inspectable path through the knowledge — not another knowledge store</text>`;
}

function arrowPath(x1, y1, x2, y2, colour = "#6f93a4", width = 3) {
  return `<path d="M ${round(x1)} ${round(y1)}L${round(x2)} ${round(y2)}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" marker-end="url(#presenter-arrow)"/>`;
}

function boxArrow(from, to, colour = "#6f93a4") {
  const start = boxBoundaryPoint(from, to.x + to.width / 2, to.y + to.height / 2);
  const end = boxBoundaryPoint(to, from.x + from.width / 2, from.y + from.height / 2);
  const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy) || 1;
  return arrowPath(start.x, start.y, end.x - dx / length * 9, end.y - dy / length * 9, colour);
}

function curvedArrow(from, to, colour = "#6f93a4", bend = null) {
  const fromCentre = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCentre = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const start = boxBoundaryPoint(from, toCentre.x, toCentre.y);
  const end = boxBoundaryPoint(to, fromCentre.x, fromCentre.y);
  const dx = end.x - start.x, dy = end.y - start.y, length = Math.hypot(dx, dy) || 1;
  const target = { x: end.x - dx / length * 9, y: end.y - dy / length * 9 };
  const control = bend ?? { x: (start.x + target.x) / 2, y: (start.y + target.y) / 2 };
  return `<path d="M ${round(start.x)} ${round(start.y)}Q${round(control.x)} ${round(control.y)} ${round(target.x)} ${round(target.y)}" fill="none" stroke="${colour}" stroke-width="3" stroke-linecap="round" marker-end="url(#presenter-arrow)"/>`;
}

function boxBoundaryPoint(box, towardX, towardY) {
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2;
  const dx = towardX - cx, dy = towardY - cy;
  const scale = 1 / Math.max(Math.abs(dx) / (box.width / 2), Math.abs(dy) / (box.height / 2), 1e-9);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

function allItemsVisible(scene, state) {
  return (scene.items ?? []).every((_, index) => visible(`item-${index + 1}`, state));
}

function round(value) { return Math.round(value * 10) / 10; }

function node(scene, id, label, detail, box, state, tone = "default") {
  const colours = tone === "rust" ? ["#38261f", "#b76c4d"] : tone === "evidence" ? ["#18313a", "#6f93a4"] : ["#1d313a", "#597785"];
  const faded = state?.emphasized?.size && !state.emphasized.has(id) ? .34 : 1, labelY = detail ? box.y + box.height * .42 : box.y + box.height / 2 + 9;
  const detailText = detail ? `<text x="${box.x + box.width / 2}" y="${box.y + box.height * .7}" text-anchor="middle" font-size="${box.width < 300 ? 16 : 19}" fill="#92b2c0">${xml(detail)}</text>` : "";
  return `<g opacity="${faded}"><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="18" fill="${colours[0]}" stroke="${colours[1]}" stroke-width="2"/><text x="${box.x + box.width / 2}" y="${labelY}" text-anchor="middle" font-size="${box.width < 260 ? 19 : 23}" font-weight="700" fill="#eef2f1">${xml(text(scene, id, state, label))}</text>${detailText}</g>`;
}

function visible(id, state) { return !state?.hidden?.has(id); }
function element(id, content, state) { return visible(id, state) ? `<g data-element="${id}"${state?.emphasized?.has(id) ? ' class="emphasized"' : ""}>${content}</g>` : ""; }
function text(scene, id, state, fallback) { return state?.text?.get(id) ?? fallback ?? (id === "headline" ? scene.headline : scene.support); }
