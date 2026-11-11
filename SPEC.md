# Meal & Gym Planner: Android app build spec

2026-11-11 · Swag

Hand this whole doc to Claude Code on your computer and it has everything needed to build a personal Android app (one APK, your phone only) that plans your meals for the week, shows the recipes, tells you which gym day it is, and runs a sauna timer.

## What it is

A single-user Android app that answers three questions each day: what am I eating, how do I cook it, and what am I doing at the gym.

**Ground rules for the build**

- One user, one phone. No accounts, no login, no cloud, no ads, no analytics.
- Works fully offline. The app does not request the internet permission.
- All data lives on the phone in a local database.
- **No calorie tracking, no daily totals, no body-weight logging, no streaks, no "you missed a day" messages.** The app plans meals and shows recipes. It never adds numbers up or scores the day.
- Each recipe card shows its serving size and approximate per-serving nutrition as reference text only. A switch in Settings hides the nutrition line everywhere.
- Tone of every message is neutral and friendly. Skipping a meal, a workout or a whole week is never flagged.
- Recipes and workouts ship inside the app as seed data (sections below) and can be edited or added to on the phone.

## Tech setup

- **Language and UI:** Kotlin, Jetpack Compose, Material 3, dark and light themes following the system.
- **Storage:** Room (SQLite) for everything; DataStore for the few settings.
- **Structure:** one app module, single activity, Navigation Compose with a bottom bar of four tabs. ViewModels plus a small repository layer. No dependency-injection framework needed.
- **Android versions:** minimum SDK 26 (Android 8), target the current stable SDK.
- **Library versions:** use the current stable Android Gradle Plugin, Kotlin, Compose BOM and Room. Check the official docs for versions instead of guessing.
- **Permissions:** notifications (for the sauna timer finishing) and foreground service (so the timer keeps running with the screen off). Nothing else.
- **Package name:** `com.personal.mealgym`. App name: "Meal & Gym".
- **Seed data:** load the recipes and workouts below from a bundled JSON file in `assets/` on first launch.
- **Backup:** an Export button in Settings that writes all data to one JSON file, and an Import button that reads it back. This is the safety net when moving phones.
- **Tests:** unit tests for the shopping-list roll-up and the "which workout is today" logic.

## Screens

Four tabs along the bottom, plus Settings behind a gear icon.

| Tab | What it shows | What you can do |
| --- | --- | --- |
| Today | Today's breakfast, lunch and dinner as three cards; today's gym day (or "Rest day"); a sauna shortcut | Tap a meal to open its recipe; tap "Pick" on an empty slot; tap the gym card to start the workout |
| Plan | The week as seven rows, each with three meal slots | Tap a slot, choose from the recipe list (filtered to breakfast, lunch or dinner, searchable by cuisine tag); copy a meal to other days; "Repeat last week"; clear a slot |
| Cook | Recipe view: serving size, ingredients, numbered steps; a Shopping List button | Step-by-step cooking mode with large text and the screen kept on; shopping list rolled up from the planned week, grouped by store section, with checkboxes; share the list as plain text |
| Gym | Today's workout: each exercise with sets, reps and its busy-gym swaps; rest timer; sauna timer | Tick sets off; swap an exercise for an alternative with one tap; optionally note the weight lifted and reps; finish with "How did it go?" |

**Details that matter**

