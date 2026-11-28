/**
 * The checks behind the Mahjong lesson linter (PLAN.md 2.5). A "best" claim is a discard, proved
 * by the coach's own calculators from what you can see (never the hidden hands):
 *
 * - **efficiency** (the default): the accepted tiles are exactly the discards that leave the hand
 *   fewest tiles from ready and, among those, the most useful tiles you have not seen; every
 *   other discard as fast must keep at least MARGIN fewer, so the answer is never a toss-up;
 * - **safety** (a position whose seed starts with "safety"): the accepted tiles are exactly the
 *   safest by the safe-tile ranking against the other players, and the next safest is clearly
 *   more dangerous.
 *
 * Positions must be real: every tile in one place (the codec checks) and every hand the right
 * size. (That you are to move wherever a lesson asks for a move is checked by the unit tests.)
 */
import type { LessonVerifier } from '../../../teach/lint';
import type { FreePlayStep } from '../../../teach/lesson';
import type { MahjongState } from '../rules';
import { actionText, engine, mahjong, viewOf } from '../rules';
import { SEATS } from '../core/engine';
import type { Kind } from '../core/tiles';
import { codeOf, parseKind } from '../core/tiles';
import { evaluateDiscards, picture, safetyRanking } from '../strategy';
import { STUDENT } from './game';

/** The least lead in useful tiles a "best" discard must have over every other discard as fast. */
export const MARGIN = 2;
/** The least extra danger the next safest tile must carry, over the safest. */
export const SAFETY_MARGIN = 0.08;

const isOver = (s: MahjongState) => s.over || s.phase === 'scored';

export function positionProblems(state: MahjongState): string[] {
  const problems: string[] = [];
  const r = engine.rules(state.config);
  for (let seat = 0; seat < SEATS; seat++) {
    const melds = state.melds[seat] ?? [];
    // A kong counts as three (its fourth tile brings a replacement), except in a card style, where
    // an exposure of any size takes no replacement and every tile in it counts.
    const size = (state.hands[seat] ?? []).length + melds.reduce((n, m) => n + (r.customShape ? m.tiles.length : 3), 0);
    const acting = state.phase === 'act' && state.turn === seat;
    const want = r.handSize + (acting ? 1 : 0);
    if (!isOver(state) && size !== want) problems.push(`seat ${seat} holds ${size} tiles, not ${want}`);
  }
  return problems;
}

/** The kinds a list of discards names, or a problem. */
function kindsOf(state: MahjongState, accept: readonly string[]): Kind[] | string {
  if (state.phase !== 'act' || state.turn !== STUDENT) return 'a "best" claim is about a discard, on your turn';
  const out: Kind[] = [];
  for (const m of accept) {
    const k = parseKind(m.trim());
    if (k === null) return `"best" accepts only discards, not ${m}`;
    out.push(k);
  }
  return out;
}

/** Problems with an efficiency claim: the accepted discards must be exactly the best, by a margin. */
export function efficiencyProblems(state: MahjongState, accept: readonly string[]): string[] {
  const kinds = kindsOf(state, accept);
  if (typeof kinds === 'string') return [kinds];
  const evals = evaluateDiscards(picture(viewOf(state, STUDENT)));
  const fastest = Math.min(...evals.map((e) => e.shanten));
  const most = Math.max(...evals.filter((e) => e.shanten === fastest).map((e) => e.accept));
  const best = evals.filter((e) => e.shanten === fastest && e.accept === most).map((e) => e.kind);
  const problems: string[] = [];
  const name = (ks: readonly Kind[]) => ks.map(codeOf).join(' ');
  if (best.length !== kinds.length || best.some((k) => !kinds.includes(k))) problems.push(`claim "best", but the best discards are ${name(best)} (${fastest} from ready, ${most} useful tiles), not ${name(kinds)}`);
  const close = evals.filter((e) => !best.includes(e.kind) && e.shanten === fastest && e.accept > most - MARGIN);
  if (close.length > 0) problems.push(`claim "best", but ${name(close.map((e) => e.kind))} keep almost as many useful tiles (within ${MARGIN})`);
  return problems;
}

/** Problems with a safety claim: the accepted discards must be exactly the safest, clearly. */
export function safetyProblems(state: MahjongState, accept: readonly string[]): string[] {
  const kinds = kindsOf(state, accept);
  if (typeof kinds === 'string') return [kinds];
  const ranking = safetyRanking(picture(viewOf(state, STUDENT)));
  const low = ranking[0]?.danger ?? 0;
  const safest = ranking.filter((x) => x.danger <= low + 1e-9).map((x) => x.kind);
  const next = ranking.find((x) => x.danger > low + 1e-9);
  const problems: string[] = [];
  if (safest.length !== kinds.length || safest.some((k) => !kinds.includes(k))) problems.push(`claim "best" (safety), but the safest tiles are ${safest.map(codeOf).join(' ')}`);
  if (next && next.danger - low < SAFETY_MARGIN) problems.push(`claim "best" (safety), but ${codeOf(next.kind)} is nearly as safe`);
  return problems;
}

export const isSafetyClaim = (state: MahjongState): boolean => state.seed.startsWith('safety');

/** The move a sensible student makes here: win, pass on calls, else the most efficient discard. */
export function studentMove(state: MahjongState): string {
  const seat = mahjong.turn(state) ?? STUDENT;
  const legal = mahjong.legal(state, seat);
  const win = legal.find((a) => a.type === 'win');
  if (win) return actionText(win);
  if (state.phase !== 'act') return 'pass';
  const evals = evaluateDiscards(picture(viewOf(state, seat)));
  const best = [...evals].sort((a, b) => a.shanten - b.shanten || b.accept - a.accept || a.kind - b.kind)[0];
  return best ? codeOf(best.kind) : actionText(legal[0] ?? { type: 'pass' });
}

export const mahjongVerifier: LessonVerifier<MahjongState> = {
  positionProblems,
  checkBest(state, accept) {
    return Promise.resolve(isSafetyClaim(state) ? safetyProblems(state, accept) : efficiencyProblems(state, accept));
  },
  freePlayMove(state: MahjongState, _role: 'student' | 'opponent', _step: FreePlayStep) {
    return Promise.resolve(studentMove(state));
  },
};
