# Mahjong: the shared engine and the rules-file interface

Milestone 9 (PLAN.md 2.3: "Mahjong is one engine with a rules file per style… Nothing
style-specific lives in the shared core"). The engine is `src/games/mahjong/core/`; each style is
one rules file in `src/games/mahjong/styles/`. Hong Kong Old Style (`docs/rules/mahjong-hk.md`) is
the first. The game behind the contract is `mahjong` in `src/games/mahjong/rules.ts`.

## What the core knows

- **Tiles** (`core/tiles.ts`). 43 kinds: characters, dots and bamboo 1 to 9 (kinds 0 to 26), the
  winds East, South, West, North (27 to 30), the dragons White, Green, Red (31 to 33), four flowers
  (34 to 37), four seasons (38 to 41) and the joker (42). A physical tile is an id `"<code>.<copy>"`,
  such as `"5p.2"` or `"F1.0"`, so every tile keeps its identity (for conservation, for animation,
  and so a test can search a view for a tile it must not hold). Sets: 136 (suits and honours),
  144 (with flowers and seasons), 108 (suits only), and jokers on top when a style asks.
- **The wall** (`core/engine.ts`). One shuffled row: ordinary draws come from the front,
  replacement tiles for kongs and bonus tiles from the back. A style keeps a dead wall of *n*
  tiles: the hand is exhausted when no more than *n* tiles are left.
- **The deal**: the dealer gets one tile more than the hand size, everyone else the hand size, in
  blocks of four then one each; bonus tiles are replaced from the back (dealer first, then in turn)
  when the style plays with them.
- **The turn**: draw (automatic), then the player acts: discard, declare a concealed or added kong,
  or win. After a chow or pung the caller only discards.
- **The claim window.** A discard opens a window. The seats that could call it are asked one at a
  time in turn order after the discarder, each choosing a call or *pass*. Choices are hidden from
  the other seats until the window closes, so the result is the same as calling at once, and the
  contract stays turn-based (one seat acts at a time). A seat is skipped when nothing it could
  call would beat a call already made. Priority: win (3), then pung or kong (2), then chow (1).
  Several wins are allowed only if the style says so; otherwise the first in turn order takes it.
  When the window closes the best call is carried out (a win ends the hand; a pung or chow takes
  the tile and the caller discards; a kong takes it and the caller draws a replacement), or the
  next player draws.
- **Robbing a kong** is a second kind of window, opened when a player adds to a pung (or, if the
  style allows it for thirteen orphans, declares a concealed kong): only wins may be called.
- **Winning shapes** (`core/shapes.ts`): *n* sets and a pair, where *n* is the hand size divided
  by three (four for 13 tiles, five for 16), seven pairs, thirteen orphans. The style says which
  shapes it accepts. Every arrangement of a winning hand is listed, with the set the winning tile
  completed marked, so a scorer can pick the arrangement that scores most.
- **Tiles from ready** (`core/shanten.ts`): the shanten number of a hand (0 is ready, -1 is
  complete) for each allowed shape, the tiles that would bring it closer (acceptance), and every
  discard's effect, counting only the tiles the player has not seen. Checked against the `syanten`
  package in the tests.
- **Rounds**: seat winds from the dealer, the prevailing wind, the dealer keeping the deal or
  passing it, the wind moving on after four passes, the game's length, a cap of eight hands a
  round.
- **Views and samples**: a seat sees its own hand and drawn tile, every meld (a concealed kong
  shows its tiles), every discard and bonus tile, the last discard, how many tiles each hand and
  the wall hold, the scores and past hands, and its own options when it is to act (the view lists
  them, because a seat's choices in a claim window depend on calls it may not see). It never sees
  another hand, the wall, another seat's choice in an open claim window, who else is being asked,
  or the seed. `sample` deals the tiles it cannot see at random to the other hands and the wall;
  in a claim window it treats the seats asked earlier as having passed, so it may offer a seat
  more calls than the view does, never fewer.
- **The end of a hand**: the scores are shown in a `scored` phase that waits for the first seat
  to play `next` (a person reads the faan; the CPU goes on at once). The last hand of a game ends
  it without waiting.

## The rules file (`core/style.ts`)

A style is one typed object:

| Field | What it says |
| --- | --- |
| `id`, `options`, `defaults`, `presets`, `read`, `write` | The style's options (each with its values), its default options, named presets, and their JSON form. |
| `rules(options)` | The tile set (honours, bonus tiles, jokers), the hand size, the dead wall, the calls allowed (chow, pung, kong from a discard, concealed and added kongs, robbing a kong, robbing a concealed kong with thirteen orphans, several winners), the shapes (seven pairs, thirteen orphans), how many wind rounds a game lasts (0 for a single hand) and the cap on hands per round. |
| `score(context, options)` | Given a complete hand and how it was won (the winning tile, self-drawn or from whom, melds, bonus tiles, seat and prevailing winds, the dealer, last tile or last discard, a kong's replacement, a robbed kong, heavenly or earthly), the scoring lines, the total, whether it is a limit hand, and the base points; or null when the hand may not win (below the minimum, or a shape the style refuses). |
| `settle(hand, options)` | The payments for a finished hand from each winner's score, who discarded, and the dealer. They must add up to zero. |
| `dealerKeeps(result, options)` | Whether the dealer deals again after this hand. |
| `hints(seat, options)` | Rough values of what the scoring rewards, for one family of CPU players to steer by in every style: the minimum and the limit, the value of a pung of each kind (dragons, your winds), one-suit hands, all pungs, all chows, a concealed hand, a self-draw, the bonus tiles already held, the point table, and what each loser pays on a self-draw and on a discard (so the CPU knows how much feeding a ready hand costs at this table). |

The CPU, the coach and the review share one module (`src/games/mahjong/strategy.ts`) that reads
only a view, the style's rules and its hints: tiles from ready and useful tiles for every discard,
what a ready hand can win, expected points (the chance to win in the turns left times what the
hand is worth), and a danger estimate for each tile against each player.

## What later styles add, and where

- **Riichi** (milestone 11): 136 tiles, a dead wall of 14 with dora indicators, riichi declared with
  a discard, furiten (a filter on which wins a seat may call), yaku required (a `score` that returns
  null without one), han and fu (the score's lines carry the unit), an East-South game with
  repeat counters and riichi sticks (style state kept with the hand).
- **Chinese Official**: 81 patterns and an eight-point minimum: a scorer only.
- **Taiwanese**: 16-tile hands (five sets and a pair), so `rules().handSize` is 16; a dead wall of 16.
- **Sichuan Bloody**: 108 tiles, no chows, a suit to void chosen before play (a phase before the
  first discard), and play going on after a win, which retires the winner from the turn order.
- **American**: jokers (a joker stands for any tile in a set of three or more, never in a pair),
  the Charleston (a passing phase before the first discard), and hands from a card instead of
  sets and a pair (a shape supplied by the style).

The engine has one place for turn order and one for the phases of a hand, so retiring a seat or
adding a phase before play are changes in one spot each; nothing in the Hong Kong file depends
on them.

## Notation

Tiles: `1m`–`9m` characters, `1p`–`9p` dots, `1s`–`9s` bamboo, `E S W N` winds, `Wd Gd Rd` dragons,
`F1`–`F4` flowers, `S1`–`S4` seasons, `J` a joker. Actions: a tile alone is a discard (`5p`);
`kong 5p` declares a concealed or added kong; `win`; on a discard `pung`, `kong`, `chow 3s` (the run
starting at 3 of bamboo) or `pass`; `next` deals the next hand after the scores are shown. A
record is the config, the seed and these actions.
