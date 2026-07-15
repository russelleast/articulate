import { centredTextBlock, insetBox, textBlock, xml } from "./layout.mjs";

export function renderSceneSvg(scene, episode, output, companionData, grammar, state = null) {
  const { palette, frame, typography } = grammar;
  const episodeIdentity = episodeLabel(episode.id);
  const header = `<text x="${frame.safeArea.x}" y="${frame.header.y}" font-size="28" fill="${palette.muted}" letter-spacing="2">ARTICULATE JOURNAL · ${episodeIdentity} · ${scene.id}</text>`;
  const footer = `<line x1="${frame.safeArea.x}" y1="${frame.footer.lineY}" x2="${frame.safeArea.x + frame.safeArea.width}" y2="${frame.footer.lineY}" stroke="${palette.line}"/><text x="${frame.safeArea.x}" y="${frame.footer.textY}" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">${xml(scene.narrationReference)}</text><text x="${frame.safeArea.x + frame.safeArea.width}" y="${frame.footer.textY}" text-anchor="end" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">${time(scene.startSeconds)} — ${time(scene.endSeconds)}</text>`;
  const content = renderComposition(scene, episode, companionData, grammar, state);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">
  <rect width="${output.width}" height="${output.height}" fill="${palette.paper}"/>
  <defs><marker id="direction-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${palette.blue}"/></marker></defs>
  <style>text{font-family:${typography.fontFamily}}.emphasized rect,.emphasized circle{stroke:${palette.rust};stroke-width:${grammar.motion.actions.emphasize.strokeWidth}}.emphasized text{fill:${palette.rust}}</style>
  ${header}${content}${footer}</svg>`;
}

function renderComposition(scene, episode, companionData, grammar, state) {
  switch (scene.presentation.composition) {
    case "companion": return companionComposition(scene, companionData, grammar, state);
    case "repository": return visualComposition(scene, grammar, state, (y) => repository(scene, episode, y, grammar, state));
    case "flow": return visualComposition(scene, grammar, state, (y) => flow(scene, y, grammar, state));
    case "grid": return visualComposition(scene, grammar, state, (y) => grid(scene, y, grammar.palette.white, grammar, state));
    case "grid-risk": return visualComposition(scene, grammar, state, (y) => grid(scene, y, grammar.palette.paleRust, grammar, state));
    case "timeline": return visualComposition(scene, grammar, state, (y) => timeline(scene, y, grammar, state));
    case "radial-projection": return visualComposition(scene, grammar, state, (y) => radial(scene, y, "PARTIAL PICTURE", grammar, state));
    case "radial-evidence": return visualComposition(scene, grammar, state, (y) => radial(scene, y, "ASSISTED SYNTHESIS", grammar, state));
    case "reflection": return visualComposition(scene, grammar, state, (y) => reflection(scene, y, grammar, state));
    default: throw new Error(`${scene.id} resolved to unsupported composition: ${scene.presentation.composition}`);
  }
}

function companionComposition(scene, companionData, grammar, state) {
  const { palette, typography } = grammar;
  const grid = grammar.compositionGrids.companion;
  const panel = grid.visualPanel;
  const title = element("headline", textBlock(elementText(scene, "headline", state), grid.headline, { ...typography.roles.sceneHeading, fontSize: 74, maxLines: 3, fill: palette.ink }, `${scene.id} headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), grid.support, { ...typography.roles.support, fontSize: 38, maxLines: 4, fill: palette.blue }, `${scene.id} support`), state);
  const pills = (scene.items ?? []).map((item, index) => pill(scene, item, index, grid.pillOrigin.x + (index % 2) * grid.pillColumnStep, grid.pillOrigin.y + Math.floor(index / 2) * grid.pillRowStep, grid.pillWidth, grammar, state)).join("");
  const companion = `<rect x="${panel.x}" y="${panel.y}" width="${panel.width}" height="${panel.height}" rx="28" fill="${palette.paleBlue}"/><image href="${companionData}" x="${panel.x + 10}" y="${panel.y + 15}" width="${panel.width - 20}" height="${panel.height - 20}" preserveAspectRatio="xMidYMax meet"/><text x="${panel.x + panel.width / 2}" y="${panel.y + panel.height + 15}" text-anchor="middle" font-size="20" fill="${palette.muted}">AI-generated visual companion · static neutral asset</text>`;
  return `${title}${support}${pills}${element("companion", companion, state)}`;
}