- **Picking meals:** the picker opens with the prompt "Pick your breakfast / lunch / dinner". Recipes marked as meal-prep show "makes 4" so one cook can fill four lunch slots at once.
- **Half-plate reminder:** each recipe view has a small optional line at the top: "Serve half first. Seconds are the other half." It can be turned off in Settings.
- **Volume add-ons:** each recipe view has a "Bulk it up" expander listing the free-volume foods and the matching big-bowl build from the seed data.
- **Shopping list:** combines the same ingredient across recipes (2 lb chicken thighs + 2 lb chicken thighs = 4 lb), ignores pantry staples the user has ticked as "always have", and is sorted Protein, Produce and Frozen, Carbs, Pantry.
- **Which gym day:** the user sets their training weekdays in Settings (default Monday, Tuesday, Thursday, Friday). The app cycles Day 1 to Day 4 in order across those weekdays. If a day is skipped, the next session is simply the next day in the cycle. A "Do a different day" button lets the user choose manually.
- **Workout check-in:** after finishing, one screen asks "How did it go?" with three choices (Great, Fine, Rough) and an optional note. Saved to a simple history list. No scoring.
- **Lifting notes:** per exercise, the last weight and reps used are shown next time as "Last time: 135 x 8". This is weight on the bar only.
- **Sauna timer:** presets of 10, 15 and 20 minutes plus custom. Runs as a foreground service with a notification, plays a sound and vibrates at the end, and logs the minutes to that day's history. Also allow "Log sauna time" by hand without running the timer.
- **Rest timer:** 60, 90, 120 and 180 second buttons on the Gym screen.
- **History:** a plain list by date: meals planned, workout done with the check-in, sauna minutes. Read-only, no charts.

## Data model

Room tables. Field names are suggestions.

| Table | Fields | Notes |
| --- | --- | --- |
| Recipe | id, name, mealType (BREAKFAST, LUNCH, DINNER, SOUP), cuisineTags, servings, servingSizeText, nutritionText, steps (ordered list), volumeTip, isMealPrep, isUserCreated | nutritionText is display-only text, never parsed or summed |
| Ingredient | id, recipeId, name, quantity, unit, storeSection (PROTEIN, PRODUCE_FROZEN, CARBS, PANTRY), isPantryStaple | quantity is for the whole recipe, not per serving |
| MealPlanEntry | id, date, slot (BREAKFAST, LUNCH, DINNER), recipeId | one row per filled slot |
| ShoppingCheck | weekStartDate, ingredientKey, checked | remembers ticked items for the week |
| WorkoutDay | id, order (1 to 4), name | seeded with the four days |
| Exercise | id, workoutDayId, order, name, setsText, repsText, groupLabel, alternatives (list), note | groupLabel ties supersets together (A, B, C) |
| WorkoutSession | id, date, workoutDayId, feeling (GREAT, FINE, ROUGH), note | written at check-in |
| SetLog | id, sessionId, exerciseId, exerciseNameUsed, weight, reps | optional; drives "Last time" |
| SaunaLog | id, date, minutes | from the timer or entered by hand |
| Settings (DataStore) | trainingWeekdays, showNutrition, showHalfPlateTip, weightUnit (lb default), pantryStaples |  |

There is deliberately no table for body weight, calorie totals or goals.

## Seed data: recipes

Nineteen recipes from the meal plan doc. Turn each into one Recipe row plus Ingredient rows. Quantities are for the whole recipe. The line after each name is: serves, serving size, approximate per-serving nutrition (display text only).

### Breakfasts

**B1. Egg white and chorizo breakfast tacos** (Hispanic) Serves 1 · 3 tacos · ~520 cal, 42 g protein, 40 g carbs, 20 g fat

- Ingredients: 1 cup liquid egg whites; 1 egg; 2 oz soy or chicken chorizo; 3 corn tortillas; 1/4 cup pico de gallo; hot sauce; cilantro
- Steps: 1) Brown the chorizo in a pan. 2) Pour in egg whites and egg, scramble until set. 3) Warm tortillas on the burner or a dry pan. 4) Fill and top with pico, hot sauce and cilantro.
- Volume tip: add a big handful of spinach, peppers and onion to the scramble.

**B2. Mango-coconut overnight oats** (Caribbean) Serves 1 · 1 jar · ~480 cal, 38 g protein, 58 g carbs, 10 g fat · meal-prep

- Ingredients: 1/2 cup rolled oats; 1 scoop vanilla whey protein; 3/4 cup unsweetened almond or light coconut milk; 1/2 cup frozen mango; 1 tbsp chia seeds; pinch of salt
- Steps: 1) Stir everything together in a jar. 2) Refrigerate overnight. 3) Eat cold. Make 3 or 4 jars at once.

