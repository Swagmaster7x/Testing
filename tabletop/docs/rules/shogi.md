# Shogi: rules as implemented

Milestone 8. This is the rulebook the code follows (`src/games/shogi/rules.ts` and the position
core in `src/games/shogi/core.ts`); every rule below has a golden case in
`tests/unit/shogi-rules.test.ts`. Where tables disagree, the rule is an option and the named presets
at the end choose a set of options. The prose is original; the sources are listed at the end.

## 1. The equipment

**Board.** Standard shogi is played on a 9×9 board, mini-shogi (*gogo shōgi*, 5五将棋) on 5×5.
Squares are not coloured.

**Coordinates.** Files are numbered from the right as Black (sente) sees the board: file 1 is on
Black's right, file 9 (file 5 in mini-shogi) on Black's left. Ranks are numbered from the top, the
side where White (gote) sits: rank 1 is White's back rank. A square is named file then rank, so 76
is file 7, rank 6 (written 7六 in Japanese and 7f in USI, the engine protocol, where ranks are the
letters a to i). The app names every square this way: "76, Black pawn".

**Players.** The first player is *sente* (先手), called Black in English books; the second is
*gote* (後手), called White. The pieces are all the same colour: ownership is shown by the way a
piece points (towards the opponent). In a handicap game the stronger player, *uwate* (上手), gives
the handicap, sits as White and moves first; the weaker player is *shitate* (下手).

**Pieces.** Each side has twenty in standard shogi and six in mini-shogi.

| Piece | Japanese | Reading | Each side (9×9 / 5×5) | Moves | Promotes to |
| --- | --- | --- | --- | --- | --- |
| King | 玉将 / 王将 | gyokushō / ōshō | 1 / 1 | One step in any of the eight directions | (does not promote) |
| Rook | 飛車 | hisha | 1 / 1 | Any distance along a rank or file | Dragon 龍王 *ryūō* (龍 *ryū*): rook plus one step diagonally |
| Bishop | 角行 | kakugyō (角 *kaku*) | 1 / 1 | Any distance diagonally | Horse 龍馬 *ryūma* (馬 *uma*): bishop plus one step orthogonally |
| Gold general | 金将 | kinshō (金 *kin*) | 2 / 1 | One step orthogonally, or diagonally forward (six directions) | (does not promote) |
| Silver general | 銀将 | ginshō (銀 *gin*) | 2 / 1 | One step diagonally, or straight forward (five directions) | Promoted silver 成銀 *narigin*: moves as a gold |
| Knight | 桂馬 | keima (桂 *kei*) | 2 / 0 | Jumps to one of the two squares two ranks forward and one file across | Promoted knight 成桂 *narikei*: moves as a gold |
| Lance | 香車 | kyōsha (香 *kyō*) | 2 / 0 | Any distance straight forward | Promoted lance 成香 *narikyō*: moves as a gold |
| Pawn | 歩兵 | fuhyō (歩 *fu*) | 9 / 1 | One step straight forward; it captures the same way | *Tokin* と金 (と): moves as a gold |

Every piece except the knight is blocked by pieces in its way; the knight jumps. Pieces capture by
moving onto an enemy piece the way they move. Traditionally the king of the player who moves first
(or the stronger player) is 王, the other 玉; the app draws 玉 for Black and 王 for White.

## 2. Setting up

**Standard** (SFEN `lnsgkgsnl/1r5b1/ppppppppp/9/9/9/PPPPPPPPP/1B5R1/LNSGKGSNL b - 1`): Black's
back rank from file 9 to file 1 is lance, knight, silver, gold, king, gold, silver, knight, lance;
Black's bishop on 88 and rook on 28; nine pawns on rank 7. White is the mirror image (rook on 82,
bishop on 22, pawns on rank 3). Black moves first.

**Mini-shogi** (SFEN `rbsgk/4p/5/P4/KGSBR b - 1`): Black's back rank from file 5 to file 1 is
king, gold, silver, bishop, rook; the pawn stands in front of the king on 54. White mirrors it (king
on 11, pawn on 12). Black moves first.

**Handicaps** (*komaochi*, 駒落ち): the stronger player removes pieces before the game; removed
pieces are out of the game, never in hand. The handicap giver plays White and **moves first**.
White's "left" pieces are on the right of the board as Black sees it (the left lance stands on 11).

