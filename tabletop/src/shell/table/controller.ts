/**
 * Runs one game at the table: applies a person's moves, asks the bot worker for the CPU's moves
 * (sending only that seat's view), saves the record after every move and feeds events to the
 * animation queue. It also runs the clock, the blunder check and take-backs. It knows nothing
 * about React; the table screen subscribes to it.
 */
import { botSeed } from '../../ai/bot';
import type { BotHost } from '../../ai/worker-host';
import { BotCancelled } from '../../ai/worker-host';
import type { GameDef, GameEvent, Outcome, Seat } from '../../core/contract';
import { findLegal, resignationOutcome } from '../../core/contract';
import type { EventQueue } from '../../core/events';
import type { GameRecord } from '../../core/record';
import { withAction, withClock, withOutcome, withoutLastMoves, withResignation, withTimeout } from '../../core/record';
import { replay } from '../../core/replay';
import type { CoachWarning } from '../../games/types';

export interface LogEntry<E> {
  readonly id: number;
  readonly ply: number;
  readonly seat: Seat | null;
  readonly event: E;
  /** The bot's reason tags for this move, when it was a CPU move made in this sitting. */
  readonly tags: readonly string[];
}

export interface HistoryItem<A> {
  readonly ply: number;
  readonly seat: Seat;
  readonly action: A;
}

export interface TableSnapshot<S, A, E> {
  readonly record: GameRecord;
  /** Every move so far, with the seat that made it. */
  readonly history: readonly HistoryItem<A>[];
  readonly state: S;
  readonly turn: Seat | null;
  readonly humanTurn: boolean;
  readonly thinking: boolean;
  /** The coach is checking a person's move before the CPU answers it. */
  readonly checking: boolean;
  /** A blunder warning waiting for the person to keep or take back their move. */
  readonly warning: CoachWarning | null;
  readonly legal: readonly A[];
  readonly lastAction: A | null;
  readonly log: readonly LogEntry<E>[];
  readonly error: string | null;
}

export interface TableDeps<S, A, C, V, E extends GameEvent> {
  readonly def: GameDef<S, A, C, V, E>;
  readonly bots: BotHost;
  readonly queue: EventQueue<E>;
  save(record: GameRecord): Promise<void>;
  now(): number;
  /** The result when a seat's clock runs out; a plain loss when absent. */
  timeoutOutcome?(state: S, seat: Seat): Outcome;
}

export type MoveCheck<S, A> = (before: S, action: A) => Promise<CoachWarning | null>;

export class TableController<S, A, C, V, E extends GameEvent> {
  private snap: TableSnapshot<S, A, E>;
  private readonly listeners = new Set<() => void>();
  private saving: Promise<void> = Promise.resolve();
  private stopped = true;
  private logId = 0;
  private botRequest = 0;
  private check: MoveCheck<S, A> | null = null;
  /** When the seat to move started its turn (clock time), or null while the clock is paused. */
  private turnStartedAt: number | null = null;
  /** The clock as it was before a person's last move, for take-backs. */
  private clockBeforeMove: readonly number[] | null = null;

  constructor(
    private readonly deps: TableDeps<S, A, C, V, E>,
    record: GameRecord,
  ) {
    this.snap = this.rebuild(record);
  }

  /** Starts play: asks the CPU if it is its move (also after resuming a saved game). */
  start(): void {
    this.stopped = false;
    if (this.snap.record.status === 'active' && this.snap.record.clock && !this.snap.warning) this.turnStartedAt = this.deps.now();
    this.maybeAskBot();
  }

  /** Stops play: cancels any CPU search and saves the time used so far. `start` picks up again. */
  stop(): void {
    this.commitClock();
    this.stopped = true;
    this.botRequest++;
    this.deps.bots.cancelAll();
    if (this.snap.thinking || this.snap.checking) this.update({ ...this.snap, thinking: false, checking: false });
  }

  snapshot = (): TableSnapshot<S, A, E> => this.snap;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** Turns the blunder check on (a function) or off (null). */
  setMoveCheck(check: MoveCheck<S, A> | null): void {
    this.check = check;
  }

