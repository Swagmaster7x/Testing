## M14b. Mahjong: Chinese Official, then Taiwanese

Built on 2026-11-27 and 2026-11-28 in its own checkout, while Sichuan and American were built in
another; to go into `PROGRESS.md` at the merge. Two more rules files on the shared Mahjong engine,
one after the other, each finished and committed before the next was started.

### Chinese Official (competition rules, MCR)

- [x] **Rules document first** (`docs/rules/mahjong-chinese-official.md`): 144 tiles with flowers,
      13-tile hands, no dead wall, the deal passing after every hand and sixteen hands to a game;
      every one of the 81 patterns with its points and the patterns it leaves out; the principles
      (non-repeat, non-separation, non-identical, high versus low, account once and its "each set
      twice" reading); the eight-point minimum that flowers never count toward, and the Chicken
      Hand; one winner on a discard; the settlement; 7 options, 5 presets, an "ask before you sit"
      list, golden cases, "not implemented" and dated sources.
- [x] **Rules file** (`src/games/mahjong/styles/chinese-official.ts`), registered in `STYLES`: the
      pattern table `CO_FAN` (one table for the scorer, lessons, drill and reference card), the
      exclusions `CO_EXCLUDES`, a scorer that reads every arrangement of the hand and keeps the best
      (chow and pung patterns of four, three and two sets chosen under the principles; the waits
      only when one kind of tile could win), the minimum, the settlement, and the CPU's hints.
- [x] **Golden cases** (`tests/unit/mahjong-chinese-official.test.ts`, 27 tests): the table of 81;
      the Chicken Hand with and without flowers; flowers never reaching the minimum; Mixed Triple
      Chow with the fourth chow joining once; Pure Straight leaving out Short Straight; Mixed
      Straight; Seven Pairs with four alike and Tile Hog; Seven Shifted Pairs; Thirteen Orphans;
      Nine Gates; Big Three Dragons; Little Four Winds with seat and round winds; a non-seat wind
      pung; the knitted straight; lesser, greater and lesser-with-straight honours and knitted
      tiles; concealed pungs on a discard and a self-draw; the three waits only when unique;
      Melded Hand; the kong patterns and both kong options; account once (official and "twice");
      Last Tile, Robbing the Kong, Last Tile Draw; the settlement; shanten and waits for the knitted
      shapes; and on the engine, 144 or 136 tiles, the minimum at the table, the deal passing after
      the dealer wins, a sixteen-hand game with four hands a round, one winner on a discard.
- [x] **Property tests** (`tests/property/mahjong.property.test.ts`): random games under all five
      presets and two odd mixes, and sixteen games played toward winning in which every win has
      eight points without flowers and pays 8 + x as the rules say; tiles conserved, payments add
      up, no leaks, records replay.
- [x] **The table**: the presets and the style's own option fields in the play dialog; "Win (hu)"
      and "Win (zimo, self-drawn)"; the sheet in points with what the winner collects; "Count it
      yourself" asks for points; the counters say "8 points, flowers aside"; the log gives the
      points.
- [x] **CPU** (`bots.ts` unchanged; the style's hints): pung values (dragons, seat and round winds,
      terminal and wind pungs), half and full flush, all pungs, all chows, concealed and
      self-drawn, the minimum, a linear point table, who pays; and the new `goals` (mixed triple
      chows, mixed and pure straights, knitted straights) so the steering levels aim for eight.
- [x] **Ladder** `mahjong-chinese-official` (table below): all five levels pass.
- [x] **Learn** (`src/games/mahjong/learn/chinese-official.ts`, stage 4 after Riichi): what changes
      (the minimum, flowers, the deal, one winner), patterns that reach eight, patterns that do not
      add up (the principles), knitted tiles, settling up. Five lessons; every number from the
      rules file and the scorer; all pass the linter.
- [x] **Drill** (`src/games/mahjong/practice/chinese-official.ts`): "Count the points": a winning
      hand built toward a pattern that reaches eight (mixed triple chow, mixed or pure straight,
      half flush, all pungs) with up to two flowers; name the pattern, count the points, then what
      the table pays, each answer from the scorer and the settlement.
- [x] **Calculator**: Chinese Official appears by itself; "The last of its kind" (shown only for this
      style) feeds Last Tile; the total reads in points; "Base" is shown only for faan and han.
      Unit cases in `tests/unit/mahjong-calculator.test.ts`, an e2e case in `tests/e2e/tools.spec.ts`.
- [x] **Reference card**: what changes, the 81 patterns by points (from the rules file), settling
      up, questions before you sit.
- [x] **Text**: every new string in English and Spanish (`src/text/games/mahjong.ts`,
      `src/text/es/games/mahjong.ts`, `tools.calc.*` in `en.ts` and `es/base.ts`); the Spanish
      coverage test passes.
- [x] **e2e** (`tests/e2e/mahjong-chinese-official.spec.ts`, 6 tests, at 844×390, 1180×820 and
      1440×900: 18 passed): a hand against level 2 to the end with the points or the drawn hand and
      the review; an axe scan of the table (no serious or critical findings); the settling-up
      lesson; the drill; the rules dialog; the reference card. The calculator case in `tools.spec.ts`
      passes at all three sizes.
- [x] **Screenshots** (`tests/e2e/screens-m14b.spec.ts` → `screenshots/m14b/co-*.png`, 17 shots),
      each looked at.

Gate for Chinese Official (2026-11-28): `npm run check` green (typecheck, lint, 815 unit tests in
64 files, 60 property tests in 11 files, the lesson lint for all games: Mahjong now 42 lessons, 12
in stage 4). The Mahjong e2e suites again after the shared changes (`mahjong.spec.ts`,
`mahjong-riichi.spec.ts`, `mahjong-learn.spec.ts` and the new spec, three sizes): 60 passed.

The ladder (`npm run ladder -- mahjong-chinese-official 120`: one East round of four hands under
the official rules; the level under test in seats 0 and 2 against the other in 1 and 3, every deal
played twice with the seats swapped; a side scores when its two seats together end with more
points; pass at 0.6):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 78 | 36 | 6 | 0.800 |
| Level 2 against level 1 | 72 | 12 | 36 | 0.650 |
| Level 3 against level 2 | 85 | 2 | 33 | 0.717 |
| Level 4 against level 3 | 76 | 1 | 43 | 0.637 |
| Level 5 against level 4 | 75 | 0 | 45 | 0.625 |

### Changes to the shared core for Chinese Official, and why

Each is off unless a style asks for it, so the Hong Kong and Riichi files and their tests did not
change. Nothing in the core names a Chinese Official pattern.

1. **Two kinds of shape** (`core/shapes.ts`, `core/arrange.ts`, `core/shanten.ts`):
   `ShapeRules.sevenPairsFours` (seven pairs may use four alike as two pairs) and
   `ShapeRules.knitted` (a knitted straight standing for three sets, and honours with knitted
   tiles). Which hands are complete, which tiles a hand waits on, every reading of a winning hand
   and tiles from ready are all the core's, and a style cannot reach into them. The knitted
   straight is read like a standard hand with three sets already made (a reading marks a win on a
   knitted tile as such); its tiles from ready are the knitted tiles still missing plus the rest's
   standard count.
2. **`WinContext.shown`**: the copies of the winning kind face up on the table (discards still
   lying, called sets; a concealed kong lies face down), worked out in `engine.winContext`. "Last
   Tile" needs it, and only the engine sees the table when a hand is won.
3. **`ValueHints.goals`** (read by `strategy.valueEstimate`): patterns given as the tiles they need
   and what they are worth; the CPU steers toward the closest. Most Chinese Official hands reach
   eight points through chow patterns (mixed triple chow, the straights, the knitted straight)
   that the existing hints (pung values, one suit, all pungs) could not describe; without them the
   steering levels could not tell a hand heading for eight from one that would never win.

Outside the core (all additive): `ui/names.ts` (a value in its style's unit; Mandarin call words for
the Mandarin styles), `ui/MahjongSurface.tsx` (the call words, the sheet in points, counting it
yourself in points, "on your discard" where every style read "on You’s discard"), `ui/index.tsx`
(presets, the style's own option fields, counters, the log, the reference card), the calculator,
`learn/game.ts` (the lesson style type widened to any id; the Chinese Official numbers), the
lesson, practice and ladder lists, the text catalogues (the stage 4 blurb now names the style
tracks), and one pattern in the e2e helper so "Win (zimo" is clicked like "Win (zi mo".

Two more general mechanisms came in with these files and are used by Taiwanese (below): the
`pairsAndPung` shape and `WinContext.counter`.

### Decisions for Chinese Official

1. **Pattern ids carry a `co-` prefix** (`co-seat-wind`), so their names never collide with the
   Hong Kong patterns of the same name and each style's sheet reads in its own words.
2. **The principles as one table**: each pattern lists every pattern it implies (the rulebook's
   "not counted" lists, plus what follows from them); patterns are taken highest first and a
   pattern is left out only by one that is itself counted. A pattern that is closed by definition
   (seven pairs, thirteen orphans, nine gates, four concealed pungs, the honours-and-knitted
   hands) leaves out both Concealed Hand and Fully Concealed Hand, so when self-drawn it scores
   Self-Drawn.
3. **Account once, as written**: three chows make at most two two-chow patterns and four at most
   three, never in a loop; after a three-chow pattern the fourth chow joins one of the three once.
   The "each set in two patterns" reading is an option. The same for mixed double pungs.
4. **Two Concealed Kongs is 6** (the 1998 and 2006 rulebooks); 8, the 2014 change the source
   mentions, is an option. **One melded and one concealed kong is Two Melded Kongs** (4), as the
   source reads; Melded Kong and Concealed Kong (1 + 2) is an option.
5. **Nine Gates needs 1112345678999 waiting**, then any tile of the suit.
6. **Last Tile** counts the discards still lying and the called sets, not concealed kongs (face down
   at a real table, though the app shows them).
7. **The default game is sixteen hands**, as the rulebook says; one round and one hand are presets.
   The ladder plays one round of four hands, which already separates the levels.
8. **Lessons play a one-hand table** with flowers in play, and the flowers each lesson needs are
   named so none land in your hand by chance.
9. **The shelf's subtitle** ("Hong Kong and Riichi styles") is left as it is: the Sichuan and
   American builder changes the same line, so it is for the merge.

### Not done for Chinese Official

- **The rulebook itself could not be read here**: the EMA and Danish rulebook PDFs and the rule
  sites were refused by the network policy. The patterns, values and "not counted" lists come from
  a Wikipedia draft of the old Guobiao article that cites the EMA rulebook, checked against
  search-engine extracts; the readings sources disagree on are options.
- False-win penalties, players changing seats at each round, and throwing a flower without a
  replacement (see the rules document).
- The reviewer and the hint judge Chinese Official hands with the shared CPU, which steers by the
  hints and the goals; it does not plan the rarer patterns (shifted pungs, all fives, reversible
  tiles) unless the hand falls into them.

### Taiwanese (16-tile)

- [x] **Rules document first** (`docs/rules/mahjong-taiwanese.md`, written before the rules file):
      144 tiles with flowers; sixteen tiles a hand and seventeen to the dealer; five sets and a pair,
      and lik gu lik gu (seven pairs and a pung); the last 16 tiles never drawn; the dealer keeping
      the deal after a win or a drawn hand, with its streak; several winners on one discard; seat
      flowers and sets of four; eight flowers and seven robbing one; every tai pattern with its
      value; payments of a base and a stake per tai, the dealer's 1 + 2 × streak tai on its own
      wins and when it pays; 12 options, 5 presets, an "ask before you sit" list, golden cases,
      "not implemented" and dated sources.
- [x] **Rules file** (`src/games/mahjong/styles/taiwanese.ts`), registered in `STYLES`: the tai
      table `TW_PATTERNS`/`twTai` (one table for the scorer, lessons, drill and reference card), a
      scorer that reads every arrangement and keeps the best, the minimum (none by default), the
      payments, the dealer keeping the deal and the streak as the counter, and the CPU's hints (in
      tai, with the base worth base / per-tai tai, and the feeder paying the whole hand).
- [x] **16 + 1 tiles everywhere**: the engine already sized hands from `handSize`; checked in the
      deal, the shapes and readings (five sets), tiles from ready, the CPU, lesson positions (the
      lesson verifier no longer insists on 13-tile hands; its size check already followed the
      style), the drill builder (five sets), the table (seventeen tiles fit at 844×390) and the
      calculator's `tilesWanted` (17 and one more for each kong; unit and e2e cases).
- [x] **Ladder** `mahjong-taiwanese` (table below): four levels pass; level 5 does not separate.
- [x] **Golden cases** (`tests/unit/mahjong-taiwanese.test.ts`, 20 tests): the 16-tile shapes and
      lik gu lik gu with their tiles from ready; concealed, self-drawn and both (3 or 2); flowers
      taking away all chows, seat flowers and a set of four; the one-tile wait; three, four and five
      concealed pungs with a pung completed by a discard left out; flushes, dragon and wind pungs,
      little and big dragons and winds; all honours (16 or 8) without all pungs; lik gu lik gu on
      and off; the dealer's tai with a streak; the flower wins; a minimum; payments on a discard
      and a self-draw, at other stakes, a dealer paying with its streak, two winners on one discard;
      and on the engine, the deal of sixteen, the hand drawn with sixteen tiles left and the dealer
      keeping the deal with the streak, eight flowers winning at once, seven robbing the eighth
      paid by the drawer, two winners and the winning dealer keeping the deal.
- [x] **Property tests**: random games under all five presets and two odd mixes, and sixteen games
      played toward winning (the strategy now reads the style's own shapes and hand size) checking
      the payment of every single win; contract, conservation, no leaks, replay.
- [x] **The table**: the presets and option fields; "Win (hu)" and "Win (zimo, self-drawn)"; the
      sheet in tai with the dealer and repeat-deal lines; the counters show the dealer's repeat deals
      and the stakes; the log in tai.
- [x] **Learn** (`src/games/mahjong/learn/taiwanese.ts`, stage 4 after Chinese Official): what
      changes, counting tai, the dealer and repeat deals, flowers, paying base and tai. Five lessons;
      all pass the linter.
- [x] **Drill** (`src/games/mahjong/practice/taiwanese.ts`): "Count the tai": a 16-tile winning
      hand, sometimes yours as dealer on repeat deals or paid by a dealer on them, with flowers;
      count the tai, then what you collect at 100/20.
- [x] **Calculator**: Taiwanese by itself; "Dealer's repeat deals" (shown only for this style) feeds
      the dealer's tai; totals in tai. Unit cases and an e2e case.
- [x] **Reference card**: what changes, the tai by value (from the rules file), payments with the
      dealer's tai, questions before you sit.
- [x] **Text** in English and Spanish; the stage 4 blurb names the Taiwanese track.
- [x] **e2e** (`tests/e2e/mahjong-taiwanese.spec.ts`, 6 tests at 844×390, 1180×820 and 1440×900:
      18 passed): a 16-tile hand against level 2 to the end with the tai or the drawn hand and the
      review; an axe scan of the table (nothing serious or critical); the dealer lesson; the drill;
      the rules dialog; the reference card. The calculator case in `tools.spec.ts` passes at all
      three sizes.
- [x] **Screenshots** (`screenshots/m14b/tw-*.png`, 15 shots, among them the table upright, on a
      tablet and on a laptop), each looked at.

Gate for Taiwanese (2026-11-28): `npm run check` green (typecheck, lint, 838 unit tests in 65
files, 61 property tests in 11 files, the lesson lint: Mahjong 47 lessons, 17 in stage 4). Every
Mahjong e2e spec and the tools spec at three sizes after both styles (`mahjong.spec.ts`,
`mahjong-riichi.spec.ts`, `mahjong-learn.spec.ts`, `mahjong-chinese-official.spec.ts`,
`mahjong-taiwanese.spec.ts`, `tools.spec.ts`): 102 passed. `screens-m14b.spec.ts`: both styles'
shots taken again after the last changes and looked at.

The ladder (`npm run ladder -- mahjong-taiwanese 120`: one East round under the common table's
rules, the dealer keeping the deal through draws, so a game runs up to sixteen hands; paired
games, side scores, pass at 0.6, as for Chinese Official):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 118 | 2 | 0 | 0.992 |
| Level 2 against level 1 | 85 | 1 | 34 | 0.713 |
| Level 3 against level 2 | 82 | 1 | 37 | 0.688 |
| Level 4 against level 3 | 79 | 3 | 38 | 0.671 |
| (Level 5 against level 4) | 57 | 6 | 57 | 0.500, fails |

Four levels pass; level 5 is left off the Taiwanese rungs (`mahjong-taiwanese` stops at level 4,
as `mahjong-riichi` does). At this table the base stake (100, against 20 a tai) makes a quick
cheap win worth nearly as much as a slow big one, so level 5's weighing of value buys little over
level 4's speed: in the probe, level 5 won every hand of two games but averaged 1.4 tai. Three
trials of 60 paired games on other seeds (`scripts/mahjong-hint-trial.ts`) with the feeding weight
at 0.3 (as shipped) and at 1, and with the expected points scaled up threefold, all scored 0.51
to 0.53. Separating level 5 here would need Taiwanese-specific play (pushing the dealer's repeat
deals, calling more freely for speed), not just different weights; it is listed under "Not done".

### Changes to the shared core for Taiwanese, and why

1. **Wins by the bonus tiles** (`rules().flowerWins`, `WinContext.flowerWin`, `engine.flowerWin`):
   all eight set aside win at once, paid as a self-draw; seven held win when another seat sets
   aside the eighth, which that seat pays. Only the engine sets bonus tiles aside (in the deal and
   on every draw), so only it can see the moment; the hand need not be complete, so the check
   cannot go through the shape rules. The style scores the win (`flowerWin` in the context).
   Seven robbing one is claimed at once (a robber may decline at a real table; nobody does).
2. **Seven pairs and a pung** (`ShapeRules.pairsAndPung`, in the shape checks, the readings and
   tiles from ready; it came in with the Chinese Official commit): lik gu lik gu is a closed shape
   of seventeen tiles that is not sets and a pair.
3. **The counter in the win context** (`WinContext.counter`; it also came in with the Chinese
   Official commit): the dealer's streak is the Riichi counter's mechanism (`nextCounter`), but
   Taiwanese scores it inside the hand (the dealer's tai on its own win), so the scorer needs it.
   `settle` already received the counter for a dealer who pays.

Outside the core: `learn/verify.ts` no longer refuses lesson positions that are not 13-tile hands
(its size check already followed the style's hand size); `learn/game.ts` places the flowers a
lesson names whenever the style's tile set has bonus tiles (it looked for a "flowers on" option,
which Taiwanese does not have); `practice/build.ts` builds five sets on request; the property
tests' "toward winning" strategy reads the style's own shapes and hand size (it assumed four sets).

### Decisions for Taiwanese

1. **Defaults are the common table**: 100 a hand and 20 a tai, no minimum, the dealer keeping the
   deal after a win or a draw, several winners on one discard, concealed-and-self-drawn 3 tai, all
   honours 16, lik gu lik gu and the flower wins played, robbing a kong allowed, 16 tiles left at
   the end, one East round. The strict-table preset turns the usual ones the other way.
2. **The dealer's tai are lines of the hand** when the dealer wins ("Dealer 1", "Repeat deals
   2 × n"), so the sheet's total is what is paid; a dealer who pays adds 1 + 2 × streak to its own
   payment only, as the Wikipedia description says.
3. **Named hands take in their parts**: little and big dragons and winds leave out the dragon and
   wind pungs they contain; all honours leaves out all pungs; heavenly, earthly and human hands
   leave out the concealed, self-drawn and wait tai; all melded leaves out the one-tile wait; a set
   of four flowers holds its seat flower.
4. **All chows** needs five runs, a suit pair, no flowers, a win on a discard and a wait on more
   than one tile, as most tai tables describe it.
5. **Pattern ids carry a `tw-` prefix**, like Chinese Official's `co-`.
6. **Heavenly 24, earthly 16, human 16** are fixed values (sources range from 8 to 64); the "ask
   before you sit" list asks about them.
7. **The interface never says "streak"** (the app's rule against streak counters, which a test
   enforces on the English catalogue): the dealer's 連莊 reads "repeat deals" on the sheet, the
   counters, the calculator, the reference card and in the lessons. The rules document and the
   code keep "streak".
8. **Lessons vary where the right answer sits** in a choice (both new tracks): the
   earlier tracks list it first, which a careful student can spot.

### Not done for Taiwanese

- No rule site for Taiwanese was reachable; the values come from Wikipedia's description of the
  scoring and payments and from search-engine extracts of tai tables, and every disputed one is an
  option or in "ask before you sit".
- Kong payments made at once, false-win penalties, declaring ready at the start, and the dealer's
  streak paid to whoever ends it beyond the 1 + 2 × streak tai (see the rules document).
- The calculator does not score the flower wins (they need no hand); it scores complete hands.
- **Level 5 is not stronger than level 4 at a Taiwanese table** (0.500 on the ladder's seeds,
  0.51 to 0.53 in three trials), so the Taiwanese ladder has four rungs; see the ladder above.

### Shared files touched (for the merge with the Sichuan and American checkout)

Each edit is small and additive: entries appended, no reordering.

- `src/games/mahjong/rules.ts`: two imports and two entries in `STYLES`.
- `src/games/ladders.ts`: two imports and two ladder keys at the end of `buildLadders`.
- `src/games/mahjong/learn/index.ts`, `practice/index.ts`: two tracks and two drill lists appended.
- `src/games/mahjong/ui/index.tsx`: presets appended; one option-prefix map; a counters branch per
  style; reference sections added before the CPU levels; two helper functions.
- `src/games/mahjong/ui/Calculator.tsx`: two style flags and their inputs; the total through
  `valueName`; "Base" only for faan and han.
- `src/games/mahjong/ui/MahjongSurface.tsx`, `ui/names.ts`: the unit-aware sheet, count prompt and
  call words (helpers `valueName`, `unitOf`, `mandarin`); "on your discard".
- Text: blocks appended at the end of `src/text/games/mahjong.ts` and
  `src/text/es/games/mahjong.ts`; four `tools.calc.*` keys after `tools.calc.style.riichi` in
  `en.ts` and `es/base.ts`; the stage 4 blurb rewritten in both (it now names the style tracks;
  the other checkout will want to add its own).
- Tests: `tools.spec.ts` (two cases appended), `mahjong-helpers.ts` (one regular expression),
  `mahjong.property.test.ts` (configs appended; the "toward winning" strategy reads each style's
  shapes), `mahjong-learning.test.ts` (the stage 4 style check maps track prefixes to styles),
  `mahjong-calculator.test.ts` (cases appended).
- Core (`core/*.ts`, `strategy.ts`, `learn/game.ts`, `learn/verify.ts`, `practice/build.ts`):
  described above; every addition is off unless a style asks for it.
