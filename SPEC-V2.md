# Meal & Gym app v2: new features only

2026-11-11 · Swag

This doc holds only the additions for version 2. Save it as `SPEC-V2.md` next to the original spec and give it to the same Claude Code session that built the app.

## What's new

Version 2 adds six things to the working app and changes nothing about how Swag's Side looks or behaves.

| # | Addition | In one line |
| --- | --- | --- |
| 1 | Two sides | "Swag's Side" and "Ashley's Side", each with its own theme, plans, schedule and history |
| 2 | Ashley's theme | An original Y2K glam look, only on her side |
| 3 | Ashley's content | Her three gym days, her schedule and her nutrition plan |
| 4 | Recipe library upgrade | Protein filter, add-your-own recipes, importable recipe packs, eight new beef and pork recipes |
| 5 | Exercise demos | Start and end position images for each exercise, flipping like a GIF |
| 6 | iPhone build | The same app running on Android and iOS |

**Do not change:** the dark fantasy theme, layout and behaviour of the existing app (now Swag's Side), the existing recipes and workouts, and the ground rules from the first spec: offline, no accounts, no calorie totals, no body-weight logging, no streaks or guilt messaging. Those rules apply to both sides.

## Two sides

The app opens to a chooser the first time: two large doors, "Swag's Side" and "Ashley's Side". The choice is remembered, so each phone opens straight to its owner's side afterwards. A switch in Settings changes sides.

|  | Separate per side | Shared by both |
| --- | --- | --- |
| Look | Theme, fonts, icons, sounds |  |
| Meals | Weekly meal plan, nutrition reference text, half-plate and volume tips (Swag's Side only) | Recipe library |
| Gym | Workout days, training weekdays, set notes, check-ins | Exercise demo images |
| Other | Sauna log, history, settings | Pantry staples |

**Details**

- Add a `Profile` table (id, name, themeKey) seeded with the two profiles, and a `profileId` column on MealPlanEntry, WorkoutDay, WorkoutSession, SetLog, SaunaLog and per-profile settings. Migrate existing data to Swag's profile.
- **Shopping list:** a toggle at the top, "Just mine" or "Both of us". "Both of us" rolls up ingredients from both meal plans into one list for the shared grocery run.
- **Copy a meal across:** in the Plan tab, "Add to the other side too" puts the same dinner on both plans in one tap.
- **Ashley's Side differences:** no half-plate reminder and no "Bulk it up" expander. In their place, each recipe shows a "Make it easier to finish" tip (see her nutrition section). Her Today tab adds a fourth slot, Snack.
- **Two phones, no sync:** each phone keeps its own data. The existing Export and Import buttons can move a meal plan or a recipe pack from one phone to the other as a file. Real syncing would need a server and is out of scope.

## Ashley's theme

An original early-2000s glam look: hot pink, lilac and chrome, glossy and sparkly, fashion-magazine energy. It is inspired by the era, not by any brand.

**Hard rule:** no logos, wordmarks, characters, mascots, fonts or artwork from Juicy Couture, Barbie, Hello Kitty or any other brand. All shapes and icons are drawn fresh for this app.

| Element | Spec |
| --- | --- |
| Background | Soft pink `#FFE4F1` with a subtle vertical gradient to lilac `#EBD9FF` |
| Primary | Hot pink `#FF2E93` |
| Secondary | Lilac `#B58CFF` |
| Accent | Chrome silver `#C9CED6` with a white highlight, used for borders and icon outlines |
| Pop colors | Baby blue `#8FD3FF`, lime `#C6F432` for small badges only |
| Text | Deep plum `#3B0A2A` on light surfaces, white on hot pink |
| Cards | White, 24 dp rounded corners, thin chrome border, soft pink drop shadow |
| Buttons | Pill-shaped, glossy: hot pink gradient with a white shine across the top third |
| Headings font | A rounded bubbly open-licensed font such as Fredoka or Baloo 2 (Google Fonts, bundled in the app) |
| Accent font | An open-licensed script such as Pacifico for the side title and section flourishes only |
| Body font | The rounded heading font at regular weight, for readability |
| Motifs | Original butterflies, five-point stars, hearts, flip-phone and lip-gloss icons, rhinestone dots along dividers |
| Motion | A short sparkle burst when a set is ticked or a meal is picked; gentle shimmer on the header. A Settings switch turns motion off. |
| Sounds | Optional soft chime on timer end; off by default |
| Dark mode | Deep plum `#2A0A22` background, same pink and lilac accents |

**Wording on her side:** playful and short. Examples: "Pick today's breakfast", "Glute day, let's go", "Done and dusted". Never comments on missed days.

**Tab icons:** Today = star, Plan = calendar with a heart, Cook = whisk, Gym = dumbbell with a bow-style ribbon drawn fresh.

**Accessibility:** keep text contrast at 4.5:1 or better. Hot pink on white fails for small text, so body text stays plum.

## Ashley's workouts and schedule

Three gym days a week, cycling Day 1, 2, 3. Default training weekdays: Monday, Wednesday, Friday, changeable in her Settings. Sessions run 45 to 60 minutes. Seed these as WorkoutDay and Exercise rows under her profile, in the same format as the existing workouts. The first swap listed is the default alternative.

### Day 1: Glutes and hamstrings

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Hip thrust (barbell or machine) | 4 x 8–12 | Smith machine hip thrust; dumbbell glute bridge |
| B | Romanian deadlift | 3 x 8–12 | Dumbbell Romanian deadlift; cable pull-through |
| C | Back extension, squeeze at the top | 3 x 12–15 | Reverse hyper; light hip thrust machine |
| D | Seated leg curl | 3 x 10–15 | Lying leg curl |
| E | Hip abduction machine | 3 x 15–20 | Banded side steps; cable side kick |

### Day 2: Upper body plus glutes

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Lat pulldown | 3 x 8–12 | Assisted pull-up machine |
| B | Dumbbell shoulder press | 3 x 8–12 | Shoulder press machine |
| C | Seated cable row | 3 x 10–12 | Chest-supported row machine |
| D | Side raises | 3 x 12–15 | Cable or machine lateral raise |
| E | Cable glute kickback | 3 x 12–15 each leg | Kickback machine; banded kickbacks |
| F | Plank or cable crunch | 3 sets | Any ab machine |

### Day 3: Glutes and quads

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Bulgarian split squat | 3 x 8–12 each leg | Reverse lunge; step-ups |
| B | Leg press, feet high and wide | 3 x 10–15 | Hack squat; goblet squat |
| C | Hip thrust, lighter, 2-second squeeze | 3 x 12–15 | Glute bridge machine; single-leg glute bridge |
| D | Cable glute kickback | 3 x 12–15 each leg | Kickback machine |
| E | Hip abduction machine | 3 x 15–20 | Banded side steps |

### Text to show on her Gym screen

- Rest 2 minutes after the first two exercises, about 1 minute after the rest.
- Stop each set with one or two good reps left. Push the last set a bit harder.
- When every set reaches the top of the rep range, add the smallest weight jump next time.
- Feel it in the glutes, not the lower back. On hip thrusts, tuck the chin and keep the ribs down.
- Setup for a shorter frame: use a low bench or step for hip thrusts, and slide machine seats forward.

### Her schedule view

Her Plan tab shows the week with both layers at once: the three or four meal slots per day, and a small badge on training days ("Glutes + hams", "Upper", "Glutes + quads"). Rest days show "Rest" with no other comment.

## Ashley's nutrition plan

For a 4'11", 27-year-old woman at about 130 lb lifting three days a week, the aim is roughly maintenance eating with high protein: enough to build glutes without overshooting. All numbers are estimates and appear in the app as reference text only, never as totals or targets to hit.

|  | Daily guide (approximate) |
| --- | --- |
| Protein | 100–110 g, about 30 g at each meal plus a protein snack |
| Calories | roughly 1,700–1,900 |
| Carbs | most of them around training: breakfast, the meal before and the meal after the gym |
| Fats | a thumb-sized portion per meal: avocado, olive oil, nuts, cheese |
| Water | a bottle with her at the gym and one through the day |

**How her day is laid out in the app (four slots)**

| Slot | Default idea | Protein |
| --- | --- | --- |
| Breakfast (Starbucks most days) | Protein Latte, or egg bites plus an iced drink with Protein Cold Foam | about 30–45 g |
| Lunch | About three-quarters of a meal-prep serving from the shared recipes | about 35 g |
| Snack | Greek yogurt cup, protein shake, string cheese and fruit, or jerky | about 15–20 g |
| Dinner | About three-quarters of a serving of the shared dinner | about 35 g |

**Seed her Breakfast picker with these Starbucks entries** (no cooking steps, just the order):

- Protein Latte, grande
- Bacon & Gruyère Egg Bites + iced drink with Protein Cold Foam
- Spinach, Feta & Egg White Wrap + Protein Latte
- Bacon, Sausage & Egg Wrap (hungrier days)
- Kale & Mushroom Egg Bites + iced drink with Protein Cold Foam

**"Make it easier to finish" tips** (shown on her recipe view in place of the volume tips)

- Small appetite today? Eat the protein first, then the rice.
- Drink some of it: a shake or protein latte counts.
- Split the plate: half now, half in an hour.
- Add, don't enlarge: a drizzle of olive oil, some avocado or cheese makes the same plate go further.

**Supplement reminder (optional, off by default):** a daily checkbox for creatine monohydrate, 3 g, any time of day.

**Rules for her side:** no weight entry, no calorie adding, no red or green judgement colors on food. If her appetite stays low or her weight moves in a way that worries her, that is a conversation for her doctor or a dietitian, not the app.

## Recipe library upgrade

The recipe list becomes a library you can filter, add to and extend, and it gains eight beef and pork recipes so the week isn't wall-to-wall chicken.

### New library features

- **Protein tag on every recipe:** BEEF, PORK, CHICKEN, TURKEY, FISH, EGG, VEGETARIAN. Tag the existing recipes too.
- **Filter chips in the picker:** by protein, cuisine and meal type, plus a one-tap "Not chicken" chip that stays on until turned off.
- **Swap the protein:** recipes with a listed swap (table below) show a "Make it with..." button that changes the main protein in the ingredients and shopping list.
- **"Fill my week" button:** fills empty slots at random from the current filters, never the same protein two dinners in a row.
- **Add a recipe:** a form with name, meal type, protein, cuisine, servings, serving size, nutrition text (optional), ingredients with store section, and numbered steps.
- **Import a recipe pack:** reads a JSON file in the same shape as `seed.json` and adds its recipes to the library. New packs can then be written later and loaded on either phone without rebuilding the app.
- **Favorites and hide:** a heart to pin a recipe to the top, and "Hide for now" to rest a recipe without deleting it.

### Protein swaps for existing recipes

| Existing recipe | Swap |
| --- | --- |
| L1 Pollo guisado | Use the new Carne guisada |
| L2 Teriyaki chicken bowl | Flank steak or pork tenderloin, sliced thin, same sauce |
| D2 Thai basil chicken | Lean ground pork or 90% lean ground beef |
| D7 Sheet-pan fajita chicken | Flank or skirt steak, roast 10–12 minutes |
| S1 Sancocho-style soup | Beef stew meat, simmer 60 minutes before the vegetables |
| S2 Ginger chicken soup | Thin-sliced pork loin, poach 5 minutes |
| S3 Caldo de pollo | Caldo de res: beef shank or stew meat, simmer 90 minutes first |

### New recipes

Same format as the first spec: quantities are for the whole recipe, and the nutrition line is approximate per-serving reference text.

**L5. Carne guisada (Caribbean beef stew)** · BEEF · Caribbean · lunch, meal-prep Serves 4 · 1 portion over 3/4 cup rice · ~610 cal, 50 g protein, 60 g carbs, 16 g fat

- Ingredients: 2 lb lean beef stew meat (top round or trimmed chuck); 2 potatoes; 2 carrots; 1 onion; 1 bell pepper; 4 garlic cloves; 2 tbsp sofrito; 8 oz can tomato sauce; 1 packet sazón; 1 tsp adobo; 1 tsp oregano; 2 bay leaves; handful of olives; 1 tbsp olive oil; 2 cups low-sodium beef broth; 3 cups cooked rice
- Steps: 1) Season beef with adobo, brown in oil in batches. 2) Soften onion, pepper, garlic and sofrito in the same pot. 3) Add tomato sauce, sazón, oregano, bay leaves, broth and beef. 4) Cover and simmer 60 minutes. 5) Add potatoes, carrots and olives, simmer 25 minutes until tender. 6) Serve over rice.

