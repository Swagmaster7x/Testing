package com.personal.aide.notify

import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class NudgesTest {
    private val zone = Fixed.zone
    private val today = Fixed.today
    private val now = Fixed.now

    private fun compose(vararg tasks: TaskEntity, today: Long = this.today) =
        Nudges.compose(tasks.toList(), today, Fixed.at(today, 14, 0), zone)

    /** Something someone else took on [age] days ago, last reminded about [nudged] days ago (null for never). */
    private fun owed(
        id: Long,
        owner: String = "Dana",
        title: String = "Task $id",
        age: Long = 0,
        due: Long? = null,
        nudged: Long? = null,
        status: TaskStatus = TaskStatus.OPEN,
    ) = task(id, title = title, ownership = Ownership.OTHERS, owner = owner, due = due, status = status, createdAt = Fixed.at(today - age, 9))
        .copy(nudgedAt = nudged?.let { Fixed.at(today - it, 14) } ?: 0)

    private fun List<TaskEntity>.ids() = map { it.id }

    // -------------------------------------------------------------------------------------------
    // Nothing to say

    @Test
    fun `with nothing due and nobody late there is nothing to say`() {
        val result = compose()
        assertNull(result.due)
        assertNull(result.waiting)
        assertTrue(result.nudged.isEmpty())
    }

    @Test
    fun `work that is fine as it stands is not worth a reminder`() {
        val result = compose(
            task(1, due = today + 1),
            task(2),
            owed(3, age = 1),
            owed(4, age = 2, due = today + 3),
            owed(5, age = 0, due = today),
        )
        assertNull(result.due)
        assertNull(result.waiting)
        assertTrue(result.nudged.isEmpty())
    }

    // -------------------------------------------------------------------------------------------
    // Still due today

    @Test
    fun `a task of the user's due today and still open is worth a reminder`() {
        val result = compose(task(1, title = "Send the deck", due = today))

        assertEquals(Nudges.Reminder("Still due today", "• Send the deck"), result.due)
        assertNull(result.waiting)
        assertTrue(result.nudged.isEmpty())
    }

    @Test
    fun `several due today are counted and listed most important first, oldest first among equals`() {
        val result = compose(
            task(1, title = "Normal, newer", due = today, priority = 1, createdAt = now - 1_000),
            task(2, title = "Low", due = today, priority = 0, createdAt = now - 9_000),
            task(3, title = "High", due = today, priority = 2, createdAt = now),
            task(4, title = "Normal, older", due = today, priority = 1, createdAt = now - 5_000),
        )

        assertEquals("4 still due today", result.due?.title)
        assertEquals("• High\n• Normal, older\n• Normal, newer\n• Low", result.due?.body)
    }

    @Test
    fun `only four are listed and the rest are counted`() {
        val tasks = (1L..6L).map { task(it, title = "Task $it", due = today, createdAt = now + it) }
        val result = compose(*tasks.toTypedArray())

        assertEquals("6 still due today", result.due?.title)
        assertEquals("• Task 1\n• Task 2\n• Task 3\n• Task 4\n…and 2 more", result.due?.body)
    }

    @Test
    fun `exactly four are listed with nothing left over`() {
        val tasks = (1L..4L).map { task(it, title = "Task $it", due = today, createdAt = now + it) }
        assertEquals("• Task 1\n• Task 2\n• Task 3\n• Task 4", compose(*tasks.toTypedArray()).due?.body)
    }

    @Test
    fun `tasks done, thrown out, due another day or not the user's are not still due today`() {
        val result = compose(
            task(1, due = today, status = TaskStatus.DONE, completedAt = now),
            task(2, due = today, status = TaskStatus.DISMISSED),
            task(3, due = today + 1),
            task(4),
            task(5, due = today, ownership = Ownership.UNCLEAR),
            owed(6, due = today),
        )
        assertNull(result.due)
    }

    @Test
    fun `a long title is cut short in the list`() {
        val long = "Send the fully revised enterprise pricing deck with every appendix to Marcus and Priya before the board meeting"
        val line = compose(task(1, title = long, due = today)).due!!.body

        assertTrue(line, line.startsWith("• Send the fully revised enterprise pricing deck"))
        assertTrue(line, line.endsWith("…"))
        assertTrue(line, line.length <= 2 + 70 + 1)
    }

    // -------------------------------------------------------------------------------------------
    // Follow-ups that have gone quiet

    @Test
    fun `a follow-up past its date has gone stale`() {
        val late = owed(1, owner = "Dana Whitfield", title = "Send contract", age = 3, due = today - 1)
        val result = compose(late)

        assertEquals(Nudges.Reminder("Dana Whitfield still owes you something", "• Dana Whitfield: Send contract (3 days)"), result.waiting)
        assertEquals(listOf(late), result.nudged)
        assertNull(result.due)
    }

    @Test
    fun `a follow-up due today is not late yet`() {
        assertNull(compose(owed(1, age = 2, due = today)).waiting)
    }

    @Test
    fun `a follow-up with time still left is not late, however long ago it was promised`() {
        assertNull(compose(owed(1, age = 40, due = today + 3)).waiting)
        assertNull(compose(owed(1, age = 40, due = today)).waiting)
        // The day after its date it is.
        assertNotNull(compose(owed(1, age = 40, due = today - 1)).waiting)
    }

    @Test
    fun `a follow-up with no date goes stale after five days`() {
        assertEquals(5L, Nudges.STALE_DAYS)
        assertNull(compose(owed(1, age = 4)).waiting)

        val result = compose(owed(1, title = "Share forecast", age = 5))
        assertEquals("• Dana: Share forecast (5 days)", result.waiting?.body)
        assertEquals(listOf(1L), result.nudged.ids())
        assertNotNull(compose(owed(1, age = 40)).waiting)
    }

    @Test
    fun `how long something has been owed is counted in the phone's time zone`() {
        // Taken on at half past eleven at night in New York, which is already the next day in UTC.
        val lateEvening = owed(1, age = 5).copy(createdAt = Fixed.at(today - 5, 23, 30))
        assertEquals("• Dana: Task 1 (5 days)", compose(lateEvening).waiting?.body)

        val justAfterMidnight = owed(2, age = 4).copy(createdAt = Fixed.at(today - 4, 0, 5))
        assertNull(compose(justAfterMidnight).waiting)
    }

    @Test
    fun `a stale follow-up is not nudged again within a week`() {
        assertEquals(7L, Nudges.REPEAT_DAYS)
        for (daysSince in listOf(0L, 1L, 3L, 6L)) {
            val result = compose(owed(1, age = 20, due = today - 10, nudged = daysSince))
            assertNull("reminded $daysSince days ago", result.waiting)
            assertTrue(result.nudged.isEmpty())
        }
    }

    @Test
    fun `once a week has passed it is worth a reminder again`() {
        for (daysSince in listOf(7L, 8L, 30L)) {
            val result = compose(owed(1, age = 40, due = today - 30, nudged = daysSince))
            assertNotNull("reminded $daysSince days ago", result.waiting)
            assertEquals(listOf(1L), result.nudged.ids())
        }
    }

    @Test
    fun `the week between reminders is counted in days, whatever time the last one went out`() {
        // Last reminded late in the evening a week ago; the afternoon check-in a week later still counts as a week.
        val task = owed(1, age = 20).copy(nudgedAt = Fixed.at(today - 7, 23, 45))
        assertNotNull(compose(task).waiting)

        val sixDays = owed(1, age = 20).copy(nudgedAt = Fixed.at(today - 6, 0, 5))
        assertNull(compose(sixDays).waiting)
    }

    @Test
    fun `one that was just nudged does not hide another that was not`() {
        val result = compose(
            owed(1, owner = "Dana", title = "Send contract", age = 12, nudged = 2),
            owed(2, owner = "Marcus", title = "Share forecast", age = 6),
        )

        assertEquals(Nudges.Reminder("Marcus still owes you something", "• Marcus: Share forecast (6 days)"), result.waiting)
        assertEquals(listOf(2L), result.nudged.ids())
    }

    @Test
    fun `several stale follow-ups are counted and each is listed with who owes it and for how long`() {
        val result = compose(
            owed(1, owner = "Dana", title = "Send contract", age = 6),
            owed(2, owner = "Marcus", title = "Share forecast", age = 9, due = today - 2),
            owed(3, owner = "Priya", title = "Sign off the budget", age = 30),
            owed(4, owner = "Lee", title = "Not stale yet", age = 2),
        )

        assertEquals("3 follow-ups have gone quiet", result.waiting?.title)
        val lines = result.waiting!!.body.lines()
        assertEquals("the one that has waited longest leads", "• Priya: Sign off the budget (30 days)", lines.first())
        assertEquals(
            setOf("• Priya: Sign off the budget (30 days)", "• Dana: Send contract (6 days)", "• Marcus: Share forecast (9 days)"),
            lines.toSet(),
        )
        assertEquals(3, lines.size)
        assertEquals(setOf(1L, 2L, 3L), result.nudged.ids().toSet())
    }

    @Test
    fun `only the four listed are marked as reminded, so the rest come up next time`() {
        val stale = (1L..6L).map { owed(it, owner = "Person $it", age = 30 - it) }
        val first = compose(*stale.toTypedArray())

        assertEquals("6 follow-ups have gone quiet", first.waiting?.title)
        assertEquals(5, first.waiting!!.body.lines().size)
        assertEquals("…and 2 more", first.waiting!!.body.lines().last())
        assertEquals(listOf(1L, 2L, 3L, 4L), first.nudged.ids())
        for (task in first.nudged) assertTrue(first.waiting!!.body.contains("${task.owner}: ${task.title}"))

        // The next afternoon, with the four marked as the afternoon check-in marks them.
        val marked = stale.map { if (it.id in first.nudged.ids()) it.copy(nudgedAt = now) else it }
        val second = compose(*marked.toTypedArray(), today = today + 1)

        assertEquals("2 follow-ups have gone quiet", second.waiting?.title)
        assertEquals(listOf(5L, 6L), second.nudged.ids())
    }

    @Test
    fun `a follow-up with nobody named is someone's`() {
        val result = compose(owed(1, owner = "", title = "Send contract", age = 8))
        assertEquals(Nudges.Reminder("Someone still owes you something", "• Someone: Send contract (8 days)"), result.waiting)
    }

    @Test
    fun `the user's own tasks, unclear ones and closed ones are never follow-ups`() {
        val result = compose(
            task(1, due = today - 9, createdAt = Fixed.at(today - 30, 9)),
            task(2, ownership = Ownership.UNCLEAR, owner = "Dana", due = today - 9, createdAt = Fixed.at(today - 30, 9)),
            owed(3, age = 30, due = today - 9, status = TaskStatus.DONE),
            owed(4, age = 30, due = today - 9, status = TaskStatus.DISMISSED),
        )
        assertNull(result.waiting)
        assertTrue(result.nudged.isEmpty())
    }

    @Test
    fun `both reminders can be due on the same afternoon`() {
        val result = compose(
            task(1, title = "Send the deck", due = today),
            owed(2, owner = "Dana", title = "Send contract", age = 7),
        )

        assertEquals("Still due today", result.due?.title)
        assertEquals("Dana still owes you something", result.waiting?.title)
        assertEquals(listOf(2L), result.nudged.ids())
    }
}
