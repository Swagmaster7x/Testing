package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.domain.Days
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class MeetingStoreTest {
    private lateinit var db: AppDatabase
    private lateinit var store: MeetingStore
    private var now = Fixed.now

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        store = MeetingStore(db.meetings()) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    private suspend fun get(id: Long): MeetingEntity = db.meetings().get(id)!!

    // -------------------------------------------------------------------------------------------
    // Live recordings

    @Test
    fun `a live recording without a name gets a dated placeholder`(): Unit = runBlocking {
        val id = store.startLive(null, attendees = listOf("Dana", "Marcus"), calendarEventId = 42)
        val meeting = get(id)

        assertEquals("Meeting, " + Days.dateTime(now), meeting.title)
        assertEquals(MeetingStore.defaultTitle(now), meeting.title)
        assertTrue(meeting.titleIsAuto)
        assertEquals(now, meeting.startedAt)
        assertNull(meeting.endedAt)
        assertEquals(MeetingSource.LIVE, meeting.source)
        assertEquals(MeetingStatus.RECORDING, meeting.status)
        assertEquals(listOf("Dana", "Marcus"), meeting.attendees)
        assertEquals(42L, meeting.calendarEventId)
    }

    @Test
    fun `a name given at the start is the user's and is kept`(): Unit = runBlocking {
        val named = get(store.startLive("  Weekly sync "))
        assertEquals("Weekly sync", named.title)
        assertFalse(named.titleIsAuto)

        val blank = get(store.startLive("   "))
        assertTrue("a blank name is no name", blank.titleIsAuto)
        assertEquals(MeetingStore.defaultTitle(now), blank.title)
    }

    @Test
    fun `segments are stored trimmed with their kind and offset`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.addSegment(id, SegmentKind.SPEECH, "  good morning everyone ", 1_500)
        store.addSegment(id, SegmentKind.NOTE, "Dana owns the deck\n", 20_000)
        store.addSegment(id, SegmentKind.FLAG, "", 21_000)

        val segments = db.meetings().segments(id)
        assertEquals(listOf("good morning everyone", "Dana owns the deck", ""), segments.map { it.text })
        assertEquals(listOf(SegmentKind.SPEECH, SegmentKind.NOTE, SegmentKind.FLAG), segments.map { it.kind })
        assertEquals(listOf(1_500L, 20_000L, 21_000L), segments.map { it.offsetMs })
        assertTrue(segments.all { it.meetingId == id })
    }

    @Test
    fun `segments read back in the order they were spoken`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.addSegment(id, SegmentKind.SPEECH, "third", 9_000)
        store.addSegment(id, SegmentKind.SPEECH, "first", 1_000)
        store.addSegment(id, SegmentKind.NOTE, "second, typed at the same moment as the next", 5_000)
        store.addSegment(id, SegmentKind.SPEECH, "also second", 5_000)

        assertEquals(
            listOf("first", "second, typed at the same moment as the next", "also second", "third"),
            db.meetings().segments(id).map { it.text },
        )
    }

    @Test
    fun `finishing closes the recording and counts its words`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.addSegment(id, SegmentKind.SPEECH, "one two three", 0)
        store.addSegment(id, SegmentKind.NOTE, " four five ", 1_000)
        store.addSegment(id, SegmentKind.FLAG, "", 2_000)
        now += 30 * 60_000

        val finished = store.finish(id)

        assertEquals(get(id), finished)
        assertEquals(MeetingStatus.TRANSCRIBED, finished!!.status)
        assertEquals(now, finished.endedAt)
        assertEquals(5, finished.wordCount)
    }

    @Test
    fun `finishing twice keeps the first end time`(): Unit = runBlocking {
        val id = store.startLive(null)
        now += 60_000
        store.finish(id)
        val endedAt = get(id).endedAt
        now += 3_600_000
        store.finish(id)

        assertEquals(endedAt, get(id).endedAt)
        assertEquals(MeetingStatus.TRANSCRIBED, get(id).status)
    }

    @Test
    fun `finishing never takes a summary away`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.finish(id)
        db.meetings().update(get(id).copy(status = MeetingStatus.READY, tldr = "Agreed three tiers."))
        store.finish(id)

        assertEquals(MeetingStatus.READY, get(id).status)
        assertEquals("Agreed three tiers.", get(id).tldr)
    }

    @Test
    fun `finishing a meeting that has gone gives nothing`(): Unit = runBlocking {
        assertNull(store.finish(404))
        assertTrue(db.meetings().all().isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Pasted text

    @Test
    fun `pasted text becomes a finished meeting with a segment per line`(): Unit = runBlocking {
        val startedAt = now - 86_400_000
        val id = store.importText("  Vendor call ", "Dana: let's start.\r\n\r\nMarcus: pricing first.\n  Action: Sam to send the deck.  \n", startedAt)
        val meeting = get(id)

        assertEquals("Vendor call", meeting.title)
        assertFalse(meeting.titleIsAuto)
        assertEquals(MeetingSource.IMPORT, meeting.source)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting.status)
        assertEquals(startedAt, meeting.startedAt)
        assertEquals(startedAt, meeting.endedAt)
        assertEquals(3 + 3 + 6, meeting.wordCount)

        val segments = db.meetings().segments(id)
        assertEquals(listOf("Dana: let's start.", "Marcus: pricing first.", "Action: Sam to send the deck."), segments.map { it.text })
        assertTrue(segments.all { it.kind == SegmentKind.SPEECH })
        assertEquals("lines keep their order", segments.map { it.offsetMs }.sorted(), segments.map { it.offsetMs })
        assertEquals(3, segments.map { it.offsetMs }.toSet().size)
    }

    @Test
    fun `pasted text without a name is dated now`(): Unit = runBlocking {
        val meeting = get(store.importText(null, "Just one line of notes."))
        assertTrue(meeting.titleIsAuto)
        assertEquals(MeetingStore.defaultTitle(now), meeting.title)
        assertEquals(now, meeting.startedAt)
    }

    @Test
    fun `text brought in as something to know is saved as a document, and is otherwise the same`(): Unit = runBlocking {
        val text = "Team handbook\n\nWe ship on Thursdays.\nAsk Priya about budgets."
        val document = get(store.importText("Team handbook", text, source = MeetingSource.DOCUMENT))
        val notes = get(store.importText("Team handbook", text, source = MeetingSource.IMPORT))

        assertEquals(MeetingSource.DOCUMENT, document.source)
        assertEquals(MeetingSource.IMPORT, notes.source)
        assertEquals("nothing but the source differs", notes.copy(id = document.id, source = MeetingSource.DOCUMENT), document)
        assertEquals(MeetingStatus.TRANSCRIBED, document.status)
        assertEquals(now, document.startedAt)
        assertEquals(now, document.endedAt)
        assertEquals(2 + 4 + 4, document.wordCount)
        assertEquals(
            listOf("Team handbook", "We ship on Thursdays.", "Ask Priya about budgets."),
            db.meetings().segments(document.id).map { it.text },
        )
    }

    @Test
    fun `text brought in is a meeting's notes unless said to be a document`(): Unit = runBlocking {
        assertEquals(MeetingSource.IMPORT, get(store.importText("Vendor call", "Some notes.")).source)
        assertEquals(MeetingSource.IMPORT, get(store.importText(null, "Some notes.", now - 1_000)).source)
    }

    @Test
    fun `a document without a name gets the dated placeholder for the assistant to replace`(): Unit = runBlocking {
        val document = get(store.importText("  ", "Reference material.", source = MeetingSource.DOCUMENT))
        assertTrue(document.titleIsAuto)
        assertEquals(MeetingStore.defaultTitle(now), document.title)
    }

    @Test
    fun `a document that was never read is left a document by a restart`(): Unit = runBlocking {
        val id = store.importText("Team handbook", "We ship on Thursdays.", source = MeetingSource.DOCUMENT)
        db.meetings().update(get(id).copy(status = MeetingStatus.PROCESSING))

        store.recoverAfterRestart()

        assertEquals(MeetingStatus.TRANSCRIBED, get(id).status)
        assertEquals(MeetingSource.DOCUMENT, get(id).source)
    }

    // -------------------------------------------------------------------------------------------
    // Renaming, rating, deleting

    @Test
    fun `renaming makes the name the user's`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.rename(id, "  Pricing review ")
        assertEquals("Pricing review", get(id).title)
        assertFalse(get(id).titleIsAuto)
    }

    @Test
    fun `renaming to nothing is ignored`(): Unit = runBlocking {
        val id = store.startLive(null)
        val before = get(id)
        store.rename(id, "   ")
        store.rename(404, "Ghost")
        assertEquals(before, get(id))
        assertEquals(1, db.meetings().all().size)
    }

    @Test
    fun `a rating is thumbs up, thumbs down or none`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.rate(id, 1)
        assertEquals(1, get(id).rating)
        store.rate(id, -1)
        assertEquals(-1, get(id).rating)
        store.rate(id, 0)
        assertEquals(0, get(id).rating)
        store.rate(id, 7)
        assertEquals(1, get(id).rating)
        store.rate(id, -7)
        assertEquals(-1, get(id).rating)
    }

    @Test
    fun `deleting a meeting takes its transcript and leaves its tasks and questions standing`(): Unit = runBlocking {
        val id = store.startLive("Pricing review")
        val other = store.startLive("Roadmap sync")
        store.addSegment(id, SegmentKind.SPEECH, "hello", 0)
        store.addSegment(other, SegmentKind.SPEECH, "kept", 0)
        val taskId = db.tasks().insert(task(title = "Send deck", meetingId = id))
        val questionId = db.questions().insert(QuestionEntity(meetingId = id, question = "Who is Marcus?", createdAt = now))

        store.delete(id)

        assertNull(db.meetings().get(id))
        assertNotNull(db.meetings().get(other))
        assertEquals(listOf("kept"), db.meetings().allSegments().map { it.text })
        assertNull("the task survives without its meeting", db.tasks().get(taskId)!!.meetingId)
        assertNull(db.questions().get(questionId)!!.meetingId)
        store.delete(404)
    }

    // -------------------------------------------------------------------------------------------
    // Picking up after the app was killed

    @Test
    fun `a recording cut off by a restart is closed with what it captured`(): Unit = runBlocking {
        val id = store.startLive(null)
        store.addSegment(id, SegmentKind.SPEECH, "we got this far", 0)
        now += 600_000

        store.recoverAfterRestart()

        assertEquals(MeetingStatus.TRANSCRIBED, get(id).status)
        assertEquals(now, get(id).endedAt)
        assertEquals(4, get(id).wordCount)
    }

    @Test
    fun `the recording still in progress is left alone`(): Unit = runBlocking {
        val abandoned = store.startLive(null)
        val active = store.startLive(null)

        store.recoverAfterRestart(activeMeetingId = active)

        assertEquals(MeetingStatus.TRANSCRIBED, get(abandoned).status)
        assertEquals(MeetingStatus.RECORDING, get(active).status)
        assertNull(get(active).endedAt)
    }

    @Test
    fun `a summary cut short can be asked for again and finished ones are untouched`(): Unit = runBlocking {
        val processing = store.importText("A", "one")
        val ready = store.importText("B", "two")
        val failed = store.importText("C", "three")
        db.meetings().update(get(processing).copy(status = MeetingStatus.PROCESSING))
        db.meetings().update(get(ready).copy(status = MeetingStatus.READY, tldr = "Done."))
        db.meetings().update(get(failed).copy(status = MeetingStatus.FAILED, error = "Claude is busy"))

        store.recoverAfterRestart()

        assertEquals(MeetingStatus.TRANSCRIBED, get(processing).status)
        assertEquals(MeetingStatus.READY, get(ready).status)
        assertEquals("Done.", get(ready).tldr)
        assertEquals(MeetingStatus.FAILED, get(failed).status)
        assertEquals("Claude is busy", get(failed).error)
    }
}
