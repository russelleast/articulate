import { centredTextBlock, insetBox, textBlock, xml } from "./layout.mjs";

export function renderSceneSvg(scene, episode, output, companionData, grammar, state = null) {
  const { palette, frame, typography } = grammar;
  if (scene.presentation.composition === "studio") {
    return studioSceneSvg(scene, episode, output, companionData, grammar, state);
  }
  if (["whiteboard", "workspace", "focus"].includes(scene.presentation.composition)) {
    return environmentSceneSvg(scene, episode, output, companionData, grammar, state);
  }
  const episodeIdentity = episodeLabel(episode.id);
  const headerText = scene.productionMetadata === false ? `ARTICULATE JOURNAL · ${episodeIdentity}` : `ARTICULATE JOURNAL · ${episodeIdentity} · ${scene.id}`;
  const header = `<text x="${frame.safeArea.x}" y="${frame.header.y}" font-size="28" fill="${palette.muted}" letter-spacing="2">${headerText}</text>`;
  const footer = scene.productionMetadata === false
    ? `<line x1="${frame.safeArea.x}" y1="${frame.footer.lineY}" x2="${frame.safeArea.x + frame.safeArea.width}" y2="${frame.footer.lineY}" stroke="${palette.line}"/><text x="${frame.safeArea.x}" y="${frame.footer.textY}" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">ARTICULATE JOURNAL</text><text x="${frame.safeArea.x + frame.safeArea.width}" y="${frame.footer.textY}" text-anchor="end" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">${xml(episode.title)}</text>`
    : `<line x1="${frame.safeArea.x}" y1="${frame.footer.lineY}" x2="${frame.safeArea.x + frame.safeArea.width}" y2="${frame.footer.lineY}" stroke="${palette.line}"/><text x="${frame.safeArea.x}" y="${frame.footer.textY}" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">${xml(scene.narrationReference)}</text><text x="${frame.safeArea.x + frame.safeArea.width}" y="${frame.footer.textY}" text-anchor="end" font-size="${typography.roles.provenance.fontSize}" fill="${palette.muted}">${time(scene.startSeconds)} — ${time(scene.endSeconds)}</text>`;
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
    case "whiteboard": return whiteboardComposition(scene, grammar, state);
    case "workspace": return workspaceComposition(scene, grammar, state);
    case "focus": return focusComposition(scene, grammar, state);
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

function environmentSceneSvg(scene, episode, output, companionData, grammar, state) {
  const labels = { whiteboard: "ARCHITECTURAL WHITEBOARD", workspace: "DIGITAL WORKSPACE", focus: "FOCUS CANVAS" };
  const content = renderComposition(scene, episode, companionData, grammar, state);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">
  <defs>
    <linearGradient id="studio-background" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0d171d"/><stop offset="1" stop-color="#182932"/></linearGradient>
    <radialGradient id="focus-light"><stop offset="0" stop-color="#527487" stop-opacity=".26"/><stop offset="1" stop-color="#527487" stop-opacity="0"/></radialGradient>
    <pattern id="studio-grid" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8eabb8" stroke-opacity=".08" stroke-width="1"/></pattern>
    <filter id="board-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="18" stdDeviation="24" flood-color="#05090b" flood-opacity=".42"/></filter>
    <marker id="studio-arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M 1 1 L 11 6 L 1 11 Z" fill="#55798b"/></marker>
    <marker id="direction-arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M 1 1 L 11 6 L 1 11 Z" fill="#55798b"/></marker>
  </defs>
  <style>text{font-family:${grammar.typography.fontFamily}}.emphasized rect,.emphasized circle{stroke:#b76c4d!important;stroke-width:4}.emphasized text{fill:#9a4f34!important}</style>
  <rect width="1920" height="1080" fill="url(#studio-background)"/><rect width="1920" height="1080" fill="url(#studio-grid)"/>
  <text x="72" y="72" font-size="21" font-weight="650" fill="#d8e1e4" letter-spacing="4">ARTICULATE</text>
  <text x="72" y="103" font-size="14" fill="#8eabb8" letter-spacing="2">${labels[scene.presentation.composition]}</text>
  ${content}
  <text x="72" y="1030" font-size="17" fill="#8eabb8">${scene.productionMetadata === false ? "ARTICULATE JOURNAL" : xml(scene.narrationReference)}</text>
  <text x="1848" y="1030" text-anchor="end" font-size="17" fill="#8eabb8">${xml(episode.title)} · ${episodeLabel(episode.id)}</text>
  </svg>`;
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
    <marker id="studio-arrow" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto"><path d="M 1 1 L 11 6 L 1 11 Z" fill="#55798b"/></marker>
  </defs>
  <style>text{font-family:${grammar.typography.fontFamily}}.emphasized rect{stroke:#b76c4d!important;stroke-width:4}.emphasized text{fill:#9a4f34!important}</style>
  <rect width="1920" height="1080" fill="url(#studio-background)"/>
  <rect width="1920" height="1080" fill="url(#studio-grid)"/>
  <ellipse cx="315" cy="430" rx="520" ry="620" fill="url(#studio-light)"/>
  <text x="72" y="72" font-size="21" font-weight="650" fill="#d8e1e4" letter-spacing="4">ARTICULATE</text>
  <text x="72" y="103" font-size="14" fill="#8eabb8" letter-spacing="2">ARCHITECTURAL STUDIO</text>
  ${content}
  <text x="72" y="1030" font-size="17" fill="#8eabb8">AI-created visual Companion · Russell's recorded narration</text>
  <text x="1848" y="1030" text-anchor="end" font-size="17" fill="#8eabb8">${xml(episode.title)} · ${xml(scene.productionLabel ?? episodeLabel(episode.id))}</text>
  </svg>`;
}

function studioComposition(scene, companionData, grammar, state) {
  if (scene.studioLayout === "workspace") {
    return studioWorkspaceComposition(scene, companionData, grammar, state);
  }
  if (scene.studioLayout && !scene.studioLayout.startsWith("companion-model")) {
    return studioWelcomeComposition(scene, companionData, grammar, state);
  }
  const cleanModel = scene.studioLayout === "companion-model-v2";
  const expandedHeading = scene.studioHeadlineLines === 2;
  const board = { x: 590, y: 86, width: 1260, height: 914 };
  const idle = companionIdleTransform(scene, state, grammar);
  const positions = new Map(cleanModel ? [
    ["item-1", { x: 750, y: 330, width: 300, height: 92 }],
    ["item-2", { x: 1190, y: 330, width: 300, height: 92 }],
    ["item-3", { x: 850, y: 465, width: 540, height: 106 }],
    ...Array.from({ length: 5 }, (_, index) => [`item-${index + 4}`, { x: 620 + index * 222, y: 700, width: 200, height: 104 }])
  ] : [
    ["item-1", { x: 735, y: expandedHeading ? 420 : 330, width: 230, height: 92 }],
    ["item-2", { x: 1135, y: expandedHeading ? 420 : 330, width: 230, height: 92 }],
    ["item-3", { x: 1030, y: expandedHeading ? 535 : 435, width: 390, height: 104 }],
    ["item-4", { x: 660, y: expandedHeading ? 695 : 590, width: 250, height: 82 }],
    ["item-5", { x: 960, y: expandedHeading ? 695 : 590, width: 250, height: 82 }],
    ["item-6", { x: 1260, y: expandedHeading ? 695 : 590, width: 250, height: 82 }],
    ["item-7", { x: 810, y: expandedHeading ? 820 : 725, width: 250, height: 82 }],
    ["item-8", { x: 1110, y: expandedHeading ? 820 : 725, width: 250, height: 82 }]
  ]);
  const boardShell = `<rect x="${board.x}" y="${board.y}" width="${board.width}" height="${board.height}" rx="34" fill="#f6f2e9" filter="url(#board-shadow)"/><rect x="${board.x + 20}" y="${board.y + 20}" width="${board.width - 40}" height="${board.height - 40}" rx="24" fill="none" stroke="#cfcbc1"/>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 660, y: 190, width: 1080 }, { fontSize: expandedHeading ? 52 : 62, weight: 720, maxLines: expandedHeading ? 2 : 1, lineHeight: 1.05, fill: "#172028" }, `${scene.id} studio headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 662, y: expandedHeading ? 330 : 260, width: 1050 }, { fontSize: expandedHeading ? 25 : 28, weight: 450, maxLines: 2, fill: "#55798b" }, `${scene.id} studio support`), state);
  const activeConnections = [...(state?.connections?.values() ?? [])];
  const connectors = cleanModel
    ? companionCapabilityTree(activeConnections, positions)
    : activeConnections.map((connection) => curvedBoxConnector(connection, positions, activeConnections)).join("");
  const nodes = (scene.items ?? []).map((item, index) => {
    const id = `item-${index + 1}`;
    const box = positions.get(id);
    const persistent = id === "item-3";
    const transactional = id === "item-1" || id === "item-2";
    const fill = persistent ? "#dbe8eb" : transactional ? "#fffdfa" : "#e8eeeb";
    const stroke = persistent ? "#55798b" : transactional ? "#b6b0a7" : "#92a8a0";
    const capability = cleanModel && index >= 3;
    return element(id, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="${persistent ? 24 : 18}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>${centredTextBlock(elementText(scene, id, state, item), insetBox(box, capability ? 12 : 18, 10), { fontSize: persistent ? 27 : capability ? 19 : 22, weight: persistent ? 700 : 600, maxLines: capability ? 3 : 2, lineHeight: 1.1, align: "middle", fill: "#26333a" }, `${scene.id} studio item ${index + 1}`)}`, state);
  }).join("");
  const promptArrow = scene.transactionLabel !== false && visible("item-1", state) && visible("item-2", state)
    ? cleanModel
      ? `<line x1="1065" y1="376" x2="1175" y2="376" stroke="#7b8c94" stroke-width="3" stroke-linecap="round" marker-end="url(#studio-arrow)"/><text x="1120" y="355" text-anchor="middle" font-size="16" fill="#7b8c94" letter-spacing="1.5">TRANSACTION</text>`
      : `<line x1="980" y1="376" x2="1118" y2="376" stroke="#7b8c94" stroke-width="3" stroke-linecap="round" marker-end="url(#studio-arrow)"/><text x="1048" y="355" text-anchor="middle" font-size="16" fill="#7b8c94" letter-spacing="1.5">TRANSACTION</text>`
    : "";
  const companion = element("companion", companionFigure(companionData, idle, state), state);
  return `${boardShell}${companion}${headline}${support}${connectors}${promptArrow}${nodes}`;
}

