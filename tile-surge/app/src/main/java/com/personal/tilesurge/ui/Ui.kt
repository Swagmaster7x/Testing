package com.personal.tilesurge.ui

import android.content.Context
import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.Typeface
import com.personal.tilesurge.R

/** The game's colours. */
object Palette {
    const val BG_TOP = 0xFF1D1846.toInt()
    const val BG_BOTTOM = 0xFF0C0A20.toInt()
    const val WELL = 0xE608071A.toInt()
    const val WELL_LINE = 0x10FFFFFF
    const val PANEL = 0xFF272158.toInt()
    const val PANEL_DARK = 0xFF15112F.toInt()
    const val PANEL_LIGHT = 0xFF3A3280.toInt()
    const val OUTLINE = 0xFF4E45A0.toInt()
    const val TEXT = 0xFFF6F3FF.toInt()
    const val TEXT_DIM = 0xFFACA5DC.toInt()
    const val TEXT_DARK = 0xFF2A1B05.toInt()
    const val ACCENT = 0xFFFFC53D.toInt()
    const val ACCENT_DARK = 0xFFC8860B.toInt()
    const val ACCENT_LIGHT = 0xFFFFE08A.toInt()
    const val TEAL = 0xFF4FD8CC.toInt()
    const val TEAL_DARK = 0xFF1F8F8C.toInt()
    const val DANGER = 0xFFFF5D5D.toInt()
    const val GOOD = 0xFF62E08E.toInt()
    const val SHADE = 0xB3070616.toInt()

    fun withAlpha(color: Int, alpha: Float): Int {
        val a = (alpha.coerceIn(0f, 1f) * (color ushr 24)).toInt()
        return (a shl 24) or (color and 0x00FFFFFF)
    }

    /** A colour between [a] and [b]; [t] 0 gives [a], 1 gives [b]. */
    fun mix(a: Int, b: Int, t: Float): Int {
        val u = t.coerceIn(0f, 1f)
        fun ch(shift: Int): Int {
            val x = (a ushr shift) and 0xFF
            val y = (b ushr shift) and 0xFF
            return (x + (y - x) * u).toInt() and 0xFF
        }
        return (ch(24) shl 24) or (ch(16) shl 16) or (ch(8) shl 8) or ch(0)
    }
}

/** Shared paints, fonts and small drawing helpers. Everything on screen is drawn through this. */
class Ui(context: Context) {
    val bold: Typeface = font(context, R.font.fredoka_700)
    val semi: Typeface = font(context, R.font.fredoka_600)

    /** Pixels per layout unit. A phone screen is about 360 units wide; set by the view when it is measured. */
    var unit = context.resources.displayMetrics.density

