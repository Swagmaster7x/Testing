package com.personal.tilesurge.ui

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.abs

/** The sounds are made by code, so check that every one is a real, well-behaved sound. */
class SfxSynthTest {

    @Test
    fun `every sound is audible, not clipped, and starts and ends without a click`() {
        for (s in Sfx.entries) {
            val pcm = SfxSynth.pcm(s)
            val ms = pcm.size * 1000 / SfxSynth.RATE
            assertTrue("$s is $ms ms long", ms in 40..1500)
            val peak = pcm.maxOf { abs(it.toInt()) }
            assertTrue("$s peaks at $peak", peak in 4000..32000)
            // loud for a good part of its length, not just one spike
            val loud = pcm.count { abs(it.toInt()) > peak / 4 }
            assertTrue("$s is mostly silence", loud > pcm.size / 20)
            assertTrue("$s starts with a click (${pcm.first()})", abs(pcm.first().toInt()) < 2500)
            assertTrue("$s ends with a click (${pcm.last()})", abs(pcm.last().toInt()) < 1200)
            // no stuck level: it should average out near zero
            val mean = pcm.sumOf { it.toInt() } / pcm.size
            assertTrue("$s sits off centre by $mean", abs(mean) < 700)
        }
    }

    @Test
    fun `sounds are the same every time`() {
        for (s in Sfx.entries) assertTrue(SfxSynth.pcm(s).contentEquals(SfxSynth.pcm(s)))
    }

    @Test
    fun `the files are proper WAV files`() {
        for (s in Sfx.entries) {
            val wav = SfxSynth.wav(s)
            val pcm = SfxSynth.pcm(s)
            val b = ByteBuffer.wrap(wav).order(ByteOrder.LITTLE_ENDIAN)
            assertEquals("RIFF", String(wav, 0, 4, Charsets.US_ASCII))
            assertEquals(wav.size - 8, b.getInt(4))
            assertEquals("WAVE", String(wav, 8, 4, Charsets.US_ASCII))
            assertEquals("fmt ", String(wav, 12, 4, Charsets.US_ASCII))
            assertEquals(16, b.getInt(16))
            assertEquals(1, b.getShort(20).toInt()) // PCM
            assertEquals(1, b.getShort(22).toInt()) // mono
            assertEquals(SfxSynth.RATE, b.getInt(24))
            assertEquals(SfxSynth.RATE * 2, b.getInt(28))
            assertEquals(2, b.getShort(32).toInt())
            assertEquals(16, b.getShort(34).toInt())
            assertEquals("data", String(wav, 36, 4, Charsets.US_ASCII))
            assertEquals(pcm.size * 2, b.getInt(40))
            assertEquals(44 + pcm.size * 2, wav.size)
            assertEquals(pcm[pcm.size / 2], b.getShort(44 + (pcm.size / 2) * 2))
        }
    }
}
