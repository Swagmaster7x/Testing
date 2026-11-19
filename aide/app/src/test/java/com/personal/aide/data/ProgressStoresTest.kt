package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.WinEntity
import com.personal.aide.data.db.WinSource
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

/** Recurring meetings and the wins log: [SeriesStore], [WinStore] and the queries under them. */
@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class ProgressStoresTest {
    private lateinit var db: AppDatabase
    private lateinit var series: SeriesStore
    private lateinit var wins: WinStore
    private lateinit var meetings: MeetingStore
    private var now = Fixed.now
    private val today = Fixed.today

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        series = SeriesStore(db.series(), db.meetings()) { now }
        wins = WinStore(db.wins()) { now }
        meetings = MeetingStore(db.meetings()) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    private suspend fun meeting(id: Long): MeetingEntity = db.meetings().get(id)!!

    private suspend fun seriesOf(meetingId: Long): Long? = meeting(meetingId).seriesId

    private suspend fun allSeries(): List<SeriesEntity> = db.series().all()

    private suspend fun allWins(): List<WinEntity> = db.wins().all()

    /** A recording started from calendar event [eventId] (or from the Record button, with null) and stopped half an hour later. */
    private suspend fun recording(title: String?, eventId: Long?, daysAgo: Long = 0): Long {
        now = Fixed.at(today - daysAgo, 10)
        val id = meetings.startLive(title, calendarEventId = eventId)
        now += 30 * 60_000L
        meetings.finish(id)
        return id
    }

    /** A meeting with notes, held at ten in the morning [daysAgo] days ago. */
    private suspend fun held(title: String, daysAgo: Long, seriesId: Long? = null, status: MeetingStatus = MeetingStatus.READY): Long =
        db.meetings().insert(
            MeetingEntity(title = title, titleIsAuto = false, startedAt = Fixed.at(today - daysAgo, 10), endedAt = Fixed.at(today - daysAgo, 10, 30), status = status, seriesId = seriesId),
        )

    // -------------------------------------------------------------------------------------------
    // Finding and creating a series

    @Test
    fun `a new series is created with its name tidied and when it was made`(): Unit = runBlocking {
        val id = series.findOrCreate("  Quoting standup ")

        assertEquals(listOf(SeriesEntity(id = id!!, name = "Quoting standup", key = "quoting standup", calendarEventId = null, createdAt = now)), allSeries())
    }

    @Test
    fun `asking for a series that exists returns it however the name is typed`(): Unit = runBlocking {
        val id = series.findOrCreate("Quoting standup")
        now += 60_000

        assertEquals(id, series.findOrCreate("quoting  STANDUP!"))
        assertEquals(id, series.findOrCreate(" Quoting—standup "))
        val only = allSeries().single()
        assertEquals("the name it was given first stands", "Quoting standup", only.name)
        assertEquals(Fixed.now, only.createdAt)
    }

    @Test
    fun `differently named series are separate`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")
        val retro = series.findOrCreate("Quoting retro")

        assertNotEquals(standup, retro)
        assertEquals("listed by name", listOf("Quoting retro", "Quoting standup"), allSeries().map { it.name })
    }

    @Test
    fun `a blank name is no series`(): Unit = runBlocking {
        assertNull(series.findOrCreate(""))
        assertNull(series.findOrCreate("   "))
        assertNull("punctuation alone is no name", series.findOrCreate("— ?! —"))
        assertTrue(allSeries().isEmpty())
    }

    @Test
    fun `a series learns the calendar event it comes from once and keeps it`(): Unit = runBlocking {
        val id = series.findOrCreate("Quoting standup")!!
        assertNull(db.series().get(id)!!.calendarEventId)

        series.findOrCreate("quoting standup", calendarEventId = 77)
        assertEquals(77L, db.series().get(id)!!.calendarEventId)

        series.findOrCreate("Quoting standup", calendarEventId = 88)
        series.findOrCreate("Quoting standup")
        assertEquals("a later event of the same name does not take it over", 77L, db.series().get(id)!!.calendarEventId)
        assertEquals(1, allSeries().size)
    }

    @Test
    fun `a series made from a calendar event remembers the event`(): Unit = runBlocking {
        val id = series.findOrCreate("Quoting standup", calendarEventId = 77)!!
        assertEquals(77L, db.series().get(id)!!.calendarEventId)
        assertEquals(id, db.series().findByCalendarEvent(77)?.id)
        assertNull(db.series().findByCalendarEvent(78))
    }

    @Test
    fun `two series cannot be stored under the same name`(): Unit = runBlocking {
        db.series().insert(SeriesEntity(name = "Quoting standup", key = "quoting standup", createdAt = 1))
        val second = runCatching { db.series().insert(SeriesEntity(name = "QUOTING STANDUP", key = "quoting standup", createdAt = 2)) }

        assertTrue("the database itself refuses a second series with the same key", second.isFailure)
        assertEquals(1, allSeries().size)
    }

    // -------------------------------------------------------------------------------------------
    // Putting meetings in and taking them out

    @Test
    fun `a meeting can be put in a series and taken out again`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val a = held("Standup A", daysAgo = 7)
        val b = held("Standup B", daysAgo = 1)

        series.assign(a, standup)
        assertEquals(standup, seriesOf(a))
        assertNull("other meetings are not touched", seriesOf(b))

        series.assign(b, standup)
        series.assign(a, null)
        assertNull(seriesOf(a))
        assertEquals(standup, seriesOf(b))
        assertEquals("the rest of the meeting is as it was", "Standup A", meeting(a).title)
        assertEquals("taking the last meeting out does not delete the series", 1, allSeries().size)
    }

    @Test
    fun `a meeting moved to another series leaves the first`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val retro = series.findOrCreate("Quoting retro")!!
        val a = held("Standup A", daysAgo = 7, seriesId = standup)

        series.assign(a, retro)

        assertEquals(retro, seriesOf(a))
        assertTrue(db.meetings().inSeries(standup).isEmpty())
        assertEquals(listOf(a), db.meetings().inSeries(retro).map { it.id })
    }

    @Test
    fun `assigning by name creates the series the first time and reuses it after`(): Unit = runBlocking {
        val a = held("Priya / Sam", daysAgo = 14)
        val b = held("Catch-up", daysAgo = 7)

        val first = series.assignByName(a, " 1:1 with Priya ")
        val second = series.assignByName(b, "1:1 with priya")

        assertNotNull(first)
        assertEquals(first, second)
        assertEquals("1:1 with Priya", allSeries().single().name)
        assertEquals(first, seriesOf(a))
        assertEquals(first, seriesOf(b))
    }

    @Test
    fun `assigning by a blank name changes nothing`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val a = held("Standup A", daysAgo = 7, seriesId = standup)

        assertNull(series.assignByName(a, "   "))

        assertEquals(standup, seriesOf(a))
        assertEquals(1, allSeries().size)
    }

    @Test
    fun `the meetings of a series come newest first`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val old = held("Standup", daysAgo = 14, seriesId = standup)
        val newest = held("Standup", daysAgo = 1, seriesId = standup)
        val middle = held("Standup", daysAgo = 7, seriesId = standup)
        held("Hiring sync", daysAgo = 3)

        assertEquals(listOf(newest, middle, old), db.meetings().inSeries(standup).map { it.id })
    }

    // -------------------------------------------------------------------------------------------
    // Recordings of the same calendar event

    @Test
    fun `the first recording of a calendar event is just a meeting`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77)

        series.linkByCalendar(first)

        assertNull(seriesOf(first))
        assertTrue("once is a meeting, not a habit", allSeries().isEmpty())
    }

    @Test
    fun `the second recording of the same event makes a series named after it and pulls the first in`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 7)
        series.linkByCalendar(first)
        val second = recording("Quoting standup", eventId = 77)

        series.linkByCalendar(second)

        val made = allSeries().single()
        assertEquals("Quoting standup", made.name)
        assertEquals("quoting standup", made.key)
        assertEquals(77L, made.calendarEventId)
        assertEquals(now, made.createdAt)
        assertEquals(made.id, seriesOf(first))
        assertEquals(made.id, seriesOf(second))
    }

    @Test
    fun `later recordings join the series the event already has`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 14)
        series.linkByCalendar(first)
        val second = recording("Quoting standup", eventId = 77, daysAgo = 7)
        series.linkByCalendar(second)
        // The calendar entry was renamed since; it is still the same repeating event.
        val third = recording("Standup (new time)", eventId = 77)

        series.linkByCalendar(third)

        val only = allSeries().single()
        assertEquals("Quoting standup", only.name)
        assertEquals(listOf(third, second, first), db.meetings().inSeries(only.id).map { it.id })
    }

    @Test
    fun `earlier recordings that were never linked are all pulled in`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 14)
        val second = recording("Quoting standup", eventId = 77, daysAgo = 7)
        val third = recording("Quoting standup", eventId = 77)

        series.linkByCalendar(third)

        val only = allSeries().single()
        assertEquals(setOf(first, second, third), db.meetings().inSeries(only.id).map { it.id }.toSet())
    }

    @Test
    fun `a meeting already in a series is left where it is`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 7)
        val second = recording("Quoting standup", eventId = 77)
        // The user filed this one themselves before the recording was saved.
        val chosen = series.assignByName(second, "Launch war room")!!

        series.linkByCalendar(second)

        assertEquals(chosen, seriesOf(second))
        assertNull("and the earlier recording is not dragged anywhere on its account", seriesOf(first))
        assertEquals(listOf("Launch war room"), allSeries().map { it.name })
    }

    @Test
    fun `a meeting the user filed elsewhere is not moved into the event's series`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 14)
        val second = recording("Quoting standup", eventId = 77, daysAgo = 7)
        series.linkByCalendar(second)
        val standup = allSeries().single().id
        val third = recording("Quoting standup", eventId = 77)
        val chosen = series.assignByName(third, "Launch war room")!!

        series.linkByCalendar(third)

        assertEquals(chosen, seriesOf(third))
        assertEquals(setOf(first, second), db.meetings().inSeries(standup).map { it.id }.toSet())
    }

    @Test
    fun `if the first recording was already filed in a series the second joins that one`(): Unit = runBlocking {
        val first = recording("Dana / Sam", eventId = 77, daysAgo = 7)
        val filed = series.assignByName(first, "1:1 with Dana")!!
        val second = recording("Dana / Sam", eventId = 77)

        series.linkByCalendar(second)

        assertEquals(filed, seriesOf(second))
        assertEquals(filed, seriesOf(first))
        assertEquals("no second series for the same meeting", listOf("1:1 with Dana"), allSeries().map { it.name })
    }

    @Test
    fun `a series the user already keeps under the event's name is joined rather than duplicated`(): Unit = runBlocking {
        val existing = series.findOrCreate("Quoting standup")!!
        val pasted = held("Standup notes I pasted in", daysAgo = 21, seriesId = existing)
        val first = recording("Quoting standup", eventId = 77, daysAgo = 7)
        val second = recording("quoting standup", eventId = 77)

        series.linkByCalendar(second)

        val only = allSeries().single()
        assertEquals(existing, only.id)
        assertEquals("the series now knows its calendar event", 77L, only.calendarEventId)
        assertEquals(setOf(pasted, first, second), db.meetings().inSeries(existing).map { it.id }.toSet())
    }

    @Test
    fun `the series takes the name the calendar gave the earliest recording`(): Unit = runBlocking {
        recording("Quoting standup", eventId = 77, daysAgo = 14)
        recording("Quoting standup (moved)", eventId = 77, daysAgo = 7)
        val third = recording("Standup + retro special", eventId = 77)

        series.linkByCalendar(third)

        assertEquals("Quoting standup", allSeries().single().name)
    }

    @Test
    fun `when an earlier recording has only a placeholder name the series is not named after the placeholder`(): Unit = runBlocking {
        val first = recording(null, eventId = 77, daysAgo = 7)
        assertTrue(meeting(first).titleIsAuto)
        val second = recording("Quoting standup", eventId = 77)

        series.linkByCalendar(second)

        assertEquals("Quoting standup", allSeries().single().name)
        assertEquals(allSeries().single().id, seriesOf(first))
    }

    @Test
    fun `recordings of different events are not linked to each other`(): Unit = runBlocking {
        val standup = recording("Quoting standup", eventId = 77, daysAgo = 1)
        val review = recording("Quoting standup", eventId = 78)

        series.linkByCalendar(standup)
        series.linkByCalendar(review)

        assertTrue(allSeries().isEmpty())
        assertNull(seriesOf(standup))
        assertNull(seriesOf(review))
    }

    @Test
    fun `a recording not started from the calendar is never linked`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = null, daysAgo = 7)
        val second = recording("Quoting standup", eventId = null)

        series.linkByCalendar(first)
        series.linkByCalendar(second)

        assertTrue(allSeries().isEmpty())
        assertNull(seriesOf(second))
    }

    @Test
    fun `linking the same recording again changes nothing`(): Unit = runBlocking {
        val first = recording("Quoting standup", eventId = 77, daysAgo = 7)
        val second = recording("Quoting standup", eventId = 77)
        series.linkByCalendar(second)
        val before = allSeries() to db.meetings().all()

        series.linkByCalendar(second)
        series.linkByCalendar(first)

        assertEquals(before, allSeries() to db.meetings().all())
    }

    @Test
    fun `linking a meeting that has gone does nothing`(): Unit = runBlocking {
        series.linkByCalendar(404)
        assertTrue(allSeries().isEmpty())
    }

    @Test
    fun `meetings from one calendar event come newest first`(): Unit = runBlocking {
        val old = recording("Quoting standup", eventId = 77, daysAgo = 14)
        val newest = recording("Quoting standup", eventId = 77, daysAgo = 0)
        val middle = recording("Quoting standup", eventId = 77, daysAgo = 7)
        recording("Hiring sync", eventId = 78, daysAgo = 3)
        recording("Not from the calendar", eventId = null, daysAgo = 2)

        assertEquals(listOf(newest, middle, old), db.meetings().forCalendarEvent(77).map { it.id })
        assertTrue(db.meetings().forCalendarEvent(79).isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Renaming and forgetting a series

    @Test
    fun `renaming changes the name and how the series is found`(): Unit = runBlocking {
        val id = series.findOrCreate("Quoting standup", calendarEventId = 77)!!
        val a = held("Standup", daysAgo = 7, seriesId = id)
        now += 60_000

        series.rename(id, "  Quoting sync ")

        assertEquals(listOf(SeriesEntity(id = id, name = "Quoting sync", key = "quoting sync", calendarEventId = 77, createdAt = Fixed.now)), allSeries())
        assertEquals(id, seriesOf(a))
        assertEquals(id, series.findOrCreate("quoting sync"))
        assertNotEquals("the old name is free for a new series", id, series.findOrCreate("Quoting standup"))
    }

    @Test
    fun `a blank name is not a rename`(): Unit = runBlocking {
        val id = series.findOrCreate("Quoting standup")!!

        series.rename(id, "   ")
        series.rename(id, "?!")

        assertEquals("Quoting standup", db.series().get(id)!!.name)
    }

    @Test
    fun `changing only the capitals or punctuation of a name is a plain rename`(): Unit = runBlocking {
        val id = series.findOrCreate("quoting standup")!!
        val a = held("Standup", daysAgo = 7, seriesId = id)

        // Folded for matching, the new name is the one it already has: that must not read as a clash with itself.
        series.rename(id, "Quoting Standup!")

        assertEquals("Quoting Standup!", allSeries().single().name)
        assertEquals("quoting standup", allSeries().single().key)
        assertEquals(id, allSeries().single().id)
        assertEquals(id, seriesOf(a))
    }

    @Test
    fun `renaming a series to another's name folds it into that one`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val sync = series.findOrCreate("Weekly quoting sync")!!
        val other = series.findOrCreate("Hiring sync")!!
        val a = held("Standup", daysAgo = 14, seriesId = standup)
        val b = held("Standup", daysAgo = 7, seriesId = standup)
        val c = held("Sync", daysAgo = 3, seriesId = sync)
        val d = held("Hiring", daysAgo = 2, seriesId = other)

        series.rename(standup, " weekly QUOTING sync ")

        assertNull("the renamed series is gone", db.series().get(standup))
        assertEquals("the one it was folded into keeps its own spelling", "Weekly quoting sync", db.series().get(sync)!!.name)
        assertEquals(listOf("Hiring sync", "Weekly quoting sync"), allSeries().map { it.name })
        assertEquals(setOf(a, b, c), db.meetings().inSeries(sync).map { it.id }.toSet())
        assertEquals("a series that wasn't involved keeps its meetings", listOf(d), db.meetings().inSeries(other).map { it.id })
    }

    @Test
    fun `no meeting is left pointing at a series that was folded away`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val sync = series.findOrCreate("Weekly quoting sync")!!
        held("Standup", daysAgo = 14, seriesId = standup)
        held("Standup", daysAgo = 7, seriesId = standup)

        series.rename(standup, "Weekly quoting sync")

        val known = allSeries().map { it.id }.toSet()
        assertEquals(setOf(sync), known)
        assertTrue(db.meetings().all().all { it.seriesId in known })
    }

    @Test
    fun `renaming a series that has gone does nothing`(): Unit = runBlocking {
        val sync = series.findOrCreate("Weekly quoting sync")!!

        series.rename(404, "Weekly quoting sync")
        series.rename(404, "Something new")

        assertEquals(listOf(sync), allSeries().map { it.id })
    }

    @Test
    fun `forgetting a series keeps its meetings, on their own`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val other = series.findOrCreate("Hiring sync")!!
        val a = held("Standup", daysAgo = 14, seriesId = standup)
        val b = held("Standup", daysAgo = 7, seriesId = standup)
        val c = held("Hiring", daysAgo = 2, seriesId = other)

        series.delete(standup)

        assertEquals(listOf("Hiring sync"), allSeries().map { it.name })
        assertEquals(3, db.meetings().all().size)
        assertNull(seriesOf(a))
        assertNull(seriesOf(b))
        assertEquals(other, seriesOf(c))
    }

    @Test
    fun `forgetting a series that has gone does nothing`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val a = held("Standup", daysAgo = 7, seriesId = standup)

        series.delete(404)

        assertEquals(1, allSeries().size)
        assertEquals(standup, seriesOf(a))
    }

    @Test
    fun `deleting a meeting leaves its series and the others in it`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val a = held("Standup", daysAgo = 14, seriesId = standup)
        val b = held("Standup", daysAgo = 7, seriesId = standup)

        meetings.delete(a)

        assertEquals(1, allSeries().size)
        assertEquals(listOf(b), db.meetings().inSeries(standup).map { it.id })
    }

    // -------------------------------------------------------------------------------------------
    // What came before

    @Test
    fun `the previous meeting is the latest earlier one in the series that has notes`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        held("Standup", daysAgo = 21, seriesId = standup)
        val lastWithNotes = held("Standup", daysAgo = 14, seriesId = standup)
        held("Standup, never summarized", daysAgo = 10, seriesId = standup, status = MeetingStatus.TRANSCRIBED)
        held("Standup, summary failed", daysAgo = 8, seriesId = standup, status = MeetingStatus.FAILED)
        val current = held("Standup", daysAgo = 7, seriesId = standup)
        held("Standup", daysAgo = 1, seriesId = standup)

        assertEquals(lastWithNotes, series.previous(meeting(current))?.id)
    }

    @Test
    fun `the first of a series and a meeting outside any series have no previous`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val first = held("Standup", daysAgo = 14, seriesId = standup)
        held("Standup", daysAgo = 7, seriesId = standup)
        val loose = held("Standup", daysAgo = 1)

        assertNull(series.previous(meeting(first)))
        assertNull(series.previous(meeting(loose)))
    }

    @Test
    fun `meetings of another series are never the previous one`(): Unit = runBlocking {
        val standup = series.findOrCreate("Quoting standup")!!
        val other = series.findOrCreate("Hiring sync")!!
        held("Hiring", daysAgo = 3, seriesId = other)
        val current = held("Standup", daysAgo = 1, seriesId = standup)

        assertNull(series.previous(meeting(current)))
    }

    // -------------------------------------------------------------------------------------------
    // Logging a win

    @Test
    fun `a win is logged tidied, with where it came from`(): Unit = runBlocking {
        val id = wins.add(
            title = "  Got Sales and Product to agree on three tiers ",
            day = today - 2,
            detail = " Unblocked the Q1 launch. \n",
            goal = " Launch self-serve quoting ",
            source = WinSource.ASSISTANT,
            taskId = 3,
            meetingId = 5,
        )

        assertEquals(
            listOf(
                WinEntity(
                    id = id!!,
                    title = "Got Sales and Product to agree on three tiers",
                    key = "got sales and product to agree on three tiers",
                    detail = "Unblocked the Q1 launch.",
                    goal = "Launch self-serve quoting",
                    day = today - 2,
                    source = WinSource.ASSISTANT,
                    taskId = 3,
                    meetingId = 5,
                    createdAt = now,
                ),
            ),
            allWins(),
        )
    }

    @Test
    fun `a win added with just a title is the user's own, filed under no goal`(): Unit = runBlocking {
        wins.add("Shipped the pricing page", today)

        val win = allWins().single()
        assertEquals(WinSource.MANUAL, win.source)
        assertEquals("", win.goal)
        assertEquals("", win.detail)
        assertNull(win.taskId)
        assertNull(win.meetingId)
    }

    @Test
    fun `the same wording is not logged twice`(): Unit = runBlocking {
        val first = wins.add("Shipped the pricing page", today - 3, detail = "First telling")

        assertNull(wins.add("Shipped the pricing page", today - 3))
        assertNull("however it is typed", wins.add("  shipped the PRICING page. ", today))
        assertNull("and whoever logs it", wins.add("Shipped the pricing page", today, source = WinSource.ASSISTANT, taskId = 9))

        val only = allWins().single()
        assertEquals(first, only.id)
        assertEquals("the first telling stands", "First telling", only.detail)
        assertEquals(today - 3, only.day)
    }

    @Test
    fun `the same finished task is one win however it is worded the second time`(): Unit = runBlocking {
        val first = wins.add("Shipped the pricing page", today - 1, source = WinSource.ASSISTANT, taskId = 7)

        assertNull(wins.add("Launched the new pricing page on schedule", today, source = WinSource.ASSISTANT, taskId = 7))

        assertEquals(listOf(first), allWins().map { it.id })
        assertEquals("Shipped the pricing page", allWins().single().title)
    }

    @Test
    fun `different tasks, and several wins from one meeting, are separate wins`(): Unit = runBlocking {
        assertNotNull(wins.add("Shipped the pricing page", today, taskId = 7, meetingId = 5))
        assertNotNull(wins.add("Closed the Acme renewal", today, taskId = 8, meetingId = 5))
        assertNotNull(wins.add("Got legal to sign off early", today, meetingId = 5))

        assertEquals(3, allWins().size)
    }

    @Test
    fun `wins that come from no task are not taken for one another`(): Unit = runBlocking {
        assertNotNull(wins.add("Shipped the pricing page", today))
        assertNotNull(wins.add("Closed the Acme renewal", today))
        assertNotNull(wins.add("Hired a designer", today, source = WinSource.ASSISTANT))

        assertEquals(3, allWins().size)
    }

    @Test
    fun `a win with no title is not logged`(): Unit = runBlocking {
        assertNull(wins.add("", today))
        assertNull(wins.add("   ", today, detail = "Something happened", taskId = 3))
        assertNull(wins.add("…", today))
        assertTrue(allWins().isEmpty())
    }

    @Test
    fun `the log reads newest day first, and latest entry first within a day`(): Unit = runBlocking {
        val older = wins.add("Older", today - 9)
        val firstToday = wins.add("First today", today)
        val middle = wins.add("Middle", today - 3)
        val secondToday = wins.add("Second today", today)

        assertEquals(listOf(secondToday, firstToday, middle, older), allWins().map { it.id })
    }

    // -------------------------------------------------------------------------------------------
    // Editing the log

    @Test
    fun `saving a new win adds it, stamped with now`(): Unit = runBlocking {
        wins.save(WinEntity(title = "  Closed the Acme renewal ", key = "", detail = " Worth 40k. ", goal = " Grow revenue ", day = today - 1, createdAt = 0))

        val saved = allWins().single()
        assertEquals("Closed the Acme renewal", saved.title)
        assertEquals("closed the acme renewal", saved.key)
        assertEquals("Worth 40k.", saved.detail)
        assertEquals("Grow revenue", saved.goal)
        assertEquals(today - 1, saved.day)
        assertEquals(WinSource.MANUAL, saved.source)
        assertEquals(now, saved.createdAt)
    }

    @Test
    fun `saving an existing win changes it in place and files it under its new wording`(): Unit = runBlocking {
        val id = wins.add("Shipped the pricing page", today - 3, source = WinSource.ASSISTANT, taskId = 7, meetingId = 5)!!
        val other = wins.add("Closed the Acme renewal", today - 2)
        val logged = db.wins().get(id)!!
        now += 3_600_000

        wins.save(logged.copy(title = " Launched the pricing page two days early ", detail = " Ahead of the board meeting ", goal = "Launch self-serve quoting", day = today - 4))

        assertEquals(2, allWins().size)
        val saved = db.wins().get(id)!!
        assertEquals("Launched the pricing page two days early", saved.title)
        assertEquals("launched the pricing page two days early", saved.key)
        assertEquals("Ahead of the board meeting", saved.detail)
        assertEquals("Launch self-serve quoting", saved.goal)
        assertEquals(today - 4, saved.day)
        assertEquals("where it came from is kept", logged.copy(title = saved.title, key = saved.key, detail = saved.detail, goal = saved.goal, day = saved.day), saved)
        assertEquals("Closed the Acme renewal", db.wins().get(other!!)!!.title)
    }

    @Test
    fun `after a rewording the log recognises the new wording`(): Unit = runBlocking {
        val id = wins.add("Shipped the pricing page", today)!!
        wins.save(db.wins().get(id)!!.copy(title = "Launched the pricing page"))

        assertNull(wins.add("launched the pricing page", today))
        assertEquals(1, allWins().size)
    }

    @Test
    fun `a win saved with a blank title is left as it was`(): Unit = runBlocking {
        val id = wins.add("Shipped the pricing page", today)!!
        val before = db.wins().get(id)!!

        wins.save(before.copy(title = "   ", detail = "Changed"))
        wins.save(WinEntity(title = "  ", key = "", day = today, createdAt = 0))

        assertEquals(listOf(before), allWins())
    }

    @Test
    fun `deleting a win removes only that one`(): Unit = runBlocking {
        val a = wins.add("Shipped the pricing page", today)!!
        val b = wins.add("Closed the Acme renewal", today)!!

        wins.delete(a)
        wins.delete(404)

        assertEquals(listOf(b), allWins().map { it.id })
    }

    @Test
    fun `a deleted win can be logged again`(): Unit = runBlocking {
        val a = wins.add("Shipped the pricing page", today, taskId = 7)!!
        wins.delete(a)

        assertNotNull(wins.add("Shipped the pricing page", today, taskId = 7))
    }

    // -------------------------------------------------------------------------------------------
    // Goals changing under the log

    private suspend fun goalsByTitle(): Map<String, String> = allWins().associate { it.title to it.goal }

    @Test
    fun `wins follow a goal that was reworded`(): Unit = runBlocking {
        wins.add("Shipped the pricing page", today, goal = "Launch quoting")
        wins.add("Signed the first pilot", today, goal = "Launch quoting")
        wins.add("Hired a designer", today, goal = "Grow the team")
        wins.add("Fixed the build", today)

        wins.goalChanged("Launch quoting", "Launch self-serve quoting by end of Q1")

        assertEquals(
            mapOf(
                "Shipped the pricing page" to "Launch self-serve quoting by end of Q1",
                "Signed the first pilot" to "Launch self-serve quoting by end of Q1",
                "Hired a designer" to "Grow the team",
                "Fixed the build" to "",
            ),
            goalsByTitle(),
        )
    }

    @Test
    fun `wins under a goal that was removed become unfiled`(): Unit = runBlocking {
        wins.add("Shipped the pricing page", today, goal = "Launch quoting")
        wins.add("Hired a designer", today, goal = "Grow the team")

        wins.goalChanged("Launch quoting", "")

        assertEquals(mapOf("Shipped the pricing page" to "", "Hired a designer" to "Grow the team"), goalsByTitle())
        assertEquals("the wins themselves stay", 2, allWins().size)
    }

    @Test
    fun `a goal that did not change, or no goal at all, moves nothing`(): Unit = runBlocking {
        wins.add("Shipped the pricing page", today, goal = "Launch quoting")
        wins.add("Fixed the build", today)
        val before = allWins()

        wins.goalChanged("Launch quoting", "Launch quoting")
        // Adding a first goal must not sweep every unfiled win under it.
        wins.goalChanged("", "Grow the team")
        wins.goalChanged("   ", "Grow the team")

        assertEquals(before, allWins())
    }

    // -------------------------------------------------------------------------------------------
    // When a follow-up was last nudged

    @Test
    fun `a new task has never been nudged`(): Unit = runBlocking {
        val id = TaskStore(db.tasks()) { now }.add("Send contract", ownership = Ownership.OTHERS, owner = "Dana")!!
        assertEquals(0L, db.tasks().get(id)!!.nudgedAt)
    }

    @Test
    fun `marking follow-ups as nudged touches only those tasks`(): Unit = runBlocking {
        val a = db.tasks().insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana"))
        val b = db.tasks().insert(task(title = "Share forecast", ownership = Ownership.OTHERS, owner = "Marcus"))
        val c = db.tasks().insert(task(title = "Sign off budget", ownership = Ownership.OTHERS, owner = "Priya"))
        val before = listOf(a, b, c).associateWith { db.tasks().get(it)!! }

        db.tasks().markNudged(listOf(a, c, 404), now)

        assertEquals("nothing else about a nudged task changes", before.getValue(a).copy(nudgedAt = now), db.tasks().get(a))
        assertEquals(before.getValue(c).copy(nudgedAt = now), db.tasks().get(c))
        assertEquals(before.getValue(b), db.tasks().get(b))

        db.tasks().markNudged(emptyList(), now + 1)
        assertEquals(now, db.tasks().get(a)!!.nudgedAt)
    }

    @Test
    fun `a later nudge replaces the earlier time`(): Unit = runBlocking {
        val a = db.tasks().insert(task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Dana"))

        db.tasks().markNudged(listOf(a), now)
        db.tasks().markNudged(listOf(a), now + 7 * 86_400_000L)

        assertEquals(now + 7 * 86_400_000L, db.tasks().get(a)!!.nudgedAt)
    }

    @Test
    fun `editing a task keeps when it was last nudged`(): Unit = runBlocking {
        val store = TaskStore(db.tasks()) { now }
        val a = store.add("Send contract", ownership = Ownership.OTHERS, owner = "Dana")!!
        db.tasks().markNudged(listOf(a), now)

        store.edit(db.tasks().get(a)!!.copy(title = "Send the signed contract", dueDay = today + 2))
        store.planFor(a, today + 1)

        assertEquals("or it would be nudged again the next afternoon", now, db.tasks().get(a)!!.nudgedAt)
    }
}
