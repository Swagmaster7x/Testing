/**
 * The chess opening trainer (M15): thirty-one common openings, each with its name, its moves and
 * its idea in one sentence. Names and moves are from the Lichess opening list (lichess-org/
 * chess-openings, CC0, fetched 2026-11-27): each line is that list's line for the name. The ideas
 * are this app's own words. Every move is played through chess.js when the lines are built, and
 * the tests and the lesson linter play them all again.
 *
 * `side` is the player whose choice the opening is: White for the openings White chooses, Black
 * for the defences. The trainer asks that side's moves; the drill asks both sides'.
 */
import type { StudyLine } from '../../teach/lines';
import { chessAt, START_FEN } from './rules';

interface OpeningData {
  readonly id: string;
  readonly eco: string;
  readonly name: string;
  readonly san: string;
  readonly side: 'w' | 'b';
  readonly group: 'open' | 'semi-open' | 'closed' | 'flank';
  readonly idea: string;
}

const OPENINGS: readonly OpeningData[] = [
  // Open games: 1.e4 e5.
  { id: 'italian', eco: 'C50', name: 'Italian Game', san: 'e4 e5 Nf3 Nc6 Bc4', side: 'w', group: 'open', idea: 'The bishop aims at f7, the square only Black’s king guards, while the knight presses on e5.' },
  { id: 'ruy-lopez', eco: 'C60', name: 'Ruy Lopez', san: 'e4 e5 Nf3 Nc6 Bb5', side: 'w', group: 'open', idea: 'The bishop leans on the knight that defends e5, a quiet strain on Black’s centre that lasts all game.' },
  { id: 'scotch', eco: 'C45', name: 'Scotch Game', san: 'e4 e5 Nf3 Nc6 d4 exd4 Nxd4', side: 'w', group: 'open', idea: 'White opens the centre at once and takes back with the knight, so Black’s pawn on e5 is gone.' },
  { id: 'kings-gambit', eco: 'C30', name: 'King’s Gambit', san: 'e4 e5 f4', side: 'w', group: 'open', idea: 'White offers a pawn to pull Black’s e-pawn from the centre and open the f-file for an attack.' },
  { id: 'evans-gambit', eco: 'C51', name: 'Italian Game: Evans Gambit', san: 'e4 e5 Nf3 Nc6 Bc4 Bc5 b4', side: 'w', group: 'open', idea: 'White gives the b-pawn to gain time: the bishop must move, and c3 and d4 follow with a big centre.' },
  { id: 'two-knights', eco: 'C55', name: 'Italian Game: Two Knights Defense', san: 'e4 e5 Nf3 Nc6 Bc4 Nf6', side: 'b', group: 'open', idea: 'Black answers the Italian by hitting e4 at once, choosing a sharp fight over quiet defence.' },
  { id: 'berlin', eco: 'C65', name: 'Ruy Lopez: Berlin Defense', san: 'e4 e5 Nf3 Nc6 Bb5 Nf6', side: 'b', group: 'open', idea: 'Black counterattacks e4 and heads for a solid position that is very hard to break.' },
  { id: 'petrov', eco: 'C42', name: 'Petrov’s Defense', san: 'e4 e5 Nf3 Nf6 Nxe5 d6 Nf3 Nxe4', side: 'b', group: 'open', idea: 'Black copies White’s attack on the e-pawn; d6 drives the knight back first, then Black takes on e4.' },
  { id: 'philidor', eco: 'C41', name: 'Philidor Defense', san: 'e4 e5 Nf3 d6', side: 'b', group: 'open', idea: 'Black guards e5 with a pawn instead of a knight: solid, a little cramped.' },
  // Semi-open games: 1.e4 and anything but e5.
  { id: 'sicilian', eco: 'B20', name: 'Sicilian Defense', san: 'e4 c5', side: 'b', group: 'semi-open', idea: 'Black fights for d4 from the side with a flank pawn, so the game is unbalanced from the first move.' },
  { id: 'najdorf', eco: 'B90', name: 'Sicilian Defense: Najdorf Variation', san: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6', side: 'b', group: 'semi-open', idea: 'The small move a6 keeps White off b5 and gets ready for b5 or e5 at the right moment.' },
  { id: 'dragon', eco: 'B70', name: 'Sicilian Defense: Dragon Variation', san: 'e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6', side: 'b', group: 'semi-open', idea: 'The bishop goes to g7, where it breathes fire down the long diagonal at White’s queenside.' },
  { id: 'french', eco: 'C00', name: 'French Defense', san: 'e4 e6 d4 d5', side: 'b', group: 'semi-open', idea: 'Black prepares d5 to challenge e4 with a pawn, at the cost of shutting in the light-squared bishop.' },
  { id: 'french-advance', eco: 'C02', name: 'French Defense: Advance Variation', san: 'e4 e6 d4 d5 e5 c5', side: 'b', group: 'semi-open', idea: 'When White pushes past with e5, Black strikes at the base of the pawn chain on d4 at once.' },
  { id: 'caro-kann', eco: 'B12', name: 'Caro-Kann Defense', san: 'e4 c6 d4 d5', side: 'b', group: 'semi-open', idea: 'Like the French, Black meets e4 with d5, but keeps the light-squared bishop free to come out.' },
  { id: 'scandinavian', eco: 'B01', name: 'Scandinavian Defense: Main Line', san: 'e4 d5 exd5 Qxd5 Nc3 Qa5', side: 'b', group: 'semi-open', idea: 'Black hits e4 at once, takes back with the queen and parks it on a5, out of reach.' },
  { id: 'pirc', eco: 'B07', name: 'Pirc Defense', san: 'e4 d6 d4 Nf6 Nc3 g6', side: 'b', group: 'semi-open', idea: 'Black lets White build a centre and plans to strike at it later, with the bishop on g7.' },
  { id: 'alekhine', eco: 'B03', name: 'Alekhine Defense', san: 'e4 Nf6 e5 Nd5 d4 d6', side: 'b', group: 'semi-open', idea: 'The knight tempts White’s pawns forward, then Black attacks the centre they leave behind.' },
  // Closed games: 1.d4.
  { id: 'queens-gambit', eco: 'D06', name: 'Queen’s Gambit', san: 'd4 d5 c4', side: 'w', group: 'closed', idea: 'White offers the c-pawn to pull Black’s d-pawn away from the centre.' },
  { id: 'qgd', eco: 'D30', name: 'Queen’s Gambit Declined', san: 'd4 d5 c4 e6', side: 'b', group: 'closed', idea: 'Black holds d5 with e6: solid and sound, though the light-squared bishop is hemmed in.' },
  { id: 'qga', eco: 'D20', name: 'Queen’s Gambit Accepted', san: 'd4 d5 c4 dxc4', side: 'b', group: 'closed', idea: 'Black takes the pawn, not to keep it, but to free the game while White spends time winning it back.' },
  { id: 'slav', eco: 'D10', name: 'Slav Defense', san: 'd4 d5 c4 c6', side: 'b', group: 'closed', idea: 'Black backs up d5 with the c-pawn and keeps the light-squared bishop free.' },
  { id: 'london', eco: 'D02', name: 'Queen’s Pawn Game: London System', san: 'd4 d5 Nf3 Nf6 Bf4', side: 'w', group: 'closed', idea: 'White brings the dark-squared bishop out to f4 before playing e3: one simple set-up against almost anything.' },
  { id: 'kings-indian', eco: 'E70', name: 'King’s Indian Defense: Normal Variation', san: 'd4 Nf6 c4 g6 Nc3 Bg7 e4 d6', side: 'b', group: 'closed', idea: 'Black lets White take the centre, castles behind the g7 bishop, and breaks with e5 or c5 later.' },
  { id: 'nimzo-indian', eco: 'E20', name: 'Nimzo-Indian Defense', san: 'd4 Nf6 c4 e6 Nc3 Bb4', side: 'b', group: 'closed', idea: 'The bishop pins the knight on c3, so White cannot easily play e4.' },
  { id: 'queens-indian', eco: 'E12', name: 'Queen’s Indian Defense', san: 'd4 Nf6 c4 e6 Nf3 b6', side: 'b', group: 'closed', idea: 'The queen’s bishop goes to b7 to control e4 from a distance.' },
  { id: 'grunfeld', eco: 'D80', name: 'Grünfeld Defense', san: 'd4 Nf6 c4 g6 Nc3 d5', side: 'b', group: 'closed', idea: 'Black invites White to build a big pawn centre, then attacks it with pieces and the c-pawn.' },
  { id: 'dutch', eco: 'A80', name: 'Dutch Defense', san: 'd4 f5', side: 'b', group: 'closed', idea: 'Black takes hold of e4 with the f-pawn and looks towards a kingside attack.' },
  // Flank openings.
  { id: 'english', eco: 'A21', name: 'English Opening: King’s English Variation', san: 'c4 e5 Nc3 d6 Nf3', side: 'w', group: 'flank', idea: 'White controls d5 from the side; against e5 it is a Sicilian with an extra move.' },
  { id: 'reti', eco: 'A09', name: 'Réti Opening', san: 'Nf3 d5 c4', side: 'w', group: 'flank', idea: 'White attacks Black’s centre pawn from the side instead of filling the centre with pawns.' },
  { id: 'catalan', eco: 'E00', name: 'Catalan Opening', san: 'd4 Nf6 c4 e6 g3', side: 'w', group: 'flank', idea: 'A Queen’s Gambit with the bishop on g2, aiming down the long diagonal at Black’s queenside.' },
];

export type OpeningGroup = OpeningData['group'];

export interface Opening extends StudyLine {
  readonly eco: string;
  /** The moves in standard notation, as written in the list. */
  readonly san: readonly string[];
}

let built: readonly Opening[] | null = null;

/** The openings as study lines, moves in from-to form, each one played through the rules. */
export function chessOpenings(): readonly Opening[] {
  if (built) return built;
  built = OPENINGS.map((o) => {
    const board = chessAt(START_FEN);
    const san = o.san.split(' ');
    // chess.js gives the positions on the way, the same FEN the rules module keeps.
    const positions = [board.fen()];
    const movers: number[] = [];
    const moves = san.map((m, i) => {
      try {
        movers.push(board.turn() === 'w' ? 0 : 1);
        const move = board.move(m);
        positions.push(board.fen());
        return `${move.from}${move.to}${move.promotion ?? ''}`;
      } catch {
        throw new Error(`Opening ${o.id}: move ${i + 1} (${m}) is not legal`);
      }
    });
    return { id: o.id, eco: o.eco, name: o.name, idea: o.idea, start: START_FEN, moves, san, side: o.side === 'w' ? 0 : 1, group: o.group, replayed: { positions, movers } };
  });
  return built;
}

export const OPENING_GROUPS: readonly OpeningGroup[] = ['open', 'semi-open', 'closed', 'flank'];
