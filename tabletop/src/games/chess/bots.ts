/**
 * Chess CPU levels and coach, both run on Stockfish behind the Engine interface.
 *
 * - Levels 1 to 3 search a little and choose among Stockfish's top lines with planned mistakes:
 *   they sometimes play a worse move that still looks reasonable, and they like captures too much.
 *   The choice comes from the game's seed, so a level-1 game can be replayed exactly.
 * - Levels 4 to 8 use Stockfish's own strength limit (UCI_LimitStrength) at rising ratings.
 *
 * Every search has a node budget, so a level plays the same on a slow phone and in tests.
 */
import type { AdviseInput, BotChoice, BotInput, BotSet } from '../../ai/bot';
import type { Engine, EngineLine, SearchResult } from '../../ai/uci';
import { scoreValue } from '../../ai/uci';
import type { Json } from '../../core/json';
import { isJsonObject } from '../../core/json';
import type { Rng } from '../../core/rng';
import { CHESS_LEVELS } from './levels';
import type { ChessAction, ChessView, PieceType } from './rules';
import { chess, chessAt, PIECE_VALUE, sideToMove, uciOf } from './rules';

interface LevelParams {
  readonly nodes: number;
  readonly multiPv: number;
  /** Chance of playing something other than the engine's first choice. */
  readonly error: number;
  /** Largest loss, in centipawns, a planned mistake may cost. */
  readonly window: number;
  /** How much more likely a capture is to be picked when making a mistake. */
  readonly captureBias: number;
  readonly elo?: number;
}

export const LEVEL_PARAMS: Record<number, LevelParams> = {
  1: { nodes: 500, multiPv: 12, error: 0.9, window: 2_500, captureBias: 3 },
  2: { nodes: 800, multiPv: 10, error: 0.75, window: 1_500, captureBias: 2.5 },
  3: { nodes: 1_500, multiPv: 8, error: 0.6, window: 900, captureBias: 2 },
  4: { nodes: 30_000, multiPv: 1, error: 0, window: 0, captureBias: 1, elo: 1500 },
  5: { nodes: 50_000, multiPv: 1, error: 0, window: 0, captureBias: 1, elo: 1750 },
  6: { nodes: 80_000, multiPv: 1, error: 0, window: 0, captureBias: 1, elo: 2000 },
  7: { nodes: 120_000, multiPv: 1, error: 0, window: 0, captureBias: 1, elo: 2300 },
  8: { nodes: 200_000, multiPv: 1, error: 0, window: 0, captureBias: 1, elo: 2700 },
};

/** Node budget for coach questions: strong enough to catch club-level blunders, quick on a phone. */
const COACH_NODES = 40_000;

function capturedBy(fen: string, uci: string): PieceType | null {
  const board = chessAt(fen);
  try {
    const move = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
    return (move.captured) ?? null;
  } catch {
    return null;
  }
}

/** Picks a move from the engine's lines, sometimes making a planned, human-looking mistake. */
export function pickWithErrors(fen: string, result: SearchResult, params: LevelParams, rng: Rng): string {
  const best = result.lines[0];
  if (!best?.pv[0]) return result.bestmove;
  if (params.error <= 0 || rng.next() >= params.error) return best.pv[0];
  const top = scoreValue(best.score);
  const candidates = result.lines.slice(1).filter((l): l is EngineLine & { pv: [string, ...string[]] } => {
    const first = l.pv[0];
    return first !== undefined && top - scoreValue(l.score) <= params.window;
  });
  if (candidates.length === 0) return best.pv[0];
  const weights = candidates.map((l) => {
    const loss = Math.max(0, top - scoreValue(l.score));
    const capture = capturedBy(fen, l.pv[0]) ? params.captureBias : 1;
    return capture / (1 + loss / 150);
  });
  const total = weights.reduce((a, b) => a + b, 0);
  let pick = rng.next() * total;
  for (let i = 0; i < candidates.length; i++) {
    pick -= weights[i] as number;
    if (pick <= 0) return (candidates[i] as { pv: [string] }).pv[0];
  }
  return (candidates[candidates.length - 1] as { pv: [string] }).pv[0];
}

/** Reason tags for a move, for the log and the review. */
export function moveTags(fen: string, uci: string): string[] {
  const board = chessAt(fen);
  let move;
  try {
    move = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
  } catch {
    return [];
  }
  const tags: string[] = [];
  if (board.isCheckmate()) return ['mate'];
  if (move.captured) tags.push(`takes-${move.captured}`);
  if (move.isKingsideCastle() || move.isQueensideCastle()) tags.push('castles');
  if (move.promotion) tags.push('promotes');
  if (board.inCheck()) tags.push('check');
  return tags;
}

