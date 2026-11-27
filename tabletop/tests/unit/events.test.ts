import { describe, expect, it, vi } from 'vitest';
import type { QueueClock } from '../../src/core/events';
import { EventQueue } from '../../src/core/events';

interface Ev {
  readonly type: string;
  readonly ms: number;
}

function fakeClock() {
  let now = 0;
  let timers: { at: number; fn: () => void; id: number }[] = [];
  let nextId = 1;
  const clock: QueueClock = {
    now: () => now,
    setTimeout(fn, ms) {
      const id = nextId++;
      timers.push({ at: now + ms, fn, id });
      return id;
    },
    clearTimeout(handle) {
      timers = timers.filter((t) => t.id !== handle);
    },
  };
  const advance = (ms: number) => {
    const target = now + ms;
    for (;;) {
      timers.sort((a, b) => a.at - b.at);
      const next = timers[0];
      if (!next || next.at > target) break;
      timers.shift();
      now = next.at;
      next.fn();
    }
    now = target;
  };
  return { clock, advance, pendingTimers: () => timers.length };
}

const ev = (type: string, ms = 100): Ev => ({ type, ms });

describe('animation queue', () => {
  it('plays events one after another', () => {
    const { clock, advance } = fakeClock();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock });
    q.push([ev('a'), ev('b')]);
    expect(q.snapshot().playing?.event.type).toBe('a');
    expect(q.snapshot().pending.map((p) => p.event.type)).toEqual(['b']);
    advance(100);
    expect(q.snapshot().playing?.event.type).toBe('b');
    advance(100);
    expect(q.snapshot().playing).toBeNull();
    expect(q.busy).toBe(false);
  });

  it('numbers events so the interface can key animations', () => {
    const { clock } = fakeClock();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock });
    q.push([ev('a'), ev('b')]);
    q.push([ev('c')]);
    const s = q.snapshot();
    expect([s.playing?.seq, ...s.pending.map((p) => p.seq)]).toEqual([1, 2, 3]);
    expect(q.lastSeq).toBe(3);
  });

  it('skips everything still queued with one tap', () => {
    const { clock, pendingTimers } = fakeClock();
    const onStart = vi.fn();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock, onStart });
    q.push([ev('a'), ev('b'), ev('c')]);
    q.skip();
    expect(q.snapshot().playing).toBeNull();
    expect(q.snapshot().pending).toEqual([]);
    expect(pendingTimers()).toBe(0);
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it('plays everything instantly with reduced motion, still announcing each event', () => {
    const { clock, pendingTimers } = fakeClock();
    const onStart = vi.fn();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => true, clock, onStart });
    q.push([ev('a'), ev('b')]);
    expect(q.busy).toBe(false);
    expect(pendingTimers()).toBe(0);
    expect(onStart.mock.calls.map((c) => (c[0] as { event: Ev }).event.type)).toEqual(['a', 'b']);
  });

  it('treats zero-length events as instant', () => {
    const { clock } = fakeClock();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock });
    q.push([ev('log', 0), ev('anim', 50), ev('log2', 0)]);
    expect(q.snapshot().playing?.event.type).toBe('anim');
  });

  it('notifies listeners and keeps the snapshot stable between changes', () => {
    const { clock, advance } = fakeClock();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock });
    const listener = vi.fn();
    const unsubscribe = q.subscribe(listener);
    q.push([ev('a')]);
    const snap = q.snapshot();
    expect(q.snapshot()).toBe(snap);
    advance(100);
    expect(listener).toHaveBeenCalledTimes(2);
    unsubscribe();
    q.push([ev('b')]);
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('resolves whenIdle when the queue empties', async () => {
    const { clock, advance } = fakeClock();
    const q = new EventQueue<Ev>({ duration: (e) => e.ms, reducedMotion: () => false, clock });
    await expect(q.whenIdle()).resolves.toBeUndefined();
    q.push([ev('a')]);
    let idle = false;
    void q.whenIdle().then(() => {
      idle = true;
    });
    await Promise.resolve();
    expect(idle).toBe(false);
    advance(100);
    await Promise.resolve();
    expect(idle).toBe(true);
  });
});
