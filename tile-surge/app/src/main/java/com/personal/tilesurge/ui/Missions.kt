package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Rng

enum class MissionKind { TILES, CHAIN, COMBO, STAGES, PUZZLES, TIMED_SCORE, BLOCKS, GAMES }

/** One of the day's three small goals. */
class Mission(val kind: MissionKind, val target: Int, val reward: Int, val text: String)

/** What one finished game adds up to, for missions and for the lifetime figures. */
class Run(
    val tiles: Int,
    val bestChain: Int,
    val bestCombo: Int,
    val blocks: Int,
    val chainSteps: Int,
    val score: Int,
    val timed: Boolean = false,
    val stageCleared: Boolean = false,
    val puzzleSolved: Boolean = false,
    val versusWon: Boolean = false,
    /** The rest of a game that was carried on after a continue: it is not a new game. */
    val carriedOn: Boolean = false,
)

/** No Android code here, so the plain unit tests can check it. */
object Missions {
    private val POOL = listOf(
        Mission(MissionKind.TILES, 150, 40, "Clear 150 tiles"),
        Mission(MissionKind.TILES, 300, 70, "Clear 300 tiles"),
        Mission(MissionKind.CHAIN, 3, 40, "Make a ×3 chain"),
        Mission(MissionKind.CHAIN, 4, 80, "Make a ×4 chain"),
        Mission(MissionKind.COMBO, 5, 30, "Clear 5 tiles at once"),
        Mission(MissionKind.COMBO, 7, 60, "Clear 7 tiles at once"),
        Mission(MissionKind.STAGES, 2, 50, "Clear 2 stages"),
        Mission(MissionKind.PUZZLES, 2, 40, "Solve 2 puzzles"),
        Mission(MissionKind.TIMED_SCORE, 3000, 40, "Score 3,000 in Score Attack"),
        Mission(MissionKind.TIMED_SCORE, 6000, 80, "Score 6,000 in Score Attack"),
        Mission(MissionKind.BLOCKS, 12, 50, "Break 12 blockers"),
        Mission(MissionKind.GAMES, 3, 30, "Finish 3 games"),
    )

    /** The three missions for [day] (a date as 20261113): the same on every phone, never two of one kind. */
    fun forDay(day: Int): List<Mission> {
        val rng = Rng(day * 31L + 7)
        val out = ArrayList<Mission>()
        var guard = 0
        while (out.size < 3 && guard++ < 500) {
            val m = POOL[rng.nextInt(POOL.size)]
            if (out.none { it.kind == m.kind }) out += m
        }
        return out
    }

    /** Where a mission stands after [run], given where it stood before. Never past its target. */
    fun progress(m: Mission, before: Int, run: Run): Int {
        val now = when (m.kind) {
            MissionKind.TILES -> before + run.tiles
            MissionKind.CHAIN -> maxOf(before, run.bestChain)
            MissionKind.COMBO -> maxOf(before, run.bestCombo)
            MissionKind.STAGES -> before + (if (run.stageCleared) 1 else 0)
            MissionKind.PUZZLES -> before + (if (run.puzzleSolved) 1 else 0)
            MissionKind.TIMED_SCORE -> if (run.timed) maxOf(before, run.score) else before
            MissionKind.BLOCKS -> before + run.blocks
            MissionKind.GAMES -> before + (if (run.carriedOn) 0 else 1)
        }
        return minOf(now, m.target)
    }

    /** What the shop charges. The first of each is free. */
    val THEME_PRICES = intArrayOf(0, 150, 300, 300, 450, 600)
    val BACKDROP_PRICES = intArrayOf(0, 100, 100, 100, 200, 200)
    const val COINS_PER_STAR = 5
    const val COINS_PER_PUZZLE = 10

    /** Carrying on once after the stack has reached the top, in Infinite. */
    const val CONTINUE_PRICE = 100
}
