# M15. Stronger engines, and three trainers

Built in its own checkout (worktree branch `worktree-agent-a57e67a8dead9c90c`, base `b6bba74`), to be
folded into `PROGRESS.md` at the merge. The plan's entry: time-boxed trials of Fairy-Stockfish for
shogi and a small KataGo network for Go, each with a written result; then a chess opening trainer, a
shogi castle trainer and Go joseki basics; the built-in engines stay where a trial fails.

## Results in one line each

- **Trial 1, Fairy-Stockfish for shogi: works in the web app, cannot work in the APK.** The page is
  made cross-origin isolated (preview and dev servers send COOP and COEP; on any other host the
  service worker adds them from the second visit). Shogi gains **level 8** (Fairy-Stockfish at
  150,000 nodes, one thread) and **strong review analysis**, both offered only where the page is
  isolated. Android's WebView supports neither `Cross-Origin-Opener-Policy` nor `SharedArrayBuffer`,
  so in the APK the level is not offered and the built-in engine stays (expected from the
  compatibility data; not run on a device).
- **Trial 2, KataGo for Go: works everywhere, through our own small forward pass.** The b6c96 test
  network from KataGo's own repository (MIT), halved to 16-bit weights (2.0 MB), runs in the bot
  worker in plain TypeScript. The Go review gains a **Position** panel: the lead, each side's
  chances, the ownership map on the board and a graph of the lead over the game. Neither
  `katago-web` nor `onnxruntime-web` is used (reasons below).
- **Trainers:** 31 chess openings (Lichess names, CC0), 9 shogi castles built from the start, 5 Go
  joseki on the full board; each as stage-4 lessons, a "next move" drill and a practice set whose
  lines go straight into the spaced-review queue.

## Trial 1: Fairy-Stockfish for shogi

**The package.** `fairy-stockfish-nnue.wasm` 1.1.12 (GPL-3.0): `stockfish.js` (an Emscripten
factory, not a worker), `stockfish.worker.js` (its search threads) and `stockfish.wasm` (1.6 MB,
SIMD, shared memory of 128 MB to start). No NNUE network ships; for shogi the engine falls back to
its own evaluation. It speaks USI (`usi`, `position sfen ...`, `go nodes ...`) and also plays
mini-shogi, but the app keeps 5×5 on the built-in engine.

**Wiring.** The three files ship unmodified under `engines/fairy-stockfish/`, started by our own
classic worker `host.js` (`scripts/engines/fairy-stockfish-host.js`), which the bot worker starts
as it starts Stockfish for chess; text lines both ways, so the GPL code stays in separate files
behind the `Engine` interface. `src/ai/uci.ts` learnt the USI words (`usi`, `usinewgame`,
`position sfen`, `USI_MultiPV`...), an `error ...` line from a host that cannot start, and
`bestmove resign`. `src/games/shogi/strong.ts` turns USI moves into the app's moves;
`shogiBotsWith(strong)` adds level 8 and answers `analyse` with `engine: 'strong'`; if the engine
fails to start, both fall back to the built-in engine and it is not tried again.

**Isolation, proven in Chromium** (`/opt/pw-browsers/chromium`, Playwright):

| Set-up | `crossOriginIsolated` | Engine |
| --- | --- | --- |
| Preview server sending COOP `same-origin` and COEP `require-corp` | true | `bestmove` legal at once |
| Plain static server, no headers, no service worker | false | `SharedArrayBuffer is not defined` |
| Plain static server, service worker, first visit | false | refused |
| Plain static server, service worker controlling, after a reload | **true** | `bestmove` legal |

The service worker (`scripts/sw-template.js`) now adds COOP, COEP and CORP to every response it
serves, cached or fetched (the "coi-serviceworker" technique). The app does not reload itself on the
first visit: level 8 simply appears from the next start. `tests/e2e/strong-engines.spec.ts` proves
the table above inside the app at three sizes: the engine answers `position sfen ...` / `go movetime
800` with a legal move in three positions, level 8 plays exactly the move the same build finds in
Node at 150,000 nodes, and on a header-less server level 8 is absent, the host refuses, then after
the service worker takes over the page is isolated and level 8 is offered.

