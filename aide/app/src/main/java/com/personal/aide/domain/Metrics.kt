package com.personal.aide.domain

import com.personal.aide.data.db.ChatMessageEntity
import com.personal.aide.data.db.InsightEntity
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.QuestionEntity
import com.personal.aide.data.db.QuestionStatus
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskOrigin
import com.personal.aide.data.db.TaskStatus
import com.personal.aide.data.db.UsageEntity
import java.time.ZoneId

/**
 * How the user's work went over a stretch of days. Every number here is counted from what is
 * stored; the assistant writes the commentary but never the figures.
 */
data class WorkStats(
    val firstDay: Long,
    val lastDay: Long,
    val meetings: Int,
    val meetingMinutes: Long,
    /** The user's own tasks that first appeared in the period. */
    val created: Int,
    val completed: Int,
    /** Of those completed that had a due date: done on or before it. */
    val completedOnTime: Int,
    val completedLate: Int,
    /** Open and past due as of [lastDay] (or today, for a period still running). */
    val overdueNow: Int,
    val openNow: Int,
    /** Other people's commitments still open. */
    val waitingNow: Int,
    /** The oldest thing the user is waiting on, in days; 0 when nothing is. */
    val oldestWaitingDays: Long,
    /** Mean days from creation to completion for tasks completed in the period; null when none. */
    val averageDaysToClose: Double?,
    /** Completions per day across the period, in date order. */
    val completedByDay: List<Pair<Long, Int>>,
) {
    /** Share of dated completions that were on time; null when there were none to judge. */
    val onTimeRate: Double?
        get() = (completedOnTime + completedLate).takeIf { it > 0 }?.let { completedOnTime.toDouble() / it }

    /** Completed against created in the period: above 1 means the list is shrinking. */
    val throughput: Double? get() = created.takeIf { it > 0 }?.let { completed.toDouble() / it }
}

fun workStats(
    tasks: List<TaskEntity>,
    meetings: List<MeetingEntity>,
    firstDay: Long,
    lastDay: Long,
    today: Long,
    zone: ZoneId = ZoneId.systemDefault(),
): WorkStats {
    val from = Days.startMillis(firstDay, zone)
    val until = Days.startMillis(lastDay + 1, zone)
    val mine = tasks.filter { it.ownership == Ownership.MINE && it.status != TaskStatus.DISMISSED }
    val completed = mine.filter { it.status == TaskStatus.DONE && (it.completedAt ?: 0) in from until until }
    val dated = completed.filter { it.dueDay != null }
    val onTime = dated.count { Days.ofMillis(it.completedAt!!, zone) <= it.dueDay!! }
    val asOf = minOf(today, lastDay)
    val open = mine.filter { it.status == TaskStatus.OPEN }
    val waiting = tasks.filter { it.ownership == Ownership.OTHERS && it.status == TaskStatus.OPEN }
    // A document the user added is kept with the meetings but was never a meeting.
    val periodMeetings = meetings.filter { it.startedAt in from until until && it.status != MeetingStatus.RECORDING && it.source != MeetingSource.DOCUMENT }

    val byDay = completed.groupingBy { Days.ofMillis(it.completedAt!!, zone) }.eachCount()
    return WorkStats(
        firstDay = firstDay,
        lastDay = lastDay,
        meetings = periodMeetings.size,
        meetingMinutes = periodMeetings.sumOf { ((it.endedAt ?: it.startedAt) - it.startedAt).coerceAtLeast(0) } / 60_000,
        created = mine.count { it.createdAt in from until until },
        completed = completed.size,
        completedOnTime = onTime,
        completedLate = dated.size - onTime,
        overdueNow = open.count { (it.dueDay ?: Long.MAX_VALUE) < asOf },
        openNow = open.size,
        waitingNow = waiting.size,
        oldestWaitingDays = waiting.minOfOrNull { it.createdAt }?.let { today - Days.ofMillis(it, zone) }?.coerceAtLeast(0) ?: 0,
        averageDaysToClose = completed.takeIf { it.isNotEmpty() }
            ?.map { (it.completedAt!! - it.createdAt).coerceAtLeast(0) / 86_400_000.0 }
            ?.average(),
        completedByDay = (firstDay..lastDay).map { it to (byDay[it] ?: 0) },
    )
}

