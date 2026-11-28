/**
 * npm run katago:net -- <network.bin.gz> [out]: makes the Go review's network file (M15).
 *
 * Reads a KataGo network (the small b6c96 test network from KataGo's own repository, MIT,
 * cpp/tests/models/g170-b6c96-s175395328-d26788732.bin.gz) and writes the same file with every
 * weight array halved to 16-bit floats ("@F16@" in place of "@BIN@"), about 2 MB instead of 4.
 * It then checks that the halved network gives nearly the same answers on a few positions.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { gunzipSync } from 'node:zlib';
import { evaluate, readNetwork } from '../src/games/go/net';

const [input, output = 'assets/katago/g170-b6c96-f16.bin'] = process.argv.slice(2);
if (!input) {
  console.error('Usage: npm run katago:net -- <network.bin.gz> [out]');
  process.exit(2);
}

/** A number to the nearest 16-bit float (round to nearest even), as its bits. */
function toHalf(value: number): number {
  const f32 = new Float32Array([value]);
  const bits = new Uint32Array(f32.buffer)[0]!;
  const sign = (bits >>> 16) & 0x8000;
  const exponent = ((bits >>> 23) & 0xff) - 127 + 15;
  let mantissa = bits & 0x7fffff;
  if (exponent >= 31) return sign | 0x7c00;
  if (exponent <= 0) {
    if (exponent < -10) return sign;
    mantissa |= 0x800000;
    const shift = 14 - exponent;
    const half = mantissa >> shift;
    const rest = mantissa & ((1 << shift) - 1);
    const mid = 1 << (shift - 1);
    return sign | (half + (rest > mid || (rest === mid && (half & 1)) ? 1 : 0));
  }
  const half = (exponent << 10) | (mantissa >> 13);
  const rest = mantissa & 0x1fff;
  return sign | (half + (rest > 0x1000 || (rest === 0x1000 && (half & 1)) ? 1 : 0));
}

const raw = input.endsWith('.gz') ? gunzipSync(readFileSync(input)) : readFileSync(input);
const bytes = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength);
const spots: [number, number][] = [];
const full = readNetwork(bytes, (offset, count) => spots.push([offset, count]));
const parts: Uint8Array[] = [];
let at = 0;
for (const [offset, count] of spots) {
  parts.push(bytes.subarray(at, offset), new TextEncoder().encode('@F16@'));
  const view = new DataView(bytes.buffer, bytes.byteOffset + offset + 5, count * 4);
  const half = new Uint8Array(count * 2);
  const out = new DataView(half.buffer);
  for (let i = 0; i < count; i++) out.setUint16(i * 2, toHalf(view.getFloat32(i * 4, true)), true);
  parts.push(half);
  at = offset + 5 + count * 4;
}
parts.push(bytes.subarray(at));
const total = parts.reduce((n, p) => n + p.length, 0);
const file = new Uint8Array(total);
let w = 0;
for (const p of parts) {
  file.set(p, w);
  w += p.length;
}
const halved = readNetwork(file);

// The halved network must answer like the full one.
const empty = (n: number) => '.'.repeat(n * n);
const split = ['...XO....', '...XO....', '..XXO....', '...XOO...', '...XXO.X.', '....XO...', '...XXO...', '...XO....', '...XO....'].join('');
let worstWin = 0;
let worstLead = 0;
let worstOwn = 0;
for (const pos of [
  { size: 9, board: empty(9), toMove: 'X' as const },
  { size: 9, board: split, toMove: 'O' as const },
  { size: 13, board: empty(13), toMove: 'X' as const },
  { size: 19, board: empty(19), toMove: 'O' as const },
]) {
  const position = { ...pos, ko: -1, recent: [], komi: 7, preset: 'chinese' as const };
  const a = evaluate(full, position);
  const b = evaluate(halved, position);
  worstWin = Math.max(worstWin, Math.abs(a.blackWins - b.blackWins));
  worstLead = Math.max(worstLead, Math.abs(a.blackLead - b.blackLead));
  for (let p = 0; p < a.ownership.length; p++) worstOwn = Math.max(worstOwn, Math.abs(a.ownership[p]! - b.ownership[p]!));
}
console.log(`${full.name}: ${spots.length} weight arrays, ${raw.byteLength} bytes to ${file.byteLength}`);
console.log(`largest change: winning chances ${(worstWin * 100).toFixed(2)} points, lead ${worstLead.toFixed(2)} points, ownership ${worstOwn.toFixed(3)}`);
if (worstWin > 0.01 || worstLead > 0.25 || worstOwn > 0.05) {
  console.error('The halved network answers too differently; not written.');
  process.exit(1);
}
writeFileSync(output, file);
console.log(`wrote ${output}`);
