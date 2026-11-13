package com.personal.tilesurge.core

import kotlin.math.max
import kotlin.math.min

enum class GameMode { INFINITE, STAGE }

/**
 * How forgiving the timing is. All times are frames at 60 frames a second.
 *
 * @param kinds how many different tiles appear
 * @param hoverFrames how long a tile hangs in the air before it drops
 * @param flashFrames how long a match flashes
 * @param faceFrames the pause between the flash and the first pop
 * @param popFrames the gap between one tile popping and the next
 * @param graceFrames how long the stack may press against the top before the game ends
 * @param stopPercent scales the pause in rising that combos and chains earn
 * @param startLevel the speed level Infinite mode suggests
 */
enum class Difficulty(
    val label: String,
    val kinds: Int,
    val hoverFrames: Int,
    val flashFrames: Int,
    val faceFrames: Int,
    val popFrames: Int,
    val graceFrames: Int,
    val stopPercent: Int,
    val startLevel: Int,
) {
    EASY("Easy", 5, 14, 46, 18, 10, 180, 150, 1),
    NORMAL("Normal", 5, 12, 44, 16, 9, 120, 100, 5),
    HARD("Hard", 6, 9, 36, 13, 8, 80, 70, 10),
}

/** How fast the stack rises at each speed level. */
object Speed {
    const val MAX_LEVEL = 50

    /** Frames the stack takes to rise one row, by level (1..[MAX_LEVEL]). About 15 seconds at level 1, under a second at the top. */
    val framesPerRow: IntArray = IntArray(MAX_LEVEL + 1).also { table ->
        var thousandths = 900_000L
        for (level in 1..MAX_LEVEL) {
            table[level] = max(45, ((thousandths + 500) / 1000).toInt())
            thousandths = thousandths * 94 / 100
        }
        table[0] = table[1]
    }

    /** Tiles to clear at [level] before the speed goes up (Infinite mode). */
    fun tilesToNextLevel(level: Int): Int = 9 + level
}

object Scoring {
    const val PER_TILE = 10
    const val PER_RAISED_ROW = 1

    /** Bonus for clearing [size] tiles at once (4 or more). */
    fun comboBonus(size: Int): Int {
        if (size < 4) return 0
        val n = min(size, 30)
        return 10 * (n - 3) * (n - 2)
    }

    /** Bonus for reaching step [chain] of a chain (2 or more). */
    fun chainBonus(chain: Int): Int {
        if (chain < 2) return 0
        val n = min(chain, 20)
        return 50 * (n - 1) * (n - 1)
    }
}

/**
 * One Stage Clear stage: the stack rises [lines] rows, then the clear line appears,
 * and the stage is won when nothing is left above the line.
 */
class StageDef(
    val number: Int,
    val kinds: Int,
    val speedLevel: Int,
    val lines: Int,
    val startRows: Int,
    val timing: Difficulty,
)

object Stages {
    const val COUNT = 30

    /** Stage [number] (1..[COUNT]). Later stages are faster and longer; the last ten add a sixth tile. */
    fun get(number: Int): StageDef {
        val n = number.coerceIn(1, COUNT)
        return StageDef(
            number = n,
            kinds = if (n <= 20) 5 else 6,
            speedLevel = 1 + ((n - 1) * 4) / 5,
            lines = 6 + ((n - 1) * 3) / 4,
            startRows = when {
                n <= 10 -> 5
                n <= 20 -> 6
                else -> 7
            },
            timing = when {
                n <= 10 -> Difficulty.EASY
                n <= 20 -> Difficulty.NORMAL
                else -> Difficulty.HARD
            },
        )
    }
}
