## M14c. Mahjong IV: Sichuan Bloody, then American-format

Built on 2026-11-27 and 2026-11-28 in its own checkout (branch `worktree-agent-aac6b7c1884d8c399`,
base `8f7b31c`), alongside the builder adding Chinese Official and Taiwanese; to go into
`PROGRESS.md` at the merge. Two more rules files on the shared Mahjong engine, one after the other,
each finished and committed before the next began.

### Sichuan Bloody ("blood battle", 血战到底)

- [x] **Rules document and rules file** (`docs/rules/mahjong-sichuan.md`,
      `src/games/mahjong/styles/sichuan.ts`): 108 tiles (suits only), no chows, the void suit
      (declared in secret, thrown first, never called or made into a kong, never in a winning hand),
      the exchange of three tiles of one suit (off by default; by the dice or a fixed direction),
      the hand going on after a win until three have won or the wall is empty, several winners on
      one discard, kongs paid at once ("wind and rain": exposed 2 from the thrower, added 1 and
      concealed 2 from each player still in; an added kong robbed is never paid), the money of a
      kong whose next throw is won on (to the winner, back, or kept), the checks when the wall runs
      out (a flower pig pays the cap, or 16, to every other player still in; a player not ready pays
      each ready player the most that hand could win; kong money returned by a player not ready),
      and the fan table (all pungs 1, one suit 2, seven pairs 2 with four alike as two pairs, a root
      1 each, terminals everywhere 2, golden hook 1, twos-fives-eights 2, a fan for a kong's tile, a
      kong's throw, robbing and the last tile; self-draw as a point or a fan; heavenly and earthly
      hands at the cap) with its cap (3 to 6 fan). 13 options, five presets (Chengdu table, online
      with the exchange, a plain three-fan table, a six-fan table, one hand), questions before you
      sit, golden cases and dated sources.
- [x] **Golden cases** (`tests/unit/mahjong-sichuan.test.ts`, 21 tests): every fan line alone and
      together, the cap, points; a void tile or three suits refused; on the engine the void
      declaration hidden until all have chosen, void tiles first, no calls of the void suit, no chow,
      a discard win paid by the thrower alone, two winners with play going on from the player after
      the second, three winners ending the hand, a self-draw paid by everyone still in plus one,
      kongs paid at once and an added kong paid only once nobody robs it, the call transfer (and the
      money going back), the end checks with a flower pig and players ready and not ready, the
      exchange in every direction keeping thirteen tiles, and bots playing a whole game whose
      payments add up at every step.
- [x] **Property tests** (`tests/property/mahjong.property.test.ts`): random games under all five
      Sichuan presets and three odd mixes besides the Hong Kong and Riichi ones, and games played
      toward winning: tiles conserved, payments in the hand under way and in every result adding up
      to zero and to the scores, no view showing another hand (a hand laid down after a win is
      public), samples agree with views, records replay; every winning hand in two suits and never
      its void; play going on after a win.
- [x] **The table**: the exchange prompt (tap three tiles of one suit, they lift, then Pass) with
      the tiles you received outlined; the void prompt (three buttons with your count of each suit);
      void marks on the seats (✕C, ✕D, ✕B on a small table, "Void dots" on a large one); the centre
      tip "Throw your dots first" while you hold them; a seat that has won shows "Won · 2 fan" and lays
      its hand face up, and play goes on round it; kong payments in the log; the result lists every
      win of the hand, the standing of each player at the end (ready, not ready, flower pig), fan and
      points, the payments for the whole hand and the final scores; counters for the hand number, the
      wall, the cap, each seat's void, who has won and the scores; the play dialog with the Sichuan
      presets and options; the reference card's Sichuan sections (what changes, the fan table from
      the rules file, payments, questions).
- [x] **CPU**: the same bot family, reading Sichuan's hints: the void suit is the one with fewest
      tiles (fewest in pairs and runs on a tie; a novice sometimes takes the next), the exchange
      passes three tiles from the suit it means to void when it can, keeping the rest closest to
      ready; tiles of its void suit count as gone. Two hints measured on the ladder (below):
      `valueSteer` (Sichuan steers toward fan at 0.3 of the Hong Kong weight: the race to win first
      pays more) and `callsBySpeed` (the strongest level judges pungs and kongs by speed, as the
      rules of thumb do).
