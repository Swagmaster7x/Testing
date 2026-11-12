package com.personal.mealgym.ui

import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollToNode
import androidx.compose.ui.test.performTextInput
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

/** The store edition from first launch: set yourself up, then add someone else. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w400dp-h860dp-xhdpi")
class StoreFlowTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun waitForSeed() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    @Test
    fun firstLaunchSetsUpThePersonAndTheirStarterPlan() {
        waitForText("Welcome to Meal & Gym")
        assertEquals(Opening.FirstPerson, container.opening.value)
        shot("store-00-welcome")

        compose.onAllNodes(hasSetTextAction()).onFirst().performTextInput("Sam")
        compose.onAllNodesWithText("Y2K glam").onFirst().performClick()
        scrollTo("Glute focus, 3 days")
        compose.onAllNodesWithText("Glute focus, 3 days").onFirst().performClick()
        scrollTo("Snack slot")
        compose.onAllNodesWithText("Snack slot").onFirst().performClick()
        compose.waitForIdle()
        shot("store-01-welcome-filled")
        scrollTo("Start")
        compose.onAllNodesWithText("Start").onFirst().performClick()

        val sam = runBlocking { withTimeout(10_000) { container.opening.first { it is Opening.Open } } as Opening.Open }.profile
        assertEquals("Sam", sam.name)
        assertEquals(Profile.THEME_GLAM, sam.themeKey)
        assertEquals("glute-3", sam.templateKey)
        assertTrue(sam.snackSlot)
        runBlocking {
            assertEquals(3, container.db.workoutDao().getDays(sam.id).size)
            assertEquals(
                setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY),
                container.settings.current(sam.id).trainingWeekdays,
            )
        }
        waitForText("Snack")
        shot("store-02-today")
    }

    @Test
    fun peopleInSettingsAndTheSharedShoppingList() {
        val (alex, jo) = runBlocking {
            val templates = container.seed.seed.workoutTemplates
            val alex = container.people.create(Profile(0, "Alex", Profile.THEME_IRON), templates.first(), setOf(DayOfWeek.MONDAY))
            val jo = container.people.create(Profile(0, "Jo", Profile.THEME_GLAM, portion = 0.5), null, setOf(DayOfWeek.TUESDAY))
            container.settings.setActiveProfile(alex)
            withTimeout(10_000) { container.opening.first { (it as? Opening.Open)?.profile?.id == alex } }
            val recipes = container.db.recipeDao().allRecipes().associateBy { it.seedKey }
            val ws = Dates.weekStart(LocalDate.now())
            container.meals.fillBatch(alex, ws, MealSlot.LUNCH, recipes.getValue("L1"))
            container.meals.fillBatch(jo, ws, MealSlot.LUNCH, recipes.getValue("L1"))
            alex to jo
        }
        assertEquals(listOf(alex, jo), container.profiles.value.map { it.id })
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }

        compose.onAllNodes(androidx.compose.ui.test.hasContentDescription("Settings")).onFirst().performClick()
        waitForText("People")
        waitForText("Open now")
        waitForText("Remove ads")
        shot("store-03-people")

        compose.onAllNodesWithText("Add a person").onFirst().performClick()
        waitForText("Starter workout plan")
        shot("store-04-add-person")
        compose.onAllNodesWithText("Add a person").onFirst().assertExists()
    }

    @Test
    fun bannersStayOffWorkoutsAndCooking() {
        assertEquals(setOf(Routes.PLAN, Routes.COOK, Routes.RECIPE, Routes.HISTORY, Routes.CUPBOARD), Routes.withBanner)
        // Ads wait for consent: nothing is requested in a test run.
        assertEquals(false, container.monetization.adsRemoved.value)
        assertTrue(container.monetization.available)
    }

    private fun scrollTo(text: String) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(hasText(text))
        compose.waitForIdle()
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    private fun shot(name: String) {
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")
    }
}
