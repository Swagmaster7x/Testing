package com.personal.mealgym.ui

import androidx.compose.runtime.staticCompositionLocalOf
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Profile
import com.personal.mealgym.data.db.WorkoutDay

/**
 * The few lines of wording that differ per look. The glam look's are playful and short; neither
 * ever comments on missed days.
 */
data class SideCopy(
    /** Short, upbeat lines and headlines (the glam look). */
    val playful: Boolean,
    val pickTitle: (MealSlot) -> String,
    val nothingPlanned: String,
    val doneToday: String,
    val workoutSaved: String,
    /** Headline over the workout on a training day. */
    val workoutHeadline: (WorkoutDay) -> String,
) {
    companion object {
        val Iron = SideCopy(
            playful = false,
            pickTitle = { "Pick your ${it.label.lowercase()}" },
            nothingPlanned = "Nothing planned",
            doneToday = "Done today",
            workoutSaved = "Saved to history.",
            workoutHeadline = { "Day ${it.dayOrder}: ${it.name}" },
        )

        val Glam = SideCopy(
            playful = true,
            pickTitle = { "Pick today's ${it.label.lowercase()}" },
            nothingPlanned = "Nothing yet",
            doneToday = "Done and dusted",
            workoutSaved = "Done and dusted. Saved to history.",
            workoutHeadline = { day ->
                val short = day.shortName.orEmpty()
                when {
                    short.contains("glute", ignoreCase = true) -> "Glute day, let's go"
                    short.isNotBlank() -> "$short day, let's go"
                    else -> "${day.name}, let's go"
                }
            },
        )

        fun forProfile(profile: Profile) = if (profile.isGlam) Glam else Iron
    }
}

val LocalCopy = staticCompositionLocalOf { SideCopy.Iron }
