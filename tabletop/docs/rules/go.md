# Go

Rules as implemented in `src/games/go/rules.ts` (with `board.ts` for the stones, `score.ts` for
counting and `sgf.ts` for game files). Go has several official rule sets that differ in small
ways; each difference is an option, and the common rule sets are named presets. The default
is **Chinese (area)** on a 9×9 board.

Rules version: 1.

## Rules as implemented

1. **Board and players.** A square grid of lines: 9×9, 13×13 or 19×19 at the table (lessons and
   problems also use 5×5 and 7×7). Stones go on the intersections ("points"), not in the squares.
   Seat 0 plays Black and moves first; seat 1 plays White. The marked points are star points
   (hoshi): the 3-3 points and the centre on 9×9, the 4-4 points and the centre on 13×13, and
   nine 4-4, 4-10 and 10-10 points on 19×19.
2. **A move** is placing one stone of your colour on an empty point, or passing. Stones never
   move once placed.
3. **Liberties and capture.** Stones of one colour joined along the lines (not diagonally) form a
   chain. A chain's liberties are the empty points next to it along the lines. After a stone is
   placed, every opposing chain left with no liberty is captured: its stones come off the board
   and become the mover's prisoners. A chain with one liberty left is *in atari*.
4. **Suicide.** A move that leaves its own chain without a liberty, and captures nothing, is
   illegal. *Option:* allowed for two or more stones (New Zealand and Tromp-Taylor rules); the
   chain is then captured at once and the opponent keeps the stones as prisoners. A single stone
   taking its own last liberty is never allowed, because it changes nothing on the board.
5. **Ko.** A move may not bring back an earlier whole-board position. Three versions:
   - *Positional superko* (default; Chinese and Tromp-Taylor): no repeat of any earlier board.
   - *Situational superko* (AGA, New Zealand): no repeat of an earlier board with the same
     player to move.
   - *Simple ko* (Japanese and Korean): only the immediate retake of a single-stone ko is
     forbidden. A long cycle (triple ko and the like) cannot be stopped by that rule, so when the
     same position with the same player to move comes round the third time, the game ends with
     *no result*, as the Japanese rules provide.
   Passing is never forbidden by a ko rule. Positions are compared by a 64-bit hash of the board.
6. **The end of play.** Two passes in a row end play. *Option (AGA):* White must make the last
   pass, so if Black passes second, White has to pass once more; and each pass hands the
   opponent one stone as a prisoner ("pass stones"). Under area counting these two AGA rules
   never change the result; they make territory counting give the same result as area counting.
7. **Dead stones.** After play ends the players mark the stones that would be captured anyway
   (dead stones). The seat to act (the player after the last passer) taps chains to mark or unmark
   them, then says it is done; the other player either agrees to that marking, changes it and says
   done in turn, or asks to play on. When one player agrees to a marking the other has said done
   to, the game is counted. The coach can suggest the marking: it plays the position out many times
   and marks the stones that are nearly always captured. A dispute is settled by playing on, as the
   Chinese, AGA and New Zealand rules do: play resumes with the player after the last passer, and
   two more passes end it again. (The Japanese rules settle disputes by hypothetical play off the
   record; the app plays on instead.) *Option:* no marking (Tromp-Taylor): every stone still on
   the board counts as alive, so dead stones have to be captured before passing.
8. **Counting.**
   - *Area* (Chinese, AGA, New Zealand, Tromp-Taylor): your live stones on the board plus the empty
     points surrounded only by your stones.
   - *Territory* (Japanese, Korean): the empty points surrounded only by your live stones, plus
     your prisoners (stones captured during play, dead stones taken off at the end, and any pass
     stones).
   An empty region touching both colours, or neither, is neutral (dame) and counts for nobody.
   Points where dead stones stood count as territory for the side that surrounds them.
9. **Seki.** Two groups can live together without either having two eyes, because neither side
   can fill a shared liberty without being captured. The app finds seki points this way: an empty
   point next to live stones of both colours where neither side can play without leaving its own
   chain with one liberty or fewer. The stones next to such a point are in seki. Shared liberties
   are always neutral. *Option:* under the Japanese rules the empty points surrounded by stones in
   seki are not territory either (default for the Japanese preset); under the other rule sets they
   count.
10. **Komi.** White adds komi to its score for moving second: 7.5 (Chinese, AGA, Tromp-Taylor), 6.5
    (Japanese, Korean), 7 (New Zealand, so a tie is possible). In handicap games komi is 0.5, so
    White wins a tie. Komi can be changed at the table (0, 0.5, 5.5, 6, 6.5, 7, 7.5).
