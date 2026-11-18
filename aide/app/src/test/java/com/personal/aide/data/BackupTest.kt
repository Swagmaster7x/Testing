package com.personal.aide.data

import android.app.Application
import android.content.Context
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.personal.aide.ai.AideModel
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeOrigin
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.ThreadKind
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.testing.MemoryDataStore
import com.personal.aide.testing.task
import kotlinx.coroutines.runBlocking
import org.junit.After
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Assert.fail
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config

@RunWith(AndroidJUnit4::class)
@Config(sdk = [35], application = Application::class)
class BackupTest {
    private lateinit var db: AppDatabase
    private lateinit var settings: SettingsStore
    private lateinit var backup: Backup
    private var now = 1_800_000_000_000L

    private val profile = WorkProfile(
        name = "Sam Rivera",
        role = "Senior Product Manager",
        company = "Northwind \"Logistics\"",
        goals = listOf("Launch self-serve quoting", "Cut turnaround\nfrom 2 days to 2 hours"),
        stakeholders = listOf("Priya Nair — VP Product"),
    )

    /** Everything stored, table by table, the way the app would read it. */
    private data class Everything(
        val profile: WorkProfile,
        val meetings: List<MeetingEntity>,
        val segments: List<SegmentEntity>,
        val tasks: List<TaskEntity>,
        val knowledge: List<KnowledgeEntity>,
        val questions: List<QuestionEntity>,
        val threads: List<ChatThreadEntity>,
        val messages: List<ChatMessageEntity>,
        val insights: List<InsightEntity>,
    )

    private suspend fun everything(db: AppDatabase = this.db, settings: SettingsStore = this.settings) = Everything(
        profile = settings.currentProfile(),
        meetings = db.meetings().all(),
        segments = db.meetings().allSegments(),
        tasks = db.tasks().all(),
        knowledge = db.knowledge().all(),
        questions = db.questions().all(),
        threads = db.chat().allThreads(),
        messages = db.chat().allMessages(),
        insights = db.insights().all(),
    )

