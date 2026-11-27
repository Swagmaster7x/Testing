# Brisca (two players), as implemented

Milestone 3. Four players in pairs with signals (señas) and Tute come in milestone 12. Every rule
that tables disagree on is an option, stored with each game, and the named presets below are
tested. Code: `src/games/brisca/rules.ts`. Golden cases: `tests/unit/brisca-rules.test.ts`.

## The cards

The Spanish 40-card pack: four suits, **oros** (coins), **copas** (cups), **espadas** (swords) and
**bastos** (clubs), each with As (1), 2 to 7, **Sota** (10, the page), **Caballo** (11, the
knight) and **Rey** (12, the king). There are no 8s or 9s.

Order in each suit, strongest first, and points:

| Card | As | Tres | Rey | Caballo | Sota | 7 | 6 | 5 | 4 | 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Points | 11 | 10 | 4 | 3 | 2 | 0 | 0 | 0 | 0 | 0 |

The As and the Tres are the **briscas**. The Tres beating the Rey trips up every beginner.
The pack holds 120 points, so **61 wins a hand** and 60–60 is a tie (see options).

Notation used in the app, lessons and records: the rank (`A`, `2`–`7`, `S` Sota, `C` Caballo,
`R` Rey) and the suit (`o`, `c`, `e`, `b`): `Ao` is the As de oros, `Rb` the Rey de bastos,
`7e` the siete de espadas.

## A hand

1. The dealer shuffles and deals three cards to each player, one at a time, starting with the
   other player. The next card is turned face up: its suit is **trumps** (*triunfo*). It is slid
   face up under the stock, so it is the last card anyone draws.
2. The non-dealer leads to the first trick. The second player may play **any card**: there is
   never a duty to follow suit, to beat the card led, or to trump.
3. The trick goes to the highest trump in it; if it has no trump, to the higher card of the suit
   led. A card of another suit never wins.
4. The winner takes the trick face down, draws the top card of the stock, the loser draws the
   next, and the winner leads to the next trick. On the 17th trick the loser draws the turned
   trump card. The last three tricks are played without drawing.
5. After 20 tricks each player counts the points in the tricks they won.

**The swap.** A player holding the **7 of trumps** may exchange it for the turned card when the
turned card is a point card (Sota, Caballo, Rey, Tres or As). A player holding the **2 of trumps**
may exchange it for a turned 4, 5, 6 or 7. In the app a swap is made on your turn, before you play
a card, while the turned card is still under the stock. The swap is public: everyone knows who now
holds the turned card.

## Options

| Option | Values | Default (Puerto Rico) |
| --- | --- | --- |
| `swap`: which swaps exist | `seven-and-two` (7 takes a turned point card, 2 takes a turned 4–7), `seven` (only the 7), `none` | `seven-and-two` |
| `swapWhen`: when a swap may be made | `any-turn` (on your turn, until the turned card is drawn), `after-own-trick` (only once you have won a trick) | `any-turn` |
| `tie`: a 60–60 hand | `draw`, `most-cards` (the side holding more cards in its tricks wins; equal cards is still a draw) | `draw` |
| `turnedBrisca`: an As or Tres turned for trumps | `stays`, `redeal` (it goes back into the stock at random and the next card is turned) | `stays` |
| `bigWin`: a hand won with more than 100 points | `single`, `double` (it counts as two hands toward the game) | `single` |
| `matchTo`: hands to win the game | 1, 2, 3, 5, 7 | 1 |
| `trumps`: how trumps are chosen | `turned` (the turned card), `rotate` (oros, copas, espadas, bastos in turn, hand by hand; nothing is turned and nothing can be swapped) | `turned` |
| `arrastre`: leading the As of trumps with "arrastro" | `off`, `on` (the other player must answer with their best trump, or if they have none, their best card) | `off` |
| `secondBrisca`: the card worth 10 and ranked second | `three`, `seven` (as in Portuguese *bisca*) | `three` |

When a game is more than one hand, the deal alternates and the non-dealer always leads first.

## Presets

| Preset | What it sets |
| --- | --- |
| **Puerto Rico** (default) | The defaults above: both swaps, on any of your turns while the trump card is under the stock; 60–60 is a tie; one hand. |
| **Spain** | Both swaps, but only once you have won a trick (as Spanish references describe it); 60–60 goes to the side with more cards. |
| **Italy (briscola)** | No swaps; 60–60 is a tie. Italian two-player briscola has no swap rule. |
| **Open table** | Puerto Rico, played to three hands. |

## Ask before you sit

1. Can the 7 of trumps take the turned card? Can the 2 take a low one? Only after you win a trick?
2. What happens at 60–60: a tie, or most cards?
3. How many hands make a game, and does a win over 100 points count double?
4. If an As or Tres is turned, does it stay?
5. Is "arrastro" with the As of trumps played?
6. Which card is the second brisca, the three or the seven?
7. (Four players) Are signals allowed, and which ones? (Milestone 12.)

## Golden cases (tested)

- The Tres of a suit beats the Rey of that suit; the As beats the Tres.
- A card of another suit never wins, however strong: Ao led, Ac played, trumps espadas: Ao wins.
- Any trump beats any non-trump: 2e beats Ao when espadas are trumps.
- The second player may throw a blank card instead of winning (no duty to follow or beat).
- Draw order: the winner draws first; on trick 17 the loser draws the turned card.
- The swap: with Rc turned, the holder of 7c may swap; with 5c turned only the 2c may swap
  (`seven-and-two`); `seven` allows only the first; `after-own-trick` refuses a swap before the
  swapping player has won a trick; no swap once the turned card has been drawn.
- Points always total 120 at the end of a hand; 61 wins; 60–60 follows the `tie` option.
- `arrastre`: after "arrastro", a player holding trumps must play their best trump.
- `secondBrisca: seven` moves the 10 points and the second rank from the Tres to the 7.

## Not implemented, on purpose

- **Claiming the rest** (showing the top trumps to take the remaining tricks without playing):
  the result is the same as playing them out, and the app plays them quickly.
- **Mexican Brisca** (aim to take 11 points or fewer) and Brisca Rematada (Chile, three players,
  bidding) are different games; they are not in the plan.
- A swap made during the other player's turn: the app offers the swap on your own turn only,
  which in a two-player game is always before you play to the trick.

## Sources

- Brisca, Spanish Wikipedia (es.wikipedia.org/wiki/Brisca), read 2026-11-27: deal, the turned
  card, no duty to follow, the 7 and 2 swaps (only after winning a trick, before the last draw),
  60–60 to the side with more cards, wins over 100 counting double, games to 3, 5 or 7, rotating
  trumps, "arrastro", and the regional second brisca (the 7 in Portuguese-speaking countries).
- Brisca, English Wikipedia (en.wikipedia.org/wiki/Brisca), read 2026-11-27: the same rules in
  English.
- Briscola, pagat.com (www.pagat.com/aceten/briscola.html), read 2026-11-27: two-player play,
  draw order, the loser drawing the turned card, re-turning an As or Tres, ties.
- pagat.com's Puerto Rico page (Brisca is the island's most popular card game). The Puerto Rican
  rules page it links (J. Carrillo-Muniz, on an archive site) and Fournier's rules page could not
  be reached from the build environment; the Puerto Rico preset follows the plan's defaults.
