# Google Play listing text

Paste these into Play Console > Grow users > Store presence > Main store listing. Limits are
Google's; the counts below fit them. Don't mention any manga, film or brand in the listing, and
avoid "best", "#1", "free" in the title or icon, prices, or rankings (Play rejects them).

## App name (30 characters max)

    Meal & Gym: Planner & Gym Log

Search Play for "Meal & Gym" first. If another app already uses a very similar name, pick
something else here and set the same name in `store.appName` (see the launch checklist).

## Short description (80 characters max)

    Plan your meals, shop once and log your gym sets. For you or the whole house.

## Full description (4,000 characters max)

```
Meal & Gym puts your week's meals, your shopping list and your gym log in one place.

PLAN THE WEEK
• Breakfast, lunch and dinner for each day, plus an optional snack.
• Pick from a library of 30+ high-protein recipes, or add your own.
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
• Pick a starter plan: Full body 3 days, Upper / lower 4 days, or Glute focus 3 days. Or build your own.
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
• No account and no sign-in. Your plans, workouts and history stay on your phone.
• Export a backup file whenever you like.
• Meal & Gym never adds up calories, weighs you or counts streaks.

The free version shows a small banner on some screens (never during a workout or while cooking). A one-time "Remove ads" purchase turns them off for good.

Meal & Gym is a planner, not medical, nutrition or fitness advice. Check with a doctor before starting a new eating or training plan.
```

## Other listing fields

| Field | Value |
| --- | --- |
| App category | Health & Fitness |
| Tags (pick up to 5) | Meal planner, Workout tracker, Recipes, Grocery list, Fitness |
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
