# Tute, as implemented

Milestone 12. Tute is Brisca's bigger cousin: the same Spanish pack, the same order and points, but
you must follow suit and win the trick when you can, and a Rey and Caballo of one suit held together
can be **sung** for 20 points, or 40 in trumps. Holding all four kings or all four knights, a
**tute**, wins outright. The standard game is four players in fixed pairs; two players with a stock
is a preset. Every rule that tables disagree on is an option, stored with each game, and the named
presets below are tested. Code: `src/games/tute/rules.ts`. Golden cases:
`tests/unit/tute-rules.test.ts`.

## The cards

The Spanish 40-card pack: four suits, **oros** (coins), **copas** (cups), **espadas** (swords) and
**bastos** (clubs), each with As (1), 2 to 7, **Sota** (10, the page), **Caballo** (11, the
knight) and **Rey** (12, the king). There are no 8s or 9s.

Order in each suit, strongest first, and points, as in Brisca:

| Card | As | Tres | Rey | Caballo | Sota | 7 | 6 | 5 | 4 | 2 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Points | 11 | 10 | 4 | 3 | 2 | 0 | 0 | 0 | 0 | 0 |

The pack holds 120 points. The side that takes the last trick adds 10, the **diez de últimas**
("the last ten"), so a hand played out holds 130 points before any cantes.

Notation used in the app, lessons and records: the rank (`A`, `2`–`7`, `S` Sota, `C` Caballo,
`R` Rey) and the suit (`o`, `c`, `e`, `b`): `Ao` is the As de oros, `Rb` the Rey de bastos. A cante
is written `sing-` and the suit (`sing-c`), a tute `tute-R` (kings) or `tute-C` (knights), and the
exchange for the turned card `swap`.

## Seats and turns

Play goes to the right (counter-clockwise), as at Spanish tables: seat 1 plays after seat 0. With
four players, partners sit opposite: seats 0 and 2 against seats 1 and 3. You are seat 0, your
partner seat 2, the player on your right seat 1 and on your left seat 3. With two players each
player is a side.

## A hand for four (the standard game)

1. The dealer shuffles and deals all forty cards, ten each, one at a time, starting with the player
   on the dealer's right. The **last card**, the dealer's own, is turned face up: its suit is
   **trumps** (*triunfo*). The dealer then takes it into hand, so everyone knows the dealer holds it
   until it is played.
2. The player on the dealer's right leads to the first trick. The others play in turn to the right.
3. **Obligations** (the default; see options for the variations):
   - You must **follow suit** (*asistir*) if you can.
   - Following suit, you must **beat** the best card of the suit so far (*montar*) if you can. If
     the trick has already been trumped, any card of the suit will do.
   - If you cannot follow suit, you must **trump** (*fallar*) if you can. If a trump is already in
     the trick, you must play a higher trump (*contrafallar*, *pisar*) if you can; if you cannot,
     you may play any card.
   - These hold even when your partner is winning the trick.
4. The trick goes to the highest trump in it; with no trump, to the highest card of the suit led.
   The winner's side keeps it, and the winner leads the next trick.
5. After ten tricks each side counts its points: card points, the last ten, and its cantes.

## Cantes (singing)

Holding the **Rey and Caballo of one suit** you may sing them: **20** points (*las veinte*) in a
plain suit, **40** (*las cuarenta*) in trumps. The two cards are shown and stay in your hand.

- You may sing only **after your side has won a trick**, and **one cante per trick won**.
- The cante for a trick is made during the next trick, on your turn, before you play your card.
  With the default (`singer: side`) either partner of the side that won may make it: the winner
  before leading, or the partner before playing to that next trick. Once one of them has sung, the
  other cannot sing for the same trick.
- With **40 first** (default on), a player holding the trump pair and a plain pair must sing the
  40 before the 20.
- Singing is never compulsory, and a pair not sung now can be sung after a later trick your side
  wins, while you still hold both cards.

