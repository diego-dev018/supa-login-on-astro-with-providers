// @ts-check
import { defineConfig } from 'astro/config';
import vercelAdapter from '@astrojs/vercel';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercelAdapter(),
  integrations: [tailwind()]
});