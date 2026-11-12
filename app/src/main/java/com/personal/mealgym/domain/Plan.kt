package com.personal.mealgym.domain

import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.seed.GuideLine
import com.personal.mealgym.data.seed.WorkoutTemplate
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import java.time.DayOfWeek
import kotlin.math.abs
import kotlin.math.min
import kotlin.math.roundToInt

enum class Goal(val label: String, val blurb: String) {
    LOSE("Lose fat", "A gentle calorie deficit with plenty of protein."),
    BUILD("Build muscle", "A small surplus and progressive lifting."),
    FIT("Stay fit and healthy", "Eat about what you burn and keep moving."),
}

enum class Sex(val label: String) { FEMALE("Female"), MALE("Male"), UNSPECIFIED("Rather not say") }

/** Everyday activity, including exercise. The factor multiplies resting energy use. */
enum class Activity(val label: String, val blurb: String, val factor: Double) {
    LOW("Mostly sitting", "Desk job, little exercise.", 1.2),
    LIGHT("Lightly active", "Some walking, or exercise 1 to 3 days a week.", 1.375),
    MODERATE("Active", "On your feet a lot, or exercise 3 to 5 days a week.", 1.55),
    HIGH("Very active", "Physical job, or hard exercise most days.", 1.725),
}

enum class Place(val label: String) { GYM("At a gym"), HOME("At home") }

enum class Experience(val label: String) { NEW("New to lifting"), SOME("I've trained before") }

/**
 * The setup questions, as answered. Stored as JSON on the profile and never sent anywhere.
 * Names rather than enums, so a choice added by a newer version falls back instead of failing.
 */
@Serializable
data class PlanAnswers(
    val goal: String = Goal.FIT.name,
    val sex: String = Sex.UNSPECIFIED.name,
    val age: Int? = null,
    val heightCm: Double? = null,
    val weightKg: Double? = null,
    val activity: String = Activity.LIGHT.name,
    val pregnant: Boolean = false,
    /** Favourite cuisine tags; recipes from them come up more often. */
    val cuisines: List<String> = emptyList(),
    /** [Avoid] names. */
    val avoid: List<String> = emptyList(),
    val place: String = Place.GYM.name,
    val experience: String = Experience.NEW.name,
    val daysPerWeek: Int = 3,
    /** Whether the form showed kg and cm. */
    val metric: Boolean = false,
) {
    val goalValue: Goal get() = enumOr(goal, Goal.FIT)
    val sexValue: Sex get() = enumOr(sex, Sex.UNSPECIFIED)
    val activityValue: Activity get() = enumOr(activity, Activity.LIGHT)
    val placeValue: Place get() = enumOr(place, Place.GYM)
    val experienceValue: Experience get() = enumOr(experience, Experience.NEW)
    val avoids: Set<Avoid> get() = Avoid.parse(avoid)

    fun encode(): String = json.encodeToString(serializer(), this)

    companion object {
        private val json = Json {
            ignoreUnknownKeys = true
            encodeDefaults = true
        }

        fun decode(text: String?): PlanAnswers? = text?.let { runCatching { json.decodeFromString(serializer(), it) }.getOrNull() }

        private inline fun <reified E : Enum<E>> enumOr(name: String, fallback: E): E =
            runCatching { enumValueOf<E>(name) }.getOrDefault(fallback)
    }
}

/** The answers a person gave at setup, if they did. */
val Profile.answers: PlanAnswers? get() = PlanAnswers.decode(planAnswers)

/** An estimated daily guide. [notes] explain anything that was held back for safety. */
data class Targets(val calories: Int, val proteinGrams: Int, val notes: List<String> = emptyList())

/** Why there are no numbers, when there aren't. */
sealed interface TargetResult {
    data class Ready(val targets: Targets) : TargetResult

    /** Height, weight or age wasn't given (or isn't plausible). */
    data object NeedsDetails : TargetResult

    /** The app deliberately gives no numbers; [message] says who to ask instead. */
    data class Withheld(val message: String) : TargetResult
}

/** How the meal side of the plan is set up to land near the calorie guide. */
data class MealSetup(val portion: Double, val snack: Boolean, val typicalCalories: Int, val typicalProtein: Int)

/**
 * Turns the setup answers into a plan. Everything here is an estimate for healthy adults and
 * is shown as a guide; the app never logs food or weight.
 */
object PlanBuilder {
    const val MIN_AGE_FOR_TARGETS = 18

    val ageRange = 13..100
    val heightRangeCm = 120.0..230.0
    val weightRangeKg = 35.0..250.0

    private const val KG_PER_LB = 0.45359237
    private const val CM_PER_INCH = 2.54

