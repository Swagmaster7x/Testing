package com.personal.aide.ui.meetings

import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.ContextBlocks
import com.personal.aide.ai.LlmException
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.SegmentEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.ui.TaskActionsViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class FollowUp(val text: String = "", val working: Boolean = false, val error: String? = null)

data class MeetingDetailState(
    val loaded: Boolean = false,
    val meeting: MeetingEntity? = null,
    val analysis: MeetingAnalysis? = null,
    val segments: List<SegmentEntity> = emptyList(),
    val tasks: List<TaskEntity> = emptyList(),
    val questions: List<QuestionEntity> = emptyList(),
    val summarizing: Boolean = false,
    val hasKey: Boolean = true,
    val today: Long = Days.today(),
    val followUp: FollowUp? = null,
)

class MeetingViewModel(container: AppContainer, private val meetingId: Long) : TaskActionsViewModel(container) {
    private val followUp = MutableStateFlow<FollowUp?>(null)
    private var drafting: Job? = null

    private data class Stored(
        val meeting: MeetingEntity?,
        val segments: List<SegmentEntity>,
        val tasks: List<TaskEntity>,
        val questions: List<QuestionEntity>,
    )

    private val stored = combine(
        container.db.meetings().observe(meetingId),
        container.db.meetings().observeSegments(meetingId),
        container.db.tasks().observeForMeeting(meetingId),
        container.db.questions().observeForMeeting(meetingId),
    ) { meeting, segments, tasks, questions -> Stored(meeting, segments, tasks, questions) }

    val state: StateFlow<MeetingDetailState> = combine(
        stored,
        container.processor.inProgress,
        container.secrets.hasKey,
        followUp,
    ) { stored, summarizing, hasKey, followUp ->
        MeetingDetailState(
            loaded = true,
            meeting = stored.meeting,
            analysis = stored.meeting?.let { ContextBlocks.analysisOf(it) },
            segments = stored.segments,
            tasks = stored.tasks.filter { it.status != TaskStatus.DISMISSED },
            questions = stored.questions.filter { it.status == QuestionStatus.OPEN },
            summarizing = meetingId in summarizing,
            hasKey = hasKey,
            today = Days.today(),
            followUp = followUp,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), MeetingDetailState())

    fun summarize(force: Boolean = false) = container.processor.summarize(meetingId, force)

    fun rename(title: String) {
        viewModelScope.launch { container.meetings.rename(meetingId, title) }
    }

    fun rate(rating: Int) {
        viewModelScope.launch { container.meetings.rate(meetingId, rating) }
    }

    fun delete(onDeleted: () -> Unit) {
        viewModelScope.launch {
            container.meetings.delete(meetingId)
            onDeleted()
        }
    }

    fun answer(question: QuestionEntity, text: String) {
        viewModelScope.launch { container.questions.answer(question.id, text) }
    }

    fun skip(question: QuestionEntity) {
        viewModelScope.launch { container.questions.skip(question.id) }
    }

    fun draftFollowUp() {
        drafting?.cancel()
        followUp.value = FollowUp(working = true)
        drafting = viewModelScope.launch {
            try {
                val text = container.assistant.draftFollowUp(meetingId) { piece ->
                    followUp.update { it?.copy(text = it.text + piece) }
                }
                followUp.value = FollowUp(text = text)
            } catch (e: LlmException) {
                followUp.value = FollowUp(error = e.message)
            }
        }
    }

    fun closeFollowUp() {
        drafting?.cancel()
        followUp.value = null
    }
}
