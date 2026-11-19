@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.today

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExtendedFloatingActionButton
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
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.DayPlan
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.transcribe.RecorderState
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.BulletSection
import com.personal.aide.ui.components.MeetingCard
import com.personal.aide.ui.components.RatingRow
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.TaskRow
import com.personal.aide.ui.components.TaskSheet
import com.personal.aide.ui.components.topAnchor
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.theme.AideTheme
import java.time.Instant
import java.time.ZoneId

class TodayActions(
    val onRecord: (CalendarEvent?) -> Unit = {},
    val onOpenRecording: () -> Unit = {},
    val onOpenMeeting: (Long) -> Unit = {},
    val onAsk: (String?) -> Unit = {},
    val onSettings: () -> Unit = {},
    val onQuestions: () -> Unit = {},
    val onOpenTasks: () -> Unit = {},
    val onPlan: () -> Unit = {},
    val onRatePlan: (Int) -> Unit = {},
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
    val onQuickAdd: (String) -> Unit = {},
    val onDismissError: () -> Unit = {},
    val onDismissRecorderError: () -> Unit = {},
    val onPrep: (CalendarEvent) -> Unit = {},
)

fun greeting(name: String, now: Long, zone: ZoneId = ZoneId.systemDefault()): String {
    val hour = Instant.ofEpochMilli(now).atZone(zone).hour
    val hello = when (hour) {
        in 5..11 -> "Good morning"
        in 12..17 -> "Good afternoon"
        else -> "Good evening"
    }
    val first = name.trim().substringBefore(' ')
    return if (first.isEmpty()) hello else "$hello, $first"
}

