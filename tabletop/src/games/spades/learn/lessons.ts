/**
 * Spades lessons: stage 0, the rules, first strategy for partners, and the Table-ready track. All
 * prose is original; numbers are {placeholders} computed from the rules. You sit in seat 0, your
 * partner across in seat 2; play goes to your left.
 */
import type { Card } from '../../classic/cards';
import type { Lesson } from '../../../teach/lesson';
import { position } from '../rules';

const L = (cards: string[]): Card[] => cards as Card[];

const MID = position({ hands: [L(['As', 'Kd', '7c']), L(['5s', 'Qh', '9d']), L(['Jc', '2s', '8h']), L(['Ah', 'Td', '4c'])], leader: 0, bids: [3, 4, 2, 4] });

/** A whole deal at the bidding: your hand counts to a bid by the simple method. */
const BIDDING = position({
  hands: [
    L(['As', '8s', '6s', '5s', '4s', 'Kh', '7h', '3h', 'Ad', 'Td', '9d', 'Kc', '2c']),
    L(['2s', '7s', 'Ks', '2h', '5h', '9h', 'Qh', '3d', '6d', 'Jd', '3c', '7c', 'Jc']),
    L(['3s', '9s', 'Qs', '4h', '8h', 'Ah', '2d', '5d', '8d', 'Kd', '4c', '8c', 'Qc']),
    L(['Ts', 'Js', '6h', 'Th', 'Jh', '4d', '7d', 'Qd', '5c', '6c', '9c', 'Tc', 'Ac']),
  ],
  phase: 'bid',
  bids: [null, null, null, null],
  dealer: 3,
});

