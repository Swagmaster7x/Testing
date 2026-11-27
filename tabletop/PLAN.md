# Kibitz: learn and practise card, board and tile games

2026-11-27 · Swag

**Working name:** Kibitz (a kibitzer is the person watching over your shoulder and offering advice). It is one string, so rename it whenever you like. Everything for this app lives in `tabletop/`, next to Yoked and separate from it.

This is the build plan. Part 1 says what the app is. Part 2 is for the builder (the Claude Code session doing the work): architecture, quality rules and sixteen milestones, each with a gate. The prompts to start and continue the build are at the end.

## The short version

- **What it is.** One app that teaches you Chess, Shogi, Go, Chinese Checkers, Mahjong, Dominoes, Brisca and Poker, then their subtypes and more card games. You pick a game and choose Learn, Practice, Play or Review.
- **What it is for.** Getting good enough to sit down at a real table. So it also teaches the things apps normally do for you: scoring by hand, counting what has been played, dealing and setup, the calls and the etiquette.
- **How it teaches.** Lessons run on the real game, not on pictures. The CPU plays at levels you can beat today. After each game the app shows your biggest mistakes, and those mistakes come back later as your own practice problems.
- **How it is built.** A web app made for landscape that installs like an app, works offline, and is also packaged as an Android APK you sideload the same way as Yoked. The same code runs on a phone, a tablet, a laptop and an iPhone.
- **Build order.** Foundation, then Chess as the pilot for the whole teaching loop, then a stop for your feedback, then Brisca, Dominoes, Hold'em, Go, Chinese Checkers, Shogi and Mahjong. Variants and extra card games follow. The eight launch games are milestones 0 to 10; it is a large build.

## Decisions made for you (flip any of them)

| # | Decision | Why | If you want the other way |
| --- | --- | --- | --- |
| 1 | A web app (TypeScript) with an Android APK wrapper, not a Kotlin app like Yoked | One codebase for every screen you own, including an iPhone with no Mac. The builder can open and play it in a real browser while building, which it cannot do with an Android app (there is no emulator in the build environment). Strong open game engines already ship for the web. | Say "native Android". The game logic design below carries over; the engines and the play-testing do not. |
| 2 | Landscape is the design target; portrait still works | You asked for landscape. Mahjong hands, card tables and a board with a coach panel all fit landscape best. | Nothing to do. |
| 3 | Chess is built first even though you listed Poker and Brisca first | It has the best free engine and a free puzzle library, so it proves Learn, Practice, Play and Review fastest. Every later game copies that template. | Reorder milestones 3 to 10 freely; they do not depend on each other. |
| 4 | Mahjong means four-player Riichi (Japanese) first, Hong Kong style second. It is not the tile-matching solitaire. | Riichi has the best-defined rules and the richest training material. The tile engine is shared, so a second style is cheap. | Tell the builder which style your group plays and it leads with that. |
| 5 | Brisca and Dominoes default to Puerto Rican table rules | You wrote "Briscas", the Puerto Rican name. House rules vary by table, so every disputed rule is a switch. | Fill in the house-rules sheet (see Questions for Swag). |
| 6 | Poker uses play chips only | It is a trainer. No purchases, no real-money wording. | Not offered. |
| 7 | Offline, no accounts, no ads, no analytics, no streaks or "you missed a day" messages | Same ground rules as Yoked. Progress is shown as skills and ratings, never as guilt. | Nothing to do. |
| 8 | English first, with each game's own terms (Spanish for Brisca and Dominoes, Japanese for Shogi, Go and Mahjong). Spanish interface later. | The table terms are what you need in person. | Ask for the Spanish interface earlier; text is kept in one catalogue from day one. |

---

# Part 1: The product

## 1.1 What makes it better than "games with a tutorial"