| Preset | Japanese | White removes | Nominal worth |
| --- | --- | --- | --- |
| Lance | 香落ち *kyō ochi* | left lance (11) | 2 ranks |
| Bishop | 角落ち *kaku ochi* | bishop | 3 ranks |
| Rook | 飛車落ち *hisha ochi* | rook | 4 ranks |
| Rook and lance | 飛香落ち *hikyō ochi* | rook, left lance | 5 ranks |
| Two pieces | 二枚落ち *nimai ochi* | rook, bishop | 6–7 ranks |
| Four pieces | 四枚落ち *yonmai ochi* | rook, bishop, both lances | 8–9 ranks |
| Six pieces | 六枚落ち *rokumai ochi* | rook, bishop, both lances, both knights | 10+ ranks |
| Eight pieces | 八枚落ち *hachimai ochi* | as six, and both silvers | teaching |
| Ten pieces | 十枚落ち *jūmai ochi* | as eight, and both golds | teaching |

The "worth" column is the rank difference the Japan Shogi Association's table gives for each
handicap (one amateur rank is about 100 rating points in the app; see section 9). Mini-shogi offers
the rook, bishop and two-piece handicaps, again with White giving and moving first.

## 3. Moving and promoting

A turn is one move: move a piece on the board, or drop a piece from hand (section 4).

**Promotion zone.** The farthest three ranks from a player (ranks 1–3 for Black, 7–9 for White);
in mini-shogi only the farthest rank (rank 1 for Black, rank 5 for White).

**Promotion.** A rook, bishop, silver, knight, lance or pawn may promote when it moves **into, within
or out of** its zone: any move that starts or ends in the zone. Promotion is optional, with one
exception: a piece must promote if it would otherwise have no legal move ever again (a pawn or lance
on the last rank, a knight on either of the last two ranks). Golds and kings never promote.
Promoted pieces stay promoted while on the board. A dropped piece is unpromoted even inside the
zone; it may promote on a later move that starts there.

## 4. Captures and drops

A captured piece goes to the captor's **hand** (*mochigoma*, 持ち駒), turned back to its unpromoted
side. Instead of moving, a player may **drop** one piece from hand onto any empty square, unpromoted
and facing the opponent, except:

1. **Two pawns** (*nifu*, 二歩): a pawn may not be dropped on a file that already holds an
   unpromoted pawn of the same player. Tokins do not count.
2. **Dead pieces** (*ikidokoro no nai koma*, 行き所のない駒): a pawn or lance may not be dropped on
   the last rank, nor a knight on the last two ranks, since it could never move.
3. **Pawn-drop mate** (*uchifuzume*, 打ち歩詰め): a pawn may not be dropped to give immediate
   checkmate. Dropping a pawn to give check is allowed when the king can escape, capture it or have
   it captured; mating with a pawn moved on the board, or by dropping any other piece, is allowed.

The same "dead piece" rule applies to moves on the board: a pawn or lance reaching the last rank,
or a knight reaching the last two ranks, must promote (the app promotes it and says so).

## 5. Check, mate and the end of the game

A move may never leave the mover's own king attacked (moving into check, or ignoring a check).
**Checkmate** (*tsumi*, 詰み) wins. A player with no legal move loses even when not in check
(the app records this as "no legal move"); there is no stalemate draw. Announcing check (*ōte*,
王手) is not required.

Games also end by:

