package com.personal.tilesurge.core

import com.personal.tilesurge.core.Checks.count
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

/** Score Attack, puzzles, stars, and putting a game away to carry on later. */
class ModesTest {

    // ------------------------------------------------------------ Score Attack

    @Test
    fun `Score Attack ends when the clock does and speeds up on the way`() {
        val g = Game.timed(Difficulty.NORMAL, 5, 9L)
        val bot = Bot(g, 20)
        var n = 0
        while (g.phase == Phase.COUNTDOWN || g.phase == Phase.PLAYING) {
            bot.act()
            g.tick()
            if (n % 9 == 0) Checks.assertConsistent(g)
            assertTrue(++n < 9000)
        }
        assertEquals(Phase.TIME_UP, g.phase)
        assertEquals(Game.TIMED_FRAMES, g.frames)
        assertEquals(0, g.timeLeft)
        assertEquals(1, g.count(EventType.TIME_UP))
        assertTrue(g.score > 500)
        assertTrue(g.level > 5)
        val score = g.score
        g.tick()
        assertFalse(g.trySwap(0, 0))
        assertEquals(score, g.score)
    }

    @Test
    fun `Score Attack can still be lost by topping out`() {
        val g = Game.timed(Difficulty.HARD, 40, 9L)
        var n = 0
        while (g.phase != Phase.GAME_OVER) {
            g.tick()
            assertTrue(++n < Game.TIMED_FRAMES)
        }
        assertTrue(g.timeLeft > 0)
    }

    // ------------------------------------------------------------ puzzles

    @Test
    fun `every puzzle can be solved with its answer in the real game, and not in fewer moves`() {
        assertEquals(45, Puzzles.COUNT)
        var last = 0
        for (def in Puzzles.all) {
            assertEquals(def.moves, def.answer.size)
            // the second set (ice and surge tiles) starts gently again
            if (def.number == 31) last = 0
            assertTrue("puzzle ${def.number} gets easier", def.moves >= last)
            last = def.moves
            val start = Flat.parse(def.rows)
            assertEquals("puzzle ${def.number} starts with a match", 0, Flat.settle(start.copyOf()))
            assertTrue("puzzle ${def.number}'s answer fails in the real game", Flat.realGameClears(def, def.answer))
            assertEquals("puzzle ${def.number} can be done quicker", -1, Flat.fewest(start, def.moves - 1))
            Checks.assertConsistent(Game.puzzle(def))
        }
        // no two alike
        assertEquals(45, Puzzles.all.map { it.rows }.toSet().size)
    }

    @Test
    fun `a puzzle counts moves, does not rise, and is lost when they run out`() {
        val def = Puzzles.get(4)
        val g = Game.puzzle(def)
        assertEquals(Phase.PLAYING, g.phase)
        assertEquals(def.moves, g.movesLeft)
        g.raiseHeld = true
        repeat(120) { g.tick() }
        assertEquals(0, g.rowsRisen)
        assertEquals(0, g.riseOffset)
        g.raiseHeld = false
        // waste the moves sliding the bottom-left tile there and back
        val row = 0
        val col = (0 until Game.COLS - 1).first { g.grid[row][it].kind != g.grid[row][it + 1].kind && g.grid[row][it].kind != 0 }
        var used = 0
        while (g.phase == Phase.PLAYING && used < 20) {
            if (g.trySwap(row, col)) used++
            repeat(400) { if (g.active) g.tick() }
            g.tick()
        }
        assertTrue(used <= def.moves)
        if (g.phase == Phase.GAME_OVER) {
            assertEquals(0, g.movesLeft)
            assertTrue(g.tileCount() > 0)
            assertFalse(g.trySwap(row, col))
        } else {
            assertEquals(Phase.STAGE_CLEAR, g.phase)
        }
    }