1. **One loop for every game.** Learn the idea, practise it in small problems, play a full game, review the game. Review feeds practice: each mistake you choose to keep becomes a card that returns on a spaced schedule until you stop getting it wrong.
2. **A coach you can turn down.** Legal-move dots, a warning before a blunder with a take-back, a three-step hint (where to look, the idea, the move), threat arrows, and counters for what has been played. Each is a switch. Games played with help are marked as training and do not move your rating. The app suggests turning a help off once you stop needing it.
3. **Table-ready, not just app-ready.** Each game has a checklist that ends with "ready for a real table": you can set up and deal, you know the calls and terms, you can score a hand or count a board yourself, you know the etiquette, and you beat a set CPU level without help. Auto-scoring can be turned off so you do the arithmetic.
4. **Pop quizzes on table skills.** During a game the coach can pause and ask what a real player tracks: "How many trumps are left?", "Which doubles are out?", "What are your pot odds?", "Whose discards are dangerous?"
5. **Opponents with styles, not only strengths.** Poker seats are a rock, a calling station, a maniac and so on, revealed after the session. Mahjong seats attack or fold differently. Partner games give you a CPU partner who follows known conventions.
6. **An honest CPU.** It never sees your cards. Deals come from a seed stored with the game. Reviews of hidden-card games have two lenses: "with what you knew" judges the decision, "cards up" shows what was really there. That separates bad play from bad luck.
7. **Problems for every game, checked by a solver.** Chess uses a free rated library. The other games generate problems and verify each one has a provable answer (section 2.6).
8. **Each game's own teaching ladder.** Capture-Go and 9×9 before 19×19. Mini-shogi and handicap games before even Shogi. Open-hand ("cards up") rounds for Brisca, Poker, Dominoes and Mahjong while you learn to read a table.
9. **Learner pieces.** Shogi pieces with movement marks or international symbols as well as kanji, Mahjong tiles with small numerals and letters, a four-colour deck option.
10. **Useful at a real table.** Pass-and-play on one device, and scorepads for live games (Dominoes to 200 or 500, Brisca, Mahjong point sticks, a poker blind timer) in a later milestone.
11. **Focus games.** You pick up to three games you are studying now. The Today screen builds a 10 to 20 minute session from those: due reviews, a few problems, one lesson or one game. Other games stay one tap away.

## 1.2 The games

| Game | At launch | Added later | Practice (problems and drills) | CPU |
| --- | --- | --- | --- | --- |
| Chess | Standard | Chess960, opening trainer | Rated tactics by theme, basic mates, endgames | Stockfish, 8 levels |
| Brisca | 2 players, Spanish 40-card deck | 4 players in pairs with señas, Tute | Card values, who wins the trick, count the pile, count trumps, solved endgames | Card-counting bots, 6 levels |
| Dominoes | Draw, Block, Partnership to 200 or 500 (double-six) | All Fives | Pip counting, "what can't they have", block decisions, solved endgames | Counting bots and a CPU partner |
| Poker | No-Limit Texas Hold'em: heads-up, 6-max, sit-and-go | Omaha, Five-Card Draw, Seven-Card Stud | Hand ranking, outs, pot odds, preflop ranges, bet-or-fold spots | Style bots |
| Go | 9×9, 13×13, 19×19, handicaps, Capture-Go | Stronger engine, joseki basics | Capture, ladders and nets, life and death, count the board | Own engine, strongest on 9×9 |
| Chinese Checkers | 2, 3, 4 or 6 players | Long-jump variant | Longest hop chain, race endgames | Search bots |
| Shogi | Standard, handicaps, 5×5 mini | Stronger engine, castle trainer | Mate problems in 1, 3 and 5, drops, castles | Own engine with a handicap ladder |
| Mahjong | Riichi, 4 players | Hong Kong style | Waits, "what would you discard", yaku, scoring, safe tiles | 3 CPU seats with styles |
| Classic card pack | (later) | Blackjack, Hearts, Spades, Gin Rummy | Basic-strategy drill, trick and count drills | Generic card bot |

Backlog, not planned in detail: Xiangqi, Checkers, Backgammon, Cribbage, Euchre, Conquián, Truco, Mexican Train.

## 1.3 The four doors

Every game hub has the same four doors plus a reference card.

- **Learn.** Short interactive lessons in five stages: (0) what the game is, (1) rules, enough to finish a legal game, (2) first strategy, the handful of principles that take you from legal to sensible, (3) core skills, (4) advanced topics. A sixth track, Table-ready, covers setup, scoring by hand, calls, terms and etiquette. Nothing is locked; a recommended path is shown and "I already know this" skips ahead through a short check.
- **Practice.** Problems and drills with a difficulty that follows you, plus the review queue of cards that are due.
- **Play.** Against the CPU at a chosen level or the suggested one, with the coach helps you have switched on. Also pass-and-play, and open-hand rounds where the game has hidden cards or tiles. Games save automatically and resume.
- **Review.** The finished game with its key moments: what you did, what was better, a one-sentence reason, "play on from here" against the CPU, and "add to my practice".
- **Reference.** One searchable page per game: rules summary, rankings and values, glossary with pronunciation, the options your table uses.

## 1.4 Screens

Top level: **Today** (suggested session for your focus games), **Games** (the shelf, grouped as Cards, Boards, Tiles), **Progress** (skills, ratings, table-ready checklists), **Tools** (scorepads, later), **Settings** (profiles, looks, sound, backup).

The table screen in landscape:

