#!/usr/bin/env python3
"""Version 4 of the recipe library: about 100 dishes from around the world, and home versions
of restaurant favorites.

    python3 tools/recipes_v4.py        # then: python3 tools/store_seed.py

The recipes are in four files: recipes_v4_a.py (Asia), recipes_v4_b.py (Europe, the Middle East
and Africa), recipes_v4_c.py (the Americas) and recipes_v4_copycat.py. This checks them all,
works out each one's nutrition line and writes them into the personal seed. Running it again
changes nothing.
"""
import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import check_recipes  # noqa: E402
from recipe_lib import nutrition  # noqa: E402

HERE = pathlib.Path(__file__).resolve().parent
SEED = HERE.parent / "app/src/personal/assets/seed.json"
PARTS = ["recipes_v4_a.py", "recipes_v4_b.py", "recipes_v4_c.py", "recipes_v4_copycat.py"]
VERSION = 4

# Basics the new recipes lean on that most kitchens keep: treated as "always in the house", so
# they stay off shopping lists unless someone unticks them in Settings. Spices people may need to
# buy for one cuisine (turmeric, garam masala, coriander) are left to show on the list.
NEW_STAPLES = ["oil", "sugar", "thyme", "red pepper flakes", "cayenne", "cooking spray"]


def main():
    seed = json.loads(SEED.read_text())
    paths = [HERE / p for p in PARTS]
    modules = [check_recipes.load(p) for p in paths]

    # One name, one set of numbers: two files can't disagree about a new ingredient.
    macros = {}
    for m in modules:
        for name, value in getattr(m, "NEW_MACROS", {}).items():
            assert macros.setdefault(name, value) == value, f"'{name}' has different nutrition in two files"

    ours = {r["key"] for m in modules for r in m.RECIPES}
    kept = [r for r in seed["recipes"] if r["key"] not in ours]
    problems, total, _ = check_recipes.check(paths, kept)
    if problems:
        for p in problems:
            print("PROBLEM", p)
        sys.exit(f"{len(problems)} problems; nothing written")

    recipes = []
    for m in modules:
        for r in m.RECIPES:
            r["nutrition"] = nutrition(r, getattr(m, "NEW_MACROS", {}), set(getattr(m, "NEW_NEGLIGIBLE", set())))
            r["since"] = VERSION
            recipes.append(r)
    assert total == len(recipes) == len(ours)

    seed["recipes"] = kept + recipes
    seed["version"] = max(seed["version"], VERSION)
    extra = seed.setdefault("extraPantryStaples", [])
    used = {i["name"] for r in recipes for i in r["ingredients"]}
    for s in NEW_STAPLES:
        assert s in used, f"staple '{s}' isn't used by any new recipe"
        if s not in extra and s not in seed["pantryStaples"]:
            extra.append(s)
    SEED.write_text(json.dumps(seed, indent=2, ensure_ascii=False) + "\n")

    by_type = {}
    for r in recipes:
        by_type[r["mealType"]] = by_type.get(r["mealType"], 0) + 1
    print(f"{len(recipes)} recipes written ({by_type}); the library now has {len(seed['recipes'])}")


if __name__ == "__main__":
    main()
