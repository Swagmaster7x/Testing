package com.personal.aide.domain

import com.personal.aide.data.AideJson
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.util.Locale

class PrepTest {
    private val zone = Fixed.zone
    private val today = Fixed.today

    /** The meeting being prepared for: three o'clock this afternoon, from calendar event 77. */
    private val start = Fixed.at(today, 15)
    private val eventId = 77L
    private lateinit var localeBefore: Locale

    @Before
    fun useAKnownLocale() {
        // Dates in the reminder are written the way the phone writes them.
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
    }

    @After
    fun restoreLocale() {
        Locale.setDefault(localeBefore)
    }

    private fun List<TaskEntity>.ids() = map { it.id }

    private fun series(id: Long, name: String, calendarEventId: Long? = null) =
        SeriesEntity(id = id, name = name, key = knowledgeKey(name), calendarEventId = calendarEventId, createdAt = 1)

    private fun person(id: Long, name: String) =
        KnowledgeEntity(id = id, type = KnowledgeType.PERSON, title = name, key = knowledgeKey(name), content = "About $name.", createdAt = 1, updatedAt = 1)

    /** A meeting held at ten in the morning, [daysAgo] days before today. */
    private fun held(
        id: Long,
        title: String = "Quoting standup",
        daysAgo: Long,
        seriesId: Long? = null,
        calendarEventId: Long? = null,
        status: MeetingStatus = MeetingStatus.READY,
        tldr: String = "Notes from $daysAgo days ago.",
        analysis: MeetingAnalysis? = MeetingAnalysis(title = title, tldr = tldr),
    ) = MeetingEntity(
        id = id,
        title = title,
        titleIsAuto = false,
        startedAt = Fixed.at(today - daysAgo, 10),
        endedAt = Fixed.at(today - daysAgo, 10, 30),
        status = status,
        calendarEventId = calendarEventId,
        tldr = if (status == MeetingStatus.READY) tldr else "",
        analysisJson = if (status == MeetingStatus.READY && analysis != null) AideJson.encodeToString(MeetingAnalysis.serializer(), analysis) else "",
        seriesId = seriesId,
    )

    private fun owed(id: Long, owner: String, title: String = "Task $id", due: Long? = null, meetingId: Long? = null) =
        task(id, title = title, ownership = Ownership.OTHERS, owner = owner, due = due, meetingId = meetingId)

    private fun brief(
        title: String = "Quoting standup",
        calendarEventId: Long? = eventId,
        attendees: List<String> = listOf("Sam Rivera", "Dana Whitfield"),
        self: String = "Sam Rivera",
        meetings: List<MeetingEntity> = emptyList(),
        tasks: List<TaskEntity> = emptyList(),
        series: List<SeriesEntity> = emptyList(),
        entries: List<KnowledgeEntity> = emptyList(),
    ) = buildPrepBrief(title, calendarEventId, start, attendees, self, meetings, tasks, series, entries)

    // -------------------------------------------------------------------------------------------
    // Nothing on record

    @Test
    fun `an event nothing is known about has no history and says so`() {
        val brief = brief(
            meetings = listOf(held(1, title = "Hiring sync", daysAgo = 3)),
            tasks = listOf(task(1, title = "Tidy the backlog"), owed(2, "Marcus Lee")),
        )

        assertEquals("Quoting standup", brief.title)
        assertEquals(start, brief.start)
        assertNull(brief.series)
        assertNull(brief.last)
        assertTrue(brief.lastDecisions.isEmpty())
        assertTrue(brief.lastOpenQuestions.isEmpty())
        assertTrue(brief.carriedOver.isEmpty())
        assertTrue(brief.theyOwe.isEmpty())
        assertTrue(brief.openWithThem.isEmpty())
        assertFalse(brief.hasHistory)
        assertEquals("Nothing on record for this one yet. Tap to open Aide and record it.", brief.summary(zone))
    }

    @Test
    fun `the user is left out of the people invited`() {
        val brief = brief(attendees = listOf("Sam Rivera", "Dana Whitfield", "sam rivera", "Marcus Lee"))
        assertEquals(listOf("Dana Whitfield", "Marcus Lee"), brief.attendees)
    }

    @Test
    fun `with no name for the user everyone invited is listed`() {
        val brief = brief(attendees = listOf("Sam Rivera", "Dana Whitfield"), self = "")
        assertEquals(listOf("Sam Rivera", "Dana Whitfield"), brief.attendees)
    }

