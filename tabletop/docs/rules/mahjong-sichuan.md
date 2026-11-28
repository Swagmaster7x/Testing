# Mahjong: Sichuan Bloody ("blood battle") rules as implemented

The third style on the shared engine (`src/games/mahjong/styles/sichuan.ts`; the core is described
in `mahjong-core.md`). Sichuan mahjong, *xuèzhàn dàodǐ* (血战到底, "fight to the bitter end"), is
the fast suits-only game of south-west China: no honours, no flowers, no chows, one suit thrown
away by every player, and the hand goes on after the first win until three players have won or
the wall is empty. Defaults follow the common online and Chengdu tables; every rule that tables
disagree on is an option (below), and presets name common sets of them.

## The tiles

108 tiles: the three suits 1 to 9 (characters `m`, dots `p`, bamboo `s`), four of each. No winds,
dragons, flowers or seasons. Thirteen tiles each; the dealer starts with fourteen and throws first.
There is no dead wall: every tile can be drawn.

## Before play: the exchange and the void suit

- **Exchange three** (*huàn sān zhāng*, option, off by default): before anything else every player
  chooses three tiles of one suit and passes them, all at once, to the player on the right, on the
  left or across. The direction is set by the dice (`random`, a fresh direction each hand) or fixed
  by the table.
- **Declaring the void** (*dìng quē*, always): every player then chooses one suit to throw away
  entirely. The choices are made in secret and shown together. The suit you void:
  - must be thrown first: while you hold any tile of it, you may throw only those tiles;
  - may not be called (no pung or kong of it) and may not be made into a kong;
  - may not be in a winning hand: a hand wins only with tiles of the other two suits (at most two
    suits, which is the rule *quē yī mén*, "lacking one suit").

## Calls

- **Pung** (*pèng*) and **kong** (*gàng*) on anyone's discard. **No chow.** A win beats a pung or
  kong.
- Kongs: concealed (*àn gàng*, four in your hand), added (*bā gàng*, the fourth tile added to your
  pung on your own turn), or exposed (*zhí gàng*, called on a discard). After a kong you draw a
  replacement from the end of the wall.
- **Robbing a kong** (*qiǎng gàng hú*): a player whose hand the added tile completes may win on it.
  The kong then never happened (and is not paid).

## Winning

A complete hand is four sets and a pair, or **seven pairs**, where four of a kind counts as two
pairs (a "dragon" seven pairs). No tile of your void suit may be in it. There is **no minimum**:
any complete hand wins. Several players may win on one discard (*yī pào duō xiǎng*, option; the
other value gives the tile to the first in turn).

### Play goes on after a win (the "blood battle")

When a player wins, the win is paid at once and the winner lays the hand down face up and leaves
the hand. The others play on: the next to draw is the player after the winner (after the last of
them, when several won on one discard). The hand ends when **three players have won** or the wall
is empty. A player who has won neither pays nor collects again in that hand.

## Value: fan

A hand is worth *fan*; each fan doubles its value. Base points = 2 to the power of the fan, capped
(*fēngdǐng*, option, four fan by default: 16 points).

| Pattern | Fan |
| --- | --- |
| Basic hand (*píng hú*) | 0 (1 point) |
| All pungs (*duìduì hú*): four pungs or kongs and a pair | 1 |
| One suit (*qīng yī sè*): every tile of one suit | 2 |
| Seven pairs (*qī duì*) | 2 |
| Each root (*gēn*): four of the same tile anywhere in the hand (a kong, or four held, as in a dragon seven pairs) | 1 each |
| Terminals everywhere (*dài yāo jiǔ*): every set and the pair holds a 1 or a 9 (option `extras`) | 2 |
| Golden hook (*jīn gōu diào*): all four sets laid down, and won on a single-tile wait for the pair (option `extras`) | 1, besides all pungs |
| 2-5-8 hand (*jiàng duì*): all pungs, or seven pairs, of 2s, 5s and 8s only (option `extras`) | 2, besides all pungs or seven pairs |
| Win on a kong's replacement tile (*gàng shàng huā*) | 1 |
| Win on the discard a player makes right after a kong (*gàng shàng pào*) | 1 |
| Robbing a kong (*qiǎng gàng hú*) | 1 |
| Win on the last tile (*hǎidǐ lāo yuè*), or on the discard after it (*hǎidǐ pào*) | 1 |
| Self-drawn (*zì mō*), when the table adds a fan for it (option `selfDraw: fan`) | 1 |
| Heavenly hand (*tiān hú*, the dealer's deal) and earthly hand (*dì hú*, another player's first draw) | the cap (option `heavenly`) |

