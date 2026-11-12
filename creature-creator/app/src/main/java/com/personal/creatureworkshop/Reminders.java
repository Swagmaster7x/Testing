package com.personal.creatureworkshop;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

/**
 * Local reminders ("your runs are back", "your daily gift is ready"). The game asks for one to be
 * shown at a time in the future; Android wakes this receiver then, and it posts the notification.
 * Nothing is sent over the network. Reminders set before the phone restarts are lost, which is fine:
 * the game sets them again the next time it is opened.
 */
public class Reminders extends BroadcastReceiver {
    private static final String CHANNEL = "reminders";
    private static final int[] IDS = {1, 2};

    private static PendingIntent alarm(Context c, int id, String title, String text) {
        Intent i = new Intent(c, Reminders.class).putExtra("id", id).putExtra("title", title).putExtra("text", text);
        return PendingIntent.getBroadcast(c, id, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    static void schedule(Context c, int id, long atMillis, String title, String text) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null || atMillis <= System.currentTimeMillis()) return;
        am.set(AlarmManager.RTC_WAKEUP, atMillis, alarm(c, id, title, text));     // inexact: needs no special permission
    }

    static void cancelAll(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        for (int id : IDS) {
            if (am != null) am.cancel(alarm(c, id, "", ""));
            if (nm != null) nm.cancel(id);
        }
    }

    @Override
    public void onReceive(Context c, Intent intent) {
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (Build.VERSION.SDK_INT >= 26) {
            nm.createNotificationChannel(new NotificationChannel(CHANNEL, c.getString(R.string.reminders_channel), NotificationManager.IMPORTANCE_DEFAULT));
        }
        PendingIntent open = PendingIntent.getActivity(c, 0, new Intent(c, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification.Builder b = Build.VERSION.SDK_INT >= 26 ? new Notification.Builder(c, CHANNEL) : new Notification.Builder(c);
        b.setSmallIcon(R.drawable.ic_notify).setContentTitle(intent.getStringExtra("title")).setContentText(intent.getStringExtra("text"))
                .setContentIntent(open).setAutoCancel(true);
        try {
            nm.notify(intent.getIntExtra("id", 1), b.build());     // silently does nothing if the player has not allowed notifications
        } catch (SecurityException ignored) {
            // Permission was withdrawn.
        }
    }
}
