/**
 * Chinese Checkers practice (PLAN.md 2.6): two sets of problems generated from the CPU's games and
 * proved by the solvers (generate.ts, written to problems.json by
 * scripts/chinese-checkers-problems.ts): the longest hop, and race endgames. Plus two drills on the
 * lesson runner: count the race (rows to go), and count every hole one marble can reach.
 */
import type { Lesson } from '../../../teach/lesson';
import type { Problem } from '../../../teach/problem';
import type { DrillDef, PracticePack, PracticeSetDef } from '../../practice';
import { HOLES, holeName, ROW_FROM } from '../board';
import { generateMoves, homeComplete, PASS, seatCost } from '../engine';
import type { CcState } from '../rules';
import { actionOf, boardArray, chineseCheckers, layoutOf, makeConfig, positionText } from '../rules';
import { ccLessonGame } from '../learn/game';
import { createRng } from '../../../core/rng';

interface ProblemFile {
  readonly problems: readonly (readonly [string, string, string, number, string, string?])[];
}

export const CC_SETS: readonly PracticeSetDef[] = [
  { id: 'cc-hops', themes: ['cc-chain', 'cc-hop'], chips: ['cc-chain', 'cc-hop', 'cc-their'] },
  { id: 'cc-race', themes: ['cc-race'], chips: ['cc-tip'] },
];

/** Themes in the order hints name them, most telling first. */
export const CC_THEME_ORDER: readonly string[] = ['cc-tip', 'cc-their', 'cc-chain', 'cc-hop', 'cc-race'];

export function toProblem([id, position, line, rating, themes, also]: readonly [string, string, string, number, string, string?]): Problem {
  return { id, position, setup: null, line: line.split(' '), ...(also ? { alsoFirst: also.split(' ') } : {}), rating, themes: themes.split(' ') };
}

const scratch = new Int32Array(1024);

/**
 * A race in progress, from a seed: both sides play the move that leaves them nearest home, now and
 * then a random one, for a random number of turns. Red is to move.
 */
export function racePosition(random: () => number, minPlies = 16, maxPlies = 70): CcState {
  const rng = createRng(String(Math.floor(random() * 1e9)));
  let state = chineseCheckers.setup(makeConfig(2), rng);
  const plies = 2 * Math.floor((minPlies + random() * (maxPlies - minPlies)) / 2);
  for (let ply = 0; ply < plies && state.end === null; ply++) {
    const board = boardArray(state.board);
    const layout = layoutOf(state);
    const n = generateMoves(board, state.toMove, layout, state.rules, scratch);
    let best = scratch[0] as number;
    if (random() < 0.2) best = scratch[Math.floor(random() * n)] as number;
    else {
      let bestCost = Infinity;
      for (let i = 0; i < n; i++) {
        const m = scratch[i] as number;
        if (m === PASS) continue;
        const from = m & 0xff;
        const to = (m >> 8) & 0xff;
        board[to] = board[from] as number;
        board[from] = 0;
        const cost = homeComplete(board, state.toMove, layout, state.rules.finish) ? Infinity : seatCost(board, state.toMove, layout) + random() * 40;
        board[from] = board[to] ?? 0;
        board[to] = 0;
        if (cost < bestCost) {
          bestCost = cost;
          best = m;
        }
      }
    }
    state = chineseCheckers.apply(state, actionOf(best)).state;
  }
  if (state.end !== null) return racePosition(random, minPlies, Math.max(minPlies + 2, maxPlies - 10));
  if (state.toMove !== 0) {
    // Hand the move back to Red by letting Blue make its nearest-home move.
    return racePosition(random, minPlies, maxPlies);
  }
  return state;
}

function rowsDrill(random: () => number): Lesson {
  const state = racePosition(random);
  const blue = random() < 0.4;
  return {
    id: 'chinese-checkers.drill.rows',
    gameId: 'chinese-checkers',
    stage: 'table',
    title: 'Count the race',
    minutes: 1,
    start: positionText(state),
    steps: [
      blue
        ? { kind: 'askNumber', text: 'How many rows does Blue still have to go? Blue counts from its own start at the top: add up {row:tip} minus each marble’s row, then take off {row:base}.', answer: 'rows:B', success: 'Right, {rows:B}. Red has {rows:R}.' }
        : { kind: 'askNumber', text: 'How many rows does Red still have to go? Add up {row:tip} minus the row of each red marble, then take off {row:base}.', answer: 'rows:R', success: 'Right, {rows:R}. Blue has {rows:B}.' },
    ],
  };
}

function reachDrill(random: () => number): Lesson {
  for (let tries = 0; tries < 40; tries++) {
    const state = racePosition(random, 10, 50);
    const board = boardArray(state.board);
    const layout = layoutOf(state);
    const n = generateMoves(board, 0, layout, state.rules, scratch);
    const counts = new Map<number, number[]>();
    for (let i = 0; i < n; i++) {
      const m = scratch[i] as number;
      if (m === PASS) continue;
      counts.set(m & 0xff, [...(counts.get(m & 0xff) ?? []), (m >> 8) & 0xff]);
    }
    // A marble with a few places to go, at least one of them by a hop.
    const point = layout.points[0] as number;
    const candidates = [...counts].filter(([from, tos]) => tos.length >= 4 && tos.length <= 12 && tos.some((to) => Math.abs((ROW_FROM[point * HOLES + to] as number) - (ROW_FROM[point * HOLES + from] as number)) >= 2));
    if (candidates.length === 0) continue;
    const [from] = candidates[Math.floor(random() * candidates.length)] as [number, number[]];
    const name = holeName(from);
    return {
      id: 'chinese-checkers.drill.reach',
      gameId: 'chinese-checkers',
      stage: 'stage-1',
      title: 'Where can it go?',
      minutes: 1,
      start: positionText(state),
      steps: [{ kind: 'askNumber', text: 'How many holes can the marked marble reach in one move? Count every step, and every hole where a chain of hops could stop.', answer: `reach:${name}`, marks: [name], success: 'Right, {reach:' + name + '}.' }],
    };
  }
  return rowsDrill(random);
}

export const CC_DRILLS: readonly DrillDef[] = [
  { id: 'drill-cc-rows', make: rowsDrill },
  { id: 'drill-cc-reach', make: reachDrill },
];

export async function loadCcPractice(): Promise<PracticePack> {
  const file = (await import('./problems.json')).default as unknown as ProblemFile;
  return { problems: file.problems.map(toProblem), sets: CC_SETS, drills: CC_DRILLS, attribution: null, game: ccLessonGame, themeOrder: CC_THEME_ORDER };
}
