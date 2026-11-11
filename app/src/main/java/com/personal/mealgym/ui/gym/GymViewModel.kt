@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.gym

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.gym.RestTimerState
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.SideCopy
import com.personal.mealgym.ui.lastTimeText
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.launch
import java.time.LocalDate

data class ExerciseUi(
    val exercise: Exercise,
    /** What is actually being done: the swap if there is one. */
    val displayName: String,
    val swappedTo: String?,
    val checkedSets: Set<Int>,
    val weight: String,
    val reps: String,
    val lastTime: String?,
)

data class GroupUi(val label: String, val exercises: List<ExerciseUi>) {
    val isSuperset: Boolean get() = exercises.size > 1
}

data class GymUi(
    val date: LocalDate,
    val plan: GymPlan,
    val groups: List<GroupUi>,
    val weightUnit: WeightUnit,
    val tips: List<String>,
    val rest: RestTimerState?,
)

class GymViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()
    private var chime = false

    val ui: StateFlow<GymUi?> = c.today.flatMapLatest { date ->
        val planFlow = combine(c.gym.days(profileId), c.gym.sessions(profileId), c.settings.settings(profileId), c.workoutDraft.draft) { days, sessions, s, draft ->
            chime = s.chime
            planGym(profileId, date, days, sessions, s.trainingWeekdays, draft) to s.weightUnit
        }
        combine(planFlow, c.gym.exercises, c.gym.latestLogs(profileId), c.restTimer.state) { (plan, unit), exercises, logs, rest ->
            val draft = plan.draft
            val dayExercises = exercises
                .filter { it.workoutDayId == plan.activeDay?.id }
                .sortedWith(compareBy<Exercise> { it.groupLabel }.thenBy { it.position })
            val groups = dayExercises.groupBy { it.groupLabel }.map { (label, list) ->
                GroupUi(
                    label = label,
                    exercises = list.map { e ->
                        val swap = draft?.swaps?.get(e.id)
                        val name = swap ?: e.name
                        ExerciseUi(
                            exercise = e,
                            displayName = name,
                            swappedTo = swap,
                            checkedSets = draft?.checkedSets?.get(e.id).orEmpty(),
                            weight = draft?.weights?.get(e.id).orEmpty(),
                            reps = draft?.reps?.get(e.id).orEmpty(),
                            lastTime = logs[name.lowercase()]?.lastTimeText(),
                        )
                    },
                )
            }
            GymUi(date, plan, groups, unit, c.gymTips(profileId), rest)
        }
    }.stateInVm(null)

    /** Starts today's workout record on first interaction. */
    private fun ensureDraft(): Boolean {
        val state = ui.value ?: return false
        if (state.plan.draft != null) return true
        val day = state.plan.activeDay ?: return false
        c.workoutDraft.start(profileId, Dates.iso(state.date), day.id)
        return true
    }

    fun toggleSet(exerciseId: Long, index: Int) {
        if (!ensureDraft()) return
        c.workoutDraft.update { d ->
            val current = d.checkedSets[exerciseId].orEmpty()
            val next = if (index in current) current - index else current + index
            d.copy(checkedSets = d.checkedSets + (exerciseId to next))
        }
    }

    /** [name] null goes back to the original exercise. */
    fun swap(exerciseId: Long, name: String?) {
        if (!ensureDraft()) return
        c.workoutDraft.update { d ->
            d.copy(swaps = if (name == null) d.swaps - exerciseId else d.swaps + (exerciseId to name))
        }
    }

    fun setWeight(exerciseId: Long, text: String) {
        val clean = text.filter { it.isDigit() || it == '.' }.take(6)
        if (!ensureDraft()) return
        c.workoutDraft.update { d -> d.copy(weights = d.weights + (exerciseId to clean)) }
    }

    fun setReps(exerciseId: Long, text: String) {
        val clean = text.filter { it.isDigit() }.take(3)
        if (!ensureDraft()) return
        c.workoutDraft.update { d -> d.copy(reps = d.reps + (exerciseId to clean)) }
    }

    fun chooseDay(dayId: Long) {
        val state = ui.value ?: return
        c.workoutDraft.start(profileId, Dates.iso(state.date), dayId)
    }

    fun trainAnyway() {
        ensureDraft()
    }

    fun discard() = c.workoutDraft.clear()

    fun finish(feeling: Feeling, note: String) {
        val state = ui.value ?: return
        val day = state.plan.activeDay ?: return
        val logs = state.groups.flatMap { it.exercises }.mapNotNull { e ->
            val weight = e.weight.toDoubleOrNull()
            val reps = e.reps.toIntOrNull()
            if (weight == null && reps == null) {
                null
            } else {
                SetLog(sessionId = 0, exerciseId = e.exercise.id, exerciseNameUsed = e.displayName, weight = weight, reps = reps)
            }
        }
        viewModelScope.launch {
            c.gym.saveSession(profileId, state.date, day, feeling, note, logs)
            c.workoutDraft.clear()
            c.restTimer.cancel()
            say(SideCopy.forProfile(profileId).workoutSaved)
        }
    }

    fun startRest(seconds: Int) = c.restTimer.start(seconds, chime)

    fun cancelRest() = c.restTimer.cancel()
}
