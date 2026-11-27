# M10. Mahjong II: teach it

Built on 2026-11-27 in the same checkout as M9, after merging the main branch (Chinese Checkers,
pass-and-play, the poker variants); to go into `PROGRESS.md` at the merge. With this milestone
Mahjong meets the definition of done, and all eight launch games are complete.

- [x] **Learn from zero, written once for every style** (`src/games/mahjong/learn/lessons.ts`):
      stage 0 (Mahjong in a minute, the tiles), stage 1 (sets: chow, pung and kong; a complete
      hand; drawing and throwing; chow from your left; pung and kong from anyone; who gets the
      tile; winning on a throw; enough to win; a drawn hand and the next deal), stage 2 (tiles
      from ready, lone tiles first, counting the useful tiles, waits, when to call, safe tiles).
      These play at a table with no flowers and no minimum, so they hold for every style; the one
      lesson on the minimum uses the Hong Kong default.
- [x] **The Hong Kong track** (`learn/hk.ts`, stage 3, "Skills"): flowers and seasons, how a hand
      scores, seat and round winds, the minimum and the limit, faan into points, who pays, and
      counting a hand yourself.
- [x] **Table-ready** (`learn/table.ts`): washing and building the wall, breaking it and dealing,
      calls out loud, settling up, ask before you sit, manners.
- [x] **Lessons on the real engine** (`learn/game.ts`, `learn/verify.ts`): positions built from the
      tiles a lesson names with the rest dealt from a seed (every tile in one place; the other
      hands never hold three alike or come close to winning; a throw on offer is yours alone to
      call); every number computed (the set and hand from the rules, each pattern from one faan
      table in the rules file, points, payments, tiles from ready, useful tiles, waits, unseen
      tiles, what a win on offer scores and collects); every "best" discard proved by the coach's
      calculators. All 30 lessons pass the linter, with the "I already know this" checks.
- [x] **Practice** (`src/games/mahjong/practice/`): 161 rated "what would you discard" problems
      from hands the CPU played (`npm run generate:mahjong`), each proved by the efficiency
      calculator, with themes (lone tiles, breaking a shape, count what is seen, getting ready);
      five drills generated on the spot: what would you discard, waits, name the pattern, score
      the hand, safe tile.
- [x] **Review**: the M9 review already rates every discard by the useful tiles it gave up and
      analyses each deal-in (the tile that fed the winner and the safer one); with a practice
      pack in place, a moment you keep now goes into the Mahjong review queue.
- [x] **Auto-scoring switch**: "Score hands for me" in the coach, on by default. Off, a won hand
      asks for its faan before the sheet shows, then says whether you were right.
- [x] **Table-ready checklist** (`src/games/ready.ts`): set up and deal (wall, deal), calls and
      terms (sets, calls out loud, how a hand scores), score a hand (the scoring drill right first
      time five times), etiquette (manners, ask before you sit), beat level 3 without help.

## Gate: the definition of done for Mahjong (PLAN.md 2.10)

| Item | Result |
| --- | --- |
| 1. Rules document | `docs/rules/mahjong-hk.md` (M9): rules as implemented, 19 options, 6 presets, sources; `docs/rules/mahjong-core.md` now also says how teaching builds on the core |
| 2. Golden, property and replay tests under every preset | M9: 40 faan cases, 25 engine cases, property tests under all six presets and four mixes, replay; still passing |
| 3. At least four CPU levels pass the ladder | M9: all five levels (bots unchanged in M10) |
| 4. Learn stages 0 to 2 and Table-ready, passing lint | 30 lessons: stage 0 2, stage 1 9, stage 2 6, stage 3 (Hong Kong) 7, Table-ready 6; `npm run lint:lessons` passes for all eight games |
| 5. At least three kinds of practice, generated or 100+ items | 161 rated discard problems, and five generated drills |
| 6. Coach helps, with a tracker a player keeps in their head | M9: hint, tiles from ready and useful tiles, the unseen-tile tracker, safe tiles, tiles up; M10 adds "Score hands for me" |
| 7. Review with key moments, reasons and "play on from here" | M9; moments now feed the Mahjong review queue |
| 8. Save, resume, replay and the reference card | M9 |
| 9. End to end at phone landscape, screenshots looked at | `tests/e2e/mahjong-learn.spec.ts` (6 tests) and `tests/e2e/mahjong.spec.ts` (4) at 844×390, 1180×820 and 1440×900: 30 passed; `tests/e2e/screens-m10.spec.ts` → `screenshots/m10/` (29 shots), each looked at |
| 10. Progress written | This file (`PROGRESS.md` is left to the merge, as instructed) |

