package com.personal.aide.ui.ask

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.data.db.ThreadKind
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

data class AskState(
    val loaded: Boolean = false,
    val threadId: Long? = null,
    val meetingTitle: String? = null,
    val messages: List<ChatMessageEntity> = emptyList(),
    /** The reply being written, piece by piece; null when nothing is on its way. */
    val streaming: String? = null,
    /** The question just sent, shown until the stored copy arrives. */
    val pending: String? = null,
    val hasKey: Boolean = true,
    val history: List<ChatThreadEntity> = emptyList(),
) {
    val working: Boolean get() = streaming != null
}

@OptIn(ExperimentalCoroutinesApi::class)
class AskViewModel(
    private val container: AppContainer,
    private val meetingId: Long?,
    initialPrompt: String?,
) : ViewModel() {
    private val threadId = MutableStateFlow<Long?>(null)
    private val streaming = MutableStateFlow<String?>(null)
    private val pending = MutableStateFlow<String?>(null)
    private val meetingTitle = MutableStateFlow<String?>(null)
    private var asking: Job? = null

    val state: StateFlow<AskState> = combine(
        threadId,
        threadId.flatMapLatest { id -> if (id == null) flowOf(emptyList()) else container.db.chat().observeMessages(id) },
        combine(streaming, pending, meetingTitle) { text, question, title -> Triple(text, question, title) },
        container.secrets.hasKey,
        container.db.chat().observeThreads(ThreadKind.ASK),
    ) { id, messages, live, hasKey, history ->
        AskState(
            loaded = true,
            threadId = id,
            meetingTitle = live.third,
            messages = messages,
            streaming = live.first,
            // Once the question is in the stored list there is no need to show it twice.
            pending = live.second?.takeIf { question -> messages.none { it.role == "user" && it.text == question } },
            hasKey = hasKey,
            history = history.filter { it.title.isNotBlank() },
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), AskState())

    init {
        viewModelScope.launch {
            if (meetingId != null) meetingTitle.value = container.db.meetings().get(meetingId)?.title
            initialPrompt?.trim()?.takeIf { it.isNotEmpty() }?.let { send(it) }
        }
    }

    fun send(question: String) {
        val clean = question.trim()
        if (clean.isEmpty() || streaming.value != null) return
        streaming.value = ""
        pending.value = clean
        asking = viewModelScope.launch {
            try {
                val id = threadId.value ?: container.assistant.newAskThread(meetingId).also { threadId.value = it }
                container.assistant.ask(id, clean) { piece -> streaming.update { (it ?: "") + piece } }
            } catch (_: LlmException) {
                // The failure is stored in the thread as a failed turn, which the list shows.
            } finally {
                streaming.value = null
                pending.value = null
            }
        }
    }

    fun newChat() {
        asking?.cancel()
        threadId.value = null
    }

    fun open(thread: ChatThreadEntity) {
        asking?.cancel()
        threadId.value = thread.id
    }

    fun delete(thread: ChatThreadEntity) {
        viewModelScope.launch {
            if (threadId.value == thread.id) threadId.value = null
            container.db.chat().deleteThread(thread)
        }
    }

    fun rate(message: ChatMessageEntity, rating: Int) {
        viewModelScope.launch { container.db.chat().rate(message.id, rating) }
    }
}
