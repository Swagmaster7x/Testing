package com.personal.tilesurge.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Test

/**
 * Hammers the engine with random touches for many seeds and checks after every single frame
 * that the board still obeys its own rules (see [Checks]).
 */
class FuzzTest {

    private fun newGame(seed: Long): Game = when ((seed % 5).toInt()) {
        0 -> Game.infinite(Difficulty.EASY, 1, seed)
        1 -> Game.infinite(Difficulty.NORMAL, 20, seed)
        2 -> Game.infinite(Difficulty.HARD, 40, seed)
        3 -> Game.stage(Stages.get(1 + (seed % Stages.COUNT).toInt()), seed)
        else -> Game.infinite(Difficulty.HARD, Speed.MAX_LEVEL, seed)
    }

    /**
     * Plays [frames] frames of random input, with a swap tried on [swapChance] frames in a hundred.
     * (Every swap holds the stack still for a moment, so a low chance lets the stack reach the top
     * and a high one keeps the tiles churning.) Returns a fingerprint of everything that happened.
     */
    private fun play(seed: Long, frames: Int, swapChance: Int): Long {
        val rng = Rng(seed * 7919 + 13)
        var g = newGame(seed)
        var games = 1
        var fingerprint = 17L
        val busyFor = HashMap<Int, Int>()

        repeat(frames) {
            if (g.phase == Phase.GAME_OVER || g.phase == Phase.STAGE_CLEAR) {
                fingerprint = fingerprint * 31 + g.score + g.frames * 7L + g.boardString().hashCode()
                g = newGame(seed + 1000L * games++)
                busyFor.clear()
            }
            if (g.phase == Phase.PLAYING) {
                val x = rng.nextInt(100)
                when {
                    x < swapChance -> g.trySwap(rng.nextInt(Game.ROWS), rng.nextInt(Game.COLS - 1))
                    x < swapChance + 10 -> {
                        // Mostly aim at a row that has tiles in it.
                        val row = rng.nextInt(maxOf(1, g.stackHeight()))
                        if (g.grab(row, rng.nextInt(Game.COLS))) g.dragTo(rng.nextInt(Game.COLS))
                    }
                    x < swapChance + 14 -> g.dragTo(rng.nextInt(Game.COLS))
                    x < swapChance + 17 -> g.release()
                    x < swapChance + 20 -> g.raiseHeld = g.stackHeight() < 9 && rng.nextInt(3) == 0
                    x < swapChance + 22 -> g.raiseHeld = false
                }
            }
            val scoreBefore = g.score
            val clearedBefore = g.tilesCleared
            g.tick()
            Checks.assertConsistent(g, "in random play")
            assertTrue(g.score >= scoreBefore)
            assertTrue(g.tilesCleared >= clearedBefore)
            g.events.clear()

            // Nothing may stay in the air, or stay flashing, for ever.
            if (g.phase == Phase.PLAYING) {
                for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
                    val t = g.grid[r][c]
                    if (t.kind == 0) continue
                    if (t.state == TileState.NORMAL || t.state == TileState.LANDING) {
                        busyFor.remove(t.id)
                    } else {
                        val n = (busyFor[t.id] ?: 0) + 1
                        busyFor[t.id] = n
                        if (n > 1500) fail("tile ${t.id} at ($r,$c) has been ${t.state} for $n frames\n" + Checks.describe(g))
                    }
                }
            }
        }

        // Hands off: the board must come to rest by itself.
        g.release()
        g.raiseHeld = false
        g.autoRise = false
        var n = 0
        while (g.active && g.phase == Phase.PLAYING) {
            g.tick()
            Checks.assertConsistent(g, "while settling")
            if (++n > 3000) fail("the board never came to rest\n" + Checks.describe(g))
        }
        if (g.phase == Phase.PLAYING) {
            assertEquals("a chain was left running", 1, g.chain)
            for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) {
                val t = g.grid[r][c]
                assertTrue(t.state == TileState.NORMAL || t.state == TileState.LANDING)
                assertTrue(!t.chaining)
            }
        }
        return fingerprint * 31 + g.score + g.frames * 7L + g.boardString().hashCode()
    }

    @Test
    fun `slow random play never breaks the board`() {
        for (seed in 1L..120L) play(seed, 8000, swapChance = 3)
    }

    @Test
    fun `busy random play never breaks the board`() {
        for (seed in 1L..120L) play(seed, 5000, swapChance = 12)
    }

    @Test
    fun `frantic random play never breaks the board`() {
        for (seed in 1L..120L) play(seed, 5000, swapChance = 45)
    }

    @Test
    fun `the same seed and the same touches replay exactly`() {
        for (seed in listOf(3L, 14L, 15L, 92L, 65L)) {
            assertEquals(play(seed, 6000, swapChance = 3), play(seed, 6000, swapChance = 3))
        }
        assertTrue(play(3L, 6000, swapChance = 3) != play(4L, 6000, swapChance = 3))
    }

    @Test
    fun `random play does reach matches, chains and the end of games`() {
        // Guards the fuzz itself: if random play never cleared anything, the tests above would prove little.
        val rng = Rng(99)
        var matches = 0
        var chains = 0
        var overs = 0
        var cleared = 0
        var g = Game.infinite(Difficulty.NORMAL, 10, 1)
        var games = 1
        repeat(200_000) {
            if (g.phase == Phase.GAME_OVER) {
                overs++
                g = Game.infinite(Difficulty.NORMAL, 10, 1L + games++)
            }
            if (g.phase == Phase.PLAYING && rng.nextInt(100) < 3) {
                g.trySwap(rng.nextInt(maxOf(1, g.stackHeight())), rng.nextInt(Game.COLS - 1))
            }
            g.tick()
            for (e in g.events) {
                if (e.type == EventType.MATCH) matches++
                if (e.type == EventType.CHAIN_END) chains++
                if (e.type == EventType.POP) cleared++
            }
            g.events.clear()
        }
        assertTrue("matches: $matches", matches > 200)
        assertTrue("chains: $chains", chains > 10)
        assertTrue("games over: $overs", overs > 2)
        assertTrue("tiles cleared: $cleared", cleared > 600)
    }
}
