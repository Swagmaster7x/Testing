/**
 * The mahjong coach in the rail: a three-step hint (where to look, the idea, the move) and, as
 * switches, the efficiency helper (tiles from ready and the useful tiles for each discard), the
 * tiles you have not seen yet (what a real player counts in their head), and a safe-tile ranking
 * against each player. Everything here is worked out from what your seat can see.
 */
import { useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import { setsIn } from '../core/engine';
import { bestReading, shanten } from '../core/shanten';
import type { Kind } from '../core/tiles';
import { codeOf, PLAYING_KINDS } from '../core/tiles';
import type { MahjongState } from '../rules';
import { parseAction, viewOf } from '../rules';
import type { SeatPicture } from '../strategy';
import { evaluateDiscards, handShanten, picture, readThreats, readyInfo, safetyRanking } from '../strategy';
import { MiniTile } from './MahjongSurface';
import { kindName, moveName, whoName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

function Efficiency({ p, learner }: { p: SeatPicture; learner: boolean }) {
  const total = p.counts.reduce((a, b) => a + b, 0);
  const need = setsIn(p.rules) - p.melds.length;
  if (total % 3 === 2) {
    const sh = handShanten(p);
    if (sh < 0) return <p className="mj-coach-note">{t('mahjong.coach.eff.complete')}</p>;
    const evals = evaluateDiscards(p).sort((a, b) => a.shanten - b.shanten || b.accept - a.accept || a.kind - b.kind);
    const best = evals[0];
    const c = [...p.counts];
    const reading = bestReading(c, need);
    return (
      <div className="stack" style={{ gap: 4 }}>
        <p className="mj-coach-note">
          {sh === 0 ? t('mahjong.coach.eff.ready') : t('mahjong.coach.eff.now', { n: sh })}{' '}
          {t('mahjong.coach.eff.reading', { sets: reading.sets.length, partials: reading.partials.length, pair: reading.pair !== null ? t('mahjong.coach.eff.pair') : '' })}
        </p>
        <table className="mj-eff">
          <thead>
            <tr>
              <th>{t('mahjong.coach.eff.head')}</th>
              <th className="num">{t('mahjong.coach.eff.from-ready')}</th>
              <th className="num">{t('mahjong.coach.eff.useful')}</th>
            </tr>
          </thead>
          <tbody>
            {evals.slice(0, 6).map((e) => (
              <tr key={e.kind} data-best={best !== undefined && e.shanten === best.shanten && e.accept === best.accept}>
                <td>
                  <MiniTile kind={e.kind} learner={learner} width={15} /> {kindName(e.kind)}
                </td>
                <td className="num">{e.shanten}</td>
                <td className="num">
                  {e.ready ? (e.ready.winnable > 0 ? e.ready.winnable : t('mahjong.coach.eff.no-win')) : e.accept}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  const now = shanten(p.counts, p.melds.length, p.shapes);
  const reading = bestReading(p.counts, need);
  if (now === 0) {
    const ready = readyInfo(p, p.counts);
    return (
      <div className="stack" style={{ gap: 4 }}>
        <p className="mj-coach-note">{t('mahjong.coach.eff.ready')}</p>
        <p className="mj-coach-text">
          {t('mahjong.coach.eff.waits', {
            list: ready.waits.map((w) => t('mahjong.coach.eff.wait-short', { tile: kindName(w.kind), left: w.left, value: w.ron !== null || w.tsumo !== null ? t('mahjong.coach.eff.wait-value', { n: Math.max(w.ron ?? 0, w.tsumo ?? 0) }) : t('mahjong.coach.eff.wait-dead') })).join(', '),
          })}
        </p>
      </div>
    );
  }
  const useful: Kind[] = [];
  let count = 0;
  const c = [...p.counts];
  for (let k = 0; k < PLAYING_KINDS; k++) {
    if ((c[k] ?? 0) >= 4) continue;
    c[k] = (c[k] ?? 0) + 1;
    if (shanten(c, p.melds.length, p.shapes) < now) {
      useful.push(k);
      count += p.unseen[k] ?? 0;
    }
    c[k] = (c[k] ?? 0) - 1;
  }
  return (
    <div className="stack" style={{ gap: 4 }}>
      <p className="mj-coach-note">
        {t('mahjong.coach.eff.now', { n: now })} {t('mahjong.coach.eff.reading', { sets: reading.sets.length, partials: reading.partials.length, pair: reading.pair !== null ? t('mahjong.coach.eff.pair') : '' })}
      </p>
      <p className="mj-coach-text">{t('mahjong.coach.eff.accept', { n: count, list: useful.map((k) => kindName(k)).join(', ') })}</p>
    </div>
  );
}

function Unseen({ p, learner }: { p: SeatPicture; learner: boolean }) {
  const kinds = Array.from({ length: PLAYING_KINDS }, (_, k) => k);
  return (
    <div className="stack" style={{ gap: 4 }}>
      <p className="mj-coach-note">{t('mahjong.coach.unseen.note')}</p>
      <div className="mj-unseen" role="list" aria-label={t('mahjong.coach.unseen.title')}>
        {kinds.map((k) => (
          <span key={k} className="mj-unseen-cell" role="listitem" data-left={p.unseen[k] ?? 0} aria-label={`${kindName(k)}: ${p.unseen[k] ?? 0}`}>
            <MiniTile kind={k} learner={learner} width={20} />
            <span className="mj-unseen-count num" aria-hidden="true">
              {p.unseen[k] ?? 0}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function Safety({ p, learner }: { p: SeatPicture; learner: boolean }) {
  const threats = readThreats(p.view);
  const ranking = safetyRanking(p, threats);
  const level = (x: number) => (x < 0.3 ? 'low' : x < 0.65 ? 'mid' : 'high');
  return (
    <div className="stack" style={{ gap: 4 }}>
      <ul className="plain-list" style={{ margin: 0, paddingLeft: 0, listStyle: 'none', fontSize: 'var(--fs-2xs)' }}>
        {threats.map((th) => (
          <li key={th.seat}>
            {t('mahjong.coach.safety.threat', {
              who: whoName(th.seat, p.seat),
              level: t(th.level < 0.3 ? 'mahjong.coach.safety.low' : th.level < 0.65 ? 'mahjong.coach.safety.some' : 'mahjong.coach.safety.high'),
            })}
            {th.suit !== null ? t('mahjong.coach.safety.suit', { suit: tDynamic(`mahjong.suitname.${th.suit}`) }) : ''}
          </li>
        ))}
      </ul>
      <p className="mj-coach-note">{t('mahjong.coach.safety.order')}</p>
      <div className="mj-safety-list">
        {ranking.map((r) => (
          <span key={r.kind} className="mj-safety-tile" data-level={level(r.danger)} aria-label={`${kindName(r.kind)}: ${r.danger.toFixed(2)}`}>
            <MiniTile kind={r.kind} learner={learner} width={17} />
            <span className="mj-danger num">{r.danger.toFixed(1)}</span>
          </span>
        ))}
      </div>
      <p className="mj-coach-note">{t('mahjong.coach.safety.note')}</p>
    </div>
  );
}

export function MahjongCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<MahjongState>) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  // The person sits in the first seat; on their turn `seat` says so.
  const me = seat ?? 0;
  const view = viewOf(state, me);
  const p = picture(view);
  const learner = helps.learner !== false;
  const key = `${state.handNo}/${state.discards.reduce((n, d) => n + d.length, 0)}/${state.phase}/${state.melds.reduce((n, m) => n + m.length, 0)}`;
  const current = hint?.key === key ? hint : null;

  const askHint = async () => {
    if (current) {
      const step = Math.min(3, current.step + 1);
      setHint({ ...current, step });
      if (step === 3) {
        const action = parseAction(current.action);
        if (action.type === 'discard') setOverlay({ arrows: [], marks: [{ square: codeOf(action.tile), tone: 'hint' }] });
      }
      return;
    }
    setBusy(true);
    markTraining();
    try {
      const answer = await ask({ type: 'hint' });
      if (isJsonObject(answer) && typeof answer.action === 'string') {
        setHint({ key, step: 1, action: answer.action, tags: Array.isArray(answer.tags) ? answer.tags.filter((x): x is string => typeof x === 'string') : [] });
        setOverlay(NO_OVERLAY);
      }
    } finally {
      setBusy(false);
    }
  };

  const idea = current?.tags[0] ? tDynamic(`mahjong.idea.${current.tags[0]}`) : tDynamic('mahjong.idea.other');
  const claimPhase = state.phase === 'claim' || state.phase === 'rob';

  return (
    <div className="coach-panel stack" style={{ gap: 'var(--sp-2)' }}>
      {seat === null || state.phase === 'scored' ? (
        <p className="empty-note">{t('mahjong.coach.not-your-turn')}</p>
      ) : (
        <>
          <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void askHint()}>
            {busy ? t('mahjong.coach.thinking') : current ? t('mahjong.coach.more') : t('mahjong.coach.hint')}
          </button>
          {current ? (
            <ol className="hint-steps" style={{ margin: 0, paddingLeft: '1.2em', fontSize: 'var(--fs-xs)' }}>
              <li>{t(claimPhase ? 'mahjong.coach.look.claim' : 'mahjong.coach.look.discard')}</li>
              {current.step >= 2 ? <li>{t('mahjong.coach.idea', { idea })}</li> : null}
              {current.step >= 3 ? <li>{t('mahjong.coach.move', { move: moveName(parseAction(current.action)) })}</li> : null}
            </ol>
          ) : null}
        </>
      )}
      {helps.efficiency ? (
        <section aria-label={t('mahjong.coach.eff.title')}>
          <h3 className="eyebrow">{t('mahjong.coach.eff.title')}</h3>
          <Efficiency p={p} learner={learner} />
        </section>
      ) : null}
      {helps.unseen ? (
        <section aria-label={t('mahjong.coach.unseen.title')}>
          <h3 className="eyebrow">{t('mahjong.coach.unseen.title')}</h3>
          <Unseen p={p} learner={learner} />
        </section>
      ) : null}
      {helps.safety ? (
        <section aria-label={t('mahjong.coach.safety.title')}>
          <h3 className="eyebrow">{t('mahjong.coach.safety.title')}</h3>
          <Safety p={p} learner={learner} />
        </section>
      ) : null}
    </div>
  );
}
