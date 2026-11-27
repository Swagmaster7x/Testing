# M11. Mahjong III: Riichi

Built on 2026-11-27 in the same checkout as M9 and M10, after merging the main branch (Brisca for
four); to go into `PROGRESS.md` at the merge. Riichi is the second rules file on the shared
Mahjong engine, and meets the definition of done as a style.

- [x] **Rules document and rules file** (`docs/rules/mahjong-riichi.md`,
      `src/games/mahjong/styles/riichi.ts`): 136 tiles with three red fives; riichi with its stick,
      double riichi and ippatsu; furiten (discard, temporary and riichi); dora, kan dora (at once or
      after the next throw), ura dora and red fives; every yaku and yakuman, han and fu, mangan to
      counted yakuman, the payment table; the East-South game with honba and riichi sticks, the
      South and West extensions, busting and the last dealer stopping; drawn hands (noten payments,
      nagashi mangan) and the four abortive draws; two (or three) winners on one tile. Defaults
      follow the common online rules (red fives, open tanyao, 25,000 to start); every rule tables
      disagree on is one of 19 options; four presets (common online, East only, a stricter club
      table, one hand); an "ask before you sit" list; golden cases and dated sources.
- [x] **Golden cases** (`tests/unit/mahjong-riichi.test.ts`, 24 tests): scoring (pinfu tsumo and
      ron, seven pairs, riichi with ippatsu and ura, double riichi, open tanyao and its option, no
      yaku, fu cases and the double-wind pair option, 4 han 30 fu with and without kiriage, counted
      yakuman and its cap, dealer baiman, big three dragons, thirteen orphans on a thirteen-way wait
      and the double-yakuman option, red fives, the dora order, payments); the engine (riichi's
      conditions and stick, the stick not paid when the riichi tile is won on, discard furiten with
      a self-draw still allowed, temporary and riichi furiten, double ron with honba and sticks,
      three winners under each of the three options, swap calling, kan dora, exhaustive-draw
      payments with the counter and the deal, nagashi, nine terminals, four winds, the start
      score, the indicators, the end of the game).
- [x] **The scorer cross-checked against the `riichi` package**
      (`tests/unit/mahjong-riichi-crosscheck.test.ts`): 1,500 generated winning hands (closed and
      open, ron and tsumo, dealer or not, riichi, dora), compared on yaku, han, fu and points: 1,494
      agree. The six that differ are two kinds of fu the package gets wrong, each checked by the
      test against the rule: an edge wait (penchan, 1-2 waiting on 3 or 8-9 waiting on 7) earns
      2 fu, which the package leaves out; and a called chow whose middle tile was the claimed one
      is not a closed wait for the winning tile, which the package counts as one. `riichi` 1.2.0 is
      pinned as a dev dependency only and listed in `THIRD-PARTY.md` as not shipped.
- [x] **Property tests** (`tests/property/mahjong.property.test.ts`): random games under the four
      Riichi presets and two odd mixes besides the Hong Kong ones, and games played toward
      winning that declare riichi whenever they may: legal actions apply, tiles are
      conserved with the indicator tiles, scores plus riichi sticks always add up to four starting
      stacks, each hand's payments equal the sticks it collected, views never show an unturned
      indicator, records replay.
- [x] **The table**: Riichi presets and their own option fields in the play dialog; red fives;
      Ron, Chi and Pon on the claim prompt; Tsumo; the Riichi switch, which leaves bright only the
      throws that keep the hand ready; the riichi tile on its side (the next one when it is
      called); a Riichi mark on the seat and a Furiten badge on yours; the dora indicator, honba
      and sticks in the middle; han and fu with the band on the sheet, the indicators and ura dora,
      who was ready at a drawn hand, the abortive-draw reasons, and the final scores apart from
      the last payments; the counters (round, wall to draw, the dora, honba, sticks, each score);
      "Count it yourself" asks for han.
- [x] **CPU** (`src/games/mahjong/bots.ts`): riichi decisions (a beginner half the time, levels 2
      and 3 whenever ready with tiles left, levels 4 and 5 staying quiet when every wait already
      scores four han on a discard); folding against a riichi from level 3 (a hand two tiles from
      ready gives up, or one tile with little value at level 4 and up; a defender sooner), throwing
      the safest tile, where tiles the riichi player threw are safe for good; yaku-aware calls
      (the strong levels decline a call that leaves no yaku, take one that keeps tanyao, and every
      level takes a dragon pung); the win estimate counts the dora turned up. Tests in
      `tests/unit/mahjong-bots.test.ts` (4 new).
- [x] **Learn** (`src/games/mahjong/learn/riichi.ts`, stage 4): what changes from Hong Kong, the
      ten yaku you will meet most, riichi, furiten, dora and red fives, han and fu with the
      payment table, defence against a riichi. Seven lessons on Riichi tables; every number from
      the Riichi rules file (the yaku table `YAKU_HAN` and the fu table `FU` are now exported and
      the scorer reads them too), the dora and the win on offer from the scorer; the safe-tile
      claim proved by the coach's ranking against a declared riichi.
