/**
 * The Taiwanese track (stage 4, milestone 14b): what is different at a 16-tile table: five sets and
 * a pair, flowers for your seat, tai counted one by one, the dealer's tai and repeat deals, and
 * paying a base and a stake per tai. Every value comes from the Taiwanese rules file (game.ts):
 * the tai table, the scorer for each hand, the settlement for each payment. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { lessonPosition, nameOf, TW } from './game';
import { patternName } from '../ui/names';

const N = nameOf;
const P = (id: string) => patternName(`tw-${id}`);
const lower = (id: string) => P(id).charAt(0).toLowerCase() + P(id).slice(1);

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.4.${id}`, gameId: 'mahjong', stage: 'stage-4', title, minutes, start, steps };
}

const tw = { style: 'taiwanese', options: TW } as const;

/** Sixteen tiles and the drawn East: throw it and the hand is ready on the 4 or 7 bamboo. */
const START = lessonPosition({ ...tw, dealer: 3, hand: '123m 456m 789p 234s 56s 99p E', drawn: 'E', bonus: [''], seed: 'tw-start' });

/** Self-drawn, concealed, a Red dragon pung and your seat flower (South: the Orchid). */
const TAI = lessonPosition({ ...tw, dealer: 3, hand: '123m 456m 789p RdRdRd 56s 99p 4s', drawn: '4s', bonus: ['F2'], seed: 'tw-tai' });

/** You deal, have kept the deal twice, and the player across throws the 4 bamboo. */
const DEALER = lessonPosition({ ...tw, dealer: 0, counter: 2, hand: '123m 456m 789p 234s 56s 99p', offer: { seat: 2, tile: '4s' }, bonus: [''], avoid: '4s 7s', seed: 'tw-dealer' });

/** Three flowers in front of you: two of them your seat's (South: 2). */
const FLOWERS = lessonPosition({ ...tw, dealer: 3, hand: '123m 456m 789p 234s 56s 99p E', drawn: 'E', bonus: ['F2 S2 F1'], seed: 'tw-flowers' });

/** The dealer on your left, with a streak of one, throws your winning tile. */
const PAY = lessonPosition({ ...tw, dealer: 3, counter: 1, hand: '123m 456m 789p 234s 56s 99p', offer: { seat: 3, tile: '7s' }, bonus: [''], avoid: '4s 7s', seed: 'tw-pay' });

