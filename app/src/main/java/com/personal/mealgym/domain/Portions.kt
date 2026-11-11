package com.personal.mealgym.domain

import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection

/** How much of one serving a planned slot uses. */
object Portions {
    /** Ashley eats about three-quarters of a serving at lunch and dinner. */
    const val ASHLEY_MAIN_MEAL = 0.75

    fun forSlot(profileId: Long, slot: MealSlot): Double =
        if (profileId == Profiles.ASHLEY && (slot == MealSlot.LUNCH || slot == MealSlot.DINNER)) ASHLEY_MAIN_MEAL else 1.0
}

/** Applies a recipe's chosen "Make it with..." protein swap to its ingredients. */
object RecipeSwaps {
    fun ingredientsFor(recipe: Recipe, ingredients: List<Ingredient>): List<Ingredient> {
        val swap = recipe.activeSwap?.let { recipe.proteinSwaps.getOrNull(it) } ?: return ingredients
        val replace = swap.replace ?: return ingredients
        val with = swap.with ?: return ingredients
        val key = ShoppingList.ingredientKey(replace)
        return ingredients.map { ing ->
            if (ShoppingList.ingredientKey(ing.name) == key) {
                ing.copy(name = with, note = null, storeSection = StoreSection.PROTEIN)
            } else {
                ing
            }
        }
    }
}
