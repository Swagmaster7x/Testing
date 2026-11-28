/**
 * Go joseki basics (M15): five of the most common corner sequences on the 4-4 and 3-4 points, in
 * the upper-right corner of the full board. Written by hand; each move is legal on the rules, and
 * the tests check that the small KataGo network shipped for the review ranks every answer among its
 * top three local choices (with the other corners taken, so the corner is where play belongs).
 *
 * `side` is the player the trainer asks: the one whose choices the sequence teaches. The drill
 * asks both sides' moves.
 */
import type { StudyLine } from '../../teach/lines';
import { parsePoint, sgfName } from './coords';

const SIZE = 19;
export const JOSEKI_START = `${Array.from({ length: SIZE }, () => '.'.repeat(SIZE)).join('/')} b`;

interface JosekiData {
  readonly id: string;
  readonly name: string;
  readonly idea: string;
  /** Point names, Black first. */
  readonly points: string;
  readonly side: 0 | 1;
  readonly group: '4-4' | '3-4';
}

const JOSEKI: readonly JosekiData[] = [
  {
    id: 'hoshi-sansan',
    name: '4-4 point: the 3-3 invasion',
    idea: 'White slips under the 4-4 stone to live in the corner; Black blocks on the side it wants and builds a wall facing that side.',
    points: 'Q16 R17 Q17 R16 Q15 S14',
    side: 1,
    group: '4-4',
  },
  {
    id: 'hoshi-attach',
    name: '4-4 point: low approach, attach and stand',
    idea: 'Black touches the approaching stone from the corner side; White stands up and extends along the top while Black takes the corner and the right side.',
    points: 'Q16 O17 P17 O16 Q14 K16',
    side: 0,
    group: '4-4',
  },
  {
    id: 'komoku-attach',
    name: '3-4 point: low approach, attach and extend',
    idea: 'Black attaches under the approach and keeps the corner, then jumps down the right side; White gets a solid shape and extends along the top.',
    points: 'R16 P17 Q17 P16 Q14 L17',
    side: 0,
    group: '3-4',
  },
  {
    id: 'komoku-kosumi',
    name: '3-4 point: low approach, diagonal answer',
    idea: 'Black’s quiet diagonal move makes the corner safe; White settles at once with a two-space extension along the top.',
    points: 'R16 P17 Q15 M17',
    side: 1,
    group: '3-4',
  },
  {
    id: 'komoku-high',
    name: '3-4 point: high approach, attach underneath',
    idea: 'Against the high approach Black attaches underneath, and the sequence reaches the same shape as the low approach: two move orders, one result.',
    points: 'R16 P16 Q17 P17 Q14 L17',
    side: 1,
    group: '3-4',
  },
];

export interface Joseki extends StudyLine {
  /** The moves as point names ("Q16"), for text and tests. */
  readonly points: readonly string[];
}

let built: readonly Joseki[] | null = null;

/** The joseki as study lines, moves in SGF letters (the Go game's stored form). */
export function josekiLines(): readonly Joseki[] {
  if (built) return built;
  built = JOSEKI.map((j) => {
    const points = j.points.split(' ');
    const moves = points.map((name) => {
      const p = parsePoint(name, SIZE);
      if (p === null) throw new Error(`Joseki ${j.id}: ${name} is not a point`);
      return sgfName(p, SIZE);
    });
    return { id: j.id, name: j.name, idea: j.idea, start: JOSEKI_START, moves, points, side: j.side, group: j.group };
  });
  return built;
}
