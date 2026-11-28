/**
 * The Chinese Official track (stage 4, milestone 14b): what is different at a competition table:
 * eight points to win and flowers that never count toward them, the patterns that most often reach
 * eight, the principles that stop patterns adding up twice, the knitted shapes, and settling up.
 * Every value comes from the Chinese Official rules file (game.ts): the pattern table `CO_FAN`,
 * the scorer for each hand, the settlement for each payment. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { CO, lessonPosition, nameOf } from './game';
import { patternName } from '../ui/names';

const N = nameOf;
const P = (id: string) => patternName(`co-${id}`);

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.4.${id}`, gameId: 'mahjong', stage: 'stage-4', title, minutes, start, steps };
}

const co = { style: 'chinese-official', options: CO, dealer: 3 } as const;

/** Three called pungs and a pair of East: a self-drawn all-pungs hand with one flower, seven points without it. */
const SHORT = lessonPosition({
  ...co,
  hand: '88m EE 8m',
  drawn: '8m',
  melds: [[{ type: 'pung', tiles: '222m', from: 1 }, { type: 'pung', tiles: '444p', from: 2 }, { type: 'pung', tiles: '666s', from: 3 }]],
  bonus: ['S2'],
  seed: 'co-min',
});

/** The same run in all three suits, a fourth run and a pair, all your own: drawn the 6 characters. */
const TRIPLE = lessonPosition({ ...co, hand: '123m 123p 123s 456m 99s', drawn: '6m', bonus: [''], seed: 'co-patterns' });
/** Half flush in dots with East winds. */
const HALF = lessonPosition({ ...co, hand: '234p 456p 789p EEE 11p', drawn: '1p', bonus: [''], seed: 'co-half' });
/** All pungs, three of them in the hand. */
const PUNGS = lessonPosition({ ...co, hand: '777s EE 99s 9s', drawn: '9s', melds: [[{ type: 'pung', tiles: '222m', from: 1 }, { type: 'pung', tiles: '555p', from: 2 }]], bonus: [''], seed: 'co-pungs' });

/** Bamboo only: a pure straight, another run and a pair. */
const FLUSH = lessonPosition({ ...co, hand: '123s 456s 789s 345s 22s', drawn: '9s', bonus: [''], seed: 'co-principles' });

/** The knitted straight with a run and a pair of 7 bamboo. */
const KNIT = lessonPosition({ ...co, hand: '147m 258p 369s 345m 77s', drawn: '7s', bonus: [''], seed: 'co-knitted' });

/** Ready on the 9 dots for a mixed straight; the player across throws it. One flower. */
const SETTLE = lessonPosition({ ...co, hand: '123m 456p 789s 345m 9p', offer: { seat: 2, tile: '9p' }, bonus: ['F2'], avoid: '9p', seed: 'co-settle' });

