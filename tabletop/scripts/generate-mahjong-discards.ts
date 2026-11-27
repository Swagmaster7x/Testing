/**
 * npm run generate:mahjong: rated "what would you discard" problems for Mahjong practice (PLAN.md
 * 2.6). Hong Kong hands are played by level-3 bots; when it is your seat's turn to throw, the
 * position becomes a problem if the coach's efficiency calculator proves the best throw by a
 * clear margin (practice/index.ts, provedDiscards). Each position is stored as a lesson spec
 * that names every hand, meld, discard and bonus tile, so the app rebuilds it exactly where it
 * matters; the wall's order is not part of a one-move problem. Writes
 * src/games/mahjong/practice/discards.json.
 *
 * Difficulty: tempting alternatives (as fast and nearly as many useful tiles), answers that
 * only counting the tiles in sight decides, and distance from ready all raise the rating.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRng } from '../src/core/rng';
import { decide } from '../src/games/mahjong/bots';
import type { MahjongState, MeldSpec } from '../src/games/mahjong/rules';
import { mahjong, viewOf } from '../src/games/mahjong/rules';
import type { Kind } from '../src/games/mahjong/core/tiles';
import { codeOf, isHonour, kindOf, rankOf, suitOf } from '../src/games/mahjong/core/tiles';
import { acceptance } from '../src/games/mahjong/core/shanten';
import type { LessonSpec } from '../src/games/mahjong/learn/game';
import { HK, lessonState } from '../src/games/mahjong/learn/game';
import { HK_DEFAULTS } from '../src/games/mahjong/styles/hong-kong';
import { provedDiscards } from '../src/games/mahjong/practice';
import { evaluateDiscards, picture } from '../src/games/mahjong/strategy';

const OUT = join(import.meta.dirname, '..', 'src', 'games', 'mahjong', 'practice', 'discards.json');
const WANT = Number(process.argv[2] ?? 160);
const LEVEL = 3;

interface Entry {
  id: string;
  spec: LessonSpec;
  best: string[];
  rating: number;
  themes: string[];
}

const codes = (ids: readonly string[]): string => ids.map((t) => codeOf(kindOf(t))).join(' ');

/** The position as a lesson spec that names everything a one-move problem can see or depend on. */
function specOf(s: MahjongState, id: string): LessonSpec | null {
  const melds: MeldSpec[][] = [];
  for (const list of s.melds) {
    const out: MeldSpec[] = [];
    for (const m of list) {
      if (m.type === 'kong') return null;
      out.push({ type: m.type, tiles: codes(m.tiles), ...(m.from !== null ? { from: m.from } : {}) });
    }
    melds.push(out);
  }
  return {
    hand: codes(s.hands[0] ?? []),
    ...(s.drawn ? { drawn: codeOf(kindOf(s.drawn)) } : {}),
    hands: [null, codes(s.hands[1] ?? []), codes(s.hands[2] ?? []), codes(s.hands[3] ?? [])],
    melds,
    discards: s.discards.map((list) => codes(list.filter((d) => !d.claimed).map((d) => d.tile))),
    bonus: s.bonus.map((list) => codes(list)),
    options: HK,
    dealer: s.dealer,
    round: s.round,
    seed: id,
  };
}

/** The best throws when every copy not in your hand counts, as if nothing on the table were seen. */
function bestIgnoringTable(s: MahjongState): Kind[] {
  const p = picture(viewOf(s, 0));
  const c = [...p.counts];
  const out: { kind: Kind; shanten: number; count: number }[] = [];
  for (let k = 0; k < 34; k++) {
    if ((c[k] ?? 0) === 0) continue;
    c[k] = (c[k] ?? 0) - 1;
    const a = acceptance(c, p.melds.length, p.shapes);
    out.push({ kind: k, shanten: a.shanten, count: a.count });
    c[k] = (c[k] ?? 0) + 1;
  }
  const fastest = Math.min(...out.map((x) => x.shanten));
  const most = Math.max(...out.filter((x) => x.shanten === fastest).map((x) => x.count));
  return out.filter((x) => x.shanten === fastest && x.count === most).map((x) => x.kind);
}

