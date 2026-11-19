@file:OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)

package com.personal.aide.ui.progress

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
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.WinEntity
import com.personal.aide.data.db.WinSource
import com.personal.aide.domain.Days
import com.personal.aide.domain.ellipsize
import com.personal.aide.ui.components.AideCard
import com.personal.aide.ui.components.AideIcons
import com.personal.aide.ui.components.AssistantText
import com.personal.aide.ui.components.Banner
import com.personal.aide.ui.components.Pill
import com.personal.aide.ui.components.SectionHeader
import com.personal.aide.ui.components.Tone
import com.personal.aide.ui.components.Working
import com.personal.aide.ui.components.topAnchor
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.Locale

class ProgressActions(
    val onBack: () -> Unit = {},
    val onUpdate: () -> Unit = {},
    val onDismissMessage: () -> Unit = {},
    val onSaveWin: (WinEntity) -> Unit = {},
    val onDeleteWin: (WinEntity) -> Unit = {},
    /** The goal as it was (null for a new one) and as it should be (blank to remove it). */
    val onSaveGoal: (String?, String) -> Unit = { _, _ -> },
    val onDraftReview: (months: Int) -> Unit = {},
    val onOpenLastReview: () -> Unit = {},
    val onCloseReview: () -> Unit = {},
    val onCopy: (String) -> Unit = {},
    val onShare: (String) -> Unit = {},
    val onSettings: () -> Unit = {},
)

/** How the assistant's read of a goal is shown. */
fun goalStatusLabel(status: String): Pair<String, Tone> = when (status) {
    "on_track" -> "On track" to Tone.GOOD
    "at_risk" -> "At risk" to Tone.WARN
    "stalled" -> "Stalled" to Tone.BAD
    else -> "No evidence yet" to Tone.NEUTRAL
}

private fun monthOf(day: Long, locale: Locale = Locale.getDefault()): String =
    LocalDate.ofEpochDay(day).format(DateTimeFormatter.ofPattern("MMMM yyyy", locale))

/** The running record of what the user has achieved, set against their goals, and the self-review written from it. */
@Composable
fun ProgressScreen(state: ProgressState, actions: ProgressActions) {
    var editingWin by remember { mutableStateOf<WinEntity?>(null) }
    var addingWin by remember { mutableStateOf(false) }
    var editingGoal by remember { mutableStateOf<String?>(null) }
    var addingGoal by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Goals & wins") },
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
            item(key = "update") { UpdateCard(state, actions) }
            state.error?.let { problem -> item(key = "error") { Banner(problem, tone = Tone.BAD, action = "OK", onAction = actions.onDismissMessage) } }
            state.message?.let { note -> item(key = "message") { Banner(note, tone = Tone.GOOD, action = "OK", onAction = actions.onDismissMessage) } }

            item(key = "goals-header") { SectionHeader("Your goals", action = "Add a goal", onAction = { addingGoal = true }) }
            if (state.goals.isEmpty()) {
                item(key = "goals-none") {
                    Text(
                        "No goals yet. Add the ones you'll be judged on, and Aide files each win under the goal it counts towards.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            items(state.goals, key = { "goal-${it.goal}" }) { goal -> GoalCardView(goal, onClick = { editingGoal = goal.goal }) }

            item(key = "review") { SelfReviewCard(state, actions) }

            item(key = "wins-header") {
                SectionHeader(if (state.wins.isEmpty()) "Wins" else "Wins (${state.wins.size})", action = "Add a win", onAction = { addingWin = true })
            }
            if (state.wins.isEmpty()) {
                item(key = "wins-none") {
                    Text(
                        "Nothing logged yet. Add a win yourself, or let Aide bring the log up to date from your finished tasks and meeting notes.",
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            for ((month, wins) in state.wins.groupBy { monthOf(it.day) }) {
                item(key = "month-$month") {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(month, style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        AideCard(padding = 0.dp) {
                            wins.forEachIndexed { index, win ->
                                if (index > 0) HorizontalDivider(color = MaterialTheme.colorScheme.outlineVariant)
                                WinRow(win, onClick = { editingWin = win })
                            }
                        }
                    }
                }
            }
        }
    }

    val win = editingWin
    if (win != null || addingWin) {
        WinSheet(
            win = win,
            goals = state.goals.map { it.goal },
            today = state.today,
            onDismiss = { editingWin = null; addingWin = false },
            onSave = { actions.onSaveWin(it); editingWin = null; addingWin = false },
            onDelete = { actions.onDeleteWin(it); editingWin = null },
        )
    }
    val goal = editingGoal
    if (goal != null || addingGoal) {
        GoalDialog(
            goal = goal,
            onDismiss = { editingGoal = null; addingGoal = false },
            onSave = { actions.onSaveGoal(goal, it); editingGoal = null; addingGoal = false },
            onRemove = { actions.onSaveGoal(goal, ""); editingGoal = null },
        )
    }
    state.review?.let { ReviewSheet(it, actions) }
}

@Composable
private fun UpdateCard(state: ProgressState, actions: ProgressActions) {
    val updated = state.updatedAt
    if (updated == null) {
        AideCard(container = MaterialTheme.colorScheme.tertiaryContainer) {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Icon(AideIcons.Sparkle, contentDescription = null, tint = MaterialTheme.colorScheme.onTertiaryContainer, modifier = Modifier.size(18.dp))
                    Text("Keep a record without keeping one", style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.onTertiaryContainer)
                }
                Text(
                    "Aide reads what you've finished and what your meetings decided, logs what is worth remembering, and says where each goal stands.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onTertiaryContainer,
                )
                when {
                    state.working -> Working("Going over your recent work…")
                    state.hasKey -> Button(onClick = actions.onUpdate) { Text("Bring it up to date") }
                    else -> TextButton(onClick = actions.onSettings) { Text("Connect Claude first", color = MaterialTheme.colorScheme.onTertiaryContainer) }
                }
            }
        }
        return
    }
    AideCard {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Text("Brought up to date " + updatedLabel(updated, state.today), style = MaterialTheme.typography.bodyLarge)
                Text("Aide adds wins from finished tasks and meeting notes.", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            when {
                state.working -> Working("Reading…")
                state.hasKey -> TextButton(onClick = actions.onUpdate) { Text("Update") }
            }
        }
    }
}

private fun updatedLabel(at: Long, today: Long): String = when (val day = Days.ofMillis(at)) {
    today -> "today"
    today - 1 -> "yesterday"
    else -> "on " + Days.mediumDate(day)
}

@Composable
private fun GoalCardView(goal: GoalCard, onClick: () -> Unit) {
    AideCard(onClick = onClick) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(goal.goal, style = MaterialTheme.typography.titleMedium)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                goal.read?.let { read ->
                    val (label, tone) = goalStatusLabel(read.status)
                    Pill(label, tone = tone)
                }
                Pill(
                    when (goal.wins) {
                        0 -> "No wins yet"
                        1 -> "1 win"
                        else -> "${goal.wins} wins"
                    },
                )
            }
            goal.read?.let { read ->
                if (read.note.isNotBlank()) Text(read.note, style = MaterialTheme.typography.bodyMedium)
                if (read.nextStep.isNotBlank()) {
                    Text("Next: " + read.nextStep, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.tertiary)
                }
            }
        }
    }
}

