## M8. Shogi

Built in its own worktree alongside M3 to M5 (main branch) and M6 (another worktree). This is
the section for PROGRESS.md; the version is not bumped and no APK was built for it.

- [x] **Rules first**: `docs/rules/shogi.md`: the equipment with Japanese names and readings, the
      setups (standard, mini-shogi, nine handicaps), moving and promotion, drops and their three
      restrictions, check and mate (no stalemate: no legal move loses), repetition with the
      perpetual-check exception, four impasse rules, the refusal reasons, options and presets,
      notation and files, the golden cases, and sources.
- [x] **Position core** (`src/games/shogi/core.ts`), shared by the rules and the engine so they can
      never disagree: a mailbox board for 9×9 and 5×5, hands, move generation with forced and
      optional promotion, legality (king safety by make and test, pawn-drop mate by looking for an
      answer), attacks, Zobrist hashing and SFEN.
- [x] **Rules behind the contract** (`src/games/shogi/rules.ts`): pure `apply` returning events;
      sennichite on the fourth occurrence (a draw, or a loss for the first player in mini-shogi);
      perpetual check losing for the checker; impasse by the 24-point count, the 27-point
      declaration or the try rule (as an action the player to move may take only when it is valid),
      or none; an optional move limit; handicaps with White moving first and the removed pieces
      counting for White in an impasse. JSON, SFEN and move codecs (canonical `7776`, USI and
      Western notation `P-76`, `Bx22+`, `S*52`, `G61-52`, `S-34=`); every refused move explained
      (`explainIllegal`: nifu, pawn-drop mate, dead piece, self-check, occupied, cannot reach).
- [x] **Files** (`src/games/shogi/formats.ts`): KIF, KI2, CSA and JKF read and KIF and CSA written
      through `tsshogi` for the 9×9 board; USI and SFEN in and out for both boards; mini-shogi games
      written as KIF with a 5五将棋 header and read back by our own reader. The game and review
      menus save KIF, CSA and SFEN (a new optional `GameUi.moreExports`); the Review door opens any
      of them. Shift-JIS files are refused with a clear message.
- [x] **Engine** (`src/ai/pvs.ts`, `src/games/shogi/engine.ts`): a shared principal-variation search
      for mutable positions (iterative deepening, transposition table, check extension, null move,
      late-move reductions, killers and history, node budgets, a clean unwind when the budget runs
      out) and the shogi evaluation: material on the board and in hand, king shelter and attackers,
      danger from the opponent's hand, piece placement and slider mobility. Quiescence tries
      captures, promotions and, at the horizon, checking drops within two squares of the king.
- [x] **Mate search** (`src/games/shogi/mate.ts`): tsume-style (every attacker move a check) with
      proof and disproof tables, the defender's longest resistance and a uniqueness check.
- [x] **Seven CPU levels** (`src/games/shogi/bots.ts`, `levels.ts`) by node budget: levels 1 to 3
      score every root move and make planned, human-looking mistakes (a liking for captures;
      levels 1 and 2 do not see checking drops), levels 4 to 7 play the engine's move at 40,000,
      90,000, 180,000 and 550,000 nodes with a small seeded wobble so a level does not repeat one
      game. Levels claim an impasse when it wins. Coach answers: `eval`, `hint` (move and idea),
      `threats`, `check-move` (blunder warning), `best` (free play), `analyse` (review) and `mate`.
- [x] **Handicap ladder**: nine handicaps as presets; the New game dialog shows how strong a level
      plays with each (100 rating points per JSA rank of handicap); `scripts/shogi-handicaps.ts`
      measures a level giving them (results under the ladder table).
