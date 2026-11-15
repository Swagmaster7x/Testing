@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.gym

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.Demo
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.SetLog
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.LiftSet
import com.personal.mealgym.domain.Progression
import com.personal.mealgym.domain.Suggestion
import com.personal.mealgym.gym.LoggedValue
import com.personal.mealgym.gym.RestTimerState
import com.personal.mealgym.gym.WorkoutDraft
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.SideCopy
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.first
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
    /** The demo for what's actually being done, so it follows a swap. */
    val demo: Demo,
    /** What today's ticked sets were logged at, in a line ("135 x 8, 8, 7"). */
    val today: String? = null,
    /** What to aim for, worked out from last time. Null when suggestions are off or there's nothing to go on. */
    val suggestion: Suggestion? = null,
    /** Something was logged before, so there is progress to look at. */
    val hasHistory: Boolean = false,
    /** The boxes are filled in but no set has been ticked with them yet. */
    val showTickHint: Boolean = false,
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
            Triple(planGym(profileId, date, days, sessions, s.trainingWeekdays, draft), s.weightUnit, s.suggestLifts)
        }
        combine(planFlow, c.gym.exercises, c.gym.lifts(profileId), c.restTimer.state) { (plan, unit, suggest), exercises, lifts, rest ->
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
                        val checked = draft?.checkedSets?.get(e.id).orEmpty()
                        val weight = draft?.weights?.get(e.id).orEmpty()
                        val reps = draft?.reps?.get(e.id).orEmpty()
                        val last = Progression.lastLogged(lifts[name.lowercase()])
                        val today = Progression.describe(loggedToday(draft, e.id, checked))
                        ExerciseUi(
                            exercise = e,
                            displayName = name,
                            swappedTo = swap,
                            checkedSets = checked,
                            weight = weight,
                            reps = reps,
                            lastTime = last?.let { Progression.describe(it.sets) }?.let { "Last time: $it" },
                            demo = c.demos.demoFor(name),
                            today = today,
                            suggestion = if (suggest && last != null) Progression.next(last, e.repsText, unit) else null,
                            hasHistory = last != null,
                            showTickHint = today == null && (weight.isNotBlank() || reps.isNotBlank()) && checked.size < e.setCount,
                        )
                    },
                )
            }
            GymUi(date, plan, groups, unit, c.gymTips(c.currentProfile()), rest)
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

    /** The sets ticked today that had a weight or reps in the boxes at the time, in order. */
    private fun loggedToday(draft: WorkoutDraft?, exerciseId: Long, checked: Set<Int>): List<LiftSet> {
        val values = draft?.setValues?.get(exerciseId).orEmpty()
        return checked.sorted().mapNotNull { values[it] }.map { LiftSet(it.weight.toDoubleOrNull(), it.reps.toIntOrNull()) }
    }

    /**
     * Ticks or unticks a set. Ticking keeps whatever weight and reps are in the boxes as that
     * set's own, so changing the boxes between sets logs each one as it was done.
     */
    fun toggleSet(exerciseId: Long, index: Int) {
        if (!ensureDraft()) return
        c.workoutDraft.update { d ->
            val current = d.checkedSets[exerciseId].orEmpty()
            val values = d.setValues[exerciseId].orEmpty()
            if (index in current) {
                d.copy(
                    checkedSets = d.checkedSets + (exerciseId to current - index),
                    setValues = d.setValues + (exerciseId to values - index),
                )
            } else {
                val now = LoggedValue(d.weights[exerciseId].orEmpty(), d.reps[exerciseId].orEmpty())
                d.copy(
                    checkedSets = d.checkedSets + (exerciseId to current + index),
                    setValues = if (now.isBlank) d.setValues else d.setValues + (exerciseId to values + (index to now)),
                )
            }
        }
    }

    /** Puts the suggested weight and reps in the boxes, ready to tick. */
    fun useSuggestion(exerciseId: Long, suggestion: Suggestion) {
        if (!ensureDraft()) return
        c.workoutDraft.update { d ->
            d.copy(
                weights = d.weights + (exerciseId to suggestion.weight?.let(Progression::weightText).orEmpty()),
                reps = d.reps + (exerciseId to suggestion.reps.toString()),
            )
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
        val draft = state.plan.draft
        val done = state.groups.flatMap { it.exercises }
        val logs = done.flatMap { e -> logsFor(e, draft) }
        viewModelScope.launch {
            val before = c.gym.lifts(profileId).first()
            c.gym.saveSession(profileId, state.date, day, feeling, note, logs)
            c.workoutDraft.clear()
            c.restTimer.cancel()
            val bests = done.filter { e ->
                val today = logs.filter { it.exerciseId == e.exercise.id }.map { LiftSet(it.weight, it.reps) }
                Progression.isNewBest(today, before[e.displayName.lowercase()].orEmpty())
            }
            val saved = SideCopy.forProfile(c.currentProfile()).workoutSaved
            say(
                when (bests.size) {
                    0 -> saved
                    1 -> "$saved New best: ${bests[0].displayName}."
                    else -> "$saved New bests: ${bests.joinToString(", ") { it.displayName }}."
                },
            )
        }
    }

    /**
     * What gets saved for one exercise: a row per ticked set, each with the weight and reps it
     * was ticked at. If none was ticked with the boxes filled in, the boxes are kept as one
     * note for the exercise, as they always were.
     */
    private fun logsFor(e: ExerciseUi, draft: WorkoutDraft?): List<SetLog> {
        val values = draft?.setValues?.get(e.exercise.id).orEmpty()
        fun row(weight: Double?, reps: Int?, setIndex: Int?) =
            SetLog(sessionId = 0, exerciseId = e.exercise.id, exerciseNameUsed = e.displayName, weight = weight, reps = reps, setIndex = setIndex)
        val sets = e.checkedSets.sorted().map { i -> row(values[i]?.weight?.toDoubleOrNull(), values[i]?.reps?.toIntOrNull(), i) }
        if (sets.any { it.weight != null || it.reps != null }) return sets
        val weight = e.weight.toDoubleOrNull()
        val reps = e.reps.toIntOrNull()
        return sets + listOfNotNull(if (weight == null && reps == null) null else row(weight, reps, null))
    }

    fun frame(path: String) = c.demos.frame(path)

    fun startRest(seconds: Int) = c.restTimer.start(seconds, chime)

    fun cancelRest() = c.restTimer.cancel()
}
