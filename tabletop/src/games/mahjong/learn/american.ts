/**
 * The American track (stage 4, after Sichuan): what changes, the Charleston, jokers in exposures
 * and the joker exchange, and what a hand from the card pays. Every value is read from the American
 * rules file and the practice card (game.ts). All prose is original; no hand of a real card appears.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { AMERICAN, lessonPosition, nameOf } from './game';

const N = nameOf;

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.4.${id}`, gameId: 'mahjong', stage: 'stage-4', title, minutes, start, steps };
}

/** A hand on its way to the practice card's "Evens" hand of flowers, twos, fours, sixes and eights. */
const START = lessonPosition({ hand: 'F1 F2 2m 2m 2m J 4p 4p 6s 6s 9s N E W', drawn: 'W', style: 'american', options: AMERICAN, avoid: 'J', seed: 'american-start' });

/** The player on your left throws a 6 bamboo; you hold one and a joker. */
const EXPOSE = lessonPosition({ hand: 'F1 F2 2m 2m 2m 2m 4p 4p 6s J 8m 9s N', style: 'american', options: AMERICAN, offer: { seat: 3, tile: '6s' }, avoid: '6s J', seed: 'american-expose' });

/** The player on your right has exposed three 7 dots, one of them a joker; you hold a 7 dots. */
const SWAP = lessonPosition({
  hand: 'F1 F2 2m 2m 2m 4p 4p 6s 6s 6s 7p 8m 8m N',
  drawn: 'N',
  melds: [[], [{ type: 'pung', tiles: '7p 7p J', from: 2 }], [], []],
  style: 'american',
  options: AMERICAN,
  avoid: 'J',
  seed: 'american-swap',
});

/** The "Evens" hand complete, a joker in the 2 characters, the last tile your own draw. */
const SCORE = lessonPosition({ hand: 'F1 F2 F3 2m 2m 2m J 4p 4p 6s 6s 6s 8m 8m', drawn: '8m', style: 'american', options: AMERICAN, avoid: 'J', seed: 'american-score' });

