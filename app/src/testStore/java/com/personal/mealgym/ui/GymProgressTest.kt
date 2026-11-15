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
import androidx.compose.ui.test.performTextReplacement
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.captureRoboImage
import com.personal.mealgym.MainActivity
import com.personal.mealgym.MealGymApp
import com.personal.mealgym.Opening
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.SetLog
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

/**
 * Logging each set, the "try next" suggestion, new bests and the progress screens.
 *
 * Tests that finish a workout use Robolectric's default screen size: with a custom width and
 * height it never goes idle once a dialog holding a text field ("How did it go?") opens.
 */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h640dp-xhdpi")
class GymProgressTest {

    @Suppress("DEPRECATION")
    @get:Rule
    val compose = createAndroidComposeRule<MainActivity>()

    private val container get() = (compose.activity.application as MealGymApp).container

    @Before
    fun seeded() {
        runBlocking { withTimeout(30_000) { container.ready.first { it } } }
    }

    /** Someone on the full-body plan who trains every day, so today is always a training day. */
    private fun person(name: String): Long = runBlocking {
        val template = container.seed.seed.template("full-body-3")
        container.people.create(Profile(0, name, "IRON", templateKey = "full-body-3"), template, DayOfWeek.entries.toSet()).also {
            container.settings.setActiveProfile(it)
            withTimeout(10_000) { container.opening.first { o -> (o as? Opening.Open)?.profile?.id == it } }
        }
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

    /** The first exercise's weight and reps boxes. */
    private fun write(label: String, text: String) {
        compose.onAllNodes(hasText(label) and hasSetTextAction()).onFirst().performTextReplacement(text)
        compose.waitForIdle()
    }

    private fun openGym() {
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        compose.onAllNodesWithText("Gym").onFirst().performClick()
        waitForText("Day 1: Full body A")
        waitForText("Goblet squat")
    }

    private fun finish(feeling: String = "Great") {
        tap("Finish workout")
        waitForText("How did it go?")
        compose.onAllNodesWithText(feeling).onFirst().performClick()
        compose.onAllNodesWithText("Save").onFirst().performClick()
        compose.waitForIdle()
    }

    private fun setLogs(id: Long): List<SetLog> = runBlocking { container.db.workoutDao().allSetLogs().filter { it.profileId == id } }

    @Test
    @Config(qualifiers = "xhdpi")
    fun eachTickedSetKeepsItsOwnWeightAndReps() {
        val id = person("Rae")
        openGym()
        // Nothing to suggest on a first workout.
        assertTrue(!shown("Try "))
        scrollTo("optional")
        write("lb", "40")
        write("reps", "12")
        waitForText("Tick a set to log it at this weight and reps")
        compose.onAllNodesWithText("1").onFirst().performClick()
        waitForText("Today: 40 x 12")
        write("reps", "11")
        compose.onAllNodesWithText("2").onFirst().performClick()
        write("reps", "10")
        compose.onAllNodesWithText("3").onFirst().performClick()
        waitForText("Today: 40 x 12, 11, 10")
        shot("gym-1-sets-logged")
        // Unticking forgets that set.
        compose.onAllNodesWithText("2").onFirst().performClick()
        waitForText("Today: 40 x 12, 10")
        compose.onAllNodesWithText("2").onFirst().performClick()
        waitForText("Today: 40 x 12, 10, 10")
        finish()
        compose.waitUntil(10_000) { setLogs(id).size == 3 }
        val logs = setLogs(id).sortedBy { it.setIndex }
        assertEquals(listOf(0, 1, 2), logs.map { it.setIndex })
        assertEquals(listOf(12, 10, 10), logs.map { it.reps })
        assertTrue(logs.all { it.weight == 40.0 && it.exerciseNameUsed == "Goblet squat" })
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun aNoteWrittenAfterTickingIsKeptAsOneNoteLikeBefore() {
        val id = person("Ola")
        openGym()
        scrollTo("optional")
        // Tick first, write afterwards: the way it has always worked.
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose.onAllNodesWithText("2").onFirst().performClick()
        write("lb", "45")
        write("reps", "9")
        assertTrue(!shown("Today:"))
        finish("Fine")
        compose.waitUntil(10_000) { setLogs(id).size == 3 }
        val logs = setLogs(id)
        val note = logs.single { it.setIndex == null }
        assertEquals(45.0, note.weight!!, 0.0)
        assertEquals(9, note.reps)
        // The two ticks are counted as sets, with nothing written on them.
        assertEquals(listOf(0, 1), logs.filter { it.setIndex != null }.map { it.setIndex })
        assertTrue(logs.filter { it.setIndex != null }.all { it.weight == null && it.reps == null })
        val history = runBlocking { container.gym.lifts(id).first() }.getValue("goblet squat").single()
        assertEquals("45 x 9", com.personal.mealgym.domain.Progression.describe(history.sets))
        assertEquals(2, history.ticked)
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun lastTimeBecomesATargetAndBeatingItIsABest() {
        val id = person("Kit")
        val today = LocalDate.now()
        runBlocking {
            val days = container.db.workoutDao().getDays(id)
            val day = days.first { it.dayOrder == 1 }
            fun squat(weight: Double, reps: Int, set: Int) =
                SetLog(sessionId = 0, exerciseId = null, exerciseNameUsed = "Goblet squat", weight = weight, reps = reps, setIndex = set)
            container.gym.saveSession(id, today.minusDays(14), day, Feeling.FINE, null, listOf(squat(35.0, 10, 0), squat(35.0, 10, 1), squat(35.0, 9, 2)))
            // Last time: 12 on every set, the top of the 8–12 range.
            container.gym.saveSession(id, today.minusDays(7), day, Feeling.GREAT, null, listOf(squat(40.0, 12, 0), squat(40.0, 12, 1), squat(40.0, 12, 2)))
            // A day 3 workout the same day brings the cycle back round to day 1 for today.
            container.gym.saveSession(id, today.minusDays(7), days.first { it.dayOrder == 3 }, Feeling.FINE, null, emptyList())
        }
        openGym()
        waitForText("Last time: 40 x 12, 12, 12")
        waitForText("Try 45 x 8")
        waitForText("You hit 12 on every set. Time to add weight.")
        shot("gym-2-suggestion")
        tap("Use")
        scrollTo("optional")
        compose.onAllNodesWithText("1").onFirst().performClick()
        waitForText("Today: 45 x 8")
        finish()
        waitForText("New best: Goblet squat")
        shot("gym-3-new-best")

        // The progress screens.
        tap("Lifting progress")
        waitForText("This week")
        waitForText("1 of 7 workouts")
        waitForText("1 set ticked off")
        waitForText("Quads")
        waitForText("Last week: 2 of 7 workouts, 3 sets")
        scrollTo("Goblet squat")
        waitForText("Best: 45 x 8")
        shot("gym-4-progress")
        tap("Goblet squat")
        waitForText("Logged in 3 workouts")
        waitForText("45 lb x 8")
        scrollTo("Trend")
        scrollTo("The heaviest weight each workout, in lb")
        shot("gym-5-exercise-progress")
        scrollTo("Every workout")
        scrollTo("40 x 12, 12, 12")
        scrollTo("35 x 10, 10, 9")
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun repsTypedAfterTheSetsAreTickedAreNotLost() {
        val id = person("Ivy")
        openGym()
        scrollTo("optional")
        // The weight first, then the ticks, then the reps: a common order.
        write("lb", "40")
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose.onAllNodesWithText("2").onFirst().performClick()
        compose.onAllNodesWithText("3").onFirst().performClick()
        waitForText("Today: 40")
        write("reps", "9")
        // With every set ticked, the boxes correct the last one straight away.
        waitForText("Today: 40 x 9")
        finish()
        compose.waitUntil(10_000) { setLogs(id).size == 3 }
        // The earlier two were ticked with only the weight, so they take the reps from the boxes.
        assertEquals(listOf(9, 9, 9), setLogs(id).sortedBy { it.setIndex }.map { it.reps })
        assertTrue(setLogs(id).all { it.weight == 40.0 && it.setIndex != null })
    }

    @Test
    @Config(qualifiers = "xhdpi")
    fun aCorrectionAfterTheLastSetChangesThatSet() {
        val id = person("Uma")
        openGym()
        scrollTo("optional")
        write("lb", "40")
        write("reps", "12")
        compose.onAllNodesWithText("1").onFirst().performClick()
        compose.onAllNodesWithText("2").onFirst().performClick()
        compose.onAllNodesWithText("3").onFirst().performClick()
        waitForText("Today: 40 x 12, 12, 12")
        // The last set was really 9.
        write("reps", "9")
        waitForText("Today: 40 x 12, 12, 9")
        finish()
        compose.waitUntil(10_000) { setLogs(id).size == 3 }
        assertEquals(listOf(12, 12, 9), setLogs(id).sortedBy { it.setIndex }.map { it.reps })
    }

    @Test
    fun theSameExerciseOnTwoDaysIsJudgedByEachDaysOwnRange() {
        // The glute plan has hip thrusts for 8 to 12 on day 1 and 12 to 15 on day 3.
        val id = runBlocking {
            val template = container.seed.seed.template("glute-3")
            container.people.create(Profile(0, "Zoe", "IRON", templateKey = "glute-3"), template, DayOfWeek.entries.toSet()).also {
                container.settings.setActiveProfile(it)
                withTimeout(10_000) { container.opening.first { o -> (o as? Opening.Open)?.profile?.id == it } }
            }
        }
        val days = runBlocking { container.db.workoutDao().getDays(id) }
        val exercises = runBlocking { container.db.workoutDao().allExercises() }
        val thrustDays = days.filter { d -> exercises.any { it.workoutDayId == d.id && it.name == "Hip thrust" } }.sortedBy { it.dayOrder }
        assertEquals(2, thrustDays.size)
        val heavy = thrustDays.first { d -> exercises.first { it.workoutDayId == d.id && it.name == "Hip thrust" }.repsText.startsWith("8") }
        val light = thrustDays.first { it.id != heavy.id }
        fun thrust(weight: Double, reps: Int, set: Int) =
            SetLog(sessionId = 0, exerciseId = null, exerciseNameUsed = "Hip thrust", weight = weight, reps = reps, setIndex = set)
        runBlocking {
            // Ten days ago, the heavy day: 135 for 10, 10, 9. A week ago, the light day: 115 for 15s.
            container.gym.saveSession(id, LocalDate.now().minusDays(10), heavy, Feeling.FINE, null, listOf(thrust(135.0, 10, 0), thrust(135.0, 10, 1), thrust(135.0, 9, 2)))
            container.gym.saveSession(id, LocalDate.now().minusDays(7), light, Feeling.FINE, null, listOf(thrust(115.0, 15, 0), thrust(115.0, 15, 1), thrust(115.0, 15, 2)))
        }
        compose.waitUntil(15_000) { compose.onAllNodes(hasScrollAction()).fetchSemanticsNodes().isNotEmpty() }
        compose.onAllNodesWithText("Gym").onFirst().performClick()
        waitForText("Do a different day")
        // On the heavy day it goes by the heavy day's last log, not the lighter, more recent one.
        tap("Do a different day")
        compose.onAllNodesWithText("Day ${heavy.dayOrder}: ${heavy.name}").onFirst().performClick()
        compose.waitForIdle()
        scrollTo("Hip thrust")
        waitForText("Last time: 135 x 10, 10, 9")
        waitForText("Try 135 x 10")
        assertTrue(!shown("Time to add weight"))
        // On the light day, the light day's.
        scrollTo("Do a different day")
        tap("Do a different day")
        compose.onAllNodesWithText("Day ${light.dayOrder}: ${light.name}").onFirst().performClick()
        compose.waitForIdle()
        scrollTo("Hip thrust")
        waitForText("Last time: 115 x 15, 15, 15")
        waitForText("Try 120 x 12")
        assertTrue(!shown("Go a little lighter"))
    }

    @Test
    fun suggestionsCanBeSwitchedOff() {
        val id = person("Bo")
        runBlocking {
            val days = container.db.workoutDao().getDays(id)
            container.gym.saveSession(
                id, LocalDate.now().minusDays(7), days.first { it.dayOrder == 1 }, Feeling.FINE, null,
                listOf(SetLog(sessionId = 0, exerciseId = null, exerciseNameUsed = "Goblet squat", weight = 40.0, reps = 10)),
            )
            container.gym.saveSession(id, LocalDate.now().minusDays(7), days.first { it.dayOrder == 3 }, Feeling.FINE, null, emptyList())
            container.settings.setSuggestLifts(id, false)
        }
        openGym()
        // The old single note still reads as it always did, and progress is still there to look at.
        waitForText("Last time: 40 x 10")
        assertTrue(!shown("Try "))
        scrollTo("See progress")
        runBlocking { container.settings.setSuggestLifts(id, true) }
        waitForText("Try 40 x 11")
    }
}
