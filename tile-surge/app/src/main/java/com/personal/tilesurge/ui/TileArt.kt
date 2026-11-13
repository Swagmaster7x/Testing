package com.personal.tilesurge.ui

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.LightingColorFilter
import android.graphics.LinearGradient
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.graphics.Shader
import kotlin.math.cos
import kotlin.math.sin

/**
 * The six tiles. Each has its own colour and its own symbol, so they can be told apart by shape alone:
 * 1 flame, 2 leaf, 3 drop, 4 bolt, 5 moon, 6 frost.
 *
 * Tiles are drawn once into bitmaps at the board's cell size and stamped from there every frame.
 */
class TileArt {

    companion object {
        const val KINDS = 6

        val BASE = intArrayOf(0, 0xFFEF4F50.toInt(), 0xFF2EB866.toInt(), 0xFF3A8DEE.toInt(), 0xFFF2AE1C.toInt(), 0xFF9163E8.toInt(), 0xFF27BDC6.toInt())
        val LIGHT = intArrayOf(0, 0xFFFF8F78.toInt(), 0xFF74E394.toInt(), 0xFF79BEFF.toInt(), 0xFFFFDA6B.toInt(), 0xFFC1A0FF.toInt(), 0xFF82ECE6.toInt())
        val DARK = intArrayOf(0, 0xFFA3283A.toInt(), 0xFF197546.toInt(), 0xFF1E55AB.toInt(), 0xFFB07006.toInt(), 0xFF5A37AB.toInt(), 0xFF137C89.toInt())

        /** The white part of each symbol, in a 100 x 100 box. */
        private val SYMBOL: Array<Path> = Array(KINDS + 1) { symbol(it) }

        /** The tinted detail drawn over the symbol (a flame's core, a leaf's vein, a drop's shine). */
        private val DETAIL: Array<Path?> = Array(KINDS + 1) { detail(it) }

        private fun symbol(kind: Int): Path = Path().apply {
            when (kind) {
                1 -> { // flame
                    moveTo(50f, 10f)
                    cubicTo(55f, 30f, 81f, 40f, 79f, 64f)
                    cubicTo(78f, 80f, 65f, 91f, 50f, 91f)
                    cubicTo(35f, 91f, 21f, 80f, 21f, 63f)
                    cubicTo(21f, 52f, 27f, 43f, 34f, 35f)
                    cubicTo(35f, 45f, 39f, 51f, 45f, 52f)
                    cubicTo(41f, 37f, 43f, 23f, 50f, 10f)
                    close()
                }
                2 -> { // leaf
                    moveTo(19f, 81f)
                    cubicTo(15f, 48f, 40f, 20f, 84f, 16f)
                    cubicTo(82f, 60f, 54f, 85f, 19f, 81f)
                    close()
                }
                3 -> { // drop
                    moveTo(50f, 9f)
                    cubicTo(54f, 20f, 80f, 44f, 80f, 63f)
                    cubicTo(80f, 80f, 66f, 92f, 50f, 92f)
                    cubicTo(34f, 92f, 20f, 80f, 20f, 63f)
                    cubicTo(20f, 44f, 46f, 20f, 50f, 9f)
                    close()
                }
                4 -> { // bolt
                    moveTo(61f, 7f)
                    lineTo(23f, 55f)
                    lineTo(46f, 55f)
                    lineTo(37f, 93f)
                    lineTo(79f, 41f)
                    lineTo(55f, 41f)
                    close()
                }
                5 -> { // moon
                    val outer = Path().apply { addCircle(46f, 52f, 37f, Path.Direction.CW) }
                    val bite = Path().apply { addCircle(63f, 40f, 31f, Path.Direction.CW) }
                    op(outer, bite, Path.Op.DIFFERENCE)
                }
                6 -> { // frost: six arms, each with a pair of short branches (stroked, not filled)
                    for (i in 0 until 6) {
                        val a = Math.toRadians(90.0 + 60.0 * i)
                        val dx = cos(a).toFloat()
                        val dy = -sin(a).toFloat()
                        moveTo(50f, 50f)
                        lineTo(50f + dx * 40f, 50f + dy * 40f)
                        for (side in intArrayOf(-1, 1)) {
                            val b = a + side * Math.toRadians(52.0)
                            val bx = 50f + dx * 24f
                            val by = 50f + dy * 24f
                            moveTo(bx, by)
                            lineTo(bx + cos(b).toFloat() * 14f, by - sin(b).toFloat() * 14f)
                        }
                    }
                }
            }
        }

        private fun detail(kind: Int): Path? = when (kind) {
            1 -> Path().apply { // the flame's core
                moveTo(50f, 56f)
                cubicTo(56f, 65f, 63f, 69f, 62f, 77f)
                cubicTo(61f, 84f, 56f, 87f, 50f, 87f)
                cubicTo(44f, 87f, 39f, 84f, 38f, 77f)
                cubicTo(37f, 69f, 44f, 65f, 50f, 56f)
                close()
            }
            2 -> Path().apply { // the leaf's vein (stroked)
                moveTo(26f, 74f)
                cubicTo(38f, 60f, 52f, 46f, 70f, 32f)
            }
            3 -> Path().apply { // the drop's shine (stroked)
                moveTo(33f, 64f)
                cubicTo(33f, 73f, 39f, 80f, 48f, 81f)
            }
            else -> null
        }

        private fun isStroked(kind: Int) = kind == 6
        private fun isDetailStroked(kind: Int) = kind == 2 || kind == 3

        /** Tints for the moments a tile is not shown plain. */
        val FLASH: ColorFilter = LightingColorFilter(0xFFFFFFFF.toInt(), 0x00808080)
        val LIT: ColorFilter = LightingColorFilter(0xFFFFFFFF.toInt(), 0x00343434)
        val DIM: ColorFilter = LightingColorFilter(0xFF4E4C70.toInt(), 0)
        val GREY: ColorFilter = ColorMatrixColorFilter(ColorMatrix().apply {
            setSaturation(0f)
            postConcat(ColorMatrix().apply { setScale(0.62f, 0.62f, 0.70f, 1f) })
        })
    }

