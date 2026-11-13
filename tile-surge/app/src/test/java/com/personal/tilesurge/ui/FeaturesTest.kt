package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Bot
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Phase
import com.personal.tilesurge.core.Puzzles
import com.personal.tilesurge.core.Stages
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.LocalDate

/** The lessons, puzzles, Score Attack, the daily challenge and picking a game up again, all through the real view. */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class FeaturesTest {

    private fun view(first: (App) -> Scene): GameView = Shots.view(720, 1560, first)
    private val GameView.play: PlayScene get() = scene as PlayScene
    private fun PlayScene.x(col: Int) = board.cellLeft(col) + board.cell / 2f
    private fun PlayScene.y(row: Int) = board.cellTop(game, row) + board.cell / 2f

    @After
    fun today() {
        Days.now = { LocalDate.now() }
    }

    /** Slides the tile at [row], [fromCol] to [toCol] with a finger, and waits for the board to come to rest. */
    private fun slide(v: GameView, row: Int, fromCol: Int, toCol: Int) {
        val scene = v.play
        val f = Fingers(v)
        f.down(0, scene.x(fromCol), scene.y(row))
        f.move(0, scene.x(toCol), scene.y(row))
        v.step(Game.SWAP_FRAMES * 6)
        f.up(0)
        var n = 0
        while (v.scene === scene && scene.game.active && n++ < 2000) v.step(1)
    }

    // ------------------------------------------------------------ lessons

    @Test
    fun `the lessons can be played through by doing what each one shows`() {
        val v = view { PlayScene(it, Setup.Lesson(1)) }
        assertFalse(v.app.prefs.lessonsDone)
        for (n in 1..3) {
            val scene = v.play
            assertEquals(n, (scene.setup as Setup.Lesson).number)
            v.step(20)
            Shots.save(v, "60-lesson-$n")
            val l = Lessons.all[n - 1]
            slide(v, l.fromRow, l.fromCol, l.toCol)
            var t = 0
            while (v.scene === scene) {
                v.step(1)
                assertTrue("lesson $n never moved on", ++t < 900)
            }
        }
        // the last one: hold RAISE
        val scene = v.play
        assertEquals(4, (scene.setup as Setup.Lesson).number)
        v.step(20)
        Shots.save(v, "60-lesson-4")
        val f = Fingers(v)
        f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
        var t = 0
        while (!scene.showsResult) {
            v.step(1)
            assertTrue(++t < 900)
        }
        f.up(1)
        assertTrue(v.app.prefs.lessonsDone)
        Shots.save(v, "61-lessons-done")
        Shots.tap(v, scene.nextButton)
        assertEquals(1, (v.play.setup as Setup.Stage).number)
    }

    @Test
    fun `a lesson starts over if the player uses the board up without doing it`() {
        val v = view { PlayScene(it, Setup.Lesson(1)) }
        val scene = v.play
        val start = scene.game.boardString()
        // slide the right tile the wrong way, out into the gap
        slide(v, 0, 3, 4)
        assertNotEquals(start, scene.game.boardString())
        v.step(200)
        assertEquals(start, scene.game.boardString())
        assertEquals(1, (v.play.setup as Setup.Lesson).number)
        // the rules pages can be reached from the end, and skipping counts as done
        scene.pause()
        Shots.tap(v, scene.quitButton)
        assertTrue(v.scene is TitleScene)
        assertTrue(v.app.prefs.lessonsDone)
    }

    // ------------------------------------------------------------ puzzles

    /** Plays one swap of a puzzle's answer with a finger. */
    private fun answerMove(v: GameView, cell: Int) {
        val row = cell / Game.COLS
        val col = cell % Game.COLS
        val g = v.play.game
        if (g.grid[row][col].kind != 0) slide(v, row, col, col + 1) else slide(v, row, col + 1, col)
    }

    @Test
    fun `puzzles are solved by touch, one after another`() {
        val v = view { PlayScene(it, Setup.Puzzle(1)) }
        for (n in listOf(1, 2, 3, 4, 12, 25)) {
            if ((v.play.setup as Setup.Puzzle).number != n) v.show(PlayScene(v.app, Setup.Puzzle(n)))
            val scene = v.play
            val def = Puzzles.get(n)
            assertEquals(def.moves, scene.game.movesLeft)
            // there is no raise button on a puzzle
            val f = Fingers(v)
            f.down(1, scene.raiseRect.centerX(), scene.raiseRect.centerY())
            v.step(40)
            f.up(1)
            assertEquals(0, scene.game.rowsRisen)
            if (n == 12) Shots.save(v, "62-puzzle")
            for (m in def.answer) answerMove(v, m)
            v.step(10)
            assertEquals("puzzle $n", Phase.STAGE_CLEAR, scene.game.phase)
            assertEquals(0, scene.game.movesLeft)
            v.step(120)
            assertTrue(scene.showsResult)
            if (n == 12) Shots.save(v, "63-puzzle-solved")
            if (n <= 3) {
                assertEquals(n, v.app.prefs.puzzlesSolved)
                Shots.tap(v, scene.nextButton)
                assertEquals(n + 1, (v.play.setup as Setup.Puzzle).number)
            }
        }
    }

    @Test
    fun `running out of moves on a puzzle offers another try`() {
        val v = view { PlayScene(it, Setup.Puzzle(4)) }
        val scene = v.play
        // push the same tile to and fro until the moves are gone
        var n = 0
        while (scene.game.movesLeft > 0 && n++ < 10) {
            val row = scene.game.stackHeight() - 1
            val col = (0 until Game.COLS).first { scene.game.grid[row][it].kind != 0 }
            slide(v, row, col, if (col > 0 && scene.game.grid[row][col - 1].kind == 0) col - 1 else col + 1)
        }
        v.step(200)
        if (scene.game.phase == Phase.GAME_OVER) {
            assertTrue(scene.showsResult)
            assertFalse(scene.nextButton.visible)
            assertEquals("TRY AGAIN", scene.againButton.label)
            assertEquals(0, v.app.prefs.puzzlesSolved)
            Shots.tap(v, scene.againButton)
            assertEquals(Puzzles.get(4).moves, scene.game.movesLeft)
            Shots.tap(v, scene.pauseButton)
            Shots.tap(v, scene.quitButton)
            assertTrue(v.scene is StageSelectScene)
        }
    }

    // ------------------------------------------------------------ Score Attack and the daily challenge

    @Test
    fun `Score Attack runs for two minutes and keeps the best score`() {
        val v = view { PlayScene(it, Setup.Timed(Difficulty.NORMAL, 5), 3L) }
        val scene = v.play
        val bot = Bot(scene.game, 22, hands = TouchHands(v))
        var n = 0
        while (scene.game.phase == Phase.COUNTDOWN || scene.game.phase == Phase.PLAYING) {
            bot.act()
            v.step(1)
            if (scene.game.timeLeft == 2000) Shots.save(v, "64-score-attack")
            assertTrue(++n < 9000)
        }
        bot.act()
        assertEquals(Phase.TIME_UP, scene.game.phase)
        v.step(120)
        assertTrue(scene.showsResult)
        Shots.save(v, "65-time-up")
        val score = scene.game.score
        assertTrue(score > 300)
        assertEquals(score, v.app.prefs.bestTimed(Difficulty.NORMAL))
        assertEquals(0, v.app.prefs.bestScore(Difficulty.NORMAL))
        assertNull(v.app.prefs.savedGame)
        Shots.tap(v, scene.menuButton)
        assertTrue(v.scene is InfiniteSetupScene)
    }

    @Test
    fun `the daily challenge is the same board all day and a new one the next`() {
        Days.now = { LocalDate.of(2026, 11, 13) }
        assertEquals(20261113, Days.today())
        assertEquals(20261112, Days.yesterday())
        val a = view { TitleScene(it) }
        Shots.tap(a, (a.scene as TitleScene).dailyButton)
        val b = view { PlayScene(it, Setup.Daily(Days.today())) }
        assertEquals(a.play.game.boardString(), b.play.game.boardString())
        assertTrue(a.play.game.incoming.contentEquals(b.play.game.incoming))
        assertEquals(Setup.DAILY_LEVEL, a.play.game.level)
        Days.now = { LocalDate.of(2026, 11, 14) }
        val c = view { PlayScene(it, Setup.Daily(Days.today())) }
        assertNotEquals(a.play.game.boardString(), c.play.game.boardString())
    }

    @Test
    fun `daily scores are kept for the day, and playing day after day builds a streak`() {
        Days.now = { LocalDate.of(2026, 12, 30) }
        val v = view { TitleScene(it) }
        val p = v.app.prefs
        assertEquals(0, p.dailyStreak(Days.today(), Days.yesterday()))
        assertTrue(p.recordDaily(Days.today(), Days.yesterday(), 900))
        assertFalse(p.recordDaily(Days.today(), Days.yesterday(), 500))
        assertTrue(p.recordDaily(Days.today(), Days.yesterday(), 1200))
        assertEquals(1200, p.dailyBest(Days.today()))
        assertEquals(1, p.dailyStreak(Days.today(), Days.yesterday()))

        Days.now = { LocalDate.of(2026, 12, 31) }
        assertEquals(0, p.dailyBest(Days.today()))
        assertEquals("still alive until today is missed", 1, p.dailyStreak(Days.today(), Days.yesterday()))
        assertTrue(p.recordDaily(Days.today(), Days.yesterday(), 100))
        assertEquals(2, p.dailyStreak(Days.today(), Days.yesterday()))

        // over the new year
        Days.now = { LocalDate.of(2027, 1, 1) }
        assertTrue(p.recordDaily(Days.today(), Days.yesterday(), 100))
        assertEquals(3, p.dailyStreak(Days.today(), Days.yesterday()))

        // a day missed
        Days.now = { LocalDate.of(2027, 1, 3) }
        assertEquals(0, p.dailyStreak(Days.today(), Days.yesterday()))
        assertTrue(p.recordDaily(Days.today(), Days.yesterday(), 100))
        assertEquals(1, p.dailyStreak(Days.today(), Days.yesterday()))
    }

    // ------------------------------------------------------------ picking a game up again

    @Test
    fun `a game left part-way can be carried on from the title screen`() {
        val v = view { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 8), 11L) }
        val scene = v.play
        val hands = TouchHands(v)
        val bot = Bot(scene.game, 22, hands = hands)
        repeat(1500) {
            bot.act()
            v.step(1)
        }
        hands.release()
        hands.raise(false)
        assertNull(v.app.prefs.savedGame)
        // the app goes away
        v.pause()
        assertTrue(scene.isPaused)
        val board = scene.game.boardString()
        val score = scene.game.score
        val frames = scene.game.frames
        assertTrue(score > 0)

        // ...and is started afresh
        val again = view { TitleScene(it) }
        val title = again.scene as TitleScene
        assertTrue(title.continueButton.visible)
        assertEquals("Infinite, Normal", title.continueButton.note)
        Shots.save(again, "66-title-continue")
        Shots.tap(again, title.continueButton)
        val back = again.play
        assertTrue("it waits on the pause panel", back.isPaused)
        assertEquals(board, back.game.boardString())
        assertEquals(score, back.game.score)
        assertEquals(frames, back.game.frames)
        assertEquals(8, (back.setup as Setup.Infinite).startLevel)
        again.step(100)
        assertEquals(frames, back.game.frames)
        Shots.tap(again, back.resumeButton)
        again.step(100)
        assertEquals(frames + 100, back.game.frames)

        // quitting throws the saved game away
        back.pause()
        Shots.tap(again, back.quitButton)
        again.show(TitleScene(again.app))
        assertFalse((again.scene as TitleScene).continueButton.visible)
    }

    @Test
    fun `a finished game, a puzzle and yesterday's challenge are not offered again`() {
        val v = view { PlayScene(it, Setup.Stage(2), 5L) }
        v.step(Game.COUNTDOWN_FRAMES + 10)
        v.play.pause()
        assertEquals("S,2", v.app.prefs.savedSetup)
        // restarting or finishing clears it
        Shots.tap(v, v.play.restartButton)
        assertNull(v.app.prefs.savedSetup)

        v.show(PlayScene(v.app, Setup.Puzzle(1)))
        v.play.pause()
        assertNull(v.app.prefs.savedSetup)

        Days.now = { LocalDate.of(2026, 11, 13) }
        v.show(PlayScene(v.app, Setup.Daily(Days.today())))
        v.step(Game.COUNTDOWN_FRAMES + 10)
        v.play.pause()
        v.show(TitleScene(v.app))
        assertTrue((v.scene as TitleScene).continueButton.visible)
        Days.now = { LocalDate.of(2026, 11, 14) }
        v.show(TitleScene(v.app))
        assertFalse((v.scene as TitleScene).continueButton.visible)

        // damaged text is simply ignored
        v.app.prefs.saveGame("I,1,5", "not a game")
        v.show(TitleScene(v.app))
        assertFalse((v.scene as TitleScene).continueButton.visible)
    }

    // ------------------------------------------------------------ stars

    @Test
    fun `stars show on the stage list and on the result`() {
        val v = view { TitleScene(it) }
        val s1 = Stages.get(1)
        v.app.prefs.recordStage(1, s1.threeStarFrames)
        v.app.prefs.recordStage(2, Stages.get(2).twoStarFrames)
        v.app.prefs.recordStage(3, Stages.get(3).twoStarFrames + 600)
        v.app.prefs.recordPuzzle(5)
        v.show(StageSelectScene(v.app))
        val list = v.scene as StageSelectScene
        assertEquals(listOf(3, 2, 1), list.stageButtons.take(3).map { it.stars })
        assertEquals(-1, list.stageButtons[3].stars)
        Shots.save(v, "67-stage-stars")
        v.show(StageSelectScene(v.app, puzzles = true))
        val puzzles = v.scene as StageSelectScene
        assertEquals("solved", puzzles.stageButtons[4].note)
        assertEquals("2 moves", puzzles.stageButtons[5].note)
        assertFalse(puzzles.stageButtons[6].enabled)
        Shots.save(v, "68-puzzle-list")
        v.show(TitleScene(v.app))
        v.step(20)
        Shots.save(v, "69-title")
    }
}
