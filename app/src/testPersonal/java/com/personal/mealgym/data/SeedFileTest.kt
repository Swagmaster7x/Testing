package com.personal.mealgym.data

import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.domain.Quantities
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** Checks the bundled seed file against the spec: 19 recipes, 4 workout days. */
class SeedFileTest {

    private val seed = SeedParser.parse(File("src/personal/assets/seed.json").readText())

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
    fun versionThreeAddsThirtySixRecipes() {
        val added = seed.recipes.filter { it.since == 3 }
        assertEquals(36, added.size)
        assertEquals(72, seed.recipes.count { it.since <= 3 })
        val byType = added.groupingBy { it.mealType }.eachCount()
        assertEquals(7, byType[MealType.BREAKFAST])
        assertEquals(9, byType[MealType.LUNCH])
        assertEquals(12, byType[MealType.DINNER])
        assertEquals(3, byType[MealType.SOUP])
        assertEquals(5, byType[MealType.SNACK])
        // Every cooked recipe says how hot the meat or fish has to get.
        val meat = added.filter { it.protein!!.name in setOf("CHICKEN", "TURKEY", "BEEF") && it.mealType != MealType.SNACK }
        assertTrue(meat.all { r -> r.steps.any { "°F" in it } })
        assertTrue(added.all { it.steps.isNotEmpty() && it.ingredients.isNotEmpty() && it.nutrition!!.startsWith("~") })
    }

    @Test
    fun versionFourAddsTheWorldAndTheRestaurantFavorites() {
        assertEquals(4, seed.version)
        val added = seed.recipes.filter { it.since == 4 }
        assertEquals(186, seed.recipes.size)
        assertEquals(114, added.size)
        assertEquals(100, added.count { it.key.startsWith("W") })
        assertEquals(14, added.count { it.key.startsWith("CC") })
        val byType = added.groupingBy { it.mealType }.eachCount()
        assertEquals(22, byType[MealType.BREAKFAST])
        assertEquals(30, byType[MealType.LUNCH])
        assertEquals(42, byType[MealType.DINNER])
        assertEquals(13, byType[MealType.SOUP])
        assertEquals(7, byType[MealType.SNACK])
        // Every part of the world is there, under tags the filters already use.
        val tags = added.flatMap { it.cuisineTags }.groupingBy { it }.eachCount()
        for (tag in listOf("Asian", "Indian", "Mediterranean", "Middle Eastern", "African", "European", "Italian", "Hispanic", "Latin American", "Caribbean", "American")) {
            assertTrue(tag, (tags[tag] ?: 0) >= 2)
        }
        // Each has one cuisine, or one cuisine and the Copycat tag.
        assertTrue(added.all { r -> r.cuisineTags.filter { it != RestaurantRepository.COPYCAT_TAG }.size == 1 })
        // Snacks stay on Ashley's side, like the earlier ones.
        assertTrue(added.filter { it.mealType == MealType.SNACK }.all { it.onlyFor == "ashley" })
        assertTrue(added.filter { it.mealType != MealType.SNACK }.all { it.onlyFor == null })
        assertTrue(added.all { it.steps.isNotEmpty() && it.ingredients.isNotEmpty() && it.nutrition!!.startsWith("~") && it.protein != null })
        // Raw meat and poultry say how hot they have to get.
        val meat = added.filter { it.protein!!.name in setOf("CHICKEN", "TURKEY", "BEEF", "PORK") && it.key != "CC5" }
        assertTrue(meat.all { r -> r.steps.any { "°F" in it } })
        // A swap never shows two amounts: its own, or the original's.
        for (r in seed.recipes) for (s in r.swaps) {
            assertTrue("${r.key} ${s.label}", s.with == null || s.with!!.none { it.isDigit() } || s.with!![0].isDigit())
        }
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
        assertEquals(5, seed.template("glute-3")!!.tips.size)
        assertEquals(listOf("swag", "ashley"), seed.profiles.map { it.key })
        assertEquals(seed.gymTips, seed.template("upper-lower-4")!!.tips.ifEmpty { seed.gymTips })
    }

