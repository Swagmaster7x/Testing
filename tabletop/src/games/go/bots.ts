/**
 * Go CPU levels and coach, on the shared Monte Carlo tree search (src/ai/mcts.ts) with Go's
 * playouts and priors (engine.ts).
 *
 * - Levels differ by playout budget, never by time. Levels 1 to 3 also keep a beginner's habits:
 *   now and then they say atari because they can, grab a stone, or answer right next to your
 *   last stone, instead of the move the search found.
 * - Passing: when you have just passed, the CPU passes too if it wins the count as things stand
 *   (with the dead stones it sees); otherwise it plays on. It also passes once the board is
 *   settled and nothing is gained by playing.
 * - Marking dead stones: the CPU marks what its playouts say is dead, chain by chain, then says
 *   done. It accepts your marking when it gives the same winner as its own. The estimate is
 *   seeded from the position, so every level (and both sides) sees the same dead stones.
 * - The review's score and ownership map (M15) come from a small KataGo network (net/), one
 *   evaluation per position, when the bots are given a way to load it (`goBotsWith`).
 */
import type { AdviseInput, BotChoice, BotInput, BotSet } from '../../ai/bot';
import type { MctsResult } from '../../ai/mcts';
import { mcts } from '../../ai/mcts';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { createRng } from '../../core/rng';
import type { Color } from './board';
import { Board, opponent } from './board';
import { handicapPoints } from './coords';
import type { SearchRules } from './engine';
import { GoSearch, ownershipMap } from './engine';
import { GO_LEVELS } from './levels';
import type { GoAction, GoResult, GoState, GoView } from './rules';
import { boardOf, colorOf, countState, go, legalPoints, pointName, sgfName, winnerOf } from './rules';
import { compensationFor } from './score';
import type { Network } from './net';
import { evaluate } from './net';

interface LevelParams {
  /** Playouts on 9×9; bigger boards use fewer (see `scaled`). */
  readonly playouts: number;
  /** How often a beginner's habit wins over the search. */
  readonly habit: number;
}

export const LEVEL_PARAMS: Readonly<Record<number, LevelParams>> = {
  1: { playouts: 60, habit: 0.6 },
  2: { playouts: 200, habit: 0.35 },
  3: { playouts: 600, habit: 0.15 },
  4: { playouts: 1_500, habit: 0 },
  5: { playouts: 3_000, habit: 0 },
  6: { playouts: 9_000, habit: 0 },
};

/** Playouts for the coach's questions (hint, threats, the territory estimate). */
export const COACH_PLAYOUTS = 3_000;
/** Playouts behind the dead-stone estimate, the same for every level. */
export const DEAD_PLAYOUTS = 600;
const RAVE = 1_000;

/** Playouts cost more on bigger boards, so the budgets shrink to keep answers about as quick. */
export function scaled(playouts: number, size: number): number {
  if (size <= 9) return playouts;
  if (size <= 13) return Math.max(20, Math.round(playouts * 0.45));
  return Math.max(20, Math.round(playouts * 0.22));
}

export function searchRulesOf(s: GoState): SearchRules {
  return {
    komi: s.rules.komi + compensationFor(s.rules.compensation, s.handicap),
    suicide: s.rules.suicide,
    captureTarget: s.rules.captureTarget,
    captured: s.prisoners,
  };
}

/** The position as a search board, with the last move set for the playouts. */
export function searchBoard(view: GoState): Board {
  const board = boardOf(view);
  board.last = view.last >= 0 ? board.fromPoint(view.last) : view.last;
  return board;
}

export interface Analysis {
  readonly result: MctsResult;
  readonly search: GoSearch;
  readonly board: Board;
  /** Per point, from -1 (White's at the end) to 1 (Black's). */
  readonly ownership: Float64Array;
}

/** A search from the side to move's point of view. Legal moves come from the full rules (superko). */
export function analysePosition(view: GoState, playouts: number, rng: Rng): Analysis {
  if (view.phase !== 'play') throw new Error('The search needs a position in play');
  const board = searchBoard(view);
  const allowed = new Set<number>(legalPoints(view).map((p) => board.fromPoint(p)));
  allowed.add(board.cells);
  const search = new GoSearch(view.size, searchRulesOf(view), allowed);
  const result = mcts(search, { board, toMove: colorOf(view.toMove), passes: view.passes, depth: 0 }, { playouts: Math.max(1, playouts), raveEquivalence: RAVE }, rng);
  return { result, search, board, ownership: ownershipMap(search, board) };
}

