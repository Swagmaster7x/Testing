/**
 * npm run ladder: the slow bot ladders. Over fixed seeds each level must beat the one below it
 * by a clear margin, and level 1 must beat random play. Exits with an error if any rung fails.
 *
 *   npm run ladder                 every game
 *   npm run ladder -- noughts 400  one game, 400 games per rung
 */
import { runLadder } from '../src/ai/ladder';
import { LADDERS } from '../src/games/ladders';

const [only, gamesArg] = process.argv.slice(2);
const games = Number(gamesArg ?? 200);
const ids = only ? [only] : Object.keys(LADDERS);
let failed = false;

for (const id of ids) {
  const ladder = LADDERS[id];
  if (!ladder) {
    console.error(`No ladder for "${id}". Known: ${Object.keys(LADDERS).join(', ')}`);
    process.exit(2);
  }
  const started = Date.now();
  const rungs = runLadder(ladder.spec, games, `ladder:${id}`, ladder.random);
  console.log(`\n${id}: ${games} games per rung, seats alternate, margin ${ladder.spec.margin}`);
  for (const r of rungs) {
    const { wins, draws, losses, score } = r.result;
    console.log(
      `  ${r.higher.padEnd(4)} vs ${r.lower.padEnd(7)} W ${String(wins).padStart(4)}  D ${String(draws).padStart(4)}  L ${String(losses).padStart(4)}  score ${score.toFixed(3)}  ${r.passed ? 'ok' : 'FAIL'}`,
    );
    if (!r.passed) failed = true;
  }
  console.log(`  ${((Date.now() - started) / 1000).toFixed(1)} s`);
}

if (failed) {
  console.error('\nA ladder rung failed.');
  process.exit(1);
}
console.log('\nAll ladder rungs passed.');
