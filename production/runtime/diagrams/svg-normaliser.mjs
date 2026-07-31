export function normaliseSvgForPublication(svg, profile) {
  if (typeof svg !== "string" || !/<svg\b/i.test(svg)) {
    throw new Error("Diagram normalisation requires an SVG document");
  }

  const viewBox = readRootViewBox(svg);
  if (!viewBox || viewBox.width <= 0 || viewBox.height <= 0) {
    throw new Error("Diagram SVG requires a positive root viewBox for predictable composition");
  }

  const coloursMapped = mapPresentationColours(svg, profile.palette.sourceMappings);
  const output = updateRootAttributes(coloursMapped, {
    "data-articulate-diagram-profile": profile.id,
    "data-articulate-diagram-profile-version": profile.version,
    preserveAspectRatio: profile.output.preserveAspectRatio
  });
  assertPublicationSvg(output, profile);
  return output;
}

export function assertPublicationSvg(svg, profile) {
  const root = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  if (!root.includes(`data-articulate-diagram-profile="${profile.id}"`)) {
    throw new Error(`Diagram SVG does not declare the '${profile.id}' publication profile`);
  }
  if (!root.includes(`preserveAspectRatio="${profile.output.preserveAspectRatio}"`)) {
    throw new Error("Diagram SVG does not declare deterministic aspect-ratio composition");
  }
  return true;
}

function readRootViewBox(svg) {
  const root = svg.match(/<svg\b[^>]*>/i)?.[0] ?? "";
  const value = attribute(root, "viewBox");
  if (!value) return null;
  const numbers = value.trim().split(/[\s,]+/).map(Number);
  if (numbers.length !== 4 || numbers.some((number) => !Number.isFinite(number))) return null;
  return { x: numbers[0], y: numbers[1], width: numbers[2], height: numbers[3] };
}

function mapPresentationColours(svg, sourceMappings) {
  let maskDepth = 0;
  const stylesMapped = svg.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, (style) =>
    style.replace(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi, (value) => sourceMappings[normaliseColour(value)] ?? value)
  );
  return stylesMapped.replace(/<[^>]+>/g, (tag) => {
    if (/^<\/mask\b/i.test(tag)) {
      maskDepth = Math.max(0, maskDepth - 1);
      return tag;
    }
    const insideMask = maskDepth > 0;
    if (/^<mask\b/i.test(tag) && !/\/>$/.test(tag)) maskDepth += 1;
    if (insideMask) return tag;
    return tag.replace(
      /\b(fill|stroke|color|stop-color|flood-color)=(["'])(#[0-9a-f]{6}|#[0-9a-f]{3}|white|black)\2/gi,
      (match, name, quote, value) => {
        const replacement = sourceMappings[normaliseColour(value)];
        return replacement ? `${name}=${quote}${replacement}${quote}` : match;
      }
    );
  });
}

function normaliseColour(value) {
  const upper = value.toUpperCase();
  if (upper === "WHITE") return "#FFFFFF";
  if (upper === "BLACK") return "#000000";
  if (/^#[0-9A-F]{3}$/.test(upper)) {
    return `#${upper[1]}${upper[1]}${upper[2]}${upper[2]}${upper[3]}${upper[3]}`;
  }
  return upper;
}

function updateRootAttributes(svg, attributes) {
  return svg.replace(/<svg\b[^>]*>/i, (root) => {
    let updated = root;
    for (const [name, value] of Object.entries(attributes)) {
      const pattern = new RegExp(`\\s${name}=(["'])[^"']*\\1`, "i");
      if (pattern.test(updated)) updated = updated.replace(pattern, ` ${name}="${value}"`);
      else updated = updated.replace(/>$/, ` ${name}="${value}">`);
    }
    return updated;
  });
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}=(["'])(.*?)\\1`, "i"))?.[2];
}
