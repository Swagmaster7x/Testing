@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.today

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.DayTotal
import com.personal.mealgym.domain.DayTotals
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.domain.Targets
import com.personal.mealgym.domain.answers
import com.personal.mealgym.sauna.SaunaState
import com.personal.mealgym.sauna.SaunaTimer
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.gym.GymPlan
import com.personal.mealgym.ui.gym.planGym
import com.personal.mealgym.ui.plan.OffPlanChoice
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
    /** Slots planned as eating out, leftovers or a skip. */
    val offPlan: Map<MealSlot, OffPlanMeal> = emptyMap(),
    /** What today's planned meals add up to; null when totals are switched off or nothing has figures. */
    val total: DayTotal? = null,
    val guide: Targets? = null,
)

private data class TodayMeals(
    val slots: List<Pair<MealSlot, Recipe?>>,
    val recipes: List<Recipe>,
    val offPlan: Map<MealSlot, OffPlanMeal>,
    val total: DayTotal?,
    val guide: Targets?,
)

const val CREATINE = "creatine"

class TodayViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    /** Kept up to date when the person is edited in Settings. */
    val profile: StateFlow<Profile> = c.profile(profileId).stateInVm(c.currentProfile())

    val ui: StateFlow<TodayUi?> = c.today.flatMapLatest { date ->
        val meals = combine(
            c.meals.planForRange(profileId, date, date),
            c.meals.recipesFor(profileId),
            c.profile(profileId),
            c.meals.offPlanForRange(profileId, date, date),
            c.settings.settings(profileId),
        ) { plan, recipes, person, offPlan, s ->
            val byId = recipes.associateBy { it.id }
            val slots = Sides.slotsFor(person).map { slot -> slot to plan.firstOrNull { it.slot == slot }?.let { byId[it.recipeId] } }
            val other = offPlan.filter { o -> slots.any { it.first == o.slot && it.second == null } }.associateBy { it.slot }
            val showTotals = s.dayTotals && s.showNutrition
            val total = if (showTotals) {
                DayTotals.total(slots.mapNotNull { (slot, recipe) -> recipe?.let { DayTotals.meal(it, person.portion, slot) } ?: other[slot]?.let(DayTotals::meal) })
                    .takeIf { !it.isEmpty }
            } else {
                null
            }
            val guide = if (showTotals) (person.answers?.let(PlanBuilder::targets) as? TargetResult.Ready)?.targets else null
            TodayMeals(slots, recipes, other, total, guide)
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
        combine(meals, gym, sauna, creatine) { m, (plan, count, ticked), (minutes, state), creatineTaken ->
            TodayUi(date, m.slots, m.recipes, plan, count, ticked, minutes, state, creatineTaken, m.offPlan, m.total, m.guide)
        }
    }.stateInVm(null)

    val filter: StateFlow<LibraryFilter> = c.settings.settings(profileId).map { it.filter }.stateInVm(LibraryFilter())

    /** Recipes this person asked to avoid: left out of the picker. */
    val blocked: StateFlow<Set<Long>> = c.meals.conflictsFor(profileId).map { it.keys }.stateInVm(emptySet())

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

    /** Places offered under "Eating out". */
    val restaurants = c.restaurants.all

    /** Plans a slot as eating out, leftovers or a skip. */
    fun setOffPlan(date: LocalDate, slot: MealSlot, choice: OffPlanChoice) {
        viewModelScope.launch {
            c.meals.setOffPlan(
                OffPlanMeal(
                    profileId = profileId, date = Dates.iso(date), slot = slot, kind = choice.kind, title = choice.title,
                    restaurantKey = choice.restaurantKey, calories = choice.calories, protein = choice.protein,
                ),
            )
        }
    }

    fun fillBatch(date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch {
            val n = c.meals.fillBatch(profileId, date, slot, recipe)
            say("${recipe.name} is in $n ${slot.label.lowercase()} slot${if (n == 1) "" else "s"} this week.")
        }
    }
}
