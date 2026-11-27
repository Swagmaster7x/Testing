# M9. Mahjong I: the shared engine, and Hong Kong style to play

Built on 2026-11-27 in its own checkout while Texas Hold'em lessons and Chinese Checkers were
built on the main branch; to go into `PROGRESS.md` at the merge. Mahjong is playable; its Learn
and Practice doors (lessons, drills, the Table-ready track) are milestone 10.

- [x] **Rules first**: `docs/rules/mahjong-hk.md` (Hong Kong Old Style as implemented: the tiles,
      the turn, calls and their priority, kongs and robbing, winning shapes, the faan table with
      its limit hands, three point tables, payments, rounds; 19 options, 6 presets, the "ask
      before you sit" card, golden cases, "not implemented, on purpose", sources) and
      `docs/rules/mahjong-core.md` (the shared engine and the rules-file interface, and where each
      later style plugs in).
- [x] **The shared core** (`src/games/mahjong/core/`): tiles (43 kinds; tile ids such as `5p.2`;
      sets of 136, 144 and 108, jokers on top), winning shapes (n sets and a pair for 13 or 16
      tiles, seven pairs, thirteen orphans, every reading of a hand with the set the winning tile
      completed), tiles from ready and acceptance (`shanten.ts`), and the engine (`engine.ts`): the
      wall with a dead wall, the deal and flower replacement, draws and discards, calls in a claim
      window (asked one seat at a time in turn order, choices hidden until it closes, priority win >
      pung/kong > chow, several winners if the style allows), concealed, added and exposed kongs
      with replacement tiles, robbing an added kong (and a concealed one with thirteen orphans),
      the last discard, exhaustive draws, payments, the dealer keeping or passing the deal, the
      prevailing wind, the game's length and an eight-hands-a-round cap. Nothing in it names a
      style's pattern or value.
- [x] **The Hong Kong rules file** (`src/games/mahjong/styles/hong-kong.ts`): the faan table (all
      chows, all pungs, mixed and pure one suit, mixed orphans, seven pairs as an option, dragon
      pungs, seat and prevailing wind, small and great three dragons, small four winds, self-drawn,
      concealed, robbing a kong, win by a kong and a double kong, last tile, last discard, seat
      flowers, a full set, no flowers) and nine limit hands; the minimum (0, 1, 3), the limit (8,
      10, 13), half-spicy, full-spicy and old-style point tables, half-gun and full-gun payments,
      and every disputed value as an option.
- [x] **Behind the contract** (`src/games/mahjong/rules.ts`): `mahjong` with views that hold your
      hand, every discard, meld and flower and the counts, never another hand, the wall, the seed
      or a hidden call; `sample()`; JSON and readable notation (`5p`, `kong 5p`, `chow 3s`, `pung`,
      `win`, `pass`, `next`); outcome with places and scores; "play on from here"; `position()`
      for tests and lessons.
- [x] **CPU, five levels and three styles of play** (`src/games/mahjong/bots.ts`,
      `src/games/mahjong/strategy.ts`): novice, beginner (tiles from ready, a liking for honours,
      calls everything), learner (useful tiles, still fond of honours), club (steers to the style's
      scoring and the minimum, judges a ready hand by what it can win) and strong (expected points
      from the style's own point table, a one-draw look-ahead on every promising discard, calls
      judged the same way, and the cost of feeding a ready hand under the table's payments).
      Attacker, balanced and defender seats (fixed by the table number, revealed after the game)
      call and fear danger differently. Reason tags turn into "why" text in the log and the hint.
- [x] **The table** (`src/games/mahjong/ui/`): original tile art (coins, jointed bamboo, a bird
      for the one of bamboo, a framed white dragon, flower and season marks; the Chinese
      characters traced from LXGW WenKai TC, SIL OFL) readable at 844×390, and the learner overlay
      (number and suit letter, or letters, on every tile) as a coach switch, on by default. Your
      hand along the bottom (tap to lift, tap again to discard; the drawn tile apart), your melds
      beside it and your flowers at the left; each player's discards in front of them round the
      middle; the other hands, melds and flowers at the edges; the claim prompt says what each
      call takes (the tiles, with the discard outlined); Win and Kong buttons on your own turn; the
      end of a hand shows the winner's tiles, each faan line, the total, the base points and every
      payment, then Next hand. Animations come through the event queue like every table.
- [x] **Coach**: a three-step hint; tiles from ready and the useful tiles for every discard (in
      the rail, and as numbers above your tiles with the best discards marked); the tiles you
      have not seen, kind by kind (the tracker a real player keeps in their head); safe tiles
      against each player, with how ready each looks; tiles up. Every help but the learner tiles
      makes the game training.
- [x] **Review** (`src/games/mahjong/review.ts`): every discard judged by the top level "with what
      you knew": useful tiles lost, steps from ready, a ready hand that cannot win, value given up,
      danger, and when a discard fed someone's winning hand, the safer tile; missed wins; key
      moments with reasons; "play on from here".

## Gate: milestone 9 and the definition of done so far

| Item | Result |
| --- | --- |
| Tile conservation | Checked at every step of every random game (`checkConservation`: 144 or 136 tiles, each in exactly one place) and when any position is read |
| Faan golden cases for every pattern in the table | `tests/unit/mahjong-hk.test.ts`: 40 cases, every pattern alone, the stacking rules (named hands absorbing or counting their pungs, mixed orphans with all pungs, concealed and self-drawn under both settings), flowers, all nine limit hands, the minimum, the limit, the three point tables, payments under half-gun and full-gun, robbing, two winners |
| Claim-priority cases | `tests/unit/mahjong-engine.test.ts`: chow only to the next player; win > pung > chow with the beaten callers keeping their tiles; a pung beating a chow; seats skipped when they cannot beat a call; choices hidden while the window is open; two winners under `first` and `all` |
| The awkward rules | Same file: kong then a replacement-tile win, the double kong, an exposed kong then a win, robbing an added kong (on and off), thirteen orphans robbing a concealed kong, the last discard (only a win), an exhaustive draw paying nothing, the dealer keeping or passing the deal, the minimum, heavenly hand, the rounds |
| Property tests under every preset | `tests/property/mahjong.property.test.ts`: random games under all six presets and four odd mixes (one-hand and East-round games): nothing crashes, every legal action applies, tiles conserved, payments add up to zero and to the scores, views never leak a hidden tile, the seed or a hidden call, samples agree with the view, records replay to the identical state |
| Shanten checked against `syanten` | `tests/unit/mahjong-shanten.test.ts`: on 3,000 random hands ours is never higher and equal on more than 99%; each difference is a hand `syanten` reads greedily, and the test checks a real reading reaching our number; a second, plain search of our own agrees on every hand; seven pairs and thirteen orphans agree exactly; acceptance agrees wherever the shanten numbers agree |
| A full game in e2e | `tests/e2e/mahjong.spec.ts` at 844×390, 1180×820 and 1440×900: a hand to the end with its scoring and review, a call, the coach's helps, the reference card (12 passed) |
| `npm run check` | Typecheck, lint, 490 unit tests in 41 files, 39 property tests in 8 files, lesson lint: all pass |
| Screens | `tests/e2e/screens-m9.spec.ts` → `screenshots/m9/` (16 shots at 844×390, then the table at 390×844 and 1440×900), each looked at |
| At least four CPU levels pass the ladder | All five (table below) |

The ladder (`npm run ladder -- mahjong 120`: East-round games under the default rules, the level
under test in seats 0 and 2 against the other in 1 and 3, every deal played twice with the seats
swapped; a side scores when its two seats together won more points; pass at 0.6):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 91 | 29 | 0 | 0.879 |
| Level 2 against level 1 | 72 | 12 | 36 | 0.650 |
| Level 3 against level 2 | 93 | 5 | 22 | 0.796 |
| Level 4 against level 3 | 85 | 3 | 32 | 0.721 |
| Level 5 against level 4 | 74 | 2 | 44 | 0.625 |

## Decisions in M9

1. **Defaults follow the Old Style sources**: three faan to win, a 10-faan limit, the half-spicy
   table, half-gun payments (the discarder pays double, the others single; self-drawn, everyone
   pays double), flowers on, the first in turn taking a discard two players can win on, robbing an
   added kong allowed, the dealer keeping the deal after a win or a draw, an East-round game. Each
   is an option and the presets cover the common other tables.
2. **Disputed values became options**, not guesses: pure one suit 6 or 7, small three dragons 4
   or 5, great three dragons 8 or the limit, small four winds 6 or the limit, whether named
   dragon and wind hands also count their pungs, a full set of flowers 1, 2 or 3, no flowers 0 or
   1, concealed-and-self-drawn 2 or 3, seven pairs off, 3 or 4.
3. **Calls are a claim window inside the turn-based contract**: the seats that could call are
   asked in turn order after the discarder; their choices are hidden from the others until the
   window closes, so it plays like calling at once. A seat is not asked when nothing it could call
   would beat a call already made. The table hides who is being asked (`GameUi.shownTurn`) and
   other seats' choices (`GameUi.moveVisible`); the log names each line's owner
   (`GameUi.eventSeat`). The one tell left is a moment's pause, as at a real table.
4. **After a chow or pung you discard at once**; kongs are declared after a draw. Only a win may
   be called on the last discard.
5. **The scores wait for you**: a finished hand stays on the table with its faan until the first
   seat plays "Next hand" (the CPU goes on at once in CPU-only games and ladders).
6. **A game ends after eight hands a round** as well as after its rounds, so a dealer who keeps
   the deal on drawn hands cannot make a game endless.
7. **The first dealer is drawn by lot from the seed**; you sit at the bottom, the next player on
   your right. Other players' hidden tiles stay in the order they were drawn (as an unsorted
   rack), so where a discard comes from says no more than at a real table.
8. **Tile ids carry their copy** (`5p.2`), so every tile slides from wall to hand to discard to
   meld, conservation is a set check, and a test can search a view for a tile it must not hold.
   Actions name kinds only.
9. **Our shanten is exact for its formula; `syanten` is an oracle with known gaps**: it reads
   each suit greedily (most complete sets first) and on about one hand in a hundred and fifty
   reports one more than the true number. The tests require ours never to be higher, equal on
   nearly every hand, and back every difference with a real reading.
10. **The CPU reads the rules file, never pattern names**: a style gives `hints` (the minimum and
    limit, what a pung of each kind is worth, one-suit and all-pungs values, concealed and
    self-draw values, flowers already held, the point table, what each loser pays). One bot
    family therefore plays every later style; Riichi will add riichi and furiten knowledge.
11. **Five levels, measured**: an early design with folding by rules of thumb and sampled
    draws did not separate (folding barely pays when the discarder pays only double; sampled
    draws were slow and no better). Expected points with a one-draw look-ahead did, and the
    beginner habits (a liking for honours, calling everything) made the lower rungs. Strength
    comes from knowledge and fixed look-ahead budgets, never time; the top level's slowest
    decision in the unit test is under 0.7 s here.
12. **Learner tiles are on by default and are not a training help**: they only label the tiles.
    The efficiency helper, the unseen-tile tracker, safe tiles, tiles up and hints mark the game
    as training.
13. **The characters come from LXGW WenKai TC** (OFL 1.1), a regular-script face that reads like
    real tiles, traced once into 24 SVG paths (`scripts/mahjong-glyphs.mjs`); no font ships.
14. **Small shared changes, each optional for other games**: three `GameUi` hooks (`moveVisible`,
    `shownTurn`, `eventSeat`) used by the table, the review and the log; a hub door for a shelf
    game that has no lessons yet says they are on the way (was "None for the test table");
    `outcomePoints` rounds its share, so a four-way tie is exactly a half (it was a hair under,
    and a drawn mahjong hand read as a loss); and card and tile tables held upright on a phone
    (`src/styles/cards.css`) get a 3:4 table with the players and the coach below at their own
    heights (the stacked layout had left these tables no height at all, in every card game).
15. **The CPU's reasons at the table are only the public ones** (a win, a kong, a call for value
    or for speed). "Gets ready", "folds" or "a lone tile" would say what is in a hidden hand; the
    hint and the review, which only ever speak about your own hand, keep every reason.
16. **The table scales with the screen**: tiles grow on a tablet or laptop up to a cap; on a
    narrow table the middle box shortens its text ("East 1", "Pick a tile to discard") and the
    tag across moves below that player's rack rather than cover it.

## Not done in M9, or open

- **Learn and Practice** (lessons from zero, the Hong Kong track, Table-ready, drills for waits,
  discards, naming and scoring patterns and safe tiles; the auto-scoring switch) are milestone 10.
- **Responsibility payments** (*bau*), **flower hands** (seven robbing the eighth, eight winning at
  once), **passing a winning discard** and **false-win penalties** are not implemented (see the
  rules document); each is small to add as an option.
- **Rules were read through search-engine extracts**: direct fetches of en.wikipedia.org and a
  few rule sites were refused by this environment's network policy; values were cross-checked
  across sources and every disagreement became an option. Corrections from a real Hong Kong table
  are one option change each.
- **Phone speed** of the top level is estimated from this machine (under 0.7 s for its slowest
  decision); no APK was built in this checkout, as instructed.
- **Ratings are nominal** (400 to 1250), not yet checked against people.