**Tute**: holding **all four Reyes or all four Caballos** in one hand, you may declare a tute,
under the same conditions as a cante (after your side wins a trick, on your turn). The cards must
all be in one player's hand; partners cannot combine. A tute ends the hand at once and, by default,
**wins the game** (see `tute` for the other values).

## Two players, with a stock (preset)

1. The dealer deals eight cards each, one at a time, starting with the other player. The next card
   is turned face up for trumps and slid under the stock, so it is drawn last.
2. The non-dealer leads. The winner of each trick draws the top card of the stock, the loser the
   next; the loser of the twelfth trick draws the turned card. The last eight tricks are played
   without drawing.
3. **While the stock lasts** the obligations are relaxed (option `stockRules`): by default there
   are none at all and you may play any card. **Once the stock is gone**, the full obligations
   above apply: follow, beat, trump, overtrump.
4. Cantes, the tute and the last ten work as with four players. In the app a cante is made at the
   start of the winner's next turn, after both players have drawn.
5. **The exchange.** The holder of the **7 of trumps** may exchange it for the turned card when the
   turned card is an As, Tres, Rey, Caballo or Sota; the holder of the **2 of trumps** may exchange
   it for a turned 4, 5, 6 or 7 (including a 7 just put there by an exchange). By default only once
   you have won a trick, on your turn, while the turned card is still under the stock. The exchange
   is public.

## Scoring and the game

- A hand's points for a side: the card points in its tricks, plus 10 for the last trick, plus its
  cantes.
- **Who wins the hand** (option `handWin`): by default the side with **more points** once the hand
  is played out; a tie goes to the side that took the last trick (option `tie`). With
  `reach101`, a side wins the hand the moment it reaches **101** (the app announces it); if the
  cards run out with neither side there, a new hand is dealt and both sides keep their points (a
  **vuelta**), until one reaches 101.
- Each hand won scores one game (*juego*, also called a stone, *piedra*). The first side to win the
  agreed number of games (option `matchTo`, default three) wins the match.
- A tute ends the hand and, by default, the whole match.
- **Capote** (option, off by default): a side that takes every trick of a hand played out (with
  two players, every trick after the stock is gone) scores two games for it.
- The deal passes to the right after every hand.

## Options

| Option | Values | Default (Spain, in pairs) |
| --- | --- | --- |
| `players` | `4` (fixed pairs, partners opposite), `2` (with a stock) | `4` |
| `mustBeat`: the duty to win the trick (*montar*) | `yes` (follow and beat, trump and overtrump), `no` (follow suit with any card; when void, play any trump) | `yes` |
| `partner`: when your partner is winning the trick | `same` (the obligations still hold), `relaxed` (you need only follow suit; void, you may play anything) | `same` |
| `underTrump`: void, and you cannot beat the trump already played | `free` (play any card), `must` (you must still play a trump if you hold one) | `free` |
| `stockRules`: two players, while the stock lasts | `free` (no obligations), `trumps` (when a trump is led you must play a trump if you hold one), `full` (all obligations from the first trick, *arrastrado*) | `free` |
| `singer`: who may sing for a trick | `side` (either partner, during the next trick), `winner` (only the player who won it, before leading) | `side` |
| `fortyFirst`: the 40 before the 20 | `yes`, `no` | `yes` |
| `tute`: what a tute is worth | `game` (wins the match), `two` (ends the hand; counts as two games), `hand` (ends the hand; counts as one) | `game` |
| `handWin`: who wins a hand | `most` (more points when played out), `reach101` (first to 101, with vueltas) | `most` |
| `tie`: equal points with `most` | `last-trick` (the side that took the last trick wins), `draw` (nobody scores the hand) | `last-trick` |
| `capote`: every trick taken | `off`, `two` (counts as two games) | `off` |
| `swap`: which exchanges for the turned card exist | `seven-and-two`, `seven`, `none`. With four players the exchange is made with the dealer, while the dealer still holds the turned card | `none` |
| `swapWhen`: when an exchange may be made | `after-own-trick` (once your side has won a trick), `any-turn` | `after-own-trick` |
| `matchTo`: games to win the match | 1, 2, 3, 4, 5, 7 | 3 |

