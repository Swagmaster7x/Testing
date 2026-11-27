## M6. Go

Built in its own worktree while M3 to M5 and M8 were built elsewhere, so this section is written
to be pasted into `PROGRESS.md` (and the milestone ticked) when the branches come together.

- [x] **Rules** (`src/games/go/`: `rules.ts`, `board.ts`, `score.ts`, `coords.ts`, `sgf.ts`) behind
      the `GameDef` contract, pure, with events, JSON and notation codecs. Boards of 9, 13 and 19
      at the table (5 and 7 in lessons). No suicide, with the New Zealand option for suicide of two
      or more stones; positional superko, with situational superko and the Japanese simple ko
      (a third repetition of a long cycle ends the game with no result) as options; pass, two
      passes end play, and the AGA rules that White passes last and each pass gives a stone.
      Dead-stone marking (mark, done, agree, or play on) with a suggestion from playouts; area
      and territory counting, seki found and kept neutral; komi; handicap 2 to 9, fixed on the
      star points or free, with the compensation each rule set uses. Six presets: Chinese
      (area), Japanese (territory), AGA, New Zealand, Tromp-Taylor (computer) and Capture-Go.
      The position text reads back to the same text; SGF (FF[4]) is written and read
      (setup stones, handicap, komi, rules, result, territory marks). The rules as implemented,
      every option and preset, golden cases and sources: `docs/rules/go.md`.
- [x] **A shared Monte Carlo tree search** (`src/ai/mcts.ts`): priors and RAVE over a small
      game interface, typed arrays, budgets in playouts, never in time. Go's search
      (`src/games/go/engine.ts`) plays heavy playouts: save a chain from atari, take a chain left
      in atari, MoGo's published 3×3 shape patterns around the last move (written out from the
      paper), then random moves that never fill an eye or play self-atari of more than one stone.
- [x] **Six CPU levels** (`src/games/go/bots.ts`, `levels.ts`), 60, 200, 600, 1,500, 3,000 and
      9,000 playouts on 9×9 (fewer per point on bigger boards), nominal ratings 400 to 1650.
      Levels 1 to 3 keep a beginner's habits (now and then they say atari because they can,
      grab a stone, or answer right next to your last stone), so their mistakes look human. The
      CPU places its handicap stones, passes when the count is won, marks dead stones and agrees
      to an equal marking. `advise` answers hint (the area, the idea, the point), threats (chains in atari
      or short of liberties), the territory estimate, dead stones, `best`, `analyse` and
      check-move.
- [x] **The table** (`src/kits/board/IntersectionBoard.tsx`, a shared kit, and
      `src/games/go/ui/`): an intersections board with star points, coordinates, the last move,
      a ghost stone for the optional confirm step, territory shading, liberty numbers, atari
      rings, and every point a labelled button ("D4, empty", "D4, black stone"); Pass; a
      captures counter; the counting phase (tap dead chains, Done, Agree or Play on, with the
      territory shown); coach switches for liberty counts, atari warning, territory estimate,
      "count for me" and the blunder warning; counters a real player keeps in their head
      (prisoners, the ko point, komi, the last stone's liberties, the move number, and the count
      while marking). A "rules at this table" picker in the New game dialog (board, preset,
      handicap, komi, and every option under "All rules"); Play again keeps the rules. SGF
      export from the game menu and import from Review. Reference card with every preset and an
      "ask before you sit" card.
- [x] **Lessons, 28** (`src/games/go/learn/`), every word original: stage 0 (2: Go in a minute,
      Capture-Go against the computer), stage 1 (9: points, liberties, capturing, chains, atari,
      where you may not play, ko, passing and the end, counting), stage 2 (8: atari from the right
      side, double atari, the ladder, when a ladder fails, capture your way out, two eyes, do not
      fill your own eyes, corners first), stage 3 started (3: the vital point, three in a row,
      the net), and the Table-ready track (6: manners, nigiri, placing handicap stones, counting
      by area, counting by territory, clocks and byo-yomi). Every "best" claim is checked by a
      solver (`verify.ts`): Capture-Go by a forced-capture search, shut-in groups by the
      life-and-death search, fights by the capture search; numbers come from placeholders.
- [x] **Practice** (`src/games/go/practice/`): 500 problems generated from numbered seeds and
      proved by solvers on the fight in question (`scripts/go-problems.ts`, repeatable):
      capturing (150, with atari, double atari and snapback chips), ladders and nets (150
      ladders and 50 nets), and life and death (150 corner problems, live or kill). In every
      problem the first move is the only one that works; in the capturing, ladder and net
      problems every later move of the solver's side is too. Plus the "count the board" drill,
      by area or territory, with dead stones to take off. Problems are 9×9.
