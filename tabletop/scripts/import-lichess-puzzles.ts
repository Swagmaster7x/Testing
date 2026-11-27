/**
 * npm run import:puzzles — the Lichess puzzle importer (PLAN.md 2.6).
 *
 * Streams lichess_db_puzzle.csv.zst from database.lichess.org (CC0), picks about 6,000 puzzles
 * across themes and ratings 600 to 2200, replays every line through the chess rules (and checks
 * that mates end in mate), and writes src/games/chess/practice/lichess-puzzles.json with the
 * attribution. The download goes through curl so the environment's proxy settings apply; it
 * stops as soon as every bucket is full.
 *
 *   npm run import:puzzles                 # download and import
 *   npm run import:puzzles -- path/to.csv  # import from a local, already decompressed file
 */
import { spawn } from 'node:child_process';
import { createReadStream, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import type { Readable, TransformCallback } from 'node:stream';
import { Transform } from 'node:stream';
import { createZstdDecompress } from 'node:zlib';
import { Chess } from 'chess.js';

const URL = 'https://database.lichess.org/lichess_db_puzzle.csv.zst';
const OUT = join(import.meta.dirname, '..', 'src', 'games', 'chess', 'practice', 'lichess-puzzles.json');

const MIN_RATING = 600;
const MAX_RATING = 2200;
const BAND = 100;
/** Stop reading after this many lines even if a rare bucket is still short. */
const MAX_LINES = 3_000_000;

/** Puzzles wanted per 100-point rating band, by the first theme in this list a puzzle has. */
const PER_BAND: readonly [string, number][] = [
  ['mateIn1', 28],
  ['mateIn2', 28],
  ['mateIn3', 10],
  ['backRankMate', 6],
  ['smotheredMate', 2],
  ['fork', 26],
  ['pin', 16],
  ['skewer', 10],
  ['discoveredAttack', 14],
  ['doubleCheck', 4],
  ['hangingPiece', 22],
  ['trappedPiece', 6],
  ['deflection', 10],
  ['attraction', 8],
  ['sacrifice', 12],
  ['promotion', 10],
  ['pawnEndgame', 10],
  ['rookEndgame', 12],
  ['endgame', 30],
  ['short', 80],
  ['long', 20],
];

interface Picked {
  readonly id: string;
  readonly fen: string;
  readonly moves: string;
  readonly rating: number;
  readonly themes: string;
}

function replayOk(fen: string, moves: string[], themes: string[]): boolean {
  let board: Chess;
  try {
    board = new Chess(fen);
  } catch {
    return false;
  }
  for (const uci of moves) {
    try {
      board.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
    } catch {
      return false;
    }
  }
  if (themes.some((t) => t.startsWith('mate')) && !board.isCheckmate()) return false;
  return true;
}

/**
 * The file is written by a parallel zstd that puts a "skippable frame" before each real frame.
 * Node's decoder rejects those, so this removes them and passes the real frames through.
 */
class SkipFrames extends Transform {
  private buffer = Buffer.alloc(0);
  private passing = 0;
  private skipping = 0;

  override _transform(chunk: Buffer, _encoding: BufferEncoding, done: TransformCallback): void {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    for (;;) {
      if (this.skipping > 0) {
        const n = Math.min(this.skipping, this.buffer.length);
        this.buffer = this.buffer.subarray(n);
        this.skipping -= n;
        if (this.skipping > 0) break;
      }
      if (this.passing > 0) {
        const n = Math.min(this.passing, this.buffer.length);
        if (n > 0) this.push(this.buffer.subarray(0, n));
        this.buffer = this.buffer.subarray(n);
        this.passing -= n;
        if (this.passing > 0) break;
      }
      if (this.buffer.length < 8) break;
      const magic = this.buffer.readUInt32LE(0);
      if (magic >= 0x184d2a50 && magic <= 0x184d2a5f) {
        const size = this.buffer.readUInt32LE(4);
        if (size === 4 && this.buffer.length >= 12) {
          // pzstd: the skippable frame holds the size of the frame that follows.
          this.passing = this.buffer.readUInt32LE(8);
          this.buffer = this.buffer.subarray(12);
          continue;
        }
        if (size === 4) break;
        this.skipping = size;
        this.buffer = this.buffer.subarray(8);
        continue;
      }
      // A plain zstd stream: pass everything through from here on.
      this.passing = Number.MAX_SAFE_INTEGER;
    }
    done();
  }
}

function input(path: string | undefined): { stream: Readable; stop: () => void } {
  if (path) {
    const stream = createReadStream(path);
    return { stream, stop: () => stream.destroy() };
  }
  const curl = spawn('curl', ['-sS', '--fail', URL], { stdio: ['ignore', 'pipe', 'inherit'] });
  const unzip = createZstdDecompress();
  curl.stdout.pipe(new SkipFrames()).pipe(unzip);
  return {
    stream: unzip,
    stop: () => {
      curl.kill();
      unzip.destroy();
    },
  };
}

async function main() {
  const bands = (MAX_RATING - MIN_RATING) / BAND;
  const want = new Map<string, number>();
  for (let b = 0; b < bands; b++) for (const [theme, n] of PER_BAND) want.set(`${b}:${theme}`, n);
  const total = [...want.values()].reduce((a, b) => a + b, 0);
  const picked: Picked[] = [];
  const { stream, stop } = input(process.argv[2]);
  const lines = createInterface({ input: stream, crlfDelay: Infinity });
  let read = 0;
  let rejected = 0;
  let open = want.size;
  for await (const line of lines) {
    read++;
    if (read === 1 && line.startsWith('PuzzleId')) continue;
    if (read > MAX_LINES || open === 0) break;
    const [id, fen, movesText, ratingText, deviationText, popularityText, playsText, themesText] = line.split(',');
    if (!id || !fen || !movesText || !themesText) continue;
    const rating = Number(ratingText);
    if (!(rating >= MIN_RATING && rating < MAX_RATING)) continue;
    if (Number(deviationText) > 90 || Number(popularityText) < 70 || Number(playsText) < 300) continue;
    const moves = movesText.split(' ');
    if (moves.length < 2 || moves.length > 10) continue;
    const themes = themesText.split(' ');
    const band = Math.floor((rating - MIN_RATING) / BAND);
    const theme = PER_BAND.find(([name]) => themes.includes(name) && (want.get(`${band}:${name}`) ?? 0) > 0)?.[0];
    if (!theme) continue;
    if (!replayOk(fen, moves, themes)) {
      rejected++;
      continue;
    }
    const key = `${band}:${theme}`;
    const left = (want.get(key) ?? 0) - 1;
    want.set(key, left);
    if (left === 0) open--;
    picked.push({ id, fen, moves: movesText, rating, themes: themesText });
    if (read % 250_000 === 0) console.log(`  ${read} lines read, ${picked.length} of ${total} picked`);
  }
  stop();
  picked.sort((a, b) => a.rating - b.rating || a.id.localeCompare(b.id));
  const short = [...want.entries()].filter(([, n]) => n > 0);
  const file = {
    source: 'Lichess puzzle database, https://database.lichess.org/#puzzles',
    licence: 'Creative Commons CC0 (public domain dedication), as stated on the download page',
    file: 'lichess_db_puzzle.csv.zst',
    imported: new Date().toISOString().slice(0, 10),
    note: 'FEN is the position before the opponent moves; the first move is theirs, the rest is the solution. Every line was replayed through chess.js on import.',
    fields: ['id', 'fen', 'moves', 'rating', 'themes'],
    puzzles: picked.map((p) => [p.id, p.fen, p.moves, p.rating, p.themes]),
  };
  writeFileSync(OUT, `${JSON.stringify(file).replace(/\],\[/g, '],\n[')}\n`);
  console.log(`Read ${read} lines; picked ${picked.length} of ${total}; ${rejected} rejected by the replay check.`);
  if (short.length > 0) console.log(`Buckets not filled: ${short.length} (for example ${short.slice(0, 6).map(([k, n]) => `${k} short ${n}`).join(', ')}).`);
  console.log(`Wrote ${OUT}`);
}

await main();
