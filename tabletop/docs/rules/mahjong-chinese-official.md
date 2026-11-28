# Mahjong: Chinese Official (Mahjong Competition Rules) as implemented

The third style on the shared engine (`src/games/mahjong/styles/chinese-official.ts`; the core is
described in `mahjong-core.md`). Chinese Official, also called MCR, Guóbiāo Májiàng (国标麻将) or
competition mahjong, is the standard published by the China State Sports Commission in 1998 and
played in tournaments, above all in Europe. Its scoring is built from 81 named patterns (fan, 番,
called "points" in English), and a hand needs eight points to win. The defaults follow the rulebook;
every rule that tables vary is an option (below), and presets name common sets of them.

## The tiles

144 tiles: the three suits 1 to 9 (characters `m`, dots `p`, bamboo `s`), four winds and three
dragons, four of each, and eight flowers (four flowers and four seasons, one each). With
`flowers: off` the set is 136 tiles. A flower is set aside when it is drawn or dealt and replaced
from the back of the wall. There is no dead wall: play goes on until the last tile is drawn.

## The table

- The dealer is East; seat winds run East, South, West, North to the dealer's right. Thirteen tiles
  each, fourteen to the dealer, who throws first.
- **The deal always passes.** After every hand, won or drawn, the deal moves to the right; there
  are no repeated hands and no counters. Four hands make a round, and the prevailing wind moves on.
  A full game is the East, South, West and North rounds: exactly sixteen hands (`length: full`,
  the default). Shorter games are options.
- (At a tournament the players also change seats at each new round; the app keeps everyone in
  their seats, which changes no score.)

## Calls

- **Chow** only on the discard of the player on your left; **pung** and **kong** on anyone's; a
  **win** on anyone's. A win beats a pung or kong, which beats a chow.
- Only one player wins a hand: when two could win on one discard, the first in turn after the
  discarder takes it.
- A kong is concealed (four in your hand), added (a drawn fourth on your pung) or melded (called on
  a discard), and draws a replacement tile from the back of the wall.
- **Robbing the kong**: a player whose hand the tile added to a pung completes may win on it.
  Concealed kongs cannot be robbed.

## Winning shapes

- Four sets and a pair, sets being chows, pungs and kongs.
- **Seven pairs** (closed). Four alike may count as two pairs.
- **Thirteen orphans** (closed): one of each terminal and honour and a second of one of them.
- **Knitted straight** (组合龙): the nine tiles 1-4-7 of one suit, 2-5-8 of a second and 3-6-9 of
  the third (any assignment of the three runs to the three suits) count as three sets; with one
  more set (which may be called) and a pair the hand is complete.
- **Honours and knitted tiles** (全不靠, closed): fourteen different tiles, all drawn from one
  knitted set of nine (as above) and the seven honours, with no pair and no set.

## Scoring: the 81 patterns

A winning hand is matched against the patterns below; its points are the sum. A hand needs **eight
points, not counting flowers**, to win. A hand that scores nothing at all apart from flowers is a
**Chicken Hand**, which is itself worth eight. Flowers add a point each to the total, so they raise
what a win collects but never make a hand legal.

