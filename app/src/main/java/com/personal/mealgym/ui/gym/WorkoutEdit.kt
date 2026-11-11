package com.personal.mealgym.ui.gym

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.Exercise
import com.personal.mealgym.data.db.WorkoutDay
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.DetailTopBar
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch

data class WorkoutEditUi(val days: List<WorkoutDay>, val exercises: Map<Long, List<Exercise>>)

class WorkoutEditViewModel(private val c: AppContainer) : MessageViewModel() {
    val profileId = c.currentProfileId()

    val ui: StateFlow<WorkoutEditUi?> = combine(c.gym.days(profileId), c.gym.exercises) { days, exercises ->
        WorkoutEditUi(
            days,
            exercises.groupBy { it.workoutDayId }
                .mapValues { (_, list) -> list.sortedWith(compareBy<Exercise> { it.groupLabel }.thenBy { it.position }) },
        )
    }.stateInVm(null)

    fun renameDay(day: WorkoutDay, name: String) = launch { c.gym.renameDay(day, name) }
    fun addDay(name: String) = launch { c.gym.addDay(profileId, name) }
    fun deleteDay(day: WorkoutDay) = launch { c.gym.deleteDay(day) }
    fun saveExercise(exercise: Exercise) = launch { c.gym.saveExercise(exercise) }
    fun deleteExercise(exercise: Exercise) = launch { c.gym.deleteExercise(exercise) }

    private fun launch(block: suspend () -> Unit) {
        viewModelScope.launch { block() }
    }
}

private sealed interface EditTarget {
    data class RenameDay(val day: WorkoutDay) : EditTarget
    data object AddDay : EditTarget
    data class DeleteDay(val day: WorkoutDay) : EditTarget
    data class EditExercise(val exercise: Exercise) : EditTarget
}

@Composable
fun WorkoutEditScreen(nav: AppNavigator, vm: WorkoutEditViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    var target by remember { mutableStateOf<EditTarget?>(null) }

    AppScaffold(
        topBar = {
            DetailTopBar(
                title = "Edit workouts",
                onBack = nav::back,
                actions = { TextButton(onClick = { target = EditTarget.AddDay }) { Text("Add day") } },
            )
        },
    ) { padding ->
        val state = ui ?: return@AppScaffold
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            item {
                Text(
                    "The days run in order across your training weekdays. Exercises with the same group letter are a superset.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            items(state.days, key = { it.id }) { day ->
                val exercises = state.exercises[day.id].orEmpty()
                ElevatedCard(Modifier.fillMaxWidth()) {
                    Row(Modifier.padding(start = 16.dp, top = 8.dp, end = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                        Text(day.title(), style = MaterialTheme.typography.titleMedium, modifier = Modifier.weight(1f))
                        IconButton(onClick = { target = EditTarget.RenameDay(day) }) { Icon(Icons.Filled.Edit, contentDescription = "Rename") }
                        if (state.days.size > 1) {
                            IconButton(onClick = { target = EditTarget.DeleteDay(day) }) {
                                Icon(Icons.Filled.Delete, contentDescription = "Delete day")
                            }
                        }
                    }
                    exercises.forEach { e ->
                        ListItem(
                            modifier = Modifier.clickable { target = EditTarget.EditExercise(e) },
                            leadingContent = { Text(e.groupLabel, style = MaterialTheme.typography.titleMedium, color = MaterialTheme.colorScheme.primary) },
                            headlineContent = { Text(e.name) },
                            supportingContent = {
                                Text(
                                    buildString {
                                        append("${e.setsText} x ${e.repsText}")
                                        if (e.alternatives.isNotEmpty()) append(" · Swaps: ${e.alternatives.joinToString(", ")}")
                                    },
                                )
                            },
                        )
                    }
                    TextButton(
                        onClick = {
                            val group = exercises.lastOrNull()?.groupLabel ?: "A"
                            target = EditTarget.EditExercise(
                                Exercise(workoutDayId = day.id, position = 0, name = "", setsText = "3", repsText = "8–12", groupLabel = group),
                            )
                        },
                        modifier = Modifier.padding(start = 8.dp, bottom = 8.dp),
                    ) {
                        Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.padding(end = 6.dp))
                        Text("Add exercise")
                    }
                }
            }
        }
    }

    when (val t = target) {
        is EditTarget.RenameDay -> NameDialog(
            title = "Rename Day ${t.day.dayOrder}",
            initial = t.day.name,
            onSave = { vm.renameDay(t.day, it); target = null },
            onDismiss = { target = null },
        )
        EditTarget.AddDay -> NameDialog(
            title = "Add a workout day",
            initial = "",
            onSave = { vm.addDay(it); target = null },
            onDismiss = { target = null },
        )
        is EditTarget.DeleteDay -> ConfirmDialog(
            title = "Delete ${t.day.title()}?",
            body = "Its exercises are removed too. Past workouts stay in history.",
            confirmLabel = "Delete",
            onConfirm = { vm.deleteDay(t.day); target = null },
            onDismiss = { target = null },
        )
        is EditTarget.EditExercise -> ExerciseDialog(
            exercise = t.exercise,
            onSave = { vm.saveExercise(it); target = null },
            onDelete = { vm.deleteExercise(t.exercise); target = null },
            onDismiss = { target = null },
        )
        null -> Unit
    }
}

