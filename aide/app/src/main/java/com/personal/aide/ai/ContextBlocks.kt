package com.personal.aide.ai

import com.personal.aide.calendar.CalendarEvent
import com.personal.aide.data.AideJson
import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.domain.Days
import com.personal.aide.domain.Retrieval
import com.personal.aide.domain.priorityWord
import com.personal.aide.domain.word
import java.time.ZoneId

/** Turns stored data into the text blocks that go in front of Claude. Pure functions, no I/O. */
object ContextBlocks {
    private const val MAX_TITLES = 400

    /**
     * The knowledge base as the assistant sees it: every title, so it knows what exists and doesn't
     * file duplicates, and the full text of the entries that bear on [focus], as many as fit in
     * [budgetChars]. With [focusIsLongText] the focus is a transcript and entries count when it
     * names them; otherwise it is a question and entries are ranked against it.
     */
    fun knowledge(
        entries: List<KnowledgeEntity>,
        focus: String,
        budgetChars: Int,
        focusIsLongText: Boolean,
    ): String {
        if (entries.isEmpty()) return "<knowledge_base>\nEmpty so far.\n</knowledge_base>"
        val picked = pickKnowledge(entries, focus, budgetChars, focusIsLongText)
        return buildString {
            append("<knowledge_base>\n")
            append("Saved entries (type: title):\n")
            for (entry in entries.take(MAX_TITLES)) append("- ").append(entry.type.word()).append(": ").append(entry.title).append('\n')
            if (entries.size > MAX_TITLES) append("- ...and ").append(entries.size - MAX_TITLES).append(" more\n")
            if (picked.isNotEmpty()) {
                append(if (picked.size == entries.size) "\nFull text of every entry:\n" else "\nFull text of the entries that look relevant here:\n")
                for (entry in picked) {
                    append("\n### ").append(entry.title).append(" (").append(entry.type.word()).append(")\n")
                    append(entry.content.trim()).append('\n')
                }
            }
            append("</knowledge_base>")
        }
    }

    internal fun pickKnowledge(
        entries: List<KnowledgeEntity>,
        focus: String,
        budgetChars: Int,
        focusIsLongText: Boolean,
    ): List<KnowledgeEntity> {
        val docs = entries.map { Retrieval.Doc(it, it.title, it.content) }
        val relevant = if (focusIsLongText) Retrieval.mentionedIn(focus, docs) else Retrieval.rank(focus, docs).map { it.item }
        val ordered = (relevant + entries.filter { it.pinned } + entries.sortedByDescending { it.updatedAt }).distinctBy { it.id }
        val picked = ArrayList<KnowledgeEntity>()
        var used = 0
        for (entry in ordered) {
            val cost = entry.title.length + entry.content.length + 16
            if (used + cost > budgetChars) continue
            picked += entry
            used += cost
        }
        return picked
    }

    /** One line per task: the id the assistant must refer to it by, then what it needs to weigh it. */
    fun tasks(tasks: List<TaskEntity>, today: Long, meetingTitles: Map<Long, String>, zone: ZoneId): String {
        if (tasks.isEmpty()) return "None."
        return tasks.joinToString("\n") { task ->
            buildString {
                append("- [id ").append(task.id).append("] ").append(task.title)
                if (task.owner.isNotBlank()) append(" (owner: ").append(task.owner).append(')')
                append(" | ")
                append(
                    when (val due = task.dueDay) {
                        null -> "no due date"
                        else -> "due " + Days.iso(due) + when {
                            due < today -> " (${today - due} days late)"
                            due == today -> " (today)"
                            else -> ""
                        }
                    },
                )
                task.plannedDay?.let { append(" | planned for ").append(Days.iso(it)) }
                append(" | ").append(priorityWord(task.priority)).append(" priority")
                append(" | added ").append((today - Days.ofMillis(task.createdAt, zone)).coerceAtLeast(0)).append(" days ago")
                task.meetingId?.let { id -> meetingTitles[id]?.let { append(" | from \"").append(it).append('"') } }
                if (task.details.isNotBlank()) append(" | ").append(task.details.trim().take(160))
            }
        }
    }

    fun calendar(events: List<CalendarEvent>, zone: ZoneId): String {
        if (events.isEmpty()) return "Nothing on the calendar (or the calendar isn't connected)."
        return events.joinToString("\n") { event ->
            buildString {
                append("- ").append(Days.longDate(Days.ofMillis(event.start, zone)).substringBefore(',')).append(' ')
                if (event.allDay) append("all day") else append(Days.timeOfDay(event.start, zone)).append("–").append(Days.timeOfDay(event.end, zone))
                append(": ").append(event.title)
                if (event.attendees.isNotEmpty()) append(" (with ").append(event.attendees.take(8).joinToString(", ")).append(')')
            }
        }
    }

    fun meetingLine(meeting: MeetingEntity, zone: ZoneId): String =
        "- ${Days.iso(Days.ofMillis(meeting.startedAt, zone))} \"${meeting.title}\": ${meeting.tldr.ifBlank { "(not summarized)" }}"

    /** A meeting's saved summary in full, for when a question is about it. */
    fun meetingNotes(meeting: MeetingEntity, zone: ZoneId): String {
        val analysis = analysisOf(meeting)
        return buildString {
            append("## \"").append(meeting.title).append("\" on ").append(Days.longDate(Days.ofMillis(meeting.startedAt, zone))).append('\n')
            if (meeting.attendees.isNotEmpty()) append("With: ").append(meeting.attendees.joinToString(", ")).append('\n')
            if (meeting.tldr.isNotBlank()) append(meeting.tldr.trim()).append('\n')
            section("Key points", analysis?.keyPoints)
            section("Decisions", analysis?.decisions)
            section(
                "Action items",
                analysis?.actionItems?.map { item ->
                    val who = item.owner.ifBlank { if (item.ownership == "mine") "the user" else "unassigned" }
                    item.title + " (" + who + (if (item.dueDate.isNotBlank()) ", due ${item.dueDate}" else "") + ")"
                },
            )
            section("Open questions", analysis?.openQuestions)
            section("Risks", analysis?.risks)
        }.trimEnd()
    }

    private fun StringBuilder.section(title: String, items: List<String>?) {
        if (items.isNullOrEmpty()) return
        append(title).append(":\n")
        for (item in items) append("- ").append(item).append('\n')
    }

    /** What a meeting's notes say, as plain words for searching: the stored JSON's field names would match everything. */
    fun searchText(meeting: MeetingEntity): String {
        val analysis = analysisOf(meeting) ?: return meeting.tldr
        return buildString {
            append(meeting.tldr).append(' ')
            for (line in analysis.keyPoints + analysis.decisions + analysis.openQuestions + analysis.risks) append(line).append(' ')
            for (item in analysis.actionItems) append(item.title).append(' ').append(item.owner).append(' ')
        }
    }

    fun analysisOf(meeting: MeetingEntity): MeetingAnalysis? =
        meeting.analysisJson.takeIf { it.isNotBlank() }
            ?.let { runCatching { AideJson.decodeFromString(MeetingAnalysis.serializer(), it) }.getOrNull() }
}
