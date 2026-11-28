/**
 * The network's inputs for a Go position (KataGo's input version 7, used by version 8 to 10
 * networks): 22 planes per point and 19 numbers for the whole board. The app fills what it knows:
 * the board, stones with one to three liberties, the ko point, the last five moves, komi and the
 * rules. Ladder planes and pass-alive areas are left empty (the net still reads the position,
 * a little less sharply).
 */
import type { GoPresetId } from '../rules';

export const SPATIAL = 22;
export const GLOBAL = 19;

export interface NetPosition {
  readonly size: number;
  /** One character per point from the top-left: '.', 'X' (Black) or 'O' (White). */
  readonly board: string;
  readonly toMove: 'X' | 'O';
  /** The simple-ko point, or -1. */
  readonly ko: number;
  /** The last moves, oldest first: a point, or -1 for a pass. */
  readonly recent: readonly number[];
  readonly komi: number;
  readonly preset: GoPresetId;
}

/** Liberties of the chain on each point (0 for empty points). */
export function libertyMap(size: number, board: string): Int32Array {
  const libs = new Int32Array(size * size);
  const seen = new Int32Array(size * size).fill(-1);
  const libSeen = new Int32Array(size * size).fill(-1);
  const stack: number[] = [];
  const chain: number[] = [];
  for (let start = 0; start < size * size; start++) {
    if (board[start] === '.' || seen[start] !== -1) continue;
    const color = board[start];
    stack.length = 0;
    chain.length = 0;
    stack.push(start);
    seen[start] = start;
    let count = 0;
    while (stack.length > 0) {
      const p = stack.pop()!;
      chain.push(p);
      const x = p % size;
      const y = (p - x) / size;
      for (const q of [x > 0 ? p - 1 : -1, x < size - 1 ? p + 1 : -1, y > 0 ? p - size : -1, y < size - 1 ? p + size : -1]) {
        if (q < 0) continue;
        if (board[q] === '.') {
          if (libSeen[q] !== start) {
            libSeen[q] = start;
            count++;
          }
        } else if (board[q] === color && seen[q] === -1) {
          seen[q] = start;
          stack.push(q);
        }
      }
    }
    for (const p of chain) libs[p] = count;
  }
  return libs;
}

/** KataGo's rule features for the app's presets (area scoring has the komi parity wave). */
function ruleFeatures(preset: GoPresetId, global: Float32Array, selfKomi: number, area: number): void {
  if (preset === 'tromp-taylor') {
    global[6] = 1;
    global[7] = 0.5;
  } else if (preset === 'aga' || preset === 'new-zealand') {
    global[6] = 1;
    global[7] = -0.5;
  }
  if (preset === 'tromp-taylor' || preset === 'new-zealand') global[8] = 1;
  if (preset === 'japanese') {
    global[9] = 1;
    global[10] = 1;
    return;
  }
  const floor = area % 2 === 0 ? Math.floor(selfKomi / 2) * 2 : Math.floor((selfKomi - 1) / 2) * 2 + 1;
  const delta = Math.min(2, Math.max(0, selfKomi - floor));
  global[18] = delta < 0.5 ? delta : delta < 1.5 ? 1 - delta : delta - 2;
}

export function netInputs(pos: NetPosition): { spatial: Float32Array; global: Float32Array } {
  const { size, board, toMove } = pos;
  const area = size * size;
  const spatial = new Float32Array(area * SPATIAL);
  const global = new Float32Array(GLOBAL);
  const other = toMove === 'X' ? 'O' : 'X';
  const libs = libertyMap(size, board);
  for (let p = 0; p < area; p++) {
    const b = p * SPATIAL;
    spatial[b] = 1;
    const c = board[p];
    if (c === toMove) spatial[b + 1] = 1;
    else if (c === other) spatial[b + 2] = 1;
    if (c !== '.') {
      const l = libs[p]!;
      if (l >= 1 && l <= 3) spatial[b + 2 + l] = 1;
    }
  }
  if (pos.ko >= 0 && pos.ko < area) spatial[pos.ko * SPATIAL + 6] = 1;
  // The last five moves, newest first, while they alternate as expected.
  for (let i = 0; i < 5 && i < pos.recent.length; i++) {
    const move = pos.recent[pos.recent.length - 1 - i]!;
    if (move < 0) global[i] = 1;
    else if (move < area) spatial[move * SPATIAL + 9 + i] = 1;
  }
  const selfKomi = toMove === 'O' ? pos.komi : -pos.komi;
  global[5] = selfKomi / 20;
  // A pass now would end the game when the last move was a pass.
  if (pos.recent.length > 0 && pos.recent[pos.recent.length - 1]! < 0) global[14] = 1;
  ruleFeatures(pos.preset, global, selfKomi, area);
  return { spatial, global };
}