function companionCapabilityTree(connections, positions) {
  const branches = connections.filter((connection) => connection.from === "item-3" && positions.has(connection.to));
  if (branches.length === 0) return "";
  const source = positions.get("item-3");
  const sourceX = source.x + source.width / 2;
  const sourceY = source.y + source.height + 2;
  const railY = 640;
  const destinations = branches.map((connection) => ({ connection, box: positions.get(connection.to) }));
  const centres = destinations.map(({ box }) => box.x + box.width / 2);
  const railStart = Math.min(sourceX, ...centres);
  const railEnd = Math.max(sourceX, ...centres);
  const stem = `<path d="M ${sourceX} ${sourceY} L ${sourceX} ${railY} M ${railStart} ${railY} L ${railEnd} ${railY}" fill="none" stroke="#55798b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  const drops = destinations.map(({ connection, box }) => {
    const x = box.x + box.width / 2;
    return `<line data-connection="${connection.from}-${connection.to}" x1="${x}" y1="${railY}" x2="${x}" y2="${box.y - 5}" stroke="#55798b" stroke-width="3" stroke-linecap="round" marker-end="url(#studio-arrow)"/>`;
  }).join("");
  return `${stem}${drops}`;
}

function studioWelcomeComposition(scene, companionData, grammar, state) {
  const board = { x: 590, y: 86, width: 1260, height: 914 };
  const idle = companionIdleTransform(scene, state, grammar);
  const boardShell = `<rect x="${board.x}" y="${board.y}" width="${board.width}" height="${board.height}" rx="34" fill="#f6f2e9" filter="url(#board-shadow)"/><rect x="${board.x + 20}" y="${board.y + 20}" width="${board.width - 40}" height="${board.height - 40}" rx="24" fill="none" stroke="#cfcbc1"/>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 660, y: scene.studioLayout === "closing" ? 280 : 225, width: 1080 }, { fontSize: scene.studioLayout === "closing" ? 72 : 68, weight: 720, maxLines: 3, lineHeight: 1.05, fill: "#172028" }, `${scene.id} studio headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 664, y: scene.studioLayout === "closing" ? 470 : 420, width: 1000 }, { fontSize: 32, weight: 450, maxLines: 3, lineHeight: 1.15, fill: "#55798b" }, `${scene.id} studio support`), state);
  const items = (scene.items ?? []).map((item, index) => {
    const columns = Math.min(3, scene.items.length);
    const width = columns === 1 ? 520 : columns === 2 ? 430 : 315;
    const gap = 32;
    const total = columns * width + (columns - 1) * gap;
    const x = 650 + (1180 - total) / 2 + (index % columns) * (width + gap);
    const y = (scene.studioLayout === "closing" ? 650 : 625) + Math.floor(index / columns) * 120;
    const box = { x, y, width, height: 82 };
    return element(`item-${index + 1}`, `<rect x="${x}" y="${y}" width="${width}" height="82" rx="20" fill="#e4eceb" stroke="#92a8a0" stroke-width="2"/>${centredTextBlock(elementText(scene, `item-${index + 1}`, state, item), insetBox(box, 18, 10), { fontSize: 23, weight: 600, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#26333a" }, `${scene.id} studio item ${index + 1}`)}`, state);
  }).join("");
  const companion = element("companion", companionFigure(companionData, idle, state), state);
  return `${boardShell}${companion}${headline}${support}${items}`;
}

