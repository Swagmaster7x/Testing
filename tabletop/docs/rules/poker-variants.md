# Omaha, Five-Card Draw and Seven-Card Stud, as implemented

Milestone 12. These run on the Hold'em engine (`src/games/holdem/rules.ts`) and keep everything in
`docs/rules/holdem.md` that is not said otherwise here: the formats (cash, heads-up, sit-and-go),
the blinds and their levels, all-ins for less, side pots, split pots and the odd chip, showdown
order and mucking. Play chips only. Golden cases: `tests/unit/poker-variants.test.ts`.

## Omaha

- Each player gets **four** hole cards. The board is dealt as in Hold'em: flop, turn, river.
- At the showdown a hand must use **exactly two** of its hole cards with **exactly three** board
  cards. Four hearts in your hand and one on the board is not a flush; a pair of aces and three
  aces on the board is not four of a kind.
- Usually played **pot-limit** (PLO): a raise may make the bet at most the size of the pot after
  calling. No-limit and fixed-limit are options.
- **Omaha high-low eight or better** (an option): the pot is split between the best high hand and
  the best qualifying low hand. A low hand is five different ranks of eight or lower, aces low,
  straights and flushes not counting against it; best low A-2-3-4-5. Each half uses exactly two hole
  cards and three board cards (not necessarily the same ones). If nobody qualifies for low, the high
  hand takes the whole pot. An odd chip between the halves goes to the high half.

## Five-Card Draw

- Each player gets **five** cards face down; no board. Blinds as in Hold'em (the classic ante game
  is described under "not implemented" below).
- A betting round; then **the draw**: from the first player still in left of the button, each
  player discards from none (standing pat) to three cards (an option: up to five) and is dealt as
  many new ones. Then a second betting round, begun by the first player still in left of the button,
  and the showdown.
- If the deck runs out during the draw, the cards already discarded are shuffled to make a new deck
  (the folded hands stay dead).
- Usually played **fixed-limit**: the bet before the draw is the small bet (one big blind), after the
  draw the big bet (two). No-limit and pot-limit are options.

## Seven-Card Stud

- No blinds and no board. Every player **antes**; each is dealt two cards face down and one face up
  (**third street**), then three more face up, one at a time (**fourth, fifth, sixth street**), and
  a last card face down (**seventh street**), with a betting round after each. A hand is the best
  five of a player's seven cards.
- **The bring-in**: on third street the player showing the **lowest** up card must bring it in
  (a forced bet smaller than the small bet), or may bet a full small bet instead (complete). Ties
  for lowest are broken by suit: clubs lowest, then diamonds, hearts, spades.
- From fourth street the player whose **up cards make the best poker hand** (pairs, trips, two pair,
  four of a kind; straights and flushes do not count) acts first; ties by the suit of the highest
  card.
- **Fixed-limit**: small bets on third and fourth street, big bets from fifth street on. On fourth
  street, if any player shows a pair, a player may bet or raise the big bet. A bet and at most three
  raises per round (no cap heads-up). After a big bet, raises are big.
- Forced bets from the blinds of the format: the small bet is a big blind, the big bet two; the
  ante a quarter of a big blind and the bring-in half of one (each at least one chip).
- **Stud high-low eight or better** (an option), as in Omaha high-low but with any five of the seven
  cards for each half.

## Options

| Option | Values | Default |
| --- | --- | --- |
| `game` | `holdem`, `omaha`, `draw`, `stud` | `holdem` |
| `betting` | `no-limit`, `pot-limit`, `fixed-limit` | no-limit (Hold'em), pot-limit (Omaha), fixed-limit (Draw, Stud) |
| `split` | `high`, `high-low` (eight or better; Omaha and Stud) | `high` |
| `maxDraw` (Draw) | 3, 5 | 3 |

## Presets

| Preset | What it sets |
| --- | --- |
| **Pot-limit Omaha** | 6-max cash, Omaha, pot-limit. |
| **Omaha high-low** | 6-max cash, Omaha, fixed-limit, high-low eight or better. |
| **Five-card draw** | 6-max cash, draw, fixed-limit, up to three cards. |
| **Seven-card stud** | 6-max cash, stud, fixed-limit. |

## Ask before you sit

1. Which game, and what limit: no-limit, pot-limit or fixed-limit? What are the small and big bets?
2. Omaha and Stud: high only, or high-low eight or better?
3. Draw: how many cards may you draw? Is there an ante, blinds, or both? Are openers needed?
4. Stud: who brings it in, and for how much? When may the big bet be used on fourth street?
5. How many raises are allowed in a round, and does the cap lift heads-up?

## Golden cases (tested)

- Omaha: exactly two hole cards and three board cards, for flushes, straights, quads and full
  houses; the pot-limit maximum before and after the flop; a high-low split, a scoop, no qualifying
  low, and quartering.
- Draw: dealing five, the draw (standing pat, one to three cards, the option of five), the deck
  running out, the betting rounds and their sizes.
- Stud: the bring-in by the lowest card and its suit, completing, the order of play from the best
  hand showing, the open-pair big bet on fourth street, small and big bets, the cap of three raises
  and no cap heads-up, the best five of seven.

## Not implemented, on purpose

- Draw played with antes only and Jacks or Better openers, two draws, the bug and wild cards; Razz,
  Five-Card Stud, Five- and Six-Card Omaha, Courchevel; declaring high-low. Each is a further
  option on this engine.
- Stud with eight players (the shared seventh card): tables here seat at most six.

## Sources

- Omaha Poker, pagat.com (www.pagat.com/poker/variants/omaha.html), read 2026-11-27: four hole
  cards, exactly two with exactly three board cards, pot-limit, Omaha high-low eight or better.
- Five Card Draw, pagat.com (www.pagat.com/poker/variants/5draw.html), read 2026-11-27: the deal,
  the draw of up to three cards and its variations, running out of cards, blinds, Jacks or Better.
- Seven Card Stud, pagat.com (www.pagat.com/poker/variants/7stud.html), read 2026-11-27: the deal
  by streets, the bring-in by the lowest card, the order of betting, small and big bets, the
  open-pair rule, the cap of three raises, high-low.
