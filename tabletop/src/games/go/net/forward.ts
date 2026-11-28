/**
 * One evaluation of a KataGo network on an n×n board, in plain TypeScript (M15). Activations are
 * stored point by point ([y][x][channel]); a convolution sees zeros beyond the edge, which is what
 * KataGo's board mask gives. Global pooling divides by the board's area and scales the mean by
 * (n − 14) / 10, as KataGo does. No search: the review asks the net once per position for the
 * score, the winning chances and who owns each point.
 */
import type { Conv, MatMul, Network, Norm } from './model';

export interface NetOutput {
  /** Policy logits, one per point (y * n + x), then pass. */
  readonly policy: Float32Array;
  /** Win, loss and no-result logits for the side to move. */
  readonly value: Float32Array;
  /** Score mean, its spread, the lead and the time left, before KataGo's scaling. */
  readonly score: Float32Array;
  /** Ownership before tanh: positive is the side to move's. */
  readonly ownership: Float32Array;
}

function convolve(input: Float32Array, n: number, c: Conv, out: Float32Array, add = false): void {
  const { k, cin, cout, w } = c;
  const r = k >> 1;
  if (!add) out.fill(0, 0, n * n * cout);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const o = (y * n + x) * cout;
      for (let ky = 0; ky < k; ky++) {
        const yy = y + ky - r;
        if (yy < 0 || yy >= n) continue;
        for (let kx = 0; kx < k; kx++) {
          const xx = x + kx - r;
          if (xx < 0 || xx >= n) continue;
          const ib = (yy * n + xx) * cin;
          const wb = (ky * k + kx) * cin;
          for (let ci = 0; ci < cin; ci++) {
            const a = input[ib + ci]!;
            if (a === 0) continue;
            const wr = (wb + ci) * cout;
            for (let co = 0; co < cout; co++) out[o + co]! += a * w[wr + co]!;
          }
        }
      }
    }
  }
}

/** Batch norm and ReLU, from `input` into `out` (they may be the same array). */
function normRelu(input: Float32Array, points: number, norm: Norm, out: Float32Array): void {
  const { scale, bias } = norm;
  const channels = scale.length;
  for (let p = 0; p < points; p++) {
    const b = p * channels;
    for (let c = 0; c < channels; c++) {
      const v = input[b + c]! * scale[c]! + bias[c]!;
      out[b + c] = v > 0 ? v : 0;
    }
  }
}

function matMul(input: Float32Array, m: MatMul, out: Float32Array): void {
  out.fill(0, 0, m.cout);
  for (let i = 0; i < m.cin; i++) {
    const a = input[i]!;
    if (a === 0) continue;
    const row = i * m.cout;
    for (let o = 0; o < m.cout; o++) out[o]! += a * m.w[row + o]!;
  }
}

/** Adds a per-channel vector to every point. */
function addEverywhere(data: Float32Array, points: number, vector: Float32Array, channels: number): void {
  for (let p = 0; p < points; p++) {
    const b = p * channels;
    for (let c = 0; c < channels; c++) data[b + c]! += vector[c]!;
  }
}

/** KataGo's global pooling: the mean, the mean scaled by board size, and the max of each channel. */
function gpool(data: Float32Array, n: number, channels: number): Float32Array {
  const points = n * n;
  const out = new Float32Array(channels * 3);
  for (let c = 0; c < channels; c++) {
    let sum = 0;
    let max = -Infinity;
    for (let p = 0; p < points; p++) {
      const v = data[p * channels + c]!;
      sum += v;
      if (v > max) max = v;
    }
    const mean = sum / points;
    out[c] = mean;
    out[channels + c] = mean * (n - 14) * 0.1;
    out[2 * channels + c] = max;
  }
  return out;
}

/** The value head's pooling: the mean, and the mean scaled by board size in two ways. */
function valuePool(data: Float32Array, n: number, channels: number): Float32Array {
  const points = n * n;
  const out = new Float32Array(channels * 3);
  const f = n - 14;
  for (let c = 0; c < channels; c++) {
    let sum = 0;
    for (let p = 0; p < points; p++) sum += data[p * channels + c]!;
    const mean = sum / points;
    out[c] = mean;
    out[channels + c] = mean * f * 0.1;
    out[2 * channels + c] = mean * (f * f * 0.01 - 0.1);
  }
  return out;
}