The patterns add up: a pure all-pungs hand (*qīng duì*) is 1 + 2 = 3 fan; a dragon seven pairs is
2 + 1 = 3; a pure dragon seven pairs 2 + 2 + 1 = 5; the "eighteen arhats" (four kongs and a pair,
won on the pair) is 1 + 1 + 4 = 6. Where a hand can be read more than one way, the reading that
scores most counts.

## Payments

All payments are in points; a game starts at 0 for everyone and payments always add up to zero.

- **A win on a discard**: the discarder alone pays the winner the base points.
- **Self-drawn**: every player still in the hand pays the base points, plus one point each when the
  table adds to the base for a self-draw (`selfDraw: base`, the default).
- **Kongs are paid at once** (*guā fēng xià yǔ*, "wind and rain", option): an exposed kong called
  on a discard, 2 points from the discarder; an added kong, 1 point from each player still in; a
  concealed kong, 2 points from each player still in. An added kong is paid once nobody robs it.
- **A kong's discard** (*hūjiào zhuǎnyí*, "call transfer", option): when a player makes a kong and
  the next tile they throw is won on, the money for that kong goes to the winner (`transfer`, the
  default), back to the players who paid it (`return`), or stays (`keep`).

## The end of the hand: the checks

When the wall runs out, the players still in are checked (*chá jiào*, option, on):

- **Flower pig** (*chá huā zhū*): a player still holding tiles of all three suits (so still holding
  the void suit) pays every other player still in who is not a flower pig the capped value
  (`pig: cap`), or 16 points each (`pig: 16`).
- **Not ready** (*chá dà jiào*): a player who is not one tile from a winning hand pays every ready
  player still in the most that ready player's hand could win on a discard.
- **Kong money returned** (*tuì shuì*, "tax refund", option, on): a player who is not ready (a
  flower pig included) returns every point of kong money collected in this hand to the players who
  paid it.

Players who won earlier in the hand take no part in the checks. When three players have won, the
hand ends at once with no checks.

## Dealing and the game

- The deal passes to the right after every hand. (Many tables make the first winner the next
  dealer; the dealer has no payment privilege in Sichuan, so this changes only who throws first.)
- A game is four hands by default, or one, eight or sixteen (`length`).

## Options

| Option | Values (default first) |
| --- | --- |
| `cap` fan cap | 4, 3, 5, 6 |
| `selfDraw` | base (+1 point from each payer), fan (+1 fan), none |
| `exchange` exchange three | off, random, right, left, across |
| `kongPay` kongs paid at once | standard (2 / 1 / 2), off |
| `kongShoot` money of a kong whose next throw is won on | transfer, return, keep |
| `refund` kong money returned by a player not ready at the end | on, off |
| `checks` flower pig and not-ready checks at the end | on, off |
| `pig` what a flower pig pays each player | cap, 16 |
| `multipleWin` several winners on one discard | all, first |
| `extras` terminals everywhere, golden hook, 2-5-8 | on, off |
| `bonusFan` kong replacement, kong discard, robbing, last tile | on, off |
| `heavenly` heavenly and earthly hands | cap, off |
| `length` | four, hand, eight, sixteen |

## Presets

| Preset | What changes |
| --- | --- |
| Chengdu table (`sichuan-chengdu`) | The defaults |
| Online, exchange three (`sichuan-online`) | `exchange: random`, `selfDraw: fan` |
| Three-fan cap, plain table (`sichuan-plain`) | `cap: 3`, `extras: off`, `selfDraw: none` |
| High stakes (`sichuan-high`) | `cap: 6` |
| One hand (`sichuan-hand`) | `length: hand` (practice and lessons) |

