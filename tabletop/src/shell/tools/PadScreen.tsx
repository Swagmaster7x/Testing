/**
 * One scorepad: the totals, a form to write the next hand down, the list of what has been written
 * (the last can be taken back), and the pad's settings: names, target, starting score.
 */
import { useEffect, useState } from 'react';
import { appDb } from '../../store/db';
import { getPad, savePad } from '../../store/pads';
import type { Pad, PadEntry } from '../../tools/scorepad';
import { addEntry, BRISCA_TOTAL, briscaHandWinner, leaderOf, totals, undoEntry, winnerOf } from '../../tools/scorepad';
import { t, tDynamic } from '../../text';
import { Segmented } from '../components/Segmented';
import { useApp } from '../state';
import { BackLink, CenterMessage, Screen } from '../screens/common';

const TARGETS: Readonly<Record<Pad['kind'], readonly number[]>> = {
  dominoes: [100, 150, 200, 500],
  brisca: [1, 3, 5, 7],
  mahjong: [],
  tally: [0, 50, 100, 500],
};
const STARTS: readonly number[] = [0, 500, 2000, 25_000, 30_000];

export function PadScreen({ padId }: { padId: string }) {
  const profile = useApp((s) => s.profile);
  const [pad, setPad] = useState<Pad | null | 'missing'>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    let live = true;
    void getPad(appDb(), profile.id, padId).then((p) => live && setPad(p ?? 'missing'));
    return () => {
      live = false;
    };
  }, [profile, padId]);

  if (pad === null) return <Screen label={t('tools.pads')}>{null}</Screen>;
  if (pad === 'missing') {
    return (
      <Screen label={t('tools.pads')}>
        <CenterMessage>
          <p>{t('tools.pad.missing')}</p>
          <BackLink to="/tools" label={t('tools.title')} />
        </CenterMessage>
      </Screen>
    );
  }

  const save = (next: Pad) => {
    setPad(next);
    setError(null);
    if (profile) void savePad(appDb(), profile.id, next);
  };
  const write = (entry: PadEntry) => {
    try {
      save(addEntry(pad, entry, Date.now()));
    } catch {
      setError(t('tools.pad.bad-entry'));
    }
  };
  const sums = totals(pad);
  const winner = winnerOf(pad);
  const leader = leaderOf(pad);

  return (
    <Screen label={pad.title}>
      <BackLink to="/tools" label={t('tools.title')} />
      <header className="screen-head">
        <h1>{pad.title}</h1>
        <p className="muted">{padRule(pad)}</p>
      </header>
      <div className="pad-totals" role="list" aria-label={t('tools.pad.totals')}>
        {pad.names.map((name, i) => (
          <div key={i} role="listitem" className="pad-total" data-leader={leader === i} data-winner={winner === i}>
            <span className="pad-name">{name}</span>
            <span className="pad-score num">{(sums[i] ?? 0).toLocaleString('en')}</span>
          </div>
        ))}
      </div>
      {winner !== null ? (
        <div className="pad-winner card" role="status">
          <strong>{t('tools.pad.wins', { name: pad.names[winner] ?? '' })}</strong>
          <button type="button" className="btn btn-small btn-primary" onClick={() => save({ ...pad, entries: [], updatedAt: Date.now() })}>
            {t('tools.pad.again')}
          </button>
        </div>
      ) : null}
      <section className="card pad-form" aria-label={t('tools.pad.write')}>
        {pad.kind === 'dominoes' ? <ScoreForm pad={pad} onWrite={write} /> : null}
        {pad.kind === 'brisca' ? <BriscaForm pad={pad} onWrite={write} /> : null}
        {pad.kind === 'tally' ? <RoundForm pad={pad} onWrite={write} /> : null}
        {pad.kind === 'mahjong' ? <WinForm pad={pad} onWrite={write} /> : null}
        {error ? <p className="form-error">{error}</p> : null}
      </section>
      <section className="card">
        <div className="row-between">
          <h2>{t('tools.pad.history')}</h2>
          <button type="button" className="btn btn-small" disabled={pad.entries.length === 0} onClick={() => save(undoEntry(pad, Date.now()))}>
            {t('tools.pad.undo')}
          </button>
        </div>
        {pad.entries.length === 0 ? (
          <p className="muted">{t('tools.pad.empty')}</p>
        ) : (
          <ol className="pad-history">
            {pad.entries.map((e, i) => (
              <li key={i}>{entryText(pad, e)}</li>
            ))}
          </ol>
        )}
      </section>
      <details className="card pad-settings">
        <summary>{t('tools.pad.settings')}</summary>
        <label className="pad-field">
          <span>{t('tools.pad.title')}</span>
          <input className="field" value={pad.title} onChange={(e) => save({ ...pad, title: e.target.value, updatedAt: Date.now() })} />
        </label>
        {pad.names.map((name, i) => (
          <label key={i} className="pad-field">
            <span>{t('tools.pad.name', { n: i + 1 })}</span>
            <input className="field" value={name} onChange={(e) => save({ ...pad, names: pad.names.map((x, k) => (k === i ? e.target.value : x)), updatedAt: Date.now() })} />
          </label>
        ))}
        {pad.kind === 'tally' && pad.entries.length === 0 ? (
          <div className="tool-buttons">
            <button type="button" className="btn btn-small" disabled={pad.names.length >= 8} onClick={() => save({ ...pad, names: [...pad.names, t('tools.pad.player', { n: pad.names.length + 1 })], updatedAt: Date.now() })}>
              {t('tools.pad.add-player')}
            </button>
            <button type="button" className="btn btn-small" disabled={pad.names.length <= 2} onClick={() => save({ ...pad, names: pad.names.slice(0, -1), updatedAt: Date.now() })}>
              {t('tools.pad.remove-player')}
            </button>
          </div>
        ) : null}
        {TARGETS[pad.kind].length > 0 ? (
          <Segmented label={tDynamic(`tools.pad.target.${pad.kind}`)} value={pad.target} options={TARGETS[pad.kind].map((v) => ({ value: v, label: v === 0 ? t('tools.pad.no-target') : String(v) }))} onChange={(target) => save({ ...pad, target, updatedAt: Date.now() })} />
        ) : null}
        {pad.kind === 'tally' ? (
          <Segmented label={t('tools.pad.who-wins')} value={pad.lowWins ? 'low' : 'high'} options={[{ value: 'high', label: t('tools.pad.high') }, { value: 'low', label: t('tools.pad.low') }]} onChange={(v) => save({ ...pad, lowWins: v === 'low', updatedAt: Date.now() })} />
        ) : null}
        {pad.kind === 'mahjong' ? <Segmented label={t('tools.pad.start')} value={pad.start} options={STARTS.map((v) => ({ value: v, label: v.toLocaleString('en') }))} onChange={(start) => save({ ...pad, start, updatedAt: Date.now() })} /> : null}
      </details>
    </Screen>
  );
}