**L6. Korean ground beef bowls** · BEEF · Asian · lunch, meal-prep Serves 4 · 1 bowl with 3/4 cup rice · ~620 cal, 50 g protein, 55 g carbs, 22 g fat

- Ingredients: 2 lb 90% lean ground beef; 1/3 cup low-sodium soy sauce; 2 tbsp brown sugar; 4 garlic cloves; 1 tbsp ginger; 1 tbsp sesame oil; 1 tbsp gochujang; 3 scallions; 3 cups cooked rice; 2 cucumbers; 2 carrots, shredded; 1 tub baby spinach; sesame seeds
- Steps: 1) Brown the beef, drain any fat. 2) Add garlic and ginger for 1 minute. 3) Stir in soy, sugar, sesame oil and gochujang, simmer 3 minutes. 4) Wilt the spinach in a separate pan. 5) Portion rice, beef, spinach, cucumber and carrot; top with scallions and sesame.

**L7. Pork al pastor bowls** · PORK · Hispanic · lunch, meal-prep Serves 4 · 1 bowl with 3/4 cup rice and 1/4 cup beans, or 3 tacos · ~590 cal, 54 g protein, 65 g carbs, 10 g fat

- Ingredients: 2 lb pork tenderloin, sliced thin; 2 chipotle peppers in adobo plus 1 tbsp of the sauce; 1/2 cup pineapple juice; 2 tbsp white vinegar; 3 garlic cloves; 1 tsp cumin; 1 tsp oregano; 1 tbsp achiote paste or paprika; 2 cups pineapple chunks; 1 onion; cilantro; 2 limes; 3 cups cooked rice or 12 corn tortillas; 1 can black beans
- Steps: 1) Blend chipotles, sauce, pineapple juice, vinegar, garlic, cumin, oregano and achiote. 2) Marinate pork 1 to 24 hours. 3) Sear pork in a very hot pan in batches until charred at the edges. 4) Char pineapple chunks and sliced onion in the same pan. 5) Serve over rice and beans or in tortillas with cilantro and lime.

