/**
 * The Riichi track (stage 4): what changes from Hong Kong, the ten yaku you will meet most,
 * declaring riichi, furiten, dora and red fives, han and fu with the payment table, and defence
 * against a riichi. Every value is read from the Riichi rules file at its defaults (game.ts), so a
 * change to the scorer is a change to the lessons. All prose is original.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import { after, lessonPosition, nameOf, othersPlay, RIICHI } from './game';
import { patternName } from '../ui/names';

const N = nameOf;
const P = patternName;

function lesson(id: string, title: string, minutes: number, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.4.${id}`, gameId: 'mahjong', stage: 'stage-4', title, minutes, start, steps };
}

/** The table at the start of a Riichi hand: you sit South (the dealer is on your left). */
const START = lessonPosition({ hand: '234m 678m 3p 5p 99p 2s 4s W N', drawn: 'N', style: 'riichi', options: RIICHI, dealer: 3, indicators: '9m', seed: 'riichi-start' });

/** Three winning hands to name. All simples, self-drawn, with a pung. */
const SIMPLES = lessonPosition({ hand: '234m 567p 888s 345s 66p', drawn: '6p', style: 'riichi', options: RIICHI, dealer: 3, indicators: 'N', seed: 'riichi-simples' });
/** A called Red dragon pung. */
const DRAGON = lessonPosition({
  hand: '234m 456p 789s 11s',
  drawn: '1s',
  melds: [[{ type: 'pung', tiles: 'RdRdRd', from: 1 }]],
  style: 'riichi',
  options: RIICHI,
  dealer: 3,
  indicators: 'N',
  seed: 'riichi-dragon',
});
/** Dots and North winds only, closed. */
const HALF_FLUSH = lessonPosition({ hand: '234p 345p 678p NNN 99p', drawn: '9p', style: 'riichi', options: RIICHI, dealer: 3, indicators: 'S', seed: 'riichi-flush' });

/**
 * Ready once the West wind goes, on the 4 or 7 bamboo, with runs only. The next three players
 * draw and throw harmless tiles, then you draw the 7 bamboo. The ura indicator is the 5 bamboo.
 */
const DECLARE = lessonPosition({ hand: '234m 678m 345p 56s 99s W', drawn: 'W', style: 'riichi', options: RIICHI, dealer: 3, indicators: 'N', under: '5s', front: 'Gd 1p E 7s', avoid: '4s 7s', seed: 'riichi-declare' });
const DECLARED = after(DECLARE, 'riichi W');
const DECLARE_REPLY = othersPlay(DECLARED);

/** Ready on the 3 or 6 dots once the North wind goes, with a 6 dots among your own throws. */
const FURITEN = lessonPosition({
  hand: '234m 678m 45p 345s 99s N',
  drawn: 'N',
  discards: ['6p W 1m'],
  style: 'riichi',
  options: RIICHI,
  dealer: 3,
  indicators: 'S',
  front: '3p Gd E 3p',
  avoid: '3p 6p',
  seed: 'riichi-furiten',
});
const FURITEN_REPLY = othersPlay(after(FURITEN, 'N'));

/** The indicator is the 9 characters; you hold two 1 characters and a red five. */
const DORA = lessonPosition({ hand: '11m 345m 406p 789s EE N', drawn: 'N', style: 'riichi', options: RIICHI, dealer: 3, indicators: '9m', seed: 'riichi-dora' });

/** All simples, closed, waiting on the 7 or 8 bamboo pairs; the player on your left throws an 8. */
const RON = lessonPosition({
  hand: '234m 567m 345p 77s 88s',
  style: 'riichi',
  options: RIICHI,
  dealer: 3,
  indicators: 'N',
  offer: { seat: 3, tile: '8s' },
  avoid: '7s 8s',
  seed: 'riichi-ron',
});

/**
 * The player across has declared riichi with the 2 characters. Of your tiles, only the 4 bamboo
 * is one they threw.
 */
const DEFENCE = lessonPosition({
  hand: '345m 6m 4p 5p 6p 7p 8p 4s 5s 6s 7s 3s',
  drawn: '3s',
  discards: ['W 1p 9m Gd', 'S 9s 1m E', 'N 1m 9p Wd 4s 2m', 'E 1s 8m Rd'],
  ready: [null, null, { at: 5 }, null],
  style: 'riichi',
  options: RIICHI,
  dealer: 3,
  indicators: 'S',
  seed: 'safety-riichi-defence',
});

