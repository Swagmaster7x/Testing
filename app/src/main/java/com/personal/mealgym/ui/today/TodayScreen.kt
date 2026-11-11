package com.personal.mealgym.ui.today

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
import androidx.compose.material3.Card
import androidx.compose.material3.Button
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.LocalContentColor
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Scaffold
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
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.Routes
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.TabTopBar
import com.personal.mealgym.ui.components.formatClock
import com.personal.mealgym.ui.gym.title
import com.personal.mealgym.ui.label
import com.personal.mealgym.ui.plan.RecipePickerSheet
import com.personal.mealgym.ui.sauna.rememberSecondsLeft

@Composable
fun TodayScreen(nav: AppNavigator, vm: TodayViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var picking by rememberSaveable { mutableStateOf<MealSlot?>(null) }

    Scaffold(
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
            return@Scaffold
        }
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
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
        }

        val slot = picking
        if (slot != null) {
            RecipePickerSheet(
                slot = slot,
                dateLabel = "Today, ${Dates.longLabel(state.date)}",
                recipes = state.recipes,
                onPick = { vm.pick(state.date, slot, it); picking = null },
                onFillBatch = { vm.fillBatch(state.date, slot, it); picking = null },
                onDismiss = { picking = null },
            )
        }
    }
}

@Composable
private fun CardLabel(text: String, color: Color = MaterialTheme.colorScheme.primary) {
    Text(
        text.uppercase(),
        style = MaterialTheme.typography.labelMedium,
        color = color,
        fontWeight = FontWeight.SemiBold,
    )
}

@Composable
private fun MealCard(slot: MealSlot, recipe: Recipe?, onOpen: () -> Unit, onPick: () -> Unit) {
    if (recipe == null) {
        OutlinedCard(Modifier.fillMaxWidth()) {
            Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f)) {
                    CardLabel(slot.label)
                    Text("Nothing planned", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                FilledTonalButton(onClick = onPick) { Text("Pick") }
            }
        }
    } else {
        ElevatedCard(onClick = onOpen, modifier = Modifier.fillMaxWidth()) {
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
                        Text("Done: Day ${status.session.dayOrder}${session?.let { ": ${it.dayName}" } ?: ""}", style = MaterialTheme.typography.titleMedium)
                        session?.let { Text("How it went: ${it.feeling.label}", style = MaterialTheme.typography.bodyMedium) }
                    }
                    is GymToday.TrainingDay -> {
                        Text(day?.title() ?: "No workouts set up", style = MaterialTheme.typography.titleMedium)
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
                Button(onClick = onOpenGym) { Text(if (plan.draft != null) "Continue" else "Start") }
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
