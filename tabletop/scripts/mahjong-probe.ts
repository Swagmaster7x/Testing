/**
 * A quick look at how the CPU plays a style (not part of the checks): games among one level, with
 * how many hands are won, by whom, the slowest decision and the average value of a win.
 *
 *   npx tsx scripts/mahjong-probe.ts <style> <level> <games> [length]
 */
import { createRng } from '../src/core/rng';
import { decide } from '../src/games/mahjong/bots';
import type { MahjongConfig } from '../src/games/mahjong/rules';
import { mahjong, STYLES, viewOf } from '../src/games/mahjong/rules';

const [styleId = 'chinese-official', levelArg = '4', gamesArg = '4', length = 'east'] = process.argv.slice(2);
const style = STYLES[styleId];
if (!style) throw new Error(`No style ${styleId}`);
const config: MahjongConfig = { style: styleId, options: { ...style.defaults, length } };
const level = Number(levelArg);
let hands = 0;
let won = 0;
let slowest = 0;
let decisions = 0;
let total = 0;
const values: number[] = [];
const started = Date.now();
for (let g = 0; g < Number(gamesArg); g++) {
  let s = mahjong.setup(config, createRng(`probe/${g}`));
  const rng = createRng(`probe-play/${g}`);
  for (let i = 0; i < 20000 && !s.over; i++) {
    const t0 = Date.now();
    const d = decide(viewOf(s, s.turn), level, rng);
    const dt = Date.now() - t0;
    total += dt;
    decisions++;
    slowest = Math.max(slowest, dt);
    s = mahjong.apply(s, d.action).state;
  }
  hands += s.results.length;
  for (const r of s.results) {
    if (r.wins.length > 0) won++;
    for (const w of r.wins) values.push(w.score.total);
  }
}
const avg = values.reduce((a, b) => a + b, 0) / Math.max(1, values.length);
console.log(`${styleId} level ${level}: ${hands} hands, ${won} won (${((100 * won) / Math.max(1, hands)).toFixed(0)}%), average win ${avg.toFixed(1)}, decisions ${decisions}, mean ${(total / decisions).toFixed(1)} ms, slowest ${slowest} ms, ${((Date.now() - started) / 1000).toFixed(1)} s`);