**L8. Lemongrass pork noodle bowls (Vietnamese-style)** · PORK · Asian · lunch, meal-prep Serves 4 · 1 bowl · ~560 cal, 52 g protein, 58 g carbs, 11 g fat

- Ingredients: 2 lb pork tenderloin, sliced thin; 2 tbsp lemongrass paste or 2 stalks, minced; 4 garlic cloves; 1 shallot; 3 tbsp fish sauce; 2 tbsp sugar; 1 tbsp soy sauce; 1 tbsp oil; 8 oz rice vermicelli; 2 cucumbers; 2 carrots; 2 tbsp rice vinegar; mint; cilantro; 2 limes; 1 chili
- Steps: 1) Mix lemongrass, garlic, shallot, 2 tbsp fish sauce, 1 tbsp sugar, soy and oil; marinate pork 30 minutes or more. 2) Shred carrots, toss with vinegar and a pinch of sugar. 3) Cook noodles, rinse cold. 4) Sear pork in a hot pan until browned. 5) Stir 1 tbsp fish sauce, 1 tbsp sugar, lime juice, chili and 3 tbsp water for the dressing. 6) Build bowls: noodles, pork, cucumber, carrot, herbs, dressing.

**D8. Slow-cooker pernil-style pork** · PORK · Caribbean · dinner, meal-prep Serves 6 · about 6 oz pork + 3/4 cup rice with pigeon peas · ~640 cal, 48 g protein, 50 g carbs, 26 g fat

