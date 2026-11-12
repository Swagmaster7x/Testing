# Creature Workshop

A 3D creature creator for Android. Pick a body type, bend the spine, stick on parts piece by piece, and spin the result around. Runs in landscape, fully offline, no accounts and no permissions.

It is an original take on the "build a creature from parts" idea: its own parts, art and interface.

## What you can do

- **Eight body types:** humanoid, quadruped, avian, insectoid, arachnid, cephalopod, serpent, aquatic. Each starts as a finished creature you can strip down or build on.
- **Shape the body:** drag the white dots to bend and stretch the spine, tap a dot to change how thick the body is there, add or remove sections.
- **About 60 parts:** eyes (round, slit, bar-pupil, glowing, beady, compound, stalk), mouths (muzzle, beak, mandibles, round maw, lips, trunk, feelers, nose, whiskers, tusks, beard), ears, horns, antlers, antennae, crests and hair, legs and arms with a choice of feet and hands, tentacles, three kinds of wing, fins, nine tails, and back pieces (spike rows, plates, sails, manes, shells).
- **Easy placing:** tap a part to add it where it belongs for that body type. Tap it on the creature and drag to slide it anywhere on the body. Parts off the centre line are mirrored automatically. Every part has its own sliders (size, length, curl, bend, teeth and so on).
- **Male and female:** one tap switches between the two. Build, limb thickness and the size of horns, crests and manes change, and the "Difference" slider sets how strongly. Any part can be marked "Male only" or "Female only" (antlers, a mane, lashes).
- **Skin:** smooth, fur (real layered fur with length and shagginess), scales, shell or slick; eight patterns; seven colour slots (main, pattern, belly, eyes, horn and claw, hair and feather, wing skin).
- **Random creatures:** the "Random" card rolls a surprise creature (random body type, shape, colours and parts) that you can keep editing.
- **The Colosseum:** the Battle button enters your creature in a gauntlet of ten fights to the death against random creatures, each tougher and better armed than the last, ending with the reigning champion. Its stats come from how you built it: size gives health; teeth, claws, horns and clubs give attack; scales, shell and plates give armour; legs and wings give speed; eyes help it land hits. Fights run by themselves while you time Power strike, Guard and any abilities you have picked up.
- **Rewards after every win:** choose one of three random rewards, in any mix of weapon, relic (a passive that stacks) and ability, each with a random rarity and strength. There are 12 weapons, 38 relics and 15 abilities, built around a handful of themes that feed each other: bleed, poison, fire, stuns, critical hits, speed, guarding, thorns and healing. The draft leans toward whatever matches what you already hold and labels the match.
- **The body decides the build:** a creature holds one weapon per hand (each arm or tentacle is a hand, up to eight; with no hands it carries one in its jaws), and held weapons show on the model. Humanoid bodies get three ability slots, others two. Many abilities and relics only appear for the right body: Dive needs wings, Gore needs horns, Tail Sweep a tail, Venom Spit a stinger or mandibles, Stampede four legs, and so on.
- **Winning and dying:** every fight won pays points (15 for the first, rising to 150 for the tenth), and the title pays 1000 more plus up to 500 for health left. If the creature dies it is deleted for good, unless you spend a revive. Closing the app between fights keeps your place.
- **The shop (main menu):** points buy locked body types (humanoid, quadruped and avian are free), extra body parts, more weapons, abilities and relics for the reward pool, revives, and permanent boosts (health, attack, recovery, rerolls, and a reward before the first fight).
- **Extras:** undo and redo, auto-spin, save and reopen creatures, and a Photo button that saves a 1920x1080 picture to `Pictures/CreatureWorkshop`.

## Put it on your phone

You need `app-debug.apk`, either the one from the Claude session or one you build (below). Send it to the phone, open it, and allow "Install unknown apps" when Android asks. A Play Protect warning is expected for a personal build. Needs Android 7 or newer.

Every build is signed with the key in `app/signing/debug.keystore`, so a new build installs over the old one and saved creatures stay.

## Build it

1. Install a JDK (17 or newer) and the Android SDK with platform 37. Set `ANDROID_HOME`, or put `sdk.dir=...` in `local.properties`.
2. From this folder run `./gradlew assembleDebug`.
3. The APK is at `app/build/outputs/apk/debug/app-debug.apk`.

The editor itself is a web page in `web/`, bundled into `app/src/main/assets/www/` (the bundle is committed, so step 2 works without Node). After changing anything under `web/`, run `npm install` once and then `npm run build` in `web/` before building the APK. You can also open `app/src/main/assets/www/index.html` in a desktop browser to try it.

## How it is put together

```
web/src/geom.js        the "tube": a smooth skin over a curved path; nearly every piece is one
web/src/parts.js       the parts catalogue; each part is a small function that builds its shape
web/src/templates.js   the eight body types: starting spine, where new parts land, starter parts
web/src/creature.js    turns a creature (plain JSON) into a 3D model; male/female differences
web/src/materials.js   skin patterns and fur (one shader), eye textures
web/src/main.js        scene, touch controls, panels, save/load, photo
web/src/random.js      the random creature generator (also makes every opponent)
web/src/battle.js      fight rules and how a build turns into stats (no graphics)
web/src/items.js       weapons, relics and abilities, the reward draft, and the shop's prices
web/src/arena.js       the colosseum scene, fight animation and its screens
app/                   the Android shell: a full-screen landscape WebView, back button, photo saving
```

Everything is generated in code. There are no model or texture files. The only third-party code is [three.js](https://threejs.org) (MIT licence).

## Tested and not tested

The editor was exercised in headless Chromium at a phone-sized landscape screen with simulated touches: every part on every body type, spine dragging, tap to select, drag to move, sliders, male and female, patterns, undo, save and photo. The battle mode was run the same way with the clock driven by a script: gauntlets lost (with and without a revive), a gauntlet won, reward picks including a pre-fight reward and an eight-handed creature, shop purchases, and quitting and resuming. Balance was tuned with a few thousand simulated gauntlets, rewards included: a fresh starter creature usually wins four to seven fights, one built for fighting takes the title roughly half the time with good timing, and about four times in five with everything in the shop bought. Individual items have not been balanced against each other. The APK was built and its signature verified.

It has not been run on a physical phone or an emulator, so the Android-only pieces (hiding the system bars, the back button, saving a photo to the gallery, sound) are untested, fights have not been watched at real speed, and speed on an older phone with long fur is unknown.
