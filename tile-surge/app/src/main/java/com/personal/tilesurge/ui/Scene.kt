package com.personal.tilesurge.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.RectF
import android.view.HapticFeedbackConstants
import android.view.MotionEvent

/** What every screen shares: the paints, the tile art, the saved records and the speaker. */
class App(val context: Context, val view: GameView) {
    val ui = Ui(context)
    val art = TileArt()
    val prefs = Prefs(context)
    val sound = Sound(context, prefs)

    fun go(scene: Scene) = view.show(scene)

    /** A short tick in the hand, if the player has it switched on. */
    fun buzz(strong: Boolean = false) {
        if (!prefs.buzz) return
        view.performHapticFeedback(if (strong) HapticFeedbackConstants.LONG_PRESS else HapticFeedbackConstants.KEYBOARD_TAP)
    }
}

/** One screen of the game. The view calls [tick] 60 times a second and [draw] whenever it repaints. */
abstract class Scene(val app: App) {
    protected val ui: Ui get() = app.ui
    protected val buttons = ArrayList<Button>()

    /** The whole view, in pixels. */
    var width = 0f
        private set
    var height = 0f
        private set

    /** The part of the view clear of the camera cut-out and any system bars. */
    val safe = RectF()

    /** One layout unit in pixels. */
    protected val u: Float get() = ui.unit

    /** The screens are laid out as a column 360 units wide, centred in the safe area. */
    protected val colLeft: Float get() = maxOf(safe.left, safe.centerX() - 180f * u)
    protected val colRight: Float get() = minOf(safe.right, safe.centerX() + 180f * u)

    private var held: Button? = null

    fun resize(w: Float, h: Float, safeArea: RectF) {
        width = w
        height = h
        safe.set(safeArea)
        layout()
    }

    protected abstract fun layout()

    open fun tick() {}

    abstract fun draw(c: Canvas)

    /** False lets the system handle Back (leave the app). */
    open fun onBack(): Boolean = false

    /** The app went into the background, or lost focus. */
    open fun onInterrupted() {}

    open val keepScreenOn: Boolean get() = false

    open fun onTouch(e: MotionEvent): Boolean = touchButtons(e)

    protected fun drawButtons(c: Canvas) {
        for (b in buttons) b.draw(c, ui)
    }

    /** Standard pressing of [buttons] with the first finger. */
    protected fun touchButtons(e: MotionEvent): Boolean {
        val slack = 6f * u
        when (e.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                held = null
                for (i in buttons.indices.reversed()) {
                    val b = buttons[i]
                    if (b.hit(e.x, e.y, slack)) {
                        held = b
                        b.pressed = true
                        break
                    }
                }
            }
            MotionEvent.ACTION_MOVE -> held?.let { it.pressed = it.hit(e.x, e.y, slack * 2.5f) }
            MotionEvent.ACTION_UP -> {
                val b = held
                held = null
                if (b != null) {
                    val inside = b.pressed && b.hit(e.x, e.y, slack * 2.5f)
                    b.pressed = false
                    if (inside) {
                        app.sound.play(Sfx.TAP)
                        b.onClick()
                    }
                }
            }
            MotionEvent.ACTION_CANCEL -> {
                held?.pressed = false
                held = null
            }
        }
        return true
    }

    protected fun releaseButtons() {
        held?.pressed = false
        held = null
    }
}
