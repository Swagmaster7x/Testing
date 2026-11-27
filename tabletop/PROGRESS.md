# Kibitz progress

Last updated 2026-11-27, at the end of milestone 4. The plan is `PLAN.md`; this file says what
has been built, what was decided along the way, and what is still open.

**Swag's instruction after M0 (2026-11-27): "I trust you, build it all."** So the build carries
on milestone after milestone without stopping, including past the feedback stop the plan puts
after M2. Feedback is still welcome at any point and will be applied to the template.

## Milestones

- [x] **M0. Foundation** (2026-11-27)
- [x] **M1. Chess: play** (2026-11-27)
- [x] **M2. The learning loop, on Chess** (2026-11-27). The feedback stop is skipped, as Swag asked; feedback is still welcome.
- [x] **M3. Cards and Brisca (2 players)** (2026-11-27)
- [x] **M4. Dominoes** (2026-11-27)
- [ ] M5. Texas Hold'em
- [ ] M6. Go
- [ ] M7. Chinese Checkers
- [ ] M8. Shogi
- [ ] M9. Mahjong I: the shared engine, and Hong Kong style to play
- [ ] M10. Mahjong II: teach it (all eight launch games complete here)
- [ ] M11. Mahjong III: Riichi
- [ ] M12. Card variants A
- [ ] M13. Classic card pack
- [ ] M14. More tile styles (one style per sitting)
- [ ] M15. Stronger engines
- [ ] M16. Table tools, polish, release

Next up: **M5, Texas Hold'em.** Go (M6) and Shogi (M8) are being built at the same time in separate checkouts, to be merged when they pass their gates.

## M4. Dominoes

- [x] **Rules first**: `docs/rules/dominoes.md`, from pagat.com (partnership, Draw and Block, with
      the dominaxo.com table of national differences, *Doscientos* and *Quinientos*) and the Puerto
      Rico rules page of Caribbean Trading. Three games: **partnership** for four (fixed partners,
      seven tiles each, no boneyard), **Draw** and **Block** for two. Fifteen options: the target
      (one hand, 100, 150, 200, 500), what the winners score (every tile left, or the losers'
      only), how a blocked hand scores (pips, or the difference), who wins it (the side with fewer
      pips, or the fewer of the blocker and the next player), five rules for a tie, the first and
      later leads, the early-hand bonuses (100, 75, 50, 25), capicú and chuchazo (0, 50, 100) and
      when a chuchazo counts, the pass bonus (20, then 10), redealing five doubles, and how far
      the boneyard is drawn. Eight presets: **Puerto Rico 500** (the default), **Puerto Rico 200**,
      International, Mexico, Colombia, Venezuela, Draw and Block; the "ask before you sit" card is
      on the reference page.
- [x] **Rules engine** (`src/games/dominoes/rules.ts`): hidden information (a view holds your
      tiles, the line, every play and pass and the counts; never another hand, the boneyard, a
      tile someone else drew, or the seed), `sample()` that keeps every pass and draw true (in the
      Draw game it traces which tiles were drawn after which pass), matches over many hands, a
      blocked hand detected the moment nobody can play, "play on from here".
- [x] **The core learned about sides**: an outcome can name its teams, so a partnership win is a
      whole win for both partners in ratings, results and ladders, and resigning loses for your
      side. Ladders seat the two levels as partners at a table of four.
- [x] **TileKit** (`src/kits/tiles/`): original domino art (pips coloured by number, as on many
      sets, always readable without the colour), a tile layer where every tile keeps its identity
      and slides and turns between hand and line, and a line layout that **bends to fit the
      table**: the right arm turns down at the edge and runs back, the left arm turns up, doubles
      lie across, and at every corner the matching halves touch. The open ends are marked with
      their number; a tile that fits both ends waits for you to tap the end.
- [x] **Table**: you at the bottom, your partner facing you, the player after you on your right
      (play is counter-clockwise), the boneyard on the left in the Draw game; a Pass (knock) or
      Draw button when that is all you can do; "Paso" bubbles; every hand shown at the end with its
      pips and the result. On a phone held sideways, card and tile tables now take the whole width
      beside one column (players above the coach).
- [x] **CPU, six levels**: lays its heaviest tile (1), keeps its options and gets doubles out (2),
      reads the passes and plays the partner conventions (3), then determinized Monte Carlo over
      deals that agree with every pass (16, 120 and 400 deals) with exact search for the last 6, 9
      or 12 tiles (4 to 6). A fast bitmask model of a hand drives the search; a test plays more
      than a hundred hands both ways and the two always score the same.
- [x] **Partner conventions** (taught, and followed by the CPU partner at level 3 and up): lead
      your strongest number with its double; your partner's lead is their number, so play to it
      and do not cover it; leave ends the next player has passed on; block only when your side
      surely holds fewer pips. Levels 4 to 6 keep the conventional play whenever their search
      rates it within a point of the best, so a CPU partner stays readable. Tests check each one.
