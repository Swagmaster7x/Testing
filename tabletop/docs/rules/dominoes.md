# Dominoes, as implemented

Milestone 4. The double-six set: 28 tiles, every pair of numbers from blank (0) to six once,
168 pips in all. Code: `src/games/dominoes/rules.ts`; golden cases: `tests/unit/dominoes-rules.test.ts`.
All Fives and Cuban double-nine come in milestone 14.

## Common to every game

- Tiles are written low number first: `0-0` is the double blank (*la chucha*), `5-6`, `6-6`.
- Play goes counter-clockwise (to the right). In the app you sit at the bottom; the next player is
  on your right. Partners sit facing each other.
- The **line** has two open ends. A tile is played on an end showing one of its numbers; the
  tile's other number becomes the new end. Doubles are placed across the line.
- You must play if you can. A player who cannot play passes (knocks), or in the Draw game first
  draws from the boneyard (see below).
- A hand (*mano*) ends when a player plays their last tile (*dominó*) or when nobody can play
  (*trancado*, a blocked hand; the tile that blocks it is the *tranque*).
- **Scoring:** the side that wins the hand scores pips from the tiles left in hands, as the
  options say. Scores add up over hands until a side reaches the target.

## Games and options

| Option | Values | Default (Puerto Rico 500) |
| --- | --- | --- |
| `mode`: the game | `partnership` (four players, two against two, seven tiles each, no boneyard), `draw` (two players, seven each, the other fourteen are the boneyard), `block` (two players, seven each, the other fourteen sleep unused) | `partnership` |
| `target`: points to win the match | 0 (a single hand), 100, 150, 200, 500 | 500 |
| `scoring`: what the winners of a hand score | `all` (every tile left in every hand, their own included), `losers` (only the losers' tiles) | `all` |
| `blockedScore`: what a blocked hand scores | `pips` (as `scoring` says), `difference` (the losers' pips less the winners') | `pips` |
| `blockedWinner`: who wins a blocked hand | `side` (the side with fewer pips in hand), `blocker-or-next` (whichever has fewer pips of the player who blocked and the player after them; four players) | `side` |
| `blockedTie`: a blocked hand with equal pips | `none` (nobody scores), `starting` (the side that led the hand wins), `blocker` (the side that played the last tile wins), `not-blocker` (the other side wins), `more-tiles` (the side holding more tiles wins; equal counts score nothing) | `none` |
| `firstLead`: who leads the first hand | `double-six` (the holder of the 6-6 leads it; in a two-player game the highest double dealt, else the heaviest tile), `any` (a player drawn by lot leads any tile) | `double-six` |
| `nextLead`: who leads later hands | `winner` (whoever went out; after a block, the member of the winning side with fewer pips, or the blocker when `blockedTie: blocker` decided it; after a hand nobody won, the 6-6 rule), `rotate` (the next player after the last leader, any tile), `double-six` (the 6-6 rule every hand) | `winner` |
| `earlyBonus`: bonuses for hands one to four of a match, won by going out | `none`, `100-75-50-25` | `100-75-50-25` |
| `capicu`: going out with a tile that is not a double and fits both ends | 0, 50, 100 | 100 |
| `chuchazo`: going out with the double blank (*la chucha*) | 0, 50, 100 | 100 |
| `chuchazoEnds`: when the chuchazo counts | `any`, `one-end` (only when exactly one end shows a blank; with blanks at both ends it is a plain *dominó*) | `any` |
| `passBonus`: a tile that makes an opponent pass | `off`, `on` (10 points to the player's side, 20 the first time in a match; every opponent who passes before the next tile counts; a blocked hand pays the blocker for each opponent) | `off` |
| `redeal`: a hand with five or more doubles | `never`, `five-doubles` (the deal is made again) | `never` |
| `drawLimit` (Draw game): how far the boneyard is drawn | `all` (draw until you can play or it is empty), `leave-two` (the last two tiles are never drawn) | `all` |

In a blocked hand each side's pips are its players' hands added together. A blocked hand scores no
early bonus. Going out with a double that fits both ends (*dominao*) scores no bonus of its own.
If both sides reach the target, the higher score wins; equal scores play on. A match stops after
60 hands, won by the side ahead.

## Presets

| Preset | What it sets |
| --- | --- |
| **Puerto Rico 500** (default, *Quinientos*) | Partnership to 500; winners score every tile left; the 6-6 opens the match and the winner leads after; bonuses of 100, 75, 50 and 25 for the first four hands won by going out; capicú 100; chuchazo 100 (both ends or one). |
| **Puerto Rico 200** (*Doscientos*) | Partnership to 200; winners score every tile left; the winner leads; no bonuses. |
| **International** (the federation's rules, as pagat reports them from dominaxo.com) | Partnership to 200; winners score every tile left; a player drawn by lot leads any tile; the lead rotates; a tied block scores nothing. |
| **Mexico** | Partnership to 100; winners score only the losers' tiles; the 6-6 opens; the winner leads; a tied block goes to the side that led. |
| **Colombia** | As Mexico, but a tied block goes to the side that blocked. |
| **Venezuela** | Partnership to 100; losers' tiles only; the 6-6 opens; the lead rotates; a tied block scores nothing. |
| **Draw** | Two players, seven each, draw from the boneyard until you can play; to 100; the winner scores every tile left (the Puerto Rican way). |
| **Block** | Two players, seven each, no drawing; to 100; the winner scores every tile left. |

## Ask before you sit

1. To how many points: 100, 200 or 500? Do the winners score their own tiles too?
2. Who leads the first hand (the 6-6?) and who leads after (the winner, or in turn)?
3. A blocked hand (*trancado*): do the sides compare, or the blocker and the next player? With
   equal pips: no score, the side that started, or the side that blocked?
4. Are there bonuses: the first four hands, capicú, chuchazo, a pass? Does a chuchazo count when
   both ends show a blank?
5. Is a hand with five doubles dealt again?
6. In the Draw game, do you draw until you can play, and are the last two tiles left?

## Golden cases (tested)

- The set has 28 tiles and 168 pips; a partnership deal gives everyone seven and leaves none.
- The holder of 6-6 leads it in the first hand; later the winner leads any tile.
- A tile fits an end showing either of its numbers, and the other number becomes the new end.
- You must play when you can: passing (or drawing) is not offered then.
- Going out wins for your side; a block goes to the side with fewer pips; a tie follows
  `blockedTie`.
- Capicú: going out with 3-5 when the ends are 3 and 5 scores the bonus; with a double it does not.
- Chuchazo: going out with 0-0 as the last tile; `one-end` refuses it when both ends show blanks.
- Early bonuses for hands one to four, not for a blocked hand.
- Draw game: a player who cannot play draws, and passes only when the boneyard is spent (or down to
  two tiles with `leave-two`).
- Blocked hands: `blocker-or-next`, `difference`, and every `blockedTie` rule.
- Pass bonus: 20 the first time, 10 after; a partner's pass scores nothing; a block pays per opponent.
- Every preset deals and plays whole matches without breaking a rule (property tests).

## Not implemented, on purpose

- Scores divided by ten, each side scoring its own tiles in a blocked hand (low score wins), the
  leader passing the lead to a partner, *Chiva* (shutout), Milo, and three-player games: rare, and
  easy to add as options later. Five doubles are always dealt again with `redeal` on (the rule says
  a player *may* ask; nobody wants to keep five doubles).

## Sources

- Partnership Dominoes, pagat.com (www.pagat.com/domino/line/partnership.html), read 2026-11-27:
  the partnership game, the FID and national differences, *Doscientos* and *Quinientos* (early
  hand bonuses 100, 75, 50, 25; capicú and chuchazo 100 each, and the chuchazo variation).
- Draw Dominoes and Block Dominoes, pagat.com (www.pagat.com/domino/line/draw.html and
  block.html), read 2026-11-27: the two-player games and the Puerto Rican draw rules.
- Puerto Rico Dominoes Rules, Caribbean Trading Company (caribbeantrading.com), read 2026-11-27:
  the 6-6 lead, counter-clockwise play, drawing only when unable to play, *trancado*, capicú,
  chuchazo, and the table terms (*mano*, *ahorcado*, *puerta*).
