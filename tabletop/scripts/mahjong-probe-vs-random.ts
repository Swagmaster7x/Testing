/**
 * One game of a level (seats 0 and 2) against random play (seats 1 and 3), timed (not part of the
 * checks): how long a ladder's first rung takes per game, and how many hands and actions it has.
 *
 *   npx tsx scripts/mahjong-probe-vs-random.ts <style> <level> [seed]
 */
import { createRng } from '../src/core/rng';
import { decide } from '../src/games/mahjong/bots';
import type { MahjongConfig } from '../src/games/mahjong/rules';
import { mahjong, STYLES, viewOf } from '../src/games/mahjong/rules';

const [styleId = 'taiwanese', levelArg = '1', seed = 'probe'] = process.argv.slice(2);
const style = STYLES[styleId];
if (!style) throw new Error(`No style ${styleId}`);
const config: MahjongConfig = { style: styleId, options: style.defaults };
const level = Number(levelArg);
const started = Date.now();
let s = mahjong.setup(config, createRng(seed));
const rng = createRng(`${seed}/play`);
let actions = 0;
while (!s.over && actions < 200_000) {
  const seat = s.turn;
  const view = viewOf(s, seat);
  const action = seat % 2 === 0 ? decide(view, level, rng).action : rng.pick(view.options);
  s = mahjong.apply(s, action).state;
  actions++;
}
console.log(`${styleId} L${level} vs random: over ${s.over}, ${s.results.length} hands (${s.results.filter((r) => r.wins.length > 0).length} won), ${actions} actions, ${((Date.now() - started) / 1000).toFixed(1)} s, scores ${s.scores.join(' ')}`);
