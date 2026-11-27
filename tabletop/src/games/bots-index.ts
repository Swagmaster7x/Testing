/** Where the bot worker finds each game's bots. Each game's bots load only when first needed. */
import type { BotSet } from '../ai/bot';

export interface BotContext {
  /** Base URL of the app's files, for engines that load their own (engines/...). */
  readonly assetsBase: string;
}

type Loader = (context: BotContext) => Promise<BotSet<unknown, unknown>>;

const loaders: Record<string, Loader> = {
  noughts: () => import('./noughts/bots').then((m) => m.noughtsBots as BotSet<unknown, unknown>),
  brisca: () => import('./brisca/bots').then((m) => m.briscaBots as unknown as BotSet<unknown, unknown>),
  dominoes: () => import('./dominoes/bots').then((m) => m.dominoesBots as unknown as BotSet<unknown, unknown>),
  go: () => import('./go/bots').then((m) => m.goBots as BotSet<unknown, unknown>),
  chess: (context) =>
    Promise.all([import('./chess/bots'), import('../ai/uci'), import('../ai/engines/stockfish-web')]).then(
      ([bots, uci, web]) => bots.chessBots(() => new uci.UciEngine(web.stockfishWebTransport(context.assetsBase))) as BotSet<unknown, unknown>,
    ),
  shogi: () => import('./shogi/bots').then((m) => m.shogiBots as BotSet<unknown, unknown>),
  'chinese-checkers': () => import('./chinese-checkers/bots').then((m) => m.ccBots as unknown as BotSet<unknown, unknown>),
};

const cache = new Map<string, Promise<BotSet<unknown, unknown>>>();

export function loadBots(gameId: string, context: BotContext): Promise<BotSet<unknown, unknown>> {
  const load = loaders[gameId];
  if (!load) return Promise.reject(new Error(`No bots for "${gameId}"`));
  let pending = cache.get(gameId);
  if (!pending) {
    pending = load(context);
    cache.set(gameId, pending);
  }
  return pending;
}
