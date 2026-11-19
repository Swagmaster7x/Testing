@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.tasks

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.PrimaryTabRow
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Tab
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewModelScope
import com.personal.aide.AppContainer
import com.personal.aide.ai.LlmException
import com.personal.aide.data.AideJson
import com.personal.aide.data.WeekPlan
import com.personal.aide.data.db.InsightKind
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.TaskBoard
import com.personal.aide.domain.buildTaskBoard
import com.personal.aide.ui.TaskActionsViewModel
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.BulletSection
import com.personal.aide.ui.components.EmptyState
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.TaskRow
import com.personal.aide.ui.components.TaskSheet
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.components.topAnchor
import com.personal.aide.ui.meetings.MeetingActions
import com.personal.aide.ui.meetings.UnclearTaskCard
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class TasksState(
    val loaded: Boolean = false,
    val today: Long = Days.today(),
    val board: TaskBoard = buildTaskBoard(emptyList(), Days.today()),
    val tasksById: Map<Long, TaskEntity> = emptyMap(),
    val meetingTitles: Map<Long, String> = emptyMap(),
    val hasKey: Boolean = true,
    /** A week plan the assistant proposed and the user hasn't applied or dismissed. */
    val proposal: WeekPlan? = null,
    val planning: Boolean = false,
    val planError: String? = null,
)

@OptIn(ExperimentalCoroutinesApi::class)
class TasksViewModel(container: AppContainer) : TaskActionsViewModel(container) {
    private val day = MutableStateFlow(Days.today())
    private val proposal = MutableStateFlow<WeekPlan?>(null)
    private val planning = MutableStateFlow(false)
    private val planError = MutableStateFlow<String?>(null)

    val state: StateFlow<TasksState> = combine(
        container.db.tasks().observeAll(),
        container.db.meetings().observeAll(),
        container.secrets.hasKey,
        day,
        combine(proposal, planning, planError) { plan, busy, error -> Triple(plan, busy, error) },
    ) { tasks, meetings, hasKey, day, plan ->
        TasksState(
            loaded = true,
            today = day,
            board = buildTaskBoard(tasks, day),
            tasksById = tasks.associateBy { it.id },
            meetingTitles = meetings.associate { it.id to it.title },
            hasKey = hasKey,
            proposal = plan.first,
            planning = plan.second,
            planError = plan.third,
        )
    }.stateIn(viewModelScope, SharingStarted.WhileSubscribed(5_000), TasksState())

    fun refresh() {
        day.value = Days.today()
    }

    fun planWeek() {
        if (planning.value) return
        planning.value = true
        planError.value = null
        viewModelScope.launch {
            try {
                proposal.value = container.assistant.planWeek(day.value)
            } catch (e: LlmException) {
                planError.value = e.message
            } finally {
                planning.value = false
            }
        }
    }

    fun applyPlan() {
        val plan = proposal.value ?: return
        proposal.value = null
        viewModelScope.launch { container.tasks.applyWeekPlan(plan) }
    }

    fun discardPlan() {
        proposal.value = null
        planError.value = null
    }
}

class TasksActions(
    val onToggle: (TaskEntity, Boolean) -> Unit = { _, _ -> },
    val onSaveTask: (TaskEntity) -> Unit = {},
    val onDeleteTask: (TaskEntity) -> Unit = {},
    val onDismissTask: (TaskEntity) -> Unit = {},
    val onOwnership: (TaskEntity, Ownership) -> Unit = { _, _ -> },
    val onPlanWeek: () -> Unit = {},
    val onApplyPlan: () -> Unit = {},
    val onDiscardPlan: () -> Unit = {},
    val onOpenMeeting: (Long) -> Unit = {},
    val onAsk: () -> Unit = {},
    val onOpenPerson: (String) -> Unit = {},
)

