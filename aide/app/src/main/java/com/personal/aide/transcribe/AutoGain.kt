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
 * Telling a voice from the room is the hard part. Speech comes and goes: it rises well above the
 * background and falls back again within a second or so. A fan starting up, or the room's hiss
 * returning after a moment of dead silence, rises and then simply stays. So a rise is treated
 * as speech at first, and boosted at once so that no first word is lost, but if it turns out
 * to stay level it is taken for the room after all and the boost it earned is given back.
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

    /** Frames in a row judged to be speech so far, and the quietest and loudest of them. */
    private var run = 0
    private var runLow = 0f
    private var runHigh = 0f

    /** The gain before the current stretch of speech began, to go back to if it proves not to be speech. */
    private var gainBeforeRun = 1f

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
        var talking = rms > max(noiseFloor * SPEECH_OVER_NOISE, MIN_SPEECH_RMS)

        if (talking) {
            if (run == 0) {
                gainBeforeRun = gain
                runLow = rms
                runHigh = rms
            } else {
                runLow = minOf(runLow, rms)
                runHigh = max(runHigh, rms)
            }
            run++
            if (run >= STEADY_FRAMES) {
                if (runHigh < runLow * STEADY_SPREAD) {
                    // Over a second at one level: that is the room, not a voice.
                    talking = false
                    itWasTheRoom()
                } else {
                    // Still rising and falling like speech. Keep what it earned and judge the next stretch afresh.
                    gainBeforeRun = gain
                    run = 1
                    runLow = rms
                    runHigh = rms
                }
            }
        } else if (run > 0) {
            // A voice ends by falling away. A level that stopped counting as speech without falling,
            // because the estimate of the room rose to meet it, was the room all along.
            if (rms > runLow * STILL_THERE && runHigh < runLow * STEADY_SPREAD) itWasTheRoom()
            run = 0
        }
        speaking = talking

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

    /** Takes back what the current stretch earned, and counts its level as the room's from now on. */
    private fun itWasTheRoom() {
        gain = gainBeforeRun
        noiseFloor = max(noiseFloor, runLow)
        run = 0
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
        /** How long a level may hold steady before it is taken for the room: a little over a second. */
        private const val STEADY_FRAMES = 60
        /** Loudest over quietest frame below which a stretch counts as steady. Speech varies far more. */
        private const val STEADY_SPREAD = 1.6f
        /** A stretch that ends at this much of its quietest frame or more has not fallen away. */
        private const val STILL_THERE = 0.75f
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
