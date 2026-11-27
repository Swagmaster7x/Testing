/**
 * Monte Carlo tree search (PLAN.md 2.4), shared by every game that needs it: Go now, multiplayer
 * Chinese Checkers later.
 *
 * Each playout walks down the tree choosing children by their value, adds a node, plays the game
 * out to the end with the game's own playout policy, and backs the result up. Two refinements
 * that matter with small budgets:
 * - Priors: a game can give a new child some imaginary games (say "this captures, count it as
 *   ten games won"), so obvious moves are tried first.
 * - RAVE (all-moves-as-first): when moves are numbered the same way in every position (points on
 *   a board), a move's results anywhere later in a playout also count, with less weight, for
 *   that move here. The weight fades as real visits pile up.
 *
 * Strength is set by the number of playouts, never by time, so a level plays the same on a
 * slow phone and in tests. Everything random comes from the Rng passed in.
 */
import type { Rng } from '../core/rng';

/** Records the moves of one playout, in order, for RAVE. */
export interface MoveLog {
  record(player: number, move: number): void;
}

export interface Prior {
  /** Imaginary games and the share of them won by the player making the move. */
  readonly visits: number;
  readonly value: number;
}

/** A game as the search sees it. Moves are whole numbers below `moveSpace`. */
export interface MctsGame<S> {
  /** Moves are numbered 0 to moveSpace - 1. */
  readonly moveSpace: number;
  readonly players: number;
  /** The player to move, from 0. */
  toMove(state: S): number;
  /** The moves worth searching here (may leave out moves that are never good). */
  moves(state: S): readonly number[];
  /** The state after a move. Tree states are kept, so this must not change `state`. */
  play(state: S, move: number): S;
  /** Each player's reward (0 to 1) if the game is over here, else null. */
  terminal(state: S): readonly number[] | null;
  /** A private copy of a state for one playout. */
  fork(state: S): S;
  /** Plays a forked state to the end (changing it) and returns each player's reward, 0 to 1. */
  rollout(state: S, rng: Rng, log: MoveLog): readonly number[];
  /** Prior knowledge about a move, for a new child. */
  prior?(state: S, move: number): Prior | null;
}

export interface MctsOptions {
  readonly playouts: number;
  /** RAVE equivalence: the real visits at which RAVE and real results weigh about the same. 0 turns RAVE off. */
  readonly raveEquivalence?: number;
  /** UCB exploration constant (small when RAVE and priors are on). */
  readonly exploration?: number;
  /** A node's children are added on this visit (1 adds them at once). */
  readonly expandAt?: number;
}

export interface ChildStats {
  readonly move: number;
  /** Real playouts through this move (priors excluded). */
  readonly visits: number;
  /** Mean reward for the player who makes the move (priors included), 0 to 1. */
  readonly value: number;
  readonly raveVisits: number;
  readonly raveValue: number;
}

export interface MctsResult {
  /** The most visited move. */
  readonly best: number;
  /** Root moves, most visited first. */
  readonly children: readonly ChildStats[];
  /** The root player's mean reward over all playouts. */
  readonly value: number;
  readonly playouts: number;
}

class Node<S> {
  /** The state here; null for a leaf visited once, rebuilt from the parent if it is visited again. */
  state: S | null;
  readonly parent: Node<S> | null;
  readonly move: number;
  /** The player to move here. */
  readonly toMove: number;
  visits = 0;
  terminal: readonly number[] | null;
  moves: Int32Array | null = null;
  /** Per child: visits and wins (priors included), RAVE visits and wins, real visits. */
  n: Float64Array | null = null;
  w: Float64Array | null = null;
  rn: Float64Array | null = null;
  rw: Float64Array | null = null;
  real: Float64Array | null = null;
  kids: (Node<S> | undefined)[] = [];
  /** Child slot by move, -1 when the move is not a child (for RAVE). */
  slot: Int32Array | null = null;

  constructor(state: S | null, parent: Node<S> | null, move: number, toMove: number, terminal: readonly number[] | null) {
    this.state = state;
    this.parent = parent;
    this.move = move;
    this.toMove = toMove;
    this.terminal = terminal;
  }
}

function stateOf<S>(game: MctsGame<S>, node: Node<S>): S {
  if (node.state === null) node.state = game.play(stateOf(game, node.parent as Node<S>), node.move);
  return node.state;
}

class Log implements MoveLog {
  players: number[] = [];
  moves: number[] = [];
  record(player: number, move: number): void {
    this.players.push(player);
    this.moves.push(move);
  }
  reset(): void {
    this.players.length = 0;
    this.moves.length = 0;
  }
}

function expand<S>(game: MctsGame<S>, node: Node<S>): void {
  const state = stateOf(game, node);
  const moves = game.moves(state);
  const k = moves.length;
  node.moves = Int32Array.from(moves);
  node.n = new Float64Array(k);
  node.w = new Float64Array(k);
  node.rn = new Float64Array(k);
  node.rw = new Float64Array(k);
  node.real = new Float64Array(k);
  node.kids = new Array<Node<S> | undefined>(k);
  node.slot = new Int32Array(game.moveSpace).fill(-1);
  for (let i = 0; i < k; i++) {
    const move = moves[i] as number;
    node.slot[move] = i;
    const prior = game.prior?.(state, move);
    if (prior && prior.visits > 0) {
      node.n[i] = prior.visits;
      node.w[i] = prior.visits * prior.value;
      node.rn[i] = prior.visits;
      node.rw[i] = prior.visits * prior.value;
    }
  }
}

