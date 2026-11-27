# M12. Card variants A: Tute

Built on 2026-11-27 in its own checkout while Brisca for four (with señas) was built on the main
branch; to go into `PROGRESS.md` at the merge. Tute is its own game (id `tute`, group `cards`) on
the Spanish 40-card deck: four players in fixed pairs, or two with a stock.

- [x] **Rules first**: `docs/rules/tute.md`: the cards and points, seats and turns (to the right,
      partners opposite), the hand for four, the obligations (follow, beat, trump, overtrump),
      cantes of 20 and 40, the tute, the two-player game with a stock and the exchange of the 7 or
      2 of trumps, scoring (the last ten, most points or first to 101 with vueltas, capote, games
      to a target); 14 options, 6 presets, the "ask before you sit" card, golden cases, "not
      implemented, on purpose", and dated sources.
- [x] **Behind the contract** (`src/games/tute/rules.ts`): `tute` with views that hold your hand,
      every trick played, the cantes, the turned card and exchanges and the counts, never another
      hand, the stock or the seed; `sample()` that deals the unseen cards around the cards known to
      be held and keeps every seat clear of what its plays show it cannot hold (`cannotHold`, read
      from the obligations), so every past play stays legal in every sampled deal; JSON and
      notation (`Ao`, `sing-c`, `tute-R`, `swap`); team outcomes (seats 0 and 2 against 1 and 3,
      as in Dominoes); `explainCard` (which obligation refuses a card); `position()` for tests,
      lessons and drills; "play on from here".
- [x] **CPU, six levels** (`src/games/tute/bots.ts`), set by knowledge and budget, never time:
      a beginner who often plays the card it likes and forgets to sing (1); a basic player who keeps
      its pairs and loads points on its partner's tricks but saves its Ases (2); a counting player
      who cashes its Ases, knows which cards nobody can beat, draws trumps when strong and reads
      voids from the obligations (3); and sampled-deal search, each deal consistent with every
      obligation shown, played out with the counting player's habits: 24 deals (4), 64 (5), and 128
      with the last two tricks solved exactly in each (6). An exact solver for small endgames
      (cantes included) agrees with brute force; it proves the lesson claims.
