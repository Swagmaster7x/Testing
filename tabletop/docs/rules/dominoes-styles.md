# Dominoes styles: All Fives and Cuban double nine, as implemented

Milestone 14 (first part). Two more styles on the Dominoes engine of milestone 4
(`docs/rules/dominoes.md`, which still holds for everything not said here). Code:
`src/games/dominoes/rules.ts`; golden cases: `tests/unit/dominoes-styles.test.ts`.

- **All Fives** (also called Five Up or Single Spinner in America): two to four players with a
  boneyard. The first double is a *spinner* that grows into a cross. After every play the open
  ends are added up, and a multiple of five scores at once.
- **Cuban double nine** (*dominó de parejas*): four players in partnerships with the double-nine
  set of 55 tiles, ten each, fifteen left face down. A blocked hand goes to the *player* with the
  fewest pips.

## All Fives

### The play

- The double six; **two players get nine tiles, three get seven, four (two partnerships) get
  five**. The rest are the boneyard.
- The first hand is led by a player drawn by lot, with any tile. Later hands are led by the player
  who went out; after a blocked hand, by a player drawn by lot again.
- You must play when you can. When you cannot, draw from the boneyard one tile at a time until you
  can, then play; with the boneyard spent, pass. (You may not draw while you hold a tile that fits.)
- **The spinner.** The first double played, and only that one, is the spinner. Tiles go on its
  two sides first, as in a line. Once both sides are covered, a third tile may go on one of its
  ends (the *upper arm* here) and after that a fourth on the other (the *lower arm*): the layout
  is a cross with up to four open ends. Other doubles lie across their arm as usual.

### Counting the ends

After every play the open ends are added up:

- each arm's end counts the number showing on it;
- a **double at the end of an arm counts both halves** (a 5-5 there counts ten), until a tile is
  played on it;
- the spinner counts both halves while it is an end of the line, that is until tiles touch both
  its sides; an arm not started yet counts nothing;
- a single tile on the table counts all its pips (a 5-5 or a 4-6 lead counts ten).

**If the count is a multiple of five (5, 10, … 35), the player who made it scores it at once.**

### The end of a hand

- Going out wins the hand. A blocked hand (nobody can play and the boneyard is spent) goes to the
  side with the fewest pips in hand.
- The winner scores the pips left in the **opponents'** hands, **rounded to the nearest five**
  ([1-2] alone counts 5, [1-1] alone counts 0). With three players the winner scores both other
  hands together, rounded once.
- A blocked hand tied between two sides scores nothing. With three players, two who tie for the
  fewest pips **share the third player's count**: each scores half, rounded down to a five (15
  gives 5 each). All three tied: nothing.
- The match is to **250 with two players, 200 with three or four**. A side that reaches the
  target, by a play or at the end of a hand, wins **at once**; the tiles still in hand are not
  counted.

## Cuban double nine

- The double-nine set: 55 tiles, every pair of numbers from blank to nine, 495 pips; each number
  is on ten tiles. Four players, partners face each other, **ten tiles each; the other fifteen
  stay face down and are never used** in that hand.
- A hand where someone holds five or more doubles is dealt again.
- The first hand is led by a player drawn by lot (at the table: one tile drawn by each side, the
  heavier wins the lead, and that side chooses who leads). Any tile may lead. Play goes to the
  right (counter-clockwise). You must play when you can, otherwise you pass; nobody draws.
- A hand ends when a player goes out (*dominar*, *pegarse*) or nobody can play (*trancado*).
- **A blocked hand goes to the player with the fewest pips**, and so to that player's side; what
  the partner holds does not matter. Two partners tied for the fewest still win. **Two opponents
  tied for the fewest: nobody scores.**
- **The winning side scores the pips left in the opponents' hands** (not its own, and never the
  fifteen sleeping tiles).
- The next hand is led by the winner (who went out, or the lightest hand of a block). After a tied
  block, the side that did not lead the tied hand leads, with its lightest hand.
- **The first side to 100 wins.** Table words: *pollona*, reaching 100 before the other side has
  scored; *viajera* or *tripollúa*, 100 or more in one hand; *Napoleón*, ends showing a one and a
  nine; *caja de muerto* (the coffin), the 9-9.

## Options added for these styles

The options of `docs/rules/dominoes.md` all stay; these are new or have new values.

