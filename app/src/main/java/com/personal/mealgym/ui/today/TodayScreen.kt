package com.personal.mealgym.ui.today

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Card
import androidx.compose.material3.Checkbox
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.Recipe
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.GymToday
import com.personal.mealgym.sauna.SaunaState
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.LocalCopy
import com.personal.mealgym.ui.Routes
import com.personal.mealgym.data.seed.GuideLine
import com.personal.mealgym.ui.components.MotifStrip
import com.personal.mealgym.ui.components.sparkleOn
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.components.formatClock
import com.personal.mealgym.ui.gym.title
import com.personal.mealgym.ui.label
import com.personal.mealgym.ui.plan.RecipePickerSheet
import com.personal.mealgym.ui.sauna.rememberSecondsLeft
import com.personal.mealgym.ui.theme.MaterialThemeCarvedLabel

@Composable
fun TodayScreen(nav: AppNavigator, vm: TodayViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val filter by vm.filter.collectAsStateWithLifecycle()
    val profile by vm.profile.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var picking by rememberSaveable { mutableStateOf<MealSlot?>(null) }

    AppScaffold(
        topBar = {
            TabTopBar(
                title = "Today",
                subtitle = ui?.date?.let { Dates.longLabel(it) },
                onHistory = nav::history,
                onSettings = nav::settings,
            )
        },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui
        if (state == null) {
            Column(Modifier.fillMaxSize().padding(padding), horizontalAlignment = Alignment.CenterHorizontally) {
                CircularProgressIndicator(Modifier.padding(32.dp))
            }
            return@AppScaffold
        }
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            state.creatineTaken?.let { taken ->
                item { CreatineCard(taken) { vm.setCreatine(state.date, it) } }
            }
            items(state.meals, key = { it.first.name }) { (slot, recipe) ->
                MealCard(
                    slot = slot,
                    recipe = recipe,
                    onOpen = { recipe?.let { nav.recipe(it.id) } },
                    onPick = { picking = slot },
                )
            }
            item { GymCard(state, onOpenGym = { nav.tab(Routes.GYM) }) }
            item { SaunaCard(state, onOpenSauna = nav::sauna) }
            if (profile.easierToFinish && vm.dailyGuide.isNotEmpty()) {
                item { DailyGuideCard(vm.dailyGuide) }
            }
            if (profile.isGlam) item { MotifStrip(Modifier.padding(top = 8.dp)) }
        }

        val slot = picking
        if (slot != null) {
            RecipePickerSheet(
                slot = slot,
                dateLabel = "Today, ${Dates.longLabel(state.date)}",
                recipes = state.recipes,
                filter = filter,
                onFilterChange = vm::setFilter,
                onPick = { vm.pick(state.date, slot, it); picking = null },
                onFillBatch = { vm.fillBatch(state.date, slot, it); picking = null },
                onDismiss = { picking = null },
            )
        }
    }
}

@Composable
private fun CardLabel(text: String, color: Color = MaterialTheme.colorScheme.primary) {
    Text(text, style = MaterialThemeCarvedLabel, color = color)
}

@Composable
private fun MealCard(slot: MealSlot, recipe: Recipe?, onOpen: () -> Unit, onPick: () -> Unit) {
    if (recipe == null) {
        OutlinedCard(Modifier.fillMaxWidth()) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    CardLabel(slot.label)
                    Text(LocalCopy.current.nothingPlanned, style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                FilledTonalButton(onClick = onPick) { Text("Pick") }
            }
        }
    } else {
        ElevatedCard(onClick = onOpen, modifier = Modifier.fillMaxWidth().sparkleOn(recipe.id)) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    CardLabel(slot.label)
                    Text(recipe.name, style = MaterialTheme.typography.titleMedium)
                    Text(
                        listOf(recipe.cuisineTags.joinToString(", "), recipe.servingSizeText).filter { it.isNotBlank() }.joinToString(" · "),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                TextButton(onClick = onPick) { Text("Change") }
            }
        }
    }
}

