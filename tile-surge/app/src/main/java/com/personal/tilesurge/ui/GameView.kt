package com.personal.tilesurge.ui

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.graphics.Rect
import android.graphics.RectF
import android.os.Build
import android.view.Choreographer
import android.view.MotionEvent
import android.view.View
import android.view.WindowInsets
import kotlin.math.abs

/**
 * The one view of the app. It owns the current [Scene], runs the game clock at a steady
 * 60 ticks a second whatever the screen's refresh rate, and passes touches on.
 */
@SuppressLint("ViewConstructor")
class GameView(context: Context, firstScene: ((App) -> Scene)? = null) : View(context) {

    val app = App(context, this)
    var scene: Scene = firstScene?.invoke(app) ?: TitleScene(app)
        private set

    /** Told whenever the screen changes, so the activity can decide who handles Back. */
    var onSceneChanged: ((Scene) -> Unit)? = null

    private val insets = Rect()
    private val safe = RectF()
    private val exclusion = listOf(Rect())

    private var running = false
    private var lastNanos = 0L
    private var owedNanos = 0L

    private val frame = object : Choreographer.FrameCallback {
        override fun doFrame(now: Long) {
            if (!running) return
            if (lastNanos != 0L) {
                val passed = now - lastNanos
                // On a screen that refreshes at very nearly the game's own rate, play exactly one tick a
                // frame. Otherwise the small mismatch would drop or double a tick every few seconds.
                owedNanos += if (abs(passed - TICK_NANOS) < TICK_NANOS * 3 / 100) TICK_NANOS else minOf(passed, MAX_CATCH_UP)
            }
            lastNanos = now
            var steps = 0
            while (owedNanos >= TICK_NANOS && steps < MAX_STEPS) {
                scene.tick()
                owedNanos -= TICK_NANOS
                steps++
            }
            if (steps == MAX_STEPS) owedNanos = 0
            if (steps > 0) {
                invalidate()
                syncAwake()
            }
            Choreographer.getInstance().postFrameCallback(this)
        }
    }

    init {
        isHapticFeedbackEnabled = true
        isSoundEffectsEnabled = false
        contentDescription = "Tile Surge"
        // The game moves sixty times a second; tell screens that can vary their rate that this is all it needs.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.VANILLA_ICE_CREAM) requestedFrameRate = 60f
    }

    /** The screen is kept awake only while a game is actually running. */
    private fun syncAwake() {
        val awake = scene.keepScreenOn
        if (keepScreenOn != awake) keepScreenOn = awake
    }

    fun show(next: Scene) {
        scene = next
        relayout()
        syncAwake()
        onSceneChanged?.invoke(next)
        invalidate()
    }

    /** Starts the clock. Called when the app comes to the front. */
    fun resume() {
        if (running) return
        running = true
        lastNanos = 0L
        owedNanos = 0L
        Choreographer.getInstance().postFrameCallback(frame)
    }

    /** Stops the clock. Called when the app leaves the front. */
    fun pause() {
        running = false
        Choreographer.getInstance().removeFrameCallback(frame)
        scene.onInterrupted()
        syncAwake()
        invalidate()
    }

    /** The app is still in front but something covered it (the notification shade, a dialog). */
    fun interrupted() {
        scene.onInterrupted()
        syncAwake()
        invalidate()
    }

    fun back(): Boolean = scene.onBack()

    /** Runs the clock by hand. For tests. */
    fun step(ticks: Int) {
        repeat(ticks) { scene.tick() }
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        relayout()
    }

    @Suppress("DEPRECATION")
    override fun onApplyWindowInsets(wi: WindowInsets): WindowInsets {
        // Keep clear of the camera cut-out, and of the system bars whenever they are showing.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            val i = wi.getInsets(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
            insets.set(i.left, i.top, i.right, i.bottom)
        } else {
            insets.set(wi.systemWindowInsetLeft, wi.systemWindowInsetTop, wi.systemWindowInsetRight, wi.systemWindowInsetBottom)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                wi.displayCutout?.let {
                    insets.left = maxOf(insets.left, it.safeInsetLeft)
                    insets.top = maxOf(insets.top, it.safeInsetTop)
                    insets.right = maxOf(insets.right, it.safeInsetRight)
                    insets.bottom = maxOf(insets.bottom, it.safeInsetBottom)
                }
            }
        }
        relayout()
        return wi
    }

    private fun relayout() {
        val w = width.toFloat()
        val h = height.toFloat()
        if (w <= 0f || h <= 0f) return
        safe.set(insets.left.toFloat(), insets.top.toFloat(), w - insets.right, h - insets.bottom)
        if (safe.width() < w * 0.5f || safe.height() < h * 0.5f) safe.set(0f, 0f, w, h)
        // One unit is 1/360 of the width on a phone; on short or wide windows the height sets it instead.
        app.ui.unit = minOf(safe.width() / 360f, safe.height() / 640f)
        scene.resize(w, h, safe)
        // The whole view is play area: do not let an edge swipe meant for a tile go Back instead.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            exclusion[0].set(0, 0, width, height)
            systemGestureExclusionRects = exclusion
        }
    }

    override fun onDraw(canvas: Canvas) {
        scene.draw(canvas)
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        val handled = scene.onTouch(event)
        if (!running) invalidate()
        return handled
    }

    private companion object {
        const val TICK_NANOS = 1_000_000_000L / 60
        const val MAX_STEPS = 5
        const val MAX_CATCH_UP = 100_000_000L
    }
}