    @Test
    fun `a puzzle is solved the moment the board is empty and still`() {
        val g = Game.puzzle(Puzzles.get(1))
        val m = Puzzles.get(1).answer[0]
        assertTrue(g.trySwap(m / 6, m % 6))
        var n = 0
        while (g.phase == Phase.PLAYING) {
            g.tick()
            Checks.assertConsistent(g)
            assertTrue(++n < 2000)
        }
        assertEquals(Phase.STAGE_CLEAR, g.phase)
        assertEquals(0, g.tileCount())
        assertEquals(1, g.count(EventType.STAGE_CLEAR))
    }

    // ------------------------------------------------------------ stars

    @Test
    fun `stars reward a quicker clear`() {
        for (n in 1..Stages.COUNT) {
            val s = Stages.get(n)
            assertTrue(s.threeStarFrames <= s.twoStarFrames)
            assertEquals(0, s.stars(0))
            assertEquals(3, s.stars(1))
            assertEquals(3, s.stars(s.threeStarFrames))
            assertEquals(1, s.stars(s.twoStarFrames + 1))
            if (s.goal != Goal.SURVIVE) {
                assertEquals(2, s.stars(s.threeStarFrames + 1))
                assertEquals(2, s.stars(s.twoStarFrames))
            }
        }
        // stage 1: three stars inside about three quarters of a minute, two inside a minute and a quarter
        assertEquals(44, Stages.get(1).threeStarFrames / 60)
        assertEquals(73, Stages.get(1).twoStarFrames / 60)
    }

    // ------------------------------------------------------------ blockers, surge tiles, frozen tiles, fever

    private fun quiet(vararg rows: String): Game = Game.infinite(Difficulty.NORMAL, 1, 1L).apply {
        skipCountdown()
        autoRise = false
        setBoard(*rows)
        events.clear()
    }

    private fun Game.rest() {
        var n = 0
        do {
            tick()
            Checks.assertConsistent(this)
            assertTrue(++n < 3000)
        } while (active)
    }

    @Test
    fun `a blocker cannot be slid or matched, and falls like anything else`() {
        val g = quiet(
            "B.....",
            "1.....",
            "BBB2..",
        )
        assertFalse(g.grab(0, 0))
        assertFalse(g.trySwap(0, 2))
        assertFalse(g.trySwap(2, 0))
        g.rest()
        assertEquals(0, g.count(EventType.MATCH))
        // pull the 1 out from under the top blocker: it drops
        assertTrue(g.trySwap(1, 0))
        g.rest()
        assertEquals(listOf("......", "B1....", "BBB2.."), g.boardString().lines().takeLast(3))
    }

    @Test
    fun `a match beside blockers turns them, and the ones touching them, into tiles`() {
        val g = quiet(
            "B.....",
            "BB...B",
            "1121..",
        )
        assertTrue(g.trySwap(0, 2))
        g.rest()
        // the three joined blockers went with the match; the one far away did not
        assertEquals(3, g.blocksBroken)
        assertEquals(1, g.blockCount())
        assertEquals(3, g.count(EventType.BREAK))
        assertEquals(3, g.events.first { it.type == EventType.MATCH }.a)
        // what they turned into fell into the gap and is ordinary tiles now
        assertTrue(g.tileCount() - g.blockCount() <= 4)
        assertTrue(g.score >= 60)
    }

    @Test
    fun `tiles that come out of blockers can carry a chain on`() {
        var chains = 0
        for (seed in 1L..60L) {
            val g = Game.infinite(Difficulty.NORMAL, 1, seed).apply {
                skipCountdown(); autoRise = false
                setBoard("BBBBBB", "BBBBBB", "112134")
                events.clear()
            }
            assertTrue(g.trySwap(0, 2))
            g.rest()
            assertEquals(12, g.blocksBroken)
            if (g.maxChain >= 2) chains++
        }
        assertTrue("chains from broken blockers: $chains of 60", chains in 5..59)
    }

    @Test
    fun `a surge tile takes its whole row with it`() {
        val g = quiet(
            "4.....",
            "112134",
        )
        g.grid[0][1].power = true
        assertTrue(g.trySwap(0, 2))
        g.rest()
        val m = g.events.first { it.type == EventType.MATCH }
        assertEquals(6, m.a)
        assertEquals(1, g.count(EventType.POWER))
        assertEquals("4.....", g.boardString().lines().last())
        assertEquals(6 * Scoring.PER_TILE + Scoring.comboBonus(6), g.score)
    }

