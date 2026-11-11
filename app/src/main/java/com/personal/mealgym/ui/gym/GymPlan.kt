package com.personal.mealgym.ui.gym

import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.data.db.WorkoutSession
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.GymToday
import com.personal.mealgym.domain.SessionRef
import com.personal.mealgym.domain.WorkoutCycle
import com.personal.mealgym.gym.WorkoutDraft
import java.time.DayOfWeek
import java.time.LocalDate

/** What the gym looks like today, shared by the Today and Gym tabs. */
data class GymPlan(
    val status: GymToday,
    val days: List<WorkoutDay>,
    /** The workout to show: the one in progress, else the next in the cycle. */
    val activeDay: WorkoutDay?,
    /** Today's in-progress workout, if one was started. */
    val draft: WorkoutDraft?,
    val doneSession: WorkoutSession?,
) {
    /** Show the exercise list straight away on training days or once a workout has started. */
    val showWorkout: Boolean get() = draft != null || status is GymToday.TrainingDay
}

fun planGym(
    profileId: Long,
    date: LocalDate,
    days: List<WorkoutDay>,
    sessions: List<WorkoutSession>,
    trainingDays: Set<DayOfWeek>,
    draft: WorkoutDraft?,
): GymPlan {
    val refs = sessions.map { SessionRef(Dates.parse(it.date), it.dayOrder, it.id) }
    val status = WorkoutCycle.today(date, trainingDays, refs, days.size)
    val draftToday = draft?.takeIf { d -> d.profileId == profileId && d.date == Dates.iso(date) && days.any { it.id == d.dayId } }
    val defaultOrder = when (status) {
        is GymToday.Done -> status.nextDayOrder
        is GymToday.TrainingDay -> status.dayOrder
        is GymToday.RestDay -> status.nextDayOrder
    }
    val active = draftToday?.let { d -> days.firstOrNull { it.id == d.dayId } }
        ?: days.firstOrNull { it.dayOrder == defaultOrder }
        ?: days.firstOrNull()
    val done = (status as? GymToday.Done)?.let { s -> sessions.firstOrNull { it.id == s.session.id } }
    return GymPlan(status, days, active, draftToday, done)
}

fun WorkoutDay.title(): String = "Day $dayOrder: $name"
