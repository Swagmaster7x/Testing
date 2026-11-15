package com.personal.mealgym.domain

import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import java.time.LocalDate
import kotlin.random.Random

data class SlotKey(val date: LocalDate, val slot: MealSlot)

/**
 * "Fill my week": puts a random recipe from the current filters in each empty slot.
 * Two dinners in a row never share a protein, and a meal-prep breakfast or lunch fills the
 * following empty slots of the same meal, as one cook would.
 */
object WeekFiller {

    fun fill(
        emptySlots: List<SlotKey>,
        existing: Map<SlotKey, Recipe>,
        candidatesFor: (MealSlot) -> List<Recipe>,
        random: Random = Random.Default,
    ): Map<SlotKey, Recipe> {
        val result = LinkedHashMap<SlotKey, Recipe>()
        val ordered = emptySlots.sortedWith(compareBy<SlotKey> { it.date }.thenBy { it.slot.ordinal })
        fun planned(key: SlotKey) = result[key] ?: existing[key]

        for (key in ordered) {
            if (key in result) continue
            var options = candidatesFor(key.slot)
            if (key.slot == MealSlot.DINNER) {
                val neighbours = setOfNotNull(
                    planned(SlotKey(key.date.minusDays(1), MealSlot.DINNER))?.protein,
                    planned(SlotKey(key.date.plusDays(1), MealSlot.DINNER))?.protein,
                )
                options = options.filter { it.protein == null || it.protein !in neighbours }
            }
            if (options.isEmpty()) continue
            val pick = options[random.nextInt(options.size)]
            result[key] = pick

            // One meal-prep cook covers the next empty breakfasts or lunches too (never dinners,
            // which would put the same protein on back-to-back nights).
            if (pick.isMealPrep && key.slot != MealSlot.DINNER) {
                ordered.filter { it.slot == key.slot && it.date.isAfter(key.date) && it !in result }
                    .take(pick.slotsPerCook - 1)
                    .forEach { result[it] = pick }
            }
        }
        return result
    }

    /**
     * Fills the week several ways and keeps the one [distance] likes best (the closest to the
     * person's calorie and protein guide). Every attempt follows the same rules as [fill], so
     * nothing is traded away to hit a number.
     */
    fun fillNear(
        emptySlots: List<SlotKey>,
        existing: Map<SlotKey, Recipe>,
        candidatesFor: (MealSlot) -> List<Recipe>,
        distance: (Map<SlotKey, Recipe>) -> Double,
        attempts: Int = 60,
        random: Random = Random.Default,
    ): Map<SlotKey, Recipe> {
        var best = fill(emptySlots, existing, candidatesFor, random)
        var bestDistance = distance(best)
        repeat(attempts - 1) {
            val next = fill(emptySlots, existing, candidatesFor, random)
            val d = distance(next)
            // Never swap a fuller week for an emptier one that happens to score lower.
            if (next.size > best.size || (next.size == best.size && d < bestDistance)) {
                best = next
                bestDistance = d
            }
        }
        return best
    }

    /** Whether a recipe passes the side's library filters. */
    fun matches(recipe: Recipe, filter: LibraryFilter): Boolean =
        (filter.protein == null || recipe.protein == filter.protein) &&
            (filter.cuisine == null || filter.cuisine in recipe.cuisineTags) &&
            !(filter.notChicken && recipe.protein == ProteinTag.CHICKEN)
}
