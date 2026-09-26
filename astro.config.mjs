// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://searchbreaker.com',
  integrations: [
    react(),
    sitemap({
      // /internal/* is permanently noindex (see BaseLayout.astro).
      filter: (page) => !new URL(page).pathname.startsWith('/internal/'),
    }),
  ],
});
