@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.meetings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SmallFloatingActionButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.ContextBlocks
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.domain.Retrieval
import com.personal.aide.ai.IntakeState
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.EmptyState
import com.personal.aide.ui.components.MeetingCard
import com.personal.aide.ui.components.SectionHeader
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn

data class MeetingsState(
    val loaded: Boolean = false,
    val query: String = "",
    /** Day number to the meetings on it, newest day first. */
    val days: List<Pair<Long, List<MeetingEntity>>> = emptyList(),
    val total: Int = 0,
    val actionCounts: Map<Long, Int> = emptyMap(),
    val summarizing: Set<Long> = emptySet(),
    val today: Long = Days.today(),
    val recording: Boolean = false,
    /** The names of the recurring meetings, by id. */
    val series: Map<Long, String> = emptyMap(),
    /** Something the user added by hand is being read. */
    val intake: IntakeState = IntakeState.Idle,
)

class MeetingsViewModel(container: AppContainer) : ViewModel() {
    private val query = MutableStateFlow("")

    val state: StateFlow<MeetingsState> = combine(
        container.db.meetings().observeAll(),
        container.db.tasks().observeAll(),
        query,
        combine(container.processor.inProgress, container.db.series().observeAll(), container.intake.state) { busy, series, intake ->
            Triple(busy, series.associate { it.id to it.name }, intake)
        },
        container.recorder.state,
    ) { meetings, tasks, query, (summarizing, series, intake), recorder ->
        val shown = if (query.isBlank()) {
            meetings
        } else {
            // Anything typed is matched against the notes as well as the title.
            val ranked = Retrieval.rank(
                query,
                meetings.map { Retrieval.Doc(it, it.title + " " + it.attendees.joinToString(" "), ContextBlocks.searchText(it)) },
            ).map { it.item }
            (meetings.filter { it.title.contains(query.trim(), ignoreCase = true) } + ranked).distinctBy { it.id }
        }
        MeetingsState(
            loaded = true,
            query = query,
            days = shown.groupBy { Days.ofMillis(it.startedAt) }.toList().let { groups -> if (query.isBlank()) groups.sortedByDescending { it.first } else groups },
            total = meetings.size,
            actionCounts = tasks.filter { it.status == TaskStatus.OPEN && it.meetingId != null }.groupingBy { it.meetingId!! }.eachCount(),
            summarizing = summarizing,
            today = Days.today(),
            recording = recorder.active,
            series = series,
            intake = intake,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), MeetingsState())

    fun search(text: String) {
        query.value = text
    }
}

fun dayHeading(day: Long, today: Long): String = when (day) {
    today -> "Today"
    today - 1 -> "Yesterday"
    else -> Days.longDate(day).substringBeforeLast(' ')
}

@Composable
fun MeetingsScreen(
    state: MeetingsState,
    onSearch: (String) -> Unit,
    onOpen: (Long) -> Unit,
    onRecord: () -> Unit,
    onImport: () -> Unit,
    onAsk: () -> Unit,
) {
    Scaffold(
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = { Text("Meetings") },
                actions = { IconButton(onClick = onAsk) { Icon(AideIcons.Sparkle, contentDescription = "Ask Aide") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        floatingActionButton = {
            Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SmallFloatingActionButton(onClick = onImport) { Icon(AideIcons.Note, contentDescription = "Add notes, a document or photos") }
                if (!state.recording) {
                    ExtendedFloatingActionButton(
                        onClick = onRecord,
                        icon = { Icon(AideIcons.Mic, contentDescription = null) },
                        text = { Text("Record meeting") },
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary,
                    )
                }
            }
        },
    ) { padding ->
        if (state.loaded && state.total == 0) {
            EmptyState(
                icon = AideIcons.Meetings,
                title = "No meetings yet",
                body = "Record one, or add your own notes: typed, pasted, a document, or photos of what you wrote down. Aide writes up the summary, the decisions and the action items.",
                modifier = Modifier.padding(padding),
                action = "Record a meeting",
                onAction = onRecord,
            )
            return@Scaffold
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 160.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            (state.intake as? IntakeState.Working)?.let { reading ->
                item(key = "intake") {
                    Banner(
                        if (reading.total == 0) "Saving what you added…" else "Reading what you added: page ${minOf(reading.done + 1, reading.total)} of ${reading.total}…",
                        tone = Tone.ASSISTANT,
                        icon = AideIcons.Sparkle,
                    )
                }
            }
            item(key = "search") {
                OutlinedTextField(
                    value = state.query,
                    onValueChange = onSearch,
                    placeholder = { Text("Search meetings and notes") },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null) },
                    singleLine = true,
                    shape = MaterialTheme.shapes.extraLarge,
                    modifier = Modifier.fillMaxWidth(),
                )
            }
            if (state.days.isEmpty() && state.query.isNotBlank()) {
                item(key = "none") {
                    Text(
                        "No meeting matches \"${state.query.trim()}\".",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(16.dp),
                    )
                }
            }
            for ((day, meetings) in state.days) {
                item(key = "day-$day") { SectionHeader(dayHeading(day, state.today)) }
                items(meetings, key = { it.id }) { meeting ->
                    MeetingCard(
                        meeting = meeting,
                        summarizing = meeting.id in state.summarizing,
                        onClick = { onOpen(meeting.id) },
                        actionCount = state.actionCounts[meeting.id] ?: 0,
                        series = meeting.seriesId?.let { state.series[it] },
                    )
                }
            }
        }
    }
}