  /** A person's move. Ignored unless it is a person's turn and the move is legal. */
  act(action: A): void {
    const { record, state, turn, warning, checking } = this.snap;
    if (this.stopped || warning || checking || record.status !== 'active' || turn === null) return;
    if (record.players[turn]?.kind !== 'human') return;
    const legal = findLegal(this.deps.def, state, turn, action);
    if (legal === null) return;
    this.clockBeforeMove = this.currentClock();
    const before = state;
    this.applyMove(turn, legal, []);
    const check = this.check;
    if (!check || this.snap.record.status !== 'active') {
      this.maybeAskBot();
      return;
    }
    this.commitClock();
    const request = ++this.botRequest;
    this.update({ ...this.snap, checking: true });
    check(before, legal)
      .then((warning) => {
        if (this.stopped || request !== this.botRequest) return;
        this.update({ ...this.snap, checking: false, warning });
        if (!warning) {
          this.resumeClock();
          this.maybeAskBot();
        }
      })
      .catch((err: unknown) => {
        if (err instanceof BotCancelled || this.stopped || request !== this.botRequest) return;
        // A failed check never blocks play.
        this.update({ ...this.snap, checking: false });
        this.resumeClock();
        this.maybeAskBot();
      });
  }

  /** Plays on after a blunder warning. */
  keepMove(): void {
    if (!this.snap.warning) return;
    this.update({ ...this.snap, warning: null });
    this.resumeClock();
    this.maybeAskBot();
  }

  /** Takes back the person's last move (and any CPU move after it). Marks the game as training. */
  takeBack(): void {
    const { record, history } = this.snap;
    if (this.stopped || record.status !== 'active') return;
    let last = -1;
    for (let i = history.length - 1; i >= 0; i--) {
      const seat = history[i]?.seat;
      if (seat !== undefined && record.players[seat]?.kind === 'human') {
        last = i;
        break;
      }
    }
    if (last < 0) return;
    this.botRequest++;
    this.deps.bots.cancelAll();
    this.deps.queue.skip();
    let next: GameRecord = { ...withoutLastMoves(record, history.length - last, this.deps.now()), training: true };
    if (next.clock && this.clockBeforeMove) next = withClock(next, this.clockBeforeMove.map((ms) => Math.max(0, ms)));
    this.clockBeforeMove = null;
    this.update(this.rebuild(next));
    this.persist(next);
    this.turnStartedAt = next.clock ? this.deps.now() : null;
  }

  /** Marks the game as training (a help was used): it will not move a rating. */
  markTraining(): void {
    const { record } = this.snap;
    if (record.training) return;
    const next = { ...record, training: true };
    this.update({ ...this.snap, record: next });
    this.persist(next);
  }

  /** The person resigns. In a game with several people the first of them resigns. */
  resign(): void {
    const { record, state } = this.snap;
    if (this.stopped || record.status !== 'active') return;
    const seat = record.players.findIndex((p) => p.kind === 'human');
    if (seat < 0) return;
    this.commitClock();
    this.deps.bots.cancelAll();
    this.botRequest++;
    const next = withResignation(this.snap.record, seat, this.deps.def.seats(state), this.deps.now());
    this.update(this.derive(next, this.snap.history, state, this.snap.lastAction, this.snap.log));
    this.persist(next);
  }

  /** Time left on each seat's clock right now, or null without a clock. */
  clock(): readonly number[] | null {
    return this.currentClock();
  }

  /** Called a few times a second while a clock runs: ends the game when a flag falls. */
  tick(): void {
    const { record, turn, state } = this.snap;
    if (this.stopped || !record.clock || record.status !== 'active' || turn === null || this.turnStartedAt === null) return;
    const remaining = this.currentClock();
    if (!remaining || (remaining[turn] ?? 1) > 0) return;
    this.botRequest++;
    this.deps.bots.cancelAll();
    const outcome = this.deps.timeoutOutcome?.(state, turn) ?? { ...resignationOutcome(this.deps.def.seats(state), turn), reason: 'timeout' };
    const next = withTimeout(withClock(record, remaining.map((ms) => Math.max(0, ms))), turn, outcome, this.deps.now());
    this.turnStartedAt = null;
    this.update(this.derive(next, this.snap.history, state, this.snap.lastAction, this.snap.log));
    this.persist(next);
  }

  /** Waits until every move so far is saved. */
  flush(): Promise<void> {
    return this.saving;
  }

