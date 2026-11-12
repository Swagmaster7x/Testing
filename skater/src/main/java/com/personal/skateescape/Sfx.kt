package com.personal.skateescape

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import com.personal.skateescape.game.Event
import kotlin.math.PI
import kotlin.math.sin

/** Little synthesised sound effects, so the app ships no audio files. */
class Sfx {
    var enabled = true
    private val tracks = HashMap<Event, AudioTrack>()

    init {
        try {
            tracks[Event.COIN] = tone(0.09f, 0.35f) { t -> if (t < 0.04f) 1320f else 1760f }
            tracks[Event.JUMP] = tone(0.16f, 0.35f) { t -> 320f + 2200f * t }
            tracks[Event.LAND] = tone(0.07f, 0.4f) { t -> 160f - 900f * t }
            tracks[Event.RAMP] = tone(0.3f, 0.4f) { t -> 260f + 2600f * t }
            tracks[Event.TRICK] = tone(0.32f, 0.4f) { t -> if (t < 0.1f) 660f else if (t < 0.2f) 880f else 1320f }
            tracks[Event.POWER] = tone(0.4f, 0.4f) { t -> 440f + 1500f * t + 120f * sin(t * 60f) }
            tracks[Event.STUMBLE] = tone(0.25f, 0.5f) { t -> 220f - 500f * t }
            tracks[Event.CRASH] = tone(0.5f, 0.6f) { t -> 180f - 260f * t + 40f * sin(t * 300f) }
            tracks[Event.MISS] = tone(0.12f, 0.3f) { _ -> 150f }
        } catch (e: Exception) {
            // No sound is better than no game.
            release()
        }
    }

    fun play(event: Event) {
        if (!enabled) return
        val track = tracks[event] ?: return
        try {
            if (track.playState == AudioTrack.PLAYSTATE_PLAYING) track.pause()
            track.reloadStaticData()
            track.play()
        } catch (e: Exception) {
            // Ignore: a sound that fails to play must never stop the game.
        }
    }

    fun release() {
        for (t in tracks.values) {
            try { t.release() } catch (e: Exception) { /* already gone */ }
        }
        tracks.clear()
    }

    private fun tone(seconds: Float, volume: Float, freq: (Float) -> Float): AudioTrack {
        val n = (RATE * seconds).toInt()
        val pcm = ShortArray(n)
        var phase = 0.0
        for (i in 0 until n) {
            val t = i / RATE.toFloat()
            phase += 2.0 * PI * freq(t).coerceAtLeast(30f) / RATE
            val fade = minOf(1f, i / 200f, (n - i) / (n * 0.4f))
            // A soft square wave gives an arcade feel.
            val wave = sin(phase) + 0.35 * sin(phase * 3) + 0.15 * sin(phase * 5)
            pcm[i] = (wave * fade * volume * 0.6 * Short.MAX_VALUE).toInt().coerceIn(-32767, 32767).toShort()
        }
        val track = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_GAME)
                    .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setSampleRate(RATE)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setTransferMode(AudioTrack.MODE_STATIC)
            .setBufferSizeInBytes(n * 2)
            .build()
        track.write(pcm, 0, n)
        return track
    }

    private companion object {
        const val RATE = 22050
    }
}