- [x] **Learn** (`src/games/mahjong/learn/sichuan.ts`, stage 4 after Riichi): what changes, the
      void suit (only the void tiles may be thrown), fan and points (count a pure all-pungs hand and
      what it collects), kongs paid at once and the end of the hand. Four lessons on Sichuan tables;
      every number read from the rules file (`SICHUAN_FAN`, `KONG_PAY`, the cap and the points).
- [x] **Practice** (`src/games/mahjong/practice/sichuan.ts`): "Sichuan: count the fan", a winning
      hand in two suits built toward all pungs, one suit, seven pairs, a root or a plain hand; count
      the fan, then what it collects, both checked by the scorer and the table's payments.
- [x] **Calculator** (Tools): Sichuan appears in the style switch; its picker shows suits only, no
      chow or flower modes, no round wind, and a "On a kong's throw" switch; payments follow the
      Sichuan settlement.
- [x] **Ladder**: `mahjong-sichuan` (table below).
- [x] **Text**: every new string in English and Spanish (`tests/unit/text-es.test.ts` passes).

#### Gate

| Item | Result |
| --- | --- |
| Rules document and file, options, presets, questions, golden cases, sources | `docs/rules/mahjong-sichuan.md`, `styles/sichuan.ts` |
| Golden, engine and property tests under every preset | 21 golden and engine cases; property tests under five presets and three mixes; 4 learning tests |
| At least four CPU levels pass the ladder | Levels 1 to 4 (table below) |
| Learn track and practice; lesson lint | 4 lessons, 1 drill; `npm run lint:lessons` passes (Mahjong 41 lessons) |
| Calculator | Unit cases in `tests/unit/mahjong-calculator.test.ts` (4); e2e in `tests/e2e/tools.spec.ts` |
| e2e at the three sizes | `tests/e2e/mahjong-sichuan.spec.ts` (a hand with the exchange, the void and play going on after a CPU win, to its result and review; the void lesson; the drill; the options and the reference card): 12 passed. `tools.spec.ts` with the Sichuan calculator, `a11y.spec.ts` with the Sichuan exchange, void and table scans, and `mahjong.spec.ts`, `mahjong-riichi.spec.ts`, `mahjong-learn.spec.ts` again: all passed |
| Screenshots looked at | `tests/e2e/screens-m14c.spec.ts` → `screenshots/m14c/s*.png` (18 shots) |

The ladder (`npm run ladder -- mahjong-sichuan 200`: four-hand games on the Chengdu table, the
level under test in seats 0 and 2 against the other in 1 and 3, every deal played twice with the
seats swapped; a side scores when its two seats together end with more points; pass at 0.6):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 188 | 5 | 7 | 0.953 |
| Level 2 against level 1 | 137 | 9 | 54 | 0.708 |
| Level 3 against level 2 | 143 | 7 | 50 | 0.733 |
| Level 4 against level 3 | 120 | 6 | 74 | 0.615 |

Level 5 is left off the Sichuan rungs: against level 4 it scores 0.555 over 200 games (0.605 over
the first 100), short of the margin. Before the two hints it scored 0.46 to 0.48, and level 4 only
0.588 against level 3 over 40 games (0.625 over 100). Measured over 100 to 200 games each: level 4
with no value steer at all 0.680 against level 3, with 0.4 of it 0.625; level 5 with calls judged by
speed 0.605 (with value-judged calls 0.465); level 5 with no fear of feeding 0.537, with twice the
weight on expected points 0.545, with a quarter of it 0.485, without the look-ahead 0.450. The
blood battle rewards speed above value, and level 5's expected-points model does not yet know
that the first winners collect from everyone still in.

#### Changes to the shared core, and why

The core (`src/games/mahjong/core/`) gained general mechanisms, each off unless a style asks for
it, so the Hong Kong and Riichi files did not change and their tests pass unchanged. Nothing in the
core says "Sichuan", "void" in the sense of a scoring rule, or "fan".

1. **Passing tiles before play** (`rules().passes`: rounds with a direction or the dice, a count,
   tiles of one suit, blind passing, a courtesy round, groups and votes; the `pass` phase, the
   `pass-tiles` and `vote` actions, the `passed` and `vote-result` events, `state.passing` and
   `state.received`). Sichuan's exchange of three needs it now and American's Charleston next; only
   the engine deals and moves tiles between hands, and choices must stay secret until all have
   chosen, as in a claim window.
