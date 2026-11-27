# Blackjack: the rules as implemented

Milestone 13 (classic card pack). Written before the code, from the sources at the end. Play
chips only (PLAN.md decision 6): nothing is bought, nothing is money. Code: `src/games/blackjack/`.

## The table

- One to three betting boxes (option, "players at the table"); you sit in the first. The other
  boxes are CPU players at the chosen level, or other people in pass-and-play. The dealer is the
  house and plays by fixed rules, so the dealer is not a seat.
- A shoe of 1, 2, 6 or 8 standard packs (option). It is shuffled at the start and again before a
  round once the cut card is reached (option: 50%, 75% or 85% of the shoe dealt).
- Every box starts with 1,000 play chips. Bets go in steps of 10 between the table limits (option:
  10 to 500 by default, 20 to 1,000, or 50 to 2,500), so every payout (3 to 2, 6 to 5, insurance
  at half the bet, surrender) is a whole number of chips. A session is a set number of rounds (option:
  20, 10, 50 or 100); a box that cannot cover the minimum sits out, and the session ends early if
  every box is out.

## Card values

- Two to ten count their number, pictures 10, an ace 1 or 11. A hand with an ace counted as 11 is
  **soft**, any other **hard**.
- A **blackjack** (natural) is an ace and a ten-value card as the first two cards. A 21 made after
  a split is not a blackjack.

## A round

1. **Bets**: each box in turn places a bet.
2. **Deal**: one card face up to each box, one face up to the dealer, a second to each box, and the
   dealer's hole card face down. Under the European no-hole-card rule the dealer takes the second
   card only after the players have finished.
3. **Insurance** (option, offered by default): when the dealer shows an ace, each box may insure
   for half its bet. Insurance pays 2 to 1 if the dealer has blackjack. Taking it with a blackjack
   is "even money" and is treated the same way.
4. **The peek** (hole-card rule): with an ace or a ten-value card showing, the dealer checks for
   blackjack. If the dealer has it, the round ends: every box loses its bet except a blackjack,
   which pushes. Otherwise insurance is lost, and every player blackjack is paid at once.
5. **The players' turns**, box by box, hand by hand:
   - **Hit** (one more card), **stand**.
   - **Double**: on the first two cards of a hand only (option: any two cards, a total of 9 to 11,
     or 10 to 11), add a bet equal to the first and take exactly one card.
   - **Split**: two cards of the same rank (any two ten-value cards count as a pair) may be split
     into two hands with a second bet. Each hand gets a second card. Split up to two, three or four
     hands (option). Aces split once (option: may be resplit), get one card each and stand (option:
     may be hit). Doubling after a split (option, allowed by default).
   - **Surrender** (option: none, or late): give up the hand for half the bet, as the first and
     only decision on the first two cards, after the dealer has checked for blackjack. Not after a
     split.
   - A hand that reaches 21 stands by itself; a hand over 21 is **bust** and loses at once.
6. **The dealer** turns the hole card and draws until reaching 17 or more. On a soft 17 the dealer
   stands (default) or hits (option). The dealer does not draw if every player hand is bust,
   surrendered or a paid blackjack.
7. **Settlement**: a hand closer to 21 than the dealer wins even money; equal totals push; a bust
   dealer pays every hand still standing. A blackjack pays 3 to 2 (default) or 6 to 5 (option).
   With the **five-card Charlie** option, a hand of five cards that is not bust wins even money
   whatever the dealer has.
8. **No hole card** (European rule): if the dealer's second card makes blackjack, the players lose
   every bet on the table, doubles and splits included (option: or only their original bets).

## Basic strategy, computed by expected value

The app works out the right play for every hand against every dealer card from the rules in force
(`src/games/blackjack/strategy.ts`), not from a printed chart:

- The cards the player holds and the dealer's up-card are taken out of the shoe; every later card is
  drawn from that shoe without further removal (the usual "total-dependent" approximation).
- With the peek rule the dealer's hole card is conditioned on there being no blackjack.
- Hit, stand and double are exact under that approximation; a split hand is played with the same
  strategy, counting further splits by the chance of drawing another card of the same rank.
- A total is decided by the average over every two-card hand that makes it (pairs have their own row).
- The chart shows the best play with its fallback: "double, otherwise hit", "surrender, otherwise
  hit", "split if doubling after a split is allowed, otherwise hit".