function studioWorkspaceComposition(scene, companionData, grammar, state) {
  const idle = companionIdleTransform(scene, state, grammar);
  const window = { x: 590, y: 105, width: 1260, height: 875 };
  const shell = `<rect x="${window.x}" y="${window.y}" width="${window.width}" height="${window.height}" rx="30" fill="#111920" filter="url(#board-shadow)"/><rect x="${window.x}" y="${window.y}" width="${window.width}" height="64" rx="30" fill="#1b2931"/><circle cx="635" cy="137" r="7" fill="#a65d3f"/><circle cx="661" cy="137" r="7" fill="#c3a36b"/><circle cx="687" cy="137" r="7" fill="#547064"/><line x1="955" y1="169" x2="955" y2="980" stroke="#31424b"/>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 1010, y: 250, width: 760 }, { fontSize: 48, weight: 700, maxLines: 2, lineHeight: 1.08, fill: "#f4f0e8" }, `${scene.id} studio workspace headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 1012, y: 360, width: 730 }, { fontSize: 26, weight: 430, maxLines: 3, lineHeight: 1.14, fill: "#8fb0c0" }, `${scene.id} studio workspace support`), state);
  const paths = (scene.items ?? []).map((item, index) => {
    const box = { x: 630, y: 235 + index * 105, width: 280, height: 70 };
    return element(`item-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="12" fill="#18262e" stroke="#31424b"/>${centredTextBlock(elementText(scene, `item-${index + 1}`, state, item), insetBox(box, 18, 10), { fontSize: 20, weight: 550, maxLines: 2, lineHeight: 1.1, align: "middle", fill: "#cbd5d9" }, `${scene.id} studio workspace item ${index + 1}`)}`, state);
  }).join("");
  const evidence = (scene.evidence?.excerpt ?? []).map((line, index) => {
    const box = { x: 1010, y: 500 + index * 112, width: 730, height: 82 };
    return element(`evidence-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="14" fill="#18262e" stroke="#31424b"/><rect x="${box.x}" y="${box.y}" width="8" height="${box.height}" rx="4" fill="#3d6075"/>${centredTextBlock(elementText(scene, `evidence-${index + 1}`, state, line), insetBox(box, 28, 10), { fontSize: 22, weight: 500, maxLines: 2, lineHeight: 1.12, fill: "#dce4e7" }, `${scene.id} studio workspace evidence ${index + 1}`)}`, state);
  }).join("");
  return `${shell}${element("companion", companionFigure(companionData, idle, state), state)}${headline}${support}${paths}${evidence}`;
}

