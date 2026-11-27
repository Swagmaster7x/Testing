# Gin Rummy: the rules as implemented

Milestone 13 (classic card pack). Written before the code, from the sources at the end. Code:
`src/games/gin-rummy/` with the melds and deadwood of the shared module `src/games/classic/`.

## Players, cards and values

- Two players, a standard 52-card pack. In Gin the ace is always low: A 2 3 … 10 J Q K.
- Card values for deadwood: ace 1, two to ten their number, jack, queen and king 10.
- A **meld** is a set (three or four cards of one rank) or a run (three or more cards of one suit
  in sequence; A-2-3 is a run, Q-K-A is not). A card belongs to one meld at a time.
- **Deadwood** is the cards in no meld; the count is the sum of their values. The app always
  arranges a hand into the melds that leave the least deadwood.

## The deal

- Seat 1 deals the first hand. Ten cards each; the next card is turned up to start the discard
  pile and the rest is the stock.
- Next dealer (option): the winner of the hand deals (default, as pagat gives it), the loser
  deals, or the deal alternates. After a dead hand the same dealer deals again.

## The first turn (option)

- **Up-card** (default): the non-dealer may take the turned card or pass; if they pass, the dealer
  may take it or pass; if both pass, the non-dealer draws from the stock. Whoever took a card then
  discards, and play goes on normally.
- **Eleven cards**: the non-dealer gets eleven cards, no card is turned, and the non-dealer starts
  by discarding.

## A turn

- Draw one card: the top of the stock, or the top of the discard pile. Then discard one card face
  up. A card taken from the discard pile may not be discarded on the same turn.
- **Knock**: instead of discarding face up, after drawing, a player whose deadwood (after the
  discard) is no more than the knock limit may discard face down and lay down their hand. The
  knock limit (option) is 10, or in **Oklahoma** the value of the first turned card (a picture is
  10; an ace is 1, or with the "ace means gin" option an ace allows only gin).
- **Gin**: knocking with no deadwood at all.
- **Big gin** (option): when all eleven cards (after drawing) form melds the player may lay them
  all down without discarding.
- **Dead hand**: when only two cards are left in the stock and the player who drew the third-last
  card discards without knocking, the hand is cancelled. No one scores and the same dealer deals.

## Laying off and scoring

- When a player knocks (not gin), the other player lays down their melds and may **lay off**
  deadwood on the knocker's melds: a fourth card on a set, or cards that extend a run at either end
  (a laid-off card may itself be extended). The knocker never lays off. Nobody may lay off on a gin.
  The app lays off for the defender in the way that leaves the least deadwood.
- If the knocker's count is lower, the knocker scores the difference.
- **Undercut**: if the defender's count (after laying off) is equal or lower, the defender scores
  the difference plus the undercut bonus (option: 25, 20 or 10).
- Gin scores the gin bonus (option: 25 or 20) plus the defender's whole count. A gin cannot be
  undercut. Big gin scores its bonus (31 or 50) plus the defender's count.
- Oklahoma with a spade turned for the first card: the hand's score is doubled (option on with
  Oklahoma).

## The game

- Hands are played until a player's total reaches the target (option: 100, 150, 250, or one
  hand). That player wins and adds the game bonus of 100.
- **Line bonus** (option: 25, 20 or none): each player adds this much for every hand they won.
- **Shutout** (option): if the loser scored nothing, the game bonus is doubled to 200 (default);
  or every hand's score is doubled; or nothing extra.
- The final totals (points, line bonuses, game bonus) decide the margin; the player who reached the
  target is first. A game never runs past 50 hands (then the higher total wins).

## Options

| Option | Values (default first) |
| --- | --- |
| Knock limit | ten · Oklahoma (the first turned card) · Oklahoma, an ace means gin only |
| Spade doubles (Oklahoma) | on · off |
| Gin bonus | 25 · 20 |
| Undercut bonus | 25 · 20 · 10 |
| Big gin | 31 · 50 · not allowed |
| Line bonus | 25 · 20 · none |
| Shutout | game bonus doubled · every hand doubled · nothing extra |
| Game to | 100 · 150 · 250 · one hand |
| First turn | the up-card offer · eleven cards to the non-dealer |
| Next dealer | the winner · the loser · alternate |

## Presets

| Preset | What it is |
| --- | --- |
| **Standard** (default) | Knock at 10, gin 25, undercut 25, big gin 31, line bonus 25, game 100 with a doubled bonus for a shutout, the up-card offer, the winner deals. |
| **Classic** | pagat's main rules: gin 20, undercut 10, no big gin, line bonus 20. |
| **Oklahoma** | The first turned card sets the knock limit, a spade doubles the hand, to 150. |
| **Quick hand** | Standard, a single hand. |

## Ask before you sit

1. Knock at ten, or Oklahoma?
2. How much are gin and an undercut worth? Is there big gin?
3. Line bonuses? What happens on a shutout?
4. Game to 100, or more?
5. The first turn: is a card turned up, or does the non-dealer get eleven?
6. Who deals the next hand?

## Notation

- Cards as in the poker module (`As`, `Td`, `2c`, `Kh`).
- Moves: `take` / `pass` (the up-card offer), `stock` / `discard` (the draw), `Kh` (discard the
  king of hearts), `knock:Kh` (discard it face down and knock), `big-gin`.

## Golden cases (tests/unit/gin-rummy-rules.test.ts)

1. Melds: sets of three and four, runs, ace low only, a card in one meld at a time; the best
   arrangement; deadwood counts.
2. The up-card offer in its three branches; eleven cards.
3. Drawing and discarding; the card just taken from the pile may not be thrown back.
4. Knocking at the limit, not above it; Oklahoma limits; an ace meaning gin only.
5. Gin and big gin; no laying off on gin.
6. Laying off on sets and on both ends of runs, including a chain of two cards.
7. Scoring: knocker wins, undercut (equal counts too), gin, big gin, the Oklahoma spade double.
8. The dead hand with two cards left.
9. The game: target, line bonus, game bonus, shutout rules, next dealer rules.
10. The pack is conserved; views show only your own hand and the cards the other player is known
    to hold (picked up from the pile).

## Not implemented, on purpose

- Three or four players, partnerships, Hollywood scoring (three games at once).
- Taking back the card you just threw, and the "fiftieth card" exception.
- A player choosing a worse arrangement of melds at the knock (the app shows the best), and
  laying off chosen by hand (the app lays off for the best count).

## Sources (read 2026-11-27)

- pagat.com, *Gin Rummy* (John McLeod, with Magnus and Paul Eaton):
  https://www.pagat.com/rummy/ginrummy.html — the deal and first turn, knocking, laying off,
  scoring, the bonuses and their variants, Oklahoma, the dead hand.
- Wikipedia, *Gin rummy*: https://en.wikipedia.org/wiki/Gin_rummy — the common 25-point gin and
  undercut bonuses, big gin (31, sometimes 50), the line bonus of 25, the shutout doubling.