- **Resignation** (*makemashita*, 負けました: "I have lost"). The shell offers it at any time.
- **Repetition** (*sennichite*, 千日手). When the same position (the same pieces on the same squares,
  the same pieces in hand and the same player to move) occurs for the **fourth** time, the game ends.
  In standard shogi it is a **draw**. In mini-shogi it is a **loss for the player who made the
  first move of the game** (the rule of the game's creator, as published). In both, if one player
  gave check with **every** one of their moves since the first time the position appeared
  (**perpetual check**, 連続王手の千日手), that player **loses** instead.
- **Impasse** (*jishōgi*, 持将棋): see section 6.
- **Move limit** (option): the game is drawn when it reaches the limit without another result.
- **Time**: running out of time loses (optional clock).

## 6. Impasse (*jishōgi*)

When both kings have entered their promotion zones (*ainyūgyoku*, 相入玉), mating either one is
often impossible. Tables settle this in different ways, so it is an option. Points: each rook or
bishop, promoted or not, is worth **5**, every other piece except the king **1**. Each side starts
with 27 points. In a handicap game the pieces White removed count towards White's total.

- **None.** Play on; repetition, the move limit or resignation will end it.
- **24-point rule** (the professional rule, by agreement): once both kings are inside their
  promotion zones, the player to move may call for the count, in place of a move. Both sides count
  every piece they own on the board and in hand. A player with fewer than **24** points loses; if
  both have 24 or more, the game is drawn.
- **27-point declaration** (*nyūgyoku sengen*, 入玉宣言; 81Dojo's and many amateur events' rule;
  the default here): the player to move may declare a win, in place of a move, when all hold:
  (a) their king is inside the enemy camp (their promotion zone); (b) at least **10** of their other
  pieces are inside it; (c) their king is not in check; (d) counting only their pieces inside the
  enemy camp and their pieces in hand, they have **28** points as Black or **27** as White. At a
  real table a wrong declaration loses; the app only offers the declaration when it is valid.
- **Try rule** (*torairūru*): once both kings have entered, a player whose king moves onto the
  enemy king's starting square (51 for Black, 59 for White) wins at once. It was used by the Shogi
  Wars app until 2014.

Mini-shogi has no impasse rule: its zone is a single rank.

## 7. Refused moves and the reasons the app gives

At a real table an illegal move loses the game at once (JSA rules, section 8 of the sources). The
app refuses it and says why:

| Code | When | What the app says (catalogue key `shogi.illegal.*`) |
| --- | --- | --- |
| `nifu` | A pawn dropped on a file holding your unpromoted pawn | Two pawns on one file (nifu) |
| `pawn-drop-mate` | A pawn drop that would checkmate | Pawn-drop mate (uchifuzume) |
| `dead-drop` | A pawn or lance dropped on the last rank, a knight on the last two | That piece could never move again |
| `self-check` | The move leaves your king attacked | That leaves your king in check |
| `occupied` | A drop on an occupied square | Drops go on empty squares |
| `cannot-reach` | The piece does not move that way, or is blocked | How the piece moves |
| `own-piece` | Capturing your own piece | Your own piece is there |

A move that must promote is promoted without asking; a move that may promote asks.

## 8. Options and presets

| Option | Values | Default |
| --- | --- | --- |
| `board` | `standard` (9×9), `mini` (5×5) | `standard` |
| `handicap` | `even`, `lance`, `bishop`, `rook`, `rook-lance`, `two`, `four`, `six`, `eight`, `ten` (mini: `even`, `bishop`, `rook`, `two`) | `even` |
| `impasse` | `none`, `points-24`, `declare-27`, `try` (standard board only) | `declare-27` |
| `moveLimit` | `0` (none) or a number of moves, such as 256 or 320 | `0` |
| `position` | any legal SFEN (lessons, problems, "play on from here"); overrides `board` and `handicap` | none |

Repetition is not an option: four times, draw (standard) or loss for the first player (mini),
with perpetual check losing in both.

| Preset | Options |
| --- | --- |
| **Standard** (default) | standard board, even, 27-point declaration, no move limit |
| **Professional** | standard board, even, 24-point rule |
| **Casual** | standard board, even, no impasse rule |
| **Handicap: …** (one per row of the table in section 2) | standard board, that handicap, 27-point declaration |
| **Mini-shogi** | 5×5, even |
| **Mini-shogi, handicap: …** | 5×5, bishop, rook or two pieces |

The ladders and the problem generator use a 320-move limit (the computer-shogi convention) so that
games between programs always end.

## 9. Ratings and the handicap ladder

CPU levels have nominal ratings (`src/games/shogi/levels.ts`). A handicap is worth about 100 rating
points per amateur rank in the table of section 2, so "level 7 giving a rook" plays like a level about
400 points weaker, but with no planned mistakes: the honest way down the ladder. Only games under the
Standard preset move your play rating; the other presets, handicaps and mini-shogi are practice.

Measured between two of the app's levels (`scripts/shogi-handicaps.ts`: level 6 giving each
handicap to level 4, 8 games each), the giver scored 0.875 in even games, 1.000 giving a lance,
0.875 a bishop, 0.625 a rook and 0.500 two pieces. A handicap counts for less between two engines
than between people (the weaker engine converts extra material poorly), so the offsets keep the
JSA's table, which was made for people.

## 10. Notation and files

- **Western notation** (the move list): piece letter (K, R, B, G, S, N, L, P; a promoted piece has a
  `+` in front, such as +R for a dragon), then `-` for a move, `x` for a capture or `*` for a drop,
  then the square; a trailing `+` promotes and `=` declines a promotion that was possible. The origin
  square is added only when two pieces of the same kind could reach the square: `G61-52`. Check is
  not marked. Examples: `P-76`, `Bx22+`, `S*52`.
