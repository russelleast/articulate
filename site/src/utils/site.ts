export const repositoryName = "articulate";
export const siteTitle = "Articulate";
export const siteDescription =
  "A production-oriented reference architecture for AI-native systems, documented as a living architectural narrative.";

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
