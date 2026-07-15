const EVENT_TYPES = new Set(["blink", "head", "gaze", "mouth"]);
const VISEMES = new Set(["rest", "closed", "open", "wide", "rounded", "teeth"]);

export function resolveCompanionPerformance(scene, document, frameRate) {
  if (!document) return null;
  if (document.version !== 1) throw new Error(`${scene.id} Companion performance uses unsupported version ${document.version}`);
  const events = (document.events ?? []).map((event, index) => {
    const id = event.id ?? `performance-${index + 1}`;
    if (!EVENT_TYPES.has(event.type)) throw new Error(`${scene.id} Companion performance ${id} has unsupported type '${event.type}'`);
    if (!Number.isFinite(event.at) || event.at < 0) throw new Error(`${scene.id} Companion performance ${id} requires a non-negative at`);
    if (!Number.isFinite(event.duration) || event.duration <= 0) throw new Error(`${scene.id} Companion performance ${id} requires a positive duration`);
    if (event.at + event.duration > scene.durationSeconds + 0.000001) throw new Error(`${scene.id} Companion performance ${id} ends outside the scene`);
    if (event.type === "mouth" && !VISEMES.has(event.value)) throw new Error(`${scene.id} Companion performance ${id} has unsupported viseme '${event.value}'`);
    return Object.freeze({ ...event, id, startFrame: Math.round(event.at * frameRate), endFrame: Math.round((event.at + event.duration) * frameRate) });
  }).sort((a, b) => a.startFrame - b.startFrame || a.id.localeCompare(b.id));
  return Object.freeze({ version: 1, seed: document.seed ?? 0, source: document.source ?? null, layers: Object.freeze([...(document.layers ?? [])]), events: Object.freeze(events), frameRate });
}

export function companionPerformanceStateAtFrame(timeline, frame) {
  if (!timeline) return null;
  const active = timeline.events.filter((event) => event.startFrame <= frame && frame < event.endFrame);
  const blink = active.findLast((event) => event.type === "blink");
  const head = active.findLast((event) => event.type === "head");
  const gaze = active.findLast((event) => event.type === "gaze");
  const mouth = active.findLast((event) => event.type === "mouth");
  return {
    blink: blink ? envelope(blink, frame) : 0,
    head: head ? { ...(head.value ?? {}), amount: envelope(head, frame) } : null,
    gaze: gaze?.value ?? "centre",
    mouth: mouth?.value ?? "rest"
  };
}

export function companionPerformanceManifest(timeline) {
  if (!timeline) return null;
  return { version: timeline.version, seed: timeline.seed, source: timeline.source, layers: timeline.layers, eventCount: timeline.events.length, events: timeline.events };
}

function envelope(event, frame) {
  const span = Math.max(1, event.endFrame - event.startFrame);
  const progress = Math.min(1, Math.max(0, (frame - event.startFrame) / span));
  return Math.sin(progress * Math.PI);
}
