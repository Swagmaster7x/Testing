/**
 * Fairy-Stockfish in the app (M15): the shogi engine, in its own worker (engines/fairy-stockfish/
 * host.js) started from the bot worker, spoken to in USI. It is a threaded build, so it runs only
 * when the page is cross-origin isolated (SharedArrayBuffer and shared WebAssembly memory). The
 * web server or the service worker provides the isolation; the Android WebView cannot (it has no
 * Cross-Origin-Opener-Policy and no SharedArrayBuffer), so in the APK the engine stays off.
 */
import type { EngineDialect, UciTransport } from '../uci';
import { USI } from '../uci';

export const FAIRY_HOST = 'fairy-stockfish/host.js';

/** One search thread, so a node budget gives the same move every time; a small hash for phones. */
export const FAIRY_USI: EngineDialect = { ...USI, setup: ['setoption name Threads value 1', 'setoption name USI_Hash value 16'] };

/** The smallest module using a fixed-width SIMD instruction: the engine build needs SIMD. */
const SIMD_PROBE = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 5, 1, 96, 0, 1, 123, 3, 2, 1, 0, 10, 10, 1, 8, 0, 65, 0, 253, 15, 253, 98, 11]);

/** Whether this page (or worker) can run the threaded engine: isolation, shared memory and SIMD. */
export function strongEngineAvailable(scope: { crossOriginIsolated?: boolean } = globalThis): boolean {
  if (scope.crossOriginIsolated !== true || typeof SharedArrayBuffer === 'undefined' || typeof WebAssembly !== 'object') return false;
  try {
    // Shared memory needs the threads feature; SIMD needs its own check.
    new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true });
    return WebAssembly.validate(SIMD_PROBE);
  } catch {
    return false;
  }
}

export function fairyStockfishWebTransport(assetsBase: string): UciTransport {
  const worker = new Worker(new URL(`engines/${FAIRY_HOST}`, assetsBase), { name: 'fairy-stockfish' });
  let listener: (line: string) => void = () => undefined;
  worker.onmessage = (event: MessageEvent<unknown>) => {
    if (typeof event.data !== 'string') return;
    for (const line of event.data.split('\n')) if (line) listener(line);
  };
  worker.onerror = (event) => listener(`error ${event.message || 'the engine worker failed'}`);
  return {
    send: (command) => worker.postMessage(command),
    listen: (onLine) => {
      listener = onLine;
    },
    terminate: () => worker.terminate(),
  };
}
