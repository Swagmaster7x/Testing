package com.personal.aide.domain

import com.personal.aide.data.MeetingAnalysis
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus
import java.time.ZoneId

/** A meeting's notes as plain text with Markdown headings, for sharing to email, chat or a notes app. */
fun meetingNotesText(
    meeting: MeetingEntity,
    analysis: MeetingAnalysis?,
    tasks: List<TaskEntity>,
    zone: ZoneId = ZoneId.systemDefault(),
): String = buildString {
    append("# ").append(meeting.title).append('\n')
    append(Days.dateTime(meeting.startedAt, zone))
    val length = (meeting.endedAt ?: meeting.startedAt) - meeting.startedAt
    if (length >= 60_000) append(" · ").append(Days.duration(length))
    append('\n')
    if (meeting.attendees.isNotEmpty()) append("With: ").append(meeting.attendees.joinToString(", ")).append('\n')
    if (meeting.tldr.isNotBlank()) append('\n').append(meeting.tldr.trim()).append('\n')

    fun section(title: String, items: List<String>) {
        if (items.isEmpty()) return
        append("\n## ").append(title).append('\n')
        for (item in items) append("- ").append(item).append('\n')
    }
    section("Key points", analysis?.keyPoints.orEmpty())
    section("Decisions", analysis?.decisions.orEmpty())
    section(
        "Action items",
        tasks.filter { it.status != TaskStatus.DISMISSED }.map { task ->
            val who = when (task.ownership) {
                Ownership.MINE -> "me"
                Ownership.OTHERS -> task.owner.ifBlank { "someone else" }
                Ownership.UNCLEAR -> "owner to be confirmed"
            }
            (if (task.status == TaskStatus.DONE) "[done] " else "") + task.title + " (" + who +
                (task.dueDay?.let { ", due " + Days.mediumDate(it) } ?: "") + ")"
        },
    )
    section("Open questions", analysis?.openQuestions.orEmpty())
    section("Risks", analysis?.risks.orEmpty())
}.trimEnd()
