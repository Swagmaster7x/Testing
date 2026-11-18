package com.personal.aide.transcribe

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
import com.personal.aide.notify.Notifications
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.flow.distinctUntilChangedBy
import kotlinx.coroutines.launch

/**
 * Keeps a recording alive while the app is in the background or the screen is off. The service
 * holds no recording logic of its own: it shows the "recording" notification the system requires
 * for microphone use, keeps the processor awake, and follows the [Recorder]'s state.
 */
class RecordingService : Service() {
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private var wakeLock: PowerManager.WakeLock? = null
    private var watcher: Job? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val recorder = (application as AideApp).container.recorder
        when (intent?.action) {
            ACTION_STOP -> recorder.stop()
            ACTION_PAUSE -> recorder.pause()
            ACTION_RESUME -> recorder.resume()
        }
        val state = recorder.state.value
        if (!state.active) {
            // Nothing to keep alive (a stale notification button, or the system restarting the service).
            foreground(notification(RecorderState()))
            stopForegroundAndSelf()
            return START_NOT_STICKY
        }
        foreground(notification(state))
        acquireWakeLock()
        if (watcher == null) {
            watcher = scope.launch {
                recorder.state.distinctUntilChangedBy { it.phase to it.title }.collect { current ->
                    if (current.active) {
                        Notifications.manager(this@RecordingService).notify(Notifications.RECORDING_ID, notification(current))
                    } else {
                        stopForegroundAndSelf()
                    }
                }
            }
        }
        return START_NOT_STICKY
    }

    private fun foreground(notification: Notification) {
        val type = if (Build.VERSION.SDK_INT >= 30) ServiceInfo.FOREGROUND_SERVICE_TYPE_MICROPHONE else 0
        runCatching { ServiceCompat.startForeground(this, Notifications.RECORDING_ID, notification, type) }
    }

    private fun stopForegroundAndSelf() {
        releaseWakeLock()
        ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE)
        stopSelf()
    }

    private fun notification(state: RecorderState): Notification {
        val open = PendingIntent.getActivity(
            this,
            0,
            Intent(this, MainActivity::class.java)
                .setAction(MainActivity.ACTION_OPEN_RECORDING)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val paused = state.phase == RecorderState.Phase.PAUSED
        val builder = NotificationCompat.Builder(this, Notifications.CHANNEL_RECORDING)
            .setSmallIcon(R.drawable.ic_stat_mic)
            .setContentTitle(if (paused) "Recording paused" else "Aide is transcribing")
            .setContentText(state.title.ifBlank { "Tap to open the live transcript" })
            .setContentIntent(open)
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .setForegroundServiceBehavior(NotificationCompat.FOREGROUND_SERVICE_IMMEDIATE)
        if (state.active) {
            builder.setUsesChronometer(!paused)
            builder.setWhen(System.currentTimeMillis() - state.elapsed(System.currentTimeMillis()))
            builder.addAction(
                0,
                if (paused) "Resume" else "Pause",
                servicePendingIntent(if (paused) ACTION_RESUME else ACTION_PAUSE, 1),
            )
            builder.addAction(0, "Stop & save", servicePendingIntent(ACTION_STOP, 2))
        }
        return builder.build()
    }

    private fun servicePendingIntent(action: String, requestCode: Int): PendingIntent =
        PendingIntent.getService(
            this,
            requestCode,
            Intent(this, RecordingService::class.java).setAction(action),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

    private fun acquireWakeLock() {
        if (wakeLock?.isHeld == true) return
        val power = getSystemService(Context.POWER_SERVICE) as? PowerManager ?: return
        wakeLock = power.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "aide:recording").apply {
            setReferenceCounted(false)
            runCatching { acquire(Recorder.MAX_LENGTH_MS + 60_000L) }
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
        const val ACTION_START = "com.personal.aide.action.START"
        const val ACTION_STOP = "com.personal.aide.action.STOP"
        const val ACTION_PAUSE = "com.personal.aide.action.PAUSE"
        const val ACTION_RESUME = "com.personal.aide.action.RESUME"

        /** Brings the service up for a recording that has just started. Call from the foreground. */
        fun start(context: Context) {
            runCatching {
                ContextCompat.startForegroundService(context, Intent(context, RecordingService::class.java).setAction(ACTION_START))
            }
        }
    }
}