**The APK.** Looked at, not run (no device or emulator here):

- Capacitor 8.6.3 has no setting for response headers. Its `WebViewLocalServer` builds each
  response with a fixed header map (`Cache-Control: no-cache`); adding headers would mean a custom
  `WebViewClient` in `MainActivity` wrapping `shouldInterceptRequest` (Java, untestable here, not
  written). AndroidX `WebViewAssetLoader` can return headers the same way.
- The service-worker route exists: Capacitor sets a `ServiceWorkerClient` that sends a service
  worker's fetches to its local server (`android.resolveServiceWorkerRequests`, on by default). The
  app does not register its service worker in the APK (`src/main.tsx`), but could.
- Neither route can make the WebView isolated. MDN's compatibility data (`@mdn/browser-compat-data`
  8.1.11) lists for WebView Android: `Cross-Origin-Opener-Policy` **not supported**,
  `SharedArrayBuffer` **not supported**, WebAssembly threads and atomics **not supported**
  (`crossOriginIsolated` exists from 87 but cannot become true without COOP). Chrome for Android
  supports all three, so an installed PWA in Chrome gets level 8.
- **Expected in the APK:** level 8 is not offered, review uses the built-in engine, nothing else
  changes. The 1.7 MB of engine files still ship inside the APK, unused; `scripts/apk.mjs` could
  drop `dist/engines/fairy-stockfish/` before `cap sync` (not done: no APK may be built here).

**Strength.** Ladder (`LADDER_LEVELS=7,8 npm run ladder -- shogi 10`, seats alternating): level 7
beat random 10-0, **level 8 beat level 7 10-0** (852 s in all). Level 8's nominal rating is set at
1900 (300 above level 7, cautiously: ten games say only "much stronger"). In Node one thread
searches about 190,000 nodes a second, so 150,000 nodes is under a second here and about two to
three seconds on a mid-range phone's Chrome (estimated, not measured).

**Scores.** Fairy-Stockfish's centipawns and the built-in engine's units were compared on 37
positions from six games, both at 60,000 nodes: a fit through the origin gives 1.02 (correlation
0.75), so review uses the same winning-chances scale for both (`STRONG_TO_ENGINE = 1`).

**Every page under COEP.** The preview server sends the isolation headers, so the whole end-to-end
suite (every game, the engines, fonts, workers, the service worker, backup files) ran isolated;
results under "Tests". All the app's files are same-origin, and nothing was blocked.

## Trial 2: KataGo for Go

**What `katago-web` 1.0.0 contains** (MIT, 2.7 MB unpacked): TypeScript for a KataGo search, a
"Pattern C" coordinator that runs KataGo 1.18.1 compiled to WebAssembly (`katago.wasm`, 758 KB,
JSPI and pthreads, so it too needs isolation and a recent browser) with ONNX Runtime on WebGPU, and a
legacy TensorFlow.js path. It ships **no network**: its default manifest points at a 64.6 MB ONNX
file under a test path, and its other URL is a 100 MB b18 network on media.katagotraining.org. It
depends on `onnxruntime-web`, `@tensorflow/tfjs` (with WASM and WebGPU back ends) and `pako`.

**Hosts.** katagotraining.org and media.katagotraining.org, huggingface.co, unpkg.com and
cdn.jsdelivr.net were refused by this environment's network policy (proxy 403). The npm registry
and raw.githubusercontent.com were reachable, and KataGo's own repository carries a small test
network, `cpp/tests/models/g170-b6c96-s175395328-d26788732.bin.gz` (3.8 MB, model version 8, six
blocks of 96 channels), under the repository's MIT licence.

**Decision: our own forward pass instead of `katago-web` or `onnxruntime-web`.** A six-block net
needs no runtime: `src/games/go/net/` reads KataGo's `.bin` format (versions 8 to 10, ordinary and
global-pooling blocks), builds KataGo's 22 input planes and 19 global inputs (stones, liberties,
ko, the last five moves, komi, the rules), and runs the trunk, policy and value heads in plain
TypeScript at the board's own size (zeros beyond the edge, as KataGo's mask gives). ONNX Runtime
would add many megabytes of WebAssembly and a converted network we could not make here; TensorFlow
.js the same. The format and the pooling details were checked against `katago-web`'s parser and
model (MIT); none of its code is copied or shipped.

