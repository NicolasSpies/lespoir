// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// L'Espoir asbl · static-site generator config
// Outputs to dist/ · uploads to Hostinger root
export default defineConfig({
  site: 'https://asbl-espoir.be',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    format: 'file', // produces /page.html instead of /page/index.html · matches current setup
    inlineStylesheets: 'auto',
  },
  integrations: [
    sitemap({
      filter: (page) =>
        // Exclude utility pages from sitemap
        !page.includes('/404'),
      changefreq: 'monthly',
      priority: 0.7,
    }),
  ],
  compressHTML: true,
});
