@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.gym

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.ElevatedCard
import androidx.compose.material3.Icon
import androidx.compose.material3.ListItem
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.WeightUnit
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.domain.LiftDay
import com.personal.mealgym.domain.MuscleGroup
import com.personal.mealgym.domain.Muscles
import com.personal.mealgym.domain.Progression
import com.personal.mealgym.domain.Suggestion
import com.personal.mealgym.domain.WeekSummary
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.components.Badge
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.EmptyState
import com.personal.mealgym.ui.components.SectionHeader
import com.personal.mealgym.ui.label
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import java.time.LocalDate

/** One exercise on the progress list. */
data class ExerciseRow(
    val name: String,
    val group: MuscleGroup,
    val lastDate: LocalDate,
    val last: String,
    val best: String?,
    val workouts: Int,
)

data class ProgressUi(
    val thisWeek: WeekSummary,
    val lastWeek: WeekSummary,
    val rows: List<ExerciseRow>,
    val unit: WeightUnit,
)

/** The week at a glance and every exercise that has something logged. Nothing here is a target or a streak. */
class ProgressViewModel(c: AppContainer) : MessageViewModel() {
    private val profileId = c.currentProfileId()

    val ui: StateFlow<ProgressUi?> = c.today.flatMapLatest { today ->
        combine(c.gym.loggedSets(profileId), c.gym.sessions(profileId), c.settings.settings(profileId)) { logged, sessions, s ->
            val week = Dates.weekStart(today)
            val dates = sessions.map { Dates.parse(it.date) }
            val names = logged.associate { it.exerciseNameUsed.lowercase() to it.exerciseNameUsed }
            val rows = Progression.history(logged).mapNotNull { (key, days) ->
                val last = Progression.lastLogged(days) ?: return@mapNotNull null
                val name = names[key] ?: key
                ExerciseRow(
                    name = name,
                    group = Muscles.groupOf(name),
                    lastDate = last.date,
                    last = Progression.describe(last.sets).orEmpty(),
                    best = Progression.best(days)?.let { (set, _) -> Progression.describe(listOf(set)) },
                    workouts = days.count { it.sets.isNotEmpty() },
                )
            }.sortedWith(compareByDescending<ExerciseRow> { it.lastDate }.thenBy { it.name.lowercase() })
            ProgressUi(
                thisWeek = Progression.week(week, dates, s.trainingWeekdays.size, logged),
                lastWeek = Progression.week(week.minusWeeks(1), dates, s.trainingWeekdays.size, logged),
                rows = rows,
                unit = s.weightUnit,
            )
        }
    }.stateInVm(null)
}

data class ExerciseProgressUi(
    val name: String,
    /** Newest first. */
    val days: List<LiftDay>,
    /** Oldest first: one point per workout. */
    val trend: List<Pair<LocalDate, Double>>,
    val bestDay: LocalDate?,
    val best: String?,
    /** True when the trend is the heaviest weight each workout; false when it counts reps (bodyweight). */
    val byWeight: Boolean,
    val unit: WeightUnit,
    val next: Suggestion?,
)

class ExerciseProgressViewModel(c: AppContainer, handle: SavedStateHandle) : MessageViewModel() {
    private val profileId = c.currentProfileId()
    val name: String = handle.get<String>("name").orEmpty()

    val ui: StateFlow<ExerciseProgressUi?> = combine(
        c.gym.lifts(profileId),
        c.settings.settings(profileId),
        c.gym.days(profileId),
        c.gym.exercises,
    ) { lifts, s, days, exercises ->
        val history = lifts[name.lowercase()].orEmpty().filter { it.sets.isNotEmpty() }
        val best = Progression.best(history)
        // The plan's rep range for this move: its own, or the exercise it's a swap for.
        val dayIds = days.map { it.id }.toSet()
        val planned = exercises.filter { it.workoutDayId in dayIds }.firstOrNull { e ->
            e.name.equals(name, ignoreCase = true) || e.alternatives.any { it.equals(name, ignoreCase = true) }
        }
        ExerciseProgressUi(
            name = name,
            days = history.reversed(),
            trend = Progression.trend(history),
            bestDay = best?.second,
            best = best?.let { (set, _) -> Progression.describe(listOf(set)) },
            byWeight = (best?.first?.weight ?: 0.0) > 0,
            unit = s.weightUnit,
            next = if (s.suggestLifts && planned != null) history.lastOrNull()?.let { Progression.next(it, planned.repsText, s.weightUnit) } else null,
        )
    }.stateInVm(null)
}

