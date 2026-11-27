/**
 * The shogi handicap ladder, measured: a strong CPU level gives each handicap (as White, moving
 * first, the way handicap games are played) to a weaker level, over fixed seeds. The giver's
 * score should fall as the handicap grows, which is what makes handicaps honest extra levels.
 *
 *   npx tsx scripts/shogi-handicaps.ts [giver=7] [receiver=5] [games=10] [handicaps=lance,bishop,rook,two]
 */
import type { BotChoice } from '../src/ai/bot';
import { playGame } from '../src/ai/ladder';
import { outcomePoints } from '../src/core/contract';
import type { Rng } from '../src/core/rng';
import { shogiBots } from '../src/games/shogi/bots';
import type { HandicapId } from '../src/games/shogi/presets';
import { LADDER_MOVE_LIMIT } from '../src/games/shogi/presets';
import type { ShogiAction, ShogiState } from '../src/games/shogi/rules';
import { shogi } from '../src/games/shogi/rules';

const giver = Number(process.argv[2] ?? 7);
const receiver = Number(process.argv[3] ?? 5);
const games = Number(process.argv[4] ?? 10);
const handicaps = (process.argv[5] ?? 'even,lance,bishop,rook,two').split(',') as HandicapId[];

const bot = (level: number) => ({
  name: `L${level}`,
  choose: (view: ShogiState, seat: number, rng: Rng) => (shogiBots.choose({ view, seat, level, rng }) as BotChoice<ShogiAction>).action,
});

for (const handicap of handicaps) {
  let total = 0;
  for (let i = 0; i < games; i++) {
    // Seat 1 (White) gives the handicap and moves first; in an even game seats alternate.
    const giverSeat = handicap === 'even' ? i % 2 : 1;
    const bySeat = giverSeat === 1 ? [bot(receiver), bot(giver)] : [bot(giver), bot(receiver)];
    const outcome = await playGame(shogi, { handicap, moveLimit: LADDER_MOVE_LIMIT }, bySeat, `handicap:${handicap}:${i}`);
    total += outcomePoints(outcome, giverSeat);
  }
  console.log(`L${giver} giving ${handicap.padEnd(10)} vs L${receiver}: score ${(total / games).toFixed(3)} over ${games} games`);
}
