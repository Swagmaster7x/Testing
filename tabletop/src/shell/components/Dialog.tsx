import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { t } from '../../text';

interface DialogProps {
  readonly title: string;
  readonly children?: ReactNode;
  readonly confirmLabel: string;
  readonly danger?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

/** A confirmation dialog. Escape or a tap outside cancels; focus starts on Cancel. */
export function ConfirmDialog({ title, children, confirmLabel, danger = false, onConfirm, onCancel }: DialogProps) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div className="dialog-scrim" onPointerDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="dialog" role="alertdialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        {children ? <div className="muted">{children}</div> : null}
        <div className="dialog-actions">
          <button ref={cancelRef} type="button" className="btn btn-quiet" onClick={onCancel}>
            {t('common.cancel')}
          </button>
          <button type="button" className={danger ? 'btn btn-danger' : 'btn btn-primary'} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
