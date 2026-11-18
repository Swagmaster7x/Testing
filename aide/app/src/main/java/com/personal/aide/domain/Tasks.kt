package com.personal.aide.domain

import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus

/** The day a task belongs to on the lists: where the user or a plan put it, else when it is due. */
val TaskEntity.effectiveDay: Long? get() = plannedDay ?: dueDay

fun TaskEntity.isOverdue(today: Long): Boolean = status == TaskStatus.OPEN && (dueDay ?: Long.MAX_VALUE) < today

/** The user's open tasks and everything around them, sorted into the lists the app shows. */
data class TaskBoard(
    /** Late, due today or pinned to today, most urgent first. */
    val today: List<TaskEntity>,
    /** Monday to Sunday of the current week: the day, and what sits on it. Today's row repeats [today]. */
    val week: List<Pair<Long, List<TaskEntity>>>,
    /** Dated after this week. */
    val later: List<TaskEntity>,
    val undated: List<TaskEntity>,
    /** Other people's commitments the user is waiting on. */
    val waiting: List<TaskEntity>,
    /** The assistant could not tell whose these are. */
    val review: List<TaskEntity>,
    val doneRecently: List<TaskEntity>,
    /** How many open tasks are the user's own, across every list. */
    val openMine: Int,
)

private val urgency: Comparator<TaskEntity> =
    compareBy<TaskEntity> { it.dueDay ?: Long.MAX_VALUE }
        .thenByDescending { it.priority }
        .thenBy { it.createdAt }

fun buildTaskBoard(tasks: List<TaskEntity>, today: Long): TaskBoard {
    val open = tasks.filter { it.status == TaskStatus.OPEN }
    val mine = open.filter { it.ownership == Ownership.MINE }
    val weekStart = Days.weekStart(today)
    val weekEnd = weekStart + 6

    val todayList = mine.filter { task ->
        val day = task.effectiveDay
        // An overdue task stays on today's list even if it was planned for an earlier day.
        (day != null && day <= today) || task.isOverdue(today)
    }.sortedWith(urgency)
    val todayIds = todayList.mapTo(HashSet()) { it.id }

    val week = (weekStart..weekEnd).map { day ->
        day to when {
            day == today -> todayList
            day < today -> emptyList()
            else -> mine.filter { it.id !in todayIds && it.effectiveDay == day }.sortedWith(urgency)
        }
    }
    val later = mine.filter { it.id !in todayIds && (it.effectiveDay ?: Long.MIN_VALUE) > weekEnd }.sortedWith(urgency)
    val undated = mine.filter { it.id !in todayIds && it.effectiveDay == null }
        .sortedWith(compareByDescending<TaskEntity> { it.priority }.thenByDescending { it.createdAt })

    return TaskBoard(
        today = todayList,
        week = week,
        later = later,
        undated = undated,
        waiting = open.filter { it.ownership == Ownership.OTHERS }.sortedWith(urgency),
        review = open.filter { it.ownership == Ownership.UNCLEAR }.sortedByDescending { it.createdAt },
        doneRecently = tasks.filter { it.status == TaskStatus.DONE }
            .sortedByDescending { it.completedAt ?: 0 }
            .take(30),
        openMine = mine.size,
    )
}

fun priorityOf(word: String): Int = when (word.trim().lowercase()) {
    "high", "urgent" -> 2
    "low" -> 0
    else -> 1
}

fun priorityWord(priority: Int): String = when (priority) {
    2 -> "high"
    0 -> "low"
    else -> "normal"
}

fun ownershipOf(word: String): Ownership = when (word.trim().lowercase()) {
    "mine", "me" -> Ownership.MINE
    "others", "other" -> Ownership.OTHERS
    else -> Ownership.UNCLEAR
}