- Ingredients: 3 lb boneless pork shoulder, trimmed; 10 garlic cloves; 1 tbsp oregano; 1 tbsp adobo; 1 packet sazón; 1 tbsp olive oil; 1/4 cup orange juice; 1/4 cup lime juice; 2 cups rice; 1 can pigeon peas (gandules); 2 tbsp sofrito
- Steps: 1) Mash garlic with oregano, adobo, sazón, oil and the juices. 2) Cut slits in the pork, rub the paste in, rest overnight if possible. 3) Slow cook on low 8 hours. 4) Shred, spread on a sheet pan and broil 4 minutes to crisp the edges. 5) Cook rice with sofrito and pigeon peas. 6) Serve pork over the rice with a spoon of the cooking juices.

**D9. Spicy pork bulgogi** · PORK · Asian · dinner Serves 4 · 1 portion over 3/4 cup rice · ~590 cal, 54 g protein, 58 g carbs, 14 g fat

- Ingredients: 2 lb pork loin or tenderloin, sliced thin; 3 tbsp gochujang; 1 tbsp Korean chili flakes (optional); 2 tbsp low-sodium soy sauce; 1 tbsp sugar; 1 tbsp sesame oil; 4 garlic cloves; 1 tbsp ginger; 1 onion; 3 scallions; 1/2 head cabbage; 3 cups cooked rice; kimchi
- Steps: 1) Mix gochujang, chili flakes, soy, sugar, sesame oil, garlic and ginger. 2) Toss with pork and sliced onion, marinate 30 minutes or more. 3) Stir-fry in a very hot pan in batches until the edges caramelize. 4) Add sliced cabbage for the last 2 minutes. 5) Serve over rice with scallions and kimchi.

