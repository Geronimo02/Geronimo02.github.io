// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// [COMPLETAR] dominio definitivo; mientras tanto, el subdominio de Cloudflare Pages.
const SITE = process.env.SITE_URL ?? 'https://cantina-pink.pages.dev';

export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [preact()],
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  image: { responsiveStyles: true },
  build: { inlineStylesheets: 'auto' },
});