export const RIICHI_LESSONS: readonly Lesson[] = [
  lesson('riichi-changes', 'What changes from Hong Kong', 4, START, [
    { kind: 'say', text: 'Riichi is the Japanese style. It uses the same tiles without flowers, {riichi:tiles} in all, and {riichi:red} of the fives are red: each red five is worth a little extra. Everyone starts with {riichi:start} points, and a full game is an East round and a South round.' },
    { kind: 'say', text: 'The biggest change: there is no faan minimum. Instead, a winning hand needs at least one yaku, a scoring pattern from a fixed list. Dora (lucky tiles) add value to a hand with a yaku, but are not yaku themselves. A hand is worth han, much like faan, and fu, a count of its parts; together they give the points.' },
    { kind: 'say', text: 'Two more new rules shape the play. With a closed hand that is ready you may declare riichi, staking {riichi:stake} points. And you can never win on another player’s throw of a tile that would complete your hand if you have thrown one yourself: that is furiten.' },
    {
      kind: 'askChoice',
      text: 'Which of these hands may win in Riichi?',
      options: [
        { text: 'A closed, complete hand with riichi declared', correct: true, why: 'Right: riichi is itself a yaku, worth {han:riichi} han.' },
        { text: 'A complete hand with a called chow and two dora, but no yaku', why: 'Dora are not yaku: a hand with none cannot win, however many dora it holds.' },
        { text: 'Any complete hand, as on a Hong Kong table with no minimum', why: 'Riichi always asks for at least one yaku.' },
      ],
    },
    {
      kind: 'askChoice',
      text: 'You have just called a chow. Which tile may you not throw straight away?',
      options: [
        { text: 'A tile that would just swap back the tile you took', correct: true, why: 'Right: throwing the same tile (or the other end of the run) at once is not allowed. It keeps calls honest.' },
        { text: 'Any tile of the same suit', why: 'Only the swap is forbidden: the tile you took, or the one at the run’s other end.' },
        { text: 'Any tile at all: you must wait a turn', why: 'You throw at once after a call, as in Hong Kong.' },
      ],
    },
  ]),
  lesson('riichi-yaku', 'The ten yaku you will meet most', 4, SIMPLES, [
    { kind: 'say', text: `How the hand is won. ${P('riichi')}: {han:riichi} han, closed hands only. ${P('menzen-tsumo')}: {han:menzen-tsumo} han for winning on your own draw with nothing called.` },
    { kind: 'say', text: `How it is built. ${P('tanyao')}: {han:tanyao} han, no ones, nines or honours anywhere. ${P('pinfu')}: {han:pinfu} han, closed: four runs, a pair that is not a dragon or a counting wind, and a two-sided wait. ${P('iipeikou')}: {han:iipeikou} han, closed: the same run twice. ${P('chiitoitsu')}: {han:chiitoitsu} han, seven different pairs.` },
    { kind: 'say', text: `Value pungs (yakuhai): {han:yakuhai-red} han for a pung of any dragon, your seat wind or the round’s wind, called or not. Bigger: ${P('sanshoku')}, {han:sanshoku} han closed and {han:open:sanshoku} called; ${P('honitsu')}, {han:honitsu} closed and {han:open:honitsu} called; ${P('toitoi')}, {han:toitoi} han.` },
    {
      kind: 'checkpoint',
      text: 'Name a yaku in each hand.',
      questions: [
        {
          kind: 'askChoice',
          text: 'A pung of 8 bamboo, three runs and a pair of 6 dots, all your own draws. Which yaku does it score?',
          options: [
            { text: P('tanyao'), correct: true, why: 'Right: every tile is a two to eight. It also scores menzen tsumo.' },
            { text: P('pinfu'), why: 'Pinfu needs four runs: this hand has a pung.' },
            { text: P('toitoi'), why: 'Toitoi needs four pungs: this hand has one.' },
          ],
        },
        {
          kind: 'askChoice',
          position: DRAGON,
          text: 'A called pung of Red dragons, three runs and a pair. Which yaku does it score?',
          options: [
            { text: P('yakuhai-red'), correct: true, why: 'Right: a dragon pung is a yaku even when called.' },
            { text: P('tanyao'), why: 'The 1 and 9 bamboo rule out all simples.' },
            { text: P('menzen-tsumo'), why: 'Menzen tsumo needs a closed hand, and the dragons were called.' },
          ],
        },
        {
          kind: 'askChoice',
          position: HALF_FLUSH,
          text: 'Only dots and North winds, nothing called. Which yaku does it score?',
          options: [
            { text: P('honitsu'), correct: true, why: 'Right: one suit with honours, {han:honitsu} han closed.' },
            { text: P('chinitsu'), why: 'The North winds are honours, so the flush is only half.' },
            { text: P('toitoi'), why: 'Three of its sets are runs.' },
          ],
        },
      ],
    },
    { kind: 'askMove', position: HALF_FLUSH, text: 'Win (tsumo), and read the sheet.', accept: ['win'], claim: 'legal', success: '{win:han} han: half flush and menzen tsumo.' },
  ]),
  lesson('riichi-declare', 'Riichi', 4, DECLARE, [
    { kind: 'say', text: 'Declare riichi when your hand is closed and ready: say it, throw your tile sideways, and put a {riichi:stake} point stick on the table. You need the points, and at least {riichi:min-left} tiles left in the wall.' },
    { kind: 'say', text: 'From then on your hand is locked: you throw each tile you draw unless it wins (a concealed kong is allowed only if it leaves your waits alone). In return riichi is a yaku worth {han:riichi} han; a win before your next throw adds ippatsu ({han:ippatsu}); and you count the ura dora, the tiles under the indicators.' },
    { kind: 'askMove', text: `Throw the ${N('W')} and you are ready on the 4 or 7 bamboo. Declare riichi with it.`, accept: ['riichi W'], claim: 'legal', reply: DECLARE_REPLY, success: 'Riichi. The stick is on the table; the next three players throw, and you draw.' },
    { kind: 'askNumber', text: `You drew the ${N('7s')}: a win straight away. Riichi, ippatsu, menzen tsumo, pinfu, and the ura indicator is the 5 bamboo. How many han?`, answer: 'win:han', success: 'Yes, {win:han} han: a mangan whatever the fu.' },
    { kind: 'askMove', text: 'Tsumo: win.', accept: ['win'], claim: 'legal', success: 'Everyone pays: the dealer twice what each of the others pays, and the riichi stick comes back to you.' },
  ]),
  lesson('riichi-furiten', 'Furiten', 4, FURITEN, [
    { kind: 'say', text: 'You may not win on a throw while any tile that would complete your hand lies among your own throws. Your hand is then furiten: you can still win by drawing the tile yourself.' },
    {
      kind: 'askChoice',
      text: `Throw the ${N('N')} and you are ready on the 3 or 6 dots. You threw a 6 dots earlier. If another player throws a 3 dots, can you win on it?`,
      options: [
        { text: 'No: the 6 dots in your throws makes the whole hand furiten', correct: true, why: 'Right: furiten covers every winning tile, not only the one you threw.' },
        { text: 'Yes: it was a 6 dots you threw, not a 3 dots', why: 'Furiten covers all your waits: one of them in your throws is enough.' },
        { text: 'Yes, but only with riichi', why: 'Riichi makes furiten stricter, never looser.' },
      ],
    },
    { kind: 'say', text: 'Two more kinds. If you let a winning tile go by, you are furiten until your next throw. After riichi, letting one go by makes you furiten for the rest of the hand.' },
    { kind: 'askMove', text: `Throw the ${N('N')}.`, accept: ['N'], claim: 'legal', reply: FURITEN_REPLY, success: 'The player on your right throws a 3 dots, and you may not take it. Then you draw.' },
    { kind: 'askMove', text: 'You drew the other 3 dots. Furiten never stops a self-drawn win: tsumo.', accept: ['win'], claim: 'legal', success: '{win:han} han: menzen tsumo and pinfu.' },
  ]),
  lesson('riichi-dora', 'Dora and red fives', 3, DORA, [
    { kind: 'say', text: 'The last {riichi:dead-wall} tiles of the wall are the dead wall. One of its tiles is turned up: the dora indicator. The dora is the next tile after it: the next number in its suit (after a nine comes the one), the next wind (East, South, West, North, then East), the next dragon (White, Green, Red, then White).' },
    { kind: 'say', text: 'Each dora you hold adds a han when you win, and so does each red five. A kong turns up another indicator; a riichi winner also turns the tiles under the indicators, the ura dora. None of these is a yaku.' },
    {
      kind: 'askChoice',
      text: 'The indicator is the 9 characters. Which tile is dora?',
      options: [
        { text: N('1m'), correct: true, why: 'Right: after the nine comes the one again.' },
        { text: N('9m'), why: 'The indicator points at the dora; it is not the dora itself.' },
        { text: N('8m'), why: 'The dora comes after the indicator, not before.' },
      ],
    },
    {
      kind: 'askChoice',
      text: 'And if the indicator were the North wind?',
      options: [
        { text: N('E'), correct: true, why: 'Right: the winds go round, East after North.' },
        { text: N('Wd'), why: 'Winds point to winds, dragons to dragons.' },
        { text: N('N'), why: 'The dora is the next wind, not the indicator.' },
      ],
    },
    { kind: 'askNumber', text: 'How many han of dora does your hand hold now, red five included?', answer: 'hand:dora:all', success: 'Yes, {hand:dora:all}: {hand:dora} for the dora and {hand:red} for the red five.' },
  ]),
  lesson('riichi-scoring', 'Han, fu and the payment table', 4, RON, [
    { kind: 'say', text: 'Fu: every hand starts at {fu:base}. A closed hand that wins on a throw adds {fu:closed-ron}; a self-drawn win adds {fu:self-drawn}. A pung of simples adds {fu:pung} when open, twice that when concealed, and twice again for ones, nines and honours; a kong is four times a pung. A pair of dragons or of a counting wind adds {fu:value-pair}, and so does a wait on one tile. Round up to the next ten. Seven pairs are always {fu:seven-pairs}.' },
    { kind: 'say', text: 'Points: each han doubles the value. With {fu:usual} fu, a win on a throw collects {ron:1:30} for one han, {ron:2:30} for two, {ron:3:30} for three and {ron:4:30} for four. From {band:mangan:han} han it is a mangan, {band:mangan:ron}, whatever the fu; then haneman ({band:haneman:han} han) {band:haneman:ron}, baiman ({band:baiman:han}) {band:baiman:ron}, sanbaiman ({band:sanbaiman:han}) {band:sanbaiman:ron}, and a yakuman {band:kazoe:ron}.' },
    { kind: 'say', text: 'The dealer collects half again: {pay:ron:dealer} times the base on a throw, against {pay:ron} times for the others. On a self-draw the dealer pays {pay:tsumo:dealer-pays} parts and the others {pay:tsumo:others-pay} each; when the dealer draws, everyone pays the dealer {pay:tsumo:dealer} parts. Every payment rounds up to a hundred, and each honba on the table adds {riichi:honba}.' },
    { kind: 'askNumber', text: 'The player on your left throws the 8 bamboo, completing a pung on a closed hand of simples. How many fu?', answer: 'win:fu', success: 'Yes: {fu:base}, {fu:closed-ron} for a closed win on a throw, {fu:pung} for the pung (open: you took its tile), and round up: {win:fu}.' },
    { kind: 'askNumber', text: 'Only tanyao and no dora: {win:han} han. How much does the thrower pay you?', answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Ron: win on it.', accept: ['win'], claim: 'legal', success: 'The sheet shows the han, the fu and the payment.' },
  ]),
  lesson('riichi-defence', 'Defence against a riichi', 4, DEFENCE, [
    { kind: 'say', text: 'Once a player declares riichi, their hand cannot change. Every tile they have thrown is safe against them: by furiten they cannot win on it. A tile someone else threw after the riichi, which they let go by, is just as safe.' },
    { kind: 'say', text: 'Next safest: suji (if they threw a four, a two-sided wait cannot be on the one or the seven of that suit) and honours that others have already thrown. Middle tiles nobody has thrown are the most dangerous. When your hand is far from ready, fold: throw your safest tile every turn.' },
    {
      kind: 'askChoice',
      text: 'They threw a 4 bamboo. Against a two-sided wait, which is safer?',
      options: [
        { text: N('1s'), correct: true, why: 'Right: a two-sided wait for the 1 bamboo is the 2 and 3 bamboo, which also wait on the 4 bamboo, and they threw that.' },
        { text: N('3s'), why: 'The 3 bamboo is not suji of the four: a wait on the 4 and 5 bamboo, or the 1 and 2 bamboo, would take it.' },
      ],
    },
    { kind: 'askMove', text: 'The player across has declared riichi. Your hand is far from ready. Throw your safest tile.', accept: ['4s'], wrong: { '5p': 'A middle tile nobody has thrown: the most dangerous kind.' }, claim: 'best', success: 'Right: the 4 bamboo. They threw it themselves, so it cannot win for them.' },
  ]),
];