| Option | Values | Default (Puerto Rico 500) |
| --- | --- | --- |
| `set`: the tiles | `double-six` (28 tiles, 168 pips), `double-nine` (55 tiles, 495 pips) | `double-six` |
| `mode`: who plays | adds `partnership-draw` (four in partnerships, the left-over tiles are a boneyard to draw from), `draw-three` and `block-three` (three players each for themselves) | `partnership` |
| `hand`: tiles each | `auto`, 5, 7, 9, 10. `auto` is ten with the double nine; when the ends score, nine, seven or five for two, three or four players; otherwise seven. A size too big for the set is cut to what the set allows. | `auto` |
| `spinner` | `none`, `first-double` (the first double played takes four arms) | `none` |
| `fives`: score the ends as you play | `off`, `on` (a multiple of five on the open ends scores at once) | `off` |
| `rounding`: pips counted at the end of a hand | `exact`, `nearest-five` | `exact` |
| `finish`: points made during play reach the target | `hand-end` (the hand is finished first), `at-once` (the match ends there) | `hand-end` |
| `blockedWinner` | adds `player` (the side of the player with the fewest pips; opponents tied with each other follow `blockedTie`) | `side` |
| `blockedScore` | adds `all` (a blocked hand scores every tile left in hand, the winners' own included) | `pips` |
| `nextLead` | adds `winner-lot` (who went out; after a block, a player drawn by lot) and `winning-team` (the winner; after a tie, the side that did not lead) | `winner` |
| `firstLead` | `double-six` now means the highest double dealt: the 6-6, and with the double nine the 9-9 or the highest double anyone holds (with no double dealt, the hand is dealt again) | `double-six` |
| `drawLimit` | adds `leave-one` (the last tile is never drawn) | `all` |
| `target` | adds 250 and 300 | 500 |

## Presets

| Preset | What it sets |
| --- | --- |
| **All Fives (two players)** | Two players, nine tiles each, draw from the boneyard; the first double is a spinner; multiples of five score as you play; the winner scores the loser's pips rounded to the nearest five; to 250, ending at once; lead by lot, then whoever went out (by lot after a block). |
| **All Fives (three players)** | The same for three players with seven tiles each, to 200. |
| **All Fives (partners)** | The same for four in two partnerships with five tiles each, to 200. |
| **Cuban double nine** | Partnership with the double nine, ten tiles each, fifteen sleeping; a blocked hand goes to the player with the fewest pips; the winners score the opponents' pips; to 100; lead by lot, then the winner, and after a tie the side that did not lead; five doubles are dealt again. |
| **Cuban 300** | As Cuban double nine, to 300, and a blocked hand scores every tile left in hand (the variant pagat reports together with the 300 target). |

## Ask before you sit

All Fives:

1. How many tiles each: nine (or seven) for two, seven for three, five for four?
2. Does the first double spin, and are the third and fourth arms open only once both its sides
   are covered?
3. Does a double at an end count both halves, and does the spinner stop counting once both sides
   are covered?
4. At the end of a hand, does the winner score the losers' pips rounded to the nearest five?
5. To 250 (two players) or 200? Does the game stop the moment someone reaches it?
6. May the last one or two tiles of the boneyard be drawn?

Cuban:

1. Double nine, ten tiles each, fifteen left out?
2. Who leads the first hand: drawn by lot, or the 9-9 (the highest double)?
3. A blocked hand: the player with the fewest pips? And two opponents tied?
4. Do the winners score only the opponents' pips, or every tile left after a block?
5. To 100, or to 300?
6. Five doubles: may you show them and ask for a new deal?

## Golden cases (tested)

- The double nine has 55 tiles and 495 pips; a Cuban deal gives ten to each of four, fifteen sleep
  and nobody may draw them; the action notation reads 7-9 only in a double-nine position.
- pagat's worked example of All Fives, play by play: 1-4 leads and scores 5; the 1-1 on the one
  is the spinner (count 6, no score); 4-4 makes 10; 3-4 on the 4-4 makes 5; 1-2 on the spinner's
  other side makes 5 (the spinner stops counting); 1-5 opens the third arm for 10; 5-5 on it makes
  15; 0-5 on the 5-5 makes 5; 1-3 opens the fourth arm and counts 8, no score.
- The third arm is offered only when both sides of the spinner are covered, the fourth only after
  the third; only the first double spins; a lone double lead counts both halves.
- A double at the end of an arm counts both halves until it is covered.
- Rounding: [1-2] left counts 5, [1-1] counts 0; a hand won by going out scores the opponents'
  pips rounded.
- A play that reaches the target ends the match at once; with `hand-end` the hand is played out.
- Three players: a blocked hand tied between two shares the third player's count.
- Cuban blocked hands: the player with the fewest pips wins for the side even when the side holds
  more in all; two opponents tied score nothing and the other side leads next; two partners tied
  win.
- Cuban scores only the opponents' pips; Cuban 300 scores every tile left after a block.
- Five doubles are dealt again; with the "highest double" lead and the double nine, the highest
  double dealt leads.
- Every new preset deals and plays whole matches keeping every tile, the pip total of its set, the
  scores and the views (property tests), and the bots' fast model scores every hand as the rules do.

## Not implemented, on purpose

- All Fives: drawing while you hold a tile that fits; having to reach the target exactly; each
  side losing its own pips at the end of a hand instead of the winner scoring them; scores divided
  by five for a cribbage board (the counts are the same, only the unit differs); Muggins and Five
  Up as presets (no spinner, or every double a spinner), and Sniff's "count both halves until
  covered". Muggins is All Fives with `spinner: none`, so it can be set up from the options.
- Cuban: the starting side choosing which partner leads (the app draws the player by lot, then the
  winner leads, which pagat gives as a common variant); Lankford's Cuban draw game; the
  double-six partnership game is simply `set: double-six` with the Cuban options.
- Showing five doubles is optional at a real table; with `redeal` on the app always deals again.

## Sources

- All Fives, pagat.com (www.pagat.com/domino/cross/all_fives.html), read 2026-11-27: the hand
  sizes, the spinner and its arms, counting the ends (and the worked example of nine plays, read
  from its diagrams), rounding to the nearest five, ties, the targets and the variations.
- The Fives and Threes family, pagat.com (www.pagat.com/domino/fives_family.html), read 2026-11-27: the
  spinner families (Muggins, All Fives, Five Up) and the scoring tiles.
- Muggins, pagat.com (www.pagat.com/domino/line/muggins.html), read 2026-11-27: the line game
  without a spinner and the rounding rule.
- Cuban Dominoes, pagat.com (www.pagat.com/domino/line/cuban.html), read 2026-11-27: the
  double-nine partnership game, ten tiles and fifteen left out, five doubles, the player with the
  fewest pips, ties between opponents, scoring the opponents' pips, 100 and the 300 variant, the
  first lead (by lot, or the highest double), and the table words.
- Caribbean Dominoes, pagat.com (www.pagat.com/domino/line/caribbean.html), read 2026-11-27:
  "the individual player with the fewest spots wins" in Jamaica and Haiti, the same blocked-hand
  rule as Cuba, and ties between opponents.
