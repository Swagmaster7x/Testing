package com.personal.mealgym.domain

import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.LoggedSet
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

class ProgressionTest {
    private val monday = LocalDate.of(2026, 11, 9)

    private fun day(vararg sets: Pair<Double?, Int?>, feeling: Feeling = Feeling.FINE, date: LocalDate = monday, id: Long = 1) =
        LiftDay(date, id, feeling, sets.map { LiftSet(it.first, it.second) }, sets.size)

    private fun next(day: LiftDay, reps: String = "8–12", unit: WeightUnit = WeightUnit.LB) = Progression.next(day, reps, unit)

    @Test
    fun readsThePlansRepRange() {
        assertEquals(RepRange(8, 12), Progression.repRange("8–12"))
        assertEquals(RepRange(6, 10), Progression.repRange("6-10"))
        assertEquals(RepRange(8, 10), Progression.repRange("8–10 each leg"))
        assertEquals(RepRange(10, 10), Progression.repRange("10 each arm"))
        assertNull(Progression.repRange("to failure"))
        assertNull(Progression.repRange("sets"))
        // Holds and carries are timed or measured, not counted.
        for (text in listOf("20–40 seconds", "20–30 seconds each side", "30–40 steps", "2 min")) {
            assertTrue(text, Progression.isTimed(text))
            assertNull(text, Progression.repRange(text))
        }
        assertFalse(Progression.isTimed("8–12"))
    }

    @Test
    fun addsARepUntilEverySetReachesTheTop() {
        val s = next(day(135.0 to 10, 135.0 to 9, 135.0 to 8))!!
        assertEquals(135.0, s.weight!!, 0.0)
        assertEquals(9, s.reps)
        assertEquals("135 x 9", s.text)
        // Nearly there: one set is still short of 12.
        assertEquals("135 x 12", next(day(135.0 to 12, 135.0 to 12, 135.0 to 11))!!.text)
    }

    @Test
    fun addsWeightOnceEverySetIsAtTheTop() {
        val s = next(day(135.0 to 12, 135.0 to 12, 135.0 to 12))!!
        assertEquals("140 x 8", s.text)
        assertTrue(s.reason, s.reason.contains("12 on every set"))
        // Small weights and kilograms move in smaller steps.
        assertEquals("17.5 x 8", next(day(15.0 to 12, 15.0 to 13))!!.text)
        assertEquals("62.5 x 8", next(day(60.0 to 12), unit = WeightUnit.KG)!!.text)
        assertEquals("9 x 8", next(day(8.0 to 12), unit = WeightUnit.KG)!!.text)
        // One note from before sets were kept is enough to go on.
        assertEquals("140 x 8", next(day(135.0 to 12))!!.text)
    }

    @Test
    fun judgesByTheHeaviestWeightOfTheDay() {
        // A lighter warm-up set at 12 reps doesn't count as "ready for more".
        assertEquals("135 x 9", next(day(95.0 to 12, 135.0 to 8, 135.0 to 8))!!.text)
        // With lighter back-off sets after it, the reason doesn't claim "every set".
        val topSet = next(day(135.0 to 12, 115.0 to 10, 115.0 to 9))!!
        assertEquals("140 x 8", topSet.text)
        assertEquals("You hit 12 at your top weight. Time to add weight.", topSet.reason)
        assertEquals("You hit 12 on every set. Time to add weight.", next(day(135.0 to 12, 135.0 to 12))!!.reason)
    }

    @Test
    fun aSmallWeightIsNeverMadeHeavierOrZeroByGoingLighter() {
        // 2.5 lb with reps well short: there's nothing lighter to go to.
        val tiny = next(day(2.5 to 4))!!
        assertEquals("2.5 x 8", tiny.text)
        assertTrue(tiny.reason, tiny.reason.contains("Stay here"))
        assertEquals("2 x 8", next(day(2.0 to 4))!!.text)
        assertEquals("1 x 8", next(day(1.0 to 3), unit = WeightUnit.KG)!!.text)
        // Where there is something lighter, it's suggested.
        assertEquals("5 x 8", next(day(7.5 to 4))!!.text)
    }