function toAction(view: ChessView, uci: string): ChessAction {
  const seat = chess.turn(view);
  if (seat === null) throw new Error('No move to make: the game is over');
  const found = chess.legal(view, seat).find((a) => uciOf(a) === uci);
  if (!found) throw new Error(`The engine suggested ${uci}, which is not legal here`);
  return found;
}

/** The same position with the other side to move, for "what do they threaten?". Null when in check. */
export function nullMoveFen(fen: string): string | null {
  const board = chessAt(fen);
  if (board.inCheck()) return null;
  const parts = fen.split(' ');
  parts[1] = parts[1] === 'w' ? 'b' : 'w';
  parts[3] = '-';
  const flipped = parts.join(' ');
  try {
    const test = chessAt(flipped);
    return test.inCheck() ? null : flipped;
  } catch {
    return null;
  }
}

function sanOf(fen: string, uci: string): string {
  try {
    return chessAt(fen).move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' }).san;
  } catch {
    return uci;
  }
}

/** Material swing over the first plies of a line, in pawns, for the side to move at the start. */
function materialSwing(fen: string, pv: readonly string[], plies: number): number {
  const board = chessAt(fen);
  const me = board.turn();
  let swing = 0;
  for (const uci of pv.slice(0, plies)) {
    let move;
    try {
      move = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
    } catch {
      break;
    }
    const gain = (move.captured ? PIECE_VALUE[move.captured] : 0) + (move.promotion ? PIECE_VALUE[move.promotion] - 1 : 0);
    swing += move.color === me ? gain : -gain;
  }
  return swing;
}

export type HintIdea = 'mate' | 'win-material' | 'check' | 'fork' | 'save-piece' | 'defend' | 'castle' | 'develop' | 'centre' | 'improve';