    val fill = Paint(Paint.ANTI_ALIAS_FLAG)
    val line = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
    }
    val textPaint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.SUBPIXEL_TEXT_FLAG)
    val bitmapPaint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG)
    val rect = RectF()
    val path = Path()

    private var bgShader: Shader? = null
    private var bgHeight = 0f

    private fun font(context: Context, id: Int): Typeface = try {
        context.resources.getFont(id)
    } catch (e: Exception) {
        Typeface.DEFAULT_BOLD
    }

    /** Draws [s] with its vertical middle at [y]. */
    fun text(
        c: Canvas,
        s: String,
        x: Float,
        y: Float,
        size: Float,
        color: Int,
        align: Paint.Align = Paint.Align.CENTER,
        face: Typeface = bold,
    ) {
        val p = textPaint
        p.typeface = face
        p.textSize = size
        p.color = color
        p.textAlign = align
        p.style = Paint.Style.FILL
        p.shader = null
        c.drawText(s, x, y - (p.ascent() + p.descent()) / 2f, p)
    }

    /** Like [text], with a dark edge so it reads over the tiles. */
    fun outlinedText(c: Canvas, s: String, x: Float, y: Float, size: Float, color: Int, edge: Int, edgeWidth: Float) {
        val p = textPaint
        p.typeface = bold
        p.textSize = size
        p.textAlign = Paint.Align.CENTER
        p.shader = null
        val base = y - (p.ascent() + p.descent()) / 2f
        p.style = Paint.Style.STROKE
        p.strokeWidth = edgeWidth
        p.strokeJoin = Paint.Join.ROUND
        p.color = edge
        c.drawText(s, x, base, p)
        p.style = Paint.Style.FILL
        p.color = color
        c.drawText(s, x, base, p)
    }

    fun textWidth(s: String, size: Float, face: Typeface = bold): Float {
        textPaint.typeface = face
        textPaint.textSize = size
        return textPaint.measureText(s)
    }

    /** The largest size up to [size] at which [s] fits in [maxWidth]. */
    fun fitSize(s: String, size: Float, maxWidth: Float, face: Typeface = bold): Float {
        val w = textWidth(s, size, face)
        return if (w <= maxWidth || w <= 0f) size else size * maxWidth / w
    }

    /**
     * Draws [s] wrapped to [maxWidth], centred on [cx], first line's middle at [top].
     * Returns the y just below the last line. A line break in [s] starts a new line.
     */
    fun paragraph(c: Canvas, s: String, cx: Float, top: Float, maxWidth: Float, size: Float, color: Int, face: Typeface = semi): Float {
        val lineHeight = size * 1.36f
        var y = top
        for (block in s.split('\n')) {
            val line = StringBuilder()
            for (word in block.split(' ')) {
                val trial = if (line.isEmpty()) word else "$line $word"
                if (line.isNotEmpty() && textWidth(trial, size, face) > maxWidth) {
                    text(c, line.toString(), cx, y, size, color, Paint.Align.CENTER, face)
                    y += lineHeight
                    line.setLength(0)
                    line.append(word)
                } else {
                    line.setLength(0)
                    line.append(trial)
                }
            }
            text(c, line.toString(), cx, y, size, color, Paint.Align.CENTER, face)
            y += lineHeight
        }
        return y - lineHeight + size * 0.7f
    }

    fun roundRect(c: Canvas, l: Float, t: Float, r: Float, b: Float, radius: Float, color: Int) {
        fill.shader = null
        fill.color = color
        rect.set(l, t, r, b)
        c.drawRoundRect(rect, radius, radius, fill)
    }

    fun roundRectLine(c: Canvas, l: Float, t: Float, r: Float, b: Float, radius: Float, color: Int, width: Float) {
        line.color = color
        line.strokeWidth = width
        line.pathEffect = null
        rect.set(l, t, r, b)
        c.drawRoundRect(rect, radius, radius, line)
    }

    /** A raised card: the shape every panel and readout sits on. */
    fun card(c: Canvas, l: Float, t: Float, r: Float, b: Float, radius: Float = 12f * unit) {
        roundRect(c, l, t + 2f * unit, r, b + 2f * unit, radius, Palette.PANEL_DARK)
        roundRect(c, l, t, r, b, radius, Palette.PANEL)
        roundRectLine(c, l, t, r, b, radius, Palette.OUTLINE, 1.2f * unit)
    }

    /** The backdrop behind every screen. */
    fun background(c: Canvas, w: Float, h: Float) {
        if (bgShader == null || bgHeight != h) {
            bgShader = LinearGradient(0f, 0f, 0f, h, Palette.BG_TOP, Palette.BG_BOTTOM, Shader.TileMode.CLAMP)
            bgHeight = h
        }
        // The paint's own alpha applies to a shader too, so make it solid first:
        // whatever was drawn last may have left it half see-through.
        fill.color = 0xFF000000.toInt()
        fill.shader = bgShader
        c.drawRect(0f, 0f, w, h, fill)
        fill.shader = null
        // Large, faint tiles drifting in the corners, so the backdrop is not a flat wash.
        val s = w * 0.42f
        ghostTile(c, -s * 0.35f, h * 0.10f, s, -12f)
        ghostTile(c, w - s * 0.55f, h * 0.30f, s * 0.8f, 16f)
        ghostTile(c, w * 0.08f, h * 0.68f, s * 0.7f, 10f)
        ghostTile(c, w - s * 0.5f, h * 0.86f, s * 0.9f, -8f)
    }

    private fun ghostTile(c: Canvas, x: Float, y: Float, size: Float, degrees: Float) {
        c.save()
        c.rotate(degrees, x + size / 2f, y + size / 2f)
        roundRect(c, x, y, x + size, y + size, size * 0.22f, 0x08FFFFFF)
        roundRectLine(c, x, y, x + size, y + size, size * 0.22f, 0x0CFFFFFF, 1.5f * unit)
        c.restore()
    }

    // ------------------------------------------------------------ icons

    fun icon(c: Canvas, which: Icon, cx: Float, cy: Float, size: Float, color: Int) {
        val s = size / 2f
        fill.shader = null
        fill.color = color
        line.color = color
        line.pathEffect = null
        line.strokeWidth = size * 0.14f
        path.rewind()
        when (which) {
            Icon.PAUSE -> {
                roundRect(c, cx - s * 0.62f, cy - s * 0.72f, cx - s * 0.16f, cy + s * 0.72f, s * 0.16f, color)
                roundRect(c, cx + s * 0.16f, cy - s * 0.72f, cx + s * 0.62f, cy + s * 0.72f, s * 0.16f, color)
            }
            Icon.BACK -> {
                path.moveTo(cx + s * 0.28f, cy - s * 0.62f)
                path.lineTo(cx - s * 0.34f, cy)
                path.lineTo(cx + s * 0.28f, cy + s * 0.62f)
                c.drawPath(path, line)
            }
            Icon.NEXT -> {
                path.moveTo(cx - s * 0.28f, cy - s * 0.62f)
                path.lineTo(cx + s * 0.34f, cy)
                path.lineTo(cx - s * 0.28f, cy + s * 0.62f)
                c.drawPath(path, line)
            }
            Icon.UP -> {
                path.moveTo(cx - s * 0.62f, cy + s * 0.28f)
                path.lineTo(cx, cy - s * 0.34f)
                path.lineTo(cx + s * 0.62f, cy + s * 0.28f)
                c.drawPath(path, line)
            }
            Icon.MINUS -> c.drawLine(cx - s * 0.55f, cy, cx + s * 0.55f, cy, line)
            Icon.PLUS -> {
                c.drawLine(cx - s * 0.55f, cy, cx + s * 0.55f, cy, line)
                c.drawLine(cx, cy - s * 0.55f, cx, cy + s * 0.55f, line)
            }
            Icon.SOUND_ON, Icon.SOUND_OFF -> {
                // a speaker...
                path.moveTo(cx - s * 0.80f, cy - s * 0.26f)
                path.lineTo(cx - s * 0.46f, cy - s * 0.26f)
                path.lineTo(cx - s * 0.02f, cy - s * 0.66f)
                path.lineTo(cx - s * 0.02f, cy + s * 0.66f)
                path.lineTo(cx - s * 0.46f, cy + s * 0.26f)
                path.lineTo(cx - s * 0.80f, cy + s * 0.26f)
                path.close()
                c.drawPath(path, fill)
                line.strokeWidth = size * 0.10f
                if (which == Icon.SOUND_ON) {
                    // ...with two waves
                    rect.set(cx - s * 0.20f, cy - s * 0.36f, cx + s * 0.38f, cy + s * 0.36f)
                    c.drawArc(rect, -50f, 100f, false, line)
                    rect.set(cx - s * 0.30f, cy - s * 0.66f, cx + s * 0.80f, cy + s * 0.66f)
                    c.drawArc(rect, -50f, 100f, false, line)
                } else {
                    // ...crossed out
                    c.drawLine(cx + s * 0.28f, cy - s * 0.30f, cx + s * 0.84f, cy + s * 0.30f, line)
                    c.drawLine(cx + s * 0.84f, cy - s * 0.30f, cx + s * 0.28f, cy + s * 0.30f, line)
                }
            }
            Icon.BUZZ_ON, Icon.BUZZ_OFF -> {
                // a phone...
                line.strokeWidth = size * 0.10f
                rect.set(cx - s * 0.30f, cy - s * 0.66f, cx + s * 0.30f, cy + s * 0.66f)
                c.drawRoundRect(rect, s * 0.14f, s * 0.14f, line)
                if (which == Icon.BUZZ_ON) {
                    // ...shaking
                    c.drawLine(cx - s * 0.60f, cy - s * 0.30f, cx - s * 0.60f, cy + s * 0.30f, line)
                    c.drawLine(cx + s * 0.60f, cy - s * 0.30f, cx + s * 0.60f, cy + s * 0.30f, line)
                    c.drawLine(cx - s * 0.88f, cy - s * 0.14f, cx - s * 0.88f, cy + s * 0.14f, line)
                    c.drawLine(cx + s * 0.88f, cy - s * 0.14f, cx + s * 0.88f, cy + s * 0.14f, line)
                } else {
                    c.drawLine(cx - s * 0.80f, cy + s * 0.70f, cx + s * 0.80f, cy - s * 0.70f, line)
                }
            }
            Icon.LOCK -> {
                roundRect(c, cx - s * 0.52f, cy - s * 0.08f, cx + s * 0.52f, cy + s * 0.70f, s * 0.16f, color)
                line.strokeWidth = size * 0.11f
                rect.set(cx - s * 0.32f, cy - s * 0.66f, cx + s * 0.32f, cy + s * 0.20f)
                c.drawArc(rect, 180f, 180f, false, line)
            }
            Icon.CHECK -> {
                path.moveTo(cx - s * 0.56f, cy + s * 0.02f)
                path.lineTo(cx - s * 0.14f, cy + s * 0.44f)
                path.lineTo(cx + s * 0.60f, cy - s * 0.40f)
                c.drawPath(path, line)
            }
        }
    }
}

