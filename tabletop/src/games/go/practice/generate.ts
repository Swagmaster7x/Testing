/**
 * Generated Go problems (PLAN.md 2.6), each proved by a solver on the fight in question:
 * - capturing, ladders and nets: the capture search (solver.ts) proves the target falls, that it
 *   would escape if the attacker played elsewhere, and that every move of the attacker in the
 *   line is the only one that works;
 * - life and death: the region search proves the side to move succeeds, that it would fail if
 *   the other side moved first, and that the first move is the only one that works.
 * scripts/go-problems.ts writes the set; tests/unit/go-practice.test.ts proves it again.
 */
import type { Rng } from '../../../core/rng';
import { createRng } from '../../../core/rng';
import type { Problem } from '../../../teach/problem';
import type { Color } from '../board';
import { BLACK, Board, EMPTY, opponent, WHITE } from '../board';
import { pointName } from '../coords';
import { GoSearch } from '../engine';
import type { CaptureSearch } from '../solver';
import { captureDepth, captureSearch, lifeSearch } from '../solver';

export const PROBLEM_SIZE = 9;
const MAX_DEPTH = 25;

function textOf(b: Board, toMove: Color): string {
  const size = b.size;
  const t = b.toText();
  const rows: string[] = [];
  for (let y = 0; y < size; y++) rows.push(t.slice(y * size, (y + 1) * size));
  return `${rows.join('/')} ${toMove === BLACK ? 'b' : 'w'}`;
}

const name = (b: Board, i: number) => pointName(b.point(i), b.size);

function legalPoints(b: Board, c: Color): number[] {
  const out: number[] = [];
  for (let k = 0; k < b.emptyCount; k++) {
    const i = b.empties[k] as number;
    if (b.isLegal(i, c, false)) out.push(i);
  }
  return out.sort((x, y) => x - y);
}

function after(b: Board, i: number, c: Color): Board {
  const nb = b.copy();
  if (i < 0) nb.pass();
  else nb.play(i, c);
  return nb;
}

// ---------------------------------------------------------------------------------------------
// Capturing, ladders and nets

export interface CaptureLine {
  readonly moves: number[];
  readonly attackerMoves: number;
}

/** The attacker's moves that still capture (target gone, or the defender to move cannot save it). */
export function winningCaptures(b: Board, s: CaptureSearch, depth: number): number[] {
  const out: number[] = [];
  for (const m of legalPoints(b, s.attacker)) {
    const nb = after(b, m, s.attacker);
    if (nb.color[s.target] !== opponent(s.attacker)) out.push(m);
    else {
      const r = s.defend(nb, depth);
      if (r === null) return [-2]; // not proved either way: the caller rejects the problem
      if (r) out.push(m);
    }
  }
  return out;
}

/** The solution: attacker moves (each the only one that works) and the defender's longest resistance. */
export function captureLine(b: Board, s: CaptureSearch): CaptureLine | null {
  const moves: number[] = [];
  let board = b;
  let attackerMoves = 0;
  for (let step = 0; step < 20; step++) {
    if (s.attack(board, MAX_DEPTH) !== true) return null;
    const winners = winningCaptures(board, s, MAX_DEPTH);
    if (winners.length === 0 || winners.includes(-2)) return null;
    if (winners.length > 1) {
      // Several moves finish the job: the fight is decided, so the line ends with our last move.
      if (step === 0) return null;
      moves.pop();
      return { moves, attackerMoves };
    }
    const m = winners[0] as number;
    moves.push(m);
    attackerMoves++;
    board = after(board, m, s.attacker);
    if (board.color[s.target] !== opponent(s.attacker)) return { moves, attackerMoves };
    // The defender's reply: the one that holds out longest (extending first when equal).
    let best: { move: number; depth: number } | null = null;
    for (const d of [...s.defenderMoves(board), -1]) {
      if (d >= 0 && !board.isLegal(d, opponent(s.attacker), false)) continue;
      const nb = after(board, d, opponent(s.attacker));
      const left = captureDepth(nb, s, MAX_DEPTH, true);
      if (left === null) return null; // a defence works: not proved
      if (d < 0 && best) continue;
      if (!best || left > best.depth) best = { move: d, depth: left };
    }
    if (!best || best.move < 0) return null;
    moves.push(best.move);
    board = after(board, best.move, opponent(s.attacker));
  }
  return null;
}

