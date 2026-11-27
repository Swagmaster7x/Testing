/**
 * Exact solvers for small Go fights (PLAN.md 2.6: "solver on the enclosed region"). They prove
 * the practice problems and the lessons' "best move" claims.
 *
 * - Capture search: can the attacker capture a target chain? The attacker tries the target's
 *   liberties and the points next to them (that is where ladders and nets are played) and saves
 *   its own stones next to the target when they are in atari; the defender extends, or captures or
 *   ataris the stones around it. A target that reaches three liberties has escaped.
 * - Life and death: inside a region closed off by the attacker's wall, can the defender keep any
 *   stones alive? Moves are the region's empty points and passing; the defender lives when its
 *   stones survive two passes in a row or are alive by Benson's test (two vital regions each).
 * - Capture-Go: a short search where the first capture wins and every attacking move is an atari.
 *
 * All searches use depth limits and a transposition table, and treat ko by the simple rule.
 */
import type { Color } from './board';
import { BLACK, Board, EMPTY, opponent, WHITE } from './board';

// ---------------------------------------------------------------------------------------------
// Helpers

function key(b: Board, toMove: Color, extra = ''): string {
  return `${b.hashHi}:${b.hashLo}:${toMove}:${b.ko}${extra}`;
}

function libertiesOf(b: Board, i: number, limit = Infinity): number[] {
  return b.liberties(b.head[i] as number, limit);
}

/** Chains of colour c next to the chain at i (heads). */
function neighbourChains(b: Board, i: number, c: Color): number[] {
  const out: number[] = [];
  for (const s of b.chain(b.head[i] as number)) {
    for (let d = 0; d < 4; d++) {
      const n = s + (b.dirs[d] as number);
      if (b.color[n] === c) {
        const h = b.head[n] as number;
        if (!out.includes(h)) out.push(h);
      }
    }
  }
  return out;
}

function playCopy(b: Board, i: number, c: Color): Board | null {
  if (i < 0) {
    const nb = b.copy();
    nb.pass();
    return nb;
  }
  if (!b.isLegal(i, c, false)) return null;
  const nb = b.copy();
  nb.play(i, c);
  return nb;
}

// ---------------------------------------------------------------------------------------------
// Capture search

export interface CaptureOptions {
  readonly maxDepth?: number;
  readonly nodeLimit?: number;
  /** The target has escaped once it has this many liberties at the attacker's turn. */
  readonly escape?: number;
}

class OutOfBudget extends Error {}
const OUT_OF_BUDGET = new OutOfBudget('node budget used up');

export interface CaptureSearch {
  /**
   * True when the attacker (to move) captures the target against any defence, false when it
   * cannot within the depth. Throws when the node budget of one question runs out; use `attack`.
   */
  attackerWins(b: Board, depth: number): boolean;
  /** True when the attacker captures even though the defender moves first (see `defend`). */
  defenderLoses(b: Board, depth: number): boolean;
  /** attackerWins with a fresh node budget: null when the budget ran out. */
  attack(b: Board, depth: number): boolean | null;
  /** defenderLoses with a fresh node budget: null when the budget ran out. */
  defend(b: Board, depth: number): boolean | null;
  attackerMoves(b: Board): number[];
  defenderMoves(b: Board): number[];
  nodes: number;
  readonly target: number;
  readonly attacker: Color;
}

/**
 * A capture search for the chain on padded point `target`. The attacker is the other colour.
 * Results are exact within the depth; deeper fights count as escapes.
 */
