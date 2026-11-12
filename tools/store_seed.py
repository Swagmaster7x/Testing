#!/usr/bin/env python3
"""Builds the store edition's seed.json from the personal one.

The store app starts with nobody: each person sets themselves up and picks a starter workout
plan. So this keeps the shared recipe library and tips, drops the personal app's people, their
coffee-shop orders and daily guide, and turns the workout days into starter plans.

    python3 tools/store_seed.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
PERSONAL = ROOT / "app/src/personal/assets/seed.json"
STORE = ROOT / "app/src/store/assets/seed.json"

# Recipes that are someone's usual order at a particular chain: not for a general audience.
DROP_RECIPES = {"SB1", "SB2", "SB3", "SB4", "SB5"}


def exercise(group, name, sets, reps, swaps, note=None):
    e = {"group": group, "name": name, "sets": sets, "reps": reps, "swaps": swaps}
    if note:
        e["note"] = note
    return e


FULL_BODY_3 = [
    {
        "order": 1, "name": "Full body A", "shortName": "Full body A",
        "exercises": [
            exercise("A", "Goblet squat", "3", "8–12", ["Leg press", "Bodyweight squat"]),
            exercise("B", "Chest press machine", "3", "8–12", ["Dumbbell bench", "Push-ups"]),
            exercise("C", "Lat pulldown", "3", "8–12", ["Assisted pull-up machine"]),
            exercise("D", "Dumbbell Romanian deadlift", "3", "10–12", ["Back extension"]),
            exercise("E", "Plank", "3", "20–40 seconds", ["Dead bug"]),
        ],
    },
    {
        "order": 2, "name": "Full body B", "shortName": "Full body B",
        "exercises": [
            exercise("A", "Leg press", "3", "10–15", ["Goblet squat"]),
            exercise("B", "Seated cable row", "3", "10–12", ["Chest-supported row machine"]),
            exercise("C", "Dumbbell shoulder press", "3", "8–12", ["Shoulder press machine"]),
            exercise("D", "Hip thrust", "3", "10–12", ["Dumbbell glute bridge"], "Barbell, machine or a dumbbell on the hips."),
            exercise("E", "Dead bug", "3", "8 each side", ["Plank"]),
        ],
    },
    {
        "order": 3, "name": "Full body C", "shortName": "Full body C",
        "exercises": [
            exercise("A", "Reverse lunge", "3", "8–10 each leg", ["Step-ups", "Leg press"]),
            exercise("B", "Incline dumbbell press", "3", "8–12", ["Incline machine press", "Push-ups"]),
            exercise("C", "Dumbbell row", "3", "10 each arm", ["Cable row"]),
            exercise("D", "Seated leg curl", "3", "10–15", ["Lying leg curl"]),
            exercise("E", "Farmer's carries", "3", "30–40 steps", ["Dead hangs"]),
        ],
    },
]

FULL_BODY_TIPS = [
    "New to lifting? Keep the weights light for the first two weeks while you learn each movement.",
    "Rest about 90 seconds between sets.",
    "Stop each set with one or two good reps left.",
    "When every set reaches the top of the rep range, go up a little next time.",
    "Short on time? Do the first three exercises and call it a day.",
]


def days_for(seed, profile_key):
    days = []
    for d in seed["workoutDays"]:
        if d.get("profile", "swag") != profile_key:
            continue
        day = {k: v for k, v in d.items() if k not in ("profile", "since")}
        days.append(day)
    return days


def main():
    seed = json.loads(PERSONAL.read_text())
    templates = {t["key"]: t for t in seed["workoutTemplates"]}

    recipes = []
    for r in seed["recipes"]:
        if r["key"] in DROP_RECIPES:
            continue
        r = {k: v for k, v in r.items() if k not in ("onlyFor", "since")}
        recipes.append(r)

    upper_lower = days_for(seed, "swag")
    glute = days_for(seed, "ashley")
    glute_tips = [
        "Shorter? Use a low bench or step for hip thrusts, and slide machine seats forward." if t.startswith("Setup for a shorter frame") else t
        for t in templates["glute-3"]["tips"]
    ]

    store = {
        "version": 1,
        "recipes": recipes,
        "freeVolumeFoods": seed["freeVolumeFoods"],
        "pantryStaples": seed["pantryStaples"] + [s for s in seed.get("extraPantryStaples", []) if s not in seed["pantryStaples"]],
        "workoutDays": [],
        "gymTips": seed["gymTips"],
        "easierToFinishTips": seed["easierToFinishTips"],
        "profiles": [],
        "workoutTemplates": [
            {
                "key": "full-body-3",
                "name": "Full body, 3 days",
                "description": "Three short whole-body sessions on machines and dumbbells. A good first plan.",
                "defaultDays": ["MONDAY", "WEDNESDAY", "FRIDAY"],
                "tips": FULL_BODY_TIPS,
                "days": FULL_BODY_3,
            },
            {
                "key": "upper-lower-4",
                "name": "Upper / lower, 4 days",
                "description": "Two upper-body days, a lower-body day and a full-body day, with supersets. For people who already lift.",
                "defaultDays": ["MONDAY", "TUESDAY", "THURSDAY", "FRIDAY"],
                "tips": seed["gymTips"],
                "days": upper_lower,
            },
            {
                "key": "glute-3",
                "name": "Glute focus, 3 days",
                "description": "Two lower-body days built around hip thrusts and split squats, and an upper-body day.",
                "defaultDays": ["MONDAY", "WEDNESDAY", "FRIDAY"],
                "tips": glute_tips,
                "days": glute,
            },
        ],
    }

    text = json.dumps(store, indent=2, ensure_ascii=False) + "\n"
    for word in ("Ashley", "Swag", "Starbucks"):
        assert word not in text, f"{word} is still in the store seed"
    STORE.write_text(text)
    print(f"Wrote {STORE.relative_to(ROOT)}: {len(recipes)} recipes, {len(store['workoutTemplates'])} starter plans")


if __name__ == "__main__":
    main()
