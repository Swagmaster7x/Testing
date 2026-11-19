package com.personal.aide.domain

import com.personal.aide.data.db.KnowledgeEntity
import com.personal.aide.data.db.KnowledgeType
import com.personal.aide.data.db.MeetingEntity
import com.personal.aide.data.db.MeetingStatus
import com.personal.aide.data.db.Ownership
import com.personal.aide.data.db.TaskEntity
import com.personal.aide.data.db.TaskStatus

/**
 * Working out who a name refers to. Names reach the app from several places (a calendar invite,
 * the assistant's notes, something the user typed), so "Dana", "Dana Whitfield" and "dana
 * whitfield" must come out as one person, without "Dan" becoming Dana or one Chris becoming
 * another.
 */
object People {
    /** A hyphen inside a word: "Anne-Marie" is one first name, not a first and a middle one. */
    private val joiningHyphen = Regex("(?<=\\p{L})[-\u2010\u2011](?=\\p{L})")

    private fun fold(text: String): String = knowledgeKey(text.replace(joiningHyphen, ""))

    private fun words(name: String): List<String> = fold(name).split(' ').filter { it.isNotEmpty() }

    /**
     * Whether [name] means [person]. The full names match, or one of them is a bare first name
     * that matches the other's and, among [everyone] the app knows of, belongs to nobody else.
     */
    fun same(person: String, name: String, everyone: Collection<String> = emptyList()): Boolean {
        val a = words(person)
        val b = words(name)
        if (a.isEmpty() || b.isEmpty()) return false
        if (a == b) return true
        val (short, long) = if (a.size <= b.size) a to b else b to a
        if (short.size != 1 || long.size == 1 || short[0] != long[0]) return false
        // A first name on its own is only safe when nobody else known has it: with a Chris Park on
        // record, a bare "Chris" is not to be taken for Chris Evans.
        return everyone.map { words(it) }.none { it.size > 1 && it[0] == short[0] && it != long }
    }

    /** Whether [text] names [person]: their full name, or their first name when nobody else known shares it. */
    fun mentioned(text: String, person: String, everyone: Collection<String> = emptyList()): Boolean {
        val name = words(person)
        if (name.isEmpty()) return false
        val tokens = fold(text).split(' ')
        if (name.size == 1) return name[0] in tokens
        for (start in 0..tokens.size - name.size) {
            if (tokens.subList(start, start + name.size) == name) return true
        }
        val first = name[0]
        if (first.length < 3 || first !in tokens) return false
        return everyone.map { words(it) }.none { it.size > 1 && it[0] == first && it != name }
    }

    /** [names] with the user themselves taken out. */
    fun others(names: List<String>, self: String): List<String> =
        if (self.isBlank()) names else names.filterNot { same(self, it) }
}

/** Everything the app holds about one person, gathered for their page. */
data class PersonView(
    val name: String,
    /** What the knowledge base says about them, if they have an entry. */
    val entry: KnowledgeEntity?,
    /** Open tasks they took on. */
    val theyOwe: List<TaskEntity>,
    /** The user's own open tasks that involve them. */
    val openWithThem: List<TaskEntity>,
    /** Meetings they were in, newest first. */
    val meetings: List<MeetingEntity>,
) {
    val lastMet: Long? get() = meetings.firstOrNull()?.startedAt

    /** A number that stands for this person where one is needed as a key. */
    val number: Long get() = entry?.id ?: (knowledgeKey(name).hashCode().toLong() or (1L shl 40))
}

fun buildPersonView(
    name: String,
    entries: List<KnowledgeEntity>,
    tasks: List<TaskEntity>,
    meetings: List<MeetingEntity>,
    /** The user's own name: a calendar invite lists them among the people in the meeting. */
    self: String = "",
): PersonView {
    val people = entries.filter { it.type == KnowledgeType.PERSON }
    val everyone = people.map { it.title }
    val entry = people.firstOrNull { knowledgeKey(it.title) == knowledgeKey(name) } ?: people.firstOrNull { People.same(it.title, name, everyone) }
    val full = entry?.title ?: name.trim()
    val theirMeetings = meetings
        .filter { it.status == MeetingStatus.READY || it.status == MeetingStatus.TRANSCRIBED }
        .filter { meeting -> meeting.attendees.any { People.same(full, it, everyone) } || People.mentioned(meeting.title, full, everyone) }
        .sortedByDescending { it.startedAt }
    // A meeting with them and nobody else: whatever came out of it is between the two of you.
    val oneToOnes = theirMeetings.filter { People.others(it.attendees, self).size == 1 }.mapTo(HashSet()) { it.id }
    val open = tasks.filter { it.status == TaskStatus.OPEN }
    return PersonView(
        name = full,
        entry = entry,
        theyOwe = open.filter { it.ownership == Ownership.OTHERS && People.same(full, it.owner, everyone) }
            .sortedBy { it.dueDay ?: Long.MAX_VALUE },
        openWithThem = open.filter { task ->
            task.ownership == Ownership.MINE && (
                People.mentioned(task.title + " " + task.details + " " + task.evidence, full, everyone) || task.meetingId in oneToOnes
                )
        }.sortedBy { it.dueDay ?: Long.MAX_VALUE },
        meetings = theirMeetings,
    )
}