2. **A void declaration** (`rules().declareVoid`, the `void` phase and action, `state.voids`, the
   `voids` event). The engine lists every seat's options, so only it can make void tiles the only
   throws while they are held and refuse calls and kongs of the void suit; the scorer decides what
   a void tile does to a win (`WinContext.voidSuit`).
3. **Play going on after a win** (`rules().playOn: { winners }`, `state.won`). This is the one
   change to the core's idea of a hand: until now a win ended it. With `playOn`, a win is settled
   at once, the winners leave the turn order (claim windows, the next draw and the next turn skip
   them; their hands are laid down face up and shown in every view), and the hand ends when that
   many have won, when one player is left, or when the wall runs out. Without it, nothing differs:
   `won` stays empty and every path is as before.
4. **Payments during a hand** (`state.paid`, `state.ledger`, the `pay` event, `Style.kongPayment`;
   `SettleInput.out`, `ledger` and `kongDiscard`; `HandResult.payments`). Sichuan pays kongs and
   wins as they happen; the result of a hand shows its whole payments (what was paid during it plus
   what is settled at its end), so a result's payments still add up to zero and the scores to the
   results.
5. **A richer end of the hand** (`DrawInput` with the hands, melds, voids, who had won and the
   ledger; `Style.seatStatus`, `HandResult.status`). The checks for flower pigs and players not
   ready need the hands as they stand; a style that reports each seat's standing shows it with the
   result.
6. **A win on a kong's throw** (`ClaimWindow.afterKong`, `WinContext.kongDiscard`). The engine
   knows a discard came straight after its thrower's kong; the scorer and the settlement decide what
   that is worth (a fan, and where the kong's money goes).
7. **Seven pairs with four alike** (`ShapeRules.sevenPairsFour`, in `shapes.ts`, `arrange.ts` and
   `shanten.ts`). Sichuan counts four of a kind as two pairs (a "dragon" seven pairs); the other
   styles keep seven different pairs.
8. **Style options of free text and a style's own win check** (`OptionSpec.text`,
   `rules().customShape`), added now so American needs no further change to the option reader; no
   style used them in this commit.
9. **The CPU's hints** (`ValueHints.dead`, `valueSteer`, `callsBySpeed`; `strategy.ts` reads the
   void as unseen-and-gone, skips seats that have won when reading threats, and counts hands laid
   down as seen). Measured on the ladder above.

Outside the core: `rules.ts` (the view's `voids`, `won`, `shown`, `paid`, `ledger`, `passing` and
`received`; the sample, the codecs and positions for them; notation `void p`, `pass 1m 2m 3m`,
`vote yes`), `ui/MahjongSurface.tsx` (the prompts, marks and result lines above), `ui/index.tsx`
(the options of any later style under `mahjong.<style>.option`, free-text options left out of the
dialog, the turn hidden while tiles are passed or voids chosen, log lines, counters, reference
sections), `bots.ts` (void and pass choices, the two hints), `learn/game.ts` (Sichuan positions and
numbers; the minimum and limit numbers only on Hong Kong tables), `calculator.ts` and
`ui/Calculator.tsx`, `ladders.ts` (the `mahjong-sichuan` key), `learn/index.ts` and
`practice/index.ts` (appended), `tests/unit/mahjong-learning.test.ts` (stage 4 lessons may play the
style named in their id), `tests/e2e/mahjong-helpers.ts` (the void and pass prompts; `playOnToEnd`),
`tests/e2e/a11y.spec.ts` (the Sichuan scans; the Progress scan now waits for its table, which loads
every game's lessons first and with the larger Mahjong pack was not always there after 400 ms).

#### Decisions

1. **Defaults are the common online and Chengdu sheet**: a four-fan cap, a self-draw worth one more
   point from each payer, the extras (terminals everywhere, golden hook, twos-fives-eights) and the
   bonus fan on, kongs paid at once, a kong's money to the winner of its throw, kong money returned
   and the checks at the end, several winners on one discard, no exchange (the "online" preset
   turns it on). Every disputed value is an option; the sources disagree on several (one suit as
   four or eight times, the cap, what a flower pig pays).
2. **The deal passes to the right** after every hand (many tables make the first winner the next
   dealer; the dealer has no payment privilege in Sichuan, so only who throws first changes).
3. **Hands laid down after a win are public** in every view and in the tracker of unseen tiles, as
   at a real table.
4. **Choices before play are secret** like claims: the void, the tiles passed and votes are hidden
   from the other seats (and from the move list) until all have chosen, and the table does not say
   whose choice it is waiting for.
5. **The exchange's tiles arrive outlined** in your hand until your first throw, so you see what you
   were given.
6. **Patterns are additive with a cap**, which reproduces the named big hands (pure all pungs 3,
   dragon seven pairs 3, pure dragon seven pairs 5, eighteen arhats 6) from one small table.
7. **A pattern name with digits is spelled out** ("Twos, fives and eights") so lesson text that
   quotes it passes the "no typed numbers" lint.
8. **Four levels at a Sichuan table**, as at a Riichi table (above).

#### Not done (Sichuan)

- Level 5 is not clearly stronger than level 4 at a Sichuan table (0.555 over 200 games).
- The dealer for the next hand is always the next seat (see Decisions); "blood river" (winners
  play on) and three-player Sichuan are not played.
- The result shows each player's payments for the whole hand, not line by line (wins, kongs, end
  checks); the log has the kong payments.
