package com.personal.tilesurge.ui

import android.os.SystemClock
import android.view.InputDevice
import android.view.MotionEvent
import com.personal.tilesurge.core.Bot

/** Sends the view the same touch events a touch screen would, for one or more fingers at once. */
class Fingers(private val v: GameView) {
    private val ids = ArrayList<Int>()
    private val xs = HashMap<Int, Float>()
    private val ys = HashMap<Int, Float>()
    private var downTime = 0L

    fun down(id: Int, x: Float, y: Float) {
        check(id !in ids) { "finger $id is already down" }
        xs[id] = x
        ys[id] = y
        ids += id
        if (ids.size == 1) {
            downTime = SystemClock.uptimeMillis()
            send(MotionEvent.ACTION_DOWN)
        } else {
            send(MotionEvent.ACTION_POINTER_DOWN or (ids.indexOf(id) shl MotionEvent.ACTION_POINTER_INDEX_SHIFT))
        }
    }

    fun move(id: Int, x: Float, y: Float) {
        check(id in ids) { "finger $id is not down" }
        xs[id] = x
        ys[id] = y
        send(MotionEvent.ACTION_MOVE)
    }

    fun up(id: Int) {
        check(id in ids) { "finger $id is not down" }
        if (ids.size == 1) {
            send(MotionEvent.ACTION_UP)
        } else {
            send(MotionEvent.ACTION_POINTER_UP or (ids.indexOf(id) shl MotionEvent.ACTION_POINTER_INDEX_SHIFT))
        }
        ids.remove(id)
    }

    fun cancel() {
        if (ids.isEmpty()) return
        send(MotionEvent.ACTION_CANCEL)
        ids.clear()
    }

    fun isDown(id: Int) = id in ids

    private fun send(action: Int) {
        val props = Array(ids.size) { i ->
            MotionEvent.PointerProperties().apply {
                id = ids[i]
                toolType = MotionEvent.TOOL_TYPE_FINGER
            }
        }
        val coords = Array(ids.size) { i ->
            MotionEvent.PointerCoords().apply {
                x = xs.getValue(ids[i])
                y = ys.getValue(ids[i])
                pressure = 1f
                size = 1f
            }
        }
        val e = MotionEvent.obtain(downTime, SystemClock.uptimeMillis(), action, ids.size, props, coords,
            0, 0, 1f, 1f, 0, 0, InputDevice.SOURCE_TOUCHSCREEN, 0)
        v.dispatchTouchEvent(e)
        e.recycle()
    }
}

/**
 * Lets the test [Bot] play through the screen: finger 0 slides tiles, finger 1 holds the raise button.
 * Nothing here calls the game directly, so a whole game played this way proves the touch handling.
 */
class TouchHands(private val v: GameView) : Bot.Hands {
    val fingers = Fingers(v)
    private val scene: PlayScene get() = v.scene as PlayScene
    private var y = 0f

    override fun grab(row: Int, col: Int): Boolean {
        val b = scene.board
        if (fingers.isDown(0)) fingers.up(0)
        y = b.cellTop(scene.game, row) + b.cell / 2f
        fingers.down(0, b.cellLeft(col) + b.cell / 2f, y)
        if (scene.game.grabbedId == 0) {
            fingers.up(0)
            return false
        }
        return true
    }

    override fun dragTo(col: Int) {
        val b = scene.board
        if (fingers.isDown(0)) fingers.move(0, b.cellLeft(col) + b.cell / 2f, y)
    }

    override fun release() {
        if (fingers.isDown(0)) fingers.up(0)
    }

    override fun raise(held: Boolean) {
        if (held == fingers.isDown(1)) return
        val r = scene.raiseRect
        if (held) fingers.down(1, r.centerX(), r.centerY()) else fingers.up(1)
    }
}
