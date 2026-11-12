package com.personal.mealgym.ui

import androidx.compose.ui.test.hasScrollAction
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
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.DayOfWeek
import java.time.LocalDate

/**
 * Phone screenshots for the Play listing, 1080 x 1920. Saved by `./gradlew recordRoborazziStoreDebug`;
 * tools/store_graphics.py adds captions. Two people: Alex (dark fantasy) and Sam (Y2K glam).
 */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-night-xxhdpi")
class StoreListingScreenshots {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container
    private var alex = 0L
    private var sam = 0L

    @Before
    fun twoPeopleAndAPlannedWeek() {
        runBlocking {
            withTimeout(30_000) { container.ready.first { it } }
            val templates = container.seed.seed.workoutTemplates.associateBy { it.key }
            val everyDay = DayOfWeek.entries.toSet()
            alex = container.people.create(Profile(0, "Alex", Profile.THEME_IRON), templates["upper-lower-4"], everyDay)
            sam = container.people.create(
                Profile(0, "Sam", Profile.THEME_GLAM, snackSlot = true, portion = 0.75, tipsStyle = Profile.TIPS_EASIER, weekBadges = true),
                templates["glute-3"],
                setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY),
            )
            val r = container.db.recipeDao().allRecipes().associateBy { it.seedKey }
            val today = LocalDate.now()
            val ws = Dates.weekStart(today)
            val meals = container.meals
            Dates.weekDays(ws).forEachIndexed { i, day ->
                meals.setSlot(alex, day, MealSlot.BREAKFAST, r.getValue(listOf("B1", "B2", "B3", "B4")[i % 4]).id)
                meals.setSlot(sam, day, MealSlot.BREAKFAST, r.getValue(listOf("B4", "B2")[i % 2]).id)
                meals.setSlot(sam, day, MealSlot.SNACK, r.getValue(listOf("SN1", "SN2", "SN3")[i % 3]).id)
            }
            meals.fillBatch(alex, ws, MealSlot.LUNCH, r.getValue("L1"))
            meals.fillBatch(alex, ws.plusDays(4), MealSlot.LUNCH, r.getValue("L6"))
            meals.fillBatch(sam, ws, MealSlot.LUNCH, r.getValue("L2"))
            meals.fillBatch(sam, ws.plusDays(4), MealSlot.LUNCH, r.getValue("L4"))
            listOf("D3", "D2", "D4", "D7", "D5", "D1", "D10").forEachIndexed { i, key ->
                meals.setSlot(alex, ws.plusDays(i.toLong()), MealSlot.DINNER, r.getValue(key).id)
                meals.setSlot(sam, ws.plusDays(i.toLong()), MealSlot.DINNER, r.getValue(key).id)
            }
            container.settings.setShoppingBoth(alex, true)
        }
    }

    private fun open(id: Long) {
        runBlocking {
            container.settings.setActiveProfile(id)
            withTimeout(10_000) { container.opening.first { (it as? Opening.Open)?.profile?.id == id } }
        }
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    @Test
    fun alexDarkFantasy() {
        // Two things already in the cupboard, so the shopping list shows its "check you have enough" label.
        runBlocking { container.settings.setCupboard(setOf("chicken breast", "egg")) }
        open(alex)
        waitForText("Breakfast")
        shot("listing-1-today")
        tab("Plan")
        waitForText("Fill my week")
        shot("listing-2-plan")
        tab("Cook")
        waitForText("Cooking this week")
        compose.onAllNodesWithText("Pollo guisado with rice and beans").onFirst().performClick()
        waitForText("Ingredients")
        shot("listing-3-recipe")
        compose.onAllNodesWithText("Shopping list").onFirst().performClick()
        waitForText("Both of us")
        waitForText("both meal plans")
        waitForText("Protein")
        shot("listing-4-shopping")
        repeat(2) {
            compose.onAllNodes(androidx.compose.ui.test.hasContentDescription("Back")).onFirst().performClick()
            compose.waitForIdle()
        }
        tab("Gym")
        compose.waitUntil(15_000) {
            listOf("Do a different day", "Train anyway").any { compose.onAllNodesWithText(it).fetchSemanticsNodes().isNotEmpty() }
        }
        if (compose.onAllNodesWithText("Train anyway").fetchSemanticsNodes().isNotEmpty()) {
            compose.onAllNodesWithText("Train anyway").onFirst().performClick()
        }
        waitForText("Do a different day")
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose.onAllNodesWithText("2").onFirst().performClick()
        compose.waitForIdle()
        shot("listing-5-gym")
    }

    @Test
    @Config(qualifiers = "w360dp-h640dp-notnight-xxhdpi")
    fun samY2kGlam() {
        open(sam)
        waitForText("Snack")
        shot("listing-6-glam-today")
    }

    @Test
    fun cookFromTheCupboard() {
        runBlocking {
            container.settings.setCupboard(setOf("chicken breast", "salmon", "egg", "broccoli", "bell pepper", "garlic", "ginger", "scallion", "onion", "rice", "black bean", "lime", "avocado"))
        }
        open(alex)
        tab("Cook")
        waitForText("What can I make from my cupboard?")
        compose.onAllNodesWithText("What can I make from my cupboard?").onFirst().performClick()
        waitForText("Search ingredients")
        compose.onAllNodesWithText("I can make", substring = true).onFirst().performClick()
        waitForText("To buy:")
        shot("listing-9-cupboard")
    }

    /** The last page of setup: what the answers came to. Shown in the Deep sea look. */
    @Test
    @Config(qualifiers = "w360dp-h640dp-notnight-xxhdpi")
    fun answersBecomeAPlan() {
        val jo = runBlocking { container.people.create(Profile(0, "Jo", "OCEAN"), null, setOf(DayOfWeek.MONDAY)) }
        open(jo)
        compose.onAllNodes(androidx.compose.ui.test.hasContentDescription("Settings")).onFirst().performClick()
        waitForText("Add a person")
        compose.onAllNodesWithText("Add a person").onFirst().performClick()
        waitForText("What should the app call you?")
        compose.onAllNodes(androidx.compose.ui.test.hasSetTextAction()).onFirst().performTextInput("Riley")
        next()
        waitForText("What are you aiming for?")
        compose.onAllNodesWithText("Build muscle").onFirst().performClick()
        compose.onAllNodesWithText("Male").onFirst().performClick()
        type("Age", "29")
        type("Height (ft)", "5")
        type("and inches", "11")
        type("Weight (lb)", "170")
        next()
        waitForText("Favourite cuisines")
        compose.onAllNodesWithText("Asian").onFirst().performClick()
        compose.onAllNodesWithText("Hispanic").onFirst().performClick()
        next()
        waitForText("Where will you train?")
        compose.onAllNodesWithText("I've trained before").onFirst().performClick()
        compose.onAllNodesWithText("4 days").onFirst().performClick()
        next()
        waitForText("Your daily guide")
        shot("listing-10-your-plan")
    }

    private fun next() {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(hasText("Next"))
        compose.onAllNodesWithText("Next").onFirst().performClick()
        compose.waitForIdle()
    }

    private fun type(label: String, text: String) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(hasText(label))
        compose.onAllNodes(hasText(label) and androidx.compose.ui.test.hasSetTextAction()).onFirst().performTextInput(text)
        compose.waitForIdle()
    }

    private fun tab(label: String) {
        compose.onAllNodesWithText(label).onFirst().performClick()
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