- Riichi-style "rated problems" for Sichuan: the drill is generated, there is no stored problem set.

### American-format (a card of hands, jokers and the Charleston)

- [x] **Rules document and rules file** (`docs/rules/mahjong-american.md`,
      `src/games/mahjong/styles/american.ts`, the card in `src/games/mahjong/american/`): 152 tiles
      (eight flowers that all match, eight jokers, or ten), dragons matched to suits (red with
      craks, green with bams, white with dots, the white also a zero); a winning hand is a hand on
      the card and nothing else; exact groups (singles, pairs, pungs, kongs, quints, sextets, years,
      runs of singles); jokers only in groups of three or more; the Charleston (the first, always:
      right, across, left; the second on a vote, always or never: left, across, right; the courtesy
      pass across of 0 to 3 tiles, the lower offer changing hands; blind passing on the last pass of
      each; jokers never pass); calling a discard for an exposure of 3 to 6 tiles with jokers (no
      chows, no concealed or added kongs; Mah Jongg beats an exposure; a discarded joker is dead);
      the joker exchange; dead hands (exposures that fit no hand on the card); the wall game; payment
      (on a discard the thrower pays twice the value and the others once; self-picked everyone pays
      twice; jokerless doubles, not for singles-and-pairs hands; or everyone pays the value). 10
      options (one of them the card's text), four presets (League table, first Charleston only,
      learner table with no dead hands, one hand), questions before you sit, golden cases, what is
      left out on purpose, and dated sources.
- [x] **The card** (`american/card.ts`): a text format close to the printed card (`FFF 2222a 44b
      666c 88a = 25 X`, `shift` for numbers that may move together, `## section`, `title:`, `#`
      comments); the parser names the line and the problem for every error (an unknown group, no
      points, no X or C, not 14 tiles, more natural tiles than the set has); every reading of a hand
      (suit permutations times shifts) is worked out once and kept; a check that fourteen tiles and
      the exposures make a hand, and the distance (tiles still to find) from a hand to each reading,
      counting what is out of sight.
- [x] **An original practice card** (`american/practice-card.ts`): "Kibitz practice card 2026", 24
      hands of our own in nine sections (the year, evens, odds, like numbers, runs, threes sixes and
      nines, quints, winds and dragons, pairs), none copied from a League card.
- [x] **Your own card** (Tools, "Your American card", `ui/CardEditor.tsx`): type the card you own,
      one hand a line; it is checked as you type (each error with its line), previewed as tiles by
      section, and saved on this device only. "My card" in the play dialog (and in the calculator)
      plays with it.
- [x] **Golden cases** (`tests/unit/mahjong-american-card.test.ts` 10, `mahjong-american.test.ts`
      17): the parser and its errors, the practice card reading cleanly, readings and limits; a
      natural hand doubled for no jokers, jokers in sets and never in a pair, quints, exposures
      that belong to the hand, concealed hands, dragons with suits, `shift`, a hand off the card
      refused; payment both ways; the Charleston rounds with the vote, courtesy and blind passes; on
      the engine 152 tiles dealt, jokers never passed and every hand keeping its size, an exposure
      with jokers, Mah Jongg beating it, a dead joker discard, the joker exchange, a dead hand (and
      none at the learner table), flowers called as one kind, bots playing a whole game.
