package com.personal.mealgym.gym

import android.content.Context
import com.personal.mealgym.sauna.Alerts
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

data class RestTimerState(val totalSeconds: Int, val endAtMillis: Long)

/** The between-sets rest timer. Buzzes when it runs out. */
class RestTimerController(private val context: Context, private val scope: CoroutineScope) {
    private val _state = MutableStateFlow<RestTimerState?>(null)
    val state: StateFlow<RestTimerState?> = _state.asStateFlow()
    private var job: Job? = null

    /** Buzzes at the end; [chime] also plays a sound. */
    fun start(seconds: Int, chime: Boolean = false) {
        job?.cancel()
        _state.value = RestTimerState(seconds, System.currentTimeMillis() + seconds * 1000L)
        job = scope.launch {
            delay(seconds * 1000L)
            _state.value = null
            Alerts.vibrate(context, Alerts.restPattern)
            if (chime) Alerts.playSound(context)
        }
    }

    fun cancel() {
        job?.cancel()
        _state.value = null
    }

    companion object {
        val presets = listOf(60, 90, 120, 180)
    }
}
