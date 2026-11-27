/**
 * Tiles on a table: DOM elements moved with CSS transforms, so a tile that changes place slides
 * there and turns as it goes. Every tile keeps its key from place to place. Each element is drawn
 * at one base size and scaled, so size changes animate too. Tiles a person may play are buttons
 * with a label ("3-5"), which the end-to-end tests click by name.
 */
import type { ReactNode } from 'react';

/** The base tile is BASE * 2 by BASE pixels before scaling. */
export const BASE = 20;

export interface PlacedTile {
  readonly key: string;
  /** The face, or null for a tile shown face down. */
  readonly face: ReactNode | null;
  readonly back: ReactNode;
  /** Centre of the tile in pixels from the top left of the table. */
  readonly x: number;
  readonly y: number;
  /** Degrees; see line-layout.ts. */
  readonly rotate: number;
  /** Pixels per unit: the tile is 2 units long and 1 wide. */
  readonly unit: number;
  readonly z: number;
  readonly label?: string;
  readonly interactive?: boolean;
  readonly selected?: boolean;
  readonly tone?: 'win' | 'hint' | 'last' | null;
  readonly dim?: boolean;
}

export function TileLayer({ tiles, duration, onTile }: { tiles: readonly PlacedTile[]; duration: number; onTile?: (key: string) => void }) {
  return (
    <>
      {tiles.map((t) => {
        const scale = t.unit / BASE;
        const lift = t.selected ? t.unit * 0.45 : 0;
        const style = {
          width: `${BASE * 2}px`,
          height: `${BASE}px`,
          zIndex: t.z,
          transform: `translate(${t.x - BASE}px, ${t.y - BASE / 2 - lift}px) rotate(${t.rotate}deg) scale(${scale})`,
          transitionDuration: `${duration}ms`,
        };
        const inner = t.face ?? t.back;
        if (t.interactive) {
          return (
            <button key={t.key} type="button" className="table-tile" data-selected={t.selected === true} data-tone={t.tone ?? undefined} data-dim={t.dim === true} aria-label={t.label} aria-pressed={t.selected === true} style={style} onClick={() => onTile?.(t.key)}>
              {inner}
            </button>
          );
        }
        return (
          <div key={t.key} className="table-tile" data-tone={t.tone ?? undefined} data-dim={t.dim === true} role={t.label ? 'img' : undefined} aria-label={t.label} aria-hidden={t.label ? undefined : true} style={style}>
            {inner}
          </div>
        );
      })}
    </>
  );
}
