/**
 * The Riichi scorer cross-checked against a second implementation, the `riichi` npm package
 * (MIT, pinned as a dev dependency, never shipped), on generated winning hands: closed and open,
 * self-drawn and on a discard, every seat and round wind, riichi and ippatsu, with a dora.
 *
 * The package has two known gaps in its fu: it never adds the two fu of an edge wait (penchan,
 * 1-2 waiting on 3 or 8-9 on 7), and it takes a called run with the winning tile's kind in its
 * middle for a closed wait. Every hand where the two scorers differ must be one of those, with the
 * same han and our fu exactly ten more (an edge wait) or ten fewer (the called run); on every
 * other hand han, fu (or the limit) and the points must agree.
 */
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { createRng } from '../../src/core/rng';
import { winShapes } from '../../src/games/mahjong/core/arrange';
import type { Meld, WinContext } from '../../src/games/mahjong/core/style';
import { tileId } from '../../src/games/mahjong/core/tiles';
import { buildComplete, completeKinds } from '../../src/games/mahjong/practice/build';
import { doraOf, payments, riichiScoreAny, RIICHI_DEFAULTS, waitKind } from '../../src/games/mahjong/styles/riichi';

interface RiichiResult {
  readonly isAgari: boolean;
  readonly yakuman: number;
  readonly han: number;
  readonly fu: number;
  readonly ten: number;
  readonly yaku: Record<string, string>;
}
const require = createRequire(import.meta.url);
const Riichi = require('riichi') as new (text: string) => { calc(): RiichiResult; disableAka(): void };

/** The package's tile notation: 1m-9m, 1p-9p, 1s-9s, 1z-7z (East South West North White Green Red). */
const z = (k: number): string => (k < 27 ? `${(k % 9) + 1}${'mps'[Math.floor(k / 9)] ?? ''}` : `${k - 26}z`);

interface Case {
  readonly ctx: WinContext;
  readonly text: string;
}

function generate(n: number, seed: string): Case[] {
  const rng = createRng(seed);
  const random = () => rng.next();
  const out: Case[] = [];
  while (out.length < n) {
    const c = buildComplete(random, { suit: random() < 0.2 ? Math.floor(random() * 3) : null, honour: random() * 0.3, pung: random() * 0.6 });
    if (!c) continue;
    const called = c.sets.filter((_, j) => j < 3 && random() < 0.25);
    const concealed = completeKinds({ sets: c.sets.filter((s) => !called.includes(s)), pair: c.pair });
    const win = concealed[Math.floor(random() * concealed.length)] ?? 0;
    const selfDrawn = random() < 0.5;
    const melds: Meld[] = called.map((s) => {
      const kinds = s.type === 'pung' ? [s.kind, s.kind, s.kind] : [s.kind, s.kind + 1, s.kind + 2];
      return { type: s.type, tiles: kinds.map((k, t) => tileId(k, 3 - t)), claimed: null, from: 3, concealed: false, added: false };
    });
    const ready = melds.length === 0 && random() < 0.5 ? 1 : 0;
    const oneShot = ready > 0 && random() < 0.2;
    const indicator = Math.floor(random() * 34);
    const seatWind = Math.floor(random() * 4);
    const prevailingWind = Math.floor(random() * 2);
    const ctx: WinContext = {
      seat: 0,
      tile: win,
      selfDrawn,
      from: selfDrawn ? null : 1,
      concealed,
      melds,
      bonus: [],
      seatWind,
      prevailingWind,
      dealer: seatWind === 0,
      lastTile: false,
      lastDiscard: false,
      kongs: 0,
      robbed: false,
      heavenly: false,
      earthly: false,
      firstDraw: false,
      tiles: [],
      indicators: [indicator],
      underIndicators: [],
      ready,
      oneShot,
    };
    const hand = [...concealed];
    hand.splice(hand.indexOf(win), 1);
    const meldText = melds.map((m) => `+${m.tiles.map((t) => z(kindOfCode(t))[0]).join('')}${z(kindOfCode(m.tiles[0] ?? ''))[1]}`).join('');
    const extra = `${ready ? 'r' : ''}${oneShot ? 'i' : ''}${prevailingWind + 1}${seatWind + 1}`;
    const text = `${hand.sort((a, b) => a - b).map(z).join('')}${selfDrawn ? z(win) : `+${z(win)}`}${meldText}+d${z(doraOf(indicator))}+${extra}`;
    out.push({ ctx, text });
  }
  return out;
}

