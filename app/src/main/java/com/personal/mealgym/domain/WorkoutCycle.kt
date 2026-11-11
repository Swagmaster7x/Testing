package com.personal.mealgym.domain

import java.time.DayOfWeek
import java.time.LocalDate

/** What a day shows in the week view. */
sealed interface DayBadge {
    /** A workout was done that day. */
    data class Done(val dayOrder: Int) : DayBadge

    /** A training weekday still to come (or today): the session the cycle puts there. */
    data class Planned(val dayOrder: Int) : DayBadge

    /** Not a training weekday. */
    data object Rest : DayBadge

    /** A past training weekday with no session: shown blank, with no comment. */
    data object Blank : DayBadge
}

/** A finished session, reduced to what the cycle needs. */
data class SessionRef(val date: LocalDate, val dayOrder: Int, val id: Long = 0)

sealed interface GymToday {
    /** Already trained today. [nextDayOrder] is what comes after it. */
    data class Done(val session: SessionRef, val nextDayOrder: Int) : GymToday

    /** Today is one of the user's training weekdays. */
    data class TrainingDay(val dayOrder: Int) : GymToday

    /** Not a training weekday. [nextDayOrder] is the next session whenever it happens. */
    data class RestDay(val nextDayOrder: Int) : GymToday
}

/**
 * Works out "which workout is today".
 *
 * The workout days (Day 1 to Day N) run in order across the user's training weekdays.
 * A skipped weekday never shifts or flags anything: the next session is simply the day
 * after the last one actually done.
 */
object WorkoutCycle {

    val defaultTrainingDays: Set<DayOfWeek> =
        setOf(DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.THURSDAY, DayOfWeek.FRIDAY)

    fun nextDayOrder(lastCompletedOrder: Int?, cycleLength: Int): Int {
        if (cycleLength <= 0) return 1
        if (lastCompletedOrder == null || lastCompletedOrder < 1) return 1
        // Bring an out-of-range order (a day that was since removed) back into 1..cycleLength first.
        val last = (lastCompletedOrder - 1) % cycleLength + 1
        return last % cycleLength + 1
    }

    /**
     * Badges for a run of dates, as seen from [today]. Future training weekdays carry the
     * sessions the cycle would put there; a missed past day is simply blank.
     */
    fun projectWeek(
        dates: List<LocalDate>,
        today: LocalDate,
        trainingDays: Set<DayOfWeek>,
        sessions: List<SessionRef>,
        cycleLength: Int,
    ): Map<LocalDate, DayBadge> {
        val byDate = sessions.groupBy { it.date }.mapValues { (_, list) -> list.maxBy { it.id } }
        val lastUpToToday = sessions.filter { !it.date.isAfter(today) }
            .maxWithOrNull(compareBy<SessionRef> { it.date }.thenBy { it.id })
        var cursor = nextDayOrder(lastUpToToday?.dayOrder, cycleLength)
        val result = LinkedHashMap<LocalDate, DayBadge>()
        for (date in dates.sorted()) {
            val done = byDate[date]
            result[date] = when {
                done != null && !date.isAfter(today) -> DayBadge.Done(done.dayOrder)
                date.dayOfWeek !in trainingDays -> DayBadge.Rest
                date.isBefore(today) -> DayBadge.Blank
                cycleLength <= 0 -> DayBadge.Blank
                else -> DayBadge.Planned(cursor).also { cursor = cursor % cycleLength + 1 }
            }
        }
        return dates.associateWith { result.getValue(it) }
    }

    fun today(
        date: LocalDate,
        trainingDays: Set<DayOfWeek>,
        sessions: List<SessionRef>,
        cycleLength: Int,
    ): GymToday {
        val doneToday = sessions
            .filter { it.date == date }
            .maxWithOrNull(compareBy<SessionRef> { it.id })
        if (doneToday != null) {
            return GymToday.Done(doneToday, nextDayOrder(doneToday.dayOrder, cycleLength))
        }
        val last = sessions
            .filter { it.date.isBefore(date) }
            .maxWithOrNull(compareBy<SessionRef> { it.date }.thenBy { it.id })
        val next = nextDayOrder(last?.dayOrder, cycleLength)
        return if (date.dayOfWeek in trainingDays) GymToday.TrainingDay(next) else GymToday.RestDay(next)
    }
}
