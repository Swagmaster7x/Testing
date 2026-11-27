/**
 * A small driver for engines that speak UCI (Stockfish now; Fairy-Stockfish later). It works over
 * any transport: a Web Worker in the app, the stockfish npm module in Node for ladders and tests.
 *
 * Every search starts with `ucinewgame`, so a search with a fixed node budget gives the same
 * answer every time on the same engine build.
 */

export interface UciTransport {
  send(command: string): void;
  /** Registers the one listener for engine output lines. */
  listen(onLine: (line: string) => void): void;
  terminate(): void;
}

export type EngineScore = { readonly cp: number } | { readonly mate: number };

export interface EngineLine {
  readonly multipv: number;
  readonly depth: number;
  /** From the point of view of the side to move. */
  readonly score: EngineScore;
  readonly pv: readonly string[];
}

export interface SearchRequest {
  /** Position to search, in FEN. */
  readonly fen: string;
  readonly nodes: number;
  /** How many best lines to report (1 by default). */
  readonly multiPv?: number;
  /** Stockfish's own strength limit (UCI_LimitStrength with UCI_Elo); null or absent for full strength. */
  readonly elo?: number | null;
}

export interface SearchResult {
  readonly bestmove: string;
  /** One line per MultiPV slot, best first. */
  readonly lines: readonly EngineLine[];
}

export interface Engine {
  search(request: SearchRequest): Promise<SearchResult>;
  terminate(): void;
}

/** Turns a score into centipawns, with mates as large values that stay ordered. */
export function scoreValue(score: EngineScore): number {
  if ('mate' in score) return score.mate > 0 ? 100_000 - score.mate * 100 : -100_000 - score.mate * 100;
  return score.cp;
}

export function parseInfo(line: string): EngineLine | null {
  if (!line.startsWith('info ') || !line.includes(' pv ')) return null;
  const depth = /\bdepth (\d+)/.exec(line);
  const multipv = /\bmultipv (\d+)/.exec(line);
  const cp = /\bscore cp (-?\d+)/.exec(line);
  const mate = /\bscore mate (-?\d+)/.exec(line);
  const pv = /\bpv (.+)$/.exec(line);
  if (!depth || !pv || (!cp && !mate)) return null;
  return {
    multipv: multipv ? Number(multipv[1]) : 1,
    depth: Number(depth[1]),
    score: mate ? { mate: Number(mate[1]) } : { cp: Number(cp?.[1]) },
    pv: (pv[1] ?? '').trim().split(/\s+/),
  };
}

interface Job {
  readonly request: SearchRequest;
  resolve(result: SearchResult): void;
  reject(error: Error): void;
}

export class UciEngine implements Engine {
  private ready: Promise<void>;
  private readyResolve: (() => void) | null = null;
  private current: Job | null = null;
  private lines = new Map<number, EngineLine>();
  private readonly queue: Job[] = [];
  private dead = false;
  private lastOptions = '';

  constructor(private readonly transport: UciTransport) {
    this.ready = new Promise<void>((resolve) => {
      this.readyResolve = resolve;
    });
    transport.listen((line) => this.onLine(line));
    transport.send('uci');
    transport.send('isready');
  }

  search(request: SearchRequest): Promise<SearchResult> {
    if (this.dead) return Promise.reject(new Error('The engine has stopped'));
    return new Promise<SearchResult>((resolve, reject) => {
      this.queue.push({ request, resolve, reject });
      void this.ready.then(() => this.pump());
    });
  }

  terminate(): void {
    this.dead = true;
    this.transport.terminate();
    const waiting = [...this.queue, ...(this.current ? [this.current] : [])];
    this.queue.length = 0;
    this.current = null;
    for (const job of waiting) job.reject(new Error('The engine has stopped'));
  }

  private pump(): void {
    if (this.dead || this.current || this.queue.length === 0) return;
    const job = this.queue.shift() as Job;
    this.current = job;
    this.lines = new Map();
    const { request } = job;
    const options = `${request.multiPv ?? 1}|${request.elo ?? ''}`;
    if (options !== this.lastOptions) {
      this.transport.send(`setoption name MultiPV value ${request.multiPv ?? 1}`);
      if (request.elo) {
        this.transport.send('setoption name UCI_LimitStrength value true');
        this.transport.send(`setoption name UCI_Elo value ${Math.round(request.elo)}`);
      } else {
        this.transport.send('setoption name UCI_LimitStrength value false');
      }
      this.lastOptions = options;
    }
    this.transport.send('ucinewgame');
    this.transport.send(`position fen ${request.fen}`);
    this.transport.send(`go nodes ${Math.max(1, Math.round(request.nodes))}`);
  }

  private onLine(line: string): void {
    if (line === 'readyok' && this.readyResolve) {
      this.readyResolve();
      this.readyResolve = null;
      return;
    }
    const job = this.current;
    if (!job) return;
    const info = parseInfo(line);
    if (info) {
      // Keep the latest report for each slot; partial depths are replaced by deeper ones.
      this.lines.set(info.multipv, info);
      return;
    }
    if (line.startsWith('bestmove')) {
      const bestmove = line.split(/\s+/)[1] ?? '(none)';
      const lines = [...this.lines.values()].sort((a, b) => a.multipv - b.multipv);
      this.current = null;
      job.resolve({ bestmove, lines });
      this.pump();
    }
  }
}
