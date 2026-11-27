/**
 * 3×3 shape patterns for the playouts: when the point in the middle is empty and its eight
 * neighbours match one of these shapes, playing there is usually good (a hane, a cut, a block
 * on the edge). They are the well-known patterns published with the MoGo program (Gelly, Wang,
 * Munos and Teytaud, "Modification of UCT with Patterns in Monte-Carlo Go", 2006), written out
 * here from that description.
 *
 * Notation: X and O are the two colours (either way round), '.' empty, ' ' off the board,
 * 'x' anything but X, 'o' anything but O, '?' anything. Every pattern also matches rotated,
 * mirrored and with the colours swapped.
 */

const PATTERNS: readonly (readonly [string, string, string])[] = [
  ['XOX', '...', '???'], // hane: enclosing hane
  ['XO.', '...', '?.?'], // hane: non-cutting hane
  ['XO?', 'X..', 'x.?'], // hane: magari (turn)
  ['.O.', 'X..', '...'], // attachment beside a stone (katatsuke)
  ['XO?', 'O.o', '?o?'], // cut: an unprotected cut
  ['XO?', 'O.X', '???'], // cut: a peeped cut
  ['?X?', 'O.O', 'ooo'], // cut: pushing through (de)
  ['OX?', 'o.O', '???'], // cut: the knight's-move cut
  ['X.?', 'O.?', '   '], // edge: chase
  ['OX?', 'X.O', '   '], // edge: block the cut
  ['?X?', 'x.O', '   '], // edge: block the connection
  ['?XO', 'x.x', '   '], // edge: descend (sagari)
  ['?OX', 'X.O', '   '], // edge: cut
];

/** Cell codes: 0 empty, 1 black, 2 white, 3 off the board. */
const CODE: Record<string, number> = { '.': 0, X: 1, O: 2, ' ': 3 };

const rot90 = (p: string[]): string[] => [0, 1, 2].map((c) => [2, 1, 0].map((r) => (p[r] as string)[c]).join(''));
const flipV = (p: string[]): string[] => [p[2] as string, p[1] as string, p[0] as string];
const flipH = (p: string[]): string[] => p.map((row) => [...row].reverse().join(''));
const swap = (p: string[]): string[] => p.map((row) => row.replace(/X/g, 'Z').replace(/x/g, 'z').replace(/O/g, 'X').replace(/o/g, 'x').replace(/Z/g, 'O').replace(/z/g, 'o'));

function wild(text: string, ch: string, to: readonly string[]): string[] {
  const i = text.indexOf(ch);
  if (i < 0) return [text];
  return to.flatMap((t) => wild(text.slice(0, i) + t + text.slice(i + 1), ch, to));
}

/** The neighbour order used for the 16-bit code: the 3×3 square row by row, the centre left out. */
const ORDER = [0, 1, 2, 3, 5, 6, 7, 8];

function build(): Uint8Array {
  const table = new Uint8Array(1 << 16);
  for (const base of PATTERNS) {
    for (const a of [[...base], rot90([...base])]) {
      for (const b of [a, flipV(a)]) {
        for (const c of [b, flipH(b)]) {
          for (const d of [c, swap(c)]) {
            for (const e of wild(d.join(''), '?', ['.', 'X', 'O', ' '])) {
              for (const f of wild(e, 'x', ['.', 'O', ' '])) {
                for (const g of wild(f, 'o', ['.', 'X', ' '])) {
                  if (g[4] !== '.') continue;
                  let code = 0;
                  ORDER.forEach((cell, k) => {
                    code |= (CODE[g[cell] as string] as number) << (2 * k);
                  });
                  table[code] = 1;
                }
              }
            }
          }
        }
      }
    }
  }
  return table;
}

export const PATTERN_TABLE: Uint8Array = build();

/** The 16-bit neighbourhood code of padded index i on a board with this row width. */
export function neighbourhood(color: Uint8Array, i: number, width: number): number {
  return (
    (color[i - width - 1] as number) |
    ((color[i - width] as number) << 2) |
    ((color[i - width + 1] as number) << 4) |
    ((color[i - 1] as number) << 6) |
    ((color[i + 1] as number) << 8) |
    ((color[i + width - 1] as number) << 10) |
    ((color[i + width] as number) << 12) |
    ((color[i + width + 1] as number) << 14)
  );
}

export function matchesPattern(color: Uint8Array, i: number, width: number): boolean {
  return PATTERN_TABLE[neighbourhood(color, i, width)] === 1;
}
