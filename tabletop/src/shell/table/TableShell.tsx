/**
 * The table layout every game uses (PLAN.md 1.4): status bar, play surface, player panel and
 * the collapsible coach rail, which can sit on either side.
 */
import type { ReactNode } from 'react';
import type { RailSide } from '../../store/db';
import { t } from '../../text';
import { Icon } from '../components/Icon';
import { MenuButton } from '../components/Menu';
import { href } from '../router';

export interface TableShellProps {
  readonly title: string;
  readonly meta: readonly { key: string; text: string; label?: string; className?: string }[];
  readonly turn: { text: string; mine: boolean } | null;
  readonly backTo: string;
  readonly railSide: RailSide;
  readonly railOpen: boolean;
  readonly onToggleRail: () => void;
  readonly menu: (close: () => void) => ReactNode;
  readonly side: ReactNode;
  readonly surface: ReactNode;
  readonly rail: ReactNode;
  readonly label: string;
  /** Card and tile tables use the whole width instead of a square board. */
  readonly wide?: boolean;
}

export function TableShell(props: TableShellProps) {
  const { title, meta, turn, backTo, railSide, railOpen, onToggleRail, menu, side, surface, rail, label, wide = false } = props;
  return (
    <div className="table" role="main" aria-label={label}>
      <header className="table-status">
        <a className="icon-btn" href={href(backTo)} aria-label={t('table.back')}>
          <Icon name="back" />
        </a>
        <div className="status-main">
          <span className="status-title">{title}</span>
          {meta.map((m) => (
            <span key={m.key} className={`status-meta num ${m.className ?? ''}`} aria-label={m.label}>
              {m.text}
            </span>
          ))}
        </div>
        {turn ? (
          <span className="status-turn" data-mine={turn.mine} aria-live="polite">
            {turn.text}
          </span>
        ) : null}
        <button type="button" className="icon-btn" aria-pressed={railOpen} aria-label={railOpen ? t('table.rail.hide') : t('table.rail.show')} onClick={onToggleRail}>
          <Icon name="rail" />
        </button>
        <MenuButton label={t('table.menu')}>{menu}</MenuButton>
      </header>
      <div className="table-body" data-rail={railSide} data-rail-open={railOpen} data-wide={wide}>
        <section className="table-side">{side}</section>
        <section className="table-surface" data-wide={wide}>
          <div className={wide ? 'table-frame' : 'board-frame'}>{surface}</div>
        </section>
        {railOpen ? (
          <aside className="rail" aria-label={t('rail.label')}>
            {rail}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export interface MoveItem {
  readonly ply: number;
  readonly seat: number;
  readonly text: string;
}

/** Moves in numbered rows, one column per seat (two-seat games), or one move a line for more seats. */
export function MoveList({ moves, seatNames, current, linkFor }: { moves: readonly MoveItem[]; seatNames: readonly string[]; current?: number; linkFor?: (ply: number) => string }) {
  if (moves.length === 0) return <p className="empty-note">{t('rail.moves.none')}</p>;
  if (seatNames.length > 2) {
    // More than two players, or several moves by one player in a row: one move a line.
    return (
      <div className="moves single num" role="list">
        {moves.map((m) => {
          const text = `${seatNames[m.seat] ?? ''} ${m.text}`.trim();
          return (
            <div key={m.ply} role="listitem" style={{ display: 'contents' }}>
              <span className="n">{m.ply}.</span>
              {linkFor ? (
                <a className="mv" href={href(linkFor(m.ply))} data-current={current === m.ply} aria-current={current === m.ply ? 'step' : undefined}>
                  {text}
                </a>
              ) : (
                <span className="mv" data-current={current === m.ply}>
                  {text}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }
  const perRow = Math.max(1, seatNames.length);
  const rows: MoveItem[][] = [];
  moves.forEach((m, i) => {
    const r = Math.floor(i / perRow);
    (rows[r] ??= []).push(m);
  });
  return (
    <div className="moves num" role="list">
      {rows.map((row, r) => (
        <div key={r} role="listitem" style={{ display: 'contents' }}>
          <span className="n">{r + 1}.</span>
          {Array.from({ length: perRow }, (_, c) => {
            const m = row[c];
            if (!m) return <span key={c} />;
            const text = `${seatNames[m.seat] ?? ''} ${m.text}`.trim();
            return linkFor ? (
              <a key={c} className="mv" href={href(linkFor(m.ply))} data-current={current === m.ply} aria-current={current === m.ply ? 'step' : undefined}>
                {text}
              </a>
            ) : (
              <span key={c} className="mv" data-current={current === m.ply}>
                {text}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export function Counters({ rows }: { rows: readonly { label: string; value: string }[] }) {
  return (
    <dl className="counters">
      {rows.map((r) => (
        <div key={r.label} style={{ display: 'contents' }}>
          <dt>{r.label}</dt>
          <dd className="value num" style={{ margin: 0 }}>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function RailSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rail-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}
