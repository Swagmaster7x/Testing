# Noughts and crosses (fixture game)

This game exists to prove the foundation in milestone 0: the game contract, play against a bot in a
worker, save and resume, replay and the animation queue. It is not on the Games shelf. It is
reached from Settings → Foundation check, or at `#/games/noughts`.

## Rules as implemented

1. The board has nine squares in three rows. Squares are named like a chessboard: files a to c
   from the left, ranks 1 to 3 from the bottom, so a3 is the top-left square and c1 the
   bottom-right.
2. Seat 0 plays X and moves first. Seat 1 plays O. The players take turns.
3. A move marks one empty square. A marked square never changes.
4. A player who completes a row, a column or a diagonal of their own marks wins, and the game
   ends at once.
5. If all nine squares are marked and nobody has a line, the game is drawn.

Rules version: 1.

## Options and presets

None. The config is an empty object. The table has no house rules for this game.

## Notation

- A move is written as its square, for example `b2`. In records it is stored as the square's
  index, 0 to 8, row by row from the top-left.
- A position is written as the three rows from the top joined by `/`, using `x`, `o` and `.`,
  then a space and the side to move: `x.o/.x./... o`.

## Golden cases (tests/unit/noughts-rules.test.ts)

| Case | Position or moves | Expected |
| --- | --- | --- |
| Empty board | start | X to move, nine legal moves |
| Row win | X a3, O a2, X b3, O b2, X c3 | X wins with a3 b3 c3, game over |
| Column win | X a3, O b3, X a2, O b2, X c1, O b1 | O wins with b3 b2 b1 |
| Diagonal win | X a3, O b3, X b2, O c3, X c1 | X wins with a3 b2 c1 |
| Draw | X b2, O a3, X c3, O a1, X a2, O c2, X b1, O b3, X c1 | board full, no line, draw |
| Taken square | X b2, then O b2 | refused: b2 is taken |
| Out of turn | O asks for its legal moves at the start | none |
| After the end | any move after a win | refused: the game is over |
| Bad positions | O moves first, two lines, play after a line | refused when read |

## CPU levels

| Level | Looks ahead | Behaviour |
| --- | --- | --- |
| 1 | one move | Takes a win when it has one, likes the centre and corners, misses your threats |
| 2 | two moves | Also blocks a line you are about to finish; falls for forks |
| 3 | to the end | Never loses; among equal moves it sets fork traps |

The ladder (`npm run ladder`) checks over fixed seeds that level 1 beats random play and each
level beats the one below it with at least a 0.6 share (a draw counts half).

## Sources

The rules are the common ones and need no source. Square names follow chess convention so the
same habit carries over to Chess in milestone 1.