/** A lone tile: an honour you hold one of, or a suit tile with nothing within two of it. */
function isLone(counts: readonly number[], k: Kind): boolean {
  if ((counts[k] ?? 0) !== 1) return false;
  if (isHonour(k)) return true;
  const r = rankOf(k);
  for (const d of [-2, -1, 1, 2]) {
    const rr = r + d;
    if (rr >= 1 && rr <= 9 && (counts[suitOf(k) * 9 + rr - 1] ?? 0) > 0) return false;
  }
  return true;
}

function entryFor(s: MahjongState, id: string): Entry | null {
  const best = provedDiscards(s);
  if (!best) return null;
  const spec = specOf(s, id);
  if (!spec) return null;
  // The rebuilt position must judge the same way.
  const rebuilt = lessonState(spec);
  const again = provedDiscards(rebuilt);
  if (!again || again.join() !== best.join()) return null;
  const p = picture(viewOf(s, 0));
  const evals = evaluateDiscards(p);
  const fastest = Math.min(...evals.map((e) => e.shanten));
  const most = Math.max(...evals.filter((e) => e.shanten === fastest).map((e) => e.accept));
  const close = evals.filter((e) => !best.includes(e.kind) && e.shanten === fastest && e.accept >= most - 6).length;
  const naive = bestIgnoringTable(s);
  const counted = naive.join() !== best.join();
  const themes = ['mj-discard'];
  if (fastest === 0) themes.push('mj-ready');
  if (counted) themes.push('mj-count');
  themes.push(best.every((k) => isLone(p.counts, k)) ? 'mj-lone' : 'mj-shape');
  const rating = Math.round(700 + 110 * Math.min(4, close) + (counted ? 180 : 0) + 60 * Math.min(3, fastest) + (themes.includes('mj-shape') ? 120 : 0));
  return { id, spec, best: best.map(codeOf), rating, themes };
}

const out: Entry[] = [];
let hand = 0;
const started = Date.now();
while (out.length < WANT) {
  const rng = createRng(`mahjong-discards/${hand++}`);
  let s: MahjongState = mahjong.setup({ style: 'hong-kong', options: { ...HK_DEFAULTS, ...HK } }, rng.fork('deal'));
  let turns = 0;
  let taken = 0;
  for (let guard = 0; guard < 400 && !s.over && s.phase !== 'scored'; guard++) {
    const seat = mahjong.turn(s);
    if (seat === null) break;
    if (seat === 0 && s.phase === 'act' && (s.hands[0] ?? []).length % 3 === 2) {
      turns++;
      // A few positions per hand, not too early, never two in a row.
      if (turns >= 3 && taken < 2 && rng.next() < 0.35 && s.melds.every((list) => list.every((m) => m.type !== 'kong'))) {
        const e = entryFor(s, `mj-discard-${String(out.length + 1).padStart(3, '0')}`);
        if (e) {
          out.push(e);
          taken++;
        }
      }
    }
    const d = decide(viewOf(s, seat), LEVEL, rng.fork(`m${guard}`));
    s = mahjong.apply(s, d.action).state;
  }
}
// Easiest first, as the practice screen lists them.
out.sort((a, b) => a.rating - b.rating || a.id.localeCompare(b.id));
writeFileSync(OUT, `${JSON.stringify({ problems: out }, null, 1)}\n`);
const by = (t: string) => out.filter((e) => e.themes.includes(t)).length;
console.log(`${out.length} problems from ${hand} hands in ${((Date.now() - started) / 1000).toFixed(1)} s: ready ${by('mj-ready')}, count ${by('mj-count')}, lone ${by('mj-lone')}, shape ${by('mj-shape')}; ratings ${out[0]?.rating}–${out[out.length - 1]?.rating}.`);
