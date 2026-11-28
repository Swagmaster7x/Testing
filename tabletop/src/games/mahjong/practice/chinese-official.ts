/**
 * The Chinese Official scoring drill (milestone 14b), on the lesson runner like the others: a
 * winning hand built toward a pattern that reaches the minimum; name a pattern it scores, count its
 * points (flowers included), then what the table pays you. Every answer is the Chinese Official
 * scorer's and settlement's, through the lesson numbers (`win:faan`, `win:total`).
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import type { DrillDef } from '../../practice';
import type { MahjongState, MeldSpec } from '../rules';
import type { Kind } from '../core/tiles';
import { codeOf, FLOWER_1, kindOf } from '../core/tiles';
import { CO_DEFAULTS, withoutFlowers } from '../styles/chinese-official';
import type { LessonSpec } from '../learn/game';
import { CO, lessonState, mahjongLessonGame, winOnOffer } from '../learn/game';
import { kindName, patternName } from '../ui/names';
import type { Complete, HandSet, Random } from './build';
import { buildComplete, calledMeld, codes, completeKinds, pick, playerPhrase, setKinds, shuffle } from './build';

function lesson(id: string, title: string, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.drill.${id}`, gameId: 'mahjong', stage: 'table', title, minutes: 1, start, steps };
}

const seedOf = (random: Random) => `drill/${Math.floor(random() * 1e9)}`;

function tryState(spec: LessonSpec): MahjongState | null {
  try {
    return lessonState(spec);
  } catch {
    return null;
  }
}

/** The patterns the drill builds toward: each one carries a hand to the minimum or most of the way. */
const TARGETS = ['co-mixed-triple-chow', 'co-mixed-straight', 'co-pure-straight', 'co-half-flush', 'co-all-pungs'] as const;

/** Patterns a hand might be thought to score, for the wrong answers. */
const NAMEABLE = ['co-mixed-triple-chow', 'co-mixed-straight', 'co-pure-straight', 'co-half-flush', 'co-full-flush', 'co-all-pungs', 'co-all-chows', 'co-seven-pairs', 'co-mixed-shifted-chows', 'co-all-types', 'co-outside-hand'] as const;

const chow = (kind: Kind): HandSet => ({ type: 'chow', kind });

/** Three runs that make the pattern, then a set and a pair at random, or null when the tiles do not fit. */
function withRuns(random: Random, runs: readonly HandSet[]): Complete | null {
  const counts = new Array<number>(34).fill(0);
  const take = (kinds: readonly Kind[]) => {
    for (const k of kinds) counts[k] = (counts[k] ?? 0) + 1;
    return kinds.every((k) => (counts[k] ?? 0) <= 4);
  };
  for (const r of runs) if (!take(setKinds(r))) return null;
  const extra: HandSet = random() < 0.5 ? chow(Math.floor(random() * 3) * 9 + Math.floor(random() * 7)) : { type: 'pung', kind: Math.floor(random() * 34) };
  if (!take(setKinds(extra))) return null;
  const pair = Math.floor(random() * 34);
  if (!take([pair, pair])) return null;
  return { sets: [...runs, extra], pair };
}

function build(random: Random, target: string): Complete | null {
  switch (target) {
    case 'co-mixed-triple-chow': {
      const r = Math.floor(random() * 7);
      return withRuns(random, [0, 1, 2].map((suit) => chow(suit * 9 + r)));
    }
    case 'co-mixed-straight': {
      const suits = shuffle(random, [0, 1, 2]);
      return withRuns(random, suits.map((suit, i) => chow(suit * 9 + 3 * i)));
    }
    case 'co-pure-straight': {
      const suit = Math.floor(random() * 3);
      return withRuns(random, [0, 3, 6].map((r) => chow(suit * 9 + r)));
    }
    case 'co-half-flush':
      return buildComplete(random, { suit: Math.floor(random() * 3), honour: 0.35, pung: 0.4 });
    default:
      return buildComplete(random, { suit: null, honour: 0.3, pung: 1 });
  }
}

