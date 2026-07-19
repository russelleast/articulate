export function resolveSceneShots(scene, frameRate) {
  const declared = scene.shots ?? [];
  if (!Array.isArray(declared)) throw new Error(`${scene.id} shots must be an array`);
  if (declared.length === 0) return Object.freeze({ scene, shots: Object.freeze([]) });

  const ids = new Set();
  const shots = declared.map((shot, index) => {
    const id = shot.id ?? `shot-${index + 1}`;
    if (ids.has(id)) throw new Error(`${scene.id} has duplicate shot identifier '${id}'`);
    ids.add(id);
    if (!Number.isFinite(shot.at) || shot.at < 0 || shot.at >= scene.durationSeconds) {
      throw new Error(`${scene.id} shot ${id} requires an at within the scene duration`);
    }
    if (index > 0 && shot.at <= declared[index - 1].at) {
      throw new Error(`${scene.id} shot ${id} must start after the preceding shot`);
    }
    return { ...shot, id };
  });

  const eventIds = new Set((scene.timeline?.events ?? []).map((event) => event.id).filter(Boolean));
  const shotEvents = [];
  const resolvedShots = shots.map((shot, index) => {
    const end = shots[index + 1]?.at ?? scene.durationSeconds;
    const events = (shot.events ?? []).map((event, eventIndex) => {
      const localAt = event.at ?? 0;
      const id = event.id ?? `${shot.id}-event-${eventIndex + 1}`;
      if (!Number.isFinite(localAt) || localAt < 0) throw new Error(`${scene.id} shot ${shot.id} event ${id} requires a non-negative at`);
      const localEnd = event.end ?? (event.duration !== undefined ? localAt + event.duration : localAt);
      if (shot.at + localEnd > end + 0.000001) throw new Error(`${scene.id} shot ${shot.id} event ${id} extends beyond the shot`);
      if (eventIds.has(id)) throw new Error(`${scene.id} has duplicate timeline or shot event identifier '${id}'`);
      eventIds.add(id);
      const resolved = { ...event, id, at: shot.at + localAt, shotId: shot.id };
      if (event.end !== undefined) resolved.end = shot.at + event.end;
      shotEvents.push(resolved);
      return id;
    });
    return Object.freeze({
      id: shot.id,
      label: shot.label ?? shot.id,
      at: shot.at,
      end,
      startFrame: Math.round(shot.at * frameRate),
      endFrame: Math.round(end * frameRate),
      eventIds: Object.freeze(events)
    });
  });

  const timeline = { ...(scene.timeline ?? {}), events: [...(scene.timeline?.events ?? []), ...shotEvents] };
  return Object.freeze({ scene: { ...scene, timeline }, shots: Object.freeze(resolvedShots) });
}

export function shotsManifestEntry(shots) {
  return shots.map((shot) => ({ ...shot }));
}