function select<S>(node: Node<S>, raveK: number, c: number): number {
  const n = node.n as Float64Array;
  const w = node.w as Float64Array;
  const rn = node.rn as Float64Array;
  const rw = node.rw as Float64Array;
  const k = n.length;
  const logN = Math.log(node.visits + 1);
  let best = 0;
  let bestValue = -Infinity;
  for (let i = 0; i < k; i++) {
    const ni = n[i] as number;
    const rni = rn[i] as number;
    let value: number;
    if (ni === 0 && rni === 0) value = 1.1; // untried moves first
    else {
      const q = ni > 0 ? (w[i] as number) / ni : 0.5;
      if (raveK > 0 && rni > 0) {
        const beta = Math.sqrt(raveK / (3 * ni + raveK));
        value = (1 - beta) * q + beta * ((rw[i] as number) / rni);
      } else value = q;
      if (c > 0) value += c * Math.sqrt(logN / (ni + 1));
    }
    if (value > bestValue) {
      bestValue = value;
      best = i;
    }
  }
  return best;
}

/** Runs a search from `root` and returns the statistics of the root's moves. */
export function mcts<S>(game: MctsGame<S>, root: S, options: MctsOptions, rng: Rng): MctsResult {
  const raveK = options.raveEquivalence ?? 0;
  const c = options.exploration ?? (raveK > 0 ? 0 : 0.7);
  const expandAt = Math.max(1, options.expandAt ?? 2);
  const top = new Node<S>(root, null, -1, game.toMove(root), game.terminal(root));
  if (top.terminal) throw new Error('mcts() needs a position where the game is not over');
  expand(game, top);
  if ((top.moves as Int32Array).length === 0) throw new Error('mcts() needs a position with at least one move');
  const log = new Log();
  const path: Node<S>[] = [];
  const slots: number[] = [];
  const marked = new Int32Array(game.moveSpace);
  let stamp = 0;
  let rootReward = 0;

  for (let playout = 0; playout < options.playouts; playout++) {
    path.length = 0;
    slots.length = 0;
    log.reset();
    let node = top;
    let rewards: readonly number[] | null = null;
    let fresh: S | null = null;
    // Down the tree.
    for (;;) {
      path.push(node);
      if (node.terminal) {
        rewards = node.terminal;
        break;
      }
      if (!node.moves) {
        if (node.visits + 1 >= expandAt) expand(game, node);
        else break;
      }
      if ((node.moves as Int32Array).length === 0) break;
      const i = select(node, raveK, c);
      slots.push(i);
      const move = (node.moves as Int32Array)[i] as number;
      log.record(node.toMove, move);
      let child = node.kids[i];
      if (!child) {
        // A new leaf: its state goes straight into the playout and is rebuilt if needed later.
        const state = game.play(stateOf(game, node), move);
        child = new Node<S>(null, node, move, game.toMove(state), game.terminal(state));
        node.kids[i] = child;
        path.push(child);
        rewards = child.terminal;
        fresh = state;
        node = child;
        break;
      }
      node = child;
    }
    if (!rewards) rewards = game.rollout(fresh ?? game.fork(stateOf(game, node)), rng, log);

    // Back up: real results along the path, RAVE results for every move played later by the mover.
    for (let d = 0; d < path.length; d++) {
      const at = path[d] as Node<S>;
      at.visits++;
      if (d >= slots.length || !at.moves) continue;
      const i = slots[d] as number;
      const mover = at.toMove;
      const reward = rewards[mover] as number;
      (at.n as Float64Array)[i] = ((at.n as Float64Array)[i] as number) + 1;
      (at.w as Float64Array)[i] = ((at.w as Float64Array)[i] as number) + reward;
      (at.real as Float64Array)[i] = ((at.real as Float64Array)[i] as number) + 1;
      if (raveK > 0) {
        const slot = at.slot as Int32Array;
        stamp++;
        for (let j = d; j < log.moves.length; j++) {
          const m = log.moves[j] as number;
          if (marked[m] === stamp) continue;
          marked[m] = stamp;
          if (log.players[j] !== mover) continue;
          const s = slot[m] as number;
          if (s < 0) continue;
          (at.rn as Float64Array)[s] = ((at.rn as Float64Array)[s] as number) + 1;
          (at.rw as Float64Array)[s] = ((at.rw as Float64Array)[s] as number) + reward;
        }
      }
    }
    rootReward += rewards[top.toMove] as number;
  }

  const moves = top.moves as Int32Array;
  const children: ChildStats[] = [];
  for (let i = 0; i < moves.length; i++) {
    const n = (top.n as Float64Array)[i] as number;
    const rn = (top.rn as Float64Array)[i] as number;
    children.push({
      move: moves[i] as number,
      visits: (top.real as Float64Array)[i] as number,
      value: n > 0 ? ((top.w as Float64Array)[i] as number) / n : 0.5,
      raveVisits: rn,
      raveValue: rn > 0 ? ((top.rw as Float64Array)[i] as number) / rn : 0.5,
    });
  }
  children.sort((a, b) => b.visits - a.visits || b.value - a.value);
  return { best: (children[0] as ChildStats).move, children, value: options.playouts > 0 ? rootReward / options.playouts : 0.5, playouts: options.playouts };
}