- [x] **Practice** (`src/games/mahjong/practice/riichi.ts`): name the yaku, han and fu (han with
      dora, fu, then what it collects), and the safe tile against a riichi, generated on the spot.
- [x] **Reference card**: Riichi: what changes, the yaku by han (from the rules file), fu, the
      payment table (computed by the scorer), words, and questions before you sit.
- [x] **Ladder**: a second key, `mahjong-riichi` (table below).

## Gate

| Item | Result |
| --- | --- |
| Rules file and document, with options, presets, ask before you sit, golden cases and dated sources | `styles/riichi.ts`, `docs/rules/mahjong-riichi.md` |
| Scorer cross-checked against `riichi` on generated hands, dev dependency only, in THIRD-PARTY.md | 1,494 of 1,500 agree; the six differences are the package's, explained and checked |
| Golden cases for furiten and multiple ron | `tests/unit/mahjong-riichi.test.ts`: discard, temporary and riichi furiten; double ron with honba and sticks; three winners under each option |
| Shared core changed only with a written note | Below, "Changes to the shared core" |
| Bots: riichi decisions, folding against a riichi, yaku-aware calls | `bots.ts`, tests above |
| Learn track and practice | 7 lessons (stage 4), 3 drills; lesson lint passes |
| e2e at the three sizes, `screens-m11` looked at | `tests/e2e/mahjong-riichi.spec.ts` (a Riichi hand to the end with the indicator, han and fu or the drawn hand, and the review; declaring riichi; the Riichi rules in the play dialog; the reference card) at 844×390, 1180×820 and 1440×900: 12 passed. `mahjong.spec.ts` and `mahjong-learn.spec.ts` again: 30 passed. `screens-m11.spec.ts` → `screenshots/m11/` (22 shots), each looked at |
| A ladder rung set under Riichi rules | `npm run ladder -- mahjong-riichi 120`, table below |

The ladder (`npm run ladder -- mahjong-riichi 120`: East-South games, the Riichi default, under
the common online rules; the level under test in seats 0 and 2 against the other in 1 and 3, every
deal played twice with the seats swapped; a side scores when its two seats together end with more
points; pass at 0.6):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 119 | 1 | 0 | 0.996 |
| Level 2 against level 1 | 94 | 0 | 26 | 0.783 |
| Level 3 against level 2 | 81 | 2 | 37 | 0.683 |
| Level 4 against level 3 | 85 | 0 | 35 | 0.708 |

Four levels pass. Level 5 is left off the Riichi rungs: against level 4 it scores about 0.61 at
this table (0.579 on the ladder's own seeds, and 0.53 to 0.72 on four other samples of 80 to 120
games, 0.61 over 480 games), short of the margin. The first run showed why it was weaker still
(0.400): its weight on the cost of feeding a ready hand was tuned where the feeder pays twice the
base, and at Riichi the feeder pays the whole hand, so it folded twice as often as level 4 and won
less than half as many hands. Scaling that weight (`riskScale`) and the Riichi guide points
brought it to about 0.61, ahead of level 4 in points but not by the margin. A single East round
separated the levels less (level 5 against level 4 about 0.58), so the rungs play the default
East-South game. Variations tried on 100 to 120 games each (calling more, a heavier or lighter
weight on expected points or on risk, no folding rule, riichi at every chance) did no better. The
Hong Kong ladder is unchanged: its CPU reads none of the new hints, and its side score gives the
same results as before.

## Changes to the shared core, and why

The Mahjong core (`src/games/mahjong/core/`) gained general mechanisms, each off unless a style
asks for it, so the Hong Kong file and its tests did not change (one line: Hong Kong names its
`scoreAny`). Nothing in the core says "riichi", "dora" or "honba".

1. **A ready declaration with a stake** (`rules().ready`, the `ready` action and event, the
   `ready` marks in the state). Riichi needs a declaration made with a discard, a stake paid when
   the throw passes, and a hand locked afterwards. It is described generally (a stake, the lowest
   score to declare, the tiles that must be left in the wall), because no other style's rules
   file can reach into the turn; the locked hand (only a win or a kong that keeps the waits) is
   the engine's, as only the engine lists options.
2. **Furiten** (`calls.furiten`, `engine.furiten`, the `missed` marks). Which wins a seat may call
   is decided in the claim window, which only the core runs. Three cases: a winning tile in your
   own discards, a win passed since your last throw, and a win passed after a declaration.
