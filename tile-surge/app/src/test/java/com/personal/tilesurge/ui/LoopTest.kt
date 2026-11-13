package com.personal.tilesurge.ui

import android.os.Looper
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.RobolectricTestRunner
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import org.robolectric.shadows.ShadowChoreographer
import org.robolectric.shadows.ShadowSystemClock
import java.time.Duration

/**
 * The view's own clock: sixty ticks a second whatever the screen's refresh rate, and none while the app is away.
 *
 * Robolectric's Choreographer is kept paused here and the clock is moved by hand: left to itself it
 * advances time whenever a frame is asked for, and a game that always asks for the next frame would
 * never let the test's looper go idle.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w360dp-h780dp-xhdpi")
class LoopTest {

    private fun ticks(scene: PlayScene): Int = (Game.COUNTDOWN_FRAMES - scene.game.countdown) + scene.game.frames

    private var frameMillis = 16L

    private fun screen(frameMillis: Long) {
        this.frameMillis = frameMillis
        ShadowChoreographer.setPaused(true)
        ShadowChoreographer.setFrameDelay(Duration.ofMillis(frameMillis))
    }

    /** Lets [millis] of time go by, one screen refresh at a time. */
    private fun pass(millis: Long) {
        var t = 0L
        while (t < millis) {
            ShadowSystemClock.advanceBy(Duration.ofMillis(frameMillis))
            shadowOf(Looper.getMainLooper()).idle()
            t += frameMillis
        }
    }

    private fun run(frameMillis: Long, millis: Long): Int {
        screen(frameMillis)
        val v = Shots.view(720, 1560) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 1), 4L) }
        val scene = v.scene as PlayScene
        v.resume()
        pass(millis)
        val n = ticks(scene)
        v.pause()
        return n
    }

    @Test(timeout = 60_000)
    fun `the game runs at sixty ticks a second on a 60, 90 and 120 hertz screen`() {
        for (frameMillis in longArrayOf(16, 11, 8)) {
            val n = run(frameMillis, 3000)
            assertTrue("$n ticks in 3 s with a frame every $frameMillis ms", n in 172..182)
        }
    }

    @Test(timeout = 60_000)
    fun `a screen a shade off sixty hertz gets exactly one tick a frame`() {
        // 17 ms a frame is 58.8 Hz. Rather than slip a tick every few seconds, the game keeps step with the screen.
        val n = run(17, 3400)
        assertEquals(199, n)
    }

    @Test(timeout = 60_000)
    fun `a slow screen still gets sixty ticks a second`() {
        val n = run(33, 3000)
        assertTrue("$n ticks in 3 s at 30 frames a second", n in 170..182)
    }

    @Test(timeout = 60_000)
    fun `a long stall is not made up all at once`() {
        // one frame every half second: the game slows down rather than leaping ahead
        val n = run(500, 3000)
        assertTrue("$n ticks", n in 1..40)
    }

    @Test(timeout = 60_000)
    fun `nothing ticks while the app is away, and the game waits paused`() {
        screen(16)
        val v = Shots.view(720, 1560) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 1), 4L) }
        val scene = v.scene as PlayScene
        v.resume()
        pass(2000)
        assertTrue(scene.game.frames > 30)
        assertTrue(v.keepScreenOn)
        v.pause()
        val before = ticks(scene)
        assertTrue(scene.isPaused)
        pass(2000)
        assertEquals(before, ticks(scene))

        // back in front: the clock runs again, but the game stays on its pause panel until the player resumes
        v.resume()
        pass(1000)
        assertEquals(before, ticks(scene))
        assertTrue(scene.isPaused)
        assertFalse("the screen may sleep on the pause panel", v.keepScreenOn)
        Shots.tap(v, scene.resumeButton)
        pass(1000)
        assertTrue(ticks(scene) > before + 50)
        assertTrue(v.keepScreenOn)
        v.pause()
    }

    @Test(timeout = 60_000)
    fun `resume twice does not double the speed`() {
        screen(16)
        val v = Shots.view(720, 1560) { PlayScene(it, Setup.Infinite(Difficulty.NORMAL, 1), 4L) }
        val scene = v.scene as PlayScene
        v.resume()
        v.resume()
        pass(2000)
        val n = ticks(scene)
        assertTrue("$n ticks in 2 s", n in 112..124)
        v.pause()
    }
}
