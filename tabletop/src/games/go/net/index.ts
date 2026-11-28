/**
 * The KataGo network in the Go review (M15): one evaluation gives the winning chances, the score
 * lead and who owns each point, all turned to Black's point of view here. KataGo's output scaling
 * for networks before version 13: the score mean and the lead are the raw outputs times 20.
 */
import { forward } from './forward';
import type { NetPosition } from './inputs';
import { netInputs } from './inputs';
import type { Network } from './model';

export interface NetEval {
  /** Black's winning chances, 0 to 1. */
  readonly blackWins: number;
  /** Black's lead in points (negative when White leads). */
  readonly blackLead: number;
  /** For each point, from −1 (White's) to 1 (Black's). */
  readonly ownership: Float32Array;
  /** The net's favourite points for the side to move, best first, with their share (pass is -1). */
  readonly policy: readonly { readonly point: number; readonly share: number }[];
}

const SCORE_SCALE = 20;

export function evaluate(net: Network, pos: NetPosition): NetEval {
  const { spatial, global } = netInputs(pos);
  const out = forward(net, pos.size, spatial, global);
  const sign = pos.toMove === 'X' ? 1 : -1;
  const [win = 0, loss = 0, noResult = 0] = out.value;
  const top = Math.max(win, loss, noResult);
  const ew = Math.exp(win - top);
  const el = Math.exp(loss - top);
  const en = Math.exp(noResult - top);
  const mine = ew / (ew + el + en);
  const theirs = el / (ew + el + en);
  const blackWins = sign > 0 ? mine + (1 - mine - theirs) / 2 : theirs + (1 - mine - theirs) / 2;
  const lead = (out.score[2] ?? out.score[0] ?? 0) * SCORE_SCALE;
  const area = pos.size * pos.size;
  const ownership = new Float32Array(area);
  for (let p = 0; p < area; p++) ownership[p] = sign * Math.tanh(out.ownership[p]!);
  // Policy over the empty points and pass.
  let max = -Infinity;
  for (let p = 0; p <= area; p++) if (p === area || pos.board[p] === '.') max = Math.max(max, out.policy[p]!);
  const shares: { point: number; share: number }[] = [];
  let total = 0;
  for (let p = 0; p <= area; p++) {
    if (p < area && (pos.board[p] !== '.' || p === pos.ko)) continue;
    const e = Math.exp(out.policy[p]! - max);
    total += e;
    shares.push({ point: p === area ? -1 : p, share: e });
  }
  const policy = shares.map((s) => ({ point: s.point, share: s.share / total })).sort((a, b) => b.share - a.share).slice(0, 8);
  return { blackWins, blackLead: sign * lead, ownership, policy };
}

export type { NetPosition } from './inputs';
export type { Network } from './model';
export { readNetwork } from './model';
