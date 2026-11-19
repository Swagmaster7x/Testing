@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.people

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.AideJson
import com.personal.aide.data.PersonAgenda
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.PersonView
import com.personal.aide.domain.buildPersonView
import com.personal.aide.ui.TaskActionsViewModel
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.BulletSection
import com.personal.aide.ui.components.MeetingCard
import com.personal.aide.ui.components.RatingRow
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.TaskRow
import com.personal.aide.ui.components.TaskSheet
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.components.topAnchor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class PersonState(
    val loaded: Boolean = false,
    val person: PersonView = PersonView("", null, emptyList(), emptyList(), emptyList()),
    val meetingTitles: Map<Long, String> = emptyMap(),
    val agenda: PersonAgenda? = null,
    val agendaId: Long? = null,
    val agendaRating: Int = 0,
    val working: Boolean = false,
    val error: String? = null,
    val hasKey: Boolean = true,
    val today: Long = Days.today(),
)

class PersonViewModel(container: AppContainer, private val name: String) : TaskActionsViewModel(container) {
    private val working = MutableStateFlow(false)
    private val error = MutableStateFlow<String?>(null)

    val state: StateFlow<PersonState> = combine(
        combine(
            container.db.knowledge().observeAll(),
            container.db.tasks().observeAll(),
            container.db.meetings().observeAll(),
            container.settings.profile,
        ) { entries, tasks, meetings, profile ->
            buildPersonView(name, entries, tasks, meetings, self = profile.name) to meetings.associate { it.id to it.title }
        },
        container.db.insights().observeAll(),
        container.secrets.hasKey,
        combine(working, error) { busy, problem -> busy to problem },
    ) { (person, titles), insights, hasKey, busy ->
        val stored = insights.firstOrNull { it.kind == InsightKind.PERSON_AGENDA && it.periodStart == person.number }
        PersonState(
            loaded = true,
            person = person,
            meetingTitles = titles,
            agenda = stored?.let { runCatching { AideJson.decodeFromString(PersonAgenda.serializer(), it.json) }.getOrNull() },
            agendaId = stored?.id,
            agendaRating = stored?.rating ?: 0,
            working = busy.first,
            error = busy.second,
            hasKey = hasKey,
            today = Days.today(),
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), PersonState())

    fun suggestAgenda() {
        if (working.value) return
        working.value = true
        error.value = null
        viewModelScope.launch {
            try {
                container.assistant.suggestAgenda(name)
            } catch (e: LlmException) {
                error.value = e.message
            } finally {
                working.value = false
            }
        }
    }

    fun rateAgenda(rating: Int) {
        val id = state.value.agendaId ?: return
        viewModelScope.launch { container.db.insights().rate(id, rating) }
    }

    fun dismissError() {
        error.value = null
    }
}

class PersonActions(
    val onBack: () -> Unit = {},
    val onEdit: () -> Unit = {},
    val onSuggestAgenda: () -> Unit = {},
    val onRateAgenda: (Int) -> Unit = {},
    val onDismissError: () -> Unit = {},
    val onNudge: (String) -> Unit = {},
    val onOpenMeeting: (Long) -> Unit = {},
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
    val onSettings: () -> Unit = {},
)

/** A message asking Aide to draft a nudge about what [person] still owes. */
fun nudgePrompt(person: PersonView): String =
    "Draft a short, friendly message to ${person.name} asking for an update on: " +
        person.theyOwe.take(5).joinToString("; ") { it.title } + ". Keep it to a few lines."