export function captureSearch(target: number, defender: Color, options: CaptureOptions = {}): CaptureSearch {
  const attacker = opponent(defender);
  const escape = options.escape ?? 3;
  const nodeLimit = options.nodeLimit ?? 200_000;
  const wins = new Map<string, number>();
  const losses = new Map<string, number>();
  const ask = (f: () => boolean): boolean | null => {
    s.nodes = 0;
    try {
      return f();
    } catch (err) {
      if (err === OUT_OF_BUDGET) return null;
      throw err;
    }
  };
  const s: CaptureSearch = {
    nodes: 0,
    target,
    attacker,
    attack: (b, depth) => ask(() => s.attackerWins(b, depth)),
    defend: (b, depth) => ask(() => s.defenderLoses(b, depth)),
    attackerMoves(b) {
      const out: number[] = [];
      const add = (i: number) => {
        if (b.color[i] === EMPTY && !out.includes(i)) out.push(i);
      };
      const libs = libertiesOf(b, target);
      for (const l of libs) add(l);
      // Our stones next to the target that are in atari: save them.
      for (const h of neighbourChains(b, target, attacker)) if (b.inAtari(h)) add(b.atariLiberty(h));
      // Points next to the liberties: nets and ladder blocks.
      for (const l of libs) for (let d = 0; d < 4; d++) add(l + (b.dirs[d] as number));
      // Diagonal points of the liberties, for loose nets.
      const w = b.width;
      for (const l of libs) for (const off of [-w - 1, -w + 1, w - 1, w + 1]) add(l + off);
      return out;
    },
    defenderMoves(b) {
      const out: number[] = [];
      const add = (i: number) => {
        if (b.color[i] === EMPTY && !out.includes(i)) out.push(i);
      };
      for (const l of libertiesOf(b, target)) add(l);
      for (const h of neighbourChains(b, target, attacker)) {
        const libs = b.liberties(h, 3);
        if (libs.length <= 2) for (const l of libs) add(l);
      }
      return out;
    },
    attackerWins(b, depth) {
      s.nodes++;
      if (b.color[target] !== defender) return true;
      const libs = libertiesOf(b, target, escape);
      if (libs.length >= escape) return false;
      if (libs.length === 1) return b.isLegal(libs[0] as number, attacker, false);
      if (s.nodes > nodeLimit) throw OUT_OF_BUDGET;
      if (depth <= 0) return false;
      const k = key(b, attacker);
      if ((wins.get(k) ?? Infinity) <= depth) return true;
      if ((losses.get(k) ?? -1) >= depth) return false;
      let result = false;
      for (const m of s.attackerMoves(b)) {
        const nb = playCopy(b, m, attacker);
        if (!nb) continue;
        if (nb.color[target] !== defender) {
          result = true;
          break;
        }
        // A move that leaves the target with more liberties than before cannot be right.
        if (s.defenderLoses(nb, depth - 1)) {
          result = true;
          break;
        }
      }
      if (result) wins.set(k, Math.min(depth, wins.get(k) ?? Infinity));
      else losses.set(k, Math.max(depth, losses.get(k) ?? -1));
      return result;
    },
    defenderLoses(b, depth) {
      s.nodes++;
      if (b.color[target] !== defender) return true;
      const libs = libertiesOf(b, target, escape + 1);
      if (libs.length >= escape + 1) return false;
      if (s.nodes > nodeLimit) throw OUT_OF_BUDGET;
      if (depth <= 0) return false;
      const k = key(b, defender);
      if ((wins.get(k) ?? Infinity) <= depth) return true;
      if ((losses.get(k) ?? -1) >= depth) return false;
      let result = true;
      const moves = s.defenderMoves(b);
      for (const m of moves) {
        const nb = playCopy(b, m, defender);
        if (!nb) continue;
        if (!s.attackerWins(nb, depth - 1)) {
          result = false;
          break;
        }
      }
      // Playing elsewhere is a defence too, when it is enough.
      if (result) {
        const nb = playCopy(b, -1, defender) as Board;
        if (!s.attackerWins(nb, depth - 1)) result = false;
      }
      if (result) wins.set(k, Math.min(depth, wins.get(k) ?? Infinity));
      else losses.set(k, Math.max(depth, losses.get(k) ?? -1));
      return result;
    },
  };
  return s;
}

/** The fewest plies the attacker needs to capture, or null if not within `maxDepth` (or not proved). */
export function captureDepth(b: Board, search: CaptureSearch, maxDepth: number, attackerToMove: boolean): number | null {
  if ((attackerToMove ? search.attack(b, maxDepth) : search.defend(b, maxDepth)) !== true) return null;
  for (let depth = 1; depth <= maxDepth; depth++) {
    if ((attackerToMove ? search.attack(b, depth) : search.defend(b, depth)) === true) return depth;
  }
  return null;
}

