/**
 * Shogi CPU levels and coach, on the built-in engine (engine.ts, src/ai/pvs.ts).
 *
 * - Levels 1 to 3 search shallowly, score every move and sometimes choose a worse one that still
 *   looks reasonable, with a liking for captures; levels 1 and 2 do not see checking drops in
 *   their quiescence, so drop tactics catch them out. The choice comes from the game's seed.
 * - Levels 4 to 7 play the engine's best move at rising node budgets.
 * Handicap games (presets.ts) give further honest steps below the strong levels.
 *
 * Strength comes from node budgets only, so a level plays the same on a phone and in tests.
 */
import type { AdviseInput, BotChoice, BotInput, BotSet } from '../../ai/bot';
import type { PvsResult } from '../../ai/pvs';
import { isMateScore, matePlies } from '../../ai/pvs';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import type { Color, Position } from './core';
import { BASE, capturedOf, EMPTY, isDrop, isPromotion, KING, moveFrom, moveTo, movingOf, parseSfen, squareName, typeOfCode } from './core';
import type { EngineHistory } from './engine';
import { searchSfen, VALUE } from './engine';
import type { ShogiLevelParams } from './levels';
import { LEVEL_PARAMS, SHOGI_LEVELS } from './levels';
import { MateSolver } from './mate';
import { canonicalOf, toCanonical } from './notation';
import { IMPASSE_24 } from './presets';
import type { ShogiAction, ShogiState, ShogiView } from './rules';
import { canDeclare, canonicalAction, impassePoints, legalPairs, PIECE_NAMES, shogi } from './rules';

/** Node budget for coach questions: enough to catch blunders, quick on a phone. */
export const COACH_NODES = 120_000;
/** A move that loses this much (engine units) gets a blunder warning. */
const BLUNDER_LOSS = 280;
/** They threaten something when moving twice would gain them this much. */
const THREAT_GAIN = 220;

const hashCache = new Map<string, readonly [number, number]>();

function hashOfKey(key: string): readonly [number, number] {
  let h = hashCache.get(key);
  if (!h) {
    const p = parseSfen(`${key} 1`);
    h = [p.hashLo, p.hashHi];
    if (hashCache.size > 4_000) hashCache.clear();
    hashCache.set(key, h);
  }
  return h;
}

/** The game so far, for the engine's repetition checks: the last positions with the same hands matter. */
export function engineHistory(state: ShogiState): EngineHistory {
  const keys = state.keys.slice(0, -1).slice(-48);
  const checks = state.checks.slice(0, -1).slice(-48);
  return { hashes: keys.map(hashOfKey), checks };
}

export interface SearchOptions {
  readonly nodes: number;
  readonly maxDepth?: number;
  readonly exact?: boolean;
  readonly checkDrops?: boolean;
  readonly quiescence?: number;
  readonly exclude?: readonly number[];
  readonly noise?: number;
  readonly salt?: number;
}

/** Searches a state's position with its history. */
export function searchState(state: ShogiState, options: SearchOptions): { result: PvsResult; p: Position } {
  const { result, game } = searchSfen(
    {
      sfen: state.sfen,
      history: engineHistory(state),
      first: state.rules.first as Color,
      limits: {
        nodes: options.nodes,
        maxDepth: options.maxDepth ?? 30,
        exactRoot: options.exact ?? false,
        quiescence: options.quiescence ?? 8,
        ...(options.exclude ? { exclude: options.exclude } : {}),
      },
    },
    { checkDrops: options.checkDrops ?? true, noise: options.noise ?? 0, salt: options.salt ?? 0 },
  );
  return { result, p: game.p };
}

