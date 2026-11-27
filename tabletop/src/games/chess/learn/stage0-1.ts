/**
 * Chess lessons, stages 0 (what the game is) and 1 (the rules: enough to finish a legal game).
 * All prose is original. Numbers are {placeholders} computed from the rules module.
 */
import type { Lesson } from '../../../teach/lesson';
import { START_FEN } from '../rules';

const K = '4k3/8/8/8/8/8/8/4K3 w - - 0 1';

export const STAGE_0: readonly Lesson[] = [
  {
    id: 'chess.0.game',
    gameId: 'chess',
    stage: 'stage-0',
    title: 'Chess in a minute',
    minutes: 2,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'Chess is a battle between two armies on a board of {board:squares} squares. White moves first; then the players take turns, one move each.' },
      { kind: 'say', text: 'Each side starts with {pieces:each} pieces: a king, a queen, two rooks, two bishops, two knights and {pawns:each} pawns.' },
      { kind: 'say', text: 'The king is the piece that matters. You win by attacking the enemy king so that it cannot escape. That is checkmate.', marks: ['e1', 'e8'] },
      {
        kind: 'askChoice',
        text: 'Which side makes the first move?',
        options: [
          { text: 'White', correct: true, why: 'Yes. White always moves first.' },
          { text: 'Black', why: 'Not in chess: White always starts.' },
          { text: 'Whoever wants to', why: 'No, White always starts. You can take turns playing White.' },
        ],
      },
      { kind: 'say', text: 'A game can also end in a draw, with nobody winning. The rules lessons show how.' },
    ],
  },
  {
    id: 'chess.0.mate',
    gameId: 'chess',
    stage: 'stage-0',
    title: 'A short game to checkmate',
    minutes: 2,
    start: START_FEN,
    steps: [
      { kind: 'show', text: 'Watch a short game. White aims at f7, the square next to Black’s king that only the king defends.', moves: ['e2e4', 'e7e5', 'd1h5', 'b8c6', 'f1c4', 'g8f6', 'h5f7'] },
      { kind: 'say', text: 'Black’s king is attacked by the queen, the queen is protected by the bishop, and the king has nowhere to go. Checkmate: White wins.', marks: ['f7', 'e8', 'c4'] },
      {
        kind: 'askChoice',
        text: 'Could Black have stopped this?',
        options: [
          { text: 'Yes, by guarding f7 or blocking the queen in time', correct: true, why: 'Right. For example, the queen to e7 or a pawn to g6 earlier would have held.' },
          { text: 'No, White was always winning', why: 'No. The early queen attack is easy to stop once you see it.' },
        ],
      },
    ],
  },
];

