/**
 * The strong shogi engine (M15): Fairy-Stockfish behind the shared Engine interface, as an extra
 * CPU level and for game review. It is a threaded WebAssembly build, so it runs only when the
 * page is cross-origin isolated (see src/ai/engines/fairy-stockfish-web.ts); otherwise the level
 * is not offered and review keeps the built-in engine. Only the standard 9×9 board: mini-shogi
 * and every other variant stay with the built-in engine.
 *
 * Strength comes from a node budget with one search thread, so a position always gets the same
 * move, as with every other level.
 */
import type { BotLevel } from '../../ai/bot';
import type { Engine, EngineLine } from '../../ai/uci';
import type { Json } from '../../core/json';
import { toCanonical } from './notation';
import type { ShogiAction, ShogiState } from './rules';
import { canonicalAction, legalPairs, shogi } from './rules';

/** The extra level. Its rating is nominal, like the others (PROGRESS-M15.md has the ladder). */
export const STRONG_LEVEL: BotLevel = { level: 8, rating: 1900 };
/** Node budget for the strong level: about two seconds of one thread on a mid-range phone. */
export const STRONG_NODES = 150_000;
/**
 * Fairy-Stockfish's centipawns to the built-in engine's units. Measured on 37 positions from six
 * games searched by both engines at 60,000 nodes: a fit through the origin gives 1.02 (correlation
 * 0.75), so the two scales are taken as equal.
 */
export const STRONG_TO_ENGINE = 1;

export function strongPlays(state: ShogiState): boolean {
  return state.rules.board === 'standard';
}

/**
 * The position the engine searches: the current SFEN. The game's earlier positions are not sent, so
 * the engine does not see repetitions; the rules still settle them, and the coach sees them.
 */
function positionText(state: ShogiState): string {
  return state.sfen;
}

function actionFor(state: ShogiState, usi: string): ShogiAction | null {
  const canonical = toCanonical(usi);
  if (canonical === null) return null;
  const seat = shogi.turn(state);
  if (seat === null) return null;
  return shogi.legal(state, seat).find((a) => canonicalAction(a) === canonical) ?? null;
}

/** The strong engine's move, or null when it has none to offer (a lost position it resigns). */
export async function strongMove(engine: Engine, state: ShogiState, nodes = STRONG_NODES): Promise<ShogiAction | null> {
  const result = await engine.search({ fen: positionText(state), nodes });
  return actionFor(state, result.bestmove);
}

function lineJson(line: EngineLine): Json | null {
  const first = line.pv[0];
  const uci = first ? toCanonical(first) : null;
  if (!uci) return null;
  const mate = 'mate' in line.score ? line.score.mate : null;
  const cp = 'cp' in line.score ? line.score.cp : 0;
  const score = mate !== null ? (mate > 0 ? 100_000 - mate : -100_000 - mate) : Math.round(cp * STRONG_TO_ENGINE);
  return { uci, score, mate, pv: line.pv.slice(0, 8).flatMap((m) => toCanonical(m) ?? []) };
}

/** The shogi coach's "analyse" answer, from the strong engine: the best lines, side to move's view. */
export async function strongAnalyse(engine: Engine, state: ShogiState, nodes: number, multiPv: number): Promise<Json> {
  const { moves } = legalPairs(state);
  const result = await engine.search({ fen: positionText(state), nodes, multiPv: Math.min(multiPv, Math.max(1, moves.length)) });
  const lines = result.lines.flatMap((l) => lineJson(l) ?? []);
  const best = toCanonical(result.bestmove) ?? (lines[0] as { uci: string } | undefined)?.uci ?? null;
  return { best, lines, engine: 'strong' };
}
