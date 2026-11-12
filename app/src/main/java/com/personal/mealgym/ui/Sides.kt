package com.personal.mealgym.ui

import com.personal.mealgym.BuildConfig
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile

/** What differs between people, apart from the theme. */
object Sides {
    /** People with the snack slot get a fourth slot on Today and Plan. */
    fun slotsFor(profile: Profile): List<MealSlot> =
        if (profile.snackSlot) MealSlot.entries.toList() else listOf(MealSlot.BREAKFAST, MealSlot.LUNCH, MealSlot.DINNER)

    /** "Ashley's Side" in the personal app; just the name in the store app. */
    fun planName(profile: Profile): String = if (BuildConfig.STORE) profile.name else "${profile.name}'s Side"
}
