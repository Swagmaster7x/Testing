/**
 * Reads a KataGo network file (the ".bin" format, uncompressed) for the Go review (M15). Only the
 * classic residual nets are read: model versions 8 to 10, ordinary and global-pooling blocks,
 * batch norm and ReLU. That covers the small b6c96 network the app ships. The layout follows
 * KataGo's own description of the format (cpp/neuralnet/desc.cpp): text fields separated by
 * spaces, and each weight array as "@BIN@" followed by little-endian 32-bit floats. Convolution
 * weights are stored [kernelY][kernelX][in][out], matrix weights [in][out].
 *
 * The app ships the network with its weights halved to 16-bit floats (scripts/katago-net.ts), the
 * same file with "@F16@" in place of "@BIN@": half the size, and the outputs barely move.
 */

export interface Conv {
  readonly k: number;
  readonly cin: number;
  readonly cout: number;
  readonly w: Float32Array;
}

export interface MatMul {
  readonly cin: number;
  readonly cout: number;
  readonly w: Float32Array;
}

/** Batch norm folded into a scale and a bias per channel. */
export interface Norm {
  readonly scale: Float32Array;
  readonly bias: Float32Array;
}

export type Block =
  | { readonly kind: 'ordinary'; readonly pre: Norm; readonly w1: Conv; readonly mid: Norm; readonly w2: Conv }
  | { readonly kind: 'gpool'; readonly pre: Norm; readonly w1a: Conv; readonly w1b: Conv; readonly gpoolNorm: Norm; readonly w1r: MatMul; readonly mid: Norm; readonly w2: Conv };

export interface Network {
  readonly name: string;
  readonly version: number;
  readonly spatialInputs: number;
  readonly globalInputs: number;
  readonly trunkChannels: number;
  readonly conv1: Conv;
  readonly ginput: MatMul;
  readonly blocks: readonly Block[];
  readonly tip: Norm;
  readonly policy: { readonly p1: Conv; readonly g1: Conv; readonly g1Norm: Norm; readonly gpoolToBias: MatMul; readonly p1Norm: Norm; readonly p2: Conv; readonly pass: MatMul };
  readonly value: { readonly v1: Conv; readonly v1Norm: Norm; readonly v2: MatMul; readonly v2Bias: Float32Array; readonly v3: MatMul; readonly v3Bias: Float32Array; readonly sv3: MatMul; readonly sv3Bias: Float32Array; readonly ownership: Conv };
}

/** Where a weight array sits in the file: its marker's offset and its length in floats. */
export type ArraySpot = (offset: number, count: number) => void;

/** A 16-bit float to a number. */
export function fromHalf(h: number): number {
  const sign = h & 0x8000 ? -1 : 1;
  const exponent = (h >> 10) & 0x1f;
  const fraction = h & 0x3ff;
  if (exponent === 0) return sign * fraction * 2 ** -24;
  if (exponent === 31) return fraction ? NaN : sign * Infinity;
  return sign * (1 + fraction / 1024) * 2 ** (exponent - 15);
}

class Reader {
  private at = 0;
  private readonly text = new TextDecoder('utf-8');
  constructor(
    private readonly bytes: Uint8Array,
    private readonly spot?: ArraySpot,
  ) {}

  private space(): void {
    while (this.at < this.bytes.length) {
      const b = this.bytes[this.at]!;
      if (b !== 0x20 && b !== 0x0a && b !== 0x0d && b !== 0x09) return;
      this.at++;
    }
  }

  token(): string {
    this.space();
    const start = this.at;
    while (this.at < this.bytes.length) {
      const b = this.bytes[this.at]!;
      if (b === 0x20 || b === 0x0a || b === 0x0d || b === 0x09) break;
      this.at++;
    }
    if (this.at === start) throw new Error('The network file ends too early');
    return this.text.decode(this.bytes.subarray(start, this.at));
  }

  int(): number {
    const value = Number.parseInt(this.token(), 10);
    if (!Number.isFinite(value)) throw new Error('The network file has a bad number');
    return value;
  }

  float(): number {
    const value = Number.parseFloat(this.token());
    if (!Number.isFinite(value)) throw new Error('The network file has a bad number');
    return value;
  }

  floats(count: number): Float32Array {
    this.space();
    const marker = this.text.decode(this.bytes.subarray(this.at, this.at + 5));
    if (marker !== '@BIN@' && marker !== '@F16@') throw new Error('The network file is not in the expected format');
    this.spot?.(this.at, count);
    this.at += 5;
    const out = new Float32Array(count);
    const half = marker === '@F16@';
    const view = new DataView(this.bytes.buffer, this.bytes.byteOffset + this.at, count * (half ? 2 : 4));
    if (half) for (let i = 0; i < count; i++) out[i] = fromHalf(view.getUint16(i * 2, true));
    else for (let i = 0; i < count; i++) out[i] = view.getFloat32(i * 4, true);
    this.at += count * (half ? 2 : 4);
    return out;
  }
}

