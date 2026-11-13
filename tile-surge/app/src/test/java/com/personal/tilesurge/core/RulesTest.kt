package com.personal.tilesurge.core

import com.personal.tilesurge.core.Checks.count
import com.personal.tilesurge.core.Checks.run
import com.personal.tilesurge.core.Checks.runUntil
import com.personal.tilesurge.core.Checks.still
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

/** One test per rule of the puzzle. Boards are written top row first; `.` is a gap. */
class RulesTest {

    private val normal = Difficulty.NORMAL
    private val flash = normal.flashFrames + normal.faceFrames

    // ------------------------------------------------------------ the opening board

    @Test
    fun `every opening board is calm, with nothing matched and nothing floating`() {
        for (seed in 1L..300L) {
            val games = listOf(
                Game.infinite(Difficulty.EASY, 1, seed),
                Game.infinite(Difficulty.HARD, 10, seed),
                Game.stage(Stages.get((seed % Stages.COUNT).toInt() + 1), seed),
            )
            for (g in games) {
                Checks.assertConsistent(g, "at the start")
                assertFalse(g.active)
                assertEquals(Phase.COUNTDOWN, g.phase)
                for (c in 0 until Game.COLS) {
                    val h = g.columnHeight(c)
                    assertTrue("column $c is $h tall", h in 1..Game.ROWS - 4)
                    // no gaps inside a column
                    for (r in 0 until h) assertTrue(g.grid[r][c].kind != 0)
                    // the row coming up never matches the row above it by itself
                    assertTrue(g.incoming[c] != g.grid[0][c].kind)
                }
            }
        }
    }

    @Test
    fun `the same seed gives the same game`() {
        val a = Game.infinite(normal, 5, 42L)
        val b = Game.infinite(normal, 5, 42L)
        val c = Game.infinite(normal, 5, 43L)
        assertEquals(a.boardString(), b.boardString())
        assertTrue(a.boardString() != c.boardString() || !a.incoming.contentEquals(c.incoming))
    }

    @Test
    fun `nothing can be moved during the countdown`() {
        val g = Game.infinite(normal, 1, 7L)
        assertFalse(g.trySwap(0, 0))
        assertFalse(g.grab(0, 0))
        repeat(Game.COUNTDOWN_FRAMES) { g.tick() }
        assertEquals(Phase.PLAYING, g.phase)
        assertEquals(1, g.count(EventType.GO))
        assertEquals(0, g.frames)
        assertTrue(g.trySwap(0, 0))
    }

    // ------------------------------------------------------------ swapping

    @Test
    fun `a swap trades two tiles and takes four frames`() {
        val g = still("12....")
        assertTrue(g.trySwap(0, 0))
        assertEquals("21....", g.boardString().lines().last())
        assertEquals(TileState.SWAPPING, g.grid[0][0].state)
        assertEquals(-1, g.grid[0][0].swapDir)
        assertEquals(1, g.grid[0][1].swapDir)
        assertTrue(g.active)
        g.run(Game.SWAP_FRAMES - 1)
        assertEquals(TileState.SWAPPING, g.grid[0][0].state)
        g.run(1)
        assertEquals(TileState.NORMAL, g.grid[0][0].state)
        assertEquals(TileState.NORMAL, g.grid[0][1].state)
        assertFalse(g.active)
    }

    @Test
    fun `a tile can be swapped into a gap, but two gaps cannot be swapped`() {
        val g = still("1.....")
        assertFalse(g.trySwap(0, 2))
        assertTrue(g.trySwap(0, 0))
        assertEquals(".1....", g.boardString().lines().last())
    }

    @Test
    fun `tiles that are sliding cannot be swapped again until they stop`() {
        val g = still("123...")
        assertTrue(g.trySwap(0, 0))
        assertFalse(g.trySwap(0, 0))
        assertFalse(g.trySwap(0, 1))
        g.run(Game.SWAP_FRAMES)
        assertTrue(g.trySwap(0, 1))
    }

    @Test
    fun `swaps outside the well are refused`() {
        val g = still("12....")
        assertFalse(g.trySwap(-1, 0))
        assertFalse(g.trySwap(Game.ROWS, 0))
        assertFalse(g.trySwap(0, -1))
        assertFalse(g.trySwap(0, Game.COLS - 1))
    }

    // ------------------------------------------------------------ hanging and falling

    @Test
    fun `a tile pushed over a gap hangs, then drops a cell a frame, then lands`() {
        val g = still(
            "1.....",
            "2.....",
            "3.....",
            "4.....",
        )
        assertTrue(g.trySwap(3, 0)) // the top tile slides right, over nothing
        g.run(Game.SWAP_FRAMES)
        assertEquals(TileState.HOVERING, g.grid[3][1].state)
        // it hangs for the whole hover time...
        g.run(normal.hoverFrames - 1)
        assertEquals(TileState.HOVERING, g.grid[3][1].state)
        // ...then falls one cell each frame
        g.run(1)
        assertEquals(TileState.FALLING, g.grid[2][1].state)
        g.run(1)
        assertEquals(TileState.FALLING, g.grid[1][1].state)
        g.run(1)
        assertEquals(TileState.FALLING, g.grid[0][1].state)
        g.run(1)
        assertEquals(TileState.LANDING, g.grid[0][1].state)
        assertEquals(1, g.grid[0][1].kind)
        assertEquals(1, g.count(EventType.LAND))
        g.run(Game.LAND_FRAMES)
        assertEquals(TileState.NORMAL, g.grid[0][1].state)
        assertFalse(g.active)
    }

