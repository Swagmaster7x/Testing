package com.personal.tilesurge.core

import org.junit.Assert.assertTrue
import org.junit.Test

/** Two stand-in players against each other, wired together the way the versus screen wires them. */
class VersusTest {

    private fun attack(tiles: Int, step: Int): Int = maxOf(0, tiles - 3) + (if (step >= 2) step else 0)

    /** Plays one game; returns the winner (0 or 1) and how many frames it took. */
    private fun play(seed: Long, thinkA: Int, thinkB: Int): Pair<Int, Int> {
        val games = listOf(Game.infinite(Difficulty.NORMAL, 5, seed), Game.infinite(Difficulty.NORMAL, 5, seed + 1))
        games.forEach { it.selfBlocks = false }
        val bots = listOf(Bot(games[0], thinkA), Bot(games[1], thinkB))
        var frames = 0
        while (frames++ < 60 * 60 * 30) {
            for (i in 0..1) {
                val g = games[i]
                bots[i].act()
                g.tick()
                for (e in g.events) if (e.type == EventType.MATCH) games[1 - i].receiveBlocks(g.cancelBlocks(attack(e.a, e.b)))
                g.events.clear()
                Checks.assertConsistent(g, "in a versus game")
            }
            if (games[0].phase == Phase.GAME_OVER) return 1 to frames
            if (games[1].phase == Phase.GAME_OVER) return 0 to frames
        }
        throw AssertionError("a versus game went on for half an hour")
    }

    @Test
    fun `games against the computer end, and the quicker thinker wins more of them`() {
        var quickWins = 0
        var total = 0L
        val n = 12
        for (s in 1..n) {
            val (winner, frames) = play(s * 101L, 18, 60)
            if (winner == 0) quickWins++
            total += frames
        }
        println("versus: quick thinker won $quickWins of $n, average ${total / n / 60} s")
        assertTrue(quickWins > n / 2)
    }
}