11. **Handicap.** The weaker player takes Black and puts 2 to 9 stones down before White's first
    move; White then moves first. *Option:* fixed placement on the star points (Japanese, AGA),
    or free placement anywhere, one stone at a time (Chinese, New Zealand). The fixed order, seen
    from Black's side: upper right and lower left; then lower right; then upper left; the centre
    for 5 and 7; the left and right sides for 6 and 7; all four sides for 8 and 9.

    | Stones | 9×9 | 13×13 | 19×19 |
    | --- | --- | --- | --- |
    | 2 | G7 C3 | K10 D4 | Q16 D4 |
    | 3 | + G3 | + K4 | + Q4 |
    | 4 | + C7 | + D10 | + D16 |
    | 5 | + E5 | + G7 | + K10 |
    | 6 | 4 corners, C5 G5 | 4 corners, D7 K7 | 4 corners, D10 Q10 |
    | 7 | 6 + E5 | 6 + G7 | 6 + K10 |
    | 8 | 6 + E7 E3 | 6 + G10 G4 | 6 + K16 K4 |
    | 9 | 8 + E5 | 8 + G7 | 8 + K10 |

    Under area counting each handicap stone is also a point of area, so some rules give White
    compensation: *n* points for *n* stones (Chinese), *n* − 1 (AGA), none (Japanese, New Zealand).
    The compensation is an option.
12. **Capture-Go** (also called Atari-Go or the capture game), for beginners: ordinary moves, but
    the first player to capture a stone wins. *Option:* the first to capture 3 or 5 stones wins.
    No komi. If both players pass before anyone gets there, the one with more prisoners wins, and
    equal prisoners is a draw.
13. **Resigning** and, with a clock, **loss on time** are handled by the table. Go clocks offered:
    none, 10 minutes plus 5 seconds a move, 20 minutes plus 10 seconds a move. Japanese byo-yomi
    and Canadian overtime are taught in the Table-ready lessons but not run by the app's clock.

## Options

| Option | Values | Default (Chinese) |
| --- | --- | --- |
| Board size | 9, 13, 19 (lessons: any from 2 to 25) | 9 |
| Counting | area, territory | area |
| Komi | any whole or half number | 7.5 (0.5 with handicap) |
| Ko | positional superko, situational superko, simple ko with "no result" on a cycle | positional |
| Suicide of two or more stones | allowed, forbidden | forbidden |
| Handicap | none, 2 to 9 stones | none |
| Handicap placement | fixed star points, free | free |
| Handicap compensation | none, *n*, *n* − 1 | *n* |
| Eyes in seki | count, neutral | count |
| Dead-stone marking | on, off (every stone counts as alive) | on |
| Pass stones | on, off | off |
| White passes last | on, off | off |
| Capture target (Capture-Go) | 0 (ordinary Go), 1, 3, 5 | 0 |

## Presets

| Preset | Counting | Komi | Ko | Suicide | Handicap | Compensation | Seki eyes | Marking | Other |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Chinese (area) | area | 7.5 | positional | no | free | *n* | count | yes | |
| Japanese (territory) | territory | 6.5 | simple, "no result" on a cycle | no | fixed | none | neutral | yes | also the Korean rules |
| AGA | area | 7.5 | situational | no | fixed | *n* − 1 | count | yes | pass stones, White passes last |
| New Zealand | area | 7 | situational | yes (two or more stones) | free | none | count | yes | |
| Tromp-Taylor (computer) | area | 7.5 | positional | yes (two or more stones) | free | none | count | no | |
| Capture-Go | first capture | 0 | positional | no | fixed | none | — | no | target 1, 3 or 5 stones |

Not offered: the Ing rules (their special ko rule and fill-in counting with 180 stones each)
and the World Mind Sports Games rules. The Ing komi of 8 with Black winning ties plays like 7.5.

## Notation

- **Points** are named by a column letter from A, skipping I, and a row number from 1 at the
  bottom: `D4`, `Q16`. Moves are stored in SGF form (two letters from the top-left, `dd`), which
  does not depend on the board size. `pass` is a pass; `dead dd` marks a chain, `done` agrees to the
  marking and `resume` plays on.
