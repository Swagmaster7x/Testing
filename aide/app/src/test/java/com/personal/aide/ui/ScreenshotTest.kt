package com.personal.aide.ui

import androidx.compose.runtime.Composable
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.github.takahirom.roborazzi.captureRoboImage
import com.personal.aide.data.ThemeChoice
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.domain.Days
import com.personal.aide.domain.assistantStats
import com.personal.aide.domain.buildPersonView
import com.personal.aide.domain.buildPrepBrief
import com.personal.aide.domain.buildTaskBoard
import com.personal.aide.domain.workStats
import com.personal.aide.transcribe.RecorderState
import com.personal.aide.ui.ask.AskActions
import com.personal.aide.ui.ask.AskScreen
import com.personal.aide.ui.ask.AskState
import com.personal.aide.ui.insights.InsightsActions
import com.personal.aide.ui.insights.InsightsScreen
import com.personal.aide.ui.insights.InsightsState
import com.personal.aide.ui.interview.InterviewState
import com.personal.aide.ui.knowledge.EntryScreen
import com.personal.aide.ui.knowledge.EntryState
import com.personal.aide.ui.knowledge.KnowledgeScreen
import com.personal.aide.ui.knowledge.KnowledgeState
import com.personal.aide.ui.knowledge.QuestionsScreen
import com.personal.aide.ui.knowledge.QuestionsState
import com.personal.aide.ai.IntakeState
import com.personal.aide.data.Material
import com.personal.aide.ui.meetings.AddActions
import com.personal.aide.ui.meetings.AddKind
import com.personal.aide.ui.meetings.AddScreen
import com.personal.aide.ui.meetings.AddState
import com.personal.aide.ui.meetings.EarlierLine
import com.personal.aide.ui.meetings.MeetingActions
import com.personal.aide.ui.meetings.MeetingDetailState
import com.personal.aide.ui.meetings.MeetingScreen
import com.personal.aide.ui.meetings.MeetingsScreen
import com.personal.aide.ui.meetings.MeetingsState
import com.personal.aide.ui.meetings.SeriesActions
import com.personal.aide.ui.meetings.SeriesScreen
import com.personal.aide.ui.meetings.SeriesState
import com.personal.aide.ui.people.PersonActions
import com.personal.aide.ui.people.PersonScreen
import com.personal.aide.ui.people.PersonState
import com.personal.aide.ui.prep.PrepActions
import com.personal.aide.ui.prep.PrepScreen
import com.personal.aide.ui.prep.PrepState
import com.personal.aide.ui.progress.GoalCard
import com.personal.aide.ui.progress.ProgressActions
import com.personal.aide.ui.progress.ProgressScreen
import com.personal.aide.ui.progress.ProgressState
import com.personal.aide.ui.onboarding.OnboardingActions
import com.personal.aide.ui.onboarding.OnboardingScreen
import com.personal.aide.ui.onboarding.OnboardingState
import com.personal.aide.ui.onboarding.OnboardingStep
import com.personal.aide.ui.record.RecordActions
import com.personal.aide.ui.record.RecordScreen
import com.personal.aide.ui.settings.SettingsActions
import com.personal.aide.ui.settings.SettingsScreen
import com.personal.aide.ui.settings.SettingsState
import com.personal.aide.ui.tasks.TasksActions
import com.personal.aide.ui.tasks.TasksScreen
import com.personal.aide.ui.tasks.TasksState
import com.personal.aide.ui.theme.AideTheme
import com.personal.aide.ui.today.TodayActions
import com.personal.aide.ui.today.TodayScreen
import com.personal.aide.ui.today.TodayState
import androidx.compose.foundation.layout.padding
import androidx.compose.ui.unit.dp
import org.junit.Test
import org.junit.runner.RunWith
import org.robolectric.annotation.Config
import org.robolectric.annotation.GraphicsMode

/**
 * Renders every screen with realistic content to PNG files under build/outputs/roborazzi, in the
 * light and dark themes. Run with `./gradlew recordRoborazziDebug`. These are for looking at;
 * nothing is compared against a stored image.
 */
@RunWith(AndroidJUnit4::class)
@GraphicsMode(GraphicsMode.Mode.NATIVE)
@Config(sdk = [35], qualifiers = "w411dp-h1500dp-420dpi")
class ScreenshotTest {
    private val s = SampleData

    private fun shot(name: String, dark: Boolean = false, content: @Composable () -> Unit) {
        captureRoboImage("build/outputs/roborazzi/$name${if (dark) "-dark" else ""}.png") {
            AideTheme(if (dark) ThemeChoice.DARK else ThemeChoice.LIGHT) { content() }
        }
    }

