import { defineConfig } from 'rollup';
import nodeResolve from '@rollup/plugin-node-resolve';
import alias from '@rollup/plugin-alias';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { resolve } from 'pathe';
import json from '@rollup/plugin-json';
import { sentryRollupPlugin } from '@sentry/rollup-plugin';

export default defineConfig({
  input: 'src/server.ts',
  output: {
    file: 'dist/server.js',
    format: 'module',
    sourcemap: true,
  },
  external: [
    'better-sqlite3',
    'chokidar',
    'dotenv',
    'dotenv/config',
    'drizzle-orm',
    'drizzle-orm/better-sqlite3',
    'drizzle-orm/better-sqlite3/migrator',
    'drizzle-orm/sqlite-core',
    'express',
    'gray-matter',
    'pathe',
  ],
  plugins: [
    alias({
      entries: {
        '@': resolve('./src/utils'),
        '#': resolve('./src/database'),
      },
    }),
    typescript(),
    commonjs(),
    nodeResolve(),
    json(),
    sentryRollupPlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'tanner-arnold',
      project: 'website',
    }),
  ],
});
