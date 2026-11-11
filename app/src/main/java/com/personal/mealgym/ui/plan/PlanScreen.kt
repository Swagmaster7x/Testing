@file:OptIn(ExperimentalMaterial3Api::class)

package com.personal.mealgym.ui.plan

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material.icons.filled.ShoppingCart
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Checkbox
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.label
import com.personal.mealgym.ui.theme.MaterialThemeCarvedLabel
import java.time.LocalDate

private data class SlotRef(val date: LocalDate, val slot: MealSlot, val recipe: Recipe?)

@Composable
fun PlanScreen(nav: AppNavigator, vm: PlanViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var picking by remember { mutableStateOf<SlotRef?>(null) }
    var acting by remember { mutableStateOf<SlotRef?>(null) }
    var copying by remember { mutableStateOf<SlotRef?>(null) }

    AppScaffold(
        topBar = { TabTopBar(title = "Plan", onHistory = nav::history, onSettings = nav::settings) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui ?: return@AppScaffold
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            item { WeekSwitcher(state, onShift = vm::shiftWeek, onThisWeek = vm::goToThisWeek) }
            item {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    OutlinedButton(
                        onClick = vm::repeatLastWeek,
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(horizontal = 12.dp),
                    ) {
                        Icon(painterResource(R.drawable.ic_copy), contentDescription = null, modifier = Modifier.padding(end = 6.dp).size(18.dp))
                        Text("Repeat last week", maxLines = 1)
                    }
                    FilledTonalButton(
                        onClick = nav::shopping,
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(horizontal = 12.dp),
                    ) {
                        Icon(Icons.Filled.ShoppingCart, contentDescription = null, modifier = Modifier.padding(end = 6.dp).size(18.dp))
                        Text("Shopping list", maxLines = 1)
                    }
                }
            }
            items(state.days, key = { it.date.toString() }) { day ->
                DayRow(
                    day = day,
                    isToday = day.date == state.today,
                    onSlot = { slot, recipe ->
                        val ref = SlotRef(day.date, slot, recipe)
                        if (recipe == null) picking = ref else acting = ref
                    },
                )
            }
        }

        picking?.let { target ->
            RecipePickerSheet(
                slot = target.slot,
                dateLabel = Dates.longLabel(target.date),
                recipes = state.recipes,
                onPick = { vm.setSlot(target.date, target.slot, it); picking = null },
                onFillBatch = { vm.fillBatch(target.date, target.slot, it); picking = null },
                onDismiss = { picking = null },
            )
        }

        acting?.let { target ->
            SlotActionsSheet(
                target = target,
                onOpen = { acting = null; target.recipe?.let { nav.recipe(it.id) } },
                onChange = { acting = null; picking = target },
                onCopy = { acting = null; copying = target },
                onClear = { acting = null; vm.clearSlot(target.date, target.slot) },
                onDismiss = { acting = null },
            )
        }

        copying?.let { target ->
            val recipe = target.recipe ?: return@let
            CopyDialog(
                target = target,
                days = state.days,
                onCopy = { dates -> vm.copyTo(dates, target.slot, recipe); copying = null },
                onDismiss = { copying = null },
            )
        }
    }
}

@Composable
private fun WeekSwitcher(state: PlanUi, onShift: (Long) -> Unit, onThisWeek: () -> Unit) {
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
        IconButton(onClick = { onShift(-1) }) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Previous week")
        }
        Column(Modifier.weight(1f), horizontalAlignment = Alignment.CenterHorizontally) {
            Text(state.weekName, style = MaterialThemeCarvedLabel)
            Text(Dates.weekLabel(state.weekStart), style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        if (!state.isThisWeek) {
            TextButton(onClick = onThisWeek) { Text("Today") }
        }
        IconButton(onClick = { onShift(1) }) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Next week")
        }
    }
}

@Composable
private fun DayRow(day: PlanDay, isToday: Boolean, onSlot: (MealSlot, Recipe?) -> Unit) {
    ElevatedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    Dates.shortLabel(day.date),
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = if (isToday) FontWeight.Bold else FontWeight.Medium,
                    color = if (isToday) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface,
                )
                if (isToday) {
                    Text(
                        "  Today",
                        style = MaterialTheme.typography.labelMedium,
                        color = MaterialTheme.colorScheme.primary,
                    )
                }
            }
            Row(Modifier.height(IntrinsicSize.Min), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                MealSlot.entries.forEach { slot ->
                    SlotTile(
                        slot = slot,
                        recipe = day.slots[slot],
                        onClick = { onSlot(slot, day.slots[slot]) },
                        modifier = Modifier.weight(1f).fillMaxHeight(),
                    )
                }
            }
        }
    }
}

@Composable
private fun SlotTile(slot: MealSlot, recipe: Recipe?, onClick: () -> Unit, modifier: Modifier = Modifier) {
    val filled = recipe != null
    Surface(
        modifier = modifier.heightIn(min = 72.dp).clickable(onClick = onClick),
        shape = MaterialTheme.shapes.medium,
        color = if (filled) MaterialTheme.colorScheme.primaryContainer else MaterialTheme.colorScheme.surface,
        contentColor = if (filled) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant,
        border = if (filled) null else BorderStroke(1.dp, MaterialTheme.colorScheme.outlineVariant),
    ) {
        Column(Modifier.padding(8.dp), verticalArrangement = Arrangement.spacedBy(2.dp)) {
            Text(slot.label, style = MaterialTheme.typography.labelSmall, fontWeight = FontWeight.SemiBold)
            Text(
                recipe?.name ?: "+ Add",
                style = MaterialTheme.typography.bodySmall,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
private fun SlotActionsSheet(
    target: SlotRef,
    onOpen: () -> Unit,
    onChange: () -> Unit,
    onCopy: () -> Unit,
    onClear: () -> Unit,
    onDismiss: () -> Unit,
) {
    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(Modifier.padding(bottom = 24.dp)) {
            Text(
                "${Dates.shortLabel(target.date)} · ${target.slot.label}",
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(horizontal = 16.dp),
            )
            Text(
                target.recipe?.name.orEmpty(),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 4.dp),
            )
            ListItem(headlineContent = { Text("Open recipe") }, modifier = Modifier.clickable(onClick = onOpen))
            ListItem(headlineContent = { Text("Change") }, modifier = Modifier.clickable(onClick = onChange))
            ListItem(headlineContent = { Text("Copy to other days") }, modifier = Modifier.clickable(onClick = onCopy))
            ListItem(headlineContent = { Text("Clear this slot") }, modifier = Modifier.clickable(onClick = onClear))
        }
    }
}

@Composable
private fun CopyDialog(
    target: SlotRef,
    days: List<PlanDay>,
    onCopy: (List<LocalDate>) -> Unit,
    onDismiss: () -> Unit,
) {
    val chosen = remember { mutableStateListOf<LocalDate>() }
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Copy ${target.slot.label.lowercase()} to…") },
        text = {
            Column {
                Text(target.recipe?.name.orEmpty(), style = MaterialTheme.typography.bodyMedium)
                days.filter { it.date != target.date }.forEach { day ->
                    val current = day.slots[target.slot]
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { if (day.date in chosen) chosen.remove(day.date) else chosen.add(day.date) },
                    ) {
                        Checkbox(checked = day.date in chosen, onCheckedChange = null, modifier = Modifier.padding(12.dp))
                        Column {
                            Text(Dates.shortLabel(day.date))
                            if (current != null) {
                                Text(
                                    "Replaces ${current.name}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                )
                            }
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = { onCopy(chosen.toList()) }, enabled = chosen.isNotEmpty()) { Text("Copy") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
    )
}
