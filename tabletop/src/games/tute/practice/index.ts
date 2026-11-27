/**
 * Tute practice: four generated drills on the lesson runner. Which cards may you play (the
 * obligations), who is winning the trick, count a finished hand (cards, cantes and the last ten),
 * and what your hand can sing. Every answer is computed by the rules module.
 */
import type { Lesson } from '../../../teach/lesson';
import type { DrillDef, PracticePack } from '../../practice';
import { tuteLessonGame } from '../learn/game';
import type { Card, Cante, PlayedCard, Suit, TuteConfig, TuteState } from '../rules';
import { canteValue, DECK, obligations, position, SPAIN_PAIRS, SUITS, suitOf, trickWinner, tute } from '../rules';
import { cardName, suitName } from '../ui/names';

const SEAT_WORD = ['you', 'Right', 'your partner', 'Left'];

function draw(random: () => number, n: number, from: readonly Card[] = DECK): Card[] {
  const pool = [...from];
  const out: Card[] = [];
  while (out.length < n && pool.length > 0) out.push(pool.splice(Math.floor(random() * pool.length), 1)[0] as Card);
  return out;
}

const pickSuit = (random: () => number): Suit => SUITS[Math.floor(random() * SUITS.length)] as Suit;
const pick = <T>(random: () => number, items: readonly T[]): T => items[Math.floor(random() * items.length)] as T;

function lesson(id: string, title: string, start: string, steps: Lesson['steps']): Lesson {
  return { id: `tute.drill.${id}`, gameId: 'tute', stage: 'table', title, minutes: 1, start, steps };
}

const ONE_HAND: Partial<TuteConfig> = { matchTo: 1 };

/**
 * A trick in progress at a table of four: seats 1 to 3 (or fewer) have played legal cards from
 * random hands, and seat 0 is to play. Hands hold `size` cards before the trick.
 */
function trickInProgress(random: () => number, size: number, played: number): { text: string; state: TuteState } {
  for (;;) {
    const trump = pickSuit(random);
    const cards = draw(random, size * 4);
    const hands = [0, 1, 2, 3].map((k) => cards.slice(k * size, k * size + size));
    const leader = (4 - played) % 4;
    const plays: PlayedCard[] = [];
    let ok = true;
    for (let i = 0; i < played; i++) {
      const seat = (leader + i) % 4;
      const hand = hands[seat] as Card[];
      const allowed = obligations({ hand, trick: plays, trumpSuit: trump, config: SPAIN_PAIRS, duty: 'full', seat }).allowed;
      if (allowed.length === 0) {
        ok = false;
        break;
      }
      const card = pick(random, allowed);
      plays.push({ seat, card });
      hands[seat] = hand.filter((c) => c !== card);
    }
    if (!ok) continue;
    const text = position({ trump, hands, trick: plays, leader, lastWinner: leader, canteOpen: false, config: ONE_HAND });
    return { text, state: tute.codec.state.fromText(text) };
  }
}

/** Which cards may you play? Count them, the obligations in your head. */
function playDrill(random: () => number): Lesson {
  for (let tries = 0; ; tries++) {
    const { text, state } = trickInProgress(random, 4 + Math.floor(random() * 4), 1 + Math.floor(random() * 3));
    const allowed = obligations({ hand: state.hands[0] ?? [], trick: state.trick, trumpSuit: state.trumpSuit, config: state.config, duty: 'full', seat: 0 }).allowed;
    // Ask when the rules actually cut the hand down.
    if (allowed.length === (state.hands[0] ?? []).length && tries < 40) continue;
    return lesson('play', 'Which cards may you play?', text, [
      {
        kind: 'askNumber',
        text: `${suitName(state.trumpSuit)[0]?.toUpperCase()}${suitName(state.trumpSuit).slice(1)} are trumps. Follow suit and beat if you can; if you cannot follow, trump, beating any trump already down. How many of your cards may you play?`,
        answer: 'legal:count',
        success: 'Yes, {legal:count}. Each of the others would break a duty: follow, beat, or trump.',
      },
    ]);
  }
}

