package com.personal.aide.notify

import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.domain.Days
import com.personal.aide.testing.Fixed
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** Which calendar meetings get a brief and when. Setting the alarms themselves needs a phone. */
class RemindersTest {
    private val today = Fixed.today
    private val now = Fixed.now
    private val minute = 60_000L

    private fun event(id: Long, start: Long, title: String = "Meeting $id", allDay: Boolean = false) =
        CalendarEvent(id = id, title = title, start = start, end = start + 30 * minute, allDay = allDay, attendees = listOf("Dana Whitfield"))

    private fun plan(vararg events: CalendarEvent, alreadyNotified: Set<String> = emptySet()) =
        Reminders.plan(events.toList(), now, alreadyNotified)

    // -------------------------------------------------------------------------------------------
    // When a brief arrives

    @Test
    fun `a meeting later today gets its brief ten minutes before it starts`() {
        val standup = event(7, Fixed.at(today, 16))
        val alarm = plan(standup).single()

        assertEquals(10 * minute, Reminders.LEAD_MS)
        assertEquals(standup, alarm.event)
        assertEquals(Fixed.at(today, 15, 50), alarm.at)
    }

    @Test
    fun `a meeting tomorrow morning is planned too`() {
        val tomorrow = event(8, Fixed.at(today + 1, 9))
        assertEquals(Fixed.at(today + 1, 8, 50), plan(tomorrow).single().at)
    }

    @Test
    fun `a meeting less than ten minutes away gets its brief straight away`() {
        for (minutesAway in listOf(2L, 5L, 9L, 10L)) {
            val soon = event(7, now + minutesAway * minute)
            val alarm = plan(soon).single()
            assertTrue("$minutesAway minutes away: the brief can't be set for a moment already gone", alarm.at > now)
            assertTrue("$minutesAway minutes away: straight away means within seconds", alarm.at <= now + 10_000)
            assertTrue(alarm.at < soon.start)
        }
    }

    @Test
    fun `a meeting just over ten minutes away still gets the full ten minutes`() {
        val soon = event(7, now + 11 * minute)
        assertEquals(now + minute, plan(soon).single().at)
    }

    @Test
    fun `a meeting about to start, under way or over gets no brief`() {
        assertTrue(plan(event(1, now + 30_000)).isEmpty())
        assertTrue(plan(event(2, now)).isEmpty())
        assertTrue(plan(event(3, now - 5 * minute)).isEmpty())
        assertTrue(plan(event(4, Fixed.at(today - 1, 16))).isEmpty())
    }

    @Test
    fun `all-day events get no brief`() {
        val holiday = event(9, Days.startMillis(today + 1, Fixed.zone), title = "Dana on holiday", allDay = true)
        val laterToday = event(10, Fixed.at(today, 18), title = "Offsite", allDay = true)
        val standup = event(7, Fixed.at(today, 16))

        assertTrue(plan(holiday, laterToday).isEmpty())
        assertEquals(listOf(standup), plan(holiday, standup, laterToday).map { it.event })
    }

    // -------------------------------------------------------------------------------------------
    // Once only

    @Test
    fun `a meeting that has already had its brief gets no second one`() {
        val standup = event(7, Fixed.at(today, 16))
        val review = event(8, Fixed.at(today, 17))
        val mark = plan(standup).single().mark

        assertEquals(listOf(review), plan(standup, review, alreadyNotified = setOf(mark)).map { it.event })
        assertTrue(plan(standup, alreadyNotified = setOf(mark, "unrelated")).isEmpty())
    }

    @Test
    fun `a meeting already briefed and now minutes away is not briefed again`() {
        val soon = event(7, now + 5 * minute)
        assertTrue(plan(soon, alreadyNotified = setOf("7|${soon.start}")).isEmpty())
    }

    @Test
    fun `the next occurrence of a repeating meeting still gets its own brief`() {
        val todays = event(7, Fixed.at(today, 16), title = "Quoting standup")
        val tomorrows = event(7, Fixed.at(today + 1, 16), title = "Quoting standup")
        val mark = plan(todays).single().mark

        assertEquals(listOf(tomorrows), plan(todays, tomorrows, alreadyNotified = setOf(mark)).map { it.event })
    }

    @Test
    fun `a meeting moved to a new time is briefed for the new time`() {
        val before = event(7, Fixed.at(today, 16))
        val moved = before.copy(start = Fixed.at(today, 17), end = Fixed.at(today, 17, 30))
        val mark = plan(before).single().mark

        assertEquals(Fixed.at(today, 16, 50), plan(moved, alreadyNotified = setOf(mark)).single().at)
    }

    @Test
    fun `the same meeting listed twice gets one alarm`() {
        val standup = event(7, Fixed.at(today, 16))
        assertEquals(1, plan(standup, standup.copy(title = "Standup (from the other calendar)")).size)
    }

    @Test
    fun `every meeting in the day gets its own alarm, in the order given`() {
        val events = listOf(event(1, Fixed.at(today, 15)), event(2, Fixed.at(today, 16)), event(3, Fixed.at(today, 16)), event(4, Fixed.at(today + 1, 9)))
        val alarms = Reminders.plan(events, now, emptySet())

        assertEquals(events, alarms.map { it.event })
        assertEquals("each needs a number of its own or one alarm replaces another", 4, alarms.map { it.code }.toSet().size)
        assertEquals(4, alarms.map { it.mark }.toSet().size)
    }

    @Test
    fun `meetings hours apart with nearby calendar ids each get a brief`() {
        // Two ordinary meetings on the same afternoon, made in the calendar fifteen entries apart.
        val review = event(115, Fixed.at(today, 15), title = "Pricing review")
        val wrapUp = event(100, Fixed.at(today, 22, 45), title = "Release wrap-up")

        assertNotEquals(
            "two different meetings were given the same alarm code, so only one of them can have an alarm",
            Reminders.Alarm(review, 1).code,
            Reminders.Alarm(wrapUp, 1).code,
        )
        assertEquals(listOf(review, wrapUp), plan(review, wrapUp).map { it.event })
    }

    // -------------------------------------------------------------------------------------------
    // How an alarm is identified

    @Test
    fun `the same meeting always gets the same code, and another occurrence a different one`() {
        val standup = event(7, Fixed.at(today, 16), title = "Quoting standup")
        val code = Reminders.Alarm(standup, 1).code

        assertEquals(code, Reminders.Alarm(standup, 999).code)
        assertEquals("a new title or guest list is still the same meeting", code, Reminders.Alarm(standup.copy(title = "Standup", attendees = emptyList()), 1).code)
        assertNotEquals(code, Reminders.Alarm(standup.copy(start = Fixed.at(today + 1, 16)), 1).code)
        assertNotEquals(code, Reminders.Alarm(standup.copy(id = 8), 1).code)
    }

    @Test
    fun `a code is never negative, however large the calendar's id`() {
        for (id in listOf(1L, 70_000L, Int.MAX_VALUE.toLong(), 9_000_000_000L, Long.MAX_VALUE / 64)) {
            val code = Reminders.Alarm(event(id, Fixed.at(today, 16)), 1).code
            assertTrue("id $id gave $code", code >= 0)
        }
    }

    @Test
    fun `a mark names the event and the moment it starts`() {
        val start = Fixed.at(today, 16)
        assertEquals("7|$start", Reminders.Alarm(event(7, start), 1).mark)
    }
}
