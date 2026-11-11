@file:OptIn(ExperimentalLayoutApi::class)

package com.personal.mealgym.ui.settings

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Button
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilterChip
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SegmentedButton
import androidx.compose.material3.SegmentedButtonDefaults
import androidx.compose.material3.SingleChoiceSegmentedButtonRow
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Switch
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
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.AppSettings
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.ShoppingList
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.ConfirmDialog
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.cook.HALF_PLATE_TIP
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.launch
import java.time.DayOfWeek
import java.time.LocalDate

data class PantryItem(val name: String, val ticked: Boolean, val coveredBy: String?)

data class SettingsUi(val settings: AppSettings, val pantry: List<PantryItem>)

class SettingsViewModel(private val c: AppContainer) : MessageViewModel() {

    val ui: StateFlow<SettingsUi?> = combine(c.settings.settings, c.meals.pantryIngredientNames) { s, names ->
        val seen = HashSet<String>()
        val candidates = (s.pantryStaples.sorted() + c.seed.seed.pantryStaples + names)
            .filter { seen.add(ShoppingList.ingredientKey(it)) }
            .sortedBy { it.lowercase() }
        val pantry = candidates.map { name ->
            val ticked = name in s.pantryStaples
            val coveredBy = if (ticked) null else s.pantryStaples.firstOrNull { ShoppingList.isAlwaysHave(name, setOf(it)) }
            PantryItem(name, ticked, coveredBy)
        }
        SettingsUi(s, pantry)
    }.stateInVm(null)

    fun toggleWeekday(day: DayOfWeek) = launch {
        val current = c.settings.current().trainingWeekdays
        c.settings.setTrainingWeekdays(if (day in current) current - day else current + day)
    }

    fun setShowNutrition(show: Boolean) = launch { c.settings.setShowNutrition(show) }
    fun setShowHalfPlateTip(show: Boolean) = launch { c.settings.setShowHalfPlateTip(show) }
    fun setWeightUnit(unit: WeightUnit) = launch { c.settings.setWeightUnit(unit) }
    fun setStaple(name: String, alwaysHave: Boolean) = launch { c.settings.setPantryStaple(name, alwaysHave) }

    fun addStaple(name: String) {
        if (name.isBlank()) return
        launch { c.settings.setPantryStaple(name.trim().lowercase(), true) }
    }

    fun export(uri: Uri) = launch {
        runCatching { c.backup.exportTo(uri) }
            .onSuccess { say("Exported ${it.recipes.size} recipes, ${it.mealPlan.size} planned meals and ${it.workoutSessions.size} workouts.") }
            .onFailure { say("Export didn't work: ${it.message}") }
    }

    fun import(uri: Uri) = launch {
        runCatching { c.backup.importFrom(uri) }
            .onSuccess {
                c.workoutDraft.clear()
                say("Imported ${it.recipes.size} recipes and ${it.workoutSessions.size} workouts.")
            }
            .onFailure { say("Couldn't import that file: ${it.message}") }
    }

    private fun launch(block: suspend () -> Unit) {
        viewModelScope.launch { block() }
    }
}

