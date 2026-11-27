# Third-party software

Every dependency of Kibitz gets a line here (PLAN.md 2.1). Versions are the ones in
`package-lock.json` on 2026-11-27, milestone 0. "Shipped" means it ends up inside the app or the
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
| Stockfish 19 (`stockfish`, lite single-threaded build) | 19.0.1 | GPL-3.0 | Chess engine for CPU levels and the coach. Only `stockfish-19-lite-single.js` and `.wasm` ship, as `engines/`. Licence: `licenses/Stockfish-GPL-3.0.txt`; source: github.com/nmrugg/stockfish.js and github.com/official-stockfish/Stockfish |
| Inter (`@fontsource-variable/inter`) | 5.3.0 | SIL OFL 1.1 | Text font, Latin and Latin Extended. Licence: `licenses/Inter-OFL.txt` |
| Fraunces (`@fontsource-variable/fraunces`) | 5.3.0 | SIL OFL 1.1 | Heading font, Latin and Latin Extended. Licence: `licenses/Fraunces-OFL.txt` |

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
| Android Gradle Plugin, Gradle | 8.13.0, 8.14.3 | Apache-2.0 | Builds the APK (from the Capacitor template) |

## Art and sound

All art is original and drawn as vectors for this app: the app icon (`assets/icon.svg`), the game
glyphs on the shelf, the interface icons, the noughts-and-crosses board and the chess set
(`src/kits/board/chess-pieces.tsx`). Sounds are synthesised
in the app with the Web Audio API; there are no sound files.

## Coming later

The plan's later dependencies (`tsshogi`, the Sabaki Go packages, `ts-fsrs`, and the test
oracles) are added in the milestones that need them, each with a line here.

**Stockfish is GPL-3.** It runs as a separate worker file behind the `Engine` interface
(`src/ai/uci.ts`). For a personal app that is fine. If this app is ever published, either publish
its source under a GPL-compatible licence or switch Chess to a built-in engine (PLAN.md 2.1). No
other GPL library is used, so that choice stays open.