export function forward(net: Network, n: number, spatial: Float32Array, global: Float32Array): NetOutput {
  const points = n * n;
  const C = net.trunkChannels;
  const trunk = new Float32Array(points * C);
  convolve(spatial, n, net.conv1, trunk);
  const g = new Float32Array(C);
  matMul(global, net.ginput, g);
  addEverywhere(trunk, points, g, C);

  let widest = C;
  for (const b of net.blocks) widest = Math.max(widest, b.kind === 'ordinary' ? b.w1.cout : b.w1a.cout + b.w1b.cout);
  const a = new Float32Array(points * C);
  const mid = new Float32Array(points * widest);
  const pooled = new Float32Array(points * widest);
  const residual = new Float32Array(points * C);
  for (const block of net.blocks) {
    normRelu(trunk, points, block.pre, a);
    if (block.kind === 'ordinary') {
      convolve(a, n, block.w1, mid);
      normRelu(mid, points, block.mid, mid);
      convolve(mid, n, block.w2, residual);
    } else {
      convolve(a, n, block.w1a, mid);
      convolve(a, n, block.w1b, pooled);
      const gc = block.w1b.cout;
      normRelu(pooled, points, block.gpoolNorm, pooled);
      const bias = new Float32Array(block.w1r.cout);
      matMul(gpool(pooled, n, gc), block.w1r, bias);
      addEverywhere(mid, points, bias, block.w1a.cout);
      normRelu(mid, points, block.mid, mid);
      convolve(mid, n, block.w2, residual);
    }
    for (let i = 0; i < points * C; i++) trunk[i]! += residual[i]!;
  }
  normRelu(trunk, points, net.tip, trunk);

  // Policy head.
  const { p1, g1, g1Norm, gpoolToBias, p1Norm, p2, pass } = net.policy;
  const p1Out = new Float32Array(points * p1.cout);
  convolve(trunk, n, p1, p1Out);
  const g1Out = new Float32Array(points * g1.cout);
  convolve(trunk, n, g1, g1Out);
  normRelu(g1Out, points, g1Norm, g1Out);
  const g1Pool = gpool(g1Out, n, g1.cout);
  const g1Bias = new Float32Array(gpoolToBias.cout);
  matMul(g1Pool, gpoolToBias, g1Bias);
  addEverywhere(p1Out, points, g1Bias, p1.cout);
  normRelu(p1Out, points, p1Norm, p1Out);
  const policyPoints = new Float32Array(points * p2.cout);
  convolve(p1Out, n, p2, policyPoints);
  const passOut = new Float32Array(pass.cout);
  matMul(g1Pool, pass, passOut);
  const policy = new Float32Array(points + 1);
  for (let p = 0; p < points; p++) policy[p] = policyPoints[p * p2.cout]!;
  policy[points] = passOut[0]!;

  // Value head.
  const { v1, v1Norm, v2, v2Bias, v3, v3Bias, sv3, sv3Bias, ownership } = net.value;
  const v1Out = new Float32Array(points * v1.cout);
  convolve(trunk, n, v1, v1Out);
  normRelu(v1Out, points, v1Norm, v1Out);
  const v2Out = new Float32Array(v2.cout);
  matMul(valuePool(v1Out, n, v1.cout), v2, v2Out);
  for (let i = 0; i < v2.cout; i++) {
    const v = v2Out[i]! + v2Bias[i]!;
    v2Out[i] = v > 0 ? v : 0;
  }
  const value = new Float32Array(v3.cout);
  matMul(v2Out, v3, value);
  for (let i = 0; i < v3.cout; i++) value[i]! += v3Bias[i]!;
  const score = new Float32Array(sv3.cout);
  matMul(v2Out, sv3, score);
  for (let i = 0; i < sv3.cout; i++) score[i]! += sv3Bias[i]!;
  const own = new Float32Array(points);
  convolve(v1Out, n, ownership, own);
  return { policy, value, score, ownership: own };
}
