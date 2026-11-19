package com.personal.aide.transcribe

import org.junit.Assert.assertArrayEquals
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.util.Random
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.math.sign
import kotlin.math.sin
import kotlin.math.sqrt

/**
 * [AutoGain] fed the way [AudioFeed] feeds it: 20 ms frames of 16 kHz audio. A voice is a steady
 * tone of a given loudness; a room is seeded random hiss, so every run hears the same thing.
 */
class AutoGainTest {
    private val boosted = Transcriber.Sensitivity.BOOSTED.maxGain
    private val maximum = Transcriber.Sensitivity.MAXIMUM.maxGain
    private val limits = listOf(boosted, maximum)

    /** Makes the audio of one recording, frame after frame. */
    private class Room(seed: Long = 7) {
        private val random = Random(seed)
        private var clock = 0L

        /** Twenty milliseconds of a voice at [voice] RMS over hiss at [hiss] RMS. Zero for both is digital silence. */
        fun frame(voice: Float = 0f, hiss: Float = 0f): ShortArray = ShortArray(FRAME) {
            val tone = voice * sqrt(2.0) * sin(2 * PI * 180.0 * clock++ / 16_000.0)
            (tone + hiss * random.nextGaussian()).roundToInt().coerceIn(-32_768, 32_767).toShort()
        }
    }

    private fun rms(samples: ShortArray): Float = sqrt(samples.sumOf { it.toDouble() * it } / samples.size).toFloat()

    private fun peak(samples: ShortArray): Int = samples.maxOf { abs(it.toInt()) }

    /** Runs [frames] frames through [gain] and returns each as it came out. */
    private fun AutoGain.hear(room: Room, frames: Int, voice: Float = 0f, hiss: Float = 0f): List<ShortArray> =
        (1..frames).map { room.frame(voice, hiss).also { process(it, it.size) } }

    /**
     * Someone talking the way people do, in bursts with gaps: [seconds] of 300 ms of voice then
     * 200 ms of the room, starting with the room. Returns the frames that held the voice, as they came out.
     */
    private fun AutoGain.conversation(room: Room, seconds: Int, voice: Float, hiss: Float = 20f): List<ShortArray> {
        val spoken = ArrayList<ShortArray>()
        repeat(seconds * 2) {
            hear(room, 10, hiss = hiss)
            spoken += hear(room, 15, voice = voice, hiss = hiss)
        }
        return spoken
    }

    // -------------------------------------------------------------------------------------------
    // Where it starts

    @Test
    fun `it starts with no boost and nobody speaking`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            assertEquals(1f, gain.gain, 0f)
            assertFalse(gain.speaking)
            assertTrue(gain.noiseFloor > 0f)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Silence and the room

