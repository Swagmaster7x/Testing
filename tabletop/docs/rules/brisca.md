# Brisca (two players, or four in pairs), as implemented

Milestone 3 (two players); milestone 12 added four players in pairs with signals (señas). Tute is
its own game (`docs/rules/tute.md`). Every rule that tables disagree on is an option, stored with
each game, and the named presets below are tested. Code: `src/games/brisca/rules.ts`. Golden
cases: `tests/unit/brisca-rules.test.ts` and `tests/unit/brisca-four.test.ts`.

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

## Four players in pairs

The standard Brisca of today is four players in two pairs, partners sitting opposite. Everything
above holds, with these differences:

- Three cards each, dealt one at a time starting on the dealer's right; play goes round to the
  right (counter-clockwise). The thirteenth card is turned for trumps and slid under the stock.
- The player on the dealer's right leads to the first trick; the dealer plays last.
- A trick of four goes to the highest trump in it, else to the highest card of the suit led.
- After each trick the winner draws first, then the others in the order of play. The stock lasts
  seven draws; the turned card is the last card drawn, by the player before the trick's winner.
  The last three tricks are played without drawing: ten tricks in all.
- Each side counts the points in the tricks both partners won: 61 wins, 60–60 follows `tie` (with
  `most-cards`, the side holding more cards wins).
- The swaps, "arrastro" (every player yet to play must answer with their best trump, or their best
  card) and the second brisca work as with two players. With `after-own-trick`, the player making
  the swap must have won a trick themselves.
- In the app seats 0 and 2 play against 1 and 3; the next seat in play sits on your right.

## Señas (an option, four players)

Many tables let partners tell each other about their high trumps with discreet signs; others play
in silence, or let partners talk. With `signals: señas`, a player may, on their turn and before
playing, make one sign for each of these trumps they hold, once a hand:

| Card of trumps | Sign |
| --- | --- |
| As | stretch the lips over the teeth |
| The second brisca (the Tres, or the 7 when it is second) | twist the mouth to one side |
| Rey | glance upwards |
| Caballo | show the tip of the tongue |
| Sota | shrug one shoulder |

Only the partner sees a sign; the other side never does. Signs here are always true: a player can
sign only a card they hold. The CPU signs its As, second brisca and Rey of trumps at its first
turn, and plays knowing its partner's signs. The flash-card drill in Practice teaches the signs.

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
| `players`: how many play | `2`, `4` (in pairs, partners opposite) | `2` |
| `signals`: señas between partners (four players) | `off`, `señas` (each may sign their high trumps to their partner) | `off` |

When a game is more than one hand, the deal alternates and the non-dealer always leads first.

## Presets

| Preset | What it sets |
| --- | --- |
| **Puerto Rico** (default) | The defaults above: both swaps, on any of your turns while the trump card is under the stock; 60–60 is a tie; one hand. |
| **Spain** | Both swaps, but only once you have won a trick (as Spanish references describe it); 60–60 goes to the side with more cards. |
| **Italy (briscola)** | No swaps; 60–60 is a tie. Italian two-player briscola has no swap rule. |
| **Open table** | Puerto Rico, played to three hands. |
| **Four players in pairs** | Puerto Rico rules, four players, no signs. |
| **Four in pairs, with señas** | Four players, signs allowed; swaps only once you have won a trick, 60–60 to the side with more cards (Spain). |

## Ask before you sit

1. Can the 7 of trumps take the turned card? Can the 2 take a low one? Only after you win a trick?
2. What happens at 60–60: a tie, or most cards?
3. How many hands make a game, and does a win over 100 points count double?
4. If an As or Tres is turned, does it stay?
5. Is "arrastro" with the As of trumps played?
6. Which card is the second brisca, the three or the seven?
7. (Four players) Are signs allowed, and which ones mean what? Or may partners talk, or show each
   other their cards? Are signs allowed only before the stock runs out?

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
- Four players: three cards each from the dealer's right, 28 cards in the stock with the turned
  card at the foot; the player after the dealer leads; a trick of four goes to the highest trump or
  the highest card of the suit led; the winner draws first and the turned card goes to the player
  before the winner; ten tricks; 120 points split by side; the outcome names both sides.
- Señas: a sign only for a high trump held, once, on your turn, without passing the turn; only
  with `señas` and four players; only the partner's view holds it; the partner's sampled deals
  always give the signed card to the signer, and the other side's do not.

## Not implemented, on purpose

- **Claiming the rest** (showing the top trumps to take the remaining tricks without playing):
  the result is the same as playing them out, and the app plays them quickly.
- **Mexican Brisca** (aim to take 11 points or fewer) and Brisca Rematada (Chile, three players,
  bidding) are different games; they are not in the plan.
- A swap made during the other player's turn: the app offers the swap on your own turn only,
  which in a two-player game is always before you play to the trick.
- With four players: talking between partners ("hablando", or the Roman rule where the leader may
  ask set questions), partners showing each other their first three cards, false signs, and
  catching the other side's signs. The app's signs are private and true.
- Briscola chiamata (five players, a called partner) and six players in threes.

## Sources

- Brisca, Spanish Wikipedia (es.wikipedia.org/wiki/Brisca), read again 2026-11-27 for four
  players: today's standard game is four players with three cards; play to the right; the winner
  draws first and the others in turn; seven draws in pairs, then three tricks without drawing;
  the swap by any player holding the 7 (or 2) who has won a trick; "arrastro" for every player yet
  to play; playing "con señas, hablando tapado o hablando"; in some variants partners show each
  other their three cards; Chile allows no signs.
- Briscola, pagat.com (www.pagat.com/aceten/briscola.html), read again 2026-11-27: four-player
  partnerships face to face, play counter-clockwise, the player right of the dealer leads, the
  winner draws first, and one system of visual signals: Ace, lips over the teeth; Three, mouth
  twisted to one side; King, a glance upwards; Queen or Knight, the tip of the tongue; Jack, a
  shrug; and the Roman alternative of limited conversation.

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
