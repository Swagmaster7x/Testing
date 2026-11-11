@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.plan

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.DayBadge
import com.personal.mealgym.domain.SessionRef
import com.personal.mealgym.domain.WorkoutCycle
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flowOf
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
    /** Ashley's schedule layer: "Glutes + hams", "Upper", "Rest"... (empty on Swag's Side). */
    val badges: Map<LocalDate, String> = emptyMap(),
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
            combine(c.meals.planForWeek(profileId, ws), c.meals.recipesFor(profileId), scheduleBadges(ws, today)) { plan, recipes, badges ->
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
                PlanUi(ws, today, days, recipes, badges)
            }
        }
        .stateInVm(null)

    /** The training layer of Ashley's week view. Swag's Side shows meals only. */
    private fun scheduleBadges(weekStart: LocalDate, today: LocalDate): Flow<Map<LocalDate, String>> {
        if (!Sides.isAshley(profileId)) return flowOf(emptyMap())
        return combine(c.gym.days(profileId), c.gym.sessions(profileId), c.settings.settings(profileId)) { days, sessions, s ->
            val refs = sessions.map { SessionRef(Dates.parse(it.date), it.dayOrder, it.id) }
            val names = days.associate { it.dayOrder to (it.shortName ?: it.name) }
            WorkoutCycle.projectWeek(Dates.weekDays(weekStart), today, s.trainingWeekdays, refs, days.size)
                .mapNotNull { (date, badge) ->
                    when (badge) {
                        is DayBadge.Done -> names[badge.dayOrder]?.let { date to it }
                        is DayBadge.Planned -> names[badge.dayOrder]?.let { date to it }
                        DayBadge.Rest -> date to "Rest"
                        DayBadge.Blank -> null
                    }
                }
                .toMap()
        }
    }

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
