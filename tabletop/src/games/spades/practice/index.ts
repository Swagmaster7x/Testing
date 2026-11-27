/**
 * Spades practice: three drills made on the spot, run on the lesson runner: count a hand for a
 * bid (the lessons' simple count), score a hand with its bags, and win or duck a trick depending on
 * what your side still needs.
 */
import type { Lesson } from '../../../teach/lesson';
import type { DrillDef, PracticePack } from '../../practice';
import type { Card, Suit } from '../../classic/cards';
import { DECK, rankHigh, SUITS, suitOf } from '../../classic/cards';
import { cardShort } from '../../classic/names';
import type { Play } from '../../classic/tricks';
import { trickWinner } from '../../classic/tricks';
import { spadesLessonGame } from '../learn/game';
import { position, scoreHand, STANDARD, TRUMP } from '../rules';

type Random = () => number;

function draw(random: Random, n: number, from: readonly Card[]): Card[] {
  const pool = [...from];
  const out: Card[] = [];
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0] as Card);
  return out;
}

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `spades.drill.${id}`, gameId: 'spades', stage: 'table', title, minutes: 1, start, steps };
}

/** Count a fresh hand for a bid. */
function countDrill(random: Random): Lesson {
  const pack = draw(random, 52, DECK);
  const hands = [0, 1, 2, 3].map((s) => pack.slice(s * 13, s * 13 + 13));
  const start = position({ hands, phase: 'bid', bids: [null, null, null, null], dealer: 3 });
  return lesson('count', 'Count a bid', start, [{ kind: 'askNumber', text: 'Count this hand: one for each ace, one for each king with another card of its suit, one for each spade past the third. What do you bid?', answer: 'count:simple', success: 'Yes, {count:simple}.' }]);
}

/** Score a hand with one trick left to play. */
function scoreDrill(random: Random): Lesson {
  const bidMe = 1 + Math.floor(random() * 5);
  const bidPartner = 1 + Math.floor(random() * 5);
  const bids = [bidMe, 2 + Math.floor(random() * 4), bidPartner, 2 + Math.floor(random() * 4)];
  // Twelve tricks already played, shared at random.
  const won = [0, 0, 0, 0];
  for (let i = 0; i < 12; i++) {
    const seat = Math.floor(random() * 4);
    won[seat] = (won[seat] ?? 0) + 1;
  }
  const last = draw(random, 4, DECK.filter((c) => suitOf(c) === 'h'));
  const bagCount = [Math.floor(random() * 10), Math.floor(random() * 10)];
  const start = position({ hands: last.map((c) => [c]), leader: 0, bids, won, bagCount });
  const score = scoreHand(STANDARD, bids, [false, false, false, false], won, bagCount).deltas[0] ?? 0;
  if (score === 0) return scoreDrill(random);
  return lesson('score', 'Score the hand', start, [
    {
      kind: 'askChoice',
      text: 'Your side bid {bid:us} and has won {won:us}, with one trick to play, and carries {bags:us} bags. If you lose the last trick, does your side score points for the hand or lose them (any ten-bag penalty included)?',
      options: [
        { text: 'It scores points', correct: score > 0, why: score > 0 ? 'Yes: the bid is made.' : 'No: look again at the bid and the bags.' },
        { text: 'It loses points', correct: score < 0, why: score < 0 ? 'Yes.' : 'No: the bid is made, and no penalty comes.' },
      ],
    },
    { kind: 'askNumber', text: 'How many points?', answer: 'score:size', success: 'Yes: {score:now} for the hand.' },
  ]);
}

/** Win cheaply when your side needs tricks; duck when it has enough. */
function trickDrill(random: Random): Lesson {
  for (let tries = 0; ; tries++) {
    const led: Suit = SUITS.filter((s) => s !== TRUMP)[Math.floor(random() * 3)] as Suit;
    const ofSuit = DECK.filter((c) => suitOf(c) === led);
    const trickCards = draw(random, 1 + Math.floor(random() * 3), ofSuit);
    const leader = (4 - trickCards.length) % 4;
    const plays: Play[] = trickCards.map((card, i) => ({ seat: (leader + i) % 4, card }));
    const mine = [...draw(random, 2, ofSuit.filter((c) => !trickCards.includes(c))), ...draw(random, 2, DECK.filter((c) => suitOf(c) !== led))];
    const win = (c: Card) => trickWinner([...plays, { seat: 0, card: c }], TRUMP) === 0;
    const winners = mine.filter((c) => win(c) && suitOf(c) === led);
    const losers = mine.filter((c) => !win(c) && suitOf(c) === led);
    // The partner (seat 2) must not be winning, or both ideas say "play low".
    const partnerWinning = plays.length > 0 && trickWinner(plays, TRUMP) === 2;
    if ((winners.length === 0 || losers.length === 0 || partnerWinning) && tries < 80) continue;
    const used = new Set<Card>([...trickCards, ...mine]);
    const others = [1, 2, 3].map((seat) => {
      const n = 4 - (plays.some((p) => p.seat === seat) ? 1 : 0);
      const cards = draw(random, n, DECK.filter((c) => !used.has(c)));
      for (const c of cards) used.add(c);
      return cards;
    });
    const need = random() < 0.5;
    const bids = [3, 3, 3, 3];
    const won = need ? [2, 2, 2, 3] : [3, 2, 3, 1];
    const start = position({ hands: [mine, ...others], trick: plays, leader, bids, won });
    const cheapest = [...winners].sort((a, b) => rankHigh(a) - rankHigh(b))[0] as Card;
    if (need) {
      const wrong: Record<string, string> = {};
      for (const c of winners) if (c !== cheapest) wrong[c] = `That wins too, but the ${cardShort(cheapest)} wins just as well and keeps your big card.`;
      for (const c of losers) wrong[c] = 'Your side still needs tricks: this one can be won.';
      return lesson('trick', 'Win it or duck it', start, [{ kind: 'askMove', text: 'Your side has {won:us} of the {bid:us} tricks it bid. Win this trick as cheaply as you can.', accept: [cheapest], wrong, claim: 'legal', success: 'Won with the smallest card that does it.' }]);
    }
    const wrong: Record<string, string> = {};
    for (const c of winners) wrong[c] = 'Your side has its tricks: winning this one only adds a bag.';
    return lesson('trick', 'Win it or duck it', start, [{ kind: 'askMove', text: 'Your side has {won:us} tricks and bid {bid:us}: the bid is made. Play a card of the suit led that does not win.', accept: losers, wrong, claim: 'legal', success: 'No bag for your side.' }]);
  }
}

export const SPADES_DRILLS: readonly DrillDef[] = [
  { id: 'drill-spades-count', make: countDrill },
  { id: 'drill-spades-score', make: scoreDrill },
  { id: 'drill-spades-trick', make: trickDrill },
];

export function loadSpadesPractice(): Promise<PracticePack> {
  return Promise.resolve({ problems: [], sets: [], drills: SPADES_DRILLS, attribution: null, game: spadesLessonGame, themeOrder: [] });
}