    @Test
    fun `pulling a tile out from under a column drops the whole column together`() {
        val g = still(
            "3.....",
            "2.....",
            "1.....",
            "4.4...", // the 4 at the left is pulled out to the right... into the gap
        )
        // Swap bottom-left 4 with the gap beside it: the column above loses its footing.
        assertTrue(g.trySwap(0, 0))
        g.run(Game.SWAP_FRAMES)
        for (r in 1..3) assertEquals("row $r", TileState.HOVERING, g.grid[r][0].state)
        g.runUntil { !it.active }
        assertEquals(
            listOf("......", "3.....", "2.....", "144..."),
            g.boardString().lines().takeLast(4),
        )
    }

    @Test
    fun `a hanging tile cannot be swapped, and a tile slid underneath catches it`() {
        val g = still(
            ".1....",
            "......",
            "2.3...",
        )
        // The 1 is floating two rows up (set that way on purpose): it starts to hang at once.
        g.run(1)
        assertEquals(TileState.HOVERING, g.grid[2][1].state)
        assertFalse(g.trySwap(2, 0))
        assertFalse(g.trySwap(2, 1))
        // Slide the 2 under it. It will land on the 2 instead of the floor.
        assertTrue(g.trySwap(0, 0))
        g.runUntil { !it.active }
        assertEquals(listOf("......", ".1....", ".23..."), g.boardString().lines().takeLast(3))
    }

    @Test
    fun `nothing can be slid in right under a hanging tile`() {
        val g = still(
            ".1....",
            "2.3...",
        )
        // The 1 has nothing under it and starts to hang.
        g.run(1)
        assertEquals(TileState.HOVERING, g.grid[1][1].state)
        // Neither neighbour can be pushed into the cell beneath it...
        assertFalse(g.trySwap(0, 0))
        assertFalse(g.trySwap(0, 1))
        // ...until it has dropped.
        g.runUntil { !it.active }
        assertEquals("213...", g.boardString().lines().last())
        assertTrue(g.trySwap(0, 0))
    }

    @Test
    fun `a tile cannot be juggled between two columns to hold them up`() {
        val g = still(
            "2.4...",
            "3.5...",
            "1.2...",
        )
        // Slide the bottom-left 1 into the gap: the column that stood on it starts to hang.
        assertTrue(g.trySwap(0, 0))
        g.run(Game.SWAP_FRAMES)
        assertEquals(TileState.HOVERING, g.grid[1][0].state)
        // It cannot be slid straight back underneath to catch that column.
        assertFalse(g.trySwap(0, 0))
        g.runUntil { !it.active }
        assertEquals(listOf("..4...", "2.5...", "312..."), g.boardString().lines().takeLast(3))
    }

    // ------------------------------------------------------------ matching

    @Test
    fun `three in a row match, flash, pop one by one and vanish together`() {
        val g = still("1121..")
        assertTrue(g.trySwap(0, 2))
        g.run(Game.SWAP_FRAMES)
        for (c in 0..2) assertEquals(TileState.MATCHED, g.grid[0][c].state)
        assertEquals(TileState.NORMAL, g.grid[0][3].state)
        assertEquals(1, g.count(EventType.MATCH))
        assertTrue(g.clearing)

        // Flash, then the first pops after one pop interval, the second after two...
        g.run(flash + normal.popFrames - 1)
        assertEquals(0, g.count(EventType.POP))
        g.run(1)
        assertEquals(1, g.count(EventType.POP))
        assertEquals(TileState.POPPED, g.grid[0][0].state)
        assertEquals(10, g.score)
        g.run(normal.popFrames)
        assertEquals(2, g.count(EventType.POP))
        // ...and nothing leaves the board until the last one has popped.
        g.run(normal.popFrames - 1)
        assertEquals("1112..", g.boardString().lines().last())
        g.run(1)
        assertEquals("...2..", g.boardString().lines().last())
        assertEquals(3, g.count(EventType.POP))
        assertEquals(30, g.score)
        assertEquals(3, g.tilesCleared)
        assertFalse(g.active)
        // left to right
        assertEquals(listOf(0, 1, 2), g.events.filter { it.type == EventType.POP }.map { it.col })
    }

    @Test
    fun `three in a column match`() {
        val g = still(
            "1.....",
            "1.....",
            "21....",
        )
        assertTrue(g.trySwap(0, 0))
        g.run(Game.SWAP_FRAMES)
        for (r in 0..2) assertEquals(TileState.MATCHED, g.grid[r][0].state)
        // top tile pops first
        g.runUntil { !it.active }
        assertEquals(listOf(2, 1, 0), g.events.filter { it.type == EventType.POP }.map { it.row })
        assertEquals(".2....", g.boardString().lines().last())
    }

