/** Where the bot worker finds each game's bots. Each game's bots load only when first needed. */
import type { BotSet } from '../ai/bot';

const loaders: Record<string, () => Promise<BotSet<unknown, unknown>>> = {
  noughts: () => import('./noughts/bots').then((m) => m.noughtsBots as BotSet<unknown, unknown>),
};

export async function loadBots(gameId: string): Promise<BotSet<unknown, unknown>> {
  const load = loaders[gameId];
  if (!load) throw new Error(`No bots for "${gameId}"`);
  return load();
}