**Size.** `scripts/katago-net.ts` (`npm run katago:net -- <file.bin.gz>`) rewrites the network with
16-bit weights (`@F16@` arrays): 4.12 MB to **2.06 MB**; the largest change it measured on four
positions was 0.03 points of winning chances, 0.01 points of lead and 0.000 of ownership. The file is
committed as `assets/katago/g170-b6c96-f16.bin` and copied to `engines/katago/` at build time.

**Is it right?** On an empty 9×9 board its favourite is the centre (E5) at 51% for Black with komi 7;
on 19×19 the four 4-4 and 3-4 points; a split 9×9 board is shaded half and half, and a lone black
stone inside White's area is counted White's (`tests/unit/go-net.test.ts`).

**Speed.**

| Where | 9×9 | 19×19 |
| --- | --- | --- |
| Node on the build machine | 28 ms | 128 ms |
| Chromium, bot worker, processor slowed 4× through the DevTools protocol (page and worker) | | **634 ms** |
| Chromium, first reading including starting the worker and loading the network | | 3.75 s |

So a 60-move 9×9 game is read whole in a few seconds even on a slow phone, and a 19×19 position in
well under a second. The panel reads the position on the board first, then the rest of the game for
the graph, one question at a time.

**In the review.** "Show score and ownership" in the Go review's new Position section (off by
default): "Black leads by 3.5", "Chances: Black 64%, White 36%", owned points shaded on the board,
and a graph of the lead over the whole game (tap it to go to a move). The answer is a guide: the net
reads one position without searching, and the panel says so.

## Trainers

All three are data played on the game's own rules through one shared module, `src/teach/lines.ts`:
a `StudyLine` (name, one-sentence idea, start, moves, the side whose plan it is) becomes

- **lessons** for Learn, stage 4 ("Advanced"): each line named with its idea, played through, then a
  quiz asking each line's key move from memory;
- a **drill**, "next move": a random line at a random point, either side's move, the idea shown
  once answered;
- a **practice set** of problems: the student plays their side's moves from memory and the other
  side answers; every finished line goes **straight into the review queue** (FSRS, graded by the
  try: right first time without a hint is "good", anything else "again"), so the lines come back
  on the spaced-review schedule in Practice and Today. These sets move no rating.

| Trainer | Lines | Lessons (stage 4) | Drill | Set |
| --- | --- | --- | --- | --- |
| Chess openings (`src/games/chess/openings.ts`) | 31: 9 open games, 9 against e4, 10 against d4, 3 flank | 10, of three or four openings | Next move in the opening | Openings, with chips Open games / Against e4 / Against d4 / Flank openings |
| Shogi castles (`src/games/shogi/castles.ts`) | 9: Mino, High Mino, Silver Crown, Ranging Rook Anaguma, Gold Yagura, Static Rook Anaguma, Boat, Elmo, Crab | 4 | Next move of the castle | Build a castle, chips Ranging Rook / Static Rook castles |
| Go joseki (`src/games/go/joseki.ts`) | 5: 4-4 point 3-3 invasion; 4-4 low approach, attach and stand; 3-4 low approach, attach and extend; 3-4 low approach, diagonal answer; 3-4 high approach, attach underneath | 2 | Next move of the joseki | Joseki, chips On the 4-4 / On the 3-4 point |

**Chess.** Names, ECO codes and moves are the Lichess opening list's (lichess-org/chess-openings,
CC0, fetched from raw.githubusercontent.com); each line is the list's own line for the name. Every
move is replayed through chess.js when the lines are built and in the tests. The 31 ideas are
original sentences. White's openings are asked from White's side, defences from Black's (White's
first move plays itself).