export interface CoWin {
  readonly state: MahjongState;
  readonly lines: readonly string[];
  readonly selfDrawn: boolean;
  readonly target: string;
}

/** A hand you can win now under the official rules, scoring `target`, worth at least the minimum and less than a big limit hand. */
export function coWinningHand(random: Random): CoWin {
  for (;;) {
    const target = pick(random, TARGETS);
    const c = build(random, target);
    if (!c) continue;
    const called = c.sets.filter((_, i) => i >= 1 && random() < 0.3);
    const melds: MeldSpec[] = called.map((s) => calledMeld(random, s));
    const concealed = completeKinds({ sets: c.sets.filter((s) => !called.includes(s)), pair: c.pair });
    const win = pick(random, concealed);
    const selfDrawn = random() < 0.5;
    const hand = [...concealed];
    if (!selfDrawn) hand.splice(hand.indexOf(win), 1);
    const flowers = shuffle(random, Array.from({ length: 8 }, (_, i) => FLOWER_1 + i)).slice(0, Math.floor(random() * 3));
    const state = tryState({
      hand: codes(hand),
      ...(selfDrawn ? { drawn: codeOf(win) } : { offer: { seat: 1 + Math.floor(random() * 3), tile: codeOf(win) } }),
      melds: [melds],
      style: 'chinese-official',
      options: CO,
      dealer: Math.floor(random() * 4),
      round: Math.floor(random() * 4),
      bonus: [codes(flowers)],
      avoid: codeOf(win),
      turns: 3 + Math.floor(random() * 5),
      seed: seedOf(random),
    });
    if (!state) continue;
    const offer = winOnOffer(state);
    if (!offer || withoutFlowers(offer.score) < Number(CO_DEFAULTS.minPoints) || offer.score.total >= 64) continue;
    const lines = offer.score.lines.map((l) => l.id);
    if (!lines.includes(target)) continue;
    if (!mahjongLessonGame.moves(state).includes('win')) continue;
    return { state, lines, selfDrawn, target };
  }
}

function situation(h: CoWin): string {
  const s = h.state;
  const how = h.selfDrawn && s.drawn ? `You drew the ${kindName(kindOf(s.drawn))}, and your hand is complete.` : `${playerPhrase(s.claim?.from ?? 1)} threw the {claim:tile}, and it completes your hand.`;
  const flowers = (s.bonus[0] ?? []).length > 0 ? ' You have set aside {bonus:mine} flowers.' : '';
  return `${how} You sit {wind:seat} in the {wind:round} round.${flowers}`;
}

function pointsDrill(random: Random): Lesson {
  const h = coWinningHand(random);
  const wrong = shuffle(
    random,
    NAMEABLE.filter((id) => !h.lines.includes(id)),
  ).slice(0, 2);
  const options = shuffle(random, [
    { text: patternName(h.target), correct: true, why: `Right: ${patternName(h.target).toLowerCase()} is worth {win:line:${h.target}} here.` },
    ...wrong.map((id) => ({ text: patternName(id), why: `This hand does not score ${patternName(id).toLowerCase()}. It does score ${patternName(h.target).toLowerCase()}.` })),
  ]);
  const pays = h.selfDrawn ? 'Self-drawn: each of the others pays the points plus {co:base}.' : 'On a throw: the thrower pays the points plus {co:base}, the other two {co:base} each.';
  return lesson('co-points', 'Count the points', mahjongLessonGame.notation(h.state), [
    { kind: 'askChoice', text: `${situation(h)} Which of these patterns does it score?`, options },
    { kind: 'askNumber', text: 'How many points is it worth, flowers included? Count each pattern once: leave out any that a bigger one implies.', answer: 'win:faan', success: 'Yes, {win:faan} points.' },
    { kind: 'askNumber', text: `{win:faan} points. ${pays} How much do you collect in all?`, answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Win, and check your count against the sheet.', accept: ['win'], claim: 'legal', success: 'The sheet agrees: {win:faan} points, {win:total} in all.' },
  ]);
}

export const CO_DRILLS: readonly DrillDef[] = [{ id: 'drill-mahjong-co-points', make: pointsDrill }];