- [x] **Property tests**: random games under the four presets, a mix (second Charleston always, no
      blind passing, ten jokers, flat payment, no jokerless bonus) and a game from a typed-in card
      (the practice card's text as "My card"), plus CPU-played games that pass, expose with jokers
      and win from the card: tiles conserved, payments adding up, no hidden tile in any view, samples
      agreeing with views, records replaying.
- [x] **The table**: the Charleston prompt ("First Charleston", "Pass 3 tiles to the right",
      "Jokers never pass.", tap three tiles, Pass), blind passing, the vote ("Play the second
      Charleston?") and the courtesy prompt (offer 0 to 3); exposure calls named with their jokers
      and drawn ("Expose a pung, 1 joker"); Mah Jongg; "Take the joker: your 7 dots" on your turn; a
      dead mark on a seat; a joker face of its own (plum, a gold star and JOKER; "J" on learner
      tiles); the result named by the card hand ("Pairs: FF 11a 22a 33a 44b 55b 66c", 50 points),
      the jokerless line, payments and scores; counters for the hand, dealer, wall, card, jokers in
      sight and scores; with the efficiency help on, the coach lists "Hands within reach" (the
      nearest card hands and how far each is) instead of numbers above tiles; the reference card's
      American sections (what changes, payments, the practice card, questions).
- [x] **CPU** (`american/bot.ts`): reads the card, not shanten. Each level ranks the readings of the
      card by distance (counting what is out of sight from level 3 on) and keeps several near hands
      open; passes in the Charleston the tiles least useful to its near hands, never jokers, passing
      blind when it has fewer than three to spare; votes for the second Charleston while far from
      any hand; offers tiles in the courtesy pass; exposes when a call brings its hand closer; takes
      a joker by exchange when the tile it gives up is worth no more; throws the tile its near hands
      need least. Level 1 keeps to one hand it chose early and slips; level 2 changes hands as its
      tiles change and exchanges jokers; level 3 counts what is out of sight and keeps hands open;
      level 4 also counts a tile still to find for more the fewer copies are left. (Weights on a
      hand's points and on the danger of feeding a player's exposures are in the bot and were
      measured, but made level 4 weaker; see below.)
- [x] **Learn** (`src/games/mahjong/learn/american.ts`, stage 4): what changes, the Charleston (pass
      three, jokers stay), jokers in exposures (call a pung with a joker), the joker exchange, and
      scoring (a 25-point hand, what each player pays). Five lessons; every number read from the
      rules file and the practice card.
- [x] **Practice** (`src/games/mahjong/practice/american.ts`): "American: what does it pay?", a
      winning hand dealt from the practice card: pick the card hand it is, say what the winner
      collects, then declare Mah Jongg; all three checked by the card and the table's payments.
- [x] **Calculator** (Tools): American in the style switch; choose the card (practice or yours), tap
      the hand that was made, say whether it was jokerless and who threw; the round wind, last-tile
      and kong switches are hidden. Unit cases in `tests/unit/mahjong-calculator.test.ts` (3) and an
      e2e in `tests/e2e/tools.spec.ts`.
- [x] **Ladder**: `mahjong-american` (table below).
- [x] **Text**: every new string in English and Spanish (`tests/unit/text-es.test.ts` passes).

#### Gate

| Item | Result |
| --- | --- |
| Rules document and file, options, presets, questions, golden cases, sources | `docs/rules/mahjong-american.md`, `styles/american.ts`, `american/` |
| Original practice card; a card typed in, checked, kept on the device | `american/practice-card.ts`; Tools, "Your American card" |
| Golden, engine and property tests under every preset | 27 golden and engine cases; property tests under four presets, a mix and a typed-in card, and CPU-played games; 4 learning tests |
| CPU levels on the ladder | Levels 1 to 4 pass over 200 games (table below); the top two margins are narrow |
| Learn track and practice; lesson lint | 5 lessons, 1 drill; `npm run lint:lessons` passes (Mahjong 46 lessons) |
| Calculator | 3 unit cases; e2e in `tests/e2e/tools.spec.ts` |
| `npm run check` | typecheck, lint, 848 unit tests (68 files), 61 property tests (11 files), lesson lint: green |
| e2e at the three sizes | `tests/e2e/mahjong-american.spec.ts` (a hand at level 2 through the whole Charleston, with the vote and the courtesy pass, to its end and the review; the exposure lesson with a joker; the drill; the card editor with an error, a fix, saving and a game from "My card"; the reference card): 15 passed. With `tools.spec.ts` (the American calculator) and `a11y.spec.ts` (the Charleston, the table in play and the card editor scanned): 51 passed. `mahjong.spec.ts`, `mahjong-riichi.spec.ts`, `mahjong-learn.spec.ts` and `mahjong-sichuan.spec.ts` again: 54 passed |
| Screenshots looked at | `tests/e2e/screens-m14c.spec.ts` → `screenshots/m14c/a*.png` (20 shots: phone, tablet and laptop) |

What the screenshots showed, and was fixed: the dealer's dealt fourteenth, passed on in the
Charleston, stood apart in the receiver's hand as if drawn; the card's long title squeezed the
counters' labels onto three lines; the word JOKER ran past its frame on a phone; the move list said
"You pass of 3 tiles" (now "You pass: 3 tiles"); "1 jokers" and "1 lines" (now singular); "You's
discard" in the result (every style); and the vote and courtesy prompts were missed by the loop
that walks through the Charleston (it now waits for the prompt after each pass's animation).

The ladder (`npm run ladder -- mahjong-american 200`: four-hand games at the League table, the
level under test in seats 0 and 2 against the other in 1 and 3, every deal played twice with the
seats swapped; a side scores when its two seats together end with more points; pass at 0.6):

| Rung | Won | Drawn | Lost | Score |
| --- | --- | --- | --- | --- |
| Level 1 against random play | 49 | 151 | 0 | 0.623 |
| Level 2 against level 1 | 156 | 23 | 21 | 0.838 |
| Level 3 against level 2 | 122 | 3 | 75 | 0.618 |
| Level 4 against level 3 | 122 | 5 | 73 | 0.623 |

Random play almost never makes a hand on the card, so most games against it end with nobody
paying (drawn); level 1 never lost one. The top two rungs pass narrowly. Level 4 as first built
(level 3 with weights on a hand's points and on the danger of feeding a player's exposures) scored
0.483 against level 3 over 60 games, and 0.467 with no danger weight. Counting scarce tiles for
more is what separated it. Measured against level 3: scarcity 1 0.600 over 60 games and 0.592 over
120 (0.583 with no danger weight); scarcity 0.5 0.608 over 120 and, with the points and danger
weights, 0.595 over 200; then over 200 games each, scarcity 0.5 with neither weight 0.623 (kept),
scarcity 0.75 0.583, scarcity 0.5 with more weight on keeping hands open (12) 0.595, and calls only
when they bring a hand two tiles closer 0.455. Keeping more hands open (20) without scarcity scored
0.508 over 60. Level 3 without keeping hands open scores 0.575 against level 2 over 120, so it
keeps it. No fifth level was tried.

#### Changes to the shared core, and why

As for Sichuan, each is off unless a style asks for it; the Hong Kong, Riichi and Sichuan files and
tests did not change. The passing rounds (with jokers kept back by `passes.keep`), `customShape` and
text options went in with Sichuan.

1. **Exposures of any size with jokers** (`CallRules.expose: { sizes, refuseDead }`, the `expose`
   claim with its size and jokers, melds of type `quint` and `sextet`, `Meld.kind` for the kind a
   set with jokers stands for). American calls a discard for a pung, kong, quint or sextet with
   jokers from the hand standing in; the claim window must offer each size with each number of
   jokers the hand allows, keep the choices secret and rank Mah Jongg above them, and an exposure
   takes no replacement draw. A discarded joker is never offered to a call where exposures take
   jokers. `arrange.ts` reads a quint or sextet as a kong for the styles that score sets.
2. **The joker exchange** (`CallRules.jokerSwap`, the `swap` action and event): on your turn,
   before you throw, a tile of the kind a joker stands for goes into that exposure and the joker
   comes to your hand. Only the engine moves tiles between seats.
3. **Dead hands** (`state.dead`, the `dead` event, `Style.exposuresFit`): the style decides whether
   a seat's exposures can still make a hand; the engine marks the seat dead and stops it calling
   and winning (it still draws and throws), and leaves its exposures out of the exchange. With
   `refuseDead` such an exposure is never offered (the learner table).
4. **Bonus tiles kept in the hand** (`replaceBonus: false`, `deadWall: 0`): flowers and jokers are
   ordinary tiles; the deal, the sample of hidden hands, lesson positions and the lesson linter's
   tile count (an exposure counts every tile, as it takes no replacement) follow that.
5. **A score line named by the style** (`ScoreLine.label`, kept through the codec): a hand from a
   card typed in has no name in the text catalogue, so the line carries its own ("Evens: FFF 2222a
   44b 666c 88a").

Outside the core: `rules.ts` (views and samples with `dead`; notation `expose 4 1`, `swap 2 0`;
the meld reader for quints, sextets and the kind; spare flowers and jokers back to the wall in
positions; `STYLES` gains `american`), `bots.ts` (American decisions and coach advice go to
`american/bot.ts`; `mj-swap` among the public ideas), `ui/` (above; `CardHand.tsx` draws a card
hand as tiles, `CardEditor.tsx` is the Tools screen at `#/tools/mahjong-card`; the drawn tile no
longer stands apart while tiles are passed), `calculator.ts` (`calculateCardHand`), `learn/game.ts`
(American numbers; flowers and jokers dealt into lesson hands; card groups such as `2026a` stripped
before the lesson linter looks for typed numbers), `learn/verify.ts`, `ladders.ts`, `shell/App.tsx`
and `shell/tools/ToolsScreen.tsx` (the card editor's route and link), `shell/table/TableScreen.tsx`
(the log list can take focus and has a name: axe found the scrollable log unreachable by keyboard
on the American table, where it first overflows), and the result's "on your discard" wording (it
said "You's discard" in every style).

#### Decisions

1. **No League card in the app.** The practice card's hands are our own; its sections follow the
   kinds of hands every card has (a year, evens, odds, like numbers, runs, threes sixes and nines,
   quints, winds and dragons, pairs), written for practice and checked against the set's limits.
2. **Your card stays on the device** (browser storage, one card). When a game starts with "My
   card", the card's text goes into the game's options, so the record replays and the review reads
   the same card even after the stored card changes or is cleared.
3. **Flowers are one kind** for every purpose (matching, calls, exchange); seasons count as flowers
   (eight in all).
4. **Defaults are the League table**: second Charleston on a vote, courtesy pass, blind passing,
   jokerless doubled, dead hands, the thrower paying double, eight jokers, four hands a game.
5. **The learner table refuses an exposure that would make the hand dead**, rather than letting the
   learner call and then be out of the hand.
6. **East's dealt fourteen is checked for Mah Jongg on East's first turn, after the Charleston**
   (rare either way, and passing first keeps the deal the same for everyone).
7. **The deal passes to the right after every hand**, as at League tables.
8. **A joker may be exchanged on your turn before you throw**, after a draw or a call; not from a
   dead hand's exposures; more than one in a turn.
9. **Blind passing passes on the first tiles to arrive**; a tile may travel through several blind
   passers, so every hand keeps its size.
10. **Choices before play are secret** (as for Sichuan); the vote's result and the tiles received
    are shown once all have chosen.
11. **The coach and the review measure a hand by its distance to the card**; the "tiles from
    ready" numbers of the other styles give way to the nearest card hands.
12. **Four levels at an American table**, as for Riichi and Sichuan.
13. **The card counter is short** ("Practice", or your card's title cut to fit), so the counters'
    labels keep to one line.

#### Not done (American)

- The top two rungs pass narrowly (0.618 and 0.623 over 200 games). A stronger level (reading the
  other players' exposures for the hands they are making, or a look-ahead over the wall) is not
  built; the danger weight as written made level 4 weaker.
- Penalties for a mistaken exposure or a false Mah Jongg (the app never allows either), the League's
  rule on who pays for the discard that gave a third exposure, ending a hand when three are dead,
  East's Mah Jongg on the dealt hand before the Charleston, bettors and the wall-game bonus.
- One stored card only; no import from a file or a photograph. A card line names one hand: a hand
  with alternatives ("any wind", "any dragon") is typed as a line per alternative.
- The calculator takes the card hand and who threw, not the tiles one by one.
- Riichi-style rated problems for American: the drill is generated, there is no stored problem set.
