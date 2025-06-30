import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { inlineCriticalCssAndJs } from './src/critical-css-js-vite';
import path from 'pathe';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import 'dotenv/config';

export default defineConfig({
  plugins: [
    svelte(),
    inlineCriticalCssAndJs(
      path.join(process.cwd(), '/src/styles.critical.scss'),
      path.join(process.cwd(), '/src/critical.ts')
    ),
    sentryVitePlugin({
      org: 'tanner-arnold',
      project: 'website',
    }),
  ],
  define: {
    'process.env.SERVER_URL': JSON.stringify(process.env.SERVER_URL),
    'process.env.SENTRY_DSN': JSON.stringify(process.env.SENTRY_DSN),
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
    sourcemap: true,
  },
  server: {
    proxy: {
      '/api': process.env.SERVER_URL!,
    },
  },
});
