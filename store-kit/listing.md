# Google Play listing text

Paste these into Play Console > Grow users > Store presence > Main store listing. Limits are
Google's; the counts below fit them. Don't mention any manga, film or brand in the listing, and
avoid "best", "#1", "free" in the title or icon, prices, or rankings (Play rejects them).

**Keep restaurant names out of the listing.** The app names 12 chains on its "What are you
craving?" pages, as plain text with a not-affiliated note. The listing is different: Play's
rules on impersonation and intellectual property are applied to the title, descriptions and
screenshots, and another company's name there can get a listing rejected or reported. So the
text below says "popular fast-food and coffee chains" and none of the screenshots show those
pages. Leave it that way.

## App name (30 characters max)

    Meal & Gym: Planner & Gym Log

Search Play for "Meal & Gym" first. If another app already uses a very similar name, pick
something else here and set the same name in `store.appName` (see the launch checklist).

## Short description (80 characters max)

    A meal and workout plan built for you. Cook from your cupboard. Log your gym.

## Full description (4,000 characters max)

```
Meal & Gym puts your week's meals, your shopping list and your gym log in one place, and builds the plan for you.

A PLAN BUILT FROM YOUR ANSWERS
• Tell it your goal, a few details, the cuisines you like and what you can't eat. Every question is optional.
• Get an estimated daily calorie and protein guide, a workout plan for the gym or home, and a first week of meals sized to fit.
• Allergies and foods you don't eat are kept off your plan and out of your suggestions.

COOK FROM YOUR CUPBOARD
• Tick what's in your fridge and cupboards and see what you can make right now.
• Recipes that are nearly there show exactly what's missing, and one tap plans them.

180 RECIPES FROM AROUND THE WORLD
• Healthy, high-protein dishes from Asia, Africa, Europe, the Middle East, the Caribbean and the Americas, made with ordinary supermarket ingredients.
• Vegetarian, fish and egg dishes alongside chicken, beef and pork, each with approximate calories and protein per serving.

WHEN YOU'RE CRAVING TAKEOUT
• Pick from a dozen popular fast-food and coffee chains and see the better choices on the menu, with approximate calories and protein and tips for ordering.
• Or make it at home: lighter home versions of restaurant favorites, grilled or baked.

PLAN THE WEEK
• Breakfast, lunch and dinner for each day, plus an optional snack.
• Pick from the recipe library or add your own.
• "Fill my week" plans the empty slots for you from the recipes you like.
• Meal-prep recipes fill several days in one go. "Repeat last week" copies a week you liked.
• Filter by protein, cuisine or "Not chicken", mark favourites, and hide recipes for a while.

SHOP ONCE
• The shopping list builds itself from your plan, grouped by store section.
• Amounts are added up across recipes and follow your portion size.
• Tick off what you always have in the pantry and it stays off the list.
• Share the list as text with anyone.

COOK
• Step-by-step cooking mode with big text, and the screen stays on.
• "Make it with..." swaps the main protein, and the shopping list follows.

TRAIN
• Starter plans: Full body 3 days, Upper / lower 4 days, Glute focus 3 days, or At home 3 days with no equipment. Or build your own.
• Tick off sets, swap a machine when the gym is busy, and note weight and reps ("Last time: 135 x 8").
• A rest timer, written form tips for every exercise, and a quick "How did it go?" after each workout.
• Missed a day? The plan just moves on to the next session. No streaks, no guilt.
• A sauna timer that keeps running with the screen off.

FOR THE WHOLE HOUSEHOLD
• Everyone on the phone gets their own plan, gym days and history.
• One shared shopping list covers everyone's meals.
• Send your meal plan to another phone as a file.

YOUR LOOK
• 15 looks to choose from, from dark fantasy and Y2K glam to deep sea, cherry blossom, neon arcade and track day.
• Or make your own: pick your colours, heading font, corners, day or night, and extras like sparkles.
• Each person on the phone picks their own.

PRIVATE BY DESIGN
• No account and no sign-in. Your answers, plans, workouts and history stay on your phone.
• Export a backup file whenever you like.
• No food logging, no weigh-ins and no streaks. The calorie guide is a guide, not a scoreboard.

The free version shows a small banner on some screens (never during a workout or while cooking). A one-time "Remove ads" purchase turns them off for good.

Meal & Gym is a planner, not medical, nutrition or fitness advice. Its calorie and protein guide is an estimate for healthy adults. Allergen information comes from ingredient names, so always check food labels. Restaurant figures are approximate and menus change, so check the restaurant's own nutrition and allergen information; the app is not affiliated with any restaurant. Check with a doctor before starting a new eating or training plan.
```

## Other listing fields

| Field | Value |
| --- | --- |
| App category | Health & Fitness |
| Tags (pick up to 5) | Meal planner, Workout planner, Recipes, Grocery list, Fitness |
| Contact email | A support address you check (required, shown publicly) |
| Website | Optional; needed later if you want an app-ads.txt file |
| Privacy policy | The public URL where you host `privacy-policy.html` |

## Graphics (in `graphics/`)

| Asset | File | Google's requirement |
| --- | --- | --- |
| App icon | `icon-512.png` | 512 x 512 PNG, no transparency needed; Play rounds the corners |
| Feature graphic | `feature-graphic-1024x500.png` | 1024 x 500, no transparency |
| Phone screenshots | `screenshots/01-…08-*.png` | 2 to 8, 1080 x 1920 here (sides between 320 and 3,840 px, at most 2:1) |

Regenerate them after UI changes:

    ./gradlew recordRoborazziStoreDebug --tests '*StoreListingScreenshots*' --tests '*StoreGraphics*'
    python3 tools/store_graphics.py
