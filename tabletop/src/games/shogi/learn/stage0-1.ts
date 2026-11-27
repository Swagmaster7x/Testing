/**
 * Shogi lessons, stage 0 (what the game is) and stage 1 (the rules), starting on the 5×5
 * mini-shogi board where every idea shows up quickly. All prose is original; every number is a
 * {placeholder} computed from the rules (learn/game.ts).
 */
import type { Lesson } from '../../../teach/lesson';
import { START_SFEN } from '../core';

const MINI = START_SFEN.mini;
const STANDARD = START_SFEN.standard;

export const STAGE_0: readonly Lesson[] = [
  {
    id: 'shogi.0.game',
    gameId: 'shogi',
    stage: 'stage-0',
    title: 'Shogi in a minute',
    minutes: 2,
    start: STANDARD,
    steps: [
      {
        kind: 'say',
        text: 'Shogi is Japanese chess: two armies on a board of {board:files} by {board:files} squares. The first player is sente (sen-teh), called Black in English; the second is gote (go-teh), called White. The pieces are all one colour: a piece belongs to the side it points away from.',
      },
      { kind: 'say', text: 'Each side has {pieces:each} pieces of {kinds:each} kinds. As in chess, you win by trapping the enemy king so it cannot escape: checkmate, tsumi (tsoo-mee) in Japanese.', marks: ['59', '51'] },
      { kind: 'say', text: 'The big difference from chess: a piece you capture joins your hand (mochigoma). On a later turn you may put it back on the board as your own, in place of a move. That is a drop.' },
      {
        kind: 'askChoice',
        text: 'What happens to a piece you capture?',
        options: [
          { text: 'It joins your hand, and you may drop it back as your own', correct: true, why: 'Yes. In shogi pieces never leave the game: they change sides.' },
          { text: 'It leaves the game, as in chess', why: 'Not in shogi: captured pieces change sides and come back as drops.' },
          { text: 'It goes back to its starting square', why: 'No. It joins the hand of the player who took it.' },
        ],
      },
      { kind: 'say', text: 'You will start on mini-shogi, a {mini:files} by {mini:files} board where all of that happens fast. Then the full board.' },
    ],
  },
  {
    id: 'shogi.0.mini',
    gameId: 'shogi',
    stage: 'stage-0',
    title: 'Mini-shogi: the small board',
    minutes: 2,
    start: MINI,
    steps: [
      { kind: 'say', text: 'Mini-shogi has {mini:squares} squares and {mini:pieces} pieces a side: king, gold, silver, bishop, rook and one pawn. Sente sits at the bottom and moves first.', marks: ['55', '11'] },
      { kind: 'say', text: 'Squares are named file then rank. Files count from the right as Black sees the board, ranks from the top. The black king stands on 55 and the white king on 11.' },
      {
        kind: 'askChoice',
        text: 'Which square is the black pawn on?',
        options: [
          { text: '54', correct: true, why: 'Right: file 5, rank 4, just in front of the black king.' },
          { text: '45', why: 'That is the black gold. Count files from the right and ranks from the top.' },
          { text: '12', why: 'That is the white pawn, in front of the white king.' },
        ],
      },
      { kind: 'show', text: 'Watch the first moves of a game: both pawns step forward, then each side brings a silver up.', moves: ['5453', '1213', '3544', '3122'] },
      { kind: 'askMove', text: 'Your turn. Step your pawn forward again.', accept: ['5352'], claim: 'legal', success: 'Good. One more step and it would reach the far rank, where pieces promote.' },
    ],
  },
];

