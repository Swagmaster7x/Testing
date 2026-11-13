package com.personal.tilesurge.ui

import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.PI
import kotlin.math.asin
import kotlin.math.exp
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.tanh

enum class Sfx { TAP, SWAP, LAND, MATCH, POP, COMBO, CHAIN, ROW, WARN, LEVEL, LINE, READY, GO, OVER, CLEAR }

/**
 * Makes every sound in the game out of a few tones: no recordings, no audio files.
 * (No Android code here, so the plain unit tests can check each sound.)
 */
object SfxSynth {
    const val RATE = 22050

    /** Bump when a sound changes, so phones drop the old cached files. */
    const val VERSION = 1

    private const val SINE = 0
    private const val TRIANGLE = 1
    private const val SQUARE = 2

    /** The sound as 16-bit mono samples at [RATE]. */
    fun pcm(s: Sfx): ShortArray = design(s).pcm()

    /** The sound as a complete WAV file. */
    fun wav(s: Sfx): ByteArray {
        val pcm = pcm(s)
        val bytes = ByteBuffer.allocate(44 + pcm.size * 2).order(ByteOrder.LITTLE_ENDIAN)
        bytes.put("RIFF".toByteArray(Charsets.US_ASCII)).putInt(36 + pcm.size * 2)
        bytes.put("WAVE".toByteArray(Charsets.US_ASCII))
        bytes.put("fmt ".toByteArray(Charsets.US_ASCII)).putInt(16)
        bytes.putShort(1).putShort(1) // PCM, mono
        bytes.putInt(RATE).putInt(RATE * 2).putShort(2).putShort(16)
        bytes.put("data".toByteArray(Charsets.US_ASCII)).putInt(pcm.size * 2)
        for (v in pcm) bytes.putShort(v)
        return bytes.array()
    }

    private fun design(s: Sfx): Clip = when (s) {
        Sfx.TAP -> Clip(70).tone(0, 60, 700f, 640f, 0.45f, SINE, 5f)
        Sfx.SWAP -> Clip(80).tone(0, 55, 480f, 820f, 0.34f, TRIANGLE, 4f).noise(0, 20, 0.05f)
        Sfx.LAND -> Clip(120).tone(0, 110, 150f, 78f, 0.55f, SINE, 5f).noise(0, 14, 0.10f)
        Sfx.MATCH -> Clip(230).tone(0, 200, 880f, 880f, 0.26f, SINE, 4f).tone(40, 180, 1320f, 1320f, 0.22f, SINE, 4f)
        Sfx.POP -> Clip(140).tone(0, 120, 430f, 880f, 0.50f, SINE, 5f).tone(0, 40, 1300f, 1700f, 0.10f, TRIANGLE, 6f)
        Sfx.COMBO -> Clip(330)
            .tone(0, 110, 1046f, 1046f, 0.26f, TRIANGLE, 3.5f)
            .tone(65, 110, 1318f, 1318f, 0.26f, TRIANGLE, 3.5f)
            .tone(130, 190, 1568f, 1568f, 0.28f, TRIANGLE, 3.5f)
        Sfx.CHAIN -> Clip(470)
            .tone(0, 110, 784f, 784f, 0.26f, TRIANGLE, 3f)
            .tone(60, 110, 1046f, 1046f, 0.26f, TRIANGLE, 3f)
            .tone(120, 110, 1318f, 1318f, 0.26f, TRIANGLE, 3f)
            .tone(180, 280, 1568f, 1568f, 0.28f, TRIANGLE, 3.5f)
            .tone(180, 280, 2093f, 2093f, 0.12f, SINE, 3.5f)
        Sfx.ROW -> Clip(70).tone(0, 60, 250f, 320f, 0.28f, TRIANGLE, 5f)
        Sfx.WARN -> Clip(250).tone(0, 80, 940f, 940f, 0.22f, SQUARE, 1.5f).tone(120, 80, 940f, 940f, 0.22f, SQUARE, 1.5f)
        Sfx.LEVEL -> Clip(340).tone(0, 130, 1318f, 1318f, 0.26f, TRIANGLE, 3f).tone(110, 220, 1760f, 1760f, 0.28f, TRIANGLE, 3.5f)
        Sfx.LINE -> Clip(520)
            .tone(0, 140, 784f, 784f, 0.26f, TRIANGLE, 3f)
            .tone(120, 380, 1175f, 1175f, 0.28f, TRIANGLE, 3.5f)
            .tone(120, 380, 1568f, 1568f, 0.14f, SINE, 3.5f)
        Sfx.READY -> Clip(200).tone(0, 180, 660f, 660f, 0.32f, TRIANGLE, 3f)
        Sfx.GO -> Clip(420).tone(0, 400, 990f, 990f, 0.34f, TRIANGLE, 3f).tone(0, 400, 1485f, 1485f, 0.10f, SINE, 3f)
        Sfx.OVER -> Clip(1000)
            .tone(0, 190, 440f, 430f, 0.34f, TRIANGLE, 2.5f)
            .tone(170, 190, 349f, 340f, 0.34f, TRIANGLE, 2.5f)
            .tone(340, 190, 294f, 286f, 0.34f, TRIANGLE, 2.5f)
            .tone(510, 470, 220f, 196f, 0.38f, TRIANGLE, 3f)
            .tone(510, 470, 110f, 98f, 0.20f, SINE, 3f)
        Sfx.CLEAR -> Clip(1150)
            .tone(0, 130, 523f, 523f, 0.26f, TRIANGLE, 2.5f)
            .tone(100, 130, 659f, 659f, 0.26f, TRIANGLE, 2.5f)
            .tone(200, 130, 784f, 784f, 0.26f, TRIANGLE, 2.5f)
            .tone(300, 130, 1046f, 1046f, 0.26f, TRIANGLE, 2.5f)
            .tone(400, 720, 1318f, 1318f, 0.24f, TRIANGLE, 3f)
            .tone(400, 720, 1046f, 1046f, 0.18f, SINE, 3f)
            .tone(400, 720, 784f, 784f, 0.16f, SINE, 3f)
    }

