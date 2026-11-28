# Mahjong: Taiwanese (16-tile) as implemented

The fourth style on the shared engine (`src/games/mahjong/styles/taiwanese.ts`; the core is described
in `mahjong-core.md`). Taiwanese mahjong (台灣麻將) is played with sixteen-tile hands, flowers that
score for your seat, hands counted in tai (台), and payments that are a base stake plus a stake for
each tai. The dealer adds tai to every payment it takes part in, more for each hand it keeps the
deal. Values vary from table to table more than in any other style, so every disputed value is an
option (below), and presets name common sets of them.

## The tiles

144 tiles: the three suits 1 to 9 (characters `m`, dots `p`, bamboo `s`), four winds and three
dragons, four of each, and eight flowers: four flowers and four seasons, numbered 1 to 4. A flower
is set aside when it is drawn or dealt and replaced from the back of the wall.

## The table

- The dealer is East; seat winds run East, South, West, North to the dealer's right. Sixteen tiles
  each, seventeen to the dealer, who throws first.
- The last 16 tiles of the wall are not drawn (`deadWall: 16`): when only they are left, the hand
  is drawn. Kong and flower replacements come from the back of the wall.
- **The dealer keeps the deal** after winning and after a drawn hand (`dealerKeeps: win-or-draw`);
  when another player wins, the deal passes to the right. Each hand the dealer keeps adds one to
  the **streak** (連莊); it goes back to nothing when the deal passes.
- A game is one round of the prevailing wind by default (`length: east`, a round lasts until each
  seat has dealt); four rounds (一將) is an option. A round ends after at most sixteen hands.

## Calls

- **Chow** only on the discard of the player on your left; **pung** and **kong** on anyone's; a
  **win** on anyone's. A win beats a pung or kong, which beats a chow.
- **Several players may win on one discard** (一炮多響, `multipleWinners: all`); each is paid by the
  discarder. With `first`, only the first in turn after the discarder wins.
- Kongs as in every style (concealed, added, called), each drawing a replacement. **Robbing a
  kong** (搶槓) is allowed by default.

## Winning hands

- **Five sets and a pair** (seventeen tiles): any five chows, pungs or kongs and a pair.
- **Lik gu lik gu** (嚦咕嚦咕, `pairsAndPung: on`): seven pairs and a pung, all concealed.
- **Eight flowers** (八仙過海, `flowerWins`): a player who sets aside all eight flowers wins at once,
  whatever the hand.
- **Seven flowers robbing the eighth** (七搶一, `flowerWins`): when a player holds seven flowers and
  another player draws the eighth, the seven-flower player wins at once. (At a table the robber
  may choose; the app always takes it.)
- There is no minimum by default: a hand with no tai may win. `minTai` sets one.

## Scoring: tai

A hand's tai are added up. Several of them depend on the hand, the others on how it was won and on
the dealer.

