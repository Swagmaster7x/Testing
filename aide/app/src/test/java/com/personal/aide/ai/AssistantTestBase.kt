package com.personal.aide.ai

import android.content.Context
import androidx.test.core.app.ApplicationProvider
import com.personal.aide.calendar.Agenda
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.AideJson
import com.personal.aide.data.KnowledgeBase
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.MeetingStore
import com.personal.aide.data.SettingsStore
import com.personal.aide.data.TaskStore
import com.personal.aide.data.WorkProfile
import com.personal.aide.data.db.AppDatabase
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.SegmentKind
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.testing.FakeLlm
import com.personal.aide.testing.Fixed
import com.personal.aide.testing.MemoryDataStore
import org.junit.After
import org.junit.Before
import java.util.Locale

/**
 * What every [Assistant] test stands on: a real in-memory database, settings over an in-memory
 * store, a scripted stand-in for Claude, and a clock fixed at [Fixed.now] in New York.
 */
abstract class AssistantTestBase {
    protected lateinit var db: AppDatabase
    protected lateinit var settings: SettingsStore
    protected lateinit var knowledge: KnowledgeBase
    protected lateinit var meetings: MeetingStore
    protected lateinit var tasks: TaskStore
    protected lateinit var assistant: Assistant
    protected val llm = FakeLlm()
    protected var now = Fixed.now
    protected val today = Fixed.today
    protected var events: List<CalendarEvent> = emptyList()
    private lateinit var localeBefore: Locale

    protected val sam = WorkProfile(
        name = "Sam Rivera",
        role = "Senior Product Manager",
        company = "Northwind Logistics",
        manager = "Priya Nair",
        goals = listOf("Launch self-serve quoting by end of Q1"),
    )

    /** A calendar that hands back [events] for any stretch it is asked about, and remembers the asking. */
    protected val agendaQueries = ArrayList<Pair<Long, Long>>()
    private val agenda = object : Agenda {
        override suspend fun events(fromMillis: Long, toMillis: Long): List<CalendarEvent> {
            agendaQueries += fromMillis to toMillis
            return events
        }
    }

    @Before
    fun setUpAssistant() {
        // Clock times in prompts are written the way the phone writes them.
        localeBefore = Locale.getDefault()
        Locale.setDefault(Locale.US)
        db = AppDatabase.inMemory(ApplicationProvider.getApplicationContext<Context>())
        settings = SettingsStore(MemoryDataStore())
        knowledge = KnowledgeBase(db.knowledge()) { now }
        meetings = MeetingStore(db.meetings()) { now }
        tasks = TaskStore(db.tasks()) { now }
        // No waiting and trying again after a failure: a test that scripts one failure means exactly one call.
        assistant = Assistant(db, settings, llm, knowledge, agenda, now = { now }, zone = { Fixed.zone }, retryDelays = emptyList())
    }

    @After
    fun tearDownAssistant() {
        db.close()
        Locale.setDefault(localeBefore)
    }

    /** Forty-six words of a pricing meeting, as the recognizer would hand them over. */
    protected val pricingTalk = listOf(
        "good morning everyone let's get started with the pricing review",
        "dana whitfield will send the revised pricing deck to marcus by friday",
        "we agreed to ship the three tier model in the first quarter",
        "someone needs to book the offsite venue before the end of the month",
    )

    /** A live recording that ran for [minutes] and has been stopped. */
    protected suspend fun recorded(
        title: String? = null,
        lines: List<String> = pricingTalk,
        attendees: List<String> = emptyList(),
        minutes: Int = 30,
    ): Long {
        val id = meetings.startLive(title, attendees)
        lines.forEachIndexed { index, line -> meetings.addSegment(id, SegmentKind.SPEECH, line, index * 30_000L) }
        now += minutes * 60_000L
        meetings.finish(id)
        return id
    }

    /** A meeting that was summarized some time ago. */
    protected suspend fun summarized(
        title: String,
        startedAt: Long,
        analysis: MeetingAnalysis = MeetingAnalysis(title = title, tldr = "Notes on $title."),
        attendees: List<String> = emptyList(),
    ): Long = db.meetings().insert(
        MeetingEntity(
            title = title,
            titleIsAuto = false,
            startedAt = startedAt,
            endedAt = startedAt + 30 * 60_000,
            status = MeetingStatus.READY,
            attendees = attendees,
            tldr = analysis.tldr,
            analysisJson = AideJson.encodeToString(MeetingAnalysis.serializer(), analysis),
            summarizedAt = startedAt + 31 * 60_000,
            model = "claude-opus-5-5",
        ),
    )

    protected fun json(analysis: MeetingAnalysis): String = AideJson.encodeToString(MeetingAnalysis.serializer(), analysis)

    protected suspend fun meeting(id: Long): MeetingEntity = db.meetings().get(id)!!

    protected suspend fun tasksOf(meetingId: Long): List<TaskEntity> = db.tasks().forMeeting(meetingId)

    protected suspend fun insert(task: TaskEntity): TaskEntity = db.tasks().get(db.tasks().insert(task))!!
}
