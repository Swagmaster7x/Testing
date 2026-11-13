package com.personal.tilesurge

import android.content.pm.ActivityInfo
import android.media.AudioManager
import android.os.Build
import android.os.Looper
import android.view.ViewGroup
import android.view.WindowManager
import android.window.OnBackInvokedCallback
import com.personal.tilesurge.core.Difficulty
import com.personal.tilesurge.core.Game
import com.personal.tilesurge.ui.GameView
import com.personal.tilesurge.ui.HowToScene
import com.personal.tilesurge.ui.PlayScene
import com.personal.tilesurge.ui.Setup
import com.personal.tilesurge.ui.StageSelectScene
import com.personal.tilesurge.ui.TitleScene
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.RobolectricTestRunner
import org.robolectric.RuntimeEnvironment
import org.robolectric.Shadows.shadowOf
import org.robolectric.android.controller.ActivityController
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode
import org.robolectric.shadows.ShadowChoreographer
import org.robolectric.shadows.ShadowSystemClock
import java.time.Duration

/**
 * The activity itself, on the oldest Android the game supports and on several newer ones:
 * it starts, runs, pauses when the app leaves the front, and handles Back the right way for each version.
 */
@RunWith(RobolectricTestRunner::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [26, 29, 31, 33, 35], qualifiers = "w360dp-h780dp-xhdpi")
class MainActivityTest {

    private lateinit var controller: ActivityController<MainActivity>
    private val activity: MainActivity get() = controller.get()
    private val view: GameView
        get() = activity.findViewById<ViewGroup>(android.R.id.content).getChildAt(0) as GameView