## Presets

| Preset | What it sets |
| --- | --- |
| **Spain, in pairs** (default) | The defaults above: four players, full obligations even towards your partner, either partner sings, 40 first, a tute wins the match, more points wins the hand (ties to the last trick), three games. |
| **Pairs to 101** | As above, but a hand is won by the first side to reach 101, with vueltas when nobody does; a tute counts as two games. |
| **Pairs, easy on partners** | As the default, but when your partner is winning the trick you need only follow suit, and only the player who won a trick may sing for it. |
| **Two players (habanero)** | Two players with a stock: no obligations while the stock lasts; the 7 and the 2 of trumps take the turned card once you have won a trick; first to 101 with vueltas; three games. |
| **Two players, arrastrado** | As habanero, but the full obligations apply from the first trick. |
| **Two players, trumps must follow** | As habanero, but while the stock lasts a trump led must be answered with a trump. |

## Ask before you sit

1. Must you beat the card on the table when you can, or only follow suit?
2. If you cannot follow and cannot beat the trump already played, must you still play a trump?
3. When your partner is winning the trick, do the obligations still apply?
4. Who may sing after a trick: only the winner, or either partner? Must the 40 come before the 20?
5. What is a tute worth: the whole game, two games, or one?
6. Does a hand go to the side with more points, or to the first side to reach 101? What happens on
   a tie?
7. How many games make a match? Is capote played?
8. (Two players) Are there obligations while the stock lasts? May the 7 or the 2 take the turned
   card, and only after winning a trick?

## Golden cases (tested)

- The Tres of a suit beats the Rey; the As beats the Tres; any trump beats any plain card; a card
  of another plain suit never wins.
- Holding the suit led, a card of another suit is refused ("you must follow suit").
- Holding a higher card of the suit led, a lower one is refused ("you must win the trick"); once the
  trick is trumped, any card of the suit led is allowed.