## Ask before you sit

- Is the exchange of three tiles played, and which way does it go?
- What is the fan cap: three, four, five?
- Does a self-draw add a point to each payment, or a fan, or nothing?
- Which extra patterns count (terminals everywhere, golden hook, 2-5-8)? Are roots counted?
- Are kongs paid at once, and how much? What happens to a kong's money when its next throw is won
  on? Is kong money returned by a player not ready at the end?
- What does a flower pig pay: the cap or a fixed amount, and to whom?
- May several players win on one discard?
- Who deals next: the next seat, the first winner, or the player who fed two winners?

## Golden cases (tested, `tests/unit/mahjong-sichuan.test.ts`)

- A basic hand is 0 fan (1 point); all pungs 1; one suit 2; seven pairs 2; a dragon seven pairs 3;
  a pure all-pungs 3; a pure dragon seven pairs 5 (capped at 4 by default).
- Roots: a kong and four held tiles each add a fan.
- Terminals everywhere 2; a golden hook 2 with all pungs; a 2-5-8 all-pungs hand 3; with
  `extras: off` none of them count.
- A hand holding a void tile cannot win; a hand of three suits cannot win.
- Bonus fan: kong replacement, kong discard, robbing a kong, last tile.
- Self-draw: +1 point per payer (`base`), +1 fan (`fan`) or nothing.
- The cap: 3, 4, 5, 6 fan.
- On the engine: the void declaration hidden until all have chosen; void tiles thrown first; no
  calls of the void suit; no chow; the exchange of three tiles in each direction; a win that does
  not end the hand and the next player after the winner; two winners on one discard; the hand ending
  at the third winner; kong payments at once (exposed, added, concealed) and only by players still
  in; an added kong robbed is not paid; the call transfer; the end checks (flower pig, not ready, kong
  money returned); payments always adding up to zero.

## Not implemented, on purpose

- Exact local scoring sheets differ from town to town (some count *jiàng duì* as 3 fan on its own,
  some count a self-draw as doubling); each common difference is an option, others are not.
- Three-player Sichuan (*sān rén liǎng fáng*, two suits) and the "blood river" variant
  (*xuè liú chéng hé*, where winners keep playing) are not played.
- Dealer choice by the first winner (see "Dealing").

## Notation

As for every style (`mahjong-core.md`), plus `void p` (declare dots as the void suit) and
`pass 1m 2m 3m` (the three tiles of the exchange).

## Sources (read 2026-11-27)

Direct fetches of Chinese and Japanese sites, and of most rules sites, were refused by this
environment's network policy; en.wikipedia.org and pagat.com were reachable but have no Sichuan
rules page, so the rules were checked through search-engine extracts:

- Wikipedia, "Mahjong", section "Chinese variants" (fetched): Sichuan mahjong uses only the suited
  tiles, disallows chows, and play continues after a win.
- Mahjong Industry League, "Brief Introduction to Bloody Mahjong" (PDF, extract): three winners or
  an empty wall end the hand; the not-ready player pays the ready player the most the hand could
  win; flower pig; kong income returned by a player not ready at the end and by a player whose next
  throw after a kong is won on.
- Mahjong Australia, "Sichuan Mahjong – Battle to the End" (extract): 108 tiles, pung and kong only,
  play continues until three players have won.
- Moegirlpedia, 四川麻将 and 血流成河 (extracts): playing a void suit, "wind and rain" kong payments,
  multiple winners on one discard, the checks at the end (one table charges a flower pig 16 points
  to each player), roots.
- Bilibili and Xiaomi game-centre guides to 血战到底 and 换三张 (extracts): the fan table (all pungs,
  one suit, seven pairs, dragon seven pairs, roots, golden hook), the exchange of three tiles of one
  suit by dice, fan caps.

The guides disagree on several values (one counts one suit as 8 times the base, another as 4;
caps run from three to six fan; a flower pig pays the cap or a fixed sum); each disagreement became
an option, with the defaults on the most common online and Chengdu sheet.