- [x] **The table** (`src/games/tute/ui/`): two or four seats, your partner opposite, the trick
      laid as a cross; known cards (the dealer's turned card, sung pairs, a card taken in an
      exchange) face up in their holder's hand; on your turn the cards the obligations rule out are
      dimmed, and pressing one says why ("You must follow suit: play bastos.", "You must win the
      trick if you can: beat the Rey de oros.", "You must beat the Cuatro de bastos with a higher
      trump."); buttons to sing ("Sing the 40", "Sing the 20 in copas"), declare a tute or swap;
      the turned trump, each side's won tricks with their count, a hand-over card with the points.
      Checked at 844×390, 1180×820 and 1440×900.
- [x] **Coach**: a three-step hint, and as switches (each marks the game as training) the points so
      far with cantes, trumps and Ases and Treses still out, the pairs that can still be sung, who
      cannot have a suit (from the obligations), the cards seen, what wins the trick, and cards up.
      Legal-card dimming is the "Legal moves" help, on by default and not training.
- [x] **Learn**: 23 lessons, all passing the linter (computed placeholders, no typed numbers):
      stage 0 (2), the rules (10: cards and points, the deal and trumps, follow, beat, trump and
      overtrump, the twenty, las cuarenta, the tute, the last ten and the count, two players and
      the stock with the exchange), first strategy (6: cash your As, load your partner's trick,
      throw your cheapest card, sing while you can, count the trumps, and a free-play finish
      leading into your partner's void), Table-ready (5: dealing for four, counting a hand by
      hand, singing at the table, ask before you sit, renuncio and manners). Every "best" claim is
      proved by the exact solver; the free-play finish is won whatever the partner plays.
- [x] **Practice**: four generated drills on the lesson runner: which cards may you play (count
      them), who is winning the trick, count a finished hand (cards, cantes and the last ten, the
      tricks face up in a grid), and what your hand can sing. A unit test lints 40 of each.
- [x] **Review** (`src/games/tute/review.ts`): every decision rated "with what you knew" by its
      loss in expected points (a hand won counts as points too), key moments with reasons (missed
      cante, missed tute, the exchange was there, gave points to their trick, could have loaded
      the partner's trick, wasted a trump), "play on from here".
- [x] **Table-ready checklist** in `src/games/ready.ts`; text in `src/text/games/tute.ts`
      (registered); a shelf glyph (a crown, for the four Reyes).

## Gate: the definition of done (PLAN.md 2.10)

| Item | Result |
| --- | --- |
| 1. `docs/rules/tute.md` | Rules as implemented, 14 options, 6 presets, golden cases, sources |
| 2. Golden, property and replay tests under every preset | 25 golden cases (`tests/unit/tute-rules.test.ts`); random games under the 6 presets and 3 more configs keep the contract, conserve the 40 cards, total 130 plus cantes in every hand played out, never leak another hand, the stock or the seed, and replay; sampled deals keep the view and every inference holds (`tests/property/tute.property.test.ts`) |
| 3. At least four CPU levels pass the ladder | Yes, levels 1 to 4 (see the ladder below); 5 and 6 do not separate |
| 4. Learn stages 0 to 2 and Table-ready | 2 + 10 + 6 + 5 lessons, all passing the linter |
| 5. Three kinds of practice | Four generated drills |
| 6. Coach helps and a counter a player keeps in their head | Points so far with cantes, trumps and big cards out, pairs still to sing, who cannot have a suit, cards seen |
| 7. Review with key moments, reasons, play on | Yes |
| 8. Save, resume, replay, reference card | The shared table; replay in the property tests; the reference card in the screenshots |
| 9. End to end at phone landscape, screenshots looked at | `tests/e2e/tute.spec.ts` (5 tests) passes at 844×390, 1180×820 and 1440×900; 23 screenshots in `screenshots/m12-tute/` looked at |
| 10. Progress notes | This file |

**Ladder** (`npm run ladder -- tute 300`, run as `LADDER_LEVELS=1,2,3,4`: matches to five games
under "Spain, in pairs", the two levels sitting as partners against each other, every deal played
twice with the sides swapped; pass at 0.6). The top two rungs were run separately with the same
spec and seeds at 100 games (scratch script, one `runMatch` per rung, so they could run in
parallel):

| Rung | Games | Won | Lost | Score | |
| --- | --- | --- | --- | --- | --- |
| Level 1 against random play | 300 | 198 | 102 | 0.660 | passes |
| Level 2 against level 1 | 300 | 183 | 117 | 0.610 | passes |
| Level 3 against level 2 | 300 | 195 | 105 | 0.650 | passes |
| Level 4 against level 3 | 300 | 200 | 100 | 0.667 | passes |
| Level 5 against level 4 | 100 | 48 | 52 | 0.480 | fails |
| Level 6 against level 5 | 100 | 54 | 46 | 0.540 | fails |

Four levels pass, which is the gate. At 1000 games the three lower rungs score 0.658, 0.630 and
0.658, so they are clear of the line; at 100 games their noise (about ±0.05) once put level 2
against level 1 at 0.58, which is why the Tute ladder plays 300 games a rung. Levels 5 and 6 are
not measurably stronger than level 4: in paired single hands 64 deals beat 24 by only +2.8 points
a hand (0.517 of hands), and a hand of Tute is mostly decided by the deal, because the obligations
leave few free choices. Separating them needs knowledge, not budget (open; see below).

## Tests

- `npm run check`: types, lint, 606 unit tests (51 files), 52 property tests (10 files), and the
  lesson lint (Tute: 23 lessons; 2 + 10 + 6 + 5 by stage) all pass.
- Tute's own: `tests/unit/tute-rules.test.ts` (25 golden cases), `tests/unit/tute-bots.test.ts`
  (solver against brute force on 60 endgames with cantes, every level legal and repeatable under
  two presets, view-legal equals rules-legal under every preset, heuristics, coach answers, a
  whole-hand review), `tests/unit/tute-learning.test.ts` (160 generated drills through the lesson
  linter), `tests/property/tute.property.test.ts` (random games under 9 configs; sampling).
- `tests/e2e/tute.spec.ts` (5 tests) at 844×390, 1180×820 and 1440×900: 15 passed. The shelf test
  in `tests/e2e/shell.spec.ts` now counts the shelf. The whole e2e suite on the phone project:
  99 passed, 1 skipped by design.
- `tests/e2e/screens-m12-tute.spec.ts` writes 23 screenshots to `screenshots/m12-tute/`: the shelf,
  the hub, the rules dialog, the four-player table at the start, with a trick and legal cards, a
  card refused, the coach counts, a hand's summary, two players with the stock, the twenty sung in
  a lesson (before and after), overtrumping, the free-play finish with cards up, the Learn and
  Practice doors, three drills, a game over, the review, the reference card, and the table at the
  tablet and laptop sizes. All looked at.

## Decisions

1. **Tute is its own game**, not a Brisca preset: its obligations, cantes and scoring change every
   decision, and Brisca is being changed on the main branch at the same time. Tute imports nothing
   from Brisca; it shares only the Spanish card art in `src/kits/cards/`.
2. **Four players in pairs is the default** ("Spain, in pairs"); two players with a stock are
   presets. The default match is three games, so the tute's "wins the game" means something.
3. **Cantes as actions on your turn**: a cante for a trick is made during the next trick, before
   playing a card; either partner may make it (option `singer`). This keeps the contract turn-based
   and leaks nothing: a seat is never given a turn only because it could sing. With two players the
   winner sings after both have drawn (noted in the rules document).
4. **101 is announced for you** with `handWin: reach101`; a side never loses a hand for forgetting
   to call it.
5. **Legal cards are dimmed, illegal ones still pressable**, so the refusal can say which duty
   stops the card. The lesson runner ignores illegal moves, and the surface explains them first.
6. **Sampling respects the obligations**: what a seat's plays prove it cannot hold is kept out of
   its sampled hand (four players always; two players once the stock is gone, when no card can be
   drawn again). It makes the counting bots and the hints honest, and the property tests check
   that every inference holds in the real deal.
7. **Levels by knowledge, then budget.** Measured in paired hands (points a hand, the stronger side
   first): leading Ases is worth most (+7.8), loading the partner +2.9, keeping pairs +0.6;
   counting and reading voids add about +1 as heuristics but make search rollouts much better
   (+8.3 over the counting player at 32 deals, against +5.0 with the basic player's rollouts).
   More deals help slowly: 64 deals beat 24 by +2.8, and exact solving of the last three tricks
   inside every rollout cost 24 times the time for no measurable gain, so level 6 solves only the
   last two.

## Shared files changed (all small and additive)

- `src/games/catalog.ts`: the `tute` entry (cards, milestone 12, playable, on the shelf).
- `src/games/registry.ts`, `src/games/bots-index.ts`, `src/games/lessons.ts`,
  `src/games/practice.ts`: one loader line each.
- `src/games/ladders.ts`: `tuteLadder()` and its registration.
- `src/games/ready.ts`: the Tute table-ready checklist.
- `scripts/lesson-lint.ts`: the Tute lint suite.
- `src/text/games/index.ts`: spreads `enTute` (the `game.tute.*` shelf lines live in
  `src/text/games/tute.ts`, so `src/text/en.ts` is untouched; `game.brisca.later` is left as it is).
- `src/shell/components/GameGlyph.tsx`: a `tute` glyph.
- `tests/unit/text.test.ts`: the shelf test now expects Tute beside the eight launch games.

No change to the shell, the kits or the core: the illegal-card dimming is done inside Tute's own
card faces and stylesheet (`src/games/tute/ui/tute.css`).

## Not done, or open

- **Levels 5 and 6 do not separate from level 4** in the ladder (see above). They use more deals
  (64 and 128 against 24) and level 6 solves the last two tricks exactly, but in Tute that buys
  little. Ideas for milestone 15: a better playout policy (the biggest single gains measured were
  in how the playouts lead), reading the partner's likely holdings from its plays,
  or a learned evaluation. Their nominal ratings (1650, 1850) are not yet earned.
- **Sources**: www.pagat.com, es.wikipedia.org and en.wikipedia.org were refused by the build
  environment's network policy; every rule was taken from search-engine extracts and cross-checked
  (the rules document lists them, dated). Corrections from a real table are one option change each.
- **Declared capote**, singing before the draw (two players), exchanges only until two cards are
  left, and revoke penalties are not implemented, on purpose (see the rules document).
- **Phone speed** is not measured (no emulator); level 6's 128 deals in `bots.ts` is the number to
  change if it is slow.
- **Shelf copy**: `game.brisca.later` in `src/text/en.ts` still says "then Tute"; left for the main
  session, as asked.