    @Test
    fun `the user's own tasks are not listed as owed by someone invited`() {
        // The calendar lists the user among the attendees; a task of theirs must not read as "they owe you".
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            tasks = listOf(owed(1, "Sam Rivera"), task(2, title = "Sam Rivera to send the deck")),
        )
        assertTrue(brief.theyOwe.isEmpty())
        assertTrue(brief.openWithThem.isEmpty())
        assertFalse(brief.hasHistory)
    }

    // -------------------------------------------------------------------------------------------
    // Which recurring meeting this is

    @Test
    fun `the series recorded from this calendar event is found by the event, whatever the event is called now`() {
        val standup = series(5, "Quoting standup", calendarEventId = eventId)
        val brief = brief(
            title = "Standup (new time)",
            series = listOf(series(4, "Hiring sync", calendarEventId = 12), standup),
            meetings = listOf(held(1, daysAgo = 7, seriesId = 5, calendarEventId = eventId)),
        )

        assertEquals(standup, brief.series)
        assertEquals(1L, brief.last?.id)
    }

    @Test
    fun `a series is found by its name when it was not recorded from this event`() {
        val standup = series(5, "Quoting standup")
        val listed = listOf(series(4, "Hiring sync"), standup)

        assertEquals(standup, brief(title = "quoting  STANDUP!", calendarEventId = 99, series = listed).series)
        assertEquals("an event typed in by hand has no calendar id", standup, brief(calendarEventId = null, series = listed).series)
        assertNull(brief(title = "Quoting retro", series = listed).series)
    }

    @Test
    fun `the series tied to the calendar event wins over one that only shares the name`() {
        val fromCalendar = series(5, "Weekly quoting sync", calendarEventId = eventId)
        val sameName = series(6, "Quoting standup")
        assertEquals(fromCalendar, brief(series = listOf(sameName, fromCalendar)).series)
    }

    @Test
    fun `an earlier recording of the same event leads to the series it was filed in`() {
        val filed = series(5, "Dana and Sam")
        val brief = brief(
            title = "Catch-up",
            series = listOf(series(4, "Hiring sync"), filed),
            meetings = listOf(
                held(1, title = "Catch-up with Dana", daysAgo = 7, seriesId = 5, calendarEventId = eventId),
                held(2, title = "Earlier, no event", daysAgo = 14, seriesId = 5),
            ),
        )

        assertEquals(filed, brief.series)
        assertEquals(1L, brief.last?.id)
    }

    @Test
    fun `with no series an earlier meeting from the same event or of the same name is still last time`() {
        val sameEvent = held(1, title = "Standup (renamed)", daysAgo = 14, calendarEventId = eventId)
        val sameName = held(2, title = "quoting standup", daysAgo = 7)
        val unrelated = held(3, title = "Hiring sync", daysAgo = 1, calendarEventId = 12)

        assertEquals(2L, brief(meetings = listOf(sameEvent, sameName, unrelated)).last?.id)
        assertEquals(1L, brief(meetings = listOf(sameEvent, unrelated)).last?.id)
        assertNull(brief(meetings = listOf(unrelated)).last)
        assertNull(brief(meetings = listOf(sameEvent, sameName, unrelated)).series)
    }

    @Test
    fun `a document with the meeting's name is not last time`() {
        // The user added the standup's handbook under the standup's own name, after the last standup.
        val handbook = held(1, title = "Quoting standup", daysAgo = 1, tldr = "How the standup is run.").copy(source = MeetingSource.DOCUMENT)
        val lastStandup = held(2, title = "Quoting standup", daysAgo = 7, tldr = "Agreed the release date.")
        val fromTheHandbook = task(5, title = "Read the release checklist", meetingId = 1)

        val brief = brief(calendarEventId = null, meetings = listOf(handbook, lastStandup), tasks = listOf(fromTheHandbook))
        assertEquals(2L, brief.last?.id)
        assertTrue(brief.summary(zone), brief.summary(zone).contains("Agreed the release date."))
        assertTrue("a task from the document was not carried over from an earlier meeting", brief.carriedOver.isEmpty())

        val onlyTheDocument = brief(calendarEventId = null, meetings = listOf(handbook), tasks = listOf(fromTheHandbook))
        assertNull(onlyTheDocument.last)
        assertTrue(onlyTheDocument.lastDecisions.isEmpty())
        assertFalse(onlyTheDocument.hasHistory)
    }

    @Test
    fun `a document does not stand in for last time in a series either`() {
        val standup = series(5, "Quoting standup", calendarEventId = eventId)
        // However it came to be filed there, a document in the series is not an occurrence of it.
        val handbook = held(1, daysAgo = 1, seriesId = 5, tldr = "How the standup is run.").copy(source = MeetingSource.DOCUMENT)
        val lastStandup = held(2, daysAgo = 7, seriesId = 5, tldr = "Agreed the release date.")

        val brief = brief(meetings = listOf(handbook, lastStandup), series = listOf(standup))
        assertEquals(standup, brief.series)
        assertEquals(2L, brief.last?.id)
    }

    @Test
    fun `notes the user typed up from last time are still last time`() {
        val typed = held(1, daysAgo = 7, calendarEventId = eventId).copy(source = MeetingSource.IMPORT)
        assertEquals(1L, brief(meetings = listOf(typed)).last?.id)
    }

    @Test
    fun `an event with no name does not match every other meeting with none`() {
        val brief = brief(title = "", calendarEventId = null, meetings = listOf(held(1, title = "", daysAgo = 3), held(2, title = "?!", daysAgo = 2)))
        assertNull(brief.last)
        assertFalse(brief.hasHistory)
    }

    @Test
    fun `once there is a series only its meetings are last time`() {
        val standup = series(5, "Quoting standup", calendarEventId = eventId)
        val brief = brief(
            series = listOf(standup),
            meetings = listOf(
                held(1, daysAgo = 14, seriesId = 5),
                // The same name, more recent, but the user took it out of the series.
                held(2, daysAgo = 2, seriesId = null),
                held(3, title = "Hiring sync", daysAgo = 1, seriesId = 9),
            ),
            tasks = listOf(task(1, title = "From the series", meetingId = 1), task(2, title = "From the stray", meetingId = 2)),
        )

        assertEquals(1L, brief.last?.id)
        assertEquals(listOf(1L), brief.carriedOver.ids())
    }

    // -------------------------------------------------------------------------------------------
    // Last time

    private val standup = series(5, "Quoting standup", calendarEventId = eventId)

    @Test
    fun `last time is the latest earlier occurrence that has notes`() {
        val brief = brief(
            series = listOf(standup),
            meetings = listOf(
                held(1, daysAgo = 14, seriesId = 5, analysis = MeetingAnalysis(decisions = listOf("Old decision"))),
                held(
                    2, daysAgo = 7, seriesId = 5, tldr = "Rate feed is two weeks late.",
                    analysis = MeetingAnalysis(decisions = listOf("Ship behind a flag", "Dana owns the feed"), openQuestions = listOf("Who signs off on discounts?")),
                ),
                // Recorded but never summarized: nothing to quote from.
                held(3, daysAgo = 2, seriesId = 5, status = MeetingStatus.TRANSCRIBED),
                held(4, daysAgo = 1, seriesId = 5, status = MeetingStatus.FAILED),
            ),
        )

        assertEquals(2L, brief.last?.id)
        assertEquals(listOf("Ship behind a flag", "Dana owns the feed"), brief.lastDecisions)
        assertEquals(listOf("Who signs off on discounts?"), brief.lastOpenQuestions)
        assertTrue(brief.hasHistory)
    }

    @Test
    fun `a meeting that starts at or after this one is not last time`() {
        val later = held(1, daysAgo = 0, seriesId = 5).copy(startedAt = start + 60_000)
        val sameMoment = held(2, daysAgo = 0, seriesId = 5).copy(startedAt = start)
        val nextWeek = held(3, daysAgo = -7, seriesId = 5)

        val brief = brief(series = listOf(standup), meetings = listOf(later, sameMoment, nextWeek), tasks = listOf(task(1, meetingId = 3)))

        assertNull(brief.last)
        assertTrue("nor is anything carried over from it", brief.carriedOver.isEmpty())
    }

    @Test
    fun `a meeting earlier the same day is last time`() {
        val thisMorning = held(1, daysAgo = 0, seriesId = 5)
        assertEquals(1L, brief(series = listOf(standup), meetings = listOf(thisMorning)).last?.id)
    }

    @Test
    fun `notes that cannot be read leave last time without decisions rather than failing`() {
        val damaged = held(1, daysAgo = 7, seriesId = 5).copy(analysisJson = "{not json")
        val brief = brief(series = listOf(standup), meetings = listOf(damaged))

        assertEquals(1L, brief.last?.id)
        assertTrue(brief.lastDecisions.isEmpty())
        assertTrue(brief.lastOpenQuestions.isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // What is still open

    @Test
    fun `open tasks from earlier occurrences are carried over, soonest due first, undated last`() {
        val brief = brief(
            series = listOf(standup),
            meetings = listOf(
                held(1, daysAgo = 14, seriesId = 5),
                held(2, daysAgo = 7, seriesId = 5),
                held(3, daysAgo = 2, seriesId = 5, status = MeetingStatus.TRANSCRIBED),
                held(4, title = "Hiring sync", daysAgo = 3, seriesId = 9),
            ),
            tasks = listOf(
                task(1, title = "Draft the FAQ", meetingId = 1),
                task(2, title = "Send the deck", due = today + 2, meetingId = 2),
                owed(3, "Marcus Lee", title = "Share forecast", due = today - 1, meetingId = 2),
                task(4, title = "Added by hand to the unsummarized one", due = today + 9, meetingId = 3),
                task(5, title = "Finished", status = TaskStatus.DONE, meetingId = 2),
                task(6, title = "Thrown out", status = TaskStatus.DISMISSED, meetingId = 2),
                task(7, title = "Nobody's yet", ownership = Ownership.UNCLEAR, meetingId = 2),
                task(8, title = "From another meeting", meetingId = 4),
                task(9, title = "From no meeting"),
            ),
        )

        assertEquals(listOf(3L, 2L, 4L, 1L), brief.carriedOver.ids())
        assertTrue(brief.hasHistory)
    }

    @Test
    fun `what the people invited owe the user is listed wherever it came from`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield", "Marcus Lee"),
            entries = listOf(person(1, "Dana Whitfield"), person(2, "Marcus Lee"), person(3, "Priya Nair")),
            meetings = listOf(held(1, title = "Pricing review", daysAgo = 5)),
            tasks = listOf(
                owed(1, "Dana Whitfield", meetingId = 1),
                owed(2, "Marcus", due = today + 1),
                owed(3, "dana", due = today - 3),
                owed(4, "Priya Nair"),
                owed(5, ""),
                owed(6, "Dana Whitfield").copy(status = TaskStatus.DONE),
                task(7, title = "Whose is this", ownership = Ownership.UNCLEAR, owner = "Dana Whitfield"),
            ),
        )

        assertEquals(listOf(3L, 2L, 1L), brief.theyOwe.ids())
        assertTrue(brief.carriedOver.isEmpty())
        assertTrue(brief.hasHistory)
    }

    @Test
    fun `the user's own open tasks that name someone invited are listed`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            entries = listOf(person(1, "Dana Whitfield"), person(2, "Marcus Lee")),
            tasks = listOf(
                task(1, title = "Send Dana the forecast", due = today + 3),
                task(2, title = "Send the forecast", details = "Dana Whitfield needs it for the board pack"),
                task(3, title = "Send Marcus the forecast"),
                task(4, title = "Tidy the backlog"),
                task(5, title = "Thank Dana", status = TaskStatus.DONE),
                task(6, title = "Ask Dan about the feed"),
            ),
        )

        assertEquals(listOf(1L, 2L), brief.openWithThem.ids())
        assertTrue(brief.theyOwe.isEmpty())
        assertTrue(brief.hasHistory)
    }

    @Test
    fun `a task carried over from last time is not listed a second time under the person`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            series = listOf(standup),
            meetings = listOf(held(1, daysAgo = 7, seriesId = 5)),
            tasks = listOf(
                owed(1, "Dana Whitfield", title = "Send contract", meetingId = 1),
                task(2, title = "Send Dana the forecast", meetingId = 1),
                owed(3, "Dana Whitfield", title = "Share the rate table"),
            ),
        )

        assertEquals(setOf(1L, 2L), brief.carriedOver.ids().toSet())
        assertEquals(listOf(3L), brief.theyOwe.ids())
        assertTrue(brief.openWithThem.isEmpty())
    }

    @Test
    fun `two people who share a first name are not credited with each other's tasks`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Chris Evans"),
            entries = listOf(person(1, "Chris Evans"), person(2, "Chris Park")),
            tasks = listOf(
                owed(1, "Chris Evans"),
                owed(2, "Chris Park"),
                owed(3, "Chris"),
                task(4, title = "Send Chris the contract"),
                task(5, title = "Send Chris Evans the contract"),
            ),
        )

        assertEquals(listOf(1L), brief.theyOwe.ids())
        assertEquals(listOf(5L), brief.openWithThem.ids())
    }

    @Test
    fun `Dan's tasks are not shown before a meeting with Dana`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            tasks = listOf(owed(1, "Dan"), owed(2, "Dan Brown"), task(3, title = "Ask Dan about the feed")),
        )
        assertTrue(brief.theyOwe.isEmpty())
        assertTrue(brief.openWithThem.isEmpty())
        assertFalse(brief.hasHistory)
    }

    // -------------------------------------------------------------------------------------------
    // The reminder's text

    @Test
    fun `the reminder leads with last time, then what the user owes, then what is owed to them`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            series = listOf(standup),
            meetings = listOf(held(1, daysAgo = 7, seriesId = 5, tldr = "Rate feed is two weeks late.")),
            tasks = listOf(
                task(1, title = "Send the deck", due = today - 1, meetingId = 1),
                task(2, title = "Send Dana the forecast"),
                owed(3, "Marcus Lee", title = "Share forecast", meetingId = 1),
                owed(4, "Dana Whitfield", title = "Send contract", due = today + 1),
                owed(5, "Dana Whitfield", title = "Review the FAQ"),
            ),
        )

        assertEquals(
            "Last time (Wed 11 Nov): Rate feed is two weeks late. You still owe: Send the deck and 1 more. Owed to you: Share forecast and 2 more.",
            brief.summary(zone),
        )
    }

    @Test
    fun `one thing owed is named without a count`() {
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            tasks = listOf(task(1, title = "Send Dana the forecast"), owed(2, "Dana Whitfield", title = "Send contract")),
        )
        assertEquals("You still owe: Send Dana the forecast. Owed to you: Send contract.", brief.summary(zone))
    }

    @Test
    fun `with only one side owing the reminder says just that`() {
        assertEquals(
            "Owed to you: Send contract.",
            brief(tasks = listOf(owed(1, "Dana Whitfield", title = "Send contract"))).summary(zone),
        )
        assertEquals(
            "You still owe: Send Dana the forecast.",
            brief(tasks = listOf(task(1, title = "Send Dana the forecast"))).summary(zone),
        )
    }

    @Test
    fun `last time alone is enough for a reminder`() {
        val brief = brief(series = listOf(standup), meetings = listOf(held(1, daysAgo = 7, seriesId = 5, tldr = "Rate feed is two weeks late.")))
        assertTrue(brief.hasHistory)
        assertEquals("Last time (Wed 11 Nov): Rate feed is two weeks late.", brief.summary(zone))
    }

    @Test
    fun `last time is dated in the phone's time zone`() {
        // Half past eleven at night on Tuesday in New York is already Wednesday in UTC.
        val lateTuesday = held(1, daysAgo = 8, seriesId = 5, tldr = "Short one.").copy(startedAt = Fixed.at(today - 8, 23, 30))
        val brief = brief(series = listOf(standup), meetings = listOf(lateTuesday))
        assertEquals("Last time (Tue 10 Nov): Short one.", brief.summary(zone))
    }

    @Test
    fun `last time without a summary falls back to the meeting's name`() {
        val unsummarized = held(1, title = "Quoting standup", daysAgo = 7, seriesId = 5, tldr = "   ")
        val text = brief(series = listOf(standup), meetings = listOf(unsummarized)).summary(zone)
        assertTrue(text, text.startsWith("Last time (Wed 11 Nov): Quoting standup"))
    }

    @Test
    fun `a long summary and long task titles are cut to fit a notification`() {
        val longTldr = "The team went through the rate feed delays in detail. ".repeat(10).trim()
        val longTitle = "Send the fully revised enterprise pricing deck with every appendix to Marcus and Priya before the board meeting"
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            series = listOf(standup),
            meetings = listOf(held(1, daysAgo = 7, seriesId = 5, tldr = longTldr)),
            tasks = listOf(task(1, title = longTitle, meetingId = 1)),
        )

        val text = brief.summary(zone)
        val lastTime = text.substringAfter("Last time (Wed 11 Nov): ").substringBefore(" You still owe: ")
        val owed = text.substringAfter(" You still owe: ")
        assertTrue(lastTime, lastTime.length <= 161 && lastTime.endsWith("…"))
        assertTrue(longTldr.startsWith(lastTime.dropLast(1)))
        assertTrue(owed, owed.length <= 62 && owed.endsWith("…."))
        assertTrue(longTitle.startsWith(owed.dropLast(2)))
    }

    @Test
    fun `a task both carried over and counted for a person is counted once`() {
        // The same task can't be in two lists, but the count in the text is what the user reads.
        val brief = brief(
            attendees = listOf("Sam Rivera", "Dana Whitfield"),
            series = listOf(standup),
            meetings = listOf(held(1, daysAgo = 7, seriesId = 5, tldr = "Short one.")),
            tasks = listOf(owed(1, "Dana Whitfield", title = "Send contract", meetingId = 1)),
        )
        assertEquals("Last time (Wed 11 Nov): Short one. Owed to you: Send contract.", brief.summary(zone))
    }
}
