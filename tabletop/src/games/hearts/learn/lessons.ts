/**
 * Hearts lessons: stage 0 (what the game is), stage 1 (the rules), stage 2 (first strategy) and
 * the Table-ready track. All prose is original; numbers are {placeholders} computed from the rules.
 * You sit in seat 0; play goes to your left (seat 1), across (seat 2), then your right (seat 3).
 */
import type { Card } from '../../classic/cards';
import type { Lesson } from '../../../teach/lesson';
import { position } from '../rules';

const L = (cards: string[]): Card[] => cards as Card[];

/** A quiet middle of a hand: three cards each, your lead. */
const MID = position({ hands: [L(['2c', 'Qh', 'Ks']), L(['7d', '9c', '4s']), L(['Jd', '3h', '8c']), L(['5d', 'Ac', '6s'])], leader: 0, broken: true });

/** A whole deal for the first trick; you hold the two of clubs. */
const FIRST = position({
  hands: [
    L(['2c', '6c', '7c', 'Kc', '4d', '9d', 'Qd', '3h', '8h', 'Jh', '5s', '9s', 'Js']),
    L(['3c', '8c', 'Ac', '2d', '5d', 'Td', '2h', '6h', 'Th', '2s', '6s', 'Ts', 'As']),
    L(['4c', '9c', 'Jc', '3d', '7d', 'Jd', 'Ad', '5h', '9h', 'Kh', '4s', '8s', 'Ks']),
    L(['5c', 'Tc', 'Qc', '6d', '8d', 'Kd', '4h', '7h', 'Qh', 'Ah', '3s', '7s', 'Qs']),
  ],
  leader: 0,
});

