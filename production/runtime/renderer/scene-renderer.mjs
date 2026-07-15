import { centredTextBlock, insetBox, textBlock, xml } from "./layout.mjs";

export function renderSceneSvg(scene, episode, output, companionData, grammar, state = null) {
  const { palette, frame, typography } = grammar;
  if (scene.presentation.composition === "studio") {
    return studioSceneSvg(scene, episode, output, companionData, grammar, state);
  }
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
    case "studio": return studioComposition(scene, companionData, grammar, state);
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

function studioSceneSvg(scene, episode, output, companionData, grammar, state) {
  const content = studioComposition(scene, companionData, grammar, state);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">
  <defs>
    <linearGradient id="studio-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d171d"/><stop offset="1" stop-color="#182932"/></linearGradient>
    <radialGradient id="studio-light"><stop offset="0" stop-color="#c88a62" stop-opacity=".28"/><stop offset="1" stop-color="#c88a62" stop-opacity="0"/></radialGradient>
    <pattern id="studio-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8eabb8" stroke-opacity=".08" stroke-width="1"/></pattern>
    <filter id="board-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#05090b" flood-opacity=".42"/></filter>
    <filter id="companion-shadow" x="-30%" y="-20%" width="160%" height="150%"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#05090b" flood-opacity=".55"/></filter>
    <marker id="studio-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#55798b"/></marker>
  </defs>
  <style>text{font-family:${grammar.typography.fontFamily}}.emphasized rect{stroke:#b76c4d!important;stroke-width:4}.emphasized text{fill:#9a4f34!important}</style>
  <rect width="1920" height="1080" fill="url(#studio-background)"/>
  <rect width="1920" height="1080" fill="url(#studio-grid)"/>
  <ellipse cx="315" cy="430" rx="520" ry="620" fill="url(#studio-light)"/>
  <text x="72" y="72" font-size="21" font-weight="650" fill="#d8e1e4" letter-spacing="4">ARTICULATE</text>
  <text x="72" y="103" font-size="14" fill="#8eabb8" letter-spacing="2">ARCHITECTURAL STUDIO</text>
  ${content}
  <text x="72" y="1030" font-size="17" fill="#8eabb8">AI-created visual Companion · Russell's recorded narration</text>
  <text x="1848" y="1030" text-anchor="end" font-size="17" fill="#8eabb8">${xml(episode.title)} · Production Quality Baseline v1</text>
  </svg>`;
}

function studioComposition(scene, companionData, grammar, state) {
  const board = { x: 590, y: 86, width: 1260, height: 914 };
  const idle = companionIdleTransform(scene, state, grammar);
  const positions = new Map([
    ["item-1", { x: 735, y: 375, width: 230, height: 92 }],
    ["item-2", { x: 1135, y: 375, width: 230, height: 92 }],
    ["item-3", { x: 1030, y: 490, width: 390, height: 104 }],
    ["item-4", { x: 660, y: 670, width: 250, height: 82 }],
    ["item-5", { x: 960, y: 670, width: 250, height: 82 }],
    ["item-6", { x: 1260, y: 670, width: 250, height: 82 }],
    ["item-7", { x: 810, y: 815, width: 250, height: 82 }],
    ["item-8", { x: 1110, y: 815, width: 250, height: 82 }]
  ]);
  const boardShell = `<rect x="${board.x}" y="${board.y}" width="${board.width}" height="${board.height}" rx="34" fill="#f6f2e9" filter="url(#board-shadow)"/><rect x="${board.x + 20}" y="${board.y + 20}" width="${board.width - 40}" height="${board.height - 40}" rx="24" fill="none" stroke="#cfcbc1"/>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 660, y: 190, width: 1080 }, { fontSize: 62, weight: 720, maxLines: 1, fill: "#172028" }, `${scene.id} studio headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 662, y: 260, width: 1050 }, { fontSize: 28, weight: 450, maxLines: 2, fill: "#55798b" }, `${scene.id} studio support`), state);
  const connectors = [...(state?.connections?.values() ?? [])].map((connection) => studioConnection(connection, positions)).join("");
  const nodes = (scene.items ?? []).map((item, index) => {
    const id = `item-${index + 1}`;
    const box = positions.get(id);
    const persistent = id === "item-3";
    const transactional = id === "item-1" || id === "item-2";
    const fill = persistent ? "#dbe8eb" : transactional ? "#fffdfa" : "#e8eeeb";
    const stroke = persistent ? "#55798b" : transactional ? "#b6b0a7" : "#92a8a0";
    return element(id, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${persistent ? 24 : 18}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${centredTextBlock(elementText(scene, id, state, item), insetBox(box, 18, 10), { fontSize: persistent ? 27 : 22, weight: persistent ? 700 : 600, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#26333a" }, `${scene.id} studio item ${index + 1}`)}`, state);
  }).join("");
  const promptArrow = visible("item-1", state) && visible("item-2", state)
    ? `<line x1="980" y1="421" x2="1118" y2="421" stroke="#7b8c94" stroke-width="3" marker-end="url(#studio-arrow)"/><text x="1048" y="400" text-anchor="middle" font-size="16" fill="#7b8c94" letter-spacing="1.5">TRANSACTION</text>`
    : "";
  const companion = element("companion", `<g transform="${idle}" filter="url(#companion-shadow)"><image href="${companionData}" x="18" y="145" width="590" height="835" preserveAspectRatio="xMidYMax meet"/></g><ellipse cx="300" cy="955" rx="225" ry="24" fill="#05090b" opacity=".34"/>`, state);
  return `${boardShell}${companion}${headline}${support}${connectors}${promptArrow}${nodes}`;
}

function studioConnection(connection, positions) {
  const from = positions.get(connection.from);
  const to = positions.get(connection.to);
  if (!from || !to) return "";
  const x1 = from.x + from.width / 2;
  const y1 = from.y + from.height;
  const x2 = to.x + to.width / 2;
  const y2 = to.y;
  const midY = y1 + (y2 - y1) * 0.52;
  return `<path data-connection="${connection.from}-${connection.to}" d="M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2 - 8}" fill="none" stroke="#55798b" stroke-width="3" stroke-linecap="round" ${connection.directional === false ? "" : 'marker-end="url(#studio-arrow)"'}/>`;
}

function companionIdleTransform(scene, state, grammar) {
  if (!scene.motion?.companionIdle) return "translate(0 0) scale(1)";
  const motion = grammar.motion.companionIdle;
  const phase = ((state?.frame ?? 0) % motion.periodFrames) / motion.periodFrames * Math.PI * 2;
  const y = Math.sin(phase) * motion.translateYPixels;
  const scale = 1 + Math.sin(phase) * motion.scaleAmplitude;
  return `translate(0 ${y.toFixed(3)}) translate(300 980) scale(${scale.toFixed(6)}) translate(-300 -980)`;
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