@Composable
fun SettingsScreen(nav: AppNavigator, vm: SettingsViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var importUri by remember { mutableStateOf<Uri?>(null) }
    var newStaple by rememberSaveable { mutableStateOf("") }

    val exportLauncher = rememberLauncherForActivityResult(ActivityResultContracts.CreateDocument("application/json")) { uri ->
        uri?.let(vm::export)
    }
    val importLauncher = rememberLauncherForActivityResult(ActivityResultContracts.OpenDocument()) { uri ->
        importUri = uri
    }

    Scaffold(
        topBar = { DetailTopBar(title = "Settings", onBack = nav::back) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui ?: return@Scaffold
        val s = state.settings
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 32.dp),
        ) {
            item { SectionHeader("Gym") }
            item {
                Text("Training days", style = MaterialTheme.typography.bodyLarge)
                Text(
                    "The workout days cycle in order across these. A missed day just moves on to the next session.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                FlowRow(horizontalArrangement = Arrangement.spacedBy(6.dp), modifier = Modifier.padding(vertical = 8.dp)) {
                    DayOfWeek.entries.forEach { day ->
                        FilterChip(
                            selected = day in s.trainingWeekdays,
                            onClick = { vm.toggleWeekday(day) },
                            label = { Text(Dates.shortDayName(day)) },
                        )
                    }
                }
            }
            item {
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(vertical = 8.dp)) {
                    Text("Weight unit", style = MaterialTheme.typography.bodyLarge, modifier = Modifier.weight(1f))
                    SingleChoiceSegmentedButtonRow {
                        WeightUnit.entries.forEachIndexed { index, unit ->
                            SegmentedButton(
                                selected = s.weightUnit == unit,
                                onClick = { vm.setWeightUnit(unit) },
                                shape = SegmentedButtonDefaults.itemShape(index, WeightUnit.entries.size),
                            ) { Text(unit.label) }
                        }
                    }
                }
            }
            item { TextButton(onClick = nav::editWorkouts, contentPadding = PaddingValues(0.dp)) { Text("Edit workouts") } }

            item { SectionHeader("Recipes") }
            item {
                SwitchRow(
                    title = "Show nutrition info",
                    body = "Approximate per-serving numbers on each recipe, as reference text only.",
                    checked = s.showNutrition,
                    onChange = vm::setShowNutrition,
                )
            }
            item {
                SwitchRow(
                    title = "Half-plate reminder",
                    body = "\"$HALF_PLATE_TIP\" at the top of each recipe.",
                    checked = s.showHalfPlateTip,
                    onChange = vm::setShowHalfPlateTip,
                )
            }

            item { SectionHeader("Pantry: always have") }
            item {
                Text(
                    "Ticked items are left off the shopping list.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            items(state.pantry, key = { "p-${it.name}" }) { item ->
                val effective = item.ticked || item.coveredBy != null
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable(enabled = item.coveredBy == null) { vm.setStaple(item.name, !item.ticked) }
                        .padding(vertical = 2.dp),
                ) {
                    Checkbox(checked = effective, onCheckedChange = null, enabled = item.coveredBy == null, modifier = Modifier.padding(12.dp))
                    Column {
                        Text(item.name.replaceFirstChar { it.uppercase() }, style = MaterialTheme.typography.bodyLarge)
                        item.coveredBy?.let {
                            Text("Covered by \"$it\"", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
            item {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedTextField(
                        value = newStaple,
                        onValueChange = { newStaple = it },
                        label = { Text("Add something you always have") },
                        singleLine = true,
                        modifier = Modifier.weight(1f),
                    )
                    Button(onClick = { vm.addStaple(newStaple); newStaple = "" }, enabled = newStaple.isNotBlank()) { Text("Add") }
                }
            }

            item { SectionHeader("Backup") }
            item {
                Text(
                    "Export writes everything (recipes, plans, workouts, history, settings) to one file. Import reads it back. Use it before switching phones.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp), modifier = Modifier.padding(top = 8.dp)) {
                    Button(onClick = { exportLauncher.launch("meal-gym-backup-${LocalDate.now()}.json") }, modifier = Modifier.weight(1f)) {
                        Text("Export")
                    }
                    OutlinedButton(
                        onClick = { importLauncher.launch(arrayOf("application/json", "text/plain", "application/octet-stream")) },
                        modifier = Modifier.weight(1f),
                    ) { Text("Import") }
                }
            }

            item { SectionHeader("More") }
            item { ListItem(headlineContent = { Text("History") }, modifier = Modifier.clickable(onClick = nav::history)) }
            item {
                Text(
                    "Meal & Gym works offline. Nothing leaves this phone unless you export a backup or share a shopping list.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.padding(top = 8.dp),
                )
            }
        }
    }

    importUri?.let { uri ->
        ConfirmDialog(
            title = "Replace everything?",
            body = "Importing replaces all recipes, plans, workouts, history and settings on this phone with the ones in the backup.",
            confirmLabel = "Import",
            onConfirm = { importUri = null; vm.import(uri) },
            onDismiss = { importUri = null },
        )
    }
}

@Composable
private fun SwitchRow(title: String, body: String, checked: Boolean, onChange: (Boolean) -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().clickable { onChange(!checked) }.padding(vertical = 8.dp),
    ) {
        Column(Modifier.weight(1f).padding(end = 12.dp)) {
            Text(title, style = MaterialTheme.typography.bodyLarge)
            Text(body, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(checked = checked, onCheckedChange = onChange)
    }
}
