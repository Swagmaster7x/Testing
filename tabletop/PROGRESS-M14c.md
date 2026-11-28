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
