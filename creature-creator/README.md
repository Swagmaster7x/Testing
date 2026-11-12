# Critter Arena

A 3D creature creator for Android. Pick a body type, bend the spine, stick on parts piece by piece, and spin the result around. Runs in landscape, with no accounts. The game is bundled and plays offline; the network is used only for ads.

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
- **Animated fights:** creatures walk in from the gates, wind up and strike in a style that suits their body (bite, claw or weapon swing, tail whip, stinger, horn charge, wing swoop, tentacle lash), recoil, guard, dodge, stagger when stunned, collapse when killed and celebrate a win. Limbs, wings and tails swing from their joints and fur moves with them. Hits throw sparks and dust, ailments show on the body, heavy blows freeze the action for an instant and a kill plays in slow motion.
- **Rewards after every win:** choose one of three random rewards, in any mix of weapon, relic (a passive that stacks) and ability, each with a random rarity and strength. There are 12 weapons, 38 relics and 15 abilities, built around a handful of themes that feed each other: bleed, poison, fire, stuns, critical hits, speed, guarding, thorns and healing. The draft leans toward whatever matches what you already hold and labels the match.
- **The body decides the build:** a creature holds one weapon per hand (each arm or tentacle is a hand, up to eight; with no hands it carries one in its jaws), and held weapons show on the model. Humanoid bodies get three ability slots, others two. Many abilities and relics only appear for the right body: Dive needs wings, Gore needs horns, Tail Sweep a tail, Venom Spit a stinger or mandibles, Stampede four legs, and so on.
- **Winning and dying:** every fight won pays points (15 for the first, rising to 150 for the tenth), and the title pays 1000 more plus up to 500 for health left. If the creature dies it is deleted for good, unless you spend a revive. Closing the app between fights keeps your place. Closing it on the death screen does not undo the death, and leaving in the middle of a fight is forgiven once per gauntlet (the fight restarts); a second time counts as a death.
- **Reasons to come back:**
  - *Ranks.* Winning the title opens the next rank (up to 10): every opponent is tougher and every fight and title pays 25% more per rank.
  - *Elite opponents.* Some fights are against an Enraged, Iron-hided, Swift, Giant, Venomous or Thorned opponent, worth half as many points again.
  - *Daily gift.* Points every day, growing over a seven-day streak, with a free revive on the seventh day.
  - *Goals.* Twenty-one one-off targets that pay points when claimed (win 25 fights, win the title with three body types, hold four weapons, and so on).
  - *Records.* Fights won, furthest fight, rewards discovered, body types crowned, and a hall of champions.
- **Runs and the timer:** you hold up to 5 runs. Starting a gauntlet uses one, and one comes back every 30 minutes of real time, with a live countdown on the main menu and at the arena gate. Resuming a gauntlet, or reviving, does not use a run.
- **Rewarded ads (optional, never forced):** watch one for an extra run, to revive a dead creature at half health (once per gauntlet), to double the points from the fight just won, or to double the title prize.
- **The shop (main menu):** points buy locked body types (humanoid, quadruped and avian are free), extra body parts, more weapons, abilities and relics for the reward pool, revives, and permanent boosts (health, attack, recovery, rerolls, and a reward before the first fight).
- **Extras:** undo and redo, auto-spin, save and reopen creatures, and a Photo button that saves a 1920x1080 picture to `Pictures/CreatureWorkshop`.

## Put it on your phone

You need `app-debug.apk`, either the one from the Claude session or one you build (below). Send it to the phone, open it, and allow "Install unknown apps" when Android asks. A Play Protect warning is expected for a personal build. Needs Android 7 or newer.

Every build is signed with the key in `app/signing/debug.keystore`, so a new build installs over the old one and saved creatures stay.

## Ads and publishing on Google Play

The app uses Google AdMob rewarded ads and Google's consent prompt (UMP). As shipped it uses **Google's public test IDs**, so it shows test ads and earns nothing. Before publishing:

1. **AdMob:** create an AdMob account, add the app, create one *rewarded* ad unit, and put your two IDs in `app/src/main/res/values/ads.xml`. Add your own phone as a test device in AdMob; tapping real ads yourself can get the account suspended.
2. **Consent:** in AdMob under Privacy & messaging, create the European regulations message. Without it the consent prompt has nothing to show.
3. **App ID:** the package name is `com.personal.creatureworkshop` (`applicationId` in `app/build.gradle.kts`). It cannot be changed after the first upload, so pick the one you want first.
4. **Signing:** Play needs a release bundle signed with your own upload key, which must not be committed. Create one with
   `keytool -genkeypair -v -keystore upload.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload`
   then put a `keystore.properties` file in this folder (it is git-ignored) containing `storeFile=upload.jks`, `storePassword=...`, `keyAlias=upload`, `keyPassword=...`, and run `./gradlew bundleRelease`. The bundle is at `app/build/outputs/bundle/release/app-release.aab`. Raise `versionCode` for every upload.
5. **Store forms:** you will need a privacy policy URL, the Data safety form (AdMob collects the advertising ID and device data), the "contains ads" declaration, and the content rating questionnaire (creatures fight to the death, in cartoon style). If the audience includes children, Play's Families rules restrict how ads may be served, so choose the target age deliberately.
6. **Testing:** Google has required new personal developer accounts to run a closed test before production access. Check the current rule in the Play Console.

Things to know about how this is built: runs, points and unlocks live on the device only, so they are lost on uninstall and are not protected against tampering, and the run timer trusts the phone's clock. That is normal for a single-player game but worth knowing before adding anything paid.

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
web/src/anim.js        poses and joints: how a body with no skeleton is made to move
web/src/fx.js          particles and impact rings
web/src/arena.js       the colosseum scene, fight animation and its screens
app/                   the Android shell: a full-screen landscape WebView, back button, photo saving
```

Everything is generated in code. There are no model or texture files. The only third-party pieces are [three.js](https://threejs.org) (MIT licence) and the Fredoka typeface (SIL Open Font License, see `FONT-LICENSE-Fredoka.txt`).

## Tested and not tested

The editor was exercised in headless Chromium at a phone-sized landscape screen with simulated touches: every part on every body type, spine dragging, tap to select, drag to move, sliders, male and female, patterns, undo, save and photo. The battle mode was run the same way with the clock driven by a script: gauntlets lost (with and without a revive), a gauntlet won, reward picks including a pre-fight reward and an eight-handed creature, shop purchases, and quitting and resuming. Balance was tuned with simulated gauntlets, rewards included. At Rank 0 a fresh starter creature usually wins four to eight fights, and one built for fighting takes the title about four times in ten with good timing; that falls to about three in ten at Rank 1, under two in ten at Rank 2 and close to zero by Rank 8 without shop boosts. Each reward was also measured on its own across five builds, and all of them now add between roughly a third of a fight and one and a third fights to an average run.

Before release the game went through three QA passes: an independent code review (22 findings, the real ones fixed), fuzzing of 6,000 random fights and drafts, a random-action test of the editor, and a scripted regression of saving, resuming, dying, reviving, ads, ranks, goals and the daily gift.

The run timer and every ad-gated feature were tested in the browser with a stand-in for the ad. The AdMob and consent code compiles against the current SDKs and the release bundle builds, but **no real or test ad has been loaded or shown**, because that needs a device. It has not been run on a physical phone or an emulator, so the Android-only pieces (hiding the system bars, the back button, saving a photo to the gallery, sound) are untested, fights have not been watched at real speed, and speed on an older phone with long fur is unknown.
