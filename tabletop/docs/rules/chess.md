# Chess

Rules as implemented in `src/games/chess/rules.ts`, which puts chess.js (BSD-2) behind the game
contract. They follow the FIDE Laws of Chess for over-the-board play, with the draws that a
player would normally claim applied automatically, as on every online site.

## Rules as implemented

1. **Board and set-up.** An 8×8 board with a light square at each player's right. White's pieces
   start on ranks 1 and 2, Black's on 7 and 8; queens on their own colour. Seat 0 plays White
   and moves first; seat 1 plays Black.
2. **Moves.** King one square any way; queen any distance along ranks, files and diagonals; rook
   along ranks and files; bishop along diagonals; knight in an L (two then one) and may jump;
   pawn one square forward, two from its starting square, and captures one square diagonally
   forward. No piece but the knight passes over another.
3. **Castling.** King and rook that have not moved, nothing between them, the king not in check,
   and the king does not pass through or land on an attacked square. King moves two squares
   towards the rook; the rook goes to the square the king crossed.
4. **En passant.** A pawn that has just moved two squares can be taken by an enemy pawn that could
   have taken it had it moved one, on the very next move only.
5. **Promotion.** A pawn reaching the last rank becomes a queen, rook, bishop or knight of the
   same colour, the player's choice, as part of the same move.
6. **Check.** No move may leave one's own king attacked.
7. **End of the game.**
   - *Checkmate:* the side to move is in check and has no legal move. It loses.
   - *Stalemate:* the side to move is not in check and has no legal move. Draw.
   - *Threefold repetition:* the same position (same pieces, side to move, castling rights and en
     passant possibilities) arises a third time. Draw, applied automatically.
   - *Fifty-move rule:* fifty moves by each side with no capture and no pawn move. Draw, applied
     automatically.
   - *Insufficient material:* neither side can possibly mate (king against king, king and one
     minor piece against king, or bishops all on squares of one colour). Draw.
   - *Resignation* and, when the clock is on, *loss on time* are handled by the table, not the
     rules module. A player whose flag falls loses, unless the opponent has only a king, in
     which case it is a draw.

Rules version: 1.

## Options and presets

Chess has no disputed house rules that the app needs to cover. The table offers an optional
clock: none, 5 minutes, 10 minutes, or 15 minutes plus 10 seconds a move. The starting position
can be any legal position (`config.fen`), which lessons, problems and set-ups use.

At a real club, threefold repetition and the fifty-move rule are claimed by a player, not applied
by an arbiter; the Table-ready track (milestone 2) teaches how to claim them.

## Notation

- Moves are stored in from-to form (`e2e4`, `e7e8q`) and shown in standard algebraic notation
  (`e4`, `Nf3`, `exd5`, `O-O`, `e8=Q+`).
- Positions are written in Forsyth-Edwards Notation (FEN).
- Games export and import as PGN.

## Golden cases (`tests/unit/chess-rules.test.ts`)

| Case | Expected |
| --- | --- |
| Perft from the start and five standard test positions | Counts match the published values |
| Castling through an attacked square, or out of check | Refused |
| Castling with the king and rook unmoved and the path clear | King and rook both move; the event names the rook's move |
| En passant right after the double step | Allowed, and the taken pawn's square is reported |
| En passant one move later | Refused |
| Promotion | All four pieces offered; the move shows as `e8=Q` and so on |
| Fool's mate | Checkmate, Black wins |
| Stalemate position | Draw by stalemate |
| Knights shuffling back and forth | Draw by threefold repetition on the third occurrence |
| A quiet move with the halfmove clock at 99 | Draw by the fifty-move rule |
| Last pawn taken leaving king and bishop against king | Draw by insufficient material |
| Moves out of turn, after the end, or illegal | Refused |

## Sources

- FIDE Laws of Chess, Articles 1 to 9 and 11 (handbook.fide.com).
- Perft values from the Chess Programming Wiki's "Perft Results" page.