`npm run check`: typecheck, lint, 587 unit tests in 49 files, 50 property tests in 9 files, and
the lesson lint for all eight games, all passing. `tests/unit/mahjong-learning.test.ts` (14
tests) checks the computed numbers against the rules and the scorer, the lesson positions, the
verifier (efficiency and safety claims, near ties refused), that every lesson asks for a move
only on your turn and passes the linter, that every drill lints and asks what the calculators and
the scorer say, that every rated problem is proved again from its rebuilt position, and the
auto-scoring switch.

## Decisions in M10

1. **Stages 0 to 2 are written for every style** and play at a table with no flowers, no minimum
   and one hand; style tracks come after them. The Hong Kong track is stage 3 under the shared
   "Skills" label, with a blurb that names it; Riichi (M11) can add its track the same way.
2. **Lesson positions are built, not typed**: a lesson names the tiles that matter and
   `lessonPosition` deals the rest from a seed, with the other hands kept harmless (no three
   alike, never near winning) and a throw on offer left to you alone, so a scripted step never
   meets a surprise call.
3. **"Best" means proved by the coach's own calculators**: a discard is best when it leaves the
   fewest tiles from ready and then the most useful tiles you have not seen, ahead of every other
   discard as fast by at least two tiles; on a position marked for it ("safety" seed), when the
   safe-tile ranking puts it clearly safest. Calls are taught with "legal" claims and reasons,
   since no calculator proves a call.
4. **Tile names are notation** for the no-typed-numbers rule ("5 dots", "6-7-8 bamboo", "3 and
   4 bamboo", 5D, Orchid (flower 2)); every count and value is a placeholder. Table customs the
   engine does not model (two tiles high, four at a time) are in words.
5. **One faan table** (`hkFaan` in the rules file) is read by the scorer, the lessons and the
   drills, so they cannot disagree.
6. **Rated problems come from real hands**, stored as specs that name every hand, meld, discard
   and bonus tile and rebuilt when Practice opens; the wall's order is not part of a one-move
   problem. Ratings (700 to 1620) rise with tempting alternatives, answers that only counting
   the visible tiles decides, distance from ready and breaking a shape.
7. **Drills are built to order** (complete hands steered toward a pattern, hands a few tiles from
   complete, a player with three sets called), not taken from self-play, so each appears at once
   (under 60 ms) and covers what it drills.
8. **"Score hands for me" is not a training help**: turning it off makes the game harder. It asks
   for the first winner's faan only; payments follow from the base, which the lessons and the
   scoring drill teach.
9. **Called sets at the side of the table are drawn larger** (as large as the space between the
   seat tags allows), and your flowers too, since both are read in the lessons and drills.

## Shared files changed in M10 (all additive)

- `src/games/lessons.ts`, `src/games/practice.ts`, `src/games/ready.ts`: the Mahjong lesson pack,
  practice pack and table-ready checklist.
- `scripts/lesson-lint.ts`: the Mahjong suite.
- `package.json`: `npm run generate:mahjong`.

## Not done in M10, or open

- **No free-play steps**: winning a whole hand depends on the wall, so lessons use set positions
  and the drills give the practice; a scripted "win this hand" could come with stacked walls.
- **Stage 4 is empty** for Mahjong; the Riichi track is milestone 11.
- **Side melds stay small on a phone** when a player has called three or four sets: the column is
  limited by the table's height. The coach's safe-tile panel names each threat in words.
- **The dice and the break are taught, not simulated**: the engine deals from a shuffled wall
  (as in M9's rules document).
- **Problem ratings are estimates** until enough attempts move them.
- **A kept review moment replaying in the queue** is covered by the shared review-queue tests,
  not by a Mahjong end-to-end test.
