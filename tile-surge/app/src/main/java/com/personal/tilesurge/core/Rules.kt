package com.personal.tilesurge.core

import kotlin.math.max
import kotlin.math.min

enum class GameMode {
    /** Play until the stack tops out. */
    INFINITE,

    /** Bring the clear line up and clear everything above it. */
    STAGE,

    /** Score as much as possible before the clock runs out. */
    TIMED,

    /** A fixed board that does not rise: clear every tile, in a set number of moves. Also used for the lessons. */
    PUZZLE,
}

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
/** What a stage asks for. */
enum class Goal {
    /** Bring the clear line up and clear everything above it. */
    LINE,

    /** Break every blocker on the board. */
    BREAK,

    /** Make a number of chain steps. */
    CHAINS,

    /** Last for a number of seconds while blockers rain down. */
    SURVIVE,
}

class StageDef(
    val number: Int,
    val kinds: Int,
    val speedLevel: Int,
    val lines: Int,
    val startRows: Int,
    val timing: Difficulty,
    val goal: Goal = Goal.LINE,
    /** BREAK: blockers to start with. CHAINS: chain steps to make. SURVIVE: frames to last. */
    val target: Int = 0,
    /** Tiles of the opening stack that start frozen. */
    val frozen: Int = 0,
) {
    /** Roughly how many tiles have to go: the opening stack and every row down to the line. */
    private val work: Int get() = 6 * (startRows + lines)

    /** Clear the stage within this many frames for three stars (for a line stage, a brisk tile and a half a second). */
    val threeStarFrames: Int
        get() = when (goal) {
            Goal.LINE -> work * 40
            Goal.BREAK -> 1500 + target * 150
            Goal.CHAINS -> 900 + target * 600
            Goal.SURVIVE -> target
        }

    /** Within this many for two. */
    val twoStarFrames: Int
        get() = when (goal) {
            Goal.LINE -> work * 67
            Goal.SURVIVE -> target
            else -> threeStarFrames * 5 / 3
        }

    /** Stars for clearing the stage in [frames]; 0 if it has not been cleared. */
    fun stars(frames: Int): Int = when {
        frames <= 0 -> 0
        frames <= threeStarFrames -> 3
        frames <= twoStarFrames -> 2
        else -> 1
    }
}

/** A puzzle: clear every tile on [rows] (top row first) in no more than [moves] swaps. */
class PuzzleDef(val number: Int, val moves: Int, val rows: List<String>, val answer: List<Int> = emptyList())

object Stages {
    const val COUNT = 40

    /**
     * Stage [number] (1..[COUNT]). Later stages are faster and longer, and from 21 on there is a sixth tile.
     * Most are line stages; every fifth-and-third is a blocker stage, every fifth a chain stage, and
     * 7, 17, 27 and 37 are survival stages. Line stages from 14 on start with some tiles frozen.
     */
    fun get(number: Int): StageDef {
        val n = number.coerceIn(1, COUNT)
        val goal = when {
            n % 10 == 7 -> Goal.SURVIVE
            n % 5 == 3 -> Goal.BREAK
            n % 5 == 0 -> Goal.CHAINS
            else -> Goal.LINE
        }
        return StageDef(
            number = n,
            kinds = if (n <= 20) 5 else 6,
            speedLevel = min(26, 1 + ((n - 1) * 4) / 5),
            lines = min(27, 6 + ((n - 1) * 3) / 4),
            startRows = when {
                n <= 10 -> 5
                n <= 20 -> 6
                else -> 7
            },
            timing = when {
                n <= 12 -> Difficulty.EASY
                n <= 26 -> Difficulty.NORMAL
                else -> Difficulty.HARD
            },
            goal = goal,
            target = when (goal) {
                Goal.LINE -> 0
                Goal.BREAK -> min(18, 6 + n / 3)
                Goal.CHAINS -> min(6, 2 + n / 10)
                Goal.SURVIVE -> (60 + n) * 60
            },
            frozen = if (goal == Goal.LINE && n >= 14) min(8, (n - 8) / 3) else 0,
        )
    }
}