| Tai | Pattern (台型) | What it needs |
| --- | --- | --- |
| 1 | Dealer (莊家) | The winner is the dealer (see below for a dealer who pays) |
| 2 per hand | Dealer's streak (連莊) | The winner is the dealer, kept the deal that many hands in a row |
| 1 | Self-drawn (自摸) | Won on your own draw |
| 1 | Concealed hand (門清) | Nothing called (concealed kongs allowed), won on a discard |
| 3 (2) | Concealed and self-drawn (門清自摸, 不求人) | Nothing called, self-drawn: replaces the two above (`concealedSelfDrawn`) |
| 1 each | Dragon pung (三元牌) | A pung or kong of a dragon |
| 1 | Seat wind (門風) | A pung of your seat wind |
| 1 | Round wind (圈風) | A pung of the round's wind |
| 1 each | Seat flower (正花) | Your seat's flower and your seat's season (East 1, South 2, West 3, North 4) |
| 2 | A set of four flowers (花槓) | All four flowers, or all four seasons (its seat flower is part of it) |
| 1 | Last tile (海底撈月) | Self-drawn with the last tile that can be drawn |
| 1 | Last discard (河底撈魚) | Won on the discard after the last draw |
| 1 | Win by a kong (槓上開花) | Self-drawn with a kong's replacement tile |
| 1 | Robbing a kong (搶槓) | Won on a tile added to a pung |
| 1 | One-tile wait (獨聽) | Only one kind of tile could win the hand (an edge, a closed or a pair wait) |
| 2 | All melded (全求人) | Five called sets, won on a discard with a pair wait (no one-tile wait as well) |
| 2 | All chows (平胡) | Five chows and a suit pair, no flowers, no honours, won on a discard, not on a one-tile wait |
| 2 | Three concealed pungs (三暗刻) | Three pungs or kongs concealed (a pung completed by a discard is not) |
| 5 | Four concealed pungs (四暗刻) | Four of them |
| 8 | Five concealed pungs (五暗刻) | Five of them |
| 4 | All pungs (碰碰胡) | Five pungs or kongs |
| 4 | Half flush (混一色) | One suit and honours |
| 8 | Full flush (清一色) | One suit only |
| 16 (8) | All honours (字一色) | Winds and dragons only (`allHonours`); all pungs not counted with it |
| 4 | Little three dragons (小三元) | Two dragon pungs and a dragon pair (the dragon pungs not counted with it) |
| 8 | Big three dragons (大三元) | Three dragon pungs (the dragon pungs not counted with it) |
| 8 | Little four winds (小四喜) | Three wind pungs and a wind pair (the wind pungs not counted with it) |
| 16 | Big four winds (大四喜) | Four wind pungs (the wind pungs not counted with it) |
| 8 | Lik gu lik gu (嚦咕嚦咕) | Seven pairs and a pung (closed by definition: not counted as concealed) |
| 8 | Eight flowers (八仙過海) | All eight flowers (the flowers are not counted again) |
| 8 | Seven robbing one (七搶一) | Seven flowers and the eighth robbed (the flowers are not counted again) |
| 24 | Heavenly hand (天胡) | The dealer wins on the deal (no concealed, self-drawn or wait tai with it) |
| 16 | Earthly hand (地胡) | Another player wins on their first draw, before any call |
| 16 | Human hand (人胡) | A player wins on the dealer's first discard |

Where the tiles can be read in more than one way, the reading that scores most counts.

## Payments

Each payer pays **base + tai × per tai**: the base stake (`base`) and the stake for each tai
(`perTai`). The defaults are 100 and 20 (a "100/20" table).

- **On a discard**, only the discarder pays. When several win on one discard, it pays each.
- **Self-drawn**, each of the other three pays.
- **The dealer**: when the dealer wins, its dealer and streak tai are in the hand, so every payer
  pays them. When another player wins and the dealer pays (as the discarder, or as one of the
  three on a self-draw), the dealer pays **1 + 2 × streak** tai more. A payer who is not the dealer
  pays only the hand.
- Seven robbing one is paid by the player who drew the eighth flower, as for a discard; eight
  flowers is paid by everyone, as for a self-draw.
- A drawn hand pays nothing.

## Options

| Option | Values (default first) |
| --- | --- |
| `base` stake | 100, 50, 30, 300 |
| `perTai` stake | 20, 10, 50, 100 |
| `minTai` to win | 0, 1, 2 |
| `length` | east (one round), east-south, full (four rounds), hand (one hand) |
| `dealerKeeps` | win-or-draw, win |
| `multipleWinners` on one discard | all, first |
| `concealedSelfDrawn` | 3, 2 |
| `allHonours` | 16, 8 |
| `pairsAndPung` (lik gu lik gu) | on, off |
| `flowerWins` (eight flowers, seven robbing one) | on, off |
| `robKong` | on, off |
| `deadWall` tiles never drawn | 16, 0 |

## Presets