**Shogi.** Every castle is built from the standard start with White answering sensibly (a Static
Rook Boat against Black's Ranging Rook castles, a Ranging Rook Mino against the Static Rook ones, a
mirror Yagura against the Yagura). The tests play every move through the rules and check each final
shape square by square (`K28 S38 G49 G58` for the Mino, `K19 L18 S28 G39 G38 N29` for the Ranging
Rook Anaguma, and so on). Shapes were checked against the English Wikipedia castle articles; the
move orders are the app's own. The old castle drill (name the castle, bring the king home) stays.

**Go.** Written by hand on the full 19×19 board, upper-right corner. Joseki memory is the riskiest
content here, so each answer is also checked against the shipped network: with the other three
corners taken (so the corner is where play belongs), every move after the corner stone and the
approach is among the network's top three choices in that corner (`tests/unit/trainers.test.ts`).
Names describe what happens ("low approach, attach and extend") rather than claim a catalogue name.

## Decisions

1. **Level 8 only where it can run.** The level list is built when the shogi interface loads
   (`strongEngineAvailable()`: isolation, shared WebAssembly memory and SIMD). No setting: an
   isolated page simply has one more level, and review uses the strong engine there.
2. **No automatic reload for isolation.** The coi-serviceworker technique usually reloads the page
   once when the service worker takes over; that would disturb a first visit (and the tests), so
   the app waits for the next start instead.
3. **One thread, node budgets.** Level 8 searches 150,000 nodes on one thread, so a position always
   gets the same move (the e2e test checks the app's move against Node's), as with every level.
4. **No repetition history to the strong engine.** It gets the current position only; the rules
   still settle repetitions.
5. **Our own KataGo forward pass**, 16-bit weights, the small test network, as above.
6. **"Funabikigyoku"** in the request is taken to mean the Boat castle, *funagakoi* (舟囲い); no
   castle of that exact name could be found.
7. **Trainer sets are unrated and self-reviewing** (`PracticeSetDef.review: 'auto'`, `rated:
   false`); a line problem carries its name and idea (`Problem.title`, `Problem.note`), shown in the
   problem panel. The definition of done's "100 or more items" is met by the generated drills; the
   sets hold the lines to learn by heart.
8. **Stage 4.** The trainers' lessons go into each game's stage 4, "Advanced", which was empty for
   all three.

## Shared files changed (small, listed for the merge)

- `src/ai/uci.ts`: the USI dialect, `error` lines, `bestmove resign`. Chess's UCI behaviour is
  unchanged (`UciEngine(transport)` defaults to UCI).
- `scripts/sw-template.js`: isolation headers on every response. `vite.config.ts`: `server` and
  `preview` headers, the new engine files. `scripts/vite-plugin-engines.ts`: optional headers.
  `eslint.config.js`: worker globals for `scripts/engines/*.js`. `package.json`: the
  `fairy-stockfish-nnue.wasm` dependency and `npm run katago:net`.
- `src/games/types.ts`: optional `GameReviewSupport.Insight` and `ReviewInsightProps`.
  `src/shell/table/ReviewScreen.tsx`: renders it in a "Position" rail section, its overlay added to
  the review's own. Only Go has one.
- `src/teach/problem.ts` (`title`, `note`), `src/games/practice.ts` (`review`, `rated`),
  `src/shell/practice/ProblemScreen.tsx` (shows them; automatic review cards; no rating line for
  unrated sets), `src/styles/learn.css`; new `src/teach/lines.ts`.
- `src/games/bots-index.ts` (shogi and Go loaders), `src/games/ladders.ts` and `scripts/ladder.ts`
  (an optional strong shogi engine).
- Text: `src/text/en.ts`, `en-learn.ts`, `es/base.ts`, `es/learn.ts` (chess and shared strings);
  shogi and Go game files with their Spanish. Shelf lines for chess, shogi and Go now name the
  trainers.
- `src/shell/third-party.ts`, `THIRD-PARTY.md`, `licenses/` (Fairy-Stockfish GPL-3.0, KataGo MIT,
  Lichess openings CC0).
- `tests/e2e/a11y.spec.ts`: the Progress scan waits for the screen to load.
- Tests that counted things: `tests/e2e/learning.spec.ts` (chess lesson total),
  `tests/unit/learning.test.ts`, `go-practice.test.ts`, `shogi-practice.test.ts` (the new sets are
  not generated, and line problems are not mate problems).

