const siteImagePattern = /^\/(?:diagrams|media)\//;

export default function basePathImages({ base }) {
  const normalizedBase = `/${base}`.replace(/\/+$/u, "").replace(/^\/+/u, "/");

  return (tree) => visit(tree, (node) => {
    if (node.type !== "image" || !siteImagePattern.test(node.url)) return;
    if (node.url === normalizedBase || node.url.startsWith(`${normalizedBase}/`)) return;
    node.url = `${normalizedBase}${node.url}`;
  });
}

function visit(node, visitor) {
  visitor(node);
  for (const child of node.children ?? []) visit(child, visitor);
}
