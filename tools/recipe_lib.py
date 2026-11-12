"""Shared pieces for the recipe scripts: ingredient nutrition data and helpers.

A recipe's "approx." nutrition line is worked out from its ingredients with MACROS (typical
values per unit, raw weights), so the numbers come from the food rather than a guess. Every
ingredient must be in MACROS or NEGLIGIBLE.
"""
from fractions import Fraction

P, V, C, T = "PROTEIN", "PRODUCE_FROZEN", "CARBS", "PANTRY"

MEAL_TYPES = {"BREAKFAST", "LUNCH", "DINNER", "SOUP", "SNACK"}
PROTEINS = {"BEEF", "PORK", "CHICKEN", "TURKEY", "FISH", "EGG", "VEGETARIAN"}
SECTIONS = {P, V, C, T}
# Broad cuisine tags: they become the filter chips, so there are only a few. The dish's own
# culture goes in its name.
CUISINES = {
    "American", "Asian", "Caribbean", "Hispanic", "Latin American", "Indian", "Italian", "Mediterranean",
    "Middle Eastern", "African", "European", "Snack", "Copycat",
}

# name -> unit -> (calories, protein g, carbs g, fat g) for ONE of that unit. "" = each.
MACROS = {
    "chicken breast": {"lb": (545, 102, 0, 12)},
    "chicken thighs": {"lb": (600, 88, 0, 26)},
    "93% lean ground turkey": {"lb": (680, 85, 0, 36)},
    "90% lean ground beef": {"lb": (800, 91, 0, 45)},
    "salmon portions": {"": (354, 34, 0, 22)},
    "cod fillets": {"lb": (372, 81, 0, 3)},
    "shrimp": {"lb": (386, 91, 0, 2)},
    "tuna in water": {"can": (120, 26, 0, 1)},
    "smoked salmon": {"oz": (33, 5.2, 0, 1.2)},
    "chicken sausage": {"link": (140, 13, 2, 8)},
    "eggs": {"": (72, 6.3, 0.4, 4.8)},
    "egg": {"": (72, 6.3, 0.4, 4.8)},
    "liquid egg whites": {"cup": (126, 26, 2, 0)},
    "nonfat Greek yogurt": {"cup": (145, 25, 9, 1)},
    "cottage cheese": {"cup": (185, 25, 10, 5)},
    "firm tofu": {"block": (420, 42, 9, 23)},
    "edamame": {"cup": (188, 18, 14, 8)},
    "vanilla whey protein": {"scoop": (120, 24, 3, 1.5)},
    "black beans": {"can": (385, 25, 66, 2)},
    "kidney beans": {"can": (385, 25, 66, 2)},
    "white beans": {"can": (385, 24, 70, 1)},
    "chickpeas": {"can": (420, 21, 70, 7)},
    "red lentils": {"cup": (678, 48, 115, 2)},
    "rice": {"cup": (675, 13, 148, 1)},
    "cooked rice": {"cup": (205, 4, 45, 0.4)},
    "cooked jasmine rice": {"cup": (205, 4, 45, 0.4)},
    "quinoa": {"cup": (626, 24, 109, 10)},
    "rolled oats": {"cup": (307, 11, 55, 5)},
    "whole-wheat spaghetti": {"oz": (99, 4.1, 21, 0.4)},
    "whole-wheat tortillas": {"": (130, 4, 22, 3.5)},
    "corn tortillas": {"": (52, 1.4, 11, 0.7)},
    "whole-grain bread": {"slice": (80, 4, 14, 1)},
    "potatoes": {"lb": (350, 9, 79, 0.4)},
    "sweet potatoes": {"lb": (390, 7, 91, 0.2)},
    "granola": {"cup": (520, 12, 80, 20)},
    "olive oil": {"tbsp": (119, 0, 0, 13.5), "tsp": (40, 0, 0, 4.5)},
    "oil": {"tbsp": (120, 0, 0, 14)},
    "sesame oil": {"tsp": (40, 0, 0, 4.5)},
    "butter": {"tbsp": (102, 0, 0, 11.5)},
    "peanut butter": {"tbsp": (95, 3.5, 3.5, 8)},
    "hummus": {"cup": (410, 19, 35, 24)},
    "feta": {"cup": (400, 20, 6, 32), "tbsp": (25, 1.3, 0.4, 2)},
    "shredded cheese": {"cup": (440, 28, 4, 36)},
    "parmesan": {"cup": (340, 32, 3, 22), "tbsp": (21, 2, 0.2, 1.4)},
    "milk": {"cup": (102, 8, 12, 2.4)},
    "light coconut milk": {"can": (250, 2, 5, 22)},
    "crushed tomatoes": {"can": (210, 10, 45, 0)},
    "diced tomatoes": {"can": (90, 4, 18, 0)},
    "marinara sauce": {"jar": (400, 10, 55, 13)},
    "salsa": {"cup": (70, 3, 15, 0)},
    "olives": {"cup": (160, 1, 8, 15)},
    "honey": {"tbsp": (64, 0, 17, 0), "tsp": (21, 0, 6, 0)},
    "cornstarch": {"tsp": (10, 0, 2.5, 0), "tbsp": (30, 0, 7, 0)},
    "low-sodium soy sauce": {"tbsp": (9, 1.3, 0.8, 0), "cup": (144, 21, 13, 0)},
    "low-sodium chicken broth": {"cup": (15, 2.5, 1, 0.5)},
    "low-sodium beef broth": {"cup": (15, 3, 1, 0)},
    "low-sodium broth": {"cup": (15, 1, 2, 0)},
    "chia seeds": {"tbsp": (58, 2, 5, 3.7)},
    "avocado": {"": (240, 3, 13, 22)},
    "banana": {"": (105, 1.3, 27, 0.4)},
    "apple": {"": (95, 0.5, 25, 0.3)},
    "mixed berries": {"cup": (70, 1, 17, 0.5)},
    "pineapple chunks": {"cup": (82, 1, 22, 0)},
    "onion": {"": (44, 1.2, 10, 0)},
    "red onion": {"": (44, 1.2, 10, 0)},
    "bell pepper": {"": (33, 1, 7, 0)},
    "bell peppers": {"": (33, 1, 7, 0)},
    "carrots": {"": (25, 0.6, 6, 0)},
    "celery stalks": {"": (6, 0.3, 1.2, 0)},
    "zucchini": {"": (33, 2.4, 6, 0.6)},
    "tomatoes": {"": (22, 1, 5, 0.2)},
    "cucumber": {"": (30, 2, 7, 0)},
    "cucumbers": {"": (30, 2, 7, 0)},
    "broccoli": {"head": (136, 11, 27, 1.5)},
    "mushrooms": {"oz": (6.2, 0.9, 0.9, 0.1)},
    "asparagus": {"lb": (90, 10, 18, 0.5)},
    "frozen green beans": {"bag": (105, 6, 24, 0.4)},
    "frozen peas": {"cup": (115, 8, 21, 0.6)},
    "corn": {"cup": (135, 5, 31, 1)},
    "cabbage": {"head": (225, 12, 52, 1)},
    "romaine lettuce": {"head": (54, 4, 10, 1)},
    "butter lettuce": {"head": (20, 2, 4, 0)},
    "baby spinach": {"handful": (7, 1, 1, 0), "bag": (33, 4, 5, 0.5)},
    # ---- Added for the version 4 recipes: a wider cupboard, same typical values per unit (raw weights). ----
    "lean ground pork": {"lb": (960, 86, 0, 66)},
    "pork tenderloin": {"lb": (545, 95, 0, 16)},
    "boneless pork chops": {"lb": (650, 97, 0, 27)},
    "lean beef stew meat": {"lb": (620, 98, 0, 23)},
    "flank steak": {"lb": (700, 96, 0, 32)},
    "sirloin steak": {"lb": (680, 95, 0, 30)},
    "ground lamb": {"lb": (1280, 75, 0, 106)},
    "lamb leg": {"lb": (640, 92, 0, 28)},
    "ground chicken": {"lb": (650, 79, 0, 37)},
    "turkey breast cutlets": {"lb": (500, 108, 0, 5)},
    "tilapia fillets": {"lb": (435, 91, 0, 8)},
    "white fish fillets": {"lb": (400, 84, 0, 5)},
    "canned salmon": {"can": (230, 33, 0, 10)},
    "sardines": {"can": (190, 22, 0, 11)},
    "tempeh": {"block": (435, 46, 20, 24)},
    "paneer": {"oz": (90, 6, 1, 7)},
    "halloumi": {"oz": (90, 6, 1, 7)},
    "part-skim mozzarella": {"cup": (320, 28, 4, 20)},
    "low-fat ricotta": {"cup": (340, 28, 13, 20)},
    "plain kefir": {"cup": (110, 9, 12, 2.5)},
    "brown lentils": {"cup": (678, 48, 115, 2)},
    "green lentils": {"cup": (678, 48, 115, 2)},
    "pinto beans": {"can": (385, 23, 68, 2)},
    "cannellini beans": {"can": (385, 24, 70, 1)},
    "pigeon peas": {"can": (360, 21, 66, 2)},
    "black-eyed peas": {"can": (360, 24, 62, 3)},
    "lima beans": {"can": (330, 20, 60, 1)},
    "brown rice": {"cup": (685, 14, 143, 5)},
    "cooked brown rice": {"cup": (215, 5, 45, 1.8)},
    "basmati rice": {"cup": (675, 13, 148, 1)},
    "couscous": {"cup": (650, 22, 134, 1)},
    "whole-wheat couscous": {"cup": (630, 24, 130, 2)},
    "bulgur": {"cup": (480, 17, 106, 2)},
    "farro": {"cup": (600, 24, 120, 3)},
    "pearl barley": {"cup": (700, 20, 155, 2)},
    "cornmeal": {"cup": (440, 10, 94, 4)},
    "whole-wheat flour": {"cup": (410, 16, 86, 3), "tbsp": (26, 1, 5.4, 0.2)},
    "flour": {"cup": (455, 13, 95, 1), "tbsp": (28, 0.8, 6, 0.1)},
    "whole-wheat pasta": {"oz": (99, 4.1, 21, 0.4)},
    "whole-wheat penne": {"oz": (99, 4.1, 21, 0.4)},
    "orzo": {"cup": (600, 21, 121, 3)},
    "rice noodles": {"oz": (103, 1.7, 23, 0.2)},
    "soba noodles": {"oz": (95, 4, 21, 0.2)},
    "udon noodles": {"oz": (100, 3, 21, 0.3)},
    "egg noodles": {"oz": (108, 4, 20, 1.2)},
    "whole-wheat pita": {"": (170, 6, 35, 1.7)},
    "naan": {"": (260, 9, 45, 5)},
    "whole-wheat buns": {"": (140, 6, 24, 2.5)},
    "whole-wheat English muffins": {"": (130, 6, 26, 1.5)},
    "whole-wheat sub rolls": {"": (200, 8, 38, 3)},
    "baguette": {"slice": (70, 3, 14, 0.4)},
    "panko": {"cup": (220, 8, 44, 2)},
    "plantains": {"": (220, 2.3, 57, 0.7)},
    "yuca": {"lb": (725, 6, 173, 1.3)},
    "butternut squash": {"lb": (205, 4.5, 53, 0.5)},
    "pumpkin puree": {"can": (140, 4, 32, 1)},
    "coconut milk": {"can": (720, 7, 11, 76)},
    "tahini": {"tbsp": (89, 2.6, 3.2, 8)},
    "natural almond butter": {"tbsp": (98, 3.4, 3, 9)},
    "peanuts": {"cup": (830, 38, 24, 72), "tbsp": (52, 2.4, 1.5, 4.5)},
    "almonds": {"cup": (830, 30, 31, 71), "tbsp": (52, 1.9, 1.9, 4.5)},
    "walnuts": {"cup": (765, 18, 16, 76), "tbsp": (48, 1.1, 1, 4.8)},
    "cashews": {"cup": (750, 24, 40, 60), "tbsp": (47, 1.5, 2.5, 3.8)},
    "pine nuts": {"tbsp": (57, 1.2, 1.1, 5.8)},
    "pumpkin seeds": {"tbsp": (47, 2.5, 1, 4)},
    "raisins": {"cup": (435, 5, 115, 0.7), "tbsp": (27, 0.3, 7, 0)},
    "dates": {"": (66, 0.4, 18, 0)},
    "dried apricots": {"cup": (310, 4.4, 81, 0.7)},
    "brown sugar": {"tbsp": (52, 0, 13.5, 0), "tsp": (17, 0, 4.5, 0)},
    "sugar": {"tbsp": (48, 0, 12.6, 0), "tsp": (16, 0, 4.2, 0)},
    "maple syrup": {"tbsp": (52, 0, 13.4, 0)},
    "ketchup": {"tbsp": (17, 0.2, 4.5, 0)},
    "light mayo": {"tbsp": (35, 0, 1, 3.5)},
    "tomato paste": {"tbsp": (13, 0.7, 3, 0.1)},
    "tomato sauce": {"can": (70, 3, 14, 0.5), "cup": (60, 3, 13, 0.5)},
    "enchilada sauce": {"can": (90, 2, 16, 2.5)},
    "salsa verde": {"cup": (80, 2, 16, 1)},
    "pico de gallo": {"cup": (50, 2, 11, 0.5)},
    "red curry paste": {"tbsp": (20, 0.5, 3, 0.7)},
    "green curry paste": {"tbsp": (20, 0.5, 3, 0.7)},
    "miso paste": {"tbsp": (34, 2.2, 4.3, 1)},
    "gochujang": {"tbsp": (40, 1, 9, 0.5)},
    "oyster sauce": {"tbsp": (9, 0.2, 2, 0)},
    "hoisin sauce": {"tbsp": (35, 0.5, 7, 0.5)},
    "fish sauce": {"tbsp": (6, 0.9, 0.7, 0)},
    "harissa": {"tbsp": (15, 0.5, 2, 0.7)},
    "pesto": {"tbsp": (80, 1.5, 1, 8)},
    "sun-dried tomatoes": {"cup": (140, 8, 30, 1.6), "tbsp": (9, 0.5, 1.9, 0.1)},
    "roasted red peppers": {"cup": (50, 1.5, 11, 0.5)},
    "artichoke hearts": {"can": (90, 6, 18, 0.5)},
    "eggplant": {"": (130, 5, 31, 1)},
    "cauliflower": {"head": (145, 11, 29, 1.6)},
    "kale": {"bunch": (110, 9, 20, 2), "cup": (8, 0.7, 1.4, 0.2)},
    "collard greens": {"bunch": (110, 10, 19, 2)},
    "bok choy": {"head": (55, 6, 9, 1)},
    "baby bok choy": {"head": (15, 1.5, 2.5, 0.2)},
    "napa cabbage": {"head": (130, 10, 26, 1.6)},
    "snap peas": {"cup": (26, 1.8, 5, 0.1)},
    "snow peas": {"cup": (26, 1.8, 5, 0.1)},
    "green beans": {"lb": (140, 8, 32, 0.5)},
    "okra": {"lb": (150, 9, 34, 0.9)},
    "bean sprouts": {"cup": (31, 3, 6, 0.2)},
    "spinach": {"bag": (65, 8, 10, 1), "cup": (7, 0.9, 1.1, 0.1)},
    "arugula": {"cup": (5, 0.5, 0.7, 0.1)},
    "mixed greens": {"cup": (9, 0.7, 1.7, 0.1)},
    "cherry tomatoes": {"cup": (27, 1.3, 6, 0.3)},
    "sweet potato": {"": (115, 2, 27, 0.1)},
    "potato": {"": (165, 4.5, 37, 0.2)},
    "leek": {"": (55, 1.3, 13, 0.3)},
    "fennel bulb": {"": (73, 3, 17, 0.5)},
    "beets": {"": (35, 1.3, 8, 0.1)},
    "frozen corn": {"cup": (135, 5, 31, 1)},
    "corn on the cob": {"ear": (90, 3, 19, 1.4)},
    "frozen spinach": {"bag": (80, 10, 12, 1.5)},
    "frozen mixed vegetables": {"bag": (220, 10, 44, 1.5), "cup": (60, 3, 12, 0.4)},
    "frozen stir-fry vegetables": {"bag": (140, 7, 28, 0.7)},
    "frozen cauliflower rice": {"bag": (85, 7, 17, 1)},
    "mango": {"": (200, 2.8, 50, 1.3)},
    "pineapple": {"cup": (82, 1, 22, 0)},
    "orange": {"": (62, 1.2, 15, 0.2)},
    "oranges": {"": (62, 1.2, 15, 0.2)},
    "orange juice": {"cup": (112, 1.7, 26, 0.5)},
    "pomegranate seeds": {"cup": (145, 3, 33, 2)},
    "strawberries": {"cup": (49, 1, 12, 0.5)},
    "blueberries": {"cup": (84, 1.1, 21, 0.5)},
    "peach": {"": (59, 1.4, 14, 0.4)},
    "pear": {"": (100, 0.6, 27, 0.2)},
    "grapes": {"cup": (104, 1.1, 27, 0.2)},
    "unsweetened almond milk": {"cup": (35, 1.3, 1.5, 2.8)},
    "cocoa powder": {"tbsp": (12, 1, 3, 0.7)},
    "unsweetened shredded coconut": {"tbsp": (33, 0.3, 1.2, 3.2)},
    "chia seeds": {"tbsp": (58, 2, 5, 3.7)},
    "ground flaxseed": {"tbsp": (37, 1.3, 2, 3)},
    "cheddar": {"cup": (455, 28, 2, 37), "oz": (113, 7, 0.4, 9.3)},
    "Swiss cheese": {"slice": (106, 7.5, 1.5, 7.8)},
    "goat cheese": {"oz": (75, 5.3, 0, 6)},
    "cream cheese": {"tbsp": (50, 1, 0.8, 5)},
    "light sour cream": {"tbsp": (20, 0.5, 1, 1.5)},
    "plain yogurt": {"cup": (150, 13, 17, 4)},
    "Canadian bacon": {"slice": (30, 5, 0.3, 1)},
    "turkey bacon": {"slice": (30, 2.5, 0.2, 2.2)},
    "deli turkey": {"oz": (30, 5, 1, 0.5)},
    "lean ham": {"oz": (30, 5, 0.5, 1)},
    "rotisserie chicken": {"cup": (230, 38, 0, 8)},
    "smoked sausage": {"link": (180, 8, 2, 16)},
    "andouille chicken sausage": {"link": (140, 13, 2, 8)},
    "canned chipotle chicken": {"can": (120, 26, 0, 1)},
    "avocados": {"": (240, 3, 13, 22)},
    "bananas": {"": (105, 1.3, 27, 0.4)},
    "apples": {"": (95, 0.5, 25, 0.3)},
    "shallot": {"": (20, 0.7, 5, 0)},
    "shallots": {"": (20, 0.7, 5, 0)},
    "onions": {"": (44, 1.2, 10, 0)},
    "red onions": {"": (44, 1.2, 10, 0)},
    "tomato": {"": (22, 1, 5, 0.2)},
    "carrot": {"": (25, 0.6, 6, 0)},
    "egg whites": {"": (17, 3.6, 0.2, 0)},
    "mushroom": {"": (4, 0.6, 0.6, 0.1)},
    "mixed berries": {"cup": (70, 1, 17, 0.5)},
    "frozen mango": {"cup": (100, 1.4, 25, 0.6)},
    "frozen broccoli": {"bag": (100, 9, 17, 1)},
    "pickles": {"": (5, 0.2, 1, 0)},
    "kimchi": {"cup": (23, 1.7, 3.6, 0.8)},
    "seaweed snack": {"pack": (25, 1, 1, 2)},
    "dark chocolate chips": {"tbsp": (70, 1, 9, 4)},
}

