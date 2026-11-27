import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import brand from './brand.json' with { type: 'json' };
import pkg from './package.json' with { type: 'json' };
import { engines } from './scripts/vite-plugin-engines.ts';
import { precache } from './scripts/vite-plugin-precache.ts';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  // Relative paths, so the same build runs from any folder, inside the APK and from a web host.
  base: './',
  plugins: [
    react(),
    engines([
      { name: 'stockfish-19-lite-single.js', source: here('./node_modules/stockfish/bin/stockfish-19-lite-single.js'), mime: 'text/javascript' },
      { name: 'stockfish-19-lite-single.wasm', source: here('./node_modules/stockfish/bin/stockfish-19-lite-single.wasm'), mime: 'application/wasm' },
    ]),
    precache({
      name: brand.name,
      description: brand.description,
      background: '#15120e',
      theme: '#15120e',
      publicDir: here('./public'),
      templatePath: here('./scripts/sw-template.js'),
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@fonts': here('./node_modules/@fontsource-variable'),
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    assetsInlineLimit: 0,
    // Everything is precached for offline use. The largest chunk is the Lichess puzzle set
    // (about 800 kB), which loads only when Practice opens.
    chunkSizeWarningLimit: 900,
  },
  worker: {
    format: 'es',
  },
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['tests/unit/**/*.test.ts'], environment: 'node' } },
      { extends: true, test: { name: 'property', include: ['tests/property/**/*.test.ts'], environment: 'node' } },
    ],
  },
});
