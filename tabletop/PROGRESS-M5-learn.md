# M5 Hold'em: Learn and Practice (notes from the learn branch)

Built 2026-11-27 in its own worktree, branched from the commit that added the Hold'em rules, bots
and table, while the main branch worked on the Hold'em review screen, bot tuning and table polish.
These notes are for merging into `PROGRESS.md`.

## What was built

- **Lesson adapter** (`src/games/holdem/learn/game.ts`): positions in state notation, moves in
  action notation (`fold`, `check`, `call`, `r60`), several actions per string so one scripted
  reply carries every other player's turn. You sit in seat 0. A lesson position is the last hand of
  a ten-hand cash session (`lessonPosition`), so the table stops when the hand ends instead of
  dealing the next one. `pokerComputed` gives about 130 kinds of placeholder, all computed: pot, amount to
  call, final pot, break-even share and odds ratio, stack in big blinds, the least raise, outs to a
  straight or better (`reading.ts`, as the coach counts them), the quick rule of 2 and 4 and the
  exact chance to hit, exact equity with cards up, outs that win against a known hand, implied odds,
  main and side pots, split shares, positions and seat names, hand names for the middle of a
  sentence ("a pair of queens"), the opening chart's shares by seat (`preflop.ts`), push shares
  (`bots.ts`), session statistics (VPIP, PFR), bet sizes and the prices they offer, the tournament
  blind levels, the straddle and its least raise, and values against a stated range.
- **Ranges** (`learn/ranges.ts`): the usual shorthand (`AKs`, `QQ+`, `ATs+`, `KhQh`, `top:0.15`).
  A position that assumes a range for a claim carries it in its seed, which is part of the state
  notation but never of any seat's view: the CPU and the table never see it, the linter checks the
  claim against it, and the text quotes its size through placeholders.
- **Verifier** (`learn/verify.ts`, shared arithmetic in `learn/math.ts`). A "best" claim is proved by
  equity and pot odds, and may only be made where equity decides the play: call or fold when calling
  ends the betting (the other player is all-in), or all-in or fold against one player left to answer
  (the push-or-fold model). The other hand is the real one when the step shows the cards, else the
  stated range. Equity is exact from the flop on (every rest of the board dealt); before the flop it
  is exact against one known hand (half a second a matchup) and a 200,000-deal fixed-seed sample
  against a range. The right play must win by 3% of the pot it is played for. The verifier also
  checks chip conservation within the hand and that lesson hands end their session.
- **Lessons, 34** (`learn/lessons.ts`), all prose original, every number a placeholder:
  - Stage 0, Basics (3): Hold'em in a minute; Which hand wins (every category, cards up, with a
    checkpoint); Best five, kickers and the board.
  - Stage 1, Rules (6): The button and the blinds (heads-up too); Fold, check, call, bet or raise;
    The smallest raise; The flop, the turn and the river; The showdown and split pots (the odd
    chip); All-in and side pots.
  - Stage 2, Strategy (9): Starting hands; Position; Pot odds; Counting outs; From outs to odds (the
    rule of 2 and 4); Equity; Value bet or bluff; The continuation bet; When to fold.
  - Stage 3, Skills (8): Opening ranges by seat (answers from the chart); The re-raise before the
    flop; Reading playing styles (VPIP and PFR); Beating each style; Bet sizing; Draws and implied
    odds; Short stack: all-in or fold; Calling a possible bluff.
  - Table-ready (8): Acting in turn; Say it: declarations and the one-chip rule; String bets;
    Protecting your hand; Cards speak at the showdown; The button and blinds at a home game; A
    tournament blind clock; Ask before you sit (straddle, half-bet rule, odd chip, showdown order).
  - Seven "best" claims, all proved: two calls against a known hand (pot odds; a flush draw that is
    behind but priced in), a fold against a rock's range on the turn, a call against a maniac's
    river range and a fold against a rock's, and all-in or fold for a short stack against two stated
    calling ranges.
- **Practice** (`src/games/holdem/practice/`):
  - **Call or fold: all-in, cards up**, 160 rated problems (78 calls, 82 folds; ratings 556 to
    1,598), from `npm run generate:holdem-spots` (`scripts/generate-holdem-spots.ts`, writes
    `spots.json`). Four lines (button against the small blind, big blind against a small-blind
    raise, a re-raised pot against the cutoff, a check-raise all-in), flop or turn, the other stack
    set so the price runs from cheap to dear. Each answer is proved by `prove()` (the linter's own
    code) with the 3% margin; a deal is kept only when you hold a draw or a pair, they hold
    something, and equity is within 20 points of the price. Themes: flush, straight and combo
    draws, overcards, made hands, flop, turn.
  - Four drills generated on the spot (each one a short lesson on the runner, each linted in the
    unit tests): **Which hand wins** (cards up on the river; kicker battles, splits and different
    kinds mixed), **Count the outs** (a straight or better, banded so gutshots do not dominate),
    **Pot odds** (the price of calling an all-in, then call or fold with the equity shown, proved
    like the problems, calls and folds about even), **Raise or fold** (first in by the opening
    chart for a random seat, often near the edge of the range).
- **Table-ready checklist** for poker in `src/games/ready.ts`: set up (blinds, home game), terms
  (actions, hand ranking, declarations), score (the which-hand-wins drill five times), etiquette
  (acting in turn, showdown, ask before you sit), beat level 3.