@Composable
private fun GymCard(state: TodayUi, onOpenGym: () -> Unit) {
    val plan = state.gym
    val day = plan.activeDay
    Card(
        onClick = onOpenGym,
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer),
    ) {
        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(R.drawable.ic_fitness), contentDescription = null)
            Spacer(Modifier.width(16.dp))
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                CardLabel("Gym", color = LocalContentColor.current)
                when (val status = plan.status) {
                    is GymToday.Done -> {
                        val session = plan.doneSession
                        val dayText = "Day ${status.session.dayOrder}${session?.let { ": ${it.dayName}" } ?: ""}"
                        if (LocalCopy.current.playful) {
                            Text(LocalCopy.current.doneToday, style = MaterialTheme.typography.titleMedium)
                            Text(dayText, style = MaterialTheme.typography.bodyMedium)
                        } else {
                            Text("Done: $dayText", style = MaterialTheme.typography.titleMedium)
                        }
                        session?.let { Text("How it went: ${it.feeling.label}", style = MaterialTheme.typography.bodyMedium) }
                    }
                    is GymToday.TrainingDay -> {
                        Text(day?.let { LocalCopy.current.workoutHeadline(it) } ?: "No workouts set up", style = MaterialTheme.typography.titleMedium)
                        val detail = if (plan.draft != null) "In progress · ${state.setsTicked} sets ticked" else "${state.exerciseCount} exercises"
                        Text(detail, style = MaterialTheme.typography.bodyMedium)
                    }
                    is GymToday.RestDay -> {
                        if (plan.draft != null && day != null) {
                            Text(day.title(), style = MaterialTheme.typography.titleMedium)
                            Text("In progress · ${state.setsTicked} sets ticked", style = MaterialTheme.typography.bodyMedium)
                        } else {
                            Text("Rest day", style = MaterialTheme.typography.titleMedium)
                            day?.let { Text("Next up: ${it.title()}", style = MaterialTheme.typography.bodyMedium) }
                        }
                    }
                }
            }
            if (plan.status is GymToday.TrainingDay || plan.draft != null) {
                AppButton(onClick = onOpenGym) { Text(if (plan.draft != null) "Continue" else "Start") }
            }
        }
    }
}

@Composable
private fun SaunaCard(state: TodayUi, onOpenSauna: () -> Unit) {
    OutlinedCard(onClick = onOpenSauna, modifier = Modifier.fillMaxWidth()) {
        Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(painterResource(R.drawable.ic_timer), contentDescription = null)
            Spacer(Modifier.width(16.dp))
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                CardLabel("Sauna")
                when (val sauna = state.sauna) {
                    is SaunaState.Running -> {
                        val left = rememberSecondsLeft(sauna.endAtMillis)
                        Text("Running · ${formatClock(left)} left", style = MaterialTheme.typography.titleMedium)
                    }
                    else -> {
                        Text(
                            if (state.saunaMinutesToday > 0) "${state.saunaMinutesToday} min today" else "Timer: 10, 15 or 20 min",
                            style = MaterialTheme.typography.titleMedium,
                        )
                    }
                }
            }
            TextButton(onClick = onOpenSauna) { Text("Open") }
        }
    }
}

@Composable
private fun CreatineCard(taken: Boolean, onChange: (Boolean) -> Unit) {
    OutlinedCard(Modifier.fillMaxWidth()) {
        Row(
            Modifier.fillMaxWidth().clickable { onChange(!taken) }.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Checkbox(checked = taken, onCheckedChange = null, modifier = Modifier.padding(12.dp).sparkleOn(taken))
            Column {
                Text("Creatine, 3 g", style = MaterialTheme.typography.titleMedium)
                Text("Any time of day", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

/** Ashley's daily guide: reference text only, never totals or targets. */
@Composable
private fun DailyGuideCard(lines: List<GuideLine>) {
    var open by rememberSaveable { mutableStateOf(false) }
    OutlinedCard(Modifier.fillMaxWidth()) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth().clickable { open = !open }.padding(16.dp),
        ) {
            Icon(painterResource(R.drawable.ic_heart), contentDescription = null, tint = MaterialTheme.colorScheme.primary)
            Spacer(Modifier.width(16.dp))
            Column(Modifier.weight(1f)) {
                CardLabel("Daily guide")
                Text("Approximate, for reference", style = MaterialTheme.typography.bodyMedium)
            }
            Icon(if (open) Icons.Filled.KeyboardArrowUp else Icons.Filled.KeyboardArrowDown, contentDescription = null)
        }
        AnimatedVisibility(open) {
            Column(Modifier.padding(start = 16.dp, end = 16.dp, bottom = 16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                lines.forEach { line ->
                    Row {
                        Text(line.label, style = MaterialTheme.typography.labelLarge, modifier = Modifier.width(76.dp))
                        Text(line.text, style = MaterialTheme.typography.bodyMedium)
                    }
                }
                Text(
                    "Estimates only, never totals or targets. If appetite or weight ever worries you, that's a chat for a doctor or dietitian, not this app.",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}
