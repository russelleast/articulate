import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import basePathImages from "./scripts/remark-base-path-images.mjs";

const base = "/articulate";

export default defineConfig({
  site: "https://russelleast.github.io",
  base,
  integrations: [sitemap()],
  markdown: {
    remarkPlugins: [[basePathImages, { base }]],
    shikiConfig: {
      theme: "github-light"
    }
  }
});