**B3. Korean-style egg rice bowl** (Asian) Serves 1 · 1 bowl · ~540 cal, 40 g protein, 50 g carbs, 18 g fat

- Ingredients: 1 cup cooked rice; 2 eggs; 1/2 cup liquid egg whites; 1/2 cup kimchi; 1 tsp sesame oil; 1 tbsp low-sodium soy sauce; 1 pack seaweed snack; gochujang (optional)
- Steps: 1) Heat sesame oil, fry or scramble eggs and whites. 2) Put rice in a bowl, add eggs and kimchi. 3) Drizzle soy, crumble seaweed on top.
- Volume tip: wilt a bag of spinach in the pan first.

**B4. Greek yogurt power bowl** (American) Serves 1 · 1 bowl · ~450 cal, 45 g protein, 45 g carbs, 10 g fat

- Ingredients: 1.5 cups nonfat Greek yogurt; 1 cup mixed berries; 1/4 cup granola; 1 tsp honey; cinnamon
- Steps: 1) Spoon yogurt into a bowl. 2) Top with berries, granola, honey and cinnamon.

### Lunches (meal-prep, each makes 4)

**L1. Pollo guisado with rice and beans** (Caribbean) Serves 4 · 1 portion chicken + 3/4 cup rice + 1/2 cup beans · ~620 cal, 52 g protein, 65 g carbs, 14 g fat

- Ingredients: 2 lb boneless skinless chicken thighs; 1 onion; 1 bell pepper; 4 garlic cloves; 8 oz can tomato sauce; 2 tbsp sofrito; 1 packet sazón; 1 tsp adobo; 1 tbsp olive oil; 2 bay leaves; handful of olives; 3 cups cooked rice; 1 can black or pink beans
- Steps: 1) Season chicken with adobo, brown in oil, set aside. 2) Soften onion, pepper, garlic and sofrito in the same pot. 3) Add tomato sauce, sazón, bay leaves, olives, 1 cup water and the chicken. 4) Cover and simmer 30 minutes. 5) Portion over rice with beans.
- Volume tip: serve over a big bed of arugula and spinach with the rice underneath.

**L2. Teriyaki chicken and broccoli rice bowl** (Asian) Serves 4 · 1 bowl with 3/4 cup rice · ~580 cal, 50 g protein, 62 g carbs, 12 g fat

- Ingredients: 2 lb chicken breast, cubed; 1/2 cup low-sodium soy sauce; 2 tbsp honey; 1 tbsp rice vinegar; 1 tbsp grated ginger; 3 garlic cloves; 1 tsp cornstarch; 1 large bag frozen broccoli; 3 cups cooked jasmine rice; sesame seeds; scallions
- Steps: 1) Whisk soy, honey, vinegar, ginger, garlic and cornstarch. 2) Sear chicken until browned. 3) Add sauce and simmer until glossy. 4) Steam broccoli. 5) Portion rice, chicken and broccoli; top with sesame and scallions.
- Volume tip: two full cups of broccoli per bowl; swap half the rice for cauliflower rice.

**L3. Turkey picadillo bowl** (Caribbean) Serves 4 · 1 portion over 3/4 cup rice or 1 sweet potato · ~560 cal, 48 g protein, 55 g carbs, 16 g fat

- Ingredients: 2 lb 93% lean ground turkey; 1 onion; 1 bell pepper; 4 garlic cloves; 1 can diced tomatoes; 1/3 cup raisins; 1/3 cup olives; 2 tbsp capers; 1 tsp cumin; 1 tsp oregano; 1 packet sazón; 3 cups cooked rice or 4 sweet potatoes
- Steps: 1) Brown the turkey. 2) Add onion, pepper and garlic, cook until soft. 3) Add tomatoes, raisins, olives, capers and seasonings. 4) Simmer 15 minutes. 5) Serve over rice or roasted sweet potato.
- Volume tip: spoon hot over arugula and spinach so the greens wilt.

**L4. Spicy tuna and avocado bowl** (Asian) Serves 1 · 1 bowl · ~540 cal, 46 g protein, 52 g carbs, 18 g fat

