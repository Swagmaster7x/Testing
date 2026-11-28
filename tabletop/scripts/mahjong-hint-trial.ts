/**
 * A trial of one style's CPU hints (not part of the checks): level A against level B over paired
 * games, as the ladder plays them, with the style's hints changed for the run.
 *
 *   RISK=1 POINTS=3 npx tsx scripts/mahjong-hint-trial.ts <style> <levelA> <levelB> <games> [seed]
 *
 * RISK sets `riskScale`; POINTS multiplies the point table (the scale expected points are on).
 */
import { runMatch } from '../src/ai/ladder';
import { decide } from '../src/games/mahjong/bots';
import { mahjongSideScore } from '../src/games/ladders';
import type { MahjongConfig } from '../src/games/mahjong/rules';
import { mahjong, STYLES } from '../src/games/mahjong/rules';
import type { Style } from '../src/games/mahjong/core/style';

const [styleId = 'taiwanese', aArg = '5', bArg = '4', gamesArg = '60', seed = 'trial'] = process.argv.slice(2);
const style = STYLES[styleId] as Style;
const risk = process.env.RISK ? Number(process.env.RISK) : null;
const scale = process.env.POINTS ? Number(process.env.POINTS) : 1;
const original = style.hints.bind(style);
(style as { hints: Style['hints'] }).hints = (seat, o) => {
  const h = original(seat, o);
  return { ...h, ...(risk !== null ? { riskScale: risk } : {}), points: h.points.map((p) => p * scale) };
};
const config: MahjongConfig = { style: styleId, options: style.defaults };
const bot = (level: number) => ({ name: `L${level}`, choose: (view: Parameters<typeof decide>[0], _seat: number, rng: Parameters<typeof decide>[2]) => decide(view, level, rng).action });
const started = Date.now();
const result = await runMatch(mahjong, config, bot(Number(aArg)), bot(Number(bArg)), Number(gamesArg), `${seed}:${styleId}`, true, mahjongSideScore);
console.log(`${styleId} L${aArg} vs L${bArg} RISK=${risk ?? 'style'} POINTS=${scale}: W ${result.wins} D ${result.draws} L ${result.losses} score ${result.score.toFixed(3)} (${((Date.now() - started) / 1000).toFixed(0)} s)`);
