const ACTIONS = new Set([
  "reveal", "hide", "emphasize", "deemphasize", "connect", "disconnect",
  "replace", "transition", "type"
]);

const TARGET_ACTIONS = new Set(["reveal", "hide", "emphasize", "deemphasize", "replace", "type"]);

export function sceneElementIds(scene) {
  const ids = ["headline", "support", ...(scene.items ?? []).map((_, index) => `item-${index + 1}`)];
  if (scene.presentation?.composition?.startsWith("radial-")) ids.push("centre");
  if (scene.presentation?.composition === "repository") {
    ids.push("repository-window", ...(scene.evidence?.excerpt ?? []).map((_, index) => `evidence-${index + 1}`));
  }
  if (["companion", "studio"].includes(scene.presentation?.composition)) ids.push("companion");
  return ids;
}

export function resolveSceneTimeline(scene, frameRate, grammar) {
  const declared = scene.timeline?.events ?? [];
  const errors = [];
  const warnings = [];
  const elements = sceneElementIds(scene);
  const elementSet = new Set(elements);
  const ids = new Set();
  const resolved = [];

  for (const [index, event] of declared.entries()) {
    const eventId = event.id ?? `event-${index + 1}`;
    const label = `${scene.id} timeline ${eventId}`;
    if (ids.has(eventId)) errors.push(issue(scene, eventId, event, "duplicate event identifier"));
    ids.add(eventId);
    if (!ACTIONS.has(event.action)) errors.push(issue(scene, eventId, event, `unsupported action '${event.action}'`));
    if (!Number.isFinite(event.at) || event.at < 0) errors.push(issue(scene, eventId, event, "at must be a non-negative number"));
    if (event.duration !== undefined && (!Number.isFinite(event.duration) || event.duration < 0)) errors.push(issue(scene, eventId, event, "duration must be a non-negative number"));
    if (event.end !== undefined && (!Number.isFinite(event.end) || event.end < event.at)) errors.push(issue(scene, eventId, event, "end must be at or after at"));
    if (event.duration !== undefined && event.end !== undefined) errors.push(issue(scene, eventId, event, "use duration or end, not both"));
    if (TARGET_ACTIONS.has(event.action) && !elementSet.has(event.target)) errors.push(issue(scene, eventId, event, `unknown target '${event.target}'`));
    if (event.action === "replace" && !elementSet.has(event.with)) errors.push(issue(scene, eventId, event, `unknown replacement '${event.with}'`));
    if (["connect", "disconnect"].includes(event.action)) {
      if (!elementSet.has(event.from)) errors.push(issue(scene, eventId, event, `unknown connection source '${event.from}'`));
      if (!elementSet.has(event.to)) errors.push(issue(scene, eventId, event, `unknown connection destination '${event.to}'`));
      if (event.from === event.to) errors.push(issue(scene, eventId, event, "connection endpoints must differ"));
      if (event.directional !== false && grammar.motion.directionalConnector.arrowhead !== true) {
        errors.push(issue(scene, eventId, event, "directional connection has no grammar-approved arrowhead"));
      }
    }
    if (event.action === "type" && scene.presentation?.archetype !== "Repository" && !scene.timeline?.allowTyping) {
      errors.push(issue(scene, eventId, event, "type is restricted to Repository scenes unless allowTyping is explicitly approved"));
    }
    const startFrame = Number.isFinite(event.at) ? Math.round(event.at * frameRate) : 0;
    const endSeconds = event.end ?? (event.duration !== undefined ? event.at + event.duration : event.at);
    const endFrame = Math.round(endSeconds * frameRate);
    if (event.at > scene.durationSeconds || endSeconds > scene.durationSeconds) {
      errors.push(issue(scene, eventId, event, `event ends outside scene duration ${scene.durationSeconds.toFixed(3)}s`));
    }
    resolved.push(Object.freeze({
      ...event,
      id: eventId,
      startFrame,
      endFrame,
      startSeconds: startFrame / frameRate,
      endSeconds: endFrame / frameRate,
      treatment: treatmentFor(event, grammar)
    }));
  }

  const firstByTarget = new Map();
  for (const event of resolved) {
    if (event.target && !firstByTarget.has(event.target)) firstByTarget.set(event.target, event);
  }
  const initiallyHidden = new Set(scene.timeline?.initiallyHidden ?? []);
  for (const target of initiallyHidden) {
    if (!elementSet.has(target)) errors.push(issue(scene, "initial-state", { at: 0, target }, `unknown initially hidden target '${target}'`));
  }
  for (const [target, event] of firstByTarget) {
    if (["reveal", "type"].includes(event.action)) initiallyHidden.add(target);
  }
  for (const event of resolved) {
    if (event.action === "replace" && !firstByTarget.has(event.with)) initiallyHidden.add(event.with);
  }

  validateSequence(scene, resolved, initiallyHidden, errors);
  if (errors.length) throw new Error(`Scene timeline validation failed:\n- ${errors.map(formatIssue).join("\n- ")}`);
  return Object.freeze({
    declared: declared.map((event) => ({ ...event })),
    events: Object.freeze(resolved.sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id))),
    initiallyHidden: Object.freeze([...initiallyHidden]),
    elements: Object.freeze(elements),
    warnings: Object.freeze(warnings),
    frameRate
  });
}

