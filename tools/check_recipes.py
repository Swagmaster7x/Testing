#!/usr/bin/env python3
"""Checks one or more recipe files before they go into the seed.

    python3 tools/check_recipes.py tools/recipes_v4_a.py [more files...]

Each file defines RECIPES (built with recipe_lib's recipe(), ing() and swap()), and may define
NEW_MACROS (same shape as recipe_lib.MACROS), NEW_NEGLIGIBLE (a set of names) and NO_COOK (keys
of recipes with nothing raw to cook, such as a tuna salad). Prints every problem and exits
non-zero if there are any.
"""
import importlib.util
import json
import pathlib
import re
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import recipe_lib as L  # noqa: E402

ROOT = pathlib.Path(__file__).resolve().parent.parent
SEED = ROOT / "app/src/personal/assets/seed.json"

UNITS = {
    "", "cup", "tbsp", "tsp", "lb", "oz", "can", "head", "handful", "slice", "link", "block", "bag", "scoop", "jar",
    "bunch", "piece", "pinch", "packet", "stalk", "sprig", "ear", "pack",
}
ALCOHOL = re.compile(
    r"\b(wine|beer|rum|vodka|whiskey|bourbon|sake|mirin|brandy|sherry|tequila)\b(?! vinegar)", re.I
)
RAW_MEAT = {"CHICKEN", "TURKEY", "BEEF", "PORK"}
# (lowest, highest) calories per serving, and the least protein in grams.
BOUNDS = {
    "BREAKFAST": (250, 650, 15),
    "LUNCH": (300, 700, 18),
    "DINNER": (300, 700, 18),
    "SOUP": (250, 650, 15),
    "SNACK": (80, 320, 4),
}
VEGETARIAN_PROTEIN_FLOOR = 12