export const STAGE_1: readonly Lesson[] = [
  {
    id: 'chess.1.rook',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The rook',
    minutes: 2,
    start: '7k/8/8/8/3R4/8/8/K7 w - - 0 1',
    steps: [
      { kind: 'say', text: 'The rook moves in a straight line along a rank or a file, as far as it likes. It cannot jump over pieces.', arrows: [{ from: 'd4', to: 'd8' }, { from: 'd4', to: 'a4' }] },
      { kind: 'askNumber', text: 'From d4, how many squares can the rook move to?', answer: 'moves:d4', success: 'Yes, {moves:d4}: half along the rank and half along the file.' },
      { kind: 'askMove', position: '7k/8/3p4/8/8/8/8/K2R4 w - - 0 1', text: 'Capture the pawn on d6 with your rook.', accept: ['d1d6'], claim: 'legal', success: 'Well done. Rooks capture the same way they move.' },
    ],
  },
  {
    id: 'chess.1.bishop',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The bishop',
    minutes: 2,
    start: '6k1/8/8/8/3B4/8/8/K7 w - - 0 1',
    steps: [
      { kind: 'say', text: 'The bishop moves diagonally, any distance. A bishop that starts on a light square stays on light squares all game.', arrows: [{ from: 'd4', to: 'h8' }, { from: 'd4', to: 'a7' }] },
      { kind: 'askNumber', text: 'From d4, how many squares can the bishop reach?', answer: 'moves:d4', success: 'Right, {moves:d4}.' },
      { kind: 'askMove', position: '7k/8/8/6n1/8/8/8/K1B5 w - - 0 1', text: 'Capture the knight with your bishop.', accept: ['c1g5'], claim: 'legal', success: 'Good. The bishop swept along the diagonal.' },
      {
        kind: 'askChoice',
        text: 'Your bishop stands on a dark square. Which squares can it ever reach?',
        options: [
          { text: 'Only dark squares', correct: true, why: 'Yes: moving diagonally, a bishop never changes colour.' },
          { text: 'Any square, given time', why: 'No. Diagonal moves always land on the same colour.' },
        ],
      },
    ],
  },
  {
    id: 'chess.1.queen',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The queen',
    minutes: 2,
    start: 'k7/8/8/8/3Q4/7K/8/8 w - - 0 1',
    steps: [
      { kind: 'say', text: 'The queen moves like a rook and a bishop together: along ranks, files and diagonals, any distance.' },
      { kind: 'askNumber', text: 'From d4, how many squares can the queen move to?', answer: 'moves:d4', success: 'Yes, {moves:d4}. That is why the queen is the strongest piece.' },
      { kind: 'askMove', position: '3r3k/8/8/8/8/8/8/K2Q4 w - - 0 1', text: 'Capture the rook on d8.', accept: ['d1d8'], claim: 'legal', success: 'Good, and it is check as well.' },
    ],
  },
  {
    id: 'chess.1.knight',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The knight',
    minutes: 2,
    start: 'k7/8/8/8/3N4/8/8/7K w - - 0 1',
    steps: [
      { kind: 'say', text: 'The knight moves in an L: two squares one way, then one square across. It is the only piece that jumps over others.', arrows: [{ from: 'd4', to: 'e6' }, { from: 'd4', to: 'b3' }] },
      { kind: 'askNumber', text: 'From d4, how many squares can the knight jump to?', answer: 'moves:d4', success: 'Right, {moves:d4}. In a corner it would have far fewer.' },
      { kind: 'askMove', position: 'k7/8/4b3/2NPp3/3P4/8/8/7K w - - 0 1', text: 'Capture the bishop on e6 with your knight. Pawns in the way do not matter.', accept: ['c5e6'], claim: 'legal', success: 'Good: the knight jumped straight there.' },
    ],
  },
  {
    id: 'chess.1.king',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The king',
    minutes: 2,
    start: K,
    steps: [
      { kind: 'say', text: 'The king moves one square in any direction. It may never move onto a square the enemy attacks, so the two kings never stand side by side.' },
      { kind: 'askMove', position: '3rkr2/8/8/8/8/8/8/4K3 w - - 0 1', text: 'The black rooks guard the d-file and the f-file. Find the king’s only safe move.', accept: ['e1e2'], claim: 'only', success: 'Yes. Every other square is attacked.' },
    ],
  },
  {
    id: 'chess.1.pawn',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'The pawn',
    minutes: 2,
    start: 'k7/8/8/8/8/8/4P3/7K w - - 0 1',
    steps: [
      { kind: 'say', text: 'A pawn moves straight forward one square. From its starting square it may move two. It never moves backwards.' },
      { kind: 'askMove', text: 'Move this pawn two squares.', accept: ['e2e4'], wrong: { e2e3: 'That is one square. From its starting square a pawn may move two.' }, claim: 'legal', success: 'Good.' },
      { kind: 'say', position: 'k7/8/8/3p4/4P3/8/8/7K w - - 0 1', text: 'Pawns capture differently: one square diagonally forward.', arrows: [{ from: 'e4', to: 'd5' }] },
      { kind: 'askMove', text: 'Capture the black pawn.', accept: ['e4d5'], wrong: { e4e5: 'Pawns move straight ahead but capture diagonally.' }, claim: 'legal', success: 'Right: pawns capture on the diagonal.' },
    ],
  },
  {
    id: 'chess.1.check',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'Check, and how to get out of it',
    minutes: 3,
    start: '4r1k1/8/8/8/8/8/8/4K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'When a king is attacked it is in check, and the player must deal with it at once. There are three ways: move the king, block the attack, or capture the attacker.', marks: ['e1'], arrows: [{ from: 'e8', to: 'e1' }] },
      { kind: 'askMove', text: 'Move your king out of check.', accept: ['e1d1', 'e1d2', 'e1f1', 'e1f2'], claim: 'legal', success: 'Good: the king stepped off the file.' },
      { kind: 'askMove', position: '4r1k1/8/8/8/8/3B4/8/4K3 w - - 0 1', text: 'This time, block the check with your bishop.', accept: ['d3e2'], claim: 'legal', success: 'Yes: the bishop stands between the rook and your king.' },
      { kind: 'askMove', position: '6k1/5ppp/8/8/8/8/5PPP/3Rr1K1 w - - 0 1', text: 'Here there is only one way out. Find it.', accept: ['d1e1'], claim: 'only', success: 'Right: capture the attacker.' },
    ],
  },
  {
    id: 'chess.1.mate',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'Checkmate and stalemate',
    minutes: 3,
    start: '6k1/5ppp/8/8/8/8/8/3R2K1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'Checkmate is check with no way out: the king cannot move, the attack cannot be blocked, and the attacker cannot be taken. The game ends.' },
      { kind: 'askMove', text: 'Black’s king is shut in by its own pawns. Give checkmate.', accept: ['d1d8'], claim: 'mate', success: 'Checkmate! This is called a back-rank mate.' },
      { kind: 'say', position: '7k/5Q2/6K1/8/8/8/8/8 b - - 0 1', text: 'Now look at this position with Black to move. Black is not in check, but every move would put the king into check.', marks: ['h8'] },
      {
        kind: 'askChoice',
        text: 'Black has no legal move and is not in check. What is the result?',
        options: [
          { text: 'A draw by stalemate', correct: true, why: 'Yes. Stalemate is a draw, however much material White has.' },
          { text: 'White wins', why: 'No. Without check it is stalemate, a draw. Be careful not to stalemate when you are winning.' },
          { text: 'Black must pass', why: 'There is no passing in chess. This is stalemate, a draw.' },
        ],
      },
    ],
  },
  {
    id: 'chess.1.castling',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'Castling',
    minutes: 3,
    start: 'r3k2r/pppppppp/8/8/8/8/PPPPPPPP/R3K2R w KQkq - 0 1',
    steps: [
      { kind: 'say', text: 'Castling moves two pieces at once: the king goes two squares towards a rook, and the rook hops to the square the king crossed. It tucks the king away and brings a rook into play.' },
      { kind: 'askMove', text: 'Castle on the kingside (towards the h-file): move your king two squares to g1.', accept: ['e1g1'], wrong: { e1c1: 'That is queenside castling. Kingside is towards the h-file.' }, claim: 'legal', success: 'Done: O-O, the king is safe in the corner.' },
      {
        kind: 'askChoice',
        text: 'Which of these stops you castling?',
        options: [
          { text: 'Your king is in check, or would pass through or land on an attacked square', correct: true, why: 'Yes. Also: the king or that rook has already moved, or pieces stand between them.' },
          { text: 'You have already captured a piece', why: 'No, captures do not matter for castling.' },
        ],
      },
    ],
  },
  {
    id: 'chess.1.en-passant',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'En passant',
    minutes: 2,
    start: '4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1',
    steps: [
      { kind: 'show', text: 'Black’s pawn jumps two squares, landing beside yours.', moves: ['d7d5'] },
      { kind: 'say', text: 'Your pawn may capture it as if it had moved only one square, landing on d6. This is en passant ("in passing"), and it is allowed on the very next move only.', arrows: [{ from: 'e5', to: 'd6' }] },
      { kind: 'askMove', text: 'Capture en passant.', accept: ['e5d6'], claim: 'legal', success: 'Good. The black pawn is removed even though you landed behind it.' },
    ],
  },
  {
    id: 'chess.1.promotion',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'Promotion',
    minutes: 2,
    start: 'k7/4P3/8/8/8/8/8/7K w - - 0 1',
    steps: [
      { kind: 'say', text: 'A pawn that reaches the far side of the board must turn into a queen, rook, bishop or knight of its own colour. Almost always you choose a queen.' },
      { kind: 'askMove', text: 'Promote your pawn to a queen.', accept: ['e7e8q'], wrong: { e7e8n: 'Allowed, but a knight is much weaker here. Choose the queen.', e7e8r: 'Allowed, but the queen is stronger.', e7e8b: 'Allowed, but the queen is stronger.' }, claim: 'legal', success: 'A new queen!' },
    ],
  },
  {
    id: 'chess.1.draws',
    gameId: 'chess',
    stage: 'stage-1',
    title: 'Draws',
    minutes: 2,
    start: '4k3/8/8/8/8/8/8/2B1K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'Besides stalemate, a game is drawn when the same position appears {rule:repetition} times, when {rule:fifty} moves pass on each side with no capture and no pawn move, or when neither side has enough pieces left to give mate. Players can also agree a draw.' },
      {
        kind: 'askChoice',
        text: 'King and bishop against a lone king: can either side win?',
        options: [
          { text: 'No: it is a draw, as a bishop alone cannot give mate', correct: true, why: 'Right. The same goes for a lone knight.' },
          { text: 'Yes, White wins with care', why: 'No. King and bishop cannot force mate, so the game is drawn.' },
        ],
      },
    ],
  },
];
