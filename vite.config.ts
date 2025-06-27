import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { inlineCriticalCssAndJs } from './src/critical-css-js-vite';
import path from 'pathe';
import 'dotenv/config';

export default defineConfig({
  plugins: [
    svelte(),
    inlineCriticalCssAndJs(
      path.join(process.cwd(), '/src/styles.critical.scss'),
      path.join(process.cwd(), '/src/critical.ts')
    ),
  ],
  define: {
    'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
  },
  resolve: {
    alias: {
      '@': path.resolve('./src/utils'),
      '#': path.resolve('./src/database'),
    },
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
  server: {
    proxy: {
      '/api': process.env.SERVER_URL!,
    },
  },
});
