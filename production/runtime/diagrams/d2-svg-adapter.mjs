export function removeD2PageBackground(svg) {
  if (typeof svg !== "string") return svg;
  return svg.replace(
    /(<svg\b[^>]*class=(["'])[^"']*\bd2-svg\b[^"']*\2[^>]*>\s*)<rect\b[^>]*\/?>/i,
    (match, opening) => opening
  );
}

export function hasD2PageBackground(svg) {
  return /<svg\b[^>]*class=(["'])[^"']*\bd2-svg\b[^"']*\1[^>]*>\s*<rect\b/i.test(svg);
}
