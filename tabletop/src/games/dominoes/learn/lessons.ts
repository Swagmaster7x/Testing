/**
 * Dominoes lessons: stage 0 (what the game is), stage 1 (the rules), stage 2 (partner play and
 * counting) and the Table-ready track. All prose is original. Numbers are {placeholders} computed
 * from the rules; tiles are written as they are named at the table (3-5, 6-6). "Best" claims are
 * proved by exact search (see verify.ts). You sit in seat 0; play goes to your right.
 *
 * Positions are built by playing scripted moves through the rules from fixed deals, so every one is
 * a position a real hand could reach.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Tile } from '../rules';
import { dominoes, position } from '../rules';

/** Plays moves from a position (the lesson's own notation), for building lesson positions. */
function after(start: string, moves: string): string {
  let s = dominoes.codec.state.fromText(start);
  for (const m of moves.trim().split(/\s+/).filter(Boolean)) {
    const seat = dominoes.turn(s) ?? 0;
    const action = dominoes.legal(s, seat).find((a) => dominoes.codec.action.toText(a) === m);
    if (!action) throw new Error(`Dominoes lesson: ${m} is not legal here`);
    s = dominoes.apply(s, action).state;
  }
  return dominoes.codec.state.toText(s);
}

/** A deal for lessons: you hold three sixes with the double; the others hold the rest. */
const D1: Tile[][] = [
  ['6-6', '2-6', '4-6', '1-1', '0-3', '3-5', '2-5'],
  ['0-6', '1-6', '0-0', '1-3', '2-2', '4-4', '0-4'],
  ['3-6', '5-6', '0-1', '1-4', '3-3', '2-4', '5-5'],
  ['0-2', '0-5', '1-2', '1-5', '2-3', '3-4', '4-5'],
];
const D1_FIRST = position({ hands: D1, turn: 0, leader: 0, handNo: 0, config: { target: 0 } });
const D1_LATER = position({ hands: D1, turn: 0, leader: 0, handNo: 5, config: { target: 0 } });

/** A deal where the player on your right holds no fours and no twos. */
const D2: Tile[][] = [
  ['6-6', '4-6', '4-4', '2-4', '2-3', '0-0', '5-5'],
  ['0-6', '1-6', '3-6', '0-1', '0-3', '1-5', '3-5'],
  ['2-6', '5-6', '0-2', '1-2', '2-2', '3-3', '0-5'],
  ['1-4', '3-4', '4-5', '0-4', '1-1', '1-3', '2-5'],
];
const D2_START = position({ hands: D2, turn: 0, leader: 0, handNo: 5, config: { target: 0 } });

/** A deal where you hold only blanks, ones, fives and sixes. */
const D3: Tile[][] = [
  ['6-6', '0-6', '1-6', '0-0', '1-1', '0-1', '5-5'],
  ['2-6', '2-2', '2-3', '0-2', '1-2', '3-3', '4-4'],
  ['3-6', '4-6', '2-4', '3-4', '0-3', '1-3', '0-4'],
  ['5-6', '4-5', '3-5', '2-5', '1-5', '0-5', '1-4'],
];
const D3_START = position({ hands: D3, turn: 0, leader: 0, handNo: 5, config: { target: 0 } });

/** Late in a hand: you hold one tile that fits the left end. */
const GOING_OUT = position({ hands: [['1-2'], null, null, null], line: '1-4 4-4 4-2 2-2 2-6 6-6 6-0 0-0 0-3 3-3 3-5', counts: [1, 6, 5, 5], handNo: 5, config: { target: 0 } });

/** Every six is out but one, which you hold: playing it blocks the hand (see the tranque lesson). */
const BLOCK_HANDS: Tile[][] = [
  ['0-6', '0-1'],
  ['4-5', '5-5', '3-5'],
  ['0-2', '1-2'],
  ['3-4', '4-4', '3-3'],
];
const BLOCKING = position({ hands: BLOCK_HANDS, line: '6-1 1-1 1-3 3-0 0-0 0-4 4-1 1-5 5-2 2-2 2-3 3-6 6-2 2-4 4-6 6-6 6-5 5-0', handNo: 5, config: { target: 0 } });

