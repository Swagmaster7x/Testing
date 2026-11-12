package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.ProteinSwap
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

/** "Make it with...": the stand-in takes the original's amount unless it brings its own. */
class RecipeSwapsTest {
    private val chicken = Ingredient(recipeId = 1, position = 0, name = "chicken breast", quantity = 1.5, unit = "lb", note = "cubed", storeSection = StoreSection.PROTEIN)
    private val rice = Ingredient(recipeId = 1, position = 1, name = "cooked rice", quantity = 3.0, unit = "cups", storeSection = StoreSection.CARBS)
    private val bowl = Recipe(
        id = 1,
        name = "Greek bowl",
        mealType = MealType.LUNCH,
        protein = ProteinTag.CHICKEN,
        proteinSwaps = listOf(
            ProteinSwap("Turkey", ProteinTag.TURKEY, replace = "chicken breast", with = "turkey breast cutlets"),
            ProteinSwap("Chickpeas", ProteinTag.VEGETARIAN, replace = "chicken breast", with = "chickpeas, drained", quantity = 2.0, unit = "cans"),
            ProteinSwap("Eggs", ProteinTag.EGG, replace = "chicken breast", with = "eggs", quantity = 6.0),
        ),
    )

    @Test
    fun noSwapLeavesTheRecipeAlone() {
        assertEquals(listOf(chicken, rice), RecipeSwaps.ingredientsFor(bowl, listOf(chicken, rice)))
    }

    @Test
    fun aPlainSwapKeepsTheOriginalAmount() {
        val used = RecipeSwaps.ingredientsFor(bowl.copy(activeSwap = 0), listOf(chicken, rice))
        assertEquals("turkey breast cutlets", used[0].name)
        assertEquals(1.5, used[0].quantity!!, 0.0)
        assertEquals("lb", used[0].unit)
        assertNull("the cutting note belonged to the chicken", used[0].note)
        assertEquals(rice, used[1])
    }

    @Test
    fun aSwapWithItsOwnAmountUsesIt() {
        val chickpeas = RecipeSwaps.ingredientsFor(bowl.copy(activeSwap = 1), listOf(chicken, rice))[0]
        assertEquals("chickpeas, drained", chickpeas.name)
        assertEquals(2.0, chickpeas.quantity!!, 0.0)
        assertEquals("cans", chickpeas.unit)
        // Counted things have an amount and no unit.
        val eggs = RecipeSwaps.ingredientsFor(bowl.copy(activeSwap = 2), listOf(chicken, rice))[0]
        assertEquals(6.0, eggs.quantity!!, 0.0)
        assertNull(eggs.unit)
    }
}
