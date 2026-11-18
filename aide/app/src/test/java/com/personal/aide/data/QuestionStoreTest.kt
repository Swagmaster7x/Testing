package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class QuestionStoreTest {
    private lateinit var db: AppDatabase
    private lateinit var knowledge: KnowledgeBase
    private lateinit var store: QuestionStore
    private var now = 5_000L

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        knowledge = KnowledgeBase(db.knowledge()) { now }
        store = QuestionStore(db.questions(), knowledge) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    private suspend fun meeting(): Long = db.meetings().insert(MeetingEntity(title = "Pricing review", startedAt = 1_000))

    private suspend fun ask(
        question: String = "Who is Marcus?",
        topic: String = "Marcus Lee",
        type: KnowledgeType = KnowledgeType.PERSON,
        meetingId: Long? = null,
    ): Long = store.add(QuestionEntity(meetingId = meetingId, question = question, why = "came up twice", topic = topic, topicType = type, createdAt = now))

    private suspend fun question(id: Long) = db.questions().get(id)!!

    @Test
    fun `a new question waits for an answer`(): Unit = runBlocking {
        val id = ask()
        val saved = question(id)
        assertEquals(QuestionStatus.OPEN, saved.status)
        assertEquals("", saved.answer)
        assertNull(saved.answeredAt)
        assertEquals(listOf(id), db.questions().all().map { it.id })
    }

    @Test
    fun `an answer is recorded and filed in the knowledge base under the question's topic`(): Unit = runBlocking {
        val meetingId = meeting()
        val id = ask(meetingId = meetingId)
        now = 9_000
        store.answer(id, "  Head of Sales. Runs the Acme account. \n")

        val answered = question(id)
        assertEquals(QuestionStatus.ANSWERED, answered.status)
        assertEquals("Head of Sales. Runs the Acme account.", answered.answer)
        assertEquals(9_000L, answered.answeredAt)

        val entry = db.knowledge().all().single()
        assertEquals(KnowledgeType.PERSON, entry.type)
        assertEquals("Marcus Lee", entry.title)
        assertEquals("Head of Sales. Runs the Acme account.", entry.content)
        assertEquals(KnowledgeOrigin.ANSWER, entry.origin)
        assertEquals(listOf(meetingId), entry.sourceMeetingIds)
    }

    @Test
    fun `an answer adds to what is already known instead of replacing it`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PERSON, "Marcus Lee", "Joined in 2024.\nSits in the Chicago office.", KnowledgeOrigin.MEETING)
        val id = ask()
        store.answer(id, "Head of Sales.")

        val entry = db.knowledge().all().single()
        assertEquals("Joined in 2024.\nSits in the Chicago office.\nHead of Sales.", entry.content)
        assertEquals("the entry keeps its first origin", KnowledgeOrigin.MEETING, entry.origin)
    }

    @Test
    fun `an answer about something filed under another type joins that entry`(): Unit = runBlocking {
        knowledge.save(KnowledgeType.PROJECT, "Atlas", "The data warehouse.", KnowledgeOrigin.MEETING)
        val id = ask(question = "What does Atlas stand for?", topic = "atlas", type = KnowledgeType.TERM)
        store.answer(id, "Nothing, it's just a name.")

        val entry = db.knowledge().all().single()
        assertEquals(KnowledgeType.PROJECT, entry.type)
        assertEquals("The data warehouse.\nNothing, it's just a name.", entry.content)
    }

    @Test
    fun `a question with no topic is filed under its own words`(): Unit = runBlocking {
        val id = ask(question = "Which team owns carrier scorecards?", topic = "  ", type = KnowledgeType.FACT)
        store.answer(id, "Shipper Experience.")

        val entry = db.knowledge().all().single()
        assertEquals("Which team owns carrier scorecards?", entry.title)
        assertEquals("Shipper Experience.", entry.content)
    }

    @Test
    fun `an empty answer is not an answer`(): Unit = runBlocking {
        val id = ask()
        store.answer(id, "")
        store.answer(id, "   \n")

        assertEquals(QuestionStatus.OPEN, question(id).status)
        assertNull(question(id).answeredAt)
        assertTrue(db.knowledge().all().isEmpty())
    }

    @Test
    fun `answering a question that has gone does nothing`(): Unit = runBlocking {
        store.answer(404, "Head of Sales.")
        store.skip(404)
        assertTrue(db.knowledge().all().isEmpty())
        assertTrue(db.questions().all().isEmpty())
    }

    @Test
    fun `skipping closes the question without teaching anything`(): Unit = runBlocking {
        val id = ask()
        store.skip(id)

        assertEquals(QuestionStatus.SKIPPED, question(id).status)
        assertEquals("", question(id).answer)
        assertTrue(db.knowledge().all().isEmpty())
        assertTrue(db.questions().all().none { it.status == QuestionStatus.OPEN })
    }

    @Test
    fun `a corrected answer replaces the recorded one and is kept alongside the first in the knowledge base`(): Unit = runBlocking {
        val id = ask()
        store.answer(id, "Head of Sales.")
        store.answer(id, "Head of Sales for North America.")

        assertEquals("Head of Sales for North America.", question(id).answer)
        assertEquals("Head of Sales.\nHead of Sales for North America.", db.knowledge().all().single().content)
    }

    @Test
    fun `giving the same answer twice does not repeat it`(): Unit = runBlocking {
        val id = ask()
        store.answer(id, "Head of Sales.")
        store.answer(id, "head of sales.")
        assertEquals("Head of Sales.", db.knowledge().all().single().content)
    }
}