@Composable
fun ProgressScreen(nav: AppNavigator, vm: ProgressViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    AppScaffold(topBar = { DetailTopBar(title = "Lifting progress", onBack = nav::back) }) { padding ->
        val state = ui ?: return@AppScaffold
        LazyColumn(Modifier.fillMaxSize().padding(padding), contentPadding = PaddingValues(bottom = 24.dp)) {
            item { WeekCard(state.thisWeek, state.lastWeek, Modifier.padding(horizontal = 16.dp)) }
            item { SectionHeader("Exercises", Modifier.padding(horizontal = 16.dp)) }
            if (state.rows.isEmpty()) {
                item {
                    EmptyState(
                        title = "Nothing logged yet",
                        body = "On the Gym tab, write a weight and reps on an exercise, tick your sets and finish the workout. " +
                            "Each exercise shows up here with its trend and your best.",
                    )
                }
            }
            items(state.rows, key = { it.name.lowercase() }) { row ->
                ListItem(
                    modifier = Modifier.clickable { nav.exerciseProgress(row.name) },
                    headlineContent = { Text(row.name) },
                    supportingContent = {
                        Column {
                            Text("Last: ${row.last} · ${Dates.monthDay(row.lastDate)}")
                            row.best?.let { Text("Best: $it") }
                        }
                    },
                    trailingContent = { Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = null) },
                )
            }
        }
    }
}