function whiteboardComposition(scene, grammar, state) {
  const board = { x: 130, y: 90, width: 1660, height: 900 };
  const positions = whiteboardPositions(scene, board);
  const shell = `<rect x="${board.x}" y="${board.y}" width="${board.width}" height="${board.height}" rx="34" fill="#f6f2e9" filter="url(#board-shadow)"/><rect x="${board.x + 20}" y="${board.y + 20}" width="${board.width - 40}" height="${board.height - 40}" rx="24" fill="none" stroke="#cfcbc1"/>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 205, y: 195, width: 1450 }, { fontSize: 62, weight: 720, maxLines: 2, lineHeight: 1.06, fill: "#172028" }, `${scene.id} whiteboard headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 208, y: 285, width: 1420 }, { fontSize: 29, weight: 450, maxLines: 2, fill: "#55798b" }, `${scene.id} whiteboard support`), state);
  const connectors = [...(state?.connections?.values() ?? [])].map((connection) => straightBoxConnector(connection, positions)).join("");
  const nodes = (scene.items ?? []).map((item, index) => {
    const id = `item-${index + 1}`;
    const box = positions.get(id);
    return element(id, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="20" fill="${index === 0 && scene.diagramLayout === "hub" ? "#dbe8eb" : "#e8eeeb"}" stroke="#92a8a0" stroke-width="2"/>${centredTextBlock(elementText(scene, id, state, item), insetBox(box, 24, 14), { fontSize: 27, weight: 620, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#26333a" }, `${scene.id} whiteboard item ${index + 1}`)}`, state);
  }).join("");
  return `${shell}${headline}${support}${connectors}${nodes}`;
}

