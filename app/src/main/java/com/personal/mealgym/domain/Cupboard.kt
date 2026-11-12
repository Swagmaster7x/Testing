package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection

/** Something that can be ticked as "in my cupboard". [key] is what's stored. */
data class CupboardItem(val key: String, val name: String, val section: StoreSection)

/** How well one recipe fits what's in the cupboard. */
data class CupboardMatch(
    val recipe: Recipe,
    /** Ingredients still to buy, in recipe order. */
    val missing: List<Ingredient>,
    val haveCount: Int,
    val total: Int,
    /** 0 to 1, weighted so the main protein counts for more than a garnish. */
    val coverage: Double,
) {
    val ready: Boolean get() = missing.isEmpty()
}

/**
 * "What can I make with what I have?" Ingredients are compared by a plain food name, so
 * "low-sodium soy sauce" and "soy sauce" are one thing to tick, as are "frozen broccoli" and
 * "broccoli". Pantry staples ticked in Settings always count as in the cupboard.
 */
object Cupboard {

    /** Words that describe how something is sold or prepared, not what it is. */
    private val descriptors = Regex(
        "\\b(?:low-sodium|reduced-sodium|nonfat|non-fat|low-fat|reduced-fat|light|unsweetened|frozen|cooked|boneless|skinless|" +
            "lean|extra-lean|baby|fresh|canned|ready-to-drink|liquid|vanilla|thin-sliced|large|small|medium|plain|ripe|" +
            "extra-virgin|jasmine|basmati|white(?= rice)|long-grain|shredded|grated|chopped|sliced|minced|dried|ground(?= (?:cumin|" +
            "cinnamon|ginger|allspice|coriander|turmeric|pepper))|\\d+% lean)\\b",
    )

    /** How a food is packed, when it follows the name. */
    private val packaging = Regex("\\b(?:portions?|fillets?|cloves?|stalks?|chunks?|florets?|(?<!bay )leaves|in water|in oil|cups?)\\b")

    /** Ingredient lines that name a choice. Either one in the cupboard is enough. */
    private val alternatives = mapOf(
        "chicken breast or thighs" to listOf("chicken breast", "chicken thighs"),
        "black or pink beans" to listOf("black beans", "pink beans"),
        "pink or black beans" to listOf("pink beans", "black beans"),
        "bok choy or broccoli" to listOf("bok choy", "broccoli"),
        "rice or yuca" to listOf("rice", "yuca"),
        "pork loin or tenderloin" to listOf("pork loin", "pork tenderloin"),
        "sirloin or flank steak" to listOf("sirloin steak", "flank steak"),
        "soy or chicken chorizo" to listOf("soy chorizo", "chicken chorizo"),
        "thin-sliced top round or cube steak" to listOf("top round steak", "cube steak"),
        "unsweetened almond or light coconut milk" to listOf("almond milk", "coconut milk"),
        "arugula and baby spinach" to listOf("arugula", "spinach"),
    )

    /** The name without how it's sold or prepared: "93% lean ground turkey" -> "ground turkey". */
    private fun plain(name: String): String {
        val stripped = name.lowercase()
            .replace(descriptors, " ")
            .replace(packaging, " ")
            .replace(Regex("[,.()]"), " ")
            .replace(Regex("\\s+"), " ")
            .trim()
        return stripped.ifEmpty { name.lowercase().trim() }
    }

    /** The plain food name used for matching, singular: "garlic cloves" -> "garlic", "eggs" -> "egg". */
    fun key(name: String): String =
        // "bay leaves" would otherwise come out as "bay leave".
        ShoppingList.ingredientKey(plain(name)).replace(Regex("\\bleave$"), "leaf")

    /** The foods an ingredient line names; more than one for "X or Y". */
    private fun parts(name: String): List<String> {
        val lower = name.lowercase().trim()
        return alternatives[lower] ?: if (" or " in lower) lower.split(" or ") else listOf(lower)
    }

    /** The cupboard keys that would cover an ingredient line; more than one for "X or Y". */
    fun options(name: String): List<String> = parts(name).map(::key).filter { it.isNotEmpty() }.distinct()

    /** Ingredient lines that offer a choice the app doesn't know how to split (for tests). */
    fun unknownChoice(name: String): Boolean {
        val lower = name.lowercase().trim()
        return (" or " in lower || " and " in lower) && lower !in alternatives
    }

    private fun has(ingredient: Ingredient, cupboard: Set<String>, staples: Set<String>): Boolean =
        ShoppingList.isAlwaysHave(ingredient.name, staples) || options(ingredient.name).any { it in cupboard }

    private fun weight(ingredient: Ingredient): Double {
        val base = when (ingredient.storeSection) {
            StoreSection.PROTEIN -> 3.0
            StoreSection.CARBS -> 2.0
            StoreSection.PRODUCE_FROZEN -> 1.5
            StoreSection.PANTRY -> 1.0
        }
        // No quantity means "to taste" or a garnish.
        return if (ingredient.quantity == null && ingredient.unit == null) base * 0.5 else base
    }

    /**
     * Everything that can be ticked: each distinct food across the recipes, by store section.
     * Pantry staples are left out, since they already count.
     */
    fun catalog(ingredients: List<Ingredient>, staples: Set<String>): List<CupboardItem> {
        val items = LinkedHashMap<String, CupboardItem>()
        for (ing in ingredients) {
            if (ShoppingList.isAlwaysHave(ing.name, staples)) continue
            for (part in parts(ing.name)) {
                val k = key(part)
                if (k.isEmpty()) continue
                // Shown as the recipes write it; of "egg" and "eggs", the fuller one reads better in a list.
                val name = plain(part).replaceFirstChar { it.uppercase() }
                val known = items[k]
                if (known == null || name.length > known.name.length) items[k] = CupboardItem(k, name, known?.section ?: ing.storeSection)
            }
        }
        return items.values.sortedWith(compareBy<CupboardItem> { ShoppingList.sectionOrder.indexOf(it.section) }.thenBy { it.name })
    }

    /**
     * Recipes ranked by how much of each is already in the cupboard: ready-to-cook first, then
     * the fewest things to buy. Recipes with nothing from the cupboard are left out, as are
     * entries with no ingredient list.
     */
    fun match(
        recipes: List<Pair<Recipe, List<Ingredient>>>,
        cupboard: Set<String>,
        staples: Set<String>,
    ): List<CupboardMatch> = recipes.mapNotNull { (recipe, all) ->
        val ingredients = RecipeSwaps.ingredientsFor(recipe, all.sortedBy { it.position })
        if (ingredients.isEmpty()) return@mapNotNull null
        val (have, missing) = ingredients.partition { has(it, cupboard, staples) }
        // Staples alone don't make a match: something ticked in the cupboard has to be used.
        val usesCupboard = ingredients.any { ing -> options(ing.name).any { it in cupboard } }
        if (!usesCupboard) return@mapNotNull null
        val total = ingredients.sumOf(::weight)
        CupboardMatch(recipe, missing, have.size, ingredients.size, if (total == 0.0) 0.0 else have.sumOf(::weight) / total)
    }.sortedWith(
        compareByDescending<CupboardMatch> { it.ready }
            .thenByDescending { it.coverage }
            .thenByDescending { it.recipe.isFavorite }
            .thenBy { it.recipe.name.lowercase() },
    )
}