/** Who is winning the trick so far? */
function trickDrill(random: () => number): Lesson {
  const { text, state } = trickInProgress(random, 3 + Math.floor(random() * 4), 2 + Math.floor(random() * 2));
  const winner = trickWinner(state.trick, state.trumpSuit);
  const seats = state.trick.map((p) => p.seat);
  const trumpName = suitName(state.trumpSuit);
  return lesson('trick', 'Who is winning the trick', text, [
    {
      kind: 'askChoice',
      text: `${trumpName[0]?.toUpperCase()}${trumpName.slice(1)} are trumps. Who is winning this trick so far?`,
      options: seats.map((seat) => {
        const card = state.trick.find((p) => p.seat === seat)?.card as Card;
        const who = SEAT_WORD[seat] ?? '';
        return seat === winner
          ? { text: `${who[0]?.toUpperCase()}${who.slice(1)}, with the ${cardName(card)}`, correct: true, why: suitOf(card) === state.trumpSuit ? 'Yes: the highest trump wins.' : 'Yes: no trump, and it is the highest card of the suit led.' }
          : { text: `${who[0]?.toUpperCase()}${who.slice(1)}, with the ${cardName(card)}`, why: suitOf(card) !== suitOf(state.trick[0]?.card ?? card) && suitOf(card) !== state.trumpSuit ? 'No: a card of another plain suit never wins.' : 'No: a higher card of the suit led, or a trump, is down.' };
      }),
    },
  ]);
}

/** Count a finished hand: the last trick is played, then add up your side's cards, cantes and the last ten. */
function countDrill(random: () => number): Lesson {
  const trump = pickSuit(random);
  // The last trick: four cards of one suit, so every card is allowed.
  const suit = pickSuit(random);
  const lastCards = draw(random, 4, DECK.filter((c) => suitOf(c) === suit));
  const rest = DECK.filter((c) => !lastCards.includes(c));
  const shuffled = draw(random, rest.length, rest);
  const tricks = shuffled.length / 4;
  const ours = 2 + Math.floor(random() * (tricks - 3));
  const won: Card[][] = [shuffled.slice(0, ours * 4), shuffled.slice(ours * 4)];
  const cantes: Cante[] = [];
  for (const s of SUITS) if (random() < 0.3) cantes.push({ seat: Math.floor(random() * 4), suit: s, points: canteValue(s, trump) });
  const text = position({ trump, hands: lastCards.map((c) => [c]), leader: 0, lastWinner: 0, won, cantes, canteOpen: false, config: ONE_HAND });
  const sung = cantes.length === 0 ? 'Nobody sang this hand.' : `Sung this hand: ${cantes.map((c) => `${SEAT_WORD[c.seat]} in ${suitName(c.suit)}`).join(', ')}.`;
  return lesson('count', 'Count the hand', text, [
    { kind: 'show', text: 'The last trick is played.', moves: lastCards },
    { kind: 'askNumber', text: `Your side’s tricks are face up. ${sung} How many points did your side make, with the last ten and your side’s cantes?`, answer: 'result:us', success: 'Right: {result:us}.', openPiles: true },
  ]);
}

/** What can your hand sing? Add up the pairs: plain and trumps. */
function cantesDrill(random: () => number): Lesson {
  const trump = pickSuit(random);
  // Two or three pairs at random, then the rest of the hand.
  const pairs = draw(random, 1 + Math.floor(random() * 3), SUITS.map((s): Card => `R${s}`)).map((c) => suitOf(c));
  const pairCards = pairs.flatMap((s): Card[] => [`R${s}`, `C${s}`]);
  const others = draw(random, 10 - pairCards.length, DECK.filter((c) => !pairCards.includes(c)));
  const mine = [...pairCards, ...others];
  const rest = DECK.filter((c) => !mine.includes(c));
  const hands = [mine, rest.slice(0, 10), rest.slice(10, 20), rest.slice(20, 30)];
  const text = position({ trump: trump, hands, leader: 0, canteOpen: false, config: ONE_HAND });
  const trumpName = suitName(trump);
  return lesson('cantes', 'Cantes', text, [
    {
      kind: 'askNumber',
      text: `${trumpName[0]?.toUpperCase()}${trumpName.slice(1)} are trumps. If your side wins enough tricks to sing every pair you hold, how many points can you sing?`,
      answer: 'hand:cantes',
      success: 'Yes, {hand:cantes}: the veinte for each plain pair, the cuarenta for a pair in trumps.',
    },
  ]);
}

export function loadTutePractice(): Promise<PracticePack> {
  const drills: DrillDef[] = [
    { id: 'drill-tute-play', make: playDrill },
    { id: 'drill-tute-trick', make: trickDrill },
    { id: 'drill-tute-count', make: countDrill },
    { id: 'drill-tute-cantes', make: cantesDrill },
  ];
  return Promise.resolve({ problems: [], sets: [], drills, attribution: null, game: tuteLessonGame, themeOrder: [] });
}
