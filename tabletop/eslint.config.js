// Lint rules for Kibitz. `npm run lint` fails on any warning.
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['.scratch/**', 'dist/**', 'android/**', 'node_modules/**', 'test-results/**', 'playwright-report/**', 'out/**', 'screenshots/**'],
  },
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat['recommended-latest']],
  },
  {
    // Ground rule: the app makes no network requests while running.
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'The app works offline and makes no network requests.' },
        { name: 'XMLHttpRequest', message: 'The app works offline and makes no network requests.' },
        { name: 'WebSocket', message: 'The app works offline and makes no network requests.' },
        { name: 'EventSource', message: 'The app works offline and makes no network requests.' },
      ],
    },
  },
  {
    // Game logic, search and the core stay pure: no interface, storage or shell code.
    files: ['src/core/**/*.ts', 'src/ai/**/*.ts', 'src/games/*/rules.ts', 'src/games/*/bots.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['react', 'react-dom', 'react/*'], message: 'Game logic must not depend on React.' },
            { group: ['dexie', 'zustand'], message: 'Game logic must not depend on storage or interface state.' },
            { group: ['**/shell/**', '**/store/**'], message: 'Game logic must not import the shell or the store.' },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    files: ['scripts/**/*.{js,mjs,ts}', '*.config.{js,ts}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['scripts/sw-template.js'],
    languageOptions: { globals: { ...globals.serviceworker, __ASSETS__: 'readonly' } },
  },
);