```
+--------------------------------------------------+--------------+
| status: game - level - score - turn       [menu] | Coach rail   |
+--------------------------------------------------+ (collapsible)|
|                                                  |  hint        |
|                 play surface                     |  counters    |
|        (board, or table with seats)              |  move list   |
|                                                  |  log         |
+--------------------------------------------------+              |
| your hand and actions (cards, tiles, bets)       |              |
+--------------------------------------------------+--------------+
```

- A square board (Chess, Shogi, Go) takes the full height. The spare width holds the rail on one side and captured pieces, pieces in hand and clocks on the other.
- Card and tile tables use the full width. Your hand sits along the bottom; pressing a card or tile enlarges it.
- Input is tap to select, then tap the target, because dragging is awkward on a phone held sideways. Dragging also works. Go has an optional confirm step.
- The rail can sit on the left for left-handed play. Main actions sit under the thumbs.
- Smallest target is a phone at 800×360 CSS pixels. Layouts are checked at phone, tablet and laptop sizes. Notch and camera cut-outs on the short edges are respected.
- Portrait gets a stacked layout that works, with a small "better sideways" hint. The APK locks to landscape.

## 1.5 Look and feel

A quiet club room: dark warm neutrals, green felt, walnut boards, ivory cards and tiles, one brass accent. A serif for headings, a clear sans for everything else, tabular numerals for scores. No casino glitter, no mascots, no confetti. A light "daylight" look comes with the polish milestone. All art is original and drawn as vectors.

## 1.6 Ground rules

