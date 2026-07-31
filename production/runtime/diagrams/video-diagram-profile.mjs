import fs from "node:fs";
import { hasD2PageBackground, removeD2PageBackground } from "./d2-svg-adapter.mjs";
import { assertPublicationSvg, normaliseSvgForPublication } from "./svg-normaliser.mjs";

export const VIDEO_DIAGRAM_PROFILE_ID = "video-dark";

const sourceMappings = Object.freeze({
  "#FFFFFF": "#14242C",
  "#FFFDFA": "#E8EEEF",
  "#F7F8FE": "#1A2C35",
  "#F7F4ED": "#1D313A",
  "#F3E3DE": "#3B2525",
  "#F2E8D8": "#382A22",
  "#EEF1F8": "#20343E",
  "#EDE7F2": "#30273A",
  "#EDF0FD": "#1B303A",
  "#EAD8CD": "#3A281F",
  "#E8EDF2": "#203742",
  "#E3E9FD": "#243B47",
  "#DEE1EB": "#314650",
  "#DCEBE7": "#173A38",
  "#DCE7EB": "#203742",
  "#CFD2DD": "#557180",
  "#0A0F25": "#E8EEEF",
  "#17232D": "#E8EEEF",
  "#172028": "#E8EEEF",
  "#103D39": "#D8EEE8",
  "#30243A": "#E7DCEE",
  "#374550": "#CFDDE2",
  "#49321E": "#F0D7C4",
  "#512922": "#F1D1CA",
  "#492C1E": "#F0D7C4",
  "#676C7E": "#9BB7C4",
  "#9499AB": "#AFC3CB",
  "#0D32B2": "#6F93A4",
  "#263746": "#6F8E9D",
  "#49677C": "#6F93A4",
  "#687681": "#7895A2",
  "#176B62": "#69A99E",
  "#665278": "#9C83AD",
  "#8A6235": "#B98A5D",
  "#85543B": "#C07B59",
  "#984E43": "#C6786C",
  "#4A6FF3": "#8DB2C2"
});

export const VIDEO_DARK_DIAGRAM_PROFILE = deepFreeze({
  id: VIDEO_DIAGRAM_PROFILE_ID,
  version: 1,
  publication: "video",
  input: {
    mediaType: "image/svg+xml",
    rendererNeutral: true
  },
  output: {
    mediaType: "image/svg+xml",
    outerBackground: "transparent",
    preserveAspectRatio: "xMidYMid meet",
    deterministic: true
  },
  composition: {
    inlinePadding: 56,
    headlineOffset: 160,
    bottomPadding: 52,
    minimumRenderedTextPixelsAt1080p: 18
  },
  palette: {
    surface: "#14242C",
    node: "#1D313A",
    text: "#E8EEEF",
    mutedText: "#9BB7C4",
    connector: "#6F93A4",
    emphasis: "#69A99E",
    warning: "#C07B59",
    sourceMappings
  }
});

export function normaliseDiagramSvg(svg, { profile = VIDEO_DARK_DIAGRAM_PROFILE } = {}) {
  if (profile.id !== VIDEO_DIAGRAM_PROFILE_ID) {
    throw new Error(`Unsupported diagram publication profile: ${profile.id}`);
  }
  const rendererAdaptedSvg = removeD2PageBackground(svg);
  const output = normaliseSvgForPublication(rendererAdaptedSvg, profile);
  assertNormalisedDiagramSvg(output, { profile });
  return output;
}

export function diagramVideoDataUri(filePath, options = {}) {
  const svg = normaliseDiagramSvg(fs.readFileSync(filePath, "utf8"), options);
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export function diagramViewport(bounds, { profile = VIDEO_DARK_DIAGRAM_PROFILE } = {}) {
  const { inlinePadding, headlineOffset, bottomPadding } = profile.composition;
  return Object.freeze({
    x: bounds.x + inlinePadding,
    y: bounds.y + headlineOffset,
    width: bounds.width - inlinePadding * 2,
    height: bounds.height - headlineOffset - bottomPadding
  });
}

export function assertNormalisedDiagramSvg(svg, { profile = VIDEO_DARK_DIAGRAM_PROFILE } = {}) {
  assertPublicationSvg(svg, profile);
  if (hasD2PageBackground(svg)) {
    throw new Error("Diagram SVG retains an opaque D2 page background");
  }
  return true;
}

function deepFreeze(value) {
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") deepFreeze(child);
  }
  return Object.freeze(value);
}
