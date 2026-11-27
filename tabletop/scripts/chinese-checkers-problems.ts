/**
 * Generates the Chinese Checkers problems (src/games/chinese-checkers/practice/problems.json) from
 * the CPU's own games, numbered seeds, so the file is the same every run. Every problem is proved by
 * the solvers as it is made, and again by the unit tests.
 *
 *   npx tsx scripts/chinese-checkers-problems.ts          120 of each kind
 *   npx tsx scripts/chinese-checkers-problems.ts 150      150 of each kind
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { generateProblems } from '../src/games/chinese-checkers/practice/generate';

const want = Number(process.argv[2] ?? 120);
const started = Date.now();
const { hops, race } = generateProblems(want, 600, (line) => process.stdout.write(`\r${line}      `));
process.stdout.write('\n');
const problems = [...hops, ...race];
const file = join(import.meta.dirname, '..', 'src', 'games', 'chinese-checkers', 'practice', 'problems.json');
writeFileSync(file, `${JSON.stringify({ problems }, null, 0).replace(/\],\[/g, '],\n[')}\n`);
console.log(`${hops.length} longest-hop problems and ${race.length} race endgames in ${((Date.now() - started) / 1000).toFixed(0)} s → ${file}`);
