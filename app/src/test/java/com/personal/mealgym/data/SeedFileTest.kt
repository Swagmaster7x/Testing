package com.personal.mealgym.data

import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.domain.Quantities
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** Checks the bundled seed file against the spec: 19 recipes, 4 workout days. */
class SeedFileTest {

    private val seed = SeedParser.parse(File("src/main/assets/seed.json").readText())

    private val firstRelease = seed.recipes.filter { it.since == 1 }
    private val swagDays = seed.workoutDays.filter { it.profile == "swag" }
    private val ashleyDays = seed.workoutDays.filter { it.profile == "ashley" }

    @Test
    fun hasAllNineteenRecipes() {
        val seed = seed.copy(recipes = firstRelease)
        assertEquals(19, seed.recipes.size)
        assertEquals(seed.recipes.size, seed.recipes.map { it.key }.toSet().size)
        val byType = seed.recipes.groupingBy { it.mealType }.eachCount()
        assertEquals(4, byType[MealType.BREAKFAST])
        assertEquals(4, byType[MealType.LUNCH])
        assertEquals(7, byType[MealType.DINNER])
        assertEquals(4, byType[MealType.SOUP])
    }

    @Test
    fun everyRecipeIsComplete() {
        assertEquals(seed.recipes.size, seed.recipes.map { it.key }.toSet().size)
        seed.recipes.forEach { r ->
            assertTrue("${r.key} name", r.name.isNotBlank())
            assertTrue("${r.key} servings", r.servings >= 1)
            assertTrue("${r.key} serving size", r.servingSize.isNotBlank())
            val orderOnly = r.cuisineTags == listOf("Starbucks")
            assertTrue("${r.key} ingredients", orderOnly || r.ingredients.isNotEmpty())
            assertTrue("${r.key} steps", orderOnly || r.mealType == MealType.SNACK || r.steps.isNotEmpty())
            assertTrue("${r.key} cuisine", r.cuisineTags.isNotEmpty())
            r.ingredients.forEach { i ->
                assertTrue("${r.key} ingredient name", i.name.isNotBlank())
                if (i.quantity != null) assertNotNull("${r.key} ${i.name} quantity '${i.quantity}'", Quantities.parse(i.quantity))
            }
        }
    }

    @Test
    fun soupsHaveNoNutritionTextAndMealsDo() {
        firstRelease.forEach { r ->
            if (r.mealType == MealType.SOUP) {
                assertEquals("${r.key} has no nutrition text", null, r.nutrition)
            } else {
                assertNotNull("${r.key} nutrition", r.nutrition)
            }
        }
    }

    @Test
    fun mealPrepRecipesMatchTheSpec() {
        val prep = firstRelease.filter { it.mealPrep }.map { it.key }.toSet()
        assertEquals(setOf("B2", "L1", "L2", "L3", "D6"), prep)
    }

    @Test
    fun fourWorkoutDaysWithTheRightExercises() {
        assertEquals(listOf(1, 2, 3, 4), swagDays.map { it.order })
        assertEquals(listOf("Upper Body", "Lower Body", "Upper Body", "Full Body"), swagDays.map { it.name })
        assertEquals(listOf(9, 7, 7, 8), swagDays.map { it.exercises.size })
        seed.workoutDays.flatMap { it.exercises }.forEach { e ->
            assertTrue(e.name, e.swaps.isNotEmpty())
            assertTrue(e.name, e.sets.toIntOrNull() != null)
            assertTrue(e.name, e.group.length == 1)
        }
        assertEquals("Barbell bench press", seed.workoutDays[0].exercises.first().name)
        assertEquals("Smith machine bench", seed.workoutDays[0].exercises.first().swaps.first())
    }

    @Test
    fun staplesAndReferenceLists() {
        assertEquals(20, seed.pantryStaples.size)
        assertTrue("salt" in seed.pantryStaples)
        assertEquals(29, seed.freeVolumeFoods.size)
        assertTrue(seed.gymTips.any { it.startsWith("Rest 2 to 3 minutes") })
    }

    @Test
    fun ashleysThreeGymDays() {
        assertEquals(listOf(1, 2, 3), ashleyDays.map { it.order })
        assertEquals(listOf("Glutes + hams", "Upper", "Glutes + quads"), ashleyDays.map { it.shortName })
        assertEquals(listOf(5, 6, 5), ashleyDays.map { it.exercises.size })
        assertEquals("Hip thrust", ashleyDays[0].exercises.first().name)
        assertEquals("Smith machine hip thrust", ashleyDays[0].exercises.first().swaps.first())
        assertEquals(5, seed.gymTipsAshley.size)
    }

    @Test
    fun ashleysBreakfastsSnacksAndTips() {
        val hers = seed.recipes.filter { it.onlyFor == "ashley" }
        assertEquals(5, hers.count { it.mealType == MealType.BREAKFAST })
        assertEquals(4, hers.count { it.mealType == MealType.SNACK })
        assertTrue(hers.filter { it.mealType == MealType.BREAKFAST }.all { it.steps.isEmpty() && it.ingredients.isEmpty() })
        assertEquals(4, seed.easierToFinishTips.size)
        assertEquals(listOf("Protein", "Calories", "Carbs", "Fats", "Water"), seed.dailyGuide.map { it.label })
    }
}
