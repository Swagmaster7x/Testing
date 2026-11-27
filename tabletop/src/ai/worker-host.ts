/**
 * The table's side of the bot worker. It sends a view, waits for the answer and keeps a short
 * minimum pause before CPU moves so play stays readable. Cancelling terminates the worker, which is
 * the only sure way to stop a long search; a fresh worker starts on the next request.
 */
import type { Json } from '../core/json';
import type { AdviseRequest, BotReply, BotRequest, ChooseReply, ChooseRequest } from './protocol';

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
  /** A CPU move is held back until at least this long after the request (about half a second). */
  readonly minPauseMs: number;
  /** Base URL of the app's files, passed to engines in the worker. */
  readonly assetsBase: string;
  readonly delay?: (ms: number) => Promise<void>;
}

interface Waiting {
  resolve(reply: BotReply): void;
  reject(error: Error): void;
}

type Without<T> = T extends unknown ? Omit<T, 'id' | 'assetsBase' | 'kind'> : never;

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

  /** A move for a CPU seat. */
  async choose(request: Without<ChooseRequest>): Promise<ChooseReply> {
    const generation = this.generation;
    const [answer] = await Promise.all([this.send({ ...request, kind: 'choose' }), (this.options.delay ?? sleep)(this.options.minPauseMs)]);
    if (generation !== this.generation) throw new BotCancelled();
    if (!answer.ok) throw new Error(`Bot error: ${answer.error}`);
    if (answer.kind !== 'choose') throw new Error('The bot answered the wrong question');
    return answer;
  }

  /** A coach answer about a person's own position. */
  async advise(request: Without<AdviseRequest>): Promise<Json> {
    const generation = this.generation;
    const answer = await this.send({ ...request, kind: 'advise' });
    if (generation !== this.generation) throw new BotCancelled();
    if (!answer.ok) throw new Error(`Coach error: ${answer.error}`);
    if (answer.kind !== 'advise') throw new Error('The coach answered the wrong question');
    return (answer).advice;
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

  private send(request: Without<ChooseRequest> & { kind: 'choose' } | Without<AdviseRequest> & { kind: 'advise' }): Promise<BotReply> {
    const id = this.nextId++;
    const worker = this.ensureWorker();
    const reply = new Promise<BotReply>((resolve, reject) => this.waiting.set(id, { resolve, reject }));
    worker.postMessage({ ...request, id, assetsBase: this.options.assetsBase });
    return reply;
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
