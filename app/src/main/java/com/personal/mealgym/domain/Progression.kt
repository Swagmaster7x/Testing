package com.personal.mealgym.domain

import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.LoggedSet
import java.time.LocalDate
import kotlin.math.max
import kotlin.math.min

/** One set as it was logged. Either part can be missing. */
data class LiftSet(val weight: Double?, val reps: Int?)

/**
 * One exercise in one finished workout. [sets] are the ones with a weight or reps written
 * down, in order; [ticked] counts every set that was ticked off, written down or not.
 */
data class LiftDay(
    val date: LocalDate,
    val sessionId: Long,
    val feeling: Feeling,
    val sets: List<LiftSet>,
    val ticked: Int,
    /** The workout day it belonged to, when that day still exists. */
    val workoutDayId: Long? = null,
)

/** The reps the plan asks for: "8–12" is 8 to 12, "10 each arm" is 10 to 10. */
data class RepRange(val low: Int, val high: Int)

/** What to aim for next time, and why. A null [weight] is a bodyweight move. */
data class Suggestion(val weight: Double?, val reps: Int, val reason: String) {
    val text: String get() = if (weight != null) "${Progression.weightText(weight)} x $reps" else "$reps reps"
}

/** One week of training at a glance. */
data class WeekSummary(
    val weekStart: LocalDate,
    val sessions: Int,
    /** Training days set for the week, to read "2 of 4". */
    val planned: Int,
    /** Sets ticked off, where the app has them (workouts finished since sets were kept). */
    val sets: Int,
    val byGroup: List<Pair<MuscleGroup, Int>>,
)

/**
 * Turns the lifting log into something to act on. The rule is double progression: stay at a
 * weight until every set reaches the top of the rep range, then add a little weight and start
 * again from the bottom of the range.
 */
object Progression {

    private val rangeText = Regex("(\\d+)\\s*[–—-]\\s*(\\d+)")
    private val firstNumber = Regex("^\\s*(\\d+)")
    private val timed = Regex("second|\\bsecs?\\b|minute|\\bmins?\\b|step|yard|met(?:er|re)", RegexOption.IGNORE_CASE)

    /** Holds and carries are counted in time or distance, so there's no weight-and-reps target to give. */
    fun isTimed(repsText: String): Boolean = timed.containsMatchIn(repsText)

    fun repRange(repsText: String): RepRange? {
        if (isTimed(repsText)) return null
        rangeText.find(repsText)?.let { m ->
            val a = m.groupValues[1].toInt()
            val b = m.groupValues[2].toInt()
            return RepRange(min(a, b), max(a, b))
        }
        return firstNumber.find(repsText)?.let { m -> m.groupValues[1].toInt().let { RepRange(it, it) } }
    }

    /** The smallest sensible jump: plates and dumbbells come in these steps. */
    fun increment(weight: Double, unit: WeightUnit): Double = when (unit) {
        WeightUnit.LB -> if (weight < 20.0) 2.5 else 5.0
        WeightUnit.KG -> if (weight < 10.0) 1.0 else 2.5
    }

    /**
     * How sets are ranked: the heavier one wins, and at the same weight the one with more reps.
     * It's how people say it ("my best is 140 for 8"), and it never calls a lighter set better
     * than a heavier one. Bodyweight moves are ranked by reps.
     */
    private val byWeightThenReps = compareBy<LiftSet> { it.weight ?: 0.0 }.thenBy { it.reps ?: 0 }

    /** Whether the exercise has been logged with weight at all (otherwise it's compared by reps). */
    private fun weighted(days: List<LiftDay>): Boolean = days.any { d -> d.sets.any { (it.weight ?: 0.0) > 0 } }

    private fun comparable(sets: List<LiftSet>, byWeight: Boolean): List<LiftSet> =
        sets.filter { if (byWeight) (it.weight ?: 0.0) > 0 else it.weight == null && it.reps != null }

    /** The best set of a day, by the same measure the whole history uses. */
    fun bestOf(day: LiftDay, byWeight: Boolean): LiftSet? = comparable(day.sets, byWeight).maxWithOrNull(byWeightThenReps)

    /** The best set ever, with the first day it happened. */
    fun best(days: List<LiftDay>): Pair<LiftSet, LocalDate>? {
        val byWeight = weighted(days)
        var best: Pair<LiftSet, LocalDate>? = null
        for (d in days) {
            val set = bestOf(d, byWeight) ?: continue
            if (best == null || byWeightThenReps.compare(set, best.first) > 0) best = set to d.date
        }
        return best
    }

    /**
     * One point per workout for the trend line: the heaviest weight that day, or the most reps
     * in a set for a bodyweight move. Reps at the same weight show in the list, not the line.
     */
    fun trend(days: List<LiftDay>): List<Pair<LocalDate, Double>> {
        val byWeight = weighted(days)
        return days.mapNotNull { d ->
            bestOf(d, byWeight)?.let { set -> d.date to (if (byWeight) set.weight!! else set.reps!!.toDouble()) }
        }
    }

    /** True when [today] has a set that beats everything in [before]. A first-ever log isn't a "new best". */
    fun isNewBest(today: List<LiftSet>, before: List<LiftDay>): Boolean {
        val previous = best(before)?.first ?: return false
        val now = comparable(today, (previous.weight ?: 0.0) > 0).maxWithOrNull(byWeightThenReps) ?: return false
        return byWeightThenReps.compare(now, previous) > 0
    }