// ---------------------------------------------------------------------------------------------
// Benson's unconditional life

/** Vital regions (eyes) a chain needs to be alive whatever happens. */
export const EYES_FOR_LIFE = 2;

/** Chains of colour c (heads) that are alive whatever the opponent does (Benson's algorithm). */
export function bensonAlive(b: Board, c: Color): Set<number> {
  const chains = new Set<number>();
  for (let i = 0; i < b.cells; i++) if (b.color[i] === c && b.head[i] === i) chains.add(i);
  interface Region {
    readonly empties: number[];
    readonly borders: Set<number>;
  }
  const regions: Region[] = [];
  const seen = new Uint8Array(b.cells);
  for (let i = 0; i < b.cells; i++) {
    const ci = b.color[i];
    if (seen[i] || ci === c || ci === 3) continue;
    const empties: number[] = [];
    const borders = new Set<number>();
    const stack = [i];
    seen[i] = 1;
    while (stack.length > 0) {
      const p = stack.pop() as number;
      if (b.color[p] === EMPTY) empties.push(p);
      for (let d = 0; d < 4; d++) {
        const n = p + (b.dirs[d] as number);
        const cn = b.color[n];
        if (cn === 3) continue;
        if (cn === c) borders.add(b.head[n] as number);
        else if (!seen[n]) {
          seen[n] = 1;
          stack.push(n);
        }
      }
    }
    regions.push({ empties, borders });
  }
  const isLib = (h: number, p: number) => {
    for (let d = 0; d < 4; d++) {
      const n = p + (b.dirs[d] as number);
      if (b.color[n] === c && b.head[n] === h) return true;
    }
    return false;
  };
  let alive = new Set(chains);
  let healthy = regions.slice();
  for (;;) {
    const keep = new Set<number>();
    for (const h of alive) {
      let vital = 0;
      for (const r of healthy) if (r.borders.has(h) && r.empties.every((p) => isLib(h, p))) vital++;
      if (vital >= EYES_FOR_LIFE) keep.add(h);
    }
    const nextRegions = healthy.filter((r) => [...r.borders].every((h) => keep.has(h)));
    if (keep.size === alive.size && nextRegions.length === healthy.length) return keep;
    alive = keep;
    healthy = nextRegions;
  }
}

// ---------------------------------------------------------------------------------------------
// Life and death in a closed region

export interface LifeProblem {
  /** Empty points (padded) where moves may be played. */
  readonly region: ReadonlySet<number>;
  /** Defender stones at the start (padded); the defender lives if any of them survive. */
  readonly stones: readonly number[];
  readonly defender: Color;
}

export interface LifeSearch {
  /** True when the defender lives with `toMove` to play (and `passes` passes just made). */
  lives(b: Board, toMove: Color, passes: number, depth: number): boolean;
  moves(b: Board): number[];
  nodes: number;
  /** Set when the depth or node budget cut a line short (a "lives" answer is then not proved). */
  cut: boolean;
}

