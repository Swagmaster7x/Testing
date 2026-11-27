/**
 * How the Go coach talks to the Go board. The shell passes the coach's drawing to the surface as
 * arrows and marked squares; Go reads them this way:
 * - a mark on a point name ("D4" or "dd") is a ring on that point, except a hint mark, which
 *   shades the area around it ("look here"); an arrow from a point to itself, or to nothing, is
 *   a ring (the review's "better move" and "move played", the problem player's last hint);
 * - "area:<point>" shades the area around a point (the first step of a hint);
 * - "own:<point>:<value>" is the territory estimate, -1 (White's) to 1 (Black's);
 * - "dead:<point>" is a stone the coach suggests marking dead.
 */
import type { BoardMark } from '../../../kits/board/GridBoard';
import type { PointMark, PointTone } from '../../../kits/board/IntersectionBoard';
import type { SurfaceOverlay } from '../../types';
import { parsePoint, sgfName } from '../coords';

export function ownershipMarks(size: number, ownership: readonly number[]): BoardMark[] {
  const out: BoardMark[] = [];
  ownership.forEach((v, p) => {
    if (Math.abs(v) >= 0.2) out.push({ square: `own:${sgfName(p, size)}:${v.toFixed(2)}`, tone: 'info' });
  });
  return out;
}

export const areaMark = (point: string): BoardMark => ({ square: `area:${point}`, tone: 'hint' });
export const deadMark = (p: number, size: number): BoardMark => ({ square: `dead:${sgfName(p, size)}`, tone: 'info' });

export interface ReadOverlay {
  readonly marks: PointMark[];
  readonly owners: number[] | null;
  readonly strength: number[] | null;
  readonly suggestedDead: number[];
}

export function readOverlay(overlay: SurfaceOverlay, size: number): ReadOverlay {
  const marks: PointMark[] = [];
  let owners: number[] | null = null;
  let strength: number[] | null = null;
  const suggestedDead: number[] = [];
  const ring = (name: string, tone: PointTone) => {
    const p = parsePoint(name, size);
    if (p !== null) marks.push({ point: p, tone, shape: 'ring' });
  };
  for (const m of overlay.marks) {
    if (m.square.startsWith('own:')) {
      const [, name = '', value = '0'] = m.square.split(':');
      const p = parsePoint(name, size);
      if (p === null) continue;
      owners ??= new Array<number>(size * size).fill(0);
      strength ??= new Array<number>(size * size).fill(0);
      const v = Number(value);
      owners[p] = v > 0 ? 1 : 2;
      strength[p] = Math.abs(v);
    } else if (m.square.startsWith('area:')) {
      const p = parsePoint(m.square.slice(5), size);
      if (p !== null) marks.push({ point: p, tone: m.tone, shape: 'area' });
    } else if (m.square.startsWith('dead:')) {
      const p = parsePoint(m.square.slice(5), size);
      if (p !== null) suggestedDead.push(p);
    } else if (m.tone === 'hint') {
      // A plain hint mark says where to look (the problem player's first hint): the area, not the point.
      const p = parsePoint(m.square, size);
      if (p !== null) marks.push({ point: p, tone: 'hint', shape: 'area' });
    } else ring(m.square, m.tone);
  }
  for (const a of overlay.arrows) {
    ring(a.from, a.tone);
    if (a.to && a.to !== a.from) ring(a.to, a.tone);
  }
  return { marks, owners, strength, suggestedDead };
}
