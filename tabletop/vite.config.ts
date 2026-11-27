import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';
import brand from './brand.json' with { type: 'json' };
import pkg from './package.json' with { type: 'json' };
import { engines } from './scripts/vite-plugin-engines.ts';
import { precache } from './scripts/vite-plugin-precache.ts';

const here = (path: string) => fileURLToPath(new URL(path, import.meta.url));

// Cross-origin isolation (M15): the threaded Fairy-Stockfish build needs SharedArrayBuffer. The dev
// and preview servers send the headers; on any other host the service worker adds them.
const isolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Resource-Policy': 'same-origin',
};
const fairy = (file: string) => here(`./node_modules/fairy-stockfish-nnue.wasm/${file}`);

export default defineConfig({
  // Relative paths, so the same build runs from any folder, inside the APK and from a web host.
  base: './',
  plugins: [
    react(),
    engines([
      { name: 'stockfish-19-lite-single.js', source: here('./node_modules/stockfish/bin/stockfish-19-lite-single.js'), mime: 'text/javascript' },
      { name: 'stockfish-19-lite-single.wasm', source: here('./node_modules/stockfish/bin/stockfish-19-lite-single.wasm'), mime: 'application/wasm' },
      // Fairy-Stockfish for shogi (M15), kept under its own folder with the file names its loader expects.
      { name: 'fairy-stockfish/stockfish.js', source: fairy('stockfish.js'), mime: 'text/javascript' },
      { name: 'fairy-stockfish/stockfish.wasm', source: fairy('stockfish.wasm'), mime: 'application/wasm' },
      { name: 'fairy-stockfish/stockfish.worker.js', source: fairy('stockfish.worker.js'), mime: 'text/javascript' },
      { name: 'fairy-stockfish/host.js', source: here('./scripts/engines/fairy-stockfish-host.js'), mime: 'text/javascript' },
      // The Go review's small KataGo network, weights in 16-bit floats (M15, scripts/katago-net.ts).
      { name: 'katago/g170-b6c96-f16.bin', source: here('./assets/katago/g170-b6c96-f16.bin'), mime: 'application/octet-stream' },
    ], isolation),
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
  server: {
    headers: isolation,
  },
  preview: {
    port: 4173,
    strictPort: true,
    headers: isolation,
  },
  test: {
    projects: [
      { extends: true, test: { name: 'unit', include: ['tests/unit/**/*.test.ts'], environment: 'node' } },
      { extends: true, test: { name: 'property', include: ['tests/property/**/*.test.ts'], environment: 'node' } },
    ],
  },
});
