/**
 * Shogi lessons, stage 2 (first strategy: values, the basic mating patterns, drop tactics, the
 * opening) and stage 3 started (the Mino, Yagura and Anaguma castles; Static and Ranging Rook).
 * All prose is original. "best" claims are checked by the engine, "mate" and "only" by the rules.
 */
import type { Lesson } from '../../../teach/lesson';
import { START_SFEN } from '../core';

const STANDARD = START_SFEN.standard;

export const STAGE_2: readonly Lesson[] = [
  {
    id: 'shogi.2.values',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'What the pieces are worth',
    minutes: 3,
    start: '2k2/5/5/5/KGSBR b P 1',
    steps: [
      {
        kind: 'say',
        text: 'A common teaching scale: pawn {value:pawn}, lance {value:lance}, knight {value:knight}, silver {value:silver}, gold {value:gold}, bishop {value:bishop}, rook {value:rook}. Promoted, a bishop (horse) is worth about {value:horse} and a rook (dragon) {value:dragon}.',
      },
      { kind: 'say', text: 'Count pieces in hand too: they can be dropped anywhere, so they are worth a little more than the scale says. And a safe king can matter more than any piece.' },
      { kind: 'askNumber', text: 'Count Black’s material by the scale, including the pawn in hand. Kings count nothing.', answer: 'material:black', success: 'Right: {material:black}.' },
      {
        kind: 'askChoice',
        text: 'You can give your bishop for their gold and silver together. By the scale, is that a good trade?',
        options: [
          { text: 'Yes: a gold and a silver are worth more than a bishop', correct: true, why: 'Right: {value:gold} and {value:silver} against {value:bishop}. And both will be in your hand.' },
          { text: 'No: never give up a bishop', why: 'Bishops are strong, but {value:gold} and {value:silver} add up to more than {value:bishop}.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.head-gold',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Mate with a gold on the head',
    minutes: 2,
    start: '4k4/9/4P4/9/9/9/9/9/4K4 b G 1',
    steps: [
      { kind: 'say', text: 'The most famous mating pattern is the gold on the head, atama-kin (ah-tah-mah-kin): a gold dropped right in front of the king, protected from behind. It covers every square the king could run to.' },
      { kind: 'askMove', text: 'Your pawn on 53 is ready to protect. Mate with a drop.', accept: ['G*52'], claim: 'mate', success: 'Checkmate: the gold on the head.' },
      { kind: 'askMove', position: '1k3/5/1P3/5/K4 b G 1', text: 'The same idea on the small board.', accept: ['G*42'], claim: 'mate', success: 'Mate again. Look for it whenever a pawn or another piece guards the square in front of the king.' },
    ],
  },
  {
    id: 'shogi.2.knight-mate',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'A knight check cannot be blocked',
    minutes: 2,
    start: '7nk/7bl/9/9/9/9/9/9/4K4 b N 1',
    steps: [
      { kind: 'say', text: 'A king boxed in by its own pieces is in danger from a knight: a knight jumps, so nothing can be put in the way of its check.', marks: ['21', '22', '12'] },
      { kind: 'askMove', text: 'Mate the king with a knight drop.', accept: ['N*23'], claim: 'mate', success: 'Checkmate. The king’s own pieces fence it in.' },
      {
        kind: 'askChoice',
        text: 'Why can White not block this check?',
        options: [
          { text: 'A knight jumps: there is no square in between', correct: true, why: 'Right. A knight check is answered only by moving the king or taking the knight.' },
          { text: 'White has no pieces in hand', why: 'Even with pieces in hand, nothing can block a knight’s jump.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.fork',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'The drop fork',
    minutes: 2,
    start: '4k4/1r1g5/9/9/9/9/P8/LS7/KNG6 b N 1',
    steps: [
      { kind: 'say', text: 'Pieces in hand make forks easy: drop a piece where it attacks two at once (ryōtori, ryoh-toh-ree). Knights are the classic forking drop.' },
      { kind: 'askMove', text: 'Drop your knight to attack the rook and the gold together.', accept: ['N*74'], claim: 'best', success: 'A fork. One of them will fall.' },
    ],
  },
  {
    id: 'shogi.2.hanging',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Free pieces and their guards',
    minutes: 3,
    start: '4k4/9/9/7b1/9/9/9/7R1/4K4 b - 1',
    steps: [
      { kind: 'say', text: 'A piece nobody protects is hanging: it can be taken for free. In shogi the captured piece also joins your hand, so a hanging piece costs twice.' },
      { kind: 'askMove', text: 'Take the free piece.', accept: ['2824'], claim: 'best', success: 'Taken, and the bishop is now yours to drop.' },
      {
        kind: 'say',
        position: '4k4/9/9/9/3gs4/4R4/9/9/4K4 b - 1',
        text: 'Before you take, count. How many of their pieces guard the target, and how many of yours attack it?',
        marks: ['55'],
      },
      { kind: 'askNumber', text: 'How many white pieces defend the silver on 55?', answer: 'defenders:55', success: 'Yes, {defenders:55}: the gold beside it.' },
      {
        kind: 'askChoice',
        text: 'Should your rook take the silver?',
        options: [
          { text: 'No: the gold takes back and you lose your rook for a silver', correct: true, why: 'Right: {value:rook} given for {value:silver}.' },
          { text: 'Yes: a capture is always good', why: 'Not here: the gold takes back, and you lose {value:rook} for {value:silver}.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.promote',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Make a dragon',
    minutes: 2,
    start: '4k4/9/9/9/9/9/9/7R1/4K4 b - 1',
    steps: [
      { kind: 'say', text: 'A rook that gets into the enemy camp promotes into a dragon: all the rook’s moves plus a step to each diagonal. Breaking in with the rook is a goal of most attacks.' },
      { kind: 'askMove', text: 'Drive your rook into the zone and promote it.', accept: ['2823+', '2822+', '2821+'], wrong: { '2823': 'In, but not promoted. Turn it over.' }, claim: 'legal', success: 'A dragon (龍, ryū).' },
      {
        kind: 'askChoice',
        text: 'What can a dragon do that a rook cannot?',
        options: [
          { text: 'Step one square diagonally', correct: true, why: 'Right. It keeps every rook move as well.' },
          { text: 'Jump over pieces', why: 'No: only knights jump. A dragon adds the diagonal steps.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.tsume',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Mate in three, every move a check',
    minutes: 3,
    start: '7sk/6G1n/9/9/9/9/9/9/K8 b RG 1',
    steps: [
      { kind: 'say', text: 'A mating problem (tsume, tsoo-meh) is solved with a check on every move. Count in plies, as shogi does: “mate in three” is your move, theirs, then mate.' },
      { kind: 'askMove', text: 'Start with a sacrifice: drop a gold where it checks and must be taken.', accept: ['G*22'], claim: 'best', reply: '2122', success: 'Taken by the silver, which now blocks its own king.' },
      { kind: 'askMove', text: 'Now mate.', accept: ['R*21'], claim: 'mate', success: 'Checkmate. The sacrifice pulled the silver onto the king’s escape square.' },
    ],
  },
  {
    id: 'shogi.2.castle-intro',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Why castle the king',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Because captured pieces come back as drops, a king left in the middle is mated fast. Strong players spend the opening building a castle (kakoi, kah-koh-ee): the king tucked to one side, behind golds and silvers.' },
      { kind: 'say', text: 'Keep the king away from your rook: the rook leads the attack, and the king should not stand where the fighting starts.' },
      {
        kind: 'askChoice',
        text: 'Your rook stays on its starting file. Where should your king go?',
        options: [
          { text: 'To the other side, the left, behind golds and silvers', correct: true, why: 'Right: away from the rook’s attack.' },
          { text: 'Next to the rook, to help it attack', why: 'The king should stay away from where the fighting starts.' },
          { text: 'Forward into the middle', why: 'A king in the middle is easy to attack with drops.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.opening',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'First moves',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Two first moves cover most games: P-76 opens the bishop’s diagonal, and P-26 pushes the rook’s pawn towards the enemy camp.', arrows: [{ from: '77', to: '76' }, { from: '27', to: '26' }] },
      { kind: 'askMove', text: 'Push the pawn in front of your rook.', accept: ['2726'], claim: 'legal', success: 'P-26. The rook’s pawn will lead the attack on the second file.' },
      {
        kind: 'askChoice',
        position: STANDARD,
        text: 'Which is not a good habit in the opening?',
        options: [
          { text: 'Walking the king forward to the middle', correct: true, why: 'Right: castle it to the side instead.' },
          { text: 'Opening the bishop’s diagonal', why: 'That is a good start, and P-76 does it.' },
          { text: 'Pushing the rook’s pawn', why: 'That is good: it prepares the rook’s attack.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.2.free-mate',
    gameId: 'shogi',
    stage: 'stage-2',
    title: 'Mate the lone king',
    minutes: 3,
    start: '4k/5/5/5/KGS2 b G 1',
    steps: [
      { kind: 'say', text: 'Time to play it out. On the small board, mate the lone king with your gold, silver and the gold in hand. The computer defends as well as it can.' },
      {
        kind: 'freePlay',
        position: '4k/5/5/5/KGS2 b G 1',
        text: 'Mate the king. Bring your generals up together and keep a gold in hand for the final drop.',
        goal: 'mate',
        maxMoves: 12,
        success: 'Checkmate. Generals working together, finished by a drop.',
      },
    ],
  },
];

export const STAGE_3: readonly Lesson[] = [
  {
    id: 'shogi.3.mino',
    gameId: 'shogi',
    stage: 'stage-3',
    title: 'The Mino castle',
    minutes: 4,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'In Ranging Rook (furibisha, foo-ree-bee-shah) the rook swings to the left and the king goes right, into the Mino castle (mee-noh): quick to build and strong from the side.' },
      { kind: 'show', text: 'Black opens the bishop, blocks its diagonal with P-66 and swings the rook to the sixth file. White plays quietly.', moves: ['7776', '3334', '6766', '8384', '2868', '8485', '8877', '7162'] },
      { kind: 'show', text: 'Now the king walks right while the silver steps up to make room.', moves: ['5948', '5142', '3938', '4232', '4839', '6152', '3928', '1314'] },
      { kind: 'askMove', text: 'Finish the Mino: bring the left gold up beside the king’s guards.', accept: ['6958'], claim: 'legal', success: 'The Mino castle: king on 28, silver on 38, golds on 49 and 58.' },
      {
        kind: 'askChoice',
        text: 'Which piece sits right above the king in this Mino?',
        options: [
          { text: 'The silver', correct: true, why: 'Yes, on 38, with the golds on 49 and 58 beside it.' },
          { text: 'A gold', why: 'The golds are on 49 and 58; the silver covers the king from 38.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.3.yagura',
    gameId: 'shogi',
    stage: 'stage-3',
    title: 'The Yagura castle',
    minutes: 3,
    start: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/2PP5/PPSGPPPPP/2GB3R1/LNK3SNL b - 1',
    steps: [
      { kind: 'say', text: 'When both rooks stay home (Static Rook, ibisha, ee-bee-shah), a classic castle is the Yagura (yah-goo-rah, “the fortress tower”): silver on 77, golds on 78 and 67, and pawns on 76 and 66 in front.', marks: ['77', '78', '67'] },
      { kind: 'askMove', text: 'Put the king into the tower, behind the silver.', accept: ['7988'], claim: 'legal', success: 'The Yagura: the king on 88, guarded from the front.' },
      {
        kind: 'askChoice',
        text: 'Where is the Yagura strongest?',
        options: [
          { text: 'Against attacks from straight in front', correct: true, why: 'Right: its wall of generals and pawns faces forward.' },
          { text: 'Against attacks from the side', why: 'That is the Mino’s strength. The Yagura faces forward.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.3.anaguma',
    gameId: 'shogi',
    stage: 'stage-3',
    title: 'The Anaguma castle',
    minutes: 3,
    start: 'lnsgkgsnl/1r5b1/ppppppppp/9/9/2P6/PPNPPPPPP/LS1B3R1/1KG2GSNL b - 1',
    steps: [
      { kind: 'say', text: 'The Anaguma (ah-nah-goo-mah, “badger in its hole”) hides the king in the corner: the lance steps up one square, the king goes into its place, and silver and golds close the hole.', marks: ['98', '88', '79'] },
      { kind: 'askMove', text: 'Put the king into the hole.', accept: ['8999'], claim: 'legal', success: 'The Anaguma. No check can come from below or from the edge.' },
      {
        kind: 'askChoice',
        text: 'What is the Anaguma’s weakness?',
        options: [
          { text: 'It takes many moves to build, and the king cannot run away', correct: true, why: 'Right: hard to break, slow to build, and no escape if it falls.' },
          { text: 'It leaves the king in the middle', why: 'No: the king sits in the corner, the farthest point from the middle.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.3.rooks',
    gameId: 'shogi',
    stage: 'stage-3',
    title: 'Static Rook and Ranging Rook',
    minutes: 3,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Every game starts with a choice. Static Rook (ibisha): the rook stays on its file and the king castles left. Ranging Rook (furibisha): the rook swings left and the king castles right.' },
      { kind: 'show', text: 'A Ranging Rook start: the bishop opens, then its diagonal is closed with P-66.', moves: ['7776', '3334', '6766', '8384'] },
      { kind: 'askMove', text: 'Swing your rook to the sixth file: the Fourth File Rook (shikenbisha), counted from your left.', accept: ['2868'], claim: 'legal', success: 'R-68. Now the king can castle on the right.' },
      {
        kind: 'askChoice',
        text: 'In a Ranging Rook game, which castle fits the king?',
        options: [
          { text: 'The Mino, on the right', correct: true, why: 'Right: the classic home for a ranging-rook king.' },
          { text: 'The Yagura, on the left', why: 'The Yagura belongs to Static Rook games, where the rook stays right.' },
        ],
      },
    ],
  },
];