function chainHeads(b: Board, c: Color): number[] {
  const out: number[] = [];
  for (let i = 0; i < b.cells; i++) if (b.color[i] === c && b.head[i] === i) out.push(i);
  return out;
}

/** A Go-like position from playouts: `moves` stones from an empty board. */
function playoutPosition(rng: Rng, moves: number): { board: Board; toMove: Color } {
  const board = new Board(PROBLEM_SIZE);
  const search = new GoSearch(PROBLEM_SIZE, { komi: 7.5, suicide: false, captureTarget: 0, captured: [0, 0] });
  let c: Color = BLACK;
  const quick = { int: (n: number) => rng.int(n) };
  for (let k = 0; k < moves; k++) {
    const m = search.policy(board, c, quick);
    if (m < 0) break;
    board.play(m, c);
    c = opponent(c);
  }
  board.capturedBy = [0, 0];
  board.ko = -1;
  board.last = -2;
  return { board, toMove: c };
}

function themesFor(b: Board, s: CaptureSearch, line: CaptureLine): string[] {
  const defender = opponent(s.attacker);
  let board = b;
  let ataris = 0;
  let sacrificed = false;
  let doubleAtari = false;
  for (let k = 0; k < line.moves.length; k++) {
    const m = line.moves[k] as number;
    const byAttacker = k % 2 === 0;
    const before = board;
    board = after(board, m, byAttacker ? s.attacker : defender);
    if (byAttacker && board.color[s.target] === defender && board.inAtari(board.head[s.target] as number)) ataris++;
    if (byAttacker && k === 0) {
      let inAtari = 0;
      for (const h of chainHeads(board, defender)) if (board.inAtari(h)) inAtari++;
      if (inAtari >= 2) doubleAtari = true;
    }
    if (!byAttacker && (board.capturedBy[defender - 1] as number) > (before.capturedBy[defender - 1] as number)) sacrificed = true;
  }
  const first = after(b, line.moves[0] as number, s.attacker);
  const firstAtari = first.color[s.target] !== defender || first.inAtari(first.head[s.target] as number);
  if (sacrificed) return ['go-snapback', 'go-capture'];
  if (!firstAtari) return ['go-net', 'go-capture'];
  if (line.attackerMoves >= 3 && ataris >= line.attackerMoves - 1) return ['go-ladder', 'go-capture'];
  if (doubleAtari) return ['go-double-atari', 'go-capture'];
  return line.attackerMoves === 1 ? ['go-capture'] : ['go-atari', 'go-capture'];
}

/** A local fight: a small enemy chain with two liberties, our stones around it, a few more. */
function fightPosition(rng: Rng): { board: Board; toMove: Color } | null {
  const size = PROBLEM_SIZE;
  const board = new Board(size);
  const attacker: Color = rng.next() < 0.5 ? BLACK : WHITE;
  const defender = opponent(attacker);
  const cx = 1 + rng.int(size - 2);
  const cy = 1 + rng.int(size - 2);
  const around = (r: number) => {
    const x = Math.max(0, Math.min(size - 1, cx - r + rng.int(2 * r + 1)));
    const y = Math.max(0, Math.min(size - 1, cy - r + rng.int(2 * r + 1)));
    return board.index(x, y);
  };
  board.setStone(board.index(cx, cy), defender);
  // Grow the target to one to three stones.
  for (let k = rng.int(3); k > 0; k--) {
    const i = around(1);
    if (board.color[i] === EMPTY) board.setStone(i, defender);
  }
  const attackers = 3 + rng.int(5);
  for (let k = 0; k < attackers; k++) {
    const i = around(2);
    if (board.color[i] === EMPTY) board.setStone(i, attacker);
  }
  for (let k = rng.int(4); k > 0; k--) {
    const i = around(3);
    if (board.color[i] === EMPTY) board.setStone(i, defender);
  }
  for (let k = rng.int(4); k > 0; k--) {
    const i = board.index(rng.int(size), rng.int(size));
    if (board.color[i] === EMPTY) board.setStone(i, rng.next() < 0.5 ? attacker : defender);
  }
  if (board.deadChains().length > 0) return null;
  return { board, toMove: attacker };
}