export function lifeSearch(problem: LifeProblem, options: { nodeLimit?: number } = {}): LifeSearch {
  const { defender } = problem;
  const attacker = opponent(defender);
  const nodeLimit = options.nodeLimit ?? 400_000;
  const memo = new Map<string, { lives: boolean; depth: number }>();
  const area = new Set<number>([...problem.region, ...problem.stones]);
  const s: LifeSearch = {
    nodes: 0,
    cut: false,
    moves(b) {
      const out: number[] = [];
      for (const i of area) if (b.color[i] === EMPTY) out.push(i);
      return out.sort((x, y) => x - y);
    },
    lives(b, toMove, passes, depth) {
      s.nodes++;
      const remaining = [...area].filter((i) => b.color[i] === defender);
      if (remaining.length === 0) return false;
      if (passes >= 2) return true;
      const alive = bensonAlive(b, defender);
      if (remaining.some((i) => alive.has(b.head[i] as number))) return true;
      // Beyond the depth or the node budget the stones count as alive: a kill found is a real kill.
      if (depth <= 0 || s.nodes > nodeLimit) {
        s.cut = true;
        return true;
      }
      const k = key(b, toMove, `:${passes}`);
      const hit = memo.get(k);
      // A kill found with less depth stays a kill with more; life found with more depth holds with less.
      if (hit && ((!hit.lives && hit.depth <= depth) || (hit.lives && hit.depth >= depth))) return hit.lives;
      let result: boolean;
      if (toMove === defender) {
        result = false;
        for (const m of [...s.moves(b), -1]) {
          const nb = playCopy(b, m, defender);
          if (!nb) continue;
          if (s.lives(nb, attacker, m < 0 ? passes + 1 : 0, depth - 1)) {
            result = true;
            break;
          }
        }
      } else {
        result = true;
        for (const m of [...s.moves(b), -1]) {
          const nb = playCopy(b, m, attacker);
          if (!nb) continue;
          if (!s.lives(nb, defender, m < 0 ? passes + 1 : 0, depth - 1)) {
            result = false;
            break;
          }
        }
      }
      memo.set(k, { lives: result, depth });
      return result;
    },
  };
  return s;
}

// ---------------------------------------------------------------------------------------------
// Capture-Go: the first capture wins

/** Plies to a forced capture by the side to move (only ataris and captures), or null. */
export function captureGoWin(b: Board, toMove: Color, maxPlies: number, memo = new Map<string, boolean>()): number | null {
  for (let plies = 1; plies <= maxPlies; plies += 2) if (forcedCapture(b, toMove, plies, memo)) return plies;
  return null;
}

function capturingMoves(b: Board, c: Color): number[] {
  const out: number[] = [];
  for (let k = 0; k < b.emptyCount; k++) {
    const i = b.empties[k] as number;
    if (b.capturesAt(i, c) > 0 && b.isLegal(i, c, false)) out.push(i);
  }
  return out.sort((x, y) => x - y);
}

function atariMoves(b: Board, c: Color): number[] {
  const out: number[] = [];
  const opp = opponent(c);
  for (let i = 0; i < b.cells; i++) {
    if (b.color[i] !== opp || b.head[i] !== i) continue;
    const libs = b.liberties(i, 3);
    if (libs.length === 2) for (const l of libs) if (!out.includes(l)) out.push(l);
  }
  return out.sort((x, y) => x - y);
}

/** Can `c` force a capture within `plies` (its own moves at plies 1, 3, 5...)? */
export function forcedCapture(b: Board, c: Color, plies: number, memo: Map<string, boolean>): boolean {
  if (capturingMoves(b, c).length > 0) return true;
  if (plies < 3) return false;
  const k = `${key(b, c)}:${plies}`;
  const hit = memo.get(k);
  if (hit !== undefined) return hit;
  const opp = opponent(c);
  let result = false;
  for (const m of atariMoves(b, c)) {
    const nb = playCopy(b, m, c);
    if (!nb) continue;
    // Our move must not leave us capturable at once.
    if (capturingMoves(nb, opp).length > 0) continue;
    // Every defence: extend or capture; each must still lose.
    let refuted = false;
    const defences = new Set<number>();
    for (let i = 0; i < nb.cells; i++) {
      if (nb.color[i] !== opp || nb.head[i] !== i || !nb.inAtari(i)) continue;
      defences.add(nb.atariLiberty(i));
    }
    if (defences.size === 0) continue;
    for (const d of defences) {
      const db = playCopy(nb, d, opp);
      if (!db) continue;
      // A defence that captures wins the game for the defender.
      if ((db.capturedBy[opp - 1] as number) > (nb.capturedBy[opp - 1] as number) || !forcedCapture(db, c, plies - 2, memo)) {
        refuted = true;
        break;
      }
    }
    if (!refuted) {
      result = true;
      break;
    }
  }
  memo.set(k, result);
  return result;
}

export { BLACK, WHITE };
