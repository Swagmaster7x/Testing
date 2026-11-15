package com.personal.mealgym.ui.cook

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.Checkbox
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.Icon
import androidx.compose.material3.InputChip
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.R
import com.personal.mealgym.cook.CookTimer
import com.personal.mealgym.domain.StepTimers
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.formatClock
import com.personal.mealgym.ui.sauna.rememberSecondsLeft
import com.personal.mealgym.ui.components.AppButton
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.displayLine
import kotlinx.coroutines.launch

/** Step-by-step cooking: large text, one step per page, screen kept on. */
@Composable
fun CookingModeScreen(nav: AppNavigator, vm: RecipeViewModel = viewModel(factory = AppViewModels.Factory)) {
    val state by vm.state.collectAsStateWithLifecycle()
    val ui = (state as? RecipeState.Loaded)?.ui

    val view = LocalView.current
    DisposableEffect(view) {
        view.keepScreenOn = true
        onDispose { view.keepScreenOn = false }
    }

    AppScaffold(topBar = { DetailTopBar(title = ui?.recipe?.name ?: "Cooking", onBack = nav::back) }) { padding ->
        if (ui == null) return@AppScaffold
        val steps = ui.recipe.steps
        val pageCount = steps.size + 1
        val pager = rememberPagerState(pageCount = { pageCount })
        val scope = rememberCoroutineScope()
        val gathered = remember { mutableStateListOf<Long>() }
        val timers by vm.timers.collectAsStateWithLifecycle()
        var cooked by rememberSaveable { mutableStateOf(false) }

        Column(Modifier.fillMaxSize().padding(padding)) {
            LinearProgressIndicator(
                progress = { (pager.currentPage + 1f) / pageCount },
                modifier = Modifier.fillMaxWidth(),
            )
            // Running timers stay in view on every step, whichever recipe started them.
            if (timers.isNotEmpty()) {
                TimerStrip(timers, onDismiss = vm::dismissTimer)
                // Unlike the sauna timer, nothing keeps these going once the phone sleeps.
                if (timers.any { !it.done }) {
                    Text(
                        "Timers run while the app is open. This screen keeps the phone awake.",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.padding(horizontal = 16.dp),
                    )
                }
            }
            HorizontalPager(state = pager, modifier = Modifier.weight(1f)) { page ->
                Column(
                    Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(24.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                ) {
                    if (page == 0) {
                        Text("Get these out", style = MaterialTheme.typography.titleLarge, color = MaterialTheme.colorScheme.primary)
                        if (ui.scale != 1.0) {
                            Text(
                                "For ${ui.scaledServings} servings. The steps still mention the amounts for ${ui.recipe.servings}.",
                                style = MaterialTheme.typography.bodyLarge,
                                color = MaterialTheme.colorScheme.onSurfaceVariant,
                            )
                        }
                        ui.ingredients.forEach { ing ->
                            val done = ing.id in gathered
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.fillMaxWidth().clickable {
                                    if (done) gathered.remove(ing.id) else gathered.add(ing.id)
                                },
                            ) {
                                Checkbox(checked = done, onCheckedChange = null, modifier = Modifier.padding(end = 12.dp))
                                Text(
                                    ing.displayLine(),
                                    fontSize = 22.sp,
                                    lineHeight = 28.sp,
                                    textDecoration = if (done) TextDecoration.LineThrough else null,
                                )
                            }
                        }
                    } else {
                        Text(
                            "Step $page of ${steps.size}",
                            style = MaterialTheme.typography.titleLarge,
                            color = MaterialTheme.colorScheme.primary,
                        )
                        Text(steps[page - 1], fontSize = 30.sp, lineHeight = 40.sp)
                        // A timer for each time the step mentions; a range starts at its shorter end.
                        StepTimers.find(steps[page - 1]).forEach { time ->
                            OutlinedButton(onClick = { vm.startTimer(page, time.seconds) }, modifier = Modifier.fillMaxWidth()) {
                                Icon(painterResource(R.drawable.ic_timer), contentDescription = null, modifier = Modifier.padding(end = 8.dp).size(20.dp))
                                Text("Start ${time.buttonText}", fontSize = 18.sp)
                            }
                        }
                        if (page == steps.size) {
                            FilledTonalButton(onClick = { cooked = true }, modifier = Modifier.fillMaxWidth().padding(top = 8.dp)) {
                                Text("I cooked it", fontSize = 18.sp)
                            }
                        }
                    }
                }
            }
            Row(
                Modifier.fillMaxWidth().padding(16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                OutlinedButton(
                    onClick = { scope.launch { pager.animateScrollToPage(pager.currentPage - 1) } },
                    enabled = pager.currentPage > 0,
                    modifier = Modifier.weight(1f),
                ) { Text("Back", fontSize = 18.sp) }
                val last = pager.currentPage == pageCount - 1
                AppButton(
                    onClick = {
                        if (last) nav.back() else scope.launch { pager.animateScrollToPage(pager.currentPage + 1) }
                    },
                    modifier = Modifier.weight(1f),
                ) { Text(if (last) "Done" else "Next", fontSize = 18.sp) }
            }
        }

        if (cooked) {
            val fromCupboard by vm.fromCupboard.collectAsStateWithLifecycle()
            CookedSheet(
                recipeName = ui.recipe.name,
                current = ui.rating,
                fromCupboard = fromCupboard,
                onSave = { rating, usedUp -> cooked = false; vm.logCooked(rating, usedUp, onDone = nav::back) },
                onDismiss = { cooked = false },
            )
        }
    }
}

/** Every running or finished timer as a chip: time left, or "done" until it's tapped away. */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun TimerStrip(timers: List<CookTimer>, onDismiss: (Long) -> Unit) {
    FlowRow(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 4.dp),
    ) {
        timers.forEach { timer ->
            val left = if (timer.done) 0 else rememberSecondsLeft(timer.endAtMillis)
            val finished = timer.done || left <= 0
            InputChip(
                selected = finished,
                onClick = { onDismiss(timer.id) },
                label = {
                    Text(
                        (if (finished) "Done" else formatClock(left)) + " · " + timer.label,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                },
                trailingIcon = {
                    Icon(Icons.Filled.Close, contentDescription = if (finished) "Clear this timer" else "Stop this timer", modifier = Modifier.size(18.dp))
                },
            )
        }
    }
}
