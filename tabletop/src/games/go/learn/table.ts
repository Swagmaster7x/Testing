/**
 * The Table-ready track for Go: what an app does for you that a real board does not. Choosing
 * colours, manners at the board, placing handicap stones, counting by hand both ways, and clocks.
 */
import type { Lesson } from '../../../teach/lesson';
import { pos } from './stage0-1';

const EMPTY9 = Array.from({ length: 9 }, () => '.........');
// A finished game on 7×7: Black holds the left, White the right; the white stone on A4 is dead.
const FINISHED = ['..XO...', '..XO...', '..XO...', 'O.XO...', '..XO...', '..XO...', '..XO...'];

export const TABLE_READY: readonly Lesson[] = [
  {
    id: 'go.table.etiquette',
    gameId: 'go',
    stage: 'table',
    title: 'Manners at the board',
    minutes: 2,
    start: pos('b', EMPTY9),
    steps: [
      { kind: 'say', text: 'Before play, players bow slightly or say “onegai shimasu” (oh-NEH-guy shee-MAHS), “please”. Each keeps a bowl of stones and turns its lid over to hold prisoners, where the opponent can see them.' },
      { kind: 'say', text: 'Take one stone, hold it between your index and middle fingers, and put it down. Do not rattle the stones in your bowl, and do not hover your hand over the board while you think. As a courtesy, Black’s first stone usually goes in the upper right corner.', marks: ['G7'] },
      {
        kind: 'askChoice',
        text: 'Your opponent has clearly won. How do you resign politely?',
        options: [
          { text: 'Say “I resign” (or “makemashita”), or put two prisoners on the board', correct: true, why: 'Yes. Then thank your opponent; many players replay the game together afterwards.' },
          { text: 'Sweep the stones off the board', why: 'Never. Resign in words, or with prisoners on the board, and say thank you.' },
        ],
      },
    ],
  },
  {
    id: 'go.table.nigiri',
    gameId: 'go',
    stage: 'table',
    title: 'Who plays Black: nigiri',
    minutes: 2,
    start: pos('b', EMPTY9),
    steps: [
      { kind: 'say', text: 'In an even game, players choose colours by nigiri (nee-GEE-ree). The stronger or older player takes a handful of white stones and hides them. The other puts one black stone down to guess “odd”, or two to guess “even”.' },
      { kind: 'say', text: 'The white stones are counted out in pairs. Guess right and you play Black; guess wrong and you play White. In a handicap game there is no nigiri: the weaker player takes Black.' },
      {
        kind: 'askChoice',
        text: 'You put two black stones on the board, and the hidden handful turns out to be eleven stones. Which colour do you play?',
        options: [
          { text: 'White: two stones guessed even, and eleven is odd', correct: true, why: 'Right. The guess was wrong, so you take White and get komi.' },
          { text: 'Black: you guessed', why: 'Only a right guess gives you Black. Two stones mean “even”, and eleven is odd.' },
        ],
      },
    ],
  },
  {
    id: 'go.table.handicap',
    gameId: 'go',
    stage: 'table',
    title: 'Placing handicap stones',
    minutes: 3,
    start: pos('b', EMPTY9, 'hc=4 place=4'),
    steps: [
      { kind: 'say', text: 'In a handicap game Black puts stones down before White’s first move, one stone for each rank of difference. Traditionally they go on the star points in a set order, as seen from Black’s side of the board. White gets komi of only {komi:handicap}.' },
      { kind: 'askMove', text: 'Four handicap stones. The first goes on the star point to your upper right.', accept: ['G7'], wrong: { C3: 'That one comes second. The first is upper right.' }, claim: 'legal', success: 'Upper right first.' },
      { kind: 'askMove', text: 'The second goes in the opposite corner: lower left.', accept: ['C3'], claim: 'legal', success: 'Right: corners opposite each other.' },
      { kind: 'askMove', text: 'Third: lower right.', accept: ['G3'], claim: 'legal', success: 'Good.' },
      { kind: 'askMove', text: 'And the fourth fills the last corner, upper left.', accept: ['C7'], claim: 'legal', success: 'All four corners. With five stones the centre is added; then the sides.' },
      {
        kind: 'askChoice',
        text: 'Who makes the first move now?',
        options: [
          { text: 'White', correct: true, why: 'Yes. The handicap stones were Black’s moves.' },
          { text: 'Black', why: 'Black has already played: the handicap stones are its moves. White goes next.' },
        ],
      },
    ],
  },
  {
    id: 'go.table.area',
    gameId: 'go',
    stage: 'table',
    title: 'Counting by area',
    minutes: 3,
    start: pos('b', FINISHED, 'pass=2,w phase=scoring,b dead=ad'),
    steps: [
      { kind: 'say', text: 'At the end, take the dead stones off first: here the lone white stone deep in Black’s side is dead. Then, counting by area, each side counts its stones on the board plus the empty points only it surrounds. Prisoners do not matter.', marks: ['A4'] },
      { kind: 'askNumber', text: 'Count Black’s area: stones plus surrounded points.', answer: 'area:black', success: 'Yes, {area:black}: {stones:black} stones and {territory:black} points.' },
      { kind: 'askNumber', text: 'Now White’s area.', answer: 'area:white', success: 'Right, {area:white}. Add komi of {komi} and compare.' },
      { kind: 'say', text: 'At a club, players speed this up: fill the territory of one side with its own stones, arrange the stones in tens, and compare with half the board.' },
    ],
  },
  {
    id: 'go.table.territory',
    gameId: 'go',
    stage: 'table',
    title: 'Counting by territory',
    minutes: 3,
    start: pos('b', FINISHED, 'rules=japanese pass=2,w phase=scoring,b dead=ad cap=2,3'),
    steps: [
      { kind: 'say', text: 'Counting by territory, as in Japan and Korea: take the dead stones off and add them to the captor’s prisoners. Each side then fills the opponent’s territory with the prisoners it holds, which saves arithmetic.' },
      { kind: 'askNumber', text: 'How many prisoners does Black hold now, dead stone included?', answer: 'held:black', success: 'Right: {held:black}.' },
      { kind: 'askNumber', text: 'How many empty points of territory does Black surround?', answer: 'territory:black', success: 'Yes, {territory:black}.' },
      { kind: 'askNumber', text: 'So what is Black’s score: territory plus prisoners?', answer: 'score:black', success: 'Right: {score:black}. White counts the same way and adds komi of {komi}.' },
    ],
  },
  {
    id: 'go.table.clock',
    gameId: 'go',
    stage: 'table',
    title: 'Clocks and byo-yomi',
    minutes: 2,
    start: pos('b', EMPTY9),
    steps: [
      { kind: 'say', text: 'Go clocks usually give each player main time, then byo-yomi (byo-YO-mee): overtime periods. With “five periods of thirty seconds”, each move made within thirty seconds keeps all five periods; a slower move uses one up. Lose the last period and you lose the game.' },
      { kind: 'say', text: 'Canadian overtime is the other common kind: after main time, make a set number of moves in a set time, for example twenty moves in five minutes, then start the count again.' },
      {
        kind: 'askChoice',
        text: 'You are in byo-yomi with three periods of thirty seconds and take forty seconds over a move. What is left?',
        options: [
          { text: 'Two periods of thirty seconds', correct: true, why: 'Right: the slow move used up one period. The next move starts a fresh one.' },
          { text: 'Three periods, with twenty seconds lost', why: 'Unused time is never carried over, and a move over the period uses a whole period.' },
        ],
      },
    ],
  },
];