3. **Indicator stacks** (`rules().indicators`, `kongIndicator`, `state.indicators`). The tiles are
   set aside at the deal and turned during play (at once, or after a kong's next throw): only the
   engine deals and turns tiles. The core keeps them, shows the turned ones in every view and
   hides the rest; the rules file decides what they mean (`doraOf`).
4. **Swap calling** (`calls.noSwapCall`). After a call the caller's discard options are the
   engine's; a style can now forbid the tile just taken and the run's other end.
5. **Abortive draws and a cap on winners** (`rules().aborts`, `calls.maxWinners`, the `abort`
   action and event). Nine terminals is a choice on your first turn, four winds, four riichi and
   four kongs end the hand where it stands, and three winners on one tile end it unpaid: all are
   points in the turn only the engine sees.
6. **Starting scores, a repeat counter and stakes on the table** (`startScore`, `state.counter`,
   `state.stakes`). The game needs them between hands; the rules file says what they are worth
   (`settle` receives them).
7. **Style hooks** (`settleDraw`, `nextCounter`, `gameOver`, `scoreAny`; `dealerKeeps` now takes a
   `HandEnd`: who won, the dealer, a drawn or abortive hand, who was ready). A drawn hand can pay,
   the counter can grow or reset, the game can end early (a bust, the last dealer stopping) or run
   into an extra round, and lessons can score a hand that may not win. Hong Kong uses none but
   `scoreAny`, and its behaviour is unchanged.
8. **The win context and the score** (`WinContext`: first draw, the actual tiles, indicators and
   those under them, the declaration and one-shot; `HandScore`: fu, yakuman, band). The scorer
   needs to know these things; the core gathers them where it builds the context.
9. **Red fives** (`TileSetSpec.red`): copy 0 of each five is the marked tile. The set and the ids
   are the core's; what a red five is worth is the rules file's.
10. **Positions** (`rules.ts` `position()` takes a style, indicators, ready marks, stakes and the
    counter; `parseTiles` reads "0p" for a red five) for tests and lessons.
11. **The CPU's hints** (`ValueHints`: all simples, a declaration's value, the bonus kinds, and a
    scale for the cost of feeding). The strongest level weighs feeding a ready hand by what the
    feeder pays; at Riichi the feeder pays the whole hand, four times the base, so the same
    weight made it fold far too often (it lost the first ladder run to level 4, 0.400). A third of
    the Hong Kong weight measured best (`riskScale: 0.3` in the Riichi hints), and the Riichi
    guide points are kept in hundreds so expected points sit on the scale of the Hong Kong
    table's.

Outside Mahjong:

- `GameOptions.fieldsFor(config)` (`src/games/types.ts`) and one line in
  `src/shell/screens/HubScreen.tsx` that uses it, so the play dialog shows the option fields of
  the chosen rules family (a Riichi preset shows Riichi's 19 options, not Hong Kong's). Optional
  and additive: no other game sets it.
- The lesson number pad (`src/shell/learn/LessonScreen.tsx`, `src/styles/learn.css`) takes six
  digits instead of three, in a smaller size from the fourth: Riichi payments run to five digits
  (a dealer's yakuman is 48,000), and the Riichi lessons and drills ask for them. Nothing else
  changes for answers of three digits or fewer.
- `src/text/en.ts`: Mahjong's subtitle and launch line now say Hong Kong and Riichi. `src/games/ladders.ts` gains the `mahjong-riichi` key, and the
side score now compares the two sides' points (the same result for Hong Kong, whose scores start
at nothing; Riichi's start at a stack each).

## Decisions

1. **Defaults are the common online table** (red fives, open tanyao, 25,000 to start, East and
   South, double ron, ura and kan dora, ippatsu, no kiriage, a counted yakuman at 13 han, double
   yakuman for the four big ones). Every disputed rule is an option, and the "stricter club table"
   preset turns the usual ones the other way.
2. **The riichi stick is paid when the declaring throw passes**: a ron on that tile cancels the
   declaration and the stick, as written rules agree.
3. **Head bump is an option, not the default**: two winners each collect; three winners on one
   tile is an abortive draw by default (an option allows three).
4. **Pao (responsibility payments), uma and oka, local yaku and chombo are not implemented**; the
   rules document lists them under "Not implemented", and "ask before you sit" asks about them.
5. **Lessons use a one-hand Riichi table** with the common online options, and the Riichi track
   is stage 4 ("Advanced"), after the Hong Kong track; the shared stage 0 to 2 lessons stay
   written for every style.
6. **The cross-check's six differences are left as the package's errors**, each with a check in
   the test that our number is the rule's.

## Not done

- **Level 5 at a Riichi table is not clearly stronger than level 4** (about 0.61, under the 0.6
  margin on the ladder's seeds), so the `mahjong-riichi` ladder has four rungs. Riichi-specific
  play for the top level (reading tiles thrown after a riichi as safe, push or fold by the value
  of one's own ready hand, placement at the last hand) would be the next step.
- Pao (responsibility payments), uma and oka, local yaku and chombo, as the rules document says.
- Riichi practice has generated drills only; there is no rated problem set for Riichi (the
  discard problems are Hong Kong hands, and the efficiency they teach holds for both).
- The table-ready checklist (`src/games/ready.ts`) is unchanged: it is per game, and its items
  (the wall, the deal, calls, scoring a hand, etiquette) are met through the shared and Hong Kong
  lessons.