export const TW_LESSONS: readonly Lesson[] = [
  lesson('tw-changes', 'Taiwanese: what changes', 4, START, [
    { kind: 'say', text: 'Taiwanese mahjong is the style played across Taiwan. Each player holds {tw:hand} tiles, not thirteen, so a complete hand is {tw:sets} sets and a pair: {tw:win} tiles. The {tw:tiles} tiles include the flowers, and the last {tw:dead-wall} tiles of the wall are never drawn.' },
    { kind: 'say', text: 'There is no minimum: any complete hand may win, even one worth nothing. Hands are counted in tai, one point at a time, and paid as a base stake plus a stake for each tai. Several players may win on the same throw, and the discarder pays each of them.' },
    {
      kind: 'askChoice',
      text: 'How many sets does a complete Taiwanese hand hold besides its pair?',
      options: [
        { text: '{hand:sets}', why: 'That is a thirteen-tile hand. With {tw:hand} tiles you need one more set.' },
        { text: '{tw:sets}', correct: true, why: 'Right: {tw:sets} sets and a pair, {tw:win} tiles in all.' },
        { text: '{tw:hand}', why: 'That is how many tiles you hold, not how many sets.' },
      ],
    },
    { kind: 'askMove', text: `Throw the ${N('E')}: your hand is then ready on the 4 or 7 bamboo.`, accept: ['E'], claim: 'legal', success: 'Ready, with {tw:sets} sets of {tw:sets} nearly done.' },
  ]),
  lesson('tw-tai', 'Counting tai', 4, TAI, [
    { kind: 'say', text: `The common tai: ${lower('self-drawn')} {tai:self-drawn}, ${lower('concealed')} {tai:concealed}, and both together, ${lower('concealed-self-drawn')}, {tai:concealed-self-drawn}. Each dragon pung {tai:dragon-pung}; a pung of your seat wind or the round's wind {tai:seat-wind} each. Each of your seat's flowers {tai:seat-flower}.` },
    { kind: 'say', text: `Bigger ones: ${lower('all-chows')} {tai:all-chows}, ${lower('all-pungs')} {tai:all-pungs}, ${lower('half-flush')} {tai:half-flush}, ${lower('full-flush')} {tai:full-flush}, three concealed pungs {tai:three-concealed}, four {tai:four-concealed}, five {tai:five-concealed}. A wait on one tile only (an edge, a closed or a pair wait) adds {tai:one-wait}.` },
    { kind: 'askNumber', text: `You drew the ${N('4s')}: nothing called, a pung of Red dragons, and the Orchid, your seat's flower (you sit South). How many tai?`, answer: 'win:faan', success: 'Yes, {win:faan}: {win:line:tw-concealed-self-drawn} for a concealed self-draw, {win:line:tw-dragon-pung} for the dragons, {win:line:tw-seat-flower} for the flower.' },
    {
      kind: 'askChoice',
      text: `Why is this hand not ${lower('all-chows')}?`,
      options: [
        { text: 'It is concealed', why: 'A concealed hand may still be all chows.' },
        { text: 'All chows is not played in Taiwanese', why: 'It is: {tai:all-chows} tai.' },
        { text: 'It has a pung, a flower, and you drew the tile yourself', correct: true, why: `Right: ${lower('all-chows')} needs five runs, no flowers, and a win on a throw with a two-sided wait.` },
      ],
    },
    { kind: 'askMove', text: 'Win (zimo), and read the sheet.', accept: ['win'], claim: 'legal', success: '{win:faan} tai.' },
  ]),
  lesson('tw-dealer', 'The dealer and repeat deals', 4, DEALER, [
    { kind: 'say', text: 'The dealer keeps the deal after winning and after a drawn hand: a repeat deal (連莊, lián zhuāng). A dealer who wins adds {tai:dealer} tai for dealing and {tai:streak} more for each repeat deal in a row.' },
    { kind: 'say', text: 'A dealer who pays is charged the same: when another player wins on the dealer’s throw, or by self-draw, the dealer pays the hand and {tai:dealer} plus {tai:streak} for each repeat deal. Players who are not the dealer pay only the hand.' },
    { kind: 'askNumber', text: `You deal, with {tw:streak} repeat deals so far. The player across throws the ${N('4s')}, completing a concealed hand of runs (${lower('concealed')} and ${lower('all-chows')}). How many tai, with the dealer’s?`, answer: 'win:faan', success: 'Yes, {win:faan}: {win:line:tw-concealed} + {win:line:tw-all-chows} for the hand, {win:line:tw-dealer} for dealing and {win:line:tw-streak} for the repeat deals.' },
    { kind: 'askNumber', text: 'At {tw:base} a hand and {tw:per-tai} a tai, how much does the player across pay you?', answer: 'win:discarder', success: 'Yes: {tw:base} plus {win:faan} times {tw:per-tai}, {win:discarder}.' },
    { kind: 'askMove', text: 'Win (hu) on it.', accept: ['win'], claim: 'legal', success: 'You keep the deal: another repeat deal.' },
  ]),
  lesson('tw-flowers', 'Flowers', 3, FLOWERS, [
    { kind: 'say', text: 'Each seat has its own flowers: East flower 1 and season 1, South flower 2 and season 2, West flower 3 and season 3, North flower 4 and season 4. Yours are worth {tai:seat-flower} each when you win. A set of all four flowers, or all four seasons, is worth {tai:flower-set}.' },
    { kind: 'say', text: `Two flower wins end the hand at once. Draw all eight and you win: ${lower('eight-flowers')}, {tai:eight-flowers}. Hold seven when another player draws the eighth, and you take it and win: ${lower('seven-flowers')}, {tai:seven-flowers}, paid by that player.` },
    { kind: 'askNumber', text: 'You sit South with the Orchid, the Summer and the Plum. How many tai do your flowers give you if you win?', answer: 'bonus:faan', success: 'Yes, {bonus:faan}: the Orchid and the Summer are your seat’s; the Plum is East’s.' },
    { kind: 'askMove', text: `Throw the ${N('E')}.`, accept: ['E'], claim: 'legal', success: 'Thrown.' },
  ]),
  lesson('tw-pay', 'Paying: base and tai', 3, PAY, [
    { kind: 'say', text: 'The table sets two stakes: a base for every hand and a stake for each tai. Here they are {tw:base} and {tw:per-tai}. On a throw only the thrower pays; on a self-draw each of the other three pays.' },
    { kind: 'askNumber', text: `The dealer on your left (repeat deals so far: {tw:streak}) throws the ${N('7s')}: ${lower('concealed')} and ${lower('all-chows')} for you. How many tai is your hand?`, answer: 'win:faan', success: 'Yes, {win:faan}.' },
    { kind: 'askNumber', text: 'The dealer pays the hand and {tw:dealer-extra} tai more for dealing and the repeat deal. How much does the dealer pay you?', answer: 'win:discarder', success: 'Yes: {tw:base} plus {win:faan} and {tw:dealer-extra} tai at {tw:per-tai} each, {win:discarder}.' },
    { kind: 'askMove', text: 'Win (hu).', accept: ['win'], claim: 'legal', success: 'The sheet shows the tai and the payment.' },
  ]),
];
