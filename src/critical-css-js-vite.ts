import type { Plugin } from 'vite';
import fs from 'fs/promises';
import CleanCSS from 'clean-css';
import esbuild from 'esbuild';
import { compileStringAsync } from 'sass';

const minifyCss = async (file: string): Promise<string> => {
  const minifier = new CleanCSS({});
  const scssContent = await fs.readFile(file, 'utf8');
  const cssContent = await compileStringAsync(scssContent, {
    loadPaths: ['./src'],
  });
  const minified = minifier.minify(cssContent.css);
  if (minified.errors.length)
    console.error('Failed to minify: ' + minified.errors.join(', '));
  if (minified.warnings.length)
    console.warn('Warning during minify: ' + minified.warnings.join(', '));
  return minified.styles;
};

const minifyJs = async (file: string): Promise<string> => {
  const tsContent = await fs.readFile(file, 'utf8');
  const jsContent = await esbuild.build({
    bundle: true,
    alias: { '@': './src/utils' },
    stdin: { contents: tsContent, loader: 'ts' },
    minify: true,
    write: false,
  });
  return jsContent.outputFiles[0].text;
};

const inlineCriticalCss = (html: string, criticalCss: string): string => {
  return html.replace('</head>', `<style>${criticalCss}</style></head>`);
};

const inlineCriticalJs = (html: string, criticalJs: string): string => {
  return html.replace('</head>', `<script>${criticalJs}</script></head>`);
};

const deferNonCriticalCss = (html: string): string => {
  const regex = /\n.*<link rel="stylesheet" crossorigin href=".*">/;
  const nonCriticalCss = html.match(regex);
  if (!nonCriticalCss) return html;

  const nonCriticalCssDeferred = nonCriticalCss[0].replace(
    'rel="stylesheet"',
    'rel="preload" as="style" onload="this.onload=null;this.rel=\'stylesheet\'"'
  );

  return html.replace(
    regex,
    nonCriticalCssDeferred + `<noscript>${nonCriticalCss}</noscript>`
  );
};

const deferNonCriticalJs = (html: string): string => {
  const regex = /.*<script type="module" crossorigin src=".*"/;
  const nonCriticalJs = html.match(regex);
  if (!nonCriticalJs) return html;
  return html.replace(regex, nonCriticalJs + ' defer');
};

const inlineCriticalCssAndJs: (
  criticalCssDirectory: string,
  criticalJsDirectory: string
) => Plugin = (criticalCssFile, criticalJsFile) => {
  return {
    name: 'inline-critical-css-and-js',
    async transformIndexHtml(html) {
      return inlineCriticalCss(
        deferNonCriticalCss(
          inlineCriticalJs(
            deferNonCriticalJs(html),
            await minifyJs(criticalJsFile)
          )
        ),
        await minifyCss(criticalCssFile)
      );
    },
  };
};

export { inlineCriticalCssAndJs };
