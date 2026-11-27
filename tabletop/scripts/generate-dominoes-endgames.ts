/**
 * npm run generate:dominoes: endgame problems for dominoes practice (PLAN.md 2.6), proved by exact
 * search with every hand face up ("tiles up", as printed domino problems are). Partnership hands
 * under Puerto Rico rules are played by level-3 bots until few tiles are left; a position becomes a
 * problem when the student has exactly one best play (by at least MARGIN points) at every decision
 * of the line, with every other player answering perfectly. Writes
 * src/games/dominoes/practice/endgames.json.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createRng } from '../src/core/rng';
import { chooseAction, tagsFor } from '../src/games/dominoes/bots';
import type { DominoesAction, DominoesState } from '../src/games/dominoes/rules';
import { actionText, dominoes, PUERTO_RICO_500, sideOf, tilePips, viewOf } from '../src/games/dominoes/rules';
import { cloneSim, DRAW, fromState, moveOf, PASS, simApply, solveMargin, tileIndex } from '../src/games/dominoes/sim';

const OUT = join(import.meta.dirname, '..', 'src', 'games', 'dominoes', 'practice', 'endgames.json');
const WANT = Number(process.argv[2] ?? 150);
const MARGIN = 6;
/** Tiles left in all hands when the problem starts. */
const SIZES = [9, 10, 11, 12, 13];

interface Problem {
  id: string;
  position: string;
  setup: null;
  line: string[];
  rating: number;
  themes: string[];
  openHand: true;
}

const code = (a: DominoesAction): number => (a.type === 'pass' ? PASS : a.type === 'draw' ? DRAW : moveOf(tileIndex(a.tile), a.end === 'right'));

/** Every legal action's exact margin for the side to move. */
function scoreAll(s: DominoesState): { action: DominoesAction; value: number }[] {
  const seat = s.turn;
  const side = sideOf(seat, 4);
  const sim = fromState(s);
  return dominoes.legal(s, seat).map((action) => {
    const child = cloneSim(sim);
    simApply(child, code(action));
    return { action, value: solveMargin(child, side) };
  });
}

function lineFrom(start: DominoesState): { line: string[]; decisions: number; margins: number[]; firstTags: string[] } | null {
  const student = start.turn;
  let s = start;
  const line: string[] = [];
  const margins: number[] = [];
  let firstTags: string[] = [];
  for (let guard = 0; guard < 40 && !s.over && s.results.length === 0; guard++) {
    const scored = scoreAll(s).sort((a, b) => b.value - a.value);
    const top = scored[0];
    if (!top) return null;
    if (s.turn === student && scored.length > 1) {
      const second = scored[1]?.value ?? -Infinity;
      if (top.value - second < MARGIN) return null;
      if (margins.length === 0) firstTags = tagsFor(viewOf(s, student), top.action);
      margins.push(top.value - second);
    }
    line.push(actionText(top.action));
    s = dominoes.apply(s, top.action).state;
  }
  // The line ends on the student's last real decision (a forced move after it would only be tapping).
  let last = -1;
  let t = start;
  line.forEach((m, i) => {
    if (t.turn === student && dominoes.legal(t, student).length > 1) last = i;
    t = dominoes.apply(t, dominoes.codec.action.fromText(m)).state;
  });
  return margins.length > 0 ? { line: line.slice(0, last + 1), decisions: margins.length, margins, firstTags } : null;
}

const config = { ...PUERTO_RICO_500, target: 0 };
const problems: Problem[] = [];
const seen = new Set<string>();
for (let i = 0; problems.length < WANT && i < WANT * 60; i++) {
  const rng = createRng(`dominoes-endgames/${i}`);
  let s = dominoes.setup(config, rng.fork('deal'));
  // Later hands, so no early bonus clouds the counting.
  s = { ...s, handNo: 5 };
  const size = SIZES[i % SIZES.length] ?? 11;
  while (!s.over && s.hands.reduce((n, h) => n + h.length, 0) > size) {
    s = dominoes.apply(s, chooseAction(viewOf(s, s.turn), 3, rng.fork(`m${s.moves.length}`))).state;
  }
  if (s.over || s.results.length > 0) continue;
  const legal = dominoes.legal(s, s.turn);
  if (legal.length < 2 || legal.some((a) => a.type !== 'play')) continue;
  const key = dominoes.codec.state.toText(s);
  if (seen.has(key)) continue;
  seen.add(key);
  const found = lineFrom(s);
  if (!found) continue;
  const first = dominoes.codec.action.fromText(found.line[0] as string);
  // A problem is worth setting only if the obvious "lay your heaviest tile" is wrong, or there is more than one decision.
  const heaviest = [...legal].sort((a, b) => (b.type === 'play' ? tilePips(b.tile) : 0) - (a.type === 'play' ? tilePips(a.tile) : 0))[0];
  const naiveWrong = heaviest !== undefined && actionText(heaviest) !== actionText(first);
  if (!naiveWrong && found.decisions < 2) continue;
  const themes = [...new Set([...found.firstTags.map((t) => t.replace(/^dom-/, '')), found.decisions > 1 ? 'long' : 'one-move'])];
  const rating = Math.round(700 + 120 * legal.length + 160 * (found.decisions - 1) + (naiveWrong ? 150 : 0) - Math.min(150, (found.margins[0] ?? 0) * 2));
  problems.push({ id: `dom-${String(problems.length + 1).padStart(3, '0')}`, position: key, setup: null, line: found.line, rating, themes, openHand: true });
  if (problems.length % 10 === 0) console.log(`${problems.length} problems from ${i + 1} deals`);
}

problems.sort((a, b) => a.rating - b.rating);
writeFileSync(OUT, `${JSON.stringify({ source: 'generated by scripts/generate-dominoes-endgames.ts; every line proved by exact search with every hand known', margin: MARGIN, problems }, null, 1)}\n`);
console.log(`Wrote ${problems.length} problems to ${OUT}`);
