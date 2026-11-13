package com.personal.tilesurge.ui

import com.personal.tilesurge.core.Checks
import com.personal.tilesurge.core.Game
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.abs

/** The lessons can each be done by making the move their ghost finger shows; and the tune is a proper tune. */
class LessonsTest {

    @Test
    fun `the move each lesson shows does what the lesson asks`() {
        for ((i, l) in Lessons.all.withIndex()) {
            val g = Game.fixed(l.rows, 0, l.raise, i + 1L)
            Checks.assertConsistent(g)
            assertFalse("lesson ${i + 1} is done before it starts", l.done(g, g.events))
            if (l.raise) g.raiseHeld = true else {
                assertTrue(g.grab(l.fromRow, l.fromCol))
                g.dragTo(l.toCol)
            }
            var done = false
            var n = 0
            while (!done && n++ < 1200) {
                g.tick()
                Checks.assertConsistent(g)
                done = l.done(g, g.events)
                g.events.clear()
            }
            assertTrue("lesson ${i + 1}: ${l.text}", done)
            assertTrue("lesson ${i + 1} text is too long for its card", l.text.length <= 90)
        }
        assertEquals(4, Lessons.COUNT)
    }

    @Test
    fun `the tune is the right length, loud enough, not clipped, and joins up when it loops`() {
        val pcm = MusicSynth.pcm()
        val seconds = pcm.size.toDouble() / MusicSynth.RATE
        assertEquals(MusicSynth.seconds, seconds, 0.01)
        assertTrue("$seconds s", seconds in 30.0..40.0)
        val peak = pcm.maxOf { abs(it.toInt()) }
        assertTrue("peak $peak", peak in 6000..31000)
        // sound all the way through: no silent second anywhere
        for (s in 0 until seconds.toInt()) {
            val from = s * MusicSynth.RATE
            val loud = (from until from + MusicSynth.RATE).maxOf { abs(pcm[it].toInt()) }
            assertTrue("second $s is silent", loud > 1500)
        }
        // the last sample runs into the first without a jump
        assertTrue(abs(pcm.last().toInt() - pcm.first().toInt()) < 2500)
        assertTrue(MusicSynth.pcm().contentEquals(pcm))
        val wav = MusicSynth.wav()
        assertEquals(44 + pcm.size * 2, wav.size)
        assertEquals("RIFF", String(wav, 0, 4, Charsets.US_ASCII))
    }
}