function visualComposition(scene, grammar, state, graphic) {
  const { palette, typography } = grammar;
  const question = scene.presentation.archetype === "Reflection";
  const grid = question ? grammar.compositionGrids.reflection : grammar.compositionGrids.standard;
  const headlineStyle = question ? typography.roles.focalQuestion : typography.roles.sceneHeading;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), grid.headline, { ...headlineStyle, fill: palette.ink }, `${scene.id} headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), grid.support, { ...typography.roles.support, fill: palette.blue }, `${scene.id} support`), state);
  return `${headline}${support}${graphic(grid.graphicY)}`;
}

function grid(scene, y, fill, grammar, state) {
  const { palette, spacing, typography } = grammar;
  const items = scene.items ?? [];
  const columns = items.length > 4 ? 3 : 2;
  const width = columns === 3 ? 530 : 790;
  return items.map((item, index) => {
    const x = 112 + (index % columns) * (width + spacing.compositionGap);
    const rowY = y + Math.floor(index / columns) * 138;
    const box = { x, y: rowY, width, height: 108 };
    const inner = insetBox(box, spacing.boxInline, spacing.boxBlock);
    const id = `item-${index + 1}`;
    return element(id, `<rect x="${x}" y="${rowY}" width="${width}" height="108" rx="10" fill="${fill}" stroke="${palette.line}"/>${centredTextBlock(elementText(scene, id, state, item), inner, { ...typography.roles.diagramLabel, fill: palette.ink }, `${scene.id} grid item ${index + 1}`)}`, state);
  }).join("");
}

function flow(scene, y, grammar, state) {
  const { palette, spacing, typography } = grammar;
  const items = scene.items ?? [];
  const width = Math.min(285, (1650 - (items.length - 1) * spacing.flowGap) / items.length);
  return items.map((item, index) => {
    const x = 112 + index * (width + spacing.flowGap);
    const arrow = index < items.length - 1 ? `<line x1="${x + width + 10}" y1="${y + 66}" x2="${x + width + spacing.flowGap - 10}" y2="${y + 66}" stroke="${palette.blue}" stroke-width="3" marker-end="url(#direction-arrow)"/>` : "";
    const box = { x, y, width, height: 132 };
    const inner = insetBox(box, 18, spacing.boxBlock);
    const id = `item-${index + 1}`;
    return `${element(id, `<rect x="${x}" y="${y}" width="${width}" height="132" rx="12" fill="${index === items.length - 1 ? palette.paleBlue : palette.white}" stroke="${palette.line}"/>${centredTextBlock(elementText(scene, id, state, item), inner, { ...typography.roles.flowLabel, align: "middle", fill: palette.ink }, `${scene.id} flow item ${index + 1}`)}`, state)}${visible(id, state) ? arrow : ""}`;
  }).join("");
}

function timeline(scene, y, grammar, state) {
  const { palette, typography } = grammar;
  return `<line x1="190" y1="${y + 110}" x2="1700" y2="${y + 110}" stroke="${palette.blue}" stroke-width="5"/>${(scene.items ?? []).map((item, index) => {
    const x = 240 + index * 440;
    const id = `item-${index + 1}`;
    return element(id, `<circle cx="${x}" cy="${y + 110}" r="18" fill="${index === scene.items.length - 1 ? palette.rust : palette.green}"/>${textBlock(elementText(scene, id, state, item), { x: x - 150, y: y + (index % 2 ? 155 : 15), width: 300 }, { ...typography.roles.diagramLabel, align: "middle", weight: 600, fill: palette.ink }, `${scene.id} timeline item ${index + 1}`)}`, state);
  }).join("")}`;
}

function radial(scene, y, centre, grammar, state) {
  const { palette, typography } = grammar;
  const items = scene.items ?? [];
  const cx = 960, cy = y + 160;
  const positions = items.map((item, index) => {
    const angle = (Math.PI * 2 * index / items.length) - Math.PI / 2;
    const x = cx + Math.cos(angle) * 600;
    const nodeY = cy + Math.sin(angle) * 210;
    const box = { x: x - 125, y: nodeY - 42, width: 250, height: 84 };
    return { id: `item-${index + 1}`, item, x, y: nodeY, box };
  });
  const nodes = positions.map((node, index) => element(node.id, `<rect x="${node.box.x}" y="${node.box.y}" width="250" height="84" rx="42" fill="${palette.white}" stroke="${palette.line}"/>${centredTextBlock(elementText(scene, node.id, state, node.item), insetBox(node.box, 20, 8), { ...typography.roles.diagramLabel, fontSize: 24, weight: 600, align: "middle", fill: palette.ink }, `${scene.id} radial item ${index + 1}`)}`, state)).join("");
  const point = new Map([["centre", { x: cx, y: cy }], ...positions.map((node) => [node.id, { x: node.x, y: node.y }])]);
  const declaredConnections = state ? [...state.connections.values()] : positions.map((node) => ({ from: node.id, to: "centre", directional: true }));
  const connectors = declaredConnections.map((connection) => {
    const from = point.get(connection.from), to = point.get(connection.to);
    if (!from || !to) return "";
    const ends = connectorEnds(from, to, connection.from === "centre", connection.to === "centre");
    return `<line data-connection="${connection.from}-${connection.to}" x1="${ends.x1}" y1="${ends.y1}" x2="${ends.x2}" y2="${ends.y2}" stroke="${palette.blue}" stroke-width="${grammar.motion.directionalConnector.strokeWidth}" ${connection.directional === false ? "" : 'marker-end="url(#direction-arrow)"'}/>`;
  }).join("");
  const centreBox = { x: cx - 105, y: cy - 52, width: 210, height: 104 };
  const centreElement = element("centre", `<circle cx="${cx}" cy="${cy}" r="135" fill="${palette.paleBlue}" stroke="${palette.blue}" stroke-width="3"/>${centredTextBlock(centre, centreBox, { fontSize: 25, weight: 700, maxLines: 3, lineHeight: typography.lineHeight, align: "middle", fill: palette.blue }, `${scene.id} radial centre`)}`, state);
  return `${connectors}${nodes}${centreElement}`;
}

function repository(scene, episode, y, grammar, state) {
  const { palette, typography } = grammar;
  const excerpt = scene.evidence?.excerpt;
  if (!Array.isArray(excerpt) || excerpt.length === 0) {
    throw new Error(`${scene.id} repository composition requires evidence.excerpt`);
  }
  const episodeHeading = `# ${episodeLabel(episode.id, false)} – ${episode.title}`;
  const excerptText = excerpt.map((line, index) =>
    element(`evidence-${index + 1}`, textBlock(elementText(scene, `evidence-${index + 1}`, state, line), { x: 315, y: y + 190 + index * 45, width: 1290 }, { ...typography.roles.evidenceText, fontSize: 24, fill: "#e7ecee" }, `${scene.id} evidence excerpt ${index + 1}`), state)
  ).join("");
  const shell = `<rect x="245" y="${y}" width="1430" height="355" rx="16" fill="${palette.dark}"/><circle cx="290" cy="${y + 38}" r="8" fill="${palette.rust}"/><circle cx="318" cy="${y + 38}" r="8" fill="${palette.green}"/><text x="315" y="${y + 125}" font-size="26" fill="#8fb0c0">${xml(episodeHeading)}</text>`;
  return `${element("repository-window", shell, state)}${element("item-1", `<text x="365" y="${y + 47}" font-size="24" fill="#c6d0d5">${xml(elementText(scene, "item-1", state, scene.items?.[0] ?? ""))}</text>`, state)}${excerptText}${element("item-2", `<text x="315" y="${y + 310}" font-size="22" fill="#9eaaaf">${xml(elementText(scene, "item-2", state, scene.items?.[1] ?? ""))}</text>`, state)}`;
}