@Composable
fun TodayScreen(state: TodayState, actions: TodayActions) {
    var editing by remember { mutableStateOf<TaskEntity?>(null) }
    var adding by remember { mutableStateOf(false) }

    Scaffold(
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(greeting(state.name, state.now), style = MaterialTheme.typography.titleLarge, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Text(
                            Days.longDate(state.today).substringBeforeLast(' '),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                },
                actions = {
                    IconButton(onClick = { actions.onAsk(null) }) { Icon(AideIcons.Sparkle, contentDescription = "Ask Aide") }
                    IconButton(onClick = actions.onSettings) { Icon(Icons.Filled.Settings, contentDescription = "Settings") }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        floatingActionButton = {
            if (!state.recorder.active) {
                ExtendedFloatingActionButton(
                    onClick = { actions.onRecord(null) },
                    icon = { Icon(AideIcons.Mic, contentDescription = null) },
                    text = { Text("Record meeting") },
                    containerColor = MaterialTheme.colorScheme.primary,
                    contentColor = MaterialTheme.colorScheme.onPrimary,
                )
            }
        },
    ) { padding ->
        // Nothing is laid out until the first real state arrives, so the list is built once, in order.
        if (!state.loaded) return@Scaffold
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 0.dp, bottom = 96.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            topAnchor()
            if (state.recorder.active) {
                item(key = "recording") { RecordingBanner(state.recorder, state.now, actions.onOpenRecording) }
            }
            state.recorder.error?.let { error ->
                item(key = "recorder-error") { Banner(error, tone = Tone.BAD, action = "OK", onAction = actions.onDismissRecorderError) }
            }
            if (state.loaded && !state.hasKey) {
                item(key = "no-key") {
                    Banner(
                        "Connect Claude to turn recordings into notes, tasks and answers.",
                        tone = Tone.ASSISTANT,
                        icon = AideIcons.Key,
                        action = "Set up",
                        onAction = actions.onSettings,
                    )
                }
            }
            if (state.openQuestions > 0) {
                item(key = "questions") { QuestionsCard(state.openQuestions, actions.onQuestions) }
            }

            val upcoming = state.events.filter { !it.allDay && it.end > state.now }.take(3)
            if (upcoming.isNotEmpty()) {
                item(key = "events-header") { SectionHeader("On your calendar") }
                items(upcoming, key = { "event-${it.id}-${it.start}" }) { event ->
                    EventCard(event, state.now, recording = state.recorder.active, onRecord = { actions.onRecord(event) }, onPrep = { actions.onPrep(event) })
                }
            }

            val plan = state.plan
            val focusIds = plan?.focus.orEmpty().map { it.taskId }.filter { state.tasksById[it] != null }
            if (plan != null) {
                item(key = "plan") { PlanCard(plan, state, actions, onEdit = { editing = it }) }
            } else if (state.hasKey && state.board.openMine > 0) {
                item(key = "plan-offer") {
                    AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                            Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer)
                            Column(Modifier.weight(1f)) {
                                Text("Plan my day", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                                Text(
                                    "Aide picks what matters most from your ${state.board.openMine} open tasks.",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                                )
                            }
                            if (state.planning) Working("") else Button(onClick = actions.onPlan) { Text("Plan") }
                        }
                    }
                }
            }
            state.planError?.let { error ->
                item(key = "plan-error") { Banner(error, tone = Tone.BAD, action = "OK", onAction = actions.onDismissError) }
            }

            val rest = state.board.today.filter { it.id !in focusIds }
            item(key = "today-header") {
                SectionHeader(
                    if (plan != null && focusIds.isNotEmpty()) "Also on today's list" else "Today",
                    action = "Add task",
                    onAction = { adding = true },
                )
            }
            item(key = "today-tasks") {
                AideCard(padding = 0.dp) {
                    if (rest.isEmpty()) {
                        Text(
                            if (focusIds.isNotEmpty()) "Nothing else due today." else "Nothing due today. Tasks from your meetings will show up here.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(16.dp),
                        )
                    }
                    rest.forEachIndexed { index, task ->
                        if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                        TaskRow(
                            task = task,
                            today = state.today,
                            onToggle = { actions.onToggle(task, it) },
                            onClick = { editing = task },
                            meetingTitle = task.meetingId?.let { state.meetingTitles[it] },
                        )
                    }
                    HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                    QuickAdd(actions.onQuickAdd)
                }
            }
            if (state.board.review.isNotEmpty()) {
                item(key = "review") {
                    Banner(
                        if (state.board.review.size == 1) "1 task from your meetings needs an owner." else "${state.board.review.size} tasks from your meetings need an owner.",
                        tone = Tone.INFO,
                        icon = AideIcons.Tasks,
                        action = "Sort",
                        onAction = actions.onOpenTasks,
                    )
                }
            }

            if (state.recentMeetings.isNotEmpty()) {
                item(key = "meetings-header") { SectionHeader("Recent meetings") }
                items(state.recentMeetings, key = { "meeting-${it.id}" }) { meeting ->
                    MeetingCard(meeting, summarizing = meeting.id in state.summarizing, onClick = { actions.onOpenMeeting(meeting.id) })
                }
            } else if (state.loaded) {
                item(key = "first-run") {
                    AideCard {
                        Text("Start with a meeting", style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "Tap Record at the start of your next meeting and put the phone on the table. Aide transcribes as people talk, then writes up the notes, the decisions and who is doing what.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }
        }
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
            meetingTitle = current?.meetingId?.let { state.meetingTitles[it] },
            onOpenMeeting = { editing = null; actions.onOpenMeeting(it) },
            defaultDay = state.today,
        )
    }
}

@Composable
private fun RecordingBanner(recorder: RecorderState, now: Long, onOpen: () -> Unit) {
    val paused = recorder.phase == RecorderState.Phase.PAUSED
    AideCard(onClick = onOpen, container = MaterialTheme.colorScheme.errorContainer) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Box(Modifier.size(12.dp).clip(CircleShape).background(if (paused) MaterialTheme.colorScheme.outline else AideTheme.colors.recording))
            Column(Modifier.weight(1f)) {
                Text(
                    if (paused) "Recording paused" else "Recording · " + Days.clock(recorder.elapsed(now)),
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                )
                Text(
                    recorder.title.ifBlank { "Tap to see the live transcript" },
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onErrorContainer,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Text("Open", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onErrorContainer)
        }
    }
}

@Composable
private fun QuestionsCard(count: Int, onOpen: () -> Unit) {
    AideCard(onClick = onOpen, container = MaterialTheme.colorScheme.tertiaryContainer) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer)
            Column(Modifier.weight(1f)) {
                Text(
                    if (count == 1) "Aide has a question for you" else "Aide has $count questions for you",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                )
                Text(
                    "A quick answer now means better notes next time.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                )
            }
            Text("Answer", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onTertiaryContainer)
        }
    }
}

