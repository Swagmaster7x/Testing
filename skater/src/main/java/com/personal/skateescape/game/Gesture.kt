package com.personal.skateescape.game

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.min
import kotlin.math.sin

/** The shapes a player can trace in the air, and the trick each one performs. */
enum class Shape(val label: String, val coins: Int, val closed: Boolean, val outline: FloatArray) {
    VEE("KICKFLIP", 8, false, floatArrayOf(0f, 0f, 0.5f, 1f, 1f, 0f)),
    CARET("POP SHOVE-IT", 8, false, floatArrayOf(0f, 1f, 0.5f, 0f, 1f, 1f)),
    ZED("ZIGZAG SLIDE", 10, false, floatArrayOf(0f, 0f, 1f, 0f, 0f, 1f, 1f, 1f)),
    CIRCLE("360 SPIN", 12, true, circleOutline()),
    TRIANGLE("TRE FLIP", 15, true, floatArrayOf(0.5f, 0f, 1f, 1f, 0f, 1f, 0.5f, 0f)),
}

private fun circleOutline(): FloatArray {
    val n = 32
    val out = FloatArray((n + 1) * 2)
    for (i in 0..n) {
        val a = 2.0 * PI * i / n - PI / 2
        out[i * 2] = (0.5 + 0.5 * cos(a)).toFloat()
        out[i * 2 + 1] = (0.5 + 0.5 * sin(a)).toFloat()
    }
    return out
}

/**
 * Matches a finger stroke against the trick shapes. Points are x,y pairs with y pointing down
 * (screen coordinates). Position and size do not matter; orientation does, so a V is not a caret.
 */
object Gesture {
    private const val N = 32
    private const val ACCEPT = 0.2f

    private class Template(val shape: Shape, val pts: FloatArray)

    private val templates: List<Template> = buildList {
        for (shape in Shape.entries) {
            val base = normalise(resample(shape.outline, shape.outline.size / 2))
            val reversed = reverse(base)
            if (shape.closed) {
                // A closed shape can be started anywhere along its outline.
                for (start in 0 until N step 2) {
                    add(Template(shape, normalise(rotateStart(base, start))))
                    add(Template(shape, normalise(rotateStart(reversed, start))))
                }
            } else {
                add(Template(shape, base))
                add(Template(shape, reversed))
            }
        }
    }

    /** Total length of the stroke. */
    fun pathLength(pts: FloatArray, count: Int): Float {
        var len = 0f
        for (i in 1 until count) {
            len += hypot(pts[i * 2] - pts[i * 2 - 2], pts[i * 2 + 1] - pts[i * 2 - 1])
        }
        return len
    }

    /** True when the stroke is close to a straight line, i.e. a swipe rather than a shape. */
    fun isStraight(pts: FloatArray, count: Int): Boolean {
        if (count < 2) return true
        val direct = hypot(pts[count * 2 - 2] - pts[0], pts[count * 2 - 1] - pts[1])
        val len = pathLength(pts, count)
        if (len <= 0f) return true
        // A circle ends where it began, so also look at how far the stroke strays from its chord.
        var w0 = Float.MAX_VALUE; var w1 = -Float.MAX_VALUE
        var h0 = Float.MAX_VALUE; var h1 = -Float.MAX_VALUE
        for (i in 0 until count) {
            w0 = min(w0, pts[i * 2]); w1 = max(w1, pts[i * 2])
            h0 = min(h0, pts[i * 2 + 1]); h1 = max(h1, pts[i * 2 + 1])
        }
        val thin = min(w1 - w0, h1 - h0) < 0.22f * max(w1 - w0, h1 - h0)
        return thin || len < direct * 1.15f
    }

    /** The shape the stroke looks most like, or null when it looks like none of them. */
    fun recognise(pts: FloatArray, count: Int): Shape? {
        if (count < 6 || isStraight(pts, count)) return null
        val candidate = normalise(resample(pts, count))
        var best: Shape? = null
        var bestD = Float.MAX_VALUE
        for (t in templates) {
            var d = 0f
            for (i in 0 until N) {
                d += hypot(candidate[i * 2] - t.pts[i * 2], candidate[i * 2 + 1] - t.pts[i * 2 + 1])
                if (d > bestD * N) break
            }
            d /= N
            if (d < bestD) {
                bestD = d
                best = t.shape
            }
        }
        return if (bestD <= ACCEPT) best else null
    }

    private fun resample(pts: FloatArray, count: Int): FloatArray {
        val out = FloatArray(N * 2)
        val total = pathLength(pts, count)
        if (total <= 0f) return out
        val step = total / (N - 1)
        var written = 1
        out[0] = pts[0]; out[1] = pts[1]
        var px = pts[0]; var py = pts[1]
        var acc = 0f
        var i = 1
        while (i < count && written < N) {
            val qx = pts[i * 2]; val qy = pts[i * 2 + 1]
            val seg = hypot(qx - px, qy - py)
            if (seg > 0f && acc + seg >= step) {
                val t = (step - acc) / seg
                px += t * (qx - px); py += t * (qy - py)
                out[written * 2] = px; out[written * 2 + 1] = py
                written++
                acc = 0f
            } else {
                acc += seg
                px = qx; py = qy
                i++
            }
        }
        while (written < N) {
            out[written * 2] = pts[count * 2 - 2]; out[written * 2 + 1] = pts[count * 2 - 1]
            written++
        }
        return out
    }

    /** Moves the points so their box is centred on the origin and stretches it to a unit square. */
    private fun normalise(pts: FloatArray): FloatArray {
        var x0 = Float.MAX_VALUE; var x1 = -Float.MAX_VALUE
        var y0 = Float.MAX_VALUE; var y1 = -Float.MAX_VALUE
        for (i in 0 until N) {
            x0 = min(x0, pts[i * 2]); x1 = max(x1, pts[i * 2])
            y0 = min(y0, pts[i * 2 + 1]); y1 = max(y1, pts[i * 2 + 1])
        }
        val w = max(x1 - x0, 1e-4f); val h = max(y1 - y0, 1e-4f)
        val out = FloatArray(N * 2)
        for (i in 0 until N) {
            out[i * 2] = (pts[i * 2] - x0) / w - 0.5f
            out[i * 2 + 1] = (pts[i * 2 + 1] - y0) / h - 0.5f
        }
        return out
    }

    private fun reverse(pts: FloatArray): FloatArray {
        val out = FloatArray(N * 2)
        for (i in 0 until N) {
            out[i * 2] = pts[(N - 1 - i) * 2]; out[i * 2 + 1] = pts[(N - 1 - i) * 2 + 1]
        }
        return out
    }

    private fun rotateStart(pts: FloatArray, start: Int): FloatArray {
        val out = FloatArray(N * 2)
        for (i in 0 until N) {
            val j = (i + start) % N
            out[i * 2] = pts[j * 2]; out[i * 2 + 1] = pts[j * 2 + 1]
        }
        return out
    }
}
