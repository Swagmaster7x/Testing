@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.gym

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.data.db.Feeling
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.domain.GymToday
import com.personal.mealgym.gym.RestTimerController
import com.personal.mealgym.gym.RestTimerState
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.components.formatClock
import com.personal.mealgym.ui.label
import com.personal.mealgym.ui.sauna.rememberSecondsLeft

@Composable
fun GymScreen(nav: AppNavigator, vm: GymViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var checkIn by rememberSaveable { mutableStateOf(false) }
    var confirmDiscard by rememberSaveable { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TabTopBar(
                title = "Gym",
                onHistory = nav::history,
                onSettings = nav::settings,
                extraActions = {
                    IconButton(onClick = nav::editWorkouts) { Icon(Icons.Filled.Edit, contentDescription = "Edit workouts") }
                },
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui ?: return@Scaffold
        val plan = state.plan
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item { StatusCard(plan, onTrainAnyway = vm::trainAnyway) }

            if (plan.showWorkout && plan.activeDay != null) {
                item {
                    DayHeader(
                        active = plan.activeDay,
                        days = plan.days,
                        onChoose = vm::chooseDay,
                    )
                }
                item { RestTimerCard(state.rest, onStart = vm::startRest, onCancel = vm::cancelRest) }
                state.groups.forEach { group ->
                    item(key = "g-${group.label}") {
                        Text(
                            if (group.isSuperset) "${group.label} · superset" else group.label,
                            style = MaterialTheme.typography.titleSmall,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.SemiBold,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                    items(group.exercises, key = { "e-${it.exercise.id}" }) { ex ->
                        ExerciseCard(
                            ex = ex,
                            weightUnit = state.weightUnit,
                            onToggleSet = { i -> vm.toggleSet(ex.exercise.id, i) },
                            onSwap = { name -> vm.swap(ex.exercise.id, name) },
                            onWeight = { vm.setWeight(ex.exercise.id, it) },
                            onReps = { vm.setReps(ex.exercise.id, it) },
                        )
                    }
                }
                item {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                        Button(onClick = { checkIn = true }, modifier = Modifier.fillMaxWidth()) { Text("Finish workout") }
                        if (plan.draft != null) {
                            TextButton(onClick = { confirmDiscard = true }, modifier = Modifier.fillMaxWidth()) {
                                Text("Discard this workout")
                            }
                        }
                    }
                }
            }

            item {
                OutlinedButton(onClick = nav::sauna, modifier = Modifier.fillMaxWidth()) {
                    Icon(painterResource(R.drawable.ic_timer), contentDescription = null, modifier = Modifier.padding(end = 8.dp).size(18.dp))
                    Text("Sauna timer")
                }
            }
            item { TipsCard(state.tips) }
        }
    }

    if (checkIn) {
        CheckInDialog(
            onSave = { feeling, note ->
                checkIn = false
                vm.finish(feeling, note)
            },
            onDismiss = { checkIn = false },
        )
    }
    if (confirmDiscard) {
        ConfirmDialog(
            title = "Discard this workout?",
            body = "Ticked sets, swaps and notes for today's workout will be cleared. Nothing is saved to history.",
            confirmLabel = "Discard",
            onConfirm = { confirmDiscard = false; vm.discard() },
            onDismiss = { confirmDiscard = false },
        )
    }
}

@Composable
private fun StatusCard(plan: GymPlan, onTrainAnyway: () -> Unit) {
    val status = plan.status
    val next = plan.activeDay
    when {
        status is GymToday.Done && plan.draft == null -> InfoCard {
            val s = plan.doneSession
            Text("Done today", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.primary)
            Text(s?.let { "Day ${it.dayOrder}: ${it.dayName}" } ?: "Workout", style = MaterialTheme.typography.titleMedium)
            s?.let { Text("How it went: ${it.feeling.label}${it.note?.let { n -> " · $n" } ?: ""}") }
            if (next != null) {
                Text("Next time: ${next.title()}", style = MaterialTheme.typography.bodyMedium)
                TextButton(onClick = onTrainAnyway, contentPadding = PaddingValues(0.dp)) { Text("Start another session") }
            }
        }
        status is GymToday.RestDay && plan.draft == null -> InfoCard {
            Text("Rest day", style = MaterialTheme.typography.titleMedium)
            if (next != null) Text("Next up: ${next.title()}", style = MaterialTheme.typography.bodyMedium)
            FilledTonalButton(onClick = onTrainAnyway, modifier = Modifier.padding(top = 4.dp)) { Text("Train anyway") }
        }
        plan.activeDay == null -> InfoCard {
            Text("No workouts set up", style = MaterialTheme.typography.titleMedium)
            Text("Add a workout day with the edit button above.", style = MaterialTheme.typography.bodyMedium)
        }
        else -> Unit
    }
}

@Composable
private fun InfoCard(content: @Composable () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer),
    ) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) { content() }
    }
}

@Composable
private fun DayHeader(active: WorkoutDay, days: List<WorkoutDay>, onChoose: (Long) -> Unit) {
    var open by remember { mutableStateOf(false) }
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
        Text(active.title(), style = MaterialTheme.typography.headlineSmall, modifier = Modifier.weight(1f))
        Box {
            TextButton(onClick = { open = true }) { Text("Do a different day") }
            DropdownMenu(expanded = open, onDismissRequest = { open = false }) {
                days.forEach { day ->
                    DropdownMenuItem(
                        text = { Text(day.title()) },
                        onClick = { open = false; onChoose(day.id) },
                        leadingIcon = if (day.id == active.id) {
                            { Icon(Icons.Filled.Check, contentDescription = null) }
                        } else {
                            null
                        },
                    )
                }
            }
        }
    }
}

