/**
 * Riichi drills (PLAN.md 2.6, milestone 11), on the lesson runner like the Hong Kong ones:
 *
 * - **name the yaku**: a winning hand built toward a common yaku; pick the one it scores;
 * - **han and fu**: count the han (dora included) and the fu of a winning hand, then what it
 *   collects, each checked by the Riichi scorer;
 * - **safe tile against a riichi**: one player has declared riichi; throw the tile the safe-tile
 *   ranking puts clearly safest (one they threw themselves, when you hold one).
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import type { DrillDef } from '../../practice';
import type { MahjongState, MeldSpec } from '../rules';
import { viewOf } from '../rules';
import type { Kind } from '../core/tiles';
import { codeOf, kindOf, PLAYING_KINDS } from '../core/tiles';
import { picture, readThreats, safetyRanking } from '../strategy';
import type { LessonSpec } from '../learn/game';
import { lessonState, mahjongLessonGame, RIICHI, winOnOffer } from '../learn/game';
import { safetyProblems } from '../learn/verify';
import { kindName, patternName } from '../ui/names';
import type { Knobs, Random } from './build';
import { buildComplete, calledMeld, codes, completeKinds, pick, playerPhrase, randomTiles, shuffle } from './build';

function lesson(id: string, title: string, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.drill.${id}`, gameId: 'mahjong', stage: 'table', title, minutes: 1, start, steps };
}

const seedOf = (random: Random, prefix = 'drill') => `${prefix}/${Math.floor(random() * 1e9)}`;

function tryState(spec: LessonSpec): MahjongState | null {
  try {
    return lessonState(spec);
  } catch {
    return null;
  }
}

/** Yaku the drill builds toward, with the knobs that make them likely and whether sets may be called. */
const TARGETS: Readonly<Record<string, { readonly knobs: (random: Random) => Knobs; readonly open: boolean }>> = {
  tanyao: { knobs: () => ({ suit: null, honour: 0, pung: 0.3 }), open: true },
  pinfu: { knobs: () => ({ suit: null, honour: 0, pung: 0 }), open: false },
  'yakuhai-white': { knobs: () => ({ suit: null, honour: 0.4, pung: 0.3 }), open: true },
  'yakuhai-green': { knobs: () => ({ suit: null, honour: 0.4, pung: 0.3 }), open: true },
  'yakuhai-red': { knobs: () => ({ suit: null, honour: 0.4, pung: 0.3 }), open: true },
  honitsu: { knobs: (random) => ({ suit: Math.floor(random() * 3), honour: 0.35, pung: 0.4 }), open: true },
  toitoi: { knobs: () => ({ suit: null, honour: 0.3, pung: 1 }), open: true },
  'menzen-tsumo': { knobs: () => ({ suit: null, honour: 0.2, pung: 0.3 }), open: false },
};

/** Yaku a hand might be thought to score, for the wrong answers. */
const NAMEABLE = ['tanyao', 'pinfu', 'yakuhai-white', 'yakuhai-green', 'yakuhai-red', 'honitsu', 'chinitsu', 'toitoi', 'menzen-tsumo', 'iipeikou', 'chanta'] as const;

const DORA_LINES = new Set(['dora', 'aka-dora', 'ura-dora']);

export interface RiichiWin {
  readonly state: MahjongState;
  /** The yaku it scores (dora left out). */
  readonly yaku: readonly string[];
  readonly selfDrawn: boolean;
}

/** A hand you can win now under the common online rules, below a mangan, scoring `target` when given. */
export function riichiWinningHand(random: Random, target: string | null, belowMangan: boolean): RiichiWin {
  for (;;) {
    const goal = target ?? pick(random, Object.keys(TARGETS));
    const spec = TARGETS[goal] ?? TARGETS.tanyao;
    if (!spec) continue;
    const c = buildComplete(random, spec.knobs(random));
    if (!c) continue;
    const called = spec.open ? c.sets.filter((_, i) => i < 2 && random() < 0.35) : [];
    const melds: MeldSpec[] = called.map((s) => calledMeld(random, s));
    const concealed = completeKinds({ sets: c.sets.filter((s) => !called.includes(s)), pair: c.pair });
    const win = pick(random, concealed);
    const selfDrawn = goal === 'menzen-tsumo' || random() < 0.5;
    const hand = [...concealed];
    if (!selfDrawn) hand.splice(hand.indexOf(win), 1);
    const state = tryState({
      hand: codes(hand),
      ...(selfDrawn ? { drawn: codeOf(win) } : { offer: { seat: 1 + Math.floor(random() * 3), tile: codeOf(win) } }),
      melds: [melds],
      style: 'riichi',
      options: RIICHI,
      dealer: Math.floor(random() * 4),
      round: Math.floor(random() * 2),
      avoid: codeOf(win),
      turns: 3 + Math.floor(random() * 5),
      seed: seedOf(random),
    });
    if (!state) continue;
    const offer = winOnOffer(state);
    if (!offer || offer.score.limit || (belowMangan && offer.score.band !== undefined)) continue;
    const yaku = offer.score.lines.map((l) => l.id).filter((id) => !DORA_LINES.has(id));
    if (yaku.length === 0 || (target && !yaku.includes(target))) continue;
    if (!mahjongLessonGame.moves(state).includes('win')) continue;
    return { state, yaku, selfDrawn };
  }
}

