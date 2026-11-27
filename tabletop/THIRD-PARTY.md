# Third-party software

Every dependency of Kibitz gets a line here (PLAN.md 2.1). Versions are the ones in
`package-lock.json` on 2026-11-27 (milestones 0 to 2, 6 and 9). "Shipped" means it ends up inside the app or the
APK; the rest are only used to build and test it.

## Shipped in the app (web build and APK)

| Package | Version | Licence | Use |
| --- | --- | --- | --- |
| `react`, `react-dom` | 19.3.1 | MIT | Interface |
| `zustand` | 5.1.0 | MIT | Interface state |
| `dexie` | 4.4.7 | Apache-2.0 | IndexedDB storage with schema versions |
| `@capacitor/core` | 8.6.3 | MIT | Bridge to the Android wrapper |
| `@capacitor/filesystem` | 8.1.5 | MIT | APK only: writes the backup file before sharing it |
| `@capacitor/share` | 8.0.3 | MIT | APK only: the share sheet for "Export" |
| `chess.js` | 1.4.0 | BSD-2-Clause | Chess rules behind the game contract. Licence: `licenses/chess.js-BSD-2-Clause.txt` |
| `ts-fsrs` | 6.0.1 | MIT | The spaced-review schedule (FSRS) for the review queue (milestone 2) |
| Stockfish 19 (`stockfish`, lite single-threaded build) | 19.0.1 | GPL-3.0 | Chess engine for CPU levels and the coach. Only `stockfish-19-lite-single.js` and `.wasm` ship, as `engines/`. Licence: `licenses/Stockfish-GPL-3.0.txt`; source: github.com/nmrugg/stockfish.js and github.com/official-stockfish/Stockfish |
| Inter (`@fontsource-variable/inter`) | 5.3.0 | SIL OFL 1.1 | Text font, Latin and Latin Extended. Licence: `licenses/Inter-OFL.txt` |
| Fraunces (`@fontsource-variable/fraunces`) | 5.3.0 | SIL OFL 1.1 | Heading font, Latin and Latin Extended. Licence: `licenses/Fraunces-OFL.txt` |
| `tsshogi` | 2.3.4 | MIT | Shogi game files (milestone 8): reads KIF, KI2, CSA and JKF and writes KIF and CSA for the standard board (`src/games/shogi/formats.ts`); in the tests, a second implementation that checks our move legality move by move. The rules and the engine are our own. Loaded only with the shogi table |
| Shippori Mincho B1 ExtraBold (outlines only) | Shippori Mincho v24, via `@fontsource/shippori-mincho-b1` 5.3.0 | SIL OFL 1.1 | The 30 kanji on the shogi pieces and board, converted once to SVG path data (`src/games/shogi/ui/glyphs.ts`, made by `scripts/shogi-glyphs.mjs`); no font file ships. Copyright 2021 The Shippori Mincho Project Authors. Licence: `licenses/ShipporiMincho-OFL.txt` |
| Fairy-Stockfish (`fairy-stockfish-nnue.wasm`, threaded WebAssembly build) | 1.1.12 | GPL-3.0 | Shogi level 8 and strong review analysis (milestone 15), only where the page is cross-origin isolated; never in the APK's WebView, which has no SharedArrayBuffer. `stockfish.js`, `stockfish.worker.js` and `stockfish.wasm` ship unmodified as `engines/fairy-stockfish/`, started by the app's own `host.js` (`scripts/engines/fairy-stockfish-host.js`) and spoken to over USI. No NNUE network ships; the engine uses its own evaluation. Licence: `licenses/Fairy-Stockfish-GPL-3.0.txt`; source: github.com/fairy-stockfish/fairy-stockfish.wasm |
| KataGo network `g170-b6c96-s175395328-d26788732` | from KataGo's repository (`cpp/tests/models/`), fetched 2026-11-27 | MIT (the KataGo repository's licence) | The Go review's score and ownership map (milestone 15). Shipped as `engines/katago/g170-b6c96-f16.bin`, weights rounded to 16-bit floats by `scripts/katago-net.ts` (2.0 MB). The reader and the forward pass are this app's own (`src/games/go/net/`), written from KataGo's model format; no KataGo code ships. Licence: `licenses/KataGo-MIT.txt` |
| LXGW WenKai TC Bold (outlines only) | LXGW WenKai TC v11, via `@fontsource/lxgw-wenkai-tc` 5.3.1 | SIL OFL 1.1 | The 24 Chinese characters on the mahjong tiles (the numerals and 萬 of the characters suit, the winds, the red and green dragons, the flowers and seasons), converted once to SVG path data (`src/games/mahjong/ui/glyphs.ts`, made by `scripts/mahjong-glyphs.mjs`); no font file ships. Copyright 2024 The LXGW WenKai Project Authors. Licence: `licenses/LXGW-WenKai-TC-OFL.txt` |