function whiteboardPositions(scene, board) {
  const positions = new Map();
  const items = scene.items ?? [];
  if (scene.diagramLayout === "path") {
    const width = 310;
    items.forEach((_, index) => positions.set(`item-${index + 1}`, { x: 235 + index * 390, y: 520 + (index % 2) * 90, width, height: 120 }));
    return positions;
  }
  if (scene.diagramLayout === "hub") {
    const boxes = [
      { x: 760, y: 470, width: 400, height: 120 },
      { x: 230, y: 400, width: 330, height: 108 }, { x: 230, y: 665, width: 330, height: 108 },
      { x: 1360, y: 400, width: 330, height: 108 }, { x: 1360, y: 665, width: 330, height: 108 },
      { x: 795, y: 720, width: 330, height: 108 }
    ];
    items.forEach((_, index) => positions.set(`item-${index + 1}`, boxes[index]));
    return positions;
  }
  const columns = items.length > 4 ? 3 : 2;
  const width = columns === 3 ? 455 : 650;
  const gap = columns === 3 ? 55 : 90;
  const startX = board.x + (board.width - (columns * width + (columns - 1) * gap)) / 2;
  items.forEach((_, index) => positions.set(`item-${index + 1}`, { x: startX + (index % columns) * (width + gap), y: 410 + Math.floor(index / columns) * 210, width, height: 135 }));
  return positions;
}

function workspaceComposition(scene, grammar, state) {
  const window = { x: 145, y: 120, width: 1630, height: 830 };
  const questionLayout = scene.workspaceLayout === "question";
  const shell = `<rect x="${window.x}" y="${window.y}" width="${window.width}" height="${window.height}" rx="28" fill="#111920" filter="url(#board-shadow)"/><rect x="${window.x}" y="${window.y}" width="${window.width}" height="66" rx="28" fill="#1b2931"/><circle cx="195" cy="153" r="8" fill="#a65d3f"/><circle cx="224" cy="153" r="8" fill="#c3a36b"/><circle cx="253" cy="153" r="8" fill="#547064"/><line x1="620" y1="186" x2="620" y2="950" stroke="#31424b"/><text x="290" y="163" font-size="19" fill="#9fb2bb">articulate / architectural-journal</text>`;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 680, y: 260, width: 1010 }, { fontSize: questionLayout ? 46 : 52, weight: 700, maxLines: questionLayout ? 3 : 2, lineHeight: 1.08, fill: "#f4f0e8" }, `${scene.id} workspace headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 682, y: questionLayout ? 440 : 365, width: 980 }, { fontSize: 27, weight: 430, maxLines: 2, fill: "#8fb0c0" }, `${scene.id} workspace support`), state);
  const paths = (scene.items ?? []).map((item, index) => element(`item-${index + 1}`, `<rect x="185" y="${250 + index * 105}" width="390" height="74" rx="12" fill="#18262e" stroke="#31424b"/><text x="215" y="${296 + index * 105}" font-size="22" fill="#cbd5d9">${xml(elementText(scene, `item-${index + 1}`, state, item))}</text>`, state)).join("");
  const evidence = (scene.evidence?.excerpt ?? []).map((line, index) => {
    const box = { x: 680, y: (questionLayout ? 535 : 455) + index * (questionLayout ? 96 : 112), width: 980, height: 82 };
    return element(`evidence-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="14" fill="#18262e" stroke="#31424b"/><rect x="${box.x}" y="${box.y}" width="8" height="${box.height}" rx="4" fill="${index % 2 ? "#547064" : "#3d6075"}"/>${centredTextBlock(elementText(scene, `evidence-${index + 1}`, state, line), insetBox(box, 32, 12), { fontSize: 24, weight: 500, maxLines: 2, lineHeight: 1.14, fill: "#dce4e7" }, `${scene.id} workspace evidence ${index + 1}`)}`, state);
  }).join("");
  return `${element("workspace-window", shell, state)}${headline}${support}${paths}${evidence}`;
}