@Composable
fun TasksScreen(state: TasksState, actions: TasksActions) {
    var tab by rememberSaveable { mutableIntStateOf(0) }
    var editing by remember { mutableStateOf<TaskEntity?>(null) }
    var adding by remember { mutableStateOf(false) }
    val board = state.board

    Scaffold(
        contentWindowInsets = WindowInsets(0),
        topBar = {
            TopAppBar(
                title = { Text("Tasks") },
                actions = { IconButton(onClick = actions.onAsk) { Icon(AideIcons.Sparkle, contentDescription = "Ask Aide") } },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = MaterialTheme.colorScheme.background),
            )
        },
        floatingActionButton = {
            FloatingActionButton(onClick = { adding = true }, containerColor = MaterialTheme.colorScheme.primary, contentColor = MaterialTheme.colorScheme.onPrimary) {
                Icon(Icons.Filled.Add, contentDescription = "Add a task")
            }
        },
    ) { padding ->
        Column(Modifier.fillMaxSize().padding(padding)) {
            PrimaryTabRow(selectedTabIndex = tab, containerColor = MaterialTheme.colorScheme.background) {
                Tab(selected = tab == 0, onClick = { tab = 0 }, text = { Text(label("Today", board.today.size)) })
                Tab(selected = tab == 1, onClick = { tab = 1 }, text = { Text("Week") })
                Tab(selected = tab == 2, onClick = { tab = 2 }, text = { Text(label("Waiting", board.waiting.size)) })
                Tab(selected = tab == 3, onClick = { tab = 3 }, text = { Text("Done") })
            }
            val edit: (TaskEntity) -> Unit = { editing = it }
            when (tab) {
                0 -> TodayTab(state, actions, edit)
                1 -> WeekTab(state, actions, edit)
                2 -> WaitingTab(state, actions, edit)
                else -> DoneTab(state, actions, edit)
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
            defaultDay = if (tab == 0) state.today else null,
            onOpenPerson = { editing = null; actions.onOpenPerson(it) },
        )
    }
}

private fun label(name: String, count: Int): String = if (count > 0) "$name ($count)" else name

private val listPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 12.dp, bottom = 96.dp)

