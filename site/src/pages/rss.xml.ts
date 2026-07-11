import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { siteDescription, siteTitle, withBase } from "@/utils/site";

export const GET: APIRoute = async (context) => {
  const episodes = await getCollection("episodes");
  const siteUrl = new URL(withBase("/"), context.site ?? "https://russelleast.github.io").toString();

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: siteUrl,
    items: episodes
      .sort((a, b) => b.data.published.valueOf() - a.data.published.valueOf())
      .map((episode) => ({
        title: episode.data.title,
        description: episode.data.summary,
        pubDate: episode.data.published,
        link: `${siteUrl}episodes/${episode.id}/`
      }))
  });
};