- [x] **Coach**, each a switch that marks the game as training: the **tiles-out triangle** (all
      28, played ones dimmed, yours ringed) with how many of each number are still unseen; **what
      each player cannot have**, from their passes, also marked by their seat; **pip totals**
      (yours, the line's, the ones you cannot see); tiles up (open-hand rounds); a three-step hint.
- [x] **Learn**: 21 lessons, every one linted: stage 0 (2), the rules (8: tiles, suits and pips;
      play or pass; a tile that fits both ends; who leads; going out and the blocked hand; scoring;
      the Quinientos bonuses; a free-play finish), partner play and counting (7: lead your
      strength, count a suit, what a pass tells you, play to your partner, doubles get hanged,
      when to block, and a solver-proved endgame), Table-ready (4: the shuffle and the draw,
      passing and table talk, asking before you sit, keeping score). Lesson positions are built by
      playing scripted moves through the rules from fixed deals.
- [x] **Practice**: 150 endgames proved by exact search with every hand face up
      (`npm run generate:dominoes`), and three generated drills: what a pass tells you, the pips
      you cannot see, and how many of a number are still out.
- [x] **Review**: every decision you made, rated "with what you knew" by the points it cost your
      side in that hand, key moments with reasons (covered your partner's number, missed a pass,
      a bad block or a missed one, led away from your strength, a double left to hang), "play on
      from here", "add to my practice".

### Gate: the definition of done for Dominoes (PLAN.md 2.10)

| Item | Result |
| --- | --- |
| 1. `docs/rules/dominoes.md` | Rules, fifteen options, eight presets, golden cases, sources |
| 2. Golden, property and replay tests under every preset | 32 golden cases (blocked hands and every tie rule among them); random games under all eight presets and five odd mixes keep the contract, conserve 28 tiles and 168 pips, add the scores up, never leak a hidden tile, the boneyard or the seed, keep every "cannot have" true, sample consistent states, and replay |
| 3. At least four CPU levels pass the ladder | Yes: see below |
| 4. Learn stages 0 to 2 and Table-ready | 2 + 8 + 7 + 4 lessons, all passing the linter |
| 5. Three kinds of practice | Endgames (150, proved) and three generated drills |
| 6. Coach helps and a counter a player keeps in their head | The tiles-out triangle and numbers left, what each player cannot have, pip totals |
| 7. Review with key moments, reasons, play on | Yes |
| 8. Save, resume, replay, reference card | Yes (the shared table) |
| 9. End to end at phone landscape, screenshots looked at | `tests/e2e/dominoes.spec.ts` at all three sizes: a whole hand to the end and its review, a rules lesson, a proved endgame, a drill; fourteen M4 screenshots looked at |
| Pips always sum to 168 | Checked at every step of every random game |
| Partner follows the taught conventions | Unit tests: the conventional lead, not covering the partner's number, leaving ends a player passed on |

**Ladder** (`npm run ladder -- dominoes 200`: partnership matches to 200, Puerto Rico rules, the
two levels sitting as partners, every deal played twice with the sides swapped). First run: L1
beats random 0.700, L2 beats L1 0.785, L3 beats L2 0.715, L4 beats L3 0.685; L5 (80 deals) and L6
(200 deals) fell just short, 0.570 and 0.585. Tuned (fewer deals at L4, more and deeper exact play
at L5 and L6) and run again for the top rungs: L4 beats L3 0.605, **L5 beats L4 0.680**; L6
against L5 was still running at the time of writing and its result follows in the next update.
Tuning on the way: level 3's partner weights were chosen over thousands of paired matches (the
opponents'-number weights hurt and are off; "control", ends in numbers you hold, helped most:
0.580 to 0.697 against level 2), and a control term in the search's playouts lifted level 4 over
level 3 from 0.625 to 0.675 at the same deal count. Decision times stay small: at level 6 the
median is under 10 ms and the slowest seen 1.4 s (a two-player Block hand, on a machine running
four other jobs).

Fixed after looking at the screenshots and play-throughs: the table was squeezed between two side
columns on a phone (now one column); your own tiles were too small; the Pass button sat on the
line; seat labels overlapped the end of the line; at the end of a hand your old tiles looked
playable against the next hand's moves; the move list paired moves in twos, which breaks with four
players (now one move a line, with arrows for the end played: "← 3-5", "5-6 →"); the log printed
raw reason codes. Two older bugs surfaced too: free-play lessons waited for a chess-style answer
from the CPU, so a Brisca free-play opponent never moved (fixed for every game), and the lesson
runner assumed one reply per move (now any number of players answer in turn).

### Decisions in M4

1. **Partnership is the default game**, to 500 with every Puerto Rican bonus, as the plan says;
   a single hand is a target option ("One hand") for quick games, lessons and tests.
2. **A blocked hand ends the moment nobody can play**, rather than after everyone knocks in turn;
   the result is the same and play is quicker. The blocker is the player of the last tile.
3. **Capicú** counts whenever the winning tile, not a double, could go on either end (so also on
   two equal ends), as the sources word it; a double never makes capicú.
