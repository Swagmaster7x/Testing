@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.meetings

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.selection.selectable
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.RadioButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.AssistantText
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.Bullet
import com.personal.aide.ui.components.BulletSection
import com.personal.aide.ui.components.Pill
import com.personal.aide.ui.components.QuestionCard
import com.personal.aide.ui.components.RatingRow
import com.personal.aide.ui.components.TaskRow
import com.personal.aide.ui.components.TaskSheet
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.components.meetingWhen
import com.personal.aide.ui.components.topAnchor
import com.personal.aide.ui.record.SegmentRow

class MeetingActions(
    val onBack: () -> Unit = {},
    val onSummarize: (force: Boolean) -> Unit = {},
    val onRename: (String) -> Unit = {},
    val onDelete: () -> Unit = {},
    val onRate: (Int) -> Unit = {},
    val onShare: () -> Unit = {},
    val onAsk: () -> Unit = {},
    val onSettings: () -> Unit = {},
    val onOpenRecording: () -> Unit = {},
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
    val onOwnership: (TaskEntity, Ownership) -> Unit = { _, _ -> },
    val onAnswer: (QuestionEntity, String) -> Unit = { _, _ -> },
    val onSkip: (QuestionEntity) -> Unit = {},
    val onDraftFollowUp: () -> Unit = {},
    val onCloseFollowUp: () -> Unit = {},
    val onCopy: (String) -> Unit = {},
    val onShareText: (String) -> Unit = {},
    val onOpenSeries: (Long) -> Unit = {},
    val onOpenPerson: (String) -> Unit = {},
    /** The recurring meeting to put this one in, or null to take it out. */
    val onSetSeries: (Long?) -> Unit = {},
    val onNewSeries: (String) -> Unit = {},
)

@Composable
fun MeetingScreen(state: MeetingDetailState, actions: MeetingActions) {
    val meeting = state.meeting
    var tab by rememberSaveable { mutableIntStateOf(0) }
    var menu by remember { mutableStateOf(false) }
    var renaming by remember { mutableStateOf(false) }
    var deleting by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<TaskEntity?>(null) }
    var adding by remember { mutableStateOf(false) }
    var choosingSeries by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(meeting?.title.orEmpty(), maxLines = 1, overflow = TextOverflow.Ellipsis) },
                navigationIcon = {
                    IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") }
                },
                actions = {
                    if (meeting != null) {
                        IconButton(onClick = actions.onShare) { Icon(Icons.Filled.Share, contentDescription = "Share the notes") }
                        IconButton(onClick = { menu = true }) { Icon(Icons.Filled.MoreVert, contentDescription = "More") }
                        DropdownMenu(expanded = menu, onDismissRequest = { menu = false }) {
                            DropdownMenuItem(text = { Text("Rename") }, onClick = { menu = false; renaming = true })
                            if (meeting.status != MeetingStatus.RECORDING) {
                                DropdownMenuItem(text = { Text("Recurring meeting…") }, onClick = { menu = false; choosingSeries = true })
                            }
                            if (state.hasKey && meeting.status != MeetingStatus.RECORDING && !state.summarizing) {
                                DropdownMenuItem(
                                    text = { Text(if (meeting.status == MeetingStatus.READY) "Write the notes again" else "Write the notes") },
                                    onClick = { menu = false; actions.onSummarize(true) },
                                )
                            }
                            DropdownMenuItem(text = { Text("Delete meeting") }, onClick = { menu = false; deleting = true })
                        }
                    }
                },
            )
        },
    ) { padding ->
        if (meeting == null) {
            if (state.loaded) {
                Text("This meeting no longer exists.", modifier = Modifier.padding(padding).padding(24.dp), color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            return@Scaffold
        }
        Column(Modifier.fillMaxSize().padding(padding)) {
            PrimaryTabRow(selectedTabIndex = tab, containerColor = MaterialTheme.colorScheme.background) {
                Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text("Notes") })
                Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text(if (state.tasks.isEmpty()) "Actions" else "Actions (${state.tasks.size})") })
                Tab(selected = tab == 2, onClick = { tab = 2 }, text = { Text("Transcript") })
            }
            when (tab) {
                0 -> NotesTab(state, meeting, actions)
                1 -> ActionsTab(state, actions, onEdit = { editing = it }, onAdd = { adding = true })
                else -> TranscriptTab(state)
            }
        }
    }

    if (renaming && meeting != null) {
        RenameDialog(meeting.title, onDismiss = { renaming = false }, onSave = { actions.onRename(it); renaming = false })
    }
    if (deleting) {
        AlertDialog(
            onDismissRequest = { deleting = false },
            title = { Text("Delete this meeting?") },
            text = { Text("Its transcript and notes are removed for good. Tasks and knowledge that came from it stay.") },
            confirmButton = { TextButton(onClick = { deleting = false; actions.onDelete() }) { Text("Delete", color = MaterialTheme.colorScheme.error) } },
            dismissButton = { TextButton(onClick = { deleting = false }) { Text("Cancel") } },
        )
    }
    val current = editing
    if (current != null || adding) {
        TaskSheet(
            task = current,
            today = state.today,
            onDismiss = { editing = null; adding = false },
            onSave = { actions.onSaveTask(it); editing = null; adding = false },
            onDelete = { actions.onDeleteTask(it); editing = null },
            onDismissTask = { actions.onDismissTask(it); editing = null },
        )
    }
    state.followUp?.let { FollowUpSheet(it, actions) }
    if (choosingSeries && meeting != null) {
        SeriesDialog(
            current = state.series,
            all = state.allSeries,
            suggestion = meeting.title,
            hasNotes = meeting.status == MeetingStatus.READY,
            onDismiss = { choosingSeries = false },
            onChoose = { actions.onSetSeries(it); choosingSeries = false },
            onNew = { actions.onNewSeries(it); choosingSeries = false },
        )
    }
}

