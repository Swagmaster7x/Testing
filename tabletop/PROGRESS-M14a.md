# M14, first part: two more Dominoes styles (All Fives, Cuban double nine)

Built on 2026-11-27 in its own checkout. PLAN.md M14: "each style gets a rules file or variant, a
rules document, tests, a short 'what is different' lesson track, and its own scoring drill". Both
styles are variants of the one Dominoes engine (options and presets), not separate games.

## What was built

- [x] **Rules first**: `docs/rules/dominoes-styles.md` (All Fives and Cuban, the options added,
      five presets, ask before you sit, golden cases, not implemented, sources read 2026-11-27);
      `docs/rules/dominoes.md` points to it.
- [x] **The set is an option** (`set: double-six | double-nine`). `Pip` runs 0 to 9; tiles, the pip
      total (168 or 495), hand sizes (`hand: auto | 5 | 7 | 9 | 10`), the sleeping tiles, the
      "highest double leads" rule (the 9-9, or the highest double dealt; no double dealt means a
      new deal), the codecs and the coach's tables all follow it. Moves read in a position use its
      set; records accept either.
- [x] **The spinner and its arms** (`spinner: first-double`): the first double played takes a third
      arm once both its sides are covered and a fourth after the third. The layout keeps the line
      (`chain`) plus `spinner`, `up` and `down`; moves gain the ends `U` and `D` (`1-5U`). The
      state notation of a line game is unchanged (the arms are written only with a spinner).
- [x] **Scoring as you play** (`fives: on`): after each play the open ends are counted (a double at
      an end counts both halves; the spinner while it is an end; a lone tile all its pips) and a
      multiple of five scores at once, as a bonus of kind `fives`. `rounding: nearest-five` for the
      pips at the end of a hand; `finish: at-once` ends the match the moment a play (or a pass
      bonus) reaches the target, with a hand result of reason `target`.
- [x] **Three players** (`draw-three`, `block-three`) with three sides, a three-way tie rule (two
      tied for the fewest pips share the third's count), and four in partnerships with a boneyard
      (`partnership-draw`).
- [x] **Cuban rules**: `blockedWinner: player` (the side of the lightest single hand; opponents tied
      score nothing), `blockedScore: all` (the 300 variant), `nextLead: winning-team` (the winner;
      after a tie the side that did not lead). All Fives' `nextLead: winner-lot` (who went out;
      after a block, by lot). `drawLimit: leave-one`, targets 250 and 300.
- [x] **Presets**: All Fives (two players), All Fives (three players), All Fives (partners), Cuban
      double nine, Cuban 300. Every older preset keeps its exact behaviour (`rulesVersion` 2, so
      older builds refuse records that use the new options).
- [x] **The fast simulator** (`sim.ts`) handles both sets, the arms and the count (see below).
- [x] **The CPU** values scoring plays at every level (level 1 takes any score it sees; levels 2
      and 3 weigh it, level 3 also what the play leaves the next player to score; the search sees
      the points), leads a scoring tile (the 5-5, the 4-6) when it has one, and with the double
      nine weighs pips more and leaves the conventional play only for a clear gain (see the
      ladders).
- [x] **The table** (`DominoesSurface.tsx`, tile kit): tiles with 7, 8 and 9 pips in their own
      colours; the cross layout; up to four end markers ("the upper arm (1)"); the count of the
      ends ("Ends: 15", gold when it scores) and the points of a play beside the tile ("+15"), as
      a coach help that is on at the table and absent in lessons and drills that ask for the count;
      three seats; ten-tile hands; "Out of play: 15"; face-up side hands drawn larger so their pips
      can be counted; messages for a match ended at once, a three-way split and a Cuban block won
      by the lightest hand ("the lightest hand: Right").
- [x] **Coach**: the tiles-out triangle and the numbers left for 55 tiles; pip totals for the set;
      a "Scoring plays" help listing your tiles that score now; hints and ideas for scoring plays.
      Counters gain "The ends count".
