package com.personal.mealgym.domain

import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.OffPlanKind
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.Recipe
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * What one planned day adds up to: the recipes' approximate figures, each at the person's
 * portion. It is the plan's total, not a record of what was eaten; the app never logs food.
 */
data class DayTotal(
    val calories: Int,
    val protein: Int,
    /** Planned meals that had figures. */
    val counted: Int,
    /** Planned meals without figures (some older recipes, eating out with nothing picked). */
    val uncounted: Int,
) {
    val isEmpty: Boolean get() = counted == 0
}

object DayTotals {

    /** One planned meal's figures per whole serving, and how much of a serving is eaten. */
    data class Meal(val calories: Int?, val protein: Int?, val share: Double = 1.0)

    fun meal(recipe: Recipe, portion: Double, slot: MealSlot): Meal =
        Meal(PlanBuilder.caloriesIn(recipe.nutritionText), PlanBuilder.proteinIn(recipe.nutritionText), Portions.forSlot(portion, slot))

    /** A skipped meal plans nothing; eating out counts when something with figures was picked. */
    fun meal(offPlan: OffPlanMeal): Meal? =
        if (offPlan.kind == OffPlanKind.SKIP) null else Meal(offPlan.calories, offPlan.protein)

    fun total(meals: List<Meal>): DayTotal {
        val counted = meals.filter { it.calories != null }
        return DayTotal(
            calories = counted.sumOf { it.calories!! * it.share }.roundToInt(),
            protein = counted.sumOf { (it.protein ?: 0) * it.share }.roundToInt(),
            counted = counted.size,
            uncounted = meals.size - counted.size,
        )
    }

    /** "About 1,480 cal, 118 g protein", rounded so it doesn't read as exact. */
    fun text(total: DayTotal): String {
        val rounded = (total.calories / 10.0).roundToInt() * 10
        val base = "About ${"%,d".format(rounded)} cal, ${total.protein} g protein"
        return when (total.uncounted) {
            0 -> base
            1 -> "$base, plus 1 meal without figures"
            else -> "$base, plus ${total.uncounted} meals without figures"
        }
    }

    fun guideText(targets: Targets): String = "about ${"%,d".format(targets.calories)} cal and ${targets.proteinGrams} g protein a day"

    /**
     * How far a set of days is from the guide; lower is closer. Calories count in both
     * directions, protein only when it falls short, since the guide's protein is a floor.
     */
    fun distance(days: Collection<DayTotal>, targets: Targets): Double = days.filter { !it.isEmpty }.sumOf { day ->
        abs(day.calories - targets.calories).toDouble() / targets.calories +
            0.5 * max(0, targets.proteinGrams - day.protein).toDouble() / targets.proteinGrams.coerceAtLeast(1)
    }
}
