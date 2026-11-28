# Mahjong: American-format rules as implemented

The fourth style on the shared engine (`src/games/mahjong/styles/american.ts`, the card in
`src/games/mahjong/american/`; the core is described in `mahjong-core.md`). American mah jongg is
played from a **card of hands**: a winning hand is one of the hands on the card, not any four sets
and a pair. It uses jokers, the Charleston (passing tiles before play), sets of up to six tiles,
and flowers as ordinary tiles. The defaults follow the common National Mah Jongg League table;
every rule that tables disagree on is an option (below), and presets name common sets of them.

**About the card.** The League publishes a new card every year and sells it; its hands may not be
copied, so the app does not include one. It ships an **original practice card** in the same format
(our own hands, written for this app) and lets you **type in the card you own** (Tools, "Your
American card"): it is kept on your device only, checked as you type, and can be chosen for any
game.

## The tiles

152 tiles: the three suits 1 to 9 (craks `m`, dots `p`, bams `s`), four winds, three dragons
(red, green and white, the white also called "soap"), four of each; eight flowers (any flower
matches any other); and eight jokers (an option allows ten).

**Dragons go with suits**: the red dragon with craks, the green with bams, the white with dots. A
card hand that asks for "the dragon of that suit" means that pairing. The white dragon also serves
as a zero in year hands (2026 is a 2, a white dragon, a 2 and a 6).

## Groups and jokers

A hand is made of exact groups: a single, a pair, a pung (3), a kong (4), a quint (5) and a sextet
(6) of the same tile, plus runs of different single tiles written together on the card (a year,
"NEWS", 1 3 5 7 9). A **joker** stands for any tile in a group of **three or more**; never in a
single, a pair, or a group of different singles. A quint always needs at least one joker (there are
only four of each tile), a sextet two.

## Before play: the Charleston

Thirteen tiles each, fourteen for East (the dealer). Then the tiles are passed, three at a time,
all at once; jokers may never be passed:

1. **The first Charleston** (always): to the right, across, to the left.
2. **The second Charleston** (option `secondCharleston`): to the left, across, to the right. By
   default (`vote`) it is played only if every player agrees: one "no" skips it. Some tables always
   play it (`always`); some never do (`off`).
3. **The courtesy pass** (option `courtesy`, on): with the player across you exchange 0 to 3 tiles;
   when the two of you offer different numbers, the lower number changes hands.
4. **Blind passing** (option `blind`, on): on the last pass of each Charleston (the first left and
   the second right) you may pass on, unseen, one, two or three of the tiles you are receiving in
   that same pass instead of tiles from your hand. A pass is always three tiles. (In the app, the
   tiles passed on unseen are the first ones to arrive; a tile can travel on through several blind
   passers until a player keeps it, so every player ends with as many tiles as before.)

Then East throws first.

## The turn

Draw (pick) a tile, then throw one, or declare Mah Jongg when your fourteen tiles make a hand on the
card. No chows, and no concealed or added kongs: once exposed, a group stays as it is.

## Calling a discard

- **For an exposure**: any player may call a discard (never a joker) to complete a pung, kong, quint
  or sextet, laying the group face up with the called tile and tiles from the hand, jokers included,
  then throwing a tile. No replacement tile is drawn: a kong or a quint is simply part of the
  fourteen.
- **For Mah Jongg**: a discard that completes your hand may be called whatever group it finishes,
  a single or a pair included. A **concealed** hand (marked C on the card) may call a discard only
  for Mah Jongg.
- Mah Jongg beats an exposure; between two exposures, the player next in turn takes the tile.
- A discarded joker is dead: nobody may call it.

## Joker exchange

On your turn, after drawing and before you throw, you may take a joker from any exposure on the
table (yours too) by putting in its place the real tile it stands for. You may exchange several
jokers. A joker may not be taken from a dead hand's exposures.

## Dead hands

A hand whose exposures fit no hand on the card can never win: it is **dead** (option `deadHand`,
`on`). A dead player goes on drawing and throwing but may not call or win, and the others may not
take jokers from its exposures. With `deadHand: learner` (for practice) the app refuses an exposure
that would make your hand dead instead. (False Mah Jongg cannot happen here: the app checks every
claim.)

## The end of a hand and payment

- **Mah Jongg on a discard**: the thrower pays twice the hand's value, the other two players pay the
  value (`payment: nmjl`); with `payment: flat` everyone pays the value once.
- **Self-picked** (your own draw): each of the three pays twice the value (`nmjl`), or the value
  (`flat`).
- **Jokerless** (option `jokerless`, double): a hand made without a single joker, exposures included,
  counts double. Hands that cannot take jokers at all (singles and pairs) get no bonus.
- **Wall game**: the wall runs out with no winner: nobody pays.
- A dead hand still pays.
- The deal passes to the right after every hand. A game is four hands by default (`length`).

## The card

A card is lines of text. The app's editor checks each line as you type.

```
title: My card 2026
## Evens
FFF 2222a 44b 666c 88a = 25 X
1111a 1111b 111c FFF = 25 X shift
# a comment
```

- **A hand** is its groups, then `=`, its points, and `X` (exposures allowed) or `C` (concealed).
  Add `shift` when the card says the numbers may be any (like numbers, any run): the numbers then
  move up or down together, keeping their distances.
- **A group** is written as on the card, with the suit as a lower-case letter at the end: `a`, `b`
  or `c` stand for three different suits (any suits, as the colours on a card do); none means `a`.
  One symbol repeated is a set (`222a`, `FFFF`); different symbols are singles (`2026a`, `NEWS`).
- **Symbols**: `1`–`9` a number of the group's suit; `0` the white dragon as a zero; `F` a flower;
  `E S W N` the winds; `D` the dragon of the group's suit; `R` and `G` the red and the green dragon
  (the white is `0`).
- A hand must hold 14 tiles, and no reading of it may need more natural tiles than the set has (four
  of a tile for singles and pairs; jokers fill sets beyond four, eight jokers at most). Each error
  names the line.

## Options

| Option | Values (default first) |
| --- | --- |
| `card` | practice (the Kibitz practice card), mine (the card you typed in) |
| `secondCharleston` | vote, always, off |
| `courtesy` courtesy pass | on, off |
| `blind` blind passing | on, off |
| `jokerless` bonus | double, off |
| `deadHand` | on, learner (exposures that fit no hand are refused) |
| `payment` | nmjl (discarder double, others single; self-picked everyone double), flat |
| `jokers` | 8, 10 |
| `length` | four, hand, eight, sixteen |

## Presets

| Preset | What changes |
| --- | --- |
| League table (`american-league`) | The defaults |
| First Charleston only (`american-quick`) | `secondCharleston: off`, `courtesy: off` |
| Learner table (`american-learner`) | `deadHand: learner` |
| One hand (`american-hand`) | `length: hand` (practice and lessons) |

## Ask before you sit

- Which card is in use this year, and does everyone have one?
- Is the second Charleston played only if everyone agrees, always, or never? Is there a courtesy pass?
- Is blind passing allowed on the last pass of each Charleston?
- Does the thrower pay double, and does a self-picked hand pay double from everyone? Is jokerless
  doubled?
- May jokers be exchanged from a dead hand's exposures? What happens after three hands are dead?
- Are there penalties for a mistaken exposure or a false Mah Jongg?

## Golden cases (tested, `tests/unit/mahjong-american.test.ts`)

- The card: the practice card reads with no errors; each error code (a bad group, a missing `=`,
  points, the X or C mark, an unknown word, the wrong number of tiles, too many natural tiles) names
  its line.
- Readings: suits as three different suits; `shift` moves the numbers; dragons matched to suits;
  quints need jokers; jokers never in singles or pairs.
- Winning: a hand completed with and without jokers; a joker refused in a pair; an exposure that fits
  the hand; a concealed hand refused with an exposure but winning on a discard; the best value when a
  hand fits two lines.
- Payment: discarder double and the others single; self-picked double from all; jokerless double;
  the flat option; a wall game paying nothing.
- On the engine: the first Charleston's three passes, jokers never passed, the vote that skips the
  second Charleston, the courtesy pass exchanging the lower number, blind passing keeping every
  hand at thirteen; an exposure with jokers; Mah Jongg beating an exposure; a discarded joker that
  nobody may call; the joker exchange; a hand made dead by an exposure that fits nothing (and refused
  at the learner table); a dead hand that may not call or win.

## Not implemented, on purpose

- Penalties for mistaken exposures and false Mah Jongg (the app never lets them happen); the League's
  rule on paying for the discard that gave a player a third exposure of a hand; tables that end a
  hand when three players are dead (here the fourth plays on).
- East declaring Mah Jongg on the dealt fourteen before the Charleston (very rare): here East's hand
  is checked on East's first turn, after the Charleston.
- Bettors, the "all pay" wall-game bonus and similar home rules.

## Notation

As for every style (`mahjong-core.md`), plus `pass 3m 7p N` (tiles to pass; `blind2` passes two of
those received unseen; `pass none` offers nothing in the courtesy pass), `vote yes` / `vote no`,
`expose 4 1` (call the discard for a kong with one joker), and `swap 2 0` (take the joker from the
first exposure of the player across).

## Sources (read 2026-11-27)

- Wikipedia, "American mahjong" (fetched): 152 tiles with eight jokers and eight flowers; pairs,
  pungs, kongs, quints and sextets; jokers never passed in the Charleston; the first Charleston to the
  right, across and to the left, a second in reverse if all players agree, blind passing on the last
  pass of each, the optional courtesy pass across of zero to three tiles; calling a discard for an
  exposure or for Mah Jongg; the discarder paying twice the value and the others the value, everyone
  paying twice on a self-draw; a minimum of 25 points on the card.
- Search-engine extracts (the sites themselves were refused by this environment's network policy):
  Mahjong4Friends' joker guide and Tom Sloper's columns (joker exchange from any exposure on your
  turn, never from a dead hand; disputes about exposures after an exchange), the St. Louis Jewish
  Light's "This Week in Mah Jongg" series and Yellow Mountain Imports' rules page (dead hands,
  concealed hands calling only for Mah Jongg, payments varying by group).

Where these disagree (payment, the second Charleston, exchanges from dead hands), the choice became an
option or a question in "Ask before you sit".