/** How well the assistant itself is doing, judged by what the user did with its work. */
data class AssistantStats(
    val summaries: Int,
    val summariesUp: Int,
    val summariesDown: Int,
    /** Tasks the assistant pulled out of meetings. */
    val tasksSuggested: Int,
    /** Of those: thrown out by the user as not a real task. */
    val tasksDismissed: Int,
    /** Of those: kept, but the user had to correct them. */
    val tasksEdited: Int,
    /** Of those: the assistant couldn't say whose they were. */
    val tasksUnclear: Int,
    val questionsAsked: Int,
    val questionsAnswered: Int,
    val answersUp: Int,
    val answersDown: Int,
    val plansUp: Int,
    val plansDown: Int,
    val knowledgeEntries: Int,
    val calls: Int,
    val failedCalls: Int,
    val inputTokens: Long,
    val outputTokens: Long,
    val estimatedCostUsd: Double,
) {
    /** Share of suggested tasks the user kept without having to fix them. */
    val taskPrecision: Double?
        get() = tasksSuggested.takeIf { it > 0 }
            ?.let { (tasksSuggested - tasksDismissed - tasksEdited).coerceAtLeast(0).toDouble() / it }

    val summaryApproval: Double?
        get() = (summariesUp + summariesDown).takeIf { it > 0 }?.let { summariesUp.toDouble() / it }

    val ratingsGiven: Int get() = summariesUp + summariesDown + answersUp + answersDown + plansUp + plansDown
}

fun assistantStats(
    meetings: List<MeetingEntity>,
    tasks: List<TaskEntity>,
    questions: List<QuestionEntity>,
    chatMessages: List<ChatMessageEntity>,
    insights: List<InsightEntity>,
    usage: List<UsageEntity>,
    knowledgeEntries: Int,
): AssistantStats {
    val summarized = meetings.filter { it.status == MeetingStatus.READY }
    val suggested = tasks.filter { it.origin == TaskOrigin.AI }
    val answers = chatMessages.filter { it.role == "assistant" }
    return AssistantStats(
        summaries = summarized.size,
        summariesUp = summarized.count { it.rating > 0 },
        summariesDown = summarized.count { it.rating < 0 },
        tasksSuggested = suggested.size,
        tasksDismissed = suggested.count { it.status == TaskStatus.DISMISSED },
        tasksEdited = suggested.count { it.edited && it.status != TaskStatus.DISMISSED },
        tasksUnclear = suggested.count { it.ownership == Ownership.UNCLEAR && it.status == TaskStatus.OPEN },
        questionsAsked = questions.size,
        questionsAnswered = questions.count { it.status == QuestionStatus.ANSWERED },
        answersUp = answers.count { it.rating > 0 },
        answersDown = answers.count { it.rating < 0 },
        plansUp = insights.count { it.rating > 0 },
        plansDown = insights.count { it.rating < 0 },
        knowledgeEntries = knowledgeEntries,
        calls = usage.size,
        failedCalls = usage.count { !it.ok },
        inputTokens = usage.sumOf { it.inputTokens + it.cacheReadTokens + it.cacheWriteTokens },
        outputTokens = usage.sumOf { it.outputTokens },
        estimatedCostUsd = usage.sumOf { Pricing.costUsd(it) },
    )
}

/**
 * List prices in US dollars per million tokens, as published in November 2026. Used only for the
 * rough "what has this cost me" figure in the app; the Claude Console has the real bill.
 */
object Pricing {
    data class Rate(val input: Double, val output: Double, val cacheRead: Double)

    private val rates = mapOf(
        "claude-opus-5-5" to Rate(4.0, 20.0, 0.20),
        "claude-sonnet-5-5" to Rate(2.0, 10.0, 0.10),
        "claude-haiku-5-5" to Rate(0.10, 0.50, 0.01),
        // Where a declined request is rerouted by the server-side fallback.
        "claude-opus-5" to Rate(5.0, 25.0, 0.50),
        "claude-opus-4-8" to Rate(5.0, 25.0, 0.50),
        "claude-sonnet-5" to Rate(2.0, 10.0, 0.20),
    )

    fun rate(model: String): Rate = rates[model] ?: rates.entries.firstOrNull { model.startsWith(it.key) }?.value
        ?: rates.getValue("claude-opus-5-5")

    fun costUsd(usage: UsageEntity): Double {
        val rate = rate(usage.model)
        return (usage.inputTokens * rate.input +
            usage.cacheWriteTokens * rate.input * 1.25 +
            usage.cacheReadTokens * rate.cacheRead +
            usage.outputTokens * rate.output) / 1_000_000.0
    }
}
