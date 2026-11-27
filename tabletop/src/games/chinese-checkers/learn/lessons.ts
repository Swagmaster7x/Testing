/**
 * Chinese Checkers lessons: stage 0 (what the game is), stage 1 (the rules), stage 2 (first
 * strategy) and the Table-ready track. All prose is original. Numbers are {placeholders} computed
 * from the rules module; holes are named by row (from the bottom) and letter (from the left).
 * You play Red, at the bottom, in every lesson.
 */
import type { Lesson } from '../../../teach/lesson';
import { BOTTOM, pos, TOP } from './positions';

const START = pos({}, 'R');
const START_THREE = pos({}, 'R', '', 3);
const START_SIX = pos({}, 'R', '', 6);

export const STAGE_0: readonly Lesson[] = [
  {
    id: 'chinese-checkers.0.game',
    gameId: 'chinese-checkers',
    stage: 'stage-0',
    title: 'Chinese Checkers in a minute',
    minutes: 2,
    start: START,
    steps: [
      { kind: 'say', text: 'Chinese Checkers is a race across a star. Each player starts with {marbles} marbles in one point of the star and tries to move them all into the point straight across: their home.' },
      { kind: 'say', text: 'You play Red, at the bottom. Your home is the top point, where Blue starts. Blue races the other way, into the point you start in, so you will pass each other in the middle.', marks: ['17a', '1a'] },
      {
        kind: 'askChoice',
        text: 'Who wins?',
        options: [
          { text: 'The first player to fill their home', correct: true, why: 'Yes. It is a race: the first one home wins, and the others can play on for second place.' },
          { text: 'The player who takes the most marbles', why: 'Nothing is ever taken in Chinese Checkers. Marbles only move.' },
          { text: 'The first player to reach the middle', why: 'The middle is only halfway. You win by filling the point straight across.' },
        ],
      },
      {
        kind: 'askMove',
        text: 'Make a first move: step one of your front marbles into an empty hole just above it.',
        accept: ['4a-5e', '4a-5f', '4b-5f', '4b-5g', '4c-5g', '4c-5h', '4d-5h', '4d-5i'],
        claim: 'legal',
        success: 'That is a move: one marble, one turn. Then it is Blue’s turn.',
      },
      { kind: 'say', text: 'The name is a marketing invention: the game is the German Sternhalma, star halma, and it has nothing to do with China or with draughts.' },
    ],
  },
  {
    id: 'chinese-checkers.0.race',
    gameId: 'chinese-checkers',
    stage: 'stage-0',
    title: 'Your first race',
    minutes: 3,
    start: pos({ R: [...TOP.slice(0, 8), '12h', '11g'], B: [...BOTTOM.slice(0, 7), '8c', '9b', '9c'] }, 'R'),
    steps: [
      { kind: 'say', text: 'Here the race is nearly over. Your home at the top has two empty holes, and you have two marbles left to bring in. Blue has further to go, but Blue will hurry.', marks: ['14c', '14d'] },
      {
        kind: 'freePlay',
        position: pos({ R: [...TOP.slice(0, 8), '12h', '11g'], B: [...BOTTOM.slice(0, 7), '8c', '9b', '9c'] }, 'R'),
        text: 'Bring both marbles home before Blue gets all of its marbles home. Tap a marble, then a lit hole.',
        goal: 'win',
        maxMoves: 6,
        success: 'Home first! That is a win in Chinese Checkers.',
      },
    ],
  },
];

