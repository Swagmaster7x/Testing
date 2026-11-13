package com.personal.tilesurge.ui

import android.graphics.Bitmap
import android.graphics.Canvas
import android.os.SystemClock
import android.view.MotionEvent
import android.view.View
import org.robolectric.RuntimeEnvironment
import java.io.File
import java.io.FileOutputStream

/** Helpers for the screen tests: build the game's view at a given size, touch it, and save what it draws. */
object Shots {
    val dir = File("build/outputs/screens")

    fun view(widthPx: Int, heightPx: Int, first: (App) -> Scene): GameView {
        val v = GameView(RuntimeEnvironment.getApplication(), first)
        v.measure(
            View.MeasureSpec.makeMeasureSpec(widthPx, View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(heightPx, View.MeasureSpec.EXACTLY),
        )
        v.layout(0, 0, widthPx, heightPx)
        return v
    }

    fun bitmap(v: GameView): Bitmap {
        val bmp = Bitmap.createBitmap(v.width, v.height, Bitmap.Config.ARGB_8888)
        v.draw(Canvas(bmp))
        return bmp
    }

    fun save(v: GameView, name: String): Bitmap {
        val bmp = bitmap(v)
        dir.mkdirs()
        FileOutputStream(File(dir, "$name.png")).use { bmp.compress(Bitmap.CompressFormat.PNG, 100, it) }
        return bmp
    }

    fun touch(v: GameView, action: Int, x: Float, y: Float) {
        val now = SystemClock.uptimeMillis()
        val e = MotionEvent.obtain(now, now, action, x, y, 0)
        v.dispatchTouchEvent(e)
        e.recycle()
    }

    fun tap(v: GameView, x: Float, y: Float) {
        touch(v, MotionEvent.ACTION_DOWN, x, y)
        touch(v, MotionEvent.ACTION_UP, x, y)
    }

    fun tap(v: GameView, b: Button) = tap(v, b.rect.centerX(), b.rect.centerY())
}