    @Test
    fun `silence stays silent, is never taken for speech and moves nothing`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            repeat(500) {
                val frame = ShortArray(FRAME)
                val level = gain.process(frame, frame.size)
                assertFalse("silence was taken for speech", gain.speaking)
                assertEquals(1f, gain.gain, 0f)
                assertEquals(0f, level, 0f)
                assertTrue(frame.all { it == 0.toShort() })
            }
        }
    }

    @Test
    fun `the hiss of a quiet room is left exactly as it is`() {
        for (limit in limits) {
            for (hiss in listOf(6f, 15f, 30f, 45f, 60f)) {
                val gain = AutoGain(limit)
                val room = Room()
                repeat(1_000) {
                    val heard = room.frame(hiss = hiss)
                    val out = heard.copyOf()
                    gain.process(out, out.size)
                    assertFalse("hiss at $hiss was taken for speech", gain.speaking)
                    assertEquals("hiss at $hiss moved the gain", 1f, gain.gain, 0f)
                    assertArrayEquals(heard, out)
                }
            }
        }
    }

    @Test
    fun `a steady hum louder than a quiet room is not pulled up to the level of a voice`() {
        // An air conditioner, a projector fan: steady, there from the first moment, some 46 dB below
        // full scale. Nobody says a word for ten seconds.
        val problems = ArrayList<String>()
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.hear(room, 450, hiss = 150f)
            val out = rms(gain.hear(room, 50, hiss = 150f).reduce { all, frame -> all + frame })
            if (out >= AutoGain.TARGET_RMS / 2) {
                problems += "with a limit of $limit a hum at RMS 150 came out at RMS ${out.roundToInt()} (gain ${gain.gain})"
            }
        }
        assertTrue("speech is aimed at RMS ${AutoGain.TARGET_RMS.roundToInt()}, and $problems", problems.isEmpty())
    }

    @Test
    fun `the room's hiss coming back after dead silence is not pulled up to the level of a voice`() {
        // The phone hands over digital silence for a moment (the microphone warming up, or lent to a
        // call), and then the ordinary hiss of a quiet room returns. Nobody is speaking.
        val problems = ArrayList<String>()
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.hear(room, 25)
            gain.hear(room, 450, hiss = 30f)
            val out = rms(gain.hear(room, 50, hiss = 30f).reduce { all, frame -> all + frame })
            if (out >= AutoGain.TARGET_RMS / 2) {
                problems += "with a limit of $limit hiss at RMS 30 came out at RMS ${out.roundToInt()} (gain ${gain.gain})"
            }
        }
        assertTrue("speech is aimed at RMS ${AutoGain.TARGET_RMS.roundToInt()}, and $problems", problems.isEmpty())
    }

    @Test
    fun `a hum that only just clears the room's level is not turned up either`() {
        // Quieter than the hum above: it counts as speech only until the estimate of the room catches
        // up with it, a matter of half a second, and must not keep what it earned in that time.
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.hear(room, 450, hiss = 100f)
            val out = rms(gain.hear(room, 50, hiss = 100f).reduce { all, frame -> all + frame })
            assertEquals("a hum at RMS 100 came out at RMS $out with a limit of $limit", 100f, out, 15f)
            assertEquals(1f, gain.gain, 0f)
        }
    }

    @Test
    fun `a fan starting up in the middle of a meeting does not undo or add to what speech earned`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.conversation(room, seconds = 4, voice = 150f)
            // The talk stops, and a moment later the fan comes on.
            gain.hear(room, 10, hiss = 20f)
            val earned = gain.gain
            assertTrue(earned > 8f)

            // Louder than the room was, steady, and nobody talking over it.
            gain.hear(room, 300, hiss = 200f)
            assertEquals("the gain after five seconds of the fan", earned, gain.gain, 0.01f)
            assertFalse(gain.speaking)
        }
    }

    @Test
    fun `a long stretch of talk without a pause keeps its boost, because it rises and falls`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.hear(room, 20, hiss = 20f)
            // Three seconds with no gap down to the room, but syllables louder and quieter as speech is.
            repeat(150) { frame -> gain.hear(room, 1, voice = if (frame % 5 < 3) 220f else 90f, hiss = 20f) }
            // Not taken for a steady sound and its boost given back, as an unvarying stretch this long would be.
            assertTrue("three seconds of unbroken talk left the gain at ${gain.gain}", gain.gain > 5f)
            gain.hear(room, 1, voice = 220f, hiss = 20f)
            assertTrue("and its louder syllables still count as speech", gain.speaking)
        }
    }

    @Test
    fun `the room's level is learned from the quiet moments and barely moved by a voice`() {
        val gain = AutoGain(boosted)
        val room = Room()
        gain.hear(room, 100, hiss = 25f)
        assertEquals(25f, gain.noiseFloor, 5f)

        gain.hear(room, 25, voice = 400f, hiss = 25f)
        assertTrue("half a second of talk moved the room's level to ${gain.noiseFloor}", gain.noiseFloor < 80f)

        // A dip is followed at once, but the estimate never reaches nothing at all.
        gain.hear(room, 100)
        assertTrue("two seconds of silence left the room's level at ${gain.noiseFloor}", gain.noiseFloor > 0f && gain.noiseFloor < 5f)
    }

    // -------------------------------------------------------------------------------------------
    // Quiet voices

    @Test
    fun `speaking is true while someone talks and false in silence and in the pauses`() {
        val gain = AutoGain(boosted)
        val room = Room()
        gain.hear(room, 20, hiss = 20f)
        assertFalse(gain.speaking)

        repeat(15) {
            gain.hear(room, 1, voice = 300f, hiss = 20f)
            assertTrue("a voice well above the room is speech", gain.speaking)
        }
        repeat(10) {
            gain.hear(room, 1, hiss = 20f)
            assertFalse("the pause after it is not", gain.speaking)
        }
        gain.hear(room, 1, voice = 300f, hiss = 20f)
        assertTrue(gain.speaking)
        gain.hear(room, 1)
        assertFalse("nor is dead silence", gain.speaking)
    }

    @Test
    fun `a quiet voice is brought up to about the level of someone dictating`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.conversation(room, seconds = 4, voice = 150f)
            val spoken = gain.conversation(room, seconds = 2, voice = 150f)

            val out = rms(spoken.reduce { all, frame -> all + frame })
            assertTrue("a voice at RMS 150 came out at RMS $out", out in AutoGain.TARGET_RMS * 0.7f..AutoGain.TARGET_RMS * 1.15f)
            assertEquals(AutoGain.TARGET_RMS / 150f, gain.gain, 1.5f)
        }
    }

    @Test
    fun `a voice already at dictation level is left alone`() {
        val gain = AutoGain(maximum)
        val room = Room()
        val spoken = gain.conversation(room, seconds = 4, voice = AutoGain.TARGET_RMS * 1.5f)
        assertEquals(1f, gain.gain, 0f)
        assertEquals(AutoGain.TARGET_RMS * 1.5f, rms(spoken.reduce { all, frame -> all + frame }), 60f)
    }

    @Test
    fun `however quiet the voice the boost stops at the limit`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            var highest = 0f
            repeat(20) {
                gain.hear(room, 10, hiss = 4f)
                repeat(15) {
                    gain.hear(room, 1, voice = 35f, hiss = 4f)
                    highest = maxOf(highest, gain.gain)
                }
            }
            assertTrue("the gain went to $highest with a limit of $limit", highest <= limit)
            assertEquals("a whisper gets all the boost there is", limit, gain.gain, limit * 0.02f)
        }
    }

    @Test
    fun `the gain comes up gradually, not in one jump`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.hear(room, 20, hiss = 10f)
            gain.hear(room, 1, voice = 40f, hiss = 10f)
            assertTrue(gain.speaking)
            assertTrue("one frame took the gain to ${gain.gain}", gain.gain > 1f && gain.gain < 1f + (limit - 1f) * 0.25f)
        }
    }

    @Test
    fun `the gain is held through a pause, so the room is not turned up further while nobody talks`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.conversation(room, seconds = 4, voice = 150f)
            val held = gain.gain
            assertTrue(held > 8f)

            repeat(500) {
                gain.hear(room, 1, hiss = 20f)
                assertFalse(gain.speaking)
                assertEquals("the gain moved during a pause", held, gain.gain, 0f)
            }
            gain.hear(room, 250)
            assertEquals("or during silence", held, gain.gain, 0f)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Loud voices

    @Test
    fun `a loud voice after a quiet one brings the gain down within a few frames`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.conversation(room, seconds = 6, voice = 35f, hiss = 4f)
            gain.hear(room, 10, hiss = 4f)
            val before = gain.gain
            assertTrue("a whisper should have earned most of the boost, not $before", before > limit * 0.9f)

            // Someone right by the phone: loud enough to need no boost at all.
            gain.hear(room, 6, voice = 6_000f, hiss = 4f)
            assertTrue(
                "after six frames (an eighth of a second) the gain was still ${gain.gain}, down from $before",
                gain.gain <= 1f + (before - 1f) * 0.1f,
            )

            // And from then on the loud voice passes cleanly: nothing is being squeezed.
            repeat(20) {
                val heard = room.frame(voice = 6_000f, hiss = 4f)
                val out = heard.copyOf()
                gain.process(out, out.size)
                for (index in heard.indices) assertEquals(heard[index] * gain.gain, out[index].toFloat(), 1f)
            }
            assertEquals(1f, gain.gain, 0.01f)
        }
    }

    @Test
    fun `a quiet voice is turned up again once the loud one has finished`() {
        val gain = AutoGain(boosted)
        val room = Room()
        gain.conversation(room, seconds = 2, voice = 6_000f)
        assertEquals(1f, gain.gain, 0.05f)

        gain.conversation(room, seconds = 4, voice = 150f)
        assertEquals(AutoGain.TARGET_RMS / 150f, gain.gain, 1.5f)
    }

    @Test
    fun `a loud voice at full boost is neither wrapped round nor pushed past full scale`() {
        for (limit in limits) {
            val gain = AutoGain(limit)
            val room = Room()
            gain.conversation(room, seconds = 6, voice = 35f, hiss = 4f)
            assertTrue(gain.gain > limit * 0.9f)

            // The worst case: a shout, as loud as the microphone goes, while the gain is still all the way up.
            repeat(10) {
                val heard = room.frame(voice = 40_000f)
                val out = heard.copyOf()
                gain.process(out, out.size)
                for (index in heard.indices) {
                    assertEquals("sample $index changed sign: ${heard[index]} became ${out[index]}", sign(heard[index].toFloat()), sign(out[index].toFloat()))
                    assertTrue("sample $index left the range: ${out[index]}", abs(out[index].toInt()) <= 32_767)
                    // Squeezed, perhaps, but never down below half of full scale or below where it started.
                    assertTrue("a boost made a sample quieter: ${heard[index]} became ${out[index]}", abs(out[index].toInt()) >= minOf(abs(heard[index].toInt()), 16_000))
                }
                // Louder in is never quieter out.
                val byLoudness = heard.indices.sortedBy { abs(heard[it].toInt()) }
                for ((quieter, louder) in byLoudness.zipWithNext()) {
                    assertTrue(abs(out[quieter].toInt()) <= abs(out[louder].toInt()))
                }
            }
        }
    }

    @Test
    fun `a loud voice is eased under full scale, not cut off flat`() {
        // Someone shouting into the phone from the start: the gain has nothing to add, and the peaks
        // are louder than the limiter lets through unchanged.
        val gain = AutoGain(boosted)
        val room = Room()
        gain.hear(room, 10, hiss = 20f)
        repeat(50) {
            val heard = room.frame(voice = 23_000f)
            val out = heard.copyOf()
            gain.process(out, out.size)
            assertEquals(1f, gain.gain, 0f)

            val top = peak(out)
            assertTrue("the peaks were let through at $top", top < 32_767)
            assertTrue("the peaks were cut down to $top", top > 20_000)
            assertTrue("the crest of the wave is flat: ${out.count { abs(it.toInt()) == top }} samples sit at $top", out.count { abs(it.toInt()) == top } <= 4)
            for (index in heard.indices) {
                val loud = abs(heard[index].toInt())
                // The body of the wave, up to half of full scale, is untouched; only the peaks are eased.
                if (loud <= 16_000) assertEquals(heard[index], out[index])
                assertTrue(abs(out[index].toInt()) <= loud)
                assertEquals(sign(heard[index].toFloat()), sign(out[index].toFloat()))
            }
        }
    }

    // -------------------------------------------------------------------------------------------
    // Whatever it hears

    @Test
    fun `the gain stays between one and the limit whatever it hears`() {
        for (limit in limits + Transcriber.Sensitivity.PHONE.maxGain) {
            val gain = AutoGain(limit)
            val room = Room(seed = 42)
            val dice = Random(limit.toLong())
            repeat(600) { round ->
                // A stretch of one kind of sound, from a few frames to a couple of seconds.
                val frames = 1 + dice.nextInt(100)
                val voice = when (dice.nextInt(7)) {
                    0, 1 -> 0f
                    2 -> 15f + dice.nextInt(60)
                    3 -> 100f + dice.nextInt(900)
                    4 -> 1_000f + dice.nextInt(9_000)
                    5 -> 50_000f
                    else -> 20f
                }
                val hiss = if (dice.nextInt(4) == 0) 0f else dice.nextInt(400).toFloat()
                repeat(frames) {
                    val frame = room.frame(voice, hiss)
                    val level = gain.process(frame, frame.size)
                    assertTrue("round $round: the gain is ${gain.gain} with a limit of $limit", gain.gain in 1f..limit)
                    assertTrue("round $round: the level is $level", level in 0f..1f)
                    assertTrue("round $round: the room's level is ${gain.noiseFloor}", gain.noiseFloor > 0f && gain.noiseFloor.isFinite())
                }
            }
        }
    }

    @Test
    fun `with no boost allowed ordinary audio passes through untouched`() {
        val gain = AutoGain(Transcriber.Sensitivity.PHONE.maxGain)
        val room = Room()
        for (voice in listOf(0f, 40f, 400f, 4_000f)) {
            repeat(60) {
                val heard = room.frame(voice, hiss = 20f)
                val out = heard.copyOf()
                gain.process(out, out.size)
                assertArrayEquals(heard, out)
                assertEquals(1f, gain.gain, 0f)
            }
        }
    }

    @Test
    fun `only the samples it is given are touched`() {
        val gain = AutoGain(maximum)
        val room = Room()
        gain.conversation(room, seconds = 4, voice = 100f)
        assertTrue(gain.gain > 4f)
        val before = Triple(gain.gain, gain.noiseFloor, gain.speaking)

        val nothing = room.frame(voice = 100f)
        val untouched = nothing.copyOf()
        assertEquals(0f, gain.process(nothing, 0), 0f)
        assertEquals(0f, gain.process(nothing, -5), 0f)
        assertArrayEquals(untouched, nothing)
        assertEquals("an empty frame changes nothing", before, Triple(gain.gain, gain.noiseFloor, gain.speaking))

        // A short read from the microphone: only its first hundred samples are real.
        val short = room.frame(voice = 100f)
        val original = short.copyOf()
        gain.process(short, 100)
        assertArrayEquals(original.copyOfRange(100, FRAME), short.copyOfRange(100, FRAME))
        assertTrue((0 until 100).any { short[it] != original[it] })
    }

    // -------------------------------------------------------------------------------------------
    // The limiter and the level meter

    @Test
    fun `the limiter leaves ordinary samples alone and squeezes louder ones smoothly under the ceiling`() {
        // Anything up to half of full scale is ordinary.
        for (value in listOf(0f, 1f, -1f, 300f, -12_345f, 16_000f, -16_000f)) {
            assertEquals(value, AutoGain.limit(value), 0f)
        }

        // From nothing up to twice full scale, every louder input is still a louder output (no flat
        // top), by no more than it was louder going in (no step where the squeezing begins).
        var last = AutoGain.limit(0f)
        var value = 100f
        while (value <= 65_534f) {
            val out = AutoGain.limit(value)
            assertTrue("$value came out at $out, no louder than the sample before it", out > last)
            assertTrue("$value came out at $out, a jump from $last", out - last <= 100.01f)
            assertTrue("$value came out at $out", out < 32_767f)
            assertTrue(out <= value)
            assertEquals("negative samples are treated like positive ones", -out, AutoGain.limit(-value), 0f)
            last = out
            value += 100f
        }
    }

    @Test
    fun `nothing the limiter is given leaves the 16-bit range`() {
        for (value in listOf(32_767f, 32_768f, 100_000f, 32_768f * 40f, 1e9f, Float.MAX_VALUE)) {
            assertTrue(AutoGain.limit(value) <= 32_767f)
            assertTrue(AutoGain.limit(-value) >= -32_768f)
            assertTrue("$value was cut right down, to ${AutoGain.limit(value)}", AutoGain.limit(value) > 23_000f)
        }
    }

    @Test
    fun `the level meter reads nothing for silence, full for loud speech and rises in between`() {
        fun below(decibels: Double): Float = (32_768.0 * 10.0.pow(-decibels / 20.0)).toFloat()

        assertEquals(0f, AutoGain.level(0f), 0f)
        assertEquals(0f, AutoGain.level(1f), 0f)
        assertEquals(0f, AutoGain.level(below(60.0)), 0f)
        assertEquals(0f, AutoGain.level(below(50.0)), 0.001f)
        assertEquals(0.5f, AutoGain.level(below(32.0)), 0.001f)
        assertEquals(1f, AutoGain.level(below(14.0)), 0.001f)
        assertEquals(1f, AutoGain.level(32_768f), 0f)
        assertEquals(1f, AutoGain.level(1e9f), 0f)

        val readings = (0..60).map { AutoGain.level(below(60.0 - it)) }
        assertEquals("louder never reads lower", readings.sorted(), readings)
    }

    @Test
    fun `the level reported is that of the audio after the boost`() {
        val gain = AutoGain(boosted)
        val room = Room()
        gain.hear(room, 20, hiss = 20f)

        val first = room.frame(voice = 150f, hiss = 20f)
        val firstLevel = gain.process(first, first.size)
        gain.conversation(room, seconds = 4, voice = 150f)
        val later = room.frame(voice = 150f, hiss = 20f)
        val laterLevel = gain.process(later, later.size)

        assertEquals(AutoGain.level(rms(first)), firstLevel, 0.01f)
        assertEquals(AutoGain.level(rms(later)), laterLevel, 0.01f)
        assertTrue("the same voice reads higher once it is being turned up: $firstLevel then $laterLevel", laterLevel > firstLevel + 0.3f)
    }

    private companion object {
        /** Twenty milliseconds at 16 kHz, the size of frame the feed works in. */
        const val FRAME = 320
    }
}
