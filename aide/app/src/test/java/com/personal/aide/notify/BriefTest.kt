package com.personal.aide.notify

import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import java.time.Duration
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Locale

class BriefTest {
    private val zone = Fixed.zone
    private val today = Fixed.today
    private lateinit var localeBefore: Locale

    @Before
    fun useAKnownLocale() {
        // Times in the brief are written the way the phone writes them.
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
    }

    @After
    fun restoreLocale() {
        Locale.setDefault(localeBefore)
    }

    private fun event(id: Long, title: String, hour: Int, minute: Int = 0, allDay: Boolean = false) = CalendarEvent(
        id = id,
        title = title,
        start = Fixed.at(today, hour, minute),
        end = Fixed.at(today, hour, minute) + 30 * 60_000,
        allDay = allDay,
    )

    // -------------------------------------------------------------------------------------------
    // Composing

    @Test
    fun `nothing worth saying means no notification`() {
        assertNull(Brief.compose(emptyList(), emptyList(), 0, today, zone))
    }

    @Test
    fun `work that is not for today is not worth a notification`() {
        val tasks = listOf(
            task(1, due = today + 1),
            task(2),
            task(3, due = today, status = TaskStatus.DONE, completedAt = 1),
            task(4, due = today - 2, status = TaskStatus.DISMISSED),
            task(5, due = today, ownership = Ownership.OTHERS, owner = "Dana"),
        )
        assertNull(Brief.compose(tasks, emptyList(), 0, today, zone))
    }

    @Test
    fun `an all-day entry alone is not a meeting to announce`() {
        assertNull(Brief.compose(emptyList(), listOf(event(1, "Dana on holiday", 0, allDay = true)), 0, today, zone))
    }

    @Test
    fun `a full morning is summed up in the title and leads with the most urgent task`() {
        val tasks = listOf(
            task(1, title = "Send pricing deck", due = today, priority = 2),
            task(2, title = "Review carrier scorecards", planned = today),
            task(3, title = "Reply to legal", due = today - 2),
            task(4, title = "Book offsite venue", due = today + 3),
        )
        val events = listOf(
            event(1, "Company holiday", 0, allDay = true),
            event(2, "Roadmap sync", 9, 30),
            event(3, "Quoting standup", 14),
        )
        val brief = Brief.compose(tasks, events, 0, today, zone)!!

        assertEquals("2 to do today · 1 overdue · 2 meetings", brief.title)
        assertEquals("First up: Reply to legal. Next meeting: Roadmap sync at 9:30 AM.", brief.body)
    }

    @Test
    fun `one meeting is singular`() {
        val brief = Brief.compose(emptyList(), listOf(event(1, "Roadmap sync", 15)), 0, today, zone)!!
        assertEquals("1 meeting", brief.title)
        assertEquals("Next meeting: Roadmap sync at 3:00 PM.", brief.body)
    }

    @Test
    fun `only overdue work`() {
        val brief = Brief.compose(listOf(task(1, title = "A", due = today - 1), task(2, title = "B", due = today - 5)), emptyList(), 0, today, zone)!!
        assertEquals("2 overdue", brief.title)
        assertEquals("First up: B.", brief.body)
    }

    @Test
    fun `only work due today`() {
        val brief = Brief.compose(listOf(task(1, title = "Send pricing deck", due = today)), emptyList(), 0, today, zone)!!
        assertEquals("1 to do today", brief.title)
        assertEquals("First up: Send pricing deck.", brief.body)
    }

    @Test
    fun `meeting times are told in the user's time zone`() {
        val events = listOf(event(1, "Roadmap sync", 9, 30))
        assertTrue(Brief.compose(emptyList(), events, 0, today, zone)!!.body.contains("at 9:30 AM"))
        assertTrue(Brief.compose(emptyList(), events, 0, today, ZoneId.of("Europe/London"))!!.body.contains("at 2:30 PM"))
    }

    @Test
    fun `tasks nobody owns are mentioned`() {
        val one = Brief.compose(listOf(task(1, ownership = Ownership.UNCLEAR)), emptyList(), 0, today, zone)!!
        assertEquals("Your day", one.title)
        assertEquals("1 task needs an owner.", one.body)

        val two = Brief.compose(listOf(task(1, ownership = Ownership.UNCLEAR), task(2, ownership = Ownership.UNCLEAR)), emptyList(), 0, today, zone)!!
        assertEquals("2 tasks need an owner.", two.body)
    }

