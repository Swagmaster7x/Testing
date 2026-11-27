/**
 * Go lessons, stage 0 (what the game is, and Capture-Go) and stage 1 (the rules: enough to
 * finish a legal game). All prose is original. Numbers are {placeholders} computed from the rules.
 * Positions: rows from the top ('.', 'X' Black, 'O' White), then the side to move.
 */
import type { Lesson } from '../../../teach/lesson';

/** A position from its rows (top first), the side to move and any extra fields. */
export const pos = (side: 'b' | 'w', rows: readonly string[], extra = ''): string => `${rows.join('/')} ${side}${extra ? ` ${extra}` : ''}`;

const EMPTY9 = pos('b', Array.from({ length: 9 }, () => '.........'));
const SPLIT9 = pos('b', Array.from({ length: 9 }, () => '....XO...'));

export const STAGE_0: readonly Lesson[] = [
  {
    id: 'go.0.game',
    gameId: 'go',
    stage: 'stage-0',
    title: 'Go in a minute',
    minutes: 2,
    start: EMPTY9,
    steps: [
      { kind: 'say', text: 'Go is played on a grid of lines. Black and White take turns placing one stone on an empty point where two lines cross. Black goes first. A stone never moves once it is down.' },
      { kind: 'say', position: SPLIT9, text: 'The aim is to wall off more of the board than your opponent. Here Black has fenced off the left side and White the right. At the end each side counts what it surrounds.' },
      {
        kind: 'askChoice',
        text: 'What wins a game of Go?',
        options: [
          { text: 'Surrounding more of the board than your opponent', correct: true, why: 'Yes. Area is what counts in the end.' },
          { text: 'Capturing the other side’s king', why: 'That is chess. Go has no king, and every stone is the same.' },
          { text: 'Getting five stones in a row', why: 'That is gomoku, played with the same stones. In Go, rows do not matter; area does.' },
        ],
      },
      { kind: 'say', text: 'You can also capture stones by surrounding them, and captures help. But the count of the board decides who wins.' },
    ],
  },
  {
    id: 'go.0.capture-go',
    gameId: 'go',
    stage: 'stage-0',
    title: 'Capture-Go: the first game',
    minutes: 3,
    start: pos('b', ['.......', '.......', '.......', '...XO..', '...OX..', '.......', '.......'], 'rules=capture'),
    steps: [
      { kind: 'say', text: 'Capture-Go is the way most people start. It uses the real rules of Go with one change: whoever captures a stone first wins. Games often begin from this crossed shape in the middle.' },
      { kind: 'say', position: pos('b', ['.....', '..X..', '.XO..', '..X..', '.....'], 'rules=capture'), text: 'A stone is captured when the other side fills every empty point beside it along the lines. This white stone has just one such point left.', marks: ['D3'] },
      { kind: 'askMove', text: 'Capture the white stone to win.', accept: ['D3'], claim: 'best', success: 'Captured, and the game is yours.' },
      {
        kind: 'freePlay',
        position: pos('b', ['.......', '.......', '..X.X..', '.XO.OX.', '.......', '.......', '.......'], 'rules=capture'),
        text: 'Your turn to hunt. Two white stones stand side by side with a gap between them. Find the move that threatens both, and take one. The computer will run.',
        goal: 'win-material',
        maxMoves: 3,
        success: 'Caught one. That move, threatening two stones at once, is called a double atari.',
      },
    ],
  },
];

