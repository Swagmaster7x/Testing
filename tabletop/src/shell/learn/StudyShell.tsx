/**
 * The layout for lessons, problems and drills: a status bar, the board taking the full height,
 * and a study panel beside it. The panel follows the rail side, for left-handed play. Card and
 * tile tables (`wide`) take the whole width beside the panel instead of a square.
 */
import type { ReactNode } from 'react';
import { t } from '../../text';
import { Icon } from '../components/Icon';
import { href } from '../router';
import { useApp } from '../state';

export function StudyShell({ title, meta, backTo, board, panel, label, wide = false }: { title: string; meta?: string | null; backTo: string; board: ReactNode; panel: ReactNode; label: string; wide?: boolean }) {
  const side = useApp((s) => s.settings?.railSide ?? 'right');
  return (
    <div className="table study" role="main" aria-label={label}>
      <header className="table-status">
        <a className="icon-btn" href={href(backTo)} aria-label={t('table.back')}>
          <Icon name="back" />
        </a>
        <div className="status-main">
          <span className="status-title">{title}</span>
          {meta ? <span className="status-meta num">{meta}</span> : null}
        </div>
      </header>
      <div className="study-body" data-side={side} data-wide={wide}>
        <section className="table-surface" data-wide={wide}>
          <div className={wide ? 'table-frame' : 'board-frame'}>{board}</div>
        </section>
        <section className="study-panel">{panel}</section>
      </div>
    </div>
  );
}