    /** What to try next time, from the last time the exercise was logged. Null when there's nothing to go on. */
    fun next(last: LiftDay, repsText: String, unit: WeightUnit): Suggestion? {
        if (isTimed(repsText)) return null
        val sets = last.sets.filter { it.reps != null }
        if (sets.isEmpty()) return null
        val top = sets.mapNotNull { it.weight }.filter { it > 0 }.maxOrNull()
        val working = if (top == null) sets else sets.filter { it.weight == top }
        val lowest = working.minOf { it.reps!! }
        val highest = working.maxOf { it.reps!! }
        val range = repRange(repsText)

        if (last.feeling == Feeling.ROUGH) return Suggestion(top, lowest, "Last time was rough. Match it before adding more.")
        if (range == null) return Suggestion(top, lowest + 1, "One more rep than last time.")
        // Lighter warm-up or back-off sets aren't judged, so the reason only says "every set" when that's true.
        val oneWeight = sets.all { it.weight == top }
        return when {
            top != null && highest < range.low - 1 -> {
                val lighter = top - increment(top, unit)
                if (lighter > 0) {
                    Suggestion(lighter, range.low, "Last time fell short of ${range.low} reps. Go a little lighter.")
                } else {
                    Suggestion(top, range.low, "Last time fell short of ${range.low} reps. Stay here and build up to it.")
                }
            }
            lowest >= range.high && top != null -> Suggestion(
                top + increment(top, unit),
                range.low,
                (if (oneWeight) "You hit ${range.high} on every set." else "You hit ${range.high} at your top weight.") + " Time to add weight.",
            )
            lowest >= range.high ->
                Suggestion(null, lowest + 1, "You're past ${range.high} reps. Add weight or a harder version when it feels easy.")
            else -> Suggestion(top, min(range.high, lowest + 1), "Add a rep before adding weight.")
        }
    }

    fun weightText(weight: Double): String = if (weight == Math.floor(weight)) weight.toLong().toString() else weight.toString()

    /**
     * Sets in a line: "135 x 8, 8, 7" at one weight, "135 x 8 · 140 x 6" across weights,
     * "12, 10, 9 reps" for bodyweight, "135" when only the weight was noted.
     */
    fun describe(sets: List<LiftSet>): String? {
        val valued = sets.filter { it.weight != null || it.reps != null }
        if (valued.isEmpty()) return null
        // Runs of the same weight share it.
        val runs = mutableListOf<Pair<Double?, MutableList<Int?>>>()
        for (s in valued) {
            if (runs.isNotEmpty() && runs.last().first == s.weight) runs.last().second += s.reps else runs += s.weight to mutableListOf(s.reps)
        }
        return runs.joinToString(" · ") { (weight, reps) ->
            val counted = reps.filterNotNull().joinToString(", ")
            when {
                weight != null && counted.isNotEmpty() -> "${weightText(weight)} x $counted"
                weight != null -> weightText(weight)
                else -> "$counted reps"
            }
        }
    }

    /** The log grouped into each exercise's history, oldest workout first, keyed by lower-case name. */
    fun history(logged: List<LoggedSet>): Map<String, List<LiftDay>> =
        logged.groupBy { it.exerciseNameUsed.lowercase() }.mapValues { (_, rows) ->
            rows.groupBy { it.sessionId }.values.map { session ->
                val ordered = session.sortedWith(compareBy<LoggedSet> { it.setIndex ?: -1 }.thenBy { it.id })
                LiftDay(
                    date = Dates.parse(ordered.first().date),
                    sessionId = ordered.first().sessionId,
                    feeling = ordered.first().feeling,
                    sets = ordered.filter { it.weight != null || it.reps != null }.map { LiftSet(it.weight, it.reps) },
                    ticked = ordered.count { it.setIndex != null },
                    workoutDayId = ordered.first().workoutDayId,
                )
            }.sortedWith(compareBy<LiftDay> { it.date }.thenBy { it.sessionId })
        }

    /** The last workout where something was written down for the exercise. */
    fun lastLogged(days: List<LiftDay>?): LiftDay? = days?.lastOrNull { it.sets.isNotEmpty() }

    /**
     * The log to go on for an exercise on one workout day. The same exercise can be on two days
     * with different rep ranges (hip thrusts for 8 to 12 one day and 12 to 15 another), and a
     * heavy day mustn't be judged against a light day's range. So: the last time it was logged
     * on [dayId] if there is one; otherwise the last time anywhere, but only as a basis for a
     * suggestion when [sameRangeEverywhere] (second of the pair).
     */
    fun basisFor(days: List<LiftDay>?, dayId: Long?, sameRangeEverywhere: Boolean): Pair<LiftDay?, Boolean> {
        val here = lastLogged(days?.filter { dayId != null && it.workoutDayId == dayId })
        if (here != null) return here to true
        return lastLogged(days) to sameRangeEverywhere
    }

    fun week(weekStart: LocalDate, sessionDates: List<LocalDate>, planned: Int, logged: List<LoggedSet>): WeekSummary {
        val end = weekStart.plusDays(6)
        fun inWeek(date: LocalDate) = !date.isBefore(weekStart) && !date.isAfter(end)
        val ticked = logged.filter { it.setIndex != null && inWeek(Dates.parse(it.date)) }
        val groups = ticked.groupingBy { Muscles.groupOf(it.exerciseNameUsed) }.eachCount()
            .toList().sortedWith(compareByDescending<Pair<MuscleGroup, Int>> { it.second }.thenBy { it.first.ordinal })
        return WeekSummary(weekStart, sessionDates.count(::inWeek), planned, ticked.size, groups)
    }
}
