package com.personal.skateescape.game

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

class GestureTest {
    /** Draws a shape the way a finger would: many points, wobbly, at some place and size on screen. */
    private fun draw(
        shape: Shape, rnd: Random, wobble: Float = 0.04f, reverse: Boolean = false, startAt: Int = 0,
        width: Float = 400f, height: Float = 400f,
    ): Pair<FloatArray, Int> {
        var corners = shape.outline.toList().chunked(2)
        if (shape.closed && startAt > 0) {
            val open = corners.dropLast(1)
            corners = open.drop(startAt % open.size) + open.take(startAt % open.size)
            corners = corners + listOf(corners.first())
        }
        if (reverse) corners = corners.reversed()
        val pts = ArrayList<Float>()
        for (i in 0 until corners.size - 1) {
            val (ax, ay) = corners[i]
            val (bx, by) = corners[i + 1]
            val steps = if (shape == Shape.CIRCLE) 2 else 12
            for (s in 0 until steps) {
                val t = s / steps.toFloat()
                pts += 300f + (ax + (bx - ax) * t + (rnd.nextFloat() - 0.5f) * 2 * wobble) * width
                pts += 900f + (ay + (by - ay) * t + (rnd.nextFloat() - 0.5f) * 2 * wobble) * height
            }
        }
        pts += 300f + corners.last()[0] * width
        pts += 900f + corners.last()[1] * height
        return pts.toFloatArray() to pts.size / 2
    }

    @Test
    fun everyShapeIsRecognisedHoweverItIsDrawn() {
        val rnd = Random(7)
        var tries = 0
        var right = 0
        for (shape in Shape.entries) {
            repeat(60) { n ->
                val (pts, count) = draw(
                    shape, rnd, reverse = n % 2 == 1, startAt = n % 5,
                    width = 200f + rnd.nextFloat() * 500f, height = 200f + rnd.nextFloat() * 500f,
                )
                tries++
                if (Gesture.recognise(pts, count) == shape) right++
            }
        }
        assertTrue("only $right of $tries wobbly shapes were recognised", right >= tries * 0.95)
    }

    @Test
    fun cleanShapesAreAlwaysRecognised() {
        for (shape in Shape.entries) {
            val (pts, count) = draw(shape, Random(1), wobble = 0f)
            assertEquals(shape, Gesture.recognise(pts, count))
        }
    }

    @Test
    fun aRoughHandDrawnCircleCounts() {
        // An egg-shaped loop that overshoots its start a little.
        val pts = ArrayList<Float>()
        for (i in 0..44) {
            val a = 2.0 * PI * i / 40 + 0.7
            pts += (500 + 210 * cos(a) + 25 * sin(3 * a)).toFloat()
            pts += (1200 + 150 * sin(a)).toFloat()
        }
        assertEquals(Shape.CIRCLE, Gesture.recognise(pts.toFloatArray(), pts.size / 2))
    }

    @Test
    fun swipesAndScribblesAreNotTricks() {
        val swipe = FloatArray(40) { i -> if (i % 2 == 0) 100f + i * 12f else 800f + (i % 3) }
        assertTrue(Gesture.isStraight(swipe, 20))
        assertNull(Gesture.recognise(swipe, 20))
        val tap = floatArrayOf(10f, 10f, 11f, 10f, 11f, 11f)
        assertNull(Gesture.recognise(tap, 3))
        // A long S-like squiggle is none of the shapes.
        val squiggle = ArrayList<Float>()
        for (i in 0..60) {
            squiggle += 400f + 150f * sin(i / 60f * 4f * PI.toFloat())
            squiggle += 600f + i * 10f
        }
        assertNull(Gesture.recognise(squiggle.toFloatArray(), squiggle.size / 2))
    }
}
