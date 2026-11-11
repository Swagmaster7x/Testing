#!/usr/bin/env python3
"""Build-time helper for the exercise demos (SPEC-V2, "Exercise demos").

Source: free-exercise-db (https://github.com/yuhonas/free-exercise-db), released into the
public domain under the Unlicense. Each exercise has two photos (start and end position) and
written instructions. The app bundles what this script saves, so it stays offline.

  python3 tools/exercise_demos.py match
      Downloads the exercise list, matches every exercise and swap name in both workout plans
      (app/src/main/assets/seed.json) and writes:
        tools/exercise-matches.json     editable: name -> dataset id (or null for no match)
        tools/exercise-match-report.md  the report to review before bundling
      Existing choices in exercise-matches.json marked "checked": true are kept as they are.

  python3 tools/exercise_demos.py bundle
      Downloads the two images for every matched exercise, shrinks them to WebP and writes
      app/src/main/assets/demos/<id>/0.webp, 1.webp and app/src/main/assets/demos/demos.json.
      Needs Pillow (pip install pillow).
"""
from __future__ import annotations

import argparse
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SEED = ROOT / "app/src/main/assets/seed.json"
MATCHES = ROOT / "tools/exercise-matches.json"
REPORT = ROOT / "tools/exercise-match-report.md"
DEMOS = ROOT / "app/src/main/assets/demos"
BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main"

# Names in our plans that the dataset words differently. Values are dataset names.
ALIASES = {
    "barbell bench press": "Barbell Bench Press - Medium Grip",
    "pause bench press": "Barbell Bench Press - Medium Grip",
    "smith machine bench": "Smith Machine Bench Press",
    "chest press machine": "Machine Bench Press",
    "chest press machine, light": "Machine Bench Press",
    "machine chest press": "Machine Bench Press",
    "dumbbell bench": "Dumbbell Bench Press",
    "dumbbell press": "Dumbbell Bench Press",
    "incline machine press": "Smith Machine Incline Bench Press",
    "incline dumbbell press with a pause": "Incline Dumbbell Press",
    "weighted chin-ups": "Chin-Up",
    "lat pulldown, underhand grip": "Underhand Cable Pulldowns",
    "assisted chin-up machine": "Band Assisted Pull-Up",
    "assisted pull-up machine": "Band Assisted Pull-Up",
    "lat pulldown": "Wide-Grip Lat Pulldown",
    "curls": "Barbell Curl",
    "cable curls": "Standing Biceps Cable Curl",
    "machine curls": "Machine Bicep Curl",
    "hanging knee raises": "Knee/Hip Raise On Parallel Bars",
    "captain's chair knee raises": "Knee/Hip Raise On Parallel Bars",
    "captain's chair leg raises": "Knee/Hip Raise On Parallel Bars",
    "hanging leg raises": "Hanging Leg Raise",
    "ab machine": "Ab Crunch Machine",
    "any ab machine": "Ab Crunch Machine",
    "face pulls": "Face Pull",
    "reverse pec-deck": "Reverse Machine Flyes",
    "rear-delt machine": "Reverse Machine Flyes",
    "push-ups": "Pushups",
    "side raises": "Side Lateral Raise",
    "cable lateral raise": "Cable Seated Lateral Raise",
    "machine lateral raise": "Seated Side Lateral Raise",
    "cable or machine lateral raise": "Cable Seated Lateral Raise",
    "calf raises": "Standing Calf Raises",
    "standing calf machine": "Standing Calf Raises",
    "any calf machine": "Standing Calf Raises",
    "seated calf raise": "Seated Calf Raise",
    "leg-press calf raise": "Calf Press On The Leg Press Machine",
    "barbell squat": "Barbell Squat",
    "smith machine squat": "Smith Machine Squat",
    "good mornings": "Good Morning",
    "seated or lying leg curl": "Seated Leg Curl",
    "seated leg curl": "Seated Leg Curl",
    "lying leg curl": "Lying Leg Curls",
    "leg curl machine": "Lying Leg Curls",
    "lunges": "Dumbbell Lunges",
    "walking dumbbell lunges": "Dumbbell Lunges",
    "bulgarian split squats": "Split Squat with Dumbbells",
    "bulgarian split squat": "Split Squat with Dumbbells",
    "leg extension": "Leg Extensions",
    "bodyweight pull-ups": "Pullups",
    "weighted pull-ups": "Pullups",
    "wrist curls": "Seated Palm-Up Barbell Wrist Curl",
    "farmer's carries": "Farmer's Walk",
    "cable crunches": "Cable Crunch",
    "standing overhead press": "Standing Military Press",
    "seated dumbbell shoulder press": "Dumbbell Shoulder Press",
    "dumbbell shoulder press": "Dumbbell Shoulder Press",
    "shoulder press machine": "Machine Shoulder (Military) Press",
    "smith machine press": "Smith Machine Overhead Shoulder Press",
    "band pull-aparts": "Band Pull Apart",
    "preacher curls": "Preacher Curl",
    "machine preacher curl": "Machine Preacher Curls",
    "bent-over side raises": "Seated Bent-Over Rear Delt Raise",
    "cable rear-delt fly": "Cable Rear Delt Fly",
    "rows": "Bent Over Barbell Row",
    "chest-supported row machine": "Leverage Iso Row",
    "cable row": "Seated Cable Rows",
    "seated cable row": "Seated Cable Rows",
    "dumbbell row": "One-Arm Dumbbell Row",
    "reverse lunges": "Dumbbell Rear Lunge",
    "reverse lunge": "Dumbbell Rear Lunge",
    "chest flies": "Dumbbell Flyes",
    "pec-deck": "Butterfly",
    "dips": "Dips - Chest Version",
    "back extension": "Hyperextensions (Back Extensions)",
    "triceps extensions": "Standing Dumbbell Triceps Extension",
    "cable pushdowns": "Triceps Pushdown",
    "overhead cable extension": "Cable Rope Overhead Triceps Extension",
    "leg raises": "Flat Bench Lying Leg Raise",
    "hip thrust": "Barbell Hip Thrust",
    "smith machine hip thrust": "Barbell Hip Thrust",
    "light hip thrust machine": "Barbell Hip Thrust",
    "dumbbell glute bridge": "Barbell Glute Bridge",
    "glute bridge machine": "Barbell Glute Bridge",
    "single-leg glute bridge": "Single Leg Glute Bridge",
    "dumbbell romanian deadlift": "Stiff-Legged Dumbbell Deadlift",
    "cable pull-through": "Pull Through",
    "reverse hyper": "Reverse Hyperextension",
    "hip abduction machine": "Thigh Abductor",
    "cable glute kickback": "One-Legged Cable Kickback",
    "kickback machine": "Glute Kickback",
    "banded kickbacks": "Glute Kickback",
    "plank or cable crunch": "Plank",
    "step-ups": "Dumbbell Step Ups",
    "goblet squat": "Goblet Squat",
    "leg press": "Leg Press",
    "hack squat": "Hack Squat",
}