export const STAGE_1: readonly Lesson[] = [
  {
    id: 'go.1.board',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Points, not squares',
    minutes: 2,
    start: EMPTY9,
    steps: [
      { kind: 'say', text: 'Stones go on the points where the lines cross, the edge and the corners included. A {size:small} by {size:small} board is the usual first board; the full board is {size:big} by {size:big}.' },
      { kind: 'askNumber', text: 'How many points does this board have?', answer: 'points', success: 'Yes, {points}. The full board has {points:big}.' },
      { kind: 'say', text: 'The marked dots are star points (hoshi, HO-shee). They help you find your way, and handicap stones go on them.', marks: ['C3', 'G3', 'C7', 'G7', 'E5'] },
      { kind: 'askMove', text: 'Put a stone on the centre point. It is called tengen (TEN-gen).', accept: ['E5'], wrong: { D4: 'That is a point off the centre: count four lines in from the edge, in both directions.' }, claim: 'legal', success: 'That is tengen, the centre of the board.' },
    ],
  },
  {
    id: 'go.1.liberties',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Liberties',
    minutes: 2,
    start: pos('b', ['.....', '.....', '..X..', '.....', '.....']),
    steps: [
      { kind: 'say', text: 'The empty points next to a stone along the lines are its liberties. Diagonal points do not count.', marks: ['C4', 'B3', 'D3', 'C2'] },
      { kind: 'askNumber', text: 'How many liberties does the stone in the centre have?', answer: 'libs:C3', success: 'Right, {libs:C3}.' },
      { kind: 'askNumber', position: pos('b', ['..X..', '.....', '.....', '.....', '.....']), text: 'This stone stands on the edge. How many liberties does it have?', answer: 'libs:C5', success: 'Yes, {libs:C5}: the edge takes one away.' },
      { kind: 'askNumber', position: pos('b', ['X....', '.....', '.....', '.....', '.....']), text: 'And a stone in the corner?', answer: 'libs:A5', success: 'Only {libs:A5}. Stones near the edge have fewer liberties, so they are easier to capture.' },
    ],
  },
  {
    id: 'go.1.capture',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Capturing a stone',
    minutes: 2,
    start: pos('b', ['.....', '..X..', '.XO..', '..X..', '.....']),
    steps: [
      { kind: 'say', text: 'When a stone has no liberties left, it is captured. It comes off the board, and the player who took it keeps it as a prisoner. This white stone has one liberty left.', marks: ['D3'] },
      { kind: 'askMove', text: 'Take the white stone’s last liberty.', accept: ['D3'], wrong: { B2: 'That point is only diagonal to the white stone. Diagonals are not liberties.' }, claim: 'legal', success: 'Captured. The stone comes off the board.' },
      { kind: 'askNumber', text: 'How many prisoners does Black hold now?', answer: 'prisoners:black', success: 'Yes. Keep prisoners in your bowl’s lid; under territory counting they add to your score.' },
    ],
  },
  {
    id: 'go.1.chains',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Chains share their liberties',
    minutes: 2,
    start: pos('b', ['.....', '.....', '.XX..', '.....', '.....']),
    steps: [
      { kind: 'say', text: 'Stones of one colour next to each other along the lines are connected. Together they form a chain, which shares its liberties and is captured as one.' },
      { kind: 'askNumber', text: 'How many liberties does this chain of two stones have?', answer: 'libs:B3', success: 'Yes, {libs:B3}: more than either stone alone.' },
      { kind: 'askMove', position: pos('b', ['.....', '.XX..', 'XOO..', '.XX..', '.....']), text: 'The two white stones share one last liberty. Capture them both.', accept: ['D3'], claim: 'legal', success: 'Both come off together.' },
      { kind: 'askNumber', text: 'How many prisoners does Black hold now?', answer: 'prisoners:black', success: 'Right, {prisoners:black}.' },
    ],
  },
  {
    id: 'go.1.atari',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Atari',
    minutes: 3,
    start: pos('b', ['.....', '..X..', '.XO..', '.....', '.....']),
    steps: [
      { kind: 'say', text: 'A chain with only one liberty left is in atari (ah-TAH-ree): it can be taken on the next move. Beginners often say “atari” out loud as a warning.' },
      { kind: 'askMove', text: 'Put the white stone in atari: take one of its two liberties.', accept: ['D3', 'C2'], claim: 'legal', success: 'Atari. White has one liberty left.' },
      { kind: 'say', position: pos('b', ['.....', '..O..', '.OX..', '..O..', '.....']), text: 'Now it is the other way round: your stone is in atari.', marks: ['C3'] },
      { kind: 'askMove', text: 'Save it: add a stone at its last liberty, so the chain has more room.', accept: ['D3'], claim: 'best', success: 'Saved. Two stones together have three liberties now, and White cannot take them at once.' },
    ],
  },
  {
    id: 'go.1.suicide',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Where you may not play',
    minutes: 2,
    start: pos('b', ['.....', '..O..', '.O.O.', '..O..', '.....']),
    steps: [
      { kind: 'say', text: 'You may not play where your stone would have no liberties at all, because it would be captured at once. That is called suicide.', marks: ['C3'] },
      {
        kind: 'askChoice',
        text: 'Can Black play on the marked point?',
        options: [
          { text: 'No: the stone would have no liberties', correct: true, why: 'Right. Every point beside it is White’s.' },
          { text: 'Yes: any empty point is allowed', why: 'Not this one. A stone with no liberties is suicide, and suicide is not allowed.' },
        ],
      },
      { kind: 'say', position: pos('b', ['.....', '.XO..', 'XO.O.', '.XO..', '.....']), text: 'Here it is different: the white stone on the left has only that point as its liberty.', marks: ['C3', 'B3'] },
      { kind: 'askMove', text: 'Play on the point inside the white stones.', accept: ['C3'], claim: 'legal', success: 'It captures the stone on its left first, so your stone has a liberty. A move that captures is never suicide.' },
    ],
  },
  {
    id: 'go.1.ko',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Ko',
    minutes: 3,
    start: pos('b', ['.....', '.XO..', 'XO.O.', '.XO..', '.....']),
    steps: [
      { kind: 'say', text: 'Look at the marked points. Black can capture a white stone here, and then White could capture straight back, and so on for ever. The ko rule stops that.', marks: ['B3', 'C3'] },
      { kind: 'askMove', text: 'Capture the white stone.', accept: ['C3'], claim: 'legal', success: 'Captured. Now White would like to take back at once.' },
      {
        kind: 'askChoice',
        text: 'May White capture back on the very next move?',
        options: [
          { text: 'No: White must play somewhere else first', correct: true, why: 'Right. That is the ko rule.' },
          { text: 'Yes: any capture is allowed', why: 'Not straight away. Taking back at once would bring back the board as it was.' },
        ],
      },
      { kind: 'show', text: 'White plays a threat elsewhere (a ko threat). Black answers it. Now White may take back, and Black must wait in turn.', moves: ['E5', 'E1', 'B3'] },
    ],
  },
  {
    id: 'go.1.end',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Passing and the end',
    minutes: 2,
    start: pos('b', ['..XO.', '..XO.', '..XO.', '..XO.', '..XO.']),
    steps: [
      { kind: 'say', text: 'When no move gains anything more, you pass instead of placing a stone. When both players pass, one after the other, play stops.' },
      {
        kind: 'askChoice',
        text: 'Black passes. What ends the game?',
        options: [
          { text: 'White passes too', correct: true, why: 'Yes. Two passes in a row end play.' },
          { text: 'Black passes again', why: 'A pass must be answered by the other player’s pass.' },
          { text: 'The board fills up', why: 'Games end long before that, when both players pass.' },
        ],
      },
      { kind: 'say', text: 'Then the players agree which stones are dead: stones that could not avoid capture anyway. They come off the board as prisoners, and the counting starts.' },
      {
        kind: 'askChoice',
        text: 'A lone white stone sits deep inside Black’s area with no way to live. What happens to it at the end?',
        options: [
          { text: 'It is dead: it comes off without being captured', correct: true, why: 'Right. Nobody has to play it out; both players agree it is dead.' },
          { text: 'It stays and counts for White', why: 'Only if Black agrees it is alive. If you disagree, keep playing until it is clear.' },
        ],
      },
    ],
  },
  {
    id: 'go.1.counting',
    gameId: 'go',
    stage: 'stage-1',
    title: 'Counting the score',
    minutes: 3,
    start: pos('b', ['..XO.', '..XO.', '..XO.', '..XO.', '..XO.']),
    steps: [
      { kind: 'say', text: 'Counting by area: your stones on the board plus the empty points that only your stones surround. Points that touch both colours count for nobody.' },
      { kind: 'askNumber', text: 'How much area does Black have?', answer: 'area:black', success: 'Yes: {stones:black} stones and {territory:black} empty points, {area:black} in all.' },
      { kind: 'askNumber', text: 'And White, before komi?', answer: 'area:white', success: 'Right, {area:white}.' },
      {
        kind: 'askChoice',
        text: 'White adds {komi} points of komi for moving second. Who wins?',
        options: [
          { text: 'White, by {margin}', correct: true, why: 'Yes: komi turns it round. On a real board komi is fair; on this tiny one it is not.' },
          { text: 'Black, because Black has more area', why: 'Add komi to White’s area first, then compare.' },
        ],
      },
    ],
  },
];