    @Test
    fun `waiting questions are mentioned`() {
        val one = Brief.compose(emptyList(), emptyList(), 1, today, zone)!!
        assertEquals("Your day", one.title)
        assertEquals("Aide has a question for you.", one.body)
        assertEquals("Aide has 3 questions for you.", Brief.compose(emptyList(), emptyList(), 3, today, zone)!!.body)
    }

    @Test
    fun `everything at once reads as one line`() {
        val tasks = listOf(task(1, title = "Send pricing deck", due = today), task(2, ownership = Ownership.UNCLEAR), task(3, ownership = Ownership.UNCLEAR))
        val brief = Brief.compose(tasks, listOf(event(1, "Roadmap sync", 9, 30)), 2, today, zone)!!
        assertEquals("1 to do today · 1 meeting", brief.title)
        assertEquals(
            "First up: Send pricing deck. Next meeting: Roadmap sync at 9:30 AM. 2 tasks need an owner. Aide has 2 questions for you.",
            brief.body,
        )
    }

    @Test
    fun `the body is never empty`() {
        val brief = Brief.compose(listOf(task(1, due = today)), emptyList(), 0, today, zone)
        assertNotNull(brief)
        assertTrue(brief!!.title.isNotBlank() && brief.body.isNotBlank())
    }

    // -------------------------------------------------------------------------------------------
    // When to send it

    private fun at(hour: Int, minute: Int, second: Int = 0) = LocalDateTime.of(2026, 11, 18, hour, minute, second)

    @Test
    fun `before the time today it fires today`() {
        assertEquals(Duration.ofHours(1), Brief.delayUntil(8 * 60, at(7, 0)))
        assertEquals(Duration.ofSeconds(1), Brief.delayUntil(8 * 60, at(7, 59, 59)))
        assertEquals(Duration.ofMinutes(8 * 60 + 30), Brief.delayUntil(8 * 60 + 30, at(0, 0)))
    }

    @Test
    fun `at or after the time it waits for tomorrow`() {
        assertEquals("exactly on time means the next one is a day away", Duration.ofHours(24), Brief.delayUntil(8 * 60, at(8, 0)))
        assertEquals(Duration.ofHours(24).minusSeconds(1), Brief.delayUntil(8 * 60, at(8, 0, 1)))
        assertEquals(Duration.ofHours(10), Brief.delayUntil(8 * 60, at(22, 0)))
    }

    @Test
    fun `midnight and the last minute of the day`() {
        assertEquals(Duration.ofMinutes(1), Brief.delayUntil(0, at(23, 59)))
        assertEquals(Duration.ofHours(24), Brief.delayUntil(0, at(0, 0)))
        assertEquals(Duration.ofSeconds(90), Brief.delayUntil(23 * 60 + 59, at(23, 57, 30)))
        assertEquals(Duration.ofMinutes(23 * 60 + 59), Brief.delayUntil(23 * 60 + 59, at(0, 0)))
    }

    @Test
    fun `tomorrow can be next month or next year`() {
        assertEquals(Duration.ofHours(12), Brief.delayUntil(8 * 60, LocalDateTime.of(2026, 11, 30, 20, 0)))
        assertEquals(Duration.ofHours(9), Brief.delayUntil(8 * 60, LocalDateTime.of(2026, 12, 31, 23, 0)))
        assertEquals(Duration.ofHours(9), Brief.delayUntil(8 * 60, LocalDateTime.of(2028, 2, 28, 23, 0)))
    }

    @Test
    fun `the wait is always more than nothing and at most a day`() {
        for (minutes in 0 until 24 * 60 step 37) {
            for (hour in 0..23) for (minute in listOf(0, 1, 29, 59)) {
                val now = at(hour, minute, 17)
                val delay = Brief.delayUntil(minutes, now)
                assertTrue("$minutes at $now gave $delay", delay > Duration.ZERO && delay <= Duration.ofHours(24))
                val fires = now.plus(delay)
                assertEquals(minutes, fires.hour * 60 + fires.minute)
                assertEquals(0, fires.second)
            }
        }
    }
}
