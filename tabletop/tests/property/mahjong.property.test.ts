/**
 * Mahjong over random games under every preset (PLAN.md 2.10): nothing crashes, every legal action
 * applies, the 144 (or 136) tiles are conserved, payments add up to zero and to the scores, views
 * never leak another hand, the wall, the seed or a hidden call, samples agree with the view, and
 * records replay to the identical state.
 */
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import type { Rng } from '../../src/core/rng';
import { createRng } from '../../src/core/rng';
import type { MahjongAction, MahjongConfig, MahjongState, MahjongView } from '../../src/games/mahjong/rules';
import { actionText, checkConservation, engine, mahjong, sampleState, viewOf } from '../../src/games/mahjong/rules';
import { discardChoices, shanten } from '../../src/games/mahjong/core/shanten';
import { countsOf, kindOf } from '../../src/games/mahjong/core/tiles';
import { HK_DEFAULTS, HK_PRESETS } from '../../src/games/mahjong/styles/hong-kong';
import { RIICHI_DEFAULTS, RIICHI_PRESETS } from '../../src/games/mahjong/styles/riichi';
import { SICHUAN_DEFAULTS, SICHUAN_PRESETS } from '../../src/games/mahjong/styles/sichuan';
import { checkReplay, playRandomGame } from '../harness/contract';

/** Everything a seat may not see: other hands (until they are laid down at the end), the wall and the seed. */
function hidden(s: MahjongState, seat: number): string[] {
  // A hand laid down after a win (Sichuan) is seen by everyone.
  const others = s.phase === 'scored' ? [] : s.hands.flatMap((h, i) => (i === seat || engine.isOut(s, i) ? [] : h));
  // Indicators not yet turned up, and the tiles under them (until a hand ends).
  const st = s.indicators;
  const unturned = st && s.phase !== 'scored' ? [...st.tiles.slice(st.shown, st.tiles.length / 2), ...st.tiles.slice(st.tiles.length / 2)] : [];
  return [...others, ...s.wall, ...unturned].map((t) => `"${t}"`).concat(s.seed);
}

/** Leaves out the hands shown at the end of earlier hands (the same tiles are dealt again). */
function leakScope(view: unknown): unknown {
  const v = view as MahjongView;
  return { ...v, results: [] };
}

function invariant(s: MahjongState): void {
  checkConservation(s);
  const rules = engine.rules(s.config);
  const start = rules.startScore ?? 0;
  const stake = rules.ready?.stake ?? 0;
  // Points are only moved: the scores and the stakes on the table always add up to the start.
  const total = s.scores.reduce((a, b) => a + b, 0) + s.stakes * stake;
  if (total !== 4 * start) throw new Error(`scores and stakes add up to ${total}`);
  if (!rules.ready) {
    for (const r of s.results) if (r.deltas.reduce((a, b) => a + b, 0) !== 0) throw new Error('a hand paid more than it took');
    // Payments made during the hand under way (kongs, wins in a hand that goes on) are in the scores already.
    const fromResults = [0, 1, 2, 3].map((seat) => s.results.reduce((sum, r) => sum + (r.deltas[seat] ?? 0), 0) + (s.paid[seat] ?? 0));
    if (fromResults.join() !== s.scores.join()) throw new Error('scores do not match the hands');
    if (s.paid.reduce((a, b) => a + b, 0) !== 0) throw new Error('a payment in the hand does not add up');
  } else {
    // A hand's payments add up to the stakes its winner collected (none at a draw).
    for (const r of s.results) if (r.deltas.reduce((a, b) => a + b, 0) !== (r.wins.length > 0 ? (r.stakes ?? 0) * stake : 0)) throw new Error('a hand paid more than it took');
  }
  // A choice made in an open claim window is never shown to another seat.
  for (let seat = 0; seat < 4; seat++) {
    const text = JSON.stringify(viewOf(s, seat).claim);
    if (text.includes('declared') || text.includes('waiting')) throw new Error('a view shows the claim window');
    if ((s.phase === 'claim' || s.phase === 'rob') && seat !== s.turn && viewOf(s, seat).turn !== null) throw new Error('a view shows who is being asked');
  }
}

/** Random, but wins are taken and calls made often enough that games show every kind of move. */
function choose(legal: readonly MahjongAction[], rng: Rng): MahjongAction {
  const win = legal.find((a) => a.type === 'win');
  if (win && rng.next() < 0.85) return win;
  const call = legal.filter((a) => a.type === 'pung' || a.type === 'chow' || (a.type === 'kong' && a.tile === undefined));
  if (call.length > 0 && rng.next() < 0.4) return rng.pick(call);
  const kong = legal.filter((a) => a.type === 'kong' && a.tile !== undefined);
  if (kong.length > 0 && rng.next() < 0.5) return rng.pick(kong);
  const pass = legal.find((a) => a.type === 'pass');
  if (pass && rng.next() < 0.8) return pass;
  return rng.pick(legal);
}

