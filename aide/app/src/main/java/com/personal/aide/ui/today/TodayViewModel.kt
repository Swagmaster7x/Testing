package com.personal.aide.ui.today

import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.AideJson
import com.personal.aide.data.DayPlan
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.TaskBoard
import com.personal.aide.domain.buildTaskBoard
import com.personal.aide.transcribe.RecorderState
import com.personal.aide.ui.TaskActionsViewModel
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class TodayState(
    val loaded: Boolean = false,
    val name: String = "",
    val today: Long = Days.today(),
    val now: Long = System.currentTimeMillis(),
    val hasKey: Boolean = true,
    val recorder: RecorderState = RecorderState(),
    val board: TaskBoard = buildTaskBoard(emptyList(), Days.today()),
    val tasksById: Map<Long, TaskEntity> = emptyMap(),
    val meetingTitles: Map<Long, String> = emptyMap(),
    val calendarConnected: Boolean = false,
    val events: List<CalendarEvent> = emptyList(),
    val plan: DayPlan? = null,
    val planId: Long? = null,
    val planRating: Int = 0,
    val planning: Boolean = false,
    val planError: String? = null,
    val openQuestions: Int = 0,
    val recentMeetings: List<MeetingEntity> = emptyList(),
    val summarizing: Set<Long> = emptySet(),
)

@OptIn(ExperimentalCoroutinesApi::class)
class TodayViewModel(container: AppContainer) : TaskActionsViewModel(container) {
    private val day = MutableStateFlow(Days.today())
    private val clock = MutableStateFlow(System.currentTimeMillis())
    private val events = MutableStateFlow<List<CalendarEvent>>(emptyList())
    private val planning = MutableStateFlow(false)
    private val planError = MutableStateFlow<String?>(null)

    private data class People(val name: String, val hasKey: Boolean, val recorder: RecorderState, val calendar: Boolean)
    private data class Work(val tasks: List<TaskEntity>, val meetings: List<MeetingEntity>, val questions: Int, val summarizing: Set<Long>)
    private data class Planning(val day: Long, val now: Long, val events: List<CalendarEvent>, val plan: Triple<DayPlan?, Long?, Int>, val busy: Pair<Boolean, String?>)

    private val people = combine(
        container.settings.profile,
        container.secrets.hasKey,
        container.recorder.state,
        container.settings.settings,
    ) { profile, hasKey, recorder, settings -> People(profile.name, hasKey, recorder, settings.calendarEnabled) }

    private val work = combine(
        container.db.tasks().observeAll(),
        container.db.meetings().observeAll(),
        container.db.questions().observeOpen(),
        container.processor.inProgress,
    ) { tasks, meetings, questions, summarizing -> Work(tasks, meetings, questions.size, summarizing) }

    private val plan = day.flatMapLatest { container.db.insights().observe(InsightKind.DAY_PLAN, it) }

    private val planningState = combine(
        day,
        clock,
        events,
        plan,
        combine(planning, planError) { busy, error -> busy to error },
    ) { day, now, events, insight, busy ->
        val decoded = insight?.let { runCatching { AideJson.decodeFromString(DayPlan.serializer(), it.json) }.getOrNull() }
        Planning(day, now, events, Triple(decoded, insight?.id, insight?.rating ?: 0), busy)
    }

    val state: StateFlow<TodayState> = combine(people, work, planningState) { people, work, planning ->
        TodayState(
            loaded = true,
            name = people.name,
            today = planning.day,
            now = planning.now,
            hasKey = people.hasKey,
            recorder = people.recorder,
            board = buildTaskBoard(work.tasks, planning.day),
            tasksById = work.tasks.associateBy { it.id },
            meetingTitles = work.meetings.associate { it.id to it.title },
            calendarConnected = people.calendar,
            events = planning.events,
            plan = planning.plan.first,
            planId = planning.plan.second,
            planRating = planning.plan.third,
            planning = planning.busy.first,
            planError = planning.busy.second,
            openQuestions = work.questions,
            recentMeetings = work.meetings.take(3),
            summarizing = work.summarizing,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TodayState())

    /** Called whenever the screen comes back into view: the date may have changed, and so may the calendar. */
    fun refresh() {
        val today = Days.today()
        day.value = today
        clock.value = System.currentTimeMillis()
        viewModelScope.launch {
            events.value = container.agenda.events(Days.startMillis(today), Days.startMillis(today + 1))
        }
    }

    fun planDay() {
        if (planning.value) return
        planning.value = true
        planError.value = null
        viewModelScope.launch {
            try {
                container.assistant.planDay(day.value)
            } catch (e: LlmException) {
                planError.value = e.message
            } finally {
                planning.value = false
            }
        }
    }

    fun ratePlan(rating: Int) {
        val id = state.value.planId ?: return
        viewModelScope.launch { container.db.insights().rate(id, rating) }
    }

    fun addTaskForToday(title: String) {
        viewModelScope.launch { container.tasks.add(title = title, dueDay = day.value) }
    }

    fun dismissPlanError() {
        planError.value = null
    }
}
