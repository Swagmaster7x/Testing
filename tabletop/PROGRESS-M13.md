# M13: the classic card pack

Blackjack with a basic-strategy trainer, plus Hearts, Spades and Gin Rummy. The last three are
built on a shared trick-and-meld module and a generic determinized bot. All four games are on the
shelf in the Cards group.

Worktree branch: `worktree-agent-a4bdf756a3a6d1bba`. Commits run from `d2fa8bc` (the rules
documents) to the end of the branch; the base is `0b1181d`.

## What was built

| Game | Rules doc | Presets | CPU levels | Lessons | Drills | Coach helps (trackers) |
| --- | --- | --- | --- | --- | --- | --- |
| Hearts | `docs/rules/hearts.md` | Standard, Omnibus, Old style, Quick | 4 | 15 | points in a trick, duck under, throw when void | points taken, cards played (grid), who is void, cards that duck, cards up |
| Spades | `docs/rules/spades.md` | Standard, Blind nil, Casual, Club, Cut-throat | 4 | 13 | count a bid, score the hand, win or duck the trick | tricks against the bids and bags, cards played, who is void, cards that win, cards up |
| Gin Rummy | `docs/rules/gin-rummy.md` | Standard, Classic, Oklahoma, Quick | 4 | 13 | count the deadwood, best discard, score a knock | deadwood count with melds, discards they picked up, cards up |
| Blackjack | `docs/rules/blackjack.md` | Six-deck, Double-deck, Single-deck 6:5, European | 4 | 14 | basic-strategy trainer, running count, payouts, totals | basic-strategy chart (computed from the rules), running and true count, EV of each move, mark the chart's move, warn before leaving the chart |

Each game has:

- **A GameDef.** Hidden information comes through `view`, worlds through `sample()`, plus codecs,
  an outcome with places (Spades by teams), and `rulesVersion`. Positions are built for lessons
  and tests.
- **Golden unit tests per rule.** Hearts 17, Spades 19, Gin 18, Blackjack 22.
- **Property tests under every preset and random option mixes.** They check that all 52 cards (or
  the whole shoe) are conserved, that scores add up, that no view leaks a hidden card, and that a
  replay is identical (`tests/property/classic.property.test.ts`).
- **A table readable at 844 × 390.**
  - Hearts and Spades: four seats, you at the bottom, partner across in Spades. Hearts has a pass
    picker and Spades a bid panel with a blind-nil choice.
  - Gin: two hands, the stock, the discard pile, and the knock laid out with melds, layoffs and the
    score.
  - Blackjack: the dealer and you, ChipKit bet controls with play chips, split hands side by side,
    and optional extra boxes.
- **Coach.** Helps with trackers, a Hint that explains its idea, and a Review with key moments,
  reasons and Play on from here. Blackjack warns before you leave the chart, through `checkMove`.
- **Learn and practice.** Stages 0–2 plus Table-ready, all lint-clean, with every number computed.
  There are generated drills (at least three kinds per game) and a Table-ready checklist.
- **Pass and play.** Hidden hands are covered between people. Blackjack sets `hiddenInfo: false`,
  because everything at its table is face up.

### Shared module

- `src/games/classic/`: `cards.ts` (deck and dealing), `tricks.ts` (trick winner, following suit,
  voids, consistent deals with a max-flow fallback), `melds.ts` (bit-mask meld search, deadwood,
  layoffs), `names.ts`, `review.ts` (one review routine for all four games), `learn.ts` and
  `verify.ts` (the lesson-game adapter and its verifier), and `ui/` (TrickTable, seat labels,
  coach parts, CSS).
- `src/ai/determinized.ts`: the generic determinized bot. It samples worlds with `def.sample`,
  uses common random numbers across candidates, plays each world out with a rollout policy, and
  scores it with a value function and a stop rule.

## Ladders (`npm run ladder -- <game> [games]`)

A rung passes at a score of 0.6 or more for the higher level. Seats alternate on paired deals.

Hearts (100 games a rung):

| Rung | W | D | L | Score |
| --- | --- | --- | --- | --- |
| L1 vs random | 99 | 0 | 1 | 0.990 |
| L2 vs L1 | 86 | 1 | 13 | 0.865 |
| L3 vs L2 | 62 | 3 | 35 | 0.635 |
| L4 vs L3 | 65 | 4 | 31 | 0.670 |

Spades (100 games a rung, the default; partners sit together):

