# No-Limit Texas Hold'em, as implemented

Milestone 5. Play chips only: there is nothing to buy and no real money anywhere (decision 6 in
the plan). Code: `src/games/holdem/rules.ts`; hand evaluator `src/games/holdem/evaluate.ts`;
golden cases: `tests/unit/holdem-rules.test.ts`. Omaha, Five-Card Draw and Seven-Card Stud come
in milestone 12.

## The game

- A standard 52-card pack. Each player gets two cards face down (hole cards). Five shared cards
  come face up: three at once (the flop), then one (the turn), then one (the river). A card is
  burned before each.
- **Blinds.** The player left of the button posts the small blind, the next the big blind. With
  two players the button posts the small blind and acts first before the flop, last after it.
- **Betting rounds.** Before the flop the player left of the big blind acts first; after it, the
  first active player left of the button. A player may fold, check (when nothing is owed), call,
  bet or raise. The big blind may raise when the action comes back to it unraised (its option).
- **No limit.** Any bet or raise may be up to all of a player's chips (all-in). A bet is at least
  the big blind; a raise is at least the size of the previous bet or raise in that round.
- **All-in for less** than a full raise does not reopen the betting to players who have already
  acted (they may only call or fold), unless the half-bet option says otherwise. A player who
  cannot cover a bet may call all-in for less.
- **Side pots.** A player all-in can win from each opponent only as much as they put in; the rest
  goes to side pots contested by those who put in more. A bet nobody could call is returned.
- **Showdown.** The best five-card hand from the seven available wins; cards speak. Hands are shown
  starting with the last player to bet or raise on the river, or, if the river was checked, the
  first active player left of the button.
- **Split pots.** Equal hands share the pot; an odd chip goes to the first winner left of the
  button.
- **Hand ranking**, best first: straight flush, four of a kind, full house, flush, straight, three
  of a kind, two pair, one pair, high card. The ace plays high, or low in the five-high straight
  (the wheel). Suits never rank.

## Formats and options

| Option | Values | Default (6-max cash) |
| --- | --- | --- |
| `format` | `cash` (six seats, a session of hands; a player who busts buys in again), `heads-up` (two players, a freezeout with rising blinds), `sit-and-go` (six players, a freezeout with rising blinds and prizes) | `cash` |
| `stack`: starting chips, in big blinds | 20, 50, 75, 100 | 100 |
| `hands`: hands in a cash session | 10, 30, 60, 100 | 60 |
| `levelHands`: hands per blind level (freezeouts) | 6, 10, 15 | 10 |
| `ante` | `none`, `ante` (every player antes: one chip in a cash game, a tenth of the big blind in a freezeout from level 4), `big-blind-ante` (the big blind antes one big blind for the whole table, after posting its blind; in freezeouts from level 4) | `none` |
| `straddle` (cash) | `off`, `live` (the player left of the big blind posts a live straddle of two big blinds every hand, if they have more than that, and acts last before the flop; the least raise is then to twice the straddle) | `off` |
| `shortAllIn` | `full-raise` (only a full raise reopens the betting), `half-raise` (an all-in raise of at least half a full raise reopens it) | `full-raise` |
| `oddChip` | `left-of-button`, `high-card` (to the winner holding the highest card, suits breaking ties: spades, hearts, diamonds, clubs) | `left-of-button` |
| `showdown` | `show-all` (every hand still in is shown), `muck` (in showdown order, a hand that cannot win or tie any pot it is in is thrown away unseen; when anyone is all-in every hand is turned up) | `show-all` |
| `payouts` (sit-and-go) | `65-35`, `50-30-20`, `winner-takes-all` | `65-35` |

Chips: in cash games the blinds are 1 and 2 and the smallest chip is 1. In freezeouts the blinds
start at 10 and 20 and rise every level (10/20, 15/30, 25/50, 50/100, 75/150, 100/200, 150/300,
200/400, 300/600, 400/800, 600/1200, 800/1600, 1000/2000, then doubling), and the smallest
chip is 5.

Some details the sources leave open, settled here:

- **Cards speak.** Hands are shown or mucked by the rules above; nobody has to announce a hand,
  and the app never mucks a hand that could win a share.
- **An opening bet all-in for less than the big blind** does not change the minimum: the next
  raise must add at least a big blind to it.
- **The straddle's minimum raise.** Pagat says a straddle doubles the minimum bet, so the least
  raise is to twice the straddle; Wikipedia gives the big blind over the straddle. This app
  follows Pagat. Ask at the table.
- **A short big blind.** A big blind all-in for less than a full big blind still makes the others
  call the full big blind; any chips nobody could match come back.

The button moves one seat to the left each hand, skipping players who are out (the "moving
button" most online rooms use). When two players bust in the same hand, the one who started the
hand with more chips finishes higher. A cash session ends after its hands; each player's result is
chips now less all the chips they bought.

## Presets

| Preset | What it sets |
| --- | --- |
| **6-max cash** (default) | Six seats, 100 big blinds each, a session of 60 hands, no ante, no straddle, standard rules. |
| **Heads-up** | Two players, 75 big blinds (1,500 chips at 10/20), blinds up every 10 hands. |
| **Sit-and-go** | Six players, 1,500 chips, blinds up every 10 hands, a big blind ante from level 4, prizes 65/35. |
| **Home game** | 6-max cash with antes, a live straddle, and the half-bet rule for short all-ins. |

## Ask before you sit

1. What are the blinds, and is there an ante or a straddle? Who may straddle, and what is the
   least raise over a straddle?
2. Does an all-in raise for less than a full raise reopen the betting (the half-bet rule)?
3. At showdown, who shows first, and may a beaten hand be mucked unseen?
4. Who gets the odd chip in a split pot?
5. In a tournament: how often do the blinds go up, and how are the prizes split?

## Golden cases (tested)

- The ranking of every category, the wheel, kickers, ties, and playing the board.
- The 7-card evaluator agrees with `pokersolver` on thousands of random hands (a test oracle, not
  shipped).
- Blinds and the first player to act, with six players and heads-up; the big blind's option.
- The minimum raise, a re-raise, a short all-in that does not reopen, and the half-bet option.
- A three-way all-in with two side pots; a side pot won by a player who loses the main pot; an
  uncalled bet returned; a split pot with an odd chip under both odd-chip rules.
- Showdown order: the last river aggressor first; left of the button when the river is checked.
- Chips are conserved in every random game, every preset (property tests).

## Not implemented, on purpose

- Limit and pot-limit betting, run it twice, bomb pots, a kill, the dead-button rule and
  multi-table tournaments: rare at the tables this app prepares for; each can be added.
- String bets and verbal declarations are live-table conduct, taught in the Table-ready lessons.

## Sources

- Texas Hold'em, pagat.com (www.pagat.com/poker/variants/texasholdem.html), read 2026-11-27: the
  deal, blinds (heads-up included), the betting rounds and the showdown order.
- Poker Betting and Showdown, pagat.com (www.pagat.com/poker/rules/betting.html), read
  2026-11-27: the minimum raise, incomplete raises, all-in and side pots, the straddle, the odd
  chip (left of the dealer, or the highest card with suits ranked spades, hearts, diamonds, clubs).
- Betting in poker and Texas hold 'em, Wikipedia, read 2026-11-27: the full-bet and half-bet rules
  for all-in raises, the live straddle, the moving and dead button.
