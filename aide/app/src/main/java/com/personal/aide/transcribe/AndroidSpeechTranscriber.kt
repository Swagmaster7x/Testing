package com.personal.aide.transcribe

import android.content.Context
import android.content.Intent
import android.media.AudioManager
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

/**
 * Live transcription with the phone's own speech recognizer, the one behind voice typing. It
 * costs nothing, needs no extra key or download, and on recent phones runs entirely on the
 * device.
 *
 * The recognizer was built for one utterance at a time, so this class keeps it going for a whole
 * meeting: every time a session ends (a result, a pause, an error) it starts the next one, and
 * anything heard but not yet confirmed is kept rather than dropped. On Android 13 and later it
 * asks for a "segmented session", which returns results as people speak without a gap between
 * sentences; if the recognizer on this phone turns out not to support that, it quietly goes back
 * to plain sessions.
 */
class AndroidSpeechTranscriber(context: Context) : Transcriber {
    private val context = context.applicationContext
    private val handler = Handler(Looper.getMainLooper())
    private val audio = context.getSystemService(Context.AUDIO_SERVICE) as? AudioManager

    private var recognizer: SpeechRecognizer? = null
    private var listener: Transcriber.Listener? = null
    private var config = Transcriber.Config()
    private var running = false
    private var onDevice = false
    /** Ask for segmented sessions and punctuation; switched off if a session rejects them. */
    private var enhanced = Build.VERSION.SDK_INT >= 33
    private var pending = ""
    private var lastFinal = ""
    private var sessionStart = 0L
    private var heardThisSession = false
    private var failures = 0
    /** Sessions in a row that ended at once with nothing heard. */
    private var quietStreak = 0
    private var muted = false

    private val restart = Runnable { listen() }

    override fun start(config: Transcriber.Config, listener: Transcriber.Listener) {
        stop()
        this.config = config
        this.listener = listener
        if (!SpeechRecognizer.isRecognitionAvailable(context)) {
            listener.onFatal(
                "This phone has no speech recognition service. Install or enable \"Speech Recognition & Synthesis\" (or the Google app) and try again.",
            )
            return
        }
        running = true
        failures = 0
        quietStreak = 0
        pending = ""
        lastFinal = ""
        enhanced = Build.VERSION.SDK_INT >= 33
        onDevice = config.preferOnDevice && Build.VERSION.SDK_INT >= 31 &&
            runCatching { SpeechRecognizer.isOnDeviceRecognitionAvailable(context) }.getOrDefault(false)
        if (config.muteChimes) mute(true)
        create()
        listen()
    }

    override fun stop() {
        handler.removeCallbacks(restart)
        val wasRunning = running
        running = false
        if (wasRunning) commitPending()
        recognizer?.let { old ->
            runCatching { old.cancel() }
            runCatching { old.destroy() }
        }
        recognizer = null
        listener = null
        if (muted) mute(false)
    }

    private fun create() {
        recognizer?.let { old -> runCatching { old.destroy() } }
        recognizer = runCatching {
            if (onDevice && Build.VERSION.SDK_INT >= 31) SpeechRecognizer.createOnDeviceSpeechRecognizer(context)
            else SpeechRecognizer.createSpeechRecognizer(context)
        }.getOrElse {
            onDevice = false
            runCatching { SpeechRecognizer.createSpeechRecognizer(context) }.getOrNull()
        }
        recognizer?.setRecognitionListener(callbacks)
    }

    private fun listen() {
        if (!running) return
        val active = recognizer ?: run {
            create()
            recognizer
        }
        if (active == null) {
            fatal("Speech recognition couldn't be started on this phone.")
            return
        }
        sessionStart = SystemClock.elapsedRealtime()
        heardThisSession = false
        try {
            active.startListening(intent())
        } catch (e: Exception) {
            retry(recreate = true, delayMs = 500)
        }
    }

