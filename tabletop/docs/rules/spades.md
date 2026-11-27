# Spades: the rules as implemented

Milestone 13 (classic card pack). Written before the code, from the sources at the end. Every
disputed rule is an option, presets are named sets of options. Code: `src/games/spades/` on the
shared trick module `src/games/classic/`.

## Players and cards

- Four players. By default in two fixed partnerships, partners opposite (seats 0 and 2 against
  1 and 3); with the cutthroat option each plays alone. You sit at the bottom, your partner at the
  top, play goes clockwise (to your left).
- A standard 52-card pack, ace high. Spades are always trumps.

## The deal and the bidding

- Seat 3 deals the first hand; the deal moves left each hand. All 52 cards are dealt, 13 each.
- Bidding starts on the dealer's left and goes once round the table. Each player bids the number
  of tricks they expect to win, 1 to 13, or **nil** (0: a promise to win no trick at all). With
  nil switched off the lowest bid is 1. Bids are made in turn and are seen by everyone.
- **Minimum team bid** (option, partnerships only): the two bids of a side must add up to at
  least four. The second partner to bid must bid enough; a nil from either partner means the other
  must bid at least four.
- **Blind nil** (option): a player may bid nil before looking at their cards, for double the score.
  By default it is off; it can be allowed only when the player's side is behind by at least 100,
  or at any time. A player who may bid blind does not see their hand until they choose: "blind
  nil" or "look at my cards" (then they bid as usual). The exchange of two cards with partner that
  some tables allow after a blind nil is not implemented.

## The play

- First lead (option): by default the dealer's left leads any card but a spade (a spade only with
  nothing else). Or the holder of the two of clubs leads it.
- Players follow suit if they can; otherwise they may play any card, a spade included.
- **Breaking spades** (option, on by default): spades may not be led until a spade has been played
  to an earlier trick, unless the leader has nothing but spades.
- The highest spade wins a trick with a spade in it, otherwise the highest card of the suit led.
  The winner leads the next trick.

## Scoring a hand

For each side (a partnership, or a single player in cutthroat):

- The contract is the sum of the side's bids other than nil.
- Tricks that count towards the contract are those won by the side's players who did not bid nil.
  The tricks a nil bidder wins (option): by default they do not count towards the partner's bid but
  do count as bags; or they count towards the bid.
- Made (counted tricks at least the contract): 10 points a trick bid, plus 1 for each overtrick
  (a **bag**). Set (fewer): minus 10 a trick bid.
- Nil: plus 100 if the nil bidder wins no trick, minus 100 if they win any (option: 50 instead of
  100). Blind nil: double, plus or minus 200 (or 100).
- **Bags** (option): by default every bag also adds to a running count, and each time a side
  reaches ten bags it loses 100 and the count drops by ten. Or bags carry no penalty (one point
  each), or each bag scores minus one with no penalty.

## The end of the game

- The game ends after a hand in which a side reaches the target (option: 500, 300, 1000, or one
  hand). If several sides reach it, the higher score wins; if the top scores are equal, another
  hand is played (at most 60 hands in all).
- **Losing score** (option): off by default; a side at minus 200 or minus 500 (or worse) loses at
  once, and the game ends.
- Places go by score, high first. Partners share their side's place.

## Options

| Option | Values (default first) |
| --- | --- |
| Players | two partnerships · cutthroat (each alone) |
| Nil | allowed, 100 · allowed, 50 · not allowed |
| Blind nil | not allowed · when behind by 100 · any time |
| A nil bidder's tricks | bags, not the bid · count towards the bid |
| Bags | ten bags cost 100 · no penalty · minus one each |
| Breaking spades | spades must be broken · spades may be led any time |
| First lead | dealer's left, no spade · two of clubs |
| Minimum team bid | none · four |
| Game to | 500 · 300 · 1000 · one hand |
| Losing score | none · minus 200 · minus 500 |

## Presets

| Preset | What it is |
| --- | --- |
| **Standard** (default) | Partnerships, nil 100, no blind nil, ten bags cost 100, spades must be broken, the dealer's left leads, to 500. |
| **With blind nil** | Standard, and a side behind by 100 or more may bid blind nil. |
| **Casual** | No nil, no bag penalty, to 300. |
| **Club** | Minimum team bid four, the two of clubs leads, a side at minus 200 loses, to 500. |
| **Cutthroat** | Four players each alone, nil 100, ten bags cost 100, to 300. |

## Ask before you sit

1. Partners, or each for themselves?
2. Is nil allowed? For 100 or 50? What about blind nil, and when?
3. Do a failed nil's tricks help the partner's bid?
4. Do bags cost 100 at ten, or nothing?
5. Must spades be broken? Who leads the first trick?
6. Must a side bid at least four?
7. Game to 500? Is there a losing score?

## Notation

- Cards as in Hearts (`As`, `Td`, `2c`). A bid is `bid:4`, nil `bid:0`, blind nil `blind`, looking
  at your cards before bidding `look`; a play is the card.

## Golden cases (tests/unit/spades-rules.test.ts)

1. Deal of 13 each; bidding order from the dealer's left; nil allowed or not; the minimum team bid.
2. Blind nil: offered only when allowed and behind enough; the hand is hidden until the choice.
3. The first lead: no spade from the dealer's left (unless all spades); the two of clubs variant.
4. Follow suit; trumping when void; spades may not be led until broken; all-spade hands may lead them.
5. The highest spade wins; otherwise the highest card of the suit led.
6. Scoring: made, set, overtricks, nil made and failed (both nil-tricks rules), blind nil, the ten-bag penalty with carry-over, no penalty, minus one.
7. The pagat example: 337, bid 5, take 7 → 389; take 8 → 290; take 9 → 291.
8. The end: target reached, the higher of two over the target, a tie at the top plays on, the losing score.
9. Cutthroat scoring per player. Views never show another hand or the seed.

## Not implemented, on purpose

- Jokers and big and little deuces, three, two or six players, passing cards to partner.
- Partnership (talked) bidding, second bidding rounds, the rule that bids may not total 13.
- Misdeals by request, ten-for-200, Moon or Boston bids, blind 6 or 7 for a side, no-trump bids,
  double nil, Bemo, the exchange of two cards after blind nil.
- Two sets in a row losing the game (New York rules) and the first hand played without bids.

## Sources (read 2026-11-27)

- pagat.com, *Spades* (John McLeod, with Theodore Hwa, Dennis J Barmore and others):
  https://www.pagat.com/auctionwhist/spades.html — partnership rules, nil and blind nil, bags and
  the ten-bag penalty with its worked example, the variations listed above.
