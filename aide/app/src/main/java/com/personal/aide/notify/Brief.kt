package com.personal.aide.notify

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import com.personal.aide.AideApp
import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.TaskBoard
import com.personal.aide.domain.buildTaskBoard
import com.personal.aide.domain.isOverdue
import java.time.Duration
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId
import java.util.concurrent.TimeUnit

/** The morning brief: what is due, what is late and what is on, worked out on the phone with no AI call. */
object Brief {
    data class Text(val title: String, val body: String)

    /** Null when there is nothing worth a notification. */
    fun compose(tasks: List<TaskEntity>, events: List<CalendarEvent>, openQuestions: Int, today: Long, zone: ZoneId): Text? {
        val board: TaskBoard = buildTaskBoard(tasks, today)
        val late = board.today.count { it.isOverdue(today) }
        val due = board.today.size - late
        val meetings = events.filter { !it.allDay }
        if (board.today.isEmpty() && meetings.isEmpty() && board.review.isEmpty() && openQuestions == 0) return null

        val counts = buildList {
            if (due > 0) add("$due to do today")
            if (late > 0) add("$late overdue")
            if (meetings.isNotEmpty()) add(if (meetings.size == 1) "1 meeting" else "${meetings.size} meetings")
        }
        val title = if (counts.isEmpty()) "Your day" else counts.joinToString(" · ")
        val body = buildString {
            board.today.firstOrNull()?.let { append("First up: ").append(it.title).append(". ") }
            meetings.firstOrNull()?.let { append("Next meeting: ").append(it.title).append(" at ").append(Days.timeOfDay(it.start, zone)).append(". ") }
            if (board.review.isNotEmpty()) append(board.review.size).append(if (board.review.size == 1) " task needs an owner. " else " tasks need an owner. ")
            if (openQuestions > 0) append(if (openQuestions == 1) "Aide has a question for you." else "Aide has $openQuestions questions for you.")
        }.trim()
        return Text(title, body.ifEmpty { "Nothing urgent. Open Aide to plan the day." })
    }

    /** How long from [now] until the next time the clock reads [minutesAfterMidnight]. */
    fun delayUntil(minutesAfterMidnight: Int, now: LocalDateTime): Duration {
        val time = LocalTime.of(minutesAfterMidnight / 60, minutesAfterMidnight % 60)
        var next = now.toLocalDate().atTime(time)
        if (!next.isAfter(now)) next = next.plusDays(1)
        return Duration.between(now, next)
    }

    private const val WORK_NAME = "morning_brief"

    fun schedule(context: Context, enabled: Boolean, minutesAfterMidnight: Int) {
        val manager = WorkManager.getInstance(context)
        if (!enabled) {
            manager.cancelUniqueWork(WORK_NAME)
            return
        }
        val request = PeriodicWorkRequestBuilder<BriefWorker>(24, TimeUnit.HOURS)
            .setInitialDelay(delayUntil(minutesAfterMidnight, LocalDateTime.now()).toMillis(), TimeUnit.MILLISECONDS)
            .build()
        manager.enqueueUniquePeriodicWork(WORK_NAME, ExistingPeriodicWorkPolicy.CANCEL_AND_REENQUEUE, request)
    }
}

class BriefWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val container = (applicationContext as AideApp).container
        if (!container.settings.current().briefEnabled) return Result.success()
        val zone = ZoneId.systemDefault()
        val today = Days.today(zone)
        val events = container.agenda.events(Days.startMillis(today, zone), Days.startMillis(today + 1, zone))
        val questions = container.db.questions().all().count { it.status == com.personal.aide.data.db.QuestionStatus.OPEN }
        Brief.compose(container.db.tasks().all(), events, questions, today, zone)?.let {
            Notifications.brief(applicationContext, it.title, it.body)
        }
        return Result.success()
    }
}
