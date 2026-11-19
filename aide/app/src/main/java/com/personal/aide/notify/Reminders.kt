package com.personal.aide.notify

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.content.edit
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.personal.aide.AideApp
import com.personal.aide.AppContainer
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.domain.Days
import com.personal.aide.domain.People
import com.personal.aide.domain.buildPrepBrief
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.concurrent.TimeUnit

/**
 * The reminders that go off without the app being open: a brief before each calendar meeting,
 * and an afternoon check-in. Neither calls Claude; both are worked out from what is on the phone.
 */
object Reminders {
    /** How long before a meeting its brief arrives. */
    const val LEAD_MS = 10 * 60_000L

    /** How far ahead meetings are looked for; the calendar is read again well inside this. */
    private const val HORIZON_MS = 24 * 60 * 60_000L

    /** The afternoon check-in: two o'clock. */
    private const val NUDGE_MINUTES = 14 * 60

    private const val PREFS = "aide_reminders"
    private const val KEY_SCHEDULED = "scheduled"
    private const val KEY_NOTIFIED = "notified"
    private const val WORK_REFRESH = "prep_refresh"
    private const val WORK_NUDGES = "afternoon_nudges"

    /** A meeting and the moment its brief should arrive. */
    data class Alarm(val event: CalendarEvent, val at: Long) {
        /** Identifies the alarm to the system; the same meeting always gets the same number. */
        val code: Int get() = ((event.id * 31 + event.start / 60_000) % Int.MAX_VALUE).toInt()
        val mark: String get() = "${event.id}|${event.start}"
    }

    /**
     * Which of [events] should get a brief, and when. All-day events get none. A meeting less than
     * ten minutes away gets its brief straight away, unless it has already had one or is about to start.
     */
    fun plan(events: List<CalendarEvent>, now: Long, alreadyNotified: Set<String>): List<Alarm> =
        events.asSequence()
            .filter { !it.allDay && it.start > now + 60_000 }
            .map { Alarm(it, maxOf(it.start - LEAD_MS, now + 3_000)) }
            .filter { it.mark !in alreadyNotified }
            .distinctBy { it.code }
            .toList()

    /**
     * Brings the scheduled work into line with the settings. Called when the app starts and whenever
     * a setting behind it changes. [restart] re-times the afternoon check-in (after its switch is flipped).
     */
    suspend fun sync(container: AppContainer, restart: Boolean = false) {
        val context = container.appContext
        val settings = container.settings.current()
        runCatching {
            val work = WorkManager.getInstance(context)
            if (settings.prepEnabled && settings.calendarEnabled) {
                // The calendar changes during the day; look again every few hours so alarms keep up.
                work.enqueueUniquePeriodicWork(
                    WORK_REFRESH,
                    ExistingPeriodicWorkPolicy.KEEP,
                    PeriodicWorkRequestBuilder<PrepRefreshWorker>(3, TimeUnit.HOURS).build(),
                )
            } else {
                work.cancelUniqueWork(WORK_REFRESH)
            }
            if (settings.nudgesEnabled) {
                work.enqueueUniquePeriodicWork(
                    WORK_NUDGES,
                    if (restart) ExistingPeriodicWorkPolicy.CANCEL_AND_REENQUEUE else ExistingPeriodicWorkPolicy.KEEP,
                    PeriodicWorkRequestBuilder<NudgeWorker>(24, TimeUnit.HOURS)
                        .setInitialDelay(Brief.delayUntil(NUDGE_MINUTES, LocalDateTime.now()).toMillis(), TimeUnit.MILLISECONDS)
                        .build(),
                )
            } else {
                work.cancelUniqueWork(WORK_NUDGES)
            }
        }
        runCatching { refreshPrep(container) }
    }