- Ingredients: 2 cans or pouches tuna in water; 1 tbsp light mayo; 1 tsp sriracha; 1 tsp soy sauce; 1 cup cooked rice; 1/4 avocado; 1/2 cucumber; pickled ginger; seaweed snacks; sesame seeds
- Steps: 1) Drain tuna, mix with mayo, sriracha and soy. 2) Put rice in a bowl, add tuna, sliced cucumber and avocado. 3) Top with ginger, seaweed and sesame. No cooking.
- Volume tip: double the cucumber and add shredded cabbage.

### Dinners

**D1. Mojo pork tenderloin, sweet potatoes, garlicky spinach** (Caribbean) Serves 4 · about 6 oz pork + 1 sweet potato + spinach · ~600 cal, 55 g protein, 50 g carbs, 18 g fat

- Ingredients: 2 lb pork tenderloin; 2 oranges; 2 limes; 8 garlic cloves; 1 tsp cumin; 1 tsp oregano; 2 tbsp + 1 tbsp + 1 tsp olive oil; 4 sweet potatoes; 1 large tub baby spinach; salt
- Steps: 1) Blend citrus juice, 6 garlic cloves, cumin, oregano, 2 tbsp oil and salt; marinate pork 1 to 24 hours. 2) Cube sweet potatoes, toss with 1 tbsp oil, roast at 425°F for 25 minutes. 3) Sear pork, then roast to 145°F inside, about 15 minutes. Rest 5 minutes. 4) Wilt spinach with 2 garlic cloves in 1 tsp oil. 5) Slice pork and serve.

**D2. Thai basil chicken with jasmine rice** (Asian) Serves 4 · 1 portion over 3/4 cup rice · ~580 cal, 52 g protein, 58 g carbs, 14 g fat

- Ingredients: 2 lb ground chicken; 6 garlic cloves; 3 Thai chilies or 1 jalapeño; 1 onion; 3 tbsp oyster sauce; 2 tbsp low-sodium soy sauce; 1 tbsp fish sauce; 1 tsp sugar; 2 cups basil; 1 bag frozen green beans; 3 cups cooked jasmine rice; 4 eggs (optional)
- Steps: 1) Stir-fry garlic and chili 30 seconds. 2) Add chicken and onion, brown well. 3) Add green beans and the sauces and sugar, cook 3 minutes. 4) Stir in basil off the heat. 5) Serve over rice, fried egg on top if wanted.
- Volume tip: double the green beans, add zucchini, rice on the side.

**D3. Jerk salmon with rice and peas and mango salsa** (Caribbean) Serves 4 · 1 fillet + 3/4 cup rice and peas · ~620 cal, 48 g protein, 52 g carbs, 24 g fat

- Ingredients: 4 salmon portions (6 oz each); 2 tbsp jerk seasoning; 1.5 cups rice; 1 can light coconut milk; 1 can kidney beans; 2 scallions; thyme; 1/2 tsp allspice; 1 mango; 1/4 red onion; cilantro; 1 lime; 1 jalapeño
- Steps: 1) Rub salmon with jerk seasoning. 2) Cook rice in coconut milk plus water with beans, scallion, thyme and allspice. 3) Bake salmon at 400°F for 12 to 14 minutes. 4) Dice mango, onion, jalapeño and cilantro, add lime juice. 5) Plate with salsa on top.

**D4. Lean beef bulgogi with kimchi and rice** (Asian) Serves 4 · 1 portion over 3/4 cup rice · ~610 cal, 50 g protein, 55 g carbs, 20 g fat

- Ingredients: 2 lb sirloin or flank steak; 1/3 cup low-sodium soy sauce; 2 tbsp brown sugar; 1 Asian pear or apple; 4 garlic cloves; 1 tbsp ginger; 1 tbsp sesame oil; 2 scallions; 3 cups cooked rice; kimchi; bok choy or broccoli
- Steps: 1) Freeze the beef 30 minutes, slice thin. 2) Grate pear, mix with soy, sugar, garlic, ginger, sesame oil and scallions; marinate 1 hour or more. 3) Sear in a very hot pan in batches. 4) Steam the greens. 5) Serve with rice and kimchi.
- Volume tip: half rice, half cauliflower rice, with cucumber, carrot and radish on the side.

