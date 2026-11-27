/**
 * Hearts practice: three drills made on the spot from a random source, run on the lesson runner:
 * count the points in a trick, duck under the winning card, and choose what to throw when you
 * cannot follow suit.
 */
import type { Lesson } from '../../../teach/lesson';
import type { DrillDef, PracticePack } from '../../practice';
import type { Card, Suit } from '../../classic/cards';
import { DECK, rankHigh, SUITS, suitOf } from '../../classic/cards';
import { cardShort } from '../../classic/names';
import type { Play } from '../../classic/tricks';
import { heartsLessonGame } from '../learn/game';
import { isHeart, position, QUEEN } from '../rules';

type Random = () => number;

const pick = <T>(random: Random, list: readonly T[]): T => list[Math.floor(random() * list.length)] as T;

function draw(random: Random, n: number, from: readonly Card[]): Card[] {
  const pool = [...from];
  const out: Card[] = [];
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0] as Card);
  return out;
}

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `hearts.drill.${id}`, gameId: 'hearts', stage: 'table', title, minutes: 1, start, steps };
}

/**
 * A trick with `played` cards on it (led by the seat `played` places before you), you to play next
 * holding `mine`, the others holding three or four cards: a legal-looking table.
 */
function table(random: Random, trick: readonly Card[], mine: readonly Card[], broken = true): string {
  const used = new Set<Card>([...trick, ...mine]);
  const rest = DECK.filter((c) => !used.has(c));
  const leader = (4 - trick.length) % 4;
  const plays: Play[] = trick.map((card, i) => ({ seat: (leader + i) % 4, card }));
  const others = [1, 2, 3].map((seat) => {
    const playedAlready = plays.some((p) => p.seat === seat);
    return draw(random, mine.length - (playedAlready ? 1 : 0), rest.filter((c) => !used.has(c))).map((c) => {
      used.add(c);
      return c;
    });
  });
  return position({ hands: [[...mine], ...others], trick: plays, leader, broken });
}

/** Count the points in a trick. */
function pointsDrill(random: Random): Lesson {
  const trick = draw(random, 3, random() < 0.5 ? DECK.filter((c) => isHeart(c) || c === QUEEN || random() < 0.3) : DECK);
  const ledSuit = suitOf(trick[0] as Card);
  const mine = draw(random, 4, DECK.filter((c) => !trick.includes(c) && suitOf(c) !== ledSuit));
  const start = table(random, trick, mine);
  return lesson('points', 'Count the trick', start, [{ kind: 'askNumber', text: 'How many points are in this trick so far? Each heart is {points:heart}, the queen of spades {points:queen}.', answer: 'trick:points', success: 'Right: {trick:points}.' }]);
}

/** Duck under the winning card. */
function duckDrill(random: Random): Lesson {
  for (let tries = 0; ; tries++) {
    const suit: Suit = pick(random, SUITS.filter((s) => s !== 'h' || tries > 20));
    const ofSuit = DECK.filter((c) => suitOf(c) === suit);
    const trick = draw(random, 1 + Math.floor(random() * 3), ofSuit);
    const top = Math.max(...trick.map(rankHigh));
    const mineSuit = draw(random, 3, ofSuit.filter((c) => !trick.includes(c)));
    const under = mineSuit.filter((c) => rankHigh(c) < top);
    const over = mineSuit.filter((c) => rankHigh(c) > top);
    if ((under.length === 0 || over.length === 0) && tries < 60) continue;
    const mine = [...mineSuit, ...draw(random, 1, DECK.filter((c) => suitOf(c) !== suit))];
    const start = table(random, trick, mine);
    const winning = trick.find((c) => rankHigh(c) === top) as Card;
    const wrong: Record<string, string> = {};
    for (const c of over) wrong[c] = `The ${cardShort(c)} beats the ${cardShort(winning)}: you would take the trick.`;
    return lesson('duck', 'Duck under', start, [{ kind: 'askMove', text: `The ${cardShort(winning)} is winning. Play a card that stays under it.`, accept: under, wrong, claim: 'legal', success: 'You stay out of the trick.' }]);
  }
}

/** What to throw when you cannot follow suit: the queen of spades, then the highest heart, then the highest card. */
function voidDrill(random: Random): Lesson {
  for (;;) {
    const led: Suit = pick(random, ['c', 'd'] as Suit[]);
    const trick = draw(random, 1 + Math.floor(random() * 3), DECK.filter((c) => suitOf(c) === led));
    const mine = draw(random, 4, DECK.filter((c) => suitOf(c) !== led && !trick.includes(c)));
    if (!mine.some((c) => isHeart(c) || c === QUEEN)) continue;
    const start = table(random, trick, mine);
    const best = mine.includes(QUEEN) ? QUEEN : [...mine].filter(isHeart).sort((a, b) => rankHigh(b) - rankHigh(a))[0];
    if (!best) continue;
    const wrong: Record<string, string> = {};
    for (const c of mine) if (c !== best) wrong[c] = best === QUEEN ? 'Safe, but the queen of spades is the card to get rid of while you can.' : 'Safe, but this is the moment to give away your highest heart.';
    return lesson('void', 'Nothing to follow with', start, [{ kind: 'askMove', text: 'You cannot follow suit, so this trick will go to someone else. Throw the card you most want rid of.', accept: [best], wrong, claim: 'legal', success: 'Points thrown on someone else’s trick are points you will never take.' }]);
  }
}

export const HEARTS_DRILLS: readonly DrillDef[] = [
  { id: 'drill-hearts-points', make: pointsDrill },
  { id: 'drill-hearts-duck', make: duckDrill },
  { id: 'drill-hearts-void', make: voidDrill },
];

export function loadHeartsPractice(): Promise<PracticePack> {
  return Promise.resolve({ problems: [], sets: [], drills: HEARTS_DRILLS, attribution: null, game: heartsLessonGame, themeOrder: [] });
}
