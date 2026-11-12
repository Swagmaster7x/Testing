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
        // Version 4: dishes from around the world, then home versions of restaurant favorites.
        "W1" to "EGG,GLUTEN,SOY,SESAME,POULTRY",
        "W2" to "EGG,GLUTEN",
        "W3" to "EGG,GLUTEN,SOY",
        "W4" to "FISH,SOY",
        "W5" to "EGG,GLUTEN,SOY",
        "W6" to "DAIRY,PEANUT,GLUTEN",
        "W7" to "FISH,PEANUT,POULTRY",
        "W8" to "DAIRY",
        "W9" to "",
        "W10" to "EGG,GLUTEN,SOY,SESAME",
        "W11" to "FISH,POULTRY",
        "W12" to "EGG,PEANUT,GLUTEN,SOY",
        "W13" to "PEANUT,GLUTEN,SOY,SESAME,POULTRY",
        "W14" to "FISH,PEANUT",
        "W15" to "GLUTEN,SOY,SESAME",
        "W16" to "GLUTEN,SOY,POULTRY",
        "W17" to "PEANUT,GLUTEN,SOY,SESAME,POULTRY",
        "W18" to "PEANUT,GLUTEN,SOY,POULTRY",
        "W19" to "GLUTEN,SOY,SESAME,POULTRY",
        "W20" to "DAIRY,GLUTEN,BEEF",
        "W21" to "FISH,SHELLFISH,GLUTEN,SOY,BEEF",
        "W22" to "GLUTEN,SOY,SESAME,PORK",
        "W23" to "FISH,GLUTEN,SOY,SESAME",
        "W24" to "EGG,FISH,SHELLFISH,PEANUT",
        "W25" to "FISH",
        "W26" to "DAIRY",
        "W27" to "EGG",
        "W28" to "FISH,POULTRY",
        "W29" to "FISH,SHELLFISH,POULTRY",
        "W30" to "FISH,SHELLFISH,GLUTEN,SOY,SESAME,PORK,POULTRY",
        "W31" to "EGG,GLUTEN,SOY,SESAME",
        "W32" to "DAIRY",
        "W33" to "",
        "W34" to "EGG,FISH",
        "W35" to "DAIRY,EGG,GLUTEN",
        "W36" to "DAIRY,TREE_NUT,GLUTEN,SESAME",
        "W37" to "DAIRY,TREE_NUT,GLUTEN",
        "W38" to "EGG,PORK",
        "W39" to "DAIRY,EGG,FISH",
        "W40" to "DAIRY,EGG,TREE_NUT,GLUTEN",
        "W41" to "DAIRY,GLUTEN,POULTRY",
        "W42" to "EGG,FISH",
        "W43" to "GLUTEN",
        "W44" to "EGG,GLUTEN,SESAME",
        "W45" to "DAIRY,TREE_NUT",
        "W46" to "POULTRY",
        "W47" to "",
        "W48" to "DAIRY,EGG,FISH,SHELLFISH,GLUTEN",
        "W49" to "DAIRY,GLUTEN,BEEF",
        "W50" to "DAIRY,POULTRY",
        "W51" to "FISH,TREE_NUT,GLUTEN",
        "W52" to "EGG,GLUTEN",
        "W53" to "PORK,POULTRY",
        "W54" to "DAIRY,EGG,GLUTEN,POULTRY",
        "W55" to "DAIRY,EGG,BEEF",
        "W56" to "FISH,TREE_NUT,SESAME",
        "W57" to "GLUTEN,SESAME",
        "W58" to "DAIRY,EGG,TREE_NUT,GLUTEN,BEEF",
        "W59" to "POULTRY",
        "W60" to "",
        "W61" to "GLUTEN,POULTRY",
        "W62" to "DAIRY,FISH,GLUTEN",
        "W63" to "POULTRY",
        "W64" to "GLUTEN",
        "W65" to "PEANUT,POULTRY",
        "W66" to "DAIRY,GLUTEN,SESAME",
        "W67" to "PEANUT",
        "W68" to "DAIRY,EGG",
        "W69" to "EGG",
        "W70" to "EGG",
        "W71" to "DAIRY,EGG",
        "W72" to "DAIRY,FISH,SHELLFISH",
        "W73" to "EGG,GLUTEN,SOY,BEEF",
        "W74" to "POULTRY",
        "W75" to "POULTRY",
        "W76" to "",
        "W77" to "DAIRY",
        "W78" to "DAIRY",
        "W79" to "FISH,SHELLFISH",
        "W80" to "GLUTEN,POULTRY",
        "W81" to "DAIRY,GLUTEN,PORK",
        "W82" to "DAIRY,EGG,POULTRY",
        "W83" to "GLUTEN,SOY,BEEF",
        "W84" to "BEEF",
        "W85" to "DAIRY,EGG,BEEF",
        "W86" to "FISH",
        "W87" to "FISH",
        "W88" to "FISH,SHELLFISH",
        "W89" to "GLUTEN,SOY,POULTRY",
        "W90" to "PORK,POULTRY",
        "W91" to "SESAME,POULTRY",
        "W92" to "PORK",
        "W93" to "POULTRY",
        "W94" to "",
        "W95" to "GLUTEN,BEEF",
        "W96" to "DAIRY",
        "W97" to "DAIRY,FISH,GLUTEN",
        "W98" to "GLUTEN,PORK",
        "W99" to "DAIRY,EGG",
        "W100" to "DAIRY,GLUTEN",
        "CC1" to "DAIRY,EGG,GLUTEN,PORK",
        "CC2" to "DAIRY,POULTRY",
        "CC3" to "EGG,GLUTEN,POULTRY",
        "CC4" to "SOY",
        "CC5" to "DAIRY,GLUTEN,POULTRY",
        "CC6" to "DAIRY,GLUTEN,BEEF",
        "CC7" to "DAIRY,EGG,GLUTEN",
        "CC8" to "DAIRY,EGG,GLUTEN",
        "CC9" to "DAIRY,GLUTEN",
        "CC10" to "SHELLFISH,GLUTEN,SOY,SESAME,POULTRY",
        "CC11" to "GLUTEN,SOY,SESAME,POULTRY",
        "CC12" to "DAIRY,EGG,GLUTEN,POULTRY",
        "CC13" to "POULTRY",
        "CC14" to "DAIRY,EGG,POULTRY",
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
        assertTrue(seed.recipes.filter { it.since >= 3 }.all { PlanBuilder.proteinIn(it.nutrition) != null })
    }
}
