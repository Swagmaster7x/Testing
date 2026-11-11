package com.personal.mealgym.sauna

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.media.RingtoneManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager

/** Notification channels plus the end-of-timer sound and buzz. */
object Alerts {
    const val CHANNEL_TIMER = "sauna_timer"
    const val CHANNEL_DONE = "timer_done"

    val restPattern = longArrayOf(0, 300, 150, 300)
    val saunaPattern = longArrayOf(0, 600, 250, 600, 250, 600)

    fun createChannels(context: Context) {
        val manager = context.getSystemService(NotificationManager::class.java) ?: return
        val running = NotificationChannel(CHANNEL_TIMER, "Sauna timer", NotificationManager.IMPORTANCE_LOW).apply {
            description = "Shows the time left while the sauna timer runs."
            setShowBadge(false)
        }
        // The app plays its own sound and buzz at the end, so this channel stays quiet to avoid doubling up.
        val done = NotificationChannel(CHANNEL_DONE, "Timer finished", NotificationManager.IMPORTANCE_DEFAULT).apply {
            description = "Tells you the sauna timer has finished."
            setSound(null, null)
            enableVibration(false)
        }
        manager.createNotificationChannels(listOf(running, done))
    }

    fun vibrate(context: Context, pattern: LongArray) {
        val vibrator: Vibrator? = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            context.getSystemService(VibratorManager::class.java)?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Vibrator::class.java)
        }
        if (vibrator == null || !vibrator.hasVibrator()) return
        runCatching { vibrator.vibrate(VibrationEffect.createWaveform(pattern, -1)) }
    }

    fun playSound(context: Context) {
        runCatching {
            val uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION) ?: return
            val ringtone = RingtoneManager.getRingtone(context, uri) ?: return
            ringtone.audioAttributes = AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_NOTIFICATION_EVENT)
                .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
                .build()
            ringtone.play()
        }
    }
}