    fun lbToKg(lb: Double) = lb * KG_PER_LB
    fun kgToLb(kg: Double) = kg / KG_PER_LB
    fun feetInchesToCm(feet: Int, inches: Double) = (feet * 12 + inches) * CM_PER_INCH
    fun cmToFeetInches(cm: Double): Pair<Int, Int> {
        val totalInches = (cm / CM_PER_INCH).roundToInt()
        return totalInches / 12 to totalInches % 12
    }

    /** Lowest daily calories the app will ever suggest. */
    fun calorieFloor(sex: Sex): Int = when (sex) {
        Sex.FEMALE -> 1200
        Sex.MALE -> 1500
        Sex.UNSPECIFIED -> 1400
    }

    private fun bmi(kg: Double, cm: Double): Double = kg / ((cm / 100) * (cm / 100))

    /**
     * Resting energy use by the Mifflin-St Jeor equation, times an activity factor, then moved
     * for the goal: at most 20% (and never more than 500 calories) below for fat loss, 10%
     * (at most 300) above for building muscle.
     *
     * Held back for safety: no numbers under 18 or while pregnant or breastfeeding, no deficit
     * for someone already underweight for their height, and never below [calorieFloor].
     */
    fun targets(a: PlanAnswers): TargetResult {
        val age = a.age?.takeIf { it in ageRange }
        val cm = a.heightCm?.takeIf { it in heightRangeCm }
        val kg = a.weightKg?.takeIf { it in weightRangeKg }
        if (age != null && age < MIN_AGE_FOR_TARGETS) {
            return TargetResult.Withheld(
                "Calorie and protein guides here are for adults. If you're under 18, a doctor or dietitian is the right person to ask.",
            )
        }
        if (a.pregnant) {
            return TargetResult.Withheld(
                "Needs change a lot during pregnancy and breastfeeding, so this app doesn't give numbers. Your doctor or midwife can.",
            )
        }
        if (age == null || cm == null || kg == null) return TargetResult.NeedsDetails

        val sex = a.sexValue
        val sexTerm = when (sex) {
            Sex.MALE -> 5.0
            Sex.FEMALE -> -161.0
            Sex.UNSPECIFIED -> -78.0
        }
        val resting = 10 * kg + 6.25 * cm - 5 * age + sexTerm
        val maintenance = resting * a.activityValue.factor
        val notes = mutableListOf<String>()
        val underweight = bmi(kg, cm) < 18.5

        var calories = when (a.goalValue) {
            Goal.LOSE -> if (underweight) {
                notes += "Your weight is already on the low side for your height, so this guide has no deficit. Talk to a doctor before trying to lose weight."
                maintenance
            } else {
                maintenance - min(maintenance * 0.20, 500.0)
            }
            Goal.BUILD -> maintenance + min(maintenance * 0.10, 300.0)
            Goal.FIT -> maintenance
        }
        val floor = calorieFloor(sex)
        if (calories < floor) {
            calories = floor.toDouble()
            notes += "Kept at $floor calories, the lowest this app suggests. Eating less than that is something to do only with a doctor."
        }

        // Protein per kg of body weight; for a BMI over 30 an adjusted weight is used, so the
        // number stays realistic.
        val healthyKg = 25.0 * (cm / 100) * (cm / 100)
        val proteinKg = if (bmi(kg, cm) > 30) healthyKg + 0.25 * (kg - healthyKg) else kg
        val perKg = when (a.goalValue) {
            Goal.LOSE, Goal.BUILD -> 1.8
            Goal.FIT -> 1.4
        }
        val protein = (perKg * proteinKg).coerceIn(50.0, 220.0)

        return TargetResult.Ready(
            Targets(
                calories = (calories / 50).roundToInt() * 50,
                proteinGrams = (protein / 5).roundToInt() * 5,
                notes = notes,
            ),
        )
    }

    /** The reference lines shown on Today and in the plan summary. */
    fun guide(a: PlanAnswers): List<GuideLine> = when (val result = targets(a)) {
        is TargetResult.Ready -> buildList {
            val t = result.targets
            add(GuideLine("Calories", "about ${"%,d".format(t.calories)} a day"))
            add(GuideLine("Protein", "about ${t.proteinGrams} g a day, roughly ${perMeal(t.proteinGrams)} g a meal"))
            when (a.goalValue) {
                Goal.LOSE -> add(GuideLine("Pace", "slow and steady: up to about 1 lb (0.5 kg) a week"))
                Goal.BUILD -> add(GuideLine("Pace", "a small surplus; add a little weight or a rep each week"))
                Goal.FIT -> Unit
            }
            t.notes.forEach { add(GuideLine("Note", it)) }
        }
        is TargetResult.Withheld -> listOf(GuideLine("Guide", result.message))
        TargetResult.NeedsDetails -> emptyList()
    }

    private fun perMeal(dailyGrams: Int): Int = ((dailyGrams / 3.5) / 5).roundToInt() * 5

