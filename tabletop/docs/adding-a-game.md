# Adding a game

Chess (milestones 1 and 2) is the worked example. Read `PLAN.md` (sections 1.2 to 1.6, 2.3 to 2.10
and the game's milestone), `PROGRESS.md`, `docs/lessons.md` and the chess files before starting.
A game is not done until the definition of done in PLAN.md 2.10 holds.

## 1. Rules first

Write `docs/rules/<game>.md` before any code: the rules as they will be implemented, every option
(each disputed rule is an option), named presets, golden cases (including the awkward ones), and
sources. Then `src/games/<game>/rules.ts`: a `GameDef` (`src/core/contract.ts`) that is pure, takes
all randomness from the seed in `setup`, returns events from `apply`, never leaks hidden
information through `view`, and has JSON and notation codecs (state notation must read back to
the same notation). Options are the config; presets are named configs.

Tests: golden cases for each rule (`tests/unit/<game>-rules.test.ts`), properties over random
games with `tests/harness/contract.ts` (`tests/property/<game>.property.test.ts`: nothing crashes,
every legal action applies, conservation laws, views never leak), replay, and a cross-check
against a second implementation when the plan names one (it is a dev dependency, never shipped).

## 2. CPU players

`src/games/<game>/bots.ts` exports a `BotSet` (`src/ai/bot.ts`) with levels and nominal ratings in
`levels.ts`. Bots get the view, never the state. Strength comes from node or playout budgets,
never time. Weak levels make human-looking mistakes. `advise` answers coach questions (hint,
threats, evaluation; plus `best` for free play and `analyse` for review, as chess does). Add the
game to `src/games/bots-index.ts` and a ladder to `src/games/ladders.ts`; `npm run ladder -- <game>`
must pass (level N+1 beats level N with a 0.6 share, level 1 beats random).

## 3. The table

`src/games/<game>/ui/index.tsx` exports a `GameUi` (`src/games/types.ts`): the play surface
(SVG boards, DOM cards and tiles; every square, point, card or tile is a labelled button so tests
can click it by name), seat marks, side extras, sides, event durations and log lines, counters
(at least one thing a real player keeps in their head), sounds, the reference card, the coach
(helps as switches; any help except legal moves marks the game as training), clocks if any,
`review` (analysis and play-on) and `moveSquares` if it has a board. Shared pieces belong in
`src/kits/`. Add it to `src/games/registry.ts` and set `playable: true` in `src/games/catalog.ts`.

Named rule presets go in `GameUi.presets` (the New game dialog shows them under "Rules at this
table", the first is the default; `ratingOffset` says how many rating points a handicap preset
takes off the CPU's level), and `GameUi.replayConfig` says which options "Play again" keeps
(shogi keeps its preset and drops a set-up position). `GameUi.moreExports` offers file formats
beside `exportRecord` in the game and review menus (shogi saves KIF, CSA and SFEN). All three are
optional; shogi (milestone 8) is the first game to use them.

**Pass-and-play** (several people at one device, milestone 7) comes from the shell, so a new game
has it with no work: in the New game dialog each seat can be a person (with a name) or the CPU.
The shell passes the person holding the device as `mySeats` (one seat) to the surface, counters
and log, so show that seat's hand and turn the board towards it (`flipForSeat`, or the surface
itself as Chinese Checkers does). Games whose views differ between seats (hidden cards or tiles)
get a "pass the device" cover between two people's turns; the shell finds this by comparing the
views at the start, or set `GameUi.hiddenInfo`. If your log lines or move list call the other side
"the CPU", use the optional `names` argument of `describeEvent`, `movePrefix` and `playerName`: it
names the other people at the device (Brisca and Dominoes do). Games between people never move a
rating or tick the "beat a level" checklist item.

Interface text goes in `src/text/games/<game>.ts` (keys prefixed with the game id), spread into
`src/text/games/index.ts`. The `game.<id>.*` lines in `src/text/en.ts` describe the game on the
shelf; update them when the game arrives.

## 4. Learn, practice, review

- Lessons in `src/games/<game>/learn/` with a `LessonGame` adapter and a `LessonVerifier`
  (`docs/lessons.md`). Stages 0 to 2 and Table-ready complete; register them in
  `src/games/lessons.ts` and in the `SUITES` of `scripts/lesson-lint.ts`.
- Practice in `src/games/<game>/practice/` (at least three kinds, each generated or with 100 or
  more items), registered in `src/games/practice.ts`, with every problem proved by a solver.
  Drill ids must start with `drill-` (the router opens those as drills, the rest as problem sets).
- If the game's notation uses digits (shogi squares are "76"), give the `LessonGame` a
  `stripNotation` so the linter's typed-number check skips the notation.
- The table-ready checklist in `src/games/ready.ts`.
- Review: `ui.review.analyse` rates each decision in the game's own unit (`src/teach/analysis.ts`
  holds the shared arithmetic), names the key moments with a one-sentence reason, and
  `configAt` starts "play on from here".

## 5. Checks, screenshots, notes

- `npm run check` and `npm run e2e` green. End-to-end tests for the game go in
  `tests/e2e/<game>.spec.ts` (start a game, play scripted moves to the end, finish a lesson,
  solve a problem, open a review) and run at all three sizes. Screenshots for the milestone go in
  `tests/e2e/screens-m<N>.spec.ts`, writing to `screenshots/m<N>/`. Look at every one.
- When several checkouts run at once, give each its own port: `E2E_PORT=4180 npm run e2e`.
- Record dependencies in `THIRD-PARTY.md` (and `src/shell/third-party.ts` if shipped), and the
  milestone in `PROGRESS.md`: what was built, the gate, decisions, and what is open.

## Lint traps seen so far

The React lint rules are strict: no reading refs during render, no `Date.now()` or
`Math.random()` in render code (do it in loaders or event handlers), no synchronous `setState`
in an effect (derive the value instead), and methods passed as callbacks must be arrow-function
properties. `eslint --max-warnings 0` must pass.