@Composable
private fun NameDialog(title: String, initial: String, onSave: (String) -> Unit, onDismiss: () -> Unit) {
    var name by remember { mutableStateOf(initial) }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(title) },
        text = {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Name, e.g. Upper Body") },
                singleLine = true,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Words),
            )
        },
        confirmButton = { TextButton(onClick = { onSave(name) }, enabled = name.isNotBlank()) { Text("Save") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}

@Composable
private fun ExerciseDialog(exercise: Exercise, onSave: (Exercise) -> Unit, onDelete: () -> Unit, onDismiss: () -> Unit) {
    var name by remember { mutableStateOf(exercise.name) }
    var group by remember { mutableStateOf(exercise.groupLabel) }
    var sets by remember { mutableStateOf(exercise.setsText) }
    var reps by remember { mutableStateOf(exercise.repsText) }
    var swaps by remember { mutableStateOf(exercise.alternatives.joinToString("\n")) }
    var note by remember { mutableStateOf(exercise.note.orEmpty()) }
    val isNew = exercise.id == 0L

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(if (isNew) "Add exercise" else "Edit exercise") },
        text = {
            Column(Modifier.verticalScroll(rememberScrollState()), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Exercise") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = group,
                        onValueChange = { v -> group = v.filter { it.isLetter() }.take(1).uppercase() },
                        label = { Text("Group") },
                        singleLine = true,
                        modifier = Modifier.width(80.dp),
                    )
                    OutlinedTextField(
                        value = sets,
                        onValueChange = { v -> sets = v.filter { it.isDigit() }.take(2) },
                        label = { Text("Sets") },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.width(72.dp),
                    )
                    OutlinedTextField(
                        value = reps,
                        onValueChange = { reps = it },
                        label = { Text("Reps") },
                        singleLine = true,
                        modifier = Modifier.weight(1f),
                    )
                }
                OutlinedTextField(
                    value = swaps,
                    onValueChange = { swaps = it },
                    label = { Text("Busy-gym swaps, one per line") },
                    supportingText = { Text("The first one is the default swap.") },
                    minLines = 2,
                )
                OutlinedTextField(value = note, onValueChange = { note = it }, label = { Text("Note (optional)") })
                if (!isNew) {
                    TextButton(onClick = onDelete) { Text("Delete exercise", color = MaterialTheme.colorScheme.error) }
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = {
                    onSave(
                        exercise.copy(
                            name = name.trim(),
                            groupLabel = group.ifBlank { "A" },
                            setsText = sets.ifBlank { "3" },
                            repsText = reps.trim().ifBlank { "8–12" },
                            alternatives = swaps.lines().map { it.trim() }.filter { it.isNotEmpty() },
                            note = note.trim().ifEmpty { null },
                        ),
                    )
                },
                enabled = name.isNotBlank(),
            ) { Text("Save") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
