/**
 * Mahjong from zero, written once for every style (PLAN.md M10): stage 0 (what the game is),
 * stage 1 (the rules that every style shares: tiles, sets and the pair, the turn, calls and their
 * order, winning, the minimum, a drawn hand) and stage 2 (first strategy: tiles from ready,
 * useful tiles, waits, calls, basic defence). The Hong Kong track is in hk.ts and the
 * Table-ready track in table.ts.
 *
 * These lessons play at a table with no flowers and no minimum (BASIC), so any complete hand
 * wins; the one lesson about the minimum uses the Hong Kong default. All prose is original.
 * Numbers are {placeholders} computed from the rules (game.ts); tiles are named as the table
 * names them ("5 dots", "6-7-8 bamboo"). "Best" claims are proved by the coach's calculators
 * (verify.ts). You sit in seat 0, at the bottom; play passes to your right.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { after, BASIC, HK, lessonPosition, mahjongLessonGame, nameOf, othersPlay, runOf } from './game';

const N = nameOf;

function lesson(id: string, stage: Lesson['stage'], title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.${id}`, gameId: 'mahjong', stage, title, minutes, start, steps };
}

/** Every discard legal in a position, for a step where any tile will do. */
export function anyDiscard(position: string): string[] {
  return mahjongLessonGame.moves(mahjongLessonGame.position(position)).filter((m) => !m.includes(' ') && m !== 'win' && m !== 'pass' && m !== 'pung' && m !== 'kong');
}

// Positions

/** A first look: a hand on its way, the North wind just drawn. */
const FIRST = lessonPosition({ hand: '123m 456p 78s 99s EE W N', drawn: 'N', options: BASIC, seed: 'first', front: 'Wd S Gd 2m' });

/** A spread of tiles: every suit and both kinds of honour. */
const SPREAD = lessonPosition({ hand: '159m 258p 37s ES WdGdRd W', drawn: 'W', options: BASIC, seed: 'spread' });

/** Three sets made, a run on its way, a pair and a lone wind. */
const SETS = lessonPosition({ hand: '345p 777s 123m 56m EE N', drawn: 'N', options: BASIC, seed: 'sets' });

/** A complete hand: the drawn 5 bamboo makes the pair. */
const COMPLETE = lessonPosition({ hand: '123m 456m 789p 345s 55s', drawn: '5s', options: BASIC, seed: 'complete' });
/** Four sets and no pair. */
const NO_PAIR = lessonPosition({ hand: '123m 456m 789p 345s 6s 9s', drawn: '9s', options: BASIC, seed: 'no-pair' });

/** Your turn: the North wind is no use. The others will throw what they draw. */
const TURN = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 4s W N', drawn: 'N', options: BASIC, seed: 'turn', front: 'Wd S Gd 3s' });
const TURN_REPLY = othersPlay(after(TURN, 'N'));

/** The player on your left throws the 6 bamboo; you hold the 7 and the 8. */
const CHOW = lessonPosition({ hand: '234m 678m 3p 5p 99p 78s W', options: BASIC, offer: { seat: 3, tile: '6s' }, avoid: '6s', seed: 'chow' });

/** The player across throws the Red dragon; you hold two. */
const PUNG = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s RdRd', options: BASIC, offer: { seat: 2, tile: 'Rd' }, avoid: 'Rd', seed: 'pung' });

/** Ready for the 5 bamboo; the player across throws one. */
const RON = lessonPosition({ hand: '123m 456m 789p 345s 5s', options: BASIC, offer: { seat: 2, tile: '5s' }, avoid: '5s', seed: 'ron' });

/** The Hong Kong table: complete, but one run was called, so it is worth too little. */
const SHORT = lessonPosition({
  hand: '567p 789s 33s 45m 6m',
  drawn: '6m',
  melds: [[{ type: 'chow', tiles: '234m', from: 3 }]],
  options: { ...HK, flowers: 'off' },
  seed: 'short',
});

/** Two from ready, whichever lone honour goes. */
const READY = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 7s W N', drawn: 'N', options: BASIC, seed: 'ready' });

/** Two lone tiles, a wind and a 9: either can go. */
const LONERS = lessonPosition({ hand: '234m 567m 34p 67p 22s 9s N', drawn: 'N', options: BASIC, seed: 'loners' });