**D5. Smash-burger bowl** (American) Serves 1 · 2 thin patties + greens + 1 cup wedges · ~580 cal, 48 g protein, 45 g carbs, 22 g fat

- Ingredients: 7 oz 90% lean ground beef; 2 big handfuls arugula and baby spinach; pickles; 1 tomato; 1/4 red onion; 1 potato; 1 tbsp light mayo; 1 tsp ketchup; 1 tsp mustard
- Steps: 1) Cut potato into wedges, roast at 425°F for 25 minutes. 2) Form beef into 2 balls, smash flat in a very hot pan, salt, cook 2 minutes a side. 3) Mix mayo, ketchup, mustard and a splash of pickle juice. 4) Pile greens, tomato, onion and pickles in a bowl, add patties, wedges and sauce.

**D6. Slow-cooker ropa vieja** (Caribbean) Serves 6 · 1 portion + 3/4 cup rice or yuca · ~590 cal, 54 g protein, 55 g carbs, 15 g fat · meal-prep

- Ingredients: 3 lb flank steak; 2 onions; 2 bell peppers; 6 garlic cloves; 1 can crushed tomatoes; 1/2 cup low-sodium broth; 2 tbsp sofrito; 1 tsp cumin; 1 tsp oregano; 2 bay leaves; 1/3 cup olives; rice or yuca; 1 lime
- Steps: 1) Put everything except olives, rice and lime in the slow cooker. 2) Cook on low 8 hours. 3) Shred the beef with two forks, stir in olives. 4) Serve with rice or boiled yuca and a lime wedge.

**D7. Sheet-pan fajita chicken with black beans** (Hispanic) Serves 1 · 1 bowl or 2 tacos · ~560 cal, 52 g protein, 50 g carbs, 14 g fat

- Ingredients: 8 oz chicken breast; 1 bell pepper; 1/2 onion; 1 tsp oil; fajita seasoning; 1/2 cup black beans; 2 corn tortillas or 3/4 cup rice; salsa; 1/4 avocado
- Steps: 1) Slice chicken, pepper and onion, toss with oil and seasoning. 2) Roast on a sheet pan at 425°F for 18 minutes. 3) Warm the beans. 4) Build tacos or a bowl with salsa and avocado.
- Volume tip: use a shredded cabbage base and eat it as a huge bowl.

### Volume soups (mealType SOUP, can fill a lunch or dinner slot)

**S1. Lighter sancocho-style chicken soup** (Caribbean) · Serves 6 · 1 big bowl with one piece of starch · no nutrition text

- Ingredients: 2 lb chicken thighs; 1 lb calabaza or sweet potato; 1 lb yuca; 2 ears corn, cut in rounds; 1/2 head cabbage; 2 carrots; 2 celery stalks; 2 tbsp sofrito; cilantro; 2 limes; 8 cups low-sodium broth
- Steps: 1) Simmer chicken in broth with sofrito 20 minutes. 2) Add yuca, calabaza, corn and carrots, cook 20 minutes. 3) Add cabbage and celery, cook 10 minutes. 4) Shred chicken back in, finish with cilantro and lime.

**S2. Ginger chicken and vegetable soup** (Asian) · Serves 4 · 1 big bowl

- Ingredients: 8 cups low-sodium chicken broth; 2 tbsp ginger; 4 garlic cloves; 1.5 lb chicken breast; 4 heads baby bok choy; 8 oz mushrooms; 1/2 head napa cabbage; 3 scallions; 1 tsp sesame oil; 2 tbsp soy sauce; rice noodles (optional)
- Steps: 1) Simmer broth with ginger and garlic. 2) Poach chicken 15 minutes, remove and shred. 3) Add mushrooms and cabbage 5 minutes, bok choy 2 minutes. 4) Return chicken, add soy, sesame oil and scallions.