@Composable
private fun WinRow(win: WinEntity, onClick: () -> Unit) {
    Column(
        Modifier.fillMaxWidth().clickable(onClick = onClick).padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(5.dp),
    ) {
        Text(win.title, style = MaterialTheme.typography.bodyLarge)
        if (win.detail.isNotBlank()) {
            Text(win.detail, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 3, overflow = TextOverflow.Ellipsis)
        }
        FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Pill(Days.mediumDate(win.day), icon = AideIcons.Clock)
            if (win.goal.isNotBlank()) Pill(win.goal.ellipsize(34), tone = Tone.INFO, icon = AideIcons.Flag)
            if (win.source == WinSource.ASSISTANT) Pill("Found by Aide", tone = Tone.ASSISTANT, icon = AideIcons.Sparkle)
        }
    }
}

@Composable
private fun SelfReviewCard(state: ProgressState, actions: ProgressActions) {
    var months by rememberSaveable { mutableIntStateOf(6) }
    AideCard {
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Self-review", style = MaterialTheme.typography.titleMedium)
            Text(
                "When appraisal time comes, Aide drafts your self-review from this record: what you delivered against each goal, in your words to edit.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                for (option in listOf(3, 6, 12)) {
                    FilterChip(selected = months == option, onClick = { months = option }, label = { Text("$option months") })
                }
            }
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                if (state.hasKey) {
                    Button(onClick = { actions.onDraftReview(months) }) { Text("Draft my self-review") }
                } else {
                    TextButton(onClick = actions.onSettings) { Text("Connect Claude first") }
                }
                val last = state.lastReviewAt
                if (state.lastReview != null && last != null) {
                    TextButton(onClick = actions.onOpenLastReview) { Text("Last draft") }
                }
            }
        }
    }
}

