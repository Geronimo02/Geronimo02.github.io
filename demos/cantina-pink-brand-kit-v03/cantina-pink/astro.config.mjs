// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const PRIVATE = ['/sistema', '/og-image', '/qr', '/admin'];

// [COMPLETAR] dominio definitivo; mientras tanto, el subdominio de Cloudflare Pages.
const SITE = process.env.SITE_URL ?? 'https://cantina-pink.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    preact(),
    sitemap({ filter: (page) => !PRIVATE.some((p) => new URL(page).pathname.startsWith(p)) }),
  ],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'auto' },
});
