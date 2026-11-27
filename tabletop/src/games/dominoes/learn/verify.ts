/**
 * The checks behind the dominoes lesson linter. A "best" claim is proved by exact search over
 * every way the hidden tiles could lie that agrees with what the student can see (each pass
 * included), or over the true deal when the step shows every hand: the accepted plays must score
 * best on average, and every other play at least BEST_MARGIN points worse. Claims are therefore
 * made in endgames, where the deals are few.
 */
import { createRng } from '../../../core/rng';
import type { LessonVerifier } from '../../../teach/lint';
import { chooseAction } from '../bots';
import type { DominoesState, Tile } from '../rules';
import { actionText, cantHave, checkConservation, dominoes, drawing, handSize, hasNumber, seatCount, sideOf, unseenTiles, viewOf } from '../rules';
import { cloneSim, DRAW, fromState, moveOf, PASS, simApply, solveMargin, tileIndex } from '../sim';

/** Points the best play must win by, on average over the possible deals. */
export const BEST_MARGIN = 2;
/** More possible deals than this and a "best" claim is refused. */
const MAX_DEALS = 4000;

/** Every deal of the unseen tiles to the other hands (and boneyard) that agrees with the student's view. */
export function possibleDeals(state: DominoesState, seat: number): DominoesState[] | null {
  const n = seatCount(state.config);
  const view = viewOf(state, seat);
  const unseen = unseenTiles(view);
  const others = Array.from({ length: n }, (_, s) => s).filter((s) => s !== seat);
  const lacks = others.map((s) => cantHave(view, s));
  const counts = others.map((s) => (state.hands[s] ?? []).length);
  const out: DominoesState[] = [];
  const hands: Tile[][] = others.map(() => []);
  let aborted = false;
  const place = (i: number) => {
    if (aborted) return;
    if (i === unseen.length) {
      if (hands.every((h, k) => h.length === counts[k])) {
        const all = Array.from({ length: n }, (_, s) => (s === seat ? [...(state.hands[seat] ?? [])] : [...(hands[others.indexOf(s)] ?? [])]));
        const boneyard = unseen.filter((t) => !all.some((h) => h.includes(t)));
        out.push({ ...state, hands: all, boneyard });
        if (out.length > MAX_DEALS) aborted = true;
      }
      return;
    }
    const tile = unseen[i] as Tile;
    let placed = false;
    hands.forEach((h, k) => {
      if (h.length >= (counts[k] ?? 0)) return;
      const l = lacks[k];
      if (l && [...l].some((x) => hasNumber(tile, x))) return;
      h.push(tile);
      placed = true;
      place(i + 1);
      h.pop();
    });
    // The boneyard may hold any tile.
    const inHands = counts.reduce((a, b) => a + b, 0);
    if (unseen.length > inHands) place(i + 1);
    void placed;
  };
  place(0);
  return aborted ? null : out;
}

const END_CODES: Readonly<Record<string, number>> = { L: 0, R: 1, U: 2, D: 3 };

const code = (state: DominoesState, text: string): number => {
  if (text === 'pass') return PASS;
  if (text === 'draw') return DRAW;
  const tile = text.replace(/[LRUD]$/, '') as Tile;
  return moveOf(tileIndex(tile, state.config.set), END_CODES[text.slice(-1)] ?? 0);
};

export const dominoesVerifier: LessonVerifier<DominoesState> = {
  positionProblems(state) {
    const problems: string[] = [];
    try {
      checkConservation(state);
    } catch (err) {
      problems.push((err as Error).message);
    }
    if (state.hands.some((h) => h.length > handSize(state.config)) && !drawing(state.config)) problems.push('a hand holds more tiles than were dealt');
    const seat = dominoes.turn(state);
    if (seat !== null && !state.over && dominoes.legal(state, seat).length === 0) problems.push('the player to move has no legal move');
    return problems;
  },

  checkBest(state, accept, context) {
    const seat = dominoes.turn(state) ?? 0;
    const side = sideOf(seat, seatCount(state.config));
    // With every hand shown, the one true deal; otherwise every deal the student cannot rule out.
    const deals = context?.openHand ? [state] : possibleDeals(state, seat);
    if (!deals) return Promise.resolve([`claim "best": more than ${MAX_DEALS} possible deals; make the claim nearer the end`]);
    const legal = [...new Set(dominoes.legal(state, seat).map(actionText))];
    const totals = new Map<string, number>(legal.map((m) => [m, 0]));
    for (const deal of deals) {
      const sim = fromState(deal);
      for (const m of legal) {
        const child = cloneSim(sim);
        simApply(child, code(state, m));
        totals.set(m, (totals.get(m) ?? 0) + solveMargin(child, side));
      }
    }
    const avg = new Map([...totals].map(([m, v]) => [m, v / Math.max(1, deals.length)]));
    const top = Math.max(...avg.values());
    const problems: string[] = [];
    const accepted = new Set(accept);
    for (const m of accept) {
      const v = avg.get(m);
      if (v === undefined) problems.push(`claim "best": ${m} is not legal`);
      else if (v < top - 1e-9) problems.push(`claim "best": ${m} averages ${v.toFixed(1)}, the best play ${top.toFixed(1)}`);
    }
    for (const [m, v] of avg) {
      if (!accepted.has(m) && top - v < BEST_MARGIN) problems.push(`claim "best": ${m} averages ${v.toFixed(1)}, as good as ${top.toFixed(1)}`);
    }
    return Promise.resolve(problems);
  },

  freePlayMove(state) {
    const seat = dominoes.turn(state) ?? 0;
    return Promise.resolve(actionText(chooseAction(viewOf(state, seat), 5, createRng(`${state.moves.length}`))));
  },
};
