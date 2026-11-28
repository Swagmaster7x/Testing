/**
 * The Sichuan scoring drill (milestone 14c), on the lesson runner like the other drills: a
 * winning Sichuan hand built toward a pattern (all pungs, one suit, seven pairs, a root, or a plain
 * hand), in at most two suits. Count its fan, then what it collects; both are checked by the
 * Sichuan scorer and its payments.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import type { DrillDef } from '../../practice';
import type { MahjongState, MeldSpec } from '../rules';
import type { Kind } from '../core/tiles';
import { codeOf, kindOf } from '../core/tiles';
import type { LessonSpec } from '../learn/game';
import { lessonState, mahjongLessonGame, SICHUAN, winOnOffer } from '../learn/game';
import { kindName, patternName } from '../ui/names';
import type { Random } from './build';
import { buildComplete, calledMeld, codes, completeKinds, pick, playerPhrase, shuffle } from './build';

function lesson(id: string, title: string, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.drill.${id}`, gameId: 'mahjong', stage: 'table', title, minutes: 1, start, steps };
}

const seedOf = (random: Random) => `sichuan/${Math.floor(random() * 1e9)}`;

function tryState(spec: LessonSpec): MahjongState | null {
  try {
    return lessonState(spec);
  } catch {
    return null;
  }
}

const suitsOf = (kinds: readonly Kind[]) => new Set(kinds.map((k) => Math.floor(k / 9)));

/** Seven pairs from at most two suits, one pair sometimes doubled into four alike (a root). */
function sevenPairs(random: Random, suits: readonly number[]): Kind[] {
  const pool = shuffle(
    random,
    suits.flatMap((s) => Array.from({ length: 9 }, (_, r) => s * 9 + r)),
  );
  const pairs = pool.slice(0, 7);
  if (random() < 0.4) pairs[6] = pairs[0] as Kind;
  return pairs.flatMap((k) => [k, k]);
}

export interface SichuanWin {
  readonly state: MahjongState;
  readonly selfDrawn: boolean;
  readonly lines: readonly string[];
}

/** A Sichuan hand you can win now, under the cap, built toward one of the common patterns. */
export function sichuanWinningHand(random: Random): SichuanWin {
  for (;;) {
    const goal = pick(random, ['plain', 'pungs', 'pure', 'pairs', 'root'] as const);
    const twoSuits = shuffle(random, [0, 1, 2]).slice(0, goal === 'pure' ? 1 : 2);
    let concealed: Kind[];
    let melds: MeldSpec[] = [];
    if (goal === 'pairs') concealed = sevenPairs(random, twoSuits);
    else {
      const c = buildComplete(random, { suit: goal === 'pure' ? (twoSuits[0] ?? 0) : null, honour: 0, pung: goal === 'pungs' ? 1 : goal === 'root' ? 0.6 : 0.3 });
      if (!c) continue;
      const kinds = completeKinds(c);
      if (suitsOf(kinds).size > 2) continue;
      // Up to two pungs called; for a root, a pung laid down as a kong.
      const called = c.sets.filter((s, i) => s.type === 'pung' && i < 2 && random() < 0.4);
      melds = called.map((s, i) => (goal === 'root' && i === 0 ? { type: 'kong', tiles: codes([s.kind, s.kind, s.kind, s.kind]), from: 1 + Math.floor(random() * 3) } : calledMeld(random, s)));
      concealed = completeKinds({ sets: c.sets.filter((s) => !called.includes(s)), pair: c.pair });
    }
    const kinds = [...concealed, ...melds.flatMap((m) => m.tiles.split(' ').map((t) => kindOf(`${t}.0`)))];
    if (kinds.some((k) => kinds.filter((x) => x === k).length > 4)) continue;
    const present = suitsOf(kinds);
    const voidSuit = [0, 1, 2].find((s) => !present.has(s)) ?? 2;
    const win = pick(random, concealed);
    const selfDrawn = random() < 0.5;
    const hand = [...concealed];
    if (!selfDrawn) hand.splice(hand.indexOf(win), 1);
    const thrower = 1 + Math.floor(random() * 3);
    // The thrower voids the winning tile's suit, so throwing it is always allowed.
    const voids = [0, 1, 2, 3].map((seat) => (seat === 0 ? voidSuit : seat === thrower && !selfDrawn ? Math.floor(win / 9) : (seat + voidSuit) % 3));
    const state = tryState({
      hand: codes(hand),
      ...(selfDrawn ? { drawn: codeOf(win) } : { offer: { seat: thrower, tile: codeOf(win) } }),
      melds: [melds],
      style: 'sichuan',
      options: SICHUAN,
      dealer: Math.floor(random() * 4),
      voids,
      avoid: codeOf(win),
      turns: 2 + Math.floor(random() * 4),
      seed: seedOf(random),
    });
    if (!state) continue;
    const offer = winOnOffer(state);
    if (!offer || offer.score.limit) continue;
    if (!mahjongLessonGame.moves(state).includes('win')) continue;
    return { state, selfDrawn, lines: offer.score.lines.map((l) => l.id) };
  }
}

function fanDrill(random: Random): Lesson {
  const h = sichuanWinningHand(random);
  const s = h.state;
  const how = h.selfDrawn && s.drawn ? `You drew the ${kindName(kindOf(s.drawn))}, and your hand is complete.` : `${playerPhrase(s.claim?.from ?? 1)} threw the {claim:tile}, and it completes your hand.`;
  const pays = h.selfDrawn ? 'Self-drawn: each of the three others pays the points, and one more each.' : 'On a throw: the thrower alone pays the points.';
  const named = h.lines.length > 0 ? `It scores ${h.lines.map(patternName).join(', ')}.` : 'It is a basic hand: no fan.';
  return lesson('sichuan-fan', 'Sichuan: count the fan', mahjongLessonGame.notation(s), [
    { kind: 'askNumber', text: `${how} No tile of your void suit is left. How many fan is it worth?`, answer: 'win:faan', success: `Yes, {win:faan}. ${named}` },
    { kind: 'askNumber', text: `{win:faan} fan make {win:base} points. ${pays} How much do you collect in all?`, answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Win, and check your count against the sheet.', accept: ['win'], claim: 'legal', success: 'The sheet agrees: {win:faan} fan, {win:total} in all. The other three play on.' },
  ]);
}

export const SICHUAN_DRILLS: readonly DrillDef[] = [{ id: 'drill-mahjong-sichuan-fan', make: fanDrill }];
