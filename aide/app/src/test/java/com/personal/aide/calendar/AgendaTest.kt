package com.personal.aide.calendar

import android.Manifest
import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.database.MatrixCursor
import android.net.Uri
import android.provider.CalendarContract
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.ContextBlocks
import com.personal.aide.domain.Days
import com.personal.aide.testing.Fixed
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.Robolectric
import org.robolectric.Shadows.shadowOf
import org.robolectric.annotation.Config
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId
import java.time.ZoneOffset
import java.util.Locale
import java.util.TimeZone

/** The phone's calendar, played by a provider that answers the two queries [DeviceAgenda] makes. */
class FakeCalendarProvider : ContentProvider() {
    data class Instance(
        val eventId: Long,
        val title: String?,
        val begin: Long,
        val end: Long,
        val allDay: Boolean = false,
        val location: String? = null,
        val selfStatus: Int = CalendarContract.Attendees.ATTENDEE_STATUS_ACCEPTED,
    )

    companion object {
        val instances = ArrayList<Instance>()
        val attendees = HashMap<Long, List<Pair<String?, String?>>>()
        var instanceQueries = 0
        var broken = false

        fun reset() {
            instances.clear()
            attendees.clear()
            instanceQueries = 0
            broken = false
        }
    }

    override fun onCreate(): Boolean = true

    override fun query(uri: Uri, projection: Array<String>?, selection: String?, selectionArgs: Array<String>?, sortOrder: String?): Cursor {
        if (broken) throw IllegalStateException("the calendar provider crashed")
        val segments = uri.pathSegments
        val cursor = MatrixCursor(projection!!)
        if (segments.firstOrNull() == "instances") {
            instanceQueries++
            val from = segments[segments.size - 2].toLong()
            val to = segments.last().toLong()
            // Like the real provider: every instance that overlaps the stretch asked for, earliest first.
            instances.filter { it.begin < to && it.end > from }.sortedBy { it.begin }.forEach {
                cursor.addRow(arrayOf<Any?>(it.eventId, it.title, it.begin, it.end, if (it.allDay) 1 else 0, it.location, it.selfStatus))
            }
        } else {
            val eventId = selectionArgs!!.single().toLong()
            attendees[eventId].orEmpty().forEach { cursor.addRow(arrayOf<Any?>(it.first, it.second)) }
        }
        return cursor
    }

