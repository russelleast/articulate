import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://russelleast.github.io",
  base: "/articulate",
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: "github-light"
    }
  }
});
