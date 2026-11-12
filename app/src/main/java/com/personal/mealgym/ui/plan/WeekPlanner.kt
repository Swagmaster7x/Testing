package com.personal.mealgym.ui.plan

import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.SlotKey
import com.personal.mealgym.domain.WeekFiller
import com.personal.mealgym.domain.answers
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.accepts
import kotlinx.coroutines.flow.first
import java.time.DayOfWeek
import java.time.LocalDate

/**
 * "Fill my week" for one person: every empty slot from [from] to the end of the week gets a
 * recipe that fits their filters. Recipes they've hidden or asked to avoid are never picked,
 * and their favourite cuisines come up more often.
 */
object WeekPlanner {
    data class Result(val filled: Int, val empty: Int)

    suspend fun fill(c: AppContainer, profile: Profile, weekStart: LocalDate, from: LocalDate, filter: LibraryFilter = LibraryFilter()): Result {
        val recipes = c.meals.recipesFor(profile.id).first()
        val blocked = c.meals.conflictsFor(profile.id).first().keys
        val favourites = profile.answers?.cuisines.orEmpty()
        val byId = recipes.associateBy { it.id }
        val existing = c.meals.weekEntries(profile.id, weekStart)
            .mapNotNull { e -> byId[e.recipeId]?.let { SlotKey(Dates.parse(e.date), e.slot) to it } }
            .toMap()
        val slots = Sides.slotsFor(profile)
        val empty = Dates.weekDays(weekStart)
            .filter { !it.isBefore(from) }
            .flatMap { d -> slots.map { SlotKey(d, it) } }
            .filter { it !in existing }
        val filled = WeekFiller.fill(empty, existing, { slot ->
            PlanBuilder.weighted(
                recipes.filter { !it.isHidden && it.id !in blocked && slot.accepts(it.mealType) && WeekFiller.matches(it, filter) },
                favourites,
            )
        })
        c.meals.putEntries(
            filled.map { (k, r) -> MealPlanEntry(date = Dates.iso(k.date), slot = k.slot, recipeId = r.id, profileId = profile.id) },
        )
        return Result(filled.size, empty.size)
    }

    /**
     * A first plan for someone who has just been set up: the rest of this week, and next week
     * too when this one is nearly over.
     */
    suspend fun firstWeek(c: AppContainer, profile: Profile, today: LocalDate): Int {
        val thisWeek = Dates.weekStart(today)
        var filled = fill(c, profile, thisWeek, today).filled
        if (today.dayOfWeek >= DayOfWeek.THURSDAY) filled += fill(c, profile, thisWeek.plusWeeks(1), today).filled
        return filled
    }
}