/** Ownership from plain playouts, seeded by the position so every caller sees the same. */
export function positionOwnership(view: GoState, playouts = DEAD_PLAYOUTS): Float64Array {
  const board = searchBoard(view);
  const search = new GoSearch(view.size, { ...searchRulesOf(view), captureTarget: 0 }, null);
  const rng = createRng(`dead/${view.history[view.history.length - 1] ?? view.board}`);
  const log = { record: () => undefined };
  const toMove = colorOf(view.toMove);
  for (let i = 0; i < playouts; i++) search.rollout({ board: board.copy(), toMove, passes: 0, depth: 0 }, rng, log);
  return ownershipMap(search, board);
}

/** Chains whose stones the playouts nearly always lose: the dead-stone suggestion. */
export function deadFromOwnership(view: GoState, ownership: Float64Array, threshold = 0.3): number[] {
  const board = Board.fromText(view.size, view.board);
  const out: number[] = [];
  const done = new Set<number>();
  for (let p = 0; p < view.board.length; p++) {
    if (view.board[p] === '.' || done.has(p)) continue;
    const i = board.fromPoint(p);
    const chain = board.chain(board.head[i] as number).map((s) => board.point(s));
    for (const q of chain) done.add(q);
    const mean = chain.reduce((sum, q) => sum + (ownership[q] as number), 0) / chain.length;
    const black = view.board[p] === 'X';
    if ((black && mean < -threshold) || (!black && mean > threshold)) out.push(...chain);
  }
  return out.sort((a, b) => a - b);
}

export function estimateDead(view: GoState): number[] {
  if (!view.rules.marking || view.rules.captureTarget > 0) return [];
  return deadFromOwnership(view, positionOwnership(view));
}

function resultWith(view: GoState, dead: readonly number[]): GoResult {
  if (view.rules.captureTarget > 0) return { kind: 'captures', black: view.prisoners[0], white: view.prisoners[1] };
  const count = countState(view, dead);
  return { kind: 'score', black: count.black, white: count.white };
}

/** The share of the board still in doubt after a search (ownership not clearly one side's). */
export function unsettledShare(ownership: Float64Array): number {
  let open = 0;
  for (const v of ownership) if (Math.abs(v) < 0.6) open++;
  return open / Math.max(1, ownership.length);
}

const play = (p: number, size: number): GoAction => ({ type: 'play', at: sgfName(p, size), name: pointName(p, size) });
const PASS: GoAction = { type: 'pass' };

function legalActionFor(view: GoState, seat: number, wanted: GoAction): GoAction {
  const found = go.legal(view, seat).find((a) => go.codec.action.toJSON(a) === go.codec.action.toJSON(wanted));
  if (!found) throw new Error(`The CPU chose ${go.codec.action.toText(wanted)}, which is not legal here`);
  return found;
}

/** True when colour c at point p leaves an opponent chain next to it with exactly one liberty. */
export function putsInAtari(board: Board, p: number, c: Color): boolean {
  const i = board.fromPoint(p);
  if (!board.isLegal(i, c, false)) return false;
  const after = board.copy();
  after.play(i, c);
  for (let d = 0; d < 4; d++) {
    const n = i + (after.dirs[d] as number);
    if (after.color[n] === opponent(c) && after.inAtari(after.head[n] as number)) return true;
  }
  return false;
}

/** A beginner's move: say atari if you can, grab a stone, or answer next to the last stone. */
function habitMove(view: GoState, rng: Rng): number | null {
  const board = Board.fromText(view.size, view.board);
  if (view.ko >= 0) board.ko = board.fromPoint(view.ko);
  const c = colorOf(view.toMove);
  const legal = legalPoints(view);
  const ataris = legal.filter((p) => putsInAtari(board, p, c));
  if (ataris.length > 0) return rng.pick(ataris);
  const captures = legal.filter((p) => board.capturesAt(board.fromPoint(p), c) > 0);
  if (captures.length > 0) return rng.pick(captures);
  if (view.last >= 0) {
    const x = view.last % view.size;
    const y = Math.floor(view.last / view.size);
    const near = legal.filter((p) => Math.abs((p % view.size) - x) + Math.abs(Math.floor(p / view.size) - y) === 1);
    if (near.length > 0) return rng.pick(near);
  }
  return null;
}