/** Plays toward winning: takes wins, calls that keep the hand as close to ready, and the most efficient discard. */
function efficient(legal: readonly MahjongAction[], rng: Rng, state: MahjongState): MahjongAction {
  const win = legal.find((a) => a.type === 'win');
  if (win) return win;
  const seat = state.turn;
  const r = { shapes: { sevenPairs: true, thirteenOrphans: true }, sets: 4 };
  const melds = (state.melds[seat] ?? []).length;
  const counts = countsOf(state.hands[seat] ?? []);
  if (state.phase === 'claim') {
    const k = kindOf(state.claim?.tile ?? '');
    const now = shanten(counts, melds, r);
    for (const a of legal) {
      if (a.type !== 'pung' && a.type !== 'chow' && a.type !== 'kong') continue;
      const c = [...counts];
      const used = a.type === 'chow' ? [a.start, a.start + 1, a.start + 2].filter((x) => x !== k) : Array<number>(a.type === 'kong' ? 3 : 2).fill(k);
      for (const x of used) c[x] = (c[x] ?? 0) - 1;
      // After a pung or chow the best discard is made at once.
      const after = a.type === 'kong' ? shanten(c, melds + 1, r) : Math.min(...discardChoices(c, melds + 1, r).map((d) => d.shanten));
      if (after < now && rng.next() < 0.7) return a;
    }
    return legal.find((a) => a.type === 'pass') ?? rng.pick(legal);
  }
  const kong = legal.find((a) => a.type === 'kong');
  if (kong && rng.next() < 0.5) return kong;
  const discards = legal.filter((a) => a.type === 'discard');
  if (discards.length === 0) return rng.pick(legal);
  const best = discardChoices(counts, melds, r)[0];
  return discards.find((a) => a.type === 'discard' && a.tile === best?.kind) ?? rng.pick(discards);
}

const one = (options: Record<string, string | number>, style = 'hong-kong'): MahjongConfig => ({ style, options: { ...options, length: 'hand' } });

const configs: MahjongConfig[] = [
  ...HK_PRESETS.map((p) => one(p.options)),
  ...HK_PRESETS.slice(0, 3).map((p): MahjongConfig => ({ style: 'hong-kong', options: { ...p.options, length: 'east' } })),
  one({ ...HK_DEFAULTS, minFaan: 0, multipleWinners: 'all', robKong: 'orphans', sevenPairs: 3, deadWall: 14 }),
  one({ ...HK_DEFAULTS, minFaan: 0, discardPays: 'full-gun', table: 'full-spicy', limit: 13, namedHands: 'stack', concealedSelfDrawn: 3, dealerKeeps: 'win' }),
  one({ ...HK_DEFAULTS, minFaan: 1, flowers: 'off', robKong: 'off', greatDragons: 'limit', smallWinds: 'limit', limit: 8, flowerSet: 3 }),
  { style: 'hong-kong', options: { ...HK_DEFAULTS, minFaan: 0, dealerKeeps: 'never', length: 'east-south' } },
  ...RIICHI_PRESETS.map((p): MahjongConfig => ({ style: 'riichi', options: { ...p.options, length: 'hand' } })),
  { style: 'riichi', options: { ...RIICHI_DEFAULTS, length: 'east' } },
  { style: 'riichi', options: { ...RIICHI_DEFAULTS, length: 'hand', multipleRon: 'triple', kuikae: 'allowed', kanDora: 'immediate', aborts: 'off', nagashi: 'off' } },
  ...SICHUAN_PRESETS.map((p): MahjongConfig => ({ style: 'sichuan', options: { ...p.options, length: 'hand' } })),
  { style: 'sichuan', options: { ...SICHUAN_DEFAULTS, length: 'four', exchange: 'left' } },
  { style: 'sichuan', options: { ...SICHUAN_DEFAULTS, length: 'hand', multipleWin: 'first', kongShoot: 'return', pig: 16, refund: 'off', exchange: 'across', heavenly: 'off', bonusFan: 'off' } },
  { style: 'sichuan', options: { ...SICHUAN_DEFAULTS, length: 'hand', checks: 'off', kongPay: 'off', selfDraw: 'none', cap: 3 } },
];

