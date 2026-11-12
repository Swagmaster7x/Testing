#!/usr/bin/env python3
"""Writes the store edition's exercise demos: three short form cues per move, no photos.

Every exercise and swap in the store's starter plans needs an entry (the store tests check).
Names that are the same move share cues through ALIASES. The cues are written for this app.

    python3 tools/form_cues.py
"""
import json
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
SEED = ROOT / "app/src/store/assets/seed.json"
OUT = ROOT / "app/src/store/assets/demos/demos.json"

CUES = {
    # Legs
    "Goblet squat": [
        "Hold one dumbbell upright against your chest, elbows pointing down.",
        "Feet a bit wider than your hips; sit down between your heels with your chest tall.",
        "Go as low as you can with your heels down, then drive up through the whole foot.",
    ],
    "Bodyweight squat": [
        "Feet shoulder-width, toes turned out slightly, arms forward for balance.",
        "Push your hips back and bend your knees, keeping your chest up.",
        "Go to a comfortable depth, then stand by pushing the floor away.",
    ],
    "Barbell squat": [
        "Bar across your upper back, feet shoulder-width, toes slightly out.",
        "Brace, then sit down between your heels with your knees following your toes.",
        "Go as deep as you can with a flat back, then drive up. Set the safety bars first.",
    ],
    "Smith machine squat": [
        "Bar across your upper back, feet a little in front of the bar.",
        "Sit down until your thighs are about level with the floor, chest up.",
        "Drive up through your heels. Set the safety stops before you start.",
    ],
    "Hack squat": [
        "Back flat on the pad, shoulders under the pads, feet in the middle of the platform.",
        "Lower until your thighs are at least level, knees tracking over your toes.",
        "Push through your whole foot to stand without slamming your knees straight.",
    ],
    "Leg press": [
        "Sit all the way back on the pad, feet shoulder-width in the middle of the platform.",
        "Lower until your knees are near your chest, stopping before your lower back lifts.",
        "Press through your heels and stop just short of locking your knees.",
    ],
    "Lunges": [
        "Step forward and lower until both knees are bent to about a right angle.",
        "Keep the front knee over your foot and your chest tall.",
        "Push back to standing through the front heel.",
    ],
    "Reverse lunge": [
        "Stand tall, then step one foot back and lower until both knees are bent to about a right angle.",
        "Keep most of your weight on the front foot and your chest up.",
        "Push through the front heel to stand; alternate legs or finish one side first.",
    ],
    "Walking dumbbell lunges": [
        "Hold a dumbbell in each hand at your sides.",
        "Step into a lunge, then bring the back foot through into the next step.",
        "Take long, steady steps and keep your chest up the whole way.",
    ],
    "Bulgarian split squat": [
        "Rear foot on a bench behind you, front foot far enough forward to sit straight down.",
        "Lower until the back knee nearly touches the floor, chest up.",
        "Push through the front foot to rise; finish one leg, then switch.",
    ],
    "Step-ups": [
        "Use a box or bench about knee height and put your whole foot on it.",
        "Push through the top foot to stand up, without bouncing off the back foot.",
        "Step down slowly with control.",
    ],
    "Leg extension": [
        "Line your knees up with the machine's pivot, pad on your lower shins.",
        "Straighten your legs and squeeze the front of your thighs for a moment.",
        "Lower slowly without letting the weight stack slam.",
    ],
    "Seated leg curl": [
        "Line your knees up with the pivot; the pad sits just above your heels.",
        "Curl your heels down and back as far as you can, hips staying in the seat.",
        "Let the weight return slowly.",
    ],
    "Lying leg curl": [
        "Lie face down with your knees just past the edge of the bench, pad above your heels.",
        "Curl your heels toward your glutes, keeping your hips pressed down.",
        "Lower slowly to straight legs.",
    ],
    "Romanian deadlift": [
        "Stand tall with the bar at your thighs, knees soft.",
        "Push your hips back and slide the bar down your legs, back flat, until your hamstrings stretch.",
        "Drive your hips forward to stand; don't lean back at the top.",
    ],
    "Dumbbell Romanian deadlift": [
        "Hold a dumbbell in each hand in front of your thighs, knees soft.",
        "Push your hips back and lower the weights along your legs, back flat, until your hamstrings stretch.",
        "Drive your hips forward to stand tall.",
    ],
    "Good mornings": [
        "Bar across your upper back as for a squat, knees slightly bent.",
        "Push your hips back and lean forward with a flat back until your hamstrings stretch.",
        "Drive your hips forward to stand. Start light.",
    ],
    "Back extension": [
        "Set the pad just below your hip bones so you can bend freely at the hips.",
        "Lower your upper body with a flat back until your hamstrings stretch.",
        "Rise until your body is in a straight line, squeezing your glutes; don't arch past it.",
    ],
    "Reverse hyper": [
        "Lie face down on the machine with your hips at the edge of the pad.",
        "Lift your legs behind you until they line up with your body, squeezing your glutes.",
        "Lower with control; don't swing the weight.",
    ],
    "Cable pull-through": [
        "Stand facing away from a low cable with the rope between your legs.",
        "Bend at the hips and let the rope pull your hands back between your legs.",
        "Drive your hips forward to stand tall, squeezing your glutes.",
    ],
    # Glutes
    "Hip thrust": [
        "Upper back against a bench just below the shoulder blades, feet flat and hip-width.",
        "Tuck your chin and keep your ribs down as you drive your hips up.",
        "At the top your shins are vertical and your glutes squeezed; lower slowly.",
    ],
    "Smith machine hip thrust": [
        "Set the bar over the crease of your hips with a pad, upper back on the bench.",
        "Unhook the bar, tuck your chin and drive your hips up until your body is flat.",
        "Squeeze your glutes at the top, lower slowly and re-rack when you're done.",
    ],
    "Hip thrust machine": [
        "Sit in the machine with the pad or belt over your hips and your upper back on the pad.",
        "Drive your hips up with your chin tucked and ribs down.",
        "Squeeze for a second at the top, then lower slowly.",
    ],
    "Dumbbell glute bridge": [
        "Lie on your back, knees bent, feet flat, a dumbbell resting on your hips.",
        "Press through your heels and lift until your body is straight from knees to shoulders.",
        "Squeeze your glutes at the top, then lower slowly.",
    ],
    "Single-leg glute bridge": [
        "Lie on your back with one knee bent and the other leg straight out.",
        "Press through the planted heel to lift your hips level, without twisting.",
        "Lower slowly; do all the reps on one side, then switch.",
    ],
    "Hip abduction machine": [
        "Sit with the pads on the outsides of your knees and your back against the seat.",
        "Push your knees out as far as you can and pause.",
        "Return slowly without letting the stack touch down.",
    ],
    "Banded side steps": [
        "Band just above the knees or at the ankles, feet hip-width apart.",
        "Sit into a quarter squat with your chest up.",
        "Step sideways without letting the knees cave in; keep the band tight.",
    ],
    "Cable side kick": [
        "Ankle strap on the outside leg, standing side-on to the machine.",
        "Hold the frame, hips square, slight bend in the standing knee.",
        "Lift the leg out to the side with control; don't lean away.",
    ],
    "Cable glute kickback": [
        "Strap a cable cuff to one ankle and hold the frame, leaning slightly forward.",
        "Kick the leg straight back by squeezing your glute, without arching your lower back.",
        "Return slowly; finish one leg, then switch.",
    ],
    "Kickback machine": [
        "Set the pad on the back of your working leg and hold the handles.",
        "Push back and up with that leg, squeezing your glute at the top.",
        "Return slowly and keep your hips square.",
    ],
    "Banded kickbacks": [
        "Loop a band around both ankles or the working foot, holding something for balance.",
        "Kick one leg straight back, squeezing your glute.",
        "Return slowly, keeping tension on the band.",
    ],
    # Calves
    "Calf raises": [
        "Stand with the balls of your feet on a step, heels hanging off.",
        "Rise as high as you can onto your toes and pause.",
        "Lower slowly until you feel a stretch in your calves.",
    ],
    "Seated calf raise": [
        "Sit with the pad on your lower thighs and the balls of your feet on the platform.",
        "Push up onto your toes as high as you can and pause.",
        "Lower slowly into a full stretch.",
    ],
    "Standing calf machine": [
        "Shoulders under the pads, balls of your feet on the step.",
        "Rise onto your toes as high as you can and pause.",
        "Lower slowly until your heels drop below the step.",
    ],
    "Leg-press calf raise": [
        "Sit in the leg press with the balls of your feet on the bottom edge of the platform.",
        "Keep your knees straight and push the platform by pointing your toes.",
        "Let it come back slowly for a full stretch, with the safety handles on.",
    ],
    "Any calf machine": [
        "Balls of your feet on the edge of the platform, heels free.",
        "Push up as high as you can and pause for a second.",
        "Lower slowly into a full stretch every rep.",
    ],
    # Chest
    "Barbell bench press": [
        "Eyes under the bar, feet flat, shoulder blades squeezed together.",
        "Lower the bar to the middle of your chest with your forearms upright.",
        "Press back up over your shoulders. Use a spotter or safety arms when it's heavy.",
    ],
    "Smith machine bench": [
        "Set the bench so the bar comes down to the middle of your chest.",
        "Shoulder blades back, feet flat, hands a little wider than your shoulders.",
        "Lower under control and press up. Set the safety stops first.",
    ],
    "Pause bench press": [
        "Set up as for a normal bench press, with a lighter weight than usual.",
        "Lower the bar to your chest and hold it still for one to two seconds.",
        "Stay tight during the pause, then press up hard.",
    ],
    "Dumbbell bench": [
        "Lie on a flat bench with a dumbbell over each shoulder, palms toward your feet.",
        "Lower to the sides of your chest, elbows about 45 degrees from your body.",
        "Press back up and slightly in, without clanking the dumbbells together.",
    ],
    "Incline dumbbell press": [
        "Set the bench to a low incline, about 30 degrees.",
        "Lower the dumbbells to your upper chest with your elbows slightly tucked.",
        "Press up and slightly in until your arms are nearly straight.",
    ],
    "Incline dumbbell press with a pause": [
        "Set the bench to a low incline and lower the dumbbells to your upper chest.",
        "Hold still for one to two seconds at the bottom without relaxing.",
        "Press up hard, with a little less weight than usual.",
    ],
    "Chest press machine": [
        "Set the seat so the handles line up with the middle of your chest.",
        "Keep your shoulder blades back against the pad and your feet flat.",
        "Press out smoothly, then let the handles come back until you feel a light stretch.",
    ],
    "Incline machine press": [
        "Set the seat so the handles line up with your upper chest.",
        "Keep your shoulder blades back on the pad and press up and out.",
        "Return slowly until you feel a light stretch.",
    ],
    "Push-ups": [
        "Hands just wider than your shoulders, body straight from head to heels.",
        "Lower your chest toward the floor with your elbows angled back, not flared.",
        "Push the floor away. Drop to your knees or use a bench when the form slips.",
    ],
    "Chest flies": [
        "Lie on a flat bench with dumbbells over your chest, palms facing each other.",
        "With a slight bend in the elbows, open your arms in a wide arc until your chest stretches.",
        "Bring them back together as if hugging a tree.",
    ],
    "Pec-deck": [
        "Set the seat so the handles are at chest height.",
        "With a slight bend in the elbows, bring the handles together in front of you.",
        "Open back up slowly until you feel a stretch across your chest.",
    ],
    "Cable crossover": [
        "Set the cables high, take a handle in each hand and step forward.",
        "With a slight bend in the elbows, bring your hands together in front of your hips.",
        "Return slowly until your arms are wide and your chest stretches.",
    ],
    "Dips": [
        "Support yourself on the bars with straight arms and your shoulders down.",
        "Lower until your upper arms are about level with the floor, leaning slightly forward.",
        "Press back up. The assisted dip machine helps while you build up.",
    ],
    # Back
    "Lat pulldown": [
        "Tuck your knees under the pad and grip the bar a little wider than your shoulders.",
        "Lean back slightly and pull the bar to your upper chest, leading with your elbows.",
        "Let it rise under control until your arms are straight again.",
    ],
    "Lat pulldown, underhand grip": [
        "Grip the bar with your palms facing you, about shoulder-width apart.",
        "Pull to your upper chest, driving your elbows down toward your ribs.",
        "Return slowly until your arms are straight, chest up.",
    ],
    "Assisted pull-up machine": [
        "Kneel or stand on the pad; more weight on the stack means more help.",
        "Grip just wider than your shoulders and pull your chest toward the bar.",
        "Lower all the way down slowly before the next rep.",
    ],
    "Assisted chin-up machine": [
        "Kneel or stand on the pad; more weight on the stack means more help.",
        "Palms facing you, about shoulder-width, pull until your chin clears the bar.",
        "Lower all the way down slowly before the next rep.",
    ],
    "Bodyweight pull-ups": [
        "Grip just wider than your shoulders, palms facing away.",
        "Pull your chest toward the bar, driving your elbows down.",
        "Lower to a full hang each rep, without swinging.",
    ],
    "Weighted pull-ups": [
        "Add weight with a dip belt or a dumbbell held between your feet.",
        "Palms facing away, start from a full hang and pull your chest toward the bar.",
        "Lower all the way down every rep.",
    ],
    "Weighted chin-ups": [
        "Add weight with a dip belt or a dumbbell held between your feet.",
        "Palms facing you, shoulder-width, start from a full hang.",
        "Pull until your chin clears the bar, then lower all the way.",
    ],
    "Seated cable row": [
        "Sit tall with a slight bend in the knees and the handle at arm's length.",
        "Pull the handle to your lower ribs, squeezing your shoulder blades together.",
        "Let your arms straighten slowly without rounding forward.",
    ],
    "Chest-supported row machine": [
        "Set the seat so the chest pad sits at the middle of your chest.",
        "Keep your chest on the pad and pull the handles back, elbows close to your sides.",
        "Pause with your shoulder blades squeezed, then lower slowly.",
    ],
    "Dumbbell row": [
        "One knee and hand on a bench, back flat, dumbbell hanging straight down.",
        "Pull the dumbbell toward your hip, keeping your elbow close.",
        "Lower until your arm is straight, without twisting your body.",
    ],
    "Rows": [
        "Bend forward at the hips with a flat back, holding a bar or dumbbells at arm's length.",
        "Pull toward your lower ribs, driving your elbows back.",
        "Lower until your arms are straight, keeping your back still.",
    ],
    "Dead hangs": [
        "Grip the bar a little wider than your shoulders, arms straight.",
        "Let the shoulders relax, then draw them slightly down and back.",
        "Breathe steadily and hold; come down before your grip gives out.",
    ],
    "Farmer's carries": [
        "Pick up heavy dumbbells or kettlebells with a flat back, as for a deadlift.",
        "Stand tall with your shoulders down and back, and walk with short, steady steps.",
        "Set the weights down with control when your grip or posture fades.",
    ],
    # Shoulders
    "Standing overhead press": [
        "Bar at your collarbones, hands just outside your shoulders, glutes squeezed.",
        "Press straight up, moving your head back slightly to let the bar pass.",
        "Finish with the bar over the middle of your feet; lower under control.",
    ],
    "Dumbbell shoulder press": [
        "Sit on an upright bench with the dumbbells at shoulder height, palms forward.",
        "Press straight up until your arms are nearly straight, without arching your lower back.",
        "Lower back to shoulder height under control.",
    ],
    "Shoulder press machine": [
        "Set the seat so the handles start at about shoulder height.",
        "Keep your back against the pad and press up until your arms are nearly straight.",
        "Lower slowly without letting the stack bang.",
    ],
    "Smith machine press": [
        "Sit under the bar with it starting just above shoulder height.",
        "Press up until your arms are nearly straight, back against the pad.",
        "Lower to chin height under control.",
    ],
    "Side raises": [
        "Stand tall with dumbbells at your sides and a slight bend in your elbows.",
        "Raise your arms out to the sides up to shoulder height, leading with the elbows.",
        "Lower slowly, without swinging.",
    ],
    "Cable lateral raise": [
        "Stand side-on to a low cable and hold the handle in the far hand.",
        "Raise your arm out to the side up to shoulder height.",
        "Lower slowly; finish one side, then switch.",
    ],
    "Machine lateral raise": [
        "Set the seat so the pivot lines up with your shoulders, pads on your outer arms.",
        "Raise your arms out to the sides up to shoulder height.",
        "Lower slowly to the start.",
    ],
    "Cable or machine lateral raise": [
        "Cable: stand side-on to a low cable and hold the handle in the far hand.",
        "Machine: set the seat so the pivot lines up with your shoulders.",
        "Either way, raise to shoulder height and lower slowly, without swinging.",
    ],
    "Bent-over side raises": [
        "Bend forward with a flat back until your chest is nearly level with the floor.",
        "With a slight bend in the elbows, raise the dumbbells out to the sides.",
        "Squeeze the backs of your shoulders at the top, then lower slowly.",
    ],
    "Reverse pec-deck": [
        "Face the pad with the handles at shoulder height and your arms straight out in front.",
        "Sweep your arms out and back in a wide arc, leading with your elbows.",
        "Pause, then return slowly. Keep it light enough to control.",
    ],
    "Cable rear-delt fly": [
        "Set two cables at shoulder height and cross the handles: left hand on the right cable.",
        "Pull your arms out and back in a wide arc, elbows slightly bent.",
        "Return slowly until your hands cross again.",
    ],
    "Face pulls": [
        "Set a rope at upper-chest height or higher and step back until the cable is tight.",
        "Pull the rope toward your face, splitting the ends and turning your hands back.",
        "Pause with your elbows high and shoulder blades squeezed, then return slowly.",
    ],
    "Band pull-aparts": [
        "Hold a light band at shoulder height, arms straight, hands shoulder-width.",
        "Pull the band apart until it touches your chest, squeezing your shoulder blades.",
        "Return slowly, keeping tension on the band.",
    ],
    # Arms
    "Curls": [
        "Stand with dumbbells or a bar at your thighs, palms forward, elbows by your sides.",
        "Curl up without letting your elbows drift forward or your back sway.",
        "Lower slowly all the way down.",
    ],
    "Cable curls": [
        "Face a low cable with a straight or EZ bar, elbows at your sides.",
        "Curl the handle up to your shoulders, keeping your upper arms still.",
        "Lower slowly; the cable keeps tension the whole way.",
    ],
    "Machine curls": [
        "Set the seat so your upper arms lie flat on the pad and your elbows line up with the pivot.",
        "Curl the handles up smoothly without lifting off the pad.",
        "Lower slowly until your arms are almost straight.",
    ],
    "Preacher curls": [
        "Rest the backs of your upper arms flat on the preacher pad.",
        "Curl the bar or dumbbell up, keeping your arms on the pad.",
        "Lower slowly until your arms are almost straight; don't drop into the bottom.",
    ],
    "Incline dumbbell curl": [
        "Sit back on a bench set to about 45 degrees, arms hanging straight down.",
        "Curl both dumbbells up without moving your upper arms forward.",
        "Lower slowly to a full stretch.",
    ],
    "Wrist curls": [
        "Sit with your forearms on your thighs, palms up, wrists just past your knees.",
        "Let the weight roll down toward your fingers, then curl it back up.",
        "Move only at the wrists; light weight, high reps.",
    ],
    "Triceps extensions": [
        "Hold a dumbbell or bar overhead, or lie on a bench with it above your forehead.",
        "Bend only at the elbows to lower the weight behind your head.",
        "Straighten your arms fully, keeping your upper arms still.",
    ],
    "Cable pushdowns": [
        "Face a high cable with a rope or bar, elbows tucked at your sides.",
        "Push down until your arms are straight, spreading the rope at the bottom.",
        "Let it rise slowly to about chest height, elbows staying put.",
    ],
    "Overhead cable extension": [
        "Face away from a cable with a rope held behind your head.",
        "Keep your elbows pointing forward and straighten your arms overhead.",
        "Return slowly for a deep stretch in the backs of your arms.",
    ],
    # Core
    "Plank": [
        "Forearms under your shoulders, body straight from head to heels.",
        "Squeeze your glutes and brace your stomach.",
        "Breathe steadily; stop when your hips start to sag.",
    ],
    "Dead bug": [
        "Lie on your back, arms up to the ceiling, knees bent over your hips.",
        "Press your lower back into the floor and keep it there the whole time.",
        "Slowly reach one arm back and the opposite leg out, then switch sides.",
    ],
    "Hanging knee raises": [
        "Hang from a bar with straight arms and your shoulders slightly engaged.",
        "Bring your knees toward your chest by curling your hips, not by swinging.",
        "Lower slowly until your legs are straight.",
    ],
    "Hanging leg raises": [
        "Hang from a bar with straight arms and your legs together.",
        "Raise your straight legs as high as you can control, curling your hips up.",
        "Lower slowly without swinging. Bend your knees to make it easier.",
    ],
    "Captain's chair knee raises": [
        "Back against the pad, forearms on the arm rests, legs hanging.",
        "Lift your knees toward your chest, rolling your hips up slightly.",
        "Lower slowly without swinging.",
    ],
    "Captain's chair leg raises": [
        "Back against the pad, forearms on the arm rests, legs straight down.",
        "Raise your straight legs to hip height or higher, without leaning back.",
        "Lower slowly. Bend your knees to make it easier.",
    ],
    "Leg raises": [
        "Lie on your back with your hands under your hips and your legs straight.",
        "Raise your legs until they point at the ceiling, lower back staying down.",
        "Lower slowly and stop just before your heels touch the floor.",
    ],
    "Cable crunches": [
        "Kneel facing a high cable with a rope, hands by your forehead.",
        "Curl down, bringing your elbows toward your thighs while your hips stay still.",
        "Rise back up slowly until your stomach stretches.",
    ],
    "Ab machine": [
        "Set the seat so the pads rest on your chest or the handles sit by your shoulders.",
        "Curl your ribs toward your hips, rounding your upper back.",
        "Return slowly; let your stomach do the work, not your arms.",
    ],
    "Plank or cable crunch": [
        "Plank: forearms under your shoulders, body straight, glutes squeezed.",
        "Cable crunch: kneel at a high cable with a rope and curl your elbows toward your thighs.",
        "Either way, brace your stomach and keep breathing.",
    ],
}

