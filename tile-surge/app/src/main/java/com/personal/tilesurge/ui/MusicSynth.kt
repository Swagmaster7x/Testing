package com.personal.tilesurge.ui

import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.PI
import kotlin.math.asin
import kotlin.math.exp
import kotlin.math.pow
import kotlin.math.sin
import kotlin.math.tanh

/**
 * The background tune: sixteen bars written for this game and built from plain tones, like the sound effects.
 * A bass note twice a bar, a rippling chord, and a simple melody on top. It loops.
 * (No Android code here, so the plain unit tests can check it.)
 */
object MusicSynth {
    const val RATE = 22050
    const val VERSION = 1
    private const val BEATS_PER_BAR = 4
    private const val BEAT_SECONDS = 60.0 / 108.0

    /** Each bar's chord as three notes (MIDI numbers, middle C = 60). */
    private val CHORDS = arrayOf(
        intArrayOf(48, 52, 55), intArrayOf(45, 48, 52), intArrayOf(41, 45, 48), intArrayOf(43, 47, 50),
        intArrayOf(48, 52, 55), intArrayOf(40, 43, 47), intArrayOf(41, 45, 48), intArrayOf(43, 47, 50),
        intArrayOf(45, 48, 52), intArrayOf(41, 45, 48), intArrayOf(48, 52, 55), intArrayOf(43, 47, 50),
        intArrayOf(45, 48, 52), intArrayOf(41, 45, 48), intArrayOf(43, 47, 50), intArrayOf(48, 52, 55),
    )

    /** The melody, bar by bar: beat it starts on, how many beats it lasts, which note. */
    private val TUNE: Array<Array<DoubleArray>> = arrayOf(
        arrayOf(n(0.0, 1.0, 76), n(1.0, 1.0, 79), n(2.0, 2.0, 81)),
        arrayOf(n(0.0, 1.0, 79), n(1.0, 1.0, 76), n(2.0, 2.0, 72)),
        arrayOf(n(0.0, 1.0, 69), n(1.0, 1.0, 72), n(2.0, 1.0, 74), n(3.0, 1.0, 72)),
        arrayOf(n(0.0, 2.0, 74), n(2.0, 2.0, 71)),
        arrayOf(n(0.0, 1.0, 76), n(1.0, 1.0, 79), n(2.0, 2.0, 84)),
        arrayOf(n(0.0, 1.0, 83), n(1.0, 1.0, 79), n(2.0, 2.0, 76)),
        arrayOf(n(0.0, 1.0, 77), n(1.0, 1.0, 81), n(2.0, 1.0, 79), n(3.0, 1.0, 77)),
        arrayOf(n(0.0, 3.0, 74)),
        arrayOf(n(0.0, 1.5, 81), n(1.5, 0.5, 79), n(2.0, 2.0, 76)),
        arrayOf(n(0.0, 1.0, 77), n(1.0, 1.0, 81), n(2.0, 2.0, 84)),
        arrayOf(n(0.0, 1.0, 79), n(1.0, 1.0, 76), n(2.0, 1.0, 79), n(3.0, 1.0, 84)),
        arrayOf(n(0.0, 2.0, 83), n(2.0, 2.0, 86)),
        arrayOf(n(0.0, 1.0, 84), n(1.0, 1.0, 81), n(2.0, 2.0, 76)),
        arrayOf(n(0.0, 1.0, 77), n(1.0, 1.0, 79), n(2.0, 2.0, 81)),
        arrayOf(n(0.0, 1.0, 79), n(1.0, 1.0, 83), n(2.0, 1.0, 86), n(3.0, 1.0, 83)),
        arrayOf(n(0.0, 3.0, 84)),
    )

    private fun n(start: Double, beats: Double, note: Int) = doubleArrayOf(start, beats, note.toDouble())

    private fun hertz(note: Double): Double = 440.0 * 2.0.pow((note - 69.0) / 12.0)

    val seconds: Double get() = CHORDS.size * BEATS_PER_BAR * BEAT_SECONDS

    fun pcm(): ShortArray {
        val total = (seconds * RATE).toInt()
        val data = FloatArray(total)

        fun tone(startBeat: Double, beats: Double, note: Double, volume: Float, triangle: Boolean, fade: Float) {
            val start = (startBeat * BEAT_SECONDS * RATE).toInt()
            val len = (beats * BEAT_SECONDS * RATE).toInt()
            val step = 2.0 * PI * hertz(note) / RATE
            var phase = 0.0
            for (i in 0 until len) {
                // a note that runs past the end carries on at the start, so the loop joins without a gap
                val at = (start + i) % total
                phase += step
                val wave = if (triangle) (2.0 / PI * asin(sin(phase))).toFloat() else sin(phase).toFloat()
                val t = i.toFloat() / len
                val attack = minOf(1f, i / (RATE * 0.010f))
                val release = minOf(1f, (len - i) / (RATE * 0.030f))
                data[at] += wave * volume * attack * release * exp(-fade * t)
            }
        }

        for (bar in CHORDS.indices) {
            val b0 = bar * BEATS_PER_BAR.toDouble()
            val chord = CHORDS[bar]
            // bass: the root, low, on the first and third beats
            tone(b0, 1.8, chord[0] - 12.0, 0.20f, true, 1.6f)
            tone(b0 + 2.0, 1.8, chord[0] - 12.0, 0.16f, true, 1.6f)
            // the chord, rippled in half-beats an octave up
            val ripple = intArrayOf(0, 1, 2, 1, 0, 1, 2, 1)
            for (i in ripple.indices) tone(b0 + i * 0.5, 0.6, chord[ripple[i]] + 12.0, 0.085f, false, 3.0f)
            // the melody
            for (note in TUNE[bar]) tone(b0 + note[0], note[1], note[2], 0.11f, true, 1.4f)
        }
        return ShortArray(total) { i -> (tanh(data[i] * 1.3f) * 30000f).toInt().coerceIn(-32767, 32767).toShort() }
    }

    fun wav(): ByteArray {
        val pcm = pcm()
        val bytes = ByteBuffer.allocate(44 + pcm.size * 2).order(ByteOrder.LITTLE_ENDIAN)
        bytes.put("RIFF".toByteArray(Charsets.US_ASCII)).putInt(36 + pcm.size * 2)
        bytes.put("WAVE".toByteArray(Charsets.US_ASCII))
        bytes.put("fmt ".toByteArray(Charsets.US_ASCII)).putInt(16)
        bytes.putShort(1).putShort(1)
        bytes.putInt(RATE).putInt(RATE * 2).putShort(2).putShort(16)
        bytes.put("data".toByteArray(Charsets.US_ASCII)).putInt(pcm.size * 2)
        for (v in pcm) bytes.putShort(v)
        return bytes.array()
    }
}
