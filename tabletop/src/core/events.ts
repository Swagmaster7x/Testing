/**
 * The animation queue. `apply` returns events at once and the rules move on; the interface plays
 * the events one after another from this queue. A tap skips everything still queued, and with
 * reduced motion every event plays instantly. Nothing here ever holds up the rules or a bot.
 */
import type { GameEvent } from './contract';

export interface QueuedEvent<E> {
  /** Increases by one for every event pushed, so the interface can key animations on it. */
  readonly seq: number;
  readonly event: E;
}

export interface QueueSnapshot<E> {
  /** The event animating now. */
  readonly playing: QueuedEvent<E> | null;
  /** Clock time when `playing` started, and how long it lasts. */
  readonly startedAt: number;
  readonly duration: number;
  /** Events waiting their turn, oldest first. */
  readonly pending: readonly QueuedEvent<E>[];
}

export interface QueueClock {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(handle: unknown): void;
}

export interface EventQueueOptions<E> {
  /** Milliseconds an event takes to animate; 0 or less plays it instantly. */
  readonly duration: (event: E) => number;
  /** Read each time an event starts, so a settings change applies at once. */
  readonly reducedMotion: () => boolean;
  /** Called when an event starts playing (not for skipped ones), for sounds. */
  readonly onStart?: ((item: QueuedEvent<E>) => void) | undefined;
  readonly clock?: QueueClock;
}

const realClock: QueueClock = {
  now: () => (typeof performance !== 'undefined' ? performance.now() : Date.now()),
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (handle) => globalThis.clearTimeout(handle as ReturnType<typeof globalThis.setTimeout>),
};

const IDLE: QueueSnapshot<never> = Object.freeze({ playing: null, startedAt: 0, duration: 0, pending: Object.freeze([]) });

export class EventQueue<E extends GameEvent> {
  private readonly clock: QueueClock;
  private readonly durationOf: (event: E) => number;
  private reducedMotion: () => boolean;
  private onStart: ((item: QueuedEvent<E>) => void) | undefined;
  private pending: QueuedEvent<E>[] = [];
  private playing: QueuedEvent<E> | null = null;
  private startedAt = 0;
  private duration = 0;
  private timer: unknown = null;
  private nextSeq = 1;
  private snap: QueueSnapshot<E> = IDLE;
  private readonly listeners = new Set<() => void>();
  private idleWaiters: (() => void)[] = [];

  constructor(options: EventQueueOptions<E>) {
    this.clock = options.clock ?? realClock;
    this.durationOf = options.duration;
    this.reducedMotion = options.reducedMotion;
    this.onStart = options.onStart;
  }

  /** Changes the motion setting or the start hook, for example when Settings change mid-game. */
  configure(options: Partial<Pick<EventQueueOptions<E>, 'reducedMotion' | 'onStart'>>): void {
    if (options.reducedMotion) this.reducedMotion = options.reducedMotion;
    if ('onStart' in options) this.onStart = options.onStart;
  }

  push(events: readonly E[]): void {
    if (events.length === 0) return;
    for (const event of events) this.pending.push({ seq: this.nextSeq++, event });
    if (this.playing === null) this.advance();
    else this.changed();
  }

  /** Finish everything at once (a tap on the table). */
  skip(): void {
    if (this.playing === null && this.pending.length === 0) return;
    this.stopTimer();
    this.playing = null;
    this.pending = [];
    this.changed();
  }

  /** Drop everything, for example when leaving the table. */
  clear(): void {
    this.skip();
  }

  get busy(): boolean {
    return this.playing !== null || this.pending.length > 0;
  }

  /** The highest sequence number handed out so far. */
  get lastSeq(): number {
    return this.nextSeq - 1;
  }

  snapshot = (): QueueSnapshot<E> => this.snap;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  whenIdle(): Promise<void> {
    if (!this.busy) return Promise.resolve();
    return new Promise((resolve) => this.idleWaiters.push(resolve));
  }

  private advance(): void {
    this.stopTimer();
    this.playing = null;
    while (this.pending.length > 0) {
      const item = this.pending.shift() as QueuedEvent<E>;
      const ms = this.reducedMotion() ? 0 : Math.max(0, this.durationOf(item.event));
      this.onStart?.(item);
      if (ms > 0) {
        this.playing = item;
        this.startedAt = this.clock.now();
        this.duration = ms;
        this.timer = this.clock.setTimeout(() => {
          this.timer = null;
          this.advance();
        }, ms);
        break;
      }
    }
    this.changed();
  }

  private stopTimer(): void {
    if (this.timer !== null) {
      this.clock.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private changed(): void {
    this.snap =
      this.playing === null && this.pending.length === 0
        ? IDLE
        : { playing: this.playing, startedAt: this.startedAt, duration: this.duration, pending: this.pending.slice() };
    for (const listener of [...this.listeners]) listener();
    if (!this.busy && this.idleWaiters.length > 0) {
      const waiters = this.idleWaiters;
      this.idleWaiters = [];
      for (const resolve of waiters) resolve();
    }
  }
}