4. **Five doubles are always dealt again** with that option on (the rule says a player *may*
   ask; nobody wants to keep them).
5. **The CPU partner plays by the conventions the lessons teach**; the search levels may leave them
   only for a clearly better play (more than a point on average).
6. **Endgame problems show every hand**, as printed domino problems do, so the answer can be
   proved; the "cannot have" skill has its own drill with the hands hidden.
7. **Tile names are allowed in lesson text** ("the 3-5"), like chess squares; counts and points
   are still always computed.

### Not done in M4, or open

- All Fives and Cuban double-nine are milestone 14; pass-and-play arrives with milestone 7.
- Scores divided by ten, each side scoring its own tiles in a blocked hand, passing the lead to a
  partner, *Chiva* and Milo are not options (see the rules document); each is small to add.
- Jose Carillo's Puerto Rico page (an archive copy pagat links to) was not read; the Puerto Rican
  rules follow pagat's summary of it and Caribbean Trading. Corrections from a real table are one
  option change each.


## M3. Cards and Brisca (2 players)

- [x] **Rules first**: `docs/rules/brisca.md`, written from Spanish and English Wikipedia and pagat.com
      (those hosts were allowed through the environment's approval card, as the plan says). Every
      disputed rule is an option: which swaps exist (the 7, the 2), when (any turn, or only after
      winning a trick), 60–60 (tie or most cards), a turned As or Tres (stays or goes back), wins
      over 100 counting double, hands to a game (1, 2, 3, 5, 7), rotating trumps, "arrastro", and
      the second brisca (Tres, or Siete as in Portuguese bisca). Presets: **Puerto Rico** (the
      default), **Spain**, **Italy (briscola)** and Puerto Rico to three hands; the "ask before you
      sit" card is on the reference page.
- [x] **Rules engine** (`src/games/brisca/rules.ts`): hidden information (a view holds your hand,
      the public history and counts; never the other hand, the stock order or the seed that deals
      later hands), `sample()` for search, matches of several hands with the deal alternating,
      "play on from here" from any position.
- [x] **CardKit** (`src/kits/cards/`): an original Spanish deck drawn as vectors (each suit its own
      shape and colour, the traditional broken frame, large corner indices, simple original
      figures), card backs, and a card layer where every card keeps its identity and slides
      between hand, trick, stock and piles. What is drawn lags the rules by the events still
      queued, so a trick stays on the table until its event plays.
- [x] **Table**: the CPU's hand, the stock with the turned trump card across its foot and a trumps
      badge, the trick, both piles, your hand (tap to lift, tap again to play), the swap button,
      "arrastro" when it is played, a hand-over card. The shell gained a wide layout for card and
      tile tables, perspective-aware log lines, card sounds, and **"Rules at this table"** in the
      New game dialog (presets, plus every option), remembered per game.
- [x] **CPU, six levels**: counting heuristics (1, 2), perfect last three tricks (3), and
      determinized search (4 to 6: deal the unseen cards at random 40, 80 or 160 times, play each
      card out, solve the end exactly in each deal). The exact endgame solver agrees with brute
      force on 200 random endgames and 20 real ones.
- [x] **Coach**, each a switch that marks the game as training: what beats this, points and trumps
      left (and the briscas not yet seen), the cards seen, cards up (open-hand rounds), and a
      three-step hint.
- [x] **Learn**: 20 lessons, every one linted: stage 0 (2), the rules (8: the pack, order and
      points, trumps, who wins a trick, no duty to follow, drawing, the swap, counting at the end),
      first strategy (6: take points cheaply, keep trumps for points, lead a blank, count the
      trumps, the last three tricks, and a free-play finish against the solver), Table-ready (4:
      dealing and the turned card, counting a pile by hand, asking before you sit, table manners).
      Strategy claims are made in endgames only, where the solver proves them; the linter rejected
      four first drafts whose alternatives scored the same.
- [x] **Practice**: 160 endgame problems proved by the solver (`npm run generate:brisca`), and four
      generated drills: win the trick, card values, count the pile, count the trumps.
- [x] **Review**: every decision you made, rated "with what you knew" by its loss in expected
      points (the coach samples the unseen cards from your view and plays the end exactly), key
      moments with reasons (gave away points, wasted a trump, missed the points on the table, led
      points into a trump, the swap was there), "play on from here", "add to my practice", and a
      **cards up** lens that turns every hand face up.

### Gate: the definition of done for Brisca (PLAN.md 2.10)

| Item | Result |
| --- | --- |
| 1. `docs/rules/brisca.md` | Rules, nine options, four presets, golden cases, sources |
| 2. Golden, property and replay tests under every preset | 15 golden cases; random games under all seven test configs keep the contract, conserve the 40 cards, total 120 points a hand, never leak the other hand, the stock or the seed, and replay |
| 3. At least four CPU levels pass the ladder | Yes, L1 to L4 (see below) |
| 4. Learn stages 0 to 2 and Table-ready | 2 + 8 + 6 + 4 lessons, all passing the linter |
| 5. Three kinds of practice | Endgames (160, solver-proved) and four generated drills |
| 6. Coach helps and a counter a player keeps in their head | Points so far, trumps and briscas not yet seen, cards seen |
| 7. Review with key moments, reasons, play on | Yes, with both lenses |
| 8. Save, resume, replay, reference card | Yes (the shared table) |
| 9. End to end at phone landscape, screenshots looked at | `tests/e2e/brisca.spec.ts` at all three sizes: a whole hand to the end and its review, the swap, a rules lesson, a solver problem, a drill; twelve M3 screenshots looked at |
| Point total always 120 | Checked after every hand of every random game |
| Endgame solver agrees with brute force | Yes, 220 positions |

**Ladder** (`npm run ladder -- brisca 60`: matches to three hands, each deal played twice with the
seats swapped): L1 beats random 0.900, L2 beats L1 0.817, L3 beats L2 0.617, **L4 beats L3 0.633**:
four levels pass, which is the gate. L5 against L4 scored 0.533 (short of 0.6), and the L6 rung
did not finish inside the two-hour limit on a machine shared with three other jobs. During tuning,
sampled search with 16 deals was no better than the level-3 heuristic (0.483) while 40 deals beat
it clearly (0.670), which set the sample counts. Separating levels 5 and 6 is open (milestone 15,
stronger engines, is the natural home).

Fixed after looking at the screenshots and play-throughs: in card endgames the other side can move
twice running (it wins a trick and leads the next), which the problem runner did not allow; a
free-play goal reached on the computer's reply was missed; lessons and problems fanned both piles
face up, which cluttered the table (now only the counting drills do); the stock looked heavy; the
move list said "The CPU" where "CPU" reads better.

### Decisions in M3

1. **A game is one hand by default**, as a quick sitting; "to three hands" is a preset and every
   length is an option. Ladders play matches to three hands, as tables usually do, with every
   deal played twice with the seats swapped so the luck of the deal cancels out.
2. **Card names stay Spanish** (As, Tres, Rey, Caballo, Sota; oros, copas, espadas, bastos) with an
   English gloss where they first appear, as players say them.
3. **Swaps are offered on your own turn only**; in a two-player game that is always before you play
   to the trick, so no swap a player could make is lost.
4. **Claiming the rest** (showing the top trumps to end the hand) is not implemented: the result
   is the same as playing the cards out, which the app does quickly.
5. **Counting is a help, not a default**: points, trumps left and cards seen are coach switches and
   mark the game as training, because keeping count is the skill a real table needs.
6. **Hidden-card review** judges each decision "with what you knew" (sampling the unseen cards from
   your view); "cards up" shows what was really there.

### Not done in M3, or open

- Four players in pairs with señas, and Tute, are milestone 12.
- Pass-and-play arrives with milestone 7 and is then switched on for Brisca.
- The Puerto Rican rules page pagat links to (on an archive site) and Fournier's page could not be
  reached; the Puerto Rico preset follows the plan's description. Corrections from a real
  Puerto Rican table are welcome and are one option change each.

## M2. The learning loop, on Chess

- [x] **Lesson runner** (`src/teach/runner.ts`): a pure state machine for every step kind, used by
      the lesson screen and by the linter's auto-player alike. Scripted replies wait for a pause;
      wrong answers get tailored feedback; "Show me" plays the answer and its reply.
- [x] **Lesson linter** (`scripts/lesson-lint.ts`, `src/teach/lint.ts`), the last step of
      `npm run check`: legal positions, legal answers, computed numbers only, "only" and "mate"
      claims by the rules, "best" claims by Stockfish (a 150-centipawn margin over every other
      move at 1,000,000 nodes), free-play goals reached against the engine's best defence, and an
      auto-player that finishes every lesson twice (right first time, and wrong then shown). The
      generated stage checks are linted too. How to write lessons: `docs/lessons.md`.
- [x] **Chess lessons, 37 in all** (`src/games/chess/learn/`), every word original:
      stage 0 (2), stage 1, the rules (12), stage 2, first strategy (11: piece values, hanging
      pieces, counting attackers and defenders, opening principles, king safety, checks-captures-
      threats, mate in one, trading when ahead, open files, passed pawns, the active king),
      stage 3 started (7: fork, pin, skewer, discovered attack, back rank, mate with king and queen,
      mate with king and rook against the engine), and the Table-ready track (5: setting up,
      touch-move, the clock, writing moves, offering and claiming draws and resigning).
- [x] **Learn door**: stages with a recommended path ("Continue: ..."), nothing locked, and
      "I already know this", a five-question check built from the stage's own lessons; passing
      it (one miss allowed) marks the stage done.
- [x] **Problems**: 5,820 puzzles from the Lichess puzzle database (CC0), imported with
      `npm run import:puzzles` across ratings 600 to 2200 and themes, every line replayed through
      the rules (`licenses/Lichess-puzzles-CC0.txt`). Sets: tactics (3,847, with theme chips),
      checkmates (1,955), endgames. The problem player animates the opponent's setup move, plays
      replies of multi-move lines, accepts any mate at the end of a mating line, has a three-step
      hint (the piece, the idea, the move), retry and "show the solution".
- [x] **Drills** (generated, on the lesson runner): basic mates with king and queen or rook
      against the engine from random positions, and "count the material" on positions from the
      puzzle set, checked against the rules module.
- [x] **Review queue** (FSRS through `ts-fsrs`): missed problems and moments from your own games
      become cards; right first time pushes a card out, a miss brings it back soon.
- [x] **Game review**: every position searched by Stockfish in the bot worker (50,000 nodes, two
      lines), each move rated by its loss in winning chances (best, good, inaccuracy at 5 points,
      mistake at 10, blunder at 15), accuracy per side, three to five key moments with a
      one-sentence reason (allowed mate, missed mate, left a piece to be taken, missed a win of
      material, or what was better), arrows for the move played and the better one, "play on from
      here" against the same level, and "add to my practice". Analyses are stored and backed up.
- [x] **Ratings**: Elo, recomputed from the history so it cannot drift. Play rating from games
      without helps against the CPU from the normal start; problem rating from first, unhinted
      tries. The New game dialog suggests the level that gives about a 55% chance.
- [x] **Today** builds a 10 to 20 minute session from the focus games: due reviews, one lesson
      (or one game at the suggested level once the lessons are done), and problems to fill the time.
- [x] **Progress**: per game, lesson stages, problem and play ratings (a question mark while
      provisional), the accuracy trend of analysed games, the review queue, and the table-ready
      checklist, ticked by doing (lessons, five right-first-time material counts, and a win
      against level 3 with every help off).
- [x] Storage schema version 2 adds the `analyses` table; backups include it (older backups still
      import).

### Gate: the definition of done for Chess (PLAN.md 2.10)

| Item | Result |
| --- | --- |
| 1. `docs/rules/chess.md` | Done in M1: every rule as implemented, the options, sources |
| 2. Golden, property and replay tests | Pass (`tests/unit/chess-rules.test.ts`, `tests/property/`) |
| 3. At least four CPU levels pass the ladder | All eight, 16 games a rung with seats alternating: L1 beats random 1.000, L2 beats L1 0.813, L3 beats L2 0.719, L4 beats L3 0.906, L5 beats L4 0.813, L6 beats L5 0.719, L7 beats L6 0.813, L8 beats L7 0.875 |
| 4. Learn stages 0 to 2 and Table-ready complete, passing lint | 2 + 12 + 11 lessons in stages 0 to 2 (the plan said about 25), 5 Table-ready, 7 in stage 3; `npm run lint:lessons` passes |
| 5. At least three kinds of practice, each generated or with 100+ items | Tactics 3,847, checkmates 1,955 and endgames (Lichess, CC0); basic mates and counting material (generated) |
| 6. Coach helps, including a counter a real player keeps in their head | Done in M1 (material count and the fifty-move count in the rail) |
| 7. Review: key moments with reasons and "play on from here" | Yes, plus "add to my practice" |
| 8. Save, resume, replay, reference card | Done in M1; still pass |
| 9. End to end at phone landscape, screenshots looked at | `npm run e2e` green: 100 tests (2 skipped on purpose) at 844×390, 1180×820 and 1440×900, now including finishing a lesson, a stage check, solving a problem, a missed problem through the review queue, a drill, and a review with key moments, practice and play-on. All seventeen M2 screenshots looked at |
| 10. `PROGRESS.md` | This section |
| `npm run check` | Green: types, lint, 166 unit tests, 6 property tests, lesson lint |
| APK | `out/kibitz-0.3.0-debug.apk`, 7.0 MB, signed with the repo key (checked by the build script) |

Fixed after looking at the screenshots and play-throughs: the "missing white king" crash in the
basic-mates drill (chess.js will not load an empty board); hints named broad tags ("Endgame")
before the real idea ("Mate in one"); themed problem sessions showed a raw text key as their
title; a wrong choice and the right one were not marked; "Show me" on a counting question did not
show the number; the key moments sat below the move list where a phone could not see them, and
the moment card pushed the review stepper off the screen; a game between two people called the
winner "the CPU"; plural slips ("1 cards", "1 rated games"); the Review door still promised
milestone 2; Today came to eight minutes instead of at least ten. The linter caught four lesson
errors before anyone saw them: an illegal "wrong" answer, a position with the side not to move in
check, a discovered attack where the engine found the other knight move far stronger, and a
passed-pawn position where a king move won just as well.

### Decisions in M2

1. **Lichess was reachable after all.** `database.lichess.org` was refused by the network policy,
   so it was added to this environment's allowed hosts through the approval card, as PLAN.md 2.11
   says. The fallback generator was not needed. The download page states CC0 for database exports.
2. **5,820 puzzles, not 6,000**: one bucket (600-rated trapped pieces) ran short within the first
   three million puzzles, where the importer stops. Ratings, themes and lines are kept as Lichess
   publishes them; the importer is repeatable.
3. **Lesson text lives in the lesson data, in English**, not in the interface catalogue. A Spanish
   build (M16) adds a parallel file per lesson set keyed by lesson id; the linter will check both.
4. **Numbers in lesson text** are placeholders computed from the rules; small structural words
   ("one square", "two rooks") are allowed in prose because the board itself checks them.
5. **Ratings start at 500 for play and 600 for problems**, below the lowest CPU level, so a new
   player is offered level 1; ten results settle a rating (shown with "?" until then).
6. **Review verdicts** use winning chances (the curve Lichess publishes) with thresholds of 5, 10
   and 15 points, and accuracy per move from the same published formula, averaged per side.
7. **Free-play opponents are the engine at full strength with a modest search** (150,000 nodes in
   the app), so basic mates are learned against the best defence.
8. **The basic-mates drill allows the fifty-move rule's 50 moves**, and the lesson versions 30
   (queen) and 50 (rook).
9. **Hints and retries make a problem unrated**; the review queue never moves the rating.

### Not done in M2, or open

- **Pop quizzes during a game** (PLAN.md 1.1, point 4) and **suggesting a help be switched off**
  (point 2) are not in M2's list; they will come with the polish milestone unless wanted sooner.
- Stage 4 (advanced) has no chess lessons yet; stage 3 is "started", as the plan says.
- The APK has still not run on a device (no emulator here). New in this build to check on the
  phone: a lesson, a problem, the review analysis (it runs Stockfish on the phone; how long a
  whole game takes there has not been measured), and Export with the new analyses table.

## M1. Chess: play

- [x] BoardKit grid (`src/kits/board/GridBoard.tsx`): tap a piece then a square, or drag; last
      move, legal-move dots and capture rings, check highlight, coach arrows and marks,
      coordinates, flip. Every square is a labelled button ("e4, white knight").
- [x] An original chess set drawn for the app (`src/kits/board/chess-pieces.tsx`).
- [x] `chess.js` behind the contract (`src/games/chess/rules.ts`), with automatic draws by
      repetition, fifty moves and insufficient material. Rules: `docs/rules/chess.md`.
- [x] Stockfish 19 (lite, single-threaded) in its own worker, started from the bot worker, behind
      a small UCI driver (`src/ai/uci.ts`). The same engine build runs in Node for ladders and
      tests (`tests/harness/stockfish-node.ts`). The two engine files are copied from
      `node_modules` at build time and precached for offline use.
- [x] Levels 1 to 8. Levels 1 to 3 pick among Stockfish's top lines with planned mistakes (and a
      liking for captures), seeded so a game replays exactly; levels 4 to 8 use Stockfish's own
      strength limit at 1500, 1750, 2000, 2300 and 2700, each with a node budget.
