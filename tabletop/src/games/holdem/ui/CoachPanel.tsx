/**
 * The poker coach in the rail. A three-step hint (where to look, the idea, the play), and, as
 * switches, what a good player works out at the table: the pot odds, the outs, the equity against
 * the hands the others are likely to hold, the hand's name, the position, the preflop chart, and
 * reads on each player from the session so far (how often they play and raise a hand). Every help
 * marks the game as training.
 */
import { useEffect, useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import type { Card } from '../cards';
import { cardIndex, HAND_CLASSES } from '../cards';
import { openFraction, inTop } from '../preflop';
import { classOf, outs, readHand } from '../reading';
import type { HoldemState } from '../rules';
import { dealtOrder, potOf, positionName, toCallOf, viewOf } from '../rules';
import { seatName } from './names';

interface Hint {
  readonly key: string;
  readonly step: number;
  readonly action: string;
  readonly tags: readonly string[];
}

const pct = (x: number) => Math.round(x * 100);

/** Plain words for a player's statistics: how loose, how aggressive. */
export function readWords(hands: number, vpip: number, pfr: number): string {
  if (hands < 8) return t('poker.read.few');
  const v = vpip / hands;
  const p = pfr / hands;
  const loose = v < 0.18 ? 'tight' : v > 0.32 ? 'loose' : 'medium';
  const ratio = v > 0 ? p / v : 0;
  const style = ratio < 0.35 ? 'passive' : ratio > 0.65 ? 'aggressive' : 'balanced';
  return tDynamic(`poker.read.${loose}.${style}`);
}

export function PokerCoachPanel({ state, seat, helps, ask, markTraining }: CoachPanelProps<HoldemState>) {
  const [hint, setHint] = useState<Hint | null>(null);
  const [busy, setBusy] = useState(false);
  const [equity, setEquity] = useState<{ key: string; equity: number; random: number } | null>(null);
  const me = seat ?? 0;
  const view = viewOf(state, me);
  const mine = view.players[me];
  const key = `${state.handNo}/${state.log.length}/${state.board.length}`;
  const current = hint?.key === key ? hint : null;
  const hole = mine?.hole ?? [];
  const live = hole.length === 2 && !mine?.folded;
  const owe = Math.min(toCallOf(state, me), mine?.stack ?? 0);
  const pot = potOf(state);

  useEffect(() => {
    if (!helps.equity || !live || seat === null || equity?.key === key) return;
    let stale = false;
    void ask({ type: 'equity', samples: 1500 }).then((answer) => {
      if (stale || !isJsonObject(answer)) return;
      if (typeof answer.equity === 'number' && typeof answer.random === 'number') setEquity({ key, equity: answer.equity, random: answer.random });
    });
    return () => {
      stale = true;
    };
  }, [helps.equity, live, seat, key, ask, equity?.key]);

  const askHint = async () => {
    if (current) {
      setHint({ ...current, step: Math.min(3, current.step + 1) });
      return;
    }
    setBusy(true);
    markTraining();
    try {
      const answer = await ask({ type: 'hint' });
      if (isJsonObject(answer) && typeof answer.action === 'string') {
        setHint({ key, step: 1, action: answer.action, tags: Array.isArray(answer.tags) ? answer.tags.filter((x): x is string => typeof x === 'string') : [] });
      }
    } finally {
      setBusy(false);
    }
  };

  const moveText = current ? actionWords(current.action) : '';
  const reading = live && state.board.length >= 3 ? readHand([cardIndex(hole[0] as Card), cardIndex(hole[1] as Card)], state.board.map(cardIndex)) : null;
  const o = live ? outs(hole, state.board) : { draw: [], improve: [] };
  const pos = live ? positionName(state, me) : null;
  const players = dealtOrder(state).length;
  const cls = live ? classOf(hole) : '';
  const open = pos ? openFraction(pos === 'BB' ? 'SB' : pos, players) : 0;
  const toCome = state.board.length === 3 ? 2 : state.board.length === 4 ? 1 : 0;

  return (
    <div className="coach-panel poker-coach">
      {seat === null ? (
        <p className="empty-note">{t('poker.coach.not-your-turn')}</p>
      ) : (
        <div className="stack" style={{ gap: 'var(--sp-2)' }}>
          <button type="button" className="btn btn-small" disabled={busy || (current?.step ?? 0) >= 3} onClick={() => void askHint()}>
            {busy ? t('poker.coach.thinking') : current ? t('poker.coach.more') : t('poker.coach.hint')}
          </button>
          {current ? (
            <ol className="hint-steps">
              <li>{owe > 0 ? t('poker.coach.look.facing', { n: owe, pot }) : t('poker.coach.look.free')}</li>
              {current.step >= 2 ? <li>{tDynamic(`poker.idea.${current.tags[0] ?? 'other'}`)}</li> : null}
              {current.step >= 3 ? <li>{moveText}</li> : null}
            </ol>
          ) : null}
        </div>
      )}
      {helps.handName && live ? (
        <p className="coach-line">
          <span className="eyebrow">{t('poker.coach.hand')}</span>{' '}
          {reading ? [tDynamic(`poker.detail.${reading.detail ?? reading.category}`), ...reading.draws.map((x) => tDynamic(`poker.draw.${x}`))].join(' · ') : t('poker.coach.hand.pre', { cls })}
        </p>
      ) : null}
      {helps.potOdds && live ? (
        <p className="coach-line">
          <span className="eyebrow">{t('poker.help.potOdds')}</span> {owe > 0 ? t('poker.coach.odds', { call: owe, pot: pot + owe, need: pct(owe / (pot + owe)) }) : t('poker.coach.odds.none')}
        </p>
      ) : null}
      {helps.outs && live && toCome > 0 ? (
        <p className="coach-line">
          <span className="eyebrow">{t('poker.help.outs')}</span>{' '}
          {o.improve.length === 0 ? t('poker.coach.outs.none') : t(toCome === 2 ? 'poker.coach.outs.two' : 'poker.coach.outs.one', { draw: o.draw.length, improve: o.improve.length, rough: Math.min(100, o.improve.length * (toCome === 2 ? 4 : 2)), exact: pct(hitChance(o.improve.length, 52 - 2 - state.board.length, toCome)) })}
        </p>
      ) : null}
      {helps.equity && live ? (
        <p className="coach-line">
          <span className="eyebrow">{t('poker.help.equity')}</span>{' '}
          {equity?.key === key ? t('poker.coach.equity', { eq: pct(equity.equity), random: pct(equity.random) }) : t('poker.coach.thinking')}
        </p>
      ) : null}
      {helps.positions && pos ? (
        <p className="coach-line">
          <span className="eyebrow">{t('poker.help.positions')}</span> {tDynamic(`poker.coach.position.${pos}`)}
        </p>
      ) : null}
      {helps.chart && pos ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {pos === 'BB' ? t('poker.coach.chart.bb') : t('poker.coach.chart.title', { pos, n: pct(open) })}
          </p>
          <div className="preflop-chart" role="table" aria-label={t('poker.help.chart')}>
            {HAND_CLASSES.map((c) => (
              <span key={c} role="cell" className="chart-cell" data-in={inTop(c, open)} data-mine={c === cls} aria-label={`${c}${inTop(c, open) ? ` ${t('poker.coach.chart.in')}` : ''}`}>
                {c}
              </span>
            ))}
          </div>
          <p className="empty-note">{t('poker.coach.chart.note')}</p>
        </div>
      ) : null}
      {helps.stats ? (
        <div>
          <p className="eyebrow" style={{ margin: 'var(--sp-2) 0 var(--sp-1)' }}>
            {t('poker.coach.stats.title')}
          </p>
          <table className="poker-stats">
            <thead>
              <tr>
                <th>{t('poker.coach.stats.player')}</th>
                <th className="num">{t('poker.coach.stats.vpip')}</th>
                <th className="num">{t('poker.coach.stats.pfr')}</th>
              </tr>
            </thead>
            <tbody>
              {state.stats.map((st, s) => (
                <tr key={s}>
                  <td>
                    {seatName(s, me)}
                    <span className="stats-read">{readWords(st.hands, st.vpip, st.pfr)}</span>
                  </td>
                  <td className="num">{st.hands > 0 ? `${pct(st.vpip / st.hands)}%` : '–'}</td>
                  <td className="num">{st.hands > 0 ? `${pct(st.pfr / st.hands)}%` : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="empty-note">{t('poker.coach.stats.note')}</p>
        </div>
      ) : null}
    </div>
  );
}

/** "Call", "Raise to 12" for a notation such as "call" or "r12". */
export function actionWords(text: string): string {
  if (text.startsWith('r')) return t('poker.move.raise', { n: Number(text.slice(1)) });
  return tDynamic(`poker.move.${text}`);
}

/** The chance that at least one of `outs` cards comes among the next `cards`, from `unseen` cards. */
export function hitChance(outs: number, unseen: number, cards: number): number {
  let miss = 1;
  for (let i = 0; i < cards; i++) miss *= (unseen - outs - i) / (unseen - i);
  return 1 - miss;
}