/** Two gaps, 1-3 dots and 7-9 characters: two of the 2 dots are already out. */
const COUNT = lessonPosition({ hand: '234m 678s 13p 45s 79m EE', drawn: 'E', options: BASIC, seed: 'count', discards: ['N W', '2p S', '9s 2p', '1m Gd'] });

/** One tile from ready: throw the West wind and wait on the 2 or the 5 bamboo. */
const WAITS = lessonPosition({ hand: '123m 456m 789p 34s 99s W', drawn: 'W', options: BASIC, seed: 'waits' });

/** The player on your right throws the Red dragon; you hold two. */
const VALUE_CALL = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s RdRd', options: BASIC, offer: { seat: 1, tile: 'Rd' }, avoid: 'Rd', seed: 'value-call' });

/** The player across has called three sets, two of them bamboo, and threw the 9 characters. */
const DANGER = lessonPosition({
  hand: '234m 456p 78p 55s 6s N 9m 6m',
  drawn: '9m',
  options: BASIC,
  seed: 'safety-a',
  melds: [[], [], [{ type: 'pung', tiles: 'RdRdRd', from: 1 }, { type: 'chow', tiles: '345s', from: 1 }, { type: 'pung', tiles: '777s', from: 3 }], []],
  discards: ['E W', '1m 9p S', 'N 9m 2p Wd 1p', 'W 8m E'],
});