    private fun intent(): Intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
        putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
        putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
        putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
        putExtra(RecognizerIntent.EXTRA_CALLING_PACKAGE, context.packageName)
        if (config.language.isNotBlank()) putExtra(RecognizerIntent.EXTRA_LANGUAGE, config.language)
        if (!onDevice && config.preferOnDevice) putExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, true)
        if (enhanced && Build.VERSION.SDK_INT >= 33) {
            // One long session that hands back each sentence as it ends and only finishes after
            // a real silence, so nothing is lost between sentences.
            putExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION, RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS)
            putExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS, SILENCE_MS)
            putExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING, RecognizerIntent.FORMATTING_OPTIMIZE_QUALITY)
        }
    }

    private val callbacks = object : RecognitionListener {
        override fun onReadyForSpeech(params: Bundle?) {
            listener?.onNotice(null)
        }

        override fun onBeginningOfSpeech() = Unit

        override fun onRmsChanged(rmsdB: Float) {
            // Recognizers report roughly -2 dB (silence) to 10 dB (loud speech).
            listener?.onLevel(((rmsdB + 2f) / 12f).coerceIn(0f, 1f))
        }

        override fun onBufferReceived(buffer: ByteArray?) = Unit
        override fun onEndOfSpeech() = Unit

        override fun onPartialResults(partialResults: Bundle?) {
            val text = best(partialResults)
            if (text.isEmpty()) return
            heard()
            pending = text
            listener?.onPartial(text)
        }

        override fun onSegmentResults(segmentResults: Bundle) {
            heard()
            commit(best(segmentResults).ifEmpty { pending })
        }

        override fun onEndOfSegmentedSession() {
            commitPending()
            again(SHORT_DELAY_MS)
        }

        override fun onResults(results: Bundle?) {
            val text = best(results)
            if (text.isNotEmpty()) heard()
            commit(text.ifEmpty { pending })
            again(SHORT_DELAY_MS)
        }

        override fun onError(error: Int) = handleError(error)
        override fun onEvent(eventType: Int, params: Bundle?) = Unit
    }

    private fun handleError(error: Int) {
        if (!running) return
        // Whatever was heard before the session broke off is still worth keeping.
        commitPending()
        val quick = SystemClock.elapsedRealtime() - sessionStart < QUICK_FAILURE_MS && !heardThisSession
        when (error) {
            // Nobody spoke, or nothing recognizable was said: normal in a meeting. Keep listening. A
            // recognizer that gives up the instant it starts is slowed down so it can't spin, but a
            // quiet room never ends the recording.
            SpeechRecognizer.ERROR_NO_MATCH, SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> {
                quietStreak = if (quick) (quietStreak + 1).coerceAtMost(5) else 0
                again((SHORT_DELAY_MS shl quietStreak).coerceAtMost(MAX_QUIET_DELAY_MS))
            }

            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS ->
                fatal("Aide needs the microphone permission to transcribe. Allow it in the phone's settings for this app.")

            ERROR_LANGUAGE_NOT_SUPPORTED, ERROR_LANGUAGE_UNAVAILABLE ->
                if (onDevice) {
                    // The on-device model for this language isn't installed; the network recognizer may have it.
                    onDevice = false
                    retry(recreate = true, delayMs = 300)
                } else {
                    fatal("Speech recognition isn't available for this language on this phone. Pick another language in Settings.")
                }

            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> {
                runCatching { recognizer?.cancel() }
                retry(recreate = false, delayMs = 500)
            }

            SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> {
                listener?.onNotice("No connection for speech recognition. Retrying…")
                retry(recreate = false, delayMs = backoff())
            }

            SpeechRecognizer.ERROR_AUDIO -> {
                listener?.onNotice("The microphone is busy (a call, perhaps). Retrying…")
                retry(recreate = false, delayMs = backoff())
            }

            else -> {
                // ERROR_CLIENT, ERROR_SERVER and the rest. A session that dies at once without hearing
                // anything usually means the recognizer didn't like how it was asked.
                when {
                    quick && enhanced -> enhanced = false
                    quick && onDevice && failures >= 2 -> onDevice = false
                }
                retry(recreate = true, delayMs = backoff())
            }
        }
    }

    private fun heard() {
        heardThisSession = true
        failures = 0
        quietStreak = 0
    }

    private fun again(delayMs: Long) {
        if (!running) return
        handler.removeCallbacks(restart)
        handler.postDelayed(restart, delayMs)
    }

    private fun retry(recreate: Boolean, delayMs: Long) {
        if (!running) return
        failures++
        if (failures > MAX_FAILURES) {
            fatal("Speech recognition keeps failing on this phone. What was captured so far has been kept.")
            return
        }
        if (failures >= 3) listener?.onNotice("Speech recognition is having trouble. Retrying…")
        if (recreate || failures % 4 == 0) create()
        again(delayMs)
    }

    private fun backoff(): Long = (500L shl failures.coerceAtMost(4)).coerceAtMost(8_000L)

    private fun commitPending() {
        if (pending.isNotBlank()) commit(pending)
    }

    private fun commit(text: String) {
        val clean = text.trim()
        pending = ""
        // Some recognizers report the last segment twice: once as a segment, once as the session's result.
        if (clean.isEmpty() || clean == lastFinal) return
        lastFinal = clean
        listener?.onFinal(clean)
    }

    private fun best(bundle: Bundle?): String =
        bundle?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)?.firstOrNull()?.trim().orEmpty()

    private fun fatal(message: String) {
        val target = listener
        stop()
        target?.onFatal(message)
    }

    private fun mute(on: Boolean) {
        runCatching {
            audio?.adjustStreamVolume(
                AudioManager.STREAM_MUSIC,
                if (on) AudioManager.ADJUST_MUTE else AudioManager.ADJUST_UNMUTE,
                0,
            )
            muted = on
        }
    }

    private companion object {
        const val SHORT_DELAY_MS = 120L
        const val MAX_QUIET_DELAY_MS = 2_000L
        const val QUICK_FAILURE_MS = 1_500L
        const val MAX_FAILURES = 25
        const val SILENCE_MS = 6_000L

        // Added in API 31; spelled out so this compiles against the constants on any SDK.
        const val ERROR_LANGUAGE_NOT_SUPPORTED = 12
        const val ERROR_LANGUAGE_UNAVAILABLE = 13
    }
}