export const HEARTS_LESSONS: readonly Lesson[] = [
  // Stage 0
  {
    id: 'hearts.0.game',
    gameId: 'hearts',
    stage: 'stage-0',
    title: 'Hearts in a minute',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Hearts is for {players:four}, each playing alone, with all {deck:cards} cards dealt out: {hand:size} each. Every heart you take scores {points:heart} point against you, and the queen of spades (Q♠) scores {points:queen}. A hand holds {points:total} points in all.' },
      {
        kind: 'askChoice',
        text: 'So what are you trying to do in each hand?',
        options: [
          { text: 'Take as few points as you can', correct: true, why: 'Yes. Points are bad: the lowest score wins the game.' },
          { text: 'Win as many tricks as you can', why: 'Tricks only matter for the points inside them. A trick with no hearts and no queen costs nothing.' },
          { text: 'Collect the hearts', why: 'Each heart counts against you. Only taking every single one (shooting the moon) turns that around.' },
        ],
      },
    ],
  },
  {
    id: 'hearts.0.trick',
    gameId: 'hearts',
    stage: 'stage-0',
    title: 'A trick',
    minutes: 2,
    start: position({ hands: [L(['2c', 'Qh', 'Ks']), L(['9c', '7d', '4s']), L(['8c', 'Jd', '3h']), L(['Ac', '5d', '6s'])], leader: 1, broken: true }),
    steps: [
      { kind: 'show', text: 'Left leads the nine of clubs. Everyone else plays a club too, ending with you.', moves: ['9c', '8c', 'Ac', '2c'] },
      {
        kind: 'askChoice',
        text: 'Who takes that trick?',
        options: [
          { text: 'Right: the ace is the highest club', correct: true, why: 'Right. The highest card of the suit led wins, and its winner leads next.' },
          { text: 'Left, who led it', why: 'Leading does not win the trick. The highest card of the suit led does.' },
          { text: 'You, with the last card', why: 'Your two of clubs was the lowest card there.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'hearts.1.pass',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'Passing three cards',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Before play, everyone passes {pass:count} cards face down: on the first hand to the left, on the second to the right, on the third across, and on the fourth hand nobody passes. Then it starts again.' },
      { kind: 'say', text: 'You choose and pass your three before you look at the three coming to you. You always know where yours went, which is worth remembering.' },
      {
        kind: 'askChoice',
        text: 'On the third hand, where do your three cards go?',
        options: [
          { text: 'Across the table', correct: true, why: 'Yes: left, right, across, then a hand with no pass.' },
          { text: 'To the left', why: 'That is the first hand. The third goes across.' },
          { text: 'Nowhere: you keep them', why: 'That is the fourth hand, the hold.' },
        ],
      },
    ],
  },
  {
    id: 'hearts.1.lead',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'The two of clubs leads',
    minutes: 1,
    start: FIRST,
    steps: [
      { kind: 'askMove', text: 'Whoever holds the two of clubs (2♣) leads it to the first trick. That is you: play it.', accept: ['2c'], claim: 'only', success: 'Everyone must now follow with a club if they can.' },
    ],
  },
  {
    id: 'hearts.1.follow',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'Follow suit',
    minutes: 2,
    start: position({ hands: [L(['4d', 'Jd', 'Qs', '2h']), L(['7c', '5s', '6h']), L(['8c', '9s', 'Th']), L(['Tc', 'Ts', 'Jh'])], trick: [{ seat: 1, card: '9d' }, { seat: 2, card: 'Kd' }, { seat: 3, card: '3d' }], leader: 1, broken: true }),
    steps: [
      { kind: 'askMove', text: 'Diamonds were led and you hold diamonds, so you must play one. Play either diamond.', accept: ['4d', 'Jd'], claim: 'only', success: 'Only a player with no card of the suit led may play something else.' },
    ],
  },
  {
    id: 'hearts.1.void',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'When you cannot follow',
    minutes: 2,
    start: position({ hands: [L(['Qs', '2h', 'Td', '4d']), L(['8s', '6h', 'Ad']), L(['Jd', '3s', '9h']), L(['Ts', 'Jh', '2d'])], trick: [{ seat: 1, card: '5c' }, { seat: 2, card: '9c' }, { seat: 3, card: 'Kc' }], leader: 1, broken: true }),
    steps: [
      { kind: 'say', text: 'Clubs were led and you have none, so you may play any card at all. This is when points change hands.' },
      { kind: 'askMove', text: 'Right’s king of clubs is winning. Throw the queen of spades onto it.', accept: ['Qs'], wrong: { '2h': 'That gives Right a point, but you keep the queen, worth far more.', Td: 'Safe, but this was the moment to get rid of the queen.', '4d': 'Safe, but this was the moment to get rid of the queen.' }, claim: 'legal', success: 'The trick, and the queen’s {points:queen} points, go to Right.' },
    ],
  },
  {
    id: 'hearts.1.break',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'Breaking hearts',
    minutes: 2,
    start: position({ hands: [L(['3h', '9h', '4c', 'Jc']), L(['Kd', '5s', '7h', '8d']), L(['2d', 'Qs', '6c', 'Th']), L(['As', '9c', '4h', 'Jd'])], leader: 0, broken: false }),
    steps: [
      { kind: 'say', text: 'You may not lead a heart until a heart has been thrown on an earlier trick: that first heart "breaks" hearts. A player holding nothing but hearts may lead one anyway.' },
      { kind: 'askMove', text: 'No heart has been played yet. Lead a card you are allowed to lead.', accept: ['4c', 'Jc'], claim: 'only', success: 'Right: only your clubs may be led.' },
    ],
  },
  {
    id: 'hearts.1.moon',
    gameId: 'hearts',
    stage: 'stage-1',
    title: 'Shooting the moon',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'There is one way to turn the points around. Take every heart and the queen of spades in one hand, and you have shot the moon: you score nothing, and the others take the points instead.' },
      { kind: 'askNumber', text: 'Under the usual rule, how many points does each other player score when you shoot the moon?', answer: 'points:moon', success: 'Yes, {points:moon} each. Some tables take {points:moon} off the shooter instead: ask before you sit.' },
    ],
  },

  // Stage 2: first strategy
  {
    id: 'hearts.2.duck',
    gameId: 'hearts',
    stage: 'stage-2',
    title: 'Duck under the winner',
    minutes: 2,
    start: position({ hands: [L(['Ad', '9d', '3d', '5c']), L(['6s', '8h', 'Jc']), L(['Qc', '4s', '2h']), L(['7c', '5h', '9s'])], trick: [{ seat: 1, card: 'Td' }, { seat: 2, card: 'Kd' }, { seat: 3, card: '2d' }], leader: 1, broken: true }),
    steps: [
      { kind: 'say', text: 'Ducking means playing under the card that is winning, so the trick goes to someone else. When you can duck, play the highest card that still ducks: it is the card most likely to win a trick by accident later.' },
      { kind: 'askMove', text: 'The king of diamonds is winning. Duck with your highest safe diamond.', accept: ['9d'], wrong: { '3d': 'That ducks too, but keep the little diamond for later: the nine is the one that could cost you.', Ad: 'The ace wins the trick. Here it has no points, but you keep a dangerous habit.' }, claim: 'legal', success: 'Across keeps the trick; your low diamond stays to duck again.' },
    ],
  },
  {
    id: 'hearts.2.dump',
    gameId: 'hearts',
    stage: 'stage-2',
    title: 'Get rid of the queen',
    minutes: 2,
    start: position({ hands: [L(['Qs', 'Kh', '4d', '7s']), L(['Kc', '5d', '8s', '4h']), L(['Jd', '2s', '9h']), L(['Td', '3s', '6h'])], trick: [{ seat: 2, card: '8c' }, { seat: 3, card: 'Ac' }], leader: 2, broken: true }),
    steps: [
      { kind: 'askMove', text: 'You have no clubs, and the ace of clubs is sure to win this trick. What do you throw?', accept: ['Qs'], wrong: { Kh: 'A heart is one point; the queen is {points:queen}. Throw the queen while it is safe.', '4d': 'Safe, but the queen stays in your hand to catch you later.', '7s': 'Safe, but the queen stays in your hand to catch you later.' }, claim: 'legal', success: 'The queen goes to Right’s ace. You will rarely get a safer moment.' },
    ],
  },
  {
    id: 'hearts.2.smoke',
    gameId: 'hearts',
    stage: 'stage-2',
    title: 'Smoke out the queen',
    minutes: 2,
    start: position({ hands: [L(['3s', '5s', 'Kd', '8c']), L(['As', '4h', 'Jd', '2c']), L(['Qs', '9d', '7h', 'Tc']), L(['Ks', '6d', 'Jh', '4c'])], leader: 0, broken: true }),
    steps: [
      { kind: 'say', text: 'When the queen of spades is still out and you hold only low spades, lead them. Each spade lead asks the player with the queen to play one; sooner or later it falls on someone else’s ace or king.' },
      { kind: 'askMove', text: 'Lead a spade that cannot win the trick.', accept: ['3s', '5s'], wrong: { Kd: 'A high diamond lead may win a trick with points on it. The low spade is safer and hunts the queen.', '8c': 'Possible, but the low spade hunts the queen at no risk to you.' }, claim: 'legal', success: 'Whoever holds the ace or king of spades now has a problem, not you.' },
    ],
  },
  {
    id: 'hearts.2.pass',
    gameId: 'hearts',
    stage: 'stage-2',
    title: 'What to pass',
    minutes: 2,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'You hold the queen and ace of spades with only two small spades, the king of hearts, and plenty of low clubs. Which three do you pass?',
        options: [
          { text: 'The queen and ace of spades and the king of hearts', correct: true, why: 'Yes: the cards that catch the most points go. With few spades, the queen is hard to protect.' },
          { text: 'Your three lowest clubs', why: 'Low cards are your best friends in Hearts: they let you duck.' },
          { text: 'Your two small spades and a club', why: 'Then the queen and ace stay with nothing to hide behind.' },
        ],
      },
    ],
  },

  // Table-ready
  {
    id: 'hearts.table.ask',
    gameId: 'hearts',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Hearts has many house rules. The usual game: pass left, right, across and hold; the two of clubs leads; no points on the first trick; hearts must be broken; the moon gives {points:moon} to each of the others; the game ends at {target:usual}.' },
      {
        kind: 'askChoice',
        text: 'Which question is worth asking at a new table?',
        options: [
          { text: 'Does shooting the moon add to the others or take from me?', correct: true, why: 'Yes. Ask about the pass, the first trick, breaking hearts and the jack of diamonds too.' },
          { text: 'Are aces high?', why: 'Aces are always high in Hearts.' },
          { text: 'How many cards does each player get?', why: 'With four players it is always {hand:size} each.' },
        ],
      },
    ],
  },
  {
    id: 'hearts.table.score',
    gameId: 'hearts',
    stage: 'table',
    title: 'Keeping the score',
    minutes: 2,
    start: position({ hands: [L(['Ac']), L(['5d']), L(['6d']), L(['7d'])], tricks: [[{ seat: 0, card: 'Ah' }, { seat: 1, card: '2h' }, { seat: 2, card: '3h' }, { seat: 3, card: '4h' }]], leader: 0, broken: true, scores: [37, 52, 18, 40], winner: 1 }),
    steps: [
      { kind: 'say', text: 'At the end of each hand everyone counts the points in their own tricks, and one player writes the totals down. Check that the hand’s points add up to {points:total}.' },
      { kind: 'askNumber', text: 'You had {score:me} before this hand and took {taken:me} points in it. What is your new total?', answer: 'total:me', success: 'Yes, {total:me}. The game goes on until someone reaches {target:usual}.' },
    ],
  },
  {
    id: 'hearts.table.manners',
    gameId: 'hearts',
    stage: 'table',
    title: 'Passing at a real table',
    minutes: 1,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'Three cards are slid face down towards you. When may you pick them up?',
        options: [
          { text: 'Once you have chosen and passed your own three', correct: true, why: 'Yes. Choose first, then pick up: it keeps the pass fair.' },
          { text: 'At once, to help you choose', why: 'Looking first is the one thing the pass forbids.' },
          { text: 'Only after the first trick', why: 'You need them in your hand for the first trick. Pick them up once yours have gone.' },
        ],
      },
    ],
  },
];