    private val paint = Paint(Paint.ANTI_ALIAS_FLAG)
    private val stamp = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
    private val matrix = Matrix()
    private val scaled = Path()
    private val rect = RectF()
    private val dst = RectF()

    private var spriteSize = 0
    private val sprites = arrayOfNulls<Bitmap>(KINDS + 1)

    /** The face gradients for the size last painted with [paintTile]. */
    private var gradientSize = 0f
    private val gradients = arrayOfNulls<Shader>(KINDS + 1)

    /** Makes sure the bitmaps match the board's cell size. Cheap to call when nothing changed. */
    fun prepare(cellPx: Int) {
        if (cellPx == spriteSize || cellPx <= 0) return
        spriteSize = cellPx
        for (kind in 1..KINDS) {
            sprites[kind]?.recycle()
            val bmp = Bitmap.createBitmap(cellPx, cellPx, Bitmap.Config.ARGB_8888)
            paintTile(Canvas(bmp), kind, 0f, 0f, cellPx.toFloat())
            sprites[kind] = bmp
        }
    }

    /**
     * Stamps tile [kind] with its top-left at [left], [top], [width] by [height] pixels
     * (the two differ only while a tile squashes as it lands).
     */
    fun stamp(c: Canvas, kind: Int, left: Float, top: Float, width: Float, height: Float, filter: ColorFilter?, alpha: Int = 255) {
        val bmp = sprites[kind] ?: return
        stamp.colorFilter = filter
        stamp.alpha = alpha
        dst.set(left, top, left + width, top + height)
        c.drawBitmap(bmp, null, dst, stamp)
    }

    /** Draws tile [kind] straight from its shapes at any size. For menus, where only a few are on screen. */
    fun paintTile(c: Canvas, kind: Int, left: Float, top: Float, size: Float) {
        c.save()
        c.translate(left, top)
        paintAtOrigin(c, kind, size)
        c.restore()
    }

    private fun paintAtOrigin(c: Canvas, kind: Int, size: Float) {
        val left = 0f
        val top = 0f
        val pad = size * 0.04f
        val radius = size * 0.21f
        val lip = size * 0.075f
        val l = left + pad
        val t = top + pad
        val r = left + size - pad
        val b = top + size - pad
        if (gradientSize != size) {
            gradientSize = size
            gradients.fill(null)
        }

        // the darker edge the tile stands on
        paint.style = Paint.Style.FILL
        paint.shader = null
        paint.color = DARK[kind]
        rect.set(l, t + lip, r, b)
        c.drawRoundRect(rect, radius, radius, paint)

        // the face
        paint.shader = gradients[kind]
            ?: LinearGradient(0f, t, 0f, b - lip, LIGHT[kind], BASE[kind], Shader.TileMode.CLAMP).also { gradients[kind] = it }
        rect.set(l, t, r, b - lip)
        c.drawRoundRect(rect, radius, radius, paint)
        paint.shader = null

        // a soft shine across the top
        paint.color = 0x30FFFFFF
        rect.set(l + size * 0.07f, t + size * 0.045f, r - size * 0.07f, t + size * 0.30f)
        c.drawRoundRect(rect, radius * 0.66f, radius * 0.66f, paint)

        // the symbol: a shadow first, then white, then its tinted detail
        val box = size * 0.60f
        val ox = left + (size - box) / 2f
        val oy = top + (size - lip - box) / 2f
        matrix.reset()
        matrix.setScale(box / 100f, box / 100f)
        matrix.postTranslate(ox, oy + size * 0.028f)
        SYMBOL[kind].transform(matrix, scaled)
        symbolPaint(kind, size, Palette.withAlpha(DARK[kind], 0.75f))
        c.drawPath(scaled, paint)

        matrix.postTranslate(0f, -size * 0.028f)
        SYMBOL[kind].transform(matrix, scaled)
        symbolPaint(kind, size, 0xFFFFFFFF.toInt())
        c.drawPath(scaled, paint)

        val detail = DETAIL[kind]
        if (detail != null) {
            detail.transform(matrix, scaled)
            if (isDetailStroked(kind)) {
                paint.style = Paint.Style.STROKE
                paint.strokeWidth = size * 0.036f
                paint.strokeCap = Paint.Cap.ROUND
            } else {
                paint.style = Paint.Style.FILL
            }
            paint.color = if (kind == 1) LIGHT[4] else BASE[kind]
            c.drawPath(scaled, paint)
        }
        paint.style = Paint.Style.FILL
    }

    private fun symbolPaint(kind: Int, size: Float, color: Int) {
        paint.color = color
        if (isStroked(kind)) {
            paint.style = Paint.Style.STROKE
            paint.strokeWidth = size * 0.062f
            paint.strokeCap = Paint.Cap.ROUND
            paint.strokeJoin = Paint.Join.ROUND
        } else {
            // a hairline of the same colour rounds off sharp corners
            paint.style = Paint.Style.FILL_AND_STROKE
            paint.strokeWidth = size * 0.02f
            paint.strokeJoin = Paint.Join.ROUND
        }
    }
}
