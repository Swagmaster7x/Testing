package com.personal.aide.ui.insights

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.AideJson
import com.personal.aide.data.WeekReview
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.UsageEntity
import com.personal.aide.domain.AssistantStats
import com.personal.aide.domain.Days
import com.personal.aide.domain.WorkStats
import com.personal.aide.domain.assistantStats
import com.personal.aide.domain.workStats
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class InsightsState(
    val loaded: Boolean = false,
    val today: Long = Days.today(),
    val weekStart: Long = Days.weekStart(Days.today()),
    val stats: WorkStats = workStats(emptyList(), emptyList(), Days.weekStart(Days.today()), Days.weekStart(Days.today()) + 6, Days.today()),
    val review: WeekReview? = null,
    val reviewId: Long? = null,
    val reviewRating: Int = 0,
    val reviewing: Boolean = false,
    val reviewError: String? = null,
    val hasKey: Boolean = true,
    val assistant: AssistantStats = assistantStats(emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), emptyList(), 0),
    /** How many goals the profile holds and how many wins are logged, for the way in to Goals & wins. */
    val goals: Int = 0,
    val wins: Int = 0,
) {
    val isThisWeek: Boolean get() = weekStart == Days.weekStart(today)
}

class InsightsViewModel(private val container: AppContainer) : ViewModel() {
    private val today = MutableStateFlow(Days.today())
    private val weekStart = MutableStateFlow(Days.weekStart(Days.today()))
    private val reviewing = MutableStateFlow(false)
    private val reviewError = MutableStateFlow<String?>(null)

    private data class Work(val tasks: List<TaskEntity>, val meetings: List<MeetingEntity>, val questions: List<QuestionEntity>, val messages: List<ChatMessageEntity>)
    private data class Extras(val insights: List<InsightEntity>, val usage: List<UsageEntity>, val knowledge: Int, val hasKey: Boolean)
    private data class View(val today: Long, val weekStart: Long, val reviewing: Boolean, val error: String?)

    private val work = combine(
        container.db.tasks().observeAll(),
        container.db.meetings().observeAll(),
        container.db.questions().observeAll(),
        container.db.chat().observeAllMessages(),
    ) { tasks, meetings, questions, messages -> Work(tasks, meetings, questions, messages) }

    private val extras = combine(
        container.db.insights().observeAll(),
        // The last thirty days of calls, for the running cost.
        container.db.usage().observeSince(System.currentTimeMillis() - 30L * 86_400_000L),
        container.db.knowledge().observeCount(),
        container.secrets.hasKey,
    ) { insights, usage, knowledge, hasKey -> Extras(insights, usage, knowledge, hasKey) }

    private val view = combine(today, weekStart, reviewing, reviewError) { today, week, busy, error -> View(today, week, busy, error) }

    private val progress = combine(container.settings.profile, container.db.wins().observeAll()) { profile, wins -> profile.goals.size to wins.size }

    val state: StateFlow<InsightsState> = combine(work, extras, view, progress) { work, extras, view, progress ->
        val stored = extras.insights.firstOrNull { it.kind == InsightKind.WEEK_REVIEW && it.periodStart == view.weekStart }
        InsightsState(
            loaded = true,
            today = view.today,
            weekStart = view.weekStart,
            stats = workStats(work.tasks, work.meetings, view.weekStart, view.weekStart + 6, view.today),
            review = stored?.let { runCatching { AideJson.decodeFromString(WeekReview.serializer(), it.json) }.getOrNull() },
            reviewId = stored?.id,
            reviewRating = stored?.rating ?: 0,
            reviewing = view.reviewing,
            reviewError = view.error,
            hasKey = extras.hasKey,
            goals = progress.first,
            wins = progress.second,
            assistant = assistantStats(work.meetings, work.tasks, work.questions, work.messages, extras.insights, extras.usage, extras.knowledge),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), InsightsState())

    fun refresh() {
        today.value = Days.today()
    }

    fun previousWeek() {
        weekStart.value -= 7
        reviewError.value = null
    }

    fun nextWeek() {
        if (weekStart.value < Days.weekStart(today.value)) weekStart.value += 7
        reviewError.value = null
    }

    fun review() {
        if (reviewing.value) return
        reviewing.value = true
        reviewError.value = null
        val week = weekStart.value
        viewModelScope.launch {
            try {
                container.assistant.reviewWeek(week)
            } catch (e: LlmException) {
                reviewError.value = e.message
            } finally {
                reviewing.value = false
            }
        }
    }

    fun rateReview(rating: Int) {
        val id = state.value.reviewId ?: return
        viewModelScope.launch { container.db.insights().rate(id, rating) }
    }

    fun dismissError() {
        reviewError.value = null
    }
}
