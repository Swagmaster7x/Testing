@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.meetings

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.ui.TaskActionsViewModel
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.MeetingCard
import com.personal.aide.ui.components.Pill
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.TaskRow
import com.personal.aide.ui.components.TaskSheet
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.topAnchor
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class SeriesState(
    val loaded: Boolean = false,
    val series: SeriesEntity? = null,
    /** Newest first. */
    val meetings: List<MeetingEntity> = emptyList(),
    /** Open tasks that came out of these meetings, soonest due first. */
    val open: List<TaskEntity> = emptyList(),
    val summarizing: Set<Long> = emptySet(),
    val hasKey: Boolean = true,
    val today: Long = Days.today(),
)

class SeriesViewModel(container: AppContainer, private val seriesId: Long) : TaskActionsViewModel(container) {
    val state: StateFlow<SeriesState> = combine(
        container.db.series().observeAll(),
        container.db.meetings().observeAll(),
        container.db.tasks().observeAll(),
        container.processor.inProgress,
        container.secrets.hasKey,
    ) { series, meetings, tasks, summarizing, hasKey ->
        val mine = meetings.filter { it.seriesId == seriesId }.sortedByDescending { it.startedAt }
        val ids = mine.mapTo(HashSet()) { it.id }
        SeriesState(
            loaded = true,
            series = series.firstOrNull { it.id == seriesId },
            meetings = mine,
            open = tasks.filter { it.status == TaskStatus.OPEN && it.meetingId in ids && it.ownership != Ownership.UNCLEAR }
                .sortedBy { it.dueDay ?: Long.MAX_VALUE },
            summarizing = summarizing,
            hasKey = hasKey,
            today = Days.today(),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), SeriesState())

    fun rename(name: String) {
        viewModelScope.launch { container.series.rename(seriesId, name) }
    }

    fun delete(onDeleted: () -> Unit) {
        viewModelScope.launch {
            container.series.delete(seriesId)
            onDeleted()
        }
    }
}

class SeriesActions(
    val onBack: () -> Unit = {},
    val onRename: (String) -> Unit = {},
    val onDelete: () -> Unit = {},
    val onOpenMeeting: (Long) -> Unit = {},
    val onPrep: (String) -> Unit = {},
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
)

/** What to ask Aide before the next occurrence of [series]. */
fun seriesPrepPrompt(series: SeriesEntity): String =
    "Prep me for the next \"${series.name}\". What was decided last time, what is still open from earlier ones, and what should I raise?"

/** A recurring meeting read as one thread: what is still open from it, and every time it was held. */
@Composable
fun SeriesScreen(state: SeriesState, actions: SeriesActions) {
    val series = state.series
    var menu by remember { mutableStateOf(false) }
    var renaming by remember { mutableStateOf(false) }
    var deleting by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<TaskEntity?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(series?.name.orEmpty(), maxLines = 1, overflow = TextOverflow.Ellipsis) },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = {
                    if (series != null) {
                        IconButton(onClick = { menu = true }) { Icon(Icons.Filled.MoreVert, contentDescription = "More") }
                        DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                            DropdownMenuItem(text = { Text("Rename") }, onClick = { menu = false; renaming = true })
                            DropdownMenuItem(text = { Text("Stop treating as recurring") }, onClick = { menu = false; deleting = true })
                        }
                    }
                },
            )
        },
    ) { padding ->
        if (series == null) {
            if (state.loaded) {
                Text("This recurring meeting no longer exists.", modifier = Modifier.padding(padding).padding(24.dp), color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            return@Scaffold
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 0.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            topAnchor()
            item(key = "summary") {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Pill("Recurring meeting", tone = Tone.INFO, icon = AideIcons.Loop)
                    Text(
                        buildString {
                            append(if (state.meetings.size == 1) "Held once" else "Held ${state.meetings.size} times")
                            state.meetings.firstOrNull()?.let { append(" · last on ").append(Days.mediumDate(Days.ofMillis(it.startedAt))) }
                        },
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                    if (state.hasKey && state.meetings.isNotEmpty()) {
                        FilledTonalButton(onClick = { actions.onPrep(seriesPrepPrompt(series)) }) { Text("Prep for the next one") }
                    }
                }
            }

            item(key = "open-header") { SectionHeader(if (state.open.isEmpty()) "Still open from these meetings" else "Still open from these meetings (${state.open.size})") }
            if (state.open.isEmpty()) {
                item(key = "open-none") {
                    Text("Nothing is carried over. Everything that came out of these meetings is done.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
            } else {
                item(key = "open") {
                    val titles = state.meetings.associate { it.id to Days.mediumDate(Days.ofMillis(it.startedAt)) }
                    AideCard(padding = 0.dp) {
                        state.open.forEachIndexed { index, task ->
                            if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                            TaskRow(
                                task = task,
                                today = state.today,
                                onToggle = { actions.onToggle(task, it) },
                                onClick = { editing = task },
                                meetingTitle = task.meetingId?.let { titles[it] },
                            )
                        }
                    }
                }
            }

            item(key = "meetings-header") { SectionHeader("Every time it was held") }
            items(state.meetings, key = { "meeting-${it.id}" }) { meeting ->
                MeetingCard(meeting, summarizing = meeting.id in state.summarizing, onClick = { actions.onOpenMeeting(meeting.id) })
            }
        }
    }

    if (renaming && series != null) {
        var text by remember { mutableStateOf(series.name) }
        AlertDialog(
            onDismissRequest = { renaming = false },
            title = { Text("Rename recurring meeting") },
            text = {
                OutlinedTextField(
                    value = text,
                    onValueChange = { text = it },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                    supportingText = { Text("Give it the name of another recurring meeting to merge the two.") },
                )
            },
            confirmButton = { TextButton(onClick = { actions.onRename(text); renaming = false }, enabled = text.isNotBlank()) { Text("Save") } },
            dismissButton = { TextButton(onClick = { renaming = false }) { Text("Cancel") } },
        )
    }
    if (deleting) {
        AlertDialog(
            onDismissRequest = { deleting = false },
            title = { Text("Stop treating these as one meeting?") },
            text = { Text("The meetings, their notes and their tasks all stay. They just won't be linked to each other any more.") },
            confirmButton = { TextButton(onClick = { deleting = false; actions.onDelete() }) { Text("Unlink") } },
            dismissButton = { TextButton(onClick = { deleting = false }) { Text("Cancel") } },
        )
    }
    editing?.let { task ->
        TaskSheet(
            task = task,
            today = state.today,
            onDismiss = { editing = null },
            onSave = { actions.onSaveTask(it); editing = null },
            onDelete = { actions.onDeleteTask(it); editing = null },
            onDismissTask = { actions.onDismissTask(it); editing = null },
            meetingTitle = task.meetingId?.let { id -> state.meetings.firstOrNull { it.id == id }?.title },
            onOpenMeeting = { editing = null; actions.onOpenMeeting(it) },
        )
    }
}
