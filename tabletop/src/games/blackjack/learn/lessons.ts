/**
 * Blackjack lessons: stage 0, the rules, basic strategy and the Table-ready track. All prose is
 * original; numbers are {placeholders} computed from the rules, and every "best" claim is proved by
 * the expected-value engine behind the chart. Play chips only: no money words.
 */
import type { Card } from '../../classic/cards';
import type { Lesson } from '../../../teach/lesson';
import { position } from '../rules';

const C = (cards: string[]): Card[] => cards as Card[];
const MID = position({ hand: C(['Kh', '7d']), up: '9c' });

export const BLACKJACK_LESSONS: readonly Lesson[] = [
  {
    id: 'blackjack.0.game',
    gameId: 'blackjack',
    stage: 'stage-0',
    title: 'Blackjack in a minute',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'In Blackjack you play against the dealer, not the other players. Get closer to {bust:over} than the dealer without going over. Go over and you are bust: your bet is lost at once.' },
      { kind: 'say', text: 'Pictures count {value:picture}, an ace {value:ace-low} or {value:ace-high}, the rest their number. The dealer must draw to {dealer:stands} or more, whatever you hold.' },
      {
        kind: 'askChoice',
        text: 'You hold {hand:total} and the dealer busts. What happens?',
        options: [
          { text: 'You win your bet', correct: true, why: 'Yes. A dealer who busts pays every hand still standing.' },
          { text: 'Nothing: you must have twenty-one', why: 'Any hand that has not bust wins when the dealer busts.' },
          { text: 'You lose: the dealer always wins ties', why: 'A bust dealer has no total at all.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'blackjack.1.values',
    gameId: 'blackjack',
    stage: 'stage-1',
    title: 'Counting a hand',
    minutes: 1,
    start: MID,
    steps: [{ kind: 'askNumber', text: 'A king and a seven: what is your total?', answer: 'hand:total', success: 'Yes, {hand:total}: the king counts {value:picture}.' }],
  },
  {
    id: 'blackjack.1.soft',
    gameId: 'blackjack',
    stage: 'stage-1',
    title: 'Soft hands',
    minutes: 2,
    start: position({ hand: C(['Ah', '6d']), up: '9c' }),
    steps: [
      { kind: 'say', text: 'An ace counts {value:ace-high} unless that takes you over {bust:over}, when it counts {value:ace-low}. A hand with an ace still counting {value:ace-high} is soft: one more card can never bust it.' },
      {
        kind: 'askChoice',
        text: 'What do you hold?',
        options: [
          { text: 'A soft {hand:total}', correct: true, why: 'Yes. If you draw a big card, the ace drops to {value:ace-low} and you play on.' },
          { text: 'A hard {hand:total}', why: 'Hard means no ace counting {value:ace-high}. Yours does.' },
          { text: 'Seven', why: 'The ace counts {value:ace-high} here, since that keeps you under {bust:over}.' },
        ],
      },
    ],
  },
  {
    id: 'blackjack.1.hit',
    gameId: 'blackjack',
    stage: 'stage-1',
    title: 'Hit or stand',
    minutes: 2,
    start: position({ hand: C(['5h', '4d']), up: 'Tc' }),
    steps: [
      { kind: 'say', text: 'Hit takes another card; stand keeps what you have. You can hit as often as you like until you stand or bust.' },
      { kind: 'askMove', text: 'You hold {hand:total} and no card can bust you. Take a card.', accept: ['hit'], wrong: { stand: 'With {hand:total} you can only win if the dealer busts. One more card cannot hurt you.', double: 'Doubling is good with a strong start, but not against a ten showing.' }, claim: 'best', success: 'Any card helps a {hand:total}.' },
    ],
  },
  {
    id: 'blackjack.1.dealer',
    gameId: 'blackjack',
    stage: 'stage-1',
    title: 'How the dealer plays',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'The dealer has no choices: below {dealer:stands} the dealer hits, at {dealer:stands} or more the dealer stands. The felt says whether the dealer also stands on a soft {dealer:stands}.' },
      {
        kind: 'askChoice',
        text: 'The dealer holds an ace and a six, and the felt says “dealer stands on soft {dealer:stands}”. What happens?',
        options: [
          { text: 'The dealer stands', correct: true, why: 'Yes. At a table where the dealer hits soft {dealer:stands}, the dealer would draw.' },
          { text: 'The dealer draws', why: 'Only where the dealer hits soft {dealer:stands}; this felt says stand.' },
          { text: 'You choose for the dealer', why: 'Nobody chooses: the dealer’s play is fixed by the house.' },
        ],
      },
    ],
  },
  {
    id: 'blackjack.1.pays',
    gameId: 'blackjack',
    stage: 'stage-1',
    title: 'What a blackjack pays',
    minutes: 2,
    start: position({ hand: C(['Ah', 'Kd']), up: '9c', bet: 20 }),
    steps: [
      { kind: 'say', text: 'An ace and a ten-value card as your first two cards is a blackjack. A plain win pays as many chips as you bet, but a blackjack pays {pay:a} to {pay:b}. Some tables pay only {pay:c} to {pay:d}: avoid them.' },
      { kind: 'askNumber', text: 'You bet {bet} and get a blackjack paying {pay:a} to {pay:b}. How many chips do you win?', answer: 'pay:bj', success: 'Yes, {pay:bj}. At {pay:c} to {pay:d} it would be only {pay:65}.' },
    ],
  },

  // Stage 2: basic strategy
  {
    id: 'blackjack.2.stiff',
    gameId: 'blackjack',
    stage: 'stage-2',
    title: 'Let the dealer bust',
    minutes: 2,
    start: position({ hand: C(['Td', '3s']), up: '6c' }),
    steps: [
      { kind: 'say', text: 'A dealer showing a small card (two to six) busts often, because the dealer must keep drawing. With a total that a big card would bust, stand and let the dealer take that risk.' },
      { kind: 'askMove', text: 'You hold {hand:total}; the dealer shows a 6♣.', accept: ['stand'], wrong: { hit: 'A ten-value card busts you, and the dealer is the one likely to bust here.' }, claim: 'best', success: 'Standing is worth clearly more than hitting here, by the expected value behind the chart.' },
    ],
  },
  {
    id: 'blackjack.2.double',
    gameId: 'blackjack',
    stage: 'stage-2',
    title: 'Double down',
    minutes: 2,
    start: position({ hand: C(['6h', '5d']), up: '6c' }),
    steps: [
      { kind: 'say', text: 'Doubling puts out a second bet equal to the first, for exactly one more card. It is worth it when you start strong and the dealer is weak.' },
      { kind: 'askMove', text: 'You hold {hand:total} against a 6♣.', accept: ['double'], wrong: { hit: 'Hitting wins often here; doubling wins twice as much for the same good chances.', stand: 'With {hand:total} you cannot bust on one card: never stand here.' }, claim: 'best', success: 'Any ten-value card gives you {bust:over}, and the dealer may bust anyway.' },
    ],
  },
  {
    id: 'blackjack.2.split',
    gameId: 'blackjack',
    stage: 'stage-2',
    title: 'Split eights',
    minutes: 2,
    start: position({ hand: C(['8h', '8d']), up: '6c' }),
    steps: [
      { kind: 'say', text: 'Two cards of the same value may be split into two hands, with a second bet. Two eights make a poor total together but a fair start each.' },
      { kind: 'askMove', text: 'You hold two eights against a 6♣.', accept: ['split'], wrong: { stand: 'Together they are a total that a big card busts; apart, each hand starts at eight against a weak dealer.', hit: 'Together they are a total that a big card busts; apart, each hand starts at eight.' }, claim: 'best', success: 'Two hands from eight, against a dealer likely to bust.' },
    ],
  },
  {
    id: 'blackjack.2.soft18',
    gameId: 'blackjack',
    stage: 'stage-2',
    title: 'Soft eighteen against a nine',
    minutes: 2,
    start: position({ hand: C(['Ah', '7d']), up: '9c' }),
    steps: [
      { kind: 'say', text: 'A soft hand cannot bust with one card, so hitting it costs little. Against a strong dealer card even a soft {hand:total} is worth improving.' },
      { kind: 'askMove', text: 'You hold a soft {hand:total} against a 9♣.', accept: ['hit'], wrong: { stand: 'A dealer showing a nine often finishes on nineteen; your total wins less often than it looks.' }, claim: 'best', success: 'Hitting is worth more by expected value: this is one of the chart’s surprises.' },
    ],
  },
  {
    id: 'blackjack.2.insurance',
    gameId: 'blackjack',
    stage: 'stage-2',
    title: 'Insurance',
    minutes: 2,
    start: position({ hand: C(['Kh', '9d']), up: 'Ac', bet: 20 }),
    steps: [
      { kind: 'say', text: 'Against an ace you may insure for half your bet ({cost:insurance} here); it pays {insurance:pays} to one if the dealer has blackjack.' },
      {
        kind: 'askChoice',
        text: 'Playing basic strategy, should you insure?',
        options: [
          { text: 'No: it loses in the long run', correct: true, why: 'Right. Fewer than one card in three is a ten, and the bet needs one in three to break even. Only a counter knows when the shoe is rich in tens.' },
          { text: 'Yes, with a good hand to protect', why: 'Insurance is a separate bet on the dealer’s hidden card; your hand does not change its odds.' },
          { text: 'Yes, always', why: 'It loses chips over time.' },
        ],
      },
    ],
  },

  // Table-ready
  {
    id: 'blackjack.table.signals',
    gameId: 'blackjack',
    stage: 'table',
    title: 'Hand signals',
    minutes: 1,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'At a real table, how do you ask for another card?',
        options: [
          { text: 'Tap the felt behind your cards', correct: true, why: 'Yes. Wave a flat hand over your cards to stand. Signals are used so the cameras and the dealer agree.' },
          { text: 'Pick up your cards', why: 'In a shoe game you never touch your cards.' },
          { text: 'Push more chips forward', why: 'Extra chips mean a double or a split, not a hit.' },
        ],
      },
    ],
  },
  {
    id: 'blackjack.table.count',
    gameId: 'blackjack',
    stage: 'table',
    title: 'Keeping the count',
    minutes: 3,
    start: position({ hand: C(['2h', '5d']), up: '4h', others: [C(['Kc', '6s']), C(['Td', 'Ac'])] }),
    steps: [
      { kind: 'say', text: 'Counters keep a running count of every card they see: each two to six adds one, each ten, picture or ace takes one away, sevens to nines change nothing. A high count means many tens are left.' },
      { kind: 'askNumber', text: 'Count every card on the table, the dealer’s too. What is the running count?', answer: 'count:running', success: 'Yes, {count:running}. Divided by the decks left, it becomes the true count.' },
    ],
  },
  {
    id: 'blackjack.table.ask',
    gameId: 'blackjack',
    stage: 'table',
    title: 'Read the felt, then ask',
    minutes: 2,
    start: MID,
    steps: [
      {
        kind: 'askChoice',
        text: 'Which rule makes the biggest difference to you?',
        options: [
          { text: 'Whether blackjack pays {pay:a} to {pay:b} or {pay:c} to {pay:d}', correct: true, why: 'Yes. The lower payout costs more than any other common rule. Ask about soft {dealer:stands}, doubling, splits and surrender too.' },
          { text: 'The colour of the chips', why: 'Chip colours change nothing; the rules on the felt do.' },
          { text: 'Which seat you take', why: 'Every seat plays the same odds.' },
        ],
      },
    ],
  },
];
