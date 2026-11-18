package com.personal.aide.notify

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.content.ContextCompat
import com.personal.aide.MainActivity
import com.personal.aide.R

object Notifications {
    const val CHANNEL_RECORDING = "recording"
    const val CHANNEL_UPDATES = "updates"
    const val CHANNEL_BRIEF = "brief"

    const val RECORDING_ID = 1
    const val BRIEF_ID = 2
    private const val SUMMARY_ID_BASE = 1000

    fun manager(context: Context): NotificationManager =
        context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

    fun createChannels(context: Context) {
        val manager = manager(context)
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_RECORDING, "Recording in progress", NotificationManager.IMPORTANCE_LOW).apply {
                description = "Shown while Aide is transcribing a meeting."
                setShowBadge(false)
            },
        )
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_UPDATES, "Meeting summaries", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "Tells you when a meeting's notes are ready."
            },
        )
        manager.createNotificationChannel(
            NotificationChannel(CHANNEL_BRIEF, "Morning brief", NotificationManager.IMPORTANCE_DEFAULT).apply {
                description = "A daily reminder of what is due and what is on."
            },
        )
    }

    fun canPost(context: Context): Boolean =
        Build.VERSION.SDK_INT < 33 ||
            ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED

    fun summaryReady(context: Context, meetingId: Long, title: String, tldr: String) {
        post(
            context,
            (SUMMARY_ID_BASE + meetingId % 100_000).toInt(),
            NotificationCompat.Builder(context, CHANNEL_UPDATES)
                .setSmallIcon(R.drawable.ic_stat_aide)
                .setContentTitle("Notes ready: $title")
                .setContentText(tldr)
                .setStyle(NotificationCompat.BigTextStyle().bigText(tldr))
                .setAutoCancel(true)
                .setContentIntent(openMeeting(context, meetingId))
                .build(),
        )
    }

    fun summaryFailed(context: Context, meetingId: Long, title: String, reason: String) {
        post(
            context,
            (SUMMARY_ID_BASE + meetingId % 100_000).toInt(),
            NotificationCompat.Builder(context, CHANNEL_UPDATES)
                .setSmallIcon(R.drawable.ic_stat_aide)
                .setContentTitle("Couldn't summarize: $title")
                .setContentText(reason)
                .setStyle(NotificationCompat.BigTextStyle().bigText(reason))
                .setAutoCancel(true)
                .setContentIntent(openMeeting(context, meetingId))
                .build(),
        )
    }

    fun brief(context: Context, title: String, text: String) {
        post(
            context,
            BRIEF_ID,
            NotificationCompat.Builder(context, CHANNEL_BRIEF)
                .setSmallIcon(R.drawable.ic_stat_aide)
                .setContentTitle(title)
                .setContentText(text)
                .setStyle(NotificationCompat.BigTextStyle().bigText(text))
                .setAutoCancel(true)
                .setContentIntent(
                    PendingIntent.getActivity(
                        context,
                        10,
                        Intent(context, MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
                        PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
                    ),
                )
                .build(),
        )
    }

    private fun openMeeting(context: Context, meetingId: Long): PendingIntent =
        PendingIntent.getActivity(
            context,
            (meetingId % 100_000).toInt() + 100,
            Intent(context, MainActivity::class.java)
                .setAction(MainActivity.ACTION_OPEN_MEETING)
                .putExtra(MainActivity.EXTRA_MEETING_ID, meetingId)
                .addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_CLEAR_TOP),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

    private fun post(context: Context, id: Int, notification: Notification) {
        if (!canPost(context)) return
        runCatching { manager(context).notify(id, notification) }
    }
}
