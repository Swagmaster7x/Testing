/**
 * Hold'em lessons: stage 0 (what the game is and how a hand is won), stage 1 (the rules), stage 2
 * (first strategy: starting hands, position, pot odds, outs, equity), stage 3 (core skills: ranges,
 * re-raises, reading players, sizing, short stacks, river calls) and the Table-ready track. All prose is original. Numbers are {placeholders} computed from the rules, the evaluator,
 * the equity code and the strategy modules (see game.ts); "best" claims are proved by equity and
 * pot-odds arithmetic (see verify.ts), against the real cards when a step shows every hand, or
 * against the range the position assumes. Play chips only.
 *
 * You sit in seat 0, at the bottom of the table. Every position is a real hand: dealt from a
 * stacked deck and played through the rules (`lessonPosition`, `after`), the last hand of a short
 * session so the table stops when it ends. Answers that follow the opening chart are worked out
 * from preflop.ts (`chart`), so a lesson cannot disagree with the coach or the computer players.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Card } from '../cards';
import { handClass } from '../cards';
import { inTop, openFraction } from '../preflop';
import type { SeatStats } from '../rules';
import { dealtOrder, holdem, positionName, PRESETS, raiseRange, SIX_MAX_CASH } from '../rules';
import { after, lessonPosition, pokerLessonGame } from './game';
import { assume } from './ranges';

const h = (text: string): Card[] => text.split(' ') as Card[];

/** Raises (or bets) to between `lo` and `hi` chips, in notation: answers where any sensible size counts. */
function raises(at: string, lo: number, hi: number): string[] {
  const s = pokerLessonGame.position(at);
  const out = pokerLessonGame.moves(s).filter((m) => m.startsWith('r') && Number(m.slice(1)) >= lo && Number(m.slice(1)) <= hi);
  if (out.length === 0) throw new Error(`Hold'em lesson: no raise from ${lo} to ${hi} here`);
  return out;
}

function rangeFor(at: string): { min: number; max: number } {
  const s = pokerLessonGame.position(at);
  const r = s.toAct === null ? null : raiseRange(s, s.toAct);
  if (!r) throw new Error("Hold'em lesson: no raise is possible here");
  return r;
}

/** The smallest raise for the player to act, in notation. */
const minRaise = (at: string): string => `r${rangeFor(at).min}`;
/** The all-in raise for the player to act, in notation. */
const allIn = (at: string): string => `r${rangeFor(at).max}`;

/**
 * The opening chart's answer for your hand, first in: raises of two to four big blinds when the
 * hand is in the range for your seat, else fold. Throws when the chart disagrees with `expect`,
 * so the lesson text and the chart can never part ways.
 */
function chart(at: string, expect: 'raise' | 'fold'): string[] {
  const s = pokerLessonGame.position(at);
  const hole = s.players[0]?.hole ?? [];
  const cls = handClass(hole[0] as Card, hole[1] as Card);
  const pos = positionName(s, 0);
  const inRange = inTop(cls, openFraction(pos, dealtOrder(s).length));
  if (inRange !== (expect === 'raise')) throw new Error(`Hold'em lesson: by the chart ${cls} is ${inRange ? 'a raise' : 'a fold'} from ${pos}`);
  const bb = s.blinds.bb;
  return expect === 'raise' ? raises(at, 2 * bb, 4 * bb) : ['fold'];
}

/** A position with session statistics per seat: [hands played by choice, raised before the flop, bets and raises after it, calls after it], over `hands` hands. */
function withStats(at: string, hands: number, rows: readonly (readonly [number, number, number, number])[]): string {
  const s = holdem.codec.state.fromText(at);
  const stats: SeatStats[] = s.players.map((_, seat) => {
    const [vpip, pfr, aggressive, passive] = rows[seat] ?? [0, 0, 0, 0];
    return { hands, vpip, pfr, threeBet: 0, threeBetChances: 0, aggressive, passive, sawFlop: vpip, showdowns: 0, wonShowdown: 0 };
  });
  return holdem.codec.state.toText({ ...s, stats });
}

// Action scripts. With the button in seat 0 (you), the order before the flop is seats 3, 4, 5,
// you, 1 (small blind), 2 (big blind); after it, seat 1 first and you last. Heads-up hands are
// against Beto in the small blind: the table draws his cards above his name, clear of the labels.
/** Three folds, you raise on the button, the small blind calls and the big blind folds. */
const BTN_VS_SB = ['fold', 'fold', 'fold', 'r5', 'call', 'fold'];
/** ...then checked to the river, where the small blind checks to you. */
const TO_RIVER = [...BTN_VS_SB, 'check', 'check', 'check', 'check', 'check'];

/** A heads-up hand on the button against Beto in the small blind; `stack` is Beto's, if short. */
const buttonHand = (you: string, beto: string | null, board: string, actions: readonly string[], extra: { stack?: number; seed?: string } = {}): string =>
  lessonPosition({ button: 0, stacks: [200, extra.stack ?? 200, 200, 200, 200, 200], holes: [h(you), beto ? h(beto) : null, null, null, null, null], board: h(board), actions, ...(extra.seed ? { seed: extra.seed } : {}) });

// Stage 0 positions

/** A hand on the button against the small blind, from the deal. */
const DEAL = lessonPosition({ button: 0, holes: [h('Ah Qh'), h('Kc Jc'), null, null, null, null], board: h('Qs 7h 2c 9d 3s') });
const HEADS_UP = lessonPosition({ seats: 2, button: 0, holes: [h('Ah Qh'), h('Kc Jc')] });
/** Diego raises under the gun; you hold a pair of nines on the button. */
const FACING_RAISE = lessonPosition({ button: 0, holes: [h('9s 9d'), null, null, h('Ac Kh'), null, null], board: h('Kd 7c 2h 9c 4s'), actions: ['r6', 'fold', 'fold'] });
/** In the cutoff, after a raise under the gun and a fold. */
const MIN_RAISE = lessonPosition({ button: 1, holes: [h('Ac Qc'), null, null, null, null, null], actions: ['r6', 'fold'] });
const ON_THE_FLOP = after(DEAL, BTN_VS_SB.join(' '));

const R_FLUSH = buttonHand('Ah 4h', 'Tc 6s', 'Kh 9h 8c 7h 2d', TO_RIVER);
const R_BOAT = buttonHand('9c 9d', 'Ah Jh', '9h 5h 5c Kh 2h', TO_RIVER);
const R_SET = buttonHand('Kc Qd', '4h 4d', 'Ks Qh 4c 8d 2s', TO_RIVER);
const R_QUADS = buttonHand('6c 6d', 'Ad Ah', '6h 6s Ac Kd 2c', TO_RIVER);
const K_KICKER = buttonHand('As Kd', 'Ac Jh', 'Ah 9c 6d 4s 2c', TO_RIVER);
const K_BOARD = buttonHand('Ad 2d', 'Kc Qh', '5c 6d 7h 8s 9c', TO_RIVER);
const K_TWO_PAIR = buttonHand('Ac 2d', 'Qc Jd', 'Kc Kd 8h 8s 3c', TO_RIVER);
/** Beto bets the river into you. */
const RIVER_BET = buttonHand('Ah Qd', 'Qc Jc', 'Qs 7h 2c Jd 3s', [...BTN_VS_SB, 'check', 'check', 'check', 'check', 'r8']);
/** Félix opens, you and Beto call; Félix folds the flop, and you and Beto hold the same straight. The pot is odd. */
const SPLIT = buttonHand('Jh 7c', 'Jc 7d', 'Ts 9d 8c 2h 3s', ['fold', 'fold', 'r5', 'call', 'call', 'fold', 'check', 'check', 'r4', 'call', 'fold', 'check', 'check', 'check']);
/** Carmen all-in short, Diego raises, you call in the small blind. */
const SIDE_POTS = lessonPosition({ button: 5, stacks: [200, 200, 40, 200, 200, 200], holes: [h('Jc Jd'), null, h('Ac Ad'), h('Ah Ks'), null, null], board: h('7c 5d 2h 9s 3c'), actions: ['r40', 'r100', 'fold', 'fold'] });

// Stage 1 positions

