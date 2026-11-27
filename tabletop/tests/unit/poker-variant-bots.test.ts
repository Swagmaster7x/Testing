/** The CPU in Omaha, Draw and Stud: standard draws, and legal play at every level through whole sessions. */
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { holdemBots } from '../../src/games/holdem/bots';
import type { Card } from '../../src/games/holdem/cards';
import type { HoldemConfig } from '../../src/games/holdem/rules';
import { checkCards, checkChips, holdem, PRESETS, viewOf } from '../../src/games/holdem/rules';
import { drawStrategy } from '../../src/games/holdem/variant-bots';

const h = (text: string) => text.split(' ') as Card[];
const sorted = (cards: readonly Card[]) => [...cards].sort();

describe('the standard draw', () => {
  it('stands pat on a made straight or better', () => {
    expect(drawStrategy(h('9c Td Jh Qs Kc'), 3)).toEqual([]);
    expect(drawStrategy(h('2h 7h 9h Jh Ah'), 3)).toEqual([]);
  });
  it('keeps a pair and draws three, trips and draws two, two pair and draws one', () => {
    expect(sorted(drawStrategy(h('Ks Kd 7c 4h 2s'), 3))).toEqual(sorted(h('7c 4h 2s')));
    expect(sorted(drawStrategy(h('Jc Jd Js 8c 5d'), 3))).toEqual(sorted(h('8c 5d')));
    expect(drawStrategy(h('Jc Jd 8s 8c 5d'), 3)).toEqual(h('5d'));
  });
  it('draws one to four of a flush or an open-ended straight', () => {
    expect(drawStrategy(h('Ah Qh 9h 3h 2c'), 3)).toEqual(h('2c'));
    expect(drawStrategy(h('5c 6d 7h 8s Kc'), 3)).toEqual(h('Kc'));
  });
  it('otherwise keeps the two highest cards, never drawing more than allowed', () => {
    expect(sorted(drawStrategy(h('Ac Kd 7h 4s 2c'), 3))).toEqual(sorted(h('7h 4s 2c')));
    expect(drawStrategy(h('Ac Kd 7h 4s 2c'), 2)).toHaveLength(2);
  });
});

describe('the variant CPU', () => {
  for (const name of ['pot-limit-omaha', 'omaha-high-low', 'five-card-draw', 'seven-card-stud']) {
    it(`plays ${name} legally at levels 1 and 6 to the end of a session`, () => {
      const config = { ...(PRESETS[name] as HoldemConfig), hands: 4 };
      let s = holdem.setup(config, createRng(`bots-${name}`));
      const rng = createRng(name);
      for (let ply = 0; ply < 2000 && !s.over; ply++) {
        const seat = s.toAct as number;
        const level = seat % 2 === 0 ? 1 : 6;
        const choice = holdemBots.choose({ view: viewOf(s, seat), seat, level, rng }) as { action: Parameters<typeof holdem.apply>[1] };
        const text = holdem.codec.action.toText(choice.action);
        expect(holdem.legal(s, seat).map((a) => holdem.codec.action.toText(a))).toContain(text);
        s = holdem.apply(s, choice.action).state;
        checkCards(s);
        checkChips(s);
      }
      expect(s.over).toBe(true);
    }, 60_000);
  }
});
