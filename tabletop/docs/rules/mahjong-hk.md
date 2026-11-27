# Mahjong, Hong Kong Old Style, as implemented

Milestone 9. Four players, 144 tiles with flowers and seasons (136 without), 13-tile hands,
chow, pung and kong, a table of *faan* (番, "fahn": doubles) with a limit, and a minimum to win.
Hong Kong is the first rules file on the shared engine described in `docs/rules/mahjong-core.md`.
Code: `src/games/mahjong/styles/hong-kong.ts` (this rules file) on `src/games/mahjong/core/`;
golden cases: `tests/unit/mahjong-hk.test.ts` and `tests/unit/mahjong-engine.test.ts`. Riichi is
milestone 11; Chinese Official, Taiwanese, Sichuan Bloody and American come in milestone 14.

## The tiles

| Group | Tiles | Copies | Notation |
| --- | --- | --- | --- |
| Characters (萬子, *maan*) | 1 to 9 | 4 each | `1m` … `9m` |
| Dots (筒子, *tung*) | 1 to 9 | 4 each | `1p` … `9p` |
| Bamboo (索子, *sok*) | 1 to 9 | 4 each | `1s` … `9s` |
| Winds (風, *fung*) | East 東, South 南, West 西, North 北 | 4 each | `E` `S` `W` `N` |
| Dragons (三元, *saam jyun*) | White 白 (a blank frame), Green 發, Red 中 | 4 each | `Wd` `Gd` `Rd` |
| Flowers (花, *faa*) | Plum 梅 1, Orchid 蘭 2, Chrysanthemum 菊 3, Bamboo 竹 4 | 1 each | `F1` … `F4` |
| Seasons (季) | Spring 春 1, Summer 夏 2, Autumn 秋 3, Winter 冬 4 | 1 each | `S1` … `S4` |

1 and 9 of a suit are **terminals**; winds and dragons are **honours**. Flowers and seasons
are **bonus tiles**: they never stay in a hand.

## Seats, the deal and the turn

- The seats are East, South, West and North, in turn order; play passes to the right
  (counter-clockwise). The dealer is always East. In the app you sit at the bottom and the next
  player (the one after you) is on your right.
