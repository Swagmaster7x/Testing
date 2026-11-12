#!/usr/bin/env python3
"""Adds the version 3 recipes (breakfasts, lunches, dinners, soups, snacks) to the personal seed.

Nutrition comes from tools/recipe_lib.py. Safe to run again: recipes already in the seed (by
key) are replaced with this version.

    python3 tools/recipes_v3.py && python3 tools/store_seed.py
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from recipe_lib import C, P, T, V, ing, nutrition, recipe, swap  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SEED = ROOT / "app/src/personal/assets/seed.json"

RECIPES = [
    # ---------- Breakfasts ----------
    recipe("B5", "Veggie scramble on toast", "BREAKFAST", ["American"], 1, "2 eggs and whites on 2 slices of toast", "EGG", [
        ing(2, None, "eggs", P), ing("1/2", "cup", "liquid egg whites", P), ing(1, "handful of", "baby spinach", V),
        ing("1/2", None, "bell pepper", V), ing("1/4", None, "onion", V), ing(1, "tsp", "olive oil", T),
        ing(2, "slices", "whole-grain bread", C), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
        ing(None, None, "hot sauce", T),
    ], [
        "Heat the oil in a nonstick pan over medium heat. Cook the diced pepper and onion for 3 minutes.",
        "Add the spinach and stir until wilted.",
        "Beat the eggs with the egg whites, pour in, and stir gently until just set, about 2 minutes.",
        "Season, pile onto toast and add hot sauce.",
    ]),
    recipe("B6", "Cottage cheese berry bowl", "BREAKFAST", ["American"], 1, "1 bowl", "VEGETARIAN", [
        ing(1, "cup", "cottage cheese", P), ing(1, "cup", "mixed berries", V), ing("1/4", "cup", "granola", C),
        ing(1, "tbsp", "chia seeds", T), ing(1, "tsp", "honey", T),
    ], [
        "Spoon the cottage cheese into a bowl.",
        "Top with the berries, granola and chia seeds.",
        "Drizzle with honey.",
    ]),
    recipe("B7", "Peanut butter banana oats", "BREAKFAST", ["American"], 1, "1 bowl", "VEGETARIAN", [
        ing("1/2", "cup", "rolled oats", C), ing(1, "cup", "milk", T), ing(1, "scoop", "vanilla whey protein", P),
        ing(1, None, "banana", V), ing(1, "tbsp", "peanut butter", T), ing(None, "pinch of", "cinnamon", T),
    ], [
        "Simmer the oats in the milk for 4 to 5 minutes, stirring (or microwave for 2 minutes).",
        "Take off the heat and stir in the protein powder. Add a splash of milk if it's thick.",
        "Top with sliced banana, peanut butter and cinnamon.",
    ]),
    recipe("B8", "Turkey and egg breakfast burritos", "BREAKFAST", ["Hispanic"], 4, "1 burrito", "TURKEY", [
        ing("1/2", "lb", "93% lean ground turkey", P), ing(6, None, "eggs", P), ing(1, None, "bell pepper", V),
        ing("1/2", None, "onion", V), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing(4, None, "whole-wheat tortillas", C), ing("1/2", "cup", "shredded cheese", T), ing("1/2", "cup", "salsa", V),
        ing(1, "tsp", "cumin", T), ing(1, "tsp", "chili powder", T),
    ], [
        "Brown the turkey with the cumin and chili powder until no pink remains (165°F).",
        "Add the diced pepper and onion and cook for 3 minutes.",
        "Push everything aside and scramble the eggs in the same pan. Stir in the beans.",
        "Divide among the tortillas with the cheese and salsa, and roll up.",
        "Wrap extras in foil. Refrigerate for up to 4 days or freeze; reheat until hot all the way through.",
    ], prep=True),
    recipe("B9", "Banana oat protein pancakes", "BREAKFAST", ["American"], 1, "3 small pancakes", "EGG", [
        ing(1, None, "banana", V), ing(2, None, "eggs", P), ing("1/2", "cup", "rolled oats", C),
        ing(1, "scoop", "vanilla whey protein", P), ing("1/2", "tsp", "baking powder", T), ing(None, "pinch of", "cinnamon", T),
        ing(1, "tsp", "olive oil", T), ing("1/2", "cup", "mixed berries", V), ing(1, "tsp", "honey", T),
    ], [
        "Blend the banana, eggs, oats, protein powder, baking powder and cinnamon until smooth.",
        "Heat a nonstick pan over medium-low heat with a little oil.",
        "Pour 3 small pancakes. Cook for 2 minutes until bubbles form, flip, and cook 1 to 2 minutes more.",
        "Top with the berries and honey.",
    ]),
    recipe("B10", "Smoked salmon avocado toast", "BREAKFAST", ["American"], 1, "2 slices", "FISH", [
        ing(2, "slices", "whole-grain bread", C), ing("1/2", None, "avocado", V), ing(3, "oz", "smoked salmon", P),
        ing(2, None, "eggs", P), ing("1/4", None, "lemon", V), ing(None, None, "black pepper", T), ing(None, None, "capers", T),
    ], [
        "Toast the bread.",
        "Mash the avocado with the lemon juice, salt and pepper, and spread it on the toast.",
        "Fry or poach the eggs.",
        "Top the toast with the smoked salmon, then the eggs and a few capers.",
    ]),
    recipe("B11", "Tofu scramble with black beans", "BREAKFAST", ["Hispanic"], 2, "1 plate with 2 tortillas", "VEGETARIAN", [
        ing(1, "block", "firm tofu", P, "14 oz"), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing(1, None, "bell pepper", V), ing("1/2", None, "onion", V), ing(2, "handfuls", "baby spinach", V),
        ing(1, "tbsp", "olive oil", T), ing(1, "tsp", "cumin", T), ing("1/2", "tsp", "turmeric", T),
        ing(4, None, "corn tortillas", C), ing("1/2", "cup", "salsa", V), ing(None, None, "salt", T),
    ], [
        "Pat the tofu dry with paper towels and crumble it.",
        "Cook the diced onion and pepper in the oil for 4 minutes.",
        "Add the tofu, cumin, turmeric and salt. Cook for 5 minutes until lightly golden.",
        "Stir in the beans and spinach until the spinach wilts and everything is hot.",
        "Serve with warm tortillas and salsa.",
    ]),

    # ---------- Lunches ----------
    recipe("L9", "Chicken burrito bowls", "LUNCH", ["Hispanic"], 4, "1 bowl with 3/4 cup rice", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cubed"), ing(1, "tbsp", "olive oil", T), ing(2, "tsp", "chili powder", T),
        ing(1, "tsp", "cumin", T), ing(1, "tsp", "garlic powder", T), ing(3, "cups", "cooked rice", C),
        ing(1, "can", "black beans", C, "drained and rinsed"), ing(1, "cup", "corn", V), ing(1, "cup", "salsa", V),
        ing(1, None, "avocado", V), ing(1, None, "lime", V), ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Toss the chicken with the oil, chili powder, cumin, garlic powder and salt.",
        "Cook in a hot pan for 6 to 8 minutes until browned and 165°F inside.",
        "Warm the beans and corn.",
        "Divide the rice into 4 containers. Top with the chicken, beans, corn and salsa.",
        "Add avocado, lime and cilantro when serving.",
    ], prep=True, tip="Serve over a big handful of shredded lettuce and use half the rice.", swaps=[
        swap("Ground turkey", "TURKEY", "chicken breast", "93% lean ground turkey", "Brown and crumble instead of cubing; cook to 165°F."),
    ]),
    recipe("L10", "Greek chicken and quinoa bowls", "LUNCH", ["Mediterranean"], 4, "1 bowl", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P), ing(1, "cup", "quinoa", C), ing(1, None, "cucumber", V),
        ing(2, None, "tomatoes", V), ing("1/2", None, "red onion", V), ing("1/2", "cup", "feta", T),
        ing("1/4", "cup", "olives", T), ing(2, "tbsp", "olive oil", T), ing(1, None, "lemon", V),
        ing(2, "tsp", "oregano", T), ing(2, None, "garlic cloves", V), ing("1/2", "cup", "nonfat Greek yogurt", P),
        ing(None, None, "salt", T),
    ], [
        "Marinate the chicken in 1 tbsp oil, the juice of half the lemon, the oregano, minced garlic and salt for 15 minutes.",
        "Simmer the quinoa in 2 cups of water, covered, for 15 minutes. Fluff with a fork.",
        "Cook the chicken in a hot pan for 5 to 6 minutes a side until 165°F. Rest, then slice.",
        "Dice the cucumber, tomatoes and onion. Toss with the rest of the oil and lemon.",
        "Build the bowls: quinoa, chicken, salad, feta, olives and a spoon of yogurt.",
    ], prep=True, swaps=[
        swap("Chickpeas", "VEGETARIAN", "chicken breast", "chickpeas, drained", "Warm the chickpeas with the oregano and garlic instead of cooking chicken.", 2, "cans"),
    ]),
    recipe("L11", "Tuna and white bean salad", "LUNCH", ["Mediterranean"], 2, "1 big bowl with toast", "FISH", [
        ing(2, "cans", "tuna in water", P, "drained"), ing(1, "can", "white beans", C, "drained and rinsed"),
        ing(2, "handfuls", "baby spinach", V), ing(2, None, "tomatoes", V), ing("1/4", None, "red onion", V),
        ing(2, "tbsp", "olive oil", T), ing(1, None, "lemon", V), ing(1, "tsp", "mustard", T),
        ing(2, "slices", "whole-grain bread", C), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Whisk the oil, lemon juice, mustard, salt and pepper in a large bowl.",
        "Add the tuna, beans, chopped tomatoes and thinly sliced onion. Toss.",
        "Fold in the spinach.",
        "Serve with toast.",
    ]),
    recipe("L12", "Turkey taco lettuce wraps", "LUNCH", ["Hispanic"], 4, "3 wraps", "TURKEY", [
        ing(1, "lb", "93% lean ground turkey", P), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing("1/2", None, "onion", V), ing(1, "tbsp", "chili powder", T), ing(1, "tsp", "cumin", T),
        ing(2, "heads", "butter lettuce", V), ing(1, "cup", "salsa", V), ing(1, None, "avocado", V),
        ing("1/2", "cup", "shredded cheese", T), ing(1, None, "lime", V), ing(None, None, "salt", T),
    ], [
        "Brown the turkey with the diced onion until no pink remains (165°F).",
        "Stir in the chili powder, cumin, salt and a splash of water. Simmer for 2 minutes.",
        "Add the beans and heat through.",
        "Spoon into lettuce leaves and top with salsa, avocado, cheese and lime.",
    ], tip="Pile on shredded cabbage and pico de gallo. They add crunch for almost nothing."),
    recipe("L13", "Chickpea and spinach curry", "LUNCH", ["Indian"], 4, "1 bowl with 3/4 cup rice", "VEGETARIAN", [
        ing(2, "cans", "chickpeas", C, "drained and rinsed"), ing("1/2", "cup", "red lentils", C, "rinsed"),
        ing(1, "can", "light coconut milk", T), ing(1, "can", "diced tomatoes", T), ing(1, None, "onion", V),
        ing(3, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"), ing(2, "tbsp", "curry powder", T),
        ing(1, "tbsp", "olive oil", T), ing(1, "bag", "baby spinach", V, "5 oz"), ing(3, "cups", "cooked rice", C),
        ing("1/2", "cup", "nonfat Greek yogurt", P, "to serve; leave out for vegan"), ing(1, None, "lime", V),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion in the oil for 5 minutes.",
        "Add the garlic, ginger and curry powder and stir for 1 minute.",
        "Add the tomatoes, coconut milk, lentils and 1 cup of water. Simmer for 15 minutes.",
        "Add the chickpeas and simmer 5 to 10 minutes more, until the lentils are soft.",
        "Stir in the spinach until wilted. Season with salt and lime juice.",
        "Serve over rice with a spoon of yogurt and cilantro.",
    ], prep=True),
    recipe("L14", "Black bean and sweet potato bowls", "LUNCH", ["Hispanic"], 4, "1 bowl", "VEGETARIAN", [
        ing("1 1/2", "lb", "sweet potatoes", C, "cubed"), ing(2, "cans", "black beans", C, "drained and rinsed"),
        ing("3/4", "cup", "quinoa", C), ing(1, None, "red onion", V), ing(1, "tbsp", "olive oil", T),
        ing(2, "tsp", "chili powder", T), ing(1, "tsp", "cumin", T), ing(1, None, "avocado", V), ing(1, "cup", "salsa", V),
        ing("1/4", "cup", "feta", T), ing(1, "cup", "nonfat Greek yogurt", P), ing(1, None, "lime", V),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 425°F.",
        "Toss the sweet potatoes and onion wedges with the oil, chili powder, cumin and salt. Roast for 25 to 30 minutes, turning once.",
        "Simmer the quinoa in 1 1/2 cups of water, covered, for 15 minutes.",
        "Warm the beans.",
        "Build the bowls: quinoa, sweet potato, beans, salsa, avocado, feta, a spoon of yogurt and lime.",
    ], prep=True),
    recipe("L15", "Chicken Caesar wraps", "LUNCH", ["American"], 2, "1 wrap", "CHICKEN", [
        ing("3/4", "lb", "chicken breast", P), ing(2, None, "whole-wheat tortillas", C), ing(1, "head", "romaine lettuce", V),
        ing("1/4", "cup", "nonfat Greek yogurt", P), ing(2, "tbsp", "parmesan", T), ing("1/2", None, "lemon", V),
        ing(1, "tsp", "mustard", T), ing(1, None, "garlic cloves", V), ing(1, "tsp", "olive oil", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Season the chicken with salt and pepper. Cook in the oil for 5 to 6 minutes a side until 165°F. Rest, then slice.",
        "Stir the yogurt, parmesan, lemon juice, mustard, grated garlic, pepper and a splash of water into a dressing.",
        "Toss the chopped romaine with the dressing.",
        "Fill the tortillas with the lettuce and chicken and roll them tight.",
    ], tip="Use the whole head of romaine and eat the extra as a side salad."),
    recipe("L17", "Egg fried rice with vegetables", "LUNCH", ["Asian"], 2, "1 big bowl", "EGG", [
        ing(4, None, "eggs", P), ing(1, "cup", "edamame", P, "shelled, frozen"), ing(2, "cups", "cooked rice", C, "day-old is best"),
        ing(1, "cup", "frozen peas", V), ing(2, None, "carrots", V, "diced small"), ing(3, None, "scallions", V),
        ing(2, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"), ing(2, "tbsp", "low-sodium soy sauce", T),
        ing(1, "tsp", "sesame oil", T), ing(1, "tbsp", "oil", T),
    ], [
        "Heat the oil in a large pan or wok over high heat. Scramble the eggs until just set and set them aside.",
        "Stir-fry the carrots, garlic and ginger for 2 minutes.",
        "Add the rice, peas and edamame. Stir-fry for 3 to 4 minutes until hot.",
        "Return the eggs. Add the soy sauce, sesame oil and scallions and toss for 1 minute.",
    ], swaps=[
        swap("Shrimp", "FISH", "edamame", "shrimp, peeled", "Stir-fry the shrimp first until pink, 2 to 3 minutes.", 0.5, "lb"),
    ]),
    recipe("L18", "Shrimp and vegetable stir-fry", "LUNCH", ["Asian"], 4, "1 bowl with 3/4 cup rice", "FISH", [
        ing("1 1/2", "lb", "shrimp", P, "peeled and deveined"), ing(1, "head", "broccoli", V), ing(2, None, "bell peppers", V),
        ing(8, "oz", "mushrooms", V), ing(3, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"),
        ing(3, "tbsp", "low-sodium soy sauce", T), ing(1, "tbsp", "honey", T), ing(1, "tbsp", "rice vinegar", T),
        ing(2, "tsp", "cornstarch", T), ing(1, "tbsp", "oil", T), ing(1, "tsp", "sesame oil", T),
        ing(3, "cups", "cooked jasmine rice", C), ing(None, None, "scallions", V),
    ], [
        "Whisk the soy sauce, honey, vinegar, cornstarch and 1/4 cup of water.",
        "Stir-fry the broccoli, peppers and mushrooms in the oil over high heat for 4 to 5 minutes. Set aside.",
        "Cook the shrimp for 2 to 3 minutes until pink and opaque.",
        "Add the garlic and ginger for 30 seconds. Return the vegetables, pour in the sauce and toss for 1 minute until glossy.",
        "Finish with the sesame oil and scallions. Serve over rice.",
    ], swaps=[
        swap("Chicken breast", "CHICKEN", "shrimp", "chicken breast, sliced thin", "Cook for 5 to 6 minutes until no pink remains."),
        swap("Tofu", "VEGETARIAN", "shrimp", "firm tofu, cubed", "Brown the tofu first, 6 to 8 minutes."),
    ]),

    # ---------- Dinners ----------
    recipe("D12", "Lemon-herb chicken thighs with potatoes and green beans", "DINNER", ["American"], 4, "2 small thighs with vegetables", "CHICKEN", [
        ing(2, "lb", "chicken thighs", P, "boneless skinless"), ing("1 1/2", "lb", "potatoes", C, "halved"),
        ing(1, "bag", "frozen green beans", V), ing(2, "tbsp", "olive oil", T), ing(1, None, "lemon", V),
        ing(4, None, "garlic cloves", V), ing(2, "tsp", "oregano", T), ing(1, "tsp", "paprika", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F.",
        "Toss the potatoes with 1 tbsp oil and salt on a sheet pan. Roast for 15 minutes.",
        "Toss the chicken with the rest of the oil, the lemon zest and juice, garlic, oregano, paprika, salt and pepper.",
        "Add the chicken and green beans to the pan. Roast for 20 to 25 minutes until the chicken reaches 165°F.",
        "Squeeze over more lemon.",
    ]),
    recipe("D13", "Turkey meatballs with marinara and spaghetti", "DINNER", ["Italian"], 4, "4 meatballs with 1 cup pasta", "TURKEY", [
        ing(1, "lb", "93% lean ground turkey", P), ing(1, None, "egg", P), ing("1/3", "cup", "rolled oats", C),
        ing(2, None, "garlic cloves", V), ing(2, "tsp", "Italian seasoning", T), ing("1/4", "cup", "parmesan", T),
        ing(1, "jar", "marinara sauce", T, "24 oz"), ing(8, "oz", "whole-wheat spaghetti", C),
        ing(2, "handfuls", "baby spinach", V), ing(None, None, "basil", V), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 400°F and line a sheet pan.",
        "Mix the turkey, egg, oats, minced garlic, Italian seasoning, half the parmesan and 1/2 tsp salt. Roll into 16 meatballs.",
        "Bake for 15 to 18 minutes until 165°F inside.",
        "Boil the spaghetti as the packet says, then drain.",
        "Warm the marinara in a pan, wilt in the spinach and add the meatballs.",
        "Serve over the spaghetti with the rest of the parmesan and basil.",
    ], tip="Swap half the spaghetti for roasted zucchini."),
    recipe("D14", "Baked cod with lemon, rice and broccoli", "DINNER", ["Mediterranean"], 4, "1 fillet with 3/4 cup rice", "FISH", [
        ing("1 1/2", "lb", "cod fillets", P), ing(2, "tbsp", "olive oil", T), ing(1, None, "lemon", V),
        ing(2, None, "garlic cloves", V), ing(1, "tsp", "paprika", T), ing(2, "heads", "broccoli", V),
        ing("1 1/2", "cups", "rice", C), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 400°F. Cook the rice.",
        "Toss the broccoli florets with 1 tbsp oil and salt on a sheet pan. Roast for 10 minutes.",
        "Pat the cod dry. Rub with the rest of the oil, the minced garlic, paprika, salt and pepper.",
        "Add the cod and lemon slices to the pan. Roast for 10 to 12 minutes until the fish flakes easily (145°F).",
        "Serve over the rice with lemon.",
    ]),
    recipe("D15", "Shrimp tacos with cabbage slaw", "DINNER", ["Hispanic"], 4, "3 tacos", "FISH", [
        ing("1 1/2", "lb", "shrimp", P, "peeled and deveined"), ing(12, None, "corn tortillas", C),
        ing("1/4", "head", "cabbage", V), ing("1/2", "cup", "nonfat Greek yogurt", P), ing(2, None, "limes", V),
        ing(1, None, "avocado", V), ing(2, "tsp", "chili powder", T), ing(1, "tsp", "cumin", T),
        ing(1, "tsp", "garlic powder", T), ing(1, "tbsp", "olive oil", T), ing(None, None, "cilantro", V),
        ing(None, None, "hot sauce", T), ing(None, None, "salt", T),
    ], [
        "Toss the shrimp with the oil, chili powder, cumin, garlic powder and salt.",
        "Shred the cabbage. Toss with the yogurt, the juice of 1 lime and salt.",
        "Cook the shrimp in a hot pan for 2 to 3 minutes until pink and opaque.",
        "Warm the tortillas in a dry pan.",
        "Fill with slaw, shrimp, avocado, cilantro and hot sauce. Serve with lime wedges.",
    ], swaps=[
        swap("Chicken breast", "CHICKEN", "shrimp", "chicken breast, sliced thin", "Cook for 5 to 6 minutes until no pink remains."),
    ]),
    recipe("D16", "Beef and bean chili", "DINNER", ["American"], 6, "1 1/2 cups", "BEEF", [
        ing("1 1/2", "lb", "90% lean ground beef", P), ing(2, "cans", "kidney beans", C, "drained and rinsed"),
        ing(1, "can", "black beans", C, "drained and rinsed"), ing(1, "can", "crushed tomatoes", T, "28 oz"),
        ing(1, None, "onion", V), ing(2, None, "bell peppers", V), ing(4, None, "garlic cloves", V),
        ing(3, "tbsp", "chili powder", T), ing(2, "tsp", "cumin", T), ing(1, "tsp", "oregano", T),
        ing(2, "cups", "low-sodium beef broth", T), ing("1/2", "cup", "nonfat Greek yogurt", P, "to serve"),
        ing(None, None, "scallions", V), ing(None, None, "salt", T),
    ], [
        "Brown the beef in a large pot, breaking it up, until no pink remains (160°F). Drain off extra fat.",
        "Add the diced onion and peppers and cook for 5 minutes.",
        "Stir in the garlic, chili powder, cumin and oregano for 1 minute.",
        "Add the tomatoes, beans and broth. Simmer for 30 minutes, stirring now and then. Salt to taste.",
        "Serve with a spoon of yogurt and scallions. Keeps 4 days in the fridge and freezes well.",
    ], swaps=[
        swap("Ground turkey", "TURKEY", "90% lean ground beef", "93% lean ground turkey", "Cook to 165°F."),
    ]),
    recipe("D17", "Curry-yogurt chicken with rice and cucumber salad", "DINNER", ["Indian"], 4, "1 cup chicken with 3/4 cup rice", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P, "cubed"), ing("3/4", "cup", "nonfat Greek yogurt", P),
        ing(2, "tbsp", "curry powder", T), ing(1, "tbsp", "ginger", V, "grated"), ing(3, None, "garlic cloves", V),
        ing(1, None, "lemon", V), ing(1, "tbsp", "olive oil", T), ing(3, "cups", "cooked rice", C),
        ing(2, None, "cucumbers", V), ing(2, None, "tomatoes", V), ing("1/2", None, "red onion", V),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Stir the yogurt, curry powder, ginger, minced garlic, half the lemon juice and salt. Coat the chicken and marinate for 20 minutes (or overnight).",
        "Cook the chicken in the oil in a very hot pan (or under the broiler) for 8 to 10 minutes, turning, until charred at the edges and 165°F.",
        "Dice the cucumbers, tomatoes and onion. Toss with the rest of the lemon, salt and cilantro.",
        "Serve the chicken over rice with the salad.",
    ]),
    recipe("D18", "Tofu and vegetable stir-fry", "DINNER", ["Asian"], 4, "1 bowl with 3/4 cup rice", "VEGETARIAN", [
        ing(2, "blocks", "firm tofu", P, "14 oz each"), ing(1, "head", "broccoli", V), ing(2, None, "bell peppers", V),
        ing(2, None, "carrots", V), ing(3, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"),
        ing("1/4", "cup", "low-sodium soy sauce", T), ing(1, "tbsp", "honey", T), ing(1, "tbsp", "rice vinegar", T),
        ing(2, "tsp", "cornstarch", T), ing(2, "tbsp", "oil", T), ing(1, "tsp", "sesame oil", T),
        ing(3, "cups", "cooked jasmine rice", C), ing(None, None, "sesame seeds", T), ing(None, None, "scallions", V),
    ], [
        "Press the tofu between paper towels for 10 minutes, then cube it.",
        "Brown the tofu in 1 tbsp oil for 6 to 8 minutes until golden. Set aside.",
        "Stir-fry the vegetables in the rest of the oil for 4 to 5 minutes. Add the garlic and ginger for 30 seconds.",
        "Whisk the soy sauce, honey, vinegar, cornstarch and 1/4 cup of water. Pour in with the tofu and toss for 1 to 2 minutes until glossy.",
        "Finish with the sesame oil, sesame seeds and scallions. Serve over rice.",
    ]),
    recipe("D19", "Turkey-stuffed bell peppers", "DINNER", ["American"], 4, "2 halves", "TURKEY", [
        ing(4, None, "bell peppers", V), ing(1, "lb", "93% lean ground turkey", P), ing("1 1/2", "cups", "cooked rice", C),
        ing(1, "can", "diced tomatoes", T), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing("1/2", None, "onion", V), ing(2, None, "garlic cloves", V), ing(2, "tsp", "chili powder", T),
        ing(1, "tsp", "cumin", T), ing("3/4", "cup", "shredded cheese", T), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 400°F. Halve the peppers lengthwise, take out the seeds and set them cut side up in a baking dish.",
        "Brown the turkey with the diced onion until no pink remains (165°F). Add the garlic, chili powder, cumin and salt.",
        "Stir in the rice, tomatoes and beans.",
        "Fill the peppers, cover with foil and bake for 25 minutes.",
        "Uncover, top with the cheese and bake for 10 minutes more.",
    ]),
    recipe("D20", "Garlic butter salmon with asparagus and potatoes", "DINNER", ["American"], 4, "1 fillet with vegetables", "FISH", [
        ing(4, None, "salmon portions", P, "6 oz each"), ing("1 1/2", "lb", "potatoes", C, "halved"),
        ing(1, "lb", "asparagus", V), ing(2, "tbsp", "butter", T), ing(1, "tbsp", "olive oil", T),
        ing(4, None, "garlic cloves", V), ing(1, None, "lemon", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F.",
        "Toss the potatoes with the oil and salt on a sheet pan. Roast for 20 minutes.",
        "Melt the butter with the minced garlic and lemon juice.",
        "Push the potatoes aside and add the salmon and asparagus. Spoon the garlic butter over them.",
        "Roast for 10 to 12 minutes until the salmon flakes easily (145°F).",
    ]),
    recipe("D21", "Bean and veggie quesadillas", "DINNER", ["Hispanic"], 2, "1 quesadilla with salsa", "VEGETARIAN", [
        ing(2, None, "whole-wheat tortillas", C), ing(1, "can", "black beans", C, "drained and rinsed"),
        ing("3/4", "cup", "shredded cheese", T), ing(1, None, "bell pepper", V), ing("1/2", None, "onion", V),
        ing(2, "handfuls", "baby spinach", V), ing(1, "tsp", "cumin", T), ing(1, "tsp", "olive oil", T),
        ing("1/2", "cup", "salsa", V), ing("1/2", "cup", "nonfat Greek yogurt", P), ing(None, None, "salt", T),
    ], [
        "Cook the sliced pepper and onion in the oil for 4 minutes. Add the spinach, cumin and a pinch of salt until wilted.",
        "Mash half the beans with a fork and stir in the rest.",
        "Spread the beans over half of each tortilla. Top with the vegetables and cheese, and fold.",
        "Cook in a dry pan over medium heat for 2 to 3 minutes a side until crisp and melted.",
        "Cut into wedges and serve with the salsa and yogurt.",
    ]),
    recipe("D22", "Chicken sausage, pepper and potato skillet", "DINNER", ["American"], 4, "1 1/2 cups with an egg", "CHICKEN", [
        ing(8, "links", "chicken sausage", P, "fully cooked"), ing("1 1/2", "lb", "potatoes", C, "diced small"),
        ing(2, None, "bell peppers", V), ing(1, None, "onion", V), ing(1, "tbsp", "olive oil", T),
        ing(1, "tsp", "paprika", T), ing(1, "tsp", "garlic powder", T), ing(4, None, "eggs", P), ing(None, None, "salt", T),
    ], [
        "Cook the potatoes in the oil in a large skillet over medium-high heat for 12 to 15 minutes, stirring, until golden and tender.",
        "Add the sliced peppers and onion, paprika, garlic powder and salt. Cook for 5 minutes.",
        "Add the sliced sausage and cook for 3 to 4 minutes until browned and hot through (165°F).",
        "Make 4 wells, crack in the eggs, cover and cook for 3 to 4 minutes until the whites are set.",
    ]),
    recipe("D23", "Chickpea shakshuka", "DINNER", ["Mediterranean"], 2, "half the pan with toast", "EGG", [
        ing(4, None, "eggs", P), ing(1, "can", "chickpeas", C, "drained and rinsed"), ing(1, "can", "diced tomatoes", T),
        ing(1, None, "onion", V), ing(1, None, "bell pepper", V), ing(3, None, "garlic cloves", V),
        ing(2, "tsp", "cumin", T), ing(2, "tsp", "paprika", T), ing(1, "tbsp", "olive oil", T),
        ing("1/4", "cup", "feta", T), ing(2, "slices", "whole-grain bread", C), ing(None, None, "cilantro", V),
        ing(None, None, "salt", T),
    ], [
        "Cook the diced onion and pepper in the oil for 5 minutes.",
        "Add the garlic, cumin and paprika for 1 minute.",
        "Add the tomatoes, chickpeas, 1/2 cup of water and salt. Simmer for 10 minutes until thick.",
        "Make 4 wells and crack in the eggs. Cover and cook for 5 to 7 minutes until the whites are set.",
        "Top with feta and cilantro. Serve with toast.",
    ]),

    # ---------- Soups ----------
    recipe("S5", "Red lentil soup", "SOUP", ["Mediterranean"], 4, "2 cups with toast", "VEGETARIAN", [
        ing("1 1/2", "cups", "red lentils", C, "rinsed"), ing(1, None, "onion", V), ing(2, None, "carrots", V),
        ing(2, None, "celery stalks", V), ing(3, None, "garlic cloves", V), ing(1, "can", "diced tomatoes", T),
        ing(6, "cups", "low-sodium broth", T, "vegetable"), ing(2, "tsp", "cumin", T), ing(1, "tsp", "paprika", T),
        ing(1, "tbsp", "olive oil", T), ing(1, None, "lemon", V), ing(2, "handfuls", "baby spinach", V),
        ing("1/2", "cup", "nonfat Greek yogurt", P, "to serve"), ing(4, "slices", "whole-grain bread", C),
        ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, carrots and celery in the oil for 6 minutes.",
        "Add the garlic, cumin and paprika for 1 minute.",
        "Add the lentils, tomatoes and broth. Simmer for 20 minutes until the lentils fall apart.",
        "Stir in the spinach, lemon juice and salt. Blend part of it if you like it smoother.",
        "Serve with a spoon of yogurt and toast.",
    ], prep=True),
    recipe("S6", "Chicken tortilla soup", "SOUP", ["Hispanic"], 4, "2 cups", "CHICKEN", [
        ing(1, "lb", "chicken breast", P), ing(1, "can", "black beans", C, "drained and rinsed"), ing(1, "cup", "corn", V),
        ing(1, "can", "diced tomatoes", T), ing(1, None, "onion", V), ing(3, None, "garlic cloves", V),
        ing(1, None, "jalapeño", V), ing(5, "cups", "low-sodium chicken broth", T), ing(2, "tsp", "cumin", T),
        ing(2, "tsp", "chili powder", T), ing(4, None, "corn tortillas", C), ing(1, None, "avocado", V),
        ing(1, None, "lime", V), ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Simmer the chicken in the broth with the diced onion, garlic, jalapeño, cumin and chili powder for 15 minutes, until 165°F.",
        "Lift the chicken out and shred it with two forks.",
        "Add the tomatoes, beans and corn. Simmer for 10 minutes. Return the chicken and season with salt and lime.",
        "Cut the tortillas into strips and toast them in a 400°F oven for 8 to 10 minutes until crisp.",
        "Top the bowls with tortilla strips, avocado and cilantro.",
    ]),
    recipe("S7", "Minestrone with white beans", "SOUP", ["Italian"], 4, "2 cups", "VEGETARIAN", [
        ing(2, "cans", "white beans", C, "drained and rinsed"), ing(4, "oz", "whole-wheat spaghetti", C, "broken into short pieces"),
        ing(1, None, "onion", V), ing(2, None, "carrots", V), ing(2, None, "celery stalks", V), ing(1, None, "zucchini", V),
        ing(3, None, "garlic cloves", V), ing(1, "can", "diced tomatoes", T), ing(6, "cups", "low-sodium broth", T, "vegetable"),
        ing(2, "tsp", "Italian seasoning", T), ing(1, "tbsp", "olive oil", T), ing(2, "handfuls", "baby spinach", V),
        ing("1/4", "cup", "parmesan", T), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, carrots and celery in the oil for 6 minutes.",
        "Add the garlic, diced zucchini and Italian seasoning for 2 minutes.",
        "Add the tomatoes and broth and bring to a boil. Add the pasta and simmer for 8 to 10 minutes until tender.",
        "Stir in the beans and spinach until hot. Salt to taste.",
        "Serve with the parmesan.",
    ]),

    # ---------- Snacks ----------
    recipe("SN5", "Hummus and veggie sticks", "SNACK", ["Snack"], 1, "1/4 cup hummus with vegetables", "VEGETARIAN", [
        ing("1/4", "cup", "hummus", T), ing(2, None, "carrots", V), ing(1, None, "cucumber", V),
    ], ["Cut the carrots and cucumber into sticks.", "Dip."], only="ashley"),
    recipe("SN6", "Apple and peanut butter", "SNACK", ["Snack"], 1, "1 apple with 2 tbsp", "VEGETARIAN", [
        ing(1, None, "apple", V), ing(2, "tbsp", "peanut butter", T),
    ], ["Slice the apple.", "Spread or dip with the peanut butter."], only="ashley"),
    recipe("SN7", "Hard-boiled eggs", "SNACK", ["Snack"], 1, "2 eggs", "EGG", [
        ing(2, None, "eggs", P), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Lower the eggs into boiling water and cook for 10 minutes.",
        "Cool in cold water, then peel.",
        "Boil a batch: they keep for a week in the fridge, unpeeled.",
    ], only="ashley"),
    recipe("SN8", "Cottage cheese and pineapple", "SNACK", ["Snack"], 1, "1 small bowl", "VEGETARIAN", [
        ing("3/4", "cup", "cottage cheese", P), ing("1/2", "cup", "pineapple chunks", V),
    ], ["Spoon the cottage cheese into a bowl and top with the pineapple."], only="ashley"),
    recipe("SN9", "Edamame with sea salt", "SNACK", ["Snack"], 1, "1 cup shelled", "VEGETARIAN", [
        ing(1, "cup", "edamame", P, "shelled, frozen"), ing(None, None, "salt", T),
    ], ["Microwave or boil the edamame for 3 minutes.", "Drain and sprinkle with salt."], only="ashley"),
]

# Common spices new to the library, ticked as "always have" like the other staples.
NEW_STAPLES = ["black pepper", "chili powder", "paprika", "garlic powder", "Italian seasoning", "cinnamon"]


def main():
    seed = json.loads(SEED.read_text())
    for r in RECIPES:
        r["nutrition"] = nutrition(r)
        r["since"] = 3
    keys = {r["key"] for r in RECIPES}
    assert len(keys) == len(RECIPES), "duplicate keys"
    kept = [r for r in seed["recipes"] if r["key"] not in keys]
    assert not ({r["name"] for r in kept} & {r["name"] for r in RECIPES}), "a new recipe shares a name with an old one"
    seed["recipes"] = kept + RECIPES
    seed["version"] = max(seed["version"], 3)
    extra = seed.setdefault("extraPantryStaples", [])
    for s in NEW_STAPLES:
        if s not in extra and s not in seed["pantryStaples"]:
            extra.append(s)
    SEED.write_text(json.dumps(seed, indent=2, ensure_ascii=False) + "\n")
    for r in RECIPES:
        print(f"{r['key']:5} {r['name'][:46]:46} {r['nutrition']}")
    print(f"{len(RECIPES)} recipes written; the library now has {len(seed['recipes'])}")


if __name__ == "__main__":
    main()