function reflection(scene, y, grammar, state) {
  const { palette, typography } = grammar;
  const box = { x: 400, y: y + 40, width: 1120, height: 96 };
  return element("item-1", `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="48" fill="${palette.paleRust}"/>${centredTextBlock(elementText(scene, "item-1", state, scene.items?.[0] ?? ""), insetBox(box, 50, 12), { ...typography.roles.diagramLabel, align: "middle", weight: 600, fill: palette.rust }, `${scene.id} reflection`)}`, state);
}

function pill(scene, text, index, x, y, width, grammar, state) {
  const { palette, typography } = grammar;
  const box = { x, y, width, height: 50 };
  const id = `item-${index + 1}`;
  return element(id, `<rect x="${x}" y="${y}" width="${width}" height="50" rx="25" fill="${palette.white}" stroke="${palette.line}"/>${centredTextBlock(elementText(scene, id, state, text), insetBox(box, 15, 6), { ...typography.roles.annotation, fontSize: 19, maxLines: 1, weight: 500, align: "middle", fill: palette.muted }, `${scene.id} pill`)}`, state);
}

function visible(id, state) { return !state?.hidden?.has(id); }

function element(id, content, state) {
  if (!visible(id, state)) return "";
  return `<g data-element="${id}"${state?.emphasized?.has(id) ? ' class="emphasized"' : ""}>${content}</g>`;
}

function elementText(scene, id, state, fallback) {
  if (state?.text?.has(id)) return state.text.get(id);
  if (fallback !== undefined) return fallback;
  if (id === "headline") return scene.headline;
  if (id === "support") return scene.support;
  return "";
}

function connectorEnds(from, to, fromIsCentre, toIsCentre) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length, uy = dy / length;
  const fromInset = fromIsCentre ? 138 : ellipseRadius(ux, uy, 125, 42);
  const toInset = toIsCentre ? 138 : ellipseRadius(ux, uy, 125, 42);
  return {
    x1: roundCoordinate(from.x + ux * fromInset),
    y1: roundCoordinate(from.y + uy * fromInset),
    x2: roundCoordinate(to.x - ux * toInset),
    y2: roundCoordinate(to.y - uy * toInset)
  };
}

function ellipseRadius(ux, uy, rx, ry) {
  return 1 / Math.sqrt((ux * ux) / (rx * rx) + (uy * uy) / (ry * ry));
}

function roundCoordinate(value) { return Number(value.toFixed(3)); }

function episodeLabel(id, upper = true) {
  const match = String(id).match(/^episode-(.+)$/i);
  const label = match ? `Episode ${match[1]}` : String(id).replaceAll("-", " ");
  return upper ? label.toUpperCase() : label;
}

function time(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${secs.toFixed(3).padStart(6, "0")}`;
}
