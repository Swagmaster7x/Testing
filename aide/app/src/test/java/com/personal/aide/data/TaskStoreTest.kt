package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.task
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

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class TaskStoreTest {
    private lateinit var db: AppDatabase
    private lateinit var store: TaskStore
    private var now = Fixed.now
    private val today = Fixed.today

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        store = TaskStore(db.tasks()) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    private suspend fun get(id: Long): TaskEntity = db.tasks().get(id)!!

    /** A task as the assistant would have pulled it out of a meeting. */
    private suspend fun suggested(
        title: String = "Send revised pricing deck",
        ownership: Ownership = Ownership.MINE,
        owner: String = "",
        due: Long? = today + 2,
        priority: Int = 1,
        details: String = "",
    ): TaskEntity = get(
        db.tasks().insert(
            task(title = title, ownership = ownership, owner = owner, due = due, priority = priority, details = details, origin = TaskOrigin.AI, createdAt = now),
        ),
    )

    // -------------------------------------------------------------------------------------------
    // Adding

    @Test
    fun `a task the user adds is stored as theirs`(): Unit = runBlocking {
        val id = store.add("  Call Dana ", dueDay = today, priority = 2, details = " about pricing ", plannedDay = today + 1)!!
        val saved = get(id)

        assertEquals("Call Dana", saved.title)
        assertEquals("about pricing", saved.details)
        assertEquals(today, saved.dueDay)
        assertEquals(today + 1, saved.plannedDay)
        assertEquals(2, saved.priority)
        assertEquals(Ownership.MINE, saved.ownership)
        assertEquals("", saved.owner)
        assertEquals(TaskOrigin.MANUAL, saved.origin)
        assertEquals(TaskStatus.OPEN, saved.status)
        assertEquals(now, saved.createdAt)
        assertNull(saved.completedAt)
        assertFalse(saved.edited)
    }

    @Test
    fun `a task can be added for someone else`(): Unit = runBlocking {
        val saved = get(store.add("Send contract", ownership = Ownership.OTHERS, owner = "  Marcus Lee ")!!)
        assertEquals(Ownership.OTHERS, saved.ownership)
        assertEquals("Marcus Lee", saved.owner)
    }

    @Test
    fun `a task with no title is not added`(): Unit = runBlocking {
        assertNull(store.add(""))
        assertNull(store.add("   \n"))
        assertTrue(db.tasks().all().isEmpty())
    }

    @Test
    fun `priority is kept within low to high`(): Unit = runBlocking {
        assertEquals(2, get(store.add("a", priority = 9)!!).priority)
        assertEquals(0, get(store.add("b", priority = -3)!!).priority)
        assertEquals(1, get(store.add("c")!!).priority)
    }

    // -------------------------------------------------------------------------------------------
    // Finishing, dismissing, restoring

    @Test
    fun `done records when and undoing clears it`(): Unit = runBlocking {
        val id = store.add("Call Dana")!!
        now += 5_000
        store.setDone(id, true)
        assertEquals(TaskStatus.DONE, get(id).status)
        assertEquals(now, get(id).completedAt)

        store.setDone(id, false)
        assertEquals(TaskStatus.OPEN, get(id).status)
        assertNull(get(id).completedAt)
    }

    @Test
    fun `dismissing hides a task and restoring brings it back open`(): Unit = runBlocking {
        val id = store.add("Call Dana")!!
        store.dismiss(id)
        assertEquals(TaskStatus.DISMISSED, get(id).status)
        store.restore(id)
        assertEquals(TaskStatus.OPEN, get(id).status)

        store.setDone(id, true)
        store.restore(id)
        assertEquals(TaskStatus.OPEN, get(id).status)
        assertNull("a restored task is not finished", get(id).completedAt)
    }

    @Test
    fun `changes to a task that has gone do nothing`(): Unit = runBlocking {
        store.setDone(404, true)
        store.dismiss(404)
        store.restore(404)
        store.setOwnership(404, Ownership.OTHERS, "Dana")
        store.planFor(404, today)
        store.delete(404)
        store.edit(task(404, title = "Ghost"))
        assertTrue("editing a deleted task must not bring it back", db.tasks().all().isEmpty())
    }

    @Test
    fun `delete removes the task`(): Unit = runBlocking {
        val keep = store.add("Keep")!!
        val drop = store.add("Drop")!!
        store.delete(drop)
        assertEquals(listOf(keep), db.tasks().all().map { it.id })
    }

    // -------------------------------------------------------------------------------------------
    // What counts as correcting the assistant: editing

    @Test
    fun `rewording an assistant-made task is a correction`(): Unit = runBlocking {
        val before = suggested()
        store.edit(before.copy(title = "Send revised pricing deck to Marcus"))
        assertTrue(get(before.id).edited)
        assertEquals("Send revised pricing deck to Marcus", get(before.id).title)
    }

    @Test
    fun `changing setting or clearing the due date of an assistant-made task is a correction`(): Unit = runBlocking {
        val moved = suggested(due = today + 2)
        store.edit(moved.copy(dueDay = today + 5))
        assertTrue(get(moved.id).edited)
        assertEquals(today + 5, get(moved.id).dueDay)

        val given = suggested(title = "Book venue", due = null)
        store.edit(given.copy(dueDay = today + 1))
        assertTrue(get(given.id).edited)

        val cleared = suggested(title = "Draft FAQ", due = today)
        store.edit(cleared.copy(dueDay = null))
        assertTrue(get(cleared.id).edited)
        assertNull(get(cleared.id).dueDay)
    }

    @Test
    fun `overruling whose task it is in the editor is a correction`(): Unit = runBlocking {
        val before = suggested(ownership = Ownership.MINE)
        store.edit(before.copy(ownership = Ownership.OTHERS, owner = "Dana"))
        assertTrue(get(before.id).edited)
        assertEquals(Ownership.OTHERS, get(before.id).ownership)
    }

    @Test
    fun `settling an unclear owner in the editor is not a correction`(): Unit = runBlocking {
        val before = suggested(ownership = Ownership.UNCLEAR)
        store.edit(before.copy(ownership = Ownership.MINE))
        assertFalse(get(before.id).edited)
        assertEquals(Ownership.MINE, get(before.id).ownership)
    }

    @Test
    fun `adding detail, reprioritising or planning a day is not a correction`(): Unit = runBlocking {
        val before = suggested()
        store.edit(before.copy(details = "  Use the Q1 template ", priority = 2, plannedDay = today + 1))

        val after = get(before.id)
        assertFalse(after.edited)
        assertEquals("Use the Q1 template", after.details)
        assertEquals(2, after.priority)
        assertEquals(today + 1, after.plannedDay)
    }

    @Test
    fun `stray spaces around the title are not a correction`(): Unit = runBlocking {
        val before = suggested(title = "Send revised pricing deck")
        store.edit(before.copy(title = "  Send revised pricing deck \n"))
        assertFalse(get(before.id).edited)
        assertEquals("Send revised pricing deck", get(before.id).title)
    }

    @Test
    fun `saving the editor without changing anything is not a correction`(): Unit = runBlocking {
        val before = suggested(ownership = Ownership.OTHERS, owner = "Dana")
        store.edit(before)
        assertEquals(before, get(before.id))
    }

    @Test
    fun `once corrected a task stays corrected`(): Unit = runBlocking {
        val before = suggested()
        store.edit(before.copy(title = "Something else"))
        store.edit(get(before.id).copy(priority = 0))
        store.setDone(before.id, true)
        store.setOwnership(before.id, Ownership.MINE)
        assertTrue(get(before.id).edited)
    }

    @Test
    fun `the user's own tasks are never marked as corrections`(): Unit = runBlocking {
        val id = store.add("Call Dana", dueDay = today)!!
        store.edit(get(id).copy(title = "Call Dana and Marcus", dueDay = today + 3, ownership = Ownership.OTHERS, owner = "Priya"))
        store.setOwnership(id, Ownership.MINE)

        assertFalse(get(id).edited)
        assertEquals("Call Dana and Marcus", get(id).title)
        assertEquals(today + 3, get(id).dueDay)
    }

    // -------------------------------------------------------------------------------------------
    // What counts as correcting the assistant: settling the owner

    @Test
    fun `answering the assistant's unclear is not a correction`(): Unit = runBlocking {
        val mine = suggested(ownership = Ownership.UNCLEAR, owner = "someone")
        store.setOwnership(mine.id, Ownership.MINE)
        assertEquals(Ownership.MINE, get(mine.id).ownership)
        assertEquals("the user's own task names no owner", "", get(mine.id).owner)
        assertFalse(get(mine.id).edited)

        val theirs = suggested(title = "Book venue", ownership = Ownership.UNCLEAR)
        store.setOwnership(theirs.id, Ownership.OTHERS, "  Dana ")
        assertEquals(Ownership.OTHERS, get(theirs.id).ownership)
        assertEquals("Dana", get(theirs.id).owner)
        assertFalse(get(theirs.id).edited)
    }

    @Test
    fun `overruling the assistant about whose task it is is a correction`(): Unit = runBlocking {
        val notMine = suggested(ownership = Ownership.MINE)
        store.setOwnership(notMine.id, Ownership.OTHERS, "Dana")
        assertTrue(get(notMine.id).edited)
        assertEquals("Dana", get(notMine.id).owner)

        val actuallyMine = suggested(title = "Book venue", ownership = Ownership.OTHERS, owner = "Dana")
        store.setOwnership(actuallyMine.id, Ownership.MINE)
        assertTrue(get(actuallyMine.id).edited)
        assertEquals("", get(actuallyMine.id).owner)

        val nobodyKnows = suggested(title = "Draft FAQ", ownership = Ownership.MINE)
        store.setOwnership(nobodyKnows.id, Ownership.UNCLEAR)
        assertTrue(get(nobodyKnows.id).edited)
    }

    @Test
    fun `confirming what the assistant already said is not a correction`(): Unit = runBlocking {
        val mine = suggested(ownership = Ownership.MINE)
        store.setOwnership(mine.id, Ownership.MINE)
        assertFalse(get(mine.id).edited)

        val theirs = suggested(title = "Book venue", ownership = Ownership.OTHERS, owner = "Dana")
        store.setOwnership(theirs.id, Ownership.OTHERS)
        assertFalse(get(theirs.id).edited)
        assertEquals("no new name given, so the old one stays", "Dana", get(theirs.id).owner)
    }

    @Test
    fun `finishing, dismissing and planning say nothing about the assistant`(): Unit = runBlocking {
        val before = suggested()
        store.setDone(before.id, true)
        store.setDone(before.id, false)
        store.planFor(before.id, today + 1)
        store.dismiss(before.id)
        store.restore(before.id)
        assertFalse(get(before.id).edited)
    }

    // -------------------------------------------------------------------------------------------
    // Planning

    @Test
    fun `a task can be pinned to a day and unpinned`(): Unit = runBlocking {
        val id = store.add("Call Dana", dueDay = today + 4)!!
        store.planFor(id, today + 1)
        assertEquals(today + 1, get(id).plannedDay)
        assertEquals("the deadline is separate", today + 4, get(id).dueDay)
        store.planFor(id, null)
        assertNull(get(id).plannedDay)
    }

    @Test
    fun `applying a week plan puts each open task on its day`(): Unit = runBlocking {
        val a = store.add("A")!!
        val b = store.add("B", plannedDay = today)!!
        val c = store.add("C")!!
        val done = store.add("Done")!!.also { store.setDone(it, true) }
        val dismissed = store.add("Dismissed")!!.also { store.dismiss(it) }
        val untouched = store.add("Not in the plan", plannedDay = today + 3)!!

        store.applyWeekPlan(
            WeekPlan(
                headline = "A full week",
                days = listOf(
                    WeekDayPlan(day = "2026-11-19", taskIds = listOf(a, b, 9_999L)),
                    WeekDayPlan(day = "sometime", taskIds = listOf(c)),
                    WeekDayPlan(day = "2026-11-20", taskIds = listOf(done, dismissed)),
                ),
            ),
        )

        assertEquals(Fixed.day(2026, 11, 19), get(a).plannedDay)
        assertEquals("a plan moves a task that was already pinned", Fixed.day(2026, 11, 19), get(b).plannedDay)
        assertNull("a day that isn't a date moves nothing", get(c).plannedDay)
        assertNull(get(done).plannedDay)
        assertNull(get(dismissed).plannedDay)
        assertEquals(today + 3, get(untouched).plannedDay)
        assertEquals("no task is invented for an id that doesn't exist", 6, db.tasks().all().size)
        assertNotNull(db.tasks().get(a))
    }

    @Test
    fun `an empty week plan changes nothing`(): Unit = runBlocking {
        val id = store.add("A", plannedDay = today)!!
        store.applyWeekPlan(WeekPlan())
        assertEquals(today, get(id).plannedDay)
    }
}