const UNDER_THE_GUN = lessonPosition({ button: 3, holes: [h('7c 2d'), null, null, null, null, null] });
const KT_UTG = lessonPosition({ button: 3, holes: [h('Kh Td'), null, null, null, null, null] });
const KT_CO = lessonPosition({ button: 1, holes: [h('Kh Td'), null, null, null, null, null], actions: ['fold', 'fold'] });
/** Beto, short-stacked, moves all-in on the turn against your two draws. */
const POT_ODDS = buttonHand('Jh Th', 'Kc Qd', 'Kh 9h 2c 8d 7c', [...BTN_VS_SB, 'check', 'r8', 'call', 'r14'], { stack: 27 });
const FLUSH_DRAW = buttonHand('Ah 7h', null, 'Kh 9h 2c 5s Jd', [...BTN_VS_SB, 'check']);
const FLUSH_DRAW_TURN = after(FLUSH_DRAW, 'check check');
const OPEN_ENDED = buttonHand('9s 8d', null, '7c 6h 2d Kc 3h', [...BTN_VS_SB, 'check']);
const GUTSHOT = buttonHand('9s 8d', null, 'Jc 7h 2d Kc 3h', [...BTN_VS_SB, 'check']);
const COMBO_DRAW = buttonHand('Jh Th', null, 'Qh 9h 2c 4s 5d', [...BTN_VS_SB, 'check']);
/** You open on the button; Beto re-raises with a pair of queens, and the big blind folds. */
const EQUITY_PRE = buttonHand('Ac Kc', 'Qs Qh', '7d 7s 2h 9c 4c', ['fold', 'fold', 'fold', 'r5', 'r15', 'fold']);
const EQUITY_FLOP = buttonHand('Ks Qd', 'Ah 5h', 'Kh 8h 3c 2s 9d', [...BTN_VS_SB, 'check']);
/** Your flush draw against top pair: you bet the flop and Beto raises all-in. */
const EQUITY_CALL = buttonHand('Th 9h', 'Qs Js', 'Qh 7h 3c 6d Kd', [...BTN_VS_SB, 'check', 'r6', 'r20'], { stack: 25 });
const VALUE = buttonHand('9c 8c', 'Ks Jd', 'Tc 7d 2s 6h Kd', TO_RIVER);
const MIDDLING = buttonHand('Qd Td', 'Ah Kh', 'Ks Qh 4c 7d 2s', TO_RIVER);
const C_BET = buttonHand('Ah Jh', '9s 8s', 'Kc 7d 2s 5h 3d', [...BTN_VS_SB, 'check']);
/** Beto, a rock, moves all-in on the turn into your top pair. */
const ROCK_SHOVE = buttonHand('Ks Qs', 'Kc Jc', 'Kh Jd 2c 4h 9s', [...BTN_VS_SB, 'check', 'r6', 'call', 'r109'], {
  stack: 120,
  seed: assume({ value: 'KK,JJ,44,22,KJs,KJo,K4s,K2s,J4s,J2s,42s' }),
});

// Stage 2 positions

const SUITED_UTG = lessonPosition({ button: 3, holes: [h('9h 8h'), null, null, null, null, null] });
const SUITED_CO = lessonPosition({ button: 1, holes: [h('9h 8h'), null, null, null, null, null], actions: ['fold', 'fold'] });
const OFFSUIT_BTN = lessonPosition({ button: 0, holes: [h('Qd 9c'), null, null, null, null, null], actions: ['fold', 'fold', 'fold'] });
/** Félix opens from the cutoff; you hold a pair of queens on the button. */
const THREE_BET = lessonPosition({ button: 0, holes: [h('Qc Qd'), null, null, null, null, h('Ah Jd')], board: h('8s 4d 2c Kh 7s'), actions: ['fold', 'fold', 'r5'] });
/** Diego raises under the gun; you hold king-jack offsuit on the button. */
const KJ_VS_UTG = lessonPosition({ button: 0, holes: [h('Kd Jc'), null, null, null, null, null], actions: ['r6', 'fold', 'fold'] });
/** Forty hands into a session, with each player's statistics. */
const STATS = withStats(lessonPosition({ button: 0, holes: [] }), 40, [
  [10, 8, 6, 4],
  [8, 7, 9, 4],
  [26, 3, 2, 18],
  [4, 2, 1, 3],
  [24, 18, 22, 5],
  [14, 11, 12, 6],
]);
/** A re-raised pot: you have top pair, best kicker, on a board full of draws. */
const SIZING = lessonPosition({ button: 0, holes: [h('Ah Kh'), null, null, null, null, h('Jd Tc')], board: h('Kd 9d 8c 3s 2h'), actions: ['fold', 'fold', 'r5', 'r15', 'fold', 'fold', 'call', 'check'] });
/** Your open-ended straight draw facing a bet on the turn, deep stacks behind. */
const IMPLIED = buttonHand('9s 8s', 'Kd Qh', 'Kc 7d 6h 2c Ts', [...BTN_VS_SB, 'check', 'check', 'r8']);
/** Folded to your short stack in the small blind. */
const shortStack = (hole: string, calls: string) =>
  lessonPosition({ button: 5, stacks: [16, 200, 200, 200, 200, 200], holes: [h(hole), null, null, null, null, null], actions: ['fold', 'fold', 'fold', 'fold'], seed: assume({ value: calls }) });
const PUSH = shortStack('Kc 9d', 'top:0.25');
const NO_PUSH = shortStack('7c 2d', 'top:0.5');
/** A river all-in into your pair of kings, from the maniac and from the rock. */
const RIVER_VALUE = 'AhQh,AhJh,AhTh,QhJh,QhTh,JhTh,88,77,44,AK,KQ';
const riverShove = (raiser: 3 | 4, holes: string, bluffs: string) => {
  const pre = raiser === 3 ? ['r6', 'fold', 'fold'] : ['fold', 'r6', 'fold'];
  const all: (Card[] | null)[] = [h('Kc Jc'), null, null, null, null, null];
  all[raiser] = h(holes);
  const stacks = [200, 200, 200, 200, 200, 200];
  stacks[raiser] = 51;
  return lessonPosition({ button: 0, stacks, holes: all, board: h('Kh 8h 4d 2s 7h'), actions: [...pre, 'call', 'fold', 'fold', 'r10', 'call', 'check', 'check', 'r35'], seed: assume({ value: RIVER_VALUE, bluff: bluffs }) });
};
const MANIAC_SHOVE = riverShove(4, 'Qs Ts', 'QTo,J9o,T9o,A5o,A3o');
const ROCK_RIVER = riverShove(3, 'Ah Th', 'J9o');

// Table-ready positions

const OUT_OF_TURN = lessonPosition({ button: 0, holes: [h('7d 2c'), null, null, null, null, null] });
const DECLARE = lessonPosition({ button: 0, holes: [h('Ad Kd'), null, null, null, null, null], actions: ['r6', 'fold', 'fold'] });
/** The board makes you a straight you might not notice; Beto bets the river. */
const CARDS_SPEAK = buttonHand('6c 2d', 'Kd Qs', '5h 4s 3d Kc 9s', [...BTN_VS_SB, 'check', 'check', 'check', 'check', 'r8']);
/** Level four of a sit-and-go: blinds and a big blind ante. */
const BLIND_CLOCK = lessonPosition({ config: PRESETS['sit-and-go'] ?? SIX_MAX_CASH, handNo: 31, button: 0, stacks: [1200, 2100, 800, 1500, 2600, 800], holes: [] });
/** The home-game preset: antes and a live straddle. */
const HOME_GAME = lessonPosition({ config: { ante: 'ante', straddle: 'live' }, button: 0, holes: [] });

// The other games on the same engine (docs/rules/poker-variants.md).
/** Pot-limit Omaha, you on the button with four hearts; the flop will not make a flush. */
const OMAHA = lessonPosition({ config: { game: 'omaha', betting: 'pot-limit' }, button: 0, holes: [h('Ah Kh Qh Jh')], board: h('Th 2c 3d 4s 9h') });
/** Five-card draw at three seats, you on the button with a pair of kings. */
const DRAW = lessonPosition({ config: { game: 'draw', betting: 'fixed-limit' }, seats: 3, button: 0, holes: [h('Ks Kd 7c 4h 2s'), h('Ah Qh 9h 3h 2c'), h('Jc Jd Js 8c 5d')], next: h('Kc Qd 6s 9d Th 3c 5s') });
/** Seven-card stud at three seats: you show the two of clubs, the lowest card. */
const STUD = lessonPosition({
  config: { game: 'stud', betting: 'fixed-limit' },
  seats: 3,
  button: 2,
  holes: [h('9c 9d'), h('As Ad'), h('5h 6h')],
  ups: [h('2c 4h 7d Ts'), h('Kc Kd 3s 4c'), h('8d 3h 8s 8h')],
  downs: [h('9h')[0] ?? null, h('Ah')[0] ?? null, h('Jc')[0] ?? null],
});

