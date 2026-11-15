package com.personal.mealgym.domain

import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.OffPlanKind
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate
import kotlin.random.Random

class DayTotalsTest {
    private var nextId = 1L

    private fun recipe(type: MealType, calories: Int?, protein: Int? = null, tag: ProteinTag? = null) = Recipe(
        id = nextId++,
        name = "$type $calories",
        mealType = type,
        nutritionText = calories?.let { "~$it cal, ${protein ?: 30} g protein, 40 g carbs, 12 g fat" },
        protein = tag,
    )

    private fun out(calories: Int? = null, protein: Int? = null, kind: OffPlanKind = OffPlanKind.EATING_OUT) =
        OffPlanMeal(profileId = 1, date = "2026-11-09", slot = MealSlot.LUNCH, kind = kind, calories = calories, protein = protein)

    @Test
    fun aDayIsItsMealsAtThePersonsPortion() {
        val breakfast = recipe(MealType.BREAKFAST, 400, 30)
        val lunch = recipe(MealType.LUNCH, 600, 50)
        val dinner = recipe(MealType.DINNER, 640, 44)
        fun day(portion: Double) = DayTotals.total(
            listOf(
                DayTotals.meal(breakfast, portion, MealSlot.BREAKFAST),
                DayTotals.meal(lunch, portion, MealSlot.LUNCH),
                DayTotals.meal(dinner, portion, MealSlot.DINNER),
            ),
        )
        assertEquals(DayTotal(1640, 124, counted = 3, uncounted = 0), day(1.0))
        // Three-quarter portions apply to lunch and dinner; breakfast is a whole one.
        assertEquals(DayTotal(400 + 450 + 480, 30 + 38 + 33, 3, 0), day(0.75))
        assertEquals("About 1,640 cal, 124 g protein", DayTotals.text(day(1.0)))
        assertEquals("About 1,330 cal, 101 g protein", DayTotals.text(day(0.75)))
    }

    @Test
    fun mealsWithoutFiguresAreSaidNotGuessed() {
        val soup = recipe(MealType.SOUP, null)
        val lunch = recipe(MealType.LUNCH, 523, 41)
        val total = DayTotals.total(listOf(DayTotals.meal(soup, 1.0, MealSlot.DINNER), DayTotals.meal(lunch, 1.0, MealSlot.LUNCH)))
        assertEquals(DayTotal(523, 41, counted = 1, uncounted = 1), total)
        assertEquals("About 520 cal, 41 g protein, plus 1 meal without figures", DayTotals.text(total))
        assertTrue(DayTotals.total(listOf(DayTotals.meal(soup, 1.0, MealSlot.DINNER))).isEmpty)
        assertTrue(DayTotals.total(emptyList()).isEmpty)
    }

    @Test
    fun eatingOutCountsWhenSomethingWasPickedAndASkipPlansNothing() {
        val picked = DayTotals.meal(out(355, 28))!!
        assertEquals(DayTotals.Meal(355, 28, 1.0), picked)
        // Just "eating out": planned, but no figures.
        assertEquals(DayTotals.Meal(null, null, 1.0), DayTotals.meal(out()))
        assertEquals(DayTotals.Meal(null, null, 1.0), DayTotals.meal(out(kind = OffPlanKind.LEFTOVERS)))
        assertNull(DayTotals.meal(out(kind = OffPlanKind.SKIP)))
        val total = DayTotals.total(listOfNotNull(picked, DayTotals.meal(out()), DayTotals.meal(out(kind = OffPlanKind.SKIP))))
        assertEquals(DayTotal(355, 28, counted = 1, uncounted = 1), total)
    }

    @Test
    fun distanceCountsCaloriesBothWaysAndProteinOnlyWhenShort() {
        val guide = Targets(2000, 150)
        fun d(calories: Int, protein: Int) = DayTotals.distance(listOf(DayTotal(calories, protein, 3, 0)), guide)
        assertEquals(0.0, d(2000, 150), 1e-9)
        assertEquals(0.0, d(2000, 190), 1e-9)
        assertEquals(0.1, d(2200, 150), 1e-9)
        assertEquals(0.1, d(1800, 150), 1e-9)
        assertEquals(0.05, d(2000, 135), 1e-9)
        // Days with nothing counted don't pull the score either way.
        assertEquals(0.1, DayTotals.distance(listOf(DayTotal(1800, 150, 3, 0), DayTotal(0, 0, 0, 2)), guide), 1e-9)
        assertEquals("about 2,000 cal and 150 g protein a day", DayTotals.guideText(guide))
    }

    @Test
    fun fillingNearTheGuideKeepsTheRulesAndLandsCloser() {
        val mon = LocalDate.of(2026, 11, 9)
        val week = (0L until 7L).map { mon.plusDays(it) }
        val proteins = listOf(ProteinTag.BEEF, ProteinTag.CHICKEN, ProteinTag.FISH, ProteinTag.PORK, ProteinTag.VEGETARIAN)
        val breakfasts = listOf(250, 350, 450, 550, 650).map { recipe(MealType.BREAKFAST, it, 25) }
        val lunches = listOf(300, 420, 540, 660, 700).map { recipe(MealType.LUNCH, it, 40) }
        val dinners = listOf(320, 440, 560, 640, 700).mapIndexed { i, c -> recipe(MealType.DINNER, c, 45, proteins[i]) }
        val slots = listOf(MealSlot.BREAKFAST, MealSlot.LUNCH, MealSlot.DINNER)
        val empty = week.flatMap { d -> slots.map { SlotKey(d, it) } }
        fun candidates(slot: MealSlot) = when (slot) {
            MealSlot.BREAKFAST -> breakfasts
            MealSlot.LUNCH -> lunches
            else -> dinners
        }
        val guide = Targets(1500, 100)
        fun distance(picked: Map<SlotKey, Recipe>) = DayTotals.distance(
            week.map { d -> DayTotals.total(slots.mapNotNull { s -> picked[SlotKey(d, s)]?.let { DayTotals.meal(it, 1.0, s) } }) },
            guide,
        )

        var plain = 0.0
        var near = 0.0
        repeat(20) { seed ->
            val a = WeekFiller.fill(empty, emptyMap(), ::candidates, Random(seed))
            val b = WeekFiller.fillNear(empty, emptyMap(), ::candidates, ::distance, attempts = 60, random = Random(seed))
            assertEquals(21, b.size)
            // The dinner rule still holds: never the same protein two nights running.
            week.zipWithNext().forEach { (d1, d2) ->
                assertTrue(b.getValue(SlotKey(d1, MealSlot.DINNER)).protein != b.getValue(SlotKey(d2, MealSlot.DINNER)).protein)
            }
            assertTrue("never further from the guide than one plain fill", distance(b) <= distance(a) + 1e-9)
            plain += distance(a)
            near += distance(b)
        }
        // On average a plain fill is well off the guide; aiming for it roughly halves the gap or better.
        assertTrue("plain $plain, near $near", near < plain * 0.6)
    }

    @Test
    fun aFullerWeekBeatsACloserOne() {
        val mon = LocalDate.of(2026, 11, 9)
        val only = recipe(MealType.DINNER, 2000, 150, ProteinTag.BEEF)
        val empty = (0L until 3L).map { SlotKey(mon.plusDays(it), MealSlot.DINNER) }
        // With one recipe and the no-repeat rule, a fill leaves the middle night empty every time.
        val filled = WeekFiller.fillNear(empty, emptyMap(), { listOf(only) }, distance = { it.size.toDouble() }, attempts = 10, random = Random(1))
        assertEquals(2, filled.size)
    }
}
