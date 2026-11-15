package com.personal.mealgym.domain

/**
 * A time mentioned in a recipe step. A range ("15 to 18 minutes") runs for the shorter time,
 * since that's when to start checking; [upToSeconds] keeps the longer one for the label.
 */
data class StepTime(val seconds: Int, val upToSeconds: Int? = null) {
    /** "15 min", "30 sec", "1 hr 30 min". */
    val label: String get() = StepTimers.clockWords(seconds)

    /** What the button says: "15 min timer", or "15 min timer (up to 18)" for a range. */
    val buttonText: String
        get() = "$label timer" + (upToSeconds?.let { " (up to ${StepTimers.clockWords(it).substringBefore(' ')})" } ?: "")
}

/** Finds the times worth a timer in a step's text. */
object StepTimers {
    private val time = Regex(
        "(\\d+)(?:\\s*(?:to|–|—|-)\\s*(\\d+))?\\s*(?:more\\s+)?(minutes?|mins?|seconds?|secs?|hours?|hrs?)\\b",
        RegexOption.IGNORE_CASE,
    )

    /** Shorter than this isn't worth reaching for the phone; longer is a marinade or a slow cooker, not a timer. */
    private const val SHORTEST = 30
    private const val LONGEST = 2 * 60 * 60

    fun find(step: String): List<StepTime> = time.findAll(step).mapNotNull { m ->
        val unit = when (m.groupValues[3].lowercase().first()) {
            's' -> 1
            'h' -> 3600
            else -> 60
        }
        val low = (m.groupValues[1].toIntOrNull() ?: return@mapNotNull null) * unit
        val high = m.groupValues[2].toIntOrNull()?.times(unit)?.takeIf { it > low }
        if (low in SHORTEST..LONGEST) StepTime(low, high) else null
    }.distinctBy { it.seconds }.take(3).toList()

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
