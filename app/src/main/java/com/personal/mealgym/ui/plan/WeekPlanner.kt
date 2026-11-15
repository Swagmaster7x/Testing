package com.personal.mealgym.ui.plan

import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.LibraryFilter
import com.personal.mealgym.data.db.MealPlanEntry
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.CookRating
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.DayTotals
import com.personal.mealgym.domain.PlanBuilder
import com.personal.mealgym.domain.TargetResult
import com.personal.mealgym.domain.SlotKey
import com.personal.mealgym.domain.WeekFiller
import com.personal.mealgym.domain.answers
import com.personal.mealgym.ui.Sides
import com.personal.mealgym.ui.accepts
import kotlinx.coroutines.flow.first
import java.time.DayOfWeek
import java.time.LocalDate
import kotlin.random.Random

/**
 * "Fill my week" for one person: every empty slot from [from] to the end of the week gets a
 * recipe that fits their filters. Recipes they've hidden, asked to avoid or rated "Not again"
 * are never picked, and their favourite cuisines and recipes they loved come up more often.
 * Someone with a calorie and protein guide gets the week that lands closest to it.
 */
object WeekPlanner {
    data class Result(val filled: Int, val empty: Int)

    suspend fun fill(
        c: AppContainer,
        profile: Profile,
        weekStart: LocalDate,
        from: LocalDate,
        filter: LibraryFilter = LibraryFilter(),
        random: Random = Random.Default,
    ): Result {
        val recipes = c.meals.recipesFor(profile.id).first()
        val blocked = c.meals.conflictsFor(profile.id).first().keys
        val ratings = c.meals.ratings(profile.id).first()
        val favourites = profile.answers?.cuisines.orEmpty()
        val byId = recipes.associateBy { it.id }
        val existing = c.meals.weekEntries(profile.id, weekStart)
            .mapNotNull { e -> byId[e.recipeId]?.let { SlotKey(Dates.parse(e.date), e.slot) to it } }
            .toMap()
        // Slots planned as eating out, leftovers or a skip are already spoken for.
        val offPlan = c.meals.weekOffPlan(profile.id, weekStart).associateBy { SlotKey(Dates.parse(it.date), it.slot) }
        val slots = Sides.slotsFor(profile)
        val days = Dates.weekDays(weekStart).filter { !it.isBefore(from) }
        val empty = days.flatMap { d -> slots.map { SlotKey(d, it) } }.filter { it !in existing && it !in offPlan }
        val candidates = slots.associateWith { slot ->
            PlanBuilder.weighted(
                // "Not again" keeps a recipe out of this person's fills; "Loved it" brings it up more often.
                recipes.filter {
                    !it.isHidden && it.id !in blocked && ratings[it.id] != CookRating.NOT_AGAIN &&
                        slot.accepts(it.mealType) && WeekFiller.matches(it, filter)
                },
                favourites,
            ).flatMap { if (ratings[it.id] == CookRating.LOVED) listOf(it, it) else listOf(it) }
        }
        val targets = (profile.answers?.let(PlanBuilder::targets) as? TargetResult.Ready)?.targets
        val filled = if (targets == null) {
            WeekFiller.fill(empty, existing, { candidates.getValue(it) }, random)
        } else {
            // With a guide to aim for, try the week several ways and keep the closest.
            WeekFiller.fillNear(empty, existing, { candidates.getValue(it) }, distance = { picked ->
                DayTotals.distance(
                    days.map { d ->
                        DayTotals.total(
                            slots.mapNotNull { slot ->
                                val key = SlotKey(d, slot)
                                (picked[key] ?: existing[key])?.let { DayTotals.meal(it, profile.portion, slot) }
                                    ?: offPlan[key]?.let(DayTotals::meal)
                            },
                        )
                    },
                    targets,
                )
            }, random = random)
        }
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
