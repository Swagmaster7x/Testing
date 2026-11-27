/**
 * Brisca lessons: stage 0 (what the game is), stage 1 (the rules), stage 2 (first strategy) and
 * the Table-ready track. All prose is original. Numbers are {placeholders} computed from the rules;
 * "best" claims are made only in endgames, where the exact solver proves them.
 */
import type { Lesson } from '../../../teach/lesson';
import { position } from '../rules';

const MID = position({ trump: 'Rc', me: ['Ao', '5b', 'Sc'], them: ['2o', '7e', 'Cb'] });

export const BRISCA_LESSONS: readonly Lesson[] = [
  // Stage 0
  {
    id: 'brisca.0.game',
    gameId: 'brisca',
    stage: 'stage-0',
    title: 'Brisca in a minute',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Brisca is a trick-taking game for two, played with a Spanish pack of {deck:cards} cards in {deck:suits} suits: oros (coins), copas (cups), espadas (swords) and bastos (clubs). Each player holds three cards at a time.' },
      { kind: 'say', text: 'Some cards carry points: the As {value:A}, the Tres {value:3}, the Rey {value:R}, the Caballo {value:C} and the Sota {value:S}. The rest carry none. The whole pack holds {points:total} points.' },
      {
        kind: 'askChoice',
        text: 'What wins a hand?',
        options: [
          { text: '{points:win} points or more in the tricks you take', correct: true, why: 'Yes. More than half of the {points:total} points wins.' },
          { text: 'Taking the most tricks', why: 'No. Tricks only matter for the points in them; a single trick with an As and a Tres is worth more than ten tricks of blank cards.' },
          { text: 'Exactly {points:half} points', why: 'That is half, which is a tie at most tables. You need {points:win}.' },
        ],
      },
    ],
  },
  {
    id: 'brisca.0.trick',
    gameId: 'brisca',
    stage: 'stage-0',
    title: 'A trick in pictures',
    minutes: 2,
    start: position({ trump: 'Rc', me: ['3o', '5b', 'Sc'], them: ['Ro', '2e', '6b'] }),
    steps: [
      { kind: 'show', text: 'You lead the Tres de oros. The CPU answers with the Rey de oros.', moves: ['3o', 'Ro'] },
      { kind: 'say', text: 'Same suit, so the stronger card wins. In Brisca the Tres beats the Rey: you take the trick and its {pile:me} points, then both of you draw a card.' },
      {
        kind: 'askChoice',
        text: 'Which card is stronger?',
        options: [
          { text: 'The Tres', correct: true, why: 'Right. Only the As beats the Tres in its suit. This trips up almost every beginner.' },
          { text: 'The Rey', why: 'Not in Brisca: the Tres is second only to the As.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'brisca.1.pack',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'The Spanish pack',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Each suit has {deck:per-suit} cards: the As, the Dos to the Siete, and three figures: the Sota (the page), the Caballo (the knight, a rider on a horse) and the Rey (the king). There are no eights or nines.' },
      { kind: 'say', text: 'The frame around each card is broken to show the suit: no break for oros, one for copas, two for espadas, three for bastos. The colours help too, but the shapes are enough.' },
      {
        kind: 'askChoice',
        text: 'Which figure shows a rider on a horse?',
        options: [
          { text: 'The Caballo', correct: true, why: 'Yes: caballo means horse.' },
          { text: 'The Sota', why: 'The Sota is the page, standing. The Caballo rides.' },
          { text: 'The Rey', why: 'The Rey wears the crown. The Caballo is the rider.' },
        ],
      },
    ],
  },
  {
    id: 'brisca.1.order',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'Which card is stronger',
    minutes: 3,
    start: MID,
    steps: [
      { kind: 'say', text: 'In every suit, strongest first: As, Tres, Rey, Caballo, Sota, then Siete, Seis, Cinco, Cuatro and Dos. The As and the Tres are called the briscas.' },
      { kind: 'askNumber', text: 'How many points is the Tres worth?', answer: 'value:3', success: 'Yes, {value:3}, just behind the As at {value:A}.' },
      {
        kind: 'askChoice',
        text: 'Two cards of the same suit: the Sota and the Siete. Which wins?',
        options: [
          { text: 'The Sota', correct: true, why: 'Right. The figures beat the number cards, and the Sota is worth {value:S} points too.' },
          { text: 'The Siete', why: 'No. The Siete is the strongest of the blank cards, but every figure beats it.' },
        ],
      },
    ],
  },
  {
    id: 'brisca.1.trumps',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'Trumps',
    minutes: 3,
    start: position({ trump: 'Rc', me: ['2c', '5b', 'Sb'], them: ['4o', '6e'], trick: [{ seat: 1, card: 'Ao' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'After the deal, the next card is turned face up and slid under the stock. Its suit is trumps (triunfo, tree-OON-foh) for the whole hand. Here the Rey de copas is turned: copas are trumps.' },
      {
        kind: 'askChoice',
        text: 'Which suit is trumps here?',
        options: [
          { text: 'Copas', correct: true, why: 'Yes: the suit of the turned card.' },
          { text: 'Oros', why: 'Oros is the suit the CPU led. Trumps are the suit of the card under the stock: copas.' },
        ],
      },
      { kind: 'say', text: 'Any trump beats any card of another suit, however strong. The CPU has led the As de oros, worth {trick:points} points.' },
      { kind: 'askMove', text: 'Take the As with your trump.', accept: ['2c'], wrong: { Sb: 'The Sota de bastos is not a trump and not oros: it cannot win this trick.', '5b': 'A bastos card cannot beat the As de oros. Only a trump can.' }, claim: 'legal', success: 'Even the Dos of trumps beats the As of another suit.' },
    ],
  },
  {
    id: 'brisca.1.trick',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'Who wins a trick',
    minutes: 3,
    start: position({ trump: 'Re', me: ['7o', 'Ab', '2e'], them: ['3c', '4b'], trick: [{ seat: 1, card: '5o' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'A trick goes to the highest trump in it. With no trump, it goes to the higher card of the suit led. A card of any other suit never wins, whatever its rank.' },
      { kind: 'askMove', text: 'The CPU led the Cinco de oros. Win the trick without spending your trump.', accept: ['7o'], wrong: { Ab: 'The As de bastos is strong, but bastos were not led and are not trumps: it loses.', '2e': 'That wins too, but it spends a trump. The Siete de oros wins in the suit led.' }, claim: 'legal', success: 'Right: the Siete beats the Cinco in the suit led.' },
      {
        kind: 'askChoice',
        text: 'You lead the Rey de bastos. The CPU plays the As de oros, and espadas are trumps. Who takes the trick?',
        options: [
          { text: 'You: oros were not led and are not trumps', correct: true, why: 'Yes. A card of another suit never wins.' },
          { text: 'The CPU: the As is the strongest card', why: 'Only within its own suit. Here bastos were led, so the As de oros cannot win.' },
        ],
      },
    ],
  },
  {
    id: 'brisca.1.free',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'No duty to follow',
    minutes: 2,
    start: position({ trump: 'Rc', me: ['Ab', '2o', '6e'], them: ['3c', '5b'], trick: [{ seat: 1, card: '4b' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'In Brisca you may always play any card. You never have to follow the suit led, beat the card, or play a trump. That freedom is what makes the game.' },
      { kind: 'askMove', text: 'The CPU led a blank card, worth nothing. Keep your As: throw the Dos de oros instead.', accept: ['2o'], claim: 'legal', success: 'Good. Nothing was lost: the trick held no points.' },
    ],
  },
  {
    id: 'brisca.1.draw',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'Drawing after each trick',
    minutes: 2,
    start: position({ trump: 'Rc', me: ['Ao', '4b', '5e'], them: ['2o', '6b', '7e'] }),
    steps: [
      { kind: 'show', text: 'You lead the As de oros and the CPU throws the Dos.', moves: ['Ao', '2o'] },
      { kind: 'say', text: 'After every trick the winner draws the top card of the stock first, then the other player, so both hold three cards again. The winner leads the next trick.' },
      {
        kind: 'askChoice',
        text: 'Who draws first after a trick?',
        options: [
          { text: 'The player who won it', correct: true, why: 'Yes, and that player leads next.' },
          { text: 'The dealer', why: 'No: the winner of the trick draws first.' },
        ],
      },
      { kind: 'say', text: 'The turned trump card is the last card of the stock. After {tricks:drawing} tricks it is drawn by the loser of that trick, and the last {tricks:last} tricks are played without drawing.' },
    ],
  },
  {
    id: 'brisca.1.swap',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'Swapping for the turned card',
    minutes: 3,
    start: position({ trump: 'Rc', me: ['7c', '4b', '5e'], them: ['2o', '6b', '3e'] }),
    steps: [
      { kind: 'say', text: 'If you hold the Siete of trumps, you may exchange it for the turned card when that card carries points: the Sota, Caballo, Rey, Tres or As. You do it on your turn, while the card is still under the stock.' },
      { kind: 'askMove', text: 'Swap your Siete de copas for the Rey.', accept: ['swap'], claim: 'legal', success: 'Now the Rey de copas, a trump worth {value:R}, is yours.' },
      { kind: 'say', text: 'Where the table plays it, the Dos of trumps may take a turned Cuatro, Cinco, Seis or Siete in the same way. Some tables allow swaps only once you have won a trick: ask before you sit.' },
    ],
  },
  {
    id: 'brisca.1.end',
    gameId: 'brisca',
    stage: 'stage-1',
    title: 'The end of the hand',
    minutes: 3,
    start: position({ trump: 'b', me: ['3o'], them: [], stock: [], wonMe: ['Ab', '3b', 'Rb', 'Cb', 'Sb', 'Ae', '3e', 'Re', 'Ce', 'Se', 'Ac', 'Rc', 'Cc', 'Sc', '2o', '4o', '5o', '6o', '7o', '2c', '4c', '5c', '6c', '7c'], trick: [{ seat: 1, card: 'Ro' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'When the cards run out, each player counts the points in the tricks they took. More than {points:half} wins; {points:half} each is a tie at most tables.' },
      { kind: 'askMove', text: 'Last trick: the CPU led the Rey de oros. Take it.', accept: ['3o'], claim: 'legal', success: 'The Tres beats the Rey: the last trick is yours.' },
      { kind: 'askNumber', text: 'Count the points in all your tricks.', answer: 'pile:me', success: 'Yes, {pile:me}. That wins the hand.' },
    ],
  },

  // Stage 2: first strategy (endgames, every best move proved by the solver)
  {
    id: 'brisca.2.take',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'Take points cheaply',
    minutes: 3,
    start: position({ trump: 'b', me: ['3o', '2b', '5c'], them: ['Ao', '6c'], stock: [], trick: [{ seat: 1, card: 'Ro' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'When the CPU leads a card with points and you can beat it in the same suit, take it: nothing can beat you once you have played, and you keep your trumps for later.', openHand: true },
      { kind: 'askMove', text: 'The CPU led the Rey de oros and still holds the As de oros. What do you play?', accept: ['3o'], wrong: { '2b': 'Your trump wins this trick, but then the CPU’s As takes your Tres later.', '5c': 'That lets the Rey go, and your Tres is still waiting for the CPU’s As.' }, claim: 'best', success: 'The Tres takes the Rey now, before the As can catch it, and your trump is kept for the As.', openHand: true },
    ],
  },
  {
    id: 'brisca.2.save',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'Keep trumps for points',
    minutes: 3,
    start: position({ trump: 'b', me: ['3b', '5c', '6o'], them: ['Ac', '7b'], stock: [], trick: [{ seat: 1, card: '4e' }], leader: 1 }),
    steps: [
      { kind: 'say', text: 'A trick with no points is not worth a trump. Let it go with a card that carries nothing, and keep your trumps for the tricks that matter.', openHand: true },
      { kind: 'askMove', text: 'The CPU led the Cuatro de espadas, worth nothing. What do you play?', accept: ['5c', '6o'], wrong: { '3b': 'You win nothing and spend your Tres of trumps, which the As de copas will need later.' }, claim: 'best', success: 'Right: the trick was worth nothing, and your Tres of trumps waits for the As de copas.', openHand: true },
    ],
  },
  {
    id: 'brisca.2.lead',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'Lead a blank card',
    minutes: 3,
    start: position({ trump: 'b', me: ['5o', '3o', 'Sc'], them: ['Ao', '6o', 'Ro'], stock: [] }),
    steps: [
      { kind: 'say', text: 'When you lead, the CPU answers knowing your card. A card with points can be taken; a blank card gives nothing away and makes the CPU spend a card first.', openHand: true },
      { kind: 'askMove', text: 'You lead, and the CPU holds the As de oros, the one card that beats your Tres. Which card first?', accept: ['5o'], wrong: { '3o': 'The CPU takes your Tres with its As: {value:3} and {value:A} points for the CPU.' }, claim: 'best', success: 'Good: lead the blank, and keep the Tres until the As has gone.', openHand: true },
    ],
  },
  {
    id: 'brisca.2.count-trumps',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'Count the trumps',
    minutes: 3,
    start: position({ trump: 'Ce', me: ['Ae', '4o', '6c'], them: ['2b', 'Sb', '7o'], wonMe: ['3e', 'Re', '2e', '4e', 'So', 'Rc'], wonThem: ['5e', '6e', 'Ao', '3c'] }),
    steps: [
      { kind: 'say', text: 'Good players keep count of the trumps. A suit has {deck:per-suit} cards. Count the trumps you hold, the ones already played, and the turned card: the rest are still out, in the CPU’s hand or the stock.' },
      { kind: 'say', text: 'Here espadas are trumps. You hold the As, some espadas are already in the tricks played, and the Caballo is turned.' },
      { kind: 'askNumber', text: 'How many espadas have you not seen yet?', answer: 'trumps:unseen', success: 'Yes, {trumps:unseen}. If none were left, you could lead points safely.' },
    ],
  },
  {
    id: 'brisca.2.last-three',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'The last three tricks',
    minutes: 4,
    start: position({ trump: 'e', me: ['3c', '5c', '3e'], them: ['Rc', 'Sc', 'Re'], stock: [] }),
    steps: [
      { kind: 'say', text: 'Once the stock is empty, every card is known: the CPU holds exactly the cards you have not seen. Now you can work out the last three tricks.', openHand: true },
      { kind: 'say', text: 'Espadas are trumps. You hold two Treses; the CPU holds the Rey and Sota de copas and the Rey of trumps.', openHand: true },
      { kind: 'askMove', text: 'You lead. Which card keeps the most points?', accept: ['5c'], wrong: { '3c': 'The CPU trumps your Tres de copas with the Rey de espadas.', '3e': 'Your Tres of trumps wins, but takes nothing worth having; your Tres de copas is then left to be trumped.' }, claim: 'best', success: 'Leading the blank makes the CPU spend a card first, and your Treses come later, when they are safe.', openHand: true },
    ],
  },
  {
    id: 'brisca.2.finish',
    gameId: 'brisca',
    stage: 'stage-2',
    title: 'Win the last tricks',
    minutes: 3,
    start: position({ trump: 'e', me: ['3c', '5c', '3e'], them: ['Rc', 'Sc', 'Re'], stock: [] }),
    steps: [
      { kind: 'say', text: 'Play out the last three tricks against the computer, which plays them perfectly. You have the points to win if you keep your Treses safe.', openHand: true },
      { kind: 'freePlay', position: position({ trump: 'e', me: ['3c', '5c', '3e'], them: ['Rc', 'Sc', 'Re'], stock: [] }), text: 'Win the hand: finish with more than {points:half} points.', goal: 'win', maxMoves: 3, success: 'Hand won.', openHand: true },
    ],
  },

  // Table-ready
  {
    id: 'brisca.table.deal',
    gameId: 'brisca',
    stage: 'table',
    title: 'Dealing and turning trumps',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'The dealer shuffles, the other player cuts, and the dealer gives three cards each, one at a time, starting with the other player. The next card is turned face up for trumps.' },
      {
        kind: 'askChoice',
        text: 'Where does the turned card go?',
        options: [
          { text: 'Face up under the stock, so it is drawn last', correct: true, why: 'Yes. Everyone can see it all hand, and the loser of the last drawing trick takes it.' },
          { text: 'Into the dealer’s hand', why: 'No. It stays on the table, face up under the stock, until the stock runs out.' },
        ],
      },
      { kind: 'say', text: 'The player who did not deal leads the first trick. In a game of several hands, the deal passes each hand.' },
    ],
  },
  {
    id: 'brisca.table.count',
    gameId: 'brisca',
    stage: 'table',
    title: 'Counting your pile by hand',
    minutes: 3,
    start: position({ trump: 'c', me: ['5e'], them: ['4e'], stock: [], wonMe: ['Ao', '3b', 'Rc', 'Ce', 'Sb', 'Ab', '7o', '2c', 'Rb', 'Co', '6b', '3c'], trick: [], leader: 0 }),
    steps: [
      { kind: 'say', text: 'At a real table nobody counts for you. Turn your tricks over and pick out the briscas first: each As and Tres together make {value:briscas}. Then add the figures, Rey {value:R}, Caballo {value:C}, Sota {value:S}.' },
      { kind: 'askMove', text: 'Play your last card to finish the hand.', accept: ['5e'], claim: 'legal', success: 'Hand over. Now count.', reply: '4e' },
      { kind: 'askNumber', text: 'How many points are in your tricks?', answer: 'pile:me', success: 'Right: {pile:me}. Counting by briscas, then figures, is quickest.' },
    ],
  },
  {
    id: 'brisca.table.ask',
    gameId: 'brisca',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Tables differ on a few rules. Settle them before the first deal, not in the middle of a hand: whether the Siete (and the Dos) may take the turned card, and when; what happens at {points:half} each; and how many hands make a game.' },
      {
        kind: 'askChoice',
        text: 'You are about to swap your Siete of trumps before you have won a trick, and the other player objects. What went wrong?',
        options: [
          { text: 'We never agreed when swaps are allowed', correct: true, why: 'Yes. In Spain many play that you may swap only after winning a trick; in Puerto Rico most allow it any time. Ask first.' },
          { text: 'Swapping is never allowed', why: 'Most tables allow it. The question is when, so agree on it before you play.' },
        ],
      },
    ],
  },
  {
    id: 'brisca.table.manners',
    gameId: 'brisca',
    stage: 'table',
    title: 'Table manners',
    minutes: 2,
    start: MID,
    steps: [
      { kind: 'say', text: 'Keep the tricks you win face down in front of you. Most tables do not let you look back through them, so the counting is done in your head as you play.' },
      {
        kind: 'askChoice',
        text: 'Halfway through the hand you lose track of the trumps. What can you do?',
        options: [
          { text: 'Keep playing and count better next time: the tricks stay face down', correct: true, why: 'Yes. Counting as you go is the skill. Practise it in the drills.' },
          { text: 'Turn over your tricks to check', why: 'At most tables that is not allowed once a trick is turned down.' },
        ],
      },
    ],
  },
];