# Too little to change a serving's numbers: herbs, spices, citrus, aromatics, condiments by the dash.
NEGLIGIBLE = {
    "salt", "black pepper", "cumin", "chili powder", "paprika", "garlic powder", "oregano", "Italian seasoning",
    "curry powder", "turmeric", "cinnamon", "baking powder", "garlic cloves", "ginger", "lemon", "lime", "limes",
    "cilantro", "basil", "scallions", "jalapeño", "hot sauce", "mustard", "rice vinegar", "sesame seeds", "capers",
    # Added for version 4.
    "smoked paprika", "cayenne", "red pepper flakes", "coriander", "garam masala", "cardamom", "cloves", "nutmeg",
    "allspice", "thyme", "rosemary", "parsley", "dill", "mint", "bay leaves", "sage", "chives", "tarragon",
    "za'atar", "sumac", "five-spice powder", "white pepper", "onion powder", "adobo", "sazón", "jerk seasoning",
    "Cajun seasoning", "taco seasoning", "fajita seasoning", "berbere", "ras el hanout", "herbes de Provence",
    "vanilla extract", "baking soda", "lemons", "lemon juice", "lime juice", "garlic", "lemongrass paste",
    "Thai chilies", "serrano", "chipotles in adobo", "sriracha", "soy sauce", "Dijon mustard", "white vinegar",
    "apple cider vinegar", "red wine vinegar", "balsamic vinegar", "Worcestershire sauce", "cooking spray",
    "nutritional yeast", "saffron", "curry leaves", "mustard seeds", "fennel seeds", "caraway seeds", "star anise",
    "cinnamon stick", "water", "ice", "nori", "pickled ginger", "sofrito", "achiote paste", "gochugaru",
    "dill pickle juice",
}

