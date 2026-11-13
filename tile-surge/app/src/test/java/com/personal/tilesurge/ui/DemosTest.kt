package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Checks
import com.personal.tilesurge.core.EventType
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.GameEvent
import com.personal.tilesurge.core.Phase
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** The little self-playing boards on the how-to-play pages must show what their page says. */
class DemosTest {

    @Test
    fun `slide - tiles trade places, come back, and one drops off a ledge`() {
        val demo = Demos.slide()
        val start = demo.game.boardString()
        val e = run(demo)
        assertEquals("nothing should match on this page", 0, e.count { it.type == EventType.MATCH })
        assertEquals(7, e.count { it.type == EventType.SWAP })
        assertEquals(1, e.count { it.type == EventType.LAND })
        // the bottom row is back as it began; the top tile has moved to the right-hand column
        assertEquals(start.lines().last(), demo.game.boardString().lines().last())
        assertEquals(".25143", demo.game.boardString().lines()[Game.ROWS - 2])
        assertFalse(demo.game.active)
    }

    @Test
    fun `match - one slide clears three and the tiles above drop`() {
        val demo = Demos.match()
        val e = run(demo)
        val matches = e.filter { it.type == EventType.MATCH }
        assertEquals(1, matches.size)
        assertEquals(3, matches[0].a)
        assertEquals(1, matches[0].b)
        assertEquals(3, e.count { it.type == EventType.POP })
        assertEquals(3, e.count { it.type == EventType.LAND })
        assertEquals("325342", demo.game.boardString().lines().last())
        assertFalse(demo.game.active)
    }

    @Test
    fun `chain - the tiles that drop make a second match`() {
        val demo = Demos.chain()
        val e = run(demo)
        assertEquals(listOf(1, 2), e.filter { it.type == EventType.MATCH }.map { it.b })
        assertEquals(1, e.count { it.type == EventType.CHAIN_END })
        assertFalse(demo.game.active)
    }

    @Test
    fun `rise - holding raise brings up three rows and nothing matches`() {
        val demo = Demos.rise()
        val e = run(demo)
        assertEquals(3, e.count { it.type == EventType.ROW })
        assertEquals(0, e.count { it.type == EventType.MATCH })
        assertEquals(3, demo.game.rowsRisen)
        assertEquals(0, demo.game.riseOffset)
        assertTrue(demo.game.stackHeight() <= demo.rows)
    }

    @Test
    fun `line - one match clears everything above the line`() {
        val demo = Demos.line()
        assertEquals(1, demo.game.lineRow)
        assertEquals(Phase.PLAYING, demo.game.phase)
        val e = run(demo)
        assertEquals(1, e.count { it.type == EventType.MATCH })
        assertEquals(1, e.count { it.type == EventType.STAGE_CLEAR })
        assertEquals(Phase.STAGE_CLEAR, demo.game.phase)
        assertEquals("314531", demo.game.boardString().lines().last())
    }

    @Test
    fun `every demo loops for ever without breaking the board`() {
        for (demo in Demos.all()) {
            val first = demo.game.boardString()
            repeat(demo.length * 3 + 17) {
                demo.tick()
                Checks.assertConsistent(demo.game, "in a looping demo")
            }
            // it starts again from the same board each time round
            repeat(demo.length - 17) { demo.tick() }
            demo.tick()
            assertEquals(1, demo.frame)
            val g = demo.game
            g.release()
            assertTrue(first.lines().last() == g.boardString().lines().last() || demo.showsRaise)
            assertTrue(demo.rows in 3..6)
        }
    }

    @Test
    fun `captions appear with the chain and the stage clear`() {
        val chain = Demos.chain()
        var said = false
        repeat(chain.length) {
            chain.tick()
            if (chain.captionAge == 1) {
                assertEquals("×2 CHAIN", chain.caption)
                said = true
            }
        }
        assertTrue(said)
        val line = Demos.line()
        repeat(line.length) { line.tick() }
        assertEquals("STAGE CLEAR!", line.caption)
    }

    private fun run(demo: Demo): List<GameEvent> {
        val out = ArrayList<GameEvent>()
        repeat(demo.length) {
            demo.tick()
            out += demo.lastEvents
            Checks.assertConsistent(demo.game, "in a demo, frame ${demo.frame}")
        }
        return out
    }
}