- **Tests**: `tests/unit/poker-learning.test.ts` (19 tests: ranges, the numbers lessons quote
  checked by hand, the verifier's proofs and refusals, push or fold, position conventions, lesson
  stages and order, every named player still in the hand, question numbers kept after a move, no
  money words, every problem's proof re-checked, every drill linted, the preflop drill against the
  chart). `tests/e2e/poker-learn.spec.ts` (6 tests, phone, tablet and laptop: a rules lesson through
  the bet controls, pot odds with cards up, the Basics stage check, an all-in problem, two drills
  answered from what the page shows). `tests/e2e/screens-m5-learn.spec.ts` writes 19 screenshots
  to `screenshots/m5-learn/`.

## Changes outside the Hold'em learn and practice folders

- `scripts/lesson-lint.ts`: the poker suite, and a folder-to-game map (the folder is `holdem`, the
  game id `poker`), so the "lesson files with no suite" check still works.
- `src/games/lessons.ts`, `src/games/practice.ts`, `src/games/ready.ts`: registration.
- `src/text/games/poker.ts`: position names, hand phrases, hand classes, practice set, drill and
  theme names, and poker blurbs for stage 3 and the Table-ready track.
- `src/teach/runner.ts`: a new `asked` field, the position the current step or checkpoint question
  was asked in. `src/shell/learn/LessonScreen.tsx` fills step text from it. Before, a question's
  numbers were re-filled from the position after the move ("Your {equity}% beats the 0% you need"
  once the hand had ended); this affects any game whose move questions quote the position.
- `src/shell/learn/LessonScreen.tsx`: a checkpoint question's own cards-up flag now shows the hands,
  as the step's flag does (the "I already know this" checks copy questions into a checkpoint, and a
  cards-up question there was shown with the cards hidden).
- `src/shell/screens/LearnScreen.tsx`: a stage blurb may be overridden per game
  (`learn.stage.<stage>.blurb.<game>`); the shared stage-3 blurb speaks of "tactics and the basic
  mates", which suits chess only (Go's stage 3 could use this too).
- `package.json`: the `generate:holdem-spots` script.

## Decisions

- **Stages follow the app's labels.** The brief numbered rules, basics and strategy as stages 0, 1
  and 2, but the app labels stage 0 "Basics: what the game is and how it is won", stage 1 "Rules"
  and stage 2 "Strategy", so pot odds would have sat under "Rules". The content is all there, mapped
  to the labels: Basics (3), Rules (6), Strategy (the brief's "basics", 9), Skills (the brief's
  "strategy", 8). Stages 0 to 2 and Table-ready are complete.
- **Heads-up hands are against Beto (seat 1) or Félix (seat 5).** At the top seats the table draws
  face-up hole cards under the name plate, where the action label and the bet cover them, so
  cards-up lessons, problems and drills were unreadable there. The side seats draw cards above the
  plate. The table itself is unchanged (it is being polished on the main branch).
- **What a "best" claim may say** (see the verifier above). Strategy that equity alone cannot prove
  (value bets, continuation bets, sizing, opening ranges, re-raises) uses `legal` claims, with
  answers worked out from the chart or given as size ranges, and the reasons in the text.
- **The push-or-fold model leaves out limps and small raises**, as the model does; the text frames
  those questions as "all-in or fold".
- **Lesson positions end their session**, so the table never deals a new hand mid-lesson. Freezeout
  positions (the blind clock) are not played to the end.
- **No free play** in poker lessons: the bots' `advise` answers no `best` query, and a random
  showdown would not prove anything.
- **Card codes and hand classes are notation** for the typed-number check (`stripNotation`): "AKs",
  "T9s", "Ah" pass; "77" and "99+" do not, so pairs are written in words.
- **Drill ids** start `drill-poker-` and themes `poker-`, so their text keys cannot clash.
- **The end-to-end spec reads answers from the page.** Playwright's Node loader cannot import
  `preflop.json` without an import attribute, so the spec imports only the evaluator and works out
  the rest as a player would (the price from the text, the winner from the cards' labels).

## Found on the way, for the main branch

- `bots.ts` counts the players "behind" a seat by its place in the deal order, so a small blind that
  is first in sees five players behind it (only the big blind is) and `pushFraction` shrinks its
  all-in range to about a third (about 21% of hands at 7.5 big blinds instead of about 66%). The
  lessons compute their own figure from the players still in.
- The table: face-up cards at the top seats are hidden by the action label and the bet (cards-up
  help, showdowns); the other hands' cards are small for cards-up play (0.62 of a board card).
- Pot-odds wording differs: the table says "Call 10 to win 30" (the pot before the call), the coach
  rail "to win 40" (the pot after it). The lessons use "call {call} to win {pot}; the final pot is
  {final}".
- The problem screen's third hint ("show the move") draws an arrow, which card tables do not show,
  so for poker (and the other card games) it shows nothing.

## Open

- Preflop all-in problems with cards up (exact preflop equity is half a second a matchup; a
  generator could store precomputed proofs).
- A side-pot counting drill; a drill that asks the equity against a stated range.
- Free play against the CPU in lessons, once the bots answer a `best` query.