@Composable
private fun StatusBlock(state: MeetingDetailState, meeting: MeetingEntity, actions: MeetingActions) {
    when {
        state.summarizing || meeting.status == MeetingStatus.PROCESSING ->
            AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) { Working("Aide is writing the notes…") }
        meeting.status == MeetingStatus.RECORDING ->
            Banner("This meeting is still being recorded.", tone = Tone.BAD, action = "Open", onAction = actions.onOpenRecording)
        meeting.status == MeetingStatus.FAILED ->
            Banner(meeting.error.ifBlank { "The notes couldn't be written." }, tone = Tone.BAD, action = "Try again", onAction = { actions.onSummarize(true) })
        meeting.status == MeetingStatus.TRANSCRIBED && !state.hasKey ->
            Banner("Add your Claude API key to get notes for this meeting.", tone = Tone.ASSISTANT, icon = AideIcons.Key, action = "Set up", onAction = actions.onSettings)
        meeting.status == MeetingStatus.TRANSCRIBED && meeting.error.isNotBlank() ->
            Banner(meeting.error, tone = Tone.WARN, action = "Try anyway", onAction = { actions.onSummarize(true) })
        meeting.status == MeetingStatus.TRANSCRIBED ->
            Banner("No notes have been written for this meeting yet.", tone = Tone.ASSISTANT, icon = AideIcons.Sparkle, action = "Write notes", onAction = { actions.onSummarize(false) })
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun NotesTab(state: MeetingDetailState, meeting: MeetingEntity, actions: MeetingActions) {
    val analysis = state.analysis
    LazyColumn(
        Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item(key = "meta") {
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(meetingWhen(meeting), style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                if (meeting.attendees.isNotEmpty() || meeting.meetingType.isNotBlank()) {
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        if (meeting.meetingType.isNotBlank()) Pill(meeting.meetingType.replaceFirstChar { it.uppercase() }, tone = Tone.INFO)
                        for (person in meeting.attendees.take(12)) {
                            Pill(person, Modifier.clip(RoundedCornerShape(50)).clickable(onClickLabel = "Open $person") { actions.onOpenPerson(person) })
                        }
                    }
                }
                state.series?.let { series ->
                    Pill(
                        series.name + if (state.occurrence > 0) " · no. ${state.occurrence}" else "",
                        Modifier.clip(RoundedCornerShape(50)).clickable(onClickLabel = "Open the recurring meeting") { actions.onOpenSeries(series.id) },
                        tone = Tone.INFO,
                        icon = AideIcons.Loop,
                    )
                }
            }
        }
        item(key = "status") { StatusBlock(state, meeting, actions) }
        if (analysis != null && meeting.status == MeetingStatus.READY) {
            if (analysis.transcriptQuality == "poor") {
                item(key = "quality") {
                    Banner("Much of this recording was hard to make out, so the notes may have gaps. Check them against what you remember.", tone = Tone.WARN)
                }
            }
            item(key = "tldr") {
                AideCard(container = MaterialTheme.colorScheme.primaryContainer) {
                    Text("In short", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    Spacer(Modifier.height(6.dp))
                    Text(meeting.tldr, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onPrimaryContainer)
                }
            }
            if (state.series != null && (analysis.sinceLastTime.isNotEmpty() || state.earlier.isNotEmpty())) {
                item(key = "since") { SinceLastTimeCard(analysis.sinceLastTime, state.earlier, actions) }
            }
            if (analysis.keyPoints.isNotEmpty()) item(key = "points") { AideCard { BulletSection("Key points", analysis.keyPoints) } }
            if (analysis.decisions.isNotEmpty()) item(key = "decisions") { AideCard { BulletSection("Decisions", analysis.decisions, tone = Tone.GOOD) } }
            if (analysis.openQuestions.isNotEmpty()) item(key = "open") { AideCard { BulletSection("Still open", analysis.openQuestions, tone = Tone.ASSISTANT) } }
            if (analysis.risks.isNotEmpty()) item(key = "risks") { AideCard { BulletSection("Risks and concerns", analysis.risks, tone = Tone.WARN) } }
            items(state.questions, key = { "question-${it.id}" }) { question ->
                QuestionCard(question, onAnswer = { actions.onAnswer(question, it) }, onSkip = { actions.onSkip(question) })
            }
            item(key = "buttons") {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    FilledTonalButton(onClick = actions.onDraftFollowUp, modifier = Modifier.weight(1f)) { Text("Draft follow-up") }
                    OutlinedButton(onClick = actions.onAsk, modifier = Modifier.weight(1f)) { Text("Ask about it") }
                }
            }
            item(key = "rating") {
                RatingRow(meeting.rating, actions.onRate, Modifier.fillMaxWidth(), label = "Did Aide get this meeting right? Your answer shows up under Insights.")
            }
        } else if (meeting.status == MeetingStatus.TRANSCRIBED && state.segments.isEmpty()) {
            item(key = "empty") {
                Text(
                    "Nothing was captured in this recording.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

/** How a line about an earlier action item reads, and how loudly. */
fun earlierStatusLabel(line: EarlierLine): Pair<String, Tone> = when (line.status) {
    "done" -> "Done" to Tone.GOOD
    "dropped" -> "Dropped" to Tone.NEUTRAL
    else -> "Still open" to Tone.WARN
}

/** What has moved since the previous meeting in the series, and where its action items stand. */
@Composable
private fun SinceLastTimeCard(lines: List<String>, earlier: List<EarlierLine>, actions: MeetingActions) {
    AideCard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(AideIcons.Loop, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(18.dp))
                Text("Since last time", style = MaterialTheme.typography.titleSmall)
            }
            for (line in lines) Bullet(line)
            if (earlier.isNotEmpty()) {
                if (lines.isNotEmpty()) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                Text("From earlier meetings", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                for (line in earlier) {
                    val (label, tone) = earlierStatusLabel(line)
                    Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(verticalAlignment = Alignment.Top, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(line.task.title, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.weight(1f))
                            Pill(label, tone = tone)
                        }
                        if (line.note.isNotBlank()) {
                            Text(line.note, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        // The meeting said it was finished or abandoned, but it is still on the list: one tap settles it.
                        if (line.task.status == TaskStatus.OPEN && line.status == "done") {
                            TextButton(onClick = { actions.onToggle(line.task, true) }, contentPadding = PaddingValues(0.dp)) { Text("Mark it done") }
                        } else if (line.task.status == TaskStatus.OPEN && line.status == "dropped") {
                            TextButton(onClick = { actions.onDismissTask(line.task) }, contentPadding = PaddingValues(0.dp)) { Text("Take it off my list") }
                        }
                    }
                }
            }
        }
    }
}

/** Choosing which recurring meeting this one belongs to. */
@Composable
private fun SeriesDialog(
    current: SeriesEntity?,
    all: List<SeriesEntity>,
    suggestion: String,
    hasNotes: Boolean,
    onDismiss: () -> Unit,
    onChoose: (Long?) -> Unit,
    onNew: (String) -> Unit,
) {
    // -1 stands for "a new one", 0 for "none".
    var choice by remember { mutableLongStateOf(current?.id ?: 0L) }
    var name by remember { mutableStateOf(suggestion) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Recurring meeting") },
        text = {
            Column(Modifier.verticalScroll(rememberScrollState())) {
                Text(
                    "Meetings that repeat are read as one thread: notes open with what has moved since last time, and unfinished items carry over." +
                        if (hasNotes) " These notes are already written; use \"Write the notes again\" to have them compared with last time." else "",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Spacer(Modifier.height(8.dp))
                SeriesOption("Not a recurring meeting", choice == 0L) { choice = 0L }
                for (series in all) SeriesOption(series.name, choice == series.id) { choice = series.id }
                SeriesOption("A new one…", choice == -1L) { choice = -1L }
                if (choice == -1L) {
                    OutlinedTextField(
                        value = name,
                        onValueChange = { name = it },
                        singleLine = true,
                        label = { Text("What it's called") },
                        modifier = Modifier.fillMaxWidth().padding(top = 4.dp),
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                    )
                }
            }
        },
        confirmButton = {
            TextButton(
                enabled = choice != -1L || name.isNotBlank(),
                onClick = { if (choice == -1L) onNew(name) else onChoose(choice.takeIf { it > 0 }) },
            ) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
private fun SeriesOption(label: String, selected: Boolean, onClick: () -> Unit) {
    Row(
        Modifier.fillMaxWidth().selectable(selected = selected, role = Role.RadioButton, onClick = onClick).padding(vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        RadioButton(selected = selected, onClick = null, modifier = Modifier.padding(10.dp))
        Text(label, style = MaterialTheme.typography.bodyLarge, maxLines = 2, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
private fun ActionsTab(state: MeetingDetailState, actions: MeetingActions, onEdit: (TaskEntity) -> Unit, onAdd: () -> Unit) {
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        topAnchor()
        if (state.tasks.isEmpty()) {
            item(key = "none") {
                Text(
                    if (state.meeting?.status == MeetingStatus.READY) "Nobody took on anything in this meeting, as far as Aide could tell." else "Action items appear here once the notes are written.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
        val unclear = state.tasks.filter { it.ownership == Ownership.UNCLEAR }
        if (unclear.isNotEmpty()) {
            item(key = "unclear-header") {
                Text("Whose are these?", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            items(unclear, key = { "u-${it.id}" }) { task -> UnclearTaskCard(task, actions, onEdit) }
        }
        val settled = state.tasks.filter { it.ownership != Ownership.UNCLEAR }
        if (settled.isNotEmpty()) {
            item(key = "settled") {
                AideCard(padding = 0.dp) {
                    settled.forEachIndexed { index, task ->
                        if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                        TaskRow(task = task, today = state.today, onToggle = { actions.onToggle(task, it) }, onClick = { onEdit(task) })
                    }
                }
            }
        }
        item(key = "add") { TextButton(onClick = onAdd) { Text("Add an action item") } }
    }
}

/** A task the assistant couldn't assign: one tap settles it. */
@Composable
fun UnclearTaskCard(task: TaskEntity, actions: MeetingActions, onEdit: (TaskEntity) -> Unit, modifier: Modifier = Modifier, source: String? = null) {
    AideCard(modifier = modifier, onClick = { onEdit(task) }) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(task.title, style = MaterialTheme.typography.titleMedium)
            val context = listOfNotNull(task.evidence.takeIf { it.isNotBlank() }, source?.let { "From \"$it\"" })
            if (context.isNotEmpty()) {
                Text(context.joinToString(" · "), style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                FilledTonalButton(onClick = { actions.onOwnership(task, Ownership.MINE) }, contentPadding = PaddingValues(horizontal = 14.dp)) { Text("Mine") }
                OutlinedButton(onClick = { actions.onOwnership(task, Ownership.OTHERS) }, contentPadding = PaddingValues(horizontal = 14.dp)) { Text("Someone else's") }
                TextButton(onClick = { actions.onDismissTask(task) }, contentPadding = PaddingValues(horizontal = 8.dp)) { Text("Not a task") }
            }
        }
    }
}

@Composable
private fun TranscriptTab(state: MeetingDetailState) {
    if (state.segments.isEmpty()) {
        Text("Nothing was captured.", modifier = Modifier.padding(24.dp), color = MaterialTheme.colorScheme.onSurfaceVariant)
        return
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = PaddingValues(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
        items(state.segments, key = { it.id }) { SegmentRow(it) }
    }
}

@Composable
private fun RenameDialog(current: String, onDismiss: () -> Unit, onSave: (String) -> Unit) {
    var text by remember { mutableStateOf(current) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Rename meeting") },
        text = {
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
        },
        confirmButton = { TextButton(onClick = { onSave(text) }, enabled = text.isNotBlank()) { Text("Save") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
private fun FollowUpSheet(followUp: FollowUp, actions: MeetingActions) {
    ModalBottomSheet(onDismissRequest = actions.onCloseFollowUp, sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
        Column(
            Modifier.fillMaxWidth().padding(horizontal = 20.dp).navigationBarsPadding().verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("Follow-up email", style = MaterialTheme.typography.titleLarge)
            when {
                followUp.error != null -> Banner(followUp.error, tone = Tone.BAD, action = "Try again", onAction = actions.onDraftFollowUp)
                followUp.text.isBlank() -> Working("Drafting…")
                else -> AssistantText(followUp.text)
            }
            if (followUp.working && followUp.text.isNotBlank()) Working("Still writing…")
            if (!followUp.working && followUp.text.isNotBlank()) {
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = { actions.onShareText(followUp.text) }, modifier = Modifier.weight(1f)) { Text("Send with…") }
                    OutlinedButton(onClick = { actions.onCopy(followUp.text) }, modifier = Modifier.weight(1f)) { Text("Copy") }
                }
            }
            Spacer(Modifier.height(12.dp))
        }
    }
}