export const STAGE_1: readonly Lesson[] = [
  {
    id: 'shogi.1.king',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The king',
    minutes: 2,
    start: '4k4/9/9/9/4K4/9/9/9/9 b - 1',
    steps: [
      { kind: 'say', text: 'The king (玉, gyoku) steps one square in any of the {dirs:king} directions. It may never step onto a square the enemy attacks.', arrows: [{ from: '55', to: '54' }, { from: '55', to: '66' }] },
      { kind: 'askNumber', text: 'From 55, how many squares can the king reach?', answer: 'reach:55', success: 'Yes, {reach:55}: every square around it.' },
      {
        kind: 'askMove',
        position: '2r1k/s4/2K1g/5/b4 b - 1',
        text: 'Your king on 33 is in check from the rook and from the bishop. The gold and the silver guard more squares. Find the only safe square.',
        accept: ['3342'],
        claim: 'only',
        success: 'Yes. Every other square is attacked: the rook’s file, the bishop’s diagonal, the gold and the silver.',
      },
    ],
  },
  {
    id: 'shogi.1.gold',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The gold general',
    minutes: 2,
    start: '5/5/2G2/5/K3k b - 1',
    steps: [
      { kind: 'say', text: 'The gold (金, kin) steps one square straight in any direction, or diagonally forward: {dirs:gold} directions. It cannot step diagonally back.', arrows: [{ from: '33', to: '22' }, { from: '33', to: '34' }] },
      { kind: 'askNumber', text: 'From 33, how many squares can the gold reach?', answer: 'reach:33', success: 'Right, {reach:33}.' },
      {
        kind: 'askMove',
        position: '5/1p3/2G2/5/K3k b - 1',
        text: 'Capture the pawn with your gold.',
        accept: ['3342'],
        wrong: { '3334': 'That steps straight back: a fine gold move, but it does not take the pawn.' },
        claim: 'legal',
        success: 'Taken, diagonally forward.',
      },
    ],
  },
  {
    id: 'shogi.1.silver',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The silver general',
    minutes: 2,
    start: '5/5/2S2/5/K3k b - 1',
    steps: [
      { kind: 'say', text: 'The silver (銀, gin) steps one square diagonally in any direction, or straight forward: {dirs:silver} directions. It cannot step sideways or straight back.', arrows: [{ from: '33', to: '32' }, { from: '33', to: '44' }] },
      { kind: 'askNumber', text: 'From 33, how many squares can the silver reach?', answer: 'reach:33', success: 'Yes, {reach:33}.' },
      {
        kind: 'askMove',
        position: '5/5/2S2/1p3/K3k b - 1',
        text: 'The silver can retreat diagonally. Capture the pawn behind it.',
        accept: ['3344'],
        claim: 'legal',
        success: 'Good: diagonally back, something a gold cannot do.',
      },
      {
        kind: 'askChoice',
        text: 'Which general can step diagonally backwards?',
        options: [
          { text: 'The silver', correct: true, why: 'Yes. The gold covers straight back and sideways instead.' },
          { text: 'The gold', why: 'No: the gold goes diagonally forwards only.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.1.rook',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The rook and the dragon',
    minutes: 2,
    start: '5/5/2R2/5/K3k b - 1',
    steps: [
      { kind: 'say', text: 'The rook (飛車, hisha) moves any distance along its rank or file. Promoted, it becomes the dragon (龍, ryū), which can also step one square diagonally.', arrows: [{ from: '33', to: '31' }, { from: '33', to: '13' }] },
      { kind: 'askNumber', text: 'From 33, how many squares can the rook reach?', answer: 'reach:33', success: 'Right, {reach:33}.' },
      {
        kind: 'askMove',
        position: '2b2/5/2R2/5/K3k b - 1',
        text: 'Capture the bishop on the far rank.',
        accept: ['3331+', '3331'],
        claim: 'legal',
        success: 'Taken. On the far rank it could also promote: more on that soon.',
      },
    ],
  },
  {
    id: 'shogi.1.bishop',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The bishop and the horse',
    minutes: 2,
    start: '5/5/2B1k/5/K4 b - 1',
    steps: [
      { kind: 'say', text: 'The bishop (角, kaku) moves any distance diagonally. Promoted, it becomes the horse (馬, uma), which can also step one square straight.', arrows: [{ from: '33', to: '11' }, { from: '33', to: '51' }] },
      { kind: 'askNumber', text: 'From 33, how many squares can the bishop reach?', answer: 'reach:33', success: 'Yes, {reach:33}. Its own king blocks one diagonal.' },
      {
        kind: 'askMove',
        position: 's4/5/2B1k/5/K4 b - 1',
        text: 'Capture the silver in the corner.',
        accept: ['3351+', '3351'],
        claim: 'legal',
        success: 'Good. A long diagonal move.',
      },
    ],
  },
  {
    id: 'shogi.1.pawn',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The pawn',
    minutes: 2,
    start: '5/5/2s2/2P2/K3k b - 1',
    steps: [
      { kind: 'say', text: 'The pawn (歩, fu) steps one square straight forward, and it captures the same way: straight ahead, not diagonally as in chess. It never moves back.' },
      { kind: 'askMove', text: 'Capture the silver with your pawn.', accept: ['3433'], claim: 'legal', success: 'Right: straight ahead.' },
      {
        kind: 'askChoice',
        text: 'Your pawn is on 34 and an enemy piece on 43. Can the pawn take it?',
        options: [
          { text: 'No: pawns capture straight ahead only', correct: true, why: 'Yes. A shogi pawn attacks just the square in front of it.' },
          { text: 'Yes, diagonally, as in chess', why: 'Not in shogi: the pawn captures straight ahead.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.1.knight-lance',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The knight and the lance',
    minutes: 3,
    start: '4k4/9/9/9/4N4/9/9/9/4K4 b - 1',
    steps: [
      { kind: 'say', text: 'Two pieces of the full board. The knight (桂, kei) jumps two squares forward and one across: only the {knight:targets} squares in front of it. It is the only piece that jumps.', arrows: [{ from: '55', to: '43' }, { from: '55', to: '63' }] },
      { kind: 'askNumber', text: 'How many squares can this knight reach?', answer: 'reach:55', success: 'Yes, {reach:55}. It never moves sideways or back.' },
      { kind: 'askMove', position: '4k4/9/9/3g5/9/4N4/9/9/4K4 b - 1', text: 'Capture the gold with the knight.', accept: ['5664'], claim: 'legal', success: 'Good: a jump.' },
      { kind: 'say', position: '4k4/9/9/9/9/9/9/9/L3K4 b - 1', text: 'The lance (香, kyō) runs any distance straight forward, never back or sideways.', arrows: [{ from: '99', to: '92' }] },
      { kind: 'askNumber', text: 'How many squares can the lance reach from 99?', answer: 'reach:99', success: 'Right, {reach:99}: the whole file in front of it.' },
    ],
  },
  {
    id: 'shogi.1.promotion',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Promotion',
    minutes: 3,
    start: '4k4/9/9/4S4/9/9/9/9/4K4 b - 1',
    steps: [
      { kind: 'say', text: 'The far {zone:ranks} ranks are your promotion zone (on the mini board, only the far {mini:zone}). A rook, bishop, silver, knight, lance or pawn that moves into, inside or out of the zone may promote: you turn it over.', marks: ['63', '53', '43'] },
      { kind: 'say', text: 'A promoted silver, knight, lance or pawn moves like a gold. A promoted rook or bishop keeps its long moves and gains the steps it lacked. Golds and kings never promote.' },
      {
        kind: 'askMove',
        text: 'Move the silver into the zone and promote it.',
        accept: ['5453+', '5443+', '5463+'],
        wrong: { '5453': 'That went in without promoting. Here, promote it.', '5443': 'That went in without promoting. Here, promote it.' },
        claim: 'legal',
        success: 'Promoted: it now moves like a gold.',
      },
      {
        kind: 'askChoice',
        text: 'A pawn reaches the last rank. Must it promote?',
        options: [
          { text: 'Yes: otherwise it could never move again', correct: true, why: 'Right. The same goes for a lance on the last rank and a knight on the last two.' },
          { text: 'No, promotion is always a choice', why: 'Usually it is, but a piece that could never move again must promote.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.1.capture',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Captures change sides',
    minutes: 2,
    start: '5/2+p2/2G2/5/K3k b - 1',
    steps: [
      { kind: 'say', text: 'When you capture, the piece goes into your hand, turned back to its plain side. A captured tokin (と, toh-kin), a promoted pawn, becomes an ordinary pawn in your hand.' },
      { kind: 'askMove', text: 'Capture the tokin with your gold.', accept: ['3332'], claim: 'legal', success: 'Taken.' },
      { kind: 'askNumber', text: 'How many pawns are in your hand now?', answer: 'hand:black:P', success: 'Yes: {hand:black:P}. It is yours to drop later.' },
    ],
  },
  {
    id: 'shogi.1.drops',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Drops',
    minutes: 2,
    start: '4k/5/5/5/K4 b G 1',
    steps: [
      { kind: 'say', text: 'Instead of moving, you may put one piece from your hand on any empty square: a drop. The dropped piece is yours, points forward and starts unpromoted, even inside the zone.' },
      { kind: 'askMove', text: 'Drop your gold on 23.', accept: ['G*23'], claim: 'legal', success: 'Dropped. A drop uses your whole turn.' },
      {
        kind: 'askChoice',
        position: '4k/5/5/5/K4 b S 1',
        text: 'You drop a silver on the far rank. Is it promoted?',
        options: [
          { text: 'No: dropped pieces always start unpromoted', correct: true, why: 'Right. It may promote when it later moves.' },
          { text: 'Yes, inside the zone it promotes at once', why: 'No. A dropped piece starts plain and promotes on a later move.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.1.drop-rules',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Where you may not drop',
    minutes: 3,
    start: '4k4/9/9/9/9/9/4P4/9/4K4 b P 1',
    steps: [
      { kind: 'say', text: 'Three rules limit drops. First, two pawns (nifu, nee-foo): you may never have two unpromoted pawns of yours on one file.', marks: ['57'] },
      {
        kind: 'askChoice',
        text: 'Your pawn stands on 57 and you have another in hand. May you drop it on 55?',
        options: [
          { text: 'No: that would be two pawns on file 5', correct: true, why: 'Right. Drop it on another file.' },
          { text: 'Yes, any empty square will do', why: 'Not for pawns: one unpromoted pawn per file.' },
        ],
      },
      { kind: 'say', text: 'Second, no piece may be dropped where it could never move: no pawn or lance on the last rank, no knight on the last two.' },
      {
        kind: 'askChoice',
        text: 'May you drop a knight on the second rank, counted from your opponent’s side?',
        options: [
          { text: 'No: from there it could never jump again', correct: true, why: 'Right. A knight needs two ranks in front of it.' },
          { text: 'Yes', why: 'No. A knight there could never move, so the drop is not allowed.' },
        ],
      },
      {
        kind: 'say',
        position: '7nk/7p1/7S1/9/9/9/9/9/K8 b P 1',
        text: 'Third, pawn-drop mate (uchifuzume, oo-chee-foo-zoo-meh): you may not drop a pawn to give checkmate. Here a pawn on 12 would mate, so it is not allowed. A gold there would be fine.',
        marks: ['12'],
      },
      {
        kind: 'askChoice',
        text: 'Which of these may give checkmate?',
        options: [
          { text: 'A gold dropped on 12', correct: true, why: 'Yes. Only a dropped pawn may not mate.' },
          { text: 'A pawn dropped on 12', why: 'No: that is pawn-drop mate, uchifuzume.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.1.check',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Check and checkmate',
    minutes: 3,
    start: '4k/5/3S1/5/K4 b G 1',
    steps: [
      { kind: 'say', text: 'A king under attack is in check (ōte, oh-teh). The player in check must get out of it: move the king, capture the attacker, or put a piece in the way. You never have to announce it.' },
      { kind: 'say', text: 'When there is no way out, it is checkmate (tsumi) and the game is over. In shogi a player with no legal move at all also loses.' },
      {
        kind: 'askMove',
        text: 'Mate the white king with a drop. Your silver on 23 guards the squares around it.',
        accept: ['G*12', 'G*22'],
        claim: 'mate',
        success: 'Checkmate. The silver protects the gold, and the gold covers every escape.',
      },
    ],
  },
  {
    id: 'shogi.1.board',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'The full board',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'On the full board each side has a back rank of lance, knight, silver, gold, king, gold, silver, knight and lance; the bishop and rook on the rank in front; and {pawns:each} pawns ahead of them.' },
      { kind: 'say', text: 'Black’s rook starts on 28, on Black’s right, and the bishop on 88. White’s are the mirror image: rook on 82, bishop on 22.', marks: ['28', '88'] },
      { kind: 'askNumber', text: 'How many pieces does each side start with?', answer: 'pieces:each', success: 'Yes, {pieces:each}.' },
      {
        kind: 'askChoice',
        text: 'Where does Black’s rook start?',
        options: [
          { text: '28, on Black’s right', correct: true, why: 'Right. The bishop sits on the left, on 88.' },
          { text: '88, on Black’s left', why: 'That is the bishop’s square. The rook is on the right, on 28.' },
        ],
      },
      { kind: 'askMove', text: 'Open your bishop’s diagonal: move the pawn in front of it on the seventh file forward.', accept: ['7776'], claim: 'legal', success: 'P-76: the most common first move in shogi.' },
    ],
  },
  {
    id: 'shogi.1.ending',
    gameId: 'shogi',
    stage: 'stage-1',
    title: 'Other ways a game ends',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Most games end in checkmate or resignation. Rarely, the same position (same pieces, same hands, same player to move) comes up {rule:repetition} times: sennichite (sen-nee-chee-teh), a draw. In mini-shogi it is a loss for the player who moved first.' },
      { kind: 'say', text: 'But if one side gave check with every move of the repetition, that side loses. Perpetual check is not a way out.' },
      { kind: 'say', text: 'When both kings walk into the enemy camp, nobody may be able to mate: an impasse (jishōgi). Then points decide: rook and bishop {impasse:big} each, other pieces {impasse:small}. Tables use different rules; the Reference card lists them.' },
      {
        kind: 'askChoice',
        text: 'The same position comes up for the last allowed time, and White has checked with every move of it. What happens?',
        options: [
          { text: 'White loses: perpetual check', correct: true, why: 'Right. Otherwise a repetition would be a draw.' },
          { text: 'A draw by repetition', why: 'Not this time: continuous checks lose for the checking side.' },
        ],
      },
    ],
  },
];
