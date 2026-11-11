package com.personal.mealgym.ui

import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performScrollToNode
import androidx.compose.ui.test.hasScrollAction
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.captureRoboImage
import com.personal.mealgym.MainActivity
import com.personal.mealgym.MealGymApp
import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.SideState
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.domain.Dates
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.LocalDate

/**
 * Opens each main screen of the real app with a planned week, as a smoke test that they render.
 * Run `./gradlew recordRoborazziDebug` to also save PNGs to app/build/outputs/roborazzi.
 *
 * Dialog tests use Robolectric's default screen size: with a custom width/height qualifier,
 * Robolectric never goes idle once a dialog holding a text field opens (even a bare one).
 */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w400dp-h860dp-xhdpi")
class ScreenshotTest {

    @Suppress("DEPRECATION") // The v2 rule changes dispatcher timing; this one is still supported.
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    private fun openSide(profileId: Long) = runBlocking {
        container.settings.setActiveProfile(profileId)
        withTimeout(10_000) { container.sideState.first { it == SideState.Chosen(profileId) } }
    }

    @Before
    fun planAWeek() = runBlocking {
        withTimeout(30_000) { container.ready.first { it } }
        openSide(Profiles.SWAG)
        val swag = Profiles.SWAG
        val recipes = container.db.recipeDao().allRecipes().associateBy { it.seedKey }
        val today = LocalDate.now()
        val weekStart = Dates.weekStart(today)
        val meals = container.meals
        Dates.weekDays(weekStart).forEachIndexed { i, day ->
            meals.setSlot(swag, day, MealSlot.BREAKFAST, recipes.getValue(listOf("B1", "B2", "B3", "B4")[i % 4]).id)
        }
        meals.fillBatch(swag, weekStart, MealSlot.LUNCH, recipes.getValue("L1"))
        meals.setSlot(swag, weekStart, MealSlot.DINNER, recipes.getValue("D3").id)
        meals.setSlot(swag, weekStart.plusDays(1), MealSlot.DINNER, recipes.getValue("S1").id)
        meals.setSlot(swag, today, MealSlot.DINNER, recipes.getValue("D2").id)
    }

    @Test
    fun chooserThenAshleysSide() {
        runBlocking {
            container.settings.clearActiveProfile()
            withTimeout(10_000) { container.sideState.first { it == SideState.NotChosen } }
        }
        waitForText("Whose phone is this?")
        shot("00-chooser")
        compose.onAllNodesWithText("Ashley's Side").onFirst().performClick()
        waitForText("Snack")
        shot("00b-ashley-today")
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    private fun tab(label: String) {
        compose.onAllNodesWithText(label).onFirst().performClick()
        compose.waitForIdle()
    }

    private fun shot(name: String) = compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")

    @Test
    fun today() {
        waitForText("Thai basil chicken")
        shot("1-today")
    }

    @Test
    fun plan() {
        tab("Plan")
        waitForText("Repeat last week")
        waitForText("Pollo guisado")
        shot("2-plan")
    }

    @Test
    fun recipeAndShoppingList() {
        tab("Cook")
        waitForText("Cooking this week")
        shot("3-cook")
        compose.onAllNodesWithText("Pollo guisado with rice and beans").onFirst().performClick()
        waitForText("Ingredients")
        shot("4-recipe")
        compose.onAllNodesWithText("Shopping list").onFirst().performClick()
        waitForText("Protein")
        shot("5-shopping")
    }

    private fun startWorkout() {
        tab("Gym")
        waitForText("Tips")
        if (compose.onAllNodesWithText("Train anyway").fetchSemanticsNodes().isNotEmpty()) {
            compose.onAllNodesWithText("Train anyway").onFirst().performClick()
        }
        waitForText("Do a different day")
    }

    @Test
    fun gym() {
        tab("Gym")
        waitForText("Tips")
        shot("6-gym")
        startWorkout()
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose.onAllNodesWithText("Smith machine bench").onFirst().performClick()
        compose.waitForIdle()
        shot("7-gym-workout")
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun gymCheckIn() {
        startWorkout()
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("Finish workout"))
        compose.onAllNodesWithText("Finish workout").onFirst().performClick()
        waitForText("How did it go?")
        shot("8-checkin")
        compose.onAllNodesWithText("Great").onFirst().performClick()
        compose.onAllNodesWithText("Save").onFirst().performClick()
        waitForText("Done today")
        shot("8b-gym-done")
    }

    @Test
    fun sauna() {
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("Open"))
        compose.onAllNodesWithText("Open").onFirst().performClick()
        waitForText("How long?")
        shot("9-sauna")
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun saunaLogByHand() {
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("Open"))
        compose.onAllNodesWithText("Open").onFirst().performClick()
        waitForText("How long?")
        compose.onAllNodesWithText("Log sauna time by hand").onFirst().performClick()
        waitForText("Minutes")
        shot("10-sauna-log")
    }

    @Test
    @Config(qualifiers = "w400dp-h860dp-night-xhdpi")
    fun darkTheme() {
        waitForText("Thai basil chicken")
        shot("13-today-dark")
        startWorkout()
        shot("14-gym-dark")
    }

    @Test
    @Config(qualifiers = "w400dp-h860dp-night-xhdpi")
    fun darkRecipeAndShopping() {
        tab("Cook")
        waitForText("Cooking this week")
        compose.onAllNodesWithText("Pollo guisado with rice and beans").onFirst().performClick()
        waitForText("Ingredients")
        shot("15-recipe-dark")
        compose.onAllNodesWithText("Shopping list").onFirst().performClick()
        waitForText("Protein")
        shot("16-shopping-dark")
    }

    @Test
    @Config(qualifiers = "w400dp-h860dp-night-xhdpi")
    fun darkPlanAndSauna() {
        tab("Plan")
        waitForText("Pollo guisado")
        shot("17-plan-dark")
        tab("Today")
        compose.onNode(hasScrollAction()).performScrollToNode(hasText("Open"))
        compose.onAllNodesWithText("Open").onFirst().performClick()
        waitForText("How long?")
        shot("18-sauna-dark")
    }

    @Test
    fun history() {
        compose.onAllNodes(androidx.compose.ui.test.hasContentDescription("History")).onFirst().performClick()
        waitForText("Breakfast")
        shot("12-history")
    }

    @Test
    fun settings() {
        compose.onAllNodesWithContentDescriptionCompat("Settings")
        waitForText("Training days")
        shot("11-settings")
    }

    private fun androidx.compose.ui.test.junit4.AndroidComposeTestRule<*, *>.onAllNodesWithContentDescriptionCompat(desc: String) {
        onAllNodes(androidx.compose.ui.test.hasContentDescription(desc)).onFirst().performClick()
        waitForIdle()
    }
}
