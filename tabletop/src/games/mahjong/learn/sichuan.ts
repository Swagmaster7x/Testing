/**
 * The Sichuan Bloody track (stage 4, after Riichi): what changes, the void suit, fan and points,
 * and the blood battle itself (playing on after a win, kongs paid at once, the checks at the end).
 * Every value is read from the Sichuan rules file at its defaults (game.ts), so a change to the
 * scorer is a change to the lessons. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { lessonPosition, SICHUAN } from './game';

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.4.${id}`, gameId: 'mahjong', stage: 'stage-4', title, minutes, start, steps };
}

/** Void suits for the table: you void bamboo; the others their own. */
const VOIDS = [2, 0, 1, 2] as const;

/** A hand at the start of play: characters and dots only. */
const START = lessonPosition({ hand: '123m 456m 789m 23p 55p 9p', drawn: '9p', style: 'sichuan', options: SICHUAN, dealer: 3, voids: VOIDS, seed: 'sichuan-start' });

/** Three bamboo tiles left over: they must go first. */
const VOID = lessonPosition({ hand: '234m 567m 22p 456p 3s 7s 9s', drawn: '9s', style: 'sichuan', options: SICHUAN, dealer: 3, voids: VOIDS, avoid: '3s 7s 9s', seed: 'sichuan-void' });

/** All dots and all pungs, completed by your own draw. */
const FAN = lessonPosition({ hand: '111p 333p 555p 777p 99p', drawn: '9p', style: 'sichuan', options: SICHUAN, dealer: 3, voids: [0, 0, 1, 2], seed: 'sichuan-fan' });

/** Four 6 characters in hand: a concealed kong, paid at once. */
const KONG = lessonPosition({ hand: '6666m 123p 45p 789p 11p', drawn: '6m', style: 'sichuan', options: SICHUAN, dealer: 3, voids: VOIDS, seed: 'sichuan-kong' });

