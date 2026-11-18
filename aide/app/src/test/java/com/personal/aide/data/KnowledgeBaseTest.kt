package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
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

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class KnowledgeBaseTest {
    private lateinit var db: AppDatabase
    private lateinit var knowledge: KnowledgeBase
    private var now = 1_000L

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        knowledge = KnowledgeBase(db.knowledge()) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    private suspend fun all() = db.knowledge().all()

    // -------------------------------------------------------------------------------------------
    // New entries

    @Test
    fun `a new entry is filed under its title with where it came from`(): Unit = runBlocking {
        val id = knowledge.save(KnowledgeType.PERSON, "  Dana Whitfield ", " Engineering lead. \n", KnowledgeOrigin.MEETING, meetingId = 7)

        val entry = all().single()
        assertEquals(id, entry.id)
        assertEquals(KnowledgeType.PERSON, entry.type)
        assertEquals("Dana Whitfield", entry.title)
        assertEquals("dana whitfield", entry.key)
        assertEquals("Engineering lead.", entry.content)
        assertEquals(KnowledgeOrigin.MEETING, entry.origin)
        assertEquals(listOf(7L), entry.sourceMeetingIds)
        assertEquals(1_000L, entry.createdAt)
        assertEquals(1_000L, entry.updatedAt)
        assertEquals(false, entry.pinned)
    }

    @Test
    fun `an entry learned outside a meeting has no source meetings`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.TERM, "QBR", "Quarterly business review.", KnowledgeOrigin.MANUAL)
        assertEquals(emptyList<Long>(), all().single().sourceMeetingIds)
    }

    @Test
    fun `nothing is saved without a usable title and some content`(): Unit = runBlocking {
        assertNull(knowledge.save(KnowledgeType.FACT, "", "content", KnowledgeOrigin.MANUAL))
        assertNull(knowledge.save(KnowledgeType.FACT, "   ", "content", KnowledgeOrigin.MANUAL))
        assertNull("a title of only punctuation can't be matched later", knowledge.save(KnowledgeType.FACT, "— ?!", "content", KnowledgeOrigin.MANUAL))
        assertNull(knowledge.save(KnowledgeType.FACT, "Atlas", "", KnowledgeOrigin.MANUAL))
        assertNull(knowledge.save(KnowledgeType.FACT, "Atlas", " \n ", KnowledgeOrigin.MANUAL))
        assertTrue(all().isEmpty())
    }

    @Test
    fun `different titles are different entries`(): Unit = runBlocking {
        val first = knowledge.save(KnowledgeType.PERSON, "Dana Whitfield", "Engineering lead.", KnowledgeOrigin.MEETING)
        val second = knowledge.save(KnowledgeType.PERSON, "Dana Whitford", "Finance.", KnowledgeOrigin.MEETING)
        assertNotEquals(first, second)
        assertEquals(2, all().size)
    }

    // -------------------------------------------------------------------------------------------
    // One thing, one entry

    @Test
    fun `the same title spelled differently updates the entry`(): Unit = runBlocking {
        val first = knowledge.save(KnowledgeType.PROJECT, "Q4 Launch — Phase 2", "Starts in October.", KnowledgeOrigin.MEETING, meetingId = 1)
        now = 2_000
        val second = knowledge.save(KnowledgeType.PROJECT, "q4 launch phase 2", "Starts in November now.", KnowledgeOrigin.MEETING, meetingId = 2)

        assertEquals(first, second)
        val entry = all().single()
        assertEquals("the spelling it was first filed under stays", "Q4 Launch — Phase 2", entry.title)
        assertEquals("Starts in November now.", entry.content)
        assertEquals(listOf(1L, 2L), entry.sourceMeetingIds)
    }

    @Test
    fun `the same title under a different type updates rather than duplicates`(): Unit = runBlocking {
        val first = knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead.", KnowledgeOrigin.MEETING, meetingId = 1)
        val second = knowledge.save(KnowledgeType.FACT, "dana", "Now also owns pricing.", KnowledgeOrigin.MEETING, meetingId = 2)

        assertEquals(first, second)
        val entry = all().single()
        assertEquals("it stays where it was filed", KnowledgeType.PERSON, entry.type)
        assertEquals("Now also owns pricing.", entry.content)
        assertEquals(listOf(1L, 2L), entry.sourceMeetingIds)
    }

    @Test
    fun `the same title under a third type still finds the one entry`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.ORG, "Northwind", "The company.", KnowledgeOrigin.ONBOARDING)
        knowledge.save(KnowledgeType.PROJECT, "Northwind", "Also a project name.", KnowledgeOrigin.MEETING, replace = false)
        knowledge.save(KnowledgeType.TERM, "NORTHWIND", "Sometimes shortened to NW.", KnowledgeOrigin.ANSWER, replace = false)

        val entry = all().single()
        assertEquals(KnowledgeType.ORG, entry.type)
        assertEquals("The company.\nAlso a project name.\nSometimes shortened to NW.", entry.content)
    }

    // -------------------------------------------------------------------------------------------
    // Replace or append

    @Test
    fun `by default the new text replaces the old`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.MEETING)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse. Migrating in Q1.", KnowledgeOrigin.MEETING)
        assertEquals("The data warehouse. Migrating in Q1.", all().single().content)
    }

    @Test
    fun `appending adds a line and keeps what was there`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.\n", KnowledgeOrigin.MEETING)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "  Owned by Dana.  ", KnowledgeOrigin.ANSWER, replace = false)
        assertEquals("The data warehouse.\nOwned by Dana.", all().single().content)
    }

    @Test
    fun `appending something already there changes nothing`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.\nOwned by Dana.", KnowledgeOrigin.MEETING)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "owned by dana.", KnowledgeOrigin.ANSWER, replace = false)
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.ANSWER, replace = false)
        assertEquals("The data warehouse.\nOwned by Dana.", all().single().content)
    }

    @Test
    fun `appending to nothing starts the entry`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.TERM, "QBR", "Quarterly business review.", KnowledgeOrigin.ANSWER, replace = false)
        assertEquals("Quarterly business review.", all().single().content)
    }

    // -------------------------------------------------------------------------------------------
    // What an update keeps

    @Test
    fun `an update moves the updated time and keeps the rest of the entry`(): Unit = runBlocking {
        val id = knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead.", KnowledgeOrigin.ONBOARDING)!!
        db.knowledge().update(db.knowledge().get(id)!!.copy(pinned = true))
        now = 9_000
        knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead. Owns pricing.", KnowledgeOrigin.MEETING, meetingId = 3)

        val entry = all().single()
        assertEquals(id, entry.id)
        assertEquals(1_000L, entry.createdAt)
        assertEquals(9_000L, entry.updatedAt)
        assertEquals("pinning survives", true, entry.pinned)
        assertEquals("where it was first learned is not rewritten", KnowledgeOrigin.ONBOARDING, entry.origin)
        assertEquals(listOf(3L), entry.sourceMeetingIds)
    }

    @Test
    fun `a meeting is listed as a source once`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead.", KnowledgeOrigin.MEETING, meetingId = 3)
        knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead, still.", KnowledgeOrigin.MEETING, meetingId = 3)
        knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead, again.", KnowledgeOrigin.MANUAL)
        knowledge.save(KnowledgeType.PERSON, "Dana", "Engineering lead, promoted.", KnowledgeOrigin.MEETING, meetingId = 5)
        assertEquals(listOf(3L, 5L), all().single().sourceMeetingIds)
    }

    // -------------------------------------------------------------------------------------------
    // Notes from Claude

    @Test
    fun `notes are saved under the type their word means`(): Unit = runBlocking {
        knowledge.saveNotes(
            listOf(
                KnowledgeNote("person", "Dana Whitfield", "Engineering lead."),
                KnowledgeNote("PROJECT", "Atlas", "The data warehouse."),
                KnowledgeNote("acronym", "QBR", "Quarterly business review."),
                KnowledgeNote("customer", "Acme", "Largest shipper."),
                KnowledgeNote("who knows", "Lunch", "Thursdays."),
            ),
            KnowledgeOrigin.MEETING,
            meetingId = 4,
        )
        val types = all().associate { it.title to it.type }
        assertEquals(
            mapOf(
                "Dana Whitfield" to KnowledgeType.PERSON,
                "Atlas" to KnowledgeType.PROJECT,
                "QBR" to KnowledgeType.TERM,
                "Acme" to KnowledgeType.ORG,
                "Lunch" to KnowledgeType.FACT,
            ),
            types,
        )
        assertTrue(all().all { it.origin == KnowledgeOrigin.MEETING && it.sourceMeetingIds == listOf(4L) })
    }

    @Test
    fun `empty notes are skipped and the rest still saved`(): Unit = runBlocking {
        knowledge.saveNotes(
            listOf(KnowledgeNote("person", "", "No title."), KnowledgeNote("person", "Dana", ""), KnowledgeNote("person", "Marcus Lee", "Head of Sales.")),
            KnowledgeOrigin.MEETING,
        )
        assertEquals(listOf("Marcus Lee"), all().map { it.title })
    }

    @Test
    fun `two notes about the same thing in one batch make one entry`(): Unit = runBlocking {
        knowledge.saveNotes(
            listOf(KnowledgeNote("person", "Dana", "Engineering lead."), KnowledgeNote("fact", "DANA", "Engineering lead. Owns pricing.")),
            KnowledgeOrigin.MEETING,
        )
        val entry = all().single()
        assertNotNull(entry)
        assertEquals("Engineering lead. Owns pricing.", entry.content)
    }
}