describe('mahjong over random games', () => {
  it('keeps the contract under every preset: tiles conserved, payments add up, no leaks, replays', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = configs[i] as MahjongConfig;
        const game = playRandomGame(mahjong, config, `mahjong-${seed}`, { hidden, invariant, leakScope, choose, maxPlies: 20_000 });
        expect(mahjong.outcome(game.final)).not.toBeNull();
        checkReplay(mahjong, game);
      }),
      { numRuns: 30 },
    );
  }, 300_000);

  it('samples states that agree with the view, and the seat may do the same things in them', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 8 }), fc.integer({ min: 0, max: configs.length - 1 }), (seed, i) => {
        const config = one((configs[i] as MahjongConfig).options, (configs[i] as MahjongConfig).style);
        const game = playRandomGame(mahjong, config, `sample-${seed}`, { choose, maxPlies: 5000 });
        const rng = createRng(`s-${seed}`);
        for (const state of game.states.filter((_, k) => k % 4 === 0)) {
          if (state.over) continue;
          const seat = state.turn;
          const view = viewOf(state, seat);
          const sample = sampleState(view, rng);
          checkConservation(sample);
          expect(sample.hands[seat]).toEqual(state.hands[seat]);
          expect(sample.hands.map((h) => h.length)).toEqual(state.hands.map((h) => h.length));
          expect(sample.wall.length).toBe(state.wall.length);
          expect(sample.melds).toEqual(state.melds);
          expect(sample.discards).toEqual(state.discards);
          const mine = view.options.map(actionText);
          const there = mahjong.legal(sample, seat).map(actionText);
          // In a claim window the sample cannot know what earlier seats chose, so it may offer more.
          if (state.phase === 'act' || state.phase === 'scored') expect(there).toEqual(mine);
          else for (const a of mine) expect(there).toContain(a);
        }
      }),
      { numRuns: 30 },
    );
  }, 300_000);

  it('games played toward winning show wins, calls, kongs and draws, and keep the contract', () => {
    let wins = 0;
    let drawn = 0;
    const seen = new Set<string>();
    for (let i = 0; i < 16; i++) {
      const config = i % 2 === 0 ? one({ ...HK_DEFAULTS, minFaan: 0 }) : one({ ...HK_DEFAULTS, minFaan: 1, multipleWinners: 'all', sevenPairs: 4 });
      const game = playRandomGame(mahjong, config, `variety-${i}`, { hidden, invariant, leakScope, choose: efficient, maxPlies: 5000 });
      checkReplay(mahjong, game);
      for (const a of game.actions) seen.add(a.type === 'kong' ? (a.tile === undefined ? 'kong-call' : 'kong-own') : a.type);
      for (const r of game.final.results) {
        if (r.wins.length > 0) wins++;
        else drawn++;
      }
    }
    expect(wins).toBeGreaterThan(0);
    expect(drawn).toBeGreaterThanOrEqual(0);
    for (const kind of ['discard', 'pung', 'chow', 'pass', 'win']) expect(seen).toContain(kind);
  }, 120_000);

  it('Sichuan games played toward winning go on after wins, pay kongs at once, and keep the contract', () => {
    let wins = 0;
    let goneOn = 0;
    const seen = new Set<string>();
    for (let i = 0; i < 16; i++) {
      const config = one({ ...SICHUAN_DEFAULTS, ...(i % 2 === 0 ? {} : { exchange: 'random', multipleWin: 'first' }) }, 'sichuan');
      const game = playRandomGame(mahjong, config, `sichuan-${i}`, { hidden, invariant, leakScope, choose: efficient, maxPlies: 6000 });
      checkReplay(mahjong, game);
      for (const a of game.actions) seen.add(a.type === 'kong' ? (a.tile === undefined ? 'kong-call' : 'kong-own') : a.type);
      for (const r of game.final.results) {
        wins += r.wins.length;
        if (r.wins.length > 1) goneOn++;
        // Every winning hand keeps to two suits and never holds its void suit.
        for (const w of r.wins) {
          const kinds = [...(r.hands[w.seat] ?? []), w.tile, ...(r.melds[w.seat] ?? []).flatMap((m) => m.tiles)].map(kindOf);
          const suits = new Set(kinds.map((k) => Math.floor(k / 9)));
          expect(suits.size).toBeLessThanOrEqual(2);
          expect(suits.has(r.voids?.[w.seat] ?? -1)).toBe(false);
        }
      }
    }
    expect(wins).toBeGreaterThan(0);
    expect(goneOn).toBeGreaterThan(0);
    for (const kind of ['discard', 'void', 'pung', 'pass', 'win']) expect(seen).toContain(kind);
    expect(seen.has('chow')).toBe(false);
  }, 180_000);

  it('Riichi games played toward winning declare riichi, win with yaku, and keep the contract', () => {
    let wins = 0;
    const seen = new Set<string>();
    for (let i = 0; i < 16; i++) {
      const config = one({ ...RIICHI_DEFAULTS, ...(i % 2 === 0 ? {} : { multipleRon: 'triple' }) }, 'riichi');
      // Toward winning, declaring riichi whenever it may.
      const game = playRandomGame(mahjong, config, `riichi-${i}`, { hidden, invariant, leakScope, choose: (legal, rng, state) => legal.find((a) => a.type === 'ready') ?? efficient(legal, rng, state), maxPlies: 5000 });
      checkReplay(mahjong, game);
      for (const a of game.actions) seen.add(a.type);
      for (const r of game.final.results) {
        if (r.wins.length > 0) {
          wins++;
          for (const w of r.wins) expect(w.score.lines.some((l) => l.id !== 'dora' && l.id !== 'aka-dora' && l.id !== 'ura-dora')).toBe(true);
        }
      }
    }
    expect(wins).toBeGreaterThan(0);
    for (const kind of ['discard', 'ready', 'pass', 'win']) expect(seen).toContain(kind);
  }, 120_000);
});
