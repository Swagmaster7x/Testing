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

/** The blocker's place in the sprite list, after the six tiles. */
        const val BLOCK = 7

        /** The tile sets the shop sells. Each is six base colours; lighter and darker shades are worked out. */
        val THEME_NAMES = arrayOf("Classic", "Candy", "Neon", "Dusk")
        private val THEME_BASES = arrayOf(
            intArrayOf(0xFFEF4F50.toInt(), 0xFF2EB866.toInt(), 0xFF3A8DEE.toInt(), 0xFFF2AE1C.toInt(), 0xFF9163E8.toInt(), 0xFF27BDC6.toInt()),
            intArrayOf(0xFFFF7FA8.toInt(), 0xFF6FD28E.toInt(), 0xFF6DB6F7.toInt(), 0xFFF7C64F.toInt(), 0xFFBE96F5.toInt(), 0xFF6FD8D4.toInt()),
            intArrayOf(0xFFFF2E63.toInt(), 0xFF00C853.toInt(), 0xFF2979FF.toInt(), 0xFFFFC400.toInt(), 0xFFD500F9.toInt(), 0xFF00B8D4.toInt()),
            intArrayOf(0xFFC96B5B.toInt(), 0xFF7FA36B.toInt(), 0xFF5B7FA6.toInt(), 0xFFC9A24B.toInt(), 0xFF8B6FAE.toInt(), 0xFF5FA6A0.toInt()),
        )

        /** Which tile set is in use. Sprites notice a change the next time they are prepared or stamped. */
        var theme = 0
            set(v) {
                field = v.coerceIn(0, THEME_BASES.size - 1)
                BASE = shades(0f)
                LIGHT = shades(0.36f)
                DARK = shades(-0.34f)
            }

        private fun shades(amount: Float): IntArray = IntArray(BLOCK + 1) { k ->
            val base = when (k) {
                0 -> 0
                BLOCK -> 0xFF858AA0.toInt()
                else -> THEME_BASES[theme][k - 1]
            }
            if (k == 0) 0 else if (amount >= 0f) Palette.mix(base, 0xFFFFFFFF.toInt(), amount) else Palette.mix(base, 0xFF000000.toInt(), -amount)
        }

        var BASE = shades(0f)
            private set
        var LIGHT = shades(0.36f)
            private set
        var DARK = shades(-0.34f)
            private set

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
    private val sprites = arrayOfNulls<Bitmap>(BLOCK + 1)
    private var spriteTheme = -1

    /** The face gradients for the size last painted with [paintTile]. */
    private var gradientSize = 0f
    private val gradients = arrayOfNulls<Shader>(BLOCK + 1)

    /** Makes sure the bitmaps match the board's cell size. Cheap to call when nothing changed. */
    fun prepare(cellPx: Int) {
        if (cellPx <= 0 || (cellPx == spriteSize && spriteTheme == theme)) return
        spriteSize = cellPx
        spriteTheme = theme
        gradients.fill(null)
        for (kind in 1..BLOCK) {
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
        if (spriteTheme != theme) prepare(spriteSize)
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

        if (kind == BLOCK) {
            // a blocker is a plain slab with two grooves across it
            paint.color = Palette.withAlpha(DARK[kind], 0.55f)
            for (i in 1..2) {
                val y = t + (b - lip - t) * i / 3f
                rect.set(l + size * 0.14f, y - size * 0.022f, r - size * 0.14f, y + size * 0.022f)
                c.drawRoundRect(rect, size * 0.02f, size * 0.02f, paint)
            }
            return
        }
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

    /** Ice over a frozen tile. */
    fun drawFrozen(c: Canvas, left: Float, top: Float, w: Float, h: Float) {
        val pad = w * 0.04f
        val radius = w * 0.21f
        paint.shader = null
        paint.style = Paint.Style.FILL
        paint.color = 0x8CCFEFFF.toInt()
        rect.set(left + pad, top + pad, left + w - pad, top + h - pad)
        c.drawRoundRect(rect, radius, radius, paint)
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = w * 0.05f
        paint.color = 0xE6FFFFFF.toInt()
        c.drawRoundRect(rect, radius, radius, paint)
        paint.strokeCap = Paint.Cap.ROUND
        c.drawLine(left + w * 0.22f, top + h * 0.40f, left + w * 0.40f, top + h * 0.22f, paint)
        c.drawLine(left + w * 0.60f, top + h * 0.78f, left + w * 0.78f, top + h * 0.60f, paint)
        paint.style = Paint.Style.FILL
    }

    /** The glow round a surge tile. [beat] 0..1 makes it throb. */
    fun drawPower(c: Canvas, left: Float, top: Float, w: Float, h: Float, beat: Float, alpha: Float = 1f) {
        val pad = w * 0.02f
        val radius = w * 0.22f
        paint.shader = null
        paint.style = Paint.Style.STROKE
        paint.strokeWidth = w * (0.07f + 0.03f * beat)
        paint.color = Palette.withAlpha(0xFFFFFFFF.toInt(), alpha * (0.75f + 0.25f * beat))
        rect.set(left + pad, top + pad, left + w - pad, top + h - pad)
        c.drawRoundRect(rect, radius, radius, paint)
        paint.strokeWidth = w * 0.03f
        paint.color = Palette.withAlpha(Palette.ACCENT, alpha)
        c.drawRoundRect(rect, radius, radius, paint)
        // arrows out to both sides: the whole row goes
        paint.style = Paint.Style.FILL
        paint.color = Palette.withAlpha(0xFFFFFFFF.toInt(), alpha)
        val cy = top + h * 0.5f
        for (side in intArrayOf(-1, 1)) {
            val x = left + w * 0.5f + side * w * 0.40f
            scaled.rewind()
            scaled.moveTo(x + side * w * 0.09f, cy)
            scaled.lineTo(x - side * w * 0.03f, cy - h * 0.10f)
            scaled.lineTo(x - side * w * 0.03f, cy + h * 0.10f)
            scaled.close()
            c.drawPath(scaled, paint)
        }
    }
}
