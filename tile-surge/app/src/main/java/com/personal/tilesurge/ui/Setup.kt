package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.GameEvent
import com.personal.tilesurge.core.EventType
import java.time.LocalDate

/** What to play. */
sealed class Setup {
    class Infinite(val difficulty: Difficulty, val startLevel: Int) : Setup()
    class Stage(val number: Int) : Setup()

    /** Score Attack: two minutes. */
    class Timed(val difficulty: Difficulty, val startLevel: Int) : Setup()

    /** The daily challenge: a two-minute Score Attack on a board that is the same for everyone on [day] (20261113). */
    class Daily(val day: Int) : Setup()
    class Puzzle(val number: Int) : Setup()
    class Lesson(val number: Int) : Setup()

    /** One line of text that says what this is, for a game saved part-way; null for things not worth saving. */
    fun encode(): String? = when (this) {
        is Infinite -> "I,${difficulty.ordinal},$startLevel"
        is Stage -> "S,$number"
        is Timed -> "T,${difficulty.ordinal},$startLevel"
        is Daily -> "D,$day"
        is Puzzle, is Lesson -> null
    }

    companion object {
        fun decode(s: String?): Setup? = try {
            val p = s!!.split(',')
            when (p[0]) {
                "I" -> Infinite(Difficulty.entries[p[1].toInt()], p[2].toInt())
                "S" -> Stage(p[1].toInt())
                "T" -> Timed(Difficulty.entries[p[1].toInt()], p[2].toInt())
                "D" -> Daily(p[1].toInt())
                else -> null
            }
        } catch (e: Exception) {
            null
        }

        /** The daily challenge is always played at this difficulty and speed. */
        val DAILY_DIFFICULTY = Difficulty.NORMAL
        const val DAILY_LEVEL = 10

        /** The same number on every phone for the same [day], so everyone gets the same tiles. */
        fun dailySeed(day: Int): Long = day * 7919L + 17
    }
}

/** Today's date as a number like 20261113. Tests set [now] to choose the day. */
object Days {
    var now: () -> LocalDate = { LocalDate.now() }

    private fun key(d: LocalDate): Int = d.year * 10000 + d.monthValue * 100 + d.dayOfMonth
    fun today(): Int = key(now())
    fun yesterday(): Int = key(now().minusDays(1))
}

/**
 * One step of the hands-on lessons: a small board, a sentence, the move to show with a ghost finger,
 * and what the player has to make happen.
 */
class Lesson(
    val text: String,
    val rows: List<String>,
    val raise: Boolean,
    /** The tile the ghost finger picks up, and the column it slides it to. Unused when [raise] is set. */
    val fromRow: Int,
    val fromCol: Int,
    val toCol: Int,
    val done: (Game, List<GameEvent>) -> Boolean,
)

object Lessons {
    val all: List<Lesson> = listOf(
        Lesson(
            "Put a finger on a tile and slide it sideways. Line up three of a kind.",
            listOf("1121.."), false, 0, 3, 2,
        ) { _, e -> e.any { it.type == EventType.MATCH } },
        Lesson(
            "Tiles only move sideways, but they fall. Push the top tile off its perch.",
            listOf(".1....", ".2....", ".2.11."), false, 2, 1, 2,
        ) { _, e -> e.any { it.type == EventType.MATCH } },
        Lesson(
            "When tiles drop into a new match, that is a chain. Clear the bottom three and watch.",
            listOf(".33.4.", "113125"), false, 0, 3, 2,
        ) { _, e -> e.any { it.type == EventType.MATCH && it.b >= 2 } },
        Lesson(
            "New rows come up from below. Hold RAISE to bring up three rows now.",
            listOf("2..41.", "135243"), true, 0, 0, 0,
        ) { g, _ -> g.rowsRisen >= 3 },
    )

    val COUNT: Int get() = all.size
}