# Moves the dataset doesn't cover well; better to show form cues than a wrong picture.
KNOWN_GAPS = {"dead hangs", "banded side steps", "cable side kick"}

# Three short cues for each move without a picture (written for this app).
FORM_CUES = {
    "Dead hangs": [
        "Grip the bar a little wider than your shoulders, arms straight.",
        "Let the shoulders relax, then draw them slightly down and back.",
        "Breathe steadily and hold; come down before your grip gives out.",
    ],
    "Banded side steps": [
        "Band just above the knees or at the ankles, feet hip-width apart.",
        "Sit into a quarter squat with your chest up.",
        "Step sideways without letting the knees cave in; keep the band tight.",
    ],
    "Cable side kick": [
        "Ankle strap on the outside leg, standing side-on to the machine.",
        "Hold the frame, hips square, slight bend in the standing knee.",
        "Lift the leg out to the side with control, pause, lower slowly.",
    ],
}

STOP = {"a", "an", "the", "with", "of", "on", "or", "and", "to"}


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "meal-gym-build-script"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def load_dataset(path: str | None) -> list[dict]:
    raw = Path(path).read_bytes() if path else fetch(f"{BASE}/dist/exercises.json")
    return json.loads(raw)


def plan_names() -> list[tuple[str, str]]:
    """(name, where) for every exercise and swap in both plans, in plan order."""
    seed = json.loads(SEED.read_text())
    seen, out = set(), []
    for day in seed["workoutDays"]:
        side = "Ashley" if day.get("profile") == "ashley" else "Swag"
        where = f"{side} Day {day['order']}"
        for ex in day["exercises"]:
            for name, role in [(ex["name"], "exercise")] + [(s, "swap") for s in ex["swaps"]]:
                key = name.lower().strip()
                if key not in seen:
                    seen.add(key)
                    out.append((name, f"{where} {role}"))
    return out


