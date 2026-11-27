import { describe, expect, it, vi } from 'vitest';
import type { ChooseReply, ChooseRequest } from '../../src/ai/protocol';
import { runBot } from '../../src/ai/run-bot';
import type { BotHost } from '../../src/ai/worker-host';
import { BotCancelled } from '../../src/ai/worker-host';
import { EventQueue } from '../../src/core/events';
import type { GameRecord } from '../../src/core/record';
import { newRecord, withAction } from '../../src/core/record';
import type { NoughtsEvent } from '../../src/games/noughts/rules';
import { noughts, parseCell } from '../../src/games/noughts/rules';
import { TableController } from '../../src/shell/table/controller';

/** A bot host that answers in-process, records what it was sent, and can be held back. */
function fakeBots(options: { hold?: boolean } = {}) {
  type Sent = Omit<ChooseRequest, 'id' | 'assetsBase' | 'kind'>;
  const sent: Sent[] = [];
  const pending: { resolve: (r: ChooseReply) => void; reject: (e: Error) => void; request: Sent }[] = [];
  let cancels = 0;
  const host = {
    choose: (request: Sent) => {
      sent.push(structuredClone(request));
      return new Promise<ChooseReply>((resolve, reject) => {
        if (options.hold) pending.push({ resolve, reject, request });
        else void runBot({ ...request, id: 1, kind: 'choose', assetsBase: '' }).then((r) => (r.ok && r.kind === 'choose' ? resolve(r) : reject(new Error(r.ok ? 'wrong kind' : r.error))));
      });
    },
    cancelAll: () => {
      cancels++;
      for (const p of pending.splice(0)) p.reject(new BotCancelled());
    },
  } as unknown as BotHost;
  const release = async () => {
    const next = pending.shift();
    if (!next) throw new Error('nothing pending');
    const reply = await runBot({ ...next.request, id: 1, kind: 'choose', assetsBase: '' });
    if (reply.ok && reply.kind === 'choose') next.resolve(reply);
  };
  return { host, sent, release, cancels: () => cancels };
}

function setup(record: GameRecord, bots: BotHost) {
  const saved: GameRecord[] = [];
  const queue = new EventQueue<NoughtsEvent>({ duration: () => 0, reducedMotion: () => true });
  const save = (r: GameRecord) => {
    saved.push(r);
    return Promise.resolve();
  };
  const controller = new TableController({ def: noughts, bots, queue, save, now: () => 1000 }, record);
  return { controller, saved, queue };
}

