package com.personal.mealgym.domain

import org.junit.Assert.assertEquals
import org.junit.Test
import java.time.DayOfWeek
import java.time.LocalDate

class WorkoutCycleTest {

    // 2026-11-09 is a Monday.
    private val mon = LocalDate.of(2026, 11, 9)
    private val tue = mon.plusDays(1)
    private val wed = mon.plusDays(2)
    private val thu = mon.plusDays(3)
    private val fri = mon.plusDays(4)
    private val nextMon = mon.plusDays(7)

    private val defaultDays = WorkoutCycle.defaultTrainingDays

    private fun today(date: LocalDate, vararg sessions: SessionRef, days: Set<DayOfWeek> = defaultDays) =
        WorkoutCycle.today(date, days, sessions.toList(), cycleLength = 4)

    @Test
    fun defaultTrainingDaysAreMonTueThuFri() {
        assertEquals(setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY), defaultDays)
    }

    @Test
    fun veryFirstSessionIsDayOne() {
        assertEquals(GymToday.TrainingDay(1), today(mon))
    }

    @Test
    fun daysRunInOrderAcrossTrainingWeekdays() {
        val s1 = SessionRef(mon, 1, id = 1)
        val s2 = SessionRef(tue, 2, id = 2)
        val s3 = SessionRef(thu, 3, id = 3)
        assertEquals(GymToday.TrainingDay(2), today(tue, s1))
        assertEquals(GymToday.TrainingDay(3), today(thu, s1, s2))
        assertEquals(GymToday.TrainingDay(4), today(fri, s1, s2, s3))
    }

    @Test
    fun cycleWrapsFromDayFourToDayOne() {
        val s4 = SessionRef(fri, 4, id = 4)
        assertEquals(GymToday.TrainingDay(1), today(nextMon, s4))
    }

    @Test
    fun aSkippedDayDoesNotShiftOrFlagAnything() {
        // Monday done, Tuesday skipped: Thursday is simply the next day in the cycle.
        val s1 = SessionRef(mon, 1, id = 1)
        assertEquals(GymToday.TrainingDay(2), today(thu, s1))
    }

    @Test
    fun aSkippedWholeWeekPicksUpWhereItLeftOff() {
        val s3 = SessionRef(thu, 3, id = 3)
        assertEquals(GymToday.TrainingDay(4), today(nextMon.plusDays(7), s3))
    }

    @Test
    fun nonTrainingWeekdayIsARestDayShowingWhatIsNext() {
        val s1 = SessionRef(mon, 1, id = 1)
        val s2 = SessionRef(tue, 2, id = 2)
        assertEquals(GymToday.RestDay(3), today(wed, s1, s2))
    }

    @Test
    fun trainingTodayShowsItAsDone() {
        val s1 = SessionRef(mon, 1, id = 1)
        val s2 = SessionRef(tue, 2, id = 2)
        assertEquals(GymToday.Done(s2, nextDayOrder = 3), today(tue, s1, s2))
    }

    @Test
    fun trainingOnARestDayStillCounts() {
        val extra = SessionRef(wed, 2, id = 2)
        assertEquals(GymToday.Done(extra, nextDayOrder = 3), today(wed, SessionRef(mon, 1, id = 1), extra))
        assertEquals(GymToday.TrainingDay(3), today(thu, SessionRef(mon, 1, id = 1), extra))
    }

    @Test
    fun aManuallyChosenDayContinuesTheCycleFromThere() {
        // Day 2 was next, but Day 3 was picked with "Do a different day".
        val s1 = SessionRef(mon, 1, id = 1)
        val picked = SessionRef(tue, 3, id = 2)
        assertEquals(GymToday.TrainingDay(4), today(thu, s1, picked))
    }

    @Test
    fun customTrainingWeekdays() {
        val days = setOf(DayOfWeek.WEDNESDAY, DayOfWeek.SATURDAY)
        assertEquals(GymToday.RestDay(1), today(mon, days = days))
        assertEquals(GymToday.TrainingDay(1), today(wed, days = days))
    }

    @Test
    fun laterSessionWinsWhenTwoAreOnTheSameDate() {
        val a = SessionRef(mon, 1, id = 1)
        val b = SessionRef(mon, 2, id = 2)
        assertEquals(GymToday.TrainingDay(3), today(tue, a, b))
    }

    @Test
    fun nextDayOrderHandlesEdgeCases() {
        assertEquals(1, WorkoutCycle.nextDayOrder(null, 4))
        assertEquals(2, WorkoutCycle.nextDayOrder(1, 4))
        assertEquals(1, WorkoutCycle.nextDayOrder(4, 4))
        // A day that no longer exists (cycle shrank from 5 to 4): order 5 behaves like Day 1.
        assertEquals(2, WorkoutCycle.nextDayOrder(5, 4))
        assertEquals(1, WorkoutCycle.nextDayOrder(3, 0))
        assertEquals(1, WorkoutCycle.nextDayOrder(1, 1))
    }

    // Ashley's week view: Monday, Wednesday, Friday, three-day cycle.
    private val mwf = setOf(DayOfWeek.MONDAY, DayOfWeek.WEDNESDAY, DayOfWeek.FRIDAY)
    private val week = (0L until 7L).map { mon.plusDays(it) }

    @Test
    fun weekViewProjectsTheCycleAcrossTrainingDays() {
        val badges = WorkoutCycle.projectWeek(week, today = mon, trainingDays = mwf, sessions = emptyList(), cycleLength = 3)
        assertEquals(DayBadge.Planned(1), badges[mon])
        assertEquals(DayBadge.Rest, badges[tue])
        assertEquals(DayBadge.Planned(2), badges[wed])
        assertEquals(DayBadge.Planned(3), badges[fri])
        assertEquals(DayBadge.Rest, badges[mon.plusDays(5)])
    }

    @Test
    fun weekViewShowsDoneDaysAndLeavesMissedDaysBlank() {
        // Monday done (Day 1); Wednesday missed; today is Thursday.
        val badges = WorkoutCycle.projectWeek(week, today = thu, trainingDays = mwf, sessions = listOf(SessionRef(mon, 1, 1)), cycleLength = 3)
        assertEquals(DayBadge.Done(1), badges[mon])
        assertEquals(DayBadge.Blank, badges[wed])
        assertEquals(DayBadge.Rest, badges[thu])
        assertEquals(DayBadge.Planned(2), badges[fri])
    }

    @Test
    fun weekViewAfterTrainingTodayStartsFromTheNextDay() {
        val badges = WorkoutCycle.projectWeek(week, today = wed, trainingDays = mwf, sessions = listOf(SessionRef(mon, 1, 1), SessionRef(wed, 2, 2)), cycleLength = 3)
        assertEquals(DayBadge.Done(2), badges[wed])
        assertEquals(DayBadge.Planned(3), badges[fri])
    }
}
