/** Answers one bot request. The worker calls this; tests and ladders can call it directly. */
import { createRng } from '../core/rng';
import { loadBots } from '../games/bots-index';
import type { BotReply, BotRequest } from './protocol';

export async function runBot(request: BotRequest): Promise<BotReply> {
  const started = Date.now();
  try {
    const bots = await loadBots(request.gameId, { assetsBase: request.assetsBase });
    const rng = createRng(request.seed);
    if (request.kind === 'advise') {
      if (!bots.advise) throw new Error(`${request.gameId} has no coach`);
      const advice = await bots.advise({ view: request.view, seat: request.seat, query: request.query, rng });
      return { id: request.id, ok: true, kind: 'advise', advice, ms: Date.now() - started };
    }
    const choice = await bots.choose({ view: request.view, seat: request.seat, level: request.level, rng });
    return {
      id: request.id,
      ok: true,
      kind: 'choose',
      action: bots.encode(choice.action),
      tags: [...choice.tags],
      nodes: choice.nodes,
      ms: Date.now() - started,
    };
  } catch (err) {
    return { id: request.id, ok: false, error: err instanceof Error ? err.message : String(err) };
  }
}
