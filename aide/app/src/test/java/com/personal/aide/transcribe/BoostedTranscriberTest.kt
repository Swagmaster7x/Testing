package com.personal.aide.transcribe

import android.app.Application
import android.content.Context
import android.content.Intent
import android.content.pm.ResolveInfo
import android.media.AudioFormat
import android.os.Bundle
import android.os.Looper
import android.os.ParcelFileDescriptor
import android.speech.RecognitionService
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotSame
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import org.junit.runner.RunWith
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import org.robolectric.shadows.ShadowSpeechRecognizer
import java.time.Duration

/**
 * [AndroidSpeechTranscriber] when the app captures the audio itself and hands it to the
 * recognizer: what the recognizer is asked for, every way of giving the microphone back to it,
 * and that none of this touches a recording made the ordinary way. The capture is a pretend
 * [Feed]; the recognizer is Robolectric's, played by the test.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class BoostedTranscriberTest {
    @get:Rule
    val folder = TemporaryFolder()

    private val context: Context = ApplicationProvider.getApplicationContext()
    private lateinit var transcriber: AndroidSpeechTranscriber
    private val heard = Heard()

    /** Every capture the transcriber asked for, in order. */
    private val feeds = ArrayList<FakeFeed>()

    /** Whether the next capture made will be able to open the microphone. */
    private var microphoneFree = true

    private val boosted = Transcriber.Config(sensitivity = Transcriber.Sensitivity.BOOSTED)
    private val phone = Transcriber.Config(sensitivity = Transcriber.Sensitivity.PHONE)

    /** Everything the transcriber told its listener, in order. */
    private class Heard : Transcriber.Listener {
        val partials = ArrayList<String>()
        val finals = ArrayList<String>()
        val levels = ArrayList<Float>()
        val notices = ArrayList<String?>()
        val fatals = ArrayList<String>()
        var unsupported = 0

        override fun onPartial(text: String) { partials += text }
        override fun onFinal(text: String) { finals += text }
        override fun onLevel(level: Float) { levels += level }
        override fun onNotice(notice: String?) { notices += notice }
        override fun onFatal(message: String) { fatals += message }
        override fun onBoostUnsupported() { unsupported++ }
    }

    /** A capture that does what the test tells it, and remembers what was asked of it. */
    private inner class FakeFeed(val maxGain: Float, val level: (Float) -> Unit) : Feed {
        var canStart = microphoneFree
        var canOpen = true
        var running = false
        var died = false
        var stalled = 0L
        var speech = 0L
        var starts = 0
        var stops = 0
        var pauses = 0
        val streams = ArrayList<ParcelFileDescriptor>()

        override fun start(): Boolean {
            starts++
            if (!canStart) return false
            running = true
            died = false
            return true
        }

        override fun stop() {
            stops++
            running = false
        }

        override fun open(): ParcelFileDescriptor? {
            if (!running || !canOpen) return null
            return ParcelFileDescriptor.open(folder.newFile(), ParcelFileDescriptor.MODE_READ_ONLY).also { streams += it }
        }

        override fun pause() {
            pauses++
        }

        override fun alive(): Boolean = running && !died
        override fun stalledMs(): Long = stalled
        override fun speechMs(): Long = speech
    }

    @Before
    fun setUp() {
        transcriber = AndroidSpeechTranscriber(context) { maxGain, level -> FakeFeed(maxGain, level).also { feeds += it } }
    }

    @After
    fun tearDown() {
        transcriber.stop()
        idle()
        feeds.flatMap { it.streams }.forEach { runCatching { it.close() } }
    }

    // -------------------------------------------------------------------------------------------
    // Playing the phone

    private fun installSpeechService() {
        @Suppress("DEPRECATION")
        shadowOf(context.packageManager).addResolveInfoForIntent(Intent(RecognitionService.SERVICE_INTERFACE), ResolveInfo())
    }

    private fun idle() = shadowOf(Looper.getMainLooper()).idle()

    /** Lets [millis] pass, running whatever falls due. */
    private fun advance(millis: Long) {
        shadowOf(Looper.getMainLooper()).idleFor(Duration.ofMillis(millis))
        idle()
    }

    /** How many captures had been made when the recording under test began. */
    private var capturesBefore = 0

    private fun start(config: Transcriber.Config = boosted, listener: Transcriber.Listener = heard) {
        installSpeechService()
        capturesBefore = feeds.size
        transcriber.start(config, listener)
        idle()
    }

    private fun latest(): SpeechRecognizer = ShadowSpeechRecognizer.getLatestSpeechRecognizer()

    private fun recognizer(): ShadowSpeechRecognizer = shadowOf(latest())

    /** The request the transcriber last sent the recognizer: one per listening session. */
    private fun session(): Intent = recognizer().lastRecognizerIntent

    /** The same, when the recognizer may have just been replaced and not yet asked to listen. */
    private fun sessionIfAny(): Intent? = recognizer().lastRecognizerIntent

    private fun words(vararg texts: String) = Bundle().apply { putStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION, arrayListOf(*texts)) }

    private val feed: FakeFeed get() = feeds.last()

    /** Lets time pass in small steps until the next session starts, so that it has only just begun when this returns. */
    private fun waitForNextSession(before: Intent) {
        var waited = 0L
        while (sessionIfAny().let { it == null || it === before } && waited < 30_000) {
            advance(40)
            waited += 40
        }
        assertNotSame("the transcriber should have started listening again", before, session())
    }

    private fun audioOf(request: Intent): ParcelFileDescriptor? =
        request.getParcelableExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE, ParcelFileDescriptor::class.java)

    private val audioExtras = listOf(
        RecognizerIntent.EXTRA_AUDIO_SOURCE,
        RecognizerIntent.EXTRA_AUDIO_SOURCE_CHANNEL_COUNT,
        RecognizerIntent.EXTRA_AUDIO_SOURCE_ENCODING,
        RecognizerIntent.EXTRA_AUDIO_SOURCE_SAMPLING_RATE,
    )

    /** The request leaves the microphone to the recognizer: nothing in it says where else to take audio from. */
    private fun assertOwnMicrophone(request: Intent) {
        for (extra in audioExtras) assertFalse("the request still carries $extra", request.hasExtra(extra))
        assertTrue(
            "a session without the app's audio is not tied to it either",
            request.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION) != RecognizerIntent.EXTRA_AUDIO_SOURCE,
        )
    }

    /** The request hands the recognizer the stream the capture just opened, and says what is in it. */
    private fun assertHandedAudio(request: Intent, from: FakeFeed = feed) {
        assertSame("the recognizer is given the stream opened for this session", from.streams.last(), audioOf(request))
        assertEquals(1, request.getIntExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_CHANNEL_COUNT, -1))
        assertEquals(AudioFormat.ENCODING_PCM_16BIT, request.getIntExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_ENCODING, -1))
        assertEquals(AudioFeed.SAMPLE_RATE, request.getIntExtra(RecognizerIntent.EXTRA_AUDIO_SOURCE_SAMPLING_RATE, -1))
    }

    /**
     * Where every way of giving up the boost must end: the app's capture stopped, so the
     * microphone is free, and the recognizer listening again through its own.
     */
    private fun assertFellBack(from: FakeFeed, before: Intent) {
        assertFalse("the app's own capture must be stopped", from.running)
        assertTrue("the capture was never told to stop", from.stops >= 1)
        advance(5_000)
        val request = session()
        assertNotSame("the recognizer should be listening again", before, request)
        assertFalse("the recognizer in use has been thrown away", recognizer().isDestroyed)
        assertOwnMicrophone(request)
        assertTrue("falling back is not the end of the recording: ${heard.fatals}", heard.fatals.isEmpty())

        // Having given the microphone back, the app leaves it alone for the rest of the recording.
        val starts = from.starts
        val streams = from.streams.size
        advance(10_000)
        assertEquals("the capture was started again behind the recognizer's back", starts, from.starts)
        assertEquals("a stream was opened that nobody will read", streams, from.streams.size)
        assertEquals("only one capture is ever made for a recording", capturesBefore + 1, feeds.size)
        assertFalse(from.running)
    }

    // -------------------------------------------------------------------------------------------
    // Starting with the boost

    @Test
    fun `with the boost on the app captures the audio and hands it to the recognizer`() {
        start(boosted)

        assertEquals(1, feeds.size)
        assertEquals(1, feed.starts)
        assertTrue(feed.running)

        val request = session()
        assertEquals(RecognizerIntent.ACTION_RECOGNIZE_SPEECH, request.action)
        assertEquals(RecognizerIntent.LANGUAGE_MODEL_FREE_FORM, request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL))
        assertTrue(request.getBooleanExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false))
        assertEquals(1, feed.streams.size)
        assertHandedAudio(request)
        assertEquals(
            "the session lasts as long as the audio keeps coming",
            RecognizerIntent.EXTRA_AUDIO_SOURCE,
            request.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION),
        )
        assertEquals(RecognizerIntent.FORMATTING_OPTIMIZE_QUALITY, request.getStringExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING))
        assertTrue(heard.fatals.isEmpty())
        assertEquals(0, heard.unsupported)
    }

    @Test
    fun `each sensitivity allows the capture its own amount of boost`() {
        start(Transcriber.Config(sensitivity = Transcriber.Sensitivity.BOOSTED))
        assertEquals(16f, feed.maxGain, 0f)

        start(Transcriber.Config(sensitivity = Transcriber.Sensitivity.MAXIMUM))
        assertEquals(40f, feed.maxGain, 0f)
        assertTrue("more boost than the middle setting", Transcriber.Sensitivity.MAXIMUM.maxGain > Transcriber.Sensitivity.BOOSTED.maxGain)
        assertEquals("and the phone's own handling means none", 1f, Transcriber.Sensitivity.PHONE.maxGain, 0f)
    }

    @Test
    fun `the language and the other settings are passed on just the same`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(false)
        start(boosted.copy(language = "en-GB", preferOnDevice = true))

        val request = session()
        assertEquals("en-GB", request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE))
        assertTrue(request.getBooleanExtra(RecognizerIntent.EXTRA_PREFER_OFFLINE, false))
        assertHandedAudio(request)
    }

    @Test
    @Config(sdk = [30])
    fun `before Android 13 the boost is not attempted`() {
        start(boosted)

        assertTrue("no capture may be made where the recognizer can't be handed audio", feeds.isEmpty())
        val request = session()
        for (extra in audioExtras) assertFalse(request.hasExtra(extra))
        assertFalse(request.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))

        recognizer().triggerOnRmsChanged(4f)
        assertEquals(listOf(0.5f), heard.levels)
        recognizer().triggerOnResults(words("still works"))
        assertEquals(listOf("still works"), heard.finals)
        assertEquals(0, heard.unsupported)
    }

    @Test
    fun `a phone with no speech recognition service captures nothing`() {
        transcriber.start(boosted, heard)
        idle()

        assertEquals(1, heard.fatals.size)
        assertTrue("the microphone must not be left open for a recording that never began", feeds.none { it.running })
    }

    // -------------------------------------------------------------------------------------------
    // Listening with the boost

    @Test
    fun `words are delivered as they are without the boost`() {
        start(boosted)
        recognizer().triggerOnPartialResults(words("we should"))
        recognizer().triggerOnSegmentResults(words("we should ship on friday"))
        recognizer().triggerOnPartialResults(words("and tell"))
        recognizer().triggerOnResults(words("and tell marcus"))

        assertEquals(listOf("we should", "and tell"), heard.partials)
        assertEquals(listOf("we should ship on friday", "and tell marcus"), heard.finals)
    }

    @Test
    fun `every session gets a fresh stream from the one capture, and the last one is ended first`() {
        start(boosted)
        val first = session()
        val firstStream = audioOf(first)
        assertEquals(0, feed.pauses)

        recognizer().triggerOnResults(words("hello everyone"))
        assertEquals("the session is over, so its stream is ended", 1, feed.pauses)
        assertEquals("but nothing new is opened until the next session starts", 1, feed.streams.size)

        waitForNextSession(first)
        val second = session()
        assertEquals(2, feed.streams.size)
        assertNotSame(firstStream, audioOf(second))
        assertHandedAudio(second)

        assertEquals("the microphone stays open across sessions", 1, feed.starts)
        assertEquals(0, feed.stops)
        assertTrue(feed.running)
    }

    @Test
    fun `a segmented session that ends is followed by another on the same capture`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnSegmentResults(words("first sentence"))
        recognizer().triggerOnPartialResults(words("and a tail"))
        recognizer().triggerOnEndOfSegmentedSession()

        assertEquals(listOf("first sentence", "and a tail"), heard.finals)
        assertEquals(1, feed.pauses)
        waitForNextSession(first)
        assertHandedAudio(session())
        assertEquals(
            RecognizerIntent.EXTRA_AUDIO_SOURCE,
            session().getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION),
        )
    }

    @Test
    fun `a whole meeting of sessions keeps its boost`() {
        start(boosted)
        val said = (1..40).map { "sentence number $it" }
        for (sentence in said) {
            val before = session()
            recognizer().triggerOnResults(words(sentence))
            waitForNextSession(before)
            assertHandedAudio(session())
        }
        assertEquals(said, heard.finals)
        assertEquals(41, feed.streams.size)
        assertEquals(40, feed.pauses)
        assertEquals(1, feed.starts)
        assertEquals(0, feed.stops)
        assertEquals(0, heard.unsupported)
    }

    @Test
    fun `the level meter follows the app's capture, not the recognizer`() {
        start(boosted)
        // The capture reports from its own thread.
        Thread { feed.level(0.4f) }.apply { start(); join() }
        idle()
        feed.level(0.75f)
        idle()
        assertEquals(listOf(0.4f, 0.75f), heard.levels)

        recognizer().triggerOnRmsChanged(10f)
        recognizer().triggerOnRmsChanged(-2f)
        assertEquals("the recognizer's own reading is of nothing the user said", listOf(0.4f, 0.75f), heard.levels)
    }

    @Test
    fun `a quiet room never costs the boost`() {
        start(boosted)
        repeat(120) {
            val before = session()
            recognizer().triggerOnError(if (it % 2 == 0) SpeechRecognizer.ERROR_NO_MATCH else SpeechRecognizer.ERROR_SPEECH_TIMEOUT)
            advance(5_000)
            assertNotSame(before, session())
            assertHandedAudio(session())
        }
        assertEquals(0, heard.unsupported)
        assertEquals(0, feed.stops)
        assertTrue(heard.fatals.isEmpty())
    }

    @Test
    fun `a session that runs for a while before failing is retried with the boost and the richer request kept`() {
        start(boosted)
        val first = session()
        advance(4_000)
        recognizer().triggerOnError(SpeechRecognizer.ERROR_CLIENT)
        waitForNextSession(first)

        val second = session()
        assertHandedAudio(second)
        assertEquals(RecognizerIntent.EXTRA_AUDIO_SOURCE, second.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))
        assertEquals(0, heard.unsupported)
        assertEquals(0, feed.stops)
    }

    @Test
    fun `once words have been recognized, no session error costs the boost`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnPartialResults(words("good morning"))
        recognizer().triggerOnResults(words("good morning everyone"))
        waitForNextSession(first)

        // Now every session dies the moment it starts.
        for (error in listOf(SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_SERVER, SpeechRecognizer.ERROR_AUDIO, SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_AUDIO)) {
            val before = session()
            recognizer().triggerOnError(error)
            waitForNextSession(before)
            assertHandedAudio(session())
        }

        assertEquals("it has shown it takes the audio", 0, heard.unsupported)
        assertEquals(0, feed.stops)
        assertTrue(feed.running)
        assertTrue("an audio error is then the ordinary kind: ${heard.notices}", heard.notices.any { it.orEmpty().contains("microphone") })
        assertTrue(heard.fatals.isEmpty())
    }

    @Test
    fun `changing recognizer for a language the on-device one lacks keeps the boost`() {
        ShadowSpeechRecognizer.setIsOnDeviceRecognitionAvailable(true)
        start(boosted.copy(language = "cy-GB"))
        val onDevice = latest()
        val first = session()
        assertHandedAudio(first)

        // ERROR_LANGUAGE_UNAVAILABLE, added to SpeechRecognizer in Android 12.
        shadowOf(onDevice).triggerOnError(13)
        waitForNextSession(first)

        assertNotSame("the ordinary recognizer takes over", onDevice, latest())
        assertHandedAudio(session())
        assertEquals("cy-GB", session().getStringExtra(RecognizerIntent.EXTRA_LANGUAGE))
        assertEquals("a missing language is not a refusal of the audio", 0, heard.unsupported)
        assertEquals(0, feed.stops)
        assertTrue(heard.fatals.isEmpty())
    }

    @Test
    fun `a capture with no stream to offer leaves the session to the recognizer's microphone, saying nothing of audio`() {
        start(boosted)
        val first = session()
        feed.canOpen = false
        recognizer().triggerOnResults(words("before"))
        waitForNextSession(first)

        val second = session()
        for (extra in audioExtras) assertFalse("half a description of audio that isn't there: $extra", second.hasExtra(extra))
        assertTrue(heard.fatals.isEmpty())

        recognizer().triggerOnResults(words("after"))
        assertEquals(listOf("before", "after"), heard.finals)
    }

    // -------------------------------------------------------------------------------------------
    // Giving the microphone back

    @Test
    fun `when the app cannot open the microphone the recognizer uses its own from the start`() {
        microphoneFree = false
        start(boosted)

        assertEquals(1, feed.starts)
        assertFalse(feed.running)
        assertTrue("nothing was captured, so there is nothing to hand over", feed.streams.isEmpty())
        assertOwnMicrophone(session())
        assertEquals("a busy microphone says nothing about what the recognizer accepts", 0, heard.unsupported)
        assertTrue(heard.fatals.isEmpty())

        // And the recording carries on the ordinary way.
        recognizer().triggerOnRmsChanged(4f)
        assertEquals(listOf(0.5f), heard.levels)
        val first = session()
        recognizer().triggerOnResults(words("heard anyway"))
        advance(60_000)
        assertNotSame(first, session())
        assertOwnMicrophone(session())
        assertEquals(listOf("heard anyway"), heard.finals)
        assertEquals("it does not keep trying for the microphone behind the recognizer's back", 1, feed.starts)
        assertEquals(1, feeds.size)
    }

    @Test
    fun `a recognizer that refuses the app's audio twice running gets the microphone back and is reported`() {
        for (error in listOf(SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_SERVER)) {
            val listener = Heard()
            start(boosted, listener)
            val first = session()
            assertEquals(RecognizerIntent.EXTRA_AUDIO_SOURCE, first.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))

            // The first session dies at once with nothing heard: perhaps it was the richer request it disliked.
            recognizer().triggerOnError(error)
            waitForNextSession(first)
            val second = session()
            assertHandedAudio(second)
            assertFalse("asked plainly the second time", second.hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))
            assertFalse(second.hasExtra(RecognizerIntent.EXTRA_ENABLE_FORMATTING))
            assertEquals("error $error: one failure is not yet a refusal", 0, listener.unsupported)
            assertTrue(feed.running)

            // The plain request dies the same way: it is the audio it won't take.
            recognizer().triggerOnError(error)
            assertEquals("error $error", 1, listener.unsupported)
            assertFalse(feed.running)
            assertTrue(feed.stops >= 1)

            advance(5_000)
            val third = session()
            assertNotSame(second, third)
            assertOwnMicrophone(third)
            assertFalse(recognizer().isDestroyed)
            assertEquals(
                "with its own microphone the recognizer is asked for the richer session again",
                RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,
                third.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION),
            )
            assertTrue(listener.fatals.isEmpty())

            recognizer().triggerOnResults(words("heard through its own microphone"))
            assertEquals(listOf("heard through its own microphone"), listener.finals)
        }
    }

    @Test
    fun `the refusal is reported once, however the rest of the recording goes`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_CLIENT)
        waitForNextSession(first)
        val second = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_CLIENT)
        assertEquals(1, heard.unsupported)
        assertFellBack(feed, second)

        // The recognizer goes on being difficult with its own microphone too.
        for (error in listOf(SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_AUDIO, SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_SERVER, SpeechRecognizer.ERROR_AUDIO)) {
            val before = session()
            recognizer().triggerOnError(error)
            waitForNextSession(before)
            assertOwnMicrophone(session())
        }
        feed.stalled = 60_000
        feed.speech = 600_000
        advance(30_000)

        assertEquals(1, heard.unsupported)
        assertEquals(1, feeds.size)
        assertFalse(feed.running)
    }

    @Test
    fun `an audio error the moment the recognizer is handed audio gives the microphone back and is reported`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)

        assertEquals(1, heard.unsupported)
        assertFellBack(feed, first)
        assertFalse(
            "it wasn't a busy microphone, and the user is not told it was: ${heard.notices}",
            heard.notices.any { it.orEmpty().contains("microphone is busy") },
        )
    }

    @Test
    fun `an audio error later on, with nothing yet heard, gives the microphone back without calling it a refusal`() {
        start(boosted)
        val first = session()
        advance(4_000)
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)

        assertEquals(0, heard.unsupported)
        assertFellBack(feed, first)
    }

    @Test
    fun `a recognizer that stops taking the audio gets the microphone back and is reported`() {
        start(boosted)
        val first = session()

        // Unread for a few seconds: slow, not stuck.
        feed.stalled = 5_000
        advance(10_000)
        assertTrue(feed.running)
        assertSame(first, session())
        assertEquals(0, heard.unsupported)

        feed.stalled = 7_000
        advance(2_500)
        assertEquals(1, heard.unsupported)
        assertFellBack(feed, first)
    }

    @Test
    fun `words heard but not yet final are kept when the microphone is given back`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnPartialResults(words("half a thought"))

        feed.stalled = 20_000
        advance(2_500)

        assertEquals(listOf("half a thought"), heard.finals)
        assertFellBack(feed, first)
        recognizer().triggerOnResults(words("and the rest"))
        assertEquals(listOf("half a thought", "and the rest"), heard.finals)
    }

    @Test
    fun `a stall is noticed at any point in the recording`() {
        start(boosted)
        var last = session()
        repeat(10) {
            recognizer().triggerOnResults(words("sentence $it"))
            advance(30_000)
            assertNotSame(last, session())
            last = session()
        }
        assertTrue(feed.running)
        assertEquals(0, heard.unsupported)

        feed.stalled = 9_000
        advance(2_500)
        assertFellBack(feed, last)
        // It had been making words out of this audio all along, so it does take it: whatever has
        // gone wrong now, this phone is not written off as unable to.
        assertEquals(0, heard.unsupported)
    }

    @Test
    fun `a stall before a single word has come back means the recognizer does not take the audio`() {
        start(boosted)
        val first = session()
        assertEquals(0, heard.unsupported)

        feed.stalled = 9_000
        advance(2_500)
        assertEquals(1, heard.unsupported)
        assertFellBack(feed, first)
    }

    @Test
    fun `a capture that dies is started again and the boost carries on`() {
        start(boosted)
        val first = session()
        feed.died = true
        advance(2_500)

        assertEquals("the microphone is taken back", 2, feed.starts)
        assertTrue(feed.running)
        assertEquals(0, feed.stops)
        assertEquals(0, heard.unsupported)

        recognizer().triggerOnResults(words("carrying on"))
        waitForNextSession(first)
        assertHandedAudio(session())
        assertEquals(1, feeds.size)
    }

    @Test
    fun `a capture that dies and cannot be started again leaves the microphone to the recognizer, with no report`() {
        start(boosted)
        val first = session()
        feed.died = true
        feed.canStart = false
        advance(2_500)

        assertEquals(2, feed.starts)
        assertEquals("losing the microphone to a call is not the recognizer refusing audio", 0, heard.unsupported)
        assertFalse(feed.alive())
        advance(5_000)
        val request = session()
        assertNotSame(first, request)
        assertOwnMicrophone(request)
        assertFalse(recognizer().isDestroyed)
        assertTrue(heard.fatals.isEmpty())
        advance(30_000)
        assertEquals("having given up, it stops trying", 2, feed.starts)

        recognizer().triggerOnRmsChanged(10f)
        assertEquals(listOf(1f), heard.levels)
    }

    @Test
    fun `long talk with not a word recognized gives the microphone back, with no report`() {
        start(boosted)
        val first = session()

        feed.speech = 44_000
        advance(10_000)
        assertTrue("not yet", feed.running)
        assertSame(first, session())

        feed.speech = 46_000
        advance(2_500)
        assertEquals("it took the audio, so it is not remembered as refusing it", 0, heard.unsupported)
        assertFellBack(feed, first)
    }

    @Test
    fun `quiet sessions between people talking do not hide that nothing is being recognized`() {
        start(boosted)
        repeat(20) {
            val before = session()
            feed.speech += 3_000
            recognizer().triggerOnError(SpeechRecognizer.ERROR_NO_MATCH)
            advance(3_000)
            assertNotSame(before, session())
        }
        assertFalse("a minute of talk with nothing recognized, and the boost is still on", feed.running)
        assertOwnMicrophone(session())
        assertEquals(0, heard.unsupported)
    }

    @Test
    fun `once anything has been recognized, any amount of talk keeps the boost`() {
        start(boosted)
        recognizer().triggerOnPartialResults(words("hello"))
        feed.speech = 3_600_000
        advance(60_000)

        assertTrue(feed.running)
        assertEquals(0, feed.stops)
        assertEquals(0, heard.unsupported)
        assertHandedAudio(session())
    }

    @Test
    fun `after giving the microphone back the level meter is the recognizer's again`() {
        start(boosted)
        val first = session()
        val old = feed
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)
        assertFellBack(old, first)

        recognizer().triggerOnRmsChanged(4f)
        assertEquals(listOf(0.5f), heard.levels)

        // A last reading from the stopped capture, still on its way.
        old.level(0.9f)
        idle()
        assertEquals(listOf(0.5f), heard.levels)
    }

    // -------------------------------------------------------------------------------------------
    // Stopping

    @Test
    fun `stopping stops the capture`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnPartialResults(words("and one more thing"))

        transcriber.stop()
        idle()

        assertFalse(feed.running)
        assertEquals(listOf("and one more thing"), heard.finals)
        assertTrue(recognizer().isDestroyed)

        // Nothing is watching the capture any more, whatever it would now report.
        feed.stalled = 60_000
        feed.speech = 600_000
        feed.died = true
        advance(60_000)
        assertEquals(1, feed.starts)
        assertEquals(0, heard.unsupported)
        assertSame("no new session starts after stop", first, session())
        assertEquals(1, feed.streams.size)
    }

    @Test
    fun `stopping between sessions stops the capture too`() {
        start(boosted)
        val first = session()
        recognizer().triggerOnResults(words("last words"))
        transcriber.stop()

        assertFalse(feed.running)
        advance(30_000)
        assertSame(first, session())
        assertEquals("no stream is opened for a session that never starts", 1, feed.streams.size)
        assertEquals(1, feed.starts)
    }

    @Test
    fun `stopping twice, or after the microphone was given back, is harmless`() {
        start(boosted)
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)
        assertFalse(feed.running)

        transcriber.stop()
        transcriber.stop()
        idle()
        assertFalse(feed.running)
        assertEquals(1, heard.unsupported)
        assertTrue(heard.fatals.isEmpty())
    }

    @Test
    fun `nothing reaches the listener from the capture after stop`() {
        start(boosted)
        val old = feed
        // One reading is already on its way when the recording stops; another comes after.
        old.level(0.6f)
        transcriber.stop()
        old.level(0.7f)
        idle()

        assertTrue(heard.levels.isEmpty())
    }

    @Test
    fun `a fatal error stops the capture`() {
        start(boosted)
        recognizer().triggerOnError(SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS)

        assertEquals(1, heard.fatals.size)
        assertFalse("the microphone must not be left open once the recording has died", feed.running)
        advance(60_000)
        assertEquals(1, feed.starts)
    }

    @Test
    fun `errors that never stop end the recording with the capture stopped`() {
        start(boosted)
        var errors = 0
        while (heard.fatals.isEmpty() && errors < 200) {
            // Each session runs a while first, so this is trouble with the service, not with the audio.
            advance(20_000)
            recognizer().triggerOnError(SpeechRecognizer.ERROR_SERVER)
            errors++
        }

        assertEquals(1, heard.fatals.size)
        assertTrue(heard.fatals.single(), heard.fatals.single().contains("keeps failing"))
        assertFalse(feed.running)
        assertEquals("trouble with the service is not the recognizer refusing audio", 0, heard.unsupported)
    }

    @Test
    fun `starting again stops the old capture and makes a new one`() {
        start(boosted)
        val old = feed
        val second = Heard()
        start(Transcriber.Config(sensitivity = Transcriber.Sensitivity.MAXIMUM), second)

        assertEquals(2, feeds.size)
        assertFalse(old.running)
        assertTrue(feed.running)
        assertEquals(40f, feed.maxGain, 0f)
        assertHandedAudio(session())

        feed.level(0.3f)
        idle()
        assertEquals(listOf(0.3f), second.levels)
        assertTrue(heard.levels.isEmpty())
    }

    @Test
    fun `starting again without the boost stops the capture and records the ordinary way`() {
        start(boosted)
        val old = feed
        start(phone)

        assertFalse(old.running)
        assertEquals(1, feeds.size)
        assertOwnMicrophone(session())
        recognizer().triggerOnRmsChanged(10f)
        assertEquals(listOf(1f), heard.levels)
    }

    @Test
    fun `each recording may report a refusal of its own`() {
        start(boosted)
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)
        assertEquals(1, heard.unsupported)

        start(boosted)
        assertEquals("a new recording tries the boost again", 2, feeds.size)
        assertTrue(feed.running)
        assertHandedAudio(session())
        recognizer().triggerOnError(SpeechRecognizer.ERROR_AUDIO)
        assertEquals(2, heard.unsupported)
    }

    // -------------------------------------------------------------------------------------------
    // The phone's own handling is untouched

    @Test
    fun `the default is the phone's own handling`() {
        assertEquals(Transcriber.Sensitivity.PHONE, Transcriber.Config().sensitivity)
        assertEquals(emptyList<String>(), Transcriber.Config().hints)
    }

    @Test
    fun `with the phone's own handling no capture is made and the request is the one it always was`() {
        start(phone)

        assertTrue(feeds.isEmpty())
        val request = session()
        assertOwnMicrophone(request)
        assertEquals(RecognizerIntent.ACTION_RECOGNIZE_SPEECH, request.action)
        assertEquals(RecognizerIntent.LANGUAGE_MODEL_FREE_FORM, request.getStringExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL))
        assertTrue(request.getBooleanExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, false))
        assertEquals(
            RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS,
            request.getStringExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION),
        )
        assertTrue(request.hasExtra(RecognizerIntent.EXTRA_SPEECH_INPUT_COMPLETE_SILENCE_LENGTH_MILLIS))
        assertFalse(request.hasExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))

        recognizer().triggerOnRmsChanged(4f)
        assertEquals(listOf(0.5f), heard.levels)
    }

    @Test
    fun `with the phone's own handling a difficult recognizer is never reported as refusing the app's audio`() {
        start(phone)
        // The same run of trouble that costs a boosted recording its boost.
        for (error in listOf(SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_CLIENT, SpeechRecognizer.ERROR_AUDIO, SpeechRecognizer.ERROR_SERVER, SpeechRecognizer.ERROR_AUDIO)) {
            val before = session()
            recognizer().triggerOnError(error)
            waitForNextSession(before)
            assertOwnMicrophone(session())
        }

        assertEquals(0, heard.unsupported)
        assertTrue(feeds.isEmpty())
        assertTrue(heard.fatals.isEmpty())
        assertTrue("an audio error means what it always meant: ${heard.notices}", heard.notices.any { it.orEmpty().contains("microphone is busy") })
    }

    @Test
    fun `with the phone's own handling nothing happens by the clock alone`() {
        start(phone)
        val first = session()
        advance(10 * 60_000L)

        assertSame("a session nobody has ended is left running", first, session())
        assertTrue(feeds.isEmpty())
        assertEquals(0, heard.unsupported)
        assertTrue(heard.notices.all { it == null })
        assertTrue(heard.fatals.isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Names to listen out for

    @Test
    fun `names and terms are passed to the recognizer, with or without the boost`() {
        val names = listOf("Priya Nair", "RateStream", "Halvorsen Freight")
        for (config in listOf(phone, boosted)) {
            start(config.copy(hints = names))
            assertEquals(names, session().getStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
        }
    }

    @Test
    fun `they go with every session, not only the first`() {
        val names = listOf("Priya Nair", "RateStream")
        start(boosted.copy(hints = names))
        val first = session()
        recognizer().triggerOnResults(words("prior to rate stream"))
        waitForNextSession(first)

        assertEquals(names, session().getStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
    }

    @Test
    fun `at most a hundred are passed, the first hundred`() {
        val names = (1..250).map { "Name $it" }
        start(phone.copy(hints = names))

        assertEquals(names.take(100), session().getStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
    }

    @Test
    fun `with nothing to listen out for the request says nothing about it`() {
        start(boosted)
        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
        assertNull(session().getStringArrayListExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
    }

    @Test
    fun `a recognizer that rejected the richer request is not sent them the next time`() {
        start(phone.copy(hints = listOf("Priya Nair")))
        val first = session()
        assertTrue(first.hasExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))

        recognizer().triggerOnError(SpeechRecognizer.ERROR_CLIENT)
        waitForNextSession(first)

        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_SEGMENTED_SESSION))
        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
    }

    @Test
    @Config(sdk = [30])
    fun `before Android 13 no names are passed`() {
        start(phone.copy(hints = listOf("Priya Nair")))
        assertFalse(session().hasExtra(RecognizerIntent.EXTRA_BIASING_STRINGS))
    }
}
