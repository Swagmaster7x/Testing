/**
 * American-format mah jongg: the fourth rules file on the shared engine
 * (docs/rules/mahjong-american.md). Hands come from a card (american/card.ts) instead of sets and a
 * pair, so this file decides alone whether a hand is complete (`customShape`). 152 tiles with eight
 * jokers and eight flowers, the Charleston, exposures with jokers, joker exchanges, dead hands, and
 * the League's payments with the jokerless bonus. Every rule tables disagree on is an option.
 */
import type { Seat } from '../../../core/contract';
import type { Card, Exposure, Variant } from '../american/card';
import { amCounts, amKind, cardVariants, completes, fitExposures, JOKERS, parseCard, takesJokers } from '../american/card';
import { PRACTICE_CARD } from '../american/practice-card';
import type { GameStanding, HandScore, Meld, OptionSpec, PassRound, SettleInput, Style, StyleOptions, StyleRules, ValueHints, WinContext } from '../core/style';
import type { Kind } from '../core/tiles';
import { JOKER, kindOf } from '../core/tiles';

export const AMERICAN_OPTIONS: readonly OptionSpec[] = [
  { key: 'card', values: ['practice', 'mine'] },
  { key: 'cardText', values: [], text: true },
  { key: 'secondCharleston', values: ['vote', 'always', 'off'] },
  { key: 'courtesy', values: ['on', 'off'] },
  { key: 'blind', values: ['on', 'off'] },
  { key: 'jokerless', values: ['double', 'off'] },
  { key: 'deadHand', values: ['on', 'learner'] },
  { key: 'payment', values: ['nmjl', 'flat'] },
  { key: 'jokers', values: [8, 10] },
  { key: 'length', values: ['four', 'hand', 'eight', 'sixteen'] },
];

export const AMERICAN_DEFAULTS: StyleOptions = { ...Object.fromEntries(AMERICAN_OPTIONS.map((o) => [o.key, (o.values[0] ?? '')])), cardText: '' };

export const AMERICAN_PRESETS: readonly { readonly id: string; readonly options: StyleOptions }[] = [
  { id: 'american-league', options: AMERICAN_DEFAULTS },
  { id: 'american-quick', options: { ...AMERICAN_DEFAULTS, secondCharleston: 'off', courtesy: 'off' } },
  { id: 'american-learner', options: { ...AMERICAN_DEFAULTS, deadHand: 'learner' } },
  { id: 'american-hand', options: { ...AMERICAN_DEFAULTS, length: 'hand' } },
];

const HANDS: Readonly<Record<string, number>> = { hand: 1, four: 4, eight: 8, sixteen: 16 };

const cards = new Map<string, Card>();
const practice = parseCard(PRACTICE_CARD).card as Card;

/** The card a table plays with: the one typed in when chosen and valid, otherwise the practice card. */
export function cardOf(o: StyleOptions): Card {
  if (o.card !== 'mine' || typeof o.cardText !== 'string' || o.cardText.trim() === '') return practice;
  const hit = cards.get(o.cardText);
  if (hit) return hit;
  const card = parseCard(o.cardText).card ?? practice;
  if (cards.size > 20) cards.clear();
  cards.set(o.cardText, card);
  return card;
}

/** The practice card, read. */
export const PRACTICE: Card = practice;

const jokersOf = (o: StyleOptions): number => (o.jokers === 10 ? 10 : JOKERS);

/** The Charleston as passing rounds: the first (right, across, left), the second (left, across, right), the courtesy pass. */
export function charleston(o: StyleOptions): PassRound[] {
  const blind = o.blind !== 'off';
  const rounds: PassRound[] = [
    { dir: 1, count: 3, group: 1 },
    { dir: 2, count: 3, group: 1 },
    { dir: 3, count: 3, group: 1, blind },
  ];
  if (o.secondCharleston !== 'off') {
    rounds.push({ dir: 3, count: 3, group: 2, vote: o.secondCharleston !== 'always' }, { dir: 2, count: 3, group: 2 }, { dir: 1, count: 3, group: 2, blind });
  }
  if (o.courtesy !== 'off') rounds.push({ dir: 2, count: 3, group: 3, courtesy: true });
  return rounds;
}

function rules(o: StyleOptions): StyleRules {
  const length = String(o.length ?? 'four');
  return {
    tiles: { honours: true, bonus: true, jokers: jokersOf(o) },
    handSize: 13,
    deadWall: 0,
    replaceBonus: false,
    calls: {
      chow: false,
      pung: false,
      kong: false,
      concealedKong: false,
      addedKong: false,
      robKong: false,
      robConcealedWithOrphans: false,
      multipleWinners: false,
      expose: { sizes: [3, 4, 5, 6], refuseDead: o.deadHand === 'learner' },
      jokerSwap: true,
    },
    shapes: { sevenPairs: false, thirteenOrphans: false },
    rounds: length === 'hand' ? 0 : 1,
    handsPerRound: HANDS[length] ?? 4,
    customShape: true,
    passes: { rounds: charleston(o), keep: [JOKER] },
  };
}

