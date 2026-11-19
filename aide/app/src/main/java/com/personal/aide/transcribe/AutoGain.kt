package com.personal.aide.transcribe

import kotlin.math.abs
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.sqrt
import kotlin.math.tanh

/**
 * Brings quiet speech up to the level a speech recognizer expects.
 *
 * A phone on a meeting table hears people a couple of metres away some thirty decibels more
 * quietly than someone dictating into it, and a recognizer built for dictation treats much of
 * that as silence. This turns the volume up, by as much as [maxGain], while people are talking;
 * it leaves the gain where it was during pauses, so background hiss is not pulled up to the
 * level of a voice; and it comes down at once when someone near the phone speaks, so loud voices
 * are not distorted.
 *
 * Works on 16-bit samples a short frame (a few hundredths of a second) at a time. Not thread-safe.
 */
class AutoGain(private val maxGain: Float) {
    /** The multiplier in force. Starts at 1 and moves as speech is heard. */
    var gain: Float = 1f
        private set

    /** A running estimate of the room's background level, in the same units as the samples' RMS. */
    var noiseFloor: Float = START_NOISE
        private set

    /** Whether the last frame was judged to be someone speaking. */
    var speaking: Boolean = false
        private set

    /**
     * Applies the gain to the first [count] of [samples], in place.
     * @return how loud the result is, from 0 (silence) to 1 (as loud as speech gets), for a level meter.
     */
    fun process(samples: ShortArray, count: Int): Float {
        if (count <= 0) return 0f
        var sum = 0.0
        for (index in 0 until count) {
            val value = samples[index].toDouble()
            sum += value * value
        }
        val rms = sqrt(sum / count).toFloat()

        // The background is whatever the quiet moments sound like: follow dips quickly, rises slowly.
        noiseFloor += (rms - noiseFloor) * (if (rms < noiseFloor) NOISE_FALL else NOISE_RISE)
        noiseFloor = noiseFloor.coerceAtLeast(1f)
        speaking = rms > max(noiseFloor * SPEECH_OVER_NOISE, MIN_SPEECH_RMS)

        if (speaking) {
            val wanted = (TARGET_RMS / rms).coerceIn(1f, maxGain)
            // Down fast, so a loud voice doesn't clip; up gently, so the level doesn't pump between words.
            gain += (wanted - gain) * (if (wanted < gain) ATTACK else RELEASE)
        }

        var after = 0.0
        for (index in 0 until count) {
            val value = limit(samples[index] * gain)
            samples[index] = value.toInt().toShort()
            after += value * value
        }
        return level(sqrt(after / count).toFloat())
    }

    companion object {
        /** Where speech should sit: about 25 dB below full scale, the level of someone dictating. */
        const val TARGET_RMS = 1_800f
        private const val START_NOISE = 40f
        private const val MIN_SPEECH_RMS = 14f
        private const val SPEECH_OVER_NOISE = 2.2f
        private const val NOISE_FALL = 0.25f
        private const val NOISE_RISE = 0.004f
        private const val ATTACK = 0.5f
        private const val RELEASE = 0.08f
        private const val KNEE = 22_000f
        private const val CEILING = 32_000f

        /** Squeezes anything above [KNEE] under [CEILING] smoothly, instead of clipping it flat. */
        fun limit(value: Float): Float {
            val size = abs(value)
            if (size <= KNEE) return value
            val squeezed = KNEE + (CEILING - KNEE) * tanh((size - KNEE) / (CEILING - KNEE))
            return if (value < 0) -squeezed else squeezed
        }

        /** An RMS level as a meter reading: 0 at 50 dB below full scale or quieter, 1 at 14 dB below. */
        fun level(rms: Float): Float {
            if (rms <= 1f) return 0f
            val decibels = 20f * log10(rms / 32_768f)
            return ((decibels + 50f) / 36f).coerceIn(0f, 1f)
        }
    }
}
