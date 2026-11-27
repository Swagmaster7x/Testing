/** One bot worker for the whole app, started on first use. */
import { BotHost, createBotWorker } from '../ai/worker-host';

let host: BotHost | null = null;

export function botHost(): BotHost {
  host ??= new BotHost(createBotWorker, { minPauseMs: 500 });
  return host;
}