| Rung | W | D | L | Score |
| --- | --- | --- | --- | --- |
| L1 vs random | 100 | 0 | 0 | 1.000 |
| L2 vs L1 | 72 | 0 | 28 | 0.720 |
| L3 vs L2 | 62 | 0 | 38 | 0.620 |
| L4 vs L3 | 73 | 0 | 27 | 0.730 |

An earlier 60-game run gave 1.000, 0.717, 0.600 and 0.667.

Gin Rummy (100 games a rung):

| Rung | W | D | L | Score |
| --- | --- | --- | --- | --- |
| L1 vs random | 100 | 0 | 0 | 1.000 |
| L2 vs L1 | 89 | 0 | 11 | 0.890 |
| L3 vs L2 | 66 | 0 | 34 | 0.660 |
| L4 vs L3 | 62 | 0 | 38 | 0.620 |

Blackjack (6,000 sessions of 100 rounds per level, every level on the same shoes; a rung passes
when the return is better by at least 2 standard errors of the paired difference; the EV given away
is measured by the same EV calculation as the chart over the first 60 sessions):

| Level | Return (bets per 100 rounds) | EV given away per decision | Rung vs the level below |
| --- | --- | --- | --- |
| random | −42.88 | | |
| L1 (plays like the dealer) | −5.69 | 3.47% | +191.9 SE, wins 5961 of 6000 sessions |
| L2 (rules of thumb) | −0.73 | 0.60% | +32.5 SE |
| L3 (the computed chart) | −0.40 | 0.18% | +2.5 SE |
| L4 (Hi-Lo count: bet spread, insurance at +3, deviations) | +0.44 | 0.19% | +3.3 SE |

**How Blackjack meets the definition of done.** Blackjack has no opponent to beat: every player
faces the same house edge. A "level N+1 beats level N" match would only measure luck. So the ladder
measures what a level controls: its **return** over the same shoes, as a paired comparison, with a
rung passing at 2 standard errors. Level 1 beats random by far. Each level returns clearly more
than the one below. Level 4 is the only one with an edge over the house, and it gets that edge by
counting.

The **strategy accuracy** column shows the trainer's side. Level 3 plays the chart, so it gives
away only the 0.18% per decision that a total-dependent chart loses to perfect composition play.
Level 4 gives away a little more against that chart, because it deviates on purpose when the count
says so.

The basic-strategy chart is not copied from anywhere. It is computed by expected value from the
table's rules (decks, S17/H17, DAS, surrender, peek or European no-hole-card, 3:2 or 6:5).
It matches the published 6-deck S17 DAS late-surrender chart, and the H17 and ENHC changes come out
right.

## Decisions

- **Rules as options with named presets.** Every rule a table might vary is an option, with
  "Ask before you sit" questions on the reference card. Defaults follow the pagat.com descriptions
  (read 2026-11-27) for Hearts, Spades and Gin, and the common casino 6-deck S17 DAS game for
  Blackjack.
- **Blackjack is played for play chips only.** There is no money wording anywhere. A unit test
  scans every lesson, drill and interface line for money words. Bets come in steps of 10 between the
  table limits.
- **The single-box Blackjack outcome adds the house as seat 1**, so that a session has a result with
  places like every other game.
- **Hearts passes stay hidden until all four have chosen.** Then the received cards are ringed.
- **The Hearts and Spades bots** use the generic determinized search.
  - Hearts levels: L1 a loose heuristic, L2 a careful heuristic, L3 6 sampled deals, L4 48. The
    16-deal L3 sat too close to L4 (0.595), so L3 searches fewer deals.
  - Spades L4 adds two things. Its search counts bags at their real cost (a point now, less a
    tenth of the 100 penalty). It bids the number with the best average score over 40 simulated
    deals. Nil stays with the rule of thumb, because rule-of-thumb rollout opponents never try to
    set a nil, so simulation overrated nils (that version lost to L3, 0.433).
- **The Gin bots follow measured strengths, not a deeper search.** Pure rollouts lost to the
  heuristics.
  - L1 never takes the discard and knocks at once.
  - L2 takes melding discards and knocks at once.
  - L3 holds out for gin.
  - L4 discards by a determinized two-draw plan (30 deals) and knocks only at 5 or under.
  - Experiments with 600 games each are recorded in the git history of `bots.ts`.