export const AMERICAN_LESSONS: readonly Lesson[] = [
  lesson('american-changes', 'American: what changes', 4, START, [
    { kind: 'say', text: 'American mah jongg is played from a card of hands. Each year a new card is printed: you win only with one of its hands, made of exact groups (singles, pairs, pungs, kongs, quints and sextets), each hand worth its points. The app has its own practice card of {am:hands} hands, from {am:min} to {am:max} points; you can type in the card you own.' },
    { kind: 'say', text: 'The set has {am:tiles} tiles: the usual suits, winds and dragons, {am:flowers} flowers that all count alike, and {am:jokers} jokers. A joker stands for any tile in a group of {am:set:min} or more, never in a single or a pair. There are no chows.' },
    { kind: 'say', text: 'Dragons go with suits on the card: red with characters (craks), green with bamboo (bams), white with dots. The white dragon is also the zero of a year.' },
    {
      kind: 'askChoice',
      text: 'Your hand needs a pair of 8 characters, and you hold one 8 characters and a joker. Is the pair made?',
      options: [
        { text: 'No: a joker never goes in a pair', correct: true, why: 'Right: only groups of three or more may take jokers.' },
        { text: 'Yes: a joker stands for any tile', why: 'A joker stands for any tile only in a pung or larger.' },
        { text: 'Yes, if the pair is the last group you need', why: 'Pairs and singles always need real tiles.' },
      ],
    },
    {
      kind: 'askChoice',
      text: 'The player on your left throws the 4 dots, which would fit a run you are building. May you call it?',
      options: [
        { text: 'No: no chows, and only a set of three or more (or Mah Jongg) can be called', correct: true, why: 'Right: you may call to expose a pung, kong, quint or sextet, or for Mah Jongg.' },
        { text: 'Yes, as in Hong Kong', why: 'American has no chows at all.' },
      ],
    },
  ]),
  lesson('american-charleston', 'American: the Charleston', 4, START, [
    { kind: 'say', text: 'Before the first throw comes the Charleston. In the first Charleston everyone passes {am:pass} tiles to the right, then {am:pass} across, then {am:pass} to the left: {am:first} passes. Pass what your chosen hands do not need. Jokers never pass.' },
    { kind: 'say', text: 'If every player agrees, a second Charleston follows the other way round: left, across, right. One "no" stops it. Then you may offer the player across up to {am:courtesy} tiles in the courtesy pass; if you offer different numbers, the lower one changes hands.' },
    { kind: 'say', text: 'On the last pass of each Charleston you may pass blind: pass on some of the tiles you are receiving without looking at them, so you keep your own.' },
    {
      kind: 'askChoice',
      text: 'You hold two jokers and three tiles no hand of yours needs. What do you pass to the right?',
      options: [
        { text: 'The three tiles you do not need', correct: true, why: 'Right: and the jokers stay with you; they may never be passed.' },
        { text: 'The two jokers and one spare tile', why: 'Jokers may not be passed, and they are the best tiles you hold.' },
      ],
    },
    {
      kind: 'askChoice',
      text: 'The first Charleston is over, and the player across says "no" to a second. What happens?',
      options: [
        { text: 'The second Charleston is skipped; the courtesy pass may follow', correct: true, why: 'Right: one "no" is enough.' },
        { text: 'The second Charleston is played by the other three', why: 'All four agree to it, or nobody plays it.' },
      ],
    },
  ]),
  lesson('american-jokers', 'American: jokers in exposures', 4, EXPOSE, [
    { kind: 'say', text: `You are building a hand with three 6 bamboo, and you hold one ${N('6s')} and a joker.` },
    { kind: 'askMove', text: 'The player on your left throws the 6 bamboo. Call it for a pung, putting in your 6 bamboo and the joker.', accept: ['expose 3 1'], claim: 'legal', success: 'The pung lies face up: two 6 bamboo and a joker standing for the third.' },
    { kind: 'askMove', text: `As after any call, throw a tile now: the ${N('N')}.`, accept: ['N'], claim: 'legal', success: 'Now anyone holding a real 6 bamboo may take your joker on their turn.' },
  ]),
  lesson('american-exchange', 'American: the joker exchange', 3, SWAP, [
    { kind: 'say', text: 'On your turn, before you throw, you may take a joker from any exposure on the table by putting in the real tile it stands for. The joker is then yours, for any set you need.' },
    { kind: 'askMove', text: 'The player on your right has exposed three 7 dots, one of them a joker, and you hold a 7 dots. Take the joker.', accept: ['swap 1 0'], claim: 'legal', success: 'Your 7 dots sits in their pung, and the joker is in your hand.' },
    { kind: 'askMove', text: `Throw the ${N('N')}.`, accept: ['N'], claim: 'legal', success: 'A hand whose exposures fit no hand on the card is dead: its jokers are safe from exchange, and it can never win.' },
  ]),
  lesson('american-scoring', 'American: what a hand pays', 4, SCORE, [
    { kind: 'say', text: 'A hand is worth its points on the card. On a throw, the thrower pays {am:pay:discarder} times the value and the other two pay it once; on a hand you pick yourself, all three pay {am:pay:self} times. A hand made with no jokers at all counts {am:jokerless} times.' },
    { kind: 'askNumber', text: 'You drew the last 8 characters: flowers, twos, fours, sixes and eights, a joker among the twos. What is the hand worth on the practice card?', answer: 'win:faan', success: 'Yes, {win:faan}: the joker means no jokerless bonus.' },
    { kind: 'askNumber', text: 'You picked it yourself. How much do you collect from the three others?', answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Mah Jongg: win.', accept: ['win'], claim: 'legal', success: 'The sheet shows the hand from the card and what each player pays.' },
  ]),
];
