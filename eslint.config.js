import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  svelte.configs.recommended,
  {
    languageOptions: {
      globals: {
        document: globals.browser.document,
        window: globals.browser.window,
        console: globals.browser.console,
        location: globals.browser.location,
      },
    },
  },
  {
    files: ['**/*.svelte', '**/*.svelte.ts'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        extraFileExtensions: ['.svelte'],
        parser: tseslint.parser,
      },
    },
  },
  {
    rules: {
      // I understand what I am doing here, and the
      // only user generated content is controlled by me.
      'svelte/no-at-html-tags': 'off',
    },
  }
);
