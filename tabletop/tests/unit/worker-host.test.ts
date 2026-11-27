import { describe, expect, it, vi } from 'vitest';
import type { BotReply, BotRequest } from '../../src/ai/protocol';
import { runBot } from '../../src/ai/run-bot';
import type { WorkerLike } from '../../src/ai/worker-host';
import { BotCancelled, BotHost } from '../../src/ai/worker-host';
import { createRng } from '../../src/core/rng';
import { noughts } from '../../src/games/noughts/rules';

/** A stand-in worker that runs the real bot code in-process and records every message. */
class FakeWorker implements WorkerLike {
  sent: BotRequest[] = [];
  terminated = false;
  onmessage: ((event: MessageEvent<BotReply>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  constructor(private readonly auto = true) {}
  postMessage(message: BotRequest): void {
    // Structured clone, as a real worker would receive it.
    const copy = structuredClone(message);
    this.sent.push(copy);
    if (this.auto) void runBot(copy).then((reply) => this.onmessage?.({ data: reply } as MessageEvent<BotReply>));
  }
  terminate(): void {
    this.terminated = true;
  }
}

const noDelay = () => Promise.resolve();
const options = { minPauseMs: 0, delay: noDelay, assetsBase: 'http://localhost/' };
const start = () => noughts.setup({}, createRng('x'));

describe('bot worker host', () => {
  it('sends only the seat view and returns a legal encoded action', async () => {
    const workers: FakeWorker[] = [];
    const host = new BotHost(() => {
      const w = new FakeWorker();
      workers.push(w);
      return w;
    }, options);
    const state = noughts.apply(start(), 4).state;
    const view = noughts.view(state, 1);
    const reply = await host.choose({ gameId: 'noughts', view, seat: 1, level: 2, seed: 'abc' });
    expect(noughts.legal(state, 1)).toContain(noughts.codec.action.fromJSON(reply.action));
    const sent = workers[0]?.sent[0];
    expect(sent && Object.keys(sent).sort()).toEqual(['assetsBase', 'gameId', 'id', 'kind', 'level', 'seat', 'seed', 'view']);
    expect(sent?.view).toEqual(view);
    expect(sent?.kind).toBe('choose');
  });

  it('holds a CPU move back for the minimum thinking pause', async () => {
    const delay = vi.fn(() => Promise.resolve());
    const host = new BotHost(() => new FakeWorker(), { ...options, minPauseMs: 500, delay });
    await host.choose({ gameId: 'noughts', view: start(), seat: 0, level: 1, seed: 's' });
    expect(delay).toHaveBeenCalledWith(500);
  });

  it('cancels a pending request by terminating the worker', async () => {
    const worker = new FakeWorker(false);
    const host = new BotHost(() => worker, options);
    const pending = host.choose({ gameId: 'noughts', view: start(), seat: 0, level: 3, seed: 's' });
    host.cancelAll();
    await expect(pending).rejects.toBeInstanceOf(BotCancelled);
    expect(worker.terminated).toBe(true);
  });

  it('starts a fresh worker after a cancel', async () => {
    let made = 0;
    const host = new BotHost(() => {
      made++;
      return new FakeWorker();
    }, options);
    await host.choose({ gameId: 'noughts', view: start(), seat: 0, level: 1, seed: 's' });
    host.cancelAll();
    await host.choose({ gameId: 'noughts', view: start(), seat: 0, level: 1, seed: 's' });
    expect(made).toBe(2);
  });

  it('reports bot errors, and refuses coach questions for a game without a coach', async () => {
    const host = new BotHost(() => new FakeWorker(), options);
    await expect(host.choose({ gameId: 'nope', view: {}, seat: 0, level: 1, seed: 's' })).rejects.toThrow(/No bots/);
    await expect(host.advise({ gameId: 'noughts', view: start(), seat: 0, query: { type: 'hint' }, seed: 's' })).rejects.toThrow(/no coach/);
  });

  it('rejects everything waiting when the worker crashes', async () => {
    const worker = new FakeWorker(false);
    const host = new BotHost(() => worker, options);
    const pending = host.choose({ gameId: 'noughts', view: start(), seat: 0, level: 1, seed: 's' });
    worker.onerror?.({ message: 'boom' } as ErrorEvent);
    await expect(pending).rejects.toThrow(/boom/);
  });
});

describe('runBot', () => {
  it('answers with the same move for the same seed', async () => {
    const view = start();
    const request = { gameId: 'noughts', view, seat: 0, level: 2, seed: 'same', assetsBase: '', kind: 'choose' as const };
    const a = await runBot({ ...request, id: 1 });
    const b = await runBot({ ...request, id: 2 });
    expect(a.ok && b.ok).toBe(true);
    if (a.ok && b.ok && a.kind === 'choose' && b.kind === 'choose') expect(a.action).toBe(b.action);
  });
});