**S3. Caldo de pollo** (Hispanic) · Serves 6 · 1 big bowl + 1 corn tortilla

- Ingredients: 2 lb chicken breast or thighs; 8 cups low-sodium broth; 2 zucchini; 2 carrots; 1/2 head cabbage; 1 chayote; 2 tomatoes; 1/2 cup rice; cilantro; 2 limes; corn tortillas; hot sauce
- Steps: 1) Simmer chicken in broth 20 minutes, remove and shred. 2) Add rice, carrots, chayote and tomato, cook 12 minutes. 3) Add zucchini and cabbage, cook 8 minutes. 4) Return chicken, finish with cilantro and lime.

**S4. Protein egg drop soup** (Asian) · Serves 1 · 1 big bowl

- Ingredients: 3 cups low-sodium broth; 1 tsp ginger; 1 tbsp soy sauce; 2 handfuls spinach; 1/2 cup liquid egg whites; 1 egg; 1 scallion
- Steps: 1) Simmer broth with ginger and soy. 2) Add spinach. 3) Beat egg whites and egg, pour in slowly while stirring. 4) Top with scallion. Ready in 10 minutes.

### Free-volume foods (for the "Bulk it up" expander)

Arugula, baby spinach, shredded cabbage, bok choy, kale, cucumber, tomato, bell pepper, radish, celery, onion, jalapeño, broccoli, cauliflower, green beans, zucchini, mushrooms, asparagus, cauliflower rice mixed half-and-half with rice, kimchi, pickles, pickled onions, salsa, pico de gallo, broth, lime, vinegar, hot sauce, herbs.

### Pantry staples (pre-ticked as "always have", editable)

Olive oil, sesame oil, low-sodium soy sauce, rice vinegar, oyster sauce, fish sauce, sriracha, gochujang, honey, cumin, oregano, allspice, bay leaves, adobo, sazón, salt, cornstarch, hot sauce, mustard, ketchup.

## Seed data: workouts

Four days from the workout plan doc. Exercises sharing a group letter are done back to back (a superset), then rest. "To failure" means stop when another clean rep isn't possible. The first swap listed is the default alternative.

### Day 1: Upper Body

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Barbell bench press | 3 x 6–10 | Smith machine bench; chest press machine; dumbbell bench |
| B | Dumbbell press | 4 x 8–12 | Incline machine press |
| B | Weighted chin-ups | 4 x 3–6 | Lat pulldown, underhand grip; assisted chin-up machine |
| C | Curls | 4 x 8–12 | Cable curls; machine curls |
| C | Hanging knee raises | 4 x to failure | Captain's chair knee raises; ab machine |
| C | Face pulls | 4 x 15–20 | Reverse pec-deck |
| D | Push-ups | 4 x to failure | Chest press machine, light |
| D | Side raises | 4 x 8–12 | Cable lateral raise; machine lateral raise |
| D | Calf raises | 4 x to failure | Seated calf raise; leg-press calf raise |

### Day 2: Lower Body

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Barbell squat | 3 x 6–10 | Leg press; hack squat; Smith machine squat |
| B | Good mornings | 3 x 6–12 | Romanian deadlift; seated or lying leg curl |
| C | Lunges | 4 x 10–15 | Walking dumbbell lunges; Bulgarian split squats; leg extension |
| C | Bodyweight pull-ups | 4 x to failure | Lat pulldown; assisted pull-up machine |
| D | Wrist curls | 4 x 8–12 | Dead hangs; farmer's carries |
| E | Hanging leg raises | 4 x to failure | Captain's chair leg raises; cable crunches |
| E | Calf raises | 4 x to failure | Standing calf machine |