    @Test
    fun `a frozen tile cannot be slid until a match beside it sets it free`() {
        val g = quiet("11213.")
        g.grid[0][3].frozen = true
        g.grid[0][4].frozen = true
        assertFalse(g.grab(0, 4))
        assertFalse(g.trySwap(0, 4))
        assertFalse("the frozen 1 will not move either", g.trySwap(0, 2))
        // free the 1 by hand for the test's sake, make the match, and the 3 beside it stays frozen
        g.grid[0][3].frozen = false
        assertTrue(g.trySwap(0, 2))
        g.rest()
        assertEquals("...23.", g.boardString().lines().last())
        assertFalse("the 2 touched the match", g.grid[0][3].frozen)
        assertTrue("the 3 did not", g.grid[0][4].frozen)
    }

    @Test
    fun `chains fill the fever meter, and fever holds the stack and doubles the score`() {
        val g = Game.infinite(Difficulty.NORMAL, 30, 1L).apply { skipCountdown() }
        var n = 0
        while (g.feverFrames == 0) {
            g.setBoard(".33...", "1131..")
            assertTrue(g.trySwap(0, 2))
            do { g.tick() } while (g.active && g.feverFrames == 0)
            assertTrue(++n < 20)
        }
        assertTrue(n >= 2)
        assertEquals(1, g.count(EventType.FEVER))
        assertEquals(0, g.fever)
        while (g.active) g.tick()
        // during fever: nothing rises, and a plain match of three is worth sixty
        g.setBoard("1121..")
        val rows = g.rowsRisen
        val offset = g.riseOffset
        val before = g.score
        assertTrue(g.trySwap(0, 2))
        while (g.active || g.grid[0][0].kind != 0) g.tick()
        assertTrue(g.feverFrames > 0)
        assertEquals(60, g.score - before)
        assertEquals(rows, g.rowsRisen)
        repeat(Game.FEVER_FRAMES) { g.tick() }
        assertEquals(0, g.feverFrames)
        assertTrue(g.rowsRisen > rows || g.riseOffset > offset)
    }

    @Test
    fun `blockers sent to a well come down once it is quiet`() {
        val g = quiet("123123")
        g.receiveBlocks(4)
        g.rest()
        g.tick()
        g.rest()
        assertEquals(4, g.blockCount())
        assertEquals(0, g.pendingBlocks)
        assertEquals(1, g.count(EventType.BLOCKS))
        // they sit on the stack in one row
        assertEquals(4, (0 until Game.COLS).count { g.grid[1][it].isBlock })
    }

    @Test
    fun `Infinite above Easy sends itself blockers once the speed is up, and Easy never does`() {
        for (d in Difficulty.entries) {
            val g = Game.infinite(d, 12, 4L)
            g.skipCountdown()
            g.autoRise = false
            repeat(3000) {
                g.tick()
                Checks.assertConsistent(g)
            }
            if (d == Difficulty.EASY) assertEquals(0, g.blockCount()) else assertTrue(g.blockCount() > 0)
        }
    }

    // ------------------------------------------------------------ stage goals