- **Blackjack levels:**
  - L1 copies the dealer.
  - L2 plays rules of thumb.
  - L3 plays the chart computed from the rules.
  - L4 counts Hi-Lo, spreads its bets by the true count, insures at +3 or more, and uses count
    deviations.

  The Hint and the chart help always use the computed chart.
- **Number questions never ask for a negative number,** because the lesson number pad has no minus
  key. A set in Spades and a running count below zero ask the sign as a choice, then the size. A
  unit test walks every lesson and 30 of each drill to prove that each answer can be typed (a whole
  number from 0 to 999).
- **The e2e lesson and drill answers come from the games' own modules,** run through
  `tests/e2e/m13-answers.ts` under tsx. The browser test runner cannot import the text modules,
  because they import JSON.
- **The Gin drill no longer sorts with a random comparator.** It now leaves one suit out at random,
  so a seed gives the same drill in Node and in the browser.

## Shared files changed (small and additive)

- `src/games/catalog.ts`: four entries in the Cards group, milestone 13, playable and on the shelf.
- `src/games/registry.ts` and `src/games/bots-index.ts`: loaders for the four games.
- `src/games/ladders.ts`:
  - Ladders for the four games.
  - A Hearts side score, so that a match is scored by the two contenders' places.
  - An optional `custom` field on `Ladder`, used for Blackjack's return-based measure.
- `scripts/ladder.ts`: runs `ladder.custom` when a ladder has one and prints its rungs.
- `scripts/lesson-lint.ts`: the four lesson suites.
- `src/games/lessons.ts`, `src/games/practice.ts` and `src/games/ready.ts`: the packs and the
  Table-ready checklists.
- `src/shell/screens/ProgressScreen.tsx`: uses a game's own `ready.<game>.<id>` line when one
  exists. Blackjack needs this, because "beat a level" means something else there.
- `src/shell/components/GameGlyph.tsx`: original shelf drawings for Blackjack, Hearts, Spades and
  Gin Rummy.
- `src/text/games/index.ts`: adds the five new text files (`classic`, `blackjack`, `hearts`,
  `spades`, `gin-rummy`).
- `tests/e2e/shell.spec.ts`: the shelf test follows `SHELF` instead of counting eight tiles, and
  knows the four new names.
- `tests/unit/text.test.ts`: the shelf list includes the card pack.

## Tests

- `npm run typecheck`: clean.
- `npm run lint`: clean.
- `npm run test:unit`: 47 files, 563 tests passed.
- `npm run test:property`: 9 files, 52 tests passed.
- `npm run lint:lessons`: all lessons pass. Hearts 15, Spades 13, Gin 13 and Blackjack 14.
- e2e, `tests/e2e/classic.spec.ts` plus `shell.spec.ts`, on phone 844 × 390, tablet and laptop:
  42 passed.
  - Each game is played to the end against level 1 (one hand, or ten rounds of Blackjack), and
    its review opens.
  - A lesson is finished in each game.
  - Drills are answered in each game, including the best-discard problem and the
    basic-strategy trainer.
  - Gin Rummy pass and play covers each hand.
- Screenshots: `tests/e2e/screens-m13.spec.ts` (project `screens`) writes 34 PNGs to
  `screenshots/m13/`. They cover the shelf, and for each game the hub, table, key moment, coach,
  result, review, lesson and practice. Every one was looked at. The fixes they led to are in
  commit `aaa6388`.

## Not done, or known limits

- **No stored problem sets.** Practice is generated drills only. The "solve a problem" e2e uses the
  Gin best-discard drill (one best answer, proved by counting) and the basic-strategy trainer.
- **Results with no hand summary.** At game end, Hearts and Spades show an empty table: the seat
  tags carry each player's numbers, and the per-hand summary appears only between hands.
- **Levels at a one-box Blackjack table.** The Blackjack hub still offers CPU levels, but with one
  box they drive nobody, so the table header shows Level 1. Levels matter with two or three boxes.
- **Rungs near the margin.** Spades L3 vs L2 (0.620 over 100 games) and Hearts L3 vs L2 (0.635)
  pass, but not by much. Stronger separation would need a slower L3.
- **The lesson linter does not check that a number answer can be typed** (0 to 999, whole). The
  check lives in `tests/unit/classic-learning.test.ts` for these four games, and could move into
  the linter for all games.
- **The e2e preview server.** Several runs in a row on one port can hit a preview server that is
  shutting down (connection refused). Starting one server on 4591 for the whole session avoids
  this.
