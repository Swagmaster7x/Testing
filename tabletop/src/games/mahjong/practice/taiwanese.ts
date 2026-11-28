/**
 * The Taiwanese scoring drill (milestone 14b), on the lesson runner like the others: a winning
 * 16-tile hand, sometimes yours as the dealer on repeat deals, sometimes paid by the dealer; count
 * its tai, then what you collect at the table's stakes. Every answer is the Taiwanese scorer's and
 * settlement's, through the lesson numbers (`win:faan`, `win:total`).
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import type { DrillDef } from '../../practice';
import type { MahjongState, MeldSpec } from '../rules';
import { codeOf, FLOWER_1, kindOf } from '../core/tiles';
import type { LessonSpec } from '../learn/game';
import { lessonState, mahjongLessonGame, TW, winOnOffer } from '../learn/game';
import { kindName } from '../ui/names';
import type { Knobs, Random } from './build';
import { buildComplete, calledMeld, codes, completeKinds, pick, playerPhrase, shuffle } from './build';

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

/** Hands the drill builds: runs, pungs, one suit, honours. */
const KNOBS: readonly ((random: Random) => Knobs)[] = [
  () => ({ suit: null, honour: 0, pung: 0 }),
  () => ({ suit: null, honour: 0.3, pung: 1 }),
  (random) => ({ suit: Math.floor(random() * 3), honour: 0.3, pung: 0.4 }),
  () => ({ suit: null, honour: 0.25, pung: 0.3 }),
];

export interface TwWin {
  readonly state: MahjongState;
  readonly selfDrawn: boolean;
}

/** A 16-tile hand you can win now under the common rules, worth less than a big limit. */
export function twWinningHand(random: Random): TwWin {
  for (;;) {
    const c = buildComplete(random, pick(random, KNOBS)(random), 5);
    if (!c) continue;
    const called = c.sets.filter((_, i) => i >= 1 && random() < 0.25);
    const melds: MeldSpec[] = called.map((s) => calledMeld(random, s));
    const concealed = completeKinds({ sets: c.sets.filter((s) => !called.includes(s)), pair: c.pair });
    const win = pick(random, concealed);
    const selfDrawn = random() < 0.5;
    const hand = [...concealed];
    if (!selfDrawn) hand.splice(hand.indexOf(win), 1);
    const flowers = shuffle(random, Array.from({ length: 8 }, (_, i) => FLOWER_1 + i)).slice(0, Math.floor(random() * 3));
    const dealer = Math.floor(random() * 4);
    const state = tryState({
      hand: codes(hand),
      ...(selfDrawn ? { drawn: codeOf(win) } : { offer: { seat: 1 + Math.floor(random() * 3), tile: codeOf(win) } }),
      melds: [melds],
      style: 'taiwanese',
      options: TW,
      dealer,
      round: Math.floor(random() * 4),
      counter: random() < 0.5 ? 0 : 1 + Math.floor(random() * 2),
      bonus: [codes(flowers)],
      avoid: codeOf(win),
      turns: 3 + Math.floor(random() * 5),
      seed: seedOf(random),
    });
    if (!state) continue;
    const offer = winOnOffer(state);
    if (!offer || offer.score.total >= 16) continue;
    if (!mahjongLessonGame.moves(state).includes('win')) continue;
    return { state, selfDrawn };
  }
}

function situation(h: TwWin): string {
  const s = h.state;
  const how = h.selfDrawn && s.drawn ? `You drew the ${kindName(kindOf(s.drawn))}, and your hand is complete.` : `${playerPhrase(s.claim?.from ?? 1)} threw the {claim:tile}, and it completes your hand.`;
  const dealer = s.dealer === 0 ? (s.counter > 0 ? ' You deal, with {tw:streak} repeat deals so far.' : ' You deal.') : s.counter > 0 ? ` ${playerPhrase(s.dealer)} deals (repeat deals so far: {tw:streak}).` : ` ${playerPhrase(s.dealer)} deals.`;
  const flowers = (s.bonus[0] ?? []).length > 0 ? ' You have set aside {bonus:mine} flowers.' : '';
  return `${how} You sit {wind:seat} in the {wind:round} round.${dealer}${flowers}`;
}

function taiDrill(random: Random): Lesson {
  const h = twWinningHand(random);
  const s = h.state;
  const dealerPays = s.dealer !== 0 && (h.selfDrawn || s.claim?.from === s.dealer);
  const pays = h.selfDrawn ? 'Self-drawn: each of the other three pays.' : 'On a throw: only the thrower pays.';
  const extra = dealerPays ? ' The dealer pays {tw:dealer-extra} tai more.' : '';
  return lesson('tw-tai', 'Count the tai', mahjongLessonGame.notation(s), [
    { kind: 'askNumber', text: `${situation(h)} How many tai is it worth, the dealer’s included?`, answer: 'win:faan', success: 'Yes, {win:faan} tai.' },
    { kind: 'askNumber', text: `{win:faan} tai, at {tw:base} a hand and {tw:per-tai} a tai. ${pays}${extra} How much do you collect in all?`, answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Win, and check your count against the sheet.', accept: ['win'], claim: 'legal', success: 'The sheet agrees: {win:faan} tai, {win:total} in all.' },
  ]);
}

export const TW_DRILLS: readonly DrillDef[] = [{ id: 'drill-mahjong-tw-tai', make: taiDrill }];