- One device, local profiles (yours and anyone else's on the same device), no accounts, no cloud.
- Works fully offline after install. The app makes no network requests while running.
- No ads, analytics, streaks, daily nags or guilt messages. Skipping a week is never mentioned.
- Poker and Blackjack use play chips with no way to buy them.
- Every rule that tables disagree on is an option, stored with each game.
- Backup: Export writes everything to one file, Import reads it back.

---

# Part 2: The build

## 2.1 Platform and stack

- **App:** TypeScript, React, Vite. Installable offline web app (service worker precache). Hash routing so every lesson, problem and game position has a link, which the tests also use.
- **APK:** the same build wrapped with Capacitor for Android, landscape, signed with a fixed debug key kept in the repo so a new build installs over the old one and keeps its data (the Yoked approach). This is proven in milestone 0; the fallback is the installable web app alone.
- **Rendering:** SVG for boards, DOM elements with CSS transforms for cards and tiles. No canvas game engine. Reasons: sharp at any size, simple hit-testing, and the end-to-end tests can click a square or a card by name.
- **State:** a small store (Zustand) for the interface; game state lives in the pure game modules.
- **Storage:** IndexedDB through Dexie, with schema versions and migrations from the first commit.
- **Scheduling of reviews:** `ts-fsrs`.
- **Tests:** Vitest for logic, fast-check for properties, Playwright for end-to-end runs and screenshots.
- **Versions:** use the current stable release of each package at build time and record them in the lockfile. Checked on 2026-11-27: every package named in this plan exists on npm under the licence stated.

Third-party code, and what each piece is for:

| Package | Licence | Use |
| --- | --- | --- |
| `chess.js` | BSD-2 | Chess rules, behind our contract |
| `stockfish` (Stockfish 19 for the web) | GPL-3 | Chess engine. Ship only `stockfish-19-lite-single.js` and `.wasm` (1.8 MB, single-threaded, needs no special server headers). Do not ship the 99 MB networks. |
| `tsshogi` | MIT | Shogi rules and KIF, CSA, SFEN formats |
| `@sabaki/go-board`, `@sabaki/sgf`, `@sabaki/deadstones` | MIT | Go rules, SGF files, dead-stone suggestion at scoring |
| `ts-fsrs`, `dexie`, `zustand` | MIT, Apache-2.0, MIT | Review schedule, storage, interface state |
| `pokersolver`, `riichi`, `syanten` | MIT | Test oracles only: our poker evaluator and Mahjong scorer are checked against them. Not shipped. |
| `fairy-stockfish-nnue.wasm`, `onnxruntime-web`, `katago-web` | GPL-3, MIT, MIT | Optional strong engines in milestone 14 |

**Licence note.** Stockfish is GPL-3 and runs as a separate worker file behind the `Engine` interface. For a personal app that is fine. If this app is ever published, either publish its source under a GPL-compatible licence or switch Chess to a built-in engine. Keep other GPL libraries (chessground, chessops, shogiground, shogiops) out of the app so that choice stays open. Every dependency gets a line in `THIRD-PARTY.md`.

## 2.2 Folder layout

```
tabletop/
  PLAN.md  PROGRESS.md  THIRD-PARTY.md
  docs/rules/<game>.md          rules as implemented, options, sources
  src/
    core/        contract, seeded RNG, replay, events, codecs
    ai/          alphabeta, mcts, determinized search, exact solvers, worker host
    games/<game>/
      rules.ts   pure rules implementing the contract
      bots.ts    levels and styles
      analyse.ts review ratings and reason tags
      ui/        table component for this game
      learn/     lessons (data)   practice/  generators and drills
      reference.ts
    kits/        BoardKit (grid, intersections, star), CardKit, TileKit, ChipKit
    shell/       Today, Games, hub, Progress, Settings, TableShell, coach rail
    teach/       lesson runner, problem player, review, schedule, ratings
    store/       database, profiles, backup
    text/        message catalogue (English first)
  public/engines/   engine files copied at build
  scripts/          puzzle import, generators, ladder runs
  tests/            unit, property, lesson lint, e2e
  android/          Capacitor project
```

## 2.3 The game contract

Every game is a pure module with the same shape. Everything else (interface, bots, lessons, review, replay, tests) is written against it once.

```ts
interface GameDef<State, Action, Config, View> {
  id: string;
  setup(config: Config, rng: Rng): State;        // all randomness fixed here from the seed
  seats(state: State): Seat[];
  turn(state: State): Seat | null;               // null when the game is over
  legal(state: State, seat: Seat): Action[];
  apply(state: State, action: Action): { state: State; events: GameEvent[] };
  outcome(state: State): Outcome | null;         // per-seat result and score
  view(state: State, seat: Seat): View;          // only what that seat may see
  sample?(view: View, seat: Seat, rng: Rng): State;  // a full state consistent with a view
  codec: { state: Codec<State>; action: Codec<Action> };  // JSON plus human notation
}
```

Rules that follow from it:

- **A game record is `config + seed + actions`.** Replays, save and resume, bug reports, lesson positions and tests all use that one form. Records also store the rules version so old games still open.
- **`apply` is pure and returns events** (card dealt, piece captured, tile discarded). The interface animates events from a queue and never blocks the rules on an animation. Animations can be skipped with a tap and honour reduced motion.
- **Bots receive `view`, never `state`.** They run in a worker and the worker is only ever sent a view. A test serialises every view during random games and fails if a hidden card or tile appears in it.
- **Multi-seat decisions** (Mahjong calls on a discard) are modelled as a short claim phase in priority order, so the contract stays turn-based.
- **Options are config.** "Rules at this table" is a screen generated from each game's option list.
- Bots may use fast internal representations for search, as long as they agree with `rules.ts` under test.

## 2.4 CPU players

Shared search code in `ai/`, used by all games:

| Tool | Used for |
| --- | --- |
| Alpha-beta with iterative deepening and a transposition table | Shogi, Chinese Checkers (2 players), endgames |
| Monte Carlo tree search | Go, multiplayer Chinese Checkers |
| Determinized search: sample hidden cards with `sample`, search or roll out each sample, pick the action that does best on average | Every card and tile game. This gives each new card game a competent bot from the contract alone; heuristics are layered on top for style and speed. |
| Exact solvers | Brisca after the stock runs out, domino endgames, small Go regions, mate search |
| External engine over a text protocol | Stockfish now; Fairy-Stockfish and KataGo later |

Rules for all bots:

- Strength is set by a node or playout budget, not by time, so a level is the same on a slow phone and in tests. A minimum "thinking" pause of about half a second keeps play readable; normal levels answer within three seconds on a mid-range phone.
- Weak levels make human-looking mistakes (missing a two-move tactic, overvaluing a capture, chasing a hand too long). They do not move at random.
- Each level is checked by a ladder run: over fixed seeds, level N+1 beats level N by a clear margin, and level 1 beats random play.
- A bot move can carry reason tags (`takes-points`, `saves-trump`, `blocks-suit`, `safe-tile`, `fork`). Sentence templates turn tags into "why" text for the coach and for review. No language model runs in the app.

Per game:

| Game | Approach |
| --- | --- |
| Chess | Levels 1 to 3 choose among Stockfish's top lines with planned errors; levels 4 to 8 use the engine's own strength limit. |
| Brisca | Counting heuristics (levels 1 to 3), determinized search (4 to 6), exact play once the stock is empty. |
| Dominoes | Heuristics plus inference from passes, determinized Monte Carlo, exact endgames. The CPU partner uses the same conventions the lessons teach. |
| Hold'em | Style bots built from preflop range charts, equity against an assumed range, pot odds and sizing rules, with mixed frequencies. Styles: rock, calling station, maniac, tight-aggressive, loose-aggressive, solid. Learning to spot and beat each style is the core live skill, so this beats one "perfect" bot for teaching. |
| Go | Own tree search with pattern-guided playouts. Good on 9×9, acceptable on 13×13, weak on 19×19 until milestone 14. Handicap stones extend the ladder. |
| Chinese Checkers | Greedy progress, then lookahead search. |
| Shogi | Own alpha-beta engine (material, king safety, piece-square tables, drops near the king in quiescence). The traditional handicap ladder gives many honest levels. |
| Mahjong | Tile efficiency (shanten and tile acceptance), then yaku awareness, then defence (fold using safe-tile ranking), then push-or-fold by hand value. Styles: attacker, balanced, defender. |

## 2.5 Teaching content is data, and it is tested

A lesson is a list of steps that run on the real game module:

- `say` (text with highlights and arrows), `show` (scripted moves), `askMove` (make a move that passes a check, with tailored feedback for common wrong answers), `askChoice`, `askNumber` (count something), `freePlay` (reach a goal from a position against a scripted or weak opponent), `checkpoint` (a short quiz).

The lesson linter runs in `npm run check` and fails the build unless:

- every position is legal and every accepted answer is a legal action;
- an auto-player can finish every lesson using the accepted answers;
- every "best move" claim is confirmed by the engine or solver for that game (engine margin in Chess and Shogi, solver in endgames, the efficiency calculator in Mahjong, exact equity in Poker);
- **every number in lesson text is computed from the rules module**, never typed (card points, hand ranks, scores, odds). The lesson cannot disagree with the game.

Writing rules: all prose is original. Short lessons, one idea each, two to four minutes. Native terms are introduced with a gloss and pronunciation, then used. Text goes through the message catalogue.

## 2.6 Where the problems come from

| Game | Source | How correctness is ensured |
| --- | --- | --- |
| Chess | The Lichess puzzle database, published as CC0 (confirm the licence on its download page). Import about 6,000 across themes and ratings 600 to 2200. Fallback: generate from engine self-play. | Each line is replayed through the rules; fallback problems need a unique best move by an engine margin. |
| Shogi | Generated mate problems from engine self-play positions. | Mate search proves the mate and that the first move is unique. |
| Go | Generated capture, ladder, net and small life-and-death problems. Classical collections only if a file with a clear public-domain status is supplied. | Solver on the enclosed region. |
| Mahjong | Generated hands. | Shanten and acceptance calculator for discards and waits; scorer for yaku and points; safe-tile ranking for defence. |
| Poker | Generated spots. | Exact enumeration or large-sample equity; pot-odds arithmetic. |
| Brisca | Generated positions; last three tricks. | Exact minimax. |
| Dominoes | Generated positions with pass history. | Exact endgame search; set arithmetic for "can't have". |
| Chinese Checkers | Generated positions. | Search for the longest chain or fewest moves. |
| Blackjack | Basic-strategy table. | Computed from the rules by expected value. |

Each problem has a difficulty estimate (depth, number of tempting wrong answers) that then adjusts with your results. A failed problem can be added to the review queue.

## 2.7 Review, ratings, progress

- **Review** rates each decision by its loss in the game's own unit: winning chances (Chess, Shogi, Go), expected points (Brisca, Dominoes), chips in big blinds (Poker), tile acceptance or expected value (Mahjong). The top three to five swings are the key moments. For hidden-information games the default lens is "with what you knew".
- **Ratings.** Each CPU level has a nominal rating. Your rating per game moves only on games played without help. Suggested level targets about a 55% win chance. For high-variance games the Progress page leads with decision accuracy, which is steadier than results.
- **Progress** shows, per game: lesson stages done, problem rating, play rating, accuracy trend, and the table-ready checklist. No streak counters.

## 2.8 Storage

Tables: profiles, settings, game records, lesson progress, problem attempts, review cards, ratings. Every row has a profile id. Export and Import cover everything in one JSON file with a format version. Ask the browser for persistent storage on install.

## 2.9 Art, fonts, sound

- Original vector art for chess pieces, the Spanish deck (oros, copas, espadas, bastos, with large corner indices), the French deck, dominoes, Mahjong tiles, chips, boards. No copied card faces, tile sets or piece sets unless a set has a clear permissive licence, recorded in `THIRD-PARTY.md`.
- Shogi kanji and Mahjong characters come from an open-licence CJK font, subset to the few dozen glyphs used. All fonts are bundled, with licences in `tabletop/licenses/`.
- Sound: a handful of short effects (piece, card, tile, chip), synthesised or CC0, with a switch. Optional vibration on your turn.
- Accessibility: four-colour deck, suit shapes never rely on colour alone, text scales, reduced motion, labels on squares and cards (the tests use the same labels).

## 2.10 Quality bar

Commands: `npm run check` (types, lint, unit, property, lesson lint), `npm run e2e`, `npm run ladder` (slow bot ladders), `npm run apk`.

Tests every game must have:

- **Golden cases** for each rule in `docs/rules/<game>.md`, including the awkward ones (castling through check, nifu, ko, side pots, furiten, a blocked domino game).
- **Properties over random games:** nothing crashes; every legal action applies; pieces are conserved (40 or 52 cards, 28 dominoes, 136 tiles, chips); totals hold (Brisca points sum to 120, double-six pips to 168); views never leak.
- **Cross-checks** against a second implementation where one exists (perft counts for Chess and Shogi, `pokersolver`, `riichi`, `@sabaki/go-board`).
- **Replay:** a record replays to the identical final state.
- **End to end** at 844×390, 1180×820 and 1440×900: start a game, play scripted moves to the end, finish a lesson, solve a problem, open a review. Use fixed seeds and node budgets so runs are repeatable.

**Definition of done for a game.** A game is not done until all of these are true:

1. `docs/rules/<game>.md` lists the rules as implemented, every option, and sources.
2. Rules pass golden, property and replay tests.
3. At least four CPU levels pass the ladder.
4. Learn stages 0 to 2 and the Table-ready track are complete and pass lint.
5. At least three kinds of practice exist, each generated or with 100 or more items.
6. Coach helps for this game are wired, including one counter or tracker that a real player keeps in their head.
7. Review shows key moments with reasons and "play on from here".
8. Save, resume, replay and the reference card work.
9. End-to-end tests pass at phone landscape, and the builder has looked at the screenshots.
10. `PROGRESS.md` is updated with what was built, what was decided and what is open.

## 2.11 Build environment notes

Observed in the cloud environment on 2026-11-27:

- Node 22, Chromium and Playwright are installed. Do not run `playwright install`. If the project pins a different Playwright version, launch with `executablePath: '/opt/pw-browsers/chromium'`. Run suites with `--trace off`.
- The Android SDK (platform 37) is at `/opt/android-sdk`. There is no emulator and no KVM, so the APK can be built but not run there.
- The npm registry is reachable. `database.lichess.org`, `huggingface.co` and `www.pagat.com` were refused by the environment's network policy. Milestone 2 needs `database.lichess.org` (chess problems) and milestone 14 may need a host for a Go network file. When a milestone needs a blocked host, the builder asks for it through the environment's approval card; if it stays blocked, use the fallback named in that milestone and say so in `PROGRESS.md`.
- Nothing in `tabletop/` touches Yoked's Gradle project. Add `tabletop/node_modules`, `tabletop/dist` and Android build output to `.gitignore`.

## 2.12 Milestones

One milestone per sitting. Do not start the next until the gate passes. Milestones 3 to 10 can be reordered.

**M0. Foundation**
- Scaffold `tabletop/` with the commands above. Design tokens, TableShell with the coach rail, Today, Games shelf (unbuilt games shown as "coming"), a game hub with four doors, Progress, Settings, profiles, backup.
- `core/`: contract, seeded RNG, records, replay, event queue. `ai/`: worker host and a first alpha-beta. A noughts-and-crosses fixture game (not on the shelf) proves play against a worker bot, save and resume, replay and the animation queue.
- Offline install works. Capacitor wrapper builds a debug APK that opens in landscape with the fixed key.
- Gate: `check` and `e2e` green; fixture game played end to end at 844×390; APK built, or the reason it could not be and the fallback, written in `PROGRESS.md`; screenshots sent to Swag.

**M1. Chess: play**
- BoardKit grid: tap-tap and drag, last move, legal dots, check highlight, promotion picker, flip, coordinates.
- `chess.js` behind the contract. Stockfish worker behind `Engine`. Levels 1 to 8. Optional clock.
- Coach: legal moves, blunder warning with take-back, three-step hint, threats, evaluation bar (off by default). Move list, save and resume, PGN in and out.
- Gate: perft cross-check; ladder; a scripted full game against level 1 in e2e.

**M2. The learning loop, on Chess. Then stop.**
- Lesson runner and linter. Chess Learn stages 0 to 2 complete (about 25 lessons), stage 3 started (fork, pin, skewer, discovered attack, back rank; king and queen, king and rook mates; opening principles). Table-ready track (touch-move, clocks, notation, offering a draw, resigning).
- Problem player (multi-move lines, hint, retry, rating) and the Lichess importer with an attribution file; fallback generator if the host is blocked.
- Review with accuracy, key moments, "play on from here", "add to my practice". Review queue, Today, Progress, table-ready checklist.
- Gate: definition of done for Chess. Send the APK and screenshots. **Stop for Swag's feedback and apply it to the template before M3.**

**M3. Cards and Brisca (2 players)**
- CardKit: Spanish deck, hand fan, trick area, stock with the trump card showing under it, won piles, deal and trick animations.
- Default rules, each one an option to confirm: 40 cards; three each; next card turned for trump and slid under the stock; As 11, Tres 10, Rey 4, Caballo 3, Sota 2, others 0; no duty to follow suit at any point; trick winner draws first and leads; 120 points in the deck, 61 wins, 60-60 is a tie; the 7 of trump may be swapped for a turned-up point card and the 2 for a turned-up 4 to 7 (timing is an option).
- Coach: cards seen, trumps and point cards left, points so far, "what beats this". Open-hand rounds.
- Learn highlights: the As, Tres, Rey, Caballo, Sota order (the 3 beating the king trips every beginner), when to spend trump, loading points onto a winning trick, counting to 61, the last three tricks.
- Gate: definition of done; point total always 120; endgame solver agrees with brute force.

**M4. Dominoes**
- TileKit: a chain that bends to fit the table, open ends marked, boneyard, four seats.
- Variants: Draw and Block for two; Partnership for four (fixed partners, seven tiles each, no boneyard). Options to confirm: target 100, 200 or 500; who starts the first and later hands; how a blocked hand is scored; bonuses for the first four hands, capicú and chuchazo and their values (Pagat describes 100, 75, 50, 25 for early hands in the 500 game and 100 each for capicú and chuchazo).
- Coach: the "tiles out" triangle, "can't have" marks after a pass, pip totals.
- Gate: definition of done; pips always sum to 168; partner bot follows the taught conventions.

**M5. Texas Hold'em**
- Betting engine: blinds, antes, minimum raise, all-in, side pots, split pots, odd chip, showdown order. ChipKit with bet presets and a slider.
- Formats: heads-up, 6-max cash, 6-player sit-and-go with rising blinds. Own evaluator checked against `pokersolver`.
- Coach: pot odds, outs, equity against a range, hand name, position, preflop chart. Session stats (how often you enter and raise pots) explained in plain words.
- Review: estimated value lost per decision, both lenses, and the post-session reveal of each seat's style.
- Gate: definition of done; chips conserved in every random game; side-pot golden cases.

**M6. Go**
- Intersections board at 9, 13, 19. Rules: no suicide, superko, pass, two passes end. Area and territory scoring, komi, handicap, dead-stone marking with a suggestion. SGF in and out.
- Capture-Go as the first mini-game, then 9×9 with area scoring, then territory scoring as used at most clubs.
- Coach: liberty counts, atari warning, territory estimate from playouts.
- Gate: definition of done; scoring golden cases for both methods; cross-check with `@sabaki/go-board`.

**M7. Chinese Checkers**
- Star board, 121 holes, 2, 3, 4 or 6 seats with 10 marbles. A move is one step or a chain of hops over single adjacent marbles; no captures. Finish rule that blocking cannot stall: a home triangle counts as filled when it has no empty hole and at least one of your marbles. Long-jump option later.
- Pass-and-play for 2 to 6 people arrives here and is then switched on for every earlier game.
- Gate: definition of done; no game can deadlock in random play.

**M8. Shogi**
- Board with pieces in hand, drops, promotion prompt. Illegal moves are refused with the reason (two pawns on a file, pawn-drop mate, moving into check). Repetition and an impasse option. KIF, CSA, SFEN in and out.
- Piece sets: one kanji, two kanji, international symbols, learner marks.
- Learn starts on 5×5 mini-shogi. Then drops, promotion, basic mating patterns, the Yagura, Mino and Anaguma castles, static and ranging rook.
- Gate: definition of done; perft cross-check; every generated mate problem proven unique.

**M9. Mahjong I: play Riichi**
- Tiles, wall, deal, dora, draws and discards, calls (chi, pon, kan, riichi, ron, tsumo) as a claim phase, furiten, yaku detection, han and fu scoring, a full East-South game with repeats and riichi sticks. Defaults follow the common online rules (red fives, open tanyao, 25,000 start); each is an option.
- Four-seat table in landscape: your hand along the bottom, discard rows in the centre, melds at the edges.
- Three CPU seats. Efficiency helper (tiles from ready, useful tiles) as a coach help.
- Gate: tile conservation; scorer cross-checked against `riichi` on generated hands; furiten and multiple-ron golden cases; full game e2e.

**M10. Mahjong II: teach Riichi**
- Learn from zero: tiles, sets and the pair, the winning shape, calls, the ten most common yaku, riichi, furiten, scoring, defence. Table-ready: building and breaking the wall, dealing, the dead wall, how to call, point sticks, the payment table.
- Practice: waits, "what would you discard", yaku recognition, score the hand, safe tile. Review: efficiency lost per discard and analysis of each deal-in. Auto-scoring switch.
- Gate: definition of done for Mahjong. **All eight launch games are complete here.**

**M11. Card variants A.** Omaha, Five-Card Draw, Seven-Card Stud on the poker engine. Brisca for four in pairs with a señas flash-card trainer and in-game signals as an option. Tute.

**M12. Classic card pack.** Blackjack with a basic-strategy trainer. Hearts, Spades and Gin Rummy on a shared trick-and-meld module with the generic determinized bot.

**M13. Tile variants.** Dominoes All Fives with scoring called as you play. Mahjong Hong Kong style on the shared tile engine.

**M14. Stronger engines.** Time-boxed trials, each with a written result: Fairy-Stockfish for Shogi (a threaded build, so it needs cross-origin isolation; check whether the APK's web view allows it); a small KataGo network for Go through `onnxruntime-web` or `katago-web`, mainly for score and ownership maps in review. Then a chess opening trainer, a shogi castle trainer and Go joseki basics. If a trial fails, the built-in engines stay.

**M15. Table tools, polish, release.** Scorepads and a blind timer, a Riichi score calculator, the light look, Spanish interface, a first-run tour, accessibility and performance passes, release APK, and optional web hosting.

## 2.13 Risks

| Risk | What the plan does about it |
| --- | --- |
| The scope is very large | Shared kits and one contract; a pilot game and a feedback stop before the template is copied; each milestone ends in something playable. |
| Regional rules are wrong for your table | Rules written down with sources before coding; every disputed rule is an option; the house-rules sheet; you play each game at its gate. |
| Strategy lessons contain mistakes | Claims are checked by an engine or solver in the linter; numbers are computed. |
| Built-in Go and Shogi engines are too weak once you improve | Handicap ladders now; stronger engines in M14 behind the same interface. |
| Mahjong is the most complex rules engine | Two milestones; a scorer cross-checked against a second implementation; options kept few at first. |
| The APK wrapper misbehaves (storage, threads, headers) | Proven in M0 with a fallback; all default engines are single-threaded. |
| Hosts blocked in the build environment | Fallbacks named in M2 and M14. |

## 2.14 Later ideas (not planned)

Online play, cloud sync, an "ask the coach" chat that needs internet and an API key, more games from the backlog, tournaments against the CPU.

---

## Questions for Swag

None of these block the start. Answers before the milestone named make that milestone better.

1. **Devices (before M0).** Which phone or tablet will you mostly use, and should it also run on an iPhone?
2. **Mahjong style (before M9).** Riichi, Hong Kong, or another style your group plays?
3. **House rules for Brisca and Dominoes (before M3 and M4).** For Brisca: the 7 and 2 swap and when it is allowed, what happens in the last hand of a four-player game, how many games make a match. For Dominoes: 200 or 500, who starts, early-hand bonuses, capicú and chuchazo values, how a blocked game is scored.
4. **Where you are starting from.** Which of these games do you already play? The builder can tune the first lessons and suggested levels.

## How to run the build

Start a new Claude Code session on this repository for each milestone.

**First session:**

```
Read tabletop/PLAN.md in full. Build milestone M0 exactly as written.
Create tabletop/PROGRESS.md with the milestone checklist and keep it current.
Before finishing: run the checks, play the result in the browser at 844x390,
look at the screenshots yourself, fix what looks wrong, then commit and push.
Send me the screenshots and the APK, and list anything you decided or could
not do.
```

**Every later session:**

```
Read tabletop/PLAN.md and tabletop/PROGRESS.md. Build the next unfinished
milestone and nothing beyond it. Write docs/rules/<game>.md before coding a
game and ask me about any house rule marked "to confirm". Meet the definition
of done in section 2.10 and the milestone's gate. Run the checks, play it at
844x390, look at the screenshots, then update PROGRESS.md, commit and push.
Send me the screenshots and the APK.
```

## Sources

- Stockfish for the web, engine sizes and header requirements: https://www.npmjs.com/package/stockfish
- Lichess open database (puzzles): https://database.lichess.org/
- Brisca overview: https://en.wikipedia.org/wiki/Brisca
- Card games in Puerto Rico: https://www.pagat.com/national/puertorico.html
- Partnership dominoes, including the 200 and 500 games: https://www.pagat.com/domino/line/partnership.html
- Puerto Rico dominoes rules: https://caribbeantrading.com/dominoes-rules-in-puerto-rico/
- KataGo in the browser (web-katrain): https://forums.online-go.com/t/web-katrain-browser-based-katrain-clone-with-in-browser-katago-analysis-webgpu-wasm/59096
