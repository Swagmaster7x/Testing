import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';

/** A button that opens a small menu below it. Escape or a tap elsewhere closes it. */
export function MenuButton({ label, children }: { label: string; children: (close: () => void) => ReactNode }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return (
    <div ref={wrap} style={{ position: 'relative' }}>
      <button type="button" className="icon-btn" aria-label={label} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="menu" />
      </button>
      {open ? (
        <div className="menu" role="menu" style={{ right: 0, top: 'calc(100% + 4px)' }}>
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
