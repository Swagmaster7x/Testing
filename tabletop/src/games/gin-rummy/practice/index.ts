/**
 * Gin Rummy practice: three drills made on the spot, run on the lesson runner: count the deadwood
 * of a hand, choose the discard that leaves the least deadwood (proved by counting), and score a
 * knock with both hands shown.
 */
import type { Lesson } from '../../../teach/lesson';
import type { DrillDef, PracticePack } from '../../practice';
import type { Card } from '../../classic/cards';
import { DECK } from '../../classic/cards';
import { cardAt, deadwood } from '../../classic/melds';
import { ginLessonGame } from '../learn/game';
import { position } from '../rules';

type Random = () => number;

function draw(random: Random, n: number, from: readonly Card[]): Card[] {
  const pool = [...from];
  const out: Card[] = [];
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0] as Card);
  return out;
}

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `gin-rummy.drill.${id}`, gameId: 'gin-rummy', stage: 'table', title, minutes: 1, start, steps };
}

/** A hand of `n` cards with one or two melds in it, as hands look mid-game. */
function meldyHand(random: Random, n: number, avoid: ReadonlySet<Card> = new Set()): Card[] {
  for (;;) {
    const out = new Set<Card>();
    const melds = 1 + Math.floor(random() * 2);
    for (let m = 0; m < melds; m++) {
      if (random() < 0.5) {
        const rank = Math.floor(random() * 13);
        // Three of the four suits: leave one out at random (a sort with a random comparator would
        // depend on the engine, and the drill must be the same everywhere for a seed).
        const suits = [0, 1, 2, 3];
        suits.splice(Math.floor(random() * 4), 1);
        for (const s of suits) out.add(cardAt(s, rank));
      } else {
        const suit = Math.floor(random() * 4);
        const lo = Math.floor(random() * 11);
        for (let r = lo; r < lo + 3; r++) out.add(cardAt(suit, r));
      }
    }
    const rest = draw(random, n - out.size, DECK.filter((c) => !out.has(c) && !avoid.has(c)));
    const hand = [...out, ...rest];
    if (hand.length === n && new Set(hand).size === n && !hand.some((c) => avoid.has(c))) return hand;
  }
}

/** Count the deadwood of a ten-card hand. */
function deadwoodDrill(random: Random): Lesson {
  const me = meldyHand(random, 10);
  const them = draw(random, 10, DECK.filter((c) => !me.includes(c)));
  const pile = draw(random, 1, DECK.filter((c) => !me.includes(c) && !them.includes(c)));
  const start = position({ me, them, discard: pile });
  return lesson('deadwood', 'Count the deadwood', start, [{ kind: 'askNumber', text: 'Find your melds. What does the rest, your deadwood, count? Ace {value:ace}, pictures {value:king}.', answer: 'deadwood:me', success: 'Yes, {deadwood:me}.' }]);
}

/** Throw the card that leaves the least deadwood; drawn so that one card clearly does. */
function discardDrill(random: Random): Lesson {
  for (;;) {
    const me = meldyHand(random, 11);
    const left = me.map((c) => ({ card: c, n: deadwood(me.filter((x) => x !== c)) })).sort((a, b) => a.n - b.n);
    const best = left[0] as { card: Card; n: number };
    if ((left[1]?.n ?? 0) < best.n + 1) continue;
    const them = draw(random, 10, DECK.filter((c) => !me.includes(c)));
    const pile = draw(random, 1, DECK.filter((c) => !me.includes(c) && !them.includes(c)));
    const start = position({ me, them, discard: pile, phase: 'discard' });
    return lesson('discard', 'Which discard?', start, [{ kind: 'askMove', text: 'You hold eleven cards. Throw the one that leaves the least deadwood.', accept: [best.card], claim: 'best', success: 'That leaves {deadwood:me} deadwood: the least you can keep.' }]);
  }
}

/** Score a knock, both hands shown. */
function scoreDrill(random: Random): Lesson {
  for (;;) {
    const me = meldyHand(random, 10);
    if (deadwood(me) > 10) continue;
    const them = meldyHand(random, 10, new Set(me));
    const pile = draw(random, 1, DECK.filter((c) => !me.includes(c) && !them.includes(c)));
    const start = position({ me, them, discard: pile });
    return lesson('score', 'Score the knock', start, [
      { kind: 'askNumber', text: 'You knock with this hand. The other player lays off what they can. How many points does the hand score, for whoever wins it? (Undercut bonus {undercut:bonus}, gin bonus {gin:bonus}.)', answer: 'knock:points', success: 'Yes, {knock:points}: they end with {knock:defender} after laying off.', openHand: true },
    ]);
  }
}

export const GIN_DRILLS: readonly DrillDef[] = [
  { id: 'drill-gin-deadwood', make: deadwoodDrill },
  { id: 'drill-gin-discard', make: discardDrill },
  { id: 'drill-gin-score', make: scoreDrill },
];

export function loadGinPractice(): Promise<PracticePack> {
  return Promise.resolve({ problems: [], sets: [], drills: GIN_DRILLS, attribution: null, game: ginLessonGame, themeOrder: [] });
}
