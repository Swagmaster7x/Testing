/**
 * Chess lessons, stage 2 (first strategy: from legal to sensible) and stage 3 (core skills,
 * started: tactics and the basic mates). Every "best move" is checked by the engine in the linter.
 */
import type { Lesson } from '../../../teach/lesson';
import { START_FEN } from '../rules';

export const STAGE_2: readonly Lesson[] = [
  {
    id: 'chess.2.values',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'What the pieces are worth',
    minutes: 3,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'Players count material in points: a pawn is {value:p}, a knight {value:n}, a bishop {value:b}, a rook {value:r} and a queen {value:q}. The king is beyond price.' },
      { kind: 'askNumber', text: 'How many points is a rook worth?', answer: 'value:r', success: 'Yes, {value:r}.' },
      {
        kind: 'askChoice',
        text: 'You can give a rook to win a knight. Is that a good trade?',
        options: [
          { text: 'No: I would lose about {value:rook-for-knight} points', correct: true, why: 'Right. Trade a rook for a knight only for a clear reason.' },
          { text: 'Yes, any capture is good', why: 'No: you give {value:r} points and get {value:n}.' },
        ],
      },
      { kind: 'askNumber', position: '6k1/5ppp/8/8/8/8/PPP5/RN4K1 w - - 0 1', text: 'Count White’s material in this position.', answer: 'material:white', success: 'Right: {material:white} points. Counting like this keeps you honest about trades.' },
    ],
  },
  {
    id: 'chess.2.hanging',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Hanging pieces',
    minutes: 3,
    start: '4k3/p6p/8/4n3/8/8/PB5P/4K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A piece is hanging when it can be taken for free: attacked and not defended. Before every move, look for enemy pieces hanging, and check that yours are not.' },
      { kind: 'askMove', text: 'Black’s knight is hanging. Take it.', accept: ['b2e5'], claim: 'best', success: 'Free material: you are a knight up.' },
      { kind: 'say', position: 'r3k3/ppp2ppp/8/3q4/8/2N5/PPP2PPP/R3K3 w - - 0 1', text: 'Count attackers and defenders. Here the queen on d5 is attacked by your knight and defended by nothing.', marks: ['d5'], arrows: [{ from: 'c3', to: 'd5' }] },
      { kind: 'askNumber', text: 'How many of your pieces attack the black queen?', answer: 'attackers:d5', success: 'One is enough when the target is undefended.' },
      { kind: 'askMove', text: 'Win the queen.', accept: ['c3d5'], claim: 'best', success: 'A whole queen for nothing.' },
    ],
  },
  {
    id: 'chess.2.opening',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Opening principles',
    minutes: 3,
    start: START_FEN,
    steps: [
      { kind: 'say', text: 'In the opening: put a pawn or two in the centre, bring knights and bishops out, castle early, and do not move the same piece twice without a reason.', marks: ['d4', 'e4', 'd5', 'e5'] },
      { kind: 'askMove', text: 'Make a good first move: take a share of the centre.', accept: ['e2e4', 'd2d4', 'c2c4', 'g1f3'], wrong: { a2a4: 'That pawn does nothing for the centre.', h2h4: 'That pawn does nothing for the centre.', g2g4: 'That weakens your king and does little for the centre.' }, claim: 'legal', success: 'Good. Pawns in the centre give your pieces room.' },
      { kind: 'askMove', position: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2', text: 'Now bring out a knight, towards the centre.', accept: ['g1f3', 'b1c3'], wrong: { g1h3: 'A knight on the rim is dim: h3 is far from the centre.', b1a3: 'A knight on the rim is dim: a3 is far from the centre.' }, claim: 'legal', success: 'Developing a piece and eyeing the centre.' },
      {
        kind: 'askChoice',
        text: 'When should you usually castle?',
        options: [
          { text: 'Early, once the knight and bishop on that side have moved', correct: true, why: 'Yes. A king in the centre is a target once the position opens.' },
          { text: 'Late, after the queen is out', why: 'Bringing the queen out early often loses time. Castle first.' },
        ],
      },
    ],
  },
  {
    id: 'chess.2.cct',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Checks, captures and threats',
    minutes: 3,
    start: '4k3/p4ppp/8/8/1b6/8/P2P1PPP/3QK3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'Strong players look at forcing moves first: checks, then captures, then threats. Forcing moves leave the opponent less choice.' },
      { kind: 'askMove', text: 'Black’s bishop is loose. Find the check that wins it.', accept: ['d1a4'], claim: 'best', success: 'Qa4+ checks the king and attacks the bishop. After the king moves, the bishop falls.' },
      {
        kind: 'askChoice',
        text: 'Why look at checks first?',
        options: [
          { text: 'A check must be answered, so the opponent has few replies to work out', correct: true, why: 'Exactly. Fewer replies means you can calculate further.' },
          { text: 'Checks always win material', why: 'Not always. But they are forcing, so they are worth looking at first.' },
        ],
      },
    ],
  },
  {
    id: 'chess.2.mate-one',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Mate in one',
    minutes: 3,
    start: '6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1',
    steps: [
      { kind: 'askMove', text: 'Back rank: give checkmate.', accept: ['a1a8'], claim: 'mate', success: 'Back-rank mate.' },
      { kind: 'askMove', position: '7k/8/6K1/8/8/8/Q7/8 w - - 0 1', text: 'Queen and king working together: give checkmate.', accept: ['a2a8'], wrong: { a2f7: 'Careful: that is stalemate. Black is not in check but has no move, so the game is a draw.' }, claim: 'mate', success: 'Mate. The queen checks along the back rank and your king covers the escape squares.' },
      { kind: 'askMove', position: 'r5rk/6pp/7N/8/8/8/8/6K1 w - - 0 1', text: 'A knight can mate a king hemmed in by its own pieces. Find it.', accept: ['h6f7'], claim: 'mate', success: 'Smothered mate!' },
    ],
  },
  {
    id: 'chess.2.trades',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Trade when you are ahead',
    minutes: 2,
    start: '3rk3/5ppp/8/8/8/8/5PPP/R2R2K1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'When you are ahead in material, trading pieces brings the end closer and makes your extra material count. When you are behind, avoid trades.' },
      { kind: 'askMove', text: 'You are a rook up. Trade a pair of rooks: take on d8.', accept: ['d1d8'], claim: 'legal', success: 'After the king takes back, your extra rook is alone on the board, and it wins easily.' },
    ],
  },
  {
    id: 'chess.2.open-files',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Rooks on open files',
    minutes: 2,
    start: '2r3k1/pp3ppp/8/8/8/8/PP3PPP/5RK1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A file with no pawns on it is open. Rooks belong on open files, where they can reach deep into the enemy camp. Here the c-, d- and e-files are open.', marks: ['c1', 'd1', 'e1'] },
      { kind: 'askMove', text: 'Your rook is stuck behind its own pawn. Put it on a safe open file.', accept: ['f1e1', 'f1d1'], wrong: { f1c1: 'On c1 the black rook takes it, with check, and you cannot take back.' }, claim: 'legal', success: 'Good. An active rook is worth far more than a passive one.' },
    ],
  },
  {
    id: 'chess.2.count',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Count attackers and defenders',
    minutes: 3,
    start: 'r5k1/pp3ppp/5n2/3b4/8/2N5/PP3PPP/3R2K1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'Before you capture, count. A piece attacked more times than it is defended can usually be won, if you capture with your least valuable piece first.', marks: ['d5'] },
      { kind: 'askNumber', text: 'How many of your pieces attack the bishop on d5?', answer: 'attackers:d5', success: 'Yes, {attackers:d5}: the knight and the rook.' },
      { kind: 'askNumber', text: 'And how many black pieces defend it?', answer: 'defenders:d5', success: 'Right, only the knight on f6.' },
      { kind: 'askMove', text: 'Win the bishop. Start with your cheaper piece.', accept: ['c3d5'], wrong: { d1d5: 'Rook first means your rook is traded for a bishop and a knight. Knight first wins a whole piece.' }, claim: 'best', success: 'After the knight on f6 takes back, your rook takes again: you have won a piece.' },
    ],
  },
  {
    id: 'chess.2.king-safety',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Keep your king safe',
    minutes: 3,
    start: 'r1bqk1nr/pppp1ppp/2n5/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4',
    steps: [
      { kind: 'say', text: 'Your knight and bishop on the kingside are out, so the way is clear. Castling now puts the king behind a wall of pawns and brings the rook towards the centre.', arrows: [{ from: 'e1', to: 'g1' }] },
      { kind: 'askMove', text: 'Castle on the kingside.', accept: ['e1g1'], claim: 'legal', success: 'O-O. Your king is tucked away.' },
      {
        kind: 'askChoice',
        text: 'After castling, which pawn moves weaken your king most?',
        options: [
          { text: 'Pushing the pawns in front of it, such as g4 or h4', correct: true, why: 'Yes. Those pawns are the king’s shelter; leave them at home unless you have a reason.' },
          { text: 'Pushing the pawns on the other side of the board', why: 'Those matter much less for the king. The pawns in front of it are its shelter.' },
        ],
      },
    ],
  },
  {
    id: 'chess.2.passed-pawn',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Passed pawns must be pushed',
    minutes: 3,
    start: '8/5k2/8/1P6/8/8/6K1/8 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A pawn is passed when no enemy pawn stands in front of it or on a file next to it. Nothing but pieces can stop it, and it threatens to become a queen.', marks: ['b5'] },
      { kind: 'askMove', text: 'Your b-pawn is passed. Push it now, before the black king comes closer.', accept: ['b5b6'], claim: 'best', success: 'Now the black king is too far away to catch it. One slow move would have let it in.' },
      {
        kind: 'askChoice',
        text: 'How can you tell whether a king can catch a passed pawn?',
        options: [
          { text: 'Picture a square from the pawn to the far edge. If the king can step into it, it catches the pawn', correct: true, why: 'Yes. Players call it the rule of the square.' },
          { text: 'A king can always catch a pawn', why: 'Not when it is too far away. Picture the square from the pawn to the edge of the board.' },
        ],
      },
    ],
  },
  {
    id: 'chess.2.active-king',
    gameId: 'chess',
    stage: 'stage-2',
    title: 'Use your king in the endgame',
    minutes: 2,
    start: '8/8/4k3/8/8/8/4P3/4K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'With most pieces gone, mate is no longer the danger, and the king becomes a strong piece. Bring it towards the centre and in front of your pawns.' },
      { kind: 'askMove', text: 'King and pawn against king: walk your king forward first.', accept: ['e1d2', 'e1f2'], wrong: { e2e4: 'The pawn alone gets stopped. In this kind of ending the king leads and the pawn follows.', e2e3: 'The pawn alone gets stopped. In this kind of ending the king leads and the pawn follows.' }, claim: 'legal', success: 'Good. The king leads, the pawn follows.' },
    ],
  },
];