private fun LazyListScope.taskGroup(
    key: String,
    tasks: List<TaskEntity>,
    state: TasksState,
    actions: TasksActions,
    onEdit: (TaskEntity) -> Unit,
) {
    if (tasks.isEmpty()) return
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

/** Tasks the assistant couldn't assign, shown wherever the user is looking at their list. */
private fun LazyListScope.reviewGroup(state: TasksState, actions: TasksActions, onEdit: (TaskEntity) -> Unit) {
    val review = state.board.review
    if (review.isEmpty()) return
    item(key = "review-header") { SectionHeader("Whose are these? (${review.size})") }
    val ownership = MeetingActions(onOwnership = actions.onOwnership, onDismissTask = actions.onDismissTask)
    items(review, key = { "review-${it.id}" }) { task ->
        UnclearTaskCard(task, ownership, onEdit, source = task.meetingId?.let { state.meetingTitles[it] })
    }
}

@Composable
private fun TodayTab(state: TasksState, actions: TasksActions, onEdit: (TaskEntity) -> Unit) {
    val board = state.board
    if (state.loaded && board.today.isEmpty() && board.review.isEmpty()) {
        EmptyState(
            icon = AideIcons.Tasks,
            title = "Nothing due today",
            body = if (board.openMine == 0) "Tasks come from your meetings, or add one with the + button." else "The Week tab has what is coming up.",
        )
        return
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = listPadding, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        topAnchor()
        val late = board.today.filter { (it.dueDay ?: Long.MAX_VALUE) < state.today }
        val due = board.today - late.toSet()
        if (late.isNotEmpty()) {
            item(key = "late-header") { SectionHeader("Overdue") }
            taskGroup("late", late, state, actions, onEdit)
        }
        if (due.isNotEmpty()) {
            item(key = "due-header") { SectionHeader(if (late.isEmpty()) "Today" else "Due today") }
            taskGroup("due", due, state, actions, onEdit)
        }
        reviewGroup(state, actions, onEdit)
    }
}

@Composable
private fun WeekTab(state: TasksState, actions: TasksActions, onEdit: (TaskEntity) -> Unit) {
    val board = state.board
    LazyColumn(Modifier.fillMaxSize(), contentPadding = listPadding, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item(key = "planner") { WeekPlanner(state, actions) }
        for ((day, tasks) in board.week) {
            if (day < state.today) continue
            item(key = "day-header-$day") {
                SectionHeader(
                    when (day) {
                        state.today -> "Today · " + Days.mediumDate(day)
                        state.today + 1 -> "Tomorrow · " + Days.mediumDate(day)
                        else -> Days.weekdayName(day) + " · " + Days.mediumDate(day).substringAfter(' ')
                    },
                )
            }
            if (tasks.isEmpty()) {
                item(key = "day-empty-$day") {
                    Text("Nothing yet", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.outline, modifier = Modifier.padding(start = 4.dp))
                }
            } else {
                taskGroup("day-$day", tasks, state, actions, onEdit)
            }
        }
        if (board.later.isNotEmpty()) {
            item(key = "later-header") { SectionHeader("After this week") }
            taskGroup("later", board.later, state, actions, onEdit)
        }
        if (board.undated.isNotEmpty()) {
            item(key = "undated-header") { SectionHeader("No date") }
            taskGroup("undated", board.undated, state, actions, onEdit)
        }
        reviewGroup(state, actions, onEdit)
    }
}

@Composable
private fun WeekPlanner(state: TasksState, actions: TasksActions) {
    val proposal = state.proposal
    when {
        proposal != null -> AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer, modifier = Modifier.size(18.dp))
                    Text("Aide's plan for the week", style = MaterialTheme.typography.titleSmall, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                if (proposal.headline.isNotBlank()) {
                    Text(proposal.headline, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                for (dayPlan in proposal.days) {
                    val day = Days.parseIso(dayPlan.day) ?: continue
                    val titles = dayPlan.taskIds.mapNotNull { state.tasksById[it]?.title }
                    if (titles.isEmpty()) continue
                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                        Text(
                            Days.weekdayName(day) + if (dayPlan.note.isNotBlank()) " · ${dayPlan.note}" else "",
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onTertiaryContainer,
                        )
                        for (title in titles) {
                            Text("• $title", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                        }
                    }
                }
                if (proposal.days.isEmpty()) {
                    Text("Nothing needs to move this week.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                if (proposal.warnings.isNotEmpty()) BulletSection("Watch out", proposal.warnings, tone = Tone.WARN)
                Row(verticalAlignment = Alignment.CenterVertically) {
                    TextButton(onClick = actions.onDiscardPlan) { Text("Dismiss", color = MaterialTheme.colorScheme.onTertiaryContainer) }
                    Spacer(Modifier.weight(1f))
                    if (proposal.days.isNotEmpty()) Button(onClick = actions.onApplyPlan) { Text("Put tasks on these days") }
                }
            }
        }
        state.planning -> AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) { Working("Laying out your week…") }
        state.planError != null -> Banner(state.planError, tone = Tone.BAD, action = "OK", onAction = actions.onDiscardPlan)
        state.hasKey && state.board.openMine > 1 -> Banner(
            "Let Aide spread your ${state.board.openMine} open tasks across the week.",
            tone = Tone.ASSISTANT,
            icon = AideIcons.Sparkle,
            action = "Plan my week",
            onAction = actions.onPlanWeek,
        )
    }
}

@Composable
private fun WaitingTab(state: TasksState, actions: TasksActions, onEdit: (TaskEntity) -> Unit) {
    if (state.loaded && state.board.waiting.isEmpty()) {
        EmptyState(
            icon = AideIcons.Hourglass,
            title = "Not waiting on anyone",
            body = "When someone else takes on a task in one of your meetings, it lands here so you can follow up.",
        )
        return
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = listPadding, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        item(key = "hint") {
            Text(
                "What other people said they would do. Tick one off when it's done.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
        taskGroup("waiting", state.board.waiting, state, actions, onEdit)
    }
}

@Composable
private fun DoneTab(state: TasksState, actions: TasksActions, onEdit: (TaskEntity) -> Unit) {
    if (state.loaded && state.board.doneRecently.isEmpty()) {
        EmptyState(icon = AideIcons.Tasks, title = "Nothing ticked off yet", body = "Finished tasks collect here.")
        return
    }
    LazyColumn(Modifier.fillMaxSize(), contentPadding = listPadding, verticalArrangement = Arrangement.spacedBy(10.dp)) {
        taskGroup("done", state.board.doneRecently, state, actions, onEdit)
    }
}
