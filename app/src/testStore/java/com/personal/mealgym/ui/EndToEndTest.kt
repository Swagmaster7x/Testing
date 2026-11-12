package com.personal.mealgym.ui

import androidx.compose.ui.test.hasContentDescription
import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.hasSetTextAction
import androidx.compose.ui.test.hasText
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithContentDescription
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
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.ui.theme.CustomLook
import com.personal.mealgym.ui.theme.Looks
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

/** QA run 4: whole journeys through the store edition, with looks. */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class EndToEndTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    private fun opened(): Profile = runBlocking {
        (withTimeout(10_000) { container.opening.first { it is Opening.Open } } as Opening.Open).profile
    }

    private fun scrollTo(matcher: androidx.compose.ui.test.SemanticsMatcher) {
        compose.onAllNodes(hasScrollAction()).onFirst().performScrollToNode(matcher)
        compose.waitForIdle()
    }

    private fun waitForText(text: String) {
        compose.waitUntil(15_000) { compose.onAllNodesWithText(text, substring = true).fetchSemanticsNodes().isNotEmpty() }
        compose.waitForIdle()
    }

    @Test
    fun firstLaunchWithALookOfYourOwn() {
        waitForText("Welcome to Meal & Gym")
        compose.onAllNodes(hasSetTextAction()).onFirst().performTextInput("Rae")
        scrollTo(hasText("Create your own"))
        compose.onAllNodesWithText("Create your own").onFirst().performClick()
        waitForText("Make your own")
        scrollTo(hasContentDescription("Green"))
        compose.onAllNodesWithContentDescription("Green").onFirst().performClick()
        scrollTo(hasText("Always dark"))
        compose.onAllNodesWithText("Always dark").onFirst().performClick()
        compose.waitForIdle()
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/e2e-01-setup-own-look.png")
        scrollTo(hasText("Start"))
        compose.onAllNodesWithText("Start").onFirst().performClick()

        val rae = opened()
        assertEquals("Rae", rae.name)
        assertEquals(Looks.CUSTOM, rae.themeKey)
        val made = CustomLook.decode(rae.customLook)
        assertNotNull(made)
        made!!
        assertEquals(0xFF2E8B3E, made.primary)
        assertEquals("DARK", made.mode)
        waitForText("Breakfast")
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/e2e-02-today-own-look.png")
    }

    @Test
    fun switchingAndRemovingPeopleKeepsEachLook() {
        val (ana, ben) = runBlocking {
            val ana = container.people.create(Profile(0, "Ana", "OCEAN"), null, setOf(DayOfWeek.MONDAY))
            val ben = container.people.create(
                Profile(0, "Ben", Looks.CUSTOM, customLook = CustomLook(primary = 0xFFD62828, type = "SPORT").encode()),
                null,
                setOf(DayOfWeek.TUESDAY),
            )
            container.settings.setActiveProfile(ana)
            ana to ben
        }
        assertEquals("OCEAN", opened().themeKey)
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }

        // Switch to Ben from Settings > People: the app takes Ben's look.
        compose.onAllNodes(hasContentDescription("Settings")).onFirst().performClick()
        waitForText("Tap to switch")
        compose.onAllNodesWithText("Ben").onFirst().performClick()
        compose.waitUntil(10_000) { (container.opening.value as? Opening.Open)?.profile?.id == ben }
        assertEquals(Looks.CUSTOM, opened().themeKey)
        compose.waitUntil(15_000) { compose.onAllNodesWithText("Today").fetchSemanticsNodes().isNotEmpty() }
        compose.onRoot().captureRoboImage("build/outputs/roborazzi/e2e-03-ben.png")

        // Remove Ben while he's open: the app moves to Ana, in her look, and nothing of Ben's is left.
        compose.onAllNodes(hasContentDescription("Settings")).onFirst().performClick()
        waitForText("People")
        compose.onAllNodesWithText("Edit").fetchSemanticsNodes().size.let { assertEquals(2, it) }
        compose.onAllNodesWithText("Edit")[1].performClick()
        waitForText("Remove Ben")
        scrollTo(hasText("Remove Ben"))
        compose.onAllNodesWithText("Remove Ben").onFirst().performClick()
        waitForText("Their meal plan")
        compose.onAllNodesWithText("Remove").onFirst().performClick()
        compose.waitUntil(10_000) { container.profiles.value.none { it.id == ben } }
        compose.waitUntil(10_000) { (container.opening.value as? Opening.Open)?.profile?.id == ana }
        assertEquals("OCEAN", opened().themeKey)
        runBlocking { assertTrue(container.db.workoutDao().getDays(ben).isEmpty()) }
    }

    @Test
    fun statusBarIconsFollowTheLookNotThePhone() {
        // The phone is in light mode (the default here). Neon arcade is always dark.
        val ana = runBlocking {
            container.people.create(Profile(0, "Ana", "NEON"), null, setOf(DayOfWeek.MONDAY)).also { container.settings.setActiveProfile(it) }
        }
        assertEquals(ana, opened().id)
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        fun lightIcons(): Boolean {
            val window = compose.activity.window
            return !androidx.core.view.WindowCompat.getInsetsController(window, window.decorView).isAppearanceLightStatusBars
        }
        assertTrue("light icons on an always-dark look", lightIcons())
        runBlocking { container.people.setLook(ana, "ARCTIC") }
        compose.waitUntil(10_000) { !lightIcons() }
        assertTrue("dark icons on a light look", !lightIcons())
    }

    @Test
    fun theCreatorSurvivesTurningThePhone() {
        val ana = runBlocking {
            container.people.create(Profile(0, "Ana", "IRON"), null, setOf(DayOfWeek.MONDAY)).also { container.settings.setActiveProfile(it) }
        }
        assertEquals(ana, opened().id)
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        compose.onAllNodes(hasContentDescription("Settings")).onFirst().performClick()
        waitForText("Change look")
        compose.onAllNodesWithText("Change look").onFirst().performClick()
        waitForText("Ready-made")
        scrollTo(hasText("Create your own"))
        compose.onAllNodesWithText("Create your own").onFirst().performClick()
        waitForText("Make your own")
        scrollTo(hasText("Retro"))
        compose.onAllNodesWithText("Retro").onFirst().performClick()
        compose.waitForIdle()

        // Rotating rebuilds the activity; the open creator and the unsaved choice stay.
        compose.activityRule.scenario.recreate()
        compose.waitForIdle()
        waitForText("Make your own")
        scrollTo(hasText("Use this look"))
        compose.onAllNodesWithText("Use this look").onFirst().performClick()
        compose.waitUntil(10_000) { container.profiles.value.single { it.id == ana }.themeKey == Looks.CUSTOM }
        assertEquals("RETRO", CustomLook.decode(container.profiles.value.single { it.id == ana }.customLook)!!.type)
    }
}