    @Test
    fun ashleysBreakfastsSnacksAndTips() {
        val hers = seed.recipes.filter { it.onlyFor == "ashley" }
        assertEquals(5, hers.count { it.mealType == MealType.BREAKFAST })
        assertEquals(4 + 5 + 7, hers.count { it.mealType == MealType.SNACK })
        assertTrue(hers.filter { it.mealType == MealType.BREAKFAST }.all { it.steps.isEmpty() && it.ingredients.isEmpty() })
        assertEquals(4, seed.easierToFinishTips.size)
        assertEquals(listOf("Protein", "Calories", "Carbs", "Fats", "Water"), seed.dailyGuide.map { it.label })
    }

    @Test
    fun everyRecipeHasAProteinAndSwapsMakeSense() {
        assertTrue(seed.recipes.all { it.protein != null })
        val byKey = seed.recipes.associateBy { it.key }
        assertEquals(
            setOf("L1", "L2", "D2", "D7", "S1", "S2", "S3"),
            seed.recipes.filter { it.since < 3 && it.swaps.isNotEmpty() }.map { it.key }.toSet(),
        )
        assertEquals(setOf("L9", "L10", "L17", "L18", "D15", "D16"), seed.recipes.filter { it.since == 3 && it.swaps.isNotEmpty() }.map { it.key }.toSet())
        for (r in seed.recipes) for (swap in r.swaps) {
            if (swap.useRecipeKey != null) {
                assertNotNull("${r.key} points at ${swap.useRecipeKey}", byKey[swap.useRecipeKey])
            } else {
                assertTrue(
                    "${r.key}: '${swap.replace}' must be one of its ingredients",
                    r.ingredients.any { com.personal.mealgym.domain.ShoppingList.ingredientKey(it.name) == com.personal.mealgym.domain.ShoppingList.ingredientKey(swap.replace!!) },
                )
                assertNotEquals(r.protein, swap.protein)
            }
        }
    }

    @Test
    fun eightNewBeefAndPorkRecipes() {
        val added = listOf("L5", "L6", "L7", "L8", "D8", "D9", "D10", "D11").map { k -> seed.recipes.single { it.key == k } }
        assertTrue(added.all { it.protein == com.personal.mealgym.data.db.ProteinTag.BEEF || it.protein == com.personal.mealgym.data.db.ProteinTag.PORK })
        assertTrue(added.all { it.steps.size >= 5 && it.ingredients.size >= 10 && it.nutrition != null })
        assertEquals(
            listOf("gochugaru", "achiote paste", "lemongrass paste", "chipotles in adobo", "canned pigeon peas"),
            seed.extraPantryStaples.take(5),
        )
        // Version 3 adds everyday spices.
        assertEquals(listOf("black pepper", "chili powder", "paprika", "garlic powder", "Italian seasoning", "cinnamon"), seed.extraPantryStaples.drop(5).take(6))
        // Version 4 adds kitchen basics; spices for one cuisine stay on the shopping list.
        assertEquals(listOf("oil", "sugar", "thyme", "red pepper flakes", "cayenne", "cooking spray"), seed.extraPantryStaples.drop(11))
        // New staples match the recipe ingredients they are meant to cover.
        val all = seed.recipes.flatMap { it.ingredients }.map { it.name }
        for (staple in seed.extraPantryStaples) {
            assertTrue(staple, all.any { com.personal.mealgym.domain.ShoppingList.isAlwaysHave(it, setOf(staple)) })
        }
    }

    @Test
    fun everyHomeVersionOnTheRestaurantListIsInTheLibrary() {
        val recipes = seed.recipes.associateBy { it.key }
        val places = RestaurantRepository.parse(File("src/main/assets/restaurants.json").readText()).restaurants
        val linked = places.flatMap { p -> p.copycats.map { it.recipe } }.toSet()
        for (key in linked) assertTrue(key, key in recipes)
        // Recipes written as home versions are tagged, and every tagged one says what it is like.
        val tagged = seed.recipes.filter { RestaurantRepository.COPYCAT_TAG in it.cuisineTags }.map { it.key }.toSet()
        assertEquals(tagged, linked.filter { it.startsWith("CC") }.toSet())
        assertEquals(14, tagged.size)
    }
}
