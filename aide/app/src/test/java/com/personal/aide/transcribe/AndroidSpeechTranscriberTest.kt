package com.personal.aide.transcribe

import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.pm.ResolveInfo
import android.media.AudioManager
import android.os.Bundle
import android.os.Looper
import android.speech.RecognitionService
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowSpeechRecognizer
import java.time.Duration

/**
 * [AndroidSpeechTranscriber] driven through Robolectric's stand-in for the phone's speech
 * recognizer: the test plays the recognition service, calling the listener the way a phone would.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AndroidSpeechTranscriberTest {
    private val context: Context = ApplicationProvider.getApplicationContext()
    private lateinit var transcriber: AndroidSpeechTranscriber
    private val heard = Heard()

    /** Everything the transcriber told its listener, in order. */
    private class Heard : Transcriber.Listener {
        val partials = ArrayList<String>()
        val finals = ArrayList<String>()
        val levels = ArrayList<Float>()
        val notices = ArrayList<String?>()
        val fatals = ArrayList<String>()

        override fun onPartial(text: String) { partials += text }
        override fun onFinal(text: String) { finals += text }
        override fun onLevel(level: Float) { levels += level }
        override fun onNotice(notice: String?) { notices += notice }
        override fun onFatal(message: String) { fatals += message }
    }

    @Before
    fun setUp() {
        transcriber = AndroidSpeechTranscriber(context)
    }

    @After
    fun tearDown() {
        transcriber.stop()
        idle()
    }

    // -------------------------------------------------------------------------------------------
    // Playing the phone

    /** A phone with a speech recognition service installed, as nearly all have. */
    private fun installSpeechService() {
        @Suppress("DEPRECATION")
        shadowOf(context.packageManager).addResolveInfoForIntent(Intent(RecognitionService.SERVICE_INTERFACE), ResolveInfo())
    }

    private fun idle() = shadowOf(Looper.getMainLooper()).idle()

    /** Lets [millis] pass, running whatever falls due, such as the transcriber starting its next session. */
    private fun advance(millis: Long) {
        shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(millis))
        idle()
    }

    private fun start(config: Transcriber.Config = Transcriber.Config(), listener: Transcriber.Listener = heard) {
        installSpeechService()
        transcriber.start(config, listener)
        idle()
    }

    private fun latest(): SpeechRecognizer = ShadowSpeechRecognizer.getLatestSpeechRecognizer()

    /** The recognizer the transcriber is using now. */
    private fun recognizer(): ShadowSpeechRecognizer = shadowOf(latest())

    /** The request the transcriber last sent the recognizer: one per listening session. */
    private fun session(): Intent = recognizer().lastRecognizerIntent

    private fun words(vararg texts: String) = Bundle().apply { putStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION, arrayListOf(*texts)) }

    /** Asserts that a new listening session began after [before], however long the transcriber chose to wait. */
    private fun assertListeningAgain(before: Intent) {
        advance(5_000)
        assertNotSame("the transcriber should have started listening again", before, session())
        assertTrue(heard.fatals.isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Starting

    @Test
    fun `starting asks the recognizer for free-form speech with partial results`() {
        start()

        val request = session()
        assertEquals(RecognizerIntent.ACTION_RECOGNIZE_SPEECH, request.action)
        assertEquals(RecognizerIntent.LANGUAGE_MODEL_FREE_FORM, request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL))
        assertTrue(request.getBooleanExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false))
        assertTrue(heard.fatals.isEmpty())
        assertFalse(recognizer().isDestroyed)
    }

    @Test
    fun `the chosen language is passed on, and no language means the phone's own`() {
        start(Transcriber.Config(language = "en-GB"))
        assertEquals("en-GB", session().getStringExtra(RecognizerIntent.EXTRA_LANGUAGE))

        start(Transcriber.Config(language = "  "))
        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_LANGUAGE))
    }

    @Test
    fun `preferring on-device recognition asks the network recognizer to stay offline when there is no on-device one`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(false)
        start(Transcriber.Config(preferOnDevice = true))
        assertTrue(session().getBooleanExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false))

        start(Transcriber.Config(preferOnDevice = false))
        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE))
    }

    @Test
    fun `a phone with no speech recognition service is told so at once`() {
        // No service installed.
        transcriber.start(Transcriber.Config(), heard)
        idle()

        assertEquals(1, heard.fatals.size)
        assertTrue(heard.fatals.single(), heard.fatals.single().contains("no speech recognition service"))
        assertNull("nothing should have been started", ShadowSpeechRecognizer.getLatestSpeechRecognizer())
    }

    @Test
    @Config(sdk = [30])
    fun `before Android 12 the plain recognizer is used with a plain request`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(true)
        start(Transcriber.Config(preferOnDevice = true))

        val request = session()
        assertFalse(request.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))
        assertFalse(request.hasExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING))
        assertTrue("there is no on-device recognizer to create, so the request asks to stay offline", request.getBooleanExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false))

        recognizer().triggerOnResults(words("still works"))
        assertEquals(listOf("still works"), heard.finals)
    }

    // -------------------------------------------------------------------------------------------
    // Hearing

    @Test
    fun `partial results are passed on as they change`() {
        start()
        recognizer().triggerOnPartialResults(words("we"))
        recognizer().triggerOnPartialResults(words("we should"))
        recognizer().triggerOnPartialResults(words("  we should ship  "))
        recognizer().triggerOnPartialResults(words())
        recognizer().triggerOnPartialResults(null)

        assertEquals(listOf("we", "we should", "we should ship"), heard.partials)
        assertTrue(heard.finals.isEmpty())
    }

    @Test
    fun `results are delivered and listening starts again`() {
        start()
        val first = session()
        recognizer().triggerOnPartialResults(words("hello every"))
        recognizer().triggerOnResults(words(" hello everyone ", "hollow everyone"))

        assertEquals("only the recognizer's best guess, trimmed", listOf("hello everyone"), heard.finals)
        assertListeningAgain(first)

        val second = session()
        recognizer().triggerOnResults(words("let's get started"))
        assertEquals(listOf("hello everyone", "let's get started"), heard.finals)
        assertListeningAgain(second)
    }

    @Test
    fun `a whole meeting of sessions is kept in order`() {
        start()
        val said = (1..40).map { "sentence number $it" }
        for (sentence in said) {
            val before = session()
            recognizer().triggerOnPartialResults(words(sentence.dropLast(2)))
            recognizer().triggerOnResults(words(sentence))
            assertListeningAgain(before)
        }
        assertEquals(said, heard.finals)
    }

    @Test
    fun `a partial followed by 'no match' is not lost`() {
        start()
        val first = session()
        recognizer().triggerOnPartialResults(words("we should ship on friday"))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)

        assertEquals(listOf("we should ship on friday"), heard.finals)
        assertListeningAgain(first)
    }

    @Test
    fun `a partial followed by a speech timeout is not lost`() {
        start()
        val first = session()
        recognizer().triggerOnPartialResults(words("and then"))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_SPEECH_TIMEOUT)

        assertEquals(listOf("and then"), heard.finals)
        assertListeningAgain(first)
    }

    @Test
    fun `a partial followed by any error is kept, even a fatal one`() {
        for (error in listOf(SpeechRecognizer.ERROR_NETWORK, SpeechRecognizer.ERROR_AUDIO, SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_SERVER, SpeechRecognizer.ERROR_RECOGNIZER_BUSY, SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)) {
            val listener = Heard()
            start(listener = listener)
            recognizer().triggerOnPartialResults(words("heard before error $error"))
            recognizer().triggerOnError(error)
            assertEquals("error $error", listOf("heard before error $error"), listener.finals)
        }
    }

    @Test
    fun `a result with no text falls back to what was heard so far`() {
        start()
        recognizer().triggerOnPartialResults(words("almost done"))
        recognizer().triggerOnResults(words())
        assertEquals(listOf("almost done"), heard.finals)

        advance(5_000)
        recognizer().triggerOnPartialResults(words("one more"))
        recognizer().triggerOnResults(null)
        assertEquals(listOf("almost done", "one more"), heard.finals)
    }

    @Test
    fun `silence delivers nothing`() {
        start()
        val first = session()
        recognizer().triggerOnResults(words())
        recognizer().triggerOnResults(words("   "))
        assertTrue(heard.finals.isEmpty())
        assertListeningAgain(first)
    }

    @Test
    fun `the same text reported as a segment and again as the session's result is delivered once`() {
        start()
        recognizer().triggerOnSegmentResults(words("let's begin"))
        recognizer().triggerOnResults(words("let's begin"))
        assertEquals(listOf("let's begin"), heard.finals)
    }

    @Test
    fun `a result the recognizer reports twice is delivered once`() {
        start()
        recognizer().triggerOnResults(words("thanks everyone"))
        recognizer().triggerOnResults(words("thanks everyone"))
        assertEquals(listOf("thanks everyone"), heard.finals)
    }

    @Test
    fun `a partial confirmed by the result is delivered once`() {
        start()
        recognizer().triggerOnPartialResults(words("sounds good"))
        recognizer().triggerOnResults(words("sounds good"))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)
        assertEquals(listOf("sounds good"), heard.finals)
    }

    @Test
    fun `the same words said again in a later session are kept`() {
        start()
        val first = session()
        recognizer().triggerOnResults(words("yes"))
        assertListeningAgain(first)

        // Someone else answers "yes" too, a moment later.
        val second = session()
        recognizer().triggerOnResults(words("yes"))
        assertListeningAgain(second)
        recognizer().triggerOnPartialResults(words("yes"))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)

        assertEquals(listOf("yes", "yes", "yes"), heard.finals)
    }

    @Test
    fun `a segmented session hands back each sentence and its unfinished tail`() {
        start()
        val first = session()
        assertTrue("on Android 13 and later a segmented session is asked for", first.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))

        recognizer().triggerOnSegmentResults(words("first sentence"))
        recognizer().triggerOnPartialResults(words("second sent"))
        recognizer().triggerOnSegmentResults(words("second sentence"))
        recognizer().triggerOnPartialResults(words("and a tail"))
        recognizer().triggerOnEndOfSegmentedSession()

        assertEquals(listOf("first sentence", "second sentence", "and a tail"), heard.finals)
        assertListeningAgain(first)
    }

    @Test
    fun `a segment with no text of its own uses the partial`() {
        start()
        recognizer().triggerOnPartialResults(words("only heard as a partial"))
        recognizer().triggerOnSegmentResults(words())
        assertEquals(listOf("only heard as a partial"), heard.finals)
    }

    @Test
    fun `loudness is reported as a level between nothing and full`() {
        start()
        for (rms in listOf(-2f, 4f, 10f, -40f, 30f)) recognizer().triggerOnRmsChanged(rms)
        assertEquals(listOf(0f, 0.5f, 1f, 0f, 1f), heard.levels)
    }

    // -------------------------------------------------------------------------------------------
    // Trouble

    @Test
    fun `a missing microphone permission is fatal`() {
        start()
        val first = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)

        assertEquals(1, heard.fatals.size)
        assertTrue(heard.fatals.single(), heard.fatals.single().contains("microphone permission"))
        assertTrue("the recognizer is released", recognizer().isDestroyed)

        advance(30_000)
        assertSame("nothing is listening any more", first, session())
        assertEquals(1, heard.fatals.size)
    }

    @Test
    fun `after a fatal error nothing more is delivered`() {
        start()
        val shadow = recognizer()
        shadow.triggerOnError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)
        shadow.triggerOnPartialResults(words("late"))
        shadow.triggerOnResults(words("too late"))
        shadow.triggerOnError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)

        assertTrue(heard.finals.isEmpty())
        assertTrue(heard.partials.isEmpty())
        assertEquals(1, heard.fatals.size)
    }

    @Test
    fun `a language the on-device recognizer lacks falls back to the ordinary recognizer`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(true)
        start(Transcriber.Config(language = "cy-GB", preferOnDevice = true))
        val onDevice = latest()
        assertFalse("the on-device recognizer needs no asking to stay offline", session().hasExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE))

        shadowOf(onDevice).triggerOnError(ERROR_LANGUAGE_UNAVAILABLE)
        advance(5_000)

        assertTrue("falling back is not a failure the user needs to see: ${heard.fatals}", heard.fatals.isEmpty())
        assertNotSame("a different recognizer takes over", onDevice, latest())
        assertTrue(shadowOf(onDevice).isDestroyed)
        val request = session()
        assertEquals("cy-GB", request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE))
        assertTrue(request.getBooleanExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false))

        recognizer().triggerOnResults(words("bore da"))
        assertEquals(listOf("bore da"), heard.finals)
    }

    @Test
    fun `an unsupported language on the on-device recognizer falls back too`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(true)
        start(Transcriber.Config(language = "cy-GB"))
        val onDevice = latest()

        shadowOf(onDevice).triggerOnError(ERROR_LANGUAGE_NOT_SUPPORTED)
        advance(5_000)

        assertTrue(heard.fatals.isEmpty())
        assertNotSame(onDevice, latest())
    }

    @Test
    fun `a language no recognizer has is fatal once the fallback has been tried`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(true)
        start(Transcriber.Config(language = "cy-GB"))
        recognizer().triggerOnError(ERROR_LANGUAGE_UNAVAILABLE)
        advance(5_000)
        assertTrue(heard.fatals.isEmpty())

        recognizer().triggerOnError(ERROR_LANGUAGE_UNAVAILABLE)

        assertEquals(1, heard.fatals.size)
        assertTrue(heard.fatals.single(), heard.fatals.single().contains("language"))
    }

    @Test
    fun `with no on-device recognizer a language error is fatal straight away`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(false)
        start(Transcriber.Config(language = "cy-GB"))
        recognizer().triggerOnError(ERROR_LANGUAGE_NOT_SUPPORTED)

        assertEquals(1, heard.fatals.size)
        assertTrue(heard.fatals.single().contains("language"))
    }

    @Test
    fun `a recognizer that rejects the richer request is asked plainly the next time`() {
        start()
        val first = session()
        assertTrue(first.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))

        // The session dies at once with nothing heard.
        recognizer().triggerOnError(SpeechRecognizer.ERROR_CLIENT)
        assertListeningAgain(first)

        val second = session()
        assertFalse(second.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))
        assertFalse(second.hasExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING))
        recognizer().triggerOnResults(words("plain sessions work"))
        assertEquals(listOf("plain sessions work"), heard.finals)
    }

    @Test
    fun `losing the network shows a notice, keeps trying, and clears the notice once listening`() {
        start()
        val first = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_NETWORK)

        assertTrue(heard.notices.last().orEmpty(), heard.notices.last().orEmpty().contains("No connection"))
        assertListeningAgain(first)

        recognizer().triggerOnReadyForSpeech(Bundle())
        assertNull("the notice is cleared when the recognizer is ready again", heard.notices.last())
    }

    @Test
    fun `a busy microphone shows a notice and keeps trying`() {
        start()
        val first = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)

        assertTrue(heard.notices.last().orEmpty(), heard.notices.last().orEmpty().contains("microphone"))
        assertListeningAgain(first)
    }

    @Test
    fun `a busy recognizer is tried again`() {
        start()
        val first = session()
        val same = latest()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_RECOGNIZER_BUSY)

        assertListeningAgain(first)
        assertSame("busy is no reason to throw the recognizer away", same, latest())
    }

    @Test
    fun `hard errors that keep coming end in a fatal error instead of looping forever`() {
        start()
        var errors = 0
        while (heard.fatals.isEmpty() && errors < 200) {
            recognizer().triggerOnError(SpeechRecognizer.ERROR_SERVER)
            errors++
            advance(20_000)
        }

        assertEquals("it must give up eventually", 1, heard.fatals.size)
        assertTrue(heard.fatals.single(), heard.fatals.single().contains("keeps failing"))
        assertTrue("it should not give up after only $errors errors", errors > 5)
        assertTrue("the user was warned while it was still trying", heard.notices.any { it.orEmpty().contains("having trouble") })
        assertTrue(recognizer().isDestroyed)

        val last = session()
        advance(60_000)
        assertSame("once it has given up it stays stopped", last, session())
    }

    @Test
    fun `a few hard errors are ridden out`() {
        start()
        repeat(5) {
            val before = session()
            recognizer().triggerOnError(SpeechRecognizer.ERROR_SERVER)
            assertListeningAgain(before)
        }
        recognizer().triggerOnResults(words("back again"))
        assertEquals(listOf("back again"), heard.finals)
    }

    @Test
    fun `errors spread through a meeting that is otherwise being heard never add up to fatal`() {
        start()
        repeat(60) { round ->
            val before = session()
            recognizer().triggerOnError(SpeechRecognizer.ERROR_SERVER)
            assertListeningAgain(before)
            val again = session()
            recognizer().triggerOnResults(words("sentence $round"))
            assertListeningAgain(again)
        }
        assertTrue(heard.fatals.isEmpty())
        assertEquals(60, heard.finals.size)
    }

    @Test
    fun `a quiet room never ends the recording`() {
        start()
        repeat(300) {
            val before = session()
            recognizer().triggerOnError(if (it % 2 == 0) SpeechRecognizer.ERROR_NO_MATCH else SpeechRecognizer.ERROR_SPEECH_TIMEOUT)
            assertListeningAgain(before)
        }
        assertTrue(heard.fatals.isEmpty())
        recognizer().triggerOnResults(words("someone finally spoke"))
        assertEquals(listOf("someone finally spoke"), heard.finals)
    }

    /** Lets time pass in small steps until the next session starts; returns roughly how long that took. */
    private fun waitForNextSession(before: Intent): Long {
        var waited = 0L
        while (session() === before && waited < 30_000) {
            advance(40)
            waited += 40
        }
        assertNotSame("the transcriber should have started listening again", before, session())
        return waited
    }

    @Test
    fun `a recognizer that gives up instantly is slowed down but never abandoned`() {
        start()
        // Each session ends the moment it starts, with nothing heard.
        val waits = (1..12).map {
            val before = session()
            recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)
            waitForNextSession(before)
        }

        assertTrue("the first retry is quick: $waits", waits.first() <= 500)
        assertEquals("each retry waits at least as long as the one before: $waits", waits.sorted(), waits)
        assertTrue("it backs off to about a second or more so it can't spin: $waits", waits.last() >= 1_000)
        assertTrue("but it never waits long enough to miss much of a meeting: $waits", waits.last() <= 5_000)
        assertTrue(heard.fatals.isEmpty())

        // As soon as something is heard it is back to restarting promptly.
        recognizer().triggerOnResults(words("there we go"))
        advance(5_000)
        val before = session()
        recognizer().triggerOnPartialResults(words("and"))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)
        assertTrue(waitForNextSession(before) <= 500)
        assertEquals(listOf("there we go", "and"), heard.finals)
    }

    // -------------------------------------------------------------------------------------------
    // Stopping

    @Test
    fun `stopping delivers words still pending and releases the recognizer`() {
        start()
        val shadow = recognizer()
        val first = session()
        shadow.triggerOnPartialResults(words("and one more thing"))

        transcriber.stop()
        idle()

        assertEquals(listOf("and one more thing"), heard.finals)
        assertTrue(shadow.isDestroyed)
        assertTrue(heard.fatals.isEmpty())

        advance(30_000)
        assertSame("no new session starts after stop", first, session())
    }

    @Test
    fun `stopping with nothing pending delivers nothing`() {
        start()
        recognizer().triggerOnPartialResults(words("all said"))
        recognizer().triggerOnResults(words("all said"))
        transcriber.stop()
        idle()
        assertEquals(listOf("all said"), heard.finals)
    }

    @Test
    fun `stopping while waiting to restart cancels the restart`() {
        start()
        val first = session()
        recognizer().triggerOnResults(words("last words"))
        transcriber.stop()

        advance(30_000)
        assertSame(first, session())
        assertEquals(listOf("last words"), heard.finals)
    }

    @Test
    fun `nothing reaches the listener after stop`() {
        start()
        val shadow = recognizer()
        transcriber.stop()
        idle()

        shadow.triggerOnPartialResults(words("ghost"))
        shadow.triggerOnResults(words("ghost"))
        shadow.triggerOnRmsChanged(5f)
        shadow.triggerOnError(SpeechRecognizer.ERROR_SERVER)

        assertTrue(heard.partials.isEmpty() && heard.finals.isEmpty() && heard.levels.isEmpty() && heard.fatals.isEmpty())
    }

    @Test
    fun `stop is safe to call twice and before start`() {
        transcriber.stop()
        start()
        recognizer().triggerOnPartialResults(words("pending"))
        transcriber.stop()
        transcriber.stop()
        assertEquals(listOf("pending"), heard.finals)
    }

    @Test
    fun `starting again begins afresh with the new listener`() {
        start()
        val firstRecognizer = latest()
        recognizer().triggerOnResults(words("from the first recording"))

        val second = Heard()
        start(listener = second)

        assertNotSame(firstRecognizer, latest())
        assertTrue(shadowOf(firstRecognizer).isDestroyed)
        // The first words of the new recording happen to match the last of the old one.
        recognizer().triggerOnResults(words("from the first recording"))
        assertEquals(listOf("from the first recording"), second.finals)
        assertEquals(listOf("from the first recording"), heard.finals)
    }

    @Test
    fun `chimes are muted for the recording and restored afterwards`() {
        val audio = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        assertFalse(audio.isStreamMute(AudioManager.STREAM_MUSIC))

        start(Transcriber.Config(muteChimes = true))
        assertTrue(audio.isStreamMute(AudioManager.STREAM_MUSIC))

        transcriber.stop()
        assertFalse(audio.isStreamMute(AudioManager.STREAM_MUSIC))
    }

    @Test
    fun `chimes are restored when the recording dies by itself`() {
        val audio = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        start(Transcriber.Config(muteChimes = true))
        recognizer().triggerOnError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)

        assertEquals(1, heard.fatals.size)
        assertFalse(audio.isStreamMute(AudioManager.STREAM_MUSIC))
    }

    @Test
    fun `without the setting the phone's volume is left alone`() {
        val audio = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        start(Transcriber.Config(muteChimes = false))
        assertFalse(audio.isStreamMute(AudioManager.STREAM_MUSIC))
        assertNotNull(session())
    }

    private companion object {
        // Added to SpeechRecognizer in Android 12.
        const val ERROR_LANGUAGE_NOT_SUPPORTED = 12
        const val ERROR_LANGUAGE_UNAVAILABLE = 13
    }
}
