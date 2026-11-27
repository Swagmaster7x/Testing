/**
 * npm run ladder: the slow bot ladders. Over fixed seeds each level must beat the one below it
 * by a clear margin, and level 1 must beat random play. Exits with an error if any rung fails.
 *
 *   npm run ladder                 every game
 *   npm run ladder -- chess 30     one game, 30 games per rung
 */
import { runLadder } from '../src/ai/ladder';
import { buildLadders } from '../src/games/ladders';
import { nodeEngine } from '../tests/harness/stockfish-node';

const [only, gamesArg] = process.argv.slice(2);
const ladders = buildLadders({ chessEngine: nodeEngine });
const ids = only ? [only] : Object.keys(ladders);
let failed = false;

for (const id of ids) {
  const ladder = ladders[id];
  if (!ladder) {
    console.error(`No ladder for "${id}". Known: ${Object.keys(ladders).join(', ')}`);
    process.exit(2);
  }
  const games = Number(gamesArg ?? ladder.games);
  // LADDER_LEVELS=3,4 runs only those levels (random play, then 3 against random, then 4 against 3).
  const only = process.env.LADDER_LEVELS?.split(',').map(Number);
  const spec = only ? { ...ladder.spec, levels: ladder.spec.levels.filter((l) => only.includes(l)) } : ladder.spec;
  const started = Date.now();
  console.log(`\n${id}: ${games} games per rung, seats alternate, margin ${ladder.spec.margin}`);
  await runLadder(spec, games, `ladder:${id}`, ladder.random, (r) => {
    const { wins, draws, losses, score } = r.result;
    console.log(
      `  ${r.higher.padEnd(4)} vs ${r.lower.padEnd(7)} W ${String(wins).padStart(4)}  D ${String(draws).padStart(4)}  L ${String(losses).padStart(4)}  score ${score.toFixed(3)}  ${r.passed ? 'ok' : 'FAIL'}`,
    );
    if (!r.passed) failed = true;
  });
  ladder.close?.();
  console.log(`  ${((Date.now() - started) / 1000).toFixed(1)} s`);
}

if (failed) {
  console.error('\nA ladder rung failed.');
  process.exit(1);
}
console.log('\nAll ladder rungs passed.');
process.exit(0);
