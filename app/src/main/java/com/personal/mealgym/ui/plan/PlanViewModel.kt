@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.plan

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate

data class PlanDay(val date: LocalDate, val slots: Map<MealSlot, Recipe?>)

data class PlanUi(
    val weekStart: LocalDate,
    val today: LocalDate,
    val days: List<PlanDay>,
    val recipes: List<Recipe>,
) {
    val isThisWeek: Boolean get() = weekStart == Dates.weekStart(today)
    val weekName: String
        get() = when (weekStart) {
            Dates.weekStart(today) -> "This week"
            Dates.weekStart(today).plusWeeks(1) -> "Next week"
            Dates.weekStart(today).minusWeeks(1) -> "Last week"
            else -> "Week of ${Dates.monthDay(weekStart)}"
        }
}

class PlanViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()
    val slots: List<MealSlot> = Sides.slotsFor(profileId)

    private val weekStart = MutableStateFlow(Dates.weekStart(c.today.value))

    val ui: StateFlow<PlanUi?> = combine(weekStart, c.today) { ws, today -> ws to today }
        .flatMapLatest { (ws, today) ->
            combine(c.meals.planForWeek(profileId, ws), c.meals.recipesFor(profileId)) { plan, recipes ->
                val byId = recipes.associateBy { it.id }
                val days = Dates.weekDays(ws).map { date ->
                    val iso = Dates.iso(date)
                    PlanDay(
                        date = date,
                        slots = slots.associateWith { slot ->
                            plan.firstOrNull { it.date == iso && it.slot == slot }?.let { byId[it.recipeId] }
                        },
                    )
                }
                PlanUi(ws, today, days, recipes)
            }
        }
        .stateInVm(null)

    fun shiftWeek(weeks: Long) = weekStart.update { it.plusWeeks(weeks) }

    fun goToThisWeek() {
        weekStart.value = Dates.weekStart(c.today.value)
    }

    fun setSlot(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch { c.meals.setSlot(profileId, date, slot, recipe.id) }
    }

    fun fillBatch(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch {
            val n = c.meals.fillBatch(profileId, date, slot, recipe)
            say("${recipe.name} is in $n ${slot.label.lowercase()} slot${if (n == 1) "" else "s"}.")
        }
    }

    fun clearSlot(date: LocalDate, slot: MealSlot) {
        viewModelScope.launch { c.meals.clearSlot(profileId, date, slot) }
    }

    fun copyTo(dates: Collection<LocalDate>, slot: MealSlot, recipe: Recipe) {
        if (dates.isEmpty()) return
        viewModelScope.launch {
            c.meals.copyTo(profileId, dates, slot, recipe.id)
            say("Copied to ${dates.size} day${if (dates.size == 1) "" else "s"}.")
        }
    }

    fun repeatLastWeek() {
        val ws = weekStart.value
        viewModelScope.launch {
            val n = c.meals.repeatLastWeek(profileId, ws)
            say(if (n == 0) "Nothing to copy: last week had no meals for this week's empty slots." else "Copied $n meal${if (n == 1) "" else "s"} from last week.")
        }
    }
}