export const STAGE_1: readonly Lesson[] = [
  {
    id: 'chinese-checkers.1.board',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'The star and its points',
    minutes: 2,
    start: START,
    steps: [
      { kind: 'say', text: 'The board is a star of {holes} holes: a hexagon of {middle} holes in the middle, and {points} points of {point} holes each.' },
      { kind: 'askNumber', text: 'How many marbles does each player start with?', answer: 'marbles', success: 'Yes, {marbles}: one for every hole of a point.' },
      { kind: 'say', text: 'Your start is the point you begin in. Your home is the point straight across from it. With two players, each home is the other player’s start.' },
      {
        kind: 'askChoice',
        text: 'Where is Red’s home?',
        options: [
          { text: 'The top point, where Blue starts', correct: true, why: 'Right. Red races from the bottom point to the top one.' },
          { text: 'The point on the lower left', why: 'Home is always straight across from where you start.' },
          { text: 'The hexagon in the middle', why: 'The middle is the road. Home is the point straight across.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.1.step',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Steps',
    minutes: 2,
    start: pos({ R: ['9e'] }, 'R'),
    steps: [
      { kind: 'say', text: 'A step moves one marble into a neighbouring empty hole. In the hexagon every hole has {directions} neighbours: two on each side, two above and two below.', marks: ['9e'] },
      { kind: 'askNumber', text: 'How many holes can the marked marble step to?', answer: 'reach:9e', marks: ['9e'], success: 'Yes, {reach:9e}. Nothing stands next to it, so it can step in any direction.' },
      {
        kind: 'askMove',
        text: 'Step the marked marble one hole up, towards your home.',
        marks: ['9e'],
        accept: ['9e-10e', '9e-10f'],
        wrong: { '9e-8e': 'That is a step down, away from home. Steps may go any way, but up is the way home.', '9e-8f': 'That is a step down, away from home. Steps may go any way, but up is the way home.' },
        claim: 'legal',
        success: 'A step: one hole, one marble, and your turn is over.',
      },
    ],
  },
  {
    id: 'chinese-checkers.1.hop',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Hops',
    minutes: 2,
    start: pos({ R: ['7e'], B: ['7f'] }, 'R'),
    steps: [
      { kind: 'say', text: 'A hop jumps over one marble right next to yours, into the empty hole straight beyond it. You may hop over your own marbles or anyone else’s.', marks: ['7e', '7f'] },
      { kind: 'askMove', text: 'Hop the marked red marble over the blue one.', marks: ['7e'], accept: ['7e-7g'], claim: 'legal', success: 'A hop. Two holes in one move.' },
      {
        kind: 'askChoice',
        text: 'What happened to the blue marble?',
        options: [
          { text: 'It stays where it is', correct: true, why: 'Right. Nothing is ever taken: a marble you jump over stays in play.' },
          { text: 'It is taken off the board', why: 'That is draughts. In Chinese Checkers nothing is taken.' },
          { text: 'It goes back to its start', why: 'No. It stays exactly where it was.' },
        ],
      },
      { kind: 'say', text: 'You cannot hop over an empty hole, over two marbles in a row, or onto a marble. And a step and a hop never mix in one move.' },
    ],
  },
  {
    id: 'chinese-checkers.1.chain',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Chains of hops',
    minutes: 3,
    start: pos({ R: ['7e'], B: ['8e', '10e', '11f'] }, 'R'),
    steps: [
      { kind: 'say', text: 'After a hop, the same marble may hop again from where it landed, in any direction, as often as it can. The whole chain is still one move, and you may stop after any hop.', marks: ['7e'] },
      {
        kind: 'askMove',
        text: 'Take the marked marble as far up the board as it can go in one move. Tap it to see every hole it can reach; a number shows how many hops it takes.',
        marks: ['7e'],
        accept: ['7e-11g', '7e-11e'],
        wrong: { '7e-9e': 'That is one hop. From there it could have hopped on.' },
        claim: 'best',
        success: 'A chain of hops. Long chains are how you win races.',
      },
      {
        kind: 'askChoice',
        text: 'Must you keep hopping while you can?',
        options: [
          { text: 'No, you may stop after any hop', correct: true, why: 'Right. Sometimes stopping early sets up a better hop next turn.' },
          { text: 'Yes, every hop you can make', why: 'Hopping is never compulsory, and you may stop after any hop of a chain.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.1.turns',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Turns and passing',
    minutes: 2,
    start: START_THREE,
    steps: [
      { kind: 'say', text: 'Players take turns going clockwise round the star. On your turn you must move one marble: one step, or one chain of hops.' },
      {
        kind: 'askChoice',
        text: 'When may you pass?',
        options: [
          { text: 'Only when none of your marbles can move', correct: true, why: 'Right. That almost never happens, but when it does you pass and play goes on.' },
          { text: 'Whenever you like', why: 'No: you must move if any marble of yours can move, even if every move is a bad one.' },
          { text: 'Once a game', why: 'There is no free pass. You pass only when nothing can move.' },
        ],
      },
      {
        kind: 'askChoice',
        text: 'May one move step a marble and then hop with it?',
        options: [
          { text: 'No, a move is a step or hops, never both', correct: true, why: 'Right.' },
          { text: 'Yes, if the hop comes after the step', why: 'A move is either one step or a chain of hops, never a mix.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.1.home',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Coming home',
    minutes: 2,
    start: pos({ R: [...TOP.slice(0, 9), '13h'], B: [...BOTTOM.slice(0, 9), '6c'] }, 'R'),
    steps: [
      { kind: 'say', text: 'Once a marble is in your home it may move about inside it, but it may not leave again. That is the usual rule; ask at a new table.', marks: ['14d'] },
      { kind: 'askMove', text: 'One hole of your home is still empty. Finish the game.', accept: ['13h-14d'], claim: 'best', success: 'Your home is full: you are home, and you win.' },
    ],
  },
  {
    id: 'chinese-checkers.1.blocked',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'A marble left in your home',
    minutes: 3,
    start: pos({ R: [...TOP.slice(0, 8), '13h', '11b'], B: ['14c', ...BOTTOM.slice(0, 9)] }, 'R'),
    steps: [
      { kind: 'say', text: 'Blue has left one marble behind in its start, which is your home. You could never fill your home with your own marbles while it sits there.', marks: ['14c'] },
      { kind: 'say', text: 'So the rule is: your home is complete when every hole is full and at least one marble in it is yours. A marble someone parks there counts as filling it.' },
      { kind: 'askMove', text: 'Fill the last empty hole of your home.', accept: ['13h-14d'], claim: 'best', success: 'Complete: every hole is full, and the marbles are yours but one. You are home.' },
      {
        kind: 'askChoice',
        position: pos({ R: [...TOP.slice(0, 8), '13h', '11b'], B: ['14c', ...BOTTOM.slice(0, 9)] }, 'R'),
        text: 'Your marble far down on the left never got home. Does that matter?',
        options: [
          { text: 'No. A full home is all that counts', correct: true, why: 'Right. Under this rule a player can finish with a marble still out, because someone else’s marble filled a hole.' },
          { text: 'Yes, every marble has to be home', why: 'Only under the strict rule, "all your own". Most tables use the rule you just played.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.1.end',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'The end of the race',
    minutes: 2,
    start: START_THREE,
    steps: [
      { kind: 'say', text: 'When one player is home, the others usually play on for second place and so on, until only one is left. Some tables stop at the first player home.' },
      {
        kind: 'askChoice',
        text: 'In a game of three, Red gets home first. What happens next?',
        options: [
          { text: 'Blue and Green play on for second place', correct: true, why: 'Right. Red takes no more turns; its marbles stay on the board to hop over.' },
          { text: 'The game ends and everyone else shares second', why: 'Only if your table plays "first home wins". Then the rest are placed by how far they still have to go.' },
          { text: 'Red keeps playing to help', why: 'A player who is home takes no more turns.' },
        ],
      },
      { kind: 'say', text: 'This app also ends a game after {limit:default} turns each, so a game cannot go on for ever. Then the player with the fewest rows still to climb places highest.' },
    ],
  },
  {
    id: 'chinese-checkers.1.players',
    gameId: 'chinese-checkers',
    stage: 'stage-1',
    title: 'Two, three, four or six',
    minutes: 2,
    start: START_THREE,
    steps: [
      { kind: 'say', text: 'With three players, every other point is used. Every home starts empty, so nobody begins in anyone’s way.' },
      { kind: 'askNumber', text: 'How many marbles are on the board for three players?', answer: 'marbles:all', success: 'Yes, {marbles:all}.' },
      { kind: 'say', position: START_SIX, text: 'With four players two pairs of points face each other, and with six every point is used. Each player still races to the point straight across.' },
      {
        kind: 'askChoice',
        text: 'Why is a game for five unusual?',
        options: [
          { text: 'One player would have an empty home and nobody coming the other way', correct: true, why: 'Right. It can be played, but it is not fair, so it is rarely played.' },
          { text: 'There are not enough marbles', why: 'A full set has marbles for six. The trouble is fairness: one home would start empty.' },
        ],
      },
    ],
  },
];

export const STAGE_2: readonly Lesson[] = [
  {
    id: 'chinese-checkers.2.ladder',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Build a ladder',
    minutes: 3,
    start: pos({ R: ['5e', '6e', '8e', '10e', '12h'], B: ['6b', '7b', '8b', ...TOP.slice(0, 7)] }, 'R'),
    steps: [
      { kind: 'say', text: 'A ladder is a line of marbles with a gap after each one. A marble at the foot of a ladder can hop all the way up it in one move.', marks: ['6e', '8e', '12h'] },
      { kind: 'say', text: 'This ladder has a rung missing just above the middle, so a chain from the bottom has to turn off it early.', marks: ['10f'] },
      { kind: 'askMove', text: 'Step the marked marble one hole to the right to put the missing rung in place.', marks: ['10e'], accept: ['10e-10f'], claim: 'legal', reply: '8b-9b', success: 'The ladder is whole. Blue moves, and now it is your turn again.' },
      {
        kind: 'askMove',
        text: 'Now take the marble at the foot of the ladder as far as it will go.',
        marks: ['5e'],
        accept: ['5e-13i'],
        claim: 'best',
        success: 'Four hops: {gain:best} rows in one move. Building a ladder costs one move and saves many.',
      },
    ],
  },
  {
    id: 'chinese-checkers.2.their',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Hop over their marbles too',
    minutes: 2,
    start: pos({ R: ['6f'], B: ['7f', '9f', '11h'] }, 'R'),
    steps: [
      { kind: 'say', text: 'Any marble can be a rung of your ladder, Blue’s as well as yours. The marbles coming the other way are stepping stones for you, and yours for them.' },
      { kind: 'askMove', text: 'Find the move that takes a marble furthest up the board.', accept: ['6f-12i'], claim: 'best', success: 'Three hops over three blue marbles: {gain:best} rows in one move.' },
    ],
  },
  {
    id: 'chinese-checkers.2.stragglers',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Leave no marble behind',
    minutes: 2,
    start: pos({ R: ['13f', '13g', '12e', '12f', '11e', '11f', '11g', '10d', '10e', '3b'], B: ['1a', '2a', '2b', '3a', '3c', '4b', '4d', '5g', '6f', '7e'] }, 'R'),
    steps: [
      { kind: 'say', text: 'A marble left far behind has nothing to hop over. It has to walk home one step at a time, and that costs more turns than anything else in the game.', marks: ['3b'] },
      {
        kind: 'askChoice',
        text: 'Which marble most needs your attention now?',
        options: [
          { text: 'The one at the bottom, still in your start', correct: true, why: 'Right. Bring it up while there are still marbles near it to hop over.' },
          { text: 'One of the front marbles, to get it home sooner', why: 'The front marbles are fine. The one at the back will cost you the race if it is left alone.' },
        ],
      },
      { kind: 'askMove', text: 'Move the marble at the back up the board.', marks: ['3b'], accept: ['3b-7f', '3b-7d', '3b-5f', '3b-4c'], claim: 'legal', success: 'Good. Keep your marbles together and they keep making hops for each other.' },
    ],
  },
  {
    id: 'chinese-checkers.2.race',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Count the race',
    minutes: 3,
    start: pos({ R: ['15a', '15b', '14a', '14b', '14c', '13f', '12e', '11g', '9d', '6f'], B: ['3a', '3b', '4a', '4b', '4c', '5e', '6h', '7c', '8f', '10e'] }, 'R'),
    steps: [
      { kind: 'say', text: 'Good players keep a count of the race. Number the rows from your start’s tip, row {row:first}, to your home’s tip, row {row:tip}. Each marble still has to climb {row:tip} minus its row.' },
      { kind: 'say', text: 'Add that up for every marble and take off {row:base}, which is what a full home still counts. The result is your rows to go: {rows:start} at the start, nothing when you are home.' },
      { kind: 'askNumber', text: 'How many rows does Red still have to go?', answer: 'rows:R', success: 'Yes, {rows:R}.' },
      { kind: 'askNumber', text: 'Blue counts from its own start at the top. How many rows does Blue have to go?', answer: 'rows:B', success: 'Yes, {rows:B}.' },
      {
        kind: 'askChoice',
        text: 'It is your move. Who is ahead in the race?',
        options: [
          { text: 'Blue, with fewer rows to go', correct: true, why: 'Right: {rows:B} against your {rows:R}. You move first, which is worth a little, but you need a long chain to catch up.' },
          { text: 'Red, because it is Red’s move', why: 'Moving first helps a little, but Blue has fewer rows to go: {rows:B} against {rows:R}.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.2.middle',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Use the middle',
    minutes: 2,
    start: pos({ R: ['5a', '6a', '7a', '9e', '10e', '8f', '7f'] }, 'R'),
    steps: [
      { kind: 'say', text: 'The quickest road is up the middle. There are more marbles there to hop over, and a marble in the middle has every direction open.', marks: ['9e', '10e', '8f'] },
      { kind: 'say', text: 'Marbles that wander into a side point are out of the race: they have to climb back, and nobody passes by to give them a hop.', marks: ['5a', '6a', '7a'] },
      {
        kind: 'askChoice',
        text: 'Why do strong players keep to the middle?',
        options: [
          { text: 'More marbles to hop over, and a short road home', correct: true, why: 'Right.' },
          { text: 'To block the other players', why: 'Blocking rarely pays: a marble in the way is also a rung for the other side.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.2.finish',
    gameId: 'chinese-checkers',
    stage: 'stage-2',
    title: 'Win the race at the end',
    minutes: 3,
    start: pos({ R: [...TOP.slice(0, 7), '13g', '12h', '11e'], B: [...BOTTOM.slice(0, 7), '7c', '7g', '8d'] }, 'R'),
    steps: [
      { kind: 'say', text: 'At the end every move should fill a hole of your home, or get a marble ready to fill one next turn. Fill the deep holes first and keep the entrance free.', marks: ['14b', '14c', '14d'] },
      {
        kind: 'freePlay',
        position: pos({ R: [...TOP.slice(0, 7), '13g', '12h', '11e'], B: [...BOTTOM.slice(0, 7), '7c', '7g', '8d'] }, 'R'),
        text: 'Get home before Blue does. Blue plays well.',
        goal: 'win',
        maxMoves: 8,
        success: 'Home first. You won the race.',
      },
    ],
  },
];

export const TABLE_READY: readonly Lesson[] = [
  {
    id: 'chinese-checkers.table.setup',
    gameId: 'chinese-checkers',
    stage: 'table',
    title: 'Setting up the board',
    minutes: 2,
    start: START,
    steps: [
      { kind: 'say', text: 'Each player fills one point with marbles of one colour. With two players use opposite points; with three, every other point; with four, two pairs of opposite points; with six, every point.' },
      { kind: 'askNumber', text: 'How many marbles do you need for four players?', answer: 'marbles:four', success: 'Yes, {marbles:four}.' },
      {
        kind: 'askChoice',
        position: START_THREE,
        text: 'Three players: why every other point?',
        options: [
          { text: 'So every home starts empty and the game is fair', correct: true, why: 'Right. Each player races into an empty point.' },
          { text: 'So the players can sit together', why: 'It is about fairness: with every other point, every home starts empty.' },
        ],
      },
      { kind: 'say', text: 'Decide who goes first (often by lot), then play passes clockwise. Some two-player sets use {fifteen} marbles each, filling the point and the row in front of it.' },
    ],
  },
  {
    id: 'chinese-checkers.table.ask',
    gameId: 'chinese-checkers',
    stage: 'table',
    title: 'Ask before you sit',
    minutes: 2,
    start: START,
    steps: [
      { kind: 'say', text: 'Tables disagree on a few rules. Settle them before the first move: whether a marble may stop in a point that is nobody’s home, whether a marble may leave its home again, and whether long jumps are allowed.' },
      { kind: 'say', text: 'Ask too how a home counts as complete when someone has left a marble in it, and whether the rest play on when the first player is home.' },
      {
        kind: 'askChoice',
        text: 'A player keeps one marble in their start all game, sitting in your home. What should you have asked?',
        options: [
          { text: 'Whether a full home counts with their marble in it', correct: true, why: 'Right. Under the usual rule it does, and parking there is pointless.' },
          { text: 'Whether you may take their marble', why: 'Nothing is ever taken. The question is how your home counts as complete.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.table.manners',
    gameId: 'chinese-checkers',
    stage: 'table',
    title: 'Table manners',
    minutes: 2,
    start: START,
    steps: [
      { kind: 'say', text: 'Move one marble at a time and take your hand away when your move is done. On a long chain, touch each hole you land on, so everyone can follow it.' },
      { kind: 'say', text: 'Do not hold up the game working out every chain on the board; with six players, a quick turn keeps everyone in the game. Say so when you are home.' },
      {
        kind: 'askChoice',
        text: 'Your chain is long and the others look lost. What do you do?',
        options: [
          { text: 'Tap each landing hole as you go', correct: true, why: 'Right. Then nobody has to ask how you got there.' },
          { text: 'Drop the marble in its last hole quickly', why: 'Show the landings. A chain nobody saw starts arguments.' },
        ],
      },
    ],
  },
  {
    id: 'chinese-checkers.table.count',
    gameId: 'chinese-checkers',
    stage: 'table',
    title: 'Counting rows by hand',
    minutes: 3,
    start: pos({ R: ['16a', '15b', '14a', '14c', '13e', '13h', '12f', '11d', '9e', '7f'], B: ['2a', '3c', '4b', '5d', '5h', '6f', '7c', '8g', '10e', '12b'] }, 'R'),
    steps: [
      { kind: 'say', text: 'At a real table nobody counts for you. Count rows to go a row at a time: for each row, the number of your marbles in it, times the rows still above it.' },
      { kind: 'askNumber', text: 'How many rows does Red have to go?', answer: 'rows:R', success: 'Right, {rows:R}.' },
      { kind: 'askNumber', text: 'And Blue, counting from the top?', answer: 'rows:B', success: 'Right, {rows:B}.' },
    ],
  },
];
