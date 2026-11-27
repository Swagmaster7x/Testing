/**
 * The chess coach in the rail: a three-step hint (where to look, the idea, the move), what the
 * other side threatens, and an evaluation bar. Each help is a switch; hints and threats mark the
 * game as training.
 */
import type { Square } from 'chess.js';
import { useEffect, useState } from 'react';
import { isJsonObject } from '../../../core/json';
import { PIECE_NAMES } from '../../../kits/board/chess-pieces';
import { t, tDynamic } from '../../../text';
import type { CoachPanelProps } from '../../types';
import { NO_OVERLAY } from '../../types';
import type { ChessState } from '../rules';
import { pieceAt } from '../rules';

interface Hint {
  readonly uci: string;
  readonly san: string;
  readonly from: string;
  readonly to: string;
  readonly idea: string;
}

interface Threat {
  readonly san: string;
  readonly from: string;
  readonly to: string;
  readonly mate: number | null;
}

function pieceName(fen: string, square: string): string {
  const p = pieceAt(fen, square as Square);
  return p ? t(`chess.piece.${PIECE_NAMES[p.type]}` as never) : '';
}

export function formatEval(white: number, mate: number | null): string {
  if (mate !== null) return mate > 0 ? t('chess.eval.mate-white', { n: mate }) : t('chess.eval.mate-black', { n: -mate });
  const pawns = white / 100;
  return `${pawns > 0 ? '+' : ''}${pawns.toFixed(1)}`;
}

export function ChessCoachPanel({ state, seat, helps, ask, setOverlay, markTraining }: CoachPanelProps<ChessState>) {
  const [hint, setHint] = useState<{ fen: string; step: number; data: Hint | null } | null>(null);
  const [threat, setThreat] = useState<{ fen: string; data: Threat | null } | null>(null);
  const [evaluation, setEvaluation] = useState<{ fen: string; white: number; mate: number | null } | null>(null);
  const [busy, setBusy] = useState(false);
  const fen = state.fen;
  const myTurn = seat !== null;
  const hintHere = hint?.fen === fen ? hint : null;

  // Threats, worked out afresh at the start of each of the person's turns.
  useEffect(() => {
    if (!helps.threats || !myTurn) return;
    let live = true;
    ask({ type: 'threats' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || !Array.isArray(answer.threats)) return;
        const first = answer.threats[0];
        setThreat({ fen, data: isJsonObject(first) ? (first as unknown as Threat) : null });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [helps.threats, myTurn, fen, ask]);

  useEffect(() => {
    if (!helps.eval) return;
    let live = true;
    ask({ type: 'eval' })
      .then((answer) => {
        if (!live || !isJsonObject(answer) || typeof answer.white !== 'number') return;
        setEvaluation({ fen, white: answer.white, mate: typeof answer.mate === 'number' ? answer.mate : null });
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [helps.eval, fen, ask]);

  // What the coach draws: the threat arrow, then the hint on top of it.
  const threatHere = helps.threats && threat?.fen === fen ? threat.data : null;
  useEffect(() => {
    const arrows = [];
    const marks = [];
    if (threatHere) arrows.push({ from: threatHere.from, to: threatHere.to, tone: 'threat' as const });
    if (hintHere?.data) {
      if (hintHere.step >= 1) marks.push({ square: hintHere.data.from, tone: 'hint' as const });
      if (hintHere.step >= 3) arrows.push({ from: hintHere.data.from, to: hintHere.data.to, tone: 'hint' as const });
    }
    setOverlay(arrows.length || marks.length ? { arrows, marks } : NO_OVERLAY);
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
      setHint({ fen, step: 1, data: isJsonObject(answer) ? (answer as unknown as Hint) : null });
    } finally {
      setBusy(false);
    }
  };

  const evalHere = evaluation?.fen === fen ? evaluation : null;
  const whiteShare = evalHere ? (evalHere.mate !== null ? (evalHere.mate > 0 ? 1 : 0) : 1 / (1 + Math.exp(-evalHere.white / 250))) : 0.5;

  return (
    <div className="coach">
      {myTurn ? (
        <div className="coach-hint">
          <button type="button" className="btn btn-small" onClick={() => void nextHint()} disabled={busy || (hintHere?.step ?? 0) >= 3}>
            {hintHere ? t('coach.hint.more') : t('coach.hint')}
          </button>
          {hintHere?.data ? (
            <ol className="hint-steps">
              <li>{t('coach.hint.look', { piece: pieceName(fen, hintHere.data.from), square: hintHere.data.from })}</li>
              {hintHere.step >= 2 ? <li>{tDynamic(`coach.idea.${hintHere.data.idea}`)}</li> : null}
              {hintHere.step >= 3 ? <li>{t('coach.hint.move', { move: hintHere.data.san })}</li> : null}
            </ol>
          ) : null}
        </div>
      ) : null}
      {helps.threats && myTurn ? (
        <p className="coach-line" aria-live="polite">
          {threatHere
            ? threatHere.mate
              ? t('coach.threat.mate', { move: threatHere.san, n: threatHere.mate })
              : t('coach.threat', { move: threatHere.san })
            : threat?.fen === fen
              ? t('coach.threat.none')
              : t('common.loading')}
        </p>
      ) : null}
      {helps.eval ? (
        <div className="eval" aria-label={t('coach.eval.label', { value: evalHere ? formatEval(evalHere.white, evalHere.mate) : '…' })}>
          <div className="eval-bar">
            <div className="eval-white" style={{ width: `${Math.round(whiteShare * 100)}%` }} />
          </div>
          <span className="num">{evalHere ? formatEval(evalHere.white, evalHere.mate) : '…'}</span>
        </div>
      ) : null}
    </div>
  );
}
