package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import com.personal.mealgym.data.db.StoreSection.CARBS
import com.personal.mealgym.data.db.StoreSection.PANTRY
import com.personal.mealgym.data.db.StoreSection.PRODUCE_FROZEN
import com.personal.mealgym.data.db.StoreSection.PROTEIN
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class ShoppingListTest {

    private var nextId = 1L

    private fun recipe(name: String, servings: Int, vararg ingredients: Ing): Pair<Recipe, List<Ingredient>> {
        val id = nextId++
        val r = Recipe(id = id, name = name, mealType = MealType.LUNCH, servings = servings)
        val list = ingredients.mapIndexed { i, ing ->
            Ingredient(
                id = id * 100 + i,
                recipeId = id,
                position = i,
                name = ing.name,
                quantity = ing.qty,
                unit = ing.unit,
                storeSection = ing.section,
            )
        }
        return r to list
    }

    private data class Ing(val qty: Double?, val unit: String?, val name: String, val section: StoreSection)

    private fun planned(r: Pair<Recipe, List<Ingredient>>, slots: Int) = PlannedRecipe(r.first, r.second, slots)

    private fun ShoppingResult.item(name: String): ShoppingItem? =
        sections.flatMap { it.items }.firstOrNull { it.key == ShoppingList.ingredientKey(name) }

    @Test
    fun sameIngredientAcrossRecipesIsCombined() {
        val guisado = recipe("Pollo guisado", 4, Ing(2.0, "lb", "chicken thighs", PROTEIN))
        val sancocho = recipe("Sancocho", 6, Ing(2.0, "lb", "chicken thighs", PROTEIN))

        val result = ShoppingList.build(listOf(planned(guisado, 1), planned(sancocho, 1)), emptySet())

        val item = result.item("chicken thighs")!!
        assertEquals("4 lb", item.amountText)
        assertEquals(listOf("Pollo guisado", "Sancocho"), item.recipeNames)
    }

    @Test
    fun mealPrepThatFillsFourSlotsIsBoughtOnce() {
        val guisado = recipe("Pollo guisado", 4, Ing(2.0, "lb", "chicken thighs", PROTEIN))

        val four = ShoppingList.build(listOf(planned(guisado, 4)), emptySet())
        assertEquals("2 lb", four.item("chicken thighs")!!.amountText)

        // A fifth slot means cooking it a second time.
        val five = ShoppingList.build(listOf(planned(guisado, 5)), emptySet())
        assertEquals("4 lb", five.item("chicken thighs")!!.amountText)
    }

    @Test
    fun singleServingRecipeScalesWithEverySlot() {
        val oats = recipe("Overnight oats", 1, Ing(0.5, "cup", "rolled oats", CARBS))

        val result = ShoppingList.build(listOf(planned(oats, 4)), emptySet())

        assertEquals("2 cups", result.item("rolled oats")!!.amountText)
    }

    @Test
    fun batchesNeeded() {
        assertEquals(0, ShoppingList.batchesNeeded(0, 4))
        assertEquals(1, ShoppingList.batchesNeeded(1, 4))
        assertEquals(1, ShoppingList.batchesNeeded(4, 4))
        assertEquals(2, ShoppingList.batchesNeeded(5, 4))
        assertEquals(3, ShoppingList.batchesNeeded(3, 1))
        assertEquals(2, ShoppingList.batchesNeeded(2, 0))
    }

    @Test
    fun alwaysHaveItemsAreLeftOffAndReported() {
        val bowl = recipe(
            "Teriyaki bowl",
            4,
            Ing(2.0, "lb", "chicken breast", PROTEIN),
            Ing(0.5, "cup", "low-sodium soy sauce", PANTRY),
            Ing(1.0, "tsp", "soy sauce", PANTRY),
            Ing(1.0, "tsp", "oil", PANTRY),
            Ing(1.0, "tbsp", "rice vinegar", PANTRY),
            Ing(null, null, "sesame seeds", PANTRY),
        )
        val staples = setOf("low-sodium soy sauce", "olive oil", "rice vinegar")

        val result = ShoppingList.build(listOf(planned(bowl, 1)), staples)

        assertNull(result.item("low-sodium soy sauce"))
        assertNull("plain soy sauce is covered by the low-sodium staple", result.item("soy sauce"))
        assertNull("generic oil is covered by olive oil", result.item("oil"))
        assertNull(result.item("rice vinegar"))
        assertTrue(result.item("sesame seeds") != null)
        assertTrue(result.item("chicken breast") != null)
        assertEquals(listOf("low-sodium soy sauce", "oil", "rice vinegar", "soy sauce"), result.skippedAlwaysHave)
    }

    @Test
    fun alwaysHaveMatchingIsWholeWordOnly() {
        assertTrue(ShoppingList.isAlwaysHave("Olive Oil", setOf("olive oil")))
        assertTrue(ShoppingList.isAlwaysHave("Bay Leaves", setOf("bay leaves")))
        assertTrue(ShoppingList.isAlwaysHave("pinch of salt", setOf("salt")))
        assertFalse(ShoppingList.isAlwaysHave("tomato sauce", setOf("hot sauce")))
        assertFalse(ShoppingList.isAlwaysHave("sesame seeds", setOf("sesame oil")))
        assertFalse(ShoppingList.isAlwaysHave("brown sugar", setOf("sugar snap peas")))
        assertFalse(ShoppingList.isAlwaysHave("", setOf("salt")))
    }

    @Test
    fun sectionsComeInStoreOrder() {
        val r = recipe(
            "Everything",
            1,
            Ing(1.0, "tbsp", "honey", PANTRY),
            Ing(1.0, "cup", "cooked rice", CARBS),
            Ing(1.0, null, "onion", PRODUCE_FROZEN),
            Ing(2.0, null, "eggs", PROTEIN),
        )

        val result = ShoppingList.build(listOf(planned(r, 1)), emptySet())

        assertEquals(listOf(PROTEIN, PRODUCE_FROZEN, CARBS, PANTRY), result.sections.map { it.section })
    }

    @Test
    fun itemsWithinASectionAreAlphabetical() {
        val r = recipe(
            "Veg",
            1,
            Ing(1.0, null, "zucchini", PRODUCE_FROZEN),
            Ing(1.0, null, "Bell pepper", PRODUCE_FROZEN),
            Ing(1.0, null, "lime", PRODUCE_FROZEN),
        )

        val result = ShoppingList.build(listOf(planned(r, 1)), emptySet())

        assertEquals(listOf("Bell pepper", "Lime", "Zucchini"), result.sections.single().items.map { it.name })
    }

    @Test
    fun unitsAreNormalisedBeforeAdding() {
        val a = recipe("A", 1, Ing(1.0, "cup", "liquid egg whites", PROTEIN))
        val b = recipe("B", 1, Ing(0.5, "Cups", "liquid egg whites", PROTEIN))
        val c = recipe("C", 1, Ing(1.5, "cups", "Liquid egg whites", PROTEIN))

        val result = ShoppingList.build(listOf(planned(a, 1), planned(b, 1), planned(c, 1)), emptySet())

        assertEquals("3 cups", result.item("liquid egg whites")!!.amountText)
    }

    @Test
    fun differentUnitsAreListedSideBySide() {
        val a = recipe("A", 4, Ing(1.0 / 3, "cup", "olives", PANTRY))
        val b = recipe("B", 4, Ing(null, "handful of", "olives", PANTRY))

        val result = ShoppingList.build(listOf(planned(a, 1), planned(b, 1)), emptySet())

        assertEquals("1/3 cup + handful", result.item("olives")!!.amountText)
    }

    @Test
    fun ouncesFoldIntoPounds() {
        val a = recipe("A", 4, Ing(2.0, "lb", "chicken breast", PROTEIN))
        val b = recipe("B", 1, Ing(8.0, "oz", "chicken breast", PROTEIN))

        val result = ShoppingList.build(listOf(planned(a, 1), planned(b, 1)), emptySet())

        assertEquals("2 1/2 lb", result.item("chicken breast")!!.amountText)
    }

    @Test
    fun ouncesAloneStayInOunces() {
        val a = recipe("A", 1, Ing(7.0, "oz", "ground beef", PROTEIN))

        val result = ShoppingList.build(listOf(planned(a, 2)), emptySet())

        assertEquals("14 oz", result.item("ground beef")!!.amountText)
    }

    @Test
    fun countedItemsCombineAcrossSingularAndPlural() {
        val a = recipe("A", 4, Ing(4.0, null, "garlic cloves", PRODUCE_FROZEN), Ing(1.0, null, "onion", PRODUCE_FROZEN))
        val b = recipe("B", 6, Ing(6.0, null, "garlic cloves", PRODUCE_FROZEN), Ing(2.0, null, "onions", PRODUCE_FROZEN))

        val result = ShoppingList.build(listOf(planned(a, 1), planned(b, 1)), emptySet())

        assertEquals("10", result.item("garlic cloves")!!.amountText)
        assertEquals("3", result.item("onion")!!.amountText)
    }

    @Test
    fun itemsWithoutAQuantityStillAppearOnce() {
        val a = recipe("Tacos", 1, Ing(null, null, "cilantro", PRODUCE_FROZEN))
        val b = recipe("Salsa", 4, Ing(null, null, "cilantro", PRODUCE_FROZEN))

        val result = ShoppingList.build(listOf(planned(a, 2), planned(b, 1)), emptySet())

        val item = result.item("cilantro")!!
        assertEquals("", item.amountText)
        assertEquals(listOf("Tacos", "Salsa"), item.recipeNames)
    }

    @Test
    fun nothingPlannedMeansAnEmptyList() {
        val result = ShoppingList.build(emptyList(), setOf("salt"))
        assertTrue(result.isEmpty)
    }

    @Test
    fun ingredientKeys() {
        assertEquals("garlic clove", ShoppingList.ingredientKey("Garlic  Cloves"))
        assertEquals("sweet potato", ShoppingList.ingredientKey("sweet potatoes"))
        assertEquals("mixed berry", ShoppingList.ingredientKey("mixed berries"))
        assertEquals("asparagus", ShoppingList.ingredientKey("asparagus"))
        assertEquals("egg", ShoppingList.ingredientKey("eggs"))
        assertEquals("zucchini", ShoppingList.ingredientKey("zucchini"))
    }

    @Test
    fun unitNormalisation() {
        assertEquals("cup", ShoppingList.normalizeUnit("Cups"))
        assertEquals("bag", ShoppingList.normalizeUnit("large bag"))
        assertEquals("handful", ShoppingList.normalizeUnit("big handfuls"))
        assertEquals("pinch", ShoppingList.normalizeUnit("pinch of"))
        assertEquals("lb", ShoppingList.normalizeUnit("pounds"))
        assertEquals("tbsp", ShoppingList.normalizeUnit("tablespoons"))
        assertEquals("pouch", ShoppingList.normalizeUnit("pouches"))
        assertNull(ShoppingList.normalizeUnit("  "))
        assertNull(ShoppingList.normalizeUnit(null))
    }
}
