package com.personal.mealgym.domain

import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate
import kotlin.random.Random

class WeekFillerTest {

    private val mon = LocalDate.of(2026, 11, 9)
    private val week = (0L until 7L).map { mon.plusDays(it) }
    private var nextId = 1L

    private fun recipe(type: MealType, protein: ProteinTag?, mealPrep: Boolean = false, servings: Int = 4, cuisine: String = "Asian") =
        Recipe(id = nextId++, name = "$type $protein", mealType = type, protein = protein, isMealPrep = mealPrep, servings = servings, cuisineTags = listOf(cuisine))

    private val dinners = listOf(
        recipe(MealType.DINNER, ProteinTag.BEEF),
        recipe(MealType.DINNER, ProteinTag.PORK),
        recipe(MealType.DINNER, ProteinTag.CHICKEN),
        recipe(MealType.DINNER, ProteinTag.FISH),
    )

    @Test
    fun neverTheSameProteinTwoDinnersInARow() {
        repeat(200) { seed ->
            val filled = WeekFiller.fill(
                emptySlots = week.map { SlotKey(it, MealSlot.DINNER) },
                existing = emptyMap(),
                candidatesFor = { dinners },
                random = Random(seed),
            )
            assertEquals(7, filled.size)
            week.zipWithNext().forEach { (a, b) ->
                assertNotEquals("seed $seed: $a and $b", filled.getValue(SlotKey(a, MealSlot.DINNER)).protein, filled.getValue(SlotKey(b, MealSlot.DINNER)).protein)
            }
        }
    }

    @Test
    fun respectsDinnersAlreadyPlannedEitherSide() {
        val beef = dinners[0]
        val existing = mapOf(SlotKey(week[0], MealSlot.DINNER) to beef, SlotKey(week[2], MealSlot.DINNER) to beef)
        repeat(50) { seed ->
            val filled = WeekFiller.fill(listOf(SlotKey(week[1], MealSlot.DINNER)), existing, { dinners }, Random(seed))
            assertNotEquals(ProteinTag.BEEF, filled.getValue(SlotKey(week[1], MealSlot.DINNER)).protein)
        }
    }

    @Test
    fun leavesASlotEmptyRatherThanRepeatAProtein() {
        val onlyBeef = listOf(dinners[0])
        val filled = WeekFiller.fill(week.take(3).map { SlotKey(it, MealSlot.DINNER) }, emptyMap(), { onlyBeef }, Random(1))
        assertEquals(setOf(week[0], week[2]), filled.keys.map { it.date }.toSet())
    }

    @Test
    fun aMealPrepLunchFillsItsBatch() {
        val prep = recipe(MealType.LUNCH, ProteinTag.CHICKEN, mealPrep = true, servings = 4)
        val filled = WeekFiller.fill(week.map { SlotKey(it, MealSlot.LUNCH) }, emptyMap(), { listOf(prep) }, Random(3))
        assertEquals(7, filled.size)
        assertTrue(filled.values.all { it == prep })
    }

    @Test
    fun neverOverwritesPlannedMeals() {
        val planned = mapOf(SlotKey(week[0], MealSlot.DINNER) to dinners[1])
        val empty = week.drop(1).map { SlotKey(it, MealSlot.DINNER) }
        val filled = WeekFiller.fill(empty, planned, { dinners }, Random(9))
        assertFalse(SlotKey(week[0], MealSlot.DINNER) in filled)
    }

    @Test
    fun filters() {
        val chicken = recipe(MealType.DINNER, ProteinTag.CHICKEN, cuisine = "Caribbean")
        val beef = recipe(MealType.DINNER, ProteinTag.BEEF, cuisine = "Asian")
        assertFalse(WeekFiller.matches(chicken, LibraryFilter(notChicken = true)))
        assertTrue(WeekFiller.matches(beef, LibraryFilter(notChicken = true)))
        assertTrue(WeekFiller.matches(chicken, LibraryFilter(cuisine = "Caribbean")))
        assertFalse(WeekFiller.matches(beef, LibraryFilter(cuisine = "Caribbean")))
        assertTrue(WeekFiller.matches(beef, LibraryFilter(protein = ProteinTag.BEEF)))
        assertFalse(WeekFiller.matches(chicken, LibraryFilter(protein = ProteinTag.BEEF)))
    }
}