- Insurance is never right without counting (the app shows its expected value).

## Counting (a coach help and a drill)

- Hi-Lo: 2 to 6 count plus one, 7 to 9 nothing, tens and aces minus one. The **running count** adds
  every card seen since the shuffle; the **true count** is the running count divided by the decks
  left in the shoe.

## Options

| Option | Values (default first) |
| --- | --- |
| Decks | 6 · 8 · 2 · 1 |
| Soft 17 | dealer stands · dealer hits |
| Blackjack pays | 3 to 2 · 6 to 5 |
| Double on | any first two cards · 9, 10 or 11 · 10 or 11 |
| Double after split | allowed · not allowed |
| Split to | four hands · three hands · two hands |
| Resplit aces | no · yes |
| Hit split aces | no · yes |
| Surrender | late · none |
| Hole card | the dealer peeks · no hole card, lose everything · no hole card, lose original bets only |
| Insurance | offered · not offered |
| Five-card Charlie | off · on |
| Cut card | 75% · 50% · 85% |
| Table limits | 10 to 500 · 20 to 1,000 · 50 to 2,500 |
| Rounds | 20 · 10 · 50 · 100 |
| Players at the table | you alone · two boxes · three boxes |

## Presets

| Preset | What it is |
| --- | --- |
| **Six-deck shoe** (default) | 6 decks, dealer stands on soft 17, double any two, double after split, split to four, late surrender, 3 to 2. |
| **Double deck** | 2 decks, dealer hits soft 17, double after split, no surrender, 3 to 2. |
| **Single deck, 6 to 5** | 1 deck, dealer hits soft 17, double on 10 or 11 only, no double after split, split to two, blackjack pays 6 to 5 (the version that costs players the most). |
| **European** | 6 decks, no hole card (lose everything to a dealer blackjack), double on 9 to 11, double after split, no surrender. |

## Ask before you sit

1. How many decks? Does the dealer hit soft 17 (it is printed on the felt)?
2. Does blackjack pay 3 to 2 or 6 to 5?
3. Which hands may I double? After a split?
4. How many times may I split? Aces?
5. Is there surrender?
6. Does the dealer take a hole card and peek?
7. What are the table limits?

## Notation

- Cards as in the poker module (`As`, `Td`). Moves: `bet:25`, `insure`, `no-insurance`, `hit`,
  `stand`, `double`, `split`, `surrender`.

## Golden cases (tests/unit/blackjack-rules.test.ts)

1. Hand totals: soft and hard, aces counted down, blackjack only on two cards and not after a split.
2. Betting limits and bankroll; a box that cannot cover the minimum sits out.
3. Insurance offered against an ace only; it pays 2 to 1.
4. The peek: a dealer blackjack ends the round; a player blackjack pushes; player blackjacks are paid 3 to 2 or 6 to 5.
5. Doubling restrictions; double after split allowed or not.
6. Splitting: ten-value pairs, the hand limit, aces (one card, no resplit unless allowed), 21 after a split is not blackjack.
7. Late surrender: first decision only, never after a split, refunds half.
8. The dealer stands or hits on soft 17; the dealer does not draw when every hand is settled.
9. No hole card: everything lost, or original bets only.
10. Five-card Charlie.
11. Chips are conserved: what the boxes lose the house wins, round by round.
12. The basic-strategy chart for the default rules matches the published six-deck chart, and the
    known rule differences move the right cells (soft 17, doubling restrictions, single deck).

## Not implemented, on purpose

- Early surrender, side bets (perfect pairs, 21+3), dealer's choice home games where the dealer
  role rotates among the players, Spanish 21, Blackjack Switch, players' cards dealt face down.
- Swedish pub rules (17 to 19 ties lose), a player betting on several boxes.

## Sources (read 2026-11-27)

- pagat.com, *Blackjack*: https://www.pagat.com/banking/blackjack.html — the deal, insurance, the
  peek, the player options, the variants (6 to 5, European no-hole-card, surrender, five-card
  Charlie, splitting limits), basic strategy for 6 decks, S17, double after split, late
  surrender, and the Hi-Lo count.
- Wikipedia, *Blackjack*: https://en.wikipedia.org/wiki/Blackjack — rule variations and their
  effect on the house edge (checked against the computed charts).