How patterns combine (the rulebook's principles):

1. **Non-repeat**: a pattern that another pattern implies is not counted with it (the "not
   counted" column). A pattern excluded by a pattern that is itself counted stays excluded.
2. **Non-separation**: sets used together for a pattern of three or four sets are not broken up
   again to make patterns of two of them.
3. **Non-identical**: a set already used for a pattern may not be used again with another set for
   the same pattern.
4. **High versus low**: when the tiles can be arranged several ways, the arrangement that scores
   most counts.
5. **Account once**: once some sets have made a pattern, each remaining set may be combined only
   once with a set already used. With three chows at most two two-chow patterns count, with four at
   most three; the option `accountOnce: twice` allows each set to be used in two patterns instead
   (a reading some online sites use).

| Points | Pattern | What it needs | Not counted with it |
| --- | --- | --- | --- |
| 88 | Big Four Winds (大四喜) | Pungs or kongs of all four winds | Big Three Winds, All Pungs, Seat Wind, Prevalent Wind, Pung of Terminals or Honours |
| 88 | Big Three Dragons (大三元) | Pungs or kongs of all three dragons | Dragon Pung, Two Dragon Pungs |
| 88 | All Green (绿一色) | Only 2, 3, 4, 6, 8 bamboo and Green dragons | — |
| 88 | Nine Gates (九莲宝灯) | 1112345678999 of one suit, closed, and one more of that suit | Full Flush, Concealed Hand, Pung of Terminals or Honours, No Honours |
| 88 | Four Kongs (四杠) | Four kongs | Three Kongs, Two Melded Kongs, Two Concealed Kongs, Melded Kong, Concealed Kong, All Pungs, Single Wait |
| 88 | Seven Shifted Pairs (连七对) | Seven pairs in a run of one suit | Seven Pairs, Full Flush, Concealed Hand, Single Wait |
| 88 | Thirteen Orphans (十三幺) | As above | All Types, Concealed Hand, Single Wait |
| 64 | All Terminals (清幺九) | Only 1s and 9s | All Terminals and Honours, Outside Hand, All Pungs, Pung of Terminals or Honours, No Honours |
| 64 | Little Four Winds (小四喜) | Three wind pungs and a wind pair | Big Three Winds, Pung of Terminals or Honours |
| 64 | Little Three Dragons (小三元) | Two dragon pungs and a dragon pair | Dragon Pung, Two Dragon Pungs |
| 64 | All Honours (字一色) | Only winds and dragons | All Terminals and Honours, Outside Hand, All Pungs, Pung of Terminals or Honours |
| 64 | Four Concealed Pungs (四暗刻) | Four concealed pungs or kongs | All Pungs, Three Concealed Pungs, Two Concealed Pungs, Concealed Hand |
| 64 | Pure Terminal Chows (一色双龙会) | 123, 123, 789, 789 and 55 of one suit | Full Flush, All Chows, Seven Pairs, Pure Double Chow, Two Terminal Chows, No Honours |
| 48 | Quadruple Chow (一色四同顺) | Four identical chows | Pure Triple Chow, Pure Shifted Pungs, Pure Double Chow, Tile Hog |
| 48 | Four Pure Shifted Pungs (一色四节高) | Pungs of four numbers in a row, one suit | Pure Triple Chow, Pure Shifted Pungs, All Pungs |
| 32 | Four Pure Shifted Chows (一色四步高) | Four chows of one suit each one or each two up from the last | Pure Shifted Chows, Short Straight, Two Terminal Chows |
| 32 | Three Kongs (三杠) | Three kongs | Two Melded Kongs, Two Concealed Kongs, Melded Kong, Concealed Kong |
| 32 | All Terminals and Honours (混幺九) | Only 1s, 9s and honours | All Pungs, Outside Hand, Pung of Terminals or Honours |
| 24 | Seven Pairs (七对) | Seven pairs | Concealed Hand, Single Wait |
| 24 | Greater Honours and Knitted Tiles (七星不靠) | Honours and knitted tiles with all seven honours | Lesser Honours and Knitted Tiles, All Types, Concealed Hand, Single Wait |
| 24 | All Even Pungs (全双刻) | Four pungs of 2, 4, 6 or 8 and a pair of them | All Pungs, All Simples, No Honours |
| 24 | Full Flush (清一色) | One suit only | No Honours |
| 24 | Pure Triple Chow (一色三同顺) | Three identical chows | Pure Shifted Pungs, Pure Double Chow |
| 24 | Pure Shifted Pungs (一色三节高) | Pungs of three numbers in a row, one suit | Pure Triple Chow |
| 24 | Upper Tiles (全大) | Only 7, 8, 9 | Upper Four, No Honours |
| 24 | Middle Tiles (全中) | Only 4, 5, 6 | All Simples, No Honours |
| 24 | Lower Tiles (全小) | Only 1, 2, 3 | Lower Four, No Honours |
| 16 | Pure Straight (清龙) | 123, 456, 789 of one suit | Short Straight, Two Terminal Chows |
| 16 | Three-Suited Terminal Chows (三色双龙会) | 123 and 789 of two suits, 55 of the third | All Chows, Mixed Double Chow, Two Terminal Chows, No Honours |
| 16 | Pure Shifted Chows (一色三步高) | Three chows of one suit each one or each two up | — |
| 16 | All Fives (全带五) | A 5 in every set and the pair | All Simples, No Honours |
| 16 | Triple Pung (三同刻) | Pungs of one number in all three suits | Mixed Double Pung |
| 16 | Three Concealed Pungs (三暗刻) | Three concealed pungs or kongs | Two Concealed Pungs |
| 12 | Lesser Honours and Knitted Tiles (全不靠) | As above | All Types, Concealed Hand, Single Wait |
| 12 | Knitted Straight (组合龙) | The nine knitted tiles | — |
| 12 | Upper Four (大于五) | Only 6, 7, 8, 9 | No Honours |
| 12 | Lower Four (小于五) | Only 1, 2, 3, 4 | No Honours |
| 12 | Big Three Winds (三风刻) | Three wind pungs | Pung of Terminals or Honours (for those winds) |
| 8 | Mixed Straight (花龙) | 123, 456, 789 in three different suits | — |
| 8 | Reversible Tiles (推不倒) | Only 1234589 dots, 245689 bamboo and White dragons | One Voided Suit |
| 8 | Mixed Triple Chow (三色三同顺) | The same chow in all three suits | Mixed Double Chow |
| 8 | Mixed Shifted Pungs (三色三节高) | Pungs of three numbers in a row, one in each suit | — |
| 8 | Chicken Hand (无番和) | Nothing else scores (flowers aside) | — |
| 8 | Last Tile Draw (妙手回春) | Self-drawn with the last tile of the wall | Self-Drawn |
| 8 | Last Tile Claim (海底捞月) | Won on the last discard | — |
| 8 | Out with Replacement Tile (杠上开花) | Self-drawn with a kong's replacement tile | Self-Drawn |
| 8 | Robbing the Kong (抢杠和) | Won on a tile added to a pung | Last Tile |
| 6 (8) | Two Concealed Kongs (双暗杠) | Two concealed kongs (8 with `twoConcealedKongs: 8`) | Two Concealed Pungs, Concealed Kong |
| 6 | All Pungs (碰碰和) | Four pungs or kongs | — |
| 6 | Half Flush (混一色) | One suit and honours | — |
| 6 | Mixed Shifted Chows (三色三步高) | Chows one up from each other, one in each suit | — |
| 6 | All Types (五门齐) | Characters, dots, bamboo, a wind and a dragon | — |
| 6 | Melded Hand (全求人) | Four called sets, won on a discard with a pair wait | Single Wait |
| 6 | Two Dragon Pungs (双箭刻) | Two dragon pungs | Dragon Pung |
| 4 | Outside Hand (全带幺) | A terminal or honour in every set and the pair | — |
| 4 | Fully Concealed Hand (不求人) | Nothing called (concealed kongs allowed), self-drawn | Self-Drawn |
| 4 | Two Melded Kongs (双明杠) | Two kongs, at least one melded (see `mixedKongs`) | Melded Kong |
| 4 | Last Tile (和绝张) | The winning tile is the last of its kind: the other three lie face up | — |
| 2 | Dragon Pung (箭刻) | Each dragon pung | — |
| 2 | Prevalent Wind (圈风刻) | A pung of the round's wind | — |
| 2 | Seat Wind (门风刻) | A pung of your seat wind | — |
| 2 | Concealed Hand (门前清) | Nothing called (concealed kongs allowed), won on a discard | — |
| 2 | All Chows (平和) | Four chows and a suit pair | — |
| 2 | Tile Hog (四归一) | Each four alike used without making a kong | — |
| 2 | Mixed Double Pung (双同刻) | Pungs of one number in two suits | — |
| 2 | Two Concealed Pungs (双暗刻) | Two concealed pungs or kongs | — |
| 2 | Concealed Kong (暗杠) | A concealed kong | — |
| 2 | All Simples (断幺) | No 1s, 9s or honours | No Honours |
| 1 | Pure Double Chow (一般高) | Two identical chows | — |
| 1 | Mixed Double Chow (喜相逢) | The same chow in two suits | — |
| 1 | Short Straight (连六) | Two chows of one suit making six in a row | — |
| 1 | Two Terminal Chows (老少副) | 123 and 789 of one suit | — |
| 1 | Pung of Terminals or Honours (幺九刻) | Each pung of 1s, 9s or a wind that is neither your seat's nor the round's | — |
| 1 | Melded Kong (明杠) | A melded or added kong | — |
| 1 | One Voided Suit (缺一门) | Exactly two of the three suits | — |
| 1 | No Honours (无字) | No winds or dragons | — |
| 1 | Edge Wait (边张) | Won on the 3 of 1-2 or the 7 of 8-9, and only on that tile | — |
| 1 | Closed Wait (坎张) | Won on the middle of a chow, and only on that tile | — |
| 1 | Single Wait (单钓将) | Won on the pair, and only on that tile | — |
| 1 | Self-Drawn (自摸) | Won on your own draw | — |
| 1 | Flower Tiles (花牌) | Each flower set aside | Never counts toward the eight |

Notes on the table:

- A pung completed by a discard is a melded pung for Concealed Pungs; a pung completed by your own
  draw is concealed. A concealed kong counts as a concealed pung.
- The three wait patterns count only when exactly one kind of tile could win the hand, and only one
  of them at a time. They never count for a tile that completes a knitted straight.
- A pattern that excludes Concealed Hand also leaves out Fully Concealed Hand: when such a hand is
  self-drawn it scores Self-Drawn instead (Seven Pairs, Thirteen Orphans, Nine Gates, Four Concealed
  Pungs, Seven Shifted Pairs and the honours-and-knitted hands are closed by definition).
- Pungs of a seat or prevailing wind score those patterns, not Pung of Terminals or Honours; a wind
  that is both scores both.
- The knitted straight counts as three chows for All Chows.
- Melded Hand needs four sets called from discards (an added kong breaks it) and the win on a
  discard that completes the pair.
- Last Tile looks at tiles face up on the table: discards still lying there and called sets
  (concealed kongs lie face down). On a self-drawn win the other three must all be in sight.

## Settlement

The winner of an *x*-point hand (flowers included) collects:

- **On a discard**: 8 + *x* from the discarder, and 8 from each of the other two players.
- **Self-drawn**: 8 + *x* from each of the other three.

A drawn hand pays nothing. Places at the end go by the points won and lost.

## Options

| Option | Values (default first) |
| --- | --- |
| `minPoints` to win (flowers never count) | 8, 4, 0 |
| `flowers` | on (144 tiles), off (136) |
| `length` | full (sixteen hands), east-south (eight), east (four), hand (one) |
| `twoConcealedKongs` | 6 (the 1998 and 2006 rulebooks), 8 (the 2014 change) |
| `accountOnce` | official (each remaining set combined once), twice (each set in at most two patterns) |
| `mixedKongs` one melded and one concealed kong | two-melded (Two Melded Kongs, 4), separate (Melded Kong 1 and Concealed Kong 2) |
| `robKong` | on, off |

## Presets

| Preset | What changes |
| --- | --- |
| Official, sixteen hands (`co-official`) | The defaults |
| One round (`co-east`) | `length: east` |
| No flowers (`co-no-flowers`) | `flowers: off`, as many European tournaments play |
| Learner table (`co-learner`) | `minPoints: 4`, `length: east` |
| One hand (`co-hand`) | `length: hand` (practice and lessons) |

## Ask before you sit

- Eight points to win? Do flowers count toward it (they should not)?
- Are flowers played at all?
- Sixteen hands, or one round? Do players change seats each round?
- Two Concealed Kongs: 6 or 8? One melded and one concealed kong: 4, or 1 and 2?
- How is the account-once rule read: each remaining set once, or each set in at most two patterns?
- Is there a penalty for a false win (in tournaments, 10 to each other player)?

## Golden cases (tested, `tests/unit/mahjong-chinese-official.test.ts`)

- Chicken Hand: three called chows and a pung, a pair of East, all three suits, won on a two-sided
  wait: 8 points; with two flowers 10; on a discard the discarder pays 18 and the others 8.
- The minimum: a hand of 6 points with three flowers cannot win; with 8 points and no flowers it can.
- Mixed Triple Chow with All Chows; Pure Straight and Short Straight not both; Mixed Straight.
- Seven Pairs with a four as two pairs and Tile Hog; Seven Shifted Pairs (88) without Seven Pairs or
  Full Flush.
- Thirteen Orphans; Nine Gates; Big Three Dragons without Dragon Pung; Little Four Winds with the
  seat wind; All Honours.
- Knitted Straight with a chow and a pair (with All Chows); Lesser Honours and Knitted Tiles;
  Greater Honours and Knitted Tiles; Lesser with the full knitted straight (12 + 12).
- Concealed pungs: a pung completed by a discard is melded; Three Concealed Pungs without Two.
- Waits: an edge, a closed and a single wait each count only when they are the only winning tile.
- Fully Concealed Hand on a self-draw; Concealed Hand on a discard; Melded Hand.
- Kongs: Melded Kong, Concealed Kong, Two Concealed Kongs (6 or 8), Two Melded Kongs, Three Kongs.
- Account once: four chows with three two-chow patterns at most; the `twice` reading.
- Last Tile with three copies in sight; Robbing the Kong without Last Tile; Last Tile Draw without
  Self-Drawn.
- Settlement on a discard and on a self-draw; the deal always passes; a full game is sixteen hands.

## Not implemented, on purpose

- Penalties for a false win or other faults.
- Players changing seats at each round (no score depends on it).
- Throwing a flower without taking a replacement (flowers are set aside automatically).
- Concealed kongs are shown face up in the app, as in every style.

## Notation

As for every style (`mahjong-core.md`).

## Sources (read 2026-11-27)

The rulebook PDFs (the European Mahjong Association's copy of the 2006 rules at
mahjong-europe.org, the Danish association's at mahjong.dk) and rule sites (sloperama.com,
mahjongtime.com, mahjongsoft.com) were refused by this environment's network policy; what follows
was reachable:

- Wikipedia, "Mahjong" (en, revision 1387708448): the 1998 standard, 81 combinations, the
  eight-point minimum, flowers worth a point each but not toward the minimum, and the settlement.
- Wikipedia, "User:Siroxo/Mahjong Competition Rules" (en, revision 1172225070), a draft of the old
  Guobiao article: every pattern with its points and the patterns not counted with it, the scoring
  principles (non-repeat, non-separation, non-identical, high versus low, account once, and the
  "each set twice" reading), the settlement, no dead wall, the 2014 change to Two Concealed Kongs.
  It cites the EMA rulebook (mahjong-europe.org, `mcr_EN.pdf`).
- Search-engine extracts (2026-11-27) of the MCR 2006 rulebook (mahjong.dk) and of the World
  Mahjong Organization's 2014 revision, for the values above.
- Printed: *Competition Mahjong Official International Rulebook* (Takeshobo, 2002); Tom Sloper,
  *The Red Dragon & The West Wind* (HarperCollins, 2007), as Wikipedia lists them (not read here).

Values and readings that sources disagree on became options.
