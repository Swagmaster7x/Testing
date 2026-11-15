package com.personal.tilesurge.core

import org.junit.Assert.assertTrue
import org.junit.Test

/** Two stand-in players against each other, wired together the way the versus screen wires them. */
class VersusTest {

    private var stepsA = 0
    private var stepsB = 0

    private fun attack(tiles: Int, step: Int): Int = maxOf(0, tiles - 3) + (if (step >= 2) step else 0)

    /** Plays one game; returns the winner (0 or 1) and how many frames it took. */
    private fun play(seed: Long, thinkA: Int, thinkB: Int, chainsA: Boolean = false, slipB: Int = 0): Pair<Int, Int> {
        val games = listOf(Game.infinite(Difficulty.NORMAL, 5, seed), Game.infinite(Difficulty.NORMAL, 5, seed + 1))
        games.forEach { it.selfBlocks = false }
        val bots = listOf(Bot(games[0], thinkA, chains = chainsA), Bot(games[1], thinkB, slip = slipB))
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
            if (games[0].phase == Phase.GAME_OVER || games[1].phase == Phase.GAME_OVER) {
                stepsA += games[0].chainSteps
                stepsB += games[1].chainSteps
                return (if (games[0].phase == Phase.GAME_OVER) 1 else 0) to frames
            }
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

    @Test
    fun `at the same speed, the one that looks ahead makes more chains and wins more often`() {
        var wins = 0
        val n = 60
        for (s in 1..n) if (play(s * 77L, 26, 26, chainsA = true).first == 0) wins++
        println("versus: chain planner won $wins of $n, chain steps $stepsA against $stepsB")
        assertTrue(wins > n / 2)
        assertTrue(stepsA > stepsB * 11 / 10)
    }

    @Test
    fun `Hard beats Normal and Normal beats Easy, most of the time`() {
        var hard = 0
        var normal = 0
        val n = 12
        for (s in 1..n) {
            if (play(s * 53L, 20, 34, chainsA = true).first == 0) hard++
            if (play(s * 59L, 34, 60, slipB = 25).first == 0) normal++
        }
        println("versus: Hard beat Normal $hard of $n, Normal beat Easy $normal of $n")
        assertTrue(hard > n / 2)
        assertTrue(normal > n / 2)
    }
}