/** Reason tags for a move, for the log and the review. */
export function moveTags(view: GoState, action: GoAction): string[] {
  if (action.type === 'pass') return ['go-pass'];
  if (action.type !== 'play' || view.phase !== 'play') return [];
  const board = boardOf(view);
  const point = (action.at.charCodeAt(1) - 97) * view.size + (action.at.charCodeAt(0) - 97);
  const i = board.fromPoint(point);
  const c = colorOf(view.toMove);
  const tags: string[] = [];
  if (board.capturesAt(i, c) > 0) tags.push('go-takes');
  for (let d = 0; d < 4; d++) {
    const n = i + (board.dirs[d] as number);
    if (board.color[n] === c && board.inAtari(board.head[n] as number)) {
      tags.push('go-saves');
      break;
    }
  }
  if (putsInAtari(board, point, c)) tags.push('go-atari');
  return tags;
}

function placeHandicap(view: GoState): GoAction {
  const free = handicapPoints(view.size, view.handicap).find((p) => view.board[p] === '.');
  const p = free ?? legalPoints(view)[0];
  if (p === undefined) throw new Error('Nowhere to place a handicap stone');
  return play(p, view.size);
}

/** The CPU's turn while marking dead stones. */
function scoringChoice(view: GoState, seat: number): GoAction {
  const mine = estimateDead(view);
  const marked = view.dead;
  const same = mine.length === marked.length && mine.every((p, i) => p === marked[i]);
  if (same) return { type: 'done' };
  if (view.agreed !== null && view.agreed !== seat) {
    // They have said done: accept their marking when it gives the same winner as ours.
    if (winnerOf(resultWith(view, marked)) === winnerOf(resultWith(view, mine))) return { type: 'done' };
  }
  // Mark (or unmark) one chain at a time until the marking is ours.
  const want = new Set(mine);
  const have = new Set(marked);
  for (let p = 0; p < view.board.length; p++) {
    if (view.board[p] === '.') continue;
    if (want.has(p) !== have.has(p)) return { type: 'mark', at: sgfName(p, view.size), name: pointName(p, view.size) };
  }
  return { type: 'done' };
}

/** Picks the CPU's move in play. */
function playChoice(view: GoState, seat: number, params: LevelParams, rng: Rng): { action: GoAction; playouts: number } {
  const playouts = scaled(params.playouts, view.size);
  const a = analysePosition(view, playouts, rng);
  const pass = a.board.cells;
  const children = a.result.children;
  const nonPass = children.filter((ch) => ch.move !== pass);
  const settled = unsettledShare(a.ownership) <= 0.04;
  const bestPlay = nonPass[0];
  const toAction = (move: number): GoAction => (move === pass ? PASS : play(a.board.point(move), view.size));

  if (view.passes >= 1) {
    // Our pass ends play: pass when we win the count as it stands, or when the game is lost and settled.
    if (winnerOf(resultWith(view, estimateDead(view))) === seat) return { action: PASS, playouts };
    if (!bestPlay || (settled && a.result.value < 0.1)) return { action: PASS, playouts };
    return { action: toAction(bestPlay.move), playouts };
  }
  const best = children[0];
  if (!best || best.move === pass || !bestPlay) return { action: PASS, playouts };
  const passChild = children.find((ch) => ch.move === pass);
  if (settled && passChild && passChild.visits >= 10 && bestPlay.value - passChild.value < 0.03) return { action: PASS, playouts };
  if (params.habit > 0 && rng.next() < params.habit) {
    const habit = habitMove(view, rng);
    if (habit !== null) return { action: play(habit, view.size), playouts };
  }
  return { action: toAction(bestPlay.move), playouts };
}

// ---------------------------------------------------------------------------------------------
// Coach

export type HintIdea = 'capture' | 'save' | 'atari' | 'connect' | 'cut' | 'extend' | 'block' | 'big-point' | 'pass';

/** What a move is about, in one word the coach can explain. */
export function ideaOf(view: GoState, point: number | null): HintIdea {
  if (point === null) return 'pass';
  const board = boardOf(view);
  const c = colorOf(view.toMove);
  const i = board.fromPoint(point);
  if (board.capturesAt(i, c) > 0) return 'capture';
  const own = new Set<number>();
  const theirs = new Set<number>();
  for (let d = 0; d < 4; d++) {
    const n = i + (board.dirs[d] as number);
    if (board.color[n] === c) {
      const h = board.head[n] as number;
      if (board.inAtari(h)) return 'save';
      own.add(h);
    } else if (board.color[n] === opponent(c)) theirs.add(board.head[n] as number);
  }
  if (putsInAtari(board, point, c)) return 'atari';
  if (own.size >= 2) return 'connect';
  if (theirs.size >= 2) return 'cut';
  if (own.size === 1) return 'extend';
  if (theirs.size === 1) return 'block';
  return 'big-point';
}