export const CO_LESSONS: readonly Lesson[] = [
  lesson('co-changes', 'Chinese Official: what changes', 4, SHORT, [
    { kind: 'say', text: 'Chinese Official is the competition style, written down by China’s sports authority and played in tournaments, above all in Europe. The tiles are the Hong Kong set with flowers, {co:tiles} in all, and you call chow, pung and kong as before.' },
    { kind: 'say', text: 'The deal passes after every hand, whoever wins: {co:round} hands make a round, and a full game is {co:hands} hands. Only one player wins a hand: the first in turn after the discarder.' },
    { kind: 'say', text: `The big change: a hand needs {co:min} points to win, from a table of {co:patterns} patterns. Flowers are worth {pts:flowers} each, but they never count toward the {co:min}. A hand that scores nothing at all is a ${P('chicken-hand').toLowerCase()}, worth {pts:chicken-hand} by itself.` },
    {
      kind: 'askChoice',
      text: `You drew the ${N('8m')}: three called pungs, a pung in your hand and a pair of East. That is ${P('all-pungs').toLowerCase()} ({pts:all-pungs}) and ${P('self-drawn').toLowerCase()} ({pts:self-drawn}), with your flower {win:faan}. May you win?`,
      options: [
        { text: 'Yes: with the flower it reaches the minimum', why: 'Flowers never count toward the {co:min}: without it the hand is {win:flowerless}.' },
        { text: 'No: without the flower it is only {win:flowerless}', correct: true, why: 'Right: flowers add to what is paid, never to the minimum. The hand is {win:short} short.' },
        { text: 'Yes: any complete hand may win', why: 'Not at this table: a hand needs {co:min} points, flowers aside.' },
      ],
    },
    { kind: 'askMove', text: `The table does not offer you the win. Throw the ${N('E')} and keep building.`, accept: ['E'], claim: 'legal', success: 'Thrown. Next time, look for a pattern that reaches the minimum on its own.' },
  ]),
  lesson('co-patterns', 'Patterns that reach eight', 4, TRIPLE, [
    { kind: 'say', text: `Most winning hands reach the minimum with one bigger pattern. Runs: ${P('mixed-triple-chow').toLowerCase()} (the same run in all three suits, {pts:mixed-triple-chow}), ${P('mixed-straight').toLowerCase()} (a low, a middle and a high run, one in each suit, such as the 1-2-3 characters, 4-5-6 dots and 7-8-9 bamboo, {pts:mixed-straight}), ${P('pure-straight').toLowerCase()} (all three in one suit, {pts:pure-straight}).` },
    { kind: 'say', text: `Others: ${P('half-flush').toLowerCase()} ({pts:half-flush}), ${P('all-pungs').toLowerCase()} ({pts:all-pungs}), ${P('seven-pairs').toLowerCase()} ({pts:seven-pairs}), ${P('full-flush').toLowerCase()} ({pts:full-flush}). The small ones then top a hand up: ${P('concealed-hand').toLowerCase()} {pts:concealed-hand}, ${P('fully-concealed').toLowerCase()} {pts:fully-concealed}, ${P('all-chows').toLowerCase()} {pts:all-chows}, a dragon pung {pts:dragon-pung}, ${P('no-honours').toLowerCase()} {pts:no-honours}.` },
    {
      kind: 'checkpoint',
      text: 'Name the pattern that carries each hand.',
      questions: [
        {
          kind: 'askChoice',
          text: 'The 1-2-3 characters, 1-2-3 dots and 1-2-3 bamboo, then the 4-5-6 characters and a pair. Which pattern carries it?',
          options: [
            { text: P('mixed-straight'), why: 'A mixed straight needs a low, a middle and a high run, one in each suit.' },
            { text: P('pure-straight'), why: 'A pure straight needs the three runs in one suit.' },
            { text: P('mixed-triple-chow'), correct: true, why: 'Right: {pts:mixed-triple-chow} on its own.' },
          ],
        },
        {
          kind: 'askChoice',
          position: HALF,
          text: 'Only dots and East winds. Which pattern carries it?',
          options: [
            { text: P('half-flush'), correct: true, why: 'Right: one suit and honours, {pts:half-flush}.' },
            { text: P('full-flush'), why: 'The East winds make the flush only half.' },
            { text: P('all-pungs'), why: 'Three of its sets are runs.' },
          ],
        },
        {
          kind: 'askChoice',
          position: PUNGS,
          text: 'Four pungs and a pair. Which pattern carries it?',
          options: [
            { text: P('all-chows'), why: 'All chows needs four runs.' },
            { text: P('seven-pairs'), why: 'Seven pairs has no pungs at all.' },
            { text: P('all-pungs'), correct: true, why: 'Right: {pts:all-pungs}, and the pungs in your hand count again as concealed pungs.' },
          ],
        },
      ],
    },
    { kind: 'askNumber', text: `Back to the first hand, all your own draws: ${P('mixed-triple-chow').toLowerCase()}, ${P('fully-concealed').toLowerCase()}, ${P('all-chows').toLowerCase()}, ${P('short-straight').toLowerCase()} (the 1-2-3 characters and the 4-5-6 characters) and ${P('no-honours').toLowerCase()}. How many points?`, answer: 'win:faan', success: 'Yes, {win:faan}: {win:line:co-mixed-triple-chow} + {win:line:co-fully-concealed} + {win:line:co-all-chows} + {win:line:co-short-straight} + {win:line:co-no-honours}.' },
    { kind: 'askMove', text: 'Win (zimo), and read the sheet.', accept: ['win'], claim: 'legal', success: '{win:faan} points.' },
  ]),
  lesson('co-principles', 'Patterns that do not add up', 4, FLUSH, [
    { kind: 'say', text: `A pattern that another pattern already implies is not counted with it. ${P('full-flush')} leaves out ${P('no-honours').toLowerCase()}: a hand of one suit has no honours anyway. ${P('pure-straight')} leaves out ${P('short-straight').toLowerCase()} and ${P('two-terminal-chows').toLowerCase()}, which it contains.` },
    { kind: 'say', text: 'Sets used together for a pattern of three are not split up again for smaller patterns, and each remaining set may join a used one only once. When the tiles can be read in more than one way, you take the reading that scores most.' },
    { kind: 'askNumber', text: `All bamboo: the 1-2-3 bamboo, 4-5-6 bamboo, 7-8-9 bamboo, 3-4-5 bamboo and a pair, all drawn yourself. ${P('full-flush')} {pts:full-flush}, ${P('pure-straight').toLowerCase()} {pts:pure-straight}, ${P('fully-concealed').toLowerCase()} {pts:fully-concealed}, ${P('all-chows').toLowerCase()} {pts:all-chows}. How many points in all?`, answer: 'win:faan', success: 'Yes, {win:faan}. No honours and the short straight are already inside the bigger patterns.' },
    {
      kind: 'askChoice',
      text: `Why does ${P('no-honours').toLowerCase()} not score here?`,
      options: [
        { text: 'It is only for hands with calls', why: 'It counts for any hand without honours, unless a bigger pattern implies it.' },
        { text: `${P('full-flush')} implies it`, correct: true, why: 'Right: one suit means no honours, so it is counted once, inside the flush.' },
        { text: 'It needs a self-drawn win', why: 'How the hand is won does not matter for no honours.' },
      ],
    },
    { kind: 'askMove', text: 'Win, and check the sheet.', accept: ['win'], claim: 'legal', success: '{win:faan} points, each line counted once.' },
  ]),
  lesson('co-knitted', 'Knitted tiles', 3, KNIT, [
    { kind: 'say', text: 'Chinese Official has shapes no other style has. A knitted straight is nine tiles in three runs of every third number, one run in each suit, such as the 1-4-7 characters, 2-5-8 dots and 3-6-9 bamboo (any suit may take any of the three runs). It counts as three sets, so a fourth set and a pair complete the hand.' },
    { kind: 'say', text: `Honours and knitted tiles is fourteen different tiles, with no set and no pair at all: tiles from one knitted set and single honours. ${P('lesser-honours-knitted')} scores {pts:lesser-honours-knitted}; with all seven honours it is ${P('greater-honours-knitted').toLowerCase()}, {pts:greater-honours-knitted}.` },
    {
      kind: 'askChoice',
      text: 'Which of these is a knitted straight?',
      options: [
        { text: 'The 1-4-7 characters, 2-5-8 dots and 3-6-9 bamboo', correct: true, why: 'Right: one knitted run in each suit.' },
        { text: 'The 1-4-7 characters, 2-5-8 characters and 3-6-9 characters', why: 'The three runs must be in three different suits.' },
        { text: 'The 1-2-3 characters, 4-5-6 dots and 7-8-9 bamboo', why: 'That is a mixed straight: three ordinary runs.' },
      ],
    },
    { kind: 'askNumber', text: `You drew the second ${N('7s')}: knitted straight, the 3-4-5 characters and a pair. With ${P('fully-concealed').toLowerCase()}, ${P('all-chows').toLowerCase()} (the knitted straight counts as three runs), ${P('no-honours').toLowerCase()} and ${P('single-wait').toLowerCase()}, how many points?`, answer: 'win:faan', success: 'Yes, {win:faan}: the knitted straight alone is {pts:knitted-straight}.' },
    { kind: 'askMove', text: 'Win.', accept: ['win'], claim: 'legal', success: '{win:faan} points.' },
  ]),
  lesson('co-settle', 'Settling up', 3, SETTLE, [
    { kind: 'say', text: 'Every player pays the winner {co:base}, whoever discarded. The player who threw the winning tile also pays the hand’s points. On a self-drawn win everyone pays the points plus {co:base}. Flowers count in the points paid, though not toward the minimum.' },
    { kind: 'askNumber', text: `The player across throws the ${N('9p')} and you win: ${P('mixed-straight').toLowerCase()}, ${P('concealed-hand').toLowerCase()}, ${P('all-chows').toLowerCase()}, ${P('no-honours').toLowerCase()}, ${P('single-wait').toLowerCase()} and your flower. How many points?`, answer: 'win:faan', success: 'Yes, {win:faan}, {win:flowerless} of them without the flower.' },
    { kind: 'askNumber', text: 'How much does the player across pay you?', answer: 'win:discarder', success: 'Yes: {win:faan} plus {co:base}, {win:discarder}.' },
    { kind: 'askNumber', text: 'And how much do you collect in all, with the {co:base} from each of the other two?', answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Win (hu) on it.', accept: ['win'], claim: 'legal', success: 'The sheet shows the points and every payment.' },
  ]),
];
