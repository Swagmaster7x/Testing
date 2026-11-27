/**
 * Gin Rummy lessons: stage 0, the rules, first strategy and the Table-ready track. All prose is
 * original; numbers are {placeholders} computed from the rules (deadwood by the meld search, scores
 * by the rules' own scoring). You are seat 0, the CPU seat 1.
 */
import type { Card } from '../../classic/cards';
import type { Lesson } from '../../../teach/lesson';
import { position } from '../rules';

const L = (cards: string[]): Card[] => cards as Card[];
const THEM = L(['Ah', '2h', '3d', '4d', '5d', '8s', '9s', 'Ts', 'Qd', 'Qh']);

const MID = position({ me: L(['5h', '6h', '7h', 'Ks', 'Kd', 'Kc', '2c', '9d', '4s', 'Jc']), them: THEM, discard: L(['3c']) });

export const GIN_LESSONS: readonly Lesson[] = [
  {
    id: 'gin-rummy.0.game',
    gameId: 'gin-rummy',
    stage: 'stage-0',
    title: 'Gin Rummy in a minute',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Gin Rummy is for two. Each holds {hand:size} cards and, turn by turn, draws one and throws one away, trying to sort the hand into melds: sets of the same rank, or runs in one suit.' },
      { kind: 'say', text: 'The cards in no meld are deadwood. When your deadwood counts {knock:limit} or less you may knock, end the hand, and score the difference from the other player’s deadwood.' },
      {
        kind: 'askChoice',
        text: 'What are you trying to do?',
        options: [
          { text: 'Get most of your cards into melds, with little deadwood left', correct: true, why: 'Yes. The less deadwood, the sooner you can knock.' },
          { text: 'Collect high cards', why: 'High cards in no meld are the worst deadwood: each picture counts {value:king}.' },
          { text: 'Win tricks', why: 'There are no tricks in Gin: it is all about melds.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'gin-rummy.1.melds',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Sets and runs',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'A set is three or four cards of one rank (like your three kings). A run is three or more in a row in one suit (like your 5♥ 6♥ 7♥). In Gin the ace is low: A♣ 2♣ 3♣ is a run, Q♠ K♠ A♠ is not.' },
      {
        kind: 'askChoice',
        text: 'Which of these is a meld?',
        options: [
          { text: '8♦ 9♦ 10♦', correct: true, why: 'Yes: three in a row, one suit.' },
          { text: 'Q♠ K♠ A♠', why: 'The ace is low in Gin, so it cannot follow the king.' },
          { text: '6♣ 6♦', why: 'A set needs at least three.' },
        ],
      },
    ],
  },
  {
    id: 'gin-rummy.1.deadwood',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Counting deadwood',
    minutes: 3,
    start: MID,
    steps: [
      { kind: 'say', text: 'Deadwood counts the cards in no meld: an ace {value:ace}, two to ten their number, every picture {value:king}.' },
      { kind: 'askNumber', text: 'Your run of hearts and your kings are melds. What does your deadwood count?', answer: 'deadwood:me', success: 'Yes, {deadwood:me}: the 2♣, 4♠, 9♦ and J♣.' },
    ],
  },
  {
    id: 'gin-rummy.1.draw',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Draw from the pile or the stock',
    minutes: 2,
    start: position({ me: L(['5h', '6h', '7h', 'Ks', 'Kd', '2c', '3c', '9d', '4s', 'Jc']), them: THEM, discard: L(['8c', 'Kc']) }),
    steps: [
      { kind: 'say', text: 'Each turn starts with a draw: the top card of the stock, unseen, or the top card of the discard pile, which both of you can see.' },
      { kind: 'askMove', text: 'The king of clubs on the pile gives you three kings. Take it.', accept: ['discard'], wrong: { stock: 'The stock might give you anything; the king on the pile is a sure meld.' }, claim: 'legal', success: 'Three kings. Now you must throw a card, but not the king you just took.' },
    ],
  },
  {
    id: 'gin-rummy.1.discard',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Throw your worst card',
    minutes: 2,
    start: position({ me: L(['5h', '6h', '7h', 'Ks', 'Kd', 'Kc', '2c', '3c', '9d', '4s', 'Jd']), them: THEM, discard: L(['8c']), phase: 'discard' }),
    steps: [
      { kind: 'askMove', text: 'You drew and hold eleven cards. Throw the card that leaves the least deadwood.', accept: ['Jd'], wrong: { '9d': 'The jack counts more than the nine and belongs to no meld either.' }, claim: 'best', success: 'The jack was your most expensive loose card.' },
    ],
  },
  {
    id: 'gin-rummy.1.knock',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Knocking',
    minutes: 2,
    start: position({ me: L(['5h', '6h', '7h', 'Ks', 'Kd', 'Kc', '2c', '3c', '4c', '9d', 'As']), them: THEM, discard: L(['8c']), phase: 'discard' }),
    steps: [
      { kind: 'say', text: 'After you draw, if the cards you keep have {knock:limit} deadwood or less, you may knock: throw your last card face down and lay your hand out in melds.' },
      { kind: 'askMove', text: 'Throw the 9♦ and knock: lift it, then press Knock.', accept: ['knock:9d'], wrong: { '9d': 'That throws the nine but carries on playing. Use Knock to end the hand.' }, claim: 'legal', success: 'You knock with just the ace as deadwood.' },
    ],
  },
  {
    id: 'gin-rummy.1.layoff',
    gameId: 'gin-rummy',
    stage: 'stage-1',
    title: 'Laying off and the undercut',
    minutes: 3,
    start: position({ me: L(['5h', '6h', '7h', 'Ks', 'Kd', 'Kc', '2c', '3c', '4c', '8d']), them: L(['8h', '9h', 'Th', 'Jh', '2s', '2h', '2d', 'Ac', 'Ad', '3s']), discard: L(['Qs']) }),
    steps: [
      { kind: 'say', text: 'When you knock, the other player lays down their melds and may lay off loose cards on yours: a fourth king on your kings, the next card on either end of your runs. Then both count deadwood.', openHand: true },
      { kind: 'say', text: 'Here you hold {deadwood:me}. The other player holds {deadwood:them}, but can lay off {knock:laid} card on your clubs and is left with {knock:defender}.', openHand: true },
      {
        kind: 'askChoice',
        text: 'If you knock now, who scores?',
        openHand: true,
        options: [
          { text: 'The other player: equal or less deadwood is an undercut', correct: true, why: 'Yes: they score the difference and an undercut bonus of {undercut:bonus}, {knock:points} in all.' },
          { text: 'You, because you knocked', why: 'Knocking only scores when the other player is left with more deadwood than you.' },
          { text: 'Nobody', why: 'Someone always scores after a knock.' },
        ],
      },
    ],
  },

  // Stage 2: first strategy
  {
    id: 'gin-rummy.2.keep',
    gameId: 'gin-rummy',
    stage: 'stage-2',
    title: 'Keep the cards that can grow',
    minutes: 2,
    start: position({ me: L(['5h', '6h', '7h', 'Kd', '2c', '3c', '9d', '8d', '4s', '4c', 'As']), them: THEM, discard: L(['Jc']), phase: 'discard' }),
    steps: [
      { kind: 'say', text: 'Pairs and near-runs (two of a rank, or two cards in a row) can become melds with one draw. A lone high card cannot help you and counts the most.' },
      { kind: 'askMove', text: 'Throw the card that does the least for you.', accept: ['Kd'], wrong: { '9d': 'The 9♦ and 8♦ wait for a 7♦ or 10♦. The king is alone.', '8d': 'The 8♦ and 9♦ wait for a 7♦ or 10♦. The king is alone.', As: 'The ace counts only {value:ace}. The king counts {value:king} and joins nothing.' }, claim: 'best', success: 'The lone king goes: {value:king} points of deadwood gone at once.' },
    ],
  },
  {
    id: 'gin-rummy.2.safe',
    gameId: 'gin-rummy',
    stage: 'stage-2',
    title: 'Watch what they pick up',
    minutes: 2,
    start: position({ me: L(['5c', '6c', '7c', '2d', '2s', '2h', 'Jh', 'Qc', '4d', '8s', '3s']), them: L(['Th', '9h', 'Ah', 'Kd', 'Qd', '5s', '6s', '3d', '7d', 'Kh']), known: L(['Th']), discard: L(['4h']), phase: 'discard' }),
    steps: [
      { kind: 'say', text: 'Every card the other player takes from the pile tells you what they collect. Here they picked up the 10♥: they want hearts near it, or other tens.' },
      { kind: 'askMove', text: 'Your J♥ and Q♣ are both loose and count the same. Which do you throw?', accept: ['Qc'], wrong: { Jh: 'The J♥ sits right next to their 10♥: it may be just the card they need.' }, claim: 'legal', success: 'The queen of clubs is far from anything they have shown.' },
    ],
  },
  {
    id: 'gin-rummy.2.gin',
    gameId: 'gin-rummy',
    stage: 'stage-2',
    title: 'Knock now, or wait for gin',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Going gin (no deadwood at all) scores a bonus of {gin:bonus} on top of the other player’s whole count, and can never be undercut. Knocking early ends the hand before the other player is ready.' },
      {
        kind: 'askChoice',
        text: 'Early in the hand you could knock with nine. The other player has picked up two cards from the pile. What is the danger in knocking?',
        options: [
          { text: 'They may already have little deadwood, and undercut you', correct: true, why: 'Yes. Cards taken from the pile usually go into melds; a player who keeps picking up is often close.' },
          { text: 'None: knocking always scores', why: 'An undercut gives the other player the points and a bonus.' },
          { text: 'You must have gin to knock', why: 'Any count up to {knock:limit} may knock; gin is the best of them.' },
        ],
      },
    ],
  },

  // Table-ready
  {
    id: 'gin-rummy.table.deal',
    gameId: 'gin-rummy',
    stage: 'table',
    title: 'The deal and the first turn',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'The dealer gives {hand:size} cards each, one at a time, turns the next card face up to start the pile and puts the rest face down as the stock.' },
      {
        kind: 'askChoice',
        text: 'Who may take the turned-up card first?',
        options: [
          { text: 'The player who did not deal', correct: true, why: 'Yes. If they pass, the dealer may take it; if both pass, the non-dealer draws from the stock.' },
          { text: 'The dealer', why: 'The non-dealer is offered it first.' },
          { text: 'Nobody: it starts the pile', why: 'It starts the pile, but either player may take it on the first turn.' },
        ],
      },
    ],
  },
  {
    id: 'gin-rummy.table.score',
    gameId: 'gin-rummy',
    stage: 'table',
    title: 'The scorepad',
    minutes: 3,
    start: MID,
    steps: [
      { kind: 'say', text: 'Each hand’s points go down in a column. The first to {target:usual} wins and adds a game bonus of {game:bonus}; then each player adds a line bonus of {line:bonus} for every hand they won.' },
      { kind: 'askNumber', text: 'You finish with {example:points} points after winning three hands. What is your total with the bonuses?', answer: 'example:final', success: 'Yes, {example:final}.' },
    ],
  },
  {
    id: 'gin-rummy.table.ask',
    gameId: 'gin-rummy',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'Which is worth asking at a new table?',
        options: [
          { text: 'Do we play Oklahoma, where the first card sets the knock?', correct: true, why: 'Yes. Ask about the gin and undercut bonuses, big gin, and the game score too.' },
          { text: 'Is the ace high or low?', why: 'In Gin the ace is always low.' },
          { text: 'How many cards each?', why: 'Always {hand:size} in two-handed Gin.' },
        ],
      },
    ],
  },
];