export const BASIC_LESSONS: readonly Lesson[] = [
  // Stage 0
  lesson('0.game', 'stage-0', 'Mahjong in a minute', 2, FIRST, [
    { kind: 'say', text: 'Mahjong is played by {seats} players with tiles instead of cards. Each player keeps a hand of {hand:size} tiles. Yours stand along the bottom, face up to you; the other three hands stand at the edges with their backs to you.' },
    { kind: 'say', text: `On your turn you draw a tile from the wall, then throw one tile away, face up in the middle. You have just drawn the ${N('N')}: it stands a little apart from the rest of your hand.` },
    { kind: 'say', text: 'The aim is to be first to complete your hand: {hand:sets} sets of {set:size} tiles and a pair, {win:tiles} tiles in all with the tile that finishes it.' },
    {
      kind: 'askChoice',
      text: 'How many tiles does a complete hand hold, counting the tile that finishes it?',
      options: [
        { text: '{win:tiles}', correct: true, why: 'Yes: {hand:sets} sets of {set:size}, and a pair.' },
        { text: '{hand:size}', why: 'That is the hand you hold between turns. The tile that finishes it makes {win:tiles}.' },
        { text: '{set:tiles}', why: 'That is the whole set of tiles, flowers included.' },
      ],
    },
  ]),
  lesson('0.tiles', 'stage-0', 'The tiles', 3, SPREAD, [
    { kind: 'say', text: 'There are {set:suits} suits, each numbered one to nine, with {set:copies} copies of every tile: characters (a Chinese numeral over the sign 萬), dots (circles) and bamboo (sticks; the one of bamboo is a bird). That makes {set:suited} suit tiles.' },
    { kind: 'say', text: 'Then the honours, which have no numbers: {set:winds} winds (East, South, West and North) and {set:dragons} dragons (Red, Green and White), {set:copies} of each. With learner tiles on, every tile also shows a short label: 5D is the 5 dots, 3C the 3 characters, 7B the 7 bamboo, Rd the Red dragon.' },
    { kind: 'say', text: 'Many tables add {set:bonus} bonus tiles, the flowers and seasons, for {set:tiles} in all. They never stay in a hand, and the first lessons leave them out: {set:plain} tiles.' },
    { kind: 'askMove', text: `Your honours stand at the right of your hand. Throw away the ${N('W')} you just drew: tap it, then tap it again.`, accept: ['W'], claim: 'legal', success: 'That is how every discard works: tap to lift, tap again to throw. Your discards lie in a row in front of you, in the middle of the table.' },
    {
      kind: 'askChoice',
      text: 'Which of these tiles can never be part of a run such as 3-4-5 dots?',
      options: [
        { text: N('Rd'), correct: true, why: 'Right: honours have no numbers, so they make no runs. They make sets of three or four alike.' },
        { text: N('9m'), why: 'A nine can end a run: 7-8-9 characters.' },
        { text: N('1s'), why: 'A one can start a run: 1-2-3 bamboo.' },
      ],
    },
  ]),

  // Stage 1: the rules every style shares
  lesson('1.sets', 'stage-1', 'Sets: chow, pung and kong', 3, SETS, [
    { kind: 'say', text: `A set is {set:size} tiles that belong together. A chow (上, “seung”) is a run in one suit, like your ${runOf('3p')}. A pung (碰, “pung”) is three alike, like your three ${N('7s')}.` },
    { kind: 'say', text: 'A kong (槓, “gong”) is all {kong:size} copies of a tile. It counts as one set, and whoever makes one draws an extra tile from the back of the wall, so the hand stays the right size.' },
    { kind: 'say', text: 'Runs never wrap round (8-9-1 bamboo is not a run) and never mix suits, and honours make no runs at all: winds and dragons only make pungs and kongs.' },
    {
      kind: 'checkpoint',
      text: 'Three questions about sets.',
      questions: [
        {
          kind: 'askChoice',
          text: 'Which of these is a chow?',
          options: [
            { text: runOf('4m'), correct: true, why: 'Yes: three in a row, one suit.' },
            { text: '8-9-1 bamboo', why: 'Runs stop at nine; they never wrap round.' },
            { text: 'East, South and West winds', why: 'Winds make no runs: only pungs and kongs.' },
          ],
        },
        {
          kind: 'askChoice',
          text: 'How many complete sets are in your hand now?',
          options: [
            { text: `Three: ${runOf('1m')}, ${runOf('3p')} and three ${N('7s')}`, correct: true, why: 'Right. The 5 and 6 characters wait for a third tile, the two East winds are a pair, and the North wind is on its own.' },
            { text: 'Four, counting the pair of East winds', why: 'A pair is not a set: a set has {set:size} tiles.' },
            { text: 'Two: only the runs count', why: 'Three alike is a set too: a pung.' },
          ],
        },
        {
          kind: 'askChoice',
          text: 'How many tiles make a kong?',
          options: [
            { text: '{kong:size}', correct: true, why: 'Yes: every copy of the tile. It still counts as one set.' },
            { text: '{set:size}', why: 'That is a pung. A kong is all {kong:size} copies.' },
          ],
        },
      ],
    },
  ]),
  lesson('1.complete', 'stage-1', 'A complete hand', 3, COMPLETE, [
    { kind: 'say', text: 'A complete hand is {hand:sets} sets and one pair (two alike): {win:tiles} tiles. You hold {hand:size} between turns, so the tile that completes it is one you draw or one another player throws.' },
    { kind: 'say', text: `Look at yours: ${runOf('1m')}, ${runOf('4m')}, ${runOf('7p')}, ${runOf('3s')}, and a pair of ${N('5s')}. You just drew the second ${N('5s')}: the hand is complete.` },
    { kind: 'askMove', text: 'Declare the win: press Win.', accept: ['win'], claim: 'legal', success: 'Mahjong! A hand won with your own draw is self-drawn (自摸, zi mo, “jee maw”): everyone pays you.' },
    {
      kind: 'askChoice',
      position: NO_PAIR,
      text: 'A new hand. It has four sets. Is it complete?',
      options: [
        { text: 'No: it has no pair', correct: true, why: `Right. Throw the ${N('9s')} or the ${N('6s')} and wait for a partner for the other.` },
        { text: 'Yes: four sets are enough', why: 'A complete hand needs a pair as well: {hand:sets} sets and a pair.' },
      ],
    },
  ]),
  lesson('1.turn', 'stage-1', 'Drawing and throwing', 3, TURN, [
    { kind: 'say', text: 'The dealer starts with {deal:dealer} tiles and throws first; everyone else starts with {hand:size}. After that every turn is the same: draw one, throw one. Play passes to the right, counter-clockwise round the table.' },
    { kind: 'say', text: 'You draw from the wall. The box in the middle shows how many tiles it still holds; if it runs out before anyone completes a hand, the hand is a draw.' },
    { kind: 'askMove', text: `You drew the ${N('N')} and it does nothing for you. Throw it.`, accept: ['N'], claim: 'legal', success: 'The player on your right draws and throws next, then the player across, then the player on your left, and then you draw again.', reply: TURN_REPLY },
    {
      kind: 'askChoice',
      text: 'Who draws after the player on your left?',
      options: [
        { text: 'You', correct: true, why: 'Yes: the player on your left plays just before you.' },
        { text: 'The player across', why: 'No: play passes to the right, so after your left comes you.' },
        { text: 'Whoever dealt', why: 'No: after the first throw the deal makes no difference; play goes round in order.' },
      ],
    },
  ]),
  lesson('1.chow', 'stage-1', 'Chow: a run from your left', 3, CHOW, [
    { kind: 'say', text: 'When another player throws a tile you can use, you may call for it instead of drawing. A chow may only be called on the tile thrown by the player on your left, just before your turn.' },
    { kind: 'askMove', text: `The player on your left threw the ${N('6s')}, and you hold the 7 and 8 bamboo. Call chow.`, accept: ['chow 6s'], claim: 'legal', success: `You take the tile and lay the run face up: ${runOf('6s')}. A called set is open for everyone to see. You do not draw: you throw a tile now.` },
    { kind: 'askMove', text: `Throw the ${N('W')}.`, accept: ['W'], claim: 'legal', success: 'Good. Your hand plus the open run still makes {hand:size} tiles.' },
    {
      kind: 'askChoice',
      text: `Could you chow a ${N('6s')} thrown by the player across?`,
      options: [
        { text: 'No: only the player on your left feeds a chow', correct: true, why: 'Right. From anyone else you can only take a tile for a pung, a kong or a win.' },
        { text: 'Yes: any discard can make a run', why: 'Only the player on your left, whose throw comes just before your turn.' },
      ],
    },
  ]),
  lesson('1.pung', 'stage-1', 'Pung and kong: from anyone', 3, PUNG, [
    { kind: 'say', text: 'A pung may be called on anyone’s discard. Calling takes the turn: any players between are skipped, and play goes on to your right after your throw.' },
    { kind: 'askMove', text: `The player across threw the ${N('Rd')}, and you hold two. Call pung.`, accept: ['pung'], claim: 'legal', success: 'Three Red dragons, face up. The player on your left was skipped. Now throw a tile.' },
    { kind: 'askMove', text: `Throw the ${N('2s')}, the loneliest tile in your hand.`, accept: ['2s'], claim: 'legal', success: 'Done. The player on your right plays next.' },
    { kind: 'say', text: 'With three alike in your hand you may call kong on the fourth. On your own turn you can also declare a kong when you hold all four (a concealed kong), or add a drawn fourth to a pung you called. Each kong draws a replacement tile from the back of the wall.' },
    {
      kind: 'askChoice',
      text: 'The player on your right throws a tile you hold two of. Can you pung it?',
      options: [
        { text: 'Yes: a pung can be called on any player’s throw', correct: true, why: 'Right. Play then skips on from you.' },
        { text: 'No: only the player on your left feeds you', why: 'That is the rule for a chow only.' },
      ],
    },
  ]),
  lesson('1.order', 'stage-1', 'Who gets the tile', 2, PUNG, [
    { kind: 'say', text: 'Two players sometimes call the same discard. A win beats a pung or a kong, and a pung or a kong beats a chow. Calls count as made at the same moment, so being quick does not matter; being stronger does.' },
    {
      kind: 'checkpoint',
      text: 'Who takes the tile?',
      questions: [
        {
          kind: 'askChoice',
          text: 'The player on your left throws the 5 dots. You call chow, and the player across calls pung. Who takes it?',
          options: [
            { text: 'The player across: a pung beats a chow', correct: true, why: 'Right. Your chow comes to nothing and you draw as usual.' },
            { text: 'You: the tile came from your left', why: 'Your left feeds your chow only when nobody makes a stronger call.' },
          ],
        },
        {
          kind: 'askChoice',
          text: 'You call pung, and the player on your right needs the same tile to win. Who takes it?',
          options: [
            { text: 'The player on your right: a win beats everything', correct: true, why: 'Right. The hand ends there.' },
            { text: 'You: you called first', why: 'Calls count as made together; the stronger one takes the tile.' },
          ],
        },
        {
          kind: 'askChoice',
          text: 'Two players could both win on one discard. Who wins at this table?',
          options: [
            { text: 'The first of them in turn after the thrower', correct: true, why: 'Right. Some tables let both win instead: ask before you sit.' },
            { text: 'Both, always', why: 'Some tables allow it; the default here gives it to the first in turn after the thrower.' },
          ],
        },
      ],
    },
  ]),
  lesson('1.win', 'stage-1', 'Winning on a throw', 2, RON, [
    { kind: 'say', text: 'You may complete your hand with any player’s discard, not only your left’s. Say “sik wu” (食糊, “sick woo”), I win, and take it.' },
    { kind: 'askMove', text: `The player across threw the ${N('5s')}: it makes your pair. Win.`, accept: ['win'], claim: 'legal', success: 'A win on a throw. The player who threw it pays more than the others: they fed you the tile.' },
    {
      kind: 'askChoice',
      text: 'Which ways can a hand be won?',
      options: [
        { text: 'With your own draw, or with any player’s throw', correct: true, why: 'Right: self-drawn, or on a discard.' },
        { text: 'Only with your own draw', why: 'A discard from anyone can complete your hand too.' },
        { text: 'Only with a throw from your left', why: 'That is the rule for a chow. For a win, any player’s throw will do.' },
      ],
    },
  ]),
  lesson('1.minimum', 'stage-1', 'Enough to win', 3, SHORT, [
    { kind: 'say', text: 'Most tables do not pay for just any complete hand. A hand is worth a number of faan (番, “fahn”), counted from its patterns, and in Hong Kong you usually need {hk:min} to win. The table in the app does the counting and offers Win only when a hand is worth enough.' },
    {
      kind: 'askChoice',
      text: 'Your hand is complete: four runs and a pair, one run called from your left. Why is there no Win button?',
      options: [
        { text: 'It is worth less than the minimum', correct: true, why: 'Right: all runs is worth {faan:all-chows} and self-drawn {faan:self-drawn}, {win:faan} in all, short of {hk:min}. A concealed hand would have added one more.' },
        { text: 'A called set can never be part of a win', why: 'Called sets win often. This hand is simply worth too little.' },
        { text: 'You may only win on a discard', why: 'Self-drawn wins count, and score a faan.' },
      ],
    },
    { kind: 'say', text: 'So you play on and build toward patterns. Some tables play with no minimum at all (any complete hand, a chicken hand, 雞糊) or with a minimum of {opt:minFaan:1}. You choose the rules when you start a game; the Hong Kong lessons show how hands are counted.' },
    { kind: 'askMove', text: 'Throw a tile to play on.', accept: anyDiscard(SHORT), claim: 'only', success: 'Right: when you cannot win, a complete hand is just a hand. Keep building.' },
  ]),
  lesson('1.draw', 'stage-1', 'A drawn hand, and the next deal', 2, FIRST, [
    { kind: 'say', text: 'If the wall runs out and nobody has won, the hand is drawn: nobody pays anybody.' },
    { kind: 'say', text: 'Then comes the next deal. When the dealer wins, the dealer deals again, and at most tables a drawn hand also lets the dealer keep the deal. Otherwise the deal passes to the player on the right, and everybody’s seat wind moves with it.' },
    {
      kind: 'askChoice',
      text: 'The player on your right wins a hand that you dealt. Who deals the next one?',
      options: [
        { text: 'The player on your right', correct: true, why: 'Right: the deal passes to the right when the dealer does not win.' },
        { text: 'You again', why: 'Only when the dealer wins (and, at most tables, after a drawn hand).' },
        { text: 'The winner, whoever it is', why: 'Not in Hong Kong: the deal goes round in order, whoever wins.' },
      ],
    },
  ]),

  // Stage 2: first strategy
  lesson('2.ready', 'stage-2', 'Tiles from ready', 3, READY, [
    { kind: 'say', text: 'Players measure a hand by how far it is from ready. Ready (聽, “teng”) means one tile from winning. A hand two from ready needs two good draws to be ready, then one more to win.' },
    { kind: 'say', text: 'The coach counts it from the best way to read your hand: the sets you have, the partial sets (two of a run, or a pair) that one tile would finish, and a pair to end with.' },
    { kind: 'askNumber', text: 'After your best throw, how many tiles from ready will your hand be?', answer: 'shanten', success: '{shanten} from ready. Switch on “Tiles from ready and useful tiles” in the coach and you see this for every discard.' },
    { kind: 'askMove', text: 'Throw a tile that keeps it {shanten} from ready and keeps the most useful tiles: a lone honour.', accept: ['W', 'N'], claim: 'best', success: 'Right: either lone honour. Each leaves {accept:best} useful tiles to draw.' },
  ]),
  lesson('2.loners', 'stage-2', 'Lone tiles first', 2, LONERS, [
    { kind: 'say', text: 'Early in a hand, throw the tiles that work with nothing else: a lone honour, or a lone one or nine far from your other tiles of its suit. Keep pairs and tiles that sit next to, or one apart from, others of their suit.' },
    { kind: 'askMove', text: 'Which tile does nothing for this hand? Throw it.', accept: ['N', '9s'], wrong: { '3p': 'The 3 and 4 dots wait at both ends, for the 2 dots or the 5 dots: keep them.' }, claim: 'best', success: 'Right: the North wind and the 9 bamboo touch nothing. Either keeps {accept:best} useful tiles.' },
  ]),
  lesson('2.useful', 'stage-2', 'Count the useful tiles', 3, COUNT, [
    { kind: 'say', text: 'Two throws can leave a hand equally close to ready and still be far from equal. Count the useful tiles: the ones that would bring you closer, less the copies you can already see on the table.' },
    { kind: 'say', text: `Your hand has two gaps: 1 and 3 dots wait for the 2 dots, and 7 and 9 characters wait for the 8 characters. Look at the discards: two of the ${N('2p')} are already out, and no 8 characters.` },
    {
      kind: 'askMove',
      text: 'Break one gap: throw the tile that keeps the most useful tiles.',
      accept: ['1p', '3p'],
      wrong: { '7m': 'That keeps the gap at 2 dots, and only {unseen:2p} of those are left: {accept:7m} useful tiles instead of {accept:best}.', '9m': 'That keeps the gap at 2 dots, and only {unseen:2p} of those are left: {accept:9m} useful tiles instead of {accept:best}.' },
      claim: 'best',
      success: 'Right: the 8 characters are all still out there. That keeps {accept:best} useful tiles.',
    },
  ]),
  lesson('2.waits', 'stage-2', 'Waits', 3, WAITS, [
    { kind: 'say', text: 'Once you are ready, what matters is the wait: which tiles complete the hand, and how many are left. Two in a row in the middle wait at both ends; a gap (4 and 6 dots) or an edge (1 and 2 dots) waits on one tile; a lone tile waits for its pair.' },
    { kind: 'askNumber', text: `If you throw the ${N('W')}, how many different tiles would complete your hand?`, answer: 'waits:W', success: '{waits:W}: the {waits:names:W}. Both ends of your 3 and 4 bamboo.' },
    { kind: 'askMove', text: `Throw the ${N('W')}: you are ready.`, accept: ['W'], claim: 'best', success: 'Ready, waiting at both ends.' },
    { kind: 'askNumber', text: 'Of those winning tiles, how many copies have you not seen yet?', answer: 'waits:left', success: '{waits:left}: none is in your hand or on the table. The more left, the better the wait.' },
  ]),
  lesson('2.calls', 'stage-2', 'When to call', 3, VALUE_CALL, [
    { kind: 'say', text: 'A call speeds you up: you finish a set at once and skip a draw. But the set lies open, the others see what you collect, and most styles reward a hand you built without calls.' },
    {
      kind: 'askChoice',
      text: 'Which call is almost always worth making?',
      options: [
        { text: 'A pung of dragons', correct: true, why: 'Right: dragons make no runs, so a pair of them rarely does better, and in Hong Kong each dragon pung is worth {faan:dragon-pung} faan.' },
        { text: 'A chow that leaves your hand no closer to ready', why: 'A call that does not speed you up only shows your hand.' },
        { text: 'Any call, as soon as you can', why: 'Calling everything leaves a hand worth little and easy to read.' },
      ],
    },
    { kind: 'askMove', text: `The player on your right threw the ${N('Rd')}. Call pung.`, accept: ['pung'], claim: 'legal', success: 'A set of dragons, worth keeping.' },
  ]),
  lesson('2.defence', 'stage-2', 'Safe tiles', 4, DANGER, [
    { kind: 'say', text: 'When another player looks ready, the tile you throw may be the one they win on, and on a throw the thrower pays the most. Signs: three or four sets called, or a long row of discards late in the hand.' },
    { kind: 'say', text: 'Safer: a tile that player has thrown themselves (they did not want it then), and honours whose other copies you can all see. Riskier: tiles of the suit their called sets are in, above all the middle ones.' },
    {
      kind: 'askMove',
      text: 'The player across has called three sets, two of them bamboo. Throw your safest tile.',
      accept: ['9m'],
      wrong: { '5s': 'They are collecting bamboo, and a middle bamboo is the likeliest tile to finish their hand.', '6s': 'They are collecting bamboo, and a middle bamboo is the likeliest tile to finish their hand.', N: 'Fairly safe, but two North winds are still out of sight. They threw the 9 characters themselves.' },
      claim: 'best',
      success: 'Right: they threw the 9 characters themselves. Switch on “Safe tiles against each player” in the coach to see every tile ranked.',
    },
  ]),
];
