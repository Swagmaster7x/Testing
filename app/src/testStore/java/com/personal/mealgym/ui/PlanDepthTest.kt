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
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.OffPlanKind
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.DayTotals
import com.personal.mealgym.domain.PlanAnswers
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.ui.plan.WeekPlanner
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
import kotlin.math.abs
import kotlin.random.Random

/** Day totals against the guide, slots that aren't cooked, guests, and a fill that aims for the guide. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class PlanDepthTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container
    private val today: LocalDate get() = LocalDate.now()
    private val week: LocalDate get() = Dates.weekStart(today)

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    /** The same answers as the onboarding test: a guide of about 1,550 calories and 120 g protein. */
    private val answers = PlanAnswers(goal = "LOSE", sex = "FEMALE", age = 30, heightCm = 165.1, weightKg = 68.04, activity = "LIGHT")

    private fun person(name: String, answers: PlanAnswers? = this.answers, portion: Double = 1.0): Long = runBlocking {
        container.people.create(Profile(0, name, "IRON", portion = portion, planAnswers = answers?.encode()), null, setOf(DayOfWeek.MONDAY)).also {
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

    private fun openPlan() {
        tap("Plan")
        waitForText("Fill my week")
    }

    @Test
    fun eachDayShowsWhatItAddsUpToBesideTheGuide() {
        val id = person("Maya")
        runBlocking {
            // L9 is ~600 cal and 50 g protein; B4 has figures too.
            container.meals.setSlot(id, week, MealSlot.LUNCH, recipe("L9").id)
            container.meals.setSlot(id, week, MealSlot.DINNER, recipe("D16").id)
        }
        openPlan()
        waitForText("Your guide is about 1,550 cal and 120 g protein a day.")
        waitForText("Nothing you eat is logged.")
        val lunch = PlanBuilder.caloriesIn(recipe("L9").nutritionText)!!
        val dinner = PlanBuilder.caloriesIn(recipe("D16").nutritionText)!!
        val expected = DayTotals.text(
            DayTotals.total(listOf(DayTotals.meal(recipe("L9"), 1.0, MealSlot.LUNCH), DayTotals.meal(recipe("D16"), 1.0, MealSlot.DINNER))),
        )
        assertTrue(expected, expected.startsWith("About ${"%,d".format(((lunch + dinner) / 10.0).let { Math.round(it) * 10 })} cal"))
        waitForText(expected)
        shot("plan-1-day-totals")

        // Switched off in Settings (or with nutrition hidden), the totals and the guide line go.
        runBlocking { container.settings.setDayTotals(id, false) }
        compose.waitUntil(10_000) { !shown("Your guide is") }
        assertTrue(!shown(expected))
        runBlocking {
            container.settings.setDayTotals(id, true)
            container.settings.setShowNutrition(id, false)
        }
        compose.waitForIdle()
        assertTrue(!shown("Your guide is"))
    }

    @Test
    fun aSlotCanBeEatingOutLeftoversOrASkip() {
        val id = person("Rae")
        openPlan()
        // Monday's three slots: eating out with a pick, leftovers, a skip.
        tap("+ Add")
        waitForText("Eating out")
        shot("plan-2-picker-chips")
        tap("Eating out")
        waitForText("Just mark it as eating out")
        waitForText("Or pick a place to choose from its better picks")
        tap("Chipotle")
        waitForText("Something else at Chipotle")
        shot("plan-3-eating-out-picks")
        tap("Chicken")
        waitForText("Chipotle: Chicken")
        waitForText("About 180 cal, 32 g protein")

        tap("+ Add")
        waitForText("Leftovers")
        tap("Leftovers")
        compose.waitUntil(10_000) { runBlocking { container.meals.weekOffPlan(id, week) }.size == 2 }
        tap("+ Add")
        waitForText("Skip this meal")
        tap("Skip this meal")
        compose.waitUntil(10_000) { runBlocking { container.meals.weekOffPlan(id, week) }.size == 3 }
        waitForText("Skipping this meal")
        // Leftovers are planned but have no figures; the skip plans nothing.
        waitForText("About 180 cal, 32 g protein, plus 1 meal without figures")
        shot("plan-4-off-plan-day")

        val planned = runBlocking { container.meals.weekOffPlan(id, week) }.sortedBy { it.slot.ordinal }
        assertEquals(listOf(OffPlanKind.EATING_OUT, OffPlanKind.LEFTOVERS, OffPlanKind.SKIP), planned.map { it.kind })
        assertEquals("chipotle", planned[0].restaurantKey)
        assertEquals(180, planned[0].calories)
        assertEquals(32, planned[0].protein)

        // Tapping it offers the place's page, a change, or clearing it; never "Open recipe".
        tap("Chipotle: Chicken")
        waitForText("See this place's better picks")
        assertTrue(!shown("Open recipe"))
        assertTrue(!shown("Cooking for guests"))
        tap("Clear this slot")
        compose.waitUntil(10_000) { runBlocking { container.meals.weekOffPlan(id, week) }.size == 2 }

        // Fill my week leaves the planned leftovers and the skip alone.
        runBlocking { WeekPlanner.fill(container, container.profiles.value.single { it.id == id }, week, week) }
        assertEquals(2, runBlocking { container.meals.weekOffPlan(id, week) }.size)
        assertEquals(19, runBlocking { container.meals.weekEntries(id, week) }.size)
    }

    @Test
    fun cookingForGuestsShowsOnTheTileAndTheShoppingList() {
        val id = person("Kit")
        runBlocking { container.meals.setSlot(id, week, MealSlot.DINNER, recipe("L1").id) }
        openPlan()
        waitForText("Pollo guisado with rice and beans")
        tap("Pollo guisado with rice and beans")
        waitForText("Cooking for guests")
        waitForText("Add servings and the shopping list buys for them too")
        repeat(4) { tap("+") }
        waitForText("4 extra servings, added to the shopping list")
        shot("plan-5-guests")
        // The tile behind the sheet says so too.
        waitForText("+4 for guests")
        assertEquals(4.0, runBlocking { container.meals.weekEntries(id, week) }.single().extraServings, 0.0)
        // One serving plus four guests is five: the recipe serves four, so it's bought twice.
        val list = runBlocking { container.meals.shoppingWeek(id, week, both = false).first() }
        assertEquals("4 lb", list.result.sections.flatMap { it.items }.single { it.key == "chicken thigh" }.amountText)
    }

    @Test
    fun todayShowsAMealOutAndWhatTheDayAddsUpTo() {
        val id = person("Noor")
        runBlocking {
            container.meals.setSlot(id, today, MealSlot.BREAKFAST, recipe("B4").id)
            container.meals.setOffPlan(
                OffPlanMeal(profileId = id, date = today.toString(), slot = MealSlot.LUNCH, kind = OffPlanKind.EATING_OUT, title = "Subway: Veggie Delite, 6 inch", restaurantKey = "subway", calories = 210, protein = 9),
            )
        }
        waitForText("Eating out")
        waitForText("Subway: Veggie Delite, 6 inch")
        scrollTo("Today's plan: about")
        waitForText("Your guide is about 1,550 cal and 120 g protein a day.")
        shot("plan-6-today")
        // History keeps it too.
        compose.onAllNodes(hasContentDescription("History")).onFirst().performClick()
        waitForText("Eating out: Subway: Veggie Delite, 6 inch")
    }

    @Test
    fun fillMyWeekLandsNearTheGuideAndFollowsRatings() {
        val id = person("Ana")
        val ana = container.profiles.value.single { it.id == id }
        val guide = (PlanBuilder.targets(answers) as TargetResult.Ready).targets
        val next = week.plusWeeks(1)
        val loved = recipe("B4")
        val never = recipe("L9")
        runBlocking {
            container.meals.logCooked(id, loved.id, today, CookRating.LOVED)
            container.meals.logCooked(id, never.id, today, CookRating.NOT_AGAIN)
            var gap = 0.0
            var days = 0
            repeat(6) { seed ->
                val start = next.plusWeeks(seed.toLong())
                val result = WeekPlanner.fill(container, ana, start, start, random = Random(seed))
                assertEquals(21, result.filled)
                val recipes = container.meals.recipes.first().associateBy { it.id }
                val entries = container.meals.weekEntries(id, start)
                assertTrue("a recipe rated Not again is never picked", entries.none { it.recipeId == never.id })
                for (day in Dates.weekDays(start)) {
                    val total = DayTotals.total(
                        entries.filter { it.date == day.toString() }.map { DayTotals.meal(recipes.getValue(it.recipeId), ana.portion, it.slot) },
                    )
                    // The first four soups have no figures; such days are judged on the rest.
                    if (total.uncounted == 0) {
                        gap += abs(total.calories - guide.calories).toDouble() / guide.calories
                        days++
                    }
                }
            }
            // Three whole servings a day average well over the guide; aiming for it keeps planned days close.
            assertTrue("average gap ${gap / days} over $days days", gap / days < 0.12)
        }
    }
}
