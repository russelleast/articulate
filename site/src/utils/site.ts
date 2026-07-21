export const repositoryName = "articulate";
export const siteTitle = "Articulate";
export const siteDescription =
  "A production-oriented reference architecture for AI-native systems, documented as a living architectural narrative.";

export const productionOrigin = "https://russelleast.github.io";

export function absoluteUrl(path: string, site: URL | string | undefined = productionOrigin) {
  if (/^https?:\/\//i.test(path)) {
    return new URL(path).toString();
  }

  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const pathWithBase = normalized === basePath
    ? `${basePath}/`
    : normalized.startsWith(`${basePath}/`)
    ? normalized
    : `${basePath}${normalized}`;

  return new URL(pathWithBase, site).toString();
}

export function withBase(path: string) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export function youtubeEmbedUrl(value: string) {
  const url = new URL(value);
  const videoId = url.hostname === "youtu.be"
    ? url.pathname.slice(1)
    : url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1);

  if (!videoId) throw new Error(`YouTube URL has no video id: ${value}`);
  return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
}