# Other names in the plans for a move above.
ALIASES = {
    "Bulgarian split squats": "Bulgarian split squat",
    "Reverse lunges": "Reverse lunge",
    "Seated or lying leg curl": "Seated leg curl",
    "Leg curl machine": "Seated leg curl",
    "Light hip thrust machine": "Hip thrust machine",
    "Glute bridge machine": "Hip thrust machine",
    "Dumbbell press": "Dumbbell bench",
    "Machine chest press": "Chest press machine",
    "Chest press machine, light": "Chest press machine",
    "Cable row": "Seated cable row",
    "Seated dumbbell shoulder press": "Dumbbell shoulder press",
    "Machine preacher curl": "Machine curls",
    "Rear-delt machine": "Reverse pec-deck",
    "Any ab machine": "Ab machine",
}


def plan_names(seed):
    names = []
    for t in seed["workoutTemplates"]:
        for day in t["days"]:
            for e in day["exercises"]:
                for n in [e["name"], *e["swaps"]]:
                    if n not in names:
                        names.append(n)
    return names


def main():
    seed = json.loads(SEED.read_text())
    cues = {}
    missing = []
    for name in plan_names(seed):
        key = ALIASES.get(name, name)
        if key in CUES:
            cues[name] = CUES[key]
        else:
            missing.append(name)
    assert not missing, f"No cues for: {missing}"
    # Moves people often add themselves get cues too.
    for name, lines in CUES.items():
        cues.setdefault(name, lines)
    for name, lines in cues.items():
        assert len(lines) == 3, name
    OUT.parent.mkdir(parents=True, exist_ok=True)
    payload = {"source": "Form cues written for Meal & Gym", "exercises": {}, "cues": dict(sorted(cues.items()))}
    OUT.write_text(json.dumps(payload, indent=1, ensure_ascii=False) + "\n")
    print(f"Wrote {OUT.relative_to(ROOT)}: cues for {len(cues)} exercise names")


if __name__ == "__main__":
    main()
