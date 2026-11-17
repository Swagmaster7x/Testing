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

    Yoked: Meal Planner & Gym Log

That is 29 characters. Other fitness apps already use this word: "Yoke: Gym Trainer AI & Planner"
is on Google Play, and "Yoked: AI Trainer" and "Yoked - Body Scanner" are on the App Store. None
of them is a meal planner and none is titled exactly like this, but search Play for "Yoked" once
more just before launch. If a close match has appeared, change the title here and set the same
name in `store.appName` (see the launch checklist). Keep the words after the colon: they are what
sets this listing apart and what people search for.

## Short description (80 characters max)

    A meal and workout plan built for you. Cook from your cupboard. Log your gym.

## Full description (4,000 characters max)

```
Yoked puts your week's meals, your shopping list and your gym log in one place, and builds the plan for you.

A PLAN BUILT FROM YOUR ANSWERS
• Tell it your goal, a few details, the cuisines you like and what you can't eat. Every question is optional.
• Get an estimated daily calorie and protein guide, a workout plan for the gym or home, and a first week of meals sized to fit.
• Allergies and foods you don't eat are kept off your plan and out of your suggestions.

A WEEK THAT ADDS UP
• Breakfast, lunch and dinner for each day, plus an optional snack. See what each planned day comes to beside your guide.
• "Fill my week" plans the empty slots for you, aiming for your guide and favouring recipes you loved.
• Not cooking? Mark a meal as eating out, leftovers or skipped. Having guests? Add servings and the shopping list follows.
• Meal-prep recipes fill several days in one go. "Repeat last week" copies a week you liked.

180 RECIPES FROM AROUND THE WORLD
• Healthy, high-protein dishes from Asia, Africa, Europe, the Middle East, the Caribbean and the Americas, made with ordinary supermarket ingredients.
• Vegetarian, fish and egg dishes alongside chicken, beef and pork, each with approximate calories and protein.
• Filter by protein or cuisine, mark favourites, add your own.

WHEN YOU'RE CRAVING TAKEOUT
• See the better choices at a dozen popular fast-food and coffee chains, with approximate calories and protein and tips for ordering.
• Or make it at home: lighter home versions of restaurant favorites, grilled or baked.

SHOP, STOCK AND COOK
• The shopping list builds itself from your plan, grouped by store section, with amounts added up across recipes.
• What you tick off goes into your cupboard. Tick what's already in the house, and see what you can make right now and what to use up first.
• Step-by-step cooking mode with big text, the screen kept on, and a timer for every time a step mentions.
• Cook for more or fewer: the amounts scale. "Make it with..." swaps the main protein.
• Say how it went when you've cooked it, and the app plans around your taste.

TRAIN AND PROGRESS
• Starter plans: Full body 3 days, Upper / lower 4 days, Glute focus 3 days, or At home 3 days with no equipment. Or build your own.
• Log every set. Next time the app suggests what to try ("Try 140 x 8") from what you did and your plan's rep range.
• New bests are called out, each exercise has its own trend, and the week shows your sets by muscle group.
• A rest timer, written form tips for every exercise, and a quick "How did it go?" after each workout.
• Missed a day? The plan just moves on to the next session. No streaks, no guilt.
• A sauna timer that keeps running with the screen off.

FOR THE WHOLE HOUSEHOLD
• Everyone on the phone gets their own plan, gym days and history.
• One shared shopping list and cupboard cover everyone's meals.

YOUR LOOK
• 15 looks to choose from, from dark fantasy and Y2K glam to deep sea, cherry blossom and neon arcade, or make your own.

PRIVATE BY DESIGN
• No account and no sign-in. Your answers, plans, workouts and history stay on your phone.
• Export a backup file whenever you like.
• No food logging, no weigh-ins and no streaks. Totals are for the meals you planned, and the guide is a guide, not a scoreboard.

The free version shows a small banner on some screens (never during a workout or while cooking). A one-time "Remove ads" purchase turns them off for good.

Yoked is a planner, not medical, nutrition or fitness advice. Its calorie and protein guide and its lifting suggestions are estimates for healthy adults. Allergen information comes from ingredient names, so always check food labels. Restaurant figures are approximate and menus change, so check the restaurant's own nutrition and allergen information; the app is not affiliated with any restaurant. Check with a doctor before starting a new eating or training plan.
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