- [x] **The table** (`src/games/shogi/ui/`): the board in the middle and each side's pieces in hand
      beside it (the far player's on the left, yours on the right), every square and hand piece a
      labelled button; tap a piece or a piece in hand, then a square (drag also works on the board);
      legal-move dots for moves and drops; the promotion prompt (a forced promotion happens and is
      explained); refused moves explained in a note; last move, check, flip; the impasse button when
      a claim is valid. Faces: one kanji, two kanji, or original symbols with a letter (upright for
      both sides), and learner movement marks as a switch; chosen in the rail or with the "Faces"
      button by the board in lessons and problems. Kanji are Shippori Mincho B1 outlines (OFL)
      embedded as 30 SVG paths; no font file ships.
- [x] **Coach and counters**: legal moves, movement marks, blunder warning, threats, evaluation bar
      and the three-step hint (hints, threats, warnings and the bar mark the game as training).
      Counters a real player keeps in their head: material, pieces in hand, impasse points, how
      many times this position has been seen (of four), checks in a row.
- [x] **Reference card**: the pieces with readings, promotion, drops, endings, every impasse rule,
      all presets and handicaps with what they remove, notation (Western, Japanese, USI), terms with
      pronunciation, a guide to piece values, "ask before you sit" and the CPU levels.
- [x] **Learn**: 35 lessons, every word original, starting on the 5×5 board: stage 0 (2), stage 1,
      the rules (14), stage 2, first strategy (10: values, gold on the head, the knight mate, the
      drop fork, free pieces and their guards, the dragon, a mate in three by checks, castling,
      first moves, mating a lone king against the engine), stage 3 started (4: Mino, Yagura and
      Anaguma castles, Static and Ranging Rook) and the Table-ready track (5: setting up, names
      and how to say them, reading and writing moves, manners, the clock and byōyomi). The
      linter checks shogi with the built-in engine: every "best" claim must beat every other move
      by 150 (a pawn is about 90) at 1,500,000 nodes with every root move scored, "mate" and
      "only" by the rules, free play against the engine's defence; numbers in the text are
      placeholders the game computes (points, counts, reach).
- [x] **Practice**: 583 mate problems (248 in one, 228 in three, 107 in five) found in 449 of the
      engine's own games (`scripts/shogi-problems.ts`, run as six seeded batches and merged) and
      each proved: the mate holds, nothing shorter works, and the attacker's move is the only one
      at every turn before the last. Three generated drills on the lesson runner: drops (count the
      legal pawn drops on a small board, or find the mating drop), castles (name the Mino, Yagura,
      Anaguma or Boat castle, or bring the king home), and counting impasse points (the
      table-ready "score" item).
- [x] **Review**: every position searched (50,000 nodes, a second line at half), moves rated by loss
      in winning chances (engine units scaled to the shared curve: a 600 lead is about 73%), key
      moments with reasons (allowed mate, missed mate, left a piece to be taken, missed a win of
      material, what was better, drops included), "add to my practice" and "play on from here"
      (keeping the handicap and the impasse rule).
- [x] **Table-ready checklist** in `src/games/ready.ts`: setup, names and notation, five impasse
      counts right first time, manners and the clock, and a win against level 3 without helps.

### Gate: the definition of done for Shogi (PLAN.md 2.10)

| Gate | Result |
|---|---|
| 1. `docs/rules/shogi.md` lists the rules as implemented, every option, every preset, sources | Done before the code: 12 sections, 16 presets (standard, professional, casual, nine handicaps, mini-shogi and its three handicaps), four impasse rules, 14 groups of golden cases, sources with the date read |
| 2. Rules pass golden, property and replay tests under every preset | `shogi-rules` 28 tests (every golden case, perft, the `tsshogi` cross-check); `shogi.property` 16 tests, one per preset (the contract holds over random games, pieces are conserved on the board and in hand, the record replays); `shogi-formats` 7 (every file format reads back what it writes) |
| Perft cross-check (M8) | Standard start 30, 900, 25,470, 719,731; mini-shogi 14, 181, 2,512, 35,401, 533,203; the "matsuri" position 207 and 28,684; 593 moves in the maximum-moves position: all equal to the published counts. `tsshogi` agrees move by move with our legal moves on every third position of three random games of up to 160 moves, and on the pawn-drop mate positions |
| 3. At least four CPU levels pass the ladder | All seven pass, 20 games a rung (table below) |
| 4. Learn stages 0 to 2 and Table-ready complete, passing lint | 35 lessons: stage 0 (2), stage 1 (14), stage 2 (10), stage 3 started (4), Table-ready (5). `npm run lint:lessons` passes, also from a cold engine cache |
| 5. Three kinds of practice, each generated or with 100 or more items | Mate in one, three and five: 248, 228 and 107 problems, every one generated and proved; three generated drills (drops, castles, impasse points) |
| 6. Coach helps, and a counter a player keeps in their head | Legal moves, movement marks, blunder warning, threats, evaluation bar, three-step hint; counters for material, pieces in hand, impasse points, how often this position has been seen (of four) and checks in a row |
| 7. Review: key moments with reasons, "play on from here" | Yes, at all three sizes in e2e; play on keeps the handicap and the impasse rule |
| 8. Save, resume, replay and the reference card | e2e: resume after closing the app, save as KIF, CSA and SFEN, open a KIF file in Review; replay in the property tests; the reference card in the screenshots |
| 9. End-to-end at phone landscape; screenshots looked at | `tests/e2e/shogi.spec.ts` (10 tests) at 844×390, 1180×820 and 1440×900 (files on the phone only); the whole suite passes: 129 tests (45 at the phone size, 40 at each of the others, 4 screenshot runs), 4 skipped by design (saving files runs on the phone only), none failed. 19 screenshots in `screenshots/m8/` looked at and fixed (faces button, upright symbol letters, the note when nothing can be dropped, the hand columns at every width) |
| 10. Progress written | This section (`PROGRESS-M8.md`, to go into `PROGRESS.md` at the merge) |
| Every generated mate problem proven unique (M8) | `shogi-practice` proves all 583 again with the mate search: the mate holds, nothing shorter works, and against the longest defence the attacker has exactly one move that works at every turn |
| `npm run check` | Green: types, lint, 224 unit tests in 21 files, 22 property tests in 3 files, and the lesson lint for chess and shogi |

The ladder (`npm run ladder -- shogi`, 20 games a rung, seats alternating, pass at 0.6; every game
ended in checkmate):

| Rung | Won | Drawn | Lost | Score |
|---|---|---|---|---|
| Level 1 against random play | 20 | 0 | 0 | 1.000 |
| Level 2 against level 1 | 19 | 0 | 1 | 0.950 |
| Level 3 against level 2 | 19 | 0 | 1 | 0.950 |
| Level 4 against level 3 | 19 | 0 | 1 | 0.950 |
| Level 5 against level 4 | 17 | 0 | 3 | 0.850 |
| Level 6 against level 5 | 13 | 1 | 6 | 0.675 |
| Level 7 against level 6 | 17 | 0 | 3 | 0.850 |

A first design had eight levels with 320,000 nodes between 180,000 and 550,000; 550,000 against
320,000 stood at 3 of 7 when it was stopped, so the step was too small to be a level, and level 7 is
now the 550,000-node engine. The handicap ladder, measured with `scripts/shogi-handicaps.ts` (level 6
giving each handicap to level 4, the giver playing White and moving first, 8 games each): even
0.875, lance 1.000, bishop 0.875, rook 0.625, two pieces 0.500 for the giver. The giver's score
falls as the handicap grows, more slowly than 100 points a rank predicts between two engines (the
weaker one converts extra material poorly); the offsets in the New game dialog keep the JSA's
rank table, which was made for people.

### Decisions in M8

- **One position core for the rules, the engine, the mate solver and the lesson checks**
  (`core.ts`: a mailbox board with sentinels, moves packed in one integer, Zobrist keys), so what
  the table allows and what the CPU and the linter think can never differ. `tsshogi` (MIT) ships
  only for reading and writing KIF, KI2, CSA and JKF, and is the second implementation in the
  tests. The GPL libraries (`shogiground`, `shogiops`) are not used.
- **Defaults follow JSA practice**: the fourth occurrence of a position ends the game drawn (no
  replay with colours reversed); perpetual check loses; the impasse is settled by the 27-point
  declaration, offered as a move only when it is valid; the 24-point count, the try rule and no
  impasse rule are options. No move limit at the table; ladders and the problem generator stop at
  320 moves (a draw, the computer-shogi convention).
- **Mini-shogi** as in the sources: one-rank zone, repetition loses for the first player (Black),
  perpetual check loses. It is a preset (with three handicaps), and Learn starts on it.
- **Handicaps** are presets: White (the stronger player) moves first, the removed pieces count for
  White in the 24-point count, and the New game dialog shows the level's strength less 100 points
  per JSA rank of handicap. Only games with the default rules are rated, as before.
- **Notation**: the move list uses Western notation (`P-76`, `Bx22+`, `S*52`, `G61-52` when two
  pieces could go, `=` for a declined promotion); files use the Japanese form; records store digit
  moves (`7776`, `8822+`, `P*55`) that never depend on the display.
- **Engine shape**: a generic principal-variation search in `src/ai/pvs.ts` for games with mutable
  positions (Go and later games can use it; chess keeps Stockfish). Strength comes from node
  budgets only, so ladders, problems and lesson checks repeat exactly. Levels 1 to 3 score every
  root move and choose planned mistakes inside a window (with a liking for captures; 1 and 2 do
  not see checking drops); 4 to 7 search cleanly with a small seeded wobble. Seven levels, not
  eight: near the top a step of 1.7 times the nodes did not make a stronger player, so the top
  level has three times the nodes of level 6 (550,000, about what a phone searches in three
  seconds). Hot code binds its imports to local constants (`tsx` and Vitest compile imported
  constants to getters, which made the search seven to ten times slower).
- **Faces**: kanji are traced from Shippori Mincho B1 (OFL 1.1) by `scripts/shogi-glyphs.mjs` into
  30 SVG paths (64 KB of source), so no font file ships and nothing loads at run time. The
  "symbols" face is original: a drawing of how the piece moves and an upright letter, which both
  players can read. Learner marks are a coach switch that works with every face.
- **The table in landscape** keeps the board square in the middle, the far player's pieces in hand
  on the left and yours on the right; in portrait they sit above and below. A forced promotion
  happens with a note; an optional one asks.
- **Lesson checks use the built-in engine**: "best" must beat every other move by 150 (a pawn is
  90) at 1,500,000 nodes with every root move scored; "mate" and "only" are checked with the
  rules and the mate solver. The results share the linter's cache with Stockfish's.
- **Problems are tsume** (every attacking move gives check), the defence is the longest one (a
  drop between is tried last), and a problem is kept only when its mate is the shortest and the
  attacker's move is the only one that works at every turn. Ratings start from the length, the
  number of tempting checks and whether the first move is a sacrifice.
- **Shared code added, all optional**: `GameUi.presets` (with `ratingOffset`) and the preset select
  in the New game dialog, `GameUi.replayConfig` for "Play again", `GameUi.moreExports` for more
  file formats, and `LessonGame.stripNotation` for the linter's typed-number check. No other game
  changes behaviour. The shelf test now counts coming games from the catalogue, and the chess
  problem-pack test has a 60-second timeout (it took 20 seconds with three builds running).

### Not done in M8, or open

- **Stage 3 is started, not finished**: four lessons (the Mino, Yagura and Anaguma castles, Static
  and Ranging Rook). Openings in depth, tesuji and the endgame (*yose*, brinkmate) are still to be
  written; stage 4 is empty.
- **The engine is modest.** Level 7 is a club player at best. It has no opening book, does not plan
  an entering king (it declares an impasse only when it qualifies and is ahead), and the try rule
  is playable but not aimed for. A stronger engine can come in behind the same interface (M15).
- **Ratings are nominal**: anchored at 400 for level 1 and spaced more cautiously than the ladder
  scores suggest (see the gate table); not yet checked against people. Handicap strengths use the
  JSA's rank differences at 100 points a rank, which is more than a handicap is worth between two
  of the engine's levels (measured over only 8 games a handicap).
- **Phone speed** of level 7 is estimated from Chromium on the build machine; no APK was built in
  this milestone, as instructed.
- **Shift-JIS files** are refused with a message (save as UTF-8 first); no decoder ships.
- **No Japanese interface**: kanji and readings appear inside the English text and on the pieces.
- **Problem ratings** come from a formula (length, tempting checks, a sacrifice, a drop), not from
  players' results.
