@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.plan

import androidx.lifecycle.viewModelScope
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.SlotKey
import com.personal.mealgym.domain.WeekFiller
import com.personal.mealgym.ui.accepts
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
import kotlinx.coroutines.flow.map
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
    /** The schedule layer: "Glutes + hams", "Upper", "Rest"... (empty unless the person turned it on). */
    val badges: Map<LocalDate, String> = emptyMap(),
    val slots: List<MealSlot> = Sides.slotsFor(Profile(0, "", Profile.THEME_IRON)),
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
            combine(c.meals.planForWeek(profileId, ws), c.meals.recipesFor(profileId), scheduleBadges(ws, today, person)) { plan, recipes, badges ->
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
                PlanUi(ws, today, days, recipes, badges, slots)
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

    fun setFilter(filter: LibraryFilter) {
        viewModelScope.launch { c.settings.setFilter(profileId, filter) }
    }

    /** Fills this week's empty slots (from today on) at random from the current filters. */
    fun fillMyWeek() {
        val state = ui.value ?: return
        val f = filter.value
        viewModelScope.launch {
            val byId = state.recipes.associateBy { it.id }
            val existing = c.meals.weekEntries(profileId, state.weekStart)
                .mapNotNull { e -> byId[e.recipeId]?.let { SlotKey(Dates.parse(e.date), e.slot) to it } }
                .toMap()
            val empty = Dates.weekDays(state.weekStart)
                .filter { !it.isBefore(state.today) }
                .flatMap { d -> state.slots.map { SlotKey(d, it) } }
                .filter { it !in existing }
            val filled = WeekFiller.fill(empty, existing, { slot ->
                state.recipes.filter { !it.isHidden && slot.accepts(it.mealType) && WeekFiller.matches(it, f) }
            })
            c.meals.putEntries(filled.map { (k, r) -> MealPlanEntry(date = Dates.iso(k.date), slot = k.slot, recipeId = r.id, profileId = profileId) })
            say(
                when {
                    empty.isEmpty() -> "Every slot is already planned."
                    filled.isEmpty() -> "Nothing matches the current filters."
                    else -> "Filled ${filled.size} of ${empty.size} empty slots."
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