enum class Icon { PAUSE, BACK, NEXT, UP, MINUS, PLUS, SOUND_ON, SOUND_OFF, BUZZ_ON, BUZZ_OFF, LOCK, CHECK }

enum class ButtonStyle {
    /** The main action on a screen: amber. */
    PRIMARY,

    /** Everything else. */
    PLAIN,

    /** A chosen option in a row of options. */
    SELECTED,
}

/** A button drawn by the game itself. Screens lay these out, and [Scene] handles pressing them. */
class Button(var label: String, var style: ButtonStyle = ButtonStyle.PLAIN, val onClick: () -> Unit) {
    val rect = RectF()
    var icon: Icon? = null

    /** A smaller second line under the label. */
    var note: String? = null
    var pressed = false
    var enabled = true
    var visible = true

    /** Label size in layout units; 0 picks one from the button's height. */
    var textUnits = 0f

    fun set(l: Float, t: Float, r: Float, b: Float) = rect.set(l, t, r, b)

    /** True if a touch at [x], [y] is on the button. A little slack around the edge helps small buttons. */
    fun hit(x: Float, y: Float, slack: Float): Boolean =
        visible && enabled && x >= rect.left - slack && x <= rect.right + slack && y >= rect.top - slack && y <= rect.bottom + slack

    fun draw(c: Canvas, ui: Ui) {
        if (!visible) return
        val u = ui.unit
        val h = rect.height()
        val radius = minOf(h * 0.32f, 16f * u)
        val lip = minOf(4f * u, h * 0.12f)
        val face: Int
        val edge: Int
        val ink: Int
        when (style) {
            ButtonStyle.PRIMARY -> {
                face = Palette.ACCENT
                edge = Palette.ACCENT_DARK
                ink = Palette.TEXT_DARK
            }
            ButtonStyle.SELECTED -> {
                face = Palette.TEAL
                edge = Palette.TEAL_DARK
                ink = 0xFF06272A.toInt()
            }
            ButtonStyle.PLAIN -> {
                face = Palette.PANEL_LIGHT
                edge = Palette.PANEL_DARK
                ink = Palette.TEXT
            }
        }
        val alpha = if (enabled) 1f else 0.38f
        val down = if (pressed && enabled) lip else 0f
        // the edge the button sits on, then the face, pushed down while pressed
        ui.roundRect(c, rect.left, rect.top + lip, rect.right, rect.bottom, radius, Palette.withAlpha(edge, alpha))
        ui.roundRect(c, rect.left, rect.top + down, rect.right, rect.bottom - lip + down, radius, Palette.withAlpha(face, alpha))
        if (style == ButtonStyle.PLAIN) {
            ui.roundRectLine(c, rect.left, rect.top + down, rect.right, rect.bottom - lip + down, radius,
                Palette.withAlpha(Palette.OUTLINE, alpha), 1.2f * u)
        }
        val cx = rect.centerX()
        val cy = rect.top + down + (h - lip) / 2f
        val inkA = Palette.withAlpha(ink, alpha)
        val ic = icon
        if (ic != null && label.isEmpty()) {
            ui.icon(c, ic, cx, cy, minOf(rect.width(), h - lip) * 0.52f, inkA)
            return
        }
        val size = (if (textUnits > 0f) textUnits * u else (h - lip) * 0.40f)
        val fitted = ui.fitSize(label, size, rect.width() - 16f * u)
        val n = note
        if (n == null) {
            ui.text(c, label, cx, cy, fitted, inkA)
        } else {
            ui.text(c, label, cx, cy - size * 0.36f, fitted, inkA)
            val noteSize = ui.fitSize(n, size * 0.52f, rect.width() - 16f * u, ui.semi)
            ui.text(c, n, cx, cy + size * 0.62f, noteSize, Palette.withAlpha(ink, alpha * 0.75f), face = ui.semi)
        }
    }
}
