// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';
import { unified } from '@astrojs/markdown-remark';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.doctorswhocode.blog',
  // Preserve historical article parsing and whitespace across the Astro 7 upgrade.
  compressHTML: true,
  markdown: { processor: unified(), shikiConfig: { theme: 'github-dark-high-contrast' } },
  integrations: [mdx(), sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
  },
});
