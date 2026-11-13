package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Bot
import com.personal.tilesurge.core.Checks
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Phase
import com.personal.tilesurge.core.TileState
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/** The game played through its real view with simulated fingers: sliding tiles, holding raise, and the panels. */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class TouchPlayTest {

    private val w = 720
    private val h = 1560

    private fun play(setup: Setup, seed: Long): Pair<GameView, PlayScene> {
        val v = Shots.view(w, h) { PlayScene(it, setup, seed) }
        return v to (v.scene as PlayScene)
    }

    /** A game past its countdown, with the stack held still and a board of the test's choosing. */
    private fun still(vararg rows: String): Pair<GameView, PlayScene> {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 1), 4L)
        v.step(Game.COUNTDOWN_FRAMES)
        scene.game.autoRise = false
        scene.game.setBoard(*rows)
        scene.game.events.clear()
        return v to scene
    }

    private fun PlayScene.x(col: Int) = board.cellLeft(col) + board.cell / 2f
    private fun PlayScene.y(row: Int) = board.cellTop(game, row) + board.cell / 2f
    private fun PlayScene.bottomRow() = game.boardString().lines().last()

    // ------------------------------------------------------------ sliding tiles

    @Test
    fun `sliding a finger one cell swaps two tiles`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        assertNotEquals(0, scene.game.grabbedId)
        f.move(0, scene.x(1), scene.y(0))
        v.step(Game.SWAP_FRAMES + 1)
        assertEquals("21345.", scene.bottomRow())
        f.up(0)
        v.step(2)
        assertEquals(0, scene.game.grabbedId)
        assertEquals("21345.", scene.bottomRow())
    }

    @Test
    fun `a tile follows the finger across several cells and stops where the finger stops`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        f.move(0, scene.x(3), scene.y(0))
        v.step(40)
        assertEquals("23415.", scene.bottomRow())
        // back again, without lifting
        f.move(0, scene.x(1), scene.y(0))
        v.step(40)
        assertEquals("21345.", scene.bottomRow())
        f.up(0)
    }

    @Test
    fun `a quick flick still moves the tile`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        // down, across and up again before the game has run a single frame
        f.down(0, scene.x(1), scene.y(0))
        f.move(0, scene.x(2), scene.y(0))
        f.up(0)
        v.step(Game.SWAP_FRAMES + 2)
        assertEquals("13245.", scene.bottomRow())
        assertEquals(0, scene.game.grabbedId)
    }

    @Test
    fun `a tile dropped ahead of where it has got to finishes the trip`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        f.move(0, scene.x(4), scene.y(0))
        f.up(0)
        v.step(60)
        assertEquals("23451.", scene.bottomRow())
        assertEquals(0, scene.game.grabbedId)
    }

    @Test
    fun `a small wobble of the finger does not move the tile`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        f.down(0, scene.x(2), scene.y(0))
        // nearly to the edge of the cell, both ways, and up and down as well
        f.move(0, scene.x(2) + scene.board.cell * 0.45f, scene.y(0) - scene.board.cell * 2)
        v.step(6)
        f.move(0, scene.x(2) - scene.board.cell * 0.45f, scene.y(0) + scene.board.cell * 2)
        v.step(6)
        f.up(0)
        v.step(6)
        assertEquals("12345.", scene.bottomRow())
    }

    @Test
    fun `where the tile is touched makes no difference to how far the finger has to go`() {
        for (grip in floatArrayOf(-0.4f, 0f, 0.4f)) {
            val (v, scene) = still("12345.")
            val cell = scene.board.cell
            val f = Fingers(v)
            val start = scene.x(2) + cell * grip
            f.down(0, start, scene.y(0))
            f.move(0, start + cell * 0.5f, scene.y(0))
            v.step(8)
            assertEquals("half a cell is not enough (grip $grip)", "12345.", scene.bottomRow())
            f.move(0, start + cell * 0.62f, scene.y(0))
            v.step(8)
            assertEquals("a little more is (grip $grip)", "12435.", scene.bottomRow())
            // and the same the other way, back past where it started
            f.move(0, start - cell * 0.62f, scene.y(0))
            v.step(16)
            assertEquals("grip $grip", "13245.", scene.bottomRow())
            f.up(0)
        }
    }

    @Test
    fun `a tile that is popping is not mistaken for its neighbour`() {
        val (v, scene) = still(
            "2.....",
            "1121..",
        )
        val f = Fingers(v)
        f.down(0, scene.x(3), scene.y(0))
        f.move(0, scene.x(2), scene.y(0))
        v.step(Game.SWAP_FRAMES + 2)
        f.up(0)
        v.step(2)
        assertEquals(TileState.MATCHED, scene.game.grid[0][0].state)
        // touch the flashing tile near its top edge and near its side: nothing is picked up,
        // not the 2 resting on it and not the tile beside it
        f.down(0, scene.x(0), scene.y(0) - scene.board.cell * 0.4f)
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
        f.down(0, scene.x(2) + scene.board.cell * 0.4f, scene.y(0))
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
    }

    @Test
    fun `moving the finger up or down does nothing but hold the tile`() {
        val (v, scene) = still(
            "3.....",
            "12....",
        )
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        f.move(0, scene.x(0), scene.y(4))
        v.step(10)
        assertEquals("12....", scene.bottomRow())
        assertNotEquals(0, scene.game.grabbedId)
        f.up(0)
    }

    @Test
    fun `sliding a tile off a ledge drops it and lets go`() {
        val (v, scene) = still(
            "1.....",
            "2.....",
        )
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(1))
        f.move(0, scene.x(4), scene.y(1))
        v.step(60)
        // one cell across, then down: it does not sail on to where the finger is
        assertEquals("21....", scene.bottomRow())
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
    }

    @Test
    fun `sliding the third tile into line makes a match`() {
        val (v, scene) = still("1121..")
        val f = Fingers(v)
        f.down(0, scene.x(3), scene.y(0))
        f.move(0, scene.x(2), scene.y(0))
        v.step(Game.SWAP_FRAMES + 2)
        assertEquals(TileState.MATCHED, scene.game.grid[0][0].state)
        f.up(0)
        v.step(200)
        assertEquals("...2..", scene.bottomRow())
        assertEquals(30, scene.game.score)
    }

    @Test
    fun `a touch just above a tile, or beside it, still picks it up`() {
        val (v, scene) = still("..3...")
        val f = Fingers(v)
        val cell = scene.board.cell
        // in the empty cell above, near its bottom edge
        f.down(0, scene.x(2), scene.y(1) + cell * 0.3f)
        assertNotEquals(0, scene.game.grabbedId)
        f.up(0)
        v.step(2)
        // in the empty cell to the left, near the tile: it is held, and it stays where it is
        f.down(0, scene.x(1) + cell * 0.35f, scene.y(0))
        assertNotEquals(0, scene.game.grabbedId)
        v.step(10)
        assertEquals("..3...", scene.bottomRow())
        // from there, half a cell and a bit to the right is enough to move it one cell right
        f.move(0, scene.x(1) + cell * 0.95f, scene.y(0))
        v.step(10)
        assertEquals("...3..", scene.bottomRow())
        f.move(0, scene.x(1) + cell * 0.35f, scene.y(0))
        v.step(10)
        assertEquals("..3...", scene.bottomRow())
        f.up(0)
        v.step(2)
        // but the middle of an empty cell is just empty
        f.down(0, scene.x(4), scene.y(3))
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
    }

    @Test
    fun `tiles are picked up where they are drawn while the stack is part-way up a row`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        // hold raise for a few frames, so the stack sits a fraction of a row higher
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(6)
        assertTrue(scene.game.riseFraction > 0.3f)
        // a touch on the tile where it is drawn now picks that tile up
        f.down(0, scene.x(0), scene.y(0))
        assertEquals(scene.game.grid[0][0].id, scene.game.grabbedId)
        assertEquals(1, scene.game.grid[0][0].kind)
        f.up(0)
        v.step(1)
        // and a touch on the dark row still coming in picks up nothing
        f.down(0, scene.x(0), scene.y(-1))
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
        f.up(1)
    }

    @Test
    fun `a stray second touch on the well does not knock a held tile loose`() {
        val (v, scene) = still(
            "..4...",
            "12345.",
        )
        val cell = scene.board.cell
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        val id = scene.game.grabbedId
        assertNotEquals(0, id)
        // a palm on an empty part of the well
        f.down(1, scene.x(4), scene.y(6))
        assertEquals(id, scene.game.grabbedId)
        f.move(1, scene.x(1), scene.y(6))
        v.step(12)
        f.up(1)
        // a thumb that just misses RAISE and lands under the bottom row
        f.down(1, scene.x(3), scene.board.bottom + 5f * v.app.ui.unit)
        assertEquals(id, scene.game.grabbedId)
        f.up(1)
        // a touch in the gap just above a tile, which a first finger would be forgiven for
        f.down(1, scene.x(4), scene.y(1) + cell * 0.3f)
        assertEquals(id, scene.game.grabbedId)
        f.up(1)
        v.step(12)
        assertEquals("nothing has moved", "..4...\n12345.", scene.game.boardString().lines().takeLast(2).joinToString("\n"))
        // and the first finger still has its tile
        f.move(0, scene.x(1), scene.y(0))
        v.step(Game.SWAP_FRAMES + 1)
        assertEquals("21345.", scene.bottomRow())
        f.up(0)
    }

    @Test
    fun `a second finger put squarely on another tile takes over, so two thumbs can hand over`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        val one = scene.game.grid[0][0].id
        val five = scene.game.grid[0][4].id
        f.down(0, scene.x(0), scene.y(0))
        assertEquals(one, scene.game.grabbedId)
        // the other thumb lands on the 5 before the first has lifted
        f.down(1, scene.x(4), scene.y(0))
        assertEquals(five, scene.game.grabbedId)
        // the first thumb's late wobble and lift change nothing
        f.move(0, scene.x(2), scene.y(0))
        v.step(12)
        f.up(0)
        assertEquals(five, scene.game.grabbedId)
        assertEquals("12345.", scene.bottomRow())
        // the second thumb slides its tile
        f.move(1, scene.x(5), scene.y(0))
        v.step(Game.SWAP_FRAMES + 1)
        assertEquals("1234.5", scene.bottomRow())
        f.up(1)
        v.step(2)
        assertEquals(0, scene.game.grabbedId)
    }

    @Test
    fun `a touch on empty space leaves a travelling tile alone, and a touch on a tile takes over`() {
        val (v, scene) = still("12345.")
        val f = Fingers(v)
        // flick the 1 towards the far side and let go at once
        f.down(0, scene.x(0), scene.y(0))
        f.move(0, scene.x(4), scene.y(0))
        f.up(0)
        v.step(5)
        // a touch on nothing: the tile carries on
        f.down(0, scene.x(2), scene.y(5))
        f.up(0)
        v.step(40)
        assertEquals("23451.", scene.bottomRow())

        // the same flick again, but this time another tile is picked up while the first is on its way
        scene.game.setBoard("12345.")
        f.down(0, scene.x(0), scene.y(0))
        f.move(0, scene.x(4), scene.y(0))
        f.up(0)
        v.step(5)
        val travelling = scene.game.grabbedId
        f.down(0, scene.x(5), scene.y(0))
        assertEquals("an empty cell is not a tile", travelling, scene.game.grabbedId)
        f.up(0)
        f.down(0, scene.x(4), scene.y(0))
        assertNotEquals(travelling, scene.game.grabbedId)
        assertNotEquals(0, scene.game.grabbedId)
        f.up(0)
        v.step(40)
        // the 1 stopped where it had got to when the other tile was taken up
        assertEquals(0, scene.game.grabbedId)
        assertTrue(scene.bottomRow().indexOf('1') in 1..3)
    }

    @Test
    fun `a finger resting on a tile through READY picks it up at GO`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 1), 4L)
        val f = Fingers(v)
        v.step(10)
        val tile = scene.game.grid[0][2]
        f.down(0, scene.x(2), scene.y(0))
        assertEquals("nothing can be held during the countdown", 0, scene.game.grabbedId)
        // a second finger during the countdown changes nothing
        f.down(1, scene.x(4), scene.y(0))
        f.up(1)
        v.step(Game.COUNTDOWN_FRAMES - 10)
        assertEquals(Phase.PLAYING, scene.game.phase)
        assertEquals(tile.id, scene.game.grabbedId)
        f.move(0, scene.x(3), scene.y(0))
        v.step(Game.SWAP_FRAMES + 1)
        assertEquals(3, scene.game.locate(tile.id) % Game.COLS)
        f.up(0)
    }

    @Test
    fun `a finger that rests on nothing through READY is forgotten at GO`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 1), 4L)
        val f = Fingers(v)
        v.step(10)
        f.down(0, scene.x(2), scene.y(10))
        v.step(Game.COUNTDOWN_FRAMES)
        assertEquals(0, scene.game.grabbedId)
        // that finger is still down, yet another one can pick up a tile
        f.down(1, scene.x(1), scene.y(0))
        assertEquals(scene.game.grid[0][1].id, scene.game.grabbedId)
        f.up(1)
        f.up(0)
    }

    // ------------------------------------------------------------ the raise button

    @Test
    fun `holding the raise button brings rows up, and letting go stops`() {
        val (v, scene) = still("123123")
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(Game.MANUAL_FRAMES_PER_ROW * 3)
        assertEquals(3, scene.game.rowsRisen)
        f.up(1)
        v.step(Game.MANUAL_FRAMES_PER_ROW * 3)
        assertTrue(scene.game.rowsRisen <= 4)
        val rows = scene.game.rowsRisen
        v.step(120)
        assertEquals(rows, scene.game.rowsRisen)
    }

    @Test
    fun `a tap on raise brings one row`() {
        val (v, scene) = still("123123")
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(2)
        f.up(1)
        v.step(60)
        assertEquals(1, scene.game.rowsRisen)
    }

    @Test
    fun `one finger can slide a tile while another holds raise`() {
        val (v, scene) = still("123123")
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(Game.MANUAL_FRAMES_PER_ROW)
        assertEquals(1, scene.game.rowsRisen)
        // the original row is now row 1; slide its first tile right while still raising
        val id = scene.game.grid[1][0].id
        f.down(0, scene.x(0), scene.y(1))
        assertEquals(id, scene.game.grabbedId)
        f.move(0, scene.x(1), scene.y(1))
        v.step(Game.MANUAL_FRAMES_PER_ROW * 2)
        assertEquals(1, scene.game.locate(id) % Game.COLS)
        assertTrue(scene.game.rowsRisen >= 2)
        // lift the sliding finger first: raise must carry on
        f.up(0)
        val rows = scene.game.rowsRisen
        v.step(Game.MANUAL_FRAMES_PER_ROW * 2)
        assertTrue(scene.game.rowsRisen > rows)
        f.up(1)
    }

    @Test
    fun `sliding well off the raise button lets go of it`() {
        val (v, scene) = still("123123")
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(3)
        f.move(1, scene.raiseRect.centerX(), scene.raiseRect.top - 300f)
        v.step(Game.MANUAL_FRAMES_PER_ROW * 4)
        assertTrue(scene.game.rowsRisen <= 1)
        f.up(1)
    }

    // ------------------------------------------------------------ pausing

    @Test
    fun `pause stops the clock and resume carries on`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 20), 4L)
        v.step(Game.COUNTDOWN_FRAMES + 30)
        val frames = scene.game.frames
        Shots.tap(v, scene.pauseButton)
        assertTrue(scene.isPaused)
        v.step(200)
        assertEquals(frames, scene.game.frames)
        // touches on the board do nothing while paused
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        assertEquals(0, scene.game.grabbedId)
        f.up(0)
        Shots.tap(v, scene.resumeButton)
        assertFalse(scene.isPaused)
        v.step(10)
        assertEquals(frames + 10, scene.game.frames)
    }

    @Test
    fun `Back pauses, Back again resumes, and leaving the app pauses`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 20), 4L)
        v.step(Game.COUNTDOWN_FRAMES + 5)
        assertTrue(v.back())
        assertTrue(scene.isPaused)
        assertTrue(v.back())
        assertFalse(scene.isPaused)
        v.pause()
        assertTrue(scene.isPaused)
        v.interrupted()
        assertTrue(scene.isPaused)
    }

    @Test
    fun `pausing lets go of the tile and the raise button`() {
        val (v, scene) = still("123123")
        val f = Fingers(v)
        f.down(0, scene.x(0), scene.y(0))
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        v.step(3)
        scene.pause()
        assertEquals(0, scene.game.grabbedId)
        assertFalse(scene.game.raiseHeld)
        f.up(1)
        f.up(0)
        Shots.tap(v, scene.resumeButton)
        val rows = scene.game.rowsRisen
        v.step(Game.MANUAL_FRAMES_PER_ROW * 3)
        // one row at most: the one that was already on its way up
        assertTrue(scene.game.rowsRisen <= rows + 1)
    }

    @Test
    fun `restart from the pause panel starts a fresh game`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 20), 4L)
        v.step(Game.COUNTDOWN_FRAMES + 100)
        val old = scene.game
        scene.pause()
        Shots.tap(v, scene.restartButton)
        assertFalse(scene.isPaused)
        assertTrue(scene.game !== old)
        assertEquals(Phase.COUNTDOWN, scene.game.phase)
        assertSame(scene, v.scene)
    }

    @Test
    fun `quit from the pause panel goes back to the menu for that mode`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 20), 4L)
        v.step(Game.COUNTDOWN_FRAMES + 5)
        scene.pause()
        Shots.tap(v, scene.quitButton)
        assertTrue(v.scene is InfiniteSetupScene)

        val (v2, scene2) = play(Setup.Stage(1), 4L)
        v2.step(Game.COUNTDOWN_FRAMES + 5)
        scene2.pause()
        Shots.tap(v2, scene2.quitButton)
        assertTrue(v2.scene is StageSelectScene)
    }

    // ------------------------------------------------------------ whole games

    @Test
    fun `a whole stage played by touch is cleared, recorded, and leads on to the next`() {
        val (v, scene) = play(Setup.Stage(1), 21L)
        val hands = TouchHands(v)
        val bot = Bot(scene.game, 20, hands = hands)
        var n = 0
        while (scene.game.phase != Phase.STAGE_CLEAR) {
            bot.act()
            v.step(1)
            if (n % 5 == 0) Checks.assertConsistent(scene.game, "played by touch")
            assertTrue("stage 1 not cleared after ${n / 60} s\n" + Checks.describe(scene.game), ++n < 10 * 3600)
            assertNotEquals(Phase.GAME_OVER, scene.game.phase)
        }
        bot.act() // lifts its fingers
        assertFalse(scene.showsResult)
        v.step(120)
        assertTrue(scene.showsResult)
        assertEquals(1, v.app.prefs.stagesCleared)
        assertEquals(scene.game.frames, v.app.prefs.bestStageFrames(1))
        assertTrue(v.app.prefs.isUnlocked(2))
        assertFalse(v.app.prefs.isUnlocked(3))
        Shots.save(v, "23-stage-clear-by-touch")

        Shots.tap(v, scene.nextButton)
        val next = v.scene as PlayScene
        assertTrue(next !== scene)
        assertEquals(2, (next.setup as Setup.Stage).number)
        assertEquals(Phase.COUNTDOWN, next.game.phase)
    }

    @Test
    fun `an Infinite game played by touch ends, records the score, and can be played again`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.HARD, 30), 8L)
        val hands = TouchHands(v)
        // a slow player on a fast game: it will lose
        val bot = Bot(scene.game, 200, hands = hands)
        var n = 0
        while (scene.game.phase != Phase.GAME_OVER) {
            bot.act()
            v.step(1)
            if (n % 5 == 0) Checks.assertConsistent(scene.game, "played by touch")
            assertTrue("still alive after ${n / 60} s", ++n < 30 * 3600)
        }
        bot.act()
        val score = scene.game.score
        assertTrue(score > 0)
        v.step(120)
        assertTrue(scene.showsResult)
        assertEquals(score, v.app.prefs.bestScore(Difficulty.HARD))
        assertEquals(0, v.app.prefs.bestScore(Difficulty.EASY))

        // touches on the board behind the panel do nothing
        Shots.tap(v, scene.x(2), scene.board.top + 20f)
        assertTrue(scene.showsResult)

        Shots.tap(v, scene.againButton)
        assertFalse(scene.showsResult)
        assertEquals(Phase.COUNTDOWN, scene.game.phase)
        assertEquals(0, scene.game.score)

        // lose again with a lower score: the best stays
        v.step(Game.COUNTDOWN_FRAMES)
        while (scene.game.phase != Phase.GAME_OVER) v.step(1)
        assertTrue(scene.game.score < score)
        v.step(120)
        assertEquals(score, v.app.prefs.bestScore(Difficulty.HARD))
        Shots.tap(v, scene.menuButton)
        assertTrue(v.scene is InfiniteSetupScene)
    }

    @Test
    fun `a panel button works while another finger is still resting on the screen`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 1), 4L)
        val f = Fingers(v)
        v.step(Game.COUNTDOWN_FRAMES)
        // the thumb goes down on RAISE and stays there for the rest of the test
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        var n = 0
        while (scene.game.phase != Phase.GAME_OVER) {
            v.step(1)
            assertTrue(++n < 3600)
        }
        v.step(120)
        assertTrue(scene.showsResult)
        // PLAY AGAIN with a second finger
        val again = scene.againButton.rect
        f.down(0, again.centerX(), again.centerY())
        assertTrue(scene.againButton.pressed)
        f.up(0)
        assertFalse(scene.showsResult)
        assertEquals(Phase.COUNTDOWN, scene.game.phase)

        // the resting thumb must not be holding RAISE in the new game until it is put down afresh
        v.step(Game.COUNTDOWN_FRAMES + 60)
        assertEquals(0, scene.game.rowsRisen)
        assertFalse(scene.game.raiseHeld)

        // pause with a second finger, and resume with it too
        val pauseAt = scene.pauseButton.rect
        f.down(0, pauseAt.centerX(), pauseAt.centerY())
        f.up(0)
        assertTrue(scene.isPaused)
        val resume = scene.resumeButton.rect
        f.down(0, resume.centerX(), resume.centerY())
        f.up(0)
        assertFalse(scene.isPaused)
        f.up(1)
    }

    @Test
    fun `a button left pressed by a cancelled touch is not still pressed next time`() {
        val (v, scene) = play(Setup.Infinite(Difficulty.NORMAL, 1), 4L)
        v.step(Game.COUNTDOWN_FRAMES + 5)
        scene.pause()
        val f = Fingers(v)
        val r = scene.resumeButton.rect
        f.down(0, r.centerX(), r.centerY())
        assertTrue(scene.resumeButton.pressed)
        f.cancel()
        assertFalse(scene.resumeButton.pressed)
        assertTrue(scene.isPaused)
        // pressed, then Back closes the panel under the finger: the button must not stay down
        f.down(0, r.centerX(), r.centerY())
        assertTrue(v.back())
        assertFalse(scene.isPaused)
        f.up(0)
        scene.pause()
        assertFalse(scene.resumeButton.pressed)
    }

    @Test
    fun `failing a stage offers another try and unlocks nothing`() {
        val (v, scene) = play(Setup.Stage(2), 3L)
        v.app.prefs.recordStage(1, 1000)
        val f = Fingers(v)
        v.step(Game.COUNTDOWN_FRAMES)
        // hold raise until the stack hits the top, and keep holding
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        var n = 0
        while (scene.game.phase != Phase.GAME_OVER) {
            v.step(1)
            assertTrue(++n < 3600)
        }
        f.up(1)
        v.step(120)
        assertTrue(scene.showsResult)
        assertFalse(scene.nextButton.visible)
        assertEquals("TRY AGAIN", scene.againButton.label)
        assertEquals(1, v.app.prefs.stagesCleared)
        assertEquals(0, v.app.prefs.bestStageFrames(2))
        Shots.save(v, "24-stage-failed")
        Shots.tap(v, scene.againButton)
        assertEquals(Phase.COUNTDOWN, scene.game.phase)
    }

    @Test
    fun `the last stage has no next stage`() {
        val (v, scene) = play(Setup.Stage(30), 3L)
        v.step(Game.COUNTDOWN_FRAMES)
        scene.game.autoRise = false
        // bring the line into view, then leave nothing above it
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        scene.game.setBoard("12....")
        var n = 0
        while (scene.game.lineRow < 1) {
            // keep the stack short while the rows go by
            if (scene.game.stackHeight() > 6) scene.game.setBoard("12....")
            v.step(1)
            assertTrue(++n < 3600)
        }
        f.up(1)
        scene.game.setBoard("121212")
        v.step(150)
        assertEquals(Phase.STAGE_CLEAR, scene.game.phase)
        assertTrue(scene.showsResult)
        assertFalse(scene.nextButton.visible)
        assertEquals(30, v.app.prefs.stagesCleared)
    }
}
