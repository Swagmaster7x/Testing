# Chinese Checkers

Rules as implemented in `src/games/chinese-checkers/rules.ts` (with `board.ts` for the star and its
holes, and `engine.ts` for the move generator that the rules, the CPU and the lesson checks share,
so they can never disagree). The game is the German *Sternhalma* (star halma), sold in the United
States from 1928 as "Hop Ching Checkers" and then "Chinese Checkers"; it has nothing to do with
China or with draughts. Tables disagree on several rules, so each disputed rule is an option and
the common sets of rules are named presets. The default is **two players, standard rules**.

Rules version: 1.

## Rules as implemented

1. **Board.** A six-pointed star of 121 holes: a hexagon of 61 holes in the middle and six
   triangular points of 10 holes each. Each point is a player's *start*; the point opposite is that
   player's *home* (the goal).
2. **Players and corners.** Two, three, four or six players. Seats are coloured by their place in
   the turn order: Red, Blue, Green, Yellow, Purple, White. Red always starts in the bottom point.
   Play passes clockwise.
   - Two players: opposite points (Red bottom, Blue top). Each home is the other's start.
   - Three players: every other point (bottom, upper left, upper right). Every home is an empty
     point, so nobody starts in anyone's way.
   - Four players: two pairs of opposite points (bottom, lower left, top, upper right); the other
     two points stay empty.
   - Six players: every point.
3. **Marbles.** Ten each, filling the player's point. *Option, two players only:* fifteen each,
   filling the point and the five holes of the hexagon's edge in front of it; home is then the
   fifteen holes opposite.