    @Test
    fun `two tiles in a line are not a match`() {
        val g = still("12.1..")
        assertTrue(g.trySwap(0, 1)) // 1 . 2 1
        g.runUntil { !it.active }
        assertEquals(0, g.count(EventType.MATCH))
        assertEquals(0, g.score)
    }

    @Test
    fun `four at once is a combo and scores a bonus`() {
        val g = still(
            "1.....",
            "1.....",
            "2.....",
            "1.....",
            "13....",
        )
        // Slide the 2 out of the column: the two 1s above drop onto the two 1s below.
        assertTrue(g.trySwap(2, 0))
        g.runUntil { !it.active }
        val m = g.events.single { it.type == EventType.MATCH }
        assertEquals(4, m.a)
        assertEquals(1, m.b)
        assertEquals(20, Scoring.comboBonus(4))
        assertEquals(4 * Scoring.PER_TILE + Scoring.comboBonus(4), g.score)
        assertEquals(listOf(".2....", ".3...."), g.boardString().lines().takeLast(2))
    }

    @Test
    fun `a cross of five counts as one combo of five`() {
        // Two 1s hang over the gap in the middle of "1.1". When they drop in, the row of three
        // and the column of three share a tile: five tiles, one combo.
        val g = still(
            ".1....",
            ".1....",
            "1.1...",
            "2123..",
        )
        g.runUntil { it.count(EventType.MATCH) > 0 }
        val m = g.events.single { it.type == EventType.MATCH }
        assertEquals(5, m.a)
        assertEquals(1, m.b)
        g.runUntil { !it.active }
        assertEquals(5 * Scoring.PER_TILE + Scoring.comboBonus(5), g.score)
        assertEquals(5, g.maxCombo)
        assertEquals(1, g.maxChain)
        assertEquals("2.23..", g.boardString().lines().last())
    }

    @Test
    fun `two separate matches in the same frame are one combo`() {
        val g = still("112122")
        // One swap finishes three 1s on the left and three 2s on the right.
        assertTrue(g.trySwap(0, 2))
        g.run(Game.SWAP_FRAMES)
        val m = g.events.single { it.type == EventType.MATCH }
        assertEquals(6, m.a)
        g.runUntil { !it.active }
        assertEquals(6 * Scoring.PER_TILE + Scoring.comboBonus(6), g.score)
        assertEquals(6, g.count(EventType.POP))
        assertEquals("......", g.boardString().lines().last())
    }

    @Test
    fun `tiles being swapped do not match until the slide ends`() {
        val g = still("1211..")
        assertTrue(g.trySwap(0, 0)) // 2 1 1 1 once it lands
        g.run(Game.SWAP_FRAMES - 1)
        assertEquals(0, g.count(EventType.MATCH))
        g.run(1)
        assertEquals(1, g.count(EventType.MATCH))
    }

    @Test
    fun `flashing tiles cannot be swapped and hold up what sits on them`() {
        val g = still(
            "3.....",
            "1121..",
        )
        assertTrue(g.trySwap(0, 2))
        g.run(Game.SWAP_FRAMES)
        assertFalse(g.trySwap(0, 0))
        assertFalse(g.trySwap(0, 2))
        g.run(20)
        assertEquals(TileState.NORMAL, g.grid[1][0].state)
        assertEquals(3, g.grid[1][0].kind)
        g.runUntil { !it.active }
        assertEquals("3..2..", g.boardString().lines().last())
    }

    // ------------------------------------------------------------ chains

    @Test
    fun `tiles that fall into a match after a clear make a chain`() {
        val g = still(
            ".33...",
            "1131..",
        )
        assertTrue(g.trySwap(0, 2)) // 1 1 1 3, with 3 3 resting on top of the 1s
        g.run(Game.SWAP_FRAMES)
        assertEquals(1, g.chain)
        g.runUntil { it.count(EventType.MATCH) == 2 }
        val second = g.events.last { it.type == EventType.MATCH }
        assertEquals(3, second.a)
        assertEquals(2, second.b)
        assertEquals(2, g.chain)
        g.runUntil { !it.active }
        assertEquals(1, g.chain)
        assertEquals(2, g.maxChain)
        val end = g.events.single { it.type == EventType.CHAIN_END }
        assertEquals(2, end.a)
        assertEquals(6 * Scoring.PER_TILE + Scoring.chainBonus(2), g.score)
        assertEquals("......\n......", g.boardString().lines().takeLast(2).joinToString("\n"))
        // the pops of the second match are labelled as chain step 2
        assertEquals(listOf(1, 1, 1, 2, 2, 2), g.events.filter { it.type == EventType.POP }.map { it.b })
    }

