package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Bot
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.core.Phase
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/**
 * Draws every screen of the game with the real drawing code and saves the pictures to
 * app/build/outputs/screens, so the look can be checked without a phone.
 * The games in the pictures are played by the test bot through simulated touches.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class ScreensTest {

    private val w = 720
    private val h = 1560

    /** The launcher icon as a phone shows it: on its background colour, cut to a circle and to a rounded square. */
    @Test
    fun icon() {
        val context = org.robolectric.RuntimeEnvironment.getApplication()
        val size = 432
        val bmp = android.graphics.Bitmap.createBitmap(size * 3 + 80, size + 40, android.graphics.Bitmap.Config.ARGB_8888)
        val c = android.graphics.Canvas(bmp)
        c.drawColor(0xFF808890.toInt())
        val bg = android.graphics.Paint(android.graphics.Paint.ANTI_ALIAS_FLAG).apply {
            color = context.getColor(com.personal.tilesurge.R.color.ic_launcher_background)
        }
        val layers = listOf(com.personal.tilesurge.R.drawable.ic_launcher_foreground,
            com.personal.tilesurge.R.drawable.ic_launcher_foreground,
            com.personal.tilesurge.R.drawable.ic_launcher_monochrome)
        for ((i, id) in layers.withIndex()) {
            val left = 20f + i * (size + 20f)
            val top = 20f
            c.save()
            val clip = android.graphics.Path()
            // launchers show the middle two thirds of the 108dp canvas
            val shown = android.graphics.RectF(left, top, left + size, top + size)
            if (i == 0) clip.addOval(shown, android.graphics.Path.Direction.CW)
            else clip.addRoundRect(shown, size * 0.24f, size * 0.24f, android.graphics.Path.Direction.CW)
            c.clipPath(clip)
            if (i == 2) bg.color = 0xFF2B3A55.toInt()
            c.drawRect(shown, bg)
            val d = context.getDrawable(id)!!
            val full = size * 108f / 72f
            val off = (full - size) / 2f
            d.setBounds((left - off).toInt(), (top - off).toInt(), (left - off + full).toInt(), (top - off + full).toInt())
            if (i == 2) d.setTint(0xFFBFD4FF.toInt())
            d.draw(c)
            c.restore()
        }
        Shots.dir.mkdirs()
        java.io.FileOutputStream(java.io.File(Shots.dir, "00-icon.png")).use { bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it) }
    }

    @Test
    fun menus() {
        val v = Shots.view(w, h) { TitleScene(it) }
        v.step(30)
        Shots.save(v, "01-title")

        v.app.prefs.recordScore(Difficulty.NORMAL, 18240)
        v.app.prefs.difficulty = Difficulty.NORMAL
        for (n in 1..7) v.app.prefs.recordStage(n, 2400 + n * 317)
        v.show(TitleScene(v.app))
        v.step(75)
        Shots.save(v, "02-title-with-records")
        v.show(InfiniteSetupScene(v.app))
        Shots.save(v, "03-infinite-setup")
        v.show(StageSelectScene(v.app))
        Shots.save(v, "04-stage-select")
    }

    @Test
    fun howTo() {
        val v = Shots.view(w, h) { HowToScene(it) }
        val scene = v.scene as HowToScene
        val frames = intArrayOf(60, 100, 160, 85, 150)
        for (page in 0 until 5) {
            v.step(frames[page])
            Shots.save(v, "05-how-to-${page + 1}")
            if (page < 4) Shots.tap(v, scene.nextButton)
        }
    }

    @Test
    fun infinite() {
        val v = Shots.view(w, h) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 8), 77L) }
        val scene = v.scene as PlayScene
        v.app.prefs.hintSeen = false
        v.step(30)
        Shots.save(v, "10-play-ready")
        v.step(Game.COUNTDOWN_FRAMES - 10)
        Shots.save(v, "10-play-go")
        val hands = TouchHands(v)
        val bot = Bot(scene.game, 24, hands = hands)
        var n = 0
        var chains = 0
        var held = 0
        var flash = 0
        while (n < 9000 && scene.game.phase == Phase.PLAYING) {
            bot.act()
            v.step(1)
            n++
            if (chains < 3 && scene.game.clearing && scene.game.chain >= 2 && n % 41 == 0) Shots.save(v, "11-play-chain-${chains++}")
            if (held < 2 && scene.game.grabbedId != 0 && scene.game.active && n % 13 == 0) Shots.save(v, "11-play-holding-${held++}")
            if (flash < 1 && scene.game.clearing && n % 2 == 0 && scene.game.stopFrames == 0) Shots.save(v, "11-play-flash-${flash++}")
        }
        Shots.save(v, "12-play-later")
        assertTrue(scene.game.score > 500)
        hands.release()
        hands.raise(false)
        scene.pause()
        Shots.save(v, "13-paused")
    }

    /** A three-step chain, set up by hand and set off with one touch. Also saved frame by frame for a preview clip. */
    @Test
    fun chain() {
        val v = Shots.view(w, h) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 8), 77L) }
        val scene = v.scene as PlayScene
        v.app.prefs.hintSeen = true
        v.step(Game.COUNTDOWN_FRAMES + 45)
        scene.game.autoRise = false
        scene.game.setBoard(
            "3.....",
            "2.....",
            "2....5",
            "1151.4",
            "2334.5",
            "415254",
            "352431",
        )
        val b = scene.board
        fun x(col: Int) = b.cellLeft(col) + b.cell / 2f
        fun y(row: Int) = b.cellTop(scene.game, row) + b.cell / 2f
        val f = Fingers(v)
        val frames = java.io.File(Shots.dir, "frames").apply { mkdirs() }
        var n = 0
        var stepsSeen = 0
        var countdown = 0
        fun step(count: Int) = repeat(count) {
            v.step(1)
            // every third frame, for a 20-frames-a-second clip
            if (n % 3 == 0) {
                val bmp = Shots.bitmap(v)
                java.io.FileOutputStream(java.io.File(frames, String.format("f%04d.png", n / 3))).use {
                    bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, it)
                }
            }
            // and a still picture a moment after each chain step begins
            if (scene.game.chain - 1 > stepsSeen && scene.game.clearing) {
                stepsSeen = scene.game.chain - 1
                countdown = 14
            }
            if (countdown > 0 && --countdown == 0) Shots.save(v, "50-chain-x${scene.game.chain}")
            n++
        }
        step(20)
        f.down(0, x(3), y(3))
        step(6)
        f.move(0, x(3) - b.cell * 0.4f, y(3))
        step(3)
        f.move(0, x(2), y(3))
        step(8)
        f.up(0)
        step(360)
        assertTrue(scene.game.maxChain == 3)
        assertTrue(scene.game.score >= 340)
    }

    @Test
    fun infiniteGameOver() {
        val v = Shots.view(w, h) { PlayScene(it, Setup.Infinite(Difficulty.HARD, 30), 5L) }
        val scene = v.scene as PlayScene
        var n = 0
        while (scene.game.phase != Phase.GAME_OVER && n++ < 20000) {
            v.step(1)
            if (scene.game.topOccupied && scene.game.grace == 40) Shots.save(v, "14-play-danger")
        }
        v.step(20)
        Shots.save(v, "15-game-over-sweep")
        v.step(80)
        Shots.save(v, "16-game-over")
    }

    @Test
    fun stage() {
        val v = Shots.view(w, h) { PlayScene(it, Setup.Stage(12), 9L) }
        val scene = v.scene as PlayScene
        v.app.prefs.recordStage(12, 3411)
        val hands = TouchHands(v)
        val bot = Bot(scene.game, 22, hands = hands)
        var n = 0
        var lineShots = 0
        var raising = 0
        var banner = false
        while (scene.game.phase == Phase.PLAYING || scene.game.phase == Phase.COUNTDOWN) {
            bot.act()
            v.step(1)
            assertTrue(++n < 40000)
            if (raising < 1 && scene.game.raiseHeld && scene.game.riseFraction in 0.4f..0.6f && scene.game.rowsRisen == 3) Shots.save(v, "20-stage-raising-${raising++}")
            if (!banner && scene.game.lineRow == 0 && scene.game.riseFraction > 0.5f) {
                Shots.save(v, "20-stage-line-appears")
                banner = true
            }
            if (lineShots < 2 && scene.game.lineRow >= 2 + lineShots * 2 && n % 9 == 0) Shots.save(v, "20-stage-line-${lineShots++}")
        }
        bot.act()
        assertTrue(scene.game.phase == Phase.STAGE_CLEAR)
        v.step(30)
        Shots.save(v, "21-stage-clear-burst")
        v.step(80)
        Shots.save(v, "22-stage-clear")
    }

    /** A tablet on its side: the readouts move to the left of the well and the raise button to the right. */
    @Test
    @Config(qualifiers = "w1280dp-h800dp-mdpi")
    fun wide() {
        val v = Shots.view(1280, 800) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 8), 77L) }
        val scene = v.scene as PlayScene
        val hands = TouchHands(v)
        val bot = Bot(scene.game, 24, hands = hands)
        repeat(1500) {
            bot.act()
            v.step(1)
        }
        Shots.save(v, "30-wide-play")
        assertTrue(scene.game.score > 0)
        // everything is on screen and nothing overlaps the well
        assertTrue(scene.raiseRect.left >= scene.board.right)
        assertTrue(scene.raiseRect.right <= 1280f && scene.raiseRect.bottom <= 800f)
        assertTrue(scene.board.top >= 0f && scene.board.bottom <= 800f)
        hands.release()
        hands.raise(false)
        v.show(TitleScene(v.app))
        Shots.save(v, "31-wide-title")
        v.show(StageSelectScene(v.app))
        Shots.save(v, "32-wide-stages")
        v.show(HowToScene(v.app))
        v.step(100)
        Shots.save(v, "33-wide-how-to")
    }

    /** A small, short phone: everything still has to fit. */
    @Test
    @Config(qualifiers = "w320dp-h533dp-hdpi")
    fun small() {
        val v = Shots.view(480, 800) { PlayScene(it, Setup.Stage(1), 3L) }
        val scene = v.scene as PlayScene
        v.step(Game.COUNTDOWN_FRAMES + 40)
        Shots.save(v, "40-small-play")
        assertTrue(scene.board.cell >= 40f)
        assertTrue(scene.raiseRect.bottom <= 800f)
        assertTrue(scene.board.left >= 0f && scene.board.right <= 480f)
        v.show(TitleScene(v.app))
        Shots.save(v, "41-small-title")
        v.show(InfiniteSetupScene(v.app))
        Shots.save(v, "42-small-setup")
        v.show(StageSelectScene(v.app))
        Shots.save(v, "43-small-stages")
        v.show(HowToScene(v.app))
        v.step(90)
        Shots.save(v, "44-small-how-to")
    }
}
