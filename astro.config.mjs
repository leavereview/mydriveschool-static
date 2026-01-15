import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://mydriveschool.software',
  integrations: [
    tailwind()
  ],
  build: {
    inlineStylesheets: 'auto'
  }
});