_SIZE_WORDS = {"large", "big", "small", "medium"}
_KEEP_S = {"oz", "tbsp", "tsp", "lb", "g", "kg", "ml"}


def qty(text):
    """"1 1/2" -> 1.5. None for no quantity."""
    if text is None:
        return None
    return float(sum(Fraction(part) for part in str(text).split()))


def unit_key(unit):
    """"big handfuls of" -> "handful"; "" for each."""
    if not unit:
        return ""
    u = unit.lower().strip().removesuffix(" of").strip()
    u = " ".join(w for w in u.split() if w not in _SIZE_WORDS)
    if u in _KEEP_S:
        return u
    if u.endswith("ches") or u.endswith("shes"):
        return u[:-2]
    if len(u) > 3 and u.endswith("s") and not u.endswith("ss"):
        return u[:-1]
    return u


def macros_for(name, extra=None):
    return (extra or {}).get(name) or MACROS.get(name)


def totals(recipe, extra_macros=None, extra_negligible=frozenset()):
    """(calories, protein, carbs, fat) per serving."""
    total = [0.0, 0.0, 0.0, 0.0]
    for i in recipe["ingredients"]:
        name = i["name"]
        if name in NEGLIGIBLE or name in extra_negligible:
            continue
        table = macros_for(name, extra_macros)
        assert table is not None, f"{recipe['key']}: no nutrition data for '{name}'"
        q = qty(i.get("quantity"))
        assert q is not None, f"{recipe['key']}: '{name}' needs a quantity"
        per = table.get(unit_key(i.get("unit")))
        assert per is not None, f"{recipe['key']}: '{name}' has no data per '{i.get('unit') or 'each'}' (has: {sorted(table)})"
        for k in range(4):
            total[k] += per[k] * q
    return tuple(t / recipe["servings"] for t in total)


