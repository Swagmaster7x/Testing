package com.personal.mealgym.ui

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
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.PlanAnswers
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

/** "What are you craving?": pick a place, see the better choices there, cook the home version. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class CravingsTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    private fun person(name: String, answers: PlanAnswers? = null): Long = runBlocking {
        container.people.create(Profile(0, name, "IRON", planAnswers = answers?.encode()), null, setOf(DayOfWeek.MONDAY)).also {
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
        scrollTo(text)
        compose.onAllNodesWithText(text).onFirst().performClick()
        compose.waitForIdle()
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    private fun shown(text: String) = compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty()

    private fun shot(name: String) = compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")

    private fun openCravings() {
        compose.onAllNodesWithText("Cook").onFirst().performClick()
        waitForText("All recipes")
        tap("What are you craving?")
        waitForText("Eating out")
    }

    @Test
    fun pickAPlaceSeeBetterPicksAndCookItAtHome() {
        person("Rae")
        openCravings()
        for (place in container.restaurants.all) scrollTo(place.name)
        scrollTo("Pick a place")
        shot("cravings-1-places")

        tap("Chipotle")
        waitForText("Better picks")
        assertTrue(shown("about 180 cal, 32 g protein a serving"))
        shot("cravings-2-restaurant")
        scrollTo("How to order")
        scrollTo("Check current nutrition (opens a web search)")
        scrollTo("Make it at home")
        scrollTo("Like a chicken burrito bowl")
        scrollTo("not affiliated with")
        shot("cravings-3-make-it-at-home")

        // The home version opens as a normal recipe, and says what it is like.
        tap("Chicken burrito bowls")
        waitForText("Like a chicken burrito bowl at Chipotle")
        waitForText("Start cooking")
        shot("cravings-4-recipe")
    }

    @Test
    fun everyPlaceOpensAndEveryHomeVersionIsThere() {
        person("Lee")
        openCravings()
        val library = runBlocking { container.db.recipeDao().allRecipes().associateBy { it.seedKey } }
        for (place in container.restaurants.all) {
            tap(place.name)
            waitForText("Better picks")
            for (pick in place.picks) scrollTo(pick.name)
            for (tip in place.tips) scrollTo(tip)
            for (link in place.copycats) {
                scrollTo(library.getValue(link.recipe).name)
                scrollTo("Like ${link.like}")
            }
            scrollTo("not affiliated with")
            compose.activityRule.scenario.onActivity { it.onBackPressedDispatcher.onBackPressed() }
            // Back on the list, where it was left (the heading may be scrolled away).
            waitForText("What are you craving?")
        }
        // Every home version is also listed on the first page.
        val copycats = library.values.filter { "Copycat" in it.cuisineTags }
        assertEquals(14, copycats.size)
        for (recipe in copycats) scrollTo(recipe.name)
    }

    @Test
    fun avoidedFoodsAreFlaggedAndTheirHomeVersionsLeftOut() {
        person("Kai", PlanAnswers(avoid = listOf("EGG", "BEEF")))
        openCravings()
        tap("McDonald's")
        waitForText("Better picks")
        // Eggs are an allergen, so the page says to check with the restaurant; beef is a preference.
        waitForText("You avoid eggs. The app can't see a restaurant's full ingredients")
        shot("cravings-5-avoids")
        scrollTo("Egg McMuffin")
        scrollTo("Has eggs, which you avoid.")
        scrollTo("Hamburger")
        scrollTo("Has beef, which you avoid.")
        // The egg muffin, the egg burritos and the burger bowl are all out.
        scrollTo("3 recipes with something you avoid are left out.")
        assertTrue(!shown("Egg and cheese breakfast muffin"))
        shot("cravings-6-left-out")
    }

    @Test
    fun theNutritionSwitchHidesTheFigures() {
        val id = person("Noor")
        runBlocking { container.settings.setShowNutrition(id, false) }
        openCravings()
        tap("Chipotle")
        waitForText("Better picks")
        scrollTo("Sofritas (braised tofu)")
        assertTrue(!shown("about 180 cal"))
        scrollTo("Chicken burrito bowls")
        assertTrue(!shown("A serving, approx."))
    }
}