4. **A move** is one of:
   - a **step**: one marble to an adjacent empty hole, in any of the six directions; or
   - a **hop chain**: one marble jumps over a single adjacent marble (anyone's, your own included)
     to the empty hole directly beyond it on the same line, and may go on jumping from where it
     lands, changing direction as it likes, for as many hops as it wants. It may stop after any hop.
   A move is one or the other: never a step followed by hops. There are **no captures**: marbles
   that are jumped over stay where they are. Hopping is never compulsory. A move must end somewhere
   other than where it began. Only where a move starts and ends matters; when several chains reach
   the same hole they are the same move (the app shows the shortest chain).
5. **Long jumps** (*option*, the fast-paced game, also called Super Chinese Checkers, popular in
   France). A hop may jump over a marble that is not adjacent, provided the holes between are empty,
   and lands as far beyond it as it started before it, with the holes between also empty: from two
   empty holes before the marble to two empty holes after it. A hop never jumps over two marbles.
   Steps and chains work as before.
6. **Other points** (*option*, which tables disagree on). The four points that are neither a
   marble's start nor its home are *other points* for that marble:
   - *anywhere* (default): a marble may stop in any hole;
   - *pass through*: a marble may land in another point during a hop chain but may not end its move
     there;
   - *never*: a marble may not land in another point at all, not even during a chain.
   With fewer than six players some points are empty; the rule is the same.
7. **Marbles at home** (*option*):
   - *stay* (default, the traditional rule): a marble that starts its move in its home must end the
     move in its home; it may move about inside it (and may hop out and back in during a chain);
   - *free*: marbles may leave home again;
   - *frozen*: a marble in its home may not move at all. Fill the home from the tip: a marble that
     stops at the entrance can shut a deeper hole for good, and then only the turn limit ends the
     game for you.
8. **Finishing.** A player finishes when their home is complete:
   - *filled* (default; the rule that makes blocking useless): every hole of the home is occupied and
     at least one of the marbles there is the player's own. Marbles that another player left in your
     home count as filling it, so nobody can stop you finishing by parking in your home.
   - *all your own*: every hole of the home holds one of your own marbles (the strict rule, under
     which a parked marble can stop you finishing; the turn limit then ends the game).
   A player who has finished takes no more turns; their marbles stay where they are and still count
   as marbles to jump over.
9. **Places** (*option*):
   - *play on* (default): when a player finishes, the others play on for the next places, until one
     player is left, who takes last place. With two players the game ends when the first finishes.
   - *first home wins*: the game ends when the first player finishes; the others are placed by how
     far they still have to go (rule 12).
10. **Passing.** A player with no legal move passes; that is the only time passing is allowed. If
    every player still in the game passes in a row, nobody can move and the game ends; places are
    decided by how far each player still has to go (rule 12).
11. **Turn limit** (an app rule, so a game always ends). The game ends once every player still in it
    has had a set number of turns: 100, 150, 200 (default) or 300 each. Players who have not
    finished are then placed by how far they still have to go (rule 12). Real tables rarely need
    it; it stops a game from going round for ever when someone keeps a marble back on purpose.
12. **How far to go** ("rows to go"). Count rows from a player's start towards their home: the tip
    of the start is row 1 and the tip of the home is row 17. Each marble still has *17 minus its
    row* rows to climb; add these up for all a player's marbles and take off what a full home
    still counts (20 with ten marbles: four marbles a row from the tip, three two rows from it and
    so on; 40 with fifteen). A player with every marble home has 0 to go; at the start a player has
    120 (ten marbles). Fewer rows to go places higher; equal counts share the place. Places already
    won by finishing come first.
13. **Who goes first.** Red (seat 0) moves first; in the New game dialog you choose your colour or
    let the app choose. At a real table the first player is often chosen by lot.

## Options

| Option | Values | Default |
| --- | --- | --- |
| Players | 2, 3, 4, 6 | 2 |
| Marbles each | 10, 15 (two players only) | 10 |
| Hops | over a neighbour; long jumps | over a neighbour |
| Other points | stop anywhere; pass through only; never | stop anywhere |
| Marbles at home | stay at home; may leave; may not move | stay at home |
| Home counts as complete | filled, one of them yours; all your own | filled, one of them yours |
| Places | play on; first home wins | play on |
| Turn limit | 100, 150, 200, 300 turns each | 200 |

## Presets

| Preset | What it is |
| --- | --- |
| **Two players** (default) | Standard rules, two players in opposite points |
| Three players | Standard rules, every other point |
| Four players | Standard rules, two pairs of opposite points |
| Six players | Standard rules, every point |
| Fifteen marbles | Two players with fifteen marbles each, as some two-player sets are played |
| Fast-paced | Long jumps (Super Chinese Checkers), two players, marbles may land in other points during a chain but not stop there, as the French game is usually described |
| Closed points | Two players; marbles may hop through other points but not stop there, and may leave home again, as several online versions play |

## Ask before you sit

1. How many marbles each, and which points do we use?
2. May a marble stop in a point that is nobody's home, or only hop through it?
3. Once a marble is home, may it leave again?
4. If someone leaves marbles in my home, when does my home count as complete?
5. When the first player is home, do the rest play on for second place?
6. Long jumps, or only over a neighbour?
7. Who goes first, and which way does play pass?

## Notation

- **Holes.** Rows are numbered 1 to 17 from the bottom tip (Red's start) to the top tip; holes in a
  row are lettered from the left, starting at a. Row lengths from the bottom: 1, 2, 3, 4, 13, 12,
  11, 10, 9, 10, 11, 12, 13, 4, 3, 2, 1. So the bottom tip is 1a, Red's front row is 4a to 4d, the
  middle row is 9a to 9i and the top tip is 17a. The names belong to the board, not to whoever is
  looking at it; when the table turns the board for another player the names go with the holes.
- **Moves.** A move is written from–to: `4b-5f` for a step, `3a-7e` for a hop chain. A chain may
  also be written with every hole it lands on (`3a-5e-7e`), which reads back as the same move.
  `pass` is a pass. Stored records use two letters a hole (its axial coordinates)
  and four letters a move (`fnfm` for 4b-5f), which never change.
- **Positions.** The 17 rows from the top tip down, separated by `/`, one character a hole from the
  left: `.` empty, or the seat's letter (`R` Red, `B` Blue, `G` Green, `Y` Yellow, `P` Purple,
  `W` White). Then the side to move in small letters (`-` when the game is over), then fields that
  are written only when they differ from the default: `n=` players, `m=15`, `rules=` changed
  options (`jumps:long`, `stop:pass-through`, `home:free`, `finish:own`, `end:first`,
  `limit:150`), `round=` the round number, `pass=` passes in a row, `done=` the finishing order so
  far (seat letters), `end=` how the game ended (`home`, `first`, `limit`, `blocked`).

## Golden cases (`tests/unit/chinese-checkers-rules.test.ts`)

1. The board has 121 holes, every hole has between two and six neighbours, and the six points have
   ten holes each.
2. Setups: two, three, four and six players fill the right points; fifteen marbles add the hexagon
   edge row; three players start with every home empty.
3. Red's first moves at the start of a two-player game: the steps and hops from the front row.
4. A step to each empty neighbour; no step onto a marble.
5. A hop over one's own marble and over another player's marble; no hop over an empty hole, over
   two marbles in a row, or onto a marble.
6. A chain of three hops that changes direction; it may stop after the first or second hop; the
   jumped marbles are still on the board.
7. A move never ends where it began, even when a chain comes back round to it.
8. Long jumps: over a marble two holes away to two holes beyond; not when a hole between is taken;
   not over two marbles.
9. Other points: under *pass through* a chain may cross another point but not end in it; under
   *never* it may not land there at all; under *anywhere* it may stop there.
10. Marbles at home: under *stay* a home marble moves only within home; under *frozen* it cannot
    move; under *free* it may leave.
11. Finishing: a home filled by nine of your marbles and one of another player's is complete under
    *filled* and not under *all your own*; a home full of other players' marbles only is never
    complete for you.
12. Places: in a three-player game the first to finish is first, play goes on, the second to finish
    is second and the last player is third; under *first home wins* the game stops at the first
    finisher and the rest are placed by rows to go.
13. Passing: a player with no move must pass; when every player still in passes in a row, the game
    ends and rows to go decide.
14. The turn limit ends the game after the last player's turn of the last round, and rows to go
    decide the places, sharing a place on equal counts.
15. Notation: positions, moves and configs read back to the same text; bad text is refused with a
    reason.

Property tests over random games under every preset (`tests/property/chinese-checkers.property.test.ts`):
nothing crashes; every legal move applies; every seat keeps exactly its ten (or fifteen) marbles on
121 holes; records replay to the identical position; and every game ends (no deadlock), both with a
player who prefers moves forward and with uniformly random moves, which end at the turn limit.

## Not implemented, on purpose

- **Partners, and one person playing two or three colours.** Some tables play six as three teams of
  two, or a two-player game with two or three sets each. The New game dialog seats one person or one
  CPU per colour; teams can come later as an option (the contract already knows about sides).
- **Five players.** Possible on the board but unfair (one player has an empty home and no one in
  the way), and no source treats it as standard.
- **Forcing the first hop of a chain to go forwards**, a rule of some German *Halma* (square board)
  instructions. No Chinese Checkers source asks for it.
- **A last turn for the players who moved later in the round** once someone finishes (a fairness
  rule from other race games). No source gives it for Chinese Checkers; the second player in a
  two-player game simply has to be quicker.
- **Rules against keeping marbles in your start "on purpose".** Some house rules forbid it in
  words, which cannot be checked by a program; the *filled* rule makes it pointless instead.
- **Capturing variants** (marbles taken when jumped) and **Diamond Game** (the smaller Japanese and
  Korean board for two or three): different games.

## Sources

Read on 2026-11-27. The build environment could not open these hosts directly (Wikipedia and pagat
were refused by its network policy, and pagat has no Chinese Checkers page), so they were read
through a web search service's extracts; the details above were taken only where two or more
sources agreed or where one reputable source was explicit.

- Wikipedia, "Chinese checkers": https://en.wikipedia.org/wiki/Chinese_checkers (board, 121 holes,
  two, three, four or six players, ten pieces or fifteen in two-player games, steps and hop chains,
  no captures, play clockwise, hopping not compulsory, the fast-paced or Super Chinese Checkers
  variant with symmetrical long jumps and entering an empty point during a chain, the rest playing
  on for places)