- [x] Optional clock: none, 5 min, 10 min, 15 + 10. Time is saved after every move and paused
      while the app is closed; loss on time, or a draw when the other side cannot mate.
- [x] Coach in the rail, each help a switch: legal moves (on by default), blunder warning with
      take-back, three-step hint (where to look, the idea, the move), threats, evaluation bar
      (off by default). Helps other than legal moves mark the game as training.
- [x] Move list in standard notation, captured pieces and material, fifty-move count, save and
      resume, take-back, flip, PGN out (menu) and in (Review door → Open a game file).
- [x] Starting from any position by link: `#/games/chess?fen=...` (used by tests, and by lessons
      next).

### Gate

| Check | Result |
| --- | --- |
| Perft cross-check | Our contract wrapper matches the published counts for six standard positions (to depth 2 or 3), and chess.js matches one ply deeper (`tests/unit/chess-rules.test.ts`) |
| Ladder | Measured over 16 games a rung (seats alternate): L2 beats random 0.97, L3 beats L2 0.72, L4 beats L3 0.91, L5 beats L4 0.81, L6 beats L5 0.72, L7 beats L6 0.81, L8 beats L7 0.875 (finished during M2); L1 and L2 against the final settings are in the M2 gate |
| Scripted full game against level 1 in e2e | Yes, at 844×390, 1180×820 and 1440×900: Stockfish in Node plays the person's side to checkmate, then the game is reviewed move by move |
| `npm run check` | Green: 136 unit tests, 6 property tests (chess random games keep the contract and replay), lint, types |
| `npm run e2e` | Green: 78 tests (2 skipped on purpose: PGN runs once), including the M1 screenshots |

