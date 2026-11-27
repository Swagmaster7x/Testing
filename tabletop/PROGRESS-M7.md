# M7. Chinese Checkers, and pass-and-play for every game

Built in its own checkout while M5 (Texas Hold'em) was built on the main branch; to be folded into
`PROGRESS.md` at the merge. Date: 2026-11-27.

- [x] **Rules first**: `docs/rules/chinese-checkers.md`: the star of 121 holes, two, three, four or
      six players (opposite points; every other point, so every home starts empty; two opposite
      pairs; every point), ten marbles (fifteen as an option for two), steps and hop chains with no
      captures, and every disputed rule as an option: long jumps (the fast-paced, "Super Chinese
      Checkers" game), whether a marble may stop in a point that is nobody's home (anywhere, pass
      through only, keep out), marbles at home (stay, may leave, may not move), when a home counts as
      complete (filled with at least one of yours, the rule that makes blocking useless, as the plan
      asks; or all your own), places (play on, or first home wins), and a turn limit so every game
      ends (100, 150, 200 or 300 turns each). Seven presets: **Two players** (the default), Three,
      Four, Six players, Fifteen marbles, Fast-paced and Closed points. An "ask before you sit" card,
      15 groups of golden cases, notation, "not implemented, on purpose", and sources with the date
      read (Wikipedia and pagat were refused by the network policy; the sources were read through a
      web search service's extracts, as the document says).
- [x] **One core for the rules, the CPU and the checks** (`board.ts`, `engine.ts`): the star from cube
      coordinates, holes named by row from the bottom and letter from the left ("4b", "17a"), the
      move generator (a breadth-first search over landings with the moving marble lifted, so a chain
      may cross its own hole but never end there; long jumps; the stopping and home rules), the
      finishing test, rows to go, and a mutable position with Zobrist keys for the search.
- [x] **Rules behind the contract** (`rules.ts`): pure `apply` returning events (the move with its whole
      chain, a pass, a player finishing, the end with every place); finishers leave the turn order and
      their marbles stay as stepping stones; a move can also complete another player's home; a seat
      with no move passes, and when everyone still in passes in a row the game ends; places come from
      the finishing order, then rows to go (equal counts share a place). JSON and position text that
      read back exactly, moves stored as four letters ("fnfm") and shown as "4b-5f", configs, presets,
      `configAt` for "play on from here".
- [x] **Six CPU levels** (`bots.ts`, `levels.ts`, nominal ratings 350 to 1600): level 1 races its
      front marbles with the longest jump it can find and now and then just steps one forward (the
      beginner's habit that leaves stragglers); level 2 looks one move ahead at the whole position
      (rows to go, marbles off to the side, marbles left behind); levels 3 to 6 search with the shared
      principal-variation search (`src/ai/pvs.ts`) for two players: two moves deep, three deep with
      planned slips, three deep cleanly, five deep (250,000 nodes). With three or more players they
      look ahead over their own next moves with the others held still, wider and deeper each level.
      Strength comes from node budgets and widths only; a seeded quarter-row wobble in the evaluation
      keeps a level from repeating a game. Reason tags: finishes, comes home, chain, hop, brings up
      the last marble.
- [x] **The table** (`src/kits/board/StarBoard.tsx`, a new BoardKit, and `ui/`): a walnut star with
      each start point tinted in its owner's colour; marbles in six colours, each with its own mark
      (dot, square, triangle, diamond, plus, cross) so colour is never needed; every hole a labelled
      button ("5e, Red marble"). Tap a marble and every hole it can reach lights up, single hops as
      rings and chains with their number of hops; tap the end and the marble slides along the
      shortest chain. Picking the end beats tapping every landing: only the start and end matter to
      the rules, a long chain is one tap, and the numbers teach chains. The last move's path stays
      drawn. The board turns so the player at the device sits at the bottom. Pass appears only when
      no marble can move.
- [x] **Coach**: where a marble can go (on, not training), the race count (rows to go for every
      player, with bars; training), a warning before a move that gives away two rows or a finish
      (training), and a three-step hint (the marble, the idea, the move). Counters: the round of the
      limit, marbles home, who has finished.
- [x] **Review** (`review.ts`): two players, every move of both sides by the search's winning chances
      (a row is worth about four points); more players, your own moves against the best move of the
      lookahead. Key moments with reasons (a finish missed, a marble that could have come home, a
      marble left behind, a chain that went further, or simply a faster move), "add to my practice",
      "play on from here".
- [x] **Learn**: 21 lessons, every word original, all passing the linter: stage 0 (2: the game in a
      minute, a first race against the computer), stage 1 (9: the star, steps, hops, chains, turns and
      passing, coming home, a marble left in your home, the end of the race, two to six players),
      stage 2 (6: build a ladder, hop over their marbles, leave no marble behind, count the race, use
      the middle, win the race at the end against the computer), Table-ready (4: setting up, ask before
      you sit, manners, counting rows by hand). "Best" claims are checked by exact solvers
      (`solver.ts`, `learn/verify.ts`): within four moves of finishing, the accepted moves must be
      exactly the first moves of the fastest finish; otherwise exactly the moves that go furthest,
      every other move at least a row short. Numbers are placeholders (holes, marbles, rows to go,
      reach of a marble, the best gain).
- [x] **Practice**: 120 longest-hop problems (one move goes furthest by a chain of two or more hops;
      themes: chain, single hop, over their marbles) and 120 race endgames (finish in two to four
      moves; every first move that is as fast counts; "fill from the tip" when a move into the home is
      a trap), generated from the CPU's own games by `scripts/chinese-checkers-problems.ts` from
      numbered seeds and proved again by the unit tests. Two generated drills: count the race (rows
      to go, Red or Blue) and where can it go (every hole one marble can reach).
- [x] **Table-ready checklist**: setting up; hops, chains and the blocked home; five race counts right
      first time; manners and the questions to ask; a win against level 3 without helps.
- [x] **Pass-and-play for every game** (shell, generic): in the New game dialog "Who plays" offers
      Against the CPU or Pass and play; each seat is then a Person (with a name, "Player 2" if left
      blank) or the CPU at the chosen level. The table is shown for the person whose turn it is (or
      who moved last while a CPU moves): their hand, their side at the bottom (chess and shogi flip,
      Chinese Checkers turns its star). Games whose views differ between seats (worked out from the
      views, or `GameUi.hiddenInfo`) cover the whole table between two people's turns with "Pass the
      device to Ana" and a button "I am Ana: show my hand"; nothing of the table is rendered under the
      cover. The status bar says "Ana to move"; results read "Ben wins", "First place is shared" and,
      with more than two, every place by name; resign resigns for whoever holds the device; Play again
      and Play on from here keep the people. Games between people never move a rating, never tick the
      "beat level 3" checklist item and stay out of the accuracy trend. Brisca and Dominoes name the
      other people in their log lines instead of "the CPU" (an optional `names` argument). Hold'em
      gets all of this from the shell after the merge.

## Gate: the definition of done (PLAN.md 2.10) and the M7 gate

| Item | Result |
| --- | --- |
| 1. `docs/rules/chinese-checkers.md` | Rules as implemented, 8 options, 7 presets, ask-before-you-sit, notation, golden cases, not implemented on purpose, sources |
| 2. Golden, property and replay tests under every preset | `chinese-checkers-rules` 24 tests (every golden case); `chinese-checkers.property` 11 runs: all seven presets and three odd mixes keep the contract, every seat keeps its 10 or 15 marbles on 121 holes, records replay, every game ends; a player heading for home finishes in at least half the games under every preset |
| No game can deadlock in random play (M7) | A seat with no move must pass (golden case); everyone passing in a row ends the game (golden case); the turn limit ends every game; uniformly random games for two, three and six players all end, at the limit at the latest |
| 3. At least four CPU levels pass the ladder | All six (table below) |
| 4. Learn stages 0 to 2 and Table-ready, passing lint | 2 + 9 + 6 lessons and 4 Table-ready; `npm run lint:lessons` passes |
| 5. Three kinds of practice | Longest hop 120 and race endgames 120 (generated, proved), and two generated drills |
| 6. Coach helps and a tracker a player keeps in their head | Rows to go for every player (the race count), where a marble can go, the slow-move warning, a hint |
| 7. Review with key moments, reasons, play on | Yes |
| 8. Save, resume, replay, reference card | Resume and the reference card in e2e; replay in the property tests |
| 9. End to end at phone landscape; screenshots looked at | `tests/e2e/chinese-checkers.spec.ts` (9 tests: a race to the end with its review and play on from a position, hop chains on the opening board, three players and the board turned for Blue, resuming, a lesson, the free-play race lesson against the computer, a longest-hop problem and a race endgame, both drills, the reference card) and `tests/e2e/pass-and-play.spec.ts` (4 tests: the Brisca cover, Chinese Checkers turning for each person, the chess board flipping, a CPU among three people) pass at 844×390, 1180×820 and 1440×900 (39 runs). The whole suite at the three sizes: 213 passed, 6 skipped by design, none failed (before the last small fixes; the two specs above were run again after them). Every screenshot spec passes (8). The 22 screenshots in `screenshots/m7/` and the table at the two larger sizes were looked at; fixed after looking: the counters overlapping their label with six players, arrows too short to see for one-hole moves in review, a reason that repeated the better move, a review scale that called a one-row slip a mistake, and Brisca's "Cards up: see the CPU's hand" at a table of people |
| 10. Progress notes | This file |

The ladder (`npm run ladder -- chinese-checkers 30`: two players, default rules, seats alternating,
pass at 0.6):

| Rung | Won | Lost | Score |
| --- | --- | --- | --- |
| Level 1 against random play | 30 | 0 | 1.000 |
| Level 2 against level 1 | 29 | 1 | 0.967 |
| Level 3 against level 2 | 23 | 7 | 0.767 |
| Level 4 against level 3 | 27 | 3 | 0.900 |
| Level 5 against level 4 | 28 | 2 | 0.933 |
| Level 6 against level 5 | 27 | 3 | 0.900 |

How the levels were set (head-to-head matches over 20 to 100 games): depth 3 beat depth 2 20 to 0;
depth 4 against depth 3 only 21 to 19 over 40 games (a search that ends on the other side's move
gains little in a race), so no level is four deep; depth 5 beat depth 4 19 to 1 and depth 3 17 to 3;
depth 6 at 400,000 nodes lost to depth 5 8 to 12. Planned slips at depth 3 (one move in five chosen
within 1.2 rows of the best) cost a lot: depth 4 beat that 40 to 0, which made it level 4. Level 1
first chose the longest jump with any marble and level 2 beat it only 0.53 to 0.85 depending on the
seeds; level 1 now favours its lead marbles, and level 2 beats it 97 to 3 over 100 games.

With more players (one seat at the higher level, every other seat at the lower, the seat going
round, mean share of the places where 0.5 is even; short runs, 12 games for three players and 6 for
six): three players, level 2 against level 1 0.917, 3 against 2 0.833, 4 against 3 0.667, 5 against
4 0.583, 6 against 5 0.625, and 6 against 3 0.875; four players, level 2 against level 1 0.611; six
players, level 3 against level 2 0.633. Every step is ahead, by less than with two players.

Speed on this machine (a shared four-core box): level 6 takes 0.1 to 0.5 s for a two-player move in
the middle game (up to 250,000 nodes), levels 1 to 5 under 0.05 s; with six players every level
answers in under 0.05 s. Not measured on a phone.

## Decisions in M7

1. **Default rules**: two players; marbles stay at home once in (the traditional rule, in German
   Sternhalma instructions and several English ones); marbles may stop anywhere (Wikipedia's rules
   say nothing against it; "pass through only" is the Closed points and Fast-paced presets); the
   filled-home rule from the plan (and Sturtevant's research); play on for places; 200 turns each.
2. **The filled-home rule as the plan states it**, with one consequence written in the rules
   document: in principle a player could finish early by dropping one marble into the last free hole
   of a home the other side has hardly left. A first draft of the ladder lesson ran into exactly this
   (Red "finished" in four moves into a home still full of Blue), so the lesson was redrawn; real
   games never get there.
3. **A turn limit instead of a draw rule**: rows to go decide the places, which rewards the player
   who raced, not one who stalls. Uniformly random games end at the limit; players heading for home
   finish long before it.
4. **Choosing a chain by its end**, with every reachable hole lit and numbered, rather than a tap on
   every landing (reasons above). The path the marble takes is the shortest chain to that hole.
5. **Seat colours by turn order**, not by point (Red, Blue, Green, Yellow, Purple, White): the shell
   draws a seat's mark without knowing the number of players. Red always starts at the bottom.
6. **No four-deep search level** (measured no stronger than three deep). Multiplayer levels use an
   own-move lookahead rather than Monte Carlo tree search: the shared MCTS keeps a move table of the
   whole move space per node (14,641 moves here), and in a race your own route is most of the game.
7. **Problems from the CPU's own games**, kept only when a solver proves them; race endgames accept
   every equally fast first move (they rarely have just one) and are made only where no other
   colour's marble is within two holes of the home, so "the others held still" is safe.
8. **Pass-and-play marks its records by names**: every person at a pass-and-play table has a name
   (typed, or "Player N"), and a game is pass-and-play when two or more seats are named people. Games
   opened from files (every seat an unnamed person) keep their old behaviour.
9. **Hidden information is detected, not declared**: the shell compares every seat's view at the
   start; a game can still say so with `GameUi.hiddenInfo`. Chess, Go, Shogi and Chinese Checkers
   (views are the whole state) get no cover; Brisca, Dominoes and Hold'em do.
10. **The table changes hands only when the next person says so** in hidden games, so a CPU's moves
    play on behind the cover and nothing shows until the right person taps. While the coach is still
    checking a person's move, or its warning waits for "take back" or "keep", the table stays with
    the person who moved; the cover (or the turned board) comes after.
11. **Small shared changes**, each optional: `SeatPlayer.name`, `isPassAndPlay` (core/record);
    `GameUi.hiddenInfo` and the `names` argument (games/types); `StartOptions.players`; the New game
    dialog's "Who plays"; the table and review screens; `resultTitle` (results by name or place: "You
    came third" in a game of several); `controller.resign(seat)`; `?position=` on a hub link for games
    that start from a position text (e2e tests use it); Brisca's and Dominoes' log names. The Brisca
    help label now reads "Cards up: see the other hand".

## Shared files changed

`src/games/catalog.ts` (playable), `registry.ts`, `bots-index.ts`, `ladders.ts`, `lessons.ts`,
`practice.ts`, `ready.ts`, `types.ts`; `src/text/en.ts` (the shelf lines, pass-and-play and result
texts), `src/text/games/index.ts`, `src/text/games/brisca.ts`; `src/core/record.ts`;
`src/shell/App.tsx`, `results.ts`, `progress-data.ts`, `screens/HubScreen.tsx`,
`table/TableScreen.tsx`, `table/ReviewScreen.tsx`, `table/controller.ts`, `table/names.ts`,
`table/start.ts`; `src/styles/table.css`, `src/styles/shell.css`; `src/games/brisca/ui/index.tsx`,
`src/games/dominoes/ui/index.tsx`, `src/games/dominoes/ui/names.ts`; `scripts/lesson-lint.ts`;
`docs/adding-a-game.md`. New: `src/shell/table/passplay.ts`, `src/shell/table/PassCover.tsx`,
`src/kits/board/StarBoard.tsx`, `src/kits/board/star.css`.

## Not done in M7, or open

- **Partners and one person playing several colours** are not offered (see the rules document); the
  contract already knows about sides, so they are an option away.
- **Stage 3 and 4 lessons** are not written (the gate asks for stages 0 to 2 and Table-ready).
- **Multiplayer strength** is checked with a few short matches, not a ladder: `npm run ladder` plays
  the two-player game.
- **Phone speed** is not measured (no emulator); level 6's budget in `bots.ts` is the one number to
  change if it is slow.
- **Hold'em** (on the main branch) gets pass-and-play from the shell after the merge; its log lines
  will call the other people by their game names unless it uses the `names` argument.
