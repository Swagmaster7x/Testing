@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.aide.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days

/** One task on a list: a checkbox, the title, and what the user needs to place it. */
@Composable
fun TaskRow(
    task: TaskEntity,
    today: Long,
    onToggle: (Boolean) -> Unit,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    meetingTitle: String? = null,
    reason: String? = null,
) {
    val done = task.status == TaskStatus.DONE
    Row(
        modifier.fillMaxWidth().clickable(onClick = onClick).padding(start = 4.dp, end = 16.dp, top = 2.dp, bottom = 2.dp),
        verticalAlignment = Alignment.Top,
    ) {
        Checkbox(checked = done, onCheckedChange = onToggle)
        Column(Modifier.weight(1f).padding(top = 12.dp, bottom = 10.dp), verticalArrangement = Arrangement.spacedBy(5.dp)) {
            Text(
                task.title,
                style = MaterialTheme.typography.bodyLarge,
                color = if (done) MaterialTheme.colorScheme.onSurfaceVariant else MaterialTheme.colorScheme.onSurface,
                textDecoration = if (done) TextDecoration.LineThrough else null,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
            )
            if (!reason.isNullOrBlank()) {
                Text(reason, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.tertiary)
            }
            TaskMeta(task, today, meetingTitle)
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun TaskMeta(task: TaskEntity, today: Long, meetingTitle: String? = null) {
    val open = task.status == TaskStatus.OPEN
    val due = task.dueDay
    val showOwner = task.ownership == Ownership.OTHERS && task.owner.isNotBlank()
    if (due == null && task.priority != 2 && !showOwner && meetingTitle.isNullOrBlank()) return
    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
        if (showOwner) Pill(task.owner, tone = Tone.INFO)
        if (due != null) {
            Pill(
                Days.dueLabel(due, today),
                tone = when {
                    !open -> Tone.NEUTRAL
                    due < today -> Tone.BAD
                    due == today -> Tone.WARN
                    else -> Tone.NEUTRAL
                },
                icon = AideIcons.Clock,
            )
        }
        if (task.priority == 2 && open) Pill("High priority", tone = Tone.WARN, icon = AideIcons.Flag)
        if (!meetingTitle.isNullOrBlank()) Pill(meetingTitle, icon = AideIcons.Meetings)
    }
}

/** The sheet for adding a task or changing one. [task] null means a new task. */
@Composable
fun TaskSheet(
    task: TaskEntity?,
    today: Long,
    onDismiss: () -> Unit,
    onSave: (TaskEntity) -> Unit,
    onDelete: ((TaskEntity) -> Unit)? = null,
    onDismissTask: ((TaskEntity) -> Unit)? = null,
    meetingTitle: String? = null,
    onOpenMeeting: ((Long) -> Unit)? = null,
    defaultDay: Long? = null,
) {
    var title by remember { mutableStateOf(task?.title.orEmpty()) }
    var details by remember { mutableStateOf(task?.details.orEmpty()) }
    var dueDay by remember { mutableStateOf(task?.dueDay ?: defaultDay.takeIf { task == null }) }
    var priority by remember { mutableIntStateOf(task?.priority ?: 1) }
    var ownership by remember { mutableStateOf(task?.ownership ?: Ownership.MINE) }
    var owner by remember { mutableStateOf(task?.owner.orEmpty()) }
    var plannedToday by remember { mutableStateOf(task?.plannedDay == today) }
    var pickingDate by remember { mutableStateOf(false) }

    ModalBottomSheet(onDismissRequest = onDismiss, sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)) {
        Column(
            Modifier.fillMaxWidth().verticalScroll(rememberScrollState()).padding(horizontal = 20.dp).navigationBarsPadding(),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            Text(if (task == null) "New task" else "Task", style = MaterialTheme.typography.titleLarge)
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("What needs doing") },
                modifier = Modifier.fillMaxWidth(),
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            OutlinedTextField(
                value = details,
                onValueChange = { details = it },
                label = { Text("Details (optional)") },
                modifier = Modifier.fillMaxWidth(),
                minLines = 2,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Due", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = dueDay == null, onClick = { dueDay = null }, label = { Text("No date") })
                    FilterChip(selected = dueDay == today, onClick = { dueDay = today }, label = { Text("Today") })
                    FilterChip(selected = dueDay == today + 1, onClick = { dueDay = today + 1 }, label = { Text("Tomorrow") })
                    val custom = dueDay?.takeIf { it != today && it != today + 1 }
                    FilterChip(
                        selected = custom != null,
                        onClick = { pickingDate = true },
                        label = { Text(custom?.let { Days.mediumDate(it) } ?: "Pick…") },
                    )
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Priority", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = priority == 0, onClick = { priority = 0 }, label = { Text("Low") })
                    FilterChip(selected = priority == 1, onClick = { priority = 1 }, label = { Text("Normal") })
                    FilterChip(selected = priority == 2, onClick = { priority = 2 }, label = { Text("High") })
                }
            }

            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Whose is it", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    FilterChip(selected = ownership == Ownership.MINE, onClick = { ownership = Ownership.MINE }, label = { Text("Mine") })
                    FilterChip(selected = ownership == Ownership.OTHERS, onClick = { ownership = Ownership.OTHERS }, label = { Text("Someone else's") })
                }
                if (ownership == Ownership.OTHERS) {
                    OutlinedTextField(
                        value = owner,
                        onValueChange = { owner = it },
                        label = { Text("Who") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
                    )
                }
            }

            if (ownership == Ownership.MINE) {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.clickable { plannedToday = !plannedToday }.fillMaxWidth()) {
                    Checkbox(checked = plannedToday, onCheckedChange = { plannedToday = it })
                    Text("Put it on today's list", style = MaterialTheme.typography.bodyLarge)
                }
            }

            if (task != null && task.evidence.isNotBlank()) {
                Text(
                    "From the meeting: ${task.evidence}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            val meetingId = task?.meetingId
            if (meetingId != null && !meetingTitle.isNullOrBlank() && onOpenMeeting != null) {
                TextButton(onClick = { onOpenMeeting(meetingId) }, contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)) {
                    Text("Open \"$meetingTitle\"")
                }
            }

            Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                if (task != null) {
                    if (task.origin == TaskOrigin.AI && onDismissTask != null) {
                        TextButton(onClick = { onDismissTask(task) }) { Text("Not a real task") }
                    } else if (onDelete != null) {
                        TextButton(onClick = { onDelete(task) }) { Text("Delete", color = MaterialTheme.colorScheme.error) }
                    }
                }
                Spacer(Modifier.weight(1f))
                TextButton(onClick = onDismiss) { Text("Cancel") }
                Button(
                    enabled = title.isNotBlank(),
                    onClick = {
                        val base = task ?: TaskEntity(title = "", createdAt = 0)
                        onSave(
                            base.copy(
                                title = title,
                                details = details,
                                dueDay = dueDay,
                                priority = priority,
                                ownership = ownership,
                                owner = if (ownership == Ownership.OTHERS) owner.trim() else "",
                                plannedDay = when {
                                    ownership != Ownership.MINE -> null
                                    plannedToday -> today
                                    base.plannedDay == today -> null
                                    else -> base.plannedDay
                                },
                            ),
                        )
                    },
                ) { Text("Save") }
            }
            Spacer(Modifier.height(8.dp))
        }
    }

    if (pickingDate) {
        val pickerState = rememberDatePickerState(initialSelectedDateMillis = (dueDay ?: today) * 86_400_000L)
        DatePickerDialog(
            onDismissRequest = { pickingDate = false },
            confirmButton = {
                TextButton(onClick = {
                    // The picker works in UTC midnights, which map straight onto day numbers.
                    pickerState.selectedDateMillis?.let { dueDay = it / 86_400_000L }
                    pickingDate = false
                }) { Text("OK") }
            },
            dismissButton = { TextButton(onClick = { pickingDate = false }) { Text("Cancel") } },
        ) { DatePicker(state = pickerState) }
    }
}