def tokens(text: str) -> set[str]:
    words = re.findall(r"[a-z0-9]+", text.lower().replace("-", " "))
    out = set()
    for w in words:
        if w in STOP:
            continue
        if len(w) > 3 and w.endswith("s") and not w.endswith("ss"):
            w = w[:-1]
        out.add(w)
    return out


def fuzzy(name: str, dataset: list[dict]) -> tuple[dict | None, float]:
    q = tokens(name)
    best, best_score = None, 0.0
    for ex in dataset:
        t = tokens(ex["name"])
        if not q or not t:
            continue
        overlap = len(q & t)
        score = overlap / len(q | t) + (0.25 if q <= t else 0.0)
        if score > best_score:
            best, best_score = ex, score
    return best, best_score


def match(args) -> None:
    dataset = load_dataset(args.dataset)
    by_name = {ex["name"]: ex for ex in dataset}
    previous = json.loads(MATCHES.read_text()) if MATCHES.exists() else {}
    result, rows = {}, []
    for name, where in plan_names():
        key = name.lower().strip()
        prev = previous.get(name)
        if prev and prev.get("checked"):
            ex = next((e for e in dataset if e["id"] == prev.get("id")), None)
            how, score = "checked by hand", None
        elif key in KNOWN_GAPS:
            ex, how, score = None, "no good picture", None
        elif key in ALIASES and ALIASES[key] in by_name:
            ex, how, score = by_name[ALIASES[key]], "alias", None
        else:
            ex, score = fuzzy(name, dataset)
            how = "fuzzy"
            if score < 0.5:
                ex, how = None, "no match"
        result[name] = {
            "id": ex["id"] if ex else None,
            "datasetName": ex["name"] if ex else None,
            "how": how,
            "checked": bool(prev and prev.get("checked")),
        }
        rows.append((name, where, ex["name"] if ex else "—", how + (f" ({score:.2f})" if score is not None else "")))

    MATCHES.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    matched = sum(1 for r in result.values() if r["id"])
    lines = [
        "# Exercise demo match report",
        "",
        f"{matched} of {len(result)} exercise and swap names matched to free-exercise-db (public domain).",
        "",
        "To fix a match, edit `tools/exercise-matches.json`: set `id` to the dataset id you want (or `null` for",
        "no picture) and `checked` to `true`, then run `match` again. Unmatched moves get form cues and a",
        "\"Watch a demo\" search button in the app instead.",
        "",
        "| Our name | Where | Dataset entry | How |",
        "| --- | --- | --- | --- |",
    ]
    lines += [f"| {a} | {b} | {c} | {d} |" for a, b, c, d in rows]
    REPORT.write_text("\n".join(lines) + "\n")
    print(f"{matched}/{len(result)} matched. Report: {REPORT.relative_to(ROOT)}")


def bundle(args) -> None:
    from PIL import Image  # noqa: PLC0415 - only needed for this command

    dataset = {ex["id"]: ex for ex in load_dataset(args.dataset)}
    matches = json.loads(MATCHES.read_text())
    DEMOS.mkdir(parents=True, exist_ok=True)
    manifest, done = {}, set()
    for name, m in matches.items():
        ex = dataset.get(m["id"]) if m["id"] else None
        if ex is None:
            continue
        manifest[name] = {"id": ex["id"], "name": ex["name"], "instructions": ex.get("instructions", [])}
        if ex["id"] in done:
            continue
        folder = DEMOS / ex["id"]
        folder.mkdir(parents=True, exist_ok=True)
        for i, rel in enumerate(ex["images"][:2]):
            img = Image.open(io.BytesIO(fetch(f"{BASE}/exercises/{rel}"))).convert("RGB")
            img.thumbnail((480, 480))
            img.save(folder / f"{i}.webp", "WEBP", quality=72, method=6)
        done.add(ex["id"])
        print("bundled", ex["id"])
    payload = {
        "source": "free-exercise-db (public domain, Unlicense)",
        "exercises": manifest,
        "cues": {name: FORM_CUES[name] for name, m in matches.items() if not m["id"] and name in FORM_CUES},
    }
    (DEMOS / "demos.json").write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n")
    print(f"{len(done)} demos bundled into {DEMOS.relative_to(ROOT)}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = parser.add_subparsers(dest="command", required=True)
    for cmd in ("match", "bundle"):
        p = sub.add_parser(cmd)
        p.add_argument("--dataset", help="use a local copy of exercises.json instead of downloading it")
    args = parser.parse_args()
    {"match": match, "bundle": bundle}[args.command](args)


if __name__ == "__main__":
    sys.exit(main())