export const SICHUAN_LESSONS: readonly Lesson[] = [
  lesson('sichuan-changes', 'Sichuan: what changes', 3, START, [
    { kind: 'say', text: 'Sichuan mahjong, the "blood battle", uses only the {sc:suits} suits: {sc:tiles} tiles, no winds, no dragons, no flowers. You may pung and kong, but never chow. Any complete hand wins: there is no minimum.' },
    { kind: 'say', text: 'Before the first throw every player secretly chooses a suit to void. Its tiles must be thrown first, you cannot call them, and a winning hand may not hold a single one.' },
    { kind: 'say', text: 'The biggest change: a win does not end the hand. The winner is paid at once, lays the hand down and leaves; the others play on until {sc:winners} players have won or the wall is empty.' },
    {
      kind: 'askChoice',
      text: 'The player on your left throws the 4 dots, which would complete your 2-3 dots. May you take it?',
      options: [
        { text: 'No: there are no chows in Sichuan', correct: true, why: 'Right: only pungs and kongs may be called, from anyone.' },
        { text: 'Yes, because it comes from the player on your left', why: 'That is the chow rule of other styles; Sichuan has no chows at all.' },
        { text: 'Yes, but only to win', why: 'A win on it would need the run already made: calling a chow is never allowed.' },
      ],
    },
    {
      kind: 'askChoice',
      text: 'The player across wins on a throw. What happens next?',
      options: [
        { text: 'They are paid and leave; the rest of you play on', correct: true, why: 'Right: the battle goes on to the bitter end.' },
        { text: 'The hand is over and the next is dealt', why: 'In Sichuan the hand goes on until three have won or the wall is empty.' },
        { text: 'Everyone pays the winner, then the hand starts again', why: 'Only the thrower pays a win on a throw, and the hand goes on.' },
      ],
    },
  ]),
  lesson('sichuan-void', 'Sichuan: the void suit', 3, VOID, [
    { kind: 'say', text: 'Choose your void suit before play, usually the suit you hold fewest of: those tiles are worth least to you. You void bamboo here, and you still hold three of them.' },
    { kind: 'askMove', text: 'While you hold any of your void suit you may throw only those tiles. Throw a bamboo tile.', accept: ['3s', '7s', '9s'], claim: 'legal', success: 'Right. Your other bamboo goes next, and then you play as usual.' },
    {
      kind: 'askChoice',
      text: 'The wall runs out and you still hold a bamboo tile. What are you?',
      options: [
        { text: 'A flower pig: you pay every other player still in the hand', correct: true, why: 'Right: a hand of three suits at the end is the worst place to be.' },
        { text: 'Safe, as long as you were ready', why: 'A hand holding its void suit can never be ready to win.' },
        { text: 'Nothing happens at the end of the hand', why: 'The end of the hand checks every player still in.' },
      ],
    },
  ]),
  lesson('sichuan-fan', 'Sichuan: fan and points', 4, FAN, [
    { kind: 'say', text: 'A hand is worth fan, and each fan doubles it: a basic hand is {sc:points:0} point, one fan {sc:points:1}, two fan {sc:points:2}, three fan {sc:points:3}, up to the cap of {sc:cap} fan, {sc:cap:points} points.' },
    { kind: 'say', text: 'The fan: all pungs {sfan:sc-all-pungs}; one suit {sfan:sc-pure-suit}; seven pairs {sfan:sc-seven-pairs}, where four alike count as two pairs; and {sfan:sc-root} more for every root, four of the same tile anywhere in the hand. A win on a kong’s tile or a kong’s throw, robbing a kong, and the last tile each add {sfan:sc-kong-flower}.' },
    { kind: 'say', text: 'On a throw the thrower alone pays. On a self-draw everyone still in pays, and at most tables each pays {sc:self-extra} more.' },
    { kind: 'askNumber', text: 'All dots and all pungs, and you drew the winning tile yourself. How many fan?', answer: 'win:faan', success: 'Yes, {win:faan}: one suit and all pungs.' },
    { kind: 'askNumber', text: 'How much do you collect from the three others?', answer: 'win:total', success: 'Yes, {win:total}: each pays the points, and one more for the self-draw.' },
    { kind: 'askMove', text: 'Win, and read the sheet.', accept: ['win'], claim: 'legal', success: 'You are out of the hand, and the other three play on.' },
  ]),
  lesson('sichuan-blood', 'Sichuan: kongs and the end of the hand', 4, KONG, [
    { kind: 'say', text: 'Kongs are paid at once, "wind and rain": an exposed kong called on a throw collects {sc:kong:exposed} from the thrower; an added kong {sc:kong:added} from every player still in; a concealed kong {sc:kong:concealed} from every player still in.' },
    { kind: 'askMove', text: 'Declare the concealed kong of 6 characters.', accept: ['kong 6m'], claim: 'legal', success: 'Paid at once, and you draw a tile from the end of the wall.' },
    { kind: 'askNumber', text: 'All three others are still in. How much did the kong collect in all?', answer: 'sc:kong:concealed:all', success: 'Yes, {sc:kong:concealed:all}.' },
    { kind: 'say', text: 'When the wall runs out, the players still in are checked. A flower pig, still holding three suits, pays every other player the cap. A player who is not ready pays every ready player the most that hand could win, and gives back any kong money from this hand.' },
    {
      kind: 'askChoice',
      text: 'You made a kong, but you are not ready when the wall runs out. What happens to its money?',
      options: [
        { text: 'You give it back, and pay each ready player too', correct: true, why: 'Right: kong money is only safe in a hand that is ready.' },
        { text: 'You keep it: a kong is paid for good', why: 'At most tables a player not ready at the end returns every kong payment.' },
        { text: 'It goes to the player who won first', why: 'That happens only when your throw straight after the kong is won on.' },
      ],
    },
  ]),
];
