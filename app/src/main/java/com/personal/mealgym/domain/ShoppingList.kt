package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import kotlin.math.ceil

/** A recipe as it appears in one week's plan: how many servings its planned slots add up to. */
data class PlannedRecipe(
    val recipe: Recipe,
    val ingredients: List<Ingredient>,
    val portions: Double,
)

/** One unit's running total for a shopping item. A null quantity means "some" (e.g. "cilantro"). */
data class Amount(val quantity: Double?, val unit: String?)

data class ShoppingItem(
    val key: String,
    val name: String,
    val section: StoreSection,
    val amounts: List<Amount>,
    val recipeNames: List<String>,
) {
    val amountText: String get() = ShoppingList.formatAmounts(amounts)
}

data class ShoppingSection(val section: StoreSection, val items: List<ShoppingItem>)

data class ShoppingResult(
    val sections: List<ShoppingSection>,
    /** Display names left off because the user always has them. */
    val skippedAlwaysHave: List<String>,
) {
    val isEmpty: Boolean get() = sections.isEmpty() && skippedAlwaysHave.isEmpty()
}

/**
 * Rolls a week's planned recipes up into one shopping list.
 *
 * - Ingredient quantities are for the whole recipe, so a recipe that serves 4 and fills
 *   4 slots is bought once; filling 5 slots means cooking it twice. A slot can be less than a
 *   whole serving (Ashley's lunches and dinners are about three-quarters).
 * - The same ingredient across recipes is combined (2 lb chicken thighs + 2 lb = 4 lb).
 * - Items the user ticked as "always have" are left off.
 * - Sections are ordered Protein, Produce and Frozen, Carbs, Pantry.
 */
object ShoppingList {

    val sectionOrder = listOf(
        StoreSection.PROTEIN,
        StoreSection.PRODUCE_FROZEN,
        StoreSection.CARBS,
        StoreSection.PANTRY,
    )

    fun batchesNeeded(portions: Double, servings: Int): Int {
        if (portions <= 0.0) return 0
        val perBatch = servings.coerceAtLeast(1)
        return ceil(portions / perBatch - 1e-9).toInt()
    }

    fun build(planned: List<PlannedRecipe>, alwaysHave: Set<String>): ShoppingResult {
        val builders = LinkedHashMap<String, ItemBuilder>()
        val skipped = LinkedHashMap<String, String>()

        for (p in planned) {
            val batches = batchesNeeded(p.portions, p.recipe.servings)
            if (batches == 0) continue
            for (ing in p.ingredients.sortedBy { it.position }) {
                val key = ingredientKey(ing.name)
                if (key.isEmpty()) continue
                if (isAlwaysHave(ing.name, alwaysHave)) {
                    skipped.putIfAbsent(key, ing.name)
                    continue
                }
                val builder = builders.getOrPut(key) {
                    ItemBuilder(key = key, name = ing.name, section = ing.storeSection)
                }
                builder.add(ing.quantity?.times(batches), normalizeUnit(ing.unit))
                builder.recipes += p.recipe.name
            }
        }

        val sections = sectionOrder.mapNotNull { section ->
            val items = builders.values
                .filter { it.section == section }
                .map { it.build() }
                .sortedBy { it.name.lowercase() }
            if (items.isEmpty()) null else ShoppingSection(section, items)
        }
        return ShoppingResult(sections, skipped.values.sortedBy { it.lowercase() })
    }

    /** Lower-case, single-spaced, last word singular: "Garlic Cloves" -> "garlic clove". */
    fun ingredientKey(name: String): String {
        val words = name.lowercase().trim().trimEnd('.', ',').split(Regex("\\s+")).filter { it.isNotEmpty() }
        if (words.isEmpty()) return ""
        return (words.dropLast(1) + singular(words.last())).joinToString(" ")
    }