    @Before
    fun start() {
        // See LoopTest: time is moved by hand, or a view that redraws for ever would never let the looper rest.
        ShadowChoreographer.setPaused(true)
        ShadowChoreographer.setFrameDelay(Duration.ofMillis(16))
        // The manifest opts in to the Android 13+ way of delivering Back (enableOnBackInvokedCallback).
        // Robolectric does not carry that flag over from the manifest, so set it as a phone would have it.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            val info = RuntimeEnvironment.getApplication().applicationInfo
            info.javaClass.getMethod("setEnableOnBackInvokedCallback", Boolean::class.javaPrimitiveType).invoke(info, true)
        }
        // not the first launch: the lessons have been seen
        RuntimeEnvironment.getApplication().getSharedPreferences("tilesurge", 0).edit().putBoolean("lessons_done", true).commit()
        controller = Robolectric.buildActivity(MainActivity::class.java).setup()
    }

    private fun pass(millis: Long) {
        var t = 0L
        while (t < millis) {
            ShadowSystemClock.advanceBy(Duration.ofMillis(16))
            shadowOf(Looper.getMainLooper()).idle()
            t += 16
        }
    }

    /**
     * Android 13 and up: the Back callback the system would call right now. With none of the game's own
     * registered, that is the activity's built-in one. (The window keeps the list; there is no public way to ask.)
     */
    private fun topBackCallback(): Any? {
        val root = android.view.View::class.java.getMethod("getViewRootImpl").invoke(activity.window.decorView)
        val dispatcher = root.javaClass.getMethod("getOnBackInvokedDispatcher").invoke(root)
        return dispatcher.javaClass.getMethod("getTopCallback").invoke(dispatcher)
    }

    /** Presses Back the way this version of Android would deliver it to the game. */
    private fun pressBackInGame() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            (topBackCallback() as OnBackInvokedCallback).onBackInvoked()
        } else {
            @Suppress("DEPRECATION")
            activity.onBackPressed()
        }
    }

    @Test(timeout = 120_000)
    fun `it opens on the title screen with the window set up for a game`() {
        assertTrue(view.scene is TitleScene)
        pass(100) // the first layout happens on the first frame
        assertTrue("view is ${view.width} x ${view.height}", view.width > 0 && view.height > 0)
        val attrs = activity.window.attributes
        assertEquals(60f, attrs.preferredRefreshRate, 0.01f)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            assertEquals(WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES, attrs.layoutInDisplayCutoutMode)
        }
        assertEquals(AudioManager.STREAM_MUSIC, activity.volumeControlStream)
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, activity.requestedOrientation)
        assertFalse(view.keepScreenOn)
    }

    @Test(timeout = 120_000)
    @Config(qualifiers = "w800dp-h1280dp-mdpi")
    fun `a tablet is free to turn`() {
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED, activity.requestedOrientation)
        // folded down to a phone-sized screen, it is held upright again
        val small = android.content.res.Configuration(activity.resources.configuration)
        small.smallestScreenWidthDp = 360
        activity.onConfigurationChanged(small)
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT, activity.requestedOrientation)
        val big = android.content.res.Configuration(small)
        big.smallestScreenWidthDp = 700
        activity.onConfigurationChanged(big)
        assertEquals(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED, activity.requestedOrientation)
    }

    @Test(timeout = 120_000)
    fun `the game runs while the app is in front and stops when it is not`() {
        view.show(PlayScene(view.app, Setup.Infinite(Difficulty.NORMAL, 1), 4L))
        val scene = view.scene as PlayScene
        pass(2500)
        assertTrue("frames played: ${scene.game.frames}", scene.game.frames > 60)
        assertTrue(view.keepScreenOn)

        controller.pause()
        assertTrue(scene.isPaused)
        assertFalse(view.keepScreenOn)
        val frames = scene.game.frames
        pass(1000)
        assertEquals(frames, scene.game.frames)

        controller.resume()
        pass(500)
        assertTrue("still paused until the player says otherwise", scene.isPaused)
        assertEquals(frames, scene.game.frames)
    }

    @Test(timeout = 120_000)
    fun `losing focus pauses a game`() {
        view.show(PlayScene(view.app, Setup.Infinite(Difficulty.NORMAL, 1), 4L))
        val scene = view.scene as PlayScene
        pass(Game.COUNTDOWN_FRAMES * 17L + 200)
        assertFalse(scene.isPaused)
        activity.onWindowFocusChanged(false)
        assertTrue(scene.isPaused)
        activity.onWindowFocusChanged(true)
        assertTrue(scene.isPaused)
    }

    @Test(timeout = 120_000)
    fun `Back is left to the system on the title screen and handled by the game everywhere else`() {
        pass(100)
        val modern = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU
        // On Android 13 and up, whatever is on top while the title shows is the system's own handler.
        val systems = if (modern) topBackCallback() else null

        view.show(StageSelectScene(view.app))
        if (modern) assertTrue("the game's Back handler should be registered", topBackCallback() !== systems)
        pressBackInGame()
        assertTrue(view.scene is TitleScene)
        assertFalse(activity.isFinishing)
        if (modern) assertTrue("the game's Back handler should be gone again", topBackCallback() === systems)

        view.show(HowToScene(view.app))
        pressBackInGame()
        assertTrue(view.scene is TitleScene)

        // in a game: Back pauses, Back again resumes
        view.show(PlayScene(view.app, Setup.Stage(1), 4L))
        val scene = view.scene as PlayScene
        pass(Game.COUNTDOWN_FRAMES * 17L + 200)
        pressBackInGame()
        assertTrue(scene.isPaused)
        assertFalse(activity.isFinishing)
        pressBackInGame()
        assertFalse(scene.isPaused)

        // and from the title, Back is the system's again; before Android 13 that means the activity closes
        view.show(TitleScene(view.app))
        if (modern) {
            assertTrue(topBackCallback() === systems)
        } else {
            @Suppress("DEPRECATION")
            activity.onBackPressed()
            assertTrue(activity.isFinishing)
        }
    }

    @Test(timeout = 120_000)
    fun `the very first launch opens on the lessons, and after them on the title`() {
        controller.pause().stop().destroy()
        val prefs = RuntimeEnvironment.getApplication().getSharedPreferences("tilesurge", 0)
        prefs.edit().clear().commit()
        val first = Robolectric.buildActivity(MainActivity::class.java).setup()
        val v = first.get().findViewById<ViewGroup>(android.R.id.content).getChildAt(0) as GameView
        assertEquals(1, ((v.scene as PlayScene).setup as Setup.Lesson).number)
        // skipping them from the pause panel counts as having seen them
        (v.scene as PlayScene).pause()
        com.personal.tilesurge.ui.Shots.tap(v, (v.scene as PlayScene).quitButton)
        assertTrue(v.scene is TitleScene)
        first.pause().stop().destroy()
        val second = Robolectric.buildActivity(MainActivity::class.java).setup()
        val v2 = second.get().findViewById<ViewGroup>(android.R.id.content).getChildAt(0) as GameView
        assertTrue(v2.scene is TitleScene)
        second.pause().stop().destroy()
        controller = Robolectric.buildActivity(MainActivity::class.java).setup()
    }

    @Test(timeout = 120_000)
    fun `it shuts down cleanly and starts again`() {
        view.show(PlayScene(view.app, Setup.Infinite(Difficulty.NORMAL, 1), 4L))
        pass(300)
        controller.pause().stop().destroy()
        val again = Robolectric.buildActivity(MainActivity::class.java).setup()
        val v = again.get().findViewById<ViewGroup>(android.R.id.content).getChildAt(0) as GameView
        assertTrue(v.scene is TitleScene)
        again.pause().stop().destroy()
    }
}
