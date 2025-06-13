import { defineConfig } from 'rollup';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import svelte from 'rollup-plugin-svelte';
import copy from 'rollup-plugin-copy';
import livereload from 'rollup-plugin-livereload';
import scss from 'rollup-plugin-scss';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import path from 'pathe';

const __dirname = import.meta.dirname;

export default defineConfig([
  {
    verbose: true,
    input: 'src/index.ts',
    output: {
      file: 'dist/index.js',
      format: 'iife',
    },
    plugins: [
      alias({
        entries: {
          '@utils/*': path.resolve(__dirname, 'src/utils', '*'),
        },
      }),
      typescript({ sourceMap: true, tsconfig: './tsconfig.json' }),
      svelte({ include: 'src/components/**/*.svelte', emitCss: true }),
      scss({ fileName: 'styles.css' }),
      resolve({
        browser: true,
        exportConditions: ['svelte'],
        extensions: '.svelte',
      }),
      terser(),
      copy({ targets: [{ src: 'public/index.html', dest: 'dist' }] }),
      serve({
        port: 8080,
        contentBase: ['dist'],
      }),
      livereload('dist'),
    ],
  },
]);