/** One capture problem from a seed, or null when that seed gives nothing clean. */
export function captureProblem(seed: string): Problem | null {
  const rng = createRng(`go-capture/${seed}`);
  const made = rng.next() < 0.3 ? playoutPosition(rng, 10 + rng.int(30)) : fightPosition(rng);
  if (!made) return null;
  const { board, toMove } = made;
  const attacker = toMove;
  const defender = opponent(attacker);
  // Nothing of ours may be in atari, so the capture is the best move on the board.
  if (chainHeads(board, attacker).some((h) => board.inAtari(h))) return null;
  const targets = chainHeads(board, defender).filter((h) => board.liberties(h, 3).length === 2);
  const capturable: { head: number; search: CaptureSearch }[] = [];
  for (const h of chainHeads(board, defender)) {
    const libs = board.liberties(h, 4).length;
    if (libs > 2) continue;
    const s = captureSearch(h, defender, { escape: 3 });
    const r = s.attack(board, MAX_DEPTH);
    if (r === null) return null;
    if (r) capturable.push({ head: h, search: s });
  }
  // Exactly one enemy chain can be captured, and it is one of the two-liberty targets.
  if (capturable.length !== 1) return null;
  const only = capturable[0] as { head: number; search: CaptureSearch };
  if (!targets.includes(only.head)) return null;
  const s = only.search;
  // Urgent: if we played elsewhere, the defender would get away.
  if (s.defend(after(board, -1, attacker), MAX_DEPTH) !== false) return null;
  const line = captureLine(board, s);
  if (!line) return null;
  const themes = themesFor(board, s, line);
  const stones = board.stones[only.head] as number;
  const rating = 500 + 140 * (line.attackerMoves - 1) + (themes.includes('go-net') ? 250 : 0) + (themes.includes('go-snapback') ? 200 : 0) + Math.min(4, stones - 1) * 25;
  return {
    id: `go:cap:${seed}`,
    position: textOf(board, toMove),
    setup: null,
    line: line.moves.map((m) => name(board, m)),
    rating,
    themes,
  };
}

// ---------------------------------------------------------------------------------------------
// Ladders: a stone in a ladder-ready shape, with stones about that may break it.

export function ladderProblem(seed: string): Problem | null {
  const rng = createRng(`go-ladder/${seed}`);
  const size = PROBLEM_SIZE;
  const board = new Board(size);
  const attacker: Color = rng.next() < 0.5 ? BLACK : WHITE;
  const defender = opponent(attacker);
  // The defender's stone and two attacker stones on two sides of it: two liberties left.
  const x = 2 + rng.int(size - 4);
  const y = 2 + rng.int(size - 4);
  const target = board.index(x, y);
  board.setStone(target, defender);
  const sides = [-board.width, -1, 1, board.width];
  const a = rng.int(4);
  const firstSide = sides[a] as number;
  const secondSide = sides[(a + 1 + 2 * rng.int(2)) % 4] as number;
  // The ladder shape: two stones beside the target and one on the diagonal past the second,
  // so the chased stones never get a third liberty.
  for (const off of [firstSide, secondSide, secondSide - firstSide]) if (board.color[target + off] === EMPTY) board.setStone(target + off, attacker);
  // A few more stones around the board: ladder breakers, blockers, or nothing at all.
  const extra = 2 + rng.int(6);
  for (let k = 0; k < extra; k++) {
    const i = board.index(rng.int(size), rng.int(size));
    if (board.color[i] !== EMPTY || Math.abs((i % board.width) - (target % board.width)) + Math.abs(Math.floor(i / board.width) - Math.floor(target / board.width)) <= 1) continue;
    board.setStone(i, rng.next() < 0.5 ? attacker : defender);
  }
  if (board.deadChains().length > 0) return null;
  if (board.liberties(board.head[target] as number, 3).length !== 2) return null;
  for (const h of chainHeads(board, attacker)) if (board.inAtari(h)) return null;
  for (const h of chainHeads(board, defender)) if (h !== board.head[target] && board.liberties(h, 3).length <= 2) return null;
  const s = captureSearch(board.head[target] as number, defender, { escape: 3 });
  if (s.attack(board, MAX_DEPTH) !== true) return null;
  if (s.defend(after(board, -1, attacker), MAX_DEPTH) !== false) return null;
  const line = captureLine(board, s);
  if (!line || line.attackerMoves < 3) return null;
  const themes = themesFor(board, s, line);
  if (!themes.includes('go-ladder') && !themes.includes('go-net')) return null;
  const rating = 650 + 60 * (line.attackerMoves - 3) + (themes.includes('go-net') ? 250 : 0) + 40 * Math.min(4, extra - 2);
  return { id: `go:lad:${seed}`, position: textOf(board, attacker), setup: null, line: line.moves.map((m) => name(board, m)), rating, themes };
}

