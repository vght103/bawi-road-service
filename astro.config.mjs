import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://bawiroad.com",
  integrations: [
    react(),
    sitemap(),
  ],
  adapter: cloudflare(),
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    optimizeDeps: {
      exclude: ["astro:transitions"],
    },
  },
  output: "static",
});