function conv(r: Reader): Conv {
  r.token();
  const ky = r.int();
  const kx = r.int();
  const cin = r.int();
  const cout = r.int();
  const dy = r.int();
  const dx = r.int();
  if (ky !== kx || ky % 2 !== 1 || dy !== 1 || dx !== 1) throw new Error('The network uses a convolution this reader does not support');
  return { k: ky, cin, cout, w: r.floats(ky * kx * cin * cout) };
}

function matMul(r: Reader): MatMul {
  r.token();
  const cin = r.int();
  const cout = r.int();
  return { cin, cout, w: r.floats(cin * cout) };
}

function bias(r: Reader): Float32Array {
  r.token();
  return r.floats(r.int());
}

function norm(r: Reader): Norm {
  r.token();
  const channels = r.int();
  const epsilon = r.float();
  const hasScale = r.int() !== 0;
  const hasBias = r.int() !== 0;
  const mean = r.floats(channels);
  const variance = r.floats(channels);
  const gamma = hasScale ? r.floats(channels) : new Float32Array(channels).fill(1);
  const beta = hasBias ? r.floats(channels) : new Float32Array(channels);
  const scale = new Float32Array(channels);
  const shift = new Float32Array(channels);
  for (let c = 0; c < channels; c++) {
    scale[c] = gamma[c]! / Math.sqrt(variance[c]! + epsilon);
    shift[c] = beta[c]! - scale[c]! * mean[c]!;
  }
  return { scale, bias: shift };
}

/** Before version 11 an activation is only a name, and always ReLU. */
function activation(r: Reader): void {
  r.token();
}

/** Reads a network; `spot` hears where each weight array is (for the 16-bit converter). */
export function readNetwork(bytes: Uint8Array, spot?: ArraySpot): Network {
  const r = new Reader(bytes, spot);
  const name = r.token();
  const version = r.int();
  if (version < 8 || version > 10) throw new Error(`Network version ${version} is not supported (8 to 10 are)`);
  const spatialInputs = r.int();
  const globalInputs = r.int();
  r.token();
  const numBlocks = r.int();
  const trunkChannels = r.int();
  r.int(); // mid channels
  r.int(); // regular channels
  r.int(); // dilated channels
  r.int(); // global pooling channels
  const conv1 = conv(r);
  const ginput = matMul(r);
  const blocks: Block[] = [];
  for (let i = 0; i < numBlocks; i++) {
    const kind = r.token();
    r.token();
    if (kind === 'ordinary_block') {
      const pre = norm(r);
      activation(r);
      const w1 = conv(r);
      const mid = norm(r);
      activation(r);
      blocks.push({ kind: 'ordinary', pre, w1, mid, w2: conv(r) });
    } else if (kind === 'gpool_block') {
      const pre = norm(r);
      activation(r);
      const w1a = conv(r);
      const w1b = conv(r);
      const gpoolNorm = norm(r);
      activation(r);
      const w1r = matMul(r);
      const mid = norm(r);
      activation(r);
      blocks.push({ kind: 'gpool', pre, w1a, w1b, gpoolNorm, w1r, mid, w2: conv(r) });
    } else throw new Error(`The network has a block this reader does not support: ${kind}`);
  }
  const tip = norm(r);
  activation(r);
  r.token();
  const p1 = conv(r);
  const g1 = conv(r);
  const g1Norm = norm(r);
  activation(r);
  const gpoolToBias = matMul(r);
  const p1Norm = norm(r);
  activation(r);
  const p2 = conv(r);
  const pass = matMul(r);
  r.token();
  const v1 = conv(r);
  const v1Norm = norm(r);
  activation(r);
  const v2 = matMul(r);
  const v2Bias = bias(r);
  activation(r);
  const v3 = matMul(r);
  const v3Bias = bias(r);
  const sv3 = matMul(r);
  const sv3Bias = bias(r);
  const ownership = conv(r);
  return {
    name,
    version,
    spatialInputs,
    globalInputs,
    trunkChannels,
    conv1,
    ginput,
    blocks,
    tip,
    policy: { p1, g1, g1Norm, gpoolToBias, p1Norm, p2, pass },
    value: { v1, v1Norm, v2, v2Bias, v3, v3Bias, sv3, sv3Bias, ownership },
  };
}
