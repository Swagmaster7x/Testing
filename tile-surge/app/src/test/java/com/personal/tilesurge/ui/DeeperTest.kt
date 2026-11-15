package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Goal
import com.personal.tilesurge.core.Phase
import com.personal.tilesurge.core.Stages
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import java.time.LocalDate

/** Missions, coins and the shop, the chain hint, the new stage goals and games against the computer, through the real view. */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class DeeperTest {

    private fun view(first: (App) -> Scene): GameView = Shots.view(720, 1560, first)
    private val GameView.play: PlayScene get() = scene as PlayScene

    @After
    fun tidy() {
        Days.now = { LocalDate.now() }
        TileArt.theme = 0
        Palette.backdrop = 0
    }

    private fun start(v: GameView, setup: Setup, seed: Long = 5L): PlayScene {
        v.show(PlayScene(v.app, setup, seed))
        v.step(Game.COUNTDOWN_FRAMES)
        v.play.game.autoRise = false
        return v.play
    }

    /** Fills [g] to the top with tiles that make no match and cannot be moved, so its time runs out. */
    private fun topOut(v: GameView, g: Game) {
        jam(g)
        g.autoRise = true
        var n = 0
        while (g.phase == Phase.PLAYING && n++ < 6000) v.step(1)
        v.step(150)
    }

    private fun jam(g: Game) {
        val rows = Array(Game.ROWS) { if (it % 2 == 0) "123123" else "231231" }
        g.setBoard(*rows)
        for (r in 0 until Game.ROWS) for (c in 0 until Game.COLS) g.grid[r][c].frozen = true
    }

    // ------------------------------------------------------------ missions and coins

    @Test
    fun `every day has three different missions, the same ones all day`() {
        for (day in 20261101..20261130) {
            val a = Missions.forDay(day)
            assertEquals(3, a.size)
            assertEquals(3, a.map { it.kind }.toSet().size)
            assertEquals(a.map { it.text }, Missions.forDay(day).map { it.text })
        }
        assertTrue((20261101..20261130).map { d -> Missions.forDay(d).map { it.text } }.toSet().size > 10)
    }

    @Test
    fun `missions fill up as games are played, pay out once, and start afresh the next day`() {
        Days.now = { LocalDate.of(2026, 11, 13) }
        val v = view { TitleScene(it) }
        val p = v.app.prefs
        val day = Days.today()
        val list = Missions.forDay(day)
        assertEquals(0, p.missionsWaiting(day))
        // one enormous game finishes whatever the day asks for, or all but the ones that take several games
        repeat(3) {
            p.finishRun(day, Run(tiles = 400, bestChain = 5, bestCombo = 8, blocks = 20, chainSteps = 9, score = 9000,
                timed = true, stageCleared = true, puzzleSolved = true))
        }
        for (i in 0 until 3) assertEquals(list[i].target, p.missionProgress(day, i))
        assertEquals(3, p.missionsWaiting(day))
        assertEquals(3, p.stat("games"))
        assertEquals(1200, p.stat("tiles"))
        assertEquals(5, p.stat("best_chain"))

        v.show(TitleScene(v.app))
        assertEquals("3 to claim", (v.scene as TitleScene).missionsButton.note)
        Shots.tap(v, (v.scene as TitleScene).missionsButton)
        val scene = v.scene as MissionsScene
        v.step(5)
        Shots.save(v, "80-missions")
        assertTrue(scene.claimButtons.all { it.visible })
        Shots.tap(v, scene.claimButtons[0])
        assertEquals(list[0].reward, p.coins)
        assertFalse(scene.claimButtons[0].visible)
        assertEquals(0, p.claimMission(day, 0))
        Shots.tap(v, scene.claimButtons[1])
        Shots.tap(v, scene.claimButtons[2])
        assertEquals(list.sumOf { it.reward }, p.coins)
        assertEquals(0, p.missionsWaiting(day))
        Shots.save(v, "81-missions-claimed")

        Days.now = { LocalDate.of(2026, 11, 14) }
        assertEquals(0, p.missionProgress(Days.today(), 0))
        assertFalse(p.missionClaimed(Days.today(), 0))
        p.finishRun(Days.today(), Run(1, 1, 3, 0, 0, 10))
        assertEquals(0, p.missionsWaiting(Days.today()))
    }

    @Test
    fun `the shop sells tile sets and backdrops for coins and puts them to use`() {
        val v = view { ShopScene(it) }
        val p = v.app.prefs
        val shop = v.scene as ShopScene
        Shots.tap(v, shop.themeButtons[1])
        assertEquals(0, p.tileTheme)
        assertFalse(p.ownsTheme(1))
        v.step(5)
        Shots.save(v, "82-shop-too-dear")

        p.addCoins(500)
        Shots.tap(v, shop.themeButtons[1])
        assertEquals(1, p.tileTheme)
        assertEquals(1, TileArt.theme)
        assertEquals(500 - Missions.THEME_PRICES[1], p.coins)
        Shots.tap(v, shop.backdropButtons[2])
        assertEquals(2, Palette.backdrop)
        val left = p.coins
        // what is owned costs nothing to switch between
        Shots.tap(v, shop.themeButtons[0])
        Shots.tap(v, shop.themeButtons[1])
        assertEquals(left, p.coins)
        assertEquals("in use", shop.themeButtons[1].note)
        assertEquals("yours", shop.themeButtons[0].note)
        v.step(5)
        Shots.save(v, "83-shop")

        // and it is still in use the next time the game is opened
        TileArt.theme = 0
        Palette.backdrop = 0
        val again = view { TitleScene(it) }
        assertEquals(1, TileArt.theme)
        assertEquals(2, Palette.backdrop)
        again.show(PlayScene(again.app, Setup.Infinite(Difficulty.NORMAL, 5), 9L))
        again.step(200)
        Shots.save(again, "84-candy-forest")
    }

    @Test
    fun `clearing a stage pays coins for new stars only`() {
        val v = view { TitleScene(it) }
        val scene = start(v, Setup.Stage(3))
        assertEquals(Goal.BREAK, Stages.get(3).goal)
        assertTrue(scene.game.blockCount() > 0)
        v.step(30)
        Shots.save(v, "85-blocker-stage")
        scene.game.setBoard("12....")
        v.step(150)
        assertEquals(Phase.STAGE_CLEAR, scene.game.phase)
        assertTrue(scene.showsResult)
        assertEquals(3 * Missions.COINS_PER_STAR, scene.coinsEarned)
        assertEquals(15, v.app.prefs.coins)
        assertEquals(1, v.app.prefs.stat("games"))
        Shots.save(v, "86-stage-coins")
        // the same three stars again pay nothing more
        val again = start(v, Setup.Stage(3))
        again.game.setBoard("12....")
        v.step(150)
        assertEquals(0, again.coinsEarned)
        assertEquals(15, v.app.prefs.coins)
    }

    @Test
    fun `survival and chain stages say what they want and end when they get it`() {
        val v = view { TitleScene(it) }
        for (n in 1..6) v.app.prefs.recordStage(n, 99999)
        val hold = start(v, Setup.Stage(7))
        val def = Stages.get(7)
        assertEquals(Goal.SURVIVE, def.goal)
        hold.game.setBoard("12....")
        v.step(60)
        Shots.save(v, "87-survive-stage")
        var n = 0
        while (hold.game.phase == Phase.PLAYING && n++ < def.target + 600) {
            if (hold.game.stackHeight() > 6) hold.game.setBoard("12....")
            v.step(1)
        }
        assertEquals(Phase.STAGE_CLEAR, hold.game.phase)
        assertTrue(hold.game.frames >= def.target)

        val chains = start(v, Setup.Stage(5))
        assertEquals(Goal.CHAINS, Stages.get(5).goal)
        chains.game.setBoard("2.....", "1.....", "1.....", "1.....", "2.....", "2.....")
        v.step(100)
        Shots.save(v, "88-chain-stage")
        v.step(140)
        assertEquals(1, chains.game.chainSteps)
        assertEquals(Phase.PLAYING, chains.game.phase)
        chains.game.setBoard("2.....", "1.....", "1.....", "1.....", "2.....", "2.....")
        v.step(240)
        assertEquals(Phase.STAGE_CLEAR, chains.game.phase)
    }

    @Test
    fun `a finished mission is announced on the result panel`() {
        Days.now = { LocalDate.of(2026, 11, 13) }
        val v = view { TitleScene(it) }
        val day = Days.today()
        val list = Missions.forDay(day)
        // all but done beforehand, so that one more game of any kind finishes "Finish 3 games"
        val games = list.indexOfFirst { it.kind == MissionKind.GAMES }
        assertTrue(games >= 0)
        repeat(2) { v.app.prefs.finishRun(day, Run(0, 1, 0, 0, 0, 0)) }
        val scene = start(v, Setup.Infinite(Difficulty.EASY, 1))
        topOut(v, scene.game)
        assertEquals(Phase.GAME_OVER, scene.game.phase)
        assertTrue(scene.showsResult)
        assertEquals(listOf(list[games].text), scene.missionsDone)
        Shots.save(v, "86-mission-done")
        v.show(TitleScene(v.app))
        assertEquals("1 to claim", (v.scene as TitleScene).missionsButton.note)
    }

    @Test
    fun `Infinite can be carried on once for coins, and the game is counted once`() {
        val v = view { TitleScene(it) }
        val scene = start(v, Setup.Infinite(Difficulty.EASY, 1))
        scene.game.setBoard("111...")
        v.step(200)
        topOut(v, scene.game)
        assertTrue(scene.showsResult)
        // no coins, no offer
        assertFalse(scene.continueButton.visible)
        assertEquals(1, v.app.prefs.stat("games"))
        assertEquals(3, v.app.prefs.stat("tiles"))

        v.app.prefs.addCoins(250)
        Shots.tap(v, scene.againButton)
        v.step(Game.COUNTDOWN_FRAMES)
        scene.game.autoRise = false
        scene.game.setBoard("222...")
        v.step(200)
        topOut(v, scene.game)
        assertTrue(scene.continueButton.visible)
        Shots.save(v, "86-continue-offer")
        Shots.tap(v, scene.continueButton)
        assertEquals(150, v.app.prefs.coins)
        assertEquals(Phase.PLAYING, scene.game.phase)
        assertFalse(scene.showsResult)
        assertTrue(scene.game.stackHeight() <= Game.ROWS / 2)
        v.step(30)
        Shots.save(v, "86-continued")
        // the tiles thaw nothing by themselves: clear some, then top out again
        scene.game.setBoard("333...")
        v.step(200)
        topOut(v, scene.game)
        assertTrue(scene.showsResult)
        assertFalse(scene.continueButton.visible)
        assertEquals(150, v.app.prefs.coins)
        assertEquals(2, v.app.prefs.stat("games"))
        assertEquals(9, v.app.prefs.stat("tiles"))
    }

    @Test
    fun `the puzzles with ice and surge tiles show them and can be solved by touch`() {
        val v = view { TitleScene(it) }
        v.app.prefs.recordPuzzle(32)
        val scene = start(v, Setup.Puzzle(33))
        val g = scene.game
        assertTrue(g.grid[0][3].power)
        Shots.save(v, "86-surge-puzzle")
        // the answer: swap row 2, columns 2 and 3
        val f = Fingers(v)
        val y = scene.board.cellTop(g, 2) + scene.board.cell / 2f
        f.down(0, scene.board.cellLeft(2) + scene.board.cell / 2f, y)
        f.move(0, scene.board.cellLeft(3) + scene.board.cell / 2f, y)
        v.step(12)
        f.up(0)
        v.step(500)
        assertEquals(Phase.STAGE_CLEAR, g.phase)
        assertEquals(33, v.app.prefs.puzzlesSolved)
        val ice = start(v, Setup.Puzzle(32))
        assertTrue(ice.game.grid[0][1].frozen)
        assertFalse(ice.game.grab(0, 1))
        Shots.save(v, "86-ice-puzzle")
        v.show(StageSelectScene(v.app, puzzles = true))
        assertEquals(45, (v.scene as StageSelectScene).stageButtons.size)
        Shots.save(v, "86-puzzle-list")
    }

    // ------------------------------------------------------------ the chain hint

    @Test
    fun `a new player who waits is shown a chain, and an old hand is not`() {
        val v = view { TitleScene(it) }
        val scene = start(v, Setup.Stage(1))
        scene.game.setBoard(".33.4.", "113125")
        v.step(200)
        // sliding the 1 at column 3 one to the left clears the bottom three and drops the 3s together
        assertEquals(2, scene.hintCell)
        Shots.save(v, "89-chain-hint")
        val f = Fingers(v)
        f.down(0, scene.board.cellLeft(3) + scene.board.cell / 2f, scene.board.cellTop(scene.game, 0) + scene.board.cell / 2f)
        v.step(2)
        assertEquals(-1, scene.hintCell)
        f.up(0)

        v.app.prefs.finishRun(Days.today(), Run(100, 4, 5, 0, 60, 1000))
        val old = start(v, Setup.Stage(1))
        old.game.setBoard(".33.4.", "113125")
        v.step(200)
        assertEquals(-1, old.hintCell)
    }

    // ------------------------------------------------------------ fever, surge tiles and blockers on screen

    @Test
    fun `fever, a surge tile and falling blockers are drawn without trouble`() {
        val v = view { TitleScene(it) }
        val scene = start(v, Setup.Infinite(Difficulty.NORMAL, 8), 21L)
        val g = scene.game
        g.setBoard("12.3..", "121343", "212434", "121343")
        g.grid[0][0].power = true
        g.grid[1][3].frozen = true
        g.receiveBlocks(9)
        v.step(40)
        assertTrue(g.blockCount() > 0)
        Shots.save(v, "90-blockers-falling")
        // slide the surge tile into line: three 1s go, and it takes the rest of its row with them
        val f = Fingers(v)
        val y = scene.board.cellTop(g, 0) + scene.board.cell / 2f
        g.setBoard("112134")
        g.grid[0][3].power = true
        f.down(0, scene.board.cellLeft(3) + scene.board.cell / 2f, y)
        f.move(0, scene.board.cellLeft(2) + scene.board.cell / 2f, y)
        v.step(12)
        f.up(0)
        var n = 0
        var best = 0
        while (n++ < 400) {
            v.step(1)
            if (n == 30 || n == 75) Shots.save(v, "91-surge-$n")
        }
        assertTrue(g.tilesCleared >= 6)
        // enough clears fill the meter
        n = 0
        while (g.feverFrames == 0 && n++ < 200) {
            g.setBoard("111222", "333444")
            v.step(150)
        }
        assertTrue(g.feverFrames > 0)
        val before = g.score
        g.setBoard("111...")
        v.step(20)
        Shots.save(v, "92-fever")
        v.step(130)
        best = g.score - before
        assertTrue(best >= 2 * 3 * 10)
    }

    // ------------------------------------------------------------ versus

    @Test
    fun `clears send blockers across, and cancel the ones on their way`() {
        val v = view { VersusSetupScene(it) }
        val setup = v.scene as VersusSetupScene
        v.step(5)
        Shots.save(v, "93-versus-setup")
        Shots.tap(v, setup.choices[1])
        assertEquals(Difficulty.NORMAL, v.app.prefs.versusDifficulty)
        Shots.tap(v, setup.startButton)
        val scene = v.play
        val rival = scene.rival
        assertNotNull(rival)
        v.step(Game.COUNTDOWN_FRAMES)
        scene.game.autoRise = false
        assertEquals(Phase.PLAYING, rival!!.phase)
        // five at once sends two
        scene.game.setBoard("11111.")
        v.step(3)
        assertEquals(2, scene.sent)
        // blockers on their way here are used up first by an attack, and only the rest goes across
        val g = Game.infinite(Difficulty.NORMAL, 1, 1L)
        g.receiveBlocks(3)
        assertEquals(0, g.cancelBlocks(2))
        assertEquals(1, g.pendingBlocks)
        assertEquals(4, g.cancelBlocks(5))
        assertEquals(0, g.pendingBlocks)
        // the computer is playing its own well meanwhile
        v.step(600)
        assertTrue(rival.frames > 600)
    }

    @Test
    fun `the computer topping out wins the game, and topping out first loses it`() {
        val v = view { TitleScene(it) }
        val scene = start(v, Setup.Versus(Difficulty.HARD))
        jam(scene.rival!!)
        var n = 0
        while (scene.game.phase == Phase.PLAYING && n++ < 1200) {
            if (scene.game.stackHeight() > 6) scene.game.setBoard("12....")
            v.step(1)
        }
        assertEquals(Phase.GAME_OVER, scene.rival!!.phase)
        assertEquals(Phase.STAGE_CLEAR, scene.game.phase)
        v.step(150)
        assertTrue(scene.showsResult)
        assertFalse(scene.nextButton.visible)
        assertEquals(1, v.app.prefs.versusWins(Difficulty.HARD))
        assertEquals(1, v.app.prefs.stat("wins"))
        assertEquals(35, scene.coinsEarned)
        Shots.save(v, "95-versus-won")
        // play again starts a fresh pair of wells
        Shots.tap(v, scene.againButton)
        assertEquals(Phase.COUNTDOWN, scene.rival!!.phase)
        v.step(Game.COUNTDOWN_FRAMES)
        jam(scene.game)
        v.step(900)
        assertEquals(Phase.GAME_OVER, scene.game.phase)
        val rivalFrames = scene.rival!!.frames
        v.step(60)
        assertEquals(rivalFrames, scene.rival!!.frames)
        assertTrue(scene.showsResult)
        assertEquals(1, v.app.prefs.versusWins(Difficulty.HARD))
        Shots.save(v, "96-versus-lost")
        Shots.tap(v, scene.menuButton)
        assertTrue(v.scene is VersusSetupScene)
        // nothing of a versus game is kept for later
        assertNull(v.app.prefs.savedGame)
    }

    @Test
    fun `the computer's well is a good size on every shape of screen`() {
        // a phone held upright: beside the player's well, a quarter of its size, and the tiles are still easy to hold
        val tall = view { PlayScene(it, Setup.Versus(Difficulty.NORMAL), 4L) }
        tall.step(600)
        val t = tall.play
        assertFalse(t.rivalBeside)
        assertTrue(t.rivalBoard.left > t.board.right)
        assertTrue(t.rivalBoard.right <= tall.width - 12f)
        assertEquals(t.board.top, t.rivalBoard.top)
        assertTrue(t.rivalBoard.cell >= t.board.cell / 4f - 1f)
        assertTrue(t.board.cell >= 40f * 2)
        assertTrue(t.raiseRect.right >= t.rivalBoard.right)
        Shots.save(tall, "94-versus")

        // a small old phone
        val small = Shots.view(480, 800) { PlayScene(it, Setup.Versus(Difficulty.NORMAL), 4L) }
        small.step(300)
        assertTrue(small.play.rivalBoard.right <= small.width)
        assertTrue(small.play.rivalBoard.left > small.play.board.right)
        Shots.save(small, "94-versus-small")

        // a tablet on its side: two full wells
        val v = Shots.view(1600, 1000) { PlayScene(it, Setup.Versus(Difficulty.EASY), 4L) }
        v.step(600)
        val scene = v.play
        assertTrue(scene.rivalBeside)
        assertEquals(scene.board.cell, scene.rivalBoard.cell)
        assertEquals(scene.board.bottom, scene.rivalBoard.bottom)
        assertTrue(scene.rivalBoard.left >= 12f)
        assertTrue(scene.rivalBoard.right < scene.pauseButton.rect.left)
        assertTrue(scene.raiseRect.right <= v.width - 12f)
        Shots.save(v, "97-versus-wide")

        // a phone on its side
        val phone = Shots.view(1560, 720) { PlayScene(it, Setup.Versus(Difficulty.EASY), 4L) }
        phone.step(600)
        assertTrue(phone.play.rivalBeside)
        assertEquals(phone.play.board.cell, phone.play.rivalBoard.cell)
        Shots.save(phone, "97-versus-phone-sideways")

        // nearly square: no room for two, so the computer's well goes small above the raise button
        val square = Shots.view(1050, 1000) { PlayScene(it, Setup.Versus(Difficulty.EASY), 4L) }
        square.step(300)
        val q = square.play
        assertFalse(q.rivalBeside)
        assertTrue(q.rivalBoard.left >= q.board.right)
        assertTrue(q.rivalBoard.bottom <= q.raiseRect.top)
        assertTrue(q.rivalBoard.right <= square.width)
        Shots.save(square, "97-versus-square")
    }

    @Test
    fun `the title has room for everything, and forty stages fit their screen`() {
        val v = view { TitleScene(it) }
        v.app.prefs.saveGame(Setup.Infinite(Difficulty.EASY, 1).encode()!!, Game.infinite(Difficulty.EASY, 1, 1L).save())
        v.show(TitleScene(v.app))
        val t = v.scene as TitleScene
        v.step(10)
        Shots.save(v, "98-title-full")
        val all = listOf(t.continueButton, t.stageButton, t.puzzleButton, t.infiniteButton, t.timedButton, t.versusButton,
            t.dailyButton, t.missionsButton, t.shopButton, t.howButton)
        assertTrue(all.all { it.visible && it.rect.height() >= 40f * 2 })
        assertTrue(t.howButton.rect.bottom < t.soundButton.rect.top)
        for (n in 1..12) v.app.prefs.recordStage(n, 3000)
        v.show(StageSelectScene(v.app))
        val list = v.scene as StageSelectScene
        assertEquals(Stages.COUNT, list.stageButtons.size)
        assertTrue(list.stageButtons.last().rect.bottom <= v.height)
        assertTrue(list.stageButtons.all { it.rect.height() >= 44f * 2 })
        Shots.save(v, "99-forty-stages")
    }
}
