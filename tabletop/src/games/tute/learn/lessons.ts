/**
 * Tute lessons: stage 0 (what the game is), stage 1 (the rules), stage 2 (first strategy) and the
 * Table-ready track. All prose is original. Numbers are {placeholders} computed from the rules;
 * "best" claims are made only in endgames, where the exact solver proves them.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Card, PlayedCard, TuteConfig } from '../rules';
import { DECK, position } from '../rules';

type Spot = Parameters<typeof position>[0];

/** A lesson position: one hand to play, so the game ends with it. */
const at = (p: Spot): string => position({ ...p, config: { matchTo: 1, ...p.config } });
const trick = (...plays: [number, Card][]): PlayedCard[] => plays.map(([seat, card]) => ({ seat, card }));

/** A full deal: Left deals and turns the Caballo de bastos; you lead. You hold the Rey and Caballo de copas. */
const DEAL = at({
  trump: 'Cb',
  dealer: 3,
  hands: [
    ['Ao', '3c', 'Rc', 'Cc', '5e', '7e', 'Sb', '4b', '6o', '2c'],
    ['3o', 'Ro', 'Ac', '4c', 'Ae', 'Ce', '2e', 'Rb', '7b', '5o'],
    ['Co', 'So', '7o', 'Sc', '5c', '3e', 'Re', 'Ab', '3b', '6c'],
    ['4o', '2o', '7c', '6e', '4e', 'Se', 'Cb', '6b', '5b', '2b'],
  ],
  leader: 0,
  canteOpen: false,
});

/** Mid-hand, four cards each; Left has led. */
const leftLed = (led: Card, mine: Card[], config: Partial<TuteConfig> = {}) =>
  at({ trump: 'b', hands: [mine, ['7o', '2c', '3c', 'Sc'], ['5o', '6o', '4c', '5c'], ['Co', 'Ro', '7c']], trick: trick([3, led]), leader: 3, config });

/** The finish: copas are trumps; your partner has no oros and holds a trump. */
const FINISH_HANDS: Card[][] = [
  ['6e', '4c', 'Ro'],
  ['Ao', 'So', '7b'],
  ['Cc', '2b', '5b'],
  ['2e', 'Ac', '2o'],
];
const FINISH_OURS: Card[] = ['Re', 'Co', '5e', '6c', '7c', '3e', '3b', 'Se', '7e', '5c', '3c', '4e'];
const FINISH_THEIRS: Card[] = DECK.filter((c) => !FINISH_OURS.includes(c) && !FINISH_HANDS.flat().includes(c));
const FINISH = at({ trump: 'c', hands: FINISH_HANDS, leader: 0, lastWinner: 0, won: [FINISH_OURS, FINISH_THEIRS], canteOpen: false });

/** Two players: the CPU has led the As de oros to the first trick; the stock is full. */
const TWO_FREE = at({
  players: 2,
  trump: '4b',
  dealer: 0,
  hands: [
    ['Co', '5c', '6e', '7e', 'Sb', '3c', 'Ae', '2o'],
    ['2c', '4c', '7c', 'Sc', '4e', '5e', '6o'],
  ],
  trick: trick([1, 'Ao']),
  leader: 1,
  canteOpen: false,
});

/** Two players: you have won a trick; the Rey de oros is turned under the stock and you hold the Siete. */
const TWO_SWAP = at({
  players: 2,
  trump: 'Ro',
  hands: [
    ['7o', 'Ae', '6e', '7e', '2e', '3e', '4e', 'Se'],
    ['4c', '5c', '6c', '7c', 'Sc', '2c', '3c', 'Cc'],
  ],
  stock: ['Ab', '3b', 'Cb', 'Sb', '6b'],
  leader: 0,
  lastWinner: 0,
  won: [[], []],
});

