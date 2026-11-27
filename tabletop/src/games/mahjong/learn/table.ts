/**
 * Table-ready (PLAN.md 1.1, point 3): what the app does for you that a real table does not.
 * Washing and building the wall, breaking it and dealing, calling out loud, settling up, the
 * "ask before you sit" card, and manners. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { BASIC, HK, lessonPosition, nameOf } from './game';

const N = nameOf;

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.table.${id}`, gameId: 'mahjong', stage: 'table', title, minutes, start, steps };
}

/** The table at the start of a hand. */
const START = lessonPosition({ hand: '123m 456p 78s 99s EE W N', drawn: 'N', options: HK, turns: 0, seed: 'table-start' });

/** A win on offer to settle: a Green dragon pung, dots and East winds; the player across throws. */
const SETTLE = lessonPosition({
  hand: '234p 567p 89p EE',
  melds: [[{ type: 'pung', tiles: 'GdGdGd', from: 1 }]],
  options: HK,
  offer: { seat: 2, tile: '7p' },
  avoid: '7p E',
  bonus: ['F1'],
  seed: 'table-settle',
});

/** Your turn early in a hand, for the questions on calls and manners. */
const PLAY = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 4s W N', drawn: 'N', options: BASIC, seed: 'table-play' });

export const TABLE_LESSONS: readonly Lesson[] = [
  lesson('wall', 'Washing and building the wall', 3, START, [
    { kind: 'say', text: 'Before each hand, turn every tile face down and mix them on the table with flat hands: the wash. Everyone joins in, and nobody watches a tile go by.' },
    { kind: 'say', text: 'Each player then builds a wall in front of them, two tiles high and {wall:stacks} stacks long with flowers in the set ({wall:stacks:plain} without). The four walls are pushed together into a square, the wall you see in the middle of the table.' },
    { kind: 'askNumber', text: 'With flowers and seasons in the set, how many stacks long is each wall?', answer: 'wall:stacks', success: 'Yes: {set:tiles} tiles, {seats} walls, two high, so {wall:stacks} stacks each.' },
  ]),
  lesson('deal', 'Breaking the wall and dealing', 3, START, [
    { kind: 'say', text: 'The dealer (East) throws the dice and counts round the table from themselves, counter-clockwise, to choose a wall; the same total then counts stacks along that wall from its right-hand end. The wall is broken there, and the deal is taken clockwise from the break.' },
    { kind: 'say', text: 'Starting with the dealer, each player takes four tiles at a time, three times round, then one more each, and the dealer one extra: {deal:dealer} to the dealer and {hand:size} to everyone else. Then each player in turn sets aside any flowers and draws replacements from the far end of the wall.' },
    {
      kind: 'askChoice',
      text: 'Who starts the hand with {deal:dealer} tiles?',
      options: [
        { text: 'The dealer, East', correct: true, why: 'Right: the dealer throws first, without drawing.' },
        { text: 'The player who throws the dice last', why: 'Only the dealer throws the dice, and the dealer takes the extra tile.' },
        { text: 'Everybody', why: 'Everyone else holds {hand:size}; the dealer’s extra tile is the first throw of the hand.' },
      ],
    },
  ]),
  lesson('calls', 'Calls, out loud', 3, PLAY, [
    { kind: 'say', text: 'Say every call as you make it, clearly: “seung” or “chow” for a run, “pung”, “gong” or “kong”, and “sik wu” (食糊), or just “wu”, to win; “zi mo” (自摸) when you win with your own draw. Then lay the set face up, with the tile you took turned to show who threw it.' },
    { kind: 'say', text: 'A call must come before the next player draws. Once they have taken a tile from the wall the throw is dead. Until then, a pung or a win called in time still beats a chow called a moment earlier.' },
    {
      kind: 'askChoice',
      text: 'The player on your right has already drawn from the wall when you see you could have punged the last throw. Can you still call it?',
      options: [
        { text: 'No: the chance ends when the next player draws', correct: true, why: 'Right. Watch every throw, and call at once.' },
        { text: 'Yes, as long as nobody else has thrown', why: 'Once the next player has drawn, the throw is gone.' },
        { text: 'Yes, but only for a win', why: 'Not at most tables: a missed win is missed too.' },
      ],
    },
    { kind: 'askMove', text: `Practise naming your throw: throw the ${N('N')} and say “North” as it lands.`, accept: ['N'], claim: 'legal', success: 'Naming each throw out loud helps everyone keep track, and is good manners.' },
  ]),
  lesson('settle', 'Settling up', 4, SETTLE, [
    { kind: 'say', text: 'Home games keep score with chips or counting sticks, or on paper. When someone wins, they lay the whole hand face up and name each pattern and the faan; the others check it before anyone pays.' },
    { kind: 'askNumber', text: `The player across threw the ${N('7p')}, and it finishes your hand: dots, a pair of East winds and a called pung of Green dragons. You sit East and hold the plum. How many faan?`, answer: 'win:faan', success: 'Yes, {win:faan}: mixed one suit, the Green dragon pung and your seat flower.' },
    { kind: 'askNumber', text: 'The base for {win:faan} faan is {win:base}. On a throw the thrower pays double and the others single: how much do you collect in all?', answer: 'win:total', success: 'Yes: {win:discarder} from the thrower and {win:other} from each of the others, {win:total} in all.' },
    { kind: 'askMove', text: 'Win, and compare the sheet with your count.', accept: ['win'], claim: 'legal', success: 'In a game, turn off “Score hands for me” in the coach and you count every win yourself first.' },
  ]),
  lesson('ask', 'Ask before you sit', 3, START, [
    { kind: 'say', text: 'Mahjong tables differ more than any other game here. Before the first tile, ask: which style? How many faan to win, and what is the limit? Does the thrower pay for everyone, or double while the others pay single? Are there flowers?' },
    { kind: 'say', text: 'Then the finer points: may two players win on one throw, can a kong be robbed, does the dealer keep the deal after a drawn hand, how many rounds, and does anyone pay for the whole table when they feed the last set of a big hand? The Reference page holds the full card.' },
    {
      kind: 'askChoice',
      text: 'You join a new table and they say: “Hong Kong, the usual.” What should you still ask before the first hand?',
      options: [
        { text: 'The minimum, the limit and who pays on a throw', correct: true, why: 'Right: “the usual” differs from table to table, and those three change every score.' },
        { text: 'Nothing: Hong Kong rules are the same everywhere', why: 'They are not. Even the minimum varies: none, one or three faan.' },
        { text: 'Only whether there are flowers', why: 'Flowers matter, but the minimum and the payments matter more.' },
      ],
    },
  ]),
  lesson('manners', 'Manners at the table', 2, PLAY, [
    { kind: 'say', text: 'Throw each tile face up into the middle and name it. Do not take a throw back once it has left your hand, and do not rearrange or touch other players’ tiles or the wall out of turn.' },
    { kind: 'say', text: 'Keep your discards in tidy rows in front of you so everyone can read them, wait until the throw before yours is settled before you draw, and never comment on what another player should have done.' },
    {
      kind: 'askChoice',
      text: 'You throw a tile, then see it was the wrong one. What do you do?',
      options: [
        { text: 'Let it stand: a thrown tile stays thrown', correct: true, why: 'Right. Everyone may already be acting on it.' },
        { text: 'Take it back quickly before anyone calls', why: 'Not at a real table: once it has left your hand, it is played.' },
        { text: 'Ask the table to vote', why: 'There is nothing to vote on: a thrown tile stays thrown.' },
      ],
    },
  ]),
];