    @Test
    fun `a three step chain counts up to three`() {
        val g = still(
            "3.....",
            "2.....",
            "2.....",
            "1151..",
            "2334..",
        )
        // Step 1: the swap lines up three 1s. Step 2: the 2s above drop onto the 2 below them.
        // Step 3: the 3 that sat on top of those lands beside the two 3s in the bottom row.
        assertTrue(g.trySwap(1, 2))
        g.runUntil(4000) { !it.active }
        assertEquals(listOf(1, 2, 3), g.events.filter { it.type == EventType.MATCH }.map { it.b })
        assertEquals(3, g.maxChain)
        assertEquals(1, g.chain)
        assertEquals(3, g.events.single { it.type == EventType.CHAIN_END }.a)
        assertEquals(9 * Scoring.PER_TILE + Scoring.chainBonus(2) + Scoring.chainBonus(3), g.score)
        assertEquals(listOf("...5..", "...4.."), g.boardString().lines().takeLast(2))
    }

    @Test
    fun `a tile that falls without matching does not start a chain`() {
        val g = still(
            "4.....",
            "1121..",
        )
        assertTrue(g.trySwap(0, 2))
        g.runUntil { it.count(EventType.MATCH) == 1 }
        g.runUntil { !it.active }
        assertEquals(1, g.maxChain)
        assertEquals(0, g.count(EventType.CHAIN_END))
        assertFalse(g.grid[0][0].chaining)
        assertEquals("4..2..", g.boardString().lines().last())
    }

    @Test
    fun `a match made by hand while tiles fall is not a chain step`() {
        val g = still(
            "5.....",
            "1121..",
            "354344",
        )
        assertTrue(g.trySwap(1, 2))
        // The 1s have gone and the 5 that sat on them is about to drop: it carries the chain mark.
        g.runUntil { it.grid[2][0].state == TileState.HOVERING }
        assertTrue(g.grid[2][0].chaining)
        // Meanwhile, line up three 4s in the bottom row by hand. None of them fell, so this is no chain.
        assertTrue(g.trySwap(0, 2))
        g.runUntil { it.count(EventType.MATCH) == 2 }
        assertEquals(1, g.events.last { it.type == EventType.MATCH }.b)
        assertEquals(1, g.chain)
        g.runUntil { !it.active }
        assertEquals(1, g.maxChain)
        assertEquals(0, g.count(EventType.CHAIN_END))
        assertEquals(6 * Scoring.PER_TILE, g.score)
    }

    @Test
    fun `lining tiles up while a group flashes makes a chain when the tiles above land`() {
        val g = still(
            "..2...",
            ".14...",
            ".51...",
            ".21.2.",
            "34343.",
        )
        // The swap stacks three 1s in column 2, with a 2 resting on top of them.
        assertTrue(g.trySwap(3, 1))
        g.run(Game.SWAP_FRAMES)
        assertEquals(1, g.count(EventType.MATCH))
        // While they flash, slide the right-hand 2 next to where that 2 will land.
        assertTrue(g.trySwap(1, 3))
        g.runUntil { !it.active }
        val second = g.events.last { it.type == EventType.MATCH }
        assertEquals(3, second.a)
        assertEquals(2, second.b)
        assertEquals(2, g.maxChain)
        assertEquals(1, g.count(EventType.CHAIN_END))
        assertEquals(6 * Scoring.PER_TILE + Scoring.chainBonus(2), g.score)
    }

    @Test
    fun `a tile still sliding onto a popping group when it goes gets no chain credit`() {
        fun board() = still(
            ".2....",
            "41....",
            "13....",
            "122...",
        )
        // How long from the swap that stacks the three 1s until they are gone.
        val probe = board()
        assertTrue(probe.trySwap(2, 0))
        val gone = probe.runUntil { it.grid[0][0].kind == 0 }

        for (early in -2..8) {
            val g = board()
            assertTrue(g.trySwap(2, 0))
            g.run(gone - early)
            // slide the top 2 across onto the column, `early` frames before the 1s under it go
            g.trySwap(3, 0)
            g.runUntil { !it.active }
            // either way the 2 comes down beside the pair of 2s and they clear, leaving what stood on them
            assertEquals(listOf(".4....", ".3...."), g.boardString().lines().takeLast(2))
            val steps = g.events.filter { it.type == EventType.MATCH }.map { it.b }
            // It had to have come to rest on the group (a four-frame slide, finished) to fall as part of a chain.
            val rested = early > Game.SWAP_FRAMES
            assertEquals("slide started $early frames before the group went", if (rested) listOf(1, 2) else listOf(1, 1), steps)
        }
    }

    @Test
    fun `a landed tile keeps its chain mark only while the cell right under it is mid-slide`() {
        fun board() = still(
            "2.....",
            "1151..",
            "2345..",
            "5234..",
            "4345..",
        )
        for (early in 0..6) {
            val g = board()
            assertTrue(g.trySwap(3, 2)) // three 1s, with a 2 resting on the left-hand one
            g.runUntil { it.grid[4][0].state == TileState.HOVERING }
            // The 2 will land on the 2 below it one frame after its hover runs out.
            val landing = normal.hoverFrames + 1
            // Two rows further down, slide another 2 into the column, `early` frames before that landing.
            g.run(landing - early - 1)
            assertTrue(g.trySwap(1, 0))
            g.runUntil { !it.active }
            val steps = g.events.filter { it.type == EventType.MATCH }.map { it.b }
            // In place by the time the 2 lands: a chain. Still sliding, two cells below it: the mark is gone
            // by the time the three 2s line up.
            val inPlace = early >= Game.SWAP_FRAMES - 1
            assertEquals("slide started $early frames before the landing", if (inPlace) listOf(1, 2) else listOf(1, 1), steps)
        }
    }

