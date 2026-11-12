package com.personal.mealgym.ui

import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithContentDescription
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
import com.personal.mealgym.ui.theme.CustomLook
import com.personal.mealgym.ui.theme.Looks
import com.personal.mealgym.ui.theme.TypeStyle
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

/** Settings > Look: ready-made looks apply at once; the creator makes and applies your own. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class LooksFlowTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container
    private var alex = 0L

    @Before
    fun alexWithAPlannedDay() {
        runBlocking {
            withTimeout(30_000) { container.ready.first { it } }
            val templates = container.seed.seed.workoutTemplates
            alex = container.people.create(Profile(0, "Alex", Profile.THEME_IRON), templates.first(), DayOfWeek.entries.toSet())
            val r = container.db.recipeDao().allRecipes().associateBy { it.seedKey }
            val today = LocalDate.now()
            container.meals.setSlot(alex, today, MealSlot.BREAKFAST, r.getValue("B4").id)
            container.meals.fillBatch(alex, Dates.weekStart(today), MealSlot.LUNCH, r.getValue("L2"))
            container.meals.setSlot(alex, today, MealSlot.DINNER, r.getValue("D3").id)
            container.settings.setActiveProfile(alex)
            withTimeout(10_000) { container.opening.first { (it as? Opening.Open)?.profile?.id == alex } }
        }
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
    }

    private fun alex(): Profile = container.profiles.value.single { it.id == alex }

    private fun waitFor(condition: () -> Boolean) {
        compose.waitUntil(10_000) { condition() }
        compose.waitForIdle()
    }

    private fun scrollTo(matcher: androidx.compose.ui.test.SemanticsMatcher) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(matcher)
        compose.waitForIdle()
    }

    @Test
    fun pickAReadyMadeLookThenMakeYourOwn() {
        compose.onAllNodes(hasContentDescription("Settings")).onFirst().performClick()
        compose.waitUntil(10_000) { compose.onAllNodesWithText("Change look").fetchSemanticsNodes().isNotEmpty() }
        compose.onAllNodesWithText("Change look").onFirst().performClick()
        compose.waitUntil(10_000) { compose.onAllNodesWithText("Ready-made").fetchSemanticsNodes().isNotEmpty() }
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/looks-01-picker.png")

        // A ready-made look applies straight away.
        scrollTo(hasContentDescription("Deep sea look"))
        compose.onAllNodesWithContentDescription("Deep sea look").onFirst().performClick()
        waitFor { alex().themeKey == "OCEAN" }
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/looks-02-deep-sea.png")
        waitForMessageToClear()

        // The creator: pick a colour, a typewriter font and sparkles, then use it.
        scrollTo(hasContentDescription("Create your own look"))
        compose.onAllNodesWithContentDescription("Create your own look").onFirst().performClick()
        compose.waitUntil(10_000) { compose.onAllNodesWithText("Make your own").fetchSemanticsNodes().isNotEmpty() }
        assertEquals("OCEAN", alex().themeKey)
        scrollTo(hasContentDescription("Colour 6E44C9"))
        compose.onAllNodesWithContentDescription("Colour 6E44C9").onFirst().performClick()
        scrollTo(hasText("Typewriter"))
        compose.onAllNodesWithText("Typewriter").onFirst().performClick()
        scrollTo(hasText("Sparkles"))
        compose.onAllNodesWithText("Sparkles").onFirst().performClick()
        compose.waitForIdle()
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/looks-03-creator.png")
        scrollTo(hasText("Use this look"))
        compose.onAllNodesWithText("Use this look").onFirst().performClick()

        waitFor { alex().themeKey == Looks.CUSTOM }
        val made = CustomLook.decode(alex().customLook)!!
        assertEquals(0xFF6E44C9, made.primary)
        assertEquals(TypeStyle.TYPEWRITER.name, made.type)
        assertTrue(made.sparkles)
        compose.waitUntil(10_000) { compose.onAllNodesWithText("This look is on").fetchSemanticsNodes().isNotEmpty() }
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/looks-04-own-look-on.png")
        waitForMessageToClear()

        // Back to a ready-made look keeps the creation for later.
        scrollTo(hasContentDescription("Dark fantasy look"))
        compose.onAllNodesWithContentDescription("Dark fantasy look").onFirst().performClick()
        waitFor { alex().themeKey == "IRON" }
        assertEquals(made, CustomLook.decode(alex().customLook))
    }

    /** "Deep sea is on." sits over the bottom of the screen for a few seconds. */
    private fun waitForMessageToClear() {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(" is on.", substring = true).fetchSemanticsNodes().isEmpty() }
        compose.waitForIdle()
    }
}
