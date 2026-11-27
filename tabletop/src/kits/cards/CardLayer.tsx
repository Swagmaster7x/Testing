/**
 * Cards on a table (PLAN.md 2.1): DOM elements moved with CSS transforms, so a card that changes
 * place slides there. Every card keeps its key from place to place. Cards a person may play are
 * buttons with a label ("As de oros"), which the end-to-end tests click by name.
 */
import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';

export interface PlacedCard {
  readonly key: string;
  /** The face, or null for a card shown face down. */
  readonly face: ReactNode | null;
  readonly back: ReactNode;
  /** Centre of the card in pixels from the top left of the table. */
  readonly x: number;
  readonly y: number;
  readonly rotate?: number;
  readonly z: number;
  readonly label?: string;
  /** Pressing it calls onCard. */
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly tone?: 'win' | 'hint' | null;
  readonly scale?: number;
}

export function useSize<T extends HTMLElement>(): [React.RefObject<T | null>, { width: number; height: number }] {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: Math.round(box.width), height: Math.round(box.height) });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, size];
}

export function CardLayer({ cards, cardWidth, duration, onCard }: { cards: readonly PlacedCard[]; cardWidth: number; duration: number; onCard?: (key: string) => void }) {
  const cardHeight = cardWidth * 1.5;
  return (
    <>
      {cards.map((c) => {
        const style = {
          width: `${cardWidth}px`,
          height: `${cardHeight}px`,
          zIndex: c.z,
          transform: `translate(${c.x - cardWidth / 2}px, ${c.y - cardHeight / 2 - (c.selected ? cardHeight * 0.14 : 0)}px) rotate(${c.rotate ?? 0}deg) scale(${c.scale ?? 1})`,
          transitionDuration: `${duration}ms`,
        };
        const inner = c.face ?? c.back;
        if (c.interactive) {
          return (
            <button key={c.key} type="button" className="table-card" data-selected={c.selected === true} data-tone={c.tone ?? undefined} aria-label={c.label} aria-pressed={c.selected === true} style={style} onClick={() => onCard?.(c.key)}>
              {inner}
            </button>
          );
        }
        return (
          <div key={c.key} className="table-card" data-tone={c.tone ?? undefined} role={c.label ? 'img' : undefined} aria-label={c.label} aria-hidden={c.label ? undefined : true} style={style}>
            {inner}
          </div>
        );
      })}
    </>
  );
}