    /**
     * An ingredient counts as "always have" when it matches a ticked staple exactly, or when one
     * is a more specific version of the other ("soy sauce" vs "low-sodium soy sauce", "oil" vs "olive oil").
     */
    fun isAlwaysHave(name: String, alwaysHave: Set<String>): Boolean {
        val k = ingredientKey(name)
        if (k.isEmpty()) return false
        return alwaysHave.any { staple ->
            val s = ingredientKey(staple)
            s.isNotEmpty() && (k == s || k.endsWith(" $s") || s.endsWith(" $k"))
        }
    }

    /** "Cups" -> "cup", "large bag" -> "bag", "pinch of" -> "pinch", "pounds" -> "lb". Null for no unit. */
    fun normalizeUnit(unit: String?): String? {
        var u = unit?.lowercase()?.trim()?.trimEnd('.') ?: return null
        if (u.isEmpty()) return null
        u = u.removeSuffix(" of").trim()
        u = u.split(Regex("\\s+")).filterNot { it in sizeWords }.joinToString(" ")
        if (u.isEmpty()) return null
        unitSynonyms[u]?.let { return it }
        val single = singular(u)
        return unitSynonyms[single] ?: single
    }

    fun formatAmounts(amounts: List<Amount>): String =
        amounts.mapNotNull { a ->
            val q = a.quantity
            when {
                q == null && a.unit == null -> null
                q == null -> a.unit
                a.unit == null -> Quantities.format(q)
                else -> "${Quantities.format(q)} ${unitLabel(a.unit, q)}"
            }
        }.joinToString(" + ")

    private fun unitLabel(unit: String, quantity: Double): String {
        if (quantity <= 1.0 || unit in noPlural) return unit
        return when {
            unit.endsWith("ch") || unit.endsWith("sh") || unit.endsWith("s") || unit.endsWith("x") -> unit + "es"
            else -> unit + "s"
        }
    }

    private fun singular(word: String): String = when {
        word.length <= 3 -> word
        word.endsWith("oes") -> word.dropLast(2)
        word.endsWith("ies") -> word.dropLast(3) + "y"
        word.endsWith("ches") || word.endsWith("shes") || word.endsWith("xes") || word.endsWith("sses") -> word.dropLast(2)
        word.endsWith("ss") || word.endsWith("us") || word.endsWith("is") -> word
        word.endsWith("s") -> word.dropLast(1)
        else -> word
    }

    private val sizeWords = setOf("large", "big", "small", "medium")
    private val noPlural = setOf("lb", "oz", "tbsp", "tsp", "g", "kg", "ml", "l")
    private val unitSynonyms = mapOf(
        "pound" to "lb", "lbs" to "lb",
        "ounce" to "oz",
        "tablespoon" to "tbsp", "tbs" to "tbsp", "tbl" to "tbsp",
        "teaspoon" to "tsp",
        "gram" to "g", "kilogram" to "kg",
    )

    private class ItemBuilder(val key: String, val name: String, val section: StoreSection) {
        // Insertion-ordered so amounts read in the order recipes were planned.
        private val totals = LinkedHashMap<String?, Double?>()
        val recipes = LinkedHashSet<String>()

        fun add(quantity: Double?, unit: String?) {
            if (!totals.containsKey(unit)) {
                totals[unit] = quantity
            } else {
                val current = totals[unit]
                totals[unit] = when {
                    current == null -> quantity
                    quantity == null -> current
                    else -> current + quantity
                }
            }
        }

        fun build(): ShoppingItem = ShoppingItem(
            key = key,
            name = name.replaceFirstChar { it.uppercase() },
            section = section,
            amounts = mergeWeights(totals.map { (unit, q) -> Amount(q, unit) }),
            recipeNames = recipes.toList(),
        )

        /** Folds ounces into pounds when both appear, e.g. 3 1/2 lb + 8 oz -> 4 lb. */
        private fun mergeWeights(amounts: List<Amount>): List<Amount> {
            val lb = amounts.firstOrNull { it.unit == "lb" && it.quantity != null }
            val oz = amounts.firstOrNull { it.unit == "oz" && it.quantity != null }
            if (lb == null || oz == null) return amounts
            val merged = Amount(lb.quantity!! + oz.quantity!! / 16.0, "lb")
            return amounts.filterNot { it === oz }.map { if (it === lb) merged else it }
        }
    }
}
