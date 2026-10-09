// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://albait.ro',
  trailingSlash: 'always',
  // Pages are prerendered to HTML at build time; only routes that opt out with
  // `export const prerender = false` (the lead form API, admin) run in the Worker.
  output: 'static',
  // Astro sessions are not used; avoids provisioning a KV namespace.
  session: false,
  adapter: cloudflare({
    // Optimise images with sharp at build time: no Images binding needed at runtime.
    imageService: 'compile',
  }),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !/\/(multumim|404)\/$/.test(page),
      i18n: { defaultLocale: 'ro', locales: { ro: 'ro-RO' } },
    }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  // Inline CSS: removes the only render-blocking request (≈13 KB compressed).
  build: { inlineStylesheets: 'always' },
  vite: { plugins: [tailwindcss()] },
});
