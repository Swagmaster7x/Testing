/**
 * npm run problems:shogi — generates the shogi mate problems (PLAN.md 2.6) from the engine's own
 * games. Positions come from self-play between CPU levels (seeded, so the run repeats); every
 * position where the engine sees a large advantage is searched for a mate by checks (tsume) in
 * one, three or five plies. A problem is kept only when the mate is proven, its length is the
 * shortest, and the attacker's move is the only one that works at every turn before the last.
 *
 *   npx tsx scripts/shogi-problems.ts [perKind=150] [minutes=40] [firstGame] [outFile]
 * Writes src/games/shogi/practice/problems.json (or outFile; runs with different first games can
 * go in parallel, then be merged by running again with MERGE=file1,file2).
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import type { BotChoice } from '../src/ai/bot';
import { createRng } from '../src/core/rng';
import { capturedOf, isDrop, isPromotion, moveTo, parseSfen } from '../src/games/shogi/core';
import { searchState, shogiBots } from '../src/games/shogi/bots';
import { MateSolver } from '../src/games/shogi/mate';
import { canonicalOf } from '../src/games/shogi/notation';
import type { HandicapId } from '../src/games/shogi/presets';
import { LADDER_MOVE_LIMIT } from '../src/games/shogi/presets';
import type { ShogiAction, ShogiState } from '../src/games/shogi/rules';
import { canonicalAction, shogi } from '../src/games/shogi/rules';

const perKind = Number(process.argv[2] ?? 150);
const minutes = Number(process.argv[3] ?? 40);
const deadline = Date.now() + minutes * 60_000;
const out = process.argv[5] ?? join(import.meta.dirname, '..', 'src', 'games', 'shogi', 'practice', 'problems.json');

interface Generated {
  readonly id: string;
  readonly position: string;
  readonly setup: string;
  readonly line: readonly string[];
  readonly rating: number;
  readonly themes: readonly string[];
}

const found: Record<number, Generated[]> = { 1: [], 3: [], 5: [] };
const seen = new Set<string>();
// A later run tops up the file: it keeps what is there and plays new games after the last one.
let firstGame = 0;
if (existsSync(out)) {
  const old = JSON.parse(readFileSync(out, 'utf8')) as { games: number; problems: Generated[] };
  firstGame = old.games;
  for (const problem of old.problems) {
    const plies = problem.line.length;
    found[plies]?.push(problem);
    const after = shogi.apply(shogi.codec.state.fromText(problem.position), shogi.codec.action.fromText(problem.setup, shogi.codec.state.fromText(problem.position))).state;
    seen.add(parseSfen(after.sfen).key());
  }
}
const HANDICAP_STARTS: readonly HandicapId[] = ['even', 'even', 'even', 'lance', 'bishop', 'rook', 'two'];

function full(): boolean {
  return found[1]!.length >= perKind && found[3]!.length >= perKind && found[5]!.length >= perKind;
}

/** Difficulty on the rating scale: longer mates, more tempting checks, quiet sacrifices are harder. */
function rating(plies: number, checks: number, sacrifice: boolean, drop: boolean): number {
  const base = plies === 1 ? 650 : plies === 3 ? 1050 : 1450;
  return Math.round(base + Math.min(checks, 20) * 12 + (sacrifice ? 120 : 0) + (drop ? 30 : 0));
}

function consider(before: ShogiState, setup: string, after: ShogiState, game: number): void {
  if (after.result) return;
  const p = parseSfen(after.sfen);
  const key = p.key();
  if (seen.has(key)) return;
  seen.add(key);
  const solver = new MateSolver(p, 600_000);
  let plies: number | null;
  try {
    plies = solver.shortest(5);
  } catch {
    return;
  }
  if (plies === null || found[plies]!.length >= perKind) return;
  const main = solver.mainLine(plies);
  if (!main || !main.unique || main.line.length !== plies) return;
  // A mate in one must have exactly one mating move.
  if (plies === 1 && solver.mateMoves(1).length !== 1) return;
  const first = main.line[0]!;
  const checks = solver.checks().length;
  // A sacrifice: the first move lands where the defender can take it.
  p.make(first);
  const sacrifice = p.attacked(moveTo(first), p.side) && capturedOf(first) === 0;
  p.unmake(first);
  const themes = [`shogi-mate${plies}`];
  if (isDrop(first)) themes.push('shogi-drop');
  if (isPromotion(first)) themes.push('shogi-promotion');
  if (sacrifice) themes.push('shogi-sacrifice');
  found[plies]!.push({
    id: `shogi:m${plies}-${game}-${found[plies]!.length}`,
    position: before.sfen,
    setup,
    line: main.line.map((m) => canonicalOf(p.geo, m)),
    rating: rating(plies, checks, sacrifice, isDrop(first)),
    themes,
  });
  console.log(`mate in ${plies}: ${found[1]!.length} / ${found[3]!.length} / ${found[5]!.length}  (${after.sfen})`);
}

for (const extra of (process.env.MERGE ?? '').split(',').filter(Boolean)) {
  const more = JSON.parse(readFileSync(extra, 'utf8')) as { problems: Generated[] };
  for (const problem of more.problems) {
    const after = shogi.apply(shogi.codec.state.fromText(problem.position), shogi.codec.action.fromText(problem.setup, shogi.codec.state.fromText(problem.position))).state;
    const key = parseSfen(after.sfen).key();
    if (seen.has(key)) continue;
    seen.add(key);
    found[problem.line.length]?.push({ ...problem, id: `${problem.id}-x` });
  }
}
let game = process.argv[4] ? Number(process.argv[4]) : firstGame;
while (!full() && Date.now() < deadline) {
  game++;
  const rng = createRng(`shogi-problems/${game}`);
  const handicap = HANDICAP_STARTS[game % HANDICAP_STARTS.length]!;
  let state = shogi.setup({ moveLimit: LADDER_MOVE_LIMIT, handicap }, rng);
  // Mixed strengths make decisive games with mating attacks.
  const levels = [3 + rng.int(3), 3 + rng.int(3)];
  let ply = 0;
  while (shogi.turn(state) !== null && Date.now() < deadline) {
    const seat = shogi.turn(state) ?? 0;
    const level = levels[seat]!;
    const choice = shogiBots.choose({ view: state, seat, level, rng: rng.fork(`ply${ply}`) }) as BotChoice<ShogiAction>;
    const action = choice.action;
    const before = state;
    state = shogi.apply(state, action).state;
    ply++;
    if (ply < 20 || action.type === 'declare' || state.result) continue;
    // Look for mates only where the side to move is doing well.
    const { result } = searchState(state, { nodes: 4_000 });
    if (result.score >= 900) consider(before, canonicalAction(action), state, game);
  }
}

const problems = [...found[1]!, ...found[3]!, ...found[5]!];
writeFileSync(out, `${JSON.stringify({ generated: new Date().toISOString().slice(0, 10), games: game, problems }, null, 0)}\n`);
console.log(`Wrote ${problems.length} problems (${found[1]!.length} / ${found[3]!.length} / ${found[5]!.length}) from ${game} games to ${out}`);
