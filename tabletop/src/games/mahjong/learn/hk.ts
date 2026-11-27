/**
 * The Hong Kong track (stage 3): flowers and seasons, the faan table, seat and round winds, the
 * minimum and the limit, faan into points, who pays, and counting a hand yourself. Every value
 * is read from the Hong Kong rules file at its defaults (game.ts), so a change to the table is a
 * change to the lessons. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { HK, lessonPosition, nameOf, runOf } from './game';
import { patternName } from '../ui/names';

const N = nameOf;
const P = patternName;

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.3.${id}`, gameId: 'mahjong', stage: 'stage-3', title, minutes, start, steps };
}

/** You sit South (the dealer is on your left) and hold two bonus tiles and a season. */
const FLOWERS = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 4s W N', drawn: 'N', options: HK, dealer: 3, bonus: ['F2 F1 S4'], seed: 'hk-flowers' });

/** All pungs, two of them called: self-drawn with the second East wind for the pair. */
const ALL_PUNGS = lessonPosition({
  hand: '111m 777m EE',
  drawn: 'E',
  melds: [[{ type: 'pung', tiles: '555p', from: 1 }, { type: 'pung', tiles: '999s', from: 2 }]],
  options: HK,
  bonus: ['F3'],
  seed: 'hk-pungs',
});

/** Dots and honours only, concealed, self-drawn. */
const MIXED = lessonPosition({ hand: '123p 456p 789p NNN 55p', drawn: '5p', options: HK, bonus: ['S3'], seed: 'hk-mixed' });

/** Four runs and a pair, concealed, self-drawn, no bonus tiles at all. */
const CHOWS = lessonPosition({ hand: '123m 456m 789p 345s 55s', drawn: '5s', options: HK, bonus: [''], seed: 'hk-chows' });

/** You sit South in the East round, with pungs of both winds. */
const WINDS = lessonPosition({ hand: 'SSS EEE 234m 678p 99s', drawn: '9s', options: HK, dealer: 3, bonus: [''], seed: 'hk-winds' });

/** Plenty of dots and a pair of dragons, with a stray bamboo and character. */
const PLAN = lessonPosition({ hand: '12355p 6789p RdRd E 3s 9m', drawn: '9m', options: HK, bonus: ['F3'], seed: 'hk-plan' });

/** Dots and a called Red dragon pung, ready on the 6 or 9 dots; the player on your left throws a 6. */
const PAY = lessonPosition({
  hand: '234p 456p 78p 99p',
  melds: [[{ type: 'pung', tiles: 'RdRdRd', from: 2 }]],
  options: HK,
  offer: { seat: 3, tile: '6p' },
  avoid: '6p 9p',
  bonus: ['F1'],
  seed: 'hk-pay',
});

/** A dragon hand to count from scratch: self-drawn, one pung called. */
const COUNT = lessonPosition({
  hand: 'GdGdGd 678s 345s 33s',
  drawn: '3s',
  melds: [[{ type: 'pung', tiles: 'WdWdWd', from: 1 }]],
  options: HK,
  bonus: ['S2'],
  seed: 'hk-count',
});

