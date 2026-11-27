/**
 * The Table-ready track for chess: what an app does for you that a real table does not.
 * Setting up, touch-move, the clock, writing the moves, draws and resigning.
 */
import type { Lesson } from '../../../teach/lesson';
import { START_FEN } from '../rules';

export const TABLE_READY: readonly Lesson[] = [
  {
    id: 'chess.table.setup',
    gameId: 'chess',
    stage: 'table',
    title: 'Setting up the board',
    minutes: 2,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'Turn the board so each player has a light square in the right-hand corner: "light on the right". Then rooks in the corners, knights next to them, then bishops.', marks: ['h1', 'a8'] },
      {
        kind: 'askChoice',
        text: 'Where does the white queen start?',
        options: [
          { text: 'On d1, a light square: the queen goes on her own colour', correct: true, why: 'Yes. The black queen goes on d8, a dark square, facing her.' },
          { text: 'On e1, next to the king', why: 'No, that is where the king goes. The queen takes her own colour: d1 for White.' },
        ],
      },
      { kind: 'say', text: 'The pawns fill the second rank in front. Before a game at a club, check the set-up together; a wrong board found later can cost a game.' },
    ],
  },
  {
    id: 'chess.table.touch',
    gameId: 'chess',
    stage: 'table',
    title: 'Touch-move',
    minutes: 2,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'At a real table, touching a piece on purpose means you must move it, if it has a legal move. Touching an enemy piece means you must take it, if you can. Once you let go of a piece on a square, the move stands.' },
      { kind: 'say', text: 'To straighten a piece without moving it, say "I adjust" (or "j’adoube") first, then touch it.' },
      {
        kind: 'askChoice',
        text: 'You touch your knight, then see a better bishop move. What happens?',
        options: [
          { text: 'You must move the knight, if it has a legal move', correct: true, why: 'Yes. Think first, then touch.' },
          { text: 'You may play the bishop move instead', why: 'Not at a club: touch-move applies. Keep your hands off until you have decided.' },
        ],
      },
    ],
  },
  {
    id: 'chess.table.clock',
    gameId: 'chess',
    stage: 'table',
    title: 'Using a chess clock',
    minutes: 2,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'A chess clock has two faces. After you move, press your side with the same hand you moved with; that starts your opponent’s time. The clock goes on the side chosen by Black, usually.' },
      { kind: 'say', text: 'If your time runs out, you lose, unless your opponent has too little material to ever give mate; then it is a draw. Leave time for the moves you still have to make.' },
      {
        kind: 'askChoice',
        text: 'Which hand presses the clock?',
        options: [
          { text: 'The same hand that moved the piece', correct: true, why: 'Right. Moving with one hand and pressing with the other is not allowed.' },
          { text: 'Whichever is closer', why: 'No: the hand that moved the piece presses the clock.' },
        ],
      },
    ],
  },
  {
    id: 'chess.table.notation',
    gameId: 'chess',
    stage: 'table',
    title: 'Writing the moves down',
    minutes: 3,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'In club games you write down every move in algebraic notation: the piece letter (K, Q, R, B or N; nothing for a pawn), then the square it goes to. Nf3 is a knight to f3; e4 is a pawn to e4. An x means a capture, + check and # mate.' },
      { kind: 'askMove', text: 'Play the move Nf3.', accept: ['g1f3'], claim: 'legal', success: 'Right: N for knight, f3 for the square.' },
      {
        kind: 'askChoice',
        text: 'How do you write castling on the kingside?',
        options: [
          { text: 'O-O', correct: true, why: 'Yes, and O-O-O for the queenside.' },
          { text: 'Kg1', why: 'Castling has its own symbol: O-O for kingside, O-O-O for queenside.' },
        ],
      },
    ],
  },
  {
    id: 'chess.table.draws',
    gameId: 'chess',
    stage: 'table',
    title: 'Offering a draw, claiming a draw, resigning',
    minutes: 3,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'To offer a draw, make your move, say "I offer a draw", then press your clock. Your opponent can accept, or decline by saying so or by moving.' },
      { kind: 'say', text: 'Repetition and the {rule:fifty}-move rule are not applied for you at a club: you claim them, usually by stopping the clock and calling the arbiter, before you make the move that repeats.' },
      { kind: 'say', text: 'To resign, say "I resign" or stop the clock and offer your hand. Then shake hands either way.' },
      {
        kind: 'askChoice',
        text: 'When do you offer a draw?',
        options: [
          { text: 'After making your move, before pressing the clock', correct: true, why: 'Yes. Offering on your opponent’s time is bad manners.' },
          { text: 'Any time, as often as you like', why: 'No. Offer once, on your own time, after your move. Repeated offers are a nuisance.' },
        ],
      },
    ],
  },
];