    private val nothing = Everything(WorkProfile(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList())

    @Before
    fun setUp() {
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        settings = SettingsStore(MemoryDataStore())
        backup = Backup(db, settings) { now }
    }

    @After
    fun tearDown() {
        db.close()
    }

    /** A lived-in app: every table has rows, and rows point at each other. */
    private suspend fun fill() {
        settings.setProfile(profile)
        settings.setModel(AideModel.SONNET)
        settings.setOnboarded(true)

        val pricing = db.meetings().insert(
            MeetingEntity(
                title = "Pricing review — \"tiers\"",
                titleIsAuto = false,
                startedAt = 1_000,
                endedAt = 4_000,
                status = MeetingStatus.READY,
                attendees = listOf("Dana Whitfield", "Marcus Lee"),
                calendarEventId = 77,
                meetingType = "review",
                tldr = "Agreed three tiers.",
                analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), MeetingAnalysis(title = "Pricing review", decisions = listOf("Ship in Q1"))),
                rating = 1,
                wordCount = 9,
                summarizedAt = 5_000,
                model = "claude-opus-5-5",
            ),
        )
        val imported = db.meetings().insert(
            MeetingEntity(title = "Vendor call", startedAt = 2_000, endedAt = 2_000, source = MeetingSource.IMPORT, status = MeetingStatus.FAILED, error = "Claude is busy"),
        )
        db.meetings().insertSegments(
            listOf(
                SegmentEntity(meetingId = pricing, offsetMs = 0, text = "good morning everyone"),
                SegmentEntity(meetingId = pricing, offsetMs = 9_000, kind = SegmentKind.NOTE, text = "Dana owns the deck"),
                SegmentEntity(meetingId = pricing, offsetMs = 12_000, kind = SegmentKind.FLAG, text = ""),
                SegmentEntity(meetingId = imported, offsetMs = 0, text = "One line.\tWith a tab."),
            ),
        )
        db.tasks().insertAll(
            listOf(
                task(title = "Send revised deck", origin = TaskOrigin.AI, meetingId = pricing, due = 20_000, planned = 19_999, priority = 2, createdAt = 5_001, edited = true, details = "v3"),
                task(title = "Book venue", status = TaskStatus.DONE, createdAt = 5_002, completedAt = 6_000),
                task(title = "Send contract", ownership = Ownership.OTHERS, owner = "Marcus Lee", origin = TaskOrigin.AI, meetingId = imported, createdAt = 5_003),
                task(title = "Not really a task", ownership = Ownership.UNCLEAR, origin = TaskOrigin.AI, status = TaskStatus.DISMISSED, createdAt = 5_004),
            ),
        )
        db.knowledge().insert(
            KnowledgeEntity(type = KnowledgeType.PERSON, title = "Dana Whitfield", key = "dana whitfield", content = "Engineering lead.\nOwns the quoting API.", sourceMeetingIds = listOf(pricing, imported), origin = KnowledgeOrigin.MEETING, pinned = true, createdAt = 5_000, updatedAt = 7_000),
        )
        db.knowledge().insert(
            KnowledgeEntity(type = KnowledgeType.TERM, title = "QBR", key = "qbr", content = "Quarterly business review.", origin = KnowledgeOrigin.ANSWER, createdAt = 5_100, updatedAt = 5_100),
        )
        db.questions().insertAll(
            listOf(
                QuestionEntity(meetingId = pricing, question = "Who is Lee?", why = "came up twice", topic = "Lee", topicType = KnowledgeType.PERSON, createdAt = 5_200),
                QuestionEntity(question = "What is QBR?", topic = "QBR", topicType = KnowledgeType.TERM, answer = "Quarterly business review.", status = QuestionStatus.ANSWERED, createdAt = 5_300, answeredAt = 5_400),
                QuestionEntity(meetingId = imported, question = "What is Atlas?", status = QuestionStatus.SKIPPED, createdAt = 5_500),
            ),
        )
        val ask = db.chat().insertThread(ChatThreadEntity(kind = ThreadKind.ASK, title = "What did we decide?", createdAt = 6_000, updatedAt = 6_500))
        val aboutMeeting = db.chat().insertThread(ChatThreadEntity(kind = ThreadKind.MEETING, meetingId = pricing, createdAt = 6_600, updatedAt = 6_700))
        db.chat().insertThread(ChatThreadEntity(kind = ThreadKind.ONBOARDING, title = "Getting to know you", createdAt = 100, updatedAt = 200))
        db.chat().insertMessage(ChatMessageEntity(threadId = ask, role = "user", text = "What did we decide on pricing?", createdAt = 6_100))
        db.chat().insertMessage(ChatMessageEntity(threadId = ask, role = "assistant", text = "Three tiers, shipping in Q1.", createdAt = 6_200, rating = 1))
        db.chat().insertMessage(ChatMessageEntity(threadId = aboutMeeting, role = "user", text = "Who owns the deck?", createdAt = 6_650))
        db.chat().insertMessage(ChatMessageEntity(threadId = aboutMeeting, role = "assistant", text = "Claude is busy right now.", createdAt = 6_660, failed = true))
        db.insights().upsert(InsightEntity(kind = InsightKind.DAY_PLAN, periodStart = 20_000, json = AideJson.encodeToString(DayPlan.serializer(), DayPlan(headline = "Deck first")), createdAt = 7_000, rating = 1))
        db.insights().upsert(InsightEntity(kind = InsightKind.WEEK_REVIEW, periodStart = 19_995, json = "{}", createdAt = 7_100, rating = -1))
        db.usage().insert(UsageEntity(at = 5_000, feature = "meeting_summary", model = "claude-opus-5-5", inputTokens = 9_000, outputTokens = 1_200))
        db.usage().insert(UsageEntity(at = 6_200, feature = "ask", model = "claude-opus-5-5", ok = false))
    }

    // -------------------------------------------------------------------------------------------
    // The round trip

    @Test
    fun `export then erase then restore brings everything back as it was`(): Unit = runBlocking {
        fill()
        val before = everything()
        assertTrue("the fixture should fill every table", listOf(before.meetings, before.segments, before.tasks, before.knowledge, before.questions, before.threads, before.messages, before.insights).all { it.size >= 2 })

        val file = backup.export()
        backup.eraseEverything()
        assertEquals(nothing, everything())

        backup.restore(file)
        assertEquals(before, everything())
    }

    @Test
    fun `links between rows hold after a restore`(): Unit = runBlocking {
        fill()
        val file = backup.export()
        backup.eraseEverything()
        backup.restore(file)

        val pricing = db.meetings().all().single { it.title.startsWith("Pricing review") }
        assertEquals(3, db.meetings().segments(pricing.id).size)
        assertEquals(listOf("Send revised deck"), db.tasks().forMeeting(pricing.id).map { it.title })
        assertEquals(listOf("Who is Lee?"), db.questions().all().filter { it.meetingId == pricing.id }.map { it.question })
        val thread = db.chat().allThreads().single { it.kind == ThreadKind.MEETING }
        assertEquals(pricing.id, thread.meetingId)
        assertEquals(listOf("Who owns the deck?", "Claude is busy right now."), db.chat().messages(thread.id).map { it.text })
        assertTrue(pricing.id in db.knowledge().all().single { it.title == "Dana Whitfield" }.sourceMeetingIds)
    }

    @Test
    fun `erasing removes the data and the profile but leaves settings`(): Unit = runBlocking {
        fill()
        backup.eraseEverything()

        assertEquals(nothing, everything())
        assertTrue("the record of calls goes too", db.usage().all().isEmpty())
        assertEquals(AideModel.SONNET, settings.current().model)
        assertTrue(settings.current().onboarded)
    }

    @Test
    fun `a restore replaces what is in the app rather than adding to it`(): Unit = runBlocking {
        fill()
        val before = everything()
        val file = backup.export()

        db.tasks().insert(task(title = "Added after the backup", createdAt = 9_000))
        db.meetings().insert(MeetingEntity(title = "Held after the backup", startedAt = 9_000))
        db.knowledge().insert(KnowledgeEntity(type = KnowledgeType.FACT, title = "New", key = "new", content = "Learned later.", createdAt = 9_000, updatedAt = 9_000))
        settings.setProfile(profile.copy(role = "Director"))

        backup.restore(file)
        assertEquals(before, everything())
    }

    @Test
    fun `restoring the same file twice is the same as restoring it once`(): Unit = runBlocking {
        fill()
        val before = everything()
        val file = backup.export()
        backup.restore(file)
        backup.restore(file)
        assertEquals(before, everything())
    }

    @Test
    fun `a backup can be restored onto another phone`(): Unit = runBlocking {
        fill()
        val before = everything()
        val file = backup.export()

        val otherDb = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        try {
            val otherSettings = SettingsStore(MemoryDataStore())
            Backup(otherDb, otherSettings) { now }.restore(file)
            assertEquals(before, everything(otherDb, otherSettings))
        } finally {
            otherDb.close()
        }
    }

    @Test
    fun `an empty app backs up and restores to empty`(): Unit = runBlocking {
        val file = backup.export()
        fill()
        backup.restore(file)
        assertEquals(nothing, everything())
    }

    @Test
    fun `new rows after a restore do not collide with restored ones`(): Unit = runBlocking {
        fill()
        val file = backup.export()
        backup.eraseEverything()
        backup.restore(file)
        val restored = everything()

        val newTask = db.tasks().insert(task(title = "After the restore", createdAt = 9_500))
        val newMeeting = db.meetings().insert(MeetingEntity(title = "After the restore", startedAt = 9_500))

        assertFalse(newTask in restored.tasks.map { it.id })
        assertFalse(newMeeting in restored.meetings.map { it.id })
        assertEquals(restored.tasks.size + 1, db.tasks().all().size)
    }

    // -------------------------------------------------------------------------------------------
    // The file

    @Test
    fun `the file records its format and when it was made`(): Unit = runBlocking {
        fill()
        val file = AideJson.decodeFromString(BackupFile.serializer(), backup.export())
        assertEquals(BackupFile.FORMAT, file.format)
        assertEquals(now, file.exportedAt)
        assertEquals(profile, file.profile)
        assertEquals(2, file.meetings.size)
        assertEquals(4, file.segments.size)
        assertEquals(4, file.tasks.size)
        assertEquals(2, file.knowledge.size)
        assertEquals(3, file.questions.size)
        assertEquals(3, file.threads.size)
        assertEquals(4, file.messages.size)
        assertEquals(2, file.insights.size)
    }

    private suspend fun assertRejected(file: String, expectedMessagePart: String) {
        val before = everything()
        try {
            backup.restore(file)
            fail("Expected '$file' to be rejected")
        } catch (e: IllegalArgumentException) {
            assertTrue("message was: ${e.message}", e.message.orEmpty().contains(expectedMessagePart))
        }
        assertEquals("a rejected file must not touch what is in the app", before, everything())
    }

    @Test
    fun `something that is not a backup is refused and nothing is lost`(): Unit = runBlocking {
        fill()
        assertRejected("", "isn't an Aide backup")
        assertRejected("hello", "isn't an Aide backup")
        assertRejected("[]", "isn't an Aide backup")
        assertRejected("{}", "isn't an Aide backup")
        assertRejected("""{"format":1,"profile":{"name":"Someone else"}}""", "isn't an Aide backup")
        assertRejected("""{"some":"other app's export","exportedAt":"yesterday"}""", "isn't an Aide backup")
    }

    @Test
    fun `a backup from a newer version is refused and nothing is lost`(): Unit = runBlocking {
        fill()
        assertRejected("""{"format":${BackupFile.FORMAT + 1},"exportedAt":123,"tasks":[]}""", "newer version")
    }

    @Test
    fun `a backup with fields this version does not know still restores`(): Unit = runBlocking {
        fill()
        val before = everything()
        val file = backup.export()
        val withExtras = file.replaceFirst("{", """{"added_in_a_later_build":{"x":[1,2,3]},""")
        backup.eraseEverything()
        backup.restore(withExtras)
        assertEquals(before, everything())
    }

    @Test
    fun `a damaged backup that cannot be written leaves the app as it was`(): Unit = runBlocking {
        fill()
        val before = everything()
        val good = AideJson.decodeFromString(BackupFile.serializer(), backup.export())
        // Transcript lines that belong to a meeting the file doesn't contain.
        val damaged = AideJson.encodeToString(BackupFile.serializer(), good.copy(segments = good.segments.map { it.copy(meetingId = 987_654) }))

        val failure = runCatching { backup.restore(damaged) }.exceptionOrNull()

        assertTrue("restoring lines for a meeting that isn't there should fail, not half-succeed", failure != null)
        assertEquals(before, everything())
    }
}