function focusComposition(scene, grammar, state) {
  const headlineSize = scene.focusLayout === "bridge" ? 76 : scene.focusLayout === "reflection" ? 68 : 64;
  const headline = element("headline", textBlock(elementText(scene, "headline", state), { x: 210, y: scene.focusLayout === "bridge" ? 310 : 220, width: 1500 }, { fontSize: headlineSize, weight: 720, maxLines: 4, lineHeight: 1.05, align: scene.focusLayout === "bridge" ? "middle" : "start", fill: "#f4f0e8" }, `${scene.id} focus headline`), state);
  const support = element("support", textBlock(elementText(scene, "support", state), { x: 260, y: scene.focusLayout === "bridge" ? 560 : 350, width: 1400 }, { fontSize: 31, weight: 430, maxLines: 3, lineHeight: 1.15, align: scene.focusLayout === "bridge" ? "middle" : "start", fill: "#9bb7c4" }, `${scene.id} focus support`), state);
  const glow = `<ellipse cx="960" cy="560" rx="840" ry="520" fill="url(#focus-light)"/>`;
  const items = scene.focusLayout === "radial"
    ? radial(scene, 430, scene.centre ?? "CONNECTED KNOWLEDGE", grammar, state)
    : focusItems(scene, state);
  return `${glow}${headline}${support}${items}`;
}