**D10. Beef and broccoli** · BEEF · Asian · dinner Serves 4 · 1 portion over 3/4 cup rice · ~610 cal, 55 g protein, 55 g carbs, 18 g fat

- Ingredients: 2 lb flank steak, sliced thin against the grain; 2 tbsp cornstarch; 1/3 cup + 1 tbsp low-sodium soy sauce; 2 tbsp oyster sauce; 1 tbsp brown sugar; 1/2 cup low-sodium beef broth; 4 garlic cloves; 1 tbsp ginger; 1 tsp sesame oil; 1 tbsp oil; 2 large heads broccoli or 1 large frozen bag; 3 cups cooked rice
- Steps: 1) Toss beef with 1 tbsp cornstarch and 1 tbsp soy, rest 15 minutes. 2) Whisk the remaining soy, oyster sauce, sugar, broth and 1 tbsp cornstarch. 3) Steam broccoli until just tender. 4) Sear beef in batches in a very hot pan, 1 minute a side. 5) Add garlic and ginger, pour in the sauce, simmer until glossy. 6) Fold in broccoli and sesame oil, serve over rice.

**D11. Bistec encebollado (steak and onions)** · BEEF · Caribbean · dinner Serves 4 · 1 portion + 3/4 cup rice + 1/4 cup beans · ~600 cal, 54 g protein, 55 g carbs, 16 g fat

- Ingredients: 2 lb thin-sliced top round or cube steak; 2 large onions, sliced into rings; 1/4 cup white vinegar; 4 garlic cloves; 1 tsp oregano; 1 packet sazón; 1 tsp adobo; 1 tbsp olive oil; 1/2 cup low-sodium beef broth; 3 cups cooked rice; 1 can pink or black beans
- Steps: 1) Marinate steak with vinegar, garlic, oregano, sazón, adobo and half the onions for 1 hour or overnight. 2) Sear steak in oil, 1 to 2 minutes a side, set aside. 3) Cook all the onions in the same pan until soft. 4) Return steak with the marinade and broth, cover and simmer 20 minutes until tender. 5) Serve with rice and beans.

**New pantry staples to add:** gochugaru (optional), achiote paste, lemongrass paste, chipotles in adobo, canned pigeon peas.

## Exercise demos

Each exercise gets a two-frame demo: the start position and the end position, flipping back and forth about once a second so it reads like a GIF. Free, properly licensed true GIFs for every exercise are hard to find, and ripping clips from fitness sites or YouTube is off the table.

**Source:** free-exercise-db, a public-domain (Unlicense) dataset of 800+ exercises. Each exercise has a folder with still photos (`0.jpg`, `1.jpg`) and the full list is in `dist/exercises.json`.

**How to build it**

1. Write a small build-time script that downloads `exercises.json`, matches every exercise and swap name in both workout plans to a dataset entry, and saves the matched images into the app's bundled resources. The app itself stays offline.
2. Print a match report: exercise name, matched dataset entry, or "no match". Show it to the user before bundling so wrong matches can be fixed by hand.
3. In the Gym tab, each exercise row gets a small thumbnail. Tapping it opens a large view that cross-fades between the two frames, with the dataset's written instructions underneath.
4. When an exercise is swapped for an alternative, the demo swaps too.

**When there is no match** (likely for some machine and cable moves such as the hip abduction machine or cable kickback):

- Try the wger exercise database next. Its images are CC-BY-SA 4.0, so add a Credits screen in Settings listing the author and licence of each image used.
- If still nothing, show three short form cues as text and a "Watch a demo" button that opens a web search for the exercise name in the phone's browser. That needs no internet permission in the app.

