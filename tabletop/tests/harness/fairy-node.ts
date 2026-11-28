/**
 * Fairy-Stockfish in Node (M15), for tests, ladders and calibration. It loads the same threaded
 * build the app ships; Node's worker threads share memory without any isolation headers. Output
 * is passed on asynchronously, so the engine is never called from inside its own callback.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { FAIRY_USI } from '../../src/ai/engines/fairy-stockfish-web';
import type { UciTransport } from '../../src/ai/uci';
import { UciEngine } from '../../src/ai/uci';

const require = createRequire(import.meta.url);

interface FairyModule {
  postMessage(command: string): void;
  addMessageListener(onLine: (line: string) => void): void;
  terminate(): void;
}

type FairyFactory = (options: { wasmBinary: Uint8Array }) => Promise<FairyModule>;

export function fairyNodeTransport(): UciTransport {
  let listener: (line: string) => void = () => undefined;
  const script = require.resolve('fairy-stockfish-nnue.wasm/stockfish.js');
  const factory = require(script) as FairyFactory;
  const wasmBinary = readFileSync(script.replace(/stockfish\.js$/, 'stockfish.wasm'));
  const engine = factory({ wasmBinary });
  const pending: string[] = [];
  let started: FairyModule | null = null;
  void engine.then((sf) => {
    started = sf;
    sf.addMessageListener((line) => setImmediate(() => listener(line)));
    for (const command of pending.splice(0)) sf.postMessage(command);
  });
  return {
    send(command) {
      if (started) {
        const sf = started;
        setImmediate(() => sf.postMessage(command));
      } else pending.push(command);
    },
    listen(onLine) {
      listener = onLine;
    },
    terminate() {
      // Never "quit": the engine's runtime would end the whole Node process. This stops its threads.
      void engine.then((sf) => sf.terminate());
    },
  };
}

export function fairyNodeEngine(): UciEngine {
  return new UciEngine(fairyNodeTransport(), FAIRY_USI);
}