- **Japanese notation** (taught in the Table-ready track): ▲ for sente and △ for gote, the square in
  full-width digit and kanji numeral, the piece, then 成 (promotes), 不成 (does not), 打 (drop, when
  needed) and position words (右, 左, 上, 引, 寄, 直) when two pieces could go there; 同 means "on
  the same square as the last move". Example: ▲7六歩 △3四歩 ▲2二角成 △同銀.
- **USI and SFEN** (engines and positions): moves as `7g7f`, `8h2b+`, `P*5e`; positions as SFEN.
  The app stores moves as `7776`, `8822+` and `P*55` (USI with digit ranks, matching the square names).
- **Files**: a game saves as **KIF** (UTF-8, `.kifu`; mini-shogi games use the same move format with
  a 5五将棋 header), as **CSA** (`.csa`, standard board only) and as **SFEN** (`.sfen`: the USI line
  `position sfen <start> moves 7g7f ...`, either board). The Review door opens KIF, KI2, CSA, JKF and
  USI/SFEN files of standard games (through `tsshogi`), the app's own mini-shogi KIF and USI files,
  and a bare SFEN as a position to start from. KIF files saved in Shift-JIS (`.kif` from older
  programs) must be saved as UTF-8 first.

## 11. Golden cases (each one is a test)

1. The start position has 30 legal moves; mini-shogi has 14.
2. Perft from the start: 30, 900, 25,470, 719,731 (four plies); mini-shogi 14, 181, 2,512, 35,401,
   533,203 (five plies). The "matsuri" position has 207 moves and the record position 593.
3. Nifu: a pawn drop on a file with your unpromoted pawn is refused with `nifu`; with only a tokin on
   that file it is allowed.
4. Pawn-drop mate is refused with `pawn-drop-mate`; the same pawn drop is allowed when the king can
   escape; a pawn **moved** to give mate is allowed; a gold dropped on the same square to mate is
   allowed.
5. Dead pieces: a pawn on the second rank moving to the last rank only has the promoting move; a
   knight moving to the second-last rank must promote; pawn, lance and knight drops on dead ranks are
   refused with `dead-drop`.
6. Optional promotion: a silver moving out of the zone may promote or not (two legal moves); a
   piece dropped in the zone is unpromoted and may promote when it moves.
7. Captured promoted pieces go to hand unpromoted.
8. Moving into check and ignoring a check are refused with `self-check`; pinned pieces cannot move
   off the line.
9. Repetition: the fourth occurrence draws (standard) and loses for the first player (mini-shogi);
   the third does not end the game.
10. Perpetual check: the side checking with every move since the first occurrence loses.
11. Impasse: the 24-point count (win, loss, draw, with handicap pieces counted for White); the
    27-point declaration (offered only when valid: 28 for Black, 27 for White, ten pieces, king in
    the camp, not in check); the try rule.
12. A player with no legal move loses; checkmate is detected; the move limit draws.
13. Handicap presets remove the right pieces and White moves first.
14. SFEN, the move codec, Western notation, KIF, CSA and USI read back what they write.

## 12. Sources

- Wikipedia, "Shogi" (rules, illegal moves per the JSA's 2024 game regulations, repetition,
  impasse and its 24-point, 27-point declaration and try-rule resolutions, with 81Dojo's
  declaration conditions): https://en.wikipedia.org/wiki/Shogi (read 2026-11-27).
- Wikipedia, "Handicap (shogi)" (official and teaching handicaps, uwate moves first, removed pieces
  counting for White in an impasse, the JSA rank-difference table):
  https://en.wikipedia.org/wiki/Handicap_(shogi) (read 2026-11-27).
- Wikipedia, "Minishogi" (setup, one-rank zone, repetition losing for the first player, perpetual
  check): https://en.wikipedia.org/wiki/Minishogi (read 2026-11-27).
- Japan Shogi Association, rules FAQ, cited by the articles above: https://www.shogi.or.jp/faq/rules/
- Perft counts: the Fairy-Stockfish test suite (`tests/perft.sh`: shogi start 4 plies 719,731;
  minishogi start 5 plies 533,203), the widely published standard counts (30, 900, 25,470,
  719,731), and the "matsuri" (207) and maximum-moves (593) positions used by shogi engine authors.
- `tsshogi` 2.3.4 (MIT): a second implementation used to cross-check legality move by move on random
  positions, the impasse point counts, and to read and write KIF, KI2 and CSA.