def load(path):
    spec = importlib.util.spec_from_file_location(pathlib.Path(path).stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def check(paths, seed_recipes):
    problems = []
    seen_keys = {r["key"]: "the seed" for r in seed_recipes}
    seen_names = {r["name"].lower(): "the seed" for r in seed_recipes}
    known_ingredients = {i["name"] for r in seed_recipes for i in r.get("ingredients", [])} | set(L.MACROS) | L.NEGLIGIBLE
    new_names = {}
    total = 0
    for path in paths:
        m = load(path)
        extra = getattr(m, "NEW_MACROS", {})
        negligible = set(getattr(m, "NEW_NEGLIGIBLE", set()))
        no_cook = set(getattr(m, "NO_COOK", set()))
        for name in extra:
            if name in L.MACROS:
                problems.append(f"{path}: NEW_MACROS repeats '{name}', which recipe_lib already has")
            for unit, values in extra[name].items():
                if unit not in UNITS or len(values) != 4:
                    problems.append(f"{path}: NEW_MACROS['{name}'] needs units from {sorted(UNITS)} and 4 numbers each")
        for r in m.RECIPES:
            total += 1
            k = r.get("key", "?")

            def bad(msg):
                problems.append(f"{pathlib.Path(path).name} {k} ({r.get('name', '?')}): {msg}")

            if k in seen_keys:
                bad(f"key already used in {seen_keys[k]}")
            seen_keys[k] = path
            lname = r["name"].lower()
            if lname in seen_names:
                bad(f"name already used in {seen_names[lname]}")
            seen_names[lname] = path
            if len(r["name"]) > 60:
                bad("name is over 60 characters")
            if r["mealType"] not in L.MEAL_TYPES:
                bad(f"mealType {r['mealType']}")
            if r["protein"] not in L.PROTEINS:
                bad(f"protein {r['protein']}")
            tags = r["cuisineTags"]
            if not tags or any(t not in L.CUISINES for t in tags) or len([t for t in tags if t != "Copycat"]) != 1:
                bad(f"cuisineTags {tags}: exactly one of {sorted(L.CUISINES - {'Copycat'})} (plus 'Copycat' if it is one)")
            if not 1 <= r["servings"] <= 8:
                bad("servings must be 1 to 8")
            if not r["servingSize"].strip():
                bad("servingSize is blank")
            snack = r["mealType"] == "SNACK"
            ings = r["ingredients"]
            if len(ings) < (1 if snack else 4):
                bad("too few ingredients")
            names = [i["name"] for i in ings]
            if len(set(names)) != len(names):
                bad(f"ingredient listed twice: {sorted(n for n in set(names) if names.count(n) > 1)}")
            for i in ings:
                n = i["name"]
                if i["section"] not in L.SECTIONS:
                    bad(f"'{n}' has section {i['section']}")
                if " or " in n.lower() or " and " in n.lower():
                    bad(f"'{n}': name one food per line (no 'or' / 'and'); put alternatives in the note")
                if len(n) > 40 or n != n.strip() or "," in n:
                    bad(f"'{n}': keep names short and plain; preparation goes in the note")
                if ALCOHOL.search(n):
                    bad(f"'{n}': no alcohol")
                if L.unit_key(i.get("unit")) not in UNITS:
                    bad(f"'{n}' has unit '{i.get('unit')}'; use one of {sorted(UNITS)}")
                if n not in known_ingredients and n not in extra and n not in negligible:
                    bad(f"'{n}' is new: add it to NEW_MACROS or NEW_NEGLIGIBLE, or use an existing name")
                if n not in known_ingredients:
                    new_names.setdefault(n, k)
                try:
                    L.qty(i.get("quantity"))
                except Exception:
                    bad(f"'{n}' has quantity '{i.get('quantity')}'; write 2, 1/2 or 1 1/2")
            steps = r["steps"]
            if not (1 if snack else 3) <= len(steps) <= 7:
                bad(f"{len(steps)} steps; write 3 to 7")
            for s in steps:
                if len(s) > 230 or not s.rstrip().endswith((".", "!", ")")):
                    bad(f"step too long or missing its full stop: '{s[:50]}...'")
                if ALCOHOL.search(s):
                    bad("no alcohol in the steps")
            text = " ".join(steps)
            if not snack and k not in no_cook:
                if r["protein"] in RAW_MEAT and "°F" not in text:
                    bad("say the safe internal temperature (°F) in a step, or list the key in NO_COOK if nothing raw is cooked")
                if r["protein"] == "FISH" and not ("°F" in text or "opaque" in text or "flakes" in text):
                    bad("say when the fish is done (145°F, opaque, or flakes easily), or list the key in NO_COOK")
            for sw in r.get("swaps", []):
                if sw["protein"] == r["protein"]:
                    bad(f"swap '{sw['label']}' keeps the same protein")
                if sw["protein"] not in L.PROTEINS:
                    bad(f"swap '{sw['label']}' has protein {sw['protein']}")
                if sw.get("replace") not in names:
                    bad(f"swap '{sw['label']}' replaces '{sw.get('replace')}', which isn't an ingredient")
                # The app shows the stand-in after an amount, so the text can't carry one of its own.
                if re.search(r"\d", sw.get("with", "")) and not sw["with"][0].isdigit():
                    bad(f"swap '{sw['label']}': put the amount in quantity and unit, not in '{sw['with']}'")
            try:
                cal, protein, _, _ = L.totals(r, extra, negligible)
            except AssertionError as e:
                bad(str(e).split(": ", 1)[-1])
                continue
            low, high, least = BOUNDS.get(r["mealType"], (0, 9999, 0))
            if r["protein"] in ("VEGETARIAN", "EGG") and not snack:
                least = VEGETARIAN_PROTEIN_FLOOR
            if not low <= cal <= high:
                bad(f"{round(cal)} calories a serving; aim for {low} to {high}")
            if protein < least:
                bad(f"{round(protein)} g protein a serving; aim for at least {least}")
    return problems, total, new_names


def main():
    paths = sys.argv[1:]
    if not paths:
        sys.exit(__doc__)
    problems, total, new_names = check(paths, json.loads(SEED.read_text())["recipes"])
    for p in problems:
        print("PROBLEM", p)
    if new_names:
        print(f"{len(new_names)} ingredient names new to the library: " + ", ".join(sorted(new_names)))
    print(f"{total} recipes checked, {len(problems)} problems")
    sys.exit(1 if problems else 0)


if __name__ == "__main__":
    main()
