package com.personal.tilesurge.core

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/**
 * Whole games, played by [Bot] through the same calls the touch screen makes.
 * These show that both modes can actually be played to their ends, and print how long that takes.
 */
class BotTest {

    private class Result(val phase: Phase, val frames: Int, val game: Game)

    private fun play(game: Game, thinkFrames: Int, limitFrames: Int): Result {
        val bot = Bot(game, thinkFrames)
        var n = 0
        while (game.phase != Phase.GAME_OVER && game.phase != Phase.STAGE_CLEAR && n < limitFrames + Game.COUNTDOWN_FRAMES) {
            bot.act()
            game.tick()
            if (n % 7 == 0) Checks.assertConsistent(game, "with the bot playing")
            game.events.clear()
            n++
        }
        return Result(game.phase, game.frames, game)
    }

    private fun clock(frames: Int): String = String.format("%d:%02d", frames / 3600, frames / 60 % 60)

    @Test
    fun `every stage can be cleared`() {
        val report = StringBuilder("Stage Clear, bot thinking every 20 frames (3 tries each)\n")
        var totalCleared = 0
        for (n in 1..Stages.COUNT) {
            val def = Stages.get(n)
            val times = ArrayList<String>()
            var cleared = 0
            for (seed in 1L..3L) {
                val r = play(Game.stage(def, seed * 101 + n), 20, 20 * 3600)
                if (r.phase == Phase.STAGE_CLEAR) {
                    cleared++
                    times += clock(r.frames)
                } else {
                    times += if (r.phase == Phase.GAME_OVER) "over@" + clock(r.frames) else "timeout"
                }
            }
            totalCleared += cleared
            report.append(String.format("stage %2d  speed %2d  lines %2d  kinds %d  cleared %d/3  %s\n",
                n, def.speedLevel, def.lines, def.kinds, cleared, times.joinToString(" ")))
            // The early stages must be comfortably winnable even for this simple player.
            if (n <= 10) assertEquals("stage $n\n$report", 3, cleared)
        }
        println(report)
        assertTrue("only $totalCleared of ${Stages.COUNT * 3} runs cleared\n$report", totalCleared >= Stages.COUNT * 2)
    }

    @Test
    fun `a faster player clears the last stage`() {
        var cleared = 0
        val times = ArrayList<String>()
        for (seed in 1L..5L) {
            val r = play(Game.stage(Stages.get(Stages.COUNT), seed), 10, 20 * 3600)
            if (r.phase == Phase.STAGE_CLEAR) cleared++
            times += r.phase.name + "@" + clock(r.frames)
        }
        println("Stage ${Stages.COUNT}, bot thinking every 10 frames: $times")
        assertTrue("cleared $cleared of 5: $times", cleared >= 3)
    }

    @Test
    fun `Infinite mode lasts a good while and then ends`() {
        val report = StringBuilder("Infinite, 10 minute cap\n")
        for (d in Difficulty.entries) {
            for (think in intArrayOf(30, 15)) {
                val lines = ArrayList<String>()
                var total = 0
                for (seed in 1L..4L) {
                    val r = play(Game.infinite(d, d.startLevel, seed), think, 10 * 3600)
                    total += r.frames
                    lines += String.format("%s lv%d %dpts x%d", clock(r.frames), r.game.level, r.game.score, r.game.maxChain) +
                        if (r.phase == Phase.GAME_OVER) "" else "+"
                }
                report.append(String.format("%-6s think %2d  %s\n", d.label, think, lines.joinToString(" | ")))
                if (d == Difficulty.EASY) assertTrue("Easy ended after only ${clock(total / 4)} on average\n$report", total / 4 > 90 * 60)
            }
        }
        println(report)
    }

    @Test
    fun `a player who does nothing loses`() {
        for (d in Difficulty.entries) {
            val g = Game.infinite(d, d.startLevel, 11L)
            var n = 0
            while (g.phase != Phase.GAME_OVER) {
                g.tick()
                g.events.clear()
                assertTrue("still going after 20 minutes on ${d.label}", ++n < 20 * 3600)
            }
            println(String.format("%-6s left alone from level %d: over after %s", d.label, d.startLevel, clock(g.frames)))
        }
    }

    @Test
    fun `holding raise from the start ends the game quickly`() {
        val g = Game.infinite(Difficulty.NORMAL, 1, 5L)
        g.raiseHeld = true
        var n = 0
        while (g.phase != Phase.GAME_OVER) {
            g.tick()
            Checks.assertConsistent(g)
            g.events.clear()
            assertTrue(++n < 3600)
        }
        assertTrue(g.rowsRisen in 1..Game.ROWS)
        assertEquals(g.rowsRisen, g.score)
    }
}