export const HK_LESSONS: readonly Lesson[] = [
  lesson('hk-flowers', 'Flowers and seasons', 3, FLOWERS, [
    { kind: 'say', text: 'Hong Kong tables play with {set:bonus} bonus tiles: four flowers (plum, orchid, chrysanthemum and bamboo) and four seasons (spring, summer, autumn and winter), each numbered one to four. A bonus tile never stays in your hand: set it aside face up as soon as you get it, and draw a replacement from the back of the wall. The app does that for you.' },
    { kind: 'say', text: 'Each seat has its number: East one, South two, West three, North four. Your own flower and your own season each add {faan:seat-flower} faan when you win. All four flowers, or all four seasons, add {faan:flower-set} faan, and a hand with no bonus tiles at all adds {faan:no-flowers}.' },
    {
      kind: 'askChoice',
      text: 'You sit South this hand. Which of your bonus tiles is yours?',
      options: [
        { text: N('F2'), correct: true, why: 'Right: South is two, and the orchid is flower two.' },
        { text: N('F1'), why: 'The plum is flower one: East’s.' },
        { text: N('S4'), why: 'Winter is season four: North’s.' },
      ],
    },
    { kind: 'askNumber', text: 'If you win this hand, how many faan will your bonus tiles add?', answer: 'bonus:faan', success: '{bonus:faan}: the orchid only. The plum and the winter belong to other seats.' },
  ]),
  lesson('hk-patterns', 'How a hand scores', 4, ALL_PUNGS, [
    { kind: 'say', text: `Faan come from patterns. First, how the hand is built: ${P('all-chows').toLowerCase()} is worth {faan:all-chows} faan, ${P('all-pungs').toLowerCase()} {faan:all-pungs}, one suit with honours (${P('mixed-one-suit').toLowerCase()}) {faan:mixed-one-suit}, and one suit alone (${P('pure-one-suit').toLowerCase()}) {faan:pure-one-suit}.` },
    { kind: 'say', text: 'Then the honours: each pung of dragons is worth {faan:dragon-pung}, a pung of your seat wind {faan:seat-wind}, and of the round’s wind {faan:prevailing-wind}. Last, how it is won: self-drawn {faan:self-drawn}, and with no called sets (concealed) {faan:concealed}. A hand scores every pattern it has, added up.' },
    {
      kind: 'checkpoint',
      text: 'Name a pattern in each hand.',
      questions: [
        {
          kind: 'askChoice',
          text: 'Two pungs called, two in your hand, and a pair of East winds. Which pattern does it score?',
          options: [
            { text: P('all-pungs'), correct: true, why: 'Right: four pungs and a pair, {faan:all-pungs} faan.' },
            { text: P('concealed'), why: 'Two of its pungs were called, so it is not concealed.' },
            { text: P('mixed-one-suit'), why: 'It mixes all three suits.' },
          ],
        },
        {
          kind: 'askChoice',
          position: MIXED,
          text: 'Only dots and North winds. Which pattern does it score?',
          options: [
            { text: P('mixed-one-suit'), correct: true, why: 'Right: one suit with honours, {faan:mixed-one-suit} faan.' },
            { text: P('pure-one-suit'), why: 'The North winds are honours, so the suit is mixed.' },
            { text: P('all-chows'), why: 'Three North winds are a pung.' },
          ],
        },
        {
          kind: 'askChoice',
          position: CHOWS,
          text: 'Four runs and a pair, nothing called, no bonus tiles. Which of these does it not score?',
          options: [
            { text: P('all-pungs'), correct: true, why: 'Right: it is all runs, so it scores all chows instead.' },
            { text: P('all-chows'), why: 'It does: four runs and a pair.' },
            { text: P('no-flowers'), why: 'It does: no bonus tile came your way.' },
          ],
        },
      ],
    },
    { kind: 'askMove', position: CHOWS, text: 'Win, and read the score sheet.', accept: ['win'], claim: 'legal', success: 'All chows, self-drawn, concealed and no flowers: {faan:all-chows} each.' },
  ]),
  lesson('hk-winds', 'Seat wind and round wind', 3, WINDS, [
    { kind: 'say', text: 'Every player has a seat wind: the dealer is East, the player on the dealer’s right South, then West and North. The round has a wind of its own: a game starts with the East round.' },
    {
      kind: 'askChoice',
      text: 'You sit South in the East round. Which wind pungs score for you?',
      options: [
        { text: 'South and East', correct: true, why: 'Right: South is your seat, East the round. As East in the East round, a pung of East winds counts twice.' },
        { text: 'Only South', why: 'The round’s wind scores for everybody: here, East.' },
        { text: 'Any wind', why: 'Only your seat wind and the round’s wind score.' },
      ],
    },
    { kind: 'askNumber', text: 'Count this hand, self-drawn with nothing called and no bonus tiles. How many faan?', answer: 'win:faan', success: '{win:faan}: seat wind, round wind, self-drawn, concealed and no flowers.' },
    { kind: 'askMove', text: 'Win, and check the sheet.', accept: ['win'], claim: 'legal', success: 'Every line one faan, as you counted.' },
  ]),
  lesson('hk-minimum', 'The minimum and the limit', 3, PLAN, [
    { kind: 'say', text: 'You need {hk:min} faan to win at most Hong Kong tables, so plan from your first throws: keep pairs of dragons and of your winds, lean toward one suit, and stay concealed when it costs little.' },
    { kind: 'say', text: 'At the top, every hand stops at the limit: {hk:limit} faan by default. A few rare hands score the limit outright: thirteen orphans (one of each one, nine and honour, plus a pair), all honours, all terminals, four concealed pungs, nine gates, all kongs, great four winds, and a win on the very first tiles.' },
    {
      kind: 'askChoice',
      text: 'Lots of dots, a pair of Red dragons, an East wind, a stray bamboo and a stray character. Which plan reaches the minimum best?',
      options: [
        { text: 'Dots and honours only: mixed one suit, and the dragons on top', correct: true, why: 'Right: mixed one suit is worth {faan:mixed-one-suit} by itself, and a Red dragon pung adds {faan:dragon-pung}.' },
        { text: 'Runs in every suit, for all chows', why: 'All chows is worth only {faan:all-chows}; it rarely reaches {hk:min} alone.' },
        { text: 'Throw the dragons: they make no runs', why: 'A dragon pung is a faan you can call from anyone.' },
      ],
    },
    { kind: 'askMove', text: `Throw the ${N('9m')}: it fits nothing in the plan.`, accept: ['9m'], claim: 'legal', success: 'Next, the bamboo. Every throw now heads for one suit.' },
  ]),
  lesson('hk-points', 'From faan to points', 3, ALL_PUNGS, [
    { kind: 'say', text: 'Faan are doubles. On the usual table (half spicy) a hand of no faan is worth {points:0} base point, then {points:1}, {points:2}, {points:3} and {points:4} for one to four faan. After that the base climbs half and half again: {points:5}, {points:6}, {points:7}, {points:8}, {points:9}, and {points:10} at the limit.' },
    { kind: 'say', text: 'Full spicy keeps doubling ({points:full:5} at five faan); the old style table rises in steps ({points:old:5} at five). Which one a table uses is a question to ask before you sit.' },
    { kind: 'askNumber', text: 'This hand scores {win:faan} faan. What is its base, on the half spicy table?', answer: 'win:base', success: 'Yes, {win:base}.' },
  ]),
  lesson('hk-pay', 'Who pays', 3, PAY, [
    { kind: 'say', text: 'Self-drawn: each of the other three pays the winner {pay:self} times the base. On a throw (half gun, the default here), the thrower pays {pay:discarder} times the base and the two others {pay:others} time each. Many tables now play full gun: the thrower alone pays {pay:full} times the base.' },
    { kind: 'askNumber', text: `The player on your left threw the ${N('6p')}, and you can win on it: {win:faan} faan, base {win:base}. How much does the thrower pay?`, answer: 'win:discarder', success: 'Yes: {pay:discarder} times {win:base} is {win:discarder}.' },
    { kind: 'askNumber', text: 'And how much do you collect in all?', answer: 'win:total', success: 'Yes, {win:total}: {win:discarder} from the thrower and {win:other} from each of the others.' },
    { kind: 'askMove', text: 'Take it: win.', accept: ['win'], claim: 'legal', success: 'The sheet shows every payment.' },
  ]),
  lesson('hk-count', 'Count it yourself', 4, COUNT, [
    { kind: 'say', text: `At a real table nobody scores for you. Count this hand from scratch: a pung of White dragons called, Green dragons in your hand, ${runOf('6s')} and ${runOf('3s')}, and a pair of 3 bamboo you just completed by your own draw. You sit East and hold Summer.` },
    {
      kind: 'askChoice',
      text: 'Which patterns does it score?',
      options: [
        { text: 'Two dragon pungs, mixed one suit and self-drawn', correct: true, why: 'Right. It is not concealed (the White dragons were called), and Summer belongs to South.' },
        { text: 'Two dragon pungs, all chows and concealed', why: 'Dragon pungs are not chows, and the White dragons were called.' },
        { text: 'Pure one suit and self-drawn', why: 'The dragons make the suit mixed, not pure.' },
      ],
    },
    { kind: 'askNumber', text: 'Add them up: how many faan?', answer: 'win:faan', success: 'Yes, {win:faan}.' },
    { kind: 'askNumber', text: 'Self-drawn, so everyone pays twice the base. How much do you collect in all?', answer: 'win:total', success: 'Yes: {win:each} from each of the three, {win:total} in all.' },
    { kind: 'say', text: 'In a game, switch off “Score hands for me” in the coach to count every winning hand yourself before the sheet shows.' },
  ]),
];
