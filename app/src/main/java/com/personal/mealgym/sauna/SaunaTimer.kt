package com.personal.mealgym.sauna

import android.content.Context
import android.content.Intent
import androidx.core.content.ContextCompat
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

sealed interface SaunaState {
    data object Idle : SaunaState
    data class Running(val minutes: Int, val startedAtMillis: Long, val endAtMillis: Long) : SaunaState

    /** [loggedMinutes] is 0 when it was stopped before a full minute. */
    data class Finished(val loggedMinutes: Int, val stoppedEarly: Boolean) : SaunaState
}

/** Shared state between the sauna screen and [SaunaTimerService]. */
object SaunaTimer {
    val presets = listOf(10, 15, 20)

    internal val mutableState = MutableStateFlow<SaunaState>(SaunaState.Idle)
    val state: StateFlow<SaunaState> = mutableState.asStateFlow()

    fun start(context: Context, minutes: Int) {
        val intent = Intent(context, SaunaTimerService::class.java)
            .setAction(SaunaTimerService.ACTION_START)
            .putExtra(SaunaTimerService.EXTRA_MINUTES, minutes)
        ContextCompat.startForegroundService(context, intent)
    }

    /** Stops early and logs the whole minutes done so far. */
    fun stop(context: Context) {
        context.startService(Intent(context, SaunaTimerService::class.java).setAction(SaunaTimerService.ACTION_STOP))
    }

    /** Clears the "finished" message. */
    fun acknowledge() {
        if (mutableState.value is SaunaState.Finished) mutableState.value = SaunaState.Idle
    }
}
