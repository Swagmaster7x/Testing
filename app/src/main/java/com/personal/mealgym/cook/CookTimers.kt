package com.personal.mealgym.cook

import android.Manifest
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import com.personal.mealgym.MainActivity
import com.personal.mealgym.R
import com.personal.mealgym.sauna.Alerts
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicLong

/** One kitchen timer. It stays in the list as [done] until it's dismissed, so a finished one isn't missed. */
data class CookTimer(
    val id: Long,
    /** "Step 3 · Pollo guisado" */
    val label: String,
    val totalSeconds: Int,
    val endAtMillis: Long,
    val done: Boolean = false,
)

/**
 * Timers started from recipe steps; several can run at once. They live with the app, not the
 * screen, so they keep counting while you look at another step or another recipe. They are
 * meant for cooking with the app open (cooking mode keeps the screen on); nothing here keeps
 * the phone awake the way the sauna timer's service does.
 */
class CookTimerController(private val context: Context, private val scope: CoroutineScope) {
    private val _timers = MutableStateFlow<List<CookTimer>>(emptyList())
    val timers: StateFlow<List<CookTimer>> = _timers.asStateFlow()
    // Started and stopped from the screen, finished from the timer's own coroutine.
    private val jobs = ConcurrentHashMap<Long, Job>()
    private val nextId = AtomicLong(1)

    /** Buzzes at the end; [chime] also plays a sound. Returns the timer's id. */
    fun start(label: String, seconds: Int, chime: Boolean, now: Long = System.currentTimeMillis()): Long {
        val id = nextId.getAndIncrement()
        _timers.update { it + CookTimer(id, label, seconds, now + seconds * 1000L) }
        jobs[id] = scope.launch {
            delay(seconds * 1000L)
            finish(id, chime)
        }
        return id
    }

    private fun finish(id: Long, chime: Boolean) {
        val timer = _timers.value.firstOrNull { it.id == id } ?: return
        _timers.update { list -> list.map { if (it.id == id) it.copy(done = true) else it } }
        jobs.remove(id)
        Alerts.vibrate(context, Alerts.saunaPattern)
        if (chime) Alerts.playSound(context)
        notifyDone(timer)
    }

    /** Stops a running timer or clears a finished one. */
    fun dismiss(id: Long) {
        jobs.remove(id)?.cancel()
        _timers.update { list -> list.filter { it.id != id } }
        runCatching { NotificationManagerCompat.from(context).cancel(NOTIFICATION_BASE + (id % 1000).toInt()) }
    }

    /** A heads-up if the cook has wandered to another screen. Only when notifications are allowed. */
    private fun notifyDone(timer: CookTimer) {
        val manager = NotificationManagerCompat.from(context)
        val allowed = Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED
        if (!allowed || !manager.areNotificationsEnabled()) return
        val open = PendingIntent.getActivity(
            context,
            2,
            Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
        val notification = NotificationCompat.Builder(context, Alerts.CHANNEL_DONE)
            .setSmallIcon(R.drawable.ic_timer)
            .setContentTitle("Timer done")
            .setContentText(timer.label)
            .setAutoCancel(true)
            .setContentIntent(open)
            .build()
        runCatching { manager.notify(NOTIFICATION_BASE + (timer.id % 1000).toInt(), notification) }
    }

    private companion object {
        const val NOTIFICATION_BASE = 4000
    }
}
