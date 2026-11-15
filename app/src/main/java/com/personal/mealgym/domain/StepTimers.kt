package com.personal.mealgym.domain

import kotlin.math.roundToInt

/**
 * A time mentioned in a recipe step. A range ("15 to 18 minutes") runs for the shorter time,
 * since that's when to start checking; [upToSeconds] keeps the longer one for the label.
 */
data class StepTime(val seconds: Int, val upToSeconds: Int? = null) {
    /** "15 min", "30 sec", "1 hr 30 min". */
    val label: String get() = StepTimers.clockWords(seconds)

    /** What the button says: "15 min timer", or "20 min timer (up to 25 min)" for a range. */
    val buttonText: String
        get() = "$label timer" + (upToSeconds?.let { " (up to ${StepTimers.clockWords(it)})" } ?: "")
}

/** Finds the times worth a timer in a step's text. */
object StepTimers {
    /**
     * A number, optionally with a fraction ("1 1/2") or a range ("15 to 18"), then a unit, then
     * optionally minutes after hours ("1 hour 30 minutes"). The number can't start in the middle
     * of another one, so "1/2 hour" isn't read as 2 hours or "2.5 minutes" as 5.
     */
    private val time = Regex(
        "(?<![\\d/.,])(\\d+(?:\\.\\d+)?)(?:\\s+(\\d)/(\\d))?(?:\\s*(?:to|–|—|-)\\s*(\\d+(?:\\.\\d+)?))?\\s*(?:more\\s+)?" +
            "(minutes?|mins?|seconds?|secs?|hours?|hrs?)\\b(?:\\s+(?:and\\s+)?(\\d+)\\s*(?:minutes?|mins?)\\b)?",
        RegexOption.IGNORE_CASE,
    )

    /** "1/2 hour" on its own (after a whole number it's part of that number, handled above). */
    private val fraction = Regex("(?<![\\d/.,])(?<!\\d )(\\d)/(\\d)\\s*(?:an?\\s+)?(minutes?|mins?|hours?|hrs?)\\b", RegexOption.IGNORE_CASE)

    /** Shorter than this isn't worth reaching for the phone; longer is a marinade or a slow cooker, not a timer. */
    private const val SHORTEST = 30
    private const val LONGEST = 2 * 60 * 60

    private fun unitSeconds(word: String): Int = when (word.lowercase().first()) {
        's' -> 1
        'h' -> 3600
        else -> 60
    }

    fun find(step: String): List<StepTime> {
        val whole = time.findAll(step).mapNotNull { m ->
            val unit = unitSeconds(m.groupValues[5])
            val number = m.groupValues[1].toDoubleOrNull() ?: return@mapNotNull null
            val part = m.groupValues[2].toDoubleOrNull()?.let { top -> m.groupValues[3].toDoubleOrNull()?.takeIf { it > 0 }?.let { top / it } } ?: 0.0
            // Minutes after hours ("1 hour 30 minutes") belong to the same time.
            val extra = if (unit == 3600) (m.groupValues[6].toIntOrNull() ?: 0) * 60 else 0
            val low = ((number + part) * unit).roundToInt() + extra
            val high = m.groupValues[4].toDoubleOrNull()?.let { (it * unit).roundToInt() }?.takeIf { it > low }
            m.range to StepTime(low, high)
        }.toList()
        val halves = fraction.findAll(step)
            .filter { f -> whole.none { (range, _) -> f.range.first in range } }
            .mapNotNull { f ->
                val bottom = f.groupValues[2].toDoubleOrNull()?.takeIf { it > 0 } ?: return@mapNotNull null
                f.range to StepTime((f.groupValues[1].toDouble() / bottom * unitSeconds(f.groupValues[3])).roundToInt())
            }
        return (whole + halves).sortedBy { it.first.first }.map { it.second }
            .filter { it.seconds in SHORTEST..LONGEST }
            .distinctBy { it.seconds }
            .take(3)
    }

    fun clockWords(seconds: Int): String {
        val h = seconds / 3600
        val m = seconds % 3600 / 60
        val s = seconds % 60
        return listOfNotNull(
            if (h > 0) "$h hr" else null,
            if (m > 0) "$m min" else null,
            if (s > 0 || seconds == 0) "$s sec" else null,
        ).joinToString(" ")
    }

    /** The whole-serving sizes a recipe can be scaled to, as (multiplier, servings). */
    fun scaleChoices(servings: Int): List<Pair<Double, Int>> =
        listOf(0.5, 1.0, 1.5, 2.0, 3.0, 4.0)
            .map { it to servings * it }
            .filter { (_, n) -> n >= 1 && n == Math.floor(n) }
            .map { (m, n) -> m to n.toInt() }
            .take(5)
}
