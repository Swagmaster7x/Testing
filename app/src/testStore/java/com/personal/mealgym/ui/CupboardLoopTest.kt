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
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Dates
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
import java.time.LocalDate

/** Shopping fills the cupboard, cooking empties it, and the cupboard says what to use up first. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class CupboardLoopTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container
    private val today: LocalDate get() = LocalDate.now()
    private val week: LocalDate get() = Dates.weekStart(today)

    @Before
    fun seededWithAnEmptyCupboard() {
        runBlocking {
            withTimeout(30_000) { container.ready.first { it } }
            // The cupboard is shared by everyone on the phone, so one test's ticks would reach the next.
            container.settings.setCupboard(emptySet())
            container.settings.setCupboardAuto(true)
        }
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

    private fun recipe(key: String) = runBlocking { container.db.recipeDao().bySeedKey(key)!! }

    private fun cupboard() = runBlocking { container.settings.cupboard.first() }

    private fun since() = runBlocking { container.settings.cupboardSince.first() }

    private fun openShopping() {
        tap("Cook")
        waitForText("Shopping list for this week")
        tap("Shopping list for this week")
        waitForText("Week of")
    }

    @Test
    fun whatIsTickedOffTheShoppingListGoesIntoTheCupboard() {
        val id = person("Rae")
        runBlocking {
            container.meals.setSlot(id, week, MealSlot.DINNER, recipe("L1").id)
            // Rice was already in the house.
            container.settings.setInCupboard("rice", have = true)
        }
        openShopping()
        waitForText("What you tick off goes into My cupboard.")
        scrollTo("Chicken thighs")
        tap("Chicken thighs")
        compose.waitUntil(10_000) { "chicken thigh" in cupboard() }
        assertEquals(today.toEpochDay(), since()["chicken thigh"])
        shot("loop-1-shopping-tick")

        // A slip: unticking takes back what the tick put in.
        tap("Chicken thighs")
        compose.waitUntil(10_000) { "chicken thigh" !in cupboard() }
        tap("Chicken thighs")
        compose.waitUntil(10_000) { "chicken thigh" in cupboard() }

        // Ticking and unticking something that was already there leaves it there.
        scrollTo("In your cupboard: check you have enough")
        val rice = runBlocking { container.meals.shoppingWeek(id, week, both = false).first() }.result.sections
            .flatMap { it.items }.first { "rice" in com.personal.mealgym.domain.Cupboard.options(it.name) }.name
        tap(rice)
        compose.waitUntil(10_000) { runBlocking { container.meals.shoppingWeek(id, week, both = false).first() }.checkedKeys.size == 2 }
        tap(rice)
        compose.waitUntil(10_000) { runBlocking { container.meals.shoppingWeek(id, week, both = false).first() }.checkedKeys.size == 1 }
        assertTrue("rice" in cupboard())
        assertTrue("rice" !in since())
    }

    @Test
    fun switchedOffTheShoppingListLeavesTheCupboardAlone() {
        val id = person("Bo")
        runBlocking {
            container.meals.setSlot(id, week, MealSlot.DINNER, recipe("L1").id)
            container.settings.setCupboardAuto(false)
        }
        openShopping()
        assertTrue(!shown("What you tick off goes into My cupboard."))
        scrollTo("Chicken thighs")
        tap("Chicken thighs")
        compose.waitUntil(10_000) {
            runBlocking { container.meals.shoppingWeek(id, week, both = false).first() }.checkedKeys.isNotEmpty()
        }
        assertTrue(cupboard().isEmpty())
    }

    @Test
    fun cookingOffersToTakeOutWhatWasUsedUp() {
        person("Kit")
        runBlocking { container.settings.setInCupboard(listOf("chicken thigh", "onion", "rice", "olive"), have = true, today = today.toEpochDay()) }
        tap("Cook")
        waitForText("All recipes")
        scrollTo("Pollo guisado with rice and beans")
        tap("Pollo guisado with rice and beans")
        waitForText("Start cooking")
        compose.onAllNodes(hasContentDescription("More")).onFirst().performClick()
        tap("I cooked this")
        waitForText("How was it?")
        waitForText("Used up?")
        waitForText("Ticked things leave My cupboard. Untick anything you still have some of.")
        waitForText("Chicken thighs")
        shot("loop-2-used-up")
        // Fresh food starts ticked; the onion is ticked too, but there's still half of it.
        tap("Onion")
        tap("Save")
        compose.waitUntil(10_000) { "chicken thigh" !in cupboard() }
        // The onion was unticked, and rice and olives keep, so they stay.
        assertEquals(setOf("onion", "rice", "olive"), cupboard())
        waitForText("Cooked once")
    }

    @Test
    fun theCupboardSaysWhatToUseUpFirst() {
        person("Ana")
        runBlocking {
            container.settings.setInCupboard(listOf("chicken thigh", "spinach"), have = true, today = today.toEpochDay() - 5)
            container.settings.setInCupboard(listOf("rice", "onion"), have = true, today = today.toEpochDay())
        }
        tap("Cook")
        waitForText("What can I make from my cupboard?")
        tap("What can I make from my cupboard?")
        waitForText("Keep it up to date")
        compose.onAllNodesWithText("I can make", substring = true).onFirst().performClick()
        waitForText("Use up first")
        val note = compose.onAllNodesWithText("In your cupboard a while", substring = true).fetchSemanticsNodes()
            .flatMap { it.config.getOrElseNullable(androidx.compose.ui.semantics.SemanticsProperties.Text) { null }.orEmpty() }.joinToString { it.text }
        assertEquals("In your cupboard a while: chicken thighs (5 days), spinach (5 days).", note)
        // Each suggestion says which of them it would use.
        waitForText("Uses up ")
        assertTrue(shown("Uses up chicken thighs") || shown("Uses up spinach"))
        shot("loop-3-use-up-first")
        // Bought today: nothing has been sitting.
        runBlocking { container.settings.setCupboard(setOf("chicken thigh", "spinach"), mapOf("chicken thigh" to today.toEpochDay(), "spinach" to today.toEpochDay())) }
        compose.waitUntil(10_000) { !shown("Use up first") }
        // The usual list is still there.
        assertTrue(listOf("Ready to cook", "Almost there", "Needs a shop").any(::shown))
    }
}
