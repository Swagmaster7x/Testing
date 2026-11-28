/**
 * The American drill (milestone 14c), on the lesson runner like the other drills: a winning hand
 * from the practice card, now and then with jokers and an exposure. Find it on the card, then work
 * out what everyone pays; both are checked by the American scorer and the table's payments.
 */
import type { Lesson, LessonStep } from '../../../teach/lesson';
import type { DrillDef } from '../../practice';
import type { MahjongState, MeldSpec } from '../rules';
import type { Kind } from '../core/tiles';
import { codeOf, FLOWER_1, JOKER, kindOf } from '../core/tiles';
import type { LessonSpec } from '../learn/game';
import { AMERICAN, lessonState, mahjongLessonGame, winOnOffer } from '../learn/game';
import { variants } from '../american/card';
import { PRACTICE } from '../styles/american';
import { kindName } from '../ui/names';
import type { Random } from './build';
import { pick, playerPhrase, shuffle } from './build';

function lesson(id: string, title: string, start: string, steps: LessonStep[]): Lesson {
  return { id: `mahjong.drill.${id}`, gameId: 'mahjong', stage: 'table', title, minutes: 1, start, steps };
}

function tryState(spec: LessonSpec): MahjongState | null {
  try {
    return lessonState(spec);
  } catch {
    return null;
  }
}

const label = (h: (typeof PRACTICE.hands)[number]) => `${h.section}: ${h.text}`;

export interface AmericanWin {
  readonly state: MahjongState;
  readonly handId: string;
  readonly selfDrawn: boolean;
}

/** A hand from the practice card you can win now: natural tiles, a few jokers in its sets, perhaps a set exposed. */
export function americanWinningHand(random: Random): AmericanWin {
  for (;;) {
    const hand = pick(random, PRACTICE.hands);
    const v = pick(random, variants(hand));
    if (!v) continue;
    const flowers = shuffle(
      random,
      Array.from({ length: 8 }, (_, i) => FLOWER_1 + i),
    );
    let jokers = 0;
    const groups: Kind[][] = v.groups.map((g) => {
      const tiles: Kind[] = [];
      for (let i = 0; i < g.size; i++) {
        // Sets take a joker now and then; a quint or sextet always needs one past the fourth tile.
        const joker = g.flex && (i >= 4 || (i > 0 && random() < 0.12)) && jokers < 8;
        if (joker) {
          jokers++;
          tiles.push(JOKER);
        } else tiles.push(g.kind === FLOWER_1 ? (flowers.pop() ?? FLOWER_1) : g.kind);
      }
      return tiles;
    });
    // An exposed hand may show one of its sets.
    const exposed = !hand.concealed && random() < 0.4 ? groups.findIndex((g, i) => (v.groups[i]?.flex ?? false) && g.length >= 3) : -1;
    const melds: MeldSpec[] =
      exposed >= 0
        ? [{ type: (['pung', 'kong', 'quint', 'sextet'] as const)[(groups[exposed]?.length ?? 3) - 3] ?? 'pung', tiles: (groups[exposed] ?? []).map(codeOf).join(' '), from: 1 + Math.floor(random() * 3) }]
        : [];
    const concealed = groups.filter((_, i) => i !== exposed).flat();
    const naturals = concealed.filter((k) => k !== JOKER);
    const win = pick(random, naturals);
    if (win === undefined) continue;
    const selfDrawn = random() < 0.5;
    const held = [...concealed];
    if (!selfDrawn) held.splice(held.indexOf(win), 1);
    const state = tryState({
      hand: held.map(codeOf).join(' '),
      ...(selfDrawn ? { drawn: codeOf(win) } : { offer: { seat: 1 + Math.floor(random() * 3), tile: codeOf(win) } }),
      melds: [melds],
      style: 'american',
      options: AMERICAN,
      dealer: Math.floor(random() * 4),
      avoid: `${codeOf(win)} J`,
      turns: 2 + Math.floor(random() * 4),
      seed: `american/${Math.floor(random() * 1e9)}`,
    });
    if (!state) continue;
    const offer = winOnOffer(state);
    if (!offer || !mahjongLessonGame.moves(state).includes('win')) continue;
    // The card hand it scores as (the best one, when it fits two).
    const id = PRACTICE.hands.find((h) => label(h) === offer.score.lines[0]?.label)?.id;
    if (!id) continue;
    return { state, handId: id, selfDrawn };
  }
}

function payDrill(random: Random): Lesson {
  const h = americanWinningHand(random);
  const s = h.state;
  const right = PRACTICE.hands.find((x) => x.id === h.handId) as (typeof PRACTICE.hands)[number];
  const others = shuffle(
    random,
    PRACTICE.hands.filter((x) => x.id !== h.handId),
  ).slice(0, 2);
  const how = h.selfDrawn && s.drawn ? `You drew the ${kindName(kindOf(s.drawn))}, and your hand is complete.` : `${playerPhrase(s.claim?.from ?? 1)} threw the {claim:tile}, and it completes your hand.`;
  const pays = h.selfDrawn ? 'You picked it yourself: each of the three pays twice the value.' : 'On a throw: the thrower pays twice the value, the other two once each.';
  return lesson('american-pay', 'American: what does it pay?', mahjongLessonGame.notation(s), [
    {
      kind: 'askChoice',
      text: `${how} Which hand on the practice card is it?`,
      options: shuffle(random, [
        { text: label(right), correct: true, why: 'Right: the groups match, jokers only in sets of three or more.' },
        ...others.map((o) => ({ text: label(o), why: `That hand needs other groups. This one is ${label(right)}.` })),
      ]),
    },
    { kind: 'askNumber', text: `It is worth {win:faan} points (a hand with no jokers counts double). ${pays} How much do you collect in all?`, answer: 'win:total', success: 'Yes, {win:total}.' },
    { kind: 'askMove', text: 'Mah Jongg: win, and check the sheet.', accept: ['win'], claim: 'legal', success: 'The sheet agrees: {win:total} in all.' },
  ]);
}

export const AMERICAN_DRILLS: readonly DrillDef[] = [{ id: 'drill-mahjong-american-pay', make: payDrill }];
