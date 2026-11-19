package com.personal.aide.notify

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.IBinder
import android.os.PowerManager
import androidx.core.app.NotificationCompat
import androidx.core.app.ServiceCompat
import androidx.core.content.ContextCompat
import com.personal.aide.AideApp
import com.personal.aide.MainActivity
import com.personal.aide.R
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Keeps the app going while Claude is writing notes or reading pages.
 *
 * That takes from several seconds to a few minutes, and people don't sit and watch: they save
 * their notes and go back to whatever they were doing. Android freezes an app within seconds of
 * it leaving the screen unless it has said, with a notification, that it is in the middle of
 * something, and a frozen app's connection to Claude is cut off part-way. This service is that
 * notification. It holds no logic of its own: it stays up while the app is busy and goes when
 * the work is done.
 */
class WorkService : Service() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var wakeLock: PowerManager.WakeLock? = null
    private var watcher: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val container = (application as? AideApp)?.container
        // Shown at once whatever happens next: a service started this way must put its notification up promptly.
        foreground()
        if (container == null || !container.busy.value) {
            stopForegroundAndSelf()
            return START_NOT_STICKY
        }
        acquireWakeLock()
        if (watcher == null) {
            watcher = scope.launch {
                container.busy.collect { working ->
                    if (!working) {
                        // One piece of work often follows straight on from another (pages read, then notes written).
                        delay(LINGER_MS)
                        if (!container.busy.value) stopForegroundAndSelf()
                    }
                }
            }
        }
        return START_NOT_STICKY
    }

    /** Android 15 allows this kind of service a set number of hours a day; when they run out it must go quietly. */
    override fun onTimeout(startId: Int, fgsType: Int) {
        stopForegroundAndSelf()
    }

    private fun foreground() {
        val type = if (Build.VERSION.SDK_INT >= 29) ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC else 0
        runCatching { ServiceCompat.startForeground(this, Notifications.WORK_ID, notification(), type) }
    }

    private fun notification(): Notification =
        NotificationCompat.Builder(this, Notifications.CHANNEL_WORK)
            .setSmallIcon(R.drawable.ic_stat_aide)
            .setContentTitle("Aide is working")
            .setContentText("Claude is writing up what you added. You can carry on with something else.")
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setProgress(0, 0, true)
            .setCategory(NotificationCompat.CATEGORY_PROGRESS)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_DEFERRED)
            .setContentIntent(
                PendingIntent.getActivity(
                    this,
                    40,
                    Intent(this, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
                ),
            )
            .build()

    private fun stopForegroundAndSelf() {
        releaseWakeLock()
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun acquireWakeLock() {
        if (wakeLock?.isHeld == true) return
        val power = getSystemService(Context.POWER_SERVICE) as? PowerManager ?: return
        wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "aide:working").apply {
            setReferenceCounted(false)
            // Long enough for the longest document; never left held if something goes wrong.
            runCatching { acquire(MAX_AWAKE_MS) }
        }
    }

    private fun releaseWakeLock() {
        wakeLock?.let { lock -> if (lock.isHeld) runCatching { lock.release() } }
        wakeLock = null
    }

    override fun onDestroy() {
        scope.cancel()
        releaseWakeLock()
        super.onDestroy()
    }

    companion object {
        private const val LINGER_MS = 1_500L
        private const val MAX_AWAKE_MS = 30 * 60_000L

        /**
         * Brings the service up because work has begun. Android only allows this while the app is
         * on screen or the user has just acted on it, which is when work begins; if it is refused
         * the work carries on regardless, as it always did.
         */
        fun start(context: Context) {
            runCatching { ContextCompat.startForegroundService(context, Intent(context, WorkService::class.java)) }
        }
    }
}
