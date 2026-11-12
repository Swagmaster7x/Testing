"""Version 4 recipes, part C: the Americas, the Caribbean and the Pacific."""
from recipe_lib import C, P, T, V, ing, recipe, swap

# name -> unit -> (calories, protein g, carbs g, fat g) for ONE unit, only for foods recipe_lib.MACROS lacks.
NEW_MACROS = {
    "quick grits": {"cup": (579, 14, 124, 2)},      # dry, 156 g
    "masa harina": {"cup": (416, 11, 87, 4)},       # dry, 114 g
    "split peas": {"cup": (672, 48, 119, 2)},       # dry, 197 g
    "blue cheese": {"oz": (100, 6, 0.7, 8)},
    "poblano peppers": {"": (25, 1, 5.5, 0.2)},     # one medium, about 120 g
}

# Herbs and spices recipe_lib.NEGLIGIBLE lacks.
NEW_NEGLIGIBLE = {"habanero"}

# Keys of recipes with nothing raw to cook.
NO_COOK = set()

RECIPES = [
    # ---------- Breakfasts ----------
    recipe("W68", "Huevos rancheros (Mexican fried eggs on tortillas)", "BREAKFAST", ["Hispanic"], 4, "2 eggs on 2 tortillas", "EGG", [
        ing(8, None, "eggs", P), ing(8, None, "corn tortillas", C), ing(1, "can", "pinto beans", C, "drained and rinsed"),
        ing(1, "can", "diced tomatoes", T), ing(1, None, "onion", V), ing(1, None, "jalapeño", V),
        ing(2, None, "garlic cloves", V), ing(1, "tsp", "cumin", T), ing(1, "tbsp", "olive oil", T),
        ing(1, None, "avocado", V), ing("1/2", "cup", "feta", T, "or queso fresco, crumbled"), ing(1, None, "lime", V),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, jalapeño and garlic in 1 tsp of the oil for 4 minutes. Add the tomatoes, cumin and salt and simmer for 8 minutes into a chunky sauce.",
        "Warm the beans in a small pot with a splash of water and mash them roughly with a fork.",
        "Warm the tortillas in a dry pan until soft with a few toasted spots.",
        "Fry the eggs in the rest of the oil until the whites are set.",
        "Spread the beans on the tortillas, top each with an egg and spoon over the sauce.",
        "Finish with sliced avocado, feta, cilantro and a squeeze of lime.",
    ]),
    recipe("W69", "Gallo pinto with eggs (Costa Rican rice and beans)", "BREAKFAST", ["Hispanic"], 4, "1 cup rice and beans with 2 eggs", "EGG", [
        ing(8, None, "eggs", P), ing(3, "cups", "cooked rice", C, "day-old is best"),
        ing(1, "can", "black beans", C, "with a few spoonfuls of the liquid"), ing(1, None, "onion", V),
        ing(1, None, "bell pepper", V), ing(2, None, "garlic cloves", V), ing(1, "tsp", "cumin", T),
        ing(1, "tbsp", "oil", T), ing(1, None, "avocado", V), ing(1, "handful of", "cilantro", V),
        ing(None, None, "hot sauce", T), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion and bell pepper in the oil in a large skillet for 5 minutes. Add the garlic and cumin for 30 seconds.",
        "Add the beans with a few spoonfuls of their liquid and simmer for 3 minutes.",
        "Stir in the rice and cook for 4 to 5 minutes, stirring, until hot and speckled. Fold in the chopped cilantro and salt to taste.",
        "Fry or scramble the eggs in a nonstick pan until set.",
        "Serve the gallo pinto with the eggs, sliced avocado and hot sauce.",
        "The rice and beans keep for 4 days in the fridge; reheat until steaming and cook the eggs fresh.",
    ], prep=True),
    recipe("W70", "Mangú with eggs (Dominican mashed green plantains)", "BREAKFAST", ["Caribbean"], 2, "1 cup mangú with 2 eggs", "EGG", [
        ing(2, None, "plantains", C, "green"), ing(4, None, "eggs", P), ing(1, None, "red onion", V, "sliced into rings"),
        ing(2, "tbsp", "white vinegar", T), ing(1, "tbsp", "olive oil", T), ing("1/2", None, "avocado", V),
        ing(None, None, "cooking spray", T), ing(None, None, "salt", T),
    ], [
        "Peel the plantains, cut them into chunks and boil in salted water for 20 to 25 minutes until very soft.",
        "Soak the onion in the vinegar with a pinch of salt for 10 minutes, then cook it with its vinegar in 1 tsp of the oil for 2 to 3 minutes until just soft and pink.",
        "Drain the plantains, saving a cup of the cooking water. Mash with the rest of the oil and enough of the water to make a smooth, soft mash. Salt to taste.",
        "Fry or scramble the eggs in a nonstick pan with cooking spray until set.",
        "Serve the mangú topped with the onions, with the eggs and sliced avocado on the side.",
    ]),
    recipe("W71", "Cachapas with cheese (Venezuelan sweet corn pancakes)", "BREAKFAST", ["Hispanic"], 2, "2 filled pancakes", "VEGETARIAN", [
        ing(3, "cups", "frozen corn", V, "thawed"), ing("1/3", "cup", "cornmeal", C), ing(2, None, "eggs", P),
        ing("1/4", "cup", "milk", T), ing("3/4", "cup", "part-skim mozzarella", T, "shredded"),
        ing(2, "tsp", "olive oil", T), ing(None, None, "salt", T),
    ], [
        "Blend the corn, cornmeal, eggs, milk and 1/2 tsp salt into a thick, slightly chunky batter. Let it rest for 5 minutes.",
        "Heat a nonstick pan over medium-low heat and brush it with a little of the oil. Pour in 1/2 cup of batter and spread it into a 6-inch round.",
        "Cook for 3 to 4 minutes until the edges are set and the bottom is golden. Flip carefully and cook 3 minutes more. Repeat to make 4.",
        "Scatter the cheese over half of each cachapa, fold it over and warm for 1 minute until the cheese melts.",
    ], tip="Serve with sliced tomato and avocado on the side."),
    recipe("W72", "Shrimp and cheese grits (Lowcountry, Southern US)", "BREAKFAST", ["American"], 4, "1 cup shrimp over 3/4 cup grits", "FISH", [
        ing(1, "lb", "shrimp", P, "peeled and deveined"), ing(1, "cup", "quick grits", C), ing(1, "cup", "milk", T),
        ing("1/2", "cup", "cheddar", T, "sharp, shredded"), ing(1, None, "bell pepper", V), ing(1, "cup", "cherry tomatoes", V, "halved"),
        ing(2, "handfuls", "baby spinach", V), ing(3, None, "garlic cloves", V), ing(1, "tbsp", "olive oil", T),
        ing(1, "tsp", "smoked paprika", T), ing(1, None, "lemon", V), ing(3, None, "scallions", V),
        ing(None, None, "hot sauce", T), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Bring the milk and 3 cups of water to a boil with 1/2 tsp salt. Whisk in the grits, lower the heat, cover and cook for 5 to 7 minutes, stirring often, until thick.",
        "Stir the cheddar into the grits and keep them covered.",
        "Toss the shrimp with the smoked paprika, salt and pepper. Heat the oil in a large skillet and cook the diced bell pepper for 3 minutes.",
        "Add the shrimp and minced garlic and cook for 2 to 3 minutes, turning, until pink and opaque. Add the tomatoes and spinach for 1 minute until just wilted.",
        "Squeeze over the lemon, spoon the shrimp over the grits and top with scallions and hot sauce.",
    ]),
    recipe("W73", "Loco moco (Hawaiian rice bowl with beef patty and egg)", "BREAKFAST", ["American"], 4, "1 bowl with 3/4 cup rice", "BEEF", [
        ing(1, "lb", "90% lean ground beef", P), ing(4, None, "eggs", P), ing(3, "cups", "cooked brown rice", C),
        ing(8, "oz", "mushrooms", V, "sliced"), ing(1, None, "onion", V, "finely diced"),
        ing("1 1/2", "cups", "low-sodium beef broth", T), ing(1, "tbsp", "low-sodium soy sauce", T),
        ing(2, "tsp", "cornstarch", T), ing(1, "tsp", "olive oil", T),
        ing(None, None, "cooking spray", T), ing(2, None, "scallions", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Mix the beef with half the onion, salt and pepper. Shape into 4 thin patties.",
        "Cook the patties in a hot skillet for 3 to 4 minutes a side until 160°F inside. Set aside.",
        "In the same pan, cook the rest of the onion and the mushrooms in the oil for 5 minutes until browned.",
        "Whisk the broth, soy sauce and cornstarch, pour into the pan and simmer for 2 to 3 minutes until it thickens into a gravy.",
        "Fry the eggs in a nonstick pan with cooking spray until the whites are set.",
        "Put 3/4 cup of hot rice in each bowl, add a patty, spoon over the mushroom gravy and top with an egg and scallions.",
    ], tip="Wilt a bag of baby spinach in the gravy pan and tuck it under the patty."),

    # ---------- Lunches ----------
    recipe("W74", "Red beans and rice with chicken sausage (New Orleans)", "LUNCH", ["American"], 4, "1 1/2 cups beans over 3/4 cup rice", "CHICKEN", [
        ing(4, "links", "andouille chicken sausage", P, "fully cooked, sliced"), ing(2, "cans", "kidney beans", C, "drained and rinsed"),
        ing(1, None, "onion", V), ing(1, None, "bell pepper", V, "green"), ing(2, None, "celery stalks", V),
        ing(4, None, "garlic cloves", V), ing(2, "cups", "low-sodium broth", T), ing(2, "tsp", "Cajun seasoning", T),
        ing(1, "tsp", "thyme", T, "dried"), ing(2, None, "bay leaves", T), ing(1, "tbsp", "olive oil", T),
        ing(3, "cups", "cooked brown rice", C), ing(3, None, "scallions", V), ing(None, None, "hot sauce", T),
    ], [
        "Brown the sausage in the oil in a large pot for 3 to 4 minutes. Lift it out.",
        "Cook the diced onion, bell pepper and celery in the same pot for 6 minutes. Add the garlic, Cajun seasoning and thyme for 1 minute.",
        "Add the beans, broth and bay leaves. Simmer for 20 minutes, then mash some of the beans against the side of the pot to make it creamy.",
        "Return the sausage and simmer for 5 minutes until hot all the way through (165°F). Take out the bay leaves.",
        "Serve over the rice with scallions and hot sauce. Keeps for 4 days in the fridge.",
    ], prep=True, swaps=[
        swap("No sausage", "VEGETARIAN", "andouille chicken sausage", "kidney beans, drained", "One more can of beans stands in for the sausage. Add 1 tsp smoked paprika with the garlic for the smoky flavor.", 1, "can"),
    ]),
    recipe("W75", "Pelau (Trinidadian chicken, rice and pigeon peas)", "LUNCH", ["Caribbean"], 6, "1 1/2 cups", "CHICKEN", [
        ing("1 1/2", "lb", "chicken thighs", P, "boneless skinless, in chunks"), ing("1 1/2", "cups", "rice", C, "long-grain, rinsed"),
        ing(1, "can", "pigeon peas", C, "drained and rinsed"), ing(1, "can", "light coconut milk", T),
        ing("1 1/2", "cups", "low-sodium chicken broth", T), ing(2, "tbsp", "brown sugar", T), ing(1, "tbsp", "oil", T),
        ing(1, None, "onion", V), ing(1, None, "bell pepper", V), ing(2, None, "carrots", V), ing(4, None, "garlic cloves", V),
        ing(3, None, "scallions", V), ing(1, "tsp", "thyme", T, "dried"), ing(1, "tbsp", "ketchup", T),
        ing(1, "handful of", "cilantro", V), ing(1, None, "habanero", V, "whole, or Scotch bonnet; leave out for no heat"),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Toss the chicken with the minced garlic, thyme, chopped scallions and cilantro, ketchup, 1/2 tsp salt and pepper. Let it sit for 15 minutes (or overnight).",
        "Heat the oil in a heavy pot over medium heat. Add the brown sugar and let it melt and bubble to a dark amber, about 2 minutes. Watch it closely so it doesn't burn.",
        "Add the chicken and stir to coat it in the caramel. Cook for 5 minutes until browned.",
        "Stir in the diced onion, bell pepper and carrots and the rice. Add the pigeon peas, coconut milk, broth, 1/2 tsp salt and the whole habanero.",
        "Bring to a boil, cover and simmer on low for 25 minutes until the rice is tender and the chicken is 165°F.",
        "Take out the habanero, fluff with a fork and rest for 5 minutes. Keeps for 4 days in the fridge.",
    ], prep=True),
    recipe("W76", "Curry channa and aloo (Trinidadian chickpeas and potato)", "LUNCH", ["Caribbean"], 4, "1 1/2 cups with 3/4 cup rice", "VEGETARIAN", [
        ing(2, "cans", "chickpeas", C, "drained and rinsed"), ing(1, "lb", "potatoes", C, "peeled and cubed"),
        ing(1, None, "onion", V), ing(4, None, "garlic cloves", V), ing(2, "tbsp", "curry powder", T),
        ing(1, "tsp", "cumin", T), ing("1/2", "tsp", "turmeric", T), ing(1, "tbsp", "oil", T),
        ing(3, "cups", "cooked rice", C), ing(1, "handful of", "cilantro", V), ing(None, None, "hot sauce", T),
        ing(None, None, "salt", T),
    ], [
        "Stir the curry powder, cumin and turmeric with 1/4 cup of water into a paste.",
        "Cook the diced onion in the oil for 5 minutes. Add the minced garlic and the curry paste and cook for 2 minutes, stirring, until the water cooks off and it smells toasty.",
        "Add the potatoes and stir to coat. Add the chickpeas, 2 cups of water and 1/2 tsp salt.",
        "Simmer, partly covered, for 20 to 25 minutes until the potatoes are soft. Mash a few pieces to thicken the sauce.",
        "Stir in the chopped cilantro and hot sauce to taste. Serve over the rice. Keeps for 4 days in the fridge.",
    ], prep=True, tip="Stir in a bag of baby spinach at the end until it wilts."),
    recipe("W77", "Solterito with quinoa (Peruvian bean and corn salad)", "LUNCH", ["Hispanic"], 4, "2 cups", "VEGETARIAN", [
        ing(1, "cup", "quinoa", C, "rinsed"), ing(1, "can", "lima beans", C, "drained and rinsed; stands in for fava beans"),
        ing("1 1/2", "cups", "frozen corn", V), ing(2, None, "tomatoes", V), ing("1/2", None, "red onion", V),
        ing("3/4", "cup", "feta", T, "or queso fresco, cubed"), ing("1/4", "cup", "olives", T, "black, halved"),
        ing(2, "tbsp", "olive oil", T), ing(2, None, "limes", V), ing(1, "tbsp", "white vinegar", T),
        ing(1, None, "jalapeño", V, "seeded and minced"), ing(1, "tsp", "oregano", T), ing(1, "handful of", "parsley", V),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Simmer the quinoa in 2 cups of water, covered, for 15 minutes. Fluff with a fork and let it cool.",
        "Cook the corn in boiling water for 2 minutes, then drain and cool under cold water.",
        "Whisk the oil, lime juice, vinegar, oregano, jalapeño, salt and pepper in a large bowl.",
        "Add the quinoa, corn, lima beans, diced tomatoes, finely sliced onion and olives. Toss well.",
        "Fold in the feta and chopped parsley. Keeps for 4 days in the fridge.",
    ], prep=True),
    recipe("W78", "Bean and cheese pupusas with curtido (Salvadoran)", "LUNCH", ["Hispanic"], 4, "2 pupusas with slaw", "VEGETARIAN", [
        ing(2, "cups", "masa harina", C, "instant corn masa flour"), ing(1, "can", "pinto beans", C, "drained and rinsed"),
        ing(1, "cup", "part-skim mozzarella", T, "shredded"), ing("1/2", "head", "cabbage", V, "shredded"),
        ing(2, None, "carrots", V, "grated"), ing("1/2", None, "onion", V, "thinly sliced"),
        ing("1/4", "cup", "apple cider vinegar", T), ing(1, "tsp", "oregano", T), ing(None, "pinch of", "red pepper flakes", T),
        ing(1, "cup", "salsa", V), ing(1, "tbsp", "oil", T), ing(None, None, "salt", T),
    ], [
        "Make the curtido: toss the cabbage, carrots and onion with the vinegar, oregano, red pepper flakes and 1/2 tsp salt. Set aside for at least 20 minutes.",
        "Mix the masa harina with 1 1/2 cups of warm water and 1/2 tsp salt into a soft dough. If it cracks when pressed, add a little more water. Rest for 10 minutes.",
        "Mash half the beans until smooth and mix them with the cheese. Warm the rest of the beans to serve on the side.",
        "With lightly oiled hands, divide the dough into 8 balls. Flatten one into a 5-inch disk, put about 3 tbsp of filling in the middle, pinch the dough closed around it and pat it flat again.",
        "Cook on a hot, lightly oiled griddle or skillet for 4 to 5 minutes a side until browned in spots and hot through.",
        "Serve 2 pupusas each with a big pile of curtido, the salsa and the rest of the beans.",
    ]),
    recipe("W79", "Ceviche de camarón (Ecuadorian shrimp in citrus)", "LUNCH", ["Hispanic"], 4, "1 1/2 cups with plantain chips", "FISH", [
        ing("1 1/2", "lb", "shrimp", P, "peeled and deveined"), ing(4, None, "limes", V), ing("1/2", "cup", "orange juice", V),
        ing(2, "tbsp", "ketchup", T), ing(1, "tsp", "mustard", T), ing(2, None, "tomatoes", V), ing(1, None, "red onion", V),
        ing(1, None, "avocado", V), ing(2, None, "plantains", C, "green"), ing(1, "tbsp", "oil", T),
        ing(1, "handful of", "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 400°F. Peel the plantains, slice into thin rounds, toss with the oil and salt and bake on a lined sheet pan for 15 to 18 minutes, turning once, until golden at the edges.",
        "Soak the thinly sliced red onion in cold salted water for 10 minutes, then drain.",
        "Simmer the shrimp in salted water for 2 to 3 minutes until pink and opaque. Drain and cool under cold water.",
        "Stir the lime juice, orange juice, ketchup and mustard in a large bowl. Add the shrimp, onion, diced tomatoes and chopped cilantro. Chill for 15 minutes.",
        "Serve in bowls with diced avocado on top and the plantain chips on the side.",
    ]),
    recipe("W80", "Chicken kelaguen wraps (Chamorro lemon-coconut chicken)", "LUNCH", ["American"], 4, "1 wrap", "CHICKEN", [
        ing("1 1/2", "lb", "chicken breast", P), ing(3, None, "lemons", V), ing(4, "tbsp", "unsweetened shredded coconut", T),
        ing(4, None, "scallions", V), ing(1, None, "jalapeño", V, "or a hotter chili, minced"), ing(1, "tsp", "olive oil", T),
        ing(4, None, "whole-wheat tortillas", C), ing(1, "head", "romaine lettuce", V), ing(1, None, "cucumber", V),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Rub the chicken with the oil, salt and pepper. Grill or cook in a hot pan for 5 to 6 minutes a side until charred in spots and 165°F inside.",
        "Rest the chicken for 5 minutes, then chop it into small pieces.",
        "Toss the warm chicken with the lemon juice, coconut, sliced scallions, jalapeño and 1/2 tsp salt. Taste and add more lemon or salt; it should be bright and tangy.",
        "Warm the tortillas in a dry pan. Fill with shredded lettuce, the kelaguen and sliced cucumber and fold up.",
    ]),
    recipe("W81", "Lighter Cubano (Cuban pork, ham and Swiss sandwich)", "LUNCH", ["Caribbean"], 4, "1 sandwich", "PORK", [
        ing(1, "lb", "pork tenderloin", P), ing(4, "oz", "lean ham", P, "thinly sliced"), ing(4, "slices", "Swiss cheese", T),
        ing(4, None, "whole-wheat sub rolls", C), ing(4, None, "pickles", T, "dill, sliced lengthwise"), ing(2, "tbsp", "mustard", T),
        ing("1/4", "cup", "orange juice", V), ing(1, None, "lime", V), ing(3, None, "garlic cloves", V),
        ing(1, "tsp", "cumin", T), ing(1, "tsp", "oregano", T), ing(1, "tsp", "olive oil", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F. Rub the pork with the orange juice, lime juice, minced garlic, cumin, oregano, oil, salt and pepper.",
        "Roast on a lined pan for 20 to 25 minutes until 145°F inside. Rest for 5 minutes, then slice thin.",
        "Split the rolls and spread both sides with mustard. Layer with the pork, ham, Swiss cheese and pickles.",
        "Press the sandwiches in a hot skillet under a second heavy pan for 3 to 4 minutes a side, until the bread is crisp and the cheese melts.",
        "Cut in half on the diagonal.",
    ], tip="Serve with a tomato and avocado salad."),
    recipe("W82", "Turkey Cobb salad (Californian chopped salad)", "LUNCH", ["American"], 4, "1 big plate", "TURKEY", [
        ing(1, "lb", "turkey breast cutlets", P), ing(4, None, "eggs", P), ing(4, "slices", "turkey bacon", P),
        ing(2, "heads", "romaine lettuce", V), ing(2, "cups", "cherry tomatoes", V), ing(1, None, "avocado", V),
        ing(2, "oz", "blue cheese", T, "crumbled"), ing(2, "tbsp", "olive oil", T), ing(2, "tbsp", "apple cider vinegar", T),
        ing(1, "tsp", "Dijon mustard", T), ing(None, None, "chives", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Boil the eggs for 10 minutes, cool in cold water, peel and quarter.",
        "Season the turkey with salt and pepper. Cook in 1 tsp of the oil in a hot pan for 3 to 4 minutes a side until 165°F inside. Rest, then dice.",
        "Cook the turkey bacon in the same pan until crisp, then chop.",
        "Whisk the rest of the oil with the vinegar, mustard, salt and pepper.",
        "Pile the chopped romaine on plates and arrange rows of turkey, egg, bacon, halved tomatoes, diced avocado and blue cheese on top.",
        "Drizzle with the dressing and scatter with chives.",
    ], swaps=[
        swap("Chicken breast", "CHICKEN", "turkey breast cutlets", "chicken breast", "Cook for 5 to 6 minutes a side until 165°F."),
    ]),

    # ---------- Dinners ----------
    recipe("W83", "Lomo saltado with rice (Peruvian beef stir-fry)", "DINNER", ["Hispanic"], 4, "1 1/2 cups with 1/2 cup rice", "BEEF", [
        ing(1, "lb", "sirloin steak", P, "sliced thin"), ing(1, "lb", "potatoes", C, "cut into thin fries"),
        ing(2, "tbsp", "oil", T), ing(1, None, "red onion", V, "in thick wedges"), ing(3, None, "tomatoes", V, "in wedges"),
        ing(1, None, "jalapeño", V, "sliced"), ing(3, None, "garlic cloves", V), ing(3, "tbsp", "low-sodium soy sauce", T),
        ing(2, "tbsp", "white vinegar", T), ing(1, "tsp", "cumin", T), ing(2, "cups", "cooked rice", C),
        ing(1, "handful of", "cilantro", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 450°F. Toss the potatoes with 1 tbsp of the oil and salt and bake on a sheet pan for 25 minutes, turning once, until golden.",
        "Toss the steak with the cumin, pepper and 1 tbsp of the soy sauce.",
        "Heat the rest of the oil in a large skillet or wok over the highest heat. Sear the steak in one layer for 1 to 2 minutes a side until browned (145°F inside). Lift it out.",
        "Stir-fry the onion, garlic and jalapeño for 2 minutes; they should stay a little crisp. Add the tomatoes for 1 minute.",
        "Return the steak with the rest of the soy sauce and the vinegar. Toss for 30 seconds, then fold in the fries and cilantro.",
        "Serve right away over the rice.",
    ], swaps=[
        swap("Chicken (pollo saltado)", "CHICKEN", "sirloin steak", "chicken breast, sliced thin", "Stir-fry for 4 to 5 minutes until 165°F."),
    ]),
    recipe("W84", "Chimichurri flank steak with potatoes (Argentine)", "DINNER", ["Hispanic"], 4, "5 oz steak with potatoes and salad", "BEEF", [
        ing("1 1/4", "lb", "flank steak", P), ing("1 1/2", "lb", "potatoes", C, "halved"), ing(4, "tbsp", "olive oil", T),
        ing(1, "bunch", "parsley", V), ing(4, None, "garlic cloves", V), ing(2, "tsp", "oregano", T),
        ing("1/2", "tsp", "red pepper flakes", T), ing(3, "tbsp", "apple cider vinegar", T), ing(3, None, "tomatoes", V),
        ing(1, None, "bell pepper", V), ing("1/2", None, "red onion", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Heat the oven to 425°F. Toss the potatoes with 1 tbsp of the oil and salt on a sheet pan. Roast for 30 minutes, turning once, until golden.",
        "Make the chimichurri: finely chop the parsley and garlic and stir with the oregano, red pepper flakes, vinegar, the rest of the oil, 1/2 tsp salt and 1 tbsp of water.",
        "Pat the steak dry and season well with salt and pepper. Grill or sear in a very hot pan for 4 to 5 minutes a side until 145°F inside.",
        "Rest the steak for 5 to 10 minutes, then slice it thinly across the grain.",
        "Dice the tomatoes, bell pepper and onion and dress them with a spoonful of the chimichurri.",
        "Serve the steak and potatoes with the rest of the chimichurri spooned over and the salad on the side.",
    ]),
    recipe("W85", "Pastel de choclo (Chilean beef and sweet corn pie)", "DINNER", ["Hispanic"], 6, "1 big square with tomato salad", "BEEF", [
        ing("1 1/2", "lb", "90% lean ground beef", P), ing(3, None, "eggs", P), ing(2, None, "onions", V),
        ing(5, "cups", "frozen corn", V, "thawed"), ing("1/2", "cup", "milk", T), ing("1/4", "cup", "cornmeal", C),
        ing("1/4", "cup", "olives", T, "black"), ing(2, "tbsp", "raisins", T), ing(1, "tbsp", "olive oil", T),
        ing(2, "tsp", "paprika", T), ing(1, "tsp", "cumin", T), ing(1, "tsp", "oregano", T), ing(2, "tsp", "sugar", T),
        ing(1, "handful of", "basil", V), ing(3, None, "tomatoes", V), ing(None, None, "salt", T),
    ], [
        "Heat the oven to 400°F. Boil the eggs for 10 minutes, cool, peel and slice.",
        "Cook the diced onions in the oil for 8 minutes until soft. Add the beef, paprika, cumin, oregano and salt and cook, breaking it up, until no pink remains (160°F). Stir in the raisins.",
        "Blend the corn, milk, cornmeal, basil and 1/2 tsp salt until mostly smooth. Cook in a pot over medium heat for 5 minutes, stirring, until thick.",
        "Spread the beef in a 9x13-inch baking dish. Top with the egg slices and olives, then cover with the corn mixture and sprinkle with the sugar.",
        "Bake for 30 minutes until bubbling and golden on top. Serve with a salad of sliced tomatoes.",
    ], swaps=[
        swap("Ground turkey", "TURKEY", "90% lean ground beef", "93% lean ground turkey", "Cook to 165°F."),
    ]),
    recipe("W86", "Moqueca (Brazilian fish stew with coconut and lime)", "DINNER", ["Latin American"], 4, "1 1/2 cups with 3/4 cup rice", "FISH", [
        ing("1 1/2", "lb", "white fish fillets", P, "cod or halibut, in large chunks"), ing(2, None, "limes", V),
        ing(4, None, "garlic cloves", V), ing(1, None, "onion", V), ing(2, None, "bell peppers", V), ing(3, None, "tomatoes", V),
        ing(1, "can", "light coconut milk", T), ing(1, "tbsp", "tomato paste", T), ing(1, "tbsp", "olive oil", T),
        ing(1, "tsp", "paprika", T), ing(3, "cups", "cooked rice", C), ing(1, "handful of", "cilantro", V),
        ing(2, None, "scallions", V), ing(None, None, "hot sauce", T), ing(None, None, "salt", T),
    ], [
        "Toss the fish with the juice of 1 lime, half the minced garlic and 1/2 tsp salt. Set aside for 15 minutes.",
        "In a wide pot, cook the sliced onion and bell peppers in the oil for 5 minutes. Add the rest of the garlic, the paprika and tomato paste for 1 minute.",
        "Add the sliced tomatoes and coconut milk and simmer for 8 minutes.",
        "Nestle the fish into the sauce, cover and simmer gently for 6 to 8 minutes, without stirring, until the fish is opaque and flakes easily (145°F).",
        "Squeeze over the second lime, scatter with cilantro and scallions and serve over the rice with hot sauce.",
    ]),
    recipe("W87", "Pescado a la veracruzana (Mexican fish, tomato and olives)", "DINNER", ["Hispanic"], 4, "1 fillet with sauce and 3/4 cup rice", "FISH", [
        ing("1 1/2", "lb", "tilapia fillets", P, "or snapper"), ing(2, "cans", "diced tomatoes", T), ing(1, None, "onion", V),
        ing(1, None, "bell pepper", V), ing(4, None, "garlic cloves", V), ing(1, None, "jalapeño", V, "sliced"),
        ing("1/3", "cup", "olives", T, "green, sliced"), ing(2, "tbsp", "capers", T), ing(2, None, "bay leaves", T),
        ing(1, "tsp", "oregano", T), ing(1, "tbsp", "olive oil", T), ing(1, None, "lime", V), ing(3, "cups", "cooked rice", C),
        ing(1, "handful of", "parsley", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Cook the sliced onion and bell pepper in the oil in a wide skillet for 5 minutes. Add the garlic and jalapeño for 1 minute.",
        "Add the tomatoes, olives, capers, bay leaves and oregano. Simmer for 10 minutes until slightly thickened.",
        "Season the fish with salt, pepper and lime juice. Nestle the fillets into the sauce and spoon some over the top.",
        "Cover and simmer for 6 to 8 minutes until the fish is opaque and flakes easily (145°F). Take out the bay leaves.",
        "Scatter with parsley and serve over the rice.",
    ]),
    recipe("W88", "Shrimp Creole with rice (Louisiana)", "DINNER", ["American"], 4, "1 1/2 cups with 3/4 cup rice", "FISH", [
        ing("1 1/2", "lb", "shrimp", P, "peeled and deveined"), ing(1, None, "onion", V), ing(1, None, "bell pepper", V, "green"),
        ing(3, None, "celery stalks", V), ing(4, None, "garlic cloves", V), ing(1, "can", "crushed tomatoes", T, "28 oz"),
        ing(1, "cup", "low-sodium broth", T), ing(2, "tsp", "Cajun seasoning", T), ing(1, "tsp", "thyme", T, "dried"),
        ing(2, None, "bay leaves", T), ing(1, "tsp", "Worcestershire sauce", T), ing(1, "tbsp", "olive oil", T),
        ing(3, "cups", "cooked rice", C), ing(3, None, "scallions", V), ing(None, None, "hot sauce", T), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, bell pepper and celery in the oil in a large skillet for 7 minutes until soft.",
        "Add the garlic, Cajun seasoning and thyme for 1 minute.",
        "Add the tomatoes, broth, bay leaves and Worcestershire. Simmer for 15 minutes until thick.",
        "Stir in the shrimp and simmer for 3 to 4 minutes until pink and opaque. Take out the bay leaves and season with salt and hot sauce.",
        "Serve over the rice with scallions.",
    ], tip="Add 2 cups of sliced okra with the tomatoes.", swaps=[
        swap("Chicken breast", "CHICKEN", "shrimp", "chicken breast, cubed", "Brown the chicken first, then simmer it in the sauce for 10 minutes until 165°F."),
    ]),
    recipe("W89", "Brown stew chicken with rice (Jamaican)", "DINNER", ["Caribbean"], 4, "1 1/2 cups with 3/4 cup rice", "CHICKEN", [
        ing("1 1/2", "lb", "chicken thighs", P, "boneless skinless"), ing(1, "tbsp", "brown sugar", T),
        ing(1, "tbsp", "low-sodium soy sauce", T), ing(2, "tbsp", "ketchup", T), ing(1, None, "onion", V),
        ing(1, None, "bell pepper", V), ing(2, None, "carrots", V), ing(2, None, "tomatoes", V), ing(4, None, "garlic cloves", V),
        ing(1, "tbsp", "ginger", V, "grated"), ing(3, None, "scallions", V), ing(1, "tsp", "thyme", T, "dried"),
        ing(1, "tsp", "allspice", T), ing(1, None, "habanero", V, "whole, or Scotch bonnet; leave out for no heat"),
        ing("1 1/2", "cups", "low-sodium chicken broth", T), ing(1, "tbsp", "oil", T), ing(3, "cups", "cooked rice", C),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Toss the chicken with the brown sugar, soy sauce, allspice, thyme, minced garlic, ginger, chopped scallions, salt and pepper. Marinate for 30 minutes (or overnight).",
        "Heat the oil in a heavy pot over medium-high heat. Scrape the marinade off the chicken and brown the pieces well, 3 to 4 minutes a side. Set aside.",
        "Cook the sliced onion, bell pepper and carrots in the same pot for 4 minutes.",
        "Add the chopped tomatoes, ketchup, broth, any leftover marinade and the whole habanero. Return the chicken.",
        "Cover and simmer for 25 minutes until the chicken is tender and 165°F and the gravy is thick. Take out the habanero.",
        "Serve over the rice.",
    ], tip="Serve with steamed cabbage on the side."),
    recipe("W90", "Lighter feijoada (Brazilian black bean and pork stew)", "DINNER", ["Latin American"], 6, "1 1/2 cups with 1/2 cup rice and greens", "PORK", [
        ing(1, "lb", "pork tenderloin", P, "in 1-inch cubes"), ing(3, "links", "andouille chicken sausage", P, "fully cooked, sliced"),
        ing(3, "cans", "black beans", C, "drained and rinsed"), ing(1, None, "onion", V), ing(6, None, "garlic cloves", V),
        ing(3, None, "bay leaves", T), ing(1, "tsp", "smoked paprika", T), ing(2, "cups", "low-sodium broth", T),
        ing(1, "tbsp", "olive oil", T), ing(1, "tbsp", "white vinegar", T), ing(1, "bunch", "collard greens", V),
        ing(3, "cups", "cooked rice", C), ing(2, None, "oranges", V, "sliced"), ing(None, None, "hot sauce", T),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Season the pork with salt and pepper. Brown it in 2 tsp of the oil in a large pot for 4 to 5 minutes. Add the sausage and brown for 2 minutes. Lift everything out.",
        "Cook the diced onion in the same pot for 5 minutes. Add 4 of the garlic cloves, minced, and the smoked paprika for 1 minute.",
        "Add the beans, broth and bay leaves. Simmer for 15 minutes, then mash a ladleful of beans against the side of the pot to thicken the stew.",
        "Return the pork and sausage and simmer for 15 minutes more, until the pork is tender (at least 145°F) and the sausage is hot through (165°F). Take out the bay leaves and stir in the vinegar.",
        "Slice the collard greens into thin ribbons. Cook them with the rest of the garlic, minced, in the rest of the oil for 2 to 3 minutes until bright green and just wilted.",
        "Serve the feijoada with the rice, greens, orange slices and hot sauce.",
    ]),
    recipe("W91", "Pepián de pollo (Guatemalan chicken in toasted seed sauce)", "DINNER", ["Hispanic"], 4, "1 1/2 cups with 2 tortillas", "CHICKEN", [
        ing("1 1/2", "lb", "chicken thighs", P, "boneless skinless"), ing(4, "tbsp", "pumpkin seeds", T, "hulled (pepitas)"),
        ing(2, "tbsp", "sesame seeds", T), ing(1, "can", "diced tomatoes", T, "fire-roasted if you can"), ing(1, None, "onion", V, "in wedges"),
        ing(4, None, "garlic cloves", V), ing(1, "tbsp", "chili powder", T), ing("1/2", "tsp", "cinnamon", T),
        ing(2, "cups", "low-sodium chicken broth", T), ing(1, "lb", "potatoes", C, "in chunks"), ing(2, None, "carrots", V),
        ing("1/2", "lb", "green beans", V, "trimmed"), ing(1, "tbsp", "oil", T), ing(8, None, "corn tortillas", C),
        ing(1, "handful of", "cilantro", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Toast the pumpkin seeds and sesame seeds in a dry skillet over medium heat for 3 to 4 minutes, stirring, until golden and popping. Tip them into a blender.",
        "In the same skillet, char the onion and whole garlic cloves for 5 minutes. Add to the blender with the tomatoes, chili powder, cinnamon, cilantro and 1 cup of the broth. Blend until smooth.",
        "Season the chicken with salt and pepper and brown it in the oil in a large pot, 3 minutes a side.",
        "Pour in the sauce and the rest of the broth. Add the potatoes and sliced carrots, cover and simmer for 15 minutes.",
        "Add the green beans and simmer for 10 minutes more, until the vegetables are tender and the chicken is 165°F. Salt to taste.",
        "Serve in bowls with warm tortillas.",
    ]),
    recipe("W92", "Chile verde (Mexican pork in tomatillo sauce)", "DINNER", ["Hispanic"], 4, "1 1/2 cups with beans and 2 tortillas", "PORK", [
        ing("1 1/2", "lb", "pork tenderloin", P, "in 1-inch cubes"), ing(2, "cups", "salsa verde", T, "tomatillo salsa"),
        ing(2, None, "poblano peppers", V), ing(1, None, "onion", V), ing(4, None, "garlic cloves", V),
        ing(1, None, "jalapeño", V), ing(2, "tsp", "cumin", T), ing(1, "tsp", "oregano", T),
        ing(1, "cup", "low-sodium broth", T), ing(1, "tbsp", "oil", T), ing(1, "can", "pinto beans", C, "drained and rinsed"),
        ing(8, None, "corn tortillas", C), ing(1, None, "lime", V), ing(1, "handful of", "cilantro", V),
        ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Halve and seed the poblanos. Broil them skin side up for 6 to 8 minutes until blistered. Cool, peel off the loose skin and chop.",
        "Season the pork with the cumin, oregano, salt and pepper. Brown it in the oil in a large pot for 4 to 5 minutes. Lift it out.",
        "Cook the diced onion, garlic and jalapeño in the same pot for 4 minutes.",
        "Return the pork with the poblanos, salsa verde and broth. Simmer, partly covered, for 20 to 25 minutes until the pork is tender (at least 145°F) and the sauce has thickened.",
        "Warm the beans and the tortillas.",
        "Stir the cilantro and lime juice into the chile verde and serve with the beans and tortillas.",
    ], swaps=[
        swap("Chicken thighs", "CHICKEN", "pork tenderloin", "chicken thighs, cubed", "Simmer until the chicken is 165°F."),
    ]),
    recipe("W93", "Pavochón turkey cutlets with sweet potatoes (Puerto Rican)", "DINNER", ["Caribbean"], 4, "6 oz turkey with vegetables", "TURKEY", [
        ing("1 1/2", "lb", "turkey breast cutlets", P), ing(6, None, "garlic cloves", V), ing(2, "tsp", "oregano", T),
        ing(1, "tsp", "adobo", T), ing(1, "packet", "sazón", T), ing(1, "tbsp", "white vinegar", T),
        ing(2, "tbsp", "olive oil", T), ing("1 1/2", "lb", "sweet potatoes", C, "cubed"), ing(1, "lb", "green beans", V, "trimmed"),
        ing(1, None, "lime", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Mash the garlic with the oregano, adobo, sazón, pepper, vinegar and 1 tbsp of the oil into a paste. Rub it all over the turkey and marinate for 30 minutes (or overnight).",
        "Heat the oven to 425°F. Toss the sweet potatoes with the rest of the oil and salt on a sheet pan and roast for 15 minutes.",
        "Add the green beans and turkey to the pan (use a second pan if it's crowded). Roast for 12 to 15 minutes until the turkey is 165°F inside.",
        "Rest the turkey for 5 minutes, then slice. Serve with the vegetables and lime wedges.",
    ]),
    recipe("W94", "Ital stew (Jamaican coconut, bean and vegetable stew)", "DINNER", ["Caribbean"], 4, "2 cups with 1/2 cup rice", "VEGETARIAN", [
        ing(2, "cans", "kidney beans", C, "drained and rinsed"), ing(1, "lb", "butternut squash", V, "peeled and cubed"),
        ing(1, None, "sweet potato", C, "peeled and cubed"), ing(2, None, "carrots", V), ing(1, None, "onion", V),
        ing(1, None, "bell pepper", V), ing(4, None, "garlic cloves", V), ing(1, "tbsp", "ginger", V, "grated"),
        ing(3, None, "scallions", V), ing(1, "tsp", "thyme", T, "dried"), ing(1, "tsp", "allspice", T),
        ing(1, None, "habanero", V, "whole, or Scotch bonnet; leave out for no heat"), ing(1, "can", "light coconut milk", T),
        ing(2, "cups", "low-sodium broth", T, "vegetable"), ing(1, "bag", "spinach", V, "stands in for callaloo"),
        ing(1, "tbsp", "olive oil", T), ing(2, "cups", "cooked brown rice", C), ing(1, None, "lime", V), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, bell pepper and carrots in the oil in a large pot for 5 minutes. Add the garlic, ginger, sliced scallions, thyme and allspice for 1 minute.",
        "Add the squash, sweet potato, coconut milk, broth and the whole habanero. Simmer, covered, for 15 minutes.",
        "Add the beans and simmer, uncovered, for 10 minutes more until the vegetables are soft and the stew has thickened.",
        "Take out the habanero. Stir in the spinach until wilted and season with salt and lime juice.",
        "Serve over the rice.",
    ]),

    # ---------- Soups ----------
    recipe("W95", "Soup joumou (Haitian squash and beef soup)", "SOUP", ["Caribbean"], 6, "2 cups", "BEEF", [
        ing("1 1/2", "lb", "lean beef stew meat", P, "in small cubes"), ing(2, "lb", "butternut squash", V, "peeled and cubed"),
        ing("1/2", "head", "cabbage", V, "chopped"), ing(3, None, "carrots", V), ing(2, None, "celery stalks", V),
        ing(1, None, "onion", V), ing(1, "lb", "potatoes", C, "diced"), ing(4, "oz", "whole-wheat penne", C),
        ing(6, None, "garlic cloves", V), ing(4, None, "scallions", V), ing(1, "handful of", "parsley", V),
        ing(1, "tsp", "thyme", T, "dried"), ing(2, None, "limes", V), ing(6, "cups", "low-sodium beef broth", T),
        ing(1, "tbsp", "tomato paste", T), ing(1, "tbsp", "olive oil", T), ing(None, "pinch of", "cloves", T, "ground"),
        ing(1, None, "habanero", V, "whole, or Scotch bonnet; leave out for no heat"), ing(None, None, "salt", T),
        ing(None, None, "black pepper", T),
    ], [
        "Blend the garlic, scallions, parsley, thyme, the juice of 1 lime and 1/2 tsp salt into a rough paste. Rub half of it into the beef and let it sit for 20 minutes (or overnight).",
        "Brown the beef in the oil in a large pot for 5 minutes. Add the tomato paste, broth, 2 cups of water and the squash. Simmer, covered, for 30 minutes until the squash is very soft.",
        "Lift the squash out with a slotted spoon, blend it with a cup of the broth until smooth and pour it back into the pot.",
        "Add the diced onion, carrots, celery and potatoes, the rest of the herb paste, the cloves and the whole habanero. Simmer for 30 minutes.",
        "Add the cabbage and pasta and simmer for 12 to 15 minutes, until the pasta is soft and the beef is fork-tender (well past the safe 145°F).",
        "Take out the habanero and season with salt, pepper and the second lime. Keeps for 4 days in the fridge and freezes well.",
    ], prep=True),
    recipe("W96", "Sopa de frijoles negros (Cuban black bean soup)", "SOUP", ["Caribbean"], 4, "1 1/2 cups over 1/2 cup rice", "VEGETARIAN", [
        ing(3, "cans", "black beans", C, "drained and rinsed"), ing(1, None, "onion", V), ing(1, None, "bell pepper", V, "green"),
        ing(4, None, "garlic cloves", V), ing(2, "tsp", "cumin", T), ing(1, "tsp", "oregano", T), ing(2, None, "bay leaves", T),
        ing(3, "cups", "low-sodium broth", T, "vegetable"), ing(1, "tbsp", "olive oil", T), ing(1, "tbsp", "white vinegar", T),
        ing(1, "tsp", "sugar", T), ing(2, "cups", "cooked rice", C), ing(1, None, "avocado", V),
        ing(4, "tbsp", "light sour cream", T), ing("1/4", None, "red onion", V, "finely chopped"),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Cook the diced onion and bell pepper in the oil in a large pot for 7 minutes until soft. Add the garlic, cumin and oregano for 1 minute.",
        "Add the beans, broth and bay leaves. Simmer for 20 minutes.",
        "Take out the bay leaves. Mash some of the beans in the pot, or blend about a third of the soup and stir it back in.",
        "Stir in the vinegar and sugar and salt to taste.",
        "Serve over a scoop of rice, topped with sour cream, diced avocado, red onion and cilantro. Keeps for 4 days in the fridge and freezes well.",
    ], prep=True),
    recipe("W97", "New England fish chowder (lighter, with cod and corn)", "SOUP", ["American"], 4, "2 cups with toast", "FISH", [
        ing("1 1/4", "lb", "cod fillets", P, "in large chunks"), ing(1, "lb", "potatoes", C, "diced"), ing(1, None, "onion", V),
        ing(2, None, "celery stalks", V), ing(1, "cup", "frozen corn", V), ing(1, "tbsp", "butter", T),
        ing(2, "tbsp", "flour", T), ing(2, "cups", "milk", T), ing(2, "cups", "low-sodium broth", T, "vegetable"),
        ing(1, "tsp", "thyme", T, "dried"), ing(1, None, "bay leaves", T), ing(4, "slices", "whole-grain bread", C),
        ing(None, None, "chives", V), ing(None, None, "salt", T), ing(None, None, "black pepper", T),
    ], [
        "Melt the butter in a large pot and cook the diced onion and celery for 6 minutes until soft. Stir in the flour for 1 minute.",
        "Slowly stir in the broth, then add the potatoes, thyme and bay leaf. Simmer for 12 to 15 minutes until the potatoes are tender.",
        "Add the milk and corn and bring back to a gentle simmer. Do not let it boil hard.",
        "Add the cod, cover and cook gently for 5 to 6 minutes until the fish is opaque and flakes easily (145°F).",
        "Take out the bay leaf, season with salt and pepper and stir gently so the fish stays in big flakes.",
        "Top with chives and serve with toast.",
    ]),
    recipe("W98", "Soupe aux pois (Québécois split pea soup with ham)", "SOUP", ["American"], 6, "1 1/2 cups with toast", "PORK", [
        ing(2, "cups", "split peas", C, "yellow or green, rinsed"), ing(8, "oz", "lean ham", P, "fully cooked, diced"),
        ing(1, None, "onion", V), ing(2, None, "carrots", V), ing(2, None, "celery stalks", V), ing(2, None, "garlic cloves", V),
        ing(1, "tsp", "thyme", T, "dried"), ing(2, None, "bay leaves", T), ing(6, "cups", "low-sodium broth", T),
        ing(1, "tbsp", "olive oil", T), ing(6, "slices", "whole-grain bread", C), ing(None, None, "black pepper", T),
        ing(None, None, "salt", T),
    ], [
        "Cook the diced onion, carrots and celery in the oil in a large pot for 6 minutes. Add the garlic and thyme for 1 minute.",
        "Add the split peas, ham, bay leaves, broth and 2 cups of water. Bring to a boil.",
        "Simmer, partly covered, for 60 to 75 minutes, stirring now and then, until the peas have broken down and the soup is thick. Add a splash of water if it gets too thick.",
        "Take out the bay leaves and season with pepper. Taste before adding salt, as the ham is salty.",
        "Serve steaming hot (at least 165°F) with toast. Keeps for 5 days in the fridge and freezes well.",
    ], prep=True),

    # ---------- Snacks ----------
    recipe("W99", "Esquites (Mexican street corn cup)", "SNACK", ["Snack"], 2, "1 cup", "VEGETARIAN", [
        ing(2, "cups", "frozen corn", V), ing(2, "tbsp", "light mayo", T), ing("1/4", "cup", "feta", T, "or cotija, crumbled"),
        ing(1, "tsp", "olive oil", T), ing(1, None, "lime", V), ing("1/2", "tsp", "chili powder", T),
        ing(None, None, "cilantro", V), ing(None, None, "salt", T),
    ], [
        "Heat the oil in a skillet over high heat. Add the corn and cook for 6 to 8 minutes, stirring only now and then, until charred in spots.",
        "Off the heat, stir in the mayo, lime juice and a pinch of salt.",
        "Spoon into cups and top with the feta, chili powder and cilantro.",
    ], only="ashley"),
    recipe("W100", "Vitamina de banana (Brazilian banana-oat smoothie)", "SNACK", ["Snack"], 1, "1 tall glass", "VEGETARIAN", [
        ing(1, None, "banana", V, "ripe; frozen makes it thicker"), ing(1, "cup", "milk", T), ing("1/4", "cup", "rolled oats", C),
        ing(None, "pinch of", "cinnamon", T), ing(None, None, "ice", T),
    ], [
        "Blend the banana, milk, oats, cinnamon and a few ice cubes until smooth and frothy.",
        "Pour into a tall glass and drink right away.",
    ], only="ashley"),
]