    /** The starter plan that fits where and how someone trains. */
    fun suggestTemplate(a: PlanAnswers, templates: List<WorkoutTemplate>): WorkoutTemplate? {
        val wanted = when {
            a.placeValue == Place.HOME -> "home-3"
            a.experienceValue == Experience.SOME && a.daysPerWeek >= 4 -> "upper-lower-4"
            else -> "full-body-3"
        }
        return templates.firstOrNull { it.key == wanted } ?: templates.firstOrNull()
    }

    /** Training days spread across the week with rest between them. */
    fun trainingDays(daysPerWeek: Int): Set<DayOfWeek> = when (daysPerWeek.coerceIn(2, 6)) {
        2 -> setOf(DayOfWeek.MONDAY, DayOfWeek.THURSDAY)
        3 -> setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)
        4 -> setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)
        5 -> setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)
        else -> DayOfWeek.entries.toSet() - DayOfWeek.SUNDAY
    }

    /** A line or two for the gym screen that fits the goal. */
    fun goalTips(goal: Goal): List<String> = when (goal) {
        Goal.LOSE -> listOf("Lifting helps you keep muscle while you lose fat. A 20 to 30 minute walk most days helps too.")
        Goal.BUILD -> listOf("Try to add a rep or a little weight each week, and eat your protein.")
        Goal.FIT -> listOf("Showing up on your training days matters more than any single hard session.")
    }

    /** Recipe tips that fit the goal: filling plates for fat loss, easier-to-finish ones for a surplus. */
    fun tipsStyle(goal: Goal): String = if (goal == Goal.BUILD) Profile.TIPS_EASIER else Profile.TIPS_FILL_UP

    /** "~520 cal, 42 g protein, ..." -> 520. Null when the text has no calorie figure. */
    fun caloriesIn(nutritionText: String?): Int? =
        nutritionText?.let { Regex("(\\d[\\d,]*)\\s*cal").find(it) }?.groupValues?.get(1)?.replace(",", "")?.toIntOrNull()

    /** "~520 cal, 42 g protein, ..." -> 42. */
    fun proteinIn(nutritionText: String?): Int? =
        nutritionText?.let { Regex("(\\d+)\\s*g protein").find(it) }?.groupValues?.get(1)?.toIntOrNull()

    private fun median(values: List<Int>, fallback: Int): Int =
        if (values.isEmpty()) fallback else values.sorted()[values.size / 2]

    /**
     * Picks the lunch-and-dinner portion and whether to add a snack so that a typical day of
     * the library's recipes lands nearest the calorie guide. Without a guide: full portions,
     * no snack.
     */
    fun mealSetup(targetCalories: Int?, recipes: List<Recipe>): MealSetup {
        fun typical(types: Set<MealType>, read: (String?) -> Int?, fallback: Int) =
            median(recipes.filter { it.mealType in types && !it.isHidden }.mapNotNull { read(it.nutritionText) }, fallback)
        val mains = setOf(MealType.LUNCH, MealType.DINNER, MealType.SOUP)
        val breakfastCal = typical(setOf(MealType.BREAKFAST), ::caloriesIn, 450)
        val mainCal = typical(mains, ::caloriesIn, 600)
        val snackCal = typical(setOf(MealType.SNACK), ::caloriesIn, 200)
        val breakfastProtein = typical(setOf(MealType.BREAKFAST), ::proteinIn, 30)
        val mainProtein = typical(mains, ::proteinIn, 45)
        val snackProtein = typical(setOf(MealType.SNACK), ::proteinIn, 15)

        fun setup(portion: Double, snack: Boolean) = MealSetup(
            portion = portion,
            snack = snack,
            typicalCalories = (breakfastCal + 2 * mainCal * portion + if (snack) snackCal else 0).roundToInt(),
            typicalProtein = (breakfastProtein + 2 * mainProtein * portion + if (snack) snackProtein else 0).roundToInt(),
        )
        if (targetCalories == null) return setup(1.0, false)
        return listOf(0.75, 1.0, 1.5).flatMap { p -> listOf(setup(p, false), setup(p, true)) }
            .minWith(compareBy<MealSetup> { abs(it.typicalCalories - targetCalories) }.thenBy { it.snack })
    }

    /**
     * Recipes one person can be offered for a slot, with favourite cuisines listed three times
     * so a random pick lands on them more often.
     */
    fun weighted(candidates: List<Recipe>, favouriteCuisines: Collection<String>): List<Recipe> {
        if (favouriteCuisines.isEmpty()) return candidates
        val favourites = favouriteCuisines.map { it.lowercase() }.toSet()
        return candidates.flatMap { r ->
            if (r.cuisineTags.any { it.lowercase() in favourites }) listOf(r, r, r) else listOf(r)
        }
    }
}