@Composable
private fun WeekCard(week: WeekSummary, lastWeek: WeekSummary, modifier: Modifier = Modifier) {
    ElevatedCard(modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Text("This week", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(workoutsText(week), style = MaterialTheme.typography.headlineSmall)
            if (week.sets > 0) {
                Text("${setsText(week.sets)} ticked off", style = MaterialTheme.typography.bodyLarge)
                val most = week.byGroup.maxOf { it.second }
                week.byGroup.forEach { (group, sets) -> GroupBar(group.label, sets, most) }
            } else if (week.sessions > 0) {
                Text(
                    "Tick sets as you train and they're counted here by muscle group.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            if (lastWeek.sessions > 0) {
                Text(
                    "Last week: ${workoutsText(lastWeek)}" + if (lastWeek.sets > 0) ", ${setsText(lastWeek.sets)}" else "",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
        }
    }
}

private fun setsText(sets: Int): String = if (sets == 1) "1 set" else "$sets sets"

private fun workoutsText(week: WeekSummary): String {
    val noun = if (week.sessions == 1 && week.planned <= 1) "workout" else "workouts"
    return if (week.planned > 0) "${week.sessions} of ${week.planned} $noun" else "${week.sessions} $noun"
}

/** One muscle group's sets as a labelled bar, scaled to the busiest group. */
@Composable
private fun GroupBar(label: String, sets: Int, most: Int) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.fillMaxWidth().semantics(mergeDescendants = true) { contentDescription = "$label: $sets sets" },
    ) {
        Text(label, style = MaterialTheme.typography.bodyMedium, modifier = Modifier.width(132.dp))
        Box(Modifier.weight(1f).height(10.dp)) {
            Box(
                Modifier
                    .fillMaxHeight()
                    .fillMaxWidth((sets.toFloat() / most.coerceAtLeast(1)).coerceIn(0.04f, 1f))
                    .clip(MaterialTheme.shapes.extraSmall)
                    .background(MaterialTheme.colorScheme.primary),
            )
        }
        Text("$sets", style = MaterialTheme.typography.bodyMedium, modifier = Modifier.padding(start = 8.dp).width(28.dp))
    }
}

@Composable
fun ExerciseProgressScreen(nav: AppNavigator, vm: ExerciseProgressViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    AppScaffold(topBar = { DetailTopBar(title = vm.name, onBack = nav::back) }) { padding ->
        val state = ui ?: return@AppScaffold
        if (state.days.isEmpty()) {
            EmptyState(
                title = "Nothing logged yet",
                body = "Write a weight and reps for this exercise, tick your sets and finish the workout.",
                modifier = Modifier.padding(padding),
            )
            return@AppScaffold
        }
        LazyColumn(
            Modifier.fillMaxSize().padding(padding),
            contentPadding = PaddingValues(start = 16.dp, end = 16.dp, bottom = 24.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            item {
                ElevatedCard(Modifier.fillMaxWidth()) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text("Best", style = MaterialTheme.typography.labelLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        Text(
                            listOfNotNull(state.best?.let { withUnit(it, state) }, state.bestDay?.let(Dates::monthDay)).joinToString(" · "),
                            style = MaterialTheme.typography.headlineSmall,
                        )
                        Text(
                            if (state.days.size == 1) "Logged in 1 workout" else "Logged in ${state.days.size} workouts",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        state.next?.let { next ->
                            Text("Next time: try ${next.text}", style = MaterialTheme.typography.titleSmall, modifier = Modifier.padding(top = 6.dp))
                            Text(next.reason, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                    }
                }
            }
            if (state.trend.size >= 2) {
                item { SectionHeader("Trend") }
                item { TrendChart(state.trend, state.byWeight, state.unit) }
                item {
                    Text(
                        if (state.byWeight) {
                            "The heaviest weight each workout, in ${state.unit.label}. Reps at that weight are in the list below."
                        } else {
                            "The most reps in one set each workout."
                        },
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
            item { SectionHeader("Every workout") }
            items(state.days, key = { it.sessionId }) { day ->
                Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp)) {
                    Column(Modifier.weight(1f)) {
                        Text(Dates.shortLabel(day.date), style = MaterialTheme.typography.titleSmall)
                        Text(Progression.describe(day.sets).orEmpty(), style = MaterialTheme.typography.bodyLarge)
                        Text("Felt ${day.feeling.label.lowercase()}", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    }
                    if (day.date == state.bestDay) Badge("Best")
                }
            }
        }
    }
}

private fun withUnit(text: String, state: ExerciseProgressUi): String = if (state.byWeight) "$text ${state.unit.label}" else text

/**
 * A plain line through one point per workout, spaced by date. The highest and lowest values
 * label the left edge and the first and last dates the bottom.
 */
@Composable
private fun TrendChart(points: List<Pair<LocalDate, Double>>, byWeight: Boolean, unit: WeightUnit) {
    val line = MaterialTheme.colorScheme.primary
    val grid = MaterialTheme.colorScheme.outlineVariant
    val low = points.minOf { it.second }
    val high = points.maxOf { it.second }
    val span = (high - low).takeIf { it > 0.0 } ?: 1.0
    val first = points.first().first
    val days = (points.last().first.toEpochDay() - first.toEpochDay()).coerceAtLeast(1)
    fun value(v: Double) = if (byWeight) "${Math.round(v)} ${unit.label}" else "${Math.round(v)} reps"
    val summary = "Trend: ${value(points.first().second)} on ${Dates.monthDay(first)}, " +
        "${value(points.last().second)} on ${Dates.monthDay(points.last().first)}. Highest ${value(high)}."

    Column(Modifier.fillMaxWidth().semantics(mergeDescendants = true) { contentDescription = summary }) {
        Row(Modifier.fillMaxWidth().height(180.dp)) {
            Column(Modifier.fillMaxHeight().padding(end = 8.dp), verticalArrangement = Arrangement.SpaceBetween) {
                Text(value(high), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Text(value(low), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Canvas(Modifier.weight(1f).fillMaxHeight().padding(vertical = 8.dp)) {
                val inset = 6.dp.toPx()
                val width = size.width - 2 * inset
                listOf(0f, 0.5f, 1f).forEach { f ->
                    drawLine(grid, Offset(0f, size.height * f), Offset(size.width, size.height * f), strokeWidth = 1.dp.toPx())
                }
                val spots = points.map { (date, v) ->
                    val x = inset + width * ((date.toEpochDay() - first.toEpochDay()).toFloat() / days)
                    val y = size.height * (1f - ((v - low) / span).toFloat())
                    Offset(x, y)
                }
                val path = Path().apply {
                    moveTo(spots.first().x, spots.first().y)
                    spots.drop(1).forEach { lineTo(it.x, it.y) }
                }
                drawPath(path, line, style = Stroke(width = 3.dp.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round))
                spots.forEach { drawCircle(line, radius = 4.5.dp.toPx(), center = it) }
            }
        }
        Row(Modifier.fillMaxWidth().padding(top = 4.dp), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(Dates.monthDay(first), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Text(Dates.monthDay(points.last().first), style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}