export const POKER_LESSONS: readonly Lesson[] = [
  // Stage 0, the basics: what the game is and how a hand is won
  {
    id: 'poker.0.game',
    gameId: 'poker',
    stage: 'stage-0',
    title: 'Hold’em in a minute',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Texas Hold’em uses one pack of {deck} cards. Each player is dealt {hole} cards face down, their hole cards. Yours are at the bottom of the table; nobody else sees them.' },
      { kind: 'say', text: 'Then {board:cards} shared cards come face up in the middle, the board. Your hand is the best {hand:cards} cards you can make from your {hole} and the board’s {board:cards}.' },
      { kind: 'show', text: 'Watch the first round of betting. Three players fold, you raise, the small blind calls and the big blind folds.', moves: BTN_VS_SB },
      { kind: 'say', text: 'Only you and {name:1} are left. The first three board cards, the flop, are out, and the pot holds {pot}. Every new card brings another round of betting.' },
      { kind: 'show', text: '{name:1} checks, you bet, he calls. The turn and the river come, and both of you check.', moves: ['check', 'r6', 'call', 'check', 'check', 'check', 'check'] },
      {
        kind: 'askChoice',
        text: 'Both hands are turned up: you have {hand}, {name:1} has {hand:1}. Who wins the pot?',
        options: [
          { text: 'You: any pair beats a high card', correct: true, why: 'Yes. Your pair of queens beats his king high, so the pot is yours.' },
          { text: '{name:1}: his king is higher than your queen', why: 'Single cards only count when nobody has anything better. You have a pair.' },
          { text: 'Nobody: the pot is split', why: 'A pot is split only when the best hands are equal.' },
        ],
      },
    ],
  },
  {
    id: 'poker.0.ranking',
    gameId: 'poker',
    stage: 'stage-0',
    title: 'Which hand wins',
    minutes: 4,
    start: R_FLUSH,
    steps: [
      { kind: 'say', text: 'There are {categories} kinds of hand. Best first: straight flush, four of a kind, full house, flush, straight, three of a kind, two pair, one pair, high card. A better kind always wins.' },
      { kind: 'say', text: 'A straight is five ranks in a row; a flush, five cards of one suit; both at once, a straight flush (ace high, a royal flush). A full house is three of a kind with a pair. The ace plays high, or low in ace-two-three-four-five. Suits never rank.' },
      {
        kind: 'askChoice',
        openHand: true,
        text: 'Cards up: you have {hand}, {name:1} has {hand:1}. Who wins?',
        options: [
          { text: 'You: a flush beats a straight', correct: true, why: 'Yes. A flush is harder to make, so it ranks higher.' },
          { text: '{name:1}: a straight beats a flush', why: 'The other way round: the flush is higher.' },
          { text: 'A split pot', why: 'Only equal hands split. A flush and a straight are different kinds.' },
        ],
      },
      {
        kind: 'checkpoint',
        openHand: true,
        text: 'Three more. One try each.',
        questions: [
          {
            kind: 'askChoice',
            position: R_BOAT,
            openHand: true,
            text: 'You have {hand}; {name:1} has {hand:1}. Who wins?',
            options: [
              { text: 'You', correct: true, why: 'Yes: a full house beats a flush.' },
              { text: '{name:1}', why: 'A full house beats a flush.' },
              { text: 'A split pot', why: 'A full house beats a flush.' },
            ],
          },
          {
            kind: 'askChoice',
            position: R_SET,
            openHand: true,
            text: 'You have {hand}; {name:1} has {hand:1}. Who wins?',
            options: [
              { text: 'You', why: 'Three of a kind beats two pair, even three small cards.' },
              { text: '{name:1}', correct: true, why: 'Yes: three of a kind beats two pair, even three small cards.' },
              { text: 'A split pot', why: 'Three of a kind beats two pair.' },
            ],
          },
          {
            kind: 'askChoice',
            position: R_QUADS,
            openHand: true,
            text: 'You have {hand}; {name:1} has {hand:1}. Who wins?',
            options: [
              { text: 'You', correct: true, why: 'Yes: four of a kind beats a full house.' },
              { text: '{name:1}', why: 'Four of a kind beats a full house, even aces full.' },
              { text: 'A split pot', why: 'Four of a kind beats a full house.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'poker.0.best-five',
    gameId: 'poker',
    stage: 'stage-0',
    title: 'Best five, kickers and the board',
    minutes: 3,
    start: K_KICKER,
    steps: [
      { kind: 'say', text: 'You play the best {hand:cards} of your {cards:all} cards: both hole cards, one of them, or none. When two hands are the same kind, the higher ranks in it win, then the other cards, the kickers.' },
      {
        kind: 'askChoice',
        openHand: true,
        text: 'You both have a pair of aces. Who wins?',
        options: [
          { text: 'You: your king outranks his jack', correct: true, why: 'Yes. Ace, ace, king, nine, six beats ace, ace, jack, nine, six: the king is your kicker.' },
          { text: '{name:1}: he has the ace of clubs', why: 'Suits never count. The kickers decide: your king beats his jack.' },
          { text: 'A split pot: both have aces', why: 'Same pair, so the next cards decide, and your king beats his jack.' },
        ],
      },
      {
        kind: 'askChoice',
        position: K_BOARD,
        openHand: true,
        text: 'The board alone is {board:hand}. Who wins?',
        options: [
          { text: 'A split pot: both play the board', correct: true, why: 'Yes. Neither of you can make a better five than the board, so you share the pot.' },
          { text: 'You: you hold an ace', why: 'The ace does not fit the straight, and your best five are the board’s.' },
          { text: '{name:1}: his cards are higher', why: 'His king and queen do not fit the straight either. Both hands are the board.' },
        ],
      },
      {
        kind: 'askChoice',
        position: K_TWO_PAIR,
        openHand: true,
        text: 'Both of you have {hand}, from the board. Who wins?',
        options: [
          { text: 'You: your ace is the fifth card', correct: true, why: 'Yes. Two pair uses only four cards; the fifth, your ace, beats his queen.' },
          { text: '{name:1}: he holds two cards that are close', why: 'His queen and jack do not pair the board, so only the queen plays, as his fifth card.' },
          { text: 'A split pot', why: 'The two pair are equal, but your ace beats his queen as the fifth card.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'poker.1.blinds',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'The button and the blinds',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'The D beside your name is the dealer button. It marks the dealer’s seat and moves one seat to the left after every hand.' },
      { kind: 'say', text: 'Before the cards come, the two players on the button’s left put in forced bets, the blinds: {name:1} the small blind of {sb}, {name:2} the big blind of {bb}. They give everyone something to play for.' },
      { kind: 'askNumber', text: 'How many chips are in the pot before anyone acts?', answer: 'pot', success: 'Yes, {pot}: the two blinds.' },
      {
        kind: 'askChoice',
        text: 'Who acts first before the flop?',
        options: [
          { text: '{name:3}, on the big blind’s left', correct: true, why: 'Yes. The blinds already have chips in, so the betting starts after them and they act last before the flop.' },
          { text: '{name:1}, the small blind', why: 'The blinds act last before the flop. After the flop, the first player still in on the button’s left starts.' },
          { text: 'You, on the button', why: 'The button acts last after the flop, and late before it.' },
        ],
      },
      { kind: 'say', position: HEADS_UP, text: 'With only two players it changes: the button posts the small blind and acts first before the flop, then last on every later round.' },
      {
        kind: 'askChoice',
        text: 'Heads-up, you have the button. Who acts first before the flop?',
        options: [
          { text: 'You', correct: true, why: 'Right: heads-up, the button is the small blind and acts first before the flop.' },
          { text: '{name:1}, the big blind', why: 'Not heads-up: the big blind acts first only after the flop.' },
        ],
      },
    ],
  },
  {
    id: 'poker.1.actions',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'Fold, check, call, bet or raise',
    minutes: 3,
    start: FACING_RAISE,
    steps: [
      { kind: 'say', text: 'On your turn you have up to three choices. Fold: give up the hand and any chips you have put in. Call: put in enough to match the biggest bet. Raise: put in more, so the others must match you or fold.' },
      { kind: 'askMove', text: '{name:3} raised to {current}. Match it: call.', accept: ['call'], claim: 'legal', success: 'You put in {call} to match. The blinds fold, and the flop comes.', reply: 'fold fold check' },
      { kind: 'askMove', text: 'Nobody has bet on the flop: {name:3} checked. Check too, which passes your turn without betting.', accept: ['check'], claim: 'legal', success: 'Both of you checked, so the turn comes.', reply: 'r10' },
      { kind: 'askMove', text: 'The turn gives you three nines. {name:3} bets {current}. Raise: tap Raise, choose a size, and confirm.', accept: raises(after(FACING_RAISE, 'call fold fold check check r10'), 20, 60), wrong: { call: 'Calling is allowed, but with three nines make him pay more: raise.', fold: 'Three nines is a strong hand. Raise.' }, claim: 'legal', success: 'A raise. Now {name:3} must call your raise, raise again, or fold.', reply: 'fold' },
      {
        kind: 'askChoice',
        text: '{name:3} folded, so the pot is yours without a showdown. When may a player check?',
        options: [
          { text: 'Only when nobody has bet in this round', correct: true, why: 'Yes. Once someone bets, you must call, raise or fold.' },
          { text: 'Whenever it is their turn', why: 'Not after a bet: then you must call, raise or fold.' },
          { text: 'Only on the river', why: 'You may check on any round where nobody has bet yet.' },
        ],
      },
    ],
  },
  {
    id: 'poker.1.min-raise',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'The smallest raise',
    minutes: 3,
    start: MIN_RAISE,
    steps: [
      { kind: 'say', text: 'No-limit means you may bet all your chips at any time. But there is a smallest size: a bet is at least the big blind, and a raise must add at least as much as the last bet or raise in the same round.' },
      { kind: 'say', text: 'The big blind is {bb}. {name:4} raised to {current}, adding {min-raise:by}.' },
      { kind: 'askNumber', text: 'So what is the least you may raise to?', answer: 'min-raise', success: 'Yes: {current} plus {min-raise:by} makes {min-raise}.' },
      { kind: 'askMove', text: 'Make the smallest raise: tap Raise, then confirm the first size offered.', accept: [minRaise(MIN_RAISE)], claim: 'legal', success: 'A minimum raise.', reply: 'r30 fold fold fold' },
      { kind: 'askNumber', text: '{name:1} re-raised to {current}, adding {min-raise:by}. What is the least re-raise now?', answer: 'min-raise', success: 'Right: {current} plus {min-raise:by} makes {min-raise}. Each raise sets the least size of the next.' },
      { kind: 'say', text: 'An all-in can be smaller than a full raise. Most tables then do not let the players who have already acted raise again; some do. That is one of the questions to ask before you sit down.' },
    ],
  },
  {
    id: 'poker.1.streets',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'The flop, the turn and the river',
    minutes: 2,
    start: ON_THE_FLOP,
    steps: [
      { kind: 'say', text: 'When the first round of betting ends, the dealer burns a card (puts it aside face down) and turns {flop:cards} cards face up at once: the flop.' },
      {
        kind: 'askChoice',
        text: 'Who acts first on the flop?',
        options: [
          { text: '{name:1}, the first player still in on the button’s left', correct: true, why: 'Yes. From the flop on, the button acts last and the first player on its left who is still in acts first.' },
          { text: 'You, because you raised before the flop', why: 'Raising does not change the order: after the flop it always starts left of the button.' },
        ],
      },
      { kind: 'show', text: 'Both check. The dealer burns again and turns one card: the turn.', moves: ['check', 'check'] },
      { kind: 'askNumber', text: 'How many cards are on the board now?', answer: 'board:now', success: 'Yes, {board:now}. One more is still to come.' },
      { kind: 'show', text: 'Both check again, and the last card comes: the river.', moves: ['check', 'check'] },
      { kind: 'say', text: 'After the river there is a last round of betting. If two or more players are still in after it, they show their hands.' },
    ],
  },
  {
    id: 'poker.1.showdown',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'The showdown and split pots',
    minutes: 3,
    start: RIVER_BET,
    steps: [
      { kind: 'say', text: 'If two or more players are in after the last round of betting, they show their hands: the showdown. The last player to bet or raise on the river shows first; if everyone checked, the first player on the button’s left does.' },
      { kind: 'askMove', text: '{name:1} bets {current} on the river. Call to see his hand.', accept: ['call'], claim: 'legal', success: 'He made the last bet, so he shows first.' },
      { kind: 'say', text: '{name:1} shows {hand:1}; you have {hand}. Cards speak: the best hand wins, whatever anyone says, so always let your hand be seen and read.' },
      { kind: 'say', position: SPLIT, openHand: true, text: 'Cards up: you both hold {hand}. Equal hands split the pot.' },
      { kind: 'show', openHand: true, text: 'You check behind, and the hands are shown.', moves: ['check'] },
      { kind: 'askNumber', openHand: true, text: 'The pot held {last:pot:0} chips. How many did you get?', answer: 'last:share:0:0', success: 'Yes, {last:share:0:0}. The pot does not split evenly, so one chip is left over.' },
      {
        kind: 'askChoice',
        openHand: true,
        text: '{name:1} got {last:share:0:1}. Why did he get the odd chip?',
        options: [
          { text: 'He is the first winner on the button’s left', correct: true, why: 'Yes: that is the rule here. Some tables give it to the highest card instead; ask before you sit.' },
          { text: 'He called last', why: 'The odd chip goes by seat: the first winner on the button’s left.' },
          { text: 'The dealer keeps it for the next pot', why: 'Nobody keeps it: it goes to the first winner on the button’s left.' },
        ],
      },
    ],
  },
  {
    id: 'poker.1.side-pots',
    gameId: 'poker',
    stage: 'stage-1',
    title: 'All-in and side pots',
    minutes: 4,
    start: SIDE_POTS,
    steps: [
      { kind: 'say', text: 'Nobody can be pushed out of a hand for lack of chips: you can always go all-in with what you have. But you can win from each player only as much as you put in yourself.' },
      { kind: 'say', text: '{name:2} went all-in for {total:2}. {name:3} raised to {total:3}.' },
      { kind: 'askMove', text: 'You have a pair of jacks in the small blind. Call {call}.', accept: ['call'], claim: 'legal', success: 'You call. The big blind folds, and the flop comes.', reply: 'fold' },
      { kind: 'askNumber', text: '{name:2} can win only what she matched from each player, plus the big blind’s chips: the main pot. How many chips are in it?', answer: 'pot:main', success: 'Yes, {pot:main}.' },
      { kind: 'askNumber', text: 'The rest is a side pot that only you and {name:3} can win. How many chips are in it?', answer: 'pot:side', success: 'Yes, {pot:side}. Any more betting between you two goes in the side pot too.' },
      { kind: 'show', text: 'You and {name:3} check every round, and the hands are shown.', moves: ['check', 'check', 'check', 'check', 'check', 'check'] },
      {
        kind: 'askChoice',
        text: '{name:2} had the best hand and took the main pot. Why did you still win chips?',
        options: [
          { text: 'You beat {name:3}, the only other player in the side pot', correct: true, why: 'Yes. Each pot goes to the best hand among the players in it.' },
          { text: 'The pots are always split', why: 'Not at all: each pot goes to the best hand among the players who can win it.' },
          { text: 'The small blind wins the side pot', why: 'Seats do not win pots: the best hand among the players in each pot does.' },
        ],
      },
    ],
  },

  // Stage 2: first strategy
  {
    id: 'poker.2.starting',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Starting hands',
    minutes: 3,
    start: UNDER_THE_GUN,
    steps: [
      { kind: 'say', text: 'There are {combos:all} ways to be dealt {hole} cards, but only {classes} kinds of starting hand: a pair, or two ranks, either suited (one suit) or offsuit.' },
      { kind: 'say', text: 'A pair can come {combos:pair} ways; a suited hand such as ace-king suited, {combos:suited}; the offsuit one, {combos:offsuit}. So you are dealt offsuit hands far more often.' },
      { kind: 'say', text: 'Big pairs and big cards win the most pots. Suited cards and connected ones (next to each other in rank) make flushes and straights. Most hands are not worth a chip.' },
      {
        kind: 'askChoice',
        text: 'Which of these starting hands is the strongest?',
        options: [
          { text: 'A pair of queens', correct: true, why: 'Yes. Only aces and kings are better pairs, and it is already a pair before the flop.' },
          { text: 'Ace-ten offsuit', why: 'A fine hand in late position, but well behind a big pair.' },
          { text: 'Seven-six suited', why: 'It can make straights and flushes, but it rarely wins without help.' },
        ],
      },
      { kind: 'askMove', text: 'You are first to act with {class:words}: about {rank:pct}% of hands are better. Fold it.', accept: ['fold'], wrong: { call: 'Calling with the weakest kind of hand costs chips over time. Fold.' }, claim: 'legal', success: 'Folding before the flop costs nothing. You will fold most hands you are dealt.' },
    ],
  },
  {
    id: 'poker.2.position',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Position',
    minutes: 3,
    start: KT_UTG,
    steps: [
      { kind: 'say', text: 'Where you sit matters. After the flop the button acts last on every round, so it sees what everyone does before it decides. The earlier you act, the more players can still wake up with a big hand behind you.' },
      {
        kind: 'askChoice',
        text: 'Which seat acts last after the flop?',
        options: [
          { text: 'The button', correct: true, why: 'Yes, on every round from the flop on. That is why it is the best seat.' },
          { text: 'The big blind', why: 'The big blind acts last only before the flop; after it, the blinds act first.' },
          { text: 'Whoever raised before the flop', why: 'Raising does not change the order: the button is last.' },
        ],
      },
      { kind: 'askMove', text: 'You are {pos} with {class:words}, and {behind} players act after you. Fold or raise?', accept: chart(KT_UTG, 'fold'), claim: 'legal', success: 'Fold. With so many players to come, this hand is too likely to run into a better one.' },
      { kind: 'askMove', position: KT_CO, text: 'The same hand in the cutoff, after two folds: only {behind} players are left. Raise to about {open:size}.', accept: chart(KT_CO, 'raise'), claim: 'legal', success: 'Raise. Late in the order, far fewer hands can beat yours.', reply: 'fold fold fold' },
      { kind: 'say', text: 'Everyone folded, and the blinds are yours. Same cards, different seat, different play: the later your seat, the more hands you can open.' },
    ],
  },
  {
    id: 'poker.2.pot-odds',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Pot odds',
    minutes: 4,
    start: POT_ODDS,
    steps: [
      { kind: 'say', text: 'Pot odds compare what a call costs with what it can win. A call pays if you win at least your own share of the final pot.' },
      { kind: 'say', text: '{name:1} moves all-in for {call} more. The pot holds {pot}; if you call, it will hold {final}, and {call} of that will be yours.' },
      { kind: 'askNumber', text: 'What share of the final pot is your call, to the nearest per cent?', answer: 'need', success: 'Yes, {need}%. You must win more often than that for a call to pay.' },
      { kind: 'say', openHand: true, text: 'Now see his cards: {hand:1}. You have a flush draw and a straight draw: {outs:win} of the cards to come win for you, which makes your equity {equity}%.' },
      { kind: 'askMove', openHand: true, text: 'Your {equity}% beats the {need}% you need. Call or fold?', accept: ['call'], wrong: { fold: 'This gives up a pot you win often enough: {equity}% against a price of {need}%.' }, claim: 'best', success: 'Call. On average it gains about {ev:call} chips over folding.' },
      { kind: 'say', text: 'Win or lose this time, the call was right. At this price, the times you hit pay for the times you miss.' },
    ],
  },
  {
    id: 'poker.2.outs',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Counting outs',
    minutes: 3,
    start: FLUSH_DRAW,
    steps: [
      { kind: 'say', text: 'An out is a card still to come that gives you a hand that will probably win. Count your outs and you know your chances.' },
      { kind: 'askNumber', text: 'You have four hearts, two in your hand and two on the board. How many hearts are among the cards you cannot see?', answer: 'outs', success: 'Yes, {outs}. A flush draw has {outs} outs.' },
      { kind: 'askNumber', position: OPEN_ENDED, text: 'Now four cards in a row, open at both ends: any card one rank below or above makes a straight. How many outs?', answer: 'outs', success: 'Yes, {outs}: an open-ended straight draw.' },
      { kind: 'askNumber', position: GUTSHOT, text: 'Here only a ten fills the gap in your straight. How many outs?', answer: 'outs', success: 'Yes, {outs}. A draw to an inside straight is called a gutshot.' },
      { kind: 'askNumber', position: COMBO_DRAW, text: 'A flush draw and an open-ended straight draw together. How many cards give you a straight or a flush?', answer: 'outs', success: 'Yes, {outs}. The heart that also makes the straight counts only once.' },
    ],
  },
  {
    id: 'poker.2.rule-of-two-four',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'From outs to odds',
    minutes: 3,
    start: FLUSH_DRAW,
    steps: [
      { kind: 'say', text: 'A quick rule turns outs into a chance. On the flop, with two cards to come, multiply your outs by {rule:two}. On the turn, with one card to come, multiply by {rule:one}. The answer is roughly your chance in per cent.' },
      { kind: 'askNumber', text: 'Your flush draw has {outs} outs and two cards to come. What does the rule give?', answer: 'rough', success: 'About {rough}%. The exact chance of making your flush by the river is {hit}%.' },
      { kind: 'askNumber', position: FLUSH_DRAW_TURN, text: 'The turn missed. With one card to come, what does the rule give now?', answer: 'rough', success: 'About {rough}%. Exactly, {outs} of the {unseen} cards you cannot see: {hit}%.' },
      {
        kind: 'askChoice',
        text: 'Why did your chance drop so much?',
        options: [
          { text: 'Only one card is left to come', correct: true, why: 'Yes. With two cards to come you had two tries; now you have one.' },
          { text: 'There are fewer hearts left', why: 'You still have the same outs; you have one try left instead of two.' },
          { text: 'The rule changes after the flop', why: 'The rule is the same idea: about two per cent an out for each card to come.' },
        ],
      },
    ],
  },
  {
    id: 'poker.2.equity',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Equity',
    minutes: 3,
    start: EQUITY_PRE,
    steps: [
      { kind: 'say', openHand: true, text: 'Your equity is your share of the pot if every card were dealt out now: how often you would win, with a tie counting as half. Cards up: your ace-king suited against a pair of queens has about {equity}%.' },
      {
        kind: 'askChoice',
        position: EQUITY_FLOP,
        openHand: true,
        text: 'On this flop you have top pair; {name:1} has the best flush draw and an ace. Who is ahead?',
        options: [
          { text: 'You, with {equity}%', correct: true, why: 'Yes, but only just: he has many outs, two cards to come and an ace that pairs.' },
          { text: '{name:1}, with {equity:1}%', why: 'Close, but not ahead: he wins {equity:1}% and you {equity}%.' },
          { text: 'Neither: it is exactly even', why: 'Close, but your pair is ahead: {equity}% against {equity:1}%.' },
        ],
      },
      { kind: 'say', position: EQUITY_CALL, openHand: true, text: 'Being behind does not mean you must fold. You bet the flop, and {name:1} raises all-in with top pair: {call} more to call. You have no pair, but a flush draw with {equity}% equity, and you need {need}%.' },
      { kind: 'askMove', openHand: true, text: '{name:1} has raised all-in with top pair: {call} more to call. With your flush draw, call or fold?', accept: ['call'], wrong: { fold: 'Your {equity}% is more than the {need}% the price asks for. Call.' }, claim: 'best', success: 'Call. Equity against the price decides, not who is ahead right now. You will lose some of these, as you may now: the call still pays over time.' },
    ],
  },
  {
    id: 'poker.2.value-or-bluff',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'Value bet or bluff',
    minutes: 3,
    start: VALUE,
    steps: [
      { kind: 'say', text: 'There are two good reasons to bet. A value bet: you are probably ahead, and worse hands may call. A bluff: you are probably behind, and better hands may fold.' },
      { kind: 'askMove', text: 'You have {hand}, and {name:1} checks the river. Bet for value, half the pot or more.', accept: raises(VALUE, 6, 12), wrong: { check: 'With the best hand, a check wins nothing more. Bet: worse hands may call.' }, claim: 'legal', success: 'A value bet: every chip a worse hand calls with is yours.', reply: 'call' },
      { kind: 'say', text: '{name:1} called with {hand:1} and paid you off.' },
      {
        kind: 'askChoice',
        position: MIDDLING,
        text: 'Here you have {hand}, and {name:1} checks to you. What would a bet be?',
        options: [
          { text: 'Neither: better hands call, worse ones fold, so check', correct: true, why: 'Yes. A middling hand gains little from a bet. Check and see the showdown.' },
          { text: 'A value bet', why: 'Which worse hand would call? Most hands that call you here are better.' },
          { text: 'A bluff', why: 'You might well have the best hand; there is no need to make better hands fold.' },
        ],
      },
    ],
  },
  {
    id: 'poker.2.c-bet',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'The continuation bet',
    minutes: 2,
    start: C_BET,
    steps: [
      { kind: 'say', text: 'You raised before the flop, so the others expect a good hand. A bet on the flop, a continuation bet, often wins the pot at once: most flops miss most hands, theirs as well as yours.' },
      { kind: 'askMove', text: 'The flop missed you, and {name:1} checks. Make a continuation bet of about half the pot, {size:half}.', accept: raises(C_BET, 4, 8), wrong: { check: 'Checking is allowed, but a small bet wins this pot often. Bet.' }, claim: 'legal', success: 'A continuation bet.', reply: 'fold' },
      { kind: 'say', text: '{name:1} folded, and the pot is yours. A small bet risked little to win it.' },
      {
        kind: 'askChoice',
        text: 'Which flop suits a continuation bet better?',
        options: [
          { text: 'King, seven, two of three suits', correct: true, why: 'Yes. Few hands like it and there are no draws, so a bet often takes the pot.' },
          { text: 'Nine, eight, seven with two hearts', why: 'This flop hits many hands and draws: expect calls and raises.' },
        ],
      },
    ],
  },
  {
    id: 'poker.2.fold',
    gameId: 'poker',
    stage: 'stage-2',
    title: 'When to fold',
    minutes: 3,
    start: ROCK_SHOVE,
    steps: [
      { kind: 'say', text: 'Folding is the play you will make most. Fold weak hands before the flop, and fold when the pot does not pay for your chance to win it.' },
      { kind: 'say', text: '{name:1} is a rock: he plays few hands and never bluffs. He moves all-in for {call} on the turn. You have top pair with a good kicker.' },
      { kind: 'askNumber', text: 'What share of the final pot must you win to call?', answer: 'need', success: 'Yes, {need}%.' },
      { kind: 'say', text: 'Say he moves all-in here only with two pair or better: {range:combos} hands he could hold. Against them your equity is {equity:range}%.' },
      { kind: 'askMove', text: 'The rock moves all-in only with two pair or better. With your top pair, call or fold?', accept: ['fold'], wrong: { call: 'Top pair is a good hand, but against two pair or better it wins only {equity:range}% of the time, and you need {need}%.' }, claim: 'best', success: 'A good fold. A strong hand is only as strong as the hands that bet into it.' },
    ],
  },

  // Stage 3: core skills
  {
    id: 'poker.3.ranges',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Opening ranges by seat',
    minutes: 3,
    start: SUITED_UTG,
    steps: [
      { kind: 'say', text: 'A solid player raises first in with about the best {open:UTG}% of hands under the gun, {open:HJ}% in the hijack, {open:CO}% in the cutoff and {open:BTN}% on the button; from the small blind, {open:SB}%. The coach’s chart and the computer players use these same ranges.' },
      { kind: 'askMove', text: 'You are {pos} with {class:words}. Raise or fold?', accept: chart(SUITED_UTG, 'fold'), claim: 'legal', success: 'Fold. Under the gun it is outside the best {open:UTG}%.' },
      { kind: 'askMove', position: SUITED_CO, text: 'The same hand in {pos}, after two folds. Raise or fold?', accept: chart(SUITED_CO, 'raise'), claim: 'legal', success: 'Raise. From the cutoff the range widens to {open:CO}%, and this hand is in it.', reply: 'fold fold fold' },
      { kind: 'askMove', position: OFFSUIT_BTN, text: 'On {pos}, folded to you, with {class:words}. Raise or fold?', accept: chart(OFFSUIT_BTN, 'raise'), claim: 'legal', success: 'Raise. Only the blinds are left to act, and they will be out of position all hand.', reply: 'fold fold' },
      { kind: 'say', text: 'Notice the pattern: the closer to the button, the more hands you open. Raise or fold: limping in first, just calling the big blind, is not in the chart.' },
    ],
  },
  {
    id: 'poker.3.three-bet',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'The re-raise before the flop',
    minutes: 3,
    start: THREE_BET,
    steps: [
      { kind: 'say', text: 'A re-raise before the flop is a three-bet: the big blind was the first bet, the opening raise the second. Three-bet your best hands, so worse ones pay you or fold.' },
      { kind: 'say', text: 'Size it at about three times the raise when you will act after the raiser on later rounds, {three-bet} here; about four times from the blinds, {three-bet:oop} here, because you will act first after the flop.' },
      { kind: 'askMove', text: '{name:5} opened to {current} from the cutoff. You have {class:words} on the button. Three-bet to about {three-bet}.', accept: raises(THREE_BET, 13, 18), wrong: { call: 'A pair of queens is one of the best hands: re-raise it.', fold: 'Never fold a pair of queens to a single raise.' }, claim: 'legal', success: 'A three-bet.', reply: 'fold fold call' },
      {
        kind: 'askChoice',
        text: '{name:5} called. Which hands should you three-bet for value?',
        options: [
          { text: 'The very best: big pairs and ace-king', correct: true, why: 'Yes. Add a few suited hands as bluffs once you are comfortable.' },
          { text: 'Any pair and any ace', why: 'Too many. Small pairs and weak aces play better by calling, or folding.' },
          { text: 'Only aces', why: 'Too few: kings, queens and ace-king are strong enough as well.' },
        ],
      },
      { kind: 'askMove', position: KJ_VS_UTG, text: '{name:3} raised under the gun, where a solid player opens only the best {open:UTG}%. You have {class:words}. Call, three-bet or fold?', accept: ['fold'], wrong: { call: 'King-jack is often behind the hands that raise first under the gun: ace-king, king-queen, big pairs. Fold.' }, claim: 'legal', success: 'Fold. Against a tight range, king-jack is often dominated: when it pairs, the raiser has a better kicker.' },
    ],
  },
  {
    id: 'poker.3.styles',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Reading playing styles',
    minutes: 3,
    start: STATS,
    steps: [
      { kind: 'say', text: 'Two numbers describe how someone plays before the flop: how often they put chips in by choice (VPIP; blinds do not count) and how often they raise (PFR). After {hands:1} hands, they tell you a lot.' },
      {
        kind: 'askChoice',
        text: '{name:2} has played {vpip:2}% of hands but raised only {pfr:2}%. Which style is that?',
        options: [
          { text: 'A calling station: many hands, mostly calls', correct: true, why: 'Yes. A big gap between the two numbers means calling, and calling stations call after the flop too.' },
          { text: 'A maniac: many hands, mostly raises', why: 'A maniac raises most hands it plays; this player rarely raises.' },
          { text: 'A rock: very few hands', why: 'A rock plays far fewer hands than this.' },
        ],
      },
      {
        kind: 'askChoice',
        text: '{name:3} has played {vpip:3}% and raised {pfr:3}%.',
        options: [
          { text: 'A rock: very few hands, and few bluffs', correct: true, why: 'Yes. When a rock bets big, believe it.' },
          { text: 'Loose-aggressive', why: 'Loose players play many hands. This one plays hardly any.' },
          { text: 'A calling station', why: 'A station plays many hands. This one plays hardly any.' },
        ],
      },
      {
        kind: 'askChoice',
        text: '{name:4} has played {vpip:4}% and raised {pfr:4}%.',
        options: [
          { text: 'A maniac: many hands, raised hard', correct: true, why: 'Yes. Expect bets and raises with all sorts of hands, bluffs included.' },
          { text: 'Tight-aggressive', why: 'Tight means few hands. This player is in most pots.' },
          { text: 'A calling station', why: 'A station calls. This player raises almost half the time.' },
        ],
      },
      {
        kind: 'checkpoint',
        text: 'Two more styles. One try each.',
        questions: [
          {
            kind: 'askChoice',
            text: '{name:1}: {vpip:1}% played, {pfr:1}% raised.',
            options: [
              { text: 'Tight-aggressive', correct: true, why: 'Yes: few hands, nearly all raised. A good, solid player.' },
              { text: 'Loose-aggressive', why: 'Not loose: about one hand in five.' },
              { text: 'A rock', why: 'Tighter than average, but a rock plays about half as many.' },
            ],
          },
          {
            kind: 'askChoice',
            text: '{name:5}: {vpip:5}% played, {pfr:5}% raised.',
            options: [
              { text: 'Loose-aggressive', correct: true, why: 'Yes: many hands, most of them raised.' },
              { text: 'Tight-aggressive', why: 'More than a third of hands is loose.' },
              { text: 'A calling station', why: 'Most of these hands are raised, not called.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'poker.3.beat-styles',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Beating each style',
    minutes: 3,
    start: STATS,
    steps: [
      { kind: 'say', text: 'Each style has a weakness. Once you have a read, play the hands and the bets that punish it. The computer players show their styles at the end of a session; try to name them before then.' },
      {
        kind: 'askChoice',
        text: 'Against {name:2}, the calling station, what wins most?',
        options: [
          { text: 'Value bets: bet good hands, bigger, and do not bluff', correct: true, why: 'Yes. A station pays off your good hands and calls your bluffs.' },
          { text: 'Lots of bluffs', why: 'A station calls. Bluffs only work against players who fold.' },
          { text: 'Checking to see free cards', why: 'That wastes the station’s main weakness: it pays your good hands.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'Against {name:3}, the rock?',
        options: [
          { text: 'Take the blinds often, and fold when the rock bets big', correct: true, why: 'Yes. A rock gives up small pots and only fights with big hands.' },
          { text: 'Call every big bet to keep the rock honest', why: 'A rock rarely bluffs: calling its big bets loses.' },
          { text: 'Value bet thin hands', why: 'A rock does not call with worse; it folds or has you beat.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'Against {name:4}, the maniac?',
        options: [
          { text: 'Call down lighter and let the maniac bluff', correct: true, why: 'Yes. Good hands win big pots; let the maniac do the betting.' },
          { text: 'Bluff the maniac often', why: 'A maniac rarely folds. Wait for a hand and let them bet into it.' },
          { text: 'Fold anything but the very best', why: 'Too tight: the maniac’s hands are weaker than its bets.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'Against the aggressive players, {name:1} and {name:5}?',
        options: [
          { text: 'Play more hands with position on them, and re-raise the loose one lighter', correct: true, why: 'Yes. Position takes away part of their edge, and a loose raiser cannot hold many strong hands.' },
          { text: 'Avoid them entirely', why: 'You cannot avoid them, but you can choose good spots against them.' },
          { text: 'Treat them like calling stations', why: 'They raise and bluff; they do not just call.' },
        ],
      },
    ],
  },
  {
    id: 'poker.3.sizing',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Bet sizing',
    minutes: 3,
    start: SIZING,
    steps: [
      { kind: 'say', text: 'Size bets as a share of the pot: a third, a half, two-thirds or the whole pot. The share says what price you offer, whatever the stakes.' },
      { kind: 'askNumber', text: 'The pot holds {pot:before}. How much is two-thirds of it, to the nearest chip?', answer: 'size:two-thirds', success: 'Yes, {size:two-thirds}.' },
      { kind: 'say', text: 'The bigger the bet, the worse the price for a caller: against a third of the pot they need {need:third}%, against half {need:half}%, against two-thirds {need:two-thirds}% and against the whole pot {need:pot}%.' },
      { kind: 'askMove', text: 'You have top pair with the best kicker, on a board full of straight and flush draws, and {name:5} checks. Bet about two-thirds of the pot, so the draws pay a high price.', accept: raises(SIZING, 17, 33), wrong: { check: 'A free card lets every draw catch up. Bet.' }, claim: 'legal', success: 'A big bet: draws that call pay too much for their chance.', reply: 'fold' },
      {
        kind: 'askChoice',
        text: 'Bluffs work the other way. A bluff of half the pot must work {bluff:half}% of the time; a bluff of the whole pot {bluff:pot}%. Which needs to work less often?',
        options: [
          { text: 'The smaller bluff', correct: true, why: 'Yes: it risks less to win the same pot.' },
          { text: 'The bigger bluff', why: 'The bigger bluff risks more for the same pot, so it must work more often.' },
        ],
      },
    ],
  },
  {
    id: 'poker.3.implied-odds',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Draws and implied odds',
    minutes: 3,
    start: IMPLIED,
    steps: [
      { kind: 'say', text: 'Pot odds count only the chips in the pot now. Implied odds also count the chips you can win later, when your draw comes in.' },
      { kind: 'askNumber', text: '{name:1} bets {call} into {pot:before}. What share of the final pot must you win to call?', answer: 'need', success: 'Yes, {need}%.' },
      { kind: 'say', text: 'Your straight draw has {outs} outs, so the river makes it {hit}% of the time: short of the {need}% you need.' },
      { kind: 'say', text: 'But when a ten or a five comes, {name:1} may pay you more; he has {stack:1} chips left. The call pays if, when you hit, you win about {implied:hit} more on average.' },
      {
        kind: 'askChoice',
        text: '{name:1} is a calling station who pays off big hands. Call or fold?',
        options: [
          { text: 'Call: what you win later covers the price', correct: true, why: 'Yes. A station will pay much more than that when you make your straight.' },
          { text: 'Fold: the pot odds alone are short', why: 'They are, but the chips he pays later make up the difference.' },
          { text: 'Raise all-in now', why: 'A station calls, and your draw is behind now.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'And against a rock, who checks and folds whenever a scary card comes?',
        options: [
          { text: 'Fold: the chips you hoped to win later will not come', correct: true, why: 'Yes. Implied odds need an opponent who pays when you hit.' },
          { text: 'Call anyway: draws always have implied odds', why: 'Only against someone who pays you off when you hit.' },
        ],
      },
    ],
  },
  {
    id: 'poker.3.push-or-fold',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Short stack: all-in or fold',
    minutes: 3,
    start: PUSH,
    steps: [
      { kind: 'say', text: 'With a short stack there is no room to raise and then fold, or to outplay anyone after the flop. Move all-in or fold: the all-in wins the blinds when everyone folds, and still has its equity when called.' },
      { kind: 'say', text: 'You have {stack:bb} big blinds in the small blind, and everyone has folded to you. A solid player moves all-in here with about the best {push}% of hands.' },
      { kind: 'askMove', text: 'Say {name:1}, in the big blind, calls an all-in with the best {range:share}% of hands. With {class:words}: all-in or fold?', accept: [allIn(PUSH)], wrong: { fold: 'Too tight: the blinds you win when {name:1} folds are worth more than this hand loses when called.' }, claim: 'best', success: 'All-in. {name:1} folds most of the time, and when called you still win {equity:range}%: on average the all-in gains about {ev:push:bb} big blinds.', reply: 'fold' },
      { kind: 'askMove', position: NO_PUSH, text: 'Now you hold {class:words}, and suppose {name:1} calls an all-in with the best {range:share}% of hands. All-in or fold?', accept: ['fold'], wrong: { [allIn(NO_PUSH)]: 'Against a player who calls this often, this hand is called too much and wins too little: {equity:range}% when called.' }, claim: 'best', success: 'Fold. Against so wide a call, the all-in loses about {push:loss:bb} big blinds on average.' },
      { kind: 'say', text: 'The looser the caller, the fewer hands you can move all-in with; the tighter, the more. Watch who calls.' },
    ],
  },
  {
    id: 'poker.3.river',
    gameId: 'poker',
    stage: 'stage-3',
    title: 'Calling a possible bluff',
    minutes: 4,
    start: MANIAC_SHOVE,
    steps: [
      { kind: 'say', text: 'On the river no card can come to save you: your hand wins or it does not. Facing an all-in, the pot odds say how often it must be a bluff for your call to pay.' },
      { kind: 'askNumber', text: '{name:4} moves all-in for {call} into {pot:before}. What share of the final pot must you win?', answer: 'need', success: 'Yes, {need}%. With a hand that beats only bluffs, that is how often she must be bluffing.' },
      { kind: 'say', text: 'Your pair of kings beats only a bluff. {name:4} is a maniac: say she moves all-in here with {value:combos} hands that beat you and {bluff:combos} bluffs. That is {bluff:share}% bluffs.' },
      { kind: 'askMove', text: 'The maniac bluffs {bluff:share}% of the time here, and you hold a pair of kings. Call or fold?', accept: ['call'], wrong: { fold: 'She bluffs {bluff:share}% of the time here, more than the {need}% you need. Call.' }, claim: 'best', success: 'Call. Against her range you win {equity:range}% of the time, more than the {need}% the price asks.' },
      { kind: 'say', position: ROCK_RIVER, text: 'Now the same all-in from {name:3}, a rock. Say he has the same {value:combos} hands that beat you, and only {bluff:combos} bluffs: {bluff:share}% bluffs.' },
      { kind: 'askMove', text: 'The rock bluffs only {bluff:share}% of the time here. With your pair of kings, call or fold?', accept: ['fold'], wrong: { call: 'A rock bluffs only {bluff:share}% of the time here, less than the {need}% you need. Fold.' }, claim: 'best', success: 'Fold. The same cards, the same price; the player makes the difference.' },
    ],
  },

  // Advanced: the other games on the poker engine, what is different from Hold'em.
  {
    id: 'poker.4.omaha',
    gameId: 'poker',
    stage: 'stage-4',
    title: 'Omaha: four cards, exactly two',
    minutes: 3,
    start: OMAHA,
    steps: [
      { kind: 'say', text: 'Omaha plays like Hold’em, with the same blinds, flop, turn and river, but each player gets four hole cards instead of two.' },
      { kind: 'say', text: 'The big difference: your hand is made of exactly two of your four hole cards and exactly three of the five board cards. Never one or three of yours, never four or five from the board.' },
      {
        kind: 'askChoice',
        text: 'You hold four hearts, ace, king, queen and jack. The board will be the ten of hearts, two of clubs, three of diamonds, four of spades and nine of hearts. Is that a flush?',
        options: [
          { text: 'No: with two hearts on the board, two of mine make only four hearts', correct: true, why: 'Right. A flush needs three hearts on the board when only two of your cards may play. Here you have ace high.' },
          { text: 'Yes: six hearts in all', why: 'In Hold’em it would be. In Omaha exactly two of your cards play, with exactly three from the board: only four hearts.' },
        ],
      },
      { kind: 'say', text: 'Most Omaha is pot-limit: the most you may raise to is what would be in the pot after you call, on top of the call. Pairs and draws run close, so pots grow fast even so.' },
      { kind: 'askMove', text: 'Raise the most pot-limit allows: tap Raise, choose Pot, and confirm.', accept: [allIn(OMAHA)], claim: 'legal', success: 'A pot-sized raise. In no-limit you could have gone all-in; in pot-limit this is the most.' },
    ],
  },
  {
    id: 'poker.4.draw',
    gameId: 'poker',
    stage: 'stage-4',
    title: 'Five-card draw',
    minutes: 3,
    start: DRAW,
    steps: [
      { kind: 'say', text: 'In five-card draw there is no board. Each player gets five cards face down, there is a round of betting, then the draw: each player throws away up to three cards and is dealt as many new ones. Then a last round of betting and the showdown.' },
      { kind: 'say', text: 'It is usually played with fixed bets: before the draw every bet and raise is one big blind, after it two.' },
      { kind: 'askMove', text: 'You hold a pair of kings. Call the big blind to see the draw.', accept: ['call'], claim: 'legal', success: 'You call. The small blind calls and the big blind checks, so the draw begins on the button’s left.', reply: 'call check d3h2c d8c5d' },
      { kind: 'say', text: '{name:1} drew two and {name:2} drew two: a player drawing two often has three of a kind, one drawing one a flush or straight draw, or two pair.' },
      { kind: 'askMove', text: 'Keep your two kings and throw the other three away: tap the seven, the four and the two, then the Draw button.', accept: ['d7c4h2s'], claim: 'legal', success: 'You draw three to your kings: the usual play with one pair.' },
      {
        kind: 'askChoice',
        text: 'Which of these hands should draw just one card?',
        options: [
          { text: 'Four hearts and a club: keep the hearts', correct: true, why: 'Yes. Four to a flush draws one card, hoping for a fifth heart: about one time in five.' },
          { text: 'A pair of jacks and three odd cards', why: 'With one pair you keep the pair and draw three.' },
          { text: 'A straight', why: 'A straight is already made: stand pat and draw none.' },
        ],
      },
    ],
  },
  {
    id: 'poker.4.stud',
    gameId: 'poker',
    stage: 'stage-4',
    title: 'Seven-card stud',
    minutes: 3,
    start: STUD,
    steps: [
      { kind: 'say', text: 'Seven-card stud has no board and no blinds. Everyone antes, then gets two cards face down and one face up. Three more come face up and a last one face down, with a round of betting after each: seven cards, and the best five make your hand.' },
      { kind: 'say', text: 'The player showing the lowest card must start the betting with a small forced bet, the bring-in. On a tie, clubs is the lowest suit, then diamonds, hearts and spades.' },
      { kind: 'askMove', text: 'Your two of clubs is the lowest card showing. Bring it in for the least.', accept: ['r1'], claim: 'legal', success: 'You bring it in. {name:1} and {name:2} call, and fourth street comes face up.', reply: 'call call' },
      {
        kind: 'askChoice',
        text: 'Who acts first from fourth street on?',
        options: [
          { text: 'The player whose face-up cards make the best hand', correct: true, why: 'Yes: here {name:1}, showing a pair of kings. It can change every street.' },
          { text: 'The player left of the dealer, as in Hold’em', why: 'Not in stud. The best hand showing acts first, and the lowest card brought it in on third street.' },
          { text: 'Whoever brought it in', why: 'The bring-in is only on third street. From fourth street the best hand showing goes first.' },
        ],
      },
      { kind: 'say', text: 'Bets are fixed: one big blind on third and fourth street, two from fifth street on. When anyone shows a pair on fourth street, a player may already bet two. Watch the cards others show: a card you need that is face up in front of someone else will not come to you.' },
    ],
  },

  // Table-ready
  {
    id: 'poker.table.in-turn',
    gameId: 'poker',
    stage: 'table',
    title: 'Acting in turn',
    minutes: 2,
    start: OUT_OF_TURN,
    steps: [
      { kind: 'say', text: 'Act only when it is your turn. Acting early, even folding, gives away information and can change what the players before you do.' },
      {
        kind: 'askChoice',
        text: 'It is {name:3}’s turn, and you already know you will fold. What do you do?',
        options: [
          { text: 'Wait for your turn, then fold', correct: true, why: 'Yes. The players before you deserve to decide without knowing you are out.' },
          { text: 'Fold now to save time', why: 'Folding early tells the players before you that one opponent fewer is left.' },
          { text: 'Say that you are going to fold', why: 'That is acting out of turn with words.' },
        ],
      },
      { kind: 'say', text: 'If someone does act out of turn, most rooms make the action stand if nothing changes before their turn. If a player before them bets or raises, they may change their mind.' },
      { kind: 'show', text: '{name:3}, {name:4} and {name:5} fold. Now it is your turn.', moves: ['fold', 'fold', 'fold'] },
      { kind: 'askMove', text: 'Fold your hand.', accept: ['fold'], claim: 'legal', success: 'Folded in turn: nobody learned anything early.' },
    ],
  },
  {
    id: 'poker.table.declare',
    gameId: 'poker',
    stage: 'table',
    title: 'Say it: declarations and the one-chip rule',
    minutes: 3,
    start: DECLARE,
    steps: [
      { kind: 'say', text: 'At a live table, what you say binds you. Say “call”, and you must call; say “raise” and an amount, and that is your raise. Words come before chips.' },
      { kind: 'say', text: 'Without a word, a single chip bigger than the bet is only a call: the one-chip rule. To raise with one big chip, say “raise” first.' },
      {
        kind: 'askChoice',
        text: '{name:3} raised to {current}. Without a word, you put out one chip worth more than that. What have you done?',
        options: [
          { text: 'Called: a single silent chip is a call', correct: true, why: 'Yes. The change comes back to you.' },
          { text: 'Raised by the value of the chip', why: 'Not without saying “raise” first: one silent chip is a call.' },
          { text: 'Nothing, until you say what you meant', why: 'Chips in the pot count: one silent chip is a call.' },
        ],
      },
      { kind: 'askMove', text: 'Say “raise” first, then raise to at least {min-raise}.', accept: raises(DECLARE, 10, 40), claim: 'legal', success: 'Clear and binding: nobody can mistake it for a call.', reply: 'fold fold fold' },
    ],
  },
  {
    id: 'poker.table.string-bets',
    gameId: 'poker',
    stage: 'table',
    title: 'String bets',
    minutes: 2,
    start: DECLARE,
    steps: [
      { kind: 'say', text: 'Put your chips in with one forward motion, or say the amount first. Putting some chips in, then reaching back to your stack for more without having said “raise”, is a string bet: only the first chips count.' },
      {
        kind: 'askChoice',
        text: 'You push in enough to call, then go back to your stack for more without a word. What happens?',
        options: [
          { text: 'It is only a call: the extra chips come back', correct: true, why: 'Yes. A raise in two motions could be used to watch the others react, so it is not allowed.' },
          { text: 'It is a raise of everything you put in', why: 'Not without saying “raise” first: in two motions it is a string bet.' },
          { text: 'You lose the chips you added', why: 'Nothing is lost: it is treated as a call.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'How do you raise so that nobody can question it?',
        options: [
          { text: 'Say “raise” and the amount, then put the chips in', correct: true, why: 'Yes. Once you have said it, you may take your time with the chips.' },
          { text: 'Put the chips in slowly, a few at a time', why: 'That is exactly a string bet.' },
          { text: 'Throw the chips into the middle of the pot', why: 'Splashing the pot makes the amount hard to count. Stack them in front of you.' },
        ],
      },
    ],
  },
  {
    id: 'poker.table.protect',
    gameId: 'poker',
    stage: 'table',
    title: 'Protecting your hand',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Keep your cards on the table where the dealer can see them, with a chip or your hand on top. A hand that touches the discards can be ruled dead, and a dealer may sweep away cards that look abandoned.' },
      {
        kind: 'askChoice',
        text: 'Why put a chip on your cards?',
        options: [
          { text: 'So nobody takes them for a folded hand', correct: true, why: 'Yes. A protected hand cannot be swept away or fouled by a discard.' },
          { text: 'It is a signal that you will raise', why: 'It signals nothing; it only keeps your hand safe.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'You fold. What do you do with your cards?',
        options: [
          { text: 'Push them face down towards the dealer', correct: true, why: 'Yes. Showing a folded hand helps some players still in the hand and not others.' },
          { text: 'Show them to your neighbour first', why: 'Never during a hand: the information could help one player against another.' },
          { text: 'Keep them until the hand is over', why: 'Folded cards go to the dealer at once, so there is no doubt who is still in.' },
        ],
      },
    ],
  },
  {
    id: 'poker.table.showdown',
    gameId: 'poker',
    stage: 'table',
    title: 'Cards speak at the showdown',
    minutes: 2,
    start: CARDS_SPEAK,
    steps: [
      { kind: 'say', text: 'At the showdown, turn your cards face up and let them be read. Cards speak: the best hand wins, even if its owner misread it or said the wrong thing.' },
      {
        kind: 'askChoice',
        text: '{name:1} bets the river. You thought you had six high, but look again: with the board you have {hand}. If you call, what do you do at the showdown?',
        options: [
          { text: 'Turn both cards face up and let them be read', correct: true, why: 'Yes. Whatever you think you have, the cards decide.' },
          { text: 'Throw them away: six high cannot win', why: 'Never muck a hand you have not read. This one is a straight.' },
          { text: 'Say you have a pair and see what happens', why: 'Words do not change the result, and a wrong claim only causes trouble.' },
        ],
      },
      { kind: 'askMove', text: 'Call.', accept: ['call'], claim: 'legal', success: 'He shows first, as the last to bet; you turn your cards up, and the straight wins.' },
      { kind: 'say', text: 'Keep your cards until the pot is pushed to the winner. Once a hand touches the discards, it cannot win.' },
    ],
  },
  {
    id: 'poker.table.home-game',
    gameId: 'poker',
    stage: 'table',
    title: 'The button and blinds at a home game',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'At a home game the deal passes one seat to the left after each hand. Use a dealer button, so nobody loses track of who deals and who posts the blinds.' },
      { kind: 'say', text: 'The dealer shuffles, offers the cut to the player on the right, deals one card at a time starting on the button’s left, and burns a card before the flop, the turn and the river.' },
      { kind: 'askNumber', text: 'Each player starts with {cash:stack} chips, and the blinds are {cash:sb} and {cash:bb}. How many big blinds is a starting stack?', answer: 'cash:stack-bb', success: 'Yes, {cash:stack-bb}: a deep stack, with room to play after the flop.' },
      {
        kind: 'askChoice',
        text: 'This hand is over. Where does the button go?',
        options: [
          { text: 'One seat to the left', correct: true, why: 'Yes, and the blinds move with it.' },
          { text: 'To the winner of the hand', why: 'The button moves by seat, not by results.' },
          { text: 'It stays with the best dealer', why: 'Everyone deals in turn; the button moves one seat left.' },
        ],
      },
    ],
  },
  {
    id: 'poker.table.blind-clock',
    gameId: 'poker',
    stage: 'table',
    title: 'A tournament blind clock',
    minutes: 2,
    start: BLIND_CLOCK,
    steps: [
      { kind: 'say', text: 'In a tournament the blinds rise on a clock (here every {level-hands} hands): {level:1:sb} and {level:1:bb}, then {level:2:sb} and {level:2:bb}, then {level:3:sb} and {level:3:bb}, then {level:4:sb} and {level:4:bb}, and on. From level {ante-level} the big blind also puts in an ante for the whole table.' },
      { kind: 'askNumber', text: 'This is level {level}: blinds of {sb} and {bb}. You have {stack} chips. How many big blinds is that?', answer: 'stack:bbs', success: 'Yes, {stack:bbs}. Count your stack in big blinds at every new level.' },
      { kind: 'askNumber', text: 'At the next level the blinds are {next:sb} and {next:bb}. If your stack stays at {stack}, how many big blinds will it be, to the nearest one?', answer: 'stack:next', success: 'Yes, about {stack:next}. The same chips, a shorter stack.' },
      {
        kind: 'askChoice',
        text: 'Why count your stack in big blinds, not chips?',
        options: [
          { text: 'It says how much room you have to play, and when it is time for all-in or fold', correct: true, why: 'Yes. A stack that does not grow gets shorter every level, and the plays change with it.' },
          { text: 'Chips are harder to count', why: 'Chips are easy to count; big blinds tell you what the chips are worth at this level.' },
        ],
      },
    ],
  },
  {
    id: 'poker.table.ask',
    gameId: 'poker',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 3,
    start: HOME_GAME,
    steps: [
      { kind: 'say', text: 'Every game has house rules. Before you sit, ask the blinds, and whether there is an ante or a straddle.' },
      { kind: 'say', text: 'At this table every player antes {ante}, and the player on the big blind’s left posts a live straddle of {straddle}, twice the big blind, and acts last before the flop. Here the least raise over it is to {straddle:min-raise}; some tables allow less, so ask.' },
      {
        kind: 'askChoice',
        text: 'A player moves all-in for more than half a raise, but less than a full one. Under the half-bet rule, does that reopen the betting?',
        options: [
          { text: 'Yes: half a raise or more reopens it', correct: true, why: 'Yes. Under the full-raise rule, the other common one, it would not. Ask which the table plays.' },
          { text: 'No: only a full raise reopens it', why: 'That is the full-raise rule, the other common one. Under the half-bet rule, half a raise is enough.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'Which of these should you settle before your first hand?',
        options: [
          { text: 'Blinds, straddle, the half-bet rule, the odd chip and who shows first', correct: true, why: 'Yes. They are all rules tables disagree on, and the app’s rule settings have them all.' },
          { text: 'Only the blinds', why: 'Many other rules differ from table to table.' },
          { text: 'Nothing: the rules are the same everywhere', why: 'They are not. Ask before the first hand, not after a dispute.' },
        ],
      },
    ],
  },

];