### Day 3: Upper Body

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Standing overhead press | 4 x 6–10 | Seated dumbbell shoulder press; shoulder press machine; Smith machine press |
| B | Pause bench press (hold 1–2 seconds on the chest) | 4 x 4–8 | Incline dumbbell press with a pause |
| B | Face pulls | 4 x 15–20 | Reverse pec-deck; band pull-aparts |
| C | Preacher curls | 4 x 6–10 | Machine preacher curl; incline dumbbell curl |
| C | Bent-over side raises | 4 x 8–12 | Rear-delt machine; cable rear-delt fly |
| C | Calf raises | 4 x to failure | Any calf machine |
| D | Rows | 3 x 8–12 | Chest-supported row machine; cable row; dumbbell row |

### Day 4: Full Body

| Group | Exercise | Sets x reps | Swaps |
| --- | --- | --- | --- |
| A | Reverse lunges | 4 x 10–15 | Leg press; hack squat |
| A | Chest flies | 4 x 10–15 | Pec-deck; cable crossover |
| B | Weighted pull-ups | 4 x 3–6 | Lat pulldown |
| B | Push-ups | 4 x to failure | Machine chest press; dips |
| C | Romanian deadlift | 3 x 8–12 | Leg curl machine; back extension |
| D | Triceps extensions | 4 x 8–12 | Cable pushdowns; overhead cable extension; dips |
| D | Face pulls | 4 x 15–20 | Reverse pec-deck |
| D | Leg raises | 4 x to failure | Ab machine |

### Text to show on the Gym screen

- Rest 2 to 3 minutes after heavy barbell sets, 60 to 90 seconds after everything else.
- Leave one or two reps in the tank on most sets. Push the last set harder.
- When every set reaches the top of the rep range, add 5 lb for upper body or 10 lb for lower body next time.
- Gym packed? Do the superset exercises one after the other instead of back to back.
- Short on time? Skip the last group, not the first lift.
- Optional after lifting: 20 to 30 minutes of easy cardio, then sauna.

## Build and install

The result is a debug APK you copy to your phone. No Play Store, no developer account.

**On the computer (Claude Code does most of this)**

1. Install Android Studio, or just the Android command-line tools plus a JDK. Claude Code should check what is already installed and say exactly what is missing before starting.
2. Claude Code creates the project in a new folder and writes the code.
3. It builds with `./gradlew assembleDebug` (on Windows, `gradlew.bat assembleDebug`).
4. The APK lands at `app/build/outputs/apk/debug/app-debug.apk`.

**Onto the phone, either way**

- **Cable:** turn on Developer options and USB debugging on the phone, plug it in, and run `adb install app/build/outputs/apk/debug/app-debug.apk`.
- **No cable:** send the APK to yourself (Google Drive, email), open it on the phone, and allow "Install unknown apps" for the app you opened it from when Android asks.

**Good to know**

- Android may show a Play Protect warning for an app it has never seen. That is expected for a personal build.
- To update later, build again and install over the top. Data stays as long as the package name and signing key stay the same, so keep building on the same computer.
- Use Export in Settings before switching phones or computers.

## First prompt for Claude Code

Save this doc as `SPEC.md` in an empty folder, open Claude Code in that folder, and paste:

```
Read SPEC.md in this folder. It is the full spec for a personal Android app.

1. First, check this machine for a JDK, the Android SDK and adb. Tell me
   what is missing and how to install it before writing any code.
2. Then scaffold the project (Kotlin, Jetpack Compose, Room) exactly as
   the Tech setup section describes, using current stable versions.
3. Put all recipes and workouts from the two Seed data sections into
   assets/seed.json and load them on first launch.
4. Build in this order, running ./gradlew assembleDebug after each step
   and fixing errors before moving on:
   a. Data layer and seed loading
   b. Plan tab and recipe picker
   c. Today tab
   d. Cook tab with shopping list
   e. Gym tab with rest timer and check-in
   f. Sauna timer as a foreground service with notification
   g. Settings, export and import
5. Follow the ground rules in "What it is" strictly: no calorie totals,
   no body-weight tracking, no streaks or guilt messaging.
6. When it builds cleanly, tell me the APK path and how to install it.
```

**Ideas for later, not version one:** a home-screen widget showing today's meals, a "leftovers" slot type, adding your own recipes by photo, and a reminder notification at a time you choose to start Sunday prep.