- [x] **Review**: arm moves and a reason for a missed scoring play ("made the ends a multiple of
      five").
- [x] **Lessons** (stage 4, "Advanced", as Poker's other games): All Fives: count the ends; the
      spinner; the end of a hand. Cuban dominó: the double nine; a blocked hand. Every number is a
      placeholder; the dominoes lesson game strips double-nine tile names (7-9) from the typed-number
      check.
- [x] **Drills**: "All Fives: count the ends" (what do the ends count after the other player's play,
      and does it score?) and "Cuban: count their pips" (every hand face up: the opponents' pips,
      what your side would score), both from hands played by level-3 bots.
- [x] **Text**: every new key in English (`src/text/games/dominoes.ts`) and Spanish
      (`src/text/es/games/dominoes.ts`); the reference card has All Fives and Cuban sections.

## The double-nine simulator

Hands are bit masks in **two 32-bit words**: `lo` holds tiles 0 to 31 of the set in play and `hi`
tiles 32 to 54, with per-set tables (numbers on each tile, pips, the tiles holding each number as
two masks). The double six's 28 tiles all sit in `lo`, so `hi` stays zero there. Everything stays
in 32-bit integer arithmetic, which BigInt would not, and without the indirection of a typed-array
bitset. Legal moves now walk the set bits of a hand instead of all 28 indices, which paid for the
second word. Moves are `tile * 4 + end` (left, right, up, down). The layout is kept as its open
ends: the two line ends and whether each is a double, the spinner's number and whether it is still
an end on either side, and the two arm ends. `peek()` gives the ends and count after a move without
making it, for the rollouts.

The bots' fast model is checked against the rules: every preset, old and new, plus odd option
mixes, plays whole hands to the same points, and the count of the ends after every play is the same
(`tests/unit/dominoes-bots.test.ts`, `tests/unit/dominoes-styles-bots.test.ts`).

**Speed, before and after** (300 double-six positions from Puerto Rico 500 and the Draw game,
warmed up, five timed passes, run alternately with an export of the previous commit; ms per
decision, median):

| Level | Before | After |
| --- | --- | --- |
| 1 | 0.02 to 0.03 | 0.01 to 0.02 |
| 3 | 0.02 to 0.03 | 0.02 to 0.03 |
| 4 | 0.57 to 0.74 | 0.44 to 0.51 |
| 5 | 4.0 to 4.3 | 3.4 to 4.1 |
| 6 (100 positions) | 18.0 to 19.2 | 16.3 to 20.6 |

The decisions are identical (the same signature of 300 choices at every level). In the new styles:
All Fives level 5 about 5 ms, level 6 about 20 ms; Cuban level 5 about 10 ms, level 6 about 35 ms.

## The cross

`layoutCross` in `src/kits/tiles/line-layout.ts` (the line layout is untouched for line games): the
spinner lies across the middle and each arm is a "snake" kept to its own part of the table, so arms
never meet: the right arm runs right, then back and forth downwards on the right; the left arm left
and upwards on the left; the upper arm up, then right along the top, working down; the lower arm
down, then left along the bottom, working up. Rows keep clear of the vertical arms' column, with
room for a corner. A corner tile starts beside the last tile, so matching halves always touch, as in
the line layout. `fitLine` tries the largest tiles first and also shrinks them while any two tiles
overlap. On a phone the vertical arms turn at once (there is no height for a straight leg); on a
tablet or laptop they run straight up and down from the spinner first.

## Tests

- `npm run typecheck`, `npm run lint` (whole project): clean.
- Unit: 55 files, 640 tests pass, including the new `dominoes-styles.test.ts` (pagat's worked example
  of All Fives play by play: 5, 0, 10, 5, 5, 10, 15, 5, 0; the arms; doubles at the ends; rounding;
  the target reached at once; hand sizes; the three-way split; Cuban blocks and ties; scoring and
  the 300 variant; the double-nine deal, notation and redeals; hidden sleeping tiles) and
  `dominoes-styles-bots.test.ts` (the fast model, legal play at every level in every new preset,
  bots taking scoring plays, coach and review in both styles). Every existing Dominoes test passes.
- Property: 9 files, 51 tests pass. The Dominoes property tests run every preset (13) and six odd
  mixes of the new options: tile conservation, the set's pip total, scores adding up, no leaks
  (sleeping tiles and the boneyard included), replays, and samples that keep every pass.
- Lesson lint: 26 Dominoes lessons (5 new) pass, with the "I already know this" checks.
- End to end (`E2E_PORT=4891`, after a build): `tests/e2e/dominoes-styles.spec.ts` plays a whole
  All Fives match against level 1 and reviews it, plays a Cuban hand to the end, and finishes an
  All Fives lesson; with `dominoes.spec.ts`, 21 tests pass at 844×390, 1180×820 and 1440×900.
- Screenshots: `tests/e2e/screens-m14a.spec.ts` writes 24 shots to `screenshots/m14a/` (phone
  landscape at twice the pixels, plus tablet and laptop tables). Looked at every one, and fixed:
  - the count of the ends showed in a lesson and the drill that ask for it (now a coach help, off
    outside games);
  - face-up side hands were too small to count nine pips (now drawn larger, sized to the column);
  - a Cuban block said "they have fewer pips" when one light hand won it (now names that hand);
  - a play's "+15" never appeared, because the tile is still drawn in hand while its event plays
    (now shown at the end the tile is going to);
  - the hand-over banner was missed by the screenshot loop (it now checks while the CPU plays).

## Ladders

`npm run ladder -- dominoes-all-fives` and `npm run ladder -- dominoes-cuban` (added to
`src/games/ladders.ts`). Paired games, margin 0.6.

| Rung | All Fives, to 250 (60 games) | Cuban, to 500 (100 games) |
| --- | --- | --- |
| L1 vs random | 0.983 | 0.930 |
| L2 vs L1 | 0.600 | 0.630 |
| L3 vs L2 | 0.717 | 0.640 |
| L4 vs L3 | 0.667 | **0.440 (fails)** |
| L5 vs L4 | 0.650 | 0.630 |
| L6 vs L5 | 0.600 | see below |

Level 5 against level 1 (100 paired games): All Fives 0.910; Cuban (to 100) 0.650.

All Fives passes every rung. Cuban needed work and one rung is still open:

- Played to 100 (the preset), one Cuban hand usually decides the match, so 100 games could not
  separate the levels (0.52 to 0.59 at every rung). The ladder plays Cuban to 500.
- Level 1 (shed the heaviest tile) is a strong baseline with the double nine, because a blocked hand
  goes to the lightest single hand. Levels 2 and 3 now weigh pips 3.5 times more with the double
  nine (measured over 300 games: 0.52 at 1.5, 0.61 at 2.5 and 3.5, 0.53 at 5).
- Level 4's 16 sampled deals were too noisy for hands worth three times as much (0.33 against level
  3). With the double nine the search now keeps the conventional play unless another play beats it
  on the same sampled deals by more than the convention margin (scaled by the set's pips) and by two
  standard errors. That lifted level 4 to about level 3 (0.44 to 0.56 over different seeds), but not
  past it: even level 5 beats level 3 by only 0.60, and level 4 with 48 or 64 deals measured 0.56 to
  0.59. So the gap from 3 to 4 is open; level 5 and level 6 stay ahead of 4 and 5.

## Decisions

- **One engine, options and presets**, not new games. `mode` gains `partnership-draw`, `draw-three`
  and `block-three` rather than splitting "players" and "drawing" into two options, so old configs
  and records read as before.
- **The third arm is offered first, then the fourth**: the two are the same until one starts, so the
  rules offer "up" while both are empty, and "down" once "up" has a tile.
- **"The highest double leads"** keeps its stored value `double-six`; its label now says "6-6, 9-9".
- **Cuban leads**: the first leader by lot (the table's draw of one tile per side, then the side
  choosing its player, is not modelled), then the winner (pagat's common variant), then after a tie
  the other side's lightest hand. The fifteen sleeping tiles never count, not even with "every tile
  left" (the 300 variant counts the tiles in hands).
- **Three-player ties** share the third player's count, each half rounded down to a five.
- **A single All Fives hand** (target 0) is won by points, since the ends score during the hand.
- **Muggins** is All Fives with `spinner: none`; not a preset of its own.
- **The count of the ends is a coach help**, on by default and not a training help (everyone at a
  real table sees the layout), so lessons and drills that ask for the count do not show it.
- **The CPU's double-nine tuning** (pip weight, paired choice) applies only with the double nine, and
  the convention margin scales with the set's pips; with the double six every level chooses exactly
  as before.

## Shared files touched (small)

- `src/kits/tiles/domino.tsx` (pips for 7 to 9 and their colours), `line-layout.ts` (end markers
  now carry their end and come as a list; the cross layout; `fitLine` takes optional arms),
  `TileLayer.tsx` unchanged.
- `src/games/ladders.ts`: two ladders, `dominoes-all-fives` and `dominoes-cuban`.
- `src/text/en.ts` and `src/text/es/base.ts`: the Dominoes shelf lines (`game.dominoes.aka`,
  `game.dominoes.launch`) name the two styles.
- Existing Dominoes tests: the bots test's move encoder learned the arms and the set
  (`tests/unit/dominoes-bots.test.ts`), and the property test checks the set's pip total and every
  side's score (`tests/property/dominoes.property.test.ts`), since both iterate over every preset.
- Dominoes CSS for the new pieces is in its own file, `src/games/dominoes/ui/dominoes.css`.

## Not done, or open

- The Cuban ladder's level 4 against level 3 (above).
- Not implemented on purpose (see the rules document): drawing while holding a playable tile, an
  exact target, each side losing its own pips, scores divided by five, Five Up and Sniff, the Cuban
  side choosing its leader, Lankford's Cuban draw game.
- The ladder runner seats the two levels alternately, which suits two players or two partnerships;
  there is no ladder for All Fives with three players.
- No version bump, no APK (as asked); `PROGRESS.md` is untouched.
