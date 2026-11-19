package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.testing.Fixed
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

/** One meeting's notes arriving a part at a time from another app. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class NoteCollectorTest {
    private lateinit var context: Context
    private lateinit var db: AppDatabase
    private lateinit var meetings: MeetingStore
    private var now = Fixed.now

    private fun collector() = NoteCollector(context, meetings, db.meetings()) { now }

    @Before
    fun setUp() {
        context = ApplicationProvider.getApplicationContext()
        context.getSharedPreferences("aide_collecting", Context.MODE_PRIVATE).edit().clear().commit()
        db = AppDatabase.inMemory(context)
        meetings = MeetingStore(db.meetings()) { now }
    }

    @After
    fun tearDown() = db.close()

    private suspend fun text(meetingId: Long) = db.meetings().segments(meetingId).joinToString("\n") { it.text }

    @Test
    fun `nothing is being collected until something starts it`(): Unit = runBlocking {
        val collector = collector()
        assertNull(collector.refresh())
        assertNull(collector.state.value)
        assertNull(collector.finish())
        assertTrue(db.meetings().all().isEmpty())
    }

    @Test
    fun `starting makes one empty meeting to collect into, and starting again does not make another`(): Unit = runBlocking {
        val collector = collector()
        val first = collector.start()
        val again = collector.start()

        assertEquals(first.meetingId, again.meetingId)
        assertEquals(0, first.parts)
        val meeting = db.meetings().all().single()
        assertEquals(MeetingSource.IMPORT, meeting.source)
        assertEquals(MeetingStatus.TRANSCRIBED, meeting.status)
        assertTrue("it is named by Claude later, like any other", meeting.titleIsAuto)
        assertEquals(first, collector.state.value)
    }

    @Test
    fun `the first part added starts the collecting by itself`(): Unit = runBlocking {
        val collector = collector()
        val added = collector.add("Dana said the fix is in review.") as NoteCollector.Added.Part

        assertTrue(added.started)
        assertEquals(1, added.collecting.parts)
        assertEquals(7, added.words)
        assertEquals("Dana said the fix is in review.", text(added.collecting.meetingId))
    }

    @Test
    fun `parts go into the one meeting in the order they arrive`(): Unit = runBlocking {
        val collector = collector()
        val id = collector.start().meetingId
        collector.add("Dana said the fix is in review.")
        now += 60_000
        val second = collector.add("Marcus wants a two-week override window.") as NoteCollector.Added.Part
        now += 60_000
        collector.add("Beta opens on the ninth.\nInvite list is due Tuesday.")

        assertFalse(second.started)
        assertEquals(2, second.collecting.parts)
        assertEquals(
            "Dana said the fix is in review.\nMarcus wants a two-week override window.\nBeta opens on the ninth.\nInvite list is due Tuesday.",
            text(id),
        )
        assertEquals(1, db.meetings().all().size)
        assertEquals(Collecting(id, db.meetings().get(id)!!.title, parts = 3, words = 23), collector.state.value)
        assertEquals(23, db.meetings().get(id)!!.wordCount)
    }

    @Test
    fun `copying the whole box each time adds only what is new`(): Unit = runBlocking {
        val collector = collector()
        val id = collector.start().meetingId
        val first = "Dana said the fix is in review."
        collector.add(first)
        val grown = collector.add("$first Marcus wants a two-week override window.") as NoteCollector.Added.Part
        val same = collector.add("$first Marcus wants a two-week override window.")
        val more = collector.add("$first Marcus wants a two-week override window. Beta opens on the ninth.") as NoteCollector.Added.Part

        assertEquals(6, grown.words)
        assertTrue(same is NoteCollector.Added.NothingNew)
        assertEquals(5, more.words)
        assertEquals(3, more.collecting.parts)
        assertEquals("Dana said the fix is in review.\nMarcus wants a two-week override window.\nBeta opens on the ninth.", text(id))
    }

    @Test
    fun `text with nothing in it is not a part`(): Unit = runBlocking {
        val collector = collector()
        assertEquals(NoteCollector.Added.Empty, collector.add("   \n "))
        assertTrue("and does not start anything", db.meetings().all().isEmpty())
    }

    @Test
    fun `finishing hands back the meeting to write up and ends the collecting`(): Unit = runBlocking {
        val collector = collector()
        val id = (collector.add("Dana said the fix is in review.") as NoteCollector.Added.Part).collecting.meetingId

        assertEquals(id, collector.finish())
        assertNull(collector.state.value)
        assertNull(collector.refresh())
        assertNotNull("the meeting stays", db.meetings().get(id))

        // What comes next is a new meeting.
        val next = collector.add("Something else entirely.") as NoteCollector.Added.Part
        assertTrue(next.started)
        assertTrue(next.collecting.meetingId != id)
    }

    @Test
    fun `finishing with nothing collected leaves no empty meeting behind`(): Unit = runBlocking {
        val collector = collector()
        collector.start()
        assertNull(collector.finish())
        assertTrue(db.meetings().all().isEmpty())
    }

    @Test
    fun `what is being collected survives the app being restarted`(): Unit = runBlocking {
        val id = (collector().add("Dana said the fix is in review.") as NoteCollector.Added.Part).collecting.meetingId

        val afterRestart = collector()
        assertNull("not known until it is looked up", afterRestart.state.value)
        assertEquals(id, afterRestart.refresh()?.meetingId)
        val more = afterRestart.add("Dana said the fix is in review. Marcus agreed.") as NoteCollector.Added.Part
        assertEquals("only what is new, even across the restart", 2, more.words)
        assertEquals(2, more.collecting.parts)
    }

    @Test
    fun `once the meeting has notes it is no longer being collected, and the next part starts a new one`(): Unit = runBlocking {
        val collector = collector()
        val id = (collector.add("Dana said the fix is in review.") as NoteCollector.Added.Part).collecting.meetingId
        // The user opened it and had the notes written from its own screen.
        db.meetings().update(db.meetings().get(id)!!.copy(status = MeetingStatus.READY))

        assertNull(collector.refresh())
        val next = collector.add("A different meeting.") as NoteCollector.Added.Part
        assertTrue(next.started)
        assertEquals("Dana said the fix is in review.", text(id))
    }

    @Test
    fun `a meeting deleted while being collected is forgotten`(): Unit = runBlocking {
        val collector = collector()
        val id = (collector.add("Dana said the fix is in review.") as NoteCollector.Added.Part).collecting.meetingId
        meetings.delete(id)

        assertNull(collector.refresh())
        assertNull(collector.state.value)
    }

    @Test
    fun `left for hours without a new part, the collecting is over but the notes are kept`(): Unit = runBlocking {
        val collector = collector()
        val id = (collector.add("Dana said the fix is in review.") as NoteCollector.Added.Part).collecting.meetingId

        now += NoteCollector.OPEN_FOR_MS - 60_000
        assertNotNull(collector.refresh())
        now += 120_000
        assertNull(collector.refresh())
        assertEquals("Dana said the fix is in review.", text(id))
    }

    @Test
    fun `a collection started and then left with nothing in it clears itself away`(): Unit = runBlocking {
        val collector = collector()
        collector.start()
        now += NoteCollector.OPEN_FOR_MS + 1

        assertNull(collector.refresh())
        assertTrue(db.meetings().all().isEmpty())
    }

    @Test
    fun `adding to a meeting keeps its lines in order and counts its words`(): Unit = runBlocking {
        val id = meetings.importText("Standup", "First line.\nSecond line.")
        assertTrue(meetings.appendText(id, "Third line.\n\nFourth line."))

        assertEquals("First line.\nSecond line.\nThird line.\nFourth line.", text(id))
        assertEquals(8, db.meetings().get(id)!!.wordCount)
        assertEquals("Standup", db.meetings().get(id)!!.title)
        assertFalse("nothing to add", meetings.appendText(id, "  "))
        assertFalse("no such meeting", meetings.appendText(9_999, "Words."))
    }
}