@Composable
private fun ReviewSheet(review: ReviewDraft, actions: ProgressActions) {
    ModalBottomSheet(onDismissRequest = actions.onCloseReview, sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
        Column(
            Modifier.fillMaxWidth().padding(horizontal = 20.dp).navigationBarsPadding().verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("Self-review", style = MaterialTheme.typography.titleLarge)
            Text(
                Days.mediumDate(review.fromDay) + " to " + Days.mediumDate(review.toDay),
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
            when {
                review.error != null -> Banner(review.error, tone = Tone.BAD, action = "Close", onAction = actions.onCloseReview)
                review.text.isBlank() -> Working("Reading the record and drafting…")
                else -> AssistantText(review.text)
            }
            if (review.working && review.text.isNotBlank()) Working("Still writing…")
            if (!review.working && review.text.isNotBlank()) {
                Text(
                    "A draft from what Aide has on record. Check the claims and add what it couldn't know before you send it.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(onClick = { actions.onShare(review.text) }, modifier = Modifier.weight(1f)) { Text("Send with…") }
                    OutlinedButton(onClick = { actions.onCopy(review.text) }, modifier = Modifier.weight(1f)) { Text("Copy") }
                }
            }
            Spacer(Modifier.height(12.dp))
        }
    }
}

@Composable
private fun GoalDialog(goal: String?, onDismiss: () -> Unit, onSave: (String) -> Unit, onRemove: () -> Unit) {
    var text by remember { mutableStateOf(goal.orEmpty()) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (goal == null) "New goal" else "Goal") },
        text = {
            OutlinedTextField(
                value = text,
                onValueChange = { text = it },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                placeholder = { Text("What you're aiming to achieve") },
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                supportingText = if (goal == null) null else { { Text("Wins filed under this goal keep up with a new wording.") } },
            )
        },
        confirmButton = { TextButton(onClick = { onSave(text) }, enabled = text.isNotBlank()) { Text("Save") } },
        dismissButton = {
            Row {
                if (goal != null) TextButton(onClick = onRemove) { Text("Remove", color = MaterialTheme.colorScheme.error) }
                TextButton(onClick = onDismiss) { Text("Cancel") }
            }
        },
    )
}

/** The sheet for logging a win or changing one. [win] null means a new one. */
@Composable
private fun WinSheet(
    win: WinEntity?,
    goals: List<String>,
    today: Long,
    onDismiss: () -> Unit,
    onSave: (WinEntity) -> Unit,
    onDelete: (WinEntity) -> Unit,
) {
    var title by remember { mutableStateOf(win?.title.orEmpty()) }
    var detail by remember { mutableStateOf(win?.detail.orEmpty()) }
    var goal by remember { mutableStateOf(win?.goal.orEmpty()) }
    var day by remember { mutableStateOf(win?.day ?: today) }
    var pickingDate by remember { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
        Column(
            Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Text(if (win == null) "Log a win" else "Win", style = MaterialTheme.typography.titleLarge)
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("What you achieved") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            OutlinedTextField(
                value = detail,
                onValueChange = { detail = it },
                label = { Text("Why it mattered (optional)") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("When", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = day == today, onClick = { day = today }, label = { Text("Today") })
                    FilterChip(selected = day == today - 1, onClick = { day = today - 1 }, label = { Text("Yesterday") })
                    val custom = day.takeIf { it != today && it != today - 1 }
                    FilterChip(selected = custom != null, onClick = { pickingDate = true }, label = { Text(custom?.let { Days.mediumDate(it) } ?: "Pick…") })
                }
            }
            if (goals.isNotEmpty() || goal.isNotBlank()) {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Counts towards", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        FilterChip(selected = goal.isBlank(), onClick = { goal = "" }, label = { Text("No goal") })
                        // A win can outlive its goal's wording; keep the one it has selectable.
                        for (option in (goals + goal).filter { it.isNotBlank() }.distinct()) {
                            FilterChip(selected = goal == option, onClick = { goal = option }, label = { Text(option.ellipsize(40)) })
                        }
                    }
                }
            }
            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                if (win != null) TextButton(onClick = { onDelete(win) }) { Text("Delete", color = MaterialTheme.colorScheme.error) }
                Spacer(Modifier.weight(1f))
                TextButton(onClick = onDismiss) { Text("Cancel") }
                Button(
                    enabled = title.isNotBlank(),
                    onClick = {
                        val base = win ?: WinEntity(title = "", key = "", day = today, source = WinSource.MANUAL, createdAt = 0)
                        onSave(base.copy(title = title, detail = detail, goal = goal, day = day))
                    },
                ) { Text("Save") }
            }
            Spacer(Modifier.height(8.dp))
        }
    }

    if (pickingDate) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = day * 86_400_000L)
        DatePickerDialog(
            onDismissRequest = { pickingDate = false },
            confirmButton = {
                TextButton(onClick = {
                    // The picker works in UTC midnights, which map straight onto day numbers. A win can't be in the future.
                    pickerState.selectedDateMillis?.let { day = (it / 86_400_000L).coerceAtMost(today) }
                    pickingDate = false
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { pickingDate = false }) { Text("Cancel") } },
        ) { DatePicker(state = pickerState) }
    }
}
