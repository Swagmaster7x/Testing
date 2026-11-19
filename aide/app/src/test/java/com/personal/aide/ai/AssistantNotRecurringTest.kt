package com.personal.aide.ai

import android.app.Application
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.SeriesGuess
import com.personal.aide.data.SeriesStore
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.domain.knowledgeKey
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.prompt
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/**
 * "Not a recurring meeting" is something the user decided, and it has to survive the notes being
 * written again; and "since last time" needs a last time to be measured against.
 */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AssistantNotRecurringTest : AssistantTestBase() {
    private val store by lazy { SeriesStore(db.series(), db.meetings()) { now } }

    private suspend fun series(name: String, calendarEventId: Long? = null): Long =
        db.series().insert(SeriesEntity(name = name, key = knowledgeKey(name), calendarEventId = calendarEventId, createdAt = 1))

    private suspend fun occurrence(seriesId: Long, daysAgo: Long): Long {
        val id = summarized("Pricing sync", Fixed.at(today - daysAgo, 10), MeetingAnalysis(title = "Pricing sync", tldr = "Notes from $daysAgo days ago."))
        db.meetings().setSeries(id, seriesId)
        return id
    }

    private fun reply(series: SeriesGuess = SeriesGuess(), sinceLastTime: List<String> = emptyList()) =
        llm.reply(json(MeetingAnalysis(tldr = "Today's notes.", series = series, sinceLastTime = sinceLastTime)))

    @Test
    fun `a meeting the user took out of a series stays out when its notes are written again`(): Unit = runBlocking {
        settings.setProfile(sam)
        val sync = series("Pricing sync")
        occurrence(sync, daysAgo = 7)
        val id = recorded("Pricing sync")
        db.meetings().setSeries(id, sync)

        store.exclude(id)
        // The assistant would put it straight back, given the choice.
        reply(SeriesGuess(existingId = sync), sinceLastTime = listOf("The deck went out."))
        assertEquals(Assistant.SummaryResult.Done, assistant.summarizeMeeting(id))

        assertEquals(SeriesStore.NOT_RECURRING, meeting(id).seriesId)
        assertTrue(ContextBlocks.analysisOf(meeting(id))!!.sinceLastTime.isEmpty())
        assertEquals("the series itself is untouched", 1, db.meetings().inSeries(sync).size)
    }

    @Test
    fun `it is not offered a series to choose from, and cannot start a new one`(): Unit = runBlocking {
        settings.setProfile(sam)
        val sync = series("Pricing sync")
        occurrence(sync, daysAgo = 7)
        val id = recorded("Pricing sync")
        store.exclude(id)

        reply(SeriesGuess(newName = "Weekly pricing"))
        assistant.summarizeMeeting(id)

        val sent = llm.last.prompt.substringAfter("<recurring_meetings>\n").substringBefore("\n</recurring_meetings>")
        assertEquals("The user has said this meeting is not one of their recurring meetings.", sent)
        assertEquals(listOf("Pricing sync"), db.series().all().map { it.name })
        assertEquals(SeriesStore.NOT_RECURRING, meeting(id).seriesId)
    }

    @Test
    fun `the calendar does not put it back either, and its other recordings are not dragged out with it`(): Unit = runBlocking {
        suspend fun fromCalendar(eventId: Long): Long {
            val id = meetings.startLive("Pricing sync", calendarEventId = eventId)
            meetings.addSegment(id, SegmentKind.SPEECH, "good morning everyone", 0)
            now += 30 * 60_000L
            meetings.finish(id)
            return id
        }
        val first = fromCalendar(77)
        store.exclude(first)

        // Recorded again from the same repeating event: that makes a series, but not one with the excluded meeting in it.
        val second = fromCalendar(77)
        store.linkByCalendar(second)
        store.linkByCalendar(first)

        assertEquals(SeriesStore.NOT_RECURRING, meeting(first).seriesId)
        val made = meeting(second).seriesId
        assertTrue("the second recording starts a real series", made != null && made != SeriesStore.NOT_RECURRING)

        val third = fromCalendar(77)
        store.linkByCalendar(third)
        assertEquals(made, meeting(third).seriesId)
        assertNull("an excluded meeting has no previous occurrence", store.previous(meeting(first)))
    }

    @Test
    fun `since last time is dropped when the series it joined had no earlier notes to compare with`(): Unit = runBlocking {
        settings.setProfile(sam)
        // A series that exists but has never been held with notes: there is no "last time".
        val sync = series("Pricing sync")
        val id = recorded("Pricing sync")

        reply(SeriesGuess(existingId = sync), sinceLastTime = listOf("The deck went out."))
        assistant.summarizeMeeting(id)

        assertEquals(sync, meeting(id).seriesId)
        assertTrue(llm.last.prompt.contains("No earlier notes on record."))
        assertTrue(ContextBlocks.analysisOf(meeting(id))!!.sinceLastTime.isEmpty())
    }

    @Test
    fun `with an earlier occurrence on record, since last time is kept`(): Unit = runBlocking {
        settings.setProfile(sam)
        val sync = series("Pricing sync")
        occurrence(sync, daysAgo = 7)
        val id = recorded("Pricing sync")

        reply(SeriesGuess(existingId = sync), sinceLastTime = listOf("  The deck went out.  "))
        assistant.summarizeMeeting(id)

        assertEquals(listOf("The deck went out."), ContextBlocks.analysisOf(meeting(id))!!.sinceLastTime)
        assertFalse(llm.last.prompt.contains("The user has said this meeting is not"))
    }
}
