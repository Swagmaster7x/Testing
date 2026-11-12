# Google Play kit for the store edition

Everything needed to publish the store edition of Meal & Gym, apart from the accounts only you
can create.

| File | What it's for |
| --- | --- |
| [launch-checklist.md](launch-checklist.md) | Step by step: accounts, AdMob IDs, release key, Play Console forms, testing, launch |
| [listing.md](listing.md) | App name, short and full description, category, graphics list |
| [data-safety.md](data-safety.md) | Answers for the Data safety form and the other App content declarations |
| [privacy-policy.html](privacy-policy.html) | The privacy policy page to host publicly (fill in the two placeholders) |
| `graphics/` | 512 x 512 icon, 1024 x 500 feature graphic, eight captioned 1080 x 1920 phone screenshots |

## What's different in the store edition

| | Personal edition | Store edition |
| --- | --- | --- |
| Package | `com.personal.mealgym` (sideloaded) | your own, e.g. `com.yourname.mealgym` |
| People | Swag and Ashley, built in | Anyone: a short questionnaire on first launch builds their plan; add more in Settings > People |
| Plan builder | None (their plans are their own) | Daily calorie and protein guide, workout plan, meal sizes and a first week of meals from the setup answers; redo in Settings > My plan |
| Allergies | Not asked | Nine allergens plus beef, pork and poultry kept off the plan; allergens listed on each recipe |
| Cupboard | Cook > What can I make from my cupboard? | The same |
| Starter plans | Your own workout days | Full body 3 days, Upper / lower 4 days, Glute focus 3 days, At home 3 days, or empty |
| Recipes | 72, including the coffee-shop orders and daily guide | 67 shared recipes and snacks |
| Exercise help | Photos from free-exercise-db plus steps | Three written form cues per move plus "Watch a demo" |
| Looks | 15 ready-made plus your own, in Settings > Look | The same, and chosen during setup |
| Internet | None (blocked in the manifest) | Ads and Google Play billing only |
| Ads | None | Banner on Plan, Cook, recipes and History, after consent; "Remove ads" one-time purchase |