/** How the hand is being won, where you sit, and the dora indicator, in words. */
function situation(h: RiichiWin): string {
  const s = h.state;
  const how = h.selfDrawn && s.drawn ? `You drew the ${kindName(kindOf(s.drawn))}, and your hand is complete.` : `${playerPhrase(s.claim?.from ?? 1)} threw the {claim:tile}, and it completes your hand.`;
  const seat = s.dealer === 0 ? 'You are the dealer (East)' : 'You sit {wind:seat}';
  return `${how} ${seat} in the {wind:round} round, and the dora indicator is the {indicator:names}.`;
}

function yakuDrill(random: Random): Lesson {
  const target = pick(random, Object.keys(TARGETS));
  const h = riichiWinningHand(random, target, false);
  const wrong = shuffle(
    random,
    NAMEABLE.filter((id) => !h.yaku.includes(id)),
  ).slice(0, 2);
  const options = shuffle(random, [
    { text: patternName(target), correct: true, why: `Right: ${patternName(target)} is worth {win:line:${target}} han here, {win:han} han for the whole hand.` },
    ...wrong.map((id) => ({ text: patternName(id), why: `This hand does not score ${patternName(id)}. It does score ${patternName(target)}.` })),
  ]);
  return lesson('yaku', 'Name the yaku', mahjongLessonGame.notation(h.state), [
    { kind: 'askChoice', text: `${situation(h)} Which of these yaku does it score?`, options },
    { kind: 'askMove', text: 'Win, and read every line on the sheet.', accept: ['win'], claim: 'legal', success: '{win:han} han in all.' },
  ]);
}

function hanFuDrill(random: Random): Lesson {
  const h = riichiWinningHand(random, null, true);
  const pays = h.selfDrawn ? 'Self-drawn: the dealer pays twice the base, each other player once (the dealer’s own win: twice from each).' : 'On a throw: the thrower pays four times the base (six for the dealer’s win).';
  return lesson('han-fu', 'Han and fu', mahjongLessonGame.notation(h.state), [
    { kind: 'askNumber', text: `${situation(h)} How many han is it worth, dora included?`, answer: 'win:han', success: 'Yes, {win:han} han.' },
    { kind: 'askNumber', text: 'How many fu? Start from the base, add the parts, and round up to the next ten.', answer: 'win:fu', success: 'Yes, {win:fu} fu.' },
    { kind: 'askNumber', text: `{win:han} han and {win:fu} fu make a base of {win:base}. ${pays} Each payment rounds up to a hundred. How much do you collect in all?`, answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Win, and check your count against the sheet.', accept: ['win'], claim: 'legal', success: 'The sheet agrees: {win:han} han, {win:fu} fu, {win:total} in all.' },
  ]);
}

function riichiSafeDrill(random: Random): Lesson {
  for (;;) {
    const threat = 1 + Math.floor(random() * 3);
    const used = new Array<number>(PLAYING_KINDS).fill(0);
    // Their throws: a few early honours and terminals, then anything; the riichi throw is the last.
    const discards = [0, 1, 2, 3].map((seat) => randomTiles(random, seat === threat ? 6 + Math.floor(random() * 5) : 4 + Math.floor(random() * 6), used));
    const thrown = discards[threat] ?? [];
    // Your hand: one tile they threw, the rest random.
    const safe = pick(random, thrown);
    if ((used[safe] ?? 0) >= 4) continue;
    used[safe] = (used[safe] ?? 0) + 1;
    const hand: Kind[] = [safe, ...randomTiles(random, 13, used)];
    const drawn = hand[hand.length - 1] ?? safe;
    const ready = [0, 1, 2, 3].map((seat) => (seat === threat ? { at: thrown.length - 1 } : null));
    const state = tryState({ hand: codes(hand), drawn: codeOf(drawn), discards: discards.map(codes), ready, style: 'riichi', options: RIICHI, dealer: Math.floor(random() * 4), seed: seedOf(random, 'safety') });
    if (!state || mahjongLessonGame.moves(state).includes('win')) continue;
    const p = picture(viewOf(state, 0));
    if ((readThreats(p.view).find((t) => t.seat === threat)?.level ?? 0) < 1) continue;
    const ranking = safetyRanking(p);
    const safest = ranking[0]?.kind;
    if (safest === undefined || safetyProblems(state, [codeOf(safest)]).length > 0) continue;
    const worst = ranking[ranking.length - 1]?.kind ?? safest;
    const why = thrown.includes(safest) ? `They threw the ${kindName(safest)} themselves, so by furiten it cannot win for them.` : `Nothing they could be waiting on is safer.`;
    return lesson('riichi-safe', 'Safe tile against a riichi', mahjongLessonGame.notation(state), [
      {
        kind: 'askMove',
        text: `${playerPhrase(threat)} has declared riichi, and you decide to fold. Throw your safest tile.`,
        accept: [codeOf(safest)],
        wrong: worst !== safest ? { [codeOf(worst)]: `That is your most dangerous tile against them. ${why}` } : {},
        claim: 'best',
        success: `Right: the ${kindName(safest)}. ${why}`,
      },
    ]);
  }
}

export const RIICHI_DRILLS: readonly DrillDef[] = [
  { id: 'drill-mahjong-yaku', make: yakuDrill },
  { id: 'drill-mahjong-han-fu', make: hanFuDrill },
  { id: 'drill-mahjong-riichi-safe', make: riichiSafeDrill },
];
