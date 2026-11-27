/**
 * Game review for the classic card games (PLAN.md 2.7): each of your decisions is rated "with what
 * you knew" by asking the coach to value every legal move in that position (it samples the cards
 * you could not see and plays each move out), and the loss is how much worse your move did than the
 * best, in the game's own points. The biggest losses are the key moments, each with a reason.
 */
import type { GameDef, GameEvent } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import type { AskCoach } from '../types';

export interface Scored {
  readonly action: string;
  readonly value: number;
}

export function readMoves(answer: Json): Scored[] {
  if (!isJsonObject(answer) || !Array.isArray(answer.moves)) return [];
  return answer.moves.flatMap((m) => (isJsonObject(m) && typeof m.action === 'string' && typeof m.value === 'number' ? [{ action: m.action, value: m.value }] : []));
}

export interface ReviewSpec<S, A> {
  readonly def: GameDef<S, A, unknown, unknown, GameEvent>;
  /** Only these decisions are rated (card plays, not passes or bids, for instance). */
  readonly rated: (before: S, action: A) => boolean;
  /** The coach's question for one position. */
  readonly query: Json;
  /** Points lost are multiplied by this to reach the shared verdict scale (5, 10, 15). */
  readonly scale: number;
  /** Moves within this much (in points) of the best also count as right on a practice card. */
  readonly alsoRight: number;
  readonly label: (before: S, action: A, index: number) => string;
  readonly name: (action: string) => string;
  readonly reason: (before: S, played: A, best: string, loss: number) => Reason;
}

export async function analyseRecord<S, A>(spec: ReviewSpec<S, A>, record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const def = spec.def;
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(def, record);
  const { steps } = replay(def, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s, i }) => humans.includes(s.seat) && spec.rated(i === 0 ? start : (steps[i - 1]?.state ?? start), s.action));
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before = i === 0 ? start : (steps[i - 1]?.state ?? start);
    const legal = def.legal(before, s.seat);
    const played = def.codec.action.toText(s.action);
    let scored: Scored[];
    if (legal.length <= 1) scored = legal.map((a) => ({ action: def.codec.action.toText(a), value: 0 }));
    else scored = readMoves(await ask(spec.query, before));
    done++;
    onProgress(done, mine.length);
    const top = scored.length > 0 ? Math.max(...scored.map((m) => m.value)) : 0;
    const best = scored.find((m) => m.value >= top - 1e-9)?.action ?? played;
    const mineValue = scored.find((m) => m.action === played)?.value ?? top;
    const loss = Math.max(0, top - mineValue) * spec.scale;
    const playedBest = played === best || loss < 0.5;
    const verdict = verdictFor(loss, playedBest);
    moves.push({
      label: spec.label(before, s.action, moves.length),
      ply: i,
      seat: s.seat,
      played: spec.name(played),
      best: spec.name(best),
      bestMove: best,
      winBefore: Math.round(50 + top),
      winAfter: Math.round(50 + top - loss),
      loss: Math.round(loss * 10) / 10,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? spec.reason(before, s.action, best, loss / spec.scale) : null,
      accept: scored.filter((m) => top - m.value <= spec.alsoRight).map((m) => m.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: 0, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
