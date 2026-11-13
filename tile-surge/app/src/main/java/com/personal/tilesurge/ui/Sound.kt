package com.personal.tilesurge.ui

import android.content.Context
import android.media.AudioAttributes
import android.media.SoundPool
import android.os.Handler
import android.os.Looper
import java.io.File
import java.io.FileOutputStream

/**
 * Plays the game's sound effects. There are no audio files in the app: [SfxSynth] works every
 * sound out when the app starts, and they are written to the cache folder for a SoundPool to play.
 */
class Sound(context: Context, private val prefs: Prefs) {

    private val appContext = context.applicationContext
    private var pool: SoundPool? = null
    private val ids = IntArray(Sfx.entries.size)
    private val ready = HashSet<Int>()

    init {
        try {
            val p = SoundPool.Builder()
                .setMaxStreams(10)
                .setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                        .build()
                )
                .build()
            p.setOnLoadCompleteListener { _, id, status -> if (status == 0) synchronized(ready) { ready.add(id) } }
            pool = p
            val main = Handler(Looper.getMainLooper())
            Thread({
                try {
                    val files = writeAll(File(appContext.cacheDir, "sfx"))
                    main.post {
                        val live = pool ?: return@post
                        for (s in Sfx.entries) ids[s.ordinal] = live.load(files[s.ordinal].path, 1)
                    }
                } catch (e: Exception) {
                    // No sound is better than no game.
                }
            }, "sfx").start()
        } catch (e: Exception) {
            pool = null
        }
    }

    /**
     * @param rate playback speed, 0.5 to 2: a higher rate is a higher note
     */
    fun play(sfx: Sfx, rate: Float = 1f, volume: Float = 1f) {
        if (!prefs.sound) return
        val p = pool ?: return
        val id = ids[sfx.ordinal]
        if (id == 0 || !synchronized(ready) { ready.contains(id) }) return
        val v = volume.coerceIn(0f, 1f)
        p.play(id, v, v, 1, 0, rate.coerceIn(0.5f, 2f))
    }

    fun release() {
        pool?.release()
        pool = null
    }

    private fun writeAll(dir: File): Array<File> {
        dir.mkdirs()
        return Array(Sfx.entries.size) { i ->
            val s = Sfx.entries[i]
            // The version in the name retires old files when a sound is redesigned.
            val f = File(dir, "v${SfxSynth.VERSION}_${s.name.lowercase()}.wav")
            if (!f.exists() || f.length() < 100) {
                val tmp = File(f.path + ".tmp")
                FileOutputStream(tmp).use { it.write(SfxSynth.wav(s)) }
                tmp.renameTo(f)
            }
            f
        }
    }
}
