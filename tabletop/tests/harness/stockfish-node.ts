/**
 * Stockfish in Node, for ladders, tests and the end-to-end player. It loads the same lite
 * single-threaded build the app ships, so fixed node budgets give the same moves as in the app.
 * Commands and output are passed on asynchronously: the engine must never be called from inside
 * its own output callback.
 */
import { createRequire } from 'node:module';
import type { UciTransport } from '../../src/ai/uci';
import { UciEngine } from '../../src/ai/uci';

const require = createRequire(import.meta.url);

interface NodeStockfish {
  processCommand(command: string): void;
  terminate(): void;
}

export function stockfishNodeTransport(): UciTransport {
  let listener: (line: string) => void = () => undefined;
  const pending: string[] = [];
  let scheduled = false;
  const start = require('stockfish') as (flavour: string, onLine: (line: string) => void) => NodeStockfish;
  const engine = start('lite-single', (line) => {
    setImmediate(() => listener(line));
  });
  const flush = () => {
    scheduled = false;
    while (pending.length > 0) engine.processCommand(pending.shift() as string);
  };
  return {
    send(command) {
      pending.push(command);
      if (!scheduled) {
        scheduled = true;
        setImmediate(flush);
      }
    },
    listen(onLine) {
      listener = onLine;
    },
    terminate: () => engine.terminate(),
  };
}

export function nodeEngine(): UciEngine {
  return new UciEngine(stockfishNodeTransport());
}
