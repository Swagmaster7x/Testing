@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.interview

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.ui.components.AssistantBubble
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.ChatInput
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.UserBubble
import com.personal.aide.ui.components.Working
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class InterviewState(
    val messages: List<ChatMessageEntity> = emptyList(),
    val working: Boolean = false,
    val error: String? = null,
    /** The assistant has what it needs; the user can still add more. */
    val done: Boolean = false,
    val filledAreas: Int = 0,
)

/** The getting-to-know-you conversation, used in first-run setup and again from the profile. */
@OptIn(ExperimentalCoroutinesApi::class)
class InterviewViewModel(private val container: AppContainer) : ViewModel() {
    private val threadId = MutableStateFlow<Long?>(null)
    private val working = MutableStateFlow(false)
    private val error = MutableStateFlow<String?>(null)
    private val done = MutableStateFlow(false)

    val state: StateFlow<InterviewState> = combine(
        threadId.flatMapLatest { id -> if (id == null) flowOf(emptyList()) else container.db.chat().observeMessages(id) },
        working,
        error,
        done,
        container.settings.profile,
    ) { messages, working, error, done, profile ->
        InterviewState(messages, working, error, done, profile.filledAreas())
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), InterviewState())

    /** Opens the conversation: asks the first question, or picks up where it stopped. */
    fun begin() {
        if (threadId.value != null || working.value) return
        viewModelScope.launch {
            val id = container.assistant.interviewThread()
            threadId.value = id
            val messages = container.db.chat().messages(id)
            // Nothing said yet, or the user's last answer never got a reply: the assistant speaks next.
            if (messages.isEmpty() || messages.last().role == "user") turn(null)
        }
    }

    fun answer(text: String) {
        if (text.isBlank() || working.value) return
        turn(text)
    }

    fun retry() = turn(null)

    private fun turn(answer: String?) {
        val id = threadId.value ?: return
        working.value = true
        error.value = null
        viewModelScope.launch {
            try {
                done.value = container.assistant.interviewTurn(id, answer)
            } catch (e: LlmException) {
                error.value = e.message
            } finally {
                working.value = false
            }
        }
    }
}

/** The conversation itself, without a screen around it. */
@Composable
fun InterviewPane(state: InterviewState, onRetry: () -> Unit, modifier: Modifier = Modifier, contentPadding: PaddingValues = PaddingValues(16.dp)) {
    val listState = rememberLazyListState()
    val rows = state.messages.size + if (state.working || state.error != null) 1 else 0
    LaunchedEffect(rows) {
        if (rows > 0) listState.animateScrollToItem(rows - 1)
    }
    LazyColumn(modifier, state = listState, contentPadding = contentPadding, verticalArrangement = Arrangement.spacedBy(16.dp)) {
        items(state.messages, key = { it.id }) { message ->
            if (message.role == "user") UserBubble(message.text) else AssistantBubble(message.text)
        }
        if (state.working) item(key = "working") { Working("Aide is thinking…", Modifier.padding(start = 38.dp)) }
        state.error?.let { error ->
            item(key = "error") { Banner(error, tone = Tone.BAD, action = "Try again", onAction = onRetry) }
        }
    }
}

@Composable
fun InterviewScreen(state: InterviewState, onBack: () -> Unit, onAnswer: (String) -> Unit, onRetry: () -> Unit) {
    var draft by rememberSaveable { mutableStateOf("") }
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Getting to know your work") },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = { TextButton(onClick = onBack) { Text(if (state.done) "Done" else "Finish later") } },
            )
        },
        bottomBar = {
            ChatInput(
                value = draft,
                onValueChange = { draft = it },
                onSend = { onAnswer(draft); draft = "" },
                enabled = !state.working,
                placeholder = if (state.done) "Add anything else" else "Your answer (or \"skip\")",
            )
        },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            InterviewPane(state, onRetry, Modifier.fillMaxSize())
        }
    }
}