    override fun getType(uri: Uri): String? = null
    override fun insert(uri: Uri, values: ContentValues?): Uri? = null
    override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int = 0
    override fun update(uri: Uri, values: ContentValues?, selection: String?, selectionArgs: Array<String>?): Int = 0
}

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class AgendaTest {
    private val context: Context = ApplicationProvider.getApplicationContext()
    private var enabled = true
    private val agenda = DeviceAgenda(context) { enabled }
    private val today = Fixed.today
    private lateinit var zoneBefore: TimeZone
    private lateinit var localeBefore: Locale

    @Before
    fun setUp() {
        // The phone is in New York.
        zoneBefore = TimeZone.getDefault()
        TimeZone.setDefault(TimeZone.getTimeZone(Fixed.zone))
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
        FakeCalendarProvider.reset()
        Robolectric.buildContentProvider(FakeCalendarProvider::class.java).create(CalendarContract.AUTHORITY)
        shadowOf(context as Application).grantPermissions(Manifest.permission.READ_CALENDAR)
    }

    @After
    fun tearDown() {
        TimeZone.setDefault(zoneBefore)
        Locale.setDefault(localeBefore)
        FakeCalendarProvider.reset()
    }

    private fun at(day: Long, hour: Int, minute: Int = 0) = Fixed.at(day, hour, minute)

    /** Midnight UTC at the start of [day], which is how the phone's calendar stores all-day events. */
    private fun utcMidnight(day: Long): Long = LocalDate.ofEpochDay(day).atStartOfDay(ZoneOffset.UTC).toInstant().toEpochMilli()

    private fun eventsOn(day: Long, zone: ZoneId = Fixed.zone): List<CalendarEvent> = runBlocking {
        agenda.events(Days.startMillis(day, zone), Days.startMillis(day + 1, zone))
    }

    private fun add(
        id: Long,
        title: String?,
        start: Long,
        end: Long = start + 30 * 60_000,
        status: Int = CalendarContract.Attendees.ATTENDEE_STATUS_ACCEPTED,
        location: String? = null,
    ) {
        FakeCalendarProvider.instances += FakeCalendarProvider.Instance(id, title, start, end, location = location, selfStatus = status)
    }

    private fun addAllDay(id: Long, title: String, day: Long) {
        FakeCalendarProvider.instances += FakeCalendarProvider.Instance(id, title, utcMidnight(day), utcMidnight(day + 1), allDay = true)
    }

    // -------------------------------------------------------------------------------------------

    @Test
    fun `no agenda has no events`(): Unit = runBlocking {
        assertTrue(NoAgenda.events(0, Long.MAX_VALUE).isEmpty())
    }

    @Test
    fun `nothing is read while the calendar is switched off`() {
        add(1, "Roadmap sync", at(today, 9))
        enabled = false

        assertTrue(eventsOn(today).isEmpty())
        assertEquals("the calendar must not even be asked", 0, FakeCalendarProvider.instanceQueries)
    }

    @Test
    fun `nothing is read without the permission`() {
        add(1, "Roadmap sync", at(today, 9))
        shadowOf(context as Application).denyPermissions(Manifest.permission.READ_CALENDAR)

        assertFalse(agenda.hasPermission())
        assertTrue(eventsOn(today).isEmpty())
        assertEquals(0, FakeCalendarProvider.instanceQueries)
    }

    @Test
    fun `the day's events come back earliest first with their details`() {
        add(2, "Quoting standup", at(today, 14), at(today, 14, 15))
        add(1, "  Roadmap sync ", at(today, 9, 30), at(today, 10), location = " Room 4 ")
        add(3, "Tomorrow's thing", at(today + 1, 9))
        add(4, "Yesterday's thing", at(today - 1, 9))

        assertTrue(agenda.hasPermission())
        assertEquals(
            listOf(
                CalendarEvent(1, "Roadmap sync", at(today, 9, 30), at(today, 10), location = "Room 4"),
                CalendarEvent(2, "Quoting standup", at(today, 14), at(today, 14, 15)),
            ),
            eventsOn(today),
        )
    }

    @Test
    fun `invitations the user declined and events with no title are left out`() {
        add(1, "Declined", at(today, 9), status = CalendarContract.Attendees.ATTENDEE_STATUS_DECLINED)
        add(2, "Tentative", at(today, 10), status = CalendarContract.Attendees.ATTENDEE_STATUS_TENTATIVE)
        add(3, "Not answered", at(today, 11), status = CalendarContract.Attendees.ATTENDEE_STATUS_INVITED)
        add(4, null, at(today, 12))
        add(5, "   ", at(today, 13))

        assertEquals(listOf("Tentative", "Not answered"), eventsOn(today).map { it.title })
    }

    @Test
    fun `people are named, rooms are not, and nobody is listed twice`() {
        add(1, "Roadmap sync", at(today, 9))
        FakeCalendarProvider.attendees[1] = listOf(
            "Dana Whitfield" to "dana@northwind.example",
            null to "marcus.lee@northwind.example",
            "  " to "priya@northwind.example",
            "Room 4" to "c_188abc@resource.calendar.google.com",
            "Dana Whitfield" to "dana.whitfield@personal.example",
            null to null,
        )

        assertEquals(listOf("Dana Whitfield", "marcus lee", "priya"), eventsOn(today).single().attendees)
    }

    @Test
    fun `a very large invitation list is cut short`() {
        add(1, "All hands", at(today, 9))
        FakeCalendarProvider.attendees[1] = (1..60).map { "Person $it" to "p$it@northwind.example" }

        val names = eventsOn(today).single().attendees
        assertEquals(25, names.size)
        assertEquals("Person 1", names.first())
    }

    @Test
    fun `an event the calendar lists twice appears once, but a repeating event keeps each of its days`() {
        add(1, "Roadmap sync", at(today, 9))
        add(1, "Roadmap sync", at(today, 9))
        add(2, "Daily standup", at(today, 10))
        add(2, "Daily standup", at(today + 1, 10))

        val twoDays = runBlocking { agenda.events(Days.startMillis(today, Fixed.zone), Days.startMillis(today + 2, Fixed.zone)) }
        assertEquals(listOf("Roadmap sync", "Daily standup", "Daily standup"), twoDays.map { it.title })
        assertEquals(listOf(at(today, 10), at(today + 1, 10)), twoDays.filter { it.id == 2L }.map { it.start })
    }

    @Test
    fun `a calendar that fails to answer reads as no events`() {
        add(1, "Roadmap sync", at(today, 9))
        FakeCalendarProvider.broken = true
        assertTrue(eventsOn(today).isEmpty())
    }

    @Test
    fun `a timed event keeps its exact time`() {
        val start = Instant.parse("2026-11-18T14:30:00Z").toEpochMilli()
        add(1, "Roadmap sync", start, start + 45 * 60_000)

        val event = eventsOn(today).single()
        assertEquals(start, event.start)
        assertEquals(start + 45 * 60_000, event.end)
        assertFalse(event.allDay)
        assertEquals("- Wednesday 9:30 AM–10:15 AM: Roadmap sync", ContextBlocks.calendar(listOf(event), Fixed.zone))
    }

    @Test
    fun `an all-day event belongs to its own day and no other`() {
        // The calendar stores an all-day event as midnight to midnight UTC, wherever the phone is.
        addAllDay(1, "Company holiday", today)
        addAllDay(2, "Offsite", today + 1)
        addAllDay(3, "Yesterday's all-dayer", today - 1)

        val events = eventsOn(today)

        assertEquals("only today's all-day event is on today", listOf("Company holiday"), events.map { it.title })
        assertTrue(events.single().allDay)
        assertEquals("and it is on today's date in the phone's own time zone", today, Days.ofMillis(events.single().start, Fixed.zone))
        assertEquals("- Wednesday all day: Company holiday", ContextBlocks.calendar(events, Fixed.zone))
    }

    @Test
    fun `an all-day event is on the right day east of Greenwich too`() {
        val tokyo = ZoneId.of("Asia/Tokyo")
        TimeZone.setDefault(TimeZone.getTimeZone(tokyo))
        addAllDay(1, "Company holiday", today)
        addAllDay(2, "Offsite", today + 1)
        addAllDay(3, "Yesterday's all-dayer", today - 1)

        val events = eventsOn(today, tokyo)

        assertEquals(listOf("Company holiday"), events.map { it.title })
        assertEquals(today, Days.ofMillis(events.single().start, tokyo))
    }
}