  private applyMove(seat: Seat, action: A, tags: readonly string[]): void {
    const { def, queue } = this.deps;
    const { state, events } = def.apply(this.snap.state, action);
    let record = withAction(this.snap.record, def.codec.action.toJSON(action), this.deps.now());
    if (record.clock && this.turnStartedAt !== null) {
      const remaining = [...record.clock.remainingMs];
      remaining[seat] = Math.max(0, (remaining[seat] ?? 0) - (this.deps.now() - this.turnStartedAt)) + record.clock.incrementMs;
      record = withClock(record, remaining);
      this.turnStartedAt = this.deps.now();
    }
    const outcome = def.outcome(state);
    if (outcome) {
      record = withOutcome(record, outcome, this.deps.now());
      this.turnStartedAt = null;
    }
    const ply = record.actions.length;
    const log = [...this.snap.log, ...events.map((event, i) => ({ id: ++this.logId, ply, seat, event, tags: i === 0 ? tags : [] }))];
    const history = [...this.snap.history, { ply, seat, action }];
    this.update(this.derive(record, history, state, action, log));
    queue.push(events);
    this.persist(record);
  }

  private maybeAskBot(): void {
    const { record, state, turn, warning, checking } = this.snap;
    if (this.stopped || warning || checking || record.status !== 'active' || turn === null) return;
    const player = record.players[turn];
    if (player?.kind !== 'bot') return;
    const { def, bots } = this.deps;
    const request = ++this.botRequest;
    this.update({ ...this.snap, thinking: true });
    bots
      .choose({ gameId: def.id, view: def.view(state, turn), seat: turn, level: player.level ?? 1, seed: botSeed(record.seed, record.actions.length + 1) })
      .then((reply) => {
        if (this.stopped || request !== this.botRequest) return;
        const decoded = def.codec.action.fromJSON(reply.action);
        const legal = findLegal(def, this.snap.state, turn, decoded);
        if (legal === null) throw new Error('The CPU chose a move that is not legal');
        this.applyMove(turn, legal, reply.tags);
        this.maybeAskBot();
      })
      .catch((err: unknown) => {
        if (err instanceof BotCancelled || this.stopped || request !== this.botRequest) return;
        this.update({ ...this.snap, thinking: false, error: err instanceof Error ? err.message : String(err) });
      });
  }

  private currentClock(): number[] | null {
    const { record, turn } = this.snap;
    if (!record.clock) return null;
    const remaining = [...record.clock.remainingMs];
    if (turn !== null && this.turnStartedAt !== null) remaining[turn] = (remaining[turn] ?? 0) - (this.deps.now() - this.turnStartedAt);
    return remaining;
  }

  /** Saves the time used in the current turn and pauses the clock, for example when leaving. */
  private commitClock(): void {
    const { record } = this.snap;
    if (!record.clock || record.status !== 'active' || this.turnStartedAt === null) return;
    const remaining = this.currentClock();
    this.turnStartedAt = null;
    if (!remaining) return;
    const next = withClock(record, remaining.map((ms) => Math.max(0, ms)));
    this.update({ ...this.snap, record: next });
    this.persist(next);
  }

  private resumeClock(): void {
    if (this.snap.record.clock && this.snap.record.status === 'active') this.turnStartedAt = this.deps.now();
  }

  private persist(record: GameRecord): void {
    this.saving = this.saving
      .then(() => this.deps.save(record))
      .catch((err: unknown) => {
        if (!this.stopped) this.update({ ...this.snap, error: err instanceof Error ? err.message : String(err) });
      });
  }

  private rebuild(record: GameRecord): TableSnapshot<S, A, E> {
    const { state, steps } = replay(this.deps.def, record);
    const log: LogEntry<E>[] = [];
    for (const step of steps) {
      for (const event of step.events) log.push({ id: ++this.logId, ply: step.ply, seat: step.seat, event, tags: [] });
    }
    const last = steps[steps.length - 1];
    const history = steps.map((step) => ({ ply: step.ply, seat: step.seat, action: step.action }));
    return this.derive(record, history, state, last ? last.action : null, log);
  }

  private derive(record: GameRecord, history: readonly HistoryItem<A>[], state: S, lastAction: A | null, log: readonly LogEntry<E>[]): TableSnapshot<S, A, E> {
    const { def } = this.deps;
    const turn = record.status === 'active' ? def.turn(state) : null;
    const humanTurn = turn !== null && record.players[turn]?.kind === 'human';
    return {
      record,
      history,
      state,
      turn,
      humanTurn,
      thinking: false,
      checking: false,
      warning: null,
      legal: humanTurn && turn !== null ? def.legal(state, turn) : [],
      lastAction,
      log,
      error: null,
    };
  }

  private update(next: TableSnapshot<S, A, E>): void {
    this.snap = next;
    for (const listener of [...this.listeners]) listener();
  }
}
