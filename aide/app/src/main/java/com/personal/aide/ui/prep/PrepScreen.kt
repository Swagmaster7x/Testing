@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

package com.personal.aide.ui.prep

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.PrepBrief
import com.personal.aide.domain.buildPrepBrief
import com.personal.aide.ui.TaskActionsViewModel
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.BulletSection
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

data class PrepState(
    val loaded: Boolean = false,
    val event: CalendarEvent = CalendarEvent(0, "", 0, 0),
    val brief: PrepBrief = PrepBrief("", 0, emptyList(), null, null, emptyList(), emptyList(), emptyList(), emptyList(), emptyList()),
    val meetingTitles: Map<Long, String> = emptyMap(),
    val recording: Boolean = false,
    val hasKey: Boolean = true,
    val today: Long = Days.today(),
    val now: Long = System.currentTimeMillis(),
)

class PrepViewModel(container: AppContainer, private val event: CalendarEvent) : TaskActionsViewModel(container) {
    val state: StateFlow<PrepState> = combine(
        combine(container.db.meetings().observeAll(), container.db.tasks().observeAll(), container.db.series().observeAll(), container.db.knowledge().observeAll()) { meetings, tasks, series, entries ->
            Stored(meetings.associate { it.id to it.title }) { self -> buildPrepBrief(event.title, event.id.takeIf { it > 0 }, event.start, event.attendees, self, meetings, tasks, series, entries) }
        },
        container.settings.profile,
        container.recorder.state,
        container.secrets.hasKey,
    ) { stored, profile, recorder, hasKey ->
        PrepState(
            loaded = true,
            event = event,
            brief = stored.brief(profile.name),
            meetingTitles = stored.titles,
            recording = recorder.active,
            hasKey = hasKey,
            today = Days.today(),
            now = System.currentTimeMillis(),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), PrepState(event = event))

    private class Stored(val titles: Map<Long, String>, val brief: (String) -> PrepBrief)
}

class PrepActions(
    val onBack: () -> Unit = {},
    val onRecord: () -> Unit = {},
    val onAsk: (String) -> Unit = {},
    val onOpenMeeting: (Long) -> Unit = {},
    val onOpenSeries: (Long) -> Unit = {},
    val onOpenPerson: (String) -> Unit = {},
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
)

/** What to ask Aide for talking points before [event]. */
fun prepPrompt(event: CalendarEvent, attendees: List<String>): String =
    "Prep me for \"${event.title}\"" + (if (attendees.isNotEmpty()) " with ${attendees.take(5).joinToString(", ")}" else "") +
        ". What was decided last time, what's still open, and what should I raise?"

fun eventWhen(event: CalendarEvent, now: Long, today: Long): String {
    val day = Days.ofMillis(event.start)
    val time = Days.timeOfDay(event.start) + " – " + Days.timeOfDay(event.end)
    val minutes = (event.start - now) / 60_000
    return when {
        now in event.start..event.end -> "Now · until " + Days.timeOfDay(event.end)
        day == today && minutes in 0..59 -> "$time · in " + (if (minutes <= 1L) "a minute" else "$minutes minutes")
        day == today -> "Today · $time"
        day == today + 1 -> "Tomorrow · $time"
        else -> Days.mediumDate(day) + " · " + time
    }
}

/** What to have in mind walking into a calendar meeting, from what Aide already holds. */
@Composable
fun PrepScreen(state: PrepState, actions: PrepActions) {
    val brief = state.brief
    val event = state.event
    var editing by remember { mutableStateOf<TaskEntity?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Before the meeting") },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
            )
        },
    ) { padding ->
        if (!state.loaded) return@Scaffold
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 0.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            topAnchor()
            item(key = "header") {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(eventWhen(event, state.now, state.today), style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
                    Text(event.title, style = MaterialTheme.typography.headlineSmall)
                    if (brief.attendees.isNotEmpty() || brief.series != null) {
                        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                            brief.series?.let { series ->
                                Pill(series.name, Modifier.clip(RoundedCornerShape(50)).clickable { actions.onOpenSeries(series.id) }, tone = Tone.INFO, icon = AideIcons.Loop)
                            }
                            for (person in brief.attendees.take(12)) {
                                Pill(person, Modifier.clip(RoundedCornerShape(50)).clickable { actions.onOpenPerson(person) })
                            }
                        }
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp), modifier = Modifier.padding(top = 4.dp)) {
                        Button(onClick = actions.onRecord, modifier = Modifier.weight(1f)) {
                            Text(if (state.recording) "Open recording" else "Record it")
                        }
                        if (state.hasKey) {
                            OutlinedButton(onClick = { actions.onAsk(prepPrompt(event, brief.attendees)) }, modifier = Modifier.weight(1f)) { Text("Talking points") }
                        }
                    }
                }
            }

            if (!brief.hasHistory) {
                item(key = "nothing") {
                    AideCard {
                        Text("Nothing on record yet", style = MaterialTheme.typography.titleMedium)
                        Spacer(Modifier.height(4.dp))
                        Text(
                            "Aide hasn't sat in on this meeting before, and nothing is open with the people in it. Record this one and the next brief will open with what was decided and what is still outstanding.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                }
            }

            brief.last?.let { last ->
                item(key = "last") {
                    AideCard(onClick = { actions.onOpenMeeting(last.id) }, container = MaterialTheme.colorScheme.primaryContainer) {
                        Text(
                            "Last time · " + Days.mediumDate(Days.ofMillis(last.startedAt)),
                            style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                        )
                        Spacer(Modifier.height(6.dp))
                        Text(last.tldr.ifBlank { last.title }, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onPrimaryContainer)
                    }
                }
                if (brief.lastDecisions.isNotEmpty()) item(key = "decisions") { AideCard { BulletSection("Decided then", brief.lastDecisions, tone = Tone.GOOD) } }
                if (brief.lastOpenQuestions.isNotEmpty()) item(key = "questions") { AideCard { BulletSection("Left open then", brief.lastOpenQuestions, tone = Tone.ASSISTANT) } }
            }

            taskSection("carried", "Carried over from earlier ones", brief.carriedOver, state, actions) { editing = it }
            taskSection("owed", "They owe you", brief.theyOwe, state, actions) { editing = it }
            taskSection("mine", "You have open with them", brief.openWithThem, state, actions) { editing = it }
        }
    }

    editing?.let { task ->
        TaskSheet(
            task = task,
            today = state.today,
            onDismiss = { editing = null },
            onSave = { actions.onSaveTask(it); editing = null },
            onDelete = { actions.onDeleteTask(it); editing = null },
            onDismissTask = { actions.onDismissTask(it); editing = null },
            meetingTitle = task.meetingId?.let { state.meetingTitles[it] },
            onOpenMeeting = { editing = null; actions.onOpenMeeting(it) },
        )
    }
}

private fun androidx.compose.foundation.lazy.LazyListScope.taskSection(
    key: String,
    title: String,
    tasks: List<TaskEntity>,
    state: PrepState,
    actions: PrepActions,
    onEdit: (TaskEntity) -> Unit,
) {
    if (tasks.isEmpty()) return
    item(key = "$key-header") { SectionHeader("$title (${tasks.size})") }
    item(key = key) {
        AideCard(padding = 0.dp) {
            tasks.forEachIndexed { index, task ->
                if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                TaskRow(
                    task = task,
                    today = state.today,
                    onToggle = { actions.onToggle(task, it) },
                    onClick = { onEdit(task) },
                    meetingTitle = task.meetingId?.let { state.meetingTitles[it] },
                )
            }
        }
    }
}