| Preset | What changes |
| --- | --- |
| Common table, 100/20 (`tw-common`) | The defaults |
| Small stakes, 30/10 (`tw-small`) | `base: 30`, `perTai: 10` |
| Four rounds (`tw-full`) | `length: full` |
| Strict table (`tw-strict`) | `multipleWinners: first`, `dealerKeeps: win`, `minTai: 1`, `concealedSelfDrawn: 2` |
| One hand (`tw-hand`) | `length: hand` (practice and lessons) |

## Ask before you sit

- What are the stakes: the base and each tai (100/20, 50/20, 30/10)?
- Is there a minimum, or may a hand with no tai win?
- Does the dealer keep the deal after a drawn hand? How many tai is the streak worth?
- May several players win on one discard?
- Concealed and self-drawn: 3 tai or 2? All honours: 16 or 8? Are lik gu lik gu, eight flowers
  and seven robbing one played?
- Heavenly, earthly and human hands: how many tai?
- How many tiles are left at the end of the wall?
- Is anything paid at once for a kong?

## Golden cases (tested, `tests/unit/mahjong-taiwanese.test.ts`)

- A 16-tile hand of five sets and a pair; lik gu lik gu; neither is complete one tile short.
- Self-drawn, concealed and concealed-self-drawn (3 or 2); dragon, seat and round wind pungs.
- Seat flowers in both sets; a set of four flowers with its seat flower inside it.
- One-tile wait only when one kind wins; all chows (with and without flowers or a self-draw).
- Concealed pungs (a pung completed by a discard is not concealed): three, four, five.
- All pungs, half flush, full flush, all honours (16 or 8), little and big dragons and winds.
- Dealer tai: the dealer wins with a streak of two (1 + 4 tai); the dealer pays a non-dealer's win
  (1 + 2 × streak more); a non-dealer pays only the hand.
- Payments: base + tai × per tai on a discard and on a self-draw; two winners on one discard.
- The engine: 16 tiles each and 17 to the dealer; the dead wall of 16; the dealer keeping the deal
  after a win and a draw, with the streak; eight flowers winning at once; seven robbing one paid by
  the drawer.

## Not implemented, on purpose

- Payments for a kong made at once, and penalties for false wins.
- Declaring ready at the start (天聽, 地聽).
- Choosing not to rob with seven flowers (the app always does).
- A dealer's streak paid to the player who ends it (拉莊) beyond the 1 + 2 × streak tai above.

## Notation

As for every style (`mahjong-core.md`). Hands hold sixteen tiles (seventeen with the drawn one).

## Sources (read 2026-11-27)

Rule sites (mahjongtime.com, mahjongo.com, sloperama.com, the Taipei Times) were refused by this
environment's network policy; what follows was reachable:

- Wikipedia, "Scoring in Mahjong" (en, revision 1373848615), Taiwanese scoring: tai counted
  linearly, base plus a factor for each tai (3 and 2: a 5-tai hand pays 13), the discarder pays
  each winner, every other player pays a self-drawn win, and the dealer's extra tai, one plus twice
  the number of hands it has kept the deal, added to its winnings or losses; no limit.
- Wikipedia, "Mahjong" (en, revision 1387708448): sixteen-tile hands, dealer bonuses and repeated
  dealerships, several winners on one discard, all eight flowers an automatic win.
- Search-engine extracts (2026-11-27) of Taiwanese tai tables (MahJongo's Taiwan rules page, PTT
  MJ board posts, uptogo.com.tw, kikinote.net): dealer 1, self-drawn 1, concealed-and-self-drawn 3
  (5 on some online sites), four concealed pungs 5, five 8, all pungs 4, half flush 4, full flush 8,
  big four winds 16 (8 or 24 on some sites), seven flowers and all flowers 8; heavenly, earthly and
  human hands vary widely (64, 64 and 32 on one site).

Values that sources disagree on became options; the rest follow the values most of them give.
