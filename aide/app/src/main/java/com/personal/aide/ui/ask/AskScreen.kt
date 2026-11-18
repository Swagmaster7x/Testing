@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.ask

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.ChatThreadEntity
import com.personal.aide.domain.Days
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.AssistantBubble
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.ChatInput
import com.personal.aide.ui.components.RatingRow
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.UserBubble
import com.personal.aide.ui.components.Working

class AskActions(
    val onBack: () -> Unit = {},
    val onSend: (String) -> Unit = {},
    val onNewChat: () -> Unit = {},
    val onOpenThread: (ChatThreadEntity) -> Unit = {},
    val onDeleteThread: (ChatThreadEntity) -> Unit = {},
    val onRate: (ChatMessageEntity, Int) -> Unit = { _, _ -> },
    val onCopy: (String) -> Unit = {},
    val onSettings: () -> Unit = {},
)

val askSuggestions = listOf(
    "What should I focus on today?",
    "What did I commit to this week?",
    "Who am I waiting on, and for what?",
    "Draft a status update for my manager",
    "What's still open from my last meeting?",
)

val meetingSuggestions = listOf(
    "What did I agree to do?",
    "Summarize this for someone who wasn't there",
    "What was left undecided?",
)

@Composable
fun AskScreen(state: AskState, actions: AskActions) {
    var draft by rememberSaveable { mutableStateOf("") }
    var showHistory by remember { mutableStateOf(false) }
    val listState = rememberLazyListState()
    val rows = state.messages.size + (if (state.pending != null) 1 else 0) + (if (state.streaming != null) 1 else 0)
    LaunchedEffect(rows, (state.streaming?.length ?: 0) / 80) {
        if (rows > 0) listState.animateScrollToItem(rows - 1)
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("Ask Aide")
                        state.meetingTitle?.let {
                            Text(
                                "About \"$it\"",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = {
                    if (state.meetingTitle == null) {
                        if (state.history.isNotEmpty()) {
                            IconButton(onClick = { showHistory = true }) { Icon(AideIcons.History, contentDescription = "Earlier conversations") }
                        }
                        if (state.threadId != null) {
                            IconButton(onClick = actions.onNewChat) { Icon(Icons.Filled.Add, contentDescription = "New conversation") }
                        }
                    }
                },
            )
        },
        bottomBar = {
            ChatInput(
                value = draft,
                onValueChange = { draft = it },
                onSend = { actions.onSend(draft); draft = "" },
                enabled = state.hasKey && !state.working,
                placeholder = if (state.meetingTitle != null) "Ask about this meeting" else "Ask about your work",
            )
        },
    ) { padding ->
        if (rows == 0) {
            Column(Modifier.fillMaxSize().padding(padding).padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                if (!state.hasKey && state.loaded) {
                    Banner("Connect Claude to ask questions.", tone = Tone.ASSISTANT, icon = AideIcons.Key, action = "Set up", onAction = actions.onSettings)
                }
                Text(
                    "Aide answers from your meetings, your tasks and what it has learned about your work.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(4.dp))
                for (suggestion in if (state.meetingTitle != null) meetingSuggestions else askSuggestions) {
                    AideCard(onClick = { if (state.hasKey) actions.onSend(suggestion) }, padding = 14.dp) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                            Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(18.dp))
                            Text(suggestion, style = MaterialTheme.typography.bodyLarge)
                        }
                    }
                }
            }
            return@Scaffold
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            state = listState,
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            items(state.messages, key = { it.id }) { message ->
                if (message.role == "user") {
                    UserBubble(message.text)
                } else {
                    AssistantBubble(message.text, failed = message.failed) {
                        if (!message.failed) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                IconButton(onClick = { actions.onCopy(message.text) }) {
                                    Icon(AideIcons.Copy, contentDescription = "Copy", tint = MaterialTheme.colorScheme.outline, modifier = Modifier.size(18.dp))
                                }
                                RatingRow(message.rating, { actions.onRate(message, it) })
                            }
                        }
                    }
                }
            }
            state.pending?.let { question -> item(key = "pending") { UserBubble(question) } }
            state.streaming?.let { text ->
                item(key = "streaming") {
                    if (text.isBlank()) Working("Thinking…", Modifier.padding(start = 38.dp)) else AssistantBubble(text)
                }
            }
        }
    }

    if (showHistory) {
        ModalBottomSheet(onDismissRequest = { showHistory = false }) {
            Column(Modifier.fillMaxWidth().navigationBarsPadding()) {
                Text("Earlier conversations", style = MaterialTheme.typography.titleLarge, modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp))
                LazyColumn {
                    items(state.history, key = { it.id }) { thread ->
                        Row(
                            Modifier.fillMaxWidth().clickable { showHistory = false; actions.onOpenThread(thread) }.padding(start = 20.dp, end = 8.dp, top = 6.dp, bottom = 6.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            Column(Modifier.weight(1f)) {
                                Text(thread.title, style = MaterialTheme.typography.bodyLarge, maxLines = 1, overflow = TextOverflow.Ellipsis)
                                Text(Days.dateTime(thread.updatedAt), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                            }
                            IconButton(onClick = { actions.onDeleteThread(thread) }) {
                                Icon(Icons.Filled.Delete, contentDescription = "Delete this conversation", tint = MaterialTheme.colorScheme.outline)
                            }
                        }
                        HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                    }
                }
                Spacer(Modifier.height(16.dp))
            }
        }
    }
}