- **Positions** are written as the rows from the top separated by `/` (`.` empty, `X` Black, `O`
  White), the side to move (`b` or `w`), then only the fields that differ from a fresh game:
  `rules=<preset>[,<option>:<value>…]` (Chinese when absent), `hc=` handicap stones, `place=` free
  handicap stones still to place, `ko=` the point that may not be retaken, `cap=<black>,<white>`
  prisoners, `pass=<count>,<b|w>` passes in a row and who made the last, `phase=scoring,<scorer>[,<agreed>]`,
  `dead=` points marked dead, and `end=` for a finished game. For example
  `.X./XOX/.X. w cap=1,0` is a 3×3 board, White to move, Black holding one prisoner. A position
  read back writes the same text. The repetition history is kept in the saved game, not in the
  position text.
- **Game files** are SGF (FF[4]): `SZ`, `KM`, `HA`, `RU`, `AB`/`AW` set-up stones in the first
  node, `B`/`W` moves (`B[]` passes; `tt` is read as a pass on boards up to 19×19), `PB`/`PW`,
  `DT`, `RE` (`B+3.5`, `W+R`, `0` for a tie, `Void` for no result), and `TB`/`TW` territory at the
  end. Free handicap stones are written as `AB` with `HA`. Only the main line of a file is read;
  set-up stones later in a game are refused. Where a file has one colour moving twice, the other
  colour is taken to have passed.

## Golden cases (`tests/unit/go-rules.test.ts`)

| Case | Expected |
| --- | --- |
| Liberties of a stone in the centre, on the edge, in the corner | 4, 3, 2 |
| A stone or chain with its last liberty taken | Comes off; prisoners go up by its size |
| Capturing several chains with one stone | All come off |
| Suicide of one stone | Refused under every preset |
| Suicide of two stones | Refused (Chinese); allowed under New Zealand, the stones go to the opponent |
| A move that looks like suicide but captures | Allowed |
| Ko: retaking at once | Refused under every ko rule |
| Ko: retaking after a threat elsewhere | Allowed |
| Positional superko, a repeat with the other side to move | Refused under positional, allowed under situational |
| Triple ko under the Japanese preset | No result on the third repetition |
| Two passes | Play ends; marking starts with the player after the last passer |
| AGA: White passes, then Black passes | Play goes on until White passes; each pass gives the opponent a prisoner |
| Marking: done, then agreed | Game counted; done then a change voids the earlier "done" |
| Playing on from the marking | Play resumes with the player after the last passer; dead marks cleared |
| Area count of a finished 9×9 game | Stones plus territory, komi to White |
| Territory count of the same game | Territory plus prisoners and dead stones; the margin differs from area by at most the move parity |
| Seki with one eye each | Shared liberty neutral in both methods; the eyes count under area, not under Japanese territory |
| Unfilled dame between two settled groups | Neutral, and not mistaken for seki |
| Handicap 2 to 9, fixed | Stones on the points in the table; White moves first; komi 0.5 |
| Free handicap | Black places the stones one at a time, then White moves; compensation added to White |
| Capture-Go | The first capture wins; with target 3, play goes on until three stones are taken |
| Position text and JSON | Read back to the same text; JSON keeps the repetition history |
| SGF out and in | The same moves, handicap and komi; `@sabaki/sgf` reads our files the same way |
| Cross-check | On random games, captures and legality (suicide, simple ko) match `@sabaki/go-board` |

## Sources

- Wikipedia, "Rules of Go": the comparison table of the Japanese/Korean, AGA, Chinese, Ing and
  New Zealand rules (counting, komi, superko, seki, suicide, ending, disputes, handicap placement
  and compensation), positional and situational superko, and the counting phase. Read on
  2026-11-27.
- Wikipedia, "Komi (Go)": 6.5 (Japanese, Korean), 7.5 (Chinese, Ing, AGA), 7 (New Zealand), 0.5
  in handicap games. Wikipedia, "Handicapping in Go": the fixed placement order and the 9×9
  placement. Wikipedia, "Capture go": the first-capture rule and playing to more than one stone.
  Wikipedia, "Time control": byo-yomi and Canadian overtime. All read on 2026-11-27.
- The Japanese Rules of Go (Nihon Ki-in, 1989), the Chinese Weiqi Rules, the AGA Concise Rules of
  Go, the New Zealand Rules of Go, and John Tromp's and Bill Taylor's rules, as summarised in the
  articles above. Sensei's Library and the British Go Association pages were not reachable from
  the build environment.
- Fixed handicap points agree with `@sabaki/go-board`'s `getHandicapPlacement` for 2 to 9 stones on
  9×9, 13×13 and 19×19 (checked in the tests).
- SGF FF[4] (the format described at red-bean.com/sgf, as implemented by `@sabaki/sgf`).
