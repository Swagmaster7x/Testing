package com.personal.mealgym.ui

import androidx.compose.ui.test.hasContentDescription
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
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Avoid
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.PlanAnswers
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.answers
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withTimeout
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.DayOfWeek
import java.time.LocalDate

/** The setup questions build a plan: a daily guide, a workout plan, meal sizes and a first week of meals. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class OnboardingTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    private fun scrollTo(text: String) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(hasText(text))
        compose.waitForIdle()
    }

    private fun tap(text: String) {
        scrollTo(text)
        compose.onAllNodesWithText(text).onFirst().performClick()
        compose.waitForIdle()
    }

    private fun type(label: String, text: String) {
        scrollTo(label)
        compose.onAllNodes(hasText(label) and hasSetTextAction()).onFirst().performTextInput(text)
        compose.waitForIdle()
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    private fun shot(name: String) = compose.onRoot().captureRoboImage("build/outputs/roborazzi/$name.png")

    @Test
    fun answersBecomeAPlan() {
        waitForText("Welcome to Meal & Gym")
        compose.onAllNodes(hasSetTextAction()).onFirst().performTextInput("Maya")
        tap("Next")

        waitForText("What are you aiming for?")
        tap("Lose fat")
        tap("Female")
        type("Age", "30")
        type("Height (ft)", "5")
        type("and inches", "5")
        type("Weight (lb)", "150")
        tap("Lightly active")
        scrollTo("About you")
        shot("onboarding-1-goal")
        tap("Next")

        waitForText("Favourite cuisines")
        tap("Asian")
        tap("Shellfish")
        tap("Pork")
        shot("onboarding-2-food")
        tap("Next")

        waitForText("Where will you train?")
        tap("At home")
        tap("New to lifting")
        tap("3 days")
        shot("onboarding-3-training")
        tap("Next")

        // Resting 10*68.04 + 6.25*165.1 - 5*30 - 161 = 1,401; lightly active 1,927; less 20% = 1,541.
        waitForText("Your daily guide")
        waitForText("about 1,550 a day")
        waitForText("about 120 g a day or more")
        waitForText("Kept off your plan: shellfish and pork.")
        shot("onboarding-4-plan")
        scrollTo("At home, 3 days (suggested)")
        tap("Start")

        val maya = runBlocking { (withTimeout(10_000) { container.opening.first { it is Opening.Open } } as Opening.Open).profile }
        val answers = maya.answers
        assertNotNull(answers)
        answers!!
        assertEquals("LOSE", answers.goal)
        assertEquals(30, answers.age)
        assertEquals(165.1, answers.heightCm!!, 0.05)
        assertEquals(68.04, answers.weightKg!!, 0.05)
        assertEquals(setOf(Avoid.SHELLFISH, Avoid.PORK), answers.avoids)
        assertEquals("home-3", maya.templateKey)
        runBlocking {
            assertEquals(3, container.db.workoutDao().getDays(maya.id).size)
            val s = container.settings.current(maya.id)
            assertEquals(setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY), s.trainingWeekdays)
            assertEquals(WeightUnit.LB, s.weightUnit)
            // The meal setup is the one nearest the guide.
            val library = container.meals.recipes.first()
            val suggested = PlanBuilder.mealSetup(1550, library)
            assertEquals(suggested.portion, maya.portion, 0.0)
            assertEquals(suggested.snack, maya.snackSlot)
            assertTrue("portion is never below three-quarters", maya.portion >= 0.75)
        }

        // The first week is planned, with nothing she avoids.
        waitForText("Breakfast")
        val planned = runBlocking {
            withTimeout(10_000) {
                var entries = container.meals.weekEntries(maya.id, Dates.weekStart(LocalDate.now()))
                while (entries.isEmpty()) {
                    kotlinx.coroutines.delay(100)
                    entries = container.meals.weekEntries(maya.id, Dates.weekStart(LocalDate.now()))
                }
                entries
            }
        }
        val avoided = runBlocking { container.meals.conflictsFor(maya.id).first() }
        assertTrue("some recipes contain pork or shellfish", avoided.isNotEmpty())
        assertTrue("none of them were planned", planned.none { it.recipeId in avoided })
        scrollTo("Daily guide")
        shot("onboarding-5-today")
    }

    @Test
    fun under18GetsAPlanButNoNumbers() {
        waitForText("Welcome to Meal & Gym")
        compose.onAllNodes(hasSetTextAction()).onFirst().performTextInput("Sam")
        tap("Next")
        waitForText("What are you aiming for?")
        tap("Lose fat")
        type("Age", "16")
        type("Height (ft)", "5")
        type("Weight (lb)", "140")
        tap("Next")
        waitForText("Favourite cuisines")
        tap("Next")
        waitForText("Where will you train?")
        tap("Next")
        waitForText("Your daily guide")
        waitForText("If you're under 18")
        assertTrue(compose.onAllNodesWithText("Calories").fetchSemanticsNodes().isEmpty())
        shot("onboarding-6-under-18")
    }

    @Test
    fun avoidedFoodsStayOutOfPickersAndAreFlaggedOnRecipes() {
        val id = runBlocking {
            val answers = PlanAnswers(avoid = listOf("DAIRY", "GLUTEN"))
            container.people.create(Profile(0, "Kai", "IRON", planAnswers = answers.encode()), null, setOf(DayOfWeek.MONDAY)).also {
                container.settings.setActiveProfile(it)
                withTimeout(10_000) { container.opening.first { o -> (o as? Opening.Open)?.profile?.id == it } }
            }
        }
        val recipes = runBlocking { container.db.recipeDao().allRecipes().associateBy { it.seedKey } }
        val avoided = runBlocking { container.meals.conflictsFor(id).first() }
        // Greek yogurt bowl (dairy, granola) and the cod dinner (neither).
        assertEquals(setOf(Avoid.DAIRY, Avoid.GLUTEN), avoided[recipes.getValue("B4").id])
        assertTrue(recipes.getValue("D14").id !in avoided)
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }

        // Picking breakfast: the yogurt bowl isn't offered; a breakfast without either is.
        compose.onAllNodesWithText("Pick").onFirst().performClick()
        waitForText("Egg white and chorizo breakfast tacos")
        assertTrue(compose.onAllNodesWithText("Greek yogurt power bowl").fetchSemanticsNodes().isEmpty())
        shot("allergy-1-picker")
        compose.onAllNodesWithText("Egg white and chorizo breakfast tacos").onFirst().performClick()
        compose.waitForIdle()

        // Cook leaves them out and says so, and the recipe page says why.
        compose.onAllNodesWithText("Cook").onFirst().performClick()
        waitForText("All recipes")
        scrollTo("${avoided.size} recipes with something you avoid are left out.")
        tap("Show them")
        scrollTo("Greek yogurt power bowl")
        shot("allergy-2-cook-not-for-me")
        compose.onAllNodesWithText("Greek yogurt power bowl").onFirst().performClick()
        waitForText("Contains dairy and wheat/gluten, which you asked to avoid.")
        shot("allergy-3-recipe-warning")

        // Fill my week never picks one.
        runBlocking {
            val kai = container.profiles.value.single { it.id == id }
            val week = Dates.weekStart(LocalDate.now())
            com.personal.mealgym.ui.plan.WeekPlanner.fill(container, kai, week.plusWeeks(1), week.plusWeeks(1))
            val planned = container.meals.weekEntries(id, week.plusWeeks(1))
            assertEquals(21, planned.size)
            assertTrue(planned.none { it.recipeId in avoided })
        }
    }

    @Test
    fun redoingTheQuestionsFromSettings() {
        val id = runBlocking {
            val templates = container.seed.seed.workoutTemplates
            container.people.create(Profile(0, "Ana", "IRON"), templates.first(), setOf(DayOfWeek.SATURDAY)).also {
                container.settings.setActiveProfile(it)
                withTimeout(10_000) { container.opening.first { o -> (o as? Opening.Open)?.profile?.id == it } }
            }
        }
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        compose.onAllNodes(hasContentDescription("Settings")).onFirst().performClick()
        waitForText("My plan")
        waitForText("Not set up yet")
        shot("onboarding-7-settings-my-plan")
        tap("Set up")

        waitForText("What are you aiming for?")
        tap("Build muscle")
        tap("Male")
        tap("Kilograms and cm")
        type("Age", "28")
        type("Height (cm)", "180")
        type("Weight (kg)", "75")
        tap("Next")
        waitForText("Favourite cuisines")
        tap("Dairy")
        tap("Next")
        waitForText("Where will you train?")
        tap("I've trained before")
        tap("4 days")
        tap("Next")

        waitForText("What should change?")
        // Resting 750 + 1125 - 140 + 5 = 1,740; lightly active 2,392; plus 10% = 2,632.
        waitForText("about 2,650 a day")
        tap("Replace my workout days with \"Upper / lower, 4 days\"")
        shot("onboarding-8-review")
        tap("Save my plan")

        compose.waitUntil(10_000) { container.profiles.value.single { it.id == id }.answers != null }
        val ana = container.profiles.value.single { it.id == id }
        assertEquals(PlanAnswers(goal = "BUILD", sex = "MALE", age = 28, heightCm = 180.0, weightKg = 75.0, avoid = listOf("DAIRY"), experience = "SOME", daysPerWeek = 4, metric = true), ana.answers)
        compose.waitUntil(10_000) { container.profiles.value.single { it.id == id }.templateKey == "upper-lower-4" }
        runBlocking {
            assertEquals(4, container.db.workoutDao().getDays(id).size)
            assertEquals(4, container.settings.current(id).trainingWeekdays.size)
            assertEquals(WeightUnit.KG, container.settings.current(id).weightUnit)
        }
        assertEquals(Profile.TIPS_EASIER, container.profiles.value.single { it.id == id }.tipsStyle)
        waitForText("About 2,650 calories and 135 g protein a day")
        waitForText("Avoiding dairy")
    }
}