    @Test
    fun anExerciseOnTwoDaysIsJudgedOnItsOwnDay() {
        // Hip thrusts: 8 to 12 on day 1, 12 to 15 on day 3.
        val heavy = day(135.0 to 10, 135.0 to 9, date = monday, id = 1).copy(workoutDayId = 1)
        val light = day(115.0 to 15, 115.0 to 15, date = monday.plusDays(2), id = 2).copy(workoutDayId = 3)
        val history = listOf(heavy, light)
        // On day 1 the heavy day is what counts, though the light day is more recent.
        assertEquals(heavy to true, Progression.basisFor(history, 1, sameRangeEverywhere = false))
        assertEquals("135 x 10", Progression.next(Progression.basisFor(history, 1, false).first!!, "8–12", WeightUnit.LB)!!.text)
        assertEquals(light to true, Progression.basisFor(history, 3, sameRangeEverywhere = false))
        // Never logged on day 2: the latest is shown as "last time", but it isn't a basis for a
        // target unless the exercise has the same rep range wherever it appears.
        assertEquals(light to false, Progression.basisFor(history, 2, sameRangeEverywhere = false))
        assertEquals(light to true, Progression.basisFor(history, 2, sameRangeEverywhere = true))
        // A workout whose day was since deleted has no day to match.
        assertEquals(heavy.copy(workoutDayId = null) to true, Progression.basisFor(listOf(heavy.copy(workoutDayId = null)), null, true))
        assertEquals(null to true, Progression.basisFor(emptyList(), 1, true))
    }

    @Test
    fun backsOffWhenItWasTooHeavyOrRough() {
        val heavy = next(day(185.0 to 5, 185.0 to 4))!!
        assertEquals("180 x 8", heavy.text)
        assertTrue(heavy.reason.contains("lighter"))
        // One rep short of the range is close enough to stay and build.
        assertEquals("185 x 8", next(day(185.0 to 7, 185.0 to 7))!!.text)
        val rough = next(day(135.0 to 12, 135.0 to 12, feeling = Feeling.ROUGH))!!
        assertEquals("135 x 12", rough.text)
        assertTrue(rough.reason.contains("rough"))
    }

    @Test
    fun bodyweightMovesGoByReps() {
        assertEquals("11 reps", next(day(null to 12, null to 10))!!.text)
        val past = next(day(null to 15, null to 14))!!
        assertNull(past.weight)
        assertEquals(15, past.reps)
        assertTrue(past.reason.contains("harder"))
    }

    @Test
    fun saysNothingWhenThereIsNothingToGoOn() {
        assertNull(next(day(135.0 to null)))
        assertNull(next(day()))
        assertNull(next(day(null to 40), reps = "20–40 seconds"))
        // No range in the plan: one more rep.
        assertEquals("135 x 9", next(day(135.0 to 8), reps = "to failure")!!.text)
    }

    @Test
    fun setsReadAsOneLine() {
        assertEquals("135 x 8, 8, 7", Progression.describe(listOf(LiftSet(135.0, 8), LiftSet(135.0, 8), LiftSet(135.0, 7))))
        assertEquals("135 x 8 · 140 x 6", Progression.describe(listOf(LiftSet(135.0, 8), LiftSet(140.0, 6))))
        assertEquals("12, 10, 9 reps", Progression.describe(listOf(LiftSet(null, 12), LiftSet(null, 10), LiftSet(null, 9))))
        // The single note reads exactly as it always has.
        assertEquals("135 x 8", Progression.describe(listOf(LiftSet(135.0, 8))))
        assertEquals("135", Progression.describe(listOf(LiftSet(135.0, null))))
        assertEquals("8 reps", Progression.describe(listOf(LiftSet(null, 8))))
        assertEquals("22.5 x 10", Progression.describe(listOf(LiftSet(22.5, 10))))
        assertNull(Progression.describe(listOf(LiftSet(null, null))))
        assertNull(Progression.describe(emptyList()))
    }

    private fun row(id: Long, session: Long, name: String, weight: Double?, reps: Int?, index: Int?, date: LocalDate, feeling: Feeling = Feeling.FINE) =
        LoggedSet(id, session, name, weight, reps, index, date.toString(), feeling)

