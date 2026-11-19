package com.personal.aide.domain

import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

/** What counts as a meeting between the user and one other person, for that person's page. */
class PeopleOneToOneTest {
    private fun meeting(id: Long, vararg attendees: String) = MeetingEntity(
        id = id, title = "Catch-up", titleIsAuto = false, startedAt = Fixed.at(Fixed.today - id, 10), endedAt = Fixed.at(Fixed.today - id, 10, 30),
        status = MeetingStatus.READY, attendees = attendees.toList(),
    )

    @Test
    fun `a calendar one-to-one lists the user too, and what came out of it is still between the two of them`() {
        // Started from the calendar, so the invite's guest list, the user included, came with it.
        val oneToOne = meeting(1, "Sam Rivera", "Priya Nair")
        val mine = task(5, title = "Cut the roadmap down to two bets", meetingId = 1)

        val view = buildPersonView("Priya Nair", emptyList(), listOf(mine), listOf(oneToOne), self = "Sam Rivera")

        assertEquals(listOf(5L), view.openWithThem.map { it.id })
    }

    @Test
    fun `a meeting with a third person in it is not a one-to-one`() {
        val three = meeting(1, "Sam Rivera", "Priya Nair", "Dana Whitfield")
        val mine = task(5, title = "Cut the roadmap down to two bets", meetingId = 1)

        val view = buildPersonView("Priya Nair", emptyList(), listOf(mine), listOf(three), self = "Sam Rivera")

        assertTrue(view.openWithThem.isEmpty())
        assertEquals("she was still in it", listOf(1L), view.meetings.map { it.id })
    }

    @Test
    fun `without knowing who the user is, only a meeting listing one person counts`() {
        val listed = meeting(1, "Priya Nair")
        val both = meeting(2, "Sam Rivera", "Priya Nair")
        val tasks = listOf(task(5, title = "Cut the roadmap", meetingId = 1), task(6, title = "Book the room", meetingId = 2))

        val view = buildPersonView("Priya Nair", emptyList(), tasks, listOf(listed, both))

        assertEquals(listOf(5L), view.openWithThem.map { it.id })
    }
}