export const SPADES_LESSONS: readonly Lesson[] = [
  {
    id: 'spades.0.game',
    gameId: 'spades',
    stage: 'stage-0',
    title: 'Spades in a minute',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Spades is for {players:four} in two partnerships: your partner sits across from you. Each player bids how many tricks they will win; your side then tries to take at least the two bids added together.' },
      { kind: 'say', text: 'Spades are always trumps: a spade beats any card of another suit. Making your bid scores {trick:value} a trick; falling short loses the same.' },
      {
        kind: 'askChoice',
        text: 'Where does your partner sit?',
        options: [
          { text: 'Across the table', correct: true, why: 'Yes. Partners never sit side by side, so the play goes you, them, partner, them.' },
          { text: 'On your left', why: 'The player on your left is on the other side.' },
          { text: 'Anywhere: partners change each hand', why: 'Partnerships are fixed for the whole game.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'spades.1.bid',
    gameId: 'spades',
    stage: 'stage-1',
    title: 'Bids add up',
    minutes: 2,
    start: position({ hands: [L(['As', 'Kd', '7c']), L(['5s', 'Qh', '9d']), L(['Jc', '2s', '8h']), L(['Ah', 'Td', '4c'])], leader: 0, bids: [3, 2, 4, 3] }),
    steps: [
      { kind: 'say', text: 'Bidding goes once round the table, starting on the dealer’s left. A bid of nil promises no tricks at all, for {nil:value} points (or minus {nil:value}).' },
      { kind: 'askNumber', text: 'You bid {bid:me} and your partner bid {bid:partner}. How many tricks must your side take?', answer: 'bid:us', success: 'Yes, {bid:us} between you: it does not matter which of you takes them.' },
    ],
  },
  {
    id: 'spades.1.lead',
    gameId: 'spades',
    stage: 'stage-1',
    title: 'Spades must be broken',
    minutes: 2,
    start: position({ hands: [L(['As', 'Ks', '4d', '9c']), L(['2s', 'Jh', '6d', '3c']), L(['Qh', '8d', 'Tc', '5s']), L(['7h', 'Ad', 'Kc', '9s'])], leader: 0, broken: false }),
    steps: [
      { kind: 'say', text: 'Nobody may lead a spade until a spade has been played on another suit (that "breaks" spades), unless the leader holds nothing but spades.' },
      { kind: 'askMove', text: 'Spades are not broken yet. Lead a card you are allowed to lead.', accept: ['4d', '9c'], claim: 'only', success: 'Right: your top spades must wait.' },
    ],
  },
  {
    id: 'spades.1.follow',
    gameId: 'spades',
    stage: 'stage-1',
    title: 'Follow suit',
    minutes: 1,
    start: position({ hands: [L(['2h', 'Kh', '5s', '7d']), L(['8c', '4d', 'Ts']), L(['9c', 'Jd', '3s']), L(['Ac', '6d', 'Js'])], trick: [{ seat: 1, card: 'Jh' }, { seat: 2, card: '3h' }, { seat: 3, card: 'Qh' }], leader: 1 }),
    steps: [{ kind: 'askMove', text: 'Hearts were led and you hold hearts: you must play one.', accept: ['2h', 'Kh'], claim: 'only', success: 'You may trump only when you have no card of the suit led.' }],
  },
  {
    id: 'spades.1.trump',
    gameId: 'spades',
    stage: 'stage-1',
    title: 'Trump when you cannot follow',
    minutes: 2,
    start: position({ hands: [L(['3s', '7c', 'Jh', '8h']), L(['Kc', '2h', '4s']), L(['Qc', '6h', 'Ts']), L(['Jc', '9h', 'Ks'])], trick: [{ seat: 1, card: 'Ad' }, { seat: 2, card: '5d' }, { seat: 3, card: '9d' }], leader: 1 }),
    steps: [
      { kind: 'askMove', text: 'Left led the ace of diamonds and you have no diamonds. Win the trick with a spade.', accept: ['3s'], wrong: { '7c': 'A club cannot win a diamond trick. Only a spade can.', Jh: 'A heart cannot win a diamond trick. Only a spade can.', '8h': 'A heart cannot win a diamond trick. Only a spade can.' }, claim: 'legal', success: 'Even the three of spades beats the ace of diamonds.' },
    ],
  },
  {
    id: 'spades.1.score',
    gameId: 'spades',
    stage: 'stage-1',
    title: 'Made or set',
    minutes: 3,
    start: position({ hands: [L(['Ah']), L(['2h']), L(['3h']), L(['4h'])], leader: 0, bids: [4, 3, 2, 4], won: [3, 3, 2, 4] }),
    steps: [
      { kind: 'say', text: 'At the end of a hand a side that took at least its bid scores {trick:value} a trick bid, and one more point for each trick over (a bag). A side short of its bid is set: it loses {trick:value} a trick bid.' },
      { kind: 'askNumber', text: 'Your side bid {bid:us} and has {won:us} tricks, with one to play. If you lost the last trick, what would your side score?', answer: 'score:now', success: 'Yes: set, {score:now}.' },
      { kind: 'askNumber', text: 'Your ace takes the last trick. What does your side score now?', answer: 'score:if-mine', success: 'Yes, {score:if-mine}: one trick made all that difference.' },
    ],
  },

  // Stage 2: first strategy
  {
    id: 'spades.2.count',
    gameId: 'spades',
    stage: 'stage-2',
    title: 'Count your tricks',
    minutes: 3,
    start: BIDDING,
    steps: [
      { kind: 'say', text: 'A first way to count a bid: one trick for each ace, one for each king with at least one more card of its suit to guard it, and one for each spade past your third.' },
      { kind: 'askNumber', text: 'Count this hand that way. What do you bid?', answer: 'count:simple', success: 'Yes, {count:simple}. With {spades:mine} spades you also hold the long trumps that win late in the hand.' },
    ],
  },
  {
    id: 'spades.2.partner',
    gameId: 'spades',
    stage: 'stage-2',
    title: 'Let your partner’s trick go',
    minutes: 2,
    start: position({ hands: [L(['Kh', '3h', '8c', 'Qd']), L(['9s', '6d', '2c', 'Jh']), L(['5c', 'Td', '7s']), L(['Kc', '2d', '9h'])], trick: [{ seat: 2, card: 'Ah' }, { seat: 3, card: '4h' }], leader: 2 }),
    steps: [
      { kind: 'askMove', text: 'Your partner led the ace of hearts, and it is winning. Which heart do you play?', accept: ['3h'], wrong: { Kh: 'The ace already wins for your side; the king is wasted here and is worth keeping for a trick of its own.' }, claim: 'legal', success: 'Your side wins the trick and you still hold the king.' },
    ],
  },
  {
    id: 'spades.2.nil',
    gameId: 'spades',
    stage: 'stage-2',
    title: 'Cover your partner’s nil',
    minutes: 2,
    start: position({ hands: [L(['Ac', '5c', 'Qh', '2d']), L(['Kc', '7d', '3h', 'Js']), L(['9c', '4d', 'Th', '2s']), L(['6h', 'Jd', '4s'])], trick: [{ seat: 3, card: '8c' }], leader: 3, bids: [3, 4, 0, 4] }),
    steps: [
      { kind: 'say', text: 'Your partner bid nil: one trick for them costs your side {nil:value}. Your job is to win the tricks they might otherwise be stuck with.' },
      { kind: 'askMove', text: 'Your partner plays last to this club trick. Make sure they do not win it.', accept: ['Ac'], wrong: { '5c': 'Then your partner, playing last, may be forced to win with a high club.' }, claim: 'legal', success: 'Your ace takes it; your partner can throw anything.' },
    ],
  },
  {
    id: 'spades.2.bags',
    gameId: 'spades',
    stage: 'stage-2',
    title: 'Enough is enough',
    minutes: 2,
    start: position({ hands: [L(['Kd', '4d', '7h', 'Jc']), L(['9c', 'Ah', '2s']), L(['8c', '6h', 'Ts']), L(['Tc', '2h', 'Js'])], trick: [{ seat: 1, card: 'Qd' }, { seat: 2, card: '3d' }, { seat: 3, card: '5d' }], leader: 1, bids: [2, 4, 3, 4], won: [3, 2, 2, 2] }),
    steps: [
      { kind: 'say', text: 'Your side bid {bid:us} and has already won {won:us}: the bid is made. Every extra trick now is a bag, and every {bag:limit} bags cost {bag:penalty}.' },
      { kind: 'askMove', text: 'Left’s queen of diamonds is winning. Stay under it.', accept: ['4d'], wrong: { Kd: 'That wins a trick your side does not need: one more bag.' }, claim: 'legal', success: 'Let the other side take the tricks you do not need.' },
    ],
  },

  // Table-ready
  {
    id: 'spades.table.ask',
    gameId: 'spades',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'The usual game: partners, nil for {nil:value}, no blind nil, {bag:limit} bags cost {bag:penalty}, spades must be broken, the game is to {target:usual}. Tables change any of these.' },
      {
        kind: 'askChoice',
        text: 'Which question matters most before the first deal?',
        options: [
          { text: 'Is nil allowed, and what is it worth?', correct: true, why: 'Yes. Ask about blind nil, bags and the winning score too.' },
          { text: 'Which suit is trumps?', why: 'Spades, always: that is the name of the game.' },
          { text: 'Do we follow suit?', why: 'Always, when you can.' },
        ],
      },
    ],
  },
  {
    id: 'spades.table.bags',
    gameId: 'spades',
    stage: 'table',
    title: 'Bags on the scorepad',
    minutes: 2,
    start: position({ hands: [L(['As', 'Kd', '7c']), L(['5s', 'Qh', '9d']), L(['Jc', '2s', '8h']), L(['Ah', 'Td', '4c'])], leader: 0, bids: [3, 4, 2, 4], scores: [247, 180], bagCount: [7, 2] }),
    steps: [
      { kind: 'say', text: 'Scorekeepers let the last digit of a side’s score count its bags: a score of {score:us} shows {bags:us} bags.' },
      { kind: 'askNumber', text: 'How many more bags can your side take before it loses {bag:penalty}?', answer: 'bags:left', success: 'Yes: {bags:left} more and the penalty comes.' },
    ],
  },
  {
    id: 'spades.table.talk',
    gameId: 'spades',
    stage: 'table',
    title: 'Bidding without table talk',
    minutes: 1,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'It is your turn to bid. What may you say?',
        options: [
          { text: 'Just a number, or nil', correct: true, why: 'Yes. Telling your partner what you hold ("I have two aces") is table talk, and not allowed.' },
          { text: 'How many aces you hold', why: 'That is table talk: only your bid is said aloud.' },
          { text: 'Ask your partner what to bid', why: 'Partners may not discuss their hands during the bidding.' },
        ],
      },
    ],
  },
];