def nutrition(recipe, extra_macros=None, extra_negligible=frozenset()):
    cal, protein, carbs, fat = totals(recipe, extra_macros, extra_negligible)
    return f"~{round(cal / 10) * 10} cal, {round(protein)} g protein, {round(carbs)} g carbs, {round(fat)} g fat"


def ing(quantity, unit, name, section, note=None):
    d = {}
    if quantity is not None:
        d["quantity"] = str(quantity)
    if unit:
        d["unit"] = unit
    d["name"] = name
    if note:
        d["note"] = note
    d["section"] = section
    return d


def recipe(key, name, meal, cuisines, servings, size, protein, ingredients, steps, prep=False, tip=None, swaps=None, only=None):
    r = {"key": key, "name": name, "mealType": meal, "cuisineTags": cuisines, "servings": servings, "servingSize": size}
    r["ingredients"] = ingredients
    r["nutrition"] = None
    if prep:
        r["mealPrep"] = True
    r["steps"] = steps
    if tip:
        r["volumeTip"] = tip
    r["protein"] = protein
    if swaps:
        r["swaps"] = swaps
    if only:
        r["onlyFor"] = only
    return r


def swap(label, protein, replace, with_, note, quantity=None, unit=None):
    """quantity and unit: how much of the stand-in, when the original amount doesn't carry over."""
    s = {"label": label, "protein": protein, "replace": replace, "with": with_, "note": note}
    if quantity is not None:
        s["quantity"] = quantity
        if unit:
            s["unit"] = unit
    return s
