/**
 * Stockfish in the app: its own worker, started from the bot worker. Only the lite
 * single-threaded build ships (PLAN.md 2.1); it needs no special server headers.
 */
import type { UciTransport } from '../uci';

export const STOCKFISH_FILE = 'stockfish-19-lite-single.js';

export function stockfishWebTransport(assetsBase: string): UciTransport {
  const worker = new Worker(new URL(`engines/${STOCKFISH_FILE}`, assetsBase));
  let listener: (line: string) => void = () => undefined;
  worker.onmessage = (event: MessageEvent<unknown>) => {
    if (typeof event.data !== 'string') return;
    for (const line of event.data.split('\n')) if (line) listener(line);
  };
  return {
    send: (command) => worker.postMessage(command),
    listen: (onLine) => {
      listener = onLine;
    },
    terminate: () => worker.terminate(),
  };
}
