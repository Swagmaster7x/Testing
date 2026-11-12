package com.personal.mealgym.ui

import androidx.compose.ui.test.hasScrollAction
import androidx.compose.ui.test.junit4.createAndroidComposeRule
import androidx.compose.ui.test.onAllNodesWithText
import androidx.compose.ui.test.onFirst
import androidx.compose.ui.test.onRoot
import androidx.compose.ui.test.performClick
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
 * Every look on real screens, by day and by night, for review (QA). Saved by
 * `./gradlew recordRoborazziStoreDebug --tests '*LookGallery*'` as gallery-<look>-<screen>.png.
 */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
class LookGallery {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container
    private var sam = 0L

    /** The ready-made looks plus two very different creations. */
    private val looks: List<Pair<String, String?>> = Looks.builtIn.map { it.key to null } + listOf(
        Looks.CUSTOM to CustomLook(primary = 0xFFE6B800, accent = 0xFF1F3A93, background = "WARM", type = "SPORT", corners = "SQUARE", glossy = true).encode(),
        Looks.CUSTOM to CustomLook(primary = 0xFF20A4C8, accent = 0xFFFF2E93, background = "NEUTRAL", mode = "DARK", type = "RETRO", corners = "PILL", sparkles = true, playful = true).encode(),
    )

    @Before
    fun aPlannedDay() {
        runBlocking {
            withTimeout(30_000) { container.ready.first { it } }
            val templates = container.seed.seed.workoutTemplates
            sam = container.people.create(Profile(0, "Sam", Profile.THEME_IRON, snackSlot = true, weekBadges = true), templates.first(), DayOfWeek.entries.toSet())
            val r = container.db.recipeDao().allRecipes().associateBy { it.seedKey }
            val ws = Dates.weekStart(LocalDate.now())
            Dates.weekDays(ws).forEachIndexed { i, day ->
                container.meals.setSlot(sam, day, MealSlot.BREAKFAST, r.getValue(listOf("B1", "B2", "B3", "B4")[i % 4]).id)
                container.meals.setSlot(sam, day, MealSlot.SNACK, r.getValue("SN2").id)
            }
            container.meals.fillBatch(sam, ws, MealSlot.LUNCH, r.getValue("L2"))
            container.meals.fillBatch(sam, ws.plusDays(4), MealSlot.LUNCH, r.getValue("L6"))
            Dates.weekDays(ws).forEach { container.meals.setSlot(sam, it, MealSlot.DINNER, r.getValue("D3").id) }
            container.settings.setActiveProfile(sam)
            withTimeout(10_000) { container.opening.first { (it as? Opening.Open)?.profile?.id == sam } }
        }
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
    }

    private fun wear(key: String, custom: String?) {
        runBlocking {
            val p = container.profiles.value.single { it.id == sam }
            container.people.update(p.copy(themeKey = key, customLook = custom))
            withTimeout(10_000) { container.opening.first { (it as? Opening.Open)?.profile?.let { o -> o.themeKey == key && o.customLook == custom } == true } }
        }
        compose.waitForIdle()
    }

    private fun tab(label: String) {
        compose.onAllNodesWithText(label).onFirst().performClick()
        compose.waitForIdle()
    }

    private fun shot(name: String) = compose.onRoot().captureRoboImage("build/outputs/roborazzi/gallery/$name.png")

    private fun tour(mode: String) {
        looks.forEachIndexed { i, (key, custom) ->
            val name = "%02d-%s".format(i + 1, if (custom == null) key.lowercase() else "custom$i")
            wear(key, custom)
            tab("Today")
            shot("$name-$mode-today")
            tab("Plan")
            shot("$name-$mode-plan")
            tab("Gym")
            compose.waitUntil(10_000) {
                listOf("Do a different day", "Train anyway", "Start").any { compose.onAllNodesWithText(it).fetchSemanticsNodes().isNotEmpty() }
            }
            if (compose.onAllNodesWithText("Train anyway").fetchSemanticsNodes().isNotEmpty()) tab("Train anyway")
            shot("$name-$mode-gym")
            tab("Today")
        }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w360dp-h640dp-notnight-mdpi")
    fun day() = tour("day")

    @Test
    @Config(sdk = [35], qualifiers = "w360dp-h640dp-night-mdpi")
    fun night() = tour("night")
}
