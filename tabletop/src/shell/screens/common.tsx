import type { ReactNode } from 'react';
import { Icon } from '../components/Icon';
import { t } from '../../text';
import { href } from '../router';

export function Screen({ children, label }: { children: ReactNode; label: string }) {
  return (
    <main className="screen" aria-label={label} tabIndex={0}>
      <div className="screen-inner">
        <p className="sideways-hint">
          <Icon name="rotate" size={18} />
          {t('app.better-sideways')}
        </p>
        {children}
      </div>
    </main>
  );
}

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <a className="back-link" href={href(to)}>
      <Icon name="back" size={18} />
      {label}
    </a>
  );
}

export function CenterMessage({ children }: { children: ReactNode }) {
  return (
    <div className="center-message">
      <div className="stack">{children}</div>
    </div>
  );
}