    @Test
    fun `a tile slid in under a falling one, even at the last moment, completes the chain`() {
        fun board() = still(
            "2.....",
            "1151..",
            "3245..",
            "2434..",
            "4343..",
        )
        for (early in 0..6) {
            val g = board()
            assertTrue(g.trySwap(3, 2)) // three 1s, with a 2 resting on the left-hand one
            g.runUntil { it.grid[4][0].state == TileState.HOVERING }
            val landing = normal.hoverFrames + 1
            // Right where that 2 will land there is a 3. Trade it for the 2 beside it, `early` frames before
            // the landing: for the last few of those the slide is still going as the tile touches down.
            g.run(landing - early - 1)
            assertTrue("slide started $early frames before the landing", g.trySwap(2, 0))
            g.runUntil { !it.active }
            assertEquals("slide started $early frames before the landing",
                listOf(1, 2), g.events.filter { it.type == EventType.MATCH }.map { it.b })
        }
        // Once the tile has landed and sat still, the same trade is an ordinary match.
        val late = board()
        assertTrue(late.trySwap(3, 2))
        late.runUntil { it.grid[3][0].kind == 2 && it.grid[3][0].state == TileState.LANDING }
        late.run(1)
        assertTrue(late.trySwap(2, 0))
        late.runUntil { !it.active }
        assertEquals(listOf(1, 1), late.events.filter { it.type == EventType.MATCH }.map { it.b })
    }

    @Test
    fun `two tiles standing one on the other cannot be slid into a gap together`() {
        for (gap in 0..6) {
            // the lower one first, then the upper one after it
            val g = still(
                "2.....",
                "1.....",
            )
            assertTrue(g.trySwap(0, 0))
            g.run(gap)
            assertFalse("upper tile, $gap frames after the lower", g.trySwap(1, 0))
            g.runUntil { !it.active }
            // the 1 moved; the 2 lost its footing and dropped straight down
            assertEquals(listOf("......", "21...."), g.boardString().lines().takeLast(2))

            // the upper one first, then the lower one under it
            val h = still(
                "2.....",
                "1.....",
            )
            assertTrue(h.trySwap(1, 0))
            h.run(gap)
            assertFalse("lower tile, $gap frames after the upper", h.trySwap(0, 0))
            h.runUntil { !it.active }
            assertEquals(listOf("......", "12...."), h.boardString().lines().takeLast(2))
            assertTrue(h.trySwap(0, 0))
        }
    }

    @Test
    fun `tiles that do not stand on each other can still be slid at the same time`() {
        // two tiles on the same row, each into its own gap
        val g = still("12.4..")
        assertTrue(g.trySwap(0, 1))
        assertTrue(g.trySwap(0, 3))
        g.runUntil { !it.active }
        assertEquals("1.2.4.", g.boardString().lines().last())

        // a tile slid out from under two others that are trading places with each other
        val h = still(
            "34....",
            "12....",
        )
        assertTrue(h.trySwap(0, 1)) // the 2 slides right into the gap
        assertTrue(h.trySwap(1, 0)) // the 3 and 4 above trade places: neither is moving into a gap
        h.runUntil { !it.active }
        // the 3 ended up over the hole and dropped into it
        assertEquals(listOf("4.....", "132..."), h.boardString().lines().takeLast(2))
    }

    // ------------------------------------------------------------ rising