- Void in the suit led, a plain card is refused while you hold a trump ("you must trump"); with a
  trump in the trick, a lower trump is refused while you hold a higher one ("you must beat the
  trump"); holding only lower trumps you may play anything (`underTrump: free`) or must play a
  trump (`must`).
- The obligations hold when your partner is winning (`partner: same`) and are lifted to following
  suit (`relaxed`).
- `mustBeat: no` allows a lower card of the suit led, and any trump when void.
- Two players: any card while the stock lasts (`free`); a trump answered with a trump (`trumps`);
  full obligations once the stock is empty, and from the first trick with `full`.
- Cantes: none before your side wins a trick; 20 in a plain suit, 40 in trumps; one per trick; the
  partner may sing during the next trick (`side`) but not with `winner`; the 20 is refused while
  the 40 is unsung (`fortyFirst`); a suit is sung once.
- A tute of four Reyes or four Caballos ends the hand: the match (`game`), two games, or one.
- The last trick is worth 10; a hand played out totals 130 points plus its cantes.
- More points wins; a tie goes to the last trick or is a draw. With `reach101` the hand ends as
  soon as a side reaches 101, and a vuelta carries both totals into the next hand.
- The exchange: the 7 takes a turned point card and the 2 a turned 4–7, after your side has won a
  trick (`after-own-trick`), never once the turned card has been drawn; with four players the
  dealer gives up the turned card and receives the 7.
- Capote counts two games when the option is on.
- Four players: ten cards each, the dealer holds the turned card, the player on the dealer's right
  leads; the deal passes to the right.

## Not implemented, on purpose

- **Revokes** (*renuncio*) and their penalties: the app never lets an illegal card be played, and
  says which obligation stops it.
- **Announcing 101** yourself: with `reach101` the app announces for you as soon as a side gets
  there, so a side never loses a hand for forgetting to call it.
- **Declared capote** (two-player habanero, where a player announces an attempt at the last eight
  tricks and loses the hand if it fails): the app's capote option scores a capote that happens,
  undeclared.
- **Singing before the draw** (two players): in the app the winner sings at the start of the next
  turn, after both players have drawn, so a card just drawn can complete a pair. Some tables make
  the winner sing before drawing.
- **The exchange "until two cards are left"**: some tables stop exchanges once the stock is down to
  two cards; the app allows it until the turned card is drawn, which differs only in the last
  drawing trick.
- **Tute subastado** (bidding), **tute cabrero** and **tute arrastrado for three** (each player for
  themselves), **tute habanero for three or more**, and **guiñote** (Aragon's relative with a
  stock for four) are different games, not in the plan.
- **Signals between partners**: not part of Tute; Brisca's señas are a separate milestone.

## Sources

Read 2026-11-27. The build environment's network policy refused www.pagat.com, es.wikipedia.org and
en.wikipedia.org, so every rule above was taken from search-engine extracts of these pages and
checked against at least one other source:

- Tute, pagat.com (www.pagat.com/marriage/tute.html), via search extracts: partnership play, the
  duty to follow and to beat the best card so far, trumping and overtrumping, a tute declared after
  winning a trick winning the game, the last ten, the two-player game with no obligations until the
  stock is exhausted, and the 7 or 2 taken back when no trick is won before the turned card is
  drawn.
- How to play Tute, Fournier (www.nhfournier.es/en/como-jugar/tute/), via search extracts: pairs
  sitting opposite, ten cards each with the last card setting trumps, follow, beat, trump and
  overtrump, 20 and 40, a tute valid only in one player's hand, the partner declaring too, 101
  points, the last ten breaking a tie, and two players following only trumps while the stock lasts.
- Club Conservador de Cartes i Jocs, Tute (www.cccj.es/reglaments/tute.htm), via search extracts:
  cantes only after winning a trick, one per trick, the 40 before the 20, either partner of the
  side that won may sing, the 7 taking a turned As, Tres or figure and the 2 a turned 7 or lower,
  and no exchange in its four-player individual form.
- Tute, Spanish Wikipedia (es.wikipedia.org/wiki/Tute, read through wikiwand.com/es/Tute extracts):
  the order of the obligations (follow and beat; if unable to beat, follow; if unable to follow,
  trump) and the regional difference over the duty to beat.
- Tute and Tute habanero, Ludoteka (www.ludoteka.com/clasika/tute.html,
  www.ludoteka.com/tute-habanero.html), via search extracts: more than 100 to win a two-player
  hand, capote over the last eight tricks, a tute winning the game when the match is short and two
  points otherwise.
- Normas del tute, Las 40 (tute.las40.es/rules/), via search extracts: a tute ends the hand and is
  worth two points to the pair; the last ten; 130 in the cards without cantes.
- Jaamm (jaamm.com/es/jugar-al-tute-online/) and Barajamos (barajamos.com/tute), via search
  extracts: the cante made by either partner during the next trick, and the obligations holding
  whoever is winning the trick.
- Juego Tute o Tuti, Sabelotodo (www.sabelotodo.org/juegos/tute.html), via search extracts: you
  must trump only when your trump would beat the cards on the table, and may otherwise play any
  card.
- Mundijuegos and Juego a las cartas (mundijuegos.com, juegoalascartas.com/tute/), via search
  extracts: the partner must sing in time or lose the chance; several cantes are sung in separate
  tricks, the 40 first.
- Reglamento del Tute Cabrero, tute.com.ar, via search extracts: the chain of exchanges (the 7
  takes a high turned card, then the 2 takes the 7), in the Argentine individual game.
- Guiñote pages (ludoteka.com/clasika/guinote.html and others), via search extracts: the partner
  exemption (only following suit when your partner is winning) and vueltas to 101, both of which
  some Tute tables borrow.
