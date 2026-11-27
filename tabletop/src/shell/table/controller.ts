/**
 * Runs one game at the table: applies a person's moves, asks the bot worker for the CPU's moves
 * (sending only that seat's view), saves the record after every move and feeds events to the
 * animation queue. It knows nothing about React; the table screen subscribes to it.
 */
import { botSeed } from '../../ai/bot';
import type { BotHost } from '../../ai/worker-host';
import { BotCancelled } from '../../ai/worker-host';
import type { GameDef, GameEvent, Seat } from '../../core/contract';
import { findLegal } from '../../core/contract';
import type { EventQueue } from '../../core/events';
import type { GameRecord } from '../../core/record';
import { withAction, withOutcome, withResignation } from '../../core/record';
import { replay } from '../../core/replay';

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
}

export class TableController<S, A, C, V, E extends GameEvent> {
  private snap: TableSnapshot<S, A, E>;
  private readonly listeners = new Set<() => void>();
  private saving: Promise<void> = Promise.resolve();
  private stopped = true;
  private logId = 0;
  private botRequest = 0;

  constructor(
    private readonly deps: TableDeps<S, A, C, V, E>,
    record: GameRecord,
  ) {
    const { def } = deps;
    const { state, steps } = replay(def, record);
    const log: LogEntry<E>[] = [];
    for (const step of steps) {
      for (const event of step.events) log.push({ id: ++this.logId, ply: step.ply, seat: step.seat, event, tags: [] });
    }
    const last = steps[steps.length - 1];
    const history = steps.map((step) => ({ ply: step.ply, seat: step.seat, action: step.action }));
    this.snap = this.derive(record, history, state, last ? last.action : null, log, false, null);
  }

  /** Starts play: asks the CPU if it is its move (also after resuming a saved game). */
  start(): void {
    this.stopped = false;
    this.maybeAskBot();
  }

  snapshot = (): TableSnapshot<S, A, E> => this.snap;

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  /** A person's move. Ignored unless it is a person's turn and the move is legal. */
  act(action: A): void {
    const { record, state, turn } = this.snap;
    if (this.stopped || record.status !== 'active' || turn === null) return;
    if (record.players[turn]?.kind !== 'human') return;
    const legal = findLegal(this.deps.def, state, turn, action);
    if (legal === null) return;
    this.applyMove(turn, legal, []);
  }

  /** The person resigns. In a game with several people the first of them resigns. */
  resign(): void {
    const { record, state } = this.snap;
    if (this.stopped || record.status !== 'active') return;
    const seat = record.players.findIndex((p) => p.kind === 'human');
    if (seat < 0) return;
    this.deps.bots.cancelAll();
    this.botRequest++;
    const next = withResignation(record, seat, this.deps.def.seats(state), this.deps.now());
    this.update(this.derive(next, this.snap.history, state, this.snap.lastAction, this.snap.log, false, null));
    this.persist(next);
  }

  /** Waits until every move so far is saved. */
  flush(): Promise<void> {
    return this.saving;
  }

  /** Stops play: cancels any CPU search. `start` picks up again from the same position. */
  stop(): void {
    this.stopped = true;
    this.botRequest++;
    this.deps.bots.cancelAll();
    if (this.snap.thinking) this.update({ ...this.snap, thinking: false });
  }

  private applyMove(seat: Seat, action: A, tags: readonly string[]): void {
    const { def, queue } = this.deps;
    const { state, events } = def.apply(this.snap.state, action);
    let record = withAction(this.snap.record, def.codec.action.toJSON(action), this.deps.now());
    const outcome = def.outcome(state);
    if (outcome) record = withOutcome(record, outcome, this.deps.now());
    const ply = record.actions.length;
    const log = [...this.snap.log, ...events.map((event, i) => ({ id: ++this.logId, ply, seat, event, tags: i === 0 ? tags : [] }))];
    const history = [...this.snap.history, { ply, seat, action }];
    this.update(this.derive(record, history, state, action, log, false, null));
    queue.push(events);
    this.persist(record);
    this.maybeAskBot();
  }

  private maybeAskBot(): void {
    const { record, state, turn } = this.snap;
    if (this.stopped || record.status !== 'active' || turn === null) return;
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
      })
      .catch((err: unknown) => {
        if (err instanceof BotCancelled || this.stopped || request !== this.botRequest) return;
        this.update({ ...this.snap, thinking: false, error: err instanceof Error ? err.message : String(err) });
      });
  }

  private persist(record: GameRecord): void {
    this.saving = this.saving
      .then(() => this.deps.save(record))
      .catch((err: unknown) => {
        if (!this.stopped) this.update({ ...this.snap, error: err instanceof Error ? err.message : String(err) });
      });
  }

  private derive(
    record: GameRecord,
    history: readonly HistoryItem<A>[],
    state: S,
    lastAction: A | null,
    log: readonly LogEntry<E>[],
    thinking: boolean,
    error: string | null,
  ): TableSnapshot<S, A, E> {
    const { def } = this.deps;
    const turn = record.status === 'active' ? def.turn(state) : null;
    const humanTurn = turn !== null && record.players[turn]?.kind === 'human';
    return {
      record,
      history,
      state,
      turn,
      humanTurn,
      thinking,
      legal: humanTurn && turn !== null ? def.legal(state, turn) : [],
      lastAction,
      log,
      error,
    };
  }

  private update(next: TableSnapshot<S, A, E>): void {
    this.snap = next;
    for (const listener of [...this.listeners]) listener();
  }
}