// ---------------------------------------------------------------------------------------------
// Nets (geta): the stone is caught without an atari.

/**
 * The net shape around a lone stone at the origin: attacker stones on two sides of it and on the
 * two diagonals beside its way out, so that after the net (the third diagonal) every extension
 * still has only two liberties. Stones further off may break the ladders, so that the atari
 * fails and only the net works; the capture search decides.
 */
const NET_STONES: readonly (readonly [number, number])[] = [[-1, 0], [0, 1], [-1, -1], [1, 1]];

export function netProblem(seed: string): Problem | null {
  const rng = createRng(`go-net/${seed}`);
  const size = PROBLEM_SIZE;
  const board = new Board(size);
  const attacker: Color = rng.next() < 0.5 ? BLACK : WHITE;
  const defender = opponent(attacker);
  const k = rng.int(8);
  const turn = (dx: number, dy: number): [number, number] => {
    let [a, b] = [dx, dy];
    if (k & 4) [a, b] = [b, a];
    if (k & 1) a = -a;
    if (k & 2) b = -b;
    return [a, b];
  };
  const x = 2 + rng.int(size - 4);
  const y = 2 + rng.int(size - 4);
  const put = (dx: number, dy: number, c: Color): boolean => {
    const [a, b] = turn(dx, dy);
    if (x + a < 0 || y + b < 0 || x + a >= size || y + b >= size) return false;
    const i = board.index(x + a, y + b);
    if (board.color[i] !== EMPTY) return false;
    board.setStone(i, c);
    return true;
  };
  const target = board.index(x, y);
  board.setStone(target, defender);
  for (const [dx, dy] of NET_STONES) if (!put(dx, dy, attacker)) return null;
  // Ladder breakers on the way out (towards the net point), then a few stones anywhere.
  for (let b = 1 + rng.int(2); b > 0; b--) put(2 + rng.int(4), -2 - rng.int(4), defender);
  for (let e = rng.int(4); e > 0; e--) {
    const i = board.index(rng.int(size), rng.int(size));
    const far = Math.abs((i % board.width) - x) + Math.abs(Math.floor(i / board.width) - y) > 3;
    if (far && board.color[i] === EMPTY) board.setStone(i, rng.next() < 0.5 ? attacker : defender);
  }
  if (board.deadChains().length > 0) return null;
  if (board.liberties(target, 3).length !== 2) return null;
  for (const h of chainHeads(board, attacker)) if (board.inAtari(h)) return null;
  for (const h of chainHeads(board, defender)) if (h !== board.head[target] && board.liberties(h, 3).length <= 2) return null;
  const s = captureSearch(board.head[target] as number, defender, { escape: 3 });
  if (s.attack(board, MAX_DEPTH) !== true) return null;
  if (s.defend(after(board, -1, attacker), MAX_DEPTH) !== false) return null;
  const line = captureLine(board, s);
  if (!line) return null;
  const themes = themesFor(board, s, line);
  if (!themes.includes('go-net')) return null;
  const rating = 950 + 80 * (line.attackerMoves - 1);
  return { id: `go:net:${seed}`, position: textOf(board, attacker), setup: null, line: line.moves.map((m) => name(board, m)), rating, themes };
}

// ---------------------------------------------------------------------------------------------
// Life and death in a corner

