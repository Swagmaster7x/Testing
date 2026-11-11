@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.history

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
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.MealSlot
import com.personal.mealgym.data.db.WorkoutSession
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import java.time.LocalDate

data class HistoryDay(
    val date: LocalDate,
    val meals: List<Pair<MealSlot, String>>,
    val workouts: List<WorkoutSession>,
    val saunaMinutes: List<Int>,
)

/** A plain, read-only list by date. No charts, no totals across days. */
class HistoryViewModel(c: AppContainer) : MessageViewModel() {
    val ui: StateFlow<List<HistoryDay>?> = c.today.flatMapLatest { today ->
        combine(c.meals.planUpTo(today), c.meals.recipes, c.gym.sessions, c.gym.saunaLogs) { plan, recipes, sessions, sauna ->
            val names = recipes.associate { it.id to it.name }
            val todayIso = Dates.iso(today)
            val dates = (plan.map { it.date } + sessions.map { it.date } + sauna.map { it.date })
                .filter { it <= todayIso }
                .distinct()
                .sortedDescending()
            dates.map { iso ->
                HistoryDay(
                    date = Dates.parse(iso),
                    meals = plan.filter { it.date == iso }
                        .sortedBy { it.slot.ordinal }
                        .mapNotNull { entry -> names[entry.recipeId]?.let { entry.slot to it } },
                    workouts = sessions.filter { it.date == iso }.sortedBy { it.id },
                    saunaMinutes = sauna.filter { it.date == iso }.sortedBy { it.id }.map { it.minutes },
                )
            }
        }
    }.stateInVm(null)
}

@Composable
fun HistoryScreen(nav: AppNavigator, vm: HistoryViewModel = viewModel(factory = AppViewModels.Factory)) {
    val days by vm.ui.collectAsStateWithLifecycle()
    AppScaffold(topBar = { DetailTopBar(title = "History", onBack = nav::back) }) { padding ->
        val list = days ?: return@AppScaffold
        if (list.isEmpty()) {
            EmptyState(
                title = "Nothing here yet",
                body = "Days show up here once you plan meals, finish a workout or use the sauna.",
                modifier = Modifier.padding(padding),
            )
            return@AppScaffold
        }
        LazyColumn(
            modifier = Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            items(list, key = { it.date.toString() }) { day -> HistoryCard(day) }
        }
    }
}

@Composable
private fun HistoryCard(day: HistoryDay) {
    ElevatedCard(Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Text(Dates.longLabel(day.date), style = MaterialTheme.typography.titleMedium)
            day.meals.forEach { (slot, name) -> Line(slot.label, name) }
            day.workouts.forEach { w ->
                Line("Gym", "Day ${w.dayOrder}: ${w.dayName} · ${w.feeling.label}${w.note?.let { " · $it" } ?: ""}")
            }
            if (day.saunaMinutes.isNotEmpty()) {
                Line("Sauna", day.saunaMinutes.joinToString(" + ") + " min")
            }
        }
    }
}

@Composable
private fun Line(label: String, text: String) {
    Row {
        Text(
            label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            modifier = Modifier.width(80.dp),
        )
        Text(text, style = MaterialTheme.typography.bodyMedium)
    }
}