Found and fixed on the way: Stockfish's own strength limit is far weaker than its name (level 3
with planned mistakes beat "1350" 15–1), so levels 1 to 3 now make many more mistakes and level
4 starts at 1500; the blunder check was asked about the position after the move instead of
before it; standard notation like `B6d7` was mistaken for from-to form; captured pieces were
counted from the standard set even in set-up positions; a hint that parries a mate threat now
says so; the New game dialog closes with Escape.

### Decisions in M1

1. **Contract additions.** An action codec may read notation in the context of a position
   (`fromText(text, state)`), because standard chess notation needs one. State notation must read
   back to the same notation (FEN cannot carry repetition history); JSON must read back exactly.
2. **Records** gained a general `ending` (resigned or timeout, replacing `resigned`; old records
   still open) and an optional `clock`.
3. **Draws by repetition and the fifty-move rule are automatic**, as online. The Table-ready track
   in M2 teaches how to claim them at a club.
4. **Coach answers come from the bot worker** (`advise` requests), with a node budget of 40,000,
   so the main thread never runs the engine.
5. **The table's move check pauses the clock** while the coach looks at a move, and a take-back
   restores the clock to before the move.

## M0. Foundation

- [x] `tabletop/` scaffolded with `npm run check`, `npm run e2e`, `npm run ladder` and `npm run apk` (README.md lists every command)
- [x] Design tokens: the club room look (`src/styles/tokens.css`), Fraunces for headings, Inter for text, tabular numerals
- [x] TableShell with the coach rail: status bar (game, level, score, turn, menu), play surface, player panel, rail with moves, counters and log; the rail collapses and can sit on the left
- [x] Today: focus games (up to three) and the session card, which says plainly that nothing is due yet
- [x] Games shelf grouped as Cards, Boards and Tiles; all eight launch games show as coming, with the milestone they arrive in
- [x] Game hub with the four doors (Learn, Practice, Play, Review), the reference card and an "add to focus" switch
- [x] Progress: lessons, problems, play rating and table-ready columns per game, and the five-item table-ready checklist
- [x] Tools: shows what is coming (scorepads, blind timer, score calculators)
- [x] Settings: profiles, coach rail side, motion, sound, look, backup, the foundation check, about and third-party software
- [x] Profiles: add, switch, rename, delete (with everything they own); no accounts
- [x] Backup: Export writes everything to one JSON file with a format version; Import checks it, asks, then replaces everything in one transaction
- [x] `core/`: the game contract, seeded random numbers, records (config + seed + actions + rules version), replay, the animation queue
- [x] `ai/`: alpha-beta with iterative deepening, a transposition table and a node budget; the bot worker and its host (only a seat's view is ever sent); ladders
- [x] The noughts-and-crosses fixture (not on the shelf) proves play against a worker bot, save and resume, replay and the animation queue
- [x] Offline install: a service worker precaches every file; tested by going offline, reloading and playing against the bot
- [x] Capacitor wrapper builds a debug APK that opens in landscape, signed with the fixed key in the repo

### Gate

| Check | Result |
| --- | --- |
| `npm run check` | Green: both type-checks, lint (no warnings), 93 unit tests, 5 property tests over random games (60 to 400 games each), lesson lint |
| `npm run e2e` | Green: 52 tests. The shell, the fixture game and review run at 844×390, 1180×820 and 1440×900; offline and backup run once at 844×390; one run captures screenshots |
| Fixture played end to end at 844×390 | Yes: a whole game against the CPU, then every move stepped through in review; also resume after closing, resign, and a game against the CPU while offline |
| `npm run ladder` | Green: L1 beats random 0.835, L2 beats L1 1.000, L3 beats L2 0.645 (58 wins, 142 draws, no losses), 200 games per rung |
| APK | Built: `out/kibitz-0.1.0-debug.apk`, 5.5 MB. Package `com.personal.kibitz`, versionCode 100, target SDK 36, activity locked to `sensorLandscape`, v2 signature from `android/app/signing/debug.keystore` (SHA-256 `b6379266…edbabc`), the script checks the signature on every build |
| Screenshots | Looked at all fifteen, fixed what looked wrong, sent to Swag |

Fixed after looking at the screenshots and play-throughs: a square still waiting to be animated was
announced as empty to screen readers; quick stepping in review queued up a backlog of animations;
the coach rail's log scrolled the move list out of view; the W/D/L tally missed the game that had
just ended; the "+" in Add buttons shrank to a dot; card titles on Today did not line up; and the
offline app failed to load its scripts because the server's `Vary: Origin` header stopped the
cache from matching (the service worker now ignores `Vary`).

## What is where

- `src/core/contract.ts` is the contract from PLAN.md 2.3, plus `rulesVersion`, `defaultConfig`,
  a JSON codec for the config and an optional event type parameter. Resigning is handled by the
  shell, not as a game action.
- `src/games/noughts/` is the fixture: rules, three CPU levels, reference card and board.
  `docs/rules/noughts.md` has its rules, golden cases and levels.
- `src/store/db.ts` is schema version 1 with every table from PLAN.md 2.8 (profiles, settings,
  game records, lesson progress, problem attempts, review cards, ratings) plus a small `device`
  table for the active profile. New versions go in the `VERSIONS` list with an upgrade step.
- Links: `#/today`, `#/games`, `#/games/<game>`, `#/games/<game>/reference`, `#/play/<record>`,
  `#/review/<record>/<move>`, `#/progress`, `#/tools`, `#/settings`. On a hub, `?seed=<text>` fixes
  the next game's seed, which the end-to-end tests use.
- Screenshots are written to `screenshots/m0/` by `npm run e2e` and the APK to `out/`; neither is
  committed.

## Decisions made in M0 (flip any of them)

1. **TypeScript 6.0.3, not 7.0.2.** 7.0.2 is the newest, but `typescript-eslint` supports only up
   to 6.0. Every other package is at its current stable version.
2. **Playwright 1.65.1 with the environment's Chromium.** The installed browser belongs to an
   older Playwright, so the config uses `/opt/pw-browsers/chromium` when it exists (PLAN.md 2.11).
3. **One name string.** `brand.json` holds "Kibitz"; the page title, install manifest, interface
   text and Android label read it. The Android app id `com.personal.kibitz` never changes, so a
   renamed build still installs over the old one. The backup format id is `tabletop-backup` for
   the same reason.
4. **The test table lives in Settings → Foundation check** (and at `#/games/noughts`), so it is
   off the shelf but still playable on the phone.
5. **Fixture CPU levels.** Level 1 looks one move ahead (takes a win, misses your threats), level 2
   looks two ahead (blocks, falls for forks), level 3 searches to the end and prefers moves that
   set fork traps. A ladder rung passes at a 0.6 share.
6. **Full screen on Android.** The status and navigation bars are hidden and come back briefly with
   a swipe. Notches are handled by Capacitor's SystemBars plugin, which passes the cut-out size to
   the page as safe-area insets. `sensorLandscape` allows either landscape direction.
7. **Export in the APK uses the Android share sheet** (Capacitor Filesystem and Share plugins),
   because the Android WebView cannot download a file the way a browser does. In a browser it is
   an ordinary download. Import uses the file picker in both.
8. **The INTERNET permission stays** in the Android manifest, as in Capacitor's template. The app
   makes no requests: a lint rule bans `fetch`, `XMLHttpRequest`, `WebSocket` and `EventSource` in
   app code, and every end-to-end test fails if the page asks for anything outside the app.
9. **Android SDK 36**, the Capacitor 8 template's default, with its Android Gradle Plugin 8.13.0
   and Gradle 8.14.3. Gradle fetched platform 36 and build-tools 35 by itself.
10. **Fonts and sound.** Inter and Fraunces (both OFL) are bundled, Latin and Latin Extended only.
    Sounds are synthesised with Web Audio; there are no sound files. Sound is on by default.
11. **Lesson lint** is part of `npm run check` but has nothing to check until M2 builds the lesson
    runner and linter. It fails if lesson files appear before that.
12. **Daylight look** shows in Settings as coming with the polish milestone, as the plan says.
13. **Default profile name** is "Player 1"; rename it in Settings.

## Not done, or not checked

- **The APK has not been run on a device.** There is no emulator or KVM here. It was built,
  signed and inspected (package, version, landscape lock, signature, bundled files). On the phone,
  please check: it opens in landscape, the bars stay hidden, nothing sits under a notch, a game
  against the CPU plays, a game resumes after closing the app, Export opens the share sheet and
  Import reads the file back, and a later build installs over this one without losing games.
- No fallback was needed: Capacitor worked, so the Trusted Web Activity route was not tried.
- No blocked hosts mattered for M0. M2 needed `database.lichess.org`; it was allowed through the
  environment's approval card (see the M2 decisions).
- Still open from the plan, and not blocking: which of these games Swag already plays.

## Versions (from `package-lock.json`, 2026-11-27)

React 19.3.1, Vite 8.4.0, @vitejs/plugin-react 6.3.0, TypeScript 6.0.3, Zustand 5.1.0,
Dexie 4.4.7, Capacitor 8.6.3 (Filesystem 8.1.5, Share 8.0.3), Vitest 5.1.2, fast-check 4.11.0,
fake-indexeddb 6.2.8, Playwright 1.65.1, ESLint 10.15.0, typescript-eslint 8.74.0,
eslint-plugin-react-hooks 7.1.1, tsx 4.23.15, Inter 5.3.0, Fraunces 5.3.0. Node 22, Java 21.
Every package and its licence is in `THIRD-PARTY.md`.

## Notes for M1

- Chess goes in `src/games/chess/` with `rules.ts` (chess.js behind the contract), `bots.ts`
  (Stockfish worker behind an `Engine` interface), `levels.ts`, `ui/` and `reference.ts`, then an
  entry in `src/games/registry.ts`, `src/games/bots-index.ts` and `src/games/ladders.ts`, and
  `playable: true` in `src/games/catalog.ts`.
- BoardKit (grid, coordinates, legal dots, drag) belongs in `src/kits/`; the noughts board is a
  one-off and does not need to move there.
- Copy Stockfish's lite single-threaded files into `public/engines/`; the service worker
  precaches everything in `public/`.
- Add `docs/rules/chess.md` before coding, and a line per new package in `THIRD-PARTY.md`.