@Composable
private fun RestTimerCard(rest: RestTimerState?, onStart: (Int) -> Unit, onCancel: () -> Unit) {
    OutlinedCard(Modifier.fillMaxWidth()) {
        Row(Modifier.padding(horizontal = 12.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("Rest", style = MaterialTheme.typography.titleSmall, modifier = Modifier.width(48.dp))
            if (rest != null) {
                val left = rememberSecondsLeft(rest.endAtMillis)
                Text(formatClock(left), style = MaterialTheme.typography.headlineMedium, modifier = Modifier.weight(1f))
                TextButton(onClick = onCancel) { Text("Stop") }
            } else {
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    RestTimerController.presets.forEach { seconds ->
                        FilledTonalButton(
                            onClick = { onStart(seconds) },
                            contentPadding = PaddingValues(horizontal = 8.dp),
                            modifier = Modifier.weight(1f),
                        ) { Text("${seconds}s") }
                    }
                }
            }
        }
    }
}

@Composable
private fun ExerciseCard(
    ex: ExerciseUi,
    weightUnit: WeightUnit,
    onToggleSet: (Int) -> Unit,
    onSwap: (String?) -> Unit,
    onWeight: (String) -> Unit,
    onReps: (String) -> Unit,
) {
    val e = ex.exercise
    OutlinedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text(ex.displayName, style = MaterialTheme.typography.titleMedium)
            if (ex.swappedTo != null) {
                Text("Instead of ${e.name}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Text("${e.setsText} sets × ${e.repsText}", style = MaterialTheme.typography.bodyMedium)
            e.note?.let { Text(it, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant) }
            ex.lastTime?.let { Text(it, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.primary) }

            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                Text("Sets", style = MaterialTheme.typography.labelLarge, modifier = Modifier.width(40.dp))
                repeat(e.setCount) { i ->
                    val done = i in ex.checkedSets
                    FilterChip(
                        selected = done,
                        onClick = { onToggleSet(i) },
                        label = { Text("${i + 1}") },
                        leadingIcon = if (done) {
                            { Icon(Icons.Filled.Check, contentDescription = null, modifier = Modifier.size(FilterChipDefaults.IconSize)) }
                        } else {
                            null
                        },
                    )
                }
            }

            val options = buildList {
                if (ex.swappedTo != null) add(e.name)
                addAll(e.alternatives.filter { it != ex.swappedTo })
            }
            if (options.isNotEmpty()) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(
                        painterResource(R.drawable.ic_swap),
                        contentDescription = "Swaps",
                        tint = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(top = 10.dp, end = 8.dp).size(18.dp),
                    )
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        options.forEach { option ->
                            FilterChip(
                                selected = false,
                                onClick = { onSwap(if (option == e.name) null else option) },
                                label = { Text(option) },
                            )
                        }
                    }
                }
            }

            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                OutlinedTextField(
                    value = ex.weight,
                    onValueChange = onWeight,
                    label = { Text(weightUnit.label) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal),
                    modifier = Modifier.width(96.dp),
                )
                Text("×", style = MaterialTheme.typography.titleMedium)
                OutlinedTextField(
                    value = ex.reps,
                    onValueChange = onReps,
                    label = { Text("reps") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                    modifier = Modifier.width(88.dp),
                )
                Text(
                    "optional",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

@Composable
private fun TipsCard(tips: List<String>) {
    var open by rememberSaveable { mutableStateOf(false) }
    OutlinedCard(Modifier.fillMaxWidth()) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth().clickable { open = !open }.padding(16.dp),
        ) {
            Text("Tips", style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
            Icon(if (open) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown, contentDescription = null)
        }
        AnimatedVisibility(open) {
            Column(Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                tips.forEach { tip ->
                    Row {
                        Text("•", modifier = Modifier.width(16.dp), color = MaterialTheme.colorScheme.primary)
                        Text(tip, style = MaterialTheme.typography.bodyMedium)
                    }
                }
            }
        }
    }
}

@Composable
private fun CheckInDialog(onSave: (Feeling, String) -> Unit, onDismiss: () -> Unit) {
    var feeling by rememberSaveable { mutableStateOf<Feeling?>(null) }
    var note by rememberSaveable { mutableStateOf("") }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("How did it go?") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                SingleChoiceSegmentedButtonRow(Modifier.fillMaxWidth()) {
                    Feeling.entries.forEachIndexed { index, f ->
                        SegmentedButton(
                            selected = feeling == f,
                            onClick = { feeling = f },
                            shape = SegmentedButtonDefaults.itemShape(index, Feeling.entries.size),
                        ) { Text(f.label) }
                    }
                }
                OutlinedTextField(
                    value = note,
                    onValueChange = { note = it },
                    label = { Text("Note (optional)") },
                    modifier = Modifier.fillMaxWidth(),
                )
            }
        },
        confirmButton = {
            TextButton(onClick = { feeling?.let { onSave(it, note) } }, enabled = feeling != null) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Not yet") } },
    )
}
