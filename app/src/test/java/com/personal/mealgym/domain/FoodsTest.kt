package com.personal.mealgym.domain

import com.personal.mealgym.data.db.Ingredient
import com.personal.mealgym.data.db.MealType
import com.personal.mealgym.data.db.ProteinSwap
import com.personal.mealgym.data.db.ProteinTag
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.db.StoreSection
import org.junit.Assert.assertEquals
import org.junit.Test

class FoodsTest {
    private fun has(name: String) = Foods.inName(name)

    @Test
    fun commonAllergensAreFoundByName() {
        assertEquals(setOf(Avoid.DAIRY), has("nonfat Greek yogurt"))
        assertEquals(setOf(Avoid.DAIRY), has("vanilla whey protein"))
        assertEquals(setOf(Avoid.EGG), has("liquid egg whites"))
        assertEquals(setOf(Avoid.EGG), has("light mayo"))
        assertEquals(setOf(Avoid.FISH), has("salmon portions"))
        assertEquals(setOf(Avoid.FISH), has("fish sauce"))
        assertEquals(setOf(Avoid.SHELLFISH), has("large shrimp"))
        assertEquals(setOf(Avoid.PEANUT), has("peanut butter"))
        assertEquals(setOf(Avoid.TREE_NUT), has("sliced almonds"))
        assertEquals(setOf(Avoid.SESAME), has("sesame oil"))
        assertEquals(setOf(Avoid.SESAME), has("hummus"))
        assertEquals(setOf(Avoid.SOY), has("firm tofu"))
        assertEquals(setOf(Avoid.GLUTEN), has("whole-wheat spaghetti"))
        assertEquals(setOf(Avoid.GLUTEN), has("flour tortillas"))
    }

    @Test
    fun cautiousAboutFoodsThatUsuallyContainOne() {
        assertEquals(setOf(Avoid.GLUTEN, Avoid.SOY), has("low-sodium soy sauce"))
        assertEquals(setOf(Avoid.SHELLFISH, Avoid.GLUTEN, Avoid.SOY), has("oyster sauce"))
        assertEquals(setOf(Avoid.FISH, Avoid.SHELLFISH), has("kimchi"))
        assertEquals(setOf(Avoid.TREE_NUT, Avoid.GLUTEN), has("granola"))
        assertEquals(setOf(Avoid.GLUTEN), has("rolled oats"))
        assertEquals(setOf(Avoid.GLUTEN, Avoid.SOY), has("gochujang"))
    }

    @Test
    fun lookalikesAreNotFlagged() {
        assertEquals(emptySet<Avoid>(), has("light coconut milk"))
        assertEquals(setOf(Avoid.TREE_NUT), has("unsweetened almond or light coconut milk"))
        assertEquals(emptySet<Avoid>(), has("butternut squash"))
        assertEquals(emptySet<Avoid>(), has("butter lettuce"))
        assertEquals(emptySet<Avoid>(), has("eggplant"))
        assertEquals(emptySet<Avoid>(), has("corn tortillas"))
        assertEquals(emptySet<Avoid>(), has("rice noodles"))
        assertEquals(emptySet<Avoid>(), has("rice vermicelli"))
        assertEquals(emptySet<Avoid>(), has("scallions"))
        assertEquals(emptySet<Avoid>(), has("nutmeg"))
        assertEquals(emptySet<Avoid>(), has("water chestnuts"))
        assertEquals(emptySet<Avoid>(), has("jalapeño"))
        assertEquals(emptySet<Avoid>(), has("chickpeas"))
        assertEquals(emptySet<Avoid>(), has("cornstarch"))
    }

    @Test
    fun kindsOfMeat() {
        assertEquals(setOf(Avoid.BEEF), has("sirloin or flank steak"))
        assertEquals(setOf(Avoid.BEEF), has("90% lean ground beef"))
        assertEquals(setOf(Avoid.BEEF), has("low-sodium beef broth"))
        assertEquals(setOf(Avoid.PORK), has("boneless pork shoulder"))
        assertEquals(setOf(Avoid.PORK), has("bacon"))
        assertEquals(setOf(Avoid.POULTRY), has("turkey bacon"))
        assertEquals(setOf(Avoid.POULTRY), has("chicken sausage"))
        assertEquals(setOf(Avoid.SOY, Avoid.POULTRY), has("soy or chicken chorizo"))
        assertEquals(setOf(Avoid.POULTRY), has("low-sodium chicken broth"))
        assertEquals(setOf(Avoid.FISH), has("tuna steaks"))
    }

    private fun ing(name: String) = Ingredient(recipeId = 1, position = 0, name = name, storeSection = StoreSection.PANTRY)

    @Test
    fun aRecipeIsTheSumOfItsIngredientsAndFollowsItsSwap() {
        val bowl = Recipe(
            id = 1,
            name = "Teriyaki bowl",
            mealType = MealType.LUNCH,
            protein = ProteinTag.CHICKEN,
            proteinSwaps = listOf(ProteinSwap("Shrimp", ProteinTag.FISH, replace = "chicken breast", with = "large shrimp")),
        )
        val ingredients = listOf(ing("chicken breast"), ing("low-sodium soy sauce"), ing("frozen broccoli"), ing("sesame seeds"))
        assertEquals(setOf(Avoid.POULTRY, Avoid.GLUTEN, Avoid.SOY, Avoid.SESAME), Foods.inRecipe(bowl, ingredients))
        assertEquals(
            setOf(Avoid.SHELLFISH, Avoid.FISH, Avoid.GLUTEN, Avoid.SOY, Avoid.SESAME),
            Foods.inRecipe(bowl.copy(activeSwap = 0), ingredients),
        )
    }

    @Test
    fun anOrderWithNoIngredientListIsReadFromItsName() {
        val order = Recipe(name = "Spinach, Feta & Egg White Wrap + Protein Latte", mealType = MealType.BREAKFAST)
        assertEquals(setOf(Avoid.DAIRY, Avoid.EGG, Avoid.GLUTEN), Foods.inRecipe(order, emptyList()))
    }

    @Test
    fun reasonsReadAsAList() {
        assertEquals("dairy", Foods.describe(listOf(Avoid.DAIRY)))
        assertEquals("dairy, soy and pork", Foods.describe(listOf(Avoid.PORK, Avoid.DAIRY, Avoid.SOY)))
        assertEquals(setOf(Avoid.BEEF, Avoid.PORK, Avoid.POULTRY, Avoid.FISH, Avoid.SHELLFISH), Avoid.vegetarian)
    }
}
