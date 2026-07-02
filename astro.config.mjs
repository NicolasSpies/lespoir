// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// L'Espoir asbl · Astro SSR (server mode) on the ContentCore VPS.
// Each page renders per request and fetches live content from ContentCore.
// Deploy: pm2 + nginx reverse-proxy (see deploy/). NO SSG / FTP / webhook.
export default defineConfig({
  site: 'https://asbl-espoir.be',
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  trailingSlash: 'never',
  // Hashed JS/CSS bundles under /assets — nginx caches them immutable (deploy/nginx).
  build: { assets: 'assets' },
  compressHTML: true,
});
