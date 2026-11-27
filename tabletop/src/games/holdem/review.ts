/**
 * Hold'em review (PLAN.md 2.7 and M5): each of your decisions is rated by the chips it is expected
 * to cost, in big blinds. The default lens is "with what you knew": equity against the hands the
 * others were likely to hold given what they did, and what they would fold to each bet. Beside it
 * the reason gives the cost with every card face up (against the hands they really held). The
 * biggest losses are the key moments.
 */
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { GameRecord } from '../../core/record';
import { replay, startState } from '../../core/replay';
import type { GameAnalysis, MoveVerdict, Reason } from '../../teach/analysis';
import { ANALYSIS_VERSION, keyMoments, moveAccuracy, seatAccuracy, verdictFor } from '../../teach/analysis';
import { tDynamic } from '../../text';
import type { AskCoach } from '../types';
import { actionText, holdem, inHand, potOf, toCallOf } from './rules';
import { actionWords } from './ui/CoachPanel';

export const REVIEW_SAMPLES = 400;
/** A big blind lost counts as two points of "winning chances" for the verdicts: 2.5, 5 and 7.5 big blinds make an inaccuracy, a mistake and a blunder. */
const POINTS_PER_BB = 2;
/** Options within this many big blinds of the best also count as right on a practice card. */
const ALSO_RIGHT_BB = 1;

interface Option {
  readonly action: string;
  readonly ev: number;
  readonly equity: number;
}

function readOptions(json: Json | undefined): Option[] {
  if (!Array.isArray(json)) return [];
  return json.flatMap((o) => (isJsonObject(o) && typeof o.action === 'string' && typeof o.ev === 'number' && typeof o.equity === 'number' ? [{ action: o.action, ev: o.ev, equity: o.equity }] : []));
}

/** The option a played action is judged as: itself, or the raise size nearest to it. */
function matching(options: readonly Option[], played: string): Option | undefined {
  const exact = options.find((o) => o.action === played);
  if (exact || !played.startsWith('r')) return exact;
  const to = Number(played.slice(1));
  return options.filter((o) => o.action.startsWith('r')).sort((a, b) => Math.abs(Number(a.action.slice(1)) - to) - Math.abs(Number(b.action.slice(1)) - to))[0];
}

const best = (options: readonly Option[]): Option | undefined => options.reduce<Option | undefined>((top, o) => (!top || o.ev > top.ev ? o : top), undefined);
const round1 = (x: number) => Math.round(x * 10) / 10;
const kind = (action: string) => (action.startsWith('r') ? 'raise' : action);

function reasonFor(played: Option, top: Option, lossBb: number, upBb: number, need: number): Reason {
  const params = { move: actionWords(top.action), bb: round1(lossBb), up: round1(Math.max(0, upBb)), eq: Math.round(played.equity * 100), need: Math.round(need * 100) };
  const p = kind(played.action);
  const b = kind(top.action);
  if (p === 'fold') return { key: 'why.poker-folded', params };
  if (p === 'call' && b === 'fold') return { key: 'why.poker-called', params };
  if ((p === 'call' || p === 'check') && b === 'raise') return { key: 'why.poker-missed-value', params };
  if (p === 'raise' && b !== 'raise') return { key: 'why.poker-raised', params };
  return { key: 'why.poker-better', params };
}

export async function analyseHoldemGame(record: GameRecord, ask: AskCoach, onProgress: (done: number, total: number) => void, cancelled: () => boolean): Promise<GameAnalysis | null> {
  const humans = record.players.flatMap((p, seat) => (p.kind === 'human' ? [seat] : []));
  const start = startState(holdem, record);
  const { steps } = replay(holdem, record);
  const mine = steps.map((s, i) => ({ s, i })).filter(({ s }) => humans.includes(s.seat));
  const moves: MoveVerdict[] = [];
  let done = 0;
  for (const { s, i } of mine) {
    if (cancelled()) return null;
    const before = i === 0 ? start : (steps[i - 1]?.state ?? start);
    const played = actionText(s.action);
    const known: Record<string, string[]> = {};
    before.players.forEach((p, seat) => {
      if (seat !== s.seat && inHand(p)) known[String(seat)] = [...p.hole];
    });
    const answer = await ask({ type: 'analyse', known, extra: played.startsWith('r') ? [Number(played.slice(1))] : [], samples: REVIEW_SAMPLES }, before);
    done++;
    onProgress(done, mine.length);
    const knew = readOptions(isJsonObject(answer) ? answer.knew : undefined);
    const up = readOptions(isJsonObject(answer) ? answer.up : undefined);
    const top = best(knew);
    const mineKnew = matching(knew, played);
    if (!top || !mineKnew) continue;
    const bb = before.blinds.bb;
    const lossBb = Math.max(0, (top.ev - mineKnew.ev) / bb);
    const upTop = best(up);
    const upMine = matching(up, played);
    const upBb = upTop && upMine ? (upTop.ev - upMine.ev) / bb : 0;
    const loss = lossBb * POINTS_PER_BB;
    const playedBest = top.action === mineKnew.action || lossBb < 0.25;
    const verdict = verdictFor(loss, playedBest);
    const owe = Math.min(toCallOf(before, s.seat), before.players[s.seat]?.stack ?? 0);
    const need = owe > 0 ? owe / (potOf(before) + owe) : 0;
    moves.push({
      label: tDynamic('poker.review.move', { n: before.handNo, street: tDynamic(`poker.street.${before.street}`), move: actionWords(played) }),
      ply: i,
      seat: s.seat,
      played: actionWords(played),
      best: actionWords(top.action),
      bestMove: top.action,
      winBefore: 50,
      winAfter: Math.round((50 - loss / 2) * 10) / 10,
      loss: round1(loss),
      accuracy: Math.round(moveAccuracy(loss)),
      verdict,
      reason: verdict === 'inaccuracy' || verdict === 'mistake' || verdict === 'blunder' ? reasonFor(mineKnew, top, lossBb, upBb, need) : null,
      accept: knew.filter((o) => (top.ev - o.ev) / bb <= ALSO_RIGHT_BB).map((o) => o.action),
    });
  }
  return { version: ANALYSIS_VERSION, nodes: REVIEW_SAMPLES, moves, accuracy: seatAccuracy(moves), keyMoments: keyMoments(moves, humans) };
}