/** Every five but the two you hold is out. */
const FIVES_OUT = position({ hands: [['2-5', '5-5'], null, null, null], line: '5-0 0-0 0-1 1-5 5-3 3-3 3-4 4-5 5-6 6-6 6-2', counts: [2, 5, 5, 5], handNo: 5, config: { target: 0 } });

/** A solved endgame, found by the practice generator: block now, while your side holds fewer pips. */
const SOLVED = position({
  hands: [
    ['0-3', '0-1', '5-6'],
    ['1-5', '0-0', '0-2', '1-1'],
    ['2-2', '3-4', '1-2'],
    ['0-5', '1-4'],
  ],
  line: '6-1 1-3 3-5 5-4 4-4 4-6 6-6 6-2 2-3 3-3 3-6 6-0 0-4 4-2 2-5 5-5',
  handNo: 5,
  config: { target: 0 },
});

export const DOMINOES_LESSONS: readonly Lesson[] = [
  // Stage 0
  {
    id: 'dominoes.0.game',
    gameId: 'dominoes',
    stage: 'stage-0',
    title: 'Dominoes in a minute',
    minutes: 2,
    start: D1_FIRST,
    steps: [
      { kind: 'say', text: 'The usual set is the double six: {set:tiles} tiles, every pair of numbers from blank to six once. Each tile has two halves; the spots are called pips.' },
      { kind: 'say', text: 'The game here is for {players:four}, in two partnerships. Your partner sits facing you. Each player draws {hand:size} tiles and keeps them standing so nobody else can see them.' },
      { kind: 'say', text: 'Play goes counter-clockwise: you, then the player on your right, then your partner, then the player on your left. On your turn you add a tile to one end of the line, matching the number at that end.' },
      {
        kind: 'askChoice',
        text: 'Who is your partner?',
        options: [
          { text: 'The player facing you', correct: true, why: 'Yes. You win or lose each hand together, so you help each other.' },
          { text: 'The player on your right', why: 'No: they play right after you, for the other side.' },
          { text: 'Nobody: each plays alone', why: 'Not in the partnership game, the usual game at four. The two-player games are played alone.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.0.line',
    gameId: 'dominoes',
    stage: 'stage-0',
    title: 'Matching the ends',
    minutes: 2,
    start: D1_FIRST,
    steps: [
      { kind: 'say', text: 'In the first hand of a match, whoever holds the double six leads it. Here that is you.' },
      { kind: 'askMove', text: 'Lead the double six.', accept: ['6-6'], claim: 'legal', success: 'Doubles lie across the line. Both ends now show a six.', reply: '1-6R 5-6L 1-2R' },
      { kind: 'say', text: 'The others each matched an end: the player on your right played on one six, your partner on the other, and the player on your left covered the one. Now the ends show {ends:left} and {ends:right}.' },
      { kind: 'askMove', text: 'Play any tile that matches an end.', accept: ['2-6R', '3-5L', '2-5L', '2-5R'], claim: 'only', success: 'Right. The matching halves touch, and the other half becomes the new end.' },
    ],
  },

  // Stage 1: the rules
  {
    id: 'dominoes.1.tiles',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Tiles, suits and pips',
    minutes: 2,
    start: D1_LATER,
    steps: [
      { kind: 'say', text: 'The set holds {set:pips} pips in all. Every number from blank to {set:top} is on {set:per-number} tiles; players call the tiles of one number a suit: the sixes, the blanks.' },
      { kind: 'say', text: 'A double, like the 6-6, shows one number twice. There are {set:doubles} doubles, one in each suit.' },
      { kind: 'askNumber', text: 'How many pips are in your hand?', answer: 'hand:pips', success: 'Yes, {hand:pips}. Pips decide a blocked hand, and they are what the winners score.' },
      { kind: 'askNumber', text: 'How many of the sixes do you hold?', answer: 'mine:6', success: 'Yes: {mine:6} of the {set:per-number}. That makes the sixes your strong suit.' },
    ],
  },
  {
    id: 'dominoes.1.pass',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Play if you can, pass if you cannot',
    minutes: 3,
    start: after(D3_START, '6-6 2-6R 3-6L 2-5R 5-5R 3-3L 3-4L 4-5R'),
    steps: [
      { kind: 'say', text: 'If any of your tiles fits an end, you must play one. If none fits, you pass: say “paso” (PAH-soh) or knock the table with a tile. You may never pass to keep a tile back.' },
      { kind: 'askMove', text: 'Both ends show a {ends:left}, and you hold none. Pass.', accept: ['pass'], claim: 'only', success: 'Paso. The turn moves on to your right.', reply: '4-4L 2-4L 1-4R' },
      { kind: 'say', text: 'The others played on: the ends show {ends:left} and {ends:right} now.' },
      { kind: 'askMove', text: 'Your turn again. Play any tile that fits.', accept: ['1-6R', '1-1R', '0-1R'], claim: 'only', success: 'Right: when a tile fits, it must be played.' },
    ],
  },
  {
    id: 'dominoes.1.ends',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'A tile that fits both ends',
    minutes: 3,
    start: after(D1_LATER, '6-6 1-6R 5-6L 1-2R'),
    steps: [
      { kind: 'say', text: 'The ends show {ends:left} and {ends:right}. Your 2-5 fits either one, and where you put it decides which numbers stay open.' },
      {
        kind: 'askChoice',
        text: 'If you play the 2-5 on the five, which numbers will the ends show?',
        options: [
          { text: 'A two and a two', correct: true, why: 'Yes: the five half touches the five, so a two faces out, and the other end is already a two.' },
          { text: 'A five and a five', why: 'That is what you get by playing it on the two end.' },
          { text: 'A five and a two', why: 'The five end is covered, so a two faces out there.' },
        ],
      },
      { kind: 'askMove', text: 'You hold another five (the 3-5). Play the 2-5 so that both ends show a five.', accept: ['2-5R'], wrong: { '2-5L': 'On the five end it leaves twos on both ends, and you hold only one more two.' }, claim: 'legal', success: 'Both ends are fives, and you still hold the 3-5 to follow with.' },
    ],
  },
  {
    id: 'dominoes.1.lead',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Who leads',
    minutes: 2,
    start: D1_LATER,
    steps: [
      { kind: 'say', text: 'Each hand is a mano. In the first mano of a match the holder of the 6-6 leads it. After that, tables differ: in Puerto Rico the player who won the last hand leads any tile; in many other places the lead passes to the right.' },
      {
        kind: 'askChoice',
        text: 'Puerto Rico rules: your partner won the last hand by going out. Who leads this one?',
        options: [
          { text: 'Your partner, any tile', correct: true, why: 'Yes: the winner leads, with any tile.' },
          { text: 'Whoever holds the 6-6', why: 'Only in the first hand of the match (and after a blocked hand nobody won).' },
          { text: 'The player on your partner’s right', why: 'That is the rotating lead some tables use, not the Puerto Rican one.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'First hand of the match, and you hold the 6-6. What do you lead?',
        options: [
          { text: 'The 6-6', correct: true, why: 'Right: it opens the match.' },
          { text: 'Any tile you like', why: 'Not in the first hand: the double six opens it.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.1.out',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Going out, or a blocked hand',
    minutes: 3,
    start: GOING_OUT,
    steps: [
      { kind: 'say', text: 'A hand ends in one of two ways. The usual one: a player plays their last tile. That is dominó, and that player’s side wins the hand.' },
      { kind: 'askMove', text: 'You hold one tile, and it fits. Go out.', accept: ['1-2L'], claim: 'only', success: '¡Dominó! Your side wins the hand.' },
      {
        kind: 'say',
        position: BLOCKING,
        openHand: true,
        text: 'The other way: nobody can play. The hand is blocked (trancado), and the side holding fewer pips wins it. Here every hand is face up. Every six but yours is on the line, and one end shows a six.',
      },
      { kind: 'askMove', openHand: true, text: 'Play your 0-6 on the blank end, so both ends show a six.', accept: ['0-6R'], claim: 'legal', success: 'Trancado: no six is left anywhere, so nobody can play.' },
      {
        kind: 'askChoice',
        openHand: true,
        text: 'Who wins this blocked hand?',
        options: [
          { text: 'Your side: you and your partner hold fewer pips', correct: true, why: 'Yes. Your side holds far fewer pips, so the hand is yours.' },
          { text: 'You, because you played last', why: 'Not here. A few tables say so, but normally the pips decide.' },
          { text: 'Nobody: a blocked hand does not count', why: 'It counts: the side with fewer pips wins it.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.1.score',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Scoring a hand',
    minutes: 3,
    start: BLOCKING,
    steps: [
      { kind: 'say', openHand: true, text: 'The winners score the pips left in the other hands. In Puerto Rico they score every tile left, their own included; other tables count only the losers’ tiles. Scores add up, hand after hand, to {target:pr} (or {target:200} at many tables).' },
      { kind: 'show', openHand: true, text: 'You block the hand.', moves: ['0-6R'] },
      { kind: 'askNumber', openHand: true, text: 'Every tile left counts. How many points does your side score?', answer: 'result:us', success: 'Yes, {result:us}: every pip left on the table.' },
    ],
  },
  {
    id: 'dominoes.1.bonus',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'The bonuses of Quinientos',
    minutes: 3,
    start: position({ hands: [['3-5'], null, null, null], line: '3-1 1-1 1-4 4-4 4-0 0-0 0-6 6-6 6-2 2-2 2-5', counts: [1, 6, 5, 5], handNo: 5, config: { target: 0 } }),
    steps: [
      { kind: 'say', text: 'Puerto Rico’s game to {target:pr} (Quinientos) adds bonuses. Winning the first four hands of a match by going out pays {bonus:early-1}, {bonus:early-2}, {bonus:early-3} and {bonus:early-4}.' },
      { kind: 'say', text: 'Capicú (kah-pee-KOO): going out with a tile, not a double, that fits both ends. It pays {bonus:capicu}. The ends now show {ends:left} and {ends:right}.' },
      { kind: 'askMove', text: 'Go out with your last tile.', accept: ['3-5L', '3-5R'], claim: 'only', success: 'Capicú! It fits either end, so the bonus is yours.' },
      { kind: 'say', text: 'Chuchazo: going out with the double blank, la chucha. It pays {bonus:chuchazo}. Going out with a double that fits both ends is a plain dominao: no bonus.' },
      {
        kind: 'askChoice',
        text: 'Both ends show a four and you go out with the 4-4. Capicú?',
        options: [
          { text: 'No: a double never makes capicú', correct: true, why: 'Right. That is a dominao, a plain win.' },
          { text: 'Yes: it fits both ends', why: 'It does, but doubles are left out of capicú.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.1.free',
    gameId: 'dominoes',
    stage: 'stage-1',
    title: 'Finish the hand',
    minutes: 3,
    start: FIVES_OUT,
    steps: [
      { kind: 'say', text: 'Count the fives on the line: every five but your two is out. The others cannot play on a five, so a five end is yours alone.' },
      { kind: 'freePlay', position: FIVES_OUT, goal: 'win', maxMoves: 2, text: 'Win the hand. Keep a five open for your last tile.', success: 'Dominó! Nobody else could cover the five.' },
    ],
  },

  // Stage 2: partner play and counting
  {
    id: 'dominoes.2.strength',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'Lead from your strength',
    minutes: 2,
    start: position({ hands: [['5-5', '2-5', '3-5', '5-6', '0-1', '1-3', '4-4'], null, null, null], counts: [7, 7, 7, 7], handNo: 5, config: { target: 0 } }),
    steps: [
      { kind: 'say', text: 'When you lead, lead from the suit you hold most of, with its double if you have it. The double gets out early, and your partner learns your number.' },
      { kind: 'askNumber', text: 'How many fives do you hold?', answer: 'mine:5', success: 'Yes, {mine:5}. Fives are your strong suit.' },
      { kind: 'askMove', text: 'You lead this hand. What do you lead?', accept: ['5-5'], wrong: { '4-4': 'A double, but of a suit you hold only one of: you could not follow it.', '5-6': 'A five, but lead the double: it is the hardest five to place later.', '2-5': 'A five, but lead the 5-5: doubles are the tiles that get stuck.', '3-5': 'A five, but lead the 5-5: doubles are the tiles that get stuck.' }, claim: 'legal', success: 'Your partner now knows fives are your number and will try to keep one open for you.' },
    ],
  },
  {
    id: 'dominoes.2.count',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'Count a suit',
    minutes: 3,
    start: position({ hands: [['0-5', '3-5', '1-1', '2-4', '0-4', '3-6'], null, null, null], line: '6-6 6-5 5-5 5-2', counts: [6, 6, 6, 6], handNo: 5, config: { target: 0 } }),
    steps: [
      { kind: 'say', text: 'Good players count. Each suit has {set:per-number} tiles: subtract the ones on the line and the ones in your hand, and you know how many are still out there.' },
      { kind: 'askNumber', text: 'Fives on the line: {line:5}. Fives in your hand: {mine:5}. How many fives have you not seen?', answer: 'unseen:5', success: 'Yes, {unseen:5}. Only that many fives can still be played by the others.' },
      { kind: 'askNumber', text: 'And the sixes: how many have you not seen?', answer: 'unseen:6', success: 'Right, {unseen:6}. When a suit runs out, an end showing it is closed to everyone who lacks it.' },
    ],
  },
  {
    id: 'dominoes.2.pass',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'What a pass tells you',
    minutes: 3,
    start: after(D2_START, '6-6 3-6R 2-6L 3-4R 4-4R pass 1-2L 1-3L'),
    steps: [
      { kind: 'say', text: 'A pass is information. The player on your right passed when the ends showed a two and a four: they hold no twos and no fours.' },
      {
        kind: 'askChoice',
        text: 'What do you now know about the player on your right?',
        options: [
          { text: 'They hold no two and no four', correct: true, why: 'Yes. Until they draw (there is no drawing at four), that stays true.' },
          { text: 'They hold only doubles', why: 'Nothing says so: they lacked twos and fours, that is all.' },
          { text: 'They are about to go out', why: 'A pass says what they lack, not how many tiles they hold.' },
        ],
      },
      { kind: 'askMove', text: 'Make them pass again: leave a two and a four on the ends.', accept: ['2-3L'], wrong: { '2-4R': 'That leaves a three, which they may hold.', '4-6R': 'That opens a six, which they may hold.' }, claim: 'legal', success: 'Now both ends are numbers they lack: they must pass again.' },
    ],
  },
  {
    id: 'dominoes.2.partner',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'Play to your partner',
    minutes: 3,
    start: position({ hands: [['3-5', '1-4', '0-0', '2-6', '3-3', '0-2', '1-1'], null, null, null], line: '5-5 5-1', by: [2, 3], leader: 2, counts: [7, 7, 6, 6], handNo: 5, config: { target: 0 } }),
    steps: [
      { kind: 'say', text: 'Your partner led the 5-5: fives are their suit. The player on your left covered one five with a one.' },
      {
        kind: 'askChoice',
        text: 'Which end matters most to your partner?',
        options: [
          { text: 'The five', correct: true, why: 'Yes: it is their suit. Keep it open.' },
          { text: 'The one', why: 'The one belongs to the player on your left, who just played it.' },
        ],
      },
      { kind: 'askMove', text: 'Play without covering your partner’s five.', accept: ['1-4R', '1-1R'], wrong: { '3-5L': 'That covers the five your partner led. Cover the opponent’s one instead.' }, claim: 'legal', success: 'The five stays open for your partner, and you have covered the other side’s number.' },
    ],
  },
  {
    id: 'dominoes.2.doubles',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'Doubles get hanged',
    minutes: 3,
    start: position({ hands: [['3-3', '3-5', '1-2', '4-4', '0-1', '2-5'], null, null, null], line: '3-0 0-0 0-6 6-6 6-3', counts: [6, 6, 6, 5], handNo: 5, config: { target: 0 } }),
    steps: [
      { kind: 'say', text: 'A double fits only an end that shows its number. Once the other tiles of that suit are gone, it can never be played: it is ahorcado, “hanged”, and its pips count against you.' },
      { kind: 'askNumber', text: 'How many threes have you not seen?', answer: 'unseen:3', success: 'Only {unseen:3}. If they go down before your 3-3 does, the double hangs.' },
      { kind: 'askMove', text: 'Both ends show a three. Play the tile that is hardest to place later.', accept: ['3-3L', '3-3R'], wrong: { '3-5L': 'The 3-5 can wait: it also fits a five. The 3-3 fits only a three.', '3-5R': 'The 3-5 can wait: it also fits a five. The 3-3 fits only a three.' }, claim: 'legal', success: 'The double is out while it still fits.' },
    ],
  },
  {
    id: 'dominoes.2.block',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'When to block',
    minutes: 3,
    start: BLOCKING,
    steps: [
      { kind: 'say', openHand: true, text: 'Blocking the hand on purpose (trancar) is a weapon: it wins only if your side holds fewer pips. Count first. Every hand is face up here.' },
      { kind: 'askNumber', openHand: true, text: 'Your partner holds the 0-2 and the 1-2. How many pips is that?', answer: 'pips:partner', success: 'Yes, {pips:partner}. With your 0-1 after the block, your side is very light.' },
      { kind: 'askMove', openHand: true, text: 'The other side is heavy. Block the hand.', accept: ['0-6R'], claim: 'legal', success: 'Trancado, and your side holds fewer pips: the hand is yours.' },
    ],
  },
  {
    id: 'dominoes.2.end',
    gameId: 'dominoes',
    stage: 'stage-2',
    title: 'Read the last tiles',
    minutes: 3,
    start: SOLVED,
    steps: [
      { kind: 'say', openHand: true, text: 'Near the end, count everything. Every hand is face up: find the play that scores most for your side. The ends show {ends:left} and {ends:right}.' },
      { kind: 'askMove', openHand: true, text: 'Your play.', accept: ['5-6R'], claim: 'best', success: 'The 5-6 on the five blocks the hand with every six out, and your side holds fewer pips: the hand is yours.' },
    ],
  },

  // Table-ready
  {
    id: 'dominoes.table.wash',
    gameId: 'dominoes',
    stage: 'table',
    title: 'The shuffle and the draw',
    minutes: 2,
    start: D1_LATER,
    steps: [
      { kind: 'say', text: 'Before each hand the tiles are turned face down and mixed on the table with flat hands: the sopa, or “soup”. Then each player draws {hand:size}, without looking at the others.' },
      { kind: 'say', text: 'Stand your tiles on edge facing you. Many players arrange them by suit; that is fine, but do it quietly.' },
      {
        kind: 'askChoice',
        text: 'A tile flips face up while you are drawing. What do you do?',
        options: [
          { text: 'Say so, turn it back and mix again', correct: true, why: 'Yes: everyone saw it, so the deal starts over.' },
          { text: 'Keep it if it is good', why: 'That is how arguments start. A shown tile is mixed back in.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.table.talk',
    gameId: 'dominoes',
    stage: 'table',
    title: 'Passing and table talk',
    minutes: 2,
    start: D1_LATER,
    steps: [
      { kind: 'say', text: 'When you cannot play, say “paso” or knock with a tile. Do not say why, and do not tell your partner what you hold: partners talk only through the tiles they play.' },
      { kind: 'say', text: 'Drawing or passing when you could have played is cheating (trampa). If it comes out later, most tables give the hand to the other side.' },
      {
        kind: 'askChoice',
        text: 'Your partner is about to cover your best number. May you warn them?',
        options: [
          { text: 'No: no signals, words or faces', correct: true, why: 'Right. The conventions (leads, passes, the ends you leave) are the only language.' },
          { text: 'A small cough is fine', why: 'That is a signal. Serious tables treat it as cheating.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.table.ask',
    gameId: 'dominoes',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 3,
    start: D1_LATER,
    steps: [
      { kind: 'say', text: 'Every table has house rules. Before the first tile, ask: to {target:100}, {target:200} or {target:pr}? Do the winners score their own tiles too? Who leads after the first hand?' },
      { kind: 'say', text: 'Ask about a blocked hand: do the sides compare, or the blocker and the next player? What happens with equal pips? And the bonuses: the first four hands, capicú, chuchazo, a pass bonus?' },
      {
        kind: 'askChoice',
        text: 'You sit down at a new table in Puerto Rico. What is the safest thing to do?',
        options: [
          { text: 'Ask their rules before the first hand', correct: true, why: 'Yes. Nobody minds the question; everyone minds an argument at the end.' },
          { text: 'Play your own rules and explain later', why: 'That is how a friendly game turns into a dispute.' },
        ],
      },
    ],
  },
  {
    id: 'dominoes.table.score',
    gameId: 'dominoes',
    stage: 'table',
    title: 'Keeping score',
    minutes: 2,
    start: BLOCKING,
    steps: [
      { kind: 'say', openHand: true, text: 'One player keeps the score on paper, side by side, adding each hand. At the end of a hand every player shows their tiles so the pips can be counted.' },
      { kind: 'show', openHand: true, text: 'You block the hand.', moves: ['0-6R'] },
      { kind: 'askNumber', openHand: true, text: 'Write down your side’s score for this hand.', answer: 'result:us', success: 'Yes, {result:us}. Keep a running total for each side.' },
    ],
  },
];
