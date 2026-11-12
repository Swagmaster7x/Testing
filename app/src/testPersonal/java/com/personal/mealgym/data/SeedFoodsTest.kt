package com.personal.mealgym.data

import com.personal.mealgym.data.seed.SeedParser
import com.personal.mealgym.domain.Cupboard
import com.personal.mealgym.domain.Foods
import com.personal.mealgym.domain.PlanBuilder
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/**
 * What the app says each built-in recipe contains. The expected values were checked by hand
 * against each ingredient list; a change to the detector or a recipe has to be reviewed here.
 */
class SeedFoodsTest {
    private val seed = SeedParser.parse(File("src/personal/assets/seed.json").readText())

    private val expected = mapOf(
        "B1" to "EGG,SOY,POULTRY",
        "B2" to "DAIRY,TREE_NUT,GLUTEN",
        "B3" to "EGG,FISH,SHELLFISH,GLUTEN,SOY,SESAME",
        "B4" to "DAIRY,TREE_NUT,GLUTEN",
        "L1" to "POULTRY",
        "L2" to "GLUTEN,SOY,SESAME,POULTRY",
        "L3" to "POULTRY",
        "L4" to "EGG,FISH,GLUTEN,SOY,SESAME",
        "D1" to "PORK",
        "D2" to "EGG,FISH,SHELLFISH,GLUTEN,SOY,POULTRY",
        "D3" to "FISH",
        "D4" to "FISH,SHELLFISH,GLUTEN,SOY,SESAME,BEEF",
        "D5" to "EGG,BEEF",
        "D6" to "BEEF",
        "D7" to "POULTRY",
        "S1" to "POULTRY",
        "S2" to "GLUTEN,SOY,SESAME,POULTRY",
        "S3" to "POULTRY",
        "S4" to "EGG,GLUTEN,SOY",
        "L5" to "BEEF",
        "L6" to "GLUTEN,SOY,SESAME,BEEF",
        "L7" to "PORK",
        "L8" to "FISH,GLUTEN,SOY,PORK",
        "D8" to "PORK",
        "D9" to "FISH,SHELLFISH,GLUTEN,SOY,SESAME,PORK",
        "D10" to "SHELLFISH,GLUTEN,SOY,SESAME,BEEF",
        "D11" to "BEEF",
        "SB1" to "DAIRY",
        "SB2" to "DAIRY,EGG,PORK",
        "SB3" to "DAIRY,EGG,GLUTEN",
        "SB4" to "EGG,GLUTEN,PORK",
        "SB5" to "DAIRY,EGG",
        "SN1" to "DAIRY",
        "SN2" to "DAIRY",
        "SN3" to "DAIRY",
        "SN4" to "BEEF",
        "B5" to "EGG,GLUTEN",
        "B6" to "DAIRY,TREE_NUT,GLUTEN",
        "B7" to "DAIRY,PEANUT,GLUTEN",
        "B8" to "DAIRY,EGG,GLUTEN,POULTRY",
        "B9" to "DAIRY,EGG,GLUTEN",
        "B10" to "EGG,FISH,GLUTEN",
        "B11" to "SOY",
        "L9" to "POULTRY",
        "L10" to "DAIRY,POULTRY",
        "L11" to "FISH,GLUTEN",
        "L12" to "DAIRY,POULTRY",
        "L13" to "DAIRY",
        "L14" to "DAIRY",
        "L15" to "DAIRY,GLUTEN,POULTRY",
        "L17" to "EGG,GLUTEN,SOY,SESAME",
        "L18" to "FISH,SHELLFISH,GLUTEN,SOY,SESAME",
        "D12" to "POULTRY",
        "D13" to "DAIRY,EGG,GLUTEN,POULTRY",
        "D14" to "FISH",
        "D15" to "DAIRY,FISH,SHELLFISH",
        "D16" to "DAIRY,BEEF",
        "D17" to "DAIRY,POULTRY",
        "D18" to "GLUTEN,SOY,SESAME",
        "D19" to "DAIRY,POULTRY",
        "D20" to "DAIRY,FISH",
        "D21" to "DAIRY,GLUTEN",
        "D22" to "EGG,POULTRY",
        "D23" to "DAIRY,EGG,GLUTEN",
        "S5" to "DAIRY,GLUTEN",
        "S6" to "POULTRY",
        "S7" to "DAIRY,GLUTEN",
        "SN5" to "SESAME",
        "SN6" to "PEANUT",
        "SN7" to "EGG",
        "SN8" to "DAIRY",
        "SN9" to "SOY",
    )

    @Test
    fun everyRecipeContainsWhatWasReviewed() {
        val found = seed.recipes.associate { r ->
            r.key to Foods.inRecipe(SeedParser.recipeOf(r), SeedParser.ingredientsOf(r, 1, emptySet()))
                .sortedBy { it.ordinal }.joinToString(",") { it.name }
        }
        assertEquals(expected.keys, found.keys)
        for ((key, flags) in expected) assertEquals(key, flags, found[key])
    }

    @Test
    fun everyIngredientChoiceCanBeSplitForTheCupboard() {
        val names = seed.recipes.flatMap { r -> r.ingredients.map { it.name } }.distinct()
        val unknown = names.filter { Cupboard.unknownChoice(it) }
        assertTrue("Add these to Cupboard.alternatives: $unknown", unknown.isEmpty())
    }

    @Test
    fun everyCookedRecipeHasCaloriesThePlanBuilderCanRead() {
        // The first four soups have no figures, and coffee-shop orders and the first four snacks only a rough guide.
        val without = seed.recipes.filter { PlanBuilder.caloriesIn(it.nutrition) == null }.map { it.key }
        assertEquals(listOf("S1", "S2", "S3", "S4", "SN1", "SN2", "SN3", "SN4"), without.filter { !it.startsWith("SB") })
        assertTrue(seed.recipes.filter { it.since == 3 }.all { PlanBuilder.proteinIn(it.nutrition) != null })
    }
}