/** Rotations and mirror images of a point in an n×n board. */
function transform(x: number, y: number, n: number, k: number): [number, number] {
  let [a, b] = [x, y];
  if (k & 1) [a, b] = [n - 1 - b, a];
  if (k & 2) [a, b] = [n - 1 - a, n - 1 - b];
  if (k & 4) [a, b] = [b, a];
  return [a, b];
}

export function lifeProblem(seed: string): Problem | null {
  const rng = createRng(`go-life/${seed}`);
  const n = PROBLEM_SIZE;
  const k = rng.int(8);
  // An eye space grown from the corner inside a 4×4 box.
  const space = new Set<string>(['0,0']);
  const want = 3 + rng.int(4);
  for (let guard = 0; space.size < want && guard < 50; guard++) {
    const cells = [...space].map((c) => c.split(',').map(Number) as [number, number]);
    const [cx, cy] = rng.pick(cells);
    const [dx, dy] = rng.pick([[1, 0], [0, 1], [-1, 0], [0, -1]] as const);
    const nx = cx + dx;
    const ny = cy + dy;
    if (nx < 0 || ny < 0 || nx > 3 || ny > 3) continue;
    space.add(`${nx},${ny}`);
  }
  const inSpace = (x: number, y: number) => space.has(`${x},${y}`);
  const near = (x: number, y: number, set: (a: number, b: number) => boolean) =>
    [[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => set(x + (dx as number), y + (dy as number)));
  const wall = new Set<string>();
  for (let x = 0; x < 6; x++) for (let y = 0; y < 6; y++) if (!inSpace(x, y) && near(x, y, inSpace)) wall.add(`${x},${y}`);
  const inWall = (x: number, y: number) => wall.has(`${x},${y}`);
  const outer = new Set<string>();
  for (let x = 0; x < 7; x++) for (let y = 0; y < 7; y++) if (!inSpace(x, y) && !inWall(x, y) && near(x, y, inWall)) outer.add(`${x},${y}`);
  const defender: Color = rng.next() < 0.5 ? BLACK : WHITE;
  const attacker = opponent(defender);
  const board = new Board(n);
  const put = (x: number, y: number, c: Color) => {
    const [tx, ty] = transform(x, y, n, k);
    const i = board.index(tx, ty);
    if (board.color[i] === EMPTY) board.setStone(i, c);
  };
  for (const c of wall) {
    const [x, y] = c.split(',').map(Number) as [number, number];
    put(x, y, defender);
  }
  for (const c of outer) {
    const [x, y] = c.split(',').map(Number) as [number, number];
    put(x, y, attacker);
  }
  // A stone or two inside, of either colour, and maybe a gap in the defender's wall.
  const cells = [...space].map((c) => c.split(',').map(Number) as [number, number]);
  for (let s = rng.int(3); s > 0; s--) {
    const [x, y] = rng.pick(cells);
    put(x, y, rng.next() < 0.6 ? attacker : defender);
  }
  if (rng.next() < 0.4) {
    const walls = [...wall].map((c) => c.split(',').map(Number) as [number, number]);
    const [x, y] = rng.pick(walls);
    const [tx, ty] = transform(x, y, n, k);
    const i = board.index(tx, ty);
    const copy = Board.fromText(n, [...board.toText()].map((ch, p) => (p === board.point(i) ? '.' : ch)).join(''));
    if (copy.deadChains().length === 0) return lifeFrom(copy, defender, attacker, space, wall, k, seed, rng);
    return null;
  }
  if (board.deadChains().length > 0) return null;
  return lifeFrom(board, defender, attacker, space, wall, k, seed, rng);
}

function lifeFrom(board: Board, defender: Color, attacker: Color, space: ReadonlySet<string>, wall: ReadonlySet<string>, k: number, seed: string, rng: Rng): Problem | null {
  const n = board.size;
  // The problem's area: the eye space and the defender's wall, whatever stands there now.
  const region = new Set<number>();
  const stones: number[] = [];
  let empties = 0;
  for (const c of [...space, ...wall]) {
    const [x, y] = c.split(',').map(Number) as [number, number];
    const [tx, ty] = transform(x, y, n, k);
    const i = board.index(tx, ty);
    region.add(i);
    if (board.color[i] === EMPTY) empties++;
    else if (board.color[i] === defender) stones.push(i);
  }
  if (stones.length < 3 || empties < 2 || empties > 9) return null;
  // The attacker's wall must be safe: every chain with liberties outside the problem.
  for (let i = 0; i < board.cells; i++) {
    if (board.color[i] !== attacker || board.head[i] !== i) continue;
    const outside = board.liberties(i).filter((l) => !region.has(l));
    if (outside.length < 2) return null;
  }
  // No defender stone may reach the open board.
  for (const s of stones) for (const l of board.liberties(board.head[s] as number)) if (!region.has(l)) return null;
  const problem = { region, stones, defender };
  const depth = empties * 2 + 8;
  const solve = (b: Board, toMove: Color, d = depth) => {
    const s = lifeSearch(problem, { nodeLimit: 300_000 });
    const lives = s.lives(b, toMove, 0, d);
    return { lives, sure: !s.cut || !lives };
  };
  const defenderFirst = solve(board, defender);
  const attackerFirst = solve(board, attacker);
  if (!defenderFirst.sure || !attackerFirst.sure) return null;
  // Unsettled: whoever moves first gets their way.
  if (!defenderFirst.lives || attackerFirst.lives) return null;
  const toMove: Color = rng.next() < 0.5 ? defender : attacker;
  const goal = toMove === defender ? 'live' : 'kill';
  const winners: number[] = [];
  for (const m of [...region].sort((a, b) => a - b)) {
    if (board.color[m] !== EMPTY || !board.isLegal(m, toMove, false)) continue;
    const nb = after(board, m, toMove);
    const r = solve(nb, opponent(toMove));
    // Every answer must be proved, so that "only one move works" is proved too.
    if (!r.sure) return null;
    if (goal === 'live' ? r.lives : !r.lives) winners.push(m);
  }
  // Passing (or playing outside, which is the same here) must fail.
  if (winners.length !== 1) return null;
  const key = winners[0] as number;
  // Proof with more depth: the answer stands.
  const deeper = solve(after(board, key, toMove), opponent(toMove), depth + 6);
  if (goal === 'live' ? !deeper.lives || !deeper.sure : deeper.lives) return null;
  const rating = 750 + 90 * empties + (goal === 'kill' ? 60 : 0);
  return { id: `go:life:${seed}`, position: textOf(board, toMove), setup: null, line: [name(board, key)], rating, themes: [goal === 'live' ? 'go-live' : 'go-kill', 'go-eye'] };
}

export const PROBLEM_KINDS = ['capture', 'ladder', 'net', 'life'] as const;
export type ProblemKind = (typeof PROBLEM_KINDS)[number];

const MAKERS: Record<ProblemKind, { readonly make: (seed: string) => Problem | null; readonly share: number; readonly limit: number }> = {
  capture: { make: captureProblem, share: 1, limit: 40_000 },
  ladder: { make: ladderProblem, share: 1, limit: 60_000 },
  net: { make: netProblem, share: 1 / 3, limit: 20_000 },
  life: { make: lifeProblem, share: 1, limit: 40_000 },
};

/** The id prefix of each kind's problems. */
export const KIND_PREFIX: Record<ProblemKind, string> = { capture: 'go:cap:', ladder: 'go:lad:', net: 'go:net:', life: 'go:life:' };

/**
 * Makes problems from numbered seeds: `count` of each kind (a third as many nets, which are
 * rarer and take longer to prove). The same seeds always give the same problems.
 */
export function generateProblems(count: number, kinds: readonly ProblemKind[] = PROBLEM_KINDS, onProgress?: (kind: string, made: number, tried: number) => void): Partial<Record<ProblemKind, Problem[]>> {
  const out: Partial<Record<ProblemKind, Problem[]>> = {};
  for (const kind of kinds) {
    const { make, share, limit } = MAKERS[kind];
    const want = Math.round(count * share);
    const made: Problem[] = [];
    const positions = new Set<string>();
    for (let i = 0; made.length < want && i < limit; i++) {
      const p = make(String(i));
      if (p && !positions.has(p.position)) {
        positions.add(p.position);
        made.push(p);
      }
      if (i % 200 === 0) onProgress?.(kind, made.length, i);
    }
    out[kind] = made;
  }
  return out;
}

export { WHITE };
