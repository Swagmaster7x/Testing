package com.personal.mealgym.ui

import com.personal.mealgym.data.Profiles
import com.personal.mealgym.data.db.MealSlot

/** What differs between the two sides, apart from the theme. */
object Sides {
    /** Ashley's Today and Plan add a fourth slot, Snack. */
    fun slotsFor(profileId: Long): List<MealSlot> =
        if (profileId == Profiles.ASHLEY) MealSlot.entries.toList() else listOf(MealSlot.BREAKFAST, MealSlot.LUNCH, MealSlot.DINNER)

    fun isAshley(profileId: Long) = profileId == Profiles.ASHLEY
}
