package com.personal.tilesurge.ui

import android.content.Context
import android.media.AudioAttributes
import android.media.MediaPlayer
import android.media.SoundPool
import android.os.Handler
import android.os.HandlerThread
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

    /**
     * Starting a sound can take a few milliseconds on older phones, which is a dropped frame in the
     * middle of a chain. So sounds are started from a thread of their own, made when the first one plays.
     */
    private var playThread: HandlerThread? = null
    private var player: Handler? = null

    // ---- music
    private var music: MediaPlayer? = null
    private var musicFile: File? = null
    private var musicWanted = false

    /**
     * Says whether the tune should be playing right now (the app is in front). It plays only if the
     * player also has music switched on.
     */
    fun setMusicPlaying(wanted: Boolean) {
        musicWanted = wanted
        syncMusic()
    }

    /** Call after the music switch changes. */
    fun syncMusic() {
        val on = musicWanted && prefs.music
        try {
            val m = music
            if (!on) {
                if (m != null && m.isPlaying) m.pause()
                return
            }
            if (m != null) {
                if (!m.isPlaying) m.start()
                return
            }
            val f = musicFile ?: return // still being made; it starts when it is ready
            music = MediaPlayer().apply {
                setAudioAttributes(
                    AudioAttributes.Builder()
                        .setUsage(AudioAttributes.USAGE_GAME)
                        .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                        .build()
                )
                setDataSource(f.path)
                isLooping = true
                setVolume(MUSIC_VOLUME, MUSIC_VOLUME)
                prepare()
                start()
            }
        } catch (e: Exception) {
            // no tune is better than no game
            try {
                music?.release()
            } catch (ignored: Exception) {
            }
            music = null
        }
    }

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
                    // the tune takes a little longer to work out, so it comes second
                    val tune = File(File(appContext.cacheDir, "sfx"), "music_v${MusicSynth.VERSION}.wav")
                    if (!tune.exists() || tune.length() < 1000) {
                        val tmp = File(tune.path + ".tmp")
                        FileOutputStream(tmp).use { it.write(MusicSynth.wav()) }
                        tmp.renameTo(tune)
                    }
                    main.post {
                        if (pool != null) {
                            musicFile = tune
                            syncMusic()
                        }
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
        val r = rate.coerceIn(0.5f, 2f)
        val h = player ?: run {
            val t = HandlerThread("sfx-play").apply { start() }
            playThread = t
            Handler(t.looper).also { player = it }
        }
        h.post {
            try {
                p.play(id, v, v, 1, 0, r)
            } catch (e: Exception) {
                // the pool was let go between asking and playing
            }
        }
    }

    fun release() {
        try {
            music?.release()
        } catch (e: Exception) {
        }
        music = null
        musicFile = null
        player?.removeCallbacksAndMessages(null)
        playThread?.quitSafely()
        player = null
        playThread = null
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

    private companion object {
        /** Quiet enough to sit under the sound effects. */
        const val MUSIC_VOLUME = 0.32f
    }
}
