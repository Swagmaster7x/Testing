# Mahjong: Riichi (Japanese) rules as implemented

The second style on the shared engine (`src/games/mahjong/styles/riichi.ts`, the core is described
in `mahjong-core.md`). Defaults follow the common online rules: red fives, open tanyao, a 25,000
start, an East-South game. Every rule that tables disagree on is an option (below), and presets
name common sets of them.

## The tiles

136 tiles: the three suits 1 to 9 (characters `m`, dots `p`, bamboo `s`), four winds and three
dragons, four of each. No flowers or seasons. With red fives on (the default), one 5 of each suit
is red (`5m.0`, `5p.0`, `5s.0`): it plays as a normal 5 and adds one han when you win holding it.

## The table

- Everyone starts with 25,000 points. The dealer is East; seat winds run East, South, West, North
  to the dealer's right. The first round is the East round, then the South round.
- Fourteen tiles are set aside at the end of the wall: the **dead wall**. Ten of them are dora
  indicator stacks (five indicators and the five "ura" tiles under them); four are replacement
  tiles for kongs. Each kong draws a replacement from the dead wall, which is topped up from the
  end of the live wall, so the live wall is one tile shorter for every kong.
- The dealer starts with fourteen tiles and throws first; everyone else has thirteen. Play passes
  to the right.

## Calls

- **Chi** (a run) only on the discard of the player on your left; **pon** (three alike) and **kan**
  (four alike) on anyone's; **ron** (a win) on anyone's. Ron beats pon and kan, which beat chi.
- **Swap calling** (kuikae) is forbidden: after a chi or pon you may not throw the tile you just
  called, nor the tile at the other end of the chi's run (called 3 with 4-5: neither 3 nor 6).
- A kong is concealed (all four in your hand), added (a drawn fourth on your pon), or open (called
  on a discard). Kongs need a tile left to draw.
- **Robbing a kong** (chankan): a player whose hand the added tile completes may win on it. Only
  thirteen orphans may rob a concealed kong.

## Riichi

On your turn, with a closed hand (concealed kongs allowed), at least 1,000 points and at least four
tiles left to draw, you may declare riichi as you throw a tile that leaves the hand ready. When the
throw passes without a win you put a 1,000-point stick on the table. From then on the hand is
locked: you throw each tile you draw unless it wins; a concealed kong is allowed only with the
drawn tile and only when it leaves the waits unchanged. Riichi is worth one han; **double riichi**
(declared on your first throw, before any call) is worth two. **Ippatsu**: a riichi hand that wins
before or on its next draw, with no call by anyone in between, scores one more han. Riichi also
turns over the **ura dora** when you win.

Riichi sticks on the table go to the next winner (to the first in turn order after the thrower when
two win on one tile). After a drawn hand they stay for the next.

## Furiten

You may not win on a discard (ron) when you are **furiten**:

- any tile that completes your hand is among your own discards (even ones another player called);
- you passed a winning discard since your last throw (temporary furiten, until your next throw);
- after riichi you passed a winning discard (riichi furiten, for the rest of the hand).

The tiles that "complete your hand" are those that make the shape, whether or not the hand would
have a yaku. A furiten hand may still win with its own draw (tsumo).

## Winning: yaku, han and fu

A complete hand is four sets and a pair, seven pairs (seven different pairs), or thirteen orphans.
It must have at least one **yaku** to win (dora are not yaku). A yaku completed by a call
(atozuke) counts. Han come from yaku and dora; fu from how the hand is made.

