package com.personal.aide.transcribe

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.MeetingStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.MemoryDataStore
import com.personal.aide.testing.inlineDatabase
import com.personal.aide.transcribe.RecorderState.Phase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.test.StandardTestDispatcher
import kotlinx.coroutines.test.TestCoroutineScheduler
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/**
 * [Recorder] with a pretend transcriber and a real [MeetingStore]. Time is the test scheduler's:
 * the recorder's clock, the meeting store's clock and the four-hour limit all move together when
 * a test lets time [pass].
 */
@OptIn(ExperimentalCoroutinesApi::class)
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class RecorderTest {
    private val scheduler = TestCoroutineScheduler()
    private val scope = CoroutineScope(StandardTestDispatcher(scheduler) + SupervisorJob())
    private lateinit var db: AppDatabase
    private lateinit var meetings: MeetingStore
    private lateinit var settings: SettingsStore
    private lateinit var recorder: Recorder

    private val transcribers = ArrayList<FakeTranscriber>()
    private val keepAlive = ArrayList<Boolean>()
    private val finished = ArrayList<Long>()

    /** Set to make the next transcriber refuse to start, the way a phone with no speech service does. */
    private var refuseToStart: String? = null

    /** Set to make the "recording saved" hook blow up. */
    private var finishedHookFails = false

    private fun time(): Long = Fixed.now + scheduler.currentTime

    /** Behaves like the real transcriber as far as the recorder can tell. */
    private class FakeTranscriber(private val refusal: String?) : Transcriber {
        var config: Transcriber.Config? = null
        var listener: Transcriber.Listener? = null
        var starts = 0
        var stops = 0
        private var pending: String? = null

        val listening: Boolean get() = listener != null

        override fun start(config: Transcriber.Config, listener: Transcriber.Listener) {
            starts++
            this.config = config
            if (refusal != null) {
                listener.onFatal(refusal)
                return
            }
            this.listener = listener
        }

        /** Like the real one: anything heard but not yet final is delivered before it lets go. */
        override fun stop() {
            stops++
            val target = listener
            val last = pending
            pending = null
            if (target != null && last != null) target.onFinal(last)
            listener = null
        }

        fun say(text: String) {
            pending = null
            listener!!.onFinal(text)
        }

        fun partial(text: String) {
            pending = text
            listener!!.onPartial(text)
        }
    }

    @Before
    fun setUp() {
        db = inlineDatabase(ApplicationProvider.getApplicationContext<Context>())
        meetings = MeetingStore(db.meetings()) { time() }
        settings = SettingsStore(MemoryDataStore())
        recorder = Recorder(
            scope = scope,
            meetings = meetings,
            settings = settings,
            newTranscriber = { FakeTranscriber(refuseToStart).also { transcribers += it } },
            keepAlive = { keepAlive += it },
            onFinished = { id ->
                finished += id
                if (finishedHookFails) throw IllegalStateException("the summary could not be started")
            },
            clock = { time() },
        )
    }

    @After
    fun tearDown() {
        scope.cancel()
        db.close()
    }

    // -------------------------------------------------------------------------------------------
    // Helpers

    /** Runs everything that is ready to run now, without letting any time go by. */
    private fun settle() = scheduler.runCurrent()

    private fun pass(millis: Long) {
        scheduler.advanceTimeBy(millis)
        scheduler.runCurrent()
    }

    private val state: RecorderState get() = recorder.state.value

    private val mic: FakeTranscriber get() = transcribers.last()

    private fun allMeetings(): List<MeetingEntity> = runBlocking { db.meetings().all() }

    private fun meeting(id: Long): MeetingEntity = runBlocking { db.meetings().get(id)!! }

    private fun segments(id: Long): List<SegmentEntity> = runBlocking { db.meetings().segments(id) }

    /** Starts a recording and lets the meeting row and the transcriber come up. */
    private fun startRecording(title: String? = null): Long {
        recorder.start(title)
        settle()
        return state.meetingId!!
    }

    // -------------------------------------------------------------------------------------------
    // Starting

    @Test
    fun `nothing is recording to begin with`() {
        settle()
        assertEquals(RecorderState(), state)
        assertFalse(state.active)
        assertTrue(transcribers.isEmpty())
        assertTrue(allMeetings().isEmpty())
    }

    @Test
    fun `starting shows as recording at once, and the meeting follows`() {
        recorder.start("Weekly sync", attendees = listOf("Dana", "Marcus"), calendarEventId = 7)

        assertEquals(Phase.LISTENING, state.phase)
        assertTrue(state.active)
        assertEquals("Weekly sync", state.title)
        assertEquals(time(), state.startedAt)
        assertNull("the meeting row is not there yet", state.meetingId)

        settle()

        val id = state.meetingId!!
        val saved = meeting(id)
        assertEquals("Weekly sync", saved.title)
        assertFalse(saved.titleIsAuto)
        assertEquals(MeetingStatus.RECORDING, saved.status)
        assertEquals(listOf("Dana", "Marcus"), saved.attendees)
        assertEquals(7L, saved.calendarEventId)
        assertEquals(listOf(true), keepAlive)
        assertEquals(1, transcribers.size)
        assertTrue(mic.listening)
        assertEquals(1, mic.starts)
    }

    @Test
    fun `a recording without a name gets the dated placeholder`() {
        val id = startRecording()
        assertEquals("", state.title)
        assertTrue(meeting(id).titleIsAuto)
        assertEquals(MeetingStore.defaultTitle(Fixed.now), meeting(id).title)
    }

    @Test
    fun `the transcriber is started with the settings in force`() {
        runBlocking {
            settings.setLanguage("en-GB")
            settings.setPreferOnDevice(false)
            settings.setMuteChimes(true)
        }
        startRecording()
        assertEquals(Transcriber.Config(language = "en-GB", preferOnDevice = false, muteChimes = true), mic.config)
    }

    @Test
    fun `by default the transcriber follows the phone's language and prefers on-device`() {
        startRecording()
        assertEquals(Transcriber.Config(language = "", preferOnDevice = true, muteChimes = false), mic.config)
    }

    @Test
    fun `starting while already recording does nothing`() {
        val id = startRecording("First")
        recorder.start("Second")
        settle()

        assertEquals(id, state.meetingId)
        assertEquals("First", state.title)
        assertEquals(1, allMeetings().size)
        assertEquals(1, transcribers.size)
        assertEquals(listOf(true), keepAlive)
    }

    // -------------------------------------------------------------------------------------------
    // Hearing

    @Test
    fun `what is heard lands in the meeting in order with the time it was said`() {
        val id = startRecording()
        pass(5_000)
        mic.say("good morning everyone")
        pass(10_000)
        mic.say("  let's begin with pricing ")
        pass(2_500)
        mic.say("dana will send the deck")
        settle()

        val saved = segments(id)
        assertEquals(listOf("good morning everyone", "let's begin with pricing", "dana will send the deck"), saved.map { it.text })
        assertEquals(listOf(5_000L, 15_000L, 17_500L), saved.map { it.offsetMs })
        assertTrue(saved.all { it.kind == SegmentKind.SPEECH })
        assertEquals(3, state.finalCount)
    }

    @Test
    fun `several things said in the same instant keep the order they were said in`() {
        val id = startRecording()
        pass(1_000)
        val said = (1..25).map { "sentence $it" }
        said.forEach { mic.say(it) }
        settle()

        assertEquals(said, segments(id).map { it.text })
    }

    @Test
    fun `each sentence is saved as it arrives, not when the recording ends`() {
        val id = startRecording()
        mic.say("saved straight away")
        settle()

        assertEquals(listOf("saved straight away"), segments(id).map { it.text })
        assertEquals(MeetingStatus.RECORDING, meeting(id).status)
    }

    @Test
    fun `the sentence in progress shows until it is final`() {
        startRecording()
        mic.partial("we shou")
        assertEquals("we shou", state.partial)
        mic.partial("we should ship")
        assertEquals("we should ship", state.partial)

        mic.say("we should ship on friday")
        assertEquals("", state.partial)
        assertEquals(1, state.finalCount)
    }

    @Test
    fun `the level meter and notices follow the transcriber`() {
        startRecording()
        mic.listener!!.onLevel(0.4f)
        assertEquals(0.4f, state.level, 0f)

        mic.listener!!.onNotice("No connection for speech recognition. Retrying…")
        assertEquals("No connection for speech recognition. Retrying…", state.notice)
        mic.listener!!.onNotice(null)
        assertNull(state.notice)
    }

    // -------------------------------------------------------------------------------------------
    // Time

    @Test
    fun `elapsed time counts from the start`() {
        startRecording()
        assertEquals(0L, state.elapsed(time()))
        pass(90_000)
        assertEquals(90_000L, state.elapsed(time()))
    }

    @Test
    fun `pausing stops the clock and the microphone, and resuming starts both again`() {
        val id = startRecording()
        pass(60_000)

        recorder.pause()
        assertEquals(Phase.PAUSED, state.phase)
        assertTrue("paused is still a recording in progress", state.active)
        assertFalse(mic.listening)
        assertEquals(1, mic.stops)
        assertEquals(60_000L, state.elapsed(time()))

        pass(30_000)
        assertEquals("time spent paused does not count", 60_000L, state.elapsed(time()))

        recorder.resume()
        assertEquals(Phase.LISTENING, state.phase)
        assertEquals(2, transcribers.size)
        assertTrue(mic.listening)
        assertEquals(30_000L, state.pausedTotalMs)
        assertNull(state.pausedAt)
        assertEquals(60_000L, state.elapsed(time()))

        pass(15_000)
        assertEquals(75_000L, state.elapsed(time()))
        mic.say("after the break")
        settle()
        assertEquals(listOf(75_000L), segments(id).map { it.offsetMs })
        assertEquals(MeetingStatus.RECORDING, meeting(id).status)
    }

    @Test
    fun `several pauses add up`() {
        startRecording()
        pass(10_000)
        recorder.pause()
        pass(20_000)
        recorder.resume()
        pass(5_000)
        recorder.pause()
        pass(40_000)
        recorder.resume()
        pass(1_000)

        assertEquals(60_000L, state.pausedTotalMs)
        assertEquals(16_000L, state.elapsed(time()))
    }

    @Test
    fun `pausing saves the sentence that was in progress`() {
        val id = startRecording()
        pass(8_000)
        mic.partial("half a sentence")

        recorder.pause()
        settle()

        assertEquals(listOf("half a sentence"), segments(id).map { it.text })
        assertEquals(listOf(8_000L), segments(id).map { it.offsetMs })
        assertEquals("", state.partial)
    }

    @Test
    fun `pausing clears the live readouts`() {
        startRecording()
        mic.listener!!.onLevel(0.8f)
        mic.listener!!.onNotice("Retrying…")
        mic.partial("uh")
        recorder.pause()

        assertEquals(0f, state.level, 0f)
        assertNull(state.notice)
        assertEquals("", state.partial)
    }

    @Test
    fun `pause and resume at the wrong moment do nothing`() {
        recorder.pause()
        recorder.resume()
        assertEquals(RecorderState(), state)

        startRecording()
        recorder.resume()
        assertEquals(Phase.LISTENING, state.phase)
        assertEquals(1, transcribers.size)

        recorder.pause()
        val pausedAt = state.pausedAt
        pass(5_000)
        recorder.pause()
        assertEquals("pausing again must not restart the pause", pausedAt, state.pausedAt)
        assertEquals(1, mic.stops)
    }

    @Test
    fun `pausing before the meeting row exists holds the microphone back until resumed`() {
        recorder.start()
        recorder.pause()
        settle()

        assertEquals(Phase.PAUSED, state.phase)
        assertNotNull(state.meetingId)
        assertTrue("the microphone must stay off while paused", transcribers.none { it.listening })

        recorder.resume()
        assertEquals(1, transcribers.count { it.listening })
    }

    @Test
    fun `elapsed time is worked out from the state alone`() {
        assertEquals(0L, RecorderState().elapsed(123_456))
        assertEquals(3_000L, RecorderState(phase = Phase.LISTENING, startedAt = 1_000).elapsed(4_000))
        assertEquals(2_000L, RecorderState(phase = Phase.LISTENING, startedAt = 1_000, pausedTotalMs = 1_000).elapsed(4_000))
        assertEquals(1_500L, RecorderState(phase = Phase.PAUSED, startedAt = 1_000, pausedAt = 2_500).elapsed(9_000))
        assertEquals("a clock that jumped back never gives a negative time", 0L, RecorderState(phase = Phase.LISTENING, startedAt = 5_000).elapsed(4_000))
    }

    // -------------------------------------------------------------------------------------------
    // Notes and flags

    @Test
    fun `a typed note and a flag are stored at the moment they were made`() {
        val id = startRecording()
        pass(12_000)
        recorder.addNote("  Dana owns the deck \n")
        pass(3_000)
        recorder.flag()
        pass(1_000)
        mic.say("moving on")
        settle()

        val saved = segments(id)
        assertEquals(listOf(SegmentKind.NOTE, SegmentKind.FLAG, SegmentKind.SPEECH), saved.map { it.kind })
        assertEquals(listOf("Dana owns the deck", "", "moving on"), saved.map { it.text })
        assertEquals(listOf(12_000L, 15_000L, 16_000L), saved.map { it.offsetMs })
    }

    @Test
    fun `an empty note is not stored`() {
        val id = startRecording()
        recorder.addNote("")
        recorder.addNote("   \n")
        settle()
        assertTrue(segments(id).isEmpty())
    }

    @Test
    fun `notes can be typed while paused and carry the time of the pause`() {
        val id = startRecording()
        pass(20_000)
        recorder.pause()
        pass(60_000)
        recorder.addNote("Decision: three tiers")
        recorder.flag()
        settle()

        assertEquals(listOf(20_000L, 20_000L), segments(id).map { it.offsetMs })
        assertEquals(listOf(SegmentKind.NOTE, SegmentKind.FLAG), segments(id).map { it.kind })
    }

    @Test
    fun `notes and flags do nothing when nothing is recording`() {
        recorder.addNote("stray")
        recorder.flag()
        settle()
        assertTrue(allMeetings().isEmpty())
    }

    @Test
    fun `renaming during the recording names the meeting`() {
        val id = startRecording()
        recorder.rename("  Pricing review ")
        assertEquals("Pricing review", state.title)
        settle()

        assertEquals("Pricing review", meeting(id).title)
        assertFalse(meeting(id).titleIsAuto)

        recorder.rename("   ")
        settle()
        assertEquals("Pricing review", state.title)
        assertEquals("Pricing review", meeting(id).title)
    }

    // -------------------------------------------------------------------------------------------
    // Stopping

    @Test
    fun `stopping closes the meeting and reports it once`() {
        val id = startRecording()
        pass(60_000)
        mic.say("one two three")
        pass(30_000)
        val microphone = mic

        recorder.stop()

        assertEquals(RecorderState(), state)
        assertFalse(microphone.listening)
        assertEquals(listOf(true, false), keepAlive)

        settle()
        val saved = meeting(id)
        assertEquals(MeetingStatus.TRANSCRIBED, saved.status)
        assertEquals(time(), saved.endedAt)
        assertEquals(3, saved.wordCount)
        assertEquals(listOf(id), finished)

        recorder.stop()
        settle()
        assertEquals("stopping twice reports once", listOf(id), finished)
        assertEquals(listOf(true, false), keepAlive)
    }

    @Test
    fun `the meeting is only reported after everything heard has been saved`() {
        val id = startRecording()
        mic.say("first")
        mic.partial("and the very last words")
        recorder.stop()
        settle()

        assertEquals(listOf("first", "and the very last words"), segments(id).map { it.text })
        assertEquals("the words delivered on stop are counted", 6, meeting(id).wordCount)
        assertEquals(listOf(id), finished)
    }

    @Test
    fun `stopping while paused closes the meeting too`() {
        val id = startRecording()
        mic.say("before the pause")
        recorder.pause()
        pass(10_000)
        recorder.stop()
        settle()

        assertEquals(RecorderState(), state)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
        assertEquals(listOf(id), finished)
    }

    @Test
    fun `stopping immediately after starting does not leave a meeting recording`() {
        recorder.start("Changed my mind")
        recorder.stop()
        assertEquals(RecorderState(), state)

        settle()
        pass(10_000)

        assertTrue("no meeting may be left marked as recording", allMeetings().none { it.status == MeetingStatus.RECORDING })
        assertTrue("the microphone was never needed", transcribers.none { it.listening })
        assertFalse(state.active)
        assertTrue(allMeetings().all { it.endedAt != null })
    }

    @Test
    fun `stopping and starting again straight away leaves exactly one recording`() {
        recorder.start("First try")
        recorder.stop()
        recorder.start("Second try")
        settle()

        assertEquals(Phase.LISTENING, state.phase)
        assertEquals("Second try", state.title)
        val recording = allMeetings().filter { it.status == MeetingStatus.RECORDING }
        assertEquals("only the recording in progress may be marked as recording", listOf("Second try"), recording.map { it.title })
        assertEquals(recording.single().id, state.meetingId)
        assertEquals("one recording needs one microphone", 1, transcribers.count { it.listening })

        // And what is heard goes to the meeting on screen.
        mic.say("hello")
        settle()
        assertEquals(listOf("hello"), segments(state.meetingId!!).map { it.text })
    }

    @Test
    fun `after stopping a new recording starts clean`() {
        val first = startRecording("First")
        pass(30_000)
        mic.say("one")
        recorder.pause()
        pass(5_000)
        recorder.resume()
        recorder.stop()
        settle()

        pass(600_000)
        val second = startRecording("Second")

        assertNotEquals(first, second)
        assertEquals(0, state.finalCount)
        assertEquals(0L, state.pausedTotalMs)
        assertEquals(0L, state.elapsed(time()))
        mic.say("two")
        settle()
        assertEquals(listOf("one"), segments(first).map { it.text })
        assertEquals(listOf("two"), segments(second).map { it.text })
        assertEquals(listOf(true, false, true), keepAlive)
    }

    @Test
    fun `a transcriber that reports late, after the stop, is ignored`() {
        val id = startRecording()
        val late = mic.listener!!
        recorder.stop()
        settle()

        late.onPartial("ghost")
        late.onFinal("ghost words")
        late.onLevel(0.9f)
        late.onNotice("Retrying…")
        settle()

        assertEquals(RecorderState(), state)
        assertTrue(segments(id).isEmpty())
    }

    @Test
    fun `a failure in what happens after saving does not break the recorder`() {
        finishedHookFails = true
        val first = startRecording()
        mic.say("one")
        recorder.stop()
        settle()
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(first).status)

        finishedHookFails = false
        val second = startRecording()
        mic.say("two")
        recorder.stop()
        settle()

        assertEquals(listOf("two"), segments(second).map { it.text })
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(second).status)
        assertEquals(listOf(first, second), finished)
    }

    // -------------------------------------------------------------------------------------------
    // Ending by itself

    @Test
    fun `a fatal transcriber error ends the recording and says why`() {
        val id = startRecording()
        pass(20_000)
        mic.say("before the error")
        mic.partial("cut off mid")

        // The real transcriber delivers what it has, lets go of the microphone, then reports.
        val microphone = mic
        val listener = microphone.listener!!
        microphone.stop()
        listener.onFatal("Aide needs the microphone permission to transcribe.")

        assertEquals(Phase.IDLE, state.phase)
        assertFalse(state.active)
        assertEquals("Aide needs the microphone permission to transcribe.", state.error)
        assertNull(state.meetingId)
        assertEquals(listOf(true, false), keepAlive)

        settle()
        assertEquals(listOf("before the error", "cut off mid"), segments(id).map { it.text })
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
        assertEquals(listOf(id), finished)

        recorder.clearError()
        assertEquals(RecorderState(), state)
    }

    @Test
    fun `the error from the last recording is cleared by starting the next`() {
        startRecording()
        mic.listener!!.onFatal("Speech recognition keeps failing on this phone.")
        settle()
        assertNotNull(state.error)

        startRecording()
        assertNull(state.error)
        assertEquals(Phase.LISTENING, state.phase)
    }

    @Test
    fun `a transcriber that cannot start at all ends the recording with its reason`() {
        refuseToStart = "This phone has no speech recognition service."
        recorder.start()
        settle()

        assertEquals(Phase.IDLE, state.phase)
        assertEquals("This phone has no speech recognition service.", state.error)
        assertTrue(allMeetings().none { it.status == MeetingStatus.RECORDING })
        assertEquals(1, allMeetings().size)
        assertEquals(listOf(true, false), keepAlive)
        assertEquals(1, finished.size)
    }

    @Test
    fun `a recording that failed to start cannot cut a later one short`() {
        refuseToStart = "This phone has no speech recognition service."
        recorder.start()
        settle()
        assertFalse(state.active)

        // Ten minutes later the user has fixed it and records a long meeting.
        refuseToStart = null
        pass(10 * 60_000L)
        val id = startRecording("The long one")
        pass(Recorder.MAX_LENGTH_MS - 10 * 60_000L + 60_000L)

        assertTrue("three hours fifty-one minutes in, the second recording must still be running", state.active)
        assertNull(state.error)
        assertEquals(MeetingStatus.RECORDING, meeting(id).status)

        pass(10 * 60_000L)
        assertFalse("it ends at its own four hours", state.active)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
    }

    @Test
    fun `a recording is saved by itself at four hours`() {
        val id = startRecording()
        mic.say("a very long meeting")
        pass(Recorder.MAX_LENGTH_MS - 1_000)
        assertTrue(state.active)
        assertEquals(MeetingStatus.RECORDING, meeting(id).status)

        pass(2_000)

        assertFalse(state.active)
        assertTrue(state.error.orEmpty(), state.error.orEmpty().contains("four-hour"))
        assertFalse(transcribers.any { it.listening })
        assertEquals(MeetingStatus.TRANSCRIBED, meeting(id).status)
        assertEquals(listOf(id), finished)
        assertEquals(listOf(true, false), keepAlive)
    }

    @Test
    fun `the four hours include time spent paused`() {
        startRecording()
        pass(60 * 60_000L)
        recorder.pause()
        pass(Recorder.MAX_LENGTH_MS)
        assertFalse("a recording forgotten on pause is still closed", state.active)
    }

    @Test
    fun `a stopped recording's time limit does not carry over to the next`() {
        startRecording("First")
        pass(60 * 60_000L)
        recorder.stop()
        settle()

        val second = startRecording("Second")
        pass(Recorder.MAX_LENGTH_MS - 60 * 60_000L + 60_000L)

        assertTrue("the second recording is only three hours old", state.active)
        assertEquals(MeetingStatus.RECORDING, meeting(second).status)
        assertEquals(1, finished.size)
    }
}