/** Picks a move from exact root scores, sometimes a planned, human-looking mistake. */
export function pickWithErrors(result: PvsResult, params: ShogiLevelParams, rng: Rng): number {
  const best = result.scored[0];
  if (!best) return result.best;
  if (params.error <= 0 || rng.next() >= params.error) return best.move;
  // Never throw away a forced mate, and never walk into one on purpose.
  if (isMateScore(best.score)) return best.move;
  const candidates = result.scored.slice(1).filter((s) => best.score - s.score <= params.window && !isMateScore(s.score));
  if (candidates.length === 0) return best.move;
  const weights = candidates.map((s) => {
    const loss = Math.max(0, best.score - s.score);
    const capture = capturedOf(s.move) !== EMPTY ? params.captureBias : 1;
    return capture / (1 + loss / 150);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let pick = rng.next() * total;
  for (let i = 0; i < candidates.length; i++) {
    pick -= weights[i]!;
    if (pick <= 0) return candidates[i]!.move;
  }
  return candidates[candidates.length - 1]!.move;
}

/** Reason tags for a move, for the log and the review. */
export function moveTags(p: Position, m: number): string[] {
  const tags: string[] = [];
  const captured = capturedOf(m);
  if (isDrop(m)) tags.push('shogi-drop');
  if (captured !== EMPTY) tags.push(`shogi-takes-${PIECE_NAMES[BASE[typeOfCode(captured)]!]}`);
  if (isPromotion(m)) tags.push('promotes');
  p.make(m);
  const check = p.inCheck();
  const mate = check && !p.hasLegalMove();
  p.unmake(m);
  if (mate) return ['mate'];
  if (check) tags.push('check');
  return tags;
}

function actionFor(state: ShogiState, m: number): ShogiAction {
  const { p, moves, actions } = legalPairs(state);
  const index = moves.indexOf(m);
  if (index < 0) throw new Error(`The engine chose ${canonicalOf(p.geo, m)}, which is not legal here`);
  return actions[index]!;
}

/** Whether the CPU should claim an impasse now (a win always; a draw when it is not ahead). */
function shouldDeclare(state: ShogiState, p: Position): boolean {
  if (!canDeclare(state, p)) return false;
  if (state.rules.impasse === 'declare-27') return true;
  const me = p.side;
  const mine = impassePoints(p, me, state.rules);
  const theirs = impassePoints(p, (1 - me) as Color, state.rules);
  if (mine < IMPASSE_24) return false;
  if (theirs < IMPASSE_24) return true;
  return mine <= theirs;
}

/** Score from Black's point of view, and mate in plies (positive when Black mates). */
function blackScore(p: Position, score: number): { black: number; mate: number | null } {
  const sign = p.side === 0 ? 1 : -1;
  if (isMateScore(score)) return { black: sign * (score > 0 ? 9_999 : -9_999), mate: sign * (score > 0 ? matePlies(score) : -matePlies(score)) };
  return { black: sign * score, mate: null };
}

export type HintIdea = 'mate' | 'win-material' | 'promote' | 'drop' | 'check' | 'fork' | 'defend' | 'castle' | 'improve';

/** What a move is about, in a word the coach can explain. */
export function ideaOf(p: Position, result: PvsResult): HintIdea {
  const m = result.best;
  if (isMateScore(result.score) && result.score > 0 && matePlies(result.score) <= 5) return 'mate';
  const captured = capturedOf(m);
  // Material won over the first plies of the line.
  let swing = 0;
  const played: number[] = [];
  for (const [i, move] of result.pv.slice(0, 4).entries()) {
    const c = capturedOf(move);
    const gain = (c !== EMPTY ? VALUE[typeOfCode(c)]! : 0) + (isPromotion(move) ? 200 : 0);
    swing += i % 2 === 0 ? gain : -gain;
    if (!p.isLegal(move)) break;
    p.make(move);
    played.push(move);
  }
  for (let i = played.length - 1; i >= 0; i--) p.unmake(played[i]!);
  if (captured !== EMPTY && swing >= 150) return 'win-material';
  if (isPromotion(m)) return 'promote';
  p.make(m);
  const check = p.inCheck();
  // A fork: the moved or dropped piece attacks two valuable enemy pieces.
  const to = moveTo(m);
  let targets = 0;
  const code = p.board[to]!;
  for (const sq of p.geo.squares) {
    const c = p.board[sq]!;
    if (c === EMPTY || c >= 64 || (c >> 4) === (code >> 4)) continue;
    const type = typeOfCode(c);
    if (type !== KING && VALUE[type]! < 400) continue;
    if (p.pieceAttacks(code, to, sq)) targets++;
  }
  p.unmake(m);
  if (targets >= 2) return 'fork';
  if (swing >= 250) return 'win-material';
  if (check) return 'check';
  if (isDrop(m)) return 'drop';
  const type = typeOfCode(movingOf(m));
  if (type === KING) return 'castle';
  return 'improve';
}

function describeMove(p: Position, m: number): { move: string; from: string | null; to: string; drop: string | null } {
  const geo = p.geo;
  return {
    move: canonicalOf(geo, m),
    from: isDrop(m) ? null : squareName(geo, moveFrom(m)),
    to: squareName(geo, moveTo(m)),
    drop: isDrop(m) ? canonicalOf(geo, m).slice(0, 1) : null,
  };
}

function textOf(state: ShogiState, m: number): string {
  try {
    return actionFor(state, m).text;
  } catch {
    return '';
  }
}

/** Node budgets asked for by the interface, kept within what a phone searches in a few seconds. */
function clampNodes(value: Json | undefined, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(1_500_000, Math.max(1_000, Math.round(value))) : fallback;
}

/** The same position with the other side to move: what would they do with a free move? */
function passed(state: ShogiState): ShogiState | null {
  const p = parseSfen(state.sfen);
  if (p.inCheck()) return null;
  p.makeNull();
  if (p.inCheck()) return null;
  const sfen = p.sfen();
  return { ...state, sfen, keys: [p.key()], checks: [false], result: null };
}

function advise(view: ShogiView, query: Json): Json {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const state = view;
  switch (query.type) {
    case 'eval': {
      const { result, p } = searchState(state, { nodes: COACH_NODES });
      const { black, mate } = blackScore(p, result.score);
      return { black, mate, best: canonicalOf(p.geo, result.best) };
    }
    case 'hint': {
      const { result, p } = searchState(state, { nodes: COACH_NODES });
      let idea: HintIdea = ideaOf(p, result);
      if (idea === 'improve' || idea === 'castle' || idea === 'check' || idea === 'drop') {
        const free = passed(state);
        if (free && free.result === null) {
          const theirs = searchState(free, { nodes: COACH_NODES / 2 });
          if ((isMateScore(theirs.result.score) && theirs.result.score > 0) || theirs.result.score + result.score >= THREAT_GAIN) idea = 'defend';
        }
      }
      return { ...describeMove(p, result.best), text: textOf(state, result.best), idea, piece: isDrop(result.best) ? null : PIECE_NAMES[typeOfCode(movingOf(result.best))]! };
    }
    case 'threats': {
      const free = passed(state);
      if (!free || free.result !== null) return { threats: [] };
      const now = searchState(state, { nodes: COACH_NODES / 2 });
      const theirs = searchState(free, { nodes: COACH_NODES / 2 });
      const gain = theirs.result.score + now.result.score;
      const mates = isMateScore(theirs.result.score) && theirs.result.score > 0;
      if (!mates && gain < THREAT_GAIN) return { threats: [] };
      const m = theirs.result.best;
      return { threats: [{ ...describeMove(theirs.p, m), text: textOf(free, m), mate: mates ? matePlies(theirs.result.score) : null, gain: Math.round(gain) }] };
    }
    case 'check-move': {
      const canonical = typeof query.move === 'string' ? toCanonical(query.move) : null;
      const { p, moves } = legalPairs(state);
      const m = canonical === null ? -1 : (moves.find((x) => canonicalOf(p.geo, x) === canonical) ?? -1);
      if (m < 0) throw new Error(`${typeof query.move === 'string' ? query.move : 'That move'} is not legal here`);
      const before = searchState(state, { nodes: COACH_NODES });
      const after = shogi.apply(state, actionFor(state, m)).state;
      if (after.result) return { warn: false, loss: 0 };
      const reply = searchState(after, { nodes: COACH_NODES });
      const got = -reply.result.score;
      const best = before.result.score;
      const loss = Math.max(0, best - got);
      const allowsMate = isMateScore(reply.result.score) && reply.result.score > 0;
      const warn = allowsMate || (loss >= BLUNDER_LOSS && got < 600);
      const replyMove = reply.result.best;
      const taken = capturedOf(replyMove);
      const hangs = taken !== EMPTY && VALUE[typeOfCode(taken)]! >= 300 ? PIECE_NAMES[BASE[typeOfCode(taken)]!]! : null;
      return {
        warn,
        loss: Math.round(loss),
        reason: allowsMate ? 'allows-mate' : hangs ? `hangs-${hangs}` : 'loses-ground',
        mateIn: allowsMate ? matePlies(reply.result.score) : null,
        reply: { ...describeMove(reply.p, replyMove), text: textOf(after, replyMove) },
      };
    }
    case 'best': {
      // The strongest move at a given size of search: free-play defence in lessons and drills.
      const nodes = clampNodes(query.nodes, COACH_NODES);
      const { result, p } = searchState(state, { nodes });
      return { uci: canonicalOf(p.geo, result.best), text: textOf(state, result.best) };
    }
    case 'analyse': {
      // Scores for the best moves, from the side to move's point of view: game review.
      const nodes = clampNodes(query.nodes, COACH_NODES);
      const lines = typeof query.multiPv === 'number' ? Math.min(3, Math.max(1, Math.round(query.multiPv))) : 2;
      const first = searchState(state, { nodes });
      const out = [first];
      const excluded = [first.result.best];
      while (out.length < lines && first.result.scored.length > out.length) {
        const next = searchState(state, { nodes: Math.round(nodes / 2), exclude: excluded });
        out.push(next);
        excluded.push(next.result.best);
      }
      return {
        best: canonicalOf(first.p.geo, first.result.best),
        lines: out.map(({ result, p }) => ({
          uci: canonicalOf(p.geo, result.best),
          score: isMateScore(result.score) ? (result.score > 0 ? 100_000 - matePlies(result.score) : -100_000 + matePlies(result.score)) : result.score,
          mate: isMateScore(result.score) ? (result.score > 0 ? matePlies(result.score) : -matePlies(result.score)) : null,
          pv: result.pv.slice(0, 8).map((m) => canonicalOf(p.geo, m)),
        })),
      };
    }
    case 'mate': {
      // A forced mate by checks within a few plies (coach and problems).
      const plies = typeof query.plies === 'number' ? Math.min(7, Math.max(1, Math.round(query.plies))) : 5;
      const p = parseSfen(state.sfen);
      const solver = new MateSolver(p, 400_000);
      try {
        const found = solver.shortest(plies);
        if (found === null) return { mate: null };
        const line = solver.mainLine(found);
        return { mate: found, line: (line?.line ?? []).map((m) => canonicalOf(p.geo, m)) };
      } catch {
        return { mate: null };
      }
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

export const shogiBots: BotSet<ShogiView, ShogiAction> = {
  gameId: 'shogi',
  levels: SHOGI_LEVELS,
  choose({ view, level, rng }: BotInput<ShogiView>): BotChoice<ShogiAction> {
    const params = LEVEL_PARAMS[level];
    if (!params) throw new Error(`Shogi has no level ${level}`);
    const state = view;
    if (shogi.turn(state) === null) throw new Error('No move to make: the game is over');
    const { p, actions } = legalPairs(state);
    if (shouldDeclare(state, p)) {
      const declare = actions.find((a) => a.type === 'declare');
      if (declare) return { action: declare, tags: ['shogi-impasse'], nodes: 0 };
    }
    const { result, p: searched } = searchState(state, {
      nodes: params.nodes,
      maxDepth: params.maxDepth,
      exact: params.exact,
      checkDrops: params.checkDrops,
      quiescence: params.quiescence,
      noise: params.noise,
      salt: rng.int(0x7fffffff),
    });
    const m = params.exact ? pickWithErrors(result, params, rng) : result.best;
    return { action: actionFor(state, m), tags: moveTags(searched, m), nodes: result.nodes };
  },
  advise: ({ view, query }: AdviseInput<ShogiView>) => advise(view, query),
  encode: (action) => canonicalAction(action),
};

/** The piece type moved by a packed move (for tests and the coach). */
export function movedType(m: number): number {
  return typeOfCode(movingOf(m));
}
