@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.today

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.sauna.SaunaState
import com.personal.mealgym.sauna.SaunaTimer
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.gym.GymPlan
import com.personal.mealgym.ui.gym.planGym
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
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
)

class TodayViewModel(private val c: AppContainer) : MessageViewModel() {

    val ui: StateFlow<TodayUi?> = c.today.flatMapLatest { date ->
        val meals = combine(c.meals.planForRange(date, date), c.meals.recipes) { plan, recipes ->
            val byId = recipes.associateBy { it.id }
            MealSlot.entries.map { slot -> slot to plan.firstOrNull { it.slot == slot }?.let { byId[it.recipeId] } } to recipes
        }
        val gym = combine(c.gym.days, c.gym.sessions, c.settings.settings, c.workoutDraft.draft, c.gym.exercises) { days, sessions, s, draft, exercises ->
            val plan = planGym(date, days, sessions, s.trainingWeekdays, draft)
            val count = exercises.count { it.workoutDayId == plan.activeDay?.id }
            Triple(plan, count, plan.draft?.checkedSets?.values?.sumOf { it.size } ?: 0)
        }
        val sauna = combine(c.gym.saunaLogs, SaunaTimer.state) { logs, state ->
            logs.filter { it.date == Dates.iso(date) }.sumOf { it.minutes } to state
        }
        combine(meals, gym, sauna) { (slots, recipes), (plan, count, ticked), (minutes, state) ->
            TodayUi(date, slots, recipes, plan, count, ticked, minutes, state)
        }
    }.stateInVm(null)

    fun pick(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch { c.meals.setSlot(date, slot, recipe.id) }
    }

    fun fillBatch(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch {
            val n = c.meals.fillBatch(date, slot, recipe)
            say("${recipe.name} is in $n ${slot.label.lowercase()} slot${if (n == 1) "" else "s"} this week.")
        }
    }
}