## Shipped in the APK only (Android libraries, pulled in by Gradle)

| Library | Version | Licence | Use |
| --- | --- | --- | --- |
| `@capacitor/android` (Capacitor Android runtime) | 8.6.3 | MIT | The WebView wrapper and its SystemBars plugin |
| AndroidX AppCompat, Core, Core SplashScreen, Activity, Fragment, CoordinatorLayout, WebKit | per `android/variables.gradle` | Apache-2.0 | Android support libraries used by Capacitor |
| Apache Cordova Android framework (`org.apache.cordova:framework`) | 14.0.1 | Apache-2.0 | Required by Capacitor's plugin layer; no Cordova plugins are used |
| `io.ionic.libs:ionfilesystem-android` | 1.1.1 | MIT | Used by `@capacitor/filesystem` |
| `kotlinx-coroutines-core` | as resolved by Gradle | Apache-2.0 | Used by `@capacitor/filesystem` |

## Build and test only (not shipped)

| Package | Version | Licence | Use |
| --- | --- | --- | --- |
| `typescript` | 6.0.3 | Apache-2.0 | Types. 7.0.2 is newer, but `typescript-eslint` supports up to 6.0. |
| `vite`, `@vitejs/plugin-react` | 8.4.0, 6.3.0 | MIT | Build and dev server |
| `vitest` | 5.1.2 | MIT | Unit and property tests |
| `fast-check` | 4.11.0 | MIT | Property tests over random games |
| `fake-indexeddb` | 6.2.8 | Apache-2.0 | IndexedDB in unit tests |
| `@playwright/test` | 1.65.1 | Apache-2.0 | End-to-end tests and screenshots; also renders the icons |
| `eslint`, `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `globals` | 10.15.0, 10.0.1, 8.74.0, 7.1.1, 17.14.0 | MIT | Lint |
| `tsx` | 4.23.15 | MIT | Runs the TypeScript scripts (ladder, lesson lint) |
| `@capacitor/cli` | 8.6.3 | MIT | `cap sync` for the Android project |
| `@types/react`, `@types/react-dom`, `@types/node` | 19.3.3, 19.3.0, 22.20.7 | MIT | Type definitions |
| `fontkit` and `@fontsource/shippori-mincho-b1` | 3.0.0, 5.3.0 | MIT, SIL OFL 1.1 | Used once by `scripts/shogi-glyphs.mjs` to turn the shogi kanji into SVG paths; installed with `--no-save` when the script is run, so not in `package.json` |
| `fontkit` and `@fontsource/lxgw-wenkai-tc` | 3.0.0, 5.3.1 | MIT, SIL OFL 1.1 | Used once by `scripts/mahjong-glyphs.mjs` to turn the mahjong tile characters into SVG paths; installed with `--no-save` (or in another folder, `GLYPH_MODULES`) when the script is run, so not in `package.json` |
| `syanten` | 1.6.0 | MIT | Mahjong: a second shanten (tiles from ready) and acceptance calculator; the tests check ours against it on thousands of random hands (milestone 9). Not shipped |
| `@sabaki/go-board` | 1.4.3 | MIT | Go: a second implementation of the rules; the tests check our captures, legality and handicap points against it (milestone 6) |
| `pokersolver` | 2.1.4 | MIT | Hold'em: a second hand evaluator; the tests check our seven-card evaluator against it on thousands of random showdowns (milestone 5). Not shipped |
| `@sabaki/sgf` | 3.5.0 | MIT | Go: a second SGF parser; the tests check that it reads our SGF files the same way. Not shipped: it needs Node's `fs` and optional encoding libraries, so the app has its own small reader and writer (`src/games/go/sgf.ts`) |
| Android Gradle Plugin, Gradle | 8.13.0, 8.14.3 | Apache-2.0 | Builds the APK (from the Capacitor template) |

## Data shipped in the app

| Data | Licence | Use |
| --- | --- | --- |
| Lichess puzzle database (`lichess_db_puzzle.csv.zst` from database.lichess.org, file of 2026-11-11), 5,820 puzzles chosen on 2026-11-27 by `npm run import:puzzles` | CC0 1.0 (public domain dedication), as stated on the download page: "Database exports are released under the Creative Commons CC0 license" | Chess problems: tactics by theme, checkmates and endgames (`src/games/chess/practice/lichess-puzzles.json`). Every line was replayed through the rules on import. Attribution is not required, and is given anyway in the app and in `licenses/Lichess-puzzles-CC0.txt` |

All chess lesson text and positions are original to this app. Brisca and Dominoes lessons,
problems and drills are original too: their positions are generated by the app's own bots and
proved by its own solvers. The rules documents cite the pages they were checked against (pagat.com,
Wikipedia, Caribbean Trading); no text was copied from them.

The shogi mate problems (`src/games/shogi/practice/problems.json`) are generated by the app's own
engine from its own games (`scripts/shogi-problems.ts`) and proved by its mate search; the shogi
lessons, positions and drills are original to this app.

Go problems (`src/games/go/practice/problems.json`) are generated by this app from numbered seeds
(`scripts/go-problems.ts`) and proved by its own solvers; no problem collection is used. All Go
lesson text and positions are original. The Go playouts use the 3×3 shape patterns published with
the MoGo program (Gelly, Wang, Munos and Teytaud, 2006), written out from that description; no
code from any other Go program is used.

## Art and sound

All art is original and drawn as vectors for this app: the app icon (`assets/icon.svg`), the game
glyphs on the shelf, the interface icons, the noughts-and-crosses board, the chess set
(`src/kits/board/chess-pieces.tsx`), the Go board and stones (`src/kits/board/IntersectionBoard.tsx`),
the Spanish deck and card backs (`src/kits/cards/spanish.tsx`), the domino tiles and backs
(`src/kits/tiles/domino.tsx`), the French deck, card backs and chips (`src/kits/cards/french.tsx`,
`src/kits/chips/ChipKit.tsx`), the poker starting-hand table (computed by
`scripts/generate-holdem-preflop.ts`), and the shogi pieces, their symbol faces and movement marks
(`src/games/shogi/ui/pieces.tsx`; only the kanji outlines come from the font above), and the mahjong
tiles: faces, backs, the coins, bamboo sticks and bird, the white dragon's frame, the flower marks
and the learner overlay (`src/games/mahjong/ui/tiles.tsx`; only the Chinese characters come from
the LXGW WenKai TC outlines above). Sounds are synthesised
in the app with the Web Audio API; there are no sound files.

## Looked at for milestone 15, not used

- `katago-web` 1.0.0 (MIT): its parser and TensorFlow.js model were read to check our reading of
  KataGo's file format. It needs TensorFlow.js or ONNX Runtime and a network from
  katagotraining.org (refused by the build environment's network policy), so the app runs the
  small network with its own forward pass instead. Not shipped.
- `onnxruntime-web` 1.31.1 (MIT): about 150 MB unpacked, with WebAssembly files of several MB;
  not needed for a six-block network. Not installed.

## Coming later

The plan's later dependencies are added in the milestones that need them, each with a line here:
`pokersolver` arrived with milestone 5, the Sabaki Go packages with milestone 6, `tsshogi` with
milestone 8 and `syanten` with milestone 9 (above). `riichi`, the second scorer for Riichi, comes
with milestone 11.

**Stockfish and Fairy-Stockfish are GPL-3.** Each runs as separate worker files behind the
`Engine` interface (`src/ai/uci.ts`). For a personal app that is fine. If this app is ever
published, either publish its source under a GPL-compatible licence or switch Chess to a built-in
engine and drop shogi level 8 (PLAN.md 2.1); shogi's built-in engine stays the default. No other
GPL library is used, so that choice stays open.