const humanFirst = () =>
  newRecord(noughts, { id: 'g1', config: {}, seed: 'ctl', players: [{ kind: 'human' }, { kind: 'bot', level: 2 }], appVersion: 'test', training: false, now: 1 });

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('table controller', () => {
  it('applies a person’s move, saves it, then gets and saves the CPU’s reply', async () => {
    const bots = fakeBots();
    const { controller, saved } = setup(humanFirst(), bots.host);
    controller.start();
    expect(controller.snapshot().humanTurn).toBe(true);
    controller.act(parseCell('b2'));
    expect(controller.snapshot().thinking).toBe(true);
    await vi.waitFor(() => expect(controller.snapshot().humanTurn).toBe(true));
    await controller.flush();
    const snap = controller.snapshot();
    expect(snap.record.actions).toHaveLength(2);
    expect(snap.history.map((h) => h.seat)).toEqual([0, 1]);
    expect(saved.at(-1)?.actions).toEqual(snap.record.actions);
    expect(snap.log.length).toBeGreaterThanOrEqual(2);
  });

  it('sends the bot only the seat view, with a seed tied to the move number', async () => {
    const bots = fakeBots();
    const { controller } = setup(humanFirst(), bots.host);
    controller.start();
    controller.act(parseCell('b2'));
    await vi.waitFor(() => expect(bots.sent).toHaveLength(1));
    const request = bots.sent[0];
    expect(request).toMatchObject({ gameId: 'noughts', seat: 1, level: 2, seed: 'ctl/bot/2' });
    expect(request?.view).toEqual(noughts.view(controller.snapshot().state, 1));
  });

  it('ignores illegal moves and moves out of turn', async () => {
    const bots = fakeBots({ hold: true });
    const { controller, saved } = setup(humanFirst(), bots.host);
    controller.start();
    controller.act(99);
    expect(controller.snapshot().record.actions).toHaveLength(0);
    controller.act(parseCell('b2'));
    controller.act(parseCell('a1')); // the CPU's turn now
    await controller.flush();
    expect(controller.snapshot().record.actions).toEqual([4]);
    expect(saved).toHaveLength(1);
  });

  it('resumes a saved game where the CPU is to move, and asks it', async () => {
    const record = withAction(humanFirst(), 4, 2);
    const bots = fakeBots();
    const { controller } = setup(record, bots.host);
    expect(controller.snapshot().history).toHaveLength(1);
    controller.start();
    await vi.waitFor(() => expect(controller.snapshot().record.actions).toHaveLength(2));
  });

  it('drops a CPU answer that arrives after the table was left', async () => {
    const bots = fakeBots({ hold: true });
    const { controller } = setup(withAction(humanFirst(), 4, 2), bots.host);
    controller.start();
    expect(bots.sent).toHaveLength(1);
    controller.stop();
    expect(bots.cancels()).toBe(1);
    await settle();
    expect(controller.snapshot().record.actions).toHaveLength(1);
    expect(controller.snapshot().thinking).toBe(false);
    expect(controller.snapshot().error).toBeNull();
    // Coming back asks again, and the same seed gives the same answer.
    controller.start();
    await bots.release();
    await vi.waitFor(() => expect(controller.snapshot().record.actions).toHaveLength(2));
  });

  it('finishes the game with an outcome, and records a resignation as a loss', async () => {
    const bots = fakeBots();
    const { controller } = setup(humanFirst(), bots.host);
    controller.start();
    controller.resign();
    await controller.flush();
    const { record, turn } = controller.snapshot();
    expect(record.status).toBe('finished');
    expect(record.ending).toEqual({ kind: 'resigned', seat: 0 });
    expect(record.outcome?.results.find((r) => r.seat === 1)?.place).toBe(1);
    expect(turn).toBeNull();
    controller.act(parseCell('b2'));
    expect(controller.snapshot().record.actions).toHaveLength(0);
  });

  it('takes back the person’s move and the CPU reply, and marks the game as training', async () => {
    const bots = fakeBots();
    const { controller } = setup(humanFirst(), bots.host);
    controller.start();
    controller.act(parseCell('b2'));
    await vi.waitFor(() => expect(controller.snapshot().record.actions).toHaveLength(2));
    controller.takeBack();
    const snap = controller.snapshot();
    expect(snap.record.actions).toHaveLength(0);
    expect(snap.record.training).toBe(true);
    expect(snap.humanTurn).toBe(true);
  });

  it('holds the CPU back while a move is checked, then plays on or takes back', async () => {
    const bots = fakeBots();
    const { controller } = setup(humanFirst(), bots.host);
    let release: (w: { text: string; overlay: { arrows: []; marks: [] } } | null) => void = () => undefined;
    controller.setMoveCheck(() => new Promise((resolve) => (release = resolve)));
    controller.start();
    controller.act(parseCell('a1'));
    expect(controller.snapshot().checking).toBe(true);
    expect(bots.sent).toHaveLength(0);
    release({ text: 'Careful', overlay: { arrows: [], marks: [] } });
    await vi.waitFor(() => expect(controller.snapshot().warning?.text).toBe('Careful'));
    expect(bots.sent).toHaveLength(0);
    controller.keepMove();
    await vi.waitFor(() => expect(controller.snapshot().record.actions).toHaveLength(2));
    controller.act(parseCell('c3'));
    release({ text: 'Again', overlay: { arrows: [], marks: [] } });
    await vi.waitFor(() => expect(controller.snapshot().warning).not.toBeNull());
    controller.takeBack();
    expect(controller.snapshot().record.actions).toHaveLength(2);
    expect(controller.snapshot().warning).toBeNull();
  });

  it('runs a clock: the mover pays for thinking time, gains the increment, and loses on time', () => {
    let now = 0;
    const bots = fakeBots({ hold: true });
    const record = newRecord(noughts, { id: 'c', config: {}, seed: 'clock', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: 't', training: false, now: 0, clock: { initialMs: 10_000, incrementMs: 1_000 } });
    const queue = new EventQueue<NoughtsEvent>({ duration: () => 0, reducedMotion: () => true });
    const controller = new TableController({ def: noughts, bots: bots.host, queue, save: () => Promise.resolve(), now: () => now }, record);
    controller.start();
    now = 3_000;
    expect(controller.clock()).toEqual([7_000, 10_000]);
    controller.act(parseCell('b2'));
    expect(controller.snapshot().record.clock?.remainingMs).toEqual([8_000, 10_000]);
    now = 25_000;
    controller.tick();
    const snap = controller.snapshot();
    expect(snap.record.status).toBe('finished');
    expect(snap.record.ending).toEqual({ kind: 'timeout', seat: 1 });
    expect(snap.record.outcome?.results.find((r) => r.seat === 0)?.place).toBe(1);
  });

  it('pauses the clock while the app is closed', () => {
    let now = 0;
    const bots = fakeBots({ hold: true });
    const record = newRecord(noughts, { id: 'p', config: {}, seed: 'pause', players: [{ kind: 'human' }, { kind: 'bot', level: 1 }], appVersion: 't', training: false, now: 0, clock: { initialMs: 10_000, incrementMs: 0 } });
    const queue = new EventQueue<NoughtsEvent>({ duration: () => 0, reducedMotion: () => true });
    const controller = new TableController({ def: noughts, bots: bots.host, queue, save: () => Promise.resolve(), now: () => now }, record);
    controller.start();
    now = 2_000;
    controller.stop();
    now = 60_000;
    controller.start();
    expect(controller.clock()).toEqual([8_000, 10_000]);
  });

  it('plays a whole game to the end against level 3 and never lets the person act out of turn', async () => {
    const bots = fakeBots();
    const { controller } = setup(humanFirst(), bots.host);
    controller.start();
    for (let guard = 0; guard < 9 && controller.snapshot().record.status === 'active'; guard++) {
      await vi.waitFor(() => expect(controller.snapshot().humanTurn || controller.snapshot().record.status === 'finished').toBe(true));
      const snap = controller.snapshot();
      if (snap.record.status === 'finished') break;
      controller.act(snap.legal[0] as number);
    }
    await vi.waitFor(() => expect(controller.snapshot().record.status).toBe('finished'));
    expect(controller.snapshot().record.outcome).not.toBeNull();
  });
});