/** A meld as an exposure: the kind it stands for (flowers as one), its size and its jokers. */
export function exposureOf(m: Meld): Exposure {
  const natural = m.tiles.map(kindOf).find((k) => k !== JOKER);
  return { kind: amKind(m.kind ?? natural ?? JOKER), size: m.tiles.length, jokers: m.tiles.filter((t) => kindOf(t) === JOKER).length };
}

/** True when these exposures still fit some hand on the card (a hand that fits none is dead). */
export function exposuresFit(melds: readonly Meld[], o: StyleOptions): boolean {
  if (melds.length === 0) return true;
  const exposures = melds.map(exposureOf);
  return cardVariants(cardOf(o), jokersOf(o)).some((v) => !v.hand.concealed && fitExposures(v, exposures) !== null);
}

/** The card hands a complete hand makes, best value first. */
export function matchingHands(ctx: Pick<WinContext, 'concealed' | 'melds'>, o: StyleOptions): Variant[] {
  const { counts, jokers } = amCounts(ctx.concealed);
  const exposures = ctx.melds.map(exposureOf);
  return cardVariants(cardOf(o), jokersOf(o))
    .filter((v) => completes(v, counts, jokers, exposures))
    .sort((a, b) => b.hand.points - a.hand.points);
}

/** The hand's value, with the jokerless bonus. */
function scoreOf(v: Variant, ctx: Pick<WinContext, 'concealed' | 'melds'>, o: StyleOptions): HandScore {
  const anyJoker = ctx.concealed.includes(JOKER) || ctx.melds.some((m) => m.tiles.some((t) => kindOf(t) === JOKER));
  const jokerless = !anyJoker && takesJokers(v.hand) && o.jokerless !== 'off';
  const value = v.hand.points * (jokerless ? 2 : 1);
  const label = `${v.hand.section ? `${v.hand.section}: ` : ''}${v.hand.text}`;
  return {
    lines: [{ id: 'am-hand', value: v.hand.points, label }, ...(jokerless ? [{ id: 'am-jokerless', value: v.hand.points }] : [])],
    raw: value,
    total: value,
    limit: false,
    unit: 'points',
    base: value,
  };
}

/** The best value of a complete hand on the card, or null when it is no hand on the card. */
function score(ctx: WinContext, o: StyleOptions): HandScore | null {
  let best: HandScore | null = null;
  for (const v of matchingHands(ctx, o)) {
    const s = scoreOf(v, ctx, o);
    if (!best || s.total > best.total) best = s;
  }
  return best;
}

function settle(hand: SettleInput, o: StyleOptions): number[] {
  const deltas = new Array<number>(hand.seats).fill(0);
  const pay = (from: Seat, to: Seat, amount: number) => {
    deltas[from] = (deltas[from] ?? 0) - amount;
    deltas[to] = (deltas[to] ?? 0) + amount;
  };
  const flat = o.payment === 'flat';
  for (const w of hand.wins) {
    const v = w.score.base;
    for (let s = 0; s < hand.seats; s++) {
      if (s === w.seat) continue;
      const double = !flat && (w.from === null || s === w.from);
      pay(s, w.seat, double ? 2 * v : v);
    }
  }
  return deltas;
}

function gameOver(st: GameStanding, o: StyleOptions): boolean | null {
  return st.hands >= (HANDS[String(o.length ?? 'four')] ?? 4);
}

/** The CPU plays American from the card (american/bot.ts); these rough values serve the shared coach. */
function hints(): ValueHints {
  return {
    minimum: 0,
    pung: new Array<number>(34).fill(0),
    mixedSuit: 0,
    pureSuit: 0,
    allPungs: 0,
    allChows: 0,
    concealed: 0,
    selfDrawn: 0,
    bonus: 0,
    limit: 100,
    points: Array.from({ length: 101 }, (_, i) => i),
    pay: { selfDrawn: 2, discarder: 2, others: 1 },
  };
}

export const american: Style = {
  id: 'american',
  hints,
  options: AMERICAN_OPTIONS,
  defaults: AMERICAN_DEFAULTS,
  presets: AMERICAN_PRESETS,
  rules,
  score,
  scoreAny: score,
  settle,
  dealerKeeps: () => false,
  gameOver,
  exposuresFit: (melds, o) => exposuresFit(melds, o),
};

/** Kinds as American hands read them (re-exported for the bot and the table). */
export { amKind };
export type { Kind };