function padRule(pad: Pad): string {
  if (pad.kind === 'mahjong') return t('tools.pad.rule.mahjong', { n: pad.start.toLocaleString('en') });
  if (pad.target <= 0) return t('tools.pad.rule.open');
  return tDynamic(`tools.pad.rule.${pad.kind}`, { n: pad.target });
}

function entryText(pad: Pad, e: PadEntry): string {
  const name = (i: number) => pad.names[i] ?? '';
  switch (e.type) {
    case 'score':
      return t('tools.pad.log.score', { name: name(e.side), n: e.points });
    case 'hand': {
      const w = briscaHandWinner(e.first);
      return t('tools.pad.log.hand', { a: name(0), x: e.first, b: name(1), y: BRISCA_TOTAL - e.first, result: w === null ? t('tools.pad.tie') : t('tools.pad.takes', { name: name(w) }) });
    }
    case 'round':
      return e.points.map((p, i) => `${name(i)} ${p}`).join(' · ');
    case 'win':
      return e.from === null ? t('tools.pad.log.self', { name: name(e.winner), n: e.amount }) : t(e.mode === 'discarder' ? 'tools.pad.log.discard' : 'tools.pad.log.half-gun', { name: name(e.winner), from: name(e.from), n: e.amount });
  }
}

/** A whole number from a text box, or null. */
const whole = (text: string): number | null => (/^-?\d+$/.test(text.trim()) ? Number(text.trim()) : null);

function ScoreForm({ pad, onWrite }: { pad: Pad; onWrite: (e: PadEntry) => void }) {
  const [points, setPoints] = useState('');
  const n = whole(points);
  return (
    <div className="pad-row">
      <label className="pad-field">
        <span>{t('tools.pad.points')}</span>
        <input className="field" inputMode="numeric" value={points} onChange={(e) => setPoints(e.target.value)} />
      </label>
      {pad.names.map((name, side) => (
        <button
          key={side}
          type="button"
          className="btn btn-small btn-primary"
          disabled={n === null || n < 0}
          onClick={() => {
            if (n === null) return;
            onWrite({ type: 'score', side, points: n });
            setPoints('');
          }}
        >
          {t('tools.pad.to', { name })}
        </button>
      ))}
    </div>
  );
}