    @Test
    fun `the four kinds of stage each end on their own goal`() {
        val goals = (1..Stages.COUNT).map { Stages.get(it).goal }
        assertEquals(setOf(Goal.LINE, Goal.BREAK, Goal.CHAINS, Goal.SURVIVE), goals.toSet())
        assertEquals(Goal.LINE, goals[0])
        assertEquals(Goal.LINE, goals[1])

        // blockers: starts with the stage's number of them, and is won when the last has gone
        val b = Game.stage(Stages.get(3), 2L)
        assertEquals(Stages.get(3).target, b.blockCount())
        b.skipCountdown(); b.autoRise = false
        b.setBoard("B.....", "1121..")
        b.tick()
        assertEquals(Phase.PLAYING, b.phase)
        assertTrue(b.trySwap(0, 2))
        while (b.phase == Phase.PLAYING) b.tick()
        assertEquals(Phase.STAGE_CLEAR, b.phase)

        // chains: won on the chain step that reaches the target
        val c = Game.stage(Stages.get(5), 2L)
        c.skipCountdown(); c.autoRise = false
        var n = 0
        while (c.phase == Phase.PLAYING) {
            assertEquals(n, c.chainSteps)
            c.setBoard(".33...", "1131..")
            assertTrue(c.trySwap(0, 2))
            do { c.tick() } while (c.active && c.phase == Phase.PLAYING)
            c.tick()
            n++
            assertTrue(n < 20)
        }
        assertEquals(Stages.get(5).target, n)
        assertEquals(Phase.STAGE_CLEAR, c.phase)

        // survival: won when the time is up, with blockers raining meanwhile
        val s = Game.stage(Stages.get(7), 2L)
        s.skipCountdown(); s.autoRise = false
        var rained = 0
        while (s.phase == Phase.PLAYING) {
            s.tick()
            if (s.blockCount() > 6) { s.setBoard("123123"); rained++ }
            assertTrue(s.frames <= Stages.get(7).target + 600)
        }
        assertEquals(Phase.STAGE_CLEAR, s.phase)
        assertTrue(s.frames >= Stages.get(7).target)
        assertTrue(rained > 0)
    }

    @Test
    fun `later line stages start with tiles frozen in place`() {
        assertEquals(0, Stages.get(12).frozen)
        val def = Stages.get(16)
        assertTrue(def.frozen > 0)
        val g = Game.stage(def, 3L)
        var frozen = 0
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) if (g.grid[r][c].frozen) frozen++
        assertEquals(def.frozen, frozen)
        Checks.assertConsistent(g)
    }

    // ------------------------------------------------------------ saving

    @Test
    fun `a game put away and picked up again carries on exactly as it would have`() {
        val makers = listOf<(Long) -> Game>(
            { Game.infinite(Difficulty.NORMAL, 12, it) },
            { Game.infinite(Difficulty.HARD, 30, it) },
            { Game.stage(Stages.get(7), it) },
            { Game.stage(Stages.get(25), it) },
            { Game.timed(Difficulty.EASY, 8, it) },
        )
        for ((i, make) in makers.withIndex()) for (seed in 1L..6L) for (stopAt in intArrayOf(3, 40, 333, 1200)) {
            val original = make(seed)
            val bot = Bot(original, 18)
            repeat(stopAt) {
                bot.act()
                original.tick()
            }
            original.release()
            original.raiseHeld = false
            original.events.clear()
            val saved = original.save()
            val copy = Game.restore(saved)
            assertNotNull("maker $i seed $seed at $stopAt", copy)
            copy!!
            Checks.assertConsistent(copy, "after restoring")
            assertEquals(saved, copy.save())
            assertEquals(original.mode, copy.mode)
            assertEquals(original.kinds, copy.kinds)
            assertEquals(original.stage?.number, copy.stage?.number)
            // from here on, the same touches must give the same game
            val a = Bot(original, 14)
            val b = Bot(copy, 14)
            repeat(1500) {
                a.act()
                b.act()
                original.tick()
                copy.tick()
            }
            assertEquals("maker $i seed $seed at $stopAt", original.save(), copy.save())
            assertEquals(original.boardString(), copy.boardString())
            assertEquals(original.score, copy.score)
            assertEquals(original.phase, copy.phase)
        }
    }

    @Test
    fun `text that is not a saved game is turned away`() {
        assertNull(Game.restore(""))
        assertNull(Game.restore("hello"))
        assertNull(Game.restore("99,0,0,5,0,1,0"))
        val good = Game.infinite(Difficulty.NORMAL, 1, 1L).save()
        assertNull(Game.restore(good.substring(0, good.length / 2)))
        assertNotNull(Game.restore(good))
    }
}