/** Everything on record with one person, and what to raise with them next. */
@Composable
fun PersonScreen(state: PersonState, actions: PersonActions) {
    val person = state.person
    var editing by remember { mutableStateOf<TaskEntity?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(person.name, maxLines = 1, overflow = TextOverflow.Ellipsis) },
                navigationIcon = { IconButton(onClick = actions.onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back") } },
                actions = {
                    IconButton(onClick = actions.onEdit) {
                        Icon(Icons.Filled.Edit, contentDescription = if (person.entry == null) "Add what you know about them" else "Edit what Aide knows about them")
                    }
                },
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
            item(key = "about") {
                AideCard(onClick = actions.onEdit) {
                    Text("What Aide knows", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.size(4.dp))
                    Text(
                        person.entry?.content ?: "Nothing saved yet. Tap to add their role and what they own.",
                        style = MaterialTheme.typography.bodyLarge,
                        color = if (person.entry == null) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
                    )
                    person.lastMet?.let {
                        Spacer(Modifier.size(6.dp))
                        Text(
                            "Last met " + Days.mediumDate(Days.ofMillis(it)) + " · " + (if (person.meetings.size == 1) "1 meeting" else "${person.meetings.size} meetings") + " on record",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.outline,
                        )
                    }
                }
            }

            item(key = "agenda") { AgendaCard(state, actions) }
            state.error?.let { problem -> item(key = "error") { Banner(problem, tone = Tone.BAD, action = "OK", onAction = actions.onDismissError) } }

            if (person.theyOwe.isNotEmpty()) {
                item(key = "owed-header") {
                    SectionHeader(
                        "They owe you (${person.theyOwe.size})",
                        action = if (state.hasKey) "Draft a nudge" else null,
                        onAction = { actions.onNudge(nudgePrompt(person)) },
                    )
                }
                item(key = "owed") { TaskList(person.theyOwe, state, actions) { editing = it } }
            }
            if (person.openWithThem.isNotEmpty()) {
                item(key = "mine-header") { SectionHeader("Open with them (${person.openWithThem.size})") }
                item(key = "mine") { TaskList(person.openWithThem, state, actions) { editing = it } }
            }
            if (person.theyOwe.isEmpty() && person.openWithThem.isEmpty()) {
                item(key = "nothing-open") {
                    Text(
                        "Nothing open between you right now.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }

            if (person.meetings.isNotEmpty()) {
                item(key = "meetings-header") { SectionHeader("Meetings together") }
                items(person.meetings.take(8), key = { "meeting-${it.id}" }) { meeting ->
                    MeetingCard(meeting, summarizing = false, onClick = { actions.onOpenMeeting(meeting.id) })
                }
            }
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

@Composable
private fun TaskList(tasks: List<TaskEntity>, state: PersonState, actions: PersonActions, onEdit: (TaskEntity) -> Unit) {
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

@Composable
private fun AgendaCard(state: PersonState, actions: PersonActions) {
    val agenda = state.agenda
    val first = state.person.name.substringBefore(' ')
    if (agenda == null) {
        AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer, modifier = Modifier.size(18.dp))
                    Text("Your next conversation", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                Text(
                    "Aide can suggest what to cover with $first, from what is open between you and what came up in your meetings.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                )
                when {
                    state.working -> Working("Putting an agenda together…")
                    state.hasKey -> Button(onClick = actions.onSuggestAgenda) { Text("Suggest an agenda") }
                    else -> TextButton(onClick = actions.onSettings) { Text("Connect Claude first", color = MaterialTheme.colorScheme.onTertiaryContainer) }
                }
            }
        }
        return
    }
    AideCard {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.tertiary, modifier = Modifier.size(18.dp))
                Text("Agenda for your next conversation", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.tertiary)
            }
            if (agenda.headline.isNotBlank()) Text(agenda.headline, style = MaterialTheme.typography.titleMedium)
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                agenda.items.forEachIndexed { index, item ->
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Text("${index + 1}.", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.outline)
                        Column(Modifier.weight(1f)) {
                            Text(item.topic, style = MaterialTheme.typography.bodyLarge)
                            if (item.why.isNotBlank()) Text(item.why, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.tertiary)
                        }
                    }
                }
            }
            BulletSection("Ask $first", agenda.toAsk)
            BulletSection("Tell $first", agenda.toTell, tone = Tone.GOOD)
            HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
            Row(verticalAlignment = Alignment.CenterVertically) {
                if (state.working) {
                    Working("Thinking again…", Modifier.weight(1f))
                } else {
                    TextButton(onClick = actions.onSuggestAgenda, contentPadding = PaddingValues(0.dp)) { Text("Suggest again") }
                    Spacer(Modifier.weight(1f))
                }
                RatingRow(state.agendaRating, actions.onRateAgenda)
            }
        }
    }
}