function kindOfCode(id: string): number {
  const code = id.split('.')[0] ?? '';
  const honours = ['E', 'S', 'W', 'N', 'Wd', 'Gd', 'Rd'];
  const h = honours.indexOf(code);
  if (h >= 0) return 27 + h;
  return 'mps'.indexOf(code[1] ?? 'm') * 9 + Number(code[0]) - 1;
}

/** What the winner collects in all (no counters or sticks), as the package reports it. */
function collected(ctx: WinContext, base: number): number {
  const p = payments(base, ctx.dealer);
  if (!ctx.selfDrawn) return p.ron;
  return ctx.dealer ? 3 * p.tsumoOther : p.tsumoDealer + 2 * p.tsumoOther;
}

describe('the Riichi scorer against the riichi package', () => {
  it('agrees on han, fu and points on generated hands, except for the package’s missing edge-wait fu', () => {
    const cases = generate(1500, 'riichi-crosscheck');
    const options = { ...RIICHI_DEFAULTS, red: 0 };
    let same = 0;
    const different: string[] = [];
    for (const { ctx, text } of cases) {
      const ours = riichiScoreAny(ctx, options);
      const pkg = new Riichi(text);
      pkg.disableAka();
      const theirs = pkg.calc();
      const ourTen = ours && ours.lines.length > 0 ? collected(ctx, ours.base) : 0;
      const agree = theirs.ten === ourTen && (theirs.yakuman > 0 ? (ours?.yakuman ?? 0) === theirs.yakuman : theirs.han === (ours?.total ?? 0)) && (theirs.yakuman > 0 || theirs.han === 0 || theirs.fu === ours?.fu || (ours?.band !== undefined && ours.band === bandOf(theirs)));
      if (agree) {
        same++;
        continue;
      }
      // The known differences, each with the same han: an edge wait the package misses (ten fu
      // more for us), or a called run it takes for the wait because the winning tile's kind sits
      // in its middle (ten fu fewer for us).
      const edge = winShapes(ctx, { sevenPairs: true, thirteenOrphans: true }, 4).some((shape) => waitKind(shape, ctx.tile) === 'penchan');
      const calledMiddle = ctx.melds.some((m) => m.type === 'chow' && kindOfCode(m.tiles[1] ?? '') === ctx.tile);
      const gap = (ours?.fu ?? 0) - theirs.fu;
      different.push(text);
      const explained = ours?.total === theirs.han && ((edge && gap === 10) || (calledMiddle && gap === -10));
      expect(explained, `${text}: ours ${JSON.stringify(ours?.lines)} ${ours?.fu} fu, theirs ${JSON.stringify(theirs.yaku)} ${theirs.fu} fu`).toBe(true);
    }
    expect(same / cases.length).toBeGreaterThan(0.98);
    if (process.env.CROSSCHECK_REPORT) console.log(`riichi cross-check: ${same} of ${cases.length} agree; ${different.length} differ, each explained`);
    expect(same + different.length).toBe(cases.length);
  });
});

function bandOf(r: RiichiResult): string | undefined {
  return r.han >= 13 ? 'kazoe' : r.han >= 11 ? 'sanbaiman' : r.han >= 8 ? 'baiman' : r.han >= 6 ? 'haneman' : r.han >= 5 ? 'mangan' : undefined;
}
