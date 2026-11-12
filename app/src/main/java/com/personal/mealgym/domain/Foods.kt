package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe

/**
 * Things a person can ask the app to keep off their plan: the nine major allergens, plus kinds
 * of meat for people who don't eat them.
 */
enum class Avoid(val label: String, val isAllergen: Boolean) {
    DAIRY("Dairy", true),
    EGG("Eggs", true),
    FISH("Fish", true),
    SHELLFISH("Shellfish", true),
    TREE_NUT("Tree nuts", true),
    PEANUT("Peanuts", true),
    GLUTEN("Wheat and gluten", true),
    SOY("Soy", true),
    SESAME("Sesame", true),
    BEEF("Beef", false),
    PORK("Pork", false),
    POULTRY("Chicken and turkey", false),
    ;

    companion object {
        /** No meat or seafood. */
        val vegetarian = setOf(BEEF, PORK, POULTRY, FISH, SHELLFISH)

        fun parse(names: Collection<String>): Set<Avoid> =
            names.mapNotNull { n -> entries.firstOrNull { it.name == n } }.toSet()
    }
}

/**
 * Works out what a recipe contains from its ingredient names. It leans cautious: foods that
 * usually contain an allergen are flagged (soy sauce for wheat, kimchi for fish, granola for
 * nuts, oats for gluten). It reads names, not labels, so it can still be wrong, and the app
 * says so wherever it shows the result.
 */
object Foods {

    private class Rule(val flag: Avoid, words: String, notWhenPartOf: String = "") {
        val match = Regex("\\b(?:$words)\\b")
        val skip = if (notWhenPartOf.isEmpty()) null else Regex("\\b(?:$notWhenPartOf)\\b")
    }

    private val rules = listOf(
        Rule(
            Avoid.DAIRY,
            "milk|cheeses?|yogurts?|yoghurts?|butter|buttermilk|cream|whey|casein|ghee|feta|parmesan|mozzarella|cheddar|" +
                "ricotta|queso|cotija|paneer|gruy[eè]re|lattes?|kefir|half-and-half|custard|protein shakes?|protein powder|" +
                "cold foam|egg bites",
            "(?:coconut|almond|oat|soy|rice|cashew|light coconut) milk|(?:peanut|almond|cashew|nut|seed|sunflower|cocoa) butter|" +
                "butter beans?|butter lettuce|coconut cream|cream of tartar",
        ),
        Rule(Avoid.EGG, "eggs?|egg whites?|mayo|mayonnaise|aioli|meringue|frittata|omelet|omelette"),
        Rule(
            Avoid.FISH,
            "fish|salmon|tuna|cod|tilapia|anchov(?:y|ies)|sardines?|halibut|trout|mackerel|worcestershire|bonito|dashi|" +
                "caesar dressing|kimchi",
        ),
        Rule(
            Avoid.SHELLFISH,
            "shrimps?|prawns?|crab|lobster|scallops?|clams?|mussels?|oysters?|oyster sauce|crawfish|calamari|squid|kimchi",
        ),
        Rule(
            Avoid.TREE_NUT,
            "almonds?|walnuts?|pecans?|cashews?|pistachios?|hazelnuts?|macadamias?|pine nuts?|brazil nuts?|nuts?|pesto|" +
                "marzipan|trail mix|granola|nut butter",
        ),
        Rule(Avoid.PEANUT, "peanuts?|satay"),
        Rule(
            Avoid.GLUTEN,
            "wheat|whole-wheat|flour|bread|breadcrumbs?|toast|buns?|bagels?|pitas?|naan|wraps?|pasta|spaghetti|penne|" +
                "noodles?|macaroni|couscous|bulgur|barley|rye|farro|semolina|seitan|crackers?|panko|croutons?|tortillas?|" +
                "soy sauce|teriyaki|gochujang|oyster sauce|hoisin|beer|malt|oats?|oatmeal|granola|udon|ramen|soba|wontons?|" +
                "dumplings?|pizza|muffins?|biscuits?|pancake mix",
            "(?:corn|almond|rice|coconut|chickpea) flour|corn tortillas?|(?:rice|glass|zucchini|shirataki) noodles?|rice vermicelli",
        ),
        Rule(Avoid.SOY, "soy|soya|soybeans?|tofu|edamame|tempeh|miso|tamari|teriyaki|gochujang|hoisin|oyster sauce"),
        Rule(Avoid.SESAME, "sesame|tahini|hummus|furikake"),
        Rule(
            Avoid.BEEF,
            "beef|steaks?|sirloin|top round|brisket|stew meat|jerky|veal|ground chuck",
            "(?:tuna|salmon|cauliflower|tofu) steaks?",
        ),
        Rule(
            Avoid.PORK,
            "pork|bacon|ham|prosciutto|pancetta|chorizo|sausages?|pepperoni|salami|lard|pernil",
            "(?:turkey|chicken) (?:bacon|sausages?|chorizo)|soy chorizo|soy or chicken chorizo",
        ),
        Rule(Avoid.POULTRY, "chicken|turkey|duck|poultry"),
    )

    /** What one ingredient (or dish) name contains. */
    fun inName(name: String): Set<Avoid> {
        val text = name.lowercase()
        return rules.filter { rule ->
            val cleaned = rule.skip?.replace(text, " ") ?: text
            rule.match.containsMatchIn(cleaned)
        }.map { it.flag }.toSet()
    }

    private fun fromTag(tag: ProteinTag?): Set<Avoid> = when (tag) {
        ProteinTag.BEEF -> setOf(Avoid.BEEF)
        ProteinTag.PORK -> setOf(Avoid.PORK)
        ProteinTag.CHICKEN, ProteinTag.TURKEY -> setOf(Avoid.POULTRY)
        ProteinTag.EGG -> setOf(Avoid.EGG)
        // The Fish tag also covers seafood dishes; being cautious, both count as fish here.
        ProteinTag.FISH -> setOf(Avoid.FISH)
        ProteinTag.VEGETARIAN, null -> emptySet()
    }

    /**
     * Everything a recipe contains, with its chosen "Make it with..." swap applied. Entries with
     * no ingredient list (a coffee-shop order) are read from their name instead.
     */
    fun inRecipe(recipe: Recipe, ingredients: List<Ingredient>): Set<Avoid> {
        val used = RecipeSwaps.ingredientsFor(recipe, ingredients)
        val swap = recipe.activeSwap?.let { recipe.proteinSwaps.getOrNull(it) }
        val names = if (used.isEmpty()) listOf(recipe.name) else used.map { it.name }
        return names.flatMap(::inName).toSet() + fromTag(swap?.protein ?: recipe.protein)
    }

    /** "dairy, soy and wheat and gluten" style list for messages. */
    fun describe(flags: Collection<Avoid>): String {
        val names = flags.sortedBy { it.ordinal }.map { it.label.lowercase() }
        return when (names.size) {
            0 -> ""
            1 -> names[0]
            else -> names.dropLast(1).joinToString(", ") + " and " + names.last()
        }
    }
}