| Yaku | Han closed / open |
| --- | --- |
| Riichi; ippatsu; menzen tsumo (closed self-draw); pinfu; iipeikou (two identical runs) | 1 / closed only |
| Tanyao (all simples; open allowed by default) | 1 / 1 |
| Yakuhai: each pung of dragons, of your seat wind, of the round wind | 1 / 1 each |
| Haitei (self-draw on the last tile), houtei (ron on the last discard), rinshan (win on a kong's replacement), chankan (robbing a kong) | 1 / 1 |
| Double riichi; chiitoitsu (seven pairs, 25 fu) | 2 / closed only |
| Chanta (every set and the pair has a terminal or honour, with a run); ittsu (1-9 straight); sanshoku (the same run in three suits) | 2 / 1 |
| Sanshoku doukou (the same pung in three suits); sankantsu; toitoi (all pungs); sanankou (three concealed pungs); shousangen (two dragon pungs and a dragon pair); honroutou (all terminals and honours) | 2 / 2 |
| Ryanpeikou (two iipeikou) | 3 / closed only |
| Junchan (terminals in every set and the pair, with a run); honitsu (one suit and honours) | 3 / 2 |
| Chinitsu (one suit) | 6 / 5 |
| Yakuman: kokushi (thirteen orphans), suuankou (four concealed pungs), daisangen, shousuushii, daisuushii, tsuuiisou (all honours), chinroutou (all terminals), ryuuiisou (all green), chuuren poutou (nine gates), suukantsu, tenhou (dealer's draw), chiihou (first draw, before any call) | the limit |
| Double yakuman (option, on): kokushi on its thirteen-way wait, suuankou on a pair wait, pure nine gates, daisuushii | twice the limit |

Pinfu needs a closed hand of four runs, a pair that is not a value tile, and a two-sided wait.
Iipeikou does not count with ryanpeikou; chiitoitsu does not combine with them. Dora: each tile
matching an indicator's next tile (1 after 9, East after North, White after Red: dragons go White,
Green, Red) adds a han; red fives one each; ura dora only for a riichi winner.

**Fu**: twenty, plus ten for a closed hand won on a discard, two for a self-draw (not pinfu), two
for a closed (kanchan), edge (penchan) or pair (tanki) wait, and for sets: an open pung of simples
2, of terminals or honours 4, doubled when concealed (a pung completed by ron counts as open), and
four times that for a kong; a pair of dragons, your seat wind or the round wind 2 (4 for a pair
that is both winds, an option). The total is rounded up to tens; an open hand that would score 20
scores 30. Pinfu self-drawn is 20 fu; chiitoitsu is 25. Where the winning tile could complete the
hand in more than one way, the way that scores most counts.

## Points

Base points = fu × 2^(han + 2). Five han, or a base over 2,000, is **mangan** (2,000); 6–7 han
haneman (3,000); 8–10 baiman (4,000); 11–12 sanbaiman (6,000); 13 or more counted yakuman (8,000,
an option); yakuman 8,000 each.

- Ron: the thrower pays 4 × base (6 × base when the winner is the dealer), rounded up to 100.
- Tsumo: when the dealer wins each player pays 2 × base; otherwise the dealer pays 2 × base and the
  others 1 × base, each rounded up to 100.
- Each counter on the table (honba) adds 300 to a win: 300 from the thrower on ron, 100 from each
  on tsumo. The winner also collects every riichi stick on the table.

## Drawn hands

- **Exhaustive draw**: the live wall runs out. Players show whether they are ready (tenpai); the
  not-ready players pay 3,000 in all to the ready ones (1,000 each from three, 1,500 each from two,
  3,000 from one). Nothing is paid when all or none are ready.
- **Nagashi mangan** (option, on): at an exhaustive draw, a player whose discards are all terminals
  and honours, none of them called, is paid as for a self-drawn mangan, instead of the ready
  payments.
- **Abortive draws** (option, on): nine different terminals and honours on your first draw before
  any call (your choice); the same wind thrown by all four players on the first go round with no
  call; four riichi declared; four kongs by more than one player; three players winning on one
  discard (with the double-ron default).
- After any drawn hand the counters go up by one; the dealer keeps the deal after an abortive draw
  or when ready at an exhaustive draw.

## Dealer, rounds and the end

- The dealer keeps the deal after winning (or after a draw as above), and the counters go up by one.
  When another player wins, the deal passes to the right and the counters go back to zero.
- The game ends after the South round (an East-South game), when a player goes below zero (bust,
  an option), or when the dealer of the last hand keeps the deal while in first place (agari-yame,
  an option). If nobody has 30,000 at the end of the South round, play goes on into the West round
  until somebody does (extension, an option). Places go by points; equal points share a place.

## Options

| Option | Values (default first) |
| --- | --- |
| `red` red fives | 3 (one per suit), 0 |
| `openTanyao` | on, off |
| `start` points | 25000, 30000 |
| `length` | east-south, east, hand (one hand) |
| `extension` into the West round | west, off |
| `bust` (ends below zero) | on, off |
| `multipleRon` | double (two may win; three is an abortive draw), head-bump (only the first in turn), triple (all may win) |
| `aborts` abortive draws | on, off |
| `nagashi` mangan | on, off |
| `kiriage` (4 han 30 fu and 3 han 60 fu as mangan) | off, on |
| `kazoe` (13+ han) | yakuman, sanbaiman |
| `doubleYakuman` | on, off |
| `kuikae` swap calling | forbidden, allowed |
| `agariYame` | on, off |
| `tenpaiRenchan` dealer keeps when ready at a draw | on, off |
| `kanDora` | late (open and added kongs reveal after their throw), immediate |
| `ura` dora | on, off |
| `ippatsu` | on, off |
| `doubleWindFu` | 4, 2 |

## Presets

| Preset | What changes |
| --- | --- |
| Common online (`riichi-online`) | The defaults |
| East round only (`riichi-east`) | `length: east` |
| Stricter club table (`riichi-classic`) | No red fives, closed tanyao only, no double yakuman, kiriage mangan |
| One hand (`riichi-hand`) | `length: hand` (practice and lessons) |

## Ask before you sit

- Red fives? How many?
- Open tanyao, or closed only?
- Starting points, and is there an extension, a bust, uma and oka at the end?
- Double ron, or head bump? What does triple ron do?
- Which abortive draws are played? Nagashi mangan?
- Kiriage mangan? Counted yakuman, or a cap at sanbaiman? Double yakuman?
- Is swap calling forbidden? Are kan dora turned at once?
- Does the dealer keep the deal when ready at a drawn hand?
- Is there responsibility payment (pao) for feeding the last set of daisangen or daisuushii?

## Golden cases (tested, `tests/unit/mahjong-riichi.test.ts`)

- Pinfu tsumo with menzen tsumo: 20 fu, 2 han; ron with pinfu: 30 fu.
- Chiitoitsu: 25 fu; with tanyao and a dora.
- Riichi ippatsu tsumo with ura dora; double riichi.
- Open tanyao on and off; a hand with no yaku cannot win.
- Fu: concealed terminal pung, open kong, kanchan and tanki waits, a pung completed by ron counted
  open, a double-wind pair (4 or 2), open hand rounded to 30.
- Mangan at 5 han; 4 han 30 fu (7,700, or mangan with kiriage); haneman, baiman, sanbaiman, counted
  yakuman (or sanbaiman); daisangen; kokushi thirteen-way wait (double yakuman, or single).
- Dealer and non-dealer ron and tsumo payments, rounding up to 100, honba and riichi sticks.
- Furiten: a wait in your own discards blocks ron but not tsumo; passing a winning tile blocks ron
  until your next throw; after riichi, for the rest of the hand.
- Multiple ron: two winners each paid by the thrower, sticks and counters to the first in turn;
  three winners an abortive draw (or all paid with `triple`); head bump.
- Riichi: needs a closed ready hand, 1,000 points and four tiles to draw; the stick is placed only
  when the throw passes; a ron on the riichi throw costs no stick; the locked hand throws its draws.
- Swap calling forbidden after a chi and a pon.
- Kan dora revealed at once for a concealed kong and after the throw for an added one.
- Exhaustive draw ready payments (one, two, three ready); nagashi mangan; nine terminals; four
  winds; four riichi; dealer keeps when ready; counters.
- Game end: bust, agari-yame, extension into West.

## Not implemented, on purpose

- Pao (responsibility payment) for daisangen and daisuushii, and for kongs that give rinshan.
- Uma and oka at the end of a game (places go by raw points).
- Local yaku (renhou, daisharin, and the like) and false-win penalties (chombo).
- Revealing hands at a draw is automatic: a ready hand is always declared ready.

## Notation

As for every style (`mahjong-core.md`), plus `riichi 5p` (throw the 5 dots and declare riichi) and
`abort` (declare the nine-terminals draw). A red five is the copy `.0` of a 5 when red fives are on.

## Sources (read 2026-11-27)

The rules were checked through search-engine extracts, as direct fetches of en.wikipedia.org and
riichi.wiki were refused by this environment's network policy:

- Wikipedia, "Japanese mahjong scoring rules" and "Yaku (Japanese mahjong)" (extracts).
- World Riichi Championship rules 2022 (squarespace PDF, extract): honba 300, abortive draws.
- European Mahjong Association, Riichi Rules 2016 (tabletopia and mahjong-mil.org copies,
  extracts): furiten and when temporary furiten ends.
- Danish Mahjong Association, Riichi Rulebook 2025 v1.1 (extract).
- riichi.neocities.org, "Scoring basics" and "Ruleset awareness"; Reach Mahjong forum threads on
  double and triple ron (extracts).

Values that sources disagree on became options.
