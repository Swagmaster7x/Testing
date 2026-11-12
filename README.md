# Meal & Gym

A personal Android app (one phone, no accounts, fully offline) that plans the week's meals, shows the recipes, builds the shopping list, says which gym day it is, and runs a sauna timer. Built from [SPEC.md](SPEC.md).

Kotlin, Jetpack Compose, Material 3, Room, DataStore. Minimum Android 8 (API 26), targets Android 17 (API 37).

**Look:** a dark-fantasy theme inspired by the mood of Berserk. It uses original artwork only (no characters, symbols or text from the manga): black iron and blood red when the phone is in dark mode, aged parchment and ink in light mode, headings in Cinzel, cut-corner "armour plate" cards, and an original broadsword-and-red-moon app icon. The colours, fonts and shapes live in `ui/theme/Theme.kt`.

## Version 2 ([SPEC-V2.md](SPEC-V2.md))

- **Two sides.** The first launch shows two doors, "Swag's Side" and "Ashley's Side"; the phone remembers the choice and Settings can switch. Each side has its own theme, meal plan, gym days, history and settings; the recipe library and pantry list are shared. Upgrading keeps everything already on the phone as Swag's.
- **Ashley's Side.** An original Y2K glam look (pink to lilac, deep plum at night, Fredoka and Pacifico, glossy pink buttons, rhinestone dividers, star/heart/butterfly/flip-phone/lip-gloss motifs, sparkles that can be turned off). Her three gym days on Mon/Wed/Fri with badges on the week view, a Snack slot, her coffee-shop breakfast orders, "Make it easier to finish" tips, a daily guide shown as reference text only, and an optional creatine checkbox. No brand logos, characters or fonts are used.
- **Recipe library.** Protein tags, filters including a "Not chicken" chip that stays on, "Make it with..." protein swaps (the shopping list follows), "Fill my week" (never the same protein two dinners running), favourites, "Hide for now", recipe packs (import/export, same shape as `seed.json`), and eight new beef and pork recipes.
- **Shopping across sides.** "Just mine" or "Both of us" on the shopping list (Ashley's lunches and dinners count as about three-quarters of a serving), "Add to the other side too" on a planned meal, and a meal plan can be exported on one phone and imported on the other (there is no sync).
- **Exercise demos.** Each exercise shows a start photo; tapping it opens the start and end positions flipping like a GIF, with written steps. Photos and steps come from [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (public domain), bundled with `tools/exercise_demos.py` after reviewing `tools/exercise-match-report.md`. Three moves without a good photo get form cues instead, and every demo has a "Watch a demo" button that opens a web search in the phone's browser.

## Looks (version 3)

Settings > Look offers 15 ready-made looks and a creator for your own. Swag's dark fantasy and Ashley's Y2K glam are unchanged (hand-tuned colours, same fonts and decorations); the other 13 are Deep sea, Evergreen, Desert sunset, Neon arcade (always dark), Paper and ink, Cherry blossom, Matcha latte, Starlight (always dark), Citrus burst, Lavender fields, Coffeehouse, Track day and Glacier. "Create your own" picks a main and second colour, background tint, day/night, heading font, corners, backdrop, and extras (glossy buttons, sparkles, fun icons and wording), with a live day and night preview.

- Looks are data (`ui/theme/Looks.kt`). The new ones build their day and night colour schemes from a few seed colours (`ui/theme/Tones.kt`), nudging every text colour until it reaches WCAG AA contrast (4.5:1) on every surface it sits on. `LooksTest` checks all 15 looks and 300 random creator colour pairs.
- Fonts added for the new looks, all bundled with their licences in `licenses/`: DM Serif Display, Bebas Neue, Space Mono, Righteous (SIL Open Font License) and Special Elite (Apache 2.0). The look icons are original vector drawings (`res/drawable/ic_look_*.xml`).
- Database version 4 adds `Profile.customLook` (the creator's choices as JSON). Backups carry it; older backups restore without one.

## Two editions

The project builds two apps from the same code (Gradle product flavors):

- **personal**: the app on Swag's and Ashley's phones. Package `com.personal.mealgym`, fully offline, sideloaded. Everything above and below describes it.
- **store**: the Google Play version. Anyone sets up their own people on first launch (name, look, starter workout plan, training days, snack slot, portion size, recipe-tip style), there's no personal content, exercises get written form cues instead of photos, and it shows AdMob banners (after Google's consent prompt where the law requires it) with a one-time "Remove ads" purchase. It has its own package name, so it installs alongside the personal app and never touches its data.

Everything needed to publish the store edition is in [store-kit/](store-kit/README.md): a launch checklist, listing text, Data safety answers, a privacy policy and the store graphics. `tools/store_seed.py` builds the store's `seed.json` from the personal one, and `tools/form_cues.py` writes its exercise cues.

## Put it on your phone

You need `app-personal-debug.apk`, either the one from the Claude session or one you build (below).

- **With a cable:** turn on Developer options and USB debugging on the phone, plug it in, then run
  `adb install -r app/build/outputs/apk/personal/debug/app-personal-debug.apk`
- **Without a cable:** send the APK to yourself (Google Drive, email), open it on the phone, and allow "Install unknown apps" for the app you opened it from when Android asks.

Android may show a Play Protect warning for an app it hasn't seen before. That's expected for a personal build.

**Updating:** build again and install over the top. Your data stays because every build is signed with the same key (`app/signing/debug.keystore`, kept in this repo for that reason). Use **Settings > Export** before switching phones.

## Build it

1. Install a JDK (17 or newer) and the Android SDK (Android Studio, or just the command-line tools). The build needs SDK platform 37; Gradle downloads the rest itself.
2. Point the build at the SDK: set `ANDROID_HOME`, or put `sdk.dir=/path/to/Android/sdk` in `local.properties`.
3. Run `./gradlew assemblePersonalDebug` (on Windows, `gradlew.bat assemblePersonalDebug`).
4. The APK is at `app/build/outputs/apk/personal/debug/app-personal-debug.apk`.

`./gradlew assembleStoreDebug` builds the store edition for a look (Google's test ads, no purchase). The Play upload is `./gradlew bundleStoreRelease`; see [store-kit/launch-checklist.md](store-kit/launch-checklist.md) for the signing key and settings it needs.

## Tests

- `./gradlew testPersonalDebugUnitTest` runs the personal edition's tests: the shopping-list roll-up, "which workout is today", quantity parsing, the seed file, database upgrades from versions 1 and 2, repository and backup tests on a real Room database, and a smoke test that opens every main screen.
- `./gradlew testStoreDebugUnitTest` runs the store edition's: its seed and form cues, first-launch setup, People in Settings, and where banners may appear.
- `./gradlew recordRoborazziPersonalDebug` (or `…StoreDebug`) also saves screenshots to `app/build/outputs/roborazzi/`.

## How it works

| Tab | What it does |
| --- | --- |
| Today | Today's breakfast, lunch and dinner; which gym day it is (or "Rest day"); sauna shortcut. |
| Plan | The week, Monday to Sunday, as seven rows of three slots. Pick from recipes for that slot, copy a meal to other days, "Repeat last week", clear a slot. Meal-prep recipes can fill several slots in one go ("makes 4"). |
| Cook | Recipes (searchable, editable, and you can add your own), step-by-step cooking mode with big text and the screen kept on, and the shopping list. |
| Gym | Today's workout with tick boxes for sets, one-tap busy-gym swaps, optional weight and reps ("Last time: 135 x 8"), a rest timer, and a "How did it go?" check-in. Workouts are editable (pencil icon). |

Settings (gear icon) has training days, nutrition text on or off, the half-plate reminder, lb or kg, the pantry "always have" list, and Export/Import. History (clock icon) is a plain list by date.

**Ground rules kept:** no calorie totals, no body-weight logging, no streaks, no "you missed a day" messages. Nutrition is reference text on each recipe card and is never added up.

## Choices made where the spec left room

- **Shopping amounts.** Recipe quantities are for the whole recipe, so a recipe that serves 4 and fills 4 lunch slots is bought once; a 5th slot means cooking it twice. Single-serving recipes scale with every slot. The same ingredient is combined across recipes (2 lb + 2 lb chicken thighs = 4 lb), and ounces fold into pounds when both appear.
- **"Always have" matching.** A ticked staple also covers more general or more specific names, so "low-sodium soy sauce" covers plain "soy sauce", and "olive oil" covers "oil".
- **Meal-prep.** B2, L1, L2, L3 and D6 are marked meal-prep. The overnight oats serve 1 per jar, so they show "makes 4" (4 jars).
- **Gym cycle.** Day 1 to Day 4 run in order across your training weekdays. The next session is always the day after the last one you actually did, so skipping never shifts or flags anything. "Do a different day" picks one by hand, and the cycle continues from there.
- **Permissions.** Notifications and a foreground service, as the spec says. Android 14+ also requires a foreground-service *type* permission (`FOREGROUND_SERVICE_SPECIAL_USE`), and the timer uses `VIBRATE` and `WAKE_LOCK` so it can buzz and stay on time with the screen off. Those three are granted at install with no prompt. The internet permission is explicitly blocked, and Android cloud backup is turned off.
- **First launch.** The recipes and workouts load from `app/src/main/assets/seed.json` when the database is first created.

## Layout

```
app/src/main/
  assets/seed.json            19 recipes, 4 workout days, pantry staples, free-volume foods, gym tips
  java/com/personal/mealgym/
    domain/                   ShoppingList, WorkoutCycle, Quantities, Dates (plain Kotlin, unit-tested)
    data/                     Room entities and DAOs, repositories, settings, seed loader, backup
    gym/                      In-progress workout and rest timer
    sauna/                    Sauna timer foreground service, notifications, sound and buzz
    ui/                       Compose screens, one folder per tab plus settings and history
  assets/demos/               exercise photos (free-exercise-db, public domain)
  res/font/                   Cinzel, Fredoka, Pacifico (SIL Open Font License, see licenses/)
tools/exercise_demos.py       matches and bundles the exercise demos
```