function BriscaForm({ pad, onWrite }: { pad: Pad; onWrite: (e: PadEntry) => void }) {
  const [points, setPoints] = useState('');
  const n = whole(points);
  const ok = n !== null && n >= 0 && n <= BRISCA_TOTAL;
  return (
    <div className="pad-row">
      <label className="pad-field">
        <span>{t('tools.pad.points-of', { name: pad.names[0] ?? '' })}</span>
        <input className="field" inputMode="numeric" value={points} onChange={(e) => setPoints(e.target.value)} />
      </label>
      <span className="muted">{ok ? t('tools.pad.rest', { name: pad.names[1] ?? '', n: BRISCA_TOTAL - (n ?? 0) }) : t('tools.pad.of-120')}</span>
      <button
        type="button"
        className="btn btn-small btn-primary"
        disabled={!ok}
        onClick={() => {
          if (n === null) return;
          onWrite({ type: 'hand', first: n });
          setPoints('');
        }}
      >
        {t('tools.pad.add-hand')}
      </button>
    </div>
  );
}

function RoundForm({ pad, onWrite }: { pad: Pad; onWrite: (e: PadEntry) => void }) {
  const [points, setPoints] = useState<string[]>(pad.names.map(() => ''));
  const values = pad.names.map((_, i) => whole(points[i] ?? '') ?? (points[i]?.trim() === '' ? 0 : null));
  return (
    <div className="pad-row">
      {pad.names.map((name, i) => (
        <label key={i} className="pad-field pad-field-small">
          <span>{name}</span>
          <input className="field" inputMode="numeric" value={points[i] ?? ''} onChange={(e) => setPoints(pad.names.map((_, k) => (k === i ? e.target.value : (points[k] ?? ''))))} />
        </label>
      ))}
      <button
        type="button"
        className="btn btn-small btn-primary"
        disabled={values.some((v) => v === null) || points.every((p) => p.trim() === '')}
        onClick={() => {
          onWrite({ type: 'round', points: values.map((v) => v ?? 0) });
          setPoints(pad.names.map(() => ''));
        }}
      >
        {t('tools.pad.add-round')}
      </button>
    </div>
  );
}

function WinForm({ pad, onWrite }: { pad: Pad; onWrite: (e: PadEntry) => void }) {
  const [winner, setWinner] = useState(0);
  const [from, setFrom] = useState<number | 'self'>('self');
  const [mode, setMode] = useState<'discarder' | 'half-gun'>('discarder');
  const [amount, setAmount] = useState('');
  const n = whole(amount);
  const fromNow = from !== 'self' && from === winner ? 'self' : from;
  return (
    <div className="stack" style={{ gap: 'var(--sp-2)' }}>
      <Segmented label={t('tools.pad.winner')} value={winner} options={pad.names.map((name, i) => ({ value: i, label: name }))} onChange={setWinner} />
      <Segmented
        label={t('tools.pad.how')}
        value={fromNow}
        options={[{ value: 'self' as const, label: t('tools.pad.self-drawn') }, ...pad.names.flatMap((name, i) => (i === winner ? [] : [{ value: i, label: t('tools.pad.from', { name }) }]))]}
        onChange={(v) => setFrom(v)}
      />
      {fromNow !== 'self' ? <Segmented label={t('tools.pad.who-pays')} value={mode} options={[{ value: 'discarder' as const, label: t('tools.pad.mode.discarder') }, { value: 'half-gun' as const, label: t('tools.pad.mode.half-gun') }]} onChange={setMode} /> : null}
      <div className="pad-row">
        <label className="pad-field">
          <span>{fromNow === 'self' ? t('tools.pad.each-pays') : mode === 'discarder' ? t('tools.pad.discarder-pays') : t('tools.pad.each-pays-double')}</span>
          <input className="field" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button
          type="button"
          className="btn btn-small btn-primary"
          disabled={n === null || n <= 0}
          onClick={() => {
            if (n === null) return;
            onWrite({ type: 'win', winner, from: fromNow === 'self' ? null : fromNow, amount: n, mode });
            setAmount('');
          }}
        >
          {t('tools.pad.add-win')}
        </button>
      </div>
    </div>
  );
}
