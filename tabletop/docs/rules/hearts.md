# Hearts: the rules as implemented

Milestone 13 (classic card pack). Written before the code, from the sources at the end. Every
rule that tables disagree on is an option; named presets are sets of options. The code lives in
`src/games/hearts/` on the shared trick module `src/games/classic/`.

## Equipment and players

- Four players, each for themselves. A standard 52-card pack; in each suit the ace is high and
  the two low. There are no trumps.
- Seats are numbered 0 to 3 in the order of play, which is clockwise: the player after you sits on
  your left. On the screen you sit at the bottom, the next player (your left) on the left, the
  player across at the top and the player on your right on the right.
- Penalty cards: every heart is 1 point, the queen of spades is 13. With the Omnibus option the
  jack of diamonds is minus 10. Without it the pack holds 26 points.

## The deal and the pass

- Deal and play go clockwise. All 52 cards are dealt, 13 each. Seat 3 deals the first hand and the
  deal moves one seat to the left each hand.
- Before the play each player passes three cards face down. The direction follows the passing
  pattern (option). With the default pattern: first hand to the left, second to the right, third
  across, fourth no pass, then again.
- Every player chooses their three cards before any card is handed over, so nobody sees what they
  receive before choosing (in the app each choice is a separate move, hidden from the others,
  and the cards change hands only when all four have chosen).
- You always know the three cards you passed: until they are played, everyone else's view of the
  player who received them includes them (the app's coach and the CPU both use this).

## The play

- The first lead (option): by default the holder of the two of clubs leads it. With the old rule
  the player on the dealer's left leads any card (not a heart while hearts are not broken).
- Players must follow suit if they can; a player who cannot may play any card, except:
- **No points on the first trick** (option, on by default): a player who cannot follow suit to the
  first trick may not play a heart or the queen of spades, unless every card they hold is a
  penalty card.
- **Breaking hearts** (option, on by default): a heart may not be led until a heart has been
  played to an earlier trick, unless the leader holds nothing but hearts, or nothing but hearts
  and the queen of spades (many tables allow this rather than forcing the queen out; the app does).
  With the "queen breaks hearts" option, playing the queen of spades also breaks hearts.
- The highest card of the suit led wins the trick; its winner leads the next.

## Scoring a hand

- Each player scores the penalty points in the tricks they took.
- **Shooting the moon**: a player who takes every heart and the queen of spades. The option says
  what happens: the other three each score 26 (the default, "add"), the shooter scores minus 26
  ("subtract"), or the shooter's better choice ("shooter's choice": add 26 to the others, unless
  that would end the game without the shooter in first place, in which case subtract 26). The jack
  of diamonds is not needed to shoot; with Omnibus scoring the shooter who took it also gets its
  minus 10.
- Points in a hand always add up: 26 for the hearts and the queen (or 78 when the moon is shot and
  the others are charged), plus minus 10 for the jack of diamonds under Omnibus.

## The end of the game

- The game ends when, after a hand, someone has reached the target (option: 100 by default, 50,
  or a single hand). The lowest score wins; places go by score, low first.
- Ties (option): players with equal scores share a place (default), or with "play on" more hands
  are played while the lowest score is shared. A game never runs past 60 hands.

## Options

| Option | Values (default first) |
| --- | --- |
| Passing pattern | left, right, across, hold · left, right, across · left, right · always left · no passing |
| First lead | two of clubs leads · left of the dealer leads any card |
| Points on the first trick | not allowed · allowed |
| Breaking hearts | hearts must be broken · hearts may be led any time |
| The queen breaks hearts | no · yes |
| Shooting the moon | others score 26 · shooter scores minus 26 · shooter's choice |
| Jack of diamonds | no value · minus 10 (Omnibus) |
| Game to | 100 · 50 · one hand |
| Ties at the end | share the place · play on |

## Presets

| Preset | What it is |
| --- | --- |
| **Standard** (default) | The usual American game: pass left, right, across, hold; the two of clubs leads; no points on the first trick; hearts must be broken; the moon adds 26 to the others; to 100. |
| **Omnibus** | Standard with the jack of diamonds worth minus 10. |
| **Old style** | The rules Hearts started with: the dealer's left leads anything, hearts may be led any time, points allowed on the first trick, the moon subtracts 26 from the shooter. |
| **Quick game** | Standard to 50. |

## Ask before you sit

1. Which way do we pass, and is there a hold hand?
2. Who leads first: the two of clubs, or the dealer's left?
3. May points go on the first trick?
4. Must hearts be broken? Does the queen of spades break them?
5. Shooting the moon: do the others take 26, or do I subtract 26? Can I choose?
6. Does the jack of diamonds count minus 10?
7. Game to 100 or 50? What if the low score is tied?

## Notation

- Cards are rank then suit, as in the poker module: `As`, `Td`, `2c`, `Qs` (T is the ten).
- A play is the card (`Qs`); a pass is `pass:` and three cards in a fixed order (`pass:Qs,Ah,Kh`).
- Positions are the JSON state (the app's position text), which reads back exactly.

## Golden cases (tests/unit/hearts-rules.test.ts)

1. 13 cards each; the pack is conserved through passing and play.
2. Passing directions by hand number for every pattern; the hold hand skips straight to play.
3. Passed cards change hands only after all four have chosen; the receiver's view shows them.
4. The two of clubs must lead the first trick; with the old rule the dealer's left leads and may not lead a heart.
5. Following suit is forced; a void player may play anything.
6. No points on the first trick: a void player may not play a heart or the queen unless all their cards are penalty cards.
7. Hearts may not be led until broken; a hand of only hearts may lead one; a hand of hearts and the queen of spades may lead a heart; with "queen breaks hearts" the queen breaks them.
8. The highest card of the suit led wins; off-suit cards never win.
9. Scoring: hearts 1, queen 13, Omnibus jack minus 10; every hand totals 26 (or minus 10 more).
10. Shooting the moon under add, subtract and shooter's choice (including the case where adding would hand the game to someone else).
11. The game ends at the target; places by low score; shared places; "play on" while the low is tied.
12. Views never show another hand, another player's pass, or the seed.

## Not implemented, on purpose

- The kitty (12-card deals), three or five players, partnership Hearts.
- Scatter and mix passes, and letting players skip their pass.
- Spot Hearts, Black Maria scoring (ace and king of spades), Turbo Hearts, booster nines.
- "Shooting the sun" (all tricks) as a separate score, and a score of exactly 100 resetting to 50.
- A rule that the queen of spades must be played as soon as it is safe.

## Sources (read 2026-11-27)

- pagat.com, *Hearts* (John McLeod, from John Hay's notes): https://www.pagat.com/reverse/hearts.html
  — the American game, passing, breaking hearts, the first-trick rule, the moon's scoring choices,
  Omnibus, the old rules, ties.
