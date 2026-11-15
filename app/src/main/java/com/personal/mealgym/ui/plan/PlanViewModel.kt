@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.plan

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.OffPlanMeal
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.DayBadge
import com.personal.mealgym.domain.DayTotal
import com.personal.mealgym.domain.DayTotals
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.domain.Targets
import com.personal.mealgym.domain.answers
import com.personal.mealgym.domain.SessionRef
import com.personal.mealgym.domain.WorkoutCycle
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate

data class PlanDay(
    val date: LocalDate,
    val slots: Map<MealSlot, Recipe?>,
    /** Slots planned as eating out, leftovers or a skip. */
    val offPlan: Map<MealSlot, OffPlanMeal> = emptyMap(),
    /** Extra servings being cooked for guests, by slot. */
    val extra: Map<MealSlot, Double> = emptyMap(),
    /** What the day's planned meals add up to; null when totals are switched off. */
    val total: DayTotal? = null,
)

data class PlanUi(
    val weekStart: LocalDate,
    val today: LocalDate,
    val days: List<PlanDay>,
    val recipes: List<Recipe>,
    /** The schedule layer: "Glutes + hams", "Upper", "Rest"... (empty unless the person turned it on). */
    val badges: Map<LocalDate, String> = emptyMap(),
    val slots: List<MealSlot> = Sides.slotsFor(Profile(0, "", Profile.THEME_IRON)),
    /** The person's daily guide, shown beside the totals when they have one. */
    val guide: Targets? = null,
    val showTotals: Boolean = false,
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
    private val profile = c.profile(profileId)

    private val weekStart = MutableStateFlow(Dates.weekStart(c.today.value))

    val ui: StateFlow<PlanUi?> = combine(weekStart, c.today, profile) { ws, today, p -> Triple(ws, today, p) }
        .flatMapLatest { (ws, today, person) ->
            val slots = Sides.slotsFor(person)
            combine(
                c.meals.planForWeek(profileId, ws),
                c.meals.recipesFor(profileId),
                scheduleBadges(ws, today, person),
                c.meals.offPlanForWeek(profileId, ws),
                c.settings.settings(profileId),
            ) { plan, recipes, badges, offPlan, s ->
                val byId = recipes.associateBy { it.id }
                val showTotals = s.dayTotals && s.showNutrition
                val days = Dates.weekDays(ws).map { date ->
                    val iso = Dates.iso(date)
                    val entries = plan.filter { it.date == iso }
                    val recipeOf = slots.associateWith { slot -> entries.firstOrNull { it.slot == slot }?.let { byId[it.recipeId] } }
                    // A recipe wins if a slot somehow holds both.
                    val other = offPlan.filter { it.date == iso && recipeOf[it.slot] == null && it.slot in slots }.associateBy { it.slot }
                    PlanDay(
                        date = date,
                        slots = recipeOf,
                        offPlan = other,
                        extra = entries.filter { it.extraServings > 0 }.associate { it.slot to it.extraServings },
                        total = if (showTotals) {
                            DayTotals.total(slots.mapNotNull { slot -> recipeOf[slot]?.let { DayTotals.meal(it, person.portion, slot) } ?: other[slot]?.let(DayTotals::meal) })
                        } else {
                            null
                        },
                    )
                }
                val guide = (person.answers?.let(PlanBuilder::targets) as? TargetResult.Ready)?.targets
                PlanUi(ws, today, days, recipes, badges, slots, guide = if (showTotals) guide else null, showTotals = showTotals)
            }
        }
        .stateInVm(null)

    /** The training layer of the week view, for people who turned on "Show gym days". */
    private fun scheduleBadges(weekStart: LocalDate, today: LocalDate, person: Profile): Flow<Map<LocalDate, String>> {
        if (!person.weekBadges) return flowOf(emptyMap())
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

    val filter: StateFlow<LibraryFilter> = c.settings.settings(profileId).map { it.filter }.stateInVm(LibraryFilter())

    /** Recipes this person asked to avoid: left out of the picker. */
    val blocked: StateFlow<Set<Long>> = c.meals.conflictsFor(profileId).map { it.keys }.stateInVm(emptySet())

    fun setFilter(filter: LibraryFilter) {
        viewModelScope.launch { c.settings.setFilter(profileId, filter) }
    }

    /**
     * Fills this week's empty slots (from today on) at random from the current filters, leaving
     * out anything the person asked to avoid.
     */
    fun fillMyWeek() {
        val state = ui.value ?: return
        val f = filter.value
        viewModelScope.launch {
            val person = c.profiles.value.firstOrNull { it.id == profileId } ?: return@launch
            val result = WeekPlanner.fill(c, person, state.weekStart, state.today, f)
            say(
                when {
                    result.empty == 0 -> "Every slot is already planned."
                    result.filled == 0 -> "Nothing matches the current filters."
                    else -> "Filled ${result.filled} of ${result.empty} empty slots."
                },
            )
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

    /** Places offered under "Eating out". */
    val restaurants = c.restaurants.all

    /** Plans a slot as eating out, leftovers or a skip. It never reaches the shopping list. */
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

    /** Cooking for guests that meal: the shopping list buys for them too. */
    fun setExtraServings(date: LocalDate, slot: MealSlot, extra: Double) {
        viewModelScope.launch { c.meals.setExtraServings(profileId, date, slot, extra) }
    }

    fun copyTo(dates: Collection<LocalDate>, slot: MealSlot, recipe: Recipe) {
        if (dates.isEmpty()) return
        viewModelScope.launch {
            c.meals.copyTo(profileId, dates, slot, recipe.id)
            say("Copied to ${dates.size} day${if (dates.size == 1) "" else "s"}.")
        }
    }

    /** Everyone else on this phone, for "Add to the other side too". */
    val others: StateFlow<List<Profile>> = c.profiles.map { list -> list.filter { it.id != profileId } }
        .stateInVm(c.profiles.value.filter { it.id != profileId })

    /** "Add to the other side too": the same meal in the same slot on someone else's plan. */
    fun addToOther(other: Profile, date: LocalDate, slot: MealSlot, recipe: Recipe) {
        viewModelScope.launch {
            c.meals.setSlot(other.id, date, slot, recipe.id)
            say("Also on ${Sides.planName(other)}.")
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
