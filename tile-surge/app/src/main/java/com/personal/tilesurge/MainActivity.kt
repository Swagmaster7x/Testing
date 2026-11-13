package com.personal.tilesurge

import android.annotation.SuppressLint
import android.app.Activity
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.view.WindowManager
import android.window.OnBackInvokedCallback
import android.window.OnBackInvokedDispatcher
import com.personal.tilesurge.ui.GameView
import com.personal.tilesurge.ui.TitleScene

class MainActivity : Activity() {

    private lateinit var view: GameView

    /** Android 13 and up: registered only while the game wants Back for itself. */
    private var backCallback: OnBackInvokedCallback? = null
    private var backRegistered = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.attributes = window.attributes.apply {
                layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES
            }
        }
        // Draw behind where the system bars would be. (Android 15 and up do this by themselves.)
        @Suppress("DEPRECATION")
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) window.setDecorFitsSystemWindows(false)

        // the volume keys turn the game's sounds up and down, not the ringer
        volumeControlStream = AudioManager.STREAM_MUSIC

        view = GameView(this)
        setContentView(view)
        hideSystemBars()

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            backCallback = OnBackInvokedCallback { view.back() }
        }
        view.onSceneChanged = { scene -> setOwnsBack(scene !is TitleScene) }
        setOwnsBack(view.scene !is TitleScene)
    }

    /** On the title screen Back leaves the app as usual; everywhere else it goes back a screen or pauses. */
    private fun setOwnsBack(owns: Boolean) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) return
        val cb = backCallback ?: return
        if (owns && !backRegistered) {
            onBackInvokedDispatcher.registerOnBackInvokedCallback(OnBackInvokedDispatcher.PRIORITY_DEFAULT, cb)
            backRegistered = true
        } else if (!owns && backRegistered) {
            onBackInvokedDispatcher.unregisterOnBackInvokedCallback(cb)
            backRegistered = false
        }
    }

    /**
     * Android 12 and older only. From Android 13 the system calls [backCallback] instead
     * (the manifest opts in), so nothing here needs the AndroidX back dispatcher lint suggests.
     */
    @Deprecated("Used on Android 12 and older, where the callback above does not exist.")
    @Suppress("DEPRECATION", "OVERRIDE_DEPRECATION")
    @SuppressLint("GestureBackNavigation")
    override fun onBackPressed() {
        if (!view.back()) super.onBackPressed()
    }

    override fun onResume() {
        super.onResume()
        view.resume()
    }

    override fun onPause() {
        view.pause()
        super.onPause()
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) hideSystemBars() else view.interrupted()
    }

    override fun onDestroy() {
        view.app.sound.release()
        super.onDestroy()
    }

    /** Full screen: the status and navigation bars stay away until the player swipes them in. */
    @Suppress("DEPRECATION")
    private fun hideSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.insetsController?.let {
                it.hide(WindowInsets.Type.systemBars())
                it.systemBarsBehavior = WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            }
        } else {
            window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        }
    }
}
