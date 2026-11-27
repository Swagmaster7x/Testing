/**
 * The shogi coach in the rail: a three-step hint (where to look, the idea, the move), what the
 * other side threatens, an evaluation bar, and the piece faces. Hints and threats mark the game
 * as training; the faces and movement marks do not.
 */
import { useEffect, useState } from 'react';
import { isJsonObject } from '../../../core/json';
import type { MessageKey } from '../../../text';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps, SurfaceOverlay } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { ShogiState } from '../rules';
import { PIECE_NAMES } from '../rules';
import { STYLES, useShogiLook } from './look';
import { HAND_TYPE, pieceWord } from './ShogiSurface';

interface Hint {
  readonly move: string;
  readonly text: string;
  readonly from: string | null;
  readonly to: string;
  readonly drop: string | null;
  readonly piece: string | null;
  readonly idea: string;
}

interface Threat {
  readonly text: string;
  readonly from: string | null;
  readonly to: string;
  readonly drop: string | null;
  readonly mate: number | null;
}

/** Engine units to "pawns" for the bar (a pawn is about 90). */
export function formatShogiEval(black: number, mate: number | null): string {
  if (mate !== null) return mate > 0 ? t('shogi.eval.black-mates', { n: mate }) : t('shogi.eval.white-mates', { n: -mate });
  const pawns = black / 90;
  return `${pawns > 0 ? '+' : ''}${pawns.toFixed(1)}`;
}

function ideaText(idea: string): string {
  if (idea === 'promote' || idea === 'drop') return t(`shogi.idea.${idea}` as MessageKey);
  return tDynamic(`coach.idea.${idea}`);
}

function lookAt(hint: Hint): string {
  if (hint.drop) {
    const type = HAND_TYPE[hint.drop as keyof typeof HAND_TYPE] ?? 0;
    return t('shogi.hint.drop', { piece: pieceWord(type) });
  }
  const type = PIECE_NAMES.indexOf((hint.piece ?? 'pawn') as (typeof PIECE_NAMES)[number]);
  return t('coach.hint.look', { piece: pieceWord(Math.max(0, type)), square: hint.from ?? '' });
}

export function ShogiCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<ShogiState>) {
  const [hint, setHint] = useState<{ sfen: string; step: number; data: Hint | null } | null>(null);
  const [threat, setThreat] = useState<{ sfen: string; data: Threat | null } | null>(null);
  const [evaluation, setEvaluation] = useState<{ sfen: string; black: number; mate: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const { look, setStyle } = useShogiLook();
  const sfen = state.sfen;
  const myTurn = seat !== null;
  const hintHere = hint?.sfen === sfen ? hint : null;

  useEffect(() => {
    if (!helps.threats || !myTurn) return;
    let live = true;
    ask({ type: 'threats' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || !Array.isArray(answer.threats)) return;
        const first = answer.threats[0];
        setThreat({ sfen, data: isJsonObject(first) ? (first as unknown as Threat) : null });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [helps.threats, myTurn, sfen, ask]);

  useEffect(() => {
    if (!helps.eval) return;
    let live = true;
    ask({ type: 'eval' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || typeof answer.black !== 'number') return;
        setEvaluation({ sfen, black: answer.black, mate: typeof answer.mate === 'number' ? answer.mate : null });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [helps.eval, sfen, ask]);

  const threatHere = helps.threats && threat?.sfen === sfen ? threat.data : null;
  useEffect(() => {
    const overlay: { arrows: SurfaceOverlay['arrows'][number][]; marks: SurfaceOverlay['marks'][number][] } = { arrows: [], marks: [] };
    if (threatHere) overlay.arrows.push({ from: threatHere.from ?? `${threatHere.drop ?? 'P'}*`, to: threatHere.to, tone: 'threat' });
    const data = hintHere?.data;
    if (data && hintHere) {
      if (hintHere.step >= 1) overlay.marks.push({ square: data.from ?? `${data.drop ?? 'P'}*`, tone: 'hint' });
      if (hintHere.step >= 3) overlay.arrows.push({ from: data.from ?? `${data.drop ?? 'P'}*`, to: data.to, tone: 'hint' });
    }
    setOverlay(overlay.arrows.length || overlay.marks.length ? overlay : NO_OVERLAY);
  }, [threatHere, hintHere, setOverlay]);

  const nextHint = async () => {
    markTraining();
    if (hintHere?.data) {
      setHint({ ...hintHere, step: Math.min(3, hintHere.step + 1) });
      return;
    }
    setBusy(true);
    try {
      const answer = await ask({ type: 'hint' });
      setHint({ sfen, step: 1, data: isJsonObject(answer) ? (answer as unknown as Hint) : null });
    } finally {
      setBusy(false);
    }
  };

  const evalHere = evaluation?.sfen === sfen ? evaluation : null;
  const blackShare = evalHere ? (evalHere.mate !== null ? (evalHere.mate > 0 ? 1 : 0) : 1 / (1 + Math.exp(-evalHere.black / 600))) : 0.5;

  return (
    <div className="coach">
      {myTurn ? (
        <div className="coach-hint">
          <button type="button" className="btn btn-small" onClick={() => void nextHint()} disabled={busy || (hintHere?.step ?? 0) >= 3}>
            {hintHere ? t('coach.hint.more') : t('coach.hint')}
          </button>
          {hintHere?.data ? (
            <ol className="hint-steps">
              <li>{lookAt(hintHere.data)}</li>
              {hintHere.step >= 2 ? <li>{ideaText(hintHere.data.idea)}</li> : null}
              {hintHere.step >= 3 ? <li>{t('coach.hint.move', { move: hintHere.data.text || hintHere.data.move })}</li> : null}
            </ol>
          ) : null}
        </div>
      ) : null}
      {helps.threats && myTurn ? (
        <p className="coach-line" aria-live="polite">
          {threatHere
            ? threatHere.mate
              ? t('coach.threat.mate', { move: threatHere.text, n: threatHere.mate })
              : t('coach.threat', { move: threatHere.text })
            : threat?.sfen === sfen
              ? t('coach.threat.none')
              : t('common.loading')}
        </p>
      ) : null}
      {helps.eval ? (
        <div className="eval" aria-label={t('coach.eval.label', { value: evalHere ? formatShogiEval(evalHere.black, evalHere.mate) : '…' })}>
          <div className="eval-bar">
            <div className="eval-white" style={{ width: `${Math.round(blackShare * 100)}%` }} />
          </div>
          <span className="num">{evalHere ? formatShogiEval(evalHere.black, evalHere.mate) : '…'}</span>
        </div>
      ) : null}
      <div className="shogi-faces" role="radiogroup" aria-label={t('shogi.look.label')}>
        {STYLES.map((style) => (
          <button key={style} type="button" role="radio" aria-checked={look.style === style} className="help-chip" onClick={() => setStyle(style)}>
            {t(`shogi.look.${style}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