    private fun todayState(withPlan: Boolean) = TodayState(
        loaded = true,
        name = s.profile.name,
        today = s.today,
        now = s.now,
        hasKey = true,
        board = buildTaskBoard(s.tasks, s.today),
        tasksById = s.tasks.associateBy { it.id },
        meetingTitles = s.meetings.associate { it.id to it.title },
        calendarConnected = true,
        events = s.events,
        plan = if (withPlan) s.dayPlan else null,
        planId = 1,
        planRating = 0,
        openQuestions = 2,
        recentMeetings = s.meetings.take(3),
        summarizing = setOf(2L),
    )

    @Test
    fun today() {
        shot("today") { TodayScreen(todayState(withPlan = true), TodayActions()) }
        shot("today", dark = true) { TodayScreen(todayState(withPlan = true), TodayActions()) }
    }

    @Test
    fun todayBeforePlanningWhileRecording() {
        shot("today-recording") {
            TodayScreen(
                todayState(withPlan = false).copy(
                    recorder = RecorderState(RecorderState.Phase.LISTENING, 9, "Quoting standup", startedAt = s.now - 754_000),
                ),
                TodayActions(),
            )
        }
    }

    @Test
    fun todayFirstRun() {
        shot("today-empty") { TodayScreen(TodayState(loaded = true, name = "Sam", today = s.today, now = s.now, hasKey = false), TodayActions()) }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h891dp-420dpi")
    fun recording() {
        val state = RecorderState(RecorderState.Phase.LISTENING, 3, "Q1 quoting launch", startedAt = s.now - 83_000, partial = "and then for the enterprise tier we still need", level = 0.7f, finalCount = 4)
        shot("record") { RecordScreen(state, s.segments, s.now, RecordActions()) }
        shot("record", dark = true) { RecordScreen(state, s.segments, s.now, RecordActions()) }
        shot("record-empty") { RecordScreen(RecorderState(RecorderState.Phase.LISTENING, 3, "", startedAt = s.now - 2_000), emptyList(), s.now, RecordActions()) }
    }

    @Test
    fun meetings() {
        val state = MeetingsState(
            loaded = true,
            days = s.meetings.groupBy { Days.ofMillis(it.startedAt) }.toList().sortedByDescending { it.first },
            total = s.meetings.size,
            actionCounts = mapOf(3L to 4, 1L to 1),
            summarizing = setOf(2L),
            today = s.today,
            series = s.series.associate { it.id to it.name },
        )
        shot("meetings") { MeetingsScreen(state, {}, {}, {}, {}, {}) }
        shot("meetings-empty") { MeetingsScreen(MeetingsState(loaded = true, today = s.today), {}, {}, {}, {}, {}) }
    }

    @Test
    fun meetingNotes() {
        val state = MeetingDetailState(
            loaded = true,
            meeting = s.meetings[0],
            analysis = s.analysis,
            segments = s.segments,
            tasks = s.tasks.filter { it.meetingId == 3L },
            questions = s.questions.take(1),
            today = s.today,
        )
        shot("meeting") { MeetingScreen(state, MeetingActions()) }
        shot("meeting", dark = true) { MeetingScreen(state, MeetingActions()) }
    }

    @Test
    fun meetingInASeries() {
        val byId = s.tasks.associateBy { it.id }
        val state = MeetingDetailState(
            loaded = true,
            meeting = s.meetings.first { it.id == 1L },
            analysis = s.priyaAnalysis,
            tasks = s.tasks.filter { it.meetingId == 1L },
            today = s.today,
            series = s.series[0],
            occurrence = 2,
            allSeries = s.series,
            earlier = s.priyaAnalysis.earlierItems.map { EarlierLine(byId.getValue(it.taskId), it.status, it.note) },
        )
        shot("meeting-series") { MeetingScreen(state, MeetingActions()) }
        shot("meeting-series", dark = true) { MeetingScreen(state, MeetingActions()) }
    }

    @Test
    fun recurringMeeting() {
        val meetings = s.meetings.filter { it.seriesId == 1L }.sortedByDescending { it.startedAt }
        val ids = meetings.map { it.id }
        val state = SeriesState(
            loaded = true,
            series = s.series[0],
            meetings = meetings,
            open = s.tasks.filter { it.meetingId in ids && it.status == com.personal.aide.data.db.TaskStatus.OPEN },
            today = s.today,
        )
        shot("series") { SeriesScreen(state, SeriesActions()) }
        shot("series", dark = true) { SeriesScreen(state, SeriesActions()) }
    }

    private fun personState(name: String, withAgenda: Boolean) = PersonState(
        loaded = true,
        person = buildPersonView(name, s.knowledge, s.tasks, s.meetings),
        meetingTitles = s.meetings.associate { it.id to it.title },
        agenda = if (withAgenda) s.danaAgenda else null,
        agendaId = 1,
        today = s.today,
    )

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h1900dp-420dpi")
    fun person() {
        shot("person") { PersonScreen(personState("Dana Whitfield", withAgenda = true), PersonActions()) }
        shot("person", dark = true) { PersonScreen(personState("Dana Whitfield", withAgenda = true), PersonActions()) }
        // Someone with no knowledge entry and no agenda yet, reached from a meeting's attendee list.
        shot("person-new") { PersonScreen(personState("Priya Nair", withAgenda = false), PersonActions()) }
    }

    private fun progressState() = ProgressState(
        loaded = true,
        goals = s.profile.goals.mapIndexed { index, goal -> GoalCard(goal, s.progress.goals[index], s.wins.count { it.goal == goal }) },
        wins = s.wins,
        updatedAt = s.now,
        today = s.today,
        lastReview = s.selfReview,
        lastReviewAt = s.now,
    )

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h2300dp-420dpi")
    fun goalsAndWins() {
        shot("progress") { ProgressScreen(progressState(), ProgressActions()) }
        shot("progress", dark = true) { ProgressScreen(progressState(), ProgressActions()) }
        shot("progress-empty") { ProgressScreen(ProgressState(loaded = true, today = s.today), ProgressActions()) }
        shot("self-review-text") {
            androidx.compose.material3.Surface {
                com.personal.aide.ui.components.AssistantText(s.selfReview.text, androidx.compose.ui.Modifier.padding(20.dp))
            }
        }
    }

    private fun prepState(eventIndex: Int): PrepState {
        val event = s.events[eventIndex]
        return PrepState(
            loaded = true,
            event = event,
            brief = buildPrepBrief(event.title, event.id, event.start, event.attendees, s.profile.name, s.meetings, s.tasks, s.series, s.knowledge),
            meetingTitles = s.meetings.associate { it.id to it.title },
            today = s.today,
            now = s.now,
        )
    }

    @Test
    fun beforeAMeeting() {
        shot("prep") { PrepScreen(prepState(0), PrepActions()) }
        shot("prep", dark = true) { PrepScreen(prepState(0), PrepActions()) }
        // A meeting Aide has never sat in on, with someone it knows nothing about.
        shot("prep-empty") { PrepScreen(prepState(1), PrepActions()) }
    }

    @Test
    fun aDocumentThatWasAdded() {
        val state = MeetingDetailState(
            loaded = true,
            meeting = s.meetings.first { it.id == 7L },
            analysis = s.guideAnalysis,
            today = s.today,
            learned = s.knowledge.filter { 7L in it.sourceMeetingIds },
        )
        shot("document") { MeetingScreen(state, MeetingActions()) }
        shot("document", dark = true) { MeetingScreen(state, MeetingActions()) }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h1100dp-420dpi")
    fun addingNotesDocumentsAndPhotos() {
        // The page pictures don't exist here, so their thumbnails show as blanks.
        val added = listOf(
            Material.Words("Planning notes.docx", "word ".repeat(1240)),
            Material.Pages("Carrier onboarding guide.pdf", List(14) { java.io.File("missing-$it.jpg") }),
            Material.Pages("Photos", List(3) { java.io.File("missing-photo-$it.jpg") }, photos = true),
        )
        shot("add-empty") { AddScreen(AddState(), "", AddActions()) }
        shot("add") { AddScreen(AddState(kind = AddKind.REFERENCE, materials = added), "", AddActions()) }
        shot("add", dark = true) { AddScreen(AddState(kind = AddKind.REFERENCE, materials = added), "", AddActions()) }
        shot("add-reading") {
            AddScreen(AddState(kind = AddKind.REFERENCE, materials = added, intake = IntakeState.Working(6, 17)), "", AddActions())
        }
        shot("add-no-key") {
            AddScreen(AddState(hasKey = false, error = "Pictures and PDFs are read by Claude. Add your API key in Settings first, or type the notes in."), "Standup: Dana said the rate feed fix is in review.", AddActions())
        }
    }

    @Test
    fun meetingWithoutNotes() {
        shot("meeting-pending") {
            MeetingScreen(MeetingDetailState(loaded = true, meeting = s.meetings[3], segments = s.segments, today = s.today, hasKey = false), MeetingActions())
        }
    }

    private fun tasksState() = TasksState(
        loaded = true,
        today = s.today,
        board = buildTaskBoard(s.tasks, s.today),
        tasksById = s.tasks.associateBy { it.id },
        meetingTitles = s.meetings.associate { it.id to it.title },
    )

    @Test
    fun tasks() {
        shot("tasks-today") { TasksScreen(tasksState(), TasksActions()) }
        shot("tasks-today", dark = true) { TasksScreen(tasksState(), TasksActions()) }
    }

    @Test
    fun knowledge() {
        val state = KnowledgeState(
            loaded = true,
            profile = s.profile,
            entries = s.knowledge,
            counts = s.knowledge.groupingBy { it.type }.eachCount(),
            total = s.knowledge.size,
        )
        shot("knowledge") { KnowledgeScreen(state, {}, {}, {}, {}, {}, {}) }
        shot("knowledge-empty") { KnowledgeScreen(KnowledgeState(loaded = true), {}, {}, {}, {}, {}, {}) }
        shot("entry") { EntryScreen(EntryState(loaded = true, entry = s.knowledge[0], sources = s.meetings.take(2)), {}, { _, _, _, _ -> }, {}, {}) }
    }

    @Test
    fun questions() {
        shot("questions") { QuestionsScreen(QuestionsState(true, s.questions, s.meetings.associate { it.id to it.title }), {}, { _, _ -> }, {}) }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h891dp-420dpi")
    fun ask() {
        shot("ask") { AskScreen(AskState(loaded = true, threadId = 1, messages = s.chat), AskActions()) }
        shot("ask", dark = true) { AskScreen(AskState(loaded = true, threadId = 1, messages = s.chat), AskActions()) }
        shot("ask-empty") { AskScreen(AskState(loaded = true), AskActions()) }
    }

    private fun insightsState(reviewed: Boolean) = InsightsState(
        loaded = true,
        today = s.today,
        weekStart = Days.weekStart(s.today),
        stats = workStats(s.tasks, s.meetings, Days.weekStart(s.today), Days.weekStart(s.today) + 6, s.today),
        review = if (reviewed) s.review else null,
        reviewId = 1,
        assistant = assistantStats(s.meetings, s.tasks, s.questions, s.chat, emptyList(), emptyList(), s.knowledge.size),
        goals = s.profile.goals.size,
        wins = s.wins.size,
        unloggedWins = if (reviewed) s.review.wins.drop(1) else emptyList(),
    )

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h2300dp-420dpi")
    fun insights() {
        shot("insights") { InsightsScreen(insightsState(reviewed = true), InsightsActions()) }
        shot("insights", dark = true) { InsightsScreen(insightsState(reviewed = true), InsightsActions()) }
        shot("insights-no-review") { InsightsScreen(insightsState(reviewed = false), InsightsActions()) }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h2100dp-420dpi")
    fun settings() {
        shot("settings") {
            SettingsScreen(SettingsState(loaded = true, hasKey = true, settings = com.personal.aide.data.Settings(calendarEnabled = true)), "1.0", SettingsActions())
        }
    }

    @Test
    @Config(sdk = [35], qualifiers = "w411dp-h891dp-420dpi")
    fun onboarding() {
        val interview = InterviewState(
            messages = listOf(
                com.personal.aide.data.db.ChatMessageEntity(1, 1, "assistant", "Hi Sam. To start: what does a normal week look like for you as a Senior Product Manager at Northwind?", s.now),
                com.personal.aide.data.db.ChatMessageEntity(2, 1, "user", "Mostly roadmap work for the shipper portal, plus a lot of meetings with sales and engineering.", s.now),
                com.personal.aide.data.db.ChatMessageEntity(3, 1, "assistant", "Got it. Which of those meetings would you most like help keeping on top of?", s.now),
            ),
            filledAreas = 6,
        )
        for (step in OnboardingStep.entries) {
            shot("onboarding-${step.name.lowercase()}") {
                OnboardingScreen(OnboardingState(step = step, profile = s.profile), interview, microphoneAllowed = false, OnboardingActions())
            }
        }
        shot("onboarding-welcome", dark = true) { OnboardingScreen(OnboardingState(), interview, false, OnboardingActions()) }
    }

    @Test
    fun knowledgeTypesHaveIcons() {
        // Every type draws without crashing; a broken path string would throw here.
        shot("knowledge-filtered") {
            KnowledgeScreen(
                KnowledgeState(loaded = true, profile = s.profile, filter = KnowledgeType.PERSON, entries = s.knowledge, counts = KnowledgeType.entries.associateWith { 1 }, total = 7),
                {}, {}, {}, {}, {}, {},
            )
        }
    }
}