**Licence note:** the dataset is published as public domain, which is fine for a personal app on two phones. Recheck the image licensing before ever putting the app on a store.

## iPhone and Android

The route that reuses the most existing code is Kotlin Multiplatform with Compose Multiplatform: the same Kotlin screens run on both phones. Compose Multiplatform has been stable on iOS since version 1.8.0 (May 2025), and Room and DataStore both support Kotlin Multiplatform.

**What you need for the iPhone build**

- **A Mac with Xcode.** iOS apps can only be built and signed on macOS. No Mac means no iPhone build from your own computer.
- **An Apple ID signed in to Xcode.** With a free Apple ID, the app on her phone stops opening after 7 days and has to be reinstalled from the Mac. With the paid Apple Developer Program (US$99 a year) it lasts a year, and TestFlight installs become possible. Confirm current terms on Apple's developer site.
- Her iPhone connected to the Mac once, with Developer Mode switched on.

**Migration steps for Claude Code**

1. Restructure into a shared module (`commonMain`) plus `androidApp` and `iosApp`. Move screens, view models, repositories and the Room database into shared code.
2. Switch Room to its multiplatform setup with the bundled SQLite driver, and DataStore to its multiplatform artifact. Keep the Android database file and schema so existing data on the Android phone survives the update.
3. Move fonts, images and `seed.json` into Compose Multiplatform resources.
4. Write platform-specific pieces behind small interfaces:

| Feature | Android | iOS |
| --- | --- | --- |
| Sauna and rest timers | Existing foreground service | Store the end time, schedule a local notification for it, and compute the remaining time from the clock when the app is open |
| Notifications | Existing channel | Ask permission, use local notifications |
| Export and import | Existing file picker | Share sheet and document picker |
| Keep screen on while cooking | Window flag | Idle timer disabled |
| Vibration | Vibrator | Haptic feedback |
| Open a web search | Browser intent | Open URL |

1. Build order: get Android building and passing tests on the new structure first, with no visible change. Only then add the iOS target.
2. Test both themes on both platforms. Compose draws its own UI on iOS, so check safe areas around the notch and home bar, back-swipe, and text sizes.

**If there is no Mac:** finish everything else for Android and stop. Options to discuss then are borrowing a Mac for the build, a cloud Mac build service (which still needs the paid Apple account for signing), or a web-app version she adds to her home screen.

Sources: JetBrains on Compose Multiplatform 1.8.0 for iOS · Android Developers: Kotlin Multiplatform and Room

## Prompt for the same Claude Code session

Save this doc as `SPEC-V2.md` in the project folder, then paste:

```
Read SPEC-V2.md. It describes version 2 of the app you built: additions
only. Do not change the look or behaviour of the existing app, which
becomes "Swag's Side". Commit the current working state first.

Before writing code, ask me two things and wait for my answers:
  a. Do I have a Mac with Xcode, and a free or paid Apple account?
  b. Is this machine online, so the exercise-image script can download?

Then build in this order. After each step, build, run the tests, and
tell me what changed before moving on:

1. Profiles: the Profile table, profileId migration, the side chooser,
   and the Settings switch. Existing data goes to Swag's profile.
2. Ashley's Side: her theme exactly as specified (original artwork only,
   no brand logos, characters or fonts), her three workout days, her
   schedule badges, her four meal slots, her Starbucks breakfast entries
   and her "Make it easier to finish" tips.
3. Recipe library: protein tags on all recipes, filter chips including
   "Not chicken", protein swaps, "Fill my week", the add-recipe form,
   recipe pack import, favorites and hide. Add the eight new recipes.
4. Shared shopping list toggle and "Add to the other side too".
5. Exercise demos: write the download-and-match script, show me the
   match report, then bundle the images and add the two-frame viewer.
   Add a Credits screen if any CC-BY-SA images are used.
6. iOS: only if I confirmed a Mac. Migrate to Kotlin Multiplatform and
   Compose Multiplatform as described, Android first with no visible
   change, then the iOS target. Check current stable versions in the
   official docs instead of guessing.

Keep the ground rules on both sides: offline, no accounts, no calorie
totals, no body-weight logging, no streaks or guilt messaging.
When done, give me the new APK path and the steps to install on the
iPhone.
```