export function timelineStateAtFrame(scene, timeline, frame) {
  const hidden = new Set(timeline.initiallyHidden);
  const emphasized = new Set();
  const connections = new Map();
  const text = new Map();
  let transition = null;
  for (const event of timeline.events) {
    if (event.startFrame > frame) break;
    switch (event.action) {
      case "reveal": hidden.delete(event.target); break;
      case "hide": hidden.add(event.target); break;
      case "emphasize":
        if (event.endFrame > event.startFrame && frame >= event.endFrame) emphasized.delete(event.target);
        else emphasized.add(event.target);
        break;
      case "deemphasize": emphasized.delete(event.target); break;
      case "connect": connections.set(connectionId(event), event); break;
      case "disconnect": connections.delete(connectionId(event)); break;
      case "replace": hidden.add(event.target); hidden.delete(event.with); break;
      case "transition": transition = event.transition ?? event.target ?? "cut"; break;
      case "type": {
        hidden.delete(event.target);
        const source = textForTarget(scene, event.target);
        const span = Math.max(1, event.endFrame - event.startFrame);
        const progress = Math.min(1, Math.max(0, (frame - event.startFrame + 1) / span));
        text.set(event.target, source.slice(0, Math.ceil(source.length * progress)));
        break;
      }
    }
  }
  return { hidden, emphasized, connections, text, transition, frame };
}

export function timelineChangeFrames(timeline, sceneFrameCount) {
  const frames = new Set([0, sceneFrameCount]);
  for (const event of timeline.events) {
    frames.add(Math.min(sceneFrameCount, event.startFrame));
    if (event.endFrame > event.startFrame) frames.add(Math.min(sceneFrameCount, event.endFrame));
    if (event.action === "type") {
      for (let frame = event.startFrame; frame < Math.min(sceneFrameCount, event.endFrame); frame++) frames.add(frame);
    }
  }
  return [...frames].sort((a, b) => a - b);
}

export function timelineManifestEntry(timeline) {
  return {
    declaredEvents: timeline.declared,
    resolvedEvents: timeline.events.map((event) => ({
      id: event.id,
      action: event.action,
      target: event.target ?? null,
      from: event.from ?? null,
      to: event.to ?? null,
      startFrame: event.startFrame,
      endFrame: event.endFrame,
      startSeconds: event.startSeconds,
      endSeconds: event.endSeconds,
      treatment: event.treatment
    })),
    warnings: timeline.warnings
  };
}

export function connectionId(event) {
  return event.target ?? `connection-${event.from}-${event.to}`;
}

function validateSequence(scene, events, initiallyHidden, errors) {
  const visible = new Set(sceneElementIds(scene).filter((id) => !initiallyHidden.has(id)));
  const connections = new Set();
  for (const event of events.sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id))) {
    if (["emphasize", "deemphasize"].includes(event.action) && !visible.has(event.target)) {
      errors.push(issue(scene, event.id, event, "hidden element is referenced before reveal"));
    }
    if (event.action === "reveal" || event.action === "type") visible.add(event.target);
    if (event.action === "hide") visible.delete(event.target);
    if (event.action === "replace") { visible.delete(event.target); visible.add(event.with); }
    if (event.action === "connect") {
      if (!visible.has(event.from) || !visible.has(event.to)) errors.push(issue(scene, event.id, event, "connection endpoint is hidden before reveal"));
      const id = connectionId(event);
      if (connections.has(id)) errors.push(issue(scene, event.id, event, `connection '${id}' already exists`));
      connections.add(id);
    }
    if (event.action === "disconnect" && !connections.delete(connectionId(event))) {
      errors.push(issue(scene, event.id, event, `connection '${connectionId(event)}' does not exist`));
    }
  }
  for (let index = 0; index < events.length; index++) {
    for (let candidate = index + 1; candidate < events.length; candidate++) {
      const previous = events[index];
      const current = events[candidate];
      if (!previous.target || previous.target !== current.target || previous.action === current.action) continue;
      const previousEnd = Math.max(previous.startFrame, previous.endFrame);
      const currentEnd = Math.max(current.startFrame, current.endFrame);
      const simultaneous = previous.startFrame === current.startFrame;
      const overlapping = previousEnd > previous.startFrame && currentEnd > current.startFrame
        && previous.startFrame < currentEnd && current.startFrame < previousEnd;
      if (simultaneous || overlapping) {
        errors.push(issue(scene, current.id, current, `overlapping incompatible actions on '${current.target}'`));
      }
    }
  }
}

function treatmentFor(event, grammar) {
  if (event.action === "connect" || event.action === "disconnect") return grammar.motion.directionalConnector.id;
  return grammar.motion.actions[event.action]?.id ?? grammar.motion.actions.transition.id;
}

function textForTarget(scene, target) {
  if (target === "headline") return scene.headline ?? "";
  if (target === "support") return scene.support ?? "";
  if (target.startsWith("item-")) return scene.items?.[Number(target.slice(5)) - 1] ?? "";
  if (target.startsWith("evidence-")) return scene.evidence?.excerpt?.[Number(target.slice(9)) - 1] ?? "";
  return "";
}

function issue(scene, eventId, event, reason) {
  return { episode: scene.episodeId ?? "unknown", scene: scene.id, event: eventId, time: event.at ?? 0, target: event.target ?? event.to ?? "n/a", reason };
}

function formatIssue(value) {
  return `episode=${value.episode} scene=${value.scene} event=${value.event} at=${value.time}s target=${value.target}: ${value.reason}`;
}