/** What a move is about, in one word the coach can explain. */
export function ideaOf(fen: string, line: EngineLine): HintIdea {
  const uci = line.pv[0] ?? '';
  if ('mate' in line.score && line.score.mate > 0 && line.score.mate <= 3) return 'mate';
  const board = chessAt(fen);
  const me = board.turn();
  const them = me === 'w' ? 'b' : 'w';
  const from = uci.slice(0, 2);
  const attackedBefore = board.isAttacked(from as never, them);
  let move;
  try {
    move = board.move({ from, to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
  } catch {
    return 'improve';
  }
  const swing = materialSwing(fen, line.pv, 4);
  if (move.captured && swing >= 1) return 'win-material';
  if (move.isKingsideCastle() || move.isQueensideCastle()) return 'castle';
  // A fork: the moved piece now attacks two enemy pieces worth at least a knight (or the king).
  let targets = 0;
  for (const row of board.board()) {
    for (const p of row) {
      if (!p || p.color !== them || (p.type !== 'k' && PIECE_VALUE[p.type] < 3)) continue;
      if (board.attackers(p.square, me).includes(move.to)) targets++;
    }
  }
  if (targets >= 2) return 'fork';
  if (swing >= 2) return 'win-material';
  if (board.inCheck()) return 'check';
  if (attackedBefore && move.piece !== 'p' && move.piece !== 'k') return 'save-piece';
  const backRank = me === 'w' ? '1' : '8';
  if ((move.piece === 'n' || move.piece === 'b') && from[1] === backRank) return 'develop';
  if (move.piece === 'p' && ['d', 'e'].includes(move.to[0] ?? '') && ['3', '4', '5', '6'].includes(move.to[1] ?? '')) return 'centre';
  return 'improve';
}

async function evaluate(engine: Engine, fen: string, nodes = COACH_NODES): Promise<SearchResult> {
  return engine.search({ fen, nodes, multiPv: 1 });
}

/** Score from White's point of view, in centipawns (mates as large values). */
function whiteScore(fen: string, result: SearchResult): number {
  const line = result.lines[0];
  if (!line) return 0;
  const v = scoreValue(line.score);
  return sideToMove(fen) === 'w' ? v : -v;
}

async function advise(engine: Engine, view: ChessView, query: Json): Promise<Json> {
  if (!isJsonObject(query)) throw new Error('A coach question must be an object');
  const fen = view.fen;
  switch (query.type) {
    case 'eval': {
      const result = await evaluate(engine, fen);
      const line = result.lines[0];
      return {
        white: whiteScore(fen, result),
        mate: line && 'mate' in line.score ? (sideToMove(fen) === 'w' ? line.score.mate : -line.score.mate) : null,
        best: result.bestmove,
      };
    }
    case 'hint': {
      const result = await evaluate(engine, fen);
      const line = result.lines[0];
      const uci = line?.pv[0] ?? result.bestmove;
      let idea: HintIdea = line ? ideaOf(fen, line) : 'improve';
      // When they threaten something and the best move is not itself a gain, the idea is defence.
      if (idea === 'improve' || idea === 'centre' || idea === 'develop' || idea === 'check') {
        const flipped = nullMoveFen(fen);
        if (flipped) {
          const theirs = await evaluate(engine, flipped, COACH_NODES / 2);
          const threat = theirs.lines[0];
          const mine = scoreValue(line?.score ?? { cp: 0 });
          if (threat && (('mate' in threat.score && threat.score.mate > 0) || scoreValue(threat.score) + mine >= 150)) idea = 'defend';
        }
      }
      return { uci, san: sanOf(fen, uci), from: uci.slice(0, 2), to: uci.slice(2, 4), idea };
    }
    case 'threats': {
      const flipped = nullMoveFen(fen);
      if (!flipped) return { threats: [] };
      const [now, theirs] = await Promise.all([evaluate(engine, fen, COACH_NODES / 2), evaluate(engine, flipped, COACH_NODES / 2)]);
      const line = theirs.lines[0];
      const uci = line?.pv[0];
      if (!line || !uci) return { threats: [] };
      // How much better off they would be if they could move now.
      const mine = scoreValue(now.lines[0]?.score ?? { cp: 0 });
      const gain = scoreValue(line.score) + mine;
      const mates = 'mate' in line.score && line.score.mate > 0;
      if (!mates && gain < 150) return { threats: [] };
      return { threats: [{ uci, san: sanOf(flipped, uci), from: uci.slice(0, 2), to: uci.slice(2, 4), mate: mates ? (line.score as { mate: number }).mate : null, gain: Math.round(gain) }] };
    }
    case 'check-move': {
      const uci = typeof query.move === 'string' ? query.move : '';
      const before = await evaluate(engine, fen);
      const board = chessAt(fen);
      let moved;
      try {
        moved = board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] ?? 'q' });
      } catch {
        throw new Error(`${uci} is not legal here`);
      }
      if (board.isGameOver()) return { warn: false, loss: 0 };
      const afterFen = board.fen();
      const after = await evaluate(engine, afterFen);
      const best = scoreValue(before.lines[0]?.score ?? { cp: 0 });
      const reply = after.lines[0];
      const got = -scoreValue(reply?.score ?? { cp: 0 });
      const loss = Math.max(0, best - got);
      const allowsMate = reply !== undefined && 'mate' in reply.score && reply.score.mate > 0;
      const warn = allowsMate || (loss >= 200 && got < 300);
      const replyUci = reply?.pv[0] ?? after.bestmove;
      const hangs = replyUci ? capturedBy(afterFen, replyUci) : null;
      return {
        warn,
        loss: Math.round(loss),
        reason: allowsMate ? 'allows-mate' : hangs && hangs !== 'p' ? `hangs-${hangs}` : 'loses-ground',
        mateIn: allowsMate && reply && 'mate' in reply.score ? reply.score.mate : null,
        reply: replyUci ? { uci: replyUci, san: sanOf(afterFen, replyUci) } : null,
        moved: moved.san,
      };
    }
    default:
      throw new Error(`Unknown coach question: ${JSON.stringify(query.type ?? null)}`);
  }
}

/** Chess bots and coach on an engine made by `createEngine` (a worker in the app, Node in tests). */
export function chessBots(createEngine: () => Engine): BotSet<ChessView, ChessAction> {
  let engine: Engine | null = null;
  const get = () => (engine ??= createEngine());
  return {
    gameId: 'chess',
    levels: CHESS_LEVELS,
    async choose({ view, level, rng }: BotInput<ChessView>): Promise<BotChoice<ChessAction>> {
      const params = LEVEL_PARAMS[level];
      if (!params) throw new Error(`Chess has no level ${level}`);
      const result = await get().search({ fen: view.fen, nodes: params.nodes, multiPv: params.multiPv, elo: params.elo ?? null });
      const uci = params.elo ? result.bestmove : pickWithErrors(view.fen, result, params, rng);
      const action = toAction(view, uci);
      return { action, tags: moveTags(view.fen, uci), nodes: params.nodes };
    },
    advise: ({ view, query }: AdviseInput<ChessView>) => advise(get(), view, query),
    encode: (action) => chess.codec.action.toJSON(action),
  };
}

