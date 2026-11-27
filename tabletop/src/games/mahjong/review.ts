/**
 * Mahjong game review (PLAN.md 2.7): every discard you made, judged "with what you knew" by the
 * coach's top level: the useful tiles (efficiency) it gave up, the value it put at risk, and, when
 * it fed someone's winning hand, which safer tile was there. Missed wins are flagged too. The
 * biggest losses are the key moments, each with a one-sentence reason.
 */
import type { Seat } from '../../core/contract';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import type { MahjongEvent, MahjongState } from './core/engine';
import { parseKind } from './core/tiles';
import { actionText, mahjong } from './rules';
import { kindName, moveName, whoName } from './ui/names';

/** Moves within this much of the best (in the review's points) also count as right on a practice card. */
const ALSO_RIGHT = 2.5;
/** The coach's scores are about a thousand for each step from ready; a step is a 25-point loss. */
const SCALE = 40;

interface Scored {
  readonly action: string;
  readonly score: number;
  readonly shanten: number;
  readonly accept: number;
  readonly danger: number;
  readonly value: number;
  readonly winnable: number | null;
}

function readMoves(answer: Json): { moves: Scored[]; best: string | null } {
  if (!isJsonObject(answer) || !Array.isArray(answer.moves)) return { moves: [], best: null };
  const moves = answer.moves.flatMap((m) =>
    isJsonObject(m) && typeof m.action === 'string' && typeof m.score === 'number'
      ? [
          {
            action: m.action,
            score: m.score,
            shanten: typeof m.shanten === 'number' ? m.shanten : 9,
            accept: typeof m.accept === 'number' ? m.accept : 0,
            danger: typeof m.danger === 'number' ? m.danger : 0,
            value: typeof m.value === 'number' ? m.value : 0,
            winnable: typeof m.winnable === 'number' ? m.winnable : null,
          },
        ]
      : [],
  );
  return { moves, best: typeof answer.best === 'string' ? answer.best : null };
}

function tileOf(action: string): string {
  const k = parseKind(action);
  return k === null ? action : kindName(k);
}

/** Who won off this discard, if it fed a winning hand. */
function fedWinner(steps: readonly { readonly events: readonly MahjongEvent[] }[], from: number, seat: Seat, tile: string): Seat | null {
  for (let i = from; i < steps.length; i++) {
    for (const e of steps[i]?.events ?? []) {
      if (e.type === 'win' && e.win.from === seat && e.win.tile === tile) return e.win.seat;
      if (e.type === 'hand-end' || e.type === 'discard') {
        if (e.type === 'discard' && i === from) continue;
        return null;
      }
    }
  }
  return null;
}

function reasonFor(played: Scored, best: Scored, fed: Seat | null, me: Seat, threatened: Seat | null): Reason {
  const move = tileOf(best.action);
  if (fed !== null) return { key: 'why.mj-dealt-in', params: { who: whoName(fed, me), move } };
  if (played.winnable === 0 && best.winnable !== 0 && played.shanten === 0) return { key: 'why.mj-dead-ready', params: { move } };
  if (played.shanten > best.shanten) {
    const n = played.shanten - best.shanten;
    return { key: n === 1 ? 'why.mj-slower' : 'why.mj-slower.other', params: { move, n } };
  }
  if (played.shanten === 0 && best.shanten === 0) {
    if ((best.winnable ?? 0) > (played.winnable ?? 0)) return { key: 'why.mj-wait', params: { move, best: best.winnable ?? 0, played: played.winnable ?? 0 } };
    if (best.value > played.value) return { key: 'why.mj-more-value', params: { move } };
  }
  if (played.danger > best.danger + 0.3 && threatened !== null) return { key: 'why.mj-danger', params: { who: whoName(threatened, me), move } };
  if (best.value > played.value + 0.6) return { key: 'why.mj-value', params: { move } };
  if (best.accept > played.accept) return { key: 'why.mj-efficiency', params: { move, best: best.accept, played: played.accept } };
  if (best.value > played.value + 0.2) return { key: 'why.mj-more-value', params: { move } };
  return { key: 'why.mj-better', params: { move } };
}

export async function analyseMahjongGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(mahjong, record);
  const { steps } = replay(mahjong, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s }) => humans.includes(s.seat) && s.action.type !== 'next' && s.action.type !== 'pass');
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before: MahjongState = i === 0 ? start : (steps[i - 1]?.state ?? start);
    done++;
    onProgress(done, mine.length);
    const legal = mahjong.legal(before, s.seat);
    const played = actionText(s.action);
    // A win left on the table: the clearest mistake there is.
    if (legal.some((a) => a.type === 'win') && s.action.type !== 'win') {
      moves.push({
        label: tDynamic('mahjong.review.call', { n: before.handNo + 1, move: moveName(s.action) }),
        ply: i,
        seat: s.seat,
        played: moveName(s.action),
        best: moveName({ type: 'win' }),
        bestMove: 'win',
        winBefore: 60,
        winAfter: 40,
        loss: 20,
        accuracy: Math.round(moveAccuracy(20)),
        verdict: 'blunder',
        reason: { key: 'why.mj-better', params: { move: moveName({ type: 'win' }) } },
        accept: ['win'],
      });
      continue;
    }
    if (s.action.type !== 'discard' || legal.filter((a) => a.type === 'discard').length <= 1) continue;
    const { moves: scored, best: bestAction } = readMoves(await ask({ type: 'analyse' }, before));
    const top = scored.length > 0 ? Math.max(...scored.map((m) => m.score)) : 0;
    const best = scored.find((m) => m.action === bestAction) ?? scored.find((m) => m.score >= top - 1e-9);
    const mineScored = scored.find((m) => m.action === played);
    if (!best || !mineScored) continue;
    const tileId = steps[i]?.events.find((e): e is Extract<MahjongEvent, { type: 'discard' }> => e.type === 'discard')?.tile ?? '';
    const fed = fedWinner(steps, i, s.seat, tileId);
    let loss = Math.max(0, (top - mineScored.score) / SCALE);
    // Feeding a winner is judged by what you knew: the loss counts only if a safer tile was cheap.
    if (fed !== null && mineScored.danger > best.danger) loss = Math.max(loss, 6);
    loss = Math.round(Math.min(40, loss) * 10) / 10;
    const playedBest = played === best.action || loss < 1;
    const verdict = verdictFor(loss, playedBest);
    const threat = (() => {
      const lvl = before.melds.map((m, seat) => ({ seat, n: m.filter((x) => !x.concealed).length })).filter((x) => x.seat !== s.seat).sort((a, b) => b.n - a.n)[0];
      return lvl && lvl.n >= 2 ? lvl.seat : null;
    })();
    moves.push({
      label: tDynamic('mahjong.review.move', { n: before.handNo + 1, tile: tileOf(played) }),
      ply: i,
      seat: s.seat,
      played: tileOf(played),
      best: tileOf(best.action),
      bestMove: best.action,
      winBefore: 50,
      winAfter: Math.round((50 - loss) * 10) / 10,
      loss,
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' || fed !== null ? reasonFor(mineScored, best, fed, s.seat, threat) : null,
      accept: scored.filter((m) => (top - m.score) / SCALE <= ALSO_RIGHT).map((m) => m.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: 0, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
