package com.personal.aide.domain

import com.personal.aide.ai.ContextBlocks
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingSource
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.SeriesEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import java.time.ZoneId

/**
 * What to have in your head walking into a meeting, put together from what the app already
 * holds: no call to Claude, so it can be shown the instant a reminder fires.
 */
data class PrepBrief(
    val title: String,
    val start: Long,
    /** The other people invited. */
    val attendees: List<String>,
    /** The recurring meeting this is an occurrence of, when known. */
    val series: SeriesEntity?,
    /** The last time this meeting was held, with notes. */
    val last: MeetingEntity?,
    val lastDecisions: List<String>,
    val lastOpenQuestions: List<String>,
    /** Open tasks that came out of earlier meetings in the series. */
    val carriedOver: List<TaskEntity>,
    /** Open tasks the attendees took on, from anywhere. */
    val theyOwe: List<TaskEntity>,
    /** The user's own open tasks that involve the attendees, from anywhere. */
    val openWithThem: List<TaskEntity>,
) {
    val hasHistory: Boolean get() = last != null || carriedOver.isNotEmpty() || theyOwe.isNotEmpty() || openWithThem.isNotEmpty()

    /** A couple of lines for the reminder notification. */
    fun summary(zone: ZoneId = ZoneId.systemDefault()): String {
        if (!hasHistory) return "Nothing on record for this one yet. Tap to open Aide and record it."
        return buildString {
            if (last != null) {
                append("Last time (").append(Days.mediumDate(Days.ofMillis(last.startedAt, zone))).append("): ")
                append(last.tldr.ifBlank { last.title }.ellipsize(160)).append(' ')
            }
            val mine = (carriedOver.filter { it.ownership == Ownership.MINE } + openWithThem).distinctBy { it.id }
            val theirs = (carriedOver.filter { it.ownership == Ownership.OTHERS } + theyOwe).distinctBy { it.id }
            if (mine.isNotEmpty()) append("You still owe: ").append(mine.first().title.ellipsize(60)).append(if (mine.size > 1) " and ${mine.size - 1} more. " else ". ")
            if (theirs.isNotEmpty()) append("Owed to you: ").append(theirs.first().title.ellipsize(60)).append(if (theirs.size > 1) " and ${theirs.size - 1} more." else ".")
        }.trim()
    }
}

fun buildPrepBrief(
    title: String,
    calendarEventId: Long?,
    start: Long,
    attendees: List<String>,
    self: String,
    meetings: List<MeetingEntity>,
    tasks: List<TaskEntity>,
    series: List<SeriesEntity>,
    entries: List<KnowledgeEntity>,
): PrepBrief {
    val everyone = entries.filter { it.type == KnowledgeType.PERSON }.map { it.title }
    val others = People.others(attendees, self)
    val key = knowledgeKey(title)
    val past = meetings.filter { it.startedAt < start && it.source != MeetingSource.DOCUMENT }.sortedByDescending { it.startedAt }

    // The series this belongs to: the one recorded from this calendar event, else one with the same name.
    val match = calendarEventId?.let { id -> series.firstOrNull { it.calendarEventId == id } }
        ?: series.firstOrNull { it.key == key }
        ?: calendarEventId?.let { id -> past.firstOrNull { it.calendarEventId == id }?.seriesId }?.let { id -> series.firstOrNull { it.id == id } }
    val earlier = when {
        match != null -> past.filter { it.seriesId == match.id }
        // No series yet: a meeting from the same event, or with the same name, is still "last time".
        else -> past.filter { (calendarEventId != null && it.calendarEventId == calendarEventId) || (key.isNotEmpty() && knowledgeKey(it.title) == key) }
    }
    val last = earlier.firstOrNull { it.status == MeetingStatus.READY }
    val analysis = last?.let { ContextBlocks.analysisOf(it) }
    val earlierIds = earlier.mapTo(HashSet()) { it.id }

    val open = tasks.filter { it.status == TaskStatus.OPEN }
    val carried = open.filter { it.meetingId in earlierIds && it.ownership != Ownership.UNCLEAR }.sortedBy { it.dueDay ?: Long.MAX_VALUE }
    val carriedIds = carried.mapTo(HashSet()) { it.id }
    return PrepBrief(
        title = title,
        start = start,
        attendees = others,
        series = match,
        last = last,
        lastDecisions = analysis?.decisions.orEmpty(),
        lastOpenQuestions = analysis?.openQuestions.orEmpty(),
        carriedOver = carried,
        theyOwe = open.filter { task -> task.id !in carriedIds && task.ownership == Ownership.OTHERS && others.any { People.same(it, task.owner, everyone) } }
            .sortedBy { it.dueDay ?: Long.MAX_VALUE },
        openWithThem = open.filter { task ->
            task.id !in carriedIds && task.ownership == Ownership.MINE &&
                others.any { People.mentioned(task.title + " " + task.details, it, everyone) }
        }.sortedBy { it.dueDay ?: Long.MAX_VALUE },
    )
}