    @Test
    fun theLogBecomesAHistoryPerExercise() {
        val logged = listOf(
            // An old single note, then a workout with every set kept, one of them only ticked.
            row(1, 1, "Leg press", 180.0, 10, null, monday),
            row(2, 2, "Leg press", 190.0, 10, 0, monday.plusDays(3)),
            row(3, 2, "Leg press", 190.0, 9, 1, monday.plusDays(3)),
            row(4, 2, "Leg press", null, null, 2, monday.plusDays(3)),
            row(5, 2, "Plank", null, null, 0, monday.plusDays(3)),
            row(6, 2, "leg press", 200.0, 6, 3, monday.plusDays(3)),
        )
        val history = Progression.history(logged)
        val press = history.getValue("leg press")
        assertEquals(2, press.size)
        assertEquals(listOf(LiftSet(180.0, 10)), press[0].sets)
        assertEquals(0, press[0].ticked)
        assertEquals(listOf(LiftSet(190.0, 10), LiftSet(190.0, 9), LiftSet(200.0, 6)), press[1].sets)
        assertEquals(4, press[1].ticked)
        // Ticked with nothing written: counted, but not a "last time".
        assertTrue(history.getValue("plank").single().sets.isEmpty())
        assertNull(Progression.lastLogged(history["plank"]))
        assertEquals(monday.plusDays(3), Progression.lastLogged(press)!!.date)
        // Each workout remembers which day of the plan it was.
        val onDays = Progression.history(listOf(row(7, 9, "Hip thrust", 135.0, 10, 0, monday).copy(workoutDayId = 4)))
        assertEquals(4L, onDays.getValue("hip thrust").single().workoutDayId)
    }

    @Test
    fun theBestIsTheHeaviestThenTheMostReps() {
        val days = listOf(
            day(135.0 to 8, date = monday, id = 1),
            day(135.0 to 12, 140.0 to 6, date = monday.plusDays(7), id = 2),
            day(140.0 to 8, 140.0 to 7, date = monday.plusDays(14), id = 3),
            day(140.0 to 8, date = monday.plusDays(21), id = 4),
        )
        // 140 for 8 beats 135 for 12: a heavier set is never ranked below a lighter one.
        val (set, date) = Progression.best(days)!!
        assertEquals(LiftSet(140.0, 8), set)
        assertEquals("the first day it was done", monday.plusDays(14), date)
        // The trend is the heaviest weight each workout, so it never dips for dropping reps.
        assertEquals(listOf(135.0, 140.0, 140.0, 140.0), Progression.trend(days).map { it.second })

        assertTrue(Progression.isNewBest(listOf(LiftSet(140.0, 9)), days))
        assertTrue(Progression.isNewBest(listOf(LiftSet(145.0, 3)), days))
        assertFalse(Progression.isNewBest(listOf(LiftSet(140.0, 8)), days))
        assertFalse(Progression.isNewBest(listOf(LiftSet(135.0, 15)), days))
        // The very first log isn't announced as a best.
        assertFalse(Progression.isNewBest(listOf(LiftSet(100.0, 8)), emptyList()))
        // Bodyweight: more reps in a set.
        val pushUps = listOf(day(null to 12, null to 10))
        assertTrue(Progression.isNewBest(listOf(LiftSet(null, 13)), pushUps))
        assertFalse(Progression.isNewBest(listOf(LiftSet(null, 12)), pushUps))
        assertEquals(LiftSet(null, 12), Progression.best(pushUps)!!.first)
        assertEquals(listOf(12.0), Progression.trend(pushUps).map { it.second })
    }

    @Test
    fun theWeekCountsWorkoutsAndSetsByMuscleGroup() {
        val logged = listOf(
            row(1, 1, "Leg press", 180.0, 10, 0, monday),
            row(2, 1, "Leg press", 180.0, 10, 1, monday),
            row(3, 1, "Lat pulldown", null, null, 0, monday),
            row(4, 2, "Hip thrust", 135.0, 10, 0, monday.plusDays(2)),
            // An old note has no set number, so it isn't counted as a set.
            row(5, 2, "Chest press machine", 70.0, 10, null, monday.plusDays(2)),
            // Last week.
            row(6, 0, "Leg press", 170.0, 10, 0, monday.minusDays(3)),
        )
        val sessions = listOf(monday, monday.plusDays(2), monday.minusDays(3))
        val week = Progression.week(monday, sessions, planned = 3, logged = logged)
        assertEquals(2, week.sessions)
        assertEquals(3, week.planned)
        assertEquals(4, week.sets)
        assertEquals(listOf(MuscleGroup.QUADS to 2, MuscleGroup.BACK to 1, MuscleGroup.GLUTES_HAMS to 1), week.byGroup)
        val before = Progression.week(monday.minusWeeks(1), sessions, planned = 3, logged = logged)
        assertEquals(1, before.sessions)
        assertEquals(1, before.sets)
    }
}
