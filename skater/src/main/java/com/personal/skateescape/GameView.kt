package com.personal.skateescape

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.Canvas
import android.view.HapticFeedbackConstants
import android.view.KeyEvent
import android.view.MotionEvent
import android.view.View
import com.personal.skateescape.game.Event
import com.personal.skateescape.game.Gesture
import com.personal.skateescape.game.Phase
import com.personal.skateescape.game.Swipe
import com.personal.skateescape.game.World
import kotlin.math.abs

/** Runs the game loop, turns touches into swipes and traced shapes, and draws each frame. */
@SuppressLint("ViewConstructor")
class GameView(context: Context, private val sfx: Sfx) : View(context) {
    val world = World()
    private val renderer = Renderer()
    private val prefs = context.getSharedPreferences("skate", Context.MODE_PRIVATE)

    private var lastFrame = 0L
    private var running = false

    // The current finger stroke, as x,y pairs.
    private val stroke = FloatArray(MAX_POINTS * 2)
    private var strokeCount = 0
    private var strokeIsShape = false
    private var swiped = false
    private var downX = 0f
    private var downY = 0f
    private val swipeDistance = 22f * resources.displayMetrics.density

    init {
        isFocusable = true
        isFocusableInTouchMode = true
        world.best = prefs.getInt("best", 0)
        sfx.enabled = prefs.getBoolean("sound", true)
        renderer.soundOn = sfx.enabled
    }

    fun resume() {
        running = true
        lastFrame = 0L
        invalidate()
    }

    fun pause() {
        running = false
        if (world.phase == Phase.RUNNING) world.paused = true
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        renderer.resize(w, h)
    }

    override fun onDraw(canvas: Canvas) {
        val now = System.nanoTime()
        val dt = if (lastFrame == 0L) 0f else (now - lastFrame) / 1e9f
        lastFrame = now
        world.update(dt)
        handleEvents()
        if (!world.trickWindow && strokeIsShape && strokeCount > 0) strokeCount = 0
        renderer.draw(canvas, world, stroke, if (strokeIsShape) strokeCount else 0)
        if (running) postInvalidateOnAnimation()
    }

    private fun handleEvents() {
        val events = world.events
        if (events.isEmpty()) return
        for (e in events) {
            sfx.play(e)
            when (e) {
                Event.STUMBLE, Event.CRASH -> performHapticFeedback(HapticFeedbackConstants.LONG_PRESS)
                Event.TRICK, Event.POWER, Event.RAMP -> performHapticFeedback(HapticFeedbackConstants.KEYBOARD_TAP)
                Event.OVER -> prefs.edit().putInt("best", world.best).apply()
                else -> Unit
            }
        }
        events.clear()
    }

    @SuppressLint("ClickableViewAccessibility")
    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                downX = event.x; downY = event.y
                swiped = false
                strokeCount = 0
                strokeIsShape = world.phase == Phase.RUNNING && world.trickWindow && !world.paused
                addPoint(event.x, event.y)
            }
            MotionEvent.ACTION_MOVE -> {
                for (i in 0 until event.historySize) addPoint(event.getHistoricalX(i), event.getHistoricalY(i))
                addPoint(event.x, event.y)
                // On the ground a swipe acts the moment it is long enough; in the air the whole
                // stroke is kept so it can be read as a shape when the finger lifts.
                if (!strokeIsShape && !swiped) trySwipe(event.x - downX, event.y - downY)
            }
            MotionEvent.ACTION_UP -> {
                addPoint(event.x, event.y)
                val dx = event.x - downX
                val dy = event.y - downY
                if (strokeIsShape) {
                    if (Gesture.isStraight(stroke, strokeCount)) trySwipe(dx, dy) else world.trick(Gesture.recognise(stroke, strokeCount))
                } else if (!swiped && abs(dx) < swipeDistance && abs(dy) < swipeDistance) {
                    tap(event.x, event.y)
                }
                strokeCount = 0
                strokeIsShape = false
            }
            MotionEvent.ACTION_CANCEL -> {
                strokeCount = 0
                strokeIsShape = false
            }
        }
        return true
    }

    private fun addPoint(x: Float, y: Float) {
        if (strokeCount >= MAX_POINTS) return
        stroke[strokeCount * 2] = x
        stroke[strokeCount * 2 + 1] = y
        strokeCount++
    }

    private fun trySwipe(dx: Float, dy: Float) {
        if (abs(dx) < swipeDistance && abs(dy) < swipeDistance) return
        swiped = true
        if (world.paused) return
        world.swipe(
            if (abs(dx) > abs(dy)) (if (dx > 0) Swipe.RIGHT else Swipe.LEFT)
            else (if (dy > 0) Swipe.DOWN else Swipe.UP)
        )
    }

    private fun tap(x: Float, y: Float) {
        val corner = renderer.cornerButton.contains(x, y)
        when (world.phase) {
            Phase.TITLE -> if (corner) {
                sfx.enabled = !sfx.enabled
                renderer.soundOn = sfx.enabled
                prefs.edit().putBoolean("sound", sfx.enabled).apply()
            } else {
                world.start()
            }
            Phase.RUNNING -> if (world.paused) world.paused = false else if (corner) world.paused = true
            Phase.OVER -> world.start()
            Phase.CAUGHT -> Unit
        }
    }

    /** Arrow keys and space, for emulators and keyboards. */
    override fun onKeyDown(keyCode: Int, event: KeyEvent): Boolean {
        when (keyCode) {
            KeyEvent.KEYCODE_DPAD_LEFT -> world.swipe(Swipe.LEFT)
            KeyEvent.KEYCODE_DPAD_RIGHT -> world.swipe(Swipe.RIGHT)
            KeyEvent.KEYCODE_DPAD_UP, KeyEvent.KEYCODE_SPACE -> {
                if (world.phase == Phase.TITLE || world.phase == Phase.OVER) world.start() else world.swipe(Swipe.UP)
            }
            KeyEvent.KEYCODE_DPAD_DOWN -> world.swipe(Swipe.DOWN)
            else -> return super.onKeyDown(keyCode, event)
        }
        return true
    }

    /** Back pauses a run, or leaves a finished one for the title screen. Returns false to exit. */
    fun onBack(): Boolean = when {
        world.phase == Phase.RUNNING && !world.paused -> { world.paused = true; true }
        world.phase == Phase.OVER -> { world.toTitle(); true }
        else -> false
    }

    private companion object {
        const val MAX_POINTS = 512
    }
}
