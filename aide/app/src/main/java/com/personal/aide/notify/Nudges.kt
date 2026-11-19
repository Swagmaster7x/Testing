package com.personal.aide.notify

import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.domain.Days
import com.personal.aide.domain.ellipsize
import java.time.ZoneId

/**
 * The afternoon check-in: what is still due today, and who has gone quiet on something they owe
 * the user. Worked out on the phone with no call to Claude.
 */
object Nudges {
    /** How long someone can owe the user something before it is worth a reminder. */
    const val STALE_DAYS = 5L

    /** How long to leave it before reminding about the same thing again. */
    const val REPEAT_DAYS = 7L

    data class Reminder(val title: String, val body: String)

    data class Result(
        /** Tasks due today and not done. Null when there is nothing to say. */
        val due: Reminder?,
        /** Follow-ups that have gone stale. Null when there are none worth a reminder now. */
        val waiting: Reminder?,
        /** The stale follow-ups that reminder covers, to be marked as reminded. */
        val nudged: List<TaskEntity>,
    )

    fun compose(tasks: List<TaskEntity>, today: Long, now: Long, zone: ZoneId): Result {
        val open = tasks.filter { it.status == TaskStatus.OPEN }

        val dueToday = open.filter { it.ownership == Ownership.MINE && it.dueDay == today }
            .sortedWith(compareByDescending<TaskEntity> { it.priority }.thenBy { it.createdAt })
        val due = if (dueToday.isEmpty()) {
            null
        } else {
            Reminder(
                title = if (dueToday.size == 1) "Still due today" else "${dueToday.size} still due today",
                body = dueToday.take(4).joinToString("\n") { "• " + it.title.ellipsize(70) } + if (dueToday.size > 4) "\n…and ${dueToday.size - 4} more" else "",
            )
        }

        // Stale: someone else's, and past its date or, with no date set, simply old; and not reminded about lately.
        // Something with a date still ahead of it isn't late, however long ago it was promised.
        val stale = open.filter { task ->
            if (task.ownership != Ownership.OTHERS) return@filter false
            val due = task.dueDay
            val overdue = if (due != null) due < today else today - Days.ofMillis(task.createdAt, zone) >= STALE_DAYS
            val quietSince = if (task.nudgedAt == 0L) Long.MAX_VALUE else today - Days.ofMillis(task.nudgedAt, zone)
            overdue && quietSince >= REPEAT_DAYS
        }.sortedBy { it.dueDay ?: Days.ofMillis(it.createdAt, zone) }
        val waiting = if (stale.isEmpty()) {
            null
        } else {
            val first = stale.first()
            val who = first.owner.ifBlank { "Someone" }
            Reminder(
                title = if (stale.size == 1) "$who still owes you something" else "${stale.size} follow-ups have gone quiet",
                body = stale.take(4).joinToString("\n") { task ->
                    val days = today - Days.ofMillis(task.createdAt, zone)
                    "• " + task.owner.ifBlank { "Someone" } + ": " + task.title.ellipsize(60) + " ($days days)"
                } + if (stale.size > 4) "\n…and ${stale.size - 4} more" else "",
            )
        }
        return Result(due, waiting, stale.take(4))
    }
}