@Composable
private fun EventCard(event: CalendarEvent, now: Long, recording: Boolean, onRecord: () -> Unit, onPrep: () -> Unit) {
    val live = now in event.start..event.end
    AideCard {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text(
                    (if (live) "Now · until " + Days.timeOfDay(event.end) else Days.timeOfDay(event.start) + " – " + Days.timeOfDay(event.end)),
                    style = MaterialTheme.typography.labelLarge,
                    color = if (live) AideTheme.colors.recording else MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Text(event.title, style = MaterialTheme.typography.titleMedium, maxLines = 2, overflow = TextOverflow.Ellipsis)
                if (event.attendees.isNotEmpty()) {
                    Text(
                        "With " + event.attendees.take(4).joinToString(", ") + if (event.attendees.size > 4) " +${event.attendees.size - 4}" else "",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
            Column(horizontalAlignment = Alignment.End) {
                if (!recording) FilledTonalButton(onClick = onRecord) { Text("Record") }
                TextButton(onClick = onPrep) { Text("Prep") }
            }
        }
    }
}

@Composable
private fun PlanCard(plan: DayPlan, state: TodayState, actions: TodayActions, onEdit: (TaskEntity) -> Unit) {
    AideCard(padding = 0.dp) {
        Column(Modifier.padding(start = 16.dp, end = 16.dp, top = 16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(18.dp))
                Text("Today's plan", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.tertiary)
            }
            if (plan.headline.isNotBlank()) Text(plan.headline, style = MaterialTheme.typography.titleMedium)
        }
        val focus = plan.focus.mapNotNull { item -> state.tasksById[item.taskId]?.let { it to item.why } }
        focus.forEachIndexed { index, (task, why) ->
            if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant, modifier = Modifier.padding(start = 52.dp))
            TaskRow(task = task, today = state.today, onToggle = { actions.onToggle(task, it) }, onClick = { onEdit(task) }, reason = why)
        }
        val later = plan.ifTime.mapNotNull { item -> state.tasksById[item.taskId]?.let { it to item.why } }
        if (later.isNotEmpty()) {
            Text(
                "If there's time",
                style = MaterialTheme.typography.titleSmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(start = 16.dp, top = 8.dp),
            )
            later.forEach { (task, why) ->
                TaskRow(task = task, today = state.today, onToggle = { actions.onToggle(task, it) }, onClick = { onEdit(task) }, reason = why)
            }
        }
        Column(Modifier.padding(horizontal = 16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
            if (plan.chase.isNotEmpty()) BulletSection("Chase today", plan.chase, Modifier.padding(top = 8.dp))
            if (plan.headsUp.isNotEmpty()) BulletSection("Heads up", plan.headsUp, Modifier.padding(top = 8.dp), tone = Tone.WARN)
        }
        Row(Modifier.padding(start = 16.dp, end = 4.dp, top = 4.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
            if (state.planning) {
                Working("Planning…", Modifier.weight(1f))
            } else {
                TextButton(onClick = actions.onPlan, contentPadding = PaddingValues(0.dp)) { Text("Plan again") }
                Spacer(Modifier.weight(1f))
            }
            RatingRow(state.planRating, actions.onRatePlan)
        }
    }
}

@Composable
private fun QuickAdd(onAdd: (String) -> Unit) {
    var text by rememberSaveable { mutableStateOf("") }
    fun submit() {
        if (text.isNotBlank()) onAdd(text.trim())
        text = ""
    }
    Row(Modifier.fillMaxWidth().padding(start = 12.dp, end = 4.dp, top = 4.dp, bottom = 4.dp), verticalAlignment = Alignment.CenterVertically) {
        OutlinedTextField(
            value = text,
            onValueChange = { text = it },
            placeholder = { Text("Add a task for today") },
            singleLine = true,
            modifier = Modifier.weight(1f),
            keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences, imeAction = ImeAction.Done),
            keyboardActions = KeyboardActions(onDone = { submit() }),
            colors = androidx.compose.material3.OutlinedTextFieldDefaults.colors(
                unfocusedBorderColor = androidx.compose.ui.graphics.Color.Transparent,
                focusedBorderColor = androidx.compose.ui.graphics.Color.Transparent,
            ),
        )
        IconButton(onClick = { submit() }, enabled = text.isNotBlank()) { Icon(Icons.Filled.Add, contentDescription = "Add task") }
        Spacer(Modifier.width(4.dp))
    }
}
