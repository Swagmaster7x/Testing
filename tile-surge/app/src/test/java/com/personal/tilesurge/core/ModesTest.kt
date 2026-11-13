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
        assertEquals(30, Puzzles.COUNT)
        var last = 0
        for (def in Puzzles.all) {
            assertEquals(def.moves, def.answer.size)
            assertTrue("puzzle ${def.number} gets easier", def.moves >= last)
            last = def.moves
            val start = Flat.parse(def.rows)
            assertEquals("puzzle ${def.number} starts with a match", 0, Flat.settle(start.copyOf()))
            assertTrue("puzzle ${def.number}'s answer fails in the real game", Flat.realGameClears(def, def.answer))
            assertEquals("puzzle ${def.number} can be done quicker", -1, Flat.fewest(start, def.moves - 1))
            Checks.assertConsistent(Game.puzzle(def))
        }
        // no two alike
        assertEquals(30, Puzzles.all.map { it.rows }.toSet().size)
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
            assertTrue(s.threeStarFrames < s.twoStarFrames)
            assertEquals(0, s.stars(0))
            assertEquals(3, s.stars(1))
            assertEquals(3, s.stars(s.threeStarFrames))
            assertEquals(2, s.stars(s.threeStarFrames + 1))
            assertEquals(2, s.stars(s.twoStarFrames))
            assertEquals(1, s.stars(s.twoStarFrames + 1))
        }
        // stage 1: three stars inside about three quarters of a minute, two inside a minute and a quarter
        assertEquals(44, Stages.get(1).threeStarFrames / 60)
        assertEquals(73, Stages.get(1).twoStarFrames / 60)
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
