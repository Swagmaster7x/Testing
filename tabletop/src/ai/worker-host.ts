/**
 * The table's side of the bot worker. It sends a view, waits for the answer and keeps a short
 * minimum pause so play stays readable. Cancelling terminates the worker, which is the only
 * sure way to stop a long search; a fresh worker starts on the next request.
 */
import type { BotReply, BotReplyOk, BotRequest } from './protocol';

export interface WorkerLike {
  postMessage(message: BotRequest): void;
  terminate(): void;
  onmessage: ((event: MessageEvent<BotReply>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
}

export class BotCancelled extends Error {
  constructor() {
    super('The bot request was cancelled');
    this.name = 'BotCancelled';
  }
}

export interface BotHostOptions {
  /** The bot's answer is held back until at least this long after the request (about half a second). */
  readonly minPauseMs: number;
  readonly delay?: (ms: number) => Promise<void>;
}

interface Waiting {
  resolve(reply: BotReply): void;
  reject(error: Error): void;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export class BotHost {
  private worker: WorkerLike | null = null;
  private nextId = 1;
  private generation = 0;
  private readonly waiting = new Map<number, Waiting>();

  constructor(
    private readonly createWorker: () => WorkerLike,
    private readonly options: BotHostOptions,
  ) {}

  async choose(request: Omit<BotRequest, 'id'>): Promise<BotReplyOk> {
    const generation = this.generation;
    const id = this.nextId++;
    const worker = this.ensureWorker();
    const reply = new Promise<BotReply>((resolve, reject) => this.waiting.set(id, { resolve, reject }));
    worker.postMessage({ id, gameId: request.gameId, view: request.view, seat: request.seat, level: request.level, seed: request.seed });
    const [answer] = await Promise.all([reply, (this.options.delay ?? sleep)(this.options.minPauseMs)]);
    if (generation !== this.generation) throw new BotCancelled();
    if (!answer.ok) throw new Error(`Bot error: ${answer.error}`);
    return answer;
  }

  /** Stops any search in progress. Pending requests reject with BotCancelled. */
  cancelAll(): void {
    this.generation++;
    if (this.worker) {
      this.worker.onmessage = null;
      this.worker.onerror = null;
      this.worker.terminate();
      this.worker = null;
    }
    const waiting = [...this.waiting.values()];
    this.waiting.clear();
    for (const w of waiting) w.reject(new BotCancelled());
  }

  dispose(): void {
    this.cancelAll();
  }

  private ensureWorker(): WorkerLike {
    if (this.worker) return this.worker;
    const worker = this.createWorker();
    worker.onmessage = (event) => {
      const reply = event.data;
      const waiting = this.waiting.get(reply.id);
      if (!waiting) return;
      this.waiting.delete(reply.id);
      waiting.resolve(reply);
    };
    worker.onerror = (event) => {
      const waiting = [...this.waiting.values()];
      this.waiting.clear();
      this.worker?.terminate();
      this.worker = null;
      for (const w of waiting) w.reject(new Error(`Bot worker failed: ${event.message || 'unknown error'}`));
    };
    this.worker = worker;
    return worker;
  }
}

/** The real worker. Vite bundles bot.worker.ts as its own file from this exact pattern. */
export function createBotWorker(): WorkerLike {
  return new Worker(new URL('./bot.worker.ts', import.meta.url), { type: 'module', name: 'bots' });
}