- The first dealer is chosen by lot (in the app, from the game's seed). The **prevailing wind**
  starts at East and moves on (South, West, North) each time the deal has gone all the way round.
- The wall is shuffled; the dealer takes 14 tiles and everyone else 13 (four at a time, three
  times, then one each and one more for the dealer).
- **Flowers.** A bonus tile is laid face up beside its owner and replaced at once by a tile from
  the back end of the wall: at the deal (the dealer first, then in turn), and whenever one is
  drawn. A replacement that is another bonus tile is replaced again.
- On your turn you draw from the front of the wall, then either **discard** a tile face up, declare
  a **kong**, or declare a **win** (self-drawn). The dealer starts by discarding without a draw.

## Calls on a discard

Any player may call for a discard that completes something in their hand:

| Call | Who | What it takes |
| --- | --- | --- |
| **Win** (食糊, *sik wu*) | anyone whose hand it completes | the discard, to finish the hand |
| **Kong** (槓, *gong*) | anyone holding three of that tile | the discard, plus the three: an exposed kong, then a replacement tile from the back of the wall |
| **Pung** (碰, *pung*) | anyone holding two of that tile | the discard, plus the pair: an exposed pung |
| **Chow** (上, *seung*) | only the next player in turn | the discard, plus two tiles that make a run of three in the same suit |

- **Priority:** a win beats a pung or kong, which beats a chow. A pung or kong can be called out of
  turn; play then continues from the caller, so the players in between lose their turn.
- **Several players calling a win** on one discard: under `first` (the usual *head bump*, 截糊) the
  first of them in turn after the discarder wins alone; under `all` each of them wins and is paid.
- After a chow or a pung you discard at once. After a kong you draw a replacement tile from the
  back of the wall first.
- On the **last discard** (the wall is empty) only a win may be called.
- In the app every call is decided in a short **claim window** after the discard. The players who
  can call are asked one after another in turn order, but nobody sees another player's choice
  until the window closes, so it works as if everyone called at once. A player is not asked when
  nothing they could call would beat a call already made.

## Kongs

- **Concealed kong** (暗槓): four of a kind in your hand, declared on your turn. It is laid down with
  its tiles shown and still counts as concealed.
- **Added kong** (加槓): the fourth tile added to a pung you exposed earlier, on your turn.
- **Exposed kong** (明槓): called on a discard, as above.
- Every kong draws a replacement tile from the back of the wall. A kong cannot be declared when the
  wall has no tile left to draw. In the app a kong is declared after a draw, never straight after a
  chow or pung (discard first).
- **Robbing a kong** (搶槓, `robKong`): when a player adds to a pung, anyone who can win with that tile
  may take it instead (the pung stays a pung). With `orphans`, a player waiting on thirteen orphans
  may also rob a concealed kong.

## Winning

A hand wins when it is complete and scores at least the minimum (`minFaan`):

- **Four sets and a pair.** A set is a chow (a run of three in one suit), a pung (three of a kind)
  or a kong (four of a kind). Exposed sets count.
- **Thirteen orphans** (十三么): one of each terminal and honour, plus one more of any of them.
- **Seven pairs** (七對子), only when `sevenPairs` gives it a value: seven different pairs, concealed.

The winner shows the hand and arranges it the way that scores most. A **self-drawn** win (自摸,
*zi mo*) is on your own draw, a replacement tile included. If the wall runs out and the last
discard is not won, the hand is an **exhaustive draw** (流局): nobody pays.

## The faan table

Faan add up, and the total is capped at the limit (`limit`). A limit hand scores the limit and
nothing is added to it. A hand worth no faan is a **chicken hand** (雞糊), which wins only when the
minimum is none.

| Pattern | Faan | Option |
| --- | --- | --- |
| **How the hand is built** | | |
| All chows (平糊, common hand): four chows and a pair | 1 | |
| All pungs (對對糊): four pungs or kongs and a pair | 3 | |
| Mixed one suit (混一色): one suit and honours | 3 | |
| Pure one suit (清一色): one suit, no honours | 7 | `fullFlush` 6 or 7 |
| Mixed orphans (混么九): only terminals and honours (adds to all pungs or seven pairs) | 1 | |
| Seven pairs (七對子) | not a win | `sevenPairs` 3 or 4 makes it a win |
| **Honour sets** | | |
| Dragon pung or kong (番子), each | 1 | |
| Seat wind pung or kong (門風) | 1 | |
| Prevailing wind pung or kong (圈風) | 1 | |
| Small three dragons (小三元): pungs of two dragons and a pair of the third | 5 | `smallDragons` 4 or 5 |
| Great three dragons (大三元): pungs of all three dragons | 8 | `greatDragons` 8 or limit |
| Small four winds (小四喜): pungs of three winds and a pair of the fourth | 6 | `smallWinds` 6 or limit |
| **How the hand is won** | | |
| Self-drawn (自摸) | 1 | |
| Concealed hand (門前清): no exposed sets (concealed kongs allowed) | 1 | `concealedSelfDrawn` 3: a concealed self-drawn hand scores 3 for the two |
| Robbing a kong (搶槓) | 1 | |
| Win by a kong (槓上開花): self-drawn on a kong's replacement tile | 1 | |
| Win by a double kong (槓上槓): on the replacement after a second kong in a row | 8 | |
| Win on the last tile (海底撈月): self-drawn with the wall's last tile | 1 | |
| Win on the last discard (河底撈魚) | 1 | |
| **Flowers** (144 tiles only) | | |
| Seat flower (正花): each flower or season with your seat's number (East 1, South 2, West 3, North 4), outside a full set | 1 | |
| A full set (一台花): all four flowers, or all four seasons | 2 | `flowerSet` 1, 2 or 3 |
| No flowers (無花): no bonus tile at all | 1 | `noFlowers` 0 or 1 |
| **Limit hands** | limit | |
| Thirteen orphans (十三么) · Nine gates (九子連環: 1112345678999 of one suit, concealed, plus any tile of it) · All honours (字一色) · All terminals (清么九) · Four concealed pungs (坎坎糊) · All kongs (十八羅漢) · Great four winds (大四喜) · Heavenly hand (天糊: the dealer wins on the deal) · Earthly hand (地糊: another player wins on the dealer's first discard) | limit | |

How the table is read, where sources leave it open:

- **Named hands absorb their pungs** (`namedHands: absorb`): small and great three dragons include
  their dragon pungs, and small four winds includes its seat and prevailing wind pungs. Under
  `stack` those pungs score their own faan as well.
- A pung completed by a discard counts as exposed for four concealed pungs; a hand that wins on a
  discard by completing its pair still has four concealed pungs.
- Mixed orphans with all honours or all terminals is the limit hand instead.
- A full set of four scores its set value instead of the seat flower inside it; a seat flower
  outside a full set scores 1.
- Flowers count toward the minimum.

## Points and payments

Faan become base points by the table chosen in `table` (the limit caps the faan first):

| Faan | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `half-spicy` (半辣, the usual table) | 1 | 2 | 4 | 8 | 16 | 24 | 32 | 48 | 64 | 96 | 128 | 192 | 256 | 384 |
| `full-spicy` (全辣) | 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 | 8192 |
| `old-style` (doubles at 1, 2, 3, 4, 7 and 10, then every three) | 1 | 2 | 4 | 8 | 16 | 16 | 16 | 32 | 32 | 32 | 64 | 64 | 64 | 128 |

With *B* the base points:

- **Self-drawn:** each of the other three pays the winner 2*B*.
- **Discard, `half-gun`** (半銃): the discarder pays 2*B* and each of the other two pays *B*.
- **Discard, `full-gun`** (全銃): the discarder pays 4*B* and the others nothing.
- **Robbing a kong** is paid as a discard, by the player who added to the pung.
- **Several winners on one discard** (`multipleWinners: all`) are each paid as above, by the players
  who did not win; winners never pay each other.
- The dealer pays and receives the same as everyone else. Payments always add up to zero; the
  scores start at zero.

## Rounds

- The dealer keeps the deal after winning, and after an exhaustive draw under
  `dealerKeeps: win-or-draw` (the default); under `win` a drawn hand passes the deal, and under
  `never` the deal always passes. When the deal passes, the next player in turn deals; when it has
  passed four times, the prevailing wind moves on.
- `length`: `hand` (a single hand), `east` (the East round), `east-south` (two rounds) or `full`
  (four rounds). The game ends when the last round is over. The app also ends a game after eight
  hands a round (eight for the East round, thirty-two for a full game), so a dealer who keeps the
  deal on drawn hands cannot make a game endless; the last hand is then the final one.
- Places go by score; equal scores share a place.

## Options

| Option | Values | Default |
| --- | --- | --- |
| `minFaan`: faan needed to win | 0, 1, 3 | 3 |
| `limit`: the most a hand can score | 8, 10, 13 | 10 |
| `table`: faan to points | `half-spicy`, `full-spicy`, `old-style` | `half-spicy` |
| `discardPays`: who pays on a discard win | `half-gun`, `full-gun` | `half-gun` |
| `flowers`: play with flowers and seasons | `on` (144 tiles), `off` (136) | `on` |
| `flowerSet`: faan for a full set of four | 1, 2, 3 | 2 |
| `noFlowers`: faan for holding no bonus tile | 0, 1 | 1 |
| `sevenPairs`: seven pairs as a winning hand | 0 (not a win), 3, 4 | 0 |
| `fullFlush`: pure one suit | 6, 7 | 7 |
| `smallDragons` | 4, 5 | 5 |
| `greatDragons` | 8, `limit` | 8 |
| `smallWinds` | 6, `limit` | 6 |
| `namedHands`: do named dragon and wind hands include their pungs | `absorb`, `stack` | `absorb` |
| `concealedSelfDrawn`: concealed and self-drawn together | 2, 3 | 2 |
| `multipleWinners` | `first`, `all` | `first` |
| `robKong` | `off`, `on`, `orphans` | `on` |
| `dealerKeeps` | `win-or-draw`, `win`, `never` | `win-or-draw` |
| `deadWall`: tiles never drawn at the end of the wall | 0, 14 | 0 |
| `length` | `hand`, `east`, `east-south`, `full` | `east` |

## Presets

| Preset | What it sets |
| --- | --- |
| **Hong Kong, three-faan minimum** (default) | Every default above: three faan to win, a 10-faan limit, the half-spicy table, half-gun payments, flowers. |
| **Hong Kong, one-faan minimum** | As the default, with a one-faan minimum: easier for new players. |
| **Chicken hands allowed** | No minimum: any complete hand wins, and a chicken hand (no faan) is paid one base point. |
| **Discarder pays all** | As the default, with full-gun payments: the discarder pays for the whole table, as many Hong Kong tables play now. |
| **No flowers (136 tiles)** | As the default, without flowers and seasons. |
| **Old style score sheet** | Doubles at 1, 2, 3, 4, 7 and 10 faan; seven pairs 4; small three dragons 4; pure one suit 6: the values of an older score sheet. |

## Ask before you sit

1. How many faan to win: none, one or three? Do flowers count toward it?
2. What is the limit (8, 10 or 13 faan), and which table turns faan into money: half spicy or full
   spicy?
3. On a discard win, does the discarder pay for everyone, or pay double while the others pay single?
4. Do you play with flowers? What do a seat flower, a full set and no flowers score?
5. If two players call a win on the same discard, do both win, or the first in turn?
6. Can a kong be robbed? Can thirteen orphans rob a concealed kong?
7. Does the dealer keep the deal after a drawn hand?
8. Is seven pairs a winning hand here, and what is it worth?
9. Pure one suit 6 or 7? Small three dragons 4 or 5? Great three dragons and small four winds: a
   number, or the limit? Do those named hands also count their dragon and wind pungs?
10. One round or four? Is a dead wall kept at the end?
11. Is anyone made to pay for everyone when they feed the last set of a big hand (*bau*, 包)? The app
    does not play this rule yet.

## Golden cases (tested)

- The sets: 144 tiles with flowers, 136 without; a deal gives the dealer 14 and the others 13,
  and every bonus tile is replaced from the back of the wall at once, again when the replacement
  is one too.
- A chow is offered only to the next player; a pung and a kong to anyone with the pair or three;
  a win to anyone whose hand the discard completes with enough faan.
- Claim priority: a win beats a pung, a pung beats a chow; the player whose pung or kong was
  beaten keeps their tiles; play continues from the caller.
- Two players able to win on one discard: only the first in turn wins under `first`; both win and
  are paid under `all`.
- A kong then a win on the replacement tile scores win by a kong; a second kong in a row then a
  win scores the double kong.
- Robbing an added kong wins for the robber, paid by the player who added; with `robKong: off` it is
  not offered; with `orphans`, thirteen orphans robs a concealed kong.
- On the last discard only a win can be called; an exhaustive draw pays nothing and keeps the
  dealer under `win-or-draw`, passes the deal under `win`.
- Every pattern in the faan table, each in a hand of its own, and the stacking rules: named hands
  absorbing their pungs (and stacking under `stack`), mixed orphans with all pungs, the concealed
  self-drawn hand under both settings, flowers (seat flowers, full sets, no flowers).
- The minimum: a hand below it is not offered as a win; at it, it is.
- The limit: a hand above it is capped; a limit hand scores it; the three point tables.
- Payments: self-drawn, discard under half-gun and full-gun, robbing a kong, several winners; the
  deltas always add up to zero.
- Rounds: the dealer keeps the deal after a win, the deal passes after a loss, the prevailing wind
  moves on after four passes, and the game ends after the rounds chosen.

## Not implemented, on purpose

- **Dice, building and breaking the wall.** The shuffled wall is the same thing to the players; the
  Table-ready lessons (milestone 10) teach the ritual.
- **Responsibility payments** (*bau*, 包): feeding the last set of great three dragons or great four
  winds, the "twelve tiles" rule, or the tile that let someone kong and then win on the
  replacement. Common at some tables; each is a payment option to add later.
- **Passing a winning discard** (過水): Hong Kong has no rule that stops you winning on a tile you
  let go earlier, so the app has none.
- **Flower hands**: seven flowers robbing the eighth, eight flowers winning at once, and an extra
  faan for winning on a flower's replacement tile. Rare; easy to add as options.
- **False wins and their penalties**: the app never lets anyone declare a hand that does not win.
- **Money**: the app counts points from zero; no stakes.
- A kong straight after a chow or pung (you discard first), and robbing a concealed kong with any
  hand but thirteen orphans.

## Sources

Read on 2026-11-27. Direct downloads of en.wikipedia.org and a few rule sites were refused by the
build environment's network policy, so these pages were read through search-engine extracts of
their text; values were taken only where two or more sources agree, and each disagreement found
became an option or a preset.

- Hong Kong mahjong scoring rules, Wikipedia (en.wikipedia.org/wiki/Hong_Kong_mahjong_scoring_rules):
  the three-faan minimum, 13 as the absolute limit with lower table limits, half-spicy and
  full-spicy tables, the faan of each pattern, limit hands, the Hidden Treasure note, and that the
  dragon pungs add to small three dragons (an option here).
- Hong Kong Old Style Scoring, Mahjong Wiki (mahjong.wikidot.com/rules:hong-kong-old-style-scoring):
  all chows, self-drawn, last tile and last discard, seat wind and seat flower at 1; "fully
  concealed" at 3 (the `concealedSelfDrawn` option); its internal disagreements on big hands.
- Nupa's Hong Kong Old Style Mahjong Scoring Sheet v2.0 (gist.github.com): the old-style point table
  (doubling at 1, 2, 3, 4, 7, 10), little three dragons and seven pairs at 4, full flush at 6, the
  discarder paying double and everyone paying double on a self-draw (the "Old style score sheet"
  preset).
- mahjonggame.hk scoring chart, small three dragons and flowers pages, and its payout calculator:
  the half-spicy table, full-gun and half-gun payments, flowers (seat flower 1, set 2, no flowers 1),
  named hands absorbing their pungs.
- TileBuddy's Hong Kong faan guide and limit-hands guide (tilebuddy.app), zossoz.com's Hong Kong
  scoring list, tablemahjong.com, therulebook.com and playmahjongsf.com: cross-checks of the faan
  values, small four winds at 6 or 10 or the limit, a full set at 2 or 3, the dead wall of 14 or none,
  the dealer keeping the deal after a draw.
- Hong Kong Mahjong Rules handouts (mahjlife.com, aimj.altervista.org): flowers replaced from the
  back of the wall, the dealer repeating on a win or a draw, the kong box.
