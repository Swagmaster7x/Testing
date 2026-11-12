package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class CupboardTest {

    @Test
    fun namesBoilDownToThePlainFood() {
        assertEquals("soy sauce", Cupboard.key("low-sodium soy sauce"))
        assertEquals("broccoli", Cupboard.key("frozen broccoli"))
        assertEquals("rice", Cupboard.key("cooked jasmine rice"))
        assertEquals("ground turkey", Cupboard.key("93% lean ground turkey"))
        assertEquals("greek yogurt", Cupboard.key("nonfat Greek yogurt"))
        assertEquals("greek yogurt", Cupboard.key("Greek yogurt cup"))
        assertEquals("garlic", Cupboard.key("garlic cloves"))
        assertEquals("salmon", Cupboard.key("salmon portions"))
        assertEquals("tuna", Cupboard.key("tuna in water"))
        assertEquals("egg", Cupboard.key("eggs"))
        assertEquals("spinach", Cupboard.key("baby spinach"))
        assertEquals("bay leaf", Cupboard.key("bay leaves"))
        assertEquals("cumin", Cupboard.key("ground cumin"))
        assertEquals("white bean", Cupboard.key("white beans"))
        assertEquals("diced tomato", Cupboard.key("diced tomatoes"))
        assertEquals("rice noodle", Cupboard.key("rice noodles"))
    }

    @Test
    fun aChoiceIsCoveredByEitherOption() {
        assertEquals(listOf("chicken breast", "chicken thigh"), Cupboard.options("chicken breast or thighs"))
        assertEquals(listOf("almond milk", "coconut milk"), Cupboard.options("unsweetened almond or light coconut milk"))
        assertEquals(listOf("coconut milk"), Cupboard.options("light coconut milk"))
        assertTrue(Cupboard.unknownChoice("ham or turkey"))
        assertFalse(Cupboard.unknownChoice("rice or yuca"))
        assertFalse(Cupboard.unknownChoice("oregano"))
    }

    private var nextId = 1L

    private fun ing(name: String, section: StoreSection, quantity: Double? = 1.0) =
        Ingredient(id = nextId++, recipeId = 1, position = nextId.toInt(), name = name, quantity = quantity, storeSection = section)

    private val bowl = Recipe(id = 1, name = "Chicken rice bowl", mealType = MealType.LUNCH) to listOf(
        ing("chicken breast", StoreSection.PROTEIN),
        ing("cooked jasmine rice", StoreSection.CARBS),
        ing("frozen broccoli", StoreSection.PRODUCE_FROZEN),
        ing("low-sodium soy sauce", StoreSection.PANTRY),
        ing("scallions", StoreSection.PRODUCE_FROZEN, quantity = null),
    )
    private val salmon = Recipe(id = 2, name = "Baked salmon", mealType = MealType.DINNER) to listOf(
        ing("salmon portions", StoreSection.PROTEIN),
        ing("rice", StoreSection.CARBS),
        ing("lemon", StoreSection.PRODUCE_FROZEN),
    )
    private val order = Recipe(id = 3, name = "Coffee order", mealType = MealType.BREAKFAST) to emptyList<Ingredient>()

    @Test
    fun recipesAreRankedByWhatsAlreadyThere() {
        val matches = Cupboard.match(
            listOf(salmon, bowl, order),
            cupboard = setOf("chicken breast", "rice", "broccoli", "scallion"),
            staples = setOf("soy sauce"),
        )
        assertEquals(listOf("Chicken rice bowl", "Baked salmon"), matches.map { it.recipe.name })
        val first = matches[0]
        assertTrue(first.ready)
        assertEquals(1.0, first.coverage, 0.0)
        val second = matches[1]
        assertEquals(listOf("salmon portions", "lemon"), second.missing.map { it.name })
        assertEquals(1, second.haveCount)
        // Rice (2) out of salmon (3) + rice (2) + lemon (1.5).
        assertEquals(2.0 / 6.5, second.coverage, 1e-9)
    }

    @Test
    fun staplesAloneAreNotAMatch() {
        assertTrue(Cupboard.match(listOf(bowl), cupboard = emptySet(), staples = setOf("soy sauce")).isEmpty())
        assertTrue(Cupboard.match(listOf(bowl), cupboard = setOf("lemon"), staples = emptySet()).isEmpty())
    }

    @Test
    fun theListToTickLeavesOutStaplesAndMergesLookalikes() {
        val all = bowl.second + salmon.second
        val items = Cupboard.catalog(all, staples = setOf("soy sauce"))
        assertEquals(listOf("Chicken breast", "Salmon", "Broccoli", "Lemon", "Scallions", "Rice"), items.map { it.name })
        assertEquals("scallion", items.single { it.name == "Scallions" }.key)
        assertEquals(StoreSection.PROTEIN, items.first().section)
    }
}