export const STAGE_3: readonly Lesson[] = [
  {
    id: 'chess.3.fork',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'The fork',
    minutes: 3,
    start: 'r3k3/p6p/8/3N4/8/8/P6P/4K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A fork is one piece attacking two at once. The opponent can save only one. Knights are the great forkers.' },
      { kind: 'askMove', text: 'Fork the king and the rook.', accept: ['d5c7'], claim: 'best', success: 'Nc7+ forks king and rook. The rook falls next move.', reply: 'e8d7' },
      { kind: 'askMove', text: 'Collect the rook.', accept: ['c7a8'], claim: 'best', success: 'A rook up.' },
    ],
  },
  {
    id: 'chess.3.pin',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'The pin',
    minutes: 3,
    start: '4k3/pp3ppp/2n5/8/8/8/PP3PPP/3BK3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A pin attacks a piece that cannot move without exposing a more valuable piece behind it. When the piece behind is the king, the pinned piece may not move at all.' },
      { kind: 'askMove', text: 'Pin the knight to the king.', accept: ['d1a4'], claim: 'legal', success: 'Ba4 pins the knight: it may not move, because the king is behind it.' },
      {
        kind: 'askChoice',
        text: 'The pinned knight is defended only by a pawn. What is a good way to use the pin?',
        options: [
          { text: 'Attack the pinned piece again, for example with a pawn, since it cannot run', correct: true, why: 'Yes. Pile up on a pinned piece: it cannot escape.' },
          { text: 'Trade your bishop for it at once', why: 'That is only an even trade. Keep the pin and add pressure.' },
        ],
      },
    ],
  },
  {
    id: 'chess.3.skewer',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'The skewer',
    minutes: 2,
    start: '8/q7/8/8/k7/6K1/8/7R w - - 0 1',
    steps: [
      { kind: 'say', text: 'A skewer is a pin turned round: a valuable piece is attacked, and when it moves away, the piece behind it is lost.' },
      { kind: 'askMove', text: 'Check the king so that the queen behind it is exposed.', accept: ['h1a1'], claim: 'best', success: 'Ra1+ skewers king and queen. The king must step aside, and the queen falls.' },
    ],
  },
  {
    id: 'chess.3.discovered',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'The discovered attack',
    minutes: 3,
    start: '3q4/8/7k/8/3N4/8/8/3R2K1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'When one piece moves out of another’s way, the piece behind it attacks. If the moving piece gives check at the same time, the opponent has no time to deal with the attack.', arrows: [{ from: 'd1', to: 'd8' }] },
      { kind: 'askMove', text: 'Move the knight with check, and let the rook attack the queen.', accept: ['d4f5'], wrong: { d4c6: 'The knight attacks the queen, but it is not check: the queen simply takes your rook.', d4e6: 'The knight attacks the queen, but it is not check: the queen simply takes your rook.' }, claim: 'best', success: 'Discovered attack! Black must answer the check first.', reply: 'h6g6' },
      { kind: 'askMove', text: 'Now collect the queen.', accept: ['d1d8'], claim: 'best', success: 'The queen is yours.' },
    ],
  },
  {
    id: 'chess.3.back-rank',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'Back-rank danger',
    minutes: 2,
    start: '3r2k1/5ppp/8/8/8/8/5PPP/6K1 w - - 0 1',
    steps: [
      { kind: 'say', text: 'A king behind an unbroken row of pawns can be mated by a rook or queen on the back rank. Here Black threatens Rd1 mate.', arrows: [{ from: 'd8', to: 'd1' }] },
      { kind: 'askMove', text: 'Give your king an escape square with a pawn move, so that the rook check is not mate.', accept: ['h2h3', 'g2g3', 'h2h4', 'g2g4'], claim: 'legal', success: 'Good: the king can now step off the back rank. Players call this making luft.' },
    ],
  },
  {
    id: 'chess.3.queen-mate',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'Mate with king and queen',
    minutes: 4,
    start: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1',
    steps: [
      { kind: 'say', text: 'With king and queen against a lone king, push the enemy king to the edge with the queen, then bring your own king up to help. Never leave the enemy king with no move unless it is check: that is stalemate.' },
      { kind: 'freePlay', position: '8/8/8/4k3/8/8/8/4K2Q w - - 0 1', text: 'Give checkmate. The computer defends as well as it can.', goal: 'mate', maxMoves: 30, success: 'Checkmate with king and queen.' },
    ],
  },
  {
    id: 'chess.3.rook-mate',
    gameId: 'chess',
    stage: 'stage-3',
    title: 'Mate with king and rook',
    minutes: 4,
    start: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1',
    steps: [
      { kind: 'say', text: 'King and rook also beat a lone king. Use the rook to cut the king off, rank by rank, and bring your king in front of the enemy king to take away its squares.' },
      { kind: 'freePlay', position: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1', text: 'Give checkmate.', goal: 'mate', maxMoves: 50, success: 'Checkmate with king and rook.' },
    ],
  },
];
