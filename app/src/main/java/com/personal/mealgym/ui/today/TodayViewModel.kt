@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.today

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.sauna.SaunaState
import com.personal.mealgym.sauna.SaunaTimer
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.gym.GymPlan
import com.personal.mealgym.ui.gym.planGym
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.map
import com.personal.mealgym.data.LibraryFilter
import kotlinx.coroutines.launch
import java.time.LocalDate

data class TodayUi(
    val date: LocalDate,
    val meals: List<Pair<MealSlot, Recipe?>>,
    val recipes: List<Recipe>,
    val gym: GymPlan,
    val exerciseCount: Int,
    val setsTicked: Int,
    val saunaMinutesToday: Int,
    val sauna: SaunaState,
    /** Ashley's optional creatine checkbox: null when the reminder is off. */
    val creatineTaken: Boolean? = null,
)

const val CREATINE = "creatine"

class TodayViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    /** Kept up to date when the person is edited in Settings. */
    val profile: StateFlow<Profile> = c.profile(profileId).stateInVm(c.currentProfile())

    val ui: StateFlow<TodayUi?> = c.today.flatMapLatest { date ->
        val meals = combine(c.meals.planForRange(profileId, date, date), c.meals.recipesFor(profileId), c.profile(profileId)) { plan, recipes, person ->
            val byId = recipes.associateBy { it.id }
            Sides.slotsFor(person).map { slot -> slot to plan.firstOrNull { it.slot == slot }?.let { byId[it.recipeId] } } to recipes
        }
        val gym = combine(c.gym.days(profileId), c.gym.sessions(profileId), c.settings.settings(profileId), c.workoutDraft.draft, c.gym.exercises) { days, sessions, s, draft, exercises ->
            val plan = planGym(profileId, date, days, sessions, s.trainingWeekdays, draft)
            val count = exercises.count { it.workoutDayId == plan.activeDay?.id }
            Triple(plan, count, plan.draft?.checkedSets?.values?.sumOf { it.size } ?: 0)
        }
        val sauna = combine(c.gym.saunaLogs(profileId), SaunaTimer.state) { logs, state ->
            logs.filter { it.date == Dates.iso(date) }.sumOf { it.minutes } to state
        }
        val creatine = combine(c.settings.settings(profileId), c.gym.supplementsOn(profileId, date)) { s, logs ->
            if (s.creatineReminder) logs.any { it.item == CREATINE } else null
        }
        combine(meals, gym, sauna, creatine) { (slots, recipes), (plan, count, ticked), (minutes, state), creatineTaken ->
            TodayUi(date, slots, recipes, plan, count, ticked, minutes, state, creatineTaken)
        }
    }.stateInVm(null)

    val filter: StateFlow<LibraryFilter> = c.settings.settings(profileId).map { it.filter }.stateInVm(LibraryFilter())

    fun setFilter(filter: LibraryFilter) {
        viewModelScope.launch { c.settings.setFilter(profileId, filter) }
    }

    /** The daily guide (reference text only), for people with the "easier to finish" tips. */
    val dailyGuide = c.seed.seed.dailyGuide

    fun setCreatine(date: LocalDate, taken: Boolean) {
        viewModelScope.launch { c.gym.setSupplement(profileId, date, CREATINE, taken) }
    }

    fun pick(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch { c.meals.setSlot(profileId, date, slot, recipe.id) }
    }

    fun fillBatch(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch {
            val n = c.meals.fillBatch(profileId, date, slot, recipe)
            say("${recipe.name} is in $n ${slot.label.lowercase()} slot${if (n == 1) "" else "s"} this week.")
        }
    }
}