export const TUTE_LESSONS: readonly Lesson[] = [
  // Stage 0
  {
    id: 'tute.0.game',
    gameId: 'tute',
    stage: 'stage-0',
    title: 'Tute in a minute',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Tute (TOO-teh) is played by {players:four} in two pairs: your partner sits opposite you. The Spanish pack of {deck:cards} cards is dealt out, {hand:four} each.' },
      { kind: 'say', text: 'The cards and their points are Brisca’s: As {value:A}, Tres {value:3}, Rey {value:R}, Caballo {value:C}, Sota {value:S}, the rest nothing. Two things make Tute different: you must follow suit and win the trick when you can, and a Rey with the Caballo of its suit can be sung for points.' },
      {
        kind: 'askChoice',
        text: 'Who is your partner?',
        options: [
          { text: 'The player sitting opposite you', correct: true, why: 'Yes. Your side’s tricks and points are counted together.' },
          { text: 'The player on your right', why: 'No: the player on your right plays just after you, for the other side.' },
          { text: 'Whoever wins the first trick', why: 'No: partners are fixed for the whole game, sitting opposite.' },
        ],
      },
    ],
  },
  {
    id: 'tute.0.trick',
    gameId: 'tute',
    stage: 'stage-0',
    title: 'A trick for four',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'show', text: 'You lead the Seis de oros. Play goes to the right: each player must follow suit, and beat the best card so far if they can.', moves: ['6o', 'Ro', '7o', '2o'] },
      {
        kind: 'askChoice',
        text: 'Right beat your Seis with the Rey; your partner and Left could not beat the Rey. Who takes the trick?',
        options: [
          { text: 'Right, with the Rey de oros', correct: true, why: 'Yes: the highest card of the suit led wins. Right’s side takes {pile:them} points.' },
          { text: 'Your partner, with the Siete', why: 'No: the Siete is lower than the Rey.' },
          { text: 'You, because you led', why: 'No: leading does not win a trick. The highest card of the suit led does, unless someone trumps.' },
        ],
      },
    ],
  },

  // Stage 1: the rules
  {
    id: 'tute.1.cards',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'The cards and their points',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'In every suit, strongest first: As, Tres, Rey, Caballo, Sota, then Siete, Seis, Cinco, Cuatro and Dos. The Tres beats the Rey, as in Brisca.' },
      { kind: 'askNumber', text: 'Each suit holds {value:suit} points. How many points are in the whole pack?', answer: 'points:total', success: 'Yes, {points:total}. The side that takes the last trick adds {points:last} more: {points:hand} in a hand, before any cantes.' },
      {
        kind: 'askChoice',
        text: 'Same suit: the Tres and the Rey. Which wins?',
        options: [
          { text: 'The Tres', correct: true, why: 'Right: only the As beats the Tres in its suit.' },
          { text: 'The Rey', why: 'Not in Tute: the Tres is second only to the As.' },
        ],
      },
    ],
  },
  {
    id: 'tute.1.deal',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'The deal and trumps',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'The dealer gives out every card, one at a time to the right, {hand:four} each. The dealer’s own last card is turned face up: its suit is trumps (triunfo, tree-OON-foh). Then the dealer takes it into hand, and everyone knows it is there.' },
      {
        kind: 'askChoice',
        text: 'Here Left dealt and turned the Caballo de bastos. Which suit is trumps?',
        options: [
          { text: 'Bastos', correct: true, why: 'Yes: the suit of the turned card, for the whole hand.' },
          { text: 'Oros', why: 'No: trumps are the suit of the turned card, here bastos.' },
          { text: 'None until a trick is played', why: 'No: trumps are known from the deal, and Left’s Caballo stays face up in Left’s hand until it is played.' },
        ],
      },
      { kind: 'say', text: 'The player on the dealer’s right leads to the first trick: here, you.' },
    ],
  },
  {
    id: 'tute.1.follow',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Follow suit',
    minutes: 2,
    start: leftLed('Ce', ['4e', '5e', 'Ao', '6c']),
    steps: [
      { kind: 'say', text: 'If you hold a card of the suit led, you must play one: asistir (ah-sees-TEER). The app dims the cards you may not play, and tells you why if you press one.' },
      { kind: 'askMove', text: 'Left led the Caballo de espadas. Play a card you are allowed to.', accept: ['4e', '5e'], claim: 'only', success: 'Right: neither of your espadas can beat the Caballo, so either will do.' },
      {
        kind: 'askChoice',
        text: 'Why could you not play your As de oros?',
        options: [
          { text: 'You held espadas, the suit led', correct: true, why: 'Yes. Only once you have none of the suit led may you play another suit.' },
          { text: 'An As may never be played to a trick someone else led', why: 'No: any card may be played when the rules allow it. Here you held espadas.' },
          { text: 'Oros are trumps', why: 'No: bastos are trumps here. You held espadas, so you had to follow.' },
        ],
      },
    ],
  },
  {
    id: 'tute.1.beat',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Win the trick if you can',
    minutes: 2,
    start: leftLed('Re', ['3e', '4e', 'Ao', '6c']),
    steps: [
      { kind: 'say', text: 'Following suit, you must also beat the best card of the suit so far if you can: montar (mon-TAR).' },
      { kind: 'askMove', text: 'Left led the Rey de espadas. What must you play?', accept: ['3e'], claim: 'only', success: 'Yes: the Tres beats the Rey, so you must play it. The Cuatro would only follow.' },
      { kind: 'say', text: 'If someone has already trumped the trick, no card of the suit led can win it: then any card of the suit will do.' },
    ],
  },
  {
    id: 'tute.1.trump',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Trump when you cannot follow',
    minutes: 3,
    start: at({ trump: 'b', hands: [['2b', '7b', '5e', '6c'], ['Ao', '3o', '4c', '5c'], ['5o', '6o', '7c'], ['Sc', '7e', '6e']], trick: trick([2, 'Ro'], [3, '4b']), leader: 2 }),
    steps: [
      { kind: 'say', text: 'If you cannot follow suit, you must play a trump if you have one: fallar (fah-YAR). If a trump is already in the trick, you must beat it if you can.' },
      { kind: 'askMove', text: 'Your partner led the Rey de oros and Left trumped with the Cuatro de bastos. You have no oros. What must you play?', accept: ['7b'], claim: 'only', success: 'Right: the Siete beats the Cuatro, so you must overtrump. Holding only lower trumps, you could have played any card.' },
      {
        kind: 'askChoice',
        text: 'Would you have to trump if your own partner were winning the trick?',
        options: [
          { text: 'Yes, at most tables: the duties do not depend on who is winning', correct: true, why: 'Yes. Some tables relax the rule for a partner; ask before you sit.' },
          { text: 'Never: you would throw your cheapest card', why: 'Only where the table plays it that way. By the common rule the duties hold whoever is winning.' },
        ],
      },
    ],
  },
  {
    id: 'tute.1.sing',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Singing the twenty',
    minutes: 3,
    start: at({ trump: 'b', hands: [['Rc', 'Cc', 'Ao', '5e'], ['7o', '2c', '3c', 'Sc'], ['5o', '6o', '4c', '5c'], ['Co', 'Ro', '7c', '4o']], leader: 0, lastWinner: 0 }),
    steps: [
      { kind: 'say', text: 'Holding the Rey and the Caballo of one suit, you may sing them (cantar, kahn-TAR) once your side has won a trick: {cante:plain} points in a plain suit, las veinte.' },
      { kind: 'askMove', text: 'Your side has just won a trick and you lead. Sing your pair of copas before you play a card.', accept: ['sing-c'], claim: 'legal', success: 'Las veinte en copas: {cante:plain} points for your side. The two cards stay in your hand, shown to everyone.' },
      { kind: 'askNumber', text: 'How many points have your side’s cantes made so far?', answer: 'cantes:us', success: 'Yes, {cantes:us}. One cante per trick won, so a second pair must wait for the next trick your side takes.' },
    ],
  },
  {
    id: 'tute.1.forty',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Las cuarenta',
    minutes: 3,
    start: at({ trump: 'b', hands: [['Rb', 'Cb', '4c', 'Ao'], ['7o', '2c', '3c', 'Sc'], ['5o', '6o', '7c'], ['Co', 'Ro', '4o']], trick: trick([2, '5c'], [3, '6c']), leader: 2, lastWinner: 2 }),
    steps: [
      { kind: 'say', text: 'A pair in trumps is worth {cante:trumps}: las cuarenta. At most tables either partner may sing after their side wins a trick, during the next trick, before playing a card.' },
      { kind: 'askMove', text: 'Your partner won the last trick and has led again. Before you play, sing your Rey and Caballo of trumps.', accept: ['sing-b'], claim: 'legal', success: 'Las cuarenta! {cante:trumps} points for your side.' },
      {
        kind: 'askChoice',
        text: 'Holding a pair in copas and the pair in trumps, with one cante to make, which comes first?',
        options: [
          { text: 'The cuarenta, in trumps', correct: true, why: 'Yes: many tables require the cuarenta first, and it is worth more if no other chance comes.' },
          { text: 'The veinte, keeping the cuarenta for later', why: 'Many tables forbid it, and a later chance may never come.' },
        ],
      },
    ],
  },
  {
    id: 'tute.1.tute',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Tute: four of a kind',
    minutes: 2,
    start: at({ trump: 'b', hands: [['Ro', 'Rc', 'Re', 'Rb'], ['7o', '2c', '3c', 'Sc'], ['5o', '6o', '4c', '5c'], ['Co', '2o', '7c', '4o']], leader: 0, lastWinner: 0 }),
    steps: [
      { kind: 'say', text: 'All four Reyes, or all four Caballos, in one player’s hand is a tute. Declare it like a cante, after your side wins a trick. By the common rule it wins the game at once; some tables count it as two games instead.' },
      { kind: 'askMove', text: 'You hold all four Reyes and your side has just won a trick. Declare it.', accept: ['tute-R'], claim: 'legal', success: 'Tute! The game is yours.' },
    ],
  },
  {
    id: 'tute.1.last',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'The last ten and the count',
    minutes: 3,
    start: at({ trump: 'b', hands: [['4o'], [], [], []], trick: trick([1, '5o'], [2, 'Ao'], [3, '7o']), leader: 1 }),
    steps: [
      { kind: 'say', text: 'The side that takes the last trick adds {points:last}: las diez de últimas (dee-ETH deh OOL-tee-mahs). A hand holds {points:hand} points before the cantes.' },
      { kind: 'askMove', text: 'Last trick: your partner’s As de oros is winning. Play your last card.', accept: ['4o'], claim: 'only', success: 'The trick and the last ten are your side’s.' },
      { kind: 'askNumber', text: 'Count your side’s points for the hand: the cards in your tricks, the last ten and any cantes.', answer: 'result:us', success: 'Yes, {result:us}. More than the other side wins the hand.', openPiles: true },
    ],
  },
  {
    id: 'tute.1.two',
    gameId: 'tute',
    stage: 'stage-1',
    title: 'Two players and the stock',
    minutes: 3,
    start: TWO_FREE,
    steps: [
      { kind: 'say', text: 'Two can play with a stock: {hand:two} cards each, the next card turned for trumps and slid under the stock, and after each trick the winner draws first.' },
      { kind: 'askMove', text: 'The CPU led the As de oros and the stock is full. You need not follow or beat while the stock lasts: keep your Dos de oros and throw the Cinco de copas.', accept: ['5c'], claim: 'legal', success: 'Allowed: at most tables there is no duty to follow, beat or trump until the stock is gone.' },
      { kind: 'say', text: 'Once the stock is gone, every duty applies for the last {tricks:last-two} tricks.' },
      { kind: 'askMove', position: TWO_SWAP, text: 'You have won a trick, and the Rey de oros is turned under the stock. Exchange your Siete of trumps for it.', accept: ['swap'], claim: 'legal', success: 'The Rey of trumps is yours, worth {value:R} and half of a cuarenta. The Dos may take a turned Cuatro to Siete in the same way.' },
    ],
  },

  // Stage 2: first strategy (endgames, every best move proved by the solver)
  {
    id: 'tute.2.cash',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Cash your As',
    minutes: 3,
    start: at({ trump: 'b', hands: [['Ao', '4o', '6c'], ['Ro', '5o', '7c'], ['2o', '4c', '5c'], ['3o', 'Sc', '2c']], leader: 0, lastWinner: 0, canteOpen: false }),
    steps: [
      { kind: 'say', text: 'When you lead, the others must follow and beat if they can. An As cannot be beaten in its suit, so leading it makes everyone give up a card of the suit, points and all.', openHand: true },
      {
        kind: 'askMove',
        text: 'You lead. Left holds the Tres de oros and Right the Rey. Which card?',
        accept: ['Ao'],
        wrong: { '4o': 'Right must beat your Cuatro, and Left’s Tres then beats everything: the oros points go to them.', '6c': 'That gives the lead away and leaves the Tres de oros free to win later.' },
        claim: 'best',
        success: 'The As takes the Tres and the other oros at once.',
        openHand: true,
      },
    ],
  },
  {
    id: 'tute.2.load',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Load your partner’s trick',
    minutes: 3,
    start: at({ trump: 'b', hands: [['3c', '4c', '6e'], ['5c', '7o', '4e'], ['Sc', '5o'], ['2b', '3b']], trick: trick([2, 'Ac'], [3, '7c']), leader: 2, canteOpen: false }),
    steps: [
      { kind: 'say', text: 'When your partner’s card will surely win, give it your points: cargar (kar-GAR), to load the trick.', openHand: true },
      {
        kind: 'askMove',
        text: 'Your partner led the As de copas, which nobody can beat. Left has no copas left but holds trumps. What do you play?',
        accept: ['3c'],
        wrong: { '4c': 'The As wins anyway, and your Tres is left for Left to trump later.' },
        claim: 'best',
        success: 'The Tres goes onto your partner’s As: {value:3} safe points, and nothing for Left to trump.',
        openHand: true,
      },
    ],
  },
  {
    id: 'tute.2.duck',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Throw your cheapest card',
    minutes: 3,
    start: at({ trump: 'b', hands: [['3o', '4o', '6c'], ['5e', '7o', '4c'], ['2e', '5o', '5c'], ['Se', '2o']], trick: trick([3, 'Ae']), leader: 3, canteOpen: false }),
    steps: [
      { kind: 'say', text: 'When the trick is lost and you have no card of the suit and no trump, you may play anything. Give away as little as you can.', openHand: true },
      {
        kind: 'askMove',
        text: 'Left led the As de espadas. You have no espadas and no trumps. What do you throw?',
        accept: ['4o', '6c'],
        wrong: { '3o': 'That hands Left {value:3} points for nothing.' },
        claim: 'best',
        success: 'A card worth nothing: the trick was lost anyway.',
        openHand: true,
      },
    ],
  },
  {
    id: 'tute.2.sing',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Sing while you can',
    minutes: 3,
    start: at({ trump: 'b', hands: [['Rc', 'Cc', '4o'], ['Ac', '5o', '2e'], ['2o', '3e', '4e'], ['3c', '6o', '7e']], leader: 0, lastWinner: 0 }),
    steps: [
      { kind: 'say', text: 'A cante is made after a trick your side wins. If your side may not win another trick, the chance you have now is the last one.', openHand: true },
      {
        kind: 'askMove',
        text: 'Your side won the last trick. Right holds the As and Left the Tres de copas: your Rey and Caballo will not win a trick. What now?',
        accept: ['sing-c'],
        wrong: { '4o': 'The trick is lost and with it the chance to sing: the pair is never worth its {cante:plain}.' },
        claim: 'best',
        success: 'Sing first: the {cante:plain} are yours even though the copas tricks are not.',
        openHand: true,
      },
    ],
  },
  {
    id: 'tute.2.count',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Count the trumps',
    minutes: 3,
    start: at({ trump: 'Cb', dealer: 1, hands: [['Ab', '6b', '4o', '5c'], ['7o', '2c', '3b', 'Sc'], ['5o', '6o', '4c', 'Rb'], ['Co', 'Ro', '6c', '2o']], leader: 0, lastWinner: 0, canteOpen: false }),
    steps: [
      { kind: 'say', text: 'Good players count the trumps. A suit has {deck:per-suit} cards: those in your hand, those already played, and any turned card still showing are seen. The rest are in the other hands.' },
      { kind: 'askNumber', text: 'Bastos are trumps. The tricks played so far are face up. How many bastos have you not seen?', answer: 'trumps:unseen', success: 'Yes, {trumps:unseen}. When none are left out, your plain Ases and Treses can no longer be trumped.', openPiles: true },
    ],
  },
  {
    id: 'tute.2.finish',
    gameId: 'tute',
    stage: 'stage-2',
    title: 'Lead into your partner’s void',
    minutes: 4,
    start: FINISH,
    steps: [
      { kind: 'say', text: 'Copas are trumps. Your partner has no oros and holds the Caballo de copas. If you lead your Rey de oros, Right must beat it with the As, and your partner must trump the As.', openHand: true },
      { kind: 'freePlay', position: FINISH, text: 'Win the hand: your side needs more points than theirs by the end.', goal: 'win', maxMoves: 3, success: 'Hand won.', openHand: true },
    ],
  },

  // Table-ready
  {
    id: 'tute.table.deal',
    gameId: 'tute',
    stage: 'table',
    title: 'Dealing for four',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Partners sit opposite. The dealer shuffles, the player on the left cuts, and the cards go out one at a time to the right until all {deck:cards} are dealt. The dealer shows the last one, the trump, before picking it up.' },
      {
        kind: 'askChoice',
        text: 'Who leads to the first trick?',
        options: [
          { text: 'The player on the dealer’s right', correct: true, why: 'Yes, the first player dealt to. The deal then passes to the right for the next hand.' },
          { text: 'The dealer', why: 'No: the dealer plays last to the first trick.' },
          { text: 'Whoever holds the As of trumps', why: 'No: the lead belongs to the player on the dealer’s right.' },
        ],
      },
    ],
  },
  {
    id: 'tute.table.count',
    gameId: 'tute',
    stage: 'table',
    title: 'Counting the hand by hand',
    minutes: 3,
    start: at({ trump: 'b', hands: [['4o'], [], [], []], trick: trick([1, '5o'], [2, 'Ao'], [3, '7o']), leader: 1, cantes: [{ seat: 2, suit: 'c', points: 20 }] }),
    steps: [
      { kind: 'say', text: 'At a real table nobody counts for you. Turn your side’s tricks over and pick out the Ases and Treses first, {value:briscas} a pair; then the figures, Rey {value:R}, Caballo {value:C}, Sota {value:S}; then add the last ten and the cantes.' },
      { kind: 'askMove', text: 'Play your last card to finish the hand.', accept: ['4o'], claim: 'only', success: 'Hand over. Your partner sang las veinte earlier. Now count.' },
      { kind: 'askNumber', text: 'How many points did your side make: cards, the last ten and the cante?', answer: 'result:us', success: 'Right: {result:us}. Counting the big cards first is quickest.', openPiles: true },
    ],
  },
  {
    id: 'tute.table.sing',
    gameId: 'tute',
    stage: 'table',
    title: 'Singing at the table',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'To sing, show the Rey and the Caballo and say it: “veinte en copas”, or “las cuarenta” in trumps. Do it after your side wins a trick, before the next card is played to the following trick. Leave the cards face up on the table or show them and keep them, as your table does.' },
      {
        kind: 'askChoice',
        text: 'Your partner wins a trick and leads the next before you notice your pair. Your turn comes. What can you do?',
        options: [
          { text: 'Sing now, before you play your card, if the table lets either partner sing', correct: true, why: 'Yes: at most tables either partner may sing for a trick their side won, until they play to the next trick.' },
          { text: 'Sing at the end of the hand', why: 'No: a cante not made in time is lost for that trick.' },
        ],
      },
    ],
  },
  {
    id: 'tute.table.ask',
    gameId: 'tute',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Tables differ on a few rules. Settle them before the first deal: whether you must beat the card on the table or only follow; whether you must trump when your partner is winning; who may sing; what a tute is worth; and whether a hand goes to the most points or to the first side to {points:reach}.' },
      {
        kind: 'askChoice',
        text: 'Your partner is winning a trick you cannot follow. You throw a small card instead of trumping, and the others cry foul. What went wrong?',
        options: [
          { text: 'We never agreed whether the duties hold when a partner is winning', correct: true, why: 'Yes. By the common rule you had to trump; some tables relax it. Ask first.' },
          { text: 'Throwing a small card is never allowed', why: 'It is allowed when you have no card of the suit and no trump. The question is whether you had to trump.' },
        ],
      },
    ],
  },
  {
    id: 'tute.table.manners',
    gameId: 'tute',
    stage: 'table',
    title: 'Renuncio and table manners',
    minutes: 2,
    start: DEAL,
    steps: [
      { kind: 'say', text: 'Playing a card the duties do not allow, such as another suit while you hold the suit led, is a renuncio (reh-NOON-thee-oh). At a real table it is usually punished by losing the hand. Keep your tricks face down, and say nothing that tells your partner what you hold.' },
      {
        kind: 'askChoice',
        text: 'Halfway through a hand you see that an opponent did not follow suit earlier, though they had the suit. What happens at most tables?',
        options: [
          { text: 'It is a renuncio: the offending side usually loses the hand', correct: true, why: 'Yes. That is why players watch every card: the duties are checked by everyone.' },
          { text: 'Nothing: once a trick is turned down it cannot be questioned', why: 'At most tables a renuncio found later still costs the hand.' },
        ],
      },
    ],
  },
];
