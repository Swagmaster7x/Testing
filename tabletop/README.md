# Kibitz

Learn and practise card, board and tile games, offline. The build plan is in `PLAN.md`; what has
been built so far, and what is open, is in `PROGRESS.md`.

It is a TypeScript web app (React, Vite) packaged as an Android APK with Capacitor. Nothing here
touches the Yoked app in the repository root.

## Commands

Run them from this folder with Node 22.

| Command | What it does |
| --- | --- |
| `npm install` | Installs the exact versions in `package-lock.json` |
| `npm run dev` | Dev server at http://localhost:5173 |
| `npm run check` | Types, lint, unit tests, property tests, lesson lint (engine-checked; searches are cached) |
| `npm run e2e` | Builds, then runs the Playwright suite at 844×390, 1180×820 and 1440×900 and writes screenshots to `screenshots/m0/`, `m1/` and `m2/` |
| `npm run ladder` | The slow bot ladders (`npm run ladder -- noughts 400` for one game) |
| `npm run apk` | Builds the debug APK into `out/` |
| `npm run icons` | Redraws the web and Android icons from `assets/icon.svg` |
| `npm run import:puzzles` | Downloads the Lichess puzzle file (CC0) and picks the chess problems again (needs `database.lichess.org`) |

`npm run e2e` uses the Chromium at `/opt/pw-browsers/chromium` when it exists (the cloud build
environment); anywhere else run `npx playwright install chromium` once first. `npm run apk` needs
Java 21 and the Android SDK (`ANDROID_HOME`, or `/opt/android-sdk`); Gradle downloads anything
else it needs.

## Installing the APK

The APK is signed with the fixed debug key in `android/app/signing/`, so each new build installs
over the last one and keeps your games. Copy `out/kibitz-<version>-debug.apk` to the phone, open
it and allow installs from that source when Android asks.

## Renaming the app

The name is one string, `name` in `brand.json`. The web page, its install manifest, the interface
text and (on the next `npm run apk`) the Android label all read it. The Android app id
`com.personal.kibitz` stays fixed on purpose, so a renamed build still installs over the old one.

## Where things are

```
src/core/      game contract, seeded random numbers, records, replay, animation queue
src/ai/        alpha-beta search, bot worker and its host, ladders
src/games/     the shelf catalogue, game modules (noughts/ is the milestone 0 test game)
src/shell/     screens, table, coach rail, routing, interface state
src/store/     IndexedDB (Dexie) schema, profiles, settings, saved games, backup
src/text/      the message catalogue (English)
tests/         unit/, property/, e2e/
android/       the Capacitor Android project
docs/rules/    rules as implemented, per game
```
