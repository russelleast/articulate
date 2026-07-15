import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { absoluteUrl, siteDescription, siteTitle } from "@/utils/site";

export const GET: APIRoute = async (context) => {
  const episodes = await getCollection("episodes", ({ data }) => data.status !== "draft");
  const siteUrl = absoluteUrl("/", context.site);

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: siteUrl,
    items: episodes
      .sort(
        (a, b) =>
          b.data.published.valueOf() - a.data.published.valueOf() ||
          b.data.sequence - a.data.sequence
      )
      .map((episode) => ({
        title: episode.data.title,
        description: episode.data.summary,
        pubDate: episode.data.published,
        link: absoluteUrl(`/episodes/${episode.id}/`, context.site)
      }))
  });
};
