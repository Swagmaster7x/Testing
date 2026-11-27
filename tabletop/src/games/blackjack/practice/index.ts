/**
 * Blackjack practice, made on the spot and run on the lesson runner:
 *
 * - The basic-strategy trainer: a hand against an up-card under the default rules; the answer is
 *   the chart's move, and the chart is computed by expected value from the rules (strategy.ts).
 *   Every two-card hand against every up-card can come up (pairs and soft hands too).
 * - The running count: count every card on a table of two or three boxes (Hi-Lo).
 * - Payouts: what a blackjack pays at 3 to 2 or 6 to 5, and what insurance pays.
 * - Totals: add up a hand of two to four cards, soft or hard.
 */
import type { Lesson } from '../../../teach/lesson';
import type { DrillDef, PracticePack } from '../../practice';
import type { Card } from '../../classic/cards';
import { DECK } from '../../classic/cards';
import { blackjackLessonGame } from '../learn/game';
import { blackjack, position, STANDARD } from '../rules';
import { basicFor } from '../bots';
import { handTotal, hiLo } from '../strategy';

type Random = () => number;

function draw(random: Random, n: number, from: readonly Card[]): Card[] {
  const pool = [...from];
  const out: Card[] = [];
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0] as Card);
  return out;
}

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `blackjack.drill.${id}`, gameId: 'blackjack', stage: 'table', title, minutes: 1, start, steps };
}

const MOVE_WORD: Readonly<Record<string, string>> = { hit: 'hit', stand: 'stand', double: 'double', split: 'split', surrender: 'surrender' };

/** The basic-strategy trainer. */
function chartDrill(random: Random): Lesson {
  for (;;) {
    // A pair about one time in five, as at a real table they come up often enough to practise.
    const first = draw(random, 1, DECK)[0] as Card;
    const second = random() < 0.2 ? (DECK.find((c) => c[0] === first[0] && c !== first) as Card) : (draw(random, 1, DECK.filter((c) => c !== first))[0] as Card);
    const hand = [first, second];
    if (handTotal(hand).total === 21) continue;
    const up = draw(random, 1, DECK.filter((c) => !hand.includes(c)))[0] as Card;
    const start = position({ hand, up, config: STANDARD });
    const state = blackjack.codec.state.fromText(start);
    const move = basicFor(blackjack.view(state, 0));
    if (!move) continue;
    const legal = new Set(blackjack.legal(state, 0).map((a) => blackjack.codec.action.toText(a)));
    const wrong: Record<string, string> = {};
    for (const m of ['hit', 'stand', 'double', 'split', 'surrender']) if (m !== move && legal.has(m)) wrong[m] = `The chart says ${MOVE_WORD[move] ?? move} here.`;
    return lesson('chart', 'Basic strategy', start, [{ kind: 'askMove', text: 'Play this hand by the chart (six decks, the dealer stands on soft seventeen, double after a split, late surrender).', accept: [move], wrong, claim: 'legal', success: 'Right: the chart’s move, worked out by expected value.' }]);
  }
}

/** Keep the running count of a whole table. */
function countDrill(random: Random): Lesson {
  const others = random() < 0.5 ? 1 : 2;
  const cards = draw(random, 2 * (others + 1) + 1, DECK);
  const hand = cards.slice(0, 2);
  const rest = Array.from({ length: others }, (_, i) => cards.slice(2 + 2 * i, 4 + 2 * i));
  const up = cards[cards.length - 1] as Card;
  if (handTotal(hand).total === 21) return countDrill(random);
  const start = position({ hand, up, others: rest });
  const running = [...hand, ...rest.flat(), up].reduce((sum, c) => sum + hiLo(c), 0);
  const ask = { kind: 'askChoice' as const, text: 'Count every card on the table: two to six add one, tens, pictures and aces take one away. Where does the running count stand?' };
  const options = [
    { text: 'Above zero', correct: running > 0, why: running > 0 ? 'Yes: more low cards are gone.' : 'No.' },
    { text: 'At zero', correct: running === 0, why: running === 0 ? 'Yes: the low and high cards cancel out.' : 'No.' },
    { text: 'Below zero', correct: running < 0, why: running < 0 ? 'Yes: more high cards are gone.' : 'No.' },
  ];
  if (running === 0) return lesson('count', 'Running count', start, [{ ...ask, options }]);
  return lesson('count', 'Running count', start, [{ ...ask, options }, { kind: 'askNumber', text: running > 0 ? 'How far above zero?' : 'How far below zero?', answer: 'count:size', success: 'Yes: the running count is {count:running}.' }]);
}

/** What a hand pays. */
function payDrill(random: Random): Lesson {
  const bet = 10 * (1 + Math.floor(random() * 20));
  const kind = Math.floor(random() * 3);
  const start = position({ hand: ['Ah', 'Kd'], up: kind === 2 ? 'Ac' : '9c', bet });
  if (kind === 0) return lesson('pay', 'Payouts', start, [{ kind: 'askNumber', text: 'You bet {bet} and get a blackjack paying {pay:a} to {pay:b}. How many chips do you win?', answer: 'pay:bj', success: 'Yes, {pay:bj}.' }]);
  if (kind === 1) return lesson('pay', 'Payouts', start, [{ kind: 'askNumber', text: 'You bet {bet} and get a blackjack at a table paying {pay:c} to {pay:d}. How many chips do you win?', answer: 'pay:65', success: 'Yes, {pay:65}.' }]);
  return lesson('pay', 'Payouts', start, [{ kind: 'askNumber', text: 'You bet {bet}, insured for half of it, and the dealer has blackjack. Insurance pays {insurance:pays} to one: how many chips does the insurance win?', answer: 'pay:insurance', success: 'Yes, {pay:insurance}: exactly what your main bet loses.' }]);
}

/** Add up a hand. */
function totalDrill(random: Random): Lesson {
  for (;;) {
    const n = 2 + Math.floor(random() * 3);
    const hand = draw(random, n, DECK);
    const t = handTotal(hand);
    if (t.total >= 21) continue;
    const up = draw(random, 1, DECK.filter((c) => !hand.includes(c)))[0] as Card;
    const start = position({ hand, up });
    return lesson('total', 'Hand totals', start, [{ kind: 'askNumber', text: 'What is your total? Count an ace as {value:ace-high} unless that takes you over {bust:over}.', answer: 'hand:total', success: t.soft ? 'Yes, a soft {hand:total}.' : 'Yes, {hand:total}.' }]);
  }
}

export const BLACKJACK_DRILLS: readonly DrillDef[] = [
  { id: 'drill-blackjack-chart', make: chartDrill },
  { id: 'drill-blackjack-count', make: countDrill },
  { id: 'drill-blackjack-pay', make: payDrill },
  { id: 'drill-blackjack-total', make: totalDrill },
];

export function loadBlackjackPractice(): Promise<PracticePack> {
  return Promise.resolve({ problems: [], sets: [], drills: BLACKJACK_DRILLS, attribution: null, game: blackjackLessonGame, themeOrder: [] });
}