- [x] **Review**: every position analysed (1,500 playouts each), moves rated by the loss in
      winning chances through the shared arithmetic in `src/teach/analysis.ts`, key moments with
      a one-sentence reason (put your own stones in atari, missed a capture, left stones in
      atari, passed too soon, or a bigger point elsewhere), "play on from here" through
      `configAt`, and Table-ready checklist entries (`src/games/ready.ts`).
- [x] Registered in `registry.ts`, `bots-index.ts`, `catalog.ts` (playable), `ladders.ts`,
      `lessons.ts`, `practice.ts`, `ready.ts` and the lesson linter; interface text in
      `src/text/games/go.ts`.

### Gate: the definition of done for Go (PLAN.md 2.10 and the M6 entry)

| Item | Result |
| --- | --- |
| 1. `docs/rules/go.md` | Every rule as implemented, thirteen options, six presets, notation, golden cases and sources |
| 2. Golden, property and replay tests | Pass: 35 golden cases (`tests/unit/go-rules.test.ts`), with counting cases for both methods (one finished game counted by area and by territory, seki, dame, dead stones, Tromp-Taylor with no marking); 8 property runs over random games, one per preset plus fixed and free handicap (no chain without a liberty, stones conserved, views never leak, every game ends, records replay to the identical state); SGF out and in (5) |
| Cross-check with `@sabaki/go-board` | Pass: legal points, captures and prisoners agree move by move over 12 random 9×9 and 5 random 13×13 games (more than 500 positions each), and the fixed handicap points for 2 to 9 stones on all three sizes; `@sabaki/sgf` reads our SGF files the same way |
| 3. At least four CPU levels pass the ladder | All six, on 9×9, 20 games a rung with seats alternating, margin 0.6: L1 beats random 1.000, L2 beats L1 0.650, L3 beats L2 0.900, L4 beats L3 1.000; with level 5 at 3,000 playouts (second run, `LADDER_LEVELS=4,5,6 npm run ladder -- go 20`), L4 beats random 1.000, L5 beats L4 0.700, L6 beats L5 0.750 |
| 4. Learn stages 0 to 2 and Table-ready complete, passing lint | 2 + 9 + 8 lessons in stages 0 to 2, 6 Table-ready, 3 in stage 3; `npm run lint:lessons` passes (28 Go lessons) |
| 5. At least three kinds of practice | Capturing 150, ladders and nets 200, life and death 150 (all generated and proved), and the counting drill |
| 6. Coach helps and a counter | Liberty counts, atari warning, territory estimate, count for me, blunder warning; prisoners, ko point, komi and the count in the rail |
| 7. Review: key moments with reasons and "play on from here" | Yes (end to end: key moments shown, play on from the fourth move) |
| 8. Save, resume, replay, reference card | Resume after closing the app, replay of records, SGF out and in, the reference card: all end to end |
| 9. End to end at phone landscape, screenshots looked at | `npm run build` then `E2E_PORT=4186 npx playwright test --workers=2`: 129 passed, 4 skipped on purpose, at 844×390, 1180×820 and 1440×900. Go has ten tests, run at each size (SGF only on the phone, as files do not depend on the layout): a 9×9 game played to the count, then its review with key moments and play on from the fourth move; 13×13 Japanese and 19×19 with four handicap stones; the confirm step and liberty counts; resuming after the app closes; a lesson; a Capture-Go lesson won against the computer; a capture problem, a ladder and a net; the counting drill; the reference card; SGF out and in. All 23 screenshots in `screenshots/m6/` looked at |
| 10. Progress notes | This section |
| `npm run check` | Green: types, lint, 238 unit tests (72 of them for Go and the shared search), 14 property tests (8 for Go), and the lesson lint (37 chess and 28 Go lessons) |
| Top level on 9×9 | Level 6 (9,000 playouts) takes 0.77 s for an opening move here on a quiet machine (0.88 s of processor time); 13×13 0.66 s and 19×19 0.65 s, where the budgets shrink. Not measured on a phone (see below) |

Fixed after looking at the screenshots and play-throughs: the coordinates on 13×13 and 19×19
were too small to read on a phone (they now grow with the board); star points showed through
the territory squares; the choices under "All the rules" did not line up; the board's wood grain
read as a stray line; the last-move ring covered the liberty count; coordinates touched the
edge stones; a dead stone vanished under its territory square; and the running count gave the
answer away in the counting lessons. The solvers also show why the net lesson needs the white
stone on the ladder's path: without it both ataris capture too, and the linter refuses the
"best" claim. The shared shelf test counted seven coming games; it now reads the count from the
catalogue.

### Decisions in M6

