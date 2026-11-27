/**
 * A small driver for engines that speak UCI (Stockfish for chess) or its shogi cousin USI
 * (Fairy-Stockfish for shogi, M15). It works over any transport: a Web Worker in the app, the npm
 * modules in Node for ladders and tests.
 *
 * Every search starts with `ucinewgame` (`usinewgame`), so a search with a fixed node budget gives
 * the same answer every time on the same engine build with one search thread.
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

/** The words that differ between UCI and USI. */
export interface EngineDialect {
  readonly hello: 'uci' | 'usi';
  readonly newGame: 'ucinewgame' | 'usinewgame';
  /** `position fen ...` or `position sfen ...`. */
  readonly position: 'fen' | 'sfen';
  /** Prefix of the standard option names: UCI_Elo, USI_Elo, and USI_MultiPV for USI. */
  readonly prefix: 'UCI_' | 'USI_';
  readonly multiPv: 'MultiPV' | 'USI_MultiPV';
  /** Options sent once, after the handshake (hash size, threads). */
  readonly setup?: readonly string[];
}

export const UCI: EngineDialect = { hello: 'uci', newGame: 'ucinewgame', position: 'fen', prefix: 'UCI_', multiPv: 'MultiPV' };

export const USI: EngineDialect = { hello: 'usi', newGame: 'usinewgame', position: 'sfen', prefix: 'USI_', multiPv: 'USI_MultiPV' };

export interface SearchRequest {
  /** Position to search: FEN for a UCI engine, SFEN for a USI engine. */
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
  const mate = /\bscore mate ([+-]?\d+)/.exec(line);
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

  constructor(
    private readonly transport: UciTransport,
    private readonly dialect: EngineDialect = UCI,
  ) {
    this.ready = new Promise<void>((resolve) => {
      this.readyResolve = resolve;
    });
    transport.listen((line) => this.onLine(line));
    transport.send(dialect.hello);
    for (const option of dialect.setup ?? []) transport.send(option);
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
    this.fail(new Error('The engine has stopped'));
  }

  private fail(error: Error): void {
    this.dead = true;
    this.transport.terminate();
    const waiting = [...this.queue, ...(this.current ? [this.current] : [])];
    this.queue.length = 0;
    this.current = null;
    for (const job of waiting) job.reject(error);
  }

  private pump(): void {
    if (this.dead || this.current || this.queue.length === 0) return;
    const job = this.queue.shift() as Job;
    this.current = job;
    this.lines = new Map();
    const { request } = job;
    const options = `${request.multiPv ?? 1}|${request.elo ?? ''}`;
    const { prefix } = this.dialect;
    if (options !== this.lastOptions) {
      this.transport.send(`setoption name ${this.dialect.multiPv} value ${request.multiPv ?? 1}`);
      if (request.elo) {
        this.transport.send(`setoption name ${prefix}LimitStrength value true`);
        this.transport.send(`setoption name ${prefix}Elo value ${Math.round(request.elo)}`);
      } else {
        this.transport.send(`setoption name ${prefix}LimitStrength value false`);
      }
      this.lastOptions = options;
    }
    this.transport.send(this.dialect.newGame);
    this.transport.send(`position ${this.dialect.position} ${request.fen}`);
    this.transport.send(`go nodes ${Math.max(1, Math.round(request.nodes))}`);
  }

  private onLine(line: string): void {
    if (line.startsWith('error ')) {
      // An engine host that cannot start the engine says so with one line (fairy-stockfish-host.js).
      this.fail(new Error(`The engine could not start: ${line.slice(6)}`));
      return;
    }
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
      // USI engines say "bestmove resign" or "bestmove win" when there is no move to make.
      const word = line.split(/\s+/)[1] ?? '(none)';
      const bestmove = word === 'resign' || word === 'win' ? '(none)' : word;
      const lines = [...this.lines.values()].sort((a, b) => a.multipv - b.multipv);
      this.current = null;
      job.resolve({ bestmove, lines });
      this.pump();
    }
  }
}
