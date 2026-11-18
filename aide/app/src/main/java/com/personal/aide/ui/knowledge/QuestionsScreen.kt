@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.knowledge

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.EmptyState
import com.personal.aide.ui.components.QuestionCard
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class QuestionsState(
    val loaded: Boolean = false,
    val questions: List<QuestionEntity> = emptyList(),
    val meetingTitles: Map<Long, String> = emptyMap(),
)

class QuestionsViewModel(private val container: AppContainer) : ViewModel() {
    val state: StateFlow<QuestionsState> = combine(
        container.db.questions().observeOpen(),
        container.db.meetings().observeAll(),
    ) { questions, meetings ->
        QuestionsState(loaded = true, questions = questions, meetingTitles = meetings.associate { it.id to it.title })
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), QuestionsState())

    fun answer(question: QuestionEntity, text: String) {
        viewModelScope.launch { container.questions.answer(question.id, text) }
    }

    fun skip(question: QuestionEntity) {
        viewModelScope.launch { container.questions.skip(question.id) }
    }
}

/** The assistant's open questions in one place. Each answer goes straight into the knowledge base. */
@Composable
fun QuestionsScreen(state: QuestionsState, onBack: () -> Unit, onAnswer: (QuestionEntity, String) -> Unit, onSkip: (QuestionEntity) -> Unit) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Aide's questions") },
                navigationIcon = { IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
            )
        },
    ) { padding ->
        if (state.loaded && state.questions.isEmpty()) {
            EmptyState(
                icon = AideIcons.Sparkle,
                title = "No questions right now",
                body = "When a meeting mentions someone or something Aide can't place, it asks here.",
                modifier = Modifier.padding(padding),
            )
            return@Scaffold
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding).imePadding(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item(key = "intro") {
                Text(
                    "Each answer is saved to the knowledge base, so Aide gets the next meeting right.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            items(state.questions, key = { it.id }) { question ->
                QuestionCard(
                    question = question,
                    onAnswer = { onAnswer(question, it) },
                    onSkip = { onSkip(question) },
                    source = question.meetingId?.let { state.meetingTitles[it] },
                )
            }
        }
    }
}