function focusItems(scene, state) {
  const items = scene.items ?? [];
  if (scene.focusLayout === "balance") return focusBalance(scene, state);
  if (scene.focusLayout === "bridge") {
    return items.map((item, index) => {
      const box = { x: 610, y: 690 + index * 115, width: 700, height: 82 };
      return element(`item-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="41" fill="#dbe8eb" stroke="#6f8e9d" stroke-width="2"/>${centredTextBlock(elementText(scene, `item-${index + 1}`, state, item), insetBox(box, 36, 12), { fontSize: 25, weight: 650, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#26333a" }, `${scene.id} bridge item ${index + 1}`)}`, state);
    }).join("");
  }
  if (scene.focusLayout === "reflection") {
    return items.map((item, index) => {
      const box = { x: 360, y: 610 + index * 130, width: 1200, height: 96 };
      return element(`item-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="48" fill="#263a45" stroke="#6f8e9d" stroke-width="2"/>${centredTextBlock(elementText(scene, `item-${index + 1}`, state, item), insetBox(box, 48, 12), { fontSize: 28, weight: 600, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#e8eeef" }, `${scene.id} reflection item ${index + 1}`)}`, state);
    }).join("");
  }
  const columns = items.length > 3 ? 3 : items.length;
  const width = columns === 3 ? 440 : 500;
  const gap = 48;
  const total = columns * width + (columns - 1) * gap;
  const startX = (1920 - total) / 2;
  return items.map((item, index) => {
    const box = { x: startX + (index % columns) * (width + gap), y: 540 + Math.floor(index / columns) * 155, width, height: 104 };
    return element(`item-${index + 1}`, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="24" fill="#263a45" stroke="#6f8e9d" stroke-width="2"/>${centredTextBlock(elementText(scene, `item-${index + 1}`, state, item), insetBox(box, 28, 14), { fontSize: 27, weight: 620, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#e8eeef" }, `${scene.id} focus item ${index + 1}`)}`, state);
  }).join("");
}

function focusBalance(scene, state) {
  const items = scene.items ?? [];
  const positions = [
    { x: 260, y: 585, width: 430, height: 92 },
    { x: 310, y: 715, width: 430, height: 92 },
    { x: 1230, y: 485, width: 430, height: 92 },
    { x: 1180, y: 615, width: 430, height: 92 }
  ];
  const beam = `<path d="M 520 590 L 1390 500" fill="none" stroke="#8fb0c0" stroke-width="8" stroke-linecap="round"/><path d="M 920 570 L 1000 760 L 840 760 Z" fill="#263a45" stroke="#6f8e9d" stroke-width="3"/><path d="M 720 830 C 940 900 1190 850 1370 745" fill="none" stroke="#b76c4d" stroke-width="4" marker-end="url(#direction-arrow)"/><text x="1045" y="882" text-anchor="middle" font-size="25" font-weight="650" fill="#d18a69">LESS SEARCHING · MORE REASONING</text>`;
  const nodes = items.map((item, index) => {
    const box = positions[index];
    if (!box) return "";
    const id = `item-${index + 1}`;
    return element(id, `<rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="46" fill="#263a45" stroke="#6f8e9d" stroke-width="2"/>${centredTextBlock(elementText(scene, id, state, item), insetBox(box, 30, 12), { fontSize: 27, weight: 620, maxLines: 2, lineHeight: 1.12, align: "middle", fill: "#e8eeef" }, `${scene.id} balance item ${index + 1}`)}`, state);
  }).join("");
  return `${beam}${nodes}`;
}

function straightBoxConnector(connection, positions) {
  const from = positions.get(connection.from);
  const to = positions.get(connection.to);
  if (!from || !to) return "";
  const fromCentre = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
  const toCentre = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  const dx = toCentre.x - fromCentre.x;
  const dy = toCentre.y - fromCentre.y;
  const length = Math.hypot(dx, dy) || 1;
  const ux = dx / length;
  const uy = dy / length;
  const fromInset = rectangleRadius(ux, uy, from.width / 2, from.height / 2) + 3;
  const toInset = rectangleRadius(ux, uy, to.width / 2, to.height / 2) + 5;
  const x1 = fromCentre.x + ux * fromInset;
  const y1 = fromCentre.y + uy * fromInset;
  const x2 = toCentre.x - ux * toInset;
  const y2 = toCentre.y - uy * toInset;
  return `<line data-connection="${connection.from}-${connection.to}" x1="${roundCoordinate(x1)}" y1="${roundCoordinate(y1)}" x2="${roundCoordinate(x2)}" y2="${roundCoordinate(y2)}" stroke="#55798b" stroke-width="3" stroke-linecap="round" ${connection.directional === false ? "" : 'marker-end="url(#studio-arrow)"'}/>`;
}

function rectangleRadius(ux, uy, halfWidth, halfHeight) {
  const xScale = Math.abs(ux) < 0.0001 ? Infinity : halfWidth / Math.abs(ux);
  const yScale = Math.abs(uy) < 0.0001 ? Infinity : halfHeight / Math.abs(uy);
  return Math.min(xScale, yScale);
}

function curvedBoxConnector(connection, positions, connections) {
  const from = positions.get(connection.from);
  const to = positions.get(connection.to);
  if (!from || !to) return "";
  const siblings = connections
    .filter((candidate) => candidate.from === connection.from)
    .sort((left, right) => {
      const leftBox = positions.get(left.to);
      const rightBox = positions.get(right.to);
      return (leftBox?.x ?? 0) - (rightBox?.x ?? 0);
    });
  const siblingIndex = Math.max(0, siblings.findIndex((candidate) => candidate === connection));
  const sourceFraction = siblings.length <= 1 ? 0.5 : 0.18 + siblingIndex * (0.64 / (siblings.length - 1));
  const x1 = from.x + from.width * sourceFraction;
  const y1 = from.y + from.height + 2;
  const x2 = to.x + to.width / 2;
  const y2 = to.y - 3;
  const verticalDistance = Math.max(42, y2 - y1);
  if (verticalDistance > 130) {
    const routeY = y1 + 27;
    return `<path data-connection="${connection.from}-${connection.to}" d="M ${roundCoordinate(x1)} ${roundCoordinate(y1)} C ${roundCoordinate(x1)} ${roundCoordinate(y1 + 16)}, ${roundCoordinate(x1)} ${roundCoordinate(routeY)}, ${roundCoordinate(x2)} ${roundCoordinate(routeY)} C ${roundCoordinate(x2)} ${roundCoordinate(routeY)}, ${roundCoordinate(x2)} ${roundCoordinate(y2 - 34)}, ${roundCoordinate(x2)} ${roundCoordinate(y2)}" fill="none" stroke="#55798b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${connection.directional === false ? "" : 'marker-end="url(#studio-arrow)"'}/>`;
  }
  const firstControlY = y1 + Math.min(58, verticalDistance * 0.42);
  const secondControlY = y2 - Math.min(52, verticalDistance * 0.38);
  return `<path data-connection="${connection.from}-${connection.to}" d="M ${roundCoordinate(x1)} ${roundCoordinate(y1)} C ${roundCoordinate(x1)} ${roundCoordinate(firstControlY)}, ${roundCoordinate(x2)} ${roundCoordinate(secondControlY)}, ${roundCoordinate(x2)} ${roundCoordinate(y2)}" fill="none" stroke="#55798b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" ${connection.directional === false ? "" : 'marker-end="url(#studio-arrow)"'}/>`;
}

function companionIdleTransform(scene, state, grammar) {
  if (!scene.motion?.companionIdle) return "translate(0 0) scale(1)";
  const configured = typeof scene.motion.companionIdle === "object" ? scene.motion.companionIdle : {};
  const motion = { ...grammar.motion.companionIdle, ...configured };
  const phase = ((state?.frame ?? 0) % motion.periodFrames) / motion.periodFrames * Math.PI * 2;
  const y = Math.sin(phase) * motion.translateYPixels;
  const scale = 1 + Math.sin(phase) * motion.scaleAmplitude;
  const head = state?.performance?.head;
  const headX = (head?.x ?? 0) * (head?.amount ?? 0);
  const headY = (head?.y ?? 0) * (head?.amount ?? 0);
  const rotation = (head?.rotation ?? 0) * (head?.amount ?? 0);
  return `translate(${headX.toFixed(3)} ${(y + headY).toFixed(3)}) translate(300 980) scale(${scale.toFixed(6)}) translate(-300 -980) rotate(${rotation.toFixed(3)} 320 735)`;
}

function companionFigure(companionData, transform, state) {
  const visualData = state?.performance?.mouthData ?? companionData;
  return `<g transform="${transform}" filter="url(#companion-shadow)"><image href="${visualData}" x="18" y="145" width="590" height="835" preserveAspectRatio="xMidYMax meet"/>${companionFacialOverlay(state?.performance)}</g><ellipse cx="300" cy="955" rx="225" ry="24" fill="#05090b" opacity=".34"/>`;
}

function companionFacialOverlay(performance) {
  if (!performance) return "";
  const blink = performance.blink ?? 0;
  const eyelids = blink > 0.02
    ? `<g data-performance="blink" opacity="${Math.min(1, blink * 1.45).toFixed(3)}"><ellipse cx="292" cy="689" rx="9.5" ry="3.7" fill="#966a50"/><ellipse cx="333" cy="689" rx="9.5" ry="3.7" fill="#d8aa85"/><path d="M 283.5 689.8 Q 292 692.8 300.5 689.8" fill="none" stroke="#51372e" stroke-width="1.35" stroke-linecap="round"/><path d="M 324.5 689.8 Q 333 692.8 341.5 689.8" fill="none" stroke="#765344" stroke-width="1.35" stroke-linecap="round"/></g>`
    : "";
  return `<g aria-label="Companion facial performance">${eyelids}</g>`;
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
    const id = `item-${index + 1}`;
    const nextId = `item-${index + 2}`;
    const arrow = index < items.length - 1 && visible(id, state) && visible(nextId, state) ? `<line x1="${x + width + 10}" y1="${y + 66}" x2="${x + width + spacing.flowGap - 10}" y2="${y + 66}" stroke="${palette.blue}" stroke-width="3" marker-end="url(#direction-arrow)"/>` : "";
    const box = { x, y, width, height: 132 };
    const inner = insetBox(box, 18, spacing.boxBlock);
    return `${element(id, `<rect x="${x}" y="${y}" width="${width}" height="132" rx="12" fill="${index === items.length - 1 ? palette.paleBlue : palette.white}" stroke="${palette.line}"/>${centredTextBlock(elementText(scene, id, state, item), inner, { ...typography.roles.flowLabel, align: "middle", fill: palette.ink }, `${scene.id} flow item ${index + 1}`)}`, state)}${arrow}`;
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
  const hasAuthoredConnections = scene.timeline?.events?.some((event) => ["connect", "disconnect"].includes(event.action));
  const declaredConnections = hasAuthoredConnections
    ? [...(state?.connections?.values() ?? [])]
    : positions.map((node) => ({ from: node.id, to: "centre", directional: true }));
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
