/**
 * The Table-ready track for shogi: what an app does for you that a real board does not.
 * Setting up, piece names and their sounds, reading and writing moves, etiquette, the clock.
 */
import type { Lesson } from '../../../teach/lesson';
import { START_SFEN } from '../core';

const STANDARD = START_SFEN.standard;

export const TABLE_READY: readonly Lesson[] = [
  {
    id: 'shogi.table.setup',
    gameId: 'shogi',
    stage: 'table',
    title: 'Setting up the pieces',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Pieces are kept in a box (komabako) or a bag. Tip them on the board, then set them out in a fixed order, both players together. The king goes first, in the middle of your back rank.' },
      { kind: 'say', text: 'In the common order the golds go beside the king, then silvers, knights and lances outward; then the bishop on your left and the rook on your right; the pawns last, from left to right.', marks: ['59', '69', '49'] },
      {
        kind: 'askChoice',
        text: 'Which piece is placed first?',
        options: [
          { text: 'The king', correct: true, why: 'Yes. Traditionally the stronger player’s king, 王, goes down first, then the other player’s, 玉.' },
          { text: 'The rook', why: 'The rook comes after the back rank. The king goes first.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'Where does your bishop go?',
        options: [
          { text: 'On the left, in front of your knight', correct: true, why: 'Right: 88 for Black. The rook goes on the right, on 28.' },
          { text: 'On the right', why: 'That is the rook’s side. The bishop goes on the left.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.table.names',
    gameId: 'shogi',
    stage: 'table',
    title: 'Piece names and how to say them',
    minutes: 3,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'At a real board you will hear the Japanese names. King: ōshō or gyokushō (oh-shoh, gyoh-koo-shoh). Rook: hisha (hee-shah). Bishop: kakugyō, or just kaku (kah-koo).' },
      { kind: 'say', text: 'Gold: kin (keen). Silver: gin (geen). Knight: keima, or kei (kay). Lance: kyōsha, or kyō (kyoh). Pawn: fu (foo). A promoted pawn is a tokin (toh-keen).' },
      {
        kind: 'checkpoint',
        text: 'Name the piece.',
        questions: [
          {
            kind: 'askChoice',
            text: 'What is 飛 called?',
            options: [
              { text: 'Hisha, the rook', correct: true },
              { text: 'Kaku, the bishop' },
              { text: 'Kin, the gold' },
            ],
          },
          {
            kind: 'askChoice',
            text: 'What is 銀 called?',
            options: [
              { text: 'Kin, the gold' },
              { text: 'Gin, the silver', correct: true },
              { text: 'Kei, the knight' },
            ],
          },
          {
            kind: 'askChoice',
            text: 'What is 歩 called?',
            options: [
              { text: 'Fu, the pawn', correct: true },
              { text: 'Kyō, the lance' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'shogi.table.notation',
    gameId: 'shogi',
    stage: 'table',
    title: 'Reading and writing moves',
    minutes: 3,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'A game record is a kifu (kee-foo). In Japanese each move is the square, then the piece: ▲7六歩 is sente’s pawn to 7六, which is file 7, rank 6 (ranks are written as kanji numerals). △ marks gote’s moves.' },
      { kind: 'say', text: 'English books write the same move P-76: piece letter, a dash (x for a capture, * for a drop), then the square. A trailing + promotes, and = declines a promotion.' },
      { kind: 'askMove', text: 'Play ▲7六歩, that is P-76.', accept: ['7776'], claim: 'legal', success: 'Right. Now gote answers △3四歩, P-34.', reply: '3334' },
      {
        kind: 'askChoice',
        text: 'A record says △同銀. What does 同 mean?',
        options: [
          { text: 'On the same square as the last move', correct: true, why: 'Right: dō, “same”. The silver recaptures where the last move landed.' },
          { text: 'A drop', why: 'Drops are written 打 (uchi). 同 means the same square as the last move.' },
          { text: 'A promotion', why: 'Promotion is 成 (nari). 同 means the same square as the last move.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'How do you write a silver dropped on 52 in English notation?',
        options: [
          { text: 'S*52', correct: true, why: 'Right. In Japanese it is 5二銀打 when the 打 is needed to tell it from a move.' },
          { text: 'S-52', why: 'The dash is a move on the board. A drop uses *.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.table.etiquette',
    gameId: 'shogi',
    stage: 'table',
    title: 'Manners at the board',
    minutes: 3,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Begin with a bow and “onegaishimasu” (oh-neh-gah-ee-shee-mahs, “please”). Who moves first is often settled by tossing five pawns (furigoma): more pawns than tokins face up, and the tosser plays sente.' },
      { kind: 'say', text: 'There are no take-backs (matta, “wait!”). A move is made once your fingers leave the piece. An illegal move, such as two pawns on a file, loses the game on the spot in a tournament.' },
      { kind: 'say', text: 'To resign, say “makemashita” (mah-keh-mah-shee-tah, “I have lost”) and bow, or lay your hand over your piece stand. After the game both say “arigatō gozaimashita” and often go over the game together.' },
      {
        kind: 'askChoice',
        text: 'You let go of your piece and see a better move. What now?',
        options: [
          { text: 'The move stands: no take-backs', correct: true, why: 'Right. Think first, then move.' },
          { text: 'Ask “matta” and move again', why: 'Not at a real board: matta is not allowed.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'How do you resign?',
        options: [
          { text: 'Say “makemashita” and bow', correct: true, why: 'Yes. Resigning politely is part of the game.' },
          { text: 'Knock your king over', why: 'That is a chess habit. In shogi you say “makemashita”.' },
        ],
      },
    ],
  },
  {
    id: 'shogi.table.clock',
    gameId: 'shogi',
    stage: 'table',
    title: 'The clock and byōyomi',
    minutes: 2,
    start: STANDARD,
    steps: [
      { kind: 'say', text: 'Shogi clocks usually give each player some main time, then byōyomi (byoh-yoh-mee): once your main time runs out, every move must be made within a fixed number of seconds, as long as the game lasts.' },
      { kind: 'say', text: 'Press the clock with the hand you moved with. In byōyomi a voice or a beep counts down the seconds; when it reaches the end before you move, you lose on time.' },
      {
        kind: 'askChoice',
        text: 'Your main time is gone and you are in byōyomi. What does that mean?',
        options: [
          { text: 'Each move must be made within the set seconds', correct: true, why: 'Right, for every move until the game ends.' },
          { text: 'You have lost', why: 'Not yet: byōyomi lets you play on, a few seconds per move.' },
        ],
      },
    ],
  },
];