    /** A short stretch of sound that tones can be added into. */
    private class Clip(ms: Int) {
        private val data = FloatArray(RATE * ms / 1000)

        /**
         * Adds a tone that glides from [f0] to [f1] hertz.
         * @param fade how fast it dies away: about 3 rings on, 6 is a short pluck
         */
        fun tone(startMs: Int, ms: Int, f0: Float, f1: Float, volume: Float, shape: Int, fade: Float): Clip {
            val start = RATE * startMs / 1000
            val n = RATE * ms / 1000
            var phase = 0.0
            for (i in 0 until n) {
                val at = start + i
                if (at >= data.size) break
                val t = i.toFloat() / n
                val f = f0 * (f1 / f0).pow(t)
                phase += 2.0 * PI * f / RATE
                val wave = when (shape) {
                    TRIANGLE -> (2.0 / PI * asin(sin(phase))).toFloat()
                    SQUARE -> if (sin(phase) >= 0) 0.6f else -0.6f
                    else -> sin(phase).toFloat()
                }
                // a few milliseconds of fade at each end, so nothing clicks
                val attack = minOf(1f, i / (RATE * 0.004f))
                val release = minOf(1f, (n - i) / (RATE * 0.006f))
                data[at] += wave * volume * attack * release * exp(-fade * t)
            }
            return this
        }

        /** Adds a short hiss, for the click at the start of a thud or a swipe. */
        fun noise(startMs: Int, ms: Int, volume: Float): Clip {
            val start = RATE * startMs / 1000
            val n = RATE * ms / 1000
            var seed = 0x2545F491
            for (i in 0 until n) {
                val at = start + i
                if (at >= data.size) break
                seed = seed * 1103515245 + 12345
                val r = ((seed ushr 16) and 0x7FFF) / 16384f - 1f
                data[at] += r * volume * (1f - i.toFloat() / n)
            }
            return this
        }

        /** A gentle limiter, so stacked tones never clip harshly. */
        fun pcm(): ShortArray = ShortArray(data.size) { i ->
            (tanh(data[i] * 1.2f) * 32000f).toInt().coerceIn(-32767, 32767).toShort()
        }
    }
}
