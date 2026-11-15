package com.personal.mealgym.ui

import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollToNode
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.captureRoboImage
import com.personal.mealgym.MainActivity
import com.personal.mealgym.MealGymApp
import com.personal.mealgym.Opening
import com.personal.mealgym.data.db.CookRating
import com.personal.mealgym.data.db.Profile
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.DayOfWeek

/** Cooking for more or fewer, timers from the steps, and "I cooked it". */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class CookingDepthTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    private fun person(name: String): Long = runBlocking {
        container.people.create(Profile(0, name, "IRON"), null, setOf(DayOfWeek.MONDAY)).also {
            container.settings.setActiveProfile(it)
            withTimeout(10_000) { container.opening.first { o -> (o as? Opening.Open)?.profile?.id == it } }
        }
    }.also {
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
    }

    private fun scrollTo(text: String) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(hasText(text, substring = true))
        compose.waitForIdle()
    }

    private fun tap(text: String) {
        compose.onAllNodesWithText(text).onFirst().performClick()
        compose.waitForIdle()
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    private fun shown(text: String) = compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty()

    private fun shot(name: String) = compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")

    /** Opens the lemon-herb chicken (serves 4, with a 15 minute and a 20 to 25 minute step). */
    private fun openRecipe() {
        tap("Cook")
        waitForText("All recipes")
        scrollTo("Lemon-herb chicken thighs with potatoes and green beans")
        tap("Lemon-herb chicken thighs with potatoes and green beans")
        waitForText("Start cooking")
    }

    @Test
    fun aRecipeScalesAndCookingModeFollows() {
        person("Rae")
        openRecipe()
        scrollTo("Servings")
        waitForText("2 lb chicken thighs, boneless skinless")
        shot("cooking-1-servings")
        compose.onAllNodes(hasContentDescription("Cook 8 servings")).onFirst().performClick()
        waitForText("4 lb chicken thighs, boneless skinless")
        waitForText("3 lb potatoes, halved")
        waitForText("Amounts are for 8 servings. The steps still mention the amounts for 4.")
        compose.onAllNodes(hasContentDescription("Cook 2 servings")).onFirst().performClick()
        waitForText("1 lb chicken thighs, boneless skinless")
        waitForText("3/4 lb potatoes, halved")
        shot("cooking-2-halved")

        // Cooking mode opens at the same size.
        scrollTo("Start cooking")
        tap("Start cooking")
        waitForText("Get these out")
        waitForText("For 2 servings. The steps still mention the amounts for 4.")
        waitForText("1 lb chicken thighs, boneless skinless")
    }

    @Test
    fun stepsOfferTimersAndTheLastOneAsksHowItWent() {
        val id = person("Kit")
        openRecipe()
        tap("Start cooking")
        waitForText("Get these out")
        tap("Next")
        waitForText("Step 1 of 5")
        // "Heat the oven to 425°F." has no time in it.
        assertTrue(!shown("timer"))
        tap("Next")
        waitForText("Step 2 of 5")
        waitForText("Start 15 min timer")
        tap("Start 15 min timer")
        waitForText("Step 2 · Lemon-herb chicken thighs")
        assertEquals(listOf(900), container.cookTimers.timers.value.map { it.totalSeconds })
        tap("Next")
        waitForText("Step 3 of 5")
        // The running timer follows from step to step.
        assertTrue(shown("Step 2 · Lemon-herb chicken thighs"))
        tap("Next")
        waitForText("Start 20 min timer (up to 25 min)")
        tap("Start 20 min timer (up to 25 min)")
        compose.waitUntil(10_000) { container.cookTimers.timers.value.size == 2 }
        waitForText("Timers run while the app is open.")
        shot("cooking-3-timers")
        // Stopping one leaves the other.
        compose.onAllNodes(hasContentDescription("Stop this timer")).onFirst().performClick()
        compose.waitUntil(10_000) { container.cookTimers.timers.value.size == 1 }
        assertEquals(1200, container.cookTimers.timers.value.single().totalSeconds)

        tap("Next")
        waitForText("Step 5 of 5")
        tap("I cooked it")
        waitForText("How was it?")
        waitForText("Optional. It only steers what Fill my week picks for you.")
        tap("Loved it")
        waitForText("Fill my week will pick it more often.")
        shot("cooking-4-how-was-it")
        tap("Save")

        // Back on the recipe, which now says so.
        waitForText("Cooked once")
        waitForText("Loved it")
        val recipe = runBlocking { container.db.recipeDao().bySeedKey("D12")!! }
        assertEquals(mapOf(recipe.id to CookRating.LOVED), runBlocking { container.meals.ratings(id).first() })
        container.cookTimers.timers.value.forEach { container.cookTimers.dismiss(it.id) }
    }

    @Test
    fun theRecipePageCanSayItWasCookedToo() {
        val id = person("Bo")
        openRecipe()
        compose.onAllNodes(hasContentDescription("More")).onFirst().performClick()
        waitForText("I cooked this")
        tap("I cooked this")
        waitForText("How was it?")
        tap("Not again")
        waitForText("Fill my week will stop picking it. You can still plan it yourself.")
        tap("Save")
        waitForText("Not again: Fill my week skips it")
        // Changing your mind the same day changes the rating; it's still one cook.
        compose.onAllNodes(hasContentDescription("More")).onFirst().performClick()
        tap("I cooked this")
        waitForText("How was it?")
        tap("It was fine")
        tap("Save")
        compose.waitUntil(10_000) { runBlocking { container.meals.ratings(id).first() }.values.singleOrNull() == CookRating.FINE }
        assertEquals(1, runBlocking { container.meals.cookLogs(id).first() }.size)
        waitForText("Cooked once")
        // Unpicking the rating and saving takes it back.
        compose.onAllNodes(hasContentDescription("More")).onFirst().performClick()
        tap("I cooked this")
        waitForText("How was it?")
        tap("It was fine")
        waitForText("Saving with none picked takes your rating back.")
        tap("Save")
        compose.waitUntil(10_000) { runBlocking { container.meals.ratings(id).first() }.isEmpty() }
        assertEquals(1, runBlocking { container.meals.cookLogs(id).first() }.size)
    }
}