1. **Default rules: Chinese (area) on 9×9.** Area counting is what the lessons teach first; it
   forgives filling your own territory, and it needs no prisoners. Territory counting is one
   choice away, and the Table-ready track teaches both.
2. **Disputes over dead stones are settled by playing on**, under every preset. The Japanese rules
   settle them by hypothetical play off the record; that is hard to show on a phone and would
   need a second board, so the app plays on instead and the rules page says so.
3. **Seki** is found by a rule rather than by search: an empty point next to live stones of both
   colours where neither side can play without leaving its own chain with one liberty or fewer.
   Shared liberties are always neutral; under the Japanese preset the eyes of stones in seki are
   not territory either.
4. **Japanese long cycles** (triple ko and the like) end the game with no result on the third
   repetition, rather than being forbidden.
5. **Our own dead-stone estimate and SGF reader.** `@sabaki/deadstones` was tried and dropped: it
   loads WebAssembly with a fetch and seeds itself from the clock, so the app estimates dead
   stones with its own playouts, seeded by the position (the same board always gets the same
   suggestion). `@sabaki/sgf` needs Node's file system, so SGF is read and written by a small
   module of our own. `@sabaki/go-board` and `@sabaki/sgf` stay as dev dependencies (MIT), used
   only by the tests as second implementations; THIRD-PARTY.md records them.
6. **Levels by playout budget, never by time**, as the plan asks: the same seed gives the same
   game on any device. Level 5 was 4,000 playouts at first; it beat level 4 by 0.850 but level 6
   only just cleared it (0.600), so it came down to 3,000 to spread the ladder.
7. **Problems are generated, not collected.** Each kind has its own generator, and a problem is
   kept only when the solver proves the answer and proves that every other first move fails
   (and that passing fails, so the move is urgent). The capture search counts a chain that
   reaches three liberties as escaped, the usual simplification in capture reading, so those
   proofs hold within that model; the life-and-death proofs are exact within the region. Nets
   come from the net shape with a few stones about it that may break the ladders; 400 random
   fights and about 3,900 systematic placements tried first gave no net the solver could prove
   unique.
8. **Capture-Go ends after two passes too**, with the player who captured more winning, so a
   lesson against the computer can never stall.
9. **Small shared changes**, each optional for other games: `GameUi.rules` (a rules picker for the
   New game dialog, used by Go only), Play again keeping the game's config when a game has a
   rules picker, and an optional `choose` in the property-test harness (uniformly random Go
   never ends, so Go's properties use a chooser that passes more as the board fills).
10. **"Count for me" is on by default and does not make a game training**: it only shows the
    running count while dead stones are marked, which the app works out anyway to give the
    result. The other helps (liberty counts, atari warning, territory estimate, blunder warning)
    do make it training. Lessons and drills run without it, so a question that asks you to
    count does not show the answer.

### Not done in M6, or open

- **Speed on a phone is not measured**: there is no emulator here, and the APK was not built in
  this worktree. Level 6 takes 0.77 s for a 9×9 opening move on this machine; a phone core that
  is three or four times slower would put it near the 3 s the plan aims for. If it is slower,
  level 6's playout budget in `src/games/go/bots.ts` is the one number to change. The review
  (1,500 playouts a position) and the territory estimate have not been timed on a phone either.
- **Nets come from one shape**, the net around a lone stone with two liberties. Nets after a
  sacrifice, loose ladders, and nets on bigger chains are not generated. All problems are 9×9.
- **Stage 3 has three lessons** ("started", as the plan says) and stage 4 none. Snapback turns up
  in the capturing problems but has no lesson yet.
- **Japanese disputes are settled by playing on** (decision 2), not by hypothetical play.
  Byo-yomi and Canadian overtime are taught in the Table-ready track, but the app's clock only
  offers the increment clocks for Go.
- The territory estimate and the suggested dead stones come from playouts, so they can misjudge
  a seki or a group whose life hangs on a ko; the players' own marking always decides.
- `@sabaki/go-board` does not count, so counting is checked by the golden cases alone.
- **Handicap was measured, not tuned**: it is not a ladder rung. On 9×9 under the Japanese preset,
  level 4 taking two stones against level 6 scored 0.250 over 8 games, and level 5 with two
  stones also 0.250. Two stones do not make up those gaps between the CPU levels, so the app
  does not suggest a handicap; the player chooses one in the New game dialog.
- `PROGRESS.md` is not edited here, as asked: this file is the section to paste in, and the
  milestone list's "M6. Go" box is to be ticked then. The shelf test in `tests/e2e/shell.spec.ts`
  now counts the coming games from the catalogue, so the other milestones' branches do not
  have to change it again.
