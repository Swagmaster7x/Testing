package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection

/** How much of one serving a planned slot uses. */
object Portions {
    /** The choices offered for a person's lunch and dinner portion. */
    val choices = listOf(0.5, 0.75, 1.0, 1.5)

    /** [portion] is the person's share of a serving at lunch and dinner; breakfast and snacks are a whole one. */
    fun forSlot(portion: Double, slot: MealSlot): Double =
        if (slot == MealSlot.LUNCH || slot == MealSlot.DINNER) portion else 1.0

    /** "three-quarters of a serving", for "Your portion: about ...". */
    fun words(portion: Double): String = when (portion) {
        0.5 -> "half a serving"
        0.75 -> "three-quarters of a serving"
        1.0 -> "one serving"
        1.5 -> "one and a half servings"
        else -> "${Quantities.format(portion)} servings"
    }

    fun shortLabel(portion: Double): String = when (portion) {
        0.5 -> "½"
        0.75 -> "¾"
        1.0 -> "1"
        1.5 -> "1½"
        else -> Quantities.format(portion)
    }
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
