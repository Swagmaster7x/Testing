/**
 * Go lessons, stage 2 (first strategy: capturing technique, eyes and the shape of the game) and
 * stage 3 started (life and death, the net). Every "best" claim is checked by a solver:
 * Capture-Go positions by the forced-capture search, shut-in groups by the life-and-death search,
 * and fights over weak chains by the capture search (src/games/go/learn/verify.ts).
 */
import type { Lesson } from '../../../teach/lesson';
import { pos } from './stage0-1';

const E7 = '.......';

export const STAGE_2: readonly Lesson[] = [
  {
    id: 'go.2.direction',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Atari from the right side',
    minutes: 3,
    start: pos('b', [E7, E7, '.OX....', '.X.....', E7, E7, E7], 'rules=capture'),
    steps: [
      { kind: 'say', text: 'There are two ways to say atari to this white stone. One drives it towards the edge, where it runs out of room. The other lets it run into the open. (Capture-Go: the first capture wins.)', marks: ['B5'] },
      { kind: 'askMove', text: 'Say atari from the side that drives the stone to the edge.', accept: ['B6'], wrong: { A5: 'Now White steps up and has three liberties: it has got away.' }, claim: 'best', success: 'Right. White can only run along the edge.' },
      { kind: 'show', text: 'Watch: each time White runs, Black takes another liberty, until the stones have none.', moves: ['A5', 'A4', 'A6', 'A7'] },
    ],
  },
  {
    id: 'go.2.double-atari',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Double atari',
    minutes: 2,
    start: pos('b', [E7, E7, E7, '.XO.OX.', '..X.X..', E7, E7], 'rules=capture'),
    steps: [
      { kind: 'say', text: 'A double atari puts two chains in atari with one stone. Your opponent can save only one of them.' },
      { kind: 'askMove', text: 'Find the double atari.', accept: ['D4'], claim: 'best', success: 'Both white stones are in atari, and only one can be saved.', reply: 'C5' },
      { kind: 'askMove', text: 'White saved one. Take the other.', accept: ['E5'], claim: 'best', success: 'Captured.' },
    ],
  },
  {
    id: 'go.2.ladder',
    gameId: 'go',
    stage: 'stage-2',
    title: 'The ladder',
    minutes: 3,
    start: pos('b', [E7, E7, E7, E7, '.XO....', '..XX...', E7], 'rules=capture'),
    steps: [
      { kind: 'say', text: 'A ladder (shicho, shee-CHO) chases a chain across the board with one atari after another. Each time it runs, it gains one liberty and loses one, until it reaches the edge.', marks: ['C3'] },
      { kind: 'askMove', text: 'Start the ladder. Say atari so that White can only run one way.', accept: ['C4'], wrong: { D3: 'Now White steps up next to your stones and has three liberties.' }, claim: 'best', success: 'That is the start of a ladder.' },
      { kind: 'show', text: 'Watch the staircase: White runs, Black says atari again, all the way to the edge.', moves: ['D3', 'E3', 'D4', 'D5', 'E4', 'F4', 'E5', 'E6', 'F5', 'G5', 'F6', 'F7', 'G6', 'G7'] },
    ],
  },
  {
    id: 'go.2.ladder-breaker',
    gameId: 'go',
    stage: 'stage-2',
    title: 'When a ladder fails',
    minutes: 2,
    start: pos('b', [E7, E7, '....O..', E7, '.XO....', '..XX...', E7], 'rules=capture'),
    steps: [
      { kind: 'say', text: 'A ladder works only if nothing stands in its way. Here a white stone sits on the diagonal the ladder would run along.', marks: ['E5'] },
      {
        kind: 'askChoice',
        text: 'Should Black start the ladder?',
        options: [
          { text: 'No: White runs into the white stone and gets away', correct: true, why: 'Right. That stone is a ladder breaker. A broken ladder leaves Black with weak stones everywhere.' },
          { text: 'Yes: ladders always work', why: 'Not with a white stone in the way. Read the ladder to the end before you start it.' },
        ],
      },
      { kind: 'say', text: 'Before starting a ladder, run your eye along its diagonal. Your own stone on the path makes it work sooner; theirs breaks it.' },
    ],
  },
  {
    id: 'go.2.capture-out',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Capture your way out',
    minutes: 2,
    start: pos('b', [E7, E7, '..OX...', '.OXOX..', E7, '...O...', E7]),
    steps: [
      { kind: 'say', text: 'Your stone in the middle is in atari. Running is one way to save it, but there is a better one: one of the stones around it is in atari too.', marks: ['C4', 'D4'] },
      { kind: 'askMove', text: 'Save your stone the best way.', accept: ['D3'], wrong: { C3: 'That saves the stone, but the white stone beside it gets away. Capturing does both.' }, claim: 'best', success: 'You capture a stone and your stone is free. When you are in atari, look first for a capture.' },
    ],
  },
  {
    id: 'go.2.two-eyes',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Two eyes live',
    minutes: 3,
    start: pos('b', [E7, E7, E7, E7, 'OOOOO..', 'XXXXO..', '...XO..']),
    steps: [
      { kind: 'say', text: 'A group shut in by the other colour lives only if it has two separate eyes: empty points inside it that the opponent can never fill. With one eye it can be captured in the end.' },
      { kind: 'askMove', text: 'Black’s group has a space of three points on the edge. Make two eyes.', accept: ['B1'], wrong: { A1: 'Now the space left is two points in a row: only one eye. White can kill it.' }, claim: 'best', success: 'Two separate eyes: the group can never be captured.' },
      {
        kind: 'checkpoint',
        text: '',
        questions: [
          { kind: 'askMove', position: pos('w', [E7, E7, E7, E7, 'OOOOO..', 'XXXXO..', '...XO..']), text: 'Now it is White to play. Where does White kill the group?', accept: ['B1'], claim: 'best', success: 'Yes: the same point. Black can no longer make two eyes.' },
          {
            kind: 'askChoice',
            text: 'Why can White never play inside a real eye?',
            options: [
              { text: 'The stone would have no liberties: suicide', correct: true, why: 'Right, unless it captures, which two eyes never allow.' },
              { text: 'Eyes belong to the owner by rule', why: 'No special rule: it is just suicide to play there.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'go.2.eyes',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Do not fill your own eyes',
    minutes: 2,
    start: pos('b', [E7, E7, E7, E7, 'OOOOO..', 'XXXXO..', '.X.XO..']),
    steps: [
      { kind: 'say', text: 'Black has two eyes here. Filling one of them is legal, but it would throw the group’s life away.', marks: ['A1', 'C1'] },
      {
        kind: 'askChoice',
        text: 'White plays elsewhere. Should Black fill an eye to be safe?',
        options: [
          { text: 'No: with one eye left, the group could be captured', correct: true, why: 'Right. Leave eyes empty, and spend your move elsewhere.' },
          { text: 'Yes: more stones are safer', why: 'Not inside your eyes. Each one you fill is a liberty you give away.' },
        ],
      },
      { kind: 'askMove', text: 'Nothing on this board needs a move. Pass.', accept: ['pass'], claim: 'legal', success: 'Passing is a move too, when nothing is left to gain.' },
    ],
  },
  {
    id: 'go.2.corners',
    gameId: 'go',
    stage: 'stage-2',
    title: 'Corners, then sides, then the centre',
    minutes: 2,
    start: pos('b', Array.from({ length: 9 }, () => '.........')),
    steps: [
      { kind: 'say', text: 'In a corner, two edges help you wall off space, so a few stones claim a lot. On a side, one edge helps. In the centre you must build every wall yourself.', marks: ['C3', 'G7', 'C7', 'G3'] },
      {
        kind: 'askChoice',
        text: 'Where do strong players usually put their first stones?',
        options: [
          { text: 'In the corners', correct: true, why: 'Yes: corners first, then the sides, then the centre.' },
          { text: 'In the centre, to be near everything', why: 'The centre is hardest to turn into territory: no edge helps there.' },
          { text: 'On the edge, the first line', why: 'Stones on the first line wall off almost nothing. The third and fourth lines are the usual places.' },
        ],
      },
      { kind: 'askMove', text: 'Play a first stone on a star point in a corner.', accept: ['C3', 'G3', 'C7', 'G7'], claim: 'legal', success: 'A fine start: a corner star point.' },
    ],
  },
];

export const STAGE_3: readonly Lesson[] = [
  {
    id: 'go.3.vital-point',
    gameId: 'go',
    stage: 'stage-3',
    title: 'The vital point',
    minutes: 3,
    start: pos('w', [E7, E7, E7, 'OO.....', 'XXO....', '.XXO...', '..XO...']),
    steps: [
      { kind: 'say', text: 'Black’s eye space here is three points bent round the corner. One point touches both of the others: the vital point. Whoever plays there first decides whether the group lives.' },
      { kind: 'askMove', text: 'White to play: kill the black group.', accept: ['A1'], wrong: { B1: 'Black captures that stone and makes two eyes.', A2: 'Black captures that stone and makes two eyes.' }, claim: 'best', success: 'Right: on the vital point. Black can no longer make two eyes.' },
      { kind: 'askMove', position: pos('b', [E7, E7, E7, 'OO.....', 'XXO....', '.XXO...', '..XO...']), text: 'Same shape, Black to play. Make the group live.', accept: ['A1'], claim: 'best', success: 'The same point again: “your opponent’s vital point is your own”.' },
    ],
  },
  {
    id: 'go.3.straight-three',
    gameId: 'go',
    stage: 'stage-3',
    title: 'Three in a row',
    minutes: 2,
    start: pos('w', [E7, E7, E7, E7, 'OOOOOO.', 'XXXXXO.', 'X...XO.']),
    steps: [
      { kind: 'say', text: 'Black’s group has three empty points in a row along the edge. The middle one touches both ends: it is the vital point.', marks: ['C1'] },
      { kind: 'askMove', text: 'White to play. Kill the group.', accept: ['C1'], wrong: { B1: 'Black captures that stone and has two eyes.', D1: 'Black captures that stone and has two eyes.' }, claim: 'best', success: 'Right. Whatever Black does now, only one eye is left.' },
      {
        kind: 'checkpoint',
        text: '',
        questions: [
          { kind: 'askMove', position: pos('b', [E7, E7, E7, E7, 'OOOOOO.', 'XXXXXO.', 'X...XO.']), text: 'Now Black is to play. Make the group live.', accept: ['C1'], claim: 'best', success: 'Two eyes, one on each side of the middle stone.' },
          {
            kind: 'askChoice',
            text: 'If the space were four points in a row, could White kill the group by playing first?',
            options: [
              { text: 'No: whichever middle point White takes, Black takes the other one', correct: true, why: 'Right. Four in a row has two vital points, and Black needs only one of them.' },
              { text: 'Yes: by taking the vital point', why: 'Four in a row has two middle points. White takes one, Black the other, and two eyes are left.' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'go.3.net',
    gameId: 'go',
    stage: 'stage-3',
    title: 'The net',
    minutes: 3,
    start: pos('b', [E7, '.....O.', '..X....', '..XO...', '...XX..', E7, E7]),
    steps: [
      { kind: 'say', text: 'The white stone in the middle has two liberties. A ladder would fail here: the white stone up on the right stands on its path.', marks: ['F6'] },
      {
        kind: 'askMove',
        text: 'Catch the stone without saying atari. Play a little way off, where you shut both ways out.',
        accept: ['E5'],
        wrong: { D5: 'Atari, but White runs up the diagonal to the stone on the right and gets away.', E4: 'Atari, but White runs up the diagonal to the stone on the right and gets away.' },
        claim: 'best',
        success: 'That is a net (geta, GEH-tah). White still has two liberties, but every way out leads into your stones.',
      },
      { kind: 'show', text: 'Watch: White pushes out, Black blocks, and the stones run out of liberties.', moves: ['E4', 'F4', 'D5', 'D6'] },
      {
        kind: 'checkpoint',
        text: '',
        questions: [
          { kind: 'askMove', position: pos('b', [E7, E7, '...XX..', '..XO...', '..X....', '.....O.', E7]), text: 'The same idea, turned over. Catch the white stone.', accept: ['E3'], claim: 'best', success: 'A net again: both ways out are shut.' },
          {
            kind: 'askChoice',
            text: 'When does a net beat a ladder?',
            options: [
              { text: 'When a ladder breaker stands on the ladder’s path', correct: true, why: 'Right. Read the ladder first; if it fails, look for the net.' },
              { text: 'Never: a net is just a slow ladder', why: 'A net needs no atari, so the stone has no path to run along. It works where a ladder fails.' },
            ],
          },
        ],
      },
    ],
  },
];