Nothing in Mahjong, Tute or Dominoes was touched.

## Tests

- New: `tests/unit/shogi-strong.test.ts` (9: the USI dialect, refusals, level 8 and strong analysis
  on the real engine, mini-shogi stays built-in, fallback), `tests/unit/go-net.test.ts` (6),
  `tests/unit/trainers.test.ts` (9: every line legal, shapes, the network check for joseki, every
  problem solvable, drills), `tests/e2e/strong-engines.spec.ts` (3), `tests/e2e/go-net.spec.ts`
  (2), `tests/e2e/trainers.spec.ts` (4), `tests/e2e/screens-m15.spec.ts` (4).
- `npm run check`: green. Types, lint, **736 unit tests** in 61 files, 56 property tests in 10
  files, and the lesson lint (chess 47 lessons, shogi 39, Go 30, every other game unchanged).
- **End to end**, `npm run build` then `E2E_PORT=4991 npx playwright test --workers=3`: 410 tests
  at 844×390, 1180×820 and 1440×900 plus the screenshot runs, every one under the isolation headers:
  **396 passed**, 11 skipped by design, 3 failed:
  - `a11y.spec.ts`, the main screens: axe found the Progress screen's table scrollable with nothing
    focusable for the moment before its rows become buttons; loading every game's lessons (now with
    the trainers) made that moment outlast the scan's fixed wait. The trainers' lines now replay once
    (chess's from chess.js, checked equal to the rules), so building the chess lessons went from
    about 275 ms to 2 ms in Node, and the scan now waits for Progress to load: 9 of 9 pass.
  - `poker.spec.ts`, pass and play: a timeout under load; passes when run again.
  - `screens.spec.ts` (milestone 0 screenshots) expects 8 games on the shelf, but the shelf has had 12
    since M13. It fails on the base commit too; not touched here.
  - The M15 specs (strong engines, Go network, trainers, screenshots) all passed at every size, and
    again after the last changes. Under the full suite's load the throttled 19×19 reading took 610 ms.

## Screenshots (`screenshots/m15/`, 844 × 390 at twice the pixels), all looked at

01 shogi level 8 in the New game dialog; 02 a level-8 game; 03 and 04 the Go review's score and
ownership on 9×9 with the lead graph; 05 the same on 19×19; 06 and 07 an opening played from memory,
then solved with its idea; 08 the Openings set in Practice; 09 the opening drill; 10 Learn chess,
stage 4; 11 and 12 an opening lesson (idea, quiz); 13 and 14 building the Mino, the Boat solved; 15
the castle drill; 16 and 17 the Mino-family lesson; 18 the castle set in Practice; 19 to 22 a joseki
problem, solved, the joseki drill, the 3-4 lesson; 23 the third-party list with the new entries.

Fixed after looking: the trainer sets showed a problem rating in the header though they move none
(now the number of lines); a line's second hint now gives its idea; the Learn screenshot needed the
Advanced tab; the third-party list had to be opened.

## Not done, or open

- **Nothing was run on an Android device**; the APK conclusion rests on Capacitor's source and MDN's
  compatibility data. The 1.7 MB of Fairy-Stockfish files are dead weight in the APK until
  `scripts/apk.mjs` leaves them out.
- **Level 8's rating** rests on ten games; its phone speed is estimated from Node's speed.
- **No NNUE network** for Fairy-Stockfish (none on npm; its download hosts were not tried, since the
  engine is already far stronger than level 7).
- **The Go network does not search**, and on 19×19 its opening judgment is that of an early, small
  network. Ladder and pass-alive input planes are left empty. A bigger network (katagotraining.org)
  was not reachable.
- **Go's CPU levels are unchanged**: the network is used for review only, not for play.
- **Chess openings** are short main lines; no sidelines or traps, and no move-order tolerance (a
  transposition counts as wrong).
- **Castle and joseki move orders are one each**; the drill asks exactly that order.
- `PROGRESS.md` is not touched; this file is for the merge.
