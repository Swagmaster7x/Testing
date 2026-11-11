package com.personal.mealgym.sauna

import android.app.Notification
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.app.ServiceCompat
import androidx.lifecycle.LifecycleService
import androidx.lifecycle.lifecycleScope
import com.personal.mealgym.MainActivity
import com.personal.mealgym.MealGymApp
import com.personal.mealgym.R
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.LocalDate

/**
 * Runs the sauna countdown as a foreground service so it keeps going with the screen off.
 * At the end it logs the minutes to that day's history, plays a sound and vibrates.
 */
class SaunaTimerService : LifecycleService() {

    private var countdown: Job? = null
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        super.onStartCommand(intent, flags, startId)
        when (intent?.action) {
            ACTION_START -> start(intent.getIntExtra(EXTRA_MINUTES, 15).coerceIn(1, 120))
            ACTION_STOP -> stopEarly()
            else -> finishService()
        }
        return START_NOT_STICKY
    }

    private fun start(minutes: Int) {
        val now = System.currentTimeMillis()
        val endAt = now + minutes * 60_000L
        SaunaTimer.mutableState.value = SaunaState.Running(minutes, now, endAt)

        Alerts.createChannels(this)
        val type = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE) {
            ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE
        } else {
            0
        }
        ServiceCompat.startForeground(this, NOTIFICATION_RUNNING, runningNotification(minutes, endAt), type)
        holdWakeLock(minutes * 60_000L + 60_000L)

        countdown?.cancel()
        countdown = lifecycleScope.launch {
            delay((endAt - System.currentTimeMillis()).coerceAtLeast(0))
            complete(minutes, stoppedEarly = false)
        }
    }

    private fun stopEarly() {
        val running = SaunaTimer.state.value as? SaunaState.Running
        if (running == null) {
            finishService()
            return
        }
        countdown?.cancel()
        val minutesDone = ((System.currentTimeMillis() - running.startedAtMillis) / 60_000L).toInt()
        lifecycleScope.launch { complete(minutesDone, stoppedEarly = true) }
    }

    private suspend fun complete(minutes: Int, stoppedEarly: Boolean) {
        if (minutes > 0) {
            (application as MealGymApp).container.gym.logSauna(LocalDate.now(), minutes)
        }
        SaunaTimer.mutableState.value = SaunaState.Finished(minutes, stoppedEarly)
        if (!stoppedEarly) {
            Alerts.playSound(this)
            Alerts.vibrate(this, Alerts.saunaPattern)
            postDoneNotification(minutes)
        }
        finishService()
    }

    private fun finishService() {
        countdown?.cancel()
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        releaseWakeLock()
        stopSelf()
    }

    override fun onDestroy() {
        releaseWakeLock()
        if (SaunaTimer.state.value is SaunaState.Running) SaunaTimer.mutableState.value = SaunaState.Idle
        super.onDestroy()
    }

    private fun runningNotification(minutes: Int, endAt: Long): Notification =
        NotificationCompat.Builder(this, Alerts.CHANNEL_TIMER)
            .setSmallIcon(R.drawable.ic_timer)
            .setContentTitle("Sauna: $minutes min")
            .setContentText("Time left")
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setCategory(NotificationCompat.CATEGORY_STOPWATCH)
            .setWhen(endAt)
            .setShowWhen(true)
            .setUsesChronometer(true)
            .setChronometerCountDown(true)
            .setContentIntent(openSaunaIntent(this))
            .addAction(0, "Stop", stopIntent())
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
            .build()

    private fun postDoneNotification(minutes: Int) {
        val manager = NotificationManagerCompat.from(this)
        if (!manager.areNotificationsEnabled()) return
        val notification = NotificationCompat.Builder(this, Alerts.CHANNEL_DONE)
            .setSmallIcon(R.drawable.ic_timer)
            .setContentTitle("Sauna done")
            .setContentText("$minutes minutes logged.")
            .setAutoCancel(true)
            .setContentIntent(openSaunaIntent(this))
            .build()
        runCatching { manager.notify(NOTIFICATION_DONE, notification) }
    }

    private fun stopIntent(): PendingIntent = PendingIntent.getService(
        this,
        1,
        Intent(this, SaunaTimerService::class.java).setAction(ACTION_STOP),
        PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
    )

    private fun holdWakeLock(timeoutMillis: Long) {
        releaseWakeLock()
        val power = getSystemService(PowerManager::class.java) ?: return
        wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "MealGym:SaunaTimer").apply {
            setReferenceCounted(false)
            acquire(timeoutMillis)
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let { if (it.isHeld) it.release() }
        wakeLock = null
    }

    companion object {
        const val ACTION_START = "com.personal.mealgym.sauna.START"
        const val ACTION_STOP = "com.personal.mealgym.sauna.STOP"
        const val EXTRA_MINUTES = "minutes"
        private const val NOTIFICATION_RUNNING = 1
        private const val NOTIFICATION_DONE = 2

        fun openSaunaIntent(context: Context): PendingIntent = PendingIntent.getActivity(
            context,
            0,
            Intent(context, MainActivity::class.java)
                .putExtra(MainActivity.EXTRA_OPEN, MainActivity.OPEN_SAUNA)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT,
        )
    }
}
