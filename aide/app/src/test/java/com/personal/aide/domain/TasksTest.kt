package com.personal.aide.domain

import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class TasksTest {
    /** Wednesday; the week runs Monday (today - 2) to Sunday (today + 4). */
    private val today = Fixed.today

    private fun List<TaskEntity>.ids() = map { it.id }

    private fun TaskBoard.row(day: Long): List<TaskEntity> = week.single { it.first == day }.second

    // -------------------------------------------------------------------------------------------
    // Today

    @Test
    fun `overdue and due-today tasks are on today's list and later ones are not`() {
        val board = buildTaskBoard(
            listOf(
                task(1, due = today - 3),
                task(2, due = today),
                task(3, due = today + 1),
                task(4),
            ),
            today,
        )
        assertEquals(listOf(1L, 2L), board.today.ids())
    }

    @Test
    fun `only open tasks past their due date are overdue`() {
        assertTrue(task(due = today - 1).isOverdue(today))
        assertFalse("due today is not late yet", task(due = today).isOverdue(today))
        assertFalse(task(due = today + 1).isOverdue(today))
        assertFalse("no due date is never late", task().isOverdue(today))
        assertFalse(task(due = today - 5, status = TaskStatus.DONE).isOverdue(today))
        assertFalse(task(due = today - 5, status = TaskStatus.DISMISSED).isOverdue(today))
    }

    @Test
    fun `a task pinned to today is on today's list whenever it is due`() {
        val board = buildTaskBoard(
            listOf(
                task(1, planned = today, due = today + 3),
                task(2, planned = today),
                task(3, planned = today, due = today + 30),
            ),
            today,
        )
        assertEquals(setOf(1L, 2L, 3L), board.today.ids().toSet())
        assertTrue(board.later.isEmpty())
        assertTrue(board.undated.isEmpty())
    }

    @Test
    fun `a task planned for a later day sits on that day and not on the day it is due`() {
        val friday = today + 2
        val thursday = today + 1
        val board = buildTaskBoard(listOf(task(1, planned = friday, due = today + 4), task(2, planned = friday, due = thursday)), today)

        assertEquals(listOf<Long>(), board.today.ids())
        assertEquals(setOf(1L, 2L), board.row(friday).ids().toSet())
        assertTrue(board.row(thursday).isEmpty())
        assertTrue(board.row(today + 4).isEmpty())
    }

    @Test
    fun `a task planned for a day that has passed rolls onto today`() {
        val monday = today - 2
        val board = buildTaskBoard(listOf(task(1, planned = monday, due = today + 2), task(2, planned = today - 20)), today)

        assertEquals(setOf(1L, 2L), board.today.ids().toSet())
        assertTrue("past days of the week show nothing", board.row(monday).isEmpty())
        assertTrue(board.row(today + 2).isEmpty())
    }

    @Test
    fun `an overdue task stays on today even when it was planned for another day`() {
        val board = buildTaskBoard(listOf(task(1, planned = today - 1, due = today - 4), task(2, planned = today, due = today - 1)), today)
        assertEquals(setOf(1L, 2L), board.today.ids().toSet())
    }

    @Test
    fun `today is ordered most urgent first`() {
        val board = buildTaskBoard(
            listOf(
                task(1, due = today, priority = 1, createdAt = 100),
                task(2, due = today - 1, priority = 0, createdAt = 500),
                task(3, due = today, priority = 2, createdAt = 400),
                task(4, due = today - 6, priority = 1, createdAt = 300),
                task(5, due = today, priority = 2, createdAt = 200),
                // Pinned to today without a deadline: after everything that has one.
                task(6, planned = today, priority = 2, createdAt = 50),
                task(7, due = today, priority = 1, createdAt = 600),
            ),
            today,
        )
        // Longest overdue first; on the same due date the higher priority, then the one waiting longest.
        assertEquals(listOf(4L, 2L, 5L, 3L, 1L, 7L, 6L), board.today.ids())
    }

    // -------------------------------------------------------------------------------------------
    // The week

    @Test
    fun `the week is seven rows from Monday to Sunday`() {
        val board = buildTaskBoard(emptyList(), today)
        assertEquals((Fixed.monday..Fixed.sunday).toList(), board.week.map { it.first })
        assertTrue(board.week.all { it.second.isEmpty() })
    }

    @Test
    fun `week rows hold what sits on each remaining day`() {
        val tasks = listOf(
            task(1, due = today - 1),
            task(2, due = today),
            task(3, due = today + 1),
            task(4, planned = today + 1, due = today + 9),
            task(5, due = today + 4),
            task(6, due = today + 5),
            task(7, planned = today + 3),
        )
        val board = buildTaskBoard(tasks, today)

        assertTrue(board.row(today - 2).isEmpty())
        assertTrue(board.row(today - 1).isEmpty())
        assertEquals("today's row repeats today's list", board.today, board.row(today))
        assertEquals(listOf(1L, 2L), board.row(today).ids())
        assertEquals(setOf(3L, 4L), board.row(today + 1).ids().toSet())
        assertTrue(board.row(today + 2).isEmpty())
        assertEquals(listOf(7L), board.row(today + 3).ids())
        assertEquals(listOf(5L), board.row(today + 4).ids())
        assertEquals("the Monday after is beyond this week", listOf(6L), board.later.ids())
    }

    @Test
    fun `on a Monday the first row is today`() {
        val monday = Fixed.monday
        val board = buildTaskBoard(listOf(task(1, due = monday), task(2, due = monday + 6), task(3, due = monday + 7)), monday)
        assertEquals(monday, board.week.first().first)
        assertEquals(listOf(1L), board.week.first().second.ids())
        assertEquals(listOf(2L), board.row(monday + 6).ids())
        assertEquals(listOf(3L), board.later.ids())
    }

    @Test
    fun `on a Sunday the week is the one ending today`() {
        val sunday = Fixed.sunday
        val board = buildTaskBoard(listOf(task(1, due = sunday), task(2, due = sunday + 1), task(3, due = sunday - 3)), sunday)
        assertEquals((sunday - 6..sunday).toList(), board.week.map { it.first })
        assertEquals(setOf(1L, 3L), board.row(sunday).ids().toSet())
        assertEquals(listOf(2L), board.later.ids())
        assertTrue(board.week.dropLast(1).all { it.second.isEmpty() })
    }

    @Test
    fun `later and undated`() {
        val board = buildTaskBoard(
            listOf(
                task(1, due = today + 30, priority = 2),
                task(2, due = today + 10, priority = 0),
                task(3, planned = today + 8),
                task(4, priority = 0, createdAt = 400),
                task(5, priority = 2, createdAt = 100),
                task(6, priority = 2, createdAt = 300),
                task(7, priority = 1, createdAt = 900),
            ),
            today,
        )
        // Dated ones by deadline; one that is only planned has no deadline to sort by, so it comes after.
        assertEquals(listOf(2L, 1L, 3L), board.later.ids())
        // No date at all: highest priority first, newest first within a priority.
        assertEquals(listOf(6L, 5L, 7L, 4L), board.undated.ids())
    }

    @Test
    fun `every open task of the user's is on exactly one list`() {
        val tasks = ArrayList<TaskEntity>()
        var id = 1L
        val dates = listOf<Long?>(null, today - 9, today - 1, today, today + 1, today + 4, today + 5, today + 40)
        for (due in dates) for (planned in dates) {
            tasks += task(id++, due = due, planned = planned, priority = (id % 3).toInt(), createdAt = id)
        }
        for (day in listOf(Fixed.monday, today, Fixed.sunday)) {
            val board = buildTaskBoard(tasks, day)
            val futureRows = board.week.filter { it.first != day }.flatMap { it.second }
            val placed = (board.today + futureRows + board.later + board.undated).ids()
            assertEquals("no task is listed twice", placed.size, placed.toSet().size)
            assertEquals("no task is lost", tasks.ids().toSet(), placed.toSet())
            assertEquals(tasks.size, board.openMine)
        }
    }

    // -------------------------------------------------------------------------------------------
    // Other people's work, unclear work, finished work

    @Test
    fun `other people's commitments are waited on and never on the user's lists`() {
        val board = buildTaskBoard(
            listOf(
                task(1, ownership = Ownership.OTHERS, owner = "Dana", due = today),
                task(2, ownership = Ownership.OTHERS, owner = "Marcus", due = today - 4),
                task(3, ownership = Ownership.OTHERS, owner = "Priya"),
                task(4, ownership = Ownership.OTHERS, owner = "Lee", status = TaskStatus.DONE, completedAt = 5),
                task(5, due = today),
            ),
            today,
        )
        assertEquals("most overdue first, undated last", listOf(2L, 1L, 3L), board.waiting.ids())
        assertEquals(listOf(5L), board.today.ids())
        assertEquals(1, board.openMine)
        assertTrue(board.week.flatMap { it.second }.none { it.ownership != Ownership.MINE })
    }

    @Test
    fun `tasks with no clear owner wait for review newest first`() {
        val board = buildTaskBoard(
            listOf(
                task(1, ownership = Ownership.UNCLEAR, createdAt = 100, due = today),
                task(2, ownership = Ownership.UNCLEAR, createdAt = 300),
                task(3, ownership = Ownership.UNCLEAR, createdAt = 200, due = today - 2),
                task(4, ownership = Ownership.UNCLEAR, status = TaskStatus.DISMISSED, createdAt = 400),
            ),
            today,
        )
        assertEquals(listOf(2L, 3L, 1L), board.review.ids())
        assertTrue(board.today.isEmpty())
        assertTrue(board.waiting.isEmpty())
        assertEquals(0, board.openMine)
    }

    @Test
    fun `done and dismissed tasks leave every open list`() {
        val board = buildTaskBoard(
            listOf(
                task(1, due = today - 1, status = TaskStatus.DONE, completedAt = 10),
                task(2, due = today, status = TaskStatus.DISMISSED),
                task(3, status = TaskStatus.DONE, completedAt = 30),
                task(4, due = today + 1, status = TaskStatus.DONE, completedAt = 20),
                task(5, ownership = Ownership.OTHERS, status = TaskStatus.DONE, completedAt = 40),
            ),
            today,
        )
        assertTrue(board.today.isEmpty())
        assertTrue(board.week.all { it.second.isEmpty() })
        assertTrue(board.later.isEmpty() && board.undated.isEmpty() && board.waiting.isEmpty() && board.review.isEmpty())
        assertEquals(0, board.openMine)
        assertEquals("most recently finished first; dismissed tasks are not 'done'", listOf(5L, 3L, 4L, 1L), board.doneRecently.ids())
    }

    @Test
    fun `done recently keeps the thirty most recent`() {
        val tasks = (1L..45L).map { task(it, status = TaskStatus.DONE, completedAt = it * 1000) }
        val board = buildTaskBoard(tasks.shuffled(java.util.Random(7)), today)
        assertEquals((45L downTo 16L).toList(), board.doneRecently.ids())
    }

    @Test
    fun `an empty task list makes an empty board`() {
        val board = buildTaskBoard(emptyList(), today)
        assertTrue(board.today.isEmpty() && board.later.isEmpty() && board.undated.isEmpty())
        assertTrue(board.waiting.isEmpty() && board.review.isEmpty() && board.doneRecently.isEmpty())
        assertEquals(0, board.openMine)
        assertEquals(7, board.week.size)
    }

    // -------------------------------------------------------------------------------------------
    // Words the assistant uses

    @Test
    fun `priority words`() {
        assertEquals(2, priorityOf("high"))
        assertEquals(2, priorityOf(" High "))
        assertEquals(2, priorityOf("URGENT"))
        assertEquals(0, priorityOf("low"))
        assertEquals(1, priorityOf("normal"))
        assertEquals(1, priorityOf("medium"))
        assertEquals(1, priorityOf(""))
        assertEquals("high", priorityWord(2))
        assertEquals("normal", priorityWord(1))
        assertEquals("low", priorityWord(0))
        for (priority in 0..2) assertEquals(priority, priorityOf(priorityWord(priority)))
    }

    @Test
    fun `ownership words`() {
        assertEquals(Ownership.MINE, ownershipOf("mine"))
        assertEquals(Ownership.MINE, ownershipOf(" Mine\n"))
        assertEquals(Ownership.OTHERS, ownershipOf("others"))
        assertEquals(Ownership.OTHERS, ownershipOf("OTHER"))
        assertEquals(Ownership.UNCLEAR, ownershipOf("unclear"))
        // Anything unexpected must not land on the user's list as their job.
        assertEquals(Ownership.UNCLEAR, ownershipOf(""))
        assertEquals(Ownership.UNCLEAR, ownershipOf("team"))
    }

    @Test
    fun `effective day prefers where the task was put over when it is due`() {
        assertEquals(today + 2, task(planned = today + 2, due = today + 5).effectiveDay)
        assertEquals(today + 5, task(due = today + 5).effectiveDay)
        assertEquals(today + 2, task(planned = today + 2).effectiveDay)
        assertEquals(null, task().effectiveDay)
    }
}
