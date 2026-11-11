@file:OptIn(ExperimentalCoroutinesApi::class)

package com.personal.mealgym.ui.sauna

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.produceState
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.compose.viewModel
import com.personal.mealgym.AppContainer
import com.personal.mealgym.data.db.SaunaLog
import com.personal.mealgym.domain.Dates
import com.personal.mealgym.sauna.SaunaState
import com.personal.mealgym.sauna.SaunaTimer
import com.personal.mealgym.ui.AppNavigator
import com.personal.mealgym.ui.components.AppScaffold
import com.personal.mealgym.ui.AppViewModels
import com.personal.mealgym.ui.MessageViewModel
import com.personal.mealgym.ui.ShowMessages
import com.personal.mealgym.ui.components.DetailTopBar
import com.personal.mealgym.ui.components.MinutesDialog
import com.personal.mealgym.ui.components.formatClock
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.combine
import kotlinx.coroutines.flow.flatMapLatest
import kotlinx.coroutines.launch

data class SaunaUi(val state: SaunaState, val minutesToday: Int, val todayLogs: List<SaunaLog>)

class SaunaViewModel(private val c: AppContainer) : MessageViewModel() {
    val ui: StateFlow<SaunaUi?> = c.today.flatMapLatest { date ->
        combine(SaunaTimer.state, c.gym.saunaLogs) { state, logs ->
            val today = logs.filter { it.date == Dates.iso(date) }
            SaunaUi(state, today.sumOf { it.minutes }, today)
        }
    }.stateInVm(null)

    fun logByHand(minutes: Int) {
        viewModelScope.launch {
            c.gym.logSauna(c.today.value, minutes)
            say("$minutes min logged for today.")
        }
    }
}

/** Seconds until [endAtMillis], ticking while on screen. */
@Composable
fun rememberSecondsLeft(endAtMillis: Long): Long {
    val left by produceState(initialValue = secondsUntil(endAtMillis), endAtMillis) {
        while (true) {
            value = secondsUntil(endAtMillis)
            if (value <= 0) break
            delay(250)
        }
    }
    return left
}

private fun secondsUntil(endAtMillis: Long): Long =
    ((endAtMillis - System.currentTimeMillis() + 999) / 1000).coerceAtLeast(0)

@Composable
fun SaunaScreen(nav: AppNavigator, vm: SaunaViewModel = viewModel(factory = AppViewModels.Factory)) {
    val ui by vm.ui.collectAsStateWithLifecycle()
    val context = LocalContext.current
    val snackbar = remember { SnackbarHostState() }
    vm.ShowMessages(snackbar)
    var custom by rememberSaveable { mutableStateOf(false) }
    var byHand by rememberSaveable { mutableStateOf(false) }
    var pendingMinutes by rememberSaveable { mutableStateOf<Int?>(null) }

    // Ask for the notification permission the first time; the timer runs either way.
    val permission = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) {
        pendingMinutes?.let { SaunaTimer.start(context, it) }
        pendingMinutes = null
    }
    val start: (Int) -> Unit = { minutes ->
        val needsAsk = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU &&
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED
        if (needsAsk) {
            pendingMinutes = minutes
            permission.launch(Manifest.permission.POST_NOTIFICATIONS)
        } else {
            SaunaTimer.start(context, minutes)
        }
    }

    AppScaffold(
        topBar = { DetailTopBar(title = "Sauna", onBack = nav::back) },
        snackbarHost = { SnackbarHost(snackbar) },
    ) { padding ->
        val state = ui ?: return@AppScaffold
        Column(
            Modifier.fillMaxSize().padding(padding).verticalScroll(rememberScrollState()).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            when (val s = state.state) {
                is SaunaState.Running -> RunningTimer(s, onStop = { SaunaTimer.stop(context) })
                is SaunaState.Finished -> FinishedCard(s, onOk = SaunaTimer::acknowledge)
                SaunaState.Idle -> PickTime(onStart = start, onCustom = { custom = true })
            }

            HorizontalDivider(Modifier.padding(vertical = 8.dp))
            Text(
                if (state.minutesToday > 0) "Today: ${state.minutesToday} min" else "No sauna logged today",
                style = MaterialTheme.typography.titleMedium,
            )
            if (state.todayLogs.size > 1) {
                Text(
                    state.todayLogs.reversed().joinToString(" + ") { "${it.minutes}" } + " min",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                )
            }
            OutlinedButton(onClick = { byHand = true }) { Text("Log sauna time by hand") }
        }
    }

    if (custom) {
        MinutesDialog(
            title = "Custom time",
            confirmLabel = "Start",
            onConfirm = { custom = false; start(it.coerceAtMost(120)) },
            onDismiss = { custom = false },
        )
    }
    if (byHand) {
        MinutesDialog(
            title = "Log sauna time",
            confirmLabel = "Log",
            onConfirm = { byHand = false; vm.logByHand(it) },
            onDismiss = { byHand = false },
        )
    }
}

@Composable
private fun PickTime(onStart: (Int) -> Unit, onCustom: () -> Unit) {
    Text("How long?", style = MaterialTheme.typography.headlineSmall)
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
        SaunaTimer.presets.forEach { minutes ->
            Button(onClick = { onStart(minutes) }, modifier = Modifier.weight(1f).height(72.dp)) {
                Text("$minutes min", fontSize = 20.sp)
            }
        }
    }
    FilledTonalButton(onClick = onCustom, modifier = Modifier.fillMaxWidth()) { Text("Custom time") }
    Text(
        "The timer keeps running with the screen off. It plays a sound and buzzes at the end, and the minutes go into today's history.",
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant,
        textAlign = TextAlign.Center,
    )
}

@Composable
private fun RunningTimer(s: SaunaState.Running, onStop: () -> Unit) {
    val left = rememberSecondsLeft(s.endAtMillis)
    val total = s.minutes * 60f
    Box(contentAlignment = Alignment.Center, modifier = Modifier.padding(top = 16.dp)) {
        CircularProgressIndicator(
            progress = { (left / total).coerceIn(0f, 1f) },
            modifier = Modifier.size(240.dp),
            strokeWidth = 10.dp,
        )
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(formatClock(left), fontSize = 56.sp, style = MaterialTheme.typography.displayMedium)
            Text("of ${s.minutes} min", style = MaterialTheme.typography.bodyLarge, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
    OutlinedButton(onClick = onStop, modifier = Modifier.fillMaxWidth()) { Text("Stop now and log the time so far") }
}

@Composable
private fun FinishedCard(s: SaunaState.Finished, onOk: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.secondaryContainer),
    ) {
        Column(Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(if (s.stoppedEarly) "Stopped" else "Done", style = MaterialTheme.typography.headlineSmall)
            Text(
                if (s.loggedMinutes > 0) "${s.loggedMinutes} min logged for today." else "Stopped before a full minute, so nothing was logged.",
                style = MaterialTheme.typography.bodyLarge,
            )
            Button(onClick = onOk) { Text("OK") }
        }
    }
}