function clampPlayouts(value: Json | undefined, fallback: number, size: number): number {
  const base = typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
  return scaled(Math.min(20_000, Math.max(50, base)), size);
}

/** The view with the other side to move (for "what do they threaten?"). */
function swapped(view: GoState): GoState {
  return { ...view, toMove: view.toMove === 0 ? 1 : 0, ko: -1, passes: 0 };
}

function moveJson(view: GoState, board: Board, move: number, pass: number): Json {
  if (move === pass) return { move: 'pass', name: 'pass', point: -1 };
  const p = board.point(move);
  return { move: sgfName(p, view.size), name: pointName(p, view.size), point: p };
}

function scoreEstimate(view: GoState, ownership: Float64Array): number {
  let margin = 0;
  for (const v of ownership) margin += v;
  return Math.round((margin - searchRulesOf(view).komi) * 2) / 2;
}

function advise(view: GoView, query: Json, rng: Rng): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const size = view.size;
  switch (query.type) {
    case 'dead':
      return { dead: estimateDead(view) };
    case 'territory': {
      const ownership = view.phase === 'play' ? analysePosition(view, clampPlayouts(query.playouts, COACH_PLAYOUTS, size), rng).ownership : positionOwnership(view);
      return { ownership: Array.from(ownership, (v) => Math.round(v * 100) / 100), margin: scoreEstimate(view, ownership) };
    }
    case 'eval': {
      if (view.phase !== 'play') return { black: 50, margin: 0 };
      const a = analysePosition(view, clampPlayouts(query.playouts, COACH_PLAYOUTS, size), rng);
      const mine = a.result.value;
      const black = view.toMove === 0 ? mine : 1 - mine;
      return { black: Math.round(black * 1000) / 10, margin: scoreEstimate(view, a.ownership) };
    }
    case 'hint': {
      if (view.phase !== 'play') return { move: null };
      const a = analysePosition(view, clampPlayouts(query.playouts, COACH_PLAYOUTS, size), rng);
      const best = a.result.children[0];
      if (!best) return { move: null };
      const point = best.move === a.board.cells ? null : a.board.point(best.move);
      return { ...(moveJson(view, a.board, best.move, a.board.cells) as Record<string, Json>), idea: ideaOf(view, point) };
    }
    case 'threats': {
      // Our chains in atari now, and what they would play if it were their move.
      const board = Board.fromText(size, view.board);
      const c = colorOf(view.toMove);
      const inAtari: number[] = [];
      for (let p = 0; p < view.board.length; p++) {
        const i = board.fromPoint(p);
        if (board.color[i] === c && board.inAtari(board.head[i] as number)) inAtari.push(p);
      }
      if (view.phase !== 'play') return { atari: inAtari, threat: null };
      const them = swapped(view);
      const a = analysePosition(them, clampPlayouts(query.playouts, COACH_PLAYOUTS / 2, size), rng);
      const best = a.result.children.find((ch) => ch.move !== a.board.cells);
      if (!best) return { atari: inAtari, threat: null };
      const p = a.board.point(best.move);
      const idea = ideaOf(them, p);
      const serious = idea === 'capture' || idea === 'atari' || idea === 'cut';
      return { atari: inAtari, threat: serious ? { ...(moveJson(view, a.board, best.move, a.board.cells) as Record<string, Json>), idea } : null };
    }
    case 'best': {
      // The strongest move at a given size of search: free play in lessons and drills.
      if (view.phase === 'handicap') return { uci: go.codec.action.toText(placeHandicap(view)) };
      if (view.phase === 'scoring') return { uci: 'done' };
      const nodes = typeof query.nodes === 'number' ? query.nodes / 40 : COACH_PLAYOUTS;
      const a = analysePosition(view, clampPlayouts(nodes, COACH_PLAYOUTS, size), rng);
      const best = a.result.children[0];
      if (!best || best.move === a.board.cells) return { uci: 'pass' };
      return { uci: pointName(a.board.point(best.move), size) };
    }
    case 'analyse': {
      // Values for the best few moves, from the side to move's point of view: game review.
      if (view.phase !== 'play') return { value: 50, lines: [] };
      const a = analysePosition(view, clampPlayouts(query.playouts, COACH_PLAYOUTS, size), rng);
      const lines = a.result.children.slice(0, 4).map((ch) => ({ ...(moveJson(view, a.board, ch.move, a.board.cells) as Record<string, Json>), value: Math.round(ch.value * 1000) / 10, visits: ch.visits }));
      return { value: Math.round(a.result.value * 1000) / 10, lines, margin: scoreEstimate(view, a.ownership) };
    }
    case 'check-move': {
      // A blunder check: how much the move loses against the search's best, in winning chances.
      if (view.phase !== 'play') return { warn: false, loss: 0 };
      const text = typeof query.move === 'string' ? query.move : '';
      const seat = go.turn(view) ?? 0;
      const action = go.legal(view, seat).find((x) => go.codec.action.toJSON(x) === text);
      if (!action) throw new Error(`${text} is not legal here`);
      const playouts = clampPlayouts(query.playouts, COACH_PLAYOUTS, size);
      const before = analysePosition(view, playouts, rng);
      const bestValue = before.result.children[0]?.value ?? before.result.value;
      const after = go.apply(view, action).state;
      if (after.phase !== 'play') return { warn: false, loss: 0 };
      const reply = analysePosition(after, playouts, rng);
      const got = 1 - reply.result.value;
      const loss = Math.max(0, bestValue - got) * 100;
      const replyMove = reply.result.children[0];
      const replyPoint = replyMove && replyMove.move !== reply.board.cells ? reply.board.point(replyMove.move) : null;
      const replyIdea = ideaOf(after, replyPoint);
      return {
        warn: loss >= 15 && got < 0.7,
        loss: Math.round(loss),
        reason: replyIdea === 'capture' ? 'gets-captured' : replyIdea === 'atari' ? 'gets-atari' : 'loses-ground',
        reply: replyPoint === null ? null : { move: sgfName(replyPoint, size), name: pointName(replyPoint, size), point: replyPoint },
      };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const goBots: BotSet<GoView, GoAction> = {
  gameId: 'go',
  levels: GO_LEVELS,
  choose({ view, seat, level, rng }: BotInput<GoView>): BotChoice<GoAction> {
    const params = LEVEL_PARAMS[level];
    if (!params) throw new Error(`Go has no level ${level}`);
    if (go.turn(view) !== seat) throw new Error('It is not the CPU’s turn');
    if (view.phase === 'handicap') return { action: legalActionFor(view, seat, placeHandicap(view)), tags: ['go-handicap'], nodes: 0 };
    if (view.phase === 'scoring') return { action: legalActionFor(view, seat, scoringChoice(view, seat)), tags: [], nodes: DEAD_PLAYOUTS };
    const { action, playouts } = playChoice(view, seat, params, rng);
    const legal = legalActionFor(view, seat, action);
    return { action: legal, tags: moveTags(view, legal), nodes: playouts };
  },
  advise: ({ view, query, rng }: AdviseInput<GoView>) => advise(view, query, rng),
  encode: (action) => go.codec.action.toJSON(action),
};

/** The network's view of a position: score, chances and ownership from Black's side (rounded). */
export function netAnswer(net: Network, view: GoView, recent: readonly number[] | null): Json {
  const komi = view.rules.komi + (view.rules.scoring === 'area' ? compensationFor(view.rules.compensation, view.handicap) : 0);
  const e = evaluate(net, {
    size: view.size,
    board: view.board,
    toMove: view.toMove === 0 ? 'X' : 'O',
    ko: view.ko,
    recent: recent ?? (view.last >= -1 ? [view.last] : []),
    komi,
    preset: view.preset,
  });
  return {
    blackWins: Math.round(e.blackWins * 1000) / 10,
    blackLead: Math.round(e.blackLead * 10) / 10,
    ownership: Array.from(e.ownership, (v) => Math.round(v * 100) / 100),
    best: e.policy.slice(0, 3).map((p) => ({ point: p.point < 0 ? 'pass' : pointName(p.point, view.size), share: Math.round(p.share * 100) })),
  };
}

/**
 * The Go bots with the review's network: the coach question "net" (with `recent`, the last moves
 * as points, -1 for a pass) answers from it. The network loads on first use and stays loaded.
 */
export function goBotsWith(loadNet: () => Promise<Network>): BotSet<GoView, GoAction> {
  let net: Promise<Network> | null = null;
  return {
    ...goBots,
    async advise(input: AdviseInput<GoView>): Promise<Json> {
      const { view, query } = input;
      if (isJsonObject(query) && query.type === 'net') {
        net ??= loadNet().catch((err: unknown) => {
          net = null;
          throw err;
        });
        const recent = Array.isArray(query.recent) ? query.recent.filter((m): m is number => typeof m === 'number') : null;
        return netAnswer(await net, view, recent);
      }
      return advise(view, query, input.rng);
    },
  };
}