- N. R. Sturtevant, "An Efficient Chinese Checkers Implementation" (2022):
  https://webdocs.cs.ualberta.ca/~nathanst/papers/sturtevant2022ccbitboard.pdf (the standard win
  condition, the observation that one piece left in the start can block the opponent, and the win
  condition that only requires at least one of your own pieces in a filled goal, which this app
  uses as *filled*)
- N. R. Sturtevant, "On Strongly Solving Chinese Checkers" (2019):
  https://webdocs.cs.ualberta.ca/~nathanst/papers/sturtevant2019chinesecheckers.pdf
- German Wikipedia, "Sternhalma": https://de.wikipedia.org/wiki/Sternhalma, and ludomax.de,
  "Halma Regeln": https://ludomax.de/spielregeln/halma/ (marbles in the goal may not be taken out but
  may move inside it; chains may stop at any hop and change direction)
- Coolmath Games, Chinese Checkers: https://www.coolmathgames.com/0-chinesecheckers, and
  groupgames101.com, "Chinese Checkers: Rules and How to Play":
  https://groupgames101.com/chinese-checkers-rules/ (you may hop through a point that is not yours
  or your goal but not end your turn there; the second also says a marble that reaches its goal may
  not move again, the *frozen* option)
- Poet Software, Chinese checkers: https://www.poetsoftware.no/chch_tommy.html (marbles may pass
  through other points but not land or rest there, the *never* option, and may leave the goal again)
- officialgamerules.org, "How to Play Chinese Checkers":
  https://officialgamerules.org/game-rules/chinese-checkers/ and gamerules.com, "Chinese Checkers
  Rules": https://gamerules.com/rules/chinese-checkers-rules/ (setups for each number of players;
  marbles in the goal may move only within it; disagreement on parking marbles in one's start)
- Arxiv 2405.18733, "Efficient Learning in Chinese Checkers": https://arxiv.org/pdf/2405.18733 (no
  official rule prevents spoiling; rules against it vary)