    @Test
    fun `the stack rises one row in the time its speed level says`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.setBoard("123123")
        val frames = Speed.framesPerRow[1]
        g.run(frames - 10)
        assertEquals(0, g.rowsRisen)
        assertTrue(g.riseFraction > 0.9f)
        g.run(10)
        assertEquals(1, g.rowsRisen)
        assertEquals("123123", g.boardString().lines()[Game.ROWS - 2])
        assertEquals(1, g.count(EventType.ROW))
        assertEquals(0, g.score)
    }

    @Test
    fun `higher levels rise faster`() {
        for (level in 2..Speed.MAX_LEVEL) {
            assertTrue(Speed.framesPerRow[level] <= Speed.framesPerRow[level - 1])
        }
        assertEquals(900, Speed.framesPerRow[1])
        assertEquals(45, Speed.framesPerRow[Speed.MAX_LEVEL])
        val g = Game.infinite(normal, 30, 3L)
        g.skipCountdown()
        g.setBoard("123123")
        g.run(Speed.framesPerRow[30] + 2)
        assertEquals(1, g.rowsRisen)
    }

    @Test
    fun `the stack waits while tiles hang, fall or pop`() {
        val g = Game.infinite(normal, 30, 3L)
        g.skipCountdown()
        g.setBoard("1121..")
        assertTrue(g.trySwap(0, 2))
        g.run(Game.SWAP_FRAMES)
        assertTrue(g.settling)
        // nothing more comes up for as long as the match is flashing and popping
        val offset = g.riseOffset
        g.run(flash + 3 * normal.popFrames - 1)
        assertTrue(g.settling)
        assertEquals(offset, g.riseOffset)
        assertEquals(0, g.rowsRisen)

        // the same while a tile hangs and drops
        val h = Game.infinite(normal, 30, 3L)
        h.skipCountdown()
        h.setBoard(
            "3.....",
            "1.2...",
        )
        assertTrue(h.trySwap(1, 0)) // the 3 is pushed off its perch, into the gap beside it
        h.run(Game.SWAP_FRAMES)
        assertEquals(TileState.HOVERING, h.grid[1][1].state)
        val before = h.riseOffset
        h.runUntil { !it.settling }
        assertEquals(before, h.riseOffset)
        h.run(3)
        assertTrue(h.riseOffset > before)
    }

    @Test
    fun `sliding tiles about does not hold the stack back`() {
        // Five different tiles and a gap: nothing here can ever match, however they are shuffled.
        fun play(rub: Boolean): Int {
            val g = Game.infinite(normal, Speed.MAX_LEVEL, 3L)
            g.skipCountdown()
            g.setBoard("12345.")
            if (rub) assertTrue(g.grab(0, 0))
            var n = 0
            while (g.phase == Phase.PLAYING) {
                // a finger rubbed from one side of the well to the other and back, over and over
                if (rub) {
                    if (g.grabbedId == 0) g.grab(g.stackHeight() - 1, g.boardString().lines()[Game.ROWS - g.stackHeight()].indexOf('1'))
                    g.dragTo(if ((n / 20) % 2 == 0) Game.COLS - 1 else 0)
                }
                g.tick()
                Checks.assertConsistent(g)
                assertEquals("no match is possible on this board", 0, g.count(EventType.MATCH))
                assertTrue("still going after $n frames", ++n < 5000)
            }
            if (rub) assertTrue("the tile really was kept moving", g.count(EventType.SWAP) > 100)
            return g.frames
        }
        val handsOff = play(rub = false)
        // eleven rows to the top at 45 frames a row, then the grace period
        assertEquals(11 * Speed.framesPerRow[Speed.MAX_LEVEL] + normal.graceFrames, handsOff)
        assertEquals("rubbing a tile to and fro must not buy any time", handsOff, play(rub = true))
    }

    @Test
    fun `a combo of four pauses the rise for a while afterwards`() {
        val g = Game.infinite(normal, 30, 3L)
        g.skipCountdown()
        g.setBoard(
            "1.....",
            "1.....",
            "2.....",
            "1.....",
            "12....",
        )
        // Column 0 from the bottom: 1 1 2 1 1. Slide the 2 out: the two 1s above drop onto the two below: four in a column.
        assertTrue(g.trySwap(2, 0))
        g.runUntil { it.count(EventType.MATCH) == 1 }
        assertEquals(4, g.events.first { it.type == EventType.MATCH }.a)
        assertTrue(g.stopFrames > 0)
        val stop = g.stopFrames
        g.runUntil { !it.active }
        // The pause only starts to run down once the pops are over.
        assertTrue(g.stopFrames >= stop - 1)
        val offset = g.riseOffset
        g.run(stop - 2)
        assertEquals(offset, g.riseOffset)
        g.run(5)
        assertTrue(g.riseOffset > offset)
    }

    @Test
    fun `a tap on raise brings up exactly one row and scores a point`() {
        val g = still("123123")
        g.raiseHeld = true
        g.run(1)
        g.raiseHeld = false
        g.run(Game.MANUAL_FRAMES_PER_ROW - 2)
        assertEquals(0, g.rowsRisen)
        g.run(1)
        assertEquals(1, g.rowsRisen)
        assertEquals(1, g.score)
        assertEquals(0, g.riseOffset)
        g.run(60)
        assertEquals(1, g.rowsRisen)
        assertEquals(1, g.events.single { it.type == EventType.ROW }.a)
    }

    @Test
    fun `holding raise keeps the rows coming`() {
        val g = still("123123")
        g.raiseHeld = true
        g.run(Game.MANUAL_FRAMES_PER_ROW * 4)
        assertEquals(4, g.rowsRisen)
        assertEquals(4, g.score)
        g.raiseHeld = false
        g.run(Game.MANUAL_FRAMES_PER_ROW + 5)
        assertTrue(g.rowsRisen <= 5)
    }

    @Test
    fun `raising by hand cancels an earned pause`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.setBoard(
            "1.....",
            "1.....",
            "2.....",
            "1.....",
            "12....",
        )
        assertTrue(g.trySwap(2, 0))
        g.runUntil { it.count(EventType.MATCH) == 1 }
        g.runUntil { !it.active }
        assertTrue(g.stopFrames > 0)
        g.raiseHeld = true
        g.run(1)
        assertEquals(0, g.stopFrames)
    }

    @Test
    fun `raise does nothing while tiles are popping`() {
        val g = still("1121..")
        assertTrue(g.trySwap(0, 2))
        g.run(Game.SWAP_FRAMES)
        g.raiseHeld = true
        g.run(30)
        assertEquals(0, g.riseOffset)
        assertEquals(0, g.rowsRisen)
        g.runUntil { !it.active }
        g.run(Game.MANUAL_FRAMES_PER_ROW)
        assertEquals(1, g.rowsRisen)
    }

    // ------------------------------------------------------------ the top of the well

    private fun tallColumn(rows: Int): Array<String> = Array(rows) { i -> if (i % 2 == 0) "1....." else "2....." }

    @Test
    fun `the game ends when the stack stays against the top for the whole grace period`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.setBoard(*tallColumn(Game.ROWS))
        assertTrue(g.topOccupied)
        g.run(normal.graceFrames - 1)
        assertEquals(Phase.PLAYING, g.phase)
        assertEquals(1, g.grace)
        g.run(1)
        assertEquals(Phase.GAME_OVER, g.phase)
        assertEquals(1, g.count(EventType.GAME_OVER))
        // and then nothing more happens
        val frames = g.frames
        g.tick()
        assertEquals(frames, g.frames)
        assertFalse(g.trySwap(0, 0))
    }

    @Test
    fun `clearing the top row gives the grace period back`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.setBoard(*tallColumn(Game.ROWS))
        g.run(normal.graceFrames - 20)
        assertEquals(20, g.grace)
        // Knock the top tile off the column: it falls beside it.
        assertTrue(g.trySwap(Game.ROWS - 1, 0))
        g.runUntil { !it.topOccupied && !it.active }
        g.run(1)
        assertEquals(normal.graceFrames, g.grace)
        assertEquals(Phase.PLAYING, g.phase)
    }

    @Test
    fun `the countdown at the top waits for falling tiles but not for sliding ones`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        // A column up to the top; at the bottom right, a tile on a perch and a loose tile to push around.
        g.setBoard(*tallColumn(Game.ROWS).also {
            it[Game.ROWS - 2] = "1..4.."
            it[Game.ROWS - 1] = "2..3.5"
        })
        g.run(10)
        assertEquals(normal.graceFrames - 10, g.grace)

        // sliding the loose tile: the countdown runs straight on
        assertTrue(g.trySwap(0, 4))
        g.run(Game.SWAP_FRAMES)
        assertEquals(normal.graceFrames - 10 - Game.SWAP_FRAMES, g.grace)

        // knocking the 4 off its perch: it runs during the slide, then waits while the tile hangs and drops
        assertTrue(g.trySwap(1, 2))
        g.run(Game.SWAP_FRAMES)
        val grace = g.grace
        assertEquals(normal.graceFrames - 10 - 2 * Game.SWAP_FRAMES, grace)
        assertTrue(g.settling)
        g.runUntil { !it.settling }
        assertEquals(grace, g.grace)
        g.run(1)
        assertEquals(grace - 1, g.grace)
    }

    @Test
    fun `raise cannot push the stack through the top`() {
        val g = still(*tallColumn(Game.ROWS - 1))
        g.raiseHeld = true
        g.run(Game.MANUAL_FRAMES_PER_ROW)
        assertEquals(1, g.rowsRisen)
        assertTrue(g.topOccupied)
        g.run(200)
        assertEquals(1, g.rowsRisen)
        assertEquals(0, g.riseOffset)
        assertEquals(Phase.PLAYING, g.phase)
    }

    @Test
    fun `holding raise at the top does not hold off the end`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.setBoard(*tallColumn(Game.ROWS))
        g.raiseHeld = true
        g.run(normal.graceFrames)
        assertEquals(Phase.GAME_OVER, g.phase)
    }

    // ------------------------------------------------------------ speeding up

    @Test
    fun `Infinite mode speeds up as tiles are cleared`() {
        val g = Game.infinite(normal, 1, 3L)
        g.skipCountdown()
        g.autoRise = false
        var cleared = 0
        while (g.level == 1) {
            g.setBoard("1121..")
            assertTrue(g.trySwap(0, 2))
            g.runUntil { !it.active }
            cleared += 3
            assertTrue(cleared < 100)
        }
        assertEquals(2, g.level)
        assertTrue(cleared >= Speed.tilesToNextLevel(1))
        assertEquals(1, g.count(EventType.LEVEL_UP))
    }

    @Test
    fun `Stage Clear keeps its speed`() {
        val g = Game.stage(Stages.get(3), 3L)
        g.skipCountdown()
        g.autoRise = false
        val level = g.level
        repeat(30) {
            g.setBoard("1121..")
            assertTrue(g.trySwap(0, 2))
            g.runUntil { !it.active || it.phase != Phase.PLAYING }
        }
        assertEquals(level, g.level)
        assertEquals(0, g.count(EventType.LEVEL_UP))
    }

    // ------------------------------------------------------------ Stage Clear

    @Test
    fun `the clear line comes up after the stage's rows have risen`() {
        val def = Stages.get(1)
        val g = Game.stage(def, 5L)
        g.skipCountdown()
        g.autoRise = false
        g.setBoard("12....")
        assertEquals(def.lines, g.linesToGo)
        g.raiseHeld = true
        g.runUntil { it.rowsRisen == def.lines - 1 }
        assertEquals(1, g.linesToGo)
        assertEquals(0, g.count(EventType.LINE_SHOWN))
        g.runUntil { it.rowsRisen == def.lines }
        assertEquals(0, g.lineRow)
        assertEquals(0, g.linesToGo)
        assertEquals(1, g.count(EventType.LINE_SHOWN))
        assertEquals(Phase.PLAYING, g.phase)
    }

    @Test
    fun `a stage is cleared when nothing is left above the line`() {
        val def = Stages.get(1)
        val g = Game.stage(def, 5L)
        g.skipCountdown()
        g.autoRise = false
        g.setBoard("12....")
        g.raiseHeld = true
        g.runUntil { it.rowsRisen == def.lines + 2 }
        g.raiseHeld = false
        assertEquals(2, g.lineRow)
        assertEquals(Phase.PLAYING, g.phase)

        // Two full rows under the line and one tile still above it: not yet.
        g.setBoard(
            "3.....",
            "121212",
            "212121",
        )
        g.run(5)
        assertEquals(Phase.PLAYING, g.phase)

        // The same without that tile: cleared.
        g.setBoard(
            "121212",
            "212121",
        )
        g.run(1)
        assertEquals(Phase.STAGE_CLEAR, g.phase)
        assertEquals(1, g.count(EventType.STAGE_CLEAR))
        assertFalse(g.trySwap(0, 0))
    }

    @Test
    fun `a stage waits for pops still going on under the line before it is declared clear`() {
        val def = Stages.get(1)
        val g = Game.stage(def, 5L)
        g.skipCountdown()
        g.autoRise = false
        g.setBoard("12....")
        g.raiseHeld = true
        g.runUntil { it.rowsRisen == def.lines + 2 }
        g.raiseHeld = false
        assertEquals(2, g.lineRow)
        g.setBoard(
            "11.1..", // above the line
            "232323",
            "554533",
        )
        g.events.clear()
        val before = g.score
        assertTrue(g.trySwap(2, 2)) // three 1s above the line
        g.run(40)
        assertTrue(g.trySwap(0, 2)) // then, while they flash, three 5s below it
        // the 1s go first: nothing is left above the line, but the 5s are still popping
        g.runUntil { it.grid[2][0].kind == 0 }
        assertEquals(Phase.PLAYING, g.phase)
        assertTrue(g.clearing)
        g.runUntil { it.phase != Phase.PLAYING }
        assertEquals(Phase.STAGE_CLEAR, g.phase)
        // every tile that matched has popped and scored, and nothing is left hanging
        assertEquals(6, g.count(EventType.POP))
        assertEquals(6 * Scoring.PER_TILE, g.score - before)
        assertFalse(g.settling)
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) assertFalse(g.grid[r][c].isClearing)
        // the three tiles that stood on the 5s have dropped into their places
        assertEquals("232433", g.boardString().lines().last())
    }

    @Test
    fun `stages get faster and longer`() {
        var last = Stages.get(1)
        assertEquals(5, last.kinds)
        for (n in 2..Stages.COUNT) {
            val s = Stages.get(n)
            assertEquals(n, s.number)
            assertTrue(s.speedLevel >= last.speedLevel)
            assertTrue(s.lines >= last.lines)
            assertTrue(s.kinds >= last.kinds)
            last = s
        }
        assertEquals(6, last.kinds)
        assertTrue(last.speedLevel <= Speed.MAX_LEVEL)
    }

    // ------------------------------------------------------------ the player's hand

    @Test
    fun `a held tile follows the finger one cell at a time`() {
        val g = still("12345.")
        assertTrue(g.grab(0, 0))
        val id = g.grabbedId
        g.dragTo(3)
        g.run(1)
        assertEquals(1, g.locate(id))
        g.run(Game.SWAP_FRAMES - 1)
        assertEquals(1, g.locate(id))
        g.run(1)
        assertEquals(2, g.locate(id))
        g.runUntil { !it.active }
        assertEquals(3, g.locate(id))
        assertEquals("23415.", g.boardString().lines().last())
        assertEquals(id, g.grabbedId)
        g.release()
        assertEquals(0, g.grabbedId)
    }

    @Test
    fun `gaps cannot be picked up`() {
        val g = still("1.....")
        assertFalse(g.grab(0, 1))
        assertFalse(g.grab(5, 0))
        assertFalse(g.grab(-1, 0))
        assertEquals(0, g.grabbedId)
    }

    @Test
    fun `a held tile that drops is let go`() {
        val g = still(
            "1.....",
            "2.....",
        )
        assertTrue(g.grab(1, 0))
        g.dragTo(5)
        g.run(1)
        assertTrue(g.active)
        g.runUntil { !it.active }
        // It slid one cell, fell, and was let go: it did not carry on to the far side.
        assertEquals(0, g.grabbedId)
        assertEquals("21....", g.boardString().lines().last())
    }

    @Test
    fun `a held tile that gets matched is let go`() {
        val g = still("1211..")
        assertTrue(g.grab(0, 0))
        g.dragTo(1)
        g.run(Game.SWAP_FRAMES + 2)
        assertEquals(1, g.count(EventType.MATCH))
        assertEquals(0, g.grabbedId)
    }
}
