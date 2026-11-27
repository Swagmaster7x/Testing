# Kibitz progress

Last updated 2026-11-27, at the end of milestone 0. The plan is `PLAN.md`; this file says what
has been built, what was decided along the way, and what is still open.

## Milestones

- [x] **M0. Foundation** (2026-11-27)
- [ ] M1. Chess: play
- [ ] M2. The learning loop, on Chess. Then stop for Swag's feedback.
- [ ] M3. Cards and Brisca (2 players)
- [ ] M4. Dominoes
- [ ] M5. Texas Hold'em
- [ ] M6. Go
- [ ] M7. Chinese Checkers
- [ ] M8. Shogi
- [ ] M9. Mahjong I: the shared engine, and Hong Kong style to play
- [ ] M10. Mahjong II: teach it (all eight launch games complete here)
- [ ] M11. Mahjong III: Riichi
- [ ] M12. Card variants A
- [ ] M13. Classic card pack
- [ ] M14. More tile styles (one style per sitting)
- [ ] M15. Stronger engines
- [ ] M16. Table tools, polish, release

Next up: **M1, Chess: play.**

## M0. Foundation

- [x] `tabletop/` scaffolded with `npm run check`, `npm run e2e`, `npm run ladder` and `npm run apk` (README.md lists every command)
- [x] Design tokens: the club room look (`src/styles/tokens.css`), Fraunces for headings, Inter for text, tabular numerals
- [x] TableShell with the coach rail: status bar (game, level, score, turn, menu), play surface, player panel, rail with moves, counters and log; the rail collapses and can sit on the left
- [x] Today: focus games (up to three) and the session card, which says plainly that nothing is due yet
- [x] Games shelf grouped as Cards, Boards and Tiles; all eight launch games show as coming, with the milestone they arrive in
- [x] Game hub with the four doors (Learn, Practice, Play, Review), the reference card and an "add to focus" switch
- [x] Progress: lessons, problems, play rating and table-ready columns per game, and the five-item table-ready checklist
- [x] Tools: shows what is coming (scorepads, blind timer, score calculators)
- [x] Settings: profiles, coach rail side, motion, sound, look, backup, the foundation check, about and third-party software
- [x] Profiles: add, switch, rename, delete (with everything they own); no accounts
- [x] Backup: Export writes everything to one JSON file with a format version; Import checks it, asks, then replaces everything in one transaction
- [x] `core/`: the game contract, seeded random numbers, records (config + seed + actions + rules version), replay, the animation queue
- [x] `ai/`: alpha-beta with iterative deepening, a transposition table and a node budget; the bot worker and its host (only a seat's view is ever sent); ladders
- [x] The noughts-and-crosses fixture (not on the shelf) proves play against a worker bot, save and resume, replay and the animation queue
- [x] Offline install: a service worker precaches every file; tested by going offline, reloading and playing against the bot
- [x] Capacitor wrapper builds a debug APK that opens in landscape, signed with the fixed key in the repo

### Gate

| Check | Result |
| --- | --- |
| `npm run check` | Green: both type-checks, lint (no warnings), 93 unit tests, 5 property tests over random games (60 to 400 games each), lesson lint |
| `npm run e2e` | Green: 52 tests. The shell, the fixture game and review run at 844×390, 1180×820 and 1440×900; offline and backup run once at 844×390; one run captures screenshots |
| Fixture played end to end at 844×390 | Yes: a whole game against the CPU, then every move stepped through in review; also resume after closing, resign, and a game against the CPU while offline |
| `npm run ladder` | Green: L1 beats random 0.835, L2 beats L1 1.000, L3 beats L2 0.645 (58 wins, 142 draws, no losses), 200 games per rung |
| APK | Built: `out/kibitz-0.1.0-debug.apk`, 5.5 MB. Package `com.personal.kibitz`, versionCode 100, target SDK 36, activity locked to `sensorLandscape`, v2 signature from `android/app/signing/debug.keystore` (SHA-256 `b6379266…edbabc`), the script checks the signature on every build |
| Screenshots | Looked at all fifteen, fixed what looked wrong, sent to Swag |

Fixed after looking at the screenshots and play-throughs: a square still waiting to be animated was
announced as empty to screen readers; quick stepping in review queued up a backlog of animations;
the coach rail's log scrolled the move list out of view; the W/D/L tally missed the game that had
just ended; the "+" in Add buttons shrank to a dot; card titles on Today did not line up; and the
offline app failed to load its scripts because the server's `Vary: Origin` header stopped the
cache from matching (the service worker now ignores `Vary`).

## What is where

- `src/core/contract.ts` is the contract from PLAN.md 2.3, plus `rulesVersion`, `defaultConfig`,
  a JSON codec for the config and an optional event type parameter. Resigning is handled by the
  shell, not as a game action.
- `src/games/noughts/` is the fixture: rules, three CPU levels, reference card and board.
  `docs/rules/noughts.md` has its rules, golden cases and levels.
- `src/store/db.ts` is schema version 1 with every table from PLAN.md 2.8 (profiles, settings,
  game records, lesson progress, problem attempts, review cards, ratings) plus a small `device`
  table for the active profile. New versions go in the `VERSIONS` list with an upgrade step.
- Links: `#/today`, `#/games`, `#/games/<game>`, `#/games/<game>/reference`, `#/play/<record>`,
  `#/review/<record>/<move>`, `#/progress`, `#/tools`, `#/settings`. On a hub, `?seed=<text>` fixes
  the next game's seed, which the end-to-end tests use.
- Screenshots are written to `screenshots/m0/` by `npm run e2e` and the APK to `out/`; neither is
  committed.

## Decisions made in M0 (flip any of them)

1. **TypeScript 6.0.3, not 7.0.2.** 7.0.2 is the newest, but `typescript-eslint` supports only up
   to 6.0. Every other package is at its current stable version.
2. **Playwright 1.65.1 with the environment's Chromium.** The installed browser belongs to an
   older Playwright, so the config uses `/opt/pw-browsers/chromium` when it exists (PLAN.md 2.11).
3. **One name string.** `brand.json` holds "Kibitz"; the page title, install manifest, interface
   text and Android label read it. The Android app id `com.personal.kibitz` never changes, so a
   renamed build still installs over the old one. The backup format id is `tabletop-backup` for
   the same reason.
4. **The test table lives in Settings → Foundation check** (and at `#/games/noughts`), so it is
   off the shelf but still playable on the phone.
5. **Fixture CPU levels.** Level 1 looks one move ahead (takes a win, misses your threats), level 2
   looks two ahead (blocks, falls for forks), level 3 searches to the end and prefers moves that
   set fork traps. A ladder rung passes at a 0.6 share.
6. **Full screen on Android.** The status and navigation bars are hidden and come back briefly with
   a swipe. Notches are handled by Capacitor's SystemBars plugin, which passes the cut-out size to
   the page as safe-area insets. `sensorLandscape` allows either landscape direction.
7. **Export in the APK uses the Android share sheet** (Capacitor Filesystem and Share plugins),
   because the Android WebView cannot download a file the way a browser does. In a browser it is
   an ordinary download. Import uses the file picker in both.
8. **The INTERNET permission stays** in the Android manifest, as in Capacitor's template. The app
   makes no requests: a lint rule bans `fetch`, `XMLHttpRequest`, `WebSocket` and `EventSource` in
   app code, and every end-to-end test fails if the page asks for anything outside the app.
9. **Android SDK 36**, the Capacitor 8 template's default, with its Android Gradle Plugin 8.13.0
   and Gradle 8.14.3. Gradle fetched platform 36 and build-tools 35 by itself.
10. **Fonts and sound.** Inter and Fraunces (both OFL) are bundled, Latin and Latin Extended only.
    Sounds are synthesised with Web Audio; there are no sound files. Sound is on by default.
11. **Lesson lint** is part of `npm run check` but has nothing to check until M2 builds the lesson
    runner and linter. It fails if lesson files appear before that.
12. **Daylight look** shows in Settings as coming with the polish milestone, as the plan says.
13. **Default profile name** is "Player 1"; rename it in Settings.

## Not done, or not checked

- **The APK has not been run on a device.** There is no emulator or KVM here. It was built,
  signed and inspected (package, version, landscape lock, signature, bundled files). On the phone,
  please check: it opens in landscape, the bars stay hidden, nothing sits under a notch, a game
  against the CPU plays, a game resumes after closing the app, Export opens the share sheet and
  Import reads the file back, and a later build installs over this one without losing games.
- No fallback was needed: Capacitor worked, so the Trusted Web Activity route was not tried.
- No blocked hosts mattered for M0. M2 needs `database.lichess.org` for chess problems.
- Still open from the plan, and not blocking: which of these games Swag already plays.

## Versions (from `package-lock.json`, 2026-11-27)

React 19.3.1, Vite 8.4.0, @vitejs/plugin-react 6.3.0, TypeScript 6.0.3, Zustand 5.1.0,
Dexie 4.4.7, Capacitor 8.6.3 (Filesystem 8.1.5, Share 8.0.3), Vitest 5.1.2, fast-check 4.11.0,
fake-indexeddb 6.2.8, Playwright 1.65.1, ESLint 10.15.0, typescript-eslint 8.74.0,
eslint-plugin-react-hooks 7.1.1, tsx 4.23.15, Inter 5.3.0, Fraunces 5.3.0. Node 22, Java 21.
Every package and its licence is in `THIRD-PARTY.md`.

## Notes for M1

- Chess goes in `src/games/chess/` with `rules.ts` (chess.js behind the contract), `bots.ts`
  (Stockfish worker behind an `Engine` interface), `levels.ts`, `ui/` and `reference.ts`, then an
  entry in `src/games/registry.ts`, `src/games/bots-index.ts` and `src/games/ladders.ts`, and
  `playable: true` in `src/games/catalog.ts`.
- BoardKit (grid, coordinates, legal dots, drag) belongs in `src/kits/`; the noughts board is a
  one-off and does not need to move there.
- Copy Stockfish's lite single-threaded files into `public/engines/`; the service worker
  precaches everything in `public/`.
- Add `docs/rules/chess.md` before coding, and a line per new package in `THIRD-PARTY.md`.
