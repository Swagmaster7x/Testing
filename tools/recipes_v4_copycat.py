"""Version 4 recipes: home versions of popular restaurant items.

Names describe the dish; app/src/main/assets/restaurants.json says which menu item each one is
like. Lighter than the originals: baked or grilled, not fried.
"""
from recipe_lib import C, P, T, V, ing, recipe, swap

NEW_MACROS = {}
NEW_NEGLIGIBLE = set()
NO_COOK = {"CC5"}

COPY = "Copycat"

RECIPES = [
    recipe("CC1", "Egg and cheese breakfast muffin", "BREAKFAST", ["American", COPY], 1, "1 sandwich", "EGG", [
        ing(1, None, "whole-wheat English muffins", C), ing(1, None, "egg", P), ing("1/4", "cup", "liquid egg whites", P),
        ing(2, "slices", "Canadian bacon", P), ing(1, "oz", "cheddar", T, "1 slice"), ing(None, None, "cooking spray", T),
        ing(None, None, "black pepper", T),
    ], [
        "Split and toast the muffin.",
        "Warm the Canadian bacon in a nonstick pan for 1 minute a side and set it on the muffin.",
        "Whisk the egg with the egg whites. Pour into the sprayed pan and fold the edges in to make a round patty; cook for about 2 minutes until set.",
        "Stack the egg and cheese on the bacon, close the muffin and let the cheese melt for a minute.",
    ]),
    recipe("CC2", "Grilled chicken nuggets with honey mustard", "LUNCH", ["American", COPY], 4, "about 10 nuggets with sweet potato wedges", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cut into 1-inch pieces"), ing("1/4", "cup", "dill pickle juice", T),
        ing(2, "tbsp", "olive oil", T), ing(1, "tsp", "paprika", T), ing(1, "tsp", "garlic powder", T),
        ing("1 1/2", "lb", "sweet potatoes", C, "cut into wedges"), ing("1/4", "cup", "nonfat Greek yogurt", P),
        ing(1, "tbsp", "honey", T), ing(1, "tbsp", "mustard", T), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F. Toss the sweet potato wedges with 1 tbsp oil and salt and roast for 25 minutes, turning once.",
        "Soak the chicken in the pickle juice for 15 minutes. Drain and pat dry.",
        "Toss the chicken with the rest of the oil, the paprika, garlic powder and pepper.",
        "Cook in a hot grill pan or skillet for 3 to 4 minutes a side until browned and 165°F inside.",
        "Stir the yogurt, honey and mustard into a dipping sauce. Serve with the wedges.",
    ], prep=True),
    recipe("CC3", "Pickle-brined grilled chicken sandwich", "DINNER", ["American", COPY], 4, "1 sandwich", "CHICKEN", [
        ing("1 1/4", "lb", "chicken breast", P, "4 thin cutlets"), ing("1/2", "cup", "dill pickle juice", T),
        ing(4, None, "whole-wheat buns", C), ing("1/4", "head", "romaine lettuce", V), ing(2, None, "tomatoes", V),
        ing(8, None, "pickles", T, "slices"), ing(1, "tbsp", "olive oil", T), ing(2, "tbsp", "light mayo", T),
        ing(1, "tsp", "paprika", T), ing(1, "tsp", "garlic powder", T), ing(None, None, "black pepper", T),
    ], [
        "Pound the chicken to an even half inch. Soak it in the pickle juice in the fridge for 30 minutes (up to 2 hours).",
        "Pat dry and rub with the oil, paprika, garlic powder and pepper.",
        "Grill or pan-sear over medium-high heat for 4 to 5 minutes a side until 165°F. Rest for 5 minutes.",
        "Toast the buns.",
        "Build the sandwiches with the mayo, lettuce, tomato and pickles.",
    ]),
    recipe("CC4", "Braised chipotle tofu burrito bowls", "LUNCH", ["Hispanic", COPY], 4, "1 bowl with 1/2 cup rice", "VEGETARIAN", [
        ing(2, "blocks", "firm tofu", P, "14 oz each"), ing(None, None, "chipotles in adobo", T, "2, minced"),
        ing(1, "tbsp", "tomato paste", T), ing(2, None, "garlic cloves", V), ing(1, "tsp", "cumin", T),
        ing(1, "tsp", "oregano", T), ing(1, "tbsp", "olive oil", T), ing("1/2", "cup", "low-sodium broth", T),
        ing(2, "cups", "cooked brown rice", C), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing(2, None, "bell peppers", V), ing(1, None, "onion", V), ing(1, "cup", "pico de gallo", V),
        ing(1, None, "avocado", V), ing(1, "head", "romaine lettuce", V), ing(1, None, "lime", V), ing(None, None, "salt", T),
    ], [
        "Pat the tofu dry and crumble it into small pieces.",
        "Brown it in the oil over medium-high heat for 8 to 10 minutes until golden at the edges.",
        "Stir in the chipotles, tomato paste, minced garlic, cumin, oregano, broth and salt. Simmer for 5 minutes until saucy.",
        "Cook the sliced peppers and onion in a dry, hot pan for 5 minutes until charred at the edges. Warm the beans.",
        "Build the bowls: lettuce, rice, beans, tofu, vegetables, pico de gallo, avocado and lime.",
    ], prep=True),
    recipe("CC5", "Turkey and veggie sub", "LUNCH", ["American", COPY], 2, "1 six-inch sub", "TURKEY", [
        ing(2, None, "whole-wheat sub rolls", C), ing(8, "oz", "deli turkey", P, "low-sodium"),
        ing(2, "slices", "Swiss cheese", T), ing("1/4", "head", "romaine lettuce", V), ing(1, None, "tomatoes", V),
        ing("1/2", None, "cucumber", V), ing("1/2", None, "bell pepper", V), ing("1/4", None, "red onion", V),
        ing(4, None, "pickles", T, "slices"), ing(1, "tsp", "olive oil", T), ing(None, None, "mustard", T),
        ing(None, None, "red wine vinegar", T), ing(None, None, "oregano", T), ing(None, None, "black pepper", T),
    ], [
        "Split the rolls and toast them lightly if you like.",
        "Layer on the turkey and cheese.",
        "Pile on the lettuce, tomato, cucumber, pepper, onion and pickles.",
        "Finish with mustard, the oil, a splash of vinegar, oregano and pepper.",
    ], tip="Double the vegetables; they add crunch for almost nothing."),
    recipe("CC6", "Crunchy beef and bean wrap", "DINNER", ["Hispanic", COPY], 4, "1 wrap", "BEEF", [
        ing("3/4", "lb", "90% lean ground beef", P), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing(4, None, "whole-wheat tortillas", C, "large"), ing(4, None, "corn tortillas", C),
        ing("1/2", "cup", "shredded cheese", T), ing("1/2", "cup", "nonfat Greek yogurt", P), ing(1, "cup", "salsa", V),
        ing("1/2", "head", "romaine lettuce", V, "shredded"), ing(2, None, "tomatoes", V), ing(1, "tbsp", "chili powder", T),
        ing(1, "tsp", "cumin", T), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 400°F. Bake the corn tortillas on a rack for 6 to 8 minutes until crisp.",
        "Brown the beef with the chili powder, cumin and salt, breaking it up, until no pink remains (160°F). Stir in the beans.",
        "On each large tortilla, layer beef and beans, cheese, a crisp tortilla, yogurt, salsa, lettuce and tomato.",
        "Fold the edges in over the filling in pleats.",
        "Cook seam side down in a dry pan over medium heat for 2 to 3 minutes a side until golden and sealed.",
    ], swaps=[
        swap("Ground turkey", "TURKEY", "90% lean ground beef", "93% lean ground turkey", "Cook to 165°F."),
    ]),
    recipe("CC7", "Egg white and red pepper egg bites", "BREAKFAST", ["American", COPY], 3, "4 bites with a slice of toast", "EGG", [
        ing(2, "cups", "liquid egg whites", P), ing(1, "cup", "cottage cheese", P), ing("1/2", "cup", "shredded cheese", T),
        ing("1/2", "cup", "roasted red peppers", T, "chopped"), ing(2, "handfuls", "baby spinach", V, "chopped"),
        ing(3, "slices", "whole-grain bread", C), ing(None, None, "scallions", V), ing(None, None, "cooking spray", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 325°F. Spray a 12-cup muffin tin well, or use a silicone one.",
        "Blend the egg whites, cottage cheese, shredded cheese, salt and pepper until smooth.",
        "Divide the peppers, spinach and scallions among the cups and pour the egg mixture over them.",
        "Set the tin in a larger pan and pour hot water halfway up the sides. Bake for 25 to 30 minutes until just set.",
        "Cool for 5 minutes. They keep 4 days in the fridge; reheat for 30 to 45 seconds in the microwave. Serve with toast.",
    ], prep=True),
    recipe("CC8", "Spinach and feta breakfast wrap", "BREAKFAST", ["Mediterranean", COPY], 1, "1 wrap", "EGG", [
        ing(1, None, "whole-wheat tortillas", C), ing("3/4", "cup", "liquid egg whites", P),
        ing(2, "handfuls", "baby spinach", V), ing(2, "tbsp", "feta", T), ing(2, "tbsp", "sun-dried tomatoes", T, "chopped"),
        ing(1, "tsp", "olive oil", T), ing(None, None, "black pepper", T),
    ], [
        "Wilt the spinach in the oil for 1 minute.",
        "Add the egg whites and stir gently for about 2 minutes until set. Season with pepper.",
        "Warm the tortilla. Fill it with the eggs, feta and sun-dried tomatoes, fold in the sides and roll it up.",
        "Toast seam side down in the pan for 1 minute.",
    ]),
    recipe("CC9", "Lighter broccoli cheddar soup", "SOUP", ["American", COPY], 4, "1 1/2 cups with toast", "VEGETARIAN", [
        ing(2, "heads", "broccoli", V, "chopped"), ing(2, None, "carrots", V), ing(1, None, "onion", V),
        ing(2, None, "garlic cloves", V), ing(1, "tbsp", "olive oil", T), ing(2, "tbsp", "flour", T),
        ing(3, "cups", "low-sodium broth", T, "vegetable"), ing(2, "cups", "milk", T), ing("1 1/2", "cups", "cheddar", T, "sharp, shredded"),
        ing(1, "can", "white beans", C, "drained and rinsed"), ing(4, "slices", "whole-grain bread", C),
        ing(None, "pinch of", "nutmeg", T), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Cook the diced onion and carrots in the oil for 5 minutes. Add the garlic for 30 seconds, then stir in the flour for 1 minute.",
        "Whisk in the broth and milk. Add the broccoli and beans and simmer for 12 to 15 minutes until tender.",
        "Blend about half of it so the soup is creamy with some pieces left.",
        "Off the heat, stir in the cheddar a handful at a time until melted. Season with nutmeg, salt and pepper.",
        "Serve with toast.",
    ], prep=True),
    recipe("CC10", "String bean chicken stir-fry", "DINNER", ["Asian", COPY], 4, "1 1/2 cups with 3/4 cup rice", "CHICKEN", [
        ing("1 1/4", "lb", "chicken breast", P, "sliced thin"), ing(1, "lb", "green beans", V, "trimmed and halved"),
        ing(1, None, "onion", V, "sliced"), ing(3, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"),
        ing(3, "tbsp", "low-sodium soy sauce", T), ing(1, "tbsp", "oyster sauce", T), ing(1, "tsp", "sesame oil", T),
        ing(2, "tsp", "cornstarch", T), ing(1, "tbsp", "oil", T), ing(3, "cups", "cooked rice", C),
    ], [
        "Toss the chicken with 1 tbsp soy sauce and the cornstarch.",
        "Whisk the rest of the soy sauce with the oyster sauce, sesame oil and 1/4 cup of water.",
        "Stir-fry the chicken in the oil over high heat for 4 to 5 minutes until no pink remains (165°F). Set aside.",
        "Stir-fry the green beans and onion with a splash of water for 4 to 5 minutes until crisp-tender. Add the garlic and ginger for 30 seconds.",
        "Return the chicken, pour in the sauce and toss for 1 minute until glossy. Serve over rice.",
    ], swaps=[
        swap("Tofu", "VEGETARIAN", "chicken breast", "firm tofu, cubed", "Brown the tofu first, 6 to 8 minutes.", 2, "blocks"),
    ]),
    recipe("CC11", "Baked orange chicken with broccoli", "DINNER", ["Asian", COPY], 4, "1 cup chicken with rice and broccoli", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cubed"), ing(2, "tbsp", "cornstarch", T), ing(1, "tbsp", "oil", T),
        ing("3/4", "cup", "orange juice", V), ing(1, None, "orange", V, "zest only"), ing(2, "tbsp", "low-sodium soy sauce", T),
        ing(2, "tbsp", "honey", T), ing(1, "tbsp", "rice vinegar", T), ing(2, None, "garlic cloves", V),
        ing(1, "tbsp", "ginger", V, "grated"), ing(1, "head", "broccoli", V), ing(3, "cups", "cooked rice", C),
        ing(None, None, "red pepper flakes", T), ing(None, None, "sesame seeds", T), ing(None, None, "scallions", V),
        ing(None, None, "salt", T),
    ], [
        "Heat the oven to 425°F and line a sheet pan. Toss the chicken with all but 1 tsp of the cornstarch, salt and the oil, and spread it out.",
        "Bake for 15 to 18 minutes, turning once, until golden and 165°F inside.",
        "Simmer the orange juice, zest, soy sauce, honey, vinegar, garlic, ginger and red pepper flakes. Stir in the last 1 tsp cornstarch mixed with 1 tbsp water and simmer 2 to 3 minutes until syrupy.",
        "Steam the broccoli for 4 to 5 minutes.",
        "Toss the chicken in the sauce. Serve over rice with the broccoli, sesame seeds and scallions.",
    ]),
    recipe("CC12", "Oven-baked crispy chicken tenders", "DINNER", ["American", COPY], 4, "4 tenders with slaw and corn", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cut into strips"), ing(1, "cup", "panko", C), ing(2, None, "eggs", P),
        ing("1/4", "cup", "whole-wheat flour", T), ing(1, "tsp", "paprika", T), ing(1, "tsp", "garlic powder", T),
        ing(1, "tsp", "onion powder", T), ing(None, "pinch of", "cayenne", T), ing("1/4", "head", "cabbage", V, "shredded"),
        ing(2, None, "carrots", V, "grated"), ing("1/3", "cup", "nonfat Greek yogurt", P), ing(1, "tsp", "honey", T),
        ing(None, None, "apple cider vinegar", T), ing(4, "ears", "corn on the cob", V), ing(None, None, "cooking spray", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F. Set a rack on a sheet pan and spray it.",
        "Mix the panko with the paprika, garlic powder, onion powder, cayenne, salt and pepper.",
        "Dip the chicken in the flour, then the beaten eggs, then the panko. Set on the rack and spray the tops lightly.",
        "Bake for 15 to 18 minutes, turning once, until golden and 165°F inside.",
        "Toss the cabbage and carrots with the yogurt, a splash of vinegar, the honey and salt. Boil or microwave the corn for 3 to 4 minutes.",
    ]),
    recipe("CC13", "Blackened chicken tenders with red beans and rice", "DINNER", ["American", COPY], 4, "4 tenders with beans, rice and green beans", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cut into strips"), ing(None, None, "Cajun seasoning", T, "2 tbsp"),
        ing(1, "tbsp", "olive oil", T), ing(2, "cans", "kidney beans", C, "drained and rinsed"), ing(1, None, "onion", V),
        ing(1, None, "bell pepper", V), ing(2, None, "celery stalks", V), ing(3, None, "garlic cloves", V),
        ing(1, "cup", "low-sodium chicken broth", T), ing(None, None, "smoked paprika", T), ing(None, None, "thyme", V),
        ing(2, "cups", "cooked brown rice", C), ing(1, "bag", "frozen green beans", V), ing(None, None, "hot sauce", T),
    ], [
        "Cook the diced onion, pepper and celery in half the oil for 6 minutes. Add the garlic, smoked paprika and thyme.",
        "Add the beans and broth. Simmer for 15 minutes, mashing some beans against the pot until creamy.",
        "Coat the chicken with the Cajun seasoning.",
        "Sear in the rest of the oil in a very hot heavy pan for 3 to 4 minutes a side until dark and 165°F inside. Open a window; it smokes.",
        "Steam or microwave the green beans. Serve the chicken with the beans over rice, the green beans and hot sauce.",
    ]),
    recipe("CC14", "Egg and cheese mini wraps", "BREAKFAST", ["American", COPY], 1, "2 mini wraps", "EGG", [
        ing(2, None, "corn tortillas", C), ing(2, None, "eggs", P), ing(1, "oz", "cheddar", T, "shredded"),
        ing(2, "slices", "turkey bacon", P), ing(1, "handful of", "baby spinach", V), ing(None, None, "hot sauce", T),
        ing(None, None, "cooking spray", T),
    ], [
        "Cook the turkey bacon in a nonstick pan for 2 to 3 minutes a side until crisp.",
        "Scramble the eggs with the spinach in the same pan until just set.",
        "Warm the tortillas for 15 seconds a side.",
        "Divide the cheese, eggs and bacon between the tortillas, add hot sauce and fold them in half.",
    ]),
]