    /** Reads the next day of the calendar and sets (or clears) one alarm per meeting. */
    suspend fun refreshPrep(container: AppContainer) {
        val context = container.appContext
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val settings = container.settings.current()
        val now = System.currentTimeMillis()
        val events = if (settings.prepEnabled && settings.calendarEnabled) container.agenda.events(now, now + HORIZON_MS) else emptyList()

        // Forget briefs for meetings that are over, so the list doesn't grow for ever.
        val notified = prefs.getStringSet(KEY_NOTIFIED, emptySet()).orEmpty()
            .filter { (it.substringAfter('|').toLongOrNull() ?: 0) > now - HORIZON_MS }.toSet()
        val alarms = plan(events, now, notified)
        val wanted = alarms.mapTo(HashSet()) { it.code }
        val manager = context.getSystemService(Context.ALARM_SERVICE) as? AlarmManager ?: return

        for (old in prefs.getStringSet(KEY_SCHEDULED, emptySet()).orEmpty()) {
            val code = old.toIntOrNull() ?: continue
            if (code !in wanted) manager.cancel(pending(context, code, null))
        }
        for (alarm in alarms) {
            val intent = pending(context, alarm.code, alarm.event)
            // Exact where the system allows it: a brief that turns up after the meeting has started is no use.
            val exact = Build.VERSION.SDK_INT < 31 || manager.canScheduleExactAlarms()
            runCatching {
                if (exact) manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, alarm.at, intent)
                else manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, alarm.at, intent)
            }
        }
        prefs.edit {
            putStringSet(KEY_SCHEDULED, wanted.mapTo(HashSet()) { it.toString() })
            putStringSet(KEY_NOTIFIED, notified)
        }
    }

    private fun pending(context: Context, code: Int, event: CalendarEvent?): PendingIntent {
        val intent = Intent(context, PrepReceiver::class.java).setAction(PrepReceiver.ACTION)
        if (event != null) {
            intent.putExtra(PrepReceiver.EXTRA_ID, event.id)
                .putExtra(PrepReceiver.EXTRA_TITLE, event.title)
                .putExtra(PrepReceiver.EXTRA_START, event.start)
                .putExtra(PrepReceiver.EXTRA_END, event.end)
                .putExtra(PrepReceiver.EXTRA_ATTENDEES, event.attendees.toTypedArray())
        }
        return PendingIntent.getBroadcast(context, code, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
    }

    /** Called when a meeting's alarm goes off: posts its brief, unless there is nothing worth saying. */
    suspend fun deliver(container: AppContainer, event: CalendarEvent) {
        val context = container.appContext
        val settings = container.settings.current()
        if (!settings.prepEnabled || !settings.calendarEnabled) return
        val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val mark = "${event.id}|${event.start}"
        if (mark in prefs.getStringSet(KEY_NOTIFIED, emptySet()).orEmpty()) return
        prefs.edit { putStringSet(KEY_NOTIFIED, prefs.getStringSet(KEY_NOTIFIED, emptySet()).orEmpty() + mark) }
        // Recording it already? Then the user needs no reminder to.
        if (container.recorder.state.value.active) return

        val profile = container.settings.currentProfile()
        val brief = buildPrepBrief(
            title = event.title,
            calendarEventId = event.id,
            start = event.start,
            attendees = event.attendees,
            self = profile.name,
            meetings = container.db.meetings().all(),
            tasks = container.db.tasks().all(),
            series = container.db.series().all(),
            entries = container.db.knowledge().all(),
        )
        // A block of time with nobody else in it, and no history, isn't a meeting to prepare for.
        if (!brief.hasHistory && People.others(event.attendees, profile.name).isEmpty()) return
        val minutes = ((event.start - System.currentTimeMillis()) / 60_000).coerceAtLeast(0)
        Notifications.prep(context, event, brief.summary(), minutes)
    }

    /** Called once a day in the afternoon. */
    suspend fun nudge(container: AppContainer) {
        if (!container.settings.current().nudgesEnabled) return
        val zone = ZoneId.systemDefault()
        val now = System.currentTimeMillis()
        val result = Nudges.compose(container.db.tasks().all(), Days.today(zone, now), now, zone)
        result.due?.let { Notifications.dueToday(container.appContext, it.title, it.body) }
        result.waiting?.let {
            Notifications.waitingOn(container.appContext, it.title, it.body)
            container.db.tasks().markNudged(result.nudged.map { task -> task.id }, now)
        }
    }
}

/** Receives a meeting's alarm ten minutes before it starts. */
class PrepReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ACTION) return
        val container = (context.applicationContext as? AideApp)?.container ?: return
        val event = CalendarEvent(
            id = intent.getLongExtra(EXTRA_ID, 0),
            title = intent.getStringExtra(EXTRA_TITLE).orEmpty(),
            start = intent.getLongExtra(EXTRA_START, 0),
            end = intent.getLongExtra(EXTRA_END, 0),
            attendees = intent.getStringArrayExtra(EXTRA_ATTENDEES)?.toList().orEmpty(),
        )
        if (event.title.isBlank() || event.start == 0L) return
        // Reading the database takes a moment; ask the system to wait for it.
        val result = goAsync()
        container.scope.launch {
            try {
                Reminders.deliver(container, event)
                Reminders.refreshPrep(container)
            } catch (_: Exception) {
                // A reminder that can't be put together is skipped; the next refresh starts clean.
            } finally {
                result.finish()
            }
        }
    }

    companion object {
        const val ACTION = "com.personal.aide.action.PREP"
        const val EXTRA_ID = "event_id"
        const val EXTRA_TITLE = "title"
        const val EXTRA_START = "start"
        const val EXTRA_END = "end"
        const val EXTRA_ATTENDEES = "attendees"
    }
}

/** Alarms are lost when the phone restarts or the app is updated; this sets them again. */
class BootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED && intent.action != Intent.ACTION_MY_PACKAGE_REPLACED) return
        val container = (context.applicationContext as? AideApp)?.container ?: return
        val result = goAsync()
        container.scope.launch {
            try {
                Reminders.sync(container)
            } catch (_: Exception) {
                // Nothing to set them from; the next time the app opens it tries again.
            } finally {
                result.finish()
            }
        }
    }
}

/** Re-reads the calendar every few hours so the alarms follow changes to it. */
class PrepRefreshWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val container = (applicationContext as? AideApp)?.container ?: return Result.success()
        runCatching { Reminders.refreshPrep(container) }
        return Result.success()
    }
}

/** The afternoon check-in. */
class NudgeWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val container = (applicationContext as? AideApp)?.container ?: return Result.success()
        runCatching { Reminders.nudge(container) }
        return Result.success()
    }
}
